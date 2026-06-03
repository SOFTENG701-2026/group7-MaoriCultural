<script lang="ts">
  import { awardBg } from '../assets'
  import { progress } from '../../../lib/progress.svelte'

  // ── Badge images — exact filenames from src/assets/badges/ ──────────────
  import waiataLocked     from '../../../assets/badges/灰waiata badge.png'
  import waiataBeginner   from '../../../assets/badges/waiata badge for beginners.png'
  import waiataConfident  from '../../../assets/badges/waiata badge for confident.png'

  import purakauLocked    from '../../../assets/badges/灰purakau badge.png'
  import purakauBeginner  from '../../../assets/badges/Purakau badge for beginners.png'
  import purakauConfident from '../../../assets/badges/purakau badge for confident.png'

  import tikangaLocked    from '../../../assets/badges/灰tikanga badge.png'
  import tikangaBeginner  from '../../../assets/badges/p8 tikanga badge for beginners.png'
  import tikangaConfident from '../../../assets/badges/p8 tikanga badge for confident.png'

  import pepehaLocked     from '../../../assets/badges/灰pepeha badge.png'
  import pepehaBeginner   from '../../../assets/badges/pepeha badge for beginners.png'
  import pepehaConfident  from '../../../assets/badges/pepeha badge for confident.png'

  let { onclose }: { onclose: () => void } = $props()

  let showDetails = $state(false)

  // ── Badge level: reads sessionStorage first, then localStorage ───────────
  // Never downgrades: confident > beginner > none
  function getBadgeLevel(key: string): 'confident' | 'beginner' | 'none' {
    try {
      const s = sessionStorage.getItem(key)
      if (s === 'confident') return 'confident'
      if (s === 'beginner')  return 'beginner'
      const l = localStorage.getItem(key)
      if (l === 'confident') return 'confident'
      if (l === 'beginner')  return 'beginner'
    } catch {}
    return 'none'
  }

  const BADGES = [
    { id: 'waiata',  label: 'Waiata Award',  key: 'mca-waiata-badge',  locked: waiataLocked,  beginner: waiataBeginner,  confident: waiataConfident  },
    { id: 'purakau', label: 'Pūrākau Award', key: 'mca-purakau-badge', locked: purakauLocked, beginner: purakauBeginner, confident: purakauConfident },
    { id: 'tikanga', label: 'Kōrero Award',  key: 'mca-tikanga-badge', locked: tikangaLocked, beginner: tikangaBeginner, confident: tikangaConfident },
    { id: 'pepeha',  label: 'Pepeha Award',  key: 'mca-pepeha-badge',  locked: pepehaLocked,  beginner: pepehaBeginner,  confident: pepehaConfident  },
  ]

  let badgeStates = $derived(BADGES.map(b => {
    const done  = progress.isComplete(b.id)
    const level = getBadgeLevel(b.key)
    const show  = done ? level : 'none'
    return {
      ...b,
      level: show,
      img:
        show === 'confident' ? b.confident :
        show === 'beginner'  ? b.beginner  :
                               b.locked,
      caption:
        show === 'confident' ? '🌺 Confident' :
        show === 'beginner'  ? '🌿 Beginner'  :
                               '🔒 Locked',
      unlocked: done && level !== 'none',
    }
  }))

  let completedCount = $derived(badgeStates.filter(b => b.unlocked).length)
</script>

<!-- ── Main awards panel ── -->
<div class="overlay" role="dialog" aria-modal="true" aria-label="Achievements">
  <div class="frame" style="background-image: url({awardBg})">

    <!-- Invisible close hotspot over the X in background image -->
    <button class="hotspot-close" onclick={onclose} aria-label="Close"></button>

    <!-- 2×2 badge grid -->
    <div class="badge-grid">
      {#each badgeStates as b (b.id)}
        <div class="badge-slot" class:unlocked={b.unlocked} class:confident={b.level === 'confident'}>
          <p class="badge-name">{b.label}</p>
          <img
            src={b.img}
            alt={b.label}
            class="badge-img"
            class:locked-img={!b.unlocked}
            draggable="false"
          />
          <span class="badge-state" class:earned={b.unlocked}>{b.caption}</span>
        </div>
      {/each}
    </div>

    <!-- Progress pill -->
    <div class="progress-pill">
      PROGRESS: {completedCount}/{BADGES.length} ACHIEVEMENTS
    </div>

    <!-- Invisible hotspot over VIEW ALL DETAILS in background image -->
    <button class="hotspot-details" onclick={() => showDetails = true} aria-label="View all details"></button>

  </div>
</div>

<!-- ── Details popup ── -->
{#if showDetails}
  <div class="details-overlay" role="dialog" aria-modal="true" aria-label="Achievement details">
    <div class="details-box">
      <button class="details-close" onclick={() => showDetails = false} aria-label="Close details">×</button>
      <h2 class="details-title">Achievement Details</h2>

      {#each badgeStates as b (b.id)}
        <div class="detail-row" class:done={b.unlocked} class:confident={b.level === 'confident'}>
          <img src={b.img} alt={b.label} class="detail-img" draggable="false" />
          <div class="detail-text">
            <strong>{b.label}</strong>
            <span>{b.caption}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  /* ── Overlay ── */
  .overlay {
    position: absolute;
    inset: 0;
    z-index: 70;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(4, 18, 26, 0.6);
    animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

  /* ── Frame — uses awardBg as the panel image ── */
  .frame {
    position: relative;
    width: min(780px, 92vw);
    aspect-ratio: 700 / 720;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: 'Baloo 2', system-ui, sans-serif;
    margin-top: 4vh;
    animation: popIn .3s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes popIn {
    from { opacity:0; transform:scale(0.85) }
    to   { opacity:1; transform:scale(1) }
  }

  /* ── Invisible hotspot over the X button in the bg image ── */
  .hotspot-close {
    position: absolute;
    top: 6%;
    right: 2%;
    width: 8%;
    height: 8%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 20;
    border-radius: 50%;
    transition: background .15s;
  }
  .hotspot-close:hover { background: rgba(255,255,255,0.15); }

  /* ── Badge grid — sits inside the wooden panel area ── */
  .badge-grid {
    position: absolute;
    top: 20%;
    left: 11%;
    right: 11%;
    bottom: 20%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2.5%;
  }

  /* ── Individual badge slot ── */
  .badge-slot {
    background: rgba(25, 12, 4, 0.55);
    border-radius: 14px;
    border: 2px solid rgba(160,100,26,.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4%;
    padding: 3% 3%;
    transition: transform .15s;
  }
  .badge-slot:hover { transform: translateY(-2px); }
  .badge-slot.unlocked { border-color: rgba(255,220,80,.4); background: rgba(15,8,2,.45); }
  .badge-slot.confident { border-color: rgba(245,158,11,.6); box-shadow: 0 0 14px rgba(245,158,11,.2) inset; }

  /* Badge name label */
  .badge-name {
    margin: 0;
    font-size: clamp(9px, 1.5vmin, 13px);
    font-weight: 900;
    color: #ffe9a8;
    text-transform: uppercase;
    letter-spacing: .5px;
    background: rgba(15,8,2,.7);
    padding: 2px 8px;
    border-radius: 999px;
    text-align: center;
    line-height: 1.3;
  }

  /* Badge image */
  .badge-img {
    width: clamp(85px, 52%, 145px);
    height: auto;
    filter: drop-shadow(0 5px 10px rgba(0,0,0,.5));
    transition: filter .2s, transform .2s;
  }
  .badge-slot.unlocked .badge-img { animation: glow 1.8s ease-in-out infinite; }
  .badge-img.locked-img { filter: grayscale(1) brightness(.65) drop-shadow(0 4px 8px rgba(0,0,0,.4)); opacity:.7; }

  @keyframes glow {
    0%,100% { filter: drop-shadow(0 4px 10px rgba(0,0,0,.5)); transform: scale(1); }
    50%      { filter: drop-shadow(0 0 18px rgba(255,220,80,.85)) drop-shadow(0 4px 10px rgba(0,0,0,.4)); transform: scale(1.04); }
  }

  /* Completion state pill */
  .badge-state {
    font-size: clamp(9px, 1.4vmin, 12px);
    font-weight: 800;
    color: #f2d9a0;
    background: rgba(15,8,2,.75);
    padding: 2px 9px;
    border-radius: 999px;
  }
  .badge-state.earned { background: rgba(30,80,35,.85); color: #d4fcbc; }

  /* ── Progress pill ── */
  .progress-pill {
    position: absolute;
    bottom: 12%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background: linear-gradient(180deg,#c8860a,#7a421d);
    color: #ffe9a8;
    font-size: clamp(10px,1.7vmin,15px);
    font-weight: 900;
    padding: 5px 22px;
    border-radius: 999px;
    border: 2px solid rgba(255,220,80,.45);
    box-shadow: 0 4px 12px rgba(0,0,0,.35);
    letter-spacing: 1px;
    text-transform: uppercase;
    pointer-events: none;
  }

  /* ── Invisible hotspot over VIEW ALL DETAILS text in bg image ── */
  .hotspot-details {
    position: absolute;
    bottom: 1%;
    left: 18%;
    right: 18%;
    height: 8%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 20;
    border-radius: 10px;
    transition: background .15s;
  }
  .hotspot-details:hover { background: rgba(255,255,255,0.12); }

  /* ── Details popup ── */
  .details-overlay {
    position: absolute;
    inset: 0;
    z-index: 90;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.55);
    animation: fadeIn .2s ease;
  }

  .details-box {
    position: relative;
    width: min(500px, 85vw);
    background: #fff8e8;
    border: 4px solid #7a421d;
    border-radius: 22px;
    padding: 24px 28px;
    box-shadow: 0 12px 36px rgba(0,0,0,.45);
    animation: popIn .3s cubic-bezier(.34,1.56,.64,1) both;
    font-family: 'Baloo 2', system-ui, sans-serif;
  }

  .details-title {
    margin: 0 0 16px;
    text-align: center;
    font-size: clamp(15px,2.2vmin,20px);
    font-weight: 900;
    color: #5a3208;
  }

  .details-close {
    position: absolute;
    top: 12px; right: 14px;
    width: 34px; height: 34px;
    border: none;
    border-radius: 50%;
    background: #7a421d;
    color: #fff;
    font-size: 20px;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .12s;
  }
  .details-close:hover { background: #a0541a; }

  /* Detail row */
  .detail-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 12px;
    margin-bottom: 8px;
    border-radius: 14px;
    background: rgba(120,80,40,.1);
    border: 2px solid transparent;
  }
  .detail-row.done      { background: rgba(50,140,60,.12); border-color: rgba(50,140,60,.3); }
  .detail-row.confident { background: rgba(245,158,11,.12); border-color: rgba(245,158,11,.35); }

  .detail-img {
    width: 52px; height: 52px;
    object-fit: contain;
    border-radius: 50%;
    flex-shrink: 0;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,.25));
  }

  .detail-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .detail-text strong {
    font-size: clamp(13px,1.8vmin,16px);
    font-weight: 900;
    color: #3b220b;
  }
  .detail-text span {
    font-size: clamp(11px,1.5vmin,14px);
    font-weight: 700;
    color: #7a421d;
  }
</style>