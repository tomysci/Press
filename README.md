# Penerbit Asosiasi Informatika Sumatera Utara (AISU)
### Aplikasi Web Native PHP 7.4 Sangat Ringan (Tanpa Framework)

Aplikasi web portal penerbit buku untuk **Asosiasi Informatika Sumatera Utara (AISU)** yang dibangun secara murni menggunakan **Native PHP 7.4+** dan **PDO MySQL**, tanpa framework (No Laravel/Yii) dan tanpa library CSS/JS (No Bootstrap/Tailwind/jQuery/React).

Dirancang khusus dengan prioritas **kecepatan loading ekstrem**, **SEO maksimal**, konsistensi tipografi (maksimal 11px), dan tanpa animasi sama sekali sesuai standar minimalis performa tinggi.

---

## 1. Persyaratan Sistem (System Requirements)
- Web Server: Apache 2.4+ (dengan modul `mod_rewrite` aktif) atau Nginx.
- PHP: Versi 7.4, 8.0, 8.1, 8.2, atau 8.3.
- Ekstensi PHP: `pdo_mysql`, `gd` (untuk generator cover otomatis), `mbstring`, `session`.
- Database: MySQL 5.7+ atau MariaDB 10.3+.

---

## 2. Struktur Direktori Proyek
```text
/
├── config.php          # Konfigurasi DB, kredensial, SEO, dan helper fungsi
├── index.php           # Beranda (6–8 buku terbaru + profil AISU)
├── katalog.php         # Katalog lengkap (pencarian judul, filter kategori, sorting, pagination)
├── detail.php          # Rincian buku, Schema.org Book JSON-LD, link marketplace & WhatsApp
├── pengiriman.php      # Informasi ekspedisi, lead time, pengemasan, garansi
├── tentang.php         # Profil penerbit AISU, visi misi, fokus ilmu, pengajuan naskah
├── sitemap.php         # Dynamic XML Sitemap untuk mesin pencari
├── robots.txt          # Aturan indexing crawler Googlebot
├── .htaccess           # Pretty URL, proteksi file penting, browser caching
├── admin/
│   ├── login.php       # Autentikasi session hardcoded
│   ├── index.php       # Dashboard & ringkasan statistik
│   ├── buku.php        # CRUD Buku + upload cover / auto-generate cover
│   ├── kategori.php    # CRUD Kategori keilmuan
│   └── logout.php      # Sesi keluar aman
├── uploads/cover/      # Folder penyimpanan file cover buku (+ .htaccess security)
├── assets/
│   └── style.css       # CSS murni minimalis (font <= 11px, zero animation)
└── sql/
    └── schema.sql      # Skema 2 tabel + 8 dummy buku AISU
```

---

## 3. Langkah Instalasi (Step-by-step Setup)

### Langkah 1: Buat Database MySQL
Buka phpMyAdmin atau terminal MySQL, lalu buat database baru:
```sql
CREATE DATABASE aisu_publisher CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Langkah 2: Import File SQL
Import file `sql/schema.sql` ke database `aisu_publisher`:
- Melalui phpMyAdmin: Pilih database `aisu_publisher` &rarr; Tab **Import** &rarr; Pilih file `sql/schema.sql` &rarr; Klik **Go**.
- Melalui Terminal / CLI:
```bash
mysql -u root -p aisu_publisher < sql/schema.sql
```
*File ini sudah mencakup 2 tabel (`kategori` dan `buku`) serta 8 data dummy buku bidang informatika dan sains.*

### Langkah 3: Sesuaikan `config.php`
Buka file `config.php` menggunakan teks editor dan sesuaikan kredensial basis data serta domain:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'aisu_publisher');
define('DB_USER', 'root');           // Ganti dengan username MySQL server Anda
define('DB_PASS', 'password_db_anda'); // Ganti dengan password MySQL server Anda

// Ganti dengan domain publik Anda (tanpa garis miring di akhir)
define('APP_URL', 'https://penerbit.aisu.or.id');
```

### Langkah 4: Set Permission Folder Upload Cover
Pastikan folder `uploads/cover/` dapat ditulisi (*writable*) oleh web server (Apache/Nginx/PHP-FPM):
```bash
chmod 755 uploads/cover/
# Atau jika web server berjalan di user www-data:
chown -R www-data:www-data uploads/cover/
```

---

## 4. Cara Mengganti Password Admin
Sesuai aturan tanpa tabel user, login admin diamankan menggunakan session hardcoded di `config.php`:
```php
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123'); // Ganti dengan password baru yang kuat
```
Akses panel admin di: `https://domain-anda.com/admin/login.php`

---

## 5. Cara Pengaturan Google Search Console & SEO

### Langkah 1: Isi Kode Verifikasi Google
1. Buka [Google Search Console](https://search.google.com/search-console).
2. Tambahkan properti dengan metode **URL prefix** (misal: `https://penerbit.aisu.or.id`).
3. Pilih metode verifikasi **HTML tag**. Salin nilai atribut `content` token verifikasi (misal: `abc123xyz...`).
4. Buka `config.php`, lalu masukkan token tersebut pada:
   ```php
   define('GOOGLE_SITE_VERIFICATION', 'abc123xyz...');
   ```
5. Simpan file, lalu klik tombol **Verify** di Google Search Console.

### Langkah 2: Submit Dynamic Sitemap
1. Pada menu Google Search Console, klik menu **Sitemaps**.
2. Masukkan URL: `sitemap.xml` (atau `sitemap.php`).
3. Klik **Submit**. Googlebot akan secara otomatis mengindeks seluruh halaman publik dan detail buku terbaru secara dinamis.

---

## 6. Fitur Unggulan
1. **Kecepatan Ekstrem:** Ukuran payload CSS < 3KB, tanpa framework, HTML semantik ringan.
2. **Auto-Generate Cover Buku (PHP GD):** Jika admin tidak mengunggah cover saat menambah buku, sistem secara otomatis merender cover berdesain navy elegan dengan teks judul dan nama penulis.
3. **Structured Data:** Schema.org `Book` JSON-LD tertanam pada setiap halaman detail buku untuk memunculkan rich snippet di hasil pencarian Google.
4. **Pemesanan Terintegrasi:** Dukungan tombol marketplace (Tokopedia, Shopee, Google Books, Google Play) serta tombol pesanan instan via WhatsApp resmi AISU (+62 821-6844-9797).
