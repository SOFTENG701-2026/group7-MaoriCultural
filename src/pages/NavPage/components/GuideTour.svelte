<script lang="ts">
  // Author: Shirley
  // First-time guide. Shows the kiwi-on-a-parchment banner near the bottom of
  // the map and reveals one short line at a time. A full-screen catcher means a
  // tap ANYWHERE advances to the next line; tapping past the last line (or the
  // "Skip" button in the banner's bottom-right) dismisses it. Lines are kept
  // very simple for young readers.
  import { guidewordsImg } from '../assets'

  let {
    lines,
    onfinish,
  }: {
    lines: string[]
    onfinish: () => void
  } = $props()

  let step = $state(0)
  const last = $derived(step >= lines.length - 1)

  function advance() {
    if (last) onfinish()
    else step += 1
  }

  function skip(e: MouseEvent) {
    e.stopPropagation()
    onfinish()
  }
</script>

<div class="guide-root">
  <!-- Tap anywhere on the map to move to the next tip. -->
  <button
    class="catcher"
    onclick={advance}
    aria-label={last ? 'Tap anywhere to start exploring' : 'Tap anywhere for the next tip'}
  ></button>

  <!-- The banner is purely visual: taps fall through to the catcher above. -->
  <div class="banner" style="background-image:url({guidewordsImg})">
    <span class="line">{lines[step]}</span>

    <div class="footer">
      <span class="dots" aria-hidden="true">
        {#each lines as _, i (i)}
          <span class="dot" class:on={i === step}></span>
        {/each}
      </span>

      {#if last}
        <span class="cue" aria-hidden="true">
          Let’s go!
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      {:else}
        <button class="skip" onclick={skip}>Skip</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .guide-root {
    position: absolute;
    inset: 0;
    z-index: 45;
  }

  .catcher {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .banner {
    position: absolute;
    left: 50%;
    bottom: 4%;
    width: 58%;
    transform: translateX(-50%);
    aspect-ratio: 900 / 187;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    /* Visual only — clicks pass through to the catcher behind it. */
    pointer-events: none;
    color: #5a3514;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.45));
    animation: rise 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  /* Text lives on the parchment to the right of the painted kiwi. The band is
     nudged up (~25% of the text block) so the words sit higher on the scroll. */
  .line {
    position: absolute;
    left: 20%;
    right: 4.5%;
    top: 0%;
    bottom: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: 700;
    line-height: 1.25;
    font-size: clamp(13px, 2.5vmin, 24px);
    animation: swap 0.25s ease-out;
  }

  .footer {
    position: absolute;
    left: 20%;
    right: 5%;
    bottom: 20%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dots {
    display: inline-flex;
    gap: 0.4em;
  }
  .dot {
    width: clamp(5px, 0.9vmin, 8px);
    height: clamp(5px, 0.9vmin, 8px);
    border-radius: 50%;
    background: rgba(90, 53, 20, 0.28);
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .dot.on {
    background: #b3722a;
    transform: scale(1.25);
  }

  .cue {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
    font-weight: 800;
    font-size: clamp(14px, 2.2vmin, 20px);
    color: #8a4a16;
  }
  .cue svg {
    width: 1.05em;
    height: 1.05em;
    animation: nudge 1.1s ease-in-out infinite;
  }

  .skip {
    /* Re-enable clicks on top of the pointer-events:none banner. */
    pointer-events: auto;
    padding: 0.1em 0.2em;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: #8a4a16;
    font-family: inherit;
    font-weight: 800;
    font-size: clamp(14px, 2.2vmin, 20px);
    letter-spacing: 0.3px;
    transition: color 0.16s ease, transform 0.16s ease;
  }
  .skip:hover {
    color: #5a3514;
    transform: scale(1.06);
  }
  .skip:focus-visible {
    outline: 3px solid #d97c1d;
    outline-offset: 2px;
    border-radius: 8px;
  }
  .catcher:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: -6px;
    border-radius: 16px;
  }

  @keyframes rise {
    from { opacity: 0; transform: translateX(-50%) translateY(14px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes swap {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes nudge {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .banner,
    .line,
    .cue svg {
      animation: none !important;
    }
  }
</style>
