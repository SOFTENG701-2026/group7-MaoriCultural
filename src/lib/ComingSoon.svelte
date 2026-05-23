<script lang="ts">
  // Shared placeholder for destinations that aren't built yet.
  // Pass the feature name as `title`; `onback` returns to the map.
  import kiwiImg from '../assets/Navpage/navi-kiwi.png'

  let { title = 'This place', onback = () => {} }: { title?: string; onback?: () => void } =
    $props()
</script>

<div class="page">
  <button class="back" onclick={onback}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span>Back to map</span>
  </button>

  <main class="card">
    <div class="kiwi">
      <img src={kiwiImg} alt="Kiwi" draggable="false" />
      <span class="shadow"></span>
    </div>
    <p class="eyebrow">Coming soon</p>
    <h1>{title}</h1>
    <p class="lead">
      Kiwi is still exploring this part of Aotearoa. This place isn't ready
      yet — check back soon!
    </p>
    <button class="cta" onclick={onback}>Back to the map</button>
  </main>
</div>

<style>
  .page {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: clamp(16px, 4vmin, 48px);
    box-sizing: border-box;
    background: radial-gradient(120% 90% at 50% 18%, #1f6f8b 0%, #103447 55%, #081b27 100%);
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    color: #0e2e3e;
    overflow: auto;
  }

  .back {
    position: absolute;
    top: clamp(14px, 3vmin, 28px);
    left: clamp(14px, 3vmin, 28px);
    display: inline-flex;
    align-items: center;
    gap: 0.45em;
    padding: 0.5em 1em 0.5em 0.7em;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 999px;
    cursor: pointer;
    color: #eaf6ff;
    background: rgba(8, 27, 39, 0.45);
    backdrop-filter: blur(4px);
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(13px, 1.7vmin, 17px);
    transition: transform 0.16s ease, background 0.18s ease;
  }
  .back svg {
    width: 1.2em;
    height: 1.2em;
  }
  .back:hover {
    transform: translateX(-2px);
    background: rgba(8, 27, 39, 0.65);
  }
  .back:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: 3px;
  }

  .card {
    width: min(520px, 100%);
    text-align: center;
    background: linear-gradient(180deg, #fffaf0, #fbeccc);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 28px;
    padding: clamp(32px, 5vmin, 56px);
    box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.7);
  }

  .kiwi {
    position: relative;
    display: inline-block;
    width: clamp(70px, 13vmin, 104px);
  }
  .kiwi img {
    width: 100%;
    display: block;
    filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.3));
    animation: hop 1.6s ease-in-out infinite;
  }
  .kiwi .shadow {
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: 70%;
    aspect-ratio: 3 / 1;
    transform: translateX(-50%);
    background: radial-gradient(50% 50% at 50% 50%, rgba(122, 61, 18, 0.3), transparent 72%);
    animation: shadowPulse 1.6s ease-in-out infinite;
  }
  @keyframes hop {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-12%) rotate(3deg); }
  }
  @keyframes shadowPulse {
    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.8; }
    50% { transform: translateX(-50%) scale(0.8); opacity: 0.55; }
  }

  .eyebrow {
    margin: 20px 0 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: clamp(11px, 1.6vmin, 14px);
    font-weight: 600;
    color: #b3722a;
  }

  h1 {
    margin: 4px 0 12px;
    font-size: clamp(34px, 7vmin, 56px);
    font-weight: 700;
    color: #7a3d12;
    letter-spacing: -0.5px;
  }

  .lead {
    margin: 0 auto 0;
    max-width: 38ch;
    font-size: clamp(15px, 2.1vmin, 19px);
    line-height: 1.5;
    color: #4a3a2a;
  }

  .cta {
    margin-top: clamp(22px, 4vmin, 34px);
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(14px, 2vmin, 18px);
    padding: 0.7em 1.6em;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    color: #fff;
    background: linear-gradient(180deg, #f0a93f, #d97c1d);
    box-shadow: 0 8px 18px -4px rgba(217, 124, 29, 0.7);
    transition: transform 0.16s ease, box-shadow 0.16s ease;
  }
  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 22px -4px rgba(217, 124, 29, 0.8);
  }
  .cta:focus-visible {
    outline: 3px solid #d97c1d;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .kiwi img,
    .kiwi .shadow {
      animation: none;
    }
  }
</style>