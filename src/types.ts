export interface Kategori {
  id: number;
  nama: string;
}

export interface Buku {
  id: number;
  kategori_id: number;
  kategori_nama?: string;
  judul: string;
  penulis: string;
  editor?: string;
  halaman?: number;
  isbn?: string;
  harga: number;
  sinopsis?: string;
  keterangan?: string;
  cover?: string;
  link_tokopedia?: string;
  link_shopee?: string;
  link_google_book?: string;
  link_google_play?: string;
  created_at: string;
}

export type SortOption = 'terbaru' | 'harga_asc' | 'harga_desc' | 'judul_asc';

export interface SearchParams {
  q: string;
  kategori_id: number;
  sort: SortOption;
  page: number;
  per_page: number;
}
