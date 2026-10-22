-- ==========================================================
-- Database Schema: Penerbit Asosiasi Informatika Sumatera Utara (AISU)
-- Platform: MySQL / MariaDB (PHP 7.4+ PDO)
-- Database Name: aisu_publisher
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `aisu_publisher` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `aisu_publisher`;

-- ----------------------------------------------------------
-- Tabel 1: kategori
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `buku`;
DROP TABLE IF EXISTS `kategori`;

CREATE TABLE `kategori` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Tabel 2: buku
-- ----------------------------------------------------------
CREATE TABLE `buku` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kategori_id` INT NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `penulis` VARCHAR(255) NOT NULL,
  `editor` VARCHAR(255) DEFAULT NULL,
  `halaman` INT DEFAULT NULL,
  `isbn` VARCHAR(50) DEFAULT NULL,
  `harga` INT NOT NULL DEFAULT 0,
  `sinopsis` TEXT DEFAULT NULL,
  `keterangan` TEXT DEFAULT NULL,
  `cover` VARCHAR(255) DEFAULT NULL,
  `link_tokopedia` VARCHAR(255) DEFAULT NULL,
  `link_shopee` VARCHAR(255) DEFAULT NULL,
  `link_google_book` VARCHAR(255) DEFAULT NULL,
  `link_google_play` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_buku_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Data Dummy: Kategori
-- ----------------------------------------------------------
INSERT INTO `kategori` (`id`, `nama`) VALUES
(1, 'Informatika & Pemrograman'),
(2, 'Kecerdasan Buatan & Data'),
(3, 'Jaringan & Keamanan Siber'),
(4, 'Sains & Metodologi Riset');

-- ----------------------------------------------------------
-- Data Dummy: 8 Buku AISU
-- ----------------------------------------------------------
INSERT INTO `buku` (
  `id`, `kategori_id`, `judul`, `penulis`, `editor`, `halaman`, `isbn`, `harga`,
  `sinopsis`, `keterangan`, `cover`,
  `link_tokopedia`, `link_shopee`, `link_google_book`, `link_google_play`, `created_at`
) VALUES
(
  1, 1,
  'Fondasi Algoritma dan Pemrograman Modern',
  'Dr. Tomy Satria Alasi, M.Kom.',
  'Ir. Surya Dharma, M.T.',
  248, '978-623-98765-0-1', 85000,
  'Buku ini mengupas struktur logika dasar pemrograman komputasional, analisis efisiensi asimtotik Big-O, serta penerapan paradigma berorientasi objek dalam pemecahan masalah rekayasa digital.',
  'Cetakan Pertama, Kertas Bookpaper 72gr, Softcover Matte.',
  'cover_buku_1.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-01-10 08:30:00'
),
(
  2, 2,
  'Penerapan Machine Learning untuk Klasifikasi Data Medis',
  'Rina Marlina, M.Kom. & Tim Riset AISU',
  'Dr. Hendra Gunawan, S.Kom., M.Cs.',
  192, '978-623-98765-1-8', 78000,
  'Panduan komprehensif implementasi algoritma Support Vector Machine, Random Forest, dan Deep Neural Networks pada dataset biosinyal serta citra medis radiologi.',
  'Dilengkapi studi kasus Python dan dataset terbuka repository AISU.',
  'cover_buku_2.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-01-18 10:15:00'
),
(
  3, 3,
  'Arsitektur Keamanan Jaringan dan Kriptografi Terapan',
  'Muhammad Fadhil Siregar, S.Kom., M.T.',
  'Dr. Tomy Satria Alasi, M.Kom.',
  280, '978-623-98765-2-5', 95000,
  'Membahas mitigasi serangan siber pada infrastruktur enterprise, konfigurasi firewall berlapis, implementasi protokol TLS 1.3, dan algoritma enkripsi modern.',
  'Rekomendasi bagi praktisi DevOps, Network Engineer, dan akademisi.',
  'cover_buku_3.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-02-02 09:00:00'
),
(
  4, 1,
  'Rekayasa Web Berperforma Tinggi Tanpa Framework',
  'Ahmad Fauzi Lubis, M.Kom.',
  'Rina Marlina, M.Kom.',
  210, '978-623-98765-3-2', 72000,
  'Eksplorasi teknik optimasi server native PHP, tuning basis data relasional, pemangkasan latency TTFB, dan prinsip arsitektur minimalis berkecepatan tinggi.',
  'Sangat aplikatif untuk pengembang sistem berskala jutaan hits.',
  'cover_buku_4.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-02-14 14:20:00'
),
(
  5, 4,
  'Metodologi Penelitian Terapan Bidang Informatika',
  'Prof. Dr. Ir. H. M. Zarlis, M.Sc.',
  'Dr. Tomy Satria Alasi, M.Kom.',
  320, '978-623-98765-4-9', 110000,
  'Buku rujukan utama penyusunan skripsi, tesis, dan disertasi ilmu komputer. Membahas formulasi masalah, triangulasi data, pengujian hipotesis, dan publikasi jurnal bereputasi.',
  'Edisi Kedua yang diperkaya dengan etika penggunaan AI dalam riset.',
  'cover_buku_5.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-03-01 11:00:00'
),
(
  6, 3,
  'Internet of Things (IoT) Berbasis Mikrokontroler ESP32',
  'Budi Santoso, M.T. & Doni Siregar, S.T.',
  'Ir. Surya Dharma, M.T.',
  230, '978-623-98765-5-6', 82000,
  'Panduan langkah demi langkah merancang perangkat pintar berbasis ESP32, sensor industri, protokol MQTT, dan integrasi dashboard cloud telemetri.',
  'Disertai skema rangkaian elektronika dan barcode unduhan source code.',
  'cover_buku_6.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-03-12 16:45:00'
),
(
  7, 2,
  'Analisis Big Data dan Visualisasi Intelijen Bisnis',
  'Dewi Sartika Harahap, S.Kom., M.Kom.',
  'Dr. Hendra Gunawan, S.Kom., M.Cs.',
  264, '978-623-98765-6-3', 89000,
  'Teknik pengolahan data tabular volume besar, transformasi data ETL, pemodelan analitik prediktif, dan penyajian insight visual interaktif bagi pengambil keputusan.',
  'Cocok untuk mahasiswa Sains Data dan praktisi Business Intelligence.',
  'cover_buku_7.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-03-25 13:10:00'
),
(
  8, 4,
  'Etika Profesi, Hak Cipta, dan Regulasi Siber Indonesia',
  'Drs. Mahyuddin Rambe, S.H., M.H.',
  'Dr. Tomy Satria Alasi, M.Kom.',
  175, '978-623-98765-7-0', 65000,
  'Kajian komprehensif aspek hukum Undang-Undang ITE, pelindungan data pribadi (UU PDP), hak kekayaan intelektual (HAKI) perangkat lunak, dan kode etik profesional TI.',
  'Wajib dimiliki oleh pimpinan startup, insinyur perangkat lunak, dan konsultan TI.',
  'cover_buku_8.png',
  'https://www.tokopedia.com', 'https://shopee.co.id', 'https://books.google.co.id', 'https://play.google.com/store/books',
  '2026-04-05 10:00:00'
);
