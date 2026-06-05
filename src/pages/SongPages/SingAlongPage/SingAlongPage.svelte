<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  
  import { settings, stopSpeaking } from '../../../lib/settings.svelte'

  import {
    hasGroqKey,
    startRecording,
    transcribeWithGroq,
    scoreAttempt,
    type AttemptLevel,
    type Recorder,
  } from '../LearningSongWithAIPage/groq-stt'

  import { playClipOrSpeak, stopAllAudio, type ClipKey } from '../LearningSongWithAIPage/audio'
  import { SONG_LINES } from '../LearningSongWithAIPage/lyrics'

  import easySong from '../../../assets/song-page/merged_song.mp3'
  import teArohaAudio from '../../../assets/song-page/normal_learning_song.mp3'
  import bgImg from '../../../assets/q456_background.png'
  import kiwiSing from '../../../assets/kiwising.png'
  import rtmImg from '../../../assets/read_to_me.png'
  import needHelpImg from '../../../assets/need_help.png'
  import trySingingImg from '../../../assets/try_singing.png'
  import kiwiYes from '../../../assets/quiz-page/kiwiyes.png'
  import kiwiTryAgain from '../../../assets/quiz-page/kiwitryagain.png'

  const {
    level = 'beginner',
    onBack = () => push('/'),
    onNext = () => push('/'),
  } = $props<{
    level?: string
    onBack?: () => void
    onNext?: () => void
  }>()

  type SongLine = {
    maori: string
    english: string
    target: string
    aliases: string[]
    colour?: string
    start: number
    maoriWord: string
    syllables: string[]
  }

  const beginnerLines: SongLine[] = SONG_LINES.map((l, i) => ({
    maori: l.lyric,
    english: l.english,
    target: l.maoriWord,
    aliases: l.aliases,
    colour: l.color,
    start: [2, 3.7, 5.5, 8.7, 10.2][i] ?? 0,
    maoriWord: l.maoriWord,
    syllables: l.syllables,
  }))

  const confidentLines: SongLine[] = [
    { maori: 'Te aroha', english: 'Love', target: 'aroha', aliases: ['a ro ha', 'aloha', 'arohaa'], start: 5.7, maoriWord: 'aroha', syllables: ['a', 'ro', 'ha'] },
    { maori: 'Te whakapono', english: 'Faith / belief', target: 'whakapono', aliases: ['faka pono', 'waka pono', 'wakapono', 'fakopono'], start: 10.2, maoriWord: 'whakapono', syllables: ['wha', 'ka', 'po', 'no'] },
    { maori: 'Me te rangimārie', english: 'Peace', target: 'rangimaarie', aliases: ['rangi marie', 'rangi mary', 'rangimarie', 'rangimaari'], start: 15, maoriWord: 'rangimārie', syllables: ['ran', 'gi', 'mā', 'rie'] },
    { maori: 'Tātou, tātou e', english: 'All of us', target: 'tatou', aliases: ['tātou', 'ta tou', 'taatou', 'tattoo', 'tatu', 'ta toe', 'all of us'], start: 20, maoriWord: 'tātou', syllables: ['tā', 'tou'] },
  ]

  const LINE_CLIPS_BEGINNER: ClipKey[] = ['line-1', 'line-2', 'line-3', 'line-4', 'line-5']
  const LINE_CLIPS_CONFIDENT: ClipKey[] = ['line-1', 'line-2', 'line-3', 'line-4']

  let lines = $derived(level === 'confident' ? confidentLines : beginnerLines)
  let lineClips = $derived(level === 'confident' ? LINE_CLIPS_CONFIDENT : LINE_CLIPS_BEGINNER)
  const progressKey = $derived(`waiata-sing-progress-${level}`)

  let replayAudio: HTMLAudioElement | null = null
  let replayTimeout: ReturnType<typeof setTimeout> | null = null
  let isReplaying = $state(false)

  let currentIdx = $state(0)
  let results = $state<boolean[]>([])
  let hasTried = $state(false)
  let helpCount = $state(0)
  let hintLoading = $state(false)
  let feedback = $state('Have a go! Tap "Try singing" above.')
  let showAIHintBox = $state(false)
  let aiHintText = $state('')

  const currentLine = $derived(lines[currentIdx])
  const accepted = $derived(results[currentIdx])
  const isLastLine = $derived(currentIdx === lines.length - 1)

  let micState = $state<'idle' | 'recording' | 'transcribing'>('idle')
  let recorder: Recorder | null = null
  let recordingCancelled = false
  let recordingStartedAt = 0
  const CANCEL_WINDOW_MS = 500
  let micLevel = $state(0)
  let micError = $state('')
  let lastAttempt = $state<{ heard: string; matched: boolean; level: AttemptLevel } | null>(null)
  let voiceHeard = false
  const MAX_RECORD_MS = 5000

  const LEVEL_LABEL: Record<string, string> = {
    beginner: '🌿 Beginner — Colour Song',
    confident: '🌺 Confident — Te Aroha',
  }

  function getVolumeValue() {
    const s: any = settings
    const v = s.volume ?? s.volumeLevel ?? 'medium'
    return v === 'low' ? 0.35 : v === 'high' ? 1 : 0.65
  }
  function soundIsOn() {
    const s: any = settings
    if (s.sound === 'off' || s.sound === false || s.soundOn === false || s.muted === true) return false
    return true
  }
  function getSpeechRate() {
    const s: any = settings
    const v = s.volume ?? s.volumeLevel ?? 'medium'
    return v === 'low' ? 0.8 : v === 'high' ? 0.9 : 0.85
  }

  function getReplayAudio(): HTMLAudioElement {
    const src = level === 'confident' ? teArohaAudio : easySong
    if (!replayAudio || replayAudio.src !== new URL(src, location.href).href) {
      if (replayAudio) { replayAudio.pause(); replayAudio.src = '' }
      replayAudio = new Audio(src)
      replayAudio.preload = 'auto'
    }
    return replayAudio
  }

  const BEGINNER_DURATIONS = [1.7, 1.3, 2.0, 1.5, 1.8]
  const CONFIDENT_DURATIONS = [4.3, 4.0, 4.5, 3.0]

  function replayLine() {
    if (isReplaying) { stopReplay(); return }
    stopReplay()
    const audio = getReplayAudio()
    const line = lines[currentIdx]
    const durs = level === 'confident' ? CONFIDENT_DURATIONS : BEGINNER_DURATIONS
    const durationMs = (durs[currentIdx] ?? 3.0) * 1000
    audio.currentTime = line.start
    audio.volume = getVolumeValue()
    audio.play().catch(() => {})
    isReplaying = true
    replayTimeout = setTimeout(() => { audio.pause(); isReplaying = false; replayTimeout = null }, durationMs)
  }

  function stopReplay() {
    if (replayAudio) { replayAudio.pause(); replayAudio.currentTime = 0 }
    isReplaying = false
    if (replayTimeout) { clearTimeout(replayTimeout); replayTimeout = null }
  }

  function saveSingProgress() {
    try { sessionStorage.setItem(progressKey, JSON.stringify({ currentIdx, results, hasTried, feedback })) } catch {}
  }
  function loadSingProgress() {
    try {
      const saved = sessionStorage.getItem(progressKey)
      if (!saved) return false
      const data = JSON.parse(saved)
      if (Array.isArray(data.results) && data.results.length === lines.length) {
        results = data.results; currentIdx = Math.min(data.currentIdx ?? 0, lines.length - 1)
        hasTried = data.hasTried ?? false; feedback = data.feedback ?? 'Have a go! Tap "Try singing" above.'
        return true
      }
      return false
    } catch { return false }
  }

  $effect(() => {
    const loaded = loadSingProgress()
    if (!loaded) {
      results = lines.map(() => false); currentIdx = 0; hasTried = false
      helpCount = 0; hintLoading = false; micError = ''; lastAttempt = null
      showAIHintBox = false; aiHintText = ''; feedback = 'Have a go! Tap "Try singing" above.'
    }
  })

  function stopAllSound() { stopReplay(); stopAllAudio(); stopSpeaking(); speechSynthesis.cancel() }

  async function startTrySinging() {
    if (micState === 'recording') {
      const elapsed = Date.now() - recordingStartedAt
      if (elapsed < CANCEL_WINDOW_MS) recordingCancelled = true
      recorder?.stop(); return
    }
    if (micState === 'transcribing') return
    lastAttempt = null; micError = ''; showAIHintBox = false; stopAllSound(); hasTried = true
    if (!hasGroqKey()) { browserFallbackSinging(); return }
    try {
      micLevel = 0; voiceHeard = false
      recorder = await startRecording({ maxMs: MAX_RECORD_MS, silenceMs: 1200, minMs: 500, onLevel: (l) => (micLevel = l), onVoiceStart: () => (voiceHeard = true) })
      micState = 'recording'; recordingStartedAt = Date.now(); recordingCancelled = false
      const blob = await recorder.done; recorder = null
      if (recordingCancelled) { micState = 'idle'; micLevel = 0; return }
      micState = 'transcribing'
      const text = await transcribeWithGroq(blob, { targetWord: currentLine.maoriWord })
      micState = 'idle'; micLevel = 0
      const lvl = scoreAttempt(text, { lyric: currentLine.maori, maoriWord: currentLine.maoriWord, aliases: currentLine.aliases, english: currentLine.english, color: currentLine.colour ?? '#cccccc', syllables: currentLine.syllables }, voiceHeard)
      acceptAttempt({ level: lvl, heard: text })
    } catch (err) { micState = 'idle'; micLevel = 0; recorder = null; handleMicError(err) }
  }

  let recognition: any = null
  onMount(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SR) { recognition = new SR(); recognition.lang = 'en-NZ'; recognition.interimResults = false; recognition.maxAlternatives = 1 }
  })

  function browserFallbackSinging() {
    if (!recognition) { acceptAttempt({ level: 'attempt', heard: '' }); return }
    micState = 'recording'
    recognition.onresult = (event: any) => {
      const raw = event.results[0][0].transcript
      const transcript = raw.replace(/[^\u0000-\u024F\s]/g, ' ').toLowerCase().trim()
      micState = 'idle'
      function norm(s: string) { return s.toLowerCase().replace(/[āĀ]/g,'a').replace(/[ēĒ]/g,'e').replace(/[īĪ]/g,'i').replace(/[ōŌ]/g,'o').replace(/[ūŪ]/g,'u') }
      const targets = [currentLine.target, ...currentLine.aliases].map(norm)
      const words = transcript.split(/\s+/).map(norm); const full = norm(transcript)
      let exact = false, close = false
      for (const w of words) { for (const t of targets) { if (w === t || w.includes(t) || t.includes(w)) { exact = true; break }; const maxD = t.length <= 4 ? 2 : 3; if (levDist(w, t) <= maxD) close = true }; if (exact) break }
      if (!exact) for (const t of targets) { if (full.includes(t) || levDist(full, t) <= 3) { exact = true; break } }
      acceptAttempt({ level: exact || close ? (exact ? 'exact' : 'fuzzy') : voiceHeard ? 'attempt' : 'silent', heard: transcript })
    }
    recognition.onerror = () => { micState = 'idle'; acceptAttempt({ level: 'attempt', heard: '' }) }
    recognition.onend = () => { micState = 'idle' }
    try { recognition.abort() } catch {}
    setTimeout(() => { try { recognition.start() } catch { micState = 'idle' } }, 150)
  }

  function levDist(a: string, b: string): number {
    if (a === b) return 0; if (!a.length) return b.length; if (!b.length) return a.length
    const m: number[][] = []
    for (let i = 0; i <= b.length; i++) m[i] = [i]; for (let j = 0; j <= a.length; j++) m[0][j] = j
    for (let i = 1; i <= b.length; i++) for (let j = 1; j <= a.length; j++) { m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1) }
    return m[b.length][a.length]
  }

  function acceptAttempt(r: { level: AttemptLevel; heard: string }) {
    const passed = r.level === 'exact' || r.level === 'fuzzy'
    lastAttempt = { heard: r.heard, matched: passed, level: r.level }
    const giveCredit = passed || helpCount >= 2
    if (!giveCredit) {
      feedback = r.level === 'silent' ? `AI check: Try saying "${currentLine.maoriWord}" out loud.` : `AI check: Nearly there! Try saying "${currentLine.maoriWord}" again.`
      if (soundIsOn()) { level === 'confident' ? replayLine() : playClipOrSpeak(lineClips[currentIdx] as ClipKey, currentLine.maori) }
      return
    }
    results = results.map((v, i) => (i === currentIdx ? true : v))
    feedback = passed ? (r.level === 'exact' ? `AI check: Ka pai! You said "${currentLine.maoriWord}" clearly.` : `AI check: Close enough! Ka pai!`) : `AI check: Ka pai for trying! Let's move on!`
    saveSingProgress()
  }

  function handleMicError(err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('NotAllowed') || msg.includes('denied')) { micError = "I couldn't open the microphone. Please allow mic access and try again."; return }
    micError = "Couldn't reach the listener. Counting this as a try!"
    acceptAttempt({ level: 'attempt', heard: '' })
  }

  async function getAIHintFromGroq() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!apiKey) throw new Error('No Groq API key found')
    const prompt = `You are helping a Year 1-3 child learn a Māori waiata.\nGive ONE very short, safe, child-friendly hint.\nRules:\n- Do not invent new Māori words.\n- Keep it under 18 words.\nContext:\nLevel: ${level}\nCurrent lyric: ${currentLine.maori}\nKey Māori word: ${currentLine.maoriWord}\nSyllables: ${currentLine.syllables.join(' - ')}`
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'system', content: 'You create short, safe, child-friendly learning hints for Māori waiata practice.' }, { role: 'user', content: prompt }], temperature: 0.3, max_tokens: 60 }) })
    if (!res.ok) throw new Error('Groq hint request failed')
    const data = await res.json()
    const hint = data?.choices?.[0]?.message?.content?.trim()
    if (!hint) throw new Error('No hint returned')
    return hint
  }

  async function getHint() {
    if (hintLoading) return
    helpCount++; stopAllSound(); hintLoading = true; showAIHintBox = true; aiHintText = 'AI hint is thinking...'
    const w = currentLine.maoriWord; const breakdown = currentLine.syllables.join(' - ')
    let hint: string
    try { hint = await getAIHintFromGroq() } catch {
      if (helpCount === 1 && !lastAttempt) hint = `Listen to Kiki again, then say "${w}" slowly.`
      else if (helpCount <= 2) hint = `Try small parts: ${breakdown}. Then sing the line.`
      else if (helpCount === 3) hint = `First say "${w}". Then say: ${currentLine.maori}.`
      else hint = `Sing with Kiki. Listen, then say "${w}" the same way.`
    }
    aiHintText = hint.startsWith('AI hint:') ? hint : `AI hint: ${hint}`
    feedback = aiHintText; hintLoading = false
    if (soundIsOn()) { const u = new SpeechSynthesisUtterance(aiHintText); u.lang = 'en-NZ'; u.rate = getSpeechRate(); speechSynthesis.speak(u) }
  }

  function closeAIHint() { showAIHintBox = false; speechSynthesis.cancel() }

  function goNext() {
    if (!accepted) return
    stopAllSound(); saveSingProgress()
    if (isLastLine) { onNext(); return }
    currentIdx++; hasTried = false; helpCount = 0; hintLoading = false; lastAttempt = null
    micError = ''; showAIHintBox = false; aiHintText = ''; feedback = 'Have a go! Tap "Try singing" above.'
    saveSingProgress()
  }

  function goBack() { stopAllSound(); cancelMic(); onBack() }
  function cancelMic() { if (recorder) { recordingCancelled = true; recorder.stop(); recorder = null }; micState = 'idle' }

  function readToMe() {
    if (!soundIsOn()) return
    stopAllSound()
    const text = showAIHintBox && aiHintText ? aiHintText : feedback !== 'Have a go! Tap "Try singing" above.' ? feedback : `Listen to the line. Then try singing it. The line is ${currentLine.maori}. ${currentLine.english}.`
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-NZ'; u.rate = getSpeechRate(); speechSynthesis.speak(u)
  }

  onDestroy(() => { stopAllSound(); cancelMic(); if (replayAudio) { replayAudio.pause(); replayAudio.src = ''; replayAudio = null } })
</script>

<div class="page">
  <div class="stage" style="background-image: url({bgImg})">
    <button class="top-map" onclick={() => { stopAllSound(); cancelMic(); push('/') }}>← Back to Map</button>
    <div class="level-badge">{LEVEL_LABEL[level] ?? level}</div>

    <div class="line-progress">
      <span class="progress-title">Line {currentIdx + 1} of {lines.length}</span>
      <div class="step-buttons">
        {#each lines as _, i}
          <button class:active={i === currentIdx} class:done={results[i]}
            onclick={() => { if (i <= currentIdx || results[i]) { currentIdx = i; helpCount = 0; hintLoading = false; lastAttempt = null; micError = ''; showAIHintBox = false; aiHintText = ''; feedback = results[i] ? '⭐ Ka pai! You completed this line.' : 'Have a go! Tap "Try singing" above.' } }}
          >{i + 1}</button>
        {/each}
      </div>
    </div>

    <div class="kiki-group">
      <div class="kiki-bubble">
        <strong>Tap me to listen again!</strong>
        <span>Then try singing it.</span>
      </div>
      <button class="kiwi-button" onclick={replayLine} aria-label="Tap Kiki to replay line">
        <img src={kiwiSing} alt="Kiki" class="kiwi" class:bouncing={isReplaying} />
      </button>
    </div>

    <section class="main-card" class:accepted>
      <div class="current-pill">🎵 Current Line</div>
      <h1>{currentLine.maori}</h1>
      <h2>{currentLine.english}</h2>
      {#if level === 'beginner' && currentLine.colour}
        <div class="colour-box" style="background:{currentLine.colour}"></div>
      {:else}
        <div class="meaning-box">{currentLine.english}</div>
      {/if}
    </section>

    <div class="action-layout-container">
      <div class="action-row">

        <!-- Try Singing button — image when idle, coloured pill when active -->
        <button
          class="try-sing-btn"
          class:recording={micState === 'recording'}
          class:transcribing={micState === 'transcribing'}
          class:passed={accepted}
          onclick={startTrySinging}
          disabled={micState === 'transcribing'}
          aria-label="Try singing"
        >
          {#if micState === 'recording'}
            <span class="meter">
              {#each Array(5) as _, i}
                {@const scaled = Math.min(1, micLevel * 3)}
                {@const threshold = (i + 1) / 5}
                <span class="bar" style:transform="scaleY({Math.max(0.18, Math.min(1, scaled / threshold))})"></span>
              {/each}
            </span>
            <span class="sing-label">Listening…</span>
          {:else if micState === 'transcribing'}
            <span class="sing-label">Recognising…</span>
          {:else if accepted}
            <span class="sing-label">✓ Pass!</span>
          {:else}
            <img src={trySingingImg} alt="Try Singing" class="try-sing-img" />
          {/if}
        </button>

        <!-- Need Help button -->
        <button class="need-help-button" onclick={getHint} disabled={micState !== 'idle' || hintLoading} aria-label="Need help — get an AI hint">
          <img src={needHelpImg} alt="Need Help?" class="need-help-img" />
        </button>

      </div>

      {#if showAIHintBox}
        <div class="ai-hint-box">
          <button class="ai-hint-close" onclick={closeAIHint} aria-label="Close AI hint">×</button>
          <div class="ai-hint-title">💡 AI Hint</div>
          <p>{aiHintText}</p>
        </div>
      {:else if micError}
        <div class="feedback-card retry">
          <span class="feedback-star">⚠️</span>
          <p>{micError}</p>
        </div>
      {:else if lastAttempt}
        <div class="feedback-card" class:good={lastAttempt.matched} class:retry={!lastAttempt.matched}>
          <img src={lastAttempt.matched ? kiwiYes : kiwiTryAgain} alt={lastAttempt.matched ? 'Ka pai!' : 'Try again'} class="fb-kiwi" />
          <div class="fb-text"><p class="fb-main">{feedback}</p></div>
        </div>
      {:else}
        <div class="feedback-card">
          <span class="feedback-star">{accepted ? '⭐' : '🌟'}</span>
          <p>{feedback}</p>
        </div>
      {/if}
    </div>

    <div class="bottom-bar">
      <button class="btn-secondary" onclick={goBack}>← Back</button>
      <button class="btn-rtm" onclick={readToMe} aria-label="Read to me">
        <img src={rtmImg} alt="Read to me" class="rtm-img" />
      </button>
      <button class="btn-next" class:ready={accepted} disabled={!accepted} onclick={goNext}>
        {#if accepted}
          <span class="btn-next-text">{isLastLine ? 'Finish →' : 'Next →'}</span>
        {:else}
          <span class="btn-next-text">🔒 Next →</span>
          <small class="btn-next-sub">Try singing first</small>
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  :global(html, body) { margin: 0 !important; padding: 0 !important; width: 100vw !important; height: 100vh !important; overflow: hidden !important; }
  .page { position: fixed; inset: 0; overflow: hidden; font-family: 'Nunito', system-ui, sans-serif; user-select: none; }
  .stage { position: absolute; inset: 0; background-size: 100% 100%; background-position: center; background-repeat: no-repeat; overflow: hidden; }
  .top-map { position: absolute; top: 3%; left: 3%; z-index: 25; border: none; border-radius: 999px; font-family: inherit; font-weight: 800; cursor: pointer; white-space: nowrap; padding: 9px 20px; font-size: clamp(12px, 1.6vmin, 15px); background: rgba(255,255,255,.95); color: #374151; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
  .level-badge { position: absolute; top: 3%; right: 3%; z-index: 50; background: rgba(255,255,255,.96); color: #2c1a04; padding: clamp(8px, 1.2vh, 14px) clamp(16px, 2vw, 28px); border-radius: 999px; font-size: clamp(12px, 1.6vh, 20px); font-weight: 900; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
  .line-progress { position: absolute; top: 3%; left: 50%; transform: translateX(-50%); z-index: 40; display: flex; align-items: center; gap: clamp(10px, 1.5vw, 18px); background: linear-gradient(180deg, #8b4a16, #6b300d); color: white; padding: clamp(6px, 1vh, 12px) clamp(14px, 2vw, 24px); border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
  .progress-title { font-size: clamp(14px, 2vh, 22px); font-weight: 900; white-space: nowrap; }
  .step-buttons { display: flex; gap: 8px; }
  .line-progress button { width: clamp(28px, 4.5vh, 42px); height: clamp(28px, 4.5vh, 42px); border: none; border-radius: 50%; background: #fff8e6; color: #4a2b0b; font-size: clamp(14px, 2vh, 20px); font-weight: 900; cursor: pointer; }
  .line-progress button.active { background: #22c55e; color: white; }
  .line-progress button.done { background: #86efac; color: #14532d; }
  .kiki-group { position: absolute; left: 5vw; bottom: 32vh; display: flex; flex-direction: column; align-items: center; z-index: 30; width: clamp(220px, 24vw, 340px); }
  .kiki-bubble { position: relative; background: rgba(255,255,255,0.94); border: 3px solid rgba(34,197,94,0.25); border-radius: 22px; padding: 12px 16px; box-shadow: 0 6px 16px rgba(0,0,0,.14); color: #2c1a04; width: 210px; box-sizing: border-box; text-align: center; margin-bottom: -6px; transform: translateX(8px); }
  .kiki-bubble::after { content: ''; position: absolute; left: 50%; bottom: -12px; width: 22px; height: 22px; background: rgba(255,255,255,0.94); border-right: 3px solid rgba(34,197,94,0.25); border-bottom: 3px solid rgba(34,197,94,0.25); transform: translateX(-50%) rotate(45deg); border-radius: 4px; }
  .kiki-bubble strong { display: block; font-size: 18px; color: #15803d; margin-bottom: 5px; font-weight: 900; }
  .kiki-bubble span { display: block; font-size: 14px; font-weight: 800; color: #3a2008; }
  .kiwi-button { background: none; border: none; cursor: pointer; padding: 0; width: 100%; }
  .kiwi { width: 100%; height: auto; filter: drop-shadow(0 6px 12px rgba(0,0,0,.25)); }
  .kiwi.bouncing { animation: kibounce .5s ease; }
  @keyframes kibounce { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 70% { transform: translateY(-4px); } }
  .main-card { position: absolute; top: 14vh; left: 52%; transform: translateX(-50%); z-index: 20; width: clamp(340px, 46vw, 660px); height: 46vh; background: rgba(255,248,230,.97); border: 5px solid #22c55e; border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,.18); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: clamp(15px, 2.5vh, 30px); box-sizing: border-box; text-align: center; }
  .current-pill { background: linear-gradient(180deg, #fde68a, #f59e0b); color: #78350f; padding: 6px 24px; border-radius: 999px; font-size: clamp(14px, 2vh, 20px); font-weight: 900; margin-bottom: auto; }
  .main-card h1 { margin: 5px 0; font-size: clamp(32px, 5.5vh, 60px); font-weight: 900; color: #2c1a04; line-height: 1.1; }
  .main-card h2 { margin: 0px 0 clamp(10px, 1.5vh, 20px); font-size: clamp(18px, 3vh, 30px); font-weight: 800; color: #15803d; }
  .colour-box { width: clamp(80px, 14vh, 150px); height: clamp(80px, 14vh, 150px); border-radius: 16px; border: 4px solid rgba(0,0,0,.2); box-shadow: inset 0 0 10px rgba(0,0,0,.1), 0 4px 12px rgba(0,0,0,.15); margin-bottom: auto; }
  .meaning-box { padding: clamp(12px, 2vh, 24px) clamp(20px, 3vw, 40px); background: rgba(255,255,255,.85); border: 3px solid #d9b98a; border-radius: 16px; font-size: clamp(18px, 2.8vh, 28px); font-weight: 900; color: #2c1a04; margin-bottom: auto; }
  .action-layout-container { position: absolute; top: 62vh; left: 52%; transform: translateX(-50%); width: clamp(560px, 48vw, 680px); display: flex; flex-direction: column; align-items: center; gap: 1.2vh; z-index: 35; }
  .action-row { display: flex; width: 100%; align-items: center; justify-content: center; gap: 8px; }

  /* ── Try Singing image button ── */
  .try-sing-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: auto;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform .12s ease;
    flex-shrink: 0;
  }
  /* All states fill the flex slot equally */
  .try-sing-btn {
    width: 100% !important;
    max-width: 300px !important;
  }
  .try-sing-btn:hover { transform: scale(1.04) translateY(-2px); }
  .try-sing-btn:active { transform: scale(0.97); }
  .try-sing-btn:disabled { cursor: progress; }
  .try-sing-img { width: 100%; max-width: 420px; height: 62px; object-fit: contain; filter: drop-shadow(0 5px 12px rgba(0,0,0,.3)); display: block; }

  /* Active states — pill styled like Need Help button */
  .try-sing-btn.recording,
  .try-sing-btn.transcribing,
  .try-sing-btn.passed {
    border-radius: 50px;
    box-shadow: 0 4px 0 rgba(0,0,0,.25), 0 6px 16px rgba(0,0,0,.2);
    padding: 0 28px;
  }
  .try-sing-btn.recording {
    background: linear-gradient(180deg, #ff6b6b, #e63950);
    animation: pulse 1s ease-in-out infinite;
  }
  .try-sing-btn.transcribing {
    background: linear-gradient(180deg, #c9b8a8, #9a8470);
  }
  .try-sing-btn.passed {
    background: linear-gradient(180deg, #7ddb60, #4cb82e);
  }
  .sing-label {
    color: #1a1a1a;
    font-size: clamp(18px, 2.6vh, 28px);
    font-weight: 900;
    font-family: inherit;
    letter-spacing: 0.3px;
    text-shadow: none;
  }

  /* Need Help button */
  .need-help-button { background: transparent; border: none; padding: 0; margin: 0; cursor: pointer; width: 100%; max-width: 300px; display: flex; align-items: center; justify-content: center; }
  .need-help-img { display: block; width: 100%; height: 62px; object-fit: contain; background: transparent; }
  .need-help-button:disabled { opacity: 0.5; cursor: not-allowed; }

  .meter { display: inline-flex; align-items: center; gap: 3px; height: 18px; margin-bottom: 4px; }
  .bar { width: 4px; height: 100%; border-radius: 2px; background: #fff; transform-origin: bottom; transition: transform 60ms linear; }

  .ai-hint-box { position: relative; width: 100%; min-height: 78px; background: rgba(255,248,230,0.98); border: 4px solid #f59e0b; border-radius: 18px; box-shadow: 0 8px 18px rgba(0,0,0,.18); box-sizing: border-box; padding: 14px 48px 14px 18px; color: #3a2008; text-align: center; animation: hintPop .18s ease; }
  @keyframes hintPop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .ai-hint-title { font-size: clamp(14px, 1.8vh, 18px); font-weight: 900; color: #b45309; margin-bottom: 4px; }
  .ai-hint-box p { margin: 0; font-size: clamp(13px, 1.8vh, 18px); font-weight: 900; line-height: 1.25; }
  .ai-hint-close { position: absolute; top: 8px; right: 10px; width: 30px; height: 30px; border: none; border-radius: 50%; background: #7c2d12; color: white; font-size: 20px; font-weight: 900; cursor: pointer; line-height: 1; }
  .feedback-card { width: 100%; background: rgba(255,248,230,.96); border: 3px solid rgba(217,119,6,.3); border-radius: 14px; padding: clamp(6px, 1vh, 12px) 16px; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,.1); box-sizing: border-box; }
  .feedback-star { font-size: clamp(18px, 2.5vh, 28px); }
  .feedback-card p { margin: 0; color: #3a2008; font-size: clamp(12px, 1.7vh, 18px); font-weight: 900; text-align: center; }
  .feedback-card.good { border-color: rgba(34,197,94,.5); background: rgba(236,253,245,.96); }
  .fb-kiwi { width: clamp(40px, 6vmin, 60px); height: auto; flex-shrink: 0; filter: drop-shadow(0 2px 6px rgba(0,0,0,.2)); }
  .fb-text { display: flex; flex-direction: column; gap: 2px; text-align: left; }
  .fb-main { margin: 0; font-size: clamp(13px, 1.7vh, 18px); font-weight: 900; color: #3a2008; }
  .bottom-bar { position: absolute; bottom: 0; left: 0; right: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; padding: 16px 32px 24px; height: 90px; box-sizing: border-box; }
  .btn-secondary, .btn-next { border: none; border-radius: 999px; font-family: inherit; font-weight: 800; cursor: pointer; white-space: nowrap; height: 52px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; }
  .btn-secondary { background: rgba(255,255,255,.96); color: #334155; width: 160px; font-size: clamp(14px, 1.9vmin, 18px); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
  .btn-rtm { background: none; border: none; cursor: pointer; padding: 0; }
  .rtm-img { height: 52px; display: block; object-fit: contain; }
  .btn-next { background: rgba(220,220,220,.9); color: #737373; width: 180px; box-shadow: 0 4px 12px rgba(0,0,0,.1); }
  .btn-next.ready { background: linear-gradient(180deg, #fde68a, #f59e0b); color: #78350f; box-shadow: 0 4px 0 #b45309, 0 6px 16px rgba(0,0,0,.2); }
  .btn-next-text { font-size: clamp(14px, 1.9vmin, 18px); font-weight: 800; }
  .btn-next-sub { font-size: 11px; font-weight: 700; opacity: 0.85; }
  .btn-next:disabled { cursor: not-allowed; }
  @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }

  /* ── Responsive: narrow screens only ── */
  @media (max-width: 700px) {

    /* Top bar: stack line-progress below back button to avoid clash */
    .top-map {
      font-size: 11px;
      padding: 6px 10px;
      top: 2% !important;
      left: 2% !important;
      z-index: 50;
    }
    .line-progress {
      top: 8% !important;           /* move below Back to Map button */
      gap: clamp(4px, 1vw, 8px);
      padding: 4px clamp(6px, 1.2vw, 12px);
      font-size: clamp(10px, 1.3vmin, 13px);
    }
    .line-progress button { width: 26px; height: 26px; font-size: 12px; }
    .level-badge {
      font-size: clamp(9px, 1.2vh, 12px);
      padding: 5px 8px;
      top: 8% !important;           /* align with line-progress */
      right: 1% !important;
    }
    /* Push main card down to make room */
    .main-card { top: 16vh !important; }

    /* Kiki bubble: anchor top-left beside main card, above action buttons */
    .kiki-group {
      left: 1vw !important;
      bottom: auto !important;
      top: 22vh !important;
      width: clamp(110px, 16vw, 160px) !important;
    }
    .kiki-bubble { width: 130px; padding: 6px 8px; }
    .kiki-bubble strong { font-size: 12px; margin-bottom: 2px; }
    .kiki-bubble span   { font-size: 10px; }

    /* Main card: fill more width, shorter */
    .main-card {
      left: 50% !important;
      width: clamp(200px, 60vw, 420px) !important;
      height: 42vh !important;
      top: 12vh !important;
    }
    .main-card h1 { font-size: clamp(22px, 4vh, 40px); }
    .main-card h2 { font-size: clamp(14px, 2.2vh, 22px); }
    .colour-box   { width: clamp(50px, 9vh, 100px); height: clamp(50px, 9vh, 100px); }

    /* Action buttons row: fit to screen width */
    .action-layout-container {
      width: 94vw !important;
      left: 50% !important;
      top: 56vh !important;
      gap: 0.8vh;
    }

    /* Try Singing / Pass button smaller */
    .try-sing-img   { height: 46px; }
    .try-sing-btn   { width: 100% !important; }

    /* Need Help button smaller */
    .need-help-img  { height: 46px; }
    .need-help-button { max-width: 180px; }

    /* Feedback/hint bar smaller */
    .action-row { gap: 6px; }

    /* Bottom nav: shrink buttons */
    .bottom-bar  { padding: 10px 12px 16px; height: auto; }
    .btn-secondary { width: 90px;  font-size: 12px; }
    .btn-next      { width: 110px; }
    .btn-next-text { font-size: 13px; }
    .btn-next-sub  { font-size: 10px; }
  }

</style>