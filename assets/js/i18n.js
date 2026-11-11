import { TRANSLATIONS } from './data/translations.js';
import { formatDateStr } from './utils/dates.js';
import { registerActions } from './utils/dom.js';

const DEFAULT_LANG = 'fr';
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

/** Re-apply translations to every [data-i18n] element under `root`. */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const value = TRANSLATIONS[lang]?.[el.dataset.i18n];
    if (value !== undefined) el.innerHTML = value;
  });
}

export function setLang(next) {
  if (!TRANSLATIONS[next]) return;
  lang = next;
  document.documentElement.lang = next;
  document.querySelectorAll('.lb[data-lang]').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === next));
  applyTranslations();
  listeners.forEach(fn => fn(next));
}

registerActions({
  lang: el => setLang(el.dataset.lang),
});
