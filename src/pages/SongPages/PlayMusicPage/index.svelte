<script lang="ts">
  import { onDestroy } from 'svelte';
  import bgImg  from '../../../assets/p3_background.png';
  import rtmImg from '../../../assets/read_to_me.png';

  import mergedSong from '../../../assets/merged_song.mp3';

  const { onBack, onNext } = $props<{ onBack: () => void; onNext: () => void }>();

  let playing = $state(false);
  let currentMaori = $state('Ngā Tae');
  let currentEnglish = $state('The Colours');

  // Timed lyrics based on exact clip durations
  const lyrics = [
    { start: 0,     maori: 'Mā is white',    english: 'Mā = White' },
    { start: 3.056, maori: 'Whero is red',   english: 'Whero = Red' },
    { start: 4.832, maori: 'Kākāriki green', english: 'Kākāriki = Green' },
    { start: 8.280, maori: 'Pango is black', english: 'Pango = Black' },
    { start: 9.900, maori: 'Mangu is too',   english: 'Mangu = Black too' },
  ];

  const audio = new Audio(mergedSong);
  audio.preload = 'auto';

  // Update lyrics in sync with playback
  audio.ontimeupdate = () => {
    const t = audio.currentTime;
    // Find the last lyric whose start time is <= current time
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (t >= lyrics[i].start) {
        currentMaori = lyrics[i].maori;
        currentEnglish = lyrics[i].english;
        break;
      }
    }
  };

  audio.onended = () => {
    playing = false;
    audio.currentTime = 0;
    currentMaori = 'Ngā Tae';
    currentEnglish = 'The Colours';
  };

  function handlePlay() {
    if (playing) {
      audio.pause();
      playing = false;
    } else {
      audio.play();
      playing = true;
    }
  }

  onDestroy(() => {
    audio.pause();
  });
</script>

<div class="full-screen-wrapper">
  <div class="game-stage" style="background-image: url({bgImg})">

    <button class="back-btn" onclick={onBack}>← Map</button>

    <div class="lyrics-overlay-container" class:active-session={playing}>
      <div class="lyrics-board-content">
        <h2 class="maori-line">{currentMaori}</h2>
        <p class="english-line">{currentEnglish}</p>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="btn-rtm">
        <img src={rtmImg} alt=""/>
        Read to me
      </button>
      <button class="btn-play" onclick={handlePlay}>
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
      <button class="btn-next" onclick={onNext}>Next →</button>
    </div>

    <p class="copyright">🎵 Ngā Tae — Audio by Toi Tū Toi Ora. Educational use only.</p>

  </div>
</div>

<style>
  :global(html, body) {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
  }
  .full-screen-wrapper {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    overflow: hidden;
  }
  .game-stage {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    font-family: 'Nunito', sans-serif;
    overflow: hidden;
  }
  .lyrics-overlay-container {
    position: absolute;
    top: 48%;
    left: 51.1%;
    transform: translate(-50%, -50%);
    width: 42%;
    height: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    border-radius: 12px;
    background-color: #fbe0b3;
  }
  .lyrics-board-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    text-align: center;
    width: 95%;
  }
  .maori-line {
    font-size: clamp(20px, 4.5vh, 44px);
    font-weight: 900;
    color: #2c1a04;
    margin: 0;
    line-height: 1.1;
  }
  .english-line {
    font-size: clamp(14px, 2.8vh, 26px);
    font-weight: 800;
    color: #593e1a;
    margin: 0;
    line-height: 1.1;
  }
  .back-btn {
    position: absolute;
    top: 3%; left: 3%;
    z-index: 10;
    background: rgba(255,255,255,.95);
    border: none; border-radius: 50px;
    padding: 10px 24px;
    font-size: 15px; font-weight: 800; color: #374151;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    font-family: 'Nunito', sans-serif;
  }
  .bottom-bar {
    position: absolute;
    bottom: 4%; left: 4%; right: 4%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .btn-rtm {
    background: rgba(255,255,255,.95);
    border: 2px solid rgba(255,255,255,1);
    border-radius: 50px;
    padding: 12px 24px;
    font-size: 15px; font-weight: 700; color: #374151;
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    font-family: 'Nunito', sans-serif;
  }
  .btn-rtm img { width: 20px; height: 20px; object-fit: contain; }
  .btn-play {
    background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
    border: none; border-radius: 50px;
    padding: 14px 64px;
    font-size: 24px; font-weight: 900; color: #fff;
    cursor: pointer;
    box-shadow: 0 5px 0 #15803d, 0 6px 20px rgba(0,0,0,.25);
    font-family: 'Nunito', sans-serif;
  }
  .btn-next {
    background: linear-gradient(180deg, #FDE68A 0%, #F59E0B 100%);
    border: none; border-radius: 50px;
    padding: 14px 40px;
    font-size: 20px; font-weight: 900; color: #78350f;
    cursor: pointer;
    box-shadow: 0 5px 0 #b45309, 0 6px 20px rgba(0,0,0,.2);
    font-family: 'Nunito', sans-serif;
  }
  .copyright {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: rgba(255,255,255,0.7);
    z-index: 10;
    white-space: nowrap;
    font-family: 'Nunito', sans-serif;
  }
</style>