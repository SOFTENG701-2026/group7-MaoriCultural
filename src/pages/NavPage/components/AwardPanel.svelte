<script lang="ts">
  // Author: Shirley
  // The "Reward" collection panel, opened from the map's trophy button. It shows
  // Kiwi's achievement medals on the carved wooden board (award-bg). For now
  // every medal is in its LOCKED state — children earn the colourful versions
  // later. A "Locked" caption makes the state clear in words, so it never relies
  // on the greyed-out art (or colour) alone.
  import {
    awardBg,
    awardLockMusic,
    awardLockLanguage,
    awardLockMyth,
    awardLockPolite,
  } from '../assets'

  let { onclose }: { onclose: () => void } = $props()

  type Award = { id: string; name: string; locked: string }

  // Two round medals first, then the two shield medals — keeps the shelf tidy.
  const AWARDS: Award[] = [
    { id: 'waiata', name: 'Waiata', locked: awardLockMusic },
    { id: 'korero', name: 'Kōrero', locked: awardLockLanguage },
    { id: 'purakau', name: 'Pūrākau', locked: awardLockMyth },
    { id: 'pepeha', name: 'Pepeha', locked: awardLockPolite },
  ]
</script>

<div class="award-overlay">
  <div class="award-frame" style="background-image:url({awardBg})">
    <!-- Sits over the painted ✕ in the corner of the board. -->
    <button class="award-close" onclick={onclose} aria-label="Close awards"></button>

    <ul class="shelf">
      {#each AWARDS as a (a.id)}
        <li class="medal">
          <img src={a.locked} alt="{a.name} award, locked" draggable="false" />
          <span class="caption">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 10V7a5 5 0 0 1 10 0v3"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <rect x="5" y="10" width="14" height="9" rx="2" fill="currentColor" />
            </svg>
            Locked
          </span>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .award-overlay {
    position: absolute;
    inset: 0;
    z-index: 70;
    display: grid;
    place-items: center;
    background: rgba(4, 18, 26, 0.55);
    animation: fade 0.18s ease-out both;
  }

  /* award-bg shares the map's 1283:832 ratio, so it fills the stage cleanly. */
  .award-frame {
    position: absolute;
    inset: 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    animation: pop 0.24s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .award-close {
    position: absolute;
    top: 3.5%;
    right: 2.5%;
    width: 6%;
    aspect-ratio: 1;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }
  .award-close:hover {
    background: rgba(255, 255, 255, 0.14);
  }
  .award-close:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: 2px;
  }

  /* The carved inner board, where the medals are arranged in a row. */
  .shelf {
    position: absolute;
    left: 12%;
    right: 12%;
    top: 19%;
    bottom: 22%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2%;
  }

  .medal {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8%;
    animation: rise 0.4s ease both;
  }
  .medal:nth-child(2) { animation-delay: 0.06s; }
  .medal:nth-child(3) { animation-delay: 0.12s; }
  .medal:nth-child(4) { animation-delay: 0.18s; }

  .medal img {
    width: 86%;
    height: auto;
    -webkit-user-drag: none;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.55));
    /* Slightly dimmed to read as "not yet earned". */
    opacity: 0.92;
  }

  .caption {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    padding: 0.22em 0.7em;
    border-radius: 999px;
    background: rgba(20, 10, 2, 0.78);
    color: #f2d9a0;
    font-weight: 700;
    font-size: clamp(10px, 1.5vmin, 15px);
    letter-spacing: 0.3px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }
  .caption svg {
    width: 1.05em;
    height: 1.05em;
  }

  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pop {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .award-overlay,
    .award-frame,
    .medal {
      animation: none !important;
    }
  }
</style>