<?php
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

<div class="hero-box">
  <p><strong>Selamat Datang di Penerbit Asosiasi Informatika Sumatera Utara (AISU)</strong></p>
  <p style="margin-top:4px;">Kami melayani penerbitan buku ilmiah, ajar, referensi, dan umum berkualitas tinggi dengan pengurusan ISBN resmi, tata letak profesional, serta distribusi digital & fisik.</p>
</div>

<div class="page-title-box" style="display:flex;justify-content:space-between;align-items:center;">
  <div>
    <h1 class="page-title">Buku Terbaru</h1>
    <div class="page-subtitle">Koleksi terbitan terbaru Penerbit AISU</div>
  </div>
  <a href="<?= base_url('katalog.php') ?>" class="btn">Lihat Semua Buku &rarr;</a>
</div>

<?php if (empty($buku_terbaru)): ?>
  <p style="padding:12px;text-align:center;color:#94a3b8;">Belum ada data buku yang diterbitkan.</p>
<?php else: ?>
  <div class="book-grid">
    <?php foreach ($buku_terbaru as $b): 
      $cover_file = $b['cover'] ? base_url('uploads/cover/' . $b['cover']) : base_url('assets/placeholder.png');
    ?>
      <article class="book-card">
        <a href="<?= base_url('detail.php?id=' . $b['id']) ?>" class="cover-wrap">
          <img src="<?= sanitize($cover_file) ?>" alt="Cover <?= sanitize($b['judul']) ?>" class="cover-img" loading="lazy" width="200" height="300">
        </a>
        <div class="book-info">
          <span class="book-cat"><?= sanitize($b['kategori_nama'] ?? 'Umum') ?></span>
          <h2 class="book-name">
            <a href="<?= base_url('detail.php?id=' . $b['id']) ?>"><?= sanitize($b['judul']) ?></a>
          </h2>
          <div class="book-author"><?= sanitize($b['penulis']) ?></div>
          <div class="book-price"><?= rupiah($b['harga']) ?></div>
        </div>
      </article>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<?php render_footer(); ?>
