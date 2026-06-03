<script lang="ts">
  import bgImg   from '../../../assets/p2_goal_background2.png'
  import kiwiImg from '../../../assets/kiwihello.png'
  import rtmImg  from '../../../assets/read_to_me.png'
  import { onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  
  import { settings } from '../../../lib/settings.svelte'
  import PlayMusicPage from '../PlayMusicPage/PlayMusicPage.svelte'
  import SingAlongPage from '../SingAlongPage/SingAlongPage.svelte'
  import QuizPage      from '../QuizPage/QuizPage.svelte'
  import RewardPage    from '../RewardPage/RewardPage.svelte'

  const { onback } = $props<{ onback: () => void }>()

  let page          = $state<'intro'|'play'|'sing'|'quiz'|'reward'>('intro')
  let selectedLevel = $state<'beginner'|'confident'|null>(null)
  let singingCompleted = $state(false)


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

function handleBackToMap() {
  speechSynthesis.cancel()
  onback()
}


  function readToMe() {
    if (!soundIsOn()) return
    speechSynthesis.cancel()
    const text = `Waiata Time! Kia ora! Let's learn a waiata together.
      Listen, try singing, and answer two questions.
      Choose your song level:
      Beginner Level — practise the colour song.
      Confident Level — practise Te Aroha.`
    const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-NZ'
  u.rate = getSpeechRate()
    speechSynthesis.speak(u)
  }
function startFlow() {
  if (!selectedLevel) return
  speechSynthesis.cancel()
  singingCompleted = false
  page = 'play'
}

onDestroy(() => {
  speechSynthesis.cancel()
})


</script>

{#if page === 'intro'}
<div class="wrap">
  <div class="stage" style="background-image: url({bgImg})">



    <!-- Kiki greeting — top left (image 3 style) -->
    <div class="top-badge">
      <img src={kiwiImg} alt="Kiki" class="kiki-small" />
      <div class="kiki-bubble">
        <p class="bubble-kiki">💬 Kia ora! Let's learn a waiata together.</p>
        <p class="bubble-goal">🎯 Listen, try singing, and answer two questions.</p>
      </div>
    </div>


    <!-- Level cards — centred on the sandy beach -->
    <div class="level-section">
      <div class="level-cards">

        <button
          class="level-card beginner-card"
          class:selected={selectedLevel === 'beginner'}
          onclick={() => selectedLevel = 'beginner'}
          aria-pressed={selectedLevel === 'beginner'}
        >
          <span class="level-icon">🌿</span>
          <span class="level-name beginner-name">Beginner Level</span>
          <span class="level-desc">I want to practise the colour song.</span>
          {#if selectedLevel === 'beginner'}
            <span class="selected-tick beginner-tick">✓</span>
          {/if}
        </button>

        <button
          class="level-card confident-card"
          class:selected={selectedLevel === 'confident'}
          onclick={() => selectedLevel = 'confident'}
          aria-pressed={selectedLevel === 'confident'}
        >
          <span class="level-icon">🌺</span>
          <span class="level-name confident-name">Confident Level</span>
          <span class="level-desc">I want to practise Te Aroha.</span>
          {#if selectedLevel === 'confident'}
            <span class="selected-tick confident-tick">✓</span>
          {/if}
        </button>

      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bottom-bar">
<button class="btn-secondary" onclick={handleBackToMap}>← Back to Map</button>      <button class="btn-rtm" onclick={readToMe} aria-label="Read to me">
        <img src={rtmImg} alt="Read to me" class="rtm-img" />
      </button>
      <button
        class="btn-start"
        class:active={!!selectedLevel}
        disabled={!selectedLevel}
        onclick={startFlow}
      >
        ▶ Start
      </button>
    </div>

  </div>
</div>
{/if}

{#if page === 'play'}
  <PlayMusicPage
    level={selectedLevel ?? 'beginner'}
    onBack={() => { page = 'intro' }}
    onNext={() => { page = 'sing'  }}
    onMap={onback}
  />
{/if}
{#if page === 'sing'}
  <SingAlongPage
    level={selectedLevel ?? 'beginner'}
    completed={singingCompleted}
    onBack={() => { page = 'play' }}
    onNext={() => {
      singingCompleted = true
      page = 'quiz'
    }}
  />
{/if}

{#if page === 'quiz'}
  <QuizPage
    level={selectedLevel ?? 'beginner'}
    onBack={() => { page = 'sing'  }}
    onMap={onback}
    onFinish={() => { page = 'reward' }}
  />
{/if}

{#if page === 'reward'}
  <RewardPage
    level={selectedLevel ?? 'beginner'}
    onMap={onback}
  />
{/if}

<style>
  :global(html, body) {
    margin: 0 !important; padding: 0 !important;
    width: 100vw !important; height: 100vh !important;
    overflow: hidden !important;
  }

  .wrap {
    position: fixed; inset: 0; overflow: hidden;
    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif;
  }

  .stage {
    position: absolute; inset: 0;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  /* ── Top-left Kiki greeting (image 3 style) ── */
  .top-badge {
    position: absolute;
    top: 4%; left: 3%;
    display: flex; align-items: flex-start; gap: 12px;
    z-index: 20;
    animation: slideDown .4s cubic-bezier(.34,1.56,.64,1) both;
  }
  .kiki-small {
    width: clamp(56px, 8vmin, 90px);
    height: auto;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.3));
    flex-shrink: 0;
  }
  .kiki-bubble {
    background: rgba(255,255,255,.96);
    border-radius: 16px;
    padding: 12px 18px;
    box-shadow: 0 6px 20px rgba(0,0,0,.18);
    max-width: clamp(180px, 26vw, 320px);
    display: flex; flex-direction: column; gap: 3px;
  }
  .bubble-kiki {
    margin: 0;
    font-size: clamp(11px, 1.6vmin, 16px);
    font-weight: 700; color: #374151; line-height: 1.3;
  }
  .bubble-goal {
    margin: 0;
    font-size: clamp(10px, 1.3vmin, 14px);
    font-weight: 600; color: #6b7280; line-height: 1.3;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }



  /* ── Level cards ── */
  .level-section {
    position: absolute;
    bottom: 22%; left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    width: 80%;
    max-width: 680px;
  }

  

  .level-cards {
    display: flex;
    gap: clamp(12px, 2.5vw, 24px);
    width: 100%;
    justify-content: center;
  }

  .level-card {
    flex: 1;
    max-width: 340px;
     min-height: 190px;
    display: flex; flex-direction: column; align-items: center;
    gap: clamp(6px, 1vmin, 12px);
    padding: clamp(18px, 3vmin, 30px) clamp(14px, 2vmin, 24px);
    background: rgba(255,255,255,.97);
    border: 4px solid transparent;
    border-radius: 24px;
    cursor: pointer;
    position: relative;
    transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease;
    box-shadow: 0 8px 28px rgba(0,0,0,.18);
  }
  .level-card:hover   { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,.22); }
  .level-card.selected { transform: translateY(-4px); }

  /* Beginner — green */
  .beginner-card          { border-color: #22c55e; box-shadow: 0 8px 28px rgba(34,197,94,.25); }
  .beginner-card:hover    { box-shadow: 0 14px 36px rgba(34,197,94,.35); }
  .beginner-card.selected { box-shadow: 0 0 0 4px rgba(34,197,94,.4), 0 8px 28px rgba(34,197,94,.3); }
  .beginner-name          { color: #16a34a !important; }
  .beginner-tick          { background: #16a34a !important; }

  /* Confident — purple */
  .confident-card          { border-color: #a855f7; box-shadow: 0 8px 28px rgba(168,85,247,.25); }
  .confident-card:hover    { box-shadow: 0 14px 36px rgba(168,85,247,.35); }
  .confident-card.selected { box-shadow: 0 0 0 4px rgba(168,85,247,.4), 0 8px 28px rgba(168,85,247,.3); }
  .confident-name          { color: #9333ea !important; }
  .confident-tick          { background: #9333ea !important; }
  .level-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 16px 36px rgba(0,0,0,.22);
  }
  .level-card.selected {
    border-color: #16a34a;
    box-shadow: 0 0 0 4px rgba(22,163,74,.3), 0 12px 28px rgba(0,0,0,.2);
    animation: cardPop .25s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes cardPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.07) translateY(-5px); }
    100% { transform: scale(1)   translateY(-6px); }
  }

  .level-icon { font-size: clamp(32px, 5.5vmin, 52px); }
  .level-name {
    font-size: clamp(20px, 3vmin, 30px);
    font-weight: 900;
    color: #1a3a0f;
  }
  .level-desc {
    font-size: clamp(11px, 1.5vmin, 15px);
    font-weight: 600;
    color: #4b5563;
    text-align: center;
    line-height: 1.4;
  }

  .selected-tick {
    position: absolute; top: 10px; right: 14px;
    width: 26px; height: 26px;
    background: #16a34a; color: #fff;
    border-radius: 50%;
    font-size: 14px; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Bottom bar ── */
  /* ── Bottom bar unified alignment ── */
  .bottom-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0; z-index: 30;
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 16px 32px 24px; /* Uniform spacing from borders */
    height: 90px;           /* Locks the container height */
    box-sizing: border-box;
  }

  .btn-secondary, .btn-start {
    border: none; 
    border-radius: 999px;
    font-family: inherit; 
    font-weight: 800; 
    cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease;
    white-space: nowrap;
    height: 52px;           /* Shared uniform button height */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(14px, 1.9vmin, 18px);
    box-sizing: border-box;
  }
  .btn-secondary:hover, .btn-start:not(:disabled):hover { transform: translateY(-2px); }

  /* Specific fixed widths for seamless transition alignment */
  .btn-secondary { 
    background: rgba(255,255,255,.95); 
    color: #374151; 
    box-shadow: 0 4px 12px rgba(0,0,0,.18); 
    width: 160px;          /* Matches Page 2 Back button width */
  }

  .btn-start {
    background: rgba(200,200,200,.7);
    color: rgba(100,100,100,.8);
    width: 180px;          /* Increased size to match Next button */
  }
  .btn-start.active {
    background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
    color: #fff;
    box-shadow: 0 5px 0 #15803d, 0 6px 20px rgba(0,0,0,.25);
    animation: startPulse .5s .1s ease-out both;
  }
  .btn-start:disabled { cursor: not-allowed; }
  
  @keyframes startPulse {
    0%   { transform: scale(.95); }
    60%  { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .btn-rtm  { margin-top: 0; background: none; border: none; cursor: pointer; padding: 0; }
  .rtm-img  { height: 52px; object-fit: contain; display: block; } /* Match button height */

</style>