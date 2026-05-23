<!--
  Author: Ethan
  The Waiata sing-along page (FR3 - FR9). The child learns Ngā Tae one line at
  a time: a single lyric and matching colour swatch are shown on screen, the
  Kiwi character replays just that line on click, Try singing records the
  child via the microphone and asks Groq Whisper to transcribe it (Māori-
  language model), Need help offers escalating AI-style hints, and every
  reasonable attempt slots one puzzle piece into the picture. The Next button
  only enables after the current line has been attempted. When all five
  lines are done the child moves on to the Word check / Meaning check
  (the existing QuizPage, FR10-FR11).

  Output audio goes through `playClipOrSpeak()`: when a recorded mp3 exists
  for the clip key it plays the file, otherwise it falls back to the shared
  `speak()` helper so the page still works before the recordings land.
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { settings, stopSpeaking } from '../../../lib/settings.svelte'
  import { kiwiImg } from '../../NavPage/assets'
  import { SONG_LINES, type SongLine } from './lyrics'
  import {
    hasGroqKey,
    startRecording,
    transcribeWithGroq,
    transcriptMatchesLine,
    type Recorder,
  } from './groq-stt'
  import { playClipOrSpeak, stopAllAudio, type ClipKey } from './audio'
  import background from '../../../assets/common/background.png'
  import kiwiYes from '../../../assets/quiz-page/kiwiyes.png'
  import kiwiTryAgain from '../../../assets/quiz-page/kiwitryagain.png'
  import kikiSays from '../../../assets/quiz-page/kikisays.png'

  // Map line index → audio clip key. When the team drops an mp3 named
  // `line-1.mp3` into src/assets/song-page/audio/, the audio helper picks it
  // up automatically (see audio.ts). No code change needed.
  const LINE_CLIPS: ClipKey[] = ['line-1', 'line-2', 'line-3', 'line-4', 'line-5']
  const WORD_CLIPS: Record<string, ClipKey> = {
    mā: 'word-ma',
    whero: 'word-whero',
    kākāriki: 'word-kakariki',
    pango: 'word-pango',
    mangu: 'word-mangu',
  }

  let {
    onback = () => {},
    onfinish = () => {},
  }: { onback?: () => void; onfinish?: () => void } = $props()

  // --- Per-line state -------------------------------------------------------
  let idx = $state(0) // current line, 0..SONG_LINES.length-1
  // Puzzle pieces collected so far. One per successfully attempted line (FR7).
  let pieces = $state(0)
  // Each line's attempt status — used so re-visiting a line keeps its piece.
  let attempted = $state<boolean[]>(SONG_LINES.map(() => false))
  // How many times Need help has been pressed *for this line* — drives the
  // escalating hint in FR8.
  let helpCount = $state(0)
  // The most recent "AI" message: either a help hint, an encouragement, or a
  // gentle pronunciation nudge. Treated like the QuizPage's Kiki Says panel.
  let kikiMessage = $state<string>('')
  // The most recent listen result, for the Yes!/Try again panel.
  let lastAttempt = $state<{ heard: string; matched: boolean } | null>(null)
  // Recording state: 'idle' before the child taps, 'recording' while the mic
  // is open, 'transcribing' while Groq is processing the upload. Drives the
  // Try singing button label so the child sees that something is happening.
  let micState = $state<'idle' | 'recording' | 'transcribing'>('idle')
  let recorder: Recorder | null = null
  // Set when the child taps Try singing while a recording is in progress so
  // the resulting transcript is discarded (manual cancel != failed attempt).
  let recordingCancelled = false
  // Tiny transient announcement (e.g. "+1 puzzle piece"). Used for a11y too.
  let pieceFlash = $state(false)
  // Surfaced when the Groq key is missing or transcription errored. Lets the
  // child still move on so they aren't blocked by config issues.
  let micError = $state<string>('')

  const line = $derived<SongLine>(SONG_LINES[idx])
  const total = SONG_LINES.length
  const isLast = $derived(idx === total - 1)
  // FR9: Next is only enabled once the child has had a reasonable attempt at
  // the current line. attempted[idx] flips on the first lenient match.
  const canAdvance = $derived(attempted[idx])

  // --- Read to me text ------------------------------------------------------
  // The "page text" — the instructions, current lyric, last feedback and what
  // comes next — all rolled into a single spoken pass (FR5).
  const pageReadout = $derived(buildReadout())

  function buildReadout(): string {
    const intro = `Line ${idx + 1} of ${total}. Try singing this line. Click Kiki if you want to hear it again.`
    const lyric = `The line is: ${line.lyric}. In Māori, ${line.maoriWord} means ${line.english}.`
    let feedback = ''
    if (lastAttempt) {
      feedback = lastAttempt.matched
        ? `Ka pai! You tried ${line.maoriWord}.`
        : `Nearly there. Let's try ${line.maoriWord} again.`
    }
    const next = canAdvance
      ? isLast
        ? 'Great! Tap Finish to keep going.'
        : 'Great! Tap Next for the next line.'
      : 'Tap Try singing when you are ready.'
    return [intro, lyric, feedback, next].filter(Boolean).join(' ')
  }

  // --- Single source of truth for "stop everything that is making sound". --
  function stopAllSound() {
    stopAllAudio()
    stopSpeaking()
  }

  // --- Kiwi replay (FR4) ---------------------------------------------------
  function playLine() {
    // Kiwi replays *only* the current lyric — distinct from Read to me, which
    // reads the whole page (FR4 vs FR5). Plays the recorded line clip when
    // available, falling back to TTS until the mp3 is added.
    stopAllSound()
    playClipOrSpeak(LINE_CLIPS[idx], line.lyric)
  }

  // --- Read to me (FR5) ----------------------------------------------------
  let speaking = $state(false)
  function readToMe() {
    if (speaking) {
      stopAllSound()
      speaking = false
      return
    }
    stopAllSound()
    // The page readout is composed dynamically (lyric + feedback + next), so
    // there is no single mp3 for it. Pass an unused clip key so we fall
    // straight to TTS for the spoken text.
    const handle = playClipOrSpeak('click-kiki', pageReadout)
    speaking = true
    handle.onend = () => (speaking = false)
  }

  // --- Try singing (FR6) — Groq Whisper ------------------------------------
  async function startTrySinging() {
    if (micState === 'recording') {
      // Tap-to-cancel an in-flight recording.
      recordingCancelled = true
      recorder?.stop()
      return
    }
    if (micState === 'transcribing') return // ignore taps while uploading

    // Clear any prior feedback so the new attempt feels fresh.
    lastAttempt = null
    kikiMessage = ''
    micError = ''
    stopAllSound()

    if (!hasGroqKey()) {
      // No API key configured — keep the activity usable by treating the
      // tap as a reasonable attempt, but tell the operator what's missing.
      micError =
        'Speech recognition is not configured (VITE_GROQ_API_KEY). Counting this as a reasonable try.'
      acceptAttempt({ matched: true, heard: '' })
      return
    }

    try {
      recorder = await startRecording({ maxMs: 5000 })
      micState = 'recording'
      recordingCancelled = false
      const blob = await recorder.done
      recorder = null
      if (recordingCancelled) {
        micState = 'idle'
        return
      }
      micState = 'transcribing'
      const text = await transcribeWithGroq(blob)
      micState = 'idle'
      const matched = transcriptMatchesLine(text, line)
      acceptAttempt({ matched, heard: text })
    } catch (err) {
      micState = 'idle'
      recorder = null
      handleMicError(err)
    }
  }

  function handleMicError(err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('NotAllowedError') || msg.includes('Permission') || msg.includes('denied')) {
      micError =
        "I couldn't open the microphone. Please allow mic access, then tap Try singing again."
      // Don't auto-advance — the child should be able to retry once they
      // grant permission.
      return
    }
    if (msg === 'mic-unsupported') {
      micError =
        "This browser can't record audio. Try Chrome or Edge. Counting this as a reasonable try."
      acceptAttempt({ matched: true, heard: '' })
      return
    }
    if (msg === 'no-api-key') {
      micError =
        'Speech recognition is not configured (VITE_GROQ_API_KEY). Counting this as a reasonable try.'
      acceptAttempt({ matched: true, heard: '' })
      return
    }
    // Network / Groq HTTP error: don't block the child, fall back to
    // accepting the attempt so the lesson keeps moving.
    micError = "Couldn't reach the listener right now. Counting this as a reasonable try."
    acceptAttempt({ matched: true, heard: '' })
  }

  function acceptAttempt(r: { matched: boolean; heard: string }) {
    lastAttempt = r
    if (r.matched) {
      // Positive feedback + puzzle piece (FR6 + FR7). Even an empty transcript
      // counts as "tried" when STT isn't available.
      if (!attempted[idx]) {
        attempted[idx] = true
        pieces += 1
        pieceFlash = true
        setTimeout(() => (pieceFlash = false), 1400)
      }
      kikiMessage = `Ka pai! ${capitalise(line.maoriWord)} means ${line.english}.`
      // Encourage out loud — short and warm. Will play a recorded "Ka pai!"
      // clip when one lands.
      playClipOrSpeak('kapai', `Ka pai! You tried ${line.maoriWord}.`)
    } else {
      // Pronunciation nudge, never "you are wrong" (FR6/FR8).
      kikiMessage = `Almost! Try the word slowly: ${line.syllables.join(' - ')}.`
      // Play the word clip on its own — a clean reference pronunciation.
      const wordKey = WORD_CLIPS[line.maoriWord]
      if (wordKey) {
        playClipOrSpeak(wordKey, `${line.syllables.join(', ')}.`)
      } else {
        playClipOrSpeak('try-again', `Try the word slowly. ${line.syllables.join(', ')}.`)
      }
    }
  }

  // --- Need help (FR8) -----------------------------------------------------
  function needHelp() {
    helpCount += 1
    stopAllSound()
    const w = line.maoriWord
    const breakdown = line.syllables.join(' - ')
    // FR8: hints escalate. Start with "click Kiwi", then break the word,
    // then offer a sing-with-Kiwi option, then loop the most concrete tip.
    let msg: string
    let clip: ClipKey = 'click-kiki'
    if (helpCount === 1 && !lastAttempt) {
      msg = `Click Kiki to hear this line again, then try singing.`
      clip = 'click-kiki'
    } else if (helpCount === 1 || helpCount === 2) {
      msg = `Say the word in small parts: ${breakdown}. Then try the whole line.`
      clip = WORD_CLIPS[w] ?? 'click-kiki'
    } else if (helpCount === 3) {
      msg = `First just say "${w}". Then say the whole line: ${line.lyric}.`
      clip = WORD_CLIPS[w] ?? LINE_CLIPS[idx]
    } else {
      msg = `Sing it with Kiki! Click Kiki, listen, then say "${w}" the same way.`
      clip = LINE_CLIPS[idx]
    }
    kikiMessage = msg
    playClipOrSpeak(clip, msg)
  }

  // --- Navigation ----------------------------------------------------------
  function nextLine() {
    if (!canAdvance) return
    cancelMic()
    stopAllSound()
    if (isLast) {
      onfinish()
      return
    }
    idx += 1
    resetLineState()
    // Auto-read on entry if the child has chosen Out loud mode (FR5).
    if (settings.readMode === 'auto') {
      setTimeout(() => playClipOrSpeak('click-kiki', pageReadout), 250)
    }
  }

  function prevLine() {
    if (idx === 0) {
      onback()
      return
    }
    cancelMic()
    stopAllSound()
    idx -= 1
    resetLineState()
  }

  function resetLineState() {
    helpCount = 0
    kikiMessage = ''
    lastAttempt = null
    micError = ''
  }

  function cancelMic() {
    if (recorder) {
      recordingCancelled = true
      recorder.stop()
      recorder = null
    }
    micState = 'idle'
  }

  // --- Lifecycle -----------------------------------------------------------
  onMount(() => {
    if (settings.readMode === 'auto') playClipOrSpeak('click-kiki', pageReadout)
  })
  onDestroy(() => {
    cancelMic()
    stopAllSound()
  })

  function capitalise(s: string): string {
    if (!s) return s
    return s[0].toLocaleUpperCase() + s.slice(1)
  }

  // Keyboard helpers for older / motor-impaired children. Space replays the
  // line, Enter triggers Try singing, ArrowRight advances when allowed.
  function onKey(e: KeyboardEvent) {
    // Ignore when focus is inside a button so taps still work normally.
    const tag = (e.target as HTMLElement | null)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if (e.key === ' ' || e.key === 'k') {
      playLine()
      e.preventDefault()
    } else if (e.key === 'ArrowRight' && canAdvance) {
      nextLine()
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      prevLine()
      e.preventDefault()
    }
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="page">
  <div class="bg-image" style:background-image="url({background})" aria-hidden="true"></div>

  <!-- Top bar: back + progress + read-to-me ------------------------------- -->
  <header class="topbar">
    <button class="pill ghost-pill" onclick={prevLine} aria-label="Back">
      ← Back
    </button>

    <div class="progress" aria-label="Line {idx + 1} of {total}">
      <span class="badge">Line {idx + 1} of {total}</span>
      <div class="dots" aria-hidden="true">
        {#each SONG_LINES as _, i}
          <span class="dot" class:done={attempted[i]} class:cur={i === idx}></span>
        {/each}
      </div>
    </div>

    <button
      class="pill read-pill"
      class:on={speaking}
      onclick={readToMe}
      disabled={!settings.soundOn}
      aria-label="Read to me"
    >
      🔊 {speaking ? 'Stop' : 'Read to me'}
    </button>
  </header>

  <!-- Two-column layout: lesson card + puzzle ----------------------------- -->
  <main class="content">
    {#key idx}
      <section class="card lesson">
        <p class="eyebrow">Sing along · Ngā Tae</p>
        <h1 class="lyric">{line.lyric}</h1>

        <!-- Colour swatch + textual label, so the meaning is clear even in
             high-contrast mode and for low-vision children (FR14 note). -->
        <div class="swatch-wrap">
          <div
            class="swatch"
            class:white={line.color === '#ffffff'}
            style:background-color={line.color}
            aria-hidden="true"
          ></div>
          <p class="meaning">
            <strong>{line.maoriWord}</strong> = {line.english}
          </p>
        </div>

        <!-- Clickable Kiwi: tap to replay just this line (FR4). -->
        <button
          class="kiwi-replay"
          onclick={playLine}
          aria-label="Click Kiki to hear this line again"
          title="Click me to hear this line again"
        >
          <img src={kiwiImg} alt="" draggable="false" />
          <span class="kiwi-bubble">Click me to hear this line again</span>
        </button>

        <!-- Primary actions: Try singing + Need help (FR6, FR8). -->
        <div class="actions">
          <button
            class="cta try"
            class:listening={micState === 'recording'}
            class:working={micState === 'transcribing'}
            onclick={startTrySinging}
            disabled={micState === 'transcribing'}
            aria-pressed={micState === 'recording'}
          >
            {#if micState === 'recording'}
              <span class="mic-on" aria-hidden="true"></span>
              Listening…
            {:else if micState === 'transcribing'}
              <span class="spinner" aria-hidden="true"></span>
              Thinking…
            {:else}
              🎤 Try singing
            {/if}
          </button>
          <button class="cta ghost" onclick={needHelp}>💡 Need help?</button>
        </div>

        {#if micError}
          <p class="hint-row" role="status" aria-live="polite">{micError}</p>
        {/if}
      </section>
    {/key}

    <!-- Right column: puzzle progress + feedback ------------------------- -->
    <aside class="side">
      <section class="puzzle" aria-label="Puzzle progress: {pieces} of {total} pieces">
        <h2 class="puzzle-title">Your colour puzzle</h2>
        <div class="puzzle-grid">
          {#each SONG_LINES as p, i}
            <div
              class="puzzle-piece"
              class:filled={attempted[i]}
              style:background-color={attempted[i] ? p.color : 'transparent'}
              title={attempted[i]
                ? `${p.maoriWord} — ${p.english}`
                : 'Locked'}
            >
              {#if attempted[i]}
                <span class="piece-label">{p.maoriWord}</span>
              {:else}
                <span class="piece-lock" aria-hidden="true">🔒</span>
              {/if}
            </div>
          {/each}
        </div>
        <p class="puzzle-count" class:flash={pieceFlash} aria-live="polite">
          {pieces} of {total} pieces
        </p>
      </section>

      <!-- Feedback panels: shown only when there is something to say. -->
      {#if lastAttempt}
        <section class="feedback" aria-live="polite">
          {#if lastAttempt.matched}
            <div class="fb yes-fb">
              <img src={kiwiYes} alt="" class="fb-img" />
              <div class="fb-msg">
                <b class="lbl yes-lbl">Yes!</b>
                <p>Ka pai! You tried "{line.maoriWord}".</p>
              </div>
            </div>
          {:else}
            <div class="fb try-fb">
              <img src={kiwiTryAgain} alt="" class="fb-img" />
              <div class="fb-msg">
                <b class="lbl try-lbl">Try again</b>
                <p>Nearly there. Let's say "{line.maoriWord}" again.</p>
              </div>
            </div>
          {/if}
        </section>
      {/if}

      {#if kikiMessage}
        <section class="feedback" aria-live="polite">
          <div class="fb kiki-fb">
            <img src={kikiSays} alt="" class="fb-img" />
            <div class="fb-msg">
              <b class="lbl kiki-lbl">Kiki says</b>
              <p>{kikiMessage}</p>
            </div>
          </div>
        </section>
      {/if}
    </aside>
  </main>

  <!-- Bottom nav: Back / Next  (Next stays disabled until attempted, FR9). -->
  <nav class="bottom-nav">
    <button class="pill" onclick={prevLine}>← {idx === 0 ? 'Map' : 'Back'}</button>
    <button class="pill btn-next" onclick={nextLine} disabled={!canAdvance}>
      {isLast ? 'Finish →' : 'Next →'}
    </button>
  </nav>
</div>

<style>
  /* --- Root ---------------------------------------------------------- */
  .page {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Nunito', 'Varela Round', 'Trebuchet MS', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #1d2630;
  }
  .bg-image {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .bg-image::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.7));
  }

  /* --- Top bar ------------------------------------------------------- */
  .topbar {
    position: relative;
    z-index: 20;
    width: min(1200px, 94%);
    margin-top: 18px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
  }
  .progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .badge {
    background: #f5a623;
    color: #2c1600;
    font-weight: 800;
    font-size: 14px;
    padding: 6px 16px;
    border-radius: 100px;
    box-shadow: 0 4px 12px rgba(245, 166, 35, 0.45);
    letter-spacing: 0.3px;
  }
  .dots {
    display: flex;
    gap: 6px;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.18);
    border: 2px solid #ffffffaa;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .dot.done {
    background: #4caf50;
  }
  .dot.cur {
    transform: scale(1.25);
    box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.4);
  }

  /* --- Content layout ------------------------------------------------ */
  .content {
    position: relative;
    z-index: 10;
    width: min(1200px, 94%);
    flex: 1;
    padding: 22px 0 110px;
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(280px, 1fr);
    gap: 22px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .content {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  /* --- Lesson card --------------------------------------------------- */
  .card {
    background: rgba(255, 255, 255, 0.97);
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 26px 28px 30px;
    box-sizing: border-box;
    animation: slideIn 0.32s ease both;
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(28px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .eyebrow {
    margin: 0 0 6px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 12px;
    font-weight: 700;
    color: #b3722a;
  }
  .lyric {
    margin: 0;
    font-size: clamp(28px, 4.6vw, 50px);
    font-weight: 900;
    color: #1a2330;
    letter-spacing: -0.5px;
  }

  .swatch-wrap {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .swatch {
    width: clamp(110px, 18vw, 180px);
    aspect-ratio: 1 / 1;
    border-radius: 26px;
    border: 4px solid rgba(0, 0, 0, 0.18);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
    flex: none;
  }
  .swatch.white {
    /* White-on-white needs an extra outline so the swatch reads as a shape. */
    border-color: #1a1a1a;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18), inset 0 0 0 4px #fff;
  }
  .meaning {
    margin: 0;
    font-size: clamp(20px, 2.8vw, 28px);
    font-weight: 700;
    color: #1a2330;
  }
  .meaning strong {
    color: #7a3d12;
  }

  /* --- Clickable Kiwi (replay) --------------------------------------- */
  .kiwi-replay {
    margin: 18px 0 8px;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-family: inherit;
  }
  .kiwi-replay img {
    width: clamp(90px, 14vw, 130px);
    filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.35));
    transition: transform 0.18s ease;
    animation: kiwiBob 3s ease-in-out infinite;
  }
  .kiwi-replay:hover img {
    transform: translateY(-4px) scale(1.04);
  }
  .kiwi-replay:active img {
    transform: scale(0.98);
  }
  .kiwi-bubble {
    background: #fff;
    border: 2.5px solid #1b1206;
    border-radius: 18px;
    padding: 10px 14px;
    font-size: clamp(13px, 1.6vw, 16px);
    font-weight: 700;
    color: #1a2330;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    position: relative;
  }
  .kiwi-bubble::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border: 8px solid transparent;
    border-right-color: #1b1206;
  }
  .kiwi-bubble::after {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border: 7px solid transparent;
    border-right-color: #fff;
  }
  @keyframes kiwiBob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  /* --- Action buttons row -------------------------------------------- */
  .actions {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .cta {
    border: 0;
    border-radius: 999px;
    padding: 14px 26px;
    font-family: inherit;
    font-weight: 800;
    font-size: clamp(16px, 1.8vw, 19px);
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.18s ease;
  }
  .cta.try {
    color: #fff;
    background: linear-gradient(180deg, #f0a93f, #d97c1d);
    box-shadow: 0 8px 18px -4px rgba(217, 124, 29, 0.7);
  }
  .cta.try:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 22px -4px rgba(217, 124, 29, 0.8);
  }
  .cta.try.listening {
    background: linear-gradient(180deg, #e23b3b, #a82626);
    animation: pulse 1.2s ease-in-out infinite;
  }
  .cta.try.working {
    background: linear-gradient(180deg, #8a8a8a, #5e5e5e);
    cursor: progress;
  }
  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 8px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    vertical-align: middle;
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .cta.ghost {
    background: #fff;
    color: #5a3514;
    border: 2.5px solid #d9b98a;
  }
  .cta.ghost:hover {
    background: #fff7e6;
    transform: translateY(-2px);
  }
  .mic-on {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    margin-right: 6px;
    animation: blink 1s ease-in-out infinite;
    vertical-align: middle;
  }
  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 8px 18px -4px rgba(226, 59, 59, 0.7);
    }
    50% {
      box-shadow: 0 12px 28px -4px rgba(226, 59, 59, 0.95);
    }
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .hint-row {
    margin: 12px 0 0;
    font-size: 14px;
    color: #5a3514;
  }

  /* --- Side column --------------------------------------------------- */
  .side {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .puzzle {
    background: rgba(255, 255, 255, 0.97);
    border-radius: 22px;
    padding: 18px 18px 22px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    text-align: center;
  }
  .puzzle-title {
    margin: 0 0 12px;
    font-size: clamp(16px, 1.7vw, 19px);
    font-weight: 800;
    color: #1a2330;
  }
  .puzzle-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
    gap: 8px;
    aspect-ratio: 3 / 2;
  }
  .puzzle-piece {
    border-radius: 14px;
    border: 2.5px dashed rgba(0, 0, 0, 0.25);
    display: grid;
    place-items: center;
    font-weight: 800;
    color: #fff;
    font-size: 13px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .puzzle-piece.filled {
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), inset 0 0 0 2px rgba(255, 255, 255, 0.3);
    transform: scale(1);
    animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .piece-lock {
    font-size: 18px;
    opacity: 0.4;
    text-shadow: none;
  }
  .piece-label {
    padding: 0 4px;
  }
  @keyframes pop-in {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
    60% {
      transform: scale(1.12);
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  .puzzle-count {
    margin: 12px 0 0;
    font-weight: 800;
    color: #5a3514;
    font-size: 15px;
    transition: transform 0.4s ease, color 0.4s ease;
  }
  .puzzle-count.flash {
    color: #2e7d32;
    transform: scale(1.15);
  }

  /* --- Feedback panels ----------------------------------------------- */
  .feedback {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .fb {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 16px;
    border: 2.5px solid transparent;
    background: rgba(255, 255, 255, 0.97);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    animation: fbSlide 0.36s ease both;
  }
  @keyframes fbSlide {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .yes-fb {
    border-color: #4caf50;
  }
  .try-fb {
    border-color: #f5a623;
  }
  .kiki-fb {
    border-color: #9c27b0;
    background: rgba(243, 229, 245, 0.97);
  }
  .fb-img {
    width: 70px;
    height: 70px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .fb-msg {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .lbl {
    font-size: 15px;
    font-weight: 800;
  }
  .yes-lbl {
    color: #2e7d32;
  }
  .try-lbl {
    color: #8a5a00;
  }
  .kiki-lbl {
    color: #7b1fa2;
    font-size: 13px;
  }
  .fb-msg p {
    margin: 0;
    color: #2c2c2c;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.45;
  }

  /* --- Bottom nav ---------------------------------------------------- */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    padding: 10px 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.85));
  }
  .pill {
    border: none;
    border-radius: 100px;
    padding: 14px 30px;
    font-family: inherit;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    white-space: nowrap;
    background: #fff;
    color: #333;
  }
  .pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  }
  .pill:active {
    transform: translateY(0);
  }
  .pill:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: 3px;
  }
  .ghost-pill {
    padding: 10px 22px;
    font-size: 15px;
  }
  .read-pill {
    padding: 10px 22px;
    font-size: 15px;
  }
  .read-pill.on {
    background: linear-gradient(180deg, #ffe6a8, #f4c25c);
  }
  .pill:disabled {
    background: #d8d8d8;
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  .btn-next {
    background: #f5a623;
    color: #2c1600;
    font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }
  .btn-next:disabled {
    animation: none;
    background: #d0d0d0;
    color: #888;
  }
  @keyframes breathe {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(245, 166, 35, 0.35);
    }
    50% {
      transform: scale(1.06);
      box-shadow: 0 8px 24px rgba(245, 166, 35, 0.6);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .puzzle-piece.filled,
    .fb,
    .btn-next,
    .cta.try.listening,
    .kiwi-replay img {
      animation: none !important;
    }
  }
</style>
