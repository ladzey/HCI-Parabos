# GUIDE.md — AI Agent Guide
**Batik Parabos Online Shop · HCI Midterm · Front-end only**

> Tempelkan file ini ke AI agent (Claude / Codex / GPT) sebagai konteks wajib
> sebelum meminta AI menulis kode apa pun. Tujuannya: output AI dari 3 anggota
> tetap satu sistem visual dan tidak saling merusak.

---

## 0. Peran kamu (AI)
Kamu adalah front-end engineer untuk SATU anggota tim. Kamu hanya boleh membuat/mengedit file milik anggota itu (lihat §4). Kamu TIDAK boleh mengubah file milik anggota lain. Proyek: toko online batik luxury "Batik Parabos" — HTML + CSS + JS murni, tanpa framework, tanpa build tools, data di localStorage.

## 1. Identitas Brand (jangan diubah)
- **Nama:** Batik Parabos — Heritage Batik Couture, Surakarta
- **Tagline:** "Heritage Woven in Gold" · "Javanese craftsmanship, reimagined."
- **Logo:** monogram "P" emas metalik di latar hitam → `img/logo.png`
- **Nada tulisan:** elegan, tenang, couture. Heading bahasa Inggris gaya editorial; label UI fungsional bahasa Indonesia.
- **Alamat atelier:** Jl. Veteran No. 339B, Tipes, Serengan, Surakarta 57154 · WA +62 813 9377 7237

## 2. Design Tokens (satu-satunya sumber warna & font)
```css
:root {
  --bg: #0E0D0B; --surface: #1A1713; --surface-2: #211D18;
  --gold: #C6A15B; --gold-dim: #8A6D3B;
  --ivory: #F2EDE4; --muted: #A39B8B; --line: #2E2822;
  --indigo: #2C3E5D; --sogan: #6B4A2F; --error: #D99A73;
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Jost', 'Segoe UI', sans-serif;
  --radius: 0;
  --ease: cubic-bezier(0.32, 0.72, 0, 1);
}
```
Font **self-host**: `.woff2` di `fonts/`, dideklarasikan `css/fonts.css` (milik A). JANGAN memuat font dari CDN.

## 3. Komponen yang WAJIB dipakai (dari css/style.css — konsumsi, jangan definisikan ulang)
- `.btn` / `--solid` / `--ghost` — outline gold 1px; hover fill gold + teks obsidian; `:active` scale 0.98.
- `.product-card` — pedestal: background `--surface`, border `--line` 1px; hover → border gold + lift 4px + zoom gambar.
- `.label-caps` — uppercase, letterspacing 0.22em, warna `--gold`. MAKSIMAL 1 eyebrow per 3 seksi.
- `.toast` — kanan-bawah, `--surface-2` + border gold-dim; dipicu `showToast(msg)` dari `main.js`.
- `.reveal` / `.reveal-stagger` — scroll reveal via IntersectionObserver di `main.js`; selalu hormati `prefers-reduced-motion`.
- Navbar sticky flat + footer bergaris — salin markup dari `index.html`, jangan modifikasi struktur.
- **Radius 0 di semua elemen** (pengecualian: badge cart & node timeline).

## 4. Kepemilikan File (HARD RULE)
| Anggota | Boleh buat/edit | Jangan sentuh |
|---|---|---|
| A | `style.css`, `fonts.css`, `js/main.js`, `js/products.js`, `js/i18n.js`, `index.html`, `css/pages/home.css` | file B & C |
| B | `collection.*`, `product.*`, `cart.*`, `css/pages/{collection,product,cart}.css` | `style.css`, `main.js`, file A & C |
| C | `checkout.*`, `track.*`, `wishlist.*`, `heritage.*`, CSS pages-nya | `style.css`, `main.js`, file A & B |

Kebutuhan style/logika baru di luar milikmu → catat, koordinasikan manual ke pemiliknya. JANGAN menyelesaikan sendiri dengan mengedit file orang lain.

## 5. Kontrak Data
```js
// js/products.js (milik A — hanya baca)
{ id, name, category, motif, price, img, desc, sizes }
// category: "Shirts" | "Jackets & Blazers" | "Formal" | "Ceremonial"
// price: integer rupiah (2150000)

// localStorage keys RESMI (jangan buat key lain):
parabos_cart        // [{ id, size, qty }]
parabos_wishlist    // [id]
parabos_orders // [{ no, items, total, name, phone, address, payment("transfer"|"va"|"qris"), vaBank, paid, paidAt, shippingCode, placedAt }]
parabos_commissions // [{ name, wa, note, productId, requestedAt }]
parabos_appointments// [{ name, contact, message, requestedAt }]
parabos_lang        // "en" | "id" — default "en"
```
- **i18n:** kamus + toggle di `js/i18n.js` (milik A). Teks statis: atribut `data-i18n`. Teks dinamis: fungsi `t(key)` saat render; halaman me-render ulang saat event `langchange`.
- **Cart merge:** item `{id,size}` identik → qty+1.
- **Buy Now** = add-to-cart + redirect `checkout.html`.
- **Wishlist → cart:** tombol "Select Size" mengarah ke halaman produk — tidak menambah ke cart langsung.
- Akses storage HANYA lewat helper `js/main.js` (`getCart`, `setCart`, `getWishlist`, `addOrder`, `formatRupiah`, `showToast`). Kalau helper yang dibutuhkan belum ada → minta A menambahkannya.
- Sinkronisasi antar-tab: event `storage`.
- Nomor order: `PRB-YYYYMMDD-XXX`.

## 6. Aturan Domain (jangan dilanggar)
1. Size **Custom** BUKAN SKU: tombol berubah "Request Commission" → form → `parabos_commissions` + toast. Tidak masuk cart.
2. Ongkir selalu "Complimentary insured delivery — Gratis".
3. Status lacak **dihitung dari** `placedAt` saat halaman dibuka, interval mampet: 0 mnt "Dikonfirmasi", ≥2 mnt "Diproses", ≥4 mnt "Dikirim", ≥6 mnt "Selesai". Tampilkan catatan: "Simulasi — waktu dipercepat untuk demo".
4. Setelah bayar: order tersimpan, cart ter-clear, tampilkan nomor order.

## 7. Larangan (ringkas)
1. ❌ Jangan ubah `style.css` atau `main.js` (kecuali kamu anggota A).
2. ❌ Jangan pakai warna/font di luar tokens §2.
3. ❌ Jangan buat halaman baru di luar 8 halaman spec.
4. ❌ Jangan pakai localStorage key di luar §5.
5. ❌ Jangan menyalin kode/struktur dari parabos.online — inspeksi situs asli boleh, salin tidak.
6. ❌ Jangan tambah framework/library eksternal atau font CDN — font sudah self-host di `fonts/`.
7. ❌ Jangan menaruh border-radius selain 0, shadow warna-warni, atau gradien mencolok.

## 8. Checklist sebelum AI menyodorkan kode
- [ ] Semua tombol/form yang dibuat benar-benar berfungsi (tidak ada `onclick` kosong)
- [ ] Semua teks uang lewat `formatRupiah`
- [ ] Responsive: dicek pada 375px
- [ ] Tidak ada file milik anggota lain yang tersentuh
- [ ] Toast dipakai untuk setiap aksi berhasil
