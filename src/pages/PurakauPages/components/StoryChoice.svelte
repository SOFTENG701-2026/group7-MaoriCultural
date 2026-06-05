<script lang="ts">
  // Story 2 (Step 3) — an inline story decision. The child taps one of a few
  // fixed choices (no typing). A wrong tap is never punished: the card shakes
  // and Kiki gives a patient, choice-specific hint, then the child tries again.
  // A right tap cheers and unlocks Next. Mirrors the quiz model, but woven into
  // the scene so the child feels they steer the story.
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

  const picked = $derived(interaction.options.find((o) => o.id === pickedId) ?? null)

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

<div class="choice">
  {#if solved}
    <KiwiGuide pose="yes" text={interaction.cheer} size="sm" />
  {:else if hint}
    <KiwiGuide pose="tryagain" text={`Let's think again. ${hint}`} size="sm" />
  {:else}
    <KiwiGuide pose="think" text={interaction.prompt} size="sm" />
  {/if}

  <div class="options" role="group" aria-label={interaction.prompt}>
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
</div>

<style>
  .choice {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: center;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
  }
  @media (max-width: 640px) {
    .options { grid-template-columns: 1fr; }
  }

  .option {
    border: 3px solid transparent;
    border-radius: 18px;
    padding: 14px 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-height: clamp(96px, 16vh, 130px);
    justify-content: center;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s ease, opacity 0.25s ease;
    font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
    outline: none;
  }
  .option:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28); }
  .option:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }
  .option:disabled { cursor: default; }
  .option.correct { border-color: #4caf50; background: #f0fff4; box-shadow: 0 6px 20px rgba(76, 175, 80, 0.35); }
  .option.wrong { border-color: #f5a623; background: #fffbf0; box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4); }
  .option.dim { opacity: 0.45; }
  .option.shake { animation: shake 0.5s ease; }

  .emoji { font-size: clamp(30px, 5vh, 46px); line-height: 1; }
  .text {
    font-size: clamp(14px, 1.7vw, 18px);
    font-weight: 800;
    color: #2c1a08;
    text-align: center;
    line-height: 1.2;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-7px); }
    40% { transform: translateX(7px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .option.shake { animation: none; }
  }
</style>
