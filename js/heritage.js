// heritage.js — form appointment (milik C)
(function () {
  const form = document.getElementById("atelierForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("aName");
    const contact = document.getElementById("aContact");
    const message = document.getElementById("aMsg");

    if (!name.value.trim() || !contact.value.trim()) {
      showToast(t("atelier.err"));
      return;
    }

    addAppointment({
      name: name.value.trim(),
      contact: contact.value.trim(),
      message: message.value.trim(),
      requestedAt: new Date().toISOString()
    });

    form.reset();
    showToast(t("atelier.ok"));
  });
})();
