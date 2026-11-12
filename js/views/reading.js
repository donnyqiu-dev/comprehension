/* Reading library + reading lesson (Eigo-style connected steps, ReadTheory-style quiz and adaptive level). */
(function () {
  const ui = App.ui, S = App.store, R = App.rewards, C = App.common;
  App.views = App.views || {};

  const STEPS = [
    { id: 'words', icon: '🌱', label: 'Words' },
    { id: 'read', icon: '📖', label: 'Read' },
    { id: 'quiz', icon: '❓', label: 'Quiz' },
    { id: 'practice', icon: '🧩', label: 'Match' },
    { id: 'speak', icon: '🎤', label: 'Speak' },
    { id: 'write', icon: '✏️', label: 'Write' },
    { id: 'done', icon: '🏆', label: 'Done' }
  ];

  let filter = { level: 'mine', topic: 'all' };

  /* ---------------- Library ---------------- */
  App.views.library = function () {
    const p = S.profile();
    p.levelProgress = p.levelProgress || { up: 0, down: 0 };
    const all = App.content.readings();
    const topics = ['all'].concat(Array.from(new Set(all.map(function (r) { return r.topic; }))));
    const list = all.filter(function (r) {
      const lvOk = filter.level === 'all' ? true : filter.level === 'mine' ? Math.abs(r.level - p.readingLevel) <= 1 : r.level === Number(filter.level);
      return lvOk && (filter.topic === 'all' || r.topic === filter.topic);
    }).sort(function (a, b) { return a.level - b.level; });

    ui.$('#app').innerHTML =
      C.header('📚 Reading Library') +
      '<div class="card level-banner">' +
      '<div><small class="muted">YOUR READING LEVEL · Level membacamu</small><h2>' + App.LEVELS[p.readingLevel].name + '</h2><p class="small">' + App.LEVELS[p.readingLevel].grade + '</p></div>' +
      '<div class="lvl-meter"><small>Level up</small><div class="dots">' +
      [0, 1].map(function (i) { return '<i class="' + (i < p.levelProgress.up ? 'on' : '') + '"></i>'; }).join('') +
      '</div><small class="muted">Skor ≥80% di levelmu 2x → naik level</small></div>' +
      '</div>' +
      '<div class="chips">' +
      [['mine', '⭐ For me'], ['all', 'All']].concat(App.levelIds().map(function (l) { return [String(l), 'L' + l]; })).map(function (f) {
        return '<button class="chipbtn ' + (filter.level === f[0] ? 'on' : '') + '" data-lv="' + f[0] + '">' + f[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="chips">' + topics.map(function (t) {
        return '<button class="chipbtn small ' + (filter.topic === t ? 'on' : '') + '" data-tp="' + t + '">' + (t === 'all' ? 'All topics' : t) + '</button>';
      }).join('') + '</div>' +
      '<div class="lib-grid">' +
      (list.length ? list.map(function (r) {
        const res = p.readings[r.id];
        return '<a class="card lib-card' + (res ? ' done' : '') + '" href="#/read/' + r.id + '">' +
          '<div class="lib-emoji">' + r.emoji + '</div>' +
          '<div class="lib-info"><div class="row gap-s">' + C.levelTag(r.level) + '<small class="muted">' + r.genre + ' · ' + r.topic + (r.custom ? ' · ✨ Custom' : '') + '</small></div>' +
          '<h3>' + ui.esc(r.title) + '</h3>' +
          (res ? C.stars(res.best) + ' <small class="muted">Best ' + Math.round(res.best * 100) + '%</small>' : '<small class="new">NEW</small>') +
          '</div></a>';
      }).join('') : '<p class="muted">Belum ada bacaan untuk filter ini.</p>') +
      '</div>';

    ui.$all('[data-lv]').forEach(function (b) { b.onclick = function () { filter.level = b.dataset.lv; App.views.library(); }; });
    ui.$all('[data-tp]').forEach(function (b) { b.onclick = function () { filter.topic = b.dataset.tp; App.views.library(); }; });
  };

  /* ---------------- Lesson ---------------- */
  App.views.reading = function (id) {
    const r = App.content.reading(id);
    const p = S.profile();
    if (!r) { ui.$('#app').innerHTML = '<div class="card">Bacaan tidak ditemukan. <a href="#/read">Kembali</a></div>'; return; }
    const vIdx = C.vocabIndex(r.vocab);
    const firstTime = !p.readings[r.id];
    const st = { step: 0, qi: 0, answers: [], chosen: null, checked: false, xp: 0, levelMsg: '', started: Date.now() };
    const steps = STEPS.filter(function (s) {
      if (s.id === 'words' || s.id === 'practice') return r.vocab && r.vocab.length >= 2;
      if (s.id === 'speak') return !!r.speak;
      if (s.id === 'write') return !!r.write;
      return true;
    });

    function go(n) { st.step = n; ui.stopSpeaking(); render(); window.scrollTo(0, 0); }
    function next() { go(st.step + 1); }

    function stepper() {
      return '<div class="stepper">' + steps.map(function (s, i) {
        return '<div class="st ' + (i < st.step ? 'past' : i === st.step ? 'now' : '') + '"><span>' + (i < st.step ? '✓' : s.icon) + '</span><small>' + s.label + '</small></div>';
      }).join('') + '</div>';
    }

    /* Text with numbered paragraphs, plus (for Year 6 style texts) an intro box, glossary and source line. */
    function passageHtml() {
      return '<article class="passage" id="passage">' +
        (r.intro ? '<div class="intro-box">' + ui.esc(r.intro) + '</div>' : '') +
        (r.heading ? '<h3 class="text-heading">' + ui.esc(r.heading) + '</h3>' : '') +
        r.text.map(function (para, i) {
          return '<p data-pi="' + i + '"' + (r.poem ? ' class="verse"' : '') + '><span class="pnum" aria-hidden="true">' + (i + 1) + '</span>' + C.tokenize(para, vIdx, i) + '</p>';
        }).join('') +
        (r.source ? '<p class="source">' + ui.esc(r.source) + '</p>' : '') +
        (r.glossary && r.glossary.length ? '<div class="glossary"><b>Glossary</b>' + r.glossary.map(function (g) {
          return '<span><i>' + ui.esc(g.w) + '</i> — ' + ui.esc(g.def) + '</span>';
        }).join('') + '</div>' : '') +
        '</article>';
    }

    function wirePassage(root) {
      root.addEventListener('click', function (e) {
        const w = e.target.closest('.w');
        if (!w) return;
        if (st.copy) { st.copy.tap(w); return; } // "find and copy" question: tapping selects words
        const v = vIdx[w.textContent.toLowerCase().replace(/’/g, '\'')];
        C.wordPopup(v ? v.w : w.textContent, v || null, r.title);
      });
    }

    function render() {
      const s = steps[st.step].id;
      const app = ui.$('#app');
      app.innerHTML =
        '<div class="lesson-top"><a class="back" href="#/read">✕</a><div class="lt-title">' + r.emoji + ' ' + ui.esc(r.title) + ' ' + C.levelTag(r.level) + '</div></div>' +
        stepper() + '<div id="stage"></div>';
      const stage = ui.$('#stage');
      ({ words: stepWords, read: stepRead, quiz: stepQuiz, practice: stepPractice, speak: stepSpeak, write: stepWrite, done: stepDone })[s](stage);
    }

    /* 1. Vocabulary preview */
    function stepWords(stage) {
      let i = 0;
      function card() {
        const v = r.vocab[i];
        stage.innerHTML =
          '<div class="card center">' +
          '<p class="muted small">Kenali kata-kata penting sebelum membaca · ' + (i + 1) + '/' + r.vocab.length + '</p>' +
          '<div class="flash" id="flash"><div class="flash-inner">' +
          '<div class="flash-front"><h2>' + ui.esc(v.w) + '</h2><small>' + ui.esc(v.pos || '') + '</small><p class="muted small">Tap to flip 🔄</p></div>' +
          '<div class="flash-back"><p class="def">' + ui.esc(v.def) + '</p>' + (p.settings.showIndo && v.id ? '<p class="indo">🇮🇩 ' + ui.esc(v.id) + '</p>' : '') + (v.ex ? '<p class="ex">“' + ui.esc(v.ex) + '”</p>' : '') + '</div>' +
          '</div></div>' +
          '<div class="row center gap"><button class="btn" id="say">🔊 Listen</button>' +
          (i > 0 ? '<button class="btn" id="prev">←</button>' : '') +
          '<button class="btn primary" id="nx">' + (i < r.vocab.length - 1 ? 'Next word →' : 'Start reading 📖') + '</button></div></div>';
        ui.$('#flash').onclick = function () { this.classList.toggle('flipped'); ui.sfx.pop(); };
        ui.$('#say').onclick = function () { ui.sayWord(v.w, { then: v.ex }); };
        const pv = ui.$('#prev'); if (pv) pv.onclick = function () { i--; card(); };
        ui.$('#nx').onclick = function () {
          if (i < r.vocab.length - 1) { i++; card(); return; }
          let added = 0;
          r.vocab.forEach(function (w) { if (App.srs.addWord(p, w, r.title)) added++; });
          S.save();
          if (added) { R.track('newword', added); ui.toast('🌱 ' + added + ' kata baru ditanam di Word Garden!'); }
          next();
        };
        ui.sayWord(v.w);
      }
      ui.preloadWords(r.vocab.map(function (w) { return w.w; }));
      card();
    }

    /* 2. Read with tap-to-define and read-aloud */
    function stepRead(stage) {
      stage.innerHTML =
        '<div class="card">' +
        '<div class="row between wrap"><p class="small muted">Tap kata mana saja untuk melihat artinya. Kata <span class="vocab">berwarna</span> = kosa kata penting.</p>' +
        '<div class="row gap-s"><button class="btn small" id="aloud">🔊 Read to me</button><select id="rate" class="small-select" title="Kecepatan"><option value="0.7">🐢 Slow</option><option value="0.85">🙂 Normal</option><option value="1">🐇 Fast</option></select></div></div>' +
        passageHtml() +
        '<div class="row center"><button class="btn primary big" id="toquiz">I finished reading ✅</button></div></div>';
      const rate = ui.$('#rate');
      rate.value = String(p.settings.ttsRate >= 0.95 ? 1 : p.settings.ttsRate <= 0.75 ? 0.7 : 0.85);
      wirePassage(ui.$('#passage'));
      let reading = false;
      ui.$('#aloud').onclick = function () {
        if (reading) { reading = false; ui.stopSpeaking(); this.textContent = '🔊 Read to me'; clearHi(); return; }
        reading = true; this.textContent = '⏹ Stop';
        const btn = this;
        readPara(0);
        function readPara(pi) {
          if (!reading || pi >= r.text.length) { reading = false; btn.textContent = '🔊 Read to me'; clearHi(); return; }
          ui.speak(r.text[pi], {
            rate: Number(rate.value),
            onboundary: function (e) {
              if (e.name && e.name !== 'word') return;
              clearHi();
              const spans = ui.$all('.w[data-p="' + pi + '"]');
              let hit = null;
              spans.forEach(function (s) { if (Number(s.dataset.i) <= e.charIndex) hit = s; });
              if (hit) { hit.classList.add('speaking'); }
            },
            onend: function () { readPara(pi + 1); }
          });
        }
      };
      function clearHi() { ui.$all('.w.speaking').forEach(function (s) { s.classList.remove('speaking'); }); }
      ui.$('#toquiz').onclick = next;
    }

    /* 3. Comprehension quiz, one question at a time.
       Kinds (q.kind): 'mc' (default, multiple choice), 'copy' (find and copy a phrase from the text),
       'factop' (fact or opinion table) and 'open' (written answer, compared with an example answer).
       q.marks (default 1) and q.warm (warm up question) follow the Year 6 question books. */
    function marksOf(q) { return q.marks || 1; }
    function noteAnswer(q, got, auto, extra) {
      const m = marksOf(q);
      st.answers.push(Object.assign({ type: q.type, kind: q.kind || 'mc', marks: m, got: got, auto: auto, ok: got === m }, extra || {}));
      if (auto) {
        p.skills[q.type] = p.skills[q.type] || { c: 0, t: 0 };
        p.skills[q.type].t++;
        p.stats.questionsTotal++;
        if (got === m) { p.skills[q.type].c++; p.stats.questionsRight++; R.track('correct', 1); }
      }
      S.save();
    }
    function normPhrase(x) {
      return String(x).toLowerCase().replace(/[’‘]/g, '\'').replace(/[“”"]/g, '').replace(/[^a-z0-9'\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function stepQuiz(stage) {
      const q = r.questions[st.qi];
      const kind = q.kind || 'mc';
      const t = App.QTYPES[q.type] || App.QTYPES.detail;
      const m = marksOf(q);
      const last = st.qi === r.questions.length - 1;
      st.copy = null;
      let body = '';
      if (kind === 'mc') {
        body = '<div class="choices">' + q.choices.map(function (c, i) {
          return '<button class="choice" data-i="' + i + '"><span class="letter">' + 'ABCD'[i] + '</span>' + ui.esc(c) + '</button>';
        }).join('') + '</div>';
      } else if (kind === 'copy') {
        body = '<p class="small muted">👆 Di teks, ketuk <b>kata pertama</b> lalu <b>kata terakhir</b> dari kutipan yang kamu pilih.' +
          (q.para ? ' Lihat paragraf yang ditandai.' : '') + '</p>' +
          '<div class="copy-box" id="copy-sel"><i class="muted">Belum ada kutipan yang dipilih</i></div>' +
          '<div class="row gap-s"><button class="btn small" id="copy-clear">🧽 Clear</button></div>';
      } else if (kind === 'factop') {
        body = '<table class="factop"><tr><th></th><th>Fact</th><th>Opinion</th></tr>' + q.items.map(function (it, i) {
          return '<tr data-i="' + i + '"><td>' + ui.esc(it.s) + '</td><td><button class="fo" data-v="fact">◯</button></td><td><button class="fo" data-v="opinion">◯</button></td></tr>';
        }).join('') + '</table>';
      } else {
        body = '<textarea id="open-ans" rows="4" placeholder="Write your answer in English…"></textarea>' +
          '<small class="muted" id="open-wc">0 words</small>';
      }
      stage.innerHTML =
        '<div class="quiz-layout">' +
        '<details class="card passage-side" ' + (window.innerWidth > 900 || kind === 'copy' ? 'open' : '') + '><summary>📄 Show the text / Lihat teks</summary>' + passageHtml() + '</details>' +
        '<div class="card quiz-card">' +
        '<div class="row between"><span class="qtype">' + (q.warm ? '<span class="warm">Warm up</span> ' : '') + t.icon + ' ' + t.label + ' <small>· ' + t.id + '</small></span>' +
        '<small class="muted">Question ' + (st.qi + 1) + ' / ' + r.questions.length + (q.marks ? ' · ' + m + ' mark' + (m > 1 ? 's' : '') : '') + '</small></div>' +
        '<div class="bar thin"><i style="width:' + (100 * st.qi / r.questions.length) + '%"></i></div>' +
        '<h2 class="question">' + ui.esc(q.q) + ' <button class="btn icon small" id="sayq" title="Dengarkan">🔊</button></h2>' +
        body +
        '<div id="feedback"></div>' +
        '<div class="row end"><button class="btn primary" id="check" disabled>' + (kind === 'open' ? 'Submit ✍️' : 'Check ✔') + '</button></div>' +
        '</div></div>';
      wirePassage(ui.$('#passage'));
      if (q.para) {
        for (let i = q.para[0]; i <= q.para[1]; i++) {
          const el = ui.$('#passage p[data-pi="' + (i - 1) + '"]');
          if (el) el.classList.add('focus');
        }
      }
      st.chosen = null; st.checked = false;
      const check = ui.$('#check');
      ui.$('#sayq').onclick = function () {
        ui.speak(q.q + (kind === 'mc' ? ' ' + q.choices.map(function (c, i) { return 'ABCD'[i] + '. ' + c; }).join('. ') : ''));
      };
      function done(ok, html) {
        st.checked = true;
        ok === true ? ui.sfx.right() : ok === false ? ui.sfx.wrong() : ui.sfx.pop();
        ui.$('#feedback').innerHTML = html;
        check.disabled = false;
        check.textContent = last ? 'See my score 🏁' : 'Next →';
      }
      function praise() { return pick(['Great job! 🎉', 'Correct! ⭐', 'You got it! 💪', 'Excellent! 🌟']); }

      if (kind === 'mc') {
        ui.$all('.choice', stage).forEach(function (b) {
          b.onclick = function () {
            if (st.checked) return;
            ui.$all('.choice', stage).forEach(function (x) { x.classList.remove('sel'); });
            b.classList.add('sel');
            st.chosen = Number(b.dataset.i);
            check.disabled = false;
          };
        });
      } else if (kind === 'copy') {
        const spans = ui.$all('#passage .w');
        let a = null, z = null;
        function phrase() {
          if (a == null) return '';
          const s1 = spans[a], s2 = spans[z == null ? a : z];
          if (s1.dataset.p === s2.dataset.p) {
            const txt = r.text[Number(s1.dataset.p)];
            return txt.slice(Number(s1.dataset.i), Number(s2.dataset.i) + s2.textContent.length);
          }
          return spans.slice(a, (z == null ? a : z) + 1).map(function (x) { return x.textContent; }).join(' ');
        }
        function show() {
          spans.forEach(function (x, i) { x.classList.toggle('picked', a != null && i >= a && i <= (z == null ? a : z)); });
          const ph = phrase();
          ui.$('#copy-sel').innerHTML = ph ? '“' + ui.esc(ph) + '”' : '<i class="muted">Belum ada kutipan yang dipilih</i>';
          check.disabled = !ph || st.checked;
        }
        st.copy = {
          tap: function (w) {
            if (st.checked) return;
            const i = spans.indexOf(w);
            if (a == null || z != null) { a = i; z = null; }
            else if (i < a) { z = a; a = i; }
            else z = i;
            ui.sfx.pop();
            show();
          },
          phrase: phrase
        };
        ui.$('#copy-clear').onclick = function () { if (!st.checked) { a = null; z = null; show(); } };
      } else if (kind === 'factop') {
        const picks = {};
        ui.$all('.fo', stage).forEach(function (b) {
          b.onclick = function () {
            if (st.checked) return;
            const row = b.closest('tr');
            ui.$all('.fo', row).forEach(function (x) { x.classList.remove('on'); x.textContent = '◯'; });
            b.classList.add('on'); b.textContent = '✔';
            picks[row.dataset.i] = b.dataset.v;
            check.disabled = Object.keys(picks).length < q.items.length;
          };
        });
        st.factPicks = picks;
      } else {
        const ta = ui.$('#open-ans');
        const min = q.min || 5;
        ta.oninput = function () {
          const n = ui.countWords(ta.value);
          ui.$('#open-wc').textContent = n + ' words' + (n < min ? ' (min ' + min + ')' : '');
          if (!st.checked) check.disabled = n < min;
        };
      }

      check.onclick = function () {
        if (st.checked) {
          if (st.selfPending) return;
          st.copy = null;
          if (!last) { st.qi++; stepQuiz(stage); } else finishQuiz();
          return;
        }
        if (kind === 'mc') {
          if (st.chosen == null) return;
          const ok = st.chosen === q.a;
          noteAnswer(q, ok ? m : 0, true);
          ui.$all('.choice', stage).forEach(function (x) {
            const i = Number(x.dataset.i);
            if (i === q.a) x.classList.add('right'); else if (i === st.chosen) x.classList.add('wrong');
            x.disabled = true;
          });
          done(ok, '<div class="feedback ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? praise() : 'Not quite. 🤔 Let\'s learn why:') + '</b><p>' + ui.esc(q.why || '') + '</p></div>');
        } else if (kind === 'copy') {
          const ph = st.copy.phrase();
          const n = normPhrase(ph);
          const words = n.split(' ').length;
          // right if the chosen words contain an accepted answer without copying much more than needed
          const ok = (q.accept || []).some(function (acc) {
            const an = normPhrase(acc);
            return n.indexOf(an) >= 0 && words <= an.split(' ').length + 4;
          });
          noteAnswer(q, ok ? m : 0, true, { text: ph });
          done(ok, '<div class="feedback ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? praise() : 'Not quite. 🤔') + '</b>' +
            '<p>Answer: “' + ui.esc(q.accept[0]) + '”</p>' + (q.why ? '<p>' + ui.esc(q.why) + '</p>' : '') + '</div>');
        } else if (kind === 'factop') {
          let right = 0;
          ui.$all('.factop tr[data-i]', stage).forEach(function (row) {
            const it = q.items[Number(row.dataset.i)];
            const want = it.fact ? 'fact' : 'opinion';
            const ok = st.factPicks[row.dataset.i] === want;
            if (ok) right++;
            row.classList.add(ok ? 'right' : 'wrong');
            row.insertAdjacentHTML('beforeend', '<td class="fo-ans">' + (ok ? '✅' : '→ ' + (it.fact ? 'Fact' : 'Opinion')) + '</td>');
          });
          // like the question books: all correct = full marks, one wrong = one mark less
          const got = right === q.items.length ? m : Math.max(0, m - (q.items.length - right));
          noteAnswer(q, got, true);
          done(got === m, '<div class="feedback ' + (got === m ? 'ok' : 'no') + '"><b>' + right + ' / ' + q.items.length + ' correct</b>' +
            '<p>' + ui.esc(q.why || 'A fact can be checked and proved. An opinion is what someone thinks or feels.') + '</p></div>');
        } else {
          const text = ui.$('#open-ans').value.trim();
          ui.$('#open-ans').readOnly = true;
          st.checked = true;
          st.selfPending = true;
          check.disabled = true;
          ui.$('#feedback').innerHTML = '<div class="feedback ok"><b>Compare with an example answer:</b><p>' + ui.esc(q.sample || '') + '</p>' +
            '<p class="small">Bandingkan jawabanmu. Jawaban boleh berbeda, asalkan idenya sama dan ada buktinya dari teks' + (m > 1 ? ' (untuk ' + m + ' marks, berikan ' + m + ' poin)' : '') + '.</p>' +
            '<div class="row gap wrap self-mark"><button class="btn small" data-g="' + m + '">✅ Same idea</button>' +
            (m > 1 ? '<button class="btn small" data-g="' + Math.floor(m / 2) + '">🟡 Partly</button>' : '') +
            '<button class="btn small" data-g="0">❌ Not yet</button></div></div>';
          ui.$all('.self-mark button', stage).forEach(function (b) {
            b.onclick = function () {
              const got = Number(b.dataset.g);
              noteAnswer(q, got, false, { text: text });
              p.writings = p.writings || [];
              p.writings.unshift({ at: Date.now(), lesson: r.title, prompt: q.q, text: text + '  [cek mandiri: ' + got + '/' + m + ']' });
              p.writings = p.writings.slice(0, 100);
              S.save();
              st.selfPending = false;
              ui.$all('.self-mark button', stage).forEach(function (x) { x.disabled = true; x.classList.toggle('primary', x === b); });
              done(null, ui.$('#feedback').innerHTML);
              ui.$all('.self-mark button', stage).forEach(function (x) { x.disabled = true; });
            };
          });
        }
      };
    }

    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

    function finishQuiz() {
      // Only automatically marked questions decide the score and the reading level;
      // written answers are self-checked and saved for a parent/teacher to read.
      const auto = st.answers.filter(function (a) { return a.auto; });
      const open = st.answers.filter(function (a) { return !a.auto; });
      const max = auto.reduce(function (s, a) { return s + a.marks; }, 0);
      const got = auto.reduce(function (s, a) { return s + a.got; }, 0);
      const score = max ? got / max : 1;
      st.score = score;
      st.marks = { got: got, max: max, open: open.length, openGot: open.reduce(function (s, a) { return s + a.got; }, 0), openMax: open.reduce(function (s, a) { return s + a.marks; }, 0) };
      const prev = p.readings[r.id];
      p.readings[r.id] = {
        best: Math.max(score, prev ? prev.best : 0),
        first: prev ? prev.first : score,
        last: score,
        attempts: (prev ? prev.attempts : 0) + 1,
        at: Date.now()
      };
      if (score === 1) p.stats.perfect++;
      // Adaptive level (first attempt only, like ReadTheory)
      if (firstTime) adapt(score);
      S.save();
      const xp = Math.round((got * 10 + open.length * 8 + 10) * (firstTime ? 1 : 0.5));
      const coins = got * 2 + open.length * 2 + (score === 1 ? 10 : 0);
      st.xp += xp;
      R.track('reading', 1);
      R.award(xp, coins, 'Reading: ' + r.title);
      if (score === 1) ui.confetti(140);
      next();
    }

    function adapt(score) {
      const lp = p.levelProgress = p.levelProgress || { up: 0, down: 0 };
      const from = p.readingLevel;
      if (score >= 0.8 && r.level >= from) { lp.up++; lp.down = 0; }
      else if (score < 0.5 && r.level <= from) { lp.down++; lp.up = 0; }
      if (lp.up >= 2 && from < App.levelIds().length) {
        p.readingLevel++; lp.up = 0;
        p.levelHistory.push({ from: from, to: p.readingLevel, at: Date.now() });
        st.levelMsg = '⬆️ LEVEL UP! Kamu naik ke ' + App.LEVELS[p.readingLevel].name + '!';
      } else if (lp.down >= 2 && from > 1) {
        p.readingLevel--; lp.down = 0;
        p.levelHistory.push({ from: from, to: p.readingLevel, at: Date.now() });
        st.levelMsg = '🔁 Kita latihan di ' + App.LEVELS[p.readingLevel].name + ' dulu ya. Kamu pasti bisa naik lagi!';
      } else if (lp.up === 1) {
        st.levelMsg = '🔥 Satu lagi skor ≥80% untuk naik level!';
      }
    }

    /* 4. Matching game with this passage's words */
    function stepPractice(stage) {
      const words = ui.shuffle(r.vocab).slice(0, 5);
      const left = ui.shuffle(words), right = ui.shuffle(words);
      let sel = null, matched = 0, mistakes = 0;
      stage.innerHTML =
        '<div class="card"><h2>🧩 Match the word to its meaning</h2><p class="small muted">Pasangkan kata dengan artinya.</p>' +
        '<div class="match"><div class="mcol">' + left.map(function (w) { return '<button class="mbtn" data-k="' + ui.esc(w.w) + '" data-side="l">' + ui.esc(w.w) + '</button>'; }).join('') + '</div>' +
        '<div class="mcol">' + right.map(function (w) { return '<button class="mbtn def" data-k="' + ui.esc(w.w) + '" data-side="r">' + ui.esc(w.def) + '</button>'; }).join('') + '</div></div></div>';
      ui.$all('.mbtn', stage).forEach(function (b) {
        b.onclick = function () {
          if (b.classList.contains('ok')) return;
          if (b.dataset.side === 'l') ui.sayWord(b.dataset.k);
          if (!sel || sel.dataset.side === b.dataset.side) {
            ui.$all('.mbtn.sel', stage).forEach(function (x) { x.classList.remove('sel'); });
            sel = b; b.classList.add('sel'); return;
          }
          if (sel.dataset.k === b.dataset.k) {
            sel.classList.remove('sel'); sel.classList.add('ok'); b.classList.add('ok');
            ui.sfx.right(); matched++;
            App.srs.grade(p, sel.dataset.k.toLowerCase(), true);
            if (matched === words.length) {
              S.save();
              const xp = Math.max(5, 15 - mistakes * 2);
              st.xp += xp;
              R.award(xp, 3, 'Word match: ' + r.title);
              setTimeout(next, 700);
            }
          } else {
            mistakes++; ui.sfx.wrong();
            b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 400);
            sel.classList.remove('sel');
          }
          sel = null;
        };
      });
    }

    /* 5. Speaking (speech recognition when available). There is no Skip button: a way out
       only appears when the microphone does not work, or after 3 honest tries. */
    function stepSpeak(stage) {
      const target = r.speak;
      const rec = C.recognizer();
      let tries = 0;
      stage.innerHTML =
        '<div class="card center"><h2>🎤 Say it out loud!</h2><p class="small muted">Dengarkan dulu, lalu ucapkan kalimat ini.</p>' +
        '<p class="speak-target" id="target">' + ui.esc(target) + '</p>' +
        '<div class="row center gap"><button class="btn" id="listen">🔊 Listen</button><button class="btn" id="slow">🐢 Slow</button>' +
        (rec ? '<button class="btn primary big" id="mic">🎤 Tap & speak</button>' : '') + '</div>' +
        '<div id="speak-res"></div>' +
        (rec ? '' : '<p class="small muted">Browser ini tidak mendukung pengenalan suara (coba Chrome). Bacakan kalimat ke orang tua/teman, lalu tekan tombol di bawah.</p><button class="btn primary" id="honor">✅ I said it out loud</button>') +
        '<div id="way-out"></div></div>';
      ui.$('#listen').onclick = function () { ui.speak(target); };
      ui.$('#slow').onclick = function () { ui.speak(target, { rate: 0.6 }); };
      const honor = ui.$('#honor');
      if (honor) honor.onclick = function () { speakDone(0.8); };
      function micProblem(msg) {
        ui.$('#way-out').innerHTML = '<div class="feedback no"><b>🎤 ' + msg + '</b>' +
          '<p class="small">Cek izin mikrofon di browser (ikon 🔒 di sebelah alamat), lalu coba lagi. Kalau tetap tidak bisa, bacakan kalimat ke orang tua lalu lanjut.</p></div>' +
          '<div class="row end"><button class="btn" id="no-mic">Lanjut tanpa mikrofon (tanpa XP) →</button></div>';
        ui.$('#no-mic').onclick = next;
      }
      if (rec) {
        const mic = ui.$('#mic');
        mic.onclick = function () {
          ui.stopSpeaking();
          mic.disabled = true; mic.textContent = '👂 Listening…'; mic.classList.add('pulse');
          try { rec.start(); } catch (e) { /* already started */ }
        };
        rec.onresult = function (e) {
          const heard = Array.from(e.results[0]).map(function (a) { return a.transcript; });
          const res = C.speechScore(target, heard);
          tries++;
          ui.$('#target').innerHTML = res.words.map(function (w, i) { return '<span class="' + (res.hits[i] ? 'hit' : 'miss') + '">' + w + '</span>'; }).join(' ');
          const pct = Math.round(res.score * 100);
          ui.$('#speak-res').innerHTML = '<div class="feedback ' + (res.score >= 0.6 ? 'ok' : 'no') + '"><b>' + pct + '% ' + (res.score >= 0.9 ? '🌟 Amazing!' : res.score >= 0.6 ? '👍 Good job!' : '💪 Try again!') + '</b><p class="small">I heard: “' + ui.esc(heard[0]) + '”</p></div>' +
            (res.score < 0.6 && tries >= 3 ? '<p class="small">Kamu sudah mencoba 3 kali. Hebat! Boleh lanjut, atau coba sekali lagi.</p><button class="btn" id="accept">Continue →</button>' : '');
          const acc = ui.$('#accept'); if (acc) acc.onclick = function () { speakDone(res.score); };
          if (res.score >= 0.6) { ui.sfx.right(); setTimeout(function () { speakDone(res.score); }, 1300); }
          else ui.sfx.wrong();
        };
        let quiet = 0;
        rec.onerror = function (e) {
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') micProblem('Mikrofon tidak diizinkan.');
          else if (e.error === 'audio-capture') micProblem('Mikrofon tidak ditemukan.');
          else if (e.error === 'network') micProblem('Pengenalan suara butuh internet.');
          else if (++quiet >= 3) micProblem('Suaramu belum terdengar.');
          else ui.toast('🎤 Tidak terdengar. Coba lagi, bicara lebih dekat ke mikrofon!');
        };
        rec.onend = function () { const mic = ui.$('#mic'); if (mic) { mic.disabled = false; mic.textContent = '🎤 Tap & speak'; mic.classList.remove('pulse'); } };
        App.shell.onLeave(function () { try { rec.abort(); } catch (e) { /* ignore */ } });
      }
      function speakDone(score) {
        p.stats.speaking++;
        S.save();
        R.track('speak', 1);
        const xp = score >= 0.9 ? 15 : score >= 0.6 ? 10 : 5; // 5 = effort after 3 tries
        st.xp += xp;
        R.award(xp, 3, 'Speaking: ' + r.title);
        next();
      }
    }

    /* 6. Short writing response */
    function stepWrite(stage) {
      const w = r.write;
      const vocabWords = (r.vocab || []).map(function (v) { return v.forms && v.forms.length ? v.forms : [v.w]; });
      stage.innerHTML =
        '<div class="card"><h2>' + (r.ks2 ? '💬 Now Try This' : '✏️ Write about it') + '</h2>' +
        '<p class="prompt">' + ui.esc(w.prompt) + '</p><p class="small muted">💡 ' + ui.esc(w.hint || '') + '</p>' +
        '<textarea id="wtext" rows="6" placeholder="Write in English here…"></textarea>' +
        '<ul class="checklist" id="checks"></ul>' +
        '<div class="row end"><button class="btn primary" id="submit" disabled>Submit ✨</button></div></div>';
      const ta = ui.$('#wtext');
      const draftKey = 'rq-draft-' + p.id + '-' + r.id;
      try { ta.value = localStorage.getItem(draftKey) || ''; } catch (e) { /* ignore */ }
      function check() {
        const text = ta.value;
        const n = ui.countWords(text);
        const lower = ' ' + text.toLowerCase() + ' ';
        const used = vocabWords.filter(function (forms) { return forms.some(function (f) { return new RegExp('\\b' + f.toLowerCase() + '\\b').test(lower); }); }).length;
        const cap = /^[A-Z]/.test(text.trim());
        const punct = /[.!?]$/.test(text.trim());
        const items = [
          [n >= w.minWords, 'At least ' + w.minWords + ' words (' + n + ')', true],
          [used >= 1, 'Use a new word from this lesson (' + used + ' used) ⭐ bonus', false],
          [cap && punct, 'Start with a capital letter and end with . ! or ?', false]
        ];
        ui.$('#checks').innerHTML = items.map(function (it) { return '<li class="' + (it[0] ? 'ok' : '') + '">' + (it[0] ? '✅' : '⬜') + ' ' + it[1] + '</li>'; }).join('');
        ui.$('#submit').disabled = n < w.minWords;
        try { localStorage.setItem(draftKey, text); } catch (e) { /* ignore */ }
        return { n: n, used: used, neat: cap && punct };
      }
      ta.oninput = check;
      check();
      ui.$('#submit').onclick = function () {
        const c = check();
        p.writings = p.writings || [];
        p.writings.unshift({ at: Date.now(), lesson: r.title, prompt: w.prompt, text: ta.value.trim() });
        p.writings = p.writings.slice(0, 100);
        p.stats.writing++;
        S.save();
        try { localStorage.removeItem(draftKey); } catch (e) { /* ignore */ }
        R.track('write', 1);
        const xp = 15 + (c.used ? 5 : 0) + (c.neat ? 5 : 0);
        st.xp += xp;
        R.award(xp, 4, 'Writing: ' + r.title);
        next();
      };
    }

    /* 7. Results */
    function stepDone(stage) {
      const right = st.answers.filter(function (a) { return a.ok; }).length;
      const score = st.score || 0;
      const mins = Math.max(1, Math.round((Date.now() - st.started) / 60000));
      S.day(p).minutes += mins;
      S.save();
      ui.sfx.win();
      const all = App.content.readings();
      const nextR = all.find(function (x) { return !p.readings[x.id] && Math.abs(x.level - p.readingLevel) <= 1; });
      stage.innerHTML =
        '<div class="card center celebrate">' +
        '<div class="big-emoji">' + (score === 1 ? '🏆' : score >= 0.7 ? '🌟' : '💪') + '</div>' +
        '<h2>' + (score === 1 ? 'Perfect!' : score >= 0.7 ? 'Great reading!' : 'Good effort!') + '</h2>' +
        '<div class="big-stars">' + C.stars(score) + '</div>' +
        (st.marks && st.marks.max !== r.questions.length || (st.marks && st.marks.open)
          ? '<p>Marked by the app: <b>' + st.marks.got + ' / ' + st.marks.max + ' marks</b> · ' + mins + ' min</p>' +
            (st.marks.open ? '<p class="small">✍️ ' + st.marks.open + ' written answer' + (st.marks.open > 1 ? 's' : '') + ' (cek mandiri ' + st.marks.openGot + ' / ' + st.marks.openMax + ' marks). Tunjukkan ke orang tua/guru di menu 👪 Parent.</p>' : '')
          : '<p>Quiz: <b>' + right + ' / ' + r.questions.length + '</b> correct · ' + mins + ' min</p>') +
        '<p class="reward-line">+' + st.xp + ' XP</p>' +
        (st.levelMsg ? '<div class="feedback ok"><b>' + st.levelMsg + '</b></div>' : '') +
        (!firstTime ? '<p class="small muted">Latihan ulang: XP setengah, tidak mempengaruhi level.</p>' : '') +
        '<div class="row center gap wrap">' +
        '<a class="btn" href="#/read/' + r.id + '" id="again">🔁 Try again</a>' +
        (nextR ? '<a class="btn primary" href="#/read/' + nextR.id + '">Next: ' + nextR.emoji + ' ' + ui.esc(nextR.title) + ' →</a>' : '<a class="btn primary" href="#/read">Library</a>') +
        '</div></div>';
      ui.$('#again').onclick = function (e) { e.preventDefault(); App.views.reading(r.id); };
      if (score >= 0.7) ui.confetti(120);
    }

    render();
  };
})();
