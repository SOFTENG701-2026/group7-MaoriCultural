<!--
  Pepeha Module — Page 2: What is a Pepeha?

  Kiki's notebook introduces the four parts of a pepeha.

  Both levels: learn the four parts (tap each row to hear it), then a short
  listen-and-match exercise (2 questions: maunga, awa). Next unlocks after the
  match. Only the words differ by level:
    • Beginner  — simple Māori–English word meanings (`Ingoa = name`); the match
                  plays the single word.
    • Confident — each part inside a full te reo sentence (`Ko te maunga tēnei.`),
                  marked "I tried"; the match plays the full sentence.

  te reo practice sentences should be teacher-reviewed.
  Layout mirrors src/assets/pepeha/page2/reference.png.
-->
<script lang="ts">
  import bgImg       from '../../assets/pepeha/page2/page2_background_with_title.png'
  import notebookImg from '../../assets/pepeha/page2/page2_big_notebook_blank_transparent.png'
  import personImg   from '../../assets/pepeha/page2/page2_person_icon_transparent.png'
  import mountainImg from '../../assets/pepeha/page2/page2_mountain_icon_transparent.png'
  import wavesImg    from '../../assets/pepeha/page2/page2_waves_icon_transparent.png'
  import heartImg    from '../../assets/pepeha/page2/page2_heart_icon_transparent.png'
  import playImg     from '../../assets/pepeha/page2/page2_play_button_transparent.png'
  import lockedNext  from '../../assets/pepeha/page2/page2_next_button_transparent.png'
  import noteIcon    from '../../assets/pepeha/page2/page2_bottom_notebook_small_icon_transparent.png'
  import starIcon    from '../../assets/pepeha/page2/page2_bottom_star_icon_transparent.png'
  import kikiImg     from '../../assets/kiwihello.png'
  import settingsImg from '../../assets/settings.png'

  import { pepehaState } from '../../lib/pepehaState.svelte'
  import { speak, settings } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'
  import AnswerStateBadge from './AnswerStateBadge.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const isBeginner = $derived(pepehaState.level === 'beginner')

  // Kiki's intro line differs by level.
  const kikiLine = $derived(
    isBeginner
      ? 'A pepeha tells who we are and where we belong.'
      : 'A pepeha can connect people, places, and belonging.'
  )

  // The four pepeha parts. Beginner shows `maori = meaning`; Confident shows the
  // full te reo `sentence` (with `sentenceEn` support). `audioB` is the Beginner
  // word prompt; Confident speaks the sentence.
  const PARTS = [
    {
      icon: personImg, maori: 'Ingoa',
      meaning: 'name',
      sentence: 'Ko Kiki tōku ingoa.', sentenceEn: 'My name is Kiki.',
      audioB: 'Ingoa. Name.',
    },
    {
      icon: mountainImg, maori: 'Maunga',
      meaning: 'mountain',
      sentence: 'Ko te maunga tēnei.', sentenceEn: 'This is the mountain.',
      audioB: 'Maunga. Mountain.',
    },
    {
      icon: wavesImg, maori: 'Awa',
      meaning: 'river',
      sentence: 'Ko te awa tēnei.', sentenceEn: 'This is the river.',
      audioB: 'Awa. River.',
    },
    {
      icon: heartImg, maori: 'Whānau',
      meaning: 'people who care for us',
      sentence: 'Ko tōku whānau tēnei.', sentenceEn: 'This is my whānau.',
      audioB: 'Whānau. People who care for us.',
    },
  ]

  // Rows the learner has heard (Beginner) / tried saying (Confident).
  let listened = $state<Set<number>>(new Set())
  const allListened = $derived(listened.size === PARTS.length)

  // ── Listen-and-match exercise (both levels) ──
  // Each entry is the PARTS index whose prompt is played; the learner taps the
  // matching icon. Two questions: maunga, then awa. Beginner hears the word,
  // Confident hears the full sentence.
  const MATCH_QS = [1, 2]
  let matchStep = $state(0)
  let wiggleIdx = $state<number | null>(null)
  let correctIdx = $state<number | null>(null)
  let matchFeedback = $state('')

  // What the learner hears / sees for a given part in the match exercise.
  const matchAudio = (i: number) => (isBeginner ? PARTS[i].audioB : PARTS[i].sentence)
  const matchLabel = (i: number) => (isBeginner ? PARTS[i].maori : PARTS[i].sentence)

  // Both levels progress learn → match → done.
  const stage = $derived(
    !allListened ? 'learn'
    : matchStep < MATCH_QS.length ? 'match'
    : 'done'
  )
  const canProceed = $derived(stage === 'done')

  function tapRow(i: number) {
    listened = new Set([...listened, i])
    speak(isBeginner ? PARTS[i].audioB : PARTS[i].sentence)
  }

  // Auto-play the prompt each time a new match question is shown.
  $effect(() => {
    if (stage === 'match') speak(matchAudio(MATCH_QS[matchStep]))
  })

  function tapMatch(iconIndex: number) {
    if (iconIndex === MATCH_QS[matchStep]) {
      wiggleIdx = null
      correctIdx = iconIndex
      matchFeedback = `Correct. ${PARTS[iconIndex].maori}.`
      speak('Ka pai!')
      // Keep the ✓ Correct badge visible briefly before moving to the next item.
      setTimeout(() => { correctIdx = null; matchStep += 1 }, 800)
    } else {
      wiggleIdx = iconIndex
      matchFeedback = `Incorrect. ${PARTS[iconIndex].maori}. Listen again.`
      speak('Listen again.')
      setTimeout(() => { if (wiggleIdx === iconIndex) wiggleIdx = null }, 600)
    }
  }

  const readText = $derived(
    'What is a Pepeha? ' + kikiLine + ' ' +
    (isBeginner
      ? 'Ingoa, name. Maunga, mountain. Awa, river. Whānau, people who care for us. '
      : 'Ko Kiki tōku ingoa. Ko te maunga tēnei. Ko te awa tēnei. Ko tōku whānau tēnei. ') +
    'Listen, then tap the right picture.'
  )
</script>

<div class="stage" style="background-image:url({bgImg})">

  <!-- Back — top-left -->
  <button class="btn-back" onclick={onBack} aria-label="Back">← Back</button>

  <!-- Settings — top-right -->
  <button class="settings-btn" onclick={() => (settings.open = true)} aria-label="Settings">
    <img src={settingsImg} alt="Settings" />
  </button>

  <!-- Read the title / Kiki line aloud — next to the baked-in title -->
  <button class="title-speak" onclick={() => speak('What is a Pepeha? ' + kikiLine)} aria-label="Read the title">
    <img src={playImg} alt="" />
  </button>

  <!-- Kiki + notebook grouped near centre, with a gap between them -->
  <div class="center-group">

  <!-- Kiki + speech bubble -->
  <div class="kiki-block">
    <div class="bubble">
      <p>{kikiLine}</p>
    </div>
    <img src={kikiImg} alt="Kiki the kiwi" class="kiki-img" />
  </div>

  <!-- Notebook — right -->
  <div class="notebook">
    <img src={notebookImg} alt="" class="notebook-img" />
    <ul class="rows" aria-label="The four parts of a pepeha">
      {#each PARTS as p, i}
        <li>
          <button
            class="row"
            class:done={listened.has(i)}
            onclick={() => tapRow(i)}
            aria-pressed={listened.has(i)}
            aria-label={isBeginner ? `${p.maori}, ${p.meaning}` : p.sentence}
          >
            <img src={p.icon} alt="" class="row-icon" />
            <span class="row-text">
              <span class="row-maori">{isBeginner ? p.maori : p.sentence}</span>
              <span class="row-meaning">{isBeginner ? `= ${p.meaning}` : p.sentenceEn}</span>
            </span>
            <img src={playImg} alt="" class="row-play" />
            {#if listened.has(i)}
              <span class="row-tick" aria-hidden="true">{isBeginner ? '✓' : '✓ I tried'}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  </div>

  </div>

  <!-- Listen-and-match exercise (both levels): match the word/sentence to its picture -->
  {#if stage === 'match'}
    <div class="check-overlay">
      <div class="check-card" role="dialog" aria-label="Listen and match">
        <p class="check-q">Listen, then tap the right picture.</p>
        <button
          class="listen-btn"
          onclick={() => speak(matchAudio(MATCH_QS[matchStep]))}
          aria-label="Listen again"
        >
          <img src={playImg} alt="" />
          <span>{matchLabel(MATCH_QS[matchStep])}</span>
        </button>
        <div class="match-icons">
          {#each PARTS as p, i}
            <button
              class="match-icon"
              class:wiggle={wiggleIdx === i}
              class:correct={correctIdx === i}
              onclick={() => tapMatch(i)}
              disabled={correctIdx !== null}
              aria-label={`${p.maori}${correctIdx === i ? ', correct answer' : wiggleIdx === i ? ', incorrect answer, listen again' : ''}`}
            >
              <img src={p.icon} alt={p.maori} />
              {#if correctIdx === i}
                <AnswerStateBadge state="correct" />
              {:else if wiggleIdx === i}
                <AnswerStateBadge state="wrong" />
              {/if}
            </button>
          {/each}
        </div>
        <p class="match-progress">{matchStep + 1} / {MATCH_QS.length}</p>
        <p class="sr-status" role="status" aria-live="polite">{matchFeedback}</p>
      </div>
    </div>
  {/if}

  <!-- Completion feedback once the match exercise is done -->
  {#if stage === 'done'}
    <p class="feedback">
      {isBeginner ? 'Ka pai! You found all four parts.' : 'Ka pai! You tried all four pepeha sentences.'}
    </p>
  {/if}

  <!-- Bottom bar: hints + Next -->
  <div class="bottom-bar">
    <ReadToMe text={readText} />

    <div class="hints">
      {#if isBeginner}
        <span class="hint"><img src={noteIcon} alt="" /> Tap each icon to listen!</span>
        <span class="hint"><img src={starIcon} alt="" /> Listen and match to unlock Next!</span>
      {:else}
        <span class="hint"><img src={noteIcon} alt="" /> Tap each line, then try saying it!</span>
        <span class="hint"><img src={starIcon} alt="" /> Listen and match to unlock Next!</span>
      {/if}
    </div>

    {#if canProceed}
      <button class="next-btn" onclick={onNext} aria-label="Next page">Next →</button>
    {:else}
      <img src={lockedNext} alt="Next is locked" class="next-locked" />
    {/if}
  </div>

</div>

<style>
  .stage {
    position: fixed;
    inset: 0;
    background-size: cover;
    /* Anchor to the top so the baked-in title is never cropped on wide screens. */
    background-position: center top;
    background-repeat: no-repeat;
    font-family: 'Nunito', system-ui, sans-serif;
    overflow: hidden;
    user-select: none;
  }

  /* Back — top-left */
  .btn-back {
    position: absolute;
    top: 3%;
    left: 2%;
    z-index: 40;
    font-family: inherit;
    font-size: clamp(14px, 1.6vw, 18px);
    font-weight: 800;
    color: #1a5c00;
    padding: 10px 20px;
    border: none;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .btn-back:hover  { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.24); }
  .btn-back:active { transform: translateY(0); }

  /* Settings — top-right */
  .settings-btn {
    position: absolute;
    top: 3%;
    right: 2%;
    z-index: 40;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .settings-btn:hover  { transform: translateY(-3px) scale(1.04); }
  .settings-btn:active { transform: scale(0.97); }
  .settings-btn img {
    width: min(90px, 11.25vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
  }

  /* Speaker beside the baked-in title */
  /* Speaker tucked into the title's lower-right corner */
  .title-speak {
    position: absolute;
    top: 9%;
    left: 66%;
    z-index: 35;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .title-speak:hover  { transform: scale(1.08); }
  .title-speak:active { transform: scale(0.95); }
  .title-speak img { width: min(48px, 5vw); height: auto; display: block; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25)); }

  /* Kiki + notebook grouped and centred, with a ~10% gap between them.
     Flex keeps the gap consistent and prevents drift/overlap on any screen. */
  .center-group {
    position: absolute;
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: clamp(28px, 7vw, 110px);
    width: max-content;
    max-width: 96vw;
  }

  /* Kiki + bubble — stands beside the notebook (bottom-aligned) */
  .kiki-block {
    position: relative;
    z-index: 25;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(246px, 24vw);
  }
  .bubble {
    position: relative;
    background: #ffffff;
    border: 3px solid #F5A623;
    border-radius: 20px;
    padding: 12px 16px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    margin-bottom: 8px;
  }
  .bubble::after {
    content: '';
    position: absolute;
    bottom: -14px;
    left: 38px;
    border-width: 14px 12px 0 12px;
    border-style: solid;
    border-color: #F5A623 transparent transparent transparent;
  }
  .bubble p {
    margin: 0;
    font-size: clamp(14px, 1.5vw, 18px);
    font-weight: 800;
    color: #1a5c00;
    line-height: 1.4;
    text-align: center;
  }
  .kiki-img {
    width: min(204px, 20.4vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 14px rgba(0,0,0,0.28));
  }

  /* Notebook — larger, beside Kiki within the centred group */
  .notebook {
    position: relative;
    width: min(620px, 55vw);
  }
  .notebook-img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 10px 26px rgba(0,0,0,0.28));
  }
  /* Rows sit on the cream page, clearing the spiral binding (left) and border. */
  .rows {
    position: absolute;
    top: 8%;
    left: 15%;
    right: 6%;
    bottom: 8%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .rows li { display: flex; }
  .row {
    position: relative;
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    gap: clamp(8px, 1.4vw, 16px);
    padding: clamp(4px, 0.8vw, 10px) clamp(8px, 1.2vw, 14px);
    border: 2px solid transparent;
    border-radius: 16px;
    background: transparent;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
    transition: transform 0.12s ease, background 0.18s ease, border-color 0.18s ease;
  }
  .row:hover  { transform: translateY(-2px); background: rgba(255,255,255,0.55); }
  .row:active { transform: translateY(0); }
  .row.done   { background: rgba(120,200,120,0.22); border-color: rgba(80,170,80,0.5); }
  .row:focus-visible { outline: 3px solid #F5A623; outline-offset: 2px; }

  .row-icon {
    width: clamp(38px, 5vw, 58px);
    height: auto;
    flex-shrink: 0;
    display: block;
  }
  .row-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .row-maori {
    font-size: clamp(16px, 2vw, 24px);
    font-weight: 900;
    color: #5a3210;
    line-height: 1.15;
  }
  .row-meaning {
    font-size: clamp(13px, 1.5vw, 18px);
    font-weight: 700;
    color: #3a4a2a;
    line-height: 1.2;
  }
  .row-play {
    width: clamp(30px, 3.6vw, 44px);
    height: auto;
    flex-shrink: 0;
    display: block;
  }
  .row-tick {
    position: absolute;
    top: 4px;
    right: 6px;
    padding: 1px 8px;
    border-radius: 999px;
    background: rgba(120,200,120,0.92);
    font-size: clamp(11px, 1.2vw, 14px);
    font-weight: 900;
    color: #14400f;
    white-space: nowrap;
  }

  /* Confident check */
  .check-overlay {
    position: absolute;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.35);
  }
  .check-card {
    background: #fffdf6;
    border: 4px solid #F5A623;
    border-radius: 24px;
    padding: clamp(20px, 3vw, 32px);
    width: min(560px, 88vw);
    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
    text-align: center;
  }
  .check-q {
    margin: 0 0 18px;
    font-size: clamp(18px, 2.4vw, 26px);
    font-weight: 900;
    color: #1a5c00;
    line-height: 1.35;
  }
  /* Confident exercise: listen-and-match */
  .listen-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin: 0 auto 22px;
    padding: 12px 24px;
    border: 3px solid #e8d49a;
    border-radius: 18px;
    background: #fff;
    font-family: inherit;
    font-size: clamp(18px, 2.2vw, 26px);
    font-weight: 900;
    color: #5a3210;
    cursor: pointer;
    transition: transform 0.12s ease, background 0.18s ease, border-color 0.18s ease;
  }
  .listen-btn:hover  { transform: translateY(-2px); background: #fff6e0; border-color: #F5A623; }
  .listen-btn:active { transform: translateY(0); }
  .listen-btn img { width: clamp(30px, 3.4vw, 42px); height: auto; display: block; }

  .match-icons {
    display: flex;
    justify-content: center;
    gap: clamp(12px, 2vw, 22px);
  }
  .match-icon {
    position: relative;
    padding: 8px;
    border: 3px solid transparent;
    border-radius: 18px;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    transition: transform 0.12s ease, border-color 0.18s ease, box-shadow 0.2s ease;
  }
  .match-icon:hover  { transform: translateY(-3px); border-color: #F5A623; box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
  .match-icon:active { transform: translateY(0); }
  .match-icon img { width: clamp(48px, 7vw, 84px); height: auto; display: block; }
  .match-icon.wiggle  { animation: wiggle 0.5s ease; border: 4px dashed #7b2018; }
  .match-icon.correct { border: 4px solid #145a24; }
  .match-icon:disabled { cursor: default; }
  @keyframes wiggle {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  .match-progress {
    margin: 18px 0 0;
    font-size: clamp(13px, 1.5vw, 17px);
    font-weight: 800;
    color: #6b7a5e;
  }
  .sr-status {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Confident feedback banner */
  .feedback {
    position: absolute;
    bottom: 16%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    margin: 0;
    padding: 10px 22px;
    border-radius: 999px;
    background: #1a5c00;
    color: #fff;
    font-size: clamp(15px, 1.8vw, 20px);
    font-weight: 800;
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
  }

  /* Bottom bar */
  .bottom-bar {
    position: absolute;
    bottom: 3%;
    left: 2%;
    right: 2%;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .hints {
    display: flex;
    gap: clamp(10px, 2vw, 26px);
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hint {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.82);
    border-radius: 14px;
    padding: 8px 14px;
    font-size: clamp(13px, 1.5vw, 17px);
    font-weight: 800;
    color: #4a2e10;
    box-shadow: 0 3px 10px rgba(0,0,0,0.12);
  }
  .hint img { width: clamp(22px, 2.4vw, 30px); height: auto; display: block; }

  .next-locked {
    width: min(150px, 17vw);
    height: auto;
    display: block;
    opacity: 0.9;
  }
  .next-btn {
    font-family: inherit;
    font-size: clamp(16px, 2vw, 22px);
    font-weight: 900;
    color: #4a2e10;
    padding: 14px 32px;
    border: none;
    border-radius: 999px;
    background: linear-gradient(180deg, #ffd54a 0%, #f5a623 100%);
    box-shadow: 0 6px 16px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.5);
    cursor: pointer;
    animation: breathe 2s ease-in-out infinite;
  }
  .next-btn:hover  { transform: translateY(-3px) scale(1.04); animation: none; }
  .next-btn:active { transform: scale(0.97); animation: none; }
  @keyframes breathe {
    0%, 100% { transform: scale(1);    box-shadow: 0 6px 16px rgba(245,166,35,0.5), inset 0 2px 0 rgba(255,255,255,0.5); }
    50%      { transform: scale(1.05); box-shadow: 0 10px 24px rgba(245,166,35,0.85), inset 0 2px 0 rgba(255,255,255,0.5); }
  }
</style>
