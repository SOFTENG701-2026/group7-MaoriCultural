<!--
  Pepeha Module — Page 9: Help Kiki Remember

  A playful sticker check (not a formal test), built on Page 7's shared chrome
  (background, Back, Settings, Kiki + speech bubble, notebook background, Read to
  me). One question at a time; correct answer unlocks the next; a wrong answer
  reveals the hint board to the right of the notebook and lets the learner retry.
  No score, grade, or ranking.

  Levels (docs/Pepeha_requirements.md, Page 9):
    • Beginner  — simple recognition questions (maunga/awa bound to the chosen
      practice-school example).
    • Confident — cultural-safety / place-connection questions, including a
      privacy-respecting option for learners who already know their own pepeha.
-->
<script lang="ts">
  import bgImg       from '../../assets/pepeha/page4/background/background_scene.png'
  import readImg     from '../../assets/pepeha/page4/individual_elements/buttons_02.png'
  import backImg     from '../../assets/pepeha/page4/back.png'
  import kikiImg     from '../../assets/kiwihello.png'
  import settingsImg from '../../assets/settings.png'
  import bookImg     from '../../assets/pepeha/page7/bookbg.png'

  // Page-9 content art.
  import titleImg from '../../assets/pepeha/page8/title.png'
  import qnumImg  from '../../assets/pepeha/page8/question_num.png'
  import hintImg  from '../../assets/pepeha/page8/tryagain.png'

  // Beginner answer cards — illustrated sticker per concept (icon on the left,
  // blank label area on the right for the option text). Confident answers are
  // long sentences that don't fit these cards, so they stay as text buttons.
  import imgKiki     from '../../assets/pepeha/page 9/a_clean_bright_cartoon_style_illustration_on_a_v_1_batch_1_transparent.png'
  import imgFamily   from '../../assets/pepeha/page 9/a_clean_colorful_flat_illustration_sticker_like_5_batch_5_transparent.png'
  import imgMountain from '../../assets/pepeha/page 9/a_clean_vector_illustration_style_ui_graphic_on_a_6_batch_6_transparent.png'
  import imgRiver    from '../../assets/pepeha/page 9/a_clean_bright_flat_green_background_solid_vivi_7_batch_7_transparent.png'
  import imgBackpack from '../../assets/pepeha/page 9/a_clean_cartoon_illustration_style_ui_scene_on_a_8_batch_8_transparent.png'

  import { pepehaState } from '../../lib/pepehaState.svelte'
  import { speak, settings } from '../../lib/settings.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const isBeginner = $derived(pepehaState.level === 'beginner')

  const pageTitle = 'Help Kiki Remember'
  const instruction = $derived(isBeginner ? 'Tap the right sticker.' : 'Choose the best answer.')

  // The maunga/awa come from the chosen practice-school example.
  const school = $derived(pepehaState.selectedSchool)
  const maunga = $derived(school?.maunga ?? 'Ōwairaka')
  const awa = $derived(school?.awa ?? 'Whau')

  // ── Questions ─────────────────────────────────────────────────────────────
  // `answer` is the correct option text; options are authored in mixed order so
  // the correct one is not always first.
  // Beginner options carry an illustrated card image; Confident options are
  // text only (long sentences shown as text buttons).
  type Opt = { text: string; img?: string }
  type Question = { prompt: string; options: Opt[]; answer: string; hint: string }
  const questions = $derived<Question[]>(
    isBeginner
      ? [
          { prompt: 'Which one is the maunga?',
            options: [
              { text: awa, img: imgRiver },
              { text: maunga, img: imgMountain },
              { text: 'Kiki', img: imgKiki },
              { text: 'Whānau', img: imgFamily },
            ], answer: maunga, hint: 'Maunga means mountain. 🏔️' },
          { prompt: 'Which one is the awa?',
            options: [
              { text: 'Kiki', img: imgKiki },
              { text: awa, img: imgRiver },
              { text: maunga, img: imgMountain },
              { text: 'Whānau', img: imgFamily },
            ], answer: awa, hint: 'Awa means river. 🌊' },
          { prompt: 'What is whānau?',
            options: [
              { text: 'Mountain', img: imgMountain },
              { text: 'Caring people', img: imgFamily },
              { text: 'River', img: imgRiver },
              { text: 'Backpack', img: imgBackpack },
            ], answer: 'Caring people', hint: 'Whānau means caring people. ❤️' },
          { prompt: 'For your own pepeha, what should you do?',
            options: [
              { text: 'Guess any mountain', img: imgMountain },
              { text: 'Copy Kiki', img: imgKiki },
              { text: 'Ask people who know your story', img: imgFamily },
            ], answer: 'Ask people who know your story',
            hint: 'Ask people who know your story.' },
        ]
      : [
          { prompt: 'Why should Kiki not invent a maunga?',
            options: [
              { text: 'Any mountain is fine' },
              { text: 'Pepeha should connect to real place knowledge' },
              { text: 'The tallest mountain is always correct' },
            ], answer: 'Pepeha should connect to real place knowledge',
            hint: 'A maunga connects to real place knowledge.' },
          { prompt: 'Why is whānau important?',
            options: [
              { text: 'Whānau means river' },
              { text: 'Whānau can help people know their story' },
              { text: 'Whānau means a school bag' },
            ], answer: 'Whānau can help people know their story',
            hint: 'Whānau helps people know their story.' },
          { prompt: 'If a learner already knows their own pepeha, what can they do?',
            options: [
              { text: 'Type it into every app' },
              { text: 'Replace Kiki’s example for everyone' },
              { text: 'Share it only if they want to and if it is okay' },
            ], answer: 'Share it only if they want to and if it is okay',
            hint: 'It is okay to keep your pepeha private.' },
          { prompt: 'What is Kiki’s board?',
            options: [
              { text: 'Everyone’s real pepeha' },
              { text: 'A practice example' },
              { text: 'A random place list' },
            ], answer: 'A practice example',
            hint: 'Kiki’s board is just a practice example.' },
        ]
  )

  /** Split hint into two lines when it has more than three words. */
  function hintLines(hint: string): [string, string?] {
    const words = hint.trim().split(/\s+/)
    if (words.length <= 3) return [hint]
    return [words.slice(0, 3).join(' '), words.slice(3).join(' ')]
  }

  let qIndex = $state(0)
  let picked = $state<string | null>(null)
  let solved = $state(false)   // current question answered correctly
  let showHint = $state(false) // hint board (wrong answer / Need help?)

  const q = $derived(questions[qIndex])
  const total = $derived(questions.length)
  const isLast = $derived(qIndex === total - 1)
  const qHintLines = $derived(hintLines(q.hint))

  // Show answer options in a randomised order so the correct answer isn't always
  // in the same position. Reshuffles only when the question changes.
  function shuffle(opts: Opt[]): Opt[] {
    const a = [...opts]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  let shuffledOptions = $state<Opt[]>([])
  $effect(() => {
    // Tied to the current question; picking/solving does not reshuffle.
    shuffledOptions = shuffle(q.options)
  })

  const readText = $derived(
    `${instruction} ${q.prompt} ` + shuffledOptions.map((o, i) => `Sticker ${i + 1}: ${o.text}.`).join(' ')
  )

  function pick(opt: string) {
    if (solved) return
    picked = opt
    if (opt === q.answer) {
      solved = true
      showHint = false
      // No score — celebrate effort; the last correct answer gets the closing line.
      speak(isLast ? 'Āe! Pepeha should be handled with care.' : 'Ka pai!')
    } else {
      showHint = true
      speak('Try again. Look at Kiki’s board.')
    }
  }

  function needHelp() {
    showHint = true
    speak(`Look at Kiki’s board. ${q.hint}`)
  }

  function next() {
    if (!solved) return
    if (isLast) {
      onNext()
      return
    }
    qIndex += 1
    picked = null
    solved = false
    showHint = false
  }
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

  <!-- Title (top-centre) -->
  <div class="title-board">
    <img src={titleImg} alt={pageTitle} />
  </div>

  <!-- Question counter banner -->
  <div class="qnum" aria-label={`Question ${qIndex + 1} of ${total}`}>
    <img src={qnumImg} alt="" aria-hidden="true" />
    <span class="num cur">{qIndex + 1}</span>
    <span class="num tot">{total}</span>
  </div>

  <!-- Kiki + speech bubble — left -->
  <div class="kiki-block">
    <div class="bubble"><p>{instruction}</p></div>
    <img src={kikiImg} alt="Kiki the kiwi" class="kiki-img" />
  </div>

  <!-- ════ Interaction zone: notebook with the question + sticker options ════ -->
  <div class="notebook" class:confident={!isBeginner} style="background-image:url({bookImg})">
    <p class="q-prompt">{q.prompt}</p>

    <ul class="opts" class:cards={isBeginner} class:text={!isBeginner} aria-label="Answer stickers">
      {#each shuffledOptions as o (o.text)}
        <li>
          {#if isBeginner}
            <button
              class="opt-card"
              class:correct={solved && o.text === q.answer}
              class:wrong={!solved && picked === o.text}
              style="background-image:url({o.img})"
              disabled={solved}
              onclick={() => pick(o.text)}
              aria-pressed={picked === o.text}
            >
              <span class="opt-card-text">{o.text}</span>
            </button>
          {:else}
            <button
              class="opt"
              class:correct={solved && o.text === q.answer}
              class:wrong={!solved && picked === o.text}
              disabled={solved}
              onclick={() => pick(o.text)}
              aria-pressed={picked === o.text}
            >
              {o.text}
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  <!-- Hint board — to the right of the notebook (wrong answer / Need help?) -->
  {#if showHint}
    <div class="hint-board" role="status">
      <img src={hintImg} alt="Try again. Look at Kiki’s board." />
      <span class="hint-text" class:two-lines={qHintLines[1] != null}>
        {qHintLines[0]}
        {#if qHintLines[1]}<br />{qHintLines[1]}{/if}
      </span>
    </div>
  {/if}

  <!-- Bottom bar: Read to me (left), Need help? + Next/Finish (right) -->
  <div class="bottom-bar">
    <button class="img-btn read-btn" onclick={() => speak(readText)} aria-label="Read to me">
      <img src={readImg} alt="Read to me" />
    </button>

    <div class="nav-cluster">
      <button class="help-btn" onclick={needHelp}>Need help?</button>
      <button class="next-btn" disabled={!solved} onclick={next}>
        {isLast ? 'Finish' : 'Next'} <span aria-hidden="true">→</span>
      </button>
    </div>
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

  /* Title — top centre */
  .title-board {
    position: absolute;
    top: -12%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 35;
    pointer-events: none;
  }
  .title-board img {
    width: min(700px, 34vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
  }

  /* Question counter banner */
  .qnum {
    position: absolute;
    top: 9%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 34;
    width: min(340px, 32vw);
    pointer-events: none;
  }
  .qnum img { width: 100%; height: auto; display: block; }
  .qnum .num {
    position: absolute;
    top: 46%;
    transform: translateY(-50%);
    font-weight: 900;
    font-size: clamp(14px, 1.9vw, 22px);
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.35);
  }
  .qnum .num.cur { left: 58%; }
  .qnum .num.tot { left: 71%; top:48%; }

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
  .nav-cluster {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.4vw, 18px);
    padding-right: clamp(8px, 1.5vw, 20px);
  }

  /* Notebook interaction area — centre, uses the spiral-book art as background */
  .notebook {
    position: absolute;
    top: 21%;
    left: 50%;
    transform: translateX(-50%);
    width: min(700px, 62vw);
    aspect-ratio: 289 / 224;
    z-index: 20;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: clamp(14px, 2vw, 26px) clamp(48px, 6vw, 76px);
    box-sizing: border-box;
  }
  /* Confident: long single-column answers sit close to the prompt, so raise the
     prompt to the top of the notebook and add a clear gap (~20%) before them. */
  .notebook.confident {
    justify-content: flex-start;
    padding-top: clamp(22px, 4.5vw, 52px);
  }
  .notebook.confident .q-prompt {
    margin-bottom: clamp(20px, 5vw, 56px);
  }
  .q-prompt {
    margin: 0 0 clamp(8px, 1.4vw, 16px);
    text-align: center;
    font-size: clamp(15px, 1.9vw, 24px);
    font-weight: 900;
    color: #3a2a12;
    line-height: 1.25;
  }

  /* Sticker-style answer options */
  .opts {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    display: grid;
    gap: clamp(8px, 1.2vw, 14px);
  }
  .opts.cards { grid-template-columns: 1fr 1fr; }
  .opts.text  { grid-template-columns: 1fr; gap: clamp(14px, 2.2vw, 26px); }
  .opts li { display: flex; }
  .opt {
    width: 100%;
    font-family: inherit;
    font-size: clamp(12px, 1.45vw, 18px);
    font-weight: 800;
    color: #2a3a1a;
    background: #fffdf3;
    border: 3px solid #2f8a3e;
    border-radius: 16px;
    padding: clamp(8px, 1.2vw, 14px) clamp(8px, 1.2vw, 16px);
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.16);
    transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }
  .opt:hover:not(:disabled)  { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 18px rgba(0,0,0,0.2); }
  .opt:active:not(:disabled) { transform: scale(0.97); }
  .opt:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .opt:disabled { cursor: default; }

  /* Correct sticker pops and turns green */
  .opt.correct {
    background: #eafbe7;
    border-color: #1f8b34;
    color: #1a6b2c;
    box-shadow: 0 0 0 4px #ffd54a, 0 8px 18px rgba(0,0,0,0.2);
    animation: pop 0.4s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  /* Wrong sticker wiggles and turns red, then can be retried */
  .opt.wrong {
    border-color: #c0392b;
    background: #fdecea;
    color: #a5281b;
    animation: wiggle 0.4s ease;
  }
  @keyframes wiggle {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
  /* Beginner answer cards — illustrated sticker; text in the blank right area */
  .opt-card {
    position: relative;
    width: 100%;
    aspect-ratio: 7 / 5;
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border-radius: 18px;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease, opacity 0.2s ease, filter 0.2s ease;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2));
  }
  .opt-card:hover:not(:disabled)  { transform: translateY(-2px) scale(1.03); }
  .opt-card:active:not(:disabled) { transform: scale(0.97); }
  .opt-card:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .opt-card:disabled { cursor: default; }
  .opt-card:disabled:not(.correct) { opacity: 0.55; }
  /* Option text sits in the card's blank label area on the right */
  .opt-card-text {
    position: absolute;
    right: 4%;
    top: 50%;
    transform: translateY(-50%);
    width: 46%;
    font-family: inherit;
    font-size: clamp(12px, 1.5vw, 19px);
    font-weight: 900;
    color: #5a3a14;
    text-align: center;
    line-height: 1.2;
  }
  .opt-card.correct {
    filter: drop-shadow(0 0 6px #2f8a3e) drop-shadow(0 0 14px rgba(47,138,62,0.65));
    animation: pop 0.4s cubic-bezier(.34,1.56,.64,1);
  }
  .opt-card.correct .opt-card-text { color: #1a6b2c; }
  .opt-card.wrong {
    filter: drop-shadow(0 0 6px #c0392b) drop-shadow(0 0 12px rgba(192,57,43,0.55));
    animation: wiggle 0.4s ease;
  }
  .opt-card.wrong .opt-card-text { color: #a5281b; }

  @media (prefers-reduced-motion: reduce) {
    .opt.correct, .opt.wrong,
    .opt-card.correct, .opt-card.wrong { animation: none; }
  }

  /* Hint board — to the right of the notebook */
  .hint-board {
    position: absolute;
    top: 24%;
    right: -3%;
    z-index: 30;
    width: min(650px, 40vw);
    animation: popIn 0.3s cubic-bezier(.34,1.56,.64,1) both;
  }
  .hint-board img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.28));
  }
  /* Hint text sits in the blank box below "Look at Kiki's board." */
  .hint-text {
    position: absolute;
    left: 14%;
    right: 14%;
    top: 60%;
    transform: translateY(-50%);
    text-align: center;
    font-family: inherit;
    font-size: clamp(12px, 1.5vw, 17px);
    font-weight: 800;
    color: #6a4a18;
    line-height: 1.3;
    white-space: normal;
    word-break: break-word;
  }
  .hint-text.two-lines {
    top: 58%;
    font-size: clamp(11px, 1.35vw, 15px);
    line-height: 1.25;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Need help? — secondary text button */
  .help-btn {
    font-family: inherit;
    font-size: clamp(12px, 1.4vw, 16px);
    font-weight: 800;
    color: #5a3a14;
    background: #fffdf3;
    border: 2px solid #d8c08a;
    border-radius: 14px;
    padding: clamp(8px, 1vw, 12px) clamp(12px, 1.6vw, 18px);
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.14);
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .help-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .help-btn:active { transform: scale(0.97); }
  .help-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }

  /* Next / Finish — green action button */
  .next-btn {
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
    transition: transform 0.12s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  }
  .next-btn:hover:not(:disabled)  { transform: translateY(-2px) scale(1.03); }
  .next-btn:active:not(:disabled) { transform: scale(0.97); }
  .next-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .next-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
</style>