// cart.js — halaman keranjang (milik B)
(function () {
  const list = document.getElementById("cartList");
  const layout = document.getElementById("cartLayout");
  const empty = document.getElementById("cartEmpty");
  const sumSubtotal = document.getElementById("sumSubtotal");
  const sumTotal = document.getElementById("sumTotal");

  function itemTotal(entry) {
    const prod = getProduct(entry.id);
    if (!prod || prod.price === null) return 0;
    return prod.price * (entry.qty || 0);
  }

  function render() {
    const cart = getCart();
    const valid = cart.filter(entry => getProduct(entry.id));

  if (valid.length === 0) {
    list.innerHTML = ""; // defensif: kosongkan item basi
    layout.hidden = true;
    empty.hidden = false;
    return;
  }

    empty.hidden = true;
    layout.hidden = false;
    list.innerHTML = "";

    valid.forEach(entry => {
      const prod = getProduct(entry.id);
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML =
        '<div class="cart-item__media"><img src="' + esc(prod.img) + '" alt="' + esc(prod.name) + '"></div>' +
        '<div>' +
        '<h3 class="cart-item__name">' + esc(prod.name) + "</h3>" +
        '<div class="cart-item__meta">' + esc((entry.size || "—")) + "</div>" +
        '<div class="cart-item__price">' + esc(formatRupiah(prod.price)) + "</div>" +
        "</div>" +
        '<div class="cart-item__controls">' +
        '<div class="qty-stepper">' +
        '<button type="button" data-act="minus" aria-label="Decrease">−</button>' +
        "<span>" + entry.qty + "</span>" +
        '<button type="button" data-act="plus" aria-label="Increase">+</button>' +
        "</div>" +
        '<button type="button" class="cart-remove" data-act="remove">' + esc(t("cart.remove")) + "</button>" +
        "</div>";

      el.querySelectorAll("[data-act]").forEach(btn => {
        btn.addEventListener("click", () => {
          const act = btn.getAttribute("data-act");
          const items = getCart();
          const idx = items.findIndex(x => x.id === entry.id && x.size === entry.size);
          if (idx < 0) return;
          if (act === "plus") items[idx].qty += 1;
          if (act === "minus") {
            items[idx].qty -= 1;
            if (items[idx].qty <= 0) items.splice(idx, 1);
          }
          if (act === "remove") {
            items.splice(idx, 1);
            showToast(t("cart.removed"));
          }
          setCart(items);
          render();
        });
      });

      list.appendChild(el);
    });

    const subtotal = valid.reduce((sum, entry) => sum + itemTotal(entry), 0);
    sumSubtotal.textContent = formatRupiah(subtotal);
    sumTotal.textContent = formatRupiah(subtotal);
  }

  render();
  document.addEventListener("langchange", render);
})();
