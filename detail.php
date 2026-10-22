<?php
require_once __DIR__ . '/config.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    header('Location: ' . base_url('katalog.php'));
    exit;
}

$db = db();
$stmt = $db->prepare("
    SELECT b.*, k.nama AS kategori_nama 
    FROM buku b 
    LEFT JOIN kategori k ON b.kategori_id = k.id 
    WHERE b.id = :id 
    LIMIT 1
");
$stmt->execute([':id' => $id]);
$buku = $stmt->fetch();

if (!$buku) {
    render_header('Buku Tidak Ditemukan', '', 'katalog.php');
    echo '<div class="alert alert-error">Buku tidak ditemukan atau telah dihapus.</div>';
    echo '<p><a href="' . base_url('katalog.php') . '" class="btn">&larr; Kembali ke Katalog</a></p>';
    render_footer();
    exit;
}

$meta_desc = $buku['sinopsis'] ? substr(strip_tags($buku['sinopsis']), 0, 160) : ('Buku ' . $buku['judul'] . ' karya ' . $buku['penulis'] . ' diterbitkan oleh ' . PUBLISHER_NAME);
$cover_url = $buku['cover'] ? base_url('uploads/cover/' . $buku['cover']) : base_url('assets/placeholder.png');
$canonical_path = 'detail.php?id=' . $buku['id'];

// JSON-LD Schema.org Book
$json_ld = [
    "@context" => "https://schema.org",
    "@type" => "Book",
    "name" => $buku['judul'],
    "author" => [
        "@type" => "Person",
        "name" => $buku['penulis']
    ],
    "publisher" => [
        "@type" => "Organization",
        "name" => PUBLISHER_NAME,
        "logo" => [
            "@type" => "ImageObject",
            "url" => PUBLISHER_LOGO
        ]
    ],
    "isbn" => $buku['isbn'] ?? '',
    "numberOfPages" => (int)($buku['halaman'] ?? 0),
    "inLanguage" => "id",
    "image" => $cover_url,
    "description" => $meta_desc,
    "offers" => [
        "@type" => "Offer",
        "price" => (string)$buku['harga'],
        "priceCurrency" => "IDR",
        "availability" => "https://schema.org/InStock",
        "url" => base_url($canonical_path)
    ]
];
if (!empty($buku['editor'])) {
    $json_ld["editor"] = [
        "@type" => "Person",
        "name" => $buku['editor']
    ];
}
$schema_script = '<script type="application/ld+json">' . json_encode($json_ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';

render_header(
    $buku['judul'] . ' - ' . $buku['penulis'],
    $meta_desc,
    $canonical_path,
    $buku['cover'],
    $schema_script
);
?>

<div class="page-title-box">
  <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">
    <a href="<?= base_url() ?>">Home</a> &rsaquo; 
    <a href="<?= base_url('katalog.php') ?>">Katalog</a> &rsaquo; 
    <a href="<?= base_url('katalog.php?kategori=' . $buku['kategori_id']) ?>"><?= sanitize($buku['kategori_nama'] ?? 'Umum') ?></a> &rsaquo; 
    <span><?= sanitize($buku['judul']) ?></span>
  </div>
  <h1 class="page-title"><?= sanitize($buku['judul']) ?></h1>
  <div class="page-subtitle">Oleh: <?= sanitize($buku['penulis']) ?></div>
</div>

<article class="detail-layout">
  <div class="detail-cover">
    <div class="cover-wrap">
      <img src="<?= sanitize($cover_url) ?>" alt="Cover <?= sanitize($buku['judul']) ?>" class="cover-img" loading="lazy" width="240" height="360">
    </div>

    <!-- Harga -->
    <div style="background:#0e1b2c;border:1px solid #1a2f4c;padding:8px;text-align:center;margin-top:8px;">
      <div style="color:#94a3b8;font-size:10px;">Harga Resmi:</div>
      <div style="font-size:11px;font-weight:bold;color:#f59e0b;"><?= rupiah($buku['harga']) ?></div>
    </div>
  </div>

  <div class="detail-content">
    <h2 style="color:#38bdf8;margin-bottom:6px;font-size:11px;">Spesifikasi & Informasi Buku</h2>
    
    <table class="table-spec">
      <tr>
        <td class="label">Judul Lengkap</td>
        <td><strong><?= sanitize($buku['judul']) ?></strong></td>
      </tr>
      <tr>
        <td class="label">Penulis</td>
        <td><?= sanitize($buku['penulis']) ?></td>
      </tr>
      <?php if (!empty($buku['editor'])): ?>
      <tr>
        <td class="label">Editor</td>
        <td><?= sanitize($buku['editor']) ?></td>
      </tr>
      <?php endif; ?>
      <tr>
        <td class="label">Kategori</td>
        <td><?= sanitize($buku['kategori_nama'] ?? 'Umum') ?></td>
      </tr>
      <?php if (!empty($buku['isbn'])): ?>
      <tr>
        <td class="label">ISBN</td>
        <td><?= sanitize($buku['isbn']) ?></td>
      </tr>
      <?php endif; ?>
      <?php if (!empty($buku['halaman'])): ?>
      <tr>
        <td class="label">Jumlah Halaman</td>
        <td><?= (int)$buku['halaman'] ?> Halaman</td>
      </tr>
      <?php endif; ?>
      <tr>
        <td class="label">Penerbit</td>
        <td><?= sanitize(PUBLISHER_NAME) ?></td>
      </tr>
      <tr>
        <td class="label">Tahun Terbit</td>
        <td><?= date('d M Y', strtotime($buku['created_at'])) ?></td>
      </tr>
      <?php if (!empty($buku['keterangan'])): ?>
      <tr>
        <td class="label">Keterangan Cetak</td>
        <td><?= nl2br(sanitize($buku['keterangan'])) ?></td>
      </tr>
      <?php endif; ?>
    </table>

    <div style="margin-top:12px;">
      <h3 style="color:#38bdf8;margin-bottom:4px;font-size:11px;">Sinopsis Buku</h3>
      <div style="color:#cbd5e1;line-height:1.6;background:#08101a;padding:8px;border:1px solid #16273e;">
        <?= $buku['sinopsis'] ? nl2br(sanitize($buku['sinopsis'])) : '<em>Sinopsis belum tersedia untuk judul ini.</em>' ?>
      </div>
    </div>

    <!-- Link Marketplace / Pembelian -->
    <div class="buy-links">
      <div style="width:100%;font-weight:bold;color:#f1f5f9;margin-bottom:2px;">Tersedia di Marketplace Resmi & Pemesanan Langsung:</div>
      
      <?php if (!empty($buku['link_tokopedia'])): ?>
        <a href="<?= sanitize($buku['link_tokopedia']) ?>" target="_blank" rel="noopener noreferrer" class="btn-marketplace btn-tokopedia">
          &bull; Beli di Tokopedia
        </a>
      <?php endif; ?>

      <?php if (!empty($buku['link_shopee'])): ?>
        <a href="<?= sanitize($buku['link_shopee']) ?>" target="_blank" rel="noopener noreferrer" class="btn-marketplace btn-shopee">
          &bull; Beli di Shopee
        </a>
      <?php endif; ?>

      <?php if (!empty($buku['link_google_book'])): ?>
        <a href="<?= sanitize($buku['link_google_book']) ?>" target="_blank" rel="noopener noreferrer" class="btn-marketplace btn-google">
          &bull; Google Books
        </a>
      <?php endif; ?>

      <?php if (!empty($buku['link_google_play'])): ?>
        <a href="<?= sanitize($buku['link_google_play']) ?>" target="_blank" rel="noopener noreferrer" class="btn-marketplace btn-google">
          &bull; Google Play Books
        </a>
      <?php endif; ?>

      <!-- Tombol WhatsApp Pemesanan Langsung -->
      <?php
        $wa_text = urlencode("Halo Penerbit AISU, saya ingin memesan buku:\n\nJudul: " . $buku['judul'] . "\nPenulis: " . $buku['penulis'] . "\nHarga: " . rupiah($buku['harga']) . "\n\nMohon info ketersediaan stok dan ongkir. Terima kasih.");
      ?>
      <a href="https://wa.me/<?= sanitize(PUBLISHER_WA) ?>?text=<?= $wa_text ?>" target="_blank" rel="noopener noreferrer" class="btn-marketplace btn-wa">
        &bull; Pesan Langsung via WhatsApp
      </a>
    </div>

    <div style="margin-top:14px;">
      <a href="<?= base_url('katalog.php') ?>" class="btn">&larr; Kembali ke Katalog</a>
    </div>
  </div>
</article>

<?php render_footer(); ?>
