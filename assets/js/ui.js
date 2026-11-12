/* Page interactions: header, mobile menu, mobile booking bar, map,
   gallery lightbox, scroll-in reveal, footer year. */
import { $, registerActions } from './utils/dom.js';
import { t } from './i18n.js';

/* Header gets a background once the page is scrolled. */
function initHeader() {
  const hdr = $('navbar');
  const update = () => hdr.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMobileMenu() {
  const menu = $('mobile-menu');
  const burger = document.querySelector('.hdr-burger');
  const setOpen = open => {
    if (open) showSalonStatus();
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    document.body.classList.toggle('menu-open', open);
  };
  registerActions({
    'toggle-menu': () => setOpen(!menu.classList.contains('open')),
    'close-menu': () => setOpen(false),
  });
  /* Close after following a link or opening booking (a language change keeps it open). */
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

/* "Open now / Opens at 10 / Closed" in the menu, from Paris time
   (Tuesday – Sunday, 10:00 – 20:00, closed on Monday). */
function showSalonStatus() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  const h = Number(p.hour), workday = p.weekday !== 'Mon';
  const state = workday && h >= 10 && h < 20 ? 'open' : workday && h < 10 ? 'soon' : 'closed';
  const txt = $('mm-status-txt');
  txt.dataset.i18n = 'status_' + state;   // re-translated automatically on language change
  txt.textContent = t('status_' + state);
  $('mm-status').dataset.state = state;
}

/* Phones: small language picker in the header. */
function initLangPicker() {
  const btn = document.querySelector('.lang-mini-btn');
  const pop = $('lang-pop');
  const setOpen = open => { pop.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  registerActions({ 'toggle-lang': () => setOpen(pop.hidden) });
  document.addEventListener('click', e => {
    if (!e.target.closest('.lang-mini') || e.target.closest('.lb')) setOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

/* Phones: "Appeler / Réserver" bar appears once the visitor scrolls past the hero. */
function initMobileBar() {
  const bar = $('mobile-bar');
  let bookingOpen = false;
  const update = () => bar.classList.toggle('show', !bookingOpen && window.scrollY > window.innerHeight * 0.6);
  window.addEventListener('scroll', update, { passive: true });
  document.addEventListener('booking:open', () => { bookingOpen = true; update(); });
  document.addEventListener('booking:close', () => { bookingOpen = false; update(); });
  update();
  // Slide the bar away while the dark footer is visible (it would cover it with a light band).
  const footer = document.querySelector('.site-footer');
  if (footer) new IntersectionObserver(([e]) => bar.classList.toggle('over-footer', e.isIntersecting)).observe(footer);
}

/* Google Maps is only loaded when the visitor asks for it, so Google can't
   set cookies before the visitor's choice (CNIL rules) — and the page is lighter. */
const MAP_URL = 'https://maps.google.com/maps?q=9+rue+Trousseau+Paris+75011&output=embed';

function initMap() {
  registerActions({
    'show-map': () => {
      const box = $('map-box');
      box.classList.remove('map-facade');
      box.innerHTML = `<iframe src="${MAP_URL}" allowfullscreen title="Atelier Achi — 9 rue Trousseau Paris 11"></iframe>`;
    },
  });
}

/* Gallery: full-screen viewer with previous/next, arrow keys and swipe. */
function initLightbox() {
  const box = $('lightbox');
  const items = [...document.querySelectorAll('#gal-grid .gal-item img')];
  let index = 0, opener = null;

  const showPhoto = i => {
    index = (i + items.length) % items.length;
    const img = items[index];
    const src = img.currentSrc || img.src;
    $('lb-img').src = src;
    $('lb-img').alt = img.alt;
    $('lb-caption').textContent = `${img.alt} · ${t('photo_of').replace('{n}', index + 1).replace('{total}', items.length)}`;
  };
  const open = el => {
    opener = el;
    // lazy images may not be loaded yet — make sure the chosen one is
    items.forEach(img => { img.loading = 'eager'; });
    showPhoto(+el.dataset.index);
    box.hidden = false;
    document.body.classList.add('no-scroll');
    box.querySelector('.lb-close').focus({ preventScroll: true });
  };
  const close = () => {
    box.hidden = true;
    document.body.classList.remove('no-scroll');
    opener?.focus({ preventScroll: true });
  };

  registerActions({
    'open-photo': open,
    'close-photo': close,
    'prev-photo': () => showPhoto(index - 1),
    'next-photo': () => showPhoto(index + 1),
  });
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showPhoto(index - 1);
    if (e.key === 'ArrowRight') showPhoto(index + 1);
  });
  let startX = null;
  box.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) showPhoto(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
}

/* Hero slideshow: the 3 photos fade into each other every 5 s, with a slow zoom.
   Paused when the tab is hidden; still image for visitors who reduce motion. */
function initHeroSlides() {
  // Phones/tablets don't show the photo block at all (see site.css), so no slideshow there.
  if (matchMedia('(max-width: 900px)').matches) return;
  const slides = [...document.querySelectorAll('#hero-slides .hero-slide')];
  if (slides.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0, timer = null;
  const next = () => {
    slides[i].classList.remove('on');
    i = (i + 1) % slides.length;
    slides[i].classList.add('on');
  };
  const start = () => { if (!timer) timer = setInterval(next, 5000); };
  const stop = () => { clearInterval(timer); timer = null; };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}

/* Gift card tilts gently towards the mouse (computers only, and not for
   visitors who asked their device to reduce motion). */
function initGiftCard() {
  const card = $('gcard');
  if (!card || matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
  const area = card.closest('.gift-visual');
  area.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;    // -0.5 … 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`);
  });
  area.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
}

/* Reviews: one row; arrows scroll one review at a time (computers).
   Phones swipe the same row. */
function initReviews() {
  const grid = $('rv-grid');
  if (!grid) return;
  const prev = document.querySelector('.rv-prev'), next = document.querySelector('.rv-next');
  const step = () => {
    const card = grid.querySelector('.rv-card');
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(grid).columnGap || 0) : grid.clientWidth;
  };
  const maxScroll = () => grid.scrollWidth - grid.clientWidth;
  let target = null;   // where the last click is heading (so fast clicks add up)
  const update = () => {
    const pos = target ?? grid.scrollLeft;
    prev.disabled = pos <= 8;
    next.disabled = pos >= maxScroll() - 8;
  };
  const go = dir => {
    const s = step();
    const from = target ?? grid.scrollLeft;
    target = Math.max(0, Math.min(maxScroll(), (Math.round(from / s) + dir) * s));
    grid.scrollTo({ left: target, behavior: 'smooth' });
    update();
  };
  grid.addEventListener('scrollend', () => { target = null; update(); });
  registerActions({
    'rv-prev': () => go(-1),
    'rv-next': () => go(1),
  });
  grid.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* Sections fade in gently as they come into view. */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('vis')); return; }
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

export function initUI() {
  initHeader();
  initMobileMenu();
  initLangPicker();
  initMobileBar();
  initMap();
  initLightbox();
  initHeroSlides();
  initGiftCard();
  initReviews();
  initReveal();
  $('footer-year').textContent = new Date().getFullYear();
}
