import { TRANSLATIONS } from './data/translations.js';
import { formatDateStr } from './utils/dates.js';
import { registerActions } from './utils/dom.js';

export const LANGS = ['fr', 'en', 'es', 'ru'];
const DEFAULT_LANG = 'fr';
const STORAGE_KEY = 'achi-lang';   // shared with the legal page (assets/js/legal.js)
let lang = DEFAULT_LANG;
const listeners = new Set();

export const getLang = () => lang;

/** Translated string for `key` in the current language (falls back to French). */
export function t(key) {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS[DEFAULT_LANG][key] ?? key;
}

/** Format a 'YYYY-MM-DD' string with the current language's month names. */
export const formatDate = ds => formatDateStr(ds, t('month_abbr'));

/** Call `fn` whenever the language changes (to re-render dynamic content). */
export const onLangChange = fn => listeners.add(fn);

/**
 * Re-apply translations under `root`:
 *   data-i18n="key"             → element content (may contain simple HTML)
 *   data-i18n-alt="key"         → image description (alt)
 *   data-i18n-placeholder="key" → input placeholder
 */
export function applyTranslations(root = document) {
  const T = TRANSLATIONS[lang] || {};
  root.querySelectorAll('[data-i18n]').forEach(el => {
    if (T[el.dataset.i18n] !== undefined) el.innerHTML = T[el.dataset.i18n];
  });
  root.querySelectorAll('[data-i18n-alt]').forEach(el => {
    if (T[el.dataset.i18nAlt] !== undefined) el.alt = T[el.dataset.i18nAlt];
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    if (T[el.dataset.i18nPlaceholder] !== undefined) el.placeholder = T[el.dataset.i18nPlaceholder];
  });
}

export function setLang(next) {
  if (!TRANSLATIONS[next]) return;
  lang = next;
  document.documentElement.lang = next;
  document.querySelectorAll('.lb[data-lang]').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === next));
  try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode: not remembered */ }
  applyTranslations();
  listeners.forEach(fn => fn(next));
}

/** Language to start with: ?lang=xx in the URL, else the visitor's last choice, else French. */
export function initialLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch { /* storage unavailable */ }
  return DEFAULT_LANG;
}

registerActions({
  lang: el => setLang(el.dataset.lang),
});
