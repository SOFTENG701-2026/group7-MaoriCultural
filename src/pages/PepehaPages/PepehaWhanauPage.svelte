<!-- Pepeha Module — Page 6: Whānau Circle Stickers (choose 2–3 caring-people stickers) -->
<script lang="ts">
  import PepehaScaffold from './PepehaScaffold.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()
</script>

<PepehaScaffold
  pageNo={6}
  title="Kiki's Whānau Circle"
  purpose="Whānau means people who care for us. Choose 2–3 stickers for Kiki's circle — no family names needed."
  nextLabel="Add to Board →"
  {onNext}
  {onBack}
/>