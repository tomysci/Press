import React from 'react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, bookId?: number) => void;
  isAdminLoggedIn: boolean;
  onOpenCodeExplorer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  isAdminLoggedIn,
  onOpenCodeExplorer,
}) => {
  return (
    <header style={{
      backgroundColor: '#0d1828',
      borderBottom: '1px solid #1a2e4a',
      padding: '8px 0',
      fontSize: '11px',
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {/* Brand & Logo */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
          }}
          title="Ke Beranda Penerbit AISU"
        >
          <img
            src="https://www.aisu.or.id/aisu.png"
            alt="Logo AISU"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            onError={(e) => {
              // Fallback logo placeholder if network blocked
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><rect width="28" height="28" fill="%230284c7"/><text x="14" y="18" fill="%23fff" font-size="10" font-weight="bold" text-anchor="middle">AISU</text></svg>';
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '11px' }}>
              Penerbit AISU
            </span>
            <span style={{ color: '#94a3b8', fontSize: '10px' }}>
              Asosiasi Informatika Sumatera Utara
            </span>
          </div>
        </button>

        {/* Navigation Menu */}
        <nav aria-label="Menu Utama" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              padding: '3px 7px',
              backgroundColor: currentView === 'home' ? '#1a3254' : '#112035',
              border: `1px solid ${currentView === 'home' ? '#38bdf8' : '#1f3656'}`,
              color: currentView === 'home' ? '#38bdf8' : '#e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('katalog')}
            style={{
              padding: '3px 7px',
              backgroundColor: currentView === 'katalog' ? '#1a3254' : '#112035',
              border: `1px solid ${currentView === 'katalog' ? '#38bdf8' : '#1f3656'}`,
              color: currentView === 'katalog' ? '#38bdf8' : '#e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Katalog Buku
          </button>

          <button
            onClick={() => onNavigate('pengiriman')}
            style={{
              padding: '3px 7px',
              backgroundColor: currentView === 'pengiriman' ? '#1a3254' : '#112035',
              border: `1px solid ${currentView === 'pengiriman' ? '#38bdf8' : '#1f3656'}`,
              color: currentView === 'pengiriman' ? '#38bdf8' : '#e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Pengiriman
          </button>

          <button
            onClick={() => onNavigate('tentang')}
            style={{
              padding: '3px 7px',
              backgroundColor: currentView === 'tentang' ? '#1a3254' : '#112035',
              border: `1px solid ${currentView === 'tentang' ? '#38bdf8' : '#1f3656'}`,
              color: currentView === 'tentang' ? '#38bdf8' : '#e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Tentang
          </button>

          <button
            onClick={() => onNavigate('admin')}
            style={{
              padding: '3px 7px',
              backgroundColor: currentView === 'admin' ? '#0f392b' : '#0c221a',
              border: `1px solid ${isAdminLoggedIn ? '#34d399' : '#1f3656'}`,
              color: isAdminLoggedIn ? '#34d399' : '#cbd5e1',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: isAdminLoggedIn ? 'bold' : 'normal',
            }}
          >
            {isAdminLoggedIn ? 'Admin Panel' : 'Admin'}
          </button>

          <button
            onClick={onOpenCodeExplorer}
            style={{
              padding: '3px 8px',
              backgroundColor: '#1e293b',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
            title="Periksa seluruh file asli Native PHP, SQL, .htaccess, dan CSS"
          >
            &lt;/&gt; Source File PHP (18 File)
          </button>
        </nav>
      </div>
    </header>
  );
};
