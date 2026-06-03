<script lang="ts">
  import { speak } from './settings.svelte'
  import rtmImg from '../assets/read_to_me.png'

  interface Props {
    text: string
    label?: string
  }

  let { text, label = 'Read to me' }: Props = $props()

  function handleClick() {
    speak(text)
  }
</script>

<button class="rtm-btn" onclick={handleClick} aria-label={label}>
  <img src={rtmImg} alt={label} />
</button>

<style>
  .rtm-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease, filter 0.12s ease;
    outline: none;
  }
  .rtm-btn img {
    width: min(180px, 18vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
  }
  .rtm-btn:hover {
    transform: translateY(-3px) scale(1.05);
    filter: brightness(1.05);
  }
  .rtm-btn:active {
    transform: scale(0.97);
  }
  .rtm-btn:focus-visible {
    outline: 3px solid #2255cc;
    outline-offset: 4px;
    border-radius: 12px;
  }
</style>
