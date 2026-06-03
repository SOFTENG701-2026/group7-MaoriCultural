<script lang="ts">
  // A single storybook illustration, built as a layered diorama so we have full
  // control over the black-and-white → colour reveal (Steps 1 & 6). The painted
  // beach backdrop is re-graded per scene (night, day, storm, sunrise) and a few
  // focal taonga / emoji tell the moment. Sizes use container-query units so the
  // exact same art scales from a full scene down to a small sequencing card.
  import { beachScene, propMatau, heiMatau } from '../assets'
  import type { SceneArtKey } from '../stories'

  interface Props {
    art: SceneArtKey
    colored?: boolean // false → desaturated (locked / not-yet-finished)
    animate?: boolean // gentle floating motion on focal objects
  }
  let { art, colored = true, animate = true }: Props = $props()
</script>

<div class="scene grade-{art}" class:bw={!colored} class:still={!animate}>
  <div class="backdrop" style:background-image="url({beachScene})"></div>
  <div class="grade" aria-hidden="true"></div>

  {#if art === 'cover'}
    <span class="sun">☀️</span>
    <span class="island big">🏝️</span>
    <img class="hook front" src={heiMatau} alt="" />
    <span class="spark s1">✨</span>
    <span class="spark s2">✨</span>
  {:else if art === 'hide'}
    <span class="moon">🌙</span>
    <span class="star a">⭐</span>
    <span class="star b">⭐</span>
    <span class="star c">⭐</span>
    <span class="waka">🛶</span>
    <span class="say">Shhh…</span>
  {:else if art === 'hook'}
    <span class="sun">☀️</span>
    <span class="waka small">🛶</span>
    <img class="hook held" src={propMatau} alt="" />
    <span class="spark s1">✨</span>
  {:else if art === 'pull'}
    <span class="cloud">☁️</span>
    <span class="waka tilt">🛶</span>
    <div class="line" aria-hidden="true"></div>
    <span class="splash">💦</span>
    <span class="fish deep">🐟</span>
  {:else if art === 'island'}
    <span class="sun rise">☀️</span>
    <span class="rays" aria-hidden="true"></span>
    <span class="fish huge">🐟</span>
    <span class="island rising">🏝️</span>
    <span class="spark s1">✨</span>
    <span class="spark s2">✨</span>
  {/if}
</div>

<style>
  .scene {
    container-type: size;
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border-radius: 8px;
    background: #bfe3f0;
    isolation: isolate;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: filter 1.1s ease;
  }

  /* Colour grade overlay — turns one beach into many moods. */
  .grade {
    position: absolute;
    inset: 0;
    mix-blend-mode: multiply;
    transition: opacity 1.1s ease, background 1.1s ease;
  }
  .grade-hide .grade {
    background: linear-gradient(180deg, #1a2a6c 0%, #20306e 55%, #3a3f7a 100%);
    opacity: 0.72;
  }
  .grade-hook .grade {
    background: linear-gradient(180deg, #fff4d0 0%, #ffe6a8 100%);
    opacity: 0.18;
  }
  .grade-pull .grade {
    background: linear-gradient(180deg, #4a6b86 0%, #2f4a63 100%);
    opacity: 0.4;
  }
  .grade-island .grade,
  .grade-cover .grade {
    background: linear-gradient(180deg, #ffd27a 0%, #ff9e5e 70%, #ff7e6b 100%);
    opacity: 0.28;
  }

  /* Black-and-white (locked / unfinished) state for the reveal. */
  .scene.bw .backdrop {
    filter: grayscale(1) contrast(0.92) brightness(1.02);
  }
  .scene.bw .grade {
    opacity: 0;
  }
  .scene.bw .hook,
  .scene.bw .fish,
  .scene.bw .island,
  .scene.bw .waka,
  .scene.bw .sun,
  .scene.bw .moon,
  .scene.bw .star,
  .scene.bw .cloud,
  .scene.bw .splash,
  .scene.bw .spark {
    filter: grayscale(1) brightness(0.96);
    transition: filter 1.1s ease;
  }

  /* ── Focal elements (sized in container-query units so they scale) ── */
  span,
  .hook {
    position: absolute;
    line-height: 1;
    filter: drop-shadow(0 2cqmin 2cqmin rgba(0, 0, 0, 0.35));
  }
  .hook {
    height: 26cqmin;
    width: auto;
  }

  .sun { top: 7%; right: 9%; font-size: 17cqmin; }
  .sun.rise { top: 9%; right: 50%; transform: translateX(50%); }
  .moon { top: 9%; left: 11%; font-size: 14cqmin; }
  .cloud { top: 11%; left: 14%; font-size: 16cqmin; }

  .star { font-size: 6cqmin; }
  .star.a { top: 14%; left: 40%; }
  .star.b { top: 22%; left: 66%; }
  .star.c { top: 9%; left: 78%; }

  .waka { bottom: 16%; left: 50%; transform: translateX(-50%); font-size: 26cqmin; }
  .waka.small { bottom: 20%; font-size: 20cqmin; }
  .waka.tilt { transform: translateX(-50%) rotate(-12deg); bottom: 20%; }

  .hook.front { bottom: 10%; left: 50%; transform: translateX(-50%); height: 40cqmin; }
  .hook.held { bottom: 38%; left: 50%; transform: translateX(-50%); height: 30cqmin; animation: hold 2.4s ease-in-out infinite; }

  .island { font-size: 30cqmin; }
  .island.big { bottom: 12%; left: 26%; }
  .island.rising { bottom: 14%; left: 50%; transform: translateX(-50%); font-size: 34cqmin; animation: rise 3s ease-in-out infinite; }

  .fish { font-size: 18cqmin; }
  .fish.deep { bottom: 6%; left: 46%; opacity: 0.7; font-size: 12cqmin; }
  .fish.huge { bottom: 40%; left: 50%; transform: translateX(-50%); font-size: 24cqmin; opacity: 0.85; }

  .line {
    position: absolute;
    left: 50%;
    bottom: 18%;
    width: 1.4cqmin;
    height: 30cqmin;
    background: linear-gradient(180deg, #6b4a2b, #caa472);
    transform: rotate(8deg);
    transform-origin: top center;
    border-radius: 2px;
  }

  .splash { bottom: 12%; left: 54%; font-size: 14cqmin; }

  .spark { font-size: 8cqmin; }
  .spark.s1 { top: 22%; left: 22%; }
  .spark.s2 { top: 30%; right: 18%; }

  .say {
    top: 12%;
    right: 12%;
    font-size: 9cqmin;
    font-family: 'Baloo 2', 'Nunito', sans-serif;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 1cqmin 2cqmin rgba(0, 0, 0, 0.6);
    filter: none;
  }

  .rays {
    top: 0;
    left: 50%;
    width: 120%;
    height: 70%;
    transform: translateX(-50%);
    background: radial-gradient(60% 80% at 50% 0%, rgba(255, 240, 190, 0.6), transparent 70%);
    filter: none;
  }

  /* ── Idle motion ── */
  .grade-hide .waka,
  .grade-hook .waka.small { animation: bob 3.4s ease-in-out infinite; }
  .grade-pull .waka.tilt { animation: rock 1.4s ease-in-out infinite; }
  .spark { animation: twinkle 2.2s ease-in-out infinite; }
  .spark.s2 { animation-delay: 0.7s; }
  .star { animation: twinkle 2.6s ease-in-out infinite; }
  .star.b { animation-delay: 0.5s; }
  .star.c { animation-delay: 1s; }

  @keyframes bob { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-3%); } }
  @keyframes rock { 0%, 100% { transform: translateX(-50%) rotate(-12deg); } 50% { transform: translateX(-50%) rotate(-4deg); } }
  @keyframes hold { 0%, 100% { transform: translateX(-50%) translateY(0) rotate(-4deg); } 50% { transform: translateX(-50%) translateY(-6%) rotate(4deg); } }
  @keyframes rise { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-5%); } }
  @keyframes twinkle { 0%, 100% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } }

  .scene.still :is(.waka, .spark, .star, .hook, .island) { animation: none !important; }

  @media (prefers-reduced-motion: reduce) {
    :is(.waka, .spark, .star, .hook, .island) { animation: none !important; }
  }
</style>
