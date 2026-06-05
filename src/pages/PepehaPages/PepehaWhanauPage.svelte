<!--
  Pepeha Module — Page 6: Whānau Circle Stickers

  The shared chrome (Back, Read to me, Settings, scene background, and Kiki +
  speech bubble) is unchanged from before. Only two zones were added:
    1. the notebook-background INTERACTION area (centre) — Kiki sits in a
       belonging circle surrounded by four round whānau stickers the learner
       taps to choose 2–3;
    2. the interaction-FEEDBACK area (right) — the growing circle, the Whānau
       Piece, Add to Board, and the Confident-level cultural-safety check.

  Cultural safety: only generic, non-private labels are offered and saved
  (My whānau / My teacher / My classmates / My friends). The learner is never
  asked to type family names or reveal private information.
-->
<script lang="ts">
  import bgImg       from '../../assets/pepeha/page4/background/background_scene.png'
  import readImg     from '../../assets/pepeha/page4/individual_elements/buttons_02.png'
  import backImg     from '../../assets/pepeha/page4/back.png'
  import kikiImg     from '../../assets/kiwihello.png'
  import settingsImg from '../../assets/settings.png'

  // Added only for the interaction + feedback zones.
  import titleImg    from '../../assets/pepeha/page6/title.png'
  import stickerTitleImg from '../../assets/pepeha/page6/stickertitle.png'
  import bookImg     from '../../assets/pepeha/page6/bookbg.png'
  import centerImg   from '../../assets/pepeha/page6/center.png'
  import nextImg     from '../../assets/pepeha/page6/next_button.png'
  import listenImg   from '../../assets/pepeha/page4/individual_elements/buttons_05.png'
  import playImg     from '../../assets/pepeha/page3/play.png'

  import whanauCircle     from '../../assets/pepeha/page6/my_whanau_circle_sticker_transparent.png'
  import teacherCircle    from '../../assets/pepeha/page6/my_teacher_circle_sticker_transparent.png'
  import classmatesCircle from '../../assets/pepeha/page6/my_classmates_circle_sticker_transparent.png'
  import friendsCircle    from '../../assets/pepeha/page6/my_friends_circle_sticker_transparent.png'
  import whanauPiece      from '../../assets/pepeha/page6/my_whanau_sticker_transparent.png'
  import teacherPiece     from '../../assets/pepeha/page6/my_teacher_sticker_transparent.png'
  import classmatesPiece  from '../../assets/pepeha/page6/my_classmates_sticker_transparent.png'
  import friendsPiece     from '../../assets/pepeha/page6/my_friends_sticker_transparent.png'
  import stickerBgImg     from '../../assets/pepeha/page7/stickerbg.png'

  import { pepehaState } from '../../lib/pepehaState.svelte'
  import { speak, settings } from '../../lib/settings.svelte'
  import AnswerStateBadge from './AnswerStateBadge.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const isBeginner = $derived(pepehaState.level === 'beginner')

  const kikiLine = $derived(
    isBeginner
      ? 'Whānau means people who care for us.'
      : 'Whānau can help people know their story.'
  )

  const title = "Kiki's Whānau Circle"

  // ── Interaction zone state ───────────────────────────────────────────────
  // Learning flow: tap a person to meet them (their sticker card explains how
  // that relationship helps Kiki belong), then add the sticker. Collect all
  // four to unlock the next page.
  const choosePrompt = 'Tap each person to meet them, then add their sticker'

  type PersonId = 'whanau' | 'teacher' | 'classmates' | 'friends'
  // `line` is the short, spoken explanation of how each person helps Kiki belong.
  const PEOPLE: { id: PersonId; label: string; circle: string; piece: string; line: string }[] = [
    { id: 'whanau',     label: 'My whānau',     circle: whanauCircle,     piece: whanauPiece,
      line: 'My whānau. People who care for Kiki. Whānau helps Kiki belong.' },
    { id: 'teacher',    label: 'My teacher',    circle: teacherCircle,    piece: teacherPiece,
      line: 'My teacher. A teacher cares for Kiki. Teachers help Kiki belong.' },
    { id: 'classmates', label: 'My classmates', circle: classmatesCircle, piece: classmatesPiece,
      line: 'My classmates. We learn together. Classmates help Kiki belong.' },
    { id: 'friends',    label: 'My friends',    circle: friendsCircle,    piece: friendsPiece,
      line: 'My friends. Friends care for Kiki. Friends help Kiki belong.' },
  ]

  // Restore any previously-added people so revisiting the page keeps progress.
  const restoredAdded = PEOPLE
    .filter(p => pepehaState.whanauChoices.includes(p.label))
    .map(p => p.id)
  // The people whose stickers were added, and the person currently being viewed.
  // On revisit, open the last-added person so the card (and Next) are visible.
  let added = $state<PersonId[]>(restoredAdded)
  let current = $state<PersonId | null>(restoredAdded[restoredAdded.length - 1] ?? null)

  const currentPerson = $derived(PEOPLE.find(p => p.id === current) ?? null)
  const allAdded = $derived(added.length === PEOPLE.length)
  const isAdded = (id: PersonId) => added.includes(id)

  function viewPerson(id: PersonId) {
    current = id
    const p = PEOPLE.find(x => x.id === id)
    if (p) speak(p.line)
  }

  function addCurrent() {
    if (!current || isAdded(current)) return
    const p = PEOPLE.find(x => x.id === current)
    added = [...added, current]
    pepehaState.setWhanauChoices(
      added.map(id => PEOPLE.find(x => x.id === id)?.label ?? '').filter(Boolean)
    )
    // The board's single whānau piece is unlocked once the circle is complete.
    if (added.length === PEOPLE.length) pepehaState.addSticker('whanau')
    speak(`${p?.label ?? 'Sticker'} added!`)
  }

  function clearAll() {
    added = []
    current = null
    pepehaState.setWhanauChoices([])
  }

  // ── Confident-level cultural-safety check (feedback zone) ─────────────────
  const QUIZ = {
    question: 'Who can help with your own pepeha?',
    options: ['People who know your story', 'A random app', 'Kiki’s example'],
    correctIndex: 0,
  }
  let pickedOption = $state<number | null>(null)
  let quizChecked = $state(false)
  let quizPassed = $state(false)
  let showQuiz = $state(false)

  // Next: Beginner advances straight away; Confident must first pass the check
  // (shown as a modal, matching Page 5).
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
      speak('Ka pai! Your own pepeha should come from people who know your connections.')
      setTimeout(() => {
        showQuiz = false
        onNext()
      }, 900)
    } else {
      speak('Not quite — have another try.')
    }
  }

  const readText = $derived(
    showQuiz
      ? `${QUIZ.question} ` + QUIZ.options.map((o, i) => `Option ${i + 1}: ${o}.`).join(' ')
      : currentPerson
        ? currentPerson.line
        : `${kikiLine} ${choosePrompt}.`
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
    <div class="bubble">
      <p>{kikiLine}</p>
      <p class="bubble-hint">🎯 Choose Kiki's whānau, and collect the whānau stickers.</p>
    </div>
    <img src={kikiImg} alt="Kiki the kiwi" class="kiki-img" />
  </div>

  <!-- ════ Interaction zone: notebook background ════ -->
  <div class="notebook" style="background-image:url({bookImg})">
    <div class="choose-row">
      <p class="choose">{choosePrompt}</p>
      <button class="choose-play" onclick={() => speak(choosePrompt)} aria-label="Read the instruction">
        <img src={playImg} alt="" />
      </button>
    </div>

    <div class="circle-area">
      <img src={centerImg} alt="Kiki" class="kiki-center" />
      <ul class="people" aria-label="People in Kiki's circle">
        {#each PEOPLE as person}
          <li>
            <button
              class="person"
              class:current={current === person.id}
              class:added={isAdded(person.id)}
              onclick={() => viewPerson(person.id)}
              aria-pressed={current === person.id}
              aria-label={isAdded(person.id) ? `${person.label}, added` : person.label}
            >
              {#if isAdded(person.id)}
                <span class="person-tick" aria-hidden="true">✓</span>
              {/if}
              <img src={person.circle} alt={person.label} />
            </button>
          </li>
        {/each}
      </ul>
    </div>

    <div class="nb-actions">
      <p class="progress">Added {added.length} of {PEOPLE.length}</p>
      <button class="img-btn" onclick={() => speak(readText)} aria-label="Listen">
        <img src={listenImg} alt="Listen" class="listen-img" />
      </button>
      <button class="clear-btn" onclick={clearAll} disabled={added.length === 0} aria-label="Clear">
        <span class="clear-icon" aria-hidden="true">⟳</span> Clear
      </button>
    </div>
  </div>

  <!-- ════ Feedback zone: the tapped person's sticker card (big & readable) ════ -->
  {#if currentPerson}
    <div class="reveal" role="status">
      <div class="sticker-card" style="background-image:url({stickerBgImg})">
        <img src={stickerTitleImg} alt="Kiki's circle is growing!" class="sticker-title" />
        <img src={currentPerson.piece} alt={`${currentPerson.label} sticker`} class="learn-card" />
      </div>

      {#if isAdded(currentPerson.id)}
        <p class="added-pill"><span aria-hidden="true">✓</span> {currentPerson.label} added!</p>
      {:else}
        <button class="board-btn" onclick={addCurrent} aria-label={`Add ${currentPerson.label} sticker`}>
          <span class="board-star" aria-hidden="true">★</span> Add Sticker
        </button>
      {/if}

      <!-- Next sits below the sticker, unlocking once all four are collected -->
      {#if allAdded}
        <button class="next-btn" onclick={handleNext} aria-label="Next">
          <img src={nextImg} alt="Next" />
        </button>
      {/if}
    </div>
  {/if}

  <!-- Confident-level cultural-safety check — modal, matching Page 5 -->
  {#if showQuiz}
    <div class="quiz-overlay" role="dialog" aria-modal="true" aria-label={QUIZ.question}>
      <div class="quiz-card">
        <p class="quiz-q">{QUIZ.question}</p>
        <div class="quiz-options">
          {#each QUIZ.options as opt, i}
            <button
              class="quiz-opt"
              class:picked={pickedOption === i}
              class:correct={quizChecked && pickedOption === i && i === QUIZ.correctIndex}
              class:wrong={quizChecked && pickedOption === i && i !== QUIZ.correctIndex}
              onclick={() => pickOption(i)}
              aria-pressed={pickedOption === i}
              disabled={quizPassed}
              aria-label={`${opt}${quizChecked && pickedOption === i && i === QUIZ.correctIndex ? ', correct answer' : quizChecked && pickedOption === i && i !== QUIZ.correctIndex ? ', incorrect answer, try again' : ''}`}
            >
              {opt}
              {#if quizChecked && pickedOption === i && i === QUIZ.correctIndex}
                <AnswerStateBadge state="correct" />
              {:else if quizChecked && pickedOption === i && i !== QUIZ.correctIndex}
                <AnswerStateBadge state="wrong" />
              {/if}
            </button>
          {/each}
        </div>
        {#if quizChecked && pickedOption !== QUIZ.correctIndex}
          <p class="hint" role="status" aria-live="polite">Not quite. Have another try.</p>
        {/if}
        <div class="quiz-actions">
          <button class="quiz-cancel" onclick={() => (showQuiz = false)}>Back</button>
          <button class="quiz-play" onclick={() => speak(readText)} aria-label="Read to me">
            <img src={playImg} alt="" />
          </button>
          <button class="check-btn" disabled={pickedOption === null || quizPassed} onclick={checkQuiz}>
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
    top: 30%;
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
  .bubble-hint {
    margin-top: 6px !important;
    color: #c2521a !important;
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

  /* ════════════════════════════════════════════════════════════════════════
     ADDED — interaction zone (notebook) + feedback zone. Nothing above this
     line was changed.
     ════════════════════════════════════════════════════════════════════════ */

  /* Title — top centre, speaker tucked at bottom-right (matches Page 5) */
  .title-board {
    position: absolute;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 35;
    pointer-events: none;
  }
  .title-board > img {
    width: min(420px, 38vw);
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
    width: min(700px, 70vw);
    aspect-ratio: 289 / 224;
    z-index: 20;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: clamp(14px, 2vw, 24px) clamp(26px, 3.5vw, 44px) clamp(16px, 2.2vw, 26px);
    box-sizing: border-box;
  }
  .choose-row {
    position: relative;
    left: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 2%;
  }
  .choose {
    margin: 0;
    text-align: center;
    font-size: clamp(14px, 1.7vw, 20px);
    font-weight: 900;
    color: #3a4a2a;
    line-height: 1.2;
  }
  .choose-play {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .choose-play:hover  { transform: scale(1.1); }
  .choose-play:active { transform: scale(0.95); }
  .choose-play img { width: min(32px, 3.8vw); height: auto; display: block; }
  .choose-play:focus-visible { outline: 3px solid #F5A623; outline-offset: 2px; border-radius: 50%; }

  .circle-area {
    position: relative;
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }
  .people {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;                /* options sit above the centre portrait */
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    justify-content: center;   /* cluster the 2×2 around the centre */
    align-content: center;
    column-gap: clamp(48px, 15vw, 120px);  /* leaves room for Kiki in the middle */
    row-gap: clamp(2px, 0vw, 0px);
  }
  .people li { display: flex; align-items: center; justify-content: center; }
  .person {
    position: relative;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: 50%;
    transition: transform 0.14s ease, filter 0.2s ease;
  }
  .person img { width: min(150px, 14vw); height: auto; display: block; }
  .person:hover:not(:disabled)  { transform: translateY(-3px) scale(1.04); }
  .person:disabled { cursor: default; }
  .person:focus-visible { outline: 3px solid #F5A623; outline-offset: 2px; border-radius: 18px; }
  /* Person being viewed — amber ring to show it's "open" in the card */
  .person.current { transform: scale(1.06); }
  .person.current img {
    filter: drop-shadow(0 0 6px #F5A623) drop-shadow(0 0 14px rgba(245,166,35,0.7));
  }
  /* Person whose sticker was added — green glow */
  .person.added img {
    filter: drop-shadow(0 0 6px #2f8a3e) drop-shadow(0 0 14px rgba(63,174,69,0.7));
  }
  .person-tick {
    position: absolute;
    top: 2px;
    right: 6%;
    width: clamp(22px, 2.6vw, 30px);
    height: clamp(22px, 2.6vw, 30px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #3fae45;
    color: #fff;
    font-size: clamp(13px, 1.6vw, 18px);
    font-weight: 900;
    border: 3px solid #fff;
    box-shadow: 0 3px 8px rgba(0,0,0,0.25);
    z-index: 3;
  }
  .kiki-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(240px, 13vw);
    height: auto;
    z-index: 1;                /* one layer below the surrounding options */
    pointer-events: none;
    filter: drop-shadow(0 6px 14px rgba(0,0,0,0.3));
  }

  .nb-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 1.4vw, 16px);
  }
  .progress {
    margin: 0;
    font-size: clamp(13px, 1.5vw, 18px);
    font-weight: 900;
    color: #2f7d34;
    white-space: nowrap;
  }
  .listen-img { width: min(140px, 14vw); }

  .clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: inherit;
    font-size: clamp(13px, 1.4vw, 17px);
    font-weight: 900;
    color: #5a3a14;
    background: #fffdf3;
    border: 3px solid #8a5a2b;
    border-radius: 14px;
    padding: clamp(6px, 0.9vw, 10px) clamp(12px, 1.6vw, 18px);
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .clear-btn:hover:not(:disabled)  { transform: translateY(-2px) scale(1.03); }
  .clear-btn:active:not(:disabled) { transform: scale(0.97); }
  .clear-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .clear-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .clear-icon { font-size: 1.2em; line-height: 1; }

  .hint {
    margin: 0;
    text-align: center;
    font-size: clamp(13px, 1.5vw, 17px);
    font-weight: 800;
    color: #c0392b;
  }

  /* Feedback area — clean reveal column on the right (matches Page 5) */
  .reveal {
    position: absolute;
    top: 16%;
    right: 10%;
    z-index: 28;
    width: min(230px, 24vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  /* Sticker title banner (now inside the card, at the top) */
  .sticker-title {
    width: 92%;
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
  }
  /* Shared sticker-card background (stickerbg) — wraps the green title + sticker,
     so its top border extends up to the title */
  .sticker-card {
    width: 100%;
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 8% 7% 7%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(2px, 1vw, 6px);
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
    animation: pop-in 0.28s ease;
  }
  /* The tapped person's sticker card — large and readable for learning */
  .learn-card {
    width: 100%;
    height: auto;
    display: block;
  }
  @keyframes pop-in {
    0%   { transform: scale(0.8); opacity: 0; }
    70%  { transform: scale(1.03); opacity: 1; }
    100% { transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .learn-card { animation: none; }
  }
  .added-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 2px 0;
    font-size: clamp(13px, 1.4vw, 16px);
    font-weight: 900;
    color: #2f7d34;
    background: #fffdf3;
    border: 2px solid #3fae45;
    border-radius: 14px;
    padding: 6px 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.18);
  }
  .added-pill span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #3fae45;
    color: #fff;
    font-size: 14px;
  }
  .board-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: inherit;
    font-size: clamp(15px, 1.6vw, 19px);
    font-weight: 900;
    color: #5a3a14;
    background: linear-gradient(#ffd766, #f6b327);
    border: 3px solid #d98a1c;
    border-radius: 16px;
    padding: clamp(9px, 1.2vw, 13px) clamp(16px, 2vw, 24px);
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(0,0,0,0.22);
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .board-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .board-btn:active { transform: scale(0.97); }
  .board-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .board-star { color: #fff6cf; font-size: 1.1em; text-shadow: 0 1px 2px rgba(0,0,0,0.25); }

  /* Next — page-6 art button, sits below the sticker once all four are collected */
  .next-btn {
    margin-top: 2px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
    animation: breathe 1.8s ease-in-out infinite;
  }
  .next-btn img {
    width: min(200px, 21vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
  }
  .next-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .next-btn:active { transform: scale(0.97); }
  .next-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 16px; }
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.05); }
  }
  @media (prefers-reduced-motion: reduce) {
    .next-btn { animation: none; }
  }

  /* Confident-level cultural-safety check — modal (matches Page 5) */
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
    position: relative;
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
    border-style: dashed;
    border-color: #c0392b;
    background: #fdecea;
    animation: wiggle 0.4s ease;
  }
  .quiz-opt.correct {
    border-style: solid;
    border-color: #1f8b34;
    background: #eafbe7;
  }
  @keyframes wiggle {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
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
