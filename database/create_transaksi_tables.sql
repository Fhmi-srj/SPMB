-- Create transaksi_pemasukan table
CREATE TABLE IF NOT EXISTS transaksi_pemasukan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice VARCHAR(50) UNIQUE NOT NULL,
  pendaftaran_id INT NOT NULL,
  tanggal DATE NOT NULL,
  nominal INT NOT NULL,
  jenis_pembayaran VARCHAR(100) NOT NULL COMMENT 'Pendaftaran/Daftar Ulang/Perlengkapan/dll',
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pendaftaran_id) REFERENCES pendaftaran(id) ON DELETE CASCADE
);

-- Create transaksi_pengeluaran table
CREATE TABLE IF NOT EXISTS transaksi_pengeluaran (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice VARCHAR(50) UNIQUE NOT NULL,
  tanggal DATE NOT NULL,
  nominal INT NOT NULL,
  kategori VARCHAR(100) NOT NULL COMMENT 'Sesuai item dari tabel biaya',
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_pemasukan_pendaftaran ON transaksi_pemasukan(pendaftaran_id);
CREATE INDEX idx_pemasukan_tanggal ON transaksi_pemasukan(tanggal);
CREATE INDEX idx_pengeluaran_tanggal ON transaksi_pengeluaran(tanggal);
CREATE INDEX idx_pengeluaran_kategori ON transaksi_pengeluaran(kategori);
