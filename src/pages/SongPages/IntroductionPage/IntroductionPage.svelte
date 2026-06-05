<script lang="ts">
  import bgImg        from '../../../assets/p2_goal_background2.png'
  import rtmImg       from '../../../assets/read_to_me.png'
  import beginnerImg  from '../../../assets/beginner level.png'
  import confidentImg from '../../../assets/confident level.png'
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
      Beginner Level — learn the colour song.
      Confident Level — learn Te Aroha.`
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



    <!-- Kiki greeting — top left (Tikanga/Pepeha bubble style) -->
    <div class="kiki-block">
      <div class="bubble">
        <p class="bubble-greeting">💬 Kia ora! Let's learn a waiata together.</p>
        <p class="bubble-mission">🎯 Listen, try singing, and answer two questions.</p>
      </div>
    </div>


    <!-- Level cards — centred on the sandy beach -->
    <div class="level-section">
      <div class="level-cards">

        <button
          class="level-card"
          class:selected={selectedLevel === 'beginner'}
          onclick={() => selectedLevel = 'beginner'}
          aria-pressed={selectedLevel === 'beginner'}
        >
          <div class="card-top">
            <span class="card-icon">⭐</span>
            <p class="card-desc">I want to learn the colour song.</p>
          </div>
          <img src={beginnerImg} alt="Beginner Level" class="card-img" />
        </button>

        <button
          class="level-card"
          class:selected={selectedLevel === 'confident'}
          onclick={() => selectedLevel = 'confident'}
          aria-pressed={selectedLevel === 'confident'}
        >
          <div class="card-top">
            <span class="card-icon">🌟</span>
            <p class="card-desc">I want to learn Te Aroha.</p>
          </div>
          <img src={confidentImg} alt="Confident Level" class="card-img" />
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

  /* ── Top-left Kiki greeting (Tikanga/Pepeha bubble style) ── */
  .kiki-block {
    position: absolute;
    top: 14%; left: 3%;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(300px, 28vw);
    animation: slideDown .4s cubic-bezier(.34,1.56,.64,1) both;
  }
  .bubble {
    position: relative;
    background: #ffffff;
    border: 3px solid #F5A623;
    border-radius: 22px;
    padding: 14px 18px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    margin-bottom: 8px;
  }
  .bubble::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 40px;
    border-width: 14px 12px 0 12px;
    border-style: solid;
    border-color: #F5A623 transparent transparent transparent;
  }
  .bubble-greeting {
    margin: 0 0 8px;
    font-size: clamp(15px, 1.7vw, 19px);
    font-weight: 900;
    color: #1a5c00;
    line-height: 1.4;
  }
  .bubble-mission {
    margin: 0;
    font-size: clamp(14px, 1.5vw, 17px);
    font-weight: 800;
    color: #c2521a;
    line-height: 1.4;
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
    gap: 24px;
    width: 100%;
    justify-content: center;
    align-items: stretch;
  }

  /* Tikanga-style level card */
  .level-card {
    width: min(270px, 27vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 18px 16px;
    border-radius: 24px;
    border: 3px solid rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.14);
    cursor: pointer;
    outline: none;
    font-family: inherit;
    transition: transform 0.15s ease, background 0.2s ease,
                border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .level-card:hover {
    transform: translateY(-6px);
    background: rgba(255,255,255,0.65);
    box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  }
  .level-card.selected {
    background: #ffffff;
    border-color: #F5A623;
    box-shadow: 0 0 0 5px rgba(245,166,35,0.4), 0 12px 32px rgba(0,0,0,0.2);
    transform: translateY(-4px);
  }
  .level-card:focus-visible {
    outline: 3px solid #F5A623;
    outline-offset: 4px;
  }

  .card-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
  }
  .card-icon {
    font-size: clamp(24px, 3vw, 34px);
    line-height: 1;
  }
  .card-desc {
    margin: 0;
    font-size: clamp(14px, 1.6vw, 18px);
    font-weight: 700;
    color: #1a3000;
    text-align: center;
    line-height: 1.5;
  }
  .card-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 14px;
    flex-shrink: 0;
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