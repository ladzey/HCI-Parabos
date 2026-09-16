// checkout.js — pembayaran simulasi: instruksi per metode + kode pengiriman (milik C)
(function () {
  const coEmpty = document.getElementById("coEmpty");
  const coForm = document.getElementById("coForm");
  const coPayment = document.getElementById("coPayment");
  const coSuccess = document.getElementById("coSuccess");
  const itemsWrap = document.getElementById("coItems");
  const sumSubtotal = document.getElementById("coSubtotal");
  const sumTotal = document.getElementById("coTotal");

  const fName = document.getElementById("fName");
  const fPhone = document.getElementById("fPhone");
  const fAddr = document.getElementById("fAddr");

const payTitle = document.getElementById("payTitle");
const payAmount = document.getElementById("payAmount");
const payTransfer = document.getElementById("payTransfer");
const payVa = document.getElementById("payVa");
const payQris = document.getElementById("payQris");
const vaNumber = document.getElementById("vaNumber");
const payProgressFill = document.getElementById("payProgressFill");

// Order yang sedang menunggu pembayaran (dari layar instruksi)
let pendingOrderNo = null;
let payTimer = null;
const PAY_VERIFY_MS = 5000; // simulasi gateway: verifikasi otomatis 5 detik

  function cartItems() {
    return getCart().filter(entry => getProduct(entry.id));
  }

  function renderSummary() {
    const items = cartItems();
    if (items.length === 0) {
      coForm.hidden = true;
      coSuccess.hidden = true;
      coPayment.hidden = true;
      coEmpty.hidden = false;
      return;
    }
    coEmpty.hidden = true;
    coPayment.hidden = true;
    coSuccess.hidden = true;
    coForm.hidden = false;

    itemsWrap.innerHTML = items.map(entry => {
      const prod = getProduct(entry.id);
      return (
        '<div class="co-item">' +
        "<span>" + esc(prod.name) + ' <span class="qty">× ' + entry.qty + " · " + esc(entry.size || "—") + "</span></span>" +
        "<span>" + esc(formatRupiah(prod.price * entry.qty)) + "</span>" +
        "</div>"
      );
    }).join("");

    const subtotal = items.reduce((sum, e) => sum + getProduct(e.id).price * e.qty, 0);
    sumSubtotal.textContent = formatRupiah(subtotal);
    sumTotal.textContent = formatRupiah(subtotal);
  }

  function setErr(input, errEl, bad) {
    input.classList.toggle("invalid", bad);
    errEl.classList.toggle("is-visible", bad);
    return bad;
  }

// ---- Layar instruksi pembayaran ----
function showPaymentScreen(order) {
  pendingOrderNo = order.no;
  coForm.hidden = true;
  coSuccess.hidden = true;
  coPayment.hidden = false;

  payAmount.textContent = formatRupiah(order.total);

  payTransfer.hidden = order.payment !== "transfer";
  payVa.hidden = order.payment !== "va";
  payQris.hidden = order.payment !== "qris";

  if (order.payment === "transfer") {
    payTitle.textContent = t("pay.titleTransfer");
  } else if (order.payment === "va") {
    payTitle.textContent = t("pay.titleVa") + " · " + order.vaBank;
    vaNumber.textContent = makeVaNumber(order);
  } else {
    payTitle.textContent = t("pay.titleQris");
  }

  startPayTimer(order);
  window.scrollTo(0, 0);
}

// Progress bar emas mengisi 5 detik (animasi CSS), lalu order otomatis terbayar
function startPayTimer(order) {
  if (payTimer) clearTimeout(payTimer);
  if (payProgressFill) {
    payProgressFill.classList.remove("is-running");
    // paksa restart animasi
    void payProgressFill.offsetWidth;
    payProgressFill.classList.add("is-running");
  }
  payTimer = setTimeout(() => {
    payTimer = null;
    const fresh = findPendingOrder();
    if (fresh) markPaid(fresh);
  }, PAY_VERIFY_MS);
}

  // Nomor VA simulasi: 8808 + 10 digit terakhir timestamp + 3 digit urut order = 13 digit (4-4-5)
  function makeVaNumber(order) {
    const digits = String(Date.parse(order.placedAt)).slice(-10) + order.no.slice(-3);
    return "8808 " + digits.slice(0, 4) + " " + digits.slice(4, 8) + " " + digits.slice(8, 13);
  }

  function findPendingOrder() {
    const orders = getOrders();
    return orders.find(o => o.no === pendingOrderNo && !o.paid);
  }

function markPaid(order) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.no === order.no);
  if (idx < 0) return;
  orders[idx].paid = true;
  orders[idx].paidAt = new Date().toISOString();
  // Shipping code TIDAK dibuat di sini — kurir meng-generate-nya saat memproses
  // paket (status "Dikirim" di track.js).
  lsSet("parabos_orders", orders);
  showSuccess(orders[idx]);
}

function showSuccess(order) {
  pendingOrderNo = null;
  coForm.hidden = true;
  coPayment.hidden = true;
  coEmpty.hidden = true;
  coSuccess.hidden = false;
  document.getElementById("successNo").textContent = order.no;
  window.scrollTo(0, 0);
}

  // ---- Submit form → buat order → layar instruksi ----
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    const items = cartItems();
    if (items.length === 0) {
      coEmpty.hidden = false;
      coForm.hidden = true;
      return;
    }

    let bad = false;
    bad = setErr(fName, document.getElementById("eName"), !fName.value.trim()) || bad;
    bad = setErr(fPhone, document.getElementById("ePhone"), !/^[+\d][\d\s-]{6,}$/.test(fPhone.value.trim())) || bad;
    bad = setErr(fAddr, document.getElementById("eAddr"), !fAddr.value.trim()) || bad;
    if (bad) return;

    const payInput = document.querySelector('input[name="pay"]:checked');
    const method = payInput ? payInput.value : "transfer";
    const subtotal = items.reduce((sum, e) => sum + getProduct(e.id).price * e.qty, 0);
    const vaBankEl = document.querySelector("#vaBanks .va-bank.is-current");

    const order = addOrder({
      no: makeOrderNo(),
      items: items,
      total: subtotal,
      name: fName.value.trim(),
      phone: fPhone.value.trim(),
      address: fAddr.value.trim(),
      payment: method,
      vaBank: method === "va" ? (vaBankEl ? vaBankEl.getAttribute("data-bank") : "BCA") : null,
      paid: false,
      placedAt: new Date().toISOString()
    });

    setCart([]); // order ter-commit — cart ter-clear
    showPaymentScreen(order);
  });

// ---- Ganti bank VA → nomor VA baru untuk bank yang dipilih ----
document.querySelectorAll("#vaBanks .va-bank").forEach(btn => {
  btn.addEventListener("click", () => {
    const order = findPendingOrder();
    if (!order) return;
    document.querySelectorAll("#vaBanks .va-bank").forEach(b => b.classList.remove("is-current"));
    btn.classList.add("is-current");
    order.vaBank = btn.getAttribute("data-bank");
    const orders = getOrders();
    const idx = orders.findIndex(o => o.no === order.no);
    if (idx >= 0) {
      orders[idx].vaBank = order.vaBank;
      lsSet("parabos_orders", orders);
    }
    payTitle.textContent = t("pay.titleVa") + " · " + order.vaBank;
    vaNumber.textContent = makeVaNumber(order);
  });
});

  renderSummary();
  // Ganti bahasa: refresh judul metode saat di layar instruksi, tapi JANGAN jalankan
  // renderSummary — cart sudah ter-clear dan akan salah menendang ke "cart is empty".
  document.addEventListener("langchange", () => {
    if (!coPayment.hidden && pendingOrderNo) {
      const order = getOrders().find(o => o.no === pendingOrderNo && !o.paid);
      if (order) showPaymentScreen(order);
    } else if (coPayment.hidden && coSuccess.hidden) {
      renderSummary();
    }
  });
})();
