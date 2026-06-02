<!-- Tikanga Module — Page 4: Station 2 Welcome Area (hongi) -->
<script lang="ts">
  import bgImg      from '../../assets/tikanga/p4 background.png'
  import kiwiHello  from '../../assets/tikanga/kiwihello.png'
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

  let step      = $state(1)      // 1 = watch & wait, 2 = hongi response
  let selected1 = $state<string | null>(null)
  let selected2 = $state<string | null>(null)
  let completed = $state(false)
  let shaking   = $state<string | null>(null)

  type Choice = { id: string; label: string; correct: boolean; hint: string }

  const step1Choices: Choice[] = [
    { id: 'wait',  label: '🧍 Watch and wait',  correct: true,  hint: '' },
    { id: 'leave', label: '🚶 Walk away',        correct: false, hint: 'Stay and show respect — turning away is not polite.' },
  ]

  const step2Choices: Choice[] = [
    { id: 'join',   label: '🫂 Join the hongi respectfully', correct: true,  hint: '' },
    { id: 'movie',  label: '🎬 Copy it like in a movie',     correct: false, hint: 'A hongi is sacred — follow the elder\'s lead, not a movie.' },
    { id: 'smile',  label: '😊 Smile and wait patiently',    correct: true,  hint: '' },
  ]

  const readText = 'Station 2: Welcome Area. The kaumātua elder walks toward you. Watch and wait. Then respond to the hongi greeting.'

  function pickStep1(c: Choice) {
    if (selected1 !== null) return
    selected1 = c.id
    if (!c.correct) {
      shaking = c.id
      speak(c.hint)
      setTimeout(() => { shaking = null; selected1 = null }, 700)
    } else {
      speak('Ka pai! You watched and waited respectfully.')
      setTimeout(() => { step = 2 }, 800)
    }
  }

  function pickStep2(c: Choice) {
    if (completed) return
    if (selected2 === c.id) { selected2 = null; return }
    selected2 = c.id
    if (!c.correct) {
      shaking = c.id
      speak(c.hint)
      setTimeout(() => { shaking = null }, 600)
    } else {
      speak('Ka pai! You joined the hongi respectfully. Station 2 complete!')
      completed = true
    }
  }

  function handleNext() {
    tikangaState.completeStation('welcome')
    onNext()
  }
</script>

<div class="page" style="background-image:url({bgImg})">


  <!-- Station badge -->
  <div class="station-pill">Station 2 — Welcome Area</div>

  <!-- Back button -->
  <button class="pill btn-back" onclick={onBack}>← Back</button>

  <div class="content">

    <!-- Kiwi guide -->
    <img
      src={completed ? kiwiYes : kiwiHello}
      alt="Kiwi guide"
      class="kiwi-img"
    />

    <!-- Step 1 card -->
    {#if step >= 1}
      <div class="card fade-in">
        <h2>The kaumātua (elder) walks toward you. What do you do?</h2>
        <div class="choices">
          {#each step1Choices as c}
            <button
              class="choice"
              class:correct={selected1 === c.id && c.correct}
              class:wrong={selected1 === c.id && !c.correct}
              class:shake={shaking === c.id}
              onclick={() => pickStep1(c)}
              disabled={step > 1}
              aria-pressed={selected1 === c.id}
            >
              {c.label}
            </button>
          {/each}
        </div>
        {#if step > 1}
          <p class="step-done">✓ You watched and waited — great tikanga!</p>
        {/if}
      </div>
    {/if}

    <!-- Step 2 card -->
    {#if step >= 2}
      <div class="card fade-in">
        <h2>
          The elder greets you with a hongi (pressing foreheads and noses together).
          {#if tikangaState.level === 'confident'}
            <span class="note">You have seen a hongi before — still wait for the elder to lead.</span>
          {/if}
        </h2>
        <div class="choices">
          {#each step2Choices as c}
            <button
              class="choice"
              class:correct={selected2 === c.id && c.correct}
              class:wrong={selected2 === c.id && !c.correct}
              class:shake={shaking === c.id}
              onclick={() => pickStep2(c)}
              disabled={completed && !c.correct}
              aria-pressed={selected2 === c.id}
            >
              {c.label}
            </button>
          {/each}
        </div>

        <!-- Hint for movie choice -->
        {#if selected2 === 'movie'}
          <div class="hint-box fade-in">
            <img src={kiwiTry} alt="Kiwi try again" class="hint-kiwi" />
            <p>A hongi is sacred — follow the elder's lead, not a movie version.</p>
          </div>
        {/if}

        <!-- Complete -->
        {#if completed}
          <div class="success-box fade-in">
            <span class="station-complete">Station 2 complete! ✓</span>
            <p>Ka pai! You responded to the hongi with respect.</p>
          </div>
        {/if}
      </div>
    {/if}

    <button class="help-btn" onclick={() => speak('Wait for the kaumātua elder to approach. The hongi — pressing foreheads and noses — is a sacred greeting. Always let the elder lead.')} aria-label="Need help?">
      <img src={needHelp} alt="Need help?" />
    </button>
  </div>

  <!-- Bottom nav -->
  <nav class="bottom-nav">
    <button class="pill btn-back-bottom" onclick={onBack}>← Back</button>
    <button
      class="pill btn-next"
      onclick={handleNext}
      disabled={!completed}
    >
      Next →
    </button>
  </nav>
  <nav class="rtm-nav"><ReadToMe text={readText} /></nav>
</div>

<style>
  .page {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Nunito', system-ui, sans-serif;
    padding: 80px 16px 120px;
    box-sizing: border-box;
    overflow-y: auto;
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
    max-width: 760px;
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
    gap: 16px;
    box-sizing: border-box;
  }

  h2 {
    font-size: clamp(18px, 2.8vw, 28px);
    font-weight: 900;
    color: #111;
    margin: 0;
    line-height: 1.35;
  }

  .note {
    display: block;
    font-size: 0.82em;
    font-weight: 600;
    color: #5a7a00;
    margin-top: 4px;
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
    transition: transform .15s ease, border-color .2s ease;
    outline: none;
  }
  .choice:hover:not(:disabled) { transform: translateX(4px); border-color: #aaa; }
  .choice:disabled { cursor: not-allowed; opacity: .5; }
  .choice.correct { border-color: #4caf50 !important; background: #f0fff4 !important; }
  .choice.wrong   { border-color: #F5A623 !important; background: #fffbf0 !important; }

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

  .success-box {
    background: #f0fff4;
    border: 2.5px solid #4caf50;
    border-radius: 14px;
    padding: 14px 18px;
    text-align: center;
  }
  .station-complete { display: block; font-size: 18px; font-weight: 900; color: #2e7d32; margin-bottom: 4px; }
  .success-box p { margin: 0; font-size: 15px; color: #2c5e32; font-weight: 600; }

  .step-done {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #2e7d32;
  }

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
