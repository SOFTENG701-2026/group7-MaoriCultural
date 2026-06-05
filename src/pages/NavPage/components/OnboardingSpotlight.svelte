<script lang="ts">
  let {
    waiataIcon,
    waiataW,
    onDismiss,
  }: {
    waiataIcon: { x: number; y: number }
    waiataW: number
    onDismiss: () => void
  } = $props()

  type Step = {
    title: string
    body: string
    icon: string
    cx: number
    cy: number
    r: number
    bubbleLeft: string
    bubbleTop: string
    final?: boolean
  }

  const normalSteps: Step[] = [
    {
  title: '👋 Welcome, Explorer!',
  body: 'This is your adventure map. It shows the learning modules, rewards, and settings. Tap anywhere to continue.',
  icon: '👋',
  cx: 8.5,
  cy: 7.5,
  r: 7.8,
  bubbleLeft: '17%',
  bubbleTop: '13%',
},
    {
      title: '📚 Pūrākau',
      body: 'This story module unlocks after you complete Waiata.',
      icon: '📚',
      cx: 29.5,
      cy: 29,
      r: 8.2,
      bubbleLeft: '39%',
      bubbleTop: '22%',
    },
    {
      title: '🤝 Tikanga',
      body: 'This module unlocks after Pūrākau. Learners practise respectful actions here.',
      icon: '🤝',
      cx: 34,
      cy: 75,
      r: 8.2,
      bubbleLeft: '39%',
      bubbleTop: '64%',
    },
    {
      title: '💬 Pepeha',
      body: 'This final module unlocks after Tikanga. Learners practise introducing themselves.',
      icon: '💬',
      cx: 65,
      cy: 52,
      r: 8,
      bubbleLeft: '43%',
      bubbleTop: '58%',
    },
    {
      title: '⚙️ Settings',
      body: 'Sound and volume can be changed here anytime.',
      icon: '⚙️',
      cx: 82,
      cy: 10.5,
      r: 7.2,
      bubbleLeft: '43%',
      bubbleTop: '17%',
    },
    {
      title: '🏆 Reward panel',
      body: 'Learners can see their badges here after completing each module.',
      icon: '🏆',
      cx: 92.2,
      cy: 10.5,
      r: 7.2,
      bubbleLeft: '58%',
      bubbleTop: '18%',
    },
  ]

  let step = $state(0)

  const totalSteps = $derived(normalSteps.length + 1)
  const isLast = $derived(step === totalSteps - 1)

  const current = $derived(
    isLast
      ? {
          title: "Let's start here!",
          body: 'Tap Waiata to begin your adventure 🎵',
          icon: '🎵',
          cx: waiataIcon.x,
          cy: waiataIcon.y,
          r: (waiataW / 2) * 1.6,
          bubbleLeft: `${waiataIcon.x + ((waiataW / 2) * 1.6) * 0.55}%`,
          bubbleTop: `${waiataIcon.y - ((waiataW / 2) * 1.6) * 2.1}%`,
          final: true,
        }
      : normalSteps[step]
  )

  function next() {
    if (isLast) {
      onDismiss()
    } else {
      step += 1
    }
  }

  function skip(e: MouseEvent) {
    e.stopPropagation()
    onDismiss()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      next()
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      onDismiss()
    }
  }
</script>

<div class="root">
  <button
    class="screen-click"
    type="button"
    aria-label="Click anywhere to continue onboarding"
    onclick={next}
    onkeydown={handleKeydown}
  ></button>

  <svg class="mask" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <radialGradient id="spot-fade" cx="50%" cy="50%" r="50%">
        <stop offset="72%" stop-color="black" stop-opacity="1" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </radialGradient>

      <mask id="spotlight-mask">
        <rect width="100" height="100" fill="white" />
        <circle cx={current.cx} cy={current.cy} r={current.r} fill="url(#spot-fade)" />
      </mask>
    </defs>

    <rect width="100" height="100" fill="rgba(5,15,25,0.52)" mask="url(#spotlight-mask)" />

    <circle cx={current.cx} cy={current.cy} r={current.r} class="pulse-ring" />
    <circle cx={current.cx} cy={current.cy} r={current.r} class="pulse-ring pulse-ring--delay" />
    <circle cx={current.cx} cy={current.cy} r={current.r} class="clear-ring" />
  </svg>

  <div
    class:final-bubble={current.final}
    class:info-bubble={!current.final}
    style="left:{current.bubbleLeft}; top:{current.bubbleTop};"
  >
    {#if current.final}
      <div class="balloon">
        <p class="balloon-text">{current.title}</p>
        <p class="balloon-sub">{current.body}</p>

        <button
          class="start-btn"
          type="button"
          onclick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
        >
          Got it! Let's go →
        </button>
      </div>

      <div class="balloon-tip" aria-hidden="true"></div>
    {:else}
      <div class="bubble-icon" aria-hidden="true">{current.icon}</div>

      <div class="bubble-content">
        <strong>{current.title}</strong>
        <p>{current.body}</p>
      </div>
    {/if}
  </div>

  <div class="footer">
    <div class="dots" aria-label="Onboarding progress">
      {#each Array(totalSteps) as _, i}
        <span class:active={i === step}></span>
      {/each}
    </div>

    <button class="skip-btn" type="button" onclick={skip}>Skip</button>

    <button
      class:final-btn={isLast}
      class="next-btn"
      type="button"
      onclick={(e) => {
        e.stopPropagation()
        next()
      }}
    >
      {isLast ? 'Got it! Start →' : 'Next →'}
    </button>
  </div>

  <p class="skip-hint" aria-hidden="true">Tap anywhere to continue</p>
</div>

<style>
  .root {
    position: absolute;
    inset: 0;
    z-index: 999;
    outline: none;
  }

  .screen-click {
    position: absolute;
    inset: 0;
    z-index: 80;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    margin: 0;
    background: transparent;
    cursor: pointer;
  }

  .mask {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 81;
  }

  .pulse-ring {
    fill: none;
    stroke: rgba(255, 220, 80, 0.75);
    stroke-width: 0.45;
    transform-box: fill-box;
    transform-origin: center;
    animation: pulseOut 2s ease-out infinite;
  }

  .pulse-ring--delay {
    animation-delay: 1s;
  }

  .clear-ring {
    fill: none;
    stroke: rgba(255, 220, 80, 0.95);
    stroke-width: 0.5;
  }

  @keyframes pulseOut {
    0% {
      transform: scale(1);
      opacity: 0.9;
    }

    100% {
      transform: scale(1.7);
      opacity: 0;
    }
  }

  .info-bubble {
    position: absolute;
    z-index: 84;
    display: flex;
    align-items: center;
    gap: 10px;
    width: min(340px, 30vw);
    min-width: 220px;
    padding: 10px 14px;
    border-radius: 16px;
    background: linear-gradient(180deg, #fffdf2 0%, #fff6d7 100%);
    border: 2.5px solid #f0be3d;
    box-shadow:
      0 10px 24px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.75);
    pointer-events: none;
    animation: bubbleIn 0.35s ease both;
  }

  .bubble-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #fff3c4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .bubble-content {
    flex: 1;
  }

  .bubble-content strong {
    display: block;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: clamp(18px, 2.2vmin, 24px);
    font-weight: 900;
    color: #6e3c10;
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .bubble-content p {
    margin: 0;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: clamp(14px, 1.8vmin, 18px);
    font-weight: 700;
    color: #8c5b1b;
    line-height: 1.35;
  }

  .final-bubble {
    position: absolute;
    z-index: 84;
    display: flex;
    align-items: flex-end;
    cursor: default;
    animation: bubbleIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    pointer-events: none;
  }

  @keyframes bubbleIn {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.88);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .balloon {
    position: relative;
    background: linear-gradient(160deg, #fffef0 0%, #fff8d6 100%);
    border: 2.5px solid rgba(255, 200, 60, 0.8);
    border-radius: 16px;
    padding: clamp(12px, 2.2vmin, 20px) clamp(14px, 2.5vmin, 24px);
    box-shadow:
      0 12px 36px rgba(0, 0, 0, 0.45),
      0 2px 0 rgba(255, 255, 255, 0.7) inset;
    max-width: clamp(200px, 28vmin, 320px);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .balloon-tip {
    position: absolute;
    bottom: 18px;
    left: -14px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 14px solid rgba(255, 200, 60, 0.8);
  }

  .balloon-tip::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 3px;
    width: 0;
    height: 0;
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
    transition:
      transform 0.14s ease,
      box-shadow 0.14s ease;
    animation: breathe 2s ease-in-out infinite;
    pointer-events: auto;
  }

  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 18px rgba(224, 144, 16, 0.65);
    animation: none;
  }

  .start-btn:active {
    transform: translateY(0);
  }

  .start-btn:focus-visible {
    outline: 3px solid #ffe9a8;
    outline-offset: 3px;
  }

  @keyframes breathe {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(224, 144, 16, 0.55);
    }

    50% {
      transform: scale(1.04);
      box-shadow: 0 7px 18px rgba(224, 144, 16, 0.7);
    }
  }

  .footer {
    position: absolute;
    left: 50%;
    bottom: 3%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 85;
  }

  .dots {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .dots span {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.45);
    transition: all 0.18s ease;
  }

  .dots span.active {
    background: white;
    transform: scale(1.2);
  }

  .skip-btn {
    border: none;
    border-radius: 999px;
    padding: 9px 18px;
    background: rgba(255, 255, 255, 0.22);
    color: white;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 900;
    font-size: 16px;
    cursor: pointer;
  }

  .next-btn {
    border: none;
    border-radius: 999px;
    padding: 11px 24px;
    background: linear-gradient(180deg, #75efc0 0%, #20c997 100%);
    color: #084c39;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 900;
    font-size: 17px;
    cursor: pointer;
    box-shadow:
      0 4px 0 #108a68,
      0 6px 14px rgba(0, 0, 0, 0.22);
  }

  .next-btn.final-btn {
    background: linear-gradient(180deg, #ffd86b 0%, #f4b126 100%);
    color: #6f4200;
    box-shadow:
      0 4px 0 #d18c12,
      0 6px 14px rgba(0, 0, 0, 0.22);
  }

  .skip-btn:hover,
  .next-btn:hover {
    transform: translateY(-1px);
  }

  .skip-hint {
    position: absolute;
    bottom: 8%;
    left: 50%;
    z-index: 84;
    transform: translateX(-50%);
    margin: 0;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(10px, 1.5vmin, 14px);
    font-weight: 600;
    color: rgba(255, 240, 180, 0.72);
    white-space: nowrap;
    pointer-events: none;
    animation: floatHint 2.8s ease-in-out infinite;
  }

  @keyframes floatHint {
    0%,
    100% {
      transform: translateX(-50%) translateY(0);
    }

    50% {
      transform: translateX(-50%) translateY(-4px);
    }
  }

  @media (max-width: 900px) {
    .info-bubble {
      width: min(84vw, 430px);
      min-width: 260px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .info-bubble,
    .final-bubble,
    .start-btn,
    .skip-hint,
    .pulse-ring {
      animation: none !important;
    }
  }
</style>