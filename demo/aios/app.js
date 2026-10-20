/* AIOS demo. Two ideas made touchable:
   1. Memory: an assistant orients from a one-line-per-project MAP and one page, instead of scanning a disk.
   2. Rules: written once in a portable source, compiled into each AI tool's config, with checks that refuse a bad build.
   All projects, pages and rules here are invented. */
(function () {
  const { t, F, esc, $, $$, toast, I18N } = Kit;

  I18N.add({
    en: {
      "ai.title": "AIOS · live demo", "ai.name": "AI Operating System", "ai.sub": "Memory + rules",
      "nav.ask": "Ask", "nav.memory": "Memory", "nav.rules": "Rules",
      "tour.1": "Pick a question and watch how little the assistant has to read to answer it.", "tour.2": "In Memory, change a project's next step and rebuild the map.",
      "tour.3": "In Rules, type a vendor's name into a rule (try “ChatGPT”) and watch the build refuse.",
      "ask.h": "Ask your assistant", "ask.p": "Every answer starts from a map with one line per project, then one page. Nothing else is opened.",
      "ask.pick": "Pick a question", "ask.compare": "Without a memory layer", "ask.with": "With AIOS",
      "ask.scan": "Scanning the workspace to find context…", "ask.files": "{n} files opened", "ask.mb": "{n} MB read", "ask.time": "{s} s",
      "ask.read": "Read", "ask.s1": "Read the map", "ask.s1d": "One line per project. The match is found by name, status and date.",
      "ask.s2": "Open one page", "ask.s2d": "The project's own page: where it lives, what's next, what's blocked.",
      "ask.s2skip": "Not needed: the map already has every date.",
      "ask.s3": "Apply standing rules", "ask.s3d": "Corrections made once, applied every time.", "ask.s4": "Answer",
      "ask.cost": "{f} file(s) · {k} KB · {s} s", "ask.vs": "vs {n} files by scanning",
      "q1": "Where did we leave the website redesign?", "q2": "What's blocking the grant report?", "q3": "Draft this week's update for the bakery client.", "q4": "Which projects haven't moved in 30 days?",
      "a1": "The homepage was approved on 14 October. Next step: send the pricing page to Ana for copy review. Nothing is blocking it.",
      "a2": "It's waiting on the finance export from Marco, requested 9 October: 10 days ago, so a follow-up is due today. Sections 1 to 3 are drafted.",
      "a3": "Hi Elena, quick update on the dashboard. The November figures are in, and the review queue is down to 4 transactions. Next week: the supplier breakdown you asked for. Juan",
      "a4": "Two: the inventory sync (last touched 2 September) and the Dutch course (28 August). Everything else moved this month.",
      "mem.h": "Memory", "mem.p": "The map is generated from the pages. Edit a page, rebuild, and the map follows. Nobody edits the map by hand.",
      "mem.map": "MAP.md", "mem.gen": "Generated {d} · {n} projects · {r} rules", "mem.page": "projects/{n}.md", "mem.next": "Next action", "mem.status": "Status", "mem.loc": "Location", "mem.upd": "Updated",
      "mem.rebuild": "Rebuild the map", "mem.rebuilt": "Map rebuilt: {n} line(s) changed.", "mem.dirty": "This page changed. The map is out of date until you rebuild.", "mem.pickP": "Pick a project on the map to open its page.",
      "ru.h": "Rules", "ru.p": "Written once in the source on the left. Compiled into the file each AI tool reads on the right.", "ru.src": "Source · rules.md", "ru.add": "Add a rule",
      "ru.out": "Generated", "ru.checks": "Build checks", "ru.ok": "Build passed: {n} files generated.", "ru.fail": "Build refused. Nothing was written.",
      "ck.sync": "Every generated file matches the source", "ck.head": "Section headings line up across targets", "ck.enc": "Spanish characters survive (ñ, á, é)", "ck.vendor": "No vendor name inside portable rules",
      "ck.syncBad": "{f} was edited by hand", "ck.vendorBad": "Rule {n} names “{v}”", "ck.encBad": "Rule {n} has a broken character",
      "ru.tamper": "Edit {f} by hand", "ru.archive": "Archive the edit and regenerate", "ru.archived": "Hand edit archived to _archive/. {f} regenerated from source.",
      "ru.newRule": "New rule",
    },
    es: {
      "ai.title": "AIOS · demo en vivo", "ai.name": "Sistema operativo de IA", "ai.sub": "Memoria + reglas",
      "nav.ask": "Preguntar", "nav.memory": "Memoria", "nav.rules": "Reglas",
      "tour.1": "Elige una pregunta y mira qué poco tiene que leer el asistente para responderla.", "tour.2": "En Memoria, cambia el siguiente paso de un proyecto y reconstruye el mapa.",
      "tour.3": "En Reglas, escribe el nombre de un proveedor en una regla (prueba “ChatGPT”) y mira cómo se rechaza la compilación.",
      "ask.h": "Pregúntale a tu asistente", "ask.p": "Cada respuesta empieza en un mapa con una línea por proyecto, luego una página. No se abre nada más.",
      "ask.pick": "Elige una pregunta", "ask.compare": "Sin capa de memoria", "ask.with": "Con AIOS",
      "ask.scan": "Revisando todo el espacio de trabajo para encontrar contexto…", "ask.files": "{n} archivos abiertos", "ask.mb": "{n} MB leídos", "ask.time": "{s} s",
      "ask.read": "Leer", "ask.s1": "Leer el mapa", "ask.s1d": "Una línea por proyecto. Se encuentra por nombre, estado y fecha.",
      "ask.s2": "Abrir una página", "ask.s2d": "La página del proyecto: dónde vive, qué sigue, qué lo bloquea.",
      "ask.s2skip": "No hace falta: el mapa ya tiene todas las fechas.",
      "ask.s3": "Aplicar reglas permanentes", "ask.s3d": "Correcciones hechas una vez, aplicadas siempre.", "ask.s4": "Responder",
      "ask.cost": "{f} archivo(s) · {k} KB · {s} s", "ask.vs": "vs {n} archivos revisando todo",
      "q1": "¿Dónde quedamos con el rediseño del sitio web?", "q2": "¿Qué está bloqueando el informe de la beca?", "q3": "Redacta la actualización de esta semana para la panadería.", "q4": "¿Qué proyectos no se han movido en 30 días?",
      "a1": "La página principal se aprobó el 14 de octubre. Siguiente paso: enviar la página de precios a Ana para revisión de texto. Nada lo bloquea.",
      "a2": "Espera la exportación de finanzas de Marco, pedida el 9 de octubre: hace 10 días, así que hoy toca dar seguimiento. Las secciones 1 a 3 están redactadas.",
      "a3": "Hola Elena, una actualización rápida del panel. Ya están las cifras de noviembre y la cola de revisión bajó a 4 transacciones. La próxima semana: el desglose por proveedor que pediste. Juan",
      "a4": "Dos: la sincronización de inventario (último cambio el 2 de septiembre) y el curso de neerlandés (28 de agosto). Todo lo demás se movió este mes.",
      "mem.h": "Memoria", "mem.p": "El mapa se genera a partir de las páginas. Edita una página, reconstruye, y el mapa la sigue. Nadie edita el mapa a mano.",
      "mem.map": "MAP.md", "mem.gen": "Generado {d} · {n} proyectos · {r} reglas", "mem.page": "projects/{n}.md", "mem.next": "Siguiente acción", "mem.status": "Estado", "mem.loc": "Ubicación", "mem.upd": "Actualizado",
      "mem.rebuild": "Reconstruir el mapa", "mem.rebuilt": "Mapa reconstruido: {n} línea(s) cambiaron.", "mem.dirty": "Esta página cambió. El mapa está desactualizado hasta reconstruirlo.", "mem.pickP": "Elige un proyecto en el mapa para abrir su página.",
      "ru.h": "Reglas", "ru.p": "Escritas una sola vez en la fuente de la izquierda. Compiladas en el archivo que lee cada herramienta de IA a la derecha.", "ru.src": "Fuente · rules.md", "ru.add": "Agregar regla",
      "ru.out": "Generado", "ru.checks": "Verificaciones", "ru.ok": "Compilación correcta: {n} archivos generados.", "ru.fail": "Compilación rechazada. No se escribió nada.",
      "ck.sync": "Cada archivo generado coincide con la fuente", "ck.head": "Los títulos de sección coinciden entre destinos", "ck.enc": "Los caracteres en español sobreviven (ñ, á, é)", "ck.vendor": "Ningún nombre de proveedor en reglas portables",
      "ck.syncBad": "{f} fue editado a mano", "ck.vendorBad": "La regla {n} nombra “{v}”", "ck.encBad": "La regla {n} tiene un carácter dañado",
      "ru.tamper": "Editar {f} a mano", "ru.archive": "Archivar la edición y regenerar", "ru.archived": "Edición manual archivada en _archive/. {f} regenerado desde la fuente.",
      "ru.newRule": "Nueva regla",
    },
  });

  /* ---------- invented workspace ---------- */
  const DOMAINS = [
    { id: "clients", en: "Client work", es: "Trabajo con clientes", ps: ["website-redesign", "grant-report", "bakery-dashboard"] },
    { id: "ops", en: "Operations", es: "Operaciones", ps: ["invoicing", "inventory-sync", "hiring-pipeline"] },
    { id: "research", en: "Research", es: "Investigación", ps: ["market-study", "pricing-model"] },
    { id: "personal", en: "Personal", es: "Personal", ps: ["dutch-course", "reading-list"] },
  ];
  const P = {
    "website-redesign": { st: "🟢", sum: { en: "New site for Harbor Studio: homepage approved, pricing page in copy review", es: "Sitio nuevo para Harbor Studio: portada aprobada, página de precios en revisión" }, loc: "clients/harbor/site", upd: "2026-10-14", next: { en: "Send the pricing page to Ana for copy review", es: "Enviar la página de precios a Ana para revisión" }, q: 1 },
    "grant-report": { st: "🟡", sum: { en: "Annual report for the community grant: sections 1-3 drafted", es: "Informe anual de la beca comunitaria: secciones 1-3 redactadas" }, loc: "clients/grant-2026", upd: "2026-10-09", next: { en: "Waiting on the finance export from Marco (asked 9 Oct)", es: "Esperando la exportación de finanzas de Marco (pedida el 9 oct)" }, q: 2 },
    "bakery-dashboard": { st: "🟢", sum: { en: "Spend dashboard for Seaside Bakery, monthly refresh", es: "Panel de gastos de Seaside Bakery, actualización mensual" }, loc: "clients/seaside/dashboard", upd: "2026-10-17", next: { en: "Add the supplier breakdown Elena asked for", es: "Agregar el desglose por proveedor que pidió Elena" }, q: 3 },
    "invoicing": { st: "🟢", sum: { en: "Invoices generated from the time log", es: "Facturas generadas desde el registro de horas" }, loc: "ops/invoicing", upd: "2026-10-01", next: { en: "Send October invoices on the 1st", es: "Enviar las facturas de octubre el día 1" } },
    "inventory-sync": { st: "⚪", sum: { en: "Nightly stock sync between the shop and the sheet", es: "Sincronización nocturna de inventario entre la tienda y la hoja" }, loc: "ops/inventory", upd: "2026-09-02", next: { en: "Decide whether to keep it or retire it", es: "Decidir si mantenerla o retirarla" } },
    "hiring-pipeline": { st: "🟢", sum: { en: "Shortlisting for the part-time analyst role", es: "Preselección para el puesto de analista a medio tiempo" }, loc: "ops/hiring", upd: "2026-10-11", next: { en: "Schedule two second interviews", es: "Agendar dos segundas entrevistas" } },
    "market-study": { st: "🟢", sum: { en: "Competitor pricing for the new service", es: "Precios de la competencia para el servicio nuevo" }, loc: "research/market", upd: "2026-10-06", next: { en: "Add three more competitors", es: "Agregar tres competidores más" } },
    "pricing-model": { st: "🟡", sum: { en: "Unit economics for the monthly plan", es: "Economía unitaria del plan mensual" }, loc: "research/pricing", upd: "2026-09-29", next: { en: "Check churn assumption against real data", es: "Contrastar el supuesto de abandono con datos reales" } },
    "dutch-course": { st: "⚪", sum: { en: "Evening course, unit 6 of 12", es: "Curso nocturno, unidad 6 de 12" }, loc: "personal/dutch", upd: "2026-08-28", next: { en: "Restart with unit 6", es: "Retomar en la unidad 6" } },
    "reading-list": { st: "🟢", sum: { en: "Books and papers, with one-line takeaways", es: "Libros y artículos, con una idea por línea" }, loc: "personal/reading", upd: "2026-10-15", next: { en: "Finish chapter 4", es: "Terminar el capítulo 4" } },
  };
  const RULES_MEM = [
    { id: "client-language", en: "Client deliverables: plain words, no internal jargon.", es: "Entregables a clientes: palabras simples, sin jerga interna.", q: [1, 3] },
    { id: "follow-up", en: "Follow up on any request after 7 days of silence.", es: "Dar seguimiento a toda solicitud tras 7 días sin respuesta.", q: [2] },
    { id: "short-emails", en: "Emails: short, plain, no formatting, signed Juan.", es: "Correos: cortos, simples, sin formato, firmados Juan.", q: [3] },
    { id: "dates", en: "Quote dates from the page, never from memory.", es: "Citar fechas de la página, nunca de memoria.", q: [1, 2, 4] },
  ];

  const S = { q: null, step: 0, typed: "", scan: { f: 0, mb: 0 }, page: "website-redesign", dirty: new Set(), mapSnap: null, flash: new Set(),
    rules: null, target: "AGENTS.md", tampered: null };
  S.rules = () => S._rules || (S._rules = [
    { en: "Answer in the language the question was asked in.", es: "Responde en el idioma en que se hizo la pregunta." },
    { en: "Never delete a file. Propose the change and let a person apply it.", es: "Nunca borres un archivo. Propón el cambio y deja que una persona lo aplique." },
    { en: "Every figure cites the file it came from.", es: "Cada cifra cita el archivo del que salió." },
    { en: "Write Spanish text as UTF-8 so ñ and á survive.", es: "Escribe el texto en español en UTF-8 para que ñ y á sobrevivan." },
  ]);
  const L = () => I18N.lang;
  const mapLine = (n) => { const p = P[n]; return `- ${p.st} **${n}** — ${p.sum[L()]} · \`${p.loc}\` · ${p.upd}`; };
  const snapshot = () => Object.fromEntries(Object.keys(P).map((n) => [n, { line: mapLine(n), next: P[n].next[L()] }]));
  S.mapSnap = snapshot();

  /* ---------- ASK ---------- */
  const QUESTIONS = [1, 2, 3, 4];
  const projOf = (q) => Object.keys(P).find((n) => P[n].q === q);
  let timers = [];
  function ask(q) {
    timers.forEach(clearTimeout); timers = [];
    S.q = q; S.step = 0; S.typed = ""; S.scan = { f: 0, mb: 0 };
    A.render();
    const T = (ms, fn) => timers.push(setTimeout(fn, ms));
    // the scanning side keeps counting while the memory side finishes in a few beats
    let f = 0; const scanInt = setInterval(() => { f += 97 + Math.floor(Math.random() * 60); S.scan = { f: Math.min(f, 4212), mb: Math.min(38.6, f / 109) }; const el = $("#scan"); if (el) el.innerHTML = scanHtml(); if (f >= 4212) clearInterval(scanInt); }, 60);
    timers.push(scanInt);
    [1, 2, 3, 4].forEach((s, i) => T(450 + i * 700, () => { S.step = s; paintAsk(); }));
    T(450 + 3 * 700 + 50, () => {
      const full = t("a" + q); let i = 0;
      const ty = setInterval(() => { i += 3; S.typed = full.slice(0, i); const a = $("#answer"); if (a) a.textContent = S.typed; if (i >= full.length) clearInterval(ty); }, 18);
      timers.push(ty);
    });
  }
  function scanHtml() { return `<b>${t("ask.files", { n: F.num(S.scan.f) })}</b><span>${t("ask.mb", { n: F.num(S.scan.mb, 1) })}</span><i style="width:${(S.scan.f / 4212) * 100}%"></i>`; }

  function mapPreview(hit) {
    return `<pre class="ai-file">${DOMAINS.map((d) => `<span class="h">## ${d[L()]}</span>\n${d.ps.map((n) => `<span class="${hit === "all" || hit === n ? "hit" : ""}${hit === "all" && P[n].upd < "2026-09-19" ? " old" : ""}">${esc(mapLine(n))}</span>`).join("\n")}`).join("\n")}</pre>`;
  }
  function pagePreview(n) {
    const p = P[n];
    return `<pre class="ai-file">---\nname: ${n}\nstatus: active\nlocation: "${p.loc}"\nupdated: ${p.upd}\n<span class="hit">next_action: "${esc(p.next[L()])}"</span>\n---\n\n# ${n}\n${esc(p.sum[L()])}.</pre>`;
  }

  function paintAsk() { const r = $("#run"); if (r) r.innerHTML = runHtml(); }
  function runHtml() {
    if (!S.q) return `<div class="ai-empty">${t("ask.pick")}</div>`;
    const n = projOf(S.q), only = S.q === 4;
    const rules = RULES_MEM.filter((r) => r.q.includes(S.q));
    const st = (k) => (S.step > k ? "done" : S.step === k ? "now" : "wait");
    const kb = only ? 2.4 : 3.1;
    return `<ol class="ai-steps">
      <li class="${st(1)}"><div class="ai-sh"><b>1 · ${t("ask.s1")}</b><span>MAP.md</span></div><p>${t("ask.s1d")}</p>${S.step >= 1 ? mapPreview(only ? "all" : n) : ""}</li>
      <li class="${st(2)}"><div class="ai-sh"><b>2 · ${t("ask.s2")}</b><span>${only ? "—" : `projects/${n}.md`}</span></div><p>${only ? t("ask.s2skip") : t("ask.s2d")}</p>${S.step >= 2 && !only ? pagePreview(n) : ""}</li>
      <li class="${st(3)}"><div class="ai-sh"><b>3 · ${t("ask.s3")}</b><span>rules/</span></div><p>${t("ask.s3d")}</p>${S.step >= 3 ? `<ul class="ai-rules">${rules.map((r) => `<li><code>${r.id}</code> ${esc(r[L()])}</li>`).join("")}</ul>` : ""}</li>
      <li class="${st(4)}"><div class="ai-sh"><b>4 · ${t("ask.s4")}</b><span>${S.step >= 4 ? t("ask.cost", { f: only ? 1 : 2, k: F.num(kb, 1), s: F.num(only ? 0.3 : 0.4, 1) }) : ""}</span></div>
        ${S.step >= 4 ? `<div class="ai-answer"><p id="answer">${esc(S.typed)}</p></div>` : ""}</li></ol>`;
  }

  function askView() {
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      <div class="page-head"><div><h1 data-i18n="ask.h"></h1><p data-i18n="ask.p"></p></div></div>
      <div class="ai-qs">${QUESTIONS.map((q) => `<button type="button" class="ai-q${S.q === q ? " on" : ""}" data-q="${q}"><span>“</span>${t("q" + q)}</button>`).join("")}</div>
      <div class="ai-ask">
        <section class="card ai-with"><div class="card-head"><h3>${t("ask.with")}</h3></div><div id="run">${runHtml()}</div></section>
        <section class="card ai-without"><div class="card-head"><h3>${t("ask.compare")}</h3></div>
          ${S.q ? `<p class="sub">${t("ask.scan")}</p><div class="ai-scan" id="scan">${scanHtml()}</div>` : `<p class="sub">—</p>`}
        </section>
      </div>`;
  }

  /* ---------- MEMORY ---------- */
  function memView() {
    const p = P[S.page];
    return `<div class="page-head"><div><h1 data-i18n="mem.h"></h1><p data-i18n="mem.p"></p></div>
      <button class="btn ${S.dirty.size ? "btn-accent" : "btn-ghost"} btn-s" type="button" data-rebuild>${t("mem.rebuild")}</button></div>
      <div class="ai-mem">
        <section class="card"><div class="card-head"><h3 class="mono">${t("mem.map")}</h3><span class="sub" style="margin:0">${t("mem.gen", { d: "2026-10-19", n: Object.keys(P).length, r: RULES_MEM.length })}</span></div>
          <div class="ai-map">${DOMAINS.map((d) => `<p class="dh">## ${d[L()]}</p>${d.ps.map((n) => {
            const snap = S.mapSnap[n];
            return `<button type="button" class="ai-line${n === S.page ? " on" : ""}${S.flash.has(n) ? " flash" : ""}" data-page="${n}"><span>${P[n].st} <b>${n}</b> — ${esc(snap.line.split(" — ")[1].split(" · `")[0])}</span><em>⏭ ${esc(snap.next)}</em></button>`;
          }).join("")}`).join("")}</div></section>
        <section class="card ai-page"><div class="card-head"><h3 class="mono">${t("mem.page", { n: S.page })}</h3></div>
          ${S.dirty.size ? `<p class="ai-dirty">${t("mem.dirty")}</p>` : ""}
          <dl class="ai-fm">
            <div><dt>${t("mem.status")}</dt><dd>${p.st} active</dd></div>
            <div><dt>${t("mem.loc")}</dt><dd class="mono">${esc(p.loc)}</dd></div>
            <div><dt>${t("mem.upd")}</dt><dd class="mono">${p.upd}</dd></div>
            <div class="full"><dt>${t("mem.next")}</dt><dd><textarea id="next" rows="2">${esc(p.next[L()])}</textarea></dd></div>
          </dl>
          <p class="ai-body">${esc(p.sum[L()])}.</p>
        </section>
      </div>`;
  }

  /* ---------- RULES ---------- */
  const VENDORS = ["ChatGPT", "OpenAI", "GPT", "Claude", "Anthropic", "Gemini", "Google", "Codex", "Copilot"];
  const TARGETS = { "AGENTS.md": "codex", "CLAUDE.md": "claude", "GEMINI.md": "gemini", "chat.txt": "chat" };
  function compile(target) {
    const rules = S.rules().map((r) => r[L()]);
    const head = { "AGENTS.md": "# AGENTS.md · operating rules", "CLAUDE.md": "# CLAUDE.md · operating rules", "GEMINI.md": "# GEMINI.md · operating rules", "chat.txt": "OPERATING RULES (paste at the start of any chat)" }[target];
    const note = { "AGENTS.md": "<!-- generated from rules.md · do not edit -->", "CLAUDE.md": "<!-- generated from rules.md · do not edit -->", "GEMINI.md": "<!-- generated from rules.md · do not edit -->", "chat.txt": "" }[target];
    const runtime = { "AGENTS.md": "## Runtime notes\n- Runs in a sandbox: ask before network access.", "CLAUDE.md": "## Runtime notes\n- Use plan mode for anything non-trivial.", "GEMINI.md": "## Runtime notes\n- Prefer the built-in file tools over shell.", "chat.txt": "" }[target];
    const body = target === "chat.txt" ? rules.map((r, i) => `${i + 1}. ${r}`).join("\n") : "## Rules\n" + rules.map((r) => `- ${r}`).join("\n");
    return [note, head, "", body, runtime ? "\n" + runtime : ""].filter((x, i) => x !== "" || i === 2).join("\n");
  }
  function checks() {
    const rules = S.rules().map((r) => r[L()]);
    const vendor = rules.map((r, i) => ({ i, v: VENDORS.find((v) => new RegExp(`\\b${v}\\b`, "i").test(r)) })).find((x) => x.v);
    const enc = rules.findIndex((r) => /�|Ã±|Ã¡|Ã©/.test(r));
    return [
      { k: "ck.sync", ok: !S.tampered, bad: S.tampered && t("ck.syncBad", { f: S.tampered }) },
      { k: "ck.head", ok: true },
      { k: "ck.enc", ok: enc < 0, bad: enc >= 0 && t("ck.encBad", { n: enc + 1 }) },
      { k: "ck.vendor", ok: !vendor, bad: vendor && t("ck.vendorBad", { n: vendor.i + 1, v: vendor.v }) },
    ];
  }
  function rulesView() {
    const cs = checks(), pass = cs.every((c) => c.ok);
    const out = S.tampered === S.target ? compile(S.target) + "\n- (added by hand) Always use bullet points." : compile(S.target);
    return `<div class="page-head"><div><h1 data-i18n="ru.h"></h1><p data-i18n="ru.p"></p></div></div>
      <div class="ai-rules-grid">
        <section class="card"><div class="card-head"><h3 class="mono">${t("ru.src")}</h3><button class="btn btn-ghost btn-s" type="button" data-addrule>+ ${t("ru.add")}</button></div>
          <ol class="ai-src">${S.rules().map((r, i) => `<li><textarea data-rule="${i}" rows="2" spellcheck="false">${esc(r[L()])}</textarea><button type="button" class="x" data-delrule="${i}" aria-label="×">×</button></li>`).join("")}</ol></section>
        <section class="card"><div class="card-head"><h3>${t("ru.out")}</h3>
          <div class="chips">${Object.keys(TARGETS).map((f) => `<button class="chip" type="button" data-target="${f}" aria-pressed="${S.target === f}">${f}</button>`).join("")}</div></div>
          ${pass ? `<pre class="ai-file out" id="outfile">${esc(out)}</pre>` : `<pre class="ai-file out refused">${t("ru.fail")}</pre>`}
          <div class="ai-tamper">${S.tampered ? `<button class="btn btn-accent btn-s" type="button" data-archive>${t("ru.archive")}</button>` : `<button class="btn btn-ghost btn-s" type="button" data-tamper>${t("ru.tamper", { f: S.target })}</button>`}</div>
        </section>
      </div>
      <section class="card mt"><h3>${t("ru.checks")}</h3><p class="sub ${pass ? "up" : "down"}" style="font-weight:600">${pass ? t("ru.ok", { n: Object.keys(TARGETS).length }) : t("ru.fail")}</p>
        <ul class="ai-checks">${cs.map((c) => `<li class="${c.ok ? "ok" : "bad"}"><i>${c.ok ? "✓" : "✕"}</i><span>${t(c.k)}${c.ok ? "" : ` <b>· ${esc(c.bad)}</b>`}</span></li>`).join("")}</ul></section>`;
  }

  /* ---------- wiring ---------- */
  const A = Kit.app({
    nav: [{ id: "ask", key: "nav.ask", icon: "inbox" }, { id: "memory", key: "nav.memory", icon: "doc", count: () => S.dirty.size }, { id: "rules", key: "nav.rules", icon: "list" }],
    views: { ask: askView, memory: memView, rules: rulesView },
  });
  I18N.onChange(() => { S.mapSnap = snapshot(); });

  const view = $("#view");
  view.addEventListener("click", (e) => {
    const el = (s) => e.target.closest(s);
    const q = el("[data-q]"); if (q) return ask(Number(q.dataset.q));
    const pg = el("[data-page]"); if (pg) { S.page = pg.dataset.page; return A.render(); }
    if (el("[data-rebuild]")) {
      const before = S.mapSnap; S.mapSnap = snapshot();
      const changed = Object.keys(P).filter((n) => before[n].next !== S.mapSnap[n].next || before[n].line !== S.mapSnap[n].line);
      S.flash = new Set(changed); S.dirty.clear(); toast(t("mem.rebuilt", { n: changed.length })); A.render(); setTimeout(() => { S.flash.clear(); }, 1500); return;
    }
    const tg = el("[data-target]"); if (tg) { S.target = tg.dataset.target; return A.render(); }
    if (el("[data-addrule]")) { S.rules().push({ en: t("ru.newRule"), es: t("ru.newRule") }); A.render(); const all = $$("[data-rule]"); all[all.length - 1].focus(); all[all.length - 1].select(); return; }
    const dr = el("[data-delrule]"); if (dr) { S.rules().splice(Number(dr.dataset.delrule), 1); return A.render(); }
    if (el("[data-tamper]")) { S.tampered = S.target; return A.render(); }
    if (el("[data-archive]")) { const f = S.tampered; S.tampered = null; toast(t("ru.archived", { f })); return A.render(); }
  });
  view.addEventListener("input", (e) => {
    if (e.target.id === "next") {
      P[S.page].next[L()] = e.target.value; P[S.page].upd = "2026-10-19";
      if (!S.dirty.has(S.page)) { S.dirty.add(S.page); const pos = e.target.selectionStart; A.render(); const n = $("#next"); n.focus(); n.setSelectionRange(pos, pos); }
    }
    if (e.target.dataset.rule != null) {
      S.rules()[Number(e.target.dataset.rule)][L()] = e.target.value;
      // repaint outputs and checks without losing the caret
      const pos = e.target.selectionStart, i = e.target.dataset.rule; A.render();
      const ta = $(`[data-rule="${i}"]`); ta.focus(); ta.setSelectionRange(pos, pos);
    }
  });
})();
