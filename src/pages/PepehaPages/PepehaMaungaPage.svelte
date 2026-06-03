<!--
  Pepeha Module — Page 4: Find the Maunga

  First-pass layout from src/assets/pepeha/page4/reference4.png. The learner finds
  the mountain among three cards (mountain / river / people), reveals the selected
  school's maunga, and adds the Maunga sticker to Kiki's board.

  Cultural safety: the maunga shown comes from the chosen *practice-school*
  example (pepehaState.selectedSchool) — never invented or guessed.

  Confident level adds a short cultural-safety check ("Why does Kiki use this
  maunga?") as a modal triggered when the learner taps Find Awa to move on — it
  must be answered correctly before the page advances.

  Layout (over the scene background):
    • Back (top-left)                         • Title + speaker (top-centre)
    • Read to me (top-right)                  • Kiki + speech bubble (left)
    • Notebook with question + 3 cards (centre)
    • Reveal panel: "You found it!" + sticker card + Add Sticker (right)
    • Bottom bar: Listen · Need help? · Check answer · Find Awa
-->
<script lang="ts">
  import bgImg          from '../../assets/pepeha/page4/background/background_scene.png'
  import readImg        from '../../assets/pepeha/page4/individual_elements/buttons_02.png'
  import findAwaImg     from '../../assets/pepeha/page4/individual_elements/buttons_03.png'
  import needHelpImg    from '../../assets/pepeha/page4/individual_elements/buttons_04.png'
  import listenImg      from '../../assets/pepeha/page4/individual_elements/buttons_05.png'
  import checkImg       from '../../assets/pepeha/page4/individual_elements/buttons_06.png'
  import titleImg       from '../../assets/pepeha/page4/individual_elements/title_find_the_maunga_01.png'
  import cardMountainImg from '../../assets/pepeha/page4/individual_elements/notebook_cards_01.png'
  import cardRiverImg    from '../../assets/pepeha/page4/individual_elements/notebook_cards_02.png'
  import cardPeopleImg   from '../../assets/pepeha/page4/individual_elements/notebook_cards_03.png'
  import foundBannerImg from '../../assets/pepeha/page4/individual_elements/reward_sticker_ui_01.png'
  // Per-maunga reveal stickers. NOTE: two files are mislabelled — the filename
  // does NOT match the maunga depicted, so they are imported under names that
  // match the ACTUAL artwork (keeping the MAUNGA_STICKERS map correct):
  //   rangitoto_…png         actually shows "Pukewhakataratara"
  //   pukewhakataratara_…png actually shows "Rangitoto"
  import owairakaSticker         from '../../assets/pepeha/page4/sticker/owairaka_maunga_sticker_transparent.png'
  import waikumeteSticker        from '../../assets/pepeha/page4/sticker/waikumete_maunga_sticker_transparent.png'
  import pukewhakatarataraSticker from '../../assets/pepeha/page4/sticker/rangitoto_maunga_sticker_transparent.png'
  import rangitotoSticker        from '../../assets/pepeha/page4/sticker/pukewhakataratara_maunga_sticker_transparent.png'
  import addedPillImg   from '../../assets/pepeha/page4/individual_elements/reward_sticker_ui_03.png'
  import addStickerImg  from '../../assets/pepeha/page4/individual_elements/reward_sticker_ui_04.png'
  import stickerBgImg   from '../../assets/pepeha/page7/stickerbg.png'
  import backImg        from '../../assets/pepeha/page4/back.png'
  import playImg        from '../../assets/pepeha/page3/play.png'
  import kikiImg        from '../../assets/kiwihello.png'
  import settingsImg    from '../../assets/settings.png'

  import { pepehaState } from '../../lib/pepehaState.svelte'
  import { speak, settings } from '../../lib/settings.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const isBeginner = $derived(pepehaState.level === 'beginner')

  // The maunga to reveal comes from the chosen practice-school example.
  const school = $derived(pepehaState.selectedSchool)
  const maunga = $derived(school?.maunga ?? 'Ōwairaka')
  const maungaLine = $derived(school?.maungaLine ?? 'Ko Ōwairaka te maunga.')

  // The reveal sticker is fixed art per school (keyed by school id, mapped to the
  // sticker whose artwork matches that school's maunga — see import note above).
  const MAUNGA_STICKERS: Record<string, string> = {
    'rosebank':   owairakaSticker,
    'don-buck':   pukewhakatarataraSticker,
    'glen-eden':  waikumeteSticker,
    'kauri-park': rangitotoSticker,
  }
  const stickerImg = $derived(MAUNGA_STICKERS[pepehaState.selectedSchoolId ?? ''] ?? owairakaSticker)

  const title = 'Find the Maunga'
  const kikiLine = $derived(
    isBeginner
      ? 'Maunga means mountain. Tap the mountain!'
      : "Find the maunga for Kiki's school example."
  )

  // Three tappable cards. 'mountain' is the maunga.
  type CardId = 'mountain' | 'river' | 'people'
  // `say` is the English-only label read aloud when a card is tapped — the te
  // reo word in the card art is deliberately not spoken (that's the question).
  const CARDS: { id: CardId; img: string; alt: string; say: string }[] = [
    { id: 'mountain', img: cardMountainImg, alt: 'Mountain (maunga)', say: 'Mountain' },
    { id: 'river',    img: cardRiverImg,    alt: 'River (awa)',       say: 'River' },
    { id: 'people',   img: cardPeopleImg,   alt: 'People (tāngata)',  say: 'People' },
  ]

  let selectedCard = $state<CardId | null>(null)
  let checked = $state(false)
  let found = $state(false)

  const stickerAdded = $derived(pepehaState.hasSticker('maunga'))

  function pickCard(id: CardId) {
    selectedCard = id
    checked = false
    speak(CARDS.find(c => c.id === id)?.say ?? '')
  }

  function checkAnswer() {
    if (selectedCard === null) return
    checked = true
    if (selectedCard === 'mountain') {
      found = true
      speak(`You found it! ${maunga}. ${maungaLine}`)
    } else {
      speak('Try again. Maunga means mountain.')
    }
  }

  function addSticker() {
    pepehaState.addSticker('maunga')
    speak('Maunga sticker added!')
  }

  const wrongHint = $derived(checked && selectedCard !== 'mountain')

  // Confident-level short check — triggered when the learner taps Find Awa to
  // move on. They must answer correctly before the page advances.
  // Cultural-safety focus: maunga comes from a reviewed example, not a guess.
  const QUIZ = {
    question: 'Why does Kiki use this maunga?',
    options: [
      'It belongs to this practice school example',
      'It is the tallest mountain',
      'Kiki picked it randomly',
    ],
    correctIndex: 0,
  }
  let pickedOption = $state<number | null>(null)
  let quizChecked = $state(false)
  let quizPassed = $state(false)
  let showQuiz = $state(false)

  // Find Awa: Beginner (or once the check is passed) advances straight away;
  // Confident must first answer the short cultural-safety check.
  function handleNext() {
    if (isBeginner || quizPassed) {
      onNext()
    } else {
      showQuiz = true
    }
  }

  function pickOption(i: number) {
    pickedOption = i
    quizChecked = false // hide any previous hint while they reconsider
  }

  function checkQuiz() {
    if (pickedOption === null) return
    quizChecked = true
    if (pickedOption === QUIZ.correctIndex) {
      quizPassed = true
      showQuiz = false
      speak('Ka pai! Maunga should not be guessed.')
      onNext()
    } else {
      speak('Not quite — have another try.')
    }
  }

  const readText = $derived(
    showQuiz
      ? `${QUIZ.question} ` + QUIZ.options.map((o, i) => `Option ${i + 1}: ${o}.`).join(' ')
      : `${title}. ${kikiLine} Which one is the maunga?`
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

  <!-- Title + speaker -->
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

  <!-- Notebook: question + three cards -->
  <div class="notebook">
    <p class="question">
      Which one is the <strong>maunga</strong>?
    </p>
    <ul class="cards" aria-label="Find the maunga">
      {#each CARDS as card}
        <li>
          <button
            class="card"
            class:selected={selectedCard === card.id}
            class:correct={found && card.id === 'mountain'}
            class:wrong={wrongHint && selectedCard === card.id}
            onclick={() => pickCard(card.id)}
            aria-pressed={selectedCard === card.id}
          >
            {#if found && card.id === 'mountain'}
              <span class="card-tick" aria-hidden="true">✓</span>
            {/if}
            <img src={card.img} alt={card.alt} />
          </button>
        </li>
      {/each}
    </ul>
    {#if wrongHint}
      <p class="hint">Try again. Maunga means mountain.</p>
    {/if}

    <!-- Action buttons sit directly below the option cards -->
    <div class="actions">
      <button class="img-btn" onclick={() => speak(`${maunga}. ${maungaLine}`)} aria-label="Listen">
        <img src={listenImg} alt="Listen" />
      </button>
      <button class="img-btn" onclick={() => speak('Maunga means mountain. Tap the mountain.')} aria-label="Need help?">
        <img src={needHelpImg} alt="Need help?" />
      </button>
      <button class="img-btn" onclick={checkAnswer} aria-label="Check answer">
        <img src={checkImg} alt="Check answer" />
      </button>
    </div>
  </div>

  <!-- Reveal panel — right (shown once the mountain is found) -->
  {#if found}
    <div class="reveal" role="status">
      <div class="sticker-card" style="background-image:url({stickerBgImg})">
        <img src={foundBannerImg} alt="You found it!" class="reveal-banner" />
        <img src={stickerImg} alt={`Maunga Sticker. ${maunga}. ${maungaLine}`} class="reveal-card" />
      </div>
      {#if stickerAdded}
        <img src={addedPillImg} alt="Maunga sticker added!" class="reveal-added" />
      {:else}
        <button class="img-btn add-btn" onclick={addSticker} aria-label="Add Sticker">
          <img src={addStickerImg} alt="Add Sticker" />
        </button>
      {/if}

      <!-- Find Awa appears once the maunga is found, below the reveal panel -->
      <button class="img-btn find-btn" onclick={handleNext} aria-label="Find Awa">
        <img src={findAwaImg} alt="Find Awa" />
      </button>
    </div>
  {/if}

  <!-- Confident-level short check — appears once the maunga is found -->
  {#if showQuiz}
    <div class="quiz-overlay" role="dialog" aria-modal="true" aria-label={QUIZ.question}>
      <div class="quiz-card">
        <p class="quiz-line">{maungaLine}</p>
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

  /* Title — top centre, speaker tucked at bottom-right */
  .title-board {
    position: absolute;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 35;
    pointer-events: none;
  }
  .title-board > img {
    width: min(450px, 40vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
  }
  .title-play {
    position: absolute;
    right: -2%;
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
    width: min(48px, 5.5vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25));
  }
  .title-play:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 50%; }

  /* Read to me — bottom-left (in the bottom bar) */
  .read-btn img { width: min(190px, 21vw); }

  /* Kiki + bubble — left */
  .kiki-block {
    position: absolute;
    top: 40%;
    left: 10%;
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

  /* Notebook panel — centre */
  .notebook {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-52%);
    width: min(575px, 52.5vw);
    z-index: 20;
    background: #fffdf3;
    border: 4px solid #d8c08a;
    border-radius: 22px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    padding: clamp(12px, 1.8vw, 20px);
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.4vw, 16px);
  }
  .question {
    margin: 0;
    text-align: center;
    font-size: clamp(15px, 1.8vw, 21px);
    font-weight: 900;
    color: #3a4a2a;
    line-height: 1.3;
  }
  .question strong { color: #2f8a3e; }
  .cards {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: clamp(8px, 1.2vw, 14px);
  }
  .cards li { flex: 1 1 0; display: flex; min-width: 0; }
  .card {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    width: 100%;
    background: none;
    border: 3px solid transparent;
    border-radius: 16px;
    padding: 4px;
    cursor: pointer;
    transition: transform 0.14s ease, box-shadow 0.2s ease;
  }
  .card img { width: 100%; height: auto; display: block; }
  .card:hover  { transform: translateY(-4px); }
  .card:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .card.selected {
    box-shadow: 0 0 0 4px #ffd54a;
    border-radius: 18px;
  }
  .card.correct { box-shadow: 0 0 0 4px #3fae45; }
  .card.wrong { animation: wiggle 0.4s ease; }
  @keyframes wiggle {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
  .card-tick {
    position: absolute;
    top: -2px;
    right: -2px;
    width: clamp(26px, 3vw, 34px);
    height: clamp(26px, 3vw, 34px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #3fae45;
    color: #fff;
    font-size: clamp(15px, 1.8vw, 20px);
    font-weight: 900;
    border: 3px solid #fff;
    box-shadow: 0 3px 8px rgba(0,0,0,0.25);
    z-index: 2;
  }
  .hint {
    margin: 0;
    text-align: center;
    font-size: clamp(13px, 1.5vw, 17px);
    font-weight: 800;
    color: #c0392b;
  }

  /* Action buttons row — directly below the option cards */
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 1.4vw, 18px);
    flex-wrap: wrap;
  }
  .actions img { width: min(150px, 15vw); }

  /* Reveal panel — right */
  .reveal {
    position: absolute;
    top: 15%;
    right: 10%;
    z-index: 28;
    width: min(230px, 24vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .reveal-banner { width: 92%; height: auto; display: block; }
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
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.28));
  }
  /* Per-maunga reveal sticker (fixed art selected from MAUNGA_STICKERS) */
  .reveal-card {
    width: 100%;
    height: auto;
    display: block;
  }
  .reveal-added { width: 95%; height: auto; display: block; }
  .add-btn img { width: min(180px, 20vw); }

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
  .find-btn img { width: min(210px, 23vw); }
  /* Gentle breathing pulse to draw the eye once Find Awa appears */
  .find-btn { animation: breathe 1.8s ease-in-out infinite; }
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.06); }
  }
  @media (prefers-reduced-motion: reduce) {
    .find-btn { animation: none; }
  }

  /* Confident-level short-check overlay */
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
  .quiz-line {
    margin: 0;
    font-size: clamp(16px, 2vw, 22px);
    font-weight: 900;
    color: #2f8a3e;
    line-height: 1.3;
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