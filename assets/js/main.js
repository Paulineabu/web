(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy");
      const el = document.querySelector(sel);
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.value || el.textContent || "");
        const old = btn.textContent;
        btn.textContent = "Copied ✓";
        setTimeout(() => (btn.textContent = old), 1400);
      } catch {
        // ignore
      }
    });
  });
})();