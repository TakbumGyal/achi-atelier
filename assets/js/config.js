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
export const BOOKINGS_COLLECTION = 'bookings';
export const SETTINGS_DOC = ['settings', 'config'];

/* EmailJS — sends the booking confirmation email. */
export const EMAILJS = {
  serviceId: 'service_2rjw0sm',
  templateId: 'template_pbtrcdi',
  publicKey: 'EDlPX0xd-miXeB4OW',
};

/* SHA-256 of the admin password. */
export const ADMIN_PW_HASH = '2b7cccaf9ae588b9b85399d000fc5b47b766dd723b028ac26c68d020da21889b';
