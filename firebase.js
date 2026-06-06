  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getFirestore, collection, addDoc, doc, updateDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
  import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDIn0LF69B7bodIUw2yItzUOU-PUmeYpzU",
    authDomain: "achirestaurant-dd2b5.firebaseapp.com",
    projectId: "achirestaurant-dd2b5",
    storageBucket: "achirestaurant-dd2b5.firebasestorage.app",
    messagingSenderId: "925337298046",
    appId: "1:925337298046:web:e233e8cf481575240ce42f"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const COL = 'bookings';

  /* ── EmailJS ── */
  const EMAILJS_SERVICE  = 'service_2rjw0sm';
  const EMAILJS_TEMPLATE = 'template_pbtrcdi';
  const EMAILJS_KEY      = 'EDlPX0xd-miXeB4OW';

  async function sendConfirmationEmail(bk) {
    if (!bk.email) return; // pas d'email → on skip silencieusement
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        to_email:    bk.email,
        client_name: bk.first + ' ' + bk.last,
        service:     bk.service,
        date:        fmtDate(bk.date),
        time:        bk.time,
        duration:    bk.dur,
        price:       bk.price,
      }, EMAILJS_KEY);
    } catch(e) {
      console.warn('EmailJS error (non-blocking):', e);
    }
  }

  /* ── Real-time listener: last 30 days + all future ── */
  function initRealtimeListener() {
    const d30 = new Date(); d30.setDate(d30.getDate() - 30);
    const since = d30.getFullYear() + '-' + String(d30.getMonth()+1).padStart(2,'0') + '-' + String(d30.getDate()).padStart(2,'0');
    const q = query(collection(db, COL), where('date', '>=', since));

    onSnapshot(q, (snap) => {
      bookings = [];
      snap.forEach(d => bookings.push({ _fid: d.id, ...d.data() }));
      nextId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id || 0)) + 1 : 1;

      /* Premier chargement : afficher le tunnel de réservation */
      if (!fbReady) {
        fbReady = true;
        const loader = document.getElementById('fb-loading');
        if (loader) loader.style.display = 'none';
        const st1 = document.getElementById('st1');
        if (st1) st1.style.display = 'block';
      }

      /* Rafraîchir l'admin si connecté */
      if (typeof adminLoggedIn !== 'undefined' && adminLoggedIn) renderAdmin();

      /* Rafraîchir les créneaux si la cliente est sur l'étape 2 */
      const st2 = document.getElementById('st2');
      if (st2 && st2.style.display !== 'none') renderWeek();

    }, (err) => {
      console.error('Firebase onSnapshot error:', err);
      const loader = document.getElementById('fb-loading');
      if (loader) loader.innerHTML = '⚠️ Erreur de connexion. Veuillez recharger la page.';
    });
  }

  /* ── Enregistrer un nouveau RDV ── */
  /* 
   RÈGLES FIRESTORE ACTUELLES (Firebase Console > Firestore > Rules) :
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /bookings/{bookingId} {
         allow read: if true;
         // Clients : création depuis le site uniquement
         allow create: if request.resource.data.source == 'website'
                       && request.resource.data.status == 'confirmed'
                       && request.resource.data.date >= '2026-06-08';
         // Admin : toutes opérations avec source == 'admin'
         allow create, update, delete: if request.resource.data.source == 'admin';
       }
     }
   }
*/
  /* ── Upload photos de référence (max 2, redimensionnées côté client) ── */
  window.fbUploadPhotos = async function(files, fid) {
    const urls = [];
    for (let i = 0; i < Math.min(files.length, 2); i++) {
      const file = files[i];
      const resized = await resizeImage(file, 1200);
      const r = sRef(storage, `bookings/${fid}/${Date.now()}_${i}.jpg`);
      await uploadBytes(r, resized, { contentType: 'image/jpeg' });
      urls.push(await getDownloadURL(r));
    }
    return urls;
  };

  /* Redimensionner une image côté client avant upload */
  function resizeImage(file, maxPx) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(resolve, 'image/jpeg', 0.82);
      };
      img.src = url;
    });
  }

window.fbAddBooking = async function(bk) {
    if (!bk.source) bk.source = 'website'; bk.createdAt = new Date().toISOString();
    const ref = await addDoc(collection(db, COL), bk);
    bk._fid = ref.id;
    nextId = Math.max(nextId, bk.id + 1);
    /* onSnapshot met à jour bookings[] automatiquement */
  };

  /* ── Annuler un RDV ── */
  window.fbCancelBooking = async function(id) {
    const b = bookings.find(b => b.id === id);
    if (!b) return;
    if (b._fid) await updateDoc(doc(db, COL, b._fid), { status: 'cancelled', source: 'admin' });
    /* onSnapshot met à jour bookings[] et re-render automatiquement */
  };

  window.saveBookings = function() {}; // no-op

  /* ── Confirmation client avec protection double-booking + double-clic ── */
  window._fbSubmit = async function(fn, ln, em, ph, msg, photoFiles) {
    const T = TRANS[LANG];

    /* Désactiver le bouton immédiatement */
    const btn = document.getElementById('btn-confirm-bk');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Enregistrement…'; }

    /* Vérifier que le créneau est toujours libre */
    if (isTaken(sel.date, sel.time, sel.svc.dur)) {
      const slotUnavailMsg = {
        fr: 'Ce créneau vient d\'être réservé. Veuillez en choisir un autre.',
        en: 'This slot was just booked. Please choose another one.',
        es: 'Este horario acaba de ser reservado. Por favor elige otro.',
        ru: 'Это время только что было занято. Пожалуйста, выберите другое.'
      };
      const slotUnavailTitle = {
        fr: 'Créneau non disponible', en: 'Slot unavailable',
        es: 'Horario no disponible', ru: 'Время недоступно'
      };
      const slotUnavailBtn = {
        fr: '← Choisir un autre créneau', en: '← Choose another slot',
        es: '← Elegir otro horario', ru: '← Выбрать другое время'
      };
      document.getElementById('s4i').innerHTML = `
        <div style="text-align:center;padding:2rem 0">
          <div style="font-size:2.2rem;margin-bottom:.7rem">😔</div>
          <p style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;margin-bottom:.5rem">${slotUnavailTitle[LANG] || slotUnavailTitle.fr}</p>
          <p style="font-size:.88rem;color:var(--muted);margin-bottom:1.2rem">${slotUnavailMsg[LANG] || slotUnavailMsg.fr}</p>
          <button class="btn-p" onclick="goStep(2)">${slotUnavailBtn[LANG] || slotUnavailBtn.fr}</button>
        </div>`;
      return;
    }

    try {
      const bk = { id: nextId++, first: fn, last: ln, email: em, phone: ph,
        service: sel.svc.name, dur: sel.svc.dur, price: sel.svc.price,
        date: sel.date, time: sel.time, msg, status: 'confirmed' };
      await window.fbAddBooking(bk);
      /* Upload photos si présentes */
      if (photoFiles && photoFiles.length > 0) {
        try {
          const photoUrls = await window.fbUploadPhotos(photoFiles, bk._fid);
          if (photoUrls.length > 0) {
            await updateDoc(doc(db, COL, bk._fid), { photos: photoUrls });
          }
        } catch(pe) {
          console.warn('Photo upload failed (non-blocking):', pe);
        }
      }
      sendConfirmationEmail(bk); // non-blocking
      const successMsg = (T.success_sub || '')
        .replace('{name}', fn).replace('{svc}', sel.svc.name)
        .replace('{date}', fmtDate(sel.date)).replace('{time}', sel.time);
      document.getElementById('s4i').innerHTML = `
        <div class="success-box">
          <div style="font-size:2.8rem;margin-bottom:.7rem">🎉</div>
          <p style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:.5rem">${T.success_title || 'Rendez-vous confirmé !'}</p>
          <p style="font-size:.88rem;color:var(--muted);line-height:1.9;max-width:380px;margin:0 auto">${successMsg}</p>
          <button class="btn-p" style="margin-top:1.4rem" onclick="resetClient()">${T.btn_another || 'Prendre un autre rendez-vous'}</button>
        </div>`;
      sel = { svc: null, date: null, time: null };
    } catch(e) {
      if (btn) { btn.disabled = false; btn.textContent = T.btn_confirm || '✓ Confirmer'; }
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  /* ── Ajout manuel admin ── */
  window._fbSaveModal = async function() {
    const sr = document.getElementById('m-svc').value.split('|');
    const ds = document.getElementById('m-dt').value;
    const time = document.getElementById('m-tm').value.slice(0, 5);
    const fn = document.getElementById('m-fn').value.trim();
    const ln = document.getElementById('m-ln').value.trim();
    if (!ds || !time || !fn || !ln) { alert('Veuillez remplir la prestation, la date, l\'heure, le prénom et le nom.'); return; }
    const bk = { id: nextId++, first: fn, last: ln,
      email: document.getElementById('m-em').value.trim(),
      phone: document.getElementById('m-ph').value.trim(),
      service: sr[0], dur: parseInt(sr[1]), price: sr[2],
      date: ds, time, msg: document.getElementById('m-note').value.trim(), status: 'confirmed', source: 'admin' };
    await window.fbAddBooking(bk);
    sendConfirmationEmail(bk); // non-blocking
    selDay = ds; closeModal();
    /* onSnapshot re-render l'admin automatiquement */
  };

  /* ── Annulation admin ── */
  window._fbCancel = async function(id) {
    if (!confirm('Annuler ce rendez-vous ? Le créneau sera libéré pour les clientes.')) return;
    await window.fbCancelBooking(id);
    /* onSnapshot re-render l'admin automatiquement */
  };

  /* ── Démarrage ── */
  initRealtimeListener();
