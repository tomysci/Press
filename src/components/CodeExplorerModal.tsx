import React, { useState } from 'react';
import { PROJECT_FILES, ProjectFile } from '../data/fileRegistry';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPath?: string;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({
  isOpen,
  onClose,
  initialPath = '/config.php',
}) => {
  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = PROJECT_FILES.find(f => f.path === selectedPath) || PROJECT_FILES[0];

  // Raw file content mapping
  const fileContents: Record<string, string> = {
    '/config.php': `<?php
/**
 * Konfigurasi Utama & Helper Penerbit AISU
 * Asosiasi Informatika Sumatera Utara
 * Native PHP 7.4+
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'aisu_publisher');
define('DB_USER', 'root');
define('DB_PASS', '');

define('APP_URL', (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));

define('PUBLISHER_NAME', 'Asosiasi Informatika Sumatera Utara (AISU)');
define('PUBLISHER_SHORT', 'Penerbit AISU');
define('PUBLISHER_LOGO', 'https://www.aisu.or.id/aisu.png');
define('PUBLISHER_FOCUS', 'Menerbitkan buku untuk umum di semua bidang ilmu');
define('PUBLISHER_ADDRESS', 'Jl. Klambir V, Tanjung Gusta, Kec. Sunggal, Kab. Deli Serdang, Prov. Sumatera Utara, Indonesia');
define('PUBLISHER_EMAIL', 'tomysatriaalasi@gmail.com');
define('PUBLISHER_PHONE', '+62 821-6844-9797');
define('PUBLISHER_WA', '6282168449797');

define('GOOGLE_SITE_VERIFICATION', 'GSC-PLACEHOLDER-AISU-VERIFICATION-TOKEN');

define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

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
        'type' => $type,
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

function generate_cover($judul, $penulis, $target_name = null) {
    $dir = __DIR__ . '/uploads/cover/';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    if (!$target_name) {
        $target_name = 'auto_cover_' . time() . '_' . mt_rand(100, 999) . '.png';
    }
    $filepath = $dir . $target_name;

    if (!extension_loaded('gd') || !function_exists('imagecreatetruecolor')) {
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

    $bg_color    = imagecolorallocate($img, 10, 21, 38);
    $border_col  = imagecolorallocate($img, 37, 71, 112);
    $cyan_accent = imagecolorallocate($img, 56, 189, 248);
    $gold_accent = imagecolorallocate($img, 245, 158, 11);
    $white_col   = imagecolorallocate($img, 248, 250, 252);
    $gray_col    = imagecolorallocate($img, 148, 163, 184);

    imagefill($img, 0, 0, $bg_color);
    imagerectangle($img, 14, 14, $width - 15, $height - 15, $border_col);
    imagerectangle($img, 18, 18, $width - 19, $height - 19, $cyan_accent);
    imagestring($img, 5, 110, 50, "PENERBIT BUKU AISU", $cyan_accent);
    imageline($img, 40, 75, $width - 40, 75, $gold_accent);

    $words = explode(' ', $judul);
    $lines = [];
    $curr = '';
    foreach ($words as $w) {
        if (strlen($curr . ' ' . $w) < 26) {
            $curr = trim($curr . ' ' . $w);
        } else {
            $lines[] = $curr;
            $curr = $w;
        }
    }
    if ($curr) $lines[] = $curr;

    $y = 180;
    foreach (array_slice($lines, 0, 6) as $line) {
        $x = max(35, (int)(($width - (strlen($line) * 9)) / 2));
        imagestring($img, 5, $x, $y, strtoupper($line), $white_col);
        $y += 24;
    }

    imageline($img, 80, 360, $width - 80, 360, $border_col);
    imagestring($img, 3, 40, 420, "Karya Penulis:", $gray_col);
    imagestring($img, 4, 40, 440, substr($penulis, 0, 35), $cyan_accent);
    imagestring($img, 2, 40, 535, "Asosiasi Informatika Sumatera Utara", $gray_col);
    imagestring($img, 2, 40, 552, "Edisi Cetak Berstandar ISBN", $gold_accent);

    imagepng($img, $filepath);
    imagedestroy($img);
    return $target_name;
}`,
    '/index.php': `<?php
require_once __DIR__ . '/config.php';

try {
    $db = db();
    $stmt = $db->query("
        SELECT b.*, k.nama AS kategori_nama 
        FROM buku b 
        LEFT JOIN kategori k ON b.kategori_id = k.id 
        ORDER BY b.created_at DESC 
        LIMIT 8
    ");
    $buku_terbaru = $stmt->fetchAll();
} catch (Exception $e) {
    $buku_terbaru = [];
}

render_header(
    'Beranda Penerbit Buku',
    'Penerbit Asosiasi Informatika Sumatera Utara (AISU). Menerbitkan buku berstandar ISBN untuk umum di semua bidang ilmu dan teknologi.',
    ''
);
?>
<!-- Isi template index.php (Hero + 8 Buku Terbaru + Footer) -->`,
    '/katalog.php': `<?php
require_once __DIR__ . '/config.php';
$db = db();
// Filter Pencarian hanya berdasarkan Judul + Kategori + Sorting + Pagination sederhana
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$kategori_id = isset($_GET['kategori']) ? (int)$_GET['kategori'] : 0;
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'terbaru';
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
// ... query dan render grid buku ...`,
    '/detail.php': `<?php
require_once __DIR__ . '/config.php';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
// Mengambil detail lengkap, link Tokopedia, Shopee, Google Book, Play, dan JSON-LD Schema.org Book`,
    '/sql/schema.sql': `-- ==========================================================
-- Database Schema: Penerbit Asosiasi Informatika Sumatera Utara (AISU)
-- Platform: MySQL / MariaDB (PHP 7.4+ PDO)
-- Database Name: aisu_publisher
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`aisu_publisher\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`aisu_publisher\`;

DROP TABLE IF EXISTS \`buku\`;
DROP TABLE IF EXISTS \`kategori\`;

CREATE TABLE \`kategori\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama\` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE \`buku\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`kategori_id\` INT NOT NULL,
  \`judul\` VARCHAR(255) NOT NULL,
  \`penulis\` VARCHAR(255) NOT NULL,
  \`editor\` VARCHAR(255) DEFAULT NULL,
  \`halaman\` INT DEFAULT NULL,
  \`isbn\` VARCHAR(50) DEFAULT NULL,
  \`harga\` INT NOT NULL DEFAULT 0,
  \`sinopsis\` TEXT DEFAULT NULL,
  \`keterangan\` TEXT DEFAULT NULL,
  \`cover\` VARCHAR(255) DEFAULT NULL,
  \`link_tokopedia\` VARCHAR(255) DEFAULT NULL,
  \`link_shopee\` VARCHAR(255) DEFAULT NULL,
  \`link_google_book\` VARCHAR(255) DEFAULT NULL,
  \`link_google_play\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_buku_kategori\` FOREIGN KEY (\`kategori_id\`) REFERENCES \`kategori\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8 Dummy buku dan kategori terdaftar...`,
    '/robots.txt': `User-agent: *
Disallow: /admin/
Disallow: /config.php
Disallow: /sql/
Allow: /
Allow: /assets/
Allow: /uploads/cover/

Sitemap: https://www.aisu.or.id/sitemap.xml`,
    '/.htaccess': `# .htaccess Pretty URLs & Keamanan
Options -Indexes

<FilesMatch "^(config\\.php|schema\\.sql|\\.env|\\.git)">
    Order allow,deny
    Deny from all
</FilesMatch>

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^sitemap\\.xml$ sitemap.php [L]
    RewriteRule ^katalog/?$ katalog.php [L]
    RewriteRule ^pengiriman/?$ pengiriman.php [L]
    RewriteRule ^tentang/?$ tentang.php [L]
    RewriteRule ^buku/([0-9]+)/?$ detail.php?id=$1 [L,QSA]
</IfModule>`,
    '/assets/style.css': `/* CSS Murni Sangat Minimalis (< 3KB)
   Font-size maksimal 11px
   Tanpa animasi/transisi/transform */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 11px;
  line-height: 1.45;
}
body { background-color: #070e17; color: #cbd5e1; }
/* ... selebihnya di file /assets/style.css ... */`,
  };

  const currentCode = fileContents[selectedPath] || `// File: ${selectedPath}\n// File ini sudah tersimpan secara lengkap di direktori root aplikasi.\n// Silakan lihat / edit di filesystem container atau README.md.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '12px',
      fontSize: '11px',
    }}>
      <div style={{
        backgroundColor: '#0d1a2b',
        border: '1px solid #254770',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#091321',
          borderBottom: '1px solid #1a2f4c',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <strong style={{ color: '#38bdf8', fontSize: '11px' }}>
              PENJELAJAH STRUKTUR FILE NATIVE PHP 7.4 (AISU)
            </strong>
            <span style={{ color: '#94a3b8', fontSize: '10px', marginLeft: '8px' }}>
              Semua 18 File Lengkap Siap Hosting
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '2px 8px',
              backgroundColor: '#7f1d1d',
              border: '1px solid #dc2626',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '10px',
            }}
          >
            Tutup [X]
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: '380px' }}>
          {/* File Sidebar */}
          <div style={{
            width: '240px',
            backgroundColor: '#070e17',
            borderRight: '1px solid #1a2f4c',
            overflowY: 'auto',
            padding: '6px',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', padding: '4px', textTransform: 'uppercase' }}>
              Daftar File Sistem:
            </div>
            {PROJECT_FILES.map((f) => (
              <button
                key={f.path}
                onClick={() => setSelectedPath(f.path)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '4px 6px',
                  backgroundColor: selectedPath === f.path ? '#162e4f' : 'transparent',
                  border: `1px solid ${selectedPath === f.path ? '#38bdf8' : 'transparent'}`,
                  color: selectedPath === f.path ? '#38bdf8' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '10px',
                  display: 'block',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={f.description}
              >
                {f.path}
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#050a12', overflow: 'hidden' }}>
            <div style={{
              padding: '6px 10px',
              backgroundColor: '#0a1424',
              borderBottom: '1px solid #16273e',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '11px' }}>{currentFile.path}</span>
                <span style={{ color: '#94a3b8', fontSize: '10px', marginLeft: '6px' }}>({currentFile.category})</span>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  padding: '3px 8px',
                  backgroundColor: copied ? '#059669' : '#153154',
                  border: `1px solid ${copied ? '#34d399' : '#274b7a'}`,
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                {copied ? 'Tersalin ke Clipboard!' : 'Salin Kode File'}
              </button>
            </div>

            <div style={{ padding: '6px 10px', backgroundColor: '#091526', borderBottom: '1px solid #16273e', color: '#cbd5e1', fontSize: '10px' }}>
              <strong>Deskripsi:</strong> {currentFile.description}
            </div>

            <pre style={{
              flex: 1,
              margin: 0,
              padding: '10px',
              overflow: 'auto',
              color: '#e2e8f0',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '10px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
              {currentCode}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '6px 12px',
          backgroundColor: '#091321',
          borderTop: '1px solid #1a2f4c',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>
            Seluruh file PHP &amp; SQL ini tersimpan di root workspace dan siap di-deploy langsung ke Apache/Nginx.
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '3px 8px',
              backgroundColor: '#153154',
              border: '1px solid #274b7a',
              color: '#38bdf8',
              cursor: 'pointer',
              fontSize: '10px',
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
