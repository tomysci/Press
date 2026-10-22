import React, { useState } from 'react';
import { Buku } from '../types';
import { buildJsonLd, rupiah } from '../utils/publisher';

interface DetailViewProps {
  book: Buku;
  onBackToKatalog: () => void;
  onSelectCategory: (kategoriId: number) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  book,
  onBackToKatalog,
  onSelectCategory,
}) => {
  const [showJsonLd, setShowJsonLd] = useState(false);

  const jsonLdData = buildJsonLd(
    book,
    'Asosiasi Informatika Sumatera Utara (AISU)',
    'https://www.aisu.or.id/aisu.png'
  );

  const waMessage = encodeURIComponent(
    `Halo Penerbit AISU, saya ingin memesan buku:\n\nJudul: ${book.judul}\nPenulis: ${book.penulis}\nHarga: ${rupiah(book.harga)}\n\nMohon info ketersediaan stok dan biaya pengiriman. Terima kasih.`
  );

  return (
    <div>
      {/* Breadcrumb & Title Box */}
      <div style={{
        backgroundColor: '#0e1b2c',
        border: '1px solid #1a2f4c',
        padding: '8px 10px',
        marginBottom: '12px',
      }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>
          <button
            onClick={onBackToKatalog}
            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontSize: '10px' }}
          >
            Katalog
          </button>
          {' '}&rsaquo;{' '}
          <button
            onClick={() => onSelectCategory(book.kategori_id)}
            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontSize: '10px' }}
          >
            {book.kategori_nama || 'Umum'}
          </button>
          {' '}&rsaquo;{' '}
          <span style={{ color: '#cbd5e1' }}>{book.judul}</span>
        </nav>
        <h1 style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '11px', margin: 0 }}>
          {book.judul}
        </h1>
        <div style={{ color: '#38bdf8', fontSize: '10px', marginTop: '2px' }}>
          Oleh: {book.penulis}
        </div>
      </div>

      {/* Main Detail Layout */}
      <article style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '14px',
        fontSize: '11px',
      }}>
        {/* Cover Column */}
        <div style={{ width: '220px', maxWidth: '100%', margin: '0 auto' }}>
          <div style={{
            width: '100%',
            aspectRatio: '2/3',
            backgroundColor: '#070e17',
            border: '1px solid #16283e',
            overflow: 'hidden',
          }}>
            <img
              src={book.cover}
              alt={`Cover ${book.judul}`}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{
            backgroundColor: '#0e1b2c',
            border: '1px solid #1a2f4c',
            padding: '8px',
            textAlign: 'center',
            marginTop: '8px',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '10px' }}>Harga Resmi:</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b', marginTop: '2px' }}>
              {rupiah(book.harga)}
            </div>
          </div>
        </div>

        {/* Specifications Column */}
        <div style={{
          flex: '1',
          minWidth: '260px',
          backgroundColor: '#0d1a2b',
          border: '1px solid #1a2f4c',
          padding: '12px',
        }}>
          <h2 style={{ color: '#38bdf8', margin: '0 0 8px', fontSize: '11px', fontWeight: 'bold' }}>
            Spesifikasi & Informasi Lengkap Buku
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', width: '110px', fontWeight: 600 }}>
                  Judul Lengkap
                </td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                  <strong>{book.judul}</strong>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                  Penulis
                </td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                  {book.penulis}
                </td>
              </tr>
              {book.editor && (
                <tr>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                    Editor
                  </td>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                    {book.editor}
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                  Kategori
                </td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#38bdf8' }}>
                  {book.kategori_nama || 'Umum'}
                </td>
              </tr>
              {book.isbn && (
                <tr>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                    ISBN
                  </td>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                    {book.isbn}
                  </td>
                </tr>
              )}
              {book.halaman && (
                <tr>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                    Jumlah Halaman
                  </td>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                    {book.halaman} Halaman
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                  Penerbit
                </td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                  Asosiasi Informatika Sumatera Utara (AISU)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                  Tanggal Terbit
                </td>
                <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#f1f5f9' }}>
                  {new Date(book.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </td>
              </tr>
              {book.keterangan && (
                <tr>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#94a3b8', fontWeight: 600 }}>
                    Spesifikasi Fisik
                  </td>
                  <td style={{ padding: '4px 6px', borderBottom: '1px solid #16273e', color: '#cbd5e1' }}>
                    {book.keterangan}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Sinopsis */}
          <div style={{ marginTop: '10px' }}>
            <h3 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px' }}>
              Sinopsis Buku
            </h3>
            <div style={{
              color: '#cbd5e1',
              lineHeight: 1.55,
              backgroundColor: '#08101a',
              padding: '8px',
              border: '1px solid #16273e',
              fontSize: '11px',
            }}>
              {book.sinopsis || 'Sinopsis belum tersedia untuk judul buku ini.'}
            </div>
          </div>

          {/* Tombol Marketplace & WA */}
          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid #1b304c',
          }}>
            <div style={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: '6px' }}>
              Tersedia di Marketplace Resmi & Pemesanan Langsung:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {book.link_tokopedia && (
                <a
                  href={book.link_tokopedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #03ac0e',
                    backgroundColor: '#072412',
                    color: '#4ade80',
                    fontSize: '11px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  &bull; Tokopedia
                </a>
              )}

              {book.link_shopee && (
                <a
                  href={book.link_shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ee4d2d',
                    backgroundColor: '#27120a',
                    color: '#fb923c',
                    fontSize: '11px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  &bull; Shopee
                </a>
              )}

              {book.link_google_book && (
                <a
                  href={book.link_google_book}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #4285f4',
                    backgroundColor: '#0c1b33',
                    color: '#60a5fa',
                    fontSize: '11px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  &bull; Google Books
                </a>
              )}

              {book.link_google_play && (
                <a
                  href={book.link_google_play}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #4285f4',
                    backgroundColor: '#0c1b33',
                    color: '#60a5fa',
                    fontSize: '11px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  &bull; Google Play Books
                </a>
              )}

              <a
                href={`https://wa.me/6282168449797?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '4px 8px',
                  border: '1px solid #25d366',
                  backgroundColor: '#092b16',
                  color: '#4ade80',
                  fontSize: '11px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                &bull; Pesan via WhatsApp (+62 821-6844-9797)
              </a>
            </div>
          </div>

          {/* JSON-LD Schema.org Inspector Button */}
          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #16273e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowJsonLd(!showJsonLd)}
                style={{
                  padding: '3px 6px',
                  backgroundColor: '#112035',
                  border: '1px solid #1f3656',
                  color: '#38bdf8',
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              >
                {showJsonLd ? '[-] Sembunyikan Schema.org JSON-LD' : '[+] Periksa Schema.org/Book (SEO Ekstrem JSON-LD)'}
              </button>

              <button
                type="button"
                onClick={onBackToKatalog}
                style={{
                  padding: '3px 8px',
                  backgroundColor: '#153154',
                  color: '#f1f5f9',
                  border: '1px solid #274b7a',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                &larr; Kembali ke Katalog
              </button>
            </div>

            {showJsonLd && (
              <pre style={{
                marginTop: '8px',
                padding: '8px',
                backgroundColor: '#050a12',
                border: '1px solid #233e64',
                color: '#38bdf8',
                fontSize: '10px',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {JSON.stringify(jsonLdData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};
