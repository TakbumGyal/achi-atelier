/* Legal page (mentions-legales.html): show the version in the visitor's
   language — same choice as on the main site (shared localStorage key). */
const LANGS = ['fr', 'en', 'es', 'ru'];
const STORAGE_KEY = 'achi-lang';
const BACK = { fr: '← Retour au site', en: '← Back to the website', es: '← Volver al sitio', ru: '← Вернуться на сайт' };
const TITLE = {
  fr: 'Mentions légales & confidentialité — Atelier Achi',
  en: 'Legal notice & privacy — Atelier Achi',
  es: 'Aviso legal y privacidad — Atelier Achi',
  ru: 'Правовая информация и конфиденциальность — Atelier Achi',
};

function startLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch { /* storage unavailable */ }
  return 'fr';
}

function show(lang) {
  document.querySelectorAll('main[data-lang]').forEach(m => { m.hidden = m.dataset.lang !== lang; });
  document.querySelectorAll('[data-set-lang]').forEach(b => b.classList.toggle('active', b.dataset.setLang === lang));
  document.querySelectorAll('[data-back]').forEach(a => { a.textContent = BACK[lang]; });
  document.documentElement.lang = lang;
  document.title = TITLE[lang];
}

document.querySelectorAll('[data-set-lang]').forEach(btn => btn.addEventListener('click', () => {
  const lang = btn.dataset.setLang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* not remembered */ }
  show(lang);
  window.scrollTo({ top: 0 });
}));

show(startLang());

/* Links like "mentions-legales.html#confidentialite" from the main site:
   jump to that section in the shown language. */
const hash = location.hash.slice(1);
if (hash && !document.getElementById(hash)) {
  const target = document.getElementById(`${document.documentElement.lang}-${hash}`);
  if (target) target.scrollIntoView();
}
