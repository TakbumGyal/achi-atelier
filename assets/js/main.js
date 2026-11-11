/* Entry point — loaded from index.html as an ES module. */
import { renderServiceMenu } from './menu.js';
import { initBooking } from './booking.js';
import { initUI } from './ui.js';
import { connect } from './db.js';
import { $, registerActions, keepBelowNavbar } from './utils/dom.js';

renderServiceMenu();
initBooking();
initUI();

/* Booking tabs. The admin code (and Firebase Auth) is only downloaded when
   someone actually opens "Espace Admin" — normal visitors never load it. */
registerActions({
  'booking-tab': el => {
    const tab = el.dataset.tab;
    ['client', 'admin'].forEach(x => {
      $('bkt-' + x).classList.toggle('active', x === tab);
      $('bp-' + x).classList.toggle('active', x === tab);
    });
    keepBelowNavbar($('bkt-client').parentElement);
    if (tab === 'admin') import('./admin/index.js').then(m => m.openAdmin());
  },
});

/* Load availability (Firestore) after the page has shown, so it doesn't
   compete with the photos — or right away if the visitor heads to booking. */
let started = false;
const startDb = () => { if (!started) { started = true; connect().catch(() => {}); } };
if (document.readyState === 'complete') startDb();
else window.addEventListener('load', startDb, { once: true });
new IntersectionObserver((entries, obs) => {
  if (entries.some(e => e.isIntersecting)) { startDb(); obs.disconnect(); }
}, { rootMargin: '1200px' }).observe($('booking'));
