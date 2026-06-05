<script lang="ts">
  // Step 3 — Interactive storytelling. The PNG illustration fills the entire
  // player area (object-fit: contain — never cropped). Narration, progress, and
  // interactions float on top with translucent backdrops so the image stays
  // visible at maximum size.
  import type { Scene } from '../stories'
  import { SCENE_IMAGES } from '../assets'
  import { narrate } from '../../../lib/settings.svelte'
  import KiwiGuide from './KiwiGuide.svelte'
  import PropPicker from './PropPicker.svelte'
  import ReadToMe from '../../../lib/ReadToMe.svelte'

  interface Props {
    scenes: Scene[]
    onFinish: () => void
    onBack: () => void
  }
  let { scenes, onFinish, onBack }: Props = $props()

  let idx = $state(0)
  let solved = $state<Record<string, boolean>>({})
  let pulls = $state(0)

  const scene = $derived(scenes[idx])
  const image = $derived(SCENE_IMAGES[scene.image])
  const isLast = $derived(idx === scenes.length - 1)
  const propI = $derived(
    scene.interaction?.kind === 'prop' ? scene.interaction : null,
  )
  const tapI = $derived(scene.interaction?.kind === 'tap' ? scene.interaction : null)
  const needsSolve = $derived(!!scene.interaction && !solved[scene.id])
  const narration = $derived(scene.narration.join(' '))
  const tugPips = $derived(tapI ? Array.from({ length: tapI.target }, (_, i) => i) : [])

  // Narrate on entry (prop scenes stay quiet so PropPicker voices its prompt).
  $effect(() => {
    const s = scenes[idx]
    if (s && s.interaction?.kind !== 'prop') narrate(s.narration.join(' '))
  })

  $effect(() => {
    idx
    pulls = 0
  })

  function markSolved() {
    solved = { ...solved, [scene.id]: true }
  }

  function pull() {
    const it = scene.interaction
    if (!it || it.kind !== 'tap' || solved[scene.id]) return
    pulls += 1
    if (pulls >= it.target) {
      markSolved()
      narrate(it.cheer)
    }
  }

  function next() {
    if (needsSolve) return
    if (isLast) onFinish()
    else idx += 1
  }
  function back() {
    if (idx > 0) idx -= 1
    else onBack()
  }
</script>

<div class="scenes">
  <!-- Full-area illustration — the entire backdrop, never cropped -->
  <div class="image-layer">
    {#key scene.id}
      <img class="full-img" src={image} alt="" draggable="false" />
    {/key}
  </div>

  <!-- Progress pips float at top -->
  <div class="progress" aria-label={`Scene ${idx + 1} of ${scenes.length}`}>
    {#each scenes as s, i (s.id)}
      <span class="pip" class:on={i === idx} class:seen={i < idx}></span>
    {/each}
  </div>

  <!-- Narration overlay at bottom — gradient backdrop for readability -->
  {#key scene.id}
    <div class="narration-overlay" class:top-left={scene.id === 'island'}>
      {#each scene.narration as para}
        <p class="lead">{para}</p>
      {/each}
    </div>
  {/key}

  <!-- Interaction floats at top over the image -->
  {#if propI}
    <div class="interaction-area" class:right={scene.id === 'reveal'}>
      <PropPicker interaction={propI} onCorrect={markSolved} />
    </div>
  {:else if tapI}
    {#if solved[scene.id]}
      <div class="interaction-area tap-area split">
        <div class="tap-left">
          <KiwiGuide pose="yes" text={tapI.cheer} />
        </div>
      </div>
    {:else}
      <div class="interaction-area tap-area split">
        <div class="tap-left">
          <KiwiGuide pose="think" text={tapI.prompt} />
        </div>
        <div class="tap-right">
          <button
            class="pull-target"
            class:tug={pulls > 0}
            onclick={pull}
            aria-label={`Pull the line. ${pulls} of ${tapI.target} pulls.`}
          >
            <span class="rope">🪝</span>
            <span class="pull-label">PULL!</span>
          </button>
          <div class="tug-meter" aria-hidden="true">
            {#each tugPips as i}
              <span class="tug-pip" class:on={i < pulls}></span>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  {/if}

  {#if needsSolve}
    <p class="locked-note">Help Kiki finish this part to keep reading.</p>
  {/if}

  <!-- Bottom nav floats above image -->
  <nav class="bottom-nav">
    <button class="pill ghost" onclick={back}>← Back</button>
    <ReadToMe text={narration} />
    <button class="pill cta" onclick={next} disabled={needsSolve}>
      {isLast ? 'Finish reading →' : 'Next →'}
    </button>
  </nav>
</div>

<style>
  .scenes {
    position: relative;
    width: 100%;
    height: 100%;
    isolation: isolate;
  }

  /* ── Full-viewport background image ── */
  .image-layer {
    position: fixed;
    inset: 0;
    z-index: 0;
  }
  .full-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    animation: fadeIn 0.5s ease both;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.75); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(60px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.3); }
    50% { transform: scale(1.08); }
    70% { transform: scale(0.94); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
    50% { transform: scale(1.05); box-shadow: 0 12px 32px rgba(245, 166, 35, 0.5); }
  }

  /* ── Progress pips ── */
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 2;
    pointer-events: none;
  }
  .pip { width: 11px; height: 11px; border-radius: 50%; background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35); transition: background 0.3s, transform 0.3s; }
  .pip.on { background: #f5a623; transform: scale(1.25); }
  .pip.seen { background: #4caf50; }

  /* ── Narration overlay ── */
  .narration-overlay {
    position: absolute;
    bottom: 62px;
    left: 0;
    right: 0;
    max-height: 22vh;
    overflow-y: auto;
    padding: 10px 18px 8px;
    background: rgba(8, 10, 20, 0.65);
    border-radius: 0;
    z-index: 2;
    animation: fadeIn 0.4s ease both;
  }
  .narration-overlay .lead {
    margin: 0 0 2px;
    color: #fff;
    font-size: clamp(15px, 2vw, 20px);
    font-weight: 600;
    line-height: 1.38;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  }
  .narration-overlay .lead:last-child { margin-bottom: 0; }
  .narration-overlay.top-left {
    bottom: auto;
    top: 36px;
    left: 0;
    right: auto;
    width: min(55vw, 620px);
    max-height: 40vh;
    border-radius: 0 12px 12px 0;
  }

  /* ── Interaction area — floats at top, no wrapper card ── */
  .interaction-area {
    position: absolute;
    top: 36px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    width: min(94vw, 720px);
    animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .interaction-area.right {
    position: fixed;
    left: auto;
    right: 6px;
    top: 32px;
    transform: none;
    width: auto;
    max-width: 32vw;
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) both;
  }
  .interaction-area.right :global(.kiki) {
    flex-direction: row-reverse;
  }
  .interaction-area.right :global(.bubble .lead) {
    font-size: clamp(12px, 1.3vw, 15px);
  }
  .interaction-area.right :global(.kiwi) {
    width: clamp(50px, 9vw, 80px) !important;
  }
  .interaction-area.right :global(.picker) {
    align-items: flex-end;
  }
  .interaction-area.right :global(.tray) {
    margin: 0;
    gap: 4px;
    max-width: 100%;
  }
  .interaction-area.right :global(.slot) {
    padding: 4px 2px 2px;
    aspect-ratio: 1 / 0.8;
    background-color: transparent !important;
    border-radius: 14px;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
    opacity: 0;
    animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .interaction-area.right :global(.slot:nth-child(1)) { animation-delay: 0.05s; }
  .interaction-area.right :global(.slot:nth-child(2)) { animation-delay: 0.12s; }
  .interaction-area.right :global(.slot:nth-child(3)) { animation-delay: 0.19s; }
  .interaction-area.right :global(.slot:nth-child(4)) { animation-delay: 0.26s; }
  .interaction-area.right :global(.slot:nth-child(5)) { animation-delay: 0.33s; }
  .interaction-area.right :global(.prop) {
    height:65%;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.25));
  }
  .interaction-area.right :global(.name) {
    font-size: clamp(13px, 1.6vw, 18px);
    color: #fff;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.75), 0 1px 2px rgba(0, 0, 0, 0.85), 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  .tap-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .tap-area.split {
    position: relative;
    width: 100%;
    max-width: none;
    left: 0;
    right: 0;
    top: 20px;
    transform: none;
    display: block;
  }
  .tap-left {
    position: absolute;
    left: 4px;
    top: 2vh;
    max-width: 55vw;
    animation: popIn 0.4s 0.05s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .tap-right {
    position: absolute;
    right: 30vw;
    top: 33vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    animation: bounceIn 0.5s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  /* Tap-to-pull */
  .pull-target {
    border: none;
    background: radial-gradient(circle at 50% 35%, #fff3d6, #f3c46a);
    width: clamp(84px, 12vh, 110px);
    height: clamp(84px, 12vh, 110px);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    transition: transform 0.08s ease;
    animation: bounceIn 0.5s 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both, pulse 2.4s 0.8s ease-in-out infinite;
  }
  .pull-target:hover { transform: scale(1.04); }
  .pull-target:active { transform: scale(0.92); }
  .pull-target.tug { animation: tug 0.18s ease; }
  .pull-target:focus-visible { outline: 4px solid #fff; outline-offset: 3px; }
  .rope { font-size: clamp(32px, 6vh, 44px); line-height: 1; }
  .pull-label { font-family: 'Fredoka', system-ui, sans-serif; font-weight: 900; color: #8a5a00; font-size: clamp(13px, 2vh, 17px); }
  @keyframes tug { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(6px) scale(0.95); } 100% { transform: translateY(0) scale(1); } }

  .tug-meter { display: flex; gap: 8px; }
  .tug-pip { width: 22px; height: 10px; border-radius: 5px; background: rgba(255, 255, 255, 0.6); box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12); transition: background 0.2s; }
  .tug-pip.on { background: #4caf50; }

  .locked-note {
    position: absolute;
    top: 28px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    margin: 0;
    font-size: clamp(15px, 2vw, 20px);
    font-weight: 700;
    color: #fff;
    background: rgba(138, 90, 0, 0.9);
    padding: 6px 20px;
    border-radius: 999px;
    pointer-events: none;
  }

  /* ── Bottom nav ── */
  .bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 6px 12px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    z-index: 3;
    background: linear-gradient(to top, rgba(8, 10, 20, 0.28), transparent);
    box-sizing: border-box;
  }
  .pill {
    border: none;
    border-radius: 100px;
    padding: 12px 26px;
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.12s, box-shadow 0.12s;
    white-space: nowrap;
    outline: none;
  }
  .pill:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2); }
  .pill:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
  .ghost { background: rgba(255, 255, 255, 0.9); color: #333; }
  .cta { background: linear-gradient(180deg, #ffd24a, #f5a623); color: #2c1600; }
  .cta:disabled { background: rgba(180, 175, 160, 0.8); color: #7c7468; cursor: not-allowed; transform: none; box-shadow: none; }

  @media (prefers-reduced-motion: reduce) {
    .full-img, .narration-overlay, .interaction-area, .pull-target.tug { animation: none !important; }
  }
</style>
