/* Shared helpers used by several screens. */
(function () {
  const ui = App.ui, S = App.store;

  App.content = {
    readings: function () { return App.READINGS.concat(S.db.customReadings || []); },
    videos: function () { return App.VIDEOS.concat(S.db.customVideos || []); },
    reading: function (id) { return App.content.readings().find(function (r) { return r.id === id; }); },
    video: function (id) { return App.content.videos().find(function (v) { return v.id === id; }); }
  };

  function stars(score) {
    // score 0..1 -> 0..3 stars
    const n = score >= 0.99 ? 3 : score >= 0.7 ? 2 : score > 0 ? 1 : 0;
    return '<span class="stars">' + '★'.repeat(n) + '<span class="off">' + '★'.repeat(3 - n) + '</span></span>';
  }

  /* Build clickable word spans for a paragraph. Vocab words get highlighted.
     Each span records its character offset so read-aloud can highlight along. */
  function tokenize(text, vocabIndex, pIndex) {
    let html = '';
    const re = /[A-Za-z][A-Za-z'’-]*/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      html += ui.esc(text.slice(last, m.index));
      const word = m[0];
      const key = word.toLowerCase().replace(/’/g, '\'');
      const v = vocabIndex[key];
      html += '<span class="w' + (v ? ' vocab' : '') + '" data-p="' + pIndex + '" data-i="' + m.index + '" data-w="' + ui.esc(v ? v.w : word) + '">' + ui.esc(word) + '</span>';
      last = m.index + word.length;
    }
    html += ui.esc(text.slice(last));
    return html;
  }

  function vocabIndex(vocab) {
    const idx = {};
    (vocab || []).forEach(function (v) {
      (v.forms && v.forms.length ? v.forms : [v.w]).forEach(function (f) { idx[f.toLowerCase()] = v; });
    });
    return idx;
  }

  /* Popup for a tapped word. Known vocab shows the glossary; other words try a free online dictionary. */
  function wordPopup(word, vocabEntry, source) {
    const p = S.profile();
    const key = (vocabEntry ? vocabEntry.w : word).toLowerCase();
    const saved = !!p.words[key];
    const showIndo = p.settings.showIndo;
    let entry = vocabEntry ? Object.assign({}, vocabEntry) : { w: word.toLowerCase(), def: '', id: '', pos: '' };

    function body() {
      return '<div class="word-pop">' +
        '<div class="word-head"><h2>' + ui.esc(entry.w) + '</h2><button class="btn icon" data-say title="Dengarkan">🔊</button></div>' +
        (entry.pos ? '<div class="pos">' + ui.esc(entry.pos) + '</div>' : '') +
        '<p class="def" id="wp-def">' + (entry.def ? ui.esc(entry.def) : '<i>Mencari arti…</i>') + '</p>' +
        (showIndo && entry.id ? '<p class="indo">🇮🇩 ' + ui.esc(entry.id) + '</p>' : '') +
        (entry.ex ? '<p class="ex">“' + ui.esc(entry.ex) + '”</p>' : '') +
        (!vocabEntry ? '<label class="small">Arti versimu sendiri (boleh Bahasa Indonesia):<input id="wp-own" placeholder="contoh: berani"></label>' : '') +
        '<div class="row gap">' +
        (saved ? '<span class="pill ok">✓ Sudah ada di Word Garden</span>' : '<button class="btn primary" data-save>🌱 Save word</button>') +
        '<button class="btn" data-close>Close</button></div></div>';
    }

    const m = ui.modal(body());
    function wire() {
      m.el.querySelector('[data-say]').onclick = function () { ui.speak(entry.w); };
      const sv = m.el.querySelector('[data-save]');
      if (sv) sv.onclick = function () {
        const own = m.el.querySelector('#wp-own');
        if (own && own.value.trim()) entry.id = own.value.trim();
        if (!entry.def && !entry.id) { ui.toast('Tulis arti kata dulu ya 🙂'); return; }
        if (App.srs.addWord(p, entry, source)) {
          S.save();
          App.rewards.track('newword', 1);
          ui.sfx.pop();
          ui.toast('🌱 <b>' + ui.esc(entry.w) + '</b> ditanam di Word Garden!');
        }
        m.close();
      };
    }
    wire();
    ui.speak(entry.w);

    if (!vocabEntry) {
      lookup(word).then(function (res) {
        if (!m.el.isConnected) return;
        if (res) { entry.def = res.def; entry.pos = res.pos; entry.ex = res.ex || ''; entry.w = res.w; }
        else entry.def = '';
        m.el.innerHTML = body();
        if (!res) m.el.querySelector('#wp-def').innerHTML = '<i>Arti tidak ditemukan (mungkin sedang offline). Kamu bisa menulis artimu sendiri.</i>';
        wire();
      });
    }
  }

  const lookupCache = {};
  function lookup(word) {
    const w = word.toLowerCase();
    if (lookupCache[w] !== undefined) return Promise.resolve(lookupCache[w]);
    return fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data[0]) return (lookupCache[w] = null);
        const mean = data[0].meanings && data[0].meanings[0];
        const d = mean && mean.definitions && mean.definitions[0];
        const res = d ? { w: data[0].word || w, pos: mean.partOfSpeech || '', def: d.definition, ex: d.example || '' } : null;
        return (lookupCache[w] = res);
      })
      .catch(function () { return null; });
  }

  /* Speech recognition wrapper. Returns null when the browser has no support. */
  function recognizer() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 3;
    return r;
  }

  function norm(s) {
    return s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  }

  /* How much of the target sentence was said (0..1) plus per-word hits. */
  function speechScore(target, heardList) {
    const t = norm(target);
    let best = { score: 0, hits: [] };
    heardList.forEach(function (heard) {
      const h = norm(heard);
      const pool = h.slice();
      const hits = t.map(function (w) {
        const i = pool.indexOf(w);
        if (i >= 0) { pool.splice(i, 1); return true; }
        return false;
      });
      const score = hits.filter(Boolean).length / t.length;
      if (score > best.score) best = { score: score, hits: hits };
    });
    return { score: best.score, hits: best.hits, words: t };
  }

  function levelTag(level) {
    return '<span class="lvl lvl' + level + '">L' + level + '</span>';
  }

  function header(title, back) {
    return '<div class="page-head">' + (back ? '<a class="back" href="' + back + '">←</a>' : '') + '<h1>' + title + '</h1></div>';
  }

  App.common = { stars: stars, tokenize: tokenize, vocabIndex: vocabIndex, wordPopup: wordPopup, recognizer: recognizer, speechScore: speechScore, levelTag: levelTag, header: header };
})();
