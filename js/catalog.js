// catalog.js — filter + sort katalog (milik B)
(function () {
  let currentFilter = "all";
  let currentSort = "featured";

  function render() {
    const grid = document.getElementById("colGrid");
    const empty = document.getElementById("colEmpty");
    const count = document.getElementById("colCount");
    if (!grid) return;

    let list = PRODUCTS.slice();

    if (currentFilter !== "all") {
      list = list.filter(p => p.category === currentFilter);
    }

    if (currentSort === "asc") {
      list.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    } else if (currentSort === "desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    grid.innerHTML = list.map(p => productCardHTML(p)).join("");

    if (count) {
      count.textContent = list.length + (list.length === 1 ? " piece" : " pieces");
    }

    if (empty) {
      if (list.length === 0) {
        empty.textContent = t("collection.empty");
        empty.hidden = false;
      } else {
        empty.hidden = true;
      }
    }

    // label filter & sort ikut bahasa aktif
    document.querySelectorAll("#filterBar .col-chip").forEach(chip => {
      const f = chip.getAttribute("data-filter");
      chip.textContent = t("filter." + (f === "all" ? "all" : catKeyOf(f)));
    });
    const sortSel = document.getElementById("sortSelect");
    if (sortSel) {
      Array.from(sortSel.options).forEach(opt => {
        const key = { featured: "sort.featured", asc: "sort.priceAsc", desc: "sort.priceDesc" }[opt.value];
        opt.textContent = t(key);
      });
    }
  }

  function bind() {
    document.querySelectorAll("#filterBar .col-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#filterBar .col-chip").forEach(c => c.classList.remove("is-current"));
        chip.classList.add("is-current");
        currentFilter = chip.getAttribute("data-filter");
        render();
      });
      const f = chip.getAttribute("data-filter");
      chip.textContent = t("filter." + (f === "all" ? "all" : catKeyOf(f)));
    });

    const sortSel = document.getElementById("sortSelect");
    if (sortSel) {
      sortSel.addEventListener("change", () => {
        currentSort = sortSel.value;
        render();
      });
    }
  }

  bind();
  render();
  document.addEventListener("langchange", render);
})();
