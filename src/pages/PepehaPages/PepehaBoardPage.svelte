<!--
  Pepeha Module — Page 7: Kiki's Pepeha Board

  Reuses Page 6's design (the shared chrome — Back, Read to me, Settings, scene
  background, Kiki + speech bubble, notebook interaction area, and right-hand
  feedback column on the shared sticker-card background).

  Combines all four collected pieces into one completed practice pepeha. Level
  behaviour follows docs/Pepeha_requirements.md (Page 7):
    • Beginner — pieces are shown as the illustrated cards (te reo + English
      meaning visible by default).
    • Confident — pieces are shown as te-reo-only text cards; English is revealed
      with "Show meaning", and a short cultural-safety check must be passed
      before "Practise with Kiki".

  Cultural safety: the board is Kiki's *practice example* (built from a fixed,
  teacher-reviewed school profile), never the learner's own pepeha.
-->
<script lang="ts">
  import bgImg       from '../../assets/pepeha/page4/background/background_scene.png'
  import readImg     from '../../assets/pepeha/page4/individual_elements/buttons_02.png'
  import backImg     from '../../assets/pepeha/page4/back.png'
  import kikiImg     from '../../assets/kiwihello.png'
  import settingsImg from '../../assets/settings.png'
  import playImg     from '../../assets/pepeha/page3/play.png'

  // Page-7 content art (title / notebook / sticker-card background / pieces).
  import titleImg     from '../../assets/pepeha/page7/title.png'
  import bookImg      from '../../assets/pepeha/page7/bookbg.png'
  import stickerBgImg from '../../assets/pepeha/page7/stickerbg.png'

  import ingoaCard  from '../../assets/pepeha/page7/chose4.png'
  import maungaCard from '../../assets/pepeha/page7/chose1.png'
  import awaCard    from '../../assets/pepeha/page7/chose2.png'
  import whanauCard from '../../assets/pepeha/page7/chose3.png'

  import ingoaPill  from '../../assets/pepeha/page7/sticker1.png'
  import maungaPill from '../../assets/pepeha/page7/sticker2.png'
  import awaPill    from '../../assets/pepeha/page7/sticker3.png'
  import whanauPill from '../../assets/pepeha/page7/sticker4.png'

  import { pepehaState } from '../../lib/pepehaState.svelte'
  import { speak, settings } from '../../lib/settings.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
    onChooseSchool?: () => void
  }
  let { onNext, onBack, onChooseSchool }: Props = $props()

  const isBeginner = $derived(pepehaState.level === 'beginner')

  const title = "Kiki's Pepeha Board"
  const kikiLine = $derived(
    isBeginner ? 'You found all my pieces!' : "You completed Kiki's practice pepeha."
  )

  // The maunga/awa come from the chosen practice-school example.
  const school = $derived(pepehaState.selectedSchool)
  const schoolName = $derived(school?.schoolName ?? 'Rosebank School')
  const maunga = $derived(school?.maunga ?? 'Ōwairaka')
  const awa = $derived(school?.awa ?? 'Whau')
  const maungaLine = $derived(school?.maungaLine ?? 'Ko Ōwairaka te maunga.')
  const awaLine = $derived(school?.awaLine ?? 'Ko Whau te awa.')

  // ── The four collected pieces ────────────────────────────────────────────
  // The illustrated `card` (now text-free) is shared by both levels; text is
  // rendered into the card's blank area, bound to the selected school:
  //   • Beginner  — the key vocabulary word (`word`) + its English gloss.
  //   • Confident — the short te reo sentence (`reo`); English (`en`) is
  //     revealed with "Show meaning".
  // `pill` is the right-hand board sticker.
  type PieceId = 'ingoa' | 'maunga' | 'awa' | 'whanau'
  const PIECES = $derived<
    { id: PieceId; label: string; card: string; pill: string;
      word: string; wordEn: string; reo: string; en: string }[]
  >([
    { id: 'ingoa',  label: 'Ingoa',  card: ingoaCard,  pill: ingoaPill,
      word: 'Kiki', wordEn: 'name', reo: 'Ko Kiki tōku ingoa.', en: 'My name is Kiki.' },
    { id: 'maunga', label: 'Maunga', card: maungaCard, pill: maungaPill,
      word: maunga, wordEn: 'mountain', reo: maungaLine, en: `${maunga} is the mountain.` },
    { id: 'awa',    label: 'Awa',    card: awaCard,    pill: awaPill,
      word: awa, wordEn: 'river', reo: awaLine, en: `${awa} is the river.` },
    { id: 'whanau', label: 'Whānau', card: whanauCard, pill: whanauPill,
      word: 'Whānau', wordEn: 'family', reo: 'Whānau helps Kiki belong.', en: '' },
  ])

  // English support visibility: always on for Beginner, toggled for Confident.
  let showMeaning = $state(false)
  const meaningVisible = $derived(isBeginner || showMeaning)

  // Listening to a piece highlights it and ticks it off on the right-hand board.
  // Nothing is ticked until the learner listens to a piece.
  let current = $state<PieceId | null>(null)
  let selected = $state<PieceId[]>([])
  const isSelected = (id: PieceId) => selected.includes(id)
  const allSelected = $derived(selected.length === PIECES.length)

  // A long te reo word (e.g. "Ōwairaka", "Pukewhakataratara") would overflow the
  // card's text area and overlap the picture, so it is shrunk and nudged right.
  function hasLongWord(s: string): boolean {
    return s.split(/\s+/).some(w => w.length >= 6)
  }

  function pieceSpeech(p: {
    label: string; word: string; wordEn: string; reo: string; en: string
  }): string {
    // Beginner practises the word; Confident practises the short sentence.
    if (isBeginner) return `${p.label}. ${p.word}. ${p.wordEn}.`
    return meaningVisible && p.en ? `${p.label}. ${p.reo} ${p.en}` : `${p.label}. ${p.reo}`
  }
  function listenPiece(p: {
    id: PieceId; label: string; word: string; wordEn: string; reo: string; en: string
  }) {
    current = p.id
    if (!selected.includes(p.id)) selected = [...selected, p.id]
    speak(pieceSpeech(p))
  }

  // ── Confident-level cultural-safety check (modal, matching Pages 4–6) ─────
  const QUIZ = {
    question: 'What is the safest thing to do before making your own pepeha?',
    options: [
      'Talk with people who know your connections',
      'Copy Kiki’s board',
      'Choose the prettiest places',
    ],
    correctIndex: 0,
  }
  let pickedOption = $state<number | null>(null)
  let quizChecked = $state(false)
  let quizPassed = $state(false)
  let showQuiz = $state(false)

  // Practise with Kiki: Beginner advances straight away; Confident must first
  // pass the short cultural-safety check.
  function handleNext() {
    if (isBeginner || quizPassed) {
      onNext()
    } else {
      showQuiz = true
    }
  }

  function pickOption(i: number) {
    pickedOption = i
    quizChecked = false
  }
  function checkQuiz() {
    if (pickedOption === null) return
    quizChecked = true
    if (pickedOption === QUIZ.correctIndex) {
      quizPassed = true
      showQuiz = false
      speak('Ka pai! Kiki’s board is for practice. Your own pepeha may be different.')
      onNext()
    } else {
      speak('Not quite — have another try.')
    }
  }

  const readText = $derived(
    showQuiz
      ? `${QUIZ.question} ` + QUIZ.options.map((o, i) => `Option ${i + 1}: ${o}.`).join(' ')
      : `${title}. ${kikiLine} School: ${schoolName}. ` +
        PIECES.map(p => pieceSpeech(p)).join(' ')
  )
</script>

<div class="stage" style="background-image:url({bgImg})">

  <!-- Back — top-left corner -->
  <button class="back-btn" onclick={onBack} aria-label="Back">
    <img src={backImg} alt="Back" />
  </button>

  <!-- Settings — top-right corner -->
  <button class="settings-btn" onclick={() => (settings.open = true)} aria-label="Settings">
    <img src={settingsImg} alt="Settings" />
  </button>

  <!-- Title + speaker (top-centre) -->
  <div class="title-board">
    <img src={titleImg} alt={title} />
    <button class="title-play" onclick={() => speak(`${title}. ${kikiLine}`)} aria-label="Read the title">
      <img src={playImg} alt="" />
    </button>
  </div>

  <!-- Kiki + speech bubble — left -->
  <div class="kiki-block">
    <div class="bubble"><p>{kikiLine}</p></div>
    <img src={kikiImg} alt="Kiki the kiwi" class="kiki-img" />
  </div>

  <!-- ════ Interaction zone: notebook background ════ -->
  <div class="notebook" style="background-image:url({bookImg})">
    <div class="practice-head">
      <p class="practice-tag"><span aria-hidden="true">★</span> Practice example <span aria-hidden="true">★</span></p>
      <p class="school-line">School: {schoolName}</p>
    </div>

    <ul class="pieces" aria-label="Kiki's pepeha pieces">
      {#each PIECES as piece}
        <li class="piece" class:current={current === piece.id}>
          <div class="piece-card">
            <img class="piece-img" src={piece.card} alt={piece.label} />
            <!-- Text rendered into the card's blank area, bound to the school -->
            <div class="piece-text" class:long={hasLongWord(isBeginner ? piece.word : piece.reo)}>
              {#if isBeginner}
                <p class="word-reo">{piece.word}</p>
                <p class="word-en">{piece.wordEn}</p>
              {:else}
                <p class="sent-reo">{piece.reo}</p>
                {#if showMeaning && piece.en}
                  <p class="sent-en">{piece.en}</p>
                {/if}
              {/if}
              <button class="piece-play" onclick={() => listenPiece(piece)} aria-label={`Listen to ${piece.label}`}>
                <img src={playImg} alt="" />
              </button>
            </div>
          </div>
        </li>
      {/each}
    </ul>

    <!-- Show meaning — Confident only (Beginner shows English by default) -->
    {#if !isBeginner}
      <button class="meaning-btn" onclick={() => (showMeaning = !showMeaning)} aria-pressed={showMeaning}>
        {showMeaning ? 'Hide meaning' : 'Show meaning'}
      </button>
    {/if}
  </div>

  <!-- ════ Feedback zone: the board (on the shared sticker-card background) ════ -->
  <div class="board" role="status" style="background-image:url({stickerBgImg})">
    <p class="board-banner">
      <span aria-hidden="true">✦</span>
      {allSelected ? 'Pepeha Board complete!' : 'Pepeha Board'}
      <span aria-hidden="true">✦</span>
    </p>
    <p class="board-sub">You have {selected.length} of {PIECES.length} pieces!</p>

    <ul class="board-list">
      {#each PIECES as piece}
        <li class="board-item">
          <img src={piece.pill} alt={piece.label} />
          {#if isSelected(piece.id)}
            <span class="board-check" aria-hidden="true">✓</span>
          {/if}
        </li>
      {/each}
    </ul>

    <p class="board-note">Ask people who know your story for your own pepeha.</p>

    <button class="next-btn" onclick={handleNext} aria-label="Practise with Kiki">
      Practise with Kiki <span aria-hidden="true">→</span>
    </button>

    {#if onChooseSchool}
      <button class="choose-btn" onclick={onChooseSchool}>Choose another school</button>
    {/if}
  </div>

  <!-- Confident-level cultural-safety check — modal (matching Pages 4–6) -->
  {#if showQuiz}
    <div class="quiz-overlay" role="dialog" aria-modal="true" aria-label={QUIZ.question}>
      <div class="quiz-card">
        <p class="quiz-q">{QUIZ.question}</p>
        <div class="quiz-options">
          {#each QUIZ.options as opt, i}
            <button
              class="quiz-opt"
              class:picked={pickedOption === i}
              class:wrong={quizChecked && pickedOption === i && i !== QUIZ.correctIndex}
              onclick={() => pickOption(i)}
              aria-pressed={pickedOption === i}
            >
              {opt}
            </button>
          {/each}
        </div>
        {#if quizChecked && pickedOption !== QUIZ.correctIndex}
          <p class="quiz-hint">Not quite — have another try.</p>
        {/if}
        <div class="quiz-actions">
          <button class="quiz-cancel" onclick={() => (showQuiz = false)}>Back</button>
          <button class="quiz-play" onclick={() => speak(readText)} aria-label="Read to me">
            <img src={playImg} alt="" />
          </button>
          <button class="check-btn" disabled={pickedOption === null} onclick={checkQuiz}>
            Check answer
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Bottom bar: Read to me (left) -->
  <div class="bottom-bar">
    <button class="img-btn read-btn" onclick={() => speak(readText)} aria-label="Read to me">
      <img src={readImg} alt="Read to me" />
    </button>
  </div>

</div>

<style>
  .stage {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'Nunito', system-ui, sans-serif;
    overflow: hidden;
    user-select: none;
  }

  /* Generic image-button reset */
  .img-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .img-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .img-btn:active { transform: scale(0.97); }
  .img-btn img { display: block; height: auto; }
  .img-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 16px; }

  /* Back — top-left corner */
  .back-btn {
    position: absolute;
    top: -3%;
    left: -2%;
    z-index: 45;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .back-btn:hover  { transform: translateY(-3px) scale(1.04); }
  .back-btn:active { transform: scale(0.97); }
  .back-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 16px; }
  .back-btn img {
    width: min(350px, 14vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
  }

  /* Settings — top-right corner */
  .settings-btn {
    position: absolute;
    top: 3%;
    right: 1%;
    z-index: 45;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .settings-btn:hover  { transform: translateY(-3px) scale(1.04); }
  .settings-btn:active { transform: scale(0.97); }
  .settings-btn img {
    width: min(80px, 9vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
  }

  /* Read to me — bottom-left (in the bottom bar) */
  .read-btn img { width: min(190px, 21vw); }

  /* Kiki + bubble — left */
  .kiki-block {
    position: absolute;
    top: 40%;
    left: 14%;
    z-index: 25;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(190px, 19vw);
  }
  .bubble {
    position: relative;
    background: #fffdf3;
    border: 3px solid #8a5a2b;
    border-radius: 16px;
    padding: 10px 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    margin-bottom: 6px;
  }
  .bubble::after {
    content: '';
    position: absolute;
    bottom: -13px;
    left: 36px;
    border-width: 13px 11px 0 11px;
    border-style: solid;
    border-color: #8a5a2b transparent transparent transparent;
  }
  .bubble p {
    margin: 0;
    font-size: clamp(12px, 1.3vw, 16px);
    font-weight: 800;
    color: #5a3a14;
    line-height: 1.35;
    text-align: center;
  }
  .kiki-img {
    width: min(250px, 22vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 14px rgba(0,0,0,0.28));
  }

  /* Bottom bar */
  .bottom-bar {
    position: absolute;
    bottom: 0%;
    left: 0%;
    right: 3%;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  /* Title — top centre, speaker tucked at bottom-right (matches Page 6) */
  .title-board {
    position: absolute;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 35;
    pointer-events: none;
  }
  .title-board > img {
    width: min(500px, 38vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
  }
  .title-play {
    position: absolute;
    right: 0%;
    bottom: 4%;
    pointer-events: auto;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .title-play:hover  { transform: scale(1.08); }
  .title-play:active { transform: scale(0.95); }
  .title-play img {
    width: min(46px, 5.2vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25));
  }
  .title-play:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 50%; }

  /* Notebook interaction area — centre, uses the spiral-book art as background */
  .notebook {
    position: absolute;
    top: 15%;
    left: 52%;
    transform: translateX(-50%);
    width: min(750px, 70vw);
    aspect-ratio: 289 / 224;
    z-index: 20;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: clamp(12px, 1.8vw, 22px) clamp(40px, 5vw, 64px) clamp(14px, 2vw, 24px);
    box-sizing: border-box;
  }
  .practice-head {
    text-align: center;
    margin-top: 0.5%;
  }
  .practice-tag {
    margin: 0;
    font-size: clamp(13px, 1.6vw, 19px);
    font-weight: 900;
    color: #b5791a;
    line-height: 1.2;
  }
  .practice-tag span { color: #f0a92b; }
  .school-line {
    margin: 2px 0 0;
    font-size: clamp(11px, 1.3vw, 15px);
    font-weight: 800;
    color: #3a4a2a;
  }

  /* The four pieces, in a 2×2 grid that fills the page */
  .pieces {
    list-style: none;
    margin: clamp(4px, 0.8vw, 10px) 0 0;
    padding: 0;
    flex: 1;
    min-height: 0;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    place-items: center;
    gap: clamp(4px, 1vw, 12px) clamp(8px, 1.6vw, 18px);
  }
  .piece {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 0;
    width: 100%;
  }

  /* Shared illustrated card (text-free art); text is overlaid on the blank area */
  .piece-card {
    position: relative;
    width: 90%;
    align-self: center;
    transition: transform 0.14s ease, filter 0.2s ease;
  }
  .piece-img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.22));
  }
  .piece.current .piece-card { transform: scale(1.03); }
  .piece.current .piece-img {
    filter: drop-shadow(0 0 6px #F5A623) drop-shadow(0 0 14px rgba(245,166,35,0.7));
  }

  /* Overlay over the card's right-hand blank area */
  .piece-text {
    position: absolute;
    top: 26%;
    right: 5%;
    width: 49%;
    height: 64%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(2px, 0.3vw, 6px);
    text-align: center;
  }
  .word-reo {
    margin: 0;
    font-size: clamp(10px, 2vw, 26px);
    font-weight: 700;
    color: #1a6b2c;
    line-height: 1.15;
  }
  .word-en {
    margin: 0;
    font-size: clamp(11px, 1.4vw, 17px);
    font-weight: 800;
    color: #2b6ca3;
    line-height: 1.15;
  }
  .sent-reo {
    margin: 0;
    font-size: clamp(12px, 1.55vw, 19px);
    font-weight: 900;
    color: #3a2a12;
    line-height: 1.2;
  }
  .sent-en {
    margin: 0;
    font-size: clamp(11px, 1.3vw, 15px);
    font-weight: 700;
    color: #2b6ca3;
    line-height: 1.15;
  }

  /* Long te reo word (> 6 chars): shrink + nudge right so it clears the picture */
  .piece-text.long {
    right: 3%;
    width: 43%;
  }
  .piece-text.long .word-reo {
    font-size: clamp(10px, 1.5vw, 19px);
    overflow-wrap: break-word;
  }
  .piece-text.long .sent-reo {
    font-size: clamp(10px, 1.3vw, 16px);
    overflow-wrap: break-word;
  }

  /* Per-piece Listen button */
  .piece-play {
    margin-top: clamp(2px, 0.5vw, 6px);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
    flex: none;
  }
  .piece-play:hover  { transform: scale(1.12); }
  .piece-play:active { transform: scale(0.95); }
  .piece-play img {
    width: clamp(26px, 3vw, 38px);
    height: auto;
    display: block;
    filter: drop-shadow(0 2px 5px rgba(0,0,0,0.25));
  }
  .piece-play:focus-visible { outline: 3px solid #F5A623; outline-offset: 2px; border-radius: 50%; }

  /* Show meaning — Confident-only toggle under the pieces */
  .meaning-btn {
    margin-top: clamp(6px, 1vw, 10px);
    font-family: inherit;
    font-size: clamp(12px, 1.4vw, 16px);
    font-weight: 900;
    color: #5a3a14;
    background: #fffdf3;
    border: 3px solid #8a5a2b;
    border-radius: 14px;
    padding: clamp(5px, 0.8vw, 9px) clamp(12px, 1.6vw, 18px);
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.18);
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .meaning-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .meaning-btn:active { transform: scale(0.97); }
  .meaning-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }

  /* Feedback area — board column on the right, on the shared sticker-card bg */
  .board {
    position: absolute;
    top: 20%;
    right: 1%;
    z-index: 28;
    width: min(380px, 39vw);
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: clamp(12px, 1.6vw, 18px) clamp(12px, 1.6vw, 18px) clamp(18px, 2.4vw, 28px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: clamp(6px, 1vw, 10px);
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.28));
  }
  .board-banner {
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    font-size: clamp(13px, 1.5vw, 17px);
    font-weight: 900;
    color: #fffdf3;
    background: linear-gradient(#3fae45, #2f8a3e);
    border: 3px solid #1f6b2c;
    border-radius: 14px;
    padding: clamp(6px, 0.9vw, 10px) clamp(8px, 1.2vw, 14px);
    box-shadow: 0 5px 14px rgba(0,0,0,0.25);
  }
  .board-banner span { color: #d6ffce; }
  .board-sub {
    margin: 0;
    font-size: clamp(13px, 1.5vw, 17px);
    font-weight: 900;
    color: #2f7d34;
    text-align: center;
  }

  .board-list {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(4px, 0.3vw, 5px);
  }
  .board-item {
    position: relative;
    display: flex;
    align-items: center;
  }
  .board-item img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.18));
  }
  .board-check {
    position: absolute;
    right: 4%;
    top: 50%;
    transform: translateY(-50%);
    width: clamp(18px, 2.2vw, 26px);
    height: clamp(18px, 2.2vw, 26px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #3fae45;
    color: #fff;
    font-size: clamp(11px, 1.4vw, 16px);
    font-weight: 900;
    border: 3px solid #fff;
    box-shadow: 0 3px 8px rgba(0,0,0,0.25);
  }

  .board-note {
    margin: 2px 0;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    font-size: clamp(11px, 1.3vw, 15px);
    font-weight: 800;
    color: #5a3a14;
    background: #fffdf3;
    border: 2px solid #e0c389;
    border-radius: 12px;
    padding: clamp(6px, 0.9vw, 10px) clamp(8px, 1.2vw, 12px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.14);
    line-height: 1.25;
  }

  /* Practise with Kiki — green action button (matches Page 6 placement) */
  .next-btn {
    margin-top: 2px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: inherit;
    font-size: clamp(15px, 1.7vw, 20px);
    font-weight: 900;
    color: #ffffff;
    background: linear-gradient(#3fae45, #2f8a3e);
    border: 3px solid #1f6b2c;
    border-radius: 16px;
    padding: clamp(9px, 1.2vw, 13px) clamp(16px, 2vw, 24px);
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(0,0,0,0.22);
    transition: transform 0.12s ease, box-shadow 0.2s ease;
    animation: breathe 1.8s ease-in-out infinite;
  }
  .next-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .next-btn:active { transform: scale(0.97); }
  .next-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.05); }
  }
  @media (prefers-reduced-motion: reduce) {
    .next-btn { animation: none; }
  }

  /* Choose another school — secondary text button */
  .choose-btn {
    font-family: inherit;
    font-size: clamp(12px, 1.4vw, 16px);
    font-weight: 800;
    color: #5a3a14;
    background: #fffdf3;
    border: 2px solid #d8c08a;
    border-radius: 14px;
    padding: clamp(6px, 0.9vw, 10px) clamp(12px, 1.6vw, 18px);
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.14);
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .choose-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .choose-btn:active { transform: scale(0.97); }
  .choose-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }

  /* Confident-level cultural-safety check — modal (matches Pages 4–6) */
  .quiz-overlay {
    position: absolute;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    padding: 16px;
  }
  .quiz-card {
    width: min(540px, 90vw);
    background: #fffdf3;
    border: 4px solid #F5A623;
    border-radius: 24px;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.4);
    padding: clamp(18px, 3vw, 30px);
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 1.8vw, 18px);
    text-align: center;
  }
  .quiz-q {
    margin: 0;
    font-size: clamp(17px, 2.1vw, 24px);
    font-weight: 900;
    color: #1a5c00;
    line-height: 1.3;
  }
  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 1.2vw, 12px);
  }
  .quiz-opt {
    font-family: inherit;
    font-size: clamp(15px, 1.7vw, 20px);
    font-weight: 800;
    color: #2a3a1a;
    background: #ffffff;
    border: 3px solid #2f8a3e;
    border-radius: 16px;
    padding: clamp(10px, 1.4vw, 16px);
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .quiz-opt:hover  { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18); }
  .quiz-opt:active { transform: translateY(0); }
  .quiz-opt:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .quiz-opt.picked {
    background: #eafbe7;
    box-shadow: 0 0 0 4px #ffd54a;
  }
  .quiz-opt.wrong {
    border-color: #c0392b;
    background: #fdecea;
    animation: wiggle 0.4s ease;
  }
  @keyframes wiggle {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
  .quiz-hint {
    margin: 0;
    font-size: clamp(14px, 1.5vw, 18px);
    font-weight: 800;
    color: #c0392b;
  }
  .quiz-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .quiz-cancel {
    font-family: inherit;
    font-size: clamp(13px, 1.4vw, 16px);
    font-weight: 800;
    color: #5a6a4a;
    background: none;
    border: none;
    text-decoration: underline;
    cursor: pointer;
    padding: 6px;
  }
  .quiz-cancel:hover { color: #2f8a3e; }
  .quiz-cancel:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 8px; }
  .quiz-play {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .quiz-play:hover  { transform: scale(1.08); }
  .quiz-play:active { transform: scale(0.95); }
  .quiz-play img { width: min(48px, 6vw); height: auto; display: block; }
  .quiz-play:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 50%; }
  .check-btn {
    font-family: inherit;
    font-size: clamp(15px, 1.7vw, 20px);
    font-weight: 900;
    color: #ffffff;
    background: #2f8a3e;
    border: none;
    border-radius: 18px;
    padding: clamp(10px, 1.4vw, 14px) clamp(18px, 2.4vw, 28px);
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(47, 138, 62, 0.45);
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .check-btn:hover:not(:disabled)  { transform: translateY(-2px); }
  .check-btn:active:not(:disabled) { transform: translateY(0); }
  .check-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .check-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
</style>