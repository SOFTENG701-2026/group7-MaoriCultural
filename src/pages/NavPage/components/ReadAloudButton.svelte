<script lang="ts">
  // Author: Shirley
  // "Read to me" button — speaks a short message via the Web Speech API.
  // Self-contained: it owns its speaking state and degrades quietly when the
  // browser has no speech synthesis.
  let {
    text = "Kia ora! Welcome to the Map of Kiwi's Aotearoa Adventure. Tap a place to help Kiwi explore.",
  }: { text?: string } = $props()

  let speaking = $state(false)

  function readToMe() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      speaking = false
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    u.onend = () => (speaking = false)
    speaking = true
    window.speechSynthesis.speak(u)
  }
</script>

<button class="readme" class:on={speaking} onclick={readToMe}>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
    <path
      class="wave"
      d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
  <span>{speaking ? 'Stop' : 'Read to me'}</span>
</button>

<style>
  .readme {
    position: absolute;
    left: 2.4%;
    bottom: 4.5%;
    z-index: 40;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.55em 1em 0.55em 0.7em;
    border: 2px solid rgba(255, 255, 255, 0.55);
    border-radius: 999px;
    cursor: pointer;
    color: #15364a;
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(11px, 1.7vmin, 17px);
    background: linear-gradient(180deg, #eaf6ff, #bfe3f5);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 255, 255, 0.6) inset;
    transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.2s ease;
  }
  .readme svg {
    width: 1.3em;
    height: 1.3em;
    flex: none;
  }
  .readme .wave {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .readme.on {
    background: linear-gradient(180deg, #ffe6a8, #f4c25c);
  }
  .readme.on .wave {
    opacity: 1;
    animation: pulse 1s ease-in-out infinite;
  }
  .readme:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.6) inset;
  }
  .readme:active {
    transform: translateY(0);
  }
  .readme:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: 3px;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .readme.on .wave {
      animation: none !important;
    }
  }
</style>