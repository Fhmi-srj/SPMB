-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: diantar2_daftar_db
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `description` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `admin_id` (`admin_id`) USING BTREE,
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` VALUES (1,1,'LOGIN','Login berhasil','::1','2025-12-20 16:04:22'),(2,1,'PASSWORD_CHANGE','Mengubah password admin','::1','2025-12-20 16:04:52'),(3,1,'PROFILE_UPDATE','Mengubah profil admin','::1','2025-12-20 16:05:03'),(4,1,'LOGIN','Login berhasil','::1','2025-12-20 17:52:08'),(5,1,'UPDATE','Mengupdate data pendaftaran: Rerum rem eu lorem m','::1','2025-12-20 18:01:01'),(6,1,'UPDATE','Mengupdate data pendaftaran: Rerum rem eu lorem m','::1','2025-12-20 18:02:07'),(7,1,'DELETE','Menghapus pendaftaran: Ut et excepteur quia','::1','2025-12-20 18:02:31'),(8,1,'DELETE','Menghapus pendaftaran: Rerum rem eu lorem m','::1','2025-12-20 18:49:45'),(9,1,'LOGIN','Login berhasil','103.47.133.117','2025-12-22 04:59:30'),(10,1,'DELETE','Menghapus pendaftaran: Fahmi','103.47.133.151','2025-12-22 06:32:21'),(11,1,'LOGIN','Login berhasil','36.68.53.171','2025-12-22 06:38:36'),(12,1,'LOGIN','Login berhasil','103.47.133.123','2025-12-22 06:55:31'),(13,1,'PROFILE_UPDATE','Mengubah profil admin','103.47.133.123','2025-12-22 06:55:52'),(14,1,'PASSWORD_CHANGE','Mengubah password admin','103.47.133.123','2025-12-22 06:56:19'),(15,1,'LOGIN','Login berhasil','103.47.133.76','2025-12-22 06:59:08'),(16,1,'LOGIN','Login berhasil','36.68.53.171','2025-12-22 07:00:33'),(17,1,'LOGIN','Login berhasil','103.47.133.76','2025-12-22 07:02:02'),(18,1,'UPDATE','Mengupdate data pendaftaran: Fahmi Muhammad Sirojul Munir','103.47.133.76','2025-12-22 07:02:12'),(19,1,'DELETE','Menghapus pendaftaran: Fahmi Muhammad Sirojul Munir','103.47.133.76','2025-12-22 07:02:42'),(20,1,'LOGIN','Login berhasil','103.47.133.101','2025-12-22 07:06:00'),(21,1,'LOGIN','Login berhasil','103.47.133.183','2025-12-22 09:30:41'),(22,1,'DELETE','Menghapus pendaftaran: Fahmi Muhammad Sirojul Munir','103.47.133.183','2025-12-22 09:31:04'),(23,1,'LOGIN','Login berhasil','103.47.133.118','2025-12-22 22:10:03'),(24,1,'UPDATE','Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA','103.47.133.175','2025-12-22 22:11:01'),(25,1,'LOGIN','Login berhasil','182.2.78.157','2025-12-23 05:52:46'),(26,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-23 07:14:21'),(27,1,'LOGIN','Login berhasil','103.47.133.167','2025-12-23 08:23:00'),(28,1,'DELETE','Menghapus pendaftaran: Amet consequat Eni','103.47.133.180','2025-12-23 08:35:09'),(29,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-23 09:18:47'),(30,1,'LOGIN','Login berhasil','182.2.85.170','2025-12-23 10:43:12'),(31,1,'LOGIN','Login berhasil','103.47.133.160','2025-12-23 11:14:56'),(32,1,'DELETE','Menghapus pendaftaran: Laboris sed tempora','103.47.133.160','2025-12-23 11:15:22'),(33,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-23 12:20:42'),(34,1,'EXPORT','Export data pendaftaran ke Excel','36.68.54.220','2025-12-23 12:20:49'),(35,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-23 12:45:49'),(36,1,'LOGIN','Login berhasil','103.47.133.127','2025-12-23 13:52:19'),(37,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-23 13:57:24'),(38,1,'LOGIN','Login berhasil','182.4.100.232','2025-12-23 14:07:57'),(39,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-23 14:11:13'),(40,1,'LOGIN','Login berhasil','182.4.100.232','2025-12-23 14:14:08'),(41,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-23 14:15:32'),(42,1,'LOGIN','Login berhasil','103.47.133.105','2025-12-23 14:30:29'),(43,1,'LOGIN','Login berhasil','103.47.133.168','2025-12-23 18:42:49'),(44,1,'LOGIN','Login berhasil','103.47.133.136','2025-12-24 03:59:38'),(45,1,'LOGIN','Login berhasil','103.47.133.77','2025-12-24 04:20:09'),(46,1,'LOGIN','Login berhasil','103.47.133.126','2025-12-24 07:12:34'),(47,1,'LOGIN','Login berhasil','182.2.50.28','2025-12-24 07:47:02'),(48,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-25 02:22:51'),(49,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-25 09:41:12'),(50,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-25 13:12:00'),(51,1,'LOGIN','Login berhasil','103.47.133.97','2025-12-25 18:11:56'),(52,1,'LOGIN','Login berhasil','103.47.133.130','2025-12-25 18:21:30'),(53,1,'WA_BERKAS','Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR','103.47.133.189','2025-12-25 18:22:43'),(54,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-26 02:04:42'),(55,1,'EXPORT','Export data pendaftaran ke Excel','36.68.54.220','2025-12-26 02:04:46'),(56,1,'WA_BERKAS','Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR','36.68.54.220','2025-12-26 02:05:25'),(57,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-26 12:08:05'),(58,1,'LOGIN','Login berhasil','182.2.38.112','2025-12-27 03:25:33'),(59,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-29 13:50:05'),(60,1,'DELETE','Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR','36.68.54.220','2025-12-29 13:50:12'),(61,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-30 10:10:29'),(62,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-30 11:54:12'),(63,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-30 12:41:36'),(64,1,'LOGIN','Login berhasil','36.68.54.220','2025-12-30 14:54:01'),(65,1,'LOGIN','Login berhasil','182.2.74.146','2025-12-31 06:11:15'),(66,1,'LOGIN','Login berhasil','36.68.53.241','2026-01-01 07:10:54'),(67,1,'LOGIN','Login berhasil','182.2.77.150','2026-01-01 11:54:41'),(68,1,'LOGIN','Login berhasil','36.68.53.241','2026-01-01 14:49:33'),(69,1,'LOGIN','Login berhasil','182.2.46.175','2026-01-02 11:08:10'),(70,1,'LOGIN','Login berhasil','36.68.53.241','2026-01-03 00:29:01'),(71,1,'LOGIN','Login berhasil','182.2.85.195','2026-01-04 04:20:46'),(72,1,'LOGIN','Login berhasil','36.68.53.241','2026-01-04 11:19:24'),(73,1,'LOGIN','Login berhasil','36.68.53.241','2026-01-05 02:34:51'),(74,1,'LOGIN','Login berhasil','36.68.53.241','2026-01-05 06:38:35'),(75,1,'LOGIN','Login berhasil','36.68.53.241','2026-01-05 11:47:45'),(76,1,'LOGIN','Login berhasil','36.68.55.54','2026-01-05 23:37:03'),(77,1,'LOGIN','Login berhasil','36.68.55.54','2026-01-07 06:01:15'),(78,1,'LOGIN','Login berhasil','180.242.147.248','2026-01-08 20:31:30'),(79,1,'LOGIN','Login berhasil','180.242.147.248','2026-01-09 05:34:31'),(80,1,'LOGIN','Login berhasil','180.244.223.250','2026-01-09 12:46:36'),(81,1,'LOGIN','Login berhasil','180.244.223.250','2026-01-09 12:54:27'),(82,1,'LOGIN','Login berhasil','180.244.223.250','2026-01-09 12:56:26'),(83,1,'LOGIN','Login berhasil','182.2.46.68','2026-01-10 04:55:26'),(84,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-11 01:10:59'),(85,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-11 02:33:54'),(86,1,'UPDATE','Mengupdate data pendaftaran: INTAN MUTIA RAMADHANI','36.68.55.95','2026-01-11 02:34:15'),(87,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-11 06:50:32'),(88,1,'UPDATE','Mengupdate data pendaftaran: M. KHAIRUN HAFIZAR','36.68.55.95','2026-01-11 06:50:57'),(89,1,'DELETE','Menghapus pendaftaran: M. KHAIRUN HAFIZAR','36.68.55.95','2026-01-11 06:51:44'),(90,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-11 09:34:00'),(91,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-11 16:12:33'),(92,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-11 22:10:20'),(93,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-12 14:13:05'),(94,1,'LOGIN','Login berhasil','182.2.43.174','2026-01-13 03:04:37'),(95,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-13 03:07:30'),(96,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-13 03:08:52'),(97,1,'UPDATE','Mengupdate data pendaftaran: FATAN FIRMANSYAH','36.68.55.95','2026-01-13 03:24:31'),(98,1,'LOGIN','Login berhasil','36.68.55.95','2026-01-13 05:25:20'),(99,1,'LOGIN','Login berhasil','36.68.53.208','2026-01-13 13:20:40'),(100,1,'LOGIN','Login berhasil','36.68.53.208','2026-01-15 00:21:20'),(101,1,'LOGIN','Login berhasil','36.68.55.229','2026-01-17 05:59:57'),(102,1,'LOGIN','Login berhasil','36.68.55.229','2026-01-17 06:22:29'),(103,1,'LOGIN','Login berhasil','36.68.55.229','2026-01-18 01:57:23'),(104,1,'LOGIN','Login berhasil','36.68.55.229','2026-01-18 01:58:22'),(105,1,'EXPORT','Export data pendaftaran ke Excel','36.68.55.229','2026-01-18 01:58:28'),(106,1,'LOGIN','Login berhasil','36.68.55.229','2026-01-19 14:45:14'),(107,1,'LOGIN','Login berhasil','182.2.47.129','2026-01-20 04:36:46'),(108,1,'LOGIN','Login berhasil','182.2.45.39','2026-01-20 08:16:45'),(109,1,'LOGIN','Login berhasil','36.68.55.229','2026-01-20 10:11:37'),(110,1,'LOGIN','Login berhasil','182.2.50.103','2026-01-21 15:53:26'),(111,1,'LOGIN','Login berhasil','36.68.55.229','2026-01-22 22:53:25'),(112,1,'LOGIN','Login berhasil','182.2.40.150','2026-01-24 03:33:24'),(113,1,'LOGIN','Login berhasil','182.2.40.218','2026-01-24 05:28:05'),(114,1,'LOGIN','Login berhasil','36.68.53.131','2026-01-25 12:31:08'),(115,1,'LOGIN','Login berhasil','182.2.50.22','2026-01-27 16:59:06'),(116,1,'LOGIN','Login berhasil','103.132.52.190','2026-01-28 04:10:26'),(117,1,'LOGIN','Login berhasil','118.96.70.104','2026-01-29 17:34:24'),(118,1,'LOGIN','Login berhasil','::1','2026-02-02 17:08:00'),(119,1,'LOGIN','Login berhasil','::1','2026-02-02 23:25:37'),(120,1,'UPDATE','Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA','::1','2026-02-03 00:22:17'),(121,1,'UPDATE','Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA','::1','2026-02-03 03:08:41'),(122,1,'LOGIN','Login berhasil','::1','2026-02-03 03:18:41'),(123,1,'UPDATE','Mengupdate data pendaftaran: INTAN MUTIA RAMADHANI','::1','2026-02-03 03:20:14'),(124,1,'UPDATE','Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA','::1','2026-02-03 03:25:26'),(125,1,'LOGIN','Login berhasil','::1','2026-02-03 12:43:45'),(126,1,'WA_WELCOME','Kirim ucapan selamat ke: SOFA HILDA AYU MAULIDA (+6288216683867)','::1','2026-02-03 13:21:51'),(127,1,'WA_WELCOME','Kirim ucapan selamat ke: SOFA HILDA AYU MAULIDA (+6288216683867)','::1','2026-02-03 13:22:23'),(128,1,'LOGIN','Login berhasil','::1','2026-02-18 03:55:41');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin_spmb','$2y$10$qAy5E2/jP4XA0XnUELjoReRTYXGEP19xz1086ut0ypwVIbtJaJ5KG','Admin SPMB','2025-12-20 15:36:31');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beasiswa`
--

DROP TABLE IF EXISTS `beasiswa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beasiswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jenis` varchar(100) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `syarat` varchar(200) NOT NULL,
  `benefit` varchar(100) NOT NULL,
  `urutan` int DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beasiswa`
--

LOCK TABLES `beasiswa` WRITE;
/*!40000 ALTER TABLE `beasiswa` DISABLE KEYS */;
INSERT INTO `beasiswa` VALUES (1,'Tahfidz','Penghafal Al-Quran','Hafal 1-5 Juz','Gratis SPP 1 Bulan',1),(2,'Tahfidz','Penghafal Al-Quran','Hafal 6-10 Juz','Gratis SPP 2 Bulan',2),(3,'Tahfidz','Penghafal Al-Quran','Hafal 11-20 Juz','Gratis SPP 3 Bulan',3),(4,'Tahfidz','Penghafal Al-Quran','Hafal 21-30 Juz','Gratis SPP 6 Bulan',4),(5,'Akademik','Berdasarkan Nilai Rapor','Nilai 90-100','Gratis SPP 3 Bulan',5),(6,'Akademik','Berdasarkan Nilai Rapor','Nilai 80-89','Gratis SPP 2 Bulan',6),(7,'Akademik','Berdasarkan Nilai Rapor','Nilai 70-79','Gratis SPP 1 Bulan',7),(8,'Yatim/Piatu','Keringanan','Yatim/Piatu','Potongan 25% SPP',8),(9,'Yatim/Piatu','Keringanan','Yatim Piatu','Potongan 50% SPP',9);
/*!40000 ALTER TABLE `beasiswa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biaya`
--

DROP TABLE IF EXISTS `biaya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biaya` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kategori` enum('PENDAFTARAN','DAFTAR_ULANG') NOT NULL,
  `nama_item` varchar(100) NOT NULL,
  `biaya_pondok` int DEFAULT '0',
  `biaya_smp` int DEFAULT '0',
  `biaya_ma` int DEFAULT '0',
  `urutan` int DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biaya`
--

LOCK TABLES `biaya` WRITE;
/*!40000 ALTER TABLE `biaya` DISABLE KEYS */;
INSERT INTO `biaya` VALUES (1,'PENDAFTARAN','Registrasi',50000,20000,30000,1),(2,'DAFTAR_ULANG','Baju Batik',0,65000,90000,1),(3,'DAFTAR_ULANG','Seragam Bawahan',0,0,75000,2),(4,'DAFTAR_ULANG','Jas Almamater',170000,0,150000,3),(5,'DAFTAR_ULANG','Kaos Olahraga',0,90000,100000,4),(6,'DAFTAR_ULANG','Badge Almamater',0,35000,40000,5),(7,'DAFTAR_ULANG','Buku Raport',40000,40000,35000,6),(8,'DAFTAR_ULANG','Infaq Bulan Pertama',600000,50000,100000,7),(9,'DAFTAR_ULANG','Kegiatan & Hari Besar',150000,50000,380000,8),(10,'DAFTAR_ULANG','Kitab/Buku Pelajaran',100000,0,350000,9),(11,'DAFTAR_ULANG','Perbaikan Asrama',500000,0,0,10),(12,'DAFTAR_ULANG','Kartu Santri',40000,0,0,11),(13,'DAFTAR_ULANG','Kebersihan',150000,0,0,12),(14,'DAFTAR_ULANG','Kalender',50000,0,0,13);
/*!40000 ALTER TABLE `biaya` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kontak`
--

DROP TABLE IF EXISTS `kontak`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kontak` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lembaga` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `no_whatsapp` varchar(20) NOT NULL,
  `link_wa` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kontak`
--

LOCK TABLES `kontak` WRITE;
/*!40000 ALTER TABLE `kontak` DISABLE KEYS */;
INSERT INTO `kontak` VALUES (1,'SMP','Ust. Rino Mukti','08123456789','http://wa.link/7svsg0'),(2,'MA','Ust. Akrom Adabi','0856 4164 7478','https://wa.link/ire9yv'),(3,'PONPES','Ust. M. Kowi','08123456790','https://wa.link/20sq3q');
/*!40000 ALTER TABLE `kontak` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_aktivitas`
--

DROP TABLE IF EXISTS `log_aktivitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_aktivitas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(100) DEFAULT 'Admin',
  `aksi` varchar(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE',
  `modul` varchar(50) NOT NULL COMMENT 'PEMASUKAN, PENGELUARAN',
  `detail` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_log_modul` (`modul`),
  KEY `idx_log_aksi` (`aksi`),
  KEY `idx_log_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_aktivitas`
--

LOCK TABLES `log_aktivitas` WRITE;
/*!40000 ALTER TABLE `log_aktivitas` DISABLE KEYS */;
INSERT INTO `log_aktivitas` VALUES (1,NULL,'Admin','UPDATE','PEMASUKAN','Edit pemasukan INV-IN-20260202-8441 - Rp0','2026-02-02 18:25:19'),(2,NULL,'Admin','UPDATE','PEMASUKAN','Edit pemasukan INV-IN-20260202-8441 - Rp2.000.000','2026-02-02 18:25:50'),(3,NULL,'Admin','UPDATE','PEMASUKAN','Edit pemasukan INV-IN-20260202-8441 - Rp2.000.000','2026-02-02 18:25:56'),(4,NULL,'Admin','UPDATE','PEMASUKAN','Edit pemasukan INV-IN-20260202-8441 - Rp0','2026-02-02 18:26:04'),(5,NULL,'Admin','UPDATE','PEMASUKAN','Edit pemasukan INV-IN-20260202-8441 - Rp2.000.000','2026-02-02 18:26:09'),(6,NULL,'Admin','UPDATE','PEMASUKAN','Edit pemasukan INV-IN-20260202-8441 - Rp1.000.000','2026-02-02 18:26:26'),(7,NULL,'Admin','CREATE','PEMASUKAN','Tambah pemasukan INV-IN-20260202-4197 - Rp500.000','2026-02-02 18:26:47'),(8,NULL,'Admin','DELETE','PEMASUKAN','Hapus pemasukan INV-IN-20260202-4197 - Rp500.000','2026-02-02 18:27:02'),(9,NULL,'Admin','CREATE','PEMASUKAN','Tambah pemasukan INV-IN-20260202-9821 - Rp150.000','2026-02-02 18:30:14'),(10,NULL,'Admin','CREATE','PEMASUKAN','Tambah pemasukan M. KHAIRUN HAFIZAR - Rp500.000','2026-02-02 23:33:58'),(11,NULL,'Admin','CREATE','PEMASUKAN','Tambah pemasukan FAATIKHUL KHAN - Rp3.400.000','2026-02-03 00:04:00'),(12,NULL,'Admin','CREATE','PEMASUKAN','Tambah pemasukan SOFA HILDA AYU MAULIDA - Rp1.000.000','2026-02-03 00:22:59'),(13,NULL,'Admin','CREATE','PEMASUKAN','Tambah pemasukan INTAN MUTIA RAMADHANI - Rp2.000.000','2026-02-03 03:21:39');
/*!40000 ALTER TABLE `log_aktivitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pendaftaran`
--

DROP TABLE IF EXISTS `pendaftaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pendaftaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `no_registrasi` varchar(10) DEFAULT NULL,
  `nama` varchar(100) NOT NULL,
  `lembaga` enum('SMP NU BP','MA ALHIKAM') NOT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `jumlah_saudara` int DEFAULT '0',
  `no_kk` varchar(20) DEFAULT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `alamat` text,
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
  `catatan_admin` text,
  `catatan_updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_phone` (`no_hp_wali`) USING BTREE,
  KEY `idx_reset_token` (`reset_token`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pendaftaran`
--

LOCK TABLES `pendaftaran` WRITE;
/*!40000 ALTER TABLE `pendaftaran` DISABLE KEYS */;
INSERT INTO `pendaftaran` VALUES (1,'001.1225','SOFA HILDA AYU MAULIDA','SMP NU BP','0142465055','PEKALONGAN','2014-05-11','P',1,'3326181712080002','3375035105140002','DUSUN PANGKAH, RT. 003/RW. 002','JAWA TENGAH','','','','SD MUHAMMADIYAH PANGKAH','',NULL,NULL,'','','PONDOK SELAIN PP MAMBAUL HUDA','KELUARGA','WARTO','PEKALONGAN','1962-12-12','3326181212620004','BURUH HARIAN LEPAS','','UMI FADHILAH','PEKALONGAN','1975-10-18','3326185810750001','KARYAWAN SWASTA','','+6288216683867','$2y$10$KNgNWdvM9c1VXGPqYtnJaOBtyh/4XDXB/vNYtqfsIPtr2KWR0GJ6q','','','','','pending','','2026-02-03 03:25:26','2025-12-22 13:48:38',NULL,NULL),(2,'002.1225','FATAN FIRMANSYAH','SMP NU BP','','PEKALONGAN','2013-01-11','L',0,'3326131812120006','3326131101130004','RT/RW 001/001','JAWA TENGAH','KABUPATEN PEKALONGAN','KEDUNGWUNI','TANGKIL TENGAH','','',NULL,NULL,'','','PONDOK PP MAMBAUL HUDA','TEMAN','NUR AMINAH','PEKALONGAN','1989-12-01','33261358108900021','BURUH','','NUR AMINAH','PEKALONGAN','1989-12-01','33261358108900021','BURUH','','+6285956403558','$2y$10$e2xaWLOjroyQfwTTPEiMPeyGNa/LeSdlGib3OB9ZTZSjuUL62DTAG','57_file_kk_1766473602.pdf','cuman tes','','','pending','','2026-01-13 03:24:31','2025-12-23 07:03:11',NULL,NULL),(4,'003.1225','INTAN MUTIA RAMADHANI','MA ALHIKAM','0141584683','PEKALONGAN','2014-07-21','P',0,'3326141709140001','3326146107140002','Bligo kec buaran RT 16 RW 05 no rumah 34','JAWA TENGAH','KABUPATEN PEKALONGAN','BUARAN','BLIGO','SD BLIGO','',NULL,NULL,'','','PONDOK PP MAMBAUL HUDA','TEMAN','AGUS IMADUDDIN','PEKALONGAN','1975-09-02','','','','','',NULL,'','','','+6285655896428','$2y$10$ColX8hl0xDf4y8R7MjyDjutQUEj8EQkviZKpaB1DBYw.7wfGWqCMy','','','','','pending','','2026-02-03 03:20:14','2025-12-30 10:14:59',NULL,NULL),(5,'004.0126','FAATIKHUL KHAN','SMP NU BP','','PEKALONGAN','2014-04-08','L',2,'3326140711130002','3326140804140001','RT/RW 05/03 NO 52 KODE POS 51171','JAWA TENGAH','KABUPATEN PEKALONGAN','BUARAN','BLIGO','MIS BLIGO','',NULL,NULL,'','3690-01-007195-50-7','PONDOK PP MAMBAUL HUDA','ALUMNI','JOKO SETIAWAN','KENDAL','1983-12-28','3324122812830005','BURUH','< 1 JUTA','FATIMAH','PEKALONGAN','1993-06-21','3326146106930001','IBU RUMAH TANGGA','< 1 JUTA','+6285335180100','$2y$10$s9UhI63xP8ZDNEINE.7ED.St7U0xGmD6gd9leHGskag1KaLzfTvfa','file_kk_1767256354_69563122217b2.jpg','file_ktp_ortu_1767256354_69563122229ad.jpg','file_akta_1767256354_6956312223335.jpg','','pending',NULL,NULL,'2026-01-01 08:32:34',NULL,NULL),(6,'005.0126','MUHAMMAD SALMAN ARROYAN','SMP NU BP','','Pekalongan','0000-00-00','L',0,'3326192406200018','3375011807130002','','JAWA TENGAH','KABUPATEN PEKALONGAN','WONOKERTO','WONOKERTO WETAN','','',NULL,NULL,'','','PONDOK PP MAMBAUL HUDA','','ACHMAD SUBARI MUGIYONO','','0000-00-00','','','','TRIYANA','','0000-00-00','','','','+6288233453695','$2y$10$yYTVNOYfuMP6K3PhFeFjJe/L7DZkSli.wRJSTc97bHeVXXllCMTZq','file_kk_1767962644_6960f81449194.jpeg','','file_akta_1767962644_6960f8144a24d.jpeg','','pending',NULL,NULL,'2026-01-09 12:44:04',NULL,NULL),(7,'006.0126','ULUL ILMI','SMP NU BP','','PEKALONGAN','0000-00-00','L',0,'','','','JAWA TENGAH','KABUPATEN PEKALONGAN','TIRTO','NGALIAN','','',NULL,NULL,'','','PONDOK PP MAMBAUL HUDA','','NUR ALIM','','0000-00-00','','','','NUR FADILLAH','','0000-00-00','','','','+6285742687970','$2y$10$ZSZUO89fc73oC59omdwXZeY4URuVXhN8xME762WFzafJuYdSrALQe','','','','','pending',NULL,NULL,'2026-01-09 12:53:27',NULL,NULL),(9,'007.0126','M. KHAIRUN HAFIZAR','SMP NU BP','','','0000-00-00','L',0,'','','','JAWA TENGAH','KABUPATEN PEKALONGAN','KEDUNGWUNI','AMBOKEMBANG','','',NULL,NULL,'','','PONDOK PP MAMBAUL HUDA','','M. YUSUF KHAMBALI','','0000-00-00','','','','KHOLIPAH','','0000-00-00','','','','+6285802767044','$2y$10$EXq/Cgp9Dfnnnphq.XkmieccUuookuABeRVQqbrf93uTKchFDIzYu','','','','','pending',NULL,NULL,'2026-01-11 06:53:01',NULL,NULL),(10,'008.0126','NABILA SALSABILA','SMP NU BP','','PEKALONGAN','0000-00-00','L',0,'3326131710170001','','RT/RW 002/004 KEDUNGUWUNI TIMUR','JAWA TENGAH','KABUPATEN PEKALONGAN','KEDUNGWUNI','KEDUNGWUNI TIMUR','','',NULL,NULL,'','','PONDOK PP MAMBAUL HUDA','','UMAR KHAMDAN','PEKALONGAN','1980-07-23','3375032307800004','BURUH HARIAN LEPAS','1-3 JUTA','JAZILAH','PEKALONGAN','1984-12-08','3326134812840002','MENGURUS RUMAH TANGGA','< 1 JUTA','+628156553930','$2y$10$fFA7awncfP6OLTlxlpHLF.8.gSXJnvROAkMYuovk63y8yacmA9Bze','','','','','pending',NULL,NULL,'2026-01-19 01:56:36',NULL,NULL),(11,'009.0126','LABIBAH ZAKIYYA','SMP NU BP','00000000000000','PEMALANG','2014-05-31','P',1,'3327100408140015','3327107105140001','DESA KENDALREJO DUSUN KEDUNG UTER PETARUKAN','JAWA TENGAH','KABUPATEN PEMALANG','PETARUKAN','KENDALREJO','','',NULL,NULL,'','','PONDOK PP MAMBAUL HUDA','','MUHAMMAD TIMBUL PRAYITNO','PEMALANG','1992-09-10','3327101009920046','WIRASWASTA','3-5 JUTA','KHAERUNISA','PEMALANG','1991-07-15','3327105507910027','MENGURUS RUMAH TANGGA','< 1 JUTA','+6285225052902','$2y$10$pt/zK3jgmYbpNr8qvTK4L.MIRV3oJPQHzzxXL4PWVCQ3KH5rPLElK','','','','','pending',NULL,NULL,'2026-01-19 02:09:47',NULL,NULL);
/*!40000 ALTER TABLE `pendaftaran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengaturan`
--

DROP TABLE IF EXISTS `pengaturan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengaturan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kunci` varchar(50) NOT NULL,
  `nilai` text,
  `keterangan` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `kunci` (`kunci`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengaturan`
--

LOCK TABLES `pengaturan` WRITE;
/*!40000 ALTER TABLE `pengaturan` DISABLE KEYS */;
INSERT INTO `pengaturan` VALUES (1,'status_pendaftaran','1','Status pendaftaran: 1=Buka, 0=Tutup'),(2,'tahun_ajaran','2026/2027','Tahun ajaran aktif'),(3,'link_pdf_biaya','https://s.id/biayapendaftaran','Link download PDF biaya'),(4,'link_pdf_brosur','https://s.id/brosur_2526','Link download PDF brosur'),(5,'link_pdf_syarat','https://drive.google.com/file/d/1vbwof-2w_v2wzvosNYTzyE74EJqR0cEQ/view?usp=sharing','Link download PDF syarat'),(6,'link_beasiswa','https://s.id/BeasiswaMAHAKAM','Link info beasiswa lengkap'),(7,'gelombang_1_start','2026-01-01','Tanggal mulai gelombang 1'),(8,'gelombang_1_end','2026-03-31','Tanggal selesai gelombang 1'),(9,'gelombang_2_start','2026-04-01','Tanggal mulai gelombang 2'),(10,'gelombang_2_end','2026-06-30','Tanggal selesai gelombang 2'),(11,'link_grup_wa','https://chat.whatsapp.com/L4X6uCkZlAf0vwmhJgaJV2','Link grup WhatsApp untuk pendaftar baru');
/*!40000 ALTER TABLE `pengaturan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perlengkapan_items`
--

DROP TABLE IF EXISTS `perlengkapan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perlengkapan_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_item` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nominal` int NOT NULL DEFAULT '0',
  `urutan` int DEFAULT '0',
  `aktif` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perlengkapan_items`
--

LOCK TABLES `perlengkapan_items` WRITE;
/*!40000 ALTER TABLE `perlengkapan_items` DISABLE KEYS */;
INSERT INTO `perlengkapan_items` VALUES (1,'Kasur',500000,1,1,'2026-02-02 17:08:49'),(2,'Almari',750000,2,1,'2026-02-02 17:08:49'),(3,'Bantal',100000,3,1,'2026-02-02 17:08:49'),(4,'Guling',75000,4,1,'2026-02-02 17:08:49'),(5,'Selimut',150000,5,1,'2026-02-02 17:08:49');
/*!40000 ALTER TABLE `perlengkapan_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perlengkapan_pesanan`
--

DROP TABLE IF EXISTS `perlengkapan_pesanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perlengkapan_pesanan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pendaftaran_id` int NOT NULL,
  `perlengkapan_item_id` int NOT NULL,
  `status` tinyint(1) DEFAULT '1' COMMENT '1=dipesan, 0=dibatalkan',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pesanan` (`pendaftaran_id`,`perlengkapan_item_id`),
  KEY `perlengkapan_item_id` (`perlengkapan_item_id`),
  CONSTRAINT `perlengkapan_pesanan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE,
  CONSTRAINT `perlengkapan_pesanan_ibfk_2` FOREIGN KEY (`perlengkapan_item_id`) REFERENCES `perlengkapan_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perlengkapan_pesanan`
--

LOCK TABLES `perlengkapan_pesanan` WRITE;
/*!40000 ALTER TABLE `perlengkapan_pesanan` DISABLE KEYS */;
INSERT INTO `perlengkapan_pesanan` VALUES (1,5,1,1,'2026-02-02 17:41:18','2026-02-03 00:03:42'),(2,5,2,1,'2026-02-02 17:41:24','2026-02-03 00:03:45'),(3,11,1,0,'2026-02-02 17:41:31','2026-02-02 23:27:34'),(4,2,2,0,'2026-02-02 17:57:31','2026-02-02 23:27:29'),(5,2,1,1,'2026-02-02 17:57:34','2026-02-03 14:24:25'),(6,1,2,1,'2026-02-03 00:22:24','2026-02-03 00:22:24');
/*!40000 ALTER TABLE `perlengkapan_pesanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi_pemasukan`
--

DROP TABLE IF EXISTS `transaksi_pemasukan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi_pemasukan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice` varchar(50) NOT NULL,
  `pendaftaran_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int NOT NULL,
  `jenis_pembayaran` varchar(100) NOT NULL COMMENT 'Pendaftaran/Daftar Ulang/Perlengkapan/dll',
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice` (`invoice`),
  KEY `idx_pemasukan_pendaftaran` (`pendaftaran_id`),
  KEY `idx_pemasukan_tanggal` (`tanggal`),
  CONSTRAINT `transaksi_pemasukan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi_pemasukan`
--

LOCK TABLES `transaksi_pemasukan` WRITE;
/*!40000 ALTER TABLE `transaksi_pemasukan` DISABLE KEYS */;
INSERT INTO `transaksi_pemasukan` VALUES (2,'INV-IN-20260202-8441',2,'2026-02-02',1000000,'Transfer','tes','2026-02-02 18:17:36'),(4,'INV-IN-20260202-9821',1,'2026-02-02',150000,'Transfer','','2026-02-02 18:30:14'),(5,'INV-IN-20260202-4070',9,'2026-02-02',500000,'Cash','','2026-02-02 23:33:58'),(6,'INV-IN-20260203-0231',5,'2026-02-03',3400000,'Cash','','2026-02-03 00:04:00'),(7,'INV-IN-20260203-4485',1,'2026-02-03',1000000,'Cash','','2026-02-03 00:22:59'),(8,'INV-IN-20260203-4556',4,'2026-02-03',2000000,'Cash','','2026-02-03 03:21:39');
/*!40000 ALTER TABLE `transaksi_pemasukan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi_pengeluaran`
--

DROP TABLE IF EXISTS `transaksi_pengeluaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi_pengeluaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int NOT NULL,
  `kategori` varchar(100) NOT NULL COMMENT 'Sesuai item dari tabel biaya',
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice` (`invoice`),
  KEY `idx_pengeluaran_tanggal` (`tanggal`),
  KEY `idx_pengeluaran_kategori` (`kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi_pengeluaran`
--

LOCK TABLES `transaksi_pengeluaran` WRITE;
/*!40000 ALTER TABLE `transaksi_pengeluaran` DISABLE KEYS */;
INSERT INTO `transaksi_pengeluaran` VALUES (1,'INV-OUT-20260202-2140','2026-02-02',100000,'Seragam Bawahan','Tes','2026-02-02 18:11:39');
/*!40000 ALTER TABLE `transaksi_pengeluaran` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-18 11:13:33
