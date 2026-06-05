<script lang="ts">
  // Story 2 (Step 3) — tap glowing points scattered across the full-screen
  // illustration. Used to "awaken the sparks of Te Kore" and to "hang the stars
  // on Ranginui". Each tap lights a spot with a little burst; once enough are
  // lit the scene is solved and Kiki cheers. Controlled, tap-only, no typing.
  import type { Interaction } from '../stories'
  import { narrate } from '../../../lib/settings.svelte'
  import KiwiGuide from './KiwiGuide.svelte'

  interface Props {
    interaction: Extract<Interaction, { kind: 'hotspots' }>
    solved: boolean
    onSolved: () => void
  }
  let { interaction, solved, onSolved }: Props = $props()

  const need = $derived(interaction.need ?? interaction.spots.length)
  let lit = $state<Record<string, boolean>>({})
  const litCount = $derived(Object.values(lit).filter(Boolean).length)

  function tap(id: string) {
    if (solved || lit[id]) return
    lit = { ...lit, [id]: true }
    if (litCount + 1 >= need) {
      onSolved() // advance FIRST — never gate progression on speech
      narrate(interaction.cheer)
    }
  }
</script>

<!-- Tappable glowing points over the art -->
<div class="spots-layer" aria-hidden={solved}>
  {#each interaction.spots as spot (spot.id)}
    <button
      class="spot"
      class:lit={solved || lit[spot.id]}
      style:left="{spot.x}%"
      style:top="{spot.y}%"
      onclick={() => tap(spot.id)}
      disabled={solved || lit[spot.id]}
      aria-label="Tap the light"
    >
      <span class="glow"></span>
      <span class="mark">{spot.emoji}</span>
    </button>
  {/each}
</div>

<!-- Prompt / cheer from Kiki, floating top-right (out of the way of the art) -->
<div class="spots-kiki">
  {#if solved}
    <KiwiGuide pose="yes" text={interaction.cheer} size="sm" flip dark fit />
  {:else}
    <KiwiGuide pose="think" text={interaction.prompt} size="sm" flip dark fit />
  {/if}
</div>

<style>
  .spots-layer {
    position: fixed;
    inset: 0;
    z-index: 3;
    pointer-events: none;
  }
  .spot {
    position: absolute;
    transform: translate(-50%, -50%);
    width: clamp(44px, 7vw, 68px);
    height: clamp(44px, 7vw, 68px);
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    pointer-events: auto;
    display: grid;
    place-items: center;
    outline: none;
  }
  .spot .glow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 247, 214, 0.85), rgba(255, 213, 110, 0.3) 55%, transparent 72%);
    animation: twinkle 1.8s ease-in-out infinite;
  }
  .spot .mark {
    position: relative;
    font-size: clamp(28px, 4.4vw, 46px);
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter: drop-shadow(0 0 6px rgba(255, 245, 200, 0.95));
  }
  .spot:hover:not(:disabled) { transform: translate(-50%, -50%) scale(1.12); }
  .spot:focus-visible { outline: 3px solid #fff; outline-offset: 3px; border-radius: 50%; }
  .spot.lit .glow {
    animation: burst 0.5s ease both, twinkle 1.8s ease-in-out 0.5s infinite;
  }
  /* Clicked star pops bigger and glows brightly so it clearly reads as "lit". */
  .spot.lit .mark {
    opacity: 1;
    transform: scale(1.4);
    filter: drop-shadow(0 0 8px rgba(255, 250, 225, 1))
      drop-shadow(0 0 18px rgba(255, 212, 120, 0.9))
      drop-shadow(0 0 32px rgba(255, 200, 100, 0.55));
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.5; transform: scale(0.92); }
    50% { opacity: 1; transform: scale(1.08); }
  }
  @keyframes burst {
    0% { transform: scale(0.6); opacity: 0.6; }
    50% { transform: scale(1.5); opacity: 1; }
    100% { transform: scale(1); opacity: 0.85; }
  }

  .spots-kiki {
    position: fixed;
    top: 24px;
    right: 12px;
    left: auto;
    transform: none;
    z-index: 5;
    max-width: 52vw;
    animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }

  @media (prefers-reduced-motion: reduce) {
    .spot .glow, .spot.lit .glow, .spots-kiki { animation: none !important; }
  }
</style>
