<?php
require_once __DIR__ . '/../config.php';
admin_check();

$db = db();
$act = $_GET['act'] ?? 'list';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Ambil semua kategori untuk form
$stmt_kat = $db->query("SELECT * FROM kategori ORDER BY nama ASC");
$kategori_list = $stmt_kat->fetchAll();

// -----------------------------------------------------------------------------
// AKSI: HAPUS BUKU
// -----------------------------------------------------------------------------
if ($act === 'hapus' && $id > 0) {
    // Ambil info cover lama
    $st = $db->prepare("SELECT cover FROM buku WHERE id = :id");
    $st->execute([':id' => $id]);
    $cover = $st->fetchColumn();

    $del = $db->prepare("DELETE FROM buku WHERE id = :id");
    $del->execute([':id' => $id]);

    if ($cover && file_exists(__DIR__ . '/../uploads/cover/' . $cover)) {
        @unlink(__DIR__ . '/../uploads/cover/' . $cover);
    }

    flash_set('success', 'Buku berhasil dihapus dari sistem.');
    header('Location: ' . base_url('admin/buku.php'));
    exit;
}

// -----------------------------------------------------------------------------
// AKSI: SIMPAN DATA (TAMBAH / EDIT)
// -----------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul            = trim($_POST['judul'] ?? '');
    $kategori_id      = (int)($_POST['kategori_id'] ?? 0);
    $penulis          = trim($_POST['penulis'] ?? '');
    $editor           = trim($_POST['editor'] ?? '');
    $halaman          = !empty($_POST['halaman']) ? (int)$_POST['halaman'] : null;
    $isbn             = trim($_POST['isbn'] ?? '');
    $harga            = (int)($_POST['harga'] ?? 0);
    $sinopsis         = trim($_POST['sinopsis'] ?? '');
    $keterangan       = trim($_POST['keterangan'] ?? '');
    $link_tokopedia   = trim($_POST['link_tokopedia'] ?? '');
    $link_shopee      = trim($_POST['link_shopee'] ?? '');
    $link_google_book = trim($_POST['link_google_book'] ?? '');
    $link_google_play = trim($_POST['link_google_play'] ?? '');
    $existing_cover   = trim($_POST['existing_cover'] ?? '');

    if ($judul === '' || $penulis === '' || $kategori_id <= 0) {
        flash_set('error', 'Judul, Kategori, dan Penulis wajib diisi!');
    } else {
        $cover_name = $existing_cover;

        // Cek apakah ada file cover yang diunggah
        if (isset($_FILES['cover_file']) && $_FILES['cover_file']['error'] === UPLOAD_ERR_OK) {
            $file_tmp  = $_FILES['cover_file']['tmp_name'];
            $file_name = $_FILES['cover_file']['name'];
            $file_ext  = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

            if (in_array($file_ext, ['jpg', 'jpeg', 'png'])) {
                $new_filename = 'cover_' . time() . '_' . mt_rand(100, 999) . '.' . $file_ext;
                $dest = __DIR__ . '/../uploads/cover/' . $new_filename;

                if (!is_dir(__DIR__ . '/../uploads/cover/')) {
                    @mkdir(__DIR__ . '/../uploads/cover/', 0755, true);
                }

                if (move_uploaded_file($file_tmp, $dest)) {
                    // Hapus cover lama jika ada dan file baru berhasil dipindah
                    if ($existing_cover && file_exists(__DIR__ . '/../uploads/cover/' . $existing_cover)) {
                        @unlink(__DIR__ . '/../uploads/cover/' . $existing_cover);
                    }
                    $cover_name = $new_filename;
                }
            } else {
                flash_set('error', 'Format cover harus berupa JPG atau PNG!');
            }
        } elseif (empty($cover_name)) {
            // Jika tidak ada cover lama dan tidak upload cover baru: generate otomatis via GD
            $cover_name = generate_cover($judul, $penulis);
        }

        if ($act === 'tambah') {
            $stmt = $db->prepare("
                INSERT INTO buku (
                    kategori_id, judul, penulis, editor, halaman, isbn, harga,
                    sinopsis, keterangan, cover, link_tokopedia, link_shopee,
                    link_google_book, link_google_play, created_at
                ) VALUES (
                    :kategori_id, :judul, :penulis, :editor, :halaman, :isbn, :harga,
                    :sinopsis, :keterangan, :cover, :link_tokopedia, :link_shopee,
                    :link_google_book, :link_google_play, NOW()
                )
            ");
            $stmt->execute([
                ':kategori_id'      => $kategori_id,
                ':judul'            => $judul,
                ':penulis'          => $penulis,
                ':editor'           => $editor ?: null,
                ':halaman'          => $halaman,
                ':isbn'             => $isbn ?: null,
                ':harga'            => $harga,
                ':sinopsis'         => $sinopsis ?: null,
                ':keterangan'       => $keterangan ?: null,
                ':cover'            => $cover_name ?: null,
                ':link_tokopedia'   => $link_tokopedia ?: null,
                ':link_shopee'      => $link_shopee ?: null,
                ':link_google_book' => $link_google_book ?: null,
                ':link_google_play' => $link_google_play ?: null,
            ]);
            flash_set('success', 'Buku baru berhasil ditambahkan.');
            header('Location: ' . base_url('admin/buku.php'));
            exit;
        } elseif ($act === 'edit' && $id > 0) {
            $stmt = $db->prepare("
                UPDATE buku SET 
                    kategori_id = :kategori_id,
                    judul = :judul,
                    penulis = :penulis,
                    editor = :editor,
                    halaman = :halaman,
                    isbn = :isbn,
                    harga = :harga,
                    sinopsis = :sinopsis,
                    keterangan = :keterangan,
                    cover = :cover,
                    link_tokopedia = :link_tokopedia,
                    link_shopee = :link_shopee,
                    link_google_book = :link_google_book,
                    link_google_play = :link_google_play
                WHERE id = :id
            ");
            $stmt->execute([
                ':kategori_id'      => $kategori_id,
                ':judul'            => $judul,
                ':penulis'          => $penulis,
                ':editor'           => $editor ?: null,
                ':halaman'          => $halaman,
                ':isbn'             => $isbn ?: null,
                ':harga'            => $harga,
                ':sinopsis'         => $sinopsis ?: null,
                ':keterangan'       => $keterangan ?: null,
                ':cover'            => $cover_name ?: null,
                ':link_tokopedia'   => $link_tokopedia ?: null,
                ':link_shopee'      => $link_shopee ?: null,
                ':link_google_book' => $link_google_book ?: null,
                ':link_google_play' => $link_google_play ?: null,
                ':id'               => $id,
            ]);
            flash_set('success', 'Perubahan data buku berhasil disimpan.');
            header('Location: ' . base_url('admin/buku.php'));
            exit;
        }
    }
}

// -----------------------------------------------------------------------------
// VIEW: FORM TAMBAH / EDIT
// -----------------------------------------------------------------------------
if ($act === 'tambah' || $act === 'edit') {
    $data = [
        'judul' => '', 'kategori_id' => 0, 'penulis' => '', 'editor' => '',
        'halaman' => '', 'isbn' => '', 'harga' => 0, 'sinopsis' => '',
        'keterangan' => '', 'cover' => '', 'link_tokopedia' => '',
        'link_shopee' => '', 'link_google_book' => '', 'link_google_play' => ''
    ];
    if ($act === 'edit' && $id > 0) {
        $st = $db->prepare("SELECT * FROM buku WHERE id = :id");
        $st->execute([':id' => $id]);
        $fetched = $st->fetch();
        if ($fetched) {
            $data = $fetched;
        } else {
            flash_set('error', 'Buku tidak ditemukan.');
            header('Location: ' . base_url('admin/buku.php'));
            exit;
        }
    }

    render_header(($act === 'tambah' ? 'Tambah Buku' : 'Edit Buku'), '', 'admin/buku.php');
    ?>

    <div class="page-title-box" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h1 class="page-title"><?= $act === 'tambah' ? 'Tambah Judul Buku Baru' : 'Edit Judul Buku: ' . sanitize($data['judul']) ?></h1>
        <div class="page-subtitle">Isi rincian buku secara lengkap. Jika cover kosong, sistem akan meng-generate otomatis.</div>
      </div>
      <a href="<?= base_url('admin/buku.php') ?>" class="btn">&larr; Batal & Kembali</a>
    </div>

    <form method="POST" enctype="multipart/form-data" style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;">
      <input type="hidden" name="existing_cover" value="<?= sanitize($data['cover']) ?>">

      <div class="form-grid-2">
        <div class="form-group">
          <label>Judul Buku: *</label>
          <input type="text" name="judul" class="form-control" value="<?= sanitize($data['judul']) ?>" required>
        </div>

        <div class="form-group">
          <label>Kategori Keilmuan: *</label>
          <select name="kategori_id" class="form-control" required>
            <option value="">-- Pilih Kategori --</option>
            <?php foreach ($kategori_list as $kat): ?>
              <option value="<?= $kat['id'] ?>" <?= $data['kategori_id'] == $kat['id'] ? 'selected' : '' ?>>
                <?= sanitize($kat['nama']) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="form-group">
          <label>Penulis: *</label>
          <input type="text" name="penulis" class="form-control" value="<?= sanitize($data['penulis']) ?>" required placeholder="Contoh: Dr. Tomy Satria Alasi, M.Kom.">
        </div>

        <div class="form-group">
          <label>Editor: (opsional)</label>
          <input type="text" name="editor" class="form-control" value="<?= sanitize($data['editor'] ?? '') ?>">
        </div>

        <div class="form-group">
          <label>Harga (Rp): *</label>
          <input type="number" name="harga" class="form-control" value="<?= (int)$data['harga'] ?>" required min="0">
        </div>

        <div class="form-group">
          <label>ISBN: (opsional)</label>
          <input type="text" name="isbn" class="form-control" value="<?= sanitize($data['isbn'] ?? '') ?>" placeholder="978-623-...">
        </div>

        <div class="form-group">
          <label>Jumlah Halaman: (opsional)</label>
          <input type="number" name="halaman" class="form-control" value="<?= $data['halaman'] ? (int)$data['halaman'] : '' ?>" min="1">
        </div>

        <div class="form-group">
          <label>Unggah Cover (JPG / PNG):</label>
          <input type="file" name="cover_file" accept=".jpg,.jpeg,.png" class="form-control">
          <div style="font-size:10px;color:#94a3b8;margin-top:2px;">
            Kosongkan jika ingin cover dibuat otomatis secara grafis oleh sistem AISU.
            <?php if (!empty($data['cover'])): ?>
              <br>Cover saat ini: <strong><?= sanitize($data['cover']) ?></strong>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <div class="form-group" style="margin-top:8px;">
        <label>Sinopsis Buku:</label>
        <textarea name="sinopsis" rows="4" class="form-control" placeholder="Tuliskan ringkasan isi buku..."><?= sanitize($data['sinopsis'] ?? '') ?></textarea>
      </div>

      <div class="form-group">
        <label>Keterangan Fisik / Cetak:</label>
        <input type="text" name="keterangan" class="form-control" value="<?= sanitize($data['keterangan'] ?? '') ?>" placeholder="Contoh: Cetakan Pertama, Bookpaper 72gr, Softcover">
      </div>

      <h3 style="color:#38bdf8;font-size:11px;margin:12px 0 6px;">Tautan Pembelian Marketplace</h3>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Link Tokopedia:</label>
          <input type="url" name="link_tokopedia" class="form-control" value="<?= sanitize($data['link_tokopedia'] ?? '') ?>" placeholder="https://tokopedia.com/...">
        </div>
        <div class="form-group">
          <label>Link Shopee:</label>
          <input type="url" name="link_shopee" class="form-control" value="<?= sanitize($data['link_shopee'] ?? '') ?>" placeholder="https://shopee.co.id/...">
        </div>
        <div class="form-group">
          <label>Link Google Books:</label>
          <input type="url" name="link_google_book" class="form-control" value="<?= sanitize($data['link_google_book'] ?? '') ?>" placeholder="https://books.google.co.id/...">
        </div>
        <div class="form-group">
          <label>Link Google Play Books:</label>
          <input type="url" name="link_google_play" class="form-control" value="<?= sanitize($data['link_google_play'] ?? '') ?>" placeholder="https://play.google.com/...">
        </div>
      </div>

      <div style="margin-top:12px;display:flex;gap:6px;">
        <button type="submit" class="btn btn-primary"><?= $act === 'tambah' ? 'Simpan Buku Baru' : 'Perbarui Data Buku' ?></button>
        <a href="<?= base_url('admin/buku.php') ?>" class="btn">Batal</a>
      </div>
    </form>

    <?php
    render_footer();
    exit;
}

// -----------------------------------------------------------------------------
// VIEW: LIST BUKU
// -----------------------------------------------------------------------------
$q = trim($_GET['q'] ?? '');
$kat_id = (int)($_GET['kategori'] ?? 0);

$where = [];
$params = [];
if ($q !== '') {
    $where[] = "b.judul LIKE :q";
    $params[':q'] = '%' . $q . '%';
}
if ($kat_id > 0) {
    $where[] = "b.kategori_id = :kat_id";
    $params[':kat_id'] = $kat_id;
}
$where_sql = $where ? "WHERE " . implode(" AND ", $where) : "";

$query = "
    SELECT b.*, k.nama AS kategori_nama 
    FROM buku b 
    LEFT JOIN kategori k ON b.kategori_id = k.id 
    $where_sql 
    ORDER BY b.created_at DESC
";
$stmt = $db->prepare($query);
$stmt->execute($params);
$buku_list = $stmt->fetchAll();

render_header('Kelola Buku', 'Daftar Manajemen Buku Penerbit AISU', 'admin/buku.php');
?>

<div class="page-title-box" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
  <div>
    <h1 class="page-title">Manajemen Buku Terbitan</h1>
    <div class="page-subtitle">Total: <?= count($buku_list) ?> buku ditemukan</div>
  </div>
  <div style="display:flex;gap:4px;">
    <a href="<?= base_url('admin/buku.php?act=tambah') ?>" class="btn btn-primary">+ Tambah Buku Baru</a>
    <a href="<?= base_url('admin/index.php') ?>" class="btn">&larr; Kembali Dashboard</a>
  </div>
</div>

<!-- Filter Sederhana -->
<form method="GET" action="buku.php" class="filter-bar">
  <div style="flex:2;">
    <input type="text" name="q" value="<?= sanitize($q) ?>" placeholder="Cari judul buku..." class="form-control">
  </div>
  <div style="flex:1;">
    <select name="kategori" class="form-control">
      <option value="0">-- Semua Kategori --</option>
      <?php foreach ($kategori_list as $kat): ?>
        <option value="<?= $kat['id'] ?>" <?= $kat_id == $kat['id'] ? 'selected' : '' ?>>
          <?= sanitize($kat['nama']) ?>
        </option>
      <?php endforeach; ?>
    </select>
  </div>
  <div style="display:flex;gap:4px;">
    <button type="submit" class="btn btn-primary">Cari</button>
    <?php if ($q !== '' || $kat_id > 0): ?>
      <a href="buku.php" class="btn">Reset</a>
    <?php endif; ?>
  </div>
</form>

<?php if (empty($buku_list)): ?>
  <div style="padding:16px;text-align:center;background:#0d1a2b;border:1px solid #1a2f4c;">
    <p style="color:#94a3b8;">Belum ada buku yang cocok dengan pencarian.</p>
  </div>
<?php else: ?>
  <div style="overflow-x:auto;">
    <table class="table-data">
      <thead>
        <tr>
          <th style="width:30px;">ID</th>
          <th style="width:45px;">Cover</th>
          <th>Judul Buku</th>
          <th>Kategori</th>
          <th>Penulis</th>
          <th>ISBN</th>
          <th>Harga</th>
          <th style="width:110px;">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($buku_list as $b): 
          $cover_file = $b['cover'] ? base_url('uploads/cover/' . $b['cover']) : base_url('assets/placeholder.png');
        ?>
          <tr>
            <td><?= $b['id'] ?></td>
            <td style="padding:2px;text-align:center;">
              <img src="<?= sanitize($cover_file) ?>" alt="Cover" style="width:32px;height:48px;object-fit:cover;margin:0 auto;border:1px solid #1a2f4c;">
            </td>
            <td>
              <strong><a href="<?= base_url('detail.php?id=' . $b['id']) ?>" target="_blank" title="Lihat di halaman publik"><?= sanitize($b['judul']) ?></a></strong>
            </td>
            <td><?= sanitize($b['kategori_nama'] ?? '-') ?></td>
            <td><?= sanitize($b['penulis']) ?></td>
            <td><?= sanitize($b['isbn'] ?? '-') ?></td>
            <td style="color:#f59e0b;font-weight:bold;"><?= rupiah($b['harga']) ?></td>
            <td>
              <a href="<?= base_url('admin/buku.php?act=edit&id=' . $b['id']) ?>" class="btn" style="padding:2px 5px;">Edit</a>
              <a href="<?= base_url('admin/buku.php?act=hapus&id=' . $b['id']) ?>" class="btn btn-danger" style="padding:2px 5px;" onclick="return confirm('Apakah Anda yakin ingin menghapus buku \'<?= addslashes($b['judul']) ?>\'?')">Hapus</a>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>

<?php render_footer(); ?>
