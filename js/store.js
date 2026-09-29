/* Local storage layer. Everything lives in this browser only (localStorage). */
(function () {
  const KEY = 'readquest.v1';
  const VERSION = 1;

  function todayKey(d) {
    d = d || new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function dayDiff(a, b) {
    // whole days between two YYYY-MM-DD keys (b - a)
    const pa = a.split('-').map(Number);
    const pb = b.split('-').map(Number);
    const ta = Date.UTC(pa[0], pa[1] - 1, pa[2]);
    const tb = Date.UTC(pb[0], pb[1] - 1, pb[2]);
    return Math.round((tb - ta) / 86400000);
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function emptyDb() {
    return { version: VERSION, activeId: null, parentPin: null, profiles: {}, customReadings: [], customVideos: [] };
  }

  function newProfile(name, avatar) {
    return {
      id: uid(),
      name: name,
      avatar: avatar || '🦊',
      createdAt: Date.now(),
      xp: 0,
      coins: 20,
      readingLevel: 2,
      levelHistory: [],
      streak: { current: 0, best: 0, lastDay: null, freezes: 1 },
      days: {},
      readings: {},
      videos: {},
      words: {},
      skills: {},
      badges: {},
      quests: null,
      pet: { name: 'Lumo', lastFed: null, happiness: 60 },
      owned: [],
      equipped: { hat: null, glasses: null, bg: null },
      stats: { questionsRight: 0, questionsTotal: 0, perfect: 0, wordsReviewed: 0, speaking: 0, writing: 0, chests: 0 },
      settings: { dailyGoal: 50, ttsRate: 0.85, voice: '', humanAudio: true, sound: true, showIndo: true },
      history: []
    };
  }

  let db = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptyDb();
      const data = JSON.parse(raw);
      return migrate(data);
    } catch (e) {
      console.warn('Could not read saved data', e);
      return emptyDb();
    }
  }

  function migrate(data) {
    const base = emptyDb();
    const out = Object.assign(base, data);
    // make sure old profiles have every field a newer version expects
    Object.keys(out.profiles).forEach(function (id) {
      const p = out.profiles[id];
      const fresh = newProfile(p.name, p.avatar);
      Object.keys(fresh).forEach(function (k) {
        if (p[k] === undefined) p[k] = fresh[k];
      });
      ['settings', 'stats', 'streak', 'equipped', 'pet'].forEach(function (k) {
        p[k] = Object.assign({}, fresh[k], p[k]);
      });
      if (p.settings.ttsRate === 0.9) p.settings.ttsRate = 0.85; // old default was a bit fast
      if (p.settings.ttsRate === 1.05) p.settings.ttsRate = 1;
    });
    out.version = VERSION;
    return out;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.warn('Could not save', e);
      App.ui && App.ui.toast('⚠️ Tidak bisa menyimpan. Penyimpanan browser penuh atau diblokir.');
      return false;
    }
  }

  const Store = {
    todayKey: todayKey,
    dayDiff: dayDiff,
    uid: uid,
    get db() { return db; },
    save: save,
    profile: function () {
      return db.activeId ? db.profiles[db.activeId] || null : null;
    },
    profiles: function () {
      return Object.values(db.profiles).sort(function (a, b) { return a.createdAt - b.createdAt; });
    },
    createProfile: function (name, avatar) {
      const p = newProfile(name, avatar);
      db.profiles[p.id] = p;
      db.activeId = p.id;
      save();
      return p;
    },
    switchProfile: function (id) {
      if (db.profiles[id]) { db.activeId = id; save(); }
    },
    deleteProfile: function (id) {
      delete db.profiles[id];
      if (db.activeId === id) db.activeId = null;
      save();
    },
    day: function (p, key) {
      key = key || todayKey();
      if (!p.days[key]) p.days[key] = { xp: 0, activities: 0, minutes: 0, goalMet: false };
      return p.days[key];
    },
    exportJson: function () {
      return JSON.stringify(db, null, 2);
    },
    importJson: function (text) {
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || !data.profiles) throw new Error('File bukan cadangan ReadQuest');
      db = migrate(data);
      save();
    },
    resetAll: function () {
      db = emptyDb();
      save();
    }
  };

  window.App = window.App || {};
  App.store = Store;
})();
