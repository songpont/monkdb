/* ============================================================
   Navigation — hash-based routing for SPA
   ============================================================ */

const SECTIONS = {
  dashboard: { label: 'ภาพรวม', render: renderDashboard },
  cluster:   { label: 'คลัสเตอร์โรค', render: renderCluster },
  burden:    { label: 'ภาระโรค', render: renderBurden },
  priority:  { label: 'Priority Score', render: renderPriority },
  compare:   { label: 'เทียบคนทั่วไป', render: renderCompare },
  prevalence:{ label: 'สำรวจความชุก', render: renderPrevalence }
};

const DEFAULT_SECTION = 'dashboard';
let currentSection = null;
let renderedSections = {};

/** Main navigation handler */
function navigate(sectionId) {
  if (!SECTIONS[sectionId]) sectionId = DEFAULT_SECTION;

  // Update nav buttons
  document.querySelectorAll('.navlinks button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  // Update hash
  if (location.hash !== '#' + sectionId) {
    history.replaceState(null, '', '#' + sectionId);
  }

  // Don't re-render if already showing
  if (currentSection === sectionId) return;

  // Hide current content
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Render section (only first time calls the full render)
  const section = SECTIONS[sectionId];
  if (section.render) {
    section.render(app);
  }

  currentSection = sectionId;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Init shared animations on new content
  setTimeout(() => {
    animateFadeIn(app);
    animateBars(app);
    animateGapBars(app);
    animateCounters(app);
    animateGrpBars(app);
  }, 100);
}

/** Set up nav buttons */
function initNav() {
  const navlinks = document.querySelector('.navlinks');
  navlinks.innerHTML = Object.keys(SECTIONS).map(key =>
    `<button data-section="${key}">${SECTIONS[key].label}</button>`
  ).join('');

  navlinks.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.section));
  });

  // Handle hash changes (back/forward)
  window.addEventListener('hashchange', () => {
    const hash = location.hash.replace('#', '');
    navigate(hash || DEFAULT_SECTION);
  });
}
