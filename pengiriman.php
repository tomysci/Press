<?php
require_once __DIR__ . '/config.php';

render_header(
    'Informasi Pengiriman Buku',
    'Panduan dan ketentuan pengiriman buku dari Penerbit AISU ke seluruh wilayah Indonesia. Ekspedisi terpercaya, packing rapi dan aman.',
    'pengiriman.php'
);
?>

<div class="page-title-box">
  <h1 class="page-title">Informasi Pengiriman & Pemesanan</h1>
  <div class="page-subtitle">Ketentuan pengiriman fisik buku Penerbit AISU ke seluruh Indonesia</div>
</div>

<article style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;margin-bottom:12px;">
  <h2 style="color:#38bdf8;margin-bottom:6px;font-size:11px;">1. Lokasi Asal & Jasa Ekspedisi</h2>
  <p>Semua pesanan buku fisik dikirim langsung dari gudang percetakan Penerbit AISU di:</p>
  <p style="color:#f1f5f9;margin:4px 0 8px;"><strong><?= sanitize(PUBLISHER_ADDRESS) ?></strong></p>
  <p>Kami bermitra dengan ekspedisi resmi terpercaya:</p>
  <ul style="margin:4px 0 8px 18px;color:#cbd5e1;">
    <li><strong>JNE Express</strong> (Reguler, YES, JTR Cargo untuk partai besar)</li>
    <li><strong>J&T Express</strong> (Reguler & EZ)</li>
    <li><strong>SiCepat Ekspres</strong> (GOKIL & Reguler)</li>
    <li><strong>Pos Indonesia</strong> (Pos Reguler & Kilat Khusus ke pelosok nusantara)</li>
  </ul>

  <h2 style="color:#38bdf8;margin:12px 0 6px;font-size:11px;">2. Estimasi Waktu Sampai (Lead Time)</h2>
  <ul style="margin:4px 0 8px 18px;color:#cbd5e1;">
    <li><strong>Wilayah Sumatera Utara & Aceh:</strong> 1 - 2 hari kerja.</li>
    <li><strong>Wilayah Sumatera lainnya & Jabodetabek:</strong> 2 - 3 hari kerja.</li>
    <li><strong>Pulau Jawa, Bali, & Nusa Tenggara:</strong> 3 - 4 hari kerja.</li>
    <li><strong>Kalimantan, Sulawesi, Maluku, & Papua:</strong> 4 - 7 hari kerja (tergantung zona).</li>
  </ul>

  <h2 style="color:#38bdf8;margin:12px 0 6px;font-size:11px;">3. Standar Pengemasan (Packaging)</h2>
  <p>Setiap eksemplar buku dibungkus dengan plastik pelindung, lapisan <em>bubble wrap</em> tebal ganda, serta karton pelindung sudut untuk menjamin buku sampai di tangan pembaca tanpa cacat atau terlipat.</p>

  <h2 style="color:#38bdf8;margin:12px 0 6px;font-size:11px;">4. Pelacakan & Konfirmasi Nomor Resi</h2>
  <p>Nomor resi pengiriman resmi akan dikirimkan melalui WhatsApp/Email maksimal 1x24 jam setelah pembayaran pesanan terverifikasi pada hari kerja.</p>

  <h2 style="color:#38bdf8;margin:12px 0 6px;font-size:11px;">5. Garansi Ganti Baru</h2>
  <p>Apabila buku yang diterima mengalami cacat cetak fisik (halaman hilang, terbalik, atau rusak akibat ekspedisi), kami memberikan garansi penggantian buku baru 100% tanpa dipungut biaya tambahan.</p>

  <div style="margin-top:14px;padding-top:10px;border-top:1px solid #1a2f4c;">
    <p>Perlu bantuan tracking atau pemesanan skala kampus/instansi? Hubungi admin logistik AISU:</p>
    <p style="margin-top:4px;">
      <a href="https://wa.me/<?= sanitize(PUBLISHER_WA) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Chat WhatsApp Logistik AISU</a>
      <a href="mailto:<?= sanitize(PUBLISHER_EMAIL) ?>" class="btn">Email: <?= sanitize(PUBLISHER_EMAIL) ?></a>
    </p>
  </div>
</article>

<?php render_footer(); ?>
