// product.js — halaman detail produk (milik B)
(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const fromWishlist = params.get("from") === "wishlist";
  const p = id ? getProduct(id) : null;

  const layout = document.getElementById("prodLayout");
  const notFound = document.getElementById("prodNotFound");
  let selectedSize = null;

  if (!p) {
    layout.hidden = true;
    notFound.hidden = false;
    return;
  }

  // Produk ditemukan — tampilkan layout (markup lahir dengan atribut hidden)
  layout.hidden = false;
  notFound.hidden = true;

  // ----- Elemen -----
  const img = document.getElementById("prodImg");
  const cat = document.getElementById("prodCat");
  const name = document.getElementById("prodName");
  const motif = document.getElementById("prodMotif");
  const price = document.getElementById("prodPrice");
  const sizesWrap = document.getElementById("prodSizes");
  const sizeBlock = document.getElementById("sizeBlock");
  const btnAdd = document.getElementById("btnAdd");
  const btnBuy = document.getElementById("btnBuy");
  const btnWish = document.getElementById("btnWish");
  const btnCommission = document.getElementById("btnCommission");
  const desc = document.getElementById("prodDesc");
  const wishNote = document.getElementById("wishNote");

  function render() {
    const lang = getLang();
    document.title = p.name + " — Batik Parabos";
    img.src = p.img;
    img.alt = p.name;
    cat.textContent = t("filter." + catKeyOf(p.category));
    name.textContent = p.name;
    motif.textContent = lang === "id" ? p.motifId : p.motif;
    desc.textContent = lang === "id" ? p.descId : p.desc;

    if (p.price === null) {
      price.textContent = t("product.inquire");
      btnAdd.hidden = true;
      btnBuy.hidden = true;
      btnAdd.disabled = true;
      btnBuy.disabled = true;
      sizeBlock.hidden = true;
      btnCommission.hidden = false;
      btnCommission.classList.add("btn--solid");
    } else {
      price.innerHTML = '<span class="from">' + esc(t("product.from")) + "</span>" + esc(formatRupiah(p.price));
      renderSizes();
    }

    renderWishLabel();
  }

  function renderSizes() {
    sizesWrap.innerHTML = "";
    const chips = (p.sizes || []).concat("custom");
    chips.forEach(chip => {
      const isCustom = chip === "custom";
      const b = document.createElement("button");
      b.type = "button";
      b.className = "size-chip";
      b.setAttribute("data-size", isCustom ? "custom" : chip);
      b.textContent = isCustom ? t("product.custom") : chip;
      if (selectedSize === (isCustom ? "custom" : chip)) b.classList.add("is-current");
      b.addEventListener("click", () => {
        selectedSize = isCustom ? "custom" : chip;
        sizesWrap.querySelectorAll(".size-chip").forEach(c => c.classList.remove("is-current"));
        b.classList.add("is-current");
        toggleCommissionMode();
      });
      sizesWrap.appendChild(b);
    });
  }

  // Custom → tombol utama berubah "Request Commission"; Add to Cart & Buy Now otomatis nonaktif
  function toggleCommissionMode() {
    const custom = selectedSize === "custom";
    btnCommission.hidden = !custom;
    btnCommission.classList.toggle("btn--solid", custom);
    btnAdd.classList.toggle("btn--solid", !custom);
    btnAdd.disabled = custom;
    btnBuy.disabled = custom;
  }

  function renderWishLabel() {
    const saved = getWishlist().indexOf(p.id) >= 0;
    btnWish.textContent = saved ? t("product.wishlisted") : t("product.wishlist");
    btnWish.classList.toggle("is-current", saved);
  }

  function needSize() {
    if (p.price !== null && !selectedSize) {
      showToast(t("product.chooseSize"));
      return true;
    }
    return false;
  }

  btnAdd.addEventListener("click", () => {
    if (needSize()) return;
    addToCart(p.id, selectedSize);
    showToast(t("product.cartAdded"));
  });

  btnBuy.addEventListener("click", () => {
    if (needSize()) return;
    addToCart(p.id, selectedSize);
    window.location.href = "checkout.html";
  });

  btnWish.addEventListener("click", () => {
    const added = toggleWishlist(p.id);
    showToast(added ? t("product.wishAdded") : t("product.wishRemoved"));
    renderWishLabel();
  });

  // ----- Commission modal -----
  const backdrop = document.getElementById("commissionBackdrop");
  const form = document.getElementById("commissionForm");
  const cName = document.getElementById("cName");
  const cWa = document.getElementById("cWa");

  function openModal() {
    backdrop.classList.add("is-open");
    cName.focus();
  }
  function closeModal() {
    backdrop.classList.remove("is-open");
    form.reset();
  }

  btnCommission.addEventListener("click", openModal);
  document.getElementById("cCancel").addEventListener("click", closeModal);
  backdrop.addEventListener("click", e => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!cName.value.trim() || !cWa.value.trim()) {
      showToast(t("atelier.err"));
      return;
    }
    addCommission({
      name: cName.value.trim(),
      wa: cWa.value.trim(),
      note: document.getElementById("cNote").value.trim(),
      productId: p.id,
      requestedAt: new Date().toISOString()
    });
    closeModal();
    showToast(t("product.commissionOk"));
  });

  // note "dari wishlist"
  if (fromWishlist) {
    wishNote.hidden = false;
  }

  render();
  document.addEventListener("langchange", () => {
    render();
    toggleCommissionMode();
  });
})();
