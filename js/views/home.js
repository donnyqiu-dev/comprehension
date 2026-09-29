/* Home: streak, daily goal, quests + chest, Lumo, what to do next. */
(function () {
  const ui = App.ui, S = App.store, R = App.rewards;
  App.views = App.views || {};

  function greeting() {
    const h = new Date().getHours();
    return h < 11 ? 'Good morning' : h < 15 ? 'Good afternoon' : h < 19 ? 'Good evening' : 'Good night';
  }

  function weekStrip(p) {
    const out = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const k = S.todayKey(d);
      const day = p.days[k];
      const cls = day && day.goalMet ? 'goal' : day && day.activities ? 'done' : '';
      out.push('<div class="wd ' + cls + (i === 0 ? ' today' : '') + '"><small>' + 'SMTWTFS'[d.getDay()] + '</small><span>' + (day && day.goalMet ? '🔥' : day && day.activities ? '✓' : '·') + '</span></div>');
    }
    return out.join('');
  }

  function ring(pct) {
    const r = 42, c = 2 * Math.PI * r;
    return '<svg viewBox="0 0 100 100" class="ring"><circle cx="50" cy="50" r="' + r + '" class="ring-bg"/>' +
      '<circle cx="50" cy="50" r="' + r + '" class="ring-fg" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - Math.min(1, pct))) + '"/></svg>';
  }

  function nextReading(p) {
    const all = App.content.readings();
    const atLevel = all.filter(function (r) { return r.level === p.readingLevel && !p.readings[r.id]; });
    if (atLevel.length) return atLevel[0];
    const near = all.filter(function (r) { return Math.abs(r.level - p.readingLevel) <= 1 && !p.readings[r.id]; });
    return near[0] || all.find(function (r) { return !p.readings[r.id]; }) || null;
  }

  function nextVideo(p) {
    return App.content.videos().find(function (v) { return !p.videos[v.id] && Math.abs(v.level - p.readingLevel) <= 1; }) ||
      App.content.videos().find(function (v) { return !p.videos[v.id]; }) || null;
  }

  App.views.home = function () {
    const p = S.profile();
    const q = R.ensureQuests(p);
    const day = S.day(p);
    const streak = R.liveStreak(p);
    const rk = R.rankFor(p.xp);
    const stage = R.petStage(p.xp);
    const happy = R.petHappiness(p);
    const due = App.srs.due(p).length;
    const nr = nextReading(p);
    const nv = nextVideo(p);
    const doneAll = R.allQuestsDone(p);
    const practicedToday = day.activities > 0;

    const hatItem = App.SHOP.find(function (i) { return i.id === p.equipped.hat; });

    ui.$('#app').innerHTML =
      '<section class="home">' +
      '<div class="hello card grad">' +
      '<div><p class="muted-light">' + greeting() + ',</p><h1 class="title-font">' + ui.esc(p.name) + ' ' + p.avatar + '</h1>' +
      '<p class="rank">' + rk.rank.icon + ' ' + rk.rank.name + (rk.next ? ' · <small>' + (rk.next.xp - p.xp) + ' XP to ' + rk.next.name + '</small>' : '') + '</p></div>' +
      '<a class="mini-pet ' + (practicedToday ? 'happy' : 'sleepy') + '" href="#/me" title="Lumo">' +
      (hatItem ? '<span class="pet-hat">' + hatItem.icon + '</span>' : '') +
      '<span class="pet-face">' + stage.face + '</span><small>' + (practicedToday ? 'Yay! 😊' : 'Zzz… read with me?') + '</small></a>' +
      '</div>' +

      '<div class="grid2">' +
      '<div class="card streak-card">' +
      '<div class="flame ' + (practicedToday ? 'lit' : '') + '">🔥</div>' +
      '<div><h2>' + streak + ' day' + (streak === 1 ? '' : 's') + '</h2><p class="small">' +
      (practicedToday ? 'Streak aman hari ini! Mantap 💪' : streak ? 'Selesaikan 1 aktivitas hari ini agar streak tidak putus!' : 'Selesaikan 1 aktivitas untuk memulai streak!') +
      '</p><p class="small muted">Best: ' + p.streak.best + ' · 🧊 Shield: ' + p.streak.freezes + '</p></div>' +
      '<div class="week">' + weekStrip(p) + '</div>' +
      '</div>' +

      '<div class="card goal-card">' +
      '<div class="ring-wrap">' + ring(day.xp / p.settings.dailyGoal) + '<div class="ring-label"><b>' + day.xp + '</b><small>/ ' + p.settings.dailyGoal + ' XP</small></div></div>' +
      '<div><h3>Daily Goal</h3><p class="small">' + (day.goalMet ? '🎯 Tercapai! Kamu hebat!' : 'Kumpulkan ' + p.settings.dailyGoal + ' XP hari ini.') + '</p></div>' +
      '</div>' +
      '</div>' +

      '<div class="card quests">' +
      '<div class="row between"><h3>📜 Daily Quests</h3><small class="muted">Reset tiap hari</small></div>' +
      q.list.map(function (item) {
        const d = R.questDef(item.id);
        return '<div class="quest ' + (item.done ? 'done' : '') + '"><span class="qcheck">' + (item.done ? '✅' : '⬜') + '</span>' +
          '<div class="qtext"><b>' + d.text + '</b><small>' + d.textId + '</small>' +
          '<div class="bar"><i style="width:' + (100 * item.progress / d.target) + '%"></i></div></div>' +
          '<span class="qreward">' + item.progress + '/' + d.target + '<br>🪙' + d.coins + '</span></div>';
      }).join('') +
      '<button class="chest ' + (doneAll && !q.chestClaimed ? 'ready' : '') + '" id="chest" ' + (doneAll && !q.chestClaimed ? '' : 'disabled') + '>' +
      (q.chestClaimed ? '🎉 Chest opened! Come back tomorrow.' : doneAll ? '🎁 Open treasure chest!' : '🔒 Finish all quests to open the chest') +
      '</button></div>' +

      '<h2 class="section-title">Today\'s adventure <small>Petualangan hari ini</small></h2>' +
      '<div class="grid2">' +
      (nr ? '<a class="card next-card" href="#/read/' + nr.id + '"><span class="big-emoji">' + nr.emoji + '</span><div><small class="tag">📚 READ · ' + App.common.levelTag(nr.level) + '</small><h3>' + ui.esc(nr.title) + '</h3><p class="small">' + nr.genre + ' · ' + nr.topic + '</p></div></a>' : '<div class="card">🏆 Semua bacaan sudah selesai! Coba ulangi untuk 3 bintang.</div>') +
      (nv ? '<a class="card next-card" href="#/watch/' + nv.id + '"><span class="big-emoji">' + nv.emoji + '</span><div><small class="tag">🎬 WATCH · ' + App.common.levelTag(nv.level) + '</small><h3>' + ui.esc(nv.title) + '</h3><p class="small">' + ui.esc(nv.channel) + '</p></div></a>' : '') +
      '<a class="card next-card" href="#/words/review"><span class="big-emoji">🌼</span><div><small class="tag">🔁 REVIEW</small><h3>' + (due ? due + ' words need water' : 'Word Garden') + '</h3><p class="small">' + (due ? 'Siram kata-katamu agar tidak layu!' : 'Simpan kata baru dari bacaan & video.') + '</p></div></a>' +
      '<a class="card next-card" href="#/words"><span class="big-emoji">🎮</span><div><small class="tag">🎮 PLAY</small><h3>Word Games</h3><p class="small">Match · Spelling Bee · Fill the Gap</p></div></a>' +
      '</div>' +
      '<p class="small muted center">Lumo happiness: ' + happy + '% · Reading ' + App.LEVELS[p.readingLevel].name + '</p>' +
      '</section>';

    const chest = ui.$('#chest');
    chest.onclick = function () {
      const prize = R.openChest();
      if (!prize) return;
      ui.confetti(180);
      ui.sfx.win();
      ui.modal('<div class="celebrate"><div class="big-emoji chest-open">🎁</div><h2>Treasure!</h2><div class="big-emoji">' + prize.icon + '</div><p class="reward-line">' + prize.text + ' · +20 XP</p><button class="btn primary" data-close>Collect</button></div>',
        { onClose: function () { App.views.home(); App.shell.refreshTop(); } });
    };
  };
})();
