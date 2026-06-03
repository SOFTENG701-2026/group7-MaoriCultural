<script lang="ts">
  // Step 5 — Quiz + Fun Facts. Simple questions about the story's kupu Māori.
  // Correct → Kiki cheers and shares a related Fun Fact. Wrong → no punishment:
  // Kiki says "Let's think again" with a gentle hint, and the child can retry.
  import type { QuizQuestion, QuizOption } from '../stories'
  import { narrate } from '../../../lib/settings.svelte'
  import KiwiGuide from './KiwiGuide.svelte'
  import ReadToMe from '../../../lib/ReadToMe.svelte'

  interface Props {
    quiz: QuizQuestion[]
    onComplete: () => void
  }
  let { quiz, onComplete }: Props = $props()

  let idx = $state(0)
  let selected = $state<string | null>(null)
  let leaving = $state(false)

  const q = $derived(quiz[idx])
  const answered = $derived(selected !== null)
  const chosen = $derived(q.options.find((o) => o.id === selected) ?? null)
  const isCorrect = $derived(chosen?.correct ?? false)
  const isLast = $derived(idx === quiz.length - 1)
  const readText = $derived(`${q.question} ${q.options.map((o) => o.word).join(', ')}`)

  function pick(opt: QuizOption) {
    selected = opt.id
    if (opt.correct) narrate(`${q.kikiCorrect} ${q.funFact}`)
    else narrate(`Let's think again. ${q.hint}`)
  }

  function next() {
    if (!isCorrect) return
    if (isLast) {
      onComplete()
      return
    }
    leaving = true
    setTimeout(() => {
      idx += 1
      selected = null
      leaving = false
    }, 280)
  }
</script>

<div class="quiz">
  <div class="progress" aria-label={`Question ${idx + 1} of ${quiz.length}`}>
    {#each quiz as item, i (item.id)}
      <span class="pip" class:on={i === idx} class:seen={i < idx}></span>
    {/each}
  </div>

  {#key idx}
    <div class="slide" class:leaving>
      <div class="card-outer">
        <div class="badge">{q.badge}</div>
        <div class="card">
          <h1>{q.question}</h1>
          <div class="opts">
            {#each q.options as opt (opt.id)}
              <button
                class="opt"
                class:correct={answered && opt.correct && selected === opt.id}
                class:wrong={answered && !opt.correct && selected === opt.id}
                onclick={() => pick(opt)}
                aria-pressed={selected === opt.id}
              >
                <span class="emoji">{opt.emoji}</span>
                <span class="word">{opt.word}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      {#if answered}
        <div class="feedback">
          {#if isCorrect}
            <KiwiGuide pose="yes" text={q.kikiCorrect} size="sm" />
            <div class="funfact">
              <span class="ff-label">✨ Fun Fact</span>
              <p>{q.funFact}</p>
            </div>
          {:else}
            <KiwiGuide pose="tryagain" text={`Let's think again. ${q.hint}`} size="sm" />
          {/if}
        </div>
      {/if}
    </div>
  {/key}

  <nav class="bottom-nav">
    <ReadToMe text={readText} />
    <button class="pill cta" onclick={next} disabled={!isCorrect}>
      {isLast ? 'Finish →' : 'Next →'}
    </button>
  </nav>
</div>

<style>
  .quiz {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 1.6vh, 16px);
    width: 100%;
    max-width: 880px;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    overflow: hidden;
  }

  .progress { flex: 0 0 auto; display: flex; gap: 8px; }
  .pip { width: 12px; height: 12px; border-radius: 50%; background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); transition: background 0.3s, transform 0.3s; }
  .pip.on { background: #f5a623; transform: scale(1.25); }
  .pip.seen { background: #4caf50; }

  .slide { flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; width: 100%; animation: slideIn 0.32s ease both; }
  .slide.leaving { animation: slideOut 0.26s ease forwards; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-36px); } }

  .card-outer { display: flex; flex-direction: column; align-items: center; width: 100%; }
  .badge {
    position: relative;
    z-index: 1;
    background: #f5a623;
    color: #2c1600;
    font-weight: 800;
    font-size: 15px;
    padding: 8px 24px;
    border-radius: 100px;
    box-shadow: 0 4px 12px rgba(245, 166, 35, 0.45);
    margin-bottom: -16px;
  }
  .card {
    width: 100%;
    background: rgba(255, 255, 255, 0.97);
    border-radius: 22px;
    padding: 22px 22px 20px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.17);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(12px, 2vh, 18px);
    box-sizing: border-box;
  }
  h1 { font-size: clamp(20px, 3vw, 36px); font-weight: 900; color: #111; margin: 0; text-align: center; line-height: 1.2; }

  .opts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; width: 100%; }
  .opt {
    border: 3px solid transparent;
    border-radius: 16px;
    padding: 12px 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-height: clamp(92px, 15vh, 132px);
    justify-content: center;
    background: #f7f5ff;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s ease;
    font-family: inherit;
    outline: none;
  }
  .opt:hover { transform: translateY(-4px); box-shadow: 0 8px 22px rgba(0, 0, 0, 0.13); }
  .opt:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }
  .opt.correct { border-color: #4caf50 !important; background: #f0fff4 !important; box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3) !important; }
  .opt.wrong { border-color: #f5a623 !important; background: #fffbf0 !important; box-shadow: 0 4px 16px rgba(245, 166, 35, 0.35) !important; }
  .emoji { font-size: clamp(32px, 6vh, 50px); line-height: 1; }
  .word { font-size: clamp(15px, 1.9vw, 20px); font-weight: 800; color: #111; text-align: center; }

  .feedback { display: flex; flex-direction: column; gap: 12px; width: 100%; }
  .funfact {
    background: linear-gradient(135deg, #fff7e0, #ffe9b8);
    border: 2.5px solid #f5a623;
    border-radius: 18px;
    padding: 14px 20px;
    text-align: left;
    box-shadow: 0 6px 18px rgba(245, 166, 35, 0.25);
    animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .ff-label { font-family: 'Fredoka', system-ui, sans-serif; font-weight: 900; color: #b3690a; font-size: 16px; }
  .funfact p { margin: 4px 0 0; color: #5a3a00; font-weight: 600; font-size: clamp(15px, 1.8vw, 18px); line-height: 1.5; }

  .bottom-nav {
    flex: 0 0 auto;
    width: 100%;
    padding: 4px 4px 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
  }
  .pill {
    border: none;
    border-radius: 100px;
    padding: 14px 32px;
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transition: transform 0.12s, box-shadow 0.12s;
    white-space: nowrap;
    outline: none;
  }
  .pill:hover { transform: translateY(-2px); }
  .pill:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }
  .cta { background: linear-gradient(180deg, #ffd24a, #f5a623); color: #2c1600; animation: breathe 2s ease-in-out infinite; }
  .cta:disabled { background: #d3cbbe; color: #7c7468; cursor: not-allowed; box-shadow: none; animation: none; transform: none; }

  @keyframes pop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @media (prefers-reduced-motion: reduce) { .slide, .funfact, .cta { animation: none !important; } }
</style>
