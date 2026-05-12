/* ══════════════════════════════════════════
   Bouteille — Holding Page JS
   Grain · Reveal animations · i18n
   ══════════════════════════════════════════ */

// ── i18n content ──
const i18n = {
  en: {
    tagline:  "A neighbourhood wine bar in Stockel, Brussels.",
    status:   "Opening soon",
    findUs:   "Find us",
    touch:    "Get in touch",
    follow:   "Follow along",
    crafted:  "Site by",
  },
  fr: {
    tagline:  "Bar à vin de quartier à Stockel, Bruxelles.",
    status:   "Ouverture prochaine",
    findUs:   "Nous trouver",
    touch:    "Contact",
    follow:   "Suivez-nous",
    crafted:  "Site par",
  },
  nl: {
    tagline:  "Buurt wijnbar in Stockel, Brussel.",
    status:   "Binnenkort geopend",
    findUs:   "Vind ons",
    touch:    "Contact",
    follow:   "Volg ons",
    crafted:  "Site door",
  },
};

let currentLang = "en";

// ── Grain texture ──
function initGrain() {
  const canvas = document.getElementById("grain");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, frame;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function renderGrain() {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 18;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Re-render grain every 120ms for a living texture feel
  function loop() {
    renderGrain();
    frame = setTimeout(loop, 120);
  }

  resize();
  window.addEventListener("resize", resize);
  loop();
}

// ── Reveal animation ──
function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  const baseDelay = 600; // ms after curtain starts lifting
  const stagger = 200;   // ms between each element

  elements.forEach((el) => {
    const order = parseInt(el.dataset.delay || 0, 10);
    const delay = baseDelay + order * stagger;

    setTimeout(() => {
      el.classList.add("visible");
    }, delay);
  });
}

// ── Load curtain ──
function liftCurtain() {
  const curtain = document.querySelector(".curtain");
  if (curtain) {
    setTimeout(() => curtain.classList.add("lifted"), 200);
  }
}

// ── Language switching ──
function initLang() {
  const buttons = document.querySelectorAll(".lang-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;

      // Update button states
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.removeAttribute("aria-current");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-current", "true");

      // Update html lang attribute
      document.documentElement.lang = lang === "nl" ? "nl" : lang === "fr" ? "fr" : "en";

      // Crossfade translatable elements
      const spans = document.querySelectorAll("[data-i18n]");
      spans.forEach((span) => span.classList.add("switching"));

      setTimeout(() => {
        spans.forEach((span) => {
          const key = span.dataset.i18n;
          if (i18n[lang] && i18n[lang][key]) {
            span.textContent = i18n[lang][key];
          }
        });

        // Update page title and meta
        const titles = {
          en: "Bouteille — Bar à vin, Stockel",
          fr: "Bouteille — Bar à vin, Stockel",
          nl: "Bouteille — Wijnbar, Stockel",
        };
        document.title = titles[lang] || titles.en;

        requestAnimationFrame(() => {
          spans.forEach((span) => span.classList.remove("switching"));
        });
      }, 350);

      currentLang = lang;
    });
  });
}

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  initGrain();
  liftCurtain();
  initReveal();
  initLang();
});
