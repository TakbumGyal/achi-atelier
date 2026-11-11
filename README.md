# Atelier Achi — Nail Studio website

Website and online booking for **Atelier Achi**, nail studio at 9 rue Trousseau, Paris 11.
Live at **https://www.atelierachi.com** (GitHub Pages, deployed from the `main` branch).

Plain HTML / CSS / JavaScript — no build step, no dependencies to install.
Bookings are stored in **Firebase Firestore**; confirmation emails go through **EmailJS**.

## Project structure

```
index.html                  Page markup (all sections)
CNAME                       Custom domain for GitHub Pages
firestore.rules             Firestore security rules (publish in Firebase console)
firebase.json, package.json Local testing only (emulator, rule tests) — not used by the live site
tests/                      Security-rules tests
assets/
  css/
    base.css                Colours, fonts, buttons, form fields, animations
    sections.css            Navbar, hero, about, services, gallery, contact, footer
    booking.css             Client booking flow
    admin.css               Admin dashboard + "add booking" modal
    responsive.css          Mobile / tablet breakpoints
  js/
    main.js                 Entry point — starts everything
    config.js               Opening hours, capacity, Firebase / EmailJS keys
    data/
      services.js           ★ Services, prices, durations, add-ons
      translations.js       ★ All text in FR / EN / ES / RU
    i18n.js                 Language switching
    menu.js                 Builds the price list from services.js
    booking.js              4-step client booking flow
    availability.js         Which time slots are free
    admin.js                Admin dashboard
    db.js                   Firestore connection (live bookings + settings)
    email.js                Confirmation email via EmailJS
    ui.js                   Loader, cursor, navbar, mobile menu, marquee, animations
    utils/                  Small date + DOM helpers
  img/                      Logo, hero, about/ and gallery/ photos
  icons/                    Favicons
```

## Common edits

| I want to…                         | Edit                                                     |
|------------------------------------|----------------------------------------------------------|
| Change a price or duration         | `assets/js/data/services.js` (updates the price list **and** booking) |
| Add / remove a service             | `assets/js/data/services.js`                              |
| Change any text or a translation   | `assets/js/data/translations.js`                          |
| Change opening hours / closed day  | `assets/js/config.js` **and** the hours text in `translations.js` |
| Replace a photo                    | Overwrite the file in `assets/img/` with the same name    |
| Change colours / fonts             | Variables at the top of `assets/css/base.css`             |

## Security model

- **`bookings`** (customer name, email, phone…) can only be read by a logged-in admin.
- **`slots`** holds only date / time / duration and is public — the booking calendar uses it.
  Each booking and its slot are written together; the rules reject one without the other.
- **Admins** sign in with Firebase Authentication (email + password). An account is an admin
  only if a document `admins/{its user id}` exists — the website can never create one.
- The rules live in `firestore.rules` and must be **published in the Firebase console**
  (Firestore Database → Rules) after any change.

### Add an admin

1. Firebase console → Authentication → Users → *Add user* (email + strong password).
2. Copy the new user's **User UID**.
3. Firestore Database → Data → collection `admins` → *Add document* → Document ID = that UID
   (add any field, e.g. `name: "Salon"`).

To remove an admin, delete their `admins` document and the user in Authentication.

## Run locally

The site uses ES modules, so it must be served over HTTP (opening the file directly won't work):

```bash
npx serve .
```

> ⚠️ Opened normally, the local site talks to the **live** database — bookings you make are real.

To test safely against a local fake database instead (needs Java):

```bash
npm install
npm run emulators            # local Firestore + Auth
npx serve .                  # in a second terminal
# open http://localhost:3000/?emulator
```

### Test the security rules

```bash
npm install
npm run test:rules
```

## Deploy

Push to `main` — GitHub Pages publishes automatically within a minute or two.
Work on a branch and open a pull request if you want to review changes first.
