<!-- Tikanga Module — Page 5: Station 3 Wharenui (meeting house) -->
<script lang="ts">
  import bgImg      from '../../assets/tikanga/p5 background.png'
  import kiwiThink  from '../../assets/tikanga/kiwithink.png'
  import kiwiYes    from '../../assets/tikanga/kiwiyes.png'
  import kiwiTry    from '../../assets/tikanga/kiwitryagain.png'
  import needHelp   from '../../assets/tikanga/need help.png'

  import { tikangaState } from '../../lib/tikangaState.svelte'
  import { speak } from '../../lib/settings.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  type Option = { id: string; label: string; correct: boolean; hint: string }

  const alwaysOptions: Option[] = [
    { id: 'shoes',  label: '👟 Take off your shoes',       correct: true,  hint: '' },
    { id: 'quiet',  label: '🤫 Speak quietly',              correct: true,  hint: '' },
  ]

  const beginnerExtra: Option[] = [
    { id: 'photo',  label: '📸 Take a photo of everything', correct: false, hint: 'Always ask permission before taking photos inside the wharenui.' },
    { id: 'touch',  label: '🖐️ Touch the carvings to feel them', correct: false, hint: 'The carvings are tapu (sacred). Do not touch without permission.' },
  ]

  const confidentExtra: Option[] = [
    { id: 'photo',  label: '📷 Take a photo of the carvings', correct: false, hint: 'Always ask permission before photographing — even just the carvings.' },
    { id: 'luck',   label: '🤲 Touch the carvings for good luck', correct: false, hint: 'The carvings are tapu. Touching without permission is disrespectful.' },
  ]

  const options = $derived<Option[]>([
    ...alwaysOptions,
    ...(tikangaState.level === 'beginner' ? beginnerExtra : confidentExtra),
  ])

  let selected   = $state<Set<string>>(new Set())
  let checked    = $state(false)
  let completed  = $state(false)
  let shaking    = $state<string | null>(null)

  const canCheck = $derived(selected.size === 2)

  const readText = 'Station 3: Wharenui. Inside the meeting house, which two behaviours are correct?'

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
      speak('Ka pai! You know the correct way to behave in the wharenui. Station 3 complete!')
      completed = true
    } else {
      const wrongOpt = options.find(o => wrongPicks.includes(o.id))
      if (wrongOpt) {
        shaking = wrongOpt.id
        speak(wrongOpt.hint)
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


  <div class="station-pill">Station 3 — Wharenui</div>
  <button class="pill btn-back" onclick={onBack}>← Back</button>

  <div class="content">

    <img src={completed ? kiwiYes : kiwiThink} alt="Kiwi guide" class="kiwi-img" />

    <div class="card">
      <div class="badge">Inside the Wharenui (meeting house)</div>
      <h1>Which <em>two</em> behaviours are correct?</h1>

      <div class="options-grid">
        {#each options as opt}
          <button
            class="option"
            class:selected={selected.has(opt.id)}
            class:correct={checked && selected.has(opt.id) && opt.correct}
            class:wrong={checked && selected.has(opt.id) && !opt.correct}
            class:shake={shaking === opt.id}
            onclick={() => toggle(opt)}
            disabled={completed}
            aria-pressed={selected.has(opt.id)}
          >
            <span class="opt-icon">{opt.label.split(' ')[0]}</span>
            <span class="opt-text">{opt.label.substring(opt.label.indexOf(' ')+1)}</span>
            {#if selected.has(opt.id)}
              <span class="tick" aria-hidden="true">{checked && opt.correct ? '✓' : checked && !opt.correct ? '✗' : '●'}</span>
            {/if}
          </button>
        {/each}
      </div>

      <p class="select-hint">Select 2 ({selected.size}/2)</p>

      <!-- Wrong answer hints -->
      {#if checked && !completed}
        {#each [...selected] as id}
          {@const opt = options.find(o => o.id === id && !o.correct)}
          {#if opt}
            <div class="hint-box fade-in">
              <img src={kiwiTry} alt="Kiwi try again" class="hint-kiwi" />
              <p>{opt.hint}</p>
            </div>
          {/if}
        {/each}
      {/if}

      <!-- Success -->
      {#if completed}
        <div class="success-box fade-in">
          <span class="station-complete">Station 3 complete! ✓</span>
          <p>Ka pai! Shoes off and quiet voices — great tikanga!</p>
        </div>
      {/if}

      <!-- Check answers button -->
      {#if !completed}
        <button
          class="pill check-btn"
          onclick={checkAnswers}
          disabled={!canCheck}
        >
          Check answers
        </button>
      {/if}
    </div>

    <button class="help-btn" onclick={() => speak('Remember: always remove your shoes and speak quietly inside the wharenui. The carvings are tapu — sacred — so never touch or photograph them without asking.')} aria-label="Need help?">
      <img src={needHelp} alt="Need help?" />
    </button>
  </div>

  <nav class="bottom-nav">
    <button class="pill btn-back-bottom" onclick={onBack}>← Back</button>
    <button class="pill btn-next" onclick={handleNext} disabled={!completed}>Next →</button>
  </nav>
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
    padding: 80px 16px 120px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .station-pill {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    font-size: 15px;
    padding: 8px 24px;
    border-radius: 100px;
    box-shadow: 0 4px 12px rgba(245,166,35,.4);
    white-space: nowrap;
  }

  .btn-back {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 50;
  }

  .content {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .kiwi-img {
    width: min(110px, 18vw);
    height: auto;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.3));
  }

  .card {
    width: 100%;
    background: rgba(255,255,255,.96);
    border-radius: 24px;
    padding: 28px 24px 22px;
    box-shadow: 0 12px 40px rgba(0,0,0,.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    box-sizing: border-box;
  }

  .badge {
    background: #8B4513;
    color: #fff;
    font-weight: 800;
    font-size: 14px;
    padding: 7px 22px;
    border-radius: 100px;
    box-shadow: 0 3px 10px rgba(0,0,0,.25);
  }

  h1 {
    font-size: clamp(22px, 3.2vw, 34px);
    font-weight: 900;
    color: #111;
    text-align: center;
    margin: 0;
    line-height: 1.3;
  }
  h1 em { font-style: normal; color: #c0392b; }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
  }

  .option {
    position: relative;
    border: 3px solid #ddd;
    border-radius: 16px;
    padding: 18px 14px 14px;
    font-family: inherit;
    cursor: pointer;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-height: 120px;
    justify-content: center;
    transition: transform .15s, border-color .2s, background .2s;
    outline: none;
  }
  .option:hover:not(:disabled) { transform: translateY(-3px); border-color: #aaa; }
  .option:disabled { cursor: not-allowed; opacity: .6; }
  .option.selected { border-color: #2255cc; background: #f0f4ff; }
  .option.correct  { border-color: #4caf50 !important; background: #f0fff4 !important; }
  .option.wrong    { border-color: #e53935 !important; background: #fff0f0 !important; }

  .opt-icon { font-size: 36px; }
  .opt-text { font-size: clamp(13px, 1.8vw, 16px); font-weight: 700; color: #222; text-align: center; line-height: 1.3; }

  .tick {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 18px;
    font-weight: 900;
    color: #2255cc;
  }
  .option.correct .tick { color: #4caf50; }
  .option.wrong   .tick { color: #e53935; }

  .select-hint { margin: 0; font-size: 15px; font-weight: 700; color: #555; }

  .hint-box {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff8ec;
    border: 2px solid #F5A623;
    border-radius: 14px;
    padding: 12px 16px;
    width: 100%;
    box-sizing: border-box;
  }
  .hint-kiwi { width: 50px; height: 50px; object-fit: contain; flex-shrink: 0; }
  .hint-box p { margin: 0; font-size: 15px; font-weight: 600; color: #5a3a00; line-height: 1.4; }

  .success-box {
    background: #f0fff4;
    border: 2.5px solid #4caf50;
    border-radius: 14px;
    padding: 14px 18px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
  .station-complete { display: block; font-size: 18px; font-weight: 900; color: #2e7d32; margin-bottom: 4px; }
  .success-box p { margin: 0; font-size: 15px; color: #2c5e32; font-weight: 600; }

  .check-btn {
    background: #2255cc;
    color: #fff;
    font-weight: 800;
  }
  .check-btn:disabled {
    background: #d0d0d0;
    color: #888;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .help-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform .15s;
  }
  .help-btn:hover { transform: scale(1.05); }
  .help-btn img { width: min(90px, 14vw); height: auto; }

  .bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 30;
    padding: 10px 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

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

  .btn-back, .btn-back-bottom { background: #fff; color: #333; }

  .btn-next {
    background: #F5A623;
    color: #2c1600;
    font-weight: 800;
    animation: breathe 2s ease-in-out infinite;
  }
  .btn-next:disabled {
    background: #d0d0d0;
    color: #888;
    animation: none;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  @keyframes breathe {
    0%,100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(245,166,35,.35); }
    50%      { transform: scale(1.05); box-shadow: 0 8px 24px rgba(245,166,35,.6);  }
  }
  .rtm-nav { position: fixed; bottom: 18px; left: 18px; z-index: 50; }
</style>
