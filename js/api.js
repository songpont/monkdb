/* ============================================================
   API client — ดึงข้อมูลจาก Worker /api/* (D1) พร้อม fallback
   ไป static bundle เมื่อ endpoint ไม่พร้อม (เช่น build v1 ที่ไม่มี Worker)
   ============================================================ */

let apiUp = null; // null = ยังไม่รู้, true/false = เช็คแล้ว

/** เช็คว่า /api พร้อมใช้ (cache ผลไว้ทั้ง session) — ยืนยันด้วยการ parse JSON จริง
    (บน build ที่ไม่มี Worker /api/meta จะได้ index.html กลับมา → parse ไม่ผ่าน) */
export async function apiAvailable() {
  if (apiUp !== null) return apiUp;
  try {
    const r = await fetch('/api/meta', { headers: { accept: 'application/json' } });
    if (!r.ok) { apiUp = false; return apiUp; }
    const j = await r.json();
    apiUp = !!j && typeof j === 'object' && !Array.isArray(j);
  } catch {
    apiUp = false;
  }
  return apiUp;
}

async function getJSON(path) {
  const r = await fetch(path, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

/**
 * โหลดข้อมูลหน้า "สำรวจความชุก"
 * @param {object} staticData  DATA จาก js/data/data-prevalence.js (ใช้เป็น fallback + แหล่ง disease_names/group)
 * @param {number} [year=2568]
 * @returns {{data: object, source: 'd1'|'static'}}
 */
export async function loadPrevalence(staticData, year = 2568) {
  const codes = Object.keys(staticData.national);
  try {
    if (!(await apiAvailable())) throw new Error('api down');
    const d1 = await getJSON(`/api/prevalence?year=${year}`);

    const fill = (obj) => {
      const o = { ...obj };
      for (const c of codes) if (!(c in o)) o[c] = null; // cell ที่ถูก suppress
      return o;
    };
    const regions = {};
    for (let r = 1; r <= 13; r++) {
      regions[r] = d1.regions[r]
        ? fill(d1.regions[r])
        : { ...staticData.regions[r] }; // เขตไหนไม่มีใน D1 (ไม่น่าเกิด) ใช้ static
    }
    const provinces = {};
    for (const p of Object.keys(staticData.provinces)) {
      provinces[p] = d1.provinces[p] ? fill(d1.provinces[p]) : fill({ n: staticData.provinces[p].n });
    }

    return {
      source: 'd1',
      data: {
        disease_names: staticData.disease_names,
        disease_group: staticData.disease_group,
        national: fill(d1.national),
        regions,
        provinces
      }
    };
  } catch (e) {
    console.warn('[api] prevalence: ใช้ข้อมูล static แทน —', e.message);
    return { source: 'static', data: staticData };
  }
}

/** หน้า "คลัสเตอร์โรค" — { NATIONAL_MULTI, REGION_SUMMARY, REGION_PROVINCES } · status: all|monk|novice */
export async function loadCluster(staticSets, year = 2568, status = 'all') {
  try {
    if (!(await apiAvailable())) throw new Error('api down');
    const d = await getJSON(`/api/cluster?year=${year}&status=${status}`);
    if (!d.regions?.length) throw new Error('empty');
    return {
      source: 'd1',
      data: {
        NATIONAL_MULTI: d.national_multi,
        NATIONAL: d.national || null,          // { n, pct_multi, pct_60plus, pm2-5, I10..U07.1 }
        REGION_SUMMARY: d.regions,             // items มี 30 โรค + pct_60plus
        REGION_PROVINCES: d.region_provinces,
        CODES: d.codes || null
      }
    };
  } catch (e) {
    console.warn('[api] cluster: static —', e.message);
    return { source: 'static', data: staticSets };
  }
}

/** หน้า "ภาระโรค" — { NATIONAL_BG, PROVINCE_BG, REGION_AGE_DATA } (fallback ราย province/region) */
export async function loadBurden(staticSets, year = 2568, status = 'all') {
  try {
    if (!(await apiAvailable())) throw new Error('api down');
    const d = await getJSON(`/api/burden?year=${year}&status=${status}`);
    if (!d.national_bg || !d.national_bg[2]) throw new Error('empty');

    const PROVINCE_BG = { ...staticSets.PROVINCE_BG };
    for (const p in d.province_bg) PROVINCE_BG[p] = d.province_bg[p];

    const regions = { ...staticSets.REGION_AGE_DATA.regions };
    for (const r in d.region_age.regions) regions[r] = d.region_age.regions[r];

    return {
      source: 'd1',
      data: {
        NATIONAL_BG: d.national_bg,
        PROVINCE_BG,
        REGION_AGE_DATA: { national: d.region_age.national, regions }
      }
    };
  } catch (e) {
    console.warn('[api] burden: static —', e.message);
    return { source: 'static', data: staticSets };
  }
}

/** หน้า "Priority Score" — เฉพาะส่วนมรณภาพ (MORTALITY_REGION/PROVINCE). PRIORITY_SCORE คงเป็น static */
export async function loadPriorityMortality(staticSets, year = 2568) {
  try {
    if (!(await apiAvailable())) throw new Error('api down');
    const d = await getJSON(`/api/priority?year=${year}`);
    if (!d.mortality_region || !Object.keys(d.mortality_region).length) throw new Error('empty');
    return {
      source: 'd1',
      data: {
        MORTALITY_REGION: d.mortality_region,
        MORTALITY_PROVINCE: d.mortality_province,
        PRIORITY_SCORE: staticSets.PRIORITY_SCORE
      }
    };
  } catch (e) {
    console.warn('[api] priority: static —', e.message);
    return { source: 'static', data: staticSets };
  }
}
