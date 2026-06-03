<!-- Tikanga Module — Page 4: Station 2 Welcome Area (hongi) -->
<script lang="ts">
  import bgImg      from '../../assets/tikanga/p4 background.png'
  import kiwiHello  from '../../assets/tikanga/kiwihello.png'
  import kiwiYes    from '../../assets/tikanga/kiwiyes.png'
  import kiwiTry    from '../../assets/tikanga/kiwitryagain.png'
  import needHelp   from '../../assets/tikanga/need help.png'
  import lockedBtn  from '../../assets/tikanga/p4 lock next button.png'
  import nextBtn    from '../../assets/tikanga/p4 next button.png'
  import miniMapImg from '../../assets/tikanga/p4 map 2亮.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'
  import backToMapImg from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  type Choice = { id: string; label: string; correct: boolean; hint: string }
  type Quiz = {
    intro: string
    question: string
    repeatHint: string
    choices: Choice[]
    greetLabel: string
    success: string
  }

  const beginnerQuiz: Quiz = {
    intro: 'Some people may greet with a hongi. Watch and follow guidance.',
    question: 'Before greeting, what should I do?',
    repeatHint: 'Look for the choice that says watch and wait.',
    greetLabel: 'Greet gently if invited',
    success: 'Ka pai! Watch, wait, and greet with respect.',
    choices: [
      { id: 'wait', label: '👀 Watch and wait', correct: true,  hint: '' },
      { id: 'rush', label: '🤝 Rush in',         correct: false, hint: 'Try again. We do not rush into a greeting.' },
      { id: 'fun',  label: '😂 Make fun',        correct: false, hint: 'Try again. A greeting needs respect.' },
    ],
  }

  const confidentQuiz: Quiz = {
    intro: 'Kiki has seen a hongi before. He still needs to watch and wait.',
    question: 'What should Kiki do now?',
    repeatHint: 'Look for the choice that says watch and wait.',
    greetLabel: 'Greet if invited',
    success: 'Ka pai! Kiki waited for guidance.',
    choices: [
      { id: 'wait',     label: '👀 Watch and wait',       correct: true,  hint: '' },
      { id: 'copy',     label: '🤝 Copy it now',          correct: false, hint: 'Try again. Seeing something before does not mean Kiki should copy it by himself.' },
      { id: 'practise', label: '🙂 Practise with a friend', correct: false, hint: 'Try again. A greeting should be done with guidance and respect.' },
    ],
  }

  const quiz = $derived(tikangaState.level === 'beginner' ? beginnerQuiz : confidentQuiz)
  const choices = $derived(quiz.choices)

  let selected   = $state<string | null>(null)
  let shaking    = $state<string | null>(null)
  let step       = $state(1)        // 1 = answering, 2 = greet button shown
  let completed  = $state(false)
  let wrongCount = $state(0)

  // Top tooltip — auto-hides after 3 seconds (same as Station 1).
  let feedback = $state<{ type: 'success' | 'error'; hint?: string } | null>(null)
  let feedbackTimer: ReturnType<typeof setTimeout>

  function showFeedback(type: 'success' | 'error', hint?: string) {
    feedback = { type, hint }
    clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => { feedback = null }, 3000)
  }

  const readText = $derived(`Station 2: Welcome Area. ${quiz.intro} ${quiz.question}`)

  function pick(choice: Choice) {
    if (step > 1) return
    selected = choice.id
    if (!choice.correct) {
      wrongCount += 1
      shaking = choice.id
      const hint = wrongCount >= 2 ? quiz.repeatHint : choice.hint
      speak(hint)
      showFeedback('error', hint)
      setTimeout(() => { shaking = null; selected = null }, 700)
    } else {
      speak('Ka pai! Watch and wait.')
      step = 2
    }
  }

  function greet() {
    completed = true
    speak(quiz.success)
    showFeedback('success')
  }

  function handleNext() {
    tikangaState.completeStation('welcome')
    onNext()
  }
</script>

<div class="page" style="background-image:url({bgImg})">

  <!-- Top tooltip: correct / wrong feedback (auto-hides after 3s) -->
  {#if feedback?.type === 'success'}
    <div class="top-tooltip success fade-in">
      <img src={kiwiYes} alt="Ka pai" class="tooltip-kiwi" />
      <div class="tooltip-text">
        <strong>Station 2 complete! ✓</strong>
        <span>{quiz.success}</span>
      </div>
    </div>
  {:else if feedback?.type === 'error'}
    <div class="top-tooltip error fade-in">
      <img src={kiwiTry} alt="Try again" class="tooltip-kiwi" />
      <div class="tooltip-text">
        <strong>Try again</strong>
        <span>{feedback.hint}</span>
      </div>
    </div>
  {/if}

  <!-- Mini-map top-right -->
  <img src={miniMapImg} alt="Marae Visit Map — Station 2 lit" class="mini-map" />

  <!-- Back button -->
  <button class="map-btn" onclick={onBack} aria-label="Back to map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>

  <div class="content">

    <!-- Kiwi guide — fixed at top of content -->
    <img
      src={completed ? kiwiYes : kiwiHello}
      alt="Kiwi guide"
      class="kiwi-img"
    />

    <!-- Scrollable question area -->
    <div class="scroll-area">

      <div class="card fade-in">
        <p class="intro">{quiz.intro}</p>
        <h2>{quiz.question}</h2>
        <div class="choices">
          {#each choices as c}
            <button
              class="choice"
              class:correct={selected === c.id && c.correct}
              class:wrong={selected === c.id && !c.correct}
              class:shake={shaking === c.id}
              onclick={() => pick(c)}
              disabled={step > 1}
              aria-pressed={selected === c.id}
            >
              {c.label}
            </button>
          {/each}
        </div>

        <!-- Step 2: greet button appears after the correct answer -->
        {#if step >= 2}
          <button class="greet-btn fade-in" onclick={greet} disabled={completed}>
            {quiz.greetLabel}
          </button>
        {/if}
      </div>

    </div>

    <!-- Next button (image) — last item inside content -->
    <button
      class="next-img-btn"
      onclick={handleNext}
      disabled={!completed}
      aria-disabled={!completed}
      aria-label={completed ? 'Next: Station 3' : 'Complete the challenge to continue'}
    >
      <img src={completed ? nextBtn : lockedBtn} alt={completed ? 'Next' : 'Locked'} />
    </button>
  </div>

  <button class="help-btn" onclick={() => speak('Wait for the kaumātua elder to approach. The hongi — pressing foreheads and noses — is a sacred greeting. Always let the elder lead.')} aria-label="Need help?">
    <img src={needHelp} alt="Need help?" />
  </button>

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
    padding: 80px 16px 24px;
    box-sizing: border-box;
    overflow: hidden;
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

  .content {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 560px;
    margin-left: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    /* fill remaining vertical space so the scroll-area can flex */
    flex: 1;
    min-height: 0;
  }

  /* Kiwi guide — fixed, never scrolls */
  .kiwi-img {
    width: min(110px, 18vw);
    height: min(110px, 18vw);
    object-fit: contain;
    flex-shrink: 0;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.2));
  }

  /* Scrollable question area */
  .scroll-area {
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 4px 6px;
    box-sizing: border-box;
  }
  .scroll-area::-webkit-scrollbar { width: 8px; }
  .scroll-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,.2); border-radius: 8px; }

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
    color: #000;
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
    position: fixed;
    bottom: 18px;
    right: 18px;
    z-index: 50;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform .15s;
  }
  .help-btn:hover { transform: scale(1.08) translateY(-3px); }
  .help-btn img { width: min(160px, 18vw); height: auto; filter: drop-shadow(0 4px 12px rgba(0,0,0,.25)); }

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


  /* Next button (image) */
  .next-img-btn {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform .15s, filter .15s;
  }
  .next-img-btn img {
    width: min(260px, 40vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
  }
  .next-img-btn:not(:disabled) { animation: nextBreathe 2s ease-in-out infinite; }
  .next-img-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.03); animation: none; }
  .next-img-btn:disabled { cursor: not-allowed; opacity: .9; }
  @keyframes nextBreathe {
    0%,100% { transform: scale(1);    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3)); }
    50%      { transform: scale(1.04); filter: drop-shadow(0 8px 22px rgba(245,166,35,.6)); }
  }

  .rtm-nav { position: fixed; bottom: 18px; left: 18px; z-index: 50; }

  /* Intro line above the question */
  .intro {
    margin: 0;
    font-size: clamp(14px, 1.9vw, 17px);
    font-weight: 700;
    color: #444;
    line-height: 1.45;
  }

  /* Step-2 greet button */
  .greet-btn {
    margin-top: 4px;
    align-self: stretch;
    border: none;
    border-radius: 14px;
    padding: 16px 20px;
    font-family: inherit;
    font-size: clamp(15px, 2.2vw, 20px);
    font-weight: 800;
    color: #fff;
    background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(22,163,74,.4);
    transition: transform .15s, box-shadow .15s;
    animation: greetBreathe 1.8s ease-in-out infinite;
  }
  .greet-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 22px rgba(22,163,74,.55); animation: none; }
  .greet-btn:disabled { opacity: .65; cursor: default; animation: none; }
  @keyframes greetBreathe {
    0%,100% { transform: scale(1);    box-shadow: 0 4px 14px rgba(22,163,74,.4); }
    50%      { transform: scale(1.03); box-shadow: 0 8px 22px rgba(22,163,74,.6); }
  }

  /* Top tooltip — same as Station 1 */
  .top-tooltip {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 24px 12px 14px;
    border-radius: 100px;
    box-shadow: 0 6px 24px rgba(0,0,0,.22);
    max-width: min(560px, 80vw);
    animation: slideDown .35s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateX(-50%) translateY(-24px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .top-tooltip.success { background: #e8f9ee; border: 2.5px solid #4caf50; }
  .top-tooltip.error   { background: #fff8ec; border: 2.5px solid #F5A623; }
  .tooltip-kiwi { width: 52px; height: 52px; object-fit: contain; flex-shrink: 0; }
  .tooltip-text { display: flex; flex-direction: column; gap: 2px; }
  .tooltip-text strong { font-size: 15px; font-weight: 900; color: #111; }
  .tooltip-text span { font-size: 14px; font-weight: 600; color: #333; line-height: 1.4; }
  .top-tooltip.success .tooltip-text strong { color: #2e7d32; }
  .top-tooltip.error   .tooltip-text strong { color: #8a5a00; }
</style>
