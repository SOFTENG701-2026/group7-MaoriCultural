<script lang="ts">
  import IntroductionPage from './pages/SongPages/IntroductionPage/index.svelte';
  import PlayMusicPage from './pages/SongPages/PlayMusicPage/index.svelte';

  let page = $state<'intro' | 'play'>('intro');
</script>

{#if page === 'intro'}
  <IntroductionPage onStart={() => { page = 'play'; }} />
{:else if page === 'play'}
  <PlayMusicPage onBack={() => { page = 'intro'; }} onNext={() => { page = 'intro'; }} />
{/if}

<style>
  :global(*, *::before, *::after) { margin: 0; padding: 0; box-sizing: border-box; }
  :global(html, body) { width: 100%; height: 100%; overflow: hidden; }
</style>