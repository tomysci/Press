<?php
require_once __DIR__ . '/config.php';

render_header(
    'Tentang Penerbit AISU',
    'Profil resmi Penerbit Asosiasi Informatika Sumatera Utara (AISU). Menerbitkan karya ilmiah, monograf, dan buku referensi di seluruh cabang keilmuan.',
    'tentang.php'
);
?>

<div class="page-title-box">
  <h1 class="page-title">Tentang Penerbit AISU</h1>
  <div class="page-subtitle">Asosiasi Informatika Sumatera Utara</div>
</div>

<article style="background:#0d1a2b;border:1px solid #1a2f4c;padding:12px;margin-bottom:12px;">
  <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:10px;">
    <img src="<?= sanitize(PUBLISHER_LOGO) ?>" alt="Logo Resmi AISU" width="64" height="64" style="background:#070e17;padding:4px;border:1px solid #1a2f4c;">
    <div style="flex:1;min-width:240px;">
      <h2 style="color:#38bdf8;margin-bottom:4px;font-size:11px;"><?= sanitize(PUBLISHER_NAME) ?></h2>
      <p style="color:#cbd5e1;line-height:1.6;">
        Penerbit Asosiasi Informatika Sumatera Utara (AISU) adalah lembaga penerbitan independen yang berkomitmen memfasilitasi diseminasi karya tulis ilmiah, buku teks perguruan tinggi, monograf hasil riset, serta karya populer edukatif bagi para akademisi, peneliti, praktisi, dan masyarakat luas di seluruh Indonesia.
      </p>
    </div>
  </div>

  <h3 style="color:#38bdf8;margin:12px 0 4px;font-size:11px;">Fokus & Ruang Lingkup Penerbitan</h3>
  <p><?= sanitize(PUBLISHER_FOCUS) ?>. Walaupun berakar pada asosiasi informatika, ruang lingkup penerbitan kami terbuka lebar mencakup:</p>
  <ul style="margin:4px 0 8px 18px;color:#cbd5e1;">
    <li>Ilmu Komputer, Informatika, Rekayasa Perangkat Lunak, dan Kecerdasan Buatan</li>
    <li>Sistem Informasi, Sains Data, dan Keamanan Jaringan</li>
    <li>Sains Terapan, Matematika, dan Keteknikan</li>
    <li>Sosial, Humaniora, Pendidikan, Hukum Siber, dan Manajemen Bisnis</li>
  </ul>

  <h3 style="color:#38bdf8;margin:12px 0 4px;font-size:11px;">Layanan Penerbitan untuk Penulis</h3>
  <ul style="margin:4px 0 8px 18px;color:#cbd5e1;">
    <li>Pengurusan International Standard Book Number (ISBN) resmi Perpustakaan Nasional RI.</li>
    <li>Penyuntingan bahasa (copyediting), uji kesamaan (similarity check), dan tata letak (typesetting) standar internasional.</li>
    <li>Desain sampul kreatif dan pencetakan proofreading.</li>
    <li>Distribusi cetak ke marketplace nasional (Tokopedia, Shopee) serta format digital (Google Play Books).</li>
  </ul>

  <h3 style="color:#38bdf8;margin:12px 0 4px;font-size:11px;">Alamat & Kontak Resmi</h3>
  <table class="table-spec" style="margin-top:6px;">
    <tr>
      <td class="label">Nama Organisasi</td>
      <td><?= sanitize(PUBLISHER_NAME) ?></td>
    </tr>
    <tr>
      <td class="label">Alamat Kantor</td>
      <td><?= sanitize(PUBLISHER_ADDRESS) ?></td>
    </tr>
    <tr>
      <td class="label">Email Resmi</td>
      <td><a href="mailto:<?= sanitize(PUBLISHER_EMAIL) ?>"><?= sanitize(PUBLISHER_EMAIL) ?></a></td>
    </tr>
    <tr>
      <td class="label">WhatsApp/Telp</td>
      <td><a href="https://wa.me/<?= sanitize(PUBLISHER_WA) ?>" target="_blank" rel="noopener"><?= sanitize(PUBLISHER_PHONE) ?></a></td>
    </tr>
    <tr>
      <td class="label">Website Utama</td>
      <td><a href="https://www.aisu.or.id" target="_blank" rel="noopener">https://www.aisu.or.id</a></td>
    </tr>
  </table>

  <div style="margin-top:14px;padding:8px;background:#091321;border:1px solid #1a3250;">
    <p><strong>Tertarik Menerbitkan Buku Bersama AISU?</strong></p>
    <p style="margin-top:2px;">Kirimkan draft naskah lengkap Anda dalam format .docx atau .pdf ke email <strong><?= sanitize(PUBLISHER_EMAIL) ?></strong> dengan subjek <em>[Pengajuan Naskah AISU] - Judul Buku - Nama Penulis</em>.</p>
  </div>
</article>

<?php render_footer(); ?>
