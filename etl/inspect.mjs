/* etl/inspect.mjs — สำรวจ schema/คุณภาพของไฟล์ใน etl/input/ (อ่านอย่างเดียว ไม่เขียนอะไร)
   ใช้: node etl/inspect.mjs
*/
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const INPUT_DIR = new URL('./input/', import.meta.url);
const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(csv|tsv)$/i.test(f));
if (!files.length) { console.error('ไม่พบ .csv ใน etl/input/'); process.exit(1); }

const DISEASE = ['I10','E11','E78','N18','J06','I63','I25','A09','H25','J18','J44','S06','M54','C22','K29','C34','N40','F10','I50','C18-C21','F32','A15-A16','B20-B24','M10','F15','N20','L03','C61','J45','U07.1'];

function splitCSV(line, delim) {
  // parser เล็กๆ รองรับ quoted field
  const out = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === delim) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

async function inspect(file) {
  const full = path.join(fs.realpathSync(INPUT_DIR), file);
  const delim = file.endsWith('.tsv') ? '\t' : ',';
  const rl = readline.createInterface({ input: fs.createReadStream(full), crlfDelay: Infinity });

  let header = null, n = 0, badWidth = 0;
  const nonEmpty = {};      // col -> count มีค่า
  const distinct = {};      // col -> Set (เก็บไม่เกิน 60 ค่า)
  const distinctOverflow = {};
  const diseaseY = {};      // code -> count Y
  const idfinal = new Set();
  let idfinalDup = 0;
  const sampleRows = [];

  for await (const raw of rl) {
    if (raw === '') continue;
    const cells = splitCSV(raw, delim);
    if (!header) {
      header = cells.map(s => s.trim());
      header.forEach(h => { nonEmpty[h] = 0; distinct[h] = new Set(); distinctOverflow[h] = false; });
      continue;
    }
    n++;
    if (cells.length !== header.length) badWidth++;
    if (sampleRows.length < 3) sampleRows.push(cells);

    header.forEach((h, i) => {
      const v = (cells[i] ?? '').trim();
      if (v !== '') {
        nonEmpty[h]++;
        const set = distinct[h];
        if (!distinctOverflow[h]) {
          if (set.size < 60) set.add(v);
          else if (!set.has(v)) distinctOverflow[h] = true;
        }
      }
    });

    DISEASE.forEach((code, i) => {
      const idx = header.indexOf(code);
      if (idx >= 0 && (cells[idx] ?? '').trim().toUpperCase() === 'Y') diseaseY[code] = (diseaseY[code] || 0) + 1;
    });

    const idf = (cells[header.indexOf('id_card_final')] ?? '').trim();
    if (idf) { if (idfinal.has(idf)) idfinalDup++; else idfinal.add(idf); }
  }

  console.log('\n══════════════════════════════════════════════════════════');
  console.log(' FILE:', file);
  console.log('══════════════════════════════════════════════════════════');
  console.log(' rows (ไม่รวม header):', n.toLocaleString(), '| columns:', header.length, '| แถวที่จำนวน field ผิด:', badWidth);
  console.log(' id_card_final: distinct =', idfinal.size.toLocaleString(), '| ซ้ำ =', idfinalDup);

  console.log('\n --- คอลัมน์ (ชื่อ | %มีค่า | #distinct | ตัวอย่างค่า) ---');
  for (const h of header) {
    if (DISEASE.includes(h)) continue;
    const pct = ((nonEmpty[h] / n) * 100).toFixed(1).padStart(5);
    const nd = distinctOverflow[h] ? '60+' : String(distinct[h].size);
    let sample = [...distinct[h]].slice(0, 6).join(' , ');
    if (sample.length > 90) sample = sample.slice(0, 90) + '…';
    console.log(`  ${h.padEnd(26)} ${pct}%  d=${nd.padStart(4)}  ${sample}`);
  }

  console.log('\n --- 30 disease flags (%Y จากทุกแถว) ---');
  const rows = DISEASE.map(c => [c, diseaseY[c] || 0]).sort((a, b) => b[1] - a[1]);
  for (const [c, cnt] of rows) {
    const pct = ((cnt / n) * 100).toFixed(2);
    console.log(`  ${c.padEnd(9)} ${String(cnt).padStart(8)}  ${pct.padStart(6)}%`);
  }

  return { file, n, header, idfinal };
}

const results = [];
for (const f of files.sort()) results.push(await inspect(f));

if (results.length === 2) {
  const [a, b] = results;
  const setB = b.idfinal;
  let overlap = 0;
  for (const id of a.idfinal) if (setB.has(id)) overlap++;
  console.log('\n══════════════════════════════════════════════════════════');
  console.log(' JOIN ระหว่าง 2 ไฟล์ (ผ่าน id_card_final)');
  console.log('══════════════════════════════════════════════════════════');
  console.log(`  ${a.file}: ${a.idfinal.size.toLocaleString()} ids`);
  console.log(`  ${b.file}: ${b.idfinal.size.toLocaleString()} ids`);
  console.log(`  overlap: ${overlap.toLocaleString()} (${((overlap / Math.min(a.idfinal.size, b.idfinal.size)) * 100).toFixed(1)}%)`);
  console.log(`  เฉพาะไฟล์แรก: ${(a.idfinal.size - overlap).toLocaleString()} | เฉพาะไฟล์สอง: ${(b.idfinal.size - overlap).toLocaleString()}`);
}
