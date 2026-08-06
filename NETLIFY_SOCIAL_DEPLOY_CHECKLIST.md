# NETLIFY SOCIAL DEPLOY CHECKLIST — V2.0.12

- [ ] `NEXT_PUBLIC_SITE_URL` diisi dengan URL HTTPS produksi.
- [ ] `npm install` lulus.
- [ ] `npm run build` lulus.
- [ ] Artikel publik tidak menghasilkan 404.
- [ ] Canonical tidak mengarah ke localhost.
- [ ] `og:image` dapat dibuka tanpa login.
- [ ] Gambar sosial 1200 × 630.
- [ ] Facebook Sharing Debugger menampilkan gambar.
- [ ] WhatsApp menampilkan kartu lengkap.
- [ ] X menampilkan large image card.
- [ ] LinkedIn menampilkan gambar, judul, dan ringkasan.
- [ ] Cache platform sosial di-refresh setelah perubahan thumbnail.

## Batas produksi penting

Metadata artikel yang dibuat hanya di localStorage tidak dapat dibaca crawler eksternal. Sebelum peluncuran produksi penuh, pindahkan artikel terbit dan URL media ke penyimpanan server/database atau layanan CMS produksi.
