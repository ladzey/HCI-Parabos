// track.js — lacak pesanan, status time-based (milik C)
// Interval demo super cepat: 0 dtk Dikonfirmasi, >=15 dtk Diproses, >=35 dtk Dikirim, >=60 dtk Selesai.
// Shipping code di-generate kurir saat paket diproses (status "Dikirim").
(function () {
  // Semua dalam menit: 0s / 15s / 35s / 60s
  const STAGES = [
    { key: "status.confirmed", desc: "status.desc.confirmed", min: 0 },
    { key: "status.processing", desc: "status.desc.processing", min: 0.25 },
    { key: "status.shipped", desc: "status.desc.shipped", min: 35 / 60 },
    { key: "status.done", desc: "status.desc.done", min: 1 }
  ];
  const SHIPPED_INDEX = 2;

  const form = document.getElementById("trackForm");
  const input = document.getElementById("trackInput");
  const hint = document.getElementById("trackHint");
  const result = document.getElementById("trackResult");
  const timeline = document.getElementById("timeline");
  const shipRow = document.getElementById("trackShip");

  function stageIndex(minutes) {
    let idx = 0;
    for (let i = 0; i < STAGES.length; i++) {
      if (minutes >= STAGES[i].min) idx = i;
    }
    return idx;
  }

  // Kode pengiriman: PRB-SHP-XXXXXX (6 alfanumerik, tanpa 0/O dan 1/I agar tak ambigu)
  function makeCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return "PRB-SHP-" + code;
  }

  // Kurir memproses paket saat status mencapai "Dikirim" — generate sekali, idempoten
  function ensureShippingCode(order) {
    if (order.shippingCode) return order.shippingCode;
    const orders = lsGet("parabos_orders", []);
    const idx = orders.findIndex(o => o.no === order.no);
    if (idx < 0) return null;
    if (!orders[idx].shippingCode) {
      orders[idx].shippingCode = makeCode();
      lsSet("parabos_orders", orders);
    }
    return orders[idx].shippingCode;
  }

  function render() {
    const latest = lsGet("parabos_orders", []).slice(-1)[0];
    if (latest && !result.classList.contains("is-open")) {
      hint.textContent = t("nav.track") + ": " + latest.no;
      hint.hidden = false;
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const no = input.value.trim();
    hint.hidden = true;

    if (!no) {
      result.hidden = true;
      return;
    }

    const order = lsGet("parabos_orders", []).find(o => o.no && o.no.toLowerCase() === no.toLowerCase());

    if (!order) {
      result.hidden = true;
      hint.textContent = t("track.notFound");
      hint.hidden = false;
      return;
    }

    const placed = new Date(order.placedAt);
    const minutes = Math.max(0, (Date.now() - placed.getTime()) / 60000);
    const current = stageIndex(minutes);

    document.getElementById("trackOrderNo").textContent = order.no;
    document.getElementById("trackPlaced").textContent =
      new Intl.DateTimeFormat(getLang() === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(placed);
    document.getElementById("trackItems").textContent =
      order.items.map(i => getProduct(i.id).name + " × " + i.qty + " · " + (i.size || "—")).join(" · ");
    document.getElementById("trackTotal").textContent = formatRupiah(order.total);

    // Shipping code muncul hanya setelah kurir memproses paket (status "Dikirim")
    let shipCode = null;
    if (current >= SHIPPED_INDEX) {
      shipCode = ensureShippingCode(order);
    }
    const shipEl = document.getElementById("trackShip");
    if (shipCode) {
      document.getElementById("trackShipCode").textContent = shipCode;
      shipEl.hidden = false;
      document.getElementById("trackShipPending").hidden = true;
    } else {
      shipEl.hidden = true;
      document.getElementById("trackShipPending").hidden = false;
    }

    timeline.innerHTML = STAGES.map((stage, i) => {
      const state = i < current ? "is-done" : i === current ? "is-current" : "";
      return (
        "<li class='" + state + "'>" +
        "<div class='tl-title'>" + esc(t(stage.key)) + "</div>" +
        "<div class='tl-desc'>" + esc(t(stage.desc)) + "</div>" +
        "</li>"
      );
    }).join("");

    result.classList.add("is-open");
    result.hidden = false;
  });

  render();
  document.addEventListener("langchange", () => {
    if (result && !result.hidden) {
      // re-render nomor/tanggal saat ganti bahasa
      const order = lsGet("parabos_orders", []).find(
        o => o.no && o.no === document.getElementById("trackOrderNo").textContent
      );
      if (order) {
        document.getElementById("trackPlaced").textContent =
          new Intl.DateTimeFormat(getLang() === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.placedAt));
      }
    }
  });
})();
