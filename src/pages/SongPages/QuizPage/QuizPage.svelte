<!-- Grace Liao -->
<script lang="ts">
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

  let { onFinish = () => {}, onBack = () => {}, onMap = () => {} }: Props = $props();

  const quizzes: Quiz[] = [
    {
      badge: 'Word check',
      question: 'Which word did you hear?',
      readWord: 'tātou',
      options: [
        { id: 'tatou', icon: '👥', word: 'tātou',  isCorrect: true,  bg: '#f9f9f9' },
        { id: 'whare', icon: '🏠', word: 'whare',  isCorrect: false, bg: '#fde8ee' },
        { id: 'kai',   icon: '🍎', word: 'kai',    isCorrect: false, bg: '#fef6e4' },
      ],
      correctTitle: 'Yes!',
      correctBody: 'Ka pai! You heard "tātou".',
      wrongTitle: 'Try again',
      wrongBody: 'Try again. Listen for the word that means all of us together.',
      kikiCorrect: 'Great listening. "Tātou" means all of us together.',
      kikiWrong: 'Look for the word that matches the people together picture.',
    },
    {
      badge: 'Meaning check',
      question: 'What is this song about?',
      readWord: 'Being together',
      options: [
        { id: 'together', icon: '👥',   word: 'Being together',   isCorrect: true,  bg: '#f9f9f9' },
        { id: 'sleep',    icon: '🌙',   word: 'Going to sleep',   isCorrect: false, bg: '#fde8ee' },
        { id: 'count',    icon: '1 2 3', iconText: true, word: 'Counting numbers', isCorrect: false, bg: '#fef6e4' },
      ],
      correctTitle: 'Yes!',
      correctBody: 'Ka pai! This song is about being together.',
      wrongTitle: 'Try again',
      wrongBody: 'Try again. Think about what the words in the song mean.',
      kikiCorrect: '"Tātou" means we are all together — that\'s what this song celebrates!',
      kikiWrong: 'Think about what "tātou" means and look at the group picture.',
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
    if (isLast) { onFinish(); return; }
    leaving = true;
    setTimeout(() => {
      currentIdx++;
      selected = null;
      leaving  = false;
    }, 280);
  }

  function readToMe() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(quiz.readWord);
      utt.rate = 0.75;
      window.speechSynthesis.speak(utt);
    }
  }
</script>

<div class="page">

  <!-- BACKGROUND SCENE -->
  <div class="bg" aria-hidden="true">
    <div class="sky">
      <div class="cloud c1"></div>
      <div class="cloud c2"></div>
    </div>
    <div class="hill hill-l"></div>
    <div class="hill hill-r"></div>
    <div class="sea"></div>
    <div class="ground"></div>
    <div class="planks"></div>
    <div class="kowhai">🌼🌼🌼🌼</div>
    <div class="foliage foliage-l">🌿🌱</div>
    <div class="foliage foliage-r">🌱🌿</div>
    <div class="flower-l">🌺</div>
    <div class="flower-r">🌸</div>
  </div>

  <!-- SIDE PILLARS -->
  <div class="pillar pillar-l" aria-hidden="true">
    <div class="p-cap"></div>
    <div class="p-shaft">
      {#each { length: 6 } as _}
        <div class="p-ring"></div>
      {/each}
    </div>
    <div class="p-base"></div>
  </div>
  <div class="pillar pillar-r" aria-hidden="true">
    <div class="p-cap"></div>
    <div class="p-shaft">
      {#each { length: 6 } as _}
        <div class="p-ring"></div>
      {/each}
    </div>
    <div class="p-base"></div>
  </div>

  <!-- MAP BUTTON -->
  <header class="top-bar">
    <button class="pill btn-map" onclick={onMap}>← Map</button>
  </header>

  <!-- MAIN QUIZ CARD -->
  <div class="content-wrap">
    {#key currentIdx}
      <div class="card-outer" class:leaving>
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

          {#if answered}
            <div class="feedbacks">
              {#if isCorrect}
                <div class="fb yes-fb">
                  <div class="mascot">
                    <span class="bird">🐦</span>
                    <span class="chk">✅</span>
                  </div>
                  <div class="fb-msg">
                    <b class="lbl yes-lbl">{quiz.correctTitle}</b>
                    <p>{quiz.correctBody}</p>
                  </div>
                </div>
                <div class="fb kiki-fb">
                  <div class="mascot"><span class="bird">🐦</span></div>
                  <div class="fb-msg">
                    <b class="lbl kiki-lbl">Kiki says</b>
                    <p>{quiz.kikiCorrect}</p>
                  </div>
                </div>
              {:else}
                <div class="fb try-fb">
                  <div class="mascot">
                    <span class="bird">🐦</span>
                    <span class="chk">❓</span>
                  </div>
                  <div class="fb-msg">
                    <b class="lbl try-lbl">{quiz.wrongTitle}</b>
                    <p>{quiz.wrongBody}</p>
                  </div>
                </div>
                <div class="fb kiki-fb">
                  <div class="mascot"><span class="bird">🐦</span></div>
                  <div class="fb-msg">
                    <b class="lbl kiki-lbl">Kiki says</b>
                    <p>{quiz.kikiWrong}</p>
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
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

  /* ── Background ── */
  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .sky {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 66%;
    background: linear-gradient(180deg,
      #4db8ec 0%, #72cef5 22%, #aadff7 42%,
      #cceadc 56%, #68bf76 61%, #3d9650 67%, #296e38 74%
    );
  }

  .cloud {
    position: absolute;
    background: rgba(255,255,255,.88);
    border-radius: 60px;
  }
  .cloud::before, .cloud::after {
    content: '';
    position: absolute;
    background: rgba(255,255,255,.88);
    border-radius: 50%;
  }
  .c1 { top: 7%; left: 20%; width: 140px; height: 26px; }
  .c1::before { width: 68px; height: 54px; top: -35px; left: 18px; }
  .c1::after  { width: 48px; height: 38px; top: -22px; left: 60px; }
  .c2 { top: 4%; right: 18%; width: 108px; height: 20px; }
  .c2::before { width: 54px; height: 42px; top: -27px; left: 12px; }
  .c2::after  { width: 36px; height: 30px; top: -17px; left: 46px; }

  .hill { position: absolute; border-radius: 50% 50% 0 0 / 60% 60% 0 0; }
  .hill-l { left: 55px;  top: 42%; width: 200px; height: 140px; background: #3a8f4f; }
  .hill-r { right: 55px; top: 44%; width: 165px; height: 115px; background: #2d7040; }

  .sea {
    position: absolute;
    top: 49%; left: 0; right: 0;
    height: 68px;
    background: linear-gradient(180deg, #3ea6d8, #2880b8);
    opacity: .55;
  }

  .ground {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 41%;
    background: linear-gradient(180deg, #c8a050, #b07828 28%, #966020 58%, #7a4c16);
  }

  .planks {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 25%;
    background:
      repeating-linear-gradient(90deg, rgba(0,0,0,.07) 0 1.5px, transparent 1.5px 168px),
      linear-gradient(180deg, #d4a050, #be8838 33%, #a87030 68%, #905820);
    border-top: 2.5px solid rgba(0,0,0,.2);
  }

  .kowhai {
    position: absolute;
    top: 0; right: 1.5%;
    font-size: 28px; letter-spacing: -5px;
    transform: rotate(-8deg);
    filter: drop-shadow(0 3px 6px rgba(0,0,0,.3));
    z-index: 2;
  }
  .foliage { position: absolute; bottom: 22%; font-size: 34px; filter: drop-shadow(0 2px 5px rgba(0,0,0,.25)); }
  .foliage-l { left: 68px;  transform: scaleX(-1) rotate(15deg); }
  .foliage-r { right: 68px; transform: rotate(-12deg); }
  .flower-l { position: absolute; bottom: 28%; left: 72px;  font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,.2)); }
  .flower-r { position: absolute; bottom: 26%; right: 72px; font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,.2)); }

  /* ── Pillars ── */
  .pillar { position: fixed; top: 0; bottom: 0; width: 62px; z-index: 10; display: flex; flex-direction: column; pointer-events: none; }
  .pillar-l { left: 0; }
  .pillar-r { right: 0; }
  .p-cap  { height: 34px; background: #4a1e06; border-radius: 6px 6px 0 0; box-shadow: inset 0 -4px 0 rgba(0,0,0,.35), 0 5px 14px rgba(0,0,0,.45); }
  .p-shaft {
    flex: 1;
    background: linear-gradient(90deg, #5c2810 0%, #8b4820 45%, #6a3418 100%);
    display: flex; flex-direction: column; justify-content: space-evenly; align-items: center;
    padding: 10px 0;
    box-shadow: inset 4px 0 8px rgba(0,0,0,.2), inset -4px 0 8px rgba(0,0,0,.2);
  }
  .p-ring {
    width: 46px; height: 20px; border-radius: 50%;
    border: 2.5px solid rgba(220,150,60,.5);
    background: rgba(150,70,20,.35);
    box-shadow: 0 2px 5px rgba(0,0,0,.3);
    position: relative;
  }
  .p-ring::before { content: ''; position: absolute; inset: 3px; border-radius: 50%; border: 1.5px solid rgba(240,180,80,.3); }
  .p-base { height: 42px; background: #4a1e06; border-radius: 0 0 6px 6px; box-shadow: inset 0 4px 0 rgba(0,0,0,.3), 0 -5px 14px rgba(0,0,0,.35); }

  /* ── Top bar ── */
  .top-bar {
    position: relative; z-index: 20;
    width: 100%; padding: 14px 78px; box-sizing: border-box;
    display: flex; justify-content: flex-start;
  }

  /* ── Content area ── */
  .content-wrap {
    position: relative; z-index: 20;
    width: 100%; max-width: 840px;
    padding: 0 78px 116px; box-sizing: border-box;
    flex: 1;
  }

  /* ── Card transition ── */
  .card-outer {
    display: flex; flex-direction: column; align-items: center;
    animation: slideIn .32s ease both;
  }
  .card-outer.leaving {
    animation: slideOut .28s ease forwards;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-40px); }
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
    background: rgba(255,255,255,.97);
    border-radius: 24px;
    padding: 30px 28px 28px;
    box-shadow: 0 12px 40px rgba(0,0,0,.17), 0 4px 12px rgba(0,0,0,.1);
    display: flex; flex-direction: column; align-items: center;
    gap: 18px; box-sizing: border-box;
  }

  h1 {
    font-size: clamp(24px, 3.4vw, 38px);
    font-weight: 900; color: #111; margin: 0;
    text-align: center; line-height: 1.2; letter-spacing: -.5px;
  }

  /* ── Options ── */
  .opts {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 12px; width: 100%;
  }

  .opt {
    border: 3px solid transparent; border-radius: 18px;
    padding: 18px 10px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center;
    gap: 10px; min-height: 155px; justify-content: center;
    transition: transform .15s ease, box-shadow .15s ease, border-color .2s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,.08);
    font-family: inherit; outline: none;
  }
  .opt:hover { transform: translateY(-4px); box-shadow: 0 8px 22px rgba(0,0,0,.13); }
  .opt:active { transform: translateY(-1px); }
  .opt.correct { border-color: #4caf50 !important; background-color: #f0fff4 !important; box-shadow: 0 4px 16px rgba(76,175,80,.3) !important; }
  .opt.wrong   { border-color: #f44336 !important; background-color: #fff5f5 !important; box-shadow: 0 4px 16px rgba(244,67,54,.3) !important; }

  .emoji     { font-size: 50px; line-height: 1; display: block; }
  .icon-text { font-size: 28px; font-weight: 900; color: #333; line-height: 1.2; }
  .word      { font-size: 19px; font-weight: 800; color: #111; letter-spacing: -.2px; text-align: center; }

  /* ── Feedback ── */
  .feedbacks { display: flex; flex-direction: column; gap: 10px; width: 100%; }

  .fb {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 16px; border-radius: 16px;
    border: 2.5px solid transparent;
    animation: fbSlide .36s ease both;
  }
  .fb:nth-child(2) { animation-delay: .18s; }

  @keyframes fbSlide {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .yes-fb  { border-color: #4caf50; background: #ffffff; }
  .try-fb  { border-color: #F5A623; background: #fffdf5; }
  .kiki-fb { border-color: #9c27b0; background: #f3e5f5; }

  .mascot { position: relative; width: 52px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .bird   { font-size: 36px; line-height: 1; }
  .chk    { position: absolute; top: -8px; right: -8px; font-size: 18px; }

  .fb-msg { display: flex; flex-direction: column; gap: 1px; }
  .lbl    { display: block; font-size: 16px; font-weight: 800; }
  .yes-lbl  { color: #2e7d32; }
  .try-lbl  { color: #8a5a00; }
  .kiki-lbl { color: #7b1fa2; font-size: 14px; }
  .fb-msg p { margin: 0; color: #2c2c2c; font-size: 14.5px; font-weight: 500; line-height: 1.45; }

  /* ── Bottom nav ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    z-index: 30; padding: 10px 18px 20px;
    display: flex; justify-content: space-between; align-items: center;
  }

  /* ── Pill buttons ── */
  .pill {
    border: none; border-radius: 100px;
    padding: 12px 24px; font-family: inherit;
    font-size: 15px; font-weight: 700; cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease;
    outline: none; box-shadow: 0 4px 12px rgba(0,0,0,.22);
    white-space: nowrap;
  }
  .pill:hover  { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.28); }
  .pill:active { transform: translateY(0); }

  .btn-map, .btn-back, .btn-read { background: #fff; color: #333; }

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
