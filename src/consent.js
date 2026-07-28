(function () {
  const cookie = document.querySelector("[data-cookie]");
  const consentKey = "pack-cookie-consent";
  if (!cookie) return;

  if (localStorage.getItem(consentKey) !== "accepted") {
    cookie.hidden = false;
  }

  cookie.querySelectorAll("[data-cookie-accept]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem(consentKey, "accepted");
      cookie.hidden = true;
      window.loadSiteAnalytics?.();
    });
  });
})();
