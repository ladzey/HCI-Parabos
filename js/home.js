// home.js — render featured products (milik A)
(function () {
  function render() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;
    // 4 karya pilihan: satu dari tiap kategori, kencana-royale ditutup dengan masterpiece
    const featuredIds = ["hem-parang-kencana", "merak-emas", "indigo-phoenix", "garuda-wreath"];
    grid.innerHTML = featuredIds
      .map(id => getProduct(id))
      .filter(Boolean)
      .map(p => productCardHTML(p))
      .join("");
  }

  render();
  document.addEventListener("langchange", render);
})();
