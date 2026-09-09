import fs from 'node:fs';
import readline from 'node:readline';

/** parser เล็ก รองรับ quoted field ("" = escaped quote) */
export function splitCSV(line, delim = ',') {
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

/** async generator: yield row เป็น object {header: value} */
export async function* readRows(filePath, delim = ',') {
  const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
  let header = null;
  for await (const raw of rl) {
    if (raw === '') continue;
    const cells = splitCSV(raw, delim);
    if (!header) { header = cells.map(s => s.trim()); continue; }
    const row = {};
    for (let i = 0; i < header.length; i++) row[header[i]] = (cells[i] ?? '').trim();
    yield row;
  }
}
