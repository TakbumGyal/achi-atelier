/**
 * Local preview with a FAKE database — safe to click anything.
 *
 *   npm run preview        (needs Java; started inside the Firebase emulators)
 *
 * Seeds sample customers and bookings (old, recent, upcoming), serves the
 * site on http://localhost:8101/?emulator and opens it in the browser.
 * Test admin: test@atelierachi.fr / test1234.  No emails are sent.  Stop with Ctrl+C.
 * Nothing here touches the live site or the real database.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8101;
const PROJECT = 'achirestaurant-dd2b5';
const FS = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`;
const AUTH = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1';
const ADMIN = { email: 'test@atelierachi.fr', password: 'test1234' };

/* ── Fake data ── */

const pad = n => String(n).padStart(2, '0');
const day = offset => {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const enc = v => typeof v === 'number' ? { integerValue: String(v) }
  : typeof v === 'boolean' ? { booleanValue: v }
  : { stringValue: v };
const put = (docPath, obj) => fetch(`${FS}/${docPath}`, {
  method: 'PATCH',
  headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields: Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, enc(v)])) }),
});

const CUSTOMERS = [
  { first: 'Sophie', last: 'Martin', email: 'sophie@example.com', phone: '0612345678' },
  { first: 'Camille', last: 'Durand', email: 'camille@example.com', phone: '' },
  { first: 'Léa', last: 'Bernard', email: '', phone: '0698765432' },          // phone only
  { first: 'Emma', last: 'Petit', email: 'emma@example.com', phone: '0601020304' },
  { first: 'Chloé', last: 'Moreau', email: 'chloe@example.com', phone: '' },
];
const SERVICES = [
  ['Semi-permanent', 30, '30€'], ['Manucure spa', 30, '35€'], ['Pose de gel avec semi-permanent', 60, '70€'],
  ['Soin des pieds spa', 45, '45€'], ['Manucure japonaise', 30, '35€'],
];
// [customer, days from today, time, service, extra]
const BOOKINGS = [
  [0, -150, '11:00', 0], [0, -95, '14:00', 1], [0, -60, '11:00', 0], [0, -40, '16:00', 1, { noShow: true }],
  [1, -80, '10:30', 2], [1, -50, '15:00', 2, { status: 'cancelled' }],
  [2, -70, '12:00', 3, { source: 'admin' }],
  [3, -35, '17:00', 4],
  // recent (kept 30 days)
  [0, -12, '11:00', 0], [1, -8, '10:00', 2], [2, -3, '13:00', 3, { source: 'admin' }], [4, -2, '18:00', 1],
  // upcoming
  [0, 2, '11:00', 0], [3, 3, '15:00', 1], [4, 5, '10:30', 4], [1, 9, '16:00', 2],
];

async function seed() {
  await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' });
  await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' });

  const res = await (await fetch(`${AUTH}/accounts:signUp?key=fake`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...ADMIN, returnSecureToken: true }),
  })).json();
  await put(`admins/${res.localId}`, { name: 'Test' });

  let i = 0;
  for (const [c, offset, time, s, extra = {}] of BOOKINGS) {
    const cust = CUSTOMERS[c], [service, dur, price] = SERVICES[s], date = day(offset), id = `demo${++i}`;
    await put(`bookings/${id}`, {
      ...cust, service, dur, price, date, time, msg: i === 13 ? 'Allergie au latex' : '',
      status: 'confirmed', source: 'website', createdAt: 'demo', ...extra,
    });
    if (offset >= 0 && extra.status !== 'cancelled') await put(`slots/${id}`, { date, time, dur });
  }
}

/* ── Static file server ── */

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json',
};

function serve() {
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end('404'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  }).listen(PORT);
}

await seed();
serve();
const url = `http://localhost:${PORT}/?emulator`;
console.log(`
  ✅ Local preview ready (FAKE data — nothing touches the live site)

     ${url}

     Admin login:  ${ADMIN.email}  /  ${ADMIN.password}

  Stop with Ctrl+C.
`);
exec(process.platform === 'win32' ? `start "" "${url}"` : `open "${url}"`);
await new Promise(() => {});   // keep running until Ctrl+C
