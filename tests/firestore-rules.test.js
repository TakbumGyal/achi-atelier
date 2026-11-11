/**
 * Security-rules tests. Run with:  npm install && npm run test:rules
 * (needs Java; starts a local Firestore emulator — never touches live data).
 */
import { test, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment, assertSucceeds, assertFails,
} from '@firebase/rules-unit-testing';
import {
  doc, getDoc, getDocs, collection, setDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp,
} from 'firebase/firestore';

let env;
const ADMIN = 'admin-uid';
const STRANGER = 'random-user';

const pad = n => String(n).padStart(2, '0');
const day = offset => {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const booking = (over = {}) => ({
  first: 'Sophie', last: 'Martin', email: 'sophie@example.com', phone: '0102030405',
  service: 'Manucure spa', dur: 30, price: '35€', date: day(3), time: '11:00', msg: '',
  status: 'confirmed', source: 'website', createdAt: serverTimestamp(), ...over,
});
const slotOf = b => ({ date: b.date, time: b.time, dur: b.dur });

/* Create booking + slot together, like the website does. */
async function book(db, id, b = booking(), slot = slotOf(b)) {
  const batch = writeBatch(db);
  batch.set(doc(db, 'bookings', id), b);
  if (slot) batch.set(doc(db, 'slots', id), slot);
  return batch.commit();
}

const anon = () => env.unauthenticatedContext().firestore();
const admin = () => env.authenticatedContext(ADMIN).firestore();
const stranger = () => env.authenticatedContext(STRANGER).firestore();

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'achirestaurant-dd2b5',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});
after(() => env.cleanup());
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'admins', ADMIN), {});
    await setDoc(doc(db, 'bookings', 'existing'), { ...booking(), createdAt: new Date() });
    await setDoc(doc(db, 'slots', 'existing'), slotOf(booking()));
    await setDoc(doc(db, 'settings', 'config'), { blockToday: false });
  });
});

/* ── Public visitor ── */

test('public can read availability and settings', async () => {
  await assertSucceeds(getDocs(collection(anon(), 'slots')));
  await assertSucceeds(getDoc(doc(anon(), 'settings', 'config')));
});

test('public CANNOT read customer bookings', async () => {
  await assertFails(getDocs(collection(anon(), 'bookings')));
  await assertFails(getDoc(doc(anon(), 'bookings', 'existing')));
});

test('a logged-in non-admin CANNOT read bookings', async () => {
  await assertFails(getDocs(collection(stranger(), 'bookings')));
});

test('public CANNOT read the admins list', async () => {
  await assertFails(getDoc(doc(anon(), 'admins', ADMIN)));
});

test('public can book (booking + slot together)', async () => {
  await assertSucceeds(book(anon(), 'b1'));
});

test('public booking without its slot is rejected', async () => {
  await assertFails(book(anon(), 'b2', booking(), null));
});

test('a slot alone (no booking) is rejected', async () => {
  await assertFails(setDoc(doc(anon(), 'slots', 'fake'), { date: day(3), time: '12:00', dur: 30 }));
});

test('slot that does not match its booking is rejected', async () => {
  const b = booking();
  await assertFails(book(anon(), 'b3', b, { ...slotOf(b), time: '15:00' }));
});

test('invalid bookings are rejected', async () => {
  const bad = {
    'past date': { date: day(-5) },
    'pretends to be admin': { source: 'admin' },
    'already cancelled': { status: 'cancelled' },
    'bad email': { email: 'not-an-email' },
    'empty name': { first: '' },
    'huge name': { first: 'x'.repeat(500) },
    'huge message': { msg: 'x'.repeat(5000) },
    'bad time': { time: '25h' },
    'duration not a number': { dur: '30' },
    'client-chosen createdAt': { createdAt: new Date('2020-01-01') },
  };
  for (const [name, over] of Object.entries(bad)) {
    const b = booking(over);
    await assertFails(book(anon(), 'bad-' + name.replace(/\W/g, ''), b), name);
  }
  // extra unexpected field
  await assertFails(book(anon(), 'extra', { ...booking(), isVip: true }));
});

test('public CANNOT modify or delete anything', async () => {
  const db = anon();
  await assertFails(updateDoc(doc(db, 'bookings', 'existing'), { status: 'cancelled' }));
  await assertFails(deleteDoc(doc(db, 'bookings', 'existing')));
  await assertFails(deleteDoc(doc(db, 'slots', 'existing')));
  await assertFails(updateDoc(doc(db, 'slots', 'existing'), { time: '19:00' }));
  await assertFails(setDoc(doc(db, 'settings', 'config'), { blockToday: true }));
  await assertFails(setDoc(doc(db, 'settings', 'config'), { blockToday: true, source: 'admin' }));
  await assertFails(setDoc(doc(db, 'admins', 'me'), {}));
});

test('a logged-in non-admin CANNOT cancel or change settings', async () => {
  const db = stranger();
  await assertFails(updateDoc(doc(db, 'bookings', 'existing'), { status: 'cancelled' }));
  await assertFails(setDoc(doc(db, 'settings', 'config'), { blockToday: true }));
  await assertFails(setDoc(doc(db, 'admins', STRANGER), {}));
});

test('unknown collections are closed', async () => {
  await assertFails(setDoc(doc(anon(), 'anything', 'x'), { a: 1 }));
  await assertFails(getDocs(collection(anon(), 'anything')));
});

/* ── Admin ── */

test('admin can read bookings', async () => {
  await assertSucceeds(getDocs(collection(admin(), 'bookings')));
});

test('admin can cancel (update booking + delete slot)', async () => {
  const db = admin();
  const batch = writeBatch(db);
  batch.update(doc(db, 'bookings', 'existing'), { status: 'cancelled' });
  batch.delete(doc(db, 'slots', 'existing'));
  await assertSucceeds(batch.commit());
});

test('admin can add a booking, including a past date', async () => {
  await assertSucceeds(book(admin(), 'a1', booking({ source: 'admin', date: day(-1), email: '' })));
});

test('admin can block today', async () => {
  await assertSucceeds(setDoc(doc(admin(), 'settings', 'config'), { blockToday: true }, { merge: true }));
});

test('admin can repair a missing slot', async () => {
  await assertSucceeds(setDoc(doc(admin(), 'slots', 'existing'), slotOf(booking())));
});

test('customer cards and stats: public and non-admins locked out', async () => {
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), 'customers', 'email:sophie'), { first: 'Sophie', visits: 3 });
    await setDoc(doc(ctx.firestore(), 'stats', '2026-10'), { visits: 12 });
  });
  for (const db of [anon(), stranger()]) {
    await assertFails(getDoc(doc(db, 'customers', 'email:sophie')));
    await assertFails(getDocs(collection(db, 'customers')));
    await assertFails(setDoc(doc(db, 'customers', 'email:x'), { visits: 99 }));
    await assertFails(deleteDoc(doc(db, 'customers', 'email:sophie')));
    await assertFails(getDocs(collection(db, 'stats')));
    await assertFails(setDoc(doc(db, 'stats', '2026-10'), { visits: 0 }));
  }
});

test('admin can manage customer cards and stats, and archive a booking', async () => {
  const db = admin();
  await assertSucceeds(getDocs(collection(db, 'customers')));
  await assertSucceeds(getDocs(collection(db, 'stats')));
  const batch = writeBatch(db);
  batch.set(doc(db, 'customers', 'email:sophie'), { first: 'Sophie', visits: 1 });
  batch.set(doc(db, 'stats', '2026-10'), { visits: 1 });
  batch.delete(doc(db, 'bookings', 'existing'));
  batch.delete(doc(db, 'slots', 'existing'));
  await assertSucceeds(batch.commit());
  await assertSucceeds(updateDoc(doc(db, 'customers', 'email:sophie'), { visits: 2 }));
  await assertSucceeds(deleteDoc(doc(db, 'customers', 'email:sophie')));
});

test('admin can mark a no-show', async () => {
  await assertSucceeds(updateDoc(doc(admin(), 'bookings', 'existing'), { noShow: true }));
  await assertFails(updateDoc(doc(anon(), 'bookings', 'existing'), { noShow: true }));
});

test('admin can read own admin doc but cannot write admins', async () => {
  await assertSucceeds(getDoc(doc(admin(), 'admins', ADMIN)));
  await assertFails(setDoc(doc(admin(), 'admins', 'new-admin'), {}));
});
