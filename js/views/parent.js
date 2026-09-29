/* Parent / teacher area: PIN gate, progress report, settings, custom lessons, backup. */
(function () {
  const ui = App.ui, S = App.store, C = App.common;
  App.views = App.views || {};
  let unlocked = false;

  function gate(done) {
    const hasPin = !!S.db.parentPin;
    ui.$('#app').innerHTML = C.header('👪 Parent / Teacher') +
      '<div class="card center narrow"><div class="big-emoji">🔐</div>' +
      (hasPin ? '<h2>Masukkan PIN orang tua</h2>' : '<h2>Buat PIN orang tua (4 angka)</h2><p class="small muted">PIN ini hanya untuk mencegah anak mengubah pengaturan. Disimpan di perangkat ini.</p>') +
      '<input id="pin" class="pin-input" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••">' +
      '<button class="btn primary" id="pin-go">' + (hasPin ? 'Buka' : 'Simpan PIN') + '</button>' +
      (hasPin ? '<p class="small muted">Lupa PIN? Hapus data situs di pengaturan browser (semua progres ikut terhapus), atau pulihkan dari file cadangan.</p>' : '') +
      '</div>';
    const inp = ui.$('#pin');
    inp.focus();
    function go() {
      const v = inp.value.trim();
      if (!/^\d{4}$/.test(v)) { ui.toast('PIN harus 4 angka.'); return; }
      if (!hasPin) { S.db.parentPin = v; S.save(); unlocked = true; done(); return; }
      if (v === S.db.parentPin) { unlocked = true; done(); }
      else { ui.sfx.wrong(); ui.toast('PIN salah.'); inp.value = ''; }
    }
    ui.$('#pin-go').onclick = go;
    inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
  }

  App.views.parentGate = function (done) { if (unlocked) done(); else gate(done); };

  App.views.parent = function () {
    if (!unlocked) { gate(App.views.parent); return; }
    const p = S.profile();
    const R = App.rewards;
    const readDone = Object.keys(p.readings).length;
    const vidDone = Object.keys(p.videos).length;
    const scores = Object.values(p.readings).map(function (r) { return r.first; });
    const avg = scores.length ? Math.round(100 * scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : 0;
    const acc = p.stats.questionsTotal ? Math.round(100 * p.stats.questionsRight / p.stats.questionsTotal) : 0;

    // last 7 days minutes & 5-week heatmap
    let min7 = 0, days7 = 0;
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = p.days[S.todayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))];
      if (d) { min7 += d.minutes || 0; if (d.activities) days7++; }
    }
    let heat = '';
    for (let i = 34; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const d = p.days[S.todayKey(dt)];
      const lvl = !d || !d.xp ? 0 : d.xp < 30 ? 1 : d.xp < 60 ? 2 : d.xp < 100 ? 3 : 4;
      heat += '<i class="h' + lvl + '" title="' + S.todayKey(dt) + ': ' + (d ? d.xp : 0) + ' XP"></i>';
    }

    const skillRows = Object.keys(App.QTYPES).map(function (k) {
      const s = p.skills[k];
      if (!s || !s.t) return null;
      return { k: k, pct: Math.round(100 * s.c / s.t), c: s.c, t: s.t };
    }).filter(Boolean);
    const weakest = skillRows.filter(function (s) { return s.t >= 3; }).sort(function (a, b) { return a.pct - b.pct; })[0];

    const writings = (p.writings || []).slice(0, 20);
    const customR = S.db.customReadings, customV = S.db.customVideos;

    ui.$('#app').innerHTML =
      C.header('👪 Parent / Teacher') +
      '<div class="row between wrap"><p class="muted">Laporan untuk <b>' + p.avatar + ' ' + ui.esc(p.name) + '</b></p>' +
      '<div class="row gap-s"><select id="switch" class="small-select">' + S.profiles().map(function (x) { return '<option value="' + x.id + '"' + (x.id === p.id ? ' selected' : '') + '>' + x.avatar + ' ' + ui.esc(x.name) + '</option>'; }).join('') + '</select>' +
      '<button class="btn small" id="lock">🔒 Lock</button></div></div>' +

      '<div class="grid4">' +
      stat(App.LEVELS[p.readingLevel].name.split('·')[0], 'Reading level', App.LEVELS[p.readingLevel].grade) +
      stat('🔥 ' + R.liveStreak(p), 'Streak', 'Best ' + p.streak.best) +
      stat(days7 + '/7', 'Active days (7d)', min7 + ' min') +
      stat(acc + '%', 'Accuracy', p.stats.questionsRight + '/' + p.stats.questionsTotal + ' questions') +
      stat(readDone, 'Readings done', 'Avg first try ' + avg + '%') +
      stat(vidDone, 'Videos done', '') +
      stat(Object.keys(p.words).length, 'Words saved', App.srs.masteredCount(p) + ' mastered') +
      stat('⭐ ' + p.xp, 'Total XP', '🪙 ' + p.coins) +
      '</div>' +

      '<div class="grid2">' +
      '<div class="card"><h3>📅 Last 5 weeks</h3><div class="heat">' + heat + '</div><p class="small muted">Warna lebih gelap = XP lebih banyak di hari itu.</p></div>' +
      '<div class="card"><h3>🧠 Comprehension skills</h3>' +
      (skillRows.length ? skillRows.map(function (s) {
        const t = App.QTYPES[s.k];
        return '<div class="skill"><span>' + t.icon + ' ' + t.label + ' <small class="muted">' + t.id + '</small></span><div class="bar"><i class="' + (s.pct < 60 ? 'low' : s.pct < 80 ? 'mid' : '') + '" style="width:' + s.pct + '%"></i></div><small>' + s.pct + '% (' + s.c + '/' + s.t + ')</small></div>';
      }).join('') : '<p class="muted small">Belum ada data. Selesaikan satu bacaan dulu.</p>') +
      (weakest ? '<p class="small tip">💡 Fokus latihan: <b>' + App.QTYPES[weakest.k].label + '</b>. ' + tipFor(weakest.k) + '</p>' : '') +
      '</div></div>' +

      '<div class="card"><h3>✍️ Writing & open answers</h3><p class="small muted">Baca jawaban anak dan beri pujian/koreksi secara langsung.</p>' +
      (writings.length ? writings.map(function (w) {
        return '<div class="writing"><small class="muted">' + new Date(w.at).toLocaleString('id-ID') + ' · ' + ui.esc(w.lesson) + '</small><p class="small"><b>Q:</b> ' + ui.esc(w.prompt) + '</p><p>' + ui.esc(w.text) + '</p></div>';
      }).join('') : '<p class="muted small">Belum ada tulisan.</p>') + '</div>' +

      '<div class="grid2">' +
      '<div class="card"><h3>📈 Recent activity</h3>' +
      (p.history.length ? '<ul class="hist">' + p.history.slice(0, 12).map(function (h) { return '<li><small class="muted">' + new Date(h.t).toLocaleDateString('id-ID') + '</small> ' + ui.esc(h.label) + ' <b>+' + h.xp + '</b></li>'; }).join('') + '</ul>' : '<p class="muted small">Belum ada aktivitas.</p>') +
      (p.levelHistory.length ? '<h4>Level changes</h4><ul class="hist">' + p.levelHistory.slice(-5).map(function (h) { return '<li>' + new Date(h.at).toLocaleDateString('id-ID') + ': L' + h.from + ' → L' + h.to + '</li>'; }).join('') + '</ul>' : '') +
      '</div>' +

      '<div class="card"><h3>⚙️ Settings</h3>' +
      '<label>Daily goal<select id="goal">' + [30, 50, 80, 120].map(function (g) { return '<option value="' + g + '"' + (p.settings.dailyGoal === g ? ' selected' : '') + '>' + g + ' XP ' + ({ 30: '(santai ~10 min)', 50: '(biasa ~15 min)', 80: '(serius ~25 min)', 120: '(intens ~40 min)' })[g] + '</option>'; }).join('') + '</select></label>' +
      '<label>Reading level (manual)<select id="lvl">' + [1, 2, 3, 4, 5].map(function (l) { return '<option value="' + l + '"' + (p.readingLevel === l ? ' selected' : '') + '>' + App.LEVELS[l].name + ' ' + App.LEVELS[l].grade + '</option>'; }).join('') + '</select></label>' +
      '<label>Voice speed<select id="rate">' + [[0.7, 'Slow'], [0.9, 'Normal'], [1.05, 'Fast']].map(function (r) { return '<option value="' + r[0] + '"' + (p.settings.ttsRate === r[0] ? ' selected' : '') + '>' + r[1] + '</option>'; }).join('') + '</select></label>' +
      '<label class="check"><input type="checkbox" id="sound"' + (p.settings.sound ? ' checked' : '') + '> Sound effects</label>' +
      '<label class="check"><input type="checkbox" id="indo"' + (p.settings.showIndo ? ' checked' : '') + '> Show Indonesian meanings 🇮🇩</label>' +
      '<label class="check"><input type="checkbox" id="shield"> Give 1 Streak Shield 🧊 (hadiah dari orang tua)</label>' +
      '<button class="btn primary" id="save-set">Save settings</button></div>' +
      '</div>' +

      '<div class="card"><h3>🛠️ Lesson Builder</h3><p class="small muted">Buat bacaan atau video interaktif sendiri (misal video BBC Learning English, National Geographic Kids, atau materi sekolah). Tersedia untuk semua profil di perangkat ini.</p>' +
      '<div class="row gap wrap"><a class="btn primary" href="#/parent/build/reading">➕ New reading</a><a class="btn primary" href="#/parent/build/video">➕ New video lesson</a>' +
      '<select id="copyv" class="small-select"><option value="">📋 Copy a built-in video to edit…</option>' + App.VIDEOS.map(function (v) { return '<option value="' + v.id + '">' + v.emoji + ' ' + ui.esc(v.title) + '</option>'; }).join('') + '</select></div>' +
      (customR.length || customV.length ? '<ul class="custom-list">' +
        customR.map(function (r) { return '<li>📚 ' + ui.esc(r.title) + ' ' + C.levelTag(r.level) + ' <a href="#/parent/build/reading/' + r.id + '">Edit</a> · <a href="#/read/' + r.id + '">Open</a> · <button class="link danger" data-delr="' + r.id + '">Delete</button></li>'; }).join('') +
        customV.map(function (v) { return '<li>🎬 ' + ui.esc(v.title) + ' ' + C.levelTag(v.level) + ' <a href="#/parent/build/video/' + v.id + '">Edit</a> · <a href="#/watch/' + v.id + '">Open</a> · <button class="link danger" data-delv="' + v.id + '">Delete</button></li>'; }).join('') +
        '</ul>' : '') +
      '</div>' +

      '<div class="card"><h3>💾 Data (tersimpan di perangkat ini)</h3>' +
      '<p class="small muted">Semua progres disimpan di localStorage browser ini. Unduh cadangan secara berkala, terutama sebelum membersihkan browser atau pindah perangkat.</p>' +
      '<div class="row gap wrap"><button class="btn" id="export">⬇️ Download backup</button>' +
      '<label class="btn file-btn">⬆️ Restore backup<input type="file" id="import" accept="application/json,.json" hidden></label>' +
      '<button class="btn" id="chpin">🔑 Change PIN</button>' +
      '<button class="btn danger" id="reset-child">Reset ' + ui.esc(p.name) + '\'s progress</button>' +
      '<button class="btn danger" id="del-child">Delete profile</button></div>' +
      '<p class="small muted" id="storage-info"></p></div>';

    function stat(big, label, sub) { return '<div class="card stat"><b>' + big + '</b><small>' + label + '</small>' + (sub ? '<small class="muted">' + sub + '</small>' : '') + '</div>'; }

    ui.$('#switch').onchange = function () { S.switchProfile(this.value); App.shell.refreshTop(); App.views.parent(); };
    ui.$('#lock').onclick = function () { unlocked = false; location.hash = '#/'; };
    ui.$('#save-set').onclick = function () {
      p.settings.dailyGoal = Number(ui.$('#goal').value);
      const lv = Number(ui.$('#lvl').value);
      if (lv !== p.readingLevel) { p.levelHistory.push({ from: p.readingLevel, to: lv, at: Date.now(), manual: true }); p.readingLevel = lv; p.levelProgress = { up: 0, down: 0 }; }
      p.settings.ttsRate = Number(ui.$('#rate').value);
      p.settings.sound = ui.$('#sound').checked;
      p.settings.showIndo = ui.$('#indo').checked;
      if (ui.$('#shield').checked) p.streak.freezes = Math.min(3, p.streak.freezes + 1);
      S.save(); App.shell.refreshTop();
      ui.toast('✅ Pengaturan disimpan');
      App.views.parent();
    };
    ui.$('#copyv').onchange = function () {
      if (!this.value) return;
      location.hash = '#/parent/build/video/copy:' + this.value;
    };
    ui.$all('[data-delr]').forEach(function (b) { b.onclick = function () { if (confirm('Hapus bacaan ini?')) { S.db.customReadings = customR.filter(function (x) { return x.id !== b.dataset.delr; }); S.save(); App.views.parent(); } }; });
    ui.$all('[data-delv]').forEach(function (b) { b.onclick = function () { if (confirm('Hapus video ini?')) { S.db.customVideos = customV.filter(function (x) { return x.id !== b.dataset.delv; }); S.save(); App.views.parent(); } }; });

    ui.$('#export').onclick = function () {
      const blob = new Blob([S.exportJson()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'readquest-backup-' + S.todayKey() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    };
    ui.$('#import').onchange = function () {
      const f = this.files[0];
      if (!f) return;
      if (!confirm('Pulihkan cadangan? Data saat ini di perangkat ini akan diganti.')) return;
      f.text().then(function (t) {
        try { S.importJson(t); ui.toast('✅ Cadangan dipulihkan'); unlocked = false; location.hash = '#/'; App.route(); }
        catch (e) { ui.toast('⚠️ ' + e.message); }
      });
    };
    ui.$('#chpin').onclick = function () {
      const v = prompt('PIN baru (4 angka):');
      if (v && /^\d{4}$/.test(v)) { S.db.parentPin = v; S.save(); ui.toast('PIN diganti'); }
      else if (v) ui.toast('PIN harus 4 angka.');
    };
    ui.$('#reset-child').onclick = function () {
      if (!confirm('Reset semua progres ' + p.name + '? (XP, koin, kata, streak). Tidak bisa dibatalkan.')) return;
      const name = p.name, av = p.avatar, id = p.id;
      S.deleteProfile(id);
      const np = S.createProfile(name, av);
      ui.toast('Progres di-reset'); App.shell.refreshTop();
      np.createdAt = Date.now(); S.save();
      App.views.parent();
    };
    ui.$('#del-child').onclick = function () {
      if (!confirm('Hapus profil ' + p.name + ' beserta semua datanya?')) return;
      S.deleteProfile(p.id); unlocked = false; location.hash = '#/'; App.route();
    };
    try {
      const bytes = (localStorage.getItem('readquest.v1') || '').length;
      ui.$('#storage-info').textContent = 'Ukuran data: ' + (bytes / 1024).toFixed(1) + ' KB (batas browser ±5 MB).';
    } catch (e) { /* ignore */ }
  };

  function tipFor(k) {
    return ({
      main: 'Setelah membaca, minta anak menjelaskan isi bacaan dalam 1 kalimat.',
      detail: 'Ajak anak mencari bukti kalimat di teks sebelum menjawab.',
      vocab: 'Latih "Water my words" dan tebak arti kata dari kalimat di sekitarnya.',
      infer: 'Tanyakan "Kenapa kamu berpikir begitu? Bagian mana di teks yang memberi petunjuk?"',
      seq: 'Perhatikan kata urutan: first, next, then, after, finally.',
      purpose: 'Tanyakan: penulis ingin memberi info, menghibur, atau membujuk?',
      cause: 'Cari kata because, so, as a result, since.',
      video: 'Nyalakan subtitle (CC) dan gunakan tombol "Watch again".'
    })[k] || '';
  }
})();
