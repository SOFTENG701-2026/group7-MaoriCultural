<!-- Tikanga Module — Page 1: Start / Level Select -->
<script lang="ts">
  import bgImg        from '../../assets/tikanga/p1 background.png'
  import titleImg     from '../../assets/tikanga/p1 title.png'
  import mapTitleImg  from '../../assets/tikanga/p1 Marae visit map title.png'
  import beginnerImg  from '../../assets/tikanga/beginner level.png'
  import confidentImg from '../../assets/tikanga/confident level.png'
  import greyMapImg   from '../../assets/tikanga/p1全灰小地图.png'
  import bubbleImg    from '../../assets/tikanga/p1 kiki word bubble.png'
  import startBtn     from '../../assets/tikanga/p1 start visit.png'
  import backToMapImg from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'

  import { tikangaState, type LearnerLevel } from '../../lib/tikangaState.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onNext: () => void
    onMap: () => void
  }
  let { onNext, onMap }: Props = $props()

  // Fixed bubble text — always the same greeting on the left
  const bubbleText = 'Kia ora! I am visiting a marae. Help me make respectful choices.'

  // Level description shown near the centre buttons
  const levelDesc = $derived(
    tikangaState.level === 'beginner'
      ? 'I am learning about marae and tikanga for the first time.'
      : 'I have seen or learned some marae tikanga before.'
  )

  const readText = $derived(
    `Kia ora! I am visiting a marae. Choose your visit level. ${levelDesc}`
  )

  function selectLevel(l: LearnerLevel) {
    tikangaState.setLevel(l)
  }

  function handleStart() {
    tikangaState.reset()
    onNext()
  }
</script>

<div class="stage" style="background-image:url({bgImg})">

  <!-- Back to home — top-left corner (matches Pepeha page 1) -->
  <button class="map-btn" onclick={onMap} aria-label="Back to home map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>

  <!-- ① Title — large, top-center -->
  <img src={titleImg} alt="Kiki's First Marae Visit" class="title-img" />

  <!-- ② Kiki speech bubble — top-left, above the child's head -->
  <div class="bubble-wrap">
    <img src={bubbleImg} alt="" class="bubble-img" aria-hidden="true" />
  </div>

  <!-- ③ Map — bottom-right, smaller, no title -->
  <div class="map-block">
    <img src={greyMapImg} alt="Marae Visit Map — 4 stations" class="map-img" />
  </div>

  <!-- ④ Level selector — centre of screen -->
  <div class="centre">
    <p class="choose-label">Choose your visit level:</p>
    <div class="level-row">

      <!-- Beginner card: description top, button image bottom -->
      <button
        class="level-card"
        class:selected={tikangaState.level === 'beginner'}
        onclick={() => selectLevel('beginner')}
        aria-pressed={tikangaState.level === 'beginner'}
      >
        <div class="card-top">
          <span class="card-icon">⭐</span>
          <p class="card-desc">I am learning about marae and tikanga for the first time.</p>
        </div>
        <img src={beginnerImg} alt="Beginner Level" class="card-img" />
      </button>

      <!-- Confident card: description top, button image bottom -->
      <button
        class="level-card"
        class:selected={tikangaState.level === 'confident'}
        onclick={() => selectLevel('confident')}
        aria-pressed={tikangaState.level === 'confident'}
      >
        <div class="card-top">
          <span class="card-icon">🌟</span>
          <p class="card-desc">I have seen or learned some marae tikanga before.</p>
        </div>
        <img src={confidentImg} alt="Confident Level" class="card-img" />
      </button>

    </div>
  </div>

  <!-- ⑤ Start Visit button — bottom-center -->
  <button class="start-btn" onclick={handleStart} aria-label="Start the marae visit">
    <img src={startBtn} alt="Start Visit →" />
  </button>

  <!-- ⑥ Bottom-left: Read to me -->
  <nav class="rtm-nav">
    <ReadToMe text={readText} />
  </nav>

</div>

<style>
  .stage {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'Nunito', system-ui, sans-serif;
    overflow: hidden;
    user-select: none;
  }

  /* Back to home — top-left corner (matches Pepeha page 1) */
  .map-btn {
    position: absolute;
    top: 3%;
    left: 2%;
    z-index: 40;
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

  /* ① Big title — top-center, enlarged */
  .title-img {
    position: absolute;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    width: min(580px, 52vw);
    height: auto;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
    pointer-events: none;
  }

  /* ② Kiki bubble — shifted right +20px, down +40px */
  .bubble-wrap {
    position: absolute;
    top: calc(4% + 40px);
    left: calc(1% + 20px);
    z-index: 30;
    width: min(310px, 28vw);
  }
  .bubble-img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
  }

  /* ③ Map block */
  .map-block {
    position: absolute;
    bottom: 10%;
    right: 2%;
    z-index: 30;
    width: min(300px, 27vw);
  }
  .map-img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 6px 16px rgba(0,0,0,0.3));
    border-radius: 12px;
  }

  /* ④ Level selector — moved up 20px */
  .centre {
    position: absolute;
    top: calc(52% - 20px);
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .choose-label {
    margin: 0;
    font-size: clamp(18px, 2.2vw, 26px);
    font-weight: 900;
    color: #1a5c00;
    text-shadow: 0 2px 8px rgba(255,255,255,0.8);
    letter-spacing: 0.3px;
  }

  .level-row {
    display: flex;
    gap: 24px;
    justify-content: center;
    align-items: stretch;
  }

  /* Each level card — enlarged */
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
  /* Selected = solid white background */
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

  /* Top section inside card: icon + description text */
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

  /* Level image at bottom of card — enlarged */
  .card-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 14px;
    flex-shrink: 0;
  }

  /* ⑤ Start button — true bottom-center */
  .start-btn {
    position: absolute;
    bottom: 6%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    animation: breathe 2s ease-in-out infinite;
  }
  .start-btn img {
    width: min(300px, 28vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 18px rgba(0,0,0,0.35));
  }
  .start-btn:hover  { transform: translateX(-50%) translateY(-4px) scale(1.04); animation: none; }
  .start-btn:active { transform: translateX(-50%) scale(0.97); animation: none; }

  @keyframes breathe {
    0%, 100% { transform: translateX(-50%) scale(1);    filter: drop-shadow(0 6px 16px rgba(20,150,80,0.5)); }
    50%       { transform: translateX(-50%) scale(1.05); filter: drop-shadow(0 10px 24px rgba(20,150,80,0.8)); }
  }

  /* ⑥ Read to me — bottom-right */
  .rtm-nav {
    position: absolute;
    bottom: 2%;
    left: 2%;
    z-index: 30;
    display: flex;
    gap: 10px;
    align-items: center;
  }
</style>
