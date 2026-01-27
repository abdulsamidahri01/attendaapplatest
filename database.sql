-- Attenda Canonical Database Schema
-- Compatible with MySQL 8.0+ / MariaDB 10.3+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- --------------------------------------------------------
-- Table: schema_versions
-- Purpose: Track migration history
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema_versions` (
  `version` INT NOT NULL PRIMARY KEY,
  `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: school_config
-- Purpose: Singleton configuration
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `school_config` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `school_name` VARCHAR(255) NOT NULL,
  `department_name` VARCHAR(255) NOT NULL,
  `timings_days` VARCHAR(100) DEFAULT NULL,
  `timings_hours` VARCHAR(100) DEFAULT NULL,
  `vision` TEXT,
  `mission` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: classes
-- Purpose: Academic units
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `classes` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `original_id` VARCHAR(50) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  UNIQUE KEY `idx_classes_original_id` (`original_id`),
  UNIQUE KEY `idx_classes_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: employees
-- Purpose: Staff members
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employees` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `original_id` VARCHAR(50) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `has_login_access` TINYINT(1) NOT NULL DEFAULT 0,
  `image` MEDIUMTEXT,
  UNIQUE KEY `idx_employees_original_id` (`original_id`),
  UNIQUE KEY `idx_employees_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: students
-- Purpose: Student registry with extended profile fields
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `original_id` VARCHAR(50) DEFAULT NULL,
  `registration_number` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `father_name` VARCHAR(100) DEFAULT NULL,
  `class_id` INT NOT NULL,
  `admission_date` DATE DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT 'Male',
  `contact_number` VARCHAR(20) DEFAULT NULL,
  `fees_status` VARCHAR(20) DEFAULT 'Unpaid',
  `has_login_access` TINYINT(1) NOT NULL DEFAULT 0,
  `password` VARCHAR(255) DEFAULT NULL,
  `address` TEXT,
  `image` MEDIUMTEXT,
  
  -- Extended Profile
  `dob` DATE DEFAULT NULL,
  `birth_id` VARCHAR(50) DEFAULT NULL,
  `blood_group` VARCHAR(10) DEFAULT NULL,
  `religion` VARCHAR(50) DEFAULT NULL,
  `cast` VARCHAR(50) DEFAULT NULL,
  `orphan` VARCHAR(10) DEFAULT 'No',
  `identification_mark` TEXT,
  `disease` TEXT,
  `previous_school` TEXT,
  
  -- Parental Details
  `father_id` VARCHAR(50) DEFAULT NULL,
  `father_mobile` VARCHAR(20) DEFAULT NULL,
  `father_occupation` VARCHAR(100) DEFAULT NULL,
  `father_education` VARCHAR(100) DEFAULT NULL,
  `father_income` VARCHAR(50) DEFAULT NULL,
  `mother_name` VARCHAR(100) DEFAULT NULL,
  `mother_id` VARCHAR(50) DEFAULT NULL,
  `mother_occupation` VARCHAR(100) DEFAULT NULL,
  `mother_education` VARCHAR(100) DEFAULT NULL,

  UNIQUE KEY `idx_students_original_id` (`original_id`),
  UNIQUE KEY `idx_students_reg_no` (`registration_number`),
  CONSTRAINT `fk_student_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: class_subjects
-- Purpose: Subject-Teacher mapping per Class
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `class_subjects` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `subject_name` VARCHAR(100) NOT NULL,
  `teacher_id` INT DEFAULT NULL,
  UNIQUE KEY `idx_class_subject_unique` (`class_id`, `subject_name`),
  CONSTRAINT `fk_class_subj_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_class_subj_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: attendance
-- Purpose: Daily attendance logs
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `subject_name` VARCHAR(100) NOT NULL DEFAULT 'General',
  `date` DATE NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  UNIQUE KEY `idx_attendance_unique` (`student_id`, `class_id`, `subject_name`, `date`),
  CONSTRAINT `fk_att_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: notices
-- Purpose: Announcements
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notices` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `original_id` VARCHAR(50) DEFAULT NULL,
  `title` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  UNIQUE KEY `idx_notices_original_id` (`original_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: events
-- Purpose: Calendar events
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  UNIQUE KEY `idx_events_unique` (`title`, `date`, `time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;