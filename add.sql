-- 建立資料庫
CREATE DATABASE IF NOT EXISTS accounting DEFAULT CHARSET=utf8mb4;
USE accounting;

-- 使用者表（可選）
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分類表
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type ENUM('income','expense') NOT NULL,
  icon VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 交易表
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  category_id INT NOT NULL,
  description VARCHAR(255),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 假資料 - 分類
INSERT INTO categories (name, type, icon) VALUES
('薪水', 'income', '💰'),
('投資收益', 'income', '📈'),
('餐飲', 'expense', '🍔'),
('交通', 'expense', '🚌'),
('娛樂', 'expense', '🎮');

-- 假資料 - 交易
INSERT INTO transactions (amount, category_id, description, date) VALUES
(50000, 1, '本月薪水', '2025-12-01'),
(2000, 3, '午餐', '2025-12-02'),
(1500, 4, '公車卡', '2025-12-02'),
(3000, 5, '電影', '2025-12-03'),
(1000, 2, '股票分紅', '2025-12-04');

ALTER TABLE transactions 
ADD COLUMN type VARCHAR(20) NOT NULL AFTER id;
