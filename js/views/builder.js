/* Lesson builder for parents/teachers: custom readings and custom interactive videos. */
(function () {
  const ui = App.ui, S = App.store, C = App.common;
  App.views = App.views || {};

  function parseTime(s) {
    s = String(s || '').trim().toLowerCase();
    if (!s || s === 'end' || s === 'akhir') return -1;
    const parts = s.split(':').map(Number);
    if (parts.some(isNaN)) return NaN;
    return parts.length === 2 ? parts[0] * 60 + parts[1] : parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0];
  }

  function field(label, html) { return '<label>' + label + html + '</label>'; }
  function levelSelect(val) {
    return '<select name="level">' + [1, 2, 3, 4, 5].map(function (l) { return '<option value="' + l + '"' + (Number(val) === l ? ' selected' : '') + '>' + App.LEVELS[l].name + ' ' + App.LEVELS[l].grade + '</option>'; }).join('') + '</select>';
  }

  let radioSeq = 0;
  function qEditor(q, i, kind) {
    const rname = 'a' + (radioSeq++);
    q = q || { type: kind === 'video' ? 'mc' : 'detail', q: '', choices: ['', '', '', ''], a: 0, why: '' };
    const isOpen = q.type === 'open';
    const typeOpts = kind === 'video'
      ? [['mc', 'Multiple choice'], ['open', 'Open answer (tulis)']]
      : Object.keys(App.QTYPES).filter(function (k) { return k !== 'video'; }).map(function (k) { return [k, App.QTYPES[k].label]; });
    const choices = (q.choices || ['', '', '', '']).concat(['', '', '', '']).slice(0, 4);
    return '<div class="card q-edit" data-i="' + i + '">' +
      '<div class="row between"><b>Question ' + (i + 1) + '</b><button class="link danger" data-rm>Remove</button></div>' +
      '<div class="row gap wrap">' +
      (kind === 'video' ? field('Time (m:ss or "end")', '<div class="row gap-s"><input name="t" value="' + (q.t == null || q.t < 0 ? 'end' : App.fmtTime(q.t)) + '" class="small-input"><button class="btn small" data-now type="button">⏱ Now</button></div>') : '') +
      field('Type', '<select name="type">' + typeOpts.map(function (o) { return '<option value="' + o[0] + '"' + (q.type === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>') +
      '</div>' +
      field('Question', '<input name="q" value="' + ui.esc(q.q) + '">') +
      '<div class="mc-part" ' + (isOpen ? 'hidden' : '') + '>' +
      choices.map(function (c, k) {
        return '<div class="row gap-s choice-edit"><input type="radio" name="a' + i + '" value="' + k + '"' + (q.a === k ? ' checked' : '') + ' title="Correct answer"><input name="c' + k + '" placeholder="Choice ' + 'ABCD'[k] + '" value="' + ui.esc(c) + '"></div>';
      }).join('') +
      '<small class="muted">● = jawaban benar. Boleh isi 2–4 pilihan.</small>' +
      field('Explanation (why)', '<input name="why" value="' + ui.esc(q.why || '') + '">') +
      '</div>' +
      '<div class="open-part" ' + (isOpen ? '' : 'hidden') + '>' + field('Example answer (optional)', '<input name="sample" value="' + ui.esc(q.sample || '') + '">') + '</div>' +
      '</div>';
  }

  function readQuestions(root, kind) {
    const out = [];
    let err = null;
    ui.$all('.q-edit', root).forEach(function (el, i) {
      const get = function (n) { const x = el.querySelector('[name="' + n + '"]'); return x ? x.value.trim() : ''; };
      const q = { type: get('type'), q: get('q') };
      if (!q.q) { err = 'Question ' + (i + 1) + ' is empty.'; return; }
      if (kind === 'video') {
        q.t = parseTime(get('t'));
        if (isNaN(q.t)) { err = 'Time for question ' + (i + 1) + ' is not valid (use 1:30 or end).'; return; }
      }
      if (q.type === 'open') { q.sample = get('sample'); }
      else {
        const raw = [0, 1, 2, 3].map(function (k) { return get('c' + k); });
        const checked = el.querySelector('input[type=radio]:checked');
        const aRaw = checked ? Number(checked.value) : -1;
        const choices = [], map = {};
        raw.forEach(function (c, k) { if (c) { map[k] = choices.length; choices.push(c); } });
        if (choices.length < 2) { err = 'Question ' + (i + 1) + ' needs at least 2 choices.'; return; }
        if (map[aRaw] === undefined) { err = 'Choose the correct answer for question ' + (i + 1) + '.'; return; }
        q.choices = choices; q.a = map[aRaw]; q.why = get('why');
        if (kind === 'video') q.type = 'mc';
      }
      out.push(q);
    });
    return { list: out, err: err };
  }

  function wireQuestions(root, kind, getTime) {
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-rm]')) { e.preventDefault(); e.target.closest('.q-edit').remove(); renumber(); }
      const now = e.target.closest('[data-now]');
      if (now) {
        e.preventDefault();
        const t = getTime && getTime();
        if (t == null) { ui.toast('Putar video preview dulu.'); return; }
        now.parentNode.querySelector('input[name="t"]').value = App.fmtTime(t);
      }
    });
    root.addEventListener('change', function (e) {
      if (e.target.name === 'type') {
        const el = e.target.closest('.q-edit');
        const open = e.target.value === 'open';
        el.querySelector('.mc-part').hidden = open;
        el.querySelector('.open-part').hidden = !open;
      }
    });
    function renumber() { ui.$all('.q-edit b', root).forEach(function (b, i) { b.textContent = 'Question ' + (i + 1); }); }
  }

  function nextIndex(root) { return ui.$all('.q-edit', root).length; }

  App.views.builder = function (kind, id) {
    App.views.parentGate(function () { (kind === 'reading' ? buildReading : buildVideo)(id); });
  };

  /* ---------------- Reading builder ---------------- */
  function buildReading(id) {
    const existing = id ? S.db.customReadings.find(function (r) { return r.id === id; }) : null;
    const r = existing || { title: '', emoji: '📘', level: 3, genre: 'Nonfiction', topic: 'My lessons', text: [], vocab: [], questions: [], speak: '', write: { prompt: '', minWords: 25, hint: '' } };
    ui.$('#app').innerHTML = C.header(existing ? '✏️ Edit reading' : '➕ New reading', '#/parent') +
      '<form class="card builder" id="bf">' +
      '<div class="row gap wrap">' + field('Title', '<input name="title" required value="' + ui.esc(r.title) + '">') + field('Emoji', '<input name="emoji" class="small-input" value="' + ui.esc(r.emoji) + '">') + field('Level', levelSelect(r.level)) + '</div>' +
      '<div class="row gap wrap">' + field('Genre', '<select name="genre">' + ['Nonfiction', 'Story', 'Poem', 'News'].map(function (g) { return '<option' + (r.genre === g ? ' selected' : '') + '>' + g + '</option>'; }).join('') + '</select>') + field('Topic', '<input name="topic" value="' + ui.esc(r.topic) + '">') + '</div>' +
      field('Text (pisahkan paragraf dengan baris kosong)', '<textarea name="text" rows="10">' + ui.esc(r.text.join('\n\n')) + '</textarea>') +
      field('Vocabulary — satu kata per baris: <code>word | English meaning | arti Indonesia | example sentence</code>', '<textarea name="vocab" rows="5" placeholder="brave | not afraid of danger | berani | The brave firefighter saved the cat.">' + ui.esc(r.vocab.map(function (v) { return [v.w, v.def, v.id || '', v.ex || ''].join(' | '); }).join('\n')) + '</textarea>') +
      '<h3>Questions</h3><div id="qs">' + r.questions.map(function (q, i) { return qEditor(q, i, 'reading'); }).join('') + '</div>' +
      '<button class="btn" id="addq" type="button">➕ Add question</button>' +
      '<h3>Speaking & writing (optional)</h3>' +
      field('Sentence to say aloud', '<input name="speak" value="' + ui.esc(r.speak || '') + '">') +
      '<div class="row gap wrap">' + field('Writing prompt', '<input name="wprompt" value="' + ui.esc(r.write ? r.write.prompt : '') + '">') + field('Min words', '<input name="wmin" type="number" min="5" class="small-input" value="' + (r.write ? r.write.minWords : 25) + '">') + '</div>' +
      '<div class="row gap"><button class="btn primary big" type="submit">💾 Save reading</button><a class="btn" href="#/parent">Cancel</a></div>' +
      '</form>';
    const form = ui.$('#bf');
    const qs = ui.$('#qs');
    wireQuestions(qs, 'reading');
    ui.$('#addq').onclick = function () { qs.insertAdjacentHTML('beforeend', qEditor(null, nextIndex(qs), 'reading')); };
    if (!r.questions.length) ui.$('#addq').click();
    form.onsubmit = function (e) {
      e.preventDefault();
      const f = new FormData(form);
      const text = String(f.get('text')).split(/\n\s*\n/).map(function (s) { return s.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
      const vocab = String(f.get('vocab')).split('\n').map(function (line) {
        const parts = line.split('|').map(function (s) { return s.trim(); });
        if (!parts[0]) return null;
        return { w: parts[0], forms: [parts[0]], pos: '', def: parts[1] || parts[2] || '', id: parts[2] || '', ex: parts[3] || '' };
      }).filter(Boolean);
      const q = readQuestions(qs, 'reading');
      if (!String(f.get('title')).trim()) return ui.toast('Isi judul.');
      if (!text.length) return ui.toast('Isi teks bacaan.');
      if (q.err) return ui.toast('⚠️ ' + q.err);
      if (!q.list.length) return ui.toast('Tambahkan minimal 1 pertanyaan.');
      const out = {
        id: existing ? existing.id : 'c-r-' + S.uid(), custom: true,
        title: String(f.get('title')).trim(), emoji: String(f.get('emoji')).trim() || '📘', level: Number(f.get('level')),
        genre: f.get('genre'), topic: String(f.get('topic')).trim() || 'My lessons',
        text: text, vocab: vocab, questions: q.list,
        speak: String(f.get('speak')).trim(),
        write: String(f.get('wprompt')).trim() ? { prompt: String(f.get('wprompt')).trim(), minWords: Number(f.get('wmin')) || 20, hint: '' } : null
      };
      S.db.customReadings = S.db.customReadings.filter(function (x) { return x.id !== out.id; }).concat([out]);
      S.save();
      ui.toast('✅ Bacaan disimpan');
      location.hash = '#/parent';
    };
  }

  /* ---------------- Video builder ---------------- */
  function buildVideo(id) {
    let existing = null, v;
    if (id && id.indexOf('copy:') === 0) {
      const src = App.VIDEOS.find(function (x) { return x.id === id.slice(5); });
      v = JSON.parse(JSON.stringify(src));
      v.title = v.title + ' (my version)';
    } else {
      existing = id ? S.db.customVideos.find(function (x) { return x.id === id; }) : null;
      v = existing || { title: '', emoji: '🎬', level: 3, topic: 'My videos', channel: '', source: 'youtube', youtubeId: '', url: '', intro: '', vocab: [], questions: [] };
    }
    const link = v.source === 'html5' ? v.url : (v.youtubeId ? 'https://www.youtube.com/watch?v=' + v.youtubeId : '');
    let preview = null;

    ui.$('#app').innerHTML = C.header(existing ? '✏️ Edit video lesson' : '➕ New video lesson', '#/parent') +
      '<form class="card builder" id="bf">' +
      field('YouTube link, atau link langsung file video (.mp4)', '<div class="row gap-s"><input name="link" value="' + ui.esc(link) + '" placeholder="https://www.youtube.com/watch?v=…"><button class="btn" id="load" type="button">▶ Preview</button></div>') +
      '<p class="small muted">Tips: channel YouTube <b>BBC Learning English</b>, <b>TED-Ed</b>, <b>National Geographic Kids</b>, <b>SciShow Kids</b> cocok untuk kelas 6. Video BBC iPlayer tidak bisa di-embed, gunakan versi YouTube-nya.</p>' +
      '<div class="player-box builder-player"><div id="pv" class="player"><div class="loading">Preview akan muncul di sini. Gunakan tombol ⏱ Now untuk mengambil waktu video saat ini.</div></div></div>' +
      '<div class="row gap wrap">' + field('Title', '<input name="title" value="' + ui.esc(v.title) + '">') + field('Emoji', '<input name="emoji" class="small-input" value="' + ui.esc(v.emoji) + '">') + field('Level', levelSelect(v.level)) + '</div>' +
      '<div class="row gap wrap">' + field('Channel / source', '<input name="channel" value="' + ui.esc(v.channel || '') + '">') + field('Topic', '<input name="topic" value="' + ui.esc(v.topic || '') + '">') + '</div>' +
      field('Mission for the child', '<input name="intro" value="' + ui.esc(v.intro || '') + '">') +
      field('Word pop-ups — satu per baris: <code>m:ss | word | meaning | arti</code>', '<textarea name="vocab" rows="4" placeholder="0:45 | habitat | natural home of an animal | habitat">' + ui.esc((v.vocab || []).map(function (w) { return [App.fmtTime(w.t), w.w, w.def, w.id || ''].join(' | '); }).join('\n')) + '</textarea>') +
      '<h3>Questions</h3><p class="small muted">Video berhenti pada waktu yang ditentukan. Tulis "end" untuk pertanyaan setelah video selesai.</p><div id="qs">' + v.questions.map(function (q, i) { return qEditor(q, i, 'video'); }).join('') + '</div>' +
      '<button class="btn" id="addq" type="button">➕ Add question</button> <button class="btn" id="addqnow" type="button">⏱ Add question at current time</button>' +
      '<div class="row gap"><button class="btn primary big" type="submit">💾 Save video lesson</button><a class="btn" href="#/parent">Cancel</a></div>' +
      '</form>';

    const form = ui.$('#bf');
    const qs = ui.$('#qs');
    function curTime() { return preview ? Math.floor(preview.time()) : null; }
    wireQuestions(qs, 'video', curTime);
    ui.$('#addq').onclick = function () { qs.insertAdjacentHTML('beforeend', qEditor(null, nextIndex(qs), 'video')); };
    ui.$('#addqnow').onclick = function () {
      const t = curTime();
      if (t == null) { ui.toast('Klik ▶ Preview dan putar videonya dulu.'); return; }
      preview.pause();
      qs.insertAdjacentHTML('beforeend', qEditor({ t: t, type: 'mc', q: '', choices: ['', '', '', ''], a: 0 }, nextIndex(qs), 'video'));
      qs.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    };
    if (!v.questions.length) ui.$('#addq').click();

    function sourceFrom(linkVal) {
      const yt = App.parseYouTube(linkVal);
      if (yt) return { source: 'youtube', youtubeId: yt };
      if (/^https?:\/\/.+/i.test(linkVal)) return { source: 'html5', url: linkVal };
      return null;
    }

    ui.$('#load').onclick = function () {
      const src = sourceFrom(form.link.value.trim());
      if (!src) { ui.toast('Link tidak dikenali.'); return; }
      if (preview) preview.destroy();
      App.makePlayer(src, ui.$('#pv'), { onReady: function () {}, onEnded: function () {}, onError: function (m) { ui.toast('⚠️ ' + m); } })
        .then(function (pl) { preview = pl; })
        .catch(function () { ui.toast('⚠️ Video player tidak bisa dimuat.'); });
    };
    if (link) ui.$('#load').click();
    App.shell.onLeave(function () { preview && preview.destroy(); });

    form.onsubmit = function (e) {
      e.preventDefault();
      const f = new FormData(form);
      const src = sourceFrom(String(f.get('link')).trim());
      if (!src) return ui.toast('Masukkan link YouTube atau link video yang valid.');
      if (!String(f.get('title')).trim()) return ui.toast('Isi judul.');
      const q = readQuestions(qs, 'video');
      if (q.err) return ui.toast('⚠️ ' + q.err);
      if (!q.list.length) return ui.toast('Tambahkan minimal 1 pertanyaan.');
      let vErr = null;
      const vocab = String(f.get('vocab')).split('\n').map(function (line) {
        const parts = line.split('|').map(function (s) { return s.trim(); });
        if (!parts[0] && !parts[1]) return null;
        const t = parseTime(parts[0]);
        if (isNaN(t) || t < 0 || !parts[1]) { vErr = 'Baris kosa kata tidak valid: ' + line; return null; }
        return { t: t, w: parts[1], def: parts[2] || parts[3] || '', id: parts[3] || '' };
      }).filter(Boolean);
      if (vErr) return ui.toast('⚠️ ' + vErr);
      const out = Object.assign({
        id: existing ? existing.id : 'c-v-' + S.uid(), custom: true,
        title: String(f.get('title')).trim(), emoji: String(f.get('emoji')).trim() || '🎬', level: Number(f.get('level')),
        channel: String(f.get('channel')).trim(), topic: String(f.get('topic')).trim() || 'My videos', intro: String(f.get('intro')).trim(),
        vocab: vocab, questions: q.list.sort(function (a, b) { return (a.t < 0 ? 1e9 : a.t) - (b.t < 0 ? 1e9 : b.t); })
      }, src);
      S.db.customVideos = S.db.customVideos.filter(function (x) { return x.id !== out.id; }).concat([out]);
      S.save();
      ui.toast('✅ Video lesson disimpan');
      location.hash = '#/parent';
    };
  }
})();
