# etl/ — เตรียมข้อมูลขึ้น Cloudflare D1 (version ถัดไป)

```
etl/
├── input/          ← วางไฟล์ดิบ (gitignored — ดู input/README.md)
│   ├── monk_merged_data_blind_2567.csv
│   ├── monk_merged_data_blind_2568.csv
│   ├── _notes.md   ← schema ที่ inspect ได้ (gitignored)
│   └── _salt.txt   ← salt สำหรับ hash ชื่อวัด (gitignored — อย่าทำหาย)
├── output/         ← seed.sql ที่ build ออกมา (gitignored)
├── lib/            ← csv parser + province→region map
├── inspect.mjs     ← สำรวจ schema/คุณภาพไฟล์  (node etl/inspect.mjs)
└── build.mjs       ← CSV → aggregate cube → output/seed.sql  (node etl/build.mjs)

migrations/0001_init.sql   ← schema D1
worker/index.js            ← Worker: static assets + /api บน D1 (ยังไม่ wire เข้า config)
```

## ข้อมูลที่เก็บ (ตัดสินใจแล้ว)

- **grain:** aggregate cube เท่านั้น — ไม่มี record รายรูปออกจากเครื่อง
- **geo:** national / region(เขตสุขภาพ 1–13) / province / amphur / **temple** (วัด ≥ 30 รูป, เก็บเป็น `temple_key` = hash(ชื่อ|อำเภอ|จังหวัด|salt) ไม่เก็บชื่อ)
- **dedup:** 1 แถว/คน/ปี (id_card_final) — ธงโรค OR กัน, field ทะเบียนเอาค่าแรกที่ไม่ว่าง
- **disclosure control:** cell ที่ `n < K` (default 10) ตัดทั้งแถว, disease ใช้ complementary suppression, นับที่เหลือปัดเป็นพหุคูณของ `ROUND` (default 5)
- `id_card_final` (เลข 13 หลัก, บางค่าเหมือนบัตร ปชช. จริง) → **ไม่ถูกเก็บที่ไหนเลย** ใช้แค่ dedup ระหว่าง build

ปรับพารามิเตอร์: `K=15 ROUND=10 MIN_TEMPLE_N=50 node etl/build.mjs`

## ผลลัพธ์ปัจจุบัน (K=10, ROUND=5, MIN_TEMPLE_N=30)

| ตาราง | แถว |
|---|---|
| fact_pop | 22,626 |
| fact_disease | 45,536 |
| fact_ordination | 1,446 |
| fact_mortality_year | 615 |
| dim_temple (≥30 รูป) | 535 |
| dim_province | 77 |

seed.sql ≈ 6 MB · ตรวจแล้วตรงกับตัวเลขบน dashboard เดิม (I10 ประเทศ 2568 = 17.24%, multimorbidity ≥2 = 20.4%)

## ขั้นตอน deploy D1

```bash
# 1. build
node etl/build.mjs

# 2. สร้าง D1 database (ครั้งเดียว) — จะได้ database_id กลับมา
npx wrangler d1 create monk-health

# 3. แก้ wrangler.jsonc — เพิ่ม 3 อย่าง:
#    "main": "worker/index.js",
#    ใน "assets" เพิ่ม   "binding": "ASSETS",
#    "d1_databases": [{ "binding": "DB", "database_name": "monk-health", "database_id": "<จากขั้น 2>" }]

# 4. สร้างตาราง
npx wrangler d1 migrations apply monk-health           # remote
# npx wrangler d1 migrations apply monk-health --local  # ทดสอบในเครื่อง

# 5. โหลดข้อมูล
npx wrangler d1 execute monk-health --remote --file etl/output/seed.sql

# 6. deploy (คราวนี้เป็น Worker + assets แล้ว)
npm run deploy
```

ทดสอบในเครื่องก่อนได้: `npx wrangler dev` แล้วยิง `http://localhost:8787/api/meta`

## API (worker/index.js)

| endpoint | พารามิเตอร์ | ได้อะไร |
|---|---|---|
| `/api/meta` | — | provenance + พารามิเตอร์ suppression |
| `/api/provinces` | — | 77 จังหวัด + เขตสุขภาพ |
| `/api/pop` | `year,geo_level,geo_id,status,age_band` | 1 แถว: n, n_hiso, n_multi2-5, n_deceased |
| `/api/disease` | เหมือน pop | 30 โรค: n_pop, n_cases |
| `/api/ordination` | `year,geo_level,geo_id` | cohort อายุขณะบวช |
| `/api/mortality` | `geo_level,geo_id` | มรณภาพรายปี |
| `/api/temples` | `province,year` | วัด ≥30 รูป เรียงตาม % ป่วยร่วม |

ค่า enum (`geo_level/status/age_band/year`) มี allow-list ใน worker — query ใช้ bound params ทั้งหมด

## หมายเหตุ

- ค่าที่ระดับ parent (เช่น national) คำนวณจากข้อมูลเต็ม**ก่อน** suppression — **ไม่เท่ากับ**ผลรวมของ children ที่เหลือ
- ข้อมูล aggregate เดิมใน `js/data/*.js` ควรอยู่ต่อเป็น static (เร็ว + cache edge ได้) — D1 ไว้สำหรับ drill-down รายอำเภอ/รายวัด และ query ที่ pre-compute ไม่ไหว
- ข้อมูลเทียบคนทั่วไป (`data-comparison.js`) เป็น external ไม่เกี่ยวกับ D1
