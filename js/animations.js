/* ===== CR7 – ANIMATIONS ENGINE ===== */

// ── PARTICLE SYSTEM (Hero) ──────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Portugal flag colors + gold
  const COLORS = ['rgba(200,16,46,', 'rgba(0,102,0,', 'rgba(255,215,0,'];
  const SHAPES = ['circle', 'ball', 'star'];

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - .5) * .55,
    dy: (Math.random() - .5) * .55,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * .35 + .08,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * .02 + .01
  }));

  function drawStar(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = (i * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
      const ox = x + r * Math.cos(a), oy = y + r * Math.sin(a);
      const ix = x + (r * .4) * Math.cos(b), iy = y + (r * .4) * Math.sin(b);
      if (i === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const alpha = p.alpha + Math.sin(p.pulse) * .08;
      ctx.fillStyle = p.color + Math.max(0, Math.min(1, alpha)) + ')';

      if (p.shape === 'star') {
        drawStar(ctx, p.x, p.y, p.r * 1.8);
      } else if (p.shape === 'ball') {
        // football-style dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      p.x += p.dx; p.y += p.dy;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
    });
    requestAnimationFrame(loop);
  }
  loop();
}

// ── COUNTDOWN TICK ANIMATION ────────────────────────────────────────────
function initCountdownTick() {
  let prev = {};
  ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
    const el = document.getElementById(id);
    if (el) prev[id] = el.textContent;
  });

  const orig = window.updateCountdown;
  if (typeof orig !== 'function') return;

  // patch updateCountdown to add tick class
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      const el = m.target;
      if (el.textContent !== prev[el.id]) {
        prev[el.id] = el.textContent;
        el.classList.remove('tick');
        void el.offsetWidth; // reflow
        el.classList.add('tick');
        setTimeout(() => el.classList.remove('tick'), 200);
      }
    });
  });

  ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el, { childList: true, characterData: true, subtree: true });
  });
}

// ── ENHANCED SCROLL REVEAL ──────────────────────────────────────────────
function initScrollReveal() {
  const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll(selectors).forEach(el => io.observe(el));

  // Re-observe dynamically added cards
  const gridObserver = new MutationObserver(() => {
    document.querySelectorAll(selectors + ':not(.observed)').forEach(el => {
      el.classList.add('observed');
      io.observe(el);
    });
  });

  const grid = document.getElementById('postsGrid');
  if (grid) gridObserver.observe(grid, { childList: true });
}

// ── CURSOR TRAIL (subtle, Portugal colors) ──────────────────────────────
function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch
  const dots = [];
  const N = 8;
  const TRAIL_COLORS = ['#C8102E','#C8102E','#006600','#006600','#FFD700','#C8102E','#006600','#FFD700'];

  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed;pointer-events:none;z-index:9998;
      width:${6 - i * .5}px;height:${6 - i * .5}px;
      border-radius:50%;background:${TRAIL_COLORS[i]};
      opacity:0;transition:opacity .3s;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => dots.forEach(d => d.el.style.opacity = 0));
  document.addEventListener('mouseenter', () => dots.forEach(d => d.el.style.opacity = ''));

  function trail() {
    let x = mx, y = my;
    dots.forEach((d, i) => {
      d.x += (x - d.x) * (0.35 - i * .03);
      d.y += (y - d.y) * (0.35 - i * .03);
      d.el.style.left = d.x + 'px';
      d.el.style.top  = d.y + 'px';
      d.el.style.opacity = (1 - i / N) * 0.6;
      x = d.x; y = d.y;
    });
    requestAnimationFrame(trail);
  }
  trail();
}

// ── HERO PARALLAX ───────────────────────────────────────────────────────
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const coat = document.querySelector('.hero-coat');
    const num  = document.querySelector('.hero-number');
    if (coat) coat.style.transform = `translateY(calc(-50% + ${y * .12}px))`;
    if (num)  num.style.transform  = `translateY(${y * .08}px)`;
  }, { passive: true });
}

// ── HEADER SHRINK ON SCROLL ─────────────────────────────────────────────
function initHeaderShrink() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 60
      ? '0 4px 30px rgba(0,0,0,.25)'
      : '0 2px 12px rgba(0,0,0,.12)';
  }, { passive: true });
}

// ── ENHANCED STAT COUNTERS ──────────────────────────────────────────────
function initEnhancedCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const target = parseInt(e.target.dataset.count);
        const duration = 1800;
        const start = performance.now();
        const update = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          e.target.textContent = Math.floor(ease * target).toLocaleString();
          if (p < 1) requestAnimationFrame(update);
          else {
            e.target.textContent = target.toLocaleString();
            e.target.classList.add('done');
          }
        };
        requestAnimationFrame(update);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

// ── TIMELINE BAR ENTRANCE ───────────────────────────────────────────────
function initTimelineBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target.querySelector('.timeline-bar-fill');
        if (bar) setTimeout(() => { bar.style.width = bar.dataset.width; }, 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.timeline-item').forEach(el => {
    if (el.querySelector('.timeline-bar-fill')) io.observe(el);
  });
}

// ── CARD TILT on hover (desktop) ────────────────────────────────────────
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.post-card, .wc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `translateY(-6px) scale(1.01) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── GOAL CELEBRATION (click anywhere on hero number) ────────────────────
function initGoalCelebration() {
  const num = document.querySelector('.hero-number');
  if (!num) return;
  num.style.cursor = 'pointer';
  num.title = 'Click me!';

  num.addEventListener('click', () => {
    // burst effect
    const colors = ['#C8102E','#006600','#FFD700','#fff'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position:fixed;
        left:50%;top:40%;
        width:${Math.random()*10+5}px;height:${Math.random()*10+5}px;
        border-radius:50%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        pointer-events:none;z-index:9999;
        transform:translate(-50%,-50%);
      `;
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist  = Math.random() * 200 + 80;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      p.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ], { duration: 700 + Math.random()*400, easing: 'cubic-bezier(.25,.46,.45,.94)' })
        .onfinish = () => p.remove();
    }

    // SIUUU! text
    const siuu = document.createElement('div');
    siuu.textContent = 'SIUUUU! 🐐';
    siuu.style.cssText = `
      position:fixed;left:50%;top:35%;transform:translate(-50%,-50%);
      font-size:3rem;font-weight:900;color:var(--gold);
      pointer-events:none;z-index:9999;
      text-shadow:0 0 30px rgba(255,215,0,.8),2px 2px 0 var(--red);
      white-space:nowrap;
    `;
    document.body.appendChild(siuu);
    siuu.animate([
      { opacity:0, transform:'translate(-50%,-50%) scale(.5)' },
      { opacity:1, transform:'translate(-50%,-60%) scale(1.1)' },
      { opacity:0, transform:'translate(-50%,-80%) scale(.9)' }
    ], { duration: 1200, easing: 'ease' }).onfinish = () => siuu.remove();
  });
}

// ── SMOOTH PAGE TRANSITIONS ─────────────────────────────────────────────
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity .2s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });
}

// ── INIT ALL ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCountdownTick();
  initScrollReveal();
  initCursorTrail();
  initParallax();
  initHeaderShrink();
  initEnhancedCounters();
  initTimelineBars();
  initPageTransitions();

  // Card tilt & goal celebration need a small delay for dynamic cards
  setTimeout(() => {
    initCardTilt();
    initGoalCelebration();
  }, 800);

  console.log('🇵🇹 CR7 Animations Engine — Ready. SIUUUU!');
});
