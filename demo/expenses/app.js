/* Spend dashboard demo. A fictional bakery's 2025 bank export, categorised by rules,
   explored as a small app. Everything is generated from a fixed seed. */
(function () {
  const { t, F, esc, Chart, $, $$, toast, download, I18N } = Kit;

  I18N.add({
    en: {
      "ex.title": "Spend dashboard · live demo", "ex.name": "Spend dashboard", "ex.fy": "Books · 2025",
      "nav.overview": "Overview", "nav.categories": "Categories", "nav.tx": "Transactions", "nav.review": "Needs review", "nav.upload": "Use your own file",
      "tour.1": "Click a bar to look at a single month, or a quarter above it.", "tour.2": "Click a slice of the donut to open that category.",
      "tour.3": "Open “Needs review” and sort the transactions the rules couldn't place. Every chart updates.",
      "ov.h": "Where the money went", "ov.p": "{n} transactions from the bank export, {pct} categorised automatically.",
      "per.year": "Full year", "per.month": "{m} only",
      "k.income": "Income", "k.spend": "Spending", "k.net": "Net profit", "k.margin": "Margin",
      "k.vs": "{d} vs {p}", "k.prevQ": "previous quarter", "k.prevM": "previous month", "k.year": "12 months of 2025",
      "c.monthly": "Spending by month", "c.monthlySub": "Stacked by category. The line is income. Click a month.",
      "c.split": "Spending by category", "c.splitSub": "Click a slice to open it",
      "c.insights": "What stands out", "c.insightsSub": "Written by the system from the numbers above",
      "ins.largest": "<b>{c}</b> is the largest cost: {p} of all spending.",
      "ins.best": "<b>{m}</b> was the best month, with {v} left after costs.",
      "ins.worst": "<b>{m}</b> was the weakest month: {v} after costs.",
      "ins.growth": "<b>{c}</b> grew the most in the second half of the year: {p} on the first half.",
      "ins.review": "<b>{n} transactions</b> still need a category. <a href=\"#/review\">Sort them</a> to finish the picture.",
      "ins.allDone": "Every transaction is categorised. The picture is complete.",
      "cat.h": "Categories", "cat.p": "Pick a category to see its trend, who you pay, and every transaction.",
      "cat.share": "of spending", "cat.trend": "Month by month", "cat.vendors": "Who you pay", "cat.recent": "Transactions", "cat.all": "See all in Transactions",
      "cat.income": "This is income, not spending.",
      "tx.h": "Transactions", "tx.p": "The bank export, line by line. Change any category and every chart follows.",
      "tx.search": "Search descriptions", "tx.allCats": "All categories", "tx.date": "Date", "tx.desc": "Description", "tx.cat": "Category", "tx.amount": "Amount",
      "tx.showing": "Showing {a} of {b}", "tx.more": "Show 50 more", "tx.none": "No transaction matches.", "tx.export": "Export CSV",
      "rv.h": "Needs review", "rv.p": "The rules recognised everything else. These lines are ambiguous, so a person decides once and the rule remembers.",
      "rv.remember": "Apply to all {n} from this payee", "rv.done": "All sorted.", "rv.doneP": "Every transaction has a category. Head back to the overview to see the full picture.",
      "rv.back": "Back to the overview", "rv.saved": "Categorised {n} transaction(s). The dashboard is updated.", "rv.pick": "Choose a category",
      "up.h": "Use your own file", "up.p": "Drop in a bank export and the same dashboard is built from it. The file is read inside this tab and is never uploaded.",
      "up.drop": "Drop a CSV file here", "up.or": "or", "up.choose": "choose a file", "up.fmt": "Needs a date, a description and an amount column (or separate debit and credit columns).",
      "up.sample": "Download the sample file", "up.reset": "Back to the sample data",
      "up.loaded": "Loaded {n} transactions from {f}. {p} categorised automatically.",
      "up.err": "Couldn't read that file: {e}", "up.errCols": "no date, description or amount column was found",
      "up.using": "Showing your file: {f}", "up.usingSample": "Showing the sample bakery data.",
      "up.how": "How the categorising works", "up.how1": "Each description is matched against a list of rules (for example, a description containing “PAYROLL” is Payroll).",
      "up.how2": "Anything no rule matches lands in “Needs review” for a person to decide.", "up.how3": "Each decision can become a new rule, so next month needs less review.",
    },
    es: {
      "ex.title": "Panel de gastos · demo en vivo", "ex.name": "Panel de gastos", "ex.fy": "Libros · 2025",
      "nav.overview": "Resumen", "nav.categories": "Categorías", "nav.tx": "Transacciones", "nav.review": "Por revisar", "nav.upload": "Usa tu propio archivo",
      "tour.1": "Haz clic en una barra para ver un solo mes, o en un trimestre arriba.", "tour.2": "Haz clic en una porción de la dona para abrir esa categoría.",
      "tour.3": "Abre “Por revisar” y clasifica las transacciones que las reglas no pudieron ubicar. Todos los gráficos se actualizan.",
      "ov.h": "A dónde se fue el dinero", "ov.p": "{n} transacciones del extracto bancario, {pct} clasificadas automáticamente.",
      "per.year": "Año completo", "per.month": "Solo {m}",
      "k.income": "Ingresos", "k.spend": "Gastos", "k.net": "Ganancia neta", "k.margin": "Margen",
      "k.vs": "{d} vs {p}", "k.prevQ": "trimestre anterior", "k.prevM": "mes anterior", "k.year": "12 meses de 2025",
      "c.monthly": "Gastos por mes", "c.monthlySub": "Apilados por categoría. La línea son los ingresos. Haz clic en un mes.",
      "c.split": "Gastos por categoría", "c.splitSub": "Haz clic en una porción para abrirla",
      "c.insights": "Lo que destaca", "c.insightsSub": "Escrito por el sistema a partir de las cifras",
      "ins.largest": "<b>{c}</b> es el mayor costo: {p} de todo el gasto.",
      "ins.best": "<b>{m}</b> fue el mejor mes, con {v} después de costos.",
      "ins.worst": "<b>{m}</b> fue el mes más débil: {v} después de costos.",
      "ins.growth": "<b>{c}</b> fue lo que más creció en el segundo semestre: {p} sobre el primero.",
      "ins.review": "Faltan <b>{n} transacciones</b> por clasificar. <a href=\"#/review\">Clasifícalas</a> para completar el panorama.",
      "ins.allDone": "Todas las transacciones tienen categoría. El panorama está completo.",
      "cat.h": "Categorías", "cat.p": "Elige una categoría para ver su tendencia, a quién le pagas y cada transacción.",
      "cat.share": "del gasto", "cat.trend": "Mes a mes", "cat.vendors": "A quién le pagas", "cat.recent": "Transacciones", "cat.all": "Ver todas en Transacciones",
      "cat.income": "Esto es ingreso, no gasto.",
      "tx.h": "Transacciones", "tx.p": "El extracto bancario, línea por línea. Cambia cualquier categoría y todos los gráficos la siguen.",
      "tx.search": "Buscar descripciones", "tx.allCats": "Todas las categorías", "tx.date": "Fecha", "tx.desc": "Descripción", "tx.cat": "Categoría", "tx.amount": "Monto",
      "tx.showing": "Mostrando {a} de {b}", "tx.more": "Mostrar 50 más", "tx.none": "Ninguna transacción coincide.", "tx.export": "Exportar CSV",
      "rv.h": "Por revisar", "rv.p": "Las reglas reconocieron todo lo demás. Estas líneas son ambiguas: una persona decide una vez y la regla lo recuerda.",
      "rv.remember": "Aplicar a las {n} de este beneficiario", "rv.done": "Todo clasificado.", "rv.doneP": "Cada transacción tiene categoría. Vuelve al resumen para ver el panorama completo.",
      "rv.back": "Volver al resumen", "rv.saved": "{n} transacción(es) clasificada(s). El panel está actualizado.", "rv.pick": "Elige una categoría",
      "up.h": "Usa tu propio archivo", "up.p": "Suelta un extracto bancario y se construye el mismo panel con él. El archivo se lee dentro de esta pestaña y nunca se sube.",
      "up.drop": "Suelta un archivo CSV aquí", "up.or": "o", "up.choose": "elige un archivo", "up.fmt": "Necesita una columna de fecha, una de descripción y una de monto (o columnas separadas de débito y crédito).",
      "up.sample": "Descargar el archivo de ejemplo", "up.reset": "Volver a los datos de ejemplo",
      "up.loaded": "Se cargaron {n} transacciones de {f}. {p} clasificadas automáticamente.",
      "up.err": "No se pudo leer ese archivo: {e}", "up.errCols": "no se encontró columna de fecha, descripción o monto",
      "up.using": "Mostrando tu archivo: {f}", "up.usingSample": "Mostrando los datos de ejemplo de la panadería.",
      "up.how": "Cómo funciona la clasificación", "up.how1": "Cada descripción se compara con una lista de reglas (por ejemplo, una descripción que contiene “PAYROLL” es Nómina).",
      "up.how2": "Lo que ninguna regla reconoce cae en “Por revisar” para que una persona decida.", "up.how3": "Cada decisión puede convertirse en una regla nueva, así el mes siguiente necesita menos revisión.",
    },
  });

  const CATS = {
    sales:     { en: "Sales",       es: "Ventas",       color: "#17b07f", income: true },
    ingredients:{ en: "Ingredients", es: "Ingredientes", color: "#0b7a55" },
    payroll:   { en: "Payroll",     es: "Nómina",       color: "#2b2b2b" },
    rent:      { en: "Rent",        es: "Alquiler",     color: "#c8a96a" },
    utilities: { en: "Utilities",   es: "Servicios",    color: "#8aa3bb" },
    packaging: { en: "Packaging",   es: "Empaques",     color: "#e07a5f" },
    marketing: { en: "Marketing",   es: "Mercadeo",     color: "#9b7bb0" },
    equipment: { en: "Equipment",   es: "Equipo",       color: "#6f9a74" },
    software:  { en: "Software",    es: "Software",     color: "#5bb5c9" },
    delivery:  { en: "Delivery",    es: "Reparto",      color: "#d4b13f" },
    fees:      { en: "Card fees",   es: "Comisiones",   color: "#a3a097" },
    other:     { en: "Uncategorised", es: "Sin categoría", color: "#d6d4cc" },
  };
  const SPEND = Object.keys(CATS).filter((k) => !CATS[k].income);
  const cname = (k) => (CATS[k] || CATS.other)[I18N.lang];

  const RULES = [
    [/POS DEPOSIT|ONLINE ORDERS|CATERING INV/, "sales"],
    [/FLOUR|DAIRY|FRESH MARKET|SUGAR|EGG/, "ingredients"],
    [/PAYROLL/, "payroll"],
    [/RENT|LANDLORD/, "rent"],
    [/POWER|WATER|TELECOM|INTERNET|ELECTRIC/, "utilities"],
    [/BOXCO|PACKAGING|LABELS/, "packaging"],
    [/ADS|PRINT SHOP|RADIO|SPONSOR/, "marketing"],
    [/OVEN|REPAIR|EQUIP|MIXER/, "equipment"],
    [/POSCLOUD|LEDGERLY|SUBSCRIPTION|SOFTWARE/, "software"],
    [/RIDENOW|COURIER|DELIVERY/, "delivery"],
    [/MERCHANT FEE|CARD FEE|BANK FEE/, "fees"],
  ];
  // A payee is the description minus reference numbers, so recurring lines group together.
  const NOISE = new Set(["INV", "REF", "NO", "BATCH", "PAYOUT", "US"]);
  const payee = (desc) => desc.toUpperCase().replace(/[#*]/g, " ").split(/\s+/).filter((w) => w && !/\d/.test(w) && !NOISE.has(w)).join(" ") || desc.toUpperCase();
  const LEARNED = {}; // payee -> category, taught in "Needs review"
  const categorise = (desc) => {
    const p = payee(desc); if (LEARNED[p]) return LEARNED[p];
    const d = desc.toUpperCase(); for (const [re, c] of RULES) if (re.test(d)) return c; return "other";
  };

  /* ---------------- sample data ---------------- */
  function sample() {
    const r = Kit.rng(2025);
    const tx = [];
    const add = (m, d, desc, amt) => tx.push({ date: `2025-${String(m + 1).padStart(2, "0")}-${String(Math.min(d, 28)).padStart(2, "0")}`, desc, amount: Math.round(amt * 100) / 100 });
    const season = [1.25, 1.22, 1.18, 1.08, 0.92, 0.86, 0.95, 0.9, 0.84, 0.95, 1.08, 1.32];
    for (let m = 0; m < 12; m++) {
      let sales = 0;
      for (let w = 0; w < 4; w++) { const v = r.norm(6600, 600) * season[m]; sales += v; add(m, 3 + w * 7, `POS DEPOSIT BATCH ${r.int(4000, 9999)}`, v); }
      const online = r.norm(2200, 260) * season[m]; sales += online; add(m, 15, `ONLINE ORDERS PAYOUT ${r.int(100, 999)}`, online);
      if (m === 1 || m === 4 || m === 10 || m === 11) add(m, 20, `CATERING INV ${r.int(300, 399)}`, r.norm(3200, 500));
      add(m, 1, "LANDLORD HARBOR PROPERTIES RENT", -3500);
      add(m, 14, "ACH PAYROLL RUN", -r.norm(4300, 120) * (m === 11 ? 1.12 : 1));
      add(m, 28, "ACH PAYROLL RUN", -r.norm(4300, 120) * (m === 11 ? 1.12 : 1));
      add(m, 9, "ISLAND POWER CO", -(620 + (m >= 5 && m <= 9 ? 260 : 0) + r.int(-40, 60)));
      add(m, 11, "AQUA WATER UTILITY", -r.int(110, 160));
      add(m, 12, "SEALINK TELECOM INTERNET", -129);
      const vendors = ["ISLAND FLOUR CO", "DAIRY DIRECT", "FRESH MARKET WHOLESALE", "SUGAR & CO", "GOLDEN EGG FARMS"];
      const ni = r.int(11, 15);
      for (let i = 0; i < ni; i++) add(m, r.int(1, 28), `${r.pick(vendors)} INV ${r.int(2000, 2999)}`, -r.norm(560, 180) * season[m]);
      for (let i = 0; i < r.int(2, 3); i++) add(m, r.int(1, 28), `BOXCO PACKAGING ${r.int(100, 999)}`, -r.norm(240, 70) * season[m]);
      for (let i = 0; i < r.int(7, 11); i++) add(m, r.int(1, 28), `RIDENOW DELIVERY ${r.int(10000, 99999)}`, -r.int(16, 58));
      const mk = m >= 10 ? r.int(3, 4) : r.int(1, 2);
      for (let i = 0; i < mk; i++) add(m, r.int(1, 28), r.pick(["SOCIAL ADS", "PRINT SHOP FLYERS", "RADIO SPOT ISLAND FM", "SPONSOR BEACH RUN"]), -r.norm(m >= 10 ? 520 : 280, 80));
      add(m, 5, "POSCLOUD SUBSCRIPTION", -49); add(m, 5, "LEDGERLY SOFTWARE", -29);
      add(m, 30, "MERCHANT FEE CARD PROCESSING", -sales * 0.019);
    }
    add(5, 17, "OVEN REPAIR SERVICES", -2380); add(2, 8, "MIXER EQUIP SUPPLY", -1460); add(9, 22, "OVEN REPAIR SERVICES", -640);
    // the ambiguous ones a person must decide
    [[1, 6, "AMZN MKTP US*2K41", -184.2], [3, 19, "AMZN MKTP US*7Q10", -96.5], [7, 2, "AMZN MKTP US*3B88", -312.0], [10, 25, "AMZN MKTP US*9F02", -142.75],
     [2, 23, "TRANSFER TO SAVINGS 88213", -2000], [5, 30, "TRANSFER TO SAVINGS 88213", -2000], [8, 29, "TRANSFER TO SAVINGS 88213", -2000],
     [4, 13, "SQ *KAYA MARKET", -238.4], [9, 9, "SQ *KAYA MARKET", -191.1], [6, 21, "CHK 1043", -450], [11, 4, "CHK 1077", -780]]
      .forEach(([m, d, s, a]) => add(m, d, s, a));
    tx.sort((a, b) => a.date.localeCompare(b.date));
    return finish(tx);
  }
  function finish(tx) {
    return tx.map((x, i) => ({ ...x, id: i, cat: x.cat || categorise(x.desc), auto: true, month: Number(x.date.slice(5, 7)) - 1 }));
  }

  /* ---------------- state ---------------- */
  const S = { tx: sample(), source: null, period: "Y", search: "", catFilter: "", sort: "date", dir: -1, limit: 50 };
  const SAMPLE_CSV = () => "date,description,amount\n" + sample().map((x) => `${x.date},"${x.desc}",${x.amount.toFixed(2)}`).join("\n");

  const PERIODS = { Y: [...Array(12).keys()], Q1: [0, 1, 2], Q2: [3, 4, 5], Q3: [6, 7, 8], Q4: [9, 10, 11] };
  const months = () => (S.period.startsWith("M") ? [Number(S.period.slice(1))] : PERIODS[S.period]);
  const prevMonths = () => {
    if (S.period === "Y") return null;
    if (S.period.startsWith("M")) { const m = Number(S.period.slice(1)); return m > 0 ? [m - 1] : null; }
    const q = Number(S.period[1]); return q > 1 ? PERIODS["Q" + (q - 1)] : null;
  };
  const sumBy = (ms, pred) => S.tx.filter((x) => ms.includes(x.month) && pred(x)).reduce((s, x) => s + x.amount, 0);
  const income = (ms) => sumBy(ms, (x) => CATS[x.cat]?.income);
  const spend = (ms) => -sumBy(ms, (x) => !CATS[x.cat]?.income && x.amount < 0);
  const catSpend = (ms, c) => -sumBy(ms, (x) => x.cat === c && x.amount < 0);
  const pending = () => S.tx.filter((x) => x.cat === "other").length;
  const monthsPresent = () => [...new Set(S.tx.map((x) => x.month))].sort((a, b) => a - b);

  /* ---------------- views ---------------- */
  function tour() {
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>`;
  }

  function periodChips() {
    const opts = ["Y", "Q1", "Q2", "Q3", "Q4"];
    const label = (p) => (p === "Y" ? t("per.year") : p);
    let html = opts.map((p) => `<button class="chip" type="button" data-period="${p}" aria-pressed="${S.period === p}">${label(p)}</button>`).join("");
    if (S.period.startsWith("M")) html += `<button class="chip" type="button" data-period="${S.period}" aria-pressed="true">${t("per.month", { m: F.month(Number(S.period.slice(1)), "long") })} ✕</button>`;
    return `<div class="chips">${html}</div>`;
  }

  function kpi(lab, val, delta, sparkVals, color) {
    return `<div class="card kpi"><div class="lab">${lab}</div><div class="val">${val}</div><div class="delta ${delta.cls}">${delta.text}</div>${sparkVals ? Chart.spark(sparkVals, color) : ""}</div>`;
  }

  function overview() {
    const ms = months(), pm = prevMonths();
    const inc = income(ms), sp = spend(ms), net = inc - sp, mar = inc ? (net / inc) * 100 : 0;
    const mp = monthsPresent();
    const delta = (cur, prev, goodUp = true) => {
      if (!pm) return { cls: "flat", text: S.source ? t("up.using", { f: S.source }) : t("k.year") };
      if (!prev) return { cls: "flat", text: "—" };
      const d = ((cur - prev) / Math.abs(prev)) * 100;
      const good = goodUp ? d >= 0 : d <= 0;
      return { cls: Math.abs(d) < 0.5 ? "flat" : good ? "up" : "down", text: t("k.vs", { d: F.pct(d, 1, true), p: t(S.period.startsWith("M") ? "k.prevM" : "k.prevQ") }) };
    };
    const pInc = pm && income(pm), pSp = pm && spend(pm);
    const pNet = pm && pInc - pSp, pMar = pm && pInc ? (pNet / pInc) * 100 : 0;
    const sInc = mp.map((m) => income([m])), sSp = mp.map((m) => spend([m]));
    const marDelta = !pm ? { cls: "flat", text: t("k.year") } : { cls: mar >= pMar ? "up" : "down", text: t("k.vs", { d: (mar - pMar >= 0 ? "+" : "−") + F.num(Math.abs(mar - pMar), 1) + " pt", p: t(S.period.startsWith("M") ? "k.prevM" : "k.prevQ") }) };

    // monthly stacked chart
    const labels = mp.map((m) => F.month(m));
    const series = SPEND.map((c) => ({ key: c, label: cname(c), color: CATS[c].color, values: mp.map((m) => catSpend([m], c)) })).filter((s) => s.values.some((v) => v > 0));
    const sel = mp.map((m, i) => (ms.includes(m) ? i : -1)).filter((i) => i >= 0);
    const bars = Chart.bars(labels, series, { h: 260, selected: sel.length === mp.length ? null : sel, line: { label: t("k.income"), color: "#17b07f", values: sInc }, label: t("c.monthly") });

    // donut
    const parts = SPEND.map((c) => ({ id: c, label: cname(c), color: CATS[c].color, value: catSpend(ms, c) })).filter((p) => p.value > 0).sort((a, b) => b.value - a.value);
    const donut = Chart.donut(parts, { center: F.short(sp), sub: t("k.spend"), fmt: (v) => F.money(v), label: t("c.split") });
    const legend = parts.map((p) => `<button type="button" data-cat="${p.id}"><i style="background:${p.color}"></i><span>${esc(p.label)}</span><span>${F.pct((p.value / sp) * 100, 0)}</span></button>`).join("");

    return `${tour()}
      <div class="page-head"><div><h1 data-i18n="ov.h"></h1><p>${t("ov.p", { n: F.num(S.tx.length), pct: F.pct(((S.tx.length - pending()) / S.tx.length) * 100, 0) })}</p></div>${periodChips()}</div>
      <div class="grid g-4">
        ${kpi(t("k.income"), F.money(inc), delta(inc, pInc), sInc, "#17b07f")}
        ${kpi(t("k.spend"), F.money(sp), delta(sp, pSp, false), sSp, "#2b2b2b")}
        ${kpi(t("k.net"), F.money(net), delta(net, pNet), mp.map((m, i) => sInc[i] - sSp[i]), "#0b7a55")}
        ${kpi(t("k.margin"), F.pct(mar), marDelta, null)}
      </div>
      <div class="grid g-21 mt">
        <div class="card"><h3 data-i18n="c.monthly"></h3><p class="sub" data-i18n="c.monthlySub"></p><div id="monthly">${bars}</div></div>
        <div class="card"><h3 data-i18n="c.split"></h3><p class="sub" data-i18n="c.splitSub"></p><div id="donut">${donut}</div><div class="legend">${legend}</div></div>
      </div>
      <div class="card mt"><h3 data-i18n="c.insights"></h3><p class="sub" data-i18n="c.insightsSub"></p><ul class="insights">${insights(ms, parts, sp).map((s) => `<li>${s}</li>`).join("")}</ul></div>`;
  }

  function insights(ms, parts, sp) {
    const out = [];
    if (parts[0]) out.push(t("ins.largest", { c: esc(parts[0].label), p: F.pct((parts[0].value / sp) * 100, 0) }));
    const nets = ms.map((m) => ({ m, v: income([m]) - spend([m]) })).filter((x) => S.tx.some((y) => y.month === x.m));
    if (nets.length > 1) {
      const best = nets.reduce((a, b) => (b.v > a.v ? b : a)), worst = nets.reduce((a, b) => (b.v < a.v ? b : a));
      out.push(t("ins.best", { m: F.month(best.m, "long"), v: F.money(best.v) }));
      out.push(t("ins.worst", { m: F.month(worst.m, "long"), v: F.money(worst.v) }));
    }
    if (S.period === "Y") {
      const h1 = [0, 1, 2, 3, 4, 5], h2 = [6, 7, 8, 9, 10, 11];
      const g = SPEND.filter((c) => c !== "other").map((c) => ({ c, a: catSpend(h1, c), b: catSpend(h2, c) })).filter((x) => x.a > 500).map((x) => ({ ...x, d: (x.b - x.a) / x.a })).sort((a, b) => b.d - a.d)[0];
      if (g && g.d > 0.05) out.push(t("ins.growth", { c: esc(cname(g.c)), p: F.pct(g.d * 100, 0, true) }));
    }
    out.push(pending() ? t("ins.review", { n: pending() }) : t("ins.allDone"));
    return out;
  }

  function categories(param) {
    const ms = months();
    const sp = spend(ms);
    const cur = param && CATS[param] ? param : SPEND.map((c) => ({ c, v: catSpend(ms, c) })).sort((a, b) => b.v - a.v)[0].c;
    const rows = SPEND.map((c) => ({ id: c, label: cname(c), value: catSpend(ms, c), swatch: CATS[c].color, color: CATS[c].color, active: c === cur })).filter((r) => r.value > 0 || r.id === cur).sort((a, b) => b.value - a.value);
    const mp = monthsPresent();
    const isInc = CATS[cur].income;
    const vals = mp.map((m) => (isInc ? income([m]) : catSpend([m], cur)));
    const total = isInc ? income(ms) : catSpend(ms, cur);
    const txs = S.tx.filter((x) => x.cat === cur && ms.includes(x.month)).sort((a, b) => b.date.localeCompare(a.date));
    const vend = {};
    txs.forEach((x) => { const p = payee(x.desc); vend[p] = (vend[p] || 0) + Math.abs(x.amount); });
    const vrows = Object.entries(vend).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => ({ label: k, value: v, color: CATS[cur].color }));
    return `<div class="page-head"><div><h1 data-i18n="cat.h"></h1><p data-i18n="cat.p"></p></div>${periodChips()}</div>
      <div class="grid g-cat">
        <div class="card"><div id="catlist">${Chart.hbars(rows, { fmt: (v) => F.short(v) })}</div></div>
        <div class="grid" style="align-content:start">
          <div class="card">
            <div class="card-head"><div><span class="pill"><i style="background:${CATS[cur].color}"></i>${esc(cname(cur))}</span>
              <div class="big-num">${F.money(total)}</div>
              <p class="sub" style="margin:0">${isInc ? t("cat.income") : `${F.pct(sp ? (total / sp) * 100 : 0)} ${t("cat.share")}`}</p></div></div>
            <h3 class="mt" data-i18n="cat.trend"></h3>
            ${Chart.line(mp.map((m) => F.month(m)), [{ label: cname(cur), color: CATS[cur].color === "#2b2b2b" ? "#2b2b2b" : CATS[cur].color, values: vals }], { h: 190, area: true, fmt: (v) => F.money(v) })}
          </div>
          <div class="grid g-2">
            <div class="card"><h3 data-i18n="cat.vendors"></h3><p class="sub">&nbsp;</p>${vrows.length ? Chart.hbars(vrows, { fmt: (v) => F.short(v) }) : "—"}</div>
            <div class="card"><h3 data-i18n="cat.recent"></h3><p class="sub">${F.num(txs.length)}</p>
              <div class="mini-tx">${txs.slice(0, 7).map((x) => `<div><span>${F.date(x.date)}</span><span>${esc(x.desc)}</span><b>${F.money(x.amount, 2)}</b></div>`).join("")}</div>
              <a class="link-arrow" style="margin-top:12px;font-size:14px" href="#/tx" data-goto-cat="${cur}" data-i18n="cat.all"></a></div>
          </div>
        </div>
      </div>`;
  }

  function catSelect(x) {
    return `<select class="sel cat-sel" data-tx="${x.id}" aria-label="${t("tx.cat")}">${Object.keys(CATS).map((c) => `<option value="${c}" ${c === x.cat ? "selected" : ""}>${esc(cname(c))}</option>`).join("")}</select>`;
  }

  function txView() {
    const q = S.search.trim().toUpperCase();
    let rows = S.tx.filter((x) => months().includes(x.month) && (!q || x.desc.toUpperCase().includes(q)) && (!S.catFilter || x.cat === S.catFilter));
    rows.sort((a, b) => (S.sort === "date" ? a.date.localeCompare(b.date) || a.id - b.id : a.amount - b.amount) * S.dir);
    const shown = rows.slice(0, S.limit);
    const arrow = (k) => (S.sort === k ? (S.dir < 0 ? " ↓" : " ↑") : "");
    return `<div class="page-head"><div><h1 data-i18n="tx.h"></h1><p data-i18n="tx.p"></p></div>${periodChips()}</div>
      <div class="toolbar">
        <label class="search"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5" stroke-linecap="round"/></svg>
          <input id="q" type="search" value="${esc(S.search)}" placeholder="${t("tx.search")}" aria-label="${t("tx.search")}"></label>
        <select class="sel" id="catf" aria-label="${t("tx.cat")}"><option value="">${t("tx.allCats")}</option>${Object.keys(CATS).map((c) => `<option value="${c}" ${c === S.catFilter ? "selected" : ""}>${esc(cname(c))}</option>`).join("")}</select>
        <span class="grow"></span>
        <button class="btn btn-ghost btn-s" type="button" id="exp" data-i18n="tx.export"></button>
      </div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr>
        <th><button type="button" data-sort="date">${t("tx.date")}${arrow("date")}</button></th><th>${t("tx.desc")}</th><th>${t("tx.cat")}</th>
        <th class="r"><button type="button" data-sort="amount">${t("tx.amount")}${arrow("amount")}</button></th></tr></thead>
        <tbody>${shown.map((x) => `<tr class="${x.cat === "other" ? "needs" : ""}"><td>${F.date(x.date)}</td><td class="desc">${esc(x.desc)}</td><td>${catSelect(x)}</td><td class="r ${x.amount > 0 ? "pos" : "neg"}">${F.money(x.amount, 2)}</td></tr>`).join("")}</tbody></table>
        ${rows.length ? "" : `<div class="empty"><b data-i18n="tx.none"></b></div>`}</div>
      <div class="toolbar" style="margin-top:14px"><span class="sub" style="color:var(--muted);font-size:13px">${t("tx.showing", { a: F.num(shown.length), b: F.num(rows.length) })}</span>
        ${rows.length > S.limit ? `<button class="btn btn-ghost btn-s" type="button" id="more" data-i18n="tx.more"></button>` : ""}</div>`;
  }

  function review() {
    const items = S.tx.filter((x) => x.cat === "other");
    if (!items.length) return `<div class="page-head"><div><h1 data-i18n="rv.h"></h1></div></div>
      <div class="card empty" style="padding:70px 20px"><div class="done-mark">✓</div><b data-i18n="rv.done"></b><p data-i18n="rv.doneP"></p><a class="btn btn-dark" href="#/overview" data-i18n="rv.back"></a></div>`;
    const groups = {};
    items.forEach((x) => { const p = payee(x.desc); (groups[p] = groups[p] || []).push(x); });
    return `<div class="page-head"><div><h1 data-i18n="rv.h"></h1><p data-i18n="rv.p"></p></div></div>
      <div class="grid">${Object.entries(groups).map(([p, xs]) => `
        <div class="card rv" data-payee="${esc(p)}">
          <div class="rv-main"><div><b class="mono">${esc(p)}</b><p class="sub" style="margin:4px 0 0">${xs.map((x) => `${F.date(x.date)} · ${F.money(x.amount, 2)}`).join("&nbsp;&nbsp;·&nbsp;&nbsp;")}</p></div>
            <div class="rv-pick"><div class="chips">${SPEND.filter((c) => c !== "other").map((c) => `<button class="chip" type="button" data-assign="${c}"><i style="background:${CATS[c].color}"></i>${esc(cname(c))}</button>`).join("")}</div>
            ${xs.length > 1 ? `<label class="check"><input type="checkbox" checked> ${t("rv.remember", { n: xs.length })}</label>` : ""}</div></div>
        </div>`).join("")}</div>`;
  }

  function upload() {
    return `<div class="page-head"><div><h1 data-i18n="up.h"></h1><p data-i18n="up.p"></p></div></div>
      <div class="grid g-21">
        <div class="card">
          <label class="drop" id="drop"><input type="file" id="file" accept=".csv,text/csv" hidden>
            ${Kit.icons.upload.replace("<svg", '<svg width="34" height="34"')}
            <b data-i18n="up.drop"></b><span><span data-i18n="up.or"></span> <u data-i18n="up.choose"></u></span>
            <small data-i18n="up.fmt"></small></label>
          <p class="sub" style="margin:14px 0 0">${S.source ? t("up.using", { f: esc(S.source) }) : t("up.usingSample")}</p>
          <div class="toolbar" style="margin:14px 0 0"><button class="btn btn-ghost btn-s" type="button" id="dl" data-i18n="up.sample"></button>
          ${S.source ? `<button class="btn btn-ghost btn-s" type="button" id="reset" data-i18n="up.reset"></button>` : ""}</div>
        </div>
        <div class="card"><h3 data-i18n="up.how"></h3><ol class="how"><li data-i18n="up.how1"></li><li data-i18n="up.how2"></li><li data-i18n="up.how3"></li></ol></div>
      </div>`;
  }

  /* ---------------- CSV ---------------- */
  function parseCSV(text) {
    const sep = (text.split("\n")[0].match(/;/g) || []).length > (text.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
      else if (ch === '"') q = true;
      else if (ch === sep) { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); if (row.some((c) => c.trim())) rows.push(row); row = []; cell = ""; }
      else cell += ch;
    }
    row.push(cell); if (row.some((c) => c.trim())) rows.push(row);
    return rows;
  }
  const num = (s) => {
    if (s == null) return NaN;
    let v = String(s).replace(/[^\d,.\-()]/g, "");
    const neg = /^\(.*\)$/.test(v) || /^-/.test(v);
    v = v.replace(/[()\-]/g, "");
    if (/,\d{2}$/.test(v) && !/\.\d{2}$/.test(v)) v = v.replace(/\./g, "").replace(",", "."); else v = v.replace(/,/g, "");
    const n = parseFloat(v); return neg ? -n : n;
  };
  function toISO(s) {
    s = String(s).trim();
    let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
    m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
    if (m) { let [a, b, y] = [Number(m[1]), Number(m[2]), m[3]]; if (y.length === 2) y = "20" + y; const [mo, d] = a > 12 ? [b, a] : [a, b]; return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
    const d = new Date(s); return isNaN(d) ? null : d.toISOString().slice(0, 10);
  }
  function loadFile(file) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const rows = parseCSV(String(fr.result));
        const head = rows[0].map((h) => h.toLowerCase().trim());
        const find = (...keys) => head.findIndex((h) => keys.some((k) => h.includes(k)));
        const di = find("date", "fecha"), de = find("desc", "memo", "detail", "concept", "narrat", "payee", "name"), am = find("amount", "monto", "importe", "value");
        const db = find("debit", "débito", "debito", "withdraw"), cr = find("credit", "crédito", "credito", "deposit");
        if (di < 0 || de < 0 || (am < 0 && db < 0 && cr < 0)) throw new Error(t("up.errCols"));
        const tx = rows.slice(1).map((r) => {
          const date = toISO(r[di]);
          let amount = am >= 0 ? num(r[am]) : (num(r[cr]) || 0) - Math.abs(num(r[db]) || 0);
          return date && isFinite(amount) && amount !== 0 ? { date, desc: (r[de] || "").trim() || "—", amount } : null;
        }).filter(Boolean);
        if (!tx.length) throw new Error(t("up.errCols"));
        // remap to month index 0..11 of the most recent year in the file, keep the rest
        tx.sort((a, b) => a.date.localeCompare(b.date));
        const last = tx[tx.length - 1].date.slice(0, 4);
        const inYear = tx.filter((x) => x.date.startsWith(last));
        S.tx = finish(inYear); S.source = file.name; S.period = "Y"; S.catFilter = ""; S.search = "";
        const p = F.pct(((S.tx.length - pending()) / S.tx.length) * 100, 0);
        toast(t("up.loaded", { n: F.num(S.tx.length), f: file.name, p }));
        location.hash = "#/overview"; A.render();
      } catch (e) { toast(t("up.err", { e: e.message })); }
    };
    fr.readAsText(file);
  }

  /* ---------------- wiring ---------------- */
  const A = Kit.app({
    nav: [
      { id: "overview", key: "nav.overview", icon: "grid" },
      { id: "categories", key: "nav.categories", icon: "pie" },
      { id: "tx", key: "nav.tx", icon: "list" },
      { id: "review", key: "nav.review", icon: "inbox", count: pending },
      { id: "upload", key: "nav.upload", icon: "upload" },
    ],
    views: { overview, categories, tx: txView, review, upload },
  });

  const view = $("#view");
  view.addEventListener("click", (e) => {
    const p = e.target.closest("[data-period]");
    if (p) { const v = p.dataset.period; S.period = S.period === v && v.startsWith("M") ? "Y" : v; S.limit = 50; return A.render(); }
    const col = e.target.closest(".bar-col");
    if (col) {
      const m = monthsPresent()[Number(col.dataset.i)];
      S.period = S.period === "M" + m ? "Y" : "M" + m; return A.render();
    }
    const c = e.target.closest("[data-cat], .arc[data-id], .hbar[data-id]");
    if (c && !e.target.closest(".rv")) { const id = c.dataset.cat || c.dataset.id; if (CATS[id]) location.hash = "#/categories/" + id; return; }
    const g = e.target.closest("[data-goto-cat]");
    if (g) { S.catFilter = g.dataset.gotoCat; S.search = ""; }
    const s = e.target.closest("[data-sort]");
    if (s) { const k = s.dataset.sort; S.dir = S.sort === k ? -S.dir : -1; S.sort = k; return A.render(); }
    if (e.target.closest("#more")) { S.limit += 50; return A.render(); }
    if (e.target.closest("#exp")) {
      const rows = S.tx.filter((x) => months().includes(x.month));
      return download("transactions.csv", "date,description,category,amount\n" + rows.map((x) => `${x.date},"${x.desc.replace(/"/g, '""')}",${cname(x.cat)},${x.amount.toFixed(2)}`).join("\n"));
    }
    if (e.target.closest("#dl")) return download("sample-bank-export.csv", SAMPLE_CSV());
    if (e.target.closest("#reset")) { S.tx = sample(); S.source = null; S.period = "Y"; toast(t("up.usingSample")); return A.render(); }
    const as = e.target.closest("[data-assign]");
    if (as) {
      const card = as.closest(".rv"), p = card.dataset.payee, all = card.querySelector("input[type=checkbox]");
      const targets = S.tx.filter((x) => x.cat === "other" && payee(x.desc) === p);
      const list = all && !all.checked ? targets.slice(0, 1) : targets;
      list.forEach((x) => { x.cat = as.dataset.assign; x.auto = false; });
      if (!all || all.checked) LEARNED[p] = as.dataset.assign;
      card.classList.add("leaving");
      toast(t("rv.saved", { n: list.length }));
      setTimeout(() => A.render(), 260);
    }
  });
  view.addEventListener("input", (e) => {
    if (e.target.id === "q") { S.search = e.target.value; S.limit = 50; const pos = e.target.selectionStart; A.render(); const q = $("#q"); q.focus(); q.setSelectionRange(pos, pos); }
  });
  view.addEventListener("change", (e) => {
    if (e.target.id === "catf") { S.catFilter = e.target.value; S.limit = 50; A.render(); }
    if (e.target.classList.contains("cat-sel")) {
      const x = S.tx.find((y) => y.id === Number(e.target.dataset.tx)); x.cat = e.target.value; x.auto = false;
      toast(t("rv.saved", { n: 1 })); A.refreshNav();
      e.target.closest("tr").classList.toggle("needs", x.cat === "other");
    }
    if (e.target.id === "file" && e.target.files[0]) loadFile(e.target.files[0]);
  });
  view.addEventListener("dragover", (e) => { const d = e.target.closest("#drop"); if (d) { e.preventDefault(); d.classList.add("over"); } });
  view.addEventListener("dragleave", (e) => { const d = e.target.closest("#drop"); if (d) d.classList.remove("over"); });
  view.addEventListener("drop", (e) => { const d = e.target.closest("#drop"); if (d) { e.preventDefault(); d.classList.remove("over"); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); } });
})();
