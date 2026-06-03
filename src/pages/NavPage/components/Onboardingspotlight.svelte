<script lang="ts">
  // Dev D — Onboarding workstream
  // First-login spotlight: darkens the map except the Waiata node,
  // shows Kiki's "Let's start here!" prompt. Tap anywhere or the CTA to dismiss.

  import { kiwiImg } from '../assets'

  let {
    waiataIcon,
    waiataW,
    onDismiss,
  }: {
    waiataIcon: { x: number; y: number }
    waiataW:    number
    onDismiss:  () => void
  } = $props()

  // $derived keeps these reactive (fixes state_referenced_locally warning)
  const R          = $derived((waiataW / 2) * 1.6)
  const cx         = $derived(waiataIcon.x)
  const cy         = $derived(waiataIcon.y)
  const bubbleLeft = $derived(cx + R * 0.55)
  const bubbleTop  = $derived(cy - R * 2.1)
</script>

<!--
  Root: role="button" makes the div interactive (valid tabindex, keyboard events,
  click-to-dismiss). This avoids both "noninteractive tabindex" and "no nested
  buttons" — role="button" IS interactive so tabindex="0" is valid, and the
  inner .start-btn <button> is a descendant of a div (not a <button>).
-->
<div
  class="root"
  role="button"
  tabindex="0"
  aria-label="Tap to continue to the map"
  onclick={onDismiss}
  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') onDismiss() }}
>
  <!-- SVG: dark mask with feathered circular hole punched out over Waiata -->
  <svg class="mask" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <radialGradient id="spot-fade" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stop-color="black" stop-opacity="1" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </radialGradient>
      <mask id="spotlight-mask">
        <rect width="100" height="100" fill="white" />
        <circle cx={cx} cy={cy} r={R} fill="url(#spot-fade)" />
      </mask>
    </defs>
    <rect width="100" height="100" fill="rgba(5,15,25,0.82)" mask="url(#spotlight-mask)" />
    <!-- Pulse rings draw attention to the spotlight -->
    <circle cx={cx} cy={cy} r={R} class="pulse-ring" />
    <circle cx={cx} cy={cy} r={R} class="pulse-ring pulse-ring--delay" />
  </svg>

  <!-- Bubble: no click handler needed — inner button handles dismiss -->
  <div
    class="bubble"
    style="left:{bubbleLeft}%; top:{bubbleTop}%"
  >
    <img src={kiwiImg} alt="Kiki the kiwi" class="kiki" draggable="false" />

    <div class="balloon">
      <p class="balloon-text">Let's start here!</p>
      <p class="balloon-sub">Tap Waiata to begin your adventure 🎵</p>
      <!--
        <button> inside a <div role="button"> is valid HTML — buttons can nest
        inside any div. The invalid case is <button> inside <button>.
      -->
      <button class="start-btn" type="button" onclick={onDismiss}>
        Got it! Let's go →
      </button>
    </div>

    <div class="balloon-tip" aria-hidden="true"></div>
  </div>

  <p class="skip-hint" aria-hidden="true">Tap anywhere to continue</p>
</div>

<style>
  .root {
    position: absolute;
    inset: 0;
    z-index: 55;
    cursor: pointer;
    outline: none;
  }
  .root:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: -6px;
    border-radius: 4px;
  }

  .mask {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .pulse-ring {
    fill: none;
    stroke: rgba(255, 220, 80, 0.75);
    stroke-width: 0.45;
    transform-box: fill-box;
    transform-origin: center;
    animation: pulseOut 2s ease-out infinite;
  }
  .pulse-ring--delay { animation-delay: 1s; }
  @keyframes pulseOut {
    0%   { transform: scale(1);   opacity: 0.9; }
    100% { transform: scale(1.7); opacity: 0; }
  }

  .bubble {
    position: absolute;
    display: flex;
    align-items: flex-end;
    cursor: default;
    animation: bubbleIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes bubbleIn {
    from { opacity: 0; transform: translateY(12px) scale(0.88); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .kiki {
    width: clamp(56px, 8vmin, 88px);
    height: auto;
    flex-shrink: 0;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
  }

  .balloon {
    position: relative;
    background: linear-gradient(160deg, #fffef0 0%, #fff8d6 100%);
    border: 2.5px solid rgba(255, 200, 60, 0.8);
    border-radius: 20px;
    padding: clamp(12px, 2.2vmin, 20px) clamp(14px, 2.5vmin, 24px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45), 0 2px 0 rgba(255, 255, 255, 0.7) inset;
    max-width: clamp(200px, 28vmin, 320px);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .balloon-tip {
    position: absolute;
    bottom: 18px; left: -14px;
    width: 0; height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 14px solid rgba(255, 200, 60, 0.8);
  }
  .balloon-tip::after {
    content: '';
    position: absolute;
    top: -6px; left: 3px;
    width: 0; height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 11px solid #fffef0;
  }

  .balloon-text {
    margin: 0;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(17px, 2.8vmin, 26px);
    font-weight: 800;
    color: #6b3a0f;
    line-height: 1.15;
    white-space: nowrap;
  }

  .balloon-sub {
    margin: 0;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(12px, 1.8vmin, 17px);
    font-weight: 600;
    color: #8a5a1a;
    line-height: 1.35;
  }

  .start-btn {
    margin-top: 4px;
    align-self: flex-start;
    padding: 0.5em 1.2em;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-size: clamp(12px, 1.7vmin, 16px);
    font-weight: 800;
    color: #fff;
    background: linear-gradient(180deg, #f5c842, #e09010);
    box-shadow: 0 4px 12px rgba(224, 144, 16, 0.55);
    transition: transform 0.14s ease, box-shadow 0.14s ease;
    animation: breathe 2s ease-in-out infinite;
  }
  .start-btn:hover  { transform: translateY(-2px); box-shadow: 0 7px 18px rgba(224,144,16,0.65); animation: none; }
  .start-btn:active { transform: translateY(0); }
  .start-btn:focus-visible { outline: 3px solid #ffe9a8; outline-offset: 3px; }
  @keyframes breathe {
    0%,100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(224,144,16,.55); }
    50%      { transform: scale(1.04); box-shadow: 0 7px 18px rgba(224,144,16,.7);  }
  }

  .skip-hint {
    position: absolute;
    bottom: 4%; left: 50%;
    transform: translateX(-50%);
    margin: 0;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(10px, 1.5vmin, 14px);
    font-weight: 600;
    color: rgba(255, 240, 180, 0.65);
    white-space: nowrap;
    pointer-events: none;
    animation: floatHint 2.8s ease-in-out infinite;
  }
  @keyframes floatHint {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50%      { transform: translateX(-50%) translateY(-4px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .bubble, .start-btn, .skip-hint, .pulse-ring { animation: none !important; }
  }
</style>