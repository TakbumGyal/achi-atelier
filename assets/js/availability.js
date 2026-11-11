/**
 * Booking-availability rules: which slots are free on a given day.
 * Works only from the public `slots` (no customer data needed).
 */
import { SALON } from './config.js';
import { todayStr, nowMins, toMins, minsToTime, weekdayOf } from './utils/dates.js';
import { state } from './db.js';

export const isClosedDay = ds => weekdayOf(ds) === SALON.closedWeekday;

/** Number of booked slots overlapping [time, time + dur) on day `ds`. */
function overlapCount(ds, time, dur) {
  const start = toMins(time), end = start + dur;
  return state.slots.filter(s =>
    s.date === ds && start < toMins(s.time) + s.dur && end > toMins(s.time),
  ).length;
}

export const isTaken = (ds, time, dur) => overlapCount(ds, time, dur) >= SALON.maxCapacity;

/** True if the slot is in the past, or today is blocked by the admin. */
export function isPastSlot(ds, time) {
  const today = todayStr();
  if (ds > today) return false;
  if (ds < today) return true;
  if (state.blockToday) return true;
  return toMins(time) < nowMins();
}

/**
 * Every free start time on day `ds` for a service lasting `dur` minutes.
 * Walks the opening hours in small steps so gaps left by cancellations or
 * shorter services can still be filled.
 */
export function availableSlots(ds, dur) {
  const step = Math.min(dur, SALON.slotStepMin);
  const slots = [];
  for (let m = SALON.openMin; m + dur <= SALON.closeMin; m += step) {
    const time = minsToTime(m);
    if (!isTaken(ds, time, dur) && !isPastSlot(ds, time)) slots.push(time);
  }
  return slots;
}
