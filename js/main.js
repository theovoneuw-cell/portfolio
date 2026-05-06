// ── NAVBAR scroll ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  navbar.classList.toggle('nav-hidden', y > 80);
});

// ── MOBILE BURGER ─────────────────────────────────────────────
const burger   = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
const appFloat = document.getElementById('appFloat');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open');
  navbar.classList.toggle('menu-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (appFloat) appFloat.style.zIndex = isOpen ? '-1' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
    if (appFloat) appFloat.style.zIndex = '';
  });
});

const navClose = document.querySelector('.nav-close');
if (navClose) {
  navClose.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
    if (appFloat) appFloat.style.zIndex = '';
  });
}

// ── HERO WAVEFORM ─────────────────────────────────────────────
(function buildWave() {
  const wave = document.getElementById('heroWave');
  for (let i = 0; i < 80; i++) {
    const s   = document.createElement('span');
    const min = 4  + Math.random() * 10;
    const max = 18 + Math.random() * 120;
    const dur = (0.6 + Math.random() * 1.2).toFixed(2);
    const del = (Math.random() * 1.0).toFixed(2);
    s.style.cssText = `--min:${min}px;--max:${max}px;--d:${dur}s;animation-delay:${del}s`;
    wave.appendChild(s);
  }
})();

// ── GSAP ANIMATIONS ───────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ── CURSOR PERSONNALISÉ ───────────────────────────────────────
const cursor    = document.createElement('div');
const cursorDot = document.createElement('div');
cursor.className    = 'g-cursor';
cursorDot.className = 'g-cursor-dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

window.addEventListener('mousemove', e => {
  gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.05 });
  gsap.to(cursor,    { x: e.clientX, y: e.clientY, duration: 0.18, ease: "power2.out" });
});
document.querySelectorAll('a, button, .service-card, .track-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('g-cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('g-cursor--hover'));
});

// ── PRÉPARE LES LETTRES DU NOM (DOM, avant tout) ─────────────
const heroName = document.querySelector('.hero-name');
if (heroName) {
  const lines = heroName.innerHTML.split('<br>');
  heroName.innerHTML = lines.map(line =>
    '<span class="g-line">' +
    line.replace(/(\S)/g, '<span class="g-char">$1</span>') +
    '</span>'
  ).join('');
  // Cache le hero content pendant le loader
  gsap.set('.hero-tag, .hero-name, .hero-sub, .hero-cta, .hero-scroll', { opacity: 0 });
}

// ── LOADER SPECTRUM ANALYZER ──────────────────────────────────
(function() {
  const canvas = document.getElementById('loaderCanvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const W    = canvas.width;
  const H    = canvas.height;
  const N    = 28;                        // nombre de barres
  const GAP  = 3;
  const barW = (W - GAP * (N - 1)) / N;

  // État de chaque barre : hauteur cible, hauteur actuelle, vitesse
  const bars = Array.from({ length: N }, (_, i) => ({
    cur:    8 + Math.random() * 20,
    target: 8 + Math.random() * (H - 8),
    vel:    0,
    phase:  Math.random() * Math.PI * 2,
    freq:   0.4 + Math.random() * 1.2,
  }));

  let t = 0;
  let raf;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.018;

    bars.forEach((b, i) => {
      // Cible : onde sinusoïdale multi-fréquence pour look organique
      const wave =
        Math.sin(t * b.freq + b.phase) * 0.45 +
        Math.sin(t * b.freq * 1.7 + b.phase * 0.5) * 0.3 +
        Math.sin(t * 0.3 + i * 0.4) * 0.25;
      b.target = H * 0.12 + ((wave + 1) / 2) * H * 0.82;

      // Spring smoothing
      const spring = 0.12;
      const damp   = 0.72;
      b.vel  = b.vel * damp + (b.target - b.cur) * spring;
      b.cur += b.vel;

      const bh = Math.max(3, b.cur);
      const x  = i * (barW + GAP);
      const y  = H - bh;

      // Dégradé vertical blanc → gris selon hauteur
      const grad = ctx.createLinearGradient(0, y, 0, H);
      grad.addColorStop(0,   `rgba(255,255,255,${0.3 + (bh / H) * 0.7})`);
      grad.addColorStop(1,   'rgba(255,255,255,0.08)');
      ctx.fillStyle = grad;

      // Barres avec coins arrondis en haut
      const r = Math.min(barW / 2, 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, H);
      ctx.lineTo(x, H);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      // Point lumineux au sommet
      ctx.beginPath();
      ctx.arc(x + barW / 2, y + 1.5, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.5 + (bh / H) * 0.5})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  draw();

  // Exposer la fonction stop pour le loader
  window._stopLoaderCanvas = () => {
    cancelAnimationFrame(raf);
  };
})();

// ── LOADER ────────────────────────────────────────────────────
const loader = document.getElementById('loader');
const fill   = document.querySelector('.loader-progress-fill');

document.body.style.overflow = 'hidden';

let pct = 0;
const iv = setInterval(() => {
  pct += Math.random() * 14 + 3;
  if (pct >= 92) { pct = 92; clearInterval(iv); }
  fill.style.width = pct + '%';
}, 100);

setTimeout(() => {
  clearInterval(iv);
  gsap.to(fill, { width: '100%', duration: 0.3, ease: 'power2.out',
    onComplete: () => {
      setTimeout(() => {
        gsap.to(loader, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.85,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            document.body.style.overflow = '';
            if (window._stopLoaderCanvas) window._stopLoaderCanvas();
            initScrollAnimations();
            triggerHeroAnimations();
          }
        });
      }, 150);
    }
  });
}, 1800);

// ── HERO ANIMATIONS (appelées après le loader) ────────────────
function triggerHeroAnimations() {
  const tl = gsap.timeline();

  // 1. Ligne horizontale qui traverse l'écran (reveal bar)
  const bar = document.createElement('div');
  bar.className = 'g-reveal-bar';
  document.body.appendChild(bar);

  tl
    // Barre blanche qui balaye de gauche à droite
    .set(bar, { scaleX: 0, transformOrigin: 'left center' })
    .to(bar, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' })
    .to(bar, { scaleX: 0, transformOrigin: 'right center', duration: 0.45, ease: 'power3.inOut' })

    // 2. Onde hero explose depuis le bas (opacity monte)
    .to('.hero-wave', { opacity: 0.18, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    // 3. Hero tag — glitch puis stabilise
    .set('.hero-tag', { opacity: 1 })
    .from('.hero-tag', {
      x: () => (Math.random() - 0.5) * 30,
      skewX: 8, duration: 0.5, ease: 'power3.out'
    }, '-=0.2')

    // 4. Nom — lettres tombent en 3D une par une
    .set('.hero-name', { opacity: 1 })
    .from('.hero-name .g-char', {
      opacity: 0, y: 100, rotateX: -80, scaleY: 0.4,
      duration: 0.6, stagger: 0.032,
      ease: 'back.out(1.6)',
      transformOrigin: '50% 100% -20px'
    }, '-=0.15')

    // 5. Ligne séparatrice qui s'étire sous le nom
    .from('.g-line-sep', { scaleX: 0, duration: 0.5, ease: 'power3.out', transformOrigin: 'left' }, '-=0.1')

    // 6. Sous-titre — masque clip qui s'ouvre
    .set('.hero-sub', { opacity: 1 })
    .from('.hero-sub', { clipPath: 'inset(0 100% 0 0)', duration: 0.55, ease: 'power3.out' }, '-=0.1')

    // 7. Boutons depuis les côtés avec rebond
    .set('.btn-primary, .btn-ghost', { opacity: 1 })
    .from('.btn-primary', { x: -40, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.1')
    .from('.btn-ghost',   { x:  40, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.45')

    // 8. Scroll indicator fade
    .set('.hero-scroll', { opacity: 1 })
    .from('.hero-scroll', { y: -12, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')

    // 9. Nettoyage de la barre
    .add(() => bar.remove(), '+=0.1');
}

// ── SCROLL ANIMATIONS (initialisées après le loader) ──────────
function initScrollAnimations() {

  // Parallax fond hero
  gsap.to(".hero-bg", {
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    y: 120, ease: "none"
  });

  // Navbar hide/show au scroll
  ScrollTrigger.create({
    onUpdate: self => {
      const y = window.scrollY;
      if (y < 80)                              { gsap.to('#navbar', { y: 0,   duration: 0.3, ease: "power2.out" }); }
      else if (self.direction === -1)          { gsap.to('#navbar', { y: 0,   duration: 0.4, ease: "power2.out" }); }
      else if (self.direction === 1 && y > 200){ gsap.to('#navbar', { y: -80, duration: 0.3, ease: "power2.in"  }); }
    }
  });

  // Section tags — ligne qui s'étire
  gsap.utils.toArray('.section-tag').forEach(tag => {
    gsap.from(tag, {
      scrollTrigger: { trigger: tag, start: "top 88%" },
      scaleX: 0, opacity: 0, duration: 0.6, ease: "power3.out",
      transformOrigin: "left center"
    });
  });

  // Titres de section
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 85%" },
      opacity: 0, y: 40, duration: 0.9, ease: "power3.out"
    });
  });

  // À propos
  gsap.from(".about-visual", {
    scrollTrigger: { trigger: "#about", start: "top 78%" },
    opacity: 0, scale: 0.85, duration: 1, ease: "power3.out"
  });
  gsap.from(".about-text > *", {
    scrollTrigger: { trigger: ".about-text", start: "top 80%" },
    opacity: 0, x: 50, duration: 0.7, stagger: 0.12, ease: "power3.out"
  });

  // Compteurs animés
  gsap.utils.toArray('.stat-num').forEach(el => {
    const raw = el.innerText.replace(/[^0-9]/g, '');
    if (!raw) return;
    const target = parseInt(raw);
    const suffix = el.innerHTML.replace(/[0-9]/g, '');
    const obj = { val: 0 };
    gsap.to(obj, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      val: target, duration: 1.8, ease: "power2.out",
      onUpdate: () => { el.innerHTML = Math.round(obj.val) + suffix; }
    });
  });

  // Services
  gsap.from(".service-card", {
    scrollTrigger: { trigger: "#services", start: "top 75%" },
    opacity: 0, y: 60, scale: 0.92, duration: 0.65,
    stagger: { amount: 0.5, from: "center" },
    ease: "back.out(1.2)"
  });

  // Portfolio
  gsap.from(".filter-tabs", {
    scrollTrigger: { trigger: "#portfolio", start: "top 82%" },
    opacity: 0, y: 20, duration: 0.6, ease: "power2.out"
  });
  gsap.from(".track-card:not(.hidden)", {
    scrollTrigger: { trigger: "#portfolioGrid", start: "top 82%" },
    opacity: 0, y: 50, scale: 0.94, duration: 0.55,
    stagger: 0.07, ease: "power2.out"
  });

  // Section App
  gsap.from("#app .container > *", {
    scrollTrigger: { trigger: "#app", start: "top 78%" },
    opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: "power3.out"
  });

  // Parcours — alternance gauche/droite
  gsap.utils.toArray('.parcours-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: "top 88%" },
      opacity: 0, x: i % 2 === 0 ? -60 : 60,
      duration: 0.7, ease: "power3.out"
    });
  });

  // Contact
  gsap.from(".contact-left", {
    scrollTrigger: { trigger: "#contact", start: "top 80%" },
    opacity: 0, x: -60, duration: 0.9, ease: "power3.out"
  });
  gsap.from(".contact-form", {
    scrollTrigger: { trigger: "#contact", start: "top 80%" },
    opacity: 0, x: 60, duration: 0.9, ease: "power3.out"
  });
}

// ── MAGNETIC BUTTONS (pas besoin d'attendre le loader) ────────
document.querySelectorAll('.btn-primary, .btn-ghost, .btn-nav').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    gsap.to(btn, { x: dx * 0.35, y: dy * 0.35, duration: 0.3, ease: "power2.out" });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  });
});

// ── PORTFOLIO FILTER + VOIR PLUS ─────────────────────────────
const gridWrap = document.querySelector('.portfolio-grid-wrap');
const grid     = document.getElementById('portfolioGrid');

// Déplace les .voir-plus hors de la grille, dans le wrapper
document.querySelectorAll('.voir-plus').forEach(btn => gridWrap.appendChild(btn));

function applyFilter(f) {
  gridWrap.classList.remove('expanded');

  document.querySelectorAll('.track-card').forEach(card => {
    const match = card.dataset.cat === f;
    const extra = card.dataset.extra === '1';
    card.classList.toggle('hidden', !match || extra);
  });

  document.querySelectorAll('.voir-plus').forEach(btn => {
    btn.classList.toggle('hidden', btn.dataset.cat !== f);
  });
}

document.querySelectorAll('.voir-plus').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    document.querySelectorAll(`.track-card[data-cat="${cat}"][data-extra="1"]`).forEach(c => c.classList.remove('hidden'));
    btn.classList.add('hidden');
    gridWrap.classList.add('expanded');
  });
});

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

const activeBtn = document.querySelector('.filter-btn.active');
if (activeBtn) applyFilter(activeBtn.dataset.filter);

// ── AUDIO PLAYER ──────────────────────────────────────────────
let currentAudio = null;
let currentBtn   = null;

function fmt(s) {
  if (isNaN(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
}

document.querySelectorAll('.custom-player').forEach(player => {
  const card      = player.closest('.track-card');
  const audioSrc  = card ? card.dataset.audio : '';
  const playBtn   = player.querySelector('.play-btn');
  const progress  = player.querySelector('.progress-fill');
  const wrap      = player.querySelector('.progress-wrap');
  const timeCur   = player.querySelector('.time-cur');
  const timeTot   = player.querySelector('.time-tot');
  const volSlider = player.querySelector('.vol-slider');

  if (!audioSrc) {
    playBtn.disabled = true;
    playBtn.style.opacity = '0.4';
    playBtn.title = 'Audio non disponible';
    return;
  }

  const audio = new Audio(audioSrc);
  audio.preload = 'metadata';
  audio.volume  = parseFloat(volSlider.value);

  audio.addEventListener('loadedmetadata', () => {
    timeTot.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progress.style.width = pct + '%';
    timeCur.textContent  = fmt(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
    progress.style.width = '0%';
    timeCur.textContent  = '0:00';
    currentAudio = null;
    currentBtn   = null;
  });

  playBtn.addEventListener('click', () => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentBtn.classList.remove('playing');
    }
    if (audio.paused) {
      audio.play();
      playBtn.classList.add('playing');
      currentAudio = audio;
      currentBtn   = playBtn;
    } else {
      audio.pause();
      playBtn.classList.remove('playing');
      currentAudio = null;
      currentBtn   = null;
    }
  });

  wrap.addEventListener('click', e => {
    if (!audio.duration) return;
    const rect = wrap.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });

  volSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volSlider.value);
  });
});

// ── CARTE FLOTTANTE APP ───────────────────────────────────────
(function() {
  const float = document.getElementById('appFloat');
  const closeBtn = document.getElementById('appFloatClose');
  const link = document.getElementById('appFloatLink');
  if (!float) return;

  setTimeout(() => float.classList.add('visible'), 2000);

  closeBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    float.classList.remove('visible');
    setTimeout(() => float.classList.add('hidden'), 400);
  });

  link.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
    float.classList.remove('visible');
    setTimeout(() => float.classList.add('hidden'), 400);
  });
})();

// ── CONTACT FORM ──────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  const btn  = this.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Envoi…';

  fetch('https://formspree.io/f/xwvaagja', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(this)
  })
  .then(r => {
    if (r.ok) {
      note.textContent = 'Message envoyé ! Je reviens vers vous sous 24 h.';
      this.reset();
      setTimeout(() => { note.textContent = ''; }, 6000);
    } else {
      note.textContent = 'Erreur — réessayez ou écrivez directement par email.';
    }
    btn.disabled = false;
    btn.textContent = 'Envoyer le message';
  })
  .catch(() => {
    note.textContent = 'Erreur — réessayez ou écrivez directement par email.';
    btn.disabled = false;
    btn.textContent = 'Envoyer le message';
  });
});
