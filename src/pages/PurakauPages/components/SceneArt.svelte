<script lang="ts">
  // A single storybook illustration, built as a layered diorama so we have full
  // control over the black-and-white → colour reveal (Steps 1 & 6). The painted
  // beach backdrop is re-graded per scene (night, day, storm, sunrise) and a few
  // focal taonga / emoji tell the moment. Sizes use container-query units so the
  // exact same art scales from a full scene down to a small sequencing card.
  import { beachScene, propMatau, propPatunihi, heiMatau } from '../assets'
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

  <!-- Story 2: Māui and the Sun -->
  {:else if art === 'sun-race'}
    <span class="sun race">☀️</span>
    <span class="streak s1" aria-hidden="true"></span>
    <span class="streak s2" aria-hidden="true"></span>
    <span class="streak s3" aria-hidden="true"></span>
    <span class="tiny-house h1">🏠</span>
    <span class="tiny-house h2">🏠</span>
    <span class="tiny-house h3">🏠</span>
    <span class="say fast">Wheee!</span>
  {:else if art === 'plait'}
    <span class="sun mild">☀️</span>
    <span class="flax f1">🌿</span>
    <span class="flax f2">🌿</span>
    <span class="flax f3">🌿</span>
    <span class="rope-icon">🪢</span>
    <span class="hands">🫳</span>
    <span class="spark s1">✨</span>
  {:else if art === 'snare'}
    <span class="sun caught">☀️</span>
    <div class="snare-net" aria-hidden="true"></div>
    <img class="patu held" src={propPatunihi} alt="" />
    <span class="spark s1">✨</span>
    <span class="spark s2">💥</span>
  {:else if art === 'long-day'}
    <span class="sun big-warm">☀️</span>
    <span class="rays wide" aria-hidden="true"></span>
    <span class="waka small">🛶</span>
    <span class="island tiny">🏝️</span>
    <span class="people play">🧒</span>
    <span class="spark s1">✨</span>
    <span class="spark s2">🌿</span>
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
  .grade-sun-race .grade {
    background: linear-gradient(180deg, #ffb347 0%, #ff8c42 60%, #e8764a 100%);
    opacity: 0.32;
  }
  .grade-plait .grade {
    background: linear-gradient(180deg, #d4e6b5 0%, #8db660 70%, #5c8540 100%);
    opacity: 0.3;
  }
  .grade-snare .grade {
    background: linear-gradient(180deg, #e8553d 0%, #d14b6a 50%, #4a3468 100%);
    opacity: 0.36;
  }
  .grade-long-day .grade {
    background: linear-gradient(180deg, #ffd27a 0%, #ffb347 50%, #9cd7e8 100%);
    opacity: 0.25;
  }

  /* Black-and-white (locked / unfinished) state for the reveal. */
  .scene.bw .backdrop {
    filter: grayscale(1) contrast(0.92) brightness(1.02);
  }
  .scene.bw .grade {
    opacity: 0;
  }
  .scene.bw .hook,
  .scene.bw .patu,
  .scene.bw .fish,
  .scene.bw .island,
  .scene.bw .waka,
  .scene.bw .sun,
  .scene.bw .moon,
  .scene.bw .star,
  .scene.bw .cloud,
  .scene.bw .splash,
  .scene.bw .spark,
  .scene.bw .streak,
  .scene.bw .tiny-house,
  .scene.bw .flax,
  .scene.bw .rope-icon,
  .scene.bw .hands,
  .scene.bw .snare-net,
  .scene.bw .people {
    filter: grayscale(1) brightness(0.96);
    transition: filter 1.1s ease;
  }

  /* ── Focal elements (sized in container-query units so they scale) ── */
  /*
     Background layout (from dense pixel sampling):
       Sky   (blue):  x 0-55%,  y  0-12%   ← top-left only
       Water (teal):  x 0-70%,  y  5-30%   ← wraps top + top-left
       Cloud (white): x 20-35%, y 15-25%   ← mid-left
       Sand  (beige): x 10-90%, y 35-90%   ← central foreground (dominant)
       Green (veg):   x 0-10% + x 60-95%, various y
       Houses in BG:  x 85-100%, y 0-15%   ← TOP-RIGHT → AVOID placenent here

     Rules:
       - Sky objects   → top-left:    left 5-40%,  top 1-7%
       - Water objects → upper-left:  left 5-50%,  top 8-22%
       - Foreground    → central sand: left 10-80%, bottom 5-30%
       - Never place anything at x>80%, y<20% (background houses)
  */
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

  /* ── Sky zone (top-left: x 5-45%, y 1-7%) ── */
  .sun { top: 3%; left: 18%; font-size: 17cqmin; }
  .sun.rise { top: 4%; left: 28%; }
  .sun.race { top: 3%; left: 6%; font-size: 20cqmin; animation: race 0.7s ease-in-out infinite; }
  .sun.caught { top: 3%; left: 28%; font-size: 18cqmin; animation: struggle 1.2s ease-in-out infinite; }
  .sun.big-warm { top: 2%; left: 22%; font-size: 20cqmin; animation: warmPulse 3s ease-in-out infinite; }
  .sun.mild { top: 4%; left: 24%; font-size: 15cqmin; }
  .moon { top: 3%; left: 12%; font-size: 13cqmin; }
  .cloud { top: 5%; left: 14%; font-size: 15cqmin; }

  .star { font-size: 5cqmin; }
  .star.a { top: 5%; left: 38%; }
  .star.b { top: 8%; left: 48%; }
  .star.c { top: 4%; left: 52%; }

  /* Speed streaks for racing sun — trail behind it across the sky */
  .streak {
    position: absolute;
    left: 0;
    height: 1.2cqmin;
    background: rgba(255, 240, 180, 0.7);
    border-radius: 4px;
  }
  .streak.s1 { top: 6%; width: 22cqmin; left: 24%; }
  .streak.s2 { top: 10%; width: 16cqmin; left: 28%; }
  .streak.s3 { top: 14%; width: 18cqmin; left: 22%; }

  /* ── Water / horizon zone (upper-left: x 5-55%, y 8-24%) ── */
  .waka { top: 14%; left: 30%; transform: translateX(-50%); font-size: 26cqmin; }
  .waka.small { top: 16%; left: 36%; font-size: 18cqmin; }
  .waka.tilt { top: 14%; left: 32%; transform: translateX(-50%) rotate(-12deg); }

  .island { font-size: 28cqmin; }
  .island.big { top: 14%; left: 40%; }
  .island.rising { top: 16%; left: 24%; font-size: 30cqmin; animation: rise 3s ease-in-out infinite; }
  .island.tiny { top: 16%; left: 46%; font-size: 14cqmin; }

  .fish { font-size: 16cqmin; }
  .fish.deep { top: 16%; left: 40%; opacity: 0.7; font-size: 11cqmin; }
  .fish.huge { top: 12%; left: 30%; font-size: 22cqmin; opacity: 0.85; }

  .splash { top: 12%; left: 50%; font-size: 12cqmin; }

  .line {
    position: absolute;
    left: 32%;
    top: 17%;
    width: 1.4cqmin;
    height: 22cqmin;
    background: linear-gradient(180deg, #6b4a2b, #caa472);
    transform: rotate(8deg);
    transform-origin: top center;
    border-radius: 2px;
  }

  .snare-net {
    position: absolute;
    top: 1%;
    left: 28%;
    width: 40cqmin;
    height: 36cqmin;
    border: 2cqmin dashed rgba(255, 220, 150, 0.7);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 200, 100, 0.15), transparent 65%);
    animation: tighten 1.6s ease-in-out infinite;
  }

  .rays {
    top: 0;
    left: 22%;
    width: 60%;
    height: 40%;
    background: radial-gradient(60% 80% at 50% 0%, rgba(255, 240, 190, 0.6), transparent 70%);
    filter: none;
  }
  .rays.wide {
    left: 18%;
    width: 70%;
    height: 42%;
    background: radial-gradient(70% 90% at 50% 0%, rgba(255, 240, 180, 0.55), transparent 70%);
    filter: none;
  }

  /* ── Foreground (central sand area: x 10-80%, bottom 5-30%) ── */
  .hook.front { bottom: 8%; left: 44%; transform: translateX(-50%); height: 36cqmin; }
  .hook.held { bottom: 24%; left: 42%; transform: translateX(-50%); height: 26cqmin; animation: hold 2.4s ease-in-out infinite; }

  .patu.held {
    bottom: 20%;
    left: 42%;
    transform: translateX(-50%);
    height: 20cqmin;
    width: auto;
    animation: tap 1.8s ease-in-out infinite;
  }

  /* Tiny houses sit on the sand foreground, well away from the real houses at top-right */
  .tiny-house {
    position: absolute;
    bottom: 10%;
    font-size: 9cqmin;
    filter: drop-shadow(0 1cqmin 2cqmin rgba(0, 0, 0, 0.3));
  }
  .tiny-house.h1 { left: 16%; }
  .tiny-house.h2 { left: 40%; }
  .tiny-house.h3 { left: 64%; }

  .flax {
    position: absolute;
    font-size: 16cqmin;
    filter: drop-shadow(0 1cqmin 3cqmin rgba(0, 0, 0, 0.3));
  }
  .flax.f1 { bottom: 14%; left: 12%; transform: rotate(-20deg); }
  .flax.f2 { bottom: 18%; left: 40%; transform: rotate(8deg); }
  .flax.f3 { bottom: 12%; right: 18%; transform: rotate(-10deg); }

  .rope-icon {
    position: absolute;
    bottom: 20%;
    left: 44%;
    transform: translateX(-50%);
    font-size: 20cqmin;
    filter: drop-shadow(0 2cqmin 4cqmin rgba(0, 0, 0, 0.35));
    animation: twist 2s ease-in-out infinite;
  }

  .hands {
    position: absolute;
    bottom: 28%;
    left: 52%;
    font-size: 12cqmin;
    filter: drop-shadow(0 1cqmin 2cqmin rgba(0, 0, 0, 0.3));
  }

  .people.play {
    position: absolute;
    bottom: 12%;
    left: 52%;
    font-size: 12cqmin;
    filter: drop-shadow(0 1cqmin 2cqmin rgba(0, 0, 0, 0.3));
  }

  /* ── Sparkles ── */
  .spark { font-size: 7cqmin; }
  .spark.s1 { top: 14%; left: 20%; }
  .spark.s2 { top: 20%; left: 48%; }

  /* ── Speech text (sky zone, left side) ── */
  .say {
    top: 5%;
    left: 40%;
    font-size: 8cqmin;
    font-family: 'Fredoka', 'Nunito', sans-serif;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 1cqmin 2cqmin rgba(0, 0, 0, 0.6);
    filter: none;
  }
  .say.fast {
    top: 12%;
    left: 22%;
    font-size: 7cqmin;
    color: #fff5cc;
  }

  /* ── Idle motion ── */
  .grade-hide .waka,
  .grade-hook .waka.small { animation: bob 3.4s ease-in-out infinite; }
  .grade-pull .waka.tilt { animation: rock 1.4s ease-in-out infinite; }
  .grade-sun-race .sun.race { animation: race 0.7s ease-in-out infinite; }
  .grade-sun-race .streak { animation: streakFade 0.7s ease-in-out infinite; }
  .grade-snare .snare-net { animation: tighten 1.6s ease-in-out infinite; }
  .grade-snare .sun.caught { animation: struggle 1.2s ease-in-out infinite; }
  .grade-snare .patu.held { animation: tap 1.8s ease-in-out infinite; }
  .grade-long-day .sun.big-warm { animation: warmPulse 3s ease-in-out infinite; }
  .grade-long-day .people.play { animation: bob 3.4s ease-in-out infinite; }
  .grade-plait .rope-icon { animation: twist 2s ease-in-out infinite; }
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

  @keyframes race {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-12%); }
  }
  @keyframes streakFade {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.9; }
  }
  @keyframes tighten {
    0%, 100% { transform: translateX(-50%) scale(1); border-color: rgba(255, 220, 150, 0.7); }
    50% { transform: translateX(-50%) scale(0.88); border-color: rgba(255, 180, 80, 0.9); }
  }
  @keyframes struggle {
    0%, 100% { transform: translateX(-50%) scale(1); }
    25% { transform: translateX(-58%) scale(1.08); }
    75% { transform: translateX(-42%) scale(1.05); }
  }
  @keyframes tap {
    0%, 100% { transform: translateX(-50%) rotate(0); }
    30% { transform: translateX(-50%) rotate(-12deg); }
    60% { transform: translateX(-50%) rotate(6deg); }
  }
  @keyframes warmPulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.06); }
  }
  @keyframes twist {
    0%, 100% { transform: translateX(-50%) rotate(0); }
    50% { transform: translateX(-50%) rotate(12deg); }
  }

  .scene.still :is(.waka, .spark, .star, .hook, .patu, .island, .sun, .rope-icon, .snare-net, .people) { animation: none !important; }

  @media (prefers-reduced-motion: reduce) {
    :is(.waka, .spark, .star, .hook, .patu, .island, .sun, .rope-icon, .snare-net, .people, .streak) { animation: none !important; }
  }
</style>
