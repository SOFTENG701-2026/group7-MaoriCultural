<script lang="ts">
  import { onMount } from 'svelte'

  import { bg, titleImg, explorerImg, settingImg, rewardImg } from './assets'
  import { LOCATIONS, type Pt, type Loc } from './locations'

  import MapMarker from './components/MapMarker.svelte'
  import KiwiCharacter from './components/KiwiCharacter.svelte'
  import ReadAloudButton from './components/ReadAloudButton.svelte'
  import LocationInfoModal from './components/LocationInfoModal.svelte'
  import AwardPanel from './components/AwardPanel.svelte'
  import OnboardingSpotlight from './components/OnboardingSpotlight.svelte'
  import GuideTour from './components/GuideTour.svelte'

  import { settings } from '../../lib/settings.svelte'
  import { progress } from '../../lib/progress.svelte'

  let { onnavigate = (_id: string) => {} }: { onnavigate?: (id: string) => void } = $props()

  let kiwi = $state<Pt>({ x: 41, y: 32 })
  let facing = $state(1)
  let walking = $state(false)
  let walkDur = $state(1.2)
  let active = $state<string | null>(null)
  let dest = $state<Pt | null>(null)
  let hinted = $state(true)
  let infoLoc = $state<Loc | null>(null)
  let showAwards = $state(false)

  const UNLOCK_ORDER = ['waiata', 'purakau', 'pepeha', 'tikanga']

  const PREREQUISITES: Record<string, string | null> = {
    waiata: null,
    purakau: 'waiata',
    pepeha: 'purakau',
    tikanga: 'purakau'
  }

  function isLocked(id: string): boolean {
    const prereqId = PREREQUISITES[id]
    if (!prereqId) return false
    return !progress.isComplete(prereqId)
  }

  function prerequisiteLabel(id: string): string {
    const prereqId = PREREQUISITES[id]
    if (!prereqId) return ''

    const prereqLoc = LOCATIONS.find((l) => l.id === prereqId)
    return prereqLoc?.label ?? prereqId
  }

  /*
    Onboarding behaviour:
    - Shows again after browser refresh because window.__mapOnboardingSeen resets.
    - Does NOT show again when returning from Waiata because the flag stays in memory.
    - Does not use localStorage, because localStorage would stay even after refresh.
  */
  let showOnboarding = $state(false)

  onMount(() => {
    const w = window as Window & { __mapOnboardingSeen?: boolean }

    if (!progress.isComplete('waiata') && !w.__mapOnboardingSeen) {
      showOnboarding = true
    }
  })

  $effect(() => {
    if (progress.isComplete('waiata')) showOnboarding = false
  })

  function dismissOnboarding() {
    const w = window as Window & { __mapOnboardingSeen?: boolean }
    w.__mapOnboardingSeen = true

    showOnboarding = false

    // Show guide after onboarding for all new users
    if (!hasSeenGuide()) {
      setTimeout(() => {
        showGuide = true
      }, 300)
    }
  }

  const GUIDE_KEY = 'mca-guide-seen-v2'

  function hasSeenGuide(): boolean {
    try {
      return !!localStorage.getItem(GUIDE_KEY)
    } catch {
      return false
    }
  }

  function markGuideSeen(): void {
    try {
      localStorage.setItem(GUIDE_KEY, '1')
    } catch {}
  }

  let showGuide = $state(false)

  const GUIDE_LINES = [
    'Kia ora! Welcome to Kiwi’s big adventure!',
    'This is a map of Aotearoa, my home.',
    'Tap a place and I will walk there.',
    'Or use the arrow keys to move me.',
    'Tap the place again to play and learn.',
    'Now let’s go, explorer!'
  ]

  const waiataLoc = LOCATIONS.find((l) => l.id === 'waiata')!

  let unlockingId = $state<string | null>(null)

  $effect(() => {
    const completedSnap = [...progress.completed]

    for (const completedId of completedSnap) {
      const idx = UNLOCK_ORDER.indexOf(completedId)
      const nextId = UNLOCK_ORDER[idx + 1]

      if (nextId && !progress.isComplete(nextId) && !isLocked(nextId)) {
        if (unlockingId !== nextId) {
          unlockingId = nextId

          setTimeout(() => {
            unlockingId = null
          }, 2400)
        }

        break
      }
    }
  })

  let lockedToast = $state<string | null>(null)
  let toastTimer: ReturnType<typeof setTimeout>
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

    if (isLocked(loc.id)) {
      clearTimeout(toastTimer)

      lockedToast = `You need to complete ${prerequisiteLabel(loc.id)} first! 🔒`

      toastTimer = setTimeout(() => {
        lockedToast = null
      }, 2200)

      return
    }

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
      y: Math.min(96, Math.max(10, kiwi.y + dy))
    }

    clearTimeout(stepTimer)

    stepTimer = setTimeout(() => {
      walking = false
    }, 230)
  }

  function onKey(e: KeyboardEvent) {
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

  const ORDERED_LOCATIONS = UNLOCK_ORDER
    .map((id) => LOCATIONS.find((l) => l.id === id))
    .filter(Boolean) as Loc[]

  const TRAIL_PTS = ORDERED_LOCATIONS.map((l) => l.icon)

  function buildPath(pts: Pt[]): string {
    if (pts.length < 2) return ''

    const d: string[] = [`M ${pts[0].x} ${pts[0].y}`]

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`)
    }

    return d.join(' ')
  }

  const fullTrail = buildPath(TRAIL_PTS)
</script>

<svelte:window onkeydown={onKey} />

<div class="wrap">
  <div class="stage" style="background-image:url({bg})">
    <div class="vignette" aria-hidden="true"></div>

    <img class="title" src={titleImg} alt="Map of Kiwi's Aotearoa Adventure" draggable="false" />

    <img class="explorer" src={explorerImg} alt="Kia ora! Explorer" draggable="false" />

    <button class="util setting" onclick={() => (settings.open = true)} aria-label="Settings">
      <img src={settingImg} alt="" draggable="false" />
    </button>

    <button class="util reward" onclick={() => (showAwards = true)} aria-label="Reward">
      <img src={rewardImg} alt="" draggable="false" />
    </button>

    <svg class="trail-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="trail-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={fullTrail} class="trail-base" />

      {#each ORDERED_LOCATIONS.slice(0, -1) as loc, i}
        {#if progress.isComplete(loc.id)}
          <path d={buildPath([TRAIL_PTS[i], TRAIL_PTS[i + 1]])} class="trail-lit" />
        {/if}
      {/each}

      {#each TRAIL_PTS as pt, i}
        <circle
          cx={pt.x}
          cy={pt.y}
          r="1.1"
          class="waypoint-dot"
          class:done={progress.isComplete(ORDERED_LOCATIONS[i].id)}
          class:locked-dot={isLocked(ORDERED_LOCATIONS[i].id)}
        />
      {/each}

      {#each TRAIL_PTS as pt, i}
        {#if !progress.isComplete(ORDERED_LOCATIONS[i].id)}
          <text
            x={pt.x + 2.2}
            y={pt.y - 2.8}
            class="step-label"
            class:locked-label={isLocked(ORDERED_LOCATIONS[i].id)}
          >
            {i + 1}
          </text>
        {/if}
      {/each}
    </svg>

    {#each LOCATIONS as loc, i (loc.id)}
      <MapMarker
        {loc}
        index={i}
        active={active === loc.id}
        completed={progress.isComplete(loc.id)}
        locked={isLocked(loc.id)}
        onpick={selectLocation}
      />
    {/each}

    {#if unlockingId}
      {@const ul = LOCATIONS.find((l) => l.id === unlockingId)}

      {#if ul}
        <div class="unlock-burst" style="left:{ul.icon.x}%; top:{ul.icon.y}%" aria-hidden="true">
          🎉
        </div>
      {/if}
    {/if}

    {#if dest}
      <span class="ring" style="left:{dest.x}%; top:{dest.y}%" aria-hidden="true"></span>
    {/if}

    {#if activeLoc && !walking}
      <div
        class="tag"
        style="left:{activeLoc.icon.x}%; top:{activeLoc.icon.y - activeLoc.w * 0.78}%"
        aria-hidden="true"
      >
        Tap again to explore
      </div>
    {/if}

    <KiwiCharacter pos={kiwi} {facing} {walking} {walkDur} />

    <ReadAloudButton />

    {#if lockedToast}
      <div class="locked-toast" role="status" aria-live="polite">
        {lockedToast}
      </div>
    {/if}

    {#if infoLoc}
      <LocationInfoModal loc={infoLoc} onstart={startLocation} onclose={() => (infoLoc = null)} />
    {/if}

    {#if showAwards}
      <AwardPanel onclose={() => (showAwards = false)} />
    {/if}

    {#if hinted && !showOnboarding && !showGuide}
      <div class="hint" aria-hidden="true">
        Tap a place — or use the arrow keys — to walk Kiwi
      </div>
    {/if}

    {#if showOnboarding}
      <OnboardingSpotlight
        waiataIcon={waiataLoc.icon}
        waiataW={waiataLoc.w}
        onDismiss={dismissOnboarding}
      />
    {/if}

    {#if showGuide}
      <GuideTour lines={GUIDE_LINES} onfinish={() => { showGuide = false; markGuideSeen() }} />
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
    background: radial-gradient(120% 90% at 50% 18%, #1f6f8b 0%, #103447 55%, #081b27 100%);
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
  }

  .stage {
    position: relative;
    z-index: 1;
    width: 100vw;
    height: 100svh;
    background-size: 100% 100%;
    background-position: center;
    box-shadow: 0 0 44px rgba(0, 0, 0, 0.45);
    overflow: hidden;
    user-select: none;
  }

  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
    background: radial-gradient(130% 100% at 50% 45%, transparent 60%, rgba(4, 18, 26, 0.45) 100%);
    box-shadow: inset 0 0 60px rgba(4, 18, 26, 0.35);
  }

  img {
    -webkit-user-drag: none;
  }

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

  .trail-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    pointer-events: none;
  }

  :global(.trail-base) {
    fill: none;
    stroke: rgba(255, 235, 160, 0.28);
    stroke-width: 0.8;
    stroke-dasharray: 2.2 2.8;
    stroke-linecap: round;
  }

  :global(.trail-lit) {
    fill: none;
    stroke: rgba(255, 210, 60, 0.9);
    stroke-width: 1.1;
    stroke-dasharray: 2.2 2.8;
    stroke-linecap: round;
    filter: url(#trail-glow);
  }

  :global(.waypoint-dot) {
    fill: rgba(255, 235, 160, 0.45);
    stroke: rgba(255, 235, 160, 0.7);
    stroke-width: 0.3;
  }

  :global(.waypoint-dot.done) {
    fill: rgba(255, 210, 60, 0.95);
    stroke: #fff;
    stroke-width: 0.4;
  }

  :global(.waypoint-dot.locked-dot) {
    fill: rgba(160, 160, 160, 0.35);
    stroke: rgba(160, 160, 160, 0.5);
  }

  :global(.step-label) {
    fill: rgba(255, 240, 180, 0.72);
    font-size: 2.4px;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 800;
    paint-order: stroke fill;
    stroke: rgba(20, 20, 20, 0.5);
    stroke-width: 0.5px;
  }

  :global(.step-label.locked-label) {
    fill: rgba(180, 180, 180, 0.5);
  }

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

  .locked-toast {
    position: absolute;
    left: 50%;
    bottom: 12%;
    transform: translateX(-50%);
    z-index: 50;
    background: rgba(30, 20, 10, 0.88);
    color: #ffe9c2;
    font-size: clamp(11px, 1.8vmin, 16px);
    font-weight: 700;
    padding: 0.55em 1.2em;
    border-radius: 999px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
    pointer-events: none;
    border: 1.5px solid rgba(255, 200, 80, 0.4);
    animation: toastIn 0.22s ease-out both, toastOut 0.28s 1.9s ease-in forwards;
  }

  .unlock-burst {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 45;
    font-size: clamp(20px, 4vmin, 36px);
    pointer-events: none;
    animation: burstPop 2.2s ease-out forwards;
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 1;
    }

    100% {
      transform: translate(-50%, -50%) scale(1.4);
      opacity: 0;
    }
  }

  @keyframes pop {
    from {
      opacity: 0;
      transform: translate(-50%, -90%) scale(0.85);
    }

    to {
      opacity: 1;
      transform: translate(-50%, -100%) scale(1);
    }
  }

  @keyframes floatHint {
    0%,
    100% {
      transform: translateX(-50%) translateY(0);
    }

    50% {
      transform: translateX(-50%) translateY(-4px);
    }
  }

  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes toastOut {
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(6px);
    }
  }

  @keyframes burstPop {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.4);
    }

    18% {
      opacity: 1;
      transform: translate(-50%, -80%) scale(1.3);
    }

    55% {
      opacity: 1;
      transform: translate(-50%, -100%) scale(1);
    }

    100% {
      opacity: 0;
      transform: translate(-50%, -130%) scale(0.8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ring,
    .hint,
    .unlock-burst {
      animation: none !important;
    }

    .locked-toast {
      animation: none !important;
      opacity: 1;
    }
  }
</style>
