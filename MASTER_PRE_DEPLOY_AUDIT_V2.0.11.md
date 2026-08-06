# Audit Menyeluruh Pra-Deploy V2.0.11

## Cakupan
Audit mencakup 38 route, 84 file TypeScript/TSX, navigasi publik, login, pendaftaran, halaman penulis, dashboard penulis, dashboard administrator, alur editorial, penerbitan, galeri media, profil penulis, YouTube, halaman kategori, halaman artikel, footer, dan pencarian.

## Hasil audit statis
- Pemeriksaan sintaks 84 file TypeScript/TSX: LULUS, 0 kesalahan sintaks.
- Pemeriksaan 38 pola route: LULUS.
- Pemeriksaan 21 tautan lokal statis: LULUS, 0 tautan tanpa route.
- Pemeriksaan footer: LULUS, satu sumber render pada layout bahasa.
- Data contoh pada halaman peran dan galeri YouTube: DIHAPUS.
- Tombol pemberitahuan tanpa fungsi: DIHAPUS.
- Pencarian header: DIAKTIFKAN dan diarahkan ke hasil pencarian.
- Ringkasan penulis: membaca data artikel nyata.

## Bahasa pengguna
Istilah teknis pengembangan telah diganti dengan bahasa yang lebih mudah dipahami. Istilah yang dipertahankan hanya nama layanan atau standar yang memang perlu diketahui pengguna, seperti YouTube, ORCID, DOI, SEO, dan format file.

## Catatan validasi runtime
`npm install` tidak dapat diselesaikan di lingkungan pembuatan karena registry internal tidak menyediakan paket resmi `@types/node@22.17.0`. Karena itu, pengujian `npm run build` dan `npm run dev` wajib dilakukan di Mac sebelum deploy Netlify.
