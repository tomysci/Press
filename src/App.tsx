import { useState, useEffect } from 'react';
import { Buku, Kategori } from './types';
import { INITIAL_BOOKS, INITIAL_CATEGORIES } from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { KatalogView } from './components/KatalogView';
import { DetailView } from './components/DetailView';
import { PengirimanView } from './components/PengirimanView';
import { TentangView } from './components/TentangView';
import { AdminView } from './components/AdminView';
import { CodeExplorerModal } from './components/CodeExplorerModal';

export default function App() {
  // Persistence state
  const [books, setBooks] = useState<Buku[]>(() => {
    try {
      const saved = localStorage.getItem('aisu_books_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BOOKS;
  });

  const [categories, setCategories] = useState<Kategori[]>(() => {
    try {
      const saved = localStorage.getItem('aisu_categories_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CATEGORIES;
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('aisu_admin_logged') === 'true';
  });

  const [codeExplorerOpen, setCodeExplorerOpen] = useState(false);
  const [codeExplorerPath, setCodeExplorerPath] = useState('/config.php');

  const [rawTextModal, setRawTextModal] = useState<{ title: string; content: string } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aisu_books_v1', JSON.stringify(books));
    } catch {
      // ignore
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('aisu_categories_v1', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('aisu_admin_logged', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Navigation Helper
  const navigateTo = (view: string, bookId?: number) => {
    setCurrentView(view);
    if (bookId !== undefined) {
      setSelectedBookId(bookId);
    }
    window.scrollTo(0, 0);
  };

  const selectedBook = selectedBookId ? books.find(b => b.id === selectedBookId) : null;

  // Book Handlers
  const handleAddBook = (bookData: Omit<Buku, 'id' | 'created_at'>) => {
    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    const newBook: Buku = {
      ...bookData,
      id: newId,
      created_at: new Date().toISOString(),
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const handleUpdateBook = (updated: Buku) => {
    setBooks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  };

  const handleDeleteBook = (id: number) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    if (selectedBookId === id) {
      setSelectedBookId(null);
      setCurrentView('katalog');
    }
  };

  // Category Handlers
  const handleAddCategory = (nama: string) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories(prev => [...prev, { id: newId, nama }]);
  };

  const handleUpdateCategory = (id: number, nama: string) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, nama } : c)));
    // Juga update nama kategori di buku terkait
    setBooks(prev => prev.map(b => (b.kategori_id === id ? { ...b, kategori_nama: nama } : b)));
  };

  const handleDeleteCategory = (id: number): boolean => {
    const isUsed = books.some(b => b.kategori_id === id);
    if (isUsed) {
      return false;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  };

  // Open Raw XML Sitemap
  const handleOpenSitemap = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aisu.or.id/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.aisu.or.id/katalog.php</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.aisu.or.id/pengiriman.php</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.aisu.or.id/tentang.php</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
${books.map(b => `  <url>
    <loc>https://www.aisu.or.id/detail.php?id=${b.id}</loc>
    <lastmod>${b.created_at.slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    setRawTextModal({ title: 'sitemap.xml (Dynamic PHP)', content: xml });
  };

  // Open robots.txt
  const handleOpenRobots = () => {
    const txt = `User-agent: *
Disallow: /admin/
Disallow: /config.php
Disallow: /sql/
Allow: /
Allow: /assets/
Allow: /uploads/cover/

Sitemap: https://www.aisu.or.id/sitemap.xml`;
    setRawTextModal({ title: 'robots.txt', content: txt });
  };

  return (
    <div style={{
      backgroundColor: '#070e17',
      color: '#cbd5e1',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '11px',
      lineHeight: 1.45,
    }}>
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={navigateTo}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenCodeExplorer={() => {
          setCodeExplorerPath('/config.php');
          setCodeExplorerOpen(true);
        }}
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: '12px 0 20px', fontSize: '11px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 10px' }}>
          {currentView === 'home' && (
            <HomeView
              books={books}
              onSelectBook={(id) => navigateTo('detail', id)}
              onNavigateKatalog={() => navigateTo('katalog')}
            />
          )}

          {currentView === 'katalog' && (
            <KatalogView
              books={books}
              categories={categories}
              onSelectBook={(id) => navigateTo('detail', id)}
            />
          )}

          {currentView === 'detail' && selectedBook && (
            <DetailView
              book={selectedBook}
              onBackToKatalog={() => navigateTo('katalog')}
              onSelectCategory={(katId) => {
                navigateTo('katalog');
                // kategori filter will be handled in catalog
              }}
            />
          )}

          {currentView === 'pengiriman' && <PengirimanView />}

          {currentView === 'tentang' && <TentangView />}

          {currentView === 'admin' && (
            <AdminView
              books={books}
              categories={categories}
              isLoggedIn={isAdminLoggedIn}
              onLogin={() => setIsAdminLoggedIn(true)}
              onLogout={() => setIsAdminLoggedIn(false)}
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              onDeleteBook={handleDeleteBook}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onSelectBookDetail={(id) => navigateTo('detail', id)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenSitemap={handleOpenSitemap}
        onOpenRobots={handleOpenRobots}
      />

      {/* Code Explorer Modal */}
      <CodeExplorerModal
        isOpen={codeExplorerOpen}
        onClose={() => setCodeExplorerOpen(false)}
        initialPath={codeExplorerPath}
      />

      {/* Raw XML / TXT Viewer Modal */}
      {rawTextModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '12px',
        }}>
          <div style={{
            backgroundColor: '#0d1a2b',
            border: '1px solid #254770',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              padding: '6px 10px',
              backgroundColor: '#091321',
              borderBottom: '1px solid #1a2f4c',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <strong style={{ color: '#38bdf8', fontSize: '11px' }}>{rawTextModal.title}</strong>
              <button
                onClick={() => setRawTextModal(null)}
                style={{ padding: '2px 6px', backgroundColor: '#7f1d1d', border: '1px solid #dc2626', color: '#fff', cursor: 'pointer', fontSize: '10px' }}
              >
                Tutup [X]
              </button>
            </div>
            <pre style={{
              margin: 0,
              padding: '10px',
              overflow: 'auto',
              backgroundColor: '#050a12',
              color: '#34d399',
              fontFamily: 'monospace',
              fontSize: '10px',
              lineHeight: 1.4,
              flex: 1,
            }}>
              {rawTextModal.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
