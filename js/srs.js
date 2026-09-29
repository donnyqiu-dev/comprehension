/* Spaced repetition (Leitner boxes). Box 0 = new, box 5 = mastered long-term. */
(function () {
  const INTERVALS = [0, 1, 2, 4, 7, 15]; // days until next review, per box
  const MASTERED_BOX = 4;

  function addDays(key, n) {
    const p = key.split('-').map(Number);
    const d = new Date(p[0], p[1] - 1, p[2] + n);
    return App.store.todayKey(d);
  }

  const srs = {
    /* Save a word to the child's word bank. Returns true when it is new. */
    addWord: function (p, entry, source) {
      const key = entry.w.toLowerCase();
      if (p.words[key]) return false;
      p.words[key] = {
        w: entry.w,
        pos: entry.pos || '',
        def: entry.def || '',
        id: entry.id || '',
        ex: entry.ex || '',
        source: source || '',
        box: 0,
        due: App.store.todayKey(),
        added: Date.now(),
        right: 0,
        wrong: 0
      };
      return true;
    },
    grade: function (p, key, correct) {
      const w = p.words[key];
      if (!w) return;
      if (correct) {
        w.box = Math.min(5, w.box + 1);
        w.right++;
      } else {
        w.box = Math.max(0, w.box - 2);
        w.wrong++;
      }
      w.due = addDays(App.store.todayKey(), correct ? INTERVALS[w.box] : 0);
      w.last = Date.now();
    },
    due: function (p) {
      const today = App.store.todayKey();
      return Object.keys(p.words).filter(function (k) { return p.words[k].due <= today; });
    },
    masteredCount: function (p) {
      return Object.values(p.words).filter(function (w) { return w.box >= MASTERED_BOX; }).length;
    },
    isMastered: function (w) { return w.box >= MASTERED_BOX; },
    MASTERED_BOX: MASTERED_BOX
  };

  App.srs = srs;
})();
