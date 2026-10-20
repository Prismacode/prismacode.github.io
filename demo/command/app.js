/* Command Center demo. One screen for every pipeline, agent, system and terminal.
   A small simulation runs the board: jobs progress, finish, hand off to the next in queue,
   or block until someone retries them. Everything is invented; nothing connects anywhere. */
(function () {
  const { t, F, esc, $, $$, toast, I18N } = Kit;

  I18N.add({
    en: {
      "cc.title": "Command Center · live demo", "cc.name": "Command Center", "cc.sub": "Command Center",
      "nav.cockpit": "Cockpit", "nav.term": "Terminal",
      "tour.1": "Watch the board run. Click any job to see its steps and log.", "tour.2": "A red job is blocked: open it and press Retry. The data node is offline: reconnect it.",
      "tour.3": "Open the terminal and type “help”, then try “run pipeline-zeta”.",
      "h.projects": "Projects", "h.active": "Active", "h.queued": "Queued", "h.blocked": "Blocked", "h.systems": "Systems", "h.uptime": "Uptime",
      "m.cockpit": "Cockpit", "m.board": "Board", "m.mini": "Mini",
      "b.title": "Mission board", "b.sum": "{a} active · {q} queued · {b} blocked",
      "g.pipeline": "System pipeline", "g.automation": "Automation queue", "g.workflow": "Data workflow", "g.vault": "Knowledge vault",
      "s.running": "running", "s.queued": "queued", "s.blocked": "blocked", "s.done": "done", "s.paused": "paused",
      "sy.title": "Systems", "sy.live": "Live", "sy.engine": "Automation engine", "sy.node": "Data node", "sy.knowledge": "Knowledge service",
      "sy.online": "Online", "sy.offline": "Offline", "sy.connecting": "Connecting…", "sy.health": "Health", "sy.lastsync": "Last sync", "sy.console": "Open console", "sy.reconnect": "Reconnect",
      "ag.title": "Agent ops", "ag.sessions": "{n} sessions",
      "tm.title": "Terminals", "tm.open": "Open full terminal",
      "dn.title": "Do now", "dn.1": "Review the vault-classify proposal", "dn.2": "Approve the weekly digest", "dn.3": "Rotate the data node credentials",
      "lf.title": "Log feed", "st.nominal": "All systems nominal", "st.attention": "{n} item(s) need attention", "st.diag": "Run diagnostics",
      "dr.steps": "Steps", "dr.log": "Recent log", "dr.pause": "Pause", "dr.resume": "Resume", "dr.retry": "Retry", "dr.close": "Close", "dr.progress": "Progress",
      "dr.blockedWhy": "Blocked: {r}", "t.retried": "{n} restarted.", "t.reconnected": "Data node back online.", "t.diag": "Diagnostics: {n} check(s) passed.",
      "term.hint": "Type “help” and press Enter.",
    },
    es: {
      "cc.title": "Command Center · demo en vivo", "cc.name": "Command Center", "cc.sub": "Centro de mando",
      "nav.cockpit": "Cabina", "nav.term": "Terminal",
      "tour.1": "Mira el tablero trabajar. Haz clic en cualquier tarea para ver sus pasos y su registro.", "tour.2": "Una tarea roja está bloqueada: ábrela y presiona Reintentar. El nodo de datos está fuera de línea: reconéctalo.",
      "tour.3": "Abre la terminal y escribe “help”, luego prueba “run pipeline-zeta”.",
      "h.projects": "Proyectos", "h.active": "Activas", "h.queued": "En cola", "h.blocked": "Bloqueadas", "h.systems": "Sistemas", "h.uptime": "Activo",
      "m.cockpit": "Cabina", "m.board": "Tablero", "m.mini": "Mini",
      "b.title": "Tablero de misión", "b.sum": "{a} activas · {q} en cola · {b} bloqueadas",
      "g.pipeline": "Pipeline del sistema", "g.automation": "Cola de automatización", "g.workflow": "Flujo de datos", "g.vault": "Bóveda de conocimiento",
      "s.running": "corriendo", "s.queued": "en cola", "s.blocked": "bloqueada", "s.done": "lista", "s.paused": "pausada",
      "sy.title": "Sistemas", "sy.live": "En vivo", "sy.engine": "Motor de automatización", "sy.node": "Nodo de datos", "sy.knowledge": "Servicio de conocimiento",
      "sy.online": "En línea", "sy.offline": "Fuera de línea", "sy.connecting": "Conectando…", "sy.health": "Salud", "sy.lastsync": "Última sincronía", "sy.console": "Abrir consola", "sy.reconnect": "Reconectar",
      "ag.title": "Agentes", "ag.sessions": "{n} sesiones",
      "tm.title": "Terminales", "tm.open": "Abrir terminal completa",
      "dn.title": "Hacer ya", "dn.1": "Revisar la propuesta de vault-classify", "dn.2": "Aprobar el resumen semanal", "dn.3": "Rotar las credenciales del nodo de datos",
      "lf.title": "Registro", "st.nominal": "Todos los sistemas normales", "st.attention": "{n} elemento(s) requieren atención", "st.diag": "Diagnóstico",
      "dr.steps": "Pasos", "dr.log": "Registro reciente", "dr.pause": "Pausar", "dr.resume": "Reanudar", "dr.retry": "Reintentar", "dr.close": "Cerrar", "dr.progress": "Progreso",
      "dr.blockedWhy": "Bloqueada: {r}", "t.retried": "{n} reiniciada.", "t.reconnected": "Nodo de datos en línea otra vez.", "t.diag": "Diagnóstico: {n} verificación(es) superadas.",
      "term.hint": "Escribe “help” y presiona Enter.",
    },
  });

  const GROUPS = {
    pipeline: ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"].map((x) => "pipeline-" + x),
    automation: ["core", "sync", "link", "scan"].map((x) => "automation-" + x),
    workflow: ["ingest", "prepare", "transform", "validate", "publish", "archive"].map((x) => "workflow-" + x),
    vault: ["index", "search", "embed", "classify", "summarize", "monitor"].map((x) => "vault-" + x),
  };
  const STEPS = ["fetch inputs", "check schema", "process batch", "verify totals", "write output", "notify"];
  const VERBS = ["processed batch", "verified checksum", "wrote", "indexed", "reconciled", "parsed", "cached", "compressed"];
  const OBJ = ["rows", "files", "records", "notes", "pages", "chunks"];
  const REASONS = ["source file missing", "schema changed upstream", "rate limit reached", "checksum mismatch"];
  const R = Kit.rng(42);

  const jobs = [];
  Object.entries(GROUPS).forEach(([g, names]) => names.forEach((n, i) => {
    const pick = R();
    const status = i === 0 || pick < 0.35 ? "running" : pick < 0.55 ? "blocked" : pick < 0.8 ? "queued" : "done";
    jobs.push({ name: n, group: g, status, p: status === "done" ? 100 : status === "queued" ? 0 : R.int(8, 70), speed: 0.6 + R() * 2.2,
      why: status === "blocked" ? R.pick(REASONS) : null, log: [], line: "" });
  }));
  jobs.forEach((j) => { j.line = lineFor(j); });

  const S = { mode: "cockpit", node: "offline", agents: [{ id: "agent-01", task: "drafting weekly digest", s: "running" }, { id: "agent-02", task: "reviewing vault-classify", s: "waiting" }, { id: "agent-03", task: "idle", s: "idle" }],
    feed: [], dn: [false, false, false], open: null, started: Date.now(), term: [], hist: [], hi: -1 };

  function lineFor(j) {
    if (j.status === "blocked") return `!! ${j.why}`;
    if (j.status === "queued") return `waiting for slot · position ${jobs.filter((x) => x.group === j.group && x.status === "queued").indexOf(j) + 1 || 1}`;
    if (j.status === "done") return `completed · ${F.num(R.int(400, 9000))} ${R.pick(OBJ)} · exit 0`;
    if (j.status === "paused") return "paused by operator";
    return `${R.pick(VERBS)} ${F.num(R.int(20, 4000))} ${R.pick(OBJ)} · step ${Math.min(6, Math.floor(j.p / 17) + 1)}/6`;
  }
  const now = () => new Date().toTimeString().slice(0, 8);
  function feed(txt, lvl = "") { S.feed.unshift({ at: now(), txt, lvl }); S.feed.length = Math.min(S.feed.length, 40); }

  const counts = () => ({ a: jobs.filter((j) => j.status === "running").length, q: jobs.filter((j) => j.status === "queued").length, b: jobs.filter((j) => j.status === "blocked").length });

  /* ---------- simulation ---------- */
  function step() {
    jobs.forEach((j) => {
      if (j.status !== "running") return;
      j.p = Math.min(100, j.p + j.speed * (0.5 + Math.random()));
      if (Math.random() < 0.35) j.line = lineFor(j);
      if (Math.random() < 0.004 && j.p < 90) { j.status = "blocked"; j.why = REASONS[Math.floor(Math.random() * REASONS.length)]; j.line = lineFor(j); feed(`${j.name} blocked: ${j.why}`, "err"); }
      if (j.p >= 100) {
        j.status = "done"; j.line = lineFor(j); feed(`${j.name} completed`, "ok");
        const next = jobs.find((x) => x.group === j.group && x.status === "queued");
        if (next) { next.status = "running"; next.p = 1; next.line = lineFor(next); feed(`${next.name} started`); }
        else { // keep the board alive: recycle the oldest finished job
          const old = jobs.find((x) => x.group === j.group && x.status === "done" && x !== j);
          if (old) { old.status = "queued"; old.p = 0; old.line = lineFor(old); }
        }
      }
    });
    if (Math.random() < 0.25) { const a = S.agents[Math.floor(Math.random() * 3)]; a.task = ["summarising 14 notes", "drafting weekly digest", "proposing 3 renames", "checking links", "reviewing vault-classify", "idle"][Math.floor(Math.random() * 6)]; a.s = a.task === "idle" ? "idle" : "running"; }
    paint();
  }

  /* ---------- rendering ---------- */
  const dot = (s) => `<i class="cc-dot ${s}"></i>`;
  const bar = (j) => `<span class="cc-bar"><i class="${j.status}" style="width:${Math.round(j.p)}%"></i></span>`;

  function header() {
    const c = counts(), up = Math.floor((Date.now() - S.started) / 1000) + 86400 * 3 + 3600 * 7;
    const uptime = `${Math.floor(up / 86400)}d ${String(Math.floor((up % 86400) / 3600)).padStart(2, "0")}:${String(Math.floor((up % 3600) / 60)).padStart(2, "0")}`;
    return `<header class="cc-head">
      <div class="cc-brand"><span class="radar"><i></i></span><div><b>A.I.O.S. <em>//</em> COMMAND CENTER</b>
        <div class="cc-modes">${["cockpit", "board", "mini"].map((m) => `<button type="button" data-mode="${m}" aria-pressed="${S.mode === m}">${t("m." + m)}</button>`).join("")}</div></div></div>
      <div class="cc-stats">
        <div><b>${jobs.length}</b><span>${t("h.projects")}</span></div>
        <div><b class="g">${c.a}</b><span>${t("h.active")}</span></div>
        <div><b class="y">${c.q}</b><span>${t("h.queued")}</span></div>
        <div><b class="r">${c.b}</b><span>${t("h.blocked")}</span></div>
        <div class="box"><b class="y">${S.node === "online" ? 3 : 2}/3</b><span>${t("h.systems")}</span></div>
        <div class="clock"><b id="clock">${now()}</b><span>${t("h.uptime")} ${uptime}</span></div>
      </div></header>`;
  }

  function board() {
    const c = counts();
    return `<section class="cc-panel cc-board"><div class="cc-ph"><h2>${t("b.title")}</h2><span>${t("b.sum", c)}</span></div>
      ${Object.keys(GROUPS).map((g) => {
        const js = jobs.filter((j) => j.group === g);
        const gc = { a: js.filter((j) => j.status === "running").length, q: js.filter((j) => j.status === "queued").length, b: js.filter((j) => j.status === "blocked").length };
        return `<div class="cc-group"><div class="cc-gh"><span>▾ ${t("g." + g)}</span><em>${t("b.sum", gc)}</em></div>
          ${js.map((j) => `<button type="button" class="cc-row ${j.status}${S.open === j.name ? " sel" : ""}" data-job="${j.name}">${dot(j.status)}<span class="nm">${j.name}</span>${bar(j)}<span class="ln">&gt;&gt; ${esc(j.line)}</span><span class="pc">${j.status === "running" ? Math.round(j.p) + "%" : t("s." + j.status)}</span></button>`).join("")}</div>`;
      }).join("")}</section>`;
  }

  function side() {
    const nodeOn = S.node === "online";
    return `<div class="cc-side">
      <section class="cc-panel"><div class="cc-ph"><h2>${t("sy.title")}</h2><span>${t("sy.live")}</span></div>
        <div class="cc-sys">${dot("running")}<b>${t("sy.engine")}</b><em>${t("sy.online")}</em><span class="hb">${t("sy.health")} 99.2%</span></div>
        <div class="cc-sys">${dot(nodeOn ? "running" : S.node === "connecting" ? "queued" : "blocked")}<b>${t("sy.node")}</b><em>${t("sy." + S.node)}</em><span class="hb">${t("sy.lastsync")} ${nodeOn ? now() : "--:--:--"}</span>
          ${nodeOn ? "" : `<button type="button" class="cc-btn warn" data-reconnect ${S.node === "connecting" ? "disabled" : ""}>${t("sy.reconnect")}</button>`}</div>
        <div class="cc-sys">${dot("running")}<b>${t("sy.knowledge")}</b><em>${t("sy.online")}</em><span class="hb">${t("sy.health")} 100%</span></div>
      </section>
      <section class="cc-panel"><div class="cc-ph"><h2>${t("ag.title")}</h2><span>${t("ag.sessions", { n: 3 })}</span></div>
        ${S.agents.map((a) => `<div class="cc-agent">${dot(a.s === "running" ? "running" : a.s === "waiting" ? "queued" : "idle")}<b>${a.id}</b><span>${esc(a.task)}</span></div>`).join("")}
      </section>
      <section class="cc-panel"><div class="cc-ph"><h2>${t("tm.title")}</h2><a class="cc-btn" href="#/term">${t("tm.open")}</a></div>
        <div class="cc-mini-term" data-focus-term>${termHtml(6)}<div class="cc-prompt"><span>aios@cockpit:~$</span><input class="cc-in" aria-label="terminal" placeholder="${t("term.hint")}" spellcheck="false" autocomplete="off"></div></div>
      </section></div>`;
  }

  function bottom() {
    const c = counts(), attention = c.b + (S.node === "online" ? 0 : 1);
    return `<div class="cc-bottom">
      <section class="cc-panel cc-dn"><h2>${t("dn.title")}</h2>${[1, 2, 3].map((i) => `<label class="${S.dn[i - 1] ? "done" : ""}"><input type="checkbox" data-dn="${i - 1}" ${S.dn[i - 1] ? "checked" : ""}><b>TASK-00${i}</b><span>${t("dn." + i)}</span></label>`).join("")}</section>
      <section class="cc-panel cc-status"><h2>${t(attention ? "st.attention" : "st.nominal", { n: attention })}</h2><button type="button" class="cc-btn" data-diag>${t("st.diag")}</button></section>
      <section class="cc-panel cc-feed"><h2>${t("lf.title")}</h2><ol>${S.feed.slice(0, 7).map((f) => `<li class="${f.lvl}"><span>${f.at}</span>${esc(f.txt)}</li>`).join("")}</ol></section></div>`;
  }

  function cockpit() {
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      <div class="cc mode-${S.mode}" id="cc">${header()}<div class="cc-main">${board()}${S.mode === "board" ? "" : side()}</div>${S.mode === "cockpit" ? bottom() : ""}</div>
      ${drawer()}`;
  }

  function drawer() {
    const j = jobs.find((x) => x.name === S.open);
    if (!j) return "";
    const cur = Math.min(5, Math.floor(j.p / 17));
    return `<aside class="cc-drawer" aria-label="${j.name}"><div class="cc-ph"><h2>${dot(j.status)} ${j.name}</h2><button type="button" class="cc-x" data-close aria-label="${t("dr.close")}">×</button></div>
      <p class="cc-st">${t("s." + j.status)}${j.why && j.status === "blocked" ? ` · ${t("dr.blockedWhy", { r: j.why })}` : ""}</p>
      <div class="cc-prog"><span>${t("dr.progress")}</span>${bar(j)}<b>${Math.round(j.p)}%</b></div>
      <h3>${t("dr.steps")}</h3><ol class="cc-steps">${STEPS.map((s, i) => `<li class="${j.status === "done" || i < cur ? "ok" : i === cur && j.status === "running" ? "now" : i === cur && j.status === "blocked" ? "err" : ""}">${s}</li>`).join("")}</ol>
      <h3>${t("dr.log")}</h3><ol class="cc-log">${S.feed.filter((f) => f.txt.startsWith(j.name)).slice(0, 5).map((f) => `<li><span>${f.at}</span>${esc(f.txt)}</li>`).join("") || `<li><span>${now()}</span>${esc(j.line)}</li>`}</ol>
      <div class="cc-acts">${j.status === "blocked" ? `<button type="button" class="cc-btn warn" data-retry="${j.name}">${t("dr.retry")}</button>` : ""}
        ${j.status === "running" ? `<button type="button" class="cc-btn" data-pause="${j.name}">${t("dr.pause")}</button>` : ""}
        ${j.status === "paused" ? `<button type="button" class="cc-btn" data-resume="${j.name}">${t("dr.resume")}</button>` : ""}</div>
    </aside>`;
  }

  /* ---------- terminal ---------- */
  function termHtml(n) { return `<div class="cc-out">${S.term.slice(-(n || 400)).map((l) => `<div class="${l.c || ""}">${l.h}</div>`).join("")}</div>`; }
  const out = (h, c) => S.term.push({ h, c });
  function exec(cmd) {
    out(`<span class="pr">aios@cockpit:~$</span> ${esc(cmd)}`);
    const [c, arg] = cmd.trim().split(/\s+/);
    const job = arg && jobs.find((j) => j.name === arg);
    const need = () => { out(`usage: ${c} &lt;job&gt;   e.g. ${c} pipeline-zeta`, "dim"); };
    switch ((c || "").toLowerCase()) {
      case "": break;
      case "help": out("commands: <b>status</b> · <b>ls</b> [group] · <b>run</b> &lt;job&gt; · <b>pause</b> &lt;job&gt; · <b>retry</b> &lt;job&gt; · <b>logs</b> &lt;job&gt; · <b>agents</b> · <b>whoami</b> · <b>date</b> · <b>clear</b>"); break;
      case "status": { const k = counts(); out(`<span class="g">${k.a} running</span> · <span class="y">${k.q} queued</span> · <span class="r">${k.b} blocked</span> · data node ${S.node}`); break; }
      case "ls": jobs.filter((j) => !arg || j.group === arg || j.name.startsWith(arg)).forEach((j) => out(`${j.name.padEnd(20, " ").replace(/ /g, "&nbsp;")} <span class="${{ running: "g", queued: "y", blocked: "r", done: "dim", paused: "y" }[j.status]}">${j.status}</span> ${Math.round(j.p)}%`)); break;
      case "run": if (!job) { need(); break; } job.status = "running"; job.p = Math.max(1, job.p % 100); job.why = null; job.line = lineFor(job); feed(`${job.name} started by operator`); out(`<span class="g">started ${job.name}</span>`); break;
      case "pause": if (!job) { need(); break; } job.status = "paused"; job.line = lineFor(job); feed(`${job.name} paused`); out(`paused ${job.name}`); break;
      case "retry": if (!job) { need(); break; } job.status = "running"; job.why = null; job.line = lineFor(job); feed(`${job.name} retried`, "ok"); out(`<span class="g">retrying ${job.name}</span>`); break;
      case "logs": if (!job) { need(); break; } (S.feed.filter((f) => f.txt.startsWith(job.name)).slice(0, 6).reverse()).forEach((f) => out(`<span class="dim">${f.at}</span> ${esc(f.txt)}`)); out(`<span class="dim">${now()}</span> ${esc(job.line)}`); break;
      case "agents": S.agents.forEach((a) => out(`${a.id} · ${esc(a.task)}`)); break;
      case "whoami": out("operator (demo session, read-only on real systems: there are none)"); break;
      case "date": out(new Date().toString()); break;
      case "clear": S.term = []; break;
      case "sudo": out('<span class="r">nice try.</span>'); break;
      default: out(`<span class="r">command not found:</span> ${esc(c)} · type <b>help</b>`);
    }
  }
  function termView() {
    return `<div class="cc mode-term">${header()}<section class="cc-panel cc-term" data-focus-term>${termHtml()}<div class="cc-prompt"><span>aios@cockpit:~$</span><input class="cc-in" aria-label="terminal" placeholder="${t("term.hint")}" spellcheck="false" autocomplete="off" autofocus></div></section></div>`;
  }

  /* ---------- wiring ---------- */
  const A = Kit.app({ nav: [{ id: "cockpit", key: "nav.cockpit", icon: "grid" }, { id: "term", key: "nav.term", icon: "list" }], views: { cockpit, term: termView },
    after: (id) => { if (id === "term") { const i = $(".cc-in"); i && i.focus(); const o = $(".cc-term .cc-out"); o && (o.scrollTop = o.scrollHeight); } } });

  // repaint only the live parts, so inputs keep focus and scroll stays put
  function paint() {
    const cc = $("#cc");
    if (cc) {
      const typing = document.activeElement && document.activeElement.classList.contains("cc-in") ? document.activeElement.value : null;
      cc.querySelector(".cc-head").outerHTML = header();
      cc.querySelector(".cc-board").outerHTML = board();
      const sd = cc.querySelector(".cc-side");
      if (sd) { sd.querySelectorAll(".cc-panel")[0].outerHTML = side().match(/<section class="cc-panel">[\s\S]*?<\/section>/)[0]; const ag = sd.querySelectorAll(".cc-panel")[1]; ag.outerHTML = side().match(/<section class="cc-panel">[\s\S]*?<\/section>/g)[1]; }
      const bt = cc.querySelector(".cc-bottom"); if (bt) bt.outerHTML = bottom();
      // swap the drawer's contents, not the element, so its entrance animation doesn't replay every tick
      const dr = $(".cc-drawer"); if (dr) { const tmp = document.createElement("div"); tmp.innerHTML = drawer(); const nd = tmp.firstElementChild; if (nd) dr.innerHTML = nd.innerHTML; else dr.remove(); }
      if (typing != null) { const i = $(".cc-in"); i.value = typing; i.focus(); }
      Kit.I18N.apply(cc);
    } else { const c = $("#clock"); if (c) c.textContent = now(); }
  }

  const view = $("#view");
  view.addEventListener("click", (e) => {
    const el = (s) => e.target.closest(s);
    const m = el("[data-mode]"); if (m) { S.mode = m.dataset.mode; return A.render(); }
    const j = el("[data-job]"); if (j) { S.open = S.open === j.dataset.job ? null : j.dataset.job; return A.render(); }
    if (el("[data-close]")) { S.open = null; return A.render(); }
    const rt = el("[data-retry]"); if (rt) { const x = jobs.find((y) => y.name === rt.dataset.retry); x.status = "running"; x.why = null; x.line = lineFor(x); feed(`${x.name} retried`, "ok"); toast(t("t.retried", { n: x.name })); return paint(); }
    const pa = el("[data-pause]"); if (pa) { const x = jobs.find((y) => y.name === pa.dataset.pause); x.status = "paused"; x.line = lineFor(x); feed(`${x.name} paused`); return paint(); }
    const rs = el("[data-resume]"); if (rs) { const x = jobs.find((y) => y.name === rs.dataset.resume); x.status = "running"; x.line = lineFor(x); feed(`${x.name} resumed`); return paint(); }
    if (el("[data-reconnect]")) { S.node = "connecting"; feed("data node: handshake…"); paint(); setTimeout(() => { S.node = "online"; feed("data node online · 1,204 records synced", "ok"); toast(t("t.reconnected")); paint(); }, 1600); return; }
    if (el("[data-diag]")) { const n = 12 + jobs.filter((x) => x.status !== "blocked").length; feed(`diagnostics: ${n} checks passed, ${counts().b} blocked job(s)`, counts().b ? "err" : "ok"); toast(t("t.diag", { n })); return paint(); }
    const ft = el("[data-focus-term]"); if (ft && !el("input")) { const i = ft.querySelector(".cc-in"); i && i.focus(); }
  });
  view.addEventListener("change", (e) => { if (e.target.dataset.dn != null) { S.dn[Number(e.target.dataset.dn)] = e.target.checked; paint(); } });
  view.addEventListener("keydown", (e) => {
    if (!e.target.classList.contains("cc-in")) return;
    if (e.key === "Enter") {
      const v = e.target.value; if (v.trim()) { S.hist.unshift(v); } S.hi = -1;
      exec(v); e.target.value = "";
      const term = e.target.closest("[data-focus-term]"); term.querySelector(".cc-out").outerHTML = termHtml(term.classList.contains("cc-term") ? 0 : 6);
      const o = term.querySelector(".cc-out"); o.scrollTop = o.scrollHeight;
      paint();
    }
    if (e.key === "ArrowUp" && S.hist.length) { e.preventDefault(); S.hi = Math.min(S.hist.length - 1, S.hi + 1); e.target.value = S.hist[S.hi]; }
    if (e.key === "ArrowDown") { e.preventDefault(); S.hi = Math.max(-1, S.hi - 1); e.target.value = S.hi < 0 ? "" : S.hist[S.hi]; }
  });

  out('<span class="g">AIOS command center</span> · demo build · every job here is simulated', "");
  out(`<span class="dim">${t("term.hint")}</span>`);
  feed("cockpit session opened", "ok"); feed("data node unreachable · last sync 02:14", "err");
  setInterval(() => { if (!document.hidden) step(); }, 1200);
})();
