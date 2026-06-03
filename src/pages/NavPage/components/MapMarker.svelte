<script lang="ts">
  // Author
  // Dev D — Map workstream: added `locked` prop, lock badge, greyed-out state.
  // All original behaviour (float/glow animations, complete badge) unchanged.
  import type { Loc } from '../locations'

  let {
    loc,
    index,
    active    = false,
    completed = false,
    locked    = false,   // NEW — true when prerequisite module not yet complete
    onpick,
  }: {
    loc:       Loc
    index:     number
    active?:   boolean
    completed?: boolean
    locked?:   boolean
    onpick:    (loc: Loc) => void
  } = $props()
</script>

<button
  class="marker"
  class:active
  class:completed
  class:locked
  style="left:{loc.icon.x}%; top:{loc.icon.y}%; width:{loc.w}%; --i:{index}"
  onclick={() => onpick(loc)}
  aria-label={locked
    ? `${loc.label} — locked`
    : active
    ? `Enter ${loc.label}`
    : `Walk Kiwi to ${loc.label}`}
  aria-disabled={locked}
>
  <img src={loc.img} alt={loc.label} draggable="false" />

  {#if completed}
    <span class="badge complete-badge" aria-label="Completed">✓</span>
  {/if}

  {#if locked}
    <span class="badge lock-badge" aria-label="Locked">🔒</span>
  {/if}
</button>

<style>
  .marker {
    position: absolute;
    transform: translate(-50%, -50%);
    isolation: isolate;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    z-index: 12;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease;
  }
  .marker img {
    width: 100%;
    display: block;
    -webkit-user-drag: none;
    filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.35));
    animation: float 4.5s ease-in-out infinite;
    animation-delay: calc(var(--i) * -1.1s);
  }
  .marker:hover                { transform: translate(-50%, -50%) scale(1.09); z-index: 13; }
  .marker:hover img            { filter: drop-shadow(0 12px 16px rgba(0, 0, 0, 0.45)); }
  .marker:active               { transform: translate(-50%, -50%) scale(0.96); }
  .marker:focus-visible        { outline: none; }
  .marker:focus-visible img    {
    filter: drop-shadow(0 0 4px #ffe9a8) drop-shadow(0 0 2px #ffe9a8)
            drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4));
  }
  .marker.active img {
    filter:
      drop-shadow(0 0 12px rgba(255, 224, 130, 0.95))
      drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4));
    animation: float 4.5s ease-in-out infinite, glow 1.4s ease-in-out infinite;
  }

  /* ── Completed: golden glow ── */
  .marker.completed img {
    filter:
      drop-shadow(0 0 10px rgba(255, 215, 0, 0.85))
      drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  }

  /* ── Locked: greyed, no hover lift ── */
  .marker.locked               { cursor: default; }
  .marker.locked img           {
    filter: grayscale(70%) brightness(0.65) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
    animation: float 4.5s ease-in-out infinite;
  }
  .marker.locked:hover         { transform: translate(-50%, -50%); }
  .marker.locked:hover img     {
    filter: grayscale(70%) brightness(0.65) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
  }

  /* ── Shared badge base ── */
  .badge {
    position: absolute;
    top: -6px; right: -6px;
    width: 24px; height: 24px;
    border-radius: 50%;
    font-size: 13px; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    border: 2px solid #fff;
    pointer-events: none;
    z-index: 2;
  }
  .complete-badge { background: #27ae60; color: #fff; }
  .lock-badge     { background: rgba(40, 40, 40, 0.82); color: #fff; font-size: 11px; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6%); }
  }
  @keyframes glow {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.78; }
  }

  @media (prefers-reduced-motion: reduce) {
    .marker img,
    .marker.active img,
    .marker.locked img { animation: none !important; }
  }
</style>