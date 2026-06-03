<!-- Pepeha Module — Page 10: Reward Page (badge + return to real-world learning) -->
<script lang="ts">
  import PepehaScaffold from './PepehaScaffold.svelte'

  interface Props {
    onMap: () => void
    onBack: () => void
  }
  let { onMap, onBack }: Props = $props()
</script>

<PepehaScaffold
  pageNo={10}
  title="Pepeha Complete!"
  purpose="Celebrate completion and unlock Kiki's Pepeha Badge. Your own pepeha belongs to your story."
  {onMap}
  {onBack}
/>