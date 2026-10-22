<?php
require_once __DIR__ . '/config.php';

$db = db();

// Parameter GET
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$kategori_id = isset($_GET['kategori']) ? (int)$_GET['kategori'] : 0;
$sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'terbaru';
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$per_page = 8;
$offset = ($page - 1) * $per_page;

// Ambil semua kategori untuk filter dropdown
$stmt_kat = $db->query("SELECT * FROM kategori ORDER BY nama ASC");
$kategori_list = $stmt_kat->fetchAll();

// Bangun Query Filter
$where = [];
$params = [];

// Pencarian hanya berdasarkan Judul sesuai instruksi
if ($q !== '') {
    $where[] = "b.judul LIKE :q";
    $params[':q'] = '%' . $q . '%';
}

if ($kategori_id > 0) {
    $where[] = "b.kategori_id = :kat_id";
    $params[':kat_id'] = $kategori_id;
}

$where_sql = $where ? "WHERE " . implode(" AND ", $where) : "";

// Sorting
$order_by = "b.created_at DESC";
if ($sort === 'harga_asc') {
    $order_by = "b.harga ASC";
} elseif ($sort === 'harga_desc') {
    $order_by = "b.harga DESC";
} elseif ($sort === 'judul_asc') {
    $order_by = "b.judul ASC";
}

// Hitung total buku
$count_stmt = $db->prepare("SELECT COUNT(*) FROM buku b $where_sql");
$count_stmt->execute($params);
$total_rows = (int)$count_stmt->fetchColumn();
$total_pages = ceil($total_rows / $per_page);

// Ambil data buku
$query = "
    SELECT b.*, k.nama AS kategori_nama 
    FROM buku b 
    LEFT JOIN kategori k ON b.kategori_id = k.id 
    $where_sql 
    ORDER BY $order_by 
    LIMIT :limit OFFSET :offset
";
$stmt = $db->prepare($query);
foreach ($params as $key => $val) {
    $stmt->bindValue($key, $val);
}
$stmt->bindValue(':limit', $per_page, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$buku_list = $stmt->fetchAll();

// URL Query Builder untuk Pagination
function build_page_url($page_num) {
    $query = $_GET;
    $query['page'] = $page_num;
    return '?' . http_build_query($query);
}

render_header(
    'Katalog Buku Terbitan',
    'Katalog lengkap buku terbitan Penerbit AISU. Cari buku berdasarkan judul, filter kategori, dan temukan referensi ilmiah terbaik.',
    'katalog.php'
);
?>

<div class="page-title-box">
  <h1 class="page-title">Katalog Buku Terbitan</h1>
  <div class="page-subtitle">Menampilkan <?= $total_rows ?> judul buku terdaftar di Penerbit AISU</div>
</div>

<!-- Filter Bar -->
<form method="GET" action="katalog.php" class="filter-bar">
  <div style="flex:2;">
    <input type="text" name="q" value="<?= sanitize($q) ?>" placeholder="Cari berdasarkan judul buku..." class="form-control">
  </div>
  <div style="flex:1;">
    <select name="kategori" class="form-control">
      <option value="0">-- Semua Kategori --</option>
      <?php foreach ($kategori_list as $kat): ?>
        <option value="<?= $kat['id'] ?>" <?= $kategori_id == $kat['id'] ? 'selected' : '' ?>>
          <?= sanitize($kat['nama']) ?>
        </option>
      <?php endforeach; ?>
    </select>
  </div>
  <div style="flex:1;">
    <select name="sort" class="form-control">
      <option value="terbaru" <?= $sort === 'terbaru' ? 'selected' : '' ?>>Terbaru</option>
      <option value="harga_asc" <?= $sort === 'harga_asc' ? 'selected' : '' ?>>Harga Terendah</option>
      <option value="harga_desc" <?= $sort === 'harga_desc' ? 'selected' : '' ?>>Harga Tertinggi</option>
      <option value="judul_asc" <?= $sort === 'judul_asc' ? 'selected' : '' ?>>Judul A-Z</option>
    </select>
  </div>
  <div style="display:flex;gap:4px;">
    <button type="submit" class="btn btn-primary">Filter</button>
    <?php if ($q !== '' || $kategori_id > 0 || $sort !== 'terbaru'): ?>
      <a href="katalog.php" class="btn">Reset</a>
    <?php endif; ?>
  </div>
</form>

<?php if (empty($buku_list)): ?>
  <div style="padding:20px;text-align:center;background:#0d1a2b;border:1px solid #1a2f4c;">
    <p style="color:#f87171;">Tidak ditemukan buku yang sesuai dengan kriteria pencarian.</p>
    <p style="color:#94a3b8;margin-top:4px;">Silakan coba kata kunci judul lain atau pilih kategori Semua Kategori.</p>
  </div>
<?php else: ?>
  <div class="book-grid">
    <?php foreach ($buku_list as $b): 
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

  <!-- Pagination Sederhana -->
  <?php if ($total_pages > 1): ?>
    <div class="pagination">
      <?php if ($page > 1): ?>
        <a href="<?= build_page_url($page - 1) ?>">&laquo; Sebelumnya</a>
      <?php endif; ?>

      <?php for ($p = 1; $p <= $total_pages; $p++): ?>
        <?php if ($p == $page): ?>
          <span class="active"><?= $p ?></span>
        <?php else: ?>
          <a href="<?= build_page_url($p) ?>"><?= $p ?></a>
        <?php endif; ?>
      <?php endfor; ?>

      <?php if ($page < $total_pages): ?>
        <a href="<?= build_page_url($page + 1) ?>">Berikutnya &raquo;</a>
      <?php endif; ?>
    </div>
  <?php endif; ?>
<?php endif; ?>

<?php render_footer(); ?>
