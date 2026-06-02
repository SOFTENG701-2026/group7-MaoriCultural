<!-- Tikanga Module — Page 2: What is Tikanga? -->
<script lang="ts">
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
  const showTangataCard = $derived(
    tikangaState.level === 'confident' && clicked.size >= 2
  )
  const canProceed = $derived(
    tikangaState.level === 'beginner' ? allClicked : clicked.size >= 2
  )

  const readText = 'What is Tikanga? Tikanga are Māori ways of doing things right. Listen carefully, watch and learn, follow the rules, and show respect.'

  function clickGoal(i: number) {
    clicked = new Set([...clicked, i])
    glowing = i
    speak(goals[i].text)
    setTimeout(() => { glowing = null }, 900)
  }
</script>

<div class="page">
  <div class="bg" aria-hidden="true"></div>

  <!-- Back button -->
  <button class="pill btn-back" onclick={onBack}>← Back</button>

  <!-- Goals banner -->
  <img src={goalsImg} alt="Our goals for this visit" class="goals-img" />

  <!-- 4 goal icons in a 2×2 grid -->
  <div class="goals-grid">
    {#each goals as g, i}
      <button
        class="goal-card"
        class:glow={glowing === i}
        class:done={clicked.has(i)}
        onclick={() => clickGoal(i)}
        aria-pressed={clicked.has(i)}
      >
        <img src={g.img} alt={g.label} class="goal-icon" />
        <span class="goal-label">{g.label}</span>
        {#if clicked.has(i)}
          <span class="done-tick" aria-hidden="true">✓</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Confident extra: tangata whenua card -->
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

  <!-- Next button (image) -->
  <button
    class="next-img-btn"
    onclick={() => { if (canProceed) onNext() }}
    aria-label={canProceed ? 'Next: Station 1 Entrance' : 'Complete all goals to continue'}
    aria-disabled={!canProceed}
  >
    <img src={canProceed ? nextBtn : lockedBtn} alt={canProceed ? 'Next: entrance' : 'Locked'} />
  </button>

  <!-- Bottom nav -->
  <nav class="bottom-nav">
    <div></div>
    <ReadToMe text={readText} />
    <div></div>
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
    padding: 60px 16px 120px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: linear-gradient(160deg, #1a6b4a 0%, #2d9e6b 40%, #4ab87e 70%, #7ddba8 100%);
  }

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

  .goals-img {
    position: relative;
    z-index: 10;
    width: min(400px, 70vw);
    height: auto;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.25));
    margin-bottom: 24px;
  }

  .goals-grid {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    width: 90%;
    max-width: 680px;
  }

  .goal-card {
    position: relative;
    background: rgba(255,255,255,.92);
    border: 3px solid transparent;
    border-radius: 20px;
    padding: 20px 14px 14px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,.1);
    transition: transform .15s ease, border-color .2s ease, box-shadow .2s ease;
    font-family: inherit;
    outline: none;
  }
  .goal-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.15); }
  .goal-card.done  { border-color: #4caf50; background: rgba(240,255,244,.95); }

  .goal-icon {
    width: min(100px, 22vw);
    height: auto;
    object-fit: contain;
  }

  .goal-label {
    font-size: clamp(14px, 2.2vw, 18px);
    font-weight: 800;
    color: #1a4a2e;
    text-align: center;
  }

  .done-tick {
    position: absolute;
    top: 10px;
    right: 14px;
    font-size: 22px;
    color: #4caf50;
    font-weight: 900;
  }

  .info-card {
    position: relative;
    z-index: 10;
    margin-top: 20px;
    background: rgba(255,255,255,.96);
    border: 2.5px solid #F5A623;
    border-radius: 18px;
    padding: 18px 24px;
    width: 90%;
    max-width: 680px;
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
  }
  .info-title {
    display: block;
    font-size: 18px;
    font-weight: 900;
    color: #8a5a00;
    margin-bottom: 6px;
  }
  .info-card p {
    margin: 0;
    font-size: 16px;
    color: #2c2c2c;
    font-weight: 600;
    line-height: 1.5;
  }

  .hint-text {
    position: relative;
    z-index: 10;
    color: rgba(255,255,255,.9);
    font-size: 16px;
    font-weight: 700;
    margin-top: 12px;
  }

  .next-img-btn {
    position: relative;
    z-index: 10;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    margin-top: 20px;
    transition: transform .15s, filter .15s;
  }
  .next-img-btn img {
    width: min(280px, 44vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
  }
  .next-img-btn:hover { transform: translateY(-3px); }
  .next-img-btn[aria-disabled='true'] { cursor: not-allowed; opacity: 0.85; }
  .next-img-btn[aria-disabled='true']:hover { transform: none; }

  .bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 30;
    padding: 10px 18px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 16px 36px;
    font-family: inherit;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,.22);
    transition: transform .12s, box-shadow .12s;
    white-space: nowrap;
  }
</style>
