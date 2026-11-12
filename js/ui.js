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

  /* ---------- Text to speech ----------
     Browsers ship very different voices. We rank them so natural/neural voices win over
     old robotic ones, speak long text sentence by sentence (natural pauses, and Chrome
     otherwise cuts off long utterances), and play real human recordings for single words
     when they are available online. */
  let voices = [];
  let speakToken = 0;

  function voiceScore(v) {
    if (!/^en/i.test(v.lang)) return -1;
    const n = v.name;
    let s = 0;
    if (/natural|neural|online/i.test(n)) s += 60;           // Edge / Windows neural voices
    if (/enhanced|premium|siri/i.test(n)) s += 50;            // Apple high quality voices
    if (/^Google (US|UK) English/i.test(n)) s += 40;          // Chrome online voices
    if (/Samantha|Ava|Allison|Susan|Zoe|Karen|Daniel|Serena|Moira|Tessa/i.test(n)) s += 30;
    if (/en[-_](US|GB)/i.test(v.lang)) s += 10;
    if (/espeak|compact|Zira|David|Mark|Hazel|George|Fred|Albert|Bad News|Bells|Boing|Bubbles|Cellos|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Junior|Ralph|Kathy|Princess|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley/i.test(n)) s -= 40;
    return s;
  }

  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    voices = speechSynthesis.getVoices().filter(function (v) { return voiceScore(v) >= 0 || /^en/i.test(v.lang); })
      .sort(function (a, b) { return voiceScore(b) - voiceScore(a); });
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }

  function currentVoice() {
    const p = App.store.profile();
    const want = p && p.settings.voice;
    return (want && voices.find(function (v) { return v.voiceURI === want; })) || voices[0] || null;
  }

  /* Google's online voices already run a little fast, so slow them slightly. */
  function rateFor(v, base) {
    return Math.max(0.5, Math.min(1.3, base * (v && /^Google/i.test(v.name) ? 0.92 : 1)));
  }

  function splitSentences(text) {
    const out = [];
    const re = /[^.!?]+[.!?]+["'”’)]*\s*|[^.!?]+$/g;
    let m;
    while ((m = re.exec(text))) { if (m[0].trim()) out.push({ text: m[0], offset: m.index }); }
    return out.length ? out : [{ text: text, offset: 0 }];
  }

  function speak(text, opts) {
    opts = opts || {};
    stopSpeaking();
    if (!('speechSynthesis' in window)) { toast('🔇 Browser ini belum mendukung suara.'); return null; }
    const token = ++speakToken;
    const p = App.store.profile();
    const v = currentVoice();
    const rate = rateFor(v, opts.rate || (p ? p.settings.ttsRate : 0.85));
    const parts = splitSentences(String(text));
    parts.forEach(function (part, i) {
      const u = new SpeechSynthesisUtterance(part.text.trim());
      u.rate = rate;
      u.pitch = 1;
      u.lang = v ? v.lang : 'en-US';
      if (v) u.voice = v;
      if (opts.onboundary) u.onboundary = function (e) {
        if (token !== speakToken) return;
        opts.onboundary({ name: e.name, charIndex: part.offset + (part.text.length - part.text.trimStart().length) + e.charIndex });
      };
      if (i === parts.length - 1 && opts.onend) u.onend = function () { if (token === speakToken) opts.onend(); };
      speechSynthesis.speak(u);
    });
    return true;
  }

  /* Real human pronunciation for single words (from the free dictionary API, which links
     to Wiktionary/Commons recordings). Falls back to the best TTS voice. */
  const AUDIO_KEY = 'rq-word-audio';
  let audioCache = {};
  try { audioCache = JSON.parse(localStorage.getItem(AUDIO_KEY) || '{}'); } catch (e) { audioCache = {}; }
  let currentAudio = null;

  function wordAudioUrl(word) {
    const w = String(word).trim().toLowerCase();
    if (!/^[a-z][a-z'-]*$/.test(w)) return Promise.resolve(null);
    if (audioCache[w] !== undefined) return Promise.resolve(audioCache[w] || null);
    return fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w))
      .then(function (r) {
        if (r.status === 404) return [];
        if (!r.ok) throw new Error('lookup failed');
        return r.json();
      })
      .then(function (data) {
        const urls = [];
        (Array.isArray(data) ? data : []).forEach(function (entry) {
          (entry.phonetics || []).forEach(function (ph) { if (ph.audio) urls.push(ph.audio.replace(/^\/\//, 'https://')); });
        });
        const url = urls.find(function (u) { return /-us\.mp3$/i.test(u); }) || urls.find(function (u) { return /-(uk|au|ca)\.mp3$/i.test(u); }) || urls[0] || '';
        audioCache[w] = url;
        try { localStorage.setItem(AUDIO_KEY, JSON.stringify(audioCache)); } catch (e) { /* cache is optional */ }
        return url || null;
      })
      .catch(function () { return null; }); // offline: do not cache, try again later
  }

  function sayWord(word, opts) {
    opts = opts || {};
    stopSpeaking();
    const token = ++speakToken;
    const p = App.store.profile();
    function afterWord(tok) {
      if (opts.then) setTimeout(function () { if (tok === speakToken) speak(opts.then); }, 350);
    }
    function tts() {
      speak(word + '.', {
        rate: (p ? p.settings.ttsRate : 0.85) * 0.85 * (opts.slow ? 0.8 : 1),
        onend: function () { afterWord(speakToken); }
      });
    }
    if (p && p.settings.humanAudio === false) { tts(); return; }
    const timeout = new Promise(function (res) { setTimeout(function () { res('timeout'); }, 1500); });
    Promise.race([wordAudioUrl(word), timeout]).then(function (url) {
      if (token !== speakToken) return;
      if (!url || url === 'timeout') { tts(); return; }
      const a = new Audio(url);
      currentAudio = a;
      if (opts.slow) { a.playbackRate = 0.75; a.preservesPitch = true; }
      a.onended = function () { if (token === speakToken) afterWord(token); };
      a.play().catch(function () { if (token === speakToken) tts(); });
    });
  }

  /* Look up recordings ahead of time so the first tap plays instantly. */
  function preloadWords(words) {
    words.forEach(function (w, i) { setTimeout(function () { wordAudioUrl(w); }, i * 150); });
  }

  function stopSpeaking() {
    speakToken++;
    if (currentAudio) { try { currentAudio.pause(); } catch (e) { /* ignore */ } currentAudio = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  function listVoices() { loadVoices(); return voices.map(function (v) { return { uri: v.voiceURI, name: v.name, lang: v.lang, good: voiceScore(v) >= 40 }; }); }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function countWords(s) { return (s.trim().match(/[A-Za-z']+/g) || []).length; }

  App.ui = { esc: esc, $: $, $all: $all, toast: toast, modal: modal, confetti: confetti, sfx: sfx, speak: speak, sayWord: sayWord, preloadWords: preloadWords, listVoices: listVoices, stopSpeaking: stopSpeaking, shuffle: shuffle, countWords: countWords };
})();
