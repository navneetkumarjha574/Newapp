const TOTAL = 8;
let cur = 0;
let twTimer = null;

// Secret Key Passcode (Change this as needed)
const SECRET_KEY = "123";

const shayri = `सुनो जन्मदिन मुबारक हो🌹
बहुत खूबसूरत हो तुम,बहुत खूबसूरत रहो।

हर कामयाबी पर पहुँचो,हर मंज़िल पर पहुँचो।
जहाँ लोगों को सालों लगे,तुम जल्द वहाँ पहुँचो।

मैं अच्छा हूँ या बुरा हूँ,नहीं जानता।
पर दिल की एक बात बता दूँ —दिल तुम्हारे अलावा
किसी को अपना नहीं मानता।

तुम साथ रहो, तुम खुश रहो।
एक साल और बढ़ गई है उम्र तुम्हारी,
हर बढ़ती उम्र में तुम मेरे पास रहो।

कोई खास तोहफा नहीं दे पाऊँगा,
पर वादा है —हर मुश्किल में साथ निभाऊंगा।

एक और साल तुम्हारे कदमों में मुबारक।
अच्छा सुनो — जन्मदिन मुबारक! 💖`;

function showLayer(n) {
  document.querySelectorAll('.layer').forEach(l => l.classList.remove('active'));
  document.getElementById('layer-' + n).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  buildDots(n);
  if (n === 6) startTW();
}

function next() {
  if (cur < TOTAL - 1) {
    cur++;
    showLayer(cur);
  }
}

function prev() {
  if (cur > 0) {
    cur--;
    showLayer(cur);
  }
}

function goStart() {
  cur = 0;
  showLayer(0);
}

function buildDots(active) {
  const p = document.getElementById('prog');
  p.innerHTML = '';
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'pdot' + (i < active ? ' done' : i === active ? ' active' : '');
    p.appendChild(d);
  }
}

function startTW() {
  const out = document.getElementById('tw-out');
  const c = document.getElementById('tw-cur');
  const done = document.getElementById('tw-done');
  clearInterval(twTimer);
  let idx = 0;
  out.textContent = '';
  c.style.display = 'inline-block';
  done.style.display = 'none';
  twTimer = setInterval(() => {
    if (idx <= shayri.length) {
      out.textContent = shayri.slice(0, idx);
      idx++;
    } else {
      clearInterval(twTimer);
      c.style.display = 'none';
      done.style.display = 'block';
    }
  }, 40);
}

function openMail() {

  document
    .getElementById('mailModal')
    .classList
    .add('active');

  // Letter open hone ke baad
  // birthday burst
  setTimeout(() => {

    launchBirthdayConfetti();

  }, 650);
}


function closeMail() {

  document
    .getElementById('mailModal')
    .classList
    .remove('active');

}

/* ==========================================
   COUNTDOWN TIMER & SECRET KEY LOGIC
   ========================================== */

function startCountdown() {
  const now = new Date();
  let currentYear = now.getFullYear();

  // Birthday Target Date: 16 September of current year
  let bdayTarget = new Date(currentYear, 8, 16, 0, 0, 0); // Month is 0-indexed (8 = September)

  // If 16 Sep of current year has passed, target next year
  if (now > bdayTarget && now.getDate() !== 16) {
    bdayTarget = new Date(currentYear + 1, 8, 16, 0, 0, 0);
  }

  const timerInterval = setInterval(() => {
    const currentTime = new Date();

    // Check if today is 16 September
    if (currentTime.getMonth() === 8 && currentTime.getDate() === 16) {
      unlockPage();
      clearInterval(timerInterval);
      document.querySelector('.timer-title').textContent = "🎉 It's Birthday Time! 🎉";
      return;
    }

    const diff = bdayTarget - currentTime;

    if (diff <= 0) {
      unlockPage();
      clearInterval(timerInterval);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = d < 10 ? '0' + d : d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
  }, 1000);
}

function unlockPage() {
  const btn = document.getElementById('open-btn');
  btn.disabled = false;
  btn.innerHTML = "Surprise Kholo 💖";
  btn.style.animation = "pulse 1.5s infinite";
}

function toggleSecretInput() {
  const wrap = document.getElementById('secret-input-wrapper');
  wrap.style.display = wrap.style.display === 'none' ? 'flex' : 'none';
}

function unlockWithSecretKey() {
  const val = document.getElementById('secretKeyInput').value.trim();
  if (val === SECRET_KEY) {
    unlockPage();
    alert("Secret Key Accepted! Page Unlocked 🔓");
    document.getElementById('secret-input-wrapper').style.display = 'none';
  } else {
    alert("Incorrect Secret Key! ❌");
  }
}

// Background Floating Particles
(function () {
  const p = document.getElementById('particles');
  const em = ['💖', '✨', '🌸', '💫', '⭐', '🌺', '💕', '🌙', '💝', '🦋'];
  for (let i = 0; i < 25; i++) {
    const d = document.createElement('div');
    d.className = 'particle';
    d.innerText = em[i % em.length];
    d.style.left = (Math.random() * 98) + '%';
    d.style.animationDuration = (8 + Math.random() * 10) + 's';
    d.style.animationDelay = (Math.random() * 8) + 's';
    d.style.fontSize = (.8 + Math.random() * .9) + 'rem';
    p.appendChild(d);
  }
})();
function launchBirthdayConfetti() {

  const canvas = document.getElementById("confetti-canvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  const colors = [
    "#ff4d6d",
    "#ff85a1",
    "#ffd166",
    "#c77dff",
    "#74c0fc",
    "#69db7c",
    "#ffffff"
  ];

  /*
   * Start point:
   * Screen ke center ke aas-paas,
   * yani letter ke around.
   */
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // -----------------------------
  // CREATE PARTICLES
  // -----------------------------

  for (let i = 0; i < 180; i++) {

    const angle =
      Math.random() * Math.PI * 2;

    const speed =
      3.5 + Math.random() * 5;

    particles.push({

      x: centerX + (Math.random() - 0.5) * 50,

      y: centerY + (Math.random() - 0.5) * 40,

      vx: Math.cos(angle) * speed,

      vy: Math.sin(angle) * speed - 2,

      width: 5 + Math.random() * 6,

      height: 8 + Math.random() * 8,

      rotation:
        Math.random() * Math.PI * 2,

      rotationSpeed:
        -0.18 + Math.random() * 0.36,

      gravity:
        0.08 + Math.random() * 0.08,

      drag: 0.985,

      color:
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ],

      opacity: 1,

      life:
        180 + Math.random() * 100

    });
  }

  const startTime = performance.now();

  // -----------------------------
  // ANIMATION
  // -----------------------------

  function animate(currentTime) {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    let alive = false;

    particles.forEach(p => {

      if (p.life <= 0) return;

      alive = true;

      // Physics
      p.vx *= p.drag;
      p.vy *= p.drag;

      p.vy += p.gravity;

      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotationSpeed;

      p.life--;

      // Fade near end
      if (p.life < 45) {
        p.opacity = p.life / 45;
      }

      // -----------------------------
      // DRAW
      // -----------------------------

      ctx.save();

      ctx.translate(
        p.x,
        p.y
      );

      ctx.rotate(
        p.rotation
      );

      ctx.globalAlpha =
        Math.max(p.opacity, 0);

      ctx.fillStyle =
        p.color;

      ctx.fillRect(
        -p.width / 2,
        -p.height / 2,
        p.width,
        p.height
      );

      ctx.restore();

    });

    /*
     * Animation around 5 seconds
     */
    if (
      alive &&
      currentTime - startTime < 5200
    ) {

      requestAnimationFrame(
        animate
      );

    } else {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

    }
  }

  requestAnimationFrame(
    animate
  );
}
// =========================================
// LETTER MODAL FLOATING PARTICLES
// =========================================

(function () {

    const p =
        document.getElementById('mailParticles');

    if (!p) return;

    const em = [
        '💖',
        '✨',
        '🌸',
        '💫',
        '⭐',
        '🌺',
        '💕',
        '🌙',
        '💝',
        '🦋'
    ];

    for (let i = 0; i < 18; i++) {

        const d =
            document.createElement('div');

        d.className =
            'mail-particle';

        d.innerText =
            em[i % em.length];

        // Random horizontal position
        d.style.left =
            (Math.random() * 95) + '%';

        // Different animation speed
        d.style.animationDuration =
            (9 + Math.random() * 9) + 's';

        // Different starting time
        d.style.animationDelay =
            (Math.random() * 10) + 's';

        // Smaller and softer than page particles
        d.style.fontSize =
            (0.65 + Math.random() * 0.65) + 'rem';

        p.appendChild(d);
    }

})();


// =========================================
// CAKE CUTTING SYSTEM
// =========================================

let candlesBlown = false;
let cakeCut = false;


// =========================================
// BLOW CANDLES
// =========================================

function blowCandles() {

  if (candlesBlown) return;

  candlesBlown = true;

  const candlesRow =
    document.querySelector('.candles-row');

  const message =
    document.getElementById('cake-message');

  const blowButton =
    document.querySelector('.blow-btn');

  const cutButton =
    document.getElementById('cutCakeBtn');


  // Blow out flames

  candlesRow.classList.add('blown');


  // Change message

  message.innerHTML =
    "✨ Wish made! Now it's time to cut the cake. 🎂";


  // Disable blow button

  blowButton.disabled = true;

  blowButton.innerHTML =
    "✨ Wish Made";


  // Enable cut button

  setTimeout(() => {

    cutButton.disabled = false;

  }, 500);

}
// =========================================
// CUT CAKE
// =========================================

function cutCake() {

  if (!candlesBlown || cakeCut) return;

  cakeCut = true;


  const cakeSection =
    document.querySelector('.cake-section');

  const message =
    document.getElementById('cake-message');

  const cutButton =
    document.getElementById('cutCakeBtn');

  const nextButton =
    document.getElementById('cakeNextBtn');


  // Start cutting animation

  cakeSection.classList.add('cutting');


  // Disable button

  cutButton.disabled = true;

  cutButton.innerHTML =
    "🎂 Cake Cut!";


  // Change message

  message.innerHTML =
    "🎉 Yay! Cake is cut! May your year be as sweet as this moment. 💖";


  // Celebration animation

  setTimeout(() => {

    cakeSection.classList.add(
      'cut-complete'
    );

    // Birthday confetti

    if (
      typeof launchBirthdayConfetti ===
      'function'
    ) {

      launchBirthdayConfetti();

    }

  }, 700);


  // Enable next button

  setTimeout(() => {

    nextButton.disabled = false;

    nextButton.innerHTML =
      "Aage Badho →";

  }, 1300);

}
/* =========================================
   ENHANCED FUNCTIONALITY — UI IMPROVEMENTS
   ========================================= */

// ── Keyboard Navigation ──
document.addEventListener('keydown', (e) => {
  if (document.getElementById('mailModal').classList.contains('active')) {
    if (e.key === 'Escape') closeMail();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
});

// ── Touch Swipe Navigation ──
(function () {
  let startX = 0, startY = 0;
  const threshold = 60;

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) next();
      else         prev();
    }
  }, { passive: true });
})();

// ── Layer Entry Sound (soft chime via Web Audio) ──
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch(e) {}
}

// Override showLayer to add chime
const _origShowLayer = showLayer;
window.showLayer = function(n) {
  _origShowLayer(n);
  playChime();
};

// ── Smooth count-up for timer digits ──
function animateDigit(el, newVal) {
  if (el.innerText === newVal) return;
  el.style.transform = 'translateY(-10px)';
  el.style.opacity = '0';
  el.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
  setTimeout(() => {
    el.innerText = newVal;
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';
  }, 150);
}

// Patch countdown to use animated digits
const _origCountdown = startCountdown;
window.startCountdown = function() {
  const now = new Date();
  let currentYear = now.getFullYear();
  let bdayTarget = new Date(currentYear, 8, 16, 0, 0, 0);
  if (now > bdayTarget && now.getDate() !== 16) {
    bdayTarget = new Date(currentYear + 1, 8, 16, 0, 0, 0);
  }
  const dEl = document.getElementById('days');
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');

  const timerInterval = setInterval(() => {
    const currentTime = new Date();
    if (currentTime.getMonth() === 8 && currentTime.getDate() === 16) {
      unlockPage();
      clearInterval(timerInterval);
      document.querySelector('.timer-title').textContent = "🎉 It's Birthday Time! 🎉";
      return;
    }
    const diff = bdayTarget - currentTime;
    if (diff <= 0) { unlockPage(); clearInterval(timerInterval); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const fmt = v => v < 10 ? '0' + v : '' + v;
    animateDigit(dEl, fmt(d));
    animateDigit(hEl, fmt(h));
    animateDigit(mEl, fmt(m));
    animateDigit(sEl, fmt(s));
  }, 1000);
};

// ── Swipe hint on mobile ──
(function () {
  if (window.innerWidth < 768) {
    const hint = document.createElement('p');
    hint.className = 'swipe-hint';
    hint.textContent = '← swipe to navigate →';
    document.querySelector('.app').appendChild(hint);
  }
})();

// ── Photo frame lightbox ──
document.querySelectorAll('.photo-frame img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:99999;
      background:rgba(0,0,0,0.92); display:flex;
      align-items:center; justify-content:center;
      cursor:zoom-out; animation: fadeIn 0.25s ease;
    `;
    const big = document.createElement('img');
    big.src = img.src;
    big.style.cssText = `
      max-width:90vw; max-height:88vh;
      border-radius:14px;
      box-shadow:0 0 40px rgba(244,114,182,0.5);
      animation: zoomIn 0.3s cubic-bezier(.34,1.56,.64,1);
    `;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes zoomIn { from{transform:scale(0.7)} to{transform:scale(1)} }
    `;
    document.head.appendChild(style);
    overlay.appendChild(big);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// ── Auto-start countdown on load ──
window.addEventListener('DOMContentLoaded', () => {
  startCountdown();
  buildDots(0);
});


// Patch buildDots to show step label
const _origBuildDots = buildDots;
window.buildDots = function(active) {
  _origBuildDots(active);
  const lbl = document.getElementById('step-label');
  if (lbl) {
    const labels = ['Intro','Cake','Happiness','Strength','Beauty','Together','Wishes','Letter'];
    lbl.textContent = labels[active] ? `✦ ${labels[active]} ✦` : '';
  }
};

/* =========================================
   MUSIC PLAYER
   ========================================= */
let musicPlaying = false;
const audio = document.getElementById('bgMusic');

function toggleMusic() {
  if (!audio) return;
  if (musicPlaying) {
    audio.pause();
    document.getElementById('musicIcon').textContent = '▶';
    document.getElementById('musicBars').classList.remove('playing');
  } else {
    audio.play().catch(() => {});
    document.getElementById('musicIcon').textContent = '⏸';
    document.getElementById('musicBars').classList.add('playing');
  }
  musicPlaying = !musicPlaying;
}

function setVolume(v) {
  if (audio) audio.volume = parseFloat(v);
}

// Auto-play on first user interaction
document.addEventListener('click', function autoPlay() {
  if (!musicPlaying && audio) {
    audio.volume = 0.5;
    audio.play().then(() => {
      musicPlaying = true;
      document.getElementById('musicIcon').textContent = '⏸';
      document.getElementById('musicBars').classList.add('playing');
    }).catch(() => {});
  }
  document.removeEventListener('click', autoPlay);
}, { once: true });

/* =========================================
   EMOJI REACTION SYSTEM
   ========================================= */
function sendReaction(emoji) {
  const bar = document.getElementById('reactionBar');
  const rect = bar.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-react';
  el.textContent = emoji;
  el.style.left = (rect.left + rect.width/2 - 16 + (Math.random()-0.5)*60) + 'px';
  el.style.top = (rect.top - 20) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);

  // Small chime
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 660 + Math.random()*400;
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } catch(e){}
}

/* =========================================
   WISH CARD
   ========================================= */
const wishes = [];

function openWish() {
  document.getElementById('wishModal').classList.add('active');
  renderWishes();
}
function closeWish() {
  document.getElementById('wishModal').classList.remove('active');
}
function saveWish() {
  const txt = document.getElementById('wishText').value.trim();
  if (!txt) return;
  wishes.push(txt);
  document.getElementById('wishText').value = '';
  document.getElementById('wishChar').textContent = '200 left';
  renderWishes();
  // Confetti burst
  if (typeof launchBirthdayConfetti === 'function') launchBirthdayConfetti();
}
function shareWish() {
  const txt = document.getElementById('wishText').value.trim();
  if (!txt) return;
  const msg = `🎂 Ananya Raj ko Birthday Wish:\n\n${txt}\n\n💖 Happy Birthday!`;
  if (navigator.share) {
    navigator.share({ title: 'Birthday Wish', text: msg }).catch(()=>{});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(msg).then(() => alert('Wish copied! Share karo 💌'));
  }
}
function renderWishes() {
  const box = document.getElementById('savedWishes');
  box.innerHTML = '';
  wishes.slice().reverse().forEach(w => {
    const d = document.createElement('div');
    d.className = 'saved-wish-item';
    d.textContent = w;
    box.appendChild(d);
  });
}
// Character counter
document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('wishText');
  if (ta) {
    ta.addEventListener('input', () => {
      document.getElementById('wishChar').textContent = (200 - ta.value.length) + ' left';
    });
  }
});

/* =========================================
   SPARKLE CURSOR EFFECT
   ========================================= */
(function() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const sparks = [];
  const colors = ['#ff7882','#f472b6','#a855f7','#ffd700','#fff','#c084fc'];

  window.addEventListener('mousemove', e => {
    for (let i = 0; i < 3; i++) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        r: 2 + Math.random() * 3,
        dx: (Math.random() - 0.5) * 3,
        dy: (Math.random() - 0.5) * 3 - 1.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach((s, i) => {
      s.x += s.dx;
      s.y += s.dy;
      s.alpha -= 0.03;
      s.r *= 0.96;
      ctx.save();
      ctx.globalAlpha = Math.max(s.alpha, 0);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    for (let i = sparks.length - 1; i >= 0; i--) {
      if (sparks[i].alpha <= 0) sparks.splice(i, 1);
    }
    requestAnimationFrame(loop);
  }
  loop();
})();