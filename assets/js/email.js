import { EMAILJS, USE_EMULATOR } from './config.js';
import { formatDate } from './i18n.js';

const EMAILJS_SDK = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
let sdk = null;

/** Load the EmailJS library only when it's needed (not for every visitor). */
export function loadEmailJs() {
  if (USE_EMULATOR) return Promise.resolve(null);
  sdk ||= new Promise((resolve, reject) => {
    const s = Object.assign(document.createElement('script'), { src: EMAILJS_SDK, async: true });
    s.onload = () => resolve(window.emailjs);
    s.onerror = () => { sdk = null; reject(new Error('EmailJS failed to load')); };
    document.head.appendChild(s);
  });
  return sdk;
}

/** Send the booking confirmation email. Never throws — email is best-effort. */
export async function sendConfirmationEmail(bk) {
  if (!bk.email) return;
  const params = {
    to_email: bk.email,
    client_name: `${bk.first} ${bk.last}`,
    service: bk.service,
    date: formatDate(bk.date),
    time: bk.time,
    duration: bk.dur,
    price: bk.price,
  };
  /* Local preview / tests: never send real emails. */
  if (USE_EMULATOR) {
    console.info('[preview] Email NOT sent (local test):', params);
    return;
  }
  try {
    const emailjs = await loadEmailJs();
    await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, params, EMAILJS.publicKey);
  } catch (err) {
    console.warn('EmailJS error (non-blocking):', err);
  }
}
