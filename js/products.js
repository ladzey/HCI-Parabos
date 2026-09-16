// products.js — 12 produk asli Batik Parabos (milik A)
// category: "Shirts" | "Jackets & Blazers" | "Formal" | "Ceremonial"
// price: integer rupiah, null = "Inquire" (commission only)
const PRODUCTS = [
  {
    id: "hem-parang-kencana",
    name: "Hem Parang Kencana",
    category: "Shirts",
    motif: "Parang lines & gilded kencana wings",
    motifId: "Alur parang & sayap kencana berlapis emas",
    price: 2150000,
    img: "img/products/hem-parang-kencana.jpg",
    desc: "Short-sleeve hand-drawn batik shirt. Parang lines run into gilded kencana wings — courtly drawing, cut for warm evenings.",
    descId: "Batik tulis lengan pendek. Alur parang mengalir ke sayap kencana berlapis emas — gambar istana, dipotong untuk malam yang hangat.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "hem-gurdo-prada",
    name: "Hem Gurdo Prada",
    category: "Shirts",
    motif: "Gurdo medallion & gold prada sulur",
    motifId: "Medali gurdo & sulur prada emas",
    price: 2150000,
    img: "img/products/hem-gurdo-prada.jpg",
    desc: "Short-sleeve shirt on a deep black ground. Gurdo medallions traced by hand, finished with gold prada sulur.",
    descId: "Kemeja lengan pendek di latar hitam pekat. Medali gurdo ditorehkan tangan, diakhiri sulur prada emas.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "kemeja-naga-prada",
    name: "Kemeja Naga Prada",
    category: "Shirts",
    motif: "Naga dragon in gold prada",
    motifId: "Naga dalam prada emas",
    price: 2150000,
    img: "img/products/kemeja-naga-prada.jpg",
    desc: "Long-sleeve shirt bearing the naga — guardian of thresholds — drawn line by line and raised in gold.",
    descId: "Kemeja lengan panjang yang membawa naga — penjaga ambang — digambar garis demi garis dan diangkat dalam emas.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "kemeja-hong-prada",
    name: "Kemeja Hong Prada",
    category: "Shirts",
    motif: "Hong phoenix in gold prada",
    motifId: "Hong phoenix dalam prada emas",
    price: 2150000,
    img: "img/products/kemeja-hong-prada.jpg",
    desc: "Long-sleeve shirt with the hong — the phoenix of Javanese courts — its wings lifted in gold prada.",
    descId: "Kemeja lengan panjang dengan hong — phoenix istana Jawa — sayapnya terangkat dalam prada emas.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "kemeja-lar-prada",
    name: "Kemeja Lar Prada",
    category: "Shirts",
    motif: "Lar wings in gold prada",
    motifId: "Sayap lar dalam prada emas",
    price: 2150000,
    img: "img/products/kemeja-lar-prada.jpg",
    desc: "Long-sleeve shirt carrying pairs of lar — ancestral birds in flight — waxed, dyed and gilded by hand.",
    descId: "Kemeja lengan panjang membawa pasangan lar — burung leluhur yang terbang — dililinkan, dicelup dan digilakan dengan tangan.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "hem-ayam-gurdo-prada",
    name: "Hem Ayam Gurdo Prada",
    category: "Shirts",
    motif: "Ayam gurdo prada — red, green & gold",
    motifId: "Ayam gurdo prada — merah, hijau & emas",
    price: 2150000,
    img: "img/products/hem-ayam-gurdo-prada.jpg",
    desc: "Short-sleeve shirt in a livelier palette: ayam gurdo roosters worked in red, green and gold.",
    descId: "Kemeja lengan pendek dengan palet lebih hidup: ayam gurdo dikerjakan dalam merah, hijau dan emas.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "merak-emas",
    name: "Merak Emas Jacket",
    category: "Jackets & Blazers",
    motif: "Gilded peacock, prambon gold",
    motifId: "Merak bergila emas, prambon emas",
    price: 12500000,
    img: "img/products/merak-emas.jpg",
    desc: "Shanghai-collar jacket. A gilded peacock spreads across the chest, framed in prambon gold. Cut to order.",
    descId: "Jaket berkerah shanghai. Seekor merak bergila membentang di dada, dibingkai prambon emas. Dipotong sesuai pesanan.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "garuda-wreath",
    name: "Garuda Wreath Blazer",
    category: "Jackets & Blazers",
    motif: "Winged medallion in prada gold",
    motifId: "Medali bersayap dalam prada emas",
    price: 14900000,
    img: "img/products/garuda-wreath.jpg",
    desc: "Ceremonial blazer. A winged medallion crowns the back — peacocks and lotus drawn in prada gold.",
    descId: "Blazer seremonial. Medali bersayap memahkotai punggung — merak dan teratai digambar dalam prada emas.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "indigo-phoenix",
    name: "Indigo Phoenix Shirt",
    category: "Formal",
    motif: "Natural indigo, gold sulur",
    motifId: "Indigo alami, sulur emas",
    price: 6800000,
    img: "img/products/indigo-phoenix.jpg",
    desc: "Hand-waxed formal shirt in natural indigo. Garuda wings and gold sulur rise from the deep blue ground.",
    descId: "Kemeja formal dililinkan tangan dalam indigo alami. Sayap garuda dan sulur emas bangkit dari latar biru pekat.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "nirmala-formal",
    name: "Nirmala Formal Shirt",
    category: "Formal",
    motif: "Indigo ground, hand-waxed",
    motifId: "Latar indigo, dililinkan tangan",
    price: 7200000,
    img: "img/products/nirmala-formal.jpg",
    desc: "The quiet formal shirt: indigo ground, clean shoulders, every line drawn freehand before the first dye bath.",
    descId: "Kemeja formal yang tenang: latar indigo, bahu bersih, setiap garis digambar bebas sebelum celakan pewarna pertama.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "pusaka-sogan",
    name: "Pusaka Sogan Blazer",
    category: "Jackets & Blazers",
    motif: "Parang & sogan florals",
    motifId: "Parang & bunga sogan",
    price: 13400000,
    img: "img/products/pusaka-sogan.jpg",
    desc: "Heritage blazer in sogan browns. Parang bands and sogan florals carried across the whole body.",
    descId: "Blazer warisan dalam coklat sogan. Pita parang dan bunga sogan mengalir di seluruh badan busana.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "kencana-royale",
    name: "Kencana Royale Jacket",
    category: "Ceremonial",
    motif: "Court peacock, three-quarter cut",
    motifId: "Merak istana, potongan tiga-perempat",
    price: null,
    img: "img/products/kencana-royale.jpg",
    desc: "The house masterpiece. A court peacock in full prada, cut three-quarter and finished to the wearer's measure. Price on inquiry.",
    descId: "Mahakarya rumah ini. Merak istana dalam prada penuh, dipotong tiga-perempat dan disempurnakan sesuai ukuran pemakainya. Harga atas permintaan.",
    sizes: null
  }
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
