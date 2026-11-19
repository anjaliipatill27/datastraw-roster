CREATE DATABASE IF NOT EXISTS datastraw_roster;
USE datastraw_roster;

CREATE TABLE IF NOT EXISTS pods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  lead_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  pod_id INT,
  role VARCHAR(80) DEFAULT 'Associate',
  weekly_off VARCHAR(12) DEFAULT 'Sunday',
  active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (pod_id)
    REFERENCES pods(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS processes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_id INT NOT NULL,
  name VARCHAR(80) NOT NULL,
  operating_rule ENUM(
    'ALL_DAYS',
    'NO_HOLIDAYS',
    'WEEKDAYS'
  ) DEFAULT 'ALL_DAYS',
  min_staff INT DEFAULT 1,
  FOREIGN KEY (brand_id)
    REFERENCES brands(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  process_id INT NOT NULL,
  FOREIGN KEY (employee_id)
    REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (process_id)
    REFERENCES processes(id) ON DELETE CASCADE,
  UNIQUE KEY employee_process(employee_id, process_id)
);

CREATE TABLE IF NOT EXISTS time_off (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  type ENUM('LEAVE','COMP_OFF','HOLIDAY')
    NOT NULL DEFAULT 'LEAVE',
  status ENUM('PENDING','APPROVED')
    NOT NULL DEFAULT 'APPROVED',
  note VARCHAR(255),
  FOREIGN KEY (employee_id)
    REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY employee_day(employee_id,date)
);

CREATE TABLE IF NOT EXISTS roster_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  process_id INT NOT NULL,
  work_date DATE NOT NULL,
  status ENUM(
    'WORKING',
    'WEEKLY_OFF',
    'LEAVE',
    'HOLIDAY'
  ) NOT NULL,
  note VARCHAR(255),
  FOREIGN KEY (employee_id)
    REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (process_id)
    REFERENCES processes(id) ON DELETE CASCADE,
  UNIQUE KEY employee_process_day(
    employee_id,process_id,work_date
  )
);

CREATE TABLE IF NOT EXISTS public_holidays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  holiday_date DATE NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL
);