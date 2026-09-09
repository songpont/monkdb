/* Cloudflare Worker — เสิร์ฟ static assets + read-only API บน D1
 *
 * ยังไม่เปิดใช้: wrangler.jsonc ปัจจุบันเป็น assets-only
 * วิธีเปิด (ดู etl/README.md):
 *   1. npx wrangler d1 create monk-health   -> ได้ database_id
 *   2. เพิ่มใน wrangler.jsonc:
 *        "main": "worker/index.js",
 *        "assets": { ..., "binding": "ASSETS" },
 *        "d1_databases": [{ "binding": "DB", "database_name": "monk-health", "database_id": "<id>" }]
 *   3. npx wrangler d1 migrations apply monk-health
 *   4. npx wrangler d1 execute monk-health --file etl/output/seed.sql
 *   5. npm run deploy
 */

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, max-age=3600',
  'access-control-allow-origin': '*'
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

// คัดเฉพาะ key ที่ต้องการจาก object (+ n, pct_multi, pm2..5 เสมอ)
const pick = (obj, keys) => {
  const o = { n: obj.n, pct_multi: obj.pct_multi, pct_60plus: obj.pct_60plus ?? null,
    pm2: obj.pm2, pm3: obj.pm3, pm4: obj.pm4, pm5: obj.pm5 };
  for (const k of keys) o[k] = obj[k] ?? null;
  return o;
};

// allow-list ป้องกัน SQL injection ผ่านชื่อคอลัมน์/ค่า enum
const REGION_NAME = {
  1: 'เขต 1 (เหนือบน)', 2: 'เขต 2 (เหนือล่าง)', 3: 'เขต 3 (นครสวรรค์)', 4: 'เขต 4 (สระบุรี)',
  5: 'เขต 5 (ราชบุรี)', 6: 'เขต 6 (ชลบุรี)', 7: 'เขต 7 (ขอนแก่น)', 8: 'เขต 8 (อุดรธานี)',
  9: 'เขต 9 (นครราชสีมา)', 10: 'เขต 10 (อุบลราชธานี)', 11: 'เขต 11 (สุราษฎร์ธานี)',
  12: 'เขต 12 (สงขลา)', 13: 'กรุงเทพมหานคร'
};

const ICD30 = ['I10','E11','E78','N18','J06','I63','I25','A09','H25','J18','J44','S06','M54','C22','K29','C34','N40','F10','I50','C18-C21','F32','A15-A16','B20-B24','M10','F15','N20','L03','C61','J45','U07.1'];

const GEO_LEVELS = new Set(['national', 'region', 'province', 'amphur', 'temple']);
const STATUSES = new Set(['all', 'monk', 'novice', 'disrobed', 'deceased']);
const AGE_BANDS = new Set(['all', '<20', '20-39', '40-59', '60+']);
const YEARS = new Set(['2567', '2568']);

async function handleApi(url, env) {
  if (!env.DB) return json({ error: 'D1 binding (DB) ยังไม่ถูกตั้งค่า' }, 503);
  const p = url.pathname.replace(/^\/api\//, '');
  const q = url.searchParams;

  const geoLevel = q.get('geo_level') || 'national';
  const geoId = q.get('geo_id') || 'TH';
  const year = q.get('year') || '2568';
  const status = q.get('status') || 'all';
  const ageBand = q.get('age_band') || 'all';

  if (!GEO_LEVELS.has(geoLevel) || !STATUSES.has(status) || !AGE_BANDS.has(ageBand) || !YEARS.has(year)) {
    return json({ error: 'พารามิเตอร์ไม่ถูกต้อง' }, 400);
  }

  try {
    switch (p) {
      case 'meta': {
        const { results } = await env.DB.prepare('SELECT key, value FROM meta').all();
        return json(Object.fromEntries(results.map(r => [r.key, r.value])));
      }
      case 'provinces': {
        const { results } = await env.DB.prepare(
          'SELECT province, region_id, region_name FROM dim_province ORDER BY region_id, province'
        ).all();
        return json(results);
      }
      case 'pop': {
        const row = await env.DB.prepare(
          `SELECT * FROM fact_pop
           WHERE year=?1 AND geo_level=?2 AND geo_id=?3 AND status=?4 AND age_band=?5`
        ).bind(+year, geoLevel, geoId, status, ageBand).first();
        return row ? json(row) : json({ error: 'ไม่พบข้อมูล (อาจถูกตัดจาก k-suppression)' }, 404);
      }
      case 'prevalence': {
        // ก้อนเดียวสำหรับหน้า "สำรวจความชุก": national + 13 เขต + 77 จังหวัด (status=all, age=all)
        // pct = 100 * n_cases / n_pop ; cell ที่ถูก suppress = ไม่มีในผลลัพธ์ (frontend เติม null)
        const { results } = await env.DB.prepare(
          `SELECT geo_level, geo_id, icd, n_pop, n_cases FROM fact_disease
           WHERE year=?1 AND status='all' AND age_band='all'
             AND geo_level IN ('national','region','province')`
        ).bind(+year).all();
        const popRes = await env.DB.prepare(
          `SELECT geo_level, geo_id, n_hiso FROM fact_pop
           WHERE year=?1 AND status='all' AND age_band='all'
             AND geo_level IN ('national','region','province')`
        ).bind(+year).all();

        const nBy = {};                       // geo_level|geo_id -> n_hiso (ตัวหาร % โรค)
        for (const r of popRes.results) nBy[`${r.geo_level}|${r.geo_id}`] = r.n_hiso;

        const out = { year: +year, national: {}, regions: {}, provinces: {} };
        for (const r of results) {
          const pct = r.n_pop ? Math.round((r.n_cases / r.n_pop) * 10000) / 100 : null;
          if (r.geo_level === 'national') {
            out.national[r.icd] = pct;
          } else if (r.geo_level === 'region') {
            const k = String(r.geo_id);
            (out.regions[k] ??= { name: REGION_NAME[+r.geo_id] || `เขต ${r.geo_id}`, n: nBy[`region|${r.geo_id}`] ?? r.n_pop })[r.icd] = pct;
          } else {
            (out.provinces[r.geo_id] ??= { n: nBy[`province|${r.geo_id}`] ?? r.n_pop })[r.icd] = pct;
          }
        }
        return json(out);
      }
      case 'disease': {
        const { results } = await env.DB.prepare(
          `SELECT icd, n_pop, n_cases FROM fact_disease
           WHERE year=?1 AND geo_level=?2 AND geo_id=?3 AND status=?4 AND age_band=?5
           ORDER BY n_cases DESC`
        ).bind(+year, geoLevel, geoId, status, ageBand).all();
        return json(results);
      }

      case 'cluster': {
        // multimorbidity + 30 โรค ต่อ national / 13 เขต / 77 จังหวัด · status = all | monk | novice ...
        const CODES = ICD30;
        const st = status; // 'all' โดย default (?status=)
        const pop = (await env.DB.prepare(
          `SELECT geo_level, geo_id, n, n_hiso, n_multi2, n_multi3, n_multi4, n_multi5 FROM fact_pop
           WHERE year=?1 AND status=?2 AND age_band='all'
             AND geo_level IN ('national','region','province')`
        ).bind(+year, st).all()).results;
        // ช่วงอายุทุก band (ตัวหาร pct_60plus = เฉพาะผู้ที่ทราบอายุ ไม่ใช่ทั้งทะเบียน)
        const popBands = (await env.DB.prepare(
          `SELECT geo_level, geo_id, age_band, n FROM fact_pop
           WHERE year=?1 AND status=?2 AND age_band IN ('<20','20-39','40-59','60+')
             AND geo_level IN ('national','region','province')`
        ).bind(+year, st).all()).results;
        const n60By = {}, nAgeKnownBy = {};
        for (const r of popBands) {
          const k = `${r.geo_level}|${r.geo_id}`;
          nAgeKnownBy[k] = (nAgeKnownBy[k] || 0) + r.n;
          if (r.age_band === '60+') n60By[k] = r.n;
        }
        const dis = (await env.DB.prepare(
          `SELECT geo_level, geo_id, icd, n_pop, n_cases FROM fact_disease
           WHERE year=?1 AND status=?2 AND age_band='all'
             AND geo_level IN ('national','region','province')`
        ).bind(+year, st).all()).results;
        const prov = (await env.DB.prepare(
          `SELECT province, region_id, region_name FROM dim_province`
        ).all()).results;
        const region_of = {}, region_name = {};
        for (const p of prov) { region_of[p.province] = p.region_id; region_name[p.region_id] = p.region_name; }

        const pct = (num, den) => den ? Math.round((num / den) * 1000) / 10 : null;
        const byGeo = {};
        for (const r of pop) {
          const k = `${r.geo_level}|${r.geo_id}`;
          byGeo[k] = {
            n: r.n_hiso,
            pct_multi: pct(r.n_multi2, r.n_hiso),
            pm2: pct(r.n_multi2, r.n_hiso), pm3: pct(r.n_multi3, r.n_hiso),
            pm4: pct(r.n_multi4, r.n_hiso), pm5: pct(r.n_multi5, r.n_hiso),
            pct_60plus: pct(n60By[k], nAgeKnownBy[k])
          };
        }
        for (const r of dis) {
          const g = byGeo[`${r.geo_level}|${r.geo_id}`];
          if (g) g[r.icd] = pct(r.n_cases, r.n_pop);
        }

        const nat = byGeo['national|TH'] || {};
        const out = {
          year: +year,
          status: st,
          codes: CODES,
          national_multi: {
            2: nat.pm2 ?? null, 3: nat.pm3 ?? null, 4: nat.pm4 ?? null, 5: nat.pm5 ?? null
          },
          national: pick(nat, CODES),
          regions: [],
          region_provinces: {}
        };
        for (let rid = 1; rid <= 13; rid++) {
          const g = byGeo[`region|${rid}`];
          if (!g) continue;
          out.regions.push({ region: rid, region_name: region_name[rid] || `เขต ${rid}`, ...pick(g, CODES) });
        }
        for (const p of prov) {
          const g = byGeo[`province|${p.province}`];
          if (!g) continue;
          (out.region_provinces[p.region_id] ??= []).push({
            affiliation_province_name: p.province, ...pick(g, CODES)
          });
        }
        return json(out);
      }

      case 'burden': {
        // multimorbidity ตามช่วงอายุ (national / region / province)  bands: <20,20-39,40-59,60+
        const st = status;
        const rows = (await env.DB.prepare(
          `SELECT geo_level, geo_id, age_band, n_hiso, n_multi2, n_multi3, n_multi4, n_multi5 FROM fact_pop
           WHERE year=?1 AND status=?2
             AND age_band IN ('<20','20-39','40-59','60+')
             AND geo_level IN ('national','region','province')`
        ).bind(+year, st).all()).results;
        const prov = (await env.DB.prepare('SELECT province, region_id, region_name FROM dim_province').all()).results;
        const region_name = {}; for (const p of prov) region_name[p.region_id] = p.region_name;

        // geo -> band -> {hiso, m2..m5}
        const g = {};
        for (const r of rows) {
          const k = `${r.geo_level}|${r.geo_id}`;
          (g[k] ??= {})[r.age_band] = { hiso: r.n_hiso, m2: r.n_multi2, m3: r.n_multi3, m4: r.n_multi4, m5: r.n_multi5 };
        }
        // รวม <20 + 20-39 -> <40 ; คืน null ถ้าฝั่งใดฝั่งหนึ่งถูก suppress
        const band3 = (o) => {
          if (!o) return null;
          const y = o['<20'], m = o['20-39'];
          if (!y || !m || !o['40-59'] || !o['60+']) return null;
          const add = (a, b, f) => a[f] + b[f];
          return {
            '<40': { hiso: add(y, m, 'hiso'), m2: add(y, m, 'm2'), m3: add(y, m, 'm3'), m4: add(y, m, 'm4'), m5: add(y, m, 'm5') },
            '40-59': o['40-59'], '60+': o['60+']
          };
        };
        const pctK = (b, k) => b && b.hiso ? Math.round((b['m' + k] / b.hiso) * 1000) / 10 : null;

        const out = { year: +year, status: st, national_bg: {}, province_bg: {}, region_age: { national: {}, regions: {} } };

        const nb = band3(g['national|TH']);
        if (nb) for (const k of [2, 3, 4, 5]) {
          out.national_bg[k] = { '<40': pctK(nb['<40'], k), '40-59': pctK(nb['40-59'], k), '60+': pctK(nb['60+'], k) };
        }
        if (nb) out.region_age.national = { '<40': pctK(nb['<40'], 2), '40-59': pctK(nb['40-59'], 2), '60+': pctK(nb['60+'], 2) };

        for (let rid = 1; rid <= 13; rid++) {
          const b = band3(g[`region|${rid}`]);
          if (!b) continue;
          out.region_age.regions[rid] = {
            region_name: region_name[rid] || `เขต ${rid}`,
            vals: { '<40': pctK(b['<40'], 2), '40-59': pctK(b['40-59'], 2), '60+': pctK(b['60+'], 2) },
            n: { '<40': b['<40'].hiso, '40-59': b['40-59'].hiso, '60+': b['60+'].hiso }
          };
        }
        for (const p of prov) {
          const b = band3(g[`province|${p.province}`]);
          if (!b) continue;
          const row = {
            n: b['<40'].hiso + b['40-59'].hiso + b['60+'].hiso,
            n_by_band: { '<40': b['<40'].hiso, '40-59': b['40-59'].hiso, '60+': b['60+'].hiso }
          };
          for (const k of [2, 3, 4, 5]) {
            const burden = pctK(b['60+'], k);       // อัตราในกลุ่ม 60+
            const low = pctK(b['<40'], k);
            row['burden' + k] = burden;
            row['growth' + k] = (burden != null && low != null) ? Math.round((burden - low) * 10) / 10 : null;
          }
          out.province_bg[p.province] = row;
        }
        return json(out);
      }

      case 'priority': {
        // มรณภาพรายปี รวมเป็น total / growth / d19 / d25  (region + province)
        const rows = (await env.DB.prepare(
          `SELECT geo_level, geo_id, death_year, n_deaths FROM fact_mortality_year
           WHERE geo_level IN ('region','province')`
        ).all()).results;
        const acc = {};
        for (const r of rows) {
          const k = `${r.geo_level}|${r.geo_id}`;
          const a = (acc[k] ??= { total: 0, d19: 0, d25: 0 });
          if (r.death_year >= 2019 && r.death_year <= 2025) a.total += r.n_deaths; // ให้ตรงกับชุดเดิม (2019–2025)
          if (r.death_year === 2019) a.d19 = r.n_deaths;
          if (r.death_year === 2025) a.d25 = r.n_deaths;
        }
        const out = { mortality_region: {}, mortality_province: {} };
        for (const k in acc) {
          const [lvl, id] = k.split('|');
          const a = acc[k];
          const rec = { total: a.total, d19: a.d19, d25: a.d25, growth: a.d19 ? Math.round((a.d25 / a.d19) * 100) / 100 : null };
          if (lvl === 'region') out.mortality_region[id] = { name: REGION_NAME[+id] || `เขต ${id}`, ...rec };
          else out.mortality_province[id] = rec;
        }
        return json(out);
      }
      case 'ordination': {
        const { results } = await env.DB.prepare(
          `SELECT ord_age_band, age_band, n, n_hiso, n_i10, n_multi2 FROM fact_ordination
           WHERE year=?1 AND geo_level=?2 AND geo_id=?3
           ORDER BY ord_age_band, age_band`
        ).bind(+year, geoLevel, geoId).all();
        return json(results);
      }
      case 'mortality': {
        const { results } = await env.DB.prepare(
          `SELECT death_year, n_deaths FROM fact_mortality_year
           WHERE geo_level=?1 AND geo_id=?2 ORDER BY death_year`
        ).bind(geoLevel, geoId).all();
        return json(results);
      }
      case 'temples': {
        const province = q.get('province');
        if (!province) return json({ error: 'ต้องระบุ province' }, 400);
        const { results } = await env.DB.prepare(
          `SELECT t.temple_key, t.amphur, t.n_persons,
                  d.n_hiso, d.n_multi2
           FROM dim_temple t
           LEFT JOIN fact_pop d
             ON d.geo_level='temple' AND d.geo_id=t.temple_key
            AND d.year=?1 AND d.status='all' AND d.age_band='all'
           WHERE t.province=?2
           ORDER BY (CAST(d.n_multi2 AS REAL) / NULLIF(d.n_hiso,0)) DESC NULLS LAST`
        ).bind(+year, province).all();
        return json(results);
      }
      default:
        return json({ error: 'ไม่รู้จัก endpoint นี้' }, 404);
    }
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

/* Basic Auth gate — เปิดเมื่อมี secret STAGING_AUTH="user:pass" (ตั้งต่อ env: staging, v2)
   env ที่ไม่ได้ตั้ง secret จะไม่ล็อก */
function staging401() {
  return new Response('ต้องล็อกอิน (pre-release)', {
    status: 401,
    headers: { 'www-authenticate': 'Basic realm="restricted", charset="UTF-8"' }
  });
}
function checkAuth(request, env) {
  if (!env.STAGING_AUTH) return true;
  const h = request.headers.get('authorization') || '';
  if (!h.startsWith('Basic ')) return false;
  let decoded = '';
  try { decoded = atob(h.slice(6)); } catch { return false; }
  // timing-safe-ish compare
  const a = new TextEncoder().encode(decoded);
  const b = new TextEncoder().encode(env.STAGING_AUTH);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export default {
  async fetch(request, env) {
    if (!checkAuth(request, env)) return staging401();

    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: { ...JSON_HEADERS, 'access-control-allow-methods': 'GET, OPTIONS' } });
      }
      return handleApi(url, env);
    }
    // ที่เหลือ = static assets (Vite build)
    return env.ASSETS.fetch(request);
  }
};
