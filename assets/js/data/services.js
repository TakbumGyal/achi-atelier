/**
 * The service menu — single source of truth.
 * Used for the price list on the page AND the booking form.
 * To change a price or duration, edit it here only.
 *
 *   name  : French name — the official name, saved with each booking and
 *           shown in the admin panel and statistics
 *   t     : translations shown to visitors in other languages { en, es, ru }
 *   dur   : duration in minutes (drives booking slot length)
 *   price : display string, saved with each booking
 */
import { getLang } from '../i18n.js';

export const SERVICE_CATEGORIES = [
  {
    id: 'mani',
    titleKey: 'cat_mani',
    services: [
      { name: 'Semi-permanent', dur: 30, price: '30€',
        t: { en: 'Gel polish (semi-permanent)', es: 'Esmaltado semipermanente', ru: 'Покрытие гель-лаком' } },
      { name: 'Manucure classique', dur: 20, price: '25€',
        t: { en: 'Classic manicure', es: 'Manicura clásica', ru: 'Классический маникюр' } },
      { name: 'Manucure spa', dur: 30, price: '35€',
        t: { en: 'Spa manicure', es: 'Manicura spa', ru: 'Спа-маникюр' } },
      { name: 'Manucure japonaise', dur: 30, price: '35€',
        t: { en: 'Japanese manicure', es: 'Manicura japonesa', ru: 'Японский маникюр' } },
      { name: 'Manucure avec vernis classique', dur: 30, price: '30€',
        t: { en: 'Manicure with regular polish', es: 'Manicura con esmalte clásico', ru: 'Маникюр с обычным лаком' } },
      { name: 'Manucure avec vernis semi-permanent', dur: 40, price: '43€',
        t: { en: 'Manicure with gel polish', es: 'Manicura con esmalte semipermanente', ru: 'Маникюр с покрытием гель-лаком' } },
      { name: 'Manucure spa avec vernis classique', dur: 45, price: '40€',
        t: { en: 'Spa manicure with regular polish', es: 'Manicura spa con esmalte clásico', ru: 'Спа-маникюр с обычным лаком' } },
      { name: 'Manucure spa avec vernis semi-permanent', dur: 50, price: '53€',
        t: { en: 'Spa manicure with gel polish', es: 'Manicura spa con esmalte semipermanente', ru: 'Спа-маникюр с покрытием гель-лаком' } },
    ],
  },
  {
    id: 'pieds',
    titleKey: 'cat_pieds',
    services: [
      { name: 'Soin des pieds classique', dur: 30, price: '38€',
        t: { en: 'Classic pedicure', es: 'Pedicura clásica', ru: 'Классический педикюр' } },
      { name: 'Soin des pieds spa', dur: 45, price: '45€',
        t: { en: 'Spa pedicure', es: 'Pedicura spa', ru: 'Спа-педикюр' } },
      { name: 'Soin des pieds avec vernis classique', dur: 40, price: '45€',
        t: { en: 'Pedicure with regular polish', es: 'Pedicura con esmalte clásico', ru: 'Педикюр с обычным лаком' } },
      { name: 'Soin des pieds avec vernis semi-permanent', dur: 50, price: '55€',
        t: { en: 'Pedicure with gel polish', es: 'Pedicura con esmalte semipermanente', ru: 'Педикюр с покрытием гель-лаком' } },
      { name: 'Soin des pieds spa avec vernis classique', dur: 50, price: '50€',
        t: { en: 'Spa pedicure with regular polish', es: 'Pedicura spa con esmalte clásico', ru: 'Спа-педикюр с обычным лаком' } },
      { name: 'Soin des pieds spa avec vernis semi-permanent', dur: 55, price: '65€',
        t: { en: 'Spa pedicure with gel polish', es: 'Pedicura spa con esmalte semipermanente', ru: 'Спа-педикюр с покрытием гель-лаком' } },
    ],
  },
  {
    id: 'complet',
    titleKey: 'cat_complet',
    services: [
      { name: 'Soin complet mains et pieds sans vernis', dur: 60, price: '55€',
        t: { en: 'Manicure & pedicure, no polish', es: 'Manicura y pedicura sin esmalte', ru: 'Маникюр и педикюр без покрытия' } },
      { name: 'Soin complet spa mains et pieds sans vernis', dur: 60, price: '65€',
        t: { en: 'Spa manicure & pedicure, no polish', es: 'Manicura y pedicura spa sin esmalte', ru: 'Спа-маникюр и педикюр без покрытия' } },
      { name: 'Soin complet mains et pieds avec vernis classique', dur: 70, price: '60€',
        t: { en: 'Manicure & pedicure with regular polish', es: 'Manicura y pedicura con esmalte clásico', ru: 'Маникюр и педикюр с обычным лаком' } },
      { name: 'Soin complet mains et pieds avec vernis semi-permanent', dur: 80, price: '85€',
        t: { en: 'Manicure & pedicure with gel polish', es: 'Manicura y pedicura con esmalte semipermanente', ru: 'Маникюр и педикюр с покрытием гель-лаком' } },
      { name: 'Soin complet spa mains et pieds avec vernis classique', dur: 80, price: '75€',
        t: { en: 'Spa manicure & pedicure with regular polish', es: 'Manicura y pedicura spa con esmalte clásico', ru: 'Спа-маникюр и педикюр с обычным лаком' } },
      { name: 'Soin complet spa mains et pieds avec vernis semi-permanent', dur: 90, price: '105€',
        t: { en: 'Spa manicure & pedicure with gel polish', es: 'Manicura y pedicura spa con esmalte semipermanente', ru: 'Спа-маникюр и педикюр с покрытием гель-лаком' } },
    ],
  },
  {
    id: 'pose',
    titleKey: 'cat_pose',
    services: [
      { name: 'Gel X avec semi-permanent', dur: 60, price: '60€',
        t: { en: 'Gel X extensions with gel polish', es: 'Extensiones Gel X con esmalte semipermanente', ru: 'Наращивание Gel X с покрытием гель-лаком' } },
      { name: 'Pose de résine avec semi-permanent', dur: 60, price: '60€',
        t: { en: 'Acrylic nails with gel polish', es: 'Uñas acrílicas con esmalte semipermanente', ru: 'Акриловое наращивание с покрытием гель-лаком' } },
      { name: 'Pose de gel avec semi-permanent', dur: 60, price: '70€',
        t: { en: 'Gel nails with gel polish', es: 'Uñas de gel con esmalte semipermanente', ru: 'Наращивание гелем с покрытием гель-лаком' } },
      { name: 'Remplissage résine avec semi-permanent', dur: 50, price: '55€',
        t: { en: 'Acrylic infill with gel polish', es: 'Relleno acrílico con esmalte semipermanente', ru: 'Коррекция акрила с покрытием гель-лаком' } },
      { name: 'Remplissage gel avec semi-permanent', dur: 50, price: '65€',
        t: { en: 'Gel infill with gel polish', es: 'Relleno de gel con esmalte semipermanente', ru: 'Коррекция геля с покрытием гель-лаком' } },
    ],
  },
];

/* Add-ons: shown in the price list only (not bookable on their own). */
export const SUPPLEMENTS = {
  titleKey: 'cat_suppl',
  noteKey: 'suppl_note',
  items: [
    { name: 'Renforcement', extra: '+10 min', price: '+10€',
      t: { en: 'Strengthening', es: 'Refuerzo', ru: 'Укрепление' } },
    { name: "Réparation d'un ongle", extra: '+5 min', price: '+7€',
      t: { en: 'Single nail repair', es: 'Reparación de una uña', ru: 'Ремонт одного ногтя' } },
    { name: 'French', price: '+10€',
      t: { en: 'French tips', es: 'Francesa', ru: 'Френч' } },
    { name: 'Chrome', price: '+10€',
      t: { en: 'Chrome', es: 'Efecto cromado', ru: 'Хромовое покрытие' } },
    { name: 'Cat Eyes', price: '+10€',
      t: { en: 'Cat eye', es: 'Ojo de gato', ru: '«Кошачий глаз»' } },
    { name: 'Nail art & designs', priceKey: 'price_devis',
      t: { en: 'Nail art & designs', es: 'Nail art y diseños', ru: 'Дизайн ногтей' } },
    { name: 'Manucure préparatoire avant pose', extra: '+15 min', price: '+15€',
      t: { en: 'Prep manicure before extensions', es: 'Manicura previa a la colocación', ru: 'Подготовительный маникюр перед наращиванием' } },
  ],
};

/* Flat list of everything that can be booked online. */
export const BOOKABLE_SERVICES = SERVICE_CATEGORIES.flatMap(cat =>
  cat.services.map(s => ({ ...s, category: cat.id })),
);

const BY_NAME = new Map([...BOOKABLE_SERVICES, ...SUPPLEMENTS.items].map(s => [s.name, s]));

/** Service name in the visitor's language (falls back to the French name). */
export function serviceLabel(name, lang = getLang()) {
  return (lang !== 'fr' && BY_NAME.get(name)?.t?.[lang]) || name;
}

/* Words scrolling in the dark banner under the hero. */
const MARQUEE = {
  fr: ['Manucure Classique', 'Manucure Spa', 'Pose de Gel', 'Gel X', 'Semi-permanent', 'Soin des Pieds', 'Nail Art', 'Remplissage', 'Renforcement'],
  en: ['Classic Manicure', 'Spa Manicure', 'Gel Nails', 'Gel X', 'Gel Polish', 'Pedicure', 'Nail Art', 'Infills', 'Strengthening'],
  es: ['Manicura Clásica', 'Manicura Spa', 'Uñas de Gel', 'Gel X', 'Semipermanente', 'Pedicura', 'Nail Art', 'Relleno', 'Refuerzo'],
  ru: ['Классический маникюр', 'Спа-маникюр', 'Гелевые ногти', 'Gel X', 'Гель-лак', 'Педикюр', 'Дизайн ногтей', 'Коррекция', 'Укрепление'],
};
export const marqueeItems = (lang = getLang()) => MARQUEE[lang] || MARQUEE.fr;
