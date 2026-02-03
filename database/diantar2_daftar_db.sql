/*
 Navicat Premium Dump SQL

 Source Server         : AKROM ADABI
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : diantar2_daftar_db

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 03/02/2026 21:35:06
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
) ENGINE = InnoDB AUTO_INCREMENT = 128 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

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
INSERT INTO `activity_log` VALUES (9, 1, 'LOGIN', 'Login berhasil', '103.47.133.117', '2025-12-22 11:59:30');
INSERT INTO `activity_log` VALUES (10, 1, 'DELETE', 'Menghapus pendaftaran: Fahmi', '103.47.133.151', '2025-12-22 13:32:21');
INSERT INTO `activity_log` VALUES (11, 1, 'LOGIN', 'Login berhasil', '36.68.53.171', '2025-12-22 13:38:36');
INSERT INTO `activity_log` VALUES (12, 1, 'LOGIN', 'Login berhasil', '103.47.133.123', '2025-12-22 13:55:31');
INSERT INTO `activity_log` VALUES (13, 1, 'PROFILE_UPDATE', 'Mengubah profil admin', '103.47.133.123', '2025-12-22 13:55:52');
INSERT INTO `activity_log` VALUES (14, 1, 'PASSWORD_CHANGE', 'Mengubah password admin', '103.47.133.123', '2025-12-22 13:56:19');
INSERT INTO `activity_log` VALUES (15, 1, 'LOGIN', 'Login berhasil', '103.47.133.76', '2025-12-22 13:59:08');
INSERT INTO `activity_log` VALUES (16, 1, 'LOGIN', 'Login berhasil', '36.68.53.171', '2025-12-22 14:00:33');
INSERT INTO `activity_log` VALUES (17, 1, 'LOGIN', 'Login berhasil', '103.47.133.76', '2025-12-22 14:02:02');
INSERT INTO `activity_log` VALUES (18, 1, 'UPDATE', 'Mengupdate data pendaftaran: Fahmi Muhammad Sirojul Munir', '103.47.133.76', '2025-12-22 14:02:12');
INSERT INTO `activity_log` VALUES (19, 1, 'DELETE', 'Menghapus pendaftaran: Fahmi Muhammad Sirojul Munir', '103.47.133.76', '2025-12-22 14:02:42');
INSERT INTO `activity_log` VALUES (20, 1, 'LOGIN', 'Login berhasil', '103.47.133.101', '2025-12-22 14:06:00');
INSERT INTO `activity_log` VALUES (21, 1, 'LOGIN', 'Login berhasil', '103.47.133.183', '2025-12-22 16:30:41');
INSERT INTO `activity_log` VALUES (22, 1, 'DELETE', 'Menghapus pendaftaran: Fahmi Muhammad Sirojul Munir', '103.47.133.183', '2025-12-22 16:31:04');
INSERT INTO `activity_log` VALUES (23, 1, 'LOGIN', 'Login berhasil', '103.47.133.118', '2025-12-23 05:10:03');
INSERT INTO `activity_log` VALUES (24, 1, 'UPDATE', 'Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA', '103.47.133.175', '2025-12-23 05:11:01');
INSERT INTO `activity_log` VALUES (25, 1, 'LOGIN', 'Login berhasil', '182.2.78.157', '2025-12-23 12:52:46');
INSERT INTO `activity_log` VALUES (26, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 14:14:21');
INSERT INTO `activity_log` VALUES (27, 1, 'LOGIN', 'Login berhasil', '103.47.133.167', '2025-12-23 15:23:00');
INSERT INTO `activity_log` VALUES (28, 1, 'DELETE', 'Menghapus pendaftaran: Amet consequat Eni', '103.47.133.180', '2025-12-23 15:35:09');
INSERT INTO `activity_log` VALUES (29, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 16:18:47');
INSERT INTO `activity_log` VALUES (30, 1, 'LOGIN', 'Login berhasil', '182.2.85.170', '2025-12-23 17:43:12');
INSERT INTO `activity_log` VALUES (31, 1, 'LOGIN', 'Login berhasil', '103.47.133.160', '2025-12-23 18:14:56');
INSERT INTO `activity_log` VALUES (32, 1, 'DELETE', 'Menghapus pendaftaran: Laboris sed tempora', '103.47.133.160', '2025-12-23 18:15:22');
INSERT INTO `activity_log` VALUES (33, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 19:20:42');
INSERT INTO `activity_log` VALUES (34, 1, 'EXPORT', 'Export data pendaftaran ke Excel', '36.68.54.220', '2025-12-23 19:20:49');
INSERT INTO `activity_log` VALUES (35, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 19:45:49');
INSERT INTO `activity_log` VALUES (36, 1, 'LOGIN', 'Login berhasil', '103.47.133.127', '2025-12-23 20:52:19');
INSERT INTO `activity_log` VALUES (37, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 20:57:24');
INSERT INTO `activity_log` VALUES (38, 1, 'LOGIN', 'Login berhasil', '182.4.100.232', '2025-12-23 21:07:57');
INSERT INTO `activity_log` VALUES (39, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 21:11:13');
INSERT INTO `activity_log` VALUES (40, 1, 'LOGIN', 'Login berhasil', '182.4.100.232', '2025-12-23 21:14:08');
INSERT INTO `activity_log` VALUES (41, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 21:15:32');
INSERT INTO `activity_log` VALUES (42, 1, 'LOGIN', 'Login berhasil', '103.47.133.105', '2025-12-23 21:30:29');
INSERT INTO `activity_log` VALUES (43, 1, 'LOGIN', 'Login berhasil', '103.47.133.168', '2025-12-24 01:42:49');
INSERT INTO `activity_log` VALUES (44, 1, 'LOGIN', 'Login berhasil', '103.47.133.136', '2025-12-24 10:59:38');
INSERT INTO `activity_log` VALUES (45, 1, 'LOGIN', 'Login berhasil', '103.47.133.77', '2025-12-24 11:20:09');
INSERT INTO `activity_log` VALUES (46, 1, 'LOGIN', 'Login berhasil', '103.47.133.126', '2025-12-24 14:12:34');
INSERT INTO `activity_log` VALUES (47, 1, 'LOGIN', 'Login berhasil', '182.2.50.28', '2025-12-24 14:47:02');
INSERT INTO `activity_log` VALUES (48, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-25 09:22:51');
INSERT INTO `activity_log` VALUES (49, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-25 16:41:12');
INSERT INTO `activity_log` VALUES (50, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-25 20:12:00');
INSERT INTO `activity_log` VALUES (51, 1, 'LOGIN', 'Login berhasil', '103.47.133.97', '2025-12-26 01:11:56');
INSERT INTO `activity_log` VALUES (52, 1, 'LOGIN', 'Login berhasil', '103.47.133.130', '2025-12-26 01:21:30');
INSERT INTO `activity_log` VALUES (53, 1, 'WA_BERKAS', 'Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR', '103.47.133.189', '2025-12-26 01:22:43');
INSERT INTO `activity_log` VALUES (54, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-26 09:04:42');
INSERT INTO `activity_log` VALUES (55, 1, 'EXPORT', 'Export data pendaftaran ke Excel', '36.68.54.220', '2025-12-26 09:04:46');
INSERT INTO `activity_log` VALUES (56, 1, 'WA_BERKAS', 'Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR', '36.68.54.220', '2025-12-26 09:05:25');
INSERT INTO `activity_log` VALUES (57, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-26 19:08:05');
INSERT INTO `activity_log` VALUES (58, 1, 'LOGIN', 'Login berhasil', '182.2.38.112', '2025-12-27 10:25:33');
INSERT INTO `activity_log` VALUES (59, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-29 20:50:05');
INSERT INTO `activity_log` VALUES (60, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '36.68.54.220', '2025-12-29 20:50:12');
INSERT INTO `activity_log` VALUES (61, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 17:10:29');
INSERT INTO `activity_log` VALUES (62, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 18:54:12');
INSERT INTO `activity_log` VALUES (63, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 19:41:36');
INSERT INTO `activity_log` VALUES (64, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 21:54:01');
INSERT INTO `activity_log` VALUES (65, 1, 'LOGIN', 'Login berhasil', '182.2.74.146', '2025-12-31 13:11:15');
INSERT INTO `activity_log` VALUES (66, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-01 14:10:54');
INSERT INTO `activity_log` VALUES (67, 1, 'LOGIN', 'Login berhasil', '182.2.77.150', '2026-01-01 18:54:41');
INSERT INTO `activity_log` VALUES (68, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-01 21:49:33');
INSERT INTO `activity_log` VALUES (69, 1, 'LOGIN', 'Login berhasil', '182.2.46.175', '2026-01-02 18:08:10');
INSERT INTO `activity_log` VALUES (70, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-03 07:29:01');
INSERT INTO `activity_log` VALUES (71, 1, 'LOGIN', 'Login berhasil', '182.2.85.195', '2026-01-04 11:20:46');
INSERT INTO `activity_log` VALUES (72, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-04 18:19:24');
INSERT INTO `activity_log` VALUES (73, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-05 09:34:51');
INSERT INTO `activity_log` VALUES (74, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-05 13:38:35');
INSERT INTO `activity_log` VALUES (75, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-05 18:47:45');
INSERT INTO `activity_log` VALUES (76, 1, 'LOGIN', 'Login berhasil', '36.68.55.54', '2026-01-06 06:37:03');
INSERT INTO `activity_log` VALUES (77, 1, 'LOGIN', 'Login berhasil', '36.68.55.54', '2026-01-07 13:01:15');
INSERT INTO `activity_log` VALUES (78, 1, 'LOGIN', 'Login berhasil', '180.242.147.248', '2026-01-09 03:31:30');
INSERT INTO `activity_log` VALUES (79, 1, 'LOGIN', 'Login berhasil', '180.242.147.248', '2026-01-09 12:34:31');
INSERT INTO `activity_log` VALUES (80, 1, 'LOGIN', 'Login berhasil', '180.244.223.250', '2026-01-09 19:46:36');
INSERT INTO `activity_log` VALUES (81, 1, 'LOGIN', 'Login berhasil', '180.244.223.250', '2026-01-09 19:54:27');
INSERT INTO `activity_log` VALUES (82, 1, 'LOGIN', 'Login berhasil', '180.244.223.250', '2026-01-09 19:56:26');
INSERT INTO `activity_log` VALUES (83, 1, 'LOGIN', 'Login berhasil', '182.2.46.68', '2026-01-10 11:55:26');
INSERT INTO `activity_log` VALUES (84, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 08:10:59');
INSERT INTO `activity_log` VALUES (85, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 09:33:54');
INSERT INTO `activity_log` VALUES (86, 1, 'UPDATE', 'Mengupdate data pendaftaran: INTAN MUTIA RAMADHANI', '36.68.55.95', '2026-01-11 09:34:15');
INSERT INTO `activity_log` VALUES (87, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 13:50:32');
INSERT INTO `activity_log` VALUES (88, 1, 'UPDATE', 'Mengupdate data pendaftaran: M. KHAIRUN HAFIZAR', '36.68.55.95', '2026-01-11 13:50:57');
INSERT INTO `activity_log` VALUES (89, 1, 'DELETE', 'Menghapus pendaftaran: M. KHAIRUN HAFIZAR', '36.68.55.95', '2026-01-11 13:51:44');
INSERT INTO `activity_log` VALUES (90, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 16:34:00');
INSERT INTO `activity_log` VALUES (91, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 23:12:33');
INSERT INTO `activity_log` VALUES (92, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-12 05:10:20');
INSERT INTO `activity_log` VALUES (93, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-12 21:13:05');
INSERT INTO `activity_log` VALUES (94, 1, 'LOGIN', 'Login berhasil', '182.2.43.174', '2026-01-13 10:04:37');
INSERT INTO `activity_log` VALUES (95, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-13 10:07:30');
INSERT INTO `activity_log` VALUES (96, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-13 10:08:52');
INSERT INTO `activity_log` VALUES (97, 1, 'UPDATE', 'Mengupdate data pendaftaran: FATAN FIRMANSYAH', '36.68.55.95', '2026-01-13 10:24:31');
INSERT INTO `activity_log` VALUES (98, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-13 12:25:20');
INSERT INTO `activity_log` VALUES (99, 1, 'LOGIN', 'Login berhasil', '36.68.53.208', '2026-01-13 20:20:40');
INSERT INTO `activity_log` VALUES (100, 1, 'LOGIN', 'Login berhasil', '36.68.53.208', '2026-01-15 07:21:20');
INSERT INTO `activity_log` VALUES (101, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-17 12:59:57');
INSERT INTO `activity_log` VALUES (102, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-17 13:22:29');
INSERT INTO `activity_log` VALUES (103, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-18 08:57:23');
INSERT INTO `activity_log` VALUES (104, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-18 08:58:22');
INSERT INTO `activity_log` VALUES (105, 1, 'EXPORT', 'Export data pendaftaran ke Excel', '36.68.55.229', '2026-01-18 08:58:28');
INSERT INTO `activity_log` VALUES (106, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-19 21:45:14');
INSERT INTO `activity_log` VALUES (107, 1, 'LOGIN', 'Login berhasil', '182.2.47.129', '2026-01-20 11:36:46');
INSERT INTO `activity_log` VALUES (108, 1, 'LOGIN', 'Login berhasil', '182.2.45.39', '2026-01-20 15:16:45');
INSERT INTO `activity_log` VALUES (109, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-20 17:11:37');
INSERT INTO `activity_log` VALUES (110, 1, 'LOGIN', 'Login berhasil', '182.2.50.103', '2026-01-21 22:53:26');
INSERT INTO `activity_log` VALUES (111, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-23 05:53:25');
INSERT INTO `activity_log` VALUES (112, 1, 'LOGIN', 'Login berhasil', '182.2.40.150', '2026-01-24 10:33:24');
INSERT INTO `activity_log` VALUES (113, 1, 'LOGIN', 'Login berhasil', '182.2.40.218', '2026-01-24 12:28:05');
INSERT INTO `activity_log` VALUES (114, 1, 'LOGIN', 'Login berhasil', '36.68.53.131', '2026-01-25 19:31:08');
INSERT INTO `activity_log` VALUES (115, 1, 'LOGIN', 'Login berhasil', '182.2.50.22', '2026-01-27 23:59:06');
INSERT INTO `activity_log` VALUES (116, 1, 'LOGIN', 'Login berhasil', '103.132.52.190', '2026-01-28 11:10:26');
INSERT INTO `activity_log` VALUES (117, 1, 'LOGIN', 'Login berhasil', '118.96.70.104', '2026-01-30 00:34:24');
INSERT INTO `activity_log` VALUES (118, 1, 'LOGIN', 'Login berhasil', '::1', '2026-02-03 00:08:00');
INSERT INTO `activity_log` VALUES (119, 1, 'LOGIN', 'Login berhasil', '::1', '2026-02-03 06:25:37');
INSERT INTO `activity_log` VALUES (120, 1, 'UPDATE', 'Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA', '::1', '2026-02-03 07:22:17');
INSERT INTO `activity_log` VALUES (121, 1, 'UPDATE', 'Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA', '::1', '2026-02-03 10:08:41');
INSERT INTO `activity_log` VALUES (122, 1, 'LOGIN', 'Login berhasil', '::1', '2026-02-03 10:18:41');
INSERT INTO `activity_log` VALUES (123, 1, 'UPDATE', 'Mengupdate data pendaftaran: INTAN MUTIA RAMADHANI', '::1', '2026-02-03 10:20:14');
INSERT INTO `activity_log` VALUES (124, 1, 'UPDATE', 'Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA', '::1', '2026-02-03 10:25:26');
INSERT INTO `activity_log` VALUES (125, 1, 'LOGIN', 'Login berhasil', '::1', '2026-02-03 19:43:45');
INSERT INTO `activity_log` VALUES (126, 1, 'WA_WELCOME', 'Kirim ucapan selamat ke: SOFA HILDA AYU MAULIDA (+6288216683867)', '::1', '2026-02-03 20:21:51');
INSERT INTO `activity_log` VALUES (127, 1, 'WA_WELCOME', 'Kirim ucapan selamat ke: SOFA HILDA AYU MAULIDA (+6288216683867)', '::1', '2026-02-03 20:22:23');

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin_spmb', '$2y$10$qAy5E2/jP4XA0XnUELjoReRTYXGEP19xz1086ut0ypwVIbtJaJ5KG', 'Admin SPMB', '2025-12-20 22:36:31');

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
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of kontak
-- ----------------------------
INSERT INTO `kontak` VALUES (1, 'SMP', 'Ust. Rino Mukti', '08123456789', 'http://wa.link/7svsg0');
INSERT INTO `kontak` VALUES (2, 'MA', 'Ust. Akrom Adabi', '0856 4164 7478', 'https://wa.link/ire9yv');
INSERT INTO `kontak` VALUES (3, 'PONPES', 'Ust. M. Kowi', '08123456790', 'https://wa.link/20sq3q');

-- ----------------------------
-- Table structure for log_aktivitas
-- ----------------------------
DROP TABLE IF EXISTS `log_aktivitas`;
CREATE TABLE `log_aktivitas`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'Admin',
  `aksi` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'CREATE, UPDATE, DELETE',
  `modul` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'PEMASUKAN, PENGELUARAN',
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_log_modul`(`modul` ASC) USING BTREE,
  INDEX `idx_log_aksi`(`aksi` ASC) USING BTREE,
  INDEX `idx_log_created`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of log_aktivitas
-- ----------------------------
INSERT INTO `log_aktivitas` VALUES (1, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan INV-IN-20260202-8441 - Rp0', '2026-02-03 01:25:19');
INSERT INTO `log_aktivitas` VALUES (2, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan INV-IN-20260202-8441 - Rp2.000.000', '2026-02-03 01:25:50');
INSERT INTO `log_aktivitas` VALUES (3, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan INV-IN-20260202-8441 - Rp2.000.000', '2026-02-03 01:25:56');
INSERT INTO `log_aktivitas` VALUES (4, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan INV-IN-20260202-8441 - Rp0', '2026-02-03 01:26:04');
INSERT INTO `log_aktivitas` VALUES (5, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan INV-IN-20260202-8441 - Rp2.000.000', '2026-02-03 01:26:09');
INSERT INTO `log_aktivitas` VALUES (6, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan INV-IN-20260202-8441 - Rp1.000.000', '2026-02-03 01:26:26');
INSERT INTO `log_aktivitas` VALUES (7, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan INV-IN-20260202-4197 - Rp500.000', '2026-02-03 01:26:47');
INSERT INTO `log_aktivitas` VALUES (8, NULL, 'Admin', 'DELETE', 'PEMASUKAN', 'Hapus pemasukan INV-IN-20260202-4197 - Rp500.000', '2026-02-03 01:27:02');
INSERT INTO `log_aktivitas` VALUES (9, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan INV-IN-20260202-9821 - Rp150.000', '2026-02-03 01:30:14');
INSERT INTO `log_aktivitas` VALUES (10, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan M. KHAIRUN HAFIZAR - Rp500.000', '2026-02-03 06:33:58');
INSERT INTO `log_aktivitas` VALUES (11, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan FAATIKHUL KHAN - Rp3.400.000', '2026-02-03 07:04:00');
INSERT INTO `log_aktivitas` VALUES (12, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan SOFA HILDA AYU MAULIDA - Rp1.000.000', '2026-02-03 07:22:59');
INSERT INTO `log_aktivitas` VALUES (13, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan INTAN MUTIA RAMADHANI - Rp2.000.000', '2026-02-03 10:21:39');

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
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of pendaftaran
-- ----------------------------
INSERT INTO `pendaftaran` VALUES (1, '001.1225', 'SOFA HILDA AYU MAULIDA', 'SMP NU BP', '0142465055', 'PEKALONGAN', '2014-05-11', 'P', 1, '3326181712080002', '3375035105140002', 'DUSUN PANGKAH, RT. 003/RW. 002', 'JAWA TENGAH', '', '', '', 'SD MUHAMMADIYAH PANGKAH', '', NULL, NULL, '', '', 'PONDOK SELAIN PP MAMBAUL HUDA', 'KELUARGA', 'WARTO', 'PEKALONGAN', '1962-12-12', '3326181212620004', 'BURUH HARIAN LEPAS', '', 'UMI FADHILAH', 'PEKALONGAN', '1975-10-18', '3326185810750001', 'KARYAWAN SWASTA', '', '+6288216683867', '$2y$10$KNgNWdvM9c1VXGPqYtnJaOBtyh/4XDXB/vNYtqfsIPtr2KWR0GJ6q', '', '', '', '', 'pending', '', '2026-02-03 10:25:26', '2025-12-22 20:48:38', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (2, '002.1225', 'FATAN FIRMANSYAH', 'SMP NU BP', '', 'PEKALONGAN', '2013-01-11', 'L', 0, '3326131812120006', '3326131101130004', 'RT/RW 001/001', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'TANGKIL TENGAH', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'NUR AMINAH', 'PEKALONGAN', '1989-12-01', '33261358108900021', 'BURUH', '', 'NUR AMINAH', 'PEKALONGAN', '1989-12-01', '33261358108900021', 'BURUH', '', '+6285956403558', '$2y$10$e2xaWLOjroyQfwTTPEiMPeyGNa/LeSdlGib3OB9ZTZSjuUL62DTAG', '57_file_kk_1766473602.pdf', 'cuman tes', '', '', 'pending', '', '2026-01-13 10:24:31', '2025-12-23 14:03:11', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (4, '003.1225', 'INTAN MUTIA RAMADHANI', 'MA ALHIKAM', '0141584683', 'PEKALONGAN', '2014-07-21', 'P', 0, '3326141709140001', '3326146107140002', 'Bligo kec buaran RT 16 RW 05 no rumah 34', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'BLIGO', 'SD BLIGO', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'AGUS IMADUDDIN', 'PEKALONGAN', '1975-09-02', '', '', '', '', '', NULL, '', '', '', '+6285655896428', '$2y$10$ColX8hl0xDf4y8R7MjyDjutQUEj8EQkviZKpaB1DBYw.7wfGWqCMy', '', '', '', '', 'pending', '', '2026-02-03 10:20:14', '2025-12-30 17:14:59', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (5, '004.0126', 'FAATIKHUL KHAN', 'SMP NU BP', '', 'PEKALONGAN', '2014-04-08', 'L', 2, '3326140711130002', '3326140804140001', 'RT/RW 05/03 NO 52 KODE POS 51171', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'BLIGO', 'MIS BLIGO', '', NULL, NULL, '', '3690-01-007195-50-7', 'PONDOK PP MAMBAUL HUDA', 'ALUMNI', 'JOKO SETIAWAN', 'KENDAL', '1983-12-28', '3324122812830005', 'BURUH', '< 1 JUTA', 'FATIMAH', 'PEKALONGAN', '1993-06-21', '3326146106930001', 'IBU RUMAH TANGGA', '< 1 JUTA', '+6285335180100', '$2y$10$s9UhI63xP8ZDNEINE.7ED.St7U0xGmD6gd9leHGskag1KaLzfTvfa', 'file_kk_1767256354_69563122217b2.jpg', 'file_ktp_ortu_1767256354_69563122229ad.jpg', 'file_akta_1767256354_6956312223335.jpg', '', 'pending', NULL, NULL, '2026-01-01 15:32:34', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (6, '005.0126', 'MUHAMMAD SALMAN ARROYAN', 'SMP NU BP', '', 'Pekalongan', '0000-00-00', 'L', 0, '3326192406200018', '3375011807130002', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'WONOKERTO', 'WONOKERTO WETAN', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'ACHMAD SUBARI MUGIYONO', '', '0000-00-00', '', '', '', 'TRIYANA', '', '0000-00-00', '', '', '', '+6288233453695', '$2y$10$yYTVNOYfuMP6K3PhFeFjJe/L7DZkSli.wRJSTc97bHeVXXllCMTZq', 'file_kk_1767962644_6960f81449194.jpeg', '', 'file_akta_1767962644_6960f8144a24d.jpeg', '', 'pending', NULL, NULL, '2026-01-09 19:44:04', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (7, '006.0126', 'ULUL ILMI', 'SMP NU BP', '', 'PEKALONGAN', '0000-00-00', 'L', 0, '', '', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'TIRTO', 'NGALIAN', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'NUR ALIM', '', '0000-00-00', '', '', '', 'NUR FADILLAH', '', '0000-00-00', '', '', '', '+6285742687970', '$2y$10$ZSZUO89fc73oC59omdwXZeY4URuVXhN8xME762WFzafJuYdSrALQe', '', '', '', '', 'pending', NULL, NULL, '2026-01-09 19:53:27', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (9, '007.0126', 'M. KHAIRUN HAFIZAR', 'SMP NU BP', '', '', '0000-00-00', 'L', 0, '', '', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'AMBOKEMBANG', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'M. YUSUF KHAMBALI', '', '0000-00-00', '', '', '', 'KHOLIPAH', '', '0000-00-00', '', '', '', '+6285802767044', '$2y$10$EXq/Cgp9Dfnnnphq.XkmieccUuookuABeRVQqbrf93uTKchFDIzYu', '', '', '', '', 'pending', NULL, NULL, '2026-01-11 13:53:01', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (10, '008.0126', 'NABILA SALSABILA', 'SMP NU BP', '', 'PEKALONGAN', '0000-00-00', 'L', 0, '3326131710170001', '', 'RT/RW 002/004 KEDUNGUWUNI TIMUR', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'KEDUNGWUNI TIMUR', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'UMAR KHAMDAN', 'PEKALONGAN', '1980-07-23', '3375032307800004', 'BURUH HARIAN LEPAS', '1-3 JUTA', 'JAZILAH', 'PEKALONGAN', '1984-12-08', '3326134812840002', 'MENGURUS RUMAH TANGGA', '< 1 JUTA', '+628156553930', '$2y$10$fFA7awncfP6OLTlxlpHLF.8.gSXJnvROAkMYuovk63y8yacmA9Bze', '', '', '', '', 'pending', NULL, NULL, '2026-01-19 08:56:36', NULL, NULL);
INSERT INTO `pendaftaran` VALUES (11, '009.0126', 'LABIBAH ZAKIYYA', 'SMP NU BP', '00000000000000', 'PEMALANG', '2014-05-31', 'P', 1, '3327100408140015', '3327107105140001', 'DESA KENDALREJO DUSUN KEDUNG UTER PETARUKAN', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'PETARUKAN', 'KENDALREJO', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'MUHAMMAD TIMBUL PRAYITNO', 'PEMALANG', '1992-09-10', '3327101009920046', 'WIRASWASTA', '3-5 JUTA', 'KHAERUNISA', 'PEMALANG', '1991-07-15', '3327105507910027', 'MENGURUS RUMAH TANGGA', '< 1 JUTA', '+6285225052902', '$2y$10$pt/zK3jgmYbpNr8qvTK4L.MIRV3oJPQHzzxXL4PWVCQ3KH5rPLElK', '', '', '', '', 'pending', NULL, NULL, '2026-01-19 09:09:47', NULL, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of pengaturan
-- ----------------------------
INSERT INTO `pengaturan` VALUES (1, 'status_pendaftaran', '1', 'Status pendaftaran: 1=Buka, 0=Tutup');
INSERT INTO `pengaturan` VALUES (2, 'tahun_ajaran', '2026/2027', 'Tahun ajaran aktif');
INSERT INTO `pengaturan` VALUES (3, 'link_pdf_biaya', 'https://s.id/biayapendaftaran', 'Link download PDF biaya');
INSERT INTO `pengaturan` VALUES (4, 'link_pdf_brosur', 'https://s.id/brosur_2526', 'Link download PDF brosur');
INSERT INTO `pengaturan` VALUES (5, 'link_pdf_syarat', 'https://drive.google.com/file/d/1vbwof-2w_v2wzvosNYTzyE74EJqR0cEQ/view?usp=sharing', 'Link download PDF syarat');
INSERT INTO `pengaturan` VALUES (6, 'link_beasiswa', 'https://s.id/BeasiswaMAHAKAM', 'Link info beasiswa lengkap');
INSERT INTO `pengaturan` VALUES (7, 'gelombang_1_start', '2026-01-01', 'Tanggal mulai gelombang 1');
INSERT INTO `pengaturan` VALUES (8, 'gelombang_1_end', '2026-03-31', 'Tanggal selesai gelombang 1');
INSERT INTO `pengaturan` VALUES (9, 'gelombang_2_start', '2026-04-01', 'Tanggal mulai gelombang 2');
INSERT INTO `pengaturan` VALUES (10, 'gelombang_2_end', '2026-06-30', 'Tanggal selesai gelombang 2');
INSERT INTO `pengaturan` VALUES (11, 'link_grup_wa', 'https://chat.whatsapp.com/L4X6uCkZlAf0vwmhJgaJV2', 'Link grup WhatsApp untuk pendaftar baru');

-- ----------------------------
-- Table structure for perlengkapan_items
-- ----------------------------
DROP TABLE IF EXISTS `perlengkapan_items`;
CREATE TABLE `perlengkapan_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_item` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nominal` int NOT NULL DEFAULT 0,
  `urutan` int NULL DEFAULT 0,
  `aktif` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of perlengkapan_items
-- ----------------------------
INSERT INTO `perlengkapan_items` VALUES (1, 'Kasur', 500000, 1, 1, '2026-02-03 00:08:49');
INSERT INTO `perlengkapan_items` VALUES (2, 'Almari', 750000, 2, 1, '2026-02-03 00:08:49');
INSERT INTO `perlengkapan_items` VALUES (3, 'Bantal', 100000, 3, 1, '2026-02-03 00:08:49');
INSERT INTO `perlengkapan_items` VALUES (4, 'Guling', 75000, 4, 1, '2026-02-03 00:08:49');
INSERT INTO `perlengkapan_items` VALUES (5, 'Selimut', 150000, 5, 1, '2026-02-03 00:08:49');

-- ----------------------------
-- Table structure for perlengkapan_pesanan
-- ----------------------------
DROP TABLE IF EXISTS `perlengkapan_pesanan`;
CREATE TABLE `perlengkapan_pesanan`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `pendaftaran_id` int NOT NULL,
  `perlengkapan_item_id` int NOT NULL,
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '1=dipesan, 0=dibatalkan',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_pesanan`(`pendaftaran_id` ASC, `perlengkapan_item_id` ASC) USING BTREE,
  INDEX `perlengkapan_item_id`(`perlengkapan_item_id` ASC) USING BTREE,
  CONSTRAINT `perlengkapan_pesanan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `perlengkapan_pesanan_ibfk_2` FOREIGN KEY (`perlengkapan_item_id`) REFERENCES `perlengkapan_items` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of perlengkapan_pesanan
-- ----------------------------
INSERT INTO `perlengkapan_pesanan` VALUES (1, 5, 1, 1, '2026-02-03 00:41:18', '2026-02-03 07:03:42');
INSERT INTO `perlengkapan_pesanan` VALUES (2, 5, 2, 1, '2026-02-03 00:41:24', '2026-02-03 07:03:45');
INSERT INTO `perlengkapan_pesanan` VALUES (3, 11, 1, 0, '2026-02-03 00:41:31', '2026-02-03 06:27:34');
INSERT INTO `perlengkapan_pesanan` VALUES (4, 2, 2, 0, '2026-02-03 00:57:31', '2026-02-03 06:27:29');
INSERT INTO `perlengkapan_pesanan` VALUES (5, 2, 1, 1, '2026-02-03 00:57:34', '2026-02-03 21:24:25');
INSERT INTO `perlengkapan_pesanan` VALUES (6, 1, 2, 1, '2026-02-03 07:22:24', '2026-02-03 07:22:24');

-- ----------------------------
-- Table structure for transaksi_pemasukan
-- ----------------------------
DROP TABLE IF EXISTS `transaksi_pemasukan`;
CREATE TABLE `transaksi_pemasukan`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pendaftaran_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int NOT NULL,
  `jenis_pembayaran` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Pendaftaran/Daftar Ulang/Perlengkapan/dll',
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `invoice`(`invoice` ASC) USING BTREE,
  INDEX `idx_pemasukan_pendaftaran`(`pendaftaran_id` ASC) USING BTREE,
  INDEX `idx_pemasukan_tanggal`(`tanggal` ASC) USING BTREE,
  CONSTRAINT `transaksi_pemasukan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transaksi_pemasukan
-- ----------------------------
INSERT INTO `transaksi_pemasukan` VALUES (2, 'INV-IN-20260202-8441', 2, '2026-02-02', 1000000, 'Transfer', 'tes', '2026-02-03 01:17:36');
INSERT INTO `transaksi_pemasukan` VALUES (4, 'INV-IN-20260202-9821', 1, '2026-02-02', 150000, 'Transfer', '', '2026-02-03 01:30:14');
INSERT INTO `transaksi_pemasukan` VALUES (5, 'INV-IN-20260202-4070', 9, '2026-02-02', 500000, 'Cash', '', '2026-02-03 06:33:58');
INSERT INTO `transaksi_pemasukan` VALUES (6, 'INV-IN-20260203-0231', 5, '2026-02-03', 3400000, 'Cash', '', '2026-02-03 07:04:00');
INSERT INTO `transaksi_pemasukan` VALUES (7, 'INV-IN-20260203-4485', 1, '2026-02-03', 1000000, 'Cash', '', '2026-02-03 07:22:59');
INSERT INTO `transaksi_pemasukan` VALUES (8, 'INV-IN-20260203-4556', 4, '2026-02-03', 2000000, 'Cash', '', '2026-02-03 10:21:39');

-- ----------------------------
-- Table structure for transaksi_pengeluaran
-- ----------------------------
DROP TABLE IF EXISTS `transaksi_pengeluaran`;
CREATE TABLE `transaksi_pengeluaran`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int NOT NULL,
  `kategori` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Sesuai item dari tabel biaya',
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `invoice`(`invoice` ASC) USING BTREE,
  INDEX `idx_pengeluaran_tanggal`(`tanggal` ASC) USING BTREE,
  INDEX `idx_pengeluaran_kategori`(`kategori` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transaksi_pengeluaran
-- ----------------------------
INSERT INTO `transaksi_pengeluaran` VALUES (1, 'INV-OUT-20260202-2140', '2026-02-02', 100000, 'Seragam Bawahan', 'Tes', '2026-02-03 01:11:39');

SET FOREIGN_KEY_CHECKS = 1;
