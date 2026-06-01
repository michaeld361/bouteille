/* ══════════════════════════════════════════════════════════
   Bouteille — Zinc Hour v3
   GSAP + Lenis + Character Animation + Magnetic Hovers
   ══════════════════════════════════════════════════════════ */

/* ── i18n ── */
const i18n = {
  en: {
    tagline:"A neighbourhood wine bar in Stockel, Brussels.",
    heroSub:"European wines, seasonal food, and the art of sharing. Opening soon at Rue Henrotte 40.",
    essence:"European wines. Seasonal food. The art of sharing.",
    findUs:"Find us",touch:"Get in touch",follow:"Follow along",hours:"Hours",
    hoursSoon:"Opening hours coming soon",
    winesTitle:"The Wines",winesSub:"A curated, ever-evolving selection. Conventional, natural, biodynamic — from across Europe. Every bottle chosen with care, priced with honesty.",
    foodTitle:"The Menu",foodSub:"Seasonal, simple, made to share. A menu built around what's good right now.",
    aboutTitle:"Our Story",aboutSub:"Five friends, one conviction: that a neighbourhood deserves a wine bar with soul.",
    eventsTitle:"Evenings & Events",eventsSub:"Tastings, winemaker dinners, and the odd Monday where you bring the bottle.",
    reserveTitle:"Reserve a Table",reserveSub:"Walk-ins are always welcome. But if you'd like to be sure, let us know you're coming.",
    contactTitle:"Contact",contactSub:"We'd love to hear from you.",
    reserve:"Reserve",allWines:"All",red:"Red",white:"White",rose:"Rosé",orange:"Orange",sparkling:"Sparkling",
    navWines:"Wines",navFood:"Menu",navEvents:"Events",navAbout:"About",navReserve:"Reserve",navContact:"Contact",
    rsvp:"RSVP",viewWines:"Discover the selection",viewEvents:"See all events",
    walkIns:"Walk-ins always welcome. No formality needed — just come as you are.",
    formName:"Name",formEmail:"Email",formDate:"Date",formTime:"Time",formGuests:"Guests",
    formNotes:"Special requests",formSend:"Send",formBook:"Book Table",formMsg:"Message",
    starters:"To Start",mains:"To Share",cheese:"Cheese & Charcuterie",desserts:"Sweet",
    saturday:"Saturday Market",recurring:"Every Week",upcoming:"Coming Up",
  },
  fr: {
    tagline:"Bar à vin de quartier à Stockel, Bruxelles.",
    heroSub:"Vins d'Europe, cuisine de saison, et l'art du partage. Ouverture prochainement au 40 Rue Henrotte.",
    essence:"Vins d'Europe. Cuisine de saison. L'art du partage.",
    findUs:"Nous trouver",touch:"Contact",follow:"Suivez-nous",hours:"Horaires",
    hoursSoon:"Horaires d'ouverture à venir",
    winesTitle:"Les Vins",winesSub:"Une sélection évolutive et soignée.",
    foodTitle:"La Carte",foodSub:"De saison, simple, à partager.",
    aboutTitle:"Notre Histoire",aboutSub:"Cinq amis, une conviction.",
    eventsTitle:"Soirées & Événements",eventsSub:"Dégustations, dîners de vignerons.",
    reserveTitle:"Réserver",reserveSub:"Les sans-réservation sont toujours les bienvenus.",
    contactTitle:"Contact",contactSub:"Nous serions ravis de vous entendre.",
    reserve:"Réserver",allWines:"Tous",red:"Rouge",white:"Blanc",rose:"Rosé",orange:"Orange",sparkling:"Pétillant",
    navWines:"Vins",navFood:"Carte",navEvents:"Événements",navAbout:"Histoire",navReserve:"Réserver",navContact:"Contact",
    rsvp:"Réserver",viewWines:"Découvrir la sélection",viewEvents:"Voir les événements",
    walkIns:"Sans réservation, toujours les bienvenus.",
    formName:"Nom",formEmail:"Email",formDate:"Date",formTime:"Heure",formGuests:"Convives",
    formNotes:"Demandes spéciales",formSend:"Envoyer",formBook:"Réserver",formMsg:"Message",
    starters:"Pour Commencer",mains:"À Partager",cheese:"Fromages & Charcuterie",desserts:"Douceurs",
    saturday:"Marché du Samedi",recurring:"Chaque Semaine",upcoming:"À Venir",
  },
  nl: {
    tagline:"Een buurtwijbar in Stockel, Brussel.",
    heroSub:"Europese wijnen, seizoensgebonden gerechten en de kunst van het delen.",
    essence:"Europese wijnen. Seizoenskeuken. De kunst van het delen.",
    findUs:"Vind ons",touch:"Neem contact op",follow:"Volg ons",hours:"Uren",
    hoursSoon:"Openingsuren binnenkort beschikbaar",
    winesTitle:"De Wijnen",winesSub:"Een verzorgde, steeds evoluerende selectie.",
    foodTitle:"Het Menu",foodSub:"Seizoensgebonden, eenvoudig, om te delen.",
    aboutTitle:"Ons Verhaal",aboutSub:"Vijf vrienden, één overtuiging.",
    eventsTitle:"Avonden & Evenementen",eventsSub:"Proeverijen, wijnmakersdiners.",
    reserveTitle:"Reserveren",reserveSub:"Walk-ins zijn altijd welkom.",
    contactTitle:"Contact",contactSub:"We horen graag van u.",
    reserve:"Reserveren",allWines:"Alle",red:"Rood",white:"Wit",rose:"Rosé",orange:"Oranje",sparkling:"Bruisend",
    navWines:"Wijnen",navFood:"Menu",navEvents:"Evenementen",navAbout:"Verhaal",navReserve:"Reserveren",navContact:"Contact",
    rsvp:"Reserveren",viewWines:"Ontdek de selectie",viewEvents:"Alle evenementen",
    walkIns:"Walk-ins altijd welkom.",
    formName:"Naam",formEmail:"E-mail",formDate:"Datum",formTime:"Tijd",formGuests:"Gasten",
    formNotes:"Bijzondere wensen",formSend:"Verzenden",formBook:"Reserveren",formMsg:"Bericht",
    starters:"Om Te Beginnen",mains:"Om Te Delen",cheese:"Kaas & Charcuterie",desserts:"Zoet",
    saturday:"Zaterdagmarkt",recurring:"Elke Week",upcoming:"Binnenkort",
  }
};

let currentLang = localStorage.getItem('bouteille-lang') || 'en';

function setLang(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  localStorage.setItem('bouteille-lang', lang);
  const els = document.querySelectorAll('[data-i18n]');
  els.forEach(el => el.classList.add('switching'));
  setTimeout(() => {
    els.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang][key]) el.textContent = i18n[lang][key];
      el.classList.remove('switching');
    });
  }, 300);
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang][key]) el.placeholder = i18n[lang][key];
  });
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  document.documentElement.lang = lang;
}


/* ══════════════════════════════════════════════════════════
   Text Splitting — Characters & Words
   ══════════════════════════════════════════════════════════ */

function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('data-original-text', text);
  el.innerHTML = '';

  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      const space = document.createElement('span');
      space.className = 'char-space';
      el.appendChild(space);
    } else {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = text[i];
      // Stagger delay for hover wave
      span.style.transitionDelay = `${i * 0.02}s`;
      el.appendChild(span);
    }
  }
  return el.querySelectorAll('.char');
}

function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('data-original-text', text);
  el.innerHTML = text.split(/\s+/).map(w =>
    `<span class="word">${w}</span>`
  ).join(' ');
  return el.querySelectorAll('.word');
}

function initTextSplitting() {
  document.querySelectorAll('[data-split-chars]').forEach(el => splitChars(el));
  // Word splitting for essence is handled in GSAP init
}


/* ══════════════════════════════════════════════════════════
   Grain Canvas
   ══════════════════════════════════════════════════════════ */

function initGrain() {
  const c = document.getElementById('grain');
  if (!c) return;
  const ctx = c.getContext('2d');
  let f = 0;
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  function render() {
    f++;
    if (f % 3 !== 0) { requestAnimationFrame(render); return; }
    const w = c.width, h = c.height, img = ctx.createImageData(w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255;
      d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(render);
  }
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(render);
}


/* ══════════════════════════════════════════════════════════
   Custom Cursor with Lerp
   ══════════════════════════════════════════════════════════ */

function initCursor() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if ('ontouchstart' in window) return;

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  let mx = -100, my = -100, cx = -100, cy = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    cx = lerp(cx, mx, 0.12);
    cy = lerp(cy, my, 0.12);
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(tick);
  }
  tick();

  const hovers = 'a, button, .wine-item, .wine-filter, .btn, .nav__cta, [data-lang], [data-magnetic]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hovers)) cursor.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hovers)) cursor.classList.remove('hovering');
  });
}


/* ══════════════════════════════════════════════════════════
   Magnetic Hover on CTAs
   ══════════════════════════════════════════════════════════ */

function initMagnetic() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      // Pull towards cursor
      gsap.to(el, { x: dx * 0.4, y: dy * 0.4, duration: 0.3, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      // Snap back elastically
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });
  });
}


/* ══════════════════════════════════════════════════════════
   Navigation
   ══════════════════════════════════════════════════════════ */

function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => {
    nav.classList.toggle('scrolled', !e.isIntersecting);
  }, { threshold: 0, rootMargin: '-72px 0px 0px 0px' }).observe(sentinel);

  const hamburger = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__overlay');
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      overlay.classList.toggle('open');
      document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__overlay-link').forEach(l => {
    if (l.getAttribute('href') === path) l.classList.add('active');
  });
}


/* ══════════════════════════════════════════════════════════
   Wine Filters
   ══════════════════════════════════════════════════════════ */

function initWineFilters() {
  const filters = document.querySelectorAll('.wine-filter');
  const items = document.querySelectorAll('.wine-item');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter');
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      items.forEach(item => {
        const t = item.getAttribute('data-type');
        if (f === 'all' || t === f) {
          item.style.display = '';
          item.style.opacity = '0';
          requestAnimationFrame(() => { item.style.transition = 'opacity 0.4s ease'; item.style.opacity = '1'; });
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 400);
        }
      });
    });
  });
  items.forEach(item => item.addEventListener('click', () => item.classList.toggle('expanded')));
}





/* ══════════════════════════════════════════════════════════
   GSAP — Full Scroll Choreography
   ══════════════════════════════════════════════════════════ */

function initGSAP() {
  if (typeof gsap === 'undefined') {
    // Fallback
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) heroTitle.style.transform = 'none';
    document.querySelectorAll('.char').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    document.querySelectorAll('.word').forEach(el => el.style.opacity = 1);
    const intro = document.querySelector('.intro');
    if (intro) intro.style.display = 'none';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Intro ── */
  const intro = document.querySelector('.intro');
  const isFirstVisit = !sessionStorage.getItem('bouteille-visited');

  if (intro && isFirstVisit) {
    sessionStorage.setItem('bouteille-visited', '1');

    const tl = gsap.timeline({
      onComplete: () => {
        intro.style.pointerEvents = 'none';
        heroEntrance();
      }
    });

    tl.to('.intro__rule', { width: 80, duration: 1, ease: 'power2.out' })
      .to('.intro__text', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4')
      .to({}, { duration: 0.8 }) // pause
      .to('.intro__text', { opacity: 0, y: -24, duration: 0.6, ease: 'power2.in' })
      .to('.intro__rule', { width: 0, opacity: 0, duration: 0.4 }, '-=0.3')
      .to(intro, { opacity: 0, duration: 1, ease: 'power2.inOut' })
      .set(intro, { display: 'none' });

  } else {
    if (intro) intro.style.display = 'none';
    heroEntrance();
  }


  /* ── Hero Entrance ── */
  function heroEntrance() {
    const hero = document.querySelector('.hero');
    if (!hero) { initScrollAnimations(); return; }

    const title = hero.querySelector('.hero__title');
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Cinematic Unveil: Background pulls focus
    tl.to('.hero__bg-img', {
      scale: 1,
      filter: 'brightness(0.8) blur(0px)',
      duration: 2.8,
      ease: 'power2.out'
    }, 0);

    // Title 3D fold-up reveal — the money shot
    tl.to(title, {
      y: '0%',
      rotateX: 0,
      "clip-path": 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1.6,
      ease: 'expo.out',
    }, 0.4);

    // Meta reveals
    tl.from('.hero__rule', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'power3.out' }, 1.2);
    tl.from('.hero__sub', { opacity: 0, y: 15, duration: 1, ease: 'power2.out' }, 1.4);
    tl.to('.hero__scroll', { opacity: 1, duration: 0.8 }, 1.8);

    // Deep Scroll Parallax
    // Background moves down slowly
    gsap.to('.hero__bg-img', {
      y: '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Content (title) moves UP faster, creating intense depth
    gsap.to('.hero__content', {
      y: '-25%',
      opacity: 0,
      filter: 'blur(10px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top -5%', // Wait until the user has scrolled 5% before starting the fade
        end: 'bottom top',
        scrub: true,
      }
    });

    initScrollAnimations();
  }


  /* ── Scroll Animations ── */
  function initScrollAnimations() {

    /* Essence — word by word, scroll-scrubbed */
    const essenceText = document.querySelector('.essence__text');
    if (essenceText) {
      const words = splitWords(essenceText);
      gsap.set(words, { opacity: 0.08 });

      ScrollTrigger.create({
        trigger: '.essence',
        start: 'top bottom',
        end: 'top 30%',
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          words.forEach((word, i) => {
            const wordProgress = (i / words.length);
            const dist = progress - wordProgress;
            const opacity = dist > 0 ? Math.min(1, dist * words.length * 0.8 + 0.08) : 0.08;
            word.style.opacity = opacity;
          });
        }
      });
    }


    /* Wines CTA */
    const winesCta = document.querySelector('.wines-section__cta');
    if (winesCta) {
      gsap.from(winesCta, {
        scrollTrigger: { trigger: winesCta, start: 'top bottom', once: true },
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      });
    }


    /* Event — parallax + content reveal */
    const eventImg = document.querySelector('.event-full__image');
    if (eventImg) {
      gsap.fromTo(eventImg,
        { y: '-15%' },
        { y: '15%', ease: 'none',
          scrollTrigger: { trigger: '.event-full', start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    }

    const eventTitle = document.querySelector('.event-full__title');
    if (eventTitle) {
      const chars = eventTitle.querySelectorAll('.char');
      if (chars.length) {
        gsap.to(chars, {
          scrollTrigger: { trigger: '.event-full', start: 'top bottom', once: true },
          y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: 'power4.out',
        });
      }
    }

    const eventContent = document.querySelector('.event-full__content');
    if (eventContent) {
      const children = eventContent.querySelectorAll('.event-full__date, .event-full__sub, .event-full__desc, .btn');
      gsap.from(children, {
        scrollTrigger: { trigger: eventContent, start: 'top bottom', once: true },
        y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      });
    }


    /* Location "40" — dramatic entrance */
    const locNum = document.querySelector('.location__number');
    if (locNum) {
      gsap.from(locNum, {
        scrollTrigger: { trigger: '.location__details', start: 'top bottom', once: true },
        y: 100, opacity: 0, duration: 1.5, ease: 'power3.out',
      });
    }

    /* Location detail blocks */
    gsap.utils.toArray('.location__info .detail-block').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        y: 24, opacity: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
      });
    });


    /* Social CTA — chars */
    const socialHandle = document.querySelector('.social-cta__handle');
    if (socialHandle) {
      const chars = socialHandle.querySelectorAll('.char');
      gsap.from(chars, {
        scrollTrigger: { trigger: '.social-cta', start: 'top bottom', once: true },
        y: 50, opacity: 0, duration: 1, stagger: 0.03, ease: 'power4.out',
      });
    }

    const socialLabel = document.querySelector('.social-cta__label');
    if (socialLabel) {
      gsap.from(socialLabel, {
        scrollTrigger: { trigger: '.social-cta', start: 'top bottom', once: true },
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      });
    }


    /* Generic reveals — for sub-pages */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        y: 24, opacity: 0, duration: 1,
        delay: (el.dataset.delay || 0) * 0.15,
        ease: 'power3.out',
        onComplete: () => el.classList.add('visible'),
      });
    });

    /* Sub-page elements */
    gsap.utils.toArray('.event-card, .menu-item, .team-member, .wine-item').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        y: 20, opacity: 0, duration: 0.7,
        delay: (i % 4) * 0.08, ease: 'power3.out',
      });
    });

    /* Page header title chars (for sub-pages with data-split-chars) */
    document.querySelectorAll('.page-header__title[data-split-chars]').forEach(el => {
      const chars = el.querySelectorAll('.char');
      if (chars.length) {
        gsap.from(chars, {
          y: 50, opacity: 0, duration: 1, stagger: 0.03, ease: 'power4.out',
        });
      }
    });

    ScrollTrigger.refresh();
  }
}


/* ══════════════════════════════════════════════════════════
   Lenis
   ══════════════════════════════════════════════════════════ */

function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 2.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Scroll velocity -> marquee speed
  const marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) {
    lenis.on('scroll', (e) => {
      const vel = Math.abs(e.velocity);
      const skew = Math.min(vel * 0.5, 4);
      marqueeTrack.style.transform = `translateX(var(--marquee-x, 0)) skewX(${-skew}deg)`;
    });
  }
}


/* ══════════════════════════════════════════════════════════
   Init
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initTextSplitting();
  initGrain();
  initMagnetic();
  initNav();
  initWineFilters();
  initLenis();
  initGSAP();

  setLang(currentLang);
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
  });
});
