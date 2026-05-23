<script lang="ts">
  // Author: Shirley
  // The kiwi avatar that roams the map. Position, facing and walk timing are
  // driven by the parent so it can be steered by taps or the arrow keys.

  import type { Pt } from '../locations'
  import { kiwiImg } from '../assets'

  let {
    pos,
    facing = 1, // 1 = facing right, -1 = facing left
    walking = false,
    walkDur = 1.2, // seconds for the current walk (parent scales with distance)
  }: {
    pos: Pt
    facing?: number
    walking?: boolean
    walkDur?: number
  } = $props()
</script>

<div
  class="kiwi"
  style="left:{pos.x}%; top:{pos.y}%; transition: left {walkDur}s cubic-bezier(.45,.05,.35,1), top {walkDur}s cubic-bezier(.45,.05,.35,1)"
>
  <span class="shadow" class:walking></span>
  <div class="flip" style="transform: scaleX({facing})">
    <div class="bob" class:walking>
      <img src={kiwiImg} alt="Kiwi" draggable="false" />
    </div>
  </div>
</div>

<style>
  .kiwi {
    position: absolute;
    width: 6.2%;
    transform: translate(-50%, -86%);
    z-index: 20;
    pointer-events: none;
    will-change: left, top;
  }
  .kiwi img {
    width: 100%;
    display: block;
    -webkit-user-drag: none;
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.4));
  }
  .kiwi .shadow {
    position: absolute;
    left: 50%;
    bottom: -6%;
    width: 78%;
    aspect-ratio: 3 / 1;
    transform: translateX(-50%);
    background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.4), transparent 72%);
    z-index: -1;
  }
  .kiwi .shadow.walking {
    animation: shadowPulse 0.36s ease-in-out infinite;
  }
  .bob {
    transform-origin: 50% 100%;
    animation: breathe 3.2s ease-in-out infinite;
  }
  .bob.walking {
    animation: bob 0.36s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-13%) rotate(-4deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-13%) rotate(4deg); }
  }
  @keyframes breathe {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-2.5%) scale(1.015); }
  }
  @keyframes shadowPulse {
    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.85; }
    50% { transform: translateX(-50%) scale(0.78); opacity: 0.6; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bob,
    .bob.walking,
    .shadow.walking {
      animation: none !important;
    }
  }
</style>