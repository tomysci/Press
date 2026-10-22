import React, { useState } from 'react';
import { Buku, Kategori } from '../types';
import { generateSvgCover, rupiah } from '../utils/publisher';

interface AdminViewProps {
  books: Buku[];
  categories: Kategori[];
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onAddBook: (book: Omit<Buku, 'id' | 'created_at'>) => void;
  onUpdateBook: (book: Buku) => void;
  onDeleteBook: (id: number) => void;
  onAddCategory: (nama: string) => void;
  onUpdateCategory: (id: number, nama: string) => void;
  onDeleteCategory: (id: number) => boolean;
  onSelectBookDetail: (id: number) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  books,
  categories,
  isLoggedIn,
  onLogin,
  onLogout,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onSelectBookDetail,
}) => {
  // Tab dalam admin: 'dashboard' | 'buku_list' | 'buku_form' | 'kategori'
  const [tab, setTab] = useState<'dashboard' | 'buku_list' | 'buku_form' | 'kategori'>('dashboard');

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Flash alert
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit book state
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [bookForm, setBookForm] = useState({
    judul: '',
    kategori_id: categories[0]?.id || 1,
    penulis: '',
    editor: '',
    halaman: 200,
    isbn: '',
    harga: 80000,
    sinopsis: '',
    keterangan: 'Cetakan Pertama, Bookpaper 72gr, Softcover Matte.',
    cover: '',
    link_tokopedia: '',
    link_shopee: '',
    link_google_book: '',
    link_google_play: '',
  });

  // Edit category state
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setLoginError('');
      onLogin();
      setFlash({ type: 'success', message: 'Selamat datang di Panel Administrasi Penerbit AISU!' });
    } else {
      setLoginError('Kredensial salah! Gunakan username: admin dan password: admin123');
    }
  };

  // Switch to Add Book Form
  const startAddBook = () => {
    setEditingBookId(null);
    setBookForm({
      judul: '',
      kategori_id: categories[0]?.id || 1,
      penulis: '',
      editor: '',
      halaman: 200,
      isbn: '978-623-98765-x-x',
      harga: 80000,
      sinopsis: '',
      keterangan: 'Cetakan Pertama, Bookpaper 72gr, Softcover Matte.',
      cover: '',
      link_tokopedia: '',
      link_shopee: '',
      link_google_book: '',
      link_google_play: '',
    });
    setTab('buku_form');
  };

  // Switch to Edit Book Form
  const startEditBook = (b: Buku) => {
    setEditingBookId(b.id);
    setBookForm({
      judul: b.judul,
      kategori_id: b.kategori_id,
      penulis: b.penulis,
      editor: b.editor || '',
      halaman: b.halaman || 200,
      isbn: b.isbn || '',
      harga: b.harga,
      sinopsis: b.sinopsis || '',
      keterangan: b.keterangan || '',
      cover: b.cover || '',
      link_tokopedia: b.link_tokopedia || '',
      link_shopee: b.link_shopee || '',
      link_google_book: b.link_google_book || '',
      link_google_play: b.link_google_play || '',
    });
    setTab('buku_form');
  };

  // Handle Book Form Submit
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.judul.trim() || !bookForm.penulis.trim()) {
      setFlash({ type: 'error', message: 'Judul dan Penulis buku wajib diisi!' });
      return;
    }

    const kategoriObj = categories.find(c => c.id === Number(bookForm.kategori_id));
    const kategoriNama = kategoriObj ? kategoriObj.nama : 'Umum';

    // Auto-generate cover jika belum ada atau kosong
    const finalCover = bookForm.cover.trim() !== ''
      ? bookForm.cover
      : generateSvgCover(bookForm.judul, bookForm.penulis);

    if (editingBookId) {
      const existing = books.find(b => b.id === editingBookId);
      if (existing) {
        onUpdateBook({
          ...existing,
          judul: bookForm.judul.trim(),
          kategori_id: Number(bookForm.kategori_id),
          kategori_nama: kategoriNama,
          penulis: bookForm.penulis.trim(),
          editor: bookForm.editor.trim() || undefined,
          halaman: Number(bookForm.halaman) || undefined,
          isbn: bookForm.isbn.trim() || undefined,
          harga: Number(bookForm.harga) || 0,
          sinopsis: bookForm.sinopsis.trim() || undefined,
          keterangan: bookForm.keterangan.trim() || undefined,
          cover: finalCover,
          link_tokopedia: bookForm.link_tokopedia.trim() || undefined,
          link_shopee: bookForm.link_shopee.trim() || undefined,
          link_google_book: bookForm.link_google_book.trim() || undefined,
          link_google_play: bookForm.link_google_play.trim() || undefined,
        });
        setFlash({ type: 'success', message: `Buku "${bookForm.judul}" berhasil diperbarui!` });
      }
    } else {
      onAddBook({
        judul: bookForm.judul.trim(),
        kategori_id: Number(bookForm.kategori_id),
        kategori_nama: kategoriNama,
        penulis: bookForm.penulis.trim(),
        editor: bookForm.editor.trim() || undefined,
        halaman: Number(bookForm.halaman) || undefined,
        isbn: bookForm.isbn.trim() || undefined,
        harga: Number(bookForm.harga) || 0,
        sinopsis: bookForm.sinopsis.trim() || undefined,
        keterangan: bookForm.keterangan.trim() || undefined,
        cover: finalCover,
        link_tokopedia: bookForm.link_tokopedia.trim() || undefined,
        link_shopee: bookForm.link_shopee.trim() || undefined,
        link_google_book: bookForm.link_google_book.trim() || undefined,
        link_google_play: bookForm.link_google_play.trim() || undefined,
      });
      setFlash({ type: 'success', message: `Buku baru "${bookForm.judul}" berhasil disimpan!` });
    }

    setTab('buku_list');
  };

  // Handle Cover file upload simulation
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBookForm(prev => ({ ...prev, cover: reader.result as string }));
        setFlash({ type: 'success', message: `File cover ${file.name} berhasil diunggah.` });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Delete Book
  const handleDeleteBook = (id: number, judul: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus buku "${judul}"?`)) {
      onDeleteBook(id);
      setFlash({ type: 'success', message: `Buku "${judul}" berhasil dihapus.` });
    }
  };

  // Handle Category Submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;

    if (editingCategoryId) {
      onUpdateCategory(editingCategoryId, categoryNameInput.trim());
      setFlash({ type: 'success', message: 'Kategori berhasil diperbarui.' });
      setEditingCategoryId(null);
    } else {
      onAddCategory(categoryNameInput.trim());
      setFlash({ type: 'success', message: `Kategori "${categoryNameInput.trim()}" berhasil ditambahkan.` });
    }
    setCategoryNameInput('');
  };

  // Handle Category Delete with book association check
  const handleDeleteCategory = (id: number, nama: string) => {
    const success = onDeleteCategory(id);
    if (!success) {
      setFlash({ type: 'error', message: `Kategori "${nama}" tidak dapat dihapus karena masih digunakan oleh buku!` });
    } else {
      setFlash({ type: 'success', message: `Kategori "${nama}" berhasil dihapus.` });
    }
  };

  // IF NOT LOGGED IN
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '340px', margin: '30px auto', backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', padding: '16px', fontSize: '11px' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px', textAlign: 'center' }}>
          LOGIN ADMIN PENERBIT AISU
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '10px', textAlign: 'center', margin: '0 0 12px' }}>
          Autentikasi sesi hardcoded untuk mengelola katalog &amp; kategori buku
        </p>

        {loginError && (
          <div style={{ backgroundColor: '#7f1d1d', border: '1px solid #dc2626', color: '#fecaca', padding: '6px 8px', marginBottom: '10px', fontSize: '10px' }}>
            {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: '8px' }}>
            <label htmlFor="admin-user" style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Username:</label>
            <input
              id="admin-user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: '#070e17',
                color: '#e2e8f0',
                border: '1px solid #233e64',
                padding: '4px 6px',
                fontSize: '11px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="admin-pass" style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Password:</label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: '#070e17',
                color: '#e2e8f0',
                border: '1px solid #233e64',
                padding: '4px 6px',
                fontSize: '11px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '5px',
              backgroundColor: '#0284c7',
              border: '1px solid #38bdf8',
              color: '#ffffff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Masuk ke Panel Admin
          </button>
        </form>

        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #16273e', textAlign: 'center', color: '#64748b', fontSize: '10px' }}>
          Kredensial Default: <strong>admin</strong> / <strong>admin123</strong><br />
          (Sesuai variabel ADMIN_USERNAME / ADMIN_PASSWORD di <code>config.php</code>)
        </div>
      </div>
    );
  }

  // IF LOGGED IN
  return (
    <div style={{ fontSize: '11px' }}>
      {/* Admin Subheader & Navigation */}
      <div style={{
        backgroundColor: '#0e1b2c',
        border: '1px solid #1a2f4c',
        padding: '8px 10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
      }}>
        <div>
          <h1 style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '11px', margin: 0 }}>
            PANEL ADMINISTRASI PENERBIT AISU
          </h1>
          <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
            Kelola Basis Data Buku dan Kategori Keilmuan
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setTab('dashboard')}
            style={{
              padding: '3px 7px',
              backgroundColor: tab === 'dashboard' ? '#1a3254' : '#112035',
              border: `1px solid ${tab === 'dashboard' ? '#38bdf8' : '#1f3656'}`,
              color: tab === 'dashboard' ? '#38bdf8' : '#e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => setTab('buku_list')}
            style={{
              padding: '3px 7px',
              backgroundColor: tab === 'buku_list' ? '#1a3254' : '#112035',
              border: `1px solid ${tab === 'buku_list' ? '#38bdf8' : '#1f3656'}`,
              color: tab === 'buku_list' ? '#38bdf8' : '#e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Kelola Buku ({books.length})
          </button>

          <button
            onClick={startAddBook}
            style={{
              padding: '3px 7px',
              backgroundColor: tab === 'buku_form' && !editingBookId ? '#0369a1' : '#0284c7',
              border: '1px solid #38bdf8',
              color: '#ffffff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            + Tambah Buku
          </button>

          <button
            onClick={() => setTab('kategori')}
            style={{
              padding: '3px 7px',
              backgroundColor: tab === 'kategori' ? '#1a3254' : '#112035',
              border: `1px solid ${tab === 'kategori' ? '#38bdf8' : '#1f3656'}`,
              color: tab === 'kategori' ? '#38bdf8' : '#e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Kategori ({categories.length})
          </button>

          <button
            onClick={onLogout}
            style={{
              padding: '3px 7px',
              backgroundColor: '#991b1b',
              border: '1px solid #f87171',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Flash Alert */}
      {flash && (
        <div style={{
          padding: '6px 10px',
          marginBottom: '10px',
          backgroundColor: flash.type === 'success' ? '#064e3b' : '#7f1d1d',
          border: `1px solid ${flash.type === 'success' ? '#059669' : '#dc2626'}`,
          color: flash.type === 'success' ? '#a7f3d0' : '#fecaca',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{flash.message}</span>
          <button
            onClick={() => setFlash(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '10px' }}
          >
            [x]
          </button>
        </div>
      )}

      {/* 1. TAB: DASHBOARD */}
      {tab === 'dashboard' && (
        <div>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <div style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', borderLeft: '3px solid #38bdf8', padding: '10px' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>TOTAL BUKU TERBIT</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f1f5f9', marginTop: '4px' }}>
                {books.length} Judul Buku
              </div>
              <div style={{ marginTop: '6px' }}>
                <button
                  onClick={() => setTab('buku_list')}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', padding: 0, cursor: 'pointer', fontSize: '10px', textDecoration: 'underline' }}
                >
                  Buka Manajemen Buku &rarr;
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', borderLeft: '3px solid #f59e0b', padding: '10px' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>TOTAL KATEGORI</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f1f5f9', marginTop: '4px' }}>
                {categories.length} Kategori Bidang Ilmu
              </div>
              <div style={{ marginTop: '6px' }}>
                <button
                  onClick={() => setTab('kategori')}
                  style={{ background: 'none', border: 'none', color: '#f59e0b', padding: 0, cursor: 'pointer', fontSize: '10px', textDecoration: 'underline' }}
                >
                  Kelola Kategori &rarr;
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', borderLeft: '3px solid #34d399', padding: '10px' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>STATUS SISTEM DATABASE</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#34d399', marginTop: '4px' }}>
                Aktif &amp; Terhubung (PDO MySQL Ready)
              </div>
              <div style={{ marginTop: '6px' }}>
                <button
                  onClick={startAddBook}
                  style={{ background: 'none', border: 'none', color: '#34d399', padding: 0, cursor: 'pointer', fontSize: '10px', textDecoration: 'underline' }}
                >
                  + Tambah Buku Baru Sekarang
                </button>
              </div>
            </div>
          </div>

          {/* 5 Buku Terakhir */}
          <div style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: 0 }}>
                5 Buku Terbaru di Sistem
              </h2>
              <button
                onClick={() => setTab('buku_list')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '10px', textDecoration: 'underline' }}
              >
                Lihat Semua ({books.length}) &rarr;
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#091321' }}>
                <thead>
                  <tr style={{ backgroundColor: '#112238' }}>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left', width: '35px' }}>ID</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Judul Buku</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Kategori</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Penulis</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Harga</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'center', width: '90px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {books.slice(0, 5).map((b) => (
                    <tr key={b.id}>
                      <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c' }}>{b.id}</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c' }}>
                        <button
                          onClick={() => onSelectBookDetail(b.id)}
                          style={{ background: 'none', border: 'none', color: '#f1f5f9', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', padding: 0, fontSize: '11px' }}
                        >
                          {b.judul}
                        </button>
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#38bdf8' }}>{b.kategori_nama || 'Umum'}</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#cbd5e1' }}>{b.penulis}</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#f59e0b', fontWeight: 'bold' }}>{rupiah(b.harga)}</td>
                      <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'center' }}>
                        <button
                          onClick={() => startEditBook(b)}
                          style={{ padding: '2px 5px', backgroundColor: '#153154', border: '1px solid #274b7a', color: '#38bdf8', cursor: 'pointer', fontSize: '10px', marginRight: '4px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(b.id, b.judul)}
                          style={{ padding: '2px 5px', backgroundColor: '#7f1d1d', border: '1px solid #f87171', color: '#ffffff', cursor: 'pointer', fontSize: '10px' }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: BUKU LIST */}
      {tab === 'buku_list' && (
        <div style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: 0 }}>
              Daftar Seluruh Buku Terbitan AISU ({books.length})
            </h2>
            <button
              onClick={startAddBook}
              style={{ padding: '3px 8px', backgroundColor: '#0284c7', border: '1px solid #38bdf8', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}
            >
              + Tambah Judul Baru
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#091321' }}>
              <thead>
                <tr style={{ backgroundColor: '#112238' }}>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left', width: '30px' }}>ID</th>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'center', width: '45px' }}>Cover</th>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Judul Buku</th>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Kategori</th>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Penulis</th>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>ISBN</th>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Harga</th>
                  <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'center', width: '90px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c' }}>{b.id}</td>
                    <td style={{ padding: '2px', border: '1px solid #1a2f4c', textAlign: 'center' }}>
                      <img
                        src={b.cover}
                        alt="Cover"
                        style={{ width: '32px', height: '48px', objectFit: 'cover', margin: '0 auto', border: '1px solid #1a2f4c' }}
                      />
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c' }}>
                      <button
                        onClick={() => onSelectBookDetail(b.id)}
                        style={{ background: 'none', border: 'none', color: '#f1f5f9', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', padding: 0, fontSize: '11px' }}
                      >
                        {b.judul}
                      </button>
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#38bdf8' }}>{b.kategori_nama || 'Umum'}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#cbd5e1' }}>{b.penulis}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#94a3b8' }}>{b.isbn || '-'}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#f59e0b', fontWeight: 'bold' }}>{rupiah(b.harga)}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'center' }}>
                      <button
                        onClick={() => startEditBook(b)}
                        style={{ padding: '2px 5px', backgroundColor: '#153154', border: '1px solid #274b7a', color: '#38bdf8', cursor: 'pointer', fontSize: '10px', marginRight: '4px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(b.id, b.judul)}
                        style={{ padding: '2px 5px', backgroundColor: '#7f1d1d', border: '1px solid #f87171', color: '#ffffff', cursor: 'pointer', fontSize: '10px' }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: FORM TAMBAH / EDIT BUKU */}
      {tab === 'buku_form' && (
        <form onSubmit={handleBookSubmit} style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #1a2f4c', paddingBottom: '6px' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: 0 }}>
              {editingBookId ? `Edit Data Buku (ID: ${editingBookId})` : '+ Tambah Judul Buku Baru'}
            </h2>
            <button
              type="button"
              onClick={() => setTab('buku_list')}
              style={{ padding: '2px 6px', backgroundColor: '#153154', border: '1px solid #274b7a', color: '#e2e8f0', cursor: 'pointer', fontSize: '10px' }}
            >
              &larr; Kembali ke List
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Judul Buku: *</label>
              <input
                type="text"
                value={bookForm.judul}
                onChange={(e) => setBookForm({ ...bookForm, judul: e.target.value })}
                required
                placeholder="Contoh: Algoritma Genetika Terapan"
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Kategori Keilmuan: *</label>
              <select
                value={bookForm.kategori_id}
                onChange={(e) => setBookForm({ ...bookForm, kategori_id: Number(e.target.value) })}
                required
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nama}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Penulis: *</label>
              <input
                type="text"
                value={bookForm.penulis}
                onChange={(e) => setBookForm({ ...bookForm, penulis: e.target.value })}
                required
                placeholder="Contoh: Dr. Tomy Satria Alasi, M.Kom."
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Editor: (opsional)</label>
              <input
                type="text"
                value={bookForm.editor}
                onChange={(e) => setBookForm({ ...bookForm, editor: e.target.value })}
                placeholder="Contoh: Ir. Surya Dharma, M.T."
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Harga Buku (Rp): *</label>
              <input
                type="number"
                value={bookForm.harga}
                onChange={(e) => setBookForm({ ...bookForm, harga: Number(e.target.value) })}
                required
                min={0}
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Nomor ISBN: (opsional)</label>
              <input
                type="text"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                placeholder="978-623-..."
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Jumlah Halaman:</label>
              <input
                type="number"
                value={bookForm.halaman}
                onChange={(e) => setBookForm({ ...bookForm, halaman: Number(e.target.value) })}
                min={1}
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Cover Buku (Upload JPG/PNG atau Auto-Generate):</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleCoverUpload}
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '3px 6px', fontSize: '10px', boxSizing: 'border-box' }}
              />
              <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
                Jika tidak di-upload, sistem GD AISU akan meng-generate cover otomatis berlatar navy.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Sinopsis Buku:</label>
            <textarea
              rows={3}
              value={bookForm.sinopsis}
              onChange={(e) => setBookForm({ ...bookForm, sinopsis: e.target.value })}
              placeholder="Tuliskan uraian ringkasan isi buku untuk pembaca dan meta description SEO..."
              style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontWeight: 600, marginBottom: '2px' }}>Keterangan Cetak / Format Fisik:</label>
            <input
              type="text"
              value={bookForm.keterangan}
              onChange={(e) => setBookForm({ ...bookForm, keterangan: e.target.value })}
              placeholder="Contoh: Edisi Pertama, Kertas Bookpaper 72gr, Finishing Doff"
              style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
            />
          </div>

          <h3 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '12px 0 6px' }}>
            Tautan Pembelian Marketplace
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '2px' }}>Link Tokopedia:</label>
              <input
                type="url"
                value={bookForm.link_tokopedia}
                onChange={(e) => setBookForm({ ...bookForm, link_tokopedia: e.target.value })}
                placeholder="https://tokopedia.com/..."
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '2px' }}>Link Shopee:</label>
              <input
                type="url"
                value={bookForm.link_shopee}
                onChange={(e) => setBookForm({ ...bookForm, link_shopee: e.target.value })}
                placeholder="https://shopee.co.id/..."
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '2px' }}>Link Google Books:</label>
              <input
                type="url"
                value={bookForm.link_google_book}
                onChange={(e) => setBookForm({ ...bookForm, link_google_book: e.target.value })}
                placeholder="https://books.google.co.id/..."
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '2px' }}>Link Google Play Books:</label>
              <input
                type="url"
                value={bookForm.link_google_play}
                onChange={(e) => setBookForm({ ...bookForm, link_google_play: e.target.value })}
                placeholder="https://play.google.com/store/books/..."
                style={{ width: '100%', backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
            <button
              type="submit"
              style={{ padding: '5px 12px', backgroundColor: '#0284c7', border: '1px solid #38bdf8', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}
            >
              {editingBookId ? 'Perbarui Data Buku' : 'Simpan Buku Baru'}
            </button>
            <button
              type="button"
              onClick={() => setTab('buku_list')}
              style={{ padding: '5px 10px', backgroundColor: '#153154', border: '1px solid #274b7a', color: '#cbd5e1', cursor: 'pointer', fontSize: '11px' }}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* 4. TAB: KATEGORI CRUD */}
      {tab === 'kategori' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          {/* Form Kategori */}
          <div style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', padding: '10px' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', margin: '0 0 6px' }}>
              {editingCategoryId ? 'Edit Nama Kategori' : '+ Tambah Kategori Baru'}
            </h2>
            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={categoryNameInput}
                onChange={(e) => setCategoryNameInput(e.target.value)}
                placeholder="Contoh: Rekayasa Komputasi & Grafika"
                required
                style={{ flex: 1, backgroundColor: '#070e17', color: '#e2e8f0', border: '1px solid #233e64', padding: '4px 6px', fontSize: '11px' }}
              />
              <button
                type="submit"
                style={{ padding: '4px 10px', backgroundColor: '#0284c7', border: '1px solid #38bdf8', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}
              >
                {editingCategoryId ? 'Simpan' : '+ Tambah'}
              </button>
              {editingCategoryId && (
                <button
                  type="button"
                  onClick={() => { setEditingCategoryId(null); setCategoryNameInput(''); }}
                  style={{ padding: '4px 8px', backgroundColor: '#153154', border: '1px solid #274b7a', color: '#cbd5e1', cursor: 'pointer', fontSize: '11px' }}
                >
                  Batal
                </button>
              )}
            </form>
          </div>

          {/* List Kategori */}
          <div style={{ backgroundColor: '#0d1a2b', border: '1px solid #1a2f4c', padding: '10px' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '11px', fontWeight: 'bold', margin: '0 0 6px' }}>
              Daftar Kategori Bidang Keilmuan ({categories.length})
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#091321' }}>
                <thead>
                  <tr style={{ backgroundColor: '#112238' }}>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left', width: '35px' }}>ID</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left' }}>Nama Kategori</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'left', width: '100px' }}>Jumlah Buku</th>
                    <th style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'center', width: '90px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => {
                    const count = books.filter(b => b.kategori_id === c.id).length;
                    return (
                      <tr key={c.id}>
                        <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c' }}>{c.id}</td>
                        <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', fontWeight: 'bold', color: '#f1f5f9' }}>
                          {c.nama}
                        </td>
                        <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', color: '#38bdf8' }}>
                          {count} Judul Buku
                        </td>
                        <td style={{ padding: '4px 6px', border: '1px solid #1a2f4c', textAlign: 'center' }}>
                          <button
                            onClick={() => { setEditingCategoryId(c.id); setCategoryNameInput(c.nama); }}
                            style={{ padding: '2px 5px', backgroundColor: '#153154', border: '1px solid #274b7a', color: '#38bdf8', cursor: 'pointer', fontSize: '10px', marginRight: '4px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.nama)}
                            style={{ padding: '2px 5px', backgroundColor: '#7f1d1d', border: '1px solid #f87171', color: '#ffffff', cursor: 'pointer', fontSize: '10px' }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
