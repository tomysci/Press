import React from 'react';

export const PengirimanView: React.FC = () => {
  return (
    <div>
      <div style={{
        backgroundColor: '#0e1b2c',
        border: '1px solid #1a2f4c',
        padding: '8px 10px',
        marginBottom: '12px',
      }}>
        <h1 style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '11px', margin: 0 }}>
          Informasi Pengiriman & Pemesanan Buku
        </h1>
        <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
          Ketentuan pengiriman fisik buku Penerbit AISU ke seluruh Indonesia
        </div>
      </div>

      <article style={{
        backgroundColor: '#0d1a2b',
        border: '1px solid #1a2f4c',
        padding: '12px',
        fontSize: '11px',
        lineHeight: 1.5,
      }}>
        <h2 style={{ color: '#38bdf8', margin: '0 0 6px', fontSize: '11px', fontWeight: 'bold' }}>
          1. Lokasi Asal & Jasa Ekspedisi Terpercaya
        </h2>
        <p style={{ margin: '0 0 4px', color: '#cbd5e1' }}>
          Seluruh pesanan buku fisik dikirim langsung dari kantor & percetakan Penerbit AISU:
        </p>
        <p style={{ color: '#f1f5f9', margin: '0 0 8px', fontWeight: 'bold' }}>
          Jl. Klambir V, Tanjung Gusta, Kec. Sunggal, Kab. Deli Serdang, Prov. Sumatera Utara, Indonesia.
        </p>
        <ul style={{ margin: '0 0 10px 18px', color: '#cbd5e1' }}>
          <li><strong>JNE Express</strong> (Reguler, YES 1 hari sampai, JTR Cargo untuk pengadaan perpustakaan kampus)</li>
          <li><strong>J&amp;T Express</strong> (Reguler &amp; Layanan Cepat)</li>
          <li><strong>SiCepat Ekspres</strong> (GOKIL Kargo &amp; Reguler)</li>
          <li><strong>Pos Indonesia</strong> (Pos Kilat Khusus menjangkau seluruh kecamatan di pelosok nusantara)</li>
        </ul>

        <h2 style={{ color: '#38bdf8', margin: '12px 0 6px', fontSize: '11px', fontWeight: 'bold' }}>
          2. Estimasi Waktu Sampai (Lead Time)
        </h2>
        <ul style={{ margin: '0 0 10px 18px', color: '#cbd5e1' }}>
          <li><strong>Sumatera Utara &amp; Aceh:</strong> 1 - 2 hari kerja.</li>
          <li><strong>Provinsi Sumatera lainnya &amp; Jabodetabek:</strong> 2 - 3 hari kerja.</li>
          <li><strong>Pulau Jawa, Bali, &amp; Nusa Tenggara:</strong> 3 - 4 hari kerja.</li>
          <li><strong>Kalimantan, Sulawesi, Maluku, &amp; Papua:</strong> 4 - 7 hari kerja.</li>
        </ul>

        <h2 style={{ color: '#38bdf8', margin: '12px 0 6px', fontSize: '11px', fontWeight: 'bold' }}>
          3. Standar Pengemasan (Packaging) Bebas Rusak
        </h2>
        <p style={{ margin: '0 0 10px', color: '#cbd5e1' }}>
          Setiap buku dilindungi dengan pembungkus plastik bersegel, lapisan ganda <em>bubble wrap</em> tebal, dan pelindung siku karton tebal demi memastikan buku tiba dalam kondisi prima tanpa lipatan atau benturan.
        </p>

        <h2 style={{ color: '#38bdf8', margin: '12px 0 6px', fontSize: '11px', fontWeight: 'bold' }}>
          4. Pelacakan Nomor Resi Resmi
        </h2>
        <p style={{ margin: '0 0 10px', color: '#cbd5e1' }}>
          Nomor resi pengiriman resmi dikirimkan via WhatsApp atau Email maksimal 1x24 jam setelah pesanan buku terverifikasi pada hari kerja.
        </p>

        <h2 style={{ color: '#38bdf8', margin: '12px 0 6px', fontSize: '11px', fontWeight: 'bold' }}>
          5. Garansi Penggantian Baru (100% Retur Gratis)
        </h2>
        <p style={{ margin: '0 0 12px', color: '#cbd5e1' }}>
          Apabila terdapat cacat cetak fisik (seperti lembaran hilang, halaman terbalik, atau kerusakan fatal akibat ekspedisi), kami menjamin pengiriman buku pengganti yang baru secara cuma-cuma tanpa beban ongkir.
        </p>

        <div style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid #1a2f4c',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}>
          <span style={{ color: '#f1f5f9', fontWeight: 'bold' }}>Konsultasi Ongkir &amp; Pengiriman:</span>
          <a
            href="https://wa.me/6282168449797?text=Halo%20Admin%20Logistik%20AISU,%20saya%20ingin%20tanya%20ongkos%20kirim%20buku"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '3px 8px',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: '1px solid #34d399',
              fontSize: '11px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            WhatsApp Logistik: +62 821-6844-9797
          </a>
          <a
            href="mailto:tomysatriaalasi@gmail.com"
            style={{
              padding: '3px 8px',
              backgroundColor: '#153154',
              color: '#38bdf8',
              border: '1px solid #274b7a',
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            Email: tomysatriaalasi@gmail.com
          </a>
        </div>
      </article>
    </div>
  );
};
