/* ============================================================
   Utils — shared helpers across all sections
   ============================================================ */

/** Linear interpolation between two numbers */
function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

/** Convert RGB triplet to hex color string */
function hex(r, g, b) { return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''); }

/** 3-stop color scale: parchment-deep -> saffron -> maroon */
function colorFor(v, vmin, vmax) {
  if (vmax <= vmin) return '#F3E6CC';
  let t = (v - vmin) / (vmax - vmin);
  t = Math.max(0, Math.min(1, t));
  const c0 = [243, 230, 204], c1 = [232, 162, 58], c2 = [107, 30, 35];
  if (t < 0.5) {
    const tt = t / 0.5;
    return hex(lerp(c0[0], c1[0], tt), lerp(c0[1], c1[1], tt), lerp(c0[2], c1[2], tt));
  }
  const tt = (t - 0.5) / 0.5;
  return hex(lerp(c1[0], c2[0], tt), lerp(c1[1], c2[1], tt), lerp(c1[2], c2[2], tt));
}

/** SVG polar coordinate helper */
function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

///// Intersection Observer helpers /////

/** Animate .bar-fill elements when they enter viewport */
function animateBars(root) {
  const bars = (root || document).querySelectorAll('.bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  bars.forEach(b => obs.observe(b));
  return obs;
}

/** Animate .gap-bar-fill elements */
function animateGapBars(root) {
  const bars = (root || document).querySelectorAll('.gap-bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  bars.forEach(b => obs.observe(b));
  return obs;
}

/** Animate .fade-in elements */
function animateFadeIn(root) {
  const els = (root || document).querySelectorAll('.fade-in');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .1 });
  els.forEach(el => obs.observe(el));
  return obs;
}

/** Animate counter numbers */
function animateCounters(root) {
  const counters = (root || document).querySelectorAll('.stat-num[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();
        function step(now) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          el.textContent = (target >= 10 ? Math.round(current).toLocaleString() : current.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: .3 });
  counters.forEach(c => obs.observe(c));
  return obs;
}

/** Animate .rb-fill (ranking bars) */
function animateRankBars(root) {
  const fills = (root || document).querySelectorAll('.rb-fill[data-w]');
  requestAnimationFrame(() => {
    fills.forEach(el => { el.style.width = el.dataset.w + '%'; });
  });
}

/** Animate .rfill (priority rank fills) */
function animateRankFills(root) {
  const fills = (root || document).querySelectorAll('.rfill[data-w]');
  requestAnimationFrame(() => {
    fills.forEach(el => { el.style.width = el.dataset.w + '%'; });
  });
}

/** Animate .pfill (province bar fills) */
function animateProvinceBars(root) {
  const fills = (root || document).querySelectorAll('.pfill');
  requestAnimationFrame(() => {
    fills.forEach(el => { el.style.width = el.style.maxWidth || el.style.width; });
  });
}

/** Animate .grp-bar elements (grouped bar chart) */
function animateGrpBars(root) {
  const bars = (root || document).querySelectorAll('.grp-bar');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.height = e.target.dataset.h + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  bars.forEach(b => obs.observe(b));
  return obs;
}

/** Animate .acc-bar elements (age compare bar chart) */
function animateAccBars(root) {
  const bars = (root || document).querySelectorAll('.acc-bar');
  requestAnimationFrame(() => {
    bars.forEach(b => { b.style.height = b.dataset.h + '%'; });
  });
}

/** Animate .dv-bar elements (diverging bar chart) */
function animateDvBars(root) {
  const els = (root || document).querySelectorAll('.dv-bar');
  requestAnimationFrame(() => {
    els.forEach(el => {
      const w = parseFloat(el.dataset.w);
      const more = el.dataset.more === 'true';
      el.style.width = w + '%';
      el.style.background = more ? 'var(--maroon-700)' : 'var(--sage)';
      el.style.left = more ? '50%' : (50 - w) + '%';
    });
  });
}
