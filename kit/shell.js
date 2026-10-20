/* App shell for the demos: side nav + mobile tabs + hash router.
   Kit.app({ brand, nav: [{ id, key, icon, count? }], views: { id: (param) => html }, after?: (id, param) => void }) */
(function () {
  const ICONS = {
    grid: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/></svg>',
    pie: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 3a7 7 0 1 0 7 7h-7z"/><path d="M12.5 2.6A7 7 0 0 1 17.4 7.5H12.5z"/></svg>',
    list: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7 5h10M7 10h10M7 15h10"/><circle cx="3.5" cy="5" r=".8" fill="currentColor"/><circle cx="3.5" cy="10" r=".8" fill="currentColor"/><circle cx="3.5" cy="15" r=".8" fill="currentColor"/></svg>',
    inbox: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 11l2-7h10l2 7v5H3z"/><path d="M3 11h4l1 2h4l1-2h4"/></svg>',
    upload: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13V3M6 7l4-4 4 4M3 13v3h14v-3"/></svg>',
    table: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M3 8h14M3 12.5h14M8 8v9"/></svg>',
    alert: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M10 3l8 14H2z"/><path d="M10 8v4" stroke-linecap="round"/><circle cx="10" cy="14.5" r=".7" fill="currentColor"/></svg>',
    doc: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 2.5h7l3.5 3.5v11.5H5z"/><path d="M12 2.5V6h3.5M7.5 10h5M7.5 13h5"/></svg>',
    phone: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5.5" y="2" width="9" height="16" rx="2"/><path d="M9 15h2" stroke-linecap="round"/></svg>',
    paper: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 3h12v14H4z"/><path d="M7 7h6M7 10h6M7 13h3"/></svg>',
    chart: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 17h14M6 14V9M10 14V5M14 14v-3"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>',
  };

  function app(cfg) {
    const side = document.querySelector(".side nav");
    const tabs = document.querySelector(".mobile-tabs");
    const main = document.querySelector("#view");

    function parse() {
      const h = location.hash.replace(/^#\/?/, "");
      const [id, ...rest] = h.split("/");
      const valid = cfg.nav.some((n) => n.id === id) || (cfg.views[id] && id);
      return { id: valid ? id : cfg.nav[0].id, param: rest.length ? decodeURIComponent(rest.join("/")) : null };
    }

    function navHtml() {
      return cfg.nav.map((n) => {
        const c = n.count ? n.count() : 0;
        return `<a href="#/${n.id}" data-nav="${n.id}">${ICONS[n.icon] || ""}<span>${Kit.t(n.key)}</span>${c ? `<span class="count">${c}</span>` : ""}</a>`;
      }).join("");
    }

    function chrome(id) {
      side.innerHTML = navHtml();
      tabs.innerHTML = cfg.nav.map((n) => { const c = n.count ? n.count() : 0; return `<a href="#/${n.id}" data-nav="${n.id}">${Kit.t(n.key)}${c ? `<span class="count">${c}</span>` : ""}</a>`; }).join("");
      document.querySelectorAll("[data-nav]").forEach((a) => {
        const active = a.dataset.nav === id || (cfg.parentOf && cfg.parentOf[id] === a.dataset.nav);
        if (active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
    }

    let last = null;
    function render(keepScroll) {
      const { id, param } = parse();
      chrome(id);
      const changed = !last || last !== id + "|" + param;
      main.innerHTML = `<div class="view${changed ? "" : " still"}">${cfg.views[id](param)}</div>`;
      if (!keepScroll && changed) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      last = id + "|" + param;
      Kit.I18N.apply(main);
      cfg.after && cfg.after(id, param);
    }

    window.addEventListener("hashchange", () => render(false));
    Kit.I18N.onChange(() => render(true));
    document.addEventListener("DOMContentLoaded", () => render(true));
    return { render: () => render(true), go: (h) => { location.hash = h; }, refreshNav: () => chrome(parse().id), icons: ICONS };
  }

  window.Kit.app = app;
  window.Kit.icons = ICONS;
})();
