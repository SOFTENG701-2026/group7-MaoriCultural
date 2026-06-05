<!-- Dev D — Waiata Reward Page (Page 6) -->
<script lang="ts">
  import { onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { progress } from '../../../lib/progress.svelte'
  import { settings } from '../../../lib/settings.svelte'
 
  import waiataCard from '../../../assets/waiata_badge_card.png'
  import badgeBackToMap from '../../../assets/quiz-page/badgebacktomap.png'
  import beginnerBadge from '../../../assets/badges/waiata badge for beginners.png'
  import confidentBadge from '../../../assets/badges/waiata badge for confident.png'
 
  interface Props {
    level?: string
    onMap?: () => void
  }
 
  const { level = 'beginner', onMap = () => push('/') } = $props<Props>()
 
  let lvl = $derived(level)
  let isConfident = $derived(lvl === 'confident' || lvl === 'hard')
 
  let CONTENT = $derived.by(() => ({
    title: 'Waiata Complete!',
 
    kikiSays: isConfident
      ? 'Ka pai! You listened and tried Te Aroha.'
      : 'Ka pai! You listened and tried the colour song.',
 
    badgeLabel: isConfident
      ? 'Waiata Navigator Badge'
      : 'Waiata Explorer Badge',
 
    badgeImg: isConfident
      ? confidentBadge
      : beginnerBadge,
 
    levelTag: isConfident
      ? '🌺 Confident Level completed!'
      : '🌿 Beginner Level completed!',
 
    summary: isConfident
      ? [
          'aroha = love',
          'rangimārie = peace',
          'tātou = all of us',
          'You completed the Te Aroha word and meaning checks',
        ]
      : [
          'mā = white',
          'whero = red',
          'kākāriki = green',
          'pango / mangu = black',
          'You completed the colour word and meaning checks',
        ],
  }))
 
  const BADGE_KEY = 'mca-waiata-badge'
 
  function getSavedBadge() {
    try {
      return localStorage.getItem(BADGE_KEY)
    } catch {
      return null
    }
  }
 
  function saveBadge(t: string) {
    try {
      sessionStorage.setItem(BADGE_KEY, t)
 
      const current = getSavedBadge()
      if (current === 'confident' && t === 'beginner') return
 
      localStorage.setItem(BADGE_KEY, t)
    } catch {}
  }
 
  let isUpgrade = $state(false)
  let showModal = $state(false)
 
  function handleDone() {
    speechSynthesis.cancel()
 
    progress.markComplete('waiata')
 
    const badgeType = isConfident ? 'confident' : 'beginner'
    isUpgrade = getSavedBadge() === 'beginner' && badgeType === 'confident'
 
    saveBadge(badgeType)
 
    console.log(`[Dev D] awardBadge('waiata', '${badgeType}')`)
 
    // Clear singing progress for both levels so next attempt starts from line 1
    try {
      sessionStorage.removeItem('waiata-sing-progress-beginner')
      sessionStorage.removeItem('waiata-sing-progress-confident')
    } catch {}
 
    showModal = true
  }
 
  function goToMap() {
    speechSynthesis.cancel()
    onMap()
    push('/')
  }
 
  function readToMe() {
    if (!soundIsOn()) return
 
    speechSynthesis.cancel()
 
    const text = `${CONTENT.title}. ${CONTENT.kikiSays}. You learned: ${CONTENT.summary.join('. ')}. ${CONTENT.badgeLabel} unlocked!`
 
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-NZ'
    u.rate = getSpeechRate()
 
    speechSynthesis.speak(u)
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
 
  onDestroy(() => {
    speechSynthesis.cancel()
  })
</script>
 
<div class="page">
  <div class="bg" aria-hidden="true"></div>
 
  <button class="btn-corner" onclick={goToMap}>← Back to Map</button>
 
  <div class="cards-row">
    <div class="left-wrap">
      <div class="reward-banner">🎉 Reward time!</div>
 
      <div class="left-card">
        <!-- cert-wrapper ties badge position to the image, not the card -->
        <div class="cert-wrapper">
          <img src={waiataCard} alt="Waiata badge card" class="youdidit-img" />
          <img
            src={CONTENT.badgeImg}
            alt={CONTENT.badgeLabel}
            class="coin-badge"
            class:glow={isConfident}
          />
        </div>
      </div>
    </div>
 
    <div class="right-card">
      <div class="level-tag">{CONTENT.levelTag}</div>
 
      <h1>{CONTENT.title}</h1>
 
      <p class="kiki-says">{CONTENT.kikiSays}</p>
 
      <p class="learned-title">You learned:</p>
 
      <div class="stats">
        {#each CONTENT.summary as item, i}
          <div class="stat-row" style:animation-delay="{i * 0.1}s">
            <span class="stat-label">✓ {item}</span>
          </div>
        {/each}
      </div>
 
      <div class="badge-pill">
        🏅 {CONTENT.badgeLabel} unlocked!
      </div>
 
      <div class="hint-box">
        <b>Next step:</b> Tap Done to collect your {CONTENT.badgeLabel}.
      </div>
    </div>
  </div>
 
  <nav class="bottom-nav">
    <button class="pill btn-read" onclick={readToMe}>🔊 Read to me</button>
    <button class="pill btn-show" onclick={handleDone}>Show Badge</button>
    <button class="pill btn-done" onclick={handleDone}>Done →</button>
  </nav>
</div>
 
{#if showModal}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Badge earned"
  >
    <div class="modal-box" role="document">
      <button
        class="modal-close"
        onclick={() => {
          speechSynthesis.cancel()
          showModal = false
        }}
        aria-label="Close badge popup"
      >
        ×
      </button>
 
      <p class="modal-title">
        {isUpgrade ? '⬆️ Badge Upgraded!' : 'Ka rawe! 🎉'}
      </p>
 
      <p class="modal-badge-name">
        {CONTENT.badgeLabel} unlocked!
      </p>
 
      <img
        src={CONTENT.badgeImg}
        alt={CONTENT.badgeLabel}
        class="modal-badge"
        class:shimmer={isConfident}
      />
 
      <p class="modal-desc">
        {#if isUpgrade}
          ✨ You completed the Confident level — your Waiata badge has been upgraded to Navigator!
        {:else if isConfident}
          🌺 You earned the Waiata Navigator Badge for completing Te Aroha!
        {:else}
          🌿 You earned the Waiata Explorer Badge for completing the colour waiata!
        {/if}
      </p>
 
      <button class="back-map-btn" onclick={goToMap}>
        <img src={badgeBackToMap} alt="Back to the map" class="back-map-img" />
      </button>
    </div>
  </div>
{/if}

<style>
  :global(html, body) {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
  }

  .page {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Nunito', 'Varela Round', system-ui, sans-serif;
    overflow: hidden;
  }

  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      170deg,
      #7dd3f5 0%,
      #a8e4f0 25%,
      #c8edc0 50%,
      #e8e8a0 75%,
      #f5e87a 100%
    );
  }

  .btn-corner {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
    border: none;
    border-radius: 999px;
    padding: 10px 22px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 800;
    background: #fff;
    color: #333;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    cursor: pointer;
    transition: transform 0.12s;
  }

  .btn-corner:hover {
    transform: translateY(-2px);
  }

  .cards-row {
    position: relative;
    z-index: 20;
    width: 92%;
    max-width: 1400px;
    height: calc(100vh - 115px);
    display: flex;
    align-items: flex-start;
    gap: 24px;
    margin-top: 48px;
    margin-bottom: 0;
  }

  .left-wrap {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .reward-banner {
    position: relative;
    z-index: 5;
    background: #f5a623;
    color: #2c1600;
    font-weight: 800;
    font-size: 30px;
    padding: 16px 48px;
    border-radius: 100px;
    box-shadow: 0 4px 14px rgba(245, 166, 35, 0.45);
    margin-bottom: -24px;
    white-space: nowrap;
  }

  .left-card {
    position: relative;
    width: 100%;
    background: #fef8e8;
    border-radius: 28px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 650px;
    overflow: hidden;
  }

  /* cert-wrapper: always matches the certificate image dimensions */
  .cert-wrapper {
    position: relative;
    width: 100%;
    line-height: 0; /* remove inline gap below image */
  }

  .youdidit-img {
    width: 100%;
    display: block;
    height: auto;
  }

  /* Badge locked to the coin circle — % relative to cert-wrapper = % of image */
  .coin-badge {
    position: absolute;
    top: 13%;        /* coin circle vertical center in the image */
    left: 40%;       /* coin circle horizontal center in the image */
    transform: translate(-50%, -50%);
    width: 34%;      /* badge is ~34% of the image width */
    height: auto;
    border-radius: 50%;
    filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28));
    animation: popIn 0.6s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    z-index: 30;
  }

  .coin-badge.glow {
    animation:
      popIn 0.6s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both,
      badgeGlow 2s 1s ease-in-out infinite alternate;
  }

  .right-card {
    flex: 1;
    background: #fff;
    border: 3px solid #f5a623;
    border-radius: 24px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    padding: 24px 32px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-self: flex-start;
    margin-top: 20px;
    max-height: calc(100vh - 145px);
    box-sizing: border-box;
  }

  .level-tag {
    display: inline-block;
    align-self: flex-start;
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    border-radius: 999px;
    padding: 6px 18px;
    box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
  }

  h1 {
    font-size: clamp(24px, 2.8vw, 36px);
    font-weight: 900;
    color: #c0392b;
    margin: 0;
    line-height: 1.2;
  }

  .kiki-says {
    font-size: clamp(16px, 1.8vw, 20px);
    font-weight: 700;
    color: #1e6e40;
    margin: 0;
  }

  .learned-title {
    margin: 0;
    font-size: clamp(14px, 1.5vw, 18px);
    font-weight: 900;
    color: #78350f;
  }

  .stats {
    display: flex;
    flex-direction: column;
    border-top: 1.5px dashed #ddd;
    flex: 1;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px 0;
    border-bottom: 1.5px dashed #ddd;
    animation: fadeIn 0.4s ease both;
  }

  .stat-label {
    font-size: clamp(15px, 1.7vw, 20px);
    color: #555;
    font-weight: 500;
  }

  .badge-pill {
    background: linear-gradient(180deg, #fde68a, #f59e0b);
    border-radius: 14px;
    padding: 12px 18px;
    text-align: center;
    font-size: clamp(15px, 1.6vw, 19px);
    font-weight: 900;
    color: #78350f;
    box-shadow: 0 3px 10px rgba(245, 158, 11, 0.35);
  }

  .hint-box {
    background: #e8f8f0;
    border-radius: 14px;
    padding: 12px 18px;
    font-size: clamp(13px, 1.4vw, 16px);
    color: #1e6e40;
    line-height: 1.35;
  }

  .hint-box b {
    color: #155d34;
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    padding: 8px 24px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 13px 26px;
    font-family: inherit;
    font-size: clamp(14px, 1.5vw, 17px);
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transition:
      transform 0.12s,
      box-shadow 0.12s;
    white-space: nowrap;
  }

  .pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  }

  .btn-read {
    background: #fff;
    color: #2255cc;
  }

  .btn-show {
    background: linear-gradient(180deg, #818cf8, #4f46e5);
    color: #fff;
  }

  .btn-done {
    background: #f5a623;
    color: #2c1600;
    font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.25s ease;
  }

  .modal-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background: #fff;
    border-radius: 28px;
    padding: 36px 40px;
    max-width: 440px;
    width: 90%;
    position: relative;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 18px;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 50%;
    background: #ffffff;
    color: #374151;
    font-size: 22px;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: #fef3c7;
    color: #92400e;
    transform: scale(1.05);
  }

  .modal-title {
    margin: 0;
    font-size: clamp(22px, 3vmin, 30px);
    font-weight: 900;
    color: #15803d;
  }

  .modal-badge-name {
    margin: 0;
    font-size: clamp(16px, 2vmin, 20px);
    font-weight: 800;
    color: #78350f;
    text-align: center;
  }

  .modal-badge {
    width: clamp(140px, 28vmin, 220px);
    height: auto;
    filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.3));
    animation: popIn 0.5s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .modal-badge.shimmer {
    animation:
      popIn 0.5s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both,
      badgeGlow 1.8s 1s ease-in-out infinite alternate;
  }

  .modal-desc {
    margin: 0;
    font-size: clamp(13px, 1.6vmin, 15px);
    font-weight: 600;
    color: #4b5563;
    text-align: center;
    line-height: 1.5;
  }

  .back-map-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s;
  }

  .back-map-btn:hover {
    transform: translateY(-3px) scale(1.03);
  }

  .back-map-img {
    width: clamp(200px, 40vmin, 300px);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35));
  }

  @keyframes badgeGlow {
    from {
      filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.35));
    }

    to {
      filter:
        drop-shadow(0 0 22px rgba(245, 158, 11, 0.85))
        drop-shadow(0 4px 14px rgba(0, 0, 0, 0.3));
    }
  }

  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.7);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: none;
    }
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

  /* ── Responsive: stack to single column on narrow / short screens ── */
  @media (max-width: 860px), (max-height: 650px) {
    /* Stack vertically so full certificate is always visible */
    .cards-row {
      flex-direction: column;
      height: auto;
      overflow-y: auto;
      margin-top: 24px;
      gap: 16px;
      width: 96%;
      padding-bottom: 100px;
      box-sizing: border-box;
    }
    .left-wrap { width: 100%; }

    /* Let the card grow naturally with the image — no fixed height */
    .left-card {
      min-height: 0;
      height: auto;
      overflow: visible;
    }

    /* Certificate image fills the card width, shows fully */
    .youdidit-img {
      width: 100%;
      max-width: 100%;
      height: auto;
      display: block;
    }

    .reward-banner {
      font-size: clamp(16px, 3vw, 22px);
      padding: 10px 24px;
      margin-bottom: -16px;
    }

    /* Summary card full width, scrollable */
    .right-card {
      width: 100%;
      flex: none;
      max-height: none;
      margin-top: 0;
      padding: 18px 20px;
      box-sizing: border-box;
    }
    h1 { font-size: clamp(20px, 5vw, 30px); }
    .kiki-says { font-size: clamp(14px, 3vw, 18px); }
    .stat-label { font-size: clamp(13px, 3vw, 17px); }
    .badge-pill { font-size: clamp(13px, 3vw, 17px); }
  }

</style>