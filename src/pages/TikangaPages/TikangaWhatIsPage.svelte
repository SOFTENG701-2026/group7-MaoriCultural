<!-- Tikanga Module — Page 2: What is Tikanga? -->
<script lang="ts">
  import bgImg     from '../../assets/tikanga/p2 background.png'
  import goalsImg  from '../../assets/tikanga/p2 goals.png'
  import goal1Img  from '../../assets/tikanga/p2 goal 1 listen first (1).png'
  import goal2Img  from '../../assets/tikanga/p2 goal 2.png'
  import goal3Img  from '../../assets/tikanga/p2 goal 3.png'
  import goal4Img  from '../../assets/tikanga/p2 goal 4.png'
  import lockedBtn from '../../assets/tikanga/p2 locked next entrance.png'
  import nextBtn   from '../../assets/tikanga/p2 next entrance.png'

  import { speak, settings } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'
  import backToMapImg from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'
  import settingsImg  from '../../assets/settings.png'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const goals = [
    { img: goal1Img, label: '👂 Listen first',       text: 'Listen first.' },
    { img: goal2Img, label: '👀 Watch and wait',     text: 'Watch and wait.' },
    { img: goal3Img, label: '🏠 Stay calm inside',   text: 'Stay calm inside.' },
    { img: goal4Img, label: '🍽️🌿 Share kai and care', text: 'Share kai and care.' },
  ]

  let clicked = $state<Set<number>>(new Set())
  let glowing = $state<number | null>(null)

  const allClicked = $derived(clicked.size === 4)
  // The Next button only unlocks once all four goals have been tapped.
  const canProceed = $derived(allClicked)

  // Sequential unlock: the first goal is open; each one unlocks the next.
  function isUnlocked(i: number): boolean {
    return i === 0 || clicked.has(i - 1)
  }

  // Read to me speaks exactly what is on screen: title + the four goals.
  const readText = `What is Tikanga? ${goals.map(g => g.text).join(' ')}`

  function clickGoal(i: number) {
    if (!isUnlocked(i)) return        // locked goals can't be opened yet
    clicked = new Set([...clicked, i])
    glowing = i
    speak(goals[i].text)
    setTimeout(() => { glowing = null }, 900)
  }
</script>

<div class="stage" style="background-image:url({bgImg})">

  <!-- Back button — top-left -->
  <button class="map-btn" onclick={onBack} aria-label="Back to map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>

  <!-- Settings — top-right corner (matches Pepeha) -->
  <button class="settings-btn" onclick={() => (settings.open = true)} aria-label="Settings">
    <img src={settingsImg} alt="Settings" />
  </button>

  <!-- Page title -->
  <h1 class="page-title">What is Tikanga?</h1>

  <!-- Progress hint — under the title -->
  {#if !allClicked}
    <p class="hint-text">Tap all 4 goals to continue ({clicked.size}/4)</p>
  {/if}

  <!-- goals-banner wrapper: position:relative so goal-btn children can be absolutely placed on it -->
  <div class="goals-banner">
    <img src={goalsImg} alt="Our goals for this visit" class="goals-banner-img" />

    <!-- goal buttons positioned relative to the banner image -->
    <div class="goals-grid">
      {#each goals as g, i}
        <button
          class="goal-btn"
          data-index={i}
          class:done={clicked.has(i)}
          class:glow={glowing === i}
          class:locked={!isUnlocked(i)}
          onclick={() => clickGoal(i)}
          disabled={!isUnlocked(i)}
          aria-pressed={clicked.has(i)}
          aria-label={isUnlocked(i) ? g.label : `${g.label} (locked)`}
        >
          <img src={g.img} alt={g.label} class="goal-img" />
          {#if clicked.has(i)}
            <span class="done-tick" aria-hidden="true">✓</span>
          {:else if !isUnlocked(i)}
            <span class="lock-tick" aria-hidden="true">🔒</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>


  <!-- Next button image — bottom-centre -->
  <button
    class="next-img-btn"
    onclick={() => { if (canProceed) onNext() }}
    aria-label={canProceed ? 'Next: Station 1 Entrance' : 'Complete all goals to continue'}
    aria-disabled={!canProceed}
  >
    <img src={canProceed ? nextBtn : lockedBtn} alt={canProceed ? 'Next' : 'Locked'} />
  </button>

  <!-- Read to me — bottom-left -->
  <nav class="rtm-nav">
    <ReadToMe text={readText} />
  </nav>

</div>

<style>
  /* Full-screen stage matching Page 1 */
  .stage {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'Nunito', system-ui, sans-serif;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    user-select: none;
  }

  /* Back-to-map image button — fixed top-left */
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

  /* Settings — top-right corner (matches Pepeha) */
  .settings-btn {
    position: fixed;
    top: 3%;
    right: 2%;
    z-index: 50;
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

  /* Page title */
  .page-title {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    margin: 0;
    font-size: clamp(22px, 3vw, 36px);
    font-weight: 900;
    color: #fff;
    text-shadow: 0 3px 10px rgba(0,0,0,0.45);
    white-space: nowrap;
    pointer-events: none;
  }

  /* goals-banner wrapper — relative so goal-btn can be absolute inside */
  .goals-banner {
    position: relative;
    width: min(900px, 90vw);
    margin-top: 56px;
    margin-left: 92px;
    flex-shrink: 0;
  }

  .goals-banner-img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 14px rgba(0,0,0,.3));
  }

  /* 2×2 grid — images only, no card backgrounds */
  .goals-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .goal-btn {
    position: relative;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    transition: transform .15s ease, filter .15s ease;
    border-radius: 16px;
  }
  .goal-btn:hover:not(:disabled) { transform: translateY(-5px) scale(1.04); }
  .goal-btn:active:not(:disabled) { transform: scale(0.97); }
  .goal-btn.done {
    outline: 5px solid #4caf50;
    outline-offset: 3px;
    filter: brightness(1.08) drop-shadow(0 0 14px rgba(76,175,80,.9));
  }
  /* Locked goals — greyed out, not clickable until the previous one is done */
  .goal-btn.locked {
    cursor: not-allowed;
  }
  .goal-btn.locked .goal-img {
    filter: grayscale(1) brightness(.7) drop-shadow(0 4px 12px rgba(0,0,0,.25));
  }

  .goal-img {
    width: min(200px, 22vw);
    height: auto;
    display: block;
    border-radius: 16px;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.25));
  }

  /* Green tick overlay when clicked */
  .done-tick {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 52px;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0,0,0,.5);
    pointer-events: none;
    background: rgba(76,175,80,.75);
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Lock overlay on a locked goal */
  .lock-tick {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    pointer-events: none;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,.5));
  }

  /* Progress hint */
  .hint-text {
    position: fixed;
    top: 62px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    margin: 0;
    color: rgba(255,255,255,.95);
    font-size: 16px;
    font-weight: 800;
    text-shadow: 0 2px 6px rgba(0,0,0,.4);
    white-space: nowrap;
    pointer-events: none;
  }

  /* Next image button — fixed bottom-centre */
  .next-img-btn {
    position: fixed;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: filter .15s;
  }
  .next-img-btn img {
    width: min(300px, 40vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
  }
  .next-img-btn:hover { transform: translateX(-50%) translateY(-3px); }
  .next-img-btn[aria-disabled='true'] { cursor: not-allowed; opacity: .85; }
  .next-img-btn[aria-disabled='true']:hover { transform: translateX(-50%); }

  /* Read to me — fixed bottom-right */
  .rtm-nav {
    position: fixed;
    bottom: 18px;
    left: 18px;
    z-index: 30;
  }

  /* Goal buttons — absolutely placed on the banner image */
  .goal-btn[data-index="0"],
  .goal-btn[data-index="1"],
  .goal-btn[data-index="2"],
  .goal-btn[data-index="3"] {
    position: absolute;
    width: 220px;
    height: 242px;
    border-radius: 50%;
  }
  .goal-btn[data-index="0"] { top: 42px;  left: 380px; }
  .goal-btn[data-index="1"] { top: 42px;  left: 632px; }
  .goal-btn[data-index="2"] { top: 378px; left: 340px; }
  .goal-btn[data-index="3"] { top: 382px; left: 660px; }

  .goal-btn[data-index="0"] .goal-img,
  .goal-btn[data-index="1"] .goal-img,
  .goal-btn[data-index="2"] .goal-img,
  .goal-btn[data-index="3"] .goal-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
