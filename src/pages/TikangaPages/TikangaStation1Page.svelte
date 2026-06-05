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
  import { settings } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'
  import backToMapImg from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'
  import settingsImg  from '../../assets/settings.png'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  type Choice = { id: string; label: string; correct: boolean; hint: string }
  type Quiz = { question: string; success: string; repeatHint: string; choices: Choice[] }

  const beginnerQuiz: Quiz = {
    question: 'We are arriving. What should I do first?',
    success: 'Ka pai! Listening first shows respect.',
    repeatHint: 'Look for the choice where we listen first.',
    choices: [
      { id: 'listen', label: '👂 Listen to the guide', correct: true,  hint: '' },
      { id: 'run',    label: '🏃 Run inside',           correct: false, hint: 'Try again. We listen before going in.' },
      { id: 'shout',  label: '📢 Shout loudly',         correct: false, hint: 'Try again. Quiet listening shows respect.' },
    ],
  }

  const confidentQuiz: Quiz = {
    question: 'Kiki is manuhiri. What should he do first?',
    success: 'Ka pai! Manuhiri wait and listen.',
    repeatHint: 'Look for the choice that keeps Kiki with the group.',
    choices: [
      { id: 'stay', label: '👂 Stay with the group', correct: true,  hint: '' },
      { id: 'walk', label: '🚶 Walk ahead',          correct: false, hint: 'Try again. Kiki should stay with the group.' },
      { id: 'lead', label: '🗣️ Lead the class',      correct: false, hint: 'Try again. Even if Kiki has visited before, he should follow the people leading this visit.' },
    ],
  }

  const quiz = $derived(tikangaState.level === 'beginner' ? beginnerQuiz : confidentQuiz)
  const choices = $derived(quiz.choices)

  let selected   = $state<string | null>(null)
  let shaking    = $state<string | null>(null)
  let completed  = $state(false)
  let wrongCount = $state(0)

  // Top tooltip — auto-hides after 3 seconds.
  let feedback = $state<{ type: 'success' | 'error' | 'hint'; hint?: string } | null>(null)
  let feedbackTimer: ReturnType<typeof setTimeout>

  function showFeedback(type: 'success' | 'error' | 'hint', hint?: string) {
    feedback = { type, hint }
    clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => { feedback = null }, type === 'hint' ? 5000 : 3000)
  }

  // Read to me speaks exactly what is on screen: the question and every choice.
  const readText = $derived(
    `${quiz.question} ${choices.map(c => c.label).join('. ')}.`
  )

  // Need help gives a silent hint that points to the answer option.
  const helpHint = $derived(`Tip: try ${choices.find(c => c.correct)?.label}.`)
  function showHelp() {
    showFeedback('hint', helpHint)
  }

  function pick(choice: Choice) {
    if (completed) return
    selected = choice.id
    if (!choice.correct) {
      wrongCount += 1
      shaking = choice.id
      // On the 2nd+ wrong attempt, give the stronger "point to the answer" hint.
      const hint = wrongCount >= 2 ? quiz.repeatHint : choice.hint
      showFeedback('error', hint)
      setTimeout(() => { shaking = null }, 600)
    } else {
      completed = true
      showFeedback('success')
    }
  }

  function handleNext() {
    tikangaState.completeStation('entrance')
    onNext()
  }
</script>

<div class="page" style="background-image:url({bgImg})">

  <!-- Top tooltip: correct / wrong feedback (auto-hides after 3s) -->
  {#if feedback?.type === 'success'}
    <div class="top-tooltip success fade-in">
      <img src={kiwiYes} alt="Ka pai" class="tooltip-kiwi" />
      <div class="tooltip-text">
        <strong>Station 1 complete! ✓</strong>
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
  {:else if feedback?.type === 'hint'}
    <div class="top-tooltip hint fade-in">
      <div class="tooltip-text">
        <strong>Hint</strong>
        <span>{feedback.hint}</span>
      </div>
    </div>
  {/if}

  <!-- Mini-map top-right -->
  <img src={miniMapImg} alt="Marae Visit Map — Station 1 lit" class="mini-map" />

  <!-- Settings — left of the mini-map -->
  <button class="settings-btn" onclick={() => (settings.open = true)} aria-label="Settings">
    <img src={settingsImg} alt="Settings" />
  </button>

  <!-- Back button -->
  <button class="map-btn" onclick={onBack} aria-label="Back to map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>

  <!-- Main content card -->
  <div class="content">

    <!-- Guide kiwi -->
    <img src={completed ? kiwiYes : listenImg} alt="Kiwi guide" class="kiwi-img" />

    <!-- Question card -->
    <div class="card">
      <h1>{quiz.question}</h1>

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

    </div>

    <!-- Help button -->
    <button class="help-btn" onclick={showHelp} aria-label="Need help?">
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

  /* Settings — left of the mini-map */
  .settings-btn {
    position: fixed;
    top: 14px;
    right: calc(16px + min(140px, 18vw) + 12px);
    z-index: 50;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .settings-btn:hover  { transform: translateY(-3px) scale(1.04); }
  .settings-btn:active { transform: scale(0.97); }
  .settings-btn img {
    width: min(72px, 9vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 60px;
    margin-left: 400px;
  }

  .kiwi-img {
    width: min(140px, 22vw);
    height: min(140px, 22vw);
    object-fit: contain;
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
    color: #000;
    cursor: pointer;
    background: #fafafa;
    text-align: left;
    transition: transform .15s ease, border-color .2s ease, background .2s ease;
    outline: none;
  }
  .choice:hover:not(:disabled) { transform: translateX(4px); border-color: #aaa; }
  .choice:disabled { cursor: not-allowed; opacity: .55; }
  /* Correct answer — soft, warm green glow (no harsh marks) */
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
  /* Wrong choice — gentle amber tint only, no red, no cross */
  .choice.wrong { border-color: #F5C97B !important; background: #fffbf0 !important; }

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

  .next-wrap {
    position: relative;
    z-index: 10;
    margin-top: 16px;
    margin-left: 400px;
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

  /* Top tooltip */
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
  .top-tooltip.success {
    background: #e8f9ee;
    border: 2.5px solid #4caf50;
  }
  .top-tooltip.error {
    background: #fff8ec;
    border: 2.5px solid #F5A623;
  }
  .top-tooltip.hint {
    background: #eef4ff;
    border: 2.5px solid #2255cc;
  }
  .tooltip-kiwi {
    width: 52px;
    height: 52px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .tooltip-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .tooltip-text strong {
    font-size: 15px;
    font-weight: 900;
    color: #111;
  }
  .tooltip-text span {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
  }
  .top-tooltip.success .tooltip-text strong { color: #2e7d32; }
  .top-tooltip.error   .tooltip-text strong { color: #8a5a00; }
  .top-tooltip.hint    .tooltip-text strong { color: #1a3e9e; }
</style>
