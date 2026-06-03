<!--
  Pepeha Module — Page 3: Choose Kiki's School Example

  The learner picks ONE fixed, teacher-reviewed Auckland school example for Kiki
  (data from schools.ts — the single source of truth). The choice is saved to
  module state and drives the maunga/awa shown on later pages.

  Cultural safety: always framed as Kiki's *practice example*, never the
  learner's own pepeha. No private data is collected.

  Layout: a notebook panel (chose_bg.png — map baked on top, cream writing area
  below) holds the four school cards in its cream area. Chrome around it:
    • Back (top-left)            • static title + play
    • Kiki + speech bubble       • Read to me (bottom-left)
    • Find Maunga (bottom-right, unlocks once a school is chosen)
-->
<script lang="ts">
  import bgImg       from '../../assets/pepeha/page3/a_bright_colorful_cartoon_illustration_landscape_1_batch_1_transparent.png'
  import notebookImg from '../../assets/pepeha/page3/chose_bg.png'
  import titleImg    from '../../assets/pepeha/page3/title.png'
  import playImg     from '../../assets/pepeha/page3/play.png'
  import backImg     from '../../assets/pepeha/page3/a_simple_graphic_ui_button_scene_a_bright_solid_g_1_batch_1_transparent.png'
  import readImg     from '../../assets/pepeha/page3/a_clean_simple_graphic_gui_scene_a_bright_neon_g_2_batch_2_transparent.png'
  import findMaungaImg from '../../assets/pepeha/page3/a_clean_graphic_ui_image_on_a_solid_bright_green_b_4_batch_4_transparent.png'
  import kikiImg     from '../../assets/kiwihello.png'
  import settingsImg from '../../assets/settings.png'

  import { SCHOOL_PROFILES } from './schools'
  import { pepehaState } from '../../lib/pepehaState.svelte'
  import { speak, settings } from '../../lib/settings.svelte'

  interface Props {
    onNext: () => void
    onBack: () => void
  }
  let { onNext, onBack }: Props = $props()

  const isBeginner = $derived(pepehaState.level === 'beginner')

  const title = $derived(isBeginner ? "Choose Kiki's School" : "Choose Kiki's Practice Example")
  const kikiLine = $derived(
    isBeginner
      ? 'Pick a school. We will find its mountain and river!'
      : 'Choose a school example for Kiki. This is not your own pepeha.'
  )

  // Per-school accent colour (matches the reference card art).
  const THEME: Record<string, string> = {
    'rosebank':   '#2f8a3e',
    'don-buck':   '#b5651d',
    'glen-eden':  '#6a3fa0',
    'kauri-park': '#c0392b',
  }

  const selectedId = $derived(pepehaState.selectedSchoolId)
  const canProceed = $derived(selectedId !== null)

  function pickSchool(id: string) {
    pepehaState.selectSchool(id)
    const s = SCHOOL_PROFILES.find(p => p.id === id)
    speak(`${s?.schoolName}. ${s?.maungaLine} ${s?.awaLine}`)
  }

  const readText = $derived(
    `${title}. ${kikiLine} ` +
    (isBeginner
      ? "This is Kiki's practice example."
      : 'Remember, this is a safe practice example, not your own pepeha.')
  )
</script>

<div class="stage" style="background-image:url({bgImg})">

  <!-- Back — top-left -->
  <button class="img-btn back-btn" onclick={onBack} aria-label="Back">
    <img src={backImg} alt="Back" />
  </button>

  <!-- Settings — top-right -->
  <button class="settings-btn" onclick={() => (settings.open = true)} aria-label="Settings">
    <img src={settingsImg} alt="Settings" />
  </button>

  <!-- Static title with a play button tucked into its bottom-right corner -->
  <div class="title-board">
    <img src={titleImg} alt={title} />
    <button
      class="title-play"
      onclick={() => speak(`${title}. ${kikiLine}`)}
      aria-label="Read the title"
    >
      <img src={playImg} alt="" />
    </button>
  </div>

  <!-- Notebook panel: school cards sit in its cream writing area -->
  <div class="notebook">
    <img src={notebookImg} alt="" class="notebook-img" />
    <ul class="cards" aria-label="School examples for Kiki">
      {#each SCHOOL_PROFILES as school}
        <li>
          <button
            class="card"
            class:selected={selectedId === school.id}
            style="--accent:{THEME[school.id] ?? '#2f8a3e'}"
            onclick={() => pickSchool(school.id)}
            aria-pressed={selectedId === school.id}
          >
            {#if selectedId === school.id}
              <span class="tick" aria-hidden="true">✓</span>
            {/if}
            <span class="card-house" aria-hidden="true">🏫</span>
            <span class="card-name">{school.schoolName}</span>
            <span class="card-line">
              <span class="card-label">{isBeginner ? 'Mountain / Maunga:' : 'Maunga:'}</span>
              <span class="card-value">{school.maunga}</span>
            </span>
            <span class="card-line">
              <span class="card-label">{isBeginner ? 'River / Awa:' : 'Awa:'}</span>
              <span class="card-value">{school.awa}</span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Kiki + speech bubble — left -->
  <div class="kiki-block">
    <div class="bubble"><p>{kikiLine}</p></div>
    <img src={kikiImg} alt="Kiki the kiwi" class="kiki-img" />
  </div>

  <!-- Bottom bar: Read to me (left) · Find Maunga (right) -->
  <div class="bottom-bar">
    <button class="img-btn read-btn" onclick={() => speak(readText)} aria-label="Read to me">
      <img src={readImg} alt="Read to me" />
    </button>

    {#if canProceed}
      <button class="img-btn find-btn" onclick={onNext} aria-label="Find Maunga">
        <img src={findMaungaImg} alt="Find Maunga" />
      </button>
    {:else}
      <img src={findMaungaImg} alt="Find Maunga is locked" class="find-locked" />
    {/if}
  </div>

</div>

<style>
  .stage {
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'Nunito', system-ui, sans-serif;
    overflow: hidden;
    user-select: none;
  }

  /* Generic image-button reset */
  .img-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .img-btn:hover  { transform: translateY(-2px) scale(1.03); }
  .img-btn:active { transform: scale(0.97); }
  .img-btn img { display: block; height: auto; }
  .img-btn:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 16px; }

  /* Back — top-left */
  .back-btn { position: absolute; top: -7%; left: 0%; z-index: 40; }
  .back-btn img { width: min(250px, 25.6vw); }

  /* Settings — top-right */
  .settings-btn {
    position: absolute;
    top: 3%;
    right: 2%;
    z-index: 40;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .settings-btn:hover  { transform: translateY(-3px) scale(1.04); }
  .settings-btn:active { transform: scale(0.97); }
  .settings-btn img {
    width: min(90px, 11.25vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 5px 14px rgba(0,0,0,0.28));
  }

  /* Static title — top centre (play button sits in its bottom-right corner) */
  .title-board {
    position: absolute;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 35;
    pointer-events: none; /* title itself is static; only the play button is clickable */
  }
  .title-board > img {
    width: min(600px, 50vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
  }
  /* Play button tucked into the title's bottom-right corner */
  .title-play {
    position: absolute;
    right: 0%;
    bottom: 7%;
    pointer-events: auto;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .title-play:hover  { transform: scale(1.08); }
  .title-play:active { transform: scale(0.95); }
  .title-play img {
    width: min(56px, 6vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25));
  }
  .title-play:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; border-radius: 50%; }

  /* Notebook panel — centred, fixed 1082:810 aspect so card %s line up */
  .notebook {
    position: absolute;
    top: 13%;
    left: 50%;
    transform: translateX(-50%);
    height: 80%;
    aspect-ratio: 1082 / 810;
    z-index: 10;
  }
  .notebook-img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: fill;
    filter: drop-shadow(0 10px 28px rgba(0,0,0,0.32));
  }
  /* Cards sit in the cream writing area (≈ y44–83%, x8–92% of the panel) */
  .cards {
    position: absolute;
    top: 45%;
    left: 8%;
    right: 8%;
    bottom: 18%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: clamp(8px, 1.2vw, 16px);
    transform: translateX(-10px);
    z-index: 20;
  }
  .cards li { flex: 1 1 0; display: flex; min-width: 0; }
  .card {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: clamp(6px, 1vw, 14px) clamp(4px, 0.8vw, 10px);
    border: 3px solid var(--accent);
    border-radius: 16px;
    background: rgba(255,253,243,0.92);
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
    cursor: pointer;
    text-align: center;
    transition: transform 0.14s ease, box-shadow 0.2s ease;
  }
  .card:hover  { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.28); }
  .card:active { transform: translateY(-1px); }
  .card:focus-visible { outline: 3px solid #F5A623; outline-offset: 3px; }
  .card.selected {
    box-shadow: 0 0 0 4px #ffd54a, 0 10px 24px rgba(245,166,35,0.55);
    transform: translateY(-4px);
  }
  .card-house { font-size: clamp(22px, 3vw, 38px); line-height: 1; }
  .card-name {
    font-size: clamp(12px, 1.4vw, 18px);
    font-weight: 900;
    color: var(--accent);
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  .card-line { display: flex; flex-direction: column; gap: 0; width: 100%; min-width: 0; }
  .card-label {
    font-size: clamp(9px, 1vw, 12px);
    font-weight: 700;
    color: #5a6a4a;
  }
  .card-value {
    font-size: clamp(12px, 1.4vw, 17px);
    font-weight: 900;
    color: #2a3a1a;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  .tick {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(24px, 2.8vw, 32px);
    height: clamp(24px, 2.8vw, 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #3fae45;
    color: #fff;
    font-size: clamp(14px, 1.7vw, 19px);
    font-weight: 900;
    border: 3px solid #fff;
    box-shadow: 0 3px 8px rgba(0,0,0,0.25);
  }

  /* Kiki + bubble — left side */
  .kiki-block {
    position: absolute;
    top: 35%;
    left: 10%;
    z-index: 25;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(190px, 19vw);
  }
  .bubble {
    position: relative;
    background: #ffffff;
    border: 3px solid #F5A623;
    border-radius: 18px;
    padding: 10px 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    margin-bottom: 6px;
  }
  .bubble::after {
    content: '';
    position: absolute;
    bottom: -13px;
    left: 30px;
    border-width: 13px 11px 0 11px;
    border-style: solid;
    border-color: #F5A623 transparent transparent transparent;
  }
  .bubble p {
    margin: 0;
    font-size: clamp(13px, 1.4vw, 17px);
    font-weight: 800;
    color: #1a5c00;
    line-height: 1.35;
    text-align: center;
  }
  .kiki-img {
    width: min(250px, 25vw);
    height: auto;
    display: block;
    filter: drop-shadow(0 6px 14px rgba(0,0,0,0.28));
  }

  /* Bottom bar */
  .bottom-bar {
    position: absolute;
    bottom: -10%;
    left: -3%;
    right: 2%;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .read-btn { position: relative; left: 15px; }
  .read-btn img { width: min(270px, 30vw); }
  .find-btn img { width: min(220px, 25vw); }
  .find-locked {
    width: min(220px, 25vw);
    height: auto;
    display: block;
    filter: grayscale(0.7) brightness(0.85);
    opacity: 0.6;
  }
</style>