<!-- Tikanga Module — Page 8: Reward -->
<script lang="ts">
  import youDidIt   from '../../assets/tikanga/youdidit.png'
  import awardBadge from '../../assets/Navpage/award-polite.png'
  import badgeCard  from '../../assets/quiz-page/badgecard.png'
  import backToMap  from '../../assets/quiz-page/badgebacktomap.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { progress } from '../../lib/progress.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onMap: () => void
  }
  let { onMap }: Props = $props()

  let showModal = $state(false)

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

  <button class="pill btn-map" onclick={goToMap}>← Map</button>
  <div class="deco" aria-hidden="true">🌿 ✨ 🎉 ⭐</div>

  <!-- Two-card layout -->
  <div class="cards-row">

    <!-- Left: celebration -->
    <div class="left-wrap">
      <div class="reward-badge">Reward time!</div>
      <div class="left-card">
        <img src={youDidIt} alt="You did it!" class="youdidit-img" />
        <img src={awardBadge} alt={badgeLabel} class="overlap-badge" />
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
          <img src={awardBadge} alt="" class="award-overlay" aria-hidden="true" />
        </div>
        <button class="back-map-btn" onclick={goToMap} aria-label="Back to the map">
          <img src={backToMap} alt="Back to the map" class="back-map-img" />
        </button>
      </div>
    </div>
  {/if}

  <nav class="bottom-nav">
    <ReadToMe text={readText} />
    <button class="pill btn-done" onclick={handleDone}>Done →</button>
  </nav>
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

  .btn-map {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
    background: #fff;
    color: #333;
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

  .left-card {
    position: relative;
    width: 100%;
    background: #fef8e8;
    border-radius: 28px;
    box-shadow: 0 8px 30px rgba(0,0,0,.12);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
  }

  .youdidit-img {
    width: 100%;
    max-width: 740px;
    height: auto;
    object-fit: contain;
    animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  .overlap-badge {
    position: absolute;
    top: -24px;
    right: -24px;
    width: 100px;
    height: 100px;
    object-fit: contain;
    z-index: 30;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
    animation: popIn .55s .1s cubic-bezier(.34,1.56,.64,1) both;
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
    top: 11%;
    left: 41%;
    transform: translateX(-10%);
    width: 32%;
    height: auto;
    object-fit: contain;
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
</style>
