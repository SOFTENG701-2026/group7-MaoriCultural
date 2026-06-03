<!-- Tikanga Module — Page 7: Review (all stations complete) -->
<script lang="ts">
  import bgImg        from '../../assets/tikanga/p7 background.png'
  import kikiComplete from '../../assets/tikanga/p7 kiki complete.png'
  import entranceIcon from '../../assets/tikanga/p7 entrance icon.png'
  import welcomeIcon  from '../../assets/tikanga/p7 welcome area icon.png'
  import wharenuiIcon from '../../assets/tikanga/p7 wharenui icon.png'
  import kaiIcon      from '../../assets/tikanga/p7 kai are icon.png'
  import finishImg    from '../../assets/tikanga/p7 finish.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'
  import backToMapImg from '../../assets/pepeha/transparent_ui_assets/button_back_to_map.png'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  type Summary = { icon: string; emoji: string; label: string }

  const beginnerSummary: Summary[] = [
    { icon: entranceIcon, emoji: '👂',   label: 'Listen first' },
    { icon: welcomeIcon,  emoji: '👀',   label: 'Watch and wait' },
    { icon: wharenuiIcon, emoji: '🏠',   label: 'Stay calm inside' },
    { icon: kaiIcon,      emoji: '🍽️🌿', label: 'Share kai and care' },
  ]

  const confidentSummary: Summary[] = [
    { icon: entranceIcon, emoji: '👂', label: 'Manuhiri listen' },
    { icon: welcomeIcon,  emoji: '👀', label: 'Watch and wait' },
    { icon: wharenuiIcon, emoji: '🏠', label: 'Respect wharenui' },
    { icon: kaiIcon,      emoji: '🌿', label: 'Care for people and place' },
  ]

  const isConfident = $derived(tikangaState.level === 'confident')
  const kikiSays = $derived(isConfident ? 'You helped me follow tikanga.' : 'You helped me make respectful choices.')
  const summary  = $derived(isConfident ? confidentSummary : beginnerSummary)
  const reminder = 'In real life, listen to the people leading the visit.'

  // Confident-only short check
  const checkOptions = [
    { id: 'context', label: 'People, place, and context', correct: true },
    { id: 'one',     label: 'One rule everywhere',        correct: false },
    { id: 'words',   label: 'Only saying Māori words',    correct: false },
  ]
  let checkAnswer = $state<string | null>(null)
  let checkPassed = $state(false)
  let shaking     = $state<string | null>(null)

  function pickCheck(opt: { id: string; correct: boolean }) {
    if (checkPassed) return
    checkAnswer = opt.id
    if (opt.correct) {
      checkPassed = true
      speak('Ka pai! Tikanga is respect in the right context.')
    } else {
      shaking = opt.id
      speak('Try again. Tikanga depends on people, place, and context.')
      setTimeout(() => { shaking = null }, 600)
    }
  }

  // Beginner has no check, so the finish button shows straight away.
  // Confident must pick the correct answer first.
  const showFinish = $derived(!isConfident || checkPassed)

  const readText = $derived(
    `Marae Visit Complete! ${kikiSays} ` +
    summary.map(s => s.label).join('. ') + '. ' +
    (isConfident ? 'Tikanga can depend on people, place, and context.' : reminder)
  )
</script>

<div class="page" style="background-image:url({bgImg})">

  <button class="map-btn" onclick={onBack} aria-label="Back to map">
    <img src={backToMapImg} alt="Back to Map" />
  </button>

  <div class="content">

    <!-- Kiki + speech — fixed, never scrolls -->
    <div class="kiki-row">
      <img src={kikiComplete} alt="Kiki" class="kiki-img" />
      <div class="speech">{kikiSays}</div>
    </div>

    <!-- Scrollable area: achievements + reminder/check -->
    <div class="scroll-area">

      <!-- Map summary — 2×2 achievement grid -->
      <div class="summaries">
        {#each summary as s, i}
          <div class="summary-card station-complete" style="animation-delay:{i * 0.1}s">
            <img src={s.icon} alt="" class="s-icon-img" />
            <span class="s-label">{s.emoji} {s.label}</span>
            <span class="s-tick">✓</span>
          </div>
        {/each}
      </div>

      <!-- Beginner: reminder -->
      {#if !isConfident}
        <div class="reminder fade-in">
          <span class="reminder-icon">💡</span>
          <p>{reminder}</p>
        </div>
      {/if}

      <!-- Confident: short check -->
      {#if isConfident}
        <div class="check-card fade-in">
          <h2>Tikanga can depend on…</h2>
          <div class="choices">
            {#each checkOptions as opt}
              <button
                class="choice"
                class:correct={checkAnswer === opt.id && opt.correct}
                class:wrong={checkAnswer === opt.id && !opt.correct}
                class:shake={shaking === opt.id}
                onclick={() => pickCheck(opt)}
                disabled={checkPassed && !opt.correct}
                aria-pressed={checkAnswer === opt.id}
              >
                {opt.label}
              </button>
            {/each}
          </div>
          {#if checkPassed}
            <div class="check-success fade-in">
              <span>✓ Ka pai! Tikanga is respect in the right context.</span>
            </div>
          {/if}
        </div>
      {/if}

    </div>

    <!-- Collect badge — finish image button, only after the correct answer -->
    {#if showFinish}
      <button class="finish-btn fade-in" onclick={onNext} aria-label="Collect your badge">
        <img src={finishImg} alt="Finish — collect your badge" />
      </button>
    {/if}

  </div>

  <nav class="rtm-nav"><ReadToMe text={readText} /></nav>
</div>

<style>
  .page {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Nunito', system-ui, sans-serif;
    padding: 70px 16px 24px;
    box-sizing: border-box;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-height: 0;
  }

  /* Scrollable area below the fixed kiki-row */
  .scroll-area {
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px 6px;
    box-sizing: border-box;
  }
  .scroll-area::-webkit-scrollbar { width: 8px; }
  .scroll-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,.2); border-radius: 8px; }

  /* Kiki + speech — fixed, never scrolls */
  .kiki-row {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }
  .kiki-img {
    width: min(120px, 22vw);
    height: auto;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.25));
    animation: bounce .7s ease-in-out;
  }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  .speech {
    position: relative;
    background: #fff;
    border-radius: 18px;
    padding: 14px 20px;
    font-size: clamp(15px, 2vw, 19px);
    font-weight: 800;
    color: #1a3000;
    box-shadow: 0 4px 16px rgba(0,0,0,.18);
    max-width: 320px;
    line-height: 1.4;
  }
  .speech::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border: 8px solid transparent;
    border-right-color: #fff;
  }

  /* Map summary — single row of 4 achievements */
  .summaries {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .summary-card {
    position: relative;
    background: rgba(255,255,255,.95);
    border: 2.5px solid #4caf50;
    border-radius: 16px;
    padding: 14px 8px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 14px rgba(0,0,0,.1);
  }
  .s-icon-img { width: min(48px, 9vw); height: min(48px, 9vw); object-fit: contain; }
  .s-label { font-size: clamp(11px, 1.5vw, 14px); font-weight: 800; color: #1a4a2e; text-align: center; line-height: 1.25; }
  .s-tick  {
    position: absolute;
    top: 6px;
    right: 8px;
    font-size: 16px;
    color: #4caf50;
    font-weight: 900;
  }

  /* Beginner reminder */
  .reminder {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,.95);
    border: 2.5px solid #F5A623;
    border-radius: 16px;
    padding: 14px 20px;
    box-shadow: 0 4px 14px rgba(0,0,0,.12);
  }
  .reminder-icon { font-size: 26px; flex-shrink: 0; }
  .reminder p { margin: 0; font-size: clamp(14px, 2vw, 17px); font-weight: 700; color: #5a3a00; line-height: 1.4; }

  /* Confident check */
  .check-card {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,.96);
    border-radius: 20px;
    padding: 22px 22px 18px;
    box-shadow: 0 8px 28px rgba(0,0,0,.18);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .check-card h2 {
    margin: 0;
    font-size: clamp(18px, 2.6vw, 24px);
    font-weight: 900;
    color: #111;
    text-align: center;
  }
  .choices { display: flex; flex-direction: column; gap: 10px; }
  .choice {
    border: 3px solid #e0e0e0;
    border-radius: 14px;
    padding: 16px 20px;
    font-family: inherit;
    font-size: clamp(15px, 2.2vw, 19px);
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
  .choice.wrong { border-color: #F5C97B !important; background: #fffbf0 !important; }

  .check-success {
    background: #f0fff4;
    border: 2px solid #4caf50;
    border-radius: 12px;
    padding: 12px 16px;
    text-align: center;
  }
  .check-success span { font-size: 15px; font-weight: 800; color: #2e7d32; }

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


  /* Finish image button */
  .finish-btn {
    flex-shrink: 0;
    margin-top: 4px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    animation: finishBreathe 2s ease-in-out infinite;
    transition: transform .15s, filter .15s;
  }
  .finish-btn img {
    height: 52px;
    width: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
  }
  .finish-btn:hover { transform: translateY(-3px) scale(1.03); animation: none; }
  .finish-btn:active { transform: scale(0.97); }
  @keyframes finishBreathe {
    0%,100% { transform: scale(1);    filter: drop-shadow(0 6px 16px rgba(245,166,35,.4)); }
    50%      { transform: scale(1.04); filter: drop-shadow(0 10px 26px rgba(245,166,35,.75)); }
  }

  .rtm-nav { position: fixed; bottom: 18px; left: 18px; z-index: 50; }
</style>
