/* Lumo's room: pet, shop, badges, ranks. */
(function () {
  const ui = App.ui, S = App.store, R = App.rewards, C = App.common;
  App.views = App.views || {};
  let tab = 'shop';

  App.views.me = function () {
    const p = S.profile();
    const stage = R.petStage(p.xp);
    const nextStage = App.PET_STAGES.find(function (s) { return s.xp > p.xp; });
    const happy = R.petHappiness(p);
    const rk = R.rankFor(p.xp);
    const eq = function (type) { const it = App.SHOP.find(function (i) { return i.id === p.equipped[type]; }); return it || null; };
    const bg = eq('bg');
    const mood = happy >= 70 ? '😄' : happy >= 40 ? '🙂' : happy >= 15 ? '😟' : '😢';
    const say = happy < 30 ? 'I miss you! Let\'s read together today? 🥺' : stage.say;

    ui.$('#app').innerHTML =
      C.header('🦉 Lumo\'s Room') +
      '<div class="card room" style="' + (bg ? 'background:' + bg.css : '') + '">' +
      '<div class="bubble">' + ui.esc(say) + '</div>' +
      '<div class="pet" id="pet">' +
      (eq('hat') ? '<span class="pet-hat big">' + eq('hat').icon + '</span>' : '') +
      '<span class="pet-face big">' + stage.face + '</span>' +
      (eq('glasses') ? '<span class="pet-glasses">' + eq('glasses').icon + '</span>' : '') +
      '</div>' +
      '<div class="pet-info"><b>' + stage.name + '</b> ' + mood +
      '<div class="bar happy"><i style="width:' + happy + '%"></i></div><small>Happiness ' + happy + '% · belajar & beri makan agar Lumo senang</small>' +
      (nextStage ? '<small>Evolves at ' + nextStage.xp + ' XP (' + (nextStage.xp - p.xp) + ' to go)</small>' : '<small>Max evolution! 👑</small>') +
      '</div></div>' +
      '<div class="tabs">' +
      ['shop', 'closet', 'badges', 'ranks'].map(function (t) {
        return '<button class="tab ' + (tab === t ? 'on' : '') + '" data-t="' + t + '">' + { shop: '🛒 Shop', closet: '👕 Closet', badges: '🏅 Badges', ranks: '🪜 Ranks' }[t] + '</button>';
      }).join('') + '</div><div id="tabbody"></div>';

    ui.$('#pet').onclick = function () { this.classList.remove('pet-bounce'); void this.offsetWidth; this.classList.add('pet-bounce'); ui.sfx.pop(); };
    ui.$all('.tab').forEach(function (b) { b.onclick = function () { tab = b.dataset.t; App.views.me(); }; });
    const body = ui.$('#tabbody');

    if (tab === 'shop') {
      body.innerHTML = '<p class="small muted">Kamu punya <b>🪙 ' + p.coins + '</b> koin. Dapatkan koin dari kuis, quest harian, badge, dan peti harta.</p><div class="shop">' +
        App.SHOP.map(function (it) {
          const owned = p.owned.indexOf(it.id) >= 0;
          return '<div class="card shop-item ' + (owned ? 'owned' : '') + '"><span class="si-icon">' + it.icon + '</span><b>' + it.name + '</b>' +
            (it.desc ? '<small>' + ui.esc(it.desc) + '</small>' : '') +
            (it.id === 'freeze' ? '<small>Punya: ' + p.streak.freezes + '/3</small>' : '') +
            (owned ? '<span class="pill ok">Owned</span>' : '<button class="btn small ' + (p.coins >= it.price ? 'primary' : '') + '" data-buy="' + it.id + '">🪙 ' + it.price + '</button>') + '</div>';
        }).join('') + '</div>';
      ui.$all('[data-buy]').forEach(function (b) {
        b.onclick = function () {
          if (R.buy(b.dataset.buy)) {
            const it = App.SHOP.find(function (i) { return i.id === b.dataset.buy; });
            ui.toast(it.icon + ' ' + (it.type === 'food' ? 'Nyam! Lumo senang!' : it.name + ' dibeli!'));
            App.shell.refreshTop();
            App.views.me();
          }
        };
      });
    } else if (tab === 'closet') {
      const owned = App.SHOP.filter(function (i) { return p.owned.indexOf(i.id) >= 0; });
      body.innerHTML = owned.length ? '<div class="shop">' + owned.map(function (it) {
        const on = p.equipped[it.type] === it.id;
        return '<button class="card shop-item ' + (on ? 'equipped' : '') + '" data-eq="' + it.id + '"><span class="si-icon">' + it.icon + '</span><b>' + it.name + '</b><small>' + (on ? '✓ Wearing (tap to remove)' : 'Tap to wear') + '</small></button>';
      }).join('') + '</div>' : '<p class="muted">Belum ada barang. Beli di Shop! 🛒</p>';
      ui.$all('[data-eq]').forEach(function (b) {
        b.onclick = function () {
          const it = App.SHOP.find(function (i) { return i.id === b.dataset.eq; });
          p.equipped[it.type] = p.equipped[it.type] === it.id ? null : it.id;
          S.save(); App.views.me();
        };
      });
    } else if (tab === 'badges') {
      const got = Object.keys(p.badges).length;
      body.innerHTML = '<p class="small muted">' + got + ' / ' + App.BADGES.length + ' badges</p><div class="badges">' +
        App.BADGES.map(function (b) {
          const has = !!p.badges[b.id];
          return '<div class="badge ' + (has ? 'has' : '') + '"><span>' + (has ? b.icon : '🔒') + '</span><b>' + b.name + '</b><small>' + b.desc + '</small></div>';
        }).join('') + '</div>';
    } else {
      body.innerHTML = '<div class="ranks">' + App.RANKS.map(function (r) {
        const reached = p.xp >= r.xp;
        return '<div class="rank-row ' + (reached ? 'reached' : '') + (r === rk.rank ? ' current' : '') + '"><span>' + r.icon + '</span><b>' + r.name + '</b><small>' + r.xp + ' XP</small></div>';
      }).join('') + '</div>';
    }
  };
})();
