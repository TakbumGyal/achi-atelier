export const $ = id => document.getElementById(id);

/** Escape text before inserting it into innerHTML (prevents HTML injection
    from names or messages typed into the booking form). */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const show = (el, visible = true, display = 'block') => {
  if (el) el.style.display = visible ? display : 'none';
};

export const isShown = el => !!el && el.style.display !== 'none';

/* ── Click actions ──
   Elements declare  data-action="name"  in the HTML; modules register a
   handler for that name. One delegated listener replaces inline onclick=. */
const actions = {};

export function registerActions(map) {
  Object.assign(actions, map);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = actions[el.dataset.action];
  if (fn) fn(el, e);
});

/* Non-button elements with role="button" respond to Enter / Space too. */
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-action]')) {
    e.preventDefault();
    e.target.click();
  }
});
