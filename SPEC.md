# SPEC — Batik Parabos Online Shop
**HCI Midterm Project · Front-end only · Tim 3 orang · 1 minggu**

> Dokumen ini adalah satu-satunya sumber kebenaran (single source of truth) proyek.
> Semua anggota tim & AI agent wajib membaca sebelum menulis kode.

---

## 1. Konteks

### 1.1 Brief Dosen
- Build a **management system** (contoh: library system, restaurant ordering, online shop)
- **Front-end only** — tanpa server, tanpa database, boleh pakai AI
- Tim **3 orang**, presentasi **10 menit** yang wajib mencakup peran & kontribusi tiap anggota
- Kriteria penilaian:
  1. **Visual design** — warna, imagery, layout menyatu sebagai satu sistem
  2. **User experience** — first-time visitor cepat sampai ke core feature; flow sesuai dunia nyata
  3. **Depth of function** — jumlah level, tombol yang benar-benar berfungsi, kelengkapan pekerjaan

### 1.2 Brand Asli: Batik Parabos
- **Situs:** https://parabos.online — Heritage Batik Couture, Surakarta
- **Tagline resmi:** *"Heritage Woven in Gold"* · *"Javanese craftsmanship, reimagined."*
- **Logo:** monogram "P" emas metalik di latar hitam
- **Produk (12 item asli):** Shirts (Hem/Kemeja), Jackets & Blazers, Formal, Ceremonial — harga Rp 2.150.000 – Rp 14.900.000, size S–XXL + Custom
- **Craftsmanship 5 tahap:** Nyorek → Canting → Natural Dyeing → Prada → Tailoring & Embroidery
- **Atelier:** Jl. Veteran No. 339B, Tipes, Serengan, Surakarta 57154 · WhatsApp +62 813 9377 7237 · sadaputraparabos@gmail.com

### 1.3 Posisi Proyek vs Situs Asli
**Brand sama, karya sendiri.** Kami mengambil identitas brand (logo, warna, produk, foto) tetapi merancang layout, komposisi, copy, dan fitur sendiri.

**Delta kami** (fitur yang TIDAK ada di situs asli):
- Checkout multi-step penuh dengan validasi & konfirmasi nomor order
- Wishlist
- Lacak Pesanan dengan status berjalan
- Commission Request untuk size Custom
- Filter & sort katalog

Di presentasi, tunjukkan side-by-side: "apa yang TIDAK ada di situs asli".

### 1.4 Argumen "Management System"
Online shop = sistem manajemen katalog & pesanan end-to-end: katalog dikelola (filter/sort/struktur kategori), transaksi dikelola (cart → checkout → order), pesanan dikelola (nomor order, status timeline). Siapkan 1 kalimat argumen ini di slide.

---

## 2. Design System

### 2.1 Design Tokens (didefinisikan di `:root` `css/style.css`)
```css
:root {
  --bg: #0E0D0B;        /* charcoal hampir hitam */
  --surface: #1A1713;   /* pedestal kartu produk */
  --surface-2: #211D18; /* lapisan lebih tinggi — toast, chip */
  --gold: #C6A15B;      /* aksen emas metalik */
  --gold-dim: #8A6D3B;  /* emas redup — border, garis */
  --ivory: #F2EDE4;     /* teks utama — kontras 15.9:1 */
  --muted: #A39B8B;     /* teks sekunder — kontras 6.6:1 */
  --line: #2E2822;      /* border halus */
  --indigo: #2C3E5D;    /* aksen produk indigo */
  --sogan: #6B4A2F;     /* aksen coklat sogan */
  --error: #D99A73;

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Jost', 'Segoe UI', sans-serif;

  --space-2..6: 8/16/24/40/64px;
  --radius: 0;          /* tajam — couture */
  --measure: 62ch;
  --ease: cubic-bezier(0.32, 0.72, 0, 1);
}
```
**Justifikasi:** identitas brand asli Parabos — monogram emas di latar hitam; dark couture. V1+ = V1 dengan polish (kontras WCAG diaudit, motion bermakna, depth halus).
**Font self-host:** Cormorant Garamond (400/500/600/700 + italic 500) & Jost (300/400/500) diunduh sebagai `.woff2` (latin subset) ke `fonts/`, dideklarasikan di `css/fonts.css` dengan `@font-face`. DILARANG memuat font dari CDN — situs harus 100% offline.

### 2.2 Aturan Visual
- **Dark couture:** latar obsidian + radial glow emas sangat halus di pojok atas (5%). Grain film 2.5% (fixed, pointer-events none).
- **Pedestal kartu:** kartu `--surface`, border `--line` 1px; hover → border emas + lift 4px + zoom gambar halus. Foto produk hitam tetap terpisah dari background.
- Heading `--font-display` besar; label kecil uppercase + letterspacing lebar; bahasa UI heading EN couture, label fungsional ID.
- Tombol: outline gold 1px; hover → fill gold, teks obsidian. `:active` scale 0.98. Semua transisi cubic-bezier kustom — tanpa linear.
- **Radius `0` di semua elemen** — tajam, couture. Satu-satunya pengecualian: badge cart (pill) dan node timeline (lingkaran).
- **Kontras wajib 4.5:1** — token teks teraudit (ivory 15.9:1, muted 6.6:1).
- **Motion bermakna:** reveal via IntersectionObserver (translate, 0.9s) + stagger cascade; selalu hormati `prefers-reduced-motion`.
- **Eyebrow (label-caps) dibatasi:** maksimal 1 per 3 seksi.
- **Layout:** Home = hero full-screen "Heritage Woven in Gold" + featured grid 4 produk + strip 5 tahap craft + band atelier. Collection = grid pedestal 4 kolom. Product = foto kiri besar. Footer flat bergaris emas-dim.

### 2.3 Responsive
Mobile-first. Breakpoint wajib diuji: **375 / 768 / 1440 px**.

---

## 3. Halaman & Fitur (8 halaman, semua tombol harus hidup)

| # | Halaman | File | Fitur wajib |
|---|---|---|---|
| 1 | Home | `index.html` | Hero full-screen "Heritage Woven in Gold", 4 featured products, strip 5 tahap craftsmanship, CTA atelier |
| 2 | Koleksi | `collection.html` | Grid 12 produk; filter kategori (All / Shirts / Jackets & Blazers / Formal / Ceremonial); sort harga (rendah→tinggi, tinggi→rendah); hover pedestal |
| 3 | Detail | `product.html?id=` | Foto besar, nama, deskripsi motif, harga, size S–XXL, Add to Cart (badge update), Buy Now (→ checkout), tambah ke Wishlist; **size Custom → Commission Request** (bukan cart) |
| 4 | Cart | `cart.html` | List item, qty stepper, hapus item, subtotal, tombol → checkout |
| 5 | Checkout | `checkout.html` | Alur 3 layar: **form** (data penerima tervalidasi + 3 metode: Bank Transfer / **Virtual Account** / QRIS) **layar instruksi pembayaran** per metode (detail rekening / nomor VA per bank BCA/Mandiri/BNI/BRI / QR) + **simulasi gateway: progress bar 5 detik → otomatis terbayar** → **layar sukses**: nomor order + **kode pengiriman** `PRB-SHP-XXXXXX`, cart ter-clear saat Place Order |
| 6 | Wishlist | `wishlist.html` | Item tersimpan, hapus; **"Select Size" → halaman produk** (item wishlist di-highlight — ukuran diputuskan di tempat yang benar) |
| 7 | Heritage | `heritage.html` | Cerita Solo, 5 tahap craftsmanship (Nyorek → Canting → Natural Dyeing → Prada → Tailoring), profil atelier + form appointment (nama, email/WA, pesan → localStorage + toast) |
| 8 | Lacak | `track.html` | Input nomor order → timeline status **time-based** (lihat §4.3) |

### 3.1 Aturan Domain (hasil grilling)
- **Custom bukan SKU.** Pilih size Custom → tombol Add to Cart & Buy Now **otomatis nonaktif** (disabled), tombol berubah "Request Commission" → form (nama, WhatsApp, catatan ukuran/keinginan) → tersimpan ke `parabos_commissions` + toast. Tidak masuk cart. Produk *Inquire* (tanpa harga) juga selalu disabled.
- **Ongkir:** *Complimentary insured delivery* — gratis, tampil sebagai baris "Gratis" di ringkasan. Tidak ada kalkulasi ongkir.
- **Nomor order:** format `PRB-YYYYMMDD-XXX` (XXX = counter 001, 002, … per hari).
- **Status time-based, interval mampet** (interval nyata dipersempit agar status benar-benar maju saat demo 10 menit; catatan di UI: *"Simulasi — waktu dipercepat untuk demo"*):
  - `Dikonfirmasi` — 0 detik
  - `Diproses` — ≥ 15 detik
  - `Dikirim` — ≥ 35 detik
  - `Selesai` — ≥ 60 detik
  Status dihitung dari `placedAt` saat halaman dibuka — tidak perlu timer berjalan.

---

## 4. Kontrak Data

### 4.1 Produk (`js/products.js`)
```js
const PRODUCTS = [
  {
    id: "hem-parang-kencana",        // slug, unik
    name: "Hem Parang Kencana",
    category: "Shirts",              // Shirts | Jackets & Blazers | Formal | Ceremonial
    motif: "Parang dan sayap kencana emas",
    price: 2150000,                  // integer rupiah
    img: "img/products/hem-parang-kencana.jpg",
    desc: "Batik tulis lengan pendek, motif parang dengan sayap kencana berlapis prada emas.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
  // … 12 produk asli Parabos, lihat Lampiran A
];
```

### 4.2 localStorage — keys resmi (satu-satunya yang boleh dipakai)
```js
parabos_cart        // [{ id, size, qty }]
parabos_wishlist    // [id, id, …]
parabos_orders // [{ no, items:[{id,size,qty}], total, name, phone, address,
// payment("transfer"|"va"|"qris"), vaBank, paid, paidAt,
// shippingCode("PRB-SHP-XXXXXX", di-generate saat status Dikirim oleh track.js), placedAt(ISO) }]
parabos_commissions // [{ name, wa, note, productId, requestedAt(ISO) }]
parabos_appointments// [{ name, contact, message, requestedAt(ISO) }]
parabos_lang        // "en" | "id" (default "en")
```
- **Cart merge:** item `{id, size}` identik digabung — qty+1, bukan baris baru.
- **Buy Now** = add-to-cart (dengan merge, size wajib dipilih) + redirect ke `checkout.html`.
- Helper akses storage **hanya** di `js/main.js` (`getCart`, `setCart`, dst.) — halaman lain tidak boleh `localStorage.setItem` langsung.
- Sinkronisasi antar-tab via event `storage`.

### 4.3 Format uang & nomor
- Rupiah: `Rp 2.150.000` (fungsi `formatRupiah` di `main.js`).
- Nomor order: `PRB-` + `YYYYMMDD` + `-` + counter 3 digit per hari.

---

## 5. Struktur File & Kepemilikan

### 5.1 Pohon folder
```
batik-parabos/
├── index.html  collection.html  product.html
├── cart.html  checkout.html  wishlist.html
├── heritage.html  track.html
├── css/
│   ├── fonts.css            ← @font-face (milik A)
│   ├── style.css            ← design system inti (milik A saja)
│   └── pages/               ← CSS per halaman milik masing-masing
│       ├── collection.css   product.css   cart.css
│       ├── checkout.css     wishlist.css
│       ├── heritage.css     track.css     home.css
├── fonts/                   ← woff2 self-host (Cormorant Garamond, Jost)
├── js/
│   ├── products.js          ← data 12 produk (milik A)
│   ├── i18n.js              ← kamus EN/ID + toggle (milik A)
│   ├── main.js              ← shared logic (milik A)
│   ├── catalog.js  product.js  cart.js
│   ├── checkout.js  wishlist.js  track.js  heritage.js
├── img/
│   ├── logo.png
│   ├── hero.jpg
│   └── products/            ← 12 foto produk asli
├── SPEC.md  GUIDE.md
└── .gitignore
```

### 5.2 Tabel kepemilikan (aturan emas tim)
| Orang | Peran | Milik penuh (boleh edit) | DILARANG menyentuh |
|---|---|---|---|
| **A** | Foundation | `style.css`, `fonts.css`, `js/main.js`, `js/products.js`, `js/i18n.js`, `index.html`, navbar/footer markup, `css/pages/home.css` | semua file B & C |
| **B** | Commerce | `collection.*`, `product.*`, `cart.*` + `css/pages/{collection,product,cart}.css` | `style.css`, `main.js`, file A & C |
| **C** | Transaction & Story | `checkout.*`, `track.*`, `wishlist.*`, `heritage.*` + CSS-nya | `style.css`, `main.js`, file A & B |

- Konsumsi class dari `style.css`; kebutuhan baru → file `css/pages/<halaman>.css` sendiri.
- Shared logic (cart badge, toast, formatRupiah, storage helpers) **hanya** di `main.js`. Kekurangan fungsi → koordinasi ke A, A yang menambah.
- Navbar & footer markup disalin dari `index.html` (jangan diubah per halaman).

---

## 6. Git Workflow
```bash
git init
git checkout -b feat/a-foundation    # A
git checkout -b feat/b-commerce      # B
git checkout -b feat/c-transaction   # C
```
- `main` = selalu bisa didemokan.
- Merge urut: **A → B → C**. Integrasi hari ke-4, QA bersama hari ke-5.
- Commit: `feat(collection): filter kategori` — imperatif, singkat, bahasa bebas tapi konsisten.
- Konflik CSS/JS antar anggota seharusnya hampir nol karena kepemilikan file tegas — kalau terjadi, berarti ada yang melanggar batas.

### Jadwal 1 minggu
| Hari | Target |
|---|---|
| 1 | Spec dibaca semua; A: tokens + style.css inti + main.js + navbar/footer; B & C: setup branch, baca GUIDE |
| 2 | A: index.html + img assets; B: collection + product; C: cart + checkout |
| 3 | B: cart sempurna + wishlist; C: track + heritage; A: review PR |
| 4 | Integrasi ke main, perbaiki konflik, polish |
| 5 | QA checklist bersama, perbaikan akhir |
| 6–7 | Slide presentasi + gladi |

---

## 7. AI Agent Guide
Dokumen terpisah: `GUIDE.md` (isi identik dengan bab 2, 4, 5 dokumen ini + daftar larangan). Diberikan ke AI agent tiap anggota sebagai konteks wajib agar output 3 AI tetap satu sistem visual. Ringkasan larangan:
1. Jangan ubah `style.css` / `main.js` milik anggota lain.
2. Jangan pakai warna/font di luar tokens.
3. Jangan buat halaman baru di luar 8 halaman spec.
4. Jangan pakai localStorage key di luar §4.2.
5. Jangan menyalin kode situs parabos.online.

---

## 8. QA Checklist (hari ke-5)
- [ ] Alur end-to-end: browse → filter → detail → size → cart → checkout → nomor order → lacak
- [ ] Cart & wishlist persist setelah refresh dan tutup browser
- [ ] Form checkout menolak input kosong (pesan error inline)
- [ ] Status lacak maju sesuai tabel waktu (0/2/4/6 menit — uji dengan manipulasi `placedAt`)
- [ ] Toggle EN/ID berfungsi di semua halaman, persist setelah refresh, konten dinamis ikut berganti
- [ ] Size Custom → Commission Request, tidak masuk cart
- [ ] Wishlist → pindah ke cart berfungsi
- [ ] Kontras pedestal di ke-12 produk (tidak ada foto tenggelam)
- [ ] Responsive 375 / 768 / 1440
- [ ] Tidak ada tombol mati — setiap klik memberi efek nyata
- [ ] Cart badge update di semua halaman
- [ ] Toast muncul untuk semua aksi (add cart, wishlist, commission, appointment)

---

## 9. Presentasi 10 Menit
| Menit | Segmen |
|---|---|
| 0–1 | Hook: batik couture Rp 2–15 jt sulit dibeli online |
| 1–5 | Demo alur inti: koleksi → detail → checkout → lacak |
| 5–7 | Delta vs situs asli (fitur yang TIDAK ada di sana) |
| 7–8 | Argumen "management system" |
| 8–9.5 | Role & kontribusi nyata per anggota |
| 9.5–10 | AI usage transparan + catatan "waktu lacak dipercepat untuk demo" |

---

## Lampiran A — 12 Produk Asli (data awal `products.js`)

| Nama | Kategori | Harga |
|---|---|---|
| Hem Parang Kencana | Shirts | 2.150.000 |
| Hem Gurdo Prada | Shirts | 2.150.000 |
| Kemeja Naga Prada | Shirts | 2.150.000 |
| Kemeja Hong Prada | Shirts | 2.150.000 |
| Kemeja Lar Prada | Shirts | 2.150.000 |
| Hem Ayam Gurdo Prada | Shirts | 2.150.000 |
| Merak Emas Jacket | Jackets & Blazers | 12.500.000 |
| Garuda Wreath Blazer | Jackets & Blazers | 14.900.000 |
| Indigo Phoenix Shirt | Formal | 6.800.000 |
| Nirmala Formal Shirt | Formal | 7.200.000 |
| Pusaka Sogan Blazer | Jackets & Blazers | 13.400.000 |
| Kencana Royale Jacket | Ceremonial | — (Inquire) |

Catatan: foto & deskripsi motif diambil dari parabos.online (hanya untuk keperluan presentasi kelas). Kencana Royale = harga "Inquire" → tampilkan tombol Commission Request alih-alih harga.


