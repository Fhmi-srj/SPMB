/*
 Navicat Premium Dump SQL

 Source Server         : XAMPP_Connection
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : spmb_db

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 11/01/2026 05:47:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity_log
-- ----------------------------
DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NULL DEFAULT NULL,
  `action` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `admin_id`(`admin_id` ASC) USING BTREE,
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 82 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_log
-- ----------------------------
INSERT INTO `activity_log` VALUES (1, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-20 23:04:22');
INSERT INTO `activity_log` VALUES (2, 1, 'PASSWORD_CHANGE', 'Mengubah password admin', '::1', '2025-12-20 23:04:52');
INSERT INTO `activity_log` VALUES (3, 1, 'PROFILE_UPDATE', 'Mengubah profil admin', '::1', '2025-12-20 23:05:03');
INSERT INTO `activity_log` VALUES (4, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-21 00:52:08');
INSERT INTO `activity_log` VALUES (5, 1, 'UPDATE', 'Mengupdate data pendaftaran: Rerum rem eu lorem m', '::1', '2025-12-21 01:01:01');
INSERT INTO `activity_log` VALUES (6, 1, 'UPDATE', 'Mengupdate data pendaftaran: Rerum rem eu lorem m', '::1', '2025-12-21 01:02:07');
INSERT INTO `activity_log` VALUES (7, 1, 'DELETE', 'Menghapus pendaftaran: Ut et excepteur quia', '::1', '2025-12-21 01:02:31');
INSERT INTO `activity_log` VALUES (8, 1, 'DELETE', 'Menghapus pendaftaran: Rerum rem eu lorem m', '::1', '2025-12-21 01:49:45');
INSERT INTO `activity_log` VALUES (9, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-22 12:00:59');
INSERT INTO `activity_log` VALUES (10, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-23 16:52:31');
INSERT INTO `activity_log` VALUES (11, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 17:26:47');
INSERT INTO `activity_log` VALUES (12, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 17:26:58');
INSERT INTO `activity_log` VALUES (13, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 17:27:21');
INSERT INTO `activity_log` VALUES (14, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-23 17:30:54');
INSERT INTO `activity_log` VALUES (15, 1, 'RESET_PASSWORD', 'Reset password untuk: Ea id culpa quae q', '::1', '2025-12-23 17:32:09');
INSERT INTO `activity_log` VALUES (16, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 17:32:09');
INSERT INTO `activity_log` VALUES (17, 1, 'RESET_PASSWORD', 'Reset password untuk: Ea id culpa quae q', '::1', '2025-12-23 17:33:22');
INSERT INTO `activity_log` VALUES (18, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 17:33:22');
INSERT INTO `activity_log` VALUES (19, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-23 17:52:33');
INSERT INTO `activity_log` VALUES (20, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 17:54:15');
INSERT INTO `activity_log` VALUES (21, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 18:03:44');
INSERT INTO `activity_log` VALUES (22, 1, 'EXPORT', 'Export data pendaftaran ke Excel', '::1', '2025-12-23 18:30:37');
INSERT INTO `activity_log` VALUES (23, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 18:32:10');
INSERT INTO `activity_log` VALUES (24, 1, 'DELETE', 'Menghapus pendaftaran: Ea id culpa quae q', '::1', '2025-12-23 19:07:05');
INSERT INTO `activity_log` VALUES (25, 1, 'PASSWORD_CHANGE', 'Mengubah password admin', '::1', '2025-12-23 19:09:56');
INSERT INTO `activity_log` VALUES (26, 1, 'PROFILE_UPDATE', 'Mengubah profil admin', '::1', '2025-12-23 19:10:06');
INSERT INTO `activity_log` VALUES (27, 1, 'PROFILE_UPDATE', 'Mengubah profil admin', '::1', '2025-12-23 23:39:52');
INSERT INTO `activity_log` VALUES (28, 1, 'LOGIN', 'Admin login ke sistem', '127.0.0.1', '2025-01-20 07:00:00');
INSERT INTO `activity_log` VALUES (29, 1, 'STATUS_UPDATE', 'Verifikasi pendaftaran: Ahmad Fauzi Rahman', '127.0.0.1', '2025-01-20 08:35:00');
INSERT INTO `activity_log` VALUES (30, 1, 'STATUS_UPDATE', 'Verifikasi pendaftaran: Aisyah Putri Anggraini', '127.0.0.1', '2025-01-22 10:20:00');
INSERT INTO `activity_log` VALUES (31, 1, 'LOGIN', 'Admin login ke sistem', '127.0.0.1', '2025-02-10 08:00:00');
INSERT INTO `activity_log` VALUES (32, 1, 'STATUS_UPDATE', 'Verifikasi pendaftaran: Nabila Azzahra Putri', '127.0.0.1', '2025-02-10 11:35:00');
INSERT INTO `activity_log` VALUES (33, 1, 'STATUS_UPDATE', 'Tolak pendaftaran: Dimas Arya Pratama (dokumen tidak lengkap)', '127.0.0.1', '2025-02-12 16:05:00');
INSERT INTO `activity_log` VALUES (34, 1, 'STATUS_UPDATE', 'Verifikasi pendaftaran: Siti Nur Haliza', '127.0.0.1', '2025-02-18 13:50:00');
INSERT INTO `activity_log` VALUES (35, 1, 'STATUS_UPDATE', 'Verifikasi pendaftaran: Muhammad Hafiz Anwar', '127.0.0.1', '2025-02-22 15:20:00');
INSERT INTO `activity_log` VALUES (36, 1, 'UPDATE', 'Update data pengaturan tahun ajaran', '127.0.0.1', '2025-02-25 09:00:00');
INSERT INTO `activity_log` VALUES (37, 1, 'ADD', 'Menambah timeline: Pembukaan Pendaftaran', '127.0.0.1', '2025-02-25 09:15:00');
INSERT INTO `activity_log` VALUES (38, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ahmad Fauzi Rahman', '::1', '2025-12-24 00:37:56');
INSERT INTO `activity_log` VALUES (39, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ahmad Fauzi Rahman', '::1', '2025-12-24 00:38:16');
INSERT INTO `activity_log` VALUES (40, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ahmad Fauzi Rahman', '::1', '2025-12-24 00:38:45');
INSERT INTO `activity_log` VALUES (41, 1, 'RESET_PASSWORD', 'Reset password untuk: Ahmad Fauzi Rahman', '::1', '2025-12-24 00:39:12');
INSERT INTO `activity_log` VALUES (42, 1, 'UPDATE', 'Mengupdate data pendaftaran: Ahmad Fauzi Rahman', '::1', '2025-12-24 00:39:12');
INSERT INTO `activity_log` VALUES (43, 1, 'DELETE', 'Menghapus pendaftaran: Ahmad Fauzi Rahman', '::1', '2025-12-24 00:42:21');
INSERT INTO `activity_log` VALUES (44, 1, 'DELETE', 'Menghapus pendaftaran: Aisyah Putri Anggraini', '::1', '2025-12-24 00:42:23');
INSERT INTO `activity_log` VALUES (45, 1, 'DELETE', 'Menghapus pendaftaran: Muhammad Rizki Pratama', '::1', '2025-12-24 00:42:25');
INSERT INTO `activity_log` VALUES (46, 1, 'DELETE', 'Menghapus pendaftaran: Farah Naila Zahra', '::1', '2025-12-24 00:42:28');
INSERT INTO `activity_log` VALUES (47, 1, 'DELETE', 'Menghapus pendaftaran: Nabila Azzahra Putri', '::1', '2025-12-24 00:42:31');
INSERT INTO `activity_log` VALUES (48, 1, 'DELETE', 'Menghapus pendaftaran: Dimas Arya Pratama', '::1', '2025-12-24 00:42:33');
INSERT INTO `activity_log` VALUES (49, 1, 'DELETE', 'Menghapus pendaftaran: Rafi Akbar Maulana', '::1', '2025-12-24 00:42:36');
INSERT INTO `activity_log` VALUES (50, 1, 'DELETE', 'Menghapus pendaftaran: Siti Nur Haliza', '::1', '2025-12-24 00:42:39');
INSERT INTO `activity_log` VALUES (51, 1, 'DELETE', 'Menghapus pendaftaran: Fahri Ramadhan Putra', '::1', '2025-12-24 00:42:41');
INSERT INTO `activity_log` VALUES (52, 1, 'DELETE', 'Menghapus pendaftaran: Muhammad Hafiz Anwar', '::1', '2025-12-24 00:42:44');
INSERT INTO `activity_log` VALUES (53, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-24 11:56:12');
INSERT INTO `activity_log` VALUES (54, 1, 'CATATAN_UPDATE', 'Mengupdate catatan untuk: SOFA HILDA AYU MAULIDA', '::1', '2025-12-24 12:02:38');
INSERT INTO `activity_log` VALUES (55, 1, 'UPDATE', 'Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA', '::1', '2025-12-24 12:33:08');
INSERT INTO `activity_log` VALUES (56, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-24 12:33:48');
INSERT INTO `activity_log` VALUES (57, 1, 'UPDATE', 'Mengupdate data pendaftaran: ATQUE MOLESTIAS QUIB', '::1', '2025-12-24 12:34:04');
INSERT INTO `activity_log` VALUES (58, 1, 'UPDATE', 'Mengupdate data pendaftaran: ATQUE MOLESTIAS QUIB', '::1', '2025-12-24 12:34:12');
INSERT INTO `activity_log` VALUES (59, 1, 'DELETE', 'Menghapus pendaftaran: SOFA HILDA AYU MAULIDA', '::1', '2025-12-25 20:18:33');
INSERT INTO `activity_log` VALUES (60, 1, 'DELETE', 'Menghapus pendaftaran: FATAN FIRMANSYAH', '::1', '2025-12-25 20:18:35');
INSERT INTO `activity_log` VALUES (61, 1, 'DELETE', 'Menghapus pendaftaran: ATQUE MOLESTIAS QUIB', '::1', '2025-12-25 20:18:36');
INSERT INTO `activity_log` VALUES (62, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-25 20:25:22');
INSERT INTO `activity_log` VALUES (63, 1, 'UPDATE', 'Mengupdate data pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-25 21:50:12');
INSERT INTO `activity_log` VALUES (64, 1, 'WA_BERKAS', 'Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-25 21:58:29');
INSERT INTO `activity_log` VALUES (65, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-25 23:50:25');
INSERT INTO `activity_log` VALUES (66, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-26 00:07:45');
INSERT INTO `activity_log` VALUES (67, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-26 00:08:02');
INSERT INTO `activity_log` VALUES (68, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-26 00:10:49');
INSERT INTO `activity_log` VALUES (69, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-26 00:21:16');
INSERT INTO `activity_log` VALUES (70, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-26 00:40:38');
INSERT INTO `activity_log` VALUES (71, 1, 'WA_BERKAS', 'Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2025-12-26 00:44:23');
INSERT INTO `activity_log` VALUES (72, 1, 'LOGIN', 'Login berhasil', '::1', '2026-01-05 02:25:03');
INSERT INTO `activity_log` VALUES (73, 1, 'UPDATE', 'Mengupdate data pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2026-01-05 03:20:32');
INSERT INTO `activity_log` VALUES (74, 1, 'LOGIN', 'Login berhasil', '::1', '2026-01-05 03:32:53');
INSERT INTO `activity_log` VALUES (75, 1, 'UPDATE', 'Mengupdate data pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2026-01-05 03:33:04');
INSERT INTO `activity_log` VALUES (76, 1, 'UPDATE', 'Mengupdate data pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2026-01-05 03:33:29');
INSERT INTO `activity_log` VALUES (77, 1, 'LOGIN', 'Login berhasil', '::1', '2026-01-05 03:42:04');
INSERT INTO `activity_log` VALUES (78, 1, 'LOGIN', 'Login berhasil', '::1', '2026-01-05 13:52:17');
INSERT INTO `activity_log` VALUES (79, 1, 'UPDATE', 'Mengupdate data pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '::1', '2026-01-05 13:52:28');
INSERT INTO `activity_log` VALUES (80, 1, 'LOGIN', 'Login berhasil', '::1', '2026-01-06 00:54:30');
INSERT INTO `activity_log` VALUES (81, 1, 'UPDATE', 'Mengupdate data pendaftaran: Zaki Firmansyah', '::1', '2026-01-06 00:55:39');

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nama` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin_spmb', '$2y$10$j5l3eiUPIZtDdU29guUYFukGeWxPnJ95Mhq.tJLF.66/eNcVw9vZy', 'Admin SPMB', '2025-12-20 22:36:31');

-- ----------------------------
-- Table structure for beasiswa
-- ----------------------------
DROP TABLE IF EXISTS `beasiswa`;
CREATE TABLE `beasiswa`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `jenis` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `kategori` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `syarat` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `benefit` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `urutan` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of beasiswa
-- ----------------------------
INSERT INTO `beasiswa` VALUES (1, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 1-5 Juz', 'Gratis SPP 1 Bulan', 1);
INSERT INTO `beasiswa` VALUES (2, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 6-10 Juz', 'Gratis SPP 2 Bulan', 2);
INSERT INTO `beasiswa` VALUES (3, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 11-20 Juz', 'Gratis SPP 3 Bulan', 3);
INSERT INTO `beasiswa` VALUES (4, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 21-30 Juz', 'Gratis SPP 6 Bulan', 4);
INSERT INTO `beasiswa` VALUES (5, 'Akademik', 'Berdasarkan Nilai Rapor', 'Nilai 90-100', 'Gratis SPP 3 Bulan', 5);
INSERT INTO `beasiswa` VALUES (6, 'Akademik', 'Berdasarkan Nilai Rapor', 'Nilai 80-89', 'Gratis SPP 2 Bulan', 6);
INSERT INTO `beasiswa` VALUES (7, 'Akademik', 'Berdasarkan Nilai Rapor', 'Nilai 70-79', 'Gratis SPP 1 Bulan', 7);
INSERT INTO `beasiswa` VALUES (8, 'Yatim/Piatu', 'Keringanan', 'Yatim/Piatu', 'Potongan 25% SPP', 8);
INSERT INTO `beasiswa` VALUES (9, 'Yatim/Piatu', 'Keringanan', 'Yatim Piatu', 'Potongan 50% SPP', 9);

-- ----------------------------
-- Table structure for biaya
-- ----------------------------
DROP TABLE IF EXISTS `biaya`;
CREATE TABLE `biaya`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kategori` enum('PENDAFTARAN','DAFTAR_ULANG') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nama_item` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `biaya_pondok` int NULL DEFAULT 0,
  `biaya_smp` int NULL DEFAULT 0,
  `biaya_ma` int NULL DEFAULT 0,
  `urutan` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of biaya
-- ----------------------------
INSERT INTO `biaya` VALUES (1, 'PENDAFTARAN', 'Registrasi', 50000, 20000, 30000, 1);
INSERT INTO `biaya` VALUES (2, 'DAFTAR_ULANG', 'Baju Batik', 0, 65000, 90000, 1);
INSERT INTO `biaya` VALUES (3, 'DAFTAR_ULANG', 'Seragam Bawahan', 0, 0, 75000, 2);
INSERT INTO `biaya` VALUES (4, 'DAFTAR_ULANG', 'Jas Almamater', 170000, 0, 150000, 3);
INSERT INTO `biaya` VALUES (5, 'DAFTAR_ULANG', 'Kaos Olahraga', 0, 90000, 100000, 4);
INSERT INTO `biaya` VALUES (6, 'DAFTAR_ULANG', 'Badge Almamater', 0, 35000, 40000, 5);
INSERT INTO `biaya` VALUES (7, 'DAFTAR_ULANG', 'Buku Raport', 40000, 40000, 35000, 6);
INSERT INTO `biaya` VALUES (8, 'DAFTAR_ULANG', 'Infaq Bulan Pertama', 600000, 50000, 100000, 7);
INSERT INTO `biaya` VALUES (9, 'DAFTAR_ULANG', 'Kegiatan & Hari Besar', 150000, 50000, 380000, 8);
INSERT INTO `biaya` VALUES (10, 'DAFTAR_ULANG', 'Kitab/Buku Pelajaran', 100000, 0, 350000, 9);
INSERT INTO `biaya` VALUES (11, 'DAFTAR_ULANG', 'Perbaikan Asrama', 500000, 0, 0, 10);
INSERT INTO `biaya` VALUES (12, 'DAFTAR_ULANG', 'Kartu Santri', 40000, 0, 0, 11);
INSERT INTO `biaya` VALUES (13, 'DAFTAR_ULANG', 'Kebersihan', 150000, 0, 0, 12);
INSERT INTO `biaya` VALUES (14, 'DAFTAR_ULANG', 'Kalender', 50000, 0, 0, 13);

-- ----------------------------
-- Table structure for kontak
-- ----------------------------
DROP TABLE IF EXISTS `kontak`;
CREATE TABLE `kontak`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `lembaga` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nama` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `no_whatsapp` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `link_wa` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of kontak
-- ----------------------------
INSERT INTO `kontak` VALUES (1, 'SMP', 'Ust. Rino Mukti', '08123456789', 'http://wa.link/7svsg0');
INSERT INTO `kontak` VALUES (2, 'MA', 'Ust. Akrom Adabi', '0856 4164 7478', 'https://wa.link/ire9yv');
INSERT INTO `kontak` VALUES (3, 'PONPES', 'Ust. M. Kowi', '08123456790', 'https://wa.link/20sq3q');

-- ----------------------------
-- Table structure for pendaftaran
-- ----------------------------
DROP TABLE IF EXISTS `pendaftaran`;
CREATE TABLE `pendaftaran`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `no_registrasi` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `nama` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `lembaga` enum('SMP NU BP','MA ALHIKAM') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nisn` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `tempat_lahir` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `tanggal_lahir` date NULL DEFAULT NULL,
  `jenis_kelamin` enum('L','P') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `jumlah_saudara` int NULL DEFAULT 0,
  `no_kk` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `nik` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `alamat` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `provinsi` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `kota_kab` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `kecamatan` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `kelurahan_desa` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `asal_sekolah` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `prestasi` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `tingkat_prestasi` enum('KABUPATEN','PROVINSI','NASIONAL') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `juara` enum('1','2','3') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `file_sertifikat` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `pip_pkh` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `status_mukim` enum('PONDOK PP MAMBAUL HUDA','PONDOK SELAIN PP MAMBAUL HUDA','TIDAK PONDOK') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `sumber_info` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `nama_ayah` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `tempat_lahir_ayah` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `tanggal_lahir_ayah` date NULL DEFAULT NULL,
  `nik_ayah` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `pekerjaan_ayah` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `penghasilan_ayah` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `nama_ibu` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `tempat_lahir_ibu` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `tanggal_lahir_ibu` date NULL DEFAULT NULL,
  `nik_ibu` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `pekerjaan_ibu` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `penghasilan_ibu` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `no_hp_wali` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `file_kk` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `file_ktp_ortu` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `file_akta` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `file_ijazah` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `status` enum('pending','verified','rejected') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'pending',
  `catatan_admin` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `catatan_updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `reset_token_expires` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_phone`(`no_hp_wali` ASC) USING BTREE,
  INDEX `idx_reset_token`(`reset_token` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pendaftaran
-- ----------------------------
INSERT INTO `pendaftaran` VALUES (20, '001.1225', 'FAHMI MUHAMMAD SIROJUL MUNIR', 'SMP NU BP', 'Veniam consectetur', 'FUGIT VOLUPTATEM A', '2019-05-12', 'L', 7, 'Amet ut dolorum aut', 'Aliquam elit aut di', 'da', '', '', '', '', 'SUNT MINIM QUI PRAES', '', NULL, NULL, '', '', 'PONDOK SELAIN PP MAMBAUL HUDA', 'SOSIAL MEDIA', 'VENIAM OFFICIA EVEN', 'LIBERO DOLOR IPSA E', '1996-07-08', 'Omnis dolor recusand', 'EXERCITATION NATUS P', '', 'OFFICIIS SINT MAGNI', 'SINT CONSEQUATUR RAT', '1992-04-10', 'Quia quibusdam corru', 'QUAERAT BEATAE SIT', '', '+6285183878466', '$2y$10$OcB0VIe92Hqwvr1haoeAUOq/8z0ayr2PCsORCAEYAcHW95lJZ5A.6', '', '', '', '', 'verified', '', '2026-01-05 13:52:28', '2025-12-26 00:41:25', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (21, 'REG011', 'Zaki Firmansyah', 'SMP NU BP', '1234567901', 'Pekalongan', '2012-01-05', 'L', 2, '3326010101120011', '3326010105120011', 'Ds. Gondang RT 01/RW 02', '', '', '', '', 'SDN 01 Wonopringgo', '', NULL, NULL, NULL, 'Tidak', 'PONDOK PP MAMBAUL HUDA', 'Instagram', 'Supardi', 'Pekalongan', '1975-05-12', '3326011205750011', 'Pedagang', '3-5 Juta', 'Sumiati', 'Pekalongan', '1978-09-20', '3326012009780011', 'IRT', '', '085875005062', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'verified', '', '2026-01-06 00:55:39', '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (22, 'REG012', 'Ayu Lestari', 'MA ALHIKAM', '1234567902', 'Batang', '2009-03-18', 'P', 1, '3326010101120012', '3326011803090012', 'Jl. Pecalungan Raya No. 55 RT 02/RW 01', 'Jawa Tengah', 'Batang', 'Pecalungan', 'Pecalungan', 'MTs Al-Hidayah', NULL, NULL, NULL, NULL, 'Tidak', 'PONDOK PP MAMBAUL HUDA', 'Teman/Saudara', 'Sunaryo', 'Batang', '1973-08-25', '3326012508730012', 'Nelayan', '1-3 Juta', 'Wati', 'Batang', '1976-02-14', '3326011402760012', 'IRT', 'Tidak Ada', '081234567012', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'verified', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (23, 'REG013', 'Putri Rahayu', 'SMP NU BP', '1234567903', 'Pemalang', '2012-06-22', 'P', 3, '3326010101120013', '3326012206120013', 'Jl. Taman Indah No. 10 RT 03/RW 04', 'Jawa Tengah', 'Pemalang', 'Taman', 'Taman', 'SDN 02 Taman', NULL, NULL, NULL, NULL, 'Penerima PIP', 'TIDAK PONDOK', 'Brosur', 'Teguh Prasetyo', 'Pemalang', '1980-11-30', '3326113011800013', 'Tani', '1-3 Juta', 'Endang Sri', 'Pemalang', '1982-04-08', '3326010804820013', 'Buruh', '<1 Juta', '081234567013', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (24, 'REG014', 'Ilham Nur Hidayat', 'MA ALHIKAM', '1234567904', 'Pekalongan', '2009-09-10', 'L', 2, '3326010101120014', '3326011009090014', 'Ds. Sragi RT 05/RW 03', 'Jawa Tengah', 'Pekalongan', 'Sragi', 'Sragi', 'MTs Negeri 1 Pekalongan', NULL, NULL, NULL, NULL, 'Tidak', 'PONDOK PP MAMBAUL HUDA', 'Website', 'H. Miftahul Huda', 'Pekalongan', '1968-07-17', '3326011707680014', 'Wiraswasta', '5-10 Juta', 'Hj. Siti Aisyah', 'Pekalongan', '1972-01-05', '3326010501720014', 'IRT', 'Tidak Ada', '081234567014', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'verified', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (25, 'REG015', 'Bima Sakti Pradana', 'SMP NU BP', '1234567905', 'Pekalongan', '2012-12-25', 'L', 1, '3326010101120015', '3326012512120015', 'Jl. Doro Permai No. 8 RT 01/RW 02', 'Jawa Tengah', 'Pekalongan', 'Doro', 'Doro', 'SD Islam Terpadu', NULL, NULL, NULL, NULL, 'Tidak', 'PONDOK SELAIN PP MAMBAUL HUDA', 'YouTube', 'Wahyu Kurniawan', 'Semarang', '1979-03-22', '3326012203790015', 'Polisi', '5-10 Juta', 'Diana Kusuma', 'Semarang', '1981-07-14', '3326011407810015', 'PNS', '3-5 Juta', '081234567015', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (26, 'REG016', 'Nur Azizah Ramadhani', 'MA ALHIKAM', '1234567906', 'Batang', '2009-04-15', 'P', 4, '3326010101120016', '3326011504090016', 'Ds. Reban RT 02/RW 01', 'Jawa Tengah', 'Batang', 'Reban', 'Reban', 'MTs Al-Ittihad', NULL, NULL, NULL, NULL, 'Penerima PKH', 'PONDOK PP MAMBAUL HUDA', 'Spanduk/Banner', 'KH. Abdul Ghofur', 'Batang', '1965-12-01', '3326010112650016', 'Kyai', '1-3 Juta', 'Nyai Hj. Khodijah', 'Batang', '1970-06-20', '3326012006700016', 'IRT', 'Tidak Ada', '081234567016', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'verified', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (27, 'REG017', 'Salsa Nabila Putri', 'SMP NU BP', '1234567907', 'Pekalongan', '2012-08-08', 'P', 2, '3326010101120017', '3326010808120017', 'Jl. Talun Jaya No. 33 RT 04/RW 03', 'Jawa Tengah', 'Pekalongan', 'Talun', 'Talun', 'SDN 01 Talun', NULL, NULL, NULL, NULL, 'Tidak', 'PONDOK PP MAMBAUL HUDA', 'Facebook', 'Eko Susanto', 'Pekalongan', '1977-10-05', '3326010510770017', 'Pedagang', '3-5 Juta', 'Sri Mulyani', 'Pekalongan', '1980-02-28', '3326012802800017', 'Pedagang', '1-3 Juta', '081234567017', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (28, 'REG018', 'Yoga Pratama Putra', 'MA ALHIKAM', '1234567908', 'Pemalang', '2009-02-14', 'L', 3, '3326010101120018', '3326011402090018', 'Ds. Ampelgading RT 03/RW 02', 'Jawa Tengah', 'Pemalang', 'Ampelgading', 'Ampelgading', 'MTs Darul Falah', NULL, NULL, NULL, NULL, 'Tidak', 'TIDAK PONDOK', 'Lainnya', 'Warno', 'Pemalang', '1976-05-20', '3326012005760018', 'Tani', '<1 Juta', 'Tumini', 'Pemalang', '1978-08-12', '3326011208780018', 'Buruh', '<1 Juta', '081234567018', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'rejected', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (29, 'REG019', 'Farhan Maulana', 'SMP NU BP', '1234567909', 'Pekalongan', '2012-10-30', 'L', 2, '3326010101120019', '3326013010120019', 'Ds. Lebakbarang RT 01/RW 01', 'Jawa Tengah', 'Pekalongan', 'Lebakbarang', 'Lebakbarang', 'SDN 01 Lebakbarang', NULL, NULL, NULL, NULL, 'Penerima PIP', 'PONDOK PP MAMBAUL HUDA', 'Instagram', 'Sarwono', 'Pekalongan', '1974-03-08', '3326010803740019', 'Buruh', '1-3 Juta', 'Siti Fatimah', 'Pekalongan', '1977-09-15', '3326011509770019', 'IRT', 'Tidak Ada', '081234567019', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'verified', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (30, 'REG020', 'Zahra Aulia Salsabila', 'MA ALHIKAM', '1234567910', 'Pekalongan', '2009-07-07', 'P', 1, '3326010101120020', '3326010707090020', 'Jl. Karanganyar Indah No. 77 RT 02/RW 04', 'Jawa Tengah', 'Pekalongan', 'Karanganyar', 'Karanganyar', 'MTs Salafiyah', NULL, NULL, NULL, NULL, 'Tidak', 'PONDOK SELAIN PP MAMBAUL HUDA', 'Website', 'Dr. Ahmad Fauzan', 'Jakarta', '1970-11-11', '3326011111700020', 'Dokter', '>10 Juta', 'Dra. Hj. Aminah', 'Jakarta', '1973-04-25', '3326012504730020', 'Dosen', '5-10 Juta', '081234567020', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-01-05 15:58:31', NULL, NULL);

-- ----------------------------
-- Table structure for pengaturan
-- ----------------------------
DROP TABLE IF EXISTS `pengaturan`;
CREATE TABLE `pengaturan`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kunci` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nilai` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `keterangan` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `kunci`(`kunci` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pengaturan
-- ----------------------------
INSERT INTO `pengaturan` VALUES (1, 'status_pendaftaran', '1', 'Status pendaftaran: 1=Buka, 0=Tutup');
INSERT INTO `pengaturan` VALUES (2, 'tahun_ajaran', '2026/2027', 'Tahun ajaran aktif');
INSERT INTO `pengaturan` VALUES (3, 'link_pdf_biaya', 'https://s.id/biayapendaftaran', 'Link download PDF biaya');
INSERT INTO `pengaturan` VALUES (4, 'link_pdf_brosur', 'https://drive.google.com/file/d/1G9t4FnrnYo8amlPT9Y2OdLL-NQHDUIMB/view?usp=sharing', 'Link download PDF brosur');
INSERT INTO `pengaturan` VALUES (5, 'link_pdf_syarat', 'https://drive.google.com/file/d/1vbwof-2w_v2wzvosNYTzyE74EJqR0cEQ/view?usp=sharing', 'Link download PDF syarat');
INSERT INTO `pengaturan` VALUES (6, 'link_beasiswa', 'https://s.id/BeasiswaMAHAKAM', 'Link info beasiswa lengkap');
INSERT INTO `pengaturan` VALUES (7, 'gelombang_1_start', '2025-01-01', 'Tanggal mulai gelombang 1');
INSERT INTO `pengaturan` VALUES (8, 'gelombang_1_end', '2025-03-31', 'Tanggal selesai gelombang 1');
INSERT INTO `pengaturan` VALUES (9, 'gelombang_2_start', '2025-04-01', 'Tanggal mulai gelombang 2');
INSERT INTO `pengaturan` VALUES (10, 'gelombang_2_end', '2025-06-30', 'Tanggal selesai gelombang 2');
INSERT INTO `pengaturan` VALUES (11, 'link_grup_wa', 'https://s.id/BeasiswaMAHAKAM', 'Link grup WhatsApp untuk pendaftar baru');

SET FOREIGN_KEY_CHECKS = 1;
