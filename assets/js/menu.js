/* The "Soins" price list: category tabs + one panel per category, generated
   from data/services.js in the visitor's language. Each bookable service has
   a "Réserver" button that opens the booking panel with it pre-selected. */
import { $, esc, registerActions } from './utils/dom.js';
import { t, onLangChange } from './i18n.js';
import { SERVICE_CATEGORIES, SUPPLEMENTS, serviceLabel } from './data/services.js';
import { formatDuration } from './utils/dates.js';

const TABS = [
  ...SERVICE_CATEGORIES.map(c => ({ id: c.id, label: 'tab_' + c.id })),
  { id: 'suppl', label: 'tab_suppl' },
];
let active = TABS[0].id;

const clock = '<svg class="ic"><use href="#i-clock"/></svg>';
const arrow = '<svg class="ic"><use href="#i-arrow"/></svg>';

function serviceItem(s) {
  return `<div class="svc-item">
    <div class="svc-main">
      <div class="svc-name">${esc(serviceLabel(s.name))}</div>
      <div class="svc-meta">${clock}${formatDuration(s.dur)}</div>
    </div>
    <div class="svc-side">
      <span class="svc-price">${esc(s.price)}</span>
      <button class="svc-book" data-action="open-booking" data-svc="${esc(s.name)}">${t('svc_book')}${arrow}</button>
    </div>
  </div>`;
}

function supplementItem(s) {
  return `<div class="svc-item">
    <div class="svc-main">
      <div class="svc-name">${esc(serviceLabel(s.name))}</div>
      ${s.extra ? `<div class="svc-meta">${clock}${esc(s.extra)}</div>` : ''}
    </div>
    <div class="svc-side"><span class="svc-price">${s.priceKey ? t(s.priceKey) : esc(s.price)}</span></div>
  </div>`;
}

function panel(id) {
  if (id === 'suppl') {
    return SUPPLEMENTS.items.map(supplementItem).join('') + `<p class="svc-note">${t(SUPPLEMENTS.noteKey)}</p>`;
  }
  return SERVICE_CATEGORIES.find(c => c.id === id).services.map(serviceItem).join('');
}

function render() {
  $('svc-menu').innerHTML = `
    <div class="svc-tabs" role="tablist">
      ${TABS.map(tab => `<button class="svc-tab" role="tab" id="tab-${tab.id}" aria-controls="svc-panel"
        aria-selected="${tab.id === active}" data-action="svc-tab" data-tab="${tab.id}">${t(tab.label)}</button>`).join('')}
    </div>
    <div class="svc-panel" id="svc-panel" role="tabpanel" aria-labelledby="tab-${active}">${panel(active)}</div>`;
}

export function renderServiceMenu() {
  render();
  onLangChange(render);
  registerActions({
    'svc-tab': el => {
      active = el.dataset.tab;
      render();
      $('tab-' + active).focus({ preventScroll: true });
    },
  });
  /* Arrow keys move between tabs (standard tab behaviour). */
  $('svc-menu').addEventListener('keydown', e => {
    if (!e.target.matches('.svc-tab') || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const i = TABS.findIndex(tab => tab.id === active);
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    $('tab-' + next.id).click();
  });
}
