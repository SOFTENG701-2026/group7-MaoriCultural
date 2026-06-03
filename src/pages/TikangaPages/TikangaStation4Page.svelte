<!-- Tikanga Module — Page 6: Station 4 Kai & Care -->
<script lang="ts">
  import bgImg1     from '../../assets/tikanga/p6 background1.png'
  import bgImg2     from '../../assets/tikanga/p6 background2.png'
  import kiwiListen from '../../assets/tikanga/kiwiListenCarefully.png'
  import kiwiYes    from '../../assets/tikanga/kiwiyes.png'
  import kiwiTry    from '../../assets/tikanga/kiwitryagain.png'
  import needHelp   from '../../assets/tikanga/need help.png'
  import lockedBtn  from '../../assets/tikanga/p6 locked next button.png'
  import nextBtn    from '../../assets/tikanga/p6 next button.png'
  import miniMapImg from '../../assets/tikanga/p6 map 4亮.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'
  import backToMapImg from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  type Choice = { id: string; label: string; correct: boolean; hint: string }
  type Quiz = {
    title: string
    support: string[]
    kaiQuestion: string
    kaiSuccess: string
    careQuestion: string
    finalSuccess: string
    repeatHint: string
    helpText: string
    kaiChoices: Choice[]
    careChoices: Choice[]
  }

  const beginnerQuiz: Quiz = {
    title: 'Kai and Care',
    support: [],
    kaiQuestion: 'It is kai time. What should I do?',
    kaiSuccess: 'You waited and said thank you.',
    careQuestion: 'After kai, how can I care for this place?',
    finalSuccess: 'Ka pai! You cared for people and place.',
    repeatHint: 'Look for the safe caring choice.',
    helpText: 'Wait, share, and say thank you. Then help care for this place safely.',
    kaiChoices: [
      { id: 'wait', label: '🍽️ Wait and say thank you', correct: true,  hint: '' },
      { id: 'push', label: '🏃 Push in',                 correct: false, hint: 'Try again. Pushing is not fair to others.' },
      { id: 'all',  label: '🍰 Take all the kai',        correct: false, hint: 'Try again. Sharing kai is kind.' },
    ],
    careChoices: [
      { id: 'tidy',    label: '🌿 Tell an adult or tidy safely', correct: true,  hint: '' },
      { id: 'rubbish', label: '🗑️ Leave rubbish',               correct: false, hint: 'Try again. We care for this place.' },
      { id: 'plants',  label: '👟 Step on plants',               correct: false, hint: 'Try again. Plants need care too.' },
    ],
  }

  const confidentQuiz: Quiz = {
    title: 'Kai and Care',
    support: ['Manaakitanga = care for people.', 'Kaitiakitanga = care for place.'],
    kaiQuestion: 'What shows manaakitanga?',
    kaiSuccess: 'You cared for people.',
    careQuestion: 'What shows kaitiakitanga?',
    finalSuccess: 'Ka pai! You cared for people and the place.',
    repeatHint: 'Look for the safe caring choice.',
    helpText: 'Manaakitanga means caring for people. Kaitiakitanga means caring for the place. Wait, share, and help safely.',
    kaiChoices: [
      { id: 'share',     label: '🍽️ Wait and share',            correct: true,  hint: '' },
      { id: 'favourite', label: '🍰 Take favourite food first',  correct: false, hint: 'Try again. Manaakitanga means thinking about others too.' },
      { id: 'before',    label: '🧃 Eat before others',          correct: false, hint: 'Try again. Wait until it is time to eat.' },
    ],
    careChoices: [
      { id: 'care',    label: '🌿 Help care for the place',     correct: true,  hint: '' },
      { id: 'move',    label: '🛠️ Move things without asking',  correct: false, hint: 'Try again. Helping is good, but Kiki should not move things unless it is okay.' },
      { id: 'rubbish', label: '🗑️ Leave rubbish',               correct: false, hint: 'Try again. Visitors can still help care for the place.' },
    ],
  }

  const quiz = $derived(tikangaState.level === 'beginner' ? beginnerQuiz : confidentQuiz)
  const kaiChoices  = $derived(quiz.kaiChoices)
  const careChoices = $derived(quiz.careChoices)

  let kaiAnswer  = $state<string | null>(null)
  let careAnswer = $state<string | null>(null)
  let part       = $state(1)   // 1 = kai, 2 = care
  let completed  = $state(false)
  let shaking    = $state<string | null>(null)
  let wrongCount = $state(0)

  const bgImg = $derived(part >= 2 ? bgImg2 : bgImg1)

  // Top tooltip — auto-hides after 3 seconds (same as Station 1–3).
  let feedback = $state<{ type: 'success' | 'error' | 'hint'; title: string; msg: string } | null>(null)
  let feedbackTimer: ReturnType<typeof setTimeout>

  function showFeedback(type: 'success' | 'error' | 'hint', title: string, msg: string) {
    feedback = { type, title, msg }
    clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => { feedback = null }, type === 'hint' ? 5000 : 3000)
  }

  // Read to me speaks exactly what is on screen for the current step.
  const readText = $derived(
    part >= 2
      ? `${quiz.title}. ${quiz.careQuestion} ${careChoices.map(c => c.label).join('. ')}.`
      : `${quiz.title}. ${quiz.support.join(' ')} ${quiz.kaiQuestion} ${kaiChoices.map(c => c.label).join('. ')}.`
  )

  // Need help gives a silent hint that points to the current step's answer.
  const helpHint = $derived(
    part >= 2
      ? `Tip: try ${careChoices.find(c => c.correct)?.label}.`
      : `Tip: try ${kaiChoices.find(c => c.correct)?.label}.`
  )
  function showHelp() {
    showFeedback('hint', 'Hint', helpHint)
  }

  function pickKai(c: Choice) {
    if (part !== 1) return
    kaiAnswer = c.id
    if (!c.correct) {
      wrongCount += 1
      shaking = c.id
      const hint = wrongCount >= 2 ? quiz.repeatHint : c.hint
      showFeedback('error', 'Try again', hint)
      setTimeout(() => { shaking = null; kaiAnswer = null }, 700)
    } else {
      wrongCount = 0
      showFeedback('success', 'Ka pai!', quiz.kaiSuccess)
      setTimeout(() => { part = 2 }, 800)
    }
  }

  function pickCare(c: Choice) {
    if (completed) return
    careAnswer = c.id
    if (!c.correct) {
      wrongCount += 1
      shaking = c.id
      const hint = wrongCount >= 2 ? quiz.repeatHint : c.hint
      showFeedback('error', 'Try again', hint)
      setTimeout(() => { shaking = null; careAnswer = null }, 700)
    } else {
      completed = true
      showFeedback('success', 'Station 4 complete! ✓', quiz.finalSuccess)
    }
  }

  function handleNext() {
    tikangaState.completeStation('kaiCare')
    onNext()
  }
</script>

<div class="page" style="background-image:url({bgImg})">

  <!-- Top tooltip: correct / wrong feedback (auto-hides after 3s) -->
  {#if feedback?.type === 'success'}
    <div class="top-tooltip success fade-in">
      <img src={kiwiYes} alt="Ka pai" class="tooltip-kiwi" />
      <div class="tooltip-text">
        <strong>{feedback.title}</strong>
        <span>{feedback.msg}</span>
      </div>
    </div>
  {:else if feedback?.type === 'error'}
    <div class="top-tooltip error fade-in">
      <img src={kiwiTry} alt="Try again" class="tooltip-kiwi" />
      <div class="tooltip-text">
        <strong>{feedback.title}</strong>
        <span>{feedback.msg}</span>
      </div>
    </div>
  {:else if feedback?.type === 'hint'}
    <div class="top-tooltip hint fade-in">
      <div class="tooltip-text">
        <strong>{feedback.title}</strong>
        <span>{feedback.msg}</span>
      </div>
    </div>
  {/if}

  <!-- Mini-map top-right -->
  <img src={miniMapImg} alt="Marae Visit Map — Station 4 lit" class="mini-map" />

  <!-- Back button -->
  <button class="map-btn" onclick={onBack} aria-label="Back to map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>

  <div class="content">

    <!-- Kiwi guide — fixed at top of content -->
    <img src={completed ? kiwiYes : kiwiListen} alt="Kiwi guide" class="kiwi-img" />

    <!-- Scrollable question area -->
    <div class="scroll-area">

      <!-- Part A: Kai time (hidden once answered) -->
      {#if part === 1}
        <div class="card fade-in">
          <h2 class="station-title">{quiz.title}</h2>
          {#if quiz.support.length}
            <div class="support">
              {#each quiz.support as line}<p>{line}</p>{/each}
            </div>
          {/if}
          <div class="badge">Kai time</div>
          <p class="question">{quiz.kaiQuestion}</p>

          <div class="choices">
            {#each kaiChoices as c}
              <button
                class="choice"
                class:correct={kaiAnswer === c.id && c.correct}
                class:wrong={kaiAnswer === c.id && !c.correct}
                class:shake={shaking === c.id}
                onclick={() => pickKai(c)}
                aria-pressed={kaiAnswer === c.id}
              >
                {c.label}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Part B: After kai (fades in after Part A) -->
      {#if part >= 2}
        <div class="card fade-in">
          <h2 class="station-title">{quiz.title}</h2>
          {#if quiz.support.length}
            <div class="support">
              {#each quiz.support as line}<p>{line}</p>{/each}
            </div>
          {/if}
          <div class="badge">After kai</div>
          <p class="question">{quiz.careQuestion}</p>

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
        </div>
      {/if}

    </div>

    <!-- Next button (image) — last item inside content -->
    <button
      class="next-img-btn"
      onclick={handleNext}
      disabled={!completed}
      aria-disabled={!completed}
      aria-label={completed ? 'Next: Review' : 'Complete the challenge to continue'}
    >
      <img src={completed ? nextBtn : lockedBtn} alt={completed ? 'Next' : 'Locked'} />
    </button>
  </div>

  <button class="help-btn" onclick={showHelp} aria-label="Need help?">
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
    max-width: 620px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
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

  .station-title {
    font-size: clamp(20px, 3vw, 30px);
    font-weight: 900;
    color: #b85400;
    text-align: center;
    margin: 0;
    line-height: 1.2;
    letter-spacing: 0.3px;
  }

  .support {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
  }
  .support p {
    margin: 0;
    font-size: clamp(13px, 1.8vw, 16px);
    font-weight: 700;
    color: #555;
    text-align: center;
    line-height: 1.4;
  }

  .question {
    margin: 0;
    font-size: clamp(17px, 2.5vw, 24px);
    font-weight: 900;
    color: #111;
    line-height: 1.3;
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
    transition: transform .15s, border-color .2s, box-shadow .2s;
    outline: none;
  }
  .choice:hover:not(:disabled) { transform: translateX(4px); border-color: #aaa; }
  .choice:disabled { cursor: not-allowed; opacity: .55; }
  /* Correct — soft warm green glow */
  .choice.correct {
    border-color: #6fcf78 !important;
    background: #f0fff4 !important;
    opacity: 1 !important;
    box-shadow: 0 0 0 3px rgba(111,207,120,.35), 0 0 18px 4px rgba(111,207,120,.55) !important;
    animation: softGlow 1.8s ease-in-out infinite;
  }
  @keyframes softGlow {
    0%, 100% { box-shadow: 0 0 0 3px rgba(111,207,120,.30), 0 0 14px 3px rgba(111,207,120,.45); }
    50%       { box-shadow: 0 0 0 3px rgba(111,207,120,.45), 0 0 24px 7px rgba(111,207,120,.7); }
  }
  /* Wrong — gentle amber tint only */
  .choice.wrong { border-color: #F5C97B !important; background: #fffbf0 !important; }

  /* Help button — fixed bottom-right */
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

  /* Top tooltip — same as Station 1–3 */
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
  .top-tooltip.hint    { background: #eef4ff; border: 2.5px solid #2255cc; }
  .tooltip-kiwi { width: 52px; height: 52px; object-fit: contain; flex-shrink: 0; }
  .tooltip-text { display: flex; flex-direction: column; gap: 2px; }
  .tooltip-text strong { font-size: 15px; font-weight: 900; color: #111; }
  .tooltip-text span { font-size: 14px; font-weight: 600; color: #333; line-height: 1.4; }
  .top-tooltip.success .tooltip-text strong { color: #2e7d32; }
  .top-tooltip.error   .tooltip-text strong { color: #8a5a00; }
  .top-tooltip.hint    .tooltip-text strong { color: #1a3e9e; }
</style>
