(() => {
  const cfg = window.SITE_CONFIG || {};
  const id = cfg.GA4_MEASUREMENT_ID;
  if (!id || id === "G-XXXXXXXXXX") return;

  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s1);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });
})();