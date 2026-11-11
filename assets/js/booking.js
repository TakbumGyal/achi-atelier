/**
 * Client booking flow — 4 steps:
 *   1. choose a service   2. choose a day + time
 *   3. enter contact info 4. review and confirm
 */
import { $, esc, show, registerActions } from './utils/dom.js';
import { t, formatDate, onLangChange } from './i18n.js';
import { SALON } from './config.js';
import { SERVICE_CATEGORIES, BOOKABLE_SERVICES } from './data/services.js';
import { toDateStr, todayStr, nowMins, addDaysStr, formatDuration } from './utils/dates.js';
import { availableSlots, isTaken, isPastSlot, isClosedDay } from './availability.js';
import { state, subscribe, addBooking } from './db.js';
import { sendConfirmationEmail } from './email.js';

/* If the database is slow, show the booking form anyway after this delay. */
const LOAD_TIMEOUT_MS = 6000;
const DEFAULT_DURATION = 30;

const NAME_RE = /^[a-zA-ZÀ-ÿЀ-ӿ\s'\-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALIDATORS = {
  name: v => NAME_RE.test(v),
  email: v => EMAIL_RE.test(v),
  phone: v => { const n = v.replace(/\D/g, '').length; return n >= 10 && n <= 15; },
};
/* [input id, required] */
const FORM_FIELDS = [['f-fn', true], ['f-ln', true], ['f-em', true], ['f-ph', false]];

let sel = { svc: null, date: null, time: null };
let weekOffset = 0;
let currentStep = 1;
let ready = false;
let failed = false;

/* ─── Step navigation ─── */

function goStep(n) {
  currentStep = n;
  document.querySelectorAll('[data-step-panel]').forEach(p => show(p, +p.dataset.stepPanel === n));
  document.querySelectorAll('.stp[data-step]').forEach(s => {
    const i = +s.dataset.step;
    s.classList.toggle('done', i < n);
    s.classList.toggle('active', i === n);
  });
  document.querySelectorAll('.stp-line[data-step]').forEach(l => l.classList.toggle('done', +l.dataset.step < n));

  if (n === 2) {
    $('sum-svc-2').textContent = sel.svc ? `${sel.svc.name} · ${formatDuration(sel.svc.dur)}` : '—';
    renderWeek();
  }
  if (n === 3) {
    $('sum-svc-3').textContent = sel.svc?.name || '—';
    $('sum-date-3').textContent = sel.date ? formatDate(sel.date) : '—';
    $('sum-time-3').textContent = sel.time || '—';
  }
  if (n === 4) renderConfirm();
}

function showForm() {
  if (ready || failed) return;
  ready = true;
  show($('bk-loading'), false);
  goStep(1);
}

/* ─── Step 1: services ─── */

function renderServiceCards() {
  $('svc-cards').innerHTML = SERVICE_CATEGORIES.map(cat => `
    <div>
      <div class="csvc-group-title" data-i18n="${cat.titleKey}">${t(cat.titleKey)}</div>
      <div class="csvc-cards">${cat.services.map(s => `
        <div class="csvc" role="button" tabindex="0" data-action="pick-service" data-svc="${esc(s.name)}">
          <span class="csvc-check">✓</span>
          <div class="csvc-name">${esc(s.name)}</div>
          <div class="csvc-dur">${formatDuration(s.dur)}</div>
          <div class="csvc-price">${esc(s.price)}</div>
        </div>`).join('')}
      </div>
    </div>`).join('');
}

function pickService(el) {
  document.querySelectorAll('.csvc').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  sel = { svc: BOOKABLE_SERVICES.find(s => s.name === el.dataset.svc), date: null, time: null };
  weekOffset = 0;
  $('btn-step1-next').disabled = false;
}

/* ─── Step 2: day + time ─── */

function weekDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function renderWeek() {
  const days = weekDates();
  const today = todayStr();
  const months = t('month_abbr');
  const labels = t('days_short');
  const dur = sel.svc ? sel.svc.dur : DEFAULT_DURATION;
  const first = days[0], last = days[6];

  $('week-label').textContent =
    `${first.getDate()} ${months[first.getMonth()]} — ${last.getDate()} ${months[last.getMonth()]} ${last.getFullYear()}`;
  $('btn-prev-week').disabled = weekOffset <= 0;

  $('week-row').innerHTML = days.map((d, i) => {
    const ds = toDateStr(d);
    const unavailable = ds < today || isClosedDay(ds) || (state.blockToday && ds === today);
    const free = unavailable ? 0 : availableSlots(ds, dur).length;
    const cls = 'wday-btn' + (ds === today ? ' today-btn' : '') + (ds === sel.date ? ' sel' : '');
    return `<div class="wday-col">
      <div class="wday-lbl">${labels[i]}</div>
      <button class="${cls}" data-action="pick-day" data-date="${ds}"${free === 0 ? ' disabled' : ''}>
        <div class="dn">${d.getDate()}</div>
        <div class="df">${free > 0 ? `${free} ${t('slots_word')}` : ''}</div>
      </button>
    </div>`;
  }).join('');

  if (sel.date) renderSlots(sel.date);
  else show($('slots-sec'), false);

  renderClosedTonight();
}

/* After closing time, tell the client the salon is closed tonight. */
function renderClosedTonight() {
  const el = $('closed-today-msg');
  if (nowMins() < SALON.closeMin || weekOffset !== 0) { show(el, false); return; }
  let next = null;
  for (let n = 1; n <= 7 && !next; n++) {
    const ds = addDaysStr(n);
    if (!isClosedDay(ds)) next = ds;
  }
  el.textContent = t('closed_tonight') + (next ? ` ${t('next_avail_prefix')} ${formatDate(next)}.` : '');
  show(el, true);
}

function pickDay(el) {
  sel.date = el.dataset.date;
  sel.time = null;
  document.querySelectorAll('.wday-btn').forEach(b => b.classList.toggle('sel', b === el));
  $('btn-step2-next').disabled = true;
  renderSlots(sel.date);
}

function renderSlots(ds) {
  show($('slots-sec'), true);
  $('slots-lbl').textContent = t('slots_lbl').replace('{date}', formatDate(ds));
  const slots = availableSlots(ds, sel.svc ? sel.svc.dur : DEFAULT_DURATION);

  /* The selected time may have just been taken by someone else. */
  if (sel.date === ds && sel.time && !slots.includes(sel.time)) {
    sel.time = null;
    $('btn-step2-next').disabled = true;
  }

  $('slots-row').innerHTML = slots.length
    ? slots.map(tm => `<button class="slot${sel.time === tm ? ' sel' : ''}" data-action="pick-time" data-time="${tm}">${tm}</button>`).join('')
    : `<p class="slots-empty">${t('no_slots')}</p>`;
}

function pickTime(el) {
  sel.time = el.dataset.time;
  document.querySelectorAll('.slot').forEach(s => s.classList.toggle('sel', s === el));
  $('btn-step2-next').disabled = false;
}

/* ─── Step 3: contact form ─── */

function markField(input, ok) {
  input.classList.toggle('err', !ok);
  input.classList.toggle('ok', ok && input.value.trim() !== '');
  $(input.dataset.hint)?.classList.toggle('show', !ok);
}

/* While typing: only flag non-empty invalid values. */
function liveValidate(input) {
  if (input.dataset.validate === 'phone') input.value = input.value.replace(/[^0-9+\s\-()]/g, '');
  const v = input.value.trim();
  markField(input, v === '' || VALIDATORS[input.dataset.validate](v));
}

/* On "Review": required fields must be filled too. */
function validateField(input, required) {
  const v = input.value.trim();
  const ok = v === '' ? !required : VALIDATORS[input.dataset.validate](v);
  markField(input, ok);
  return ok;
}

function readForm() {
  const val = id => $(id).value.trim();
  return { fn: val('f-fn'), ln: val('f-ln'), em: val('f-em'), ph: val('f-ph'), msg: val('f-msg') };
}

function reviewBooking() {
  const ok = FORM_FIELDS.map(([id, required]) => validateField($(id), required)).every(Boolean);
  if (ok) goStep(4);
}

/* ─── Step 4: confirm ─── */

function renderConfirm() {
  const f = readForm();
  const rows = [
    [t('tbl_svc'), `<strong>${esc(sel.svc.name)}</strong>`],
    [t('tbl_dur'), formatDuration(sel.svc.dur)],
    [t('tbl_price'), `<strong class="price">${esc(sel.svc.price)}</strong>`],
    [t('tbl_date'), formatDate(sel.date)],
    [t('tbl_time'), sel.time],
    [t('tbl_name'), esc(`${f.fn} ${f.ln}`)],
    [t('tbl_email'), esc(f.em)],
    f.ph && [t('tbl_phone'), esc(f.ph)],
    f.msg && [t('tbl_msg'), `<em>${esc(f.msg)}</em>`],
  ].filter(Boolean);

  $('confirm-box').innerHTML = `
    <p class="confirm-title">${t('confirm_title')}</p>
    <p class="confirm-sub">${t('confirm_sub')}</p>
    <table class="confirm-tbl">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
    <div class="btn-row">
      <button class="btn-b" data-action="goto-step" data-step="3">${t('btn_edit')}</button>
      <button class="btn-p" id="btn-confirm-bk" data-action="confirm-booking">${t('btn_confirm')}</button>
    </div>`;
}

function resultBox(icon, title, text, button) {
  return `<div class="bk-result">
    <div class="bk-result-icon">${icon}</div>
    <p class="bk-result-title">${title}</p>
    <p class="bk-result-text">${text}</p>
    ${button}
  </div>`;
}

async function confirmBooking() {
  if (!ready) { alert(t('loading_wait')); return; }
  const f = readForm();
  const btn = $('btn-confirm-bk');
  btn.disabled = true;
  btn.textContent = t('saving');

  /* Re-check: the slot may have been booked (or today blocked) meanwhile. */
  if (isTaken(sel.date, sel.time, sel.svc.dur) || isPastSlot(sel.date, sel.time)) {
    $('confirm-box').innerHTML = resultBox('😔', t('slot_taken_title'), t('slot_taken_msg'),
      `<button class="btn-p" data-action="goto-step" data-step="2">${t('slot_taken_btn')}</button>`);
    return;
  }

  const bk = {
    id: state.nextId++, first: f.fn, last: f.ln, email: f.em, phone: f.ph,
    service: sel.svc.name, dur: sel.svc.dur, price: sel.svc.price,
    date: sel.date, time: sel.time, msg: f.msg, status: 'confirmed',
  };
  try {
    await addBooking(bk);
  } catch (err) {
    console.error('Booking failed:', err);
    btn.disabled = false;
    btn.textContent = t('btn_confirm');
    alert(t('submit_error'));
    return;
  }
  sendConfirmationEmail(bk); // fire and forget

  const text = t('success_sub')
    .replace('{name}', esc(f.fn)).replace('{svc}', esc(sel.svc.name))
    .replace('{date}', formatDate(sel.date)).replace('{time}', sel.time);
  $('confirm-box').innerHTML = resultBox('🎉', t('success_title'), text,
    `<button class="btn-p" data-action="new-booking">${t('btn_another')}</button>`);
  sel = { svc: null, date: null, time: null };
}

function resetBooking() {
  document.querySelectorAll('.csvc').forEach(c => c.classList.remove('sel'));
  ['f-fn', 'f-ln', 'f-em', 'f-ph', 'f-msg'].forEach(id => {
    const el = $(id);
    el.value = '';
    el.classList.remove('err', 'ok');
  });
  document.querySelectorAll('#bp-client .eh').forEach(h => h.classList.remove('show'));
  sel = { svc: null, date: null, time: null };
  weekOffset = 0;
  $('confirm-box').innerHTML = '';
  $('btn-step1-next').disabled = true;
  goStep(1);
}

/* ─── Init ─── */

export function initBooking() {
  renderServiceCards();

  registerActions({
    'pick-service': pickService,
    'goto-step': el => goStep(+el.dataset.step),
    'prev-week': () => { if (weekOffset > 0) { weekOffset--; renderWeek(); } },
    'next-week': () => { weekOffset++; renderWeek(); },
    'pick-day': pickDay,
    'pick-time': pickTime,
    'review-booking': reviewBooking,
    'confirm-booking': confirmBooking,
    'new-booking': resetBooking,
  });

  $('bp-client').addEventListener('input', e => {
    if (e.target.matches('[data-validate]')) liveValidate(e.target);
  });

  subscribe(type => {
    if (type === 'error') {
      if (!ready) { failed = true; $('bk-loading').textContent = t('load_error'); }
      return;
    }
    if (type === 'bookings') showForm();
    if (ready && currentStep === 2) renderWeek();  // live availability
  });

  onLangChange(() => { if (ready && currentStep === 2) renderWeek(); });

  setTimeout(showForm, LOAD_TIMEOUT_MS);
}
