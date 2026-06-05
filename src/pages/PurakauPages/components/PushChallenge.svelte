<script lang="ts">
  // Story 2 climax (Step 3) — push the Sky away from the Earth. The child taps
  // the big button over and over; with every push a beam of light grows
  // brighter and wider across the middle of the scene, until earth and sky
  // break open and the world fills with light (Te Ao Mārama). Mirrors Story 1's
  // tap-to-pull mechanic, but with its own light-reveal effect and layout.
  import type { Interaction } from '../stories'
  import { narrate } from '../../../lib/settings.svelte'
  import KiwiGuide from './KiwiGuide.svelte'

  interface Props {
    interaction: Extract<Interaction, { kind: 'push' }>
    solved: boolean
    onSolved: () => void
  }
  let { interaction, solved, onSolved }: Props = $props()

  let presses = $state(0)
  const progress = $derived(solved ? 1 : Math.min(presses / interaction.target, 1))
  const pips = $derived(Array.from({ length: interaction.target }, (_, i) => i))

  function push() {
    if (solved) return
    presses += 1
    if (presses >= interaction.target) {
      onSolved() // advance FIRST — progression is never gated by speech
      narrate(interaction.cheer)
    }
  }
</script>

<!-- Light beam that grows with each push; sits over the art, under the UI. -->
<div
  class="light-band"
  class:open={solved}
  style:--p={progress}
  aria-hidden="true"
></div>
{#if solved}
  <div class="sun-burst" aria-hidden="true"></div>
{/if}

<div class="push-area">
  <div class="push-kiki">
    {#if solved}
      <KiwiGuide pose="yes" text={interaction.cheer} size="sm" />
    {:else}
      <KiwiGuide pose="go" text={interaction.prompt} size="sm" />
    {/if}
  </div>

  {#if !solved}
    <div class="push-control">
      <button
        class="push-btn"
        class:bump={presses > 0}
        onclick={push}
        aria-label={`Push the sky. ${presses} of ${interaction.target} pushes.`}
      >
        <span class="icon">{interaction.icon}</span>
        <span class="label">{interaction.label}</span>
      </button>
      <div class="meter" aria-hidden="true">
        {#each pips as i}
          <span class="pip" class:on={i < presses}></span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Growing band of daylight between earth and sky. --p is 0→1. */
  .light-band {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: calc(8% + var(--p) * 70%);
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(
      120% 100% at 50% 50%,
      rgba(255, 247, 214, calc(0.15 + var(--p) * 0.7)),
      rgba(255, 213, 110, calc(var(--p) * 0.45)) 45%,
      transparent 75%
    );
    mix-blend-mode: screen;
    transition: height 0.18s ease, opacity 0.4s ease;
  }
  .light-band.open {
    animation: dawn 0.9s ease both;
  }
  @keyframes dawn {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.9; }
  }
  .sun-burst {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(40% 40% at 50% 50%, rgba(255, 255, 240, 0.55), transparent 70%);
    animation: flash 1s ease both;
  }
  @keyframes flash {
    0% { opacity: 0; transform: scale(0.6); }
    40% { opacity: 1; }
    100% { opacity: 0; transform: scale(1.3); }
  }

  .push-area {
    position: fixed;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }
  .push-kiki {
    position: absolute;
    left: 8px;
    top: 4vh;
    max-width: 56vw;
    pointer-events: auto;
    animation: popIn 0.4s 0.05s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .push-control {
    position: absolute;
    right: 8vw;
    top: 46%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
    animation: bounceIn 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .push-btn {
    border: none;
    background: radial-gradient(circle at 50% 32%, #fff3d6, #f3a93a);
    width: clamp(96px, 15vh, 132px);
    height: clamp(96px, 15vh, 132px);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
    transition: transform 0.08s ease;
    animation: pulse 2.2s 0.8s ease-in-out infinite;
  }
  .push-btn:hover { transform: scale(1.04); }
  .push-btn:active { transform: scale(0.9); }
  .push-btn.bump { animation: bump 0.16s ease; }
  .push-btn:focus-visible { outline: 4px solid #fff; outline-offset: 3px; }
  .icon { font-size: clamp(34px, 7vh, 50px); line-height: 1; }
  .label {
    font-family: 'Fredoka', system-ui, sans-serif;
    font-weight: 900;
    color: #7a4a00;
    font-size: clamp(14px, 2.2vh, 18px);
    letter-spacing: 0.5px;
  }

  .meter { display: flex; gap: 6px; max-width: 220px; flex-wrap: wrap; justify-content: center; }
  .pip {
    width: 18px;
    height: 10px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12);
    transition: background 0.2s;
  }
  .pip.on { background: #ffd24a; }

  @keyframes bump { 0% { transform: scale(1); } 50% { transform: translateY(-5px) scale(1.06); } 100% { transform: scale(1); } }
  @keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35); }
    50% { transform: scale(1.05); box-shadow: 0 14px 34px rgba(255, 213, 110, 0.6); }
  }
  @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
  @keyframes bounceIn {
    0% { opacity: 0; transform: translateY(-50%) scale(0.3); }
    60% { transform: translateY(-50%) scale(1.06); }
    100% { opacity: 1; transform: translateY(-50%) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .light-band, .sun-burst, .push-btn, .push-kiki, .push-control { animation: none !important; }
  }
</style>
