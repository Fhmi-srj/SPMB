-- =============================================
-- Tabel untuk Perlengkapan Items
-- =============================================
CREATE TABLE IF NOT EXISTS perlengkapan_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_item VARCHAR(100) NOT NULL,
  nominal INT NOT NULL DEFAULT 0,
  urutan INT DEFAULT 0,
  aktif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabel untuk Perlengkapan Pesanan
-- =============================================
CREATE TABLE IF NOT EXISTS perlengkapan_pesanan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pendaftaran_id INT NOT NULL,
  perlengkapan_item_id INT NOT NULL,
  status TINYINT(1) DEFAULT 1 COMMENT '1=dipesan, 0=dibatalkan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pendaftaran_id) REFERENCES pendaftaran(id) ON DELETE CASCADE,
  FOREIGN KEY (perlengkapan_item_id) REFERENCES perlengkapan_items(id) ON DELETE CASCADE,
  UNIQUE KEY unique_pesanan (pendaftaran_id, perlengkapan_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Sample Data (Optional)
-- =============================================
INSERT INTO perlengkapan_items (nama_item, nominal, urutan) VALUES
('Kasur', 500000, 1),
('Almari', 750000, 2),
('Bantal', 100000, 3),
('Guling', 75000, 4),
('Selimut', 150000, 5)
ON DUPLICATE KEY UPDATE nama_item=nama_item;
