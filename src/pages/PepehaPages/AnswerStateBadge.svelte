<script lang="ts">
  interface Props {
    state: 'correct' | 'wrong'
    label?: string
  }

  let { state, label }: Props = $props()

  const text = $derived(label ?? (state === 'correct' ? 'Correct' : 'Try again'))
</script>

<span class="badge {state}" aria-hidden="true">
  <span class="icon">{state === 'correct' ? '✓' : '×'}</span>
  <span>{text}</span>
</span>

<style>
  .badge {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 7px;
    border: 2px solid currentColor;
    border-radius: 999px;
    background: #ffffff;
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: clamp(10px, 1vw, 13px);
    font-weight: 900;
    line-height: 1;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
    pointer-events: none;
  }

  .correct {
    color: #145a24;
    border-style: solid;
  }

  .wrong {
    color: #7b2018;
    border-style: dashed;
  }

  .icon {
    display: inline-grid;
    place-items: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    color: #ffffff;
    font-size: 13px;
    line-height: 1;
  }

  .correct .icon { background: #145a24; }
  .wrong .icon { background: #7b2018; }
</style>
