<script lang="ts">
  // Step 4 — Sequencing mini-game (experiential learning: retell the story).
  // The core scenes are shuffled and the child puts them back in order. Three
  // input methods so it works for every child + assistive tech:
  //   • drag a card onto another to swap (mouse + most desktops),
  //   • tap one card then another to swap (touch),
  //   • focus a card and press Enter to pick up / ← → to move (keyboard).
  // When the order is correct, the cards play through in sequence as a short
  // animation — the "watch your story come alive" bonus.
  import { untrack } from 'svelte'
  import type { Scene } from '../stories'
  import { speak } from '../../../lib/settings.svelte'
  import { rebuilderSign } from '../assets'
  import SceneArt from './SceneArt.svelte'

  interface Props {
    scenes: Scene[] // in the correct chronological order
    onSolved: () => void
  }
  let { scenes, onSolved }: Props = $props()

  function shuffled(src: Scene[]): Scene[] {
    const a = [...src]
    // Reshuffle until it isn't already in order (and isn't a no-op for n>1).
    let guard = 0
    do {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
    } while (++guard < 20 && a.every((s, i) => s.id === src[i].id))
    return a
  }

  // Shuffle the (stable) scene list once on mount; `untrack` documents that we
  // intentionally capture the initial value rather than re-shuffle on change.
  let order = $state<Scene[]>(untrack(() => shuffled(scenes)))
  let selectedIdx = $state<number | null>(null)
  let dragIdx = $state<number | null>(null)
  let solved = $state(false)

  // Playback overlay state.
  let watching = $state(false)
  let playIdx = $state(0)
  let timer: ReturnType<typeof setInterval> | undefined

  const isCorrect = $derived(order.every((s, i) => s.id === scenes[i].id))

  function swap(i: number, j: number) {
    if (i === j) return
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    order = next
    selectedIdx = null
    queueMicrotask(check)
  }

  function check() {
    if (!solved && isCorrect) {
      solved = true
      speak('Ka pai! You put the whole story in order. Now watch it come alive!')
      onSolved()
    }
  }

  // ── Tap-to-swap (touch + click) ──
  function tap(i: number) {
    if (solved) return
    if (selectedIdx === null) selectedIdx = i
    else if (selectedIdx === i) selectedIdx = null
    else swap(selectedIdx, i)
  }

  // ── Keyboard ──
  function onKey(e: KeyboardEvent, i: number) {
    if (solved) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      tap(i)
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault()
      swap(i, i - 1)
      focusSlot(i - 1)
    } else if (e.key === 'ArrowRight' && i < order.length - 1) {
      e.preventDefault()
      swap(i, i + 1)
      focusSlot(i + 1)
    }
  }
  function focusSlot(i: number) {
    queueMicrotask(() => {
      document.getElementById(`seq-slot-${i}`)?.focus()
    })
  }

  // ── HTML5 drag-and-drop ──
  function onDragStart(e: DragEvent, i: number) {
    if (solved) return
    dragIdx = i
    selectedIdx = null
    e.dataTransfer?.setData('text/plain', String(i)) // Firefox needs data
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  }
  function onDrop(e: DragEvent, j: number) {
    e.preventDefault()
    if (dragIdx !== null) swap(dragIdx, j)
    dragIdx = null
  }

  // ── Playback ──
  function watch() {
    stop()
    watching = true
    playIdx = 0
    timer = setInterval(() => {
      if (playIdx >= scenes.length - 1) {
        stop()
        return
      }
      playIdx += 1
    }, 1900)
  }
  function stop() {
    if (timer) clearInterval(timer)
    timer = undefined
  }
  function closeWatch() {
    stop()
    watching = false
  }
  $effect(() => () => stop()) // cleanup on unmount
</script>

<div class="seq">
  <img class="sign" src={rebuilderSign} alt="Story Rebuilder" />

  {#if !solved}
    <p class="how lead">Put the story back in order. Drag a picture, or tap two to swap them.</p>
  {:else}
    <p class="how done lead">✓ Ka pai! Your story is in order. Tap “Watch the story!”</p>
  {/if}

  <ol class="slots" class:solved>
    {#each order as scene, i (scene.id)}
      <li class="slot-wrap">
        <span class="num" class:lit={solved || scene.id === scenes[i].id}>{i + 1}</span>
        <button
          id="seq-slot-{i}"
          class="card"
          class:selected={selectedIdx === i}
          class:placed={scene.id === scenes[i].id}
          class:dragging={dragIdx === i}
          draggable={!solved}
          aria-label={`Picture ${i + 1}: ${scene.caption}. ${solved ? '' : 'Drag, or press Enter to pick up and Enter again on another to swap.'}`}
          onclick={() => tap(i)}
          onkeydown={(e) => onKey(e, i)}
          ondragstart={(e) => onDragStart(e, i)}
          ondragover={(e) => e.preventDefault()}
          ondrop={(e) => onDrop(e, i)}
          ondragend={() => (dragIdx = null)}
          disabled={solved}
        >
          <span class="art"><SceneArt art={scene.art} animate={false} /></span>
          <span class="cap">{scene.caption}</span>
        </button>
      </li>
    {/each}
  </ol>

  {#if solved}
    <button class="watch-btn" onclick={watch}>▶ Watch the story!</button>
  {/if}
</div>

<!-- Playback overlay: the ordered scenes play through in sequence. -->
{#if watching}
  <div class="player-overlay" role="dialog" aria-modal="true" aria-label="Story playback">
    <div class="player-card">
      {#key playIdx}
        <div class="play-art"><SceneArt art={scenes[playIdx].art} /></div>
        <p class="play-cap">{scenes[playIdx].caption}</p>
      {/key}
      <div class="dots">
        {#each scenes as s, i (s.id)}
          <span class="dot" class:on={i === playIdx} class:seen={i < playIdx}></span>
        {/each}
      </div>
      {#if playIdx >= scenes.length - 1}
        <div class="play-actions">
          <button class="ghost" onclick={watch}>↺ Replay</button>
          <button class="cta" onclick={closeWatch}>Looks great! →</button>
        </div>
      {:else}
        <button class="skip" onclick={closeWatch}>Skip ✕</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .seq {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 100%;
  }
  .sign {
    width: min(360px, 60%);
    height: auto;
    filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.3));
    animation: drop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .how {
    margin: 0;
    font-weight: 700;
    color: #4a3a1a;
    background: rgba(255, 255, 255, 0.82);
    padding: 8px 18px;
    border-radius: 999px;
    text-align: center;
  }
  .how.done { color: #1f7a32; background: rgba(232, 255, 236, 0.92); }

  .slots {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    width: 100%;
    max-width: 920px;
  }
  @media (max-width: 760px) {
    .slots { grid-template-columns: repeat(2, 1fr); }
  }

  .slot-wrap { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; }

  .num {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #d9c3a0;
    color: #6b4a22;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 900;
    font-size: 16px;
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.15);
    transition: background 0.3s ease, color 0.3s ease;
  }
  .num.lit { background: #4caf50; color: #fff; }

  .card {
    position: relative;
    width: 100%;
    padding: 8px;
    border: 5px solid #9c6b34;
    border-radius: 16px;
    background: linear-gradient(160deg, #c89255, #a06d34);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28), inset 0 0 0 2px rgba(255, 255, 255, 0.18);
    cursor: grab;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.25s ease;
    outline: none;
    font-family: inherit;
  }
  .card:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.32); }
  .card:active { cursor: grabbing; }
  .card:focus-visible { outline: 3px solid #aa3bff; outline-offset: 3px; }
  .card.selected { border-color: #ffcf3f; box-shadow: 0 0 0 4px rgba(255, 207, 63, 0.7), 0 10px 22px rgba(0, 0, 0, 0.3); transform: translateY(-4px); }
  .card.dragging { opacity: 0.45; }
  .card.placed { border-color: #4caf50; }
  .card:disabled { cursor: default; }

  .art {
    display: block;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    pointer-events: none; /* so drag targets the card, not the inner art */
  }
  .cap {
    font-size: clamp(11px, 1.3vw, 14px);
    font-weight: 800;
    color: #fff5e3;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    line-height: 1.25;
    text-align: center;
    pointer-events: none;
  }

  .watch-btn {
    border: none;
    border-radius: 999px;
    padding: 16px 40px;
    font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #2c1600;
    background: linear-gradient(180deg, #ffd24a, #f5a623);
    box-shadow: 0 6px 18px rgba(245, 166, 35, 0.5);
    cursor: pointer;
    animation: breathe 2s ease-in-out infinite;
  }
  .watch-btn:hover { transform: translateY(-2px); }
  .watch-btn:focus-visible { outline: 3px solid #aa3bff; outline-offset: 3px; }

  /* ── Playback overlay ── */
  .player-overlay {
    position: fixed;
    inset: 0;
    z-index: 120;
    background: rgba(8, 18, 30, 0.78);
    display: grid;
    place-items: center;
    padding: 20px;
    animation: fade 0.25s ease both;
  }
  .player-card {
    background: #fff8ea;
    border-radius: 24px;
    padding: 18px;
    width: min(680px, 94vw);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .play-art {
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    animation: kenburns 1.9s ease both;
  }
  .play-cap {
    margin: 0;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 800;
    font-size: clamp(18px, 2.6vw, 26px);
    color: #3a2410;
    text-align: center;
    animation: rise 0.5s ease both;
  }
  .dots { display: flex; gap: 8px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: #e0d2ba; transition: background 0.3s; }
  .dot.on { background: #f5a623; transform: scale(1.2); }
  .dot.seen { background: #4caf50; }

  .play-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  .cta {
    border: none; border-radius: 999px; padding: 14px 32px;
    font-family: inherit; font-size: 18px; font-weight: 800; cursor: pointer;
    background: linear-gradient(180deg, #ffd24a, #f5a623); color: #2c1600;
    box-shadow: 0 6px 16px rgba(245, 166, 35, 0.5);
  }
  .cta:hover { transform: translateY(-2px); }
  .ghost {
    border: 2.5px solid #c89255; border-radius: 999px; padding: 12px 26px;
    font-family: inherit; font-size: 16px; font-weight: 700; cursor: pointer;
    background: #fff; color: #6b4a22;
  }
  .skip {
    border: none; background: rgba(0, 0, 0, 0.12); color: #5a4630;
    border-radius: 999px; padding: 8px 20px; font-size: 14px; font-weight: 700; cursor: pointer;
  }
  .cta:focus-visible, .ghost:focus-visible, .skip:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }

  @keyframes drop { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes kenburns { from { transform: scale(1.06); } to { transform: scale(1); } }

  @media (prefers-reduced-motion: reduce) {
    .sign, .watch-btn, .play-art, .play-cap { animation: none !important; }
  }
</style>
