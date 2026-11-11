# Atelier Achi — Nail Studio website

Website and online booking for **Atelier Achi**, nail studio at 9 rue Trousseau, Paris 11.
Live at **https://www.atelierachi.com** (GitHub Pages, deployed from the `main` branch).

Plain HTML / CSS / JavaScript — no build step, no dependencies to install.
Bookings are stored in **Firebase Firestore**; confirmation emails go through **EmailJS**.

## Project structure

```
index.html                  Page markup (all sections)
CNAME                       Custom domain for GitHub Pages
firestore.rules             Firestore security rules (copy into Firebase console)
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

## Run locally

The site uses ES modules, so it must be served over HTTP (opening the file directly won't work):

```bash
npx serve .
# or
python -m http.server 8000
```

> ⚠️ The local site talks to the **live** Firestore database. Bookings you make while
> testing are real — cancel them from the admin panel afterwards.

## Deploy

Push to `main` — GitHub Pages publishes automatically within a minute or two.
Work on a branch and open a pull request if you want to review changes first.
