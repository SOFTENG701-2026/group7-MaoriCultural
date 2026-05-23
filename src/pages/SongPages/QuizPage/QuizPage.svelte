<!-- Grace Liao -->
<script lang="ts">
  import background   from '../../../assets/common/background.png';
  import kiwiYes      from '../../../assets/quiz-page/kiwiyes.png';
  import kiwiTryAgain from '../../../assets/quiz-page/kiwitryagain.png';
  import kikiSays     from '../../../assets/quiz-page/kikisays.png';
  import { settings, speak } from '../../../lib/settings.svelte';
  import { push } from 'svelte-spa-router';

  interface Option {
    id: string;
    icon: string;
    iconText?: boolean;
    word: string;
    isCorrect: boolean;
    bg: string;
  }

  interface Quiz {
    badge: string;
    question: string;
    readWord: string;
    options: Option[];
    correctTitle: string;
    correctBody: string;
    wrongTitle: string;
    wrongBody: string;
    kikiCorrect: string;
    kikiWrong: string;
  }

  interface Props {
    onFinish?: () => void;
    onBack?: () => void;
    onMap?: () => void;
  }

  let { onFinish = () => {}, onBack = () => push('/'), onMap = () => push('/') }: Props = $props();

  const quizzes: Quiz[] = [
    {
      // FR10: recognise the Māori colour word from Ngā Tae
      badge: 'Word check',
      question: 'Which one is a Māori colour word from Ngā Tae?',
      readWord: 'Which one is a Māori colour word from Ngā Tae? whero, kai, whare, kuri',
      options: [
        { id: 'whero', icon: '🔴', word: 'whero', isCorrect: true,  bg: '#f9f9f9' },
        { id: 'kai',   icon: '🍎', word: 'kai',   isCorrect: false, bg: '#fde8ee' },
        { id: 'whare', icon: '🏠', word: 'whare', isCorrect: false, bg: '#fef6e4' },
        { id: 'kuri',  icon: '🐕', word: 'kuri',  isCorrect: false, bg: '#f0f4ff' },
      ],
      correctTitle: 'Yes!',
      correctBody: 'Ka pai! "Whero" is the Māori colour word from Ngā Tae.',
      wrongTitle: 'Try again',
      wrongBody: 'Try again. Listen for the colour word in the song.',
      kikiCorrect: '"Whero" is the colour word. It is one of the colours in Ngā Tae!',
      kikiWrong: 'Look for the word that is a colour in the song Ngā Tae.',
    },
    {
      // FR11: understand the meaning of the colour word
      badge: 'Meaning check',
      question: 'What colour does "whero" mean?',
      readWord: 'What colour does whero mean? red, white, green, black',
      options: [
        { id: 'red',   icon: '🔴', word: 'red',   isCorrect: true,  bg: '#fff0f0' },
        { id: 'white', icon: '⚪', word: 'white', isCorrect: false, bg: '#f9f9f9' },
        { id: 'green', icon: '🟢', word: 'green', isCorrect: false, bg: '#f0fff4' },
        { id: 'black', icon: '⚫', word: 'black', isCorrect: false, bg: '#f5f5f5' },
      ],
      correctTitle: 'Yes!',
      correctBody: 'Ka pai! "Whero" means red.',
      wrongTitle: 'Try again',
      wrongBody: 'Try again. Think about the colour of the whero circle.',
      kikiCorrect: 'Great work! "Whero" is the Māori word for red.',
      kikiWrong: 'Look at the red circle — that colour is "whero" in Māori.',
    },
  ];

  let currentIdx = $state(0);
  let selected   = $state<string | null>(null);
  let leaving    = $state(false);

  let quiz      = $derived(quizzes[currentIdx]);
  let answered  = $derived(selected !== null);
  let isCorrect = $derived(quiz.options.find(o => o.id === selected)?.isCorrect ?? false);
  let isLast    = $derived(currentIdx === quizzes.length - 1);

  function pick(opt: Option) {
    selected = opt.id;
  }

  function goNext() {
    if (!isCorrect) return;
    if (isLast) { onFinish(); push('/reward'); return; }
    leaving = true;
    setTimeout(() => {
      currentIdx++;
      selected = null;
      leaving  = false;
    }, 280);
  }

  // Routed through the shared helper so Sound on/off and Volume settings apply.
  function readToMe() {
    speak(quiz.readWord);
  }

  // In "Out loud" mode, read each question's word as it appears (this effect
  // also runs once on mount).
  $effect(() => {
    quiz.readWord; // track so it re-reads when the question changes
    if (settings.readMode === 'auto') speak(quiz.readWord);
  });
</script>

<div class="page">
  <div class="bg-image" style:background-image="url({background})" aria-hidden="true"></div>

  <!-- MAP BUTTON -->
  <button class="pill btn-map" onclick={onMap}>← Map</button>

  <!-- MAIN QUIZ CARD + FEEDBACK -->
  <div class="content-wrap">
    {#key currentIdx}
      <div class="slide-wrap" class:leaving>

        <!-- White quiz card: badge + question + options only -->
        <div class="card-outer">
          <div class="badge">{quiz.badge}</div>
          <div class="card">
            <h1>{quiz.question}</h1>

            <div class="opts">
              {#each quiz.options as opt}
                <button
                  class="opt"
                  class:correct={answered && opt.isCorrect && selected === opt.id}
                  class:wrong={answered && !opt.isCorrect && selected === opt.id}
                  style:background-color={opt.bg}
                  onclick={() => pick(opt)}
                  aria-pressed={selected === opt.id}
                >
                  {#if opt.iconText}
                    <span class="icon-text">{opt.icon}</span>
                  {:else}
                    <span class="emoji">{opt.icon}</span>
                  {/if}
                  <span class="word">{opt.word}</span>
                </button>
              {/each}
            </div>
          </div>
        </div>

        <!-- Feedback panels: outside the card, on the background -->
        {#if answered}
          <div class="feedbacks">

            {#if isCorrect}
              <!-- Correct: Yes panel -->
              <div class="fb yes-fb">
                <img src={kiwiYes} alt="Kiwi yes" class="fb-img" />
                <div class="fb-msg">
                  <b class="lbl yes-lbl">{quiz.correctTitle}</b>
                  <p>{quiz.correctBody}</p>
                </div>
              </div>
            {:else}
              <!-- Wrong: Try again panel -->
              <div class="fb try-fb">
                <img src={kiwiTryAgain} alt="Kiwi try again" class="fb-img" />
                <div class="fb-msg">
                  <b class="lbl try-lbl">{quiz.wrongTitle}</b>
                  <p>{quiz.wrongBody}</p>
                </div>
              </div>
            {/if}

            <!-- Kiki says panel (always shown after answering) -->
            <div class="fb kiki-fb">
              <img src={kikiSays} alt="Kiki says" class="fb-img" />
              <div class="fb-msg">
                <b class="lbl kiki-lbl">Kiki says</b>
                <p>{isCorrect ? quiz.kikiCorrect : quiz.kikiWrong}</p>
              </div>
            </div>

          </div>
        {/if}

      </div>
    {/key}
  </div>

  <!-- BOTTOM NAV -->
  <nav class="bottom-nav">
    <button class="pill btn-back" onclick={onBack}>← Back</button>
    <button class="pill btn-read" onclick={readToMe}>🔊 Read to me</button>
    <button class="pill btn-next" onclick={goNext} disabled={!isCorrect}>
      {isLast ? 'Finish →' : 'Next →'}
    </button>
  </nav>

</div>

<style>
  /* ── Root ── */
  .page {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Nunito', 'Varela Round', 'Trebuchet MS', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bg-image {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  /* ── Map button (fixed top-left) ── */
  .btn-map {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
  }

  /* ── Content area ── */
  .content-wrap {
    position: relative; z-index: 20;
    width: 90%;
    max-width: 1200px;
    padding: 60px 0 110px; box-sizing: border-box;
    flex: 1;
  }

  /* ── Slide transition ── */
  .slide-wrap {
    display: flex; flex-direction: column; gap: 14px;
    animation: slideIn .32s ease both;
  }
  .slide-wrap.leaving { animation: slideOut .28s ease forwards; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-40px); }
  }

  /* ── Card outer (badge straddles top edge) ── */
  .card-outer {
    display: flex; flex-direction: column; align-items: center;
  }

  .badge {
    position: relative; z-index: 1;
    background: #F5A623; color: #2c1600;
    font-weight: 800; font-size: 15px;
    padding: 8px 24px; border-radius: 100px;
    box-shadow: 0 4px 12px rgba(245,166,35,.45);
    letter-spacing: .4px;
    margin-bottom: -16px;
  }

  .card {
    width: 100%;
    background: rgba(255,255,255,.96);
    border-radius: 24px;
    padding: 30px 28px 28px;
    box-shadow: 0 12px 40px rgba(0,0,0,.17), 0 4px 12px rgba(0,0,0,.1);
    display: flex; flex-direction: column; align-items: center;
    gap: 18px; box-sizing: border-box;
  }

  h1 {
    font-size: clamp(28px, 3.8vw, 46px);
    font-weight: 900; color: #111; margin: 0;
    text-align: center; line-height: 1.2; letter-spacing: -.5px;
  }

  /* ── Options ── */
  .opts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px; width: 100%;
  }

  .opt {
    border: 3px solid transparent; border-radius: 18px;
    padding: 24px 14px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center;
    gap: 14px; min-height: 200px; justify-content: center;
    transition: transform .15s ease, box-shadow .15s ease, border-color .2s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,.08);
    font-family: inherit; outline: none;
  }
  .opt:hover { transform: translateY(-4px); box-shadow: 0 8px 22px rgba(0,0,0,.13); }
  .opt:active { transform: translateY(-1px); }
  .opt.correct { border-color: #4caf50 !important; background-color: #f0fff4 !important; box-shadow: 0 4px 16px rgba(76,175,80,.3) !important; }
  .opt.wrong   { border-color: #F5A623 !important; background-color: #fffbf0 !important; box-shadow: 0 4px 16px rgba(245,166,35,.35) !important; }

  .emoji     { font-size: 64px; line-height: 1; display: block; }
  .icon-text { font-size: 36px; font-weight: 900; color: #333; line-height: 1.2; }
  .word      { font-size: 22px; font-weight: 800; color: #111; letter-spacing: -.2px; text-align: center; }

  /* ── Feedback panels (outside card) ── */
  .feedbacks {
    display: flex; flex-direction: column; gap: 10px; width: 100%;
  }

  .fb {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 18px; border-radius: 18px;
    border: 2.5px solid transparent;
    background: rgba(255,255,255,.95);
    box-shadow: 0 4px 16px rgba(0,0,0,.1);
    animation: fbSlide .36s ease both;
  }
  .fb:nth-child(2) { animation-delay: .16s; }

  @keyframes fbSlide {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .yes-fb  { border-color: #4caf50; }
  .try-fb  { border-color: #F5A623; }
  .kiki-fb { border-color: #9c27b0; background: rgba(243,229,245,.96); }

  .fb-img {
    width: 90px;
    height: 90px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .fb-msg { display: flex; flex-direction: column; gap: 2px; }
  .lbl    { display: block; font-size: 17px; font-weight: 800; }
  .yes-lbl  { color: #2e7d32; }
  .try-lbl  { color: #8a5a00; }
  .kiki-lbl { color: #7b1fa2; font-size: 14px; }
  .fb-msg p { margin: 0; color: #2c2c2c; font-size: 15px; font-weight: 500; line-height: 1.45; }

  /* ── Bottom nav ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    z-index: 30; padding: 10px 18px 20px;
    display: flex; justify-content: space-between; align-items: center;
  }

  /* ── Pill buttons ── */
  .pill {
    border: none; border-radius: 100px;
    padding: 16px 36px; font-family: inherit;
    font-size: 18px; font-weight: 700; cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease;
    outline: none; box-shadow: 0 4px 12px rgba(0,0,0,.22);
    white-space: nowrap;
  }
  .pill:hover  { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.28); }
  .pill:active { transform: translateY(0); }

  .btn-map  { background: #fff; color: #333; }
  .btn-back, .btn-read { background: #fff; color: #333; }

  .btn-next {
    background: #F5A623; color: #2c1600; font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(245,166,35,.35); }
    50%       { transform: scale(1.06); box-shadow: 0 8px 24px rgba(245,166,35,.6);  }
  }
  .btn-next:disabled {
    background: #d0d0d0; color: #888;
    box-shadow: none; cursor: not-allowed;
    transform: none; animation: none;
  }
</style>
