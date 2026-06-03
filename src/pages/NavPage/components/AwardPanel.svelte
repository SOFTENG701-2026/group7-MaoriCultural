<script lang="ts">
  import {
    awardBg,
    awardLockMusic,
    awardLockLanguage,
    awardLockMyth,
    awardLockPolite,
    awardMusic,
    awardLanguage,
    awardMyth,
    awardPolite,
  } from '../assets'

  import { progress } from '../../../lib/progress.svelte'

  let { onclose }: { onclose: () => void } = $props()

  type Award = {
    id: string
    name: string
    locked: string
    unlocked: string
    details: string
  }

  let showDetails = $state(false)

  const AWARDS: Award[] = [
    {
      id: 'waiata',
      name: 'Waiata Award',
      locked: awardLockMusic,
      unlocked: awardMusic,
      details: 'Earned by completing the Waiata singing activity.'
    },
    {
      id: 'tikanga',
      name: 'Tikanga Award',
      locked: awardLockLanguage,
      unlocked: awardLanguage,
      details: 'Earned by completing the Tikanga activity.'
    },
    {
      id: 'purakau',
      name: 'Pūrākau Award',
      locked: awardLockMyth,
      unlocked: awardMyth,
      details: 'Earned by completing the Pūrākau story activity.'
    },
    {
      id: 'pepeha',
      name: 'Pepeha Award',
      locked: awardLockPolite,
      unlocked: awardPolite,
      details: 'Earned by completing the Pepeha activity.'
    },
  ]

  function isUnlocked(id: string): boolean {
    return progress.isComplete(id)
  }
</script>

<div class="award-overlay">
  <div class="award-frame" style="background-image:url({awardBg})">
    <button class="award-close" onclick={onclose} aria-label="Close awards"></button>

    <ul class="shelf">
      {#each AWARDS as a (a.id)}
        {@const unlocked = isUnlocked(a.id)}

        <li class="medal" class:unlocked>
          <div class="award-name">{a.name}</div>

          <img
            src={unlocked ? a.unlocked : a.locked}
            alt={unlocked ? `${a.name} unlocked` : `${a.name} locked`}
            draggable="false"
          />

          <span class="caption" class:earned={unlocked}>
            {#if unlocked}
              ⭐ Unlocked
            {:else}
              🔒 Locked
            {/if}
          </span>
        </li>
      {/each}
    </ul>

    <button
      class="details-hotspot"
      onclick={() => (showDetails = true)}
      aria-label="View all achievement details">
    </button>

    {#if showDetails}
      <div class="details-modal">
        <div class="details-card">
          <button class="small-close" onclick={() => (showDetails = false)}>×</button>

          <h2>Achievement Details</h2>

          {#each AWARDS as a}
            {@const unlocked = isUnlocked(a.id)}

            <div class="detail-row" class:done={unlocked}>
              <strong>{a.name}</strong>
              <span>{unlocked ? '⭐ Unlocked' : '🔒 Locked'}</span>
              <p>{a.details}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
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
  }

  .award-frame {
    position: absolute;
    inset: 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
  }

  .award-close {
    position: absolute;
    top: 3.5%;
    right: 2.5%;
    width: 6%;
    aspect-ratio: 1;
    border: 0;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }

  .shelf {
    position: absolute;
    left: 12%;
    right: 12%;
    top: 18%;
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
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4%;
  }

  .award-name {
    background: rgba(20, 10, 2, 0.82);
    color: #ffe9a8;
    padding: 0.25em 0.75em;
    border-radius: 999px;
    font-size: clamp(10px, 1.45vmin, 15px);
    font-weight: 900;
    text-align: center;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.4);
  }

  .medal img {
    width: 86%;
    height: auto;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.55));
    opacity: 0.92;
  }

  .medal.unlocked img {
    opacity: 1;
    filter:
      drop-shadow(0 0 10px rgba(255, 225, 120, 0.85))
      drop-shadow(0 8px 12px rgba(0, 0, 0, 0.55));
    animation: glow 1.7s ease-in-out infinite;
  }

  .caption {
    padding: 0.22em 0.7em;
    border-radius: 999px;
    background: rgba(20, 10, 2, 0.78);
    color: #f2d9a0;
    font-weight: 700;
    font-size: clamp(10px, 1.5vmin, 15px);
  }

  .caption.earned {
    background: rgba(35, 95, 38, 0.9);
    color: #fff7c2;
  }

  .details-hotspot {
    position: absolute;
    left: 50%;
    bottom: 2.8%;
    transform: translateX(-50%);
    width: 30%;
    height: 8%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 20;
  }

  .details-hotspot:hover {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
  }

  .details-modal {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 80;
  }

  .details-card {
    position: relative;
    width: min(620px, 82vw);
    background: #fff4d0;
    border: 5px solid #7a421d;
    border-radius: 24px;
    padding: 24px;
    color: #3b220b;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  }

  .details-card h2 {
    margin: 0 0 14px;
    text-align: center;
  }

  .small-close {
    position: absolute;
    top: 10px;
    right: 14px;
    border: 0;
    background: #7a421d;
    color: white;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    font-size: 24px;
    cursor: pointer;
  }

  .detail-row {
    margin: 10px 0;
    padding: 10px 14px;
    border-radius: 14px;
    background: rgba(120, 80, 40, 0.14);
  }

  .detail-row.done {
    background: rgba(70, 160, 80, 0.2);
  }

  .detail-row strong {
    display: block;
    font-size: 18px;
  }

  .detail-row p {
    margin: 4px 0 0;
  }

  @keyframes glow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
</style>