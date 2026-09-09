/* etl/build.mjs — CSV รายรูป (etl/input/) -> aggregate cube -> etl/output/seed.sql
 *
 * ใช้:  node etl/build.mjs
 * ตัวแปรปรับได้ (env): K (default 10)  ROUND (default 5)  MIN_TEMPLE_N (default 30)
 *
 * ไม่มี record รายบุคคลออกไป — เฉพาะจำนวนนับที่ผ่าน suppression + rounding
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { readRows } from './lib/csv.mjs';
import { PROVINCE_REGION, REGION_NAME } from './lib/provinces.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const INPUT = path.join(ROOT, 'input');
const OUTPUT = path.join(ROOT, 'output');
const SALT_FILE = path.join(INPUT, '_salt.txt');

const K = +(process.env.K ?? 10);
const ROUND = +(process.env.ROUND ?? 5);
const MIN_TEMPLE_N = +(process.env.MIN_TEMPLE_N ?? 30);

const ICD = ['I10','E11','E78','N18','J06','I63','I25','A09','H25','J18','J44','S06','M54','C22','K29','C34','N40','F10','I50','C18-C21','F32','A15-A16','B20-B24','M10','F15','N20','L03','C61','J45','U07.1'];
const US = '␟'; // unit separator สำหรับ geo_id ระดับอำเภอ

// ---- salt (คงที่ระหว่างรัน, ไม่เข้า git) ----
let SALT;
if (fs.existsSync(SALT_FILE)) {
  SALT = fs.readFileSync(SALT_FILE, 'utf8').trim();
} else {
  SALT = crypto.randomBytes(16).toString('hex');
  fs.writeFileSync(SALT_FILE, SALT + '\n');
  console.warn(`⚠ สร้าง salt ใหม่ที่ ${SALT_FILE} — เก็บไว้ให้ดี ถ้าหายไป temple_key จะเปลี่ยนหมด`);
}
const templeKey = (name, amphur, province) =>
  crypto.createHash('sha256').update([name, amphur, province, SALT].join(US)).digest('hex').slice(0, 12);

// ---- helpers ----
const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
const ageBand = (a) => a == null ? null : a < 20 ? '<20' : a < 40 ? '20-39' : a < 60 ? '40-59' : '60+';
const ordBand = (a) => a == null ? null : a < 20 ? '<20' : a <= 25 ? '20-25' : a <= 35 ? '26-35' : '36+';
const STATUS_MAP = { 'พระภิกษุ': 'monk', 'สามเณร': 'novice', 'ลาสิกขา': 'disrobed', 'มรณภาพ': 'deceased' };
const STATUS_PRIORITY = ['deceased', 'disrobed', 'monk', 'novice', 'unknown'];

function deathYear(s) {
  if (!s) return null;
  // 'd/m/yyyy' หรือ 'dd/mm/yyyy'
  const m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return +m[3];
  const m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m2 ? +m2[1] : null;
}

// ---- dedup รายไฟล์: 1 แถว/id_card_final/ปี ----
async function loadPersons(file) {
  const byId = new Map();
  for await (const row of readRows(file)) {
    const id = row['id_card_final'] || row['ID_CARD'];
    let p = byId.get(id);
    if (!p) { p = { dis: {}, statuses: new Set() }; byId.set(id, p); }

    // hiso: พบ ถ้าแถวใดแถวหนึ่งพบ
    if (row['พบใน HISO'] === 'พบ') p.hiso = true;
    // disease OR
    for (const c of ICD) if ((row[c] || '').toUpperCase() === 'Y') p.dis[c] = 1;
    // death
    if (row['สถานะเสียชีวิต'] === 'เสียชีวิต') p.dead = true;
    if (!p.deathDate && row['วันที่เสียชีวิต']) p.deathDate = row['วันที่เสียชีวิต'];
    // status (เก็บทุกค่า แล้วเลือกตาม priority ทีหลัง)
    p.statuses.add(STATUS_MAP[row['monk_status_name']] || 'unknown');
    // first non-null สำหรับ field ทะเบียน
    if (p.age == null) p.age = num(row['monk_age']);
    if (p.ordAge == null) p.ordAge = num(row['ordinate_age']);
    if (!p.province && row['affiliation_province_name']) p.province = row['affiliation_province_name'];
    if (!p.amphur && row['affiliation_amphur_name']) p.amphur = row['affiliation_amphur_name'];
    if (!p.temple && row['affiliation_temple_name']) p.temple = row['affiliation_temple_name'];
  }

  const persons = [];
  for (const p of byId.values()) {
    const status = STATUS_PRIORITY.find(s => p.statuses.has(s)) || 'unknown';
    const multi = Object.keys(p.dis).length;
    persons.push({
      hiso: !!p.hiso,
      dead: !!p.dead || status === 'deceased',
      deathYear: deathYear(p.deathDate),
      status,
      ab: ageBand(p.age),
      ob: ordBand(p.ordAge),
      province: p.province || null,
      amphur: p.amphur || null,
      temple: p.temple || null,
      region: p.province ? (PROVINCE_REGION[p.province] ?? null) : null,
      dis: p.dis,
      multi
    });
  }
  return persons;
}

// ---- accumulators ----
const round = (n) => Math.round(n / ROUND) * ROUND;

function cellPop() { return { n: 0, n_hiso: 0, m2: 0, m3: 0, m4: 0, m5: 0, dead: 0 }; }
function addPop(map, key, p) {
  let c = map.get(key); if (!c) { c = cellPop(); map.set(key, c); }
  c.n++;
  if (p.hiso) c.n_hiso++;
  if (p.multi >= 2) c.m2++;
  if (p.multi >= 3) c.m3++;
  if (p.multi >= 4) c.m4++;
  if (p.multi >= 5) c.m5++;
  if (p.dead) c.dead++;
}
function addDis(map, key, p) {
  let c = map.get(key); if (!c) { c = { n_pop: 0, cases: Object.create(null) }; map.set(key, c); }
  if (!p.hiso) return;              // ตัวหาร = เฉพาะที่พบใน HISO
  c.n_pop++;
  for (const d in p.dis) c.cases[d] = (c.cases[d] || 0) + 1;
}

function geoTargets(p, templeOk) {
  const g = [['national', 'TH']];
  if (p.region != null) g.push(['region', String(p.region)]);
  if (p.province) g.push(['province', p.province]);
  if (p.province && p.amphur) g.push(['amphur', p.province + US + p.amphur]);
  if (templeOk && p.province && p.amphur && p.temple) {
    g.push(['temple', templeKey(p.temple, p.amphur, p.province)]);
  }
  return g;
}

// ---- main ----
const files = fs.readdirSync(INPUT).filter(f => /^monk_merged_data_blind_\d{4}\.csv$/.test(f)).sort();
if (!files.length) { console.error('ไม่พบไฟล์ monk_merged_data_blind_YYYY.csv ใน etl/input/'); process.exit(1); }

const years = files.map(f => +f.match(/(\d{4})/)[1]);
const latestYear = Math.max(...years);

const popMap = new Map();   // `${year}|${geoLevel}|${geoId}|${status}|${ageBand}` -> cellPop
const disMap = new Map();   // `${year}|${geoLevel}|${geoId}|${status}|${ageBand}` -> {n_pop, cases}
const ordMap = new Map();   // `${year}|${geoLevel}|${geoId}|${ordBand}|${ageBand}` -> {n,n_hiso,i10,m2}
const mortMap = new Map();  // `${geoLevel}|${geoId}|${deathYear}` -> n
const templeInfo = new Map(); // templeKey -> {province, amphur, n}

for (const file of files) {
  const year = +file.match(/(\d{4})/)[1];
  console.log(`อ่าน ${file} …`);
  const persons = await loadPersons(path.join(INPUT, file));
  console.log(`  ${persons.length.toLocaleString()} คน (dedup แล้ว)`);

  // นับขนาดวัด (ใช้ปีล่าสุดเป็นเกณฑ์ eligibility)
  const templeCount = new Map();
  for (const p of persons) {
    if (p.province && p.amphur && p.temple) {
      const k = templeKey(p.temple, p.amphur, p.province);
      templeCount.set(k, (templeCount.get(k) || 0) + 1);
      if (!templeInfo.has(k)) templeInfo.set(k, { province: p.province, amphur: p.amphur, n: 0 });
    }
  }
  if (year === latestYear) {
    for (const [k, n] of templeCount) templeInfo.get(k).n = n;
  }

  for (const p of persons) {
    const tOk = p.province && p.amphur && p.temple &&
      (templeCount.get(templeKey(p.temple, p.amphur, p.province)) || 0) >= MIN_TEMPLE_N;
    const geos = geoTargets(p, tOk);
    const statuses = ['all', p.status];
    const bands = p.ab ? ['all', p.ab] : ['all'];

    for (const [lvl, id] of geos) {
      for (const st of statuses) {
        for (const ab of bands) {
          const key = `${year}|${lvl}|${id}|${st}|${ab}`;
          addPop(popMap, key, p);
          addDis(disMap, key, p);
        }
      }
    }

    // ordination cohort — national/region/province เท่านั้น
    if (p.ob) {
      const oGeos = geos.filter(([lvl]) => lvl === 'national' || lvl === 'region' || lvl === 'province');
      for (const [lvl, id] of oGeos) {
        for (const ab of (p.ab === '60+' ? ['all', '60+'] : ['all'])) {
          const key = `${year}|${lvl}|${id}|${p.ob}|${ab}`;
          let c = ordMap.get(key); if (!c) { c = { n: 0, n_hiso: 0, i10: 0, m2: 0 }; ordMap.set(key, c); }
          c.n++;
          if (p.hiso) c.n_hiso++;
          if (p.dis['I10']) c.i10++;
          if (p.multi >= 2) c.m2++;
        }
      }
    }

    // มรณภาพรายปี — จากไฟล์ปีล่าสุด (ครบสุด)
    if (year === latestYear && p.dead && p.deathYear) {
      const oGeos = [['national', 'TH']];
      if (p.region != null) oGeos.push(['region', String(p.region)]);
      if (p.province) oGeos.push(['province', p.province]);
      for (const [lvl, id] of oGeos) {
        const key = `${lvl}|${id}|${p.deathYear}`;
        mortMap.set(key, (mortMap.get(key) || 0) + 1);
      }
    }
  }
}

// ---- แปลงเป็นแถว + suppression + rounding ----
const sqlLines = [];
const esc = (s) => `'${String(s).replace(/'/g, "''")}'`;
let kept = { pop: 0, dis: 0, ord: 0, mort: 0 }, dropped = { pop: 0, dis: 0, ord: 0 };

function batchInsert(table, cols, rows) {
  if (!rows.length) return;
  sqlLines.push(`DELETE FROM ${table};`);
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    sqlLines.push(
      `INSERT INTO ${table} (${cols.join(',')}) VALUES\n` +
      chunk.map(r => '(' + r.join(',') + ')').join(',\n') + ';'
    );
  }
}

// fact_pop
const popRows = [];
for (const [key, c] of popMap) {
  if (c.n < K) { dropped.pop++; continue; }
  const [year, lvl, id, st, ab] = key.split('|');
  popRows.push([year, esc(lvl), esc(id), esc(st), esc(ab),
    round(c.n), round(c.n_hiso), round(c.m2), round(c.m3), round(c.m4), round(c.m5), round(c.dead)]);
  kept.pop++;
}
batchInsert('fact_pop',
  ['year','geo_level','geo_id','status','age_band','n','n_hiso','n_multi2','n_multi3','n_multi4','n_multi5','n_deceased'],
  popRows);

// fact_disease — complementary suppression
const disRows = [];
for (const [key, c] of disMap) {
  if (c.n_pop < K) { continue; }
  const [year, lvl, id, st, ab] = key.split('|');
  for (const icd of ICD) {
    const cases = c.cases[icd] || 0;
    if (cases < K || (c.n_pop - cases) < K) { dropped.dis++; continue; }
    disRows.push([year, esc(lvl), esc(id), esc(st), esc(ab), esc(icd), round(c.n_pop), round(cases)]);
    kept.dis++;
  }
}
batchInsert('fact_disease',
  ['year','geo_level','geo_id','status','age_band','icd','n_pop','n_cases'], disRows);

// fact_ordination
const ordRows = [];
for (const [key, c] of ordMap) {
  if (c.n < K) { dropped.ord++; continue; }
  const [year, lvl, id, ob, ab] = key.split('|');
  ordRows.push([year, esc(lvl), esc(id), esc(ob), esc(ab), round(c.n), round(c.n_hiso), round(c.i10), round(c.m2)]);
  kept.ord++;
}
batchInsert('fact_ordination',
  ['year','geo_level','geo_id','ord_age_band','age_band','n','n_hiso','n_i10','n_multi2'], ordRows);

// fact_mortality_year
const mortRows = [];
for (const [key, n] of mortMap) {
  if (n < K) continue;
  const [lvl, id, dy] = key.split('|');
  mortRows.push([esc(lvl), esc(id), dy, round(n)]);
  kept.mort++;
}
batchInsert('fact_mortality_year', ['geo_level','geo_id','death_year','n_deaths'], mortRows);

// dim_province
const provRows = Object.entries(PROVINCE_REGION)
  .map(([p, r]) => [esc(p), r, esc(REGION_NAME[r])]);
batchInsert('dim_province', ['province','region_id','region_name'], provRows);

// dim_temple (เฉพาะ >= MIN_TEMPLE_N)
const templeRows = [];
for (const [k, info] of templeInfo) {
  if (info.n < MIN_TEMPLE_N) continue;
  templeRows.push([esc(k), esc(info.province), esc(info.amphur), round(info.n)]);
}
batchInsert('dim_temple', ['temple_key','province','amphur','n_persons'], templeRows);

// meta
const meta = {
  generated_at: new Date().toISOString(),
  source_files: files.join(', '),
  years: years.join(', '),
  latest_year: String(latestYear),
  k_threshold: String(K),
  rounding: String(ROUND),
  min_temple_n: String(MIN_TEMPLE_N),
  grain: 'aggregate cube (no individual records)',
  suppression: `cell ที่ n<${K} ถูกตัด; disease ใช้ complementary suppression; นับที่เหลือปัดเป็นพหุคูณของ ${ROUND}`,
  note_parent_child: 'ค่าที่ระดับ parent คำนวณจากข้อมูลเต็มก่อน suppression — ไม่เท่ากับผลรวมของ children',
  rows_fact_pop: String(kept.pop),
  rows_fact_disease: String(kept.dis),
  rows_fact_ordination: String(kept.ord),
  rows_fact_mortality_year: String(kept.mort),
  rows_dim_temple: String(templeRows.length)
};
batchInsert('meta', ['key','value'], Object.entries(meta).map(([k, v]) => [esc(k), esc(v)]));

fs.mkdirSync(OUTPUT, { recursive: true });
const outFile = path.join(OUTPUT, 'seed.sql');
// หมายเหตุ: ไม่ใส่ BEGIN/COMMIT — `wrangler d1 execute --file` จัดการ transaction ให้เอง
// และปฏิเสธ BEGIN TRANSACTION/SAVEPOINT
fs.writeFileSync(outFile,
  '-- generated by etl/build.mjs — DO NOT EDIT\n' +
  sqlLines.join('\n') + '\n');

console.log('\n─────────────────────────────────────────');
console.log('เขียน', path.relative(process.cwd(), outFile));
console.log(`  fact_pop:              ${kept.pop.toLocaleString()} แถว  (ตัดทิ้ง n<${K}: ${dropped.pop.toLocaleString()})`);
console.log(`  fact_disease:          ${kept.dis.toLocaleString()} แถว  (ตัดทิ้ง cell เล็ก: ${dropped.dis.toLocaleString()})`);
console.log(`  fact_ordination:       ${kept.ord.toLocaleString()} แถว  (ตัดทิ้ง: ${dropped.ord.toLocaleString()})`);
console.log(`  fact_mortality_year:   ${kept.mort.toLocaleString()} แถว`);
console.log(`  dim_temple (>=${MIN_TEMPLE_N}):     ${templeRows.length.toLocaleString()} แถว`);
console.log(`  dim_province:          ${provRows.length} แถว`);
console.log(`  ขนาดไฟล์:              ${(fs.statSync(outFile).size / 1024).toFixed(0)} KB`);
console.log('\nขั้นต่อไป:');
console.log('  npx wrangler d1 create monk-health');
console.log('  # ใส่ database_id ใน wrangler.jsonc (ดู etl/README.md)');
console.log('  npx wrangler d1 migrations apply monk-health');
console.log('  npx wrangler d1 execute monk-health --file etl/output/seed.sql');
