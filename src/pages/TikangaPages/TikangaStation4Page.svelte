<!-- Tikanga Module — Page 6: Station 4 Kai & Care -->
<script lang="ts">
  import kiwiListen from '../../assets/tikanga/kiwiListenCarefully.png'
  import kiwiYes    from '../../assets/tikanga/kiwiyes.png'
  import kiwiTry    from '../../assets/tikanga/kiwitryagain.png'
  import needHelp   from '../../assets/tikanga/need help.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  type Choice = { id: string; label: string; correct: boolean; hint: string }

  const kaiChoices: Choice[] = [
    { id: 'karakia', label: '🙏 Wait for the karakia (grace) before eating', correct: true,  hint: '' },
    { id: 'start',   label: '🍽️ Start eating right away',                    correct: false, hint: 'Always wait for the karakia (blessing) before eating at the marae.' },
    { id: 'best',    label: '🥘 Take the best food first',                    correct: false, hint: 'Respect means waiting and not taking the best portions first.' },
  ]

  const careChoices: Choice[] = [
    { id: 'clean',  label: '🧹 Help clean up before you leave',                 correct: true,  hint: '' },
    { id: 'leave',  label: '🚶 Leave quietly without saying goodbye',           correct: false, hint: 'Saying thank you and farewell is an important part of tikanga.' },
    { id: 'rubbish',label: '🗑️ Leave your rubbish behind — they will clean it', correct: false, hint: 'Always clean up after yourself. Kaitiakitanga means caring for the space.' },
  ]

  const termCards = [
    { term: 'Manaakitanga', meaning: 'Showing kindness and hospitality to others' },
    { term: 'Kaitiakitanga', meaning: 'Guardianship and care for people and the environment' },
  ]

  let kaiAnswer  = $state<string | null>(null)
  let careAnswer = $state<string | null>(null)
  let part       = $state(1)   // 1 = kai, 2 = care
  let completed  = $state(false)
  let shaking    = $state<string | null>(null)

  const readText = 'Station 4: Kai and Care. Wait for the karakia before eating. Help clean up when you leave.'

  function pickKai(c: Choice) {
    if (part !== 1) return
    kaiAnswer = c.id
    if (!c.correct) {
      shaking = c.id
      speak(c.hint)
      setTimeout(() => { shaking = null; kaiAnswer = null }, 700)
    } else {
      speak('Ka pai! You waited for the karakia. Now think about how to care for the marae when you leave.')
      setTimeout(() => { part = 2 }, 800)
    }
  }

  function pickCare(c: Choice) {
    if (completed) return
    careAnswer = c.id
    if (!c.correct) {
      shaking = c.id
      speak(c.hint)
      setTimeout(() => { shaking = null; careAnswer = null }, 700)
    } else {
      speak('Ka pai! Station 4 complete! You showed manaakitanga and kaitiakitanga.')
      completed = true
    }
  }

  function handleNext() {
    tikangaState.completeStation('kaiCare')
    onNext()
  }
</script>

<div class="page">
  <div class="bg" aria-hidden="true"></div>

  <div class="station-pill">Station 4 — Kai &amp; Care</div>
  <button class="pill btn-back" onclick={onBack}>← Back</button>

  <div class="content">

    <img src={completed ? kiwiYes : kiwiListen} alt="Kiwi guide" class="kiwi-img" />

    <!-- Part A: Kai tikanga -->
    <div class="card fade-in">
      <div class="badge">Kai time!</div>
      <h2>What is the correct tikanga for kai (food)?</h2>

      <div class="choices">
        {#each kaiChoices as c}
          <button
            class="choice"
            class:correct={kaiAnswer === c.id && c.correct}
            class:wrong={kaiAnswer === c.id && !c.correct}
            class:shake={shaking === c.id}
            onclick={() => pickKai(c)}
            disabled={part > 1}
            aria-pressed={kaiAnswer === c.id}
          >
            {c.label}
          </button>
        {/each}
      </div>

      {#if kaiAnswer && kaiChoices.find(c => c.id === kaiAnswer && !c.correct)}
        <div class="hint-box fade-in">
          <img src={kiwiTry} alt="" class="hint-kiwi" />
          <p>{kaiChoices.find(c => c.id === kaiAnswer)?.hint}</p>
        </div>
      {/if}

      {#if part > 1}
        <p class="step-done">✓ You waited for the karakia. Tino pai!</p>
      {/if}
    </div>

    <!-- Part B: Care / leaving -->
    {#if part >= 2}
      <div class="card fade-in">
        <div class="badge">Before you leave</div>
        <h2>How do you care for the marae when it's time to go?</h2>

        <div class="choices">
          {#each careChoices as c}
            <button
              class="choice"
              class:correct={careAnswer === c.id && c.correct}
              class:wrong={careAnswer === c.id && !c.correct}
              class:shake={shaking === c.id}
              onclick={() => pickCare(c)}
              disabled={completed}
              aria-pressed={careAnswer === c.id}
            >
              {c.label}
            </button>
          {/each}
        </div>

        {#if careAnswer && careChoices.find(c => c.id === careAnswer && !c.correct)}
          <div class="hint-box fade-in">
            <img src={kiwiTry} alt="" class="hint-kiwi" />
            <p>{careChoices.find(c => c.id === careAnswer)?.hint}</p>
          </div>
        {/if}

        {#if completed}
          <div class="success-box fade-in">
            <span class="station-complete">Station 4 complete! ✓</span>
            <p>Ka pai! You showed care and respect for the marae and its people.</p>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Confident extra: Māori term cards -->
    {#if completed && tikangaState.level === 'confident'}
      <div class="terms-section fade-in">
        <h3>Māori terms you used today:</h3>
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

    <button class="help-btn" onclick={() => speak('Wait for the karakia before eating. When you leave, always help clean up and say goodbye. This shows manaakitanga and kaitiakitanga.')} aria-label="Need help?">
      <img src={needHelp} alt="Need help?" />
    </button>

  </div>

  <nav class="bottom-nav">
    <button class="pill btn-back-bottom" onclick={onBack}>← Back</button>
    <button class="pill btn-next" onclick={handleNext} disabled={!completed}>Next →</button>
  </nav>
  <nav class="rtm-nav"><ReadToMe text={readText} /></nav>
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
    padding: 80px 16px 120px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background: linear-gradient(155deg, #7a2600 0%, #c05000 40%, #e87820 70%, #f5b44a 100%);
  }

  .station-pill {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    font-size: 15px;
    padding: 8px 24px;
    border-radius: 100px;
    box-shadow: 0 4px 12px rgba(245,166,35,.4);
    white-space: nowrap;
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
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }

  .kiwi-img {
    width: min(110px, 18vw);
    height: auto;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.2));
  }

  .card {
    width: 100%;
    background: rgba(255,255,255,.96);
    border-radius: 22px;
    padding: 24px 24px 20px;
    box-shadow: 0 10px 32px rgba(0,0,0,.15);
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-sizing: border-box;
  }

  .badge {
    display: inline-block;
    background: #e67e00;
    color: #fff;
    font-weight: 800;
    font-size: 13px;
    padding: 6px 18px;
    border-radius: 100px;
    align-self: flex-start;
  }

  h2 {
    font-size: clamp(18px, 2.6vw, 26px);
    font-weight: 900;
    color: #111;
    margin: 0;
    line-height: 1.35;
  }

  .choices {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .choice {
    border: 3px solid #e0e0e0;
    border-radius: 14px;
    padding: 16px 20px;
    font-family: inherit;
    font-size: clamp(15px, 2.2vw, 20px);
    font-weight: 700;
    cursor: pointer;
    background: #fafafa;
    text-align: left;
    transition: transform .15s, border-color .2s;
    outline: none;
  }
  .choice:hover:not(:disabled) { transform: translateX(4px); border-color: #aaa; }
  .choice:disabled { cursor: not-allowed; opacity: .5; }
  .choice.correct { border-color: #4caf50 !important; background: #f0fff4 !important; }
  .choice.wrong   { border-color: #e53935 !important; background: #fff0f0 !important; }

  .hint-box {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff8ec;
    border: 2px solid #F5A623;
    border-radius: 14px;
    padding: 12px 16px;
  }
  .hint-kiwi { width: 50px; height: 50px; object-fit: contain; flex-shrink: 0; }
  .hint-box p { margin: 0; font-size: 15px; font-weight: 600; color: #5a3a00; line-height: 1.4; }

  .step-done { margin: 0; font-size: 15px; font-weight: 700; color: #2e7d32; }

  .success-box {
    background: #f0fff4;
    border: 2.5px solid #4caf50;
    border-radius: 14px;
    padding: 14px 18px;
    text-align: center;
  }
  .station-complete { display: block; font-size: 18px; font-weight: 900; color: #2e7d32; margin-bottom: 4px; }
  .success-box p { margin: 0; font-size: 15px; color: #2c5e32; font-weight: 600; }

  /* Confident term cards */
  .terms-section {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 800px;
  }
  .terms-section h3 {
    color: #fff;
    font-size: 18px;
    font-weight: 800;
    margin: 0 0 12px;
    text-shadow: 0 2px 6px rgba(0,0,0,.3);
  }
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .term-card {
    background: rgba(255,255,255,.95);
    border: 2.5px solid #e67e00;
    border-radius: 16px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 4px 14px rgba(0,0,0,.15);
  }
  .term-word { font-size: 18px; font-weight: 900; color: #8a3a00; }
  .term-meaning { font-size: 14px; font-weight: 600; color: #3a2000; line-height: 1.4; }

  .help-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform .15s;
  }
  .help-btn:hover { transform: scale(1.05); }
  .help-btn img { width: min(90px, 14vw); height: auto; }

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
  .btn-next:disabled {
    background: #d0d0d0;
    color: #888;
    animation: none;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  @keyframes breathe {
    0%,100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(245,166,35,.35); }
    50%      { transform: scale(1.05); box-shadow: 0 8px 24px rgba(245,166,35,.6);  }
  }
  .rtm-nav { position: fixed; bottom: 18px; left: 18px; z-index: 50; }
</style>
