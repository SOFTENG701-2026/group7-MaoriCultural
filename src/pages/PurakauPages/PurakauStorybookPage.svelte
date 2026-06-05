<script lang="ts">
  // Step 1 — The Storybook. A flippable book on a wooden table; each spread is
  // one pūrākau with a black-and-white cover (to spark curiosity) and a
  // suspenseful summary. Tapping "Read this story" starts the journey.
  //
  // Step 6 — Completion. When the child returns after finishing a story, this
  // page lands on that story and its cover slowly fills with colour, Kiki gives
  // a wrap-up, and the Hei Matau badge pops in (the module's visible reward).
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { STORIES, isStoryUnlocked, prerequisiteStory } from './stories'
  import { purakauState } from '../../lib/purakauState.svelte'
  import { narrate } from '../../lib/settings.svelte'
  import {
    openBook,
    woodTable,
    arrowLeft,
    arrowRight,
    heiMatau,
    fernLeaf,
    SCENE_IMAGES,
  } from './assets'
  import SceneArt from './components/SceneArt.svelte'

  interface Props {
    onMap?: () => void
    onRead?: (id: string) => void
  }
  let {
    onMap = () => push('/'),
    onRead = (id: string) => {
      purakauState.start(id)
      push('/purakau/play')
    },
  }: Props = $props()

  let bookIdx = $state(0)
  let anim = $state('')

  // Step 6 colour-reveal: set after mount once we know which story just
  // finished, so the CSS filter transition (grayscale → colour) actually plays.
  let justColored = $state<string | null>(null)
  let revealOn = $state(false)

  const story = $derived(STORIES[bookIdx])
  // A coming-soon story has no content and can never be "done" — guard against
  // stale completion ids in localStorage (e.g. a story that was once playable),
  // which would otherwise show a colour cover + green dot for a locked story.
  const done = $derived(purakauState.isComplete(story.id) && !story.comingSoon)
  // The just-finished cover starts grey then turns colour when revealOn flips.
  const coverColored = $derived(done && !(story.id === justColored && !revealOn))
  const celebrating = $derived(justColored !== null && story.id === justColored)
  const storyLocked = $derived(
    !isStoryUnlocked(story.id, (id) => purakauState.isComplete(id)),
  )
  const prereq = $derived(prerequisiteStory(story.id))

  onMount(() => {
    const id = purakauState.consumeJustColored()
    if (id) {
      justColored = id
      const i = STORIES.findIndex((s) => s.id === id)
      if (i >= 0) bookIdx = i
      // Let the grey cover paint first, then animate to colour.
      setTimeout(() => (revealOn = true), 650)
      const s = STORIES.find((x) => x.id === id)
      narrate(
        `Ka rawe! You finished the story of ${s?.teReo ?? 'the pūrākau'}. Look — your storybook page is filling with colour! You earned the Hei Matau badge.`,
      )
    }
  })

  function flip(dir: number) {
    const n = bookIdx + dir
    if (n < 0 || n >= STORIES.length) return
    anim = dir > 0 ? 'in-next' : 'in-prev'
    bookIdx = n
    justColored = null // leaving the celebrated page stops the banner
  }
</script>

<div class="page" style:background-image="url({woodTable})">
  <img class="fern fern-l" src={fernLeaf} alt="" aria-hidden="true" />
  <img class="fern fern-r" src={fernLeaf} alt="" aria-hidden="true" />

  <button class="pill btn-map" onclick={onMap}>← Map</button>

  <header class="head">
    <h1>Ngā Pūrākau</h1>
    <p> </p>
    <p class="sub">Kiki's Book of Māori Stories</p>
  </header>

  <div class="book-row">
    <button
      class="arrow"
      onclick={() => flip(-1)}
      disabled={bookIdx === 0}
      aria-label="Previous story"
    >
      <img src={arrowLeft} alt="" />
    </button>

    <div class="book" style:background-image="url({openBook})">
      {#key bookIdx}
        <div class="spread {anim}">
          <!-- Left page: the cover illustration (B&W until finished) -->
          <div class="left-page">
            <div class="cover-frame" class:colored={coverColored}>
              {#if story.comingSoon}
                <!-- No illustration yet — a plain dark mask keeps the tale a secret -->
                <div class="cover-blank" aria-hidden="true"></div>
              {:else}
                <SceneArt image={SCENE_IMAGES[story.coverImage]} colored={coverColored} animate={coverColored} />
              {/if}
              {#if storyLocked}
                <div class="lock-veil"><span class="lock">🔒</span></div>
              {/if}
            </div>
            {#if done}
              <img
                class="badge-hook"
                class:pop={celebrating && revealOn}
                src={heiMatau}
                alt="Hei Matau badge earned"
              />
            {/if}
          </div>

          <!-- Right page: title, suspense, action -->
          <div class="right-page">
            <p class="eyebrow">{story.teReo}</p>
            <h2>{story.title}</h2>
            <p class="lead summary">{story.summary}</p>

            <div class="action">
              {#if story.comingSoon}
                <span class="soon">🔒 Coming soon</span>
              {:else if storyLocked}
                <span class="soon">🔒 Complete "{prereq?.title ?? 'the previous story'}" first</span>
              {:else if done}
                <span class="done-tag">✓ Story complete</span>
                <button class="cta" onclick={() => onRead(story.id)}>Read again →</button>
              {:else}
                <button class="cta" onclick={() => onRead(story.id)}>Read this story →</button>
              {/if}
            </div>
          </div>
        </div>
      {/key}

      {#if celebrating}
        <div class="confetti" aria-hidden="true">
          <span>🎉</span><span>⭐</span><span>✨</span><span>🌿</span><span>🎉</span>
        </div>
      {/if}
    </div>

    <button
      class="arrow"
      onclick={() => flip(1)}
      disabled={bookIdx === STORIES.length - 1}
      aria-label="Next story"
    >
      <img src={arrowRight} alt="" />
    </button>
  </div>

  <!-- Dots -->
  <div class="dots" role="tablist" aria-label="Stories">
    {#each STORIES as s, i (s.id)}
      <button
        class="dot"
        class:on={i === bookIdx}
        class:complete={purakauState.isComplete(s.id) && !s.comingSoon}
        onclick={() => flip(i - bookIdx)}
        aria-label={`Go to ${s.title}`}
        aria-selected={i === bookIdx}
        role="tab"
      ></button>
    {/each}
  </div>

  {#if celebrating}
    <div class="complete-banner" role="status">
      🪝 Pūrākau complete! You earned the <b>Hei Matau</b> badge.
    </div>
  {/if}
</div>

<style>
  .page {
    position: relative;
    height: 100vh;
    height: 100dvh; /* fit the viewport — book scales so nothing scrolls */
    width: 100%;
    background-size: 480px;
    background-repeat: repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(6px, 1.4vh, 14px);
    font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
    overflow: hidden;
    box-sizing: border-box;
    padding: 12px 12px 14px;
  }
  .page::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(120% 90% at 50% 10%, rgba(255, 240, 200, 0.25), rgba(60, 35, 10, 0.35) 100%);
    pointer-events: none;
    z-index: 0;
  }

  .fern {
    position: fixed;
    bottom: -10px;
    width: min(160px, 20vw);
    opacity: 0.55;
    z-index: 1;
    pointer-events: none;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }
  .fern-l { left: 4px; transform: scaleX(-1); }
  .fern-r { right: 4px; }

  .btn-map {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
    background: #fff;
    color: #333;
  }

  .head { position: relative; z-index: 2; flex: 0 0 auto; text-align: center; margin: 0; }
  .head h1 {
    font-family: 'Fredoka', system-ui, sans-serif;
    font-size: clamp(30px, 5vw, 52px);
    font-weight: 800;
    color: #fff3d6;
    margin: 0;
    text-shadow: 0 3px 0 #5a3210, 0 6px 14px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.5px;
  }
  .sub { margin: 25px 0 0; color: #ffe6b0; font-weight: 600; font-size: clamp(14px, 2vw, 19px); text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); }

  .book-row {
    position: relative;
    z-index: 2;
    flex: 0 1 auto;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(4px, 1.5vw, 18px);
    width: 100%;
    max-width: 1040px;
  }

  .arrow {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: clamp(52px, 7vw, 84px);
    transition: transform 0.14s ease, filter 0.14s ease;
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.4));
  }
  .arrow img { width: 100%; display: block; }
  .arrow:hover:not(:disabled) { transform: scale(1.1); }
  .arrow:active:not(:disabled) { transform: scale(0.96); }
  .arrow:disabled { opacity: 0.3; cursor: default; }
  .arrow:focus-visible { outline: 3px solid #ffe9a8; outline-offset: 3px; border-radius: 14px; }

  .book {
    position: relative;
    flex: 0 1 auto;
    width: 100%;
    /* Cap by the available height so the whole book always fits on screen. */
    max-width: calc((100dvh - 200px) * 1.5);
    aspect-ratio: 384 / 256;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.45));
  }

  .spread { position: absolute; inset: 0; }
  .spread.in-next { animation: pageNext 0.42s ease both; }
  .spread.in-prev { animation: pagePrev 0.42s ease both; }
  @keyframes pageNext { from { opacity: 0; transform: perspective(1400px) rotateY(28deg); transform-origin: left center; } to { opacity: 1; transform: perspective(1400px) rotateY(0); } }
  @keyframes pagePrev { from { opacity: 0; transform: perspective(1400px) rotateY(-28deg); transform-origin: right center; } to { opacity: 1; transform: perspective(1400px) rotateY(0); } }

  .left-page {
    position: absolute;
    top: 12%;
    left: 7.5%;
    width: 37%;
    height: 74%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right-page {
    position: absolute;
    top: 12%;
    right: 7%;
    width: 37%;
    height: 74%;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 0 1%;
  }

  .cover-frame {
    position: relative;
    width: 100%;
    border: 5px solid #b98a4e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
    transition: border-color 1.1s ease, box-shadow 1.1s ease;
  }
  .cover-frame.colored { border-color: #4caf50; box-shadow: 0 8px 22px rgba(76, 175, 80, 0.4); }

  /* Dark grey mask for a not-yet-illustrated (coming-soon) cover. */
  .cover-blank {
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: 8px;
    background: linear-gradient(160deg, #3a3a40, #232327);
  }

  .lock-veil {
    position: absolute;
    inset: 0;
    background: rgba(20, 12, 4, 0.5);
    display: grid;
    place-items: center;
  }
  .lock { font-size: clamp(28px, 6vw, 56px); filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5)); }

  .badge-hook {
    position: absolute;
    bottom: -14px;
    right: -10px;
    width: 26%;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
  }
  .badge-hook.pop { animation: badgePop 0.6s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  @keyframes badgePop { 0% { opacity: 0; transform: scale(0) rotate(-40deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }

  .eyebrow {
    margin: 0;
    color: #8a5a2a;
    font-weight: 800;
    font-size: clamp(11px, 1.6vw, 16px);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .right-page h2 {
    font-family: 'Fredoka', system-ui, sans-serif;
    color: #3a2410;
    font-size: clamp(16px, 2.6vw, 30px);
    font-weight: 800;
    margin: 4px 0 8px;
    line-height: 1.15;
  }
  .summary {
    color: #5a4528;
    font-size: clamp(12px, 1.7vw, 18px);
    font-weight: 500;
    line-height: 1.45;
    margin: 0;
    overflow-y: auto;
    flex: 1;
  }

  .action { margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 8px; }
  .cta {
    border: none;
    border-radius: 100px;
    padding: clamp(10px, 1.4vw, 15px) clamp(20px, 3vw, 34px);
    font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
    font-size: clamp(14px, 1.9vw, 20px);
    font-weight: 800;
    color: #2c1600;
    background: linear-gradient(180deg, #ffd24a, #f5a623);
    box-shadow: 0 6px 16px rgba(245, 166, 35, 0.5);
    cursor: pointer;
    transition: transform 0.14s ease;
    animation: breathe 2.4s ease-in-out infinite;
  }
  .cta:hover { transform: translateY(-2px); }
  .cta:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }
  .soon { color: #8a5a2a; font-weight: 800; font-size: clamp(13px, 1.8vw, 18px); }
  .done-tag { color: #2e7d32; font-weight: 800; font-size: clamp(12px, 1.6vw, 16px); }

  .confetti {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
  }
  .confetti span {
    position: absolute;
    top: -10%;
    font-size: clamp(18px, 3vw, 30px);
    animation: fall 2.6s ease-in infinite;
  }
  .confetti span:nth-child(1) { left: 18%; animation-delay: 0s; }
  .confetti span:nth-child(2) { left: 38%; animation-delay: 0.4s; }
  .confetti span:nth-child(3) { left: 55%; animation-delay: 0.2s; }
  .confetti span:nth-child(4) { left: 72%; animation-delay: 0.6s; }
  .confetti span:nth-child(5) { left: 86%; animation-delay: 0.3s; }
  @keyframes fall { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(380px) rotate(220deg); opacity: 0; } }

  .dots { position: relative; z-index: 2; flex: 0 0 auto; display: flex; gap: 12px; margin-top: 0; }
  .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
    padding: 0;
    transition: transform 0.15s ease, background 0.2s ease;
  }
  .dot.on { background: #f5a623; border-color: #fff; transform: scale(1.2); }
  .dot.complete { background: #4caf50; }
  .dot:focus-visible { outline: 3px solid #ffe9a8; outline-offset: 2px; }

  .complete-banner {
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    background: linear-gradient(180deg, #fff7e0, #ffe2a6);
    color: #6b4310;
    font-weight: 700;
    font-size: clamp(14px, 2vw, 18px);
    padding: 12px 26px;
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    animation: rise 0.5s ease both;
  }
  .complete-banner b { color: #2e7d32; }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 14px 28px;
    font-family: inherit;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transition: transform 0.12s, box-shadow 0.12s;
    white-space: nowrap;
    outline: none;
  }
  .pill:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28); }
  .pill:focus-visible { outline: 3px solid #ffe9a8; outline-offset: 2px; }

  @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
  @keyframes rise { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }

  @media (prefers-reduced-motion: reduce) {
    .spread, .cta, .confetti span, .badge-hook.pop, .complete-banner { animation: none !important; }
  }
</style>
