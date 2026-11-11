/**
 * Admin panel: login, month calendar, day details, upcoming list,
 * manual booking modal, cancellation and the "block today" switch.
 * (The admin interface is in French only.)
 */
import { $, esc, registerActions } from './utils/dom.js';
import { ADMIN_PW_HASH } from './config.js';
import { BOOKABLE_SERVICES } from './data/services.js';
import { toDateStr, todayStr, formatDuration } from './utils/dates.js';
import { formatDate } from './i18n.js';
import { state, subscribe, addBooking, cancelBooking, setBlockToday } from './db.js';
import { sendConfirmationEmail } from './email.js';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const UPCOMING_LIMIT = 8;
const PREVIEW_PER_DAY = 2;

let loggedIn = false;
let month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selDay = null;

const isActive = b => b.status !== 'cancelled';
const byTime = (a, b) => a.time.localeCompare(b.time);

/* ─── Tabs (client / admin) ─── */

function switchTab(tab) {
  ['client', 'admin'].forEach(x => {
    $('bkt-' + x).classList.toggle('active', x === tab);
    $('bp-' + x).classList.toggle('active', x === tab);
  });
  if (tab === 'admin') {
    if (loggedIn) render();
    else showLogin();
  }
}

/* ─── Auth ─── */

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
}

function showLogin() {
  $('admin-login').style.display = 'block';
  $('admin-dash').classList.remove('visible');
}

async function login() {
  const input = $('admin-pw-input');
  if (await sha256Hex(input.value) === ADMIN_PW_HASH) {
    loggedIn = true;
    $('admin-login').style.display = 'none';
    $('admin-dash').classList.add('visible');
    render();
  } else {
    $('admin-err').classList.add('show');
    input.value = '';
    setTimeout(() => $('admin-err').classList.remove('show'), 3000);
  }
}

function logout() {
  loggedIn = false;
  $('admin-pw-input').value = '';
  showLogin();
}

/* ─── Dashboard ─── */

function render() {
  renderMetrics();
  renderCalendar();
  renderUpcoming();
  updateBlockTodayBtn();
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
      ${active.slice(0, PREVIEW_PER_DAY).map(b => `<div class="apdot apdot-c">${b.time} ${esc(b.first)}</div>`).join('')}
      ${cancelled ? `<div class="apdot apdot-x">✕${cancelled}</div>` : ''}
      ${active.length > PREVIEW_PER_DAY ? `<div class="mc-more">+${active.length - PREVIEW_PER_DAY}</div>` : ''}
    </div>`;
  }
  $('mg').innerHTML = html;

  if (selDay) renderDayPanel(selDay);
}

function renderDayPanel(ds) {
  const dayBookings = state.bookings.filter(b => b.date === ds).sort(byTime);
  const item = b => {
    const cancelled = !isActive(b);
    return `<div class="appt-item">
      <div>
        <div class="appt-time">${b.time}</div>
        <span class="abadge ${cancelled ? 'abadge-x' : 'abadge-c'}">${cancelled ? 'annulé' : 'confirmé'}</span>
      </div>
      <div>
        <div class="appt-name">${esc(b.first)} ${esc(b.last)}</div>
        <div class="appt-detail">${esc(b.service)} · ${b.dur}min · ${esc(b.price)}</div>
        <div class="appt-detail">✉ ${esc(b.email)}${b.phone ? ' · 📞 ' + esc(b.phone) : ''}</div>
        ${b.msg ? `<div class="appt-note">"${esc(b.msg)}"</div>` : ''}
        ${cancelled ? '' : `<button class="btn-xcl" data-action="admin-cancel" data-id="${b.id}">✕ Annuler</button>`}
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
    .filter(b => b.date >= today && isActive(b))
    .sort((a, b) => a.date.localeCompare(b.date) || byTime(a, b))
    .slice(0, UPCOMING_LIMIT);

  $('up-count').textContent = upcoming.length;
  $('up-list').innerHTML = upcoming.length
    ? upcoming.map(b => `<div class="up-item" data-action="admin-day" data-date="${b.date}">
        <div class="up-date">${formatDate(b.date)} · ${b.time}</div>
        <div class="up-name">${esc(b.first)} ${esc(b.last)}</div>
        <div class="up-svc">${esc(b.service)} · ${esc(b.price)}</div>
      </div>`).join('')
    : '<div class="na">Aucun rendez-vous à venir</div>';
}

function selectDay(ds) {
  selDay = ds;
  renderCalendar();
}

/* ─── Cancel / block today ─── */

async function cancel(id) {
  if (!confirm('Annuler ce rendez-vous ? Le créneau sera libéré pour les clientes.')) return;
  try {
    await cancelBooking(id);
  } catch (err) {
    console.error(err);
    alert("Erreur : impossible d'annuler ce rendez-vous.");
  }
}

function updateBlockTodayBtn() {
  const btn = $('btn-block-today');
  btn.classList.toggle('is-blocked', state.blockToday);
  btn.textContent = state.blockToday ? '🔒 Résas du jour : BLOQUÉES' : '🔓 Résas du jour : ouvertes';
}

async function toggleBlockToday() {
  const next = !state.blockToday;
  const question = next
    ? "Bloquer toutes les réservations pour aujourd'hui ? Les clientes ne pourront plus réserver de créneau à la date du jour."
    : "Rouvrir les réservations pour aujourd'hui ?";
  if (!confirm(question)) return;
  try {
    await setBlockToday(next);
  } catch (err) {
    console.error(err);
    alert("Erreur : impossible d'enregistrer le réglage. Vérifiez les règles Firestore (collection settings).");
  }
}

/* ─── Manual booking modal ─── */

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
    id: state.nextId++, first, last,
    email: $('m-em').value.trim(), phone: $('m-ph').value.trim(),
    service: svc.name, dur: svc.dur, price: svc.price,
    date, time, msg: $('m-note').value.trim(), status: 'confirmed', source: 'admin',
  };
  try {
    await addBooking(bk);
  } catch (err) {
    console.error(err);
    alert("Erreur : le rendez-vous n'a pas pu être enregistré.");
    return;
  }
  sendConfirmationEmail(bk);
  selDay = date;
  closeModal();
}

/* ─── Init ─── */

export function initAdmin() {
  $('m-svc').innerHTML = BOOKABLE_SERVICES
    .map((s, i) => `<option value="${i}">${esc(s.name)} (${formatDuration(s.dur)})</option>`).join('');

  registerActions({
    'booking-tab': el => switchTab(el.dataset.tab),
    'admin-login': login,
    'admin-logout': logout,
    'admin-prev-month': () => { month.setMonth(month.getMonth() - 1); renderCalendar(); },
    'admin-next-month': () => { month.setMonth(month.getMonth() + 1); renderCalendar(); },
    'admin-day': el => selectDay(el.dataset.date),
    'admin-cancel': el => cancel(+el.dataset.id),
    'admin-block-today': toggleBlockToday,
    'open-modal': el => openModal(el.dataset.date),
    'close-modal': closeModal,
    'save-modal': saveModal,
  });

  $('admin-pw-input').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
  $('m-ph').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9+\s\-()']/g, ''); });
  $('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  subscribe(type => {
    if (!loggedIn) return;
    if (type === 'bookings') render();
    if (type === 'settings') updateBlockTodayBtn();
  });
}
