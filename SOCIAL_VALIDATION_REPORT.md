# SOCIAL VALIDATION REPORT — V2.0.12

## Pemeriksaan otomatis

- Pemeriksaan sintaks seluruh TypeScript/TSX: LULUS, 0 diagnostic.
- Gambar cadangan: tersedia, PNG 1200 × 630.
- Route Open Graph Image: tersedia.
- Route Twitter Image: tersedia.
- Tombol WhatsApp, Facebook, X, dan LinkedIn: memakai URL publik yang sudah dibersihkan.
- Canonical: absolut dan berbasis HTTPS.
- Larangan Blob/Base64/localhost: diterapkan pada pilihan gambar sosial produksi.

## Pemeriksaan yang wajib dilakukan setelah Netlify aktif

1. Isi `NEXT_PUBLIC_SITE_URL` dengan URL Netlify/domain final.
2. Deploy dan buka URL artikel publik.
3. Jalankan Facebook Sharing Debugger dan minta scrape ulang.
4. Kirim URL ke WhatsApp.
5. Uji Facebook, X, dan LinkedIn.
6. Pastikan gambar, judul, ringkasan, nama situs, dan URL muncul.

Pengujian crawler nyata tidak dapat dilakukan melalui localhost.
