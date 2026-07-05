/* Section: source/เทียบพระสงฆ์กับคนทั่วไป_30โรค.html */

function renderCompare(container) {
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
}

function initCompare(container) {
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);

const BUNDLE = {"comparison": {"I10": {"name": "ความดันโลหิตสูง", "group": "เมตาบอลิก/หัวใจ", "monk_pct": 17.23, "gen_pct": 22.77, "ratio": 0.76, "diff_pp": -5.54}, "E11": {"name": "เบาหวาน", "group": "เมตาบอลิก/หัวใจ", "monk_pct": 10.0, "gen_pct": 11.25, "ratio": 0.89, "diff_pp": -1.25}, "E78": {"name": "ไขมันในเลือดสูง", "group": "เมตาบอลิก/หัวใจ", "monk_pct": 15.51, "gen_pct": 16.71, "ratio": 0.93, "diff_pp": -1.2}, "N18": {"name": "ไตวายเรื้อรัง", "group": "ไต/ทางเดินปัสสาวะ", "monk_pct": 4.06, "gen_pct": 4.11, "ratio": 0.99, "diff_pp": -0.05}, "J06": {"name": "ติดเชื้อทางเดินหายใจส่วนบน", "group": "ทางเดินหายใจ", "monk_pct": 0.77, "gen_pct": 0.84, "ratio": 0.92, "diff_pp": -0.07}, "I63": {"name": "สมองขาดเลือด", "group": "เมตาบอลิก/หัวใจ", "monk_pct": 1.14, "gen_pct": 0.95, "ratio": 1.2, "diff_pp": 0.19}, "I25": {"name": "หัวใจขาดเลือดเรื้อรัง", "group": "เมตาบอลิก/หัวใจ", "monk_pct": 2.12, "gen_pct": 1.38, "ratio": 1.54, "diff_pp": 0.74}, "A09": {"name": "ท้องเสีย", "group": "อื่นๆ", "monk_pct": 1.75, "gen_pct": 2.07, "ratio": 0.85, "diff_pp": -0.32}, "H25": {"name": "ต้อกระจก", "group": "อื่นๆ", "monk_pct": 1.49, "gen_pct": 1.6, "ratio": 0.93, "diff_pp": -0.11}, "J18": {"name": "ปอดอักเสบ", "group": "ทางเดินหายใจ", "monk_pct": 1.67, "gen_pct": 1.31, "ratio": 1.27, "diff_pp": 0.36}, "J44": {"name": "ปอดอุดกั้นเรื้อรัง (COPD)", "group": "ทางเดินหายใจ", "monk_pct": 2.22, "gen_pct": 1.0, "ratio": 2.22, "diff_pp": 1.22}, "S06": {"name": "บาดเจ็บกะโหลกศีรษะ", "group": "อื่นๆ", "monk_pct": 0.41, "gen_pct": 0.49, "ratio": 0.84, "diff_pp": -0.08}, "M54": {"name": "ปวดหลัง", "group": "อื่นๆ", "monk_pct": 1.28, "gen_pct": 2.06, "ratio": 0.62, "diff_pp": -0.78}, "C22": {"name": "มะเร็งตับ", "group": "มะเร็ง", "monk_pct": 0.21, "gen_pct": 0.15, "ratio": 1.4, "diff_pp": 0.06}, "K29": {"name": "กระเพาะอักเสบ", "group": "อื่นๆ", "monk_pct": 0.93, "gen_pct": 1.07, "ratio": 0.87, "diff_pp": -0.14}, "C34": {"name": "มะเร็งปอด", "group": "มะเร็ง", "monk_pct": 0.16, "gen_pct": 0.14, "ratio": 1.14, "diff_pp": 0.02}, "N40": {"name": "ต่อมลูกหมากโต", "group": "ไต/ทางเดินปัสสาวะ", "monk_pct": 2.75, "gen_pct": 1.07, "ratio": 2.57, "diff_pp": 1.68}, "F10": {"name": "ติดสุรา", "group": "จิตเวช/สารเสพติด", "monk_pct": 0.51, "gen_pct": 0.69, "ratio": 0.74, "diff_pp": -0.18}, "I50": {"name": "หัวใจล้มเหลว", "group": "เมตาบอลิก/หัวใจ", "monk_pct": 1.22, "gen_pct": 1.04, "ratio": 1.17, "diff_pp": 0.18}, "C18-C21": {"name": "มะเร็งลำไส้ใหญ่/ทวารหนัก", "group": "มะเร็ง", "monk_pct": 0.29, "gen_pct": 0.31, "ratio": 0.94, "diff_pp": -0.02}, "F32": {"name": "ซึมเศร้า", "group": "จิตเวช/สารเสพติด", "monk_pct": 0.51, "gen_pct": 0.84, "ratio": 0.61, "diff_pp": -0.33}, "A15-A16": {"name": "วัณโรค", "group": "โรคติดต่อ", "monk_pct": 0.53, "gen_pct": 0.36, "ratio": 1.47, "diff_pp": 0.17}, "B20-B24": {"name": "HIV", "group": "โรคติดต่อ", "monk_pct": 1.33, "gen_pct": 1.08, "ratio": 1.23, "diff_pp": 0.25}, "M10": {"name": "เก๊าท์", "group": "อื่นๆ", "monk_pct": 2.45, "gen_pct": 1.57, "ratio": 1.56, "diff_pp": 0.88}, "F15": {"name": "ติดสารกระตุ้นอื่นๆ", "group": "จิตเวช/สารเสพติด", "monk_pct": 0.63, "gen_pct": 0.82, "ratio": 0.77, "diff_pp": -0.19}, "N20": {"name": "นิ่วในไต/ทางเดินปัสสาวะ", "group": "ไต/ทางเดินปัสสาวะ", "monk_pct": 0.4, "gen_pct": 0.52, "ratio": 0.77, "diff_pp": -0.12}, "L03": {"name": "เนื้อเยื่ออักเสบ", "group": "อื่นๆ", "monk_pct": 1.26, "gen_pct": 1.03, "ratio": 1.22, "diff_pp": 0.23}, "C61": {"name": "มะเร็งต่อมลูกหมาก", "group": "มะเร็ง", "monk_pct": 0.14, "gen_pct": 0.08, "ratio": 1.75, "diff_pp": 0.06}, "J45": {"name": "หอบหืด", "group": "ทางเดินหายใจ", "monk_pct": 0.82, "gen_pct": 1.04, "ratio": 0.79, "diff_pp": -0.22}, "U07.1": {"name": "COVID-19", "group": "โรคติดต่อ", "monk_pct": 0.4, "gen_pct": 0.45, "ratio": 0.89, "diff_pp": -0.05}}, "age_weights": {"w20_39": 0.38647822575328794, "w40_59": 0.38775326710281205, "w60p": 0.2257685071439001, "pct20_39": 38.6, "pct40_59": 38.8, "pct60p": 22.6}, "age_standardized": {"I10": {"raw": 17.23, "std": 14.48, "gen": 22.77}, "E11": {"raw": 10.0, "std": 9.03, "gen": 11.25}, "E78": {"raw": 15.51, "std": 13.96, "gen": 16.71}, "N18": {"raw": 4.06, "std": 3.18, "gen": 4.11}}};
const COMP = BUNDLE.comparison;
const AGESTD = BUNDLE.age_standardized;
const WEIGHTS = BUNDLE.age_weights;

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

function initDashboard(){
  try{
    renderGroupFilter();
    renderDivergeChart();
    renderAgeStdGrid();
    renderFullTable();

    const navButtons = document.querySelectorAll('.navlinks button');
    const sectionIds = ['intro','ratio','agestd','table','caveats'];
    const sections = sectionIds.map(id=>document.getElementById(id)).filter(Boolean);
    navButtons.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const t = document.getElementById(btn.dataset.target);
        if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
    const spy = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ navButtons.forEach(b=>b.classList.toggle('active', b.dataset.target===e.target.id)); } });
    }, {rootMargin:'-35% 0px -55% 0px', threshold:0});
    sections.forEach(s=>spy.observe(s));

    const fadeEls = document.querySelectorAll('.fade-in');
    const fadeObs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); fadeObs.unobserve(e.target); } });
    }, {threshold:.1});
    fadeEls.forEach(el=>fadeObs.observe(el));
  } catch(err){ console.error('init error', err); }
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', initDashboard); } else { initDashboard(); }

}
