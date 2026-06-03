<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { settings } from '../../../lib/settings.svelte'

  import easySong from '../../../assets/song-page/merged_song.mp3'
  import teArohaAudio from '../../../assets/song-page/normal_learning_song.mp3'
  import bgImg from '../../../assets/q456_background.png'
  import kiwiSing from '../../../assets/kiwising.png'
  import rtmImg from '../../../assets/read_to_me.png'




const {
  level = 'beginner',
  onBack = () => push('/'),
  onNext = () => push('/'),
} = $props<{
  level?: string
  onBack?: () => void
  onNext?: () => void
}>()



  type LyricLine = {
    start: number
    maori: string
    english: string
    target: string
    aliases: string[]
    colour?: string
  }

  const beginnerLines: LyricLine[] = [
    { start: 2, maori: 'Mā is white', english: 'Mā = White', target: 'ma', aliases: ['maa', 'mā'], colour: '#ffffff' },
    { start: 3.7, maori: 'Whero is red', english: 'Whero = Red', target: 'whero', aliases: ['wero', 'hero'], colour: '#ef4444' },
    { start: 5.5, maori: 'Kākāriki is green', english: 'Kākāriki = Green', target: 'kakariki', aliases: ['kākāriki'], colour: '#22c55e' },
    { start: 8.7, maori: 'Pango is black', english: 'Pango = Black', target: 'pango', aliases: ['tango', 'mango'], colour: '#1f2937' },
    { start: 10.2, maori: 'Mangu is too', english: 'Mangu = Black too', target: 'mangu', aliases: ['mango', 'mongo'], colour: '#374151' },
  ]

  const confidentLines: LyricLine[] = [
    { start: 5.7, maori: 'Te aroha', english: 'Love', target: 'aroha', aliases: ['a ro ha', 'aloha'] },
    { start: 10.2, maori: 'Te whakapono', english: 'Faith / belief', target: 'whakapono', aliases: ['faka pono', 'waka pono'] },
    { start: 15, maori: 'Me te rangimārie', english: 'And peace', target: 'rangimaarie', aliases: ['rangi marie', 'rangi mary'] },
    {
      start: 20,
      maori: 'Tātou, tātou e',
      english: 'All of us',
      target: 'tatou',
      aliases: ['tātou', 'ta tou', 'taatou', 'tattoo', 'tattoo tattoo', 'tatoo', 'tatu', 'ta toe', 'to toe', 'to to', 'all of us'],
    },
  ]

  function getVolumeValue() {
    const s: any = settings
    const volume = s.volume ?? s.volumeLevel ?? 'medium'

    if (volume === 'low') return 0.35
    if (volume === 'high') return 1
    return 0.65
  }

  function soundIsOn() {
    const s: any = settings

    if (s.sound === 'off') return false
    if (s.sound === false) return false
    if (s.soundOn === false) return false
    if (s.muted === true) return false

    return true
  }

  function getSpeechRate() {
    const s: any = settings
    const volume = s.volume ?? s.volumeLevel ?? 'medium'

    if (volume === 'low') return 0.8
    if (volume === 'high') return 0.9
    return 0.85
  }

  let lines = $derived(level === 'confident' ? confidentLines : beginnerLines)
  const progressKey = $derived(`waiata-sing-progress-${level}`)

  let audio = $derived.by(() => {
    const newAudio = new Audio(level === 'confident' ? teArohaAudio : easySong)
    newAudio.preload = 'auto'
    newAudio.volume = getVolumeValue()
    return newAudio
  })

  let currentIdx = $state(0)
  let recording = $state(false)
  let helpText = $state<string | null>(null)
  let feedback = $state('Have a go! Tap “Try singing” above.')
  let results = $state<boolean[]>([])

function saveSingProgress() {
  try {
    sessionStorage.setItem(
      progressKey,
      JSON.stringify({
        currentIdx,
        results,
        hasTried,
        feedback,
      })
    )
  } catch {}
}

function loadSingProgress() {
  try {
    const saved = sessionStorage.getItem(progressKey)
    if (!saved) return false

    const data = JSON.parse(saved)

    if (Array.isArray(data.results) && data.results.length === lines.length) {
      results = data.results
      currentIdx = Math.min(data.currentIdx ?? 0, lines.length - 1)
      hasTried = data.hasTried ?? false
      feedback = data.feedback ?? 'Have a go! Tap “Try singing” above.'
      helpText = null
      helpCount = 0
      return true
    }

    return false
  } catch {
    return false
  }
}

$effect(() => {
  const loaded = loadSingProgress()

  if (!loaded) {
    results = lines.map(() => false)
    currentIdx = 0
    hasTried = false
    helpCount = 0
    helpText = null
    feedback = 'Have a go! Tap “Try singing” above.'
  }
})

  let hasTried = $state(false)
  let helpCount = $state(0)

  let recognition: any = null
  let replayTimeout: ReturnType<typeof setTimeout> | null = null
  let isReplaying = $state(false)

  const currentLine = $derived(lines[currentIdx])
  const accepted = $derived(results[currentIdx])
  const isLastLine = $derived(currentIdx === lines.length - 1)

  const LEVEL_LABEL: Record<string, string> = {
    beginner: '🌿 Beginner — Colour Song',
    confident: '🌺 Confident — Te Aroha',
  }

  onMount(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      recognition = new SpeechRecognition()
      recognition.lang = 'en-NZ'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
    }
  })

  function getDistance(a: string, b: string): number {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix = []

    for (let i = 0; i <= b.length; i++) matrix[i] = [i]
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          )
        }
      }
    }

    return matrix[b.length][a.length]
  }

  function stopAll() {
    audio.pause()
    audio.currentTime = 0
    isReplaying = false

    speechSynthesis.cancel()

    if (recording && recognition) {
      try {
        recognition.stop()
      } catch {}
    }

    if (replayTimeout) {
      clearTimeout(replayTimeout)
      replayTimeout = null
    }
  }

  const BEGINNER_DURATIONS = [1.7, 1.3, 2.0, 1.5, 1.8]
  const CONFIDENT_DURATIONS = [4.3, 4.0, 4.5, 3.0]

  function replayLine() {
    if (!soundIsOn()) return

    if (isReplaying) {
      stopAll()
      return
    }

    stopAll()

    const startTime = currentLine.start
    const durations = level === 'confident' ? CONFIDENT_DURATIONS : BEGINNER_DURATIONS
    const durationMs = (durations[currentIdx] ?? 3.0) * 1000

    audio.currentTime = startTime
    audio.volume = getVolumeValue()
    audio.play()
    isReplaying = true

    replayTimeout = setTimeout(() => {
      audio.pause()
      isReplaying = false
      replayTimeout = null
    }, durationMs)
  }

  function trySinging() {
    if (recording) return

    if (isReplaying) {
      stopAll()
    }

    if (!recognition) {
      feedback = '❌ Speech recognition is not supported in this browser.'
      return
    }

    recording = true
    hasTried = true
    feedback = '🎤 Listening… sing the line.'

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      const words = transcript.split(/\s+/)

      let isCorrect = false
      let isClose = false

      const checkTargets = [currentLine.target, ...currentLine.aliases].map((t) => t.toLowerCase())

      for (const word of words) {
        for (const target of checkTargets) {
          if (word === target || word.includes(target) || (target.includes(word) && word.length > 3)) {
            isCorrect = true
            break
          }

          if (getDistance(word, target) <= 3) {
            isClose = true
          }
        }

        if (isCorrect) break
      }

      recording = false

      if (isCorrect) {
        results = results.map((r, i) => i === currentIdx ? true : r)
        feedback = '⭐ Ka pai! Good try.'
        helpText = null
         saveSingProgress()
      } else if (isClose) {
        results = results.map((r, i) => i === currentIdx ? true : r)
        feedback = '🌟 Nice try! Close enough, let’s move on!'
        helpText = null

      } else {
        feedback = `❌ Wrong word heard ("${transcript}"). Try again!`
      }
    }

    recognition.onerror = (event: any) => {
      recording = false

      if (event.error === 'no-speech') {
        feedback = '😶 I didn’t hear anything. Try again!'
      } else if (event.error === 'not-allowed') {
        feedback = '⚠️ Microphone access denied.'
      } else {
        feedback = '⚠️ Something went wrong with the microphone.'
      }
    }

    recognition.onspeechend = () => {
      recognition.stop()
    }

    recognition.onend = () => {
      recording = false
    }

    const safetyTimer = setTimeout(() => {
      if (recording) {
        try {
          recognition.stop()
        } catch {}

        recording = false
        feedback = '😶 I didn’t hear anything. Try again!'
      }
    }, 8000)

    const origOnEnd = recognition.onend

    recognition.onend = () => {
      clearTimeout(safetyTimer)
      origOnEnd()
    }

    try {
      recognition.abort()
    } catch {}

    setTimeout(() => {
      try {
        recognition.start()
      } catch {
        recording = false
        feedback = '⚠️ Could not start the microphone. Try again.'
      }
    }, 150)
  }

  async function getAIHintLocal(context: {
    level: string
    song: string
    currentLine: string
    keyWord: string
    attemptState: string
    helpCount: number
  }) {
    const beginnerHints: Record<string, string[]> = {
      ma: [
        'Try saying it slowly: mā.',
        'Mā means white. Look at the white colour.',
        'Listen to Kiki again, then try mā one more time.',
      ],
      whero: [
        'Try the colour word slowly: whe-ro.',
        'Whero means red. Look for the red colour.',
        'Listen again, then try saying whero.',
      ],
      kakariki: [
        'Try it in small parts: kā-kā-ri-ki.',
        'Kākāriki means green. Look at the green colour.',
        'Listen again, then try the word slowly.',
      ],
      pango: [
        'Listen again, then try pango.',
        'Pango means black.',
        'Try saying pan-go slowly.',
      ],
      mangu: [
        'Try saying man-gu slowly.',
        'Mangu means black or dark.',
        'Listen again, then try mangu.',
      ],
    }

    const confidentHints: Record<string, string[]> = {
      aroha: [
        'Try saying it slowly: a-ro-ha.',
        'Aroha means love.',
        'Listen again, then try aroha.',
      ],
      whakapono: [
        'Try it in parts: whaka-po-no.',
        'Whakapono means faith or belief.',
        'Listen again, then try whakapono slowly.',
      ],
      rangimaarie: [
        'Try saying rangimārie in small parts.',
        'Rangimārie means peace.',
        'Listen again, then try rangi-mā-rie.',
      ],
      tatou: [
        'Try saying tā-tou.',
        'Tātou means all of us.',
        'Listen again, then try tātou, tātou e.',
      ],
    }

    const hints =
      context.level === 'confident'
        ? confidentHints[context.keyWord]
        : beginnerHints[context.keyWord]

    if (!hints) {
      return 'Listen again, then try slowly.'
    }

return hints[context.helpCount % hints.length]
  }

  async function getHint() {
    const hint = await getAIHintLocal({
      level,
      song: level === 'confident' ? 'te-aroha' : 'colour-song',
      currentLine: currentLine.maori,
      keyWord: currentLine.target,
      attemptState: hasTried ? 'tried' : 'not-tried',
      helpCount,
    })

    helpText = hint
    feedback = hint
    helpCount += 1
  }

  function readToMe() {
    if (!soundIsOn()) return

    stopAll()
    speechSynthesis.cancel()

    const text = helpText
      ? helpText
      : `Listen to the line. Then try singing it. The line is ${currentLine.maori}. ${currentLine.english}.`

    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-NZ'
    u.rate = getSpeechRate()

    speechSynthesis.speak(u)
  }
function goNext() {
  if (!accepted) return

  stopAll()
  saveSingProgress()

  if (isLastLine) {
    onNext()
  } else {
    currentIdx += 1
    hasTried = false
    helpCount = 0
    helpText = null
    feedback = 'Have a go! Tap “Try singing” above.'
    saveSingProgress()
  }
}

  function goBack() {
    stopAll()
    onBack()
  }

  onDestroy(() => stopAll())
</script>

<div class="page">
  <div class="stage" style="background-image: url({bgImg})">
    <button class="top-map" onclick={() => { stopAll(); push('/') }}>
      ← Back to Map
    </button>

    <div class="level-badge">{LEVEL_LABEL[level]}</div>

    <div class="line-progress">
      <span class="progress-title">Line {currentIdx + 1} of {lines.length}</span>

      <div class="step-buttons">
        {#each lines as _, i}
          <button
            class:active={i === currentIdx}
            class:done={results[i]}
            onclick={() => {
              if (i <= currentIdx || results[i]) {
                currentIdx = i
                helpCount = 0
                helpText = null
                feedback = results[i] ? '⭐ Ka pai! You completed this line.' : 'Have a go! Tap “Try singing” above.'
              }
            }}
          >
            {i + 1}
          </button>
        {/each}
      </div>
    </div>

    <div class="kiki-group">
      <div class="kiki-bubble">
        <strong>Listen to the line.</strong>
        <span>Then try singing it.</span>
      </div>

      <button class="kiwi-button" onclick={replayLine} aria-label="Replay line with Kiki">
        <img src={kiwiSing} alt="Kiki" class="kiwi" />
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
        <button class="action replay" onclick={replayLine}>
          <span>{isReplaying ? '⏹ Stop line' : '🔊 Replay line'}</span>
          <small>{isReplaying ? 'Stop audio' : 'Hear it again'}</small>
        </button>

        <button class="action sing" class:recording onclick={trySinging}>
          <span>🎤 {recording ? 'Listening…' : 'Try singing'}</span>
          <small>{recording ? 'Keep going' : 'Tap to record'}</small>
        </button>

        <button class="action help" onclick={getHint}>
          <span>💡 Need help?</span>
          <small>AI-style hint</small>
        </button>
      </div>

      <div class="feedback-card" class:good={accepted} class:retry={hasTried && !accepted}>
        <span class="feedback-star">{accepted ? '⭐' : '🌟'}</span>
        <p>{feedback}</p>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="btn-secondary" onclick={goBack}>← Back</button>

      <button class="btn-rtm" onclick={readToMe} aria-label="Read to me">
        <img src={rtmImg} alt="Read to me" class="rtm-img" />
      </button>

      <button
        class="btn-next"
        class:ready={accepted}
        disabled={!accepted}
        onclick={goNext}
      >
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
  :global(html, body) {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
  }

  .page {
    position: fixed;
    inset: 0;
    overflow: hidden;
    font-family: 'Nunito', system-ui, sans-serif;
    user-select: none;
  }

  .stage {
    position: absolute;
    inset: 0;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  .top-map {
    position: absolute;
    top: 3%;
    left: 3%;
    z-index: 25;
    border: none;
    border-radius: 999px;
    font-family: inherit;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
    padding: 9px 20px;
    font-size: clamp(12px, 1.6vmin, 15px);
    background: rgba(255,255,255,.95);
    color: #374151;
    box-shadow: 0 4px 12px rgba(0,0,0,.2);
    transition: transform .12s ease;
  }

  .level-badge {
    position: absolute;
    top: 3%;
    right: 3%;
    z-index: 50;
    background: rgba(255,255,255,.96);
    color: #2c1a04;
    padding: clamp(8px, 1.2vh, 14px) clamp(16px, 2vw, 28px);
    border-radius: 999px;
    font-size: clamp(12px, 1.6vh, 20px);
    font-weight: 900;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
  }

  .line-progress {
    position: absolute;
    top: 3%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.5vw, 18px);
    background: linear-gradient(180deg, #8b4a16, #6b300d);
    color: white;
    padding: clamp(6px, 1vh, 12px) clamp(14px, 2vw, 24px);
    border-radius: 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,.25);
  }

  .progress-title {
    font-size: clamp(14px, 2vh, 22px);
    font-weight: 900;
    white-space: nowrap;
  }

  .step-buttons {
    display: flex;
    gap: 8px;
  }

  .line-progress button {
    width: clamp(28px, 4.5vh, 42px);
    height: clamp(28px, 4.5vh, 42px);
    border: none;
    border-radius: 50%;
    background: #fff8e6;
    color: #4a2b0b;
    font-size: clamp(14px, 2vh, 20px);
    font-weight: 900;
    cursor: pointer;
    box-shadow: inset 0 -2px 0 rgba(0,0,0,.15);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .line-progress button.active {
    background: #22c55e;
    color: white;
  }

  .line-progress button.done {
    background: #86efac;
    color: #14532d;
  }

  .kiki-group {
    position: absolute;
    left: 5vw;
    bottom: 32vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    z-index: 30;
    width: clamp(220px, 24vw, 340px);
  }

  .kiki-bubble {
    position: relative;
    background: rgba(255, 255, 255, 0.94);
    border: 3px solid rgba(34, 197, 94, 0.25);
    border-radius: 22px;
    padding: 12px 16px;
    box-shadow: 0 6px 16px rgba(0,0,0,.14);
    color: #2c1a04;
    width: 210px;
    box-sizing: border-box;
    text-align: center;
    margin-bottom: -6px;
    transform: translateX(8px);
  }

  .kiki-bubble::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -12px;
    width: 22px;
    height: 22px;
    background: rgba(255, 255, 255, 0.94);
    border-right: 3px solid rgba(34, 197, 94, 0.25);
    border-bottom: 3px solid rgba(34, 197, 94, 0.25);
    transform: translateX(-50%) rotate(45deg);
    border-radius: 4px;
  }

  .kiki-bubble strong {
    display: block;
    font-size: 18px;
    color: #15803d;
    margin-bottom: 5px;
    font-weight: 900;
  }

  .kiki-bubble span {
    display: block;
    font-size: 14px;
    font-weight: 800;
    color: #3a2008;
  }

  .kiwi-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 100%;
  }

  .kiwi {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 6px 12px rgba(0,0,0,.25));
  }

  .kiwi-button:hover .kiwi {
    animation: kiwiBounce .45s ease;
  }

  @keyframes kiwiBounce {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-8px);
    }
  }

  .main-card {
    position: absolute;
    top: 15vh;
    left: 52%;
    transform: translateX(-50%);
    z-index: 20;
    width: clamp(320px, 42vw, 620px);
    height: 42vh;
    background: rgba(255,248,230,.97);
    border: 5px solid #22c55e;
    border-radius: 24px;
    box-shadow: 0 8px 24px rgba(0,0,0,.18);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: clamp(15px, 2.5vh, 30px);
    box-sizing: border-box;
    text-align: center;
  }

  .current-pill {
    background: linear-gradient(180deg, #fde68a, #f59e0b);
    color: #78350f;
    padding: 6px 24px;
    border-radius: 999px;
    font-size: clamp(14px, 2vh, 20px);
    font-weight: 900;
    margin-bottom: auto;
  }

  .main-card h1 {
    margin: 5px 0;
    font-size: clamp(32px, 5.5vh, 60px);
    font-weight: 900;
    color: #2c1a04;
    line-height: 1.1;
  }

  .main-card h2 {
    margin: 0px 0 clamp(10px, 1.5vh, 20px);
    font-size: clamp(18px, 3vh, 30px);
    font-weight: 800;
    color: #15803d;
  }

  .colour-box {
    width: clamp(80px, 14vh, 150px);
    height: clamp(80px, 14vh, 150px);
    border-radius: 16px;
    border: 4px solid rgba(0,0,0,.2);
    box-shadow:
      inset 0 0 10px rgba(0,0,0,.1),
      0 4px 12px rgba(0,0,0,.15);
    margin-bottom: auto;
  }

  .meaning-box {
    padding: clamp(12px, 2vh, 24px) clamp(20px, 3vw, 40px);
    background: rgba(255,255,255,.85);
    border: 3px solid #d9b98a;
    border-radius: 16px;
    font-size: clamp(18px, 2.8vh, 28px);
    font-weight: 900;
    color: #2c1a04;
    margin-bottom: auto;
  }

  .action-layout-container {
    position: absolute;
    top: 60vh;
    left: 52%;
    transform: translateX(-50%);
    width: clamp(420px, 52vw, 760px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5vh;
    z-index: 35;
  }

  .action-row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 12px;
  }

  .action {
    border: none;
    border-radius: 22px;
    flex: 1;
    min-height: 74px;
    padding: clamp(14px, 2vh, 22px) 14px;
    color: white;
    font-family: inherit;
    font-weight: 900;
    font-size: clamp(16px, 2.4vh, 26px);
    cursor: pointer;
    box-shadow:
      0 5px 0 rgba(0,0,0,.22),
      0 6px 14px rgba(0,0,0,.18);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.15;
    transition: transform 0.1s ease;
  }

  .action:active {
    transform: translateY(2px);
    box-shadow: none;
  }

  .action small {
    font-size: clamp(12px, 1.6vh, 16px);
    font-weight: 800;
    opacity: .95;
    margin-top: 4px;
  }

  .replay {
    background: linear-gradient(180deg, #38bdf8, #0284c7);
  }

  .sing {
    background: linear-gradient(180deg, #4ade80, #16a34a);
  }

  .sing.recording {
    background: linear-gradient(180deg, #fb7185, #e11d48);
    animation: pulse 1s ease-in-out infinite;
  }

  .help {
    background: linear-gradient(180deg, #fbbf24, #f97316);
  }

  .feedback-card {
    width: 100%;
    background: rgba(255,248,230,.96);
    border: 3px solid rgba(217,119,6,.3);
    border-radius: 14px;
    padding: clamp(6px, 1vh, 12px) 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,.1);
    box-sizing: border-box;
  }

  .feedback-star {
    font-size: clamp(18px, 2.5vh, 28px);
  }

  .feedback-card p {
    margin: 0;
    color: #3a2008;
    font-size: clamp(12px, 1.7vh, 18px);
    font-weight: 900;
    text-align: center;
  }

  .feedback-card.good {
    border-color: rgba(34,197,94,.5);
    background: rgba(236,253,245,.96);
  }

  .bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px 24px;
    height: 90px;
    box-sizing: border-box;
  }

  .btn-secondary,
  .btn-next {
    border: none;
    border-radius: 999px;
    font-family: inherit;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
    height: 52px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: transform .12s ease;
  }

  .btn-secondary:hover,
  .btn-next:not(:disabled):hover {
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: rgba(255,255,255,.96);
    color: #334155;
    width: 160px;
    font-size: clamp(14px, 1.9vmin, 18px);
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
  }

  .btn-rtm {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .rtm-img {
    height: 52px;
    display: block;
    object-fit: contain;
  }

  .btn-next {
    background: rgba(220,220,220,.9);
    color: #737373;
    width: 180px;
    box-shadow: 0 4px 12px rgba(0,0,0,.1);
  }

  .btn-next-text {
    font-size: clamp(14px, 1.9vmin, 18px);
    font-weight: 800;
  }

  .btn-next-sub {
    font-size: 11px;
    font-weight: 700;
    opacity: 0.85;
  }

  .btn-next.ready {
    background: linear-gradient(180deg, #fde68a, #f59e0b);
    color: #78350f;
    box-shadow:
      0 4px 0 #b45309,
      0 6px 16px rgba(0,0,0,.2);
  }

  .btn-next:disabled {
    cursor: not-allowed;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.03);
    }

    100% {
      transform: scale(1);
    }
  }
</style>