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
  import { speak } from '../../lib/settings.svelte'
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
    speak(introText)
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
    speak(
      'Ka rawe! You read the whole story, put it in order, and answered every question. You are a true storyteller! Tap to see your storybook.',
    )
  }
</script>

{#if story}
  <div class="player" style:background-image="url({beachScene})">
    <div class="scrim" aria-hidden="true"></div>

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
          <KiwiGuide pose="yes" text="Ka rawe! You finished the whole pūrākau!" size="lg" />
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
    min-height: 100vh;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Nunito', 'Baloo 2', system-ui, sans-serif;
    overflow-x: hidden;
  }
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: linear-gradient(180deg, rgba(20, 40, 60, 0.42), rgba(20, 40, 60, 0.62));
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
    width: 92%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 72px 0 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Intro (Step 2) */
  .intro { display: flex; flex-direction: column; align-items: center; gap: 26px; margin: auto 0; }
  .intro-kiki {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 28px;
    padding: 18px;
    width: min(720px, 92vw);
    box-sizing: border-box;
  }

  .celebrate { display: flex; flex-direction: column; align-items: center; gap: 22px; margin: auto 0; width: min(720px, 92vw); }
  .big-badge {
    width: clamp(110px, 18vw, 170px);
    filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
    animation: badgePop 0.6s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes badgePop { from { opacity: 0; transform: scale(0) rotate(-30deg); } to { opacity: 1; transform: scale(1) rotate(0); } }

  .big-cta {
    border: none;
    border-radius: 100px;
    padding: 18px 46px;
    font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif;
    font-size: clamp(18px, 2.6vw, 24px);
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
