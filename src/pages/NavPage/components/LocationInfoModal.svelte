<script lang="ts">
  // Author: Shirley
  // The teaching-intro popup that opens when Kiwi enters a place on the map.
  // Shows the location's short introduction with a "Start" button (proceeds to
  // the lesson via the parent) and a "Back" button (closes the popup). The
  // parent only mounts this while a location is selected, so `loc` is always set.
  import type { Loc } from '../locations'

  let {
    loc,
    onstart,
    onclose,
  }: {
    loc: Loc
    onstart: () => void
    onclose: () => void
  } = $props()
</script>

<!-- Backdrop: a click outside the card dismisses the popup. -->
<div
  class="backdrop"
  role="presentation"
  onclick={(e) => {
    if (e.target === e.currentTarget) onclose()
  }}
>
  <div class="card" role="dialog" aria-modal="true" aria-labelledby="info-title">
    <button class="close" onclick={onclose} aria-label="Close">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <img class="icon" src={loc.img} alt="" draggable="false" />
    <p class="eyebrow">{loc.eyebrow}</p>
    <h2 id="info-title">{loc.label}</h2>
    <p class="lead">{loc.intro}</p>

    <div class="actions">
      <button class="cta" onclick={onstart}>Start</button>
      <button class="ghost" onclick={onclose}>Back</button>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: absolute;
    inset: 0;
    z-index: 60;
    display: grid;
    place-items: center;
    padding: clamp(12px, 4vmin, 40px);
    box-sizing: border-box;
    background: rgba(4, 18, 26, 0.55);
    backdrop-filter: blur(3px);
    overflow: auto;
    animation: fade 0.18s ease-out both;
  }

  .card {
    position: relative;
    width: min(460px, 100%);
    text-align: center;
    background: linear-gradient(180deg, #fffaf0, #fbeccc);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 24px;
    padding: clamp(24px, 4.5vmin, 44px);
    box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.7);
    color: #0e2e3e;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    animation: pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 2.1em;
    height: 2.1em;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    color: #7a3d12;
    background: rgba(217, 185, 138, 0.3);
    transition: background 0.16s ease, transform 0.16s ease;
  }
  .close svg {
    width: 1.1em;
    height: 1.1em;
  }
  .close:hover {
    background: rgba(217, 185, 138, 0.55);
    transform: scale(1.08);
  }
  .close:focus-visible {
    outline: 3px solid #d97c1d;
    outline-offset: 2px;
  }

  .icon {
    width: clamp(80px, 14vmin, 124px);
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.3));
    -webkit-user-drag: none;
  }

  .eyebrow {
    margin: 12px 0 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: clamp(10px, 1.5vmin, 13px);
    font-weight: 600;
    color: #b3722a;
  }

  h2 {
    margin: 4px 0 12px;
    font-size: clamp(30px, 6vmin, 48px);
    font-weight: 700;
    color: #7a3d12;
    letter-spacing: -0.5px;
  }

  .lead {
    margin: 0 auto;
    max-width: 40ch;
    font-size: clamp(14px, 2vmin, 18px);
    line-height: 1.5;
    color: #4a3a2a;
  }

  .actions {
    margin-top: clamp(20px, 3.5vmin, 30px);
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
    padding: 0.7em 1.8em;
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

  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pop {
    from { opacity: 0; transform: translateY(8px) scale(0.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop,
    .card {
      animation: none !important;
    }
  }
</style>
