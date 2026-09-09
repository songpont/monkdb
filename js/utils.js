/* ============================================================
   Utils — shared helpers across all sections
   ============================================================ */

/* ---- Teardown registry -------------------------------------
   Every IntersectionObserver / requestAnimationFrame loop that
   should not outlive the current section registers here, so the
   router can dispose them before rendering the next section.
   Without this, navigating between sections repeatedly leaks
   observers and (in the dashboard) an un-cancelled rAF spin loop.
------------------------------------------------------------- */
const _observers = new Set();
const _rafs = new Set();

/** Track an IntersectionObserver for disposal on navigation. Returns it. */
export function trackObserver(obs) { _observers.add(obs); return obs; }

/** Track a requestAnimationFrame id for cancellation on navigation. Returns it. */
export function trackRaf(id) { _rafs.add(id); return id; }

/** Disconnect every tracked observer and cancel every tracked rAF loop. */
export function teardownAnimations() {
  _observers.forEach(o => { try { o.disconnect(); } catch {} });
  _observers.clear();
  _rafs.forEach(id => cancelAnimationFrame(id));
  _rafs.clear();
}

/** Linear interpolation between two numbers */
export function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

/** Convert RGB triplet to hex color string (values are clamped to 0–255) */
export function hex(r, g, b) {
  return '#' + [r, g, b]
    .map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'))
    .join('');
}

/** 3-stop color scale: parchment-deep -> saffron -> maroon */
export function colorFor(v, vmin, vmax) {
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
export function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

///// Intersection Observer helpers /////

/** Animate .bar-fill elements when they enter viewport */
export function animateBars(root) {
  const bars = (root || document).querySelectorAll('.bar-fill');
  const obs = trackObserver(new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 }));
  bars.forEach(b => obs.observe(b));
  return obs;
}

/** Animate .gap-bar-fill elements */
export function animateGapBars(root) {
  const bars = (root || document).querySelectorAll('.gap-bar-fill');
  const obs = trackObserver(new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 }));
  bars.forEach(b => obs.observe(b));
  return obs;
}

/** Animate .fade-in elements */
export function animateFadeIn(root) {
  const els = (root || document).querySelectorAll('.fade-in');
  const obs = trackObserver(new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .1 }));
  els.forEach(el => obs.observe(el));
  return obs;
}

/** Animate counter numbers */
export function animateCounters(root) {
  const counters = (root || document).querySelectorAll('.stat-num[data-count]');
  const obs = trackObserver(new IntersectionObserver((entries) => {
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
          if (progress < 1) trackRaf(requestAnimationFrame(step));
        }
        trackRaf(requestAnimationFrame(step));
        obs.unobserve(el);
      }
    });
  }, { threshold: .3 }));
  counters.forEach(c => obs.observe(c));
  return obs;
}

/** Animate .rb-fill (ranking bars) */
export function animateRankBars(root) {
  const fills = (root || document).querySelectorAll('.rb-fill[data-w]');
  trackRaf(requestAnimationFrame(() => {
    fills.forEach(el => { el.style.width = el.dataset.w + '%'; });
  }));
}

/** Animate .rfill (priority rank fills) */
export function animateRankFills(root) {
  const fills = (root || document).querySelectorAll('.rfill[data-w]');
  trackRaf(requestAnimationFrame(() => {
    fills.forEach(el => { el.style.width = el.dataset.w + '%'; });
  }));
}

/** Animate .pfill (province bar fills) */
export function animateProvinceBars(root) {
  const fills = (root || document).querySelectorAll('.pfill');
  trackRaf(requestAnimationFrame(() => {
    fills.forEach(el => { el.style.width = el.style.maxWidth || el.style.width; });
  }));
}

/** Animate .grp-bar elements (grouped bar chart) */
export function animateGrpBars(root) {
  const bars = (root || document).querySelectorAll('.grp-bar');
  const obs = trackObserver(new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.height = e.target.dataset.h + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .3 }));
  bars.forEach(b => obs.observe(b));
  return obs;
}

/** Animate .acc-bar elements (age compare bar chart) */
export function animateAccBars(root) {
  const bars = (root || document).querySelectorAll('.acc-bar');
  trackRaf(requestAnimationFrame(() => {
    bars.forEach(b => { b.style.height = b.dataset.h + '%'; });
  }));
}

/** Animate .dv-bar elements (diverging bar chart) */
export function animateDvBars(root) {
  const els = (root || document).querySelectorAll('.dv-bar');
  trackRaf(requestAnimationFrame(() => {
    els.forEach(el => {
      const w = parseFloat(el.dataset.w);
      const more = el.dataset.more === 'true';
      el.style.width = w + '%';
      el.style.background = more ? 'var(--maroon-700)' : 'var(--sage)';
      el.style.left = more ? '50%' : (50 - w) + '%';
    });
  }));
}
