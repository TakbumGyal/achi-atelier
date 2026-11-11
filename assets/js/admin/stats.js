/**
 * Admin "Statistiques" view — anonymous numbers only.
 * Archived monthly stats (from cleaned-up bookings) + live bookings.
 */
import { $, esc } from '../utils/dom.js';
import { state } from '../db.js';
import { todayStr } from '../utils/dates.js';
import { newMonthStats, applyToStats, outcomeOf } from './customers.js';

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];   // index = getDay()
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const monthLabel = key => { const [y, m] = key.split('-'); return `${MONTHS[+m - 1]} ${y}`; };
const euros = n => `${Math.round(n).toLocaleString('fr-FR')} €`;

function prevMonth(key, n = 1) {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 - n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Map 'YYYY-MM' → stats, archived + live. */
function allMonths() {
  const months = new Map(state.stats.map(({ _id, ...s }) =>
    [_id, Object.assign(newMonthStats(), structuredClone(s))]));
  for (const b of state.bookings) {
    const key = b.date.slice(0, 7);
    if (!months.has(key)) months.set(key, newMonthStats());
    applyToStats(months.get(key), b, outcomeOf(b));
  }
  return months;
}

function delta(now, before) {
  if (!before) return '';
  const pct = Math.round(((now - before) / before) * 100);
  if (!pct) return '<span class="st-delta">=</span>';
  return `<span class="st-delta ${pct > 0 ? 'up' : 'down'}">${pct > 0 ? '▲' : '▼'} ${Math.abs(pct)}%</span>`;
}

function bars(entries, max) {
  return entries.map(([label, n]) => `<div class="st-bar">
      <span class="st-bar-lbl">${esc(label)}</span>
      <span class="st-bar-track"><span class="st-bar-fill" style="width:${max ? (n / max) * 100 : 0}%"></span></span>
      <span class="st-bar-n">${n}</span>
    </div>`).join('');
}

export function renderStats() {
  const months = allMonths();
  const cur = todayStr().slice(0, 7), prev = prevMonth(cur);
  const a = months.get(cur) || newMonthStats();
  const b = months.get(prev) || newMonthStats();
  const last12 = Array.from({ length: 12 }, (_, i) => prevMonth(cur, i));

  const kpis = [
    ['Rendez-vous', a.bookings - a.cancellations, b.bookings - b.cancellations],
    ['Visites', a.visits, b.visits],
    ['Annulations', a.cancellations, b.cancellations],
    ['Absences', a.noShows, b.noShows],
    ['CA estimé', a.revenue, b.revenue, true],
  ];

  const services = {}, weekdays = [0, 0, 0, 0, 0, 0, 0];
  for (const key of last12) {
    const s = months.get(key);
    if (!s) continue;
    Object.entries(s.services || {}).forEach(([name, n]) => { services[name] = (services[name] || 0) + n; });
    (s.weekdays || []).forEach((n, i) => { weekdays[i] += n; });
  }
  const topServices = Object.entries(services).sort((x, y) => y[1] - x[1]).slice(0, 8);
  const dayEntries = DAY_ORDER.map(i => [DAYS[i], weekdays[i]]);

  $('stats-body').innerHTML = `
    <div class="st-sub">${monthLabel(cur)} <span class="st-vs">comparé à ${monthLabel(prev)}</span></div>
    <div class="st-kpis">${kpis.map(([label, now, before, money]) => `
      <div class="met">
        <div class="met-lbl">${label}</div>
        <div class="met-val">${money ? euros(now) : now}</div>
        <div class="st-prev">${money ? euros(before) : before} le mois dernier ${delta(now, before)}</div>
      </div>`).join('')}
    </div>

    <div class="st-grid">
      <div class="st-card">
        <div class="st-sub">Prestations les plus demandées <span class="st-vs">12 derniers mois</span></div>
        ${topServices.length ? bars(topServices, topServices[0][1]) : '<div class="na">Pas encore de données.</div>'}
      </div>
      <div class="st-card">
        <div class="st-sub">Jours les plus chargés <span class="st-vs">12 derniers mois</span></div>
        ${bars(dayEntries, Math.max(...weekdays))}
      </div>
    </div>

    <div class="st-card">
      <div class="st-sub">Mois par mois</div>
      <table class="st-table">
        <thead><tr><th>Mois</th><th>Visites</th><th>Annulations</th><th>Absences</th><th>CA estimé</th></tr></thead>
        <tbody>${last12.map(key => {
          const s = months.get(key) || newMonthStats();
          return `<tr><td>${monthLabel(key)}</td><td>${s.visits}</td><td>${s.cancellations}</td><td>${s.noShows}</td><td>${euros(s.revenue)}</td></tr>`;
        }).join('')}</tbody>
      </table>
    </div>
    <p class="cd-gdpr">Statistiques anonymes (aucun nom). CA estimé d’après les tarifs des prestations, hors suppléments.</p>`;
}
