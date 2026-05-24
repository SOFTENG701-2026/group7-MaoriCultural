<script lang="ts">
  import bgImg from '../../../assets/p2_goal_background.png';
  import kiwiImg from '../../../assets/kiwihello.png';
  import rtmImg from '../../../assets/read_to_me.png';

  const { onStart, onback } = $props<{ onStart: () => void; onback: () => void }>();

  function readToMe() {
    speechSynthesis.cancel();
    const text = "Today's song is about colours in Māori.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-NZ';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }
</script>

<div class="full-screen-wrapper">
  <div class="game-stage" style="background-image: url({bgImg});">

    <div class="top-header">
      <div class="user-badge">
        <img src={kiwiImg} alt="kiwi" />
        <div class="user-info">
          <span class="kia-ora">Kia ora!</span>
          <span class="badge-tag">Explorer 🌿</span>
        </div>
      </div>
    </div>

    <!-- Bottom left: Back to map -->
    <button class="back-btn" onclick={onback}>← Map</button>

    <!-- Bottom center: Start + Read to me -->
    <div class="action-footer">
      <button onclick={onStart} class="action-start-button">▶ Start</button>
      <button onclick={readToMe} class="action-rtm-button">
        <img src={rtmImg} alt="Read to me" class="rtm-img" />
      </button>
    </div>

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
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
    font-family: 'Nunito', sans-serif; overflow: hidden;
  }
  .top-header {
    position: absolute; top: 2%; left: 3%;
    display: flex; align-items: center; z-index: 20;
  }
  .user-badge {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.95); border-radius: 50px;
    padding: 6px 16px 6px 6px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
  .user-badge img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
  .user-info { display: flex; flex-direction: column; }
  .kia-ora { font-size: 14px; font-weight: 800; color: #2d5a1b; line-height: 1.2; }
  .badge-tag { font-size: 11px; font-weight: 700; color: #2d7dd2; }

  /* Bottom left */
  .back-btn {
    position: absolute; bottom: 5%; left: 4%; z-index: 20;
    background: rgba(255,255,255,.95); border: none; border-radius: 50px;
    padding: 10px 24px; font-size: 15px; font-weight: 800; color: #374151;
    cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.15);
    font-family: 'Nunito', sans-serif;
  }

  /* Bottom center */
  .action-footer {
    position: absolute; bottom: 3%; left: 50%;
    transform: translateX(-50%); z-index: 20;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .action-start-button {
    background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
    border: none; border-radius: 50px; padding: 14px 80px;
    font-size: 26px; font-weight: 900; color: #fff; cursor: pointer;
    box-shadow: 0 6px 0 #15803d, 0 6px 20px rgba(0,0,0,0.25);
    font-family: 'Nunito', sans-serif;
  }
  .action-rtm-button {
    background: none; border: none;
    cursor: pointer; padding: 0;
  }
  .rtm-img { height: 52px; object-fit: contain; display: block; }
</style>
