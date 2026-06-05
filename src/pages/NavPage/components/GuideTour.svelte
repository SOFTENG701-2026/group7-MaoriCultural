<script lang="ts">
  import { guidewordsImg } from '../assets'

  let { lines, onfinish }: { lines: string[]; onfinish: () => void } = $props()

  const STEPS = [
    { title: '🗺️ Your learning journey',   body: 'There are 4 modules. Complete Waiata first — then the next one unlocks!', kiwi: 'hello' },
    { title: '⚙️ Settings  •  🏆 Reward',   body: 'Tap Settings to change sound. Tap Reward to see your badges as you earn them!', kiwi: 'happy' },
    { title: '🎵 Ready to start Waiata?',   body: "Tap Kiki anytime to hear a line again. Tap 'Try Singing' to record yourself. Ka pai!", kiwi: 'hello' },
  ]

  let step = $state(0)
  const current = $derived(STEPS[step])
  const isLast  = $derived(step >= STEPS.length - 1)

  function next()              { if (isLast) onfinish(); else step++ }
  function skip(e: MouseEvent) { e.stopPropagation(); onfinish() }
</script>

<div class="root"
  role="button" tabindex="0"
  onclick={next}
  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') next() }}
  aria-label={isLast ? "Let's go" : 'Next'}
>
  <div class="banner" style="background-image:url({guidewordsImg})">
    <div class="content">
      <div class="text-block">
        <strong class="title">{current.title}</strong>
        <span class="body">{current.body}</span>
      </div>
      <div class="footer">
        <span class="dots">
          {#each STEPS as _, i}
            <span class="dot" class:on={i === step}></span>
          {/each}
        </span>
        <div class="btns">
          <button class="skip-btn" type="button" onclick={skip}>Skip</button>
          <button class="next-btn" class:gold={isLast} type="button"
            onclick={(e) => { e.stopPropagation(); next() }}>
            {isLast ? "Let's go! →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .root {
    position: absolute;
    inset: 0;
    z-index: 60;
    cursor: pointer;
  }

  .banner {
    position: fixed;
    bottom: 3%;
    left: 50%;
    transform: translateX(-50%);
    /* Responsive: fills narrow screens, caps at 600px wide */
    width: min(92vw, 600px);
    height: clamp(110px, 15vh, 148px);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 61;
    filter: drop-shadow(0 6px 24px rgba(0,0,0,.4));
    border-radius: 18px;
    overflow: hidden;
    animation: rise .3s cubic-bezier(.34,1.56,.64,1) both;
  }

  @keyframes rise {
    from { opacity:0; transform: translateX(-50%) translateY(18px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }

  /* Content to the right of the Kiki image in the parchment bg */
  .content {
    position: absolute;
    top: 0; bottom: 0;
    /* % instead of px — scales with banner width on all screen sizes */
    left: 22%;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px 14px 8px 6px;
    gap: 5px;
    pointer-events: auto;
    min-width: 0;
    overflow: hidden;
  }

  .text-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    animation: swap .22s ease-out;
  }
  @keyframes swap {
    from { opacity:0; transform: translateY(5px); }
    to   { opacity:1; transform: translateY(0); }
  }

  .title {
    font-size: clamp(12px, 1.9vmin, 17px);
    font-weight: 900;
    color: #3a2008;
    font-family: 'Baloo 2','Nunito',system-ui,sans-serif;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .body {
    font-size: clamp(10px, 1.5vmin, 14px);
    font-weight: 700;
    color: #5a3a18;
    font-family: 'Baloo 2','Nunito',system-ui,sans-serif;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: left;
  }

  /* Footer: dots left, buttons right — never wraps */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 6px;
    min-width: 0;
  }

  .dots { display:inline-flex; gap:5px; align-items:center; flex-shrink:0; }
  .dot  { width:clamp(6px,1vmin,9px); height:clamp(6px,1vmin,9px); border-radius:50%; background:rgba(90,53,20,.22); transition:background .2s,transform .2s; }
  .dot.on { background:#d97c1d; transform:scale(1.3); }

  .btns { display:flex; align-items:center; gap:6px; flex-shrink:0; }

  .skip-btn {
    border:none; background:transparent; color:#8a4a16;
    font-family:inherit; font-weight:800; font-size:clamp(11px,1.6vmin,15px);
    cursor:pointer; padding:4px 8px; border-radius:999px; white-space:nowrap;
  }
  .skip-btn:hover { background:rgba(139,74,22,.12); }

  .next-btn {
    border:none; border-radius:999px; font-family:inherit; font-weight:900;
    font-size:clamp(11px,1.6vmin,15px); cursor:pointer; padding:6px 16px;
    background:linear-gradient(180deg,#6ee7b7,#10b981); color:#064e3b;
    box-shadow:0 3px 0 #065f46,0 4px 10px rgba(0,0,0,.2);
    transition:transform .12s; white-space:nowrap;
  }
  .next-btn.gold { background:linear-gradient(180deg,#fde68a,#f59e0b); color:#78350f; box-shadow:0 3px 0 #b45309,0 4px 10px rgba(0,0,0,.2); }
  .next-btn:hover { transform:translateY(-2px); }
</style>