<script lang="ts">
  // Story 2 (Step 3) — an inline story decision. The child taps one of a few
  // fixed choices (no typing). A wrong tap is never punished: the card shakes
  // and Kiki gives a patient, choice-specific hint, then the child tries again.
  // A right tap cheers and unlocks Next. Mirrors the quiz model, but woven into
  // the scene so the child feels they steer the story. Kiki sits top-right and
  // the choices are compact frosted cards so the dark illustration stays visible.
  import type { Interaction } from '../stories'
  import { narrate } from '../../../lib/settings.svelte'
  import KiwiGuide from './KiwiGuide.svelte'

  interface Props {
    interaction: Extract<Interaction, { kind: 'choice' }>
    solved: boolean
    onSolved: () => void
  }
  let { interaction, solved, onSolved }: Props = $props()

  let pickedId = $state<string | null>(null)
  let shakeId = $state<string | null>(null)
  let hint = $state('')

  function pick(id: string) {
    if (solved) return
    const opt = interaction.options.find((o) => o.id === id)
    if (!opt) return
    pickedId = id
    if (opt.correct) {
      hint = ''
      onSolved() // advance FIRST — progression is never gated by speech
      narrate(interaction.cheer)
    } else {
      hint = opt.hint
      shakeId = id
      setTimeout(() => (shakeId = null), 600)
      narrate(`Let's think again. ${opt.hint}`)
    }
  }
</script>

<!-- Kiki prompt / feedback, top-right -->
<div class="choice-kiki">
  {#if solved}
    <KiwiGuide pose="yes" text={interaction.cheer} size="sm" flip dark fit />
  {:else if hint}
    <KiwiGuide pose="tryagain" text={`Let's think again. ${hint}`} size="sm" flip dark fit />
  {:else}
    <KiwiGuide pose="think" text={interaction.prompt} size="sm" flip dark fit />
  {/if}
</div>

<!-- Compact choice cards, centred over the scene -->
<div class="choice-options" role="group" aria-label={interaction.prompt}>
  {#each interaction.options as opt (opt.id)}
    <button
      class="option"
      class:correct={solved && opt.correct}
      class:wrong={!solved && pickedId === opt.id && !opt.correct}
      class:shake={shakeId === opt.id}
      class:dim={solved && !opt.correct}
      onclick={() => pick(opt.id)}
      disabled={solved}
      aria-pressed={pickedId === opt.id}
    >
      <span class="emoji">{opt.emoji}</span>
      <span class="text">{opt.text}</span>
    </button>
  {/each}
</div>

<style>
  .choice-kiki {
    position: fixed;
    top: 24px;
    right: 12px;
    z-index: 5;
    max-width: 52vw;
    animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .choice-options {
    position: fixed;
    left: 50%;
    top: 52%;
    transform: translate(-50%, -50%);
    z-index: 4;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    width: min(92vw, 720px);
    animation: rise 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .option {
    flex: 0 1 auto;
    width: clamp(120px, 20vw, 170px);
    border: 2.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    padding: 12px 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    background: rgba(18, 22, 38, 0.58);
    backdrop-filter: blur(10px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s ease,
      background 0.2s ease, opacity 0.25s ease;
    font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
    outline: none;
  }
  .option:hover:not(:disabled) {
    transform: translateY(-4px);
    background: rgba(30, 36, 58, 0.72);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
  }
  .option:focus-visible { outline: 3px solid #ffd24a; outline-offset: 2px; }
  .option:disabled { cursor: default; }
  /* Correct = sun-gold highlight, kept bright and crisp (dark text on gold). */
  .option.correct {
    border-color: #f5a623;
    background: linear-gradient(180deg, rgba(255, 222, 120, 0.96), rgba(245, 176, 40, 0.96));
    box-shadow: 0 8px 26px rgba(245, 176, 40, 0.6);
    opacity: 1;
  }
  .option.correct .text { color: #3a2400; text-shadow: none; }
  .option.correct .emoji { filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)); }
  .option.wrong {
    border-color: #f5a623;
    background: rgba(96, 64, 16, 0.7);
    box-shadow: 0 8px 22px rgba(245, 166, 35, 0.4);
  }
  .option.dim { opacity: 0.4; }
  .option.shake { animation: shake 0.5s ease; }

  .emoji {
    font-size: clamp(26px, 4vh, 38px);
    line-height: 1;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
  }
  .text {
    font-size: clamp(13px, 1.5vw, 16px);
    font-weight: 800;
    color: #fff;
    text-align: center;
    line-height: 1.2;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  }

  @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  @keyframes rise { from { opacity: 0; transform: translate(-50%, -42%); } to { opacity: 1; transform: translate(-50%, -50%); } }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-7px); }
    40% { transform: translateX(7px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .choice-kiki, .choice-options, .option.shake { animation: none !important; }
  }
</style>
