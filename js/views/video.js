/* Video library + interactive video lesson (Edpuzzle style: pauses for questions, no skipping ahead). */
(function () {
  const ui = App.ui, S = App.store, R = App.rewards, C = App.common;
  App.views = App.views || {};

  /* ---------- YouTube IFrame API loader ---------- */
  let ytPromise = null;
  function loadYT() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (ytPromise) return ytPromise;
    ytPromise = new Promise(function (resolve, reject) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () { prev && prev(); resolve(window.YT); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = function () { ytPromise = null; reject(new Error('YouTube tidak bisa dimuat')); };
      document.head.appendChild(s);
      setTimeout(function () { if (!(window.YT && window.YT.Player)) { ytPromise = null; reject(new Error('timeout')); } }, 15000);
    });
    return ytPromise;
  }

  /* Accept a full YouTube link or an ID. */
  function parseYouTube(s) {
    s = (s || '').trim();
    const m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
  }
  App.parseYouTube = parseYouTube;
  App.makePlayer = function (v, mount, events, opts) { return makePlayer(v, mount, events, opts); };

  function fmt(t) {
    if (t < 0) return 'end';
    if (!isFinite(t)) return '--:--';
    t = Math.round(t);
    return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  }
  App.fmtTime = fmt;

  /* Wraps YouTube or <video> behind one small interface.
     opts.custom: hide the native controls (the lesson page draws its own buttons below the video,
     so the child cannot scrub the timeline or click through to other YouTube videos). */
  function makePlayer(v, mount, events, opts) {
    opts = opts || {};
    if (v.source === 'html5') {
      mount.innerHTML = '<video id="h5" playsinline ' + (opts.custom ? '' : 'controls ') + 'controlsList="nodownload noplaybackrate" src="' + ui.esc(v.url) + '"></video>';
      const el = mount.querySelector('video');
      el.addEventListener('ended', events.onEnded);
      el.addEventListener('error', function () { events.onError('Video tidak bisa diputar.'); });
      el.addEventListener('loadedmetadata', events.onReady);
      return Promise.resolve({
        time: function () { return el.currentTime; },
        duration: function () { return el.duration || 0; },
        play: function () { el.play(); },
        pause: function () { el.pause(); },
        seek: function (t) { el.currentTime = t; },
        playing: function () { return !el.paused; },
        state: function () { return el.ended ? 0 : el.paused ? 2 : 1; },
        setRate: function (r) { el.playbackRate = r; },
        toggleMute: function () { el.muted = !el.muted; return el.muted; },
        hasCaptions: false,
        videoId: function () { return null; },
        destroy: function () { el.pause(); el.removeAttribute('src'); el.load(); }
      });
    }
    return loadYT().then(function (YT) {
      mount.innerHTML = '<div id="ytp"></div>';
      return new Promise(function (resolve) {
        let api = null;
        const player = new YT.Player('ytp', {
          videoId: v.youtubeId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: { controls: opts.custom ? 0 : 1, fs: opts.custom ? 0 : 1, rel: 0, modestbranding: 1, playsinline: 1, disablekb: 1, iv_load_policy: 3, cc_load_policy: 1, cc_lang_pref: 'en', hl: 'en' },
          events: {
            onReady: function () { resolve(api); events.onReady(); },
            onStateChange: function (e) { if (e.data === YT.PlayerState.ENDED) events.onEnded(); },
            onError: function (e) { events.onError('YouTube error ' + e.data + '. Video mungkin tidak bisa di-embed atau sudah dihapus.'); resolve(api); }
          }
        });
        api = {
          time: function () { return player.getCurrentTime ? player.getCurrentTime() : 0; },
          duration: function () { return player.getDuration ? player.getDuration() : 0; },
          play: function () { player.playVideo && player.playVideo(); },
          pause: function () { player.pauseVideo && player.pauseVideo(); },
          seek: function (t) { player.seekTo && player.seekTo(t, true); },
          playing: function () { return player.getPlayerState && player.getPlayerState() === YT.PlayerState.PLAYING; },
          state: function () { return player.getPlayerState ? player.getPlayerState() : null; },
          setRate: function (r) { player.setPlaybackRate && player.setPlaybackRate(r); },
          toggleMute: function () {
            if (player.isMuted && player.isMuted()) { player.unMute(); return false; }
            player.mute && player.mute(); return true;
          },
          hasCaptions: true,
          setCaptions: function (on) {
            try {
              if (on) { player.loadModule('captions'); player.setOption('captions', 'track', { languageCode: 'en' }); }
              else player.unloadModule('captions');
            } catch (e) { /* captions not available for this video */ }
          },
          videoId: function () { const d = player.getVideoData && player.getVideoData(); return d && d.video_id; },
          destroy: function () { try { player.destroy(); } catch (e) { /* ignore */ } }
        };
      });
    });
  }

  /* ---------------- Library ---------------- */
  App.views.videoLibrary = function () {
    const p = S.profile();
    const vids = App.content.videos().slice().sort(function (a, b) { return a.level - b.level; });
    ui.$('#app').innerHTML =
      C.header('🎬 Watch & Answer') +
      '<p class="muted">Video akan berhenti otomatis untuk memberi pertanyaan. Dengarkan baik-baik! Subtitle bahasa Inggris dapat dinyalakan dengan tombol <b>CC</b>.</p>' +
      '<div class="lib-grid">' + vids.map(function (v) {
        const res = p.videos[v.id];
        const thumb = v.source === 'youtube' ? 'https://i.ytimg.com/vi/' + v.youtubeId + '/mqdefault.jpg' : '';
        return '<a class="card vid-card' + (res ? ' done' : '') + '" href="#/watch/' + v.id + '">' +
          '<div class="thumb" style="' + (thumb ? 'background-image:url(' + thumb + ')' : '') + '"><span>' + v.emoji + '</span><b class="qcount">' + v.questions.length + ' ❓</b></div>' +
          '<div class="lib-info"><div class="row gap-s">' + C.levelTag(v.level) + '<small class="muted">' + ui.esc(v.topic) + (v.custom ? ' · ✨ Custom' : '') + '</small></div>' +
          '<h3>' + ui.esc(v.title) + '</h3><small class="muted">' + ui.esc(v.channel || '') + '</small><br>' +
          (res ? C.stars(res.best) : '<small class="new">NEW</small>') + '</div></a>';
      }).join('') + '</div>' +
      '<p class="small muted">Orang tua/guru dapat menambah video sendiri (YouTube atau link video .mp4) di menu 👪 Parent → Lesson Builder.</p>';
  };

  /* ---------------- Lesson ---------------- */
  App.views.video = function (id) {
    const v = App.content.video(id);
    const p = S.profile();
    if (!v) { ui.$('#app').innerHTML = '<div class="card">Video tidak ditemukan. <a href="#/watch">Kembali</a></div>'; return; }

    const qs = v.questions.map(function (q, i) { return Object.assign({ idx: i, answered: false }, q); });
    const vocabs = (v.vocab || []).map(function (w) { return Object.assign({ shown: false }, w); });
    const state = { maxWatched: 0, asking: null, ended: false, answers: [], player: null, timer: null, xp: 0, started: Date.now(), openAnswers: [] };

    ui.$('#app').innerHTML =
      '<div class="lesson-top"><a class="back" href="#/watch">✕</a><div class="lt-title">' + v.emoji + ' ' + ui.esc(v.title) + ' ' + C.levelTag(v.level) + '</div></div>' +
      '<div class="video-layout">' +
      '<div class="video-col">' +
      '<div class="video-stage" id="stage">' +
      '<div class="player-box"><div id="player-mount" class="player locked"><div class="loading">⏳ Loading video…</div></div>' +
      '<div class="player-cover" id="cover" hidden><div class="cover-emoji" id="cover-emoji">🎧</div><b id="cover-text"></b><small id="cover-sub"></small></div>' +
      '<div class="vocab-pop" id="vocab-pop" hidden></div></div>' +
      '<div class="vctrl" id="vctrl">' +
      '<button class="vbtn big" data-c="play" title="Play / Pause">▶</button>' +
      '<button class="vbtn" data-c="back" title="Mundur 10 detik">⏪ 10s</button>' +
      '<span class="vtime" id="vtime">0:00 / 0:00</span><span class="vspace"></span>' +
      '<select class="vbtn" data-c="rate" title="Kecepatan"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option></select>' +
      (v.source === 'youtube' ? '<button class="vbtn on" data-c="cc" title="Subtitle bahasa Inggris">CC</button>' : '') +
      '<button class="vbtn" data-c="mute" title="Suara">🔊</button>' +
      '<button class="vbtn" data-c="fs" title="Layar penuh">⛶</button>' +
      '</div>' +
      '<div class="ad-note" id="ad-note" hidden>📺 Iklan dari YouTube. Tunggu sampai selesai, atau tekan <b>Skip</b> di video jika ada. Video pelajaran akan mulai setelahnya.</div>' +
      '<div class="timeline" id="timeline" title="Klik bagian yang sudah ditonton untuk mengulang"></div>' +
      '</div>' +
      '<div class="row between wrap small muted"><span>⛔ No skipping ahead · Klik timeline ungu untuk mengulang bagian yang sudah ditonton</span><span id="progress-txt"></span></div>' +
      '<div id="question-box"></div>' +
      '</div>' +
      '<aside class="card side"><h3>🎯 Mission</h3><p class="small">' + ui.esc(v.intro || 'Watch carefully and answer the questions.') + '</p>' +
      (vocabs.length ? '<h4>🌱 Words to listen for</h4><ul class="vocab-list">' + vocabs.map(function (w) { return '<li><b>' + ui.esc(w.w) + '</b> – ' + ui.esc(w.def) + (p.settings.showIndo && w.id ? ' <small class="muted">(' + ui.esc(w.id) + ')</small>' : '') + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="small muted">' + ui.esc(v.channel || '') + '</p></aside>' +
      '</div>';

    function drawTimeline() {
      let d = state.player ? state.player.duration() : 0;
      if (!isFinite(d)) d = 0;
      const tl = ui.$('#timeline');
      if (!tl) return;
      if (!d) { tl.innerHTML = ''; return; }
      const cur = state.dragT != null ? state.dragT : (state.player && !state.inAd ? state.player.time() : 0);
      tl.innerHTML = '<div class="tl-watched" style="width:' + (100 * state.maxWatched / d) + '%"></div>' +
        '<div class="tl-head" style="left:' + Math.min(100, 100 * cur / d) + '%"></div>' +
        qs.map(function (q) {
          const pos = q.t < 0 ? 100 : Math.min(100, 100 * q.t / d);
          return '<span class="tl-q ' + (q.answered ? 'done' : '') + '" style="left:' + pos + '%" title="' + fmt(q.t) + '">' + (q.answered ? '✓' : '?') + '</span>';
        }).join('');
      const pt = ui.$('#progress-txt');
      if (pt) pt.textContent = qs.filter(function (q) { return q.answered; }).length + ' / ' + qs.length + ' answered';
    }

    function showVocab(w) {
      const box = ui.$('#vocab-pop');
      if (!box) return;
      const added = App.srs.addWord(p, { w: w.w, def: w.def, id: w.id, pos: '', ex: '' }, v.title);
      if (added) { S.save(); R.track('newword', 1); }
      box.innerHTML = '<b>🌱 ' + ui.esc(w.w) + '</b><span>' + ui.esc(w.def) + '</span>' + (p.settings.showIndo && w.id ? '<small>🇮🇩 ' + ui.esc(w.id) + '</small>' : '') + (added ? '<em>+ saved</em>' : '');
      box.hidden = false;
      box.classList.remove('in'); void box.offsetWidth; box.classList.add('in');
      clearTimeout(box._t);
      box._t = setTimeout(function () { box.hidden = true; }, 6000);
    }

    function updateControls() {
      const pl = state.player;
      if (!pl) return;
      const btn = ui.$('#vctrl [data-c="play"]');
      if (btn) btn.textContent = pl.playing() ? '⏸' : '▶';
      const vt = ui.$('#vtime');
      if (vt) vt.textContent = state.inAd ? '📺 Ad · Iklan' : fmt(pl.time()) + ' / ' + fmt(pl.duration() || 0);
      drawTimeline();
    }

    /* Go back to an already-watched point. If a question is open it is closed and will be
       asked again when the video reaches it (same as "Watch that part again"). */
    function rewindTo(t) {
      const pl = state.player;
      if (!pl) return;
      t = Math.max(0, Math.min(t, state.maxWatched));
      const wasAsking = !!state.asking;
      if (wasAsking) {
        ui.$('#question-box').innerHTML = '';
        state.asking = null;
        cover(false);
      }
      state.ended = false; // end questions are asked again when the end is reached
      pl.seek(t);
      if (wasAsking) pl.play();
      drawTimeline();
    }

    function wireControls() {
      const bar = ui.$('#vctrl');
      bar.addEventListener('click', function (e) {
        const b = e.target.closest('[data-c]');
        const pl = state.player;
        if (!b || !pl) return;
        const c = b.dataset.c;
        if (c === 'play') {
          if (pl.playing()) pl.pause();
          else if (state.asking) nag('✋ Jawab pertanyaannya dulu ya.');
          else pl.play();
        } else if (c === 'back') {
          pl.seek(Math.max(0, pl.time() - 10));
        } else if (c === 'cc') {
          const on = !b.classList.contains('on');
          b.classList.toggle('on', on);
          pl.setCaptions && pl.setCaptions(on);
        } else if (c === 'mute') {
          b.textContent = pl.toggleMute() ? '🔇' : '🔊';
        } else if (c === 'fs') {
          const stage = ui.$('#stage');
          if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
          else if (stage.requestFullscreen) stage.requestFullscreen().catch(function () {});
        }
        updateControls();
      });
      bar.querySelector('[data-c="rate"]').addEventListener('change', function () {
        state.player && state.player.setRate(Number(this.value));
      });
      // The video itself does not take clicks (so YouTube links cannot be opened);
      // a click on the video area toggles play/pause instead.
      ui.$('#player-mount').addEventListener('click', function () {
        bar.querySelector('[data-c="play"]').click();
      });
      // Click or drag the timeline to rewind to any point already watched (never forward).
      const tl = ui.$('#timeline');
      let lastSeek = 0;
      function timeAt(e) {
        const d = state.player ? state.player.duration() : 0;
        if (!d || !isFinite(d)) return null;
        const r = tl.getBoundingClientRect();
        let t = d * Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        if (t > state.maxWatched + 0.5) { nag('⛔ Bagian itu belum ditonton.'); t = state.maxWatched; }
        return t;
      }
      tl.addEventListener('pointerdown', function (e) {
        if (!state.player || state.inAd) return;
        const t = timeAt(e);
        if (t == null) return;
        tl.setPointerCapture(e.pointerId);
        state.dragT = t;
        drawTimeline();
      });
      tl.addEventListener('pointermove', function (e) {
        if (state.dragT == null) return;
        const t = timeAt(e);
        if (t == null) return;
        state.dragT = t;
        drawTimeline();
        if (!state.asking && Date.now() - lastSeek > 200) { lastSeek = Date.now(); state.player.seek(t); }
      });
      function endDrag() {
        if (state.dragT == null) return;
        const t = state.dragT;
        state.dragT = null;
        rewindTo(t);
      }
      tl.addEventListener('pointerup', endDrag);
      tl.addEventListener('pointercancel', endDrag);
    }

    function setAd(on) {
      if (!!state.inAd === on) return;
      state.inAd = on;
      const mount = ui.$('#player-mount'), note = ui.$('#ad-note');
      if (mount) mount.classList.toggle('locked', !on);
      if (note) note.hidden = !on;
      if (!on) state.lastTick = performance.now(); // start timing fresh after the ad
    }

    function nag(msg) {
      const now = Date.now();
      if (now - (state.lastNag || 0) < 3000) return;
      state.lastNag = now;
      ui.toast(msg);
    }

    function tick() {
      const pl = state.player;
      if (!pl) return;
      const now = performance.now();
      const dt = state.lastTick ? (now - state.lastTick) / 1000 : 0.25;
      state.lastTick = now;
      const t = pl.time();
      const st = pl.state ? pl.state() : null;
      const delta = state.lastT != null ? t - state.lastT : 0;
      state.lastT = t;
      // Time running steadily forward (not a seek jump) while the player is not "playing"
      // for about a second means an ad. Seeks and buffering after a seek do not count.
      const recentSeek = now - (state.seekAt || 0) < 2000;
      const steady = !recentSeek && delta > 0.05 && delta < 1.2 && st !== 1 && st !== 2;
      state.adStreak = steady ? (state.adStreak || 0) + 1 : 0;

      // YouTube ads: the player reports the ad's time (and sometimes the ad's video id) while
      // its state is not "playing". During an ad the video must be clickable (Skip button)
      // and our skip/question checks must wait, otherwise the ad time looks like a jump.
      if (v.source === 'youtube' && !state.asking) {
        const vid = pl.videoId && pl.videoId();
        const adNow = (vid && vid !== v.youtubeId) || state.adStreak >= 4;
        if (adNow) setAd(true);
        else if (st === 1 || st === 2 || st === 0) setAd(false);
      }
      updateControls();
      if (state.inAd) return;

      // While a question is open the video must stay paused (the YouTube controls can still be clicked).
      if (state.asking) {
        if (pl.playing() || t > state.maxWatched + 1) {
          pl.pause();
          if (t > state.maxWatched + 1) pl.seek(state.maxWatched);
          nag('✋ Jawab pertanyaannya dulu ya, lalu tekan Continue.');
        }
        return;
      }

      // Prevent skipping ahead. Allowed progress is tied to real elapsed time (up to 2x speed),
      // so dragging the timeline forward in small steps does not slip through either.
      const allowed = state.maxWatched + Math.max(1.5, dt * 2.5);
      if (t > allowed) {
        pl.seek(state.maxWatched);
        nag('⛔ Tidak bisa loncat ke depan. Tonton dulu ya!');
        return;
      }
      if (pl.playing()) state.maxWatched = Math.max(state.maxWatched, t);
      vocabs.forEach(function (w) { if (!w.shown && t >= w.t) { w.shown = true; showVocab(w); } });
      const due = qs.find(function (q) { return !q.answered && q.t >= 0 && t >= q.t; });
      if (due) ask(due);
      drawTimeline();
    }

    /* Hide the video (it stays loaded underneath) while the child answers, so YouTube's
       pause screen with suggested videos is not visible. */
    function cover(on, emoji, text, sub) {
      const mount = ui.$('#player-mount'), c = ui.$('#cover');
      if (!mount || !c) return;
      mount.classList.toggle('covered', !!on);
      c.hidden = !on;
      if (on) {
        ui.$('#cover-emoji').textContent = emoji;
        ui.$('#cover-text').textContent = text;
        ui.$('#cover-sub').textContent = sub || '';
      }
    }

    function ask(q) {
      state.asking = q;
      state.player && state.player.pause();
      cover(true, q.type === 'mc' ? '🎧' : '✍️', 'Answer the question below', 'Jawab pertanyaan di bawah, lalu video akan lanjut.');
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      const box = ui.$('#question-box');
      const prevT = qs.filter(function (x) { return x.answered && x.t >= 0 && x.t < q.t; }).map(function (x) { return x.t; }).pop() || 0;
      if (q.type === 'mc') {
        box.innerHTML = '<div class="card quiz-card vq">' +
          '<div class="row between"><span class="qtype">🎧 Listening check ' + (q.t >= 0 ? '· ' + fmt(q.t) : '· after video') + '</span>' +
          (q.t >= 0 && state.player ? '<button class="btn small" id="rewatch">⏪ Watch that part again</button>' : '') + '</div>' +
          '<h2 class="question">' + ui.esc(q.q) + ' <button class="btn icon small" id="sayq">🔊</button></h2>' +
          '<div class="choices">' + q.choices.map(function (c, i) { return '<button class="choice" data-i="' + i + '"><span class="letter">' + 'ABCD'[i] + '</span>' + ui.esc(c) + '</button>'; }).join('') + '</div>' +
          '<div id="vfb"></div></div>';
        ui.$('#sayq').onclick = function () { ui.speak(q.q); };
        ui.$all('.choice', box).forEach(function (b) {
          b.onclick = function () {
            if (q.answered) return;
            const ch = Number(b.dataset.i);
            const ok = ch === q.a;
            q.answered = true;
            state.answers.push({ ok: ok, type: 'mc' });
            p.skills.video = p.skills.video || { c: 0, t: 0 };
            p.skills.video.t++; p.stats.questionsTotal++;
            if (ok) { p.skills.video.c++; p.stats.questionsRight++; R.track('correct', 1); }
            S.save();
            ui.$all('.choice', box).forEach(function (x) {
              const i = Number(x.dataset.i);
              if (i === q.a) x.classList.add('right'); else if (i === ch) x.classList.add('wrong');
              x.disabled = true;
            });
            ok ? ui.sfx.right() : ui.sfx.wrong();
            ui.$('#vfb').innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? 'Correct! 🎉' : 'Not quite 🤔') + '</b><p>' + ui.esc(q.why || '') + '</p></div>' +
              '<div class="row end"><button class="btn primary" id="cont">' + (state.ended ? 'Next →' : '▶ Continue video') + '</button></div>';
            ui.$('#cont').onclick = resume;
          };
        });
      } else {
        box.innerHTML = '<div class="card quiz-card vq">' +
          '<div class="row between"><span class="qtype">✍️ Your answer ' + (q.t >= 0 ? '· ' + fmt(q.t) : '· after video') + '</span>' +
          (q.t >= 0 && state.player ? '<button class="btn small" id="rewatch">⏪ Watch again</button>' : '') + '</div>' +
          '<h2 class="question">' + ui.esc(q.q) + ' <button class="btn icon small" id="sayq">🔊</button></h2>' +
          '<textarea id="open-ans" rows="4" placeholder="Write in English…"></textarea>' +
          '<div class="row between"><small class="muted" id="wc">0 words</small><button class="btn primary" id="send" disabled>Submit</button></div>' +
          '<div id="vfb"></div></div>';
        ui.$('#sayq').onclick = function () { ui.speak(q.q); };
        const ta = ui.$('#open-ans');
        ta.oninput = function () {
          const n = ui.countWords(ta.value);
          ui.$('#wc').textContent = n + ' words' + (n < 4 ? ' (min 4)' : '');
          ui.$('#send').disabled = n < 4;
        };
        ui.$('#send').onclick = function () {
          q.answered = true;
          state.answers.push({ ok: true, type: 'open' });
          state.openAnswers.push({ q: q.q, a: ta.value.trim() });
          if (q.vocabLog) {
            ui.toast('💡 Simpan kata-kata itu di Word Garden: ketuk kata di bacaan atau tambah di menu Words.');
          }
          ui.sfx.right();
          ui.$('#vfb').innerHTML = '<div class="feedback ok"><b>Thanks! ✍️ Saved for your parent/teacher.</b>' + (q.sample ? '<p class="small">Example answer: <i>' + ui.esc(q.sample) + '</i></p>' : '') + '</div>' +
            '<div class="row end"><button class="btn primary" id="cont">' + (state.ended ? 'Next →' : '▶ Continue video') + '</button></div>';
          ui.$('#send').disabled = true; ta.readOnly = true;
          ui.$('#cont').onclick = resume;
        };
      }
      const rw = ui.$('#rewatch');
      if (rw) rw.onclick = function () { rewindTo(prevT); };
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      drawTimeline();
    }

    function resume() {
      const box = ui.$('#question-box');
      box.innerHTML = '';
      state.asking = null;
      drawTimeline();
      if (state.ended) { askEndQuestions(); return; }
      cover(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      state.player && state.player.play();
    }

    function askEndQuestions() {
      const q = qs.find(function (x) { return !x.answered; });
      if (q) ask(q); else finish();
    }

    function onEnded() {
      if (state.ended) return;
      // Jumping straight to the end also fires "ended": send the child back instead.
      const d = state.player ? state.player.duration() : 0;
      if (state.player && d && isFinite(d) && state.maxWatched < d - 3) {
        state.player.seek(state.maxWatched);
        state.player.play();
        nag('⛔ Tidak bisa loncat ke akhir. Tonton dulu ya!');
        return;
      }
      state.ended = true;
      state.maxWatched = state.player ? state.player.duration() : state.maxWatched;
      if (!state.asking) askEndQuestions();
    }

    function finish() {
      clearInterval(state.timer);
      cover(true, '🏆', 'Video complete!', 'Video selesai. Hebat!');
      const mc = state.answers.filter(function (a) { return a.type === 'mc'; });
      const right = mc.filter(function (a) { return a.ok; }).length;
      const open = state.answers.filter(function (a) { return a.type === 'open'; }).length;
      const score = mc.length ? right / mc.length : 1;
      const prev = p.videos[v.id];
      const firstTime = !prev;
      p.videos[v.id] = { best: Math.max(score, prev ? prev.best : 0), attempts: (prev ? prev.attempts : 0) + 1, at: Date.now() };
      if (state.openAnswers.length) {
        p.writings = p.writings || [];
        state.openAnswers.forEach(function (o) { p.writings.unshift({ at: Date.now(), lesson: '🎬 ' + v.title, prompt: o.q, text: o.a }); });
        p.writings = p.writings.slice(0, 100);
      }
      if (mc.length && score === 1) p.stats.perfect++;
      const mins = Math.max(1, Math.round((Date.now() - state.started) / 60000));
      S.day(p).minutes += mins;
      S.save();
      const xp = Math.round((right * 10 + open * 8 + 20) * (firstTime ? 1 : 0.5));
      R.track('video', 1);
      R.award(xp, right * 2 + open * 2 + 5, 'Video: ' + v.title);
      ui.sfx.win();
      if (score >= 0.7) ui.confetti(140);
      ui.$('#question-box').innerHTML =
        '<div class="card center celebrate"><div class="big-emoji">🎬🏆</div><h2>Video complete!</h2>' +
        '<div class="big-stars">' + C.stars(score) + '</div>' +
        (mc.length ? '<p>Listening: <b>' + right + ' / ' + mc.length + '</b> correct</p>' : '') +
        (open ? '<p>' + open + ' written answer' + (open > 1 ? 's' : '') + ' saved ✍️</p>' : '') +
        '<p class="reward-line">+' + xp + ' XP</p>' +
        '<div class="row center gap wrap"><a class="btn" href="#/watch">More videos</a><a class="btn primary" href="#/words/review">Review new words 🌼</a></div></div>';
    }

    function onError(msg) {
      state.failed = true;
      clearInterval(state.timer);
      const url = v.source === 'youtube' ? 'https://www.youtube.com/watch?v=' + v.youtubeId : v.url;
      ui.$('#player-mount').innerHTML = '<div class="player-error"><p>⚠️ ' + ui.esc(msg) + '</p>' +
        '<p class="small">Pastikan internet tersambung dan halaman dibuka lewat http(s) (bukan file://).</p>' +
        '<a class="btn" target="_blank" rel="noopener" href="' + ui.esc(url) + '">Open video in new tab ↗</a> ' +
        '<button class="btn primary" id="answer-anyway">I watched it — answer questions</button></div>';
      ui.$('#answer-anyway').onclick = function () { state.player = null; state.ended = true; askEndQuestions(); };
    }

    wireControls();
    function onHidden() { if (document.hidden && state.player && state.player.playing()) state.player.pause(); }
    document.addEventListener('visibilitychange', onHidden);

    makePlayer(v, ui.$('#player-mount'), {
      onReady: function () { drawTimeline(); },
      onEnded: onEnded,
      onError: onError
    }, { custom: true }).then(function (pl) {
      if (state.failed) return;
      const rawSeek = pl.seek;
      pl.seek = function (t) { state.seekAt = performance.now(); rawSeek(t); };
      state.player = pl;
      state.timer = setInterval(tick, 250);
    }).catch(function () {
      onError('Video player tidak bisa dimuat (mungkin offline).');
    });

    App.shell.onLeave(function () {
      document.removeEventListener('visibilitychange', onHidden);
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      clearInterval(state.timer);
      state.player && state.player.destroy();
    });
  };
})();
