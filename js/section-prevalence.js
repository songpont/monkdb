/* Section: source/สำรวจความชุกโรค_30_รหัส.html */

import {
  animateFadeIn, animateBars, animateGapBars, animateCounters, animateGrpBars,
  trackObserver, teardownAnimations
} from './utils.js';
import { DATA as STATIC_DATA, MAP } from './data/data-prevalence.js';
import { loadPrevalence } from './api.js';
import { mountYearTabs, mountYearNote } from './year-tabs.js';
import { renderYearCompare } from './year-compare.js';

const YEARS = [2568, 2567];
let currentYear = 2568;

function onYearChange(container, y) {
  currentYear = y;
  teardownAnimations();
  render(container);
}

export async function render(container) {
  if (currentYear === 'compare') return renderCompareView(container);
  container.innerHTML = `

<header class="hero">
  <div class="hero-inner">
    <p class="eyebrow" style="color:var(--saffron-500);">Disease Explorer · ทั้ง 30 รหัสโรค</p>
    <h1>ความชุกโรคพระสงฆ์ทั้ง 30 รหัส:<br><span>เลือกดูโรคไหนก็ได้ ทั่วประเทศถึงระดับจังหวัด</span></h1>
    <p>ฐานข้อมูลนี้บันทึกการวินิจฉัยโรค 30 ชนิดต่อพระสงฆ์ 1 รูป หน้านี้ให้เลือกดูทีละโรคได้ทั้งหมด พร้อมกราฟจัดอันดับ แผนที่ประเทศไทย และรายละเอียดถึงระดับเขตสุขภาพ/จังหวัด</p>
    <div class="badge-row">
      <span class="badge">เลือกโรคได้ 30 แบบ</span>
      <span class="badge">แผนที่ 77 จังหวัด</span>
      <span class="badge">13 เขตสุขภาพ</span>
      <span class="badge">Interactive ทั้งหมด</span>
    </div>
  </div>
</header>

<!-- ============ INTRO ============ -->
<section id="intro">
  <div class="sec-head fade-in">
    <p class="eyebrow">ก่อนเริ่มดู</p>
    <h2>วิธีคิดของหน้านี้ (ทำทีละขั้น)</h2>
    <p>ทุกกราฟและแผนที่ในหน้านี้ทำงานตามหลักการเดียวกัน — เลือกโรค 1 อย่างจาก 30 อย่าง แล้วทุกอย่างจะอัปเดตให้เห็นโรคนั้นในทุกมุมมอง</p>
    <div class="divider"></div>
  </div>
  <div class="info-callout fade-in" style="display:block;">
    <p style="margin:0 0 .3rem; font-weight:700; color:var(--maroon-800);">วิธีคิด:</p>
    <ol class="step-list">
      <li>ข้อมูลมีคอลัมน์บอกว่าพระสงฆ์แต่ละรูปเคยถูกวินิจฉัยโรคแต่ละอย่างจาก 30 ชนิดหรือไม่ (เช่น ความดันสูง เบาหวาน มะเร็งปอด วัณโรค ฯลฯ)</li>
      <li>เลือก 1 โรคจากช่องเลือกด้านล่าง (หรือคลิกแท่งในกราฟจัดอันดับ) ระบบจะคำนวณ "% ที่พบโรคนี้" แยกเป็นรายจังหวัด (77 จังหวัด) และรายเขตสุขภาพ (13 เขต)</li>
      <li>แผนที่จะระบายสีจังหวัดตามความเข้มของ % ที่พบ — สีเข้ม (แดงเลือดหมู) = พบเยอะ, สีอ่อน (ครีม) = พบน้อย เทียบกันเฉพาะภายในโรคที่เลือกอยู่</li>
      <li>คลิกเขตสุขภาพด้านล่างแผนที่ เพื่อดูรายละเอียดจังหวัดในเขตนั้นสำหรับโรคที่เลือก</li>
    </ol>
    <div class="caveat-note">
      <b>ข้อควรระวัง:</b> โรคที่พบน้อยมาก (เช่น มะเร็งบางชนิด &lt;0.3%) แผนที่จะไล่สีตามค่าต่ำสุด-สูงสุด<b>ของโรคนั้นเอง</b> ไม่ใช่เทียบกับโรคอื่น ดังนั้นสีแดงเข้มของโรคหายากกับโรคที่พบบ่อย อาจหมายถึงตัวเลข % ที่ต่างกันมาก อย่าเทียบความเข้มสีข้ามโรคโดยตรง ให้ดูตัวเลขกำกับเสมอ
    </div>
  </div>
</section>

<!-- ============ RANKING ============ -->
<section id="ranking">
  <div class="sec-head fade-in">
    <p class="eyebrow">ภาพรวมทั้งประเทศ</p>
    <h2>จัดอันดับความชุกทั้ง 30 โรค</h2>
    <p>คลิกแท่งไหนก็ได้ (หรือใช้ช่องเลือกด้านบน) เพื่อเลือกโรคที่จะดูในแผนที่และรายเขต/จังหวัดด้านล่าง</p>
    <div class="divider"></div>
  </div>

  <div class="group-legend fade-in" id="groupLegend"></div>

  <div class="disease-select-wrap fade-in">
    <select id="diseaseSelect"></select>
    <div class="selected-badge" id="selectedBadge"></div>
  </div>

  <div class="card fade-in">
    <div class="rank-bars" id="rankBars"></div>
    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> โรคทั้ง 30 ชนิดน่าจะมีความชุกต่างกันมาก บางโรคพบทั่วไป บางโรคพบน้อยมาก ควรเห็นภาพรวมทั้งหมดก่อนเจาะลึกทีละโรค</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> คำนวณ % ที่พบแต่ละโรคจากพระสงฆ์ที่มีประวัติในระบบ HISO ทั้งหมด (220,296 รูป) แล้วเรียงจากมากไปน้อย</div>
      <div class="row"><b>พบว่า:</b> กลุ่มเมตาบอลิก/หัวใจ (ความดันสูง ไขมันสูง เบาหวาน) ครองอันดับต้นทั้งหมด ห่างจากอันดับ 4 (ไตวายเรื้อรัง) มาก สะท้อนว่าเป็นกลุ่มโรคหลักที่ควรได้รับความสำคัญสูงสุดในการป้องกัน</div>
    </div>
  </div>
</section>

<!-- ============ MAP ============ -->
<section id="map">
  <div class="sec-head fade-in">
    <p class="eyebrow">มุมมองภูมิศาสตร์</p>
    <h2>แผนที่ประเทศไทย: <span id="mapTitleDisease" style="color:var(--saffron-600);"></span></h2>
    <p>ระบายสีตาม % ที่พบโรคที่เลือกอยู่ในแต่ละจังหวัด — วางเมาส์บนจังหวัดเพื่อดูตัวเลข คลิกเพื่อดูรายละเอียด</p>
    <div class="divider"></div>
  </div>

  <div class="card fade-in">
    <div class="map-layout">
      <div>
        <div class="map-svg-wrap"><svg id="thMap" viewBox="0 0 500 700"><g id="mapProvinces"></g></svg></div>
        <div class="legend-scale">
          <div class="legend-bar"></div>
        </div>
        <div class="legend-labels"><span id="legendMin">น้อยสุด</span><span id="legendMax">มากสุด</span></div>
      </div>
      <div class="map-detail-panel" id="mapDetailPanel">
        <h5>แตะจังหวัดบนแผนที่</h5>
        <p style="font-size:.8rem; color:var(--ink-soft); margin:0;">เพื่อดูตัวเลขและอันดับเทียบกับจังหวัดอื่น</p>
        <ol class="map-top5" id="mapTop5"></ol>
      </div>
    </div>
    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> โรคบางชนิดอาจกระจุกตัวในบางภูมิภาคของประเทศ ไม่ได้กระจายเท่ากันทุกที่</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> คำนวณ % ที่พบโรคที่เลือกแยกรายจังหวัด (เฉพาะจังหวัดที่มีข้อมูลเพียงพอ) แล้วไล่สีตามค่าที่พบ</div>
      <div class="row"><b>พบว่า:</b> ลองสลับดูหลายโรค จะเห็นรูปแบบทางภูมิศาสตร์ต่างกันชัดเจน — บางโรค (เช่น วัณโรค, HIV) กระจุกภาคใต้ตอนล่าง บางโรค (เช่น กลุ่มเมตาบอลิก) กระจุกภาคกลาง/เหนือตอนล่าง</div>
    </div>
  </div>
</section>

<!-- ============ REGION/PROVINCE VIEW ============ -->
<section id="regionview">
  <div class="sec-head fade-in">
    <p class="eyebrow">เจาะลึกรายเขต</p>
    <h2>สำรวจรายเขตสุขภาพ — แตะเพื่อดูรายจังหวัด</h2>
    <p>ดูตัวเลขของโรคที่เลือกอยู่ แยกรายเขตสุขภาพ (13 เขต) และดูรายจังหวัดในเขตนั้นได้ทันที</p>
    <div class="divider"></div>
  </div>
  <div class="card fade-in">
    <div class="region-grid" id="regionGrid"></div>
    <div style="margin-top:1.2rem;">
      <h4 id="regionDetailTitle" style="color:var(--maroon-800); font-size:1.05rem;"></h4>
      <div class="prov-bar-list" id="provBarList"></div>
    </div>
  </div>
</section>

<!-- ============ INSIGHTS ============ -->
<section id="insights">
  <div class="sec-head fade-in">
    <p class="eyebrow">สรุป</p>
    <h2>ข้อสังเกตที่น่าสนใจจากการไล่ดูทีละโรค</h2>
    <p>ตัวอย่างรูปแบบที่พบเมื่อลองสลับดูหลายโรค</p>
    <div class="divider"></div>
  </div>
  <div class="card fade-in">
    <ul style="font-size:.9rem; color:var(--ink-soft); line-height:2; padding-left:1.2rem; margin:0;">
      <li><b style="color:var(--maroon-800);">กลุ่มเมตาบอลิก/หัวใจ</b> (ความดันสูง ไขมันสูง เบาหวาน) — กระจุกภาคกลาง/เหนือตอนล่าง สอดคล้องกับที่พบในการวิเคราะห์รอบก่อนหน้า</li>
      <li><b style="color:var(--maroon-800);">กลุ่มโรคติดต่อ</b> (วัณโรค, HIV) — กระจุกภาคใต้ตอนล่างชัดเจนกว่ากลุ่มอื่น</li>
      <li><b style="color:var(--maroon-800);">กลุ่มมะเร็ง</b> — ความชุกต่ำมากทุกโรค (ต่ำกว่า 0.3-0.5% ส่วนใหญ่) ทำให้แผนที่มีความแตกต่างระหว่างจังหวัดสูง (เพราะฐานตัวเลขเล็ก) ควรตีความอย่างระมัดระวังเป็นพิเศษ</li>
      <li><b style="color:var(--maroon-800);">ลองเลือกดูโรคที่ไม่ค่อยมีคนพูดถึง</b> เช่น ต้อกระจก (H25) หรือปวดหลัง (M54) จะเห็นรูปแบบภูมิศาสตร์ที่ต่างจากโรคหลักอย่างสิ้นเชิง เป็นข้อมูลที่มีประโยชน์ต่อการวางแผนบริการเฉพาะทาง</li>
    </ul>
  </div>
</section>

`;
  const badge = document.getElementById('selectedBadge');
  if (badge) badge.textContent = 'กำลังโหลดข้อมูล…';
  const { data, source } = await loadPrevalence(STATIC_DATA, currentYear);
  initPrevalence(container, data, source);
  if (source === 'd1') {
    mountYearTabs(container, {
      years: YEARS, current: currentYear, compare: true,
      onChange: (y) => onYearChange(container, y)
    });
  } else {
    mountYearNote(container, { year: currentYear, source });
  }
}

async function renderCompareView(container) {
  container.innerHTML = `
<header class="hero"><div class="hero-inner">
  <p class="eyebrow" style="color:var(--saffron-500);">สำรวจความชุก · เทียบรายปี</p>
  <h1>ความชุกโรค ๓๐ รหัส<br><span>เทียบ พ.ศ. ๒๕๖๗ ↔ ๒๕๖๘</span></h1>
</div></header>
<section id="cmp"><div class="route-loading">กำลังโหลดทั้งสองปี…</div></section>`;

  mountYearTabs(container, {
    years: YEARS, current: 'compare', compare: true,
    onChange: (y) => onYearChange(container, y)
  });

  const [nw, od] = await Promise.all([
    loadPrevalence(STATIC_DATA, 2568),
    loadPrevalence(STATIC_DATA, 2567)
  ]);
  const cmp = container.querySelector('#cmp');
  if (nw.source !== 'd1' || od.source !== 'd1') {
    cmp.innerHTML = '<div class="card">โหมดเทียบปีต้องใช้ข้อมูลจากฐานข้อมูลออนไลน์ — ตอนนี้หน้าเว็บใช้ข้อมูลสำรอง จึงเทียบสองปีไม่ได้</div>';
    return;
  }

  const N = nw.data, O = od.data;
  const CODES = Object.keys(N.national);
  const label = (c) => `${N.disease_names[c]} (${c})`;

  const geos = [{ id: 'national|TH', label: 'ทั้งประเทศ' }];
  for (let r = 1; r <= 13; r++) if (N.regions[r]) geos.push({ id: `region|${r}`, label: N.regions[r].name });
  for (const p of Object.keys(N.provinces)) geos.push({ id: `province|${p}`, label: `จังหวัด${p}` });

  const pickMaps = (geoId) => {
    const [lvl, id] = geoId.split('|');
    if (lvl === 'national') return [O.national, N.national];
    if (lvl === 'region') return [O.regions[id], N.regions[id]];
    return [O.provinces[id], N.provinces[id]];
  };

  renderYearCompare(cmp, {
    yearOld: 2567, yearNew: 2568, geos, defaultGeo: 'national|TH',
    getRows: (geoId) => {
      const [o, n] = pickMaps(geoId);
      if (!o || !n) return [];
      return CODES.map((c) => ({ key: c, label: label(c), a: o[c], b: n[c] }));
    },
    note: 'เรียงจากรายการที่เปลี่ยนมากไปน้อย · ตัวเลขทั้งหมดถูกปัดเป็นหลัก 5 เพื่อปกป้องข้อมูลรายบุคคล จังหวัดที่มีพระสงฆ์น้อยจึงอาจคลาดเคลื่อนได้'
  });

  animateFadeIn(container);
}

function initPrevalence(container, DATA, source) {
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);


const DISEASE_CODES = Object.keys(DATA.national);
const GROUP_ORDER = ['เมตาบอลิก/หัวใจ','ไต/ทางเดินปัสสาวะ','ทางเดินหายใจ','มะเร็ง','จิตเวช/สารเสพติด','โรคติดต่อ','อื่นๆ'];
const GROUP_COLOR = {
  'เมตาบอลิก/หัวใจ':'#C97B1D','ไต/ทางเดินปัสสาวะ':'#4F6B58','ทางเดินหายใจ':'#8A2A2E',
  'มะเร็ง':'#6B1E23','จิตเวช/สารเสพติด':'#7C9A85','โรคติดต่อ':'#33090D','อื่นๆ':'#B08968'
};
let currentDisease = 'I10';
let currentRegion = 1;

function diseaseLabel(code){ return `${DATA.disease_names[code]} (${code})`; }

// ---- group legend ----
function renderGroupLegend(){
  const el = document.getElementById('groupLegend');
  if(!el) return;
  el.innerHTML = GROUP_ORDER.map(g=>`<span class="group-chip" style="border-left:4px solid ${GROUP_COLOR[g]};">${g}</span>`).join('');
}

// ---- disease select dropdown ----
function renderSelect(){
  const sel = document.getElementById('diseaseSelect');
  if(!sel) return;
  let html = '';
  GROUP_ORDER.forEach(g=>{
    const codes = DISEASE_CODES.filter(c=>DATA.disease_group[c]===g);
    html += `<optgroup label="${g}">`;
    codes.forEach(c=>{ html += `<option value="${c}">${diseaseLabel(c)} — ${DATA.national[c]}%</option>`; });
    html += `</optgroup>`;
  });
  sel.innerHTML = html;
  sel.value = currentDisease;
  sel.addEventListener('change', ()=>{ currentDisease = sel.value; updateAll(); });
}

// ---- national ranking bars ----
function renderRankBars(){
  const sorted = DISEASE_CODES.slice().sort((a,b)=> DATA.national[b]-DATA.national[a]);
  const max = DATA.national[sorted[0]];
  const wrap = document.getElementById('rankBars');
  if(!wrap) return;
  wrap.innerHTML = '';
  sorted.forEach(code=>{
    const row = document.createElement('div');
    row.className = 'rb-row' + (code===currentDisease ? ' active' : '');
    const pct = (DATA.national[code]/max*100);
    row.innerHTML = `<div class="rbname">${diseaseLabel(code)}</div>
      <div class="rb-track" data-code="${code}"><div class="rb-fill" data-w="${pct}"></div></div>
      <div class="rb-val">${DATA.national[code]}%</div>`;
    row.querySelector('.rb-track').addEventListener('click', ()=>{ currentDisease = code; updateAll(); });
    wrap.appendChild(row);
  });
  requestAnimationFrame(()=>{
    document.querySelectorAll('.rb-fill').forEach(el=>{ el.style.width = el.dataset.w + '%'; });
  });
}

// ---- color scale ----
function colorFor(v, vmin, vmax){
  if(vmax<=vmin) return '#F3E6CC';
  let t = (v-vmin)/(vmax-vmin);
  t = Math.max(0, Math.min(1, t));
  // 3-stop: parchment-deep -> saffron -> maroon
  function lerp(a,b,t){ return Math.round(a+(b-a)*t); }
  function hex(r,g,b){ return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join(''); }
  const c0=[243,230,204], c1=[232,162,58], c2=[107,30,35];
  if(t<0.5){ const tt=t/0.5; return hex(lerp(c0[0],c1[0],tt),lerp(c0[1],c1[1],tt),lerp(c0[2],c1[2],tt)); }
  const tt=(t-0.5)/0.5; return hex(lerp(c1[0],c2[0],tt),lerp(c1[1],c2[1],tt),lerp(c1[2],c2[2],tt));
}

// ---- map ----
function renderMap(){
  const vals = Object.keys(DATA.provinces)
    .map(p=>DATA.provinces[p][currentDisease])
    .filter(v=>v!=null && !Number.isNaN(v));
  const vmin = vals.length ? Math.min(...vals) : 0;
  const vmax = vals.length ? Math.max(...vals) : 1;
  const g = document.getElementById('mapProvinces');
  if(!g) return;
  while(g.firstChild){ g.removeChild(g.firstChild); }
  Object.keys(MAP.provinces).forEach(name=>{
    const pdata = MAP.provinces[name];
    const val = DATA.provinces[name] ? DATA.provinces[name][currentDisease] : null;
    const color = val!==null ? colorFor(val, vmin, vmax) : '#EEEEEE';
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', pdata.d);
    path.setAttribute('class','map-province');
    path.setAttribute('fill', color);
    path.addEventListener('mouseenter', ()=>{
      showMapDetail(name, val);
    });
    path.addEventListener('click', ()=>{
      showMapDetail(name, val, true);
    });
    const title = document.createElementNS('http://www.w3.org/2000/svg','title');
    title.textContent = `${name}: ${val==null ? 'ข้อมูลน้อยเกินไป' : val + '%'}`;
    path.appendChild(title);
    g.appendChild(path);
  });
  document.getElementById('legendMin') && (document.getElementById('legendMin').textContent = `น้อยสุด (${vmin}%)`);
  document.getElementById('legendMax') && (document.getElementById('legendMax').textContent = `มากสุด (${vmax}%)`);
  document.getElementById('mapTitleDisease') && (document.getElementById('mapTitleDisease').textContent = diseaseLabel(currentDisease));
  renderMapTop5();
}

function showMapDetail(name, val, pinned){
  const panel = document.getElementById('mapDetailPanel');
  if(!panel) return;
  const nTxt = DATA.provinces[name] && DATA.provinces[name].n ? DATA.provinces[name].n.toLocaleString() : '—';
  panel.innerHTML = `<h5>${name}</h5><div class="dv">${val==null ? 'ไม่มีข้อมูล' : val + '%'}</div><div class="dl">${diseaseLabel(currentDisease)} · พระสงฆ์ ${nTxt} รูป</div>`;
}

function renderMapTop5(){
  const arr = Object.keys(DATA.provinces)
    .map(p=>({name:p, val:DATA.provinces[p][currentDisease]}))
    .filter(x=>x.val!=null && !Number.isNaN(x.val));
  arr.sort((a,b)=>b.val-a.val);
  const top5 = arr.slice(0,5);
  const list = document.getElementById('mapTop5');
  if(!list) return;
  list.innerHTML = `<b style="color:var(--maroon-800); font-size:.78rem;">5 จังหวัดสูงสุด:</b>` +
    top5.map(p=>`<li>${p.name} — <b>${p.val}%</b></li>`).join('');
}

// ---- region explorer ----
function renderRegionGrid(){
  const grid = document.getElementById('regionGrid');
  if(!grid) return;
  grid.innerHTML = '';
  for(let r=1;r<=13;r++){
    const rd = DATA.regions[r];
    const el = document.createElement('div');
    el.className = 'region-card' + (r===currentRegion ? ' active' : '');
    const shortName = r===13 ? 'กทม.' : ('เขต '+r);
    el.innerHTML = `<div class="rn">${shortName}</div><div class="rl">${rd.name.replace(/^เขต \d+ ?/,'').replace(/[()]/g,'')}</div><div class="rv">${rd[currentDisease]}%</div>`;
    el.addEventListener('click', ()=>{ currentRegion = r; renderRegionGrid(); renderProvBarList(); });
    grid.appendChild(el);
  }
}

function renderProvBarList(){
  const rd = DATA.regions[currentRegion];
  const titleEl = document.getElementById('regionDetailTitle');
  if(titleEl) titleEl.textContent = `${rd.name} — ${diseaseLabel(currentDisease)}`;
  const region_map = {
    1:["เชียงใหม่","เชียงราย","ลำปาง","ลำพูน","แม่ฮ่องสอน","น่าน","พะเยา","แพร่"],
    2:["ตาก","พิษณุโลก","เพชรบูรณ์","สุโขทัย","อุตรดิตถ์"],
    3:["กำแพงเพชร","ชัยนาท","นครสวรรค์","พิจิตร","อุทัยธานี"],
    4:["นนทบุรี","ปทุมธานี","พระนครศรีอยุธยา","ลพบุรี","สระบุรี","สิงห์บุรี","อ่างทอง","นครนายก"],
    5:["กาญจนบุรี","นครปฐม","ประจวบคีรีขันธ์","เพชรบุรี","ราชบุรี","สมุทรสาคร","สมุทรสงคราม","สุพรรณบุรี"],
    6:["จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ตราด","ปราจีนบุรี","ระยอง","สมุทรปราการ","สระแก้ว"],
    7:["กาฬสินธุ์","ขอนแก่น","มหาสารคาม","ร้อยเอ็ด"],
    8:["บึงกาฬ","เลย","หนองคาย","หนองบัวลำภู","อุดรธานี","สกลนคร","นครพนม"],
    9:["ชัยภูมิ","นครราชสีมา","บุรีรัมย์","สุรินทร์"],
    10:["มุกดาหาร","ยโสธร","ศรีสะเกษ","อำนาจเจริญ","อุบลราชธานี"],
    11:["กระบี่","ชุมพร","นครศรีธรรมราช","พังงา","ภูเก็ต","ระนอง","สุราษฎร์ธานี"],
    12:["ตรัง","นราธิวาส","ปัตตานี","พัทลุง","ยะลา","สงขลา","สตูล"],
    13:["กรุงเทพมหานคร"],
  };
  const provs = (region_map[currentRegion]||[]).map(name=>({
    name,
    val: DATA.provinces[name] ? DATA.provinces[name][currentDisease] : null,
    n: DATA.provinces[name] ? DATA.provinces[name].n : 0
  }));
  provs.sort((a,b)=>(b.val ?? -1)-(a.val ?? -1));
  const maxVal = Math.max(...provs.map(p=>p.val ?? 0), 0.01);
  const list = document.getElementById('provBarList');
  if(!list) return;
  list.innerHTML = '';
  provs.forEach(p=>{
    const row = document.createElement('div');
    row.className = 'prov-bar-row';
    const pct = p.val==null ? 0 : Math.max(3, p.val/maxVal*100);
    row.innerHTML = `<div class="pname">${p.name} <span style="color:var(--sage); font-size:.68rem;">(n=${p.n})</span></div>
      <div class="ptrack"><div class="pfill" style="width:${pct}%;"></div></div>
      <div class="pval">${p.val==null ? '—' : p.val + '%'}</div>`;
    list.appendChild(row);
  });
}

function updateAll(){
  const selEl = document.getElementById('diseaseSelect');
  if(selEl) selEl.value = currentDisease;
  const badgeEl = document.getElementById('selectedBadge');
  if(badgeEl) badgeEl.textContent = `กำลังดู: ${diseaseLabel(currentDisease)}`
    + (source === 'd1' ? '  ·  ข้อมูลสด' : '  ·  ข้อมูลสำรอง');
  renderRankBars();
  renderMap();
  renderRegionGrid();
  renderProvBarList();
}

function mount(){
  try{
    renderGroupLegend();
    renderSelect();
    updateAll();

    const fadeEls = document.querySelectorAll('.fade-in');
    const fadeObs = trackObserver(new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); fadeObs.unobserve(e.target); } });
    }, {threshold:.1}));
    fadeEls.forEach(el=>fadeObs.observe(el));
  } catch(err){
    console.error('Prevalence init error:', err);
  }
}
mount();

}
