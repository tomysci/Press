import React from 'react';

export const TentangView: React.FC = () => {
  return (
    <div>
      <div style={{
        backgroundColor: '#0e1b2c',
        border: '1px solid #1a2f4c',
        padding: '8px 10px',
        marginBottom: '12px',
      }}>
        <h1 style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '11px', margin: 0 }}>
          Tentang Penerbit Asosiasi Informatika Sumatera Utara (AISU)
        </h1>
        <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
          Profil lembaga penerbitan independen berstandar ISBN Perpustakaan Nasional RI
        </div>
      </div>

      <article style={{
        backgroundColor: '#0d1a2b',
        border: '1px solid #1a2f4c',
        padding: '12px',
        fontSize: '11px',
        lineHeight: 1.55,
      }}>
        {/* Brand Section */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '12px' }}>
          <img
            src="https://www.aisu.or.id/aisu.png"
            alt="Logo AISU"
            style={{ width: '56px', height: '56px', objectFit: 'contain', backgroundColor: '#070e17', padding: '4px', border: '1px solid #1a2f4c' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect width="56" height="56" fill="%230284c7"/><text x="28" y="34" fill="%23fff" font-size="14" font-weight="bold" text-anchor="middle">AISU</text></svg>';
            }}
          />
          <div style={{ flex: '1', minWidth: '240px' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px' }}>
              Penerbit Asosiasi Informatika Sumatera Utara (AISU)
            </h2>
            <p style={{ color: '#cbd5e1', margin: 0 }}>
              Penerbit AISU adalah divisi penerbitan di bawah naungan Asosiasi Informatika Sumatera Utara.
              Kami berdedikasi mendorong akselerasi literasi keilmuan bangsa melalui penerbitan buku berkualitas tinggi,
              mulai dari buku ajar universitas, monograf hasil riset dosen, modul praktikum industri, hingga buku ilmiah populer.
            </p>
          </div>
        </div>

        {/* Fokus Penerbitan */}
        <h3 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '12px 0 4px' }}>
          Fokus &amp; Ruang Lingkup Keilmuan
        </h3>
        <p style={{ color: '#cbd5e1', margin: '0 0 6px' }}>
          <strong>Menerbitkan buku untuk umum di semua bidang ilmu.</strong> Walaupun berakar pada rumpun ilmu komputer dan informatika, kami menerima naskah dari segenap cabang keilmuan:
        </p>
        <ul style={{ margin: '0 0 10px 18px', color: '#cbd5e1' }}>
          <li>Informatika, Algoritma, Rekayasa Perangkat Lunak, dan Kecerdasan Buatan</li>
          <li>Sistem Informasi, Manajemen Data, dan Keamanan Siber / Jaringan</li>
          <li>Sains Terapan, Matematika, Statistika, dan Teknik Elektro</li>
          <li>Ilmu Sosial, Pendidikan, Kebijakan Publik, dan Hukum Siber / Regulasi Digital</li>
          <li>Ekonomi, Bisnis Digital, dan Kewirausahaan Teknologi</li>
        </ul>

        {/* Layanan Penerbitan */}
        <h3 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '12px 0 4px' }}>
          Layanan Penerbitan untuk Penulis &amp; Dosen
        </h3>
        <ul style={{ margin: '0 0 10px 18px', color: '#cbd5e1' }}>
          <li>Pengurusan nomor <strong>ISBN resmi</strong> Perpustakaan Nasional Republik Indonesia.</li>
          <li>Layanan <em>copyediting</em> naskah, cek plagiarisme (similarity check), dan <em>layout formatting</em> profesional.</li>
          <li>Desain sampul (cover) elegan sesuai tema buku.</li>
          <li>Distribusi marketplace resmi (Tokopedia, Shopee) serta format digital (Google Play Books).</li>
        </ul>

        {/* Data Legalitas & Kontak */}
        <h3 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '12px 0 6px' }}>
          Identitas &amp; Kontak Resmi Penerbit AISU
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', width: '120px', fontWeight: 600 }}>
                Nama Penerbit
              </td>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                Asosiasi Informatika Sumatera Utara (AISU)
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                Alamat Redaksi
              </td>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                Jl. Klambir V, Tanjung Gusta, Kec. Sunggal, Kab. Deli Serdang, Prov. Sumatera Utara, Indonesia
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                Email Resmi
              </td>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e' }}>
                <a href="mailto:tomysatriaalasi@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                  tomysatriaalasi@gmail.com
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                WhatsApp / Telp
              </td>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e' }}>
                <a
                  href="https://wa.me/6282168449797"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#34d399', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  +62 821-6844-9797
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                Portal Utama
              </td>
              <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e' }}>
                <a
                  href="https://www.aisu.or.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#38bdf8', textDecoration: 'none' }}
                >
                  https://www.aisu.or.id
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pengajuan Naskah Callout */}
        <div style={{
          backgroundColor: '#091321',
          border: '1px solid #1a3250',
          borderLeft: '3px solid #f59e0b',
          padding: '10px',
        }}>
          <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '3px' }}>
            Ingin Menerbitkan Buku Bersama Penerbit AISU?
          </div>
          <p style={{ margin: '0 0 6px', color: '#cbd5e1' }}>
            Kirimkan naskah lengkap Anda (format Microsoft Word .docx atau PDF) ke email <strong>tomysatriaalasi@gmail.com</strong> dengan subjek <em>[Pengajuan Naskah AISU] - Judul Buku - Nama Penulis</em> atau diskusikan draft buku Anda langsung melalui WhatsApp Redaksi.
          </p>
          <a
            href="https://wa.me/6282168449797?text=Halo%20Redaksi%20Penerbit%20AISU,%20saya%20berminat%20menerbitkan%20buku"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '3px 8px',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: '1px solid #34d399',
              fontSize: '11px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Kirim Draft via WhatsApp
          </a>
        </div>
      </article>
    </div>
  );
};
