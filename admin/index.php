<?php
require_once __DIR__ . '/../config.php';
admin_check();

$db = db();
$total_buku = (int)$db->query("SELECT COUNT(*) FROM buku")->fetchColumn();
$total_kategori = (int)$db->query("SELECT COUNT(*) FROM kategori")->fetchColumn();

// 5 buku terbaru
$stmt = $db->query("
    SELECT b.*, k.nama AS kategori_nama 
    FROM buku b 
    LEFT JOIN kategori k ON b.kategori_id = k.id 
    ORDER BY b.created_at DESC 
    LIMIT 5
");
$terbaru = $stmt->fetchAll();

render_header('Dashboard Admin', 'Panel Manajemen Penerbit AISU', 'admin/index.php');
?>

<div class="page-title-box" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
  <div>
    <h1 class="page-title">Panel Administrasi Penerbit AISU</h1>
    <div class="page-subtitle">Selamat datang, Administrator. Kelola basis data publikasi di sini.</div>
  </div>
  <div style="display:flex;gap:4px;">
    <a href="<?= base_url('admin/buku.php?act=tambah') ?>" class="btn btn-primary">+ Tambah Buku Baru</a>
    <a href="<?= base_url('admin/kategori.php') ?>" class="btn">Kelola Kategori</a>
    <a href="<?= base_url('admin/logout.php') ?>" class="btn btn-danger" onclick="return confirm('Yakin ingin logout?')">Logout</a>
  </div>
</div>

<!-- Ringkasan Statistik -->
<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;margin-bottom:14px;">
  <div style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;border-left:3px solid #38bdf8;">
    <div style="color:#94a3b8;font-size:10px;">TOTAL BUKU TERBIT</div>
    <div style="font-size:11px;font-weight:bold;color:#f1f5f9;margin-top:4px;"><?= $total_buku ?> Judul Buku</div>
    <div style="margin-top:6px;"><a href="<?= base_url('admin/buku.php') ?>" style="color:#38bdf8;">Lihat Daftar Buku &rarr;</a></div>
  </div>

  <div style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;border-left:3px solid #f59e0b;">
    <div style="color:#94a3b8;font-size:10px;">TOTAL KATEGORI</div>
    <div style="font-size:11px;font-weight:bold;color:#f1f5f9;margin-top:4px;"><?= $total_kategori ?> Kategori Keilmuan</div>
    <div style="margin-top:6px;"><a href="<?= base_url('admin/kategori.php') ?>" style="color:#f59e0b;">Lihat Kategori &rarr;</a></div>
  </div>

  <div style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;border-left:3px solid #34d399;">
    <div style="color:#94a3b8;font-size:10px;">STATUS SISTEM</div>
    <div style="font-size:11px;font-weight:bold;color:#34d399;margin-top:4px;">Aktif & Siap Produksi</div>
    <div style="margin-top:6px;"><a href="<?= base_url() ?>" target="_blank" style="color:#34d399;">Kunjungi Situs Publik &rarr;</a></div>
  </div>
</div>

<!-- 5 Buku Terbaru -->
<div style="background:#0d1a2b;border:1px solid #1a2f4c;padding:10px;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
    <h2 style="color:#38bdf8;font-size:11px;font-weight:bold;">5 Buku Terakhir Didaftarkan</h2>
    <a href="<?= base_url('admin/buku.php') ?>" style="color:#94a3b8;">Lihat Semua &rarr;</a>
  </div>

  <?php if (empty($terbaru)): ?>
    <p style="color:#94a3b8;padding:8px;text-align:center;">Belum ada buku terdaftar.</p>
  <?php else: ?>
    <div style="overflow-x:auto;">
      <table class="table-data">
        <thead>
          <tr>
            <th style="width:40px;">ID</th>
            <th>Judul Buku</th>
            <th>Kategori</th>
            <th>Penulis</th>
            <th>Harga</th>
            <th style="width:110px;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($terbaru as $row): ?>
            <tr>
              <td><?= $row['id'] ?></td>
              <td><strong><a href="<?= base_url('detail.php?id=' . $row['id']) ?>" target="_blank"><?= sanitize($row['judul']) ?></a></strong></td>
              <td><?= sanitize($row['kategori_nama'] ?? '-') ?></td>
              <td><?= sanitize($row['penulis']) ?></td>
              <td style="color:#f59e0b;"><?= rupiah($row['harga']) ?></td>
              <td>
                <a href="<?= base_url('admin/buku.php?act=edit&id=' . $row['id']) ?>" class="btn" style="padding:2px 5px;">Edit</a>
                <a href="<?= base_url('admin/buku.php?act=hapus&id=' . $row['id']) ?>" class="btn btn-danger" style="padding:2px 5px;" onclick="return confirm('Hapus buku ini?')">Hapus</a>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  <?php endif; ?>
</div>

<?php render_footer(); ?>
