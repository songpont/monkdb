/* Section: source/เจาะลึกข้อมูลสุขภาพพระสงฆ์_รอบ2.html */

function renderBurden(container) {
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
  initBurden(container);
}

function initBurden(container) {
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);

const NATIONAL_BG = {"2": {"<40": 4.7, "40-59": 18.6, "60+": 38.0}, "3": {"<40": 2.0, "40-59": 9.8, "60+": 25.0}, "4": {"<40": 0.6, "40-59": 3.7, "60+": 13.6}, "5": {"<40": 0.2, "40-59": 1.4, "60+": 6.4}};
const PROVINCE_BG = {"ขอนแก่น": {"n": 2478, "n_by_band": {"<40": 483, "40-59": 1031, "60+": 964}, "burden2": 30.3, "growth2": 26.6, "burden3": 19.3, "growth3": 18.3, "burden4": 10.6, "growth4": 10.2, "burden5": 5.7, "growth5": 5.7}, "กรุงเทพมหานคร": {"n": 7362, "n_by_band": {"<40": 2112, "40-59": 2634, "60+": 2616}, "burden2": 36.2, "growth2": 32.0, "burden3": 25.3, "growth3": 23.6, "burden4": 13.3, "growth4": 13.1, "burden5": 6.2, "growth5": 6.2}, "พระนครศรีอยุธยา": {"n": 4481, "n_by_band": {"<40": 802, "40-59": 1411, "60+": 2268}, "burden2": 41.0, "growth2": 34.6, "burden3": 28.4, "growth3": 25.3, "burden4": 16.8, "growth4": 16.3, "burden5": 7.3, "growth5": 7.2}, "นนทบุรี": {"n": 2024, "n_by_band": {"<40": 407, "40-59": 750, "60+": 867}, "burden2": 39.7, "growth2": 34.5, "burden3": 25.1, "growth3": 23.6, "burden4": 13.7, "growth4": 13.2, "burden5": 6.1, "growth5": 6.1}, "ราชบุรี": {"n": 1679, "n_by_band": {"<40": 596, "40-59": 617, "60+": 466}, "burden2": 44.8, "growth2": 40.6, "burden3": 27.0, "growth3": 25.7, "burden4": 15.2, "growth4": 14.9, "burden5": 6.4, "growth5": 6.2}, "ระนอง": {"n": 183, "n_by_band": {"<40": 35, "40-59": 87, "60+": 61}, "burden2": 44.3, "growth2": 41.4, "burden3": 29.5, "growth3": 26.6, "burden4": 21.3, "growth4": 18.4, "burden5": 11.5, "growth5": 8.6}, "กาญจนบุรี": {"n": 1910, "n_by_band": {"<40": 393, "40-59": 818, "60+": 699}, "burden2": 42.6, "growth2": 35.5, "burden3": 27.3, "growth3": 23.5, "burden4": 14.9, "growth4": 13.6, "burden5": 8.2, "growth5": 7.9}, "เลย": {"n": 1446, "n_by_band": {"<40": 322, "40-59": 638, "60+": 486}, "burden2": 33.7, "growth2": 30.3, "burden3": 20.6, "growth3": 19.4, "burden4": 10.7, "growth4": 9.5, "burden5": 4.7, "growth5": 4.7}, "ลพบุรี": {"n": 3061, "n_by_band": {"<40": 419, "40-59": 1022, "60+": 1620}, "burden2": 34.8, "growth2": 28.4, "burden3": 22.3, "growth3": 18.2, "burden4": 12.1, "growth4": 10.2, "burden5": 5.6, "growth5": 5.1}, "อุบลราชธานี": {"n": 4773, "n_by_band": {"<40": 1698, "40-59": 1730, "60+": 1345}, "burden2": 34.0, "growth2": 31.4, "burden3": 20.4, "growth3": 19.6, "burden4": 11.3, "growth4": 10.9, "burden5": 5.8, "growth5": 5.6}, "สมุทรปราการ": {"n": 1550, "n_by_band": {"<40": 374, "40-59": 585, "60+": 591}, "burden2": 38.9, "growth2": 32.8, "burden3": 28.8, "growth3": 25.9, "burden4": 14.6, "growth4": 13.5, "burden5": 7.6, "growth5": 6.8}, "ร้อยเอ็ด": {"n": 3927, "n_by_band": {"<40": 1060, "40-59": 1639, "60+": 1228}, "burden2": 32.1, "growth2": 28.5, "burden3": 19.9, "growth3": 19.1, "burden4": 10.3, "growth4": 9.9, "burden5": 4.6, "growth5": 4.3}, "น่าน": {"n": 1464, "n_by_band": {"<40": 1003, "40-59": 277, "60+": 184}, "burden2": 56.5, "growth2": 52.6, "burden3": 42.4, "growth3": 41.3, "burden4": 19.0, "growth4": 18.9, "burden5": 10.3, "growth5": 10.3}, "ศรีสะเกษ": {"n": 6315, "n_by_band": {"<40": 1654, "40-59": 2581, "60+": 2080}, "burden2": 36.2, "growth2": 32.3, "burden3": 22.0, "growth3": 20.5, "burden4": 10.9, "growth4": 10.2, "burden5": 5.0, "growth5": 4.9}, "สมุทรสาคร": {"n": 877, "n_by_band": {"<40": 212, "40-59": 326, "60+": 339}, "burden2": 38.3, "growth2": 33.6, "burden3": 27.4, "growth3": 25.5, "burden4": 17.4, "growth4": 16.9, "burden5": 8.8, "growth5": 8.3}, "นครนายก": {"n": 471, "n_by_band": {"<40": 90, "40-59": 167, "60+": 214}, "burden2": 43.5, "growth2": 39.1, "burden3": 24.3, "growth3": 21.0, "burden4": 14.0, "growth4": 11.8, "burden5": 8.4, "growth5": 7.3}, "อุดรธานี": {"n": 3316, "n_by_band": {"<40": 507, "40-59": 1666, "60+": 1143}, "burden2": 32.0, "growth2": 26.7, "burden3": 18.4, "growth3": 17.0, "burden4": 10.3, "growth4": 10.3, "burden5": 4.9, "growth5": 4.9}, "สุราษฎร์ธานี": {"n": 1899, "n_by_band": {"<40": 501, "40-59": 760, "60+": 638}, "burden2": 39.0, "growth2": 34.8, "burden3": 26.2, "growth3": 23.6, "burden4": 15.0, "growth4": 13.8, "burden5": 6.6, "growth5": 6.6}, "เชียงใหม่": {"n": 4953, "n_by_band": {"<40": 2783, "40-59": 1228, "60+": 942}, "burden2": 42.5, "growth2": 39.3, "burden3": 26.2, "growth3": 25.0, "burden4": 14.0, "growth4": 13.7, "burden5": 6.5, "growth5": 6.4}, "นครพนม": {"n": 1123, "n_by_band": {"<40": 429, "40-59": 416, "60+": 278}, "burden2": 25.9, "growth2": 22.9, "burden3": 15.5, "growth3": 14.3, "burden4": 8.6, "growth4": 8.4, "burden5": 5.4, "growth5": 5.4}, "สระบุรี": {"n": 1239, "n_by_band": {"<40": 174, "40-59": 513, "60+": 552}, "burden2": 41.3, "growth2": 31.5, "burden3": 29.2, "growth3": 24.6, "burden4": 15.9, "growth4": 15.3, "burden5": 6.9, "growth5": 6.9}, "ปทุมธานี": {"n": 1567, "n_by_band": {"<40": 394, "40-59": 678, "60+": 495}, "burden2": 35.8, "growth2": 29.7, "burden3": 26.3, "growth3": 23.3, "burden4": 14.1, "growth4": 13.3, "burden5": 6.9, "growth5": 6.9}, "สุพรรณบุรี": {"n": 2783, "n_by_band": {"<40": 484, "40-59": 1032, "60+": 1267}, "burden2": 43.1, "growth2": 32.8, "burden3": 29.9, "growth3": 24.3, "burden4": 16.3, "growth4": 15.5, "burden5": 7.8, "growth5": 7.2}, "นครศรีธรรมราช": {"n": 1872, "n_by_band": {"<40": 463, "40-59": 691, "60+": 718}, "burden2": 43.3, "growth2": 39.6, "burden3": 32.3, "growth3": 30.4, "burden4": 17.8, "growth4": 17.4, "burden5": 10.4, "growth5": 10.4}, "สมุทรสงคราม": {"n": 838, "n_by_band": {"<40": 102, "40-59": 304, "60+": 432}, "burden2": 49.5, "growth2": 34.8, "burden3": 34.7, "growth3": 27.8, "burden4": 19.4, "growth4": 16.5, "burden5": 8.1, "growth5": 8.1}, "อ่างทอง": {"n": 1081, "n_by_band": {"<40": 212, "40-59": 347, "60+": 522}, "burden2": 42.7, "growth2": 35.2, "burden3": 33.1, "growth3": 28.4, "burden4": 18.8, "growth4": 17.9, "burden5": 8.0, "growth5": 7.1}, "ระยอง": {"n": 1467, "n_by_band": {"<40": 382, "40-59": 554, "60+": 531}, "burden2": 39.0, "growth2": 34.8, "burden3": 26.2, "growth3": 24.4, "burden4": 14.1, "growth4": 13.6, "burden5": 7.2, "growth5": 6.7}, "สุโขทัย": {"n": 1221, "n_by_band": {"<40": 300, "40-59": 514, "60+": 407}, "burden2": 48.4, "growth2": 40.7, "burden3": 29.0, "growth3": 25.0, "burden4": 13.5, "growth4": 12.5, "burden5": 5.7, "growth5": 5.0}, "สกลนคร": {"n": 4831, "n_by_band": {"<40": 1344, "40-59": 1958, "60+": 1529}, "burden2": 32.4, "growth2": 28.8, "burden3": 19.6, "growth3": 18.9, "burden4": 10.2, "growth4": 10.1, "burden5": 4.6, "growth5": 4.6}, "นครราชสีมา": {"n": 7824, "n_by_band": {"<40": 1371, "40-59": 3277, "60+": 3176}, "burden2": 36.7, "growth2": 31.7, "burden3": 23.7, "growth3": 21.4, "burden4": 12.8, "growth4": 12.2, "burden5": 5.9, "growth5": 5.8}, "นครปฐม": {"n": 958, "n_by_band": {"<40": 237, "40-59": 355, "60+": 366}, "burden2": 41.0, "growth2": 38.0, "burden3": 24.0, "growth3": 23.2, "burden4": 13.7, "growth4": 13.3, "burden5": 6.8, "growth5": 6.8}, "ฉะเชิงเทรา": {"n": 2943, "n_by_band": {"<40": 710, "40-59": 981, "60+": 1252}, "burden2": 36.6, "growth2": 34.1, "burden3": 23.4, "growth3": 21.9, "burden4": 11.8, "growth4": 11.8, "burden5": 5.8, "growth5": 5.8}, "สระแก้ว": {"n": 2022, "n_by_band": {"<40": 286, "40-59": 920, "60+": 816}, "burden2": 38.4, "growth2": 30.7, "burden3": 25.4, "growth3": 21.2, "burden4": 12.7, "growth4": 11.3, "burden5": 5.4, "growth5": 5.1}, "ปราจีนบุรี": {"n": 1567, "n_by_band": {"<40": 254, "40-59": 649, "60+": 664}, "burden2": 41.3, "growth2": 34.2, "burden3": 28.0, "growth3": 24.1, "burden4": 13.0, "growth4": 11.8, "burden5": 5.4, "growth5": 4.6}, "ลำปาง": {"n": 3034, "n_by_band": {"<40": 1370, "40-59": 878, "60+": 786}, "burden2": 40.8, "growth2": 37.0, "burden3": 27.9, "growth3": 26.2, "burden4": 15.4, "growth4": 14.7, "burden5": 6.7, "growth5": 6.4}, "จันทบุรี": {"n": 1222, "n_by_band": {"<40": 217, "40-59": 491, "60+": 514}, "burden2": 35.2, "growth2": 31.1, "burden3": 20.8, "growth3": 19.4, "burden4": 10.9, "growth4": 10.4, "burden5": 4.7, "growth5": 4.2}, "ตาก": {"n": 1086, "n_by_band": {"<40": 260, "40-59": 451, "60+": 375}, "burden2": 48.0, "growth2": 42.6, "burden3": 34.7, "growth3": 33.2, "burden4": 16.8, "growth4": 16.8, "burden5": 7.5, "growth5": 7.5}, "พิษณุโลก": {"n": 3315, "n_by_band": {"<40": 636, "40-59": 1327, "60+": 1352}, "burden2": 42.0, "growth2": 34.5, "burden3": 28.0, "growth3": 24.4, "burden4": 15.2, "growth4": 14.4, "burden5": 5.7, "growth5": 5.2}, "อำนาจเจริญ": {"n": 1659, "n_by_band": {"<40": 579, "40-59": 610, "60+": 470}, "burden2": 28.7, "growth2": 25.6, "burden3": 19.4, "growth3": 18.4, "burden4": 11.3, "growth4": 11.3, "burden5": 4.9, "growth5": 4.9}, "พะเยา": {"n": 1363, "n_by_band": {"<40": 639, "40-59": 413, "60+": 311}, "burden2": 44.7, "growth2": 40.3, "burden3": 28.0, "growth3": 25.7, "burden4": 18.0, "growth4": 17.5, "burden5": 9.0, "growth5": 8.7}, "กำแพงเพชร": {"n": 2204, "n_by_band": {"<40": 293, "40-59": 891, "60+": 1020}, "burden2": 39.5, "growth2": 32.7, "burden3": 25.2, "growth3": 23.5, "burden4": 13.6, "growth4": 12.6, "burden5": 7.3, "growth5": 7.0}, "ชัยภูมิ": {"n": 4845, "n_by_band": {"<40": 1170, "40-59": 1819, "60+": 1856}, "burden2": 31.6, "growth2": 28.3, "burden3": 18.9, "growth3": 18.0, "burden4": 10.5, "growth4": 10.2, "burden5": 4.8, "growth5": 4.7}, "ลำพูน": {"n": 932, "n_by_band": {"<40": 365, "40-59": 304, "60+": 263}, "burden2": 53.6, "growth2": 44.3, "burden3": 42.2, "growth3": 38.6, "burden4": 20.2, "growth4": 19.4, "burden5": 9.5, "growth5": 9.2}, "ชลบุรี": {"n": 1632, "n_by_band": {"<40": 314, "40-59": 650, "60+": 668}, "burden2": 38.0, "growth2": 31.9, "burden3": 25.9, "growth3": 21.8, "burden4": 13.2, "growth4": 11.3, "burden5": 6.6, "growth5": 6.0}, "บุรีรัมย์": {"n": 3460, "n_by_band": {"<40": 944, "40-59": 1400, "60+": 1116}, "burden2": 34.7, "growth2": 30.7, "burden3": 21.7, "growth3": 20.1, "burden4": 11.3, "growth4": 11.0, "burden5": 4.8, "growth5": 4.8}, "เชียงราย": {"n": 2308, "n_by_band": {"<40": 924, "40-59": 788, "60+": 596}, "burden2": 45.8, "growth2": 42.6, "burden3": 31.0, "growth3": 29.6, "burden4": 16.8, "growth4": 16.2, "burden5": 6.4, "growth5": 6.3}, "แพร่": {"n": 1561, "n_by_band": {"<40": 805, "40-59": 414, "60+": 342}, "burden2": 48.0, "growth2": 43.2, "burden3": 29.8, "growth3": 28.1, "burden4": 17.3, "growth4": 16.8, "burden5": 9.9, "growth5": 9.8}, "กาฬสินธุ์": {"n": 2978, "n_by_band": {"<40": 668, "40-59": 1285, "60+": 1025}, "burden2": 32.6, "growth2": 27.2, "burden3": 21.9, "growth3": 19.2, "burden4": 10.5, "growth4": 9.3, "burden5": 4.5, "growth5": 4.4}, "พิจิตร": {"n": 799, "n_by_band": {"<40": 148, "40-59": 299, "60+": 352}, "burden2": 49.4, "growth2": 42.0, "burden3": 34.4, "growth3": 32.4, "burden4": 18.2, "growth4": 16.8, "burden5": 8.5, "growth5": 7.8}, "ประจวบคีรีขันธ์": {"n": 1235, "n_by_band": {"<40": 358, "40-59": 440, "60+": 437}, "burden2": 44.4, "growth2": 39.4, "burden3": 28.1, "growth3": 25.9, "burden4": 14.0, "growth4": 13.7, "burden5": 7.8, "growth5": 7.5}, "นครสวรรค์": {"n": 2380, "n_by_band": {"<40": 493, "40-59": 822, "60+": 1065}, "burden2": 43.6, "growth2": 37.5, "burden3": 29.7, "growth3": 26.7, "burden4": 17.8, "growth4": 16.4, "burden5": 8.1, "growth5": 7.5}, "สงขลา": {"n": 2090, "n_by_band": {"<40": 672, "40-59": 619, "60+": 799}, "burden2": 38.5, "growth2": 34.9, "burden3": 25.0, "growth3": 23.7, "burden4": 14.8, "growth4": 13.9, "burden5": 8.6, "growth5": 8.5}, "อุทัยธานี": {"n": 743, "n_by_band": {"<40": 176, "40-59": 292, "60+": 275}, "burden2": 44.0, "growth2": 34.9, "burden3": 27.6, "growth3": 21.9, "burden4": 14.5, "growth4": 12.2, "burden5": 6.2, "growth5": 6.2}, "ตรัง": {"n": 562, "n_by_band": {"<40": 193, "40-59": 206, "60+": 163}, "burden2": 47.9, "growth2": 42.2, "burden3": 33.7, "growth3": 32.1, "burden4": 17.8, "growth4": 17.8, "burden5": 10.4, "growth5": 10.4}, "หนองบัวลำภู": {"n": 814, "n_by_band": {"<40": 134, "40-59": 379, "60+": 301}, "burden2": 30.2, "growth2": 25.7, "burden3": 17.9, "growth3": 16.4, "burden4": 12.0, "growth4": 12.0, "burden5": 8.6, "growth5": 8.6}, "ยโสธร": {"n": 1552, "n_by_band": {"<40": 337, "40-59": 654, "60+": 561}, "burden2": 30.3, "growth2": 27.0, "burden3": 20.5, "growth3": 19.0, "burden4": 10.5, "growth4": 9.6, "burden5": 5.3, "growth5": 4.7}, "ชุมพร": {"n": 1025, "n_by_band": {"<40": 226, "40-59": 363, "60+": 436}, "burden2": 38.1, "growth2": 31.9, "burden3": 26.1, "growth3": 23.0, "burden4": 15.6, "growth4": 15.6, "burden5": 8.0, "growth5": 8.0}, "เพชรบุรี": {"n": 867, "n_by_band": {"<40": 159, "40-59": 335, "60+": 373}, "burden2": 41.0, "growth2": 31.6, "burden3": 25.7, "growth3": 20.7, "burden4": 15.5, "growth4": 13.6, "burden5": 7.0, "growth5": 6.4}, "มหาสารคาม": {"n": 1493, "n_by_band": {"<40": 239, "40-59": 645, "60+": 609}, "burden2": 38.4, "growth2": 28.4, "burden3": 25.5, "growth3": 19.6, "burden4": 14.3, "growth4": 11.4, "burden5": 7.1, "growth5": 6.3}, "หนองคาย": {"n": 548, "n_by_band": {"<40": 65, "40-59": 246, "60+": 237}, "burden2": 39.2, "growth2": 30.0, "burden3": 29.1, "growth3": 26.0, "burden4": 16.5, "growth4": 15.0, "burden5": 6.8, "growth5": 5.3}, "บึงกาฬ": {"n": 793, "n_by_band": {"<40": 117, "40-59": 390, "60+": 286}, "burden2": 32.5, "growth2": 24.8, "burden3": 18.2, "growth3": 14.8, "burden4": 9.8, "growth4": 9.8, "burden5": 5.2, "growth5": 5.2}, "เพชรบูรณ์": {"n": 2627, "n_by_band": {"<40": 585, "40-59": 1069, "60+": 973}, "burden2": 39.5, "growth2": 35.2, "burden3": 26.6, "growth3": 24.7, "burden4": 14.0, "growth4": 13.5, "burden5": 7.1, "growth5": 7.1}, "กระบี่": {"n": 445, "n_by_band": {"<40": 139, "40-59": 145, "60+": 161}, "burden2": 36.6, "growth2": 30.8, "burden3": 23.6, "growth3": 22.2, "burden4": 17.4, "growth4": 17.4, "burden5": 6.8, "growth5": 6.8}, "ชัยนาท": {"n": 580, "n_by_band": {"<40": 108, "40-59": 228, "60+": 244}, "burden2": 38.5, "growth2": 32.0, "burden3": 25.8, "growth3": 23.9, "burden4": 13.5, "growth4": 11.6, "burden5": 7.8, "growth5": 6.9}, "พัทลุง": {"n": 1193, "n_by_band": {"<40": 238, "40-59": 431, "60+": 524}, "burden2": 44.3, "growth2": 39.3, "burden3": 29.6, "growth3": 26.7, "burden4": 17.6, "growth4": 17.2, "burden5": 8.8, "growth5": 8.8}, "มุกดาหาร": {"n": 775, "n_by_band": {"<40": 131, "40-59": 406, "60+": 238}, "burden2": 27.3, "growth2": 22.0, "burden3": 16.0, "growth3": 16.0, "burden4": 10.1, "growth4": 10.1, "burden5": 4.6, "growth5": 4.6}, "ภูเก็ต": {"n": 256, "n_by_band": {"<40": 57, "40-59": 102, "60+": 97}, "burden2": 44.3, "growth2": 33.8, "burden3": 28.9, "growth3": 25.4, "burden4": 16.5, "growth4": 16.5, "burden5": 8.2, "growth5": 8.2}, "สุรินทร์": {"n": 1866, "n_by_band": {"<40": 300, "40-59": 923, "60+": 643}, "burden2": 30.5, "growth2": 22.2, "burden3": 17.4, "growth3": 15.4, "burden4": 10.7, "growth4": 10.4, "burden5": 4.8, "growth5": 4.8}, "อุตรดิตถ์": {"n": 395, "n_by_band": {"<40": 63, "40-59": 169, "60+": 163}, "burden2": 52.1, "growth2": 39.4, "burden3": 43.6, "growth3": 38.8, "burden4": 28.2, "growth4": 28.2, "burden5": 9.2, "growth5": 9.2}, "สิงห์บุรี": {"n": 285, "n_by_band": {"<40": 96, "40-59": 86, "60+": 103}, "burden2": 37.9, "growth2": 25.4, "burden3": 26.2, "growth3": 22.0, "burden4": 17.5, "growth4": 15.4, "burden5": 6.8, "growth5": 5.8}, "นราธิวาส": {"n": 334, "n_by_band": {"<40": 63, "40-59": 118, "60+": 153}, "burden2": 46.4, "growth2": 38.5, "burden3": 29.4, "growth3": 24.6, "burden4": 18.3, "growth4": 16.7, "burden5": 9.8, "growth5": 8.2}, "พังงา": {"n": 330, "n_by_band": {"<40": 78, "40-59": 142, "60+": 110}, "burden2": 35.5, "growth2": 27.8, "burden3": 30.0, "growth3": 24.9, "burden4": 15.5, "growth4": 12.9, "burden5": 10.0, "growth5": 10.0}, "ตราด": {"n": 288, "n_by_band": {"<40": 47, "40-59": 112, "60+": 129}, "burden2": 34.1, "growth2": 27.7, "burden3": 26.4, "growth3": 22.1, "burden4": 19.4, "growth4": 19.4, "burden5": 12.4, "growth5": 12.4}, "แม่ฮ่องสอน": {"n": 328, "n_by_band": {"<40": 138, "40-59": 88, "60+": 102}, "burden2": 43.1, "growth2": 41.7, "burden3": 25.5, "growth3": 24.8, "burden4": 12.7, "growth4": 12.0, "burden5": 4.9, "growth5": 4.9}, "สตูล": {"n": 326, "n_by_band": {"<40": 95, "40-59": 119, "60+": 112}, "burden2": 42.9, "growth2": 37.6, "burden3": 27.7, "growth3": 25.6, "burden4": 17.9, "growth4": 16.8, "burden5": 10.7, "growth5": 9.6}, "ปัตตานี": {"n": 428, "n_by_band": {"<40": 116, "40-59": 152, "60+": 160}, "burden2": 38.1, "growth2": 32.1, "burden3": 22.5, "growth3": 19.9, "burden4": 12.5, "growth4": 11.6, "burden5": 6.2, "growth5": 6.2}};
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

const REGION_AGE_DATA = {"national": {"<40": 4.7, "40-59": 18.6, "60+": 38.0}, "regions": {"1": {"region_name": "เขต 1 (เหนือบน)", "vals": {"<40": 3.9, "40-59": 24.8, "60+": 45.0}, "n": {"<40": 8027, "40-59": 4390, "60+": 3526}}, "2": {"region_name": "เขต 2 (เหนือล่าง)", "vals": {"<40": 6.4, "40-59": 23.5, "60+": 43.2}, "n": {"<40": 1844, "40-59": 3530, "60+": 3270}}, "3": {"region_name": "เขต 3 (นครสวรรค์)", "vals": {"<40": 6.9, "40-59": 25.0, "60+": 42.5}, "n": {"<40": 1218, "40-59": 2532, "60+": 2956}}, "4": {"region_name": "เขต 4 (สระบุรี)", "vals": {"<40": 6.6, "40-59": 22.8, "60+": 39.1}, "n": {"<40": 2594, "40-59": 4974, "60+": 6641}}, "5": {"region_name": "เขต 5 (ราชบุรี)", "vals": {"<40": 6.6, "40-59": 21.1, "60+": 43.3}, "n": {"<40": 2541, "40-59": 4227, "60+": 4379}}, "6": {"region_name": "เขต 6 (ชลบุรี)", "vals": {"<40": 5.0, "40-59": 18.9, "60+": 38.0}, "n": {"<40": 2584, "40-59": 4942, "60+": 5165}}, "7": {"region_name": "เขต 7 (ขอนแก่น)", "vals": {"<40": 4.7, "40-59": 16.7, "60+": 32.8}, "n": {"<40": 2450, "40-59": 4600, "60+": 3826}}, "8": {"region_name": "เขต 8 (อุดรธานี)", "vals": {"<40": 4.1, "40-59": 13.6, "60+": 32.3}, "n": {"<40": 2918, "40-59": 5693, "60+": 4260}}, "9": {"region_name": "เขต 9 (นครราชสีมา)", "vals": {"<40": 4.5, "40-59": 15.4, "60+": 34.4}, "n": {"<40": 3785, "40-59": 7419, "60+": 6791}}, "10": {"region_name": "เขต 10 (อุบลราชธานี)", "vals": {"<40": 3.3, "40-59": 14.3, "60+": 33.7}, "n": {"<40": 4399, "40-59": 5981, "60+": 4694}}, "11": {"region_name": "เขต 11 (สุราษฎร์ธานี)", "vals": {"<40": 4.9, "40-59": 17.4, "60+": 40.3}, "n": {"<40": 1499, "40-59": 2290, "60+": 2221}}, "12": {"region_name": "เขต 12 (สงขลา)", "vals": {"<40": 4.7, "40-59": 19.2, "60+": 41.6}, "n": {"<40": 1394, "40-59": 1682, "60+": 1964}}, "13": {"region_name": "กรุงเทพมหานคร", "vals": {"<40": 4.2, "40-59": 18.1, "60+": 36.2}, "n": {"<40": 2112, "40-59": 2634, "60+": 2616}}}};
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
const fadeObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); fadeObs.unobserve(e.target); } });
}, {threshold:.1});
fadeEls.forEach(el=>fadeObs.observe(el));

const bars = document.querySelectorAll('.bar-fill');
const barObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.width = e.target.dataset.w + '%'; barObs.unobserve(e.target); }
  });
}, {threshold:.3});
bars.forEach(b=>barObs.observe(b));

const grpBars = document.querySelectorAll('.grp-bar');
const grpObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.height = e.target.dataset.h + '%'; grpObs.unobserve(e.target); }
  });
}, {threshold:.3});
grpBars.forEach(b=>grpObs.observe(b));

}
