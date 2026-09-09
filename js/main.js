/* ============================================================
   Main — entry point
   ============================================================ */

import { initNav, navigate, DEFAULT_SECTION } from './nav.js';

initNav();
navigate(location.hash.replace('#', '') || DEFAULT_SECTION);
