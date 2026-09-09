/* ============================================================
   Navigation — hash-based routing for the SPA
   ============================================================ */

import { teardownAnimations } from './utils.js';

/* Each section is a lazily-imported ES module exposing `render(container)`.
   Code-splitting keeps the heavy prevalence map/data out of the initial
   bundle — its chunk is only fetched when that tab is first opened. */
const SECTIONS = {
  dashboard:  { label: 'ภาพรวม',        load: () => import('./section-dashboard.js') },
  cluster:    { label: 'คลัสเตอร์โรค',   load: () => import('./section-cluster.js') },
  burden:     { label: 'ภาระโรค',        load: () => import('./section-burden.js') },
  priority:   { label: 'Priority Score', load: () => import('./section-priority.js') },
  compare:    { label: 'เทียบคนทั่วไป',  load: () => import('./section-compare.js') },
  prevalence: { label: 'สำรวจความชุก',   load: () => import('./section-prevalence.js') },
  method:     { label: 'วิธีการ & ข้อจำกัด', load: () => import('./section-method.js') }
};

const DEFAULT_SECTION = 'dashboard';
let currentSection = null;
let navToken = 0;

/** Optional cleanup returned by a section's render() (e.g. cancel timers). */
let sectionCleanup = null;

/** Main navigation handler */
async function navigate(sectionId) {
  if (!SECTIONS[sectionId]) sectionId = DEFAULT_SECTION;

  // Update nav buttons
  document.querySelectorAll('.navlinks button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  // Keep the hash in sync without piling up history entries
  if (location.hash !== '#' + sectionId) {
    history.replaceState(null, '', '#' + sectionId);
  }

  if (currentSection === sectionId) return;

  // Dispose everything the previous section left running
  if (typeof sectionCleanup === 'function') {
    try { sectionCleanup(); } catch (e) { console.error(e); }
  }
  sectionCleanup = null;
  teardownAnimations();

  const token = ++navToken;
  const app = document.getElementById('app');
  app.innerHTML = '<div class="route-loading" aria-live="polite">กำลังโหลด…</div>';

  let mod;
  try {
    mod = await SECTIONS[sectionId].load();
  } catch (e) {
    console.error('Failed to load section', sectionId, e);
    if (token === navToken) {
      app.innerHTML = '<div class="route-loading">โหลดเนื้อหาไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง</div>';
    }
    return;
  }

  // A newer navigation started while we were loading — abandon this one
  if (token !== navToken) return;

  app.innerHTML = '';
  currentSection = sectionId;
  sectionCleanup = (await mod.render(app)) || null;

  // การนำทางใหม่แซงระหว่าง render → ทิ้งผลลัพธ์นี้
  if (token !== navToken) { if (typeof sectionCleanup === 'function') sectionCleanup(); return; }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Set up nav buttons */
export function initNav() {
  const navlinks = document.querySelector('.navlinks');
  navlinks.innerHTML = Object.keys(SECTIONS).map(key =>
    `<button data-section="${key}">${SECTIONS[key].label}</button>`
  ).join('');

  navlinks.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.section));
  });

  // Handle hash changes (back/forward, manual edits)
  window.addEventListener('hashchange', () => {
    navigate(location.hash.replace('#', '') || DEFAULT_SECTION);
  });
}

export { navigate, DEFAULT_SECTION };
