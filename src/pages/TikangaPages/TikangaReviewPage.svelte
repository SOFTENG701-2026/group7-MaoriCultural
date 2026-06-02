<!-- Tikanga Module — Page 7: Review (all stations complete) -->
<script lang="ts">
  import greyMapImg from '../../assets/tikanga/p1全灰小地图.png'
  import kiwiYes    from '../../assets/tikanga/kiwiyes.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const summaries = [
    { station: 'Station 1 — Entrance',      icon: '🚪', text: 'You waited respectfully at the entrance.' },
    { station: 'Station 2 — Welcome Area',  icon: '🤝', text: 'You greeted with a hongi.' },
    { station: 'Station 3 — Wharenui',      icon: '🏠', text: 'You removed your shoes and spoke quietly.' },
    { station: 'Station 4 — Kai & Care',    icon: '🍽️', text: 'You waited for karakia and helped clean up.' },
  ]

  const termCards = [
    { term: 'Tikanga',       meaning: 'The right way of doing things' },
    { term: 'Tangata whenua',meaning: 'The people of the land' },
    { term: 'Manaakitanga',  meaning: 'Showing kindness and hospitality' },
    { term: 'Kaitiakitanga', meaning: 'Guardianship of people and environment' },
  ]

  const readText = 'Marae visit complete! Station 1: you waited at the entrance. Station 2: you greeted with a hongi. Station 3: you removed your shoes and spoke quietly. Station 4: you waited for karakia and helped clean up.'
</script>

<div class="page">
  <div class="bg" aria-hidden="true"></div>

  <button class="pill btn-back" onclick={onBack}>← Back</button>

  <div class="content">

    <!-- Marae map with complete overlay -->
    <div class="map-complete-wrap">
      <img src={greyMapImg} alt="Marae Visit Map" class="map-img" />
      <div class="map-complete-badge">Marae Visit Complete! ✓</div>
    </div>

    <img src={kiwiYes} alt="Kiwi celebrating" class="kiwi-img" />

    <!-- Station summaries -->
    <div class="summaries">
      {#each summaries as s, i}
        <div class="summary-card station-complete" style="animation-delay:{i * 0.1}s">
          <span class="s-icon">{s.icon}</span>
          <div class="s-text">
            <span class="s-station">{s.station}</span>
            <span class="s-desc">{s.text}</span>
          </div>
          <span class="s-tick">✓</span>
        </div>
      {/each}
    </div>

    <!-- Confident extra: Māori term cards -->
    {#if tikangaState.level === 'confident'}
      <div class="terms-section fade-in">
        <h3>Māori words you learned:</h3>
        <div class="terms-grid">
          {#each termCards as t}
            <div class="term-card">
              <span class="term-word">{t.term}</span>
              <span class="term-meaning">{t.meaning}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

  </div>

  <nav class="bottom-nav">
    <button class="pill btn-back-bottom" onclick={onBack}>← Back</button>
    <ReadToMe text={readText} />
    <button class="pill btn-next" onclick={onNext}>Collect badge →</button>
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
    padding: 70px 16px 120px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: linear-gradient(160deg, #0a3d5a 0%, #1a6b8a 40%, #2ab0c8 70%, #7ddfe8 100%);
  }

  .btn-back {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
  }

  .content {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  /* Map */
  .map-complete-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  .map-img {
    width: min(220px, 32vw);
    height: auto;
    filter: drop-shadow(0 6px 16px rgba(0,0,0,.3));
  }
  .map-complete-badge {
    background: #F5A623;
    color: #2c1600;
    font-weight: 900;
    font-size: clamp(14px, 2vw, 20px);
    padding: 8px 24px;
    border-radius: 100px;
    box-shadow: 0 4px 14px rgba(245,166,35,.5);
    margin-top: -12px;
    position: relative;
    z-index: 5;
  }

  .kiwi-img {
    width: min(100px, 16vw);
    height: auto;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.2));
    animation: bounce .7s ease-in-out;
  }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }

  /* Station summaries */
  .summaries {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .summary-card {
    background: rgba(255,255,255,.95);
    border: 2.5px solid #4caf50;
    border-radius: 16px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 4px 14px rgba(0,0,0,.1);
  }

  .s-icon { font-size: 28px; flex-shrink: 0; }

  .s-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .s-station { font-size: 14px; font-weight: 800; color: #2e7d32; }
  .s-desc    { font-size: 15px; font-weight: 600; color: #2c2c2c; line-height: 1.3; }

  .s-tick { font-size: 24px; color: #4caf50; font-weight: 900; flex-shrink: 0; }

  /* Term cards (confident only) */
  .terms-section { width: 100%; }
  .terms-section h3 {
    color: #fff;
    font-size: 18px;
    font-weight: 800;
    margin: 0 0 12px;
    text-shadow: 0 2px 6px rgba(0,0,0,.3);
    text-align: center;
  }
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .term-card {
    background: rgba(255,255,255,.96);
    border: 2.5px solid #F5A623;
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    box-shadow: 0 4px 14px rgba(0,0,0,.12);
  }
  .term-word    { font-size: 17px; font-weight: 900; color: #7a4200; }
  .term-meaning { font-size: 14px; font-weight: 600; color: #3a2200; line-height: 1.4; }

  .bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 30;
    padding: 10px 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 14px 30px;
    font-family: inherit;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,.22);
    transition: transform .12s, box-shadow .12s;
    white-space: nowrap;
    outline: none;
  }
  .pill:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.28); }

  .btn-back, .btn-back-bottom { background: #fff; color: #333; }

  .btn-next {
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }
  @keyframes breathe {
    0%,100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(245,166,35,.35); }
    50%      { transform: scale(1.05); box-shadow: 0 8px 24px rgba(245,166,35,.6);  }
  }
</style>
