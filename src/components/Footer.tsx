import React from 'react';

interface FooterProps {
  onOpenSitemap: () => void;
  onOpenRobots: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSitemap, onOpenRobots }) => {
  return (
    <footer style={{
      backgroundColor: '#070d15',
      borderTop: '1px solid #142236',
      padding: '12px 0',
      marginTop: 'auto',
      color: '#94a3b8',
      fontSize: '11px',
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Kolom 1: Profil & Alamat */}
          <div style={{ flex: '1', minWidth: '220px' }}>
            <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>
              Penerbit Asosiasi Informatika Sumatera Utara (AISU)
            </div>
            <p style={{ margin: 0, fontSize: '11px', lineHeight: 1.4 }}>
              Menerbitkan buku untuk umum di semua bidang ilmu. Resmi, berstandar ISBN Perpustakaan Nasional RI, dan distribusi buku cetak & digital.
            </p>
            <p style={{ marginTop: '4px', fontSize: '10px', color: '#cbd5e1' }}>
              <strong>Alamat Kantor:</strong> Jl. Klambir V, Tanjung Gusta, Kec. Sunggal, Kab. Deli Serdang, Prov. Sumatera Utara, Indonesia.
            </p>
          </div>

          {/* Kolom 2: Kontak & Pemesanan */}
          <div style={{ width: '280px', maxWidth: '100%' }}>
            <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>
              Kontak Redaksi & Pemesanan
            </div>
            <p style={{ margin: '2px 0', fontSize: '11px' }}>
              Email:{' '}
              <a href="mailto:tomysatriaalasi@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                tomysatriaalasi@gmail.com
              </a>
            </p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}>
              WhatsApp / Telp:{' '}
              <a
                href="https://wa.me/6282168449797"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#34d399', textDecoration: 'none', fontWeight: 'bold' }}
              >
                +62 821-6844-9797
              </a>
            </p>
            <div style={{ marginTop: '6px', fontSize: '10px', display: 'flex', gap: '8px' }}>
              <button
                onClick={onOpenSitemap}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '10px',
                  textDecoration: 'underline',
                }}
              >
                Sitemap (XML)
              </button>
              <span style={{ color: '#475569' }}>|</span>
              <button
                onClick={onOpenRobots}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '10px',
                  textDecoration: 'underline',
                }}
              >
                robots.txt
              </button>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div style={{
          textAlign: 'center',
          paddingTop: '8px',
          borderTop: '1px solid #101c2e',
          fontSize: '10px',
          color: '#64748b',
          marginTop: '6px',
        }}>
          &copy; {new Date().getFullYear()} Asosiasi Informatika Sumatera Utara (AISU). Hak Cipta Dilindungi Undang-Undang.
        </div>
      </div>
    </footer>
  );
};
