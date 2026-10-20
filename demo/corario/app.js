/* Corario demo. The offline songbook a worship team carries on their phones:
   search title or lyric, filters, keys for each voice with live transposition,
   a real metronome with tap tempo, favourites, and adding a song from inside the app.
   Sample songs are public-domain hymns (first verse only). */
(function () {
  const { t, F, esc, $, $$, toast, I18N } = Kit;

  I18N.add({
    en: {
      "co.title": "Corario songbook · live demo", "co.name": "Corario", "co.sub": "Worship team",
      "nav.songs": "Songs", "nav.fav": "Favourites", "nav.add": "Add a song",
      "tour.1": "Search for a word inside a song, like “river” or “blood”.", "tour.2": "Open a song and switch between the women's and men's key. The chords move with it.",
      "tour.3": "Press play on the metronome, or tap the record four times to set a tempo.",
      "hd.kicker": "Worship team", "hd.offline": "Works with no signal", "hd.sample": "Sample songs are public-domain hymns.",
      "st.visible": "Showing", "st.songs": "Songs", "st.fav": "Favourites", "st.filters": "Filters",
      "sr.ph": "Search title or lyrics…", "sr.clear": "Clear",
      "fl.rhythm": "Rhythm", "fl.theme": "Theme", "fl.key": "Key (women)", "fl.slow": "Slow", "fl.fast": "Fast",
      "th.praise": "Praise", "th.grace": "Grace", "th.prayer": "Prayer", "th.hope": "Hope",
      "ls.all": "Showing every song", "ls.n": "{n} song(s) match", "ls.none": "No song matches.", "ls.noneP": "Try fewer filters or a different word.", "ls.reset": "Reset",
      "sg.women": "Women", "sg.men": "Men", "sg.key": "Key", "sg.transpose": "Transpose", "sg.bpm": "{n} BPM", "sg.time": "{n} time", "sg.use": "Use in metronome", "sg.lyric": "lyric match",
      "sg.pending": "Waiting for the leader's review", "sg.by": "{y} · {a}",
      "mt.k": "Metronome", "mt.pick": "Pick a song", "mt.pickP": "Open any song to load its tempo, or set one by hand.", "mt.tap": "Tap tempo", "mt.pulse": "Pulse {n} BPM", "mt.adj": "Adjust it together as a team.",
      "mt.taps": "{n} taps", "mt.set": "Tempo set to {n} BPM",
      "fv.h": "Favourites", "fv.p": "Starred songs stay on this phone, even offline.", "fv.none": "No favourites yet.", "fv.noneP": "Tap the star on any song.",
      "ad.h": "Add a song", "ad.p": "Team members suggest songs from inside the app. Each one lands as a row in the leader's spreadsheet, ready to review.",
      "ad.title": "Title", "ad.author": "Author", "ad.key": "Key (women)", "ad.bpm": "Tempo (BPM)", "ad.rhythm": "Rhythm", "ad.lyrics": "Lyrics with chords",
      "ad.hint": "Write chords in brackets before the syllable: [G]Amazing [C]grace", "ad.send": "Send to the leader",
      "ad.sent": "Sent. It appears in the list marked for review.", "ad.need": "A title and some lyrics, please.", "ad.row": "The row the leader receives",
      "of.on": "No signal. Corario keeps working: every song is already on this phone.", "of.off": "Back online.",
    },
    es: {
      "co.title": "Cancionero Corario · demo en vivo", "co.name": "Corario", "co.sub": "Grupo de alabanza",
      "nav.songs": "Canciones", "nav.fav": "Favoritas", "nav.add": "Agregar canción",
      "tour.1": "Busca una palabra dentro de una canción, como “river” o “blood”.", "tour.2": "Abre una canción y cambia entre el tono de mujer y el de hombre. Los acordes se mueven con él.",
      "tour.3": "Presiona play en el metrónomo, o toca el disco cuatro veces para marcar un tempo.",
      "hd.kicker": "Grupo de alabanza", "hd.offline": "Funciona sin señal", "hd.sample": "Las canciones de ejemplo son himnos de dominio público.",
      "st.visible": "Visibles", "st.songs": "Canciones", "st.fav": "Favoritas", "st.filters": "Filtros",
      "sr.ph": "Buscar título o letra…", "sr.clear": "Limpiar",
      "fl.rhythm": "Ritmo", "fl.theme": "Tema", "fl.key": "Tono (mujer)", "fl.slow": "Lenta", "fl.fast": "Rápida",
      "th.praise": "Alabanza", "th.grace": "Gracia", "th.prayer": "Oración", "th.hope": "Esperanza",
      "ls.all": "Mostrando todas las canciones", "ls.n": "{n} canción(es) coinciden", "ls.none": "Ninguna canción coincide.", "ls.noneP": "Prueba con menos filtros u otra palabra.", "ls.reset": "Reiniciar",
      "sg.women": "Mujer", "sg.men": "Hombre", "sg.key": "Tono", "sg.transpose": "Transponer", "sg.bpm": "{n} BPM", "sg.time": "compás {n}", "sg.use": "Usar en el metrónomo", "sg.lyric": "coincide en la letra",
      "sg.pending": "Esperando revisión del líder", "sg.by": "{y} · {a}",
      "mt.k": "Metrónomo", "mt.pick": "Elige una canción", "mt.pickP": "Abre cualquier canción para cargar su tempo, o márcalo a mano.", "mt.tap": "Tap tempo", "mt.pulse": "Pulso {n} BPM", "mt.adj": "Ajustable para definirlo en equipo.",
      "mt.taps": "{n} toques", "mt.set": "Tempo fijado en {n} BPM",
      "fv.h": "Favoritas", "fv.p": "Las canciones con estrella quedan en este teléfono, incluso sin señal.", "fv.none": "Todavía no hay favoritas.", "fv.noneP": "Toca la estrella de cualquier canción.",
      "ad.h": "Agregar canción", "ad.p": "Los miembros sugieren canciones desde la app. Cada una llega como una fila en la hoja del líder, lista para revisar.",
      "ad.title": "Título", "ad.author": "Autor", "ad.key": "Tono (mujer)", "ad.bpm": "Tempo (BPM)", "ad.rhythm": "Ritmo", "ad.lyrics": "Letra con acordes",
      "ad.hint": "Escribe los acordes entre corchetes antes de la sílaba: [G]Amazing [C]grace", "ad.send": "Enviar al líder",
      "ad.sent": "Enviada. Aparece en la lista marcada para revisión.", "ad.need": "Un título y algo de letra, por favor.", "ad.row": "La fila que recibe el líder",
      "of.on": "Sin señal. Corario sigue funcionando: todas las canciones ya están en este teléfono.", "of.off": "De vuelta en línea.",
    },
  });

  // Public-domain hymns, first verse (and refrain where short). Chords are written for the women's key.
  const SONGS = [
    { id: 1, title: "Amazing Grace", author: "John Newton", year: 1779, keyW: "G", shift: -5, bpm: 76, time: "3/4", rhythm: "slow", theme: "grace",
      lyrics: "[G]Amazing grace! How [C]sweet the [G]sound\nThat saved a wretch like [D]me!\nI [G]once was lost, but [C]now am [G]found;\nWas [Em]blind, but [D]now I [G]see." },
    { id: 2, title: "It Is Well with My Soul", author: "Horatio Spafford", year: 1873, keyW: "C", shift: -5, bpm: 72, time: "4/4", rhythm: "slow", theme: "hope",
      lyrics: "When [C]peace like a river at[F]tendeth my [C]way,\nWhen sorrows like [Am]sea billows [D]roll; [G]\nWhat[C]ever my lot, Thou hast [F]taught me to [C]say,\nIt is [F]well, it is [G]well with my [C]soul.\n\nIt is [G]well with my [C]soul,\nIt is [F]well, it is [G]well with my [C]soul." },
    { id: 3, title: "Come, Thou Fount", author: "Robert Robinson", year: 1758, keyW: "D", shift: -5, bpm: 92, time: "3/4", rhythm: "slow", theme: "praise",
      lyrics: "[D]Come, Thou Fount of [G]every [D]blessing,\nTune my heart to [A]sing Thy [D]grace;\nStreams of mercy, [G]never [D]ceasing,\nCall for songs of [A]loudest [D]praise." },
    { id: 4, title: "Blessed Assurance", author: "Fanny Crosby", year: 1873, keyW: "D", shift: -5, bpm: 100, time: "6/8", rhythm: "fast", theme: "praise",
      lyrics: "[D]Blessed assurance, [G]Jesus is [D]mine!\nO what a foretaste of [E]glory di[A]vine!\n[D]Heir of salvation, [G]purchase of [D]God,\nBorn of His [G]Spirit, [A]washed in His [D]blood.\n\n[D]This is my story, [G]this is my [D]song,\nPraising my Savior [E]all the day [A]long." },
    { id: 5, title: "What a Friend We Have in Jesus", author: "Joseph Scriven", year: 1855, keyW: "F", shift: -5, bpm: 84, time: "4/4", rhythm: "slow", theme: "prayer",
      lyrics: "[F]What a friend we [Bb]have in [F]Jesus,\nAll our sins and [G]griefs to [C]bear!\n[F]What a privilege [Bb]to [F]carry\nEverything to [C]God in [F]prayer!" },
    { id: 6, title: "Joyful, Joyful, We Adore Thee", author: "Henry van Dyke", year: 1907, keyW: "G", shift: -5, bpm: 112, time: "4/4", rhythm: "fast", theme: "praise",
      lyrics: "[G]Joyful, joyful, [C]we a[G]dore Thee,\nGod of glory, [D]Lord of [G]love;\nHearts unfold like [C]flowers be[G]fore Thee,\nOpening to the [D]sun a[G]bove." },
    { id: 7, title: "Nothing but the Blood", author: "Robert Lowry", year: 1876, keyW: "G", shift: -5, bpm: 104, time: "4/4", rhythm: "fast", theme: "grace",
      lyrics: "[G]What can wash away my sin?\nNothing but the [D]blood of [G]Jesus;\nWhat can make me whole again?\nNothing but the [D]blood of [G]Jesus.\n\nOh! [C]precious is the [G]flow\nThat makes me white as [D]snow;\nNo [G]other fount I [C]know,\nNothing but the [D]blood of [G]Jesus." },
    { id: 8, title: "There Is Power in the Blood", author: "Lewis E. Jones", year: 1899, keyW: "A", shift: -5, bpm: 116, time: "4/4", rhythm: "fast", theme: "grace",
      lyrics: "Would you be [A]free from the burden of sin?\nThere's power in the [E]blood, power in the [A]blood;\nWould you o'er evil a victory win?\nThere's wonderful [E]power in the [A]blood." },
    { id: 9, title: "I Surrender All", author: "Judson W. Van DeVenter", year: 1896, keyW: "D", shift: -5, bpm: 74, time: "4/4", rhythm: "slow", theme: "prayer",
      lyrics: "[D]All to Jesus [G]I sur[D]render,\nAll to Him I [E]freely [A]give;\nI will [D]ever [G]love and [D]trust Him,\nIn His [G]presence [A]daily [D]live.\n\n[D]I surrender [G]all, [D]I surrender [A]all;\n[D]All to Thee, my [G]blessed [D]Savior,\nI sur[A]render [D]all." },
    { id: 10, title: "Leaning on the Everlasting Arms", author: "Elisha Hoffman", year: 1887, keyW: "C", shift: -5, bpm: 110, time: "4/4", rhythm: "fast", theme: "hope",
      lyrics: "What a [C]fellowship, what a joy divine,\n[F]Leaning on the [C]everlasting [G]arms;\nWhat a [C]blessedness, what a peace is mine,\n[F]Leaning on the [G]everlasting [C]arms.\n\n[C]Leaning, [F]leaning,\n[C]Safe and secure from all a[G]larms;\n[C]Leaning, [F]leaning,\n[C]Leaning on the [G]everlasting [C]arms." },
    { id: 11, title: "Rock of Ages", author: "Augustus Toplady", year: 1763, keyW: "Bb", shift: -5, bpm: 70, time: "4/4", rhythm: "slow", theme: "grace",
      lyrics: "[Bb]Rock of Ages, [F]cleft for [Bb]me,\nLet me [Eb]hide my[F]self in [Bb]Thee;\nLet the water and the blood,\n[Eb]From Thy wounded [F]side which flowed," },
    { id: 12, title: "Blessed Be the Name", author: "W. H. Clark", year: 1888, keyW: "E", shift: -5, bpm: 108, time: "4/4", rhythm: "fast", theme: "praise",
      lyrics: "[E]Blessed be the name, [A]blessed be the [E]name,\nBlessed be the name of the [B]Lord;\n[E]Blessed be the name, [A]blessed be the [E]name,\nBlessed be the [B]name of the [E]Lord." },
  ];

  const NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  const IDX = { C: 0, "B#": 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, Fb: 4, F: 5, "E#": 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11, Cb: 11 };
  const tr = (ch, n) => ch.replace(/^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/, (m, root, rest, bass) => {
    const up = (r) => NOTES[(IDX[r] + n + 1200) % 12];
    return up(root) + rest + (bass ? "/" + up(bass) : "");
  });

  let store = {};
  try { store = JSON.parse(localStorage.getItem("corario-demo") || "{}"); } catch {}
  const S = { q: "", rhythm: null, theme: null, key: null, open: null, voice: {}, shift: {}, fav: new Set(store.fav || []), pending: [], bpm: 92, song: null, playing: false, offline: false, taps: [] };
  const save = () => { try { localStorage.setItem("corario-demo", JSON.stringify({ fav: [...S.fav] })); } catch {} };
  const all = () => [...S.pending, ...SONGS];
  const plain = (s) => s.lyrics.replace(/\[[^\]]+\]/g, "");
  const norm = (x) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function matches(s) {
    if (S.rhythm && s.rhythm !== S.rhythm) return false;
    if (S.theme && s.theme !== S.theme) return false;
    if (S.key && s.keyW !== S.key) return false;
    if (!S.q.trim()) return true;
    const q = norm(S.q.trim());
    return norm(s.title).includes(q) || norm(plain(s)).includes(q);
  }
  const totalShift = (s) => (S.voice[s.id] === "m" ? s.shift : 0) + (S.shift[s.id] || 0);

  function lyricsHtml(s) {
    const n = totalShift(s);
    const q = S.q.trim() ? norm(S.q.trim()) : null;
    return s.lyrics.split("\n").map((line) => {
      if (!line.trim()) return `<div class="gap"></div>`;
      const parts = line.split(/(\[[^\]]+\])/).filter((p) => p !== "");
      let hasChord = false;
      // build aligned segments: each chord sits over the text that follows it
      const segs = []; let cur = { c: "", w: "" };
      parts.forEach((p) => { if (/^\[/.test(p)) { if (cur.c || cur.w) segs.push(cur); cur = { c: tr(p.slice(1, -1), n), w: "" }; hasChord = true; } else cur.w += p; });
      segs.push(cur);
      return `<div class="ln">${segs.map((g) => {
        let w = esc(g.w || " ");
        if (q) { const i = norm(g.w).indexOf(q); if (i >= 0) w = esc(g.w.slice(0, i)) + `<mark>${esc(g.w.slice(i, i + q.length))}</mark>` + esc(g.w.slice(i + q.length)); }
        return `<span class="seg">${hasChord ? `<b class="ch">${esc(g.c) || "&nbsp;"}</b>` : ""}<span class="w">${w}</span></span>`;
      }).join("")}</div>`;
    }).join("");
  }

  function songCard(s) {
    const open = S.open === s.id;
    const lyricHit = S.q.trim() && !norm(s.title).includes(norm(S.q.trim()));
    const tag = (cls, txt) => `<span class="tg ${cls}">${txt}</span>`;
    return `<article class="song${open ? " open" : ""}${s.pending ? " pend" : ""}" data-id="${s.id}">
      <div class="song-top" data-toggle-song="${s.id}" role="button" tabindex="0" aria-expanded="${open}">
        <span class="disc"><i>${esc(s.title[0])}</i></span>
        <div class="song-t"><h3>${esc(s.title)}</h3>
          <div class="tags">${tag("rh", t(s.rhythm === "fast" ? "fl.fast" : "fl.slow"))}${tag("", t("th." + s.theme))}${tag("kw", `${t("sg.women")} ${s.keyW}`)}${tag("km", `${t("sg.men")} ${tr(s.keyW, s.shift)}`)}${tag("bp", t("sg.bpm", { n: s.bpm }))}${lyricHit ? tag("hit", t("sg.lyric")) : ""}${s.pending ? tag("pd", t("sg.pending")) : ""}</div></div>
        <button class="star${S.fav.has(s.id) ? " on" : ""}" type="button" data-star="${s.id}" aria-label="★" aria-pressed="${S.fav.has(s.id)}">★</button>
        <span class="chev" aria-hidden="true"></span>
      </div>
      ${open ? `<div class="song-body">
        <div class="song-tools">
          <div class="seg2" role="group"><button type="button" data-voice="w" aria-pressed="${S.voice[s.id] !== "m"}">${t("sg.women")}</button><button type="button" data-voice="m" aria-pressed="${S.voice[s.id] === "m"}">${t("sg.men")}</button></div>
          <div class="tp"><span>${t("sg.transpose")}</span><button type="button" data-tp="-1" aria-label="−1">−</button><b>${t("sg.key")} ${tr(s.keyW, totalShift(s))}</b><button type="button" data-tp="1" aria-label="+1">+</button></div>
          <button class="btn btn-s use" type="button" data-use="${s.id}">♩ ${t("sg.use")}</button>
        </div>
        <div class="lyrics">${lyricsHtml(s)}</div>
        <p class="by">${t("sg.by", { y: s.year, a: esc(s.author) })} · ${t("sg.time", { n: s.time })}</p>
      </div>` : ""}
    </article>`;
  }

  function chips(name, opts) { return `<div class="chips">${opts.map(([v, l]) => `<button class="chip" type="button" data-f="${name}" data-v="${v}" aria-pressed="${S[name] === v}">${l}</button>`).join("")}</div>`; }

  function metronome() {
    const s = S.song;
    return `<section class="metro">
      <div class="metro-top"><div><p class="k">${t("mt.k")}</p><h2>${s ? esc(s.title) : t("mt.pick")}</h2><p class="mp">${s ? `${t("sg.key")} ${s.keyW} · ${t("sg.time", { n: s.time })}` : t("mt.pickP")}</p></div>
        <button class="record${S.playing ? " spin" : ""}" type="button" data-tap aria-label="${t("mt.tap")}"><i></i><span>${t("mt.tap")}</span></button></div>
      <div class="beats" id="beats">${[0, 1, 2, 3].map((i) => `<i data-b="${i}"></i>`).join("")}</div>
      <div class="metro-ctl">
        <button class="play${S.playing ? " on" : ""}" type="button" data-play aria-label="play">${S.playing ? "❚❚" : "▶"}</button>
        <div class="pulse"><b>${t("mt.pulse", { n: S.bpm })}</b><span>${t("mt.adj")}</span>
          <div class="sl"><button type="button" data-bpm="-1">−</button><input type="range" min="40" max="200" value="${S.bpm}" id="bpm" aria-label="BPM"><button type="button" data-bpm="1">+</button></div></div>
      </div>
    </section>`;
  }

  function header() {
    return `<header class="co-head"><div><p class="k">${t("hd.kicker")}</p><h1 class="co-title">Corario</h1></div>
      <button class="offline${S.offline ? " on" : ""}" type="button" data-offline><i></i>${t("hd.offline")}</button></header>
      ${S.offline ? `<div class="offbar">${t("of.on")}</div>` : ""}`;
  }

  function songs() {
    const list = all().filter(matches);
    const nf = [S.rhythm, S.theme, S.key].filter(Boolean).length;
    const keys = [...new Set(SONGS.map((s) => s.keyW))].sort((a, b) => IDX[a] - IDX[b]);
    return `<div class="tour"><b data-i18n="chrome.tryThis"></b><ol><li data-i18n="tour.1"></li><li data-i18n="tour.2"></li><li data-i18n="tour.3"></li></ol><button type="button" data-hide-tour data-i18n="chrome.hide"></button></div>
      ${header()}
      <div class="co-grid">
        <section class="panel">
          <div class="co-stats"><div><b>${list.length}</b><span>${t("st.visible")}</span></div><div><b>${all().length}</b><span>${t("st.songs")}</span></div><div><b>${S.fav.size}</b><span>${t("st.fav")}</span></div><div><b>${nf}</b><span>${t("st.filters")}</span></div></div>
          <div class="co-search"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5" stroke-linecap="round"/></svg><input id="q" type="search" value="${esc(S.q)}" placeholder="${t("sr.ph")}" aria-label="${t("sr.ph")}"><button type="button" data-clear>${t("sr.clear")}</button></div>
          <div class="fl"><p>${t("fl.rhythm")}</p>${chips("rhythm", [["slow", t("fl.slow")], ["fast", t("fl.fast")]])}</div>
          <div class="fl"><p>${t("fl.theme")}</p>${chips("theme", ["praise", "grace", "prayer", "hope"].map((x) => [x, t("th." + x)]))}</div>
          <div class="fl"><p>${t("fl.key")}</p><div class="keys">${keys.map((k) => `<button type="button" data-f="key" data-v="${k}" aria-pressed="${S.key === k}">${k}</button>`).join("")}</div></div>
        </section>
        ${metronome()}
      </div>
      <section class="list">
        <div class="list-h"><div><p class="k">Corario</p><p class="it">${list.length === all().length && !S.q ? t("ls.all") : t("ls.n", { n: list.length })}</p></div><button class="ghost" type="button" data-reset>${t("ls.reset")}</button></div>
        ${list.length ? list.map(songCard).join("") : `<div class="empty"><b>${t("ls.none")}</b><p>${t("ls.noneP")}</p></div>`}
        <p class="note-pd">${t("hd.sample")}</p>
      </section>`;
  }

  function favs() {
    const list = all().filter((s) => S.fav.has(s.id));
    return `${header()}<div class="page-head"><div><h1 data-i18n="fv.h"></h1><p data-i18n="fv.p"></p></div></div>
      <section class="list">${list.length ? list.map(songCard).join("") : `<div class="empty"><b>${t("fv.none")}</b><p>${t("fv.noneP")}</p><a class="btn btn-accent" href="#/songs">${t("nav.songs")}</a></div>`}</section>`;
  }

  function add() {
    return `${header()}<div class="page-head"><div><h1 data-i18n="ad.h"></h1><p data-i18n="ad.p"></p></div></div>
      <div class="add-grid">
        <form class="panel addf" id="addf" autocomplete="off">
          <label>${t("ad.title")}<input name="title" required></label>
          <label>${t("ad.author")}<input name="author"></label>
          <div class="row3"><label>${t("ad.key")}<select name="key">${NOTES.map((n) => `<option${n === "G" ? " selected" : ""}>${n}</option>`).join("")}</select></label>
            <label>${t("ad.bpm")}<input name="bpm" type="number" min="40" max="200" value="90"></label>
            <label>${t("ad.rhythm")}<select name="rhythm"><option value="slow">${t("fl.slow")}</option><option value="fast">${t("fl.fast")}</option></select></label></div>
          <label>${t("ad.lyrics")}<textarea name="lyrics" rows="6" placeholder="[G]Line one…"></textarea><small>${t("ad.hint")}</small></label>
          <button class="btn btn-accent" type="submit">${t("ad.send")}</button>
        </form>
        <div class="panel"><p class="k">${t("ad.row")}</p><div class="sheetrow" id="sheetrow">${rowPreview()}</div></div>
      </div>`;
  }
  function rowPreview(d) {
    d = d || { title: "", author: "", key: "G", bpm: 90, rhythm: "slow" };
    const cols = [["A", "timestamp", new Date().toISOString().slice(0, 16).replace("T", " ")], ["B", "title", d.title], ["C", "author", d.author], ["D", "key", d.key], ["E", "bpm", d.bpm], ["F", "rhythm", d.rhythm], ["G", "status", "pending"]];
    return cols.map(([c, h, v]) => `<div><span>${c}</span><em>${h}</em><b>${esc(String(v || "—"))}</b></div>`).join("");
  }

  /* ---------------- metronome audio ---------------- */
  let ctx = null, timer = null, beat = 0, nextT = 0;
  function tick() {
    while (nextT < ctx.currentTime + 0.1) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = beat % 4 === 0 ? 1320 : 880;
      g.gain.setValueAtTime(0.0001, nextT); g.gain.exponentialRampToValueAtTime(0.35, nextT + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, nextT + 0.06);
      o.connect(g).connect(ctx.destination); o.start(nextT); o.stop(nextT + 0.07);
      const b = beat % 4, delay = Math.max(0, (nextT - ctx.currentTime) * 1000);
      setTimeout(() => { $$("#beats i").forEach((el, i) => el.classList.toggle("on", i === b)); }, delay);
      beat++; nextT += 60 / S.bpm;
    }
  }
  function play(on) {
    S.playing = on;
    if (on) {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume(); beat = 0; nextT = ctx.currentTime + 0.05; clearInterval(timer); timer = setInterval(tick, 25); tick();
    } else { clearInterval(timer); $$("#beats i").forEach((el) => el.classList.remove("on")); }
    refreshMetro();
  }
  function refreshMetro() { const m = $(".metro"); if (m) { m.outerHTML = metronome(); } }

  /* ---------------- wiring ---------------- */
  const A = Kit.app({
    nav: [{ id: "songs", key: "nav.songs", icon: "list" }, { id: "fav", key: "nav.fav", icon: "inbox", count: () => S.fav.size }, { id: "add", key: "nav.add", icon: "upload" }],
    views: { songs, fav: favs, add },
  });
  const rerender = () => { const y = scrollY; A.render(); window.scrollTo(0, y); };

  const view = $("#view");
  view.addEventListener("click", (e) => {
    const el = (s) => e.target.closest(s);
    const st = el("[data-star]");
    if (st) { e.stopPropagation(); const id = Number(st.dataset.star); S.fav.has(id) ? S.fav.delete(id) : S.fav.add(id); save(); return rerender(); }
    const ts = el("[data-toggle-song]");
    if (ts) { const id = Number(ts.dataset.toggleSong); S.open = S.open === id ? null : id; const s = all().find((x) => x.id === id); if (S.open && s && !S.playing) { S.song = s; S.bpm = s.bpm; } return rerender(); }
    const f = el("[data-f]");
    if (f) { const k = f.dataset.f, v = f.dataset.v; S[k] = S[k] === v ? null : v; return rerender(); }
    if (el("[data-clear]")) { S.q = ""; return rerender(); }
    if (el("[data-reset]")) { S.q = ""; S.rhythm = S.theme = S.key = null; S.open = null; return rerender(); }
    const vo = el("[data-voice]"); if (vo && S.open) { S.voice[S.open] = vo.dataset.voice; return rerender(); }
    const tp = el("[data-tp]"); if (tp && S.open) { S.shift[S.open] = (S.shift[S.open] || 0) + Number(tp.dataset.tp); return rerender(); }
    const us = el("[data-use]"); if (us) { const s = all().find((x) => x.id === Number(us.dataset.use)); S.song = s; S.bpm = s.bpm; refreshMetro(); $(".metro").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (el("[data-play]")) return play(!S.playing);
    const bp = el("[data-bpm]"); if (bp) { S.bpm = Math.max(40, Math.min(200, S.bpm + Number(bp.dataset.bpm))); return refreshMetro(); }
    if (el("[data-tap]")) {
      const now = performance.now();
      S.taps = S.taps.filter((x) => now - x < 2500); S.taps.push(now);
      const rec = $(".record"); rec.animate([{ transform: "scale(.94)" }, { transform: "none" }], { duration: 160 });
      if (S.taps.length >= 2) {
        const gaps = S.taps.slice(1).map((x, i) => x - S.taps[i]);
        S.bpm = Math.max(40, Math.min(200, Math.round(60000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length))));
        refreshMetro();
        if (S.taps.length >= 4) toast(t("mt.set", { n: S.bpm }));
      }
      return;
    }
    if (el("[data-offline]")) { S.offline = !S.offline; toast(t(S.offline ? "of.on" : "of.off")); return rerender(); }
  });
  view.addEventListener("keydown", (e) => { const ts = e.target.closest("[data-toggle-song]"); if (ts && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); ts.click(); } });
  view.addEventListener("input", (e) => {
    if (e.target.id === "q") { S.q = e.target.value; const pos = e.target.selectionStart; A.render(); const q = $("#q"); q.focus(); q.setSelectionRange(pos, pos); }
    if (e.target.id === "bpm") { S.bpm = Number(e.target.value); const b = $(".pulse b"); b.textContent = t("mt.pulse", { n: S.bpm }); }
    const fm = e.target.closest("#addf"); if (fm) $("#sheetrow").innerHTML = rowPreview(Object.fromEntries(new FormData(fm)));
  });
  view.addEventListener("submit", (e) => {
    if (e.target.id !== "addf") return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    if (!d.title.trim() || !d.lyrics.trim()) return toast(t("ad.need"));
    S.pending.unshift({ id: 1000 + S.pending.length, title: d.title.trim(), author: d.author.trim() || "—", year: new Date().getFullYear(), keyW: d.key, shift: -5, bpm: Number(d.bpm) || 90, time: "4/4", rhythm: d.rhythm, theme: "praise", lyrics: d.lyrics, pending: true });
    toast(t("ad.sent")); S.open = S.pending[0].id; location.hash = "#/songs";
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && S.playing) play(false); });
})();
