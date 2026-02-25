(() => {
  const listEl = document.getElementById("articlesList");
  if (!listEl) return;

  const categoryEl = document.getElementById("filterCategory");
  const tagEl = document.getElementById("filterTag");
  const qEl = document.getElementById("filterQ");

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    } catch { return iso; }
  };

  const uniq = (arr) => Array.from(new Set(arr)).sort((a,b)=>a.localeCompare(b));

  const render = (items) => {
    if (!items.length) {
      listEl.innerHTML = '<div class="card"><h3 style="margin:0;">No matches</h3><p class="muted">Try clearing filters, or searching by a broader term.</p></div>';
      return;
    }
    listEl.innerHTML = items.map(a => `
      <article class="article-card2">
        <a href="${a.url}" style="text-decoration:none;">
          <div class="cover" style="background-image:url('${a.featuredImage || ''}');"></div>
          <div class="body">
            <div class="article-meta" style="margin:0;">
              <span class="pill">${a.category || "Article"}</span>
              <span>${fmtDate(a.datePublished)}</span>
            </div>
            <h3 style="margin-top:10px;">${a.title}</h3>
            <p>${a.description || ""}</p>
            <div class="tags" aria-label="Tags">
              ${(a.tags || []).slice(0,4).map(t=>`<span>${t}</span>`).join("")}
            </div>
          </div>
        </a>
      </article>
    `).join("");
  };

  const apply = (all) => {
    const q = (qEl?.value || "").trim().toLowerCase();
    const c = (categoryEl?.value || "");
    const t = (tagEl?.value || "");
    let items = all.slice();

    if (c) items = items.filter(a => (a.category || "") === c);
    if (t) items = items.filter(a => (a.tags || []).includes(t));
    if (q) items = items.filter(a => {
      const hay = `${a.title||""} ${a.description||""} ${(a.tags||[]).join(" ")} ${a.category||""}`.toLowerCase();
      return hay.includes(q);
    });

    items.sort((a,b) => (b.datePublished||"").localeCompare(a.datePublished||""));
    render(items);
  };

  fetch("content/articles.json")
    .then(r => r.json())
    .then(all => {
      const cats = uniq(all.map(a => a.category).filter(Boolean));
      const tags = uniq(all.flatMap(a => a.tags || []));

      if (categoryEl) categoryEl.innerHTML = '<option value="">All categories</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join("");
      if (tagEl) tagEl.innerHTML = '<option value="">All tags</option>' + tags.map(t=>`<option value="${t}">${t}</option>`).join("");

      categoryEl && categoryEl.addEventListener("change", () => apply(all));
      tagEl && tagEl.addEventListener("change", () => apply(all));
      qEl && qEl.addEventListener("input", () => apply(all));

      apply(all);
    })
    .catch(() => {
      listEl.innerHTML = '<div class="card"><h3 style="margin:0;">Unable to load articles</h3><p class="muted">Check that content/articles.json exists in the repo.</p></div>';
    });
})();