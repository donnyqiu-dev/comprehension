/* App shell: router, top bar, profile picker. */
(function () {
  const ui = App.ui, S = App.store;
  const AVATARS = ['🦊', '🐼', '🐯', '🐸', '🐨', '🦁', '🐰', '🐧', '🦄', '🐙', '🐢', '🦖'];

  let cleanup = null; // screens can register a function to run when leaving (stop video, speech…)

  const shell = {
    onLeave: function (fn) { cleanup = fn; },
    refreshTop: function () {
      const p = S.profile();
      if (!p) return;
      ui.$('#top-streak').textContent = '🔥 ' + App.rewards.liveStreak(p);
      ui.$('#top-coins').textContent = '🪙 ' + p.coins;
      ui.$('#top-xp').textContent = '⭐ ' + p.xp;
      ui.$('#top-avatar').textContent = p.avatar;
    }
  };
  App.shell = shell;

  const routes = [
    [/^\/?$/, function () { App.views.home(); }, 'home'],
    [/^\/read$/, function () { App.views.library(); }, 'read'],
    [/^\/read\/(.+)$/, function (id) { App.views.reading(id); }, 'read'],
    [/^\/watch$/, function () { App.views.videoLibrary(); }, 'watch'],
    [/^\/watch\/(.+)$/, function (id) { App.views.video(id); }, 'watch'],
    [/^\/words$/, function () { App.views.words(); }, 'words'],
    [/^\/words\/(review|match|spell|gap)$/, function (g) { App.views.wordGame(g); }, 'words'],
    [/^\/me$/, function () { App.views.me(); }, 'me'],
    [/^\/parent$/, function () { App.views.parent(); }, 'parent'],
    [/^\/parent\/build\/(reading|video)(?:\/(.+))?$/, function (kind, id) { App.views.builder(kind, id); }, 'parent']
  ];

  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { console.warn(e); } cleanup = null; }
    ui.stopSpeaking();
    const app = ui.$('#app');
    const path = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';

    if (!S.profile()) {
      ui.$('#topbar').hidden = true;
      ui.$('#tabbar').hidden = true;
      profiles();
      return;
    }
    ui.$('#topbar').hidden = false;
    ui.$('#tabbar').hidden = false;
    shell.refreshTop();
    App.rewards.ensureQuests(S.profile());

    for (let i = 0; i < routes.length; i++) {
      const m = path.match(routes[i][0]);
      if (m) {
        ui.$all('#tabbar a').forEach(function (a) { a.classList.toggle('active', a.dataset.tab === routes[i][2]); });
        routes[i][1].apply(null, m.slice(1));
        window.scrollTo(0, 0);
        app.focus({ preventScroll: true });
        return;
      }
    }
    app.innerHTML = '<div class="card center"><h2>Halaman tidak ditemukan</h2><a class="btn" href="#/">Home</a></div>';
  }

  /* ---------- Profile picker / onboarding ---------- */
  function profiles() {
    const list = S.profiles();
    const app = ui.$('#app');
    app.innerHTML =
      '<section class="welcome">' +
      '<div class="hero-emoji">📖🦉✨</div>' +
      '<h1 class="title-font">ReadQuest</h1>' +
      '<p class="lead">English reading &amp; video adventure<br><small>Petualangan membaca &amp; menonton dalam Bahasa Inggris</small></p>' +
      (list.length ? '<h3>Who is reading today? <small>Siapa yang belajar hari ini?</small></h3><div class="profile-grid">' +
        list.map(function (p) {
          return '<button class="profile-card" data-id="' + p.id + '"><span class="pa">' + p.avatar + '</span><b>' + ui.esc(p.name) + '</b><small>🔥 ' + App.rewards.liveStreak(p) + ' · ⭐ ' + p.xp + '</small></button>';
        }).join('') + '</div>' : '') +
      '<div class="card new-profile">' +
      '<h3>' + (list.length ? '➕ Add a reader' : '👋 Let\'s start! <small>Ayo mulai!</small>') + '</h3>' +
      '<label>Your name / Nama kamu<input id="np-name" maxlength="20" placeholder="e.g. Sari" autocomplete="off"></label>' +
      '<div class="avatar-pick">' + AVATARS.map(function (a, i) { return '<button class="av' + (i === 0 ? ' sel' : '') + '" data-av="' + a + '">' + a + '</button>'; }).join('') + '</div>' +
      '<label>Starting level / Level awal' +
      '<select id="np-level">' + [1, 2, 3, 4, 5].map(function (l) { return '<option value="' + l + '"' + (l === 2 ? ' selected' : '') + '>' + App.LEVELS[l].name + ' (' + App.LEVELS[l].grade + ')</option>'; }).join('') + '</select></label>' +
      '<p class="small muted">Tidak yakin? Pilih Level 2. Level akan naik/turun otomatis sesuai hasil kuis (seperti ReadTheory).</p>' +
      '<button class="btn primary big" id="np-go">Start adventure 🚀</button>' +
      '</div>' +
      '<p class="small muted center">🔒 Semua data tersimpan hanya di perangkat ini (localStorage). Tidak perlu akun.</p>' +
      '</section>';

    let avatar = AVATARS[0];
    ui.$all('.av', app).forEach(function (b) {
      b.onclick = function () {
        ui.$all('.av', app).forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel'); avatar = b.dataset.av;
      };
    });
    ui.$all('.profile-card', app).forEach(function (b) {
      b.onclick = function () { S.switchProfile(b.dataset.id); location.hash = '#/'; route(); };
    });
    ui.$('#np-go').onclick = function () {
      const name = ui.$('#np-name').value.trim();
      if (!name) { ui.toast('Tulis namamu dulu ya ✏️'); ui.$('#np-name').focus(); return; }
      const p = S.createProfile(name, avatar);
      p.readingLevel = Number(ui.$('#np-level').value);
      App.rewards.ensureQuests(p);
      S.save();
      ui.confetti(100);
      location.hash = '#/';
      route();
      setTimeout(function () {
        ui.modal('<div class="celebrate"><div class="big-emoji pet-bounce">🥚</div><h2>Hi ' + ui.esc(name) + '!</h2>' +
          '<p>This is your egg. Read, watch and learn words to earn <b>⭐ XP</b>, and it will hatch into <b>Lumo</b>!</p>' +
          '<p class="small">Ini telurmu. Kumpulkan XP dengan membaca & menonton agar telur menetas. Jaga 🔥 streak dengan belajar setiap hari!</p>' +
          '<button class="btn primary" data-close>Let\'s go!</button></div>');
      }, 400);
    };
  }

  ui.$('#top-avatar').addEventListener('click', function () {
    S.db.activeId = null; S.save(); location.hash = '#/'; route();
  });

  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', route);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) shell.refreshTop(); // new day while the tab stayed open
  });

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* offline cache is optional */ });
  }

  App.route = route;
  App.views = App.views || {};
})();
