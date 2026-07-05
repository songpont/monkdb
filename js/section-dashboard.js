/* Section: source/ธรรมนูญสุขภาพพระสงฆ์_dashboard.html */

function renderDashboard(container) {
  container.innerHTML = `

<header class="hero">
  <div class="hero-inner">
    <div>
      <p class="eyebrow">พุทธศักราช ๒๕๖๖ &nbsp;·&nbsp; แผนขับเคลื่อนสู่การปฏิบัติ ๒๕๖๙–๒๕๗๕</p>
      <h1>ธรรมนูญสุขภาพ<br><span>พระสงฆ์แห่งชาติ</span></h1>
      <p class="lede">ข้อตกลงร่วมของพระสงฆ์ คณะสงฆ์ ชุมชน สังคม และภาคีทุกภาคส่วน เพื่อดูแลสุขภาวะพระสงฆ์ตามหลักพระธรรมวินัย บนหลักการ "ใช้ทางธรรม นำทางโลก"</p>
      <div class="year-badge">🗓 ข้อมูลสถานการณ์อัปเดตล่าสุด พ.ศ. ๒๕๖๘</div><br>
      <div class="goal-pill">🪷 เป้าหมาย: “พระแข็งแรง วัดมั่นคง ชุมชนเป็นสุข”</div>
    </div>
    <div>
      <div class="wheel-wrap">
        <svg id="bhavanaWheel" width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="128" fill="none" stroke="rgba(232,162,58,.25)" stroke-width="1"/>
          <g id="segments"></g>
          <circle cx="150" cy="150" r="46" fill="#33090D" stroke="#E8A23A" stroke-width="1.5"/>
          <text x="150" y="145" text-anchor="middle" fill="#F4C878" font-family="Noto Serif Thai" font-weight="700" font-size="17">ภาวนา</text>
          <text x="150" y="167" text-anchor="middle" fill="#F4C878" font-family="Noto Serif Thai" font-weight="700" font-size="17">๔</text>
        </svg>
      </div>
      <p class="wheel-caption">แตะแต่ละกลีบเพื่อดูความหมายของ “ภาวนา ๔” รากฐานสุขภาวะพระสงฆ์</p>
      <div id="bhavana-panel">
        <div class="bp-title">แตะกลีบใดกลีบหนึ่งบนวงล้อ</div>
        <div class="bp-body">ภาวนา ๔ คือฐานคิดที่ธรรมนูญฉบับนี้ใช้นิยาม “สุขภาวะพระสงฆ์” — ครอบคลุมกาย สังคม จิต และปัญญา</div>
      </div>
    </div>
  </div>
</header>

<!-- ===== DASHBOARD SUB-NAV ===== -->
<div style="position:sticky;top:52px;z-index:40;background:var(--parchment);border-bottom:1px solid var(--parchment-deep);overflow-x:auto;">
  <div style="display:flex;gap:.2rem;padding:.5rem 1rem;max-width:1180px;margin:0 auto;">
    <button class="dash-nav-btn active" data-dtarget="why">ทำไมต้องมี</button>
    <button class="dash-nav-btn" data-dtarget="stats">สถานการณ์ ๒๕๖๘</button>
    <button class="dash-nav-btn" data-dtarget="charter">ธรรมนูญฉบับเต็ม</button>
    <button class="dash-nav-btn" data-dtarget="done">ฐานทุน &amp; ที่ทำแล้ว</button>
    <button class="dash-nav-btn" data-dtarget="plans">แผนขับเคลื่อน ๕ แผน</button>
  </div>
</div>

<!-- ============ SECTION 1: WHY ============ -->
<section id="why">
  <div class="sec-head fade-in">
    <p class="eyebrow">ที่มาและความจำเป็น</p>
    <h2>ทำไมต้องมีธรรมนูญสุขภาพพระสงฆ์</h2>
    <p>ตั้งอยู่บนพุทธพจน์ที่ให้ความสำคัญกับความไม่มีโรค และเชื่อมโยงกับกรอบนโยบายระดับชาติ เพื่อให้พระสงฆ์ดูแลตนเอง ชุมชนดูแลพระสงฆ์ และพระสงฆ์เป็นผู้นำสุขภาวะของชุมชน</p>
    <div class="divider"></div>
  </div>

  <div class="why-grid">
    <div class="fade-in">
      <div class="quote-block">
        <div class="pali">“อาโรคฺยปรมาลาภา”</div>
        <div class="th">“ลาภทั้งหลาย มีความไม่มีโรคเป็นอย่างยิ่ง” — พระพุทธองค์ทรงชี้แนะให้พระสงฆ์ดำรงตนให้เป็นผู้มีโรคาพาธน้อย ด้วยการบริโภคปัจจัย ๔ อย่างพิจารณาโดยแยบคาย</div>
      </div>

      <p style="margin-top:1.5rem; font-weight:700; color:var(--maroon-800);">สอดคล้องกับกรอบนโยบายระดับชาติ</p>
      <div class="badge-row">
        <span class="badge">พ.ร.บ. สุขภาพแห่งชาติ ๒๕๕๐</span>
        <span class="badge">ยุทธศาสตร์ชาติ ๒๐ ปี ประเด็น ๑๓</span>
        <span class="badge">แผนปฏิรูปกิจการพระพุทธศาสนา</span>
        <span class="badge">ธรรมนูญสุขภาพแห่งชาติ ฉบับที่ ๓ (๒๕๖๕)</span>
        <span class="badge">มติสมัชชาสุขภาพแห่งชาติ</span>
      </div>

      <p style="margin-top:1.6rem; font-weight:700; color:var(--maroon-800);">เส้นทางของธรรมนูญฉบับนี้</p>
      <div class="timeline">
        <div class="tl-item">
          <div class="tl-dot-col"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-content"><div class="yr">พ.ศ. ๒๕๖๐</div><div class="desc">ประกาศธรรมนูญสุขภาพพระสงฆ์แห่งชาติ ฉบับแรก — กำหนดให้ทบทวนอย่างน้อยทุก ๕ ปี</div></div>
        </div>
        <div class="tl-item">
          <div class="tl-dot-col"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-content"><div class="yr">พ.ศ. ๒๕๖๔</div><div class="desc">คณะกรรมการขับเคลื่อนฯ มีมติเห็นชอบให้ทบทวนธรรมนูญฉบับ ๒๕๖๐</div></div>
        </div>
        <div class="tl-item">
          <div class="tl-dot-col"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-content"><div class="yr">๓๐ พ.ค. ๒๕๖๖</div><div class="desc">มติมหาเถรสมาคม ครั้งที่ ๑๔/๒๕๖๖ เห็นชอบให้ใช้ธรรมนูญฉบับทบทวน ทุกระดับคณะสงฆ์</div></div>
        </div>
        <div class="tl-item">
          <div class="tl-dot-col"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-content"><div class="yr">๓ มิ.ย. ๒๕๖๖</div><div class="desc">สมเด็จพระอริยวงศาคตญาณ สมเด็จพระสังฆราช ทรงลงพระนามประกาศใช้ธรรมนูญฯ พุทธศักราช ๒๕๖๖ (๕ หมวด ๓๐ ข้อ)</div></div>
        </div>
        <div class="tl-item">
          <div class="tl-dot-col"><div class="tl-dot"></div></div>
          <div class="tl-content"><div class="yr">๒๕๖๙–๒๕๗๕</div><div class="desc">แผนปฏิบัติการขับเคลื่อนสู่การปฏิบัติ ๕ แผน — ดูรายละเอียดในหัวข้อ “แผนขับเคลื่อน ๕ แผน”</div></div>
        </div>
      </div>
    </div>

    <div class="fade-in">
      <p style="font-weight:700; color:var(--maroon-800); margin-bottom:.3rem;">หลักภาวนา ๔ — นิยาม “สุขภาวะพระสงฆ์”</p>
      <p style="font-size:.85rem; color:var(--ink-soft); margin-top:0;">ตามข้อ ๔ ของธรรมนูญ สุขภาวะพระสงฆ์คือภาวะที่เป็นสุขทั้ง ๔ มิติ:</p>
      <div class="bhavana-legend">
        <div class="bl-item"><div class="t">🧘 กายภาวนา</div><div class="d">การพัฒนาทางกาย — สุขภาวะทางกาย</div></div>
        <div class="bl-item"><div class="t">🤝 สีลภาวนา</div><div class="d">การพัฒนาความประพฤติ — สุขภาวะทางสังคม</div></div>
        <div class="bl-item"><div class="t">💗 จิตตภาวนา</div><div class="d">การพัฒนาจิตใจ — สุขภาวะทางจิต</div></div>
        <div class="bl-item"><div class="t">📖 ปัญญาภาวนา</div><div class="d">การเจริญปัญญา — สุขภาวะทางปัญญา</div></div>
      </div>
      <p style="margin-top:1.6rem; font-size:.85rem; color:var(--ink-soft); background:var(--card); padding:1rem 1.1rem; border-radius:12px; box-shadow:var(--shadow);">
        แนวคิดหลัก: ส่งเสริมให้ <b>พระสงฆ์ดูแลสุขภาพตนเอง</b> ตามหลักพระธรรมวินัย ให้ <b>ชุมชนและสังคมดูแลอุปัฏฐากพระสงฆ์</b> ตามหลักพระธรรมวินัย และให้ <b>พระสงฆ์เป็นผู้นำด้านสุขภาวะ</b> ของชุมชนและสังคม ขับเคลื่อนร่วมกันด้วยพลัง “บวร” ภายใต้หลักการ “ใช้ทางธรรม นำทางโลก”
        <br><br><a href="#charter" onclick="document.getElementById('charter').scrollIntoView({behavior:'smooth'});return false;" style="color:var(--maroon-800); font-weight:700; text-decoration:underline;">→ ดูสาระสำคัญทั้ง ๕ หมวดแบบเต็ม</a>
      </p>
    </div>
  </div>
</section>

<!-- ============ SECTION 2: STATS (2568 primary) ============ -->
<section id="stats">
  <div class="sec-head fade-in">
    <p class="eyebrow">ภาพรวมที่สะท้อนสถานการณ์ปัจจุบันมากที่สุด</p>
    <h2>สถานการณ์สุขภาพพระสงฆ์ พ.ศ. ๒๕๖๘</h2>
    <p>เชื่อมโยง<b>ทะเบียนพระสงฆ์สามเณรทั่วประเทศ</b>เข้ากับ<b>ประวัติการวินิจฉัยโรคจริง</b>ในระบบบริการสุขภาพ (HISO) — ถือเป็นข้อมูลระดับประชากรจริง ไม่ใช่กลุ่มตัวอย่าง จึงเป็นภาพที่สะท้อนสถานการณ์ปัจจุบันของพระสงฆ์ทั้งประเทศได้แม่นยำที่สุด</p>
    <div class="divider"></div>
  </div>

  <div class="stats-hero-box fade-in">
    <div class="info-callout">
      <div class="ic-badge">ℹ</div>
      <p>
        ข้อมูลชุดนี้มาจากการเชื่อมโยงทะเบียนพระภิกษุสามเณร <b>237,725 รูปทั่วประเทศ</b> กับฐานการวินิจฉัยโรคจริง (รหัส ICD-10) ในระบบบริการสุขภาพ (HISO) ณ ปี ๒๕๖๘ พบประวัติสุขภาพ <b>220,296 รูป (92.7%)</b>
        ตัวเลข "ความชุก" ที่แสดงด้านล่างจึงหมายถึง <b>อัตราที่เคยได้รับการวินิจฉัยจริงในระบบบริการ</b> ของพระสงฆ์ทั่วประเทศ ณ ปัจจุบัน
      </p>
    </div>

    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num" data-count="237725" data-suffix="">0</div><div class="stat-label">พระสงฆ์สามเณรในฐานทะเบียนทั่วประเทศ</div><div class="stat-sub">เชื่อมข้อมูล HISO 2568</div></div>
      <div class="stat-card"><div class="stat-num" data-count="92.7" data-suffix="%">0%</div><div class="stat-label">พบประวัติสุขภาพในระบบบริการ</div><div class="stat-sub">220,296 รูป จาก 237,725 รูป</div></div>
      <div class="stat-card"><div class="stat-num" data-count="36.1" data-suffix="%">0%</div><div class="stat-label">อายุ ๖๐ ปีขึ้นไป</div><div class="stat-sub">อายุ ๗๐ ปีขึ้นไป = ๑๖.๕%</div></div>
      <div class="stat-card"><div class="stat-num" data-count="20.4" data-suffix="%">0%</div><div class="stat-label">ป่วยร่วมตั้งแต่ ๒ โรคขึ้นไป</div><div class="stat-sub">Multimorbidity · ๑๒.๓% ป่วยร่วม ๓ โรค+</div></div>

      <div class="stat-card"><div class="stat-num" data-count="17.2" data-suffix="%">0%</div><div class="stat-label">ความดันโลหิตสูง (วินิจฉัยจริง)</div><div class="stat-sub">I10 · ทั่วประเทศ 2568</div></div>
      <div class="stat-card"><div class="stat-num" data-count="15.5" data-suffix="%">0%</div><div class="stat-label">ไขมันในเลือดสูง (วินิจฉัยจริง)</div><div class="stat-sub">E78 · ทั่วประเทศ 2568</div></div>
      <div class="stat-card"><div class="stat-num" data-count="10.0" data-suffix="%">0%</div><div class="stat-label">เบาหวาน (วินิจฉัยจริง)</div><div class="stat-sub">E11 · ทั่วประเทศ 2568</div></div>
      <div class="stat-card"><div class="stat-num" data-count="4.1" data-suffix="%">0%</div><div class="stat-label">ไตวายเรื้อรัง (วินิจฉัยจริง)</div><div class="stat-sub">N18 · ทั่วประเทศ 2568</div></div>
    </div>
  </div>

  <div class="disease-panel fade-in" style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
    <div>
      <div class="hiso-card">
        <h4>๕ โรคที่วินิจฉัยพบมากที่สุดทั่วประเทศ (๒๕๖๘)</h4>
        <div class="note">อัตราการวินิจฉัยจริงในระบบบริการ ไม่ใช่ตัวเลขจากการคัดกรอง</div>
        <div class="bar-row"><div class="lbl"><span>ความดันโลหิตสูง</span><span>17.2%</span></div><div class="bar-track"><div class="bar-fill" data-w="49"></div></div></div>
        <div class="bar-row"><div class="lbl"><span>ไขมันในเลือดสูง</span><span>15.5%</span></div><div class="bar-track"><div class="bar-fill" data-w="44"></div></div></div>
        <div class="bar-row"><div class="lbl"><span>เบาหวาน</span><span>10.0%</span></div><div class="bar-track"><div class="bar-fill" data-w="29"></div></div></div>
        <div class="bar-row"><div class="lbl"><span>ไตวายเรื้อรัง</span><span>4.1%</span></div><div class="bar-track"><div class="bar-fill" data-w="12"></div></div></div>
        <div class="bar-row"><div class="lbl"><span>เก๊าท์ / ข้อ (M10)</span><span>2.5%</span></div><div class="bar-track"><div class="bar-fill" data-w="7"></div></div></div>
      </div>
    </div>
    <div>
      <div class="hiso-card">
        <h4>ต้นตอของปัญหา (Root cause)</h4>
        <div class="note">ปัจจัยเชิงพฤติกรรมและโครงสร้างที่ผลักดันตัวเลขข้างต้น</div>
        <ul class="cause-list">
          <li>พระสงฆ์เลือก/ปรุงอาหารเองไม่ได้ ต้องฉันตามที่ญาติโยมถวาย ซึ่งมักไขมัน น้ำตาล และเกลือสูง</li>
          <li>ขาดกิจกรรมทางกาย เนื่องด้วยข้อจำกัดทางพระธรรมวินัยและวิถีชีวิต</li>
          <li>พฤติกรรมเสี่ยง เช่น สูบบุหรี่ ดื่มกาแฟ/เครื่องดื่มชูกำลังในบางกลุ่ม</li>
          <li>โครงสร้างอายุพระสงฆ์สูงขึ้นเร็ว — ๓๖.๑% อายุ ๖๐+ เข้าสู่สังคมสูงวัยระดับสุดยอด</li>
          <li>ข้อจำกัดในการเข้าถึงบริการสุขภาพ ทั้งการเดินทางและขั้นตอนที่ไม่เหมาะกับพระสงฆ์</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="hiso-panels fade-in" style="margin-top:1.6rem;">

    <!-- Age gradient -->
    <div class="hiso-card">
      <h4>ความเสี่ยงเพิ่มขึ้นตามอายุ</h4>
      <div class="note">แตะปุ่มเพื่อเปลี่ยนโรคที่แสดงในกราฟ — จากพระสงฆ์ที่พบประวัติใน HISO และทราบอายุ (152,208 รูป)</div>
      <div class="chip-row">
        <button class="chip active" data-disease="I10">ความดันโลหิตสูง</button>
        <button class="chip" data-disease="E11">เบาหวาน</button>
        <button class="chip" data-disease="E78">ไขมันในเลือดสูง</button>
        <button class="chip" data-disease="N18">ไตวายเรื้อรัง</button>
      </div>
      <div class="age-chart" id="ageChart">
        <div class="age-col"><div class="age-bar" id="ageBar0"><span class="age-val" id="ageVal0"></span></div><div class="age-band-lbl">อายุ &lt;40</div></div>
        <div class="age-col"><div class="age-bar" id="ageBar1"><span class="age-val" id="ageVal1"></span></div><div class="age-band-lbl">อายุ ๔๐–๕๙</div></div>
        <div class="age-col"><div class="age-bar" id="ageBar2"><span class="age-val" id="ageVal2"></span></div><div class="age-band-lbl">อายุ ๖๐+</div></div>
      </div>
      <p style="font-size:.74rem; color:var(--sage); margin-top:.6rem; margin-bottom:0;">ความดันโลหิตสูงเพิ่มจาก ๓.๒% (อายุ&lt;๔๐) เป็น ๓๓.๖% (๖๐+) — สนับสนุนการคัดกรองเชิงรุกในพระสงฆ์สูงวัยตามแผนที่ ๒</p>
    </div>

    <!-- Regional -->
    <div class="hiso-card">
      <h4>ภาระโรคระดับภูมิภาค — ตัวอย่างภาคเหนือ</h4>
      <div class="note">เปรียบเทียบ ๑๖ จังหวัดภาคเหนือ (๔๘,๑๓๐ รูป) กับค่าเฉลี่ยประเทศ</div>
      <div class="region-compare">
        <div class="rc-pill"><span class="k">ความดันโลหิตสูง</span><span class="v">18.4% <span style="font-size:.65em; color:var(--ink-soft);">(ปท. 17.2%)</span></span></div>
        <div class="rc-pill"><span class="k">ไขมันในเลือดสูง</span><span class="v">17.2% <span style="font-size:.65em; color:var(--ink-soft);">(ปท. 15.5%)</span></span></div>
        <div class="rc-pill"><span class="k">เบาหวาน</span><span class="v">10.2% <span style="font-size:.65em; color:var(--ink-soft);">(ปท. 10.0%)</span></span></div>
      </div>
      <table class="prov-table" style="margin-top:1.1rem;">
        <thead><tr><th>จังหวัด</th><th style="text-align:right;">จำนวนพระสงฆ์</th></tr></thead>
        <tbody>
          <tr><td>เชียงใหม่</td><td class="num">8,473</td></tr>
          <tr><td>นครสวรรค์</td><td class="num">5,427</td></tr>
          <tr><td>เพชรบูรณ์</td><td class="num">4,233</td></tr>
          <tr><td>ลำปาง</td><td class="num">3,693</td></tr>
          <tr><td>พิษณุโลก</td><td class="num">3,603</td></tr>
        </tbody>
      </table>
      <p style="font-size:.72rem; color:var(--sage); margin-top:.7rem; margin-bottom:0;">นับตามวัดที่พำนักปัจจุบัน — พบพระสงฆ์ย้ายจังหวัดจากวัดต้นสังกัดเพียง ~1.2%</p>
    </div>

    <!-- Ordination age -->
    <div class="hiso-card">
      <h4>โครงสร้างอายุ: สองกลุ่มที่ต่างกันมาก</h4>
      <div class="note">อายุขณะบวชและอายุปัจจุบัน แยกตามสถานะ</div>
      <div class="ordination-split">
        <div class="os-item"><div class="n">17 ปี</div><div class="l">อายุมัธยฐาน<br>สามเณร (ปัจจุบัน)</div></div>
        <div class="os-item"><div class="n">55 ปี</div><div class="l">อายุมัธยฐาน<br>พระภิกษุ (ปัจจุบัน)</div></div>
      </div>
      <p style="font-size:.83rem; color:var(--ink-soft); margin-top:1rem;">
        <b style="color:var(--maroon-800);">68.9%</b> ของผู้บวชทั้งหมดบวชก่อนอายุ ๒๐ ปี (ส่วนใหญ่เป็นสามเณรเด็ก) — เนื้อหาความรอบรู้ด้านสุขภาพต้องออกแบบอย่างน้อย ๒ ชุด สำหรับสามเณรวัยเรียน และพระภิกษุสูงวัย
      </p>
    </div>

    <!-- Mortality-linked disease -->
    <div class="hiso-card">
      <h4>โรคที่เชื่อมโยงกับการมรณภาพชัดเจนที่สุด</h4>
      <div class="note">เทียบอัตราการพบโรคในกลุ่มมรณภาพแล้ว กับกลุ่มที่ยังมีชีวิต</div>
      <div class="mc-legend">
        <span><i style="background:var(--maroon-700);"></i>มรณภาพแล้ว</span>
        <span><i style="background:var(--sage-light);"></i>ยังมีชีวิต</span>
      </div>
      <div class="mortality-compare">
        <div class="mc-row">
          <div class="mc-lbl">มะเร็งปอด (C34)</div>
          <div class="gap-bar-line"><span class="tag">มรณภาพ</span><div class="gap-bar-track"><div class="gap-bar-fill" style="background:var(--maroon-700);" data-w="9"></div></div><span class="val">0.9%</span></div>
          <div class="gap-bar-line"><span class="tag">มีชีวิต</span><div class="gap-bar-track"><div class="gap-bar-fill" style="background:var(--sage-light);" data-w="1"></div></div><span class="val">0.1%</span></div>
        </div>
        <div class="mc-row">
          <div class="mc-lbl">ภาวะหัวใจล้มเหลว (I50)</div>
          <div class="gap-bar-line"><span class="tag">มรณภาพ</span><div class="gap-bar-track"><div class="gap-bar-fill" style="background:var(--maroon-700);" data-w="28"></div></div><span class="val">2.8%</span></div>
          <div class="gap-bar-line"><span class="tag">มีชีวิต</span><div class="gap-bar-track"><div class="gap-bar-fill" style="background:var(--sage-light);" data-w="10"></div></div><span class="val">1.0%</span></div>
        </div>
      </div>
      <p style="font-size:.74rem; color:var(--sage); margin-top:.8rem; margin-bottom:0;">มะเร็งปอดพบในกลุ่มมรณภาพสูงกว่ากลุ่มมีชีวิตราว ๙ เท่า — สอดคล้องกับอัตราสูบบุหรี่ในพระสงฆ์ที่สูงกว่าประชากรทั่วไป</p>
    </div>
  </div>

  <!-- SECONDARY: screening-based data, de-emphasized -->
  <details class="secondary-info fade-in">
    <summary>📋 ข้อมูลเสริม: ผลการคัดกรองสุขภาพเชิงรุก พ.ศ. ๒๕๖๖–๒๕๖๗ (แตะเพื่อดู)</summary>
    <div class="secondary-body">
      <p style="font-size:.82rem; color:var(--ink-soft);">ต่างจากข้อมูล HISO ด้านบนซึ่งมาจากการวินิจฉัยจริงทั่วประเทศ ตัวเลขชุดนี้มาจาก<b>การคัดกรองสุขภาพเชิงรุก</b>ในพระสงฆ์กลุ่มตัวอย่างราว ๔๒,๐๐๐ รูป (๒๕๖๗) ซึ่งมักตรวจพบภาวะเสี่ยงได้มากกว่าการวินิจฉัยในระบบบริการทั่วไป</p>
      <div class="sub-stat-grid">
        <div class="sub-stat"><div class="n">55.4%</div><div class="l">ไขมันในเลือดสูง (คัดกรอง)</div></div>
        <div class="sub-stat"><div class="n">44.3%</div><div class="l">ดัชนีมวลกายเกินเกณฑ์</div></div>
        <div class="sub-stat"><div class="n">21% / 12%</div><div class="l">เสี่ยง / ป่วยจริง จากคัดกรอง ๔๒,๐๐๐ รูป</div></div>
        <div class="sub-stat"><div class="n">21.2%</div><div class="l">มีความรอบรู้ด้านสุขภาพเพียงพอ</div></div>
      </div>
      <div class="hiso-card" style="box-shadow:none; border-style:dashed;">
        <h4>ช่องว่างระหว่าง "คัดกรอง" กับ "วินิจฉัยจริง"</h4>
        <div class="note">ยิ่งช่องว่างกว้าง ยิ่งสะท้อนว่ามีพระสงฆ์ที่มีภาวะเสี่ยงแต่ยังไม่เข้าสู่ระบบรักษามาก ("treatment gap") — เป็นเหตุผลสนับสนุนแผนขับเคลื่อนที่ ๑ และ ๓</div>
        <div class="gap-row">
          <div class="gr-lbl">ไขมันในเลือดสูง</div>
          <div class="gap-bar-pair">
            <div class="gap-bar-line"><span class="tag">คัดกรอง</span><div class="gap-bar-track"><div class="gap-bar-fill screen" data-w="55.4"></div></div><span class="val">55.4%</span></div>
            <div class="gap-bar-line"><span class="tag">วินิจฉัยจริง</span><div class="gap-bar-track"><div class="gap-bar-fill diag" data-w="15.5"></div></div><span class="val">15.5%</span></div>
          </div>
        </div>
        <div class="gap-row">
          <div class="gr-lbl">ระดับน้ำตาล/เบาหวาน</div>
          <div class="gap-bar-pair">
            <div class="gap-bar-line"><span class="tag">คัดกรอง</span><div class="gap-bar-track"><div class="gap-bar-fill screen" data-w="15.6"></div></div><span class="val">15.6%</span></div>
            <div class="gap-bar-line"><span class="tag">วินิจฉัยจริง</span><div class="gap-bar-track"><div class="gap-bar-fill diag" data-w="10.0"></div></div><span class="val">10.0%</span></div>
          </div>
        </div>
        <div class="gap-row">
          <div class="gr-lbl">ความดันโลหิตสูง</div>
          <div class="gap-bar-pair">
            <div class="gap-bar-line"><span class="tag">คัดกรอง</span><div class="gap-bar-track"><div class="gap-bar-fill screen" data-w="18.5"></div></div><span class="val">18.5%</span></div>
            <div class="gap-bar-line"><span class="tag">วินิจฉัยจริง</span><div class="gap-bar-track"><div class="gap-bar-fill diag" data-w="17.2"></div></div><span class="val">17.2%</span></div>
          </div>
        </div>
      </div>
    </div>
  </details>
</section>

<!-- ============ SECTION 3: CHARTER DETAIL ============ -->
<section id="charter">
  <div class="sec-head fade-in">
    <p class="eyebrow">สาระสำคัญของธรรมนูญฯ ฉบับเต็ม</p>
    <h2>ธรรมนูญสุขภาพพระสงฆ์แห่งชาติ พ.ศ. ๒๕๖๖ มีอะไรบ้าง</h2>
    <p>ธรรมนูญฉบับนี้มีทั้งหมด <b>๕ หมวด ๓๐ ข้อ</b> — แตะแต่ละหมวดเพื่อดูสาระสำคัญของแต่ละข้อโดยสังเขป</p>
    <div class="divider"></div>
  </div>

  <div class="charter-wrap fade-in">

    <details class="chapter" open>
      <summary>
        <div class="chapter-num"><span>หมวด</span><span class="big">๑</span></div>
        <div class="chapter-title-wrap"><h3>ปรัชญาและแนวคิดหลักของธรรมนูญสุขภาพพระสงฆ์แห่งชาติ</h3><div class="art-range">ข้อ ๔ – ๖</div></div>
        <svg class="chapter-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="chapter-body">
        <div class="chapter-intro">วางฐานคิดว่า "สุขภาวะพระสงฆ์" คืออะไร และใครมีบทบาทอะไรในการดูแล</div>
        <div class="article-list">
          <div class="article-item highlight"><div class="article-num">ข้อ ๔</div><div class="article-txt"><b>นิยามสุขภาวะพระสงฆ์</b> — ครอบคลุม ๔ มิติตามหลักภาวนา ๔ ได้แก่ กายภาวนา สีลภาวนา จิตตภาวนา และปัญญาภาวนา</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๕</div><div class="article-txt">แนวคิดหลัก ๓ ประการ: พระสงฆ์ดูแลสุขภาพตนเองตามพระธรรมวินัย ชุมชน/สังคมดูแลอุปัฏฐากพระสงฆ์ตามพระธรรมวินัย และพระสงฆ์เป็นผู้นำด้านสุขภาวะของชุมชนและสังคม</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๖</div><div class="article-txt">การขับเคลื่อนธรรมนูญเป็นหน้าที่ร่วมกันของทุกภาคส่วนด้วยพลัง "บวร" ภายใต้หลักการ "ทางธรรมนำทางโลก" เชื่อมโยงแผนพัฒนากิจการพระพุทธศาสนาและเป้าหมายการพัฒนาที่ยั่งยืน สู่ "พระแข็งแรง วัดมั่นคง ชุมชนเป็นสุข"</div></div>
        </div>
      </div>
    </details>

    <details class="chapter">
      <summary>
        <div class="chapter-num"><span>หมวด</span><span class="big">๒</span></div>
        <div class="chapter-title-wrap"><h3>พระสงฆ์กับการดูแลสุขภาพตนเองตามหลักพระธรรมวินัย</h3><div class="art-range">ข้อ ๗ – ๑๑</div></div>
        <svg class="chapter-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="chapter-body">
        <div class="chapter-intro">กำหนดหน้าที่ของ "ตัวพระสงฆ์เอง" และ "วัด" ในการดูแลสุขภาพ</div>
        <div class="article-list">
          <div class="article-item"><div class="article-num">ข้อ ๗</div><div class="article-txt">พระสงฆ์พึงมีความรอบรู้ด้านสุขภาพ เพื่อให้มีสุขภาวะที่ดีและพร้อมปฏิบัติศาสนกิจ</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๘</div><div class="article-txt">พระสงฆ์พึงขวนขวายสร้างเสริมสุขภาพ ป้องกันควบคุมโรค และดูแลสุขภาพพระอุปัชฌาย์ อาจารย์ และสหธรรมิก</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๙</div><div class="article-txt">วัดพึงส่งเสริมให้พระสงฆ์มีความรอบรู้ด้านสุขภาพ จัดระบบและกลไกสร้างเสริมสุขภาพที่เกื้อกูลต่อการพัฒนาตนเอง</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๐</div><div class="article-txt">คณะสงฆ์แต่ละระดับพึงส่งเสริมให้วัดในเขตปกครองมีศักยภาพพัฒนาความรอบรู้ด้านสุขภาพ เช่น ฐานข้อมูลวัด-ประชา-รัฐ-สร้างสุข ศูนย์ประสานงานสุขภาวะวิถีพุทธ กุฏิสงฆ์อาพาธ วัดส่งเสริมสุขภาพ และพระคิลานุปัฏฐาก</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๑</div><div class="article-txt">คณะสงฆ์พึงส่งเสริมให้พระสงฆ์นำองค์ความรู้/ภูมิปัญญาด้านสุขภาพตามพระธรรมวินัยมาพัฒนาพระคิลานุปัฏฐาก เพื่อหนุนเสริมการดูแลสุขภาพตนเองและสหธรรมิก</div></div>
        </div>
      </div>
    </details>

    <details class="chapter">
      <summary>
        <div class="chapter-num"><span>หมวด</span><span class="big">๓</span></div>
        <div class="chapter-title-wrap"><h3>ชุมชนและสังคมกับการดูแลสุขภาพพระสงฆ์ที่ถูกต้องตามหลักพระธรรมวินัย</h3><div class="art-range">ข้อ ๑๒ – ๒๑</div></div>
        <svg class="chapter-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="chapter-body">
        <div class="chapter-intro">หมวดที่ยาวที่สุด — กำหนดบทบาทของ "รัฐ ชุมชน และองค์กรปกครองส่วนท้องถิ่น" ในการอุปัฏฐากพระสงฆ์</div>
        <div class="article-list">
          <div class="article-item"><div class="article-num">ข้อ ๑๒</div><div class="article-txt">รัฐ ชุมชน หน่วยงานและภาคีทุกภาคส่วน พึงส่งเสริมกิจกรรม/โครงการที่สอดคล้องกับแผนพัฒนากิจการพระพุทธศาสนาและนโยบายคณะสงฆ์</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๓</div><div class="article-txt">ชุมชนและสังคมพึงตระหนักดูแลพระสงฆ์ด้วยปัจจัย ๔ ที่เอื้อต่อพระธรรมวินัยและเป็นประโยชน์ต่อสุขภาวะ</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๔</div><div class="article-txt">รัฐพึงส่งเสริมให้หน่วยงานทุกระดับรณรงค์ให้สาธุชนตระหนักถึงการจัดอาหารบิณฑบาต น้ำปานะ ชุดสังฆทานที่มีคุณค่าทางโภชนาการ</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๕</div><div class="article-txt">รัฐ อปท. และภาคส่วนที่เกี่ยวข้อง พึงพัฒนาระบบบริการสาธารณสุขสำหรับพระสงฆ์ให้ครบวงจร รวมทั้งจัด อสม. และพระคิลานุปัฏฐากครอบคลุมทุกพื้นที่</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๖</div><div class="article-txt">รัฐและหน่วยงานที่เกี่ยวข้องพึงจัดชุดสิทธิประโยชน์พื้นฐานในระบบหลักประกันสุขภาพ ครอบคลุมการสร้างเสริมสุขภาพ ป้องกันโรค รักษาพยาบาล และฟื้นฟูสมรรถภาพ</div></div>
          <div class="article-item highlight"><div class="article-num">ข้อ ๑๗</div><div class="article-txt">อปท.และชุมชนพึงสนับสนุนงบประมาณสร้างเสริมสุขภาพพระสงฆ์ <b>จากงบท้องถิ่นและกองทุนต่างๆ รวมถึงกองทุนหลักประกันสุขภาพระดับพื้นที่</b></div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๘</div><div class="article-txt">รัฐพึงจัดระบบตรวจสุขภาพ คัดกรอง ให้คำปรึกษา และเสริมสร้างการปรับพฤติกรรมสุขภาพอย่างสม่ำเสมอต่อเนื่อง</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๑๙</div><div class="article-txt">รัฐ ชุมชน และภาคีพึงส่งเสริมให้วัดเป็นแหล่งเรียนรู้ด้านความรอบรู้สุขภาพและการดูแลสุขภาวะพระสงฆ์ที่เอื้อต่อพระธรรมวินัย</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๒๐</div><div class="article-txt">รัฐพึงสนับสนุนการสร้างองค์ความรู้ ภูมิปัญญา และนวัตกรรมสุขภาพ พัฒนาหลักสูตรในสถาบันการศึกษาคณะสงฆ์และสถาบันการศึกษาอื่นทุกระดับ</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๒๑</div><div class="article-txt">รัฐพึงพัฒนาสารสนเทศและสื่อสารสาธารณะด้านข้อมูลสุขภาวะพระสงฆ์ครอบคลุมทุกมิติ ให้เข้าถึงและใช้ประโยชน์ได้สะดวก รวดเร็ว ทันเหตุการณ์</div></div>
        </div>
      </div>
    </details>

    <details class="chapter">
      <summary>
        <div class="chapter-num"><span>หมวด</span><span class="big">๔</span></div>
        <div class="chapter-title-wrap"><h3>บทบาทพระสงฆ์ในการเป็นผู้นำด้านสุขภาวะชุมชนและสังคม</h3><div class="art-range">ข้อ ๒๒ – ๒๕</div></div>
        <svg class="chapter-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="chapter-body">
        <div class="chapter-intro">พลิกบทบาทพระสงฆ์จาก "ผู้ถูกดูแล" สู่ "ผู้นำสุขภาวะ" ของชุมชน</div>
        <div class="article-list">
          <div class="article-item"><div class="article-num">ข้อ ๒๒</div><div class="article-txt">พระสงฆ์และคณะสงฆ์พึงส่งเสริมให้ชุมชนเกิดการเรียนรู้เข้าใจสุขภาวะทุกมิติ สู่เป้าหมายการพัฒนาที่ยั่งยืน โดยชุมชนพึงเปิดกว้างให้พระสงฆ์เป็นหุ้นส่วนทุกระดับ</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๒๓</div><div class="article-txt">พระสงฆ์และคณะสงฆ์พึงพัฒนาวัดให้เป็นกลไกดูแลสุขภาวะชุมชนและสังคม นำองค์ความรู้/ภูมิปัญญาด้านสุขภาพตามพระธรรมวินัยไปประยุกต์ใช้</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๒๔</div><div class="article-txt">คณะสงฆ์แต่ละระดับพึงกำหนดนโยบาย มาตรการ แผนงาน โครงการที่สอดคล้องกับแผนพัฒนากิจการพระพุทธศาสนา ให้วัดและพระสงฆ์มีบทบาทพัฒนาความรอบรู้ด้านสุขภาพในชุมชน</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๒๕</div><div class="article-txt">คณะสงฆ์พึงใช้กลไกคณะสงฆ์แต่ละระดับ รวมถึงเครือข่ายองค์กรทางพระพุทธศาสนา บูรณาการหลักพุทธธรรมเพื่อขับเคลื่อนการดูแลสุขภาวะชุมชนและสังคมอย่างเป็นรูปธรรมและต่อเนื่อง</div></div>
        </div>
      </div>
    </details>

    <details class="chapter">
      <summary>
        <div class="chapter-num"><span>หมวด</span><span class="big">๕</span></div>
        <div class="chapter-title-wrap"><h3>การขับเคลื่อนธรรมนูญสุขภาพพระสงฆ์แห่งชาติสู่การปฏิบัติ</h3><div class="art-range">ข้อ ๒๖ – ๓๐</div></div>
        <svg class="chapter-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="chapter-body">
        <div class="chapter-intro">กลไกและวินัยในการทบทวน — หมวดที่เชื่อมสู่ "ฐานทุนการดำเนินงาน" และ "แผนขับเคลื่อน ๕ แผน"</div>
        <div class="article-list">
          <div class="article-item"><div class="article-num">ข้อ ๒๖</div><div class="article-txt">คณะสงฆ์พึงจัดให้มีกลไกระดับชาติ มีผู้แทนคณะสงฆ์ พศ. หน่วยงานและภาคีทุกภาคส่วน กำหนดทิศทาง บูรณาการแผน ติดตามประเมินผล และสร้างกลไกมีส่วนร่วมระดับพื้นที่</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๒๗</div><div class="article-txt">พระสงฆ์ คณะสงฆ์ ชุมชน สังคม หน่วยงานและภาคีทุกภาคส่วน พึงนำธรรมนูญเป็นกรอบแนวทาง และสามารถจัดทำธรรมนูญสุขภาพพระสงฆ์ระดับพื้นที่ที่สอดคล้องกับบริบทได้</div></div>
          <div class="article-item highlight"><div class="article-num">ข้อ ๒๘</div><div class="article-txt"><b>คณะสงฆ์พึงจัดตั้งและพัฒนา "กองทุนเพื่อสุขภาวะพระสงฆ์ ชุมชน และสังคม"</b> ทั้งในระดับชาติและระดับพื้นที่ โดยมีระบบบริหารจัดการที่สอดคล้องกับหลักพระธรรมวินัยและหลักธรรมาภิบาล — ฐานทุนหลักที่ขับเคลื่อนงานทั้งหมด</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๒๙</div><div class="article-txt">รัฐ สถาบันการศึกษาคณะสงฆ์ และสถาบันวิชาการ พึงสนับสนุนงานวิจัย การจัดการความรู้ องค์ความรู้และนวัตกรรม สร้างเครือข่ายนักวิจัย และสื่อสารข้อมูลการขับเคลื่อนธรรมนูญอย่างต่อเนื่อง</div></div>
          <div class="article-item"><div class="article-num">ข้อ ๓๐</div><div class="article-txt">กลไกตามข้อ ๒๖ ต้องรายงานผลการขับเคลื่อนต่อมหาเถรสมาคม และจัดกระบวนการมีส่วนร่วมเพื่อติดตามผล <b>ทบทวนธรรมนูญอย่างน้อยทุก ๕ ปี</b></div></div>
        </div>
      </div>
    </details>

  </div>
</section>

<!-- ============ SECTION 4: FOUNDATIONAL CAPACITY + DONE ============ -->
<section id="done">
  <div class="sec-head fade-in">
    <p class="eyebrow">เบื้องหลังการขับเคลื่อน</p>
    <h2>ฐานทุนการดำเนินงาน และผลที่ทำแล้ว</h2>
    <p>ฐานทุนที่แท้จริงของธรรมนูญฯ คือ "คนและกลไกในพื้นที่" ที่สั่งสมมาต่อเนื่อง — กำลังคนอาสาสมัคร เครือข่ายวัดต้นแบบ และภาคีที่ร่วมขับเคลื่อน</p>
    <div class="divider"></div>
  </div>

  <div class="fade-in">
    <div class="subsection-head">
      <h3>🌱 ฐานทุนการดำเนินงาน: กำลังคนและเครือข่ายวัด</h3>
      <p>สองฐานทุนหลักที่ขับเคลื่อนงานสุขภาพพระสงฆ์ทั่วประเทศมาต่อเนื่องกว่า 20 ปี คือ "พระคิลานุปัฏฐาก" (กำลังคนอาสาสมัคร) และ "วัดส่งเสริมสุขภาพ" (เครือข่ายพื้นที่)</p>
    </div>

    <div class="capacity-grid">
      <div class="capacity-card">
        <div class="cc-top"><div class="n">14,421</div><div class="yr">รูป (ล่าสุด)</div></div>
        <div class="l">พระคิลานุปัฏฐาก (อสว.) ที่ผ่านการอบรม — เปรียบเสมือน "อสม. ประจำวัด" ทำหน้าที่ดูแลสหธรรมิกและเป็นผู้นำสุขภาวะชุมชน</div>
        <div class="growth-mini">
          <div class="gm-col"><div class="gm-bar" data-h="30"></div><div class="gm-val">~4,000</div><div class="gm-lbl">2562</div></div>
          <div class="gm-col"><div class="gm-bar" data-h="91"></div><div class="gm-val">13,114</div><div class="gm-lbl">2566</div></div>
          <div class="gm-col"><div class="gm-bar" data-h="100"></div><div class="gm-val">14,421</div><div class="gm-lbl">ล่าสุด</div></div>
        </div>
      </div>
      <div class="capacity-card">
        <div class="cc-top"><div class="n">19,484</div><div class="yr">แห่ง (2567)</div></div>
        <div class="l">วัดที่ผ่านเกณฑ์ "วัดส่งเสริมสุขภาพ" ทั่วประเทศ — ใช้หลัก "5ร" เป็นศูนย์กลางส่งเสริมสุขภาพพระสงฆ์และชุมชนโดยรอบ</div>
        <div class="growth-mini">
          <div class="gm-col"><div class="gm-bar" data-h="22"></div><div class="gm-val">4,191</div><div class="gm-lbl">2562</div></div>
          <div class="gm-col"><div class="gm-bar" data-h="78"></div><div class="gm-val">15,126</div><div class="gm-lbl">2565</div></div>
          <div class="gm-col"><div class="gm-bar" data-h="100"></div><div class="gm-val">19,484</div><div class="gm-lbl">2567</div></div>
        </div>
      </div>
    </div>

    <div class="hiso-card" style="margin-bottom:1.6rem;">
      <h4>เส้นทางการยกระดับวัด: จาก "ส่งเสริมสุขภาพ" สู่ "อาโรคยาสถาน"</h4>
      <div class="note">กรมอนามัยพัฒนาเกณฑ์ต่อยอดเป็นลำดับขั้น เพื่อยกระดับศักยภาพวัดให้เป็นสถานีสุขภาพของชุมชน</div>
      <div class="ladder">
        <div class="ladder-step"><div class="st">ขั้นพื้นฐาน</div><div class="tt">วัดส่งเสริมสุขภาพ</div><div class="yr2">เริ่ม 2545 · หลัก "5ร"</div></div>
        <div class="ladder-arrow">→</div>
        <div class="ladder-step"><div class="st">ขั้นกลาง</div><div class="tt">วัดรอบรู้ด้านสุขภาพ</div><div class="yr2">Health Literate Temple · 2562</div></div>
        <div class="ladder-arrow">→</div>
        <div class="ladder-step"><div class="st">ขั้นสูง</div><div class="tt">อาโรคยาสถาน</div><div class="yr2">Health Station at Temple · 2567</div></div>
      </div>
    </div>

    <div class="hiso-card" style="box-shadow:var(--shadow);">
      <h4>เครือข่ายภาคี 15 หน่วยงานร่วมขับเคลื่อน</h4>
      <div class="note">แบ่งตาม ๔ ภาคส่วนหลัก ตามภาคผนวก ๒ ของแผนปฏิบัติการ — ฐานทุนเชิงความร่วมมือที่เสริมกำลังคนและเครือข่ายวัดข้างต้น</div>
      <div class="sector-grid">
        <div class="sector-card"><div class="n">8</div><div class="l">ภาครัฐ<br>(สธ. สปสช. สสส. สช. มท. ฯลฯ)</div></div>
        <div class="sector-card"><div class="n">3</div><div class="l">ภาควิชาการ<br>(มจร. มมร. สงฆ์ไทยไกลโรค)</div></div>
        <div class="sector-card"><div class="n">3</div><div class="l">ภาคประชาสังคม<br>(เครือข่ายพระสงฆ์/ชุมชน)</div></div>
        <div class="sector-card"><div class="n">1</div><div class="l">ภาคการปกครองคณะสงฆ์<br>(ฝ่ายสาธารณสงเคราะห์ มส.)</div></div>
      </div>
      <details class="org-list">
        <summary>ดูรายชื่อภาคีทั้ง ๑๕ หน่วยงาน</summary>
        <div class="org-table-wrap">
          <table class="org-table">
            <thead><tr><th>หน่วยงาน</th><th>บทบาทหลัก</th><th>ภาคส่วน</th></tr></thead>
            <tbody>
              <tr><td>ฝ่ายสาธารณสงเคราะห์ มหาเถรสมาคม</td><td>ขับเคลื่อนสุขภาวะพระสงฆ์ภายใต้แผนปฏิรูปกิจการพระพุทธศาสนา</td><td class="sector-tag">คณะสงฆ์</td></tr>
              <tr><td>มจร. / มมร.</td><td>บริการวิชาการด้านสุขภาวะพระสงฆ์</td><td class="sector-tag">วิชาการ</td></tr>
              <tr><td>เครือข่ายพระคิลานธรรม / เครือข่ายพระสงฆ์สาธารณสงเคราะห์</td><td>ขับเคลื่อนงานสร้างเสริมสุขภาวะพระสงฆ์ในพื้นที่</td><td class="sector-tag">ประชาสังคม</td></tr>
              <tr><td>สำนักนายกรัฐมนตรี</td><td>กำกับติดตามการดำเนินงาน</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>สำนักงานพระพุทธศาสนาแห่งชาติ</td><td>พัฒนาและขับเคลื่อนธรรมนูญภายใต้งานสาธารณสงเคราะห์</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>กระทรวงสาธารณสุข</td><td>พระคิลานุปัฏฐาก วัดส่งเสริมสุขภาพ โรงพยาบาลสงฆ์ โครงการ NCDs</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>สำนักงานคณะกรรมการสุขภาพแห่งชาติ (สช.)</td><td>ประสานภาคี พัฒนาแผนปฏิบัติการ เชื่อมฐานข้อมูล</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>สปสช.</td><td>สิทธิหลักประกันสุขภาพของพระสงฆ์สามเณร</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>สสส.</td><td>สนับสนุนการขับเคลื่อนสุขภาวะพระสงฆ์ผ่านโครงการต่างๆ</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>กระทรวงมหาดไทย</td><td>ระบบฐานข้อมูลพระสงฆ์สามเณร การขับเคลื่อนระดับพื้นที่</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>กรมการศาสนา</td><td>วัดคู่ชุมชนคุณธรรม อาหารสุขภาพพระสงฆ์</td><td class="sector-tag">ภาครัฐ</td></tr>
              <tr><td>โครงการสงฆ์ไทยไกลโรค</td><td>ชุดความรู้ / สื่อดิจิทัล (หนุนโดย สสส.)</td><td class="sector-tag">วิชาการ</td></tr>
              <tr><td>เครือข่ายโรงเรียนเบาหวานคณาราม</td><td>พัฒนาวัดเป็นศูนย์กลางสร้างสังคมสุขภาวะ</td><td class="sector-tag">ประชาสังคม</td></tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  </div>

  <div class="fade-in" style="margin-top:3rem;">
    <div class="subsection-head">
      <h3>✅ ผลการดำเนินงานที่ผ่านมา</h3>
      <p>กลไกและเครื่องมือที่เกิดขึ้นแล้วภายใต้ธรรมนูญสุขภาพพระสงฆ์ ซึ่งเป็นฐานต่อยอดสู่แผนขับเคลื่อน ๒๕๖๙–๒๕๗๕</p>
    </div>
    <div class="done-grid">
      <div class="done-card"><div class="icon">๐๑</div><span class="tag">ธรรมนูญ</span><h4>ธรรมนูญสุขภาพพระสงฆ์ ฉบับที่ ๒</h4><p>ทบทวนจากฉบับ ๒๕๖๐ สู่ฉบับ ๒๕๖๖ ประกาศใช้ทั่วคณะสงฆ์ทุกระดับ โดยสมเด็จพระสังฆราชทรงลงพระนาม</p></div>
      <div class="done-card"><div class="icon">🩺</div><span class="tag">บุคลากร</span><h4>พระคิลานุปัฏฐาก (อสว.)</h4><p>หลักสูตรอบรม ๗๐ ชั่วโมง ๓ หมวด ครอบคลุมพระธรรมวินัยกับการดูแลสุขภาพ การส่งเสริมสุขภาพ และการพัฒนาวัด-ชุมชน</p></div>
      <div class="done-card"><div class="icon">🏯</div><span class="tag">มาตรฐานวัด</span><h4>วัดส่งเสริมสุขภาพ (๕ร)</h4><p>สะอาดร่มรื่น สงบร่มเย็น สุขภาพร่วมสร้าง ศิลปะร่วมจิตวิญญาณ ชาวประชาร่วมพัฒนา</p></div>
      <div class="done-card"><div class="icon">📘</div><span class="tag">เครื่องมือ</span><h4>สมุดบันทึกสุขภาพพระสงฆ์</h4><p>บันทึกประวัติ ประเมินพฤติกรรมสุขภาพ และคัดกรองความเสี่ยงด้วยตนเอง เชื่อมระบบ Health Temple กรมอนามัย</p></div>
      <div class="done-card"><div class="icon">💳</div><span class="tag">สิทธิประโยชน์</span><h4>สิทธิหลักประกันสุขภาพแห่งชาติ</h4><p>ระบบตรวจสอบสิทธิ ลงทะเบียน และเข้ารับบริการสำหรับพระภิกษุสามเณร ผ่าน สปสช. สายด่วน ๑๓๓๐ / ฉุกเฉิน ๑๖๖๙</p></div>
      <div class="done-card"><div class="icon">🌐</div><span class="tag">สื่อ/ดิจิทัล</span><h4>โครงการสงฆ์ไทยไกลโรค</h4><p>สนับสนุนโดย สสส. รวมองค์ความรู้ผ่านเว็บไซต์ เว็บแอปฯ “เณรกล้าโภชนาดี” และช่อง YouTube สื่อสุขภาพ</p></div>
      <div class="done-card"><div class="icon">🛏️</div><span class="tag">การดูแลระยะท้าย</span><h4>กุฏิชีวาภิบาล</h4><p>ดูแลพระสงฆ์อาพาธระยะท้ายอย่างมีคุณภาพ พร้อมระบบรักษาแบบ Fast Track เชื่อมโรงพยาบาลสงฆ์</p></div>
      <div class="done-card"><div class="icon">🥗</div><span class="tag">รณรงค์</span><h4>รณรงค์การถวายอาหารเพื่อสุขภาพ</h4><p>ส่งเสริมประชาชนเลือกอาหารใส่บาตร/ถวายภัตตาหารที่ไขมันต่ำ หวานน้อย เค็มน้อย</p></div>
    </div>
  </div>
</section>

<!-- ============ SECTION 5: PLANS ============ -->
<section id="plans">
  <div class="sec-head fade-in">
    <p class="eyebrow">พ.ศ. ๒๕๖๙–๒๕๗๕</p>
    <h2>แผนขับเคลื่อนธรรมนูญสุขภาพพระสงฆ์ ๕ แผน</h2>
    <p>แต่ละแผนออกแบบมาเพื่อตอบ Painpoint จากสถานการณ์จริงของพระสงฆ์และวัด — แตะที่แผนเพื่อดูปัญหาตั้งต้นและแนวคิดหลัก</p>
    <div class="divider"></div>
  </div>

  <div class="plans-wrap fade-in">

    <details class="plan" open>
      <summary>
        <div class="plan-num">๑</div>
        <div class="plan-title"><h3>การเสริมสร้างความรอบรู้ทางสุขภาพอย่างเท่าทัน ให้พระสงฆ์ดูแลสุขภาพตนเองตามหลักพระธรรมวินัย และควบคุมป้องกันโรคอย่างเท่าทัน</h3></div>
        <svg class="plan-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="plan-body">
        <div class="pain-box">
          <div class="ttl">⚠ Painpoint ตั้งต้น</div>
          <ul>
            <li>พระสงฆ์มีความรอบรู้ด้านสุขภาพเพียงพอเพียง ๒๑.๒% เท่านั้น</li>
            <li>พระสงฆ์เลือกฉันอาหารเองไม่ได้ ต้องรับตามที่ญาติโยมถวาย</li>
            <li>ข้อจำกัดทางพระธรรมวินัย เช่น การสัมผัสร่างกาย การตรวจจากแพทย์หญิง ทำให้เข้าถึงความรู้/บริการยาก</li>
          </ul>
        </div>
        <div class="concept-box">
          <div class="ttl">✦ แนวคิดหลัก</div>
          <p>บูรณาการภูมิปัญญาพุทธ (สติปัฏฐาน ๔ มรรคมีองค์ ๘ เศรษฐกิจพอเพียง) กับความรู้การแพทย์สมัยใหม่ ใช้วิธีสอนแบบโซเครติกและ “ชุมชนนักปฏิบัติ” (Community of Practice) เพื่อสร้างเครือข่ายเรียนรู้ระหว่างพระสงฆ์ โดยไม่ขัดต่อพระธรรมวินัย</p>
        </div>
      </div>
    </details>

    <details class="plan">
      <summary>
        <div class="plan-num">๒</div>
        <div class="plan-title"><h3>การเสริมสร้างสังคมสุขภาวะ และพัฒนานิเวศสุขภาพวัดที่เอื้อต่อการมีสุขภาพดีอย่างยั่งยืนบนฐานการมีส่วนร่วมระหว่างวัดและชุมชน</h3></div>
        <svg class="plan-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="plan-body">
        <div class="pain-box">
          <div class="ttl">⚠ Painpoint ตั้งต้น</div>
          <ul>
            <li>สภาพแวดล้อมวัดจำนวนมากยังไม่เอื้อต่อสุขภาพ ทั้งสุขาภิบาลและพื้นที่ออกกำลังกาย</li>
            <li>วัฒนธรรมการถวายอาหาร/ใส่บาตรยังไม่คำนึงถึงสุขภาพ (กะทิ ของทอด ของหวาน)</li>
            <li>กุฏิชีวาภิบาลและระบบดูแลในวัดยังไม่ได้มาตรฐานอย่างทั่วถึง</li>
          </ul>
        </div>
        <div class="concept-box">
          <div class="ttl">✦ แนวคิดหลัก</div>
          <p>ยึดหลักปฏิจจสมุปบาท (สุขภาพเชื่อมโยงกับสิ่งแวดล้อม) และสังคหวัตถุ ๔ พัฒนาวัดให้เป็น “โอเอซิสแห่งสุขภาพ” ผ่านแนวทางวัดส่งเสริมสุขภาพและ “วัด-ประชา-รัฐ-สร้างสุข” โดยชุมชนและวัดเกื้อกูลกันตามหลักกตัญญุตากตเวทิตา</p>
        </div>
      </div>
    </details>

    <details class="plan">
      <summary>
        <div class="plan-num">๓</div>
        <div class="plan-title"><h3>การดูแลสุขภาพ และการฟื้นฟูสุขภาพพระสงฆ์อาพาธแบบองค์รวม สะดวก ปลอดภัย ไร้รอยต่อ อย่างต่อเนื่อง ทั่วถึง ที่มีคุณภาพ และเป็นไปตามพระธรรมวินัย</h3></div>
        <svg class="plan-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="plan-body">
        <div class="pain-box">
          <div class="ttl">⚠ Painpoint ตั้งต้น</div>
          <ul>
            <li>พระสงฆ์อาพาธระยะท้ายกว่า ๙,๖๕๕ รูป ต้องการการดูแลเฉพาะทางที่เหมาะสม</li>
            <li>ข้อจำกัดพระธรรมวินัย เช่น การสัมผัสร่างกาย แพทย์หญิง ความเป็นส่วนตัวในการตรวจรักษา</li>
            <li>ระบบส่งต่อระหว่างสถานพยาบาลยังไม่ไร้รอยต่อ การเข้าถึงบริการจำกัดด้วยเวลา/สถานที่ที่ไม่เหมาะกับวิถีสงฆ์</li>
          </ul>
        </div>
        <div class="concept-box">
          <div class="ttl">✦ แนวคิดหลัก</div>
          <p>ยึดหลัก “พุทธบริบาล” มองความเจ็บป่วยเป็นโอกาสพัฒนาจิตใจและปัญญา ใช้ไตรสิกขา (ศีล สมาธิ ปัญญา) ในการฟื้นฟู เน้นความต่อเนื่องของการดูแล (Continuum of Care) และทีมสหวิชาชีพที่เข้าใจวิถีชีวิตพระสงฆ์</p>
        </div>
      </div>
    </details>

    <details class="plan">
      <summary>
        <div class="plan-num">๔</div>
        <div class="plan-title"><h3>การพัฒนาบุคลากร การจัดการความรู้ เทคโนโลยีสารสนเทศ และนวัตกรรมการดูแลสุขภาพพระสงฆ์</h3></div>
        <svg class="plan-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="plan-body">
        <div class="pain-box">
          <div class="ttl">⚠ Painpoint ตั้งต้น</div>
          <ul>
            <li>จำนวนพระคิลานุปัฏฐากและอาสาสมัครยังไม่เพียงพอเมื่อเทียบกับพระสงฆ์ทั่วประเทศ</li>
            <li>ฐานข้อมูลสุขภาพพระสงฆ์กระจัดกระจาย ไม่เชื่อมโยงระหว่างหน่วยงาน</li>
            <li>ขาดงานวิจัย/นวัตกรรมที่ออกแบบมาเฉพาะสำหรับวิถีชีวิตและข้อจำกัดของสมณเพศ</li>
          </ul>
        </div>
        <div class="concept-box">
          <div class="ttl">✦ แนวคิดหลัก</div>
          <p>ยึดหลักการเรียนรู้ตลอดชีวิตแบบพุทธ (Lifelong Learning) สร้างบุคลากรที่มี “จิตวิญญาณของการบริการ” ควบคู่ความรู้ทางเทคนิค ใช้เทคโนโลยี/AI อย่างพอประมาณตามหลักมัชฌิมาปฏิปทา และพัฒนานวัตกรรมอย่างเรียบง่าย ประหยัด ตามปรัชญาเศรษฐกิจพอเพียง</p>
        </div>
      </div>
    </details>

    <details class="plan">
      <summary>
        <div class="plan-num">๕</div>
        <div class="plan-title"><h3>การบริหารธรรมนูญสุขภาพพระสงฆ์ และการขับเคลื่อนสู่การปฏิบัติทั่วทั้งประเทศอย่างมีประสิทธิภาพ และยั่งยืน</h3></div>
        <svg class="plan-chevron" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </summary>
      <div class="plan-body">
        <div class="pain-box">
          <div class="ttl">⚠ Painpoint ตั้งต้น</div>
          <ul>
            <li>ขาดกลไกเชื่อมโยงงบประมาณและหน่วยงานภาคีให้ขับเคลื่อนไปในทิศทางเดียวกันทั่วประเทศ</li>
            <li>นโยบายระดับชาติกับการนำไปปฏิบัติจริงในระดับพื้นที่/วัดยังไม่สอดคล้องกัน</li>
            <li>กลไกการเงินสนับสนุนยังพึ่งพาแหล่งทุนจำกัด ไม่หลากหลายและไม่ยั่งยืน</li>
          </ul>
        </div>
        <div class="concept-box">
          <div class="ttl">✦ แนวคิดหลัก</div>
          <p>ประยุกต์หลักอิทธิบาท ๔ (ฉันทะ วิริยะ จิตตะ วิมังสา) ในการขับเคลื่อนนโยบาย กระจายอำนาจสู่พื้นที่ภายใต้กรอบร่วม ใช้หลักสาราณียธรรม ๖ ในการประสานภาคี และสร้างกลไกการเงิน/นวัตกรรมทางสังคมที่หลากหลายไม่พึ่งพาแหล่งเดียว (สอดคล้องกับกองทุนตามข้อ ๒๘)</p>
        </div>
      </div>
    </details>

  </div>
</section>


<footer>
  จัดทำเพื่อการสื่อสารภายใน อ้างอิงจาก “คู่มือธรรมนูญสุขภาพพระสงฆ์แห่งชาติ พ.ศ. ๒๕๖๖” (๕ หมวด ๓๐ ข้อ), “แผนปฏิบัติการเพื่อการขับเคลื่อนธรรมนูญสุขภาพพระสงฆ์แห่งชาติ พ.ศ. ๒๕๖๙–๒๕๗๕” และข้อมูลเชื่อมโยงทะเบียนพระสงฆ์สามเณรกับฐานการวินิจฉัยโรค HISO (พ.ศ. ๒๕๖๘, N=237,725) <br>
  จัดพิมพ์โดย <b>สำนักงานคณะกรรมการสุขภาพแห่งชาติ (สช.)</b> — เป้าหมายร่วม “พระแข็งแรง วัดมั่นคง ชุมชนเป็นสุข”
</footer>`;
  initDashboard(container);
}

function initDashboard(container) {
  animateFadeIn(container);
  animateBars(container);
  animateGapBars(container);
  animateCounters(container);
  animateGrpBars(container);

// Nav active state + smooth scroll
  const navButtons = document.querySelectorAll('.navlinks button');
  const sections = ['why','stats','charter','done','plans'].map(id=>document.getElementById(id));
  navButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.getElementById(btn.dataset.target).scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        navButtons.forEach(b=>b.classList.toggle('active', b.dataset.target===e.target.id));
      }
    });
  }, {rootMargin:'-40% 0px -55% 0px', threshold:0});
  sections.forEach(s=>spy.observe(s));

  // Fade-in on scroll
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); fadeObs.unobserve(e.target); } });
  }, {threshold:.12});
  fadeEls.forEach(el=>fadeObs.observe(el));

  // Count-up stats
  const counters = document.querySelectorAll('.stat-num');
  const countObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = String(el.dataset.count).includes('.');
        const isBig = target > 999;
        let cur = 0;
        const dur = 1400;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now-start)/dur, 1);
          const eased = 1 - Math.pow(1-p, 3);
          cur = target * eased;
          let display = isDecimal ? cur.toFixed(1) : Math.round(cur);
          if(isBig) display = Number(display).toLocaleString('th-TH');
          el.textContent = display + suffix;
          if(p<1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      }
    });
  }, {threshold:.4});
  counters.forEach(c=>countObs.observe(c));

  // Bar fills (all types)
  const barSelectors = '.bar-fill, .gap-bar-fill';
  const bars = document.querySelectorAll(barSelectors);
  const barObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.style.width = e.target.dataset.w + '%'; barObs.unobserve(e.target); }
    });
  }, {threshold:.3});
  bars.forEach(b=>barObs.observe(b));

  // Growth mini vertical bars (capacity section)
  const gmBars = document.querySelectorAll('.gm-bar');
  const gmObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.style.height = e.target.dataset.h + '%'; gmObs.unobserve(e.target); }
    });
  }, {threshold:.3});
  gmBars.forEach(b=>gmObs.observe(b));

  // Age-gradient interactive chart
  const ageData = {
    I10: [3.2, 14.6, 33.6],
    E11: [2.1, 10.9, 17.7],
    E78: [3.7, 15.9, 28.2],
    N18: [0.4, 2.5, 9.1]
  };
  function renderAgeChart(code){
    const vals = ageData[code];
    const max = 35;
    vals.forEach((v,i)=>{
      const bar = document.getElementById('ageBar'+i);
      const val = document.getElementById('ageVal'+i);
      requestAnimationFrame(()=>{
        bar.style.height = (v/max*100) + '%';
        val.textContent = v + '%';
      });
    });
  }
  const chips = document.querySelectorAll('.chip[data-disease]');
  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      renderAgeChart(chip.dataset.disease);
    });
  });
  const ageChartObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ renderAgeChart('I10'); ageChartObs.unobserve(e.target); }
    });
  }, {threshold:.3});
  const ageChartEl = document.getElementById('ageChart');
  if(ageChartEl) ageChartObs.observe(ageChartEl);

  // Bhavana wheel (4 segments)
  const bhavana = [
    {name:'กายภาวนา', desc:'การพัฒนาทางกายให้เกิดเป็นกุศลกรรม — ดูแลร่างกาย อาหาร การเคลื่อนไหวอย่างเหมาะสม', color:'#E8A23A'},
    {name:'สีลภาวนา', desc:'การเจริญศีล พัฒนาความประพฤติอยู่ร่วมกับผู้อื่นและเกื้อกูลระหว่างกัน', color:'#7C9A85'},
    {name:'จิตตภาวนา', desc:'การเจริญทางจิตใจให้เกิดความมั่นคง โดยมีคุณธรรมเป็นที่ตั้ง', color:'#C97B1D'},
    {name:'ปัญญาภาวนา', desc:'การเจริญปัญญาให้เกิดความรู้แจ้ง เห็นตามความเป็นจริง นำไปสู่การแก้ไขปัญหา', color:'#4F6B58'}
  ];
  const svgNS = 'http://www.w3.org/2000/svg';
  const segGroup = document.getElementById('segments');
  const cx=150, cy=150, rOuter=128, rInner=48;
  function polar(cx,cy,r,angleDeg){
    const a = (angleDeg-90) * Math.PI/180;
    return [cx + r*Math.cos(a), cy + r*Math.sin(a)];
  }
  bhavana.forEach((seg, i)=>{
    const start = i*90 + 2, end = (i+1)*90 - 2;
    const [x1,y1] = polar(cx,cy,rOuter,start);
    const [x2,y2] = polar(cx,cy,rOuter,end);
    const [x3,y3] = polar(cx,cy,rInner,end);
    const [x4,y4] = polar(cx,cy,rInner,start);
    const path = document.createElementNS(svgNS,'path');
    const d = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', seg.color);
    path.setAttribute('opacity', '0.88');
    path.setAttribute('stroke', '#33090D');
    path.setAttribute('stroke-width', '2');
    path.style.cursor = 'pointer';
    path.style.transition = 'opacity .2s, transform .2s';
    path.addEventListener('mouseenter', ()=>{ path.setAttribute('opacity','1'); });
    path.addEventListener('mouseleave', ()=>{ path.setAttribute('opacity','0.88'); });
    path.addEventListener('click', ()=>{
      document.querySelector('#bhavana-panel .bp-title').textContent = seg.name;
      document.querySelector('#bhavana-panel .bp-body').textContent = seg.desc;
    });
    segGroup.appendChild(path);

    const midAngle = (start+end)/2;
    const [lx,ly] = polar(cx,cy,(rOuter+rInner)/2, midAngle);
    const label = document.createElementNS(svgNS,'text');
    label.setAttribute('x', lx); label.setAttribute('y', ly+4);
    label.setAttribute('text-anchor','middle');
    label.setAttribute('fill', '#33090D');
    label.setAttribute('font-family', 'Sarabun');
    label.setAttribute('font-weight', '700');
    label.setAttribute('font-size', '11.5');
    label.style.pointerEvents = 'none';
    label.textContent = seg.name;
    segGroup.appendChild(label);
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced){
    let deg = 0;
    const outerRing = document.querySelector('#bhavanaWheel circle[stroke-width="1"]');
    function spin(){
      deg += 0.03;
      outerRing.setAttribute('stroke-dasharray', '2 6');
      outerRing.setAttribute('stroke-dashoffset', deg*3);
      requestAnimationFrame(spin);
    }
    requestAnimationFrame(spin);
  }
  // Dashboard sub-nav
  const dashNavBtns = container.querySelectorAll('.dash-nav-btn');
  const dashSections = ['why','stats','charter','done','plans'].map(id=>document.getElementById(id));
  dashNavBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target = document.getElementById(btn.dataset.dtarget);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  const dashSpy = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        dashNavBtns.forEach(b=>b.classList.toggle('active', b.dataset.dtarget===e.target.id));
      }
    });
  }, {rootMargin:'-40% 0px -55% 0px', threshold:0});
  dashSections.forEach(s=>{ if(s) dashSpy.observe(s); });
}

// Also expose for direct use
const firstPageInit = initDashboard;
