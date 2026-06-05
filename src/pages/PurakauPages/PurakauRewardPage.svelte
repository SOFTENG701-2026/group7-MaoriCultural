<!-- Purākau Module — Reward Page
     Structure copied from TikangaRewardPage. Content adapted for Pūrākau:
     top-left ← Map button, bottom-left ← Book, centre ReadToMe,
     bottom-right Show Badge, modal with badge card + Back-to-Map. -->
<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { purakauState } from '../../lib/purakauState.svelte'
  import { progress } from '../../lib/progress.svelte'
  import { STORIES, storyById } from './stories'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  import beginnerBadge  from '../../assets/badges/Purakau badge for beginners.png'
  import confidentBadge from '../../assets/badges/purakau badge for confident.png'
  import backToMap      from '../../assets/quiz-page/badgebacktomap.png'

  interface Props {
    onMap: () => void
  }
  let { onMap }: Props = $props()

  let showModal = $state(false)

  const playableCount = STORIES.filter(s => !s.comingSoon).length
  const totalCount    = STORIES.length

  const levelBadge = $derived(
    purakauState.completedCount >= playableCount && playableCount >= 3
      ? confidentBadge
      : beginnerBadge
  )

  const badgeLabel = $derived(
    purakauState.completedCount >= playableCount && playableCount >= 3
      ? 'Navigator Badge'
      : 'Explorer Badge'
  )

  // The story just finished (set by completeActiveStory, not yet consumed by the
  // storybook) so the per-story counts are accurate for any pūrākau.
  const lastStory = $derived(storyById(purakauState.justColoredStoryId))

  const stats = $derived([
    { label: 'Stories completed', value: `${purakauState.completedCount} / ${totalCount}` },
    { label: 'Scenes explored',   value: `${lastStory?.scenes.length ?? 5}` },
    { label: 'Quiz answered',     value: `${lastStory?.quiz.length ?? 3}`  },
  ])

  const readText = $derived(
    'Pūrākau complete! ' +
    stats.map(s => `${s.label}: ${s.value}.`).join(' ') +
    ` Your badge: ${badgeLabel}. Tap Show Badge to collect it!`
  )

  function handleDone() {
    showModal = true
  }

  function goToMap() {
    progress.markComplete('purakau')
    try {
      const BADGE_KEY = 'mca-purakau-badge'
      const level = purakauState.completedCount >= 3 ? 'confident' : 'beginner'
      sessionStorage.setItem(BADGE_KEY, level)
      const prev = localStorage.getItem(BADGE_KEY)
      if (prev !== 'confident' || level !== 'beginner') {
        localStorage.setItem(BADGE_KEY, level)
      }
    } catch { /* storage unavailable */ }
    onMap()
  }
</script>

<div class="page">
  <div class="bg" aria-hidden="true"></div>

  <!-- Top-left: back to map (matches Tikanga's map-btn) -->
  <button class="map-btn" onclick={goToMap} aria-label="Back to home map">
    ← Map
  </button>

  <div class="deco" aria-hidden="true">🌿 ✨ 🎉 ⭐</div>

  <!-- Two-card layout (TikangaRewardPage structure) -->
  <div class="cards-row">

    <!-- Left: badge card with the level badge overlaid -->
    <div class="left-wrap">
      <div class="reward-badge">🎉 Reward time!</div>
      <div class="card-img-wrap">
        <div class="badge-card">
          <!-- Plain card — no decorative overlay, just the badge image enlarged -->
        </div>
        <img src={levelBadge} alt={badgeLabel} class="badge-img" />
      </div>
    </div>

    <!-- Right: stats -->
    <div class="right-card">
      <h1>⭐ Pūrākau complete!</h1>

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
      </div>
    </div>

  </div>

  <!-- Badge modal (TikangaRewardPage structure) -->
  {#if showModal}
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Badge earned">
      <div class="modal-content">
        <div class="badge-card-wrap">
          <div class="modal-badge-card">
          </div>
          <img src={levelBadge} alt="" class="award-overlay" aria-hidden="true" />
        </div>
        <button class="back-map-btn" onclick={goToMap} aria-label="Back to the map">
          <img src={backToMap} alt="Back to the map" class="back-map-img" />
        </button>
      </div>
    </div>
  {/if}

  <nav class="bottom-nav">
    <button class="pill ghost" onclick={() => push('/purakau')}>← Book</button>
    <ReadToMe text={readText} />
    <button class="pill btn-done" onclick={handleDone}>Show Badge</button>
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
    background: linear-gradient(170deg, #1a6b8a 0%, #2e8fb5 25%, #f39c12 60%, #f5d76e 100%);
  }

  .map-btn {
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
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
    cursor: pointer;
    transition: transform 0.12s;
  }
  .map-btn:hover { transform: translateY(-2px); }

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

  /* Badge card + enlarged badge image */
  .card-img-wrap {
    position: relative;
    width: 100%;
    max-width: 460px;
    animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
  }

  .badge-card {
    width: 100%;
    aspect-ratio: 1 / 1.1;
    background: linear-gradient(160deg, #fef8e8, #f5e6c8);
    border-radius: 28px;
    border: 4px solid #c89255;
    box-shadow: 0 12px 36px rgba(0,0,0,.22);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Enlarged badge — the main visual, centered on the card */
  .badge-img {
    position: absolute;
    inset: 8%;
    width: 84%;
    height: 84%;
    object-fit: contain;
    filter: drop-shadow(0 6px 18px rgba(0,0,0,.35));
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
    color: #1a6b8a;
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
    background: #e8f4f8;
    border-radius: 14px;
    padding: 16px 20px;
    font-size: 16px;
    color: #1a5a70;
    line-height: 1.6;
  }
  .hint-box b { color: #1a6b8a; }

  /* ── Modal ── */
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

  .modal-badge-card {
    width: 100%;
    aspect-ratio: 1 / 1.1;
    background: linear-gradient(160deg, #fef8e8, #f5e6c8);
    border-radius: 28px;
    border: 4px solid #c89255;
    box-shadow: 0 12px 36px rgba(0,0,0,.4);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .award-overlay {
    position: absolute;
    inset: 6%;
    width: 88%;
    height: 88%;
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
    gap: 12px;
  }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 14px 28px;
    font-family: inherit;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    outline: none;
    box-shadow: 0 4px 12px rgba(0,0,0,.22);
    transition: transform .12s, box-shadow .12s;
    white-space: nowrap;
  }
  .pill:hover  { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.28); }
  .pill:active { transform: translateY(0); }
  .pill:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }

  .ghost { background: #fff; color: #333; }

  .btn-done {
    background: linear-gradient(180deg, #ffd24a, #f5a623);
    color: #2c1600;
    font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(245,166,35,.35); }
    50%       { transform: scale(1.06); box-shadow: 0 8px 24px rgba(245,166,35,.6);  }
  }
</style>
