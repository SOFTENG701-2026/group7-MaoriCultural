<!-- Tikanga Module — Page 3: Station 1 Entrance -->
<script lang="ts">
  import bgImg      from '../../assets/tikanga/p3 background.png'
  import miniMapImg from '../../assets/tikanga/p3 map 1亮.png'
  import listenImg  from '../../assets/tikanga/kiwiListenCarefully.png'
  import kiwiYes    from '../../assets/tikanga/kiwiyes.png'
  import kiwiTry    from '../../assets/tikanga/kiwitryagain.png'
  import lockedBtn  from '../../assets/tikanga/p3 locked next welcome area.png'
  import nextBtn    from '../../assets/tikanga/p3 next welcome area.png'
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

  const beginnerChoices: Choice[] = [
    { id: 'listen',  label: '🤫 Listen quietly',      correct: true,  hint: '' },
    { id: 'run',     label: '🏃 Run inside',           correct: false, hint: 'Wait at the entrance — it\'s polite to be welcomed first.' },
    { id: 'shout',   label: '📢 Shout hello',          correct: false, hint: 'Stay calm and quiet. Wait for the welcome call.' },
  ]

  const confidentChoices: Choice[] = [
    { id: 'stay',    label: '🧍 Stay and wait to be welcomed', correct: true,  hint: '' },
    { id: 'walk',    label: '🚶 Walk in slowly',               correct: false, hint: 'Wait to be invited — entering without welcome is not tikanga.' },
    { id: 'lead',    label: '🫅 Lead the group in',            correct: false, hint: 'Let the tangata whenua lead. Wait for their welcome.' },
  ]

  const choices = $derived(
    tikangaState.level === 'beginner' ? beginnerChoices : confidentChoices
  )

  let selected   = $state<string | null>(null)
  let shaking    = $state<string | null>(null)
  let completed  = $state(false)

  const isCorrect = $derived(
    selected !== null && (choices.find(c => c.id === selected)?.correct ?? false)
  )
  const currentHint = $derived(
    selected && !isCorrect ? (choices.find(c => c.id === selected)?.hint ?? '') : ''
  )

  const readText = 'Station 1: Entrance. You arrive at the marae entrance. What do you do?'

  function pick(choice: Choice) {
    if (completed) return
    selected = choice.id
    if (!choice.correct) {
      shaking = choice.id
      speak(choice.hint)
      setTimeout(() => { shaking = null }, 600)
    } else {
      speak('Ka pai! You waited respectfully at the entrance.')
      completed = true
    }
  }

  function handleNext() {
    tikangaState.completeStation('entrance')
    onNext()
  }
</script>

<div class="page" style="background-image:url({bgImg})">

  <!-- Mini-map top-right -->
  <img src={miniMapImg} alt="Marae Visit Map — Station 1 lit" class="mini-map" />

  <!-- Back button -->
  <button class="pill btn-back" onclick={onBack}>← Back</button>

  <!-- Main content card -->
  <div class="content">

    <!-- Guide kiwi -->
    <img src={completed ? kiwiYes : listenImg} alt="Kiwi guide" class="kiwi-img" />

    <!-- Question card -->
    <div class="card">
      <div class="badge">Station 1 — Entrance</div>
      <h1>You arrive at the marae entrance.<br>What do you do?</h1>

      <!-- Choices -->
      <div class="choices">
        {#each choices as c}
          <button
            class="choice"
            class:correct={selected === c.id && c.correct}
            class:wrong={selected === c.id && !c.correct}
            class:shake={shaking === c.id}
            onclick={() => pick(c)}
            disabled={completed && !c.correct}
            aria-pressed={selected === c.id}
          >
            {c.label}
          </button>
        {/each}
      </div>

      <!-- Hint for wrong answer -->
      {#if currentHint}
        <div class="hint-box fade-in">
          <img src={kiwiTry} alt="Kiwi try again" class="hint-kiwi" />
          <p>{currentHint}</p>
        </div>
      {/if}

      <!-- Success message -->
      {#if completed}
        <div class="success-box fade-in">
          <span class="station-complete">Station 1 complete! ✓</span>
          <p>Ka pai! You waited respectfully at the entrance.</p>
        </div>
      {/if}
    </div>

    <!-- Help button -->
    <button class="help-btn" onclick={() => speak('Wait at the entrance. Good tikanga means you wait until the tangata whenua welcome you in.')} aria-label="Need help?">
      <img src={needHelp} alt="Need help?" />
    </button>
  </div>

  <!-- Next button (image) -->
  <div class="next-wrap">
    <button
      class="next-img-btn"
      onclick={handleNext}
      aria-label={completed ? 'Next: Station 2 Welcome Area' : 'Complete the challenge to continue'}
      aria-disabled={!completed}
      disabled={!completed}
    >
      <img src={completed ? nextBtn : lockedBtn} alt={completed ? 'Next: welcome area' : 'Locked'} />
    </button>
  </div>

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
    padding: 24px 16px 120px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .mini-map {
    position: fixed;
    top: 14px;
    right: 16px;
    z-index: 40;
    width: min(140px, 18vw);
    height: auto;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.35));
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
    max-width: 860px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 60px;
  }

  .kiwi-img {
    width: min(140px, 22vw);
    height: auto;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.2));
    animation: bounce .6s ease-in-out;
  }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }

  /* Card */
  .card {
    width: 100%;
    background: rgba(255,255,255,.96);
    border-radius: 24px;
    padding: 28px 28px 24px;
    box-shadow: 0 12px 40px rgba(0,0,0,.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    box-sizing: border-box;
  }

  .badge {
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    font-size: 15px;
    padding: 8px 24px;
    border-radius: 100px;
    box-shadow: 0 4px 12px rgba(245,166,35,.4);
  }

  h1 {
    font-size: clamp(22px, 3.2vw, 36px);
    font-weight: 900;
    color: #111;
    text-align: center;
    margin: 0;
    line-height: 1.3;
  }

  .choices {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .choice {
    border: 3px solid #e0e0e0;
    border-radius: 16px;
    padding: 18px 24px;
    font-family: inherit;
    font-size: clamp(16px, 2.4vw, 22px);
    font-weight: 700;
    cursor: pointer;
    background: #fafafa;
    text-align: left;
    transition: transform .15s ease, border-color .2s ease, background .2s ease;
    outline: none;
  }
  .choice:hover:not(:disabled) { transform: translateX(4px); border-color: #aaa; }
  .choice:disabled { cursor: not-allowed; opacity: .5; }
  .choice.correct  { border-color: #4caf50 !important; background: #f0fff4 !important; }
  .choice.wrong    { border-color: #F5A623 !important; background: #fffbf0 !important; }

  .hint-box {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #fff8ec;
    border: 2px solid #F5A623;
    border-radius: 16px;
    padding: 14px 18px;
    width: 100%;
    box-sizing: border-box;
  }
  .hint-kiwi {
    width: 60px;
    height: 60px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .hint-box p {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #5a3a00;
    line-height: 1.45;
  }

  .success-box {
    background: #f0fff4;
    border: 2.5px solid #4caf50;
    border-radius: 16px;
    padding: 14px 20px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
  .station-complete {
    display: block;
    font-size: 20px;
    font-weight: 900;
    color: #2e7d32;
    margin-bottom: 6px;
  }
  .success-box p {
    margin: 0;
    font-size: 16px;
    color: #2c5e32;
    font-weight: 600;
  }

  .help-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform .15s;
  }
  .help-btn:hover { transform: scale(1.05); }
  .help-btn img { width: min(100px, 16vw); height: auto; }

  .next-wrap {
    position: relative;
    z-index: 10;
    margin-top: 16px;
  }
  .next-img-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform .15s, filter .15s;
  }
  .next-img-btn img {
    width: min(280px, 44vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
  }
  .next-img-btn:hover:not(:disabled) { transform: translateY(-3px); }
  .next-img-btn:disabled { cursor: not-allowed; opacity: .85; }


  .pill {
    border: none;
    border-radius: 100px;
    padding: 12px 28px;
    font-family: inherit;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,.22);
    transition: transform .12s, box-shadow .12s;
    white-space: nowrap;
    outline: none;
  }
  .pill:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.28); }
  .rtm-nav { position: fixed; bottom: 18px; left: 18px; z-index: 50; }
</style>
