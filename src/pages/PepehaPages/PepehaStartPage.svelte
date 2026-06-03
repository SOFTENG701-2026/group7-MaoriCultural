<!--
  Pepeha Module — Page 1: Meet Kiki

  Page purpose: introduce Kiki, explain the mission, and let the learner choose
  a suitable level. The only interactions are choosing a level or returning to
  the home map. Layout mirrors TikangaStartPage.svelte (title top-center, Kiki
  bubble top-left, level cards centre, Read to me bottom-left); only the
  background image differs. Content follows docs/Pepeha_requirements.md (Page 1).
-->
<script lang="ts">
  import bgImg        from '../../assets/pepeha/transparent_ui_assets/background_scene.png'
  import titleImg     from '../../assets/pepeha/title.png'
  import kikiImg      from '../../assets/kiwihello.png'
  import beginnerImg  from '../../assets/beginner level.png'
  import confidentImg from '../../assets/confident level.png'
  import backToMapBtn from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'
  import settingsImg  from '../../assets/settings.png'

  import { pepehaState, type LearnerLevel } from '../../lib/pepehaState.svelte'
  import { settings } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onNext: () => void
    onMap: () => void
  }
  let { onNext, onMap }: Props = $props()

  const isBeginner = $derived(pepehaState.level === 'beginner')

  function selectLevel(l: LearnerLevel) {
    pepehaState.setLevel(l)
  }

  const readText =
    "Pepeha Adventure. Kia ora! I'm Kiki. Help me finish my pepeha! " +
    'Choose your adventure level. Beginner Level: I am learning pepeha for the first time. ' +
    'Confident Level: I already know some pepeha or te reo Māori. ' +
    'Find my name, mountain, river, and whānau.'
</script>

<div class="stage" style="background-image:url({bgImg})">

  <!-- Back to home — top-left corner -->
  <button class="map-btn" onclick={onMap} aria-label="Back to home map">
    <img src={backToMapBtn} alt="Back to Map" />
  </button>

  <!-- Settings — top-right corner -->
  <button class="settings-btn" onclick={() => (settings.open = true)} aria-label="Settings">
    <img src={settingsImg} alt="Settings" />
  </button>

  <!-- ① Title — top-center -->
  <img src={titleImg} alt="Pepeha Adventure" class="title-img" />

  <!-- ② Kiki + speech bubble — top-left -->
  <div class="kiki-block">
    <div class="bubble">
      <p class="bubble-greeting">Kia ora! I'm Kiki. Help me finish my pepeha!</p>
      <p class="bubble-mission">🎯 Find my name, mountain, river, and whānau.</p>
    </div>
    <img src={kikiImg} alt="Kiki the kiwi" class="kiki-img" />
  </div>

  <!-- ③ Level selector — centre -->
  <section class="centre" aria-label="Choose your adventure level">
    <p class="choose-label">Choose your adventure level:</p>
    <div class="level-row">

      <button
        class="level-card"
        class:selected={isBeginner}
        onclick={() => selectLevel('beginner')}
        aria-pressed={isBeginner}
      >
        <div class="card-top">
          <span class="card-icon">⭐</span>
          <p class="card-desc">I am learning pepeha for the first time.</p>
        </div>
        <img src={beginnerImg} alt="Beginner Level" class="card-img" />
      </button>

      <button
        class="level-card"
        class:selected={!isBeginner}
        onclick={() => selectLevel('confident')}
        aria-pressed={!isBeginner}
      >
        <div class="card-top">
          <span class="card-icon">🌟</span>
          <p class="card-desc">I already know some pepeha or te reo Māori.</p>
        </div>
        <img src={confidentImg} alt="Confident Level" class="card-img" />
      </button>

    </div>
  </section>

  <!-- ④ Start Adventure — bottom-center -->
  <button class="start-btn" onclick={onNext} aria-label="Start the adventure">
    Start Adventure →
  </button>

  <!-- ⑤ Bottom-left: Read to me -->
  <nav class="bottom-left-nav">
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

  /* Back to home — top-left corner */
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

  /* Settings — top-right corner */
  .settings-btn {
    position: absolute;
    top: 3%;
    right: 2%;
    z-index: 40;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .settings-btn:hover  { transform: translateY(-3px) scale(1.04); }
  .settings-btn:active { transform: scale(0.97); }
  .settings-btn img {
    width: min(90px, 11.25vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
  }

  /* ① Big title — top-center */
  .title-img {
    position: absolute;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    width: min(655px, 66vw);
    height: auto;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
    pointer-events: none;
  }

  /* ② Kiki + bubble — top-left (below the back button) */
  .kiki-block {
    position: absolute;
    top: 34%;
    left: 2%;
    z-index: 25;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(300px, 28vw);
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
  .kiki-img {
    width: min(180px, 18vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 14px rgba(0,0,0,0.28));
  }

  /* ③ Level selector — centre */
  .centre {
    position: absolute;
    top: 52%;
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

  /* ④ Start Adventure — bottom-center */
  .start-btn {
    position: absolute;
    bottom: 6%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    font-family: inherit;
    font-size: clamp(18px, 2.4vw, 26px);
    font-weight: 900;
    color: #4a2e10;
    padding: 16px 40px;
    border: none;
    border-radius: 999px;
    background: linear-gradient(180deg, #ffd54a 0%, #f5a623 100%);
    box-shadow: 0 6px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.5);
    cursor: pointer;
    animation: breathe 2s ease-in-out infinite;
  }
  .start-btn:hover  { transform: translateX(-50%) translateY(-4px) scale(1.04); animation: none; }
  .start-btn:active { transform: translateX(-50%) scale(0.97); animation: none; }
  @keyframes breathe {
    0%, 100% { transform: translateX(-50%) scale(1);    box-shadow: 0 6px 16px rgba(245,166,35,0.5), inset 0 2px 0 rgba(255,255,255,0.5); }
    50%      { transform: translateX(-50%) scale(1.05); box-shadow: 0 10px 24px rgba(245,166,35,0.85), inset 0 2px 0 rgba(255,255,255,0.5); }
  }

  /* ⑤ Bottom-left nav */
  .bottom-left-nav {
    position: absolute;
    bottom: 3%;
    left: 2%;
    z-index: 30;
    display: flex;
    gap: 10px;
    align-items: center;
  }
</style>