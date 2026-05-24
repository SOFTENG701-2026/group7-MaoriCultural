<script lang="ts">
  import { onDestroy } from 'svelte';
  import bgImg from '../../../assets/p3_background.png';
  import rtmImg from '../../../assets/read_to_me.png';
  import mergedSong from '../../../assets/merged_song.mp3';

  const { onBack, onNext } = $props<{ onBack: () => void; onNext: () => void }>();

  let playing = $state(false);
  let currentMaori = $state('Mā is white');
  let currentEnglish = $state('Mā = White');

  const lyrics = [
    { start: 0.31,  maori: 'Mā is white',       english: 'Mā = White' },
    { start: 2.94,  maori: 'Whero is red',       english: 'Whero = Red' },
    { start: 5.44,  maori: 'Kākāriki is green',  english: 'Kākāriki = Green' },
    { start: 8.77,  maori: 'Pango is black',     english: 'Pango = Black' },
    { start: 10.46, maori: 'Mangu is too',       english: 'Mangu = Black too' },
    { start: 12.16, maori: 'A, E, I, O, U',     english: 'The vowels of te reo Māori' },
  ];

  const audio = new Audio(mergedSong);
  audio.preload = 'auto';

  audio.ontimeupdate = () => {
    const t = audio.currentTime;
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
    currentMaori = 'Mā is white';
    currentEnglish = 'Mā = White';
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

  function readToMe() {
    speechSynthesis.cancel();
    const text = 'Mā is white. Whero is red. Kākāriki is green. Pango is black. Mangu is too. A, E, I, O, U.';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-NZ';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }

  onDestroy(() => {
    audio.pause();
    speechSynthesis.cancel();
  });
</script>

<div class="full-screen-wrapper">
  <div class="game-stage" style="background-image: url({bgImg})">

    <p class="copyright">🎵 Ngā Tae — Audio by Toi Tū Toi Ora. Educational use only.</p>

    <div class="lyrics-overlay-container" class:active-session={playing}>
      <div class="lyrics-board-content">
        <h2 class="maori-line">{currentMaori}</h2>
        <p class="english-line">{currentEnglish}</p>
      </div>
    </div>

    <!-- Bottom left: Back -->
    <button class="back-btn" onclick={onBack}>← Back</button>

    <!-- Bottom center: Play + Read to me -->
    <div class="center-footer">
      <button class="btn-play" onclick={handlePlay}>
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
      <button class="btn-rtm" onclick={readToMe}>
        <img src={rtmImg} alt="Read to me" class="rtm-img"/>
      </button>
    </div>

    <!-- Bottom right: Next -->
    <button class="btn-next" onclick={onNext}>Next →</button>

  </div>
</div>

<style>
  :global(html, body) {
    margin: 0 !important; padding: 0 !important;
    width: 100vw !important; height: 100vh !important;
    overflow: hidden !important;
  }
  .full-screen-wrapper {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh; overflow: hidden;
  }
  .game-stage {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    font-family: 'Nunito', sans-serif; overflow: hidden;
  }
  .copyright {
    position: absolute; top: 3%; right: 3%;
    font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.85);
    background: rgba(0,0,0,0.25);
    padding: 6px 14px; border-radius: 20px;
    z-index: 10; margin: 0;
    font-family: 'Nunito', sans-serif;
    white-space: nowrap;
  }
  .lyrics-overlay-container {
    position: absolute; top: 48%; left: 51.1%;
    transform: translate(-50%, -50%);
    width: 42%; height: 25%;
    display: flex; justify-content: center; align-items: center;
    z-index: 5; border-radius: 12px; background-color: #fbe0b3;
  }
  .lyrics-board-content {
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    gap: 8px; text-align: center; width: 95%;
  }
  .maori-line {
    font-size: clamp(20px, 4.5vh, 44px); font-weight: 900;
    color: #2c1a04; margin: 0; line-height: 1.1;
  }
  .english-line {
    font-size: clamp(14px, 2.8vh, 26px); font-weight: 800;
    color: #593e1a; margin: 0; line-height: 1.1;
  }
  /* Bottom left */
  .back-btn {
    position: absolute; bottom: 5%; left: 4%; z-index: 10;
    background: rgba(255,255,255,.95); border: none; border-radius: 50px;
    padding: 10px 24px; font-size: 15px; font-weight: 800; color: #374151;
    cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.15);
    font-family: 'Nunito', sans-serif;
  }
  /* Bottom center */
  .center-footer {
    position: absolute; bottom: 3%; left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex; flex-direction: column;
    align-items: center; gap: 10px;
  }
  .btn-play {
    background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
    border: none; border-radius: 50px; padding: 14px 64px;
    font-size: 24px; font-weight: 900; color: #fff; cursor: pointer;
    box-shadow: 0 5px 0 #15803d, 0 6px 20px rgba(0,0,0,.25);
    font-family: 'Nunito', sans-serif;
  }
  .btn-rtm {
    background: none; border: none;
    cursor: pointer; padding: 0;
  }
  .rtm-img {
    height: 52px; object-fit: contain; display: block;
  }
  /* Bottom right */
  .btn-next {
    position: absolute; bottom: 5%; right: 4%;
    z-index: 10;
    background: linear-gradient(180deg, #FDE68A 0%, #F59E0B 100%);
    border: none; border-radius: 50px; padding: 14px 40px;
    font-size: 20px; font-weight: 900; color: #78350f; cursor: pointer;
    box-shadow: 0 5px 0 #b45309, 0 6px 20px rgba(0,0,0,.2);
    font-family: 'Nunito', sans-serif;
  }
</style>
