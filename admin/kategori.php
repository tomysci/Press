<?php
require_once __DIR__ . '/../config.php';
admin_check();

$db = db();
$act = $_GET['act'] ?? 'list';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// -----------------------------------------------------------------------------
// AKSI: HAPUS KATEGORI
// -----------------------------------------------------------------------------
if ($act === 'hapus' && $id > 0) {
    // Cek apakah ada buku yang memakai kategori ini
    $check = $db->prepare("SELECT COUNT(*) FROM buku WHERE kategori_id = :id");
    $check->execute([':id' => $id]);
    $count = (int)$check->fetchColumn();

    if ($count > 0) {
        flash_set('error', "Kategori tidak dapat dihapus karena masih digunakan oleh $count judul buku!");
    } else {
        $del = $db->prepare("DELETE FROM kategori WHERE id = :id");
        $del->execute([':id' => $id]);
        flash_set('success', 'Kategori berhasil dihapus.');
    }
    header('Location: ' . base_url('admin/kategori.php'));
    exit;
}

// -----------------------------------------------------------------------------
// AKSI: SIMPAN DATA (TAMBAH / EDIT)
// -----------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = trim($_POST['nama'] ?? '');

    if ($nama === '') {
        flash_set('error', 'Nama kategori tidak boleh kosong!');
    } else {
        if ($act === 'edit' && $id > 0) {
            $stmt = $db->prepare("UPDATE kategori SET nama = :nama WHERE id = :id");
            $stmt->execute([':nama' => $nama, ':id' => $id]);
            flash_set('success', 'Kategori berhasil diperbarui.');
        } else {
            $stmt = $db->prepare("INSERT INTO kategori (nama) VALUES (:nama)");
            $stmt->execute([':nama' => $nama]);
            flash_set('success', 'Kategori baru berhasil ditambahkan.');
        }
        header('Location: ' . base_url('admin/kategori.php'));
        exit;
    }
}

// Data edit jika act=edit
$edit_data = null;
if ($act === 'edit' && $id > 0) {
    $st = $db->prepare("SELECT * FROM kategori WHERE id = :id");
    $st->execute([':id' => $id]);
    $edit_data = $st->fetch();
}

// Ambil list semua kategori beserta jumlah buku
$list = $db->query("
    SELECT k.*, COUNT(b.id) AS total_buku 
    FROM kategori k 
    LEFT JOIN buku b ON b.kategori_id = k.id 
    GROUP BY k.id 
    ORDER BY k.nama ASC
")->fetchAll();

render_header('Kelola Kategori', 'Manajemen Kategori Keilmuan Penerbit AISU', 'admin/kategori.php');
?>

<div class="page-title-box" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
  <div>
    <h1 class="page-title">Manajemen Kategori Buku</h1>
    <div class="page-subtitle">Kelola taksonomi bidang keilmuan buku terbitan AISU</div>
  </div>
  <a href="<?= base_url('admin/index.php') ?>" class="btn">&larr; Kembali ke Dashboard</a>
</div>

<div style="display:grid;grid-template-columns:1fr;gap:12px;">
  <!-- Form Tambah / Edit -->
  <div style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;">
    <h2 style="color:#38bdf8;font-size:11px;font-weight:bold;margin-bottom:8px;">
      <?= $edit_data ? 'Edit Kategori: ' . sanitize($edit_data['nama']) : '+ Tambah Kategori Baru' ?>
    </h2>
    <form method="POST" action="">
      <div class="form-group">
        <label>Nama Kategori Keilmuan: *</label>
        <div style="display:flex;gap:6px;">
          <input type="text" name="nama" class="form-control" value="<?= sanitize($edit_data['nama'] ?? '') ?>" required placeholder="Contoh: Rekayasa Komputasi & Grafika">
          <button type="submit" class="btn btn-primary" style="white-space:nowrap;"><?= $edit_data ? 'Simpan' : '+ Tambah' ?></button>
          <?php if ($edit_data): ?>
            <a href="<?= base_url('admin/kategori.php') ?>" class="btn">Batal</a>
          <?php endif; ?>
        </div>
      </div>
    </form>
  </div>

  <!-- Tabel List Kategori -->
  <div style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;">
    <h2 style="color:#f1f5f9;font-size:11px;font-weight:bold;margin-bottom:6px;">Daftar Kategori Terdaftar</h2>
    
    <?php if (empty($list)): ?>
      <p style="color:#94a3b8;padding:8px;text-align:center;">Belum ada kategori terdaftar.</p>
    <?php else: ?>
      <div style="overflow-x:auto;">
        <table class="table-data">
          <thead>
            <tr>
              <th style="width:40px;">ID</th>
              <th>Nama Kategori</th>
              <th style="width:100px;">Jumlah Buku</th>
              <th style="width:110px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($list as $item): ?>
              <tr>
                <td><?= $item['id'] ?></td>
                <td><strong><?= sanitize($item['nama']) ?></strong></td>
                <td><span style="color:#38bdf8;"><?= (int)$item['total_buku'] ?> Judul</span></td>
                <td>
                  <a href="<?= base_url('admin/kategori.php?act=edit&id=' . $item['id']) ?>" class="btn" style="padding:2px 5px;">Edit</a>
                  <a href="<?= base_url('admin/kategori.php?act=hapus&id=' . $item['id']) ?>" class="btn btn-danger" style="padding:2px 5px;" onclick="return confirm('Hapus kategori ini?')">Hapus</a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </div>
</div>

<?php render_footer(); ?>
