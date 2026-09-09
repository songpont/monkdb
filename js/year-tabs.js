/* ============================================================
   Year tabs — ตัวสลับปีข้อมูล (พ.ศ.) + โหมด "เทียบปี" ต่อ section
   แสดงเฉพาะเมื่อข้อมูลมาจาก D1 (static bundle มีปีเดียว)
   ============================================================ */

const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
const toThai = (n) => String(n).replace(/\d/g, (d) => THAI_DIGITS[+d]);

/**
 * แทรกแถบสลับปีไว้ใต้ <header class="hero"> ของ container
 * @param {HTMLElement} container
 * @param {{years:number[], current:number|'compare', onChange:(y:number|'compare')=>void, compare?:boolean}} opts
 *        years เรียงจากใหม่ไปเก่า (ปีแรก = tab แรก) · compare=true เพิ่มปุ่ม "เทียบปี"
 */
export function mountYearTabs(container, { years, current, onChange, compare = false }) {
  const anchor = container.querySelector('header.hero') || container.firstElementChild;
  if (!anchor) return;
  container.querySelector('.year-tabs')?.remove();

  const tab = (val, label) =>
    `<button type="button" class="year-tab${val === current ? ' active' : ''}" data-y="${val}" aria-pressed="${val === current}">${label}</button>`;

  const bar = document.createElement('div');
  bar.className = 'year-tabs';
  bar.innerHTML =
    `<span class="year-tabs-label">ปีข้อมูล</span>` +
    years.map((y) => tab(y, `พ.ศ. ${toThai(y)}`)).join('') +
    (compare ? tab('compare', 'เทียบปี') : '');

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.year-tab');
    if (!btn) return;
    const raw = btn.dataset.y;
    const val = raw === 'compare' ? 'compare' : +raw;
    if (val === current) return;
    onChange(val);
  });

  anchor.after(bar);
}
