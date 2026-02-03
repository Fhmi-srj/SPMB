-- Create log_aktivitas table
CREATE TABLE IF NOT EXISTS log_aktivitas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  user_name VARCHAR(100) DEFAULT 'Admin',
  aksi VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE',
  modul VARCHAR(50) NOT NULL COMMENT 'PEMASUKAN, PENGELUARAN',
  detail TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_log_modul ON log_aktivitas(modul);
CREATE INDEX idx_log_aksi ON log_aktivitas(aksi);
CREATE INDEX idx_log_created ON log_aktivitas(created_at);
