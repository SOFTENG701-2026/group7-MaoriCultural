<script lang="ts">
  // Step 3 — Interactive storytelling + scaffolding. One scene per screen
  // (chunking, to keep cognitive load low). Kiki narrates each scene in her AI
  // voice; some scenes end in an interaction the child must complete before the
  // story continues (a 5-prop choice, or a "pull the line" tap game).
  import type { Scene } from '../stories'
  import { speak, narrate } from '../../../lib/settings.svelte'
  import SceneArt from './SceneArt.svelte'
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
  let pulls = $state(0) // progress for the "tap to pull" interaction

  const scene = $derived(scenes[idx])
  const isLast = $derived(idx === scenes.length - 1)
  // Type-narrowed views of the current scene's interaction so the template can
  // safely read .target / .clue etc.
  const propI = $derived(
    scene.interaction?.kind === 'prop' ? scene.interaction : null,
  )
  const tapI = $derived(scene.interaction?.kind === 'tap' ? scene.interaction : null)
  const needsSolve = $derived(!!scene.interaction && !solved[scene.id])
  const narration = $derived(scene.narration.join(' '))
  const tugPips = $derived(tapI ? Array.from({ length: tapI.target }, (_, i) => i) : [])

  // Narrate each scene on entry — only in "Out loud" mode. Prop scenes stay
  // quiet here so PropPicker can voice its prompt/clue without being cut off.
  $effect(() => {
    const s = scenes[idx]
    if (s && s.interaction?.kind !== 'prop') narrate(s.narration.join(' '))
  })

  // Reset the pull counter whenever the scene changes.
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
      markSolved() // advance FIRST — never gated by speech
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
  <!-- Scene progress -->
  <div class="progress" aria-label={`Scene ${idx + 1} of ${scenes.length}`}>
    {#each scenes as s, i (s.id)}
      <span class="pip" class:on={i === idx} class:seen={i < idx}></span>
    {/each}
  </div>

  <!-- Illustration + narration, side by side on wide screens -->
  <div class="top">
    <div class="art-card">
      {#key scene.id}
        <div class="art-inner"><SceneArt art={scene.art} /></div>
      {/key}
    </div>

    {#key scene.id}
      <div class="story-page fade-in">
        <button class="page-read" onclick={() => speak(narration)} aria-label="Read this part again">🔊</button>
        {#each scene.narration as para}
          <p class="lead">{para}</p>
        {/each}
      </div>
    {/key}
  </div>

  <!-- End-of-scene interaction -->
  {#if propI}
    <div class="interaction fade-in">
      <PropPicker interaction={propI} onCorrect={markSolved} />
    </div>
  {:else if tapI}
    <div class="interaction tap-game fade-in">
      {#if solved[scene.id]}
        <KiwiGuide pose="yes" text={tapI.cheer} />
      {:else}
        <KiwiGuide pose="think" text={tapI.prompt} />
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
      {/if}
    </div>
  {/if}

  <!-- Bottom nav -->
  <nav class="bottom-nav">
    <button class="pill ghost" onclick={back}>← Back</button>
    <ReadToMe text={narration} />
    <button class="pill cta" onclick={next} disabled={needsSolve}>
      {isLast ? 'Finish reading →' : 'Next →'}
    </button>
  </nav>

  {#if needsSolve}
    <p class="locked-note">Help Kiki finish this part to keep reading.</p>
  {/if}
</div>

<style>
  .scenes {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding-bottom: 92px;
  }

  .progress { display: flex; gap: 8px; }
  .pip { width: 12px; height: 12px; border-radius: 50%; background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); transition: background 0.3s, transform 0.3s; }
  .pip.on { background: #f5a623; transform: scale(1.25); }
  .pip.seen { background: #4caf50; }

  /* Illustration + narration sit side by side on wide screens so the
     end-of-scene interaction stays visible without scrolling. */
  .top {
    display: flex;
    gap: 16px;
    width: 100%;
    align-items: flex-start;
  }
  @media (max-width: 820px) {
    .top { flex-direction: column; align-items: stretch; }
  }

  .art-card {
    flex: 1 1 48%;
    min-width: 0;
    border: 6px solid #9c6b34;
    border-radius: 20px;
    background: #9c6b34;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 3px rgba(255, 255, 255, 0.18);
    overflow: hidden;
  }
  .art-inner { width: 100%; animation: artIn 0.5s ease both; }
  @keyframes artIn { from { opacity: 0; transform: scale(1.03); } to { opacity: 1; transform: scale(1); } }

  .story-page {
    position: relative;
    flex: 1 1 52%;
    min-width: 0;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(255, 252, 245, 0.97);
    border-radius: 20px;
    padding: 20px 24px 20px 50px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
    text-align: left;
    box-sizing: border-box;
  }
  .story-page .lead {
    margin: 0 0 10px;
    color: #2c2440;
    font-size: clamp(16px, 2vw, 22px);
    font-weight: 600;
    line-height: 1.55;
  }
  .story-page .lead:last-child { margin-bottom: 0; }
  .page-read {
    position: absolute;
    top: 16px;
    left: 14px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: #f1ecff;
    color: #6a3bd0;
    font-size: 15px;
    cursor: pointer;
  }
  .page-read:hover { background: #e4d8ff; }
  .page-read:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }

  .interaction { width: 100%; display: flex; flex-direction: column; gap: 14px; }

  /* Tap-to-pull mini-interaction */
  .tap-game { align-items: center; }
  .pull-target {
    border: none;
    background: radial-gradient(circle at 50% 35%, #fff3d6, #f3c46a);
    width: 150px;
    height: 150px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    transition: transform 0.08s ease;
  }
  .pull-target:hover { transform: scale(1.04); }
  .pull-target:active { transform: scale(0.92); }
  .pull-target.tug { animation: tug 0.18s ease; }
  .pull-target:focus-visible { outline: 4px solid #aa3bff; outline-offset: 3px; }
  .rope { font-size: 56px; line-height: 1; }
  .pull-label { font-family: 'Baloo 2', system-ui, sans-serif; font-weight: 900; color: #8a5a00; font-size: 20px; }
  @keyframes tug { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(6px) scale(0.95); } 100% { transform: translateY(0) scale(1); } }

  .tug-meter { display: flex; gap: 8px; }
  .tug-pip { width: 26px; height: 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.6); box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12); transition: background 0.2s; }
  .tug-pip.on { background: #4caf50; }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    padding: 12px 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .pill {
    border: none;
    border-radius: 100px;
    padding: 14px 30px;
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transition: transform 0.12s, box-shadow 0.12s;
    white-space: nowrap;
    outline: none;
  }
  .pill:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28); }
  .pill:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }
  .ghost { background: #fff; color: #333; }
  .cta { background: linear-gradient(180deg, #ffd24a, #f5a623); color: #2c1600; }
  .cta:disabled { background: #d3cbbe; color: #7c7468; cursor: not-allowed; transform: none; box-shadow: none; }

  .locked-note {
    position: fixed;
    bottom: 74px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    background: rgba(138, 90, 0, 0.9);
    padding: 5px 16px;
    border-radius: 999px;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .art-inner, .pull-target.tug { animation: none !important; }
  }
</style>
