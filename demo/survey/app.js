/* Field survey demo. A paper visitor questionnaire rebuilt as a guided phone form:
   validation at entry, skip logic, offline queue, and a dashboard that updates as answers land. */
(function () {
  const { t, F, esc, Chart, $, $$, toast, download, I18N } = Kit;

  I18N.add({
    en: {
      "sv.title": "Field survey · live demo", "sv.name": "Field survey", "sv.sub": "Visitor survey · 2026",
      "nav.form": "Survey", "nav.paper": "Paper vs tablet", "nav.data": "Responses",
      "tour.1": "Answer the survey on the phone. Try typing 300 nights and see what happens.", "tour.2": "Pick “Cruise ship” and notice which questions disappear.",
      "tour.3": "Switch the signal off, submit, then switch it back on and watch your answer sync into the dashboard.",
      "f.h": "Visitor survey", "f.p": "What an interviewer holds at the airport, and what the office sees at the same moment.",
      "ph.signal": "Signal", "ph.on": "Online", "ph.off": "No signal", "ph.simulate": "Simulate no signal",
      "ph.start": "Start the survey", "ph.intro": "Six short questions about your visit. It takes about a minute.", "ph.welcome": "Welcome to Coral Bay",
      "ph.next": "Next", "ph.back": "Back", "ph.submit": "Submit", "ph.review": "Check your answers", "ph.edit": "Edit",
      "ph.step": "Question {a} of {b}", "ph.skipped": "{n} question(s) skipped: they don't apply to this visitor.",
      "ph.sent": "Sent", "ph.sentP": "Your answers are already in the dashboard.", "ph.queued": "Saved on the device",
      "ph.queuedP": "No signal, so nothing is lost: {n} response(s) will send automatically when the signal returns.", "ph.another": "Start another interview",
      "ph.syncing": "Signal back. Sending {n} saved response(s)…", "ph.synced": "{n} response(s) synced to the dashboard.",
      "q.origin": "Where do you live?", "q.stay": "Where are you staying?", "q.nights": "How many nights are you staying?", "q.rating": "How would you rate where you're staying?",
      "q.spend": "What did you spend the most on?", "q.spendHint": "Pick up to three.", "q.daily": "Roughly how much does your group spend per day, not counting the room?", "q.comment": "Anything we could do better?",
      "q.optional": "Optional", "q.other": "Type the country", "q.nightsUnit": "nights", "q.notSay": "Prefer not to say", "q.commentPh": "Type here…",
      "o.US": "United States", "o.CA": "Canada", "o.NL": "Netherlands", "o.CO": "Colombia", "o.VE": "Venezuela", "o.UK": "United Kingdom", "o.OT": "Somewhere else",
      "s.hotel": "Hotel or resort", "s.rental": "Vacation rental", "s.family": "With friends or family", "s.cruise": "Cruise ship, day visit",
      "sp.dining": "Dining", "sp.tours": "Tours and activities", "sp.shopping": "Shopping", "sp.transport": "Transport", "sp.nightlife": "Nightlife",
      "v.pick": "Choose one to continue.", "v.nights": "That looks like a typo. Stays here are between 1 and 60 nights.", "v.whole": "Whole nights only, please.",
      "v.spend1": "Pick at least one.", "v.spend3": "Three at most. Unpick one first.", "v.daily": "That seems too high for one day. Please check the amount.", "v.number": "Enter an amount, or tick “Prefer not to say”.",
      "v.country": "Type the country name.",
      "db.live": "Live", "db.responses": "Responses", "db.nights": "Average stay", "db.rating": "Average rating", "db.daily": "Spend per day",
      "db.origin": "Where visitors live", "db.stay": "Where they stay", "db.spend": "What they spend most on", "db.ratings": "Ratings", "db.ratingsSub": "1 to 10, hotels and rentals",
      "db.latest": "Latest comments", "db.you": "You", "db.nightsU": "{n} nights",
      "pp.h": "Paper vs tablet", "pp.p": "The same questionnaire, before and after. The paper version is what produced the problems on the left.",
      "pp.paperT": "VISITOR QUESTIONNAIRE", "pp.paperS": "Please use block capitals. Tick one box only.",
      "pp.n1": "“2 weeks?” Is that 14 nights, or 13?", "pp.n2": "Two boxes ticked. Which one counts?", "pp.n3": "Cruise visitor answered the hotel question anyway",
      "pp.n4": "Can't be read, so it's left blank", "pp.n5": "Typed in by hand three weeks later",
      "pp.col": "", "pp.colP": "Paper", "pp.colT": "Tablet",
      "pp.r1": "Answers checked", "pp.r1p": "Weeks later, when someone types them in", "pp.r1t": "As they're entered, while the visitor is still there",
      "pp.r2": "Questions that don't apply", "pp.r2p": "Answered anyway, then cleaned out by hand", "pp.r2t": "Skipped automatically",
      "pp.r3": "Results visible", "pp.r3p": "After data entry and checking", "pp.r3t": "The moment the interview ends",
      "pp.r4": "No signal", "pp.r4p": "Not an issue, but nothing moves until the forms are collected", "pp.r4t": "Saved on the device, sent when the signal returns",
      "pp.r5": "Unreadable answers", "pp.r5p": "Lost", "pp.r5t": "Not possible",
      "rs.h": "Responses", "rs.p": "Every interview as a row, ready for analysis. Nothing to type in.", "rs.dl": "Download CSV",
      "rs.when": "When", "rs.origin": "Lives in", "rs.stay": "Staying", "rs.nights": "Nights", "rs.rating": "Rating", "rs.spend": "Spends most on", "rs.daily": "Per day", "rs.comment": "Comment",
      "rs.na": "n/a", "rs.ns": "not said", "rs.min": "{n} min ago", "rs.now": "just now",
    },
    es: {
      "sv.title": "Encuesta de campo · demo en vivo", "sv.name": "Encuesta de campo", "sv.sub": "Encuesta a visitantes · 2026",
      "nav.form": "Encuesta", "nav.paper": "Papel vs tablet", "nav.data": "Respuestas",
      "tour.1": "Responde la encuesta en el teléfono. Prueba escribir 300 noches y mira qué pasa.", "tour.2": "Elige “Crucero” y fíjate qué preguntas desaparecen.",
      "tour.3": "Apaga la señal, envía, luego vuelve a encenderla y mira tu respuesta sincronizarse con el panel.",
      "f.h": "Encuesta a visitantes", "f.p": "Lo que tiene el entrevistador en el aeropuerto, y lo que ve la oficina en el mismo momento.",
      "ph.signal": "Señal", "ph.on": "En línea", "ph.off": "Sin señal", "ph.simulate": "Simular sin señal",
      "ph.start": "Empezar la encuesta", "ph.intro": "Seis preguntas cortas sobre tu visita. Toma como un minuto.", "ph.welcome": "Bienvenido a Coral Bay",
      "ph.next": "Siguiente", "ph.back": "Atrás", "ph.submit": "Enviar", "ph.review": "Revisa tus respuestas", "ph.edit": "Editar",
      "ph.step": "Pregunta {a} de {b}", "ph.skipped": "{n} pregunta(s) omitida(s): no aplican a este visitante.",
      "ph.sent": "Enviado", "ph.sentP": "Tus respuestas ya están en el panel.", "ph.queued": "Guardado en el dispositivo",
      "ph.queuedP": "Sin señal, pero no se pierde nada: {n} respuesta(s) se enviarán solas cuando vuelva la señal.", "ph.another": "Empezar otra entrevista",
      "ph.syncing": "Volvió la señal. Enviando {n} respuesta(s) guardada(s)…", "ph.synced": "{n} respuesta(s) sincronizada(s) con el panel.",
      "q.origin": "¿Dónde vives?", "q.stay": "¿Dónde te estás quedando?", "q.nights": "¿Cuántas noches te quedas?", "q.rating": "¿Cómo calificas donde te estás quedando?",
      "q.spend": "¿En qué gastaste más?", "q.spendHint": "Elige hasta tres.", "q.daily": "Más o menos, ¿cuánto gasta tu grupo por día, sin contar el alojamiento?", "q.comment": "¿Algo que podamos mejorar?",
      "q.optional": "Opcional", "q.other": "Escribe el país", "q.nightsUnit": "noches", "q.notSay": "Prefiero no decir", "q.commentPh": "Escribe aquí…",
      "o.US": "Estados Unidos", "o.CA": "Canadá", "o.NL": "Países Bajos", "o.CO": "Colombia", "o.VE": "Venezuela", "o.UK": "Reino Unido", "o.OT": "Otro lugar",
      "s.hotel": "Hotel o resort", "s.rental": "Alquiler vacacional", "s.family": "Con amigos o familia", "s.cruise": "Crucero, de paso",
      "sp.dining": "Comida", "sp.tours": "Tours y actividades", "sp.shopping": "Compras", "sp.transport": "Transporte", "sp.nightlife": "Vida nocturna",
      "v.pick": "Elige una para continuar.", "v.nights": "Parece un error de tipeo. Las estadías aquí son de 1 a 60 noches.", "v.whole": "Solo noches completas, por favor.",
      "v.spend1": "Elige al menos una.", "v.spend3": "Máximo tres. Quita una primero.", "v.daily": "Parece demasiado para un día. Revisa el monto.", "v.number": "Escribe un monto, o marca “Prefiero no decir”.",
      "v.country": "Escribe el nombre del país.",
      "db.live": "En vivo", "db.responses": "Respuestas", "db.nights": "Estadía promedio", "db.rating": "Calificación promedio", "db.daily": "Gasto por día",
      "db.origin": "Dónde viven los visitantes", "db.stay": "Dónde se quedan", "db.spend": "En qué gastan más", "db.ratings": "Calificaciones", "db.ratingsSub": "1 a 10, hoteles y alquileres",
      "db.latest": "Últimos comentarios", "db.you": "Tú", "db.nightsU": "{n} noches",
      "pp.h": "Papel vs tablet", "pp.p": "El mismo cuestionario, antes y después. La versión en papel es la que causaba los problemas de la izquierda.",
      "pp.paperT": "CUESTIONARIO AL VISITANTE", "pp.paperS": "Use letra de molde. Marque una sola casilla.",
      "pp.n1": "“¿2 semanas?” ¿Son 14 noches, o 13?", "pp.n2": "Dos casillas marcadas. ¿Cuál cuenta?", "pp.n3": "Un pasajero de crucero respondió la pregunta del hotel igual",
      "pp.n4": "No se puede leer, así que queda en blanco", "pp.n5": "Transcrito a mano tres semanas después",
      "pp.col": "", "pp.colP": "Papel", "pp.colT": "Tablet",
      "pp.r1": "Respuestas verificadas", "pp.r1p": "Semanas después, cuando alguien las transcribe", "pp.r1t": "Al momento, con el visitante todavía presente",
      "pp.r2": "Preguntas que no aplican", "pp.r2p": "Se responden igual y se limpian a mano", "pp.r2t": "Se omiten automáticamente",
      "pp.r3": "Resultados visibles", "pp.r3p": "Después de transcribir y revisar", "pp.r3t": "En cuanto termina la entrevista",
      "pp.r4": "Sin señal", "pp.r4p": "No afecta, pero nada avanza hasta recoger los formularios", "pp.r4t": "Se guarda en el dispositivo y se envía al volver la señal",
      "pp.r5": "Respuestas ilegibles", "pp.r5p": "Se pierden", "pp.r5t": "Imposible",
      "rs.h": "Respuestas", "rs.p": "Cada entrevista como una fila, lista para analizar. Nada que transcribir.", "rs.dl": "Descargar CSV",
      "rs.when": "Cuándo", "rs.origin": "Vive en", "rs.stay": "Se queda en", "rs.nights": "Noches", "rs.rating": "Calif.", "rs.spend": "Gasta más en", "rs.daily": "Por día", "rs.comment": "Comentario",
      "rs.na": "n/a", "rs.ns": "no dijo", "rs.min": "hace {n} min", "rs.now": "ahora mismo",
    },
  });

  const ORIGINS = ["US", "CA", "NL", "CO", "VE", "UK", "OT"];
  const STAYS = ["hotel", "rental", "family", "cruise"];
  const SPENDS = ["dining", "tours", "shopping", "transport", "nightlife"];
  const COLORS = { hotel: "#0b7a55", rental: "#17b07f", family: "#c8a96a", cruise: "#8aa3bb" };
  const COMMENTS = {
    en: ["More shade at the beach would be great.", "Taxi prices weren't clear.", "Loved the food trucks!", "Signs to the national park were hard to follow.", "Friendliest airport staff anywhere.",
      "Wish the buses ran later.", "Too many cars downtown.", "Great snorkelling, more info on tours please.", "Everything was perfect.", "Wi-Fi at the port would help."],
    es: ["Más sombra en la playa sería genial.", "Los precios de taxi no eran claros.", "¡Nos encantaron los food trucks!", "Las señales al parque nacional eran difíciles de seguir.", "El personal del aeropuerto más amable.",
      "Ojalá los buses pasaran más tarde.", "Demasiados carros en el centro.", "Snorkel increíble, más información de tours por favor.", "Todo estuvo perfecto.", "Wi-Fi en el puerto ayudaría."],
  };

  /* seeded responses */
  function seed() {
    const R = Kit.rng(2026);
    const out = [];
    const ow = { US: 46, CA: 16, NL: 12, CO: 9, VE: 7, UK: 5, OT: 5 };
    const pickW = (w) => { let x = R() * Object.values(w).reduce((a, b) => a + b, 0); for (const k in w) { x -= w[k]; if (x <= 0) return k; } return Object.keys(w)[0]; };
    for (let i = 0; i < 236; i++) {
      const origin = pickW(ow);
      const stay = pickW({ hotel: 52, rental: 24, family: 9, cruise: 15 });
      const nights = stay === "cruise" ? null : Math.max(2, Math.min(28, Math.round(R.norm(stay === "family" ? 11 : 7, 3))));
      const rating = stay === "hotel" || stay === "rental" ? Math.max(3, Math.min(10, Math.round(R.norm(8.2, 1.3)))) : null;
      const sp = [...SPENDS].sort(() => R() - 0.5).slice(0, R.int(1, 3));
      if (stay === "cruise" && !sp.includes("shopping") && R() < 0.7) sp[0] = "shopping";
      const daily = R() < 0.12 ? null : Math.round(R.norm(stay === "cruise" ? 140 : 210, 70) / 5) * 5;
      const ci = R() < 0.28 ? R.int(0, COMMENTS.en.length - 1) : null;
      out.push({ id: i + 1, mins: 236 - i + R.int(0, 2), origin, stay, nights, rating, spend: sp, daily: daily && Math.max(20, daily), ci, comment: null, you: false });
    }
    return out.reverse(); // newest first
  }

  const S = { rows: seed(), online: true, queue: [], step: -1, a: fresh(), err: "", skippedNote: 0, done: null, flash: false };
  function fresh() { return { origin: null, other: "", stay: null, nights: "", rating: null, spend: [], daily: "", notSay: false, comment: "" }; }

  /* questions, with skip logic */
  const Q = [
    { id: "origin", show: () => true },
    { id: "stay", show: () => true },
    { id: "nights", show: (a) => a.stay !== "cruise" },
    { id: "rating", show: (a) => a.stay === "hotel" || a.stay === "rental" },
    { id: "spend", show: () => true },
    { id: "daily", show: () => true },
    { id: "comment", show: () => true },
  ];
  const visible = () => Q.filter((q) => q.show(S.a));

  function validate(id) {
    const a = S.a;
    if (id === "origin") { if (!a.origin) return "v.pick"; if (a.origin === "OT" && !a.other.trim()) return "v.country"; }
    if (id === "stay" && !a.stay) return "v.pick";
    if (id === "nights") { const n = Number(a.nights); if (a.nights === "" || !isFinite(n)) return "v.nights"; if (!Number.isInteger(n)) return "v.whole"; if (n < 1 || n > 60) return "v.nights"; }
    if (id === "rating" && !a.rating) return "v.pick";
    if (id === "spend" && !a.spend.length) return "v.spend1";
    if (id === "daily" && !a.notSay) { const n = Number(a.daily); if (a.daily === "" || !isFinite(n) || n < 0) return "v.number"; if (n > 3000) return "v.daily"; }
    return "";
  }

  /* ---------------- phone ---------------- */
  function opt(name, val, label, on) { return `<button type="button" class="opt${on ? " on" : ""}" data-set="${name}" data-val="${val}">${label}</button>`; }

  function question(q) {
    const a = S.a;
    switch (q.id) {
      case "origin": return `<p class="q">${t("q.origin")}</p><div class="opts">${ORIGINS.map((o) => opt("origin", o, t("o." + o), a.origin === o)).join("")}</div>
        ${a.origin === "OT" ? `<input class="ph-in" id="other" value="${esc(a.other)}" placeholder="${t("q.other")}" autocomplete="off">` : ""}`;
      case "stay": return `<p class="q">${t("q.stay")}</p><div class="opts">${STAYS.map((s) => opt("stay", s, t("s." + s), a.stay === s)).join("")}</div>`;
      case "nights": return `<p class="q">${t("q.nights")}</p><div class="stepper"><button type="button" data-step="-1" aria-label="−">−</button>
        <input class="ph-in big" id="nights" inputmode="numeric" value="${esc(a.nights)}" placeholder="0" aria-label="${t("q.nights")}"><button type="button" data-step="1" aria-label="+">+</button></div><p class="unit">${t("q.nightsUnit")}</p>`;
      case "rating": return `<p class="q">${t("q.rating")}</p><div class="scale">${[...Array(10)].map((_, i) => `<button type="button" class="${a.rating === i + 1 ? "on" : ""}" data-set="rating" data-val="${i + 1}">${i + 1}</button>`).join("")}</div>
        <div class="scale-l"><span>😞</span><span>😍</span></div>`;
      case "spend": return `<p class="q">${t("q.spend")}</p><p class="qh">${t("q.spendHint")}</p><div class="opts">${SPENDS.map((s) => `<button type="button" class="opt multi${a.spend.includes(s) ? " on" : ""}" data-toggle="${s}">${t("sp." + s)}</button>`).join("")}</div>`;
      case "daily": return `<p class="q">${t("q.daily")}</p><div class="money"><span>$</span><input class="ph-in big" id="daily" inputmode="decimal" value="${esc(a.daily)}" ${a.notSay ? "disabled" : ""} placeholder="0" aria-label="${t("q.daily")}"></div>
        <label class="ph-check"><input type="checkbox" id="notSay" ${a.notSay ? "checked" : ""}> ${t("q.notSay")}</label>`;
      case "comment": return `<p class="q">${t("q.comment")}</p><p class="qh">${t("q.optional")}</p><textarea class="ph-in" id="comment" rows="4" placeholder="${t("q.commentPh")}">${esc(a.comment)}</textarea>`;
    }
  }

  function answerText(id) {
    const a = S.a;
    if (id === "origin") return a.origin === "OT" ? a.other : t("o." + a.origin);
    if (id === "stay") return t("s." + a.stay);
    if (id === "nights") return t("db.nightsU", { n: a.nights });
    if (id === "rating") return a.rating + " / 10";
    if (id === "spend") return a.spend.map((s) => t("sp." + s)).join(", ");
    if (id === "daily") return a.notSay ? t("q.notSay") : F.money(Number(a.daily));
    if (id === "comment") return a.comment || "—";
  }

  function phone() {
    const vis = visible();
    let body;
    if (S.done) {
      const queued = S.done === "queued";
      body = `<div class="ph-done"><div class="done-mark${queued ? " q" : ""}">${queued ? "⏳" : "✓"}</div><h3>${t(queued ? "ph.queued" : "ph.sent")}</h3>
        <p>${queued ? t("ph.queuedP", { n: S.queue.length }) : t("ph.sentP")}</p><button class="ph-btn" type="button" data-again>${t("ph.another")}</button></div>`;
    } else if (S.step < 0) {
      body = `<div class="ph-intro"><div class="ph-logo">CB</div><h3>${t("ph.welcome")}</h3><p>${t("ph.intro")}</p><button class="ph-btn" type="button" data-next>${t("ph.start")}</button></div>`;
    } else if (S.step >= vis.length) {
      body = `<div class="ph-q"><p class="q">${t("ph.review")}</p><dl class="ph-rev">${vis.map((q, i) => `<div><dt>${t("q." + q.id)}</dt><dd>${esc(answerText(q.id))}</dd><button type="button" data-goto="${i}">${t("ph.edit")}</button></div>`).join("")}</dl></div>
        <div class="ph-nav"><button class="ph-ghost" type="button" data-prev>${t("ph.back")}</button><button class="ph-btn" type="button" data-submit>${t("ph.submit")}</button></div>`;
    } else {
      const q = vis[S.step];
      body = `<div class="ph-q"><div class="ph-prog">${vis.map((_, i) => `<i class="${i <= S.step ? "on" : ""}"></i>`).join("")}</div>
        <p class="ph-stepn">${t("ph.step", { a: S.step + 1, b: vis.length })}</p>${question(q)}
        ${S.err ? `<p class="ph-err" role="alert">${t(S.err)}</p>` : ""}
        ${S.skippedNote ? `<p class="ph-skip">${t("ph.skipped", { n: S.skippedNote })}</p>` : ""}</div>
        <div class="ph-nav"><button class="ph-ghost" type="button" data-prev>${t("ph.back")}</button><button class="ph-btn" type="button" data-next>${t("ph.next")}</button></div>`;
    }
    return `<div class="device"><div class="device-in">
        <div class="ph-status"><span>9:41</span><span class="sig ${S.online ? "" : "off"}">${S.online ? "●●●● 5G" : t("ph.off")}${S.queue.length ? ` · ${S.queue.length}⇡` : ""}</span></div>
        <div class="ph-body">${body}</div></div></div>
      <label class="sim"><span class="toggle" role="switch" aria-checked="${!S.online}" tabindex="0" data-signal><span></span></span>${t("ph.simulate")}</label>`;
  }

  /* ---------------- dashboard ---------------- */
  function dash() {
    const rows = S.rows;
    const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
    const nights = rows.map((r) => r.nights).filter((x) => x != null), rating = rows.map((r) => r.rating).filter((x) => x != null), daily = rows.map((r) => r.daily).filter((x) => x != null);
    const you = rows.find((r) => r.you && r.fresh);
    const oc = {}; rows.forEach((r) => { const k = r.origin === "OT" ? "OT" : r.origin; oc[k] = (oc[k] || 0) + 1; });
    const sc = {}; rows.forEach((r) => { sc[r.stay] = (sc[r.stay] || 0) + 1; });
    const pc = {}; rows.forEach((r) => r.spend.forEach((s) => { pc[s] = (pc[s] || 0) + 1; }));
    const rc = [...Array(10)].map((_, i) => rows.filter((r) => r.rating === i + 1).length);
    const comments = rows.filter((r) => r.ci != null || r.comment).slice(0, 5);
    const youMark = (cond) => (cond ? `<span class="you">${t("db.you")}</span>` : "");
    return `<div class="dash-head"><span class="live"><i></i>${t("db.live")}</span></div>
      <div class="grid g-4 dash-kpis">
        <div class="card kpi${S.flash ? " flash" : ""}"><div class="lab">${t("db.responses")}</div><div class="val">${F.num(rows.length)}</div></div>
        <div class="card kpi"><div class="lab">${t("db.nights")}</div><div class="val">${F.num(avg(nights), 1)}</div></div>
        <div class="card kpi"><div class="lab">${t("db.rating")}</div><div class="val">${F.num(avg(rating), 1)}</div></div>
        <div class="card kpi"><div class="lab">${t("db.daily")}</div><div class="val">${F.money(avg(daily))}</div></div>
      </div>
      <div class="grid g-2 mt">
        <div class="card"><h3>${t("db.origin")}</h3><p class="sub">&nbsp;</p>${Chart.hbars(ORIGINS.map((o) => ({ label: t("o." + o), value: oc[o] || 0, active: you && you.origin === o, color: "#0b7a55" })).sort((a, b) => b.value - a.value))}</div>
        <div class="card"><h3>${t("db.stay")}</h3><p class="sub">&nbsp;</p><div class="donut-row">${Chart.donut(STAYS.map((s) => ({ id: s, label: t("s." + s), value: sc[s] || 0, color: COLORS[s] })), { center: F.num(rows.length), sub: t("db.responses"), thin: true })}
          <div class="legend">${STAYS.map((s) => `<button type="button" tabindex="-1"><i style="background:${COLORS[s]}"></i><span>${t("s." + s)}${youMark(you && you.stay === s)}</span><span>${F.pct(((sc[s] || 0) / rows.length) * 100, 0)}</span></button>`).join("")}</div></div></div>
        <div class="card"><h3>${t("db.spend")}</h3><p class="sub">&nbsp;</p>${Chart.hbars(SPENDS.map((s) => ({ label: t("sp." + s), value: pc[s] || 0, active: you && you.spend.includes(s), color: "#2b2b2b" })).sort((a, b) => b.value - a.value))}</div>
        <div class="card"><h3>${t("db.ratings")}</h3><p class="sub">${t("db.ratingsSub")}</p>${Chart.bars(rc.map((_, i) => String(i + 1)), [{ key: "n", label: t("db.responses"), color: "#17b07f", values: rc }], { h: 180, selected: you && you.rating ? [you.rating - 1] : null })}</div>
      </div>
      <div class="card mt"><h3>${t("db.latest")}</h3><ul class="comments">${comments.map((r) => `<li class="${r.you ? "mine" : ""}"><span class="who">${r.origin === "OT" ? esc(r.otherName || t("o.OT")) : t("o." + r.origin)} · ${t("s." + r.stay)}${youMark(r.you)}</span>${esc(r.comment || COMMENTS[I18N.lang][r.ci])}</li>`).join("")}</ul></div>`;
  }

  function form() {
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      <div class="page-head"><div><h1 data-i18n="f.h"></h1><p data-i18n="f.p"></p></div></div>
      <div class="sv"><div class="sv-phone" id="phone">${phone()}</div><div class="sv-dash" id="dash">${dash()}</div></div>`;
  }

  function paper() {
    const box = (on, two) => `<span class="pbox${on ? " x" : ""}${two ? " x2" : ""}"></span>`;
    return `<div class="page-head"><div><h1 data-i18n="pp.h"></h1><p data-i18n="pp.p"></p></div></div>
      <div class="grid g-pp">
        <div class="paper-wrap"><div class="paper">
          <p class="pt">${t("pp.paperT")}</p><p class="ps">${t("pp.paperS")}</p>
          <div class="pq"><b>1.</b> ${t("q.origin")} <span class="hand">U.S.A</span></div>
          <div class="pq"><b>2.</b> ${t("q.stay")}<div class="prow">${box(false)} ${t("s.hotel")} ${box(true)} ${t("s.rental")} ${box(true, true)} ${t("s.cruise")}</div><span class="note n2">${t("pp.n2")}</span></div>
          <div class="pq"><b>3.</b> ${t("q.nights")} <span class="hand">2 weeks?</span><span class="note n1">${t("pp.n1")}</span></div>
          <div class="pq"><b>4.</b> ${t("q.rating")} <span class="hand">9</span><span class="note n3">${t("pp.n3")}</span></div>
          <div class="pq"><b>5.</b> ${t("q.daily")} <span class="hand smudge">$ 1?0</span><span class="note n4">${t("pp.n4")}</span></div>
          <div class="stamp">${t("pp.n5")}</div>
        </div></div>
        <div class="card cmp"><table><thead><tr><th></th><th>${t("pp.colP")}</th><th>${t("pp.colT")}</th></tr></thead><tbody>
          ${[1, 2, 3, 4, 5].map((i) => `<tr><th>${t("pp.r" + i)}</th><td>${t("pp.r" + i + "p")}</td><td>${t("pp.r" + i + "t")}</td></tr>`).join("")}
        </tbody></table><a class="btn btn-dark" style="margin-top:20px" href="#/form" data-i18n="ph.start"></a></div>
      </div>`;
  }

  function data() {
    const cell = (v, na) => (v == null ? `<span class="blank">${na}</span>` : v);
    return `<div class="page-head"><div><h1 data-i18n="rs.h"></h1><p data-i18n="rs.p"></p></div><button class="btn btn-ghost btn-s" type="button" data-dl data-i18n="rs.dl"></button></div>
      <div class="tbl-wrap" style="max-height:70vh"><table class="tbl"><thead><tr><th>#</th><th>${t("rs.when")}</th><th>${t("rs.origin")}</th><th>${t("rs.stay")}</th><th class="r">${t("rs.nights")}</th><th class="r">${t("rs.rating")}</th><th>${t("rs.spend")}</th><th class="r">${t("rs.daily")}</th><th>${t("rs.comment")}</th></tr></thead>
      <tbody>${S.rows.map((r) => `<tr class="${r.you ? "mine" : ""}"><td class="mono">${r.id}${r.you ? ` <span class="you">${t("db.you")}</span>` : ""}</td><td>${r.mins <= 0 ? t("rs.now") : t("rs.min", { n: r.mins })}</td>
        <td>${r.origin === "OT" ? esc(r.otherName || t("o.OT")) : t("o." + r.origin)}</td><td>${t("s." + r.stay)}</td><td class="r">${cell(r.nights, t("rs.na"))}</td><td class="r">${cell(r.rating, t("rs.na"))}</td>
        <td>${r.spend.map((s) => t("sp." + s)).join(", ")}</td><td class="r">${r.daily == null ? `<span class="blank">${t("rs.ns")}</span>` : F.money(r.daily)}</td>
        <td class="cm">${esc(r.comment || (r.ci != null ? COMMENTS[I18N.lang][r.ci] : ""))}</td></tr>`).join("")}</tbody></table></div>`;
  }

  /* ---------------- behaviour ---------------- */
  const A = Kit.app({
    nav: [{ id: "form", key: "nav.form", icon: "phone" }, { id: "paper", key: "nav.paper", icon: "paper" }, { id: "data", key: "nav.data", icon: "table" }],
    views: { form, paper, data },
  });

  const redrawPhone = () => { const p = $("#phone"); if (p) { p.innerHTML = phone(); const f = p.querySelector("input.ph-in:not([disabled]), textarea"); if (f && !matchMedia("(pointer: coarse)").matches) f.focus({ preventScroll: true }); } };
  const redrawDash = () => { const d = $("#dash"); if (d) d.innerHTML = dash(); };

  function commit(entry, quiet) {
    entry.id = S.rows.length + 1; entry.mins = 0; entry.fresh = true;
    S.rows.forEach((r) => { r.fresh = false; });
    S.rows.unshift(entry);
    S.flash = true; redrawDash(); setTimeout(() => { S.flash = false; }, 1200);
    if (!quiet) A.refreshNav();
  }

  function submit() {
    const a = S.a, vis = visible().map((q) => q.id);
    const entry = { origin: a.origin, otherName: a.origin === "OT" ? a.other.trim() : null, stay: a.stay, nights: vis.includes("nights") ? Number(a.nights) : null,
      rating: vis.includes("rating") ? a.rating : null, spend: [...a.spend], daily: a.notSay ? null : Number(a.daily), ci: null, comment: a.comment.trim() || null, you: true };
    if (S.online) { commit(entry); S.done = "sent"; }
    else { S.queue.push(entry); S.done = "queued"; }
    redrawPhone();
  }

  function go(delta) {
    const vis = visible();
    if (delta > 0 && S.step >= 0 && S.step < vis.length) {
      const e = validate(vis[S.step].id);
      if (e) { S.err = e; redrawPhone(); const er = $(".ph-err"); er && er.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], { duration: 260 }); return; }
    }
    const before = Q.length - vis.length;
    S.err = ""; S.skippedNote = 0;
    S.step = Math.max(-1, Math.min(vis.length, S.step + delta));
    // tell the interviewer when skip logic removed questions
    if (delta > 0 && vis[S.step - 1] && vis[S.step - 1].id === "stay" && before > 0) S.skippedNote = before;
    redrawPhone();
  }

  function setSignal(on) {
    S.online = on;
    if (on && S.queue.length) {
      const n = S.queue.length; toast(t("ph.syncing", { n }));
      setTimeout(() => { S.queue.splice(0).forEach((e) => commit(e, true)); A.refreshNav(); toast(t("ph.synced", { n })); if (S.done === "queued") S.done = "sent"; redrawPhone(); }, 1400);
    }
    redrawPhone();
  }

  const view = $("#view");
  view.addEventListener("click", (e) => {
    const el = (s) => e.target.closest(s);
    if (el("[data-signal]")) return setSignal(!S.online);
    if (el("[data-next]")) return go(1);
    if (el("[data-prev]")) return go(-1);
    if (el("[data-submit]")) return submit();
    if (el("[data-again]")) { S.a = fresh(); S.step = -1; S.done = null; S.err = ""; return redrawPhone(); }
    const gt = el("[data-goto]"); if (gt) { S.step = Number(gt.dataset.goto); return redrawPhone(); }
    const st = el("[data-step]"); if (st) { S.a.nights = String(Math.max(0, (Number(S.a.nights) || 0) + Number(st.dataset.step))); S.err = ""; return redrawPhone(); }
    const set = el("[data-set]");
    if (set) {
      const k = set.dataset.set, v = set.dataset.val;
      S.a[k] = k === "rating" ? Number(v) : v; S.err = "";
      if (k === "stay") { /* answers to questions that no longer apply are dropped */ if (v === "cruise") { S.a.nights = ""; S.a.rating = null; } if (v === "family") S.a.rating = null; }
      redrawPhone();
      if (k !== "origin" || v !== "OT") setTimeout(() => { if (S.a[k] === (k === "rating" ? Number(v) : v)) go(1); }, 260);
      return;
    }
    const tg = el("[data-toggle]");
    if (tg) {
      const s = tg.dataset.toggle, arr = S.a.spend;
      if (arr.includes(s)) arr.splice(arr.indexOf(s), 1);
      else if (arr.length >= 3) { S.err = "v.spend3"; return redrawPhone(); }
      else arr.push(s);
      S.err = ""; return redrawPhone();
    }
    if (el("[data-dl]")) {
      const head = "id,origin,stay,nights,rating,spend,daily_spend,comment";
      return download("visitor-survey.csv", head + "\n" + S.rows.map((r) => [r.id, r.origin === "OT" ? r.otherName || "Other" : r.origin, r.stay, r.nights ?? "", r.rating ?? "", r.spend.join("|"), r.daily ?? "", `"${(r.comment || (r.ci != null ? COMMENTS.en[r.ci] : "")).replace(/"/g, '""')}"`].join(",")).join("\n"));
    }
  });
  view.addEventListener("keydown", (e) => {
    if (e.target.matches("[data-signal]") && (e.key === " " || e.key === "Enter")) { e.preventDefault(); setSignal(!S.online); }
    if (e.key === "Enter" && e.target.matches("input.ph-in")) { e.preventDefault(); go(1); }
  });
  view.addEventListener("input", (e) => {
    const id = e.target.id;
    if (id === "nights" || id === "daily" || id === "comment" || id === "other") { S.a[id] = e.target.value; if (S.err) { S.err = ""; const er = $(".ph-err"); er && er.remove(); } }
  });
  view.addEventListener("change", (e) => { if (e.target.id === "notSay") { S.a.notSay = e.target.checked; if (S.a.notSay) S.a.daily = ""; S.err = ""; redrawPhone(); } });

  // a new interview lands from "another interviewer" now and then, so the dashboard feels alive
  setInterval(() => {
    if (document.hidden || !$("#dash")) return;
    const R = Kit.rng(Date.now() % 1e6);
    const stay = R.pick(["hotel", "hotel", "rental", "cruise", "family"]);
    const entry = { origin: R.pick(["US", "US", "US", "CA", "NL", "CO"]), stay, nights: stay === "cruise" ? null : R.int(3, 12), rating: stay === "hotel" || stay === "rental" ? R.int(7, 10) : null,
      spend: [R.pick(SPENDS)], daily: Math.round(R.int(120, 300) / 5) * 5, ci: R() < 0.4 ? R.int(0, 9) : null, comment: null, you: false };
    const keepFresh = S.rows.find((r) => r.fresh);
    commit(entry, true);
    if (keepFresh) { entry.fresh = false; keepFresh.fresh = true; redrawDash(); }
  }, 9000);
  setInterval(() => { S.rows.forEach((r) => { r.mins += 1; }); }, 60000);
})();
