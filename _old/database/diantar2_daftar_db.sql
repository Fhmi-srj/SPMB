-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 27, 2026 at 05:04 AM
-- Server version: 10.5.29-MariaDB
-- PHP Version: 8.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diantar2_daftar_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `admin_id`, `action`, `description`, `ip_address`, `created_at`) VALUES
(1, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-20 16:04:22'),
(2, 1, 'PASSWORD_CHANGE', 'Mengubah password admin', '::1', '2025-12-20 16:04:52'),
(3, 1, 'PROFILE_UPDATE', 'Mengubah profil admin', '::1', '2025-12-20 16:05:03'),
(4, 1, 'LOGIN', 'Login berhasil', '::1', '2025-12-20 17:52:08'),
(5, 1, 'UPDATE', 'Mengupdate data pendaftaran: Rerum rem eu lorem m', '::1', '2025-12-20 18:01:01'),
(6, 1, 'UPDATE', 'Mengupdate data pendaftaran: Rerum rem eu lorem m', '::1', '2025-12-20 18:02:07'),
(7, 1, 'DELETE', 'Menghapus pendaftaran: Ut et excepteur quia', '::1', '2025-12-20 18:02:31'),
(8, 1, 'DELETE', 'Menghapus pendaftaran: Rerum rem eu lorem m', '::1', '2025-12-20 18:49:45'),
(9, 1, 'LOGIN', 'Login berhasil', '103.47.133.117', '2025-12-22 04:59:30'),
(10, 1, 'DELETE', 'Menghapus pendaftaran: Fahmi', '103.47.133.151', '2025-12-22 06:32:21'),
(11, 1, 'LOGIN', 'Login berhasil', '36.68.53.171', '2025-12-22 06:38:36'),
(12, 1, 'LOGIN', 'Login berhasil', '103.47.133.123', '2025-12-22 06:55:31'),
(13, 1, 'PROFILE_UPDATE', 'Mengubah profil admin', '103.47.133.123', '2025-12-22 06:55:52'),
(14, 1, 'PASSWORD_CHANGE', 'Mengubah password admin', '103.47.133.123', '2025-12-22 06:56:19'),
(15, 1, 'LOGIN', 'Login berhasil', '103.47.133.76', '2025-12-22 06:59:08'),
(16, 1, 'LOGIN', 'Login berhasil', '36.68.53.171', '2025-12-22 07:00:33'),
(17, 1, 'LOGIN', 'Login berhasil', '103.47.133.76', '2025-12-22 07:02:02'),
(18, 1, 'UPDATE', 'Mengupdate data pendaftaran: Fahmi Muhammad Sirojul Munir', '103.47.133.76', '2025-12-22 07:02:12'),
(19, 1, 'DELETE', 'Menghapus pendaftaran: Fahmi Muhammad Sirojul Munir', '103.47.133.76', '2025-12-22 07:02:42'),
(20, 1, 'LOGIN', 'Login berhasil', '103.47.133.101', '2025-12-22 07:06:00'),
(21, 1, 'LOGIN', 'Login berhasil', '103.47.133.183', '2025-12-22 09:30:41'),
(22, 1, 'DELETE', 'Menghapus pendaftaran: Fahmi Muhammad Sirojul Munir', '103.47.133.183', '2025-12-22 09:31:04'),
(23, 1, 'LOGIN', 'Login berhasil', '103.47.133.118', '2025-12-22 22:10:03'),
(24, 1, 'UPDATE', 'Mengupdate data pendaftaran: SOFA HILDA AYU MAULIDA', '103.47.133.175', '2025-12-22 22:11:01'),
(25, 1, 'LOGIN', 'Login berhasil', '182.2.78.157', '2025-12-23 05:52:46'),
(26, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 07:14:21'),
(27, 1, 'LOGIN', 'Login berhasil', '103.47.133.167', '2025-12-23 08:23:00'),
(28, 1, 'DELETE', 'Menghapus pendaftaran: Amet consequat Eni', '103.47.133.180', '2025-12-23 08:35:09'),
(29, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 09:18:47'),
(30, 1, 'LOGIN', 'Login berhasil', '182.2.85.170', '2025-12-23 10:43:12'),
(31, 1, 'LOGIN', 'Login berhasil', '103.47.133.160', '2025-12-23 11:14:56'),
(32, 1, 'DELETE', 'Menghapus pendaftaran: Laboris sed tempora', '103.47.133.160', '2025-12-23 11:15:22'),
(33, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 12:20:42'),
(34, 1, 'EXPORT', 'Export data pendaftaran ke Excel', '36.68.54.220', '2025-12-23 12:20:49'),
(35, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 12:45:49'),
(36, 1, 'LOGIN', 'Login berhasil', '103.47.133.127', '2025-12-23 13:52:19'),
(37, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 13:57:24'),
(38, 1, 'LOGIN', 'Login berhasil', '182.4.100.232', '2025-12-23 14:07:57'),
(39, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 14:11:13'),
(40, 1, 'LOGIN', 'Login berhasil', '182.4.100.232', '2025-12-23 14:14:08'),
(41, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-23 14:15:32'),
(42, 1, 'LOGIN', 'Login berhasil', '103.47.133.105', '2025-12-23 14:30:29'),
(43, 1, 'LOGIN', 'Login berhasil', '103.47.133.168', '2025-12-23 18:42:49'),
(44, 1, 'LOGIN', 'Login berhasil', '103.47.133.136', '2025-12-24 03:59:38'),
(45, 1, 'LOGIN', 'Login berhasil', '103.47.133.77', '2025-12-24 04:20:09'),
(46, 1, 'LOGIN', 'Login berhasil', '103.47.133.126', '2025-12-24 07:12:34'),
(47, 1, 'LOGIN', 'Login berhasil', '182.2.50.28', '2025-12-24 07:47:02'),
(48, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-25 02:22:51'),
(49, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-25 09:41:12'),
(50, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-25 13:12:00'),
(51, 1, 'LOGIN', 'Login berhasil', '103.47.133.97', '2025-12-25 18:11:56'),
(52, 1, 'LOGIN', 'Login berhasil', '103.47.133.130', '2025-12-25 18:21:30'),
(53, 1, 'WA_BERKAS', 'Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR', '103.47.133.189', '2025-12-25 18:22:43'),
(54, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-26 02:04:42'),
(55, 1, 'EXPORT', 'Export data pendaftaran ke Excel', '36.68.54.220', '2025-12-26 02:04:46'),
(56, 1, 'WA_BERKAS', 'Kirim notifikasi kekurangan berkas ke: FAHMI MUHAMMAD SIROJUL MUNIR', '36.68.54.220', '2025-12-26 02:05:25'),
(57, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-26 12:08:05'),
(58, 1, 'LOGIN', 'Login berhasil', '182.2.38.112', '2025-12-27 03:25:33'),
(59, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-29 13:50:05'),
(60, 1, 'DELETE', 'Menghapus pendaftaran: FAHMI MUHAMMAD SIROJUL MUNIR', '36.68.54.220', '2025-12-29 13:50:12'),
(61, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 10:10:29'),
(62, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 11:54:12'),
(63, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 12:41:36'),
(64, 1, 'LOGIN', 'Login berhasil', '36.68.54.220', '2025-12-30 14:54:01'),
(65, 1, 'LOGIN', 'Login berhasil', '182.2.74.146', '2025-12-31 06:11:15'),
(66, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-01 07:10:54'),
(67, 1, 'LOGIN', 'Login berhasil', '182.2.77.150', '2026-01-01 11:54:41'),
(68, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-01 14:49:33'),
(69, 1, 'LOGIN', 'Login berhasil', '182.2.46.175', '2026-01-02 11:08:10'),
(70, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-03 00:29:01'),
(71, 1, 'LOGIN', 'Login berhasil', '182.2.85.195', '2026-01-04 04:20:46'),
(72, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-04 11:19:24'),
(73, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-05 02:34:51'),
(74, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-05 06:38:35'),
(75, 1, 'LOGIN', 'Login berhasil', '36.68.53.241', '2026-01-05 11:47:45'),
(76, 1, 'LOGIN', 'Login berhasil', '36.68.55.54', '2026-01-05 23:37:03'),
(77, 1, 'LOGIN', 'Login berhasil', '36.68.55.54', '2026-01-07 06:01:15'),
(78, 1, 'LOGIN', 'Login berhasil', '180.242.147.248', '2026-01-08 20:31:30'),
(79, 1, 'LOGIN', 'Login berhasil', '180.242.147.248', '2026-01-09 05:34:31'),
(80, 1, 'LOGIN', 'Login berhasil', '180.244.223.250', '2026-01-09 12:46:36'),
(81, 1, 'LOGIN', 'Login berhasil', '180.244.223.250', '2026-01-09 12:54:27'),
(82, 1, 'LOGIN', 'Login berhasil', '180.244.223.250', '2026-01-09 12:56:26'),
(83, 1, 'LOGIN', 'Login berhasil', '182.2.46.68', '2026-01-10 04:55:26'),
(84, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 01:10:59'),
(85, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 02:33:54'),
(86, 1, 'UPDATE', 'Mengupdate data pendaftaran: INTAN MUTIA RAMADHANI', '36.68.55.95', '2026-01-11 02:34:15'),
(87, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 06:50:32'),
(88, 1, 'UPDATE', 'Mengupdate data pendaftaran: M. KHAIRUN HAFIZAR', '36.68.55.95', '2026-01-11 06:50:57'),
(89, 1, 'DELETE', 'Menghapus pendaftaran: M. KHAIRUN HAFIZAR', '36.68.55.95', '2026-01-11 06:51:44'),
(90, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 09:34:00'),
(91, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 16:12:33'),
(92, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-11 22:10:20'),
(93, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-12 14:13:05'),
(94, 1, 'LOGIN', 'Login berhasil', '182.2.43.174', '2026-01-13 03:04:37'),
(95, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-13 03:07:30'),
(96, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-13 03:08:52'),
(97, 1, 'UPDATE', 'Mengupdate data pendaftaran: FATAN FIRMANSYAH', '36.68.55.95', '2026-01-13 03:24:31'),
(98, 1, 'LOGIN', 'Login berhasil', '36.68.55.95', '2026-01-13 05:25:20'),
(99, 1, 'LOGIN', 'Login berhasil', '36.68.53.208', '2026-01-13 13:20:40'),
(100, 1, 'LOGIN', 'Login berhasil', '36.68.53.208', '2026-01-15 00:21:20'),
(101, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-17 05:59:57'),
(102, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-17 06:22:29'),
(103, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-18 01:57:23'),
(104, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-18 01:58:22'),
(105, 1, 'EXPORT', 'Export data pendaftaran ke Excel', '36.68.55.229', '2026-01-18 01:58:28'),
(106, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-19 14:45:14'),
(107, 1, 'LOGIN', 'Login berhasil', '182.2.47.129', '2026-01-20 04:36:46'),
(108, 1, 'LOGIN', 'Login berhasil', '182.2.45.39', '2026-01-20 08:16:45'),
(109, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-20 10:11:37'),
(110, 1, 'LOGIN', 'Login berhasil', '182.2.50.103', '2026-01-21 15:53:26'),
(111, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-01-22 22:53:25'),
(112, 1, 'LOGIN', 'Login berhasil', '182.2.40.150', '2026-01-24 03:33:24'),
(113, 1, 'LOGIN', 'Login berhasil', '182.2.40.218', '2026-01-24 05:28:05'),
(114, 1, 'LOGIN', 'Login berhasil', '36.68.53.131', '2026-01-25 12:31:08'),
(115, 1, 'LOGIN', 'Login berhasil', '182.2.50.22', '2026-01-27 16:59:06'),
(116, 1, 'LOGIN', 'Login berhasil', '103.132.52.190', '2026-01-28 04:10:26'),
(117, 1, 'LOGIN', 'Login berhasil', '118.96.70.104', '2026-01-29 17:34:24'),
(118, 1, 'LOGIN', 'Login berhasil', '36.68.52.160', '2026-02-02 11:11:54'),
(119, 1, 'LOGIN', 'Login berhasil', '36.68.55.224', '2026-02-03 03:37:10'),
(120, 1, 'LOGIN', 'Login berhasil', '36.68.55.128', '2026-02-03 15:14:57'),
(121, 1, 'LOGIN', 'Login berhasil', '182.2.74.35', '2026-02-03 16:34:01'),
(122, 1, 'LOGIN', 'Login berhasil', '36.68.55.128', '2026-02-04 11:55:17'),
(123, 1, 'LOGIN', 'Login berhasil', '146.70.14.28', '2026-02-04 11:57:32'),
(124, 1, 'LOGIN', 'Login berhasil', '182.2.40.144', '2026-02-04 11:59:13'),
(125, 1, 'LOGIN', 'Login berhasil', '36.68.55.128', '2026-02-04 14:05:41'),
(126, 1, 'LOGIN', 'Login berhasil', '182.2.72.216', '2026-02-05 06:21:54'),
(127, 1, 'LOGIN', 'Login berhasil', '36.68.55.229', '2026-02-08 15:56:55'),
(128, 1, 'LOGIN', 'Login berhasil', '36.68.55.149', '2026-02-09 15:37:02'),
(129, 1, 'LOGIN', 'Login berhasil', '182.2.36.227', '2026-02-10 07:34:06'),
(130, 1, 'LOGIN', 'Login berhasil', '36.68.55.149', '2026-02-12 15:19:01'),
(131, 1, 'LOGIN', 'Login berhasil', '36.68.53.50', '2026-02-12 16:14:40'),
(132, 1, 'LOGIN', 'Login berhasil', '36.78.40.48', '2026-02-18 04:10:13'),
(133, 1, 'LOGIN', 'Login berhasil', '182.253.89.112', '2026-02-20 16:13:44'),
(134, 1, 'LOGIN', 'Login berhasil', '118.96.29.129', '2026-02-21 18:48:02'),
(135, 1, 'LOGIN', 'Login berhasil', '36.68.52.105', '2026-02-24 18:40:28'),
(136, 1, 'LOGIN', 'Login berhasil', '36.68.52.105', '2026-02-25 14:52:02'),
(137, 1, 'LOGIN', 'Login berhasil', '180.242.146.100', '2026-02-25 19:05:51');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `role` enum('super_admin','admin','panitia') NOT NULL DEFAULT 'panitia',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `nama`, `role`, `created_at`) VALUES
(1, 'admin_spmb', '$2y$10$qAy5E2/jP4XA0XnUELjoReRTYXGEP19xz1086ut0ypwVIbtJaJ5KG', 'Admin SPMB', 'super_admin', '2025-12-20 15:36:31');

-- --------------------------------------------------------

--
-- Table structure for table `beasiswa`
--

CREATE TABLE `beasiswa` (
  `id` int(11) NOT NULL,
  `jenis` varchar(100) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `syarat` varchar(200) NOT NULL,
  `benefit` varchar(100) NOT NULL,
  `urutan` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `beasiswa`
--

INSERT INTO `beasiswa` (`id`, `jenis`, `kategori`, `syarat`, `benefit`, `urutan`) VALUES
(1, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 1-5 Juz', 'Gratis SPP 1 Bulan', 1),
(2, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 6-10 Juz', 'Gratis SPP 2 Bulan', 2),
(3, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 11-20 Juz', 'Gratis SPP 3 Bulan', 3),
(4, 'Tahfidz', 'Penghafal Al-Quran', 'Hafal 21-30 Juz', 'Gratis SPP 6 Bulan', 4),
(5, 'Akademik', 'Berdasarkan Nilai Rapor', 'Nilai 90-100', 'Gratis SPP 3 Bulan', 5),
(6, 'Akademik', 'Berdasarkan Nilai Rapor', 'Nilai 80-89', 'Gratis SPP 2 Bulan', 6),
(7, 'Akademik', 'Berdasarkan Nilai Rapor', 'Nilai 70-79', 'Gratis SPP 1 Bulan', 7),
(8, 'Yatim/Piatu', 'Keringanan', 'Yatim/Piatu', 'Potongan 25% SPP', 8),
(9, 'Yatim/Piatu', 'Keringanan', 'Yatim Piatu', 'Potongan 50% SPP', 9);

-- --------------------------------------------------------

--
-- Table structure for table `biaya`
--

CREATE TABLE `biaya` (
  `id` int(11) NOT NULL,
  `kategori` enum('PENDAFTARAN','DAFTAR_ULANG') NOT NULL,
  `nama_item` varchar(100) NOT NULL,
  `biaya_pondok` int(11) DEFAULT 0,
  `biaya_smp` int(11) DEFAULT 0,
  `biaya_ma` int(11) DEFAULT 0,
  `urutan` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `biaya`
--

INSERT INTO `biaya` (`id`, `kategori`, `nama_item`, `biaya_pondok`, `biaya_smp`, `biaya_ma`, `urutan`) VALUES
(1, 'PENDAFTARAN', 'Registrasi', 50000, 20000, 30000, 1),
(2, 'DAFTAR_ULANG', 'Baju Batik', 0, 65000, 90000, 1),
(3, 'DAFTAR_ULANG', 'Seragam Bawahan', 0, 0, 75000, 2),
(4, 'DAFTAR_ULANG', 'Jas Almamater', 170000, 0, 150000, 3),
(5, 'DAFTAR_ULANG', 'Kaos Olahraga', 0, 90000, 100000, 4),
(6, 'DAFTAR_ULANG', 'Badge Almamater', 0, 35000, 40000, 5),
(7, 'DAFTAR_ULANG', 'Buku Raport', 40000, 40000, 35000, 6),
(8, 'DAFTAR_ULANG', 'Infaq Bulan Pertama', 600000, 50000, 100000, 7),
(9, 'DAFTAR_ULANG', 'Kegiatan & Hari Besar', 150000, 50000, 380000, 8),
(10, 'DAFTAR_ULANG', 'Kitab/Buku Pelajaran', 100000, 0, 350000, 9),
(11, 'DAFTAR_ULANG', 'Perbaikan Asrama', 500000, 0, 0, 10),
(12, 'DAFTAR_ULANG', 'Kartu Santri', 40000, 0, 0, 11),
(13, 'DAFTAR_ULANG', 'Kebersihan', 150000, 0, 0, 12),
(14, 'DAFTAR_ULANG', 'Kalender', 50000, 0, 0, 13);

-- --------------------------------------------------------

--
-- Table structure for table `kontak`
--

CREATE TABLE `kontak` (
  `id` int(11) NOT NULL,
  `lembaga` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `no_whatsapp` varchar(20) NOT NULL,
  `link_wa` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `kontak`
--

INSERT INTO `kontak` (`id`, `lembaga`, `nama`, `no_whatsapp`, `link_wa`) VALUES
(1, 'SMP', 'Ust. Rino Mukti', '08123456789', 'http://wa.link/7svsg0'),
(2, 'MA', 'Ust. Akrom Adabi', '0856 4164 7478', 'https://wa.link/ire9yv'),
(3, 'PONPES', 'Ust. M. Kowi', '08123456790', 'https://wa.link/20sq3q');

-- --------------------------------------------------------

--
-- Table structure for table `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT 'Admin',
  `aksi` varchar(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE',
  `modul` varchar(50) NOT NULL COMMENT 'PEMASUKAN, PENGELUARAN',
  `detail` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `log_aktivitas`
--

INSERT INTO `log_aktivitas` (`id`, `user_id`, `user_name`, `aksi`, `modul`, `detail`, `created_at`) VALUES
(1, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan NABILA SALSABILA - Rp2.200.000', '2026-02-04 11:55:47'),
(2, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan LABIBAH ZAKIYYA - Rp2.200.000', '2026-02-04 11:57:40'),
(3, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan LABIBAH ZAKIYYA - Rp50', '2026-02-04 11:58:07'),
(4, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan LABIBAH ZAKIYYA - Rp0', '2026-02-04 11:58:15'),
(5, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan LABIBAH ZAKIYYA - Rp0', '2026-02-04 11:58:29'),
(6, NULL, 'Admin', 'UPDATE', 'PEMASUKAN', 'Edit pemasukan LABIBAH ZAKIYYA - Rp50.000', '2026-02-04 11:58:35'),
(7, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan FAATIKHUL KHAN - Rp70.000', '2026-02-04 11:59:42');

-- --------------------------------------------------------

--
-- Table structure for table `pendaftaran`
--

CREATE TABLE `pendaftaran` (
  `id` int(11) NOT NULL,
  `no_registrasi` varchar(10) DEFAULT NULL,
  `nama` varchar(100) NOT NULL,
  `lembaga` enum('SMP NU BP','MA ALHIKAM') NOT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `tempat_lahir` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `jumlah_saudara` int(11) DEFAULT 0,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `pendaftaran`
--

INSERT INTO `pendaftaran` (`id`, `no_registrasi`, `nama`, `lembaga`, `nisn`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `jumlah_saudara`, `no_kk`, `nik`, `alamat`, `provinsi`, `kota_kab`, `kecamatan`, `kelurahan_desa`, `asal_sekolah`, `prestasi`, `tingkat_prestasi`, `juara`, `file_sertifikat`, `pip_pkh`, `status_mukim`, `sumber_info`, `nama_ayah`, `tempat_lahir_ayah`, `tanggal_lahir_ayah`, `nik_ayah`, `pekerjaan_ayah`, `penghasilan_ayah`, `nama_ibu`, `tempat_lahir_ibu`, `tanggal_lahir_ibu`, `nik_ibu`, `pekerjaan_ibu`, `penghasilan_ibu`, `no_hp_wali`, `password`, `file_kk`, `file_ktp_ortu`, `file_akta`, `file_ijazah`, `status`, `catatan_admin`, `catatan_updated_at`, `created_at`, `reset_token`, `reset_token_expires`) VALUES
(1, '001.1225', 'SOFA HILDA AYU MAULIDA', 'SMP NU BP', '0142465055', 'PEKALONGAN', '2014-05-11', 'P', 1, '3326181712080002', '3375035105140002', 'DUSUN PANGKAH, RT. 003/RW. 002', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KARANGDADAP', 'PANGKAH', 'SD MUHAMMADIYAH PANGKAH', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'KELUARGA', 'WARTO', 'PEKALONGAN', '1962-12-12', '3326181212620004', 'BURUH HARIAN LEPAS', '< 1 JUTA', 'UMI FADHILAH', 'PEKALONGAN', '1975-10-18', '3326185810750001', 'KARYAWAN SWASTA', '1-3 JUTA', '+6288216683867', '$2y$10$TErhJGT7yX8EPbKK..JVP.EEOFczMCI7hFAqIvMHn4GqDtgKjBNWS', '', '', '', '', 'pending', NULL, NULL, '2025-12-22 13:48:38', NULL, NULL),
(2, '002.1225', 'FATAN FIRMANSYAH', 'SMP NU BP', '', 'PEKALONGAN', '2013-01-11', 'L', 0, '3326131812120006', '3326131101130004', 'RT/RW 001/001', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'TANGKIL TENGAH', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'NUR AMINAH', 'PEKALONGAN', '1989-12-01', '33261358108900021', 'BURUH', '', 'NUR AMINAH', 'PEKALONGAN', '1989-12-01', '33261358108900021', 'BURUH', '', '+6285956403558', '$2y$10$e2xaWLOjroyQfwTTPEiMPeyGNa/LeSdlGib3OB9ZTZSjuUL62DTAG', '57_file_kk_1766473602.pdf', 'cuman tes', '', '', 'pending', '', '2026-01-13 03:24:31', '2025-12-23 07:03:11', NULL, NULL),
(4, '003.1225', 'INTAN MUTIA RAMADHANI', 'SMP NU BP', '0141584683', 'PEKALONGAN', '2014-07-21', 'P', 0, '3326141709140001', '3326146107140002', 'Bligo kec buaran RT 16 RW 05 no rumah 34', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'BLIGO', 'SD BLIGO', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'AGUS IMADUDDIN', 'PEKALONGAN', '1975-09-02', '', '', '', '', '', '0000-00-00', '', '', '', '+6285655896428', '$2y$10$ColX8hl0xDf4y8R7MjyDjutQUEj8EQkviZKpaB1DBYw.7wfGWqCMy', '', '', '', '', 'pending', '', '2026-01-11 02:34:15', '2025-12-30 10:14:59', NULL, NULL),
(5, '004.0126', 'FAATIKHUL KHAN', 'SMP NU BP', '', 'PEKALONGAN', '2014-04-08', 'L', 2, '3326140711130002', '3326140804140001', 'RT/RW 05/03 NO 52 KODE POS 51171', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'BLIGO', 'MIS BLIGO', '', NULL, NULL, '', '3690-01-007195-50-7', 'PONDOK PP MAMBAUL HUDA', 'ALUMNI', 'JOKO SETIAWAN', 'KENDAL', '1983-12-28', '3324122812830005', 'BURUH', '< 1 JUTA', 'FATIMAH', 'PEKALONGAN', '1993-06-21', '3326146106930001', 'IBU RUMAH TANGGA', '< 1 JUTA', '+6285335180100', '$2y$10$s9UhI63xP8ZDNEINE.7ED.St7U0xGmD6gd9leHGskag1KaLzfTvfa', 'file_kk_1767256354_69563122217b2.jpg', 'file_ktp_ortu_1767256354_69563122229ad.jpg', 'file_akta_1767256354_6956312223335.jpg', '', 'pending', NULL, NULL, '2026-01-01 08:32:34', NULL, NULL),
(6, '005.0126', 'MUHAMMAD SALMAN ARROYAN', 'SMP NU BP', '', 'Pekalongan', '0000-00-00', 'L', 0, '3326192406200018', '3375011807130002', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'WONOKERTO', 'WONOKERTO WETAN', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'ACHMAD SUBARI MUGIYONO', '', '0000-00-00', '', '', '', 'TRIYANA', '', '0000-00-00', '', '', '', '+6288233453695', '$2y$10$yYTVNOYfuMP6K3PhFeFjJe/L7DZkSli.wRJSTc97bHeVXXllCMTZq', 'file_kk_1767962644_6960f81449194.jpeg', '', 'file_akta_1767962644_6960f8144a24d.jpeg', '', 'pending', NULL, NULL, '2026-01-09 12:44:04', NULL, NULL),
(7, '006.0126', 'ULUL ILMI', 'SMP NU BP', '', 'PEKALONGAN', '0000-00-00', 'L', 0, '', '', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'TIRTO', 'NGALIAN', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'NUR ALIM', '', '0000-00-00', '', '', '', 'NUR FADILLAH', '', '0000-00-00', '', '', '', '+6285742687970', '$2y$10$ZSZUO89fc73oC59omdwXZeY4URuVXhN8xME762WFzafJuYdSrALQe', '', '', '', '', 'pending', NULL, NULL, '2026-01-09 12:53:27', NULL, NULL),
(9, '007.0126', 'M. KHAIRUN HAFIZAR', 'SMP NU BP', '', '', '0000-00-00', 'L', 0, '', '', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'AMBOKEMBANG', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'M. YUSUF KHAMBALI', '', '0000-00-00', '', '', '', 'KHOLIPAH', '', '0000-00-00', '', '', '', '+6285802767044', '$2y$10$EXq/Cgp9Dfnnnphq.XkmieccUuookuABeRVQqbrf93uTKchFDIzYu', '', '', '', '', 'pending', NULL, NULL, '2026-01-11 06:53:01', NULL, NULL),
(10, '008.0126', 'NABILA SALSABILA', 'SMP NU BP', '', 'PEKALONGAN', '0000-00-00', 'L', 0, '3326131710170001', '', 'RT/RW 002/004 KEDUNGUWUNI TIMUR', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'KEDUNGWUNI TIMUR', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'UMAR KHAMDAN', 'PEKALONGAN', '1980-07-23', '3375032307800004', 'BURUH HARIAN LEPAS', '1-3 JUTA', 'JAZILAH', 'PEKALONGAN', '1984-12-08', '3326134812840002', 'MENGURUS RUMAH TANGGA', '< 1 JUTA', '+628156553930', '$2y$10$fFA7awncfP6OLTlxlpHLF.8.gSXJnvROAkMYuovk63y8yacmA9Bze', '', '', '', '', 'pending', NULL, NULL, '2026-01-19 01:56:36', NULL, NULL),
(11, '009.0126', 'LABIBAH ZAKIYYA', 'SMP NU BP', '00000000000000', 'PEMALANG', '2014-05-31', 'P', 1, '3327100408140015', '3327107105140001', 'DESA KENDALREJO DUSUN KEDUNG UTER PETARUKAN', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'PETARUKAN', 'KENDALREJO', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'MUHAMMAD TIMBUL PRAYITNO', 'PEMALANG', '1992-09-10', '3327101009920046', 'WIRASWASTA', '3-5 JUTA', 'KHAERUNISA', 'PEMALANG', '1991-07-15', '3327105507910027', 'MENGURUS RUMAH TANGGA', '< 1 JUTA', '+6285225052902', '$2y$10$pt/zK3jgmYbpNr8qvTK4L.MIRV3oJPQHzzxXL4PWVCQ3KH5rPLElK', '', '', '', '', 'pending', NULL, NULL, '2026-01-19 02:09:47', NULL, NULL),
(12, '010.0226', 'SOFA HILDA AYU MAULIDA', 'SMP NU BP', '000000000', 'PEKALONGAN', '2014-03-11', 'P', 2, '3326181712080002', '3375035105140002', 'PANGKAH KARANGDADAP', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KARANGDADAP', 'PANGKAH', 'SDN PANGKAH', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'BROSUR', 'WARTO', 'PEKALONGAN', '1962-12-12', '3326181212620004', 'BURUH', '1-3 JUTA', 'UMI FADHILAH', 'PEKALONGAN', '1975-10-18', '3326185810750001', 'KARYAWAN SWASTA', '1-3 JUTA', '+628000000000000', '$2y$10$ALSr1q3ncXq9xf.y3xiILOTJRsrdE0UMqC1XHGRskdsj5CQ01W0L.', '', '', '', '', 'pending', NULL, NULL, '2026-02-09 00:09:00', NULL, NULL),
(13, '011.0226', 'EKA WAHYU LUKMANA', 'SMP NU BP', '000000000', 'PEKALONGAN', '2013-08-18', 'P', 1, '3326130502180012', '3326125808130001', 'DK MADUKARAN KEDUNGWUNI BARAT PEKALONGAN', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'KEDUNGWUNI BARAT', 'MI YMI 02 SURABAYAN', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'SOSIAL MEDIA', 'LUKMAN HAKIM', 'PEKALONGAN', '1980-07-04', '3326130407800041', 'BURUH', '1-3 JUTA', 'KHOIRIYATUL AMANAH', 'PEKALONGAN', '1987-12-27', '3326126712870001', 'MENGURUS RUMAH TANGGA', '', '+6285641164826', '$2y$10$622sVT.9ay48Rxn4z7LpiOEyG/I5FTEaAKXVLMrEr6jxG1J26Glni', '', '', '', '', 'pending', NULL, NULL, '2026-02-09 00:46:37', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan`
--

CREATE TABLE `pengaturan` (
  `id` int(11) NOT NULL,
  `kunci` varchar(50) NOT NULL,
  `nilai` text DEFAULT NULL,
  `keterangan` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `pengaturan`
--

INSERT INTO `pengaturan` (`id`, `kunci`, `nilai`, `keterangan`) VALUES
(1, 'status_pendaftaran', '1', 'Status pendaftaran: 1=Buka, 0=Tutup'),
(2, 'tahun_ajaran', '2026/2027', 'Tahun ajaran aktif'),
(3, 'link_pdf_biaya', 'https://s.id/biayapendaftaran', 'Link download PDF biaya'),
(4, 'link_pdf_brosur', 'https://s.id/brosur_2526', 'Link download PDF brosur'),
(5, 'link_pdf_syarat', 'https://drive.google.com/file/d/1vbwof-2w_v2wzvosNYTzyE74EJqR0cEQ/view?usp=sharing', 'Link download PDF syarat'),
(6, 'link_beasiswa', 'https://s.id/BeasiswaMAHAKAM', 'Link info beasiswa lengkap'),
(7, 'gelombang_1_start', '2026-01-01', 'Tanggal mulai gelombang 1'),
(8, 'gelombang_1_end', '2026-03-31', 'Tanggal selesai gelombang 1'),
(9, 'gelombang_2_start', '2026-04-01', 'Tanggal mulai gelombang 2'),
(10, 'gelombang_2_end', '2026-06-30', 'Tanggal selesai gelombang 2'),
(11, 'link_grup_wa', 'https://chat.whatsapp.com/L4X6uCkZlAf0vwmhJgaJV2', 'Link grup WhatsApp untuk pendaftar baru');

-- --------------------------------------------------------

--
-- Table structure for table `perlengkapan_items`
--

CREATE TABLE `perlengkapan_items` (
  `id` int(11) NOT NULL,
  `nama_item` varchar(100) NOT NULL,
  `nominal` int(11) NOT NULL DEFAULT 0,
  `urutan` int(11) DEFAULT 0,
  `aktif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `perlengkapan_items`
--

INSERT INTO `perlengkapan_items` (`id`, `nama_item`, `nominal`, `urutan`, `aktif`, `created_at`) VALUES
(1, 'Kasur', 110000, 1, 1, '2026-02-04 12:02:51'),
(2, 'Bantal', 40000, 2, 1, '2026-02-04 12:03:06'),
(3, 'Perlak', 50000, 3, 1, '2026-02-04 12:03:21'),
(4, 'Almari Plastik', 400000, 4, 1, '2026-02-04 12:03:41');

-- --------------------------------------------------------

--
-- Table structure for table `perlengkapan_pesanan`
--

CREATE TABLE `perlengkapan_pesanan` (
  `id` int(11) NOT NULL,
  `pendaftaran_id` int(11) NOT NULL,
  `perlengkapan_item_id` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1 COMMENT '1=dipesan, 0=dibatalkan',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `perlengkapan_pesanan`
--

INSERT INTO `perlengkapan_pesanan` (`id`, `pendaftaran_id`, `perlengkapan_item_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 1, 0, '2026-02-04 12:03:50', '2026-02-04 12:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_pemasukan`
--

CREATE TABLE `transaksi_pemasukan` (
  `id` int(11) NOT NULL,
  `invoice` varchar(50) NOT NULL,
  `pendaftaran_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int(11) NOT NULL,
  `jenis_pembayaran` varchar(100) NOT NULL COMMENT 'Pendaftaran/Daftar Ulang/Perlengkapan/dll',
  `keterangan` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaksi_pemasukan`
--

INSERT INTO `transaksi_pemasukan` (`id`, `invoice`, `pendaftaran_id`, `tanggal`, `nominal`, `jenis_pembayaran`, `keterangan`, `status`, `created_at`) VALUES
(1, 'INV-IN-20260204-5177', 10, '2026-02-04', 2200000, 'Cash', '', 'approved', '2026-02-04 11:55:47'),
(2, 'INV-IN-20260204-0015', 11, '2026-02-04', 50000, 'Cash', '', 'approved', '2026-02-04 11:57:40'),
(3, 'INV-IN-20260204-6090', 5, '2026-02-04', 70000, 'Cash', '', 'approved', '2026-02-04 11:59:42');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_pengeluaran`
--

CREATE TABLE `transaksi_pengeluaran` (
  `id` int(11) NOT NULL,
  `invoice` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `nominal` int(11) NOT NULL,
  `kategori` varchar(100) NOT NULL COMMENT 'Sesuai item dari tabel biaya',
  `keterangan` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `admin_id` (`admin_id`) USING BTREE;

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `username` (`username`) USING BTREE;

--
-- Indexes for table `beasiswa`
--
ALTER TABLE `beasiswa`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `biaya`
--
ALTER TABLE `biaya`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `kontak`
--
ALTER TABLE `kontak`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_log_modul` (`modul`),
  ADD KEY `idx_log_aksi` (`aksi`),
  ADD KEY `idx_log_created` (`created_at`);

--
-- Indexes for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `unique_phone` (`no_hp_wali`) USING BTREE,
  ADD KEY `idx_reset_token` (`reset_token`);

--
-- Indexes for table `pengaturan`
--
ALTER TABLE `pengaturan`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `kunci` (`kunci`) USING BTREE;

--
-- Indexes for table `perlengkapan_items`
--
ALTER TABLE `perlengkapan_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perlengkapan_pesanan`
--
ALTER TABLE `perlengkapan_pesanan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pesanan` (`pendaftaran_id`,`perlengkapan_item_id`),
  ADD KEY `perlengkapan_item_id` (`perlengkapan_item_id`);

--
-- Indexes for table `transaksi_pemasukan`
--
ALTER TABLE `transaksi_pemasukan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice` (`invoice`),
  ADD KEY `idx_pemasukan_pendaftaran` (`pendaftaran_id`),
  ADD KEY `idx_pemasukan_tanggal` (`tanggal`);

--
-- Indexes for table `transaksi_pengeluaran`
--
ALTER TABLE `transaksi_pengeluaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice` (`invoice`),
  ADD KEY `idx_pengeluaran_tanggal` (`tanggal`),
  ADD KEY `idx_pengeluaran_kategori` (`kategori`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `beasiswa`
--
ALTER TABLE `beasiswa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `biaya`
--
ALTER TABLE `biaya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `kontak`
--
ALTER TABLE `kontak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `pengaturan`
--
ALTER TABLE `pengaturan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `perlengkapan_items`
--
ALTER TABLE `perlengkapan_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `perlengkapan_pesanan`
--
ALTER TABLE `perlengkapan_pesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaksi_pemasukan`
--
ALTER TABLE `transaksi_pemasukan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transaksi_pengeluaran`
--
ALTER TABLE `transaksi_pengeluaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `perlengkapan_pesanan`
--
ALTER TABLE `perlengkapan_pesanan`
  ADD CONSTRAINT `perlengkapan_pesanan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `perlengkapan_pesanan_ibfk_2` FOREIGN KEY (`perlengkapan_item_id`) REFERENCES `perlengkapan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaksi_pemasukan`
--
ALTER TABLE `transaksi_pemasukan`
  ADD CONSTRAINT `transaksi_pemasukan_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
