/* Section: source/เจาะลึกข้อมูลสุขภาพพระสงฆ์_รอบ1.html */

import {
  animateFadeIn, animateBars, animateGapBars, animateCounters, animateGrpBars,
  trackObserver, teardownAnimations
} from './utils.js';
import {
  NATIONAL_MULTI as S_NATIONAL_MULTI,
  REGION_SUMMARY as S_REGION_SUMMARY,
  REGION_PROVINCES as S_REGION_PROVINCES
} from './data/data-cluster.js';
import { loadCluster } from './api.js';
import { mountYearTabs } from './year-tabs.js';
import { renderYearCompare } from './year-compare.js';
import { DISEASE_NAMES } from './constants.js';

// เขียนทับด้วยข้อมูล D1 ใน render() ถ้าใช้ได้ — helper ทั้งหมดอ้าง identifier เปล่า
let NATIONAL_MULTI = S_NATIONAL_MULTI;
let REGION_SUMMARY = S_REGION_SUMMARY;
let REGION_PROVINCES = S_REGION_PROVINCES;
const YEARS = [2568, 2567];
let currentYear = 2568; // ปีล่าสุดเป็นค่าเริ่มต้น

const CL_CODES = ['I10', 'E78', 'E11', 'N18', 'M10', 'J44'];
const clLabel = (k) =>
  k[0] === 'p' && k[1] === 'm' ? `ป่วยร่วม ≥${k.slice(2)} โรค`
    : `${DISEASE_NAMES[k] || k} (${k})`;

function onYearChange(container, y) { currentYear = y; teardownAnimations(); render(container); }

export async function render(container) {
  if (currentYear === 'compare') return renderCompareView(container);
  container.innerHTML = `

<header class="hero">
  <div class="hero-inner">
    <p class="eyebrow" style="color:var(--saffron-500);">Round 1 · Clustering + Spatial Analysis</p>
    <h1>เจาะลึกข้อมูลสุขภาพพระสงฆ์:<br><span>โปรไฟล์กลุ่มโรค และรูปแบบเชิงพื้นที่</span></h1>
    <p>วิเคราะห์ต่อยอดจากฐานข้อมูล HISO 2568 (237,725 รูปทั่วประเทศ) ด้วยเทคนิค clustering และการ cross ข้อมูลเชิงพื้นที่ เพื่อหาว่า "ใคร ที่ไหน" ควรได้รับการดูแลก่อน ไม่ใช่แค่ "มีปัญหาอะไรบ้าง"</p>
    <div class="badge-row">
      <span class="badge">จัดกลุ่มด้วยคอมพิวเตอร์</span>
      <span class="badge">Province Profiling</span>
      <span class="badge">Pareto Analysis</span>
      <span class="badge">Migration Pattern</span>
      <span class="badge">Urban vs Rural</span>
    </div>
  </div>
</header>

<!-- ============ INTRO ============ -->
<section id="intro">
  <div class="sec-head fade-in">
    <p class="eyebrow">วิธีการวิเคราะห์</p>
    <h2>ทำไมต้องดูข้อมูลแบบ Cross และ Cluster</h2>
    <p>ตัวเลขความชุกรายโรคเดี่ยวๆ (เช่น "17.2% ความดันสูง") บอกแค่ว่า "มีปัญหา" แต่ไม่บอกว่า "ปัญหาไปด้วยกันเป็นกลุ่มแบบไหน" และ "กระจุกอยู่ที่ไหน" — การวิเคราะห์รอบนี้จึงเน้น 2 มุมมองที่ต่อยอดจากข้อมูลเดิม</p>
    <div class="divider"></div>
  </div>
  <div class="two-col fade-in">
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.5rem;">มุมที่ 1: Clustering (จัดกลุ่มคน/วัด/จังหวัด)</h4>
      <p style="font-size:.86rem; color:var(--ink-soft); margin:0;">ให้คอมพิวเตอร์ลองจับพระสงฆ์ที่ป่วยเป็นโรคคล้ายๆ กันมารวมกลุ่มกันเอง (เหมือนแยกลูกอมที่มีรสคล้ายกันไว้ถุงเดียวกัน โดยไม่บอกล่วงหน้าว่าต้องแยกเป็นกี่ถุง) — ช่วยตอบว่าพระสงฆ์กลุ่มไหนมีรูปแบบโรคร่วมแบบไหน</p>
    </div>
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.5rem;">️ มุมที่ 2: มิติพื้นที่ (Spatial cross-tab)</h4>
      <p style="font-size:.86rem; color:var(--ink-soft); margin:0;">Cross ตัวแปรจังหวัด/วัดกับชนิดโรค เพื่อหาว่าภาระโรคกระจุกตัวหรือกระจายตัว และมีรูปแบบภูมิภาคที่ชัดเจนหรือไม่ — ใช้ตัดสินใจว่าควรทำนโยบายระดับชาติแบบเดียว หรือแยกตามภูมิภาค</p>
    </div>
  </div>
</section>

<!-- ============ CLUSTERS ============ -->
<section id="clusters">
  <div class="sec-head fade-in">
    <p class="eyebrow">มุมที่ 1 · ข้อ 5</p>
    <h2>5 โปรไฟล์สุขภาพที่พบจากข้อมูลจริง</h2>
    <p>ให้คอมพิวเตอร์ลองจัดกลุ่มพระสงฆ์ที่มีอย่างน้อย 1 โรค (68,252 รูป) ตามรูปแบบการป่วยจาก 17 กลุ่มโรคสำคัญ พบว่าแบ่งได้เป็น 5 กลุ่มที่ชัดเจน</p>
    <div class="divider"></div>
  </div>

  <div class="info-callout fade-in">
    <div class="ic">ℹ</div>
    <p>แต่ละ "คลัสเตอร์" คือกลุ่มพระสงฆ์ที่มีรูปแบบการเป็นโรคคล้ายกัน คำนวณจากแฟล็กโรค 17 ชนิด (ไม่ได้กำหนดเกณฑ์ล่วงหน้า) ตัวเลขในวงเล็บคือ % ของกลุ่มนั้นที่เป็นโรคนั้นๆ — เห็นได้ชัดว่าความดันสูงกับไขมันในเลือดสูงมักมาคู่กันเสมอ (สหสัมพันธ์ 0.61 สูงสุดในบรรดาคู่โรคทั้งหมด)</p>
  </div>

  <div class="cluster-grid fade-in">
    <div class="cl-card">
      <div class="pct">28.2%</div>
      <div class="lbl">กลุ่มความดัน+ไขมันร่วม</div>
      <div class="age">อายุเฉลี่ย 62.8 ปี</div>
      <ul><li>ความดันสูง 100%</li><li>ไขมันสูง 100%</li><li>เบาหวานร่วม 46%</li></ul>
    </div>
    <div class="cl-card low">
      <div class="pct">29.6%</div>
      <div class="lbl">กลุ่มโรคอื่น/อายุน้อย</div>
      <div class="age">อายุเฉลี่ย 53.5 ปี (อ่อนสุด)</div>
      <ul><li>HIV 8.9% (สูงสุดในทุกกลุ่ม)</li><li>สุรา/สารเสพติด 3.9%</li><li>วัณโรค 3.4%</li></ul>
    </div>
    <div class="cl-card high">
      <div class="pct">11.5%</div>
      <div class="lbl">กลุ่มไตวาย+เมตาบอลิกรวม</div>
      <div class="age">อายุเฉลี่ย 68.4 ปี (สูงสุด)</div>
      <ul><li>ไตวายเรื้อรัง 100%</li><li>ความดันสูง 93%</li><li>เก๊าท์ 19% · หัวใจล้มเหลว 11%</li></ul>
    </div>
    <div class="cl-card">
      <div class="pct">14.0%</div>
      <div class="lbl">กลุ่มไขมันสูงเดี่ยว</div>
      <div class="age">อายุเฉลี่ย 56.6 ปี</div>
      <ul><li>ไขมันสูง 100% (โรคเดียว)</li><li>เบาหวานร่วม 29%</li></ul>
    </div>
    <div class="cl-card">
      <div class="pct">16.7%</div>
      <div class="lbl">กลุ่มความดันสูงเดี่ยว</div>
      <div class="age">อายุเฉลี่ย 62.5 ปี</div>
      <ul><li>ความดันสูง 100% (โรคเดียว)</li><li>เบาหวานร่วม 29%</li></ul>
    </div>
  </div>

  <div class="card fade-in" style="margin-top:1.6rem;">
    <h4 style="color:var(--maroon-800); margin-bottom:.6rem;">สหสัมพันธ์ระหว่างคู่โรค (ที่มาของคลัสเตอร์)</h4>
    <div class="note">ค่ายิ่งสูง (เข้าใกล้ 1.0) ยิ่งมักเป็นร่วมกัน — ใช้ยืนยันว่าทำไมคลัสเตอร์ถึงจับกลุ่มแบบนี้</div>
    <div class="bar-row"><div class="lbl"><span>ความดันสูง ↔ ไขมันสูง</span><span>0.61</span></div><div class="bar-track"><div class="bar-fill" data-w="61"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>ความดันสูง ↔ เบาหวาน</span><span>0.49</span></div><div class="bar-track"><div class="bar-fill" data-w="49"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>ไขมันสูง ↔ เบาหวาน</span><span>0.48</span></div><div class="bar-track"><div class="bar-fill" data-w="48"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>ความดันสูง ↔ ไตวายเรื้อรัง</span><span>0.35</span></div><div class="bar-track"><div class="bar-fill" data-w="35"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>หัวใจขาดเลือด ↔ หัวใจล้มเหลว</span><span>0.26</span></div><div class="bar-track"><div class="bar-fill" data-w="26"></div></div></div>
    <p style="font-size:.78rem; color:var(--sage); margin-top:.8rem; margin-bottom:0;"><b style="color:var(--maroon-800);">นัยเชิงนโยบาย:</b> กลุ่ม "อายุน้อย/โรคอื่น" (29.6%) มีสัดส่วนวัณโรค/HIV/สารเสพติดสูงกว่ากลุ่มอื่นชัดเจน — ต่างจากกลุ่มสูงอายุที่เป็นโรคเมตาบอลิกล้วน จึงต้องมี 2 ชุดโปรแกรมดูแลที่ต่างกันโดยสิ้นเชิง ไม่ใช่ชุดเดียวสำหรับทุกวัย</p>
    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> โรคของพระสงฆ์ไม่น่าจะเกิดแบบสุ่มๆ แต่น่าจะมีบางโรคที่มักมาด้วยกันเป็นชุด (เช่น คนอ้วนมักความดันสูงและไขมันสูงพร้อมกัน)</div>
      <div class="row"><b>ทำยังไง:</b> ให้คอมพิวเตอร์ลองจัดกลุ่มพระที่ป่วย 68,252 รูปตามรูปแบบโรค (แบบเดียวกับด้านบน) และดูว่าโรคคู่ไหนมักเป็นพร้อมกันบ่อยที่สุดจากข้อมูลทั้งหมด 220,296 รูป</div>
      <div class="row"><b>ได้คำตอบว่า:</b> เกิดขึ้นจริง 5 กลุ่มตามที่คาด และ "ความดันสูงกับไขมันสูง" เป็นคู่ที่มาด้วยกันบ่อยที่สุด (ถ้าเป็นโรคหนึ่ง มีโอกาสสูงที่จะเป็นอีกโรคด้วย) จึงเป็นเหตุผลที่คอมพิวเตอร์จัดสองโรคนี้ไว้กลุ่มเดียวกันเสมอ</div>
    </div>
  </div>
</section>

<!-- ============ TEMPLES ============ -->
<section id="temples">
  <div class="sec-head fade-in">
    <p class="eyebrow">มุมที่ 2 · ข้อ 6</p>
    <h2>เป้าหมายระดับวัด: วัดไหนควรได้รับการดูแลก่อน</h2>
    <p>จัดอันดับวัดที่มีพระสงฆ์อย่างน้อย 30 รูป (เพื่อตัดวัดขนาดเล็กที่ตัวเลขแกว่งง่าย) ตามสัดส่วนป่วยร่วมหลายโรค</p>
    <div class="divider"></div>
  </div>
  <div class="info-callout fade-in">
    <div class="ic">ℹ</div>
    <p>จากวัดทั้งหมด 27,782 แห่งในฐานข้อมูล มีเพียง <b>993 แห่ง</b> ที่มีพระสงฆ์ ≥30 รูป (มากพอให้ตัวเลขทางสถิติน่าเชื่อถือ) — ตารางนี้แสดง 10 วัดที่มีสัดส่วนป่วยร่วม ≥2 โรคสูงที่สุด เทียบกับค่าเฉลี่ยประเทศ 20.4%</p>
  </div>
  <div class="card fade-in">
    <table class="data-table">
      <thead><tr><th>วัด (ปกปิดชื่อจริงบางส่วน)</th><th style="text-align:right;">จำนวนพระ</th><th style="text-align:right;">% ป่วยร่วม ≥2 โรค</th><th style="text-align:right;">อายุเฉลี่ย</th></tr></thead>
      <tbody>
        <tr class="highlight"><td>ประทุมคณาวาส</td><td class="num">33</td><td class="num">51.5%</td><td class="num">58.0</td></tr>
        <tr><td>มงคลวราราม</td><td class="num">33</td><td class="num">45.5%</td><td class="num">57.0</td></tr>
        <tr><td>ไตรสามัคคี</td><td class="num">41</td><td class="num">43.9%</td><td class="num">50.1</td></tr>
        <tr><td>เชิงท่า</td><td class="num">32</td><td class="num">43.8%</td><td class="num">53.5</td></tr>
        <tr><td>ลาดปลาดุก</td><td class="num">37</td><td class="num">43.2%</td><td class="num">61.2</td></tr>
        <tr><td>ไทรย้อย</td><td class="num">37</td><td class="num">43.2%</td><td class="num">57.0</td></tr>
        <tr><td>บ้านดง</td><td class="num">50</td><td class="num">42.0%</td><td class="num">55.2</td></tr>
        <tr><td>สนามไชย</td><td class="num">60</td><td class="num">41.7%</td><td class="num">60.2</td></tr>
        <tr><td>ครุใน</td><td class="num">47</td><td class="num">40.4%</td><td class="num">62.0</td></tr>
        <tr><td>ทรัพย์เจริญ</td><td class="num">30</td><td class="num">40.0%</td><td class="num">60.1</td></tr>
      </tbody>
    </table>
    <p style="font-size:.78rem; color:var(--sage); margin-top:.9rem; margin-bottom:0;"><b style="color:var(--maroon-800);">นัยเชิงนโยบาย:</b> วัดอันดับต้นมีสัดส่วนป่วยร่วมสูงกว่าค่าเฉลี่ยประเทศถึง <b style="color:var(--maroon-800);">2.5 เท่า</b> (51.5% เทียบ 20.4%) — วิธีนี้ใช้สร้าง "บัญชีรายชื่อวัดเป้าหมาย" ระดับปฏิบัติการจริงสำหรับส่งพระคิลานุปัฏฐากหรือทีมสหวิชาชีพลงพื้นที่ก่อน แทนการกระจายทรัพยากรเท่ากันทุกวัด</p>
    <div class="method-note">
      <div class="row"><b>สมมติฐาน:</b> ภาระโรคน่าจะกระจุกตัวในบางวัดมากกว่าวัดอื่น ไม่ได้กระจายเท่ากันทุกวัด</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> จัดอันดับเฉพาะวัดที่มีพระ ≥30 รูป (993 จาก 27,782 แห่ง เพื่อตัดวัดขนาดเล็กที่ตัวเลขแกว่งง่าย) ตาม % ป่วยร่วม ≥2 โรค</div>
      <div class="row"><b>พบว่า:</b> วัดอันดับ 1 (51.5%) สูงกว่าค่าเฉลี่ยประเทศ 2.5 เท่า ยืนยันว่าควรจัดสรรทรัพยากรตามลำดับความเสี่ยงจริงเป็นรายวัด ไม่ใช่แบ่งเท่ากันทุกที่</div>
    </div>
  </div>
</section>

<!-- ============ PROVINCE CLUSTERS ============ -->
<section id="provinces">
  <div class="sec-head fade-in">
    <p class="eyebrow">มุมที่ 2 · ข้อ 7, 9, 10</p>
    <h2>สำรวจรายเขตสุขภาพ — แตะเพื่อดูรายจังหวัดในเขต</h2>
    <p>จับคู่ 77 จังหวัดเข้ากับ 12 เขตสุขภาพ + กรุงเทพมหานคร ตามเกณฑ์กระทรวงสาธารณสุข แล้วดูรายละเอียดถึงระดับจังหวัดในแต่ละเขตได้</p>
    <div class="divider"></div>
  </div>

  <div class="card fade-in">
    <div class="region-grid" id="regionGrid"></div>

    <div class="region-detail" id="regionDetail">
      <div class="rd-head">
        <h4 id="rdTitle">เขตสุขภาพที่ 1 (เหนือบน)</h4>
        <div class="rd-n" id="rdN"></div>
      </div>
      <div class="metric-chip-row" id="metricChips">
        <button class="metric-chip active" data-metric="I10">ความดันโลหิตสูง</button>
        <button class="metric-chip" data-metric="E78">ไขมันในเลือดสูง</button>
        <button class="metric-chip" data-metric="E11">เบาหวาน</button>
        <button class="metric-chip" data-metric="pct_multi">ป่วยร่วม ≥2 โรค</button>
      </div>
      <div class="prov-bar-list" id="provBarList"></div>
    </div>

    <div style="margin-top:2rem; padding-top:1.8rem; border-top:1px dashed var(--parchment-deep);">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">มองทีเดียวจบ: จังหวัดไหน "เสี่ยงเยอะ" และ "มีคนเยอะ" พร้อมกัน</h4>

      <div class="info-callout" style="margin-bottom:1.2rem;">
        <div class="ic"></div>
        <p>
          <b>วิธีคิด "ป่วยร่วม":</b> ในข้อมูลนี้มีการบันทึกโรค 30 ชนิด (ความดัน เบาหวาน ไขมัน ไต หัวใจ มะเร็ง จิตเวช วัณโรค ฯลฯ) ต่อพระสงฆ์ 1 รูป — เรานับว่าคนๆ นั้นถูกวินิจฉัยกี่โรคจาก 30 ชนิดนี้ (มีได้ตั้งแต่ 0 ถึง 30 โรค) แล้วเลือก "เกณฑ์" ว่าต้องเป็นกี่โรคขึ้นไปถึงจะนับว่า "ป่วยร่วม" — <b>ลองกดปุ่มด้านล่างเพื่อเปลี่ยนเกณฑ์และดูกราฟที่เปลี่ยนไปได้เลย</b>
        </p>
      </div>

      <div class="metric-chip-row" id="multiThresholdChips" style="justify-content:center;">
        <button class="metric-chip active" data-k="2">ป่วยร่วม ≥ 2 โรค</button>
        <button class="metric-chip" data-k="3">ป่วยร่วม ≥ 3 โรค</button>
        <button class="metric-chip" data-k="4">ป่วยร่วม ≥ 4 โรค</button>
        <button class="metric-chip" data-k="5">ป่วยร่วม ≥ 5 โรค</button>
      </div>

      <div class="simple-tip" id="quadTip">แต่ละจุด = 1 จังหวัด (77 จุด) &nbsp;·&nbsp; ยิ่งอยู่ขวา ยิ่งเสี่ยงเยอะ &nbsp;·&nbsp; ยิ่งอยู่สูง ยิ่งมีพระสงฆ์เยอะ &nbsp;·&nbsp; วางเมาส์บนจุดเพื่อดูชื่อจังหวัด</div>
      <div class="quadrant-wrap" id="quadrantWrap"></div>
      <div class="quad-summary" id="quadSummary"></div>
    </div>

    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> น่าจะมีบางเขตที่พระสงฆ์ป่วยเยอะกว่าเขตอื่น เพราะแต่ละที่กินอยู่ อากาศ และหมอที่มีไม่เหมือนกัน</div>
      <div class="row"><b>ทำยังไง:</b> เอาจังหวัดทั้ง 77 จังหวัดไปแบ่งเป็น 12 เขต+กทม.ตามที่กระทรวงสาธารณสุขใช้จริง แล้วนับดูว่าแต่ละเขตมีคนป่วยกี่เปอร์เซ็นต์ (นับจากทั้ง 30 โรคเหมือนกราฟด้านบน)</div>
      <div class="row"><b>ได้คำตอบว่า:</b> เขต 2 (พิษณุโลก สุโขทัย ตาก) กับเขต 3 (นครสวรรค์) ป่วยเยอะสุดในประเทศ (ราว 1 ใน 4 ของพระที่นั่นป่วยหลายโรคพร้อมกัน) ส่วนเขต 1 (เชียงใหม่ ตอนบน) ป่วยน้อยที่สุด — ทั้งที่อยู่ภาคเหนือเหมือนกัน แปลว่าดูแค่ "ภาคเหนือ ภาคใต้" กว้างๆ ไม่พอ ต้องดูเป็นเขตย่อยถึงจะแม่น</div>
    </div>
  </div>
</section>






<!-- ============ HOTSPOTS: TB/HIV + Migration ============ -->
<section id="hotspots">
  <div class="sec-head fade-in">
    <p class="eyebrow">มุมที่ 2 · ข้อ 11, 12</p>
    <h2>Hotspot พิเศษ: วัณโรค / HIV และการย้ายถิ่นของพระสงฆ์</h2>
    <p>โรคติดต่อในพระสงฆ์มีนัยพิเศษเพราะอยู่รวมกันเป็นชุมชนปิด ความชุกสูงผิดปกติในบางจังหวัดจึงควรได้รับการคัดกรองเชิงรุกก่อน</p>
    <div class="divider"></div>
  </div>
  <div class="two-col fade-in">
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">วัณโรค (TB) — จังหวัดความชุกสูงสุด</h4>
      <div class="note">ค่าเฉลี่ยประเทศ 0.53% · เฉพาะจังหวัดที่มีพระ ≥200 รูป</div>
      <div class="bar-row"><div class="lbl"><span>สตูล</span><span>0.91%</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>ปัตตานี</span><span>0.91%</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>อ่างทอง</span><span>0.84%</span></div><div class="bar-track"><div class="bar-fill" data-w="92"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>สระบุรี</span><span>0.79%</span></div><div class="bar-track"><div class="bar-fill" data-w="87"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>อุดรธานี</span><span>0.78%</span></div><div class="bar-track"><div class="bar-fill" data-w="86"></div></div></div>
    </div>
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">HIV — จังหวัดความชุกสูงสุด</h4>
      <div class="note">ค่าเฉลี่ยประเทศ 1.33% · เฉพาะจังหวัดที่มีพระ ≥200 รูป</div>
      <div class="bar-row"><div class="lbl"><span>สตูล</span><span>2.42%</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>นครศรีธรรมราช</span><span>2.40%</span></div><div class="bar-track"><div class="bar-fill" data-w="99"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>ระนอง</span><span>2.13%</span></div><div class="bar-track"><div class="bar-fill" data-w="88"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>ระยอง</span><span>2.06%</span></div><div class="bar-track"><div class="bar-fill" data-w="85"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>พัทลุง</span><span>2.06%</span></div><div class="bar-track"><div class="bar-fill" data-w="85"></div></div></div>
    </div>
  </div>
  <p class="fade-in" style="font-size:.8rem; color:var(--sage); margin-top:1rem;"><b style="color:var(--maroon-800);">สังเกต:</b> ทั้ง TB และ HIV กระจุกตัวในจังหวัดภาคใต้ตอนล่างเป็นหลัก (สตูล ปัตตานี นครศรีธรรมราช ระนอง พัทลุง) สอดคล้องกับข้อมูลระบาดวิทยาโรคติดต่อของประชากรทั่วไปในพื้นที่เดียวกัน — ควรเชื่อมโปรแกรมคัดกรองกับหน่วยงานสาธารณสุขจังหวัดที่มีระบบเฝ้าระวังอยู่แล้ว</p>
  <div class="method-note fade-in">
    <div class="row"><b>สมมติฐาน:</b> วัณโรค/HIV อาจกระจุกในบางจังหวัดตามรูปแบบระบาดวิทยาทั่วไปของประเทศ เพราะพระสงฆ์อยู่รวมกันเป็นชุมชนปิด ความเสี่ยงแพร่กระจายในหมู่คณะจึงสำคัญ</div>
    <div class="row"><b>วิธีวิเคราะห์:</b> เทียบอัตราความชุกรายจังหวัด (เฉพาะจังหวัดที่มีพระ ≥200 รูป) กับค่าเฉลี่ยประเทศ (TB 0.53%, HIV 1.33%)</div>
    <div class="row"><b>พบว่า:</b> จังหวัดภาคใต้ตอนล่างสูงกว่าค่าเฉลี่ยเกือบ 2 เท่าทั้งสองโรค ตรงกับพื้นที่ระบาดวิทยาที่ทราบอยู่แล้วในประชากรทั่วไป</div>
  </div>

  <div class="card fade-in" style="margin-top:1.6rem;">
    <h4 style="color:var(--maroon-800); margin-bottom:.6rem;">การย้ายถิ่นของพระสงฆ์ — จังหวัดปลายทางยอดนิยม</h4>
    <div class="note">พระสงฆ์ที่วัดปัจจุบัน (affiliation) ต่างจากวัดต้นสังกัด (regula) ~1.2% ของทั้งหมด — นับเฉพาะที่ทราบทั้งสองค่า</div>
    <table class="data-table">
      <thead><tr><th>จังหวัดปลายทาง</th><th style="text-align:right;">จำนวนพระที่ย้ายเข้า</th></tr></thead>
      <tbody>
        <tr><td>อุดรธานี</td><td class="num">90</td></tr>
        <tr><td>นครราชสีมา</td><td class="num">90</td></tr>
        <tr><td>บุรีรัมย์</td><td class="num">82</td></tr>
        <tr><td>สุรินทร์</td><td class="num">76</td></tr>
        <tr><td>กรุงเทพมหานคร</td><td class="num">71</td></tr>
        <tr><td>อุบลราชธานี</td><td class="num">64</td></tr>
      </tbody>
    </table>
    <p style="font-size:.78rem; color:var(--sage); margin-top:.8rem; margin-bottom:0;"><b style="color:var(--maroon-800);">นัยเชิงนโยบาย:</b> ปลายทางย้ายเข้าส่วนใหญ่คือจังหวัดใหญ่ภาคอีสาน — ระบบสิทธิสุขภาพและเวชระเบียนต้องรองรับการย้ายวัดได้แบบไร้รอยต่อ ไม่ผูกกับวัดต้นสังกัดเดิม</p>
    <div class="method-note">
      <div class="row"><b>สมมติฐาน:</b> พระสงฆ์ที่ย้ายวัดน่าจะกระจุกไปยังบางจังหวัดปลายทาง ไม่ใช่กระจายแบบสุ่ม</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> เทียบวัดต้นสังกัด (regula) กับวัดที่พำนักปัจจุบัน (affiliation) นับเฉพาะกรณีที่จังหวัดต่างกัน (~1.2% ของทั้งหมด)</div>
      <div class="row"><b>พบว่า:</b> ปลายทางหลักคือจังหวัดใหญ่ภาคอีสาน (อุดรธานี นครราชสีมา บุรีรัมย์ สุรินทร์) และ กทม.</div>
    </div>
  </div>
</section>

<!-- ============ URBAN VS RURAL ============ -->
<section id="urban">
  <div class="sec-head fade-in">
    <p class="eyebrow">มุมที่ 2 · ข้อ 13</p>
    <h2>กรุงเทพฯ vs ต่างจังหวัด: รูปแบบโรคกลับด้านกันอย่างน่าสนใจ</h2>
    <p>เทียบพระสงฆ์ในกรุงเทพมหานคร (8,087 รูป) กับพระสงฆ์ในต่างจังหวัดทั้งหมด อายุเฉลี่ยใกล้เคียงกัน (51.8 vs 51.4 ปี) จึงไม่ใช่ปัจจัยอายุที่ทำให้ต่างกัน</p>
    <div class="divider"></div>
  </div>
  <div class="card fade-in">
    <div class="bar-row"><div class="lbl"><span>ความดันโลหิตสูง — กทม.</span><span>16.25%</span></div><div class="bar-track"><div class="bar-fill" data-w="65"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>ความดันโลหิตสูง — ต่างจังหวัด</span><span>17.27%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="69"></div></div></div>
    <div style="height:.5rem;"></div>
    <div class="bar-row"><div class="lbl"><span>ไขมันในเลือดสูง — กทม.</span><span>18.25%</span></div><div class="bar-track"><div class="bar-fill" data-w="73"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>ไขมันในเลือดสูง — ต่างจังหวัด</span><span>15.41%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="62"></div></div></div>
    <div style="height:.5rem;"></div>
    <div class="bar-row"><div class="lbl"><span>ปอดอุดกั้นเรื้อรัง (COPD) — กทม.</span><span>0.93%</span></div><div class="bar-track"><div class="bar-fill" data-w="9"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>ปอดอุดกั้นเรื้อรัง (COPD) — ต่างจังหวัด</span><span>2.27%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="23"></div></div></div>

    <p style="font-size:.82rem; color:var(--ink-soft); margin-top:1.2rem; margin-bottom:0;">
      <b style="color:var(--maroon-800);">นัยเชิงนโยบาย:</b> กทม. มีความดันสูงต่ำกว่าแต่ไขมัน/เบาหวานสูงกว่า สะท้อนรูปแบบ "โรคจากอาหาร/วิถีชีวิตเมือง" ขณะที่ต่างจังหวัดมี COPD สูงกว่าเกือบ 2.5 เท่า สอดคล้องกับการสัมผัสฝุ่นควัน/การเผาไหม้ในชนบทมากกว่า — แปลว่าโปรแกรม "อาหารบิณฑบาตสุขภาพ" ควรเข้มข้นเรื่องไขมัน/น้ำตาลในเขตเมือง และโปรแกรมคุณภาพอากาศ/เลิกบุหรี่ควรเข้มข้นในต่างจังหวัด
    </p>
    <div class="method-note">
      <div class="row"><b>สมมติฐาน:</b> กทม. กับต่างจังหวัดน่าจะมีรูปแบบโรคต่างกันจากวิถีชีวิต ไม่ใช่จากอายุที่ต่างกัน</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> เทียบอัตราความชุกและอายุเฉลี่ยของพระในกรุงเทพมหานคร (8,087 รูป) กับพระในต่างจังหวัดทั้งหมด</div>
      <div class="row"><b>พบว่า:</b> อายุเฉลี่ยใกล้กันมาก (51.8 vs 51.4 ปี) จึงตัดปัจจัยอายุออกได้ แต่รูปแบบโรคกลับด้านกันชัดเจนตามที่สรุปข้างต้น</div>
    </div>
  </div>
</section>

<!-- ============ POLICY SUMMARY ============ -->
<section id="policy">
  <div class="sec-head fade-in">
    <p class="eyebrow">สรุปผล</p>
    <h2>ทางเลือกเชิงนโยบายจากการวิเคราะห์รอบที่ 1</h2>
    <p>ประเด็นสำคัญที่พบและข้อเสนอเชิงปฏิบัติ เชื่อมกับแผนขับเคลื่อน 5 แผนของธรรมนูญสุขภาพพระสงฆ์ฯ</p>
    <div class="divider"></div>
  </div>
  <div class="card fade-in">
    <ul class="impl-list">
      <li><b>แบ่งกลุ่มเป้าหมายตามอายุ ไม่ใช่แบบเดียวสำหรับทุกวัย</b> — กลุ่มอายุน้อย (~30%) ต้องการโปรแกรมด้านสุขภาพจิต/สารเสพติด/โรคติดต่อ ต่างจากกลุ่มสูงอายุที่เป็นโรคเมตาบอลิก (แผนที่ 1, 3)</li>
      <li><b>ทำบัญชีวัดเป้าหมาย 993 แห่งที่มีข้อมูลเพียงพอ</b> จัดลำดับตาม %ป่วยร่วม ส่งพระคิลานุปัฏฐาก/ทีมสหวิชาชีพลงพื้นที่ตามลำดับความรุนแรงจริง แทนการกระจายเท่ากันทุกวัด (แผนที่ 2, 3)</li>
      <li><b>ออกแบบนโยบาย 4 ชุดตามกลุ่มภูมิภาค</b> — ภาคกลาง/ใต้เน้นเมตาบอลิก, อีสานเน้นระดับกลาง, เหนือ/กทม.ยังคุมได้ดี — ใช้ทรัพยากรตามสัดส่วนความเสี่ยงจริงของแต่ละภาค (แผนที่ 5)</li>
      <li><b>คัดกรอง TB/HIV เชิงรุกในจังหวัดภาคใต้ตอนล่าง</b> ที่ความชุกสูงกว่าค่าเฉลี่ยประเทศเกือบ 2 เท่า เชื่อมกับระบบเฝ้าระวังโรคติดต่อของสาธารณสุขจังหวัด (แผนที่ 3)</li>
      <li><b>ออกแบบระบบสิทธิสุขภาพให้ไม่ผูกกับวัดต้นสังกัด</b> รองรับพระสงฆ์ที่ย้ายวัดเข้าภาคอีสาน/กทม.เป็นหลัก ให้เข้าถึงบริการต่อเนื่องไร้รอยต่อ (แผนที่ 5)</li>
      <li><b>ปรับเนื้อหารณรงค์อาหาร/สิ่งแวดล้อมตามพื้นที่</b> — เข้มเรื่องไขมัน/น้ำตาลในเขตเมือง เข้มเรื่องคุณภาพอากาศ/บุหรี่ในชนบท (แผนที่ 1, 2)</li>
    </ul>
  </div>
  <div class="info-callout fade-in" style="margin-top:1.6rem;">
    <div class="ic">→</div>
    <p>การวิเคราะห์นี้เป็น <b>รอบที่ 1 จาก 3</b> ตามแผนที่วางไว้ (Clustering + มิติพื้นที่) รอบถัดไปจะเจาะลึก Cross-tab เชิงประชากร×โรค (อายุขณะบวช, สถานะ, กลุ่มโรคจิตเวช) และมิติเวลา/cohort พร้อม Priority Score ระดับจังหวัดสำหรับใช้งานจริง</p>
  </div>
</section>

`;
  const { data, source } = await loadCluster({
    NATIONAL_MULTI: S_NATIONAL_MULTI, REGION_SUMMARY: S_REGION_SUMMARY, REGION_PROVINCES: S_REGION_PROVINCES
  }, currentYear);
  NATIONAL_MULTI = data.NATIONAL_MULTI;
  REGION_SUMMARY = data.REGION_SUMMARY;
  REGION_PROVINCES = data.REGION_PROVINCES;
  initCluster(container, source);
  if (source === 'd1') {
    mountYearTabs(container, {
      years: YEARS, current: currentYear, compare: true,
      onChange: (y) => onYearChange(container, y)
    });
  }
}

async function renderCompareView(container) {
  container.innerHTML = `
<header class="hero"><div class="hero-inner">
  <p class="eyebrow" style="color:var(--saffron-500);">คลัสเตอร์โรค · เทียบรายปี</p>
  <h1>ป่วยร่วมหลายโรค + โรคหลัก<br><span>เทียบ พ.ศ. ๒๕๖๗ ↔ ๒๕๖๘</span></h1>
</div></header>
<section id="cmp"><div class="route-loading">กำลังโหลดทั้งสองปี…</div></section>`;

  mountYearTabs(container, {
    years: YEARS, current: 'compare', compare: true,
    onChange: (y) => onYearChange(container, y)
  });

  const S = { NATIONAL_MULTI: S_NATIONAL_MULTI, REGION_SUMMARY: S_REGION_SUMMARY, REGION_PROVINCES: S_REGION_PROVINCES };
  const [nw, od] = await Promise.all([loadCluster(S, 2568), loadCluster(S, 2567)]);
  const cmp = container.querySelector('#cmp');
  if (nw.source !== 'd1' || od.source !== 'd1') {
    cmp.innerHTML = '<div class="card">โหมดเทียบปีต้องใช้ข้อมูลจากฐานข้อมูลออนไลน์</div>';
    return;
  }

  // แปลงเป็น map: geoId -> row (per year)
  const idx = (D) => {
    const m = { 'national|TH': { pm2: D.NATIONAL_MULTI[2], pm3: D.NATIONAL_MULTI[3], pm4: D.NATIONAL_MULTI[4], pm5: D.NATIONAL_MULTI[5] } };
    for (const r of D.REGION_SUMMARY) m[`region|${r.region}`] = r;
    for (const rid in D.REGION_PROVINCES) for (const p of D.REGION_PROVINCES[rid]) m[`province|${p.affiliation_province_name}`] = p;
    return m;
  };
  const mN = idx(nw.data), mO = idx(od.data);

  const geos = [{ id: 'national|TH', label: 'ทั้งประเทศ' }];
  for (const r of nw.data.REGION_SUMMARY) geos.push({ id: `region|${r.region}`, label: r.region_name });
  for (const rid in nw.data.REGION_PROVINCES)
    for (const p of nw.data.REGION_PROVINCES[rid]) geos.push({ id: `province|${p.affiliation_province_name}`, label: `จังหวัด${p.affiliation_province_name}` });

  renderYearCompare(cmp, {
    yearOld: 2567, yearNew: 2568, geos, defaultGeo: 'national|TH',
    getRows: (geoId) => {
      const n = mN[geoId], o = mO[geoId];
      if (!n || !o) return [];
      const keys = geoId === 'national|TH' ? ['pm2', 'pm3', 'pm4', 'pm5'] : ['pm2', 'pm3', 'pm4', 'pm5', ...CL_CODES];
      return keys.map((k) => ({ key: k, label: clLabel(k), a: o[k], b: n[k] }));
    },
    note: "ระดับประเทศแสดงเฉพาะสัดส่วนป่วยร่วมหลายโรค · ระดับเขตและจังหวัดมีโรคหลัก 6 โรคเพิ่มด้วย"
  });
  animateFadeIn(container);
}

function initCluster(container, source) {
  if (source === 'd1') {
    const br = container.querySelector('.badge-row');
    if (br) br.insertAdjacentHTML('beforeend', '<span class="badge">ข้อมูลสด</span>');
  }
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);

let currentK = 2;

function renderQuadrant(){
  const field = 'pm' + currentK;
  const xRef = NATIONAL_MULTI[currentK];
  const all = [];
  Object.values(REGION_PROVINCES).forEach(list=>{
    list.forEach(p=>all.push({ affiliation_province_name: p.affiliation_province_name, n: p.n, val: p[field] }));
  });
  const W=680,H=440,ML=55,MR=25,MT=25,MB=55;
  const plotW=W-ML-MR, plotH=H-MT-MB;
  const xs = all.map(p=>p.val), ys = all.map(p=>p.n);
  const xMin=Math.min(...xs)-1, xMax=Math.max(...xs)+1;
  const yMaxRaw=Math.max(...ys);
  const yScale = v => Math.sqrt(v); // compress large range so small provinces are still visible
  const yMin=0, yMax=yScale(yMaxRaw)*1.05;
  const yRef = yScale(1500); // rough midpoint of reach
  function px(v){ return ML + (v-xMin)/(xMax-xMin)*plotW; }
  function py(v){ return MT + plotH - (yScale(v)-yMin)/(yMax-yMin)*plotH; }

  let svg = `<svg viewBox="0 0 ${W} ${H}">`;
  // quadrant background tints
  const xRefPx = px(xRef);
  const yRefPxReal = MT + plotH - (yRef-yMin)/(yMax-yMin)*plotH;
  svg += `<rect x="${xRefPx}" y="${MT}" width="${ML+plotW-xRefPx}" height="${yRefPxReal-MT}" fill="#FCEDEA" opacity="0.6"/>`;
  svg += `<rect x="${ML}" y="${MT}" width="${xRefPx-ML}" height="${yRefPxReal-MT}" fill="#EFF3EF" opacity="0.5"/>`;
  svg += `<rect x="${xRefPx}" y="${yRefPxReal}" width="${ML+plotW-xRefPx}" height="${MT+plotH-yRefPxReal}" fill="#FFF7E8" opacity="0.6"/>`;
  svg += `<rect x="${ML}" y="${yRefPxReal}" width="${xRefPx-ML}" height="${MT+plotH-yRefPxReal}" fill="#F0F4F8" opacity="0.5"/>`;

  // axes
  svg += `<line x1="${ML}" y1="${MT}" x2="${ML}" y2="${MT+plotH}" stroke="#C9A15A" stroke-width="1"/>`;
  svg += `<line x1="${ML}" y1="${MT+plotH}" x2="${ML+plotW}" y2="${MT+plotH}" stroke="#C9A15A" stroke-width="1"/>`;
  svg += `<line x1="${xRefPx}" y1="${MT}" x2="${xRefPx}" y2="${MT+plotH}" stroke="#8A2A2E" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>`;
  svg += `<line x1="${ML}" y1="${yRefPxReal}" x2="${ML+plotW}" y2="${yRefPxReal}" stroke="#8A2A2E" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>`;

  // quadrant plain-language labels
  svg += `<text x="${ML+8}" y="${MT+16}" class="quad-label" fill="#3D5245">คนเยอะ + เสี่ยงน้อย: เฝ้าระวังเบาๆ</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+16}" class="quad-label" fill="#6b342a">คนเยอะ + เสี่ยงเยอะ: ทำก่อนเลย!</text>`;
  svg += `<text x="${ML+8}" y="${MT+plotH-8}" class="quad-label" fill="#3D5245">คนน้อย + เสี่ยงน้อย: สบายใจได้</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+plotH-8}" class="quad-label" fill="#6b342a">คนน้อย + เสี่ยงเยอะ: จับตาดู</text>`;

  // dots
  all.forEach(p=>{
    const cx=px(p.val), cy=py(p.n);
    svg += `<circle class="quad-dot" cx="${cx}" cy="${cy}" r="5" fill="${p.val>=xRef ? '#C97B1D':'#4F6B58'}" fill-opacity="0.75" stroke="#FFFDF8" stroke-width="1"><title>${p.affiliation_province_name}\nพระสงฆ์ ${p.n.toLocaleString()} รูป\nป่วยร่วม≥${currentK}โรค ${p.val}%</title></circle>`;
  });

  // axis labels
  svg += `<text x="${ML+plotW/2}" y="${H-28}" text-anchor="middle" class="quad-tag">% ที่ป่วยร่วมตั้งแต่ ${currentK} โรคขึ้นไป</text>`;
  svg += `<text x="${ML}" y="${H-10}" text-anchor="start" class="quad-endlabel">น้อย</text>`;
  svg += `<text x="${ML+plotW}" y="${H-10}" text-anchor="end" class="quad-endlabel">มาก →</text>`;

  svg += `<text x="16" y="${MT+plotH/2}" text-anchor="middle" class="quad-tag" transform="rotate(-90 16 ${MT+plotH/2})">จำนวนพระสงฆ์ในจังหวัด</text>`;
  svg += `<text x="${ML-6}" y="${MT+plotH-2}" text-anchor="end" class="quad-endlabel">น้อย</text>`;
  svg += `<text x="${ML-6}" y="${MT+10}" text-anchor="end" class="quad-endlabel">มาก ↑</text>`;

  svg += `</svg>`;
  document.getElementById('quadrantWrap').innerHTML = svg;
  document.getElementById('quadTip').innerHTML = `แต่ละจุด = 1 จังหวัด (77 จุด) &nbsp;·&nbsp; เกณฑ์ตอนนี้: ป่วยร่วม <b style="color:var(--maroon-800);">≥ ${currentK} โรค</b> &nbsp;·&nbsp; ยิ่งอยู่ขวา ยิ่งเสี่ยงเยอะ &nbsp;·&nbsp; ยิ่งอยู่สูง ยิ่งมีพระสงฆ์เยอะ &nbsp;·&nbsp; วางเมาส์บนจุดเพื่อดูชื่อจังหวัด`;

  // build province list per quadrant for the summary table
  const groups = {
    urgent: { title: 'ทำก่อนเลย! (คนเยอะ + เสี่ยงเยอะ)', bg: '#FCEDEA', items: [] },
    watch:  { title: 'จับตาดู (คนน้อย + เสี่ยงเยอะ)', bg: '#FFF7E8', items: [] },
    monitor:{ title: 'เฝ้าระวังเบาๆ (คนเยอะ + เสี่ยงน้อย)', bg: '#EFF3EF', items: [] },
    fine:   { title: 'สบายใจได้ (คนน้อย + เสี่ยงน้อย)', bg: '#F0F4F8', items: [] },
  };
  all.forEach(p=>{
    const highRisk = p.val >= xRef;
    const highReach = p.n >= 1500;
    if(highRisk && highReach) groups.urgent.items.push(p);
    else if(highRisk && !highReach) groups.watch.items.push(p);
    else if(!highRisk && highReach) groups.monitor.items.push(p);
    else groups.fine.items.push(p);
  });
  let sumHtml = '';
  Object.values(groups).forEach(g=>{
    g.items.sort((a,b)=> b.val - a.val);
    const list = g.items.map(p=>`${p.affiliation_province_name} <b>(${p.val}%)</b>`).join(', ');
    sumHtml += `<div class="quad-summary-card" style="background:${g.bg};">
      <h5 style="color:var(--maroon-800);">${g.title}</h5>
      <div class="cnt">${g.items.length} จังหวัด</div>
      <div class="plist">${list || '<i>ไม่มีจังหวัดในกลุ่มนี้</i>'}</div>
    </div>`;
  });
  document.getElementById('quadSummary').innerHTML = sumHtml;
}

const METRIC_LABEL = {I10:"ความดันโลหิตสูง", E78:"ไขมันในเลือดสูง", E11:"เบาหวาน", pct_multi:"ป่วยร่วม ≥2 โรค"};
let currentRegion = 1, currentMetric = "I10";

function renderRegionGrid(){
  const grid = document.getElementById('regionGrid');
  grid.innerHTML = '';
  REGION_SUMMARY.forEach(r=>{
    const el = document.createElement('div');
    el.className = 'region-card' + (r.region===currentRegion ? ' active' : '');
    const shortName = r.region===13 ? 'กทม.' : ('เขต ' + r.region);
    el.innerHTML = `<div class="rn">${shortName}</div><div class="rl">${r.region_name.replace(/^เขต \d+ ?/,'').replace(/[()]/g,'')}</div><div class="rv">${r.I10}% ความดัน</div>`;
    el.addEventListener('click', ()=>{ currentRegion = r.region; renderRegionGrid(); renderDetail(); });
    grid.appendChild(el);
  });
}

function renderDetail(){
  const summary = REGION_SUMMARY.find(r=>r.region===currentRegion);
  document.getElementById('rdTitle').textContent = summary.region_name;
  document.getElementById('rdN').textContent = `พระสงฆ์ ${summary.n.toLocaleString()} รูปในเขตนี้ · ป่วยร่วม≥2โรค ${summary.pct_multi}%`;

  const provs = REGION_PROVINCES[currentRegion].slice().sort((a,b)=> b[currentMetric]-a[currentMetric]);
  const maxVal = Math.max(...provs.map(p=>p[currentMetric]), 1);
  const list = document.getElementById('provBarList');
  list.innerHTML = '';
  provs.forEach(p=>{
    const row = document.createElement('div');
    row.className = 'prov-bar-row';
    const pct = Math.max(4, (p[currentMetric]/maxVal*100));
    row.innerHTML = `<div class="pname">${p.affiliation_province_name} <span style="color:var(--sage); font-size:.68rem;">(n=${p.n})</span></div>
      <div class="ptrack"><div class="pfill" style="width:${pct}%;"></div></div>
      <div class="pval">${p[currentMetric]}%</div>`;
    list.appendChild(row);
  });
}

document.getElementById('metricChips').addEventListener('click', (e)=>{
  const btn = e.target.closest('.metric-chip');
  if(!btn) return;
  document.querySelectorAll('.metric-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  currentMetric = btn.dataset.metric;
  renderDetail();
});

renderRegionGrid();
renderDetail();
document.getElementById('multiThresholdChips').addEventListener('click', (e)=>{
  const btn = e.target.closest('.metric-chip');
  if(!btn) return;
  document.querySelectorAll('#multiThresholdChips .metric-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  currentK = parseInt(btn.dataset.k);
  renderQuadrant();
});
renderQuadrant();

// SPA nav handles section switching — old nav button handler removed

  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = trackObserver(new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); fadeObs.unobserve(e.target); } });
  }, {threshold:.1}));
  fadeEls.forEach(el=>fadeObs.observe(el));

  const bars = document.querySelectorAll('.bar-fill');
  const barObs = trackObserver(new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.style.width = e.target.dataset.w + '%'; barObs.unobserve(e.target); }
    });
  }, {threshold:.3}));
  bars.forEach(b=>barObs.observe(b));

}
