<!-- Pepeha Module — Page 5: Find the Awa (tap the river, collect sticker) -->
<script lang="ts">
  import PepehaScaffold from './PepehaScaffold.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()
</script>

<PepehaScaffold
  pageNo={5}
  title="Find the Awa"
  purpose="Awa means river. Follow the water to reveal Kiki's school awa, then add the sticker."
  nextLabel="Whānau Circle →"
  {onNext}
  {onBack}
/>