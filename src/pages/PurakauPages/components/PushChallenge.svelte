<script lang="ts">
  // Story 2 climax (Step 3) — push the Sky away from the Earth. The child taps
  // the big centre button over and over; with every push a soft, feathered glow
  // of daylight grows across the scene. The moment earth and sky break open it
  // flares once and clears, leaving the illustration sharp and bright (Te Ao
  // Mārama). Mirrors Story 1's tap-to-pull mechanic with its own light effect.
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
  const progress = $derived(Math.min(presses / interaction.target, 1))
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

<!-- Soft daylight that grows with each push; feathered (no hard edge) and
     fades fully clear once solved so the illustration stays sharp. -->
<div class="push-glow" style:opacity={solved ? 0 : progress} aria-hidden="true"></div>
{#if solved}
  <div class="push-flash" aria-hidden="true"></div>
{/if}

<div class="push-area">
  <div class="push-kiki">
    {#if solved}
      <KiwiGuide pose="yes" text={interaction.cheer} size="sm" dark />
    {:else}
      <KiwiGuide pose="go" text={interaction.prompt} size="sm" dark />
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
  /* Growing daylight — soft, fully feathered to transparent so there is no
     visible band edge; fades out (opacity → 0) the instant the scene is solved. */
  .push-glow {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(
      62% 58% at 50% 50%,
      rgba(255, 247, 214, 0.6),
      rgba(255, 214, 120, 0.22) 45%,
      transparent 72%
    );
    transition: opacity 0.55s ease;
  }
  /* One celebratory flare on success that resolves to fully transparent. */
  .push-flash {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(46% 46% at 50% 50%, rgba(255, 255, 245, 0.7), transparent 72%);
    animation: pushFlash 0.9s ease forwards;
  }
  @keyframes pushFlash {
    0% { opacity: 0; transform: scale(0.6); }
    35% { opacity: 1; }
    100% { opacity: 0; transform: scale(1.5); }
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
    top: 11vh;
    max-width: 52vw;
    pointer-events: auto;
    animation: popIn 0.4s 0.05s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .push-control {
    position: absolute;
    left: 50%;
    top: 52%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
    animation: bounceInC 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
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
  @keyframes bounceInC {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
    60% { transform: translate(-50%, -50%) scale(1.06); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .push-glow, .push-flash, .push-btn, .push-kiki, .push-control { animation: none !important; }
  }
</style>
