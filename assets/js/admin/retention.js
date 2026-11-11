/**
 * GDPR retention — runs when the admin logs in.
 *
 *  1. Bookings older than RETENTION.bookingDays are ARCHIVED, then DELETED:
 *     their outcome (visit / cancellation / no-show, date, service) is added to
 *     the customer's card and to the anonymous monthly statistics, in the same
 *     atomic write as the deletion (so nothing is counted twice or lost).
 *  2. Customer cards with no activity for RETENTION.customerYears are deleted.
 *
 * Messages ("Demande particulière") are never archived.
 */
import { RETENTION, COLLECTIONS } from '../config.js';
import { addDaysStr, todayStr, toDateStr } from '../utils/dates.js';
import { state, fetchBookingsBefore, commitGroups, fetchAll, setSettings } from '../db.js';
import {
  customerKey, newCard, applyToCard, newMonthStats, applyToStats, buildProfiles,
} from './customers.js';

export const bookingCutoff = () => addDaysStr(-RETENTION.bookingDays);

export function customerExpiryDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - RETENTION.customerYears);
  return toDateStr(d);
}

const strip = ({ _id, ...data }) => data;

/** What a clean-up would do right now: { old: [bookings], expired: [cards] }. */
export async function planCleanup() {
  const old = await fetchBookingsBefore(bookingCutoff());
  const expiry = customerExpiryDate();
  const { profiles } = buildProfiles(state.customers, state.bookings);
  const expired = state.customers.filter(c =>
    (c.lastActivity || '') < expiry && !profiles.get(c._id)?.live.length);
  return { old, expired };
}

/** Archive + delete old bookings, delete expired cards. Returns a summary. */
export async function runCleanup({ old, expired }) {
  const cards = new Map(state.customers.map(c => [c._id, structuredClone(c)]));
  const stats = new Map(state.stats.map(s => [s._id, structuredClone(s)]));
  const groups = [];

  const sorted = [...old].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  for (const b of sorted) {
    const outcome = b.status === 'cancelled' ? 'cancelled' : b.noShow ? 'noshow' : 'visit';
    const group = [];

    const key = customerKey(b, [...cards.values()]);
    if (key) {
      const card = cards.get(key) || Object.assign(newCard(), { _id: key });
      card.services = card.services || {};
      card.history = card.history || [];
      applyToCard(card, b, outcome);
      cards.set(key, card);
      group.push({ op: 'set', col: COLLECTIONS.customers, id: key, data: strip(card) });
    }

    const month = b.date.slice(0, 7);
    const s = stats.get(month) || Object.assign(newMonthStats(), { _id: month });
    applyToStats(s, b, outcome);
    stats.set(month, s);
    group.push({ op: 'set', col: COLLECTIONS.stats, id: month, data: strip(s) });

    group.push({ op: 'delete', col: COLLECTIONS.bookings, id: b._fid });
    group.push({ op: 'delete', col: COLLECTIONS.slots, id: b._fid });
    groups.push(group);
  }

  for (const c of expired) {
    groups.push([{ op: 'delete', col: COLLECTIONS.customers, id: c._id }]);
  }

  await commitGroups(groups);
  await setSettings({ retentionEnabled: true, lastCleanup: todayStr() });
  return { archived: old.length, expired: expired.length };
}

/** GDPR "right to erasure": delete a customer's card and all her bookings. */
export async function deleteCustomerData(key) {
  const old = await fetchBookingsBefore(bookingCutoff());
  const all = [...state.bookings, ...old];
  const { keyOf } = buildProfiles(state.customers, all);
  const ops = [{ op: 'delete', col: COLLECTIONS.customers, id: key }];
  for (const b of all) {
    if (keyOf.get(b._fid) !== key) continue;
    ops.push({ op: 'delete', col: COLLECTIONS.bookings, id: b._fid });
    ops.push({ op: 'delete', col: COLLECTIONS.slots, id: b._fid });
  }
  await commitGroups([ops]);
  return (ops.length - 1) / 2;   // bookings deleted
}

/** Offer a JSON file for download (backup / data export). */
export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Full backup of bookings, customer cards and statistics. */
export async function downloadBackup() {
  const [bookings, customers, stats] = await Promise.all([
    fetchAll(COLLECTIONS.bookings), fetchAll(COLLECTIONS.customers), fetchAll(COLLECTIONS.stats),
  ]);
  const clean = list => list.map(x => {
    const out = { ...x };
    if (out.createdAt?.toDate) out.createdAt = out.createdAt.toDate().toISOString();
    return out;
  });
  downloadJson(`atelier-achi-sauvegarde-${todayStr()}.json`, {
    exportedAt: new Date().toISOString(),
    bookings: clean(bookings), customers: clean(customers), stats,
  });
}
