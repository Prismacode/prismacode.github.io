/* Error check demo. A month of wholesale orders with planted mistakes; eight rules find them,
   explain them, and show what they would have done to the published total. */
(function () {
  const { t, F, esc, Chart, $, $$, toast, download, I18N } = Kit;

  I18N.add({
    en: {
      "q.title": "Error check · live demo", "q.name": "Error check", "q.sub": "September orders",
      "nav.data": "Data", "nav.issues": "Issues", "nav.summary": "Summary",
      "tour.1": "Press “Run the checks” and watch every mistake get found.", "tour.2": "Click a red row to see what's wrong in plain words, then fix it or confirm it's correct.",
      "tour.3": "Press “Break something” and see if the checks catch what you did.",
      "d.h": "September orders", "d.p": "{n} orders exported from the sales system. Nobody has looked at them yet.",
      "d.run": "Run the checks", "d.rerun": "Run again", "d.break": "Break something", "d.only": "Only rows with issues", "d.search": "Search customer or order",
      "d.stale": "The data changed since the last check.", "d.ready": "{n} orders waiting. Run the checks to see what's wrong with them.",
      "d.found": "{i} issues in {r} orders", "d.clean": "No open issues. This batch is ready to publish.",
      "d.edit": "Double-click any cell to edit it.", "d.edited": "Changed. Run the checks again to re-test it.",
      "d.broke": "Something changed in order #{id}. Run the checks and see if they find it.",
      "col.id": "Order", "col.date": "Date", "col.customer": "Customer", "col.region": "Region", "col.product": "Product", "col.qty": "Qty", "col.price": "Price", "col.discount": "Disc.", "col.total": "Total", "col.email": "Email",
      "sev.critical": "Critical", "sev.high": "High", "sev.medium": "Medium", "sev.low": "Low",
      "r.required": "Missing required field", "r.duplicate": "Duplicate order", "r.arith": "Total doesn't add up", "r.outlier": "Unusual quantity",
      "r.date": "Date outside the month", "r.discount": "Discount above the limit", "r.email": "Email isn't valid", "r.region": "Unknown region",
      "rd.required": "Customer and region must be filled in, or the order can't be assigned.",
      "rd.duplicate": "The same order number appears twice. Counting it twice inflates revenue.",
      "rd.arith": "Total must equal quantity × price, less the discount.",
      "rd.outlier": "Quantities far above what this product normally sells are usually typing errors.",
      "rd.date": "Every order in this batch must be dated in September 2025.",
      "rd.discount": "Discounts above 20% need approval, so a higher figure is usually a typo.",
      "rd.email": "Order confirmations bounce if the address is malformed.",
      "rd.region": "Region must be North, South, East or West, or sales get reported in the wrong place.",
      "m.required": "{f} is empty.", "m.duplicate": "Order #{id} already appears above, with the same contents.",
      "m.arith": "{q} × {p} less {d}% is {e}, but the total says {a}.",
      "m.outlier": "{q} units is {x}× the usual order for this product ({med}). Probably meant {s}.",
      "m.date": "{d} is not in September 2025.", "m.discount": "{d}% is above the 20% limit. This customer's other orders get {u}%.",
      "m.email": "“{e}” is not a complete address.", "m.region": "“{r}” is not a region. Closest match: {s}.",
      "f.fill": "Fill in “{v}” (from the email domain)", "f.fillRegion": "Fill in “{v}” (this customer's usual region)", "f.remove": "Remove the duplicate", "f.recalc": "Correct the total to {v}",
      "f.qty": "Change quantity to {v}", "f.date": "Change date to {v}", "f.discount": "Set discount to {v}%", "f.email": "Change to {v}", "f.region": "Change to {v}",
      "f.keep": "It's correct, keep it", "f.close": "Close", "f.fixed": "Fixed.", "f.kept": "Marked as checked and correct.",
      "dr.order": "Order #{id}", "dr.issues": "{n} issue(s)", "dr.none": "Nothing wrong with this order.", "dr.why": "Why this is checked",
      "i.h": "Issues", "i.p": "Every rule the batch is checked against. Switch one off and run again to see what it catches.",
      "i.on": "On", "i.off": "Off", "i.fixAll": "Apply all {n} suggested fixes", "i.none": "Nothing found.", "i.notRun": "Run the checks first, from the Data page.",
      "i.go": "Go to the data", "i.fixedAll": "{n} fixes applied. {k} issue(s) still need a person.",
      "s.h": "Summary", "s.p": "What a manager reads before the numbers go out.",
      "s.score": "clean", "s.rows": "Orders", "s.open": "Open issues", "s.fixed": "Fixed", "s.kept": "Confirmed correct",
      "s.impact": "What the mistakes would have done", "s.reported": "Revenue as exported", "s.correct": "Revenue after checks", "s.diff": "Difference",
      "s.impactP": "If the export had been published as it came in, September revenue would have been off by {p}.",
      "s.bySev": "Open issues by severity", "s.log": "What happened", "s.logEmpty": "Nothing yet. Run the checks.", "s.export": "Download the issue log",
      "log.run": "Checks run: {n} open issue(s)", "log.fix": "#{id}: {what}", "log.keep": "#{id}: confirmed correct ({r})", "log.edit": "#{id}: {f} edited by hand", "log.break": "#{id}: data changed (Break something)",
    },
    es: {
      "q.title": "Detector de errores · demo en vivo", "q.name": "Detector de errores", "q.sub": "Pedidos de septiembre",
      "nav.data": "Datos", "nav.issues": "Errores", "nav.summary": "Resumen",
      "tour.1": "Presiona “Revisar” y mira cómo se encuentra cada error.", "tour.2": "Haz clic en una fila roja para ver qué está mal en palabras simples, y corrígelo o confirma que está bien.",
      "tour.3": "Presiona “Dañar algo” y mira si la revisión atrapa lo que hiciste.",
      "d.h": "Pedidos de septiembre", "d.p": "{n} pedidos exportados del sistema de ventas. Nadie los ha revisado todavía.",
      "d.run": "Revisar", "d.rerun": "Revisar de nuevo", "d.break": "Dañar algo", "d.only": "Solo filas con errores", "d.search": "Buscar cliente o pedido",
      "d.stale": "Los datos cambiaron desde la última revisión.", "d.ready": "{n} pedidos esperando. Revísalos para ver qué tienen de malo.",
      "d.found": "{i} errores en {r} pedidos", "d.clean": "Sin errores abiertos. Este lote está listo para publicar.",
      "d.edit": "Haz doble clic en una celda para editarla.", "d.edited": "Cambiado. Revisa de nuevo para comprobarlo.",
      "d.broke": "Algo cambió en el pedido #{id}. Revisa y mira si lo encuentra.",
      "col.id": "Pedido", "col.date": "Fecha", "col.customer": "Cliente", "col.region": "Región", "col.product": "Producto", "col.qty": "Cant.", "col.price": "Precio", "col.discount": "Desc.", "col.total": "Total", "col.email": "Correo",
      "sev.critical": "Crítico", "sev.high": "Alto", "sev.medium": "Medio", "sev.low": "Bajo",
      "r.required": "Falta un campo obligatorio", "r.duplicate": "Pedido duplicado", "r.arith": "El total no cuadra", "r.outlier": "Cantidad inusual",
      "r.date": "Fecha fuera del mes", "r.discount": "Descuento sobre el límite", "r.email": "Correo no válido", "r.region": "Región desconocida",
      "rd.required": "Cliente y región deben estar llenos, o el pedido no se puede asignar.",
      "rd.duplicate": "El mismo número de pedido aparece dos veces. Contarlo dos veces infla los ingresos.",
      "rd.arith": "El total debe ser cantidad × precio, menos el descuento.",
      "rd.outlier": "Cantidades muy por encima de lo normal para el producto suelen ser errores de tipeo.",
      "rd.date": "Todos los pedidos de este lote deben tener fecha de septiembre de 2025.",
      "rd.discount": "Los descuentos sobre 20% requieren aprobación, así que una cifra mayor suele ser un error.",
      "rd.email": "Las confirmaciones rebotan si la dirección está mal escrita.",
      "rd.region": "La región debe ser North, South, East o West, o las ventas se reportan en el lugar equivocado.",
      "m.required": "{f} está vacío.", "m.duplicate": "El pedido #{id} ya aparece arriba, con el mismo contenido.",
      "m.arith": "{q} × {p} menos {d}% da {e}, pero el total dice {a}.",
      "m.outlier": "{q} unidades es {x}× el pedido usual de este producto ({med}). Probablemente era {s}.",
      "m.date": "{d} no está en septiembre de 2025.", "m.discount": "{d}% está sobre el límite de 20%. Los otros pedidos de este cliente tienen {u}%.",
      "m.email": "“{e}” no es una dirección completa.", "m.region": "“{r}” no es una región. La más parecida: {s}.",
      "f.fill": "Llenar con “{v}” (del dominio del correo)", "f.fillRegion": "Llenar con “{v}” (la región usual de este cliente)", "f.remove": "Eliminar el duplicado", "f.recalc": "Corregir el total a {v}",
      "f.qty": "Cambiar la cantidad a {v}", "f.date": "Cambiar la fecha a {v}", "f.discount": "Poner el descuento en {v}%", "f.email": "Cambiar a {v}", "f.region": "Cambiar a {v}",
      "f.keep": "Está bien, dejarlo", "f.close": "Cerrar", "f.fixed": "Corregido.", "f.kept": "Marcado como revisado y correcto.",
      "dr.order": "Pedido #{id}", "dr.issues": "{n} error(es)", "dr.none": "Este pedido no tiene nada malo.", "dr.why": "Por qué se revisa",
      "i.h": "Errores", "i.p": "Cada regla con la que se revisa el lote. Apaga una y revisa de nuevo para ver qué atrapa.",
      "i.on": "Activa", "i.off": "Apagada", "i.fixAll": "Aplicar las {n} correcciones sugeridas", "i.none": "Nada encontrado.", "i.notRun": "Primero revisa los datos, desde la página Datos.",
      "i.go": "Ir a los datos", "i.fixedAll": "{n} correcciones aplicadas. {k} error(es) todavía necesitan a una persona.",
      "s.h": "Resumen", "s.p": "Lo que lee un gerente antes de que salgan las cifras.",
      "s.score": "limpio", "s.rows": "Pedidos", "s.open": "Errores abiertos", "s.fixed": "Corregidos", "s.kept": "Confirmados correctos",
      "s.impact": "Lo que habrían causado los errores", "s.reported": "Ingresos según la exportación", "s.correct": "Ingresos después de revisar", "s.diff": "Diferencia",
      "s.impactP": "Si la exportación se hubiera publicado tal como llegó, los ingresos de septiembre habrían tenido un error de {p}.",
      "s.bySev": "Errores abiertos por severidad", "s.log": "Qué pasó", "s.logEmpty": "Nada todavía. Revisa los datos.", "s.export": "Descargar el registro de errores",
      "log.run": "Revisión: {n} error(es) abierto(s)", "log.fix": "#{id}: {what}", "log.keep": "#{id}: confirmado correcto ({r})", "log.edit": "#{id}: {f} editado a mano", "log.break": "#{id}: datos cambiados (Dañar algo)",
    },
  });

  const REGIONS = ["North", "South", "East", "West"];
  const PRODUCTS = [["Coffee beans 1kg", 18], ["Oat milk, case of 12", 24], ["Paper cups ×500", 38], ["Syrup bottle", 9.5], ["Filter papers ×200", 6]];
  const CUSTOMERS = [["Marlow & Co", "marlowco.com"], ["Brightwell Café", "brightwell.cafe"], ["Oakline Hotels", "oakline.com"], ["Fernhill Market", "fernhill.shop"], ["Calder Ltd", "calder.co"],
    ["Pier 9 Kitchen", "pier9.kitchen"], ["Juniper Rooms", "juniperrooms.com"], ["Saltwater Deli", "saltwaterdeli.com"], ["Harbor Lights Inn", "harborlights.com"], ["The Copper Pot", "copperpot.co"],
    ["Northgate Offices", "northgate.biz"], ["Lumen Studio", "lumen.studio"]];
  const SEV = { required: "high", duplicate: "critical", arith: "critical", outlier: "high", date: "medium", discount: "high", email: "low", region: "medium" };
  const RULE_IDS = Object.keys(SEV);
  const COLS = ["id", "date", "customer", "region", "product", "qty", "price", "discount", "total", "email"];
  const round2 = (n) => Math.round(n * 100) / 100;
  const expect = (r) => round2(r.qty * r.price * (1 - r.discount / 100));

  function build() {
    const R = Kit.rng(909);
    const home = {}; CUSTOMERS.forEach(([c]) => { home[c] = { region: R.pick(REGIONS), disc: R.pick([0, 0, 5, 10]) }; });
    const rows = [];
    for (let i = 0; i < 147; i++) {
      const [cust, dom] = R.pick(CUSTOMERS);
      const [prod, price] = R.pick(PRODUCTS);
      const qty = Math.max(1, Math.round(R.norm(price > 20 ? 9 : 22, price > 20 ? 4 : 9)));
      const row = { id: 1001 + i, date: `2025-09-${String(R.int(1, 30)).padStart(2, "0")}`, customer: cust, region: home[cust].region, product: prod, qty, price, discount: home[cust].disc,
        email: `${R.pick(["orders", "purchasing", "accounts", "hello"])}@${dom}` };
      row.total = expect(row);
      rows.push(row);
    }
    rows.sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
    rows.forEach((r, i) => { r.id = 1001 + i; });
    const at = (id) => rows.find((r) => r.id === id);
    // planted mistakes
    at(1009).customer = ""; at(1077).customer = ""; at(1120).region = "";
    at(1018).total = round2(at(1018).total + 900); at(1063).total = round2(at(1063).total + 90); at(1131).total = round2(at(1131).total - 100);
    // a zero typed twice: 120 cases instead of 12, 180 bottles instead of 18
    Object.assign(at(1042), { product: "Oat milk, case of 12", price: 24, qty: 120 }); at(1042).total = expect(at(1042));
    Object.assign(at(1101), { product: "Syrup bottle", price: 9.5, qty: 180 }); at(1101).total = expect(at(1101));
    at(1027).date = "2052-09-14"; at(1088).date = "2025-08-31";
    { const r = at(1055); r.discount = 85; r.total = expect(r); }
    at(1034).email = at(1034).email.replace(/\.[a-z]+$/, ""); at(1112).email = at(1112).email.replace("@", "@@");
    at(1046).region = "Nrth"; at(1097).region = "Sout";
    // duplicates: three orders sent twice by the export
    [1024, 1070, 1139].forEach((id) => { const r = at(id); rows.splice(rows.indexOf(r) + 1, 0, { ...r }); });
    rows.forEach((r, i) => { r._k = i + 1; });
    return { rows, home };
  }

  const S = { ...build(), ran: false, stale: false, issues: [], kept: new Set(), off: new Set(), only: false, search: "", log: [], fixed: 0, scanning: false, firstTotal: null };
  S.firstTotal = S.rows.reduce((s, r) => s + (Number(r.total) || 0), 0);

  function lev(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const nameFromDomain = (email) => { const d = (email.split("@").pop() || "").toLowerCase(); const c = CUSTOMERS.find(([, dom]) => d.startsWith(dom.split(".")[0])); return c ? c[0] : null; };

  /* the eight rules: each returns issues for one row */
  function check() {
    const out = [];
    const seen = new Map();
    const med = {}; PRODUCTS.forEach(([p]) => { med[p] = median(S.rows.filter((r) => r.product === p).map((r) => Number(r.qty))); });
    for (const r of S.rows) {
      const add = (rule, field, msg, fix) => { if (!S.off.has(rule) && !S.kept.has(`${r._k}:${rule}`)) out.push({ k: r._k, id: r.id, rule, field, msg, fix, sev: SEV[rule] }); };
      // required
      ["customer", "region"].forEach((f) => {
        if (!String(r[f] ?? "").trim()) {
          const v = f === "customer" ? nameFromDomain(r.email) : S.home[nameFromDomain(r.email) || r.customer]?.region;
          add("required", f, ["m.required", { f: t("col." + f) }], v ? { label: [f === "customer" ? "f.fill" : "f.fillRegion", { v }], apply: () => { r[f] = v; } } : null);
        }
      });
      // duplicate
      const sig = COLS.map((c) => r[c]).join("|");
      if (seen.has(r.id) && seen.get(r.id) === sig) add("duplicate", "id", ["m.duplicate", { id: r.id }], { label: ["f.remove"], apply: () => { S.rows.splice(S.rows.indexOf(r), 1); } });
      else if (!seen.has(r.id)) seen.set(r.id, sig);
      // outlier
      const q = Number(r.qty), m = med[r.product] || 1;
      let outlier = false;
      if (q > m * 5) {
        outlier = true;
        const s = q % 100 === 0 && q / 100 <= m * 3 && q / 10 > m * 3 ? q / 100 : q % 10 === 0 ? q / 10 : m;
        add("outlier", "qty", ["m.outlier", { q: F.num(q), x: F.num(Math.round(q / m)), med: F.num(m), s: F.num(s) }], { label: ["f.qty", { v: F.num(s) }], apply: () => { r.qty = s; r.total = expect(r); } });
      }
      // arithmetic (skip when the quantity itself is the suspect, to avoid a double report)
      const e = expect({ ...r, qty: q, price: Number(r.price), discount: Number(r.discount) });
      if (!outlier && Math.abs(Number(r.total) - e) > 0.01)
        add("arith", "total", ["m.arith", { q: F.num(q), p: F.money(r.price, 2), d: F.num(r.discount), e: F.money(e, 2), a: F.money(Number(r.total) || 0, 2) }], { label: ["f.recalc", { v: F.money(e, 2) }], apply: () => { r.total = e; } });
      // date
      if (!/^2025-09-(0[1-9]|[12]\d|30)$/.test(r.date)) {
        const fixd = /^\d{4}-09-\d{2}$/.test(r.date) ? "2025" + r.date.slice(4) : null;
        add("date", "date", ["m.date", { d: r.date }], fixd ? { label: ["f.date", { v: fixd }], apply: () => { r.date = fixd; } } : null);
      }
      // discount
      if (Number(r.discount) > 20 || Number(r.discount) < 0) {
        const u = S.home[r.customer]?.disc ?? 0;
        add("discount", "discount", ["m.discount", { d: F.num(r.discount), u: F.num(u) }], { label: ["f.discount", { v: u }], apply: () => { r.discount = u; r.total = expect(r); } });
      }
      // email
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(r.email)) {
        const dom = (CUSTOMERS.find(([c]) => c === r.customer) || [])[1];
        const local = r.email.split("@")[0];
        const v = dom ? `${local}@${dom}` : null;
        add("email", "email", ["m.email", { e: r.email }], v ? { label: ["f.email", { v }], apply: () => { r.email = v; } } : null);
      }
      // region
      const reg = String(r.region ?? "").trim();
      if (reg && !REGIONS.includes(reg)) {
        const s = REGIONS.reduce((a, b) => (lev(reg, b) < lev(reg, a) ? b : a));
        add("region", "region", ["m.region", { r: reg, s }], { label: ["f.region", { v: s }], apply: () => { r.region = s; } });
      }
    }
    return out;
  }

  const open = () => S.issues;
  const badRows = () => new Set(S.issues.map((i) => i.k));
  const rowOf = (k) => S.rows.find((r) => r._k === k);
  const stamp = () => new Date().toLocaleTimeString(I18N.lang === "es" ? "es-ES" : "en-US", { hour: "2-digit", minute: "2-digit" });
  const log = (key, vars) => S.log.unshift({ at: stamp(), key, vars });
  const msgOf = (m) => (Array.isArray(m) ? t(m[0], m[1]) : m);

  function run(animated) {
    S.issues = check(); S.ran = true; S.stale = false;
    log("log.run", { n: S.issues.length });
    if (animated) {
      S.scanning = true; A.render(); const rows = $$("#grid tbody tr");
      rows.forEach((tr, i) => setTimeout(() => tr.classList.add("scanned"), i * 9));
      setTimeout(() => { S.scanning = false; A.render(); }, rows.length * 9 + 250);
    } else A.render();
  }

  function applyFix(issue) {
    const r = rowOf(issue.k); if (!r || !issue.fix) return;
    issue.fix.apply(); S.fixed++;
    log("log.fix", { id: r.id, what: msgOf(issue.fix.label) });
    S.issues = check();
  }

  /* ---------------- views ---------------- */
  const sevPill = (s) => `<span class="pill sev-${s}">${t("sev." + s)}</span>`;
  const fmtCell = (r, c) => {
    const v = r[c];
    if (c === "price") return F.money(v, 2);
    if (c === "total") return F.money(Number(v) || 0, 2);
    if (c === "discount") return v + "%";
    if (c === "id") return "#" + v;
    if (v === "" || v == null) return `<span class="blank">—</span>`;
    return esc(v);
  };

  function data() {
    const bad = badRows();
    const q = S.search.trim().toLowerCase();
    const rows = S.rows.filter((r) => (!S.only || bad.has(r._k)) && (!q || String(r.id).includes(q) || r.customer.toLowerCase().includes(q)));
    const byRow = {}; S.issues.forEach((i) => { (byRow[i.k] = byRow[i.k] || []).push(i); });
    const nBad = bad.size;
    let banner;
    if (!S.ran) banner = `<div class="qbar ready"><span>${t("d.ready", { n: S.rows.length })}</span><button class="btn btn-accent" type="button" data-run data-i18n="d.run"></button></div>`;
    else if (S.stale) banner = `<div class="qbar stale"><span data-i18n="d.stale"></span><button class="btn btn-dark btn-s" type="button" data-run data-i18n="d.rerun"></button></div>`;
    else if (S.issues.length) banner = `<div class="qbar found"><span><b>${t("d.found", { i: S.issues.length, r: nBad })}</b></span><a class="btn btn-ghost btn-s" href="#/issues" data-i18n="nav.issues"></a></div>`;
    else banner = `<div class="qbar ok"><span>✓ <b data-i18n="d.clean"></b></span><a class="btn btn-ghost btn-s" href="#/summary" data-i18n="nav.summary"></a></div>`;
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      <div class="page-head"><div><h1 data-i18n="d.h"></h1><p>${t("d.p", { n: S.rows.length })}</p></div>
        <div class="toolbar" style="margin:0"><button class="btn btn-ghost btn-s" type="button" data-break data-i18n="d.break"></button>${S.ran ? `<button class="btn btn-dark btn-s" type="button" data-run data-i18n="d.rerun"></button>` : ""}</div></div>
      ${banner}
      <div class="toolbar">
        <label class="search"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5" stroke-linecap="round"/></svg><input id="q" type="search" value="${esc(S.search)}" placeholder="${t("d.search")}" aria-label="${t("d.search")}"></label>
        <label class="check" style="margin:0"><input type="checkbox" id="only" ${S.only ? "checked" : ""} ${S.ran ? "" : "disabled"}> ${t("d.only")}</label>
        <span class="grow"></span><span class="hint" data-i18n="d.edit"></span>
      </div>
      <div class="tbl-wrap qgrid${S.scanning ? " scanning" : ""}"><table class="tbl" id="grid"><thead><tr><th></th>${COLS.map((c) => `<th class="${["qty", "price", "discount", "total"].includes(c) ? "r" : ""}">${t("col." + c)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r) => {
        const is = S.scanning ? [] : byRow[r._k] || [];
        const worst = is.length ? ["critical", "high", "medium", "low"].find((s) => is.some((i) => i.sev === s)) : null;
        const fields = new Set(is.map((i) => i.field));
        return `<tr data-k="${r._k}" class="${worst ? "bad sev-row-" + worst : ""}"><td class="flagcell">${worst ? `<span class="dotflag sev-${worst}" title="${is.length}">${is.length}</span>` : ""}</td>${COLS.map((c) =>
          `<td data-c="${c}" class="${["qty", "price", "discount", "total"].includes(c) ? "r " : ""}${fields.has(c) ? "hit" : ""}">${fmtCell(r, c)}</td>`).join("")}</tr>`;
      }).join("")}</tbody></table></div>`;
  }

  function issues() {
    const fixable = S.issues.filter((i) => i.fix).length;
    const cards = RULE_IDS.map((rule) => {
      const list = S.issues.filter((i) => i.rule === rule);
      const off = S.off.has(rule);
      return `<div class="card rule${off ? " off" : ""}">
        <div class="card-head"><div><div class="rule-t"><h3>${t("r." + rule)}</h3>${sevPill(SEV[rule])}</div><p class="sub" style="margin:4px 0 0">${t("rd." + rule)}</p></div>
          <button class="toggle" type="button" role="switch" aria-checked="${!off}" data-toggle="${rule}"><span></span>${t(off ? "i.off" : "i.on")}</button></div>
        ${S.ran && !off ? (list.length ? `<div class="rule-list">${list.map((i) => `<button type="button" data-open="${i.k}"><b>#${i.id}</b><span>${esc(msgOf(i.msg))}</span></button>`).join("")}</div>` : `<p class="nothing">✓ ${t("i.none")}</p>`) : ""}
      </div>`;
    }).join("");
    return `<div class="page-head"><div><h1 data-i18n="i.h"></h1><p data-i18n="i.p"></p></div>
      ${S.ran && fixable ? `<button class="btn btn-accent" type="button" data-fixall>${t("i.fixAll", { n: fixable })}</button>` : S.ran ? `<button class="btn btn-dark btn-s" type="button" data-run data-i18n="d.rerun"></button>` : ""}</div>
      ${S.ran ? "" : `<div class="qbar ready"><span data-i18n="i.notRun"></span><a class="btn btn-accent" href="#/data" data-i18n="i.go"></a></div>`}
      ${S.stale ? `<div class="qbar stale"><span data-i18n="d.stale"></span><button class="btn btn-dark btn-s" type="button" data-run data-i18n="d.rerun"></button></div>` : ""}
      <div class="grid g-2">${cards}</div>`;
  }

  function summary() {
    const total = S.rows.length, bad = badRows().size;
    const score = S.ran ? ((total - bad) / total) * 100 : 0;
    const reported = S.firstTotal;
    // the "correct" figure: current data minus anything still open that we know how to fix
    const clean = (() => {
      // apply every available fix to a copy, then total it
      const save = S.rows; S.rows = save.map((r) => ({ ...r }));
      for (let pass = 0; pass < 3; pass++) check().filter((i) => i.fix).forEach((i) => i.fix.apply());
      const v = S.rows.reduce((s, r) => s + (Number(r.total) || 0), 0);
      S.rows = save;
      return v;
    })();
    const diff = reported - clean;
    const sevCounts = ["critical", "high", "medium", "low"].map((s) => ({ s, n: S.issues.filter((i) => i.sev === s).length }));
    const colors = { critical: "#b42318", high: "#d9733a", medium: "#c9a227", low: "#a4a39c" };
    return `<div class="page-head"><div><h1 data-i18n="s.h"></h1><p data-i18n="s.p"></p></div><button class="btn btn-ghost btn-s" type="button" data-export data-i18n="s.export"></button></div>
      ${S.ran ? "" : `<div class="qbar ready"><span data-i18n="i.notRun"></span><a class="btn btn-accent" href="#/data" data-i18n="i.go"></a></div>`}
      <div class="grid g-sum">
        <div class="card score-card">${Chart.ring(score, { sub: t("s.score"), color: score > 98 ? "var(--accent)" : score > 90 ? "#c9a227" : "var(--crit)" })}
          <dl class="facts"><div><dt data-i18n="s.rows"></dt><dd>${F.num(total)}</dd></div><div><dt data-i18n="s.open"></dt><dd>${F.num(S.issues.length)}</dd></div>
          <div><dt data-i18n="s.fixed"></dt><dd>${F.num(S.fixed)}</dd></div><div><dt data-i18n="s.kept"></dt><dd>${F.num(S.kept.size)}</dd></div></dl></div>
        <div class="card"><h3 data-i18n="s.impact"></h3><p class="sub">${t("s.impactP", { p: F.pct((Math.abs(diff) / clean) * 100, 1) })}</p>
          <div class="impact"><div><span data-i18n="s.reported"></span><b>${F.money(reported)}</b></div><div><span data-i18n="s.correct"></span><b>${F.money(clean)}</b></div>
          <div class="neg-diff"><span data-i18n="s.diff"></span><b>${diff >= 0 ? "+" : "−"}${F.money(Math.abs(diff)).replace("−", "")}</b></div></div></div>
      </div>
      <div class="grid g-2 mt">
        <div class="card"><h3 data-i18n="s.bySev"></h3><p class="sub">&nbsp;</p>${Chart.hbars(sevCounts.map((x) => ({ label: t("sev." + x.s), value: x.n, color: colors[x.s], swatch: colors[x.s] })))}</div>
        <div class="card"><h3 data-i18n="s.log"></h3><p class="sub">&nbsp;</p>${S.log.length ? `<ol class="log">${S.log.slice(0, 14).map((l) => `<li><span>${l.at}</span>${esc(t(l.key, l.vars))}</li>`).join("")}</ol>` : `<p class="nothing" data-i18n="s.logEmpty"></p>`}</div>
      </div>`;
  }

  /* drawer */
  function openDrawer(k) {
    const r = rowOf(k); if (!r) return;
    const list = S.issues.filter((i) => i.k === k);
    const dr = $("#drawer");
    dr.innerHTML = `<div class="drawer-head"><div><span class="pill ${list.length ? "sev-" + list[0].sev : "ok"}">${list.length ? t("dr.issues", { n: list.length }) : "✓"}</span><h2>${t("dr.order", { id: r.id })}</h2>
        <p class="sub" style="margin:4px 0 0">${esc(r.customer || "—")} · ${esc(r.product)}</p></div><button class="x" type="button" data-close aria-label="${t("f.close")}">×</button></div>
      <div class="drawer-body">
        ${list.length ? list.map((i, n) => `<div class="iss"><div class="rule-t">${sevPill(i.sev)}<b>${t("r." + i.rule)}</b></div><p>${esc(msgOf(i.msg))}</p>
          <div class="iss-act">${i.fix ? `<button class="btn btn-accent btn-s" type="button" data-fix="${n}">${esc(msgOf(i.fix.label))}</button>` : ""}<button class="btn btn-ghost btn-s" type="button" data-keep="${n}" data-i18n="f.keep"></button></div>
          <details><summary data-i18n="dr.why"></summary><p>${t("rd." + i.rule)}</p></details></div>`).join("") : `<p class="nothing">✓ ${t("dr.none")}</p>`}
        <dl class="rec">${COLS.map((c) => `<div class="${list.some((i) => i.field === c) ? "hit" : ""}"><dt>${t("col." + c)}</dt><dd>${fmtCell(r, c)}</dd></div>`).join("")}</dl>
      </div>`;
    Kit.I18N.apply(dr);
    dr.dataset.k = k;
    dr.classList.add("open"); $("#drawerBg").classList.add("open");
  }
  function closeDrawer() { $("#drawer").classList.remove("open"); $("#drawerBg").classList.remove("open"); }

  /* ---------------- wiring ---------------- */
  const A = Kit.app({
    nav: [
      { id: "data", key: "nav.data", icon: "table" },
      { id: "issues", key: "nav.issues", icon: "alert", count: () => (S.ran ? S.issues.length : 0) },
      { id: "summary", key: "nav.summary", icon: "doc" },
    ],
    views: { data, issues, summary },
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-run]")) return run(true);
    if (e.target.closest("[data-break]")) {
      const R = Kit.rng(Date.now() % 100000);
      const clean = S.rows.filter((r) => !badRows().has(r._k));
      const r = R.pick(clean);
      const moves = [() => { r.qty = Number(r.qty) * 100; r.total = expect(r); }, () => { r.region = r.region.slice(0, -1); }, () => { r.total = round2(Number(r.total) * 1.5); },
        () => { r.customer = ""; }, () => { r.date = "2025-10-0" + R.int(1, 9); }, () => { r.discount = 40; r.total = expect(r); }, () => { r.email = r.email.replace(/\.[a-z]+$/, ""); }];
      R.pick(moves)(); S.stale = S.ran; log("log.break", { id: r.id });
      toast(t("d.broke", { id: r.id })); A.render();
      const tr = $(`#grid tr[data-k="${r._k}"]`); if (tr) { tr.scrollIntoView({ block: "center", behavior: "smooth" }); tr.classList.add("pulse"); }
      return;
    }
    const tr = e.target.closest("#grid tbody tr");
    // wait a beat so a double-click (edit) doesn't also open the drawer
    if (tr && S.ran && !e.target.closest("[contenteditable=true]")) { clearTimeout(clickT); clickT = setTimeout(() => openDrawer(Number(tr.dataset.k)), 240); return; }
    const op = e.target.closest("[data-open]");
    if (op) return openDrawer(Number(op.dataset.open));
    if (e.target.closest("[data-close]") || e.target.id === "drawerBg") return closeDrawer();
    const fx = e.target.closest("[data-fix]"), kp = e.target.closest("[data-keep]");
    if (fx || kp) {
      const k = Number($("#drawer").dataset.k);
      const list = S.issues.filter((i) => i.k === k);
      const issue = list[Number((fx || kp).dataset.fix ?? (fx || kp).dataset.keep)];
      if (fx) { applyFix(issue); toast(t("f.fixed")); }
      else { S.kept.add(`${k}:${issue.rule}`); log("log.keep", { id: issue.id, r: t("r." + issue.rule) }); S.issues = check(); toast(t("f.kept")); }
      A.render();
      if (rowOf(k) && S.issues.some((i) => i.k === k)) openDrawer(k); else closeDrawer();
      return;
    }
    const tg = e.target.closest("[data-toggle]");
    if (tg) { const r = tg.dataset.toggle; S.off.has(r) ? S.off.delete(r) : S.off.add(r); if (S.ran) S.issues = check(); return A.render(); }
    if (e.target.closest("[data-fixall]")) {
      let n = 0;
      for (let pass = 0; pass < 3; pass++) { const list = check().filter((i) => i.fix); list.forEach((i) => { const r = rowOf(i.k); if (r) { i.fix.apply(); n++; S.fixed++; log("log.fix", { id: r.id, what: msgOf(i.fix.label) }); } }); }
      S.issues = check(); toast(t("i.fixedAll", { n, k: S.issues.length })); return A.render();
    }
    if (e.target.closest("[data-export]")) {
      const rows = S.issues.map((i) => `${i.id},${t("sev." + i.sev)},"${t("r." + i.rule)}","${msgOf(i.msg).replace(/"/g, '""')}"`);
      return download("issue-log.csv", "order,severity,rule,detail\n" + rows.join("\n"));
    }
  });

  // inline editing
  let clickT;
  document.addEventListener("dblclick", (e) => {
    const td = e.target.closest("#grid td[data-c]");
    clearTimeout(clickT);
    if (!td || td.dataset.c === "id") return;
    const r = rowOf(Number(td.closest("tr").dataset.k));
    td.contentEditable = "true"; td.textContent = r[td.dataset.c] ?? ""; td.focus();
    document.getSelection().selectAllChildren(td);
    const done = () => {
      td.contentEditable = "false"; const c = td.dataset.c; let v = td.textContent.trim();
      if (["qty", "price", "discount", "total"].includes(c)) v = Number(v.replace(/[^\d.\-]/g, "")) || 0;
      if (String(r[c]) !== String(v)) { r[c] = v; S.stale = S.ran; log("log.edit", { id: r.id, f: t("col." + c) }); toast(t("d.edited")); }
      A.render();
    };
    td.addEventListener("blur", done, { once: true });
    td.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); td.blur(); } if (ev.key === "Escape") { td.textContent = r[td.dataset.c]; td.blur(); } });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  $("#view").addEventListener("input", (e) => {
    if (e.target.id === "q") { S.search = e.target.value; const pos = e.target.selectionStart; A.render(); const q = $("#q"); q.focus(); q.setSelectionRange(pos, pos); }
  });
  $("#view").addEventListener("change", (e) => { if (e.target.id === "only") { S.only = e.target.checked; A.render(); } });
})();
