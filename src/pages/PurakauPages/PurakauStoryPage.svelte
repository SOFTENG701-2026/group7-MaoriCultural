<script lang="ts">
  // The story player — the heart of the journey. A small step machine walks the
  // child through:
  //   Step 2  intro     — Kiki pops up and introduces the tale
  //   Step 3  scenes    — interactive, narrated storytelling (StoryScenes)
  //   Step 4  sequence  — drag the scenes back into order (SequenceGame)
  //   Step 5  quiz      — Māori-word questions + Fun Facts (StoryQuiz)
  //   Step 6  celebrate — wrap-up; tapping through returns to the storybook,
  //                       where the finished cover fills with colour.
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { storyById } from './stories'
  import { purakauState } from '../../lib/purakauState.svelte'
  import { narrate } from '../../lib/settings.svelte'
  import { beachScene, heiMatau } from './assets'
  import KiwiGuide from './components/KiwiGuide.svelte'
  import StoryScenes from './components/StoryScenes.svelte'
  import SequenceGame from './components/SequenceGame.svelte'
  import StoryQuiz from './components/StoryQuiz.svelte'

  type Step = 'intro' | 'scenes' | 'sequence' | 'quiz' | 'celebrate'

  // Captured once: a refresh of /purakau/play has no active story, so we bounce
  // back to the bookshelf rather than render an empty player.
  const story = storyById(purakauState.activeStoryId)

  let step = $state<Step>('intro')
  let seqSolved = $state(false)

  const introText = story
    ? `Kia ora! Today we are going to read a very special pūrākau — ${story.title}. Are you ready? Tap Begin to start!`
    : ''

  onMount(() => {
    if (!story) {
      push('/purakau')
      return
    }
    narrate(introText)
  })

  function goSequence() {
    seqSolved = false
    step = 'sequence'
  }

  function finish() {
    // Record completion now (robust even if they leave on the wrap-up screen):
    // marks the story done, lights the map medal, and arms the colour reveal.
    purakauState.completeActiveStory()
    step = 'celebrate'
    narrate(
      'Ka rawe! You read the whole story, put it in order, and answered every question. You are a true storyteller! Tap to see your storybook.',
    )
  }
</script>

{#if story}
  <div class="player">
    <div class="bg" style:background-image="url({beachScene})" aria-hidden="true"></div>
    <button class="pill btn-book" onclick={() => push('/purakau')}>← Book</button>

    <main class="stage">
      {#if step === 'intro'}
        <!-- Step 2 — Kiki's introduction -->
        <div class="intro fade-in">
          <div class="intro-kiki">
            <KiwiGuide pose="hello" text={introText} size="lg" />
          </div>
          <button class="big-cta" onclick={() => (step = 'scenes')}>Begin the story →</button>
        </div>
      {:else if step === 'scenes'}
        <!-- Step 3 — Interactive storytelling -->
        <StoryScenes
          scenes={story.scenes}
          onFinish={goSequence}
          onBack={() => (step = 'intro')}
        />
      {:else if step === 'sequence'}
        <!-- Step 4 — Sequencing mini-game -->
        <div class="seq-step">
          <SequenceGame scenes={story.scenes} onSolved={() => (seqSolved = true)} />
          <nav class="bottom-nav">
            <button class="pill ghost" onclick={() => (step = 'scenes')}>← Back</button>
            <button class="pill cta" onclick={() => (step = 'quiz')} disabled={!seqSolved}>
              Next →
            </button>
          </nav>
          {#if !seqSolved}
            <p class="locked-note">Put the pictures in order to carry on.</p>
          {/if}
        </div>
      {:else if step === 'quiz'}
        <!-- Step 5 — Quiz + Fun Facts -->
        <StoryQuiz quiz={story.quiz} onComplete={finish} />
      {:else if step === 'celebrate'}
        <!-- Step 6 — Wrap-up, then back to the storybook to colour the page -->
        <div class="celebrate fade-in">
          <KiwiGuide pose="yes" text="Ka rawe! You finished the whole pūrākau!" size="md" />
          <img class="big-badge" src={heiMatau} alt="Hei Matau badge" />
          <button class="big-cta" onclick={() => push('/purakau')}>See my storybook →</button>
        </div>
      {/if}
    </main>
  </div>
{/if}

<style>
  .player {
    position: relative;
    height: 100vh;
    height: 100dvh; /* fit the visible viewport exactly — no page scroll */
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Nunito', 'Fredoka', system-ui, sans-serif;
  }
  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .btn-book {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
    background: #fff;
    color: #333;
  }

  .stage {
    position: relative;
    z-index: 10;
    width: 100%;
    margin: 0 auto;
    padding: 38px 0 0;
    flex: 1;
    min-height: 0; /* allow children to fit/shrink instead of growing the page */
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  /* Intro (Step 2) — fills the content area and centres within it. */
  .intro {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(14px, 3vh, 26px);
    width: 100%;
    overflow: hidden;
  }
  .intro-kiki {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 28px;
    padding: clamp(10px, 2vh, 18px);
    width: min(720px, 92vw);
    box-sizing: border-box;
  }

  /* Celebrate (Step 6 wrap-up) — height-fit so "See my storybook" is always
     fully visible; badge is sized by HEIGHT (the hook art is tall) so it can't
     balloon and push the button off-screen. */
  .celebrate {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(10px, 2.4vh, 22px);
    width: min(720px, 92vw);
    overflow: hidden;
  }
  .big-badge {
    height: clamp(72px, 13vh, 132px);
    width: auto;
    flex: 0 0 auto;
    filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
    animation: badgePop 0.6s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes badgePop { from { opacity: 0; transform: scale(0) rotate(-30deg); } to { opacity: 1; transform: scale(1) rotate(0); } }

  .big-cta {
    flex: 0 0 auto;
    border: none;
    border-radius: 100px;
    padding: clamp(12px, 2vh, 18px) clamp(28px, 5vw, 46px);
    font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
    font-size: clamp(17px, 2.6vw, 24px);
    font-weight: 800;
    color: #2c1600;
    background: linear-gradient(180deg, #ffd24a, #f5a623);
    box-shadow: 0 8px 22px rgba(245, 166, 35, 0.55);
    cursor: pointer;
    transition: transform 0.14s ease;
    animation: breathe 2s ease-in-out infinite;
  }
  .big-cta:hover { transform: translateY(-3px); }
  .big-cta:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

  .seq-step { width: 100%; display: flex; flex-direction: column; align-items: center; padding-bottom: 96px; }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    padding: 12px 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  .locked-note {
    position: fixed;
    bottom: 74px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    background: rgba(138, 90, 0, 0.9);
    padding: 5px 16px;
    border-radius: 999px;
    pointer-events: none;
  }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 14px 32px;
    font-family: inherit;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transition: transform 0.12s, box-shadow 0.12s;
    white-space: nowrap;
    outline: none;
  }
  .pill:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28); }
  .pill:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }
  .ghost { background: #fff; color: #333; }
  .cta { background: linear-gradient(180deg, #ffd24a, #f5a623); color: #2c1600; }
  .cta:disabled { background: #d3cbbe; color: #7c7468; cursor: not-allowed; transform: none; box-shadow: none; }

  @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @media (prefers-reduced-motion: reduce) { .big-cta, .big-badge { animation: none !important; } }
</style>
