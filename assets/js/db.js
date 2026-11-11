/**
 * Firestore data layer. Keeps a live copy of bookings + settings in `state`
 * and notifies subscribers when anything changes.
 *
 * The Firebase SDK is loaded lazily, so if it fails to load the rest of the
 * site (menu, gallery, navigation) keeps working.
 */
import {
  FIREBASE_CONFIG, FIREBASE_SDK_URL, BOOKINGS_COLLECTION, SETTINGS_DOC, SALON,
} from './config.js';
import { addDaysStr } from './utils/dates.js';

export const state = {
  bookings: [],
  nextId: 1,
  blockToday: false,   // admin switch: no more online bookings for today
  loaded: false,       // first snapshot received
};

const listeners = new Set();
/** fn(type) is called with 'bookings', 'settings' or 'error'. */
export const subscribe = fn => listeners.add(fn);
const emit = type => listeners.forEach(fn => fn(type));

let fs = null;   // firestore module
let db = null;   // firestore instance

export async function connect() {
  try {
    const [{ initializeApp }, firestore] = await Promise.all([
      import(FIREBASE_SDK_URL + 'firebase-app.js'),
      import(FIREBASE_SDK_URL + 'firebase-firestore.js'),
    ]);
    fs = firestore;
    db = fs.getFirestore(initializeApp(FIREBASE_CONFIG));
  } catch (err) {
    console.error('Firebase failed to load:', err);
    emit('error');
    return;
  }

  /* Bookings: last N days + everything in the future, in real time. */
  const since = addDaysStr(-SALON.historyDays);
  const q = fs.query(fs.collection(db, BOOKINGS_COLLECTION), fs.where('date', '>=', since));
  fs.onSnapshot(q, snap => {
    state.bookings = snap.docs.map(d => ({ _fid: d.id, ...d.data() }));
    state.nextId = state.bookings.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
    state.loaded = true;
    emit('bookings');
  }, err => {
    console.error('Firestore bookings listener error:', err);
    emit('error');
  });

  /* Site settings (e.g. "block today's bookings"). */
  fs.onSnapshot(fs.doc(db, ...SETTINGS_DOC), snap => {
    state.blockToday = snap.exists() ? !!snap.data().blockToday : false;
    emit('settings');
  }, err => console.warn('Firestore settings listener error:', err));
}

function requireDb() {
  if (!db) throw new Error('Database not connected');
}

/** Save a new booking. `bk.source` defaults to 'website'. */
export async function addBooking(bk) {
  requireDb();
  const data = { ...bk, source: bk.source || 'website', createdAt: new Date().toISOString() };
  const ref = await fs.addDoc(fs.collection(db, BOOKINGS_COLLECTION), data);
  state.nextId = Math.max(state.nextId, bk.id + 1);
  return ref.id;
}

export async function cancelBooking(id) {
  requireDb();
  const b = state.bookings.find(x => x.id === id);
  if (!b?._fid) return;
  await fs.updateDoc(fs.doc(db, BOOKINGS_COLLECTION, b._fid), { status: 'cancelled', source: 'admin' });
}

export async function setBlockToday(value) {
  requireDb();
  await fs.setDoc(fs.doc(db, ...SETTINGS_DOC),
    { blockToday: !!value, source: 'admin', updatedAt: new Date().toISOString() },
    { merge: true });
}
