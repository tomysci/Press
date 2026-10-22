import { Buku, SearchParams } from '../types';

export function rupiah(value: number): string {
  const rounded = Math.round(Number(value) || 0);
  return 'Rp ' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function filterBooks(books: Buku[], params: Partial<SearchParams>): Buku[] {
  let result = [...books];

  // Aturan keras: Pencarian HANYA berdasarkan Judul
  if (params.q && params.q.trim() !== '') {
    const query = params.q.trim().toLowerCase();
    result = result.filter(b => b.judul.toLowerCase().includes(query));
  }

  // Filter Kategori
  if (params.kategori_id && params.kategori_id > 0) {
    result = result.filter(b => b.kategori_id === params.kategori_id);
  }

  // Sorting
  const sort = params.sort || 'terbaru';
  if (sort === 'harga_asc') {
    result.sort((a, b) => a.harga - b.harga);
  } else if (sort === 'harga_desc') {
    result.sort((a, b) => b.harga - a.harga);
  } else if (sort === 'judul_asc') {
    result.sort((a, b) => a.judul.localeCompare(b.judul, 'id'));
  } else {
    // terbaru
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
}

export function paginateBooks(books: Buku[], page = 1, perPage = 8) {
  const totalRows = books.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const offset = (currentPage - 1) * perPage;
  const items = books.slice(offset, offset + perPage);

  return {
    items,
    currentPage,
    totalPages,
    totalRows,
  };
}

export function generateSvgCover(title: string, author: string): string {
  const safeTitle = (title || 'BUKU BARU').slice(0, 50);
  const safeAuthor = (author || 'PENULIS AISU').slice(0, 45);

  // Split title into lines
  const words = safeTitle.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).length < 20) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);

  const titleSvgLines = lines
    .slice(0, 4)
    .map((l, i) => `<text x="200" y="${220 + i * 28}" fill="#f8fafc" font-size="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(l)}</text>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1526"/>
        <stop offset="100%" stop-color="#040913"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    <rect x="14" y="14" width="372" height="572" fill="none" stroke="#254770" stroke-width="2"/>
    <rect x="20" y="20" width="360" height="560" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.6"/>
    
    <!-- Header -->
    <text x="200" y="65" fill="#38bdf8" font-size="14" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="bold" letter-spacing="2" text-anchor="middle">PENERBIT BUKU AISU</text>
    <line x1="60" y1="80" x2="340" y2="80" stroke="#f59e0b" stroke-width="1.5"/>
    
    <!-- Judul -->
    ${titleSvgLines}
    
    <!-- Divider -->
    <line x1="120" y1="380" x2="280" y2="380" stroke="#254770" stroke-width="1"/>
    
    <!-- Penulis -->
    <text x="200" y="420" fill="#94a3b8" font-size="12" font-family="-apple-system, BlinkMacSystemFont, sans-serif" text-anchor="middle">Karya Penulis:</text>
    <text x="200" y="445" fill="#38bdf8" font-size="15" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="600" text-anchor="middle">${escapeXml(safeAuthor)}</text>
    
    <!-- Footer -->
    <rect x="35" y="525" width="330" height="40" fill="#0d1f35" stroke="#1d3b60" stroke-width="1"/>
    <text x="200" y="542" fill="#cbd5e1" font-size="11" font-family="-apple-system, BlinkMacSystemFont, sans-serif" text-anchor="middle">Asosiasi Informatika Sumatera Utara</text>
    <text x="200" y="556" fill="#f59e0b" font-size="10" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-weight="bold" text-anchor="middle">Edisi Cetak Berstandar ISBN Resmi</text>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function buildJsonLd(book: Buku, publisherName: string, publisherLogo: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.judul,
    "author": {
      "@type": "Person",
      "name": book.penulis
    },
    ...(book.editor ? {
      "editor": {
        "@type": "Person",
        "name": book.editor
      }
    } : {}),
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo
      }
    },
    "isbn": book.isbn || "",
    "numberOfPages": book.halaman || 0,
    "inLanguage": "id",
    "description": book.sinopsis ? book.sinopsis.slice(0, 160) : `Buku ${book.judul} oleh ${book.penulis}`,
    "offers": {
      "@type": "Offer",
      "price": String(book.harga),
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock"
    }
  };
}
