/**
 * Site-wide settings. Everything the salon might need to change
 * (hours, capacity, third-party keys) lives here.
 */

export const SALON = {
  openMin: 10 * 60,       // opening time, in minutes after midnight (10:00)
  closeMin: 20 * 60,      // closing time (20:00)
  closedWeekday: 1,       // 0 = Sunday, 1 = Monday, …
  slotStepMin: 10,        // booking slots are offered every N minutes
  maxCapacity: 1,         // overlapping bookings allowed at the same time
  historyDays: 30,        // past bookings loaded into the admin view
};

/* Firebase web config — these keys are public by design; access is
   controlled by the Firestore security rules (see firestore.rules). */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDIn0LF69B7bodIUw2yItzUOU-PUmeYpzU',
  authDomain: 'achirestaurant-dd2b5.firebaseapp.com',
  projectId: 'achirestaurant-dd2b5',
  storageBucket: 'achirestaurant-dd2b5.firebasestorage.app',
  messagingSenderId: '925337298046',
  appId: '1:925337298046:web:e233e8cf481575240ce42f',
};
export const FIREBASE_SDK_URL = 'https://www.gstatic.com/firebasejs/12.13.0/';
export const COLLECTIONS = {
  bookings: 'bookings',   // customer details — admin only
  slots: 'slots',         // public availability (date, time, duration)
  admins: 'admins',       // one doc per admin user id
};
export const SETTINGS_DOC = ['settings', 'config'];

/* Local testing against the Firebase emulator: open the site on localhost
   with ?emulator in the URL (see README). Never used on the live site. */
export const USE_EMULATOR =
  ['localhost', '127.0.0.1'].includes(location.hostname) &&
  new URLSearchParams(location.search).has('emulator');

/* EmailJS — sends the booking confirmation email. */
export const EMAILJS = {
  serviceId: 'service_2rjw0sm',
  templateId: 'template_pbtrcdi',
  publicKey: 'EDlPX0xd-miXeB4OW',
};
