<script lang="ts">
  // Kiki the kiwi guide: a pose + a speech bubble. When `autoSpeak` is on she
  // reads the bubble aloud in her "AI voice" whenever the text changes — routed
  // through the shared `speak()` so the Sound on/off + Volume settings apply
  // (FR14). Used for the intro (Step 2), narration (Step 3) and feedback.
  import { speak, narrate } from '../../../lib/settings.svelte'
  import { kikiHello, kikiYes, kikiThink, kikiTryAgain, kikiGo } from '../assets'

  type KikiPose = 'hello' | 'yes' | 'think' | 'tryagain' | 'go'

  interface Props {
    pose?: KikiPose
    text?: string
    autoSpeak?: boolean
    flip?: boolean // kiwi on the right, bubble on the left
    size?: 'sm' | 'md' | 'lg'
  }
  let {
    pose = 'hello',
    text = '',
    autoSpeak = false,
    flip = false,
    size = 'md',
  }: Props = $props()

  const POSE_IMG: Record<KikiPose, string> = {
    hello: kikiHello,
    yes: kikiYes,
    think: kikiThink,
    tryagain: kikiTryAgain,
    go: kikiGo,
  }
  const img = $derived(POSE_IMG[pose])

  // Read each new line aloud ONLY in "Out loud" mode (narrate). By default
  // nothing auto-plays; the 🔊 replay button below always speaks on demand.
  $effect(() => {
    const line = text
    if (autoSpeak && line) narrate(line)
  })

  function replay() {
    if (text) speak(text)
  }
</script>

<div class="kiki size-{size}" class:flip>
  <img class="kiwi" src={img} alt="Kiki the kiwi" draggable="false" />
  {#if text}
    <div class="bubble">
      <button class="replay" onclick={replay} aria-label="Hear Kiki say it again">🔊</button>
      <p class="lead">{text}</p>
    </div>
  {/if}
</div>

<style>
  .kiki {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }
  .kiki.flip {
    flex-direction: row-reverse;
  }

  .kiwi {
    flex-shrink: 0;
    height: auto;
    object-fit: contain;
    animation: pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.22));
  }
  .size-sm .kiwi { width: clamp(70px, 12vw, 110px); }
  .size-md .kiwi { width: clamp(110px, 18vw, 180px); }
  .size-lg .kiwi { width: clamp(150px, 26vw, 260px); }

  .bubble {
    position: relative;
    background: #fff;
    border-radius: 22px;
    padding: 18px 22px 18px 48px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
    flex: 1;
    text-align: left;
    animation: pop 0.4s 0.08s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  /* Tail pointing back toward Kiki. */
  .bubble::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -14px;
    transform: translateY(-50%);
    border: 12px solid transparent;
    border-right-color: #fff;
  }
  .flip .bubble {
    padding: 18px 48px 18px 22px;
  }
  .flip .bubble::before {
    left: auto;
    right: -14px;
    border-right-color: transparent;
    border-left-color: #fff;
  }

  .bubble .lead {
    margin: 0;
    color: #2c2440;
    font-size: clamp(16px, 1.9vw, 21px);
    font-weight: 600;
    line-height: 1.5;
  }

  .replay {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: #f1ecff;
    color: #6a3bd0;
    font-size: 15px;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: transform 0.12s ease, background 0.15s ease;
  }
  .flip .replay {
    left: auto;
    right: 12px;
  }
  .replay:hover { background: #e4d8ff; transform: scale(1.08); }
  .replay:focus-visible { outline: 3px solid #aa3bff; outline-offset: 2px; }

  @keyframes pop {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .kiwi, .bubble { animation: none; }
  }
</style>
