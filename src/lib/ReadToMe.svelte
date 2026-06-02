<script lang="ts">
  import { speak } from './settings.svelte'

  interface Props {
    text: string
    label?: string
  }

  let { text, label = 'Read to me' }: Props = $props()

  function handleClick() {
    speak(text)
  }
</script>

<button class="read-to-me-pill" onclick={handleClick} aria-label={label}>
  🔊 {label}
</button>

<style>
  .read-to-me-pill {
    border: none;
    border-radius: 100px;
    padding: 16px 36px;
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    background: #fff;
    color: #2255cc;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    white-space: nowrap;
    outline: none;
  }
  .read-to-me-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  }
  .read-to-me-pill:active {
    transform: translateY(0);
  }
  .read-to-me-pill:focus-visible {
    outline: 3px solid #2255cc;
    outline-offset: 3px;
  }
</style>
