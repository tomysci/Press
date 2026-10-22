import test from 'node:test';
import assert from 'node:assert/strict';
import { rupiah, filterBooks, paginateBooks, generateSvgCover, buildJsonLd } from './publisher';
import { Buku } from '../types';

const sampleBooks: Buku[] = [
  {
    id: 1,
    kategori_id: 1,
    judul: 'Algoritma Komputasi Cerdas',
    penulis: 'Dr. Tomy Satria Alasi',
    harga: 85000,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 2,
    kategori_id: 2,
    judul: 'Dasar Pemrograman Web Native',
    penulis: 'Rina Marlina',
    harga: 50000,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 3,
    kategori_id: 1,
    judul: 'Arsitektur Jaringan Enterprise',
    penulis: 'Surya Dharma',
    harga: 120000,
    created_at: '2026-03-01T08:00:00Z',
  },
];

test('rupiah formatting formats correctly with thousands separator', () => {
  assert.equal(rupiah(85000), 'Rp 85.000');
  assert.equal(rupiah(1250000), 'Rp 1.250.000');
  assert.equal(rupiah(0), 'Rp 0');
});

test('filterBooks filters strictly by title only', () => {
  // Query "Web" matches book 2
  const filtered = filterBooks(sampleBooks, { q: 'Web' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 2);

  // Searching by author name should NOT match because rule strictly says title only
  const byAuthor = filterBooks(sampleBooks, { q: 'Tomy' });
  assert.equal(byAuthor.length, 0);
});

test('filterBooks filters by category id', () => {
  const filtered = filterBooks(sampleBooks, { kategori_id: 1 });
  assert.equal(filtered.length, 2);
});

test('filterBooks sorts by harga_asc and harga_desc', () => {
  const asc = filterBooks(sampleBooks, { sort: 'harga_asc' });
  assert.equal(asc[0].harga, 50000);
  assert.equal(asc[2].harga, 120000);

  const desc = filterBooks(sampleBooks, { sort: 'harga_desc' });
  assert.equal(desc[0].harga, 120000);
  assert.equal(desc[2].harga, 50000);
});

test('filterBooks sorts by judul_asc', () => {
  const sorted = filterBooks(sampleBooks, { sort: 'judul_asc' });
  assert.equal(sorted[0].judul, 'Algoritma Komputasi Cerdas');
  assert.equal(sorted[1].judul, 'Arsitektur Jaringan Enterprise');
  assert.equal(sorted[2].judul, 'Dasar Pemrograman Web Native');
});

test('paginateBooks slices items and computes pages correctly', () => {
  const p1 = paginateBooks(sampleBooks, 1, 2);
  assert.equal(p1.items.length, 2);
  assert.equal(p1.totalPages, 2);
  assert.equal(p1.totalRows, 3);
  assert.equal(p1.currentPage, 1);

  const p2 = paginateBooks(sampleBooks, 2, 2);
  assert.equal(p2.items.length, 1);
  assert.equal(p2.items[0].id, 3);
});

test('generateSvgCover produces valid data uri with title and author', () => {
  const cover = generateSvgCover('Test Judul', 'Penulis Uji');
  assert.ok(cover.startsWith('data:image/svg+xml;charset=utf-8,'));
  assert.ok(cover.includes('PENERBIT%20BUKU%20AISU'));
  assert.ok(cover.includes('Test%20Judul'));
});

test('buildJsonLd creates valid Schema.org Book representation', () => {
  const jsonLd = buildJsonLd(sampleBooks[0], 'AISU', 'https://www.aisu.or.id/aisu.png');
  assert.equal(jsonLd['@context'], 'https://schema.org');
  assert.equal(jsonLd['@type'], 'Book');
  assert.equal(jsonLd['name'], 'Algoritma Komputasi Cerdas');
});
