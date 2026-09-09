/* ============================================================
   Year-compare view — เทียบ 2 ปี (Δ percentage point) แบบใช้ร่วมทุก section
   ============================================================ */

const THAI = ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙'];
const th = (n) => String(n).replace(/\d/g, (d) => THAI[+d]);
const sign = (d) => (d > 0 ? '+' : '') + d.toFixed(d > -1 && d < 1 ? 2 : 1);

/**
 * @param {HTMLElement} host  element ที่จะเรนเดอร์ลงไป (จะถูกล้างก่อน)
 * @param {object} opts
 *   yearOld, yearNew : number (พ.ศ.)
 *   geos    : [{ id, label }]        ตัวเลือกพื้นที่
 *   defaultGeo : id                  ค่าเริ่มต้น (ไม่ใส่ = ตัวแรก)
 *   getRows : (geoId) => [{ key, label, a, b }]   a=ปีเก่า b=ปีใหม่
 *   unit?   : string  หน่วย (default '%') — เช่น 'x' สำหรับอัตราส่วน
 *   deltaLabel? : string  หัวคอลัมน์ Δ (default 'Δ (จุด %)')
 *   intro?  : string  ย่อหน้าอธิบายใต้ h2 (แทนข้อความ default)
 *   note?   : string
 *   partial?: boolean               true = ข้อมูลบางส่วน fallback (แสดงคำเตือน)
 */
export function renderYearCompare(host, opts) {
  const { yearOld, yearNew, geos, getRows, note, partial } = opts;
  const unit = opts.unit || '%';
  const deltaLabel = opts.deltaLabel || 'เพิ่ม / ลด (จุด%)';
  const fmt = (v) => v == null ? '—' : v.toFixed(v < 10 ? 2 : 1) + unit;
  let geoId = opts.defaultGeo || geos[0].id;

  host.innerHTML = `
    <div class="sec-head fade-in">
      <p class="eyebrow">เทียบรายปี</p>
      <h2>พ.ศ. ${th(yearOld)} → ${th(yearNew)} — อะไรเปลี่ยนบ้าง</h2>
      <p>${opts.intro || 'ตัวเลขนี้<b>นับรวมทุกคนที่เคยตรวจพบว่าเป็นโรค</b> (ไม่ได้เริ่มนับใหม่ทุกปี) ตัวเลขจึงมีแต่เพิ่มขึ้น — ส่วนต่างที่แสดงคือ <b>จำนวนคนที่ถูกตรวจพบเพิ่มขึ้นในรอบปี</b> ไม่ได้แปลว่าพระสงฆ์ป่วยเป็นโรคมากขึ้นจริงในปีนั้น'}</p>
      <p style="font-size:.8rem;color:var(--ink-soft);margin-top:-.4rem;">“จุด%” = ผลต่างของเปอร์เซ็นต์แบบตรงๆ เช่น จาก 15% เป็น 17% คือเพิ่มขึ้น 2 จุด%</p>
      <div class="divider"></div>
    </div>
    ${partial ? `<div class="caveat-note fade-in">บางจังหวัดมีข้อมูลไม่ครบทั้งสองปี จึงไม่แสดงในตาราง</div>` : ''}
    <div class="filter-row fade-in">
      <label style="font-size:.82rem;font-weight:700;color:var(--maroon-800);">เลือกพื้นที่:
        <select id="yc-geo" style="font:inherit;margin-left:.4rem;padding:.25rem .5rem;">
          ${geos.map(g => `<option value="${g.id}">${g.label}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="card fade-in">
      <div class="diverge-legend">
        <span><i style="background:var(--sage);"></i>${opts.legendLow || 'เพิ่มขึ้นน้อย หรือ ลดลง'}</span>
        <span><i style="background:var(--maroon-700);"></i>${opts.legendHigh || 'เพิ่มขึ้นมาก'}</span>
      </div>
      <div id="yc-bars"></div>
    </div>
    <div class="card fade-in" style="overflow-x:auto;">
      <table class="data-table" id="yc-table">
        <thead><tr>
          <th>รายการ</th>
          <th style="text-align:right;">พ.ศ. ${th(yearOld)}</th>
          <th style="text-align:right;">พ.ศ. ${th(yearNew)}</th>
          <th style="text-align:right;">${deltaLabel}</th>
          <th style="text-align:right;">คิดเป็น</th>
        </tr></thead>
        <tbody id="yc-tbody"></tbody>
      </table>
    </div>
    ${note ? `<div class="method-note fade-in"><div class="row">${note}</div></div>` : ''}
  `;

  const sel = host.querySelector('#yc-geo');
  sel.value = geoId;
  sel.addEventListener('change', () => { geoId = sel.value; draw(); });

  function draw() {
    const rows = getRows(geoId)
      .map(r => ({ ...r, d: (r.a != null && r.b != null) ? +(r.b - r.a).toFixed(2) : null }))
      .filter(r => r.d != null);
    rows.sort((x, y) => Math.abs(y.d) - Math.abs(x.d));

    const maxAbs = Math.max(0.1, ...rows.map(r => Math.abs(r.d)));
    const bars = host.querySelector('#yc-bars');
    bars.innerHTML = rows.map(r => {
      const w = Math.min(48, Math.abs(r.d) / maxAbs * 48);
      const more = r.d > 0;
      return `<div class="dv-row">
        <div class="dv-name">${r.label}</div>
        <div class="dv-track">
          <div class="dv-center-line"></div>
          <div class="dv-bar" style="width:${w}%;left:${more ? 50 : 50 - w}%;background:${more ? 'var(--maroon-700)' : 'var(--sage)'};"></div>
        </div>
        <div class="dv-val" style="color:${more ? 'var(--maroon-700)' : 'var(--sage)'};">${sign(r.d)}</div>
      </div>`;
    }).join('') || '<p style="color:var(--ink-soft);font-size:.85rem;">ไม่มีข้อมูลเทียบสำหรับพื้นที่นี้</p>';

    host.querySelector('#yc-tbody').innerHTML = rows.map(r => {
      const pctChange = r.a ? (r.d / r.a * 100) : null;
      return `<tr>
        <td>${r.label}</td>
        <td class="num">${fmt(r.a)}</td>
        <td class="num">${fmt(r.b)}</td>
        <td class="num" style="color:${r.d > 0 ? 'var(--maroon-700)' : r.d < 0 ? 'var(--sage)' : 'var(--ink-soft)'};">${sign(r.d)}</td>
        <td class="num" style="color:var(--ink-soft);">${pctChange == null ? '—' : sign(+pctChange.toFixed(1)) + '%'}</td>
      </tr>`;
    }).join('');
  }
  draw();
}

/** สร้าง { geos, get(geoId) } จากผลลัพธ์ loadCluster (NATIONAL / REGION_SUMMARY / REGION_PROVINCES) */
export function clusterCompareIndex(clData) {
  const m = { 'national|TH': clData.NATIONAL || {} };
  const geos = [{ id: 'national|TH', label: 'ทั้งประเทศ' }];
  for (const r of clData.REGION_SUMMARY || []) {
    m[`region|${r.region}`] = r;
    geos.push({ id: `region|${r.region}`, label: r.region_name });
  }
  for (const rid in (clData.REGION_PROVINCES || {})) {
    for (const p of clData.REGION_PROVINCES[rid]) {
      m[`province|${p.affiliation_province_name}`] = p;
      geos.push({ id: `province|${p.affiliation_province_name}`, label: `จังหวัด${p.affiliation_province_name}` });
    }
  }
  return { geos, get: (id) => m[id] };
}
