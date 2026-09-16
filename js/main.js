// main.js — shared logic (milik A)
// Helper storage, format uang, toast, badge keranjang, nomor pesanan.

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable */
  }
}

// ---- Cart ----
function getCart() {
  return lsGet("parabos_cart", []);
}

function setCart(items) {
  lsSet("parabos_cart", items);
  updateCartBadge();
}

// {id,size} identik digabung — qty+1
function addToCart(id, size, qty) {
  if (size === undefined) size = null;
  if (qty === undefined) qty = 1;
  const cart = getCart();
  const same = cart.find(item => item.id === id && item.size === size);
  if (same) {
    same.qty += qty;
  } else {
    cart.push({ id: id, size: size, qty: qty });
  }
  setCart(cart);
  return cart;
}

// ---- Wishlist ----
function getWishlist() {
  return lsGet("parabos_wishlist", []);
}

function setWishlist(ids) {
  lsSet("parabos_wishlist", ids);
}

function toggleWishlist(id) {
  const list = getWishlist();
  const i = list.indexOf(id);
  if (i >= 0) {
    list.splice(i, 1);
  } else {
    list.push(id);
  }
  setWishlist(list);
  return i < 0;
}

// ---- Orders ----
function getOrders() {
  return lsGet("parabos_orders", []);
}

function makeOrderNo() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const stamp = "PRB-" + y + m + d + "-";
  const seq = getOrders().filter(o => o.no && o.no.indexOf(stamp) === 0).length + 1;
  return stamp + String(seq).padStart(3, "0");
}

function addOrder(order) {
  const orders = getOrders();
  orders.push(order);
  lsSet("parabos_orders", orders);
  return order;
}

// ---- Commissions & appointments ----
function addCommission(entry) {
  const list = lsGet("parabos_commissions", []);
  list.push(entry);
  lsSet("parabos_commissions", list);
}

function addAppointment(entry) {
  const list = lsGet("parabos_appointments", []);
  list.push(entry);
  lsSet("parabos_appointments", list);
}

// ---- Format ----
function formatRupiah(n) {
  if (typeof n !== "number" || isNaN(n)) return "";
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

// ---- Toast ----
let toastTimer = null;
function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("toast--visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("toast--visible");
  }, 2600);
}

// ---- Badge keranjang ----
function cartTotalQty() {
  return getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const n = cartTotalQty();
  badge.textContent = n > 99 ? "99+" : String(n);
  badge.classList.toggle("cart-badge--active", n > 0);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

// ---- Scroll reveal (IntersectionObserver, bukan scroll listener) ----
document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
  // Fail-safe: konten tidak boleh pernah tetap tak terlihat
  setTimeout(() => {
    els.forEach(el => el.classList.add("is-in"));
  }, 1500);
});

window.addEventListener("storage", e => {
  if (e.key === "parabos_cart") updateCartBadge();
});

// ---- Kartu produk (dipakai home & collection) ----
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function catKeyOf(category) {
  const map = {
    "Shirts": "shirts",
    "Jackets & Blazers": "jackets",
    "Formal": "formal",
    "Ceremonial": "ceremonial"
  };
  return map[category] || "all";
}

function productCardHTML(p, extraClass) {
  const catLabel = t("filter." + catKeyOf(p.category));
  const priceHTML =
    p.price === null
      ? '<span class="product-card__price product-card__price--muted">' + esc(t("product.inquire")) + "</span>"
      : '<span class="product-card__price">' + esc(formatRupiah(p.price)) + "</span>";
  return (
    '<a class="product-card' + (extraClass ? " " + extraClass : "") + '" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
    '<div class="product-card__media"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
    '<div class="product-card__body">' +
    '<div class="product-card__cat">' + esc(catLabel) + "</div>" +
    '<h3 class="product-card__name">' + esc(p.name) + "</h3>" +
    priceHTML +
    "</div></a>"
  );
}
