/* Section: source/เทียบพระสงฆ์กับคนทั่วไป_30โรค.html */

import {
  animateFadeIn, animateBars, animateGapBars, animateCounters, animateGrpBars,
  trackObserver
} from './utils.js';
import { BUNDLE, COMP, AGESTD, WEIGHTS } from './data/data-comparison.js';
import { DATA as PREV_STATIC } from './data/data-prevalence.js';
import { loadPrevalence } from './api.js';
import { mountYearTabs } from './year-tabs.js';
import { renderYearCompare } from './year-compare.js';

let currentYear = 2568;
function onYearChange(container, y) { currentYear = y; render(container); }

export async function render(container) {
  if (currentYear === 'compare') return renderCompareYears(container);
  container.innerHTML = `

<header class="hero">
  <div class="hero-inner">
    <p class="eyebrow" style="color:var(--saffron-500);">เทียบพระสงฆ์ กับ ชายไทยทั่วไป</p>
    <h1>พระสงฆ์ป่วยมาก/น้อยกว่าคนทั่วไปแค่ไหน<br><span>เทียบทั้ง 30 โรค แบบเห็นเส้นชัดเจน</span></h1>
    <p>นำข้อมูลพระสงฆ์ 220,296 รูป มาเทียบกับสถิติผู้ป่วยชายไทยสิทธิบัตรทอง (UC) ทั่วประเทศ เพื่อดูว่าโรคไหนพระสงฆ์เป็นมากกว่า/น้อยกว่าคนทั่วไป</p>
    <div class="badge-row">
      <span class="badge">30 โรค ครบทุกรหัส</span>
      <span class="badge">เทียบเป็นอัตราส่วน</span>
      <span class="badge">ตัดผลเรื่องอายุออก</span>
    </div>
  </div>
</header>

<!-- ============ INTRO ============ -->
<section id="intro">
  <div class="sec-head fade-in">
    <p class="eyebrow">ก่อนดูกราฟ</p>
    <h2>วิธีคิด (ทำทีละขั้น)</h2>
    <p>เปรียบเทียบกันตรงๆ ไม่ได้ทันที เพราะข้อมูล 2 ชุดนี้เก็บวิธีต่างกันเล็กน้อย ต้องปรับให้เทียบกันได้ก่อน</p>
    <div class="divider"></div>
  </div>
  <div class="info-callout fade-in" style="display:block;">
    <p style="margin:0 0 .3rem; font-weight:700; color:var(--maroon-800);">วิธีคิด:</p>
    <ol class="step-list">
      <li>คำนวณ "% พระสงฆ์ที่เป็นโรคนี้" จากพระสงฆ์ 220,296 รูปที่มีประวัติในระบบ (แบบเดียวกับที่ทำมาตลอด)</li>
      <li>คำนวณ "% ชายไทยทั่วไปที่เป็นโรคนี้" จากไฟล์สถิติผู้ป่วยชายสิทธิบัตรทอง (UC) ปี 2568 อายุ 20 ปีขึ้นไป หารด้วยจำนวนประชากรชายไทยอายุ 20+ ทั้งประเทศ (24.65 ล้านคน จากกรมการปกครอง)</li>
      <li>เอาตัวเลขทั้งสองมาหารกัน = <b style="color:var(--maroon-800);">"อัตราส่วน" (Ratio)</b> — ถ้า Ratio = 1 แปลว่าพอๆ กัน, มากกว่า 1 แปลว่าพระสงฆ์เป็นเยอะกว่า, น้อยกว่า 1 แปลว่าพระสงฆ์เป็นน้อยกว่า</li>
      <li>ขีดเส้นตรงกลางที่ Ratio = 1 บนกราฟ แล้ววางแท่งแต่ละโรคเทียบกับเส้นนี้ ทำให้เห็นทันทีว่าโรคไหนเยอะกว่า/น้อยกว่าคนทั่วไป</li>
    </ol>
    <div class="worked-example">
      <b>ตัวอย่าง:</b> ความดันโลหิตสูง พระสงฆ์เป็น 17.2% ชายไทยทั่วไปเป็น 22.8% → เอา 17.2 ÷ 22.8 = <b>0.76</b> แปลว่าพระสงฆ์เป็นความดันสูง<b>น้อยกว่า</b>ชายไทยทั่วไป (เหลือประมาณ 76% ของอัตราคนทั่วไป)
    </div>
  </div>
</section>

<!-- ============ RATIO CHART ============ -->
<section id="ratio">
  <div class="sec-head fade-in">
    <p class="eyebrow">ภาพรวม</p>
    <h2>เทียบทั้ง 30 โรค: พระสงฆ์เยอะกว่า/น้อยกว่าคนทั่วไป</h2>
    <p>เส้นกลาง = เท่ากับคนทั่วไป (Ratio 1.0) &nbsp;·&nbsp; แท่งสีเขียวยื่นซ้าย = พระสงฆ์น้อยกว่า &nbsp;·&nbsp; แท่งสีแดงยื่นขวา = พระสงฆ์เยอะกว่า &nbsp;·&nbsp; คลิกแท่งเพื่อดูรายละเอียด</p>
    <div class="divider"></div>
  </div>

  <div class="stat-strip fade-in">
    <div class="stat-box"><div class="n">19</div><div class="l">จาก 30 โรค พระสงฆ์เป็น "น้อยกว่า" คนทั่วไป</div></div>
    <div class="stat-box"><div class="n">11</div><div class="l">จาก 30 โรค พระสงฆ์เป็น "มากกว่า" คนทั่วไป</div></div>
    <div class="stat-box"><div class="n">2.57x</div><div class="l">อัตราส่วนสูงสุด — ต่อมลูกหมากโต</div></div>
    <div class="stat-box"><div class="n">0.61x</div><div class="l">อัตราส่วนต่ำสุด — ซึมเศร้า</div></div>
  </div>

  <div class="filter-row fade-in" id="groupFilter"></div>

  <div class="card fade-in">
    <div class="diverge-legend">
      <span><i style="background:var(--sage);"></i>พระสงฆ์น้อยกว่า</span>
      <span><i style="background:var(--maroon-700);"></i>พระสงฆ์มากกว่า</span>
    </div>
    <div id="divergeChart"></div>
    <div class="detail-panel" id="detailPanel"></div>
    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> วิถีชีวิตพระสงฆ์ (ไม่ดื่มสุรา ไม่สูบบุหรี่ตามหลักศีล อาหารตามที่ถวาย กิจกรรมทางกายจำกัด) น่าจะทำให้รูปแบบโรคต่างจากชายไทยทั่วไปในหลายทาง ทั้งดีขึ้นและแย่ลง</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> เทียบอัตราการพบโรคปี 2568 ระหว่างพระสงฆ์ (220,296 รูป) กับชายไทยสิทธิ UC ทั่วประเทศ (24.65 ล้านคน อายุ 20+) ทั้ง 30 รหัสโรคเดียวกัน</div>
      <div class="row"><b>พบว่า:</b> พระสงฆ์เป็นโรคน้อยกว่าคนทั่วไปถึง 19 จาก 30 โรค โดยเฉพาะกลุ่มที่เกี่ยวกับพฤติกรรม (ติดสุรา ซึมเศร้า ปวดหลัง ความดันสูง เบาหวาน) แต่เป็นมากกว่าในกลุ่มโรคที่สัมพันธ์กับอายุ (ต่อมลูกหมากโต COPD มะเร็งต่อมลูกหมาก เก๊าท์) และโรคติดต่อจากการอยู่รวมกัน (วัณโรค)</div>
    </div>
  </div>
</section>

<!-- ============ AGE STANDARDIZATION ============ -->
<section id="agestd">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อควรระวังสำคัญที่สุด</p>
    <h2>พระสงฆ์อายุเยอะกว่าคนทั่วไปมาก — ต้องตัดผลนี้ออกก่อน</h2>
    <p>พระสงฆ์มีสัดส่วนอายุ 60+ ถึง 36.1% แต่ชายไทยทั่วไปอายุ 20+ มีแค่ 22.6% ที่เป็น 60+ — โรคที่สัมพันธ์กับอายุจึงดูเหมือนพระสงฆ์เป็นเยอะ ทั้งที่ส่วนหนึ่งเป็นเพราะโครงสร้างอายุต่างกันเฉยๆ</p>
    <div class="divider"></div>
  </div>

  <div class="card fade-in">
    <h4 style="color:var(--maroon-800); margin-bottom:.4rem;">ทดลองตัดผลอายุออก — 4 โรคเมตาบอลิกหลัก</h4>
    <div class="note">คำนวณ "อัตราที่ควรจะเป็น" ถ้าพระสงฆ์มีโครงสร้างอายุเหมือนชายไทยทั่วไป (แทนที่จะสูงวัยกว่า) แล้วเทียบกับอัตราจริงของคนทั่วไป</div>
    <div class="age-compare-grid" id="ageStdGrid"></div>
    <p style="font-size:.82rem; color:var(--ink-soft); margin-top:1.2rem; margin-bottom:0;">
      <b style="color:var(--maroon-800);">สรุป:</b> แม้จะตัดผลเรื่องอายุออกแล้ว พระสงฆ์ก็ยัง<b style="color:var(--sage);">เป็นความดันสูง เบาหวาน ไขมันสูง และไตวายเรื้อรังน้อยกว่าชายไทยทั่วไปอยู่ดี</b> — ยืนยันว่าไม่ใช่แค่เรื่องอายุ แต่วิถีชีวิตพระสงฆ์ (อาหาร/ไม่ดื่มสุรา) อาจมีผลป้องกันโรคกลุ่มนี้จริง
    </p>
    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> ตัวเลขดิบอาจทำให้เข้าใจผิดว่าพระสงฆ์เป็นโรคเมตาบอลิกพอๆ กับหรือมากกว่าคนทั่วไป ทั้งที่จริงอาจเป็นผลจากอายุที่มากกว่าเท่านั้น</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> ใช้อัตราป่วยของพระสงฆ์แยกตามช่วงอายุ (&lt;40, 40-59, 60+) คูณถ่วงน้ำหนักด้วยสัดส่วนประชากรชายไทยแต่ละช่วงอายุ (38.6%, 38.8%, 22.6%) แทนสัดส่วนอายุจริงของพระสงฆ์ แล้วเทียบกับอัตราคนทั่วไปจริง</div>
      <div class="row"><b>พบว่า:</b> หลังตัดผลอายุ อัตราของพระสงฆ์ลดลงทุกโรค (เพราะพระสงฆ์จริงๆ สูงวัยกว่า) และยังคงต่ำกว่าคนทั่วไปทั้ง 4 โรค — สนับสนุนว่าโรคเมตาบอลิกไม่ใช่ปัญหาที่พระสงฆ์แย่กว่าคนทั่วไปจริง</div>
    </div>
  </div>
</section>

<!-- ============ FULL TABLE ============ -->
<section id="table">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อมูลดิบ</p>
    <h2>ตารางเต็มทั้ง 30 โรค</h2>
    <p>เรียงตามอัตราส่วนจากมากไปน้อย คลิกหัวตารางเพื่อเรียงใหม่</p>
    <div class="divider"></div>
  </div>
  <div class="card fade-in" style="overflow-x:auto;">
    <table class="data-table" id="fullTable">
      <thead><tr>
        <th data-sort="name">โรค</th><th data-sort="group">กลุ่ม</th>
        <th data-sort="monk_pct" style="text-align:right;">พระสงฆ์ %</th>
        <th data-sort="gen_pct" style="text-align:right;">คนทั่วไป %</th>
        <th data-sort="ratio" style="text-align:right;">อัตราส่วน</th>
      </tr></thead>
      <tbody id="fullTableBody"></tbody>
    </table>
  </div>
</section>

<!-- ============ CAVEATS ============ -->
<section id="caveats">
  <div class="sec-head fade-in">
    <p class="eyebrow">อ่านก่อนเชื่อ</p>
    <h2>ข้อควรระวังในการตีความ</h2>
    <div class="divider"></div>
  </div>
  <div class="card fade-in">
    <ul style="font-size:.88rem; color:var(--ink-soft); line-height:2; padding-left:1.2rem; margin:0;">
      <li><b style="color:var(--maroon-800);">แหล่งข้อมูลคนทั่วไปครอบคลุมเฉพาะสิทธิบัตรทอง (UC)</b> ~70% ของประชากร ไม่รวมข้าราชการ/ประกันสังคม ตัวเลข "คนทั่วไป" จึงอาจคลาดเคลื่อนจากค่าจริงทั้งประเทศเล็กน้อย</li>
      <li><b style="color:var(--maroon-800);">วิธีนับต่างกัน</b> — ข้อมูลพระสงฆ์คือ "เคยได้รับวินิจฉัยหรือไม่" (สะสมตลอด) ส่วนข้อมูลคนทั่วไปคือ "มารับบริการปีนั้นด้วยโรคนี้" (รายปี) ซึ่งสำหรับโรคเรื้อรังที่ต้องพบแพทย์ประจำ ทั้งสองแบบมักใกล้เคียงกัน แต่อาจต่างกันมากสำหรับโรคเฉียบพลัน</li>
      <li><b style="color:var(--maroon-800);">โครงสร้างอายุต่างกันมาก</b> พระสงฆ์อายุ 60+ 36.1% แต่ชายทั่วไปอายุ 20+ มีแค่ 22.6% ที่เป็น 60+ — ทำให้ตัวเลขดิบของโรคที่สัมพันธ์กับอายุ (ต่อมลูกหมากโต COPD มะเร็งต่อมลูกหมาก) ดูสูงเกินจริง (ดูหัวข้อ "ตัดผลเรื่องอายุออก")</li>
      <li><b style="color:var(--maroon-800);">ตัวเลขซึมเศร้าที่ต่ำกว่าคนทั่วไป ไม่ควรตีความว่าพระสงฆ์มีสุขภาพจิตดีกว่าเสมอไป</b> อาจสะท้อนการเข้าถึง/การวินิจฉัยโรคจิตเวชในระบบสุขภาพของพระสงฆ์ที่น้อยกว่า (เช่น ความอาย ข้อจำกัดพระธรรมวินัยในการเข้าถึงจิตแพทย์) มากกว่าจะเป็นอัตราป่วยจริงที่ต่ำกว่า</li>
      <li><b style="color:var(--maroon-800);">วัณโรคและ HIV สูงกว่าคนทั่วไป</b> น่าจะสัมพันธ์กับการอยู่รวมกันเป็นชุมชนปิด (วัด) มากกว่าปัจจัยอายุ ควรพิจารณาคัดกรองเชิงรุกเฉพาะกลุ่ม</li>
    </ul>
  </div>
</section>

`;
  initCompare(container);
  mountYearTabs(container, {
    years: [2568], current: currentYear, compare: true,
    onChange: (y) => onYearChange(container, y)
  });
}

async function renderCompareYears(container) {
  container.innerHTML = `
<header class="hero"><div class="hero-inner">
  <p class="eyebrow" style="color:var(--saffron-500);">เทียบพระสงฆ์ กับ ชายไทยทั่วไป · เทียบรายปี</p>
  <h1>พระสงฆ์ขยับเข้าใกล้ หรือห่างจากคนทั่วไป<br><span>อัตราส่วน (พระสงฆ์ ÷ ชายไทยทั่วไป) เทียบ พ.ศ. ๒๕๖๗ ↔ ๒๕๖๘</span></h1>
</div></header>
<section id="cmp"><div class="route-loading">กำลังโหลดทั้งสองปี…</div></section>`;

  mountYearTabs(container, {
    years: [2568], current: 'compare', compare: true,
    onChange: (y) => onYearChange(container, y)
  });

  const [nw, od] = await Promise.all([
    loadPrevalence(PREV_STATIC, 2568),
    loadPrevalence(PREV_STATIC, 2567)
  ]);
  const cmp = container.querySelector('#cmp');
  if (nw.source !== 'd1' || od.source !== 'd1') {
    cmp.innerHTML = '<div class="card">โหมดเทียบปีต้องใช้ข้อมูลจากฐานข้อมูลออนไลน์</div>';
    return;
  }
  const N = nw.data.national, O = od.data.national;
  const CODES = Object.keys(COMP);
  const ratio = (monk, gen) => (monk != null && gen) ? +(monk / gen).toFixed(2) : null;

  renderYearCompare(cmp, {
    yearOld: 2567, yearNew: 2568,
    geos: [{ id: 'national|TH', label: 'ทั้งประเทศ' }], defaultGeo: 'national|TH',
    unit: 'x', deltaLabel: 'ต่างกัน (เท่า)',
    legendLow: 'พระสงฆ์ขยับเข้าใกล้คนทั่วไป', legendHigh: 'พระสงฆ์สูงกว่าคนทั่วไปมากขึ้น',
    intro: 'อัตราส่วน = % พระสงฆ์ ÷ % ชายไทยทั่วไป · มากกว่า 1 คือพระสงฆ์เป็นมากกว่า, น้อยกว่า 1 คือพระสงฆ์เป็นน้อยกว่า · ดูว่าปีต่อปี พระสงฆ์ขยับเข้าใกล้หรือห่างจากคนทั่วไป',
    getRows: () => CODES.map((c) => ({
      key: c,
      label: `${COMP[c].name} (${c})`,
      a: ratio(O[c], COMP[c].gen_pct),
      b: ratio(N[c], COMP[c].gen_pct)
    })),
    note: 'ตัวเลขฝั่งคนทั่วไปใช้ของ พ.ศ. ๒๕๖๘ เท่ากันทั้งสองปี ที่เปลี่ยนคือฝั่งพระสงฆ์อย่างเดียว (นับสะสม จึงมีแต่เพิ่ม ยกเว้นโรคที่หายได้ เช่น ไข้หวัด/ท้องเสีย)'
  });
  animateFadeIn(container);
}

function initCompare(container) {
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);

const GROUP_ORDER = ['เมตาบอลิก/หัวใจ','ไต/ทางเดินปัสสาวะ','ทางเดินหายใจ','มะเร็ง','จิตเวช/สารเสพติด','โรคติดต่อ','อื่นๆ'];
let currentFilter = 'ทั้งหมด';

function renderGroupFilter(){
  const el = document.getElementById('groupFilter');
  const groups = ['ทั้งหมด', ...GROUP_ORDER];
  el.innerHTML = groups.map(g=>`<button class="filter-chip${g===currentFilter?' active':''}" data-g="${g}">${g}</button>`).join('');
  el.querySelectorAll('.filter-chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{ currentFilter = btn.dataset.g; renderGroupFilter(); renderDivergeChart(); });
  });
}

function renderDivergeChart(){
  let items = Object.keys(COMP).map(code=>({code, ...COMP[code]}));
  if(currentFilter!=='ทั้งหมด') items = items.filter(i=>i.group===currentFilter);
  items.sort((a,b)=> b.ratio - a.ratio);
  const maxAbsLog = Math.max(...items.map(i=>Math.abs(Math.log2(i.ratio))), 0.1);
  const wrap = document.getElementById('divergeChart');
  wrap.innerHTML = '';
  items.forEach(item=>{
    const logR = Math.log2(item.ratio);
    const pctFromCenter = Math.min(48, Math.abs(logR)/maxAbsLog*48);
    const isMore = item.ratio > 1;
    const row = document.createElement('div');
    row.className = 'dv-row';
    row.innerHTML = `<div class="dv-name">${item.name} (${item.code})</div>
      <div class="dv-track"><div class="dv-center-line"></div><div class="dv-bar" data-w="${pctFromCenter}" data-more="${isMore}"></div></div>
      <div class="dv-val" style="color:${isMore?'var(--maroon-700)':'var(--sage)'};">${item.ratio}x</div>`;
    row.addEventListener('click', ()=>showDetail(item));
    wrap.appendChild(row);
  });
  requestAnimationFrame(()=>{
    document.querySelectorAll('.dv-bar').forEach(el=>{
      const w = parseFloat(el.dataset.w);
      const more = el.dataset.more === 'true';
      el.style.width = w + '%';
      el.style.background = more ? 'var(--maroon-700)' : 'var(--sage)';
      el.style.left = more ? '50%' : (50-w)+'%';
    });
  });
}

function showDetail(item){
  const panel = document.getElementById('detailPanel');
  panel.classList.add('show');
  const verdict = item.ratio>1.15 ? 'พระสงฆ์เป็นมากกว่าชัดเจน' : item.ratio<0.85 ? 'พระสงฆ์เป็นน้อยกว่าชัดเจน' : 'ใกล้เคียงคนทั่วไป';
  panel.innerHTML = `<h4>${item.name} (${item.code}) — ${item.group}</h4>
    <div class="detail-grid">
      <div class="detail-box"><div class="dn" style="color:var(--saffron-600);">${item.monk_pct}%</div><div class="dl">พระสงฆ์</div></div>
      <div class="detail-box"><div class="dn" style="color:var(--ink-soft);">${item.gen_pct}%</div><div class="dl">ชายไทยทั่วไป</div></div>
      <div class="detail-box"><div class="dn" style="color:${item.ratio>1?'var(--maroon-700)':'var(--sage)'};">${item.ratio}x</div><div class="dl">${verdict}</div></div>
    </div>`;
}

function renderAgeStdGrid(){
  const grid = document.getElementById('ageStdGrid');
  grid.innerHTML = Object.keys(AGESTD).map(code=>{
    const d = AGESTD[code];
    const name = COMP[code].name;
    return `<div class="asc-card">
      <h5>${name} (${code})</h5>
      <div class="asc-row"><span>พระสงฆ์ (ดิบ)</span><b>${d.raw}%</b></div>
      <div class="asc-row"><span>พระสงฆ์ (ตัดผลอายุแล้ว)</span><b style="color:var(--sage);">${d.std}%</b></div>
      <div class="asc-row"><span>ชายไทยทั่วไป</span><b>${d.gen}%</b></div>
    </div>`;
  }).join('');
}

let sortKey = 'ratio', sortDir = -1;
function renderFullTable(){
  let items = Object.keys(COMP).map(code=>({code, ...COMP[code]}));
  items.sort((a,b)=>{
    let av=a[sortKey], bv=b[sortKey];
    if(typeof av==='string') return sortDir*av.localeCompare(bv);
    return sortDir*(av-bv);
  });
  const tbody = document.getElementById('fullTableBody');
  tbody.innerHTML = items.map(item=>`<tr>
    <td>${item.name} <span style="color:var(--sage); font-size:.7rem;">(${item.code})</span></td>
    <td style="font-size:.72rem; color:var(--ink-soft);">${item.group}</td>
    <td class="num" style="color:var(--saffron-600);">${item.monk_pct}%</td>
    <td class="num" style="color:var(--ink-soft);">${item.gen_pct}%</td>
    <td class="num" style="color:${item.ratio>1?'var(--maroon-700)':'var(--sage)'};">${item.ratio}x</td>
  </tr>`).join('');
}
document.querySelectorAll('#fullTable th[data-sort]').forEach(th=>{
  th.style.cursor='pointer';
  th.addEventListener('click', ()=>{
    const key = th.dataset.sort;
    if(sortKey===key) sortDir *= -1; else { sortKey=key; sortDir=-1; }
    renderFullTable();
  });
});

function mount(){
  try{
    renderGroupFilter();
    renderDivergeChart();
    renderAgeStdGrid();
    renderFullTable();

    const fadeEls = document.querySelectorAll('.fade-in');
    const fadeObs = trackObserver(new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); fadeObs.unobserve(e.target); } });
    }, {threshold:.1}));
    fadeEls.forEach(el=>fadeObs.observe(el));
  } catch(err){ console.error('init error', err); }
}
mount();

}
