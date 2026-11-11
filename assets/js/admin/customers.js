/**
 * Customer cards — pure logic (no Firebase, no DOM).
 *
 * A customer's full picture = her card (history archived from bookings older
 * than 30 days) + her bookings still in the database (last 30 days + future),
 * counted live. So counts are always up to date.
 *
 * Customers are recognised by email, or by phone when there is no email.
 */
import { RETENTION } from '../config.js';
import { todayStr, nowMins, toMins, weekdayOf } from '../utils/dates.js';

export const normEmail = e => (e || '').trim().toLowerCase();

/** '+33 6 12 34 56 78' and '06.12.34.56.78' → '0612345678'. */
export function normPhone(p) {
  let d = (p || '').replace(/\D/g, '');
  if (d.startsWith('0033')) d = d.slice(2);
  if (d.startsWith('33') && d.length === 11) d = '0' + d.slice(2);
  return d.length >= 6 ? d : '';
}

/** Card id for a booking (email first, else phone), or null if neither is known. */
export function customerKey(b, customers) {
  const email = normEmail(b.email);
  if (email) return 'email:' + encodeURIComponent(email);
  const phone = normPhone(b.phone);
  if (!phone) return null;
  const match = customers.find(c => normPhone(c.phone) === phone);
  return match ? match._id : 'tel:' + phone;
}

/** Has the appointment finished? */
export function isPast(b, today = todayStr(), now = nowMins()) {
  return b.date < today || (b.date === today && toMins(b.time) + (b.dur || 0) <= now);
}

/** 'cancelled' | 'noshow' | 'visit' | 'upcoming' */
export function outcomeOf(b) {
  if (b.status === 'cancelled') return 'cancelled';
  if (b.noShow) return 'noshow';
  return isPast(b) ? 'visit' : 'upcoming';
}

const byDateTime = (a, b) => (a.date + a.time).localeCompare(b.date + b.time);

export function newCard() {
  return {
    first: '', last: '', email: '', phone: '',
    visits: 0, cancellations: 0, noShows: 0,
    firstVisit: '', lastVisit: '', lastActivity: '',
    services: {}, history: [],
  };
}

/**
 * Add one booking's outcome to a card (mutates `card`).
 * Used both for archiving (permanent) and for live summaries (in memory).
 * Only dates and services are recorded — never the message (may hold health info).
 */
export function applyToCard(card, b, outcome) {
  if (b.date >= (card.lastActivity || '')) {
    card.first = b.first || card.first;
    card.last = b.last || card.last;
    card.email = b.email || card.email;
    card.phone = b.phone || card.phone;
  }
  if (outcome === 'visit') {
    card.visits++;
    card.services[b.service] = (card.services[b.service] || 0) + 1;
    if (!card.firstVisit || b.date < card.firstVisit) card.firstVisit = b.date;
    if (b.date > card.lastVisit) card.lastVisit = b.date;
  }
  if (outcome === 'cancelled') card.cancellations++;
  if (outcome === 'noshow') card.noShows++;
  if (outcome !== 'upcoming' && b.date > (card.lastActivity || '')) card.lastActivity = b.date;
  card.history.push({ date: b.date, service: b.service, outcome });
  if (card.history.length > RETENTION.historyMax) card.history.splice(0, card.history.length - RETENTION.historyMax);
  return card;
}

/** Anonymous monthly statistics (mutates `s`). */
export function newMonthStats() {
  return { bookings: 0, visits: 0, cancellations: 0, noShows: 0, revenue: 0, services: {}, weekdays: [0, 0, 0, 0, 0, 0, 0] };
}

export const priceOf = b => parseFloat(String(b.price || '').replace(',', '.')) || 0;

export function applyToStats(s, b, outcome) {
  s.bookings++;
  if (outcome === 'visit') {
    s.visits++;
    s.revenue += priceOf(b);
    s.services[b.service] = (s.services[b.service] || 0) + 1;
    s.weekdays[weekdayOf(b.date)]++;
  }
  if (outcome === 'cancelled') s.cancellations++;
  if (outcome === 'noshow') s.noShows++;
  return s;
}

/**
 * Combine stored cards with live bookings.
 * Returns { profiles: Map(key → profile), keyOf: Map(bookingId → key) }.
 * profile = { key, card (stored or null), live: [bookings], summary: card-like totals + upcoming }.
 */
export function buildProfiles(customers, bookings) {
  const profiles = new Map();
  const keyOf = new Map();
  const get = key => {
    if (!profiles.has(key)) profiles.set(key, { key, card: null, live: [] });
    return profiles.get(key);
  };
  customers.forEach(c => { get(c._id).card = c; });
  [...bookings].sort(byDateTime).forEach(b => {
    const key = customerKey(b, customers);
    if (!key) return;
    keyOf.set(b._fid, key);
    get(key).live.push(b);
  });

  for (const p of profiles.values()) {
    const base = p.card ? structuredClone(p.card) : newCard();
    base.services = { ...(base.services || {}) };
    base.history = [...(base.history || [])];
    const summary = Object.assign(newCard(), base, { upcoming: 0 });
    for (const b of p.live) {
      const outcome = outcomeOf(b);
      applyToCard(summary, b, outcome);
      if (outcome === 'upcoming') summary.upcoming++;
    }
    summary.history.sort((a, b) => b.date.localeCompare(a.date));   // newest first
    p.summary = summary;
  }
  return { profiles, keyOf };
}

/**
 * Which visit this booking is for its customer (1 = first ever visit).
 * Returns null for cancelled / no-show bookings or unknown customers.
 */
export function visitNumber({ profiles, keyOf }, b) {
  const p = profiles.get(keyOf.get(b._fid));
  if (!p || b.status === 'cancelled' || b.noShow) return null;
  const archived = p.card?.visits || 0;
  const earlierLive = p.live.filter(x => byDateTime(x, b) < 0 && outcomeOf(x) === 'visit').length;
  return archived + earlierLive + 1;
}

export const profileFor = ({ profiles, keyOf }, b) => profiles.get(keyOf.get(b._fid)) || null;
