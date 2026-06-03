<!-- Pepeha Module — Page 4: Find the Maunga (tap the mountain, collect sticker) -->
<script lang="ts">
  import PepehaScaffold from './PepehaScaffold.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()
</script>

<PepehaScaffold
  pageNo={4}
  title="Find the Maunga"
  purpose="Maunga means mountain. Tap the mountain to reveal Kiki's school maunga, then add the sticker."
  nextLabel="Find Awa →"
  {onNext}
  {onBack}
/>