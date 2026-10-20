/* Morning Brief demo. What ran overnight becomes one ~45-word voice note on the phone at 06:50.
   The voice is the browser's own speech synthesis, so it costs nothing and needs no server.
   Jobs, results and calendar are invented. */
(function () {
  const { t, F, esc, $, $$, toast, I18N } = Kit;

  I18N.add({
    en: {
      "mb.title": "Morning Brief · live demo", "mb.name": "Morning Brief", "mb.sub": "Delivered 06:50",
      "nav.brief": "06:50", "nav.night": "Overnight", "nav.how": "How it's built",
      "tour.1": "Tap the notification and play the voice note. It's 45 seconds at most.", "tour.2": "Open “Overnight” and make a job fail. Then recompose the brief and listen again.",
      "tour.3": "Change the length or the delivery time and see the note rewrite itself.",
      "ph.date": "Tuesday, 20 October", "ph.notif": "Morning brief", "ph.voice": "Voice note · {s}", "ph.now": "now", "ph.tap": "Tap to open",
      "ph.relay": "Relay", "ph.detail": "Detail note", "ph.play": "Play", "ph.pause": "Pause", "ph.noVoice": "This browser has no speech voice, so the note plays as text.",
      "br.h": "Your morning, in one voice note", "br.p": "Nothing to open, nothing to read first. The detail is one tap away if you want it.",
      "br.words": "{n} words · about {s} seconds", "br.transcript": "Transcript",
      "nt.h": "Overnight", "nt.p": "Every job that ran while you slept. The brief is written from these results, not from a template.",
      "nt.fail": "Make it fail", "nt.ok": "Healthy", "nt.retry": "Supervisor retry", "nt.retryFix": "fixes it", "nt.retryNo": "still fails",
      "nt.compose": "Compose the brief", "nt.composing": "Composing…", "nt.composed": "Brief recomposed. Open 06:50 to hear it.",
      "nt.len": "Length", "nt.short": "Short", "nt.std": "Standard", "nt.long": "Long", "nt.time": "Deliver at", "nt.cal": "Today's calendar",
      "st.ok": "done", "st.fail": "failed", "st.fixed": "recovered on retry", "st.wait": "waiting",
      "j.dispatch": "Dispatcher", "j.dispatchD": "Assigns tonight's work to the agents", "j.dispatchR": "4 tasks assigned, 2 agents",
      "j.ideas": "Idea review", "j.ideasD": "Vets new ideas, builds the best one", "j.ideasR": "3 ideas reviewed, 1 built and tested",
      "j.shift": "Night shift", "j.shiftD": "Long jobs that would block the day", "j.shiftR": "Client dashboard refreshed, 1,204 rows",
      "j.watch": "Competitor watch", "j.watchD": "Checks 12 sites for price changes", "j.watchR": "2 price changes found",
      "j.scout": "Research scout", "j.scoutD": "Looks for new sources on open questions", "j.scoutR": "3 new sources on pricing",
      "j.super": "Supervisor", "j.superD": "Retries failures, explains the ones it can't fix", "j.superR0": "Nothing to retry", "j.superR1": "Retried {j}: {r}",
      "j.brief": "Morning brief", "j.briefD": "Writes ~45 words, turns them into a voice note", "j.briefR": "Sent to the phone",
      "err.watch": "two sites timed out", "err.scout": "the search source was down", "err.shift": "the input file was missing", "err.ideas": "the build failed its own test",
      "c.1": "9:30 · call with Ana", "c.2": "14:00 · grant review", "c.3": "17:30 · nothing after five",
      "hw.h": "How it's built", "hw.p": "No paid service in the chain. One home machine runs every job on a schedule, and the phone only receives.",
      "hw.1": "Scheduled jobs", "hw.1d": "Each job runs at its hour and writes a small result file. A job never deletes or edits: it proposes.",
      "hw.2": "Supervisor", "hw.2d": "At 06:30 it re-runs anything that failed once, and writes a one-line reason for anything still broken.",
      "hw.3": "Composer", "hw.3d": "Ranks the results: what needs you first, then what's new, then the day ahead. Hard limit: about 45 words.",
      "hw.4": "Voice", "hw.4d": "Turned into audio on the same machine, with a local voice. Paths and file names never go in the audio.",
      "hw.5": "Delivery", "hw.5d": "Arrives as one voice note at the set time. The longer detail note is there if wanted, never required.",
      // brief sentences
      "s.hello": "Good morning, it's Tuesday.", "s.cal2": "Two things today: a call with Ana at nine thirty, and the grant review at two.", "s.cal1": "One thing today: a call with Ana at nine thirty.",
      "s.allOk": "Everything ran overnight.", "s.someOk": "Overnight, {a} of {b} jobs finished.",
      "s.dash": "The client dashboard is refreshed.", "s.watch": "Two competitors changed prices; details are in the note.", "s.scout": "The scout found three new sources on pricing.",
      "s.idea": "One idea was built and passed its test.",
      "s.fixed": "{j} failed once, but the retry worked.", "s.needs": "One thing needs you: {j} failed twice, because {r}.", "s.none": "Nothing needs you.", "s.bye": "Have a good day.",
    },
    es: {
      "mb.title": "Resumen matutino · demo en vivo", "mb.name": "Resumen matutino", "mb.sub": "Llega a las 06:50",
      "nav.brief": "06:50", "nav.night": "Durante la noche", "nav.how": "Cómo está hecho",
      "tour.1": "Toca la notificación y reproduce la nota de voz. Dura 45 segundos como máximo.", "tour.2": "Abre “Durante la noche” y haz fallar una tarea. Luego recompón el resumen y escúchalo otra vez.",
      "tour.3": "Cambia la duración o la hora de entrega y mira cómo la nota se reescribe sola.",
      "ph.date": "martes, 20 de octubre", "ph.notif": "Resumen matutino", "ph.voice": "Nota de voz · {s}", "ph.now": "ahora", "ph.tap": "Toca para abrir",
      "ph.relay": "Relay", "ph.detail": "Nota con detalle", "ph.play": "Reproducir", "ph.pause": "Pausa", "ph.noVoice": "Este navegador no tiene voz, así que la nota se muestra como texto.",
      "br.h": "Tu mañana, en una nota de voz", "br.p": "Nada que abrir, nada que leer primero. El detalle está a un toque si lo quieres.",
      "br.words": "{n} palabras · unos {s} segundos", "br.transcript": "Transcripción",
      "nt.h": "Durante la noche", "nt.p": "Cada tarea que corrió mientras dormías. El resumen se escribe a partir de estos resultados, no de una plantilla.",
      "nt.fail": "Hacerla fallar", "nt.ok": "Sana", "nt.retry": "Reintento del supervisor", "nt.retryFix": "lo arregla", "nt.retryNo": "sigue fallando",
      "nt.compose": "Componer el resumen", "nt.composing": "Componiendo…", "nt.composed": "Resumen recompuesto. Abre 06:50 para escucharlo.",
      "nt.len": "Duración", "nt.short": "Corta", "nt.std": "Normal", "nt.long": "Larga", "nt.time": "Entregar a las", "nt.cal": "Agenda de hoy",
      "st.ok": "lista", "st.fail": "falló", "st.fixed": "recuperada al reintentar", "st.wait": "esperando",
      "j.dispatch": "Despachador", "j.dispatchD": "Asigna el trabajo de la noche a los agentes", "j.dispatchR": "4 tareas asignadas, 2 agentes",
      "j.ideas": "Revisión de ideas", "j.ideasD": "Evalúa ideas nuevas, construye la mejor", "j.ideasR": "3 ideas revisadas, 1 construida y probada",
      "j.shift": "Turno de noche", "j.shiftD": "Tareas largas que bloquearían el día", "j.shiftR": "Panel del cliente actualizado, 1.204 filas",
      "j.watch": "Vigilancia de competencia", "j.watchD": "Revisa 12 sitios buscando cambios de precio", "j.watchR": "2 cambios de precio",
      "j.scout": "Explorador de fuentes", "j.scoutD": "Busca fuentes nuevas para preguntas abiertas", "j.scoutR": "3 fuentes nuevas sobre precios",
      "j.super": "Supervisor", "j.superD": "Reintenta fallas, explica las que no puede arreglar", "j.superR0": "Nada que reintentar", "j.superR1": "Reintentó {j}: {r}",
      "j.brief": "Resumen matutino", "j.briefD": "Escribe ~45 palabras y las convierte en nota de voz", "j.briefR": "Enviado al teléfono",
      "err.watch": "dos sitios no respondieron", "err.scout": "la fuente de búsqueda estaba caída", "err.shift": "faltaba el archivo de entrada", "err.ideas": "la construcción no pasó su propia prueba",
      "c.1": "9:30 · llamada con Ana", "c.2": "14:00 · revisión de la beca", "c.3": "17:30 · nada después de las cinco",
      "hw.h": "Cómo está hecho", "hw.p": "Ningún servicio pagado en la cadena. Una máquina en casa corre cada tarea a su hora, y el teléfono solo recibe.",
      "hw.1": "Tareas programadas", "hw.1d": "Cada tarea corre a su hora y escribe un pequeño archivo de resultado. Nunca borra ni edita: propone.",
      "hw.2": "Supervisor", "hw.2d": "A las 06:30 vuelve a correr lo que falló una vez, y escribe en una línea por qué sigue roto lo que no pudo arreglar.",
      "hw.3": "Redactor", "hw.3d": "Ordena los resultados: primero lo que te necesita, luego lo nuevo, luego el día. Límite: unas 45 palabras.",
      "hw.4": "Voz", "hw.4d": "Se convierte en audio en la misma máquina, con una voz local. Las rutas y nombres de archivo nunca van en el audio.",
      "hw.5": "Entrega", "hw.5d": "Llega como una sola nota de voz a la hora fijada. La nota con detalle está ahí si la quieres, nunca es obligatoria.",
      "s.hello": "Buenos días, hoy es martes.", "s.cal2": "Dos cosas hoy: llamada con Ana a las nueve y media, y la revisión de la beca a las dos.", "s.cal1": "Una cosa hoy: llamada con Ana a las nueve y media.",
      "s.allOk": "Todo corrió durante la noche.", "s.someOk": "Durante la noche terminaron {a} de {b} tareas.",
      "s.dash": "El panel del cliente está actualizado.", "s.watch": "Dos competidores cambiaron precios; el detalle está en la nota.", "s.scout": "El explorador encontró tres fuentes nuevas sobre precios.",
      "s.idea": "Se construyó una idea y pasó su prueba.",
      "s.fixed": "{j} falló una vez, pero el reintento funcionó.", "s.needs": "Una cosa te necesita: {j} falló dos veces, porque {r}.", "s.none": "Nada te necesita.", "s.bye": "Que tengas buen día.",
    },
  });

  const JOBS = [
    { id: "dispatch", at: "22:30", fixed: true }, { id: "ideas", at: "23:00", err: "err.ideas" }, { id: "shift", at: "02:00", err: "err.shift" },
    { id: "watch", at: "04:00", err: "err.watch" }, { id: "scout", at: "05:00", err: "err.scout" }, { id: "super", at: "06:30", fixed: true }, { id: "brief", at: "06:50", fixed: true },
  ];
  const S = { fail: {}, retry: {}, len: "std", time: "06:50", opened: false, playing: false, word: -1, text: null, composing: false };

  const status = (j) => (!S.fail[j.id] ? "ok" : S.retry[j.id] ? "fixed" : "fail");
  const name = (id) => t("j." + id);

  function compose() {
    const work = JOBS.filter((j) => !j.fixed);
    const failed = work.filter((j) => status(j) === "fail"), fixed = work.filter((j) => status(j) === "fixed");
    const s = [t("s.hello")];
    if (S.len !== "short") s.push(t("s.cal2")); else s.push(t("s.cal1"));
    s.push(failed.length ? t("s.someOk", { a: work.length - failed.length, b: work.length }) : t("s.allOk"));
    const news = [];
    if (status(JOBS[2]) !== "fail") news.push(t("s.dash"));
    if (status(JOBS[3]) !== "fail") news.push(t("s.watch"));
    if (status(JOBS[4]) !== "fail") news.push(t("s.scout"));
    if (status(JOBS[1]) !== "fail") news.push(t("s.idea"));
    // what needs you comes before what's new
    if (failed.length) s.push(t("s.needs", { j: name(failed[0].id), r: t(failed[0].err) }));
    fixed.slice(0, 1).forEach((j) => s.push(t("s.fixed", { j: name(j.id) })));
    s.push(...news.slice(0, { short: 1, std: 2, long: 4 }[S.len]));
    if (!failed.length) s.push(t("s.none"));
    if (S.len !== "short") s.push(t("s.bye"));
    return s.join(" ");
  }
  const words = (txt) => txt.split(/\s+/).filter(Boolean);
  const secs = (txt) => Math.round(words(txt).length / 2.5);
  const clock = (s) => `0:${String(s).padStart(2, "0")}`;

  /* ---------- views ---------- */
  function transcript(txt) { return words(txt).map((w, i) => `<span data-w="${i}" class="${i === S.word ? "on" : i < S.word ? "past" : ""}">${esc(w)}</span>`).join(" "); }

  function phone() {
    const txt = S.text || compose();
    if (!S.opened) {
      return `<div class="mb-device"><div class="mb-screen lock">
        <p class="mb-date">${t("ph.date")}</p><p class="mb-time">${S.time}</p>
        <button type="button" class="mb-notif" data-open-note><span class="mb-app">R</span><div><b>${t("ph.relay")}</b><span>${t("ph.notif")} · ${t("ph.voice", { s: clock(secs(txt)) })}</span></div><em>${t("ph.now")}</em></button>
        <p class="mb-tap">${t("ph.tap")}</p></div></div>`;
    }
    const bars = Array.from({ length: 34 }, (_, i) => 6 + Math.round(Math.abs(Math.sin(i * 1.7) * 18 + Math.cos(i * .6) * 8)));
    const prog = S.word < 0 ? 0 : (S.word + 1) / words(txt).length;
    return `<div class="mb-device"><div class="mb-screen chat">
      <div class="mb-chathead"><button type="button" class="mb-back" data-close-note aria-label="←">‹</button><span class="mb-app sm">R</span><b>${t("ph.relay")}</b></div>
      <div class="mb-msgs">
        <div class="mb-bubble voice"><button type="button" class="mb-play${S.playing ? " on" : ""}" data-play aria-label="${t(S.playing ? "ph.pause" : "ph.play")}">${S.playing ? "❚❚" : "▶"}</button>
          <div class="mb-wave">${bars.map((h, i) => `<i style="height:${h}px" class="${i / bars.length < prog ? "on" : ""}"></i>`).join("")}</div><span class="mb-dur">${clock(secs(txt))}</span></div>
        <div class="mb-bubble text"><b>${t("br.transcript")}</b><p id="tx">${transcript(txt)}</p></div>
        <div class="mb-bubble text dim"><b>${t("ph.detail")}</b><p>${JOBS.filter((j) => !j.fixed).map((j) => `${j.at} ${name(j.id)}: ${status(j) === "fail" ? t("st.fail") + " (" + t(j.err) + ")" : status(j) === "fixed" ? t("st.fixed") : t("j." + j.id + "R")}`).join("<br>")}</p></div>
      </div></div></div>`;
  }

  function briefView() {
    const txt = S.text || compose();
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      <div class="page-head"><div><h1 data-i18n="br.h"></h1><p data-i18n="br.p"></p></div></div>
      <div class="mb-stage"><div id="phone">${phone()}</div>
        <div class="mb-side"><p class="kicker">${t("br.words", { n: words(txt).length, s: secs(txt) })}</p><p class="mb-quote">${esc(txt)}</p>
          ${"speechSynthesis" in window ? "" : `<p class="sub">${t("ph.noVoice")}</p>`}
          <a class="link-arrow" href="#/night">${t("nav.night")}</a></div></div>`;
  }

  function nightView() {
    const sup = JOBS.filter((j) => S.fail[j.id]);
    return `<div class="page-head"><div><h1 data-i18n="nt.h"></h1><p data-i18n="nt.p"></p></div>
      <button class="btn btn-accent" type="button" data-compose ${S.composing ? "disabled" : ""}>${t(S.composing ? "nt.composing" : "nt.compose")}</button></div>
      <div class="mb-night">
        <ol class="mb-tl">${JOBS.map((j) => {
          const st = j.id === "super" ? (sup.length ? "fixed" : "ok") : status(j);
          const res = j.id === "super" ? (sup.length ? sup.map((x) => t("j.superR1", { j: name(x.id), r: t(S.retry[x.id] ? "nt.retryFix" : "nt.retryNo") })).join(" · ") : t("j.superR0")) : st === "fail" ? t(j.err) : t("j." + j.id + "R");
          return `<li class="mb-job ${st}"><span class="mb-at">${j.id === "brief" ? S.time : j.at}</span><i class="mb-node"></i>
            <div class="mb-jb"><div class="mb-jh"><b>${name(j.id)}</b><span class="pill ${st === "ok" ? "ok" : st === "fixed" ? "sev-medium" : "sev-critical"}">${t("st." + st)}</span></div>
              <p class="sub" style="margin:2px 0 6px">${t("j." + j.id + "D")}</p><p class="mb-res">${esc(res)}</p>
              ${j.fixed ? "" : `<div class="mb-ctl"><label class="check"><input type="checkbox" data-fail="${j.id}" ${S.fail[j.id] ? "checked" : ""}> ${t("nt.fail")}</label>
                ${S.fail[j.id] ? `<span class="mb-retry">${t("nt.retry")}: <button type="button" class="chip" data-retry="${j.id}" data-v="1" aria-pressed="${!!S.retry[j.id]}">${t("nt.retryFix")}</button><button type="button" class="chip" data-retry="${j.id}" data-v="0" aria-pressed="${!S.retry[j.id]}">${t("nt.retryNo")}</button></span>` : ""}</div>`}
            </div></li>`;
        }).join("")}</ol>
        <div class="mb-panel">
          <section class="card"><h3>${t("nt.len")}</h3><div class="chips" style="margin-top:10px">${["short", "std", "long"].map((l) => `<button class="chip" type="button" data-len="${l}" aria-pressed="${S.len === l}">${t("nt." + l)}</button>`).join("")}</div>
            <h3 style="margin-top:18px">${t("nt.time")}</h3><select class="sel" id="time" style="margin-top:10px">${["06:00", "06:30", "06:50", "07:00", "07:30"].map((x) => `<option ${x === S.time ? "selected" : ""}>${x}</option>`).join("")}</select></section>
          <section class="card mt"><h3>${t("nt.cal")}</h3><ul class="mb-cal">${[1, 2, 3].map((i) => `<li>${t("c." + i)}</li>`).join("")}</ul></section>
          <section class="card mt mb-preview"><p class="kicker">${t("br.words", { n: words(compose()).length, s: secs(compose()) })}</p><p>${esc(compose())}</p></section>
        </div>
      </div>`;
  }

  function howView() {
    return `<div class="page-head"><div><h1 data-i18n="hw.h"></h1><p data-i18n="hw.p"></p></div></div>
      <ol class="mb-how">${[1, 2, 3, 4, 5].map((i) => `<li><span>0${i}</span><h3>${t("hw." + i)}</h3><p>${t("hw." + i + "d")}</p></li>`).join("")}</ol>`;
  }

  /* ---------- voice ---------- */
  let fallbackT = null;
  function stop() {
    S.playing = false; clearInterval(fallbackT);
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
  function paintPhone() { const p = $("#phone"); if (p) p.innerHTML = phone(); }
  function play() {
    if (S.playing) { stop(); paintPhone(); return; }
    const txt = S.text || compose(); const ws = words(txt);
    S.playing = true; S.word = -1; paintPhone();
    const advance = (i) => { S.word = i; $$("#tx span").forEach((s, k) => { s.className = k === i ? "on" : k < i ? "past" : ""; }); const bars = $$(".mb-wave i"); bars.forEach((b, k) => b.classList.toggle("on", k / bars.length < (i + 1) / ws.length)); };
    const end = () => { S.playing = false; S.word = ws.length; paintPhone(); };
    const timed = () => { let i = 0; fallbackT = setInterval(() => { advance(i++); if (i > ws.length) { clearInterval(fallbackT); end(); } }, 380); };
    if (!("speechSynthesis" in window)) return timed();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = I18N.lang === "es" ? "es-ES" : "en-US"; u.rate = 1.02;
    const v = speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith(I18N.lang)); if (v) u.voice = v;
    // word highlighting follows the voice where the browser reports word boundaries
    let gotBoundary = false;
    const starts = []; let pos = 0; ws.forEach((w) => { const k = txt.indexOf(w, pos); starts.push(k); pos = k + w.length; });
    u.onboundary = (e) => { if (e.name && e.name !== "word") return; gotBoundary = true; let i = starts.findIndex((s, k) => e.charIndex >= s && (k === starts.length - 1 || e.charIndex < starts[k + 1])); if (i >= 0) advance(i); };
    u.onend = () => { clearInterval(fallbackT); end(); };
    u.onerror = () => { if (S.playing) { speechSynthesis.cancel(); timed(); } };
    speechSynthesis.cancel(); speechSynthesis.speak(u);
    setTimeout(() => { if (S.playing && !gotBoundary) { let i = Math.max(0, S.word); fallbackT = setInterval(() => { if (!S.playing || gotBoundary) return clearInterval(fallbackT); advance(i++); if (i >= ws.length) clearInterval(fallbackT); }, (secs(txt) * 1000) / ws.length); } }, 900);
  }

  /* ---------- wiring ---------- */
  const A = Kit.app({ nav: [{ id: "brief", key: "nav.brief", icon: "phone" }, { id: "night", key: "nav.night", icon: "list" }, { id: "how", key: "nav.how", icon: "doc" }], views: { brief: briefView, night: nightView, how: howView },
    after: (id) => { if (id !== "brief") stop(); } });
  I18N.onChange(() => { stop(); S.text = null; });

  const view = $("#view");
  view.addEventListener("click", (e) => {
    const el = (s) => e.target.closest(s);
    if (el("[data-open-note]")) { S.opened = true; S.word = -1; paintPhone(); setTimeout(play, 300); return; }
    if (el("[data-close-note]")) { stop(); S.opened = false; return paintPhone(); }
    if (el("[data-play]")) return play();
    const r = el("[data-retry]"); if (r) { S.retry[r.dataset.retry] = r.dataset.v === "1"; return A.render(); }
    const l = el("[data-len]"); if (l) { S.len = l.dataset.len; S.text = null; return A.render(); }
    if (el("[data-compose]")) {
      S.composing = true; A.render();
      setTimeout(() => { S.composing = false; S.text = compose(); S.opened = false; S.word = -1; toast(t("nt.composed")); A.render(); }, 1300);
    }
  });
  view.addEventListener("change", (e) => {
    if (e.target.dataset.fail) { const id = e.target.dataset.fail; S.fail[id] = e.target.checked; if (!e.target.checked) delete S.retry[id]; S.text = null; A.render(); }
    if (e.target.id === "time") { S.time = e.target.value; A.render(); }
  });
  window.addEventListener("pagehide", stop);
})();
