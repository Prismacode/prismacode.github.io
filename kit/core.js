/* Shared runtime for the v2 front: language, formatting, seeded data, SVG charts.
   No dependencies. Every demo page loads this first. */
(function () {
  const KEY = "portfolio-locale"; // shared with the /systems catalogue
  const dict = { en: {}, es: {} };
  const listeners = [];

  function readLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "es" || q === "en") return q;
    try { return localStorage.getItem(KEY) === "es" ? "es" : "en"; } catch { return "en"; }
  }

  let lang = readLang();
  document.documentElement.lang = lang;
  document.documentElement.classList.add("js");

  const I18N = {
    get lang() { return lang; },
    add(d) { Object.assign(dict.en, d.en || {}); Object.assign(dict.es, d.es || {}); },
    t(key, vars) {
      let s = dict[lang][key] ?? dict.en[key] ?? key;
      if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k]);
      return s;
    },
    set(next) {
      lang = next;
      document.documentElement.lang = lang;
      try { localStorage.setItem(KEY, lang); } catch {}
      const url = new URL(location.href);
      if (lang === "es") url.searchParams.set("lang", "es"); else url.searchParams.delete("lang");
      history.replaceState(null, "", url);
      I18N.apply(document);
      listeners.forEach((fn) => fn(lang));
    },
    onChange(fn) { listeners.push(fn); },
    apply(root) {
      root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = I18N.t(el.dataset.i18n); });
      root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = I18N.t(el.dataset.i18nHtml); });
      root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        el.dataset.i18nAttr.split(";").forEach((pair) => {
          const [attr, key] = pair.split(":");
          el.setAttribute(attr, I18N.t(key));
        });
      });
      root.querySelectorAll("a[data-wa]").forEach((a) => {
        const demo = document.querySelector(".dbar .ttl");
        a.href = "https://wa.me/2975664692?text=" + encodeURIComponent(I18N.t(a.dataset.wa, { demo: demo ? demo.textContent : "" }));
      });
      root.querySelectorAll("a[data-loc]").forEach((a) => {
        const base = a.dataset.loc;
        const [path, hash] = base.split("#");
        a.href = lang === "es" ? `${path}${path.includes("?") ? "&" : "?"}lang=es${hash ? "#" + hash : ""}` : base;
      });
      root.querySelectorAll("[data-lang-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang)));
      const title = document.querySelector("meta[name='x-title-key']");
      if (title) document.title = I18N.t(title.content);
    },
  };

  /* ---- formatting ---- */
  const loc = () => (lang === "es" ? "es-ES" : "en-US");
  const F = {
    money(n, dp = 0) {
      const s = new Intl.NumberFormat(loc(), { minimumFractionDigits: dp, maximumFractionDigits: dp }).format(Math.abs(n));
      return (n < 0 ? "−" : "") + "$" + s;
    },
    short(n) {
      const a = Math.abs(n);
      if (a >= 1e6) return (n / 1e6).toLocaleString(loc(), { maximumFractionDigits: 2 }) + "M";
      if (a >= 1e3) return (n / 1e3).toLocaleString(loc(), { maximumFractionDigits: 1 }) + "K";
      return Math.round(n).toLocaleString(loc());
    },
    num(n, dp = 0) { return new Intl.NumberFormat(loc(), { minimumFractionDigits: dp, maximumFractionDigits: dp }).format(n); },
    pct(n, dp = 1, signed = false) {
      const s = new Intl.NumberFormat(loc(), { minimumFractionDigits: dp, maximumFractionDigits: dp }).format(Math.abs(n));
      return (signed ? (n > 0 ? "+" : n < 0 ? "−" : "") : n < 0 ? "−" : "") + s + "%";
    },
    month(i, style = "short") { return new Date(2025, i, 1).toLocaleString(loc(), { month: style }).replace(".", ""); },
    date(d) { return new Date(d + "T00:00:00").toLocaleDateString(loc(), { day: "numeric", month: "short" }).replace(".", ""); },
  };

  /* ---- deterministic randomness, so the sample data is identical on every visit ---- */
  function rng(seed) {
    let a = seed >>> 0;
    const r = () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.norm = (mu, sd) => mu + sd * Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
    return r;
  }

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---- charts: plain SVG strings, styled by CSS classes ---- */
  const Chart = {
    /* stacked or simple bars. series: [{key,color,values[]}], labels[] */
    bars(labels, series, o = {}) {
      const W = o.w || narrowW(), H = o.h || 240, pl = 44, pr = 8, pt = 12, pb = 26;
      const n = labels.length;
      const totals = labels.map((_, i) => series.reduce((s, se) => s + Math.max(0, se.values[i] || 0), 0));
      const max = niceMax(Math.max(...totals, ...(o.line ? o.line.values : [0]), 1));
      const bw = (W - pl - pr) / n;
      const y = (v) => pt + (H - pt - pb) * (1 - v / max);
      let g = "";
      for (let k = 0; k <= 4; k++) {
        const v = (max / 4) * k, yy = y(v);
        g += `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}"/><text class="axis" x="${pl - 8}" y="${yy + 4}" text-anchor="end">${F.short(v)}</text>`;
      }
      let b = "";
      labels.forEach((lab, i) => {
        let acc = 0;
        const x = pl + i * bw + bw * 0.18, w = bw * 0.64;
        const sel = o.selected == null || o.selected.includes(i);
        b += `<g class="bar-col${sel ? "" : " dim"}" data-i="${i}">`;
        b += `<rect class="hit" x="${pl + i * bw}" y="${pt}" width="${bw}" height="${H - pt - pb}"/>`;
        series.forEach((se, si) => {
          const v = Math.max(0, se.values[i] || 0);
          if (!v) return;
          const y1 = y(acc + v), h = y(acc) - y1;
          const top = si === series.length - 1 || series.slice(si + 1).every((s2) => !(s2.values[i] > 0));
          b += `<rect class="seg" style="--d:${i * 30}ms" x="${x}" y="${y1}" width="${w}" height="${Math.max(0, h - (top ? 0 : 1))}" rx="${top ? 3 : 0}" fill="${se.color}"><title>${esc(lab)} · ${esc(se.label || se.key)}: ${F.money(v)}</title></rect>`;
          acc += v;
        });
        b += `<text class="axis" x="${pl + i * bw + bw / 2}" y="${H - 8}" text-anchor="middle">${esc(lab)}</text></g>`;
      });
      let line = "";
      if (o.line) {
        const pts = o.line.values.map((v, i) => `${pl + i * bw + bw / 2},${y(v)}`).join(" ");
        line = `<polyline class="overlay" points="${pts}" fill="none" stroke="${o.line.color}"/>` +
          o.line.values.map((v, i) => `<circle class="overlay-dot" cx="${pl + i * bw + bw / 2}" cy="${y(v)}" r="3.5" fill="${o.line.color}"><title>${esc(labels[i])} · ${esc(o.line.label)}: ${F.money(v)}</title></circle>`).join("");
      }
      return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || "")}">${g}${b}${line}</svg>`;
    },

    hbars(rows, o = {}) {
      const max = Math.max(...rows.map((r) => r.value), 1);
      return `<div class="hbars">${rows.map((r) => `
        <button class="hbar${r.active ? " on" : ""}" ${r.id != null ? `data-id="${esc(r.id)}"` : ""} type="button">
          <span class="hbar-label">${r.swatch ? `<i style="background:${r.swatch}"></i>` : ""}${esc(r.label)}</span>
          <span class="hbar-track"><span class="hbar-fill" style="width:${(r.value / max) * 100}%;${r.color ? `background:${r.color}` : ""}"></span></span>
          <span class="hbar-val">${o.fmt ? o.fmt(r.value) : F.num(r.value)}</span>
        </button>`).join("")}</div>`;
    },

    donut(parts, o = {}) {
      const R = 70, r = o.thin ? 58 : 50, C = 90;
      const total = parts.reduce((s, p) => s + p.value, 0) || 1;
      let a0 = -Math.PI / 2, out = "";
      parts.forEach((p) => {
        const a1 = a0 + (p.value / total) * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const pt = (rad, ang) => `${C + rad * Math.cos(ang)},${C + rad * Math.sin(ang)}`;
        if (p.value > 0) {
          const d = parts.filter((q) => q.value > 0).length === 1
            ? `M${C},${C - R} A${R},${R} 0 1 1 ${C - 0.01},${C - R} L${C - 0.01},${C - r} A${r},${r} 0 1 0 ${C},${C - r} Z`
            : `M${pt(R, a0)} A${R},${R} 0 ${large} 1 ${pt(R, a1)} L${pt(r, a1)} A${r},${r} 0 ${large} 0 ${pt(r, a0)} Z`;
          out += `<path class="arc${p.dim ? " dim" : ""}" ${p.id != null ? `data-id="${esc(p.id)}"` : ""} d="${d}" fill="${p.color}"><title>${esc(p.label)}: ${o.fmt ? o.fmt(p.value) : F.num(p.value)} (${F.pct((p.value / total) * 100)})</title></path>`;
        }
        a0 = a1;
      });
      return `<svg class="donut" viewBox="0 0 180 180" role="img" aria-label="${esc(o.label || "")}">${out}
        <text class="donut-big" x="90" y="${o.sub ? 92 : 97}" text-anchor="middle">${esc(o.center || "")}</text>
        ${o.sub ? `<text class="donut-sub" x="90" y="112" text-anchor="middle">${esc(o.sub)}</text>` : ""}</svg>`;
    },

    line(labels, series, o = {}) {
      const W = o.w || narrowW(), H = o.h || 200, pl = 44, pr = 12, pt = 12, pb = 26;
      const all = series.flatMap((s) => s.values);
      const max = niceMax(Math.max(...all, 1));
      const x = (i) => pl + (labels.length === 1 ? 0 : (i / (labels.length - 1)) * (W - pl - pr));
      const y = (v) => pt + (H - pt - pb) * (1 - v / max);
      let g = "";
      for (let k = 0; k <= 4; k++) { const v = (max / 4) * k; g += `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}"/><text class="axis" x="${pl - 8}" y="${y(v) + 4}" text-anchor="end">${o.fmtAxis ? o.fmtAxis(v) : F.short(v)}</text>`; }
      labels.forEach((l, i) => { g += `<text class="axis" x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(l)}</text>`; });
      const ls = series.map((s) => {
        const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
        const area = o.area ? `<polygon class="area" points="${x(0)},${y(0)} ${pts} ${x(s.values.length - 1)},${y(0)}" fill="${s.color}"/>` : "";
        return `${area}<polyline class="trend${s.dash ? " dash" : ""}" points="${pts}" fill="none" stroke="${s.color}"/>` +
          s.values.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${s.color}"><title>${esc(labels[i])} · ${esc(s.label)}: ${o.fmt ? o.fmt(v) : F.num(v)}</title></circle>`).join("");
      }).join("");
      return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || "")}">${g}${ls}</svg>`;
    },

    spark(values, color = "currentColor") {
      const W = 100, H = 28, max = Math.max(...values), min = Math.min(...values), span = max - min || 1;
      const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - 2 - ((v - min) / span) * (H - 4)}`).join(" ");
      return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color}"/></svg>`;
    },

    ring(pct, o = {}) {
      const r = 42, c = 2 * Math.PI * r;
      return `<svg class="ring" viewBox="0 0 100 100" aria-label="${esc(o.label || "")}"><circle class="ring-bg" cx="50" cy="50" r="${r}"/>
        <circle class="ring-fg" cx="50" cy="50" r="${r}" stroke="${o.color || "var(--accent)"}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/>
        <text x="50" y="${o.sub ? 52 : 57}" text-anchor="middle" class="ring-big">${Math.round(pct)}<tspan class="ring-pc">%</tspan></text>
        ${o.sub ? `<text x="50" y="68" text-anchor="middle" class="ring-sub">${esc(o.sub)}</text>` : ""}</svg>`;
    },
  };

  // on phones a 640-unit chart shrinks its labels to unreadable; draw it narrower instead
  function narrowW() { return window.innerWidth < 700 ? 380 : 640; }

  function niceMax(v) {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }

  /* ---- small DOM helpers ---- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function toast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function download(name, text, type = "text/csv") {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function reveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* Shared chrome strings */
  I18N.add({
    en: {
      "chrome.back": "All demos", "chrome.sample": "Sample data", "chrome.original": "The real system", "chrome.cta": "Build one for me",
      "wa.general": "Hi Juan, I saw your portfolio and I'd like to talk.",
      "wa.process": "Hi Juan, I saw your portfolio. I have a process I'd like to fix:",
      "wa.demo": "Hi Juan, I tried the {demo} demo on your site and I'd like something like it for my team.",
      "chrome.tryThis": "Try this", "chrome.hide": "Got it", "chrome.private": "Runs entirely in your browser. Nothing you do here is sent anywhere.",
    },
    es: {
      "chrome.back": "Todas las demos", "chrome.sample": "Datos de ejemplo", "chrome.original": "El sistema real", "chrome.cta": "Quiero uno",
      "wa.general": "Hola Juan, vi tu portafolio y me gustaría conversar.",
      "wa.process": "Hola Juan, vi tu portafolio. Tengo un proceso que quiero resolver:",
      "wa.demo": "Hola Juan, probé la demo {demo} en tu sitio y me gustaría algo así para mi equipo.",
      "chrome.tryThis": "Prueba esto", "chrome.hide": "Entendido", "chrome.private": "Todo corre en tu navegador. Nada de lo que hagas aquí se envía a ningún lado.",
    },
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang-btn]");
    if (b) I18N.set(b.dataset.langBtn);
    const hide = e.target.closest("[data-hide-tour]");
    if (hide) { hide.closest(".tour").classList.add("gone"); try { sessionStorage.setItem("tour-" + location.pathname, "1"); } catch {} }
  });

  document.addEventListener("DOMContentLoaded", () => {
    try { if (sessionStorage.getItem("tour-" + location.pathname)) $$(".tour").forEach((t) => t.classList.add("gone")); } catch {}
    I18N.apply(document);
    reveal();
  });

  window.Kit = { I18N, t: (k, v) => I18N.t(k, v), F, rng, Chart, esc, $, $$, toast, download };
})();
