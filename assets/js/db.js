/**
 * Firebase data layer (Firestore + Auth). The only module that talks to Firebase.
 *
 *   Everyone        → live `slots` (public availability, no personal data)
 *                     and `settings`.
 *   Logged-in admin → additionally live `bookings` (last 30 days + future),
 *                     `customers` (customer cards) and `stats` (monthly numbers).
 *
 * Subscribers are notified with:
 *   'slots', 'settings', 'bookings', 'customers', 'stats', 'admin-ready', 'auth', 'error'.
 * The Firebase SDK is loaded lazily, so if it fails the rest of the site still works.
 */
import {
  FIREBASE_CONFIG, FIREBASE_SDK_URL, COLLECTIONS, SETTINGS_DOC, RETENTION, USE_EMULATOR,
} from './config.js';
import { todayStr, addDaysStr } from './utils/dates.js';

export const state = {
  slots: [],              // [{ _id, date, time, dur }] from today on
  blockToday: false,      // admin switch: no more online bookings for today
  retentionEnabled: false,// automatic GDPR clean-up switched on (after first run)
  loaded: false,          // first slots snapshot received
  admin: null,            // signed-in admin user, or null
  // admin only:
  bookings: [],           // [{ _fid, first, last, … }] — last 30 days + future
  customers: [],          // [{ _id, first, last, visits, … }]
  stats: [],              // [{ _id: 'YYYY-MM', visits, … }]
  adminReady: false,      // bookings (from server), customers and stats all loaded
};

const listeners = new Set();
export const subscribe = fn => listeners.add(fn);
const emit = type => listeners.forEach(fn => fn(type));

let fs = null, authMod = null;   // SDK modules
let app = null, db = null, auth = null;   // instances
let stopAdmin = [];
let connecting = null, authStarting = null;

/** Start Firestore (availability + settings). Safe to call more than once. */
export function connect() {
  connecting ||= doConnect();
  return connecting;
}

async function doConnect() {
  try {
    const [{ initializeApp }, firestore] = await Promise.all([
      import(FIREBASE_SDK_URL + 'firebase-app.js'),
      import(FIREBASE_SDK_URL + 'firebase-firestore.js'),
    ]);
    fs = firestore;
    app = initializeApp(FIREBASE_CONFIG);
    db = fs.getFirestore(app);
    if (USE_EMULATOR) {
      fs.connectFirestoreEmulator(db, '127.0.0.1', 8080);
      console.info('Using Firebase emulators');
    }
  } catch (err) {
    console.error('Firebase failed to load:', err);
    emit('error');
    throw err;
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

  /* Site settings. */
  fs.onSnapshot(fs.doc(db, ...SETTINGS_DOC), snap => {
    const data = snap.exists() ? snap.data() : {};
    state.blockToday = !!data.blockToday;
    state.retentionEnabled = !!data.retentionEnabled;
    emit('settings');
  }, err => console.warn('Settings listener error:', err));
}

/* ─── Admin auth ─── */

/**
 * Load Firebase Auth — only when someone opens the admin area, so normal
 * visitors never download it. Resolves once the saved login (if any) is known.
 */
export function initAuth() {
  authStarting ||= (async () => {
    await connect();
    authMod = await import(FIREBASE_SDK_URL + 'firebase-auth.js');
    auth = authMod.getAuth(app);
    if (USE_EMULATOR) authMod.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    const firstCheck = new Promise(resolve => {
      let first = true;
      authMod.onAuthStateChanged(auth, async user => {
        await handleAuthChange(user);
        if (first) { first = false; resolve(); }
      });
    });
    await firstCheck;
  })();
  authStarting.catch(() => { authStarting = null; });
  return authStarting;
}

async function handleAuthChange(user) {
  stopAdmin.forEach(stop => stop());
  stopAdmin = [];
  Object.assign(state, { admin: null, bookings: [], customers: [], stats: [], adminReady: false });

  if (user) {
    const adminDoc = await fs.getDoc(fs.doc(db, COLLECTIONS.admins, user.uid)).catch(() => null);
    if (adminDoc?.exists()) {
      state.admin = user;
      listenToAdminData();
    } else {
      await authMod.signOut(auth);   // signed in, but not an admin
    }
  }
  emit('auth');
}

/** Live admin data. Emits 'admin-ready' once everything came from the server. */
function listenToAdminData() {
  const loaded = { bookings: false, customers: false, stats: false };
  const markLoaded = (key, snap) => {
    if (loaded[key] || snap.metadata.fromCache) return;
    loaded[key] = true;
    if (Object.values(loaded).every(Boolean)) {
      state.adminReady = true;
      syncSlots()
        .catch(err => console.warn('Slot sync failed:', err))
        .finally(() => emit('admin-ready'));
    }
  };

  const since = addDaysStr(-RETENTION.bookingDays);
  const bookingsQ = fs.query(fs.collection(db, COLLECTIONS.bookings), fs.where('date', '>=', since));
  stopAdmin.push(fs.onSnapshot(bookingsQ, { includeMetadataChanges: true }, snap => {
    state.bookings = snap.docs.map(d => ({ _fid: d.id, ...d.data() }));
    emit('bookings');
    markLoaded('bookings', snap);
  }, err => console.error('Bookings listener error:', err)));

  stopAdmin.push(fs.onSnapshot(fs.collection(db, COLLECTIONS.customers), { includeMetadataChanges: true }, snap => {
    state.customers = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    emit('customers');
    markLoaded('customers', snap);
  }, err => console.error('Customers listener error:', err)));

  stopAdmin.push(fs.onSnapshot(fs.collection(db, COLLECTIONS.stats), { includeMetadataChanges: true }, snap => {
    state.stats = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    emit('stats');
    markLoaded('stats', snap);
  }, err => console.error('Stats listener error:', err)));
}

/**
 * Sign in an admin. Resolves to 'ok', 'invalid' (wrong email/password)
 * or 'not-admin' (valid account without an admins/{uid} document).
 */
export async function signIn(email, password) {
  await initAuth();
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

/* Writes need Firestore loaded; it normally is already (started on page load). */

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

/** Admin: mark / unmark a past booking as a no-show. */
export async function setNoShow(fid, value) {
  requireDb();
  await fs.updateDoc(fs.doc(db, COLLECTIONS.bookings, fid), { noShow: !!value });
}

export async function setSettings(values) {
  requireDb();
  await fs.setDoc(fs.doc(db, ...SETTINGS_DOC), { ...values, updatedAt: fs.serverTimestamp() }, { merge: true });
}

export const setBlockToday = value => setSettings({ blockToday: !!value });

/**
 * Admin: apply many writes. Each op = { op: 'set' | 'delete', col, id, data }.
 * Ops are grouped in `groups` (arrays); each group is committed atomically,
 * so related writes (e.g. "count a visit" + "delete the booking") never split.
 */
export async function commitGroups(groups) {
  requireDb();
  const MAX = 450;
  let batch = fs.writeBatch(db), size = 0;
  for (const group of groups) {
    if (size + group.length > MAX && size > 0) {
      await batch.commit();
      batch = fs.writeBatch(db);
      size = 0;
    }
    for (const { op, col, id, data } of group) {
      const ref = fs.doc(db, col, id);
      if (op === 'set') batch.set(ref, data);
      else if (op === 'delete') batch.delete(ref);
    }
    size += group.length;
  }
  if (size) await batch.commit();
}

/** Admin: bookings dated strictly before `date` (already past the retention period). */
export async function fetchBookingsBefore(date) {
  requireDb();
  const q = fs.query(fs.collection(db, COLLECTIONS.bookings), fs.where('date', '<', date));
  const snap = await fs.getDocs(q);
  return snap.docs.map(d => ({ _fid: d.id, ...d.data() }));
}

/** Admin: every document of a collection (used for the backup file). */
export async function fetchAll(col) {
  requireDb();
  const snap = await fs.getDocs(fs.collection(db, col));
  return snap.docs.map(d => ({ _id: d.id, ...d.data() }));
}

/**
 * Admin: make sure every upcoming active booking has a public slot and
 * cancelled ones don't. Repairs bookings made before slots existed.
 */
async function syncSlots() {
  const today = todayStr();
  const slotIds = new Set(state.slots.map(s => s._id));
  const ops = [];
  for (const b of state.bookings) {
    if (b.date < today) continue;
    const active = b.status !== 'cancelled';
    if (active && !slotIds.has(b._fid)) {
      ops.push({ op: 'set', col: COLLECTIONS.slots, id: b._fid, data: { date: b.date, time: b.time, dur: b.dur } });
    } else if (!active && slotIds.has(b._fid)) {
      ops.push({ op: 'delete', col: COLLECTIONS.slots, id: b._fid });
    }
  }
  if (ops.length) {
    await commitGroups(ops.map(op => [op]));
    console.info(`Slot sync: ${ops.length} slot(s) updated`);
  }
}
