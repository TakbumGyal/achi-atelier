/* Renders the price list in the "Soins" section from data/services.js. */
import { $, esc } from './utils/dom.js';
import { t } from './i18n.js';
import { SERVICE_CATEGORIES, SUPPLEMENTS } from './data/services.js';
import { formatDuration } from './utils/dates.js';

function row(name, meta, price, priceKey) {
  const priceAttr = priceKey ? ` data-i18n="${priceKey}"` : '';
  return `<div class="svc-row">
    <span class="svc-name">${esc(name)}${meta ? `<span class="svc-meta">${esc(meta)}</span>` : ''}</span>
    <span class="svc-price"${priceAttr}>${priceKey ? t(priceKey) : esc(price)}</span>
  </div>`;
}

const categoryTitle = key => `<div class="svc-cat-title" data-i18n="${key}">${t(key)}</div>`;

export function renderServiceMenu() {
  const categories = SERVICE_CATEGORIES.map(cat => `
    <div class="svc-cat">
      ${categoryTitle(cat.titleKey)}
      ${cat.services.map(s => row(s.name, formatDuration(s.dur), s.price)).join('')}
    </div>`);

  const supplements = `
    <div class="svc-cat">
      ${categoryTitle(SUPPLEMENTS.titleKey)}
      ${SUPPLEMENTS.items.map(s => row(s.name, s.extra, s.price, s.priceKey)).join('')}
      <p class="supplement-note" data-i18n="${SUPPLEMENTS.noteKey}">${t(SUPPLEMENTS.noteKey)}</p>
    </div>`;

  $('svc-menu').innerHTML = categories.join('') + supplements;
}
