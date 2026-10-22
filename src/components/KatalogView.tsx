import React, { useState, useMemo } from 'react';
import { Buku, Kategori, SortOption } from '../types';
import { filterBooks, paginateBooks, rupiah } from '../utils/publisher';

interface KatalogViewProps {
  books: Buku[];
  categories: Kategori[];
  onSelectBook: (id: number) => void;
}

export const KatalogView: React.FC<KatalogViewProps> = ({ books, categories, onSelectBook }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<SortOption>('terbaru');
  const [page, setPage] = useState<number>(1);

  // Filter & Urutkan
  const filtered = useMemo(() => {
    return filterBooks(books, {
      q: searchTitle,
      kategori_id: selectedKategori,
      sort: selectedSort,
    });
  }, [books, searchTitle, selectedKategori, selectedSort]);

  // Pagination (8 item per halaman sesuai requirement)
  const pagination = useMemo(() => {
    return paginateBooks(filtered, page, 8);
  }, [filtered, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
    setPage(1);
  };

  const handleKategoriChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKategori(Number(e.target.value));
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value as SortOption);
    setPage(1);
  };

  const handleReset = () => {
    setSearchTitle('');
    setSelectedKategori(0);
    setSelectedSort('terbaru');
    setPage(1);
  };

  return (
    <div>
      {/* Title Header */}
      <div style={{
        backgroundColor: '#0e1b2c',
        border: '1px solid #1a2f4c',
        padding: '8px 10px',
        marginBottom: '10px',
      }}>
        <h1 style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '11px', margin: 0 }}>
          Katalog Buku Terbitan AISU
        </h1>
        <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
          Menampilkan {filtered.length} judul buku terdaftar di katalog penerbit
        </div>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          backgroundColor: '#0e1b2c',
          border: '1px solid #1b314f',
          padding: '8px',
          marginBottom: '12px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {/* Input Pencarian Khusus Judul */}
        <div style={{ flex: '2', minWidth: '180px' }}>
          <label htmlFor="search-title" style={{ display: 'none' }}>Cari berdasarkan judul buku</label>
          <input
            id="search-title"
            type="text"
            value={searchTitle}
            onChange={handleSearchChange}
            placeholder="Cari HANYA berdasarkan judul buku..."
            style={{
              backgroundColor: '#070e17',
              color: '#e2e8f0',
              border: '1px solid #233e64',
              padding: '4px 6px',
              width: '100%',
              fontSize: '11px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Filter Kategori */}
        <div style={{ flex: '1', minWidth: '140px' }}>
          <label htmlFor="filter-kategori" style={{ display: 'none' }}>Filter Kategori</label>
          <select
            id="filter-kategori"
            value={selectedKategori}
            onChange={handleKategoriChange}
            style={{
              backgroundColor: '#070e17',
              color: '#e2e8f0',
              border: '1px solid #233e64',
              padding: '4px 6px',
              width: '100%',
              fontSize: '11px',
              boxSizing: 'border-box',
            }}
          >
            <option value="0">-- Semua Kategori --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div style={{ flex: '1', minWidth: '130px' }}>
          <label htmlFor="sort-books" style={{ display: 'none' }}>Urutkan Buku</label>
          <select
            id="sort-books"
            value={selectedSort}
            onChange={handleSortChange}
            style={{
              backgroundColor: '#070e17',
              color: '#e2e8f0',
              border: '1px solid #233e64',
              padding: '4px 6px',
              width: '100%',
              fontSize: '11px',
              boxSizing: 'border-box',
            }}
          >
            <option value="terbaru">Terbaru</option>
            <option value="harga_asc">Harga Terendah</option>
            <option value="harga_desc">Harga Tertinggi</option>
            <option value="judul_asc">Judul A-Z</option>
          </select>
        </div>

        {/* Reset Button */}
        {(searchTitle !== '' || selectedKategori > 0 || selectedSort !== 'terbaru') && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '4px 8px',
              backgroundColor: '#1f3656',
              color: '#e2e8f0',
              border: '1px solid #2f5280',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Reset
          </button>
        )}
      </form>

      {/* Book Grid */}
      {pagination.items.length === 0 ? (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          backgroundColor: '#0d1a2b',
          border: '1px solid #1a2f4c',
        }}>
          <p style={{ color: '#f87171', margin: 0, fontWeight: 'bold', fontSize: '11px' }}>
            Tidak ada buku yang sesuai dengan pencarian "{searchTitle}".
          </p>
          <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '10px' }}>
            Pastikan kata kunci judul sesuai atau klik Reset untuk memuat seluruh katalog.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '10px',
        }}>
          {pagination.items.map((b) => (
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

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4px',
          marginTop: '14px',
          fontSize: '11px',
        }}>
          {pagination.currentPage > 1 && (
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{
                padding: '3px 7px',
                backgroundColor: '#0e1b2c',
                border: '1px solid #1c324f',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              &laquo; Sebelumnya
            </button>
          )}

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: '3px 7px',
                backgroundColor: p === pagination.currentPage ? '#0284c7' : '#0e1b2c',
                border: `1px solid ${p === pagination.currentPage ? '#38bdf8' : '#1c324f'}`,
                color: p === pagination.currentPage ? '#ffffff' : '#cbd5e1',
                fontWeight: p === pagination.currentPage ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              {p}
            </button>
          ))}

          {pagination.currentPage < pagination.totalPages && (
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              style={{
                padding: '3px 7px',
                backgroundColor: '#0e1b2c',
                border: '1px solid #1c324f',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Berikutnya &raquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
};
