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

  <!-- Darkened backdrop with a TRUE circular hole punched out at the spot -->
  <div
    class="mask"
    style="background: radial-gradient(circle at {current.cx}% {current.cy}%, transparent {current.r}vw, rgba(5,13,23,0.7) {current.r * 1.35}vw);"
    aria-hidden="true"
  ></div>

  <!-- Circular highlight rings around the spotlight -->
  <span class="ring pulse-ring" style="left:{current.cx}%; top:{current.cy}%; width:{current.r * 2}vw; height:{current.r * 2}vw;" aria-hidden="true"></span>
  <span class="ring pulse-ring pulse-ring--delay" style="left:{current.cx}%; top:{current.cy}%; width:{current.r * 2}vw; height:{current.r * 2}vw;" aria-hidden="true"></span>
  <span class="ring clear-ring" style="left:{current.cx}%; top:{current.cy}%; width:{current.r * 2}vw; height:{current.r * 2}vw;" aria-hidden="true"></span>

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

  /* Circular highlight rings */
  .ring {
    position: absolute;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 82;
    box-sizing: border-box;
  }

  .pulse-ring {
    border: 2px solid rgba(255, 226, 138, 0.55);
    animation: pulseOut 2.2s ease-out infinite;
  }

  .pulse-ring--delay {
    animation-delay: 1.1s;
  }

  .clear-ring {
    border: 2.5px solid rgba(255, 233, 168, 0.9);
    box-shadow: 0 0 10px rgba(255, 220, 120, 0.6);
  }

  @keyframes pulseOut {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.9;
    }

    100% {
      transform: translate(-50%, -50%) scale(1.55);
      opacity: 0;
    }
  }

  .info-bubble {
    position: absolute;
    z-index: 84;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: min(360px, 32vw);
    min-width: 230px;
    padding: 16px 18px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow:
      0 18px 44px rgba(15, 30, 50, 0.32),
      0 2px 8px rgba(15, 30, 50, 0.18);
    backdrop-filter: blur(4px);
    pointer-events: none;
    animation: bubbleIn 0.32s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  }

  .bubble-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(160deg, #ffe7a6 0%, #ffce5e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(230, 160, 30, 0.3);
  }

  .bubble-content {
    flex: 1;
    padding-top: 1px;
  }

  .bubble-content strong {
    display: block;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: clamp(17px, 2.1vmin, 22px);
    font-weight: 800;
    color: #2a2118;
    margin-bottom: 3px;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }

  .bubble-content p {
    margin: 0;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: clamp(13px, 1.7vmin, 16px);
    font-weight: 600;
    color: #6b6157;
    line-height: 1.4;
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
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: clamp(14px, 2.4vmin, 22px) clamp(16px, 2.6vmin, 26px);
    box-shadow:
      0 22px 50px rgba(15, 30, 50, 0.4),
      0 3px 10px rgba(15, 30, 50, 0.2);
    max-width: clamp(220px, 30vmin, 340px);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .balloon-tip {
    position: absolute;
    bottom: 22px;
    left: -12px;
    width: 0;
    height: 0;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-right: 13px solid rgba(255, 255, 255, 0.98);
    filter: drop-shadow(-2px 2px 3px rgba(15, 30, 50, 0.12));
  }

  .balloon-text {
    margin: 0;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(18px, 2.8vmin, 26px);
    font-weight: 800;
    color: #2a2118;
    line-height: 1.15;
    letter-spacing: -0.3px;
    white-space: nowrap;
  }

  .balloon-sub {
    margin: 0;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(13px, 1.8vmin, 17px);
    font-weight: 600;
    color: #6b6157;
    line-height: 1.4;
  }

  .start-btn {
    margin-top: 8px;
    align-self: flex-start;
    padding: 0.6em 1.4em;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-size: clamp(13px, 1.7vmin, 16px);
    font-weight: 800;
    color: #fff;
    background: linear-gradient(180deg, #ffc83e 0%, #f29a13 100%);
    box-shadow: 0 6px 16px rgba(224, 144, 16, 0.45);
    transition:
      transform 0.14s ease,
      box-shadow 0.14s ease;
    animation: breathe 2s ease-in-out infinite;
    pointer-events: auto;
  }

  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 9px 22px rgba(224, 144, 16, 0.55);
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
    bottom: 3.5%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 85;
    padding: 9px 9px 9px 18px;
    border-radius: 999px;
    background: rgba(18, 28, 40, 0.55);
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  }

  .dots {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .dots span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.35);
    transition: all 0.2s ease;
  }

  .dots span.active {
    width: 22px;
    background: #ffd86b;
  }

  .skip-btn {
    border: none;
    border-radius: 999px;
    padding: 8px 16px;
    background: transparent;
    color: rgba(255, 255, 255, 0.78);
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: color 0.15s ease;
  }

  .skip-btn:hover {
    color: #fff;
  }

  .next-btn {
    border: none;
    border-radius: 999px;
    padding: 10px 22px;
    background: linear-gradient(180deg, #5fe7b4 0%, #1fc592 100%);
    color: #06402f;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 800;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 5px 14px rgba(31, 197, 146, 0.45);
    transition:
      transform 0.14s ease,
      box-shadow 0.14s ease;
  }

  .next-btn.final-btn {
    background: linear-gradient(180deg, #ffd86b 0%, #f4b126 100%);
    color: #6f4200;
    box-shadow: 0 5px 14px rgba(244, 177, 38, 0.5);
  }

  .next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(31, 197, 146, 0.55);
  }

  .next-btn.final-btn:hover {
    box-shadow: 0 8px 20px rgba(244, 177, 38, 0.6);
  }

  .skip-hint {
    position: absolute;
    bottom: 10.5%;
    left: 50%;
    z-index: 84;
    transform: translateX(-50%);
    margin: 0;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(10px, 1.5vmin, 13px);
    font-weight: 600;
    color: rgba(255, 245, 210, 0.6);
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