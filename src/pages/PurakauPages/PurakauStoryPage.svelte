<script lang="ts">
  // The story player — the heart of the journey. A small step machine walks the
  // child through:
  //   Step 2  intro     — Kiki pops up and introduces the tale
  //   Step 3  scenes    — interactive, narrated storytelling (StoryScenes)
  //   Step 4  sequence  — drag the scenes back into order (SequenceGame)
  //   Step 5  quiz      — Māori-word questions + Fun Facts (StoryQuiz)
  // After the quiz, the player navigates to /purakau/reward — the dedicated
  // PurakauRewardPage which combines the green Hei Matau badge, Kiki's
  // congratulations, stats, and the Tikanga-style badge-ceremony modal.
  import { onMount, onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { storyById } from './stories'
  import { purakauState } from '../../lib/purakauState.svelte'
  import { narrate, stopSpeaking } from '../../lib/settings.svelte'
  import { beachScene, SCENE_IMAGES } from './assets'
  import KiwiGuide from './components/KiwiGuide.svelte'
  import StoryScenes from './components/StoryScenes.svelte'
  import SequenceGame from './components/SequenceGame.svelte'
  import StoryQuiz from './components/StoryQuiz.svelte'

  type Step = 'intro' | 'scenes' | 'sequence' | 'quiz'

  // Captured once: a refresh of /purakau/play has no active story, so we bounce
  // back to the bookshelf rather than render an empty player.
  const story = storyById(purakauState.activeStoryId)

  // Full-screen backdrop for the intro + sequence steps. Stories may theme this
  // to their own art (Story 2 → the Te Kore void); otherwise the beach scene.
  const bg = story?.bgImage ? SCENE_IMAGES[story.bgImage] : beachScene

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

  // Leaving the player (to the book or the reward page) silences the narrator.
  onDestroy(() => stopSpeaking())

  function goSequence() {
    seqSolved = false
    step = 'sequence'
  }

  function finish() {
    // Record story completion in purakauState (so the storybook can play the
    // colour-reveal animation on return). Module-level progress + badge is
    // handled by the dedicated PurakauRewardPage (Tikanga pattern).
    purakauState.completeActiveStory()
    push('/purakau/reward')
  }
</script>

{#if story}
  <div class="player">
    <div class="bg" style:background-image="url({bg})" aria-hidden="true"></div>
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
        <!-- Step 5 — Quiz + Fun Facts.
             onComplete navigates to /purakau/reward for the badge ceremony. -->
        <StoryQuiz quiz={story.quiz} onComplete={finish} />
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
  @media (prefers-reduced-motion: reduce) { .big-cta { animation: none !important; } }
</style>
