// wishlist.js — halaman favorit (milik C)
(function () {
  const listEl = document.getElementById("wishList");
  const emptyEl = document.getElementById("wishEmpty");
  const HIGHLIGHT_MS = 4000;

  function render() {
    const ids = lsGet("parabos_wishlist", []).filter(id => getProduct(id));

    if (ids.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    listEl.innerHTML = ids.map(id => {
      const prod = getProduct(id);
      const priceHTML = prod.price === null
        ? '<div class="wish-item__price text-muted">' + esc(t("product.inquire")) + "</div>"
        : '<div class="wish-item__price">' + esc(formatRupiah(prod.price)) + "</div>";
      const catLabel = t("filter." + catKeyOf(prod.category));
      const highlighted = window.__wishHighlight === id ? " is-highlighted" : "";
      return (
        '<div class="wish-item' + highlighted + '" data-id="' + id + '">' +
        '<div class="wish-item__media"><img src="' + esc(prod.img) + '" alt="' + esc(prod.name) + '"></div>' +
        "<div>" +
        '<h3 class="wish-item__name">' + esc(prod.name) + "</h3>" +
        '<div class="wish-item__meta">' + esc(catLabel) + "</div>" +
        priceHTML +
        "</div>" +
        '<div class="wish-item__actions">' +
        '<a class="btn" href="product.html?id=' + encodeURIComponent(id) + '&from=wishlist">' + esc(t("wish.selectSize")) + "</a>" +
        '<button type="button" class="cart-remove" data-act="remove">' + esc(t("wish.remove")) + "</button>" +
        "</div></div>"
      );
    }).join("");

    listEl.querySelectorAll("[data-act='remove']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.closest(".wish-item").getAttribute("data-id");
        const ids = lsGet("parabos_wishlist", []);
        const i = ids.indexOf(id);
        if (i >= 0) ids.splice(i, 1);
        setWishlist(ids);
        showToast(t("product.wishRemoved"));
        render();
      });
    });

    if (window.__wishHighlight) {
      setTimeout(() => { window.__wishHighlight = null; }, HIGHLIGHT_MS);
    }
  }

  // bila datang dari notifikasi, item terakhir yang disimpan di-highlight
  const last = lsGet("parabos_wishlist", []).slice(-1)[0];
  if (last) window.__wishHighlight = last;

  render();
  document.addEventListener("langchange", render);
})();
