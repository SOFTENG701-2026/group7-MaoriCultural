<!-- Tikanga Module — Page 2: What is Tikanga? -->
<script lang="ts">
  import bgImg     from '../../assets/tikanga/p1 background.png'
  import goalsImg  from '../../assets/tikanga/p2 goals.png'
  import goal1Img  from '../../assets/tikanga/p2 goal 1 listen first (1).png'
  import goal2Img  from '../../assets/tikanga/p2 goal 2.png'
  import goal3Img  from '../../assets/tikanga/p2 goal 3.png'
  import goal4Img  from '../../assets/tikanga/p2 goal 4.png'
  import lockedBtn from '../../assets/tikanga/p2 locked next entrance.png'
  import nextBtn   from '../../assets/tikanga/p2 next entrance.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const goals = [
    { img: goal1Img, label: 'Listen carefully', text: 'Listen carefully to learn tikanga.' },
    { img: goal2Img, label: 'Watch and learn',  text: 'Watch and learn from others at the marae.' },
    { img: goal3Img, label: 'Follow the rules', text: 'Follow the tikanga rules to show respect.' },
    { img: goal4Img, label: 'Show respect',     text: 'Show respect for people, places, and customs.' },
  ]

  let clicked = $state<Set<number>>(new Set())
  let glowing = $state<number | null>(null)

  const allClicked = $derived(clicked.size === 4)
  const showTangataCard = $derived(tikangaState.level === 'confident' && clicked.size >= 2)
  const canProceed = $derived(tikangaState.level === 'beginner' ? allClicked : clicked.size >= 2)

  const readText = 'What is Tikanga? Tikanga are Māori ways of doing things right. Listen carefully, watch and learn, follow the rules, and show respect.'

  function clickGoal(i: number) {
    clicked = new Set([...clicked, i])
    glowing = i
    speak(goals[i].text)
    setTimeout(() => { glowing = null }, 900)
  }
</script>

<div class="stage" style="background-image:url({bgImg})">

  <!-- Back button — top-left -->
  <button class="btn-back" onclick={onBack}>← Back</button>

  <!-- Page title -->
  <h1 class="page-title">What is Tikanga?</h1>

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
          onclick={() => clickGoal(i)}
          aria-pressed={clicked.has(i)}
          aria-label={g.label}
        >
          <img src={g.img} alt={g.label} class="goal-img" />
          {#if clicked.has(i)}
            <span class="done-tick" aria-hidden="true">✓</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Confident: tangata whenua info card -->
  {#if showTangataCard}
    <div class="info-card fade-in">
      <span class="info-title">Tangata whenua</span>
      <p>Tangata whenua means the people of the land. They welcome and guide visitors at the marae.</p>
    </div>
  {/if}

  <!-- Beginner progress hint -->
  {#if tikangaState.level === 'beginner' && !allClicked}
    <p class="hint-text">Tap all 4 goals to continue ({clicked.size}/4)</p>
  {/if}

  <!-- Next button image — bottom-centre -->
  <button
    class="next-img-btn"
    class:active={canProceed}
    onclick={() => { if (canProceed) onNext() }}
    aria-label={canProceed ? 'Next: Station 1 Entrance' : 'Complete all goals to continue'}
    aria-disabled={!canProceed}
  >
    <img src={canProceed ? nextBtn : lockedBtn} alt={canProceed ? 'Next' : 'Locked'} />
  </button>

  <!-- Read to me — bottom-left -->
  <nav class="bottom-left-nav">
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

  /* Back pill — fixed top-left */
  .btn-back {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
    background: #fff;
    color: #333;
    border: none;
    border-radius: 100px;
    padding: 12px 28px;
    font-family: inherit;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,.22);
    transition: transform .12s, box-shadow .12s;
  }
  .btn-back:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.28); }

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
  .goal-btn:hover { transform: translateY(-5px) scale(1.04); }
  .goal-btn:active { transform: scale(0.97); }
  .goal-btn.done {
    outline: 5px solid #4caf50;
    outline-offset: 3px;
    filter: brightness(1.08) drop-shadow(0 0 14px rgba(76,175,80,.9));
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

  /* Confident info card */
  .info-card {
    background: rgba(255,255,255,.95);
    border: 2.5px solid #F5A623;
    border-radius: 18px;
    padding: 14px 22px;
    max-width: min(500px, 80vw);
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
    flex-shrink: 0;
  }
  .info-title {
    display: block;
    font-size: 17px;
    font-weight: 900;
    color: #8a5a00;
    margin-bottom: 4px;
  }
  .info-card p {
    margin: 0;
    font-size: 15px;
    color: #2c2c2c;
    font-weight: 600;
    line-height: 1.5;
  }

  /* Progress hint */
  .hint-text {
    margin: 0;
    color: rgba(255,255,255,.95);
    font-size: 16px;
    font-weight: 800;
    text-shadow: 0 2px 6px rgba(0,0,0,.4);
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
  .next-img-btn[aria-disabled='true'] { cursor: not-allowed; opacity: .75; }
  .next-img-btn[aria-disabled='true']:hover { transform: translateX(-50%); }

  /* Breathing animation when all goals are done */
  .next-img-btn.active {
    animation: next-breathe 2s ease-in-out infinite;
  }
  @keyframes next-breathe {
    0%, 100% { transform: translateX(-50%) scale(1);    filter: drop-shadow(0 6px 18px rgba(20,160,90,.45)); }
    50%       { transform: translateX(-50%) scale(1.06); filter: drop-shadow(0 10px 28px rgba(20,160,90,.8)); }
  }
  .next-img-btn[aria-disabled='true'] { cursor: not-allowed; opacity: .85; }
  .next-img-btn[aria-disabled='true']:hover { transform: translateX(-50%); }

  /* Read to me — fixed bottom-left */
  .bottom-left-nav {
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
