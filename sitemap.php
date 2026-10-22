<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/xml; charset=utf-8');

$db = db();
$stmt = $db->query("SELECT id, created_at FROM buku ORDER BY created_at DESC");
$buku_list = $stmt->fetchAll();

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Halaman Statis -->
  <url>
    <loc><?= base_url() ?></loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc><?= base_url('katalog.php') ?></loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc><?= base_url('pengiriman.php') ?></loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc><?= base_url('tentang.php') ?></loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Halaman Detail Buku -->
  <?php foreach ($buku_list as $b): 
    $lastmod = date('Y-m-d', strtotime($b['created_at']));
  ?>
  <url>
    <loc><?= base_url('detail.php?id=' . $b['id']) ?></loc>
    <lastmod><?= $lastmod ?></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <?php endforeach; ?>
</urlset>
