<script lang="ts">
  // Dev D — Listen Page (Page 2)
  // Fixed for both levels:
  // beginner  → colour song
  // confident → Te Aroha
  // Next button only activates after song has been played at least once.

  import { onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { settings } from '../../../lib/settings.svelte'
  import bgImg from '../../../assets/p3_background.png'
  import kiwiImg from '../../../assets/kiwihello.png'
  import rtmImg from '../../../assets/read_to_me.png'

  import easySong from '../../../assets/song-page/merged_song.mp3'
  import teArohaAudio from '../../../assets/song-page/normal_learning_song.mp3'

  const { onBack, onNext, onMap, level: levelProp = 'beginner' } = $props<{
    onBack: () => void
    onNext: () => void
    onMap?: () => void
    level?: string
  }>()

  let level = $derived(
    levelProp === 'confident' || levelProp === 'hard'
      ? 'confident'
      : 'beginner'
  )

  type SongData = {
    title: string
    instruction: string
    audioSrc: string
    supportWords: { maori: string; meaning: string; colour?: string }[]
    lyrics: { start: number; maori: string; english: string }[]
  }

  const SONGS: Record<string, SongData> = {
    beginner: {
      title: 'Listen to the Colour Song',
      instruction: 'Listen first. Then we will try it together.',
      audioSrc: easySong,
      supportWords: [
        { maori: 'mā', meaning: 'white', colour: '#ffffff' },
        { maori: 'whero', meaning: 'red', colour: '#ef4444' },
        { maori: 'kākāriki', meaning: 'green', colour: '#22c55e' },
        { maori: 'pango', meaning: 'black', colour: '#1f2937' },
        { maori: 'mangu', meaning: 'black / dark', colour: '#6b7280' },
      ],
      lyrics: [
        { start: 0, maori: 'Ngā Tae', english: 'Colours' },
        { start: 0.31, maori: 'Mā is white', english: 'Mā = White' },
        { start: 2.94, maori: 'Whero is red', english: 'Whero = Red' },
        { start: 5.44, maori: 'Kākāriki is green', english: 'Kākāriki = Green' },
        { start: 8.77, maori: 'Pango is black', english: 'Pango = Black' },
        { start: 10.46, maori: 'Mangu is too', english: 'Mangu = Black too' },
        { start: 12.16, maori: 'A, E, I, O, U', english: 'The vowels' },
      ],
    },

    confident: {
      title: 'Listen to Te Aroha',
      instruction: 'Listen first. Then we will try it together.',
      audioSrc: teArohaAudio,
      supportWords: [
        { maori: 'aroha', meaning: 'love' },
        { maori: 'whakapono', meaning: 'faith / belief' },
        { maori: 'rangimārie', meaning: 'peace' },
        { maori: 'tātou', meaning: 'all of us' },
      ],
      lyrics: [
        { start: 0, maori: 'Te aroha', english: 'Love' },
        { start: 10.5, maori: 'Te whakapono', english: 'Faith' },
        { start: 15, maori: 'Me te rangimārie', english: 'And peace' },
        { start: 20, maori: 'Tātou, tātou e', english: 'All of us' },
      ],
    },
  }
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



  let song = $derived(SONGS[level] ?? SONGS.beginner)

  let audio = $derived.by(() => {
  const newAudio = new Audio(song.audioSrc)
  newAudio.preload = 'auto'
  newAudio.volume = getVolumeValue()
  return newAudio
})

  let playing = $state(false)
  let hasPlayedOnce = $state(false)
  let currentMaori = $state('')
  let currentEng = $state('')

  function stopAudio() {
    audio.pause()
    audio.currentTime = 0
    playing = false
  }

  $effect(() => {
    currentMaori = song.lyrics[0].maori
    currentEng = song.lyrics[0].english

    audio.ontimeupdate = () => {
      const t = audio.currentTime

      for (let i = song.lyrics.length - 1; i >= 0; i--) {
        if (t >= song.lyrics[i].start) {
          currentMaori = song.lyrics[i].maori
          currentEng = song.lyrics[i].english
          break
        }
      }
    }

    audio.onended = () => {
      stopAudio()
      currentMaori = song.lyrics[0].maori
      currentEng = song.lyrics[0].english
    }

    return () => {
      audio.pause()
      audio.ontimeupdate = null
      audio.onended = null
    }
  })

  function goToMap() {
    stopAudio()
    speechSynthesis.cancel()

    if (onMap) {
      onMap()
    } else {
      push('/')
    }
  }
function togglePlay() {
  if (!soundIsOn()) {
    audio.pause()
    playing = false
    hasPlayedOnce = true
    return
  }

  if (playing) {
    audio.pause()
    playing = false
  } else {
    audio.volume = getVolumeValue()
    audio.play()
    playing = true
    hasPlayedOnce = true
  }
}

  function handleBack() {
    stopAudio()
    speechSynthesis.cancel()
    onBack()
  }

  function handleNext() {
    stopAudio()
    speechSynthesis.cancel()
    onNext()
  }
function readToMe() {
  if (!soundIsOn()) return

  if (playing) {
    audio.pause()
    playing = false
  }

  speechSynthesis.cancel()

  const words = song.supportWords
    .map((w) => `${w.maori} means ${w.meaning}`)
    .join('. ')

  const text = `${song.title}. ${song.instruction}. Key words: ${words}.`

  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-NZ'
  u.rate = 0.85

  speechSynthesis.speak(u)
}

  onDestroy(() => {
    stopAudio()
    speechSynthesis.cancel()
  })
</script>

<div class="wrap">
  <div class="stage" style="background-image: url({bgImg})">
    <button class="btn-map-corner" onclick={goToMap}>← Back to Map</button>

    <div class="kiki-instruction" style="position:absolute;top:10%;left:3%;z-index:20;">
      <img src={kiwiImg} alt="Kiki" class="kiki-small" draggable="false" />
      <div class="kiki-speech">
        <p class="speech-main">Listen first.</p>
        <p class="speech-sub">Then we will try it together.</p>
      </div>
    </div>

    <div class="lyrics-board">
      <p class="lyric-maori">{currentMaori}</p>
      <p class="lyric-eng">{currentEng}</p>
    </div>

    <div class="kw-panel">
      <div class="kw-header">
        <span class="kw-star">⭐</span>
        <span class="kw-title">KEY WORDS</span>
        <span class="kw-star">⭐</span>
      </div>

      {#each song.supportWords as w}
        <div class="kw-row">
          {#if w.colour}
            <span class="kw-dot" style="background:{w.colour};"></span>
          {:else}
            <span class="kw-emoji">
              {w.maori === 'aroha' ? '❤️' :
               w.maori === 'whakapono' ? '🙏' :
               w.maori === 'rangimārie' ? '🕊️' :
               w.maori === 'tātou' ? '👨‍👩‍👧‍👦' : '⭐'}
            </span>
          {/if}

          <span class="kw-text">
            <strong>{w.maori}</strong> = {w.meaning}
          </span>
        </div>
      {/each}
    </div>

    <div class="bottom-bar">
      <button class="btn-secondary" onclick={handleBack}>← Back</button>

      <div class="center-btns">
        <button class="btn-play" class:playing onclick={togglePlay}>
          {playing ? '⏹ Stop' : '▶ Play'}
        </button>

        <button class="btn-rtm" onclick={readToMe} aria-label="Read to me">
          <img src={rtmImg} alt="Read to me" class="rtm-img" />
        </button>
      </div>

      <button
        class="btn-next"
        class:active={hasPlayedOnce}
        disabled={!hasPlayedOnce}
        onclick={handleNext}
      >
        Next →
      </button>
    </div>

    <p class="copyright">🎵 Educational use only.</p>
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

  .wrap {
    position: fixed;
    inset: 0;
    overflow: hidden;
    font-family: 'Nunito', system-ui, sans-serif;
  }

  .stage {
    position: absolute;
    inset: 0;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  .lyrics-board {
    position: absolute;
    top: 48%;
    left: 51%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 42%;
    min-height: 22%;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 18px 24px;
    text-align: center;
  }

  .lyric-maori {
    margin: 0;
    font-size: clamp(22px, 5vmin, 46px);
    font-weight: 900;
    color: #2c1a04;
    line-height: 1.1;
  }

  .lyric-eng {
    margin: 0;
    font-size: clamp(14px, 2.8vmin, 26px);
    font-weight: 800;
    color: #593e1a;
  }

  .kw-panel {
    position: absolute;
    top: 50%;
    right: clamp(8px, 2%, 20px);
    transform: translateY(-50%);
    z-index: 20;
    background: linear-gradient(180deg, #f5e6c0 0%, #eedba0 100%);
    border: 3px solid #a0641a;
    border-radius: 18px;
    padding: 14px 18px;
    min-width: 220px;
    max-width: clamp(200px, 22vw, 260px);
    box-shadow:
      0 6px 20px rgba(0,0,0,.25),
      inset 0 1px 0 rgba(255,255,255,.4);
  }

  .kw-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(160,100,26,.3);
  }

  .kw-star {
    font-size: 14px;
  }

  .kw-title {
    font-size: clamp(14px, 1.8vmin, 17px);
    font-weight: 900;
    color: #5a3208;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .kw-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(255,255,255,.6);
    margin-bottom: 6px;
  }

  .kw-row:last-child {
    margin-bottom: 0;
  }

  .kw-dot {
    width: clamp(14px, 2vmin, 20px);
    height: clamp(14px, 2vmin, 20px);
    border-radius: 50%;
    flex-shrink: 0;
    border: 2px solid rgba(0,0,0,.2);
    box-shadow: 0 1px 4px rgba(0,0,0,.2);
  }

  .kw-text {
    font-size: clamp(13px, 1.7vmin, 17px);
    font-weight: 700;
    color: #3a2008;
    white-space: nowrap;
  }

  .kw-text strong {
    color: #15803d;
  }

  .bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px 24px;
    height: 90px;
    box-sizing: border-box;
  }

  .center-btns {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .btn-secondary,
  .btn-next,
  .btn-play {
    border: none;
    border-radius: 999px;
    font-family: inherit;
    font-weight: 800;
    cursor: pointer;
    transition:
      transform .12s ease,
      box-shadow .12s ease;
    white-space: nowrap;
    height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .btn-secondary:hover,
  .btn-next:not(:disabled):hover,
  .btn-play:hover {
    transform: translateY(-2px);
  }

  .btn-secondary {
    font-size: clamp(14px, 1.9vmin, 18px);
    background: rgba(255,255,255,.95);
    color: #374151;
    box-shadow: 0 4px 12px rgba(0,0,0,.18);
    width: 160px;
  }

  .btn-play {
    padding: 0 40px;
    font-size: clamp(18px, 2.5vmin, 24px);
    background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
    color: #fff;
    box-shadow:
      0 5px 0 #15803d,
      0 6px 20px rgba(0,0,0,.25);
  }

  .btn-play.playing {
    background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%);
    box-shadow:
      0 5px 0 #b45309,
      0 6px 20px rgba(0,0,0,.2);
    animation: playPulse 1.2s ease-in-out infinite;
  }

  .btn-next {
    font-size: clamp(14px, 1.9vmin, 18px);
    background: rgba(200,200,200,.7);
    color: rgba(100,100,100,.8);
    width: 180px;
  }

  .btn-next.active {
    background: linear-gradient(180deg, #FDE68A 0%, #F59E0B 100%);
    color: #78350f;
    box-shadow:
      0 5px 0 #b45309,
      0 6px 20px rgba(0,0,0,.2);
    animation: nextPulse .5s .1s ease-out both;
  }

  .btn-next:disabled {
    cursor: not-allowed;
  }

  .btn-rtm {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .rtm-img {
    height: 52px;
    object-fit: contain;
    display: block;
  }

  .btn-map-corner {
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

  .btn-map-corner:hover {
    transform: translateY(-2px);
  }

  .kiki-instruction {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: slideDown .4s cubic-bezier(.34,1.56,.64,1) both;
  }

  .kiki-small {
    width: clamp(50px, 7vmin, 80px);
    height: auto;
    flex-shrink: 0;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,.3));
  }

  .kiki-speech {
    background: rgba(255,255,255,.95);
    border-radius: 14px;
    padding: 8px 14px;
    box-shadow: 0 4px 16px rgba(0,0,0,.18);
    max-width: clamp(160px, 22vw, 260px);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .speech-main {
    margin: 0;
    font-size: clamp(13px, 1.8vmin, 18px);
    font-weight: 900;
    color: #1a3a0f;
  }

  .speech-sub {
    margin: 0;
    font-size: clamp(11px, 1.4vmin, 14px);
    font-weight: 600;
    color: #4b5563;
  }

  .kw-emoji {
    font-size: 22px;
    width: 28px;
    text-align: center;
    flex-shrink: 0;
  }

  .copyright {
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 10;
    margin: 0;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255,255,255,.85);
    background: rgba(0,0,0,.25);
    padding: 5px 12px;
    border-radius: 20px;
    white-space: nowrap;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes playPulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.04);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes nextPulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.05);
    }

    100% {
      transform: scale(1);
    }
  }

  /* ── Responsive: narrow / short screens ── */
  @media (max-width: 700px), (max-height: 600px) {

    /* Kiki instruction: smaller bubble, won't overlap title */
    .kiki-instruction {
      top: 7% !important;
      left: 2% !important;
    }
    .kiki-small { width: clamp(36px, 5vmin, 52px); }
    .kiki-speech {
      padding: 5px 10px;
      max-width: clamp(120px, 35vw, 180px);
    }
    .speech-main { font-size: clamp(11px, 1.5vmin, 14px); }
    .speech-sub  { font-size: clamp(9px,  1.2vmin, 12px); }

    /* Key words panel: move to top-right, shrink so it clears the lyrics board */
    .kw-panel {
      top: 8% !important;
      right: 1% !important;
      transform: none !important;
      max-width: clamp(130px, 32vw, 190px);
      min-width: 0;
      padding: 6px 8px;
    }
    .kw-header { margin-bottom: 6px; padding-bottom: 5px; }
    .kw-title  { font-size: clamp(10px, 1.3vmin, 12px); }
    .kw-row    { padding: 4px 5px; margin-bottom: 3px; gap: 5px; }
    .kw-text   { font-size: clamp(9px, 1.3vmin, 12px); white-space: normal; }
    .kw-dot    { width: 10px; height: 10px; }
    .kw-emoji  { font-size: 13px; width: 16px; }

    /* Bottom bar: shrink buttons to fit */
    .bottom-bar {
      padding: 10px 12px 16px;
      height: auto;
    }
    .btn-secondary { width: 80px;  font-size: 12px; padding: 0 10px; }
    .btn-next      { width: 90px;  font-size: 12px; padding: 0 10px; }
    .btn-play      { padding: 0 20px; font-size: clamp(14px, 2vmin, 18px); }
    .rtm-img       { height: 42px; }
  }

</style>