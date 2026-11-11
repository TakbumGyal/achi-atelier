/* Entry point of the private admin page (admin.html). The admin interface is in French. */
import { connect } from '../db.js';
import { openAdmin } from './index.js';

connect().catch(() => {});
openAdmin();
