/* ============================================================
   Main — entry point
   ============================================================ */

(function init() {
  initNav();

  // Navigate to section from hash or default
  const hash = location.hash.replace('#', '');
  navigate(hash || DEFAULT_SECTION);

  // Shared footer behavior
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear() + 543;
})();
