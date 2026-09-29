/* Word Garden (personal word bank with spaced repetition) and word games. */
(function () {
  const ui = App.ui, S = App.store, R = App.rewards, C = App.common;
  App.views = App.views || {};
  const PLANTS = ['🌰', '🌱', '🌿', '🪴', '🌳', '🌸'];
  const PLANT_NAMES = ['Seed', 'Sprout', 'Leafy', 'Growing', 'Tree (mastered)', 'Blossom (mastered)'];

  /* Every glossary word in the app, used for wrong answer choices and as a fallback pool. */
  function allVocab() {
    const out = {};
    App.content.readings().forEach(function (r) { (r.vocab || []).forEach(function (v) { out[v.w.toLowerCase()] = v; }); });
    App.content.videos().forEach(function (v) { (v.vocab || []).forEach(function (w) { if (!out[w.w.toLowerCase()]) out[w.w.toLowerCase()] = w; }); });
    return Object.values(out);
  }

  function myWords(p) { return Object.keys(p.words).map(function (k) { return Object.assign({ key: k }, p.words[k]); }); }

  function meaningOf(w, p) {
    return w.def || w.id || '';
  }

  App.views.words = function () {
    const p = S.profile();
    const words = myWords(p).sort(function (a, b) { return b.added - a.added; });
    const due = App.srs.due(p);
    const mastered = App.srs.masteredCount(p);

    ui.$('#app').innerHTML =
      C.header('🌼 Word Garden') +
      '<div class="grid3">' +
      '<div class="card stat"><b>' + words.length + '</b><small>words planted</small></div>' +
      '<div class="card stat"><b>' + mastered + '</b><small>mastered 🌳</small></div>' +
      '<div class="card stat ' + (due.length ? 'warn' : '') + '"><b>' + due.length + '</b><small>need water 💧</small></div>' +
      '</div>' +
      '<h2 class="section-title">Games <small>Latihan kata</small></h2>' +
      '<div class="game-grid">' +
      '<a class="card game" href="#/words/review"><span>💧</span><b>Water my words</b><small>Review (spaced repetition)</small></a>' +
      '<a class="card game" href="#/words/match"><span>🧩</span><b>Match Race</b><small>Pair words & meanings fast</small></a>' +
      '<a class="card game" href="#/words/spell"><span>🐝</span><b>Spelling Bee</b><small>Listen & type</small></a>' +
      '<a class="card game" href="#/words/gap"><span>🕳️</span><b>Fill the Gap</b><small>Word in a sentence</small></a>' +
      '</div>' +
      '<div class="row between wrap"><h2 class="section-title">My garden</h2>' +
      '<div class="row gap-s"><input id="wsearch" placeholder="🔎 Search" class="small-input"><button class="btn small" id="addw">➕ Add word</button></div></div>' +
      '<p class="small muted">' + PLANTS.map(function (pl, i) { return pl + ' ' + PLANT_NAMES[i]; }).join(' · ') + '. Jawab benar saat review agar tanamanmu tumbuh!</p>' +
      '<div class="garden" id="garden"></div>';

    const today = S.todayKey();
    function draw(filter) {
      const list = words.filter(function (w) { return !filter || w.w.toLowerCase().indexOf(filter) >= 0 || (w.id || '').toLowerCase().indexOf(filter) >= 0; });
      ui.$('#garden').innerHTML = list.length ? list.map(function (w) {
        const thirsty = w.due <= today;
        return '<button class="plant ' + (thirsty ? 'thirsty' : '') + '" data-k="' + ui.esc(w.key) + '"><span class="pl">' + PLANTS[w.box] + '</span><b>' + ui.esc(w.w) + '</b>' + (thirsty ? '<i>💧</i>' : '') + '</button>';
      }).join('') : '<p class="muted">Belum ada kata. Baca atau tonton video, lalu ketuk kata untuk menyimpannya! 🌱</p>';
      ui.$all('.plant').forEach(function (b) {
        b.onclick = function () { wordDetail(b.dataset.k); };
      });
    }
    draw('');
    ui.$('#wsearch').oninput = function () { draw(this.value.trim().toLowerCase()); };
    ui.$('#addw').onclick = function () {
      const m = ui.modal('<h2>➕ Add a word</h2><label>English word<input id="aw-w"></label><label>Meaning (English or Indonesian)<input id="aw-d"></label><label>Example sentence (optional)<input id="aw-e"></label><div class="row gap"><button class="btn primary" id="aw-go">Plant 🌱</button><button class="btn" data-close>Cancel</button></div>');
      ui.$('#aw-go', m.el).onclick = function () {
        const w = ui.$('#aw-w', m.el).value.trim(), d = ui.$('#aw-d', m.el).value.trim();
        if (!w || !d) { ui.toast('Isi kata dan artinya.'); return; }
        if (App.srs.addWord(p, { w: w, def: d, ex: ui.$('#aw-e', m.el).value.trim() }, 'My own word')) { S.save(); R.track('newword', 1); }
        m.close(); App.views.words();
      };
    };
  };

  function wordDetail(key) {
    const p = S.profile();
    const w = p.words[key];
    if (!w) return;
    const m = ui.modal('<div class="word-pop"><div class="word-head"><h2>' + PLANTS[w.box] + ' ' + ui.esc(w.w) + '</h2><button class="btn icon" data-say>🔊</button></div>' +
      (w.pos ? '<div class="pos">' + ui.esc(w.pos) + '</div>' : '') +
      '<p class="def">' + ui.esc(w.def) + '</p>' + (w.id ? '<p class="indo">🇮🇩 ' + ui.esc(w.id) + '</p>' : '') +
      (w.ex ? '<p class="ex">“' + ui.esc(w.ex) + '”</p>' : '') +
      '<p class="small muted">From: ' + ui.esc(w.source || '-') + ' · ✅ ' + w.right + ' ❌ ' + w.wrong + ' · ' + PLANT_NAMES[w.box] + '</p>' +
      '<div class="row gap"><button class="btn danger small" data-del>Remove</button><button class="btn" data-close>Close</button></div></div>');
    ui.$('[data-say]', m.el).onclick = function () { ui.sayWord(w.w, { then: w.ex }); };
    ui.$('[data-del]', m.el).onclick = function () {
      if (!confirm('Hapus kata "' + w.w + '"?')) return;
      delete p.words[key]; S.save(); m.close(); App.views.words();
    };
    ui.sayWord(w.w);
  }

  /* ---------------- Games ---------------- */
  App.views.wordGame = function (kind) {
    ({ review: review, match: match, spell: spell, gap: gap })[kind]();
  };

  function gameShell(title, sub) {
    ui.$('#app').innerHTML = '<div class="lesson-top"><a class="back" href="#/words">✕</a><div class="lt-title">' + title + '</div></div>' +
      '<p class="muted center small">' + sub + '</p><div id="game"></div>';
    return ui.$('#game');
  }

  function endScreen(box, title, right, total, xp) {
    ui.sfx.win();
    if (total && right / total >= 0.8) ui.confetti(120);
    box.innerHTML = '<div class="card center celebrate"><div class="big-emoji">🌟</div><h2>' + title + '</h2>' +
      (total ? '<p><b>' + right + ' / ' + total + '</b> correct</p>' : '') +
      '<p class="reward-line">+' + xp + ' XP</p><div class="row center gap"><a class="btn" href="#/words">Word Garden</a><button class="btn primary" id="again">Play again 🔁</button></div></div>';
    ui.$('#again').onclick = function () { App.route(); };
  }

  function pool(p, min) {
    let list = myWords(p);
    if (list.length < min) {
      const extra = allVocab().filter(function (v) { return !p.words[v.w.toLowerCase()]; })
        .map(function (v) { return Object.assign({ key: v.w.toLowerCase(), box: 0, fromLibrary: true }, v); });
      list = list.concat(ui.shuffle(extra).slice(0, min - list.length));
    }
    return list;
  }

  function distractors(correct, field, n) {
    const others = allVocab().filter(function (v) { return v.w.toLowerCase() !== correct.w.toLowerCase() && v[field]; });
    return ui.shuffle(others).slice(0, n).map(function (v) { return v[field]; });
  }

  /* Spaced repetition review: choose the right meaning. */
  function review() {
    const p = S.profile();
    const box = gameShell('💧 Water my words', 'Pilih arti yang benar. Benar = tanaman tumbuh, salah = kata akan muncul lagi.');
    let keys = App.srs.due(p);
    let practice = false;
    if (!keys.length) {
      practice = true;
      keys = ui.shuffle(Object.keys(p.words)).slice(0, 8);
      if (!keys.length) {
        box.innerHTML = '<div class="card center"><div class="big-emoji">🌱</div><h2>Your garden is empty</h2><p>Mulai dengan membaca 1 cerita. Kosa katanya akan otomatis ditanam di sini.</p><a class="btn primary" href="#/read">Go read 📚</a></div>';
        return;
      }
    }
    keys = ui.shuffle(keys).slice(0, 12);
    let i = 0, right = 0;
    function card() {
      if (i >= keys.length) {
        p.stats.wordsReviewed += keys.length;
        S.save();
        R.track('review', keys.length);
        const xp = right * 3 + 5;
        R.award(xp, Math.ceil(right / 2), 'Word review');
        endScreen(box, practice ? 'Practice done!' : 'All words watered! 💧', right, keys.length, xp);
        return;
      }
      const w = p.words[keys[i]];
      const correct = meaningOf(w, p);
      const opts = ui.shuffle([correct].concat(distractors(w, 'def', 3)));
      box.innerHTML = '<div class="card center">' +
        (practice && i === 0 ? '<p class="small pill">Semua kata sudah disiram hari ini — ini latihan tambahan 🙂</p>' : '') +
        '<div class="bar thin"><i style="width:' + (100 * i / keys.length) + '%"></i></div>' +
        '<div class="review-word"><span class="pl">' + PLANTS[w.box] + '</span><h2>' + ui.esc(w.w) + '</h2><button class="btn icon" id="say">🔊</button></div>' +
        (w.ex ? '<p class="ex small">“' + ui.esc(w.ex) + '”</p>' : '') +
        '<div class="choices">' + opts.map(function (o) { return '<button class="choice" data-v="' + ui.esc(o) + '">' + ui.esc(o) + '</button>'; }).join('') + '</div>' +
        '<div id="fb"></div></div>';
      ui.$('#say').onclick = function () { ui.sayWord(w.w); };
      ui.sayWord(w.w);
      ui.$all('.choice', box).forEach(function (b) {
        b.onclick = function () {
          const ok = b.dataset.v === correct;
          App.srs.grade(p, keys[i], ok);
          if (ok) right++;
          S.save();
          ui.$all('.choice', box).forEach(function (x) { x.disabled = true; if (x.dataset.v === correct) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          ok ? ui.sfx.right() : ui.sfx.wrong();
          ui.$('#fb').innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? PLANTS[p.words[keys[i]].box] + ' Growing!' : '🥀 It will come back soon.') + '</b>' + (w.id && p.settings.showIndo ? '<p>🇮🇩 ' + ui.esc(w.id) + '</p>' : '') + '</div>';
          setTimeout(function () { i++; card(); }, ok ? 900 : 2000);
        };
      });
    }
    card();
  }

  /* Match race: 6 pairs against the clock. */
  function match() {
    const p = S.profile();
    const box = gameShell('🧩 Match Race', 'Pasangkan kata dengan artinya secepat mungkin!');
    const words = ui.shuffle(pool(p, 6)).slice(0, 6);
    const start = Date.now();
    let sel = null, matched = 0, mistakes = 0;
    box.innerHTML = '<div class="card"><div class="row between"><b id="timer">⏱ 0s</b><small class="muted">Mistakes: <b id="mis">0</b></small></div>' +
      '<div class="match"><div class="mcol">' + ui.shuffle(words).map(function (w) { return '<button class="mbtn" data-k="' + ui.esc(w.key) + '" data-side="l">' + ui.esc(w.w) + '</button>'; }).join('') + '</div>' +
      '<div class="mcol">' + ui.shuffle(words).map(function (w) { return '<button class="mbtn def" data-k="' + ui.esc(w.key) + '" data-side="r">' + ui.esc(meaningOf(w, p)) + '</button>'; }).join('') + '</div></div></div>';
    const timer = setInterval(function () { const t = ui.$('#timer'); if (t) t.textContent = '⏱ ' + Math.round((Date.now() - start) / 1000) + 's'; }, 500);
    App.shell.onLeave(function () { clearInterval(timer); });
    ui.$all('.mbtn', box).forEach(function (b) {
      b.onclick = function () {
        if (b.classList.contains('ok')) return;
        if (!sel || sel.dataset.side === b.dataset.side) {
          ui.$all('.mbtn.sel', box).forEach(function (x) { x.classList.remove('sel'); });
          sel = b; b.classList.add('sel');
          if (b.dataset.side === 'l') ui.sayWord(b.textContent);
          return;
        }
        if (sel.dataset.k === b.dataset.k) {
          sel.classList.remove('sel'); sel.classList.add('ok'); b.classList.add('ok'); ui.sfx.right(); matched++;
          if (p.words[b.dataset.k]) App.srs.grade(p, b.dataset.k, true);
          if (matched === words.length) {
            clearInterval(timer);
            const secs = Math.round((Date.now() - start) / 1000);
            S.save();
            R.track('game', 1);
            const xp = Math.max(8, 25 - mistakes * 2 - Math.floor(secs / 10));
            R.award(xp, 3, 'Match Race');
            endScreen(box, 'Finished in ' + secs + 's! ⚡', words.length, words.length + mistakes, xp);
          }
        } else {
          mistakes++; ui.$('#mis').textContent = mistakes; ui.sfx.wrong();
          b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 400);
          sel.classList.remove('sel');
        }
        sel = null;
      };
    });
  }

  /* Spelling bee: hear the word, type it. */
  function spell() {
    const p = S.profile();
    const box = gameShell('🐝 Spelling Bee', 'Dengarkan kata, lalu ketik ejaannya.');
    const words = ui.shuffle(pool(p, 6)).filter(function (w) { return /^[a-z-]+$/i.test(w.w); }).slice(0, 6);
    let i = 0, right = 0;
    function card() {
      if (i >= words.length) {
        S.save();
        R.track('game', 1);
        const xp = right * 4 + 5;
        R.award(xp, right, 'Spelling Bee');
        endScreen(box, 'Buzz buzz! 🐝', right, words.length, xp);
        return;
      }
      const w = words[i];
      let hint = 1;
      box.innerHTML = '<div class="card center"><div class="bar thin"><i style="width:' + (100 * i / words.length) + '%"></i></div>' +
        '<button class="btn primary big" id="say">🔊 Hear the word</button>' +
        '<p class="small muted">Meaning: ' + ui.esc(meaningOf(w, p)) + '</p>' +
        '<input id="sp" class="spell-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type here…">' +
        '<p class="hint" id="hint">' + ui.esc(w.w[0]) + '<span>' + '_ '.repeat(w.w.length - 1) + '</span></p>' +
        '<div class="row center gap"><button class="btn" id="hintb">💡 Hint</button><button class="btn primary" id="go">Check</button></div><div id="fb"></div></div>';
      const say = function () { ui.sayWord(w.w, { slow: true }); };
      ui.$('#say').onclick = say; say();
      const inp = ui.$('#sp'); inp.focus();
      ui.$('#hintb').onclick = function () { hint = Math.min(w.w.length - 1, hint + 1); ui.$('#hint').innerHTML = ui.esc(w.w.slice(0, hint)) + '<span>' + '_ '.repeat(w.w.length - hint) + '</span>'; };
      function check() {
        const ok = inp.value.trim().toLowerCase() === w.w.toLowerCase();
        if (p.words[w.key]) App.srs.grade(p, w.key, ok);
        if (ok) right++;
        ok ? ui.sfx.right() : ui.sfx.wrong();
        ui.$('#fb').innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? 'Perfect spelling! 🐝' : 'The answer is: ' + ui.esc(w.w)) + '</b></div>';
        ui.$('#go').disabled = true; inp.readOnly = true;
        setTimeout(function () { i++; card(); }, ok ? 900 : 2200);
      }
      ui.$('#go').onclick = check;
      inp.onkeydown = function (e) { if (e.key === 'Enter') check(); };
    }
    card();
  }

  /* Fill the gap: example sentence with the word hidden. */
  function gap() {
    const p = S.profile();
    const box = gameShell('🕳️ Fill the Gap', 'Pilih kata yang tepat untuk melengkapi kalimat.');
    function blanked(w) {
      if (!w.ex) return null;
      const forms = (w.forms && w.forms.length ? w.forms : [w.w]).concat([w.w]);
      for (let k = 0; k < forms.length; k++) {
        const re = new RegExp('\\b' + forms[k].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (re.test(w.ex)) return { text: w.ex.replace(re, '_____'), answer: w.ex.match(re)[0] };
      }
      return null;
    }
    // Prefer my words that have example sentences; top up from the library glossary
    const lib = {};
    allVocab().forEach(function (v) { lib[v.w.toLowerCase()] = v; });
    let items = myWords(p).map(function (w) { return Object.assign({}, lib[w.key] || {}, w); })
      .map(function (w) { return { w: w, b: blanked(w) }; }).filter(function (x) { return x.b; });
    if (items.length < 6) {
      items = items.concat(ui.shuffle(allVocab()).map(function (v) { return { w: Object.assign({ key: v.w.toLowerCase() }, v), b: blanked(v) }; })
        .filter(function (x) { return x.b && !items.some(function (y) { return y.w.key === x.w.key; }); })).slice(0, 6);
    }
    items = ui.shuffle(items).slice(0, 6);
    let i = 0, right = 0;
    function card() {
      if (i >= items.length) {
        S.save(); R.track('game', 1);
        const xp = right * 4 + 5;
        R.award(xp, right, 'Fill the Gap');
        endScreen(box, 'Gap master! 🧠', right, items.length, xp);
        return;
      }
      const it = items[i];
      const opts = ui.shuffle([it.b.answer].concat(ui.shuffle(allVocab().filter(function (v) { return v.w.toLowerCase() !== it.w.w.toLowerCase(); })).slice(0, 3).map(function (v) { return v.w; })));
      box.innerHTML = '<div class="card center"><div class="bar thin"><i style="width:' + (100 * i / items.length) + '%"></i></div>' +
        '<p class="gap-sentence">' + ui.esc(it.b.text) + '</p>' +
        '<div class="choices two">' + opts.map(function (o) { return '<button class="choice" data-v="' + ui.esc(o) + '">' + ui.esc(o) + '</button>'; }).join('') + '</div><div id="fb"></div></div>';
      ui.$all('.choice', box).forEach(function (b) {
        b.onclick = function () {
          const ok = b.dataset.v.toLowerCase() === it.b.answer.toLowerCase();
          if (p.words[it.w.key]) App.srs.grade(p, it.w.key, ok);
          if (ok) right++;
          ui.$all('.choice', box).forEach(function (x) { x.disabled = true; if (x.dataset.v.toLowerCase() === it.b.answer.toLowerCase()) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          ok ? ui.sfx.right() : ui.sfx.wrong();
          ui.speak(it.w.ex);
          ui.$('#fb').innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'no') + '"><b>' + ui.esc(it.w.ex) + '</b></div>';
          setTimeout(function () { i++; card(); }, 2000);
        };
      });
    }
    card();
  }
})();
