/* Game layer: XP, coins, streaks, daily goal, quests, chests, badges, pet. */
(function () {
  const S = App.store;

  function rankFor(xp) {
    let r = App.RANKS[0], next = null;
    for (let i = 0; i < App.RANKS.length; i++) {
      if (xp >= App.RANKS[i].xp) { r = App.RANKS[i]; next = App.RANKS[i + 1] || null; }
    }
    return { rank: r, next: next };
  }

  function petStage(xp) {
    let s = App.PET_STAGES[0];
    App.PET_STAGES.forEach(function (st) { if (xp >= st.xp) s = st; });
    return s;
  }

  /* Streak as it should be shown right now (a missed day breaks it unless a shield can cover it). */
  function liveStreak(p) {
    const st = p.streak;
    if (!st.lastDay) return 0;
    const gap = S.dayDiff(st.lastDay, S.todayKey());
    if (gap <= 1) return st.current;
    if (gap - 1 <= st.freezes) return st.current; // shields will cover the missed days
    return 0;
  }

  /* Called when the child finishes any activity: extends the streak once per day. */
  function markActive(p) {
    const today = S.todayKey();
    const st = p.streak;
    if (st.lastDay === today) return null;
    let msg = null;
    if (!st.lastDay) {
      st.current = 1;
    } else {
      const gap = S.dayDiff(st.lastDay, today);
      if (gap === 1) st.current += 1;
      else if (gap > 1 && gap - 1 <= st.freezes) {
        st.freezes -= gap - 1;
        st.current += 1;
        msg = '🧊 Streak Shield dipakai! Streak kamu selamat.';
      } else {
        st.current = 1;
      }
    }
    st.lastDay = today;
    st.best = Math.max(st.best, st.current);
    return msg;
  }

  function seededPick(seedStr, arr, n) {
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
    const a = arr.slice();
    const out = [];
    while (out.length < n && a.length) {
      h = (h * 1103515245 + 12345) >>> 0;
      out.push(a.splice(h % a.length, 1)[0]);
    }
    return out;
  }

  function ensureQuests(p) {
    const today = S.todayKey();
    if (p.quests && p.quests.day === today) return p.quests;
    const main = seededPick(today + p.id, App.QUEST_POOL.filter(function (q) { return q.event === 'reading' || q.event === 'video'; }), 1);
    const rest = seededPick(today + p.id + 'x', App.QUEST_POOL.filter(function (q) { return q.id !== main[0].id; }), 2);
    p.quests = {
      day: today,
      chestClaimed: false,
      list: main.concat(rest).map(function (q) { return { id: q.id, progress: 0, done: false }; })
    };
    S.save();
    return p.quests;
  }

  function questDef(id) { return App.QUEST_POOL.find(function (q) { return q.id === id; }); }

  function allQuestsDone(p) {
    return p.quests && p.quests.list.every(function (q) { return q.done; });
  }

  const rewards = {
    rankFor: rankFor,
    petStage: petStage,
    liveStreak: liveStreak,
    ensureQuests: ensureQuests,
    questDef: questDef,
    allQuestsDone: allQuestsDone,

    petHappiness: function (p) {
      const since = p.pet.hDay || S.todayKey();
      const idle = Math.max(0, S.dayDiff(since, S.todayKey()));
      return Math.max(0, Math.min(100, p.pet.happiness - idle * 15));
    },

    setHappiness: function (p, v) {
      p.pet.happiness = Math.max(0, Math.min(100, v));
      p.pet.hDay = S.todayKey(); // decay counts from here
    },

    /* Progress quests for an event. */
    track: function (event, n) {
      const p = S.profile();
      if (!p) return;
      ensureQuests(p);
      p.quests.list.forEach(function (q) {
        const d = questDef(q.id);
        if (!d || q.done || d.event !== event) return;
        q.progress = Math.min(d.target, q.progress + (n || 1));
        if (q.progress >= d.target) {
          q.done = true;
          p.coins += d.coins;
          App.ui.sfx.coin();
          App.ui.toast('✅ Quest selesai: <b>' + App.ui.esc(d.text) + '</b> +' + d.coins + ' 🪙');
          if (allQuestsDone(p)) App.ui.toast('🎁 Semua quest selesai! Buka peti harta di Beranda!', 4000);
        }
      });
      S.save();
    },

    /* Give XP (and optional coins) for finishing something. Handles streak, goal, rank-up, badges. */
    award: function (xp, coins, label) {
      const p = S.profile();
      if (!p) return;
      const beforeRank = rankFor(p.xp).rank;
      const beforeStage = petStage(p.xp);
      const day = S.day(p);
      const shieldMsg = markActive(p);
      p.xp += xp;
      p.coins += coins || 0;
      day.xp += xp;
      day.activities += 1;
      rewards.setHappiness(p, rewards.petHappiness(p) + 10);
      p.history.unshift({ t: Date.now(), label: label, xp: xp });
      p.history = p.history.slice(0, 200);
      S.save();

      if (shieldMsg) App.ui.toast(shieldMsg, 4000);
      rewards.track('xp', xp);

      if (!day.goalMet && day.xp >= p.settings.dailyGoal) {
        day.goalMet = true;
        p.coins += 15;
        S.save();
        setTimeout(function () {
          App.ui.confetti(160);
          App.ui.sfx.win();
          App.ui.modal(
            '<div class="celebrate"><div class="big-emoji">🎯</div><h2>Daily Goal Complete!</h2>' +
            '<p>Target harian tercapai! Streak kamu sekarang <b>🔥 ' + p.streak.current + ' hari</b>.</p>' +
            '<p class="reward-line">+15 🪙 bonus</p><button class="btn primary" data-close>Yay! 🎉</button></div>'
          );
        }, 900);
      }

      const afterRank = rankFor(p.xp).rank;
      if (afterRank !== beforeRank) {
        setTimeout(function () {
          App.ui.confetti(200);
          App.ui.sfx.win();
          App.ui.modal('<div class="celebrate"><div class="big-emoji">' + afterRank.icon + '</div><h2>New Rank!</h2><p>Kamu sekarang <b>' + afterRank.name + '</b>!</p><button class="btn primary" data-close>Awesome!</button></div>');
        }, 1600);
      }
      const afterStage = petStage(p.xp);
      if (afterStage !== beforeStage) {
        setTimeout(function () {
          App.ui.modal('<div class="celebrate"><div class="big-emoji pet-bounce">' + afterStage.face + '</div><h2>Lumo evolved!</h2><p>Lumo berubah menjadi <b>' + afterStage.name + '</b>!</p><button class="btn primary" data-close>Hello, Lumo!</button></div>');
        }, 2300);
      }
      rewards.checkBadges();
      App.shell && App.shell.refreshTop();
    },

    checkBadges: function () {
      const p = S.profile();
      if (!p) return;
      const fresh = App.BADGES.filter(function (b) { return !p.badges[b.id] && b.check(p); });
      fresh.forEach(function (b, i) {
        p.badges[b.id] = Date.now();
        p.coins += 10;
        setTimeout(function () {
          App.ui.sfx.win();
          App.ui.toast('🏅 Badge baru: <b>' + b.icon + ' ' + b.name + '</b> +10 🪙', 4000);
        }, 1200 + i * 700);
      });
      if (fresh.length) S.save();
    },

    openChest: function () {
      const p = S.profile();
      if (!allQuestsDone(p) || p.quests.chestClaimed) return null;
      p.quests.chestClaimed = true;
      const roll = Math.random();
      let prize;
      if (roll < 0.12) { p.streak.freezes += 1; prize = { icon: '🧊', text: 'Streak Shield!' }; }
      else if (roll < 0.3) { const c = 50; p.coins += c; prize = { icon: '💰', text: '+' + c + ' coins (JACKPOT!)' }; }
      else { const c = 15 + Math.floor(Math.random() * 20); p.coins += c; prize = { icon: '🪙', text: '+' + c + ' coins' }; }
      p.stats.chests += 1;
      S.save();
      rewards.award(20, 0, 'Daily chest');
      return prize;
    },

    buy: function (itemId) {
      const p = S.profile();
      const item = App.SHOP.find(function (i) { return i.id === itemId; });
      if (!item) return false;
      if (p.coins < item.price) { App.ui.toast('🪙 Koin belum cukup. Ayo baca lagi!'); App.ui.sfx.wrong(); return false; }
      if (item.type === 'power') {
        if (p.streak.freezes >= 3) { App.ui.toast('Maksimal 3 Streak Shield.'); return false; }
        p.streak.freezes += 1;
      } else if (item.type === 'food') {
        const plus = item.id === 'food-cake' ? 40 : 15;
        rewards.setHappiness(p, rewards.petHappiness(p) + plus);
        p.pet.lastFed = Date.now();
      } else {
        if (p.owned.indexOf(item.id) >= 0) return false;
        p.owned.push(item.id);
        p.equipped[item.type] = item.id;
      }
      p.coins -= item.price;
      App.ui.sfx.coin();
      S.save();
      return true;
    }
  };

  App.rewards = rewards;
})();
