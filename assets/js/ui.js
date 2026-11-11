/* Page chrome: loader, custom cursor, navbar, mobile menu, marquee,
   scroll-in animations, footer year. */
import { $, registerActions } from './utils/dom.js';
import { MARQUEE_ITEMS } from './data/services.js';

const LOADER_MS = 350;      // brief brand flash — no longer waits for every image
const MARQUEE_REPEAT = 4;

/* Hide the intro screen as soon as the page is ready to use. */
function initLoader() {
  setTimeout(() => $('loader').classList.add('hide'), LOADER_MS);
}

/* Dot + trailing ring that follow the mouse (desktop only). */
function initCursor() {
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const dot = $('cur'), ring = $('cur-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });
  (function follow() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(follow);
  })();
}

function initNavbar() {
  const nav = $('navbar');
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMobileMenu() {
  const menu = $('mobile-menu');
  registerActions({
    'toggle-menu': () => menu.classList.toggle('open'),
    'close-menu': () => menu.classList.remove('open'),
  });
  /* Close after following a link or picking a language. */
  menu.addEventListener('click', e => {
    if (e.target.closest('a, .lb')) menu.classList.remove('open');
  });
}

function initMarquee() {
  const items = MARQUEE_ITEMS.map(it => `<span class="mq-item">${it}<span class="mq-dot"></span></span>`).join('');
  $('mqt').innerHTML = items.repeat(MARQUEE_REPEAT);
}

function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('vis');
  }), { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

export function initUI() {
  initLoader();
  initCursor();
  initNavbar();
  initMobileMenu();
  initMarquee();
  initScrollAnimations();
  $('footer-year').textContent = new Date().getFullYear();
}
