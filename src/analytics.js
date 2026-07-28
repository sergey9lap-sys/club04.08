(function () {
  const analytics = window.siteAnalytics || {};

  const loadMetrika = () => {
    const counterId = analytics.yandexId;
    if (!counterId || window.__siteMetrikaLoaded) return;
    window.__siteMetrikaLoaded = true;
    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = Date.now();
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
    document.head.append(script);
    window.ym(counterId, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });
  };

  const loadMetaPixel = () => {
    const pixelId = analytics.metaPixelId;
    if (!pixelId || window.fbq) return;
    const fbq = window.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.append(script);
    fbq("init", pixelId);
    fbq("track", "PageView");
  };

  window.loadSiteAnalytics = () => {
    loadMetrika();
    loadMetaPixel();
  };

  if (localStorage.getItem("pack-cookie-consent") === "accepted") {
    window.loadSiteAnalytics();
  }
})();
