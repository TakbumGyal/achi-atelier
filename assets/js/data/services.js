/**
 * The service menu — single source of truth.
 * Used for the price list on the page AND the booking form.
 * To change a price or duration, edit it here only.
 *
 *   name  : shown as-is in every language
 *   dur   : duration in minutes (drives booking slot length)
 *   price : display string, saved with each booking
 */

export const SERVICE_CATEGORIES = [
  {
    id: 'mani',
    titleKey: 'cat_mani',
    services: [
      { name: 'Semi-permanent', dur: 30, price: '30€' },
      { name: 'Manucure classique', dur: 20, price: '25€' },
      { name: 'Manucure spa', dur: 30, price: '35€' },
      { name: 'Manucure japonaise', dur: 30, price: '35€' },
      { name: 'Manucure avec vernis classique', dur: 30, price: '30€' },
      { name: 'Manucure avec vernis semi-permanent', dur: 40, price: '43€' },
      { name: 'Manucure spa avec vernis classique', dur: 45, price: '40€' },
      { name: 'Manucure spa avec vernis semi-permanent', dur: 50, price: '53€' },
    ],
  },
  {
    id: 'pieds',
    titleKey: 'cat_pieds',
    services: [
      { name: 'Soin des pieds classique', dur: 30, price: '38€' },
      { name: 'Soin des pieds spa', dur: 45, price: '45€' },
      { name: 'Soin des pieds avec vernis classique', dur: 40, price: '45€' },
      { name: 'Soin des pieds avec vernis semi-permanent', dur: 50, price: '55€' },
      { name: 'Soin des pieds spa avec vernis classique', dur: 50, price: '50€' },
      { name: 'Soin des pieds spa avec vernis semi-permanent', dur: 55, price: '65€' },
    ],
  },
  {
    id: 'complet',
    titleKey: 'cat_complet',
    services: [
      { name: 'Soin complet mains et pieds sans vernis', dur: 60, price: '55€' },
      { name: 'Soin complet spa mains et pieds sans vernis', dur: 60, price: '65€' },
      { name: 'Soin complet mains et pieds avec vernis classique', dur: 70, price: '60€' },
      { name: 'Soin complet mains et pieds avec vernis semi-permanent', dur: 80, price: '85€' },
      { name: 'Soin complet spa mains et pieds avec vernis classique', dur: 80, price: '75€' },
      { name: 'Soin complet spa mains et pieds avec vernis semi-permanent', dur: 90, price: '105€' },
    ],
  },
  {
    id: 'pose',
    titleKey: 'cat_pose',
    services: [
      { name: 'Gel X avec semi-permanent', dur: 60, price: '60€' },
      { name: 'Pose de résine avec semi-permanent', dur: 60, price: '60€' },
      { name: 'Pose de gel avec semi-permanent', dur: 60, price: '70€' },
      { name: 'Remplissage résine avec semi-permanent', dur: 50, price: '55€' },
      { name: 'Remplissage gel avec semi-permanent', dur: 50, price: '65€' },
    ],
  },
];

/* Add-ons: shown in the price list only (not bookable on their own). */
export const SUPPLEMENTS = {
  titleKey: 'cat_suppl',
  noteKey: 'suppl_note',
  items: [
    { name: 'Renforcement', extra: '+10 min', price: '+10€' },
    { name: "Réparation d'un ongle", extra: '+5 min', price: '+7€' },
    { name: 'French', price: '+10€' },
    { name: 'Chrome', price: '+10€' },
    { name: 'Cat Eyes', price: '+10€' },
    { name: 'Nail art & designs', priceKey: 'price_devis' },
    { name: 'Manucure préparatoire avant pose', extra: '+15 min', price: '+15€' },
  ],
};

/* Flat list of everything that can be booked online. */
export const BOOKABLE_SERVICES = SERVICE_CATEGORIES.flatMap(cat =>
  cat.services.map(s => ({ ...s, category: cat.id })),
);

/* Words scrolling in the dark banner under the hero. */
export const MARQUEE_ITEMS = [
  'Manucure Classique', 'Manucure Spa', 'Pose de Gel', 'Gel X', 'Semi-permanent',
  'Soin des Pieds', 'Nail Art', 'Remplissage', 'Renforcement',
];
