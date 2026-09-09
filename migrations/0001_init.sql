-- D1 schema — ธรรมนูญสุขภาพพระสงฆ์ dashboard (aggregate cube เท่านั้น ไม่มี record รายบุคคล)
-- apply: npx wrangler d1 migrations apply monk-health
--
-- หลักการ disclosure control:
--   * เก็บเฉพาะ "จำนวนนับ" ที่ pre-aggregate แล้ว ไม่มีแถวรายรูป
--   * cell ที่ n < META k_threshold ถูก "ตัดทิ้ง" ทั้งแถว (ทั้ง numerator/denominator)
--   * จำนวนที่เหลือปัดเป็นพหุคูณของ META rounding
--   * ชื่อวัดไม่เก็บ — ใช้ temple_key = hash(ชื่อ|อำเภอ|จังหวัด|salt)
--   * ค่าที่ระดับ parent คำนวณจากข้อมูลเต็มก่อนตัด ไม่ได้ = ผลรวมของ children

PRAGMA foreign_keys = ON;

CREATE TABLE meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE dim_province (
  province    TEXT PRIMARY KEY,
  region_id   INTEGER NOT NULL,
  region_name TEXT NOT NULL
);

-- เฉพาะวัดที่มีพระสงฆ์ >= META min_temple_n (ปีล่าสุด)
CREATE TABLE dim_temple (
  temple_key TEXT PRIMARY KEY,   -- 12-hex hash, ไม่สามารถย้อนกลับเป็นชื่อได้ถ้าไม่มี salt
  province   TEXT NOT NULL,
  amphur     TEXT NOT NULL,      -- อำเภอ
  n_persons  INTEGER NOT NULL,   -- ปัดแล้ว
  FOREIGN KEY (province) REFERENCES dim_province(province)
);
CREATE INDEX idx_temple_prov ON dim_temple (province, amphur);

-- ประชากร + multimorbidity + สถานะมรณภาพ ต่อ (ปี × ระดับพื้นที่ × สถานะ × ช่วงอายุ)
CREATE TABLE fact_pop (
  year        INTEGER NOT NULL,   -- 2567 | 2568
  geo_level   TEXT NOT NULL,      -- national | region | province | amphur | temple
  geo_id      TEXT NOT NULL,      -- 'TH' | '1'..'13' | <province> | '<province>␟<amphur>' | <temple_key>
  status      TEXT NOT NULL,      -- all | monk | novice | disrobed | deceased
  age_band    TEXT NOT NULL,      -- all | <20 | 20-39 | 40-59 | 60+
  n           INTEGER NOT NULL,   -- จำนวนรูป (ปัด)
  n_hiso      INTEGER NOT NULL,   -- พบประวัติใน HISO (ตัวหารของ % โรค)
  n_multi2    INTEGER NOT NULL,   -- ป่วยร่วม >= 2 โรค
  n_multi3    INTEGER NOT NULL,
  n_multi4    INTEGER NOT NULL,
  n_multi5    INTEGER NOT NULL,
  n_deceased  INTEGER NOT NULL,   -- สถานะ = เสียชีวิต (สะสม)
  PRIMARY KEY (year, geo_level, geo_id, status, age_band)
);
CREATE INDEX idx_pop_lookup ON fact_pop (geo_level, geo_id, year);

-- จำนวนผู้ป่วยรายโรค ต่อ (ปี × ระดับพื้นที่ × สถานะ × ช่วงอายุ × รหัสโรค)
CREATE TABLE fact_disease (
  year      INTEGER NOT NULL,
  geo_level TEXT NOT NULL,
  geo_id    TEXT NOT NULL,
  status    TEXT NOT NULL,
  age_band  TEXT NOT NULL,
  icd       TEXT NOT NULL,        -- I10 ... U07.1 (30 รหัส)
  n_pop     INTEGER NOT NULL,     -- ตัวหาร HISO ของ cell นี้ (ปัด)
  n_cases   INTEGER NOT NULL,     -- ป่วยโรคนี้ (ปัด)
  PRIMARY KEY (year, geo_level, geo_id, status, age_band, icd)
);
CREATE INDEX idx_disease_lookup ON fact_disease (geo_level, geo_id, year, icd);

-- cohort อายุขณะบวช (โฟกัส: I10 + multimorbidity, ระดับ national/region/province)
CREATE TABLE fact_ordination (
  year         INTEGER NOT NULL,
  geo_level    TEXT NOT NULL,      -- national | region | province
  geo_id       TEXT NOT NULL,
  ord_age_band TEXT NOT NULL,      -- <20 | 20-25 | 26-35 | 36+
  age_band     TEXT NOT NULL,      -- all | 60+   (ไว้เทียบแบบคุมอายุ)
  n            INTEGER NOT NULL,
  n_hiso       INTEGER NOT NULL,
  n_i10        INTEGER NOT NULL,
  n_multi2     INTEGER NOT NULL,
  PRIMARY KEY (year, geo_level, geo_id, ord_age_band, age_band)
);

-- จำนวนมรณภาพรายปีปฏิทิน (จากไฟล์ปีล่าสุด) — ระดับ national/region/province
CREATE TABLE fact_mortality_year (
  geo_level  TEXT NOT NULL,
  geo_id     TEXT NOT NULL,
  death_year INTEGER NOT NULL,     -- ค.ศ.
  n_deaths   INTEGER NOT NULL,
  PRIMARY KEY (geo_level, geo_id, death_year)
);
