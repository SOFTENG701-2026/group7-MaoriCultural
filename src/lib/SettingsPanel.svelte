<script lang="ts">
  // Author: Shirley
  // The settings panel (FR14). Opened from the map's gear icon and overlaid
  // above whatever page is showing, so the same simple controls work everywhere.
  // Kept friendly for Year 1–3: big buttons, one icon + word per choice, and a
  // tick (not colour alone) marks the active option.
  import { settings, speak, type Volume, type ReadMode, type TextSize } from './settings.svelte'

  const volumes: { id: Volume; label: string; icon: string }[] = [
    { id: 'low', label: 'Low', icon: '🔈' },
    { id: 'medium', label: 'Medium', icon: '🔉' },
    { id: 'high', label: 'High', icon: '🔊' },
  ]
  const readModes: { id: ReadMode; label: string; icon: string }[] = [
    { id: 'tap', label: 'On tap', icon: '👆' },
    { id: 'auto', label: 'Out loud', icon: '🗣️' },
  ]
  const textSizes: { id: TextSize; label: string; icon: string; cls: string }[] = [
    { id: 'normal', label: 'Normal', icon: 'A', cls: 'a-sm' },
    { id: 'large', label: 'Large', icon: 'A', cls: 'a-lg' },
  ]

  function close() {
    settings.open = false
  }

  function onKey(e: KeyboardEvent) {
    if (settings.open && e.key === 'Escape') close()
  }

  // A tiny demo sound so kids hear the volume / sound choice straight away.
  function preview() {
    speak('Kia ora!')
  }
</script>

<svelte:window onkeydown={onKey} />

{#if settings.open}
  <div
    class="set-backdrop"
    role="presentation"
    onclick={(e) => {
      if (e.target === e.currentTarget) close()
    }}
  >
    <div class="set-card" role="dialog" aria-modal="true" aria-labelledby="set-title">
      <div class="set-head">
        <h2 id="set-title">Settings</h2>
        <button class="set-x" onclick={close} aria-label="Close settings">✕</button>
      </div>

      <!-- Sound on/off -->
      <section class="set-row">
        <span class="set-label">🔊 Sound</span>
        <div class="seg" role="group" aria-label="Sound">
          <button class="opt" class:on={settings.soundOn} aria-pressed={settings.soundOn} onclick={() => { settings.soundOn = true; preview() }}>
            <span class="mark" aria-hidden="true">✓</span> On
          </button>
          <button class="opt" class:on={!settings.soundOn} aria-pressed={!settings.soundOn} onclick={() => (settings.soundOn = false)}>
            <span class="mark" aria-hidden="true">✓</span> Off
          </button>
        </div>
      </section>

      <!-- Volume -->
      <section class="set-row" class:dim={!settings.soundOn}>
        <span class="set-label">📶 Volume</span>
        <div class="seg three" role="group" aria-label="Volume">
          {#each volumes as v (v.id)}
            <button
              class="opt"
              class:on={settings.volume === v.id}
              aria-pressed={settings.volume === v.id}
              disabled={!settings.soundOn}
              onclick={() => { settings.volume = v.id; preview() }}
            >
              <span class="ico" aria-hidden="true">{v.icon}</span>
              {v.label}
            </button>
          {/each}
        </div>
      </section>

      <!-- Read to me mode -->
      <section class="set-row">
        <span class="set-label">📖 Read to me</span>
        <div class="seg" role="group" aria-label="Read to me">
          {#each readModes as r (r.id)}
            <button
              class="opt"
              class:on={settings.readMode === r.id}
              aria-pressed={settings.readMode === r.id}
              onclick={() => (settings.readMode = r.id)}
            >
              <span class="ico" aria-hidden="true">{r.icon}</span>
              {r.label}
            </button>
          {/each}
        </div>
      </section>

      <!-- Text size -->
      <section class="set-row">
        <span class="set-label">🔤 Text size</span>
        <div class="seg" role="group" aria-label="Text size">
          {#each textSizes as t (t.id)}
            <button
              class="opt"
              class:on={settings.textSize === t.id}
              aria-pressed={settings.textSize === t.id}
              onclick={() => (settings.textSize = t.id)}
            >
              <span class="ico {t.cls}" aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          {/each}
        </div>
      </section>

      <!-- High contrast -->
      <section class="set-row">
        <span class="set-label">🌗 High contrast</span>
        <div class="seg" role="group" aria-label="High contrast">
          <button class="opt" class:on={settings.highContrast} aria-pressed={settings.highContrast} onclick={() => (settings.highContrast = true)}>
            <span class="mark" aria-hidden="true">✓</span> On
          </button>
          <button class="opt" class:on={!settings.highContrast} aria-pressed={!settings.highContrast} onclick={() => (settings.highContrast = false)}>
            <span class="mark" aria-hidden="true">✓</span> Off
          </button>
        </div>
      </section>

      <button class="set-done" onclick={close}>Done</button>
    </div>
  </div>
{/if}

<style>
  .set-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: grid;
    place-items: center;
    padding: clamp(12px, 4vmin, 40px);
    box-sizing: border-box;
    background: rgba(4, 18, 26, 0.6);
    backdrop-filter: blur(3px);
    overflow: auto;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    animation: fade 0.18s ease-out both;
  }

  .set-card {
    width: min(440px, 100%);
    background: linear-gradient(180deg, #fffaf0, #fbeccc);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 24px;
    padding: clamp(20px, 4vmin, 32px);
    box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.7);
    color: #3a2210;
    animation: pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .set-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .set-head h2 {
    margin: 0;
    font-size: clamp(24px, 4vmin, 32px);
    font-weight: 700;
    color: #7a3d12;
  }
  .set-x {
    width: 2em;
    height: 2em;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    color: #7a3d12;
    background: rgba(217, 185, 138, 0.35);
    transition: background 0.16s ease, transform 0.16s ease;
  }
  .set-x:hover {
    background: rgba(217, 185, 138, 0.6);
    transform: scale(1.08);
  }

  .set-row {
    margin-top: clamp(14px, 2.4vmin, 20px);
  }
  .set-row.dim {
    opacity: 0.5;
  }
  .set-label {
    display: block;
    margin-bottom: 7px;
    font-size: clamp(15px, 2.1vmin, 19px);
    font-weight: 700;
    color: #5a3514;
  }

  .seg {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .seg.three {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .opt {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35em;
    padding: 0.7em 0.5em;
    border: 2.5px solid #e6cfa6;
    border-radius: 14px;
    cursor: pointer;
    background: #fffdf8;
    color: #5a3514;
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(14px, 2vmin, 18px);
    transition: border-color 0.15s ease, background 0.15s ease, transform 0.12s ease;
  }
  .opt:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: #d9a35a;
  }
  .opt:disabled {
    cursor: not-allowed;
  }
  .opt.on {
    border-color: #d97c1d;
    background: #ffe8c2;
    box-shadow: inset 0 0 0 1.5px #d97c1d;
  }
  .opt:focus-visible {
    outline: 3px solid #d97c1d;
    outline-offset: 2px;
  }

  /* The tick only appears on the chosen option, so selection never relies on
     colour alone. */
  .mark {
    width: 1.1em;
    color: #d97c1d;
    opacity: 0;
    font-weight: 900;
  }
  .opt.on .mark {
    opacity: 1;
  }
  .ico {
    font-size: 1.1em;
    line-height: 1;
  }
  .a-sm {
    font-size: 0.95em;
    font-weight: 800;
  }
  .a-lg {
    font-size: 1.45em;
    font-weight: 800;
  }

  .set-done {
    margin-top: clamp(18px, 3vmin, 26px);
    width: 100%;
    padding: 0.8em;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    color: #fff;
    font-family: inherit;
    font-weight: 800;
    font-size: clamp(16px, 2.4vmin, 20px);
    background: linear-gradient(180deg, #f0a93f, #d97c1d);
    box-shadow: 0 8px 18px -4px rgba(217, 124, 29, 0.7);
    transition: transform 0.16s ease, box-shadow 0.16s ease;
  }
  .set-done:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 22px -4px rgba(217, 124, 29, 0.8);
  }
  .set-done:focus-visible {
    outline: 3px solid #d97c1d;
    outline-offset: 3px;
  }

  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pop {
    from { opacity: 0; transform: translateY(8px) scale(0.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .set-backdrop,
    .set-card {
      animation: none !important;
    }
  }
</style>
