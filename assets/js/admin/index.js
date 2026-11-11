/**
 * Admin panel — core: login, the three views (Agenda / Clientes /
 * Statistiques), the "block today" switch and the GDPR clean-up on login.
 * (The admin interface is in French only.)
 *
 * Access is enforced by the Firestore rules, not by this code: only users
 * with an admins/{uid} document can read bookings, customers and stats.
 */
import { $, registerActions } from '../utils/dom.js';
import { t } from '../i18n.js';
import { state, subscribe, signIn, signOut, setBlockToday, setSettings, initAuth } from '../db.js';
import { buildProfiles } from './customers.js';
import { initAgenda, renderAgenda } from './agenda.js';
import { initClients, renderClients } from './clients.js';
import { renderStats } from './stats.js';
import { planCleanup, runCleanup, downloadBackup } from './retention.js';

let view = 'agenda';
let retentionChecked = false;
let pendingPlan = null;

const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

/* ─── Auth ─── */

function showAdminView() {
  const loggedIn = !!state.admin;
  $('admin-loading').hidden = true;
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

/* Runs silently — the owner doesn't need to see it (details in the console). */
async function cleanup(plan) {
  const r = await runCleanup(plan);
  console.info(`GDPR clean-up: ${r.archived} booking(s) archived, ${r.expired} expired card(s) deleted`);
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

/* ─── Init (on first opening of "Espace Admin") ─── */

let initialized = false;

/** Called each time the "Espace Admin" tab is opened. */
export async function openAdmin() {
  if (!initialized) {
    initialized = true;
    initAdmin();
  }
  if (!state.admin) {
    // Until Firebase Auth has loaded and checked for a saved login, show "Chargement…"
    $('admin-login').style.display = 'none';
    $('admin-loading').hidden = false;
  }
  try {
    await initAuth();
  } catch (err) {
    console.error('Auth failed to load:', err);
    $('admin-loading').textContent = t('load_error');
    return;
  }
  showAdminView();
}

function initAdmin() {
  initAgenda();
  initClients();

  registerActions({
    'admin-login': login,
    'admin-logout': () => signOut(),
    'admin-view': el => switchView(el.dataset.view),
    'admin-block-today': toggleBlockToday,
    'retention-backup': backup,
    'retention-run': startFirstCleanup,
  });

  ['admin-email-input', 'admin-pw-input'].forEach(id =>
    $(id).addEventListener('keydown', e => { if (e.key === 'Enter') login(); }));

  subscribe(type => {
    if (type === 'auth') {
      retentionChecked = false;
      pendingPlan = null;
      $('retention-banner').hidden = true;
      showAdminView();
    }
    if (!state.admin) return;
    if (['bookings', 'customers', 'stats'].includes(type)) render();
    if (type === 'settings') updateBlockTodayBtn();
    if (type === 'admin-ready') checkRetention();
  });
}
