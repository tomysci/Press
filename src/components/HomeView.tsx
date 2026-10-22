import React from 'react';
import { Buku } from '../types';
import { rupiah } from '../utils/publisher';

interface HomeViewProps {
  books: Buku[];
  onSelectBook: (id: number) => void;
  onNavigateKatalog: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ books, onSelectBook, onNavigateKatalog }) => {
  // Ambil 8 buku terbaru
  const latestBooks = [...books]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <div>
      {/* Hero Notice */}
      <section style={{
        backgroundColor: '#0e1c2e',
        border: '1px solid #233e64',
        borderLeft: '4px solid #38bdf8',
        padding: '10px',
        marginBottom: '12px',
        fontSize: '11px',
      }}>
        <div style={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: '3px' }}>
          Selamat Datang di Penerbit Asosiasi Informatika Sumatera Utara (AISU)
        </div>
        <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
          Kami memfasilitasi penerbitan buku karya akademisi, praktisi, dan masyarakat umum di seluruh bidang ilmu.
          Dilengkapi ISBN resmi Perpustakaan Nasional RI, standar cetak prima, serta integrasi penjualan di berbagai saluran daring nasional.
        </p>
      </section>

      {/* Heading Section */}
      <div style={{
        backgroundColor: '#0e1b2c',
        border: '1px solid #1a2f4c',
        padding: '8px 10px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
      }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '11px', margin: 0 }}>
            Buku Terbitan Terbaru
          </h1>
          <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
            Koleksi pustaka ilmiah dan referensi terkini terbitan Penerbit AISU
          </div>
        </div>
        <button
          onClick={onNavigateKatalog}
          style={{
            padding: '3px 8px',
            backgroundColor: '#153154',
            color: '#38bdf8',
            border: '1px solid #274b7a',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          Lihat Semua Buku &rarr;
        </button>
      </div>

      {/* Book Grid */}
      {latestBooks.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c' }}>
          Belum ada data buku yang diterbitkan.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '10px',
        }}>
          {latestBooks.map((b) => (
            <article
              key={b.id}
              style={{
                backgroundColor: '#0d1a2a',
                border: '1px solid #1a2f4a',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Cover */}
              <button
                onClick={() => onSelectBook(b.id)}
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  backgroundColor: '#070e17',
                  border: '1px solid #16283e',
                  padding: 0,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
                title={`Lihat detail ${b.judul}`}
              >
                <img
                  src={b.cover}
                  alt={`Cover ${b.judul}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>

              {/* Meta */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#38bdf8', fontSize: '10px', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {b.kategori_nama || 'Umum'}
                </span>
                <h2 style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  margin: '0 0 4px',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => onSelectBook(b.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f8fafc',
                      padding: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    {b.judul}
                  </button>
                </h2>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '10px',
                  marginBottom: '6px',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {b.penulis}
                </div>
                <div style={{
                  color: '#f59e0b',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  marginTop: 'auto',
                  paddingTop: '4px',
                  borderTop: '1px dashed #1a2e47',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>{rupiah(b.harga)}</span>
                  <button
                    onClick={() => onSelectBook(b.id)}
                    style={{
                      padding: '2px 5px',
                      backgroundColor: '#162b46',
                      border: '1px solid #234168',
                      color: '#38bdf8',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    Detail &rarr;
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
