<!-- Pepeha Module — Page 8: Practise with Kiki (one line at a time, low pressure) -->
<script lang="ts">
  import PepehaScaffold from './PepehaScaffold.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()
</script>

<PepehaScaffold
  pageNo={8}
  title="Practise with Kiki"
  purpose="Listen, say it, and tap 'I tried' — one line at a time. No microphone, no pronunciation judging."
  nextLabel="Help Kiki Remember →"
  {onNext}
  {onBack}
/>