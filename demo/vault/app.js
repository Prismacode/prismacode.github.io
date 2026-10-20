/* Research Vault demo. Linked notes, a graph of how they connect, and layered maps
   (map -> digest -> note) so the right context is found without reading everything.
   The notes are short sample notes written for this demo. */
(function () {
  const { t, esc, $, toast, I18N } = Kit;

  I18N.add({
    en: {
      "rv2.title": "Research Vault · live demo", "rv2.name": "Research Vault", "rv2.sub": "Synced to phone",
      "nav.notes": "Notes", "nav.graph": "Graph", "nav.find": "Find",
      "tour.1": "Click any underlined link inside a note to follow the thread.", "tour.2": "Open the Graph and hover a note to see what it connects to. Drag nodes around.",
      "tour.3": "In Find, ask a question and see how few files it opens to answer.",
      "sync": "Synced to phone · {m} min ago", "syncing": "Syncing…", "synced": "Laptop and phone match: {n} notes, no sync subscription.",
      "nt.search": "Search every note…", "nt.back": "Linked from", "nt.out": "Links to", "nt.none": "Nothing links here yet.", "nt.edited": "Edited {d}", "nt.words": "{n} words",
      "nt.results": "{n} note(s) mention “{q}”",
      "fd.0": "Maps", "fd.1": "Methods", "fd.2": "Business", "fd.3": "Tools", "fd.4": "Digests",
      "gr.h": "Graph", "gr.p": "Every note, and every link between them. Bigger dots are linked from more places.", "gr.open": "Open note",
      "fi.h": "Find", "fi.p": "Questions are answered by walking down the layers: the map, then one digest, then the notes it points to.",
      "fi.ph": "Ask the vault…", "fi.go": "Find", "fi.l1": "Map", "fi.l2": "Digest", "fi.l3": "Notes", "fi.read": "Read", "fi.skip": "skipped",
      "fi.cost": "{n} files read to answer", "fi.flat": "A flat search would open {n} notes.", "fi.answer": "Best notes for this",
      "fi.q1": "How do I spot bad records before publishing?", "fi.q2": "How should I price a monthly plan?", "fi.q3": "Which tools keep a report reproducible?",
      "fi.nomatch": "No layer matched. Try one of the suggested questions.",
    },
    es: {
      "rv2.title": "Bóveda de investigación · demo en vivo", "rv2.name": "Bóveda de investigación", "rv2.sub": "Sincronizada con el teléfono",
      "nav.notes": "Notas", "nav.graph": "Grafo", "nav.find": "Buscar",
      "tour.1": "Haz clic en cualquier enlace subrayado dentro de una nota para seguir el hilo.", "tour.2": "Abre el Grafo y pasa el cursor sobre una nota para ver con qué se conecta. Arrastra los nodos.",
      "tour.3": "En Buscar, haz una pregunta y mira qué pocos archivos abre para responderla.",
      "sync": "Sincronizada con el teléfono · hace {m} min", "syncing": "Sincronizando…", "synced": "Laptop y teléfono coinciden: {n} notas, sin suscripción de sincronización.",
      "nt.search": "Buscar en todas las notas…", "nt.back": "Enlazada desde", "nt.out": "Enlaza a", "nt.none": "Nada enlaza aquí todavía.", "nt.edited": "Editada {d}", "nt.words": "{n} palabras",
      "nt.results": "{n} nota(s) mencionan “{q}”",
      "fd.0": "Mapas", "fd.1": "Métodos", "fd.2": "Negocio", "fd.3": "Herramientas", "fd.4": "Resúmenes",
      "gr.h": "Grafo", "gr.p": "Todas las notas y todos los enlaces entre ellas. Los puntos más grandes están enlazados desde más lugares.", "gr.open": "Abrir nota",
      "fi.h": "Buscar", "fi.p": "Las preguntas se responden bajando por capas: el mapa, luego un resumen, luego las notas a las que apunta.",
      "fi.ph": "Pregúntale a la bóveda…", "fi.go": "Buscar", "fi.l1": "Mapa", "fi.l2": "Resumen", "fi.l3": "Notas", "fi.read": "Leído", "fi.skip": "omitido",
      "fi.cost": "{n} archivos leídos para responder", "fi.flat": "Una búsqueda plana abriría {n} notas.", "fi.answer": "Las mejores notas para esto",
      "fi.q1": "¿Cómo detecto registros malos antes de publicar?", "fi.q2": "¿Cómo le pongo precio a un plan mensual?", "fi.q3": "¿Qué herramientas mantienen un reporte reproducible?",
      "fi.nomatch": "Ninguna capa coincidió. Prueba una de las preguntas sugeridas.",
    },
  });

  // folder: 0 maps, 1 methods, 2 business, 3 tools, 4 digests
  const N = [
    { id: "home", f: 0, d: "Oct 18", k: [], en: ["Home", "Start here. The vault has three areas: [[methods-map]] for how to work with data, [[business-map]] for pricing and customers, and [[tools-map]] for the software that does the work. Each map points to a digest, and each digest to the notes."],
      es: ["Inicio", "Empieza aquí. La bóveda tiene tres áreas: [[methods-map]] para trabajar con datos, [[business-map]] para precios y clientes, y [[tools-map]] para el software que hace el trabajo. Cada mapa apunta a un resumen, y cada resumen a las notas."] },
    { id: "methods-map", f: 0, d: "Oct 12", k: ["data", "quality", "survey", "records", "publish", "errors", "bad"], en: ["Methods map", "Everything about collecting and checking data. Read [[methods-digest]] first. Core notes: [[sampling]], [[outliers]], [[validation-rules]], [[survey-design]], [[seasonality]], [[index-numbers]]."],
      es: ["Mapa de métodos", "Todo sobre recolectar y revisar datos. Lee primero [[methods-digest]]. Notas centrales: [[sampling]], [[outliers]], [[validation-rules]], [[survey-design]], [[seasonality]], [[index-numbers]]."] },
    { id: "business-map", f: 0, d: "Oct 15", k: ["price", "pricing", "plan", "monthly", "customer", "churn", "subscription"], en: ["Business map", "Pricing, customers and the numbers behind a service. Read [[business-digest]] first. Core notes: [[pricing]], [[unit-economics]], [[interviews]], [[retention]], [[value-equation]]."],
      es: ["Mapa de negocio", "Precios, clientes y los números detrás de un servicio. Lee primero [[business-digest]]. Notas centrales: [[pricing]], [[unit-economics]], [[interviews]], [[retention]], [[value-equation]]."] },
    { id: "tools-map", f: 0, d: "Oct 9", k: ["tool", "tools", "report", "reproducible", "script", "automation", "dashboard"], en: ["Tools map", "The software side. Read [[tools-digest]] first. Core notes: [[r-reports]], [[spreadsheet-hygiene]], [[automation-checklist]], [[dashboards]]."],
      es: ["Mapa de herramientas", "El lado del software. Lee primero [[tools-digest]]. Notas centrales: [[r-reports]], [[spreadsheet-hygiene]], [[automation-checklist]], [[dashboards]]."] },
    { id: "methods-digest", f: 4, d: "Oct 12", k: ["records", "errors", "publish", "check", "bad", "outlier", "validation"], en: ["Methods digest", "Generated summary. To catch bad records before publishing, start with [[validation-rules]] (hard rules that must always hold) and [[outliers]] (values that are possible but suspicious). [[survey-design]] prevents most errors at the source. [[sampling]] and [[seasonality]] matter once the data is clean."],
      es: ["Resumen de métodos", "Resumen generado. Para atrapar registros malos antes de publicar, empieza con [[validation-rules]] (reglas que siempre deben cumplirse) y [[outliers]] (valores posibles pero sospechosos). [[survey-design]] evita la mayoría de errores en el origen. [[sampling]] y [[seasonality]] importan cuando los datos ya están limpios."] },
    { id: "business-digest", f: 4, d: "Oct 15", k: ["price", "pricing", "monthly", "plan", "churn"], en: ["Business digest", "Generated summary. A monthly plan is priced from [[value-equation]] (what the outcome is worth) and checked against [[unit-economics]] (what it costs to deliver and keep a customer). [[retention]] decides whether the plan pays. [[interviews]] are where the real numbers come from."],
      es: ["Resumen de negocio", "Resumen generado. Un plan mensual se precia desde [[value-equation]] (cuánto vale el resultado) y se contrasta con [[unit-economics]] (cuánto cuesta entregar y retener a un cliente). [[retention]] decide si el plan paga. [[interviews]] es de donde salen los números reales."] },
    { id: "tools-digest", f: 4, d: "Oct 9", k: ["reproducible", "report", "script", "tools"], en: ["Tools digest", "Generated summary. A report stays reproducible when one script builds it from raw data ([[r-reports]]), the inputs follow [[spreadsheet-hygiene]], and nothing runs on a schedule without the [[automation-checklist]]."],
      es: ["Resumen de herramientas", "Resumen generado. Un reporte es reproducible cuando un solo script lo construye desde los datos crudos ([[r-reports]]), las entradas siguen [[spreadsheet-hygiene]], y nada corre programado sin la [[automation-checklist]]."] },
    { id: "sampling", f: 1, d: "Sep 30", en: ["Sampling", "A sample is only as good as its frame. Weight by the population you actually care about, and write down who could never have been selected. Ties to [[survey-design]] and [[index-numbers]]."],
      es: ["Muestreo", "Una muestra vale lo que vale su marco. Pondera por la población que de verdad importa, y anota quién nunca pudo ser seleccionado. Se conecta con [[survey-design]] y [[index-numbers]]."] },
    { id: "outliers", f: 1, d: "Oct 11", en: ["Outliers", "An outlier is a question, not an error. Compare against the typical value for the same group; ten times the median is usually a typed zero. Never delete: flag, explain, decide. See [[validation-rules]] and [[dashboards]]."],
      es: ["Valores atípicos", "Un valor atípico es una pregunta, no un error. Compáralo con el valor típico del mismo grupo; diez veces la mediana suele ser un cero de más. Nunca borres: marca, explica, decide. Ver [[validation-rules]] y [[dashboards]]."] },
    { id: "validation-rules", f: 1, d: "Oct 12", en: ["Validation rules", "Rules that must always hold: totals add up, dates fall in the period, required fields are filled, codes come from the list. Run them before anything is published, and keep a log of every fix. Built into [[survey-design]] and [[automation-checklist]]."],
      es: ["Reglas de validación", "Reglas que siempre deben cumplirse: los totales cuadran, las fechas caen en el período, los campos obligatorios están llenos, los códigos vienen de la lista. Córrelas antes de publicar y registra cada corrección. Integradas en [[survey-design]] y [[automation-checklist]]."] },
    { id: "survey-design", f: 1, d: "Sep 22", en: ["Survey design", "Most errors are cheaper to prevent than to clean. Validate at entry, skip questions that don't apply, and offer lists instead of free text. Pairs with [[validation-rules]] and [[interviews]]."],
      es: ["Diseño de encuestas", "La mayoría de errores es más barato prevenirlos que limpiarlos. Valida al ingresar, omite lo que no aplica, y ofrece listas en vez de texto libre. Va con [[validation-rules]] y [[interviews]]."] },
    { id: "seasonality", f: 1, d: "Aug 30", en: ["Seasonality", "Compare a month with the same month a year earlier before comparing it with last month. High season hides problems; low season exaggerates them. Feeds [[dashboards]] and [[retention]]."],
      es: ["Estacionalidad", "Compara un mes con el mismo mes del año anterior antes de compararlo con el mes pasado. La temporada alta esconde problemas; la baja los exagera. Alimenta [[dashboards]] y [[retention]]."] },
    { id: "index-numbers", f: 1, d: "Aug 14", en: ["Index numbers", "An index is a ratio to a base period, so the base has to be stated every time it's shown. Changing the base changes the story. See [[sampling]]."],
      es: ["Números índice", "Un índice es una razón respecto a un período base, así que la base debe indicarse cada vez que se muestra. Cambiar la base cambia la historia. Ver [[sampling]]."] },
    { id: "pricing", f: 2, d: "Oct 15", en: ["Pricing", "Price from the outcome, not from the hours. Offer three tiers so the middle one looks reasonable, and raise prices on new customers first. Grounded in [[value-equation]] and [[unit-economics]]."],
      es: ["Precios", "Pon precio desde el resultado, no desde las horas. Ofrece tres niveles para que el del medio parezca razonable, y sube precios primero a clientes nuevos. Se basa en [[value-equation]] y [[unit-economics]]."] },
    { id: "unit-economics", f: 2, d: "Oct 3", en: ["Unit economics", "What it costs to win a customer against what that customer pays over their lifetime. If the first month doesn't cover the cost of winning them, growth needs cash. Depends on [[retention]]."],
      es: ["Economía unitaria", "Lo que cuesta ganar un cliente frente a lo que ese cliente paga en toda su vida. Si el primer mes no cubre el costo de ganarlo, crecer requiere caja. Depende de [[retention]]."] },
    { id: "interviews", f: 2, d: "Sep 18", en: ["Customer interviews", "Ask about the last time it happened, not what they would do. Write down the exact words they use for the problem: they become the copy. Feeds [[pricing]] and [[survey-design]]."],
      es: ["Entrevistas a clientes", "Pregunta por la última vez que pasó, no por lo que harían. Anota las palabras exactas que usan para el problema: se convierten en el texto de venta. Alimenta [[pricing]] y [[survey-design]]."] },
    { id: "retention", f: 2, d: "Oct 1", en: ["Retention", "A monthly plan lives or dies on month three. Measure it by cohort, never as one blended number. See [[seasonality]] and [[dashboards]]."],
      es: ["Retención", "Un plan mensual vive o muere en el tercer mes. Mídela por cohorte, nunca como un solo número mezclado. Ver [[seasonality]] y [[dashboards]]."] },
    { id: "value-equation", f: 2, d: "Oct 15", en: ["Value equation", "Value rises with the size of the outcome and how sure the buyer is of getting it, and falls with the time and effort it takes. A demo on sample data raises certainty more than any claim. Used by [[pricing]]."],
      es: ["Ecuación de valor", "El valor sube con el tamaño del resultado y la seguridad de obtenerlo, y baja con el tiempo y el esfuerzo que cuesta. Una demo con datos de ejemplo da más seguridad que cualquier promesa. Usada por [[pricing]]."] },
    { id: "r-reports", f: 3, d: "Oct 9", en: ["R for reports", "One script, raw data in, finished document out. No figure is typed by hand, so a re-run after a correction changes every number consistently. Inputs follow [[spreadsheet-hygiene]]."],
      es: ["R para reportes", "Un script, datos crudos de entrada, documento terminado de salida. Ninguna cifra se escribe a mano, así que volver a correrlo tras una corrección cambia todos los números de forma consistente. Las entradas siguen [[spreadsheet-hygiene]]."] },
    { id: "spreadsheet-hygiene", f: 3, d: "Sep 27", en: ["Spreadsheet hygiene", "One table per sheet, one header row, no merged cells, no totals mixed into the data. A clean sheet is what makes [[r-reports]] and [[validation-rules]] possible."],
      es: ["Higiene de hojas de cálculo", "Una tabla por hoja, una fila de encabezado, sin celdas combinadas, sin totales mezclados con los datos. Una hoja limpia es lo que hace posibles [[r-reports]] y [[validation-rules]]."] },
    { id: "automation-checklist", f: 3, d: "Oct 6", en: ["Automation checklist", "Before anything runs on a schedule: it logs, it never deletes, it says when it failed, and someone gets told. Applies [[validation-rules]]."],
      es: ["Lista para automatizar", "Antes de que algo corra programado: registra, nunca borra, avisa cuando falla, y alguien se entera. Aplica [[validation-rules]]."] },
    { id: "dashboards", f: 3, d: "Oct 17", en: ["Dashboards that get used", "Four numbers above the fold, each with its comparison. Every chart answers one question someone actually asks. Mark [[outliers]] instead of hiding them, and respect [[seasonality]]."],
      es: ["Paneles que se usan", "Cuatro cifras arriba, cada una con su comparación. Cada gráfico responde una pregunta que alguien de verdad hace. Marca los [[outliers]] en vez de esconderlos, y respeta la [[seasonality]]."] },
  ];
  const BY = Object.fromEntries(N.map((n) => [n.id, n]));
  const FOLDER_COLORS = ["#121212", "#0b7a55", "#d9733a", "#5b7fa6", "#9b7bb0"];
  const L = () => I18N.lang;
  const title = (n) => n[L()][0], body = (n) => n[L()][1];
  const linksOf = (n) => [...new Set([...n.en[1].matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]))].filter((id) => BY[id]);
  const EDGES = []; N.forEach((n) => linksOf(n).forEach((to) => EDGES.push([n.id, to])));
  const backOf = (id) => N.filter((n) => linksOf(n).includes(id));
  const deg = (id) => EDGES.filter((e) => e[0] === id || e[1] === id).length;

  const S = { cur: "home", q: "", syncM: 2, hover: null, find: "", findRes: null, findStep: 0 };

  /* ---------- notes ---------- */
  function render(n) {
    return esc(body(n)).replace(/\[\[([^\]]+)\]\]/g, (m, id) => BY[id] ? `<a href="#/notes/${id}" class="vt-link" data-f="${BY[id].f}">${esc(title(BY[id]))}</a>` : m);
  }
  function syncPill() { return `<button type="button" class="vt-sync" data-sync><i></i><span>${t("sync", { m: S.syncM })}</span></button>`; }

  function notes(param) {
    if (param && BY[param]) S.cur = param;
    const n = BY[S.cur];
    const q = S.q.trim().toLowerCase();
    const hits = q ? N.filter((x) => (title(x) + " " + body(x)).toLowerCase().includes(q)) : null;
    const tree = [0, 4, 1, 2, 3].map((f) => {
      const list = N.filter((x) => x.f === f && (!hits || hits.includes(x)));
      if (!list.length) return "";
      return `<div class="vt-fold"><p><i style="background:${FOLDER_COLORS[f]}"></i>${t("fd." + f)}</p>${list.map((x) => `<a href="#/notes/${x.id}" class="${x.id === S.cur ? "on" : ""}">${esc(title(x))}</a>`).join("")}</div>`;
    }).join("");
    const back = backOf(n.id), out = linksOf(n).map((id) => BY[id]);
    let text = render(n);
    if (q) text = text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![^<]*>)`, "gi"), "<mark>$1</mark>");
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      <div class="vt-top"><label class="search"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5" stroke-linecap="round"/></svg><input id="q" type="search" value="${esc(S.q)}" placeholder="${t("nt.search")}" aria-label="${t("nt.search")}"></label>
        ${hits ? `<span class="sub" style="margin:0">${t("nt.results", { n: hits.length, q: esc(S.q) })}</span>` : ""}<span class="grow"></span>${syncPill()}</div>
      <div class="vt-three">
        <aside class="vt-tree">${tree}</aside>
        <article class="vt-note" style="--fc:${FOLDER_COLORS[n.f]}"><p class="vt-crumb">${t("fd." + n.f)} / ${n.id}.md</p><h1>${esc(title(n))}</h1>
          <p class="vt-meta">${t("nt.edited", { d: n.d })} · ${t("nt.words", { n: body(n).split(/\s+/).length })}</p><div class="vt-body"><p>${text}</p></div></article>
        <aside class="vt-links"><h3>${t("nt.back")} <span>${back.length}</span></h3>${back.length ? back.map((x) => `<a href="#/notes/${x.id}"><i style="background:${FOLDER_COLORS[x.f]}"></i>${esc(title(x))}</a>`).join("") : `<p class="sub">${t("nt.none")}</p>`}
          <h3>${t("nt.out")} <span>${out.length}</span></h3>${out.map((x) => `<a href="#/notes/${x.id}"><i style="background:${FOLDER_COLORS[x.f]}"></i>${esc(title(x))}</a>`).join("")}
          ${miniGraph(n)}</aside>
      </div>`;
  }
  function miniGraph(n) {
    const nb = [...new Set([...linksOf(n), ...backOf(n.id).map((x) => x.id)])];
    const R = 62, C = 90;
    const pos = nb.map((id, i) => [C + R * Math.cos((i / nb.length) * Math.PI * 2 - Math.PI / 2), C + R * Math.sin((i / nb.length) * Math.PI * 2 - Math.PI / 2)]);
    return `<svg class="vt-mini" viewBox="0 0 180 180">${pos.map(([x, y]) => `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}"/>`).join("")}
      ${pos.map(([x, y], i) => `<a href="#/notes/${nb[i]}"><circle cx="${x}" cy="${y}" r="6" fill="${FOLDER_COLORS[BY[nb[i]].f]}"><title>${esc(title(BY[nb[i]]))}</title></circle></a>`).join("")}
      <circle cx="${C}" cy="${C}" r="10" fill="${FOLDER_COLORS[n.f]}" class="me"/></svg>`;
  }

  /* ---------- graph ---------- */
  const W = 900, H = 560;
  let P = null;
  function layout() {
    const r = Kit.rng(7);
    P = Object.fromEntries(N.map((n) => [n.id, { x: W / 2 + (r() - 0.5) * 400, y: H / 2 + (r() - 0.5) * 300, vx: 0, vy: 0 }]));
    for (let it = 0; it < 400; it++) {
      const k = 1 - it / 400;
      N.forEach((a) => N.forEach((b) => {
        if (a === b) return; const pa = P[a.id], pb = P[b.id];
        let dx = pa.x - pb.x, dy = pa.y - pb.y, d2 = dx * dx + dy * dy + 0.01; const f = 2600 / d2;
        pa.vx += dx * f * 0.02; pa.vy += dy * f * 0.02;
      }));
      EDGES.forEach(([s, e]) => { const a = P[s], b = P[e]; const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - 95) * 0.012; a.vx += (dx / d) * f * d * 0.05; a.vy += (dy / d) * f * d * 0.05; b.vx -= (dx / d) * f * d * 0.05; b.vy -= (dy / d) * f * d * 0.05; });
      N.forEach((n) => { const p = P[n.id]; p.vx += (W / 2 - p.x) * 0.004; p.vy += (H / 2 - p.y) * 0.006; p.x += p.vx * k; p.y += p.vy * k; p.vx *= 0.5; p.vy *= 0.5; p.x = Math.max(40, Math.min(W - 40, p.x)); p.y = Math.max(30, Math.min(H - 30, p.y)); });
    }
    // stretch the settled layout to fill the frame, so labels have room
    const xs = N.map((n) => P[n.id].x), ys = N.map((n) => P[n.id].y);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    N.forEach((n) => { const p = P[n.id]; p.x = 70 + ((p.x - x0) / (x1 - x0 || 1)) * (W - 140); p.y = 40 + ((p.y - y0) / (y1 - y0 || 1)) * (H - 90); });
  }
  function graphSvg() {
    if (!P) layout();
    const h = S.hover, nbs = h ? new Set([h, ...EDGES.filter((e) => e[0] === h || e[1] === h).flat()]) : null;
    return `<svg class="vt-graph" viewBox="0 0 ${W} ${H}" id="gsvg">
      ${EDGES.map(([a, b]) => `<line class="${h && (a === h || b === h) ? "hot" : h ? "dim" : ""}" x1="${P[a].x}" y1="${P[a].y}" x2="${P[b].x}" y2="${P[b].y}"/>`).join("")}
      ${N.map((n) => { const r = 5 + deg(n.id) * 1.15; const p = P[n.id];
        return `<g class="vt-node${nbs && !nbs.has(n.id) ? " dim" : ""}${h === n.id ? " hot" : ""}" data-node="${n.id}" transform="translate(${p.x},${p.y})"><circle r="${r}" fill="${FOLDER_COLORS[n.f]}"/><text y="${r + 14}" text-anchor="middle">${esc(title(n))}</text></g>`; }).join("")}</svg>`;
  }
  function graph() {
    return `<div class="page-head"><div><h1 data-i18n="gr.h"></h1><p data-i18n="gr.p"></p></div>${syncPill()}</div>
      <div class="card vt-gcard">${graphSvg()}<div class="vt-legend">${[0, 4, 1, 2, 3].map((f) => `<span><i style="background:${FOLDER_COLORS[f]}"></i>${t("fd." + f)}</span>`).join("")}</div></div>`;
  }

  /* ---------- find ---------- */
  function search(qs) {
    const words = qs.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z]+/).filter((w) => w.length > 3);
    const score = (n) => words.reduce((s, w) => s + ((n.k || []).some((k) => w.startsWith(k.slice(0, 5)) || k.startsWith(w.slice(0, 5))) ? 3 : 0) + ((n.en[1] + n.es[1]).toLowerCase().includes(w.slice(0, 5)) ? 1 : 0), 0);
    const map = N.filter((n) => n.f === 0 && n.id !== "home").map((n) => ({ n, s: score(n) })).sort((a, b) => b.s - a.s)[0];
    if (!map || map.s === 0) return null;
    const dg = BY[linksOf(map.n).find((id) => BY[id].f === 4)];
    const notes = linksOf(dg).map((id) => ({ n: BY[id], s: score(BY[id]) + 2 - linksOf(dg).indexOf(id) * 0.3 })).sort((a, b) => b.s - a.s).slice(0, 2).map((x) => x.n);
    return { map: map.n, dg, notes };
  }
  let findT = [];
  function runFind(qs) {
    findT.forEach(clearTimeout); findT = [];
    S.find = qs; S.findRes = search(qs); S.findStep = 0; A.render();
    if (!S.findRes) return;
    [1, 2, 3].forEach((s, i) => findT.push(setTimeout(() => { S.findStep = s; const el = $("#flayers"); if (el) el.innerHTML = layers(); }, 350 + i * 600)));
  }
  function layers() {
    const r = S.findRes;
    if (!r) return S.find ? `<p class="sub">${t("fi.nomatch")}</p>` : "";
    const L3 = (k, label, files, extra) => `<div class="vt-layer${S.findStep >= k ? " on" : ""}"><div class="vt-lh"><span>0${k}</span><b>${label}</b></div>${S.findStep >= k ? files : ""}${extra || ""}</div>`;
    const file = (n) => `<a href="#/notes/${n.id}" class="vt-file"><i style="background:${FOLDER_COLORS[n.f]}"></i><span>${esc(title(n))}</span><em>${n.id}.md</em></a>`;
    const others = N.filter((n) => n.f === 0 && n.id !== r.map.id && n.id !== "home");
    return L3(1, t("fi.l1"), `${file(r.map)}${others.map((n) => `<span class="vt-file skip"><span>${esc(title(n))}</span><em>${t("fi.skip")}</em></span>`).join("")}`)
      + L3(2, t("fi.l2"), file(r.dg))
      + L3(3, t("fi.l3"), r.notes.map(file).join(""))
      + (S.findStep >= 3 ? `<div class="vt-cost"><b>${t("fi.cost", { n: 2 + r.notes.length })}</b><span>${t("fi.flat", { n: 214 })}</span></div>` : "");
  }
  function find() {
    return `<div class="page-head"><div><h1 data-i18n="fi.h"></h1><p data-i18n="fi.p"></p></div>${syncPill()}</div>
      <form class="vt-ask" id="fform"><input id="fq" value="${esc(S.find)}" placeholder="${t("fi.ph")}" autocomplete="off"><button class="btn btn-dark" type="submit">${t("fi.go")}</button></form>
      <div class="chips" style="margin:12px 0 18px">${[1, 2, 3].map((i) => `<button class="chip" type="button" data-fq="${i}">${t("fi.q" + i)}</button>`).join("")}</div>
      <div class="vt-layers" id="flayers">${layers()}</div>`;
  }

  /* ---------- wiring ---------- */
  const A = Kit.app({ nav: [{ id: "notes", key: "nav.notes", icon: "doc" }, { id: "graph", key: "nav.graph", icon: "pie" }, { id: "find", key: "nav.find", icon: "inbox" }], views: { notes, graph, find },
    parentOf: {} });

  const view = $("#view");
  view.addEventListener("click", (e) => {
    const el = (s) => e.target.closest(s);
    if (el("[data-sync]")) {
      const b = el("[data-sync]"); b.classList.add("busy"); b.querySelector("span").textContent = t("syncing");
      setTimeout(() => { S.syncM = 0; toast(t("synced", { n: N.length })); A.render(); }, 1100); return;
    }
    const fq = el("[data-fq]"); if (fq) return runFind(t("fi.q" + fq.dataset.fq));
  });
  view.addEventListener("submit", (e) => { if (e.target.id === "fform") { e.preventDefault(); runFind($("#fq").value); } });
  view.addEventListener("input", (e) => { if (e.target.id === "q") { S.q = e.target.value; const pos = e.target.selectionStart; A.render(); const q = $("#q"); q.focus(); q.setSelectionRange(pos, pos); } });

  // graph: hover highlights neighbours, click opens, drag moves
  let drag = null, moved = false;
  view.addEventListener("pointerover", (e) => { const g = e.target.closest("[data-node]"); if (g && !drag && S.hover !== g.dataset.node) { S.hover = g.dataset.node; repaintGraph(); } });
  view.addEventListener("pointerout", (e) => { const g = e.target.closest("[data-node]"); if (g && !drag && !e.relatedTarget?.closest?.("[data-node]")) { S.hover = null; repaintGraph(); } });
  view.addEventListener("pointerdown", (e) => { const g = e.target.closest("[data-node]"); if (g) { drag = g.dataset.node; moved = false; e.preventDefault(); } });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return; const svg = $("#gsvg"); if (!svg) return;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    P[drag].x = Math.max(20, Math.min(W - 20, p.x)); P[drag].y = Math.max(20, Math.min(H - 20, p.y)); moved = true; S.hover = drag; repaintGraph();
  });
  window.addEventListener("pointerup", () => { if (drag && !moved) location.hash = "#/notes/" + drag; drag = null; });
  function repaintGraph() { const s = $("#gsvg"); if (s) s.outerHTML = graphSvg(); }
})();
