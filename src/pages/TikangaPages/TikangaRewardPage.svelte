<!-- Tikanga Module — Page 8: Reward -->
<script lang="ts">
  import badgeCard      from '../../assets/tikanga/p8 badge card.png'
  import beginnerBadge  from '../../assets/tikanga/p8 tikanga badge for beginners.png'
  import confidentBadge from '../../assets/tikanga/p8 tikanga badge for confident.png'
  import backToMap      from '../../assets/quiz-page/badgebacktomap.png'
  import backToMapImg   from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { progress } from '../../lib/progress.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onMap: () => void
  }
  let { onMap }: Props = $props()

  let showModal = $state(false)

  const levelBadge = $derived(
    tikangaState.level === 'confident' ? confidentBadge : beginnerBadge
  )

  const badgeLabel = $derived(
    tikangaState.level === 'confident' ? 'Navigator Badge' : 'Explorer Badge'
  )

  const stats = $derived([
    { label: 'Stations visited', value: '4 / 4' },
    { label: 'Tikanga learned',  value: '4'     },
    { label: 'Level',            value: tikangaState.level === 'confident' ? 'Confident' : 'Beginner' },
  ])

  const readText = $derived(
    `Tikanga complete! You visited 4 marae stations and learned 4 tikanga. You earned the ${badgeLabel}! Tap Done to collect your badge.`
  )

  function handleDone() {
    progress.markComplete('tikanga')
    tikangaState.reset()
    showModal = true
  }

  function goToMap() {
    onMap()
  }
</script>

<div class="page">
  <div class="bg" aria-hidden="true"></div>

  <button class="map-btn" onclick={goToMap} aria-label="Back to home map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>
  <div class="deco" aria-hidden="true">🌿 ✨ 🎉 ⭐</div>

  <!-- Two-card layout -->
  <div class="cards-row">

    <!-- Left: badge card with the level badge overlaid on the coin -->
    <div class="left-wrap">
      <div class="reward-badge">Reward time!</div>
      <div class="card-img-wrap">
        <img src={badgeCard} alt="Tikanga badge earned" class="card-img" />
        <img src={levelBadge} alt={badgeLabel} class="coin-overlay" />
      </div>
    </div>

    <!-- Right: stats -->
    <div class="right-card">
      <h1>⭐ Tikanga complete!</h1>

      <div class="stats">
        {#each stats as s, i}
          <div class="stat-row" style:animation-delay="{i * 0.1}s">
            <span class="stat-label">{s.label}</span>
            <span class="stat-value">{s.value}</span>
          </div>
        {/each}
      </div>

      <div class="hint-box">
        <b>Your badge:</b> {badgeLabel}<br>
        <b>Next step:</b> Tap Done to collect it!
      </div>
    </div>

  </div>

  <!-- Badge modal -->
  {#if showModal}
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Badge earned">
      <div class="modal-content">
        <div class="badge-card-wrap">
          <img src={badgeCard}  alt="Tikanga badge earned" class="badge-card-img" />
          <img src={levelBadge} alt="" class="award-overlay" aria-hidden="true" />
        </div>
        <button class="back-map-btn" onclick={goToMap} aria-label="Back to the map">
          <img src={backToMap} alt="Back to the map" class="back-map-img" />
        </button>
      </div>
    </div>
  {/if}

  <nav class="bottom-nav">
    <button class="pill btn-done" onclick={handleDone}>Done →</button>
  </nav>
  <nav class="rtm-nav"><ReadToMe text={readText} /></nav>
</div>

<style>
  .page {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Nunito', system-ui, sans-serif;
    overflow-x: hidden;
  }

  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: linear-gradient(170deg, #6a0dad 0%, #9b59b6 25%, #f39c12 60%, #f5d76e 100%);
  }

  .map-btn {
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 50;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .map-btn:hover  { transform: translateY(-3px) scale(1.04); }
  .map-btn:active { transform: scale(0.97); }
  .map-btn img {
    width: min(160px, 16vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
  }

  .deco {
    position: fixed;
    top: 20px;
    right: 24px;
    z-index: 40;
    font-size: 28px;
    letter-spacing: 8px;
    opacity: .85;
  }

  .cards-row {
    position: relative;
    z-index: 20;
    width: 96%;
    max-width: 1400px;
    display: flex;
    align-items: flex-start;
    gap: 24px;
    margin-top: 60px;
    margin-bottom: 100px;
  }

  .left-wrap {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .reward-badge {
    position: relative;
    z-index: 2;
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    font-size: 28px;
    padding: 14px 44px;
    border-radius: 100px;
    box-shadow: 0 4px 14px rgba(245,166,35,.45);
    margin-bottom: -22px;
    white-space: nowrap;
  }

  /* Badge card image + coin overlay */
  .card-img-wrap {
    position: relative;
    width: 100%;
    max-width: 460px;
    animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
  }
  .card-img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 24px;
    filter: drop-shadow(0 10px 30px rgba(0,0,0,.2));
    display: block;
  }
  /* The level badge sits over the coin in the card art */
  .coin-overlay {
    position: absolute;
    top: 12.5%;
    left: 37%;
    width: 38%;
    height: auto;
    object-fit: contain;
    border-radius: 50%;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.35));
    animation: popIn .55s .15s cubic-bezier(.34,1.56,.64,1) both;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  .right-card {
    flex: 1;
    background: #fff;
    border: 3px solid #F5A623;
    border-radius: 24px;
    box-shadow: 0 8px 30px rgba(0,0,0,.12);
    padding: 34px 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-sizing: border-box;
    align-self: flex-start;
    margin-top: 62px;
  }

  h1 {
    font-size: clamp(22px, 2.6vw, 34px);
    font-weight: 900;
    color: #6a0dad;
    margin: 0;
    line-height: 1.2;
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
    padding: 20px 0;
    border-bottom: 1.5px dashed #ddd;
    animation: fadeIn .4s ease both;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .stat-label { font-size: 18px; color: #555; font-weight: 500; }
  .stat-value { font-size: 20px; font-weight: 800; color: #27ae60; }

  .hint-box {
    background: #f3e8ff;
    border-radius: 14px;
    padding: 16px 20px;
    font-size: 16px;
    color: #4a1080;
    line-height: 1.6;
  }
  .hint-box b { color: #6a0dad; }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0,0,0,.55);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    animation: fadeIn .25s ease both;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }

  .badge-card-wrap {
    position: relative;
    width: min(460px, 85vw);
    animation: popIn .4s cubic-bezier(.34,1.56,.64,1) both;
  }

  .badge-card-img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 24px;
    filter: drop-shadow(0 12px 32px rgba(0,0,0,.4));
    display: block;
  }

  .award-overlay {
    position: absolute;
    top: 12.5%;
    left: 37%;
    width: 38%;
    height: auto;
    object-fit: contain;
    border-radius: 50%;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
    pointer-events: none;
  }

  .back-map-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    animation: popIn .4s .1s cubic-bezier(.34,1.56,.64,1) both;
    transition: transform .12s, filter .12s;
  }
  .back-map-btn:hover  { transform: translateY(-3px) scale(1.03); }
  .back-map-btn:active { transform: translateY(0) scale(1); }

  .back-map-img {
    width: min(320px, 70vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 16px rgba(0,0,0,.35));
  }

  .bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 30;
    padding: 12px 24px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 16px 36px;
    font-family: inherit;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    box-shadow: 0 4px 12px rgba(0,0,0,.22);
    transition: transform .12s, box-shadow .12s;
    white-space: nowrap;
  }
  .pill:hover  { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.28); }
  .pill:active { transform: translateY(0); }

  .btn-done {
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(245,166,35,.35); }
    50%       { transform: scale(1.06); box-shadow: 0 8px 24px rgba(245,166,35,.6);  }
  }
  .rtm-nav { position: fixed; bottom: 18px; left: 18px; z-index: 50; }
</style>
