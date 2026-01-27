
-- Attenda Production Data Snapshot
-- Generated: 2025-01-26
-- Strategy: Clean Start (Zero records)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- --------------------------------------------------------
-- 1. Metadata
-- --------------------------------------------------------
INSERT IGNORE INTO schema_versions (version, description)
VALUES (1, 'Clean system initialization');

-- --------------------------------------------------------
-- 2. Employees (Empty)
-- --------------------------------------------------------
-- No employees seeded.

-- --------------------------------------------------------
-- 3. Classes (Structural Seed Only)
-- --------------------------------------------------------
INSERT IGNORE INTO classes (original_id, name)
VALUES
('1', 'BS-I ZOO'),
('2', 'BS-II ZOO'),
('3', 'BS-III ZOO'),
('4', 'BS-IV ZOO'),
('5', 'MSc-I ZOO'),
('6', 'MSc-II ZOO'),
('7', 'MPhil ZOO');

-- --------------------------------------------------------
-- 4. Students (Empty)
-- --------------------------------------------------------
-- No students seeded.

-- --------------------------------------------------------
-- 5. Class Subjects Mapping
-- --------------------------------------------------------
-- No teacher assignments seeded.

-- --------------------------------------------------------
-- 6. Notices
-- --------------------------------------------------------
INSERT IGNORE INTO notices (original_id, title, type, date)
VALUES
('1', 'System Initialized. Welcome to Attenda.', 'General', '2025-01-26');

-- --------------------------------------------------------
-- 7. School Config
-- --------------------------------------------------------
DELETE FROM school_config;
INSERT INTO school_config (school_name, department_name, timings_days, timings_hours, vision, mission)
VALUES 
('Attenda', 'DEPARTMENT OF ZOOLOGY', 'Mon - Fri', '08:00 AM - 02:00 PM', 'To lead in biological excellence and institutional intelligence.', 'Empowering the next generation of zoologists through data-driven academic management.');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
