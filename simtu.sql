-- ====================================================================
-- DATABASE SIM-TU SMA NEGERI 3 BURU
-- Kompatibel dengan phpMyAdmin / MySQL 5.7+ / MariaDB 10.3+
-- ====================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. Tabel: surat_keluar
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `surat_keluar` (
  `id` varchar(64) NOT NULL,
  `no_surat` varchar(255) DEFAULT NULL,
  `tanggal_surat` varchar(100) DEFAULT NULL,
  `tujuan` varchar(255) DEFAULT NULL,
  `perihal` varchar(255) DEFAULT NULL,
  `jenis_surat` varchar(100) DEFAULT NULL,
  `isi_surat` longtext DEFAULT NULL,
  `file_surat` text DEFAULT NULL,
  `raw_data` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Data Pemulihan Surat Keluar (Azan Besan - SKHUN)
-- --------------------------------------------------------
INSERT INTO `surat_keluar` (`id`,`no_surat`, `tanggal_surat`, `tujuan`, `perihal`, `jenis_surat`, `isi_surat`, `file_surat`, `raw_data`) VALUES
('sk_restore_azan_besan', '421.4 / 199 / 2026', '2026-10-01', 'AZAN BESAN', 'Keterangan Tidak Memiliki SKHUN', 'Surat Keterangan', 
'<p style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 2px;">SURAT KETERANGAN</p><p style="text-align: center; margin-top: 0; margin-bottom: 20px;">Nomor : 421.4 / 199 / 2026</p><p>Yang bertanda tangan dibawah ini Kepala SMA Negeri 3 Buru :</p><table style="width: 100%; margin-left: 20px; line-height: 1.6;"><tr><td style="width: 180px;">N a m a</td><td>: <b>ANTON LA HARI, S.Pd, M.Pd</b></td></tr><tr><td>N i p</td><td>: 19780703 200312 1 005</td></tr><tr><td>Pangkat / Golongan</td><td>: Pembina Utama Muda - IV/c</td></tr><tr><td>Jabatan</td><td>: Kepala Sekolah</td></tr><tr><td>Alamat</td><td>: Waekerta, Kec. Waeapo</td></tr></table><p style="margin-top: 15px;">Dengan ini menerangkan bahwa :</p><table style="width: 100%; margin-left: 20px; line-height: 1.6;"><tr><td style="width: 180px;">N a m a</td><td>: <b>AZAN BESAN</b></td></tr><tr><td>NISN</td><td>: 0051943379</td></tr><tr><td>NPSN</td><td>: 60101015</td></tr><tr><td>Tempat Tgl Lahir</td><td>: Gogrea, 15 juli 2005</td></tr><tr><td>Alamat</td><td>: Desa Wanakarta, Kec Lolong Guba, Kab Buru</td></tr></table><p style="margin-top: 20px; text-indent: 30px; text-align: justify;">Adalah benar – benar tidak memiliki SKHUN, mengingat Tahun Pelajaran 2022/2023 Ujian Nasional telah ditiadakan oleh Menteri Pendidikan.</p><p style="text-indent: 30px; text-align: justify;">Demikian Surat Keterangan ini dibuat dan diberikan untuk dapat dipergunakan sebagaimana mestinya.</p><div style="float: right; margin-top: 25px; text-align: left; width: 250px;"><p style="margin: 0;">Diberikan di &nbsp;: Waekerta</p><p style="margin: 0 0 10px 0;">Pada Tanggal : 01 Oktober 2026</p><p style="margin: 0 0 65px 0;">Kepala Sekolah</p><p style="margin: 0; font-weight: bold; text-decoration: underline;">ANTON LA HARI, S.Pd, M.Pd</p><p style="margin: 0;">Nip. 19780703 200312 1 005</p></div><div style="clear: both;"></div>',
NULL,
'{"id":"sk_restore_azan_besan","no_surat":"421.4 / 199 / 2026","tgl_surat":"2026-10-01","tujuan_surat":"AZAN BESAN","perihal":"Keterangan Tidak Memiliki SKHUN","jenis_surat":"Surat Keterangan"}')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- --------------------------------------------------------
-- 3. Tabel: surat_masuk
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `surat_masuk` (
  `id` varchar(64) NOT NULL,
  `no_surat` varchar(255) DEFAULT NULL,
  `pengirim` varchar(255) DEFAULT NULL,
  `tanggal_surat` varchar(100) DEFAULT NULL,
  `tanggal_terima` varchar(100) DEFAULT NULL,
  `perihal` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `file_surat` text DEFAULT NULL,
  `raw_data` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Tabel: pengajuan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pengajuan` (
  `id` varchar(64) NOT NULL,
  `nama_pemohon` varchar(255) DEFAULT NULL,
  `nisn` varchar(50) DEFAULT NULL,
  `kelas` varchar(50) DEFAULT NULL,
  `jenis_surat` varchar(100) DEFAULT NULL,
  `keperluan` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Menunggu',
  `is_hidden` tinyint(1) DEFAULT 0,
  `raw_data` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Tabel: users (Autentikasi Aman)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'tu',
  `password_hash` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Akun Login Bawaan (Admin & Staf TU)
-- --------------------------------------------------------
INSERT INTO `users` (`username`, `email`, `name`, `role`, `password_hash`) VALUES
('admin', 'admin@smanegeri3buru.my.id', 'Administrator TU', 'admin', '8e556d13566e52191a661d655e4d87b6:ae2d325b3b5bd0bbab8cbb501e3fae9d805da32a020893877467764839367e369eefe08004798f0d10c03a45ad644365c8d9611a0578d48200f0a8ca1c5d0143'),
('tu', 'tu@smanegeri3buru.my.id', 'Staf Layanan TU', 'tu', 'ce42f42ed1d41f8cfc247bd29d483801:35dfd2db6eb0c46e5b86355a6d41cb37cd4e9dc3e25954678fa6ea51ac098efc040372b88316a099b1be3b1e3c947a7f5dda765b39a6ad59fb98750cbb11e885')
ON DUPLICATE KEY UPDATE `username`=`username`;

COMMIT;
