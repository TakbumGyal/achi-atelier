/* Entry point — loaded from index.html as an ES module. */
import { renderServiceMenu } from './menu.js';
import { initBooking } from './booking.js';
import { initAdmin } from './admin.js';
import { initUI } from './ui.js';
import { connect } from './db.js';

renderServiceMenu();
initBooking();
initAdmin();
initUI();
connect();
