<script lang="ts">
  import bgImg from '../../../assets/p2_goal_background.png';
  import kiwiImg from '../../../assets/kiwihello.png';
  import settingsImg from '../../../assets/settings.png';
  import rewardsImg from '../../../assets/rewards.png';
  import rtmImg from '../../../assets/read_to_me.png';
  
  const { onStart } = $props<{ onStart: () => void }>();
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
      <div class="utility-buttons">
        <button class="nav-btn">
          <img src={settingsImg} alt="Settings" />
          <span>Settings</span>
        </button>
        <button class="nav-btn">
          <img src={rewardsImg} alt="Rewards" />
          <span>Rewards</span>
        </button>
      </div>
    </div>

    <div class="action-footer">
      <button onclick={onStart} class="action-start-button">▶ Start</button>
      <button class="action-rtm-button">
        <img src={rtmImg} alt="" />
        Read to me
      </button>
    </div>

  </div>
</div>

<style>
  /* Force the whole browser window fullscreen safely */
  :global(html, body) {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
  }

  .full-screen-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  /* Renders the artwork completely full screen */
  .game-stage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
    font-family: 'Nunito', sans-serif;
    overflow: hidden;
  }

  /* Header System Positioning */
  .top-header {
    position: absolute;
    top: 2%;
    left: 3%;
    right: 3%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50px;
    padding: 6px 16px 6px 6px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .user-badge img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .kia-ora {
    font-size: 14px;
    font-weight: 800;
    color: #2d5a1b;
    line-height: 1.2;
  }

  .badge-tag {
    font-size: 11px;
    font-weight: 700;
    color: #2d7dd2;
  }

  .utility-buttons {
    display: flex;
    gap: 10px;
  }

  .nav-btn {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .nav-btn img {
    width: 24px;
    height: 24px;
  }

  .nav-btn span {
    font-size: 10px;
    font-weight: 800;
    color: #555;
  }

  /* Footer Controls Layout matching the background ground line */
  .action-footer {
    position: absolute;
    bottom: 4%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .action-start-button {
    background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
    border: none;
    border-radius: 50px;
    padding: 14px 80px;
    font-size: 26px;
    font-weight: 900;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 6px 0 #15803d, 0 6px 20px rgba(0,0,0,0.25);
    font-family: 'Nunito', sans-serif;
  }

  .action-rtm-button {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(255, 255, 255, 1);
    border-radius: 50px;
    padding: 10px 24px;
    font-size: 15px;
    font-weight: 700;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Nunito', sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .action-rtm-button img {
    width: 20px;
    height: 20px;
  }
</style>