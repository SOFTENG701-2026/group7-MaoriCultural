<!-- Pepeha Module — Page 9: Help Kiki Remember (playful sticker check, no scoring) -->
<script lang="ts">
  import PepehaScaffold from './PepehaScaffold.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()
</script>

<PepehaScaffold
  pageNo={9}
  title="Help Kiki Remember"
  purpose="A playful sticker check — tap the right answer. No score, no grade, gentle retry."
  nextLabel="Finish →"
  {onNext}
  {onBack}
/>