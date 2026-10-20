/* One-click report demo. A workbook of regional sales becomes a two-page bulletin:
   validated, totalled, charted and written from the numbers. Edit a figure and regenerate. */
(function () {
  const { t, F, esc, $, $$, I18N } = Kit;

  I18N.add({
    en: {
      "rp.title": "One-click report · live demo", "rp.name": "One-click report", "rp.sub": "Quarterly bulletin",
      "nav.book": "Workbook", "nav.pub": "Publication",
      "tour.1": "Change a few numbers in the workbook. Try making West the best region.", "tour.2": "Press “Generate publication” and read the summary it writes.",
      "tour.3": "Type a letter into a cell and see the publication refuse to build until it's fixed.",
      "wb.h": "Q2 2026 workbook", "wb.p": "Revenue by region, as the finance team enters it. Every cell is editable.", "wb.gen": "Generate publication", "wb.reset": "Reset figures",
      "wb.region": "Region", "wb.apr": "Apr 2026", "wb.may": "May 2026", "wb.jun": "Jun 2026", "wb.q2": "Q2 2026", "wb.prev": "Q2 2025", "wb.total": "Total", "wb.yoy": "Change",
      "wb.ok": "All {n} figures are valid. Totals reconcile.", "wb.bad": "{n} problem(s) to fix before anything can be published:",
      "wb.nan": "{c}: “{v}” is not a number.", "wb.neg": "{c}: revenue can't be negative.", "wb.empty": "{c} is empty.",
      "wb.changed": "{n} figure(s) changed since the last publication.",
      "log.1": "Reading the workbook ({n} figures)", "log.2": "Validating every figure", "log.3": "Computing totals, shares and growth", "log.4": "Drawing the charts", "log.5": "Writing the summary", "log.6": "Laying out two pages",
      "log.done": "Done in {s} seconds",
      "pb.none": "Nothing generated yet.", "pb.noneP": "Go to the workbook and press Generate.", "pb.go": "Open the workbook",
      "pb.print": "Print or save as PDF", "pb.back": "Edit the figures", "pb.diff": "Highlighted sentences changed since the previous version.",
      "pg.org": "Meridian Retail Group", "pg.kind": "Quarterly bulletin", "pg.period": "Second quarter 2026", "pg.page": "Page {n} of 2",
      "pg.gen": "Generated {d} from the Q2 workbook, version {v}. No figure in this document was typed by hand.",
      "pg.kRev": "Revenue, Q2 2026", "pg.kYoy": "Change on Q2 2025", "pg.kLead": "Fastest-growing region", "pg.kMonth": "Strongest month",
      "pg.c1": "Revenue by region", "pg.c1s": "Q2 2025 and Q2 2026", "pg.c2": "Total revenue by month", "pg.c2s": "Second quarter 2026", "pg.c3": "Growth by region", "pg.c3s": "Q2 2026 against Q2 2025",
      "pg.t1": "Table 1. Revenue by region and month", "pg.t2": "Table 2. Each region's share of revenue",
      "pg.share": "Share", "pg.shareP": "Share Q2 2025", "pg.notes": "Notes", "pg.n1": "Figures are in US dollars and are not adjusted for inflation.",
      "pg.n2": "Change compares the second quarter of 2026 with the second quarter of 2025.", "pg.n3": "Before publication, every figure is checked to be a number and every total is recomputed from its parts.",
      "h.up": "Revenue up {p} on a year earlier", "h.down": "Revenue down {p} on a year earlier", "h.flat": "Revenue level with a year earlier",
      "s.1up": "Revenue reached {v} in the second quarter of 2026, {p} more than in the same quarter of 2025.",
      "s.1down": "Revenue was {v} in the second quarter of 2026, {p} less than in the same quarter of 2025.",
      "s.1flat": "Revenue was {v} in the second quarter of 2026, almost exactly the same as a year earlier.",
      "s.2": "{a} grew fastest ({pa}).", "s.2fall": "{b} was the only region to shrink ({pb}).", "s.2falls": "{n} regions shrank, led by {b} ({pb}).", "s.2least": "{b} grew least ({pb}).",
      "s.3": "{r} remains the largest region, with {s} of all revenue.", "s.4": "{m} was the strongest month, at {v}.", "s.4w": "Revenue weakened through the quarter, from {a} in April to {b} in June.",
      "m.4": "April", "m.5": "May", "m.6": "June",
    },
    es: {
      "rp.title": "Reporte en un clic · demo en vivo", "rp.name": "Reporte en un clic", "rp.sub": "Boletín trimestral",
      "nav.book": "Libro de trabajo", "nav.pub": "Publicación",
      "tour.1": "Cambia algunos números del libro. Intenta que West sea la mejor región.", "tour.2": "Presiona “Generar publicación” y lee el resumen que escribe.",
      "tour.3": "Escribe una letra en una celda y mira cómo la publicación se niega a generarse hasta corregirla.",
      "wb.h": "Libro de trabajo T2 2026", "wb.p": "Ingresos por región, tal como los ingresa el equipo de finanzas. Cada celda se puede editar.", "wb.gen": "Generar publicación", "wb.reset": "Restablecer cifras",
      "wb.region": "Región", "wb.apr": "Abr 2026", "wb.may": "May 2026", "wb.jun": "Jun 2026", "wb.q2": "T2 2026", "wb.prev": "T2 2025", "wb.total": "Total", "wb.yoy": "Cambio",
      "wb.ok": "Las {n} cifras son válidas. Los totales cuadran.", "wb.bad": "{n} problema(s) por corregir antes de publicar:",
      "wb.nan": "{c}: “{v}” no es un número.", "wb.neg": "{c}: los ingresos no pueden ser negativos.", "wb.empty": "{c} está vacía.",
      "wb.changed": "{n} cifra(s) cambiaron desde la última publicación.",
      "log.1": "Leyendo el libro ({n} cifras)", "log.2": "Validando cada cifra", "log.3": "Calculando totales, participaciones y crecimiento", "log.4": "Dibujando los gráficos", "log.5": "Redactando el resumen", "log.6": "Diagramando dos páginas",
      "log.done": "Listo en {s} segundos",
      "pb.none": "Todavía no se ha generado nada.", "pb.noneP": "Ve al libro de trabajo y presiona Generar.", "pb.go": "Abrir el libro",
      "pb.print": "Imprimir o guardar como PDF", "pb.back": "Editar las cifras", "pb.diff": "Las frases resaltadas cambiaron respecto a la versión anterior.",
      "pg.org": "Meridian Retail Group", "pg.kind": "Boletín trimestral", "pg.period": "Segundo trimestre 2026", "pg.page": "Página {n} de 2",
      "pg.gen": "Generado el {d} a partir del libro T2, versión {v}. Ninguna cifra de este documento se escribió a mano.",
      "pg.kRev": "Ingresos, T2 2026", "pg.kYoy": "Cambio sobre T2 2025", "pg.kLead": "Región de mayor crecimiento", "pg.kMonth": "Mes más fuerte",
      "pg.c1": "Ingresos por región", "pg.c1s": "T2 2025 y T2 2026", "pg.c2": "Ingresos totales por mes", "pg.c2s": "Segundo trimestre 2026", "pg.c3": "Crecimiento por región", "pg.c3s": "T2 2026 frente a T2 2025",
      "pg.t1": "Cuadro 1. Ingresos por región y mes", "pg.t2": "Cuadro 2. Participación de cada región en los ingresos",
      "pg.share": "Partic.", "pg.shareP": "Partic. T2 2025", "pg.notes": "Notas", "pg.n1": "Cifras en dólares estadounidenses, sin ajuste por inflación.",
      "pg.n2": "El cambio compara el segundo trimestre de 2026 con el segundo trimestre de 2025.", "pg.n3": "Antes de publicar, se verifica que cada cifra sea un número y cada total se recalcula a partir de sus partes.",
      "h.up": "Los ingresos suben {p} frente al año anterior", "h.down": "Los ingresos bajan {p} frente al año anterior", "h.flat": "Ingresos al mismo nivel que el año anterior",
      "s.1up": "Los ingresos alcanzaron {v} en el segundo trimestre de 2026, {p} más que en el mismo trimestre de 2025.",
      "s.1down": "Los ingresos fueron {v} en el segundo trimestre de 2026, {p} menos que en el mismo trimestre de 2025.",
      "s.1flat": "Los ingresos fueron {v} en el segundo trimestre de 2026, prácticamente igual que un año antes.",
      "s.2": "{a} fue la región que más creció ({pa}).", "s.2fall": "{b} fue la única región que se contrajo ({pb}).", "s.2falls": "{n} regiones se contrajeron, encabezadas por {b} ({pb}).", "s.2least": "{b} fue la que menos creció ({pb}).",
      "s.3": "{r} sigue siendo la región más grande, con {s} de todos los ingresos.", "s.4": "{m} fue el mes más fuerte, con {v}.", "s.4w": "Los ingresos se debilitaron durante el trimestre, de {a} en abril a {b} en junio.",
      "m.4": "Abril", "m.5": "Mayo", "m.6": "Junio",
    },
  });

  const REGIONS = ["North", "South", "East", "West", "Online"];
  const COLS = ["apr", "may", "jun", "prev"];
  const BASE = {
    North: [148200, 152900, 161000, 412300], South: [108400, 110100, 112900, 318900], East: [98300, 100400, 102500, 287650],
    West: [82900, 81300, 81400, 254100], Online: [61200, 66800, 73900, 162400],
  };
  const clone = () => Object.fromEntries(REGIONS.map((r) => [r, BASE[r].map(String)]));
  const S = { cells: clone(), pub: null, prevPub: null, version: 0, publishedCells: null, building: false };
  const cellRef = (r, c) => `${"BCDE"[c]}${REGIONS.indexOf(r) + 2}`;

  function parse(v) { const s = String(v).trim().replace(/[,\s$]/g, ""); if (s === "") return { err: "empty" }; if (!/^-?\d+(\.\d+)?$/.test(s)) return { err: "nan" }; const n = Number(s); return n < 0 ? { err: "neg" } : { n }; }
  function problems() {
    const out = [];
    REGIONS.forEach((r) => COLS.forEach((_, c) => { const p = parse(S.cells[r][c]); if (p.err) out.push({ r, c, msg: t("wb." + p.err, { c: cellRef(r, c), v: S.cells[r][c] }) }); }));
    return out;
  }
  const val = (r, c) => parse(S.cells[r][c]).n ?? 0;
  const q2 = (r) => val(r, 0) + val(r, 1) + val(r, 2);

  /* ---------------- workbook ---------------- */
  function book() {
    const probs = problems();
    const bad = new Set(probs.map((p) => p.r + p.c));
    const changed = S.publishedCells ? REGIONS.reduce((n, r) => n + COLS.filter((_, c) => S.publishedCells[r][c] !== S.cells[r][c]).length, 0) : 0;
    const tot = (c) => REGIONS.reduce((s, r) => s + val(r, c), 0);
    const T = REGIONS.reduce((s, r) => s + q2(r), 0), P = tot(3);
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      <div class="page-head"><div><h1 data-i18n="wb.h"></h1><p data-i18n="wb.p"></p></div>
        <div class="toolbar" style="margin:0"><button class="btn btn-ghost btn-s" type="button" data-reset data-i18n="wb.reset"></button><button class="btn btn-accent" type="button" data-gen ${probs.length ? "disabled" : ""} data-i18n="wb.gen"></button></div></div>
      <div class="sheet-wrap"><table class="sheet">
        <thead><tr><th class="corner"></th>${["A", "B", "C", "D", "E", "F", "G"].map((l) => `<th class="colh">${l}</th>`).join("")}</tr>
          <tr><th class="rowh">1</th><th>${t("wb.region")}</th><th>${t("wb.apr")}</th><th>${t("wb.may")}</th><th>${t("wb.jun")}</th><th>${t("wb.prev")}</th><th class="calc">${t("wb.q2")}</th><th class="calc">${t("wb.yoy")}</th></tr></thead>
        <tbody>${REGIONS.map((r, i) => {
          const g = val(r, 3) ? ((q2(r) - val(r, 3)) / val(r, 3)) * 100 : 0;
          return `<tr><th class="rowh">${i + 2}</th><td class="lbl">${r}</td>${COLS.map((_, c) => `<td class="${bad.has(r + c) ? "err" : ""}${S.publishedCells && S.publishedCells[r][c] !== S.cells[r][c] ? " chg" : ""}"><input value="${esc(S.cells[r][c])}" data-r="${r}" data-c="${c}" aria-label="${r} ${COLS[c]}" inputmode="decimal" spellcheck="false"></td>`).join("")}
            <td class="calc">${F.num(q2(r))}</td><td class="calc ${g >= 0 ? "up" : "down"}">${F.pct(g, 1, true)}</td></tr>`;
        }).join("")}
          <tr class="tot"><th class="rowh">7</th><td class="lbl">${t("wb.total")}</td>${[0, 1, 2, 3].map((c) => `<td class="calc">${F.num(tot(c))}</td>`).join("")}<td class="calc">${F.num(T)}</td><td class="calc ${T >= P ? "up" : "down"}">${F.pct(P ? ((T - P) / P) * 100 : 0, 1, true)}</td></tr>
        </tbody></table></div>
      <div class="status ${probs.length ? "bad" : "good"}">${probs.length
        ? `<b>${t("wb.bad", { n: probs.length })}</b><ul>${probs.map((p) => `<li>${esc(p.msg)}</li>`).join("")}</ul>`
        : `✓ ${t("wb.ok", { n: REGIONS.length * COLS.length })}${changed ? ` <span class="chg-note">${t("wb.changed", { n: changed })}</span>` : ""}`}</div>
      <div class="buildlog" id="log" hidden></div>`;
  }

  /* ---------------- generation ---------------- */
  function compute() {
    const rows = REGIONS.map((r) => ({ r, m: [val(r, 0), val(r, 1), val(r, 2)], q: q2(r), p: val(r, 3) })).map((x) => ({ ...x, g: x.p ? (x.q - x.p) / x.p : 0 }));
    const T = rows.reduce((s, x) => s + x.q, 0), P = rows.reduce((s, x) => s + x.p, 0);
    const months = [0, 1, 2].map((i) => rows.reduce((s, x) => s + x.m[i], 0));
    return { rows, T, P, g: P ? (T - P) / P : 0, months };
  }

  function write(d) {
    const pct = (x) => F.pct(Math.abs(x) * 100, 1);
    const spct = (x) => F.pct(x * 100, 1, true);
    const byG = [...d.rows].sort((a, b) => b.g - a.g);
    const lead = byG[0], last = byG[byG.length - 1];
    const falls = d.rows.filter((x) => x.g < 0);
    const big = [...d.rows].sort((a, b) => b.q - a.q)[0];
    const flat = Math.abs(d.g) < 0.005;
    const headline = flat ? t("h.flat") : t(d.g > 0 ? "h.up" : "h.down", { p: pct(d.g) });
    const s = [];
    s.push(flat ? t("s.1flat", { v: F.money(d.T) }) : t(d.g > 0 ? "s.1up" : "s.1down", { v: F.money(d.T), p: pct(d.g) }));
    let s2 = t("s.2", { a: lead.r, pa: spct(lead.g) });
    if (falls.length === 1) s2 += " " + t("s.2fall", { b: falls[0].r, pb: spct(falls[0].g) });
    else if (falls.length > 1) s2 += " " + t("s.2falls", { n: falls.length, b: last.r, pb: spct(last.g) });
    else s2 += " " + t("s.2least", { b: last.r, pb: spct(last.g) });
    s.push(s2);
    s.push(t("s.3", { r: big.r, s: F.pct((big.q / d.T) * 100, 0) }));
    const mi = d.months.indexOf(Math.max(...d.months));
    s.push(d.months[0] > d.months[1] && d.months[1] > d.months[2] ? t("s.4w", { a: F.money(d.months[0]), b: F.money(d.months[2]) }) : t("s.4", { m: t("m." + (mi + 4)), v: F.money(d.months[mi]) }));
    return { headline, s, lead, mi };
  }

  function grouped(d) {
    const W = 700, H = 230, pl = 46, pb = 26, pt = 10;
    const max = Math.max(...d.rows.flatMap((x) => [x.q, x.p])) * 1.12;
    const bw = (W - pl) / d.rows.length;
    const y = (v) => pt + (H - pt - pb) * (1 - v / max);
    let g = "";
    for (let k = 0; k <= 4; k++) { const v = (max / 4) * k; g += `<line class="grid" x1="${pl}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="axis" x="${pl - 6}" y="${y(v) + 4}" text-anchor="end">${F.short(v)}</text>`; }
    d.rows.forEach((x, i) => {
      const x0 = pl + i * bw + bw * 0.16, w = bw * 0.32;
      g += `<rect x="${x0}" y="${y(x.p)}" width="${w}" height="${y(0) - y(x.p)}" fill="#cfcdc4" rx="2"/>`;
      g += `<rect x="${x0 + w + 3}" y="${y(x.q)}" width="${w}" height="${y(0) - y(x.q)}" fill="#0b7a55" rx="2"/>`;
      g += `<text class="axis" x="${pl + i * bw + bw / 2}" y="${H - 8}" text-anchor="middle">${x.r}</text>`;
    });
    return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}</svg><div class="key"><span><i style="background:#cfcdc4"></i>Q2 2025</span><span><i style="background:#0b7a55"></i>Q2 2026</span></div>`;
  }

  function monthly(d, mi) {
    const W = 520, H = 200, pl = 46, pb = 26, pt = 16;
    const max = Math.max(...d.months) * 1.15;
    const bw = (W - pl) / 3;
    const y = (v) => pt + (H - pt - pb) * (1 - v / max);
    let g = "";
    for (let k = 0; k <= 4; k++) { const v = (max / 4) * k; g += `<line class="grid" x1="${pl}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="axis" x="${pl - 6}" y="${y(v) + 4}" text-anchor="end">${F.short(v)}</text>`; }
    d.months.forEach((v, i) => {
      const x0 = pl + i * bw + bw * 0.25;
      g += `<rect x="${x0}" y="${y(v)}" width="${bw * 0.5}" height="${y(0) - y(v)}" fill="${i === mi ? "#0b7a55" : "#2b2b2b"}" rx="3"/>`;
      g += `<text class="val" x="${x0 + bw * 0.25}" y="${y(v) - 6}" text-anchor="middle">${F.short(v)}</text>`;
      g += `<text class="axis" x="${pl + i * bw + bw / 2}" y="${H - 8}" text-anchor="middle">${t("m." + (i + 4))}</text>`;
    });
    return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}</svg>`;
  }

  function generate() {
    if (problems().length || S.building) return;
    S.building = true;
    const steps = [t("log.1", { n: REGIONS.length * COLS.length }), t("log.2"), t("log.3"), t("log.4"), t("log.5"), t("log.6")];
    const log = $("#log"); log.hidden = false;
    log.innerHTML = steps.map((s) => `<div><span class="tick"></span>${esc(s)}</div>`).join("");
    const lines = $$("div", log), t0 = performance.now();
    lines.forEach((l, i) => setTimeout(() => { l.classList.add("on"); if (i) lines[i - 1].classList.add("ok"); }, i * 260));
    setTimeout(() => {
      lines[lines.length - 1].classList.add("ok");
      log.insertAdjacentHTML("beforeend", `<p>${t("log.done", { s: F.num((performance.now() - t0) / 1000, 1) })}</p>`);
      S.prevPub = S.pub; S.version++;
      const d = compute();
      S.pub = { d, w: write(d), at: new Date(), v: S.version, lang: I18N.lang };
      S.publishedCells = JSON.parse(JSON.stringify(S.cells));
      S.building = false;
      setTimeout(() => { location.hash = "#/pub"; }, 450);
    }, steps.length * 260 + 120);
  }

  /* ---------------- publication ---------------- */
  function pub() {
    if (!S.pub) return `<div class="page-head"><div><h1 data-i18n="nav.pub"></h1></div></div><div class="card empty" style="padding:70px 20px"><b data-i18n="pb.none"></b><p data-i18n="pb.noneP"></p><a class="btn btn-dark" href="#/book" data-i18n="pb.go"></a></div>`;
    // rewrite in the current language on the fly, keep the figures
    const d = S.pub.d, w = write(d);
    const prev = S.prevPub ? write(S.prevPub.d) : null;
    const changed = (i) => prev && prev.s[i] !== w.s[i];
    const date = S.pub.at.toLocaleDateString(I18N.lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric" });
    const totalRow = [0, 1, 2].map((i) => d.months[i]);
    const head = `<div class="pg-head"><span class="pg-org">${t("pg.org")}</span><span>${t("pg.kind")} · ${t("pg.period")}</span></div>`;
    return `<div class="page-head no-print"><div><h1 data-i18n="nav.pub"></h1>${prev && w.s.some((_, i) => changed(i)) ? `<p><mark class="mk">${t("pb.diff")}</mark></p>` : ""}</div>
        <div class="toolbar" style="margin:0"><a class="btn btn-ghost btn-s" href="#/book" data-i18n="pb.back"></a><button class="btn btn-dark btn-s" type="button" data-print data-i18n="pb.print"></button></div></div>
      <div class="pages">
        <article class="pg">
          ${head}
          <p class="pg-kicker">${t("pg.kind")}</p>
          <h2 class="pg-h${prev && prev.headline !== w.headline ? " mk" : ""}">${esc(w.headline)}</h2>
          <div class="pg-kpis">
            <div><span>${t("pg.kRev")}</span><b>${F.money(d.T)}</b></div>
            <div><span>${t("pg.kYoy")}</span><b class="${d.g >= 0 ? "up" : "down"}">${F.pct(d.g * 100, 1, true)}</b></div>
            <div><span>${t("pg.kLead")}</span><b>${w.lead.r}</b></div>
            <div><span>${t("pg.kMonth")}</span><b>${t("m." + (w.mi + 4))}</b></div>
          </div>
          <p class="pg-lede">${w.s.map((s, i) => `<span class="${changed(i) ? "mk" : ""}">${esc(s)}</span>`).join(" ")}</p>
          <figure class="pg-fig"><figcaption><b>${t("pg.c1")}</b><span>${t("pg.c1s")}</span></figcaption>${grouped(d)}</figure>
          <div class="pg-charts">
            <figure><figcaption><b>${t("pg.c2")}</b><span>${t("pg.c2s")}</span></figcaption>${monthly(d, w.mi)}</figure>
            <figure><figcaption><b>${t("pg.c3")}</b><span>${t("pg.c3s")}</span></figcaption>
              <div class="growth">${[...d.rows].sort((a, b) => b.g - a.g).map((x) => { const mx = Math.max(...d.rows.map((y) => Math.abs(y.g))) || 1;
                return `<div><span>${x.r}</span><span class="gtrack"><i class="${x.g < 0 ? "neg" : ""}" style="width:${(Math.abs(x.g) / mx) * 50}%"></i></span><b class="${x.g >= 0 ? "up" : "down"}">${F.pct(x.g * 100, 1, true)}</b></div>`; }).join("")}</div></figure>
          </div>
          <footer class="pg-foot"><span>${t("pg.org")}</span><span>${t("pg.page", { n: 1 })}</span></footer>
        </article>
        <article class="pg">
          ${head}
          <h3 class="pg-t">${t("pg.t1")}</h3>
          <table class="pg-tbl"><thead><tr><th>${t("wb.region")}</th><th>${t("wb.apr")}</th><th>${t("wb.may")}</th><th>${t("wb.jun")}</th><th>${t("wb.q2")}</th><th>${t("wb.prev")}</th><th>${t("wb.yoy")}</th></tr></thead>
            <tbody>${d.rows.map((x) => `<tr><th>${x.r}</th>${x.m.map((v) => `<td>${F.num(v)}</td>`).join("")}<td><b>${F.num(x.q)}</b></td><td>${F.num(x.p)}</td><td class="${x.g >= 0 ? "up" : "down"}">${F.pct(x.g * 100, 1, true)}</td></tr>`).join("")}
            <tr class="tot"><th>${t("wb.total")}</th>${totalRow.map((v) => `<td>${F.num(v)}</td>`).join("")}<td><b>${F.num(d.T)}</b></td><td>${F.num(d.P)}</td><td class="${d.g >= 0 ? "up" : "down"}">${F.pct(d.g * 100, 1, true)}</td></tr></tbody></table>
          <h3 class="pg-t">${t("pg.t2")}</h3>
          <table class="pg-tbl"><thead><tr><th>${t("wb.region")}</th><th>${t("pg.share")}</th><th></th><th>${t("pg.shareP")}</th></tr></thead>
            <tbody>${d.rows.map((x) => `<tr><th>${x.r}</th><td>${F.pct((x.q / d.T) * 100, 1)}</td><td class="barcell"><span style="width:${(x.q / d.T) * 100 * 2.2}%"></span></td><td>${F.pct((x.p / d.P) * 100, 1)}</td></tr>`).join("")}</tbody></table>
          <div class="pg-notes"><b>${t("pg.notes")}</b><ol><li>${t("pg.n1")}</li><li>${t("pg.n2")}</li><li>${t("pg.n3")}</li></ol></div>
          <p class="pg-gen">${t("pg.gen", { d: date, v: S.pub.v })}</p>
          <footer class="pg-foot"><span>${t("pg.org")}</span><span>${t("pg.page", { n: 2 })}</span></footer>
        </article>
      </div>`;
  }

  /* ---------------- wiring ---------------- */
  const A = Kit.app({ nav: [{ id: "book", key: "nav.book", icon: "table" }, { id: "pub", key: "nav.pub", icon: "doc" }], views: { book, pub } });

  const view = $("#view");
  view.addEventListener("click", (e) => {
    if (e.target.closest("[data-gen]")) return generate();
    if (e.target.closest("[data-reset]")) { S.cells = clone(); return A.render(); }
    if (e.target.closest("[data-print]")) return window.print();
  });
  // re-render on commit, not on every keystroke, so typing stays smooth
  view.addEventListener("change", (e) => {
    const i = e.target.closest("input[data-r]"); if (!i) return;
    S.cells[i.dataset.r][Number(i.dataset.c)] = i.value;
    // wait for focus to land on the next cell, redraw, then put focus back there
    setTimeout(() => {
      const a = document.activeElement, at = a && a.dataset && a.dataset.r ? [a.dataset.r, a.dataset.c] : null;
      A.render();
      if (at) { const el = $(`input[data-r="${at[0]}"][data-c="${at[1]}"]`); el && el.focus(); }
    }, 0);
  });
  view.addEventListener("keydown", (e) => {
    const i = e.target.closest("input[data-r]"); if (!i) return;
    const r = REGIONS.indexOf(i.dataset.r), c = Number(i.dataset.c);
    const move = { Enter: [1, 0], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[e.key];
    if (move) {
      e.preventDefault();
      const nr = REGIONS[Math.max(0, Math.min(REGIONS.length - 1, r + move[0]))];
      S.cells[i.dataset.r][c] = i.value; A.render();
      const el = $(`input[data-r="${nr}"][data-c="${c}"]`); el && (el.focus(), el.select());
    }
  });
  view.addEventListener("focusin", (e) => { if (e.target.matches("input[data-r]")) e.target.select(); });
})();
