<script lang="ts">
  // Author: Shirley

  import { bg, titleImg, explorerImg, settingImg, rewardImg } from './assets'
  import { LOCATIONS, type Pt, type Loc } from './locations'
  import MapMarker from './components/MapMarker.svelte'
  import KiwiCharacter from './components/KiwiCharacter.svelte'
  import ReadAloudButton from './components/ReadAloudButton.svelte'
  import LocationInfoModal from './components/LocationInfoModal.svelte'
  import GuideTour from './components/GuideTour.svelte'
  import AwardPanel from './components/AwardPanel.svelte'
  import { settings } from '../../lib/settings.svelte'
  import { progress } from '../../lib/progress.svelte'

  let { onnavigate = (_id: string) => {} }: { onnavigate?: (id: string) => void } = $props()

  // --- Kiwi character state -------------------------------------------------
  let kiwi = $state<Pt>({ x: 41, y: 32 }) // starts on the central island
  let facing = $state(1) // 1 = facing right, -1 = facing left
  let walking = $state(false)
  let walkDur = $state(1.2) // seconds for the current walk (scales with distance)
  let active = $state<string | null>(null) // location the kiwi is visiting
  let dest = $state<Pt | null>(null) // current walk target (for the ring)
  let hinted = $state(true) // show the "how to play" hint until first move
  let infoLoc = $state<Loc | null>(null) // place whose intro popup is open
  let showAwards = $state(false) // reward/award collection panel
  let showGuide = $state(true) // new-player guide banner, shown on first load

  // Friendly one-line tips, kept short for young readers. Tap to advance.
  const GUIDE_LINES = [
    'Kia ora! Welcome to Kiwi’s big adventure!',
    'This is a map of Aotearoa, my home.',
    'Tap a place and I will walk there.',
    'Or use the arrow keys to move me.',
    'Tap the place again to play and learn.',
    'Now let’s go, explorer!',
  ]

  let walkTimer: ReturnType<typeof setTimeout>
  let stepTimer: ReturnType<typeof setTimeout>

  function walkTo(target: Pt) {
    const dist = Math.hypot(target.x - kiwi.x, target.y - kiwi.y)
    if (dist < 0.5) return
    facing = target.x >= kiwi.x ? 1 : -1
    walkDur = Math.min(2.6, Math.max(0.55, dist * 0.05))
    walking = true
    dest = target
    kiwi = { ...target }
    clearTimeout(walkTimer)
    walkTimer = setTimeout(() => {
      walking = false
      dest = null
    }, walkDur * 1000)
  }

  function selectLocation(loc: Loc) {
    hinted = false
    // Tapping a place the kiwi has already reached opens its intro popup.
    if (active === loc.id && !walking) {
      infoLoc = loc
      return
    }
    active = loc.id
    walkTo(loc.stand)
  }

  function startLocation() {
    if (infoLoc) onnavigate(infoLoc.id)
    infoLoc = null
  }

  const STEP = 3
  function nudge(dx: number, dy: number) {
    hinted = false
    if (dx !== 0) facing = dx > 0 ? 1 : -1
    active = null
    dest = null
    walkDur = 0.2
    walking = true
    kiwi = {
      x: Math.min(96, Math.max(4, kiwi.x + dx)),
      y: Math.min(96, Math.max(10, kiwi.y + dy)),
    }
    clearTimeout(stepTimer)
    stepTimer = setTimeout(() => (walking = false), 230)
  }

  function onKey(e: KeyboardEvent) {
    // While a popup is open it owns the keyboard: Escape closes it, everything
    // else is ignored so the kiwi doesn't walk behind the dialog.
    if (infoLoc) {
      if (e.key === 'Escape') infoLoc = null
      return
    }
    if (showAwards) {
      if (e.key === 'Escape') showAwards = false
      return
    }
    const k = e.key.toLowerCase()
    if (k === 'arrowleft' || k === 'a') nudge(-STEP, 0)
    else if (k === 'arrowright' || k === 'd') nudge(STEP, 0)
    else if (k === 'arrowup' || k === 'w') nudge(0, -STEP)
    else if (k === 'arrowdown' || k === 's') nudge(0, STEP)
    else {
      const idx = ['1', '2', '3', '4'].indexOf(k)
      if (idx >= 0) selectLocation(LOCATIONS[idx])
      return
    }
    e.preventDefault()
  }

  const activeLoc = $derived(LOCATIONS.find((l) => l.id === active) ?? null)
</script>

<svelte:window onkeydown={onKey} />

<div class="wrap">
  <div class="stage" style="background-image:url({bg})">
    <div class="vignette" aria-hidden="true"></div>

    <!-- Top banner -->
    <img class="title" src={titleImg} alt="Map of Kiwi's Aotearoa Adventure" draggable="false" />

    <!-- Player card -->
    <img class="explorer" src={explorerImg} alt="Kia ora! Explorer" draggable="false" />

    <!-- Top-right utilities -->
    <button class="util setting" onclick={() => (settings.open = true)} aria-label="Settings">
      <img src={settingImg} alt="" draggable="false" />
    </button>
    <button class="util reward" onclick={() => (showAwards = true)} aria-label="Reward">
      <img src={rewardImg} alt="" draggable="false" />
    </button>

    <!-- Location markers -->
    {#each LOCATIONS as loc, i (loc.id)}
      <MapMarker {loc} index={i} active={active === loc.id} completed={progress.isComplete(loc.id)} onpick={selectLocation} />
    {/each}

    <!-- Walk destination ring -->
    {#if dest}
      <span class="ring" style="left:{dest.x}%; top:{dest.y}%" aria-hidden="true"></span>
    {/if}

    <!-- "Tap again to explore" tag -->
    {#if activeLoc && !walking}
      <div
        class="tag"
        style="left:{activeLoc.icon.x}%; top:{activeLoc.icon.y - activeLoc.w * 0.78}%"
        aria-hidden="true"
      >
        Tap again to explore
      </div>
    {/if}

    <!-- The kiwi character -->
    <KiwiCharacter pos={kiwi} {facing} {walking} {walkDur} />

    <!-- Read to me -->
    <ReadAloudButton />

    <!-- How-to-play hint (suppressed while the new-player guide is open) -->
    {#if hinted && !showGuide}
      <div class="hint" aria-hidden="true">
        Tap a place — or use the arrow keys — to walk Kiwi
      </div>
    {/if}

    <!-- New-player guide banner -->
    {#if showGuide}
      <GuideTour lines={GUIDE_LINES} onfinish={() => (showGuide = false)} />
    {/if}

    <!-- Teaching-intro popup for the tapped place -->
    {#if infoLoc}
      <LocationInfoModal loc={infoLoc} onstart={startLocation} onclose={() => (infoLoc = null)} />
    {/if}

    <!-- Award collection panel -->
    {#if showAwards}
      <AwardPanel onclose={() => (showAwards = false)} />
    {/if}
  </div>
</div>

<style>
  .wrap {
    --pad: 0px;
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: var(--pad);
    box-sizing: border-box;
    background:
      radial-gradient(120% 90% at 50% 18%, #1f6f8b 0%, #103447 55%, #081b27 100%);
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
  }

  .stage {
    position: relative;
    z-index: 1;
    /* The map is stretched to exactly fill the viewport (background-size:
       100% 100%). Because the markers and the kiwi are positioned by the same
       percentages, they stay locked to their spots on the map even when the
       1280×832 art is stretched to a wider screen. */
    width: 100vw;
    height: 100svh;
    background-size: 100% 100%;
    background-position: center;
    box-shadow: 0 0 44px rgba(0, 0, 0, 0.45);
    overflow: hidden;
    user-select: none;
  }

  /* Soft atmospheric edge so the painted map sits inside a frame. */
  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
    background:
      radial-gradient(130% 100% at 50% 45%, transparent 60%, rgba(4, 18, 26, 0.45) 100%);
    box-shadow: inset 0 0 60px rgba(4, 18, 26, 0.35);
  }

  img {
    -webkit-user-drag: none;
  }

  /* ---- Static overlays ---- */
  .title {
    position: absolute;
    left: 50%;
    top: 1.5%;
    width: 43%;
    transform: translateX(-50%);
    z-index: 40;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  }

  .explorer {
    position: absolute;
    left: 1.6%;
    top: 4%;
    width: 13.2%;
    z-index: 40;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }

  .util {
    position: absolute;
    top: 4.5%;
    width: 9%;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    z-index: 40;
    transition: transform 0.18s ease, filter 0.18s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.32));
  }
  .util img {
    width: 100%;
    display: block;
  }
  .util:hover {
    transform: translateY(-3px) scale(1.05);
    filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.4));
  }
  .util:active {
    transform: translateY(-1px) scale(0.98);
  }
  .util:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: 3px;
    border-radius: 12px;
  }
  .setting {
    right: 11.5%;
  }
  .reward {
    right: 1.6%;
  }

  /* ---- Walk destination ring ---- */
  .ring {
    position: absolute;
    width: 5.5%;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 3px solid rgba(255, 233, 168, 0.9);
    box-shadow: 0 0 14px rgba(255, 233, 168, 0.6);
    z-index: 11;
    animation: ripple 1s ease-out infinite;
  }
  @keyframes ripple {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
  }

  /* ---- "Tap again" tag ---- */
  .tag {
    position: absolute;
    transform: translate(-50%, -100%);
    z-index: 35;
    background: rgba(31, 18, 8, 0.85);
    color: #ffe9c2;
    font-size: clamp(9px, 1.5vmin, 14px);
    font-weight: 600;
    white-space: nowrap;
    padding: 0.35em 0.7em;
    border-radius: 999px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    pointer-events: none;
    animation: pop 0.25s ease-out both;
  }
  .tag::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(31, 18, 8, 0.85);
  }
  @keyframes pop {
    from { opacity: 0; transform: translate(-50%, -90%) scale(0.85); }
    to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
  }

  /* ---- Hint ---- */
  .hint {
    position: absolute;
    left: 50%;
    bottom: 5%;
    transform: translateX(-50%);
    z-index: 40;
    color: #fff;
    font-size: clamp(10px, 1.6vmin, 15px);
    font-weight: 600;
    letter-spacing: 0.2px;
    padding: 0.4em 1em;
    border-radius: 999px;
    background: rgba(8, 27, 39, 0.55);
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    animation: floatHint 2.6s ease-in-out infinite;
  }
  @keyframes floatHint {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-4px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ring,
    .hint {
      animation: none !important;
    }
  }
</style>