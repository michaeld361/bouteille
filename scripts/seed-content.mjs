/**
 * Bouteille — Sanity Content Migration Script
 * Seeds all initial content from the static site into Sanity CMS.
 * 
 * Run: node scripts/seed-content.mjs
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'un3ffdsw',
  dataset: 'production',
  apiVersion: '2026-05-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Helper to create i18n field values
const i18n = (en, fr = '', nl = '') => {
  const arr = [{ _key: 'en', value: en }]
  if (fr) arr.push({ _key: 'fr', value: fr })
  if (nl) arr.push({ _key: 'nl', value: nl })
  return arr
}

async function seed() {
  console.log('🍷 Seeding Bouteille content...\n')

  // ══════════════════════════════════════
  // 1. SITE SETTINGS
  // ══════════════════════════════════════
  console.log('📋 Creating Site Settings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandName: 'Bouteille',
    tagline: i18n(
      'A neighbourhood wine bar in Stockel, Brussels.',
      'Un bar à vin de quartier à Stockel, Bruxelles.',
      'Een buurtwijbar in Stokkel, Brussel.'
    ),
    essence: i18n(
      'European wines. Seasonal food. The art of sharing.',
      'Vins européens. Cuisine de saison. L\'art du partage.',
      'Europese wijnen. Seizoensgebonden gerechten. De kunst van het delen.'
    ),
    address: {
      street: 'Rue Henrotte 40',
      postalCode: '1150',
      city: 'Woluwe-Saint-Pierre',
      country: 'Brussels, Belgium',
    },
    email: 'hello@bouteillebaravin.be',
    instagramHandle: '@bouteille.bar',
    instagramUrl: 'https://www.instagram.com/bouteille.bar',
    googleMapsUrl: 'https://goo.gl/maps/example',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.5!2d4.4308!3d50.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDQ4JzAwLjAiTiA0wrAyNSc1MC4wIkU!5e0!3m2!1sen!2sbe!4v1',
    openingHours: i18n(
      'Tue–Sat: 17:00–23:00 · Sun–Mon: Closed',
      'Mar–Sam : 17h–23h · Dim–Lun : Fermé',
      'Di–Za: 17:00–23:00 · Zo–Ma: Gesloten'
    ),
    marqueeItems: [
      i18n('European wines', 'Vins européens', 'Europese wijnen'),
      i18n('Seasonal food', 'Cuisine de saison', 'Seizoensgerechten'),
      i18n('The art of sharing', "L'art du partage", 'De kunst van het delen'),
      i18n('Stockel, Brussels', 'Stockel, Bruxelles', 'Stokkel, Brussel'),
    ],
    copyright: '© 2026 Bouteille. All rights reserved.',
    allergenNotice: i18n(
      'Do you need information about allergens in our products? We draw your attention to the fact that the composition of products may vary.',
      "Désirez-vous des renseignements sur la présence des allergènes dans nos produits ? Nous attirons votre attention sur le fait que la composition des produits peut varier.",
      'Wilt u informatie over allergenen in onze producten? Wij vestigen uw aandacht op het feit dat de samenstelling van producten kan variëren.'
    ),
    seo: {
      title: 'Bouteille — Bar à vin | Stockel, Brussels',
      description: 'Bouteille is a neighbourhood wine bar in Stockel, Brussels. European wines, seasonal food, and the art of sharing.',
    },
  })
  console.log('  ✅ Site Settings')

  // ══════════════════════════════════════
  // 2. NAVIGATION
  // ══════════════════════════════════════
  console.log('📋 Creating Navigation...')
  await client.createOrReplace({
    _id: 'navigation',
    _type: 'navigation',
    links: [
      { _key: 'wines', label: i18n('Wines', 'Les Vins', 'Wijnen'), href: '/wines', showInDesktop: true, showInMobile: true },
      { _key: 'menu', label: i18n('Menu', 'La Carte', 'Menu'), href: '/menu', showInDesktop: true, showInMobile: true },
      { _key: 'events', label: i18n('Events', 'Événements', 'Evenementen'), href: '/events', showInDesktop: true, showInMobile: true },
      { _key: 'about', label: i18n('About', 'Notre Histoire', 'Over Ons'), href: '/about', showInDesktop: true, showInMobile: true },
      { _key: 'contact', label: i18n('Contact', 'Contact', 'Contact'), href: '/contact', showInDesktop: false, showInMobile: true },
    ],
    ctaLabel: i18n('Reserve', 'Réserver', 'Reserveren'),
    ctaHref: '/reservations',
    followLabel: i18n('Follow along', 'Suivez-nous', 'Volg ons'),
    findUsLabel: i18n('Find us', 'Nous trouver', 'Vind ons'),
    touchLabel: i18n('Get in touch', 'Nous contacter', 'Neem contact op'),
    hoursLabel: i18n('Hours', 'Horaires', 'Openingsuren'),
    getDirectionsLabel: i18n('Get directions', 'Itinéraire', 'Routebeschrijving'),
  })
  console.log('  ✅ Navigation')

  // ══════════════════════════════════════
  // 3. WINES (12 wines from the original site)
  // ══════════════════════════════════════
  console.log('🍷 Creating Wines...')
  const wines = [
    { _id: 'wine-01', name: 'Les Music', vintage: '2022', producer: 'Domaine de la Pépière', region: 'Loire', country: 'FR', type: 'white', price: 7, tastingNote: i18n('Crisp Muscadet with oceanic minerality and citrus lift.', 'Muscadet vif avec une minéralité océanique et des notes d\'agrumes.'), featured: true, order: 1 },
    { _id: 'wine-02', name: 'Cuvée Marguerite', vintage: '2021', producer: 'Domaine Marcel Deiss', region: 'Alsace', country: 'FR', type: 'white', price: 9, tastingNote: i18n('Field blend showing the terroir of Bergheim — floral, textured, soulful.', 'Assemblage de terroir de Bergheim — floral, texturé, profond.'), featured: true, order: 2 },
    { _id: 'wine-03', name: 'Zweigelt', vintage: '2022', producer: 'Judith Beck', region: 'Burgenland', country: 'AT', type: 'red', price: 7, tastingNote: i18n('Juicy, peppery red from Burgenland — cherry, earth, gentle tannins.', 'Rouge juteux et poivré du Burgenland — cerise, terre, tanins doux.'), featured: true, order: 3 },
    { _id: 'wine-04', name: 'Fleurie', vintage: '2022', producer: 'Julien Sunier', region: 'Beaujolais', country: 'FR', type: 'red', price: 8, tastingNote: i18n('Silky Gamay with violet and red fruit perfume.') },
    { _id: 'wine-05', name: 'Riesling Kabinett', vintage: '2021', producer: 'Maximin Grünhaus', region: 'Mosel', country: 'DE', type: 'white', price: 9, tastingNote: i18n('Crystalline Mosel Riesling — slate, green apple, featherweight.') },
    { _id: 'wine-06', name: 'Musar Jeune', vintage: '2020', producer: 'Château Musar', region: 'Bekaa Valley', country: 'LB', type: 'red', price: 7, tastingNote: i18n('Lebanese soul — ripe fruit, spice, and a whisper of the Bekaa sun.') },
    { _id: 'wine-07', name: 'Brézème', vintage: '2021', producer: 'Eric Texier', region: 'Rhône', country: 'FR', type: 'red', price: 8, tastingNote: i18n('Northern Rhône Syrah — dark fruit, smoked herbs, granite.') },
    { _id: 'wine-08', name: 'Vinho Verde', vintage: '2023', producer: 'Quinta da Lixa', region: 'Minho', country: 'PT', type: 'white', price: 6, tastingNote: i18n('Bright, slightly effervescent — lime, white flowers, sea breeze.') },
    { _id: 'wine-09', name: 'Cerasuolo d\'Abruzzo', vintage: '2022', producer: 'Emidio Pepe', region: 'Abruzzo', country: 'IT', type: 'rosé', price: 9, tastingNote: i18n('Deep rosé with cherry intensity and savoury depth.') },
    { _id: 'wine-10', name: 'Pét-Nat Rosé', vintage: '2023', producer: 'La Grange Tiphaine', region: 'Loire', country: 'FR', type: 'sparkling', price: 8, tastingNote: i18n('Playful bubbles, wild strawberry, dry finish.') },
    { _id: 'wine-11', name: 'Assyrtiko', vintage: '2022', producer: 'Sigalas', region: 'Santorini', country: 'GR', type: 'white', price: 10, tastingNote: i18n('Volcanic white — razor-sharp acidity, saline, lemon zest.') },
    { _id: 'wine-12', name: 'Gut Oggau Timotheus', vintage: '2021', producer: 'Gut Oggau', region: 'Burgenland', country: 'AT', type: 'orange', price: 10, tastingNote: i18n('Amber-hued, skin-contact — apricot, chamomile, grip.') },
  ]
  for (const w of wines) {
    await client.createOrReplace({ ...w, _type: 'wine' })
  }
  console.log(`  ✅ ${wines.length} Wines`)

  // ══════════════════════════════════════
  // 4. MENU ITEMS & CATEGORIES
  // ══════════════════════════════════════
  console.log('🍽️  Creating Menu...')
  const menuItems = [
    // Petits Creux
    { _id: 'mi-01', name: i18n('Maquereaux marinés', 'Maquereaux marinés'), description: i18n('Pickled mackerel, crème fraîche, dill', 'Maquereaux marinés, crème fraîche, aneth'), price: 12 },
    { _id: 'mi-02', name: i18n('Focaccia maison', 'Focaccia maison'), description: i18n('House focaccia, olive oil, fleur de sel', 'Focaccia maison, huile d\'olive, fleur de sel'), price: 6 },
    { _id: 'mi-03', name: i18n('Burrata', 'Burrata'), description: i18n('Burrata, heritage tomatoes, basil oil', 'Burrata, tomates anciennes, huile de basilic'), price: 16 },
    { _id: 'mi-04', name: i18n('Croquettes aux crevettes', 'Croquettes aux crevettes'), description: i18n('Shrimp croquettes, lemon, parsley', 'Croquettes aux crevettes, citron, persil'), price: 14, featured: true },
    // Suggestions du moment
    { _id: 'mi-05', name: i18n('Vitello tonnato', 'Vitello tonnato'), description: i18n('Vitello tonnato, capers, rocket', 'Vitello tonnato, câpres, roquette'), price: 18 },
    { _id: 'mi-06', name: i18n('Asperges blanches', 'Asperges blanches'), description: i18n('White asparagus, mousseline, jambon', 'Asperges blanches, mousseline, jambon'), price: 22 },
    // Carbonnade
    { _id: 'mi-07', name: i18n('Carbonnade flamande', 'Carbonnade flamande'), description: i18n('Flemish beef stew, bread, mustard', 'Carbonnade flamande, pain, moutarde'), price: 19, featured: true },
    // Classiques
    { _id: 'mi-08', name: i18n('Steak-frites', 'Steak-frites'), description: i18n('Steak-frites, béarnaise', 'Steak-frites, béarnaise'), price: 24 },
    { _id: 'mi-09', name: i18n('Moules-frites', 'Moules-frites'), description: i18n('Mussels, frites, mayo', 'Moules, frites, mayo'), price: 22 },
    { _id: 'mi-10', name: i18n('Croque monsieur', 'Croque monsieur'), description: i18n('Gruyère, ham, béchamel', 'Gruyère, jambon, béchamel'), price: 14 },
    { _id: 'mi-11', name: i18n('Salade de chèvre chaud', 'Salade de chèvre chaud'), description: i18n('Warm goat cheese salad, honey, walnuts', 'Salade de chèvre chaud, miel, noix'), price: 16 },
    // Desserts
    { _id: 'mi-12', name: i18n('Dame blanche', 'Dame blanche'), description: i18n('Vanilla ice cream, hot chocolate, cream', 'Glace vanille, chocolat chaud, crème'), price: 10 },
    { _id: 'mi-13', name: i18n('Crème brûlée', 'Crème brûlée'), price: 9 },
    { _id: 'mi-14', name: i18n('Tarte Tatin', 'Tarte Tatin'), description: i18n('Upside-down apple tart, crème fraîche', 'Tarte Tatin, crème fraîche'), price: 10 },
  ]
  for (const item of menuItems) {
    await client.createOrReplace({ ...item, _type: 'menuItem' })
  }
  console.log(`  ✅ ${menuItems.length} Menu Items`)

  const categories = [
    { _id: 'mc-01', title: i18n('Petits Creux', 'Petits Creux', 'Kleine Hapjes'), order: 1, items: ['mi-01', 'mi-02', 'mi-03', 'mi-04'].map(id => ({ _key: id, _type: 'reference', _ref: id })) },
    { _id: 'mc-02', title: i18n('Suggestions du Moment', 'Suggestions du Moment', 'Suggesties'), order: 2, items: ['mi-05', 'mi-06'].map(id => ({ _key: id, _type: 'reference', _ref: id })) },
    { _id: 'mc-03', title: i18n('Carbonnade', 'Carbonnade', 'Stoofvlees'), order: 3, items: ['mi-07'].map(id => ({ _key: id, _type: 'reference', _ref: id })) },
    { _id: 'mc-04', title: i18n('Classiques', 'Classiques', 'Klassiekers'), order: 4, items: ['mi-08', 'mi-09', 'mi-10', 'mi-11'].map(id => ({ _key: id, _type: 'reference', _ref: id })) },
    { _id: 'mc-05', title: i18n('Desserts', 'Desserts', 'Desserten'), order: 5, items: ['mi-12', 'mi-13', 'mi-14'].map(id => ({ _key: id, _type: 'reference', _ref: id })) },
  ]
  for (const cat of categories) {
    await client.createOrReplace({ ...cat, _type: 'menuCategory' })
  }
  console.log(`  ✅ ${categories.length} Menu Categories`)

  // ══════════════════════════════════════
  // 5. EVENTS
  // ══════════════════════════════════════
  console.log('📅 Creating Events...')
  const events = [
    {
      _id: 'ev-01', _type: 'event', eventType: 'featured',
      title: i18n('Winemaker\'s Table', 'Table du Vigneron', 'Wijnmakertafel'),
      subtitle: i18n('An evening with Julien Sunier', 'Une soirée avec Julien Sunier', 'Een avond met Julien Sunier'),
      description: i18n('Join us for an intimate dinner with Beaujolais winemaker Julien Sunier. Five courses, five wines, one story.', 'Rejoignez-nous pour un dîner intime avec le vigneron beaujolais Julien Sunier. Cinq plats, cinq vins, une histoire.'),
      date: '2026-06-20', time: '19:00',
      ctaLabel: i18n('RSVP', 'Réserver', 'Reserveren'),
    },
    {
      _id: 'ev-02', _type: 'event', eventType: 'recurring', recurringDay: 'Monday',
      title: i18n('BYOB Monday', 'Lundi BYOB', 'BYOB Maandag'),
      tag: i18n('Every Monday', 'Chaque lundi', 'Elke maandag'),
      description: i18n('Bring your own bottle. We provide the glasses, the cheese, and the company. Corkage: €8.', 'Apportez votre bouteille. Nous fournissons les verres, le fromage et la compagnie. Droit de bouchon : 8€.'),
    },
    {
      _id: 'ev-03', _type: 'event', eventType: 'recurring', recurringDay: 'Wednesday',
      title: i18n('Wine Wednesday', 'Mercredi Vin', 'Wijnwoensdag'),
      tag: i18n('Every Wednesday', 'Chaque mercredi', 'Elke woensdag'),
      description: i18n('Half-price on selected bottles. Because midweek deserves a glass.', 'Moitié prix sur une sélection de bouteilles. Parce que le milieu de semaine mérite un verre.'),
    },
    {
      _id: 'ev-04', _type: 'event', eventType: 'recurring', recurringDay: 'Friday',
      title: i18n('Friday Apéro', 'Apéro du Vendredi', 'Vrijdagborrel'),
      tag: i18n('Every Friday', 'Chaque vendredi', 'Elke vrijdag'),
      description: i18n('Live music, small plates, big energy. The best way to start your weekend.', 'Musique live, petites assiettes, grande énergie. La meilleure façon de commencer le week-end.'),
    },
    {
      _id: 'ev-05', _type: 'event', eventType: 'upcoming',
      title: i18n('Natural Wine Fair', 'Salon du Vin Naturel', 'Natuurwijnbeurs'),
      tag: i18n('Coming Up', 'À venir', 'Binnenkort'),
      description: i18n('A curated tasting of 20+ natural wines from across Europe. Meet the producers.', 'Une dégustation de plus de 20 vins naturels de toute l\'Europe. Rencontrez les producteurs.'),
      date: '2026-07-12', time: '15:00',
      ctaLabel: i18n('Get Tickets', 'Billets', 'Tickets'),
    },
    {
      _id: 'ev-06', _type: 'event', eventType: 'upcoming',
      title: i18n('Summer Solstice Party', 'Fête du Solstice', 'Zomerzonnewendefeest'),
      tag: i18n('Coming Up', 'À venir', 'Binnenkort'),
      description: i18n('Celebrate the longest day with rosé, BBQ, and sunlight until late.', 'Célébrez le jour le plus long avec du rosé, un BBQ et la lumière du soleil jusqu\'à tard.'),
      date: '2026-06-21', time: '18:00',
      ctaLabel: i18n('RSVP', 'Réserver', 'Reserveren'),
    },
  ]
  for (const ev of events) {
    await client.createOrReplace(ev)
  }
  console.log(`  ✅ ${events.length} Events`)

  // ══════════════════════════════════════
  // 6. TEAM MEMBERS
  // ══════════════════════════════════════
  console.log('👥 Creating Team Members...')
  const members = [
    { _id: 'tm-01', name: 'Felix', role: i18n('Founder & Chef', 'Fondateur & Chef', 'Oprichter & Chef'), order: 1 },
    { _id: 'tm-02', name: 'Camille', role: i18n('Sommelier', 'Sommelière', 'Sommelier'), order: 2 },
    { _id: 'tm-03', name: 'Antoine', role: i18n('Front of House', 'Responsable de Salle', 'Gastheer'), order: 3 },
    { _id: 'tm-04', name: 'Margot', role: i18n('Pastry & Desserts', 'Pâtisserie & Desserts', 'Gebak & Desserten'), order: 4 },
    { _id: 'tm-05', name: 'Louis', role: i18n('Bar & Events', 'Bar & Événements', 'Bar & Evenementen'), order: 5 },
  ]
  for (const m of members) {
    await client.createOrReplace({ ...m, _type: 'teamMember' })
  }
  console.log(`  ✅ ${members.length} Team Members`)

  // ══════════════════════════════════════
  // 7. HOME PAGE
  // ══════════════════════════════════════
  console.log('🏠 Creating Home Page...')
  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    heroTitle: 'Bouteille',
    winesSectionLabel: i18n('The Wines', 'Les Vins', 'De Wijnen'),
    winesSectionTitle: i18n('Selection', 'Sélection', 'Selectie'),
    winesCtaLabel: i18n('Discover the selection', 'Découvrir la sélection', 'Ontdek de selectie'),
    featuredWines: [
      { _key: 'fw1', _type: 'reference', _ref: 'wine-01' },
      { _key: 'fw2', _type: 'reference', _ref: 'wine-02' },
      { _key: 'fw3', _type: 'reference', _ref: 'wine-03' },
    ],
    featuredEvent: { _type: 'reference', _ref: 'ev-01' },
  })
  console.log('  ✅ Home Page')

  // ══════════════════════════════════════
  // 8. ABOUT PAGE
  // ══════════════════════════════════════
  console.log('📄 Creating About Page...')
  await client.createOrReplace({
    _id: 'page-about',
    _type: 'page',
    internalTitle: 'About',
    slug: { _type: 'slug', current: 'about' },
    title: i18n('Our Story', 'Notre Histoire', 'Ons Verhaal'),
    subtitle: i18n(
      'Five friends, one conviction: that a neighbourhood deserves a wine bar with soul.',
      'Cinq amis, une conviction : qu\'un quartier mérite un bar à vin avec une âme.',
      'Vijf vrienden, één overtuiging: dat een buurt een wijnbar met ziel verdient.'
    ),
    content: [
      {
        _key: 'p1', _type: 'proseBlock',
        text: i18n(
          'Bouteille was born from a simple idea: that wine should be shared, not studied. In 2024, five friends — each with a different background but the same conviction — opened a small bar in Stockel with a hand-picked selection and a menu built around what\'s good right now.',
          'Bouteille est né d\'une idée simple : le vin doit être partagé, pas étudié. En 2024, cinq amis — chacun avec un parcours différent mais la même conviction — ont ouvert un petit bar à Stockel avec une sélection choisie à la main et une carte construite autour de ce qui est bon en ce moment.',
        ),
      },
      {
        _key: 'q1', _type: 'pullquoteBlock',
        quote: i18n(
          'We wanted a place where you could drink a great glass of wine without pretension — where the food is honest, the welcome is warm, and the music is always right.',
          'Nous voulions un endroit où l\'on pouvait boire un bon verre de vin sans prétention — où la cuisine est honnête, l\'accueil chaleureux et la musique toujours juste.',
        ),
        attribution: 'Felix, Founder',
      },
      {
        _key: 'p2', _type: 'proseBlock',
        text: i18n(
          'Our wines come from small, independent producers across Europe — people who farm with care and make wines that taste like somewhere. Our food is seasonal, simple, and made to share. We believe in the carbonnade as much as the cru.',
          'Nos vins proviennent de petits producteurs indépendants à travers l\'Europe — des gens qui cultivent avec soin et font des vins qui ont le goût d\'un terroir. Notre cuisine est de saison, simple et faite pour être partagée.',
        ),
      },
      {
        _key: 'tg1', _type: 'teamGridBlock',
        members: members.map(m => ({ _key: m._id, _type: 'reference', _ref: m._id })),
      },
    ],
  })
  console.log('  ✅ About Page')

  console.log('\n✨ All content seeded successfully!')
  console.log('   Visit http://localhost:3000/studio to manage your content.')
  console.log('   Visit http://localhost:3000 to see the site.')
}

seed().catch(console.error)
