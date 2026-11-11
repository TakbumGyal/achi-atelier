/**
 * Admin "Clientes" view: searchable list of customer cards, detail window,
 * and the GDPR tools (export a customer's data, delete it all).
 */
import { $, esc, registerActions } from '../utils/dom.js';
import { formatDate } from '../i18n.js';
import { RETENTION } from '../config.js';
import { normPhone } from './customers.js';
import { deleteCustomerData, downloadJson } from './retention.js';
import { todayStr } from '../utils/dates.js';

let ctx = null;
let query = '';
let openKey = null;

const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
const OUTCOME_LABEL = { visit: 'venue', cancelled: 'annulé', noshow: 'absente', upcoming: 'à venir' };

function displayName(s) {
  return `${s.first || ''} ${s.last || ''}`.trim() || s.email || s.phone || 'Cliente';
}

function matches(p, q) {
  if (!q) return true;
  const s = p.summary;
  const hay = `${s.first} ${s.last} ${s.email}`.toLowerCase();
  const phoneQ = q.replace(/\D/g, '');
  return hay.includes(q) || (phoneQ.length >= 3 && normPhone(s.phone).includes(phoneQ));
}

export function renderClients(profiles) {
  ctx = profiles;
  const all = [...ctx.profiles.values()];
  const list = all
    .filter(p => matches(p, query))
    .sort((a, b) => (b.summary.lastActivity || b.live[0]?.date || '').localeCompare(a.summary.lastActivity || a.live[0]?.date || ''));

  $('clients-count').textContent = `${plural(all.length, 'cliente')}${query ? ` · ${list.length} trouvée${list.length > 1 ? 's' : ''}` : ''}`;
  $('clients-list').innerHTML = list.length
    ? list.map(p => {
      const s = p.summary;
      return `<div class="client-row" data-action="client-open" data-key="${esc(p.key)}" role="button" tabindex="0">
        <div>
          <div class="client-name">${esc(displayName(s))}</div>
          <div class="client-contact">${esc(s.email)}${s.phone ? ' · ' + esc(s.phone) : ''}</div>
        </div>
        <div class="client-stats">
          <span class="cbadge">${plural(s.visits, 'visite')}</span>
          ${s.upcoming ? `<span class="cbadge cbadge-new">${s.upcoming} à venir</span>` : ''}
          ${s.noShows ? `<span class="cbadge cbadge-warn">⚠ ${plural(s.noShows, 'absence')}</span>` : ''}
          <div class="client-last">${s.lastVisit ? 'Dernière visite : ' + formatDate(s.lastVisit) : 'Pas encore venue'}</div>
        </div>
      </div>`;
    }).join('')
    : `<div class="na">${query ? 'Aucune cliente trouvée.' : 'Aucune cliente pour le moment.'}</div>`;

  if (openKey) renderDetail(openKey);
}

function keptUntil(s) {
  if (s.upcoming) return 'tant qu’elle a des rendez-vous à venir, puis 3 ans après sa dernière venue';
  if (!s.lastActivity) return '—';
  const [y, m, d] = s.lastActivity.split('-');
  return formatDate(`${+y + RETENTION.customerYears}-${m}-${d}`);
}

function renderDetail(key) {
  const p = ctx?.profiles.get(key);
  if (!p) { closeDetail(); return; }
  const s = p.summary;
  const services = Object.entries(s.services || {}).sort((a, b) => b[1] - a[1]);

  $('client-modal-body').innerHTML = `
    <div class="cd-head">
      <div class="cd-name">${esc(displayName(s))}</div>
      <div class="client-contact">${s.email ? '✉ ' + esc(s.email) : ''}${s.phone ? ' · 📞 ' + esc(s.phone) : ''}</div>
    </div>
    <div class="cd-metrics">
      <div class="met"><div class="met-lbl">Visites</div><div class="met-val met-val--brown">${s.visits}</div></div>
      <div class="met"><div class="met-lbl">À venir</div><div class="met-val met-val--blue">${s.upcoming}</div></div>
      <div class="met"><div class="met-lbl">Annulations</div><div class="met-val met-val--muted">${s.cancellations}</div></div>
      <div class="met"><div class="met-lbl">Absences</div><div class="met-val met-val--muted">${s.noShows}</div></div>
    </div>
    <p class="cd-line">${s.firstVisit ? `Cliente depuis le <strong>${formatDate(s.firstVisit)}</strong> · dernière visite le <strong>${formatDate(s.lastVisit)}</strong>` : 'Pas encore venue au salon.'}</p>
    ${services.length ? `<div class="cd-sub">Prestations</div>
      <div class="cd-services">${services.map(([name, n]) => `<span class="cbadge">${esc(name)} × ${n}</span>`).join('')}</div>` : ''}
    <div class="cd-sub">Historique</div>
    <div class="cd-history">${s.history.length
      ? s.history.map(h => `<div class="cd-h"><span>${formatDate(h.date)}</span><span>${esc(h.service)}</span><span class="cd-h-${h.outcome}">${OUTCOME_LABEL[h.outcome] || ''}</span></div>`).join('')
      : '<div class="na">Aucun historique.</div>'}</div>
    <p class="cd-gdpr">🔒 Données conservées jusqu’au ${keptUntil(s)} (RGPD). Les messages des réservations ne sont jamais conservés dans la fiche.</p>
    <div class="btn-row">
      <button class="btn-b" data-action="client-export">⬇ Exporter ses données</button>
      <button class="btn-xcl btn-danger" data-action="client-delete">🗑 Supprimer toutes ses données</button>
    </div>`;
}

function openDetail(key) {
  openKey = key;
  renderDetail(key);
  $('client-modal').classList.add('open');
}

function closeDetail() {
  openKey = null;
  $('client-modal').classList.remove('open');
}

/* GDPR right of access: everything stored about this customer. */
function exportCustomer() {
  const p = ctx?.profiles.get(openKey);
  if (!p) return;
  const bookings = p.live.map(({ _fid, createdAt, ...b }) => b);
  const card = p.card ? (({ _id, ...c }) => c)(p.card) : null;
  const slug = (p.summary.last || p.summary.first || 'cliente').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadJson(`donnees-${slug}-${todayStr()}.json`, {
    exportedAt: new Date().toISOString(),
    salon: 'Atelier Achi Nail Studio — 9 rue Trousseau, 75011 Paris',
    customerCard: card,
    bookings,
  });
}

/* GDPR right to erasure. */
async function deleteCustomer() {
  const p = ctx?.profiles.get(openKey);
  if (!p) return;
  const name = displayName(p.summary);
  const upcoming = p.summary.upcoming ? `\n\n⚠ Ses ${p.summary.upcoming} rendez-vous à venir seront aussi supprimés.` : '';
  if (!confirm(`Supprimer définitivement toutes les données de ${name} ?\n(fiche cliente, historique et réservations)${upcoming}\n\nCette action est irréversible.`)) return;
  try {
    const n = await deleteCustomerData(openKey);
    closeDetail();
    alert(`Données de ${name} supprimées (${plural(n, 'réservation')}).`);
  } catch (err) {
    console.error(err);
    alert('Erreur : suppression impossible.');
  }
}

export function initClients() {
  registerActions({
    'client-open': el => openDetail(el.dataset.key),
    'client-close': closeDetail,
    'client-export': exportCustomer,
    'client-delete': deleteCustomer,
  });
  $('clients-search').addEventListener('input', e => {
    query = e.target.value.trim().toLowerCase();
    if (ctx) renderClients(ctx);
  });
  $('client-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeDetail(); });
}
