<script lang="ts">
  import Router from 'svelte-spa-router';
  import routes from './routes';
  import { settings } from './lib/settings.svelte';
  import SettingsPanel from './lib/SettingsPanel.svelte';

  // Reflect the accessibility choices on <html> so the global rules in
  // accessibility.css apply on every page (map, Waiata songs, quizzes).
  $effect(() => {
    const root = document.documentElement;
    root.classList.toggle('hc', settings.highContrast);
    root.classList.toggle('big-text', settings.textSize === 'large');
  });

  // Persist whenever any setting changes.
  $effect(() => {
    try {
      localStorage.setItem('mca-settings', JSON.stringify(settings.toJSON()));
    } catch {
      // Private mode / storage disabled — settings simply won't persist.
    }
  });
</script>

<Router {routes} />

<!-- Global settings panel — opened from the map's gear icon, overlays any page. -->
<SettingsPanel />
