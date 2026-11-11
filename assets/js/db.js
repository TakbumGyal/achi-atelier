/**
 * Firebase data layer (Firestore + Auth).
 *
 *   Everyone        → live `slots` (public availability, no personal data)
 *                     and `settings`.
 *   Logged-in admin → additionally the live `bookings` with customer details.
 *
 * Subscribers are notified with: 'slots', 'settings', 'bookings', 'auth', 'error'.
 * The Firebase SDK is loaded lazily, so if it fails the rest of the site still works.
 */
import {
  FIREBASE_CONFIG, FIREBASE_SDK_URL, COLLECTIONS, SETTINGS_DOC, SALON, USE_EMULATOR,
} from './config.js';
import { todayStr, addDaysStr } from './utils/dates.js';

export const state = {
  slots: [],          // [{ _id, date, time, dur }] from today on
  bookings: [],       // admin only: [{ _fid, first, last, … }]
  blockToday: false,  // admin switch: no more online bookings for today
  loaded: false,      // first slots snapshot received
  admin: null,        // signed-in admin user, or null
};

const listeners = new Set();
export const subscribe = fn => listeners.add(fn);
const emit = type => listeners.forEach(fn => fn(type));

let fs = null, authMod = null;   // SDK modules
let db = null, auth = null;      // instances
let stopBookings = null;

export async function connect() {
  try {
    const [{ initializeApp }, firestore, authModule] = await Promise.all([
      import(FIREBASE_SDK_URL + 'firebase-app.js'),
      import(FIREBASE_SDK_URL + 'firebase-firestore.js'),
      import(FIREBASE_SDK_URL + 'firebase-auth.js'),
    ]);
    fs = firestore;
    authMod = authModule;
    const app = initializeApp(FIREBASE_CONFIG);
    db = fs.getFirestore(app);
    auth = authMod.getAuth(app);
    if (USE_EMULATOR) {
      fs.connectFirestoreEmulator(db, '127.0.0.1', 8080);
      authMod.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      console.info('Using Firebase emulators');
    }
  } catch (err) {
    console.error('Firebase failed to load:', err);
    emit('error');
    return;
  }

  /* Public availability, in real time. */
  const slotsQuery = fs.query(fs.collection(db, COLLECTIONS.slots), fs.where('date', '>=', todayStr()));
  fs.onSnapshot(slotsQuery, snap => {
    state.slots = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    state.loaded = true;
    emit('slots');
  }, err => {
    console.error('Slots listener error:', err);
    emit('error');
  });

  /* Site settings ("block today's bookings"). */
  fs.onSnapshot(fs.doc(db, ...SETTINGS_DOC), snap => {
    state.blockToday = snap.exists() ? !!snap.data().blockToday : false;
    emit('settings');
  }, err => console.warn('Settings listener error:', err));

  authMod.onAuthStateChanged(auth, handleAuthChange);
}

/* ─── Admin auth ─── */

async function handleAuthChange(user) {
  stopBookings?.();
  stopBookings = null;
  state.bookings = [];
  state.admin = null;

  if (user) {
    const adminDoc = await fs.getDoc(fs.doc(db, COLLECTIONS.admins, user.uid)).catch(() => null);
    if (adminDoc?.exists()) {
      state.admin = user;
      listenToBookings();
    } else {
      await authMod.signOut(auth);   // signed in, but not an admin
    }
  }
  emit('auth');
}

function listenToBookings() {
  const since = addDaysStr(-SALON.historyDays);
  const q = fs.query(fs.collection(db, COLLECTIONS.bookings), fs.where('date', '>=', since));
  let synced = false;
  stopBookings = fs.onSnapshot(q, { includeMetadataChanges: true }, snap => {
    state.bookings = snap.docs.map(d => ({ _fid: d.id, ...d.data() }));
    emit('bookings');
    // Repair slots once, from the server's full list (not a partial local cache).
    if (!synced && !snap.metadata.fromCache) {
      synced = true;
      syncSlots().catch(err => console.warn('Slot sync failed:', err));
    }
  }, err => console.error('Bookings listener error:', err));
}

/**
 * Sign in an admin. Resolves to 'ok', 'invalid' (wrong email/password)
 * or 'not-admin' (valid account without an admins/{uid} document).
 */
export async function signIn(email, password) {
  if (!auth) throw new Error('Not connected');
  try {
    const { user } = await authMod.signInWithEmailAndPassword(auth, email, password);
    const adminDoc = await fs.getDoc(fs.doc(db, COLLECTIONS.admins, user.uid));
    return adminDoc.exists() ? 'ok' : 'not-admin';
  } catch (err) {
    console.warn('Sign-in failed:', err.code || err);
    return 'invalid';
  }
}

export const signOut = () => auth && authMod.signOut(auth);

/* ─── Writes ─── */

function requireDb() {
  if (!db) throw new Error('Database not connected');
}

/**
 * Create a booking and its public slot atomically.
 * `bk` = { first, last, email, phone, service, dur, price, date, time, msg }.
 */
export async function createBooking(bk, source = 'website') {
  requireDb();
  const ref = fs.doc(fs.collection(db, COLLECTIONS.bookings));
  const batch = fs.writeBatch(db);
  batch.set(ref, { ...bk, status: 'confirmed', source, createdAt: fs.serverTimestamp() });
  batch.set(fs.doc(db, COLLECTIONS.slots, ref.id), { date: bk.date, time: bk.time, dur: bk.dur });
  await batch.commit();
  return ref.id;
}

/** Admin: mark a booking cancelled and free its slot. */
export async function cancelBooking(fid) {
  requireDb();
  const batch = fs.writeBatch(db);
  batch.update(fs.doc(db, COLLECTIONS.bookings, fid), { status: 'cancelled' });
  batch.delete(fs.doc(db, COLLECTIONS.slots, fid));
  await batch.commit();
}

export async function setBlockToday(value) {
  requireDb();
  await fs.setDoc(fs.doc(db, ...SETTINGS_DOC),
    { blockToday: !!value, updatedAt: fs.serverTimestamp() },
    { merge: true });
}

/**
 * Admin: make sure every upcoming active booking has a public slot and
 * cancelled ones don't. Repairs bookings made before slots existed.
 */
async function syncSlots() {
  const today = todayStr();
  const slotIds = new Set(state.slots.map(s => s._id));
  const batch = fs.writeBatch(db);
  let changes = 0;
  for (const b of state.bookings) {
    if (b.date < today || changes >= 450) continue;
    const active = b.status !== 'cancelled';
    if (active && !slotIds.has(b._fid)) {
      batch.set(fs.doc(db, COLLECTIONS.slots, b._fid), { date: b.date, time: b.time, dur: b.dur });
      changes++;
    } else if (!active && slotIds.has(b._fid)) {
      batch.delete(fs.doc(db, COLLECTIONS.slots, b._fid));
      changes++;
    }
  }
  if (changes) {
    await batch.commit();
    console.info(`Slot sync: ${changes} slot(s) updated`);
  }
}
