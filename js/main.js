// ── NAVBAR scroll ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE BURGER ─────────────────────────────────────────────
const burger   = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

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

// ── SCROLL REVEAL ─────────────────────────────────────────────
document.querySelectorAll(
  '.service-card,.about-stats,.about-text,.equalizer,.contact-left,.contact-form'
).forEach(el => {
  el.classList.add('reveal');
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { el.classList.add('visible'); }
  }, { threshold: 0.1 }).observe(el);
});

// ── PORTFOLIO FILTER + VOIR PLUS ─────────────────────────────
function applyFilter(f) {
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
    document.querySelectorAll(`.track-card[data-cat="${cat}"][data-extra="1"]`).forEach(c => {
      c.classList.remove('hidden');
    });
    btn.classList.add('hidden');
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
  note.textContent = 'Message envoyé ! Je reviens vers vous sous 24 h.';
  this.reset();
  setTimeout(() => { note.textContent = ''; }, 6000);
});
