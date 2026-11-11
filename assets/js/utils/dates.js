/* Date helpers. Dates are handled as local 'YYYY-MM-DD' strings and
   times as 'HH:MM' strings, matching what is stored in Firestore. */

const pad = n => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' in local time (avoids the UTC off-by-one around midnight in Paris). */
export function toDateStr(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const todayStr = () => toDateStr();

/** Date string `n` days from today (negative for the past). */
export function addDaysStr(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function nowMins() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

export function toMins(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const minsToTime = mins => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

export const weekdayOf = ds => new Date(ds + 'T12:00:00').getDay();

/** '2026-11-11' → '11 nov. 2026' using the given month abbreviations. */
export function formatDateStr(ds, monthAbbr) {
  if (!ds) return '';
  const [y, m, d] = ds.split('-');
  return `${parseInt(d, 10)} ${monthAbbr[parseInt(m, 10) - 1]} ${y}`;
}

/** 30 → '30 min', 60 → '1h', 70 → '1h10'. */
export function formatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h${pad(m)}` : `${h}h`;
}
