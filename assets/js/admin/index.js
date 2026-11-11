/**
 * Admin panel — core: login, the three views (Agenda / Clientes /
 * Statistiques), the "block today" switch and the GDPR clean-up on login.
 * (The admin interface is in French only.)
 *
 * Access is enforced by the Firestore rules, not by this code: only users
 * with an admins/{uid} document can read bookings, customers and stats.
 */
import { $, registerActions, keepBelowNavbar } from '../utils/dom.js';
import { t } from '../i18n.js';
import { state, subscribe, signIn, signOut, setBlockToday, setSettings } from '../db.js';
import { RETENTION } from '../config.js';
import { buildProfiles } from './customers.js';
import { initAgenda, renderAgenda } from './agenda.js';
import { initClients, renderClients } from './clients.js';
import { renderStats } from './stats.js';
import { planCleanup, runCleanup, downloadBackup } from './retention.js';

let view = 'agenda';
let retentionChecked = false;
let pendingPlan = null;

const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

/* ─── Tabs (client / admin) ─── */

function switchTab(tab) {
  ['client', 'admin'].forEach(x => {
    $('bkt-' + x).classList.toggle('active', x === tab);
    $('bp-' + x).classList.toggle('active', x === tab);
  });
  if (tab === 'admin') showAdminView();
  keepBelowNavbar($('bkt-client').parentElement);
}

/* ─── Auth ─── */

function showAdminView() {
  const loggedIn = !!state.admin;
  $('admin-login').style.display = loggedIn ? 'none' : 'block';
  $('admin-dash').classList.toggle('visible', loggedIn);
  if (loggedIn) render();
}

function showLoginError(key) {
  const el = $('admin-err');
  el.textContent = t(key);
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

async function login() {
  const email = $('admin-email-input').value.trim();
  const pw = $('admin-pw-input');
  const btn = $('btn-admin-login');
  if (!email || !pw.value) { showLoginError('admin_err'); return; }

  btn.disabled = true;
  let result;
  try {
    result = await signIn(email, pw.value);
  } catch {
    result = 'invalid';
  }
  btn.disabled = false;
  pw.value = '';
  if (result === 'invalid') showLoginError('admin_err');
  if (result === 'not-admin') showLoginError('admin_not_allowed');
  // On success, the 'auth' event switches to the dashboard.
}

/* ─── Views ─── */

function switchView(next) {
  view = next;
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.toggle('active', b.dataset.view === next));
  document.querySelectorAll('.admin-view').forEach(v => { v.hidden = v.dataset.view !== next; });
  render();
}

function render() {
  if (!state.admin) return;
  const profiles = buildProfiles(state.customers, state.bookings);
  renderAgenda(profiles);
  renderClients(profiles);   // also keeps an open customer window up to date
  if (view === 'stats') renderStats();
  updateBlockTodayBtn();
}

/* ─── Block today ─── */

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
    alert("Erreur : impossible d'enregistrer le réglage.");
  }
}

/* ─── GDPR clean-up (runs once per login) ─── */

function showNotice(html) {
  const el = $('admin-notice');
  el.innerHTML = `${html} <button class="notice-close" data-action="notice-close" aria-label="Fermer">✕</button>`;
  el.hidden = false;
}

async function cleanup(plan) {
  const r = await runCleanup(plan);
  const parts = [];
  if (r.archived) parts.push(`${plural(r.archived, 'réservation')} de plus de ${RETENTION.bookingDays} jours archivée${r.archived > 1 ? 's' : ''}`);
  if (r.expired) parts.push(`${plural(r.expired, 'fiche')} sans visite depuis ${RETENTION.customerYears} ans supprimée${r.expired > 1 ? 's' : ''}`);
  if (parts.length) showNotice(`🧹 Nettoyage RGPD : ${parts.join(' · ')}.`);
}

async function checkRetention() {
  if (retentionChecked) return;
  retentionChecked = true;
  try {
    const plan = await planCleanup();
    const nothingToDo = !plan.old.length && !plan.expired.length;
    if (state.retentionEnabled) {
      if (!nothingToDo) await cleanup(plan);
      return;
    }
    if (nothingToDo) {                         // first run, nothing old: just switch it on
      await setSettings({ retentionEnabled: true });
      return;
    }
    pendingPlan = plan;                        // first run: let the owner make a backup first
    $('retention-count').textContent = plural(plan.old.length, 'réservation');
    $('retention-banner').hidden = false;
  } catch (err) {
    console.error('Retention check failed:', err);
  }
}

async function startFirstCleanup() {
  if (!pendingPlan) return;
  if (!confirm('Lancer le nettoyage ? Les détails des anciennes réservations seront supprimés définitivement (les visites restent comptées dans les fiches clientes).')) return;
  const btn = $('btn-retention-run');
  btn.disabled = true;
  try {
    await cleanup(pendingPlan);
    pendingPlan = null;
    $('retention-banner').hidden = true;
  } catch (err) {
    console.error(err);
    alert('Erreur pendant le nettoyage. Réessayez.');
  }
  btn.disabled = false;
}

async function backup(el) {
  el.disabled = true;
  try {
    await downloadBackup();
  } catch (err) {
    console.error(err);
    alert('Erreur : sauvegarde impossible.');
  }
  el.disabled = false;
}

/* ─── Init ─── */

export function initAdmin() {
  initAgenda();
  initClients();

  registerActions({
    'booking-tab': el => switchTab(el.dataset.tab),
    'admin-login': login,
    'admin-logout': () => signOut(),
    'admin-view': el => switchView(el.dataset.view),
    'admin-block-today': toggleBlockToday,
    'retention-backup': backup,
    'retention-run': startFirstCleanup,
    'notice-close': () => { $('admin-notice').hidden = true; },
  });

  ['admin-email-input', 'admin-pw-input'].forEach(id =>
    $(id).addEventListener('keydown', e => { if (e.key === 'Enter') login(); }));

  subscribe(type => {
    if (type === 'auth') {
      retentionChecked = false;
      pendingPlan = null;
      $('retention-banner').hidden = true;
      $('admin-notice').hidden = true;
      showAdminView();
    }
    if (!state.admin) return;
    if (['bookings', 'customers', 'stats'].includes(type)) render();
    if (type === 'settings') updateBlockTodayBtn();
    if (type === 'admin-ready') checkRetention();
  });
}
