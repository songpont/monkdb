# ธรรมนูญสุขภาพพระสงฆ์แห่งชาติ — Dashboard

Single Page Application แสดงข้อมูลสุขภาพพระสงฆ์ไทย จากฐานข้อมูล HISO (พ.ศ. 2568) รวม 6 มิติในหน้าเดียว

## หน้า

| หน้า | คำอธิบาย |
|------|----------|
| **ภาพรวม** | ธรรมนูญสุขภาพพระสงฆ์แห่งชาติ พ.ศ. 2566 — สถานการณ์ 2568, สาระสำคัญ 5 หมวด 30 ข้อ, ฐานทุน, แผนขับเคลื่อน 5 แผน |
| **คลัสเตอร์โรค** | จัดกลุ่มโรคร่วม, วิเคราะห์เชิงพื้นที่, Hotspot วัณโรค/HIV, อันดับวัดเสี่ยง |
| **ภาระโรค** | ภาระโรค × อายุ × สถานะ (สามเณร/พระภิกษุ), อายุขณะบวช, จิตเวช/สารเสพติด |
| **Priority Score** | แนวโน้มมรณภาพ, รุ่นบวช, Priority Score ระดับจังหวัด |
| **เทียบคนทั่วไป** | เทียบอัตราป่วยพระสงฆ์ vs ชายไทยทั่วไป 30 โรค (diverging ratio chart) |
| **สำรวจความชุก** | แผนที่ประเทศไทย 77 จังหวัด, เลือกดูทีละโรค, จัดอันดับประเทศ |

## ข้อมูล

- **แหล่งข้อมูล:** HISO 2568 — เชื่อมโยงทะเบียนพระภิกษุสามเณร 237,725 รูป กับประวัติการวินิจฉัยโรคจริง
- **พบประวัติสุขภาพ:** 220,296 รูป (92.7%)
- **30 โรค** ตามรหัส ICD-10

## เทคโนโลยี

- Vanilla JS (ES modules) — ไม่มี framework
- Build ด้วย **Vite**, deploy เป็น static assets บน **Cloudflare Workers**
- Global CSS ไฟล์เดียว (`css/styles.css`)
- Hash-based SPA routing (`#dashboard`, `#cluster`, `#burden`, `#priority`, `#compare`, `#prevalence`)
- แต่ละ section เป็น ES module แยก โหลดแบบ lazy (code-split) — หน้า `prevalence` ที่มี SVG แผนที่ใหญ่จะโหลดเฉพาะตอนเปิด
- ข้อมูล aggregate แยกเป็นไฟล์ JS ตามโดเมน (`js/data/`) เป็นแหล่งข้อมูลเดียว (section import ไปใช้ ไม่มีสำเนาซ้ำ)
- ฟอนต์: Noto Serif Thai + Sarabun (Google Fonts)

## โครงสร้าง

```
monk/
├── index.html                    # Vite entry (module script + shell)
├── vite.config.js                # Build config (output → dist/)
├── wrangler.jsonc                # Cloudflare Workers (assets-only)
├── css/
│   └── styles.css                # Global CSS
├── js/
│   ├── main.js                   # Entry point (initNav + navigate)
│   ├── nav.js                    # Hash router + lazy section loader + teardown
│   ├── constants.js              # ค่าคงที่ร่วม (export)
│   ├── utils.js                  # helpers + observer/rAF registry (teardownAnimations)
│   ├── data/                     # แหล่งข้อมูล aggregate เดียว (export const ...)
│   │   ├── data-cluster.js       # คลัสเตอร์โรค (รอบ 1)
│   │   ├── data-burden.js        # ภาระโรค (รอบ 2)
│   │   ├── data-priority.js      # Priority Score (รอบ 3)
│   │   ├── data-comparison.js    # เทียบกับคนทั่วไป
│   │   └── data-prevalence.js    # ความชุก + SVG แผนที่
│   └── section-*.js (6 ไฟล์)    # แต่ละไฟล์ `export function render(container)`
└── source/                       # ไฟล์ HTML ต้นฉบับ (reference)
```

## วิธีใช้งาน

```bash
npm install
npm run dev        # dev server (Vite) ที่ http://localhost:5173
npm run build      # build → dist/
npm run preview    # เสิร์ฟ dist/ ในเครื่อง
```

## Deploy บน Cloudflare Workers

`wrangler.jsonc` ตั้งค่าให้เสิร์ฟ `dist/` เป็น static assets (ไม่มี Worker script)

```bash
npm run deploy     # = vite build && wrangler deploy
# หรือ:  npx wrangler dev   (หลัง build) เพื่อจำลอง edge ในเครื่อง
```

ครั้งแรกต้อง `npx wrangler login` ก่อน และแก้ `name` ใน `wrangler.jsonc` ให้ตรงกับชื่อ Worker ที่ต้องการ

## หมายเหตุเรื่องข้อมูล

Dashboard ใช้ข้อมูล **aggregate** (ระดับจังหวัด/เขต) ที่ pre-compute ไว้ใน `js/data/` — ไม่ได้ใช้ raw record
รายรูป และ**ไม่ควร**อัปโหลด raw 240k record (ข้อมูลสุขภาพรายบุคคล เช่น HIV/วัณโรค/จิตเวช) ขึ้น D1 หรือ
service ใดที่เปิด public โดยไม่มี access control และการทบทวนความเสี่ยง re-identification ก่อน

## อ้างอิง

- "คู่มือธรรมนูญสุขภาพพระสงฆ์แห่งชาติ พ.ศ. 2566" (5 หมวด 30 ข้อ)
- "แผนปฏิบัติการเพื่อการขับเคลื่อนธรรมนูญสุขภาพพระสงฆ์แห่งชาติ พ.ศ. 2569–2575"
- จัดพิมพ์โดย สำนักงานคณะกรรมการสุขภาพแห่งชาติ (สช.)
- เป้าหมายร่วม: "พระแข็งแรง วัดมั่นคง ชุมชนเป็นสุข"
