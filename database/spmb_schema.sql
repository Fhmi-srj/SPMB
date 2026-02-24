-- ========================================================
-- SPMB Database Schema
-- Version: 1.0
-- Generated: 2026-02-03
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Table: admin
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `role` enum('super_admin','admin','panitia') NOT NULL DEFAULT 'panitia',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------
-- 2. Table: pendaftaran
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pendaftaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `no_registrasi` varchar(10) DEFAULT NULL,
  `nama` varchar(100) NOT NULL,
  `lembaga` enum('SMP NU BP','MA ALHIKAM') NOT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `jumlah_saudara` int DEFAULT 0,
  `no_kk` varchar(20) DEFAULT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `provinsi` varchar(100) DEFAULT NULL,
  `kota_kab` varchar(100) DEFAULT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `kelurahan_desa` varchar(100) DEFAULT NULL,
  `asal_sekolah` varchar(100) DEFAULT NULL,
  `prestasi` varchar(200) DEFAULT NULL,
  `tingkat_prestasi` enum('KABUPATEN','PROVINSI','NASIONAL') DEFAULT NULL,
  `juara` enum('1','2','3') DEFAULT NULL,
  `file_sertifikat` varchar(255) DEFAULT NULL,
  `pip_pkh` varchar(50) DEFAULT NULL,
  `status_mukim` enum('PONDOK PP MAMBAUL HUDA','PONDOK SELAIN PP MAMBAUL HUDA','TIDAK PONDOK') NOT NULL,
  `sumber_info` varchar(50) DEFAULT NULL,
  `nama_ayah` varchar(100) DEFAULT NULL,
  `tempat_lahir_ayah` varchar(50) DEFAULT NULL,
  `tanggal_lahir_ayah` date DEFAULT NULL,
  `nik_ayah` varchar(20) DEFAULT NULL,
  `pekerjaan_ayah` varchar(100) DEFAULT NULL,
  `penghasilan_ayah` varchar(20) DEFAULT NULL,
  `nama_ibu` varchar(100) DEFAULT NULL,
  `tempat_lahir_ibu` varchar(50) DEFAULT NULL,
  `tanggal_lahir_ibu` date DEFAULT NULL,
  `nik_ibu` varchar(20) DEFAULT NULL,
  `pekerjaan_ibu` varchar(100) DEFAULT NULL,
  `penghasilan_ibu` varchar(20) DEFAULT NULL,
  `no_hp_wali` varchar(20) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `file_kk` varchar(255) DEFAULT NULL,
  `file_ktp_ortu` varchar(255) DEFAULT NULL,
  `file_akta` varchar(255) DEFAULT NULL,
  `file_ijazah` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','rejected') DEFAULT 'pending',
  `catatan_admin` text DEFAULT NULL,
  `catatan_updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_phone` (`no_hp_wali`),
  INDEX `idx_reset_token` (`reset_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------
-- 3. Table: perlengkapan_items
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `perlengkapan_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_item` varchar(100) NOT NULL,
  `nominal` int NOT NULL DEFAULT 0,
  `urutan` int DEFAULT 0,
  `aktif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table: activity_log
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `admin_id` (`admin_id`),
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------
-- 5. Table: beasiswa
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `beasiswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jenis` varchar(100) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `syarat` varchar(200) NOT NULL,
  `benefit` varchar(100) NOT NULL,
  `urutan` int DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------
-- 6. Table: biaya
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `biaya` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kategori` enum('PENDAFTARAN','DAFTAR_ULANG') NOT NULL,
  `nama_item` varchar(100) NOT NULL,
  `biaya_pondok` int DEFAULT 0,
  `biaya_smp` int DEFAULT 0,
  `biaya_ma` int DEFAULT 0,
  `urutan` int DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------
-- 7. Table: kontak
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kontak` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lembaga` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `no_whatsapp` varchar(20) NOT NULL,
  `link_wa` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------
-- 8. Table: log_aktivitas
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `log_aktivitas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(100) DEFAULT 'Admin',
  `aksi` varchar(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE',
  `modul` varchar(50) NOT NULL COMMENT 'PEMASUKAN, PENGELUARAN',
  `detail` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_log_modul` (`modul`),
  INDEX `idx_log_aksi` (`aksi`),
  INDEX `idx_log_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Table: pengaturan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pengaturan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kunci` varchar(50) NOT NULL,
  `nilai` text DEFAULT NULL,
  `keterangan` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kunci` (`kunci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------
-- 10. Table: perlengkapan_pesanan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `perlengkapan_pesanan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pendaftaran_id` int NOT NULL,
  `perlengkapan_item_id` int NOT NULL,
  `status` tinyint(1) DEFAULT 1 COMMENT '1=dipesan, 0=dibatalkan',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pesanan` (`pendaftaran_id`,`perlengkapan_item_id`),
  INDEX `perlengkapan_item_id` (`perlengkapan_item_id`),
  CONSTRAINT `perlengkapan_pesanan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `perlengkapan_pesanan_ibfk_2` FOREIGN KEY (`perlengkapan_item_id`) REFERENCES `perlengkapan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. Table: transaksi_pemasukan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transaksi_pemasukan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice` varchar(50) NOT NULL,
  `pendaftaran_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int NOT NULL,
  `jenis_pembayaran` varchar(100) NOT NULL COMMENT 'Pendaftaran/Daftar Ulang/Perlengkapan/dll',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice` (`invoice`),
  INDEX `idx_pemasukan_pendaftaran` (`pendaftaran_id`),
  INDEX `idx_pemasukan_tanggal` (`tanggal`),
  CONSTRAINT `transaksi_pemasukan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 12. Table: transaksi_pengeluaran
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transaksi_pengeluaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int NOT NULL,
  `kategori` varchar(100) NOT NULL COMMENT 'Sesuai item dari tabel biaya',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice` (`invoice`),
  INDEX `idx_pengeluaran_tanggal` (`tanggal`),
  INDEX `idx_pengeluaran_kategori` (`kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
