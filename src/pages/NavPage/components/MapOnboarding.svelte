<script lang="ts">
  import type { Loc } from '../locations'

  type OnboardingTarget = 'module' | 'reward' | 'rewardInfo' | 'setting'

  type OnboardingStep = {
    id: string
    target: OnboardingTarget
    title: string
    text: string
    action: string
    x: number
    y: number
    w: number
  }

  let {
    locations,
    order,
    onfinish,
    onopenreward = () => {},
    onopensettings = () => {},
    onclosereward = () => {},
  }: {
    locations: Loc[]
    order: string[]
    onfinish: () => void
    onopenreward?: () => void
    onopensettings?: () => void
    onclosereward?: () => void
  } = $props()

  const COPY: Record<string, { title: string; text: string; action: string }> = {
    waiata: {
      title: '1. Waiata',
      text: 'Listen to a song. Then try saying or singing Māori words.',
      action: 'Tap Waiata',
    },
    purakau: {
      title: '2. Pūrākau',
      text: 'Read a story. Then answer easy questions.',
      action: 'Tap Pūrākau',
    },
    pepeha: {
      title: '3. Pepeha',
      text: 'Make your pepeha. It tells people about you and your place.',
      action: 'Tap Pepeha',
    },
    tikanga: {
      title: '4. Tikanga',
      text: 'Learn kind and respectful choices for a marae visit.',
      action: 'Tap Tikanga',
    },
  }

  function locStep(id: string): OnboardingStep | null {
    const loc = locations.find((l) => l.id === id)
    const copy = COPY[id]
    if (!loc || !copy) return null

    return {
      id,
      target: 'module',
      title: copy.title,
      text: copy.text,
      action: copy.action,
      x: loc.icon.x,
      y: loc.icon.y,
      w: Math.max(loc.w * 1.5, 12),
    }
  }

  const steps = $derived([
    ...order.map(locStep).filter((s): s is OnboardingStep => s !== null),
    {
      id: 'reward',
      target: 'reward',
      title: '5. Reward',
      text: 'See your badges here. Grey means locked. Colour means done.',
      action: 'Tap Reward',
      x: 93.9,
      y: 9.8,
      w: 12,
    },
    {
      id: 'reward-panel',
      target: 'rewardInfo',
      title: 'Reward panel',
      text: 'This is your badge page. Beginner shows a start. Confident shows a stronger finish.',
      action: 'Next',
      x: 50,
      y: 52,
      w: 42,
    },
    {
      id: 'setting',
      target: 'setting',
      title: '6. Settings',
      text: 'Change sound, reading help, text size, or contrast here.',
      action: 'Tap Settings',
      x: 84,
      y: 9.8,
      w: 12,
    },
  ] as OnboardingStep[])

  let stepIndex = $state(0)

  const step = $derived(steps[stepIndex])
  const isLast = $derived(stepIndex >= steps.length - 1)
  const progressText = $derived(`${stepIndex + 1}/${steps.length}`)
  const radius = $derived(step ? step.w / 2 : 8)
    const cardLeft = $derived(
    !step
      ? 50
      : step.target === 'reward'
        ? 48
        : step.target === 'rewardInfo'
          ? 68
          : step.target === 'setting'
            ? 48
            : Math.min(76, Math.max(6, step.x + radius + 3))
  )

  const cardTop = $derived(
    !step
      ? 50
      : step.target === 'reward'
        ? 26
        : step.target === 'rewardInfo'
          ? 52
          : step.target === 'setting'
            ? 26
            : Math.min(70, Math.max(16, step.y - 9))
  )
  function finish() {
    onfinish()
  }

  function next() {
    if (!step) return

    if (step.target === 'reward') {
      onopenreward()
      stepIndex += 1
      return
    }

    if (step.target === 'rewardInfo') {
      onclosereward()
      stepIndex += 1
      return
    }

    if (step.target === 'setting') {
      onopensettings()
      finish()
      return
    }

    if (isLast) finish()
    else stepIndex += 1
  }

  function skip() {
    finish()
  }
</script>

{#if step}
  <div class="tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
    <svg class="tour-mask" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="tour-hole-fade" cx="50%" cy="50%" r="50%">
          <stop offset="66%" stop-color="black" stop-opacity="1" />
          <stop offset="100%" stop-color="black" stop-opacity="0" />
        </radialGradient>
        <mask id="tour-mask-hole">
          <rect width="100" height="100" fill="white" />
          <circle cx={step.x} cy={step.y} r={radius} fill="url(#tour-hole-fade)" />
        </mask>
      </defs>

      <rect width="100" height="100" fill="rgba(5, 15, 25, 0.58)" mask="url(#tour-mask-hole)" />
      <circle cx={step.x} cy={step.y} r={radius * 1.15} fill="rgba(255, 220, 85, 0.18)" />
    </svg>

    <button
      class="target"
      style="left:{step.x}%; top:{step.y}%; width:{step.w}%;"
      onclick={next}
      aria-label={step.action}
    ></button>

    <section class="card" style="left:{cardLeft}%; top:{cardTop}%">
      <p class="eyebrow">Map tour · {progressText}</p>
      <h2 id="tour-title">{step.title}</h2>
      <p>{step.text}</p>
      <div class="actions">
        <button class="primary" onclick={next}>{step.action}</button>
        <button class="skip" onclick={skip}>Skip tour</button>
      </div>
    </section>
  </div>
{/if}

<style>
  .tour {
    position: absolute;
    inset: 0;
    z-index: 95;
    font-family: 'Baloo 2', 'Segoe UI', system-ui, sans-serif;
  }

  .tour-mask {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .pulse {
    fill: none;
    stroke: rgba(255, 230, 110, 0.9);
    stroke-width: 0.5;
    transform-box: fill-box;
    transform-origin: center;
    animation: pulseOut 1.8s ease-out infinite;
  }

  .pulse-delay {
    animation-delay: 0.9s;
  }

  .target {
    position: absolute;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    border: 3px solid rgba(255, 235, 150, 0.95);
    border-radius: 50%;
    background: rgba(255, 235, 150, 0.12);
    cursor: pointer;
    box-shadow: 0 0 22px rgba(255, 220, 80, 0.8);
  }

  .target:focus-visible {
    outline: 4px solid #fff7c2;
    outline-offset: 4px;
  }

  .card {
    position: absolute;
    width: min(330px, 32vw);
    min-width: 245px;
    transform: translateY(-50%);
    background: linear-gradient(180deg, #fffef0, #fff3c4);
    color: #5a3514;
    border: 3px solid rgba(255, 204, 65, 0.9);
    border-radius: 24px;
    padding: clamp(14px, 2.2vmin, 22px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.48), inset 0 2px 0 rgba(255, 255, 255, 0.75);
    animation: popIn 0.25s ease-out both;
  }

  .eyebrow {
    margin: 0 0 0.35em;
    color: #9a641d;
    font-size: clamp(11px, 1.4vmin, 14px);
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0 0 0.25em;
    font-size: clamp(22px, 3vmin, 32px);
    line-height: 1;
  }

  p {
    margin: 0;
    font-size: clamp(13px, 1.8vmin, 17px);
    line-height: 1.35;
    font-weight: 650;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6em;
    margin-top: 1em;
  }

  .primary,
  .skip {
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 900;
  }

  .primary {
    padding: 0.55em 1.2em;
    color: #fff;
    background: linear-gradient(180deg, #f6c943, #df8a0f);
    box-shadow: 0 5px 12px rgba(130, 72, 10, 0.35);
  }

  .skip {
    padding: 0.55em 0.2em;
    color: #8a4a16;
    background: transparent;
  }

  .primary:hover,
  .skip:hover {
    transform: translateY(-1px);
  }

  .primary:focus-visible,
  .skip:focus-visible {
    outline: 3px solid #d97c1d;
    outline-offset: 3px;
  }

  @keyframes pulseOut {
    from {
      opacity: 0.95;
      transform: scale(1);
    }

    to {
      opacity: 0;
      transform: scale(1.55);
    }
  }

  @keyframes popIn {
    from {
      opacity: 0;
      transform: translateY(-42%) scale(0.92);
    }

    to {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }

  @media (max-width: 760px) {
    .card {
      left: 50% !important;
      top: auto !important;
      bottom: 4%;
      width: min(88vw, 360px);
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse,
    .card {
      animation: none !important;
    }
  }
</style>