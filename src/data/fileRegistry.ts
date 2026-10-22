export interface ProjectFile {
  path: string;
  name: string;
  category: 'Root PHP' | 'Admin PHP' | 'SQL & Assets' | 'Dokumentasi & Config';
  description: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  { path: '/config.php', name: 'config.php', category: 'Root PHP', description: 'Konfigurasi DB, kredensial admin, fungsi helper, SEO render_header/render_footer, dan auto-cover generator GD.' },
  { path: '/index.php', name: 'index.php', category: 'Root PHP', description: 'Halaman Beranda Publik menampilkan 6–8 buku terbaru AISU, branding, dan footer kontak.' },
  { path: '/katalog.php', name: 'katalog.php', category: 'Root PHP', description: 'Katalog publik dengan pencarian khusus Judul, filter kategori, 4 opsi sorting, dan pagination.' },
  { path: '/detail.php', name: 'detail.php', category: 'Root PHP', description: 'Halaman detail buku lengkap, link marketplace (Tokopedia, Shopee, Google Book, Play), WA, dan JSON-LD Schema.org Book.' },
  { path: '/pengiriman.php', name: 'pengiriman.php', category: 'Root PHP', description: 'Informasi pengiriman, jasa kurir (JNE, J&T, SiCepat, Pos), lead time, dan standar packing.' },
  { path: '/tentang.php', name: 'tentang.php', category: 'Root PHP', description: 'Profil resmi Penerbit AISU, fokus penerbitan, legalitas, kontak, dan panduan pengajuan naskah.' },
  { path: '/sitemap.php', name: 'sitemap.php', category: 'Root PHP', description: 'Dynamic XML sitemap terstruktur untuk Googlebot dan mesin pencari.' },
  { path: '/robots.txt', name: 'robots.txt', category: 'Root PHP', description: 'Aturan crawling robots.txt, memblokir akses /admin/ dan memuat sitemap.' },
  { path: '/.htaccess', name: '.htaccess', category: 'Root PHP', description: 'Konfigurasi Apache URL rewrite (pretty URL), proteksi file sistem, dan caching asset.' },
  { path: '/admin/login.php', name: 'admin/login.php', category: 'Admin PHP', description: 'Form login admin hardcoded session (tanpa tabel user).' },
  { path: '/admin/index.php', name: 'admin/index.php', category: 'Admin PHP', description: 'Dashboard admin statistik ringkas total buku dan kategori.' },
  { path: '/admin/buku.php', name: 'admin/buku.php', category: 'Admin PHP', description: 'CRUD Buku lengkap: tambah, edit, hapus, upload cover JPG/PNG atau auto-generate GD.' },
  { path: '/admin/kategori.php', name: 'admin/kategori.php', category: 'Admin PHP', description: 'CRUD Kategori keilmuan dengan proteksi relasi data buku.' },
  { path: '/admin/logout.php', name: 'admin/logout.php', category: 'Admin PHP', description: 'Pembersihan session admin dan redirect login.' },
  { path: '/uploads/cover/.htaccess', name: 'uploads/cover/.htaccess', category: 'Dokumentasi & Config', description: 'Pengamanan folder uploads dari eksekusi skrip PHP jahat.' },
  { path: '/assets/style.css', name: 'assets/style.css', category: 'SQL & Assets', description: 'CSS murni sangat minimalis (< 3KB), font max 11px, tanpa animasi, mobile-first dark navy.' },
  { path: '/sql/schema.sql', name: 'sql/schema.sql', category: 'SQL & Assets', description: 'Skema basis data 2 tabel (kategori & buku) + 8 data dummy buku AISU.' },
  { path: '/README.md', name: 'README.md', category: 'Dokumentasi & Config', description: 'Panduan lengkap instalasi database, web server, Google Search Console, dan pergantian password.' },
];
