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
  import { push } from 'svelte-spa-router'
  import { settings, stopSpeaking } from '../../../lib/settings.svelte'
  import { progress } from '../../../lib/progress.svelte'
  import { kiwiImg } from '../../NavPage/assets'
  import { SONG_LINES, type SongLine } from './lyrics'
  import {
    hasGroqKey,
    startRecording,
    transcribeWithGroq,
    transcriptMatchesLine,
    type Recorder,
  } from './groq-stt'
  import { hasClip, playClipOrSpeak, stopAllAudio, type ClipKey } from './audio'
  import background from '../../../assets/common/background.png'
  import kiwiYes from '../../../assets/quiz-page/kiwiyes.png'
  import kiwiTryAgain from '../../../assets/quiz-page/kiwitryagain.png'
  import kikiSays from '../../../assets/quiz-page/kikisays.png'

  // Per-line progress flag in the shared `progress` store. NavPage reads
  // `progress.isComplete('waiata')` to mark the map medal; we use a finer
  // grain so a child can reload and see their puzzle pieces still in place.
  const lineProgressId = (i: number) => `waiata-line-${i + 1}`
  // Coarse flag: "the child has worked through every line of Ngā Tae".
  // RewardPage still owns the final `'waiata'` badge flag — this one is a
  // sub-milestone other pages (e.g. the map) can read.
  const LEARN_COMPLETE_ID = 'waiata-learn'

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
    // Default to going back up the Waiata flow (intro → map) so the page
    // still has sensible navigation when opened by deep link without a
    // parent-supplied handler.
    onback = () => push('/song/play'),
    onfinish = () => push('/quiz'),
  }: { onback?: () => void; onfinish?: () => void } = $props()

  // Always-available "back to the map" shortcut — matches the top-left
  // pill on QuizPage / RewardPage so the navigation is consistent.
  const goMap = () => {
    cancelMic()
    stopAllSound()
    push('/')
  }

  // --- Per-line state -------------------------------------------------------
  // Restore from the persistent progress store so a reload keeps the puzzle
  // pieces the child already earned. Resume at the first unfinished line so
  // a returning learner picks up roughly where they left off.
  const initialAttempted = SONG_LINES.map((_, i) =>
    progress.isComplete(lineProgressId(i)),
  )
  // Resume at the first unfinished line (typical case). When every line is
  // already done we drop them on the last one so the Finish button is one
  // tap away — they're clearly here to wrap up rather than redo.
  const firstUnfinished = initialAttempted.findIndex((v) => !v)
  let idx = $state(
    firstUnfinished === -1 ? SONG_LINES.length - 1 : firstUnfinished,
  )
  let attempted = $state<boolean[]>(initialAttempted)
  // Puzzle pieces collected so far. Always derived from `attempted` so the
  // count stays consistent with what the puzzle grid is actually showing.
  const pieces = $derived(attempted.filter(Boolean).length)
  // How many times Need help has been pressed *for this line* — drives the
  // escalating hint in FR8.
  let helpCount = $state(0)
  // The most recent "AI" message: either a help hint, an encouragement, or a
  // gentle pronunciation nudge. Treated like the QuizPage's Kiki Says panel.
  let kikiMessage = $state<string>('')
  // The most recent listen result, for the Yes!/Try again panel.
  let lastAttempt = $state<{ heard: string; matched: boolean } | null>(null)
  // Recording state machine:
  //   idle         → before the child taps Try singing
  //   recording    → mic is open, AnalyserNode is feeding `micLevel`
  //   transcribing → recording stopped, upload + Groq Whisper is running
  let micState = $state<'idle' | 'recording' | 'transcribing'>('idle')
  let recorder: Recorder | null = null
  // Set when the child taps Try singing while a recording is in progress so
  // the resulting transcript is discarded (manual cancel != failed attempt).
  let recordingCancelled = false
  // Timestamp the recording started. A tap within `CANCEL_WINDOW_MS` of that
  // moment cancels (treats it as an accidental double-tap); a tap after that
  // window finishes the recording and runs transcription.
  let recordingStartedAt = 0
  const CANCEL_WINDOW_MS = 500
  // Live mic RMS, [0..1]. Drives the on-screen level bars while recording.
  let micLevel = $state(0)
  // Tiny transient announcement (e.g. "+1 puzzle piece"). Used for a11y too.
  let pieceFlash = $state(false)
  // Surfaced when the Groq key is missing or transcription errored. Lets the
  // child still move on so they aren't blocked by config issues.
  let micError = $state<string>('')
  // Hard cap on a single attempt's recording length.
  const MAX_RECORD_MS = 5000

  // The Try-singing button cycles through four visual states only:
  //   idle        → "🎤 Try Singing" (orange)
  //   listening   → mic level bars + "Listening" + sweeping bg lines
  //   recognizing → brief upload/transcribe wait
  //   passed      → green button with ✓ — the latest attempt was accepted
  //
  // We look at the *latest* attempt rather than the historic
  // `attempted[idx]` flag, so retrying a passed line and getting an
  // unrecognised result reverts the button to idle. The line stays
  // unlocked for "Next" (FR9) because the puzzle piece was already
  // earned — only the button's visual reflects this session's attempt.
  type ButtonState = 'idle' | 'listening' | 'recognizing' | 'passed'
  const buttonState = $derived<ButtonState>(
    micState === 'recording'
      ? 'listening'
      : micState === 'transcribing'
      ? 'recognizing'
      : lastAttempt
      ? lastAttempt.matched
        ? 'passed'
        : 'idle'
      : attempted[idx]
      ? 'passed'
      : 'idle',
  )

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

  // Flipped to `true` whenever we stop audio for any reason — keeps the
  // auto-read TTS → line-audio chain from firing the second clip after a
  // navigation away or a manual cancellation.
  let autoReadCancelled = false

  // --- Single source of truth for "stop everything that is making sound". --
  function stopAllSound() {
    autoReadCancelled = true
    stopAllAudio()
    stopSpeaking()
  }

  // Plays the page readout TTS, then chains the recorded line audio so the
  // child hears a proper Māori example after the framing instructions.
  function startAutoRead() {
    autoReadCancelled = false
    const handle = playClipOrSpeak('click-kiki', pageReadout)
    handle.onend = () => {
      if (autoReadCancelled) return
      playClipOrSpeak(LINE_CLIPS[idx], line.lyric)
    }
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
      // Two-mode tap during recording, split by `CANCEL_WINDOW_MS`:
      //   • Within 500 ms of start  → treat as an accidental double-tap and
      //     cancel (transcript is discarded, button returns to idle).
      //   • After 500 ms             → finish recording early and run
      //     transcription on whatever was captured so far.
      const elapsed = Date.now() - recordingStartedAt
      if (elapsed < CANCEL_WINDOW_MS) {
        recordingCancelled = true
      }
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
      micLevel = 0
      recorder = await startRecording({
        maxMs: MAX_RECORD_MS,
        // Auto-stop after a short stretch of silence following speech, so a
        // child saying just "whero" doesn't have to wait out the full cap.
        silenceMs: 1200,
        minMs: 500,
        onLevel: (l) => (micLevel = l),
      })
      micState = 'recording'
      recordingStartedAt = Date.now()
      recordingCancelled = false
      const blob = await recorder.done
      recorder = null
      if (recordingCancelled) {
        micState = 'idle'
        micLevel = 0
        return
      }
      micState = 'transcribing'
      const text = await transcribeWithGroq(blob)
      micState = 'idle'
      micLevel = 0
      const matched = transcriptMatchesLine(text, line)
      acceptAttempt({ matched, heard: text })
    } catch (err) {
      micState = 'idle'
      micLevel = 0
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
        // Persist this line — survives reloads and is what NavPage/RewardPage
        // can inspect to know how far the child has come.
        progress.markComplete(lineProgressId(idx))
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
      // Reference pronunciation. Prefer a word-level clip when available;
      // otherwise play the full line — children hear a proper Māori example
      // in context, which is far better than a syllabic TTS fallback.
      const wordKey = WORD_CLIPS[line.maoriWord]
      if (wordKey && hasClip(wordKey)) {
        playClipOrSpeak(wordKey, `${line.syllables.join(', ')}.`)
      } else {
        playClipOrSpeak(LINE_CLIPS[idx], `Try the word slowly. ${line.syllables.join(', ')}.`)
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
    if (helpCount === 1 && !lastAttempt) {
      msg = `Click Kiki to hear this line again, then try singing.`
    } else if (helpCount === 1 || helpCount === 2) {
      msg = `Say the word in small parts: ${breakdown}. Then try the whole line.`
    } else if (helpCount === 3) {
      msg = `First just say "${w}". Then say the whole line: ${line.lyric}.`
    } else {
      msg = `Sing it with Kiki! Click Kiki, listen, then say "${w}" the same way.`
    }
    // Need help shows the hint in the Kiki Says panel — no audio. The
    // child stays in control of what to listen to (they can tap the
    // Kiwi pill explicitly to replay the line).
    kikiMessage = msg
  }

  // --- Navigation ----------------------------------------------------------
  function nextLine() {
    if (!canAdvance) return
    cancelMic()
    stopAllSound()
    if (isLast) {
      // Sub-milestone for the Waiata module: the child has practised every
      // line. Final `'waiata'` badge is still earned on the Reward page.
      progress.markComplete(LEARN_COMPLETE_ID)
      onfinish()
      return
    }
    idx += 1
    resetLineState()
    // Auto-play the new line's recording so the child immediately hears
    // the next lyric in a proper Māori voice. Respects Sound on/off via
    // `playClipOrSpeak`. Triggered only by Next (not Prev, not first mount).
    const newLine = SONG_LINES[idx]
    playClipOrSpeak(LINE_CLIPS[idx], newLine.lyric)
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
    if (settings.readMode === 'auto') startAutoRead()
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

  <!-- Always-on shortcut back to the map (matches QuizPage / RewardPage). -->
  <button class="pill btn-map" onclick={goMap}>← Map</button>

  <!-- Top bar: centred progress badge + line dots. The line-by-line Back
       and the Read-to-me button live in the bottom nav for layout
       consistency with the rest of the song flow. -->
  <header class="topbar" aria-label="Line {idx + 1} of {total}">
    <span class="badge">Line {idx + 1} of {total}</span>
    <div class="dots" aria-hidden="true">
      {#each SONG_LINES as _, i}
        <span class="dot" class:done={attempted[i]} class:cur={i === idx}></span>
      {/each}
    </div>
  </header>

  <!-- Two-column layout: lesson card + puzzle ----------------------------- -->
  <main class="content">
    {#key idx}
      <section class="card lesson">
        <header class="lesson-head">
          <p class="eyebrow">Sing along · Ngā Tae</p>
          <h1 class="lyric">{line.lyric}</h1>
        </header>

        <!-- Hero "colour tile": the swatch and its label are one visual
             unit (FR3) rather than two loose siblings. The label sits in
             a white band so it stays readable on every colour — including
             pure white — without relying on contrast tricks (FR14). -->
        <div
          class="color-tile"
          class:white={line.color === '#ffffff'}
          aria-label="{line.maoriWord} means {line.english}"
        >
          <div class="color-fill" style:background-color={line.color} aria-hidden="true"></div>
          <div class="color-label">
            <strong>{line.maoriWord}</strong> = {line.english}
          </div>
        </div>

        <!-- Replay button (FR4): the Kiwi avatar and its prompt are now a
             single pill control. Clear "tap to play" affordance — no more
             floating speech bubble. -->
        <button
          class="kiwi-replay"
          onclick={playLine}
          aria-label="Tap Kiwi to hear this line again"
        >
          <img class="kiwi-avatar" src={kiwiImg} alt="" draggable="false" />
          <span class="replay-text">Tap Kiwi to hear this line again</span>
        </button>

        <!-- Primary actions: Try singing + Need help (FR6, FR8). -->
        <div class="actions">
          <button
            class="cta try state-{buttonState}"
            onclick={startTrySinging}
            disabled={buttonState === 'recognizing'}
            aria-pressed={buttonState === 'listening'}
            aria-label={buttonState === 'listening'
              ? 'Listening, tap to stop'
              : buttonState === 'recognizing'
              ? 'Recognizing your attempt'
              : buttonState === 'passed'
              ? 'Passed — tap to try again'
              : 'Try singing this line'}
          >
            <!-- Countdown scanline: a single bright vertical line that
                 sweeps from right to left across the button over the full
                 recording budget. Mounted only while listening so the CSS
                 animation restarts cleanly on every attempt. -->
            {#if buttonState === 'listening'}
              <span
                class="sweep"
                style:--countdown-ms="{MAX_RECORD_MS}ms"
                aria-hidden="true"
              ></span>
            {/if}

            <span class="label">
              {#if buttonState === 'listening'}
                <span class="meter" aria-hidden="true">
                  {#each Array(5) as _, i}
                    {@const threshold = (i + 1) / 5}
                    {@const scaled = Math.min(1, micLevel * 3)}
                    <span
                      class="bar"
                      style:transform="scaleY({Math.max(0.18, Math.min(1, scaled / threshold))})"
                    ></span>
                  {/each}
                </span>
                Listening
              {:else if buttonState === 'recognizing'}
                Recognizing
              {:else if buttonState === 'passed'}
                <span class="check" aria-hidden="true">✓</span>
                Passed
              {:else}
                🎤 Try Singing
              {/if}
            </span>
          </button>
          <button
            class="cta ghost"
            onclick={needHelp}
            disabled={micState !== 'idle'}
          >
            💡 Need help?
          </button>
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
                {#if lastAttempt.heard}
                  <p class="heard">Kiwi heard: <em>"{lastAttempt.heard}"</em></p>
                {/if}
              </div>
            </div>
          {:else}
            <div class="fb try-fb">
              <img src={kiwiTryAgain} alt="" class="fb-img" />
              <div class="fb-msg">
                <b class="lbl try-lbl">Try again</b>
                <p>Nearly there. Let's say "{line.maoriWord}" again.</p>
                <p class="heard">
                  Kiwi heard:
                  <em>{lastAttempt.heard ? `"${lastAttempt.heard}"` : "(I didn't hear anything)"}</em>
                </p>
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

  <!-- Bottom nav matches QuizPage layout: Back · Read-to-me · Next.
       Next stays disabled until the current line is attempted (FR9). -->
  <nav class="bottom-nav">
    <button class="pill btn-back" onclick={prevLine}>
      ← {idx === 0 ? 'Intro' : 'Back'}
    </button>
    <button
      class="pill btn-read"
      class:on={speaking}
      onclick={readToMe}
      disabled={!settings.soundOn}
      aria-label="Read to me"
    >
      🔊 {speaking ? 'Stop' : 'Read to me'}
    </button>
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

  /* --- Top bar: centred progress badge + line dots ----------------- */
  .topbar {
    position: relative;
    z-index: 20;
    width: min(1200px, 94%);
    /* The fixed "← Map" pill lives at top:16/left:16 and is on the left
       edge, so a small margin is enough — the centred badge clears it
       horizontally on every reasonable viewport. */
    margin-top: 20px;
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
    padding: 14px 0 96px;
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(260px, 1fr);
    gap: 18px;
    /* Both columns sit at the top of the grid row — each takes its own
       natural height. Bottom alignment is controlled explicitly by the
       `.card`'s min-height below (single number to tune). */
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
    padding: 18px 28px;
    box-sizing: border-box;
    animation: slideIn 0.32s ease both;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* `space-between` pins the title to the top and the action row to
       the bottom — combined with the explicit min-height below, this
       is what lets the card's bottom edge match the right column. */
    justify-content: space-between;
    text-align: center;
    gap: 8px;
    /* ▼ ONLY KNOB YOU NEED TO TUNE ▼
       Set this so the card's bottom edge meets the right column's last
       visible card's bottom. Decrease to raise the bottom; increase to
       lower it. Default is calibrated for a typical 1024 × 768 view. */
    min-height: 590px;
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

  /* Card children: rely on the parent's `gap` for vertical rhythm — no
     ad-hoc margins, so spacing stays consistent regardless of what shows. */
  .eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 11px;
    font-weight: 700;
    color: #b3722a;
  }
  .lyric {
    margin: 0;
    font-size: clamp(24px, 4vw, 42px);
    font-weight: 900;
    color: #1a2330;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  /* Lesson title block: eyebrow + lyric kept tight together at the top
     so they read as one heading, not two separate items. */
  .lesson-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  /* --- Colour tile: swatch + label as one unified card ----------- */
  .color-tile {
    width: clamp(180px, 26vw, 240px);
    aspect-ratio: 1 / 1.1;
    border-radius: 22px;
    overflow: hidden;
    border: 3px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    background: #fff;
  }
  .color-tile.white {
    /* Pure white swatch — a sharper edge so the tile still reads as a shape. */
    border-color: #1a1a1a;
  }
  .color-fill {
    flex: 1;
  }
  .color-label {
    background: #fffaf0;
    color: #1a2330;
    font-weight: 700;
    font-size: clamp(15px, 1.9vw, 19px);
    padding: 8px 14px;
    border-top: 2px solid rgba(0, 0, 0, 0.18);
    white-space: nowrap;
  }
  .color-label strong {
    color: #7a3d12;
  }

  /* --- Replay button: Kiwi avatar + label as one pill control --- */
  .kiwi-replay {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 8px 22px 8px 10px;
    background: #fff;
    border: 2.5px solid #d9b98a;
    border-radius: 999px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(14px, 1.7vw, 16px);
    color: #5a3514;
    transition: transform 0.16s ease, box-shadow 0.18s ease, background 0.18s ease;
  }
  .kiwi-replay:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
    background: #fff7e6;
  }
  .kiwi-replay:active {
    transform: translateY(0);
  }
  .kiwi-avatar {
    width: 34px;
    height: 34px;
    object-fit: contain;
    flex: none;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  }

  /* --- Action buttons row -------------------------------------------- */
  .actions {
    margin: 4px 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    /* Buttons sit just under the kiwi row — a small extra nudge gives
       them visual weight at the bottom of the card. */
  }
  .cta {
    border: 0;
    border-radius: 999px;
    padding: 16px 32px;
    font-family: inherit;
    font-weight: 800;
    font-size: clamp(18px, 2vw, 22px);
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
  /* ---- Try-singing button: four discrete visual states ---- */
  .cta.try {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 240px;
    /* Smooth colour swap between idle ↔ listening ↔ recognizing ↔ passed. */
    transition: background 0.25s ease, color 0.2s ease, box-shadow 0.25s ease,
      transform 0.16s ease;
  }
  .cta.try:disabled {
    cursor: progress;
  }
  .cta.try .label {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* State 1 — Idle: the baseline orange already comes from `.cta.try`. */

  /* State 2 — Listening: idle orange + countdown scanline + meter bars. */

  /* State 3 — Recognizing: dim, neutral colour. Brief by design. */
  .cta.try.state-recognizing {
    background: linear-gradient(180deg, #b9a89a, #826a55);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* State 4 — Passed: green + check. Stays this way until the next line. */
  .cta.try.state-passed {
    background: linear-gradient(180deg, #4caf50, #2e7d32);
    box-shadow: 0 8px 18px -4px rgba(46, 125, 50, 0.55);
  }
  .cta.try.state-passed:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 22px -4px rgba(46, 125, 50, 0.7);
  }
  .check {
    display: inline-grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    font-weight: 900;
    font-size: 14px;
    line-height: 1;
  }

  /* Countdown scanline — a 2px vertical line that travels right → left
     across the button over `--countdown-ms`. `box-shadow` supplies the
     asymmetric light/shadow on either side:
       • left side: soft white glow (the swept area lit up by the scan)
       • right side: a tighter dark shadow (the not-yet-swept area)
     Both shadows are tightly clamped so the effect stays narrow. */
  .sweep {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    pointer-events: none;
    background: rgba(255, 255, 255, 0.55);
    box-shadow:
      -6px 0 8px -2px rgba(255, 255, 255, 0.45),
       4px 0 6px -1px rgba(0, 0, 0, 0.35);
    animation: sweepCountdown var(--countdown-ms, 5000ms) linear forwards;
  }
  @keyframes sweepCountdown {
    from {
      left: 100%;
    }
    to {
      left: -2px;
    }
  }

  /* Live mic-level bars shown inside the button while listening. */
  .meter {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    height: 18px;
  }
  .meter .bar {
    width: 4px;
    height: 100%;
    border-radius: 2px;
    background: #fff;
    transform-origin: bottom;
    transition: transform 60ms linear;
  }

  /* "Kiwi heard: …" — small reflective line inside the feedback panel. */
  .heard {
    margin: 4px 0 0 !important;
    font-size: 13px !important;
    color: #4a3a2a !important;
    font-style: normal;
  }
  .heard em {
    font-style: italic;
    color: #1a2330;
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
    border-radius: 20px;
    padding: 12px 14px 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    text-align: center;
  }
  .puzzle-title {
    margin: 0 0 8px;
    font-size: clamp(15px, 1.6vw, 18px);
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
  .pill:disabled {
    background: #d0d0d0;
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* Fixed top-left "← Map" shortcut, mirroring QuizPage/RewardPage. */
  .btn-map {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
    padding: 14px 28px;
    font-size: 16px;
  }
  /* Match QuizPage/RewardPage typography for the bottom-nav pills. */
  .bottom-nav .pill {
    padding: 16px 34px;
    font-size: 18px;
  }
  .btn-back,
  .btn-read {
    background: #fff;
    color: #333;
  }
  .btn-read.on {
    background: linear-gradient(180deg, #ffe6a8, #f4c25c);
    color: #2c1600;
  }
  .btn-next {
    background: #f5a623;
    color: #2c1600;
    font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }
  .btn-next:disabled {
    animation: none;
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
    .sweep {
      animation: none !important;
    }
  }
</style>
