/* Small UI helpers: DOM builder, toasts, modals, confetti, sounds, text-to-speech. */
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function toast(msg, ms) {
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = msg;
    box.appendChild(el);
    setTimeout(function () { el.classList.add('out'); }, ms || 2600);
    setTimeout(function () { el.remove(); }, (ms || 2600) + 400);
  }

  /* modal(html, {onClose}) -> returns close function. Buttons with [data-close] close it. */
  function modal(html, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap';
    wrap.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(wrap);
    function close() {
      if (!wrap.isConnected) return;
      wrap.remove();
      opts.onClose && opts.onClose();
    }
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap && !opts.sticky) close();
      if (e.target.closest('[data-close]')) close();
    });
    return { el: wrap.firstChild, close: close };
  }

  /* ---------- Confetti ---------- */
  function confetti(n) {
    const canvas = $('#confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
    const parts = [];
    for (let i = 0; i < (n || 120); i++) {
      parts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -14 - 4,
        s: Math.random() * 8 + 4,
        c: colors[i % colors.length],
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3
      });
    }
    let frame = 0;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function (p) {
        p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (frame++ < 150) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    tick();
  }

  /* ---------- Sounds (generated, no files needed) ---------- */
  let actx = null;
  function beep(freqs, dur, type) {
    const p = App.store.profile();
    if (p && !p.settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime;
      freqs.forEach(function (f, i) {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = type || 'sine';
        o.frequency.value = f;
        const st = t0 + i * dur;
        g.gain.setValueAtTime(0.0001, st);
        g.gain.exponentialRampToValueAtTime(0.2, st + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, st + dur);
        o.connect(g); g.connect(actx.destination);
        o.start(st); o.stop(st + dur + 0.02);
      });
    } catch (e) { /* audio not available */ }
  }
  const sfx = {
    right: function () { beep([660, 880], 0.12); },
    wrong: function () { beep([220, 180], 0.16, 'triangle'); },
    coin: function () { beep([988, 1319], 0.08, 'square'); },
    win: function () { beep([523, 659, 784, 1047], 0.13); },
    pop: function () { beep([440], 0.06); }
  };

  /* ---------- Text to speech ---------- */
  let voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(function (v) { return /en[-_]GB/i.test(v.lang) && /female|Google UK/i.test(v.name); }) ||
      vs.find(function (v) { return /en[-_](US|GB)/i.test(v.lang); }) ||
      vs.find(function (v) { return /^en/i.test(v.lang); }) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text, opts) {
    opts = opts || {};
    if (!('speechSynthesis' in window)) { toast('🔇 Browser ini belum mendukung suara.'); return null; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const p = App.store.profile();
    u.rate = opts.rate || (p ? p.settings.ttsRate : 0.9);
    u.lang = 'en-US';
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    if (opts.onboundary) u.onboundary = opts.onboundary;
    if (opts.onend) u.onend = opts.onend;
    speechSynthesis.speak(u);
    return u;
  }
  function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function countWords(s) { return (s.trim().match(/[A-Za-z']+/g) || []).length; }

  App.ui = { esc: esc, $: $, $all: $all, toast: toast, modal: modal, confetti: confetti, sfx: sfx, speak: speak, stopSpeaking: stopSpeaking, shuffle: shuffle, countWords: countWords };
})();
