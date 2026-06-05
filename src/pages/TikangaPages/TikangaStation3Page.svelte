<!-- Tikanga Module — Page 5: Station 3 Wharenui (meeting house) -->
<script lang="ts">
  import bgImg      from '../../assets/tikanga/p5 background.png'
  import kiwiThink  from '../../assets/tikanga/kiwithink.png'
  import kiwiYes    from '../../assets/tikanga/kiwiyes.png'
  import kiwiTry    from '../../assets/tikanga/kiwitryagain.png'
  import needHelp   from '../../assets/tikanga/need help.png'
  import lockedBtn  from '../../assets/tikanga/p5 locked next button.png'
  import nextBtn    from '../../assets/tikanga/p5 next button.png'
  import miniMapImg from '../../assets/tikanga/p5 map 3 亮.png'

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

  type Option = { id: string; label: string; correct: boolean; hint: string }
  type Quiz = {
    title: string
    intro: string
    question: string
    success: string
    repeatHint: string
    helpText: string
    options: Option[]
  }

  const beginnerQuiz: Quiz = {
    title: 'Wharenui',
    intro: 'Wharenui = meeting house / special meeting space.',
    question: 'Inside, what shows respect?',
    success: 'Ka pai! Calm body, listening ears.',
    repeatHint: 'Inside, calm body and careful hands help.',
    helpText: 'Look respectfully. Keep hands to yourself. Follow the group.',
    options: [
      { id: 'listen', label: '👂 Sit and listen',     correct: true,  hint: '' },
      { id: 'watch',  label: '👀 Watch the speaker',   correct: true,  hint: '' },
      { id: 'run',    label: '🏃 Run around',          correct: false, hint: 'Try again. Running inside can disturb others.' },
      { id: 'eat',    label: '🍪 Eat inside',          correct: false, hint: 'Try again. Kai belongs in the right place.' },
      { id: 'climb',  label: '🪑 Climb on furniture',  correct: false, hint: 'Try again. We look after special places.' },
    ],
  }

  const confidentQuiz: Quiz = {
    title: 'Wharenui',
    intro: 'Wharenui = special meeting space.',
    question: 'Inside the wharenui, choose two respectful actions.',
    success: 'Ka pai! Calm body, careful hands.',
    repeatHint: 'Inside, calm body and careful hands help.',
    helpText: 'Look respectfully. Keep hands to yourself. Follow the group.',
    options: [
      { id: 'listen', label: '👂 Sit and listen',    correct: true,  hint: '' },
      { id: 'watch',  label: '👀 Watch the speaker',  correct: true,  hint: '' },
      { id: 'photos', label: '📸 Take photos',        correct: false, hint: 'Try again. Kiki should not take photos unless the group is told it is okay.' },
      { id: 'touch',  label: '✋ Touch carvings',      correct: false, hint: 'Try again. Looking respectfully is safer than touching.' },
      { id: 'bags',   label: '🎒 Put bags anywhere',  correct: false, hint: 'Try again. Kiki should follow where the group puts their things.' },
    ],
  }

  const quiz = $derived(tikangaState.level === 'beginner' ? beginnerQuiz : confidentQuiz)
  const options = $derived(quiz.options)

  let selected    = $state<Set<string>>(new Set())
  let checked     = $state(false)
  let completed   = $state(false)
  let shaking     = $state<string | null>(null)
  let wrongChecks = $state(0)

  const canCheck = $derived(selected.size === 2)

  // Top tooltip — auto-hides after 3 seconds (same as Station 1 & 2).
  let feedback = $state<{ type: 'success' | 'error' | 'hint'; hint?: string } | null>(null)
  let feedbackTimer: ReturnType<typeof setTimeout>

  function showFeedback(type: 'success' | 'error' | 'hint', hint?: string) {
    feedback = { type, hint }
    clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => { feedback = null }, type === 'hint' ? 5000 : 3000)
  }

  // Read to me speaks exactly what is on screen: title, intro, question, every option.
  const readText = $derived(
    `${quiz.title}. ${quiz.intro} ${quiz.question} ${options.map(o => o.label).join('. ')}.`
  )

  // Need help gives a silent hint that points to the two correct options.
  const helpHint = $derived(
    `Tip: try ${options.filter(o => o.correct).map(o => o.label).join(' and ')}.`
  )
  function showHelp() {
    showFeedback('hint', helpHint)
  }

  function toggle(opt: Option) {
    if (completed) return
    if (checked) { checked = false; selected = new Set() }
    const next = new Set(selected)
    if (next.has(opt.id)) {
      next.delete(opt.id)
    } else if (next.size < 2) {
      next.add(opt.id)
    }
    selected = next
  }

  function checkAnswers() {
    checked = true
    const wrongPicks = [...selected].filter(id => options.find(o => o.id === id && !o.correct))
    if (wrongPicks.length === 0 && selected.size === 2) {
      completed = true
      showFeedback('success')
    } else {
      wrongChecks += 1
      const wrongOpt = options.find(o => wrongPicks.includes(o.id))
      if (wrongOpt) {
        shaking = wrongOpt.id
        // On the 2nd+ wrong check, give the stronger "calm body, careful hands" hint.
        const hint = wrongChecks >= 2 ? quiz.repeatHint : wrongOpt.hint
        showFeedback('error', hint)
        setTimeout(() => { shaking = null }, 600)
      }
    }
  }

  function handleNext() {
    tikangaState.completeStation('wharenui')
    onNext()
  }
</script>

<div class="page" style="background-image:url({bgImg})">

  <!-- Top tooltip: correct / wrong feedback (auto-hides after 3s) -->
  {#if feedback?.type === 'success'}
    <div class="top-tooltip success fade-in">
      <img src={kiwiYes} alt="Ka pai" class="tooltip-kiwi" />
      <div class="tooltip-text">
        <strong>Station 3 complete! ✓</strong>
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
  <img src={miniMapImg} alt="Marae Visit Map — Station 3 lit" class="mini-map" />

  <!-- Settings — left of the mini-map -->
  <button class="settings-btn" onclick={() => (settings.open = true)} aria-label="Settings">
    <img src={settingsImg} alt="Settings" />
  </button>

  <!-- Back button -->
  <button class="map-btn" onclick={onBack} aria-label="Back to map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>

  <div class="content">

    <!-- Kiwi guide — fixed at top of content -->
    <img src={completed ? kiwiYes : kiwiThink} alt="Kiwi guide" class="kiwi-img" />

    <!-- Scrollable question area -->
    <div class="scroll-area">
      <div class="card fade-in">
        <h2 class="station-title">{quiz.title}</h2>
        <p class="intro">{quiz.intro}</p>
        <p class="question">{quiz.question}</p>

        <div class="choices">
          {#each options as opt}
            <button
              class="choice"
              class:selected={selected.has(opt.id)}
              class:correct={checked && selected.has(opt.id) && opt.correct}
              class:wrong={checked && selected.has(opt.id) && !opt.correct}
              class:shake={shaking === opt.id}
              onclick={() => toggle(opt)}
              disabled={completed}
              aria-pressed={selected.has(opt.id)}
            >
              <span class="choice-label">{opt.label}</span>
              {#if selected.has(opt.id)}
                <span class="tick" aria-hidden="true">{checked && opt.correct ? '✓' : '●'}</span>
              {/if}
            </button>
          {/each}
        </div>

        <p class="select-hint">Select 2 ({selected.size}/2)</p>

        <!-- Check answers button -->
        {#if !completed}
          <button class="check-btn" onclick={checkAnswers} disabled={!canCheck}>
            Check answers
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
      aria-label={completed ? 'Next: Station 4' : 'Complete the challenge to continue'}
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
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.3));
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
    align-items: center;
    gap: 16px;
    box-sizing: border-box;
  }

  .station-title {
    font-size: clamp(20px, 3vw, 30px);
    font-weight: 900;
    color: #8B4513;
    text-align: center;
    margin: 0;
    line-height: 1.2;
    letter-spacing: 0.3px;
  }
  .intro {
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
    text-align: center;
    line-height: 1.3;
  }

  /* Choices — vertical rows, same as Station 2 */
  .choices {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .choice {
    position: relative;
    border: 3px solid #e0e0e0;
    border-radius: 14px;
    padding: 16px 44px 16px 20px;
    font-family: inherit;
    cursor: pointer;
    background: #fafafa;
    text-align: left;
    transition: transform .15s ease, border-color .2s ease, background .2s ease;
    outline: none;
  }
  .choice:hover:not(:disabled) { transform: translateX(4px); border-color: #aaa; }
  .choice:disabled { cursor: not-allowed; opacity: .55; }
  .choice.selected { border-color: #2255cc; background: #f0f4ff; }
  /* Correct hotspot — soft warm green glow */
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
  /* Wrong pick — gentle amber tint only */
  .choice.wrong { border-color: #F5C97B !important; background: #fffbf0 !important; }

  .choice-label {
    font-size: clamp(15px, 2.2vw, 20px);
    font-weight: 700;
    color: #000;
  }

  .tick {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    font-size: 18px;
    font-weight: 900;
    color: #2255cc;
  }
  .choice.correct .tick { color: #4caf50; }
  .choice.wrong   .tick { color: #d9a441; }

  .select-hint { margin: 0; font-size: 15px; font-weight: 700; color: #555; }

  .check-btn {
    border: none;
    border-radius: 100px;
    padding: 14px 30px;
    font-family: inherit;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    background: #2255cc;
    color: #fff;
    box-shadow: 0 4px 12px rgba(34,85,204,.35);
    transition: transform .12s, box-shadow .12s;
  }
  .check-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(34,85,204,.45); }
  .check-btn:disabled {
    background: #d0d0d0;
    color: #888;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

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

  /* Top tooltip — same as Station 1 & 2 */
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
