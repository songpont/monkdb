/* Section: source/เจาะลึกข้อมูลสุขภาพพระสงฆ์_รอบ3.html */

import {
  animateFadeIn, animateBars, animateGapBars, animateCounters, animateGrpBars,
  trackObserver
} from './utils.js';
import {
  MORTALITY_REGION as S_MORTALITY_REGION,
  PRIORITY_SCORE,
  MORTALITY_PROVINCE as S_MORTALITY_PROVINCE
} from './data/data-priority.js';
import { loadPriorityMortality, loadCluster } from './api.js';
import { mountYearTabs } from './year-tabs.js';
import { renderYearCompare, clusterCompareIndex } from './year-compare.js';

// PRIORITY_SCORE = คะแนนประกอบ คงเป็น static (ไม่ได้เก็บสูตรใน D1)
let MORTALITY_REGION = S_MORTALITY_REGION;
let MORTALITY_PROVINCE = S_MORTALITY_PROVINCE;
let currentYear = 2568;

function onYearChange(container, y) {
  currentYear = y;
  render(container);
}

const CMP_METRICS = [
  { key: 'pm2', label: 'ป่วยร่วม ≥2 โรค' },
  { key: 'pm3', label: 'ป่วยร่วม ≥3 โรค' },
  { key: 'pm4', label: 'ป่วยร่วม ≥4 โรค' },
  { key: 'pm5', label: 'ป่วยร่วม ≥5 โรค' }
];

export async function render(container) {
  if (currentYear === 'compare') return renderCompareView(container);
  container.innerHTML = `

<header class="hero">
  <div class="hero-inner">
    <p class="eyebrow" style="color:var(--saffron-500);">Round 3 · แนวโน้มเวลา + คะแนนจัดลำดับความสำคัญ</p>
    <h1>เจาะลึกข้อมูลสุขภาพพระสงฆ์:<br><span>อะไรกำลังแย่ลง และควรเริ่มที่จังหวัดไหนก่อน</span></h1>
    <p>ต่อจากรอบ 1 (กลุ่ม+พื้นที่) และรอบ 2 (อายุ+สถานะ) รอบนี้ดูว่าสถานการณ์ "เปลี่ยนไปตามเวลา" อย่างไร แล้วรวมทุกปัจจัยเป็น <b>คะแนนเดียว</b> ช่วยตัดสินใจว่าจังหวัดไหนควรได้รับความช่วยเหลือก่อน</p>
    <div class="badge-row">
      <span class="badge">แนวโน้มรายปี</span>
      <span class="badge">รุ่นบวช (Cohort)</span>
      <span class="badge">Priority Score</span>
      <span class="badge">แกนอายุ + เลือกปัจจัยได้เอง</span>
    </div>
  </div>
</header>

<!-- ============ INTRO ============ -->
<section id="intro">
  <div class="sec-head fade-in">
    <p class="eyebrow">ต่อยอดจากรอบที่แล้ว</p>
    <h2>รอบนี้ต่างจาก 2 รอบก่อนอย่างไร</h2>
    <p>รอบ 1-2 เป็นภาพ "ตัดขวาง" ณ ปัจจุบัน (snapshot) ส่วนรอบนี้ดึงมิติ "เวลา" เข้ามา — ดูว่าอะไรกำลังแย่ลงเร็ว แล้วปิดท้ายด้วยการรวมทุกปัจจัยที่เจอมาทั้ง 3 รอบให้เป็นคะแนนเดียวต่อจังหวัด ใช้ตัดสินใจได้จริง</p>
    <div class="divider"></div>
  </div>
  <div class="caveat-note fade-in">
    <b>ข้อจำกัดของข้อมูลที่ต้องบอกตรงๆ:</b> มี 2 เรื่องจากแผนเดิมที่ทำไม่ได้ด้วยข้อมูลชุดนี้ (1) "ช่องว่างการคัดกรอง" ระดับจังหวัด เพราะข้อมูลคัดกรองที่มีอยู่เป็นตัวเลขระดับประเทศเท่านั้น ไม่ได้แยกจังหวัด และ (2) แดชบอร์ดที่เชื่อมสดกับระบบ HISO เพราะไฟล์นี้เป็นข้อมูลนิ่ง (static) ไม่ได้ต่อกับฐานข้อมูลจริง — ทั้งสองเรื่องนี้ต้องรอข้อมูลเพิ่มเติมหรือการเชื่อมระบบจริงในอนาคต
  </div>
</section>

<!-- ============ MORTALITY TREND ============ -->
<section id="mortality">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 14</p>
    <h2>แนวโน้มการมรณภาพรายปี — เขตไหนเพิ่มเร็ว เขตไหนเพิ่มช้า</h2>
    <p>นับจำนวนพระสงฆ์ที่มรณภาพในแต่ละปี (2562-2568) แยกตามเขตสุขภาพ เทียบปี 2562 กับ 2568 ว่าเพิ่มขึ้นกี่เท่า</p>
    <div class="divider"></div>
  </div>

  <div class="info-callout fade-in">
    <p><b>ก่อนอ่านกราฟ ต้องระวังเรื่องนี้ก่อน:</b> จำนวนมรณภาพที่บันทึกเพิ่มขึ้นทุกปี อาจไม่ได้แปลว่าพระสงฆ์ป่วยหนักขึ้นจริง — ส่วนหนึ่งอาจเป็นเพราะ<b>ระบบบันทึกข้อมูลดีขึ้นเรื่อยๆ</b> (ปีแรกๆ ที่เริ่มเก็บข้อมูล อาจบันทึกไม่ครบ) ตัวเลข "เพิ่มกี่เท่า" ในกราฟนี้จึงควรมองเป็น <b>"สัญญาณเปรียบเทียบระหว่างเขต"</b> มากกว่าตัวเลขที่แม่นยำ 100%</p>
  </div>

  <div class="card fade-in">
    <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">มองทีเดียวจบ: ที่ไหน "มรณภาพเยอะ" และที่ไหน "เพิ่มเร็ว"</h4>

    <div class="metric-chip-row" id="mortModeChips" style="justify-content:center;">
      <button class="metric-chip active" data-mode="region">ดูรายเขตสุขภาพ (13 เขต)</button>
      <button class="metric-chip" data-mode="province">ดูรายจังหวัด (77 จังหวัด)</button>
    </div>

    <div class="simple-tip" id="mortTip">แต่ละจุด = 1 เขตสุขภาพ (13 จุด) &nbsp;·&nbsp; ยิ่งอยู่ขวา ยิ่งมีคนมรณภาพสะสมเยอะ (2562-2568) &nbsp;·&nbsp; ยิ่งอยู่สูง ยิ่งเพิ่มเร็ว (เทียบปี 2562 กับ 2568)</div>
    <div class="quadrant-wrap" id="quadrantMort"></div>
    <div class="quad-summary" id="quadSummaryMort"></div>
    <div class="caveat-note" id="mortSmallNCaveat" style="display:none;">
      <b>ระวังตัวเลขเล็ก:</b> เมื่อดูรายจังหวัด บางจังหวัดมีพระมรณภาพปี 2562 แค่ 0-1 รูป การเพิ่มเป็น 5-14 รูปในปี 2568 จะได้ "กี่เท่า" ที่สูงมากทั้งที่จำนวนจริงยังน้อย — ให้ดูตัวเลข "จำนวนจริง" ในวงเล็บควบคู่ไปด้วยเสมอ อย่าดูแค่ "กี่เท่า" อย่างเดียว
    </div>
    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> บางพื้นที่อาจมีจำนวนมรณภาพเพิ่มขึ้นเร็วกว่าที่อื่นผิดปกติ ซึ่งอาจสะท้อนปัญหาสุขภาพที่แย่ลงเร็ว หรือระบบบันทึกข้อมูลที่เพิ่งเริ่มดีขึ้น</div>
      <div class="row"><b>ทำยังไง:</b> นับจำนวนมรณภาพปี 2562 และปี 2568 แยกตามเขต/จังหวัด แล้วหารดูว่าปี 2568 มากกว่าปี 2562 กี่เท่า</div>
      <div class="row"><b>พบว่า:</b> ระดับเขต — เขต 11 (สุราษฎร์ธานี) และเขต 2 (พิษณุโลก) เพิ่มเร็วที่สุด (~3.2 เท่า) ส่วนระดับจังหวัด ตัวเลข "กี่เท่า" ผันผวนสูงในจังหวัดเล็ก จึงควรดูคู่กับจำนวนจริงเสมอ (ดูคำเตือนด้านบน)</div>
    </div>
  </div>
</section>

<!-- ============ COHORT ============ -->
<section id="cohort">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 15</p>
    <h2>รุ่นบวช (Cohort) — บวชคนละยุค ป่วยต่างกันจริงหรือแค่อายุต่าง</h2>
    <p>แบ่งพระภิกษุตามปีที่บวช (ordinate_year) เป็น 5 รุ่น แล้วดูว่าตอนนี้แต่ละรุ่นป่วยร่วมกี่ %</p>
    <div class="divider"></div>
  </div>
  <div class="card fade-in">
    <table class="data-table">
      <thead><tr><th>รุ่นที่บวช</th><th style="text-align:right;">จำนวน</th><th style="text-align:right;">อายุเฉลี่ยตอนนี้</th><th style="text-align:right;">ป่วยร่วม ≥2 โรค</th></tr></thead>
      <tbody>
        <tr><td>ก่อน 1990</td><td class="num">12,862</td><td class="num">68.3 ปี</td><td class="num">38.9%</td></tr>
        <tr><td>1990-1999</td><td class="num">15,322</td><td class="num">60.8 ปี</td><td class="num">29.1%</td></tr>
        <tr><td>2000-2009</td><td class="num">22,395</td><td class="num">58.1 ปี</td><td class="num">27.4%</td></tr>
        <tr><td>2010-2019</td><td class="num">44,558</td><td class="num">52.1 ปี</td><td class="num">21.6%</td></tr>
        <tr class="highlight"><td>2020-2025</td><td class="num">27,081</td><td class="num">45.6 ปี</td><td class="num">16.1%</td></tr>
      </tbody>
    </table>
    <div class="caveat-note">
      <b>ผลนี้แทบจะเป็นเรื่องเดียวกับ "อายุ" ที่เจอในรอบ 2:</b> รุ่นที่บวชนานแล้วก็แก่กว่าเป็นธรรมดา (68.3 ปี เทียบ 45.6 ปี) ตัวเลขป่วยร่วมที่ต่างกันมากจึงสะท้อน<b>อายุปัจจุบัน</b>เป็นหลัก ไม่ใช่ผลจาก "รุ่นบวช" โดยตรง — ถ้าอยากรู้ผลที่แท้จริงของรุ่นบวช (ตัดอายุออก) ต้องใช้วิธีเดียวกับที่ทำไว้ในรอบ 2 (หัวข้อ "อายุขณะบวช") ซึ่งได้คำตอบไปแล้วว่ามีผลอยู่บ้างแต่ไม่มากเท่าตัวเลขดิบนี้
    </div>
  </div>
</section>

<!-- ============ CAPACITY vs AGING ============ -->
<section id="capacity">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 16</p>
    <h2>ฐานทุนกำลังคนโตทันผู้สูงอายุที่เพิ่มขึ้นไหม</h2>
    <p>เทียบการเติบโตของพระคิลานุปัฏฐากและวัดส่งเสริมสุขภาพ กับสัดส่วนผู้สูงอายุปัจจุบัน</p>
    <div class="divider"></div>
  </div>
  <div class="caveat-note fade-in">
    <b>ข้อจำกัด:</b> ข้อมูลที่มีเป็น "ภาพนิ่ง" ของสัดส่วนผู้สูงอายุ ณ ปี 2568 เท่านั้น ไม่มีข้อมูลย้อนหลังว่าสัดส่วนผู้สูงอายุเพิ่มขึ้นเร็วแค่ไหนในแต่ละปี จึงเปรียบเทียบ "อัตราเติบโต" ของทั้งสองฝั่งแบบตรงๆ ไม่ได้ 100% ทำได้เพียงวางเคียงกันให้เห็นภาพว่าฐานทุนโตขนาดไหนเทียบกับขนาดปัญหาปัจจุบัน
  </div>
  <div class="two-col fade-in">
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.5rem;">ฐานทุนกำลังคนที่โตขึ้น (2562 → ล่าสุด)</h4>
      <div class="bar-row"><div class="lbl"><span>พระคิลานุปัฏฐาก (อสว.)</span><span>~4,000 → 14,421 รูป</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>วัดส่งเสริมสุขภาพ</span><span>4,191 → 19,484 แห่ง</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
      <p style="font-size:.78rem; color:var(--sage); margin-top:.8rem; margin-bottom:0;">พระคิลานุปัฏฐากโตขึ้น <b style="color:var(--maroon-800);">~3.6 เท่า</b> · วัดส่งเสริมสุขภาพโตขึ้น <b style="color:var(--maroon-800);">~4.6 เท่า</b> ในรอบ ~6 ปี</p>
    </div>
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.5rem;">ขนาดปัญหาปัจจุบัน (2568)</h4>
      <div class="bar-row"><div class="lbl"><span>พระสงฆ์อายุ 60 ปีขึ้นไป</span><span>36.1%</span></div><div class="bar-track"><div class="bar-fill" data-w="72"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>ป่วยร่วมตั้งแต่ 2 โรคขึ้นไป</span><span>20.4%</span></div><div class="bar-track"><div class="bar-fill" data-w="41"></div></div></div>
      <p style="font-size:.78rem; color:var(--sage); margin-top:.8rem; margin-bottom:0;">แม้ฐานทุนจะโตเร็ว (3.6-4.6 เท่า) แต่ยังต้องดูแลพระสงฆ์ผู้สูงอายุกว่า <b style="color:var(--maroon-800);">1 ใน 3</b> ของทั้งหมด — ควรติดตามว่ากำลังคนต่อหัวพระสงฆ์สูงอายุเพียงพอจริงหรือยัง</p>
    </div>
  </div>
</section>

<!-- ============ PRIORITY SCORE ============ -->
<section id="priority">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 17 — สรุปรวมทุกรอบ</p>
    <h2>Priority Score: มองจังหวัดผ่าน "อายุ" เป็นแกนหลัก</h2>
    <p>ทุกรอบที่ผ่านมาชี้ตรงกันว่า "อายุ" คือตัวแปรที่ทรงพลังที่สุด รอบนี้จึงตรึงอายุเป็นแกนนอนเสมอ แล้วให้เลือกได้ว่าจะดูคู่กับปัจจัยไหนบนแกนตั้ง</p>
    <div class="divider"></div>
  </div>

  <div class="info-callout fade-in" style="display:block;">
    <p style="margin:0 0 .3rem; font-weight:700; color:var(--maroon-800);">วิธีคิด (ทำทีละขั้น):</p>
    <ol class="step-list">
      <li><b style="color:var(--maroon-800);">แกนนอน (แกนหลัก ตรึงไว้เสมอ)</b> = % พระสงฆ์อายุ 60 ปีขึ้นไปของแต่ละจังหวัด — ยิ่งอยู่ขวา ยิ่งเป็นจังหวัด "สังคมพระสงฆ์สูงวัย"</li>
      <li><b style="color:var(--maroon-800);">แกนตั้ง (เลือกได้ ปุ่มด้านล่าง)</b> = ปัจจัยอื่นที่อยากดูควบคู่กับอายุ เช่น ป่วยร่วมมากแค่ไหน, มีพระเยอะแค่ไหน, หรือมรณภาพเพิ่มเร็วแค่ไหน</li>
      <li>ลากเส้นแบ่งกลางกราฟที่ <b style="color:var(--maroon-800);">ค่าเฉลี่ยของทั้ง 77 จังหวัด</b> ทั้งสองแกน แบ่งเป็น 4 มุม</li>
      <li>จังหวัดที่อยู่มุม <b style="color:var(--maroon-800);">"บนขวา"</b> (อายุเยอะ + ปัจจัยที่เลือกก็สูงด้วย) คือกลุ่มที่น่าจะต้องดูแลเร่งด่วนที่สุดเสมอ ไม่ว่าจะเลือกแกนตั้งเป็นอะไร</li>
    </ol>
    <div class="worked-example">
      <b>ตัวอย่าง:</b> ถ้าเลือกแกนตั้ง = "ป่วยร่วม" แล้วเห็นจังหวัด A อยู่มุมบนขวา แปลว่าจังหวัด A ทั้งมีผู้สูงอายุเยอะ<b>และ</b>ป่วยร่วมหลายโรคเยอะพร้อมกัน — เสี่ยงกว่าจังหวัดที่มีผู้สูงอายุเยอะเหมือนกันแต่ป่วยร่วมน้อย (อยู่มุมล่างขวา)
    </div>
  </div>

  <div class="card fade-in">
    <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">เลือกปัจจัยที่จะดูคู่กับอายุ</h4>
    <div class="metric-chip-row" id="priorityYChips" style="justify-content:center;">
      <button class="metric-chip active" data-y="pct_multi">ป่วยร่วมหลายโรค</button>
      <button class="metric-chip" data-y="n">จำนวนพระสงฆ์</button>
      <button class="metric-chip" data-y="mort_growth">มรณภาพเพิ่มเร็วแค่ไหน</button>
    </div>
    <div class="simple-tip" id="priorityTip">แต่ละจุด = 1 จังหวัด (77 จุด) &nbsp;·&nbsp; วางเมาส์บนจุดเพื่อดูรายละเอียดครบทุกปัจจัย</div>
    <div class="quadrant-wrap" id="quadrantPriority"></div>
    <div class="quad-summary" id="quadSummaryPriority"></div>
  </div>
</section>

<!-- ============ POLICY SUMMARY ============ -->
<section id="policy">
  <div class="sec-head fade-in">
    <p class="eyebrow">สรุปผล</p>
    <h2>ทางเลือกเชิงนโยบายจากการวิเคราะห์รอบที่ 3</h2>
    <p>ประเด็นสำคัญที่พบและข้อเสนอเชิงปฏิบัติ ปิดท้ายการวิเคราะห์เชิงลึกทั้ง 3 รอบ</p>
    <div class="divider"></div>
  </div>

  <div class="card fade-in">
    <h4 style="color:var(--maroon-800); margin-bottom:.6rem;">โรคที่เชื่อมกับการมรณภาพ แยกตามภูมิภาค</h4>
    <div class="note">มะเร็งปอด (C34) และหัวใจล้มเหลว (I50) ในกลุ่มมรณภาพแล้ว เทียบตามเขต</div>
    <div class="bar-row"><div class="lbl"><span>มะเร็งปอด — เขต 12 (สงขลา)</span><span>1.54%</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>มะเร็งปอด — เขต 10 (อุบลราชธานี)</span><span>1.30%</span></div><div class="bar-track"><div class="bar-fill" data-w="84"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>มะเร็งปอด — เขต 9 (นครราชสีมา)</span><span>1.28%</span></div><div class="bar-track"><div class="bar-fill" data-w="83"></div></div></div>
    <div style="height:.5rem;"></div>
    <div class="bar-row"><div class="lbl"><span>หัวใจล้มเหลว — เขต 10 (อุบลราชธานี)</span><span>4.71%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="100"></div></div></div>
    <div class="bar-row"><div class="lbl"><span>หัวใจล้มเหลว — เขต 11 (สุราษฎร์ธานี)</span><span>3.93%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="83"></div></div></div>
    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> โรคที่ทำให้เสียชีวิตอาจแตกต่างกันไปตามภูมิภาค (ต่างจากโรคที่พบบ่อยตอนมีชีวิตซึ่งดูในรอบ 1 แล้ว)</div>
      <div class="row"><b>ทำยังไง:</b> ดูเฉพาะกลุ่มพระสงฆ์ที่มรณภาพแล้ว (19,554 รูปที่ทราบเขต) แล้วเทียบว่ามีประวัติมะเร็งปอด/หัวใจล้มเหลวกี่ % แยกตามเขต</div>
      <div class="row"><b>พบว่า:</b> เขตภาคใต้ (สงขลา) นำเรื่องมะเร็งปอด ส่วนภาคอีสานตอนล่าง (อุบลราชธานี สุราษฎร์ธานี) นำเรื่องหัวใจล้มเหลว — ไม่ตรงกับ 1 ภูมิภาคเดียว จึงต้องออกแบบโปรแกรมป้องกันเฉพาะโรคแยกตามพื้นที่ ไม่ใช่ชุดเดียวทั้งประเทศ <span style="opacity:.7;">(หมายเหตุ: ไม่มีข้อมูลอัตราสูบบุหรี่รายพื้นที่ในชุดข้อมูลนี้ จึงเทียบเชิงเหตุ-ผลกับพฤติกรรมสูบบุหรี่โดยตรงไม่ได้ ทำได้เพียงตั้งข้อสังเกตเชิงพื้นที่)</span></div>
    </div>
  </div>

  <div class="card fade-in" style="margin-top:1.6rem;">
    <ul class="impl-list">
      <li><b>เขต 11 (สุราษฎร์ธานี) และเขต 2 (พิษณุโลก)</b> มีอัตรามรณภาพเพิ่มเร็วที่สุด (~3.2 เท่าใน 6 ปี) ควรตรวจสอบเชิงลึกว่าเป็นปัญหาสุขภาพจริงหรือผลจากการเก็บข้อมูลที่ดีขึ้น ก่อนตัดสินใจเชิงนโยบาย</li>
      <li><b>ผลจาก "รุ่นบวช" ควรตีความผ่านการควบคุมอายุเสมอ</b> (ตามวิธีที่ใช้ในรอบ 2) ไม่ควรอ่านตัวเลขดิบตรงๆ เพราะจะเข้าใจผิดว่ารุ่นบวชเก่าป่วยเยอะกว่าทั้งที่จริงคือผลจากอายุ</li>
      <li><b>ฐานทุนกำลังคนโตเร็วกว่า 3.6-4.6 เท่าในรอบ 6 ปี</b> เป็นสัญญาณดี แต่ควรคำนวณ "อัตราส่วนกำลังคนต่อพระสงฆ์สูงอายุ 1 คน" ให้ชัดเจนในรอบต่อไป เพื่อยืนยันว่าเพียงพอจริง</li>
      <li><b>ใช้กราฟ Priority Score เป็นเครื่องมือหลักในการจัดสรรทรัพยากร</b> — จังหวัดที่อยู่มุม "อายุเยอะ + เร่งด่วนที่สุด" ไม่ว่าจะเลือกดูคู่กับปัจจัยไหน (ป่วยร่วม/จำนวนพระ/มรณภาพเพิ่มเร็ว) ควรได้รับความสำคัญก่อนเสมอ เพราะเป็นสัญญาณที่ซ้ำกันในหลายมุมมอง</li>
      <li><b>โรคที่เชื่อมมรณภาพต่างกันตามภูมิภาค</b> — มะเร็งปอดเด่นในภาคใต้ หัวใจล้มเหลวเด่นในอีสานตอนล่าง ควรออกแบบโปรแกรมป้องกันเฉพาะโรคแยกตามพื้นที่</li>
    </ul>
  </div>

  <div class="info-callout fade-in" style="margin-top:1.6rem;">
    <p>การวิเคราะห์เชิงลึกครบทั้ง 3 รอบตามแผนที่วางไว้แล้ว (รอบ 1: คลัสเตอร์+พื้นที่ / รอบ 2: อายุ+สถานะ / รอบ 3: เวลา+คะแนนรวม) ขั้นตอนถัดไปที่แนะนำคือนำ Priority Score ไปหารือร่วมกับผู้ปฏิบัติงานในพื้นที่ เพื่อตรวจสอบว่าตรงกับสถานการณ์จริงที่หน้างานหรือไม่ ก่อนนำไปใช้จัดสรรทรัพยากรจริง</p>
  </div>
</section>

`;
  const { data, source } = await loadPriorityMortality({
    MORTALITY_REGION: S_MORTALITY_REGION, MORTALITY_PROVINCE: S_MORTALITY_PROVINCE, PRIORITY_SCORE
  });
  MORTALITY_REGION = data.MORTALITY_REGION;
  MORTALITY_PROVINCE = data.MORTALITY_PROVINCE;
  initPriority(container, source);
  if (source === 'd1') {
    mountYearTabs(container, {
      years: [2568], current: currentYear, compare: true,
      onChange: (y) => onYearChange(container, y)
    });
  }
}

async function renderCompareView(container) {
  container.innerHTML = `
<header class="hero"><div class="hero-inner">
  <p class="eyebrow" style="color:var(--saffron-500);">Priority Score · เทียบรายปี</p>
  <h1>สัดส่วนพระสงฆ์ที่ป่วยหลายโรคพร้อมกัน<br><span>เทียบ พ.ศ. ๒๕๖๗ ↔ ๒๕๖๘ รายจังหวัด/เขต</span></h1>
</div></header>
<section id="cmp"><div class="route-loading">กำลังโหลดทั้งสองปี…</div></section>`;

  mountYearTabs(container, {
    years: [2568], current: 'compare', compare: true,
    onChange: (y) => onYearChange(container, y)
  });

  const S = { NATIONAL_MULTI: {}, REGION_SUMMARY: [], REGION_PROVINCES: {} };
  const [nw, od] = await Promise.all([loadCluster(S, 2568), loadCluster(S, 2567)]);
  const cmp = container.querySelector('#cmp');
  if (nw.source !== 'd1' || od.source !== 'd1') {
    cmp.innerHTML = '<div class="card">โหมดเทียบปีต้องใช้ข้อมูลจากฐานข้อมูลออนไลน์</div>';
    return;
  }
  const iN = clusterCompareIndex(nw.data), iO = clusterCompareIndex(od.data);

  renderYearCompare(cmp, {
    yearOld: 2567, yearNew: 2568, geos: iN.geos, defaultGeo: 'national|TH',
    intro: 'เทียบสัดส่วนพระสงฆ์ที่ตรวจพบว่าป่วยหลายโรคพร้อมกัน ระหว่าง พ.ศ. ๒๕๖๗ กับ ๒๕๖๘ (ตัวเลขนับรวมสะสม จึงมีแต่เพิ่มขึ้น)',
    getRows: (gid) => {
      const n = iN.get(gid), o = iO.get(gid);
      if (!n || !o) return [];
      return CMP_METRICS.map((m) => ({ key: m.key, label: m.label, a: o[m.key], b: n[m.key] }));
    },
    note: 'คะแนน Priority Score เป็นการให้คะแนนโดยเทียบทุกจังหวัดกัน และมีเฉพาะ พ.ศ. ๒๕๖๘ จึงยังเทียบรายปีไม่ได้ · จำนวนมรณภาพดูแบบรายปีได้ที่มุมมองปกติ'
  });
  animateFadeIn(container);
}

function initPriority(container, source) {
  if (source === 'd1') {
    const br = container.querySelector('.badge-row');
    if (br) br.insertAdjacentHTML('beforeend', '<span class="badge">มรณภาพ: ข้อมูลสด</span>');
  }
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);


let currentMortMode = 'region';

function renderMortalityQuadrant(){
  const isProvince = currentMortMode === 'province';
  const src = isProvince ? MORTALITY_PROVINCE : MORTALITY_REGION;
  const points = Object.keys(src).map(k=>{
    const r = src[k];
    return { key: k, name: isProvince ? k : r.name, total: r.total, growth: r.growth, d19: r.d19, d25: r.d25 };
  });
  const W=680,H=440,ML=55,MR=25,MT=25,MB=55;
  const plotW=W-ML-MR, plotH=H-MT-MB;
  const xs = points.map(p=>p.total), ys = points.map(p=>p.growth);
  const xMin=0, xMax=Math.max(...xs)*1.08;
  const yMin=Math.min(...ys)-0.2, yMax=Math.max(...ys)+0.2;
  const xRef = xs.reduce((a,b)=>a+b,0)/xs.length;
  const yRef = ys.reduce((a,b)=>a+b,0)/ys.length;
  function px(v){ return ML + (v-xMin)/(xMax-xMin)*plotW; }
  function py(v){ return MT + plotH - (v-yMin)/(yMax-yMin)*plotH; }
  const xRefPx = px(xRef), yRefPx = py(yRef);

  let svg = `<svg viewBox="0 0 ${W} ${H}">`;
  svg += `<rect x="${xRefPx}" y="${MT}" width="${ML+plotW-xRefPx}" height="${yRefPx-MT}" fill="#FCEDEA" opacity="0.6"/>`;
  svg += `<rect x="${ML}" y="${MT}" width="${xRefPx-ML}" height="${yRefPx-MT}" fill="#FFF7E8" opacity="0.6"/>`;
  svg += `<rect x="${xRefPx}" y="${yRefPx}" width="${ML+plotW-xRefPx}" height="${MT+plotH-yRefPx}" fill="#F0F4F8" opacity="0.5"/>`;
  svg += `<rect x="${ML}" y="${yRefPx}" width="${xRefPx-ML}" height="${MT+plotH-yRefPx}" fill="#EFF3EF" opacity="0.5"/>`;

  svg += `<line x1="${ML}" y1="${MT}" x2="${ML}" y2="${MT+plotH}" stroke="#C9A15A" stroke-width="1"/>`;
  svg += `<line x1="${ML}" y1="${MT+plotH}" x2="${ML+plotW}" y2="${MT+plotH}" stroke="#C9A15A" stroke-width="1"/>`;
  svg += `<line x1="${xRefPx}" y1="${MT}" x2="${xRefPx}" y2="${MT+plotH}" stroke="#8A2A2E" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>`;
  svg += `<line x1="${ML}" y1="${yRefPx}" x2="${ML+plotW}" y2="${yRefPx}" stroke="#8A2A2E" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>`;

  svg += `<text x="${ML+8}" y="${MT+16}" class="quad-label" fill="#C97B1D">น้อย + เพิ่มเร็ว: จับตาใกล้ชิด</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+16}" class="quad-label" fill="#6b342a">เยอะ + เพิ่มเร็ว: ตรวจสอบด่วน</text>`;
  svg += `<text x="${ML+8}" y="${MT+plotH-8}" class="quad-label" fill="#3D5245">น้อย + เพิ่มช้า: สบายใจได้</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+plotH-8}" class="quad-label" fill="#6b342a">เยอะ + เพิ่มช้า: ดูแลตามปกติ</text>`;

  points.forEach(p=>{
    const cx=px(p.total), cy=py(p.growth);
    const dotR = isProvince ? 5 : 7;
    svg += `<circle class="quad-dot" cx="${cx}" cy="${cy}" r="${dotR}" fill="${p.total>=xRef?'#C97B1D':'#4F6B58'}" fill-opacity="0.8" stroke="#FFFDF8" stroke-width="1.2"><title>${p.name}\nมรณภาพสะสม 2562-2568: ${p.total} รูป (ปี 2562: ${p.d19} → ปี 2568: ${p.d25})\nเพิ่มขึ้น ${p.growth} เท่า</title></circle>`;
    if(!isProvince){
      const shortName = p.key==='13' ? 'กทม.' : ('เขต '+p.key);
      svg += `<text x="${cx+9}" y="${cy+4}" class="quad-name">${shortName}</text>`;
    }
  });

  svg += `<text x="${ML+plotW/2}" y="${H-28}" text-anchor="middle" class="quad-tag">จำนวนมรณภาพสะสม 2562-2568</text>`;
  svg += `<text x="${ML}" y="${H-10}" text-anchor="start" class="quad-endlabel">น้อย</text>`;
  svg += `<text x="${ML+plotW}" y="${H-10}" text-anchor="end" class="quad-endlabel">มาก →</text>`;

  svg += `<text x="16" y="${MT+plotH/2}" text-anchor="middle" class="quad-tag" transform="rotate(-90 16 ${MT+plotH/2})">เพิ่มขึ้นกี่เท่า 2562→2568</text>`;
  svg += `<text x="${ML-6}" y="${MT+plotH-2}" text-anchor="end" class="quad-endlabel">ช้า</text>`;
  svg += `<text x="${ML-6}" y="${MT+10}" text-anchor="end" class="quad-endlabel">เร็ว ↑</text>`;
  svg += `</svg>`;
  document.getElementById('quadrantMort').innerHTML = svg;

  const unitLabel = isProvince ? 'จังหวัด' : 'เขต';
  document.getElementById('mortTip').innerHTML = `แต่ละจุด = 1${unitLabel} (${points.length} จุด) &nbsp;·&nbsp; ยิ่งอยู่ขวา ยิ่งมีคนมรณภาพสะสมเยอะ &nbsp;·&nbsp; ยิ่งอยู่สูง ยิ่งเพิ่มเร็ว${isProvince ? ' &nbsp;·&nbsp; วางเมาส์บนจุดเพื่อดูชื่อจังหวัด' : ''}`;
  document.getElementById('mortSmallNCaveat').style.display = isProvince ? 'block' : 'none';

  const groups = {
    urgent: { title: `เยอะ + เพิ่มเร็ว: ตรวจสอบด่วน`, bg: '#FCEDEA', items: [] },
    care:   { title: `เยอะ + เพิ่มช้า: ดูแลตามปกติ`, bg: '#FFF7E8', items: [] },
    watch:  { title: `น้อย + เพิ่มเร็ว: จับตาใกล้ชิด`, bg: '#F0F4F8', items: [] },
    fine:   { title: `น้อย + เพิ่มช้า: สบายใจได้`, bg: '#EFF3EF', items: [] },
  };
  points.forEach(p=>{
    const high = p.total>=xRef, fast = p.growth>=yRef;
    if(high&&fast) groups.urgent.items.push(p);
    else if(high&&!fast) groups.care.items.push(p);
    else if(!high&&fast) groups.watch.items.push(p);
    else groups.fine.items.push(p);
  });
  let sumHtml='';
  Object.values(groups).forEach(g=>{
    g.items.sort((a,b)=>b.total-a.total);
    const list = g.items.map(p=>`${p.name} <b>(${p.total} รูป, x${p.growth})</b>`).join(', ');
    sumHtml += `<div class="quad-summary-card" style="background:${g.bg};">
      <h5 style="color:var(--maroon-800);">${g.title}</h5>
      <div class="cnt">${g.items.length} ${unitLabel}</div>
      <div class="plist">${list || `<i>ไม่มี${unitLabel}ในกลุ่มนี้</i>`}</div>
    </div>`;
  });
  document.getElementById('quadSummaryMort').innerHTML = sumHtml;
}
document.getElementById('mortModeChips').addEventListener('click', (e)=>{
  const btn = e.target.closest('.metric-chip');
  if(!btn) return;
  document.querySelectorAll('#mortModeChips .metric-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  currentMortMode = btn.dataset.mode;
  renderMortalityQuadrant();
});
renderMortalityQuadrant();

const Y_CONFIG = {
  pct_multi: { label: 'ป่วยร่วมหลายโรค', unit: '%', hi: 'ป่วยเยอะ', lo: 'ป่วยน้อย' },
  n: { label: 'จำนวนพระสงฆ์', unit: ' รูป', hi: 'พระเยอะ', lo: 'พระน้อย', sqrt: true },
  mort_growth: { label: 'มรณภาพเพิ่มเร็ว', unit: ' เท่า', hi: 'เพิ่มเร็ว', lo: 'เพิ่มช้า' },
};
let currentY = 'pct_multi';

function renderPriorityQuadrant(){
  const cfg = Y_CONFIG[currentY];
  const provinces = Object.keys(PRIORITY_SCORE).map(name=>({ name, ...PRIORITY_SCORE[name] }));
  const W=680,H=440,ML=55,MR=25,MT=25,MB=55;
  const plotW=W-ML-MR, plotH=H-MT-MB;
  const xs = provinces.map(p=>p.pct_60plus);
  const ys = provinces.map(p=> cfg.sqrt ? Math.sqrt(p[currentY]) : p[currentY]);
  const xMin=Math.min(...xs)-2, xMax=Math.max(...xs)+2;
  const yMin= cfg.sqrt ? 0 : Math.min(...ys)-Math.abs(Math.min(...ys))*0.1-0.2;
  const yMax=Math.max(...ys)*1.06;
  const xRef = xs.reduce((a,b)=>a+b,0)/xs.length;
  const yRawRef = provinces.map(p=>p[currentY]).reduce((a,b)=>a+b,0)/provinces.length;
  const yRef = cfg.sqrt ? Math.sqrt(yRawRef) : yRawRef;
  function px(v){ return ML + (v-xMin)/(xMax-xMin)*plotW; }
  function py(v){ return MT + plotH - (v-yMin)/(yMax-yMin)*plotH; }
  const xRefPx = px(xRef), yRefPx = py(yRef);

  let svg = `<svg viewBox="0 0 ${W} ${H}">`;
  svg += `<rect x="${xRefPx}" y="${MT}" width="${ML+plotW-xRefPx}" height="${yRefPx-MT}" fill="#FCEDEA" opacity="0.6"/>`;
  svg += `<rect x="${ML}" y="${MT}" width="${xRefPx-ML}" height="${yRefPx-MT}" fill="#FFF7E8" opacity="0.6"/>`;
  svg += `<rect x="${xRefPx}" y="${yRefPx}" width="${ML+plotW-xRefPx}" height="${MT+plotH-yRefPx}" fill="#F0F4F8" opacity="0.5"/>`;
  svg += `<rect x="${ML}" y="${yRefPx}" width="${xRefPx-ML}" height="${MT+plotH-yRefPx}" fill="#EFF3EF" opacity="0.5"/>`;

  svg += `<line x1="${ML}" y1="${MT}" x2="${ML}" y2="${MT+plotH}" stroke="#C9A15A" stroke-width="1"/>`;
  svg += `<line x1="${ML}" y1="${MT+plotH}" x2="${ML+plotW}" y2="${MT+plotH}" stroke="#C9A15A" stroke-width="1"/>`;
  svg += `<line x1="${xRefPx}" y1="${MT}" x2="${xRefPx}" y2="${MT+plotH}" stroke="#8A2A2E" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>`;
  svg += `<line x1="${ML}" y1="${yRefPx}" x2="${ML+plotW}" y2="${yRefPx}" stroke="#8A2A2E" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>`;

  svg += `<text x="${ML+8}" y="${MT+16}" class="quad-label" fill="#C97B1D">อายุน้อย + ${cfg.hi}: เฝ้าระวัง</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+16}" class="quad-label" fill="#6b342a">อายุเยอะ + ${cfg.hi}: เร่งด่วนที่สุด</text>`;
  svg += `<text x="${ML+8}" y="${MT+plotH-8}" class="quad-label" fill="#3D5245">อายุน้อย + ${cfg.lo}: สบายใจได้</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+plotH-8}" class="quad-label" fill="#6b342a">อายุเยอะ + ${cfg.lo}: ดูแลตามปกติ</text>`;

  provinces.forEach(p=>{
    const yv = cfg.sqrt ? Math.sqrt(p[currentY]) : p[currentY];
    const cx=px(p.pct_60plus), cy=py(yv);
    const highX = p.pct_60plus>=xRef, highY = p[currentY]>=yRawRef;
    const color = (highX&&highY) ? '#8A2A2E' : (highX||highY) ? '#C97B1D' : '#4F6B58';
    svg += `<circle class="quad-dot" cx="${cx}" cy="${cy}" r="5" fill="${color}" fill-opacity="0.78" stroke="#FFFDF8" stroke-width="1"><title>${p.name}\nอายุ 60+: ${p.pct_60plus}%\nป่วยร่วม: ${p.pct_multi}%\nจำนวนพระ: ${p.n.toLocaleString()} รูป\nมรณภาพเพิ่ม: ${p.mort_growth} เท่า</title></circle>`;
  });

  svg += `<text x="${ML+plotW/2}" y="${H-28}" text-anchor="middle" class="quad-tag">% พระสงฆ์อายุ 60 ปีขึ้นไป — แกนหลัก</text>`;
  svg += `<text x="${ML}" y="${H-10}" text-anchor="start" class="quad-endlabel">น้อย</text>`;
  svg += `<text x="${ML+plotW}" y="${H-10}" text-anchor="end" class="quad-endlabel">มาก →</text>`;

  svg += `<text x="16" y="${MT+plotH/2}" text-anchor="middle" class="quad-tag" transform="rotate(-90 16 ${MT+plotH/2})">${cfg.label}</text>`;
  svg += `<text x="${ML-6}" y="${MT+plotH-2}" text-anchor="end" class="quad-endlabel">น้อย</text>`;
  svg += `<text x="${ML-6}" y="${MT+10}" text-anchor="end" class="quad-endlabel">มาก ↑</text>`;
  svg += `</svg>`;
  document.getElementById('quadrantPriority').innerHTML = svg;

  const groups = {
    urgent: { title: `อายุเยอะ + ${cfg.hi}: เร่งด่วนที่สุด`, bg: '#FCEDEA', items: [] },
    care:   { title: `อายุเยอะ + ${cfg.lo}: ดูแลตามปกติ`, bg: '#FFF7E8', items: [] },
    watch:  { title: `อายุน้อย + ${cfg.hi}: เฝ้าระวัง`, bg: '#F0F4F8', items: [] },
    fine:   { title: `อายุน้อย + ${cfg.lo}: สบายใจได้`, bg: '#EFF3EF', items: [] },
  };
  provinces.forEach(p=>{
    const highX = p.pct_60plus>=xRef, highY = p[currentY]>=yRawRef;
    if(highX&&highY) groups.urgent.items.push(p);
    else if(highX&&!highY) groups.care.items.push(p);
    else if(!highX&&highY) groups.watch.items.push(p);
    else groups.fine.items.push(p);
  });
  let sumHtml='';
  Object.values(groups).forEach(g=>{
    g.items.sort((a,b)=> b.pct_60plus - a.pct_60plus);
    const list = g.items.map(p=>`${p.name} <b>(อายุ60+ ${p.pct_60plus}%, ${cfg.label} ${p[currentY]}${cfg.unit})</b>`).join(', ');
    sumHtml += `<div class="quad-summary-card" style="background:${g.bg};">
      <h5 style="color:var(--maroon-800);">${g.title}</h5>
      <div class="cnt">${g.items.length} จังหวัด</div>
      <div class="plist">${list || '<i>ไม่มีจังหวัดในกลุ่มนี้</i>'}</div>
    </div>`;
  });
  document.getElementById('quadSummaryPriority').innerHTML = sumHtml;
  document.getElementById('priorityTip').innerHTML = `แต่ละจุด = 1 จังหวัด (${provinces.length} จุด) &nbsp;·&nbsp; แกนนอน = % อายุ 60+ เสมอ &nbsp;·&nbsp; แกนตั้งตอนนี้ = <b style="color:var(--maroon-800);">${cfg.label}</b> &nbsp;·&nbsp; วางเมาส์บนจุดเพื่อดูรายละเอียด`;
}

document.getElementById('priorityYChips').addEventListener('click', (e)=>{
  const btn = e.target.closest('.metric-chip');
  if(!btn) return;
  document.querySelectorAll('#priorityYChips .metric-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  currentY = btn.dataset.y;
  renderPriorityQuadrant();
});
renderPriorityQuadrant();

// generic UI wiring
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
