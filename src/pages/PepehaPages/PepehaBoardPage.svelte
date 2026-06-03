<!-- Pepeha Module — Page 7: Kiki's Pepeha Board (all four pieces combined) -->
<script lang="ts">
  import PepehaScaffold from './PepehaScaffold.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()
</script>

<PepehaScaffold
  pageNo={7}
  title="Kiki's Pepeha Board"
  purpose="See all four collected pieces as one completed practice pepeha. Kiki's board is a practice example."
  nextLabel="Practise with Kiki →"
  {onNext}
  {onBack}
/>