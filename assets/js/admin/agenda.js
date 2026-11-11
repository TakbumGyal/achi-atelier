/**
 * Admin "Agenda" view: metrics, month calendar, day details (with customer
 * badges and the "absente" button), upcoming list, and the add-booking modal.
 */
import { $, esc, registerActions } from '../utils/dom.js';
import { BOOKABLE_SERVICES } from '../data/services.js';
import { toDateStr, todayStr, formatDuration } from '../utils/dates.js';
import { formatDate } from '../i18n.js';
import { state, createBooking, cancelBooking, setNoShow } from '../db.js';
import { sendConfirmationEmail } from '../email.js';
import { visitNumber, profileFor, isPast } from './customers.js';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const UPCOMING_LIMIT = 8;
const PREVIEW_PER_DAY = 2;

let month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selDay = null;
let ctx = null;   // customer profiles, set by renderAgenda

const isActive = b => b.status !== 'cancelled';
const byTime = (a, b) => a.time.localeCompare(b.time);
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

/** "Nouvelle cliente" / "5e visite" / "⚠ 2 absences" badges for a booking. */
function customerBadges(b) {
  const n = visitNumber(ctx, b);
  if (n === null) return '';
  const p = profileFor(ctx, b);
  let html = n === 1
    ? '<span class="cbadge cbadge-new">Nouvelle cliente</span>'
    : `<span class="cbadge">${n}e visite</span>`;
  if (p?.summary.noShows) html += `<span class="cbadge cbadge-warn">⚠ ${plural(p.summary.noShows, 'absence')}</span>`;
  return html;
}

export function renderAgenda(profiles) {
  ctx = profiles;
  renderMetrics();
  renderCalendar();
  renderUpcoming();
}

function renderMetrics() {
  const today = todayStr();
  const active = state.bookings.filter(isActive);
  const metrics = [
    ['Actives', active.length, 'brown'],
    ['À venir', active.filter(b => b.date >= today).length, 'blue'],
    ["Aujourd'hui", active.filter(b => b.date === today).length, 'green'],
    ['Annulées', state.bookings.length - active.length, 'muted'],
  ];
  $('am-metrics').innerHTML = metrics.map(([label, value, color]) =>
    `<div class="met"><div class="met-lbl">${label}</div><div class="met-val met-val--${color}">${value}</div></div>`).join('');
}

function renderCalendar() {
  $('a-month-lbl').textContent = `${MONTHS[month.getMonth()]} ${month.getFullYear()}`;
  $('mgh').innerHTML = WEEKDAYS.map(l => `<div class="mghd">${l}</div>`).join('');

  const y = month.getFullYear(), m = month.getMonth();
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;         // Monday = 0
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
  const today = todayStr();

  let html = '';
  for (let i = 0; i < cells; i++) {
    const d = new Date(y, m, i - firstDow + 1);
    const ds = toDateStr(d);
    const dayBookings = state.bookings.filter(b => b.date === ds).sort(byTime);
    const active = dayBookings.filter(isActive);
    const cancelled = dayBookings.length - active.length;
    const cls = 'mc' + (d.getMonth() === m ? '' : ' oth') + (ds === today ? ' tod' : '') + (ds === selDay ? ' seld' : '');

    html += `<div class="${cls}" data-action="admin-day" data-date="${ds}">
      <div class="mc-num">${d.getDate()}</div>
      ${active.slice(0, PREVIEW_PER_DAY).map(b => `<div class="apdot ${b.noShow ? 'apdot-x' : 'apdot-c'}">${b.time} ${esc(b.first)}</div>`).join('')}
      ${cancelled ? `<div class="apdot apdot-x">✕${cancelled}</div>` : ''}
      ${active.length > PREVIEW_PER_DAY ? `<div class="mc-more">+${active.length - PREVIEW_PER_DAY}</div>` : ''}
    </div>`;
  }
  $('mg').innerHTML = html;

  if (selDay) renderDayPanel(selDay);
}

function statusBadge(b) {
  if (b.status === 'cancelled') return '<span class="abadge abadge-x">annulé</span>';
  if (b.noShow) return '<span class="abadge abadge-x">absente</span>';
  return '<span class="abadge abadge-c">confirmé</span>';
}

function renderDayPanel(ds) {
  const dayBookings = state.bookings.filter(b => b.date === ds).sort(byTime);
  const item = b => {
    const cancelled = !isActive(b);
    const key = ctx?.keyOf.get(b._fid);
    let actions = '';
    if (!cancelled && !isPast(b)) {
      actions = `<button class="btn-xcl" data-action="admin-cancel" data-id="${esc(b._fid)}">✕ Annuler</button>`;
    } else if (!cancelled) {
      actions = b.noShow
        ? `<button class="btn-xcl" data-action="admin-noshow" data-id="${esc(b._fid)}" data-value="0">↺ Elle est venue</button>`
        : `<button class="btn-xcl" data-action="admin-noshow" data-id="${esc(b._fid)}" data-value="1">Marquer absente</button>`;
    }
    if (key) actions += `<button class="btn-xcl btn-xcl--soft" data-action="client-open" data-key="${esc(key)}">👤 Fiche</button>`;

    return `<div class="appt-item">
      <div>
        <div class="appt-time">${b.time}</div>
        ${statusBadge(b)}
      </div>
      <div>
        <div class="appt-name">${esc(b.first)} ${esc(b.last)} ${customerBadges(b)}</div>
        <div class="appt-detail">${esc(b.service)} · ${b.dur}min · ${esc(b.price)}</div>
        <div class="appt-detail">✉ ${esc(b.email)}${b.phone ? ' · 📞 ' + esc(b.phone) : ''}</div>
        ${b.msg ? `<div class="appt-note">"${esc(b.msg)}"</div>` : ''}
        <div class="appt-actions">${actions}</div>
      </div>
      <div class="appt-dur">${b.dur}min</div>
    </div>`;
  };

  $('dp').innerHTML = `<div class="dp-wrap">
    <div class="dp-hdr">
      <span class="dp-date">📅 ${formatDate(ds)}</span>
      <button class="btn-p btn-sm" data-action="open-modal" data-date="${ds}">+ Ajouter</button>
    </div>
    <div>${dayBookings.length ? dayBookings.map(item).join('') : '<div class="na">😌 Aucun rendez-vous — journée libre !</div>'}</div>
  </div>`;
}

function renderUpcoming() {
  const today = todayStr();
  const upcoming = state.bookings
    .filter(b => b.date >= today && isActive(b) && !isPast(b))
    .sort((a, b) => a.date.localeCompare(b.date) || byTime(a, b))
    .slice(0, UPCOMING_LIMIT);

  $('up-count').textContent = upcoming.length;
  $('up-list').innerHTML = upcoming.length
    ? upcoming.map(b => `<div class="up-item" data-action="admin-day" data-date="${b.date}">
        <div class="up-date">${formatDate(b.date)} · ${b.time}</div>
        <div class="up-name">${esc(b.first)} ${esc(b.last)}</div>
        <div class="up-svc">${esc(b.service)} · ${esc(b.price)}</div>
        <div class="up-badges">${customerBadges(b)}</div>
      </div>`).join('')
    : '<div class="na">Aucun rendez-vous à venir</div>';
}

/* ─── Actions ─── */

async function cancel(fid) {
  if (!confirm('Annuler ce rendez-vous ? Le créneau sera libéré pour les clientes.')) return;
  try {
    await cancelBooking(fid);
  } catch (err) {
    console.error(err);
    alert("Erreur : impossible d'annuler ce rendez-vous.");
  }
}

async function toggleNoShow(fid, value) {
  try {
    await setNoShow(fid, value);
  } catch (err) {
    console.error(err);
    alert("Erreur : impossible d'enregistrer.");
  }
}

function openModal(date) {
  $('m-dt').value = date || todayStr();
  $('m-tm').value = '10:00';
  ['m-fn', 'm-ln', 'm-em', 'm-ph', 'm-note'].forEach(id => { $(id).value = ''; });
  $('modal-overlay').classList.add('open');
}

function closeModal() {
  $('modal-overlay').classList.remove('open');
}

async function saveModal() {
  const svc = BOOKABLE_SERVICES[+$('m-svc').value];
  const date = $('m-dt').value;
  const time = $('m-tm').value.slice(0, 5);
  const first = $('m-fn').value.trim();
  const last = $('m-ln').value.trim();
  if (!svc || !date || !time || !first || !last) {
    alert("Veuillez remplir la prestation, la date, l'heure, le prénom et le nom.");
    return;
  }
  const bk = {
    first, last,
    email: $('m-em').value.trim(), phone: $('m-ph').value.trim(),
    service: svc.name, dur: svc.dur, price: svc.price,
    date, time, msg: $('m-note').value.trim(),
  };
  try {
    await createBooking(bk, 'admin');
  } catch (err) {
    console.error(err);
    alert("Erreur : le rendez-vous n'a pas pu être enregistré.");
    return;
  }
  sendConfirmationEmail(bk);
  selDay = date;
  closeModal();
}

export function initAgenda() {
  $('m-svc').innerHTML = BOOKABLE_SERVICES
    .map((s, i) => `<option value="${i}">${esc(s.name)} (${formatDuration(s.dur)})</option>`).join('');

  registerActions({
    'admin-prev-month': () => { month.setMonth(month.getMonth() - 1); renderCalendar(); },
    'admin-next-month': () => { month.setMonth(month.getMonth() + 1); renderCalendar(); },
    'admin-day': el => { selDay = el.dataset.date; renderCalendar(); },
    'admin-cancel': el => cancel(el.dataset.id),
    'admin-noshow': el => toggleNoShow(el.dataset.id, el.dataset.value === '1'),
    'open-modal': el => openModal(el.dataset.date),
    'close-modal': closeModal,
    'save-modal': saveModal,
  });

  $('m-ph').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9+\s\-()']/g, ''); });
  $('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
}
