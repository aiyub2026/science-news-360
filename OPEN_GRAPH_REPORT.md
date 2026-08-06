# OPEN GRAPH REPORT — V2.0.12

## Implementasi

- Metadata artikel dibangun melalui `generateMetadata` pada route artikel.
- `og:type`, judul, ringkasan, URL kanonis, nama situs, gambar, ukuran, alt text, waktu publikasi, penulis, bagian, dan tag tersedia.
- Semua URL dibuat absolut menggunakan `NEXT_PUBLIC_SITE_URL`.
- Gambar sosial dinamis tersedia melalui route `opengraph-image` berukuran 1200 × 630.
- Gambar cadangan tetap tersedia pada `public/social/default-social-1200x630.png`.
- URL `blob:`, `data:`, `localhost`, path komputer, dan HTTP nonpublik tidak diterima sebagai gambar sosial produksi.

## Catatan arsitektur

Artikel bawaan server memperoleh metadata lengkap pada respons HTML. Artikel yang hanya tersimpan di browser memperoleh kartu bermerek berdasarkan slug dan metadata fallback. Judul/ringkasan CMS yang sepenuhnya dinamis baru dapat dibaca crawler sosial secara sempurna setelah artikel dipindahkan ke penyimpanan server/database produksi.
