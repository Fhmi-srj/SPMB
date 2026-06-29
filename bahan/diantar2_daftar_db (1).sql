-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 01, 2026 at 02:14 PM
-- Server version: 11.4.12-MariaDB
-- PHP Version: 8.4.21

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

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
(137, 1, 'LOGIN', 'Login berhasil', '180.242.146.100', '2026-02-25 19:05:51'),
(138, 1, 'LOGIN', 'Login berhasil', '::1', '2026-02-26 22:05:43'),
(139, 1, 'LOGIN', 'Login berhasil', '118.96.26.70', '2026-02-26 22:23:32'),
(140, NULL, 'LOGIN', 'Login berhasil', '118.96.26.70', '2026-02-27 00:52:03'),
(141, NULL, 'LOGIN', 'Login berhasil', '182.2.70.240', '2026-03-12 11:35:01'),
(142, NULL, 'LOGIN', 'Login berhasil', '118.96.30.83', '2026-03-14 20:41:48'),
(143, NULL, 'LOGIN', 'Login berhasil', '118.96.30.83', '2026-03-14 21:06:10'),
(144, NULL, 'LOGIN', 'Login berhasil', '118.96.30.83', '2026-03-14 21:30:14'),
(145, NULL, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-04-05 09:29:33'),
(146, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-05 10:31:13'),
(147, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-05 14:33:52'),
(148, NULL, 'LOGIN', 'Login berhasil', '182.2.45.241', '2026-04-05 14:34:37'),
(149, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-06 06:21:42'),
(150, NULL, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-04-06 06:23:04'),
(151, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-06 06:57:40'),
(152, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-06 13:25:27'),
(153, NULL, 'LOGIN', 'Login berhasil', '103.51.206.94', '2026-04-07 02:30:23'),
(154, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-08 09:03:02'),
(155, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-08 18:37:59'),
(156, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-09 13:41:25'),
(157, NULL, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-10 10:02:36'),
(158, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-04-10 04:29:39'),
(159, 1, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-10 06:24:40'),
(160, 1, 'LOGIN', 'Login berhasil', '36.68.52.163', '2026-04-10 07:56:08'),
(161, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-04-10 08:01:05'),
(162, 1, 'LOGIN', 'Login berhasil', '36.68.52.202', '2026-04-10 08:12:20'),
(163, 1, 'LOGIN', 'Login berhasil', '182.2.50.116', '2026-04-17 00:41:20'),
(164, 1, 'LOGIN', 'Login berhasil', '36.68.54.233', '2026-04-17 17:09:24'),
(165, 3, 'LOGIN', 'Login berhasil', '36.68.54.233', '2026-04-17 17:22:42'),
(166, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-04-17 22:40:13'),
(167, 1, 'LOGIN', 'Login berhasil', '36.68.54.233', '2026-04-17 22:51:34'),
(168, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-04-17 22:44:27'),
(169, 1, 'DELETE', 'Menghapus pendaftaran: Non omnis magnam nos', '127.0.0.1', '2026-04-17 23:21:15'),
(170, 1, 'LOGIN', 'Login berhasil', '103.175.49.134', '2026-04-22 09:33:44'),
(171, 1, 'LOGIN', 'Login berhasil', '103.175.49.134', '2026-04-22 12:00:37'),
(172, 1, 'LOGIN', 'Login berhasil', '36.68.53.185', '2026-05-01 01:26:41'),
(173, 3, 'LOGIN', 'Login berhasil', '36.68.53.185', '2026-05-01 01:27:27'),
(174, 1, 'LOGIN', 'Login berhasil', '36.68.53.185', '2026-05-01 01:28:38'),
(175, 1, 'DELETE', '[PEMASUKAN] Hapus pemasukan FAATIKHUL KHAN - Rp70.000', '36.68.53.185', '2026-05-01 01:28:45'),
(176, 1, 'DELETE', '[PEMASUKAN] Hapus pemasukan NABILA SALSABILA - Rp2.200.000', '36.68.53.185', '2026-05-01 01:28:50'),
(177, 1, 'DELETE', '[PEMASUKAN] Hapus pemasukan LABIBAH ZAKIYYA - Rp50.000', '36.68.53.185', '2026-05-01 01:28:55'),
(178, 3, 'LOGIN', 'Login berhasil', '36.68.53.185', '2026-05-01 01:29:07'),
(179, 3, 'CREATE', '[PEMASUKAN] Tambah pemasukan NABILA SALSABILA - Rp50.000', '36.68.53.185', '2026-05-01 01:30:12'),
(180, 3, 'CREATE', '[PEMASUKAN] Tambah pemasukan LABIBAH ZAKIYYA - Rp2.200.000', '36.68.53.185', '2026-05-01 01:30:42'),
(181, 1, 'LOGIN', 'Login berhasil', '36.68.53.185', '2026-05-01 01:31:08'),
(182, 1, 'LOGIN', 'Login berhasil', '36.78.34.209', '2026-05-05 01:11:30'),
(183, 5, 'LOGIN', 'Login berhasil', '121.101.130.145', '2026-05-05 01:34:48'),
(184, 1, 'LOGIN', 'Login berhasil', '36.68.52.229', '2026-05-19 06:30:59'),
(185, 1, 'CREATE', '[PEMASUKAN] Tambah pemasukan Fakhrie zafran khairy - Rp50.000', '36.68.52.229', '2026-05-19 06:45:40'),
(186, 1, 'DELETE', '[PEMASUKAN] Hapus pemasukan LABIBAH ZAKIYYA - Rp2.200.000', '36.68.52.229', '2026-05-19 06:46:13'),
(187, 5, 'LOGIN', 'Login berhasil', '36.65.96.207', '2026-05-19 20:12:59'),
(188, 5, 'LOGIN', 'Login berhasil', '36.65.100.81', '2026-05-20 20:19:29'),
(189, 1, 'LOGIN', 'Login berhasil', '182.2.79.221', '2026-05-22 00:31:01'),
(190, 1, 'LOGIN', 'Login berhasil', '110.138.100.216', '2026-05-24 04:52:11'),
(191, 1, 'CREATE', '[PEMASUKAN] Tambah pemasukan Fahmi - Rp200.000', '110.138.100.216', '2026-05-24 05:50:20'),
(192, 1, 'DELETE', '[PEMASUKAN] Hapus pemasukan Fahmi - Rp200.000', '110.138.100.216', '2026-05-24 06:27:25'),
(193, 1, 'LOGIN', 'Login berhasil', '110.138.100.216', '2026-05-24 18:02:25'),
(194, 5, 'LOGIN', 'Login berhasil', '180.243.29.30', '2026-05-24 20:27:19'),
(195, 1, 'LOGIN', 'Login berhasil', '36.68.55.173', '2026-05-30 17:00:38'),
(196, 1, 'DELETE', 'Menghapus pendaftaran: fatikhul khan', '36.68.55.173', '2026-05-30 17:05:18'),
(197, 5, 'LOGIN', 'Login berhasil', '182.2.45.110', '2026-05-31 21:09:19'),
(198, 1, 'LOGIN', 'Login berhasil', '36.68.55.173', '2026-05-31 21:18:50');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `nama`, `role`, `created_at`) VALUES
(1, 'admin_spmb', '$2y$10$qAy5E2/jP4XA0XnUELjoReRTYXGEP19xz1086ut0ypwVIbtJaJ5KG', 'Admin SPMB', 'super_admin', '2025-12-20 15:36:31'),
(3, 'Kowi', '$2y$12$XhxknH97hAig80G1Zy.lGeZys705I7UBWk4hi3cb0KKBVLl4vAmJq', 'Kowi', 'admin', '2026-04-17 17:21:17'),
(5, 'arina', '$2y$12$n.VnKauZR65IgLI218TS0O4a1wUuhi83Jd10ud/n.kGsxTMgYxXo2', 'Arina', 'panitia', '2026-05-05 01:12:32');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

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
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

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
(7, NULL, 'Admin', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan FAATIKHUL KHAN - Rp70.000', '2026-02-04 11:59:42'),
(8, 1, 'Admin SPMB', 'CREATE', 'PEMASUKAN', 'Tambah pemasukan FATAN FIRMANSYAH - Rp6.494.679', '2026-04-10 08:13:16'),
(9, 1, 'Admin SPMB', 'DELETE', 'PEMASUKAN', 'Hapus pemasukan FATAN FIRMANSYAH - Rp6.494.679', '2026-04-10 08:13:21');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_01_01_000001_create_users_table', 1),
(5, '2025_01_01_000002_create_pendaftaran_table', 1),
(6, '2025_01_01_000003_create_beasiswa_table', 1),
(7, '2025_01_01_000004_create_biaya_table', 1),
(8, '2025_01_01_000005_create_kontak_table', 1),
(9, '2025_01_01_000006_create_pengaturan_table', 1),
(10, '2025_01_01_000007_create_activity_log_table', 1),
(11, '2026_02_23_002449_create_personal_access_tokens_table', 2),
(12, '2026_02_27_000001_create_perlengkapan_items_table', 3),
(13, '2026_02_27_000002_create_perlengkapan_pesanan_table', 3),
(14, '2026_02_27_000003_create_transaksi_pemasukan_table', 3),
(15, '2026_02_27_000004_create_transaksi_pengeluaran_table', 3),
(16, '2026_02_27_000005_create_log_aktivitas_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `pendaftaran`
--

INSERT INTO `pendaftaran` (`id`, `no_registrasi`, `nama`, `lembaga`, `nisn`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `jumlah_saudara`, `no_kk`, `nik`, `alamat`, `provinsi`, `kota_kab`, `kecamatan`, `kelurahan_desa`, `asal_sekolah`, `prestasi`, `tingkat_prestasi`, `juara`, `file_sertifikat`, `pip_pkh`, `status_mukim`, `sumber_info`, `nama_ayah`, `tempat_lahir_ayah`, `tanggal_lahir_ayah`, `nik_ayah`, `pekerjaan_ayah`, `penghasilan_ayah`, `nama_ibu`, `tempat_lahir_ibu`, `tanggal_lahir_ibu`, `nik_ibu`, `pekerjaan_ibu`, `penghasilan_ibu`, `no_hp_wali`, `password`, `file_kk`, `file_ktp_ortu`, `file_akta`, `file_ijazah`, `status`, `catatan_admin`, `catatan_updated_at`, `created_at`, `reset_token`, `reset_token_expires`) VALUES
(1, '001.1225', 'SOFA HILDA AYU MAULIDA', 'SMP NU BP', '0142465055', 'PEKALONGAN', '2014-05-11', 'P', 1, '3326181712080002', '3375035105140002', 'DUSUN PANGKAH, RT. 003/RW. 002', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KARANGDADAP', 'PANGKAH', 'SD MUHAMMADIYAH PANGKAH', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'KELUARGA', 'WARTO', 'PEKALONGAN', '1962-12-12', '3326181212620004', 'BURUH HARIAN LEPAS', '< 1 JUTA', 'UMI FADHILAH', 'PEKALONGAN', '1975-10-18', '3326185810750001', 'KARYAWAN SWASTA', '1-3 JUTA', '+6288216683867', '$2y$10$TErhJGT7yX8EPbKK..JVP.EEOFczMCI7hFAqIvMHn4GqDtgKjBNWS', '', '', '', '', 'pending', NULL, NULL, '2025-12-22 13:48:38', NULL, NULL),
(2, '002.1225', 'FATAN FIRMANSYAH', 'SMP NU BP', '', 'PEKALONGAN', '2013-01-11', 'L', 0, '3326131812120006', '3326131101130004', 'RT/RW 001/001', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'TANGKIL TENGAH', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'NUR AMINAH', 'PEKALONGAN', '1989-12-01', '33261358108900021', 'BURUH', '', 'NUR AMINAH', 'PEKALONGAN', '1989-12-01', '33261358108900021', 'BURUH', '', '+6285956403558', '$2y$10$e2xaWLOjroyQfwTTPEiMPeyGNa/LeSdlGib3OB9ZTZSjuUL62DTAG', '57_file_kk_1766473602.pdf', 'cuman tes', '', '', 'pending', '', '2026-01-13 03:24:31', '2025-12-23 07:03:11', NULL, NULL),
(4, '003.1225', 'INTAN MUTIA RAMADHANI', 'SMP NU BP', '0141584683', 'PEKALONGAN', '2014-07-21', 'P', 0, '3326141709140001', '3326146107140002', 'Bligo kec buaran RT 16 RW 05 no rumah 34', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'BLIGO', 'SD BLIGO', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'AGUS IMADUDDIN', 'PEKALONGAN', '1975-09-02', '', '', '', '', '', '0000-00-00', '', '', '', '+6285655896428', '$2y$10$ColX8hl0xDf4y8R7MjyDjutQUEj8EQkviZKpaB1DBYw.7wfGWqCMy', '', '', '', '', 'pending', '', '2026-01-11 02:34:15', '2025-12-30 10:14:59', NULL, NULL),
(5, '004.0126', 'FAATIKHUL KHAN', 'SMP NU BP', '', 'PEKALONGAN', '2014-04-08', 'L', 2, '3326140711130002', '3326140804140001', 'RT/RW 05/03 NO 52 KODE POS 51171', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'BLIGO', 'MIS BLIGO', '', NULL, NULL, '', '3690-01-007195-50-7', 'PONDOK PP MAMBAUL HUDA', 'ALUMNI', 'JOKO SETIAWAN', 'KENDAL', '1983-12-28', '3324122812830005', 'BURUH', '< 1 JUTA', 'FATIMAH', 'PEKALONGAN', '1993-06-21', '3326146106930001', 'IBU RUMAH TANGGA', '< 1 JUTA', '+6285335180100', '$2y$10$s9UhI63xP8ZDNEINE.7ED.St7U0xGmD6gd9leHGskag1KaLzfTvfa', 'file_kk_1767256354_69563122217b2.jpg', 'file_ktp_ortu_1767256354_69563122229ad.jpg', 'file_akta_1767256354_6956312223335.jpg', '', 'pending', NULL, NULL, '2026-01-01 08:32:34', NULL, NULL),
(6, '005.0126', 'MUHAMMAD SALMAN ARROYAN', 'SMP NU BP', '', 'Pekalongan', '0000-00-00', 'L', 0, '3326192406200018', '3375011807130002', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'WONOKERTO', 'WONOKERTO WETAN', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'ACHMAD SUBARI MUGIYONO', '', '0000-00-00', '', '', '', 'TRIYANA', '', '0000-00-00', '', '', '', '+6288233453695', '$2y$10$yYTVNOYfuMP6K3PhFeFjJe/L7DZkSli.wRJSTc97bHeVXXllCMTZq', 'file_kk_1767962644_6960f81449194.jpeg', '', 'file_akta_1767962644_6960f8144a24d.jpeg', '', 'pending', NULL, NULL, '2026-01-09 12:44:04', '31e20d5cdd1d3df1c20f87f7f04205809d2725a8fbc1cf98adbb6e7fefec213d', NULL),
(7, '006.0126', 'ULUL ILMI', 'SMP NU BP', '', 'PEKALONGAN', '0000-00-00', 'L', 0, '', '', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'TIRTO', 'NGALIAN', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'NUR ALIM', '', '0000-00-00', '', '', '', 'NUR FADILLAH', '', '0000-00-00', '', '', '', '+6285742687970', '$2y$10$ZSZUO89fc73oC59omdwXZeY4URuVXhN8xME762WFzafJuYdSrALQe', '', '', '', '', 'pending', NULL, NULL, '2026-01-09 12:53:27', NULL, NULL),
(9, '007.0126', 'M. KHAIRUN HAFIZAR', 'SMP NU BP', '', '', '0000-00-00', 'L', 0, '', '', '', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'AMBOKEMBANG', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'M. YUSUF KHAMBALI', '', '0000-00-00', '', '', '', 'KHOLIPAH', '', '0000-00-00', '', '', '', '+6285802767044', '$2y$10$EXq/Cgp9Dfnnnphq.XkmieccUuookuABeRVQqbrf93uTKchFDIzYu', '', '', '', '', 'pending', NULL, NULL, '2026-01-11 06:53:01', NULL, NULL),
(10, '008.0126', 'NABILA SALSABILA', 'SMP NU BP', '', 'PEKALONGAN', '0000-00-00', 'L', 0, '3326131710170001', '', 'RT/RW 002/004 KEDUNGUWUNI TIMUR', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'KEDUNGWUNI TIMUR', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'UMAR KHAMDAN', 'PEKALONGAN', '1980-07-23', '3375032307800004', 'BURUH HARIAN LEPAS', '1-3 JUTA', 'JAZILAH', 'PEKALONGAN', '1984-12-08', '3326134812840002', 'MENGURUS RUMAH TANGGA', '< 1 JUTA', '+628156553930', '$2y$10$fFA7awncfP6OLTlxlpHLF.8.gSXJnvROAkMYuovk63y8yacmA9Bze', '', '', '', '', 'pending', NULL, NULL, '2026-01-19 01:56:36', NULL, NULL),
(11, '009.0126', 'LABIBAH ZAKIYYA', 'SMP NU BP', '00000000000000', 'PEMALANG', '2014-05-31', 'P', 1, '3327100408140015', '3327107105140001', 'DESA KENDALREJO DUSUN KEDUNG UTER PETARUKAN', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'PETARUKAN', 'KENDALREJO', '', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'MUHAMMAD TIMBUL PRAYITNO', 'PEMALANG', '1992-09-10', '3327101009920046', 'WIRASWASTA', '3-5 JUTA', 'KHAERUNISA', 'PEMALANG', '1991-07-15', '3327105507910027', 'MENGURUS RUMAH TANGGA', '< 1 JUTA', '+6285225052902', '$2y$10$pt/zK3jgmYbpNr8qvTK4L.MIRV3oJPQHzzxXL4PWVCQ3KH5rPLElK', '', '', '', '', 'pending', NULL, NULL, '2026-01-19 02:09:47', NULL, NULL),
(12, '010.0226', 'SOFA HILDA AYU MAULIDA', 'SMP NU BP', '000000000', 'PEKALONGAN', '2014-03-11', 'P', 2, '3326181712080002', '3375035105140002', 'PANGKAH KARANGDADAP', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KARANGDADAP', 'PANGKAH', 'SDN PANGKAH', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'BROSUR', 'WARTO', 'PEKALONGAN', '1962-12-12', '3326181212620004', 'BURUH', '1-3 JUTA', 'UMI FADHILAH', 'PEKALONGAN', '1975-10-18', '3326185810750001', 'KARYAWAN SWASTA', '1-3 JUTA', '+628000000000000', '$2y$10$ALSr1q3ncXq9xf.y3xiILOTJRsrdE0UMqC1XHGRskdsj5CQ01W0L.', '', '', '', '', 'pending', NULL, NULL, '2026-02-09 00:09:00', NULL, NULL),
(13, '011.0226', 'EKA WAHYU LUKMANA', 'SMP NU BP', '000000000', 'PEKALONGAN', '2013-08-18', 'P', 1, '3326130502180012', '3326125808130001', 'DK MADUKARAN KEDUNGWUNI BARAT PEKALONGAN', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'KEDUNGWUNI BARAT', 'MI YMI 02 SURABAYAN', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'SOSIAL MEDIA', 'LUKMAN HAKIM', 'PEKALONGAN', '1980-07-04', '3326130407800041', 'BURUH', '1-3 JUTA', 'KHOIRIYATUL AMANAH', 'PEKALONGAN', '1987-12-27', '3326126712870001', 'MENGURUS RUMAH TANGGA', '', '+6285641164826', '$2y$10$622sVT.9ay48Rxn4z7LpiOEyG/I5FTEaAKXVLMrEr6jxG1J26Glni', '', '', '', '', 'pending', NULL, NULL, '2026-02-09 00:46:37', NULL, NULL),
(14, '012.0326', 'AMIRA DZAKIYYATUZ ZAHIRA', 'SMP NU BP', '3143528045', 'PEKALONGAN', '2014-03-18', 'P', 0, '3326141202150012', '3326145803140004', 'RT 14 RW 05 NO.38', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'BLIGO', 'MIS BLIGO', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', '', 'MUFIANTO', 'PEKALONGAN', '1987-11-08', '3326140811870002', 'KARYAWAN', '1-3 JUTA', 'RIZQI MAU\\\'IDA', 'PEKALONGAN', '1989-11-02', '', '', '1-3 JUTA', '+6285647983400', '$2y$10$kWOTAwbEmDCJ5ICVvP9PhOArZ49Wr8jhjM.mAmdCuanAi4MRIJvgK', 'file_kk_1773611721_69b72ac98af04.pdf', 'file_ktp_ortu_1773611721_69b72ac98b1e0.pdf', 'file_akta_1773611721_69b72ac98b2fe.pdf', '', 'pending', NULL, NULL, '2026-03-15 21:55:21', NULL, NULL),
(15, '013.0326', 'BIMA ANUGERAH', 'SMP NU BP', '0138376766', 'PEMALANG', '2013-12-23', 'L', 1, '3327130507170009', '3327132312130003', 'JALAN DESA TASIKREJO RT 05,RW 06', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'ULUJAMI', 'TASIKREJO', 'SDN O1 TASIKREJO', '', NULL, NULL, '', '', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', '', '', '0000-00-00', '', '', '', 'WARSINI', 'PEMALANG', '1982-03-13', '3327135601820001', 'PENGURUS RUMAH TANGGA', '1-3 JUTA', '+6285726061554', '$2y$10$A9Ecmtx7T0rjtKWWz2SSheRemXx/WC6AtqsN3y7mLsT/GbFL32SOi', 'file_kk_1774958823_69cbb8e7b1132.jpg', 'file_ktp_ortu_1774958823_69cbb8e7b165c.jpg', 'file_akta_1774958823_69cbb8e7b1813.jpg', '', 'pending', NULL, NULL, '2026-03-31 12:07:03', NULL, NULL),
(16, '014.0426', 'AL FAREZKY ADZANI AHMAD', 'SMP NU BP', '0146437510', 'PEKALONGAN', '2014-05-13', 'L', 1, '', '3375021305140001', 'JALAN  KI SURONTOKO RT 002/ RW 012 DEKORO SETONO PEKALONGAN TIMUR', 'JAWA TENGAH', 'KOTA PEKALONGAN', 'PEKALONGAN TIMUR', 'SETONO', 'MI ISLAMIYAH DEKORO', '', NULL, NULL, '', '33750221048728', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'ACHMAT MUSTAKIM', 'BATANG', '1978-08-05', '3375020508780001', 'KARYAWAN SWASTA', '1-3 JUTA', 'ERMAWATI', 'BATANG', '1987-05-30', '3375027005870003', 'IBU RUMAH TANGGA', '', '+6288225492899', '$2y$10$4VzPnNavNLagibFYgdXDMegyIidJnAWvLHuN/YbjfpuhaVIDXYW.a', '', '', '', '', 'pending', NULL, NULL, '2026-04-01 13:35:54', NULL, NULL),
(18, '003.042026', 'MUHAMMAD DANISH SHIDQI', 'SMP NU BP', '0142901666', 'PEKALONGAN', '2014-06-01', 'L', 2, '3326100108070479', '3326100106140002', 'DUKUH RINGINPITU RT002/RW007', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'SRAGI', 'SRAGI', 'SD NEGERI 3 SRAGI', NULL, NULL, NULL, NULL, 'F18B82', 'PONDOK PP MAMBAUL HUDA', 'TEMAN', 'WARDOYO', 'PEKALONGAN', '1966-03-05', '3326100503660002', 'BURUH', '1-3 Juta', 'KISMIATUN', 'PEKALONGAN', '1977-02-21', '3326106102770002', NULL, NULL, '088802676264', '$2y$12$I0rT6VYF6RqinybCTtD1FOaRX2rp9vVl02X6ndJ8AydHl2Xp.t6i.', NULL, '18_file_ktp_ortu_1776321406.pdf', '18_file_akta_1776321406.pdf', NULL, 'pending', NULL, NULL, '2026-04-15 23:36:46', 'd4c7073eb8967913424211c51e2d80d707b4a802302a0538b5c91088923acab2', NULL),
(19, '003.042026', 'ulul ilmi', 'SMP NU BP', '000000000', 'pekalongan', '2013-09-19', 'P', 1, '3326151307200004', '3326155909130007', 'ngalian dusun.ngalian', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'TIRTO', 'NGALIAN', 'sdn tirto', NULL, NULL, NULL, NULL, '0000000000', 'PONDOK PP MAMBAUL HUDA', 'SOSIAL MEDIA', 'nuralim', 'batang', '1969-12-12', '3325121212690001', 'buruh', '1-3 Juta', 'nur fadlilah', 'pekalongan', '1985-10-26', '3326156610850003', 'mengurus rumah tangga', NULL, '000000000000', '$2y$12$POILkfe0PS63DoYjPqUWUe/5Y0I6ikO4HAJ.0FkZlgGATouixbeYq', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-04-22 08:33:56', NULL, NULL),
(20, '004.042026', 'm khairun hafizar', 'SMP NU BP', '0000000000000', 'pekalongan', '2013-10-05', 'L', 1, '3326131704140004', '3326130510130004', 'rt 033/rw016', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'AMBOKEMBANG', NULL, NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'm yusuf khambali', 'pekalongan', '1986-08-19', '3326131908860004', 'buruh', '3-5 Juta', 'kholipah', 'pekalongan', '1991-10-12', '3326155210910024', 'mengurus rumah tangga', '< 1 Juta', '000000000000000', '$2y$12$oxZlrenbNssGS9/COzUPgOHy3R7oKvV1f4qseyhOpHus5qw0DvLdm', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-04-22 08:49:48', NULL, NULL),
(21, '005.042026', 'riski zhafira', 'SMP NU BP', '0000000000000', 'pekalongan', '2013-12-25', 'P', 1, '3326140108070026', '3326146612130001', 'sapugarut gg 10', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'SAPUGARUT', 'mis bligo', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, '3326140102710001', 'pekalongan', '1971-02-01', '3326140102710001', 'buruh', '3-5 Juta', 'noor khasanah', 'pekalongan', '1971-01-01', '3326145101710001', 'mengurus rumah tangga', NULL, '08562121943', '$2y$12$rDuoNs3al5i65PtgsId8Y.ALtnXka4.eYzY7xWk7uILTjbDaAk1zO', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-04-22 09:08:41', NULL, NULL),
(22, '006.042026', 'putri saya\'atul amalia', 'SMP NU BP', '000000000000', 'pekalongan', '2014-01-24', 'P', 1, '3326141904120002', '3333333333333333', 'kertijayan gg 6 buaran', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'KERTIJAYAN', NULL, NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'mustajab', 'pekalongan', NULL, '333333333333', 'wiraswasta', '> 5 Juta', NULL, NULL, NULL, NULL, NULL, NULL, '089618530702', '$2y$12$rZmV0sbOT3cWU8OpmDwmvuLVW3ezw29gdNYT0adF77OrstD0yI9C2', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-04-22 09:18:38', NULL, NULL),
(23, '007.042026', 'andra faturahman', 'SMP NU BP', '000000000000000', 'batang', '2014-05-27', 'L', 2, '3325130309140011', '3325132705140001', 'rt004/rw001 ujungnegoro kandeman batang', 'JAWA TENGAH', 'KABUPATEN BATANG', 'KANDEMAN', 'UJUNGNEGORO', 'mis al ikhsan ujungnegoro', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'ahmad abdurohman', 'batang', '1988-05-16', '3325131605880002', 'buruh', '3-5 Juta', 'tasmulyati', 'batang', '1990-08-01', '3325134108900001', 'mengurus rumah tangga', '1-3 Juta', '081329637622', '$2y$12$JtmwCOgi1FmMn5nEvoXrRu4vW8Tawb721P6ivejkLHi8UhZ9.7/K2', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-04-22 09:31:58', NULL, NULL),
(24, '008.042026', 'Fahmi', 'MA ALHIKAM', '312434123', 'pekalongan', '2005-09-27', 'L', 1, '4314213132132', '132123213132', NULL, 'SUMATERA UTARA', 'KABUPATEN NIAS', 'BAWOLATO', 'ORAHILI', NULL, NULL, NULL, NULL, NULL, NULL, 'PONDOK SELAIN PP MAMBAUL HUDA', NULL, 'Dolore qui quibusdam', 'Ipsam voluptatum qui', '1999-09-22', 'Et in similique ipsu', 'Error irure maxime d', '1-3 Juta', 'Explicabo Id quia', 'Vel aute dolorem sun', '2019-10-25', 'Fugiat reiciendis au', 'Repellendus Vero ma', '3-5 Juta', '085353925604', '$2y$12$w5lxxMoViucwLpGevorFWu/L2Ve0Oa5IA/phMI7th1oVslyk5mMLa', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-04-22 12:02:02', NULL, NULL),
(25, '001.052026', 'Fakhrie zafran khairy', 'SMP NU BP', '00000000009', 'Pekalongan', '2014-06-30', 'L', 3, '3375011108170004', '3326143006140004', 'Jl karya baktimedono', 'JAWA TENGAH', 'KOTA PEKALONGAN', 'PEKALONGAN BARAT', 'MEDONO', 'MiS Kuripan Kidul', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', 'BROSUR', 'Joyo wiseno', 'Pekalongan', '1990-04-07', '3326140704900002', 'Wiraswasta', '3-5 Juta', 'Nur rohmah', 'Pekalongan', '1992-03-25', '3375016503920003', 'Mengurus rumah tangga', '< 1 Juta', '085742438000', '$2y$12$/dNEqar2OOS1wa3KNQc/F.7oIGW7hBF.lL0aV5OmynuM6OClqOxem', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-10 06:46:34', NULL, NULL),
(26, '002.052026', 'Abidzar ghifari', 'SMP NU BP', '0135093591', 'Pekalongan', '2013-09-29', 'L', 2, '3326140709120002', '3326142909130002', '12/04 sapugarut 422', 'JAWA TENGAH', 'KOTA PEKALONGAN', 'PEKALONGAN SELATAN', 'BUARAN KRADENAN', 'Mis sapugarut', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'Zamzuri', 'Pekalongan', '1975-06-20', '3326142006750001', 'Buruh', '< 1 Juta', 'Junainah', 'Pekalongan', '1978-06-24', '3326144809060004', 'Ibu rumah tangga', '< 1 Juta', '081542139390', '$2y$12$U1K3TiqnyOHDMOm1dhEB4ujp3lkKl3G773dsfhXCGzLtmQlz9DzXu', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-15 01:36:51', NULL, NULL),
(28, '004.052026', 'wisnu adi nugroho', 'SMP NU BP', '0145417239', 'pemalang', '2014-01-03', 'L', 2, '3327130604110004', '3327130103140003', 'botekan ulujami pekalongan', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'ULUJAMI', 'BOTEKAN', 'sdn 01 botekan', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'carmadi', 'pemalang', '1979-02-20', '3327132201790006', 'karyawan swasta', '> 5 Juta', 'wijayanti', 'pemalang', '1981-09-05', '3327134905810006', 'mengurus rumah tangga', '< 1 Juta', '085810893808', '$2y$12$HmN081aSlaVL7pvsLRXb..dIjwf34dmedi09VsTWcJ5sgOPCqrI1C', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-19 06:20:07', NULL, NULL),
(29, '005.052026', 'arfaur rikza', 'MA ALHIKAM', '00000000000', 'pekalongan', '2010-12-29', 'L', 0, '00000000000', '0000000000', NULL, 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'KARANGDOWO', 'smp nu pajomblangan', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'muh siswanto', 'pekalongan', '1987-11-11', '000000000', NULL, NULL, 'riskiyah', 'pekalongan', '2026-05-19', '0000000000', NULL, NULL, '00000000000', '$2y$12$ppsWTQOrQZ6wasRy58Bx1.m4WTrqwNXUm95hHMIJ1WZQ6uCFxjCUm', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-19 06:29:21', NULL, NULL),
(30, '006.052026', 'ALIFAH JAHRO LUTHFIYA', 'SMP NU BP', NULL, 'pEMALANG', '2014-03-12', 'P', 2, '3327101207130005', '3327105203140005', 'TEGALMLATI RT 04 RW 01 PETARUKAN PEMALANG', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'PETARUKAN', 'TEGALMLATI', 'SD/MI', NULL, NULL, NULL, NULL, NULL, 'PONDOK SELAIN PP MAMBAUL HUDA', NULL, 'JOHAN', 'PEMALANG', '1987-07-11', '6104131107870002', 'PEDAGANG', '< 1 Juta', 'JULIA', 'NATAI PANJANG', '1990-12-15', '6104135512900001', 'MENGURUS RUMAH TANGGA', '< 1 Juta', '087700222775', '$2y$12$It7OTiKM9sFIGcAHOknW3ObMQzbKE7T6aQWqdQ7sM9jVsHwaon6XO', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-19 20:07:34', NULL, NULL),
(31, '007.052026', 'AFIF MUSTOFA', 'SMP NU BP', NULL, 'PEMALANG', '2013-05-09', 'L', 1, '3327100801070040', '3327100905130001', 'DUSUN SIKENTUNG RT 03 RW 10 PETARUKAN KEC. PETARUKAN', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'PETARUKAN', 'PETARUKAN', 'SD/MI', NULL, NULL, NULL, NULL, NULL, 'PONDOK SELAIN PP MAMBAUL HUDA', NULL, 'SOHIBUL HAYAT', 'PEMALANG', '1976-08-05', '3327100508760061', 'BURUH', '< 1 Juta', 'SITI TAHYATUN', 'PEMALANG', '1980-05-14', '3327105405800021', 'MENGURUS RUMAH TANGGA', '< 1 Juta', '08156689168', '$2y$12$A9j8XU6ZPPFzo21C1V0NY.eVnLgJMY/EhqgoSgP98VNN4st1tUpxu', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-19 20:19:48', NULL, NULL),
(32, '008.052026', 'muhammad syukril maula', 'SMP NU BP', NULL, 'pekalongan', '2013-06-17', 'L', 2, '3326132401200007', '3326131706130005', 'RT/RW 13/7', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'BUARAN', 'WATUSALAM', 'MI KERTOHARJO', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', 'KELUARGA', 'moh. khollad', 'pekalongan', '1994-01-07', '3326130701950001', 'karyawan swasta', '< 1 Juta', 'maulidiyatun nisak', 'pekalongan', '1994-08-29', '3326146908940002', 'buruh harian lepas', '< 1 Juta', '087823393891', '$2y$12$YUBQNJem9gnUorxBe.i0iOz7SR7NcioEeqrME4mC..oUgcIdUJOKC', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-20 19:52:21', NULL, NULL),
(33, '009.052026', 'muhammad absori abdillah', 'SMP NU BP', NULL, 'pekalongan', '2014-01-07', 'L', 2, '3326132105140007', '3326130701140003', 'RT/RW 02/02', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'PAJOMBLANGAN', 'MI WALISONGO 02 PAJOMBLANGAN', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'ABDURROHMAN', 'PEKALONGAN', '1986-06-15', '3326131506860021', 'BURUH HARIAN LEPAS', '< 1 Juta', 'UMU TAMYIZAH', 'PEKALONGAN', '1989-08-16', '3326135608890021', 'MENGURUS RUMAH TANGGA', '< 1 Juta', '085870199089', '$2y$12$sGl6xQSZPYJ93SrQzNP4pOQ0N8WnoYy./oH/k5fJ6b38RKEdbDj5i', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-20 20:02:48', NULL, NULL),
(34, '010.052026', 'In blanditiis amet', 'SMP NU BP', 'Aperiam distinctio', 'Recusandae Consequa', '1970-02-11', 'L', 50, 'Hic incididunt dolor', 'Ut error veniam id', 'Et fugiat voluptate', 'SULAWESI UTARA', 'KABUPATEN BOLAANG MONGONDOW UTARA', 'BOLANG ITANG TIMUR', 'SALEO I', 'Tempor sit est beat', 'Voluptatem deserunt', 'NASIONAL', '3', NULL, 'Doloribus et labore', 'PONDOK SELAIN PP MAMBAUL HUDA', 'ALUMNI', 'Sequi est in fugit', 'In ullamco aut modi', '1999-11-14', 'Corporis elit praes', 'Molestiae nobis labo', '< 1 Juta', 'Quae mollit proident', 'Aute et nobis dolore', '1998-10-02', 'Ut dolor mollit moll', 'Hic quis provident', '< 1 Juta', '015138584789', '$2y$12$SYq405DrkkUuYaGqv2qlcebucNpc2DRw3U0DWdHUI1HvY31OrZExe', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-22 00:30:21', NULL, NULL),
(35, '011.052026', 'nama', 'SMP NU BP', '123', 'lahir', '2026-05-24', 'L', 1, '12314', '325235', 'alamat', 'JAWA TENGAH', 'KOTA PEKALONGAN', 'PEKALONGAN BARAT', 'MEDONO', 'sekolah', 'prestasi', 'KABUPATEN', '1', '35_file_sertifikat_1779623370.jpeg', NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'ayah', 'lahir', '2026-05-24', '123456789012345', '123456789012345', '3-5 Juta', 'ibu', 'tempat lahir', '2026-05-01', '123456789012345', '123456789012345', '3-5 Juta', '085641647473', '$2y$12$kU6wwVg1VZUqfnPCwvd9COEdwi6zWKzM0YUglubqbFxUdRN3D6hWu', '35_file_kk_1779623370.jpeg', '35_file_ktp_ortu_1779623370.jpeg', '35_file_akta_1779623370.jpeg', '35_file_ijazah_1779623370.jpeg', 'pending', NULL, NULL, '2026-05-24 04:49:29', NULL, NULL),
(36, '012.052026', 'Fajri Gegas Pratama', 'MA ALHIKAM', NULL, 'Pemalang', '2011-03-17', 'L', 3, '3327130604110004', '3327131703110002', 'Botekan, Ulujami, Pemalang', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'ULUJAMI', 'BOTEKAN', 'Mts salafiyah Simbang kulon', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'Carmadi', 'Pemalang', '1979-01-22', '3327132201790006', 'Buruh', '3-5 Juta', 'Wijayanti', 'Pemalng', '1981-05-09', '3327134905810006', 'Ibu rumah tangga', NULL, '08174934603', '$2y$12$NIIDMQ.c3Gj2Z8ph6IQE6eb6ou.tlgIPI.L.fz8SjIja14g0b23Ie', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-24 06:50:56', NULL, NULL),
(37, '013.052026', 'MUHAMMAD DIMAS HADI WIJAYA', 'SMP NU BP', '0148687536', 'PEKALONGAN', '2014-01-12', 'L', 2, '3326122110130003', '3326121201140003', 'RT. 002 RW.001 jL. nUSA INDAH NO. 20', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'WONOPRINGGO', 'WONOPRINGGO', 'MIN ISLAMIC CENTRE KEDUNGWUNI', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', 'KELUARGA', 'SYACHRUL ROMADHONI', 'PEKALONGAN', '1982-07-19', '3326121907820004', 'KARYAWAN HONORER', '1-3 Juta', 'MATHRUL HIDAYAH', 'BATANG', '1988-12-09', '3325124912880001', 'GURU', '1-3 Juta', '085642930380', '$2y$12$mo3f6QjE0YIMZGwQuGi3g.Ol5KW65KDxZg3hg8nZkaxZpxMmN4dZ6', '37_file_kk_1779679275.pdf', '37_file_ktp_ortu_1779679275.pdf', '37_file_akta_1779679275.pdf', NULL, 'pending', NULL, NULL, '2026-05-24 20:21:15', 'efd22cd1f54fc75ba424ad7f35dc6b633cee871d59b7c54c54e270eaab5c11da', NULL),
(38, '001.062026', 'nurin iffatur rifdah', 'SMP NU BP', '0141112217', 'pemalang', '2014-02-17', 'P', 2, '3327103009110036', '3327105702140002', 'rt 03 rw o2 jln.raya kendaldoyong', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'PETARUKAN', 'KENDALREJO', 'sd negeri 04 kendaldoyong', 'lomba mapsi tingkat kecamatan', NULL, '2', NULL, NULL, 'PONDOK PP MAMBAUL HUDA', 'BROSUR', 'murnoto', 'pemalang', '1983-11-11', '3327101111830091', 'wiraswasta', '< 1 Juta', 'siti khoerun nisya', 'pemalang', '1977-06-02', '3327104206770048', 'guru', '1-3 Juta', '083824446299', '$2y$12$eBr94R3goOxrx/Ko9DaNAuoq7VEjwfXELliy0ZUtGM88HsH7ZX.JG', '38_file_kk_1780278942.pdf', '38_file_ktp_ortu_1780278942.pdf', '38_file_akta_1780278942.pdf', NULL, 'pending', NULL, NULL, '2026-05-31 18:55:42', '90d1b0a86eda76f9a2325a4f28535a71779822fdae979c52fc92bc6e5a271901', NULL),
(39, '002.062026', 'muhammad dafin darbinnaja', 'SMP NU BP', '000000000000000', 'pekalongan', '2014-11-07', 'L', 3, '3326131106140009', '3326131107140002', 'karangdowo kedungwuni', 'JAWA TENGAH', 'KABUPATEN PEKALONGAN', 'KEDUNGWUNI', 'KARANGDOWO', 'mi ws karangdowo 2', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'muchammad khanafi', 'pekalongan', '2006-03-10', '3326133108860021', 'wiraswasta', '> 5 Juta', 'nur eva maulida', 'pekalongan', '1982-12-02', '3326135602920002', 'mengurus rumah tangga', NULL, '085772477623', '$2y$12$PARKAdZEqKg030KYf2bh3.YGyk3mUV3mevXfz5IVsaYk86LQ0d29K', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-31 21:34:02', NULL, NULL),
(40, '003.062026', 'amanda nur latifa', 'MA ALHIKAM', '0000000000', 'tegal', '2011-12-08', 'P', 1, '3171070501121008', '317107528111003', 'rt/rw 016/012 jl sabeni no 10 kota jakarta pusat dki jakarta', 'DKI JAKARTA', 'KOTA JAKARTA PUSAT', 'TANAH ABANG', 'KEBON MELATI', 'SMP NU BP PAJOMBLANGAN', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'MUHAMMAD MUJTAHID', 'JAKARTA', '1986-09-01', '3171070901860004', 'KARYAWAN SWASTA', '> 5 Juta', 'SUSIANA', 'TEGAL', '1988-06-08', '332813460888173', 'MENGURUS RUMAH TANGGA', NULL, '00000000000000', '$2y$12$6zIihZj188cBanzDYgsJHO5iXcoO86NnMMreGch3yi3ytJEOeT4wu', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-31 22:47:38', NULL, NULL),
(41, '004.062026', 'helmi faisal akbar', 'SMP NU BP', '0000000000000', 'pemalang', '2014-09-07', 'L', 2, '3327131405140012', '3327130907140001', 'botekan ulujami pemalang', 'JAWA TENGAH', 'KABUPATEN PEMALANG', 'ULUJAMI', 'BOTEKAN', 'sdn botekan', NULL, NULL, NULL, NULL, NULL, 'PONDOK PP MAMBAUL HUDA', NULL, 'casmudin', 'pemalang', '1987-03-03', '3327130503870007', 'buruh harian lepas', '> 5 Juta', 'emi listiowati', 'pemalang', '1991-10-01', '3327135112900001', 'mengurus rumah tangga', '< 1 Juta', '0999999999999999', '$2y$12$m8KxgGh0kwufQsY/dcqiCexewgIQRm.is.AAKjPoIT/WdRZ6wU/Xy', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2026-05-31 23:01:30', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan`
--

CREATE TABLE `pengaturan` (
  `id` int(11) NOT NULL,
  `kunci` varchar(50) NOT NULL,
  `nilai` text DEFAULT NULL,
  `keterangan` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `perlengkapan_pesanan`
--

INSERT INTO `perlengkapan_pesanan` (`id`, `pendaftaran_id`, `perlengkapan_item_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 1, 0, '2026-02-04 12:03:50', '2026-02-04 12:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(36, 'App\\Models\\User', 3, 'auth-token', '4c9013d1a41eecb48b0b6d7f42d6be845bc818c89919b8a7bb95531083421adb', '[\"*\"]', '2026-05-01 01:30:43', '2026-05-01 09:29:07', '2026-05-01 01:29:07', '2026-05-01 01:30:43'),
(48, 'App\\Models\\User', 5, 'auth-token', '7583297c2ac579917a6a30d68180828cf7693906d151455355073d2a780f4909', '[\"*\"]', '2026-05-31 22:06:39', '2026-06-01 05:09:19', '2026-05-31 21:09:19', '2026-05-31 22:06:39'),
(49, 'App\\Models\\User', 1, 'auth-token', 'd93ef2545362df6dfb846206ee11ea4e0b840ef8860324730d68a13be4bda9f2', '[\"*\"]', '2026-05-31 23:14:17', '2026-06-01 05:18:49', '2026-05-31 21:18:49', '2026-05-31 23:14:17');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `input_by` int(11) DEFAULT NULL,
  `input_at` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `catatan_approval` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `transaksi_pemasukan`
--

INSERT INTO `transaksi_pemasukan` (`id`, `invoice`, `pendaftaran_id`, `tanggal`, `nominal`, `jenis_pembayaran`, `keterangan`, `status`, `input_by`, `input_at`, `approved_by`, `approved_at`, `catatan_approval`, `created_at`) VALUES
(5, 'INV-20260501-0001', 10, '2026-05-01', 50000, 'Cash', 'Registrasi', 'approved', 3, '2026-05-01 08:30:12', 3, '2026-05-01 08:30:12', NULL, '2026-05-01 01:30:12'),
(7, 'INV-20260519-0001', 25, '2026-05-19', 50000, 'Cash', 'registrasi', 'approved', 1, '2026-05-19 13:45:40', 1, '2026-05-19 13:45:40', NULL, '2026-05-19 06:45:40');

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
  `input_by` int(11) DEFAULT NULL,
  `input_at` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `catatan_approval` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `role` enum('super_admin','admin','panitia') NOT NULL DEFAULT 'panitia',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
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
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kontak`
--
ALTER TABLE `kontak`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `idx_log_modul` (`modul`) USING BTREE,
  ADD KEY `idx_log_aksi` (`aksi`) USING BTREE,
  ADD KEY `idx_log_created` (`created_at`) USING BTREE;

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `unique_phone` (`no_hp_wali`) USING BTREE,
  ADD KEY `idx_reset_token` (`reset_token`) USING BTREE;

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
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `perlengkapan_pesanan`
--
ALTER TABLE `perlengkapan_pesanan`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `unique_pesanan` (`pendaftaran_id`,`perlengkapan_item_id`) USING BTREE,
  ADD KEY `perlengkapan_item_id` (`perlengkapan_item_id`) USING BTREE;

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `transaksi_pemasukan`
--
ALTER TABLE `transaksi_pemasukan`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `invoice` (`invoice`) USING BTREE,
  ADD KEY `idx_pemasukan_pendaftaran` (`pendaftaran_id`) USING BTREE,
  ADD KEY `idx_pemasukan_tanggal` (`tanggal`) USING BTREE;

--
-- Indexes for table `transaksi_pengeluaran`
--
ALTER TABLE `transaksi_pengeluaran`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `invoice` (`invoice`) USING BTREE,
  ADD KEY `idx_pengeluaran_tanggal` (`tanggal`) USING BTREE,
  ADD KEY `idx_pengeluaran_kategori` (`kategori`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=199;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kontak`
--
ALTER TABLE `kontak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

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
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `transaksi_pemasukan`
--
ALTER TABLE `transaksi_pemasukan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transaksi_pengeluaran`
--
ALTER TABLE `transaksi_pengeluaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
