<?php
/**
 * Konfigurasi Utama & Helper Penerbit AISU
 * Asosiasi Informatika Sumatera Utara
 * Native PHP 7.4+
 */

// Mulai session jika belum aktif
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// -----------------------------------------------------------------------------
// KONFIGURASI BASIS DATA
// -----------------------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_NAME', 'aisu_publisher');
define('DB_USER', 'root');
define('DB_PASS', '');

// -----------------------------------------------------------------------------
// KONFIGURASI APLIKASI & PENERBIT
// -----------------------------------------------------------------------------
// Sesuaikan dengan domain live saat di-hosting, misal: https://penerbit.aisu.or.id
define('APP_URL', (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));

define('PUBLISHER_NAME', 'Asosiasi Informatika Sumatera Utara (AISU)');
define('PUBLISHER_SHORT', 'Penerbit AISU');
define('PUBLISHER_LOGO', 'https://www.aisu.or.id/aisu.png');
define('PUBLISHER_FOCUS', 'Menerbitkan buku untuk umum di semua bidang ilmu');
define('PUBLISHER_ADDRESS', 'Jl. Klambir V, Tanjung Gusta, Kec. Sunggal, Kab. Deli Serdang, Prov. Sumatera Utara, Indonesia');
define('PUBLISHER_EMAIL', 'tomysatriaalasi@gmail.com');
define('PUBLISHER_PHONE', '+62 821-6844-9797');
define('PUBLISHER_WA', '6282168449797');

// SEO & Google Search Console Verification Placeholder
define('GOOGLE_SITE_VERIFICATION', 'GSC-PLACEHOLDER-AISU-VERIFICATION-TOKEN');

// -----------------------------------------------------------------------------
// KREDENSIAL ADMIN (Hardcoded Session)
// Ganti kombinasi username dan password di bawah ini untuk keamanan produksi
// -----------------------------------------------------------------------------
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

// -----------------------------------------------------------------------------
// KONEKSI DATABASE (PDO Singleton)
// -----------------------------------------------------------------------------
function db() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die("Koneksi Database Gagal: " . htmlspecialchars($e->getMessage()));
        }
    }
    return $pdo;
}

// -----------------------------------------------------------------------------
// FUNGSI HELPER
// -----------------------------------------------------------------------------
function base_url($path = '') {
    $clean_path = ltrim($path, '/');
    return rtrim(APP_URL, '/') . ($clean_path ? '/' . $clean_path : '');
}

function sanitize($data) {
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

function rupiah($angka) {
    return 'Rp ' . number_format((float)$angka, 0, ',', '.');
}

function flash_set($type, $message) {
    $_SESSION['flash'] = [
        'type' => $type, // 'success' atau 'error'
        'message' => $message
    ];
}

function flash_get() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return '<div class="alert alert-' . sanitize($flash['type']) . '">' . sanitize($flash['message']) . '</div>';
    }
    return '';
}

function admin_logged_in() {
    return !empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function admin_check() {
    if (!admin_logged_in()) {
        flash_set('error', 'Silakan login terlebih dahulu untuk mengakses panel admin.');
        header('Location: ' . base_url('admin/login.php'));
        exit;
    }
}

/**
 * Otomatis generate cover buku menggunakan ekstensi PHP GD
 * Digunakan jika admin tidak mengunggah file JPG/PNG cover
 */
function generate_cover($judul, $penulis, $target_name = null) {
    $dir = __DIR__ . '/uploads/cover/';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }

    if (!$target_name) {
        $target_name = 'auto_cover_' . time() . '_' . mt_rand(100, 999) . '.png';
    }
    $filepath = $dir . $target_name;

    // Cek apakah ekstensi GD tersedia
    if (!extension_loaded('gd') || !function_exists('imagecreatetruecolor')) {
        // Fallback file placeholder SVG sederhana jika GD tidak aktif
        $svg_content = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
            <rect width="100%" height="100%" fill="#0a1526"/>
            <rect x="15" y="15" width="370" height="570" fill="none" stroke="#254770" stroke-width="2"/>
            <text x="200" y="80" fill="#38bdf8" font-size="16" font-family="sans-serif" text-anchor="middle" font-weight="bold">PENERBIT AISU</text>
            <text x="200" y="240" fill="#ffffff" font-size="20" font-family="sans-serif" text-anchor="middle" font-weight="bold">' . htmlspecialchars(substr($judul, 0, 35)) . '</text>
            <text x="200" y="480" fill="#94a3b8" font-size="14" font-family="sans-serif" text-anchor="middle">' . htmlspecialchars(substr($penulis, 0, 35)) . '</text>
        </svg>';
        $target_name = str_replace('.png', '.svg', $target_name);
        @file_put_contents($dir . $target_name, $svg_content);
        return $target_name;
    }

    $width = 400;
    $height = 600;
    $img = imagecreatetruecolor($width, $height);

    // Palet warna cover
    $bg_color    = imagecolorallocate($img, 10, 21, 38);   // Dark Navy #0a1526
    $border_col  = imagecolorallocate($img, 37, 71, 112);  // Navy Border
    $cyan_accent = imagecolorallocate($img, 56, 189, 248); // Cyan AISU
    $gold_accent = imagecolorallocate($img, 245, 158, 11); // Gold Accent
    $white_col   = imagecolorallocate($img, 248, 250, 252);
    $gray_col    = imagecolorallocate($img, 148, 163, 184);

    imagefill($img, 0, 0, $bg_color);

    // Frame tepi
    imagerectangle($img, 14, 14, $width - 15, $height - 15, $border_col);
    imagerectangle($img, 18, 18, $width - 19, $height - 19, $cyan_accent);

    // Logo & Header
    imagestring($img, 5, 110, 50, "PENERBIT BUKU AISU", $cyan_accent);
    imageline($img, 40, 75, $width - 40, 75, $gold_accent);

    // Judul buku (word wrap sederhana font bawaan GD 5)
    $words = explode(' ', $judul);
    $lines = [];
    $curr_line = '';
    foreach ($words as $w) {
        if (strlen($curr_line . ' ' . $w) < 26) {
            $curr_line = trim($curr_line . ' ' . $w);
        } else {
            $lines[] = $curr_line;
            $curr_line = $w;
        }
    }
    if ($curr_line) {
        $lines[] = $curr_line;
    }

    $y = 180;
    foreach (array_slice($lines, 0, 6) as $line) {
        $x = max(35, (int)(($width - (strlen($line) * 9)) / 2));
        imagestring($img, 5, $x, $y, strtoupper($line), $white_col);
        $y += 24;
    }

    // Pemisah dekoratif
    imageline($img, 80, 360, $width - 80, 360, $border_col);

    // Penulis
    imagestring($img, 3, 40, 420, "Karya Penulis:", $gray_col);
    imagestring($img, 4, 40, 440, substr($penulis, 0, 35), $cyan_accent);

    // Footer info
    imagestring($img, 2, 40, 535, "Asosiasi Informatika Sumatera Utara", $gray_col);
    imagestring($img, 2, 40, 552, "Edisi Cetak Berstandar ISBN", $gold_accent);

    imagepng($img, $filepath);
    imagedestroy($img);

    return $target_name;
}

// -----------------------------------------------------------------------------
// TEMPLATE HEADER & FOOTER (SEO Lengkap & Semantik HTML)
// -----------------------------------------------------------------------------
function render_header($title = '', $meta_desc = '', $canonical = '', $og_image = '', $extra_head = '') {
    $full_title = ($title ? $title . ' | ' : '') . PUBLISHER_NAME;
    $desc = $meta_desc ? $meta_desc : PUBLISHER_FOCUS . '. Temukan buku-buku ilmiah, informatika, dan ilmu pengetahuan umum dari Penerbit AISU.';
    $canonical_url = $canonical ? base_url($canonical) : base_url();
    $image_url = $og_image ? (strpos($og_image, 'http') === 0 ? $og_image : base_url('uploads/cover/' . $og_image)) : PUBLISHER_LOGO;
    ?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= sanitize($full_title) ?></title>
  <meta name="description" content="<?= sanitize($desc) ?>">
  <meta name="keywords" content="Penerbit AISU, Asosiasi Informatika Sumatera Utara, Penerbit Buku Medan, Buku Komputer, Buku Informatika, ISBN, Terbit Buku">
  <meta name="author" content="<?= sanitize(PUBLISHER_NAME) ?>">
  <meta name="robots" content="index, follow">
  <meta name="google-site-verification" content="<?= sanitize(GOOGLE_SITE_VERIFICATION) ?>">
  <meta name="geo.region" content="ID-SU">
  <meta name="geo.placename" content="Deli Serdang, Sumatera Utara, Indonesia">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?= sanitize($full_title) ?>">
  <meta property="og:description" content="<?= sanitize($desc) ?>">
  <meta property="og:url" content="<?= sanitize($canonical_url) ?>">
  <meta property="og:image" content="<?= sanitize($image_url) ?>">
  <meta property="og:site_name" content="<?= sanitize(PUBLISHER_NAME) ?>">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= sanitize($full_title) ?>">
  <meta name="twitter:description" content="<?= sanitize($desc) ?>">
  <meta name="twitter:image" content="<?= sanitize($image_url) ?>">

  <link rel="canonical" href="<?= sanitize($canonical_url) ?>">
  <link rel="stylesheet" href="<?= base_url('assets/style.css') ?>">
  <?= $extra_head ?>
</head>
<body>
  <header class="site-header">
    <div class="container header-wrap">
      <a href="<?= base_url() ?>" class="brand">
        <img src="<?= sanitize(PUBLISHER_LOGO) ?>" alt="Logo AISU" width="28" height="28">
        <div class="brand-text">
          <span class="brand-title"><?= sanitize(PUBLISHER_SHORT) ?></span>
          <span class="brand-sub">Asosiasi Informatika Sumatera Utara</span>
        </div>
      </a>
      <nav class="main-nav" aria-label="Menu Utama">
        <a href="<?= base_url() ?>">Home</a>
        <a href="<?= base_url('katalog.php') ?>">Katalog Buku</a>
        <a href="<?= base_url('pengiriman.php') ?>">Pengiriman</a>
        <a href="<?= base_url('tentang.php') ?>">Tentang</a>
        <?php if (admin_logged_in()): ?>
          <a href="<?= base_url('admin/index.php') ?>" style="border-color:#34d399;color:#34d399;">Admin Panel</a>
        <?php else: ?>
          <a href="<?= base_url('admin/login.php') ?>">Admin</a>
        <?php endif; ?>
      </nav>
    </div>
  </header>
  <main class="main-content">
    <div class="container">
      <?= flash_get() ?>
    <?php
}

function render_footer() {
    ?>
    </div>
  </main>
  <footer class="site-footer">
    <div class="container footer-wrap">
      <div class="footer-col">
        <div class="footer-title"><?= sanitize(PUBLISHER_NAME) ?></div>
        <p><?= sanitize(PUBLISHER_FOCUS) ?></p>
        <p style="margin-top:4px;">Alamat: <?= sanitize(PUBLISHER_ADDRESS) ?></p>
      </div>
      <div class="footer-col" style="max-width: 280px;">
        <div class="footer-title">Kontak & Pembelian</div>
        <p>Email: <a href="mailto:<?= sanitize(PUBLISHER_EMAIL) ?>"><?= sanitize(PUBLISHER_EMAIL) ?></a></p>
        <p>WhatsApp/Telp: <a href="https://wa.me/<?= sanitize(PUBLISHER_WA) ?>" target="_blank" rel="noopener"><?= sanitize(PUBLISHER_PHONE) ?></a></p>
        <p style="margin-top:4px;"><a href="<?= base_url('sitemap.php') ?>">Sitemap (XML)</a> | <a href="<?= base_url('robots.txt') ?>">robots.txt</a></p>
      </div>
    </div>
    <div class="container footer-bottom">
      &copy; <?= date('Y') ?> <?= sanitize(PUBLISHER_NAME) ?>. Hak Cipta Dilindungi Undang-Undang.
    </div>
  </footer>
</body>
</html>
    <?php
}
