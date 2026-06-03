<!--
  Pepeha module — shared page scaffold.

  This is a placeholder shell used while the module is being built out. Each of
  the 10 Pepeha pages renders its title, purpose, a level badge, and standard
  navigation (Back / Next / Read to me). Real interactive content goes in the
  `children` snippet as each page is implemented.

  See docs/Pepeha_requirements.md for the full per-page spec.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { pepehaState } from '../../lib/pepehaState.svelte'
  import ReadToMe from '../../lib/ReadToMe.svelte'

  interface Props {
    pageNo: number
    title: string
    purpose: string
    readText?: string
    nextLabel?: string
    onNext?: () => void
    onBack?: () => void
    onMap?: () => void
    children?: Snippet
  }
  let {
    pageNo,
    title,
    purpose,
    readText,
    nextLabel = 'Next →',
    onNext,
    onBack,
    onMap,
    children,
  }: Props = $props()
</script>

<div class="pepeha-stage">
  <header class="pepeha-head">
    <span class="page-tag">Page {pageNo} / 10</span>
    <span class="level-tag">{pepehaState.level === 'beginner' ? 'Beginner Level' : 'Confident Level'}</span>
  </header>

  <h1 class="pepeha-title">{title}</h1>
  <p class="pepeha-purpose">{purpose}</p>

  <main class="pepeha-body">
    {#if children}
      {@render children()}
    {:else}
      <div class="placeholder">
        <span class="placeholder-emoji">🧩</span>
        <p>Content for this page is not built yet.</p>
        <p class="placeholder-sub">Scaffold ready — implementation to follow.</p>
      </div>
    {/if}
  </main>

  <nav class="pepeha-nav">
    <div class="nav-left">
      {#if onBack}
        <button class="nav-btn" onclick={onBack}>← Back</button>
      {/if}
      {#if onMap}
        <button class="nav-btn" onclick={onMap}>🗺️ Back to Map</button>
      {/if}
      <ReadToMe text={readText ?? `${title}. ${purpose}`} />
    </div>
    <div class="nav-right">
      {#if onNext}
        <button class="nav-btn nav-next" onclick={onNext}>{nextLabel}</button>
      {/if}
    </div>
  </nav>
</div>

<style>
  .pepeha-stage {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 24px clamp(16px, 4vw, 48px);
    box-sizing: border-box;
    background: linear-gradient(160deg, #eaf6ff 0%, #f6fbf2 60%, #fff7ec 100%);
    font-family: 'Nunito', system-ui, sans-serif;
    color: #1a3000;
    overflow: hidden;
  }

  .pepeha-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-tag, .level-tag {
    font-size: clamp(12px, 1.4vw, 15px);
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 999px;
  }
  .page-tag  { background: rgba(0,0,0,0.06); color: #3a4a2a; }
  .level-tag { background: #F5A623; color: #fff; }

  .pepeha-title {
    margin: 16px 0 4px;
    font-size: clamp(26px, 4vw, 42px);
    font-weight: 900;
    color: #1a5c00;
  }
  .pepeha-purpose {
    margin: 0;
    font-size: clamp(15px, 1.8vw, 20px);
    font-weight: 600;
    color: #44603a;
    max-width: 70ch;
  }

  .pepeha-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .placeholder {
    text-align: center;
    color: #6b7a5e;
    background: rgba(255,255,255,0.6);
    border: 2px dashed rgba(0,0,0,0.15);
    border-radius: 24px;
    padding: 40px 56px;
  }
  .placeholder-emoji { font-size: 56px; display: block; margin-bottom: 12px; }
  .placeholder p { margin: 4px 0; font-size: clamp(16px, 2vw, 22px); font-weight: 700; }
  .placeholder-sub { font-weight: 600 !important; opacity: 0.7; font-size: 15px !important; }

  .pepeha-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  .nav-left, .nav-right { display: flex; gap: 12px; align-items: center; }

  .nav-btn {
    font-family: inherit;
    font-size: clamp(15px, 1.8vw, 18px);
    font-weight: 800;
    padding: 12px 22px;
    border-radius: 16px;
    border: none;
    background: #ffffff;
    color: #1a5c00;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.2s ease;
  }
  .nav-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.18); }
  .nav-btn:active { transform: translateY(0); }
  .nav-next { background: #1a5c00; color: #fff; }
</style>