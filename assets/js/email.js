import { EMAILJS, USE_EMULATOR } from './config.js';
import { formatDate } from './i18n.js';

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
  if (!window.emailjs) return;
  try {
    await window.emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, params, EMAILJS.publicKey);
  } catch (err) {
    console.warn('EmailJS error (non-blocking):', err);
  }
}
