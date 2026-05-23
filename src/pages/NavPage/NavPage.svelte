<script lang="ts">
  // Author: Shirley
  // Home / navigation page — "Map of Kiwi's Aotearoa Adventure".
  // The kiwi is a controllable character: tap a place to make it walk there,
  // or use the arrow keys / WASD to roam the map freely.
  import bg from '../../assets/Navpage/navi-background.png'
  import titleImg from '../../assets/Navpage/navi-title.png'
  import explorerImg from '../../assets/Navpage/navi-explorer.png'
  import kiwiImg from '../../assets/Navpage/navi-kiwi.png'
  import purakauImg from '../../assets/Navpage/navi-purakau.png'
  import waiataImg from '../../assets/Navpage/navi-waiata.png'
  import tikangaImg from '../../assets/Navpage/navi-tikanga.png'
  import pepehaImg from '../../assets/Navpage/navi-Pepeha.png'
  import settingImg from '../../assets/Navpage/navi-setting.png'
  import rewardImg from '../../assets/Navpage/navi-reward.png'

  type Pt = { x: number; y: number }
  type Loc = {
    id: string
    label: string
    img: string
    icon: Pt // centre of the icon, in % of the map
    stand: Pt // where the kiwi stands when it arrives
    w: number // icon width, in % of the map
  }

  // All coordinates are percentages of the map stage, so the layout scales
  // with the screen. Tweak these to nudge any element on the map.
  const LOCATIONS: Loc[] = [
    { id: 'purakau', label: 'Purākau', img: purakauImg, icon: { x: 29, y: 30 }, stand: { x: 21, y: 38 }, w: 9.6 },
    { id: 'waiata',  label: 'Waiata',  img: waiataImg,  icon: { x: 47, y: 38 }, stand: { x: 47, y: 50 }, w: 9.0 },
    { id: 'pepeha',  label: 'Pepeha',  img: pepehaImg,  icon: { x: 65, y: 57 }, stand: { x: 57, y: 64 }, w: 9.0 },
    { id: 'tikanga', label: 'Tikanga', img: tikangaImg, icon: { x: 33, y: 79 }, stand: { x: 33, y: 90 }, w: 9.0 },
  ]

  let { onnavigate = (_id: string) => {} }: { onnavigate?: (id: string) => void } = $props()

  // --- Kiwi character state -------------------------------------------------
  let kiwi = $state<Pt>({ x: 41, y: 32 }) // starts on the central island
  let facing = $state(1) // 1 = facing right, -1 = facing left
  let walking = $state(false)
  let walkDur = $state(1.2) // seconds for the current walk (scales with distance)
  let active = $state<string | null>(null) // location the kiwi is visiting
  let dest = $state<Pt | null>(null) // current walk target (for the ring)
  let hinted = $state(true) // show the "how to play" hint until first move

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
    // Tapping a place the kiwi has already reached enters it.
    if (active === loc.id && !walking) {
      onnavigate(loc.id)
      return
    }
    active = loc.id
    walkTo(loc.stand)
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

  // --- "Read to me" (Web Speech, optional) ---------------------------------
  let speaking = $state(false)
  function readToMe() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      speaking = false
      return
    }
    const u = new SpeechSynthesisUtterance(
      "Kia ora! Welcome to the Map of Kiwi's Aotearoa Adventure. Tap a place to help Kiwi explore.",
    )
    u.rate = 0.95
    u.onend = () => (speaking = false)
    speaking = true
    window.speechSynthesis.speak(u)
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
    <button class="util setting" onclick={() => onnavigate('setting')} aria-label="Setting">
      <img src={settingImg} alt="" draggable="false" />
    </button>
    <button class="util reward" onclick={() => onnavigate('reward')} aria-label="Reward">
      <img src={rewardImg} alt="" draggable="false" />
    </button>

    <!-- Location markers -->
    {#each LOCATIONS as loc, i (loc.id)}
      <button
        class="marker"
        class:active={active === loc.id}
        style="left:{loc.icon.x}%; top:{loc.icon.y}%; width:{loc.w}%; --i:{i}"
        onclick={() => selectLocation(loc)}
        aria-label={active === loc.id ? `Enter ${loc.label}` : `Walk Kiwi to ${loc.label}`}
      >
        <img src={loc.img} alt={loc.label} draggable="false" />
      </button>
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
    <div
      class="kiwi"
      style="left:{kiwi.x}%; top:{kiwi.y}%; transition: left {walkDur}s cubic-bezier(.45,.05,.35,1), top {walkDur}s cubic-bezier(.45,.05,.35,1)"
    >
      <span class="shadow" class:walking></span>
      <div class="flip" style="transform: scaleX({facing})">
        <div class="bob" class:walking>
          <img src={kiwiImg} alt="Kiwi" draggable="false" />
        </div>
      </div>
    </div>

    <!-- Read to me -->
    <button class="readme" class:on={speaking} onclick={readToMe}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 9v6h4l5 5V4L8 9H4z"
          fill="currentColor"
        />
        <path
          class="wave"
          d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span>{speaking ? 'Stop' : 'Read to me'}</span>
    </button>

    <!-- How-to-play hint -->
    {#if hinted}
      <div class="hint" aria-hidden="true">
        Tap a place — or use the arrow keys — to walk Kiwi
      </div>
    {/if}
  </div>
</div>

<style>
  .wrap {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: clamp(8px, 2vmin, 28px);
    box-sizing: border-box;
    background:
      radial-gradient(120% 90% at 50% 18%, #1f6f8b 0%, #103447 55%, #081b27 100%);
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    overflow: auto;
  }

  .stage {
    position: relative;
    width: min(96vw, calc((100svh - 24px) * (1024 / 652)));
    aspect-ratio: 1024 / 652;
    background-size: cover;
    background-position: center;
    border-radius: clamp(12px, 1.6vmin, 22px);
    box-shadow:
      0 30px 80px -20px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(255, 255, 255, 0.08) inset;
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
    top: 3.5%;
    width: 43%;
    transform: translateX(-50%);
    z-index: 40;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  }

  .explorer {
    position: absolute;
    left: 1.6%;
    top: 4%;
    width: 22%;
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

  /* ---- Location markers ---- */
  .marker {
    position: absolute;
    transform: translate(-50%, -50%);
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
    filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.35));
    animation: float 4.5s ease-in-out infinite;
    animation-delay: calc(var(--i) * -1.1s);
  }
  .marker:hover {
    transform: translate(-50%, -50%) scale(1.09);
    z-index: 13;
  }
  .marker:hover img {
    filter: drop-shadow(0 12px 16px rgba(0, 0, 0, 0.45));
  }
  .marker:active {
    transform: translate(-50%, -50%) scale(0.96);
  }
  .marker:focus-visible {
    outline: none;
  }
  .marker:focus-visible img {
    filter: drop-shadow(0 0 0 4px #ffe9a8) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4));
  }
  .marker.active img {
    filter:
      drop-shadow(0 0 12px rgba(255, 224, 130, 0.95))
      drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4));
    animation: float 4.5s ease-in-out infinite, glow 1.4s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6%); }
  }
  @keyframes glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.78; }
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

  /* ---- The kiwi ---- */
  .kiwi {
    position: absolute;
    width: 6.2%;
    transform: translate(-50%, -86%);
    z-index: 20;
    pointer-events: none;
    will-change: left, top;
  }
  .kiwi img {
    width: 100%;
    display: block;
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.4));
  }
  .kiwi .shadow {
    position: absolute;
    left: 50%;
    bottom: -6%;
    width: 78%;
    aspect-ratio: 3 / 1;
    transform: translateX(-50%);
    background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.4), transparent 72%);
    z-index: -1;
  }
  .kiwi .shadow.walking {
    animation: shadowPulse 0.36s ease-in-out infinite;
  }
  .bob {
    transform-origin: 50% 100%;
    animation: breathe 3.2s ease-in-out infinite;
  }
  .bob.walking {
    animation: bob 0.36s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-13%) rotate(-4deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-13%) rotate(4deg); }
  }
  @keyframes breathe {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-2.5%) scale(1.015); }
  }
  @keyframes shadowPulse {
    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.85; }
    50% { transform: translateX(-50%) scale(0.78); opacity: 0.6; }
  }

  /* ---- Read to me ---- */
  .readme {
    position: absolute;
    left: 2.4%;
    bottom: 4.5%;
    z-index: 40;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.55em 1em 0.55em 0.7em;
    border: 2px solid rgba(255, 255, 255, 0.55);
    border-radius: 999px;
    cursor: pointer;
    color: #15364a;
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(11px, 1.7vmin, 17px);
    background: linear-gradient(180deg, #eaf6ff, #bfe3f5);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.6) inset;
    transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.2s ease;
  }
  .readme svg {
    width: 1.3em;
    height: 1.3em;
    flex: none;
  }
  .readme .wave {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .readme.on {
    background: linear-gradient(180deg, #ffe6a8, #f4c25c);
  }
  .readme.on .wave {
    opacity: 1;
    animation: pulse 1s ease-in-out infinite;
  }
  .readme:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.6) inset;
  }
  .readme:active {
    transform: translateY(0);
  }
  .readme:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: 3px;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
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
    .marker img,
    .marker.active img,
    .bob,
    .bob.walking,
    .shadow.walking,
    .ring,
    .hint,
    .readme.on .wave {
      animation: none !important;
    }
  }
</style>