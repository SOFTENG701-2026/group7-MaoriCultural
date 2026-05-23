<!-- Grace Liao — FR12: Reward Page -->
<script lang="ts">
  import youDidIt   from '../../../assets/quiz-page/youdidit.png';
  import awardBadge from '../../../assets/Navpage/award-music.png';
  import badgeCard      from '../../../assets/quiz-page/badgecard.png';
  import badgeBackToMap from '../../../assets/quiz-page/badgebacktomap.png';
  import { push } from 'svelte-spa-router';
  import { progress } from '../../../lib/progress.svelte';

  interface Props {
    onMap?: () => void;
  }

  let { onMap = () => push('/') }: Props = $props();

  function goToMap() {
    onMap();
    push('/');
  }

  let showModal = $state(false);

  function handleDone() {
    progress.markComplete('waiata');
    showModal = true;
  }

  const stats = [
    { label: 'Participation', value: 'Joined in'  },
    { label: 'Key word',      value: 'tātou'       },
    { label: 'Meaning',       value: 'Understood'  },
  ];

  function readToMe() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(
        'Waiata complete! You joined in, learned the key word tātou, and understood its meaning. Tap Done to collect your badge.'
      );
      utt.rate = 0.8;
      window.speechSynthesis.speak(utt);
    }
  }
</script>

<div class="page">

  <!-- Gradient background -->
  <div class="bg" aria-hidden="true"></div>

  <!-- Map button: fixed top-left -->
  <button class="pill btn-map" onclick={goToMap}>← Map</button>

  <!-- Decorations top-right -->
  <div class="deco" aria-hidden="true">🎵 🌸 ⭐ ✨</div>

  <!-- Two separate cards -->
  <div class="cards-row">

    <!-- LEFT card (larger) — "Reward time!" badge straddles its top -->
    <div class="left-wrap">
      <div class="reward-badge">Reward time!</div>
      <div class="left-card">
        <img src={youDidIt} alt="You did it!" class="youdidit-img" />
        <!-- Medal badge: top-right corner of the left card -->
        <img src={awardBadge} alt="Waiata badge" class="overlap-badge" />
      </div>
    </div>

    <!-- RIGHT card (smaller) -->
    <div class="right-card">
      <h1>⭐ Waiata complete!</h1>

      <div class="stats">
        {#each stats as s, i}
          <div class="stat-row" style:animation-delay="{i * 0.1}s">
            <span class="stat-label">{s.label}</span>
            <span class="stat-value">{s.value}</span>
          </div>
        {/each}
      </div>

      <div class="hint-box">
        <b>Next step:</b> Tap Done to collect your badge.
      </div>
    </div>

  </div>

  <!-- Badge card modal -->
  {#if showModal}
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Badge earned">
      <div class="modal-content">
        <!-- badgecard with award-music overlaid on the coin -->
        <div class="badge-card-wrap">
          <img src={badgeCard}  alt="Waiata badge earned" class="badge-card-img" />
          <img src={awardBadge} alt=""                    class="award-overlay" aria-hidden="true" />
        </div>
        <!-- badgebacktomap.png as the button -->
        <button class="back-map-btn" onclick={goToMap} aria-label="Back to the map">
          <img src={badgeBackToMap} alt="Back to the map" class="back-map-img" />
        </button>
      </div>
    </div>
  {/if}

  <!-- Bottom nav -->
  <nav class="bottom-nav">
    <button class="pill btn-read" onclick={readToMe}>🔊 Read to me</button>
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
    font-family: 'Nunito', 'Varela Round', system-ui, sans-serif;
    overflow-x: hidden;
  }

  /* Gradient background */
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

  /* ← Map: fixed top-left */
  .btn-map {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
    background: #fff;
    color: #333;
  }

  /* Decorations: fixed top-right */
  .deco {
    position: fixed;
    top: 20px;
    right: 24px;
    z-index: 40;
    font-size: 30px;
    letter-spacing: 10px;
    opacity: .85;
  }

  /* ── Two-card row ── */
  .cards-row {
    position: relative;
    z-index: 20;
    width: 96%;
    max-width: 1500px;
    display: flex;
    align-items: flex-start;
    gap: 24px;
    margin-top: 56px;
    margin-bottom: 100px;
  }

  /* ── LEFT wrap (badge + card) ── */
  .left-wrap {
    flex: 2;                  /* left is larger than right */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  /* "Reward time!" straddles the top of the left card */
  .reward-badge {
    position: relative;
    z-index: 2;
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    font-size: 30px;
    padding: 16px 48px;
    border-radius: 100px;
    box-shadow: 0 4px 14px rgba(245,166,35,.45);
    margin-bottom: -24px;
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
    padding: 0;
    box-sizing: border-box;
    min-height: 560px;
  }

  .youdidit-img {
    width: 100%;
    max-width: 780px;
    height: auto;
    object-fit: contain;
    animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Medal badge: top-right corner of left-card */
  .overlap-badge {
    position: absolute;
    top: -24px;
    right: -24px;
    width: 110px;
    height: 110px;
    object-fit: contain;
    z-index: 30;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
    animation: popIn .55s .1s cubic-bezier(.34,1.56,.64,1) both;
  }

  /* ── RIGHT card ── */
  .right-card {
    flex: 1;                  /* smaller than left */
    background: #fff;
    border: 3px solid #F5A623;
    border-radius: 24px;
    box-shadow: 0 8px 30px rgba(0,0,0,.12);
    padding: 36px 36px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    align-self: flex-start;
    margin-top: 64px;         /* match left card top (reward-badge height ≈ 64px) */
  }

  h1 {
    font-size: clamp(24px, 2.8vw, 36px);
    font-weight: 900;
    color: #c0392b;
    margin: 0;
    line-height: 1.2;
  }

  /* Stats */
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
    padding: 22px 0;
    border-bottom: 1.5px dashed #ddd;
    animation: fadeIn .4s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .stat-label { font-size: 20px; color: #555; font-weight: 500; }
  .stat-value { font-size: 22px; font-weight: 800; color: #27ae60; }

  /* Hint box */
  .hint-box {
    background: #e8f8f0;
    border-radius: 14px;
    padding: 18px 22px;
    font-size: 18px;
    color: #1e6e40;
    line-height: 1.5;
  }
  .hint-box b { color: #155d34; }

  /* ── Badge card modal ── */
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

  /* Card + overlay wrapper */
  .badge-card-wrap {
    position: relative;
    width: min(480px, 88vw);
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

  /* award-music.png overlaid on the coin — top-center area of badgecard */
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

  /* badgebacktomap.png as clickable image button */
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
    width: min(340px, 72vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 16px rgba(0,0,0,.35));
  }

  /* ── Bottom nav ── */
  .bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 30;
    padding: 12px 24px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* ── Pill buttons ── */
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

  .btn-read { background: #fff; color: #2255cc; }

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
