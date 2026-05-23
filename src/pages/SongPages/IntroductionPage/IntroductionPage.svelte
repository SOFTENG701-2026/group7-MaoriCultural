<script lang="ts">
  // Author: Sungava
  // Scaffold for the Waiata introduction. Reached from the map by walking the
  // kiwi to Waiata and tapping it again. Flesh out the content here; the
  // `onback` prop returns to the map and `onnavigate` is ready for the next
  // step (e.g. LearningSongWithAIPage / PlayMusicPage).
  import waiataIcon from '../../../assets/Navpage/navi-waiata.png'

  let {
    onback = () => {},
    onnavigate = (_id: string) => {},
  }: { onback?: () => void; onnavigate?: (id: string) => void } = $props()
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
    <img class="icon" src={waiataIcon} alt="" draggable="false" />
    <p class="eyebrow">He Waiata · Māori Song</p>
    <h1>Waiata</h1>
    <p class="lead">
      Waiata are the songs of Aotearoa — sung to share stories, welcome
      visitors, and pass knowledge between generations. Let's learn one together.
    </p>

    <div class="actions">
      <button class="cta" onclick={() => onnavigate('learn-song')}>Start learning</button>
      <button class="ghost" onclick={onback}>Maybe later</button>
    </div>
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
    width: min(560px, 100%);
    text-align: center;
    background: linear-gradient(180deg, #fffaf0, #fbeccc);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 28px;
    padding: clamp(28px, 5vmin, 52px);
    box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.7);
  }

  .icon {
    width: clamp(96px, 18vmin, 150px);
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.3));
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .eyebrow {
    margin: 14px 0 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: clamp(11px, 1.6vmin, 14px);
    font-weight: 600;
    color: #b3722a;
  }

  h1 {
    margin: 4px 0 12px;
    font-size: clamp(40px, 8vmin, 64px);
    font-weight: 700;
    color: #7a3d12;
    letter-spacing: -0.5px;
  }

  .lead {
    margin: 0 auto;
    max-width: 42ch;
    font-size: clamp(15px, 2.1vmin, 19px);
    line-height: 1.5;
    color: #4a3a2a;
  }

  .actions {
    margin-top: clamp(22px, 4vmin, 34px);
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  .cta,
  .ghost {
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(14px, 2vmin, 18px);
    padding: 0.7em 1.6em;
    border-radius: 999px;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.18s ease;
  }
  .cta {
    border: 0;
    color: #fff;
    background: linear-gradient(180deg, #f0a93f, #d97c1d);
    box-shadow: 0 8px 18px -4px rgba(217, 124, 29, 0.7);
  }
  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 22px -4px rgba(217, 124, 29, 0.8);
  }
  .ghost {
    border: 2px solid #d9b98a;
    background: transparent;
    color: #7a3d12;
  }
  .ghost:hover {
    background: rgba(217, 185, 138, 0.25);
  }
  .cta:focus-visible,
  .ghost:focus-visible {
    outline: 3px solid #d97c1d;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .icon {
      animation: none;
    }
  }
</style>