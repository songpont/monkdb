/* Section: source/เจาะลึกข้อมูลสุขภาพพระสงฆ์_รอบ2.html */

import {
  animateFadeIn, animateBars, animateGapBars, animateCounters, animateGrpBars,
  trackObserver, trackRaf, teardownAnimations
} from './utils.js';
import {
  NATIONAL_BG as S_NATIONAL_BG,
  PROVINCE_BG as S_PROVINCE_BG,
  REGION_AGE_DATA as S_REGION_AGE_DATA
} from './data/data-burden.js';
import { loadBurden } from './api.js';
import { mountYearTabs, mountYearNote } from './year-tabs.js';
import { renderYearCompare } from './year-compare.js';

const YEARS = [2568, 2567];
let NATIONAL_BG = S_NATIONAL_BG;
let PROVINCE_BG = S_PROVINCE_BG;
let REGION_AGE_DATA = S_REGION_AGE_DATA;
let currentYear = 2568;

function onYearChange(container, y) { currentYear = y; teardownAnimations(); render(container); }

export async function render(container) {
  if (currentYear === 'compare') return renderCompareView(container);
  container.innerHTML = `

<header class="hero">
  <div class="hero-inner">
    <p class="eyebrow" style="color:var(--saffron-500);">Round 2 · Cross-tab เชิงประชากร × โรค</p>
    <h1>เจาะลึกข้อมูลสุขภาพพระสงฆ์:<br><span>อายุ สถานะ และอายุขณะบวช ส่งผลต่อโรคอย่างไร</span></h1>
    <p>ต่อยอดจากรอบที่ 1 (คลัสเตอร์+มิติพื้นที่) มาเจาะลึกตัวแปรประชากร — อายุ สถานะ (สามเณร/พระภิกษุ) อายุขณะบวช และกลุ่มโรคจิตเวช/สารเสพติด — ว่าแต่ละตัวแปรอธิบายความเสี่ยงโรคต่างกันอย่างไร</p>
    <div class="badge-row">
      <span class="badge">Age × Status Cross-tab</span>
      <span class="badge">Age-adjusted Comparison</span>
      <span class="badge">Ordination Cohort</span>
      <span class="badge">Mental Health & Substance Use</span>
    </div>
  </div>
</header>

<!-- ============ INTRO ============ -->
<section id="intro">
  <div class="sec-head fade-in">
    <p class="eyebrow">วิธีการวิเคราะห์รอบนี้</p>
    <h2>ทำไมต้องแยกตัวแปรประชากรออกจากกัน</h2>
    <p>รอบที่ 1 บอกว่า "กลุ่มไหน" และ "ที่ไหน" มีปัญหา รอบนี้เจาะว่า "ทำไม" — โดยเฉพาะระวังไม่ให้ตัวแปรอายุ (ซึ่งเป็นปัจจัยที่ทรงพลังที่สุด) มาบดบังผลของตัวแปรอื่น เช่น สถานะ หรือช่วงอายุที่บวช</p>
    <div class="divider"></div>
  </div>
  <div class="info-callout fade-in">
    <div class="ic"></div>
    <p><b>ข้อควรระวังหลักของรอบนี้ — อย่าให้ "อายุ" มาหลอกเรา:</b> ถ้าไม่ระวัง เราอาจสรุปผิดได้ง่ายๆ เช่น "คนบวชตอนโตป่วยเยอะกว่า" ที่จริงอาจไม่เกี่ยวกับตอนบวชเลย แค่เพราะคนกลุ่มนั้นบังเอิญอายุเยอะกว่าตอนนี้เฉยๆ (คนแก่ก็ป่วยเยอะกว่าคนหนุ่มเป็นธรรมดาอยู่แล้ว) — ทุกการวิเคราะห์ในหน้านี้จะบอกให้ชัดว่าได้ตัดปัญหานี้ออกไปหรือยัง</p>
  </div>
</section>

<!-- ============ ITEM 1: AGE x STATUS ============ -->
<section id="agestatus">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 1</p>
    <h2>ความชุกโรค × อายุ × สถานะ (สามเณร vs พระภิกษุ)</h2>
    <p>เทียบรูปแบบโรคของสามเณรกับพระภิกษุในช่วงอายุเดียวกัน เพื่อดูว่าสถานะมีผลอิสระจากอายุหรือไม่</p>
    <div class="divider"></div>
  </div>

  <div class="card fade-in">
    <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">ความดันโลหิตสูง (I10) ตามช่วงอายุและสถานะ</h4>
    <div class="grp-legend">
      <span><i style="background:var(--sage);"></i>สามเณร</span>
      <span><i style="background:var(--saffron-600);"></i>พระภิกษุ</span>
    </div>
    <div class="grp-bar-chart" id="ageStatusChart">
      <div class="grp-col"><div class="grp-bar-pair">
        <div class="grp-bar novice" data-h="0.75"><span class="v">0.3%</span></div>
        <div class="grp-bar monk" data-h="31"><span class="v">12.4%</span></div>
      </div><div class="glbl">อายุ &lt;20</div></div>
      <div class="grp-col"><div class="grp-bar-pair">
        <div class="grp-bar novice" data-h="2.25"><span class="v">0.9%</span></div>
        <div class="grp-bar monk" data-h="11.5"><span class="v">4.6%</span></div>
      </div><div class="glbl">20–39</div></div>
      <div class="grp-col"><div class="grp-bar-pair">
        <div class="grp-bar novice" data-h="35.75"><span class="v">14.3%</span></div>
        <div class="grp-bar monk" data-h="36.75"><span class="v">14.7%</span></div>
      </div><div class="glbl">40–59</div></div>
      <div class="grp-col"><div class="grp-bar-pair">
        <div class="grp-bar novice" data-h="100"><span class="v">40.0%</span></div>
        <div class="grp-bar monk" data-h="85.25"><span class="v">34.1%</span></div>
      </div><div class="glbl">60+</div></div>
    </div>
    <p style="font-size:.76rem; color:var(--sage); margin-top:1rem; margin-bottom:0;">มาตราส่วนเทียบกับค่าสูงสุด 40.0% (สามเณร 60+) — เพื่อให้เห็นรูปร่างการเติบโตตามอายุชัดเจน</p>
    <div class="caveat-note"><b>ข้อควรระวัง:</b> สามเณรอายุ 40-59 (n=70) และ 60+ (n=30) มีจำนวนน้อยมาก ตัวเลขจึงแกว่งง่าย ควรตีความอย่างระมัดระวัง ต่างจากพระภิกษุที่มีฐานข้อมูลใหญ่กว่ามากในทุกช่วงอายุ</div>
    <div class="method-note">
      <div class="row"><b>สมมติฐาน:</b> รูปแบบโรคของสามเณรกับพระภิกษุน่าจะต่างกัน แม้อายุเท่ากัน เพราะวิถีชีวิต (สามเณรมักเรียนหนังสือ กิจกรรมต่างจากพระภิกษุ)</div>
      <div class="row"><b>วิธีวิเคราะห์:</b> แบ่งอายุเป็น 4 ช่วง (&lt;20, 20-39, 40-59, 60+) แล้วเทียบอัตราความดันโลหิตสูงระหว่าง 2 สถานะในช่วงอายุเดียวกัน</div>
      <div class="row"><b>พบว่า:</b> พระภิกษุอายุ &lt;20 (n=404) มีความดันสูงถึง 12.4% ซึ่งสูงผิดปกติสำหรับวัยนี้ — น่าจะเป็นกลุ่มบวชเร็วพิเศษที่มีความเสี่ยงสุขภาพมาก่อนบวช ควรตรวจสอบเพิ่มเติมไม่ด่วนสรุปว่าเป็นค่าปกติ</div>
    </div>
  </div>
</section>

<!-- ============ ITEM 2: REGION x AGE MULTIMORBIDITY (interactive) ============ -->
<section id="regionage">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 2</p>
    <h2>ป่วยร่วม × อายุ × เขตสุขภาพ — แตะเพื่อดูรายเขต</h2>
    <p>แตะเขตสุขภาพเพื่อดูว่าสัดส่วนป่วยร่วม ≥2 โรค ในแต่ละช่วงอายุของเขตนั้น สูง/ต่ำกว่าค่าเฉลี่ยประเทศอย่างไร (เส้นสีแดงเข้ม = ค่าเฉลี่ยประเทศในช่วงอายุเดียวกัน)</p>
    <div class="divider"></div>
  </div>

  <div class="card fade-in">
    <div class="region-grid" id="regionGrid2"></div>
    <div class="region-detail">
      <div class="rd-head">
        <h4 id="rdTitle2">เขต 1 (เหนือบน)</h4>
        <div class="rd-n" id="rdN2"></div>
      </div>
      <div class="age-compare-chart" id="ageCompareChart"></div>
    </div>

    <div style="margin-top:2rem; padding-top:1.8rem; border-top:1px dashed var(--parchment-deep);">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">มองทีเดียวจบ: จังหวัดไหน "ป่วยหนักตอนนี้" และจังหวัดไหน "กำลังจะแย่ลงเร็ว"</h4>

      <div class="info-callout" style="margin-bottom:1.2rem; display:block;">
        <p style="margin:0 0 .3rem; font-weight:700; color:var(--maroon-800);">วิธีคิด (ทำทีละขั้น):</p>
        <ol class="step-list">
          <li>เอาพระสงฆ์ใน<b style="color:var(--maroon-800);">แต่ละจังหวัด</b>มาแบ่งเป็น 3 กลุ่มตามอายุ: ต่ำกว่า 40 ปี, 40-59 ปี, 60 ปีขึ้นไป</li>
          <li>ดูกลุ่ม <b style="color:var(--maroon-800);">"อายุ 60+"</b> ว่ามีกี่ % ที่ป่วยร่วมหลายโรค → ตัวเลขนี้คือ <b>"ป่วยหนักตอนนี้"</b> (แกนนอนของกราฟ)</li>
          <li>ดูกลุ่ม <b style="color:var(--maroon-800);">"อายุต่ำกว่า 40"</b> ว่ามีกี่ % ที่ป่วยร่วมหลายโรค เหมือนกัน</li>
          <li>เอาตัวเลขข้อ 2 <b>ลบ</b> ตัวเลขข้อ 3 → ผลลบที่ได้คือ <b>"ทรุดเร็วแค่ไหน"</b> (แกนตั้งของกราฟ) — ถ้าค่านี้สูง แปลว่าพอแก่ตัวลงป่วยเพิ่มขึ้นเยอะ ถ้าค่านี้ต่ำ แปลว่าไม่ค่อยต่างจากตอนหนุ่มเท่าไหร่</li>
        </ol>
        <div class="worked-example">
          <b>ตัวอย่างจริงระดับประเทศ:</b> พระอายุต่ำกว่า 40 ทั่วประเทศป่วยร่วม 4.7% แต่พระอายุ 60+ ป่วยร่วมถึง 38.0% → เอา 38.0 ลบ 4.7 = <b>33.3</b> (นี่คือ "ทรุดเร็วแค่ไหน" ของค่าเฉลี่ยประเทศ ที่ใช้เป็นเส้นแบ่งกลางกราฟ) ถ้าจังหวัดไหนได้เลขมากกว่า 33.3 แปลว่าจังหวัดนั้น "ทรุดเร็วกว่า" ค่าเฉลี่ยประเทศ
        </div>
        <p style="margin:.9rem 0 0; font-size:.86rem;"><b style="color:var(--maroon-800);">ลองกดปุ่มด้านล่างเพื่อเปลี่ยนเกณฑ์ "ป่วยร่วม"</b> (เช่น เปลี่ยนจาก "อย่างน้อย 2 โรค" เป็น "อย่างน้อย 5 โรค") แล้วดูกราฟที่เปลี่ยนไปได้เลย — ใช้เฉพาะ 76 จังหวัดที่มีข้อมูลพระสงฆ์มากพอในทุกช่วงอายุ (ตัดยะลาออกเพราะมีข้อมูลน้อยเกินไปจนตัวเลขไม่น่าเชื่อถือ)</p>
      </div>

      <div class="metric-chip-row" id="multiThresholdChips2" style="justify-content:center;">
        <button class="metric-chip active" data-k="2">ป่วยร่วม ≥ 2 โรค</button>
        <button class="metric-chip" data-k="3">ป่วยร่วม ≥ 3 โรค</button>
        <button class="metric-chip" data-k="4">ป่วยร่วม ≥ 4 โรค</button>
        <button class="metric-chip" data-k="5">ป่วยร่วม ≥ 5 โรค</button>
      </div>

      <div class="simple-tip" id="quadTip2">แต่ละจุด = 1 จังหวัด (76 จุด) &nbsp;·&nbsp; ยิ่งอยู่ขวา ยิ่งป่วยหนักตอนนี้ (คนอายุ 60+) &nbsp;·&nbsp; ยิ่งอยู่สูง ยิ่งทรุดเร็วตอนแก่ (เทียบตอนหนุ่ม)</div>
      <div class="quadrant-wrap" id="quadrantWrap2"></div>
      <div class="quad-summary" id="quadSummary2"></div>
    </div>

    <div class="method-note">
      <div class="row"><b>ตั้งข้อสงสัยว่า:</b> อายุที่มากขึ้นอาจทำให้ป่วยเยอะขึ้นเร็ว-ช้าไม่เท่ากันในแต่ละจังหวัด บางที่อาจ "ป่วยเร็ว" กว่าที่อื่นทั้งที่ตอนหนุ่มดูปกติดี</div>
      <div class="row"><b>ทำยังไง:</b> แบ่งพระสงฆ์เป็น 3 ช่วงอายุในแต่ละจังหวัด แล้วนับ % คนป่วยหลายโรคพร้อมกัน เทียบกับค่าเฉลี่ยทั้งประเทศในช่วงอายุเดียวกัน (นับจากทั้ง 30 โรคเหมือนกราฟรอบที่ 1)</div>
      <div class="row"><b>ได้คำตอบว่า:</b> จังหวัดที่อยู่มุม "เบาตอนนี้แต่ทรุดเร็ว" คือกลุ่มที่น่าเป็นห่วงที่สุด เพราะตอนนี้ดูเหมือนไม่มีปัญหา แต่แนวโน้มจะแย่ลงเร็วกว่าที่อื่นเมื่อพระในจังหวัดนั้นอายุมากขึ้น ควรป้องกันตั้งแต่วันนี้ก่อนกลายเป็นปัญหาหนักในอนาคต</div>
    </div>
  </div>
</section>




<!-- ============ ITEM 3: ORDINATION AGE ============ -->
<section id="ordination">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 3</p>
    <h2>อายุขณะบวช × ชนิดโรค — บวชตอนโตเสี่ยงกว่าจริงหรือแค่อายุมากกว่า</h2>
    <p>เปรียบเทียบพระภิกษุ 4 กลุ่มตามอายุขณะบวช ด้วย 2 วิธี: แบบเทียบตรงๆ (ยังปนเรื่องอายุอยู่ ทำให้เข้าใจผิดได้) และแบบตัดปัญหาเรื่องอายุออก (เทียบเฉพาะคนที่ตอนนี้อายุ 60+ เหมือนกันหมด)</p>
    <div class="divider"></div>
  </div>

  <div class="two-col fade-in">
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">แบบเทียบตรงๆ — ยังปนเรื่องอายุอยู่ (เข้าใจผิดได้ง่าย)</h4>
      <div class="note">อายุปัจจุบันเฉลี่ยของแต่ละกลุ่มต่างกันมาก (51.0 ถึง 68.8 ปี) — ห้ามสรุปเหตุ-ผลจากกราฟนี้ตรงๆ</div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยเยาว์ (&lt;20) — อายุเฉลี่ยปัจจุบัน 51.0</span><span>17.3%</span></div><div class="bar-track"><div class="bar-fill" data-w="49"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยหนุ่ม (20-25) — อายุเฉลี่ยปัจจุบัน 58.5</span><span>24.2%</span></div><div class="bar-track"><div class="bar-fill" data-w="69"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยกลางคน (26-35) — อายุเฉลี่ยปัจจุบัน 60.6</span><span>25.1%</span></div><div class="bar-track"><div class="bar-fill" data-w="71"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยผู้ใหญ่ตอนปลาย (36+) — อายุเฉลี่ยปัจจุบัน 68.8</span><span>35.2%</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
      <p style="font-size:.72rem; color:var(--sage); margin-top:.6rem; margin-bottom:0;">ตัวเลข = % ความดันโลหิตสูง (I10)</p>
    </div>
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">แบบตัดเรื่องอายุออก — เทียบเฉพาะคนอายุ 60+ ด้วยกัน</h4>
      <div class="note">เปรียบเทียบที่เป็นธรรมกว่า: ทุกกลุ่มปัจจุบันอายุ 60 ปีขึ้นไปเหมือนกัน ต่างกันแค่ "อายุตอนที่ตัดสินใจบวช"</div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยเยาว์ (&lt;20), n=25,150</span><span>33.0%</span></div><div class="bar-track"><div class="bar-fill" data-w="89"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยหนุ่ม (20-25), n=4,920</span><span>35.8%</span></div><div class="bar-track"><div class="bar-fill" data-w="96"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยกลางคน (26-35), n=6,259</span><span>35.2%</span></div><div class="bar-track"><div class="bar-fill" data-w="95"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>บวชวัยผู้ใหญ่ตอนปลาย (36+), n=10,961</span><span>37.1%</span></div><div class="bar-track"><div class="bar-fill" data-w="100"></div></div></div>
      <p style="font-size:.72rem; color:var(--sage); margin-top:.6rem; margin-bottom:0;">ตัวเลข = % ความดันโลหิตสูง (I10) เฉพาะกลุ่มอายุปัจจุบัน 60+</p>
    </div>
  </div>
  <div class="method-note fade-in">
    <div class="row"><b>สมมติฐาน:</b> ผู้ที่บวชตอนโต (เช่น หลังเกษียณ/เปลี่ยนวิถีชีวิต) น่าจะพกพาความเสี่ยงสุขภาพจากชีวิตฆราวาสมาด้วยมากกว่าผู้ที่บวชตั้งแต่เด็ก</div>
    <div class="row"><b>วิธีวิเคราะห์:</b> เปรียบเทียบ 2 แบบคือดิบ (n=119,174 ทั้งหมด) และควบคุมอายุ (จำกัดเฉพาะอายุปัจจุบัน 60+ เพื่อตัดผลของอายุปัจจุบันออก)</div>
    <div class="row"><b>พบว่า:</b> หลังควบคุมอายุแล้ว ผลต่างเล็กลงมากแต่ยังคงอยู่ (33.0% เทียบ 37.1%) — ยืนยันว่าอายุขณะบวชมีผลอิสระจริง แม้จะไม่มากเท่าที่ตัวเลขดิบแสดง</div>
  </div>
</section>

<!-- ============ ITEM 4: PSYCH / SUBSTANCE ============ -->
<section id="psych">
  <div class="sec-head fade-in">
    <p class="eyebrow">ข้อ 4</p>
    <h2>กลุ่มโรคจิตเวช/สารเสพติด × อายุ × จังหวัด</h2>
    <p>วิเคราะห์แอลกอฮอล์ (F10), สารกระตุ้นอื่นๆ (F15) และซึมเศร้า (F32) แยกตามอายุและพื้นที่ — ต่างจากโรคเมตาบอลิกตรงที่ไม่ได้เพิ่มตามอายุเสมอไป</p>
    <div class="divider"></div>
  </div>

  <div class="two-col fade-in">
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">ความชุกตามช่วงอายุ (ทั่วประเทศ)</h4>
      <div class="note">สังเกตว่า F15 และ F10 ลดลงตามอายุ ต่างจากโรคเมตาบอลิกที่เพิ่มขึ้นเรื่อยๆ</div>
      <div class="bar-row"><div class="lbl"><span>สุรา (F10) — อายุ &lt;30</span><span>0.21%</span></div><div class="bar-track"><div class="bar-fill" data-w="15"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>สุรา (F10) — อายุ 30-39</span><span>0.65%</span></div><div class="bar-track"><div class="bar-fill" data-w="47"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>สุรา (F10) — อายุ 40-59</span><span>0.62%</span></div><div class="bar-track"><div class="bar-fill" data-w="45"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>สุรา (F10) — อายุ 60+</span><span>0.25%</span></div><div class="bar-track"><div class="bar-fill" data-w="18"></div></div></div>
      <div style="height:.6rem;"></div>
      <div class="bar-row"><div class="lbl"><span>สารกระตุ้นอื่น (F15) — อายุ &lt;30</span><span>1.04%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="75"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>สารกระตุ้นอื่น (F15) — อายุ 30-39</span><span>1.39%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="100"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>สารกระตุ้นอื่น (F15) — อายุ 40-59</span><span>0.60%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="43"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>สารกระตุ้นอื่น (F15) — อายุ 60+</span><span>0.08%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,var(--sage),var(--sage-light));" data-w="6"></div></div></div>
      <div style="height:.6rem;"></div>
      <div class="bar-row"><div class="lbl"><span>ซึมเศร้า (F32) — อายุ &lt;30</span><span>0.47%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,#8A2A2E,#B45B5F);" data-w="34"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>ซึมเศร้า (F32) — อายุ 30-39</span><span>0.63%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,#8A2A2E,#B45B5F);" data-w="45"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>ซึมเศร้า (F32) — อายุ 40-59</span><span>0.48%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,#8A2A2E,#B45B5F);" data-w="35"></div></div></div>
      <div class="bar-row"><div class="lbl"><span>ซึมเศร้า (F32) — อายุ 60+</span><span>0.55%</span></div><div class="bar-track"><div class="bar-fill" style="background:linear-gradient(90deg,#8A2A2E,#B45B5F);" data-w="40"></div></div></div>
    </div>
    <div class="card">
      <h4 style="color:var(--maroon-800); margin-bottom:.3rem;">10 จังหวัดที่มีอัตราวินิจฉัยสูงสุด</h4>
      <div class="note">รวม F10+F15+F32 อย่างน้อย 1 อย่าง เฉพาะจังหวัดที่มีพระ ≥200 รูป · ค่าเฉลี่ยประเทศ 1.4%</div>
      <table class="data-table">
        <thead><tr><th>จังหวัด</th><th style="text-align:right;">จำนวนพระ</th><th style="text-align:right;">อัตรา</th></tr></thead>
        <tbody>
          <tr class="highlight"><td>อุทัยธานี</td><td class="num">743</td><td class="num">3.77%</td></tr>
          <tr><td>ตรัง</td><td class="num">562</td><td class="num">2.85%</td></tr>
          <tr><td>บุรีรัมย์</td><td class="num">3,460</td><td class="num">2.49%</td></tr>
          <tr><td>กาฬสินธุ์</td><td class="num">2,978</td><td class="num">2.45%</td></tr>
          <tr><td>สกลนคร</td><td class="num">4,831</td><td class="num">2.42%</td></tr>
          <tr><td>อ่างทอง</td><td class="num">1,081</td><td class="num">2.31%</td></tr>
          <tr><td>พิษณุโลก</td><td class="num">3,315</td><td class="num">2.26%</td></tr>
          <tr><td>สิงห์บุรี</td><td class="num">285</td><td class="num">2.11%</td></tr>
        </tbody>
      </table>
      <div class="caveat-note">อุทัยธานีสูงผิดปกติ (2.7 เท่าค่าเฉลี่ย) จาก n เพียง 743 รูป — อาจเกิดจากมีสถานพยาบาล/ศูนย์บำบัดเฉพาะทางในพื้นที่ทำให้มีการวินิจฉัย/ส่งต่อกระจุกตัว ไม่ใช่ความชุกที่แท้จริงในชุมชนสูงขนาดนั้นเสมอไป ควรตรวจสอบก่อนใช้อ้างอิง</div>
    </div>
  </div>
  <div class="method-note fade-in">
    <div class="row"><b>สมมติฐาน:</b> โรคจิตเวช/สารเสพติดน่าจะพบมากในพระอายุน้อย (ผลจากพฤติกรรมก่อนบวช) มากกว่าพระสูงอายุ ต่างจากโรคเมตาบอลิกที่เพิ่มตามอายุ</div>
    <div class="row"><b>วิธีวิเคราะห์:</b> คำนวณความชุก F10/F15/F32 แยกตาม 4 ช่วงอายุ และจัดอันดับจังหวัด (n≥200) ตามอัตรารวมของทั้ง 3 กลุ่ม</div>
    <div class="row"><b>พบว่า:</b> F15 และ F10 สอดคล้องสมมติฐาน (สูงสุดช่วง 30-39 แล้วลดลงต่อเนื่อง) แต่ F32 (ซึมเศร้า) ไม่ลดลงตามอายุ กลับสูงขึ้นอีกครั้งในกลุ่ม 60+ — สะท้อนว่าสุขภาพจิตผู้สูงอายุเป็นปัญหาที่แยกจากสารเสพติด ต้องมีโปรแกรมเฉพาะ</div>
  </div>
</section>

<!-- ============ POLICY SUMMARY ============ -->
<section id="policy">
  <div class="sec-head fade-in">
    <p class="eyebrow">สรุปผล</p>
    <h2>ทางเลือกเชิงนโยบายจากการวิเคราะห์รอบที่ 2</h2>
    <p>ประเด็นสำคัญที่พบและข้อเสนอเชิงปฏิบัติ เชื่อมกับแผนขับเคลื่อน 5 แผนของธรรมนูญสุขภาพพระสงฆ์ฯ</p>
    <div class="divider"></div>
  </div>
  <div class="card fade-in">
    <ul class="impl-list">
      <li><b>พระภิกษุอายุน้อยกลุ่มเล็กที่มีความดันสูงผิดปกติ (12.4% ใน &lt;20 ปี)</b> ควรได้รับการตรวจสุขภาพก่อนบวชอย่างละเอียด ไม่ใช่สันนิษฐานว่าอายุน้อยแล้วสุขภาพดีเสมอ (แผนที่ 1)</li>
      <li><b>ช่วงอายุ 40-59 คือจุดที่ความต่างระหว่างเขตสุขภาพชัดเจนที่สุด</b> — ควรเร่งคัดกรองเชิงรุกในพระอายุ 40-59 ปีของเขต 1-6 (เหนือ/กลาง) ก่อนที่จะเข้าสู่วัยที่ป่วยหนักแบบเขต 60+ ทั่วประเทศ (แผนที่ 1, 3)</li>
      <li><b>โปรแกรมเตรียมพร้อมก่อนบวชสำหรับผู้บวชวัยผู้ใหญ่ตอนปลาย (36+)</b> ควรมีการคัดกรองโรคเมตาบอลิกตั้งแต่ต้น เพราะแม้ควบคุมอายุแล้วยังมีความเสี่ยงสูงกว่ากลุ่มบวชตั้งแต่เด็ก (แผนที่ 1, 3)</li>
      <li><b>แยกโปรแกรมสุขภาพจิต 2 ชุดตามกลุ่มอายุ</b> — กลุ่มอายุน้อย/กลางคนเน้นสารเสพติด (F10, F15) กลุ่มสูงอายุเน้นซึมเศร้า (F32) ซึ่งไม่ได้ลดลงตามอายุเหมือนกลุ่มอื่น (แผนที่ 3, 4)</li>
      <li><b>ตรวจสอบข้อมูลจังหวัดที่มีอัตราสูงผิดปกติจาก n น้อย</b> (เช่น อุทัยธานี) ก่อนนำไปใช้จัดสรรทรัพยากร เพื่อแยกผล "สถานพยาบาลกระจุกตัว" ออกจาก "ความชุกที่แท้จริง" (แผนที่ 4, 5)</li>
    </ul>
  </div>
  <div class="info-callout fade-in" style="margin-top:1.6rem;">
    <div class="ic">→</div>
    <p>รอบที่ 2 นี้เป็นรอบที่ 2 จาก 3 ตามแผน รอบถัดไป (รอบที่ 3) จะเจาะลึกมิติเวลา/cohort (แนวโน้มการมรณภาพรายปี, cohort ตามปีบวช) และจัดทำ Priority Score ระดับจังหวัดที่ผสมน้ำหนักหลายปัจจัยสำหรับใช้จัดสรรทรัพยากรจริง</p>
  </div>
</section>

`;
  const { data, source } = await loadBurden({
    NATIONAL_BG: S_NATIONAL_BG, PROVINCE_BG: S_PROVINCE_BG, REGION_AGE_DATA: S_REGION_AGE_DATA
  }, currentYear);
  NATIONAL_BG = data.NATIONAL_BG;
  PROVINCE_BG = data.PROVINCE_BG;
  REGION_AGE_DATA = data.REGION_AGE_DATA;
  initBurden(container, source);
  if (source === 'd1') {
    mountYearTabs(container, {
      years: YEARS, current: currentYear, compare: true,
      onChange: (y) => onYearChange(container, y)
    });
  } else {
    mountYearNote(container, { year: currentYear, source });
  }
}

const BURDEN_STATUS = [
  { v: 'all', label: 'ทั้งหมด (พระภิกษุ + สามเณร)' },
  { v: 'monk', label: 'เฉพาะพระภิกษุ' },
  { v: 'novice', label: 'เฉพาะสามเณร' }
];

async function renderCompareView(container) {
  container.innerHTML = `
<header class="hero"><div class="hero-inner">
  <p class="eyebrow" style="color:var(--saffron-500);">ภาระโรค · เทียบรายปี</p>
  <h1>ป่วยร่วมหลายโรค × ช่วงอายุ<br><span>เทียบ พ.ศ. ๒๕๖๗ ↔ ๒๕๖๘ · เลือกสถานะได้</span></h1>
</div></header>
<section id="cmp"></section>`;

  mountYearTabs(container, {
    years: YEARS, current: 'compare', compare: true,
    onChange: (y) => onYearChange(container, y)
  });

  const cmp = container.querySelector('#cmp');
  let st = 'all';
  await load();
  animateFadeIn(container);

  async function load() {
    cmp.innerHTML = '<div class="route-loading">กำลังโหลดทั้งสองปี…</div>';
  const S = { NATIONAL_BG: S_NATIONAL_BG, PROVINCE_BG: S_PROVINCE_BG, REGION_AGE_DATA: S_REGION_AGE_DATA };
  const [nw, od] = await Promise.all([loadBurden(S, 2568, st), loadBurden(S, 2567, st)]);
  if (nw.source !== 'd1' || od.source !== 'd1') {
    cmp.innerHTML = '<div class="card">โหมดเทียบปีต้องใช้ข้อมูลจากฐานข้อมูลออนไลน์</div>';
    return;
  }

  const geos = [{ id: 'national|TH', label: 'ทั้งประเทศ' }];
  for (const rid in nw.data.REGION_AGE_DATA.regions)
    geos.push({ id: `region|${rid}`, label: nw.data.REGION_AGE_DATA.regions[rid].region_name });
  for (const p of Object.keys(nw.data.PROVINCE_BG)) geos.push({ id: `province|${p}`, label: `จังหวัด${p}` });

  const rowsFor = (D, geoId) => {
    const [lvl, id] = geoId.split('|');
    if (lvl === 'national') {
      const bg = D.NATIONAL_BG;
      return [
        { key: 'm2_<40', label: 'ป่วยร่วม ≥2 · อายุ <40', v: bg[2]?.['<40'] },
        { key: 'm2_40', label: 'ป่วยร่วม ≥2 · อายุ 40-59', v: bg[2]?.['40-59'] },
        { key: 'm2_60', label: 'ป่วยร่วม ≥2 · อายุ 60+', v: bg[2]?.['60+'] },
        { key: 'm3_60', label: 'ป่วยร่วม ≥3 · อายุ 60+', v: bg[3]?.['60+'] },
        { key: 'm4_60', label: 'ป่วยร่วม ≥4 · อายุ 60+', v: bg[4]?.['60+'] },
        { key: 'm5_60', label: 'ป่วยร่วม ≥5 · อายุ 60+', v: bg[5]?.['60+'] }
      ];
    }
    if (lvl === 'region') {
      const v = D.REGION_AGE_DATA.regions[id]?.vals || {};
      return [
        { key: 'm2_<40', label: 'ป่วยร่วม ≥2 · อายุ <40', v: v['<40'] },
        { key: 'm2_40', label: 'ป่วยร่วม ≥2 · อายุ 40-59', v: v['40-59'] },
        { key: 'm2_60', label: 'ป่วยร่วม ≥2 · อายุ 60+', v: v['60+'] }
      ];
    }
    const p = D.PROVINCE_BG[id] || {};
    return [
      { key: 'm2_60', label: 'ป่วยร่วม ≥2 · อายุ 60+', v: p.burden2 },
      { key: 'm3_60', label: 'ป่วยร่วม ≥3 · อายุ 60+', v: p.burden3 },
      { key: 'm4_60', label: 'ป่วยร่วม ≥4 · อายุ 60+', v: p.burden4 },
      { key: 'm5_60', label: 'ป่วยร่วม ≥5 · อายุ 60+', v: p.burden5 }
    ];
  };

  renderYearCompare(cmp, {
    yearOld: 2567, yearNew: 2568, geos, defaultGeo: 'national|TH', partial: true,
    getRows: (geoId) => {
      const N = rowsFor(nw.data, geoId), O = rowsFor(od.data, geoId);
      const om = Object.fromEntries(O.map((r) => [r.key, r.v]));
      return N.map((r) => ({ key: r.key, label: r.label, a: om[r.key] ?? null, b: r.v ?? null }));
    },
    note: "ระดับประเทศและเขตแสดงสัดส่วนป่วยร่วม ≥2 โรค แยกตามช่วงอายุ · ระดับจังหวัดแสดงป่วยร่วม ≥2 ถึง ≥5 โรค เฉพาะกลุ่มอายุ 60 ปีขึ้นไป"
  });

  const fr = cmp.querySelector('.filter-row');
  if (fr) {
    fr.insertAdjacentHTML('beforeend',
      `<label style="font-size:.82rem;font-weight:700;color:var(--maroon-800);margin-left:1rem;">สถานะ:
        <select class="yc-status">${BURDEN_STATUS.map((s) => `<option value="${s.v}"${s.v === st ? ' selected' : ''}>${s.label}</option>`).join('')}</select></label>`);
    fr.querySelector('.yc-status').addEventListener('change', (e) => { st = e.target.value; load(); });
  }
  }
}

function initBurden(container, source) {
  if (source === 'd1') {
    const br = container.querySelector('.badge-row');
    if (br) br.insertAdjacentHTML('beforeend', '<span class="badge">ข้อมูลสด</span>');
  }
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);

let currentK2 = 2;

function renderQuadrant2(){
  const bField = 'burden' + currentK2, gField = 'growth' + currentK2;
  const xRef = NATIONAL_BG[currentK2]['60+'];
  const yRef = NATIONAL_BG[currentK2]['60+'] - NATIONAL_BG[currentK2]['<40'];

  const all = Object.keys(PROVINCE_BG).map(name=>{
    const p = PROVINCE_BG[name];
    return { name, n: p.n, burden: p[bField], growth: p[gField] };
  }).filter(p=>p.burden!==null && p.growth!==null);

  const W=680,H=440,ML=55,MR=25,MT=25,MB=55;
  const plotW=W-ML-MR, plotH=H-MT-MB;
  const xs = all.map(p=>p.burden), ys = all.map(p=>p.growth);
  const xMin=Math.min(...xs)-2, xMax=Math.max(...xs)+2;
  const yMin=Math.min(...ys)-2, yMax=Math.max(...ys)+2;
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

  svg += `<text x="${ML+8}" y="${MT+16}" class="quad-label" fill="#C97B1D">เบาตอนนี้ + ทรุดเร็ว: ป้องกันไว้ก่อน!</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+16}" class="quad-label" fill="#6b342a">หนักตอนนี้ + ทรุดเร็ว: เร่งด่วนที่สุด</text>`;
  svg += `<text x="${ML+8}" y="${MT+plotH-8}" class="quad-label" fill="#3D5245">เบาตอนนี้ + ทรุดช้า: สบายใจได้</text>`;
  svg += `<text x="${xRefPx+8}" y="${MT+plotH-8}" class="quad-label" fill="#6b342a">หนักตอนนี้ + ทรุดช้า: ดูแลตามปกติ</text>`;

  all.forEach(p=>{
    const cx=px(p.burden), cy=py(p.growth);
    svg += `<circle class="quad-dot" cx="${cx}" cy="${cy}" r="5" fill="${p.burden>=xRef ? '#C97B1D':'#4F6B58'}" fill-opacity="0.75" stroke="#FFFDF8" stroke-width="1"><title>${p.name}\nพระสงฆ์ ${p.n.toLocaleString()} รูป\nป่วยหนักตอนแก่ (60+): ${p.burden}%\nทรุดเร็วแค่ไหน: ${p.growth.toFixed(1)} จุด</title></circle>`;
  });

  svg += `<text x="${ML+plotW/2}" y="${H-28}" text-anchor="middle" class="quad-tag">% ป่วยร่วม≥${currentK2}โรค ตอนอายุ 60+</text>`;
  svg += `<text x="${ML}" y="${H-10}" text-anchor="start" class="quad-endlabel">น้อย</text>`;
  svg += `<text x="${ML+plotW}" y="${H-10}" text-anchor="end" class="quad-endlabel">มาก →</text>`;

  svg += `<text x="16" y="${MT+plotH/2}" text-anchor="middle" class="quad-tag" transform="rotate(-90 16 ${MT+plotH/2})">ทรุดเร็วแค่ไหนเทียบตอนหนุ่ม</text>`;
  svg += `<text x="${ML-6}" y="${MT+plotH-2}" text-anchor="end" class="quad-endlabel">ช้า</text>`;
  svg += `<text x="${ML-6}" y="${MT+10}" text-anchor="end" class="quad-endlabel">เร็ว ↑</text>`;
  svg += `</svg>`;
  document.getElementById('quadrantWrap2').innerHTML = svg;
  document.getElementById('quadTip2').innerHTML = `แต่ละจุด = 1 จังหวัด (${all.length} จุด) &nbsp;·&nbsp; เกณฑ์ตอนนี้: ป่วยร่วม <b style="color:var(--maroon-800);">≥ ${currentK2} โรค</b> &nbsp;·&nbsp; ยิ่งอยู่ขวา ยิ่งป่วยหนักตอนนี้ &nbsp;·&nbsp; ยิ่งอยู่สูง ยิ่งทรุดเร็วตอนแก่`;

  const groups = {
    urgent: { title: 'หนักตอนนี้ + ทรุดเร็ว: เร่งด่วนที่สุด', bg: '#FCEDEA', items: [] },
    care:   { title: 'หนักตอนนี้ + ทรุดช้า: ดูแลตามปกติ', bg: '#FFF7E8', items: [] },
    prevent:{ title: 'เบาตอนนี้ + ทรุดเร็ว: ป้องกันไว้ก่อน!', bg: '#F0F4F8', items: [] },
    fine:   { title: 'เบาตอนนี้ + ทรุดช้า: สบายใจได้', bg: '#EFF3EF', items: [] },
  };
  all.forEach(p=>{
    const highBurden = p.burden >= xRef;
    const fastGrowth = p.growth >= yRef;
    if(highBurden && fastGrowth) groups.urgent.items.push(p);
    else if(highBurden && !fastGrowth) groups.care.items.push(p);
    else if(!highBurden && fastGrowth) groups.prevent.items.push(p);
    else groups.fine.items.push(p);
  });
  let sumHtml = '';
  Object.values(groups).forEach(g=>{
    g.items.sort((a,b)=> b.burden - a.burden);
    const list = g.items.map(p=>`${p.name} <b>(${p.burden}%)</b>`).join(', ');
    sumHtml += `<div class="quad-summary-card" style="background:${g.bg};">
      <h5 style="color:var(--maroon-800);">${g.title}</h5>
      <div class="cnt">${g.items.length} จังหวัด</div>
      <div class="plist">${list || '<i>ไม่มีจังหวัดในกลุ่มนี้</i>'}</div>
    </div>`;
  });
  document.getElementById('quadSummary2').innerHTML = sumHtml;
}

document.getElementById('multiThresholdChips2').addEventListener('click', (e)=>{
  const btn = e.target.closest('.metric-chip');
  if(!btn) return;
  document.querySelectorAll('#multiThresholdChips2 .metric-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  currentK2 = parseInt(btn.dataset.k);
  renderQuadrant2();
});

let currentRegion2 = 1;

function renderRegionGrid2(){
  const grid = document.getElementById('regionGrid2');
  grid.innerHTML = '';
  Object.keys(REGION_AGE_DATA.regions).forEach(rk=>{
    const r = parseInt(rk);
    const rd = REGION_AGE_DATA.regions[rk];
    const el = document.createElement('div');
    el.className = 'region-card' + (r===currentRegion2 ? ' active' : '');
    const shortName = r===13 ? 'กทม.' : ('เขต ' + r);
    el.innerHTML = `<div class="rn">${shortName}</div><div class="rl">${rd.region_name.replace(/^เขต \d+ ?/,'').replace(/[()]/g,'')}</div><div class="rv">${rd.vals['60+']}% (60+)</div>`;
    el.addEventListener('click', ()=>{ currentRegion2 = r; renderRegionGrid2(); renderAgeCompare(); });
    grid.appendChild(el);
  });
}

function renderAgeCompare(){
  const rd = REGION_AGE_DATA.regions[currentRegion2];
  const nat = REGION_AGE_DATA.national;
  document.getElementById('rdTitle2').textContent = rd.region_name;
  const totalN = Object.values(rd.n).reduce((a,b)=>a+b,0);
  document.getElementById('rdN2').textContent = `พระสงฆ์ ${totalN.toLocaleString()} รูปที่ทราบอายุในเขตนี้`;

  const bands = ['<40','40-59','60+'];
  const maxVal = 50;
  const chart = document.getElementById('ageCompareChart');
  chart.innerHTML = '';
  bands.forEach(b=>{
    const val = rd.vals[b];
    const natVal = nat[b];
    const col = document.createElement('div');
    col.className = 'acc-col';
    const barH = Math.min(100, (val/maxVal*100));
    const natH = Math.min(100, (natVal/maxVal*100));
    col.innerHTML = `<div class="acc-bar" data-h="${barH}"><span class="v">${val}%</span><div class="nat-mark" style="bottom:${natH}%;" title="ค่าเฉลี่ยประเทศ ${natVal}%"></div></div><div class="al">อายุ ${b}</div><div class="an">n=${rd.n[b].toLocaleString()}</div>`;
    chart.appendChild(col);
  });
  requestAnimationFrame(()=>{
    document.querySelectorAll('.acc-bar').forEach(b=>{ b.style.height = b.dataset.h + '%'; });
  });
}

renderRegionGrid2();
renderAgeCompare();
renderQuadrant2();

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

const grpBars = document.querySelectorAll('.grp-bar');
const grpObs = trackObserver(new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.height = e.target.dataset.h + '%'; grpObs.unobserve(e.target); }
  });
}, {threshold:.3}));
grpBars.forEach(b=>grpObs.observe(b));

}
