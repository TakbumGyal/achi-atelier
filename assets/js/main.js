/* Entry point of the public site — loaded from index.html as an ES module.
   (The admin panel lives on its own private page: admin.html.) */
import { renderServiceMenu } from './menu.js';
import { initBooking, openBooking } from './booking.js';
import { initUI } from './ui.js';
import { connect } from './db.js';
import { setLang, initialLang } from './i18n.js';

renderServiceMenu();
initBooking();
initUI();

/* Show the site in the visitor's language (?lang=xx, or her last choice). */
const startLang = initialLang();
if (startLang !== 'fr') setLang(startLang);

/* Old links / bookmarks to "#booking" open the booking panel. */
if (location.hash === '#booking') openBooking();

/* Load availability once the page has shown (so it doesn't compete with the
   photos). Opening the booking panel starts it immediately if needed. */
if (document.readyState === 'complete') connect().catch(() => {});
else window.addEventListener('load', () => connect().catch(() => {}), { once: true });
