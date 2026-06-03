<script lang="ts">
  // Step 3 prop challenge: the child hands Māui the right taonga by picking one
  // of five (no typing — controlled choices only). A correct pick cheers and
  // unlocks Next; a wrong pick shakes and shows a patient, choice-specific hint
  // from the controlled hint engine, with unlimited gentle retries.
  import { onMount } from 'svelte'
  import { PROPS, type Prop, type Interaction } from '../stories'
  import { getHint } from '../hint-engine'
  import { speak } from '../../../lib/settings.svelte'
  import { woodenTray } from '../assets'
  import KiwiGuide from './KiwiGuide.svelte'

  interface Props {
    // Narrowed to the 'prop' interaction by the caller.
    interaction: Extract<Interaction, { kind: 'prop' }>
    onCorrect: () => void
  }
  let { interaction, onCorrect }: Props = $props()

  // Shuffle once so the answer isn't always in the same place, but stays put
  // across re-renders within this attempt.
  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  const order = $state<Prop[]>(shuffle(PROPS))

  let solved = $state(false)
  let wrongId = $state<string | null>(null)
  let shakeId = $state<string | null>(null)

  const hint = $derived(
    wrongId ? getHint(interaction.correctId, wrongId as Prop['id']) : '',
  )

  function pick(p: Prop) {
    if (solved) return
    if (p.id === interaction.correctId) {
      solved = true
      wrongId = null
      speak(interaction.cheer)
      onCorrect()
    } else {
      wrongId = p.id
      shakeId = p.id
      // hint speaks via the $effect below (after `hint` recomputes)
      setTimeout(() => (shakeId = null), 600)
    }
  }

  // Voice the prompt + clue once when the challenge appears.
  onMount(() => speak(`${interaction.prompt} ${interaction.clue}`))

  // Voice the current hint whenever it changes (Kiki's controlled AI hint).
  $effect(() => {
    if (hint && !solved) speak(hint)
  })
</script>

<div class="picker">
  <!-- Prompt + clue / feedback from Kiki -->
  {#if solved}
    <KiwiGuide pose="yes" text={interaction.cheer} />
  {:else if wrongId}
    <KiwiGuide pose="tryagain" text={hint} />
  {:else}
    <KiwiGuide pose="think" text={`${interaction.prompt} ${interaction.clue}`} />
  {/if}

  <!-- The tray of five taonga -->
  <div class="tray" role="group" aria-label={interaction.prompt}>
    {#each order as p (p.id)}
      <button
        class="slot"
        class:correct={solved && p.id === interaction.correctId}
        class:wrong={wrongId === p.id && !solved}
        class:shake={shakeId === p.id}
        class:dim={solved && p.id !== interaction.correctId}
        style:background-image="url({woodenTray})"
        onclick={() => pick(p)}
        disabled={solved}
        aria-label={`${p.name} — ${p.en}`}
        aria-pressed={wrongId === p.id}
      >
        <img class="prop" src={p.img} alt="" draggable="false" />
        <span class="name">{p.name}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .picker {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
  }

  .tray {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    width: 100%;
  }
  @media (max-width: 720px) {
    .tray { grid-template-columns: repeat(3, 1fr); }
  }

  .slot {
    position: relative;
    border: none;
    background-color: transparent;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border-radius: 18px;
    padding: 14px 8px 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    aspect-ratio: 1 / 1.05;
    transition: transform 0.15s ease, filter 0.2s ease;
    outline: none;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.22));
  }
  .slot:hover:not(:disabled) { transform: translateY(-5px) scale(1.03); }
  .slot:focus-visible { outline: 3px solid #aa3bff; outline-offset: 3px; }
  .slot:disabled { cursor: default; }

  .prop {
    height: 64%;
    width: auto;
    max-width: 80%;
    object-fit: contain;
    filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.3));
  }

  .name {
    font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: clamp(12px, 1.5vw, 17px);
    color: #3a2410;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  }

  .slot.correct {
    filter: drop-shadow(0 0 16px rgba(76, 175, 80, 0.9));
    animation: pop-correct 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .slot.wrong { filter: drop-shadow(0 0 12px rgba(245, 166, 35, 0.85)); }
  .slot.dim { opacity: 0.42; filter: grayscale(0.5); }

  @keyframes pop-correct {
    0% { transform: scale(1); }
    50% { transform: scale(1.14); }
    100% { transform: scale(1.05); }
  }
  @media (prefers-reduced-motion: reduce) {
    .slot.correct { animation: none; }
  }
</style>
