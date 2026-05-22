const { useState, useEffect } = React;

const ASSET = (name) => `assets/${name}`;

// Order follows the learning trail from bottom to top.
const MODULE_ORDER = ['waiata', 'pepeha', 'customs', 'myths'];
const HOTSPOTS = [
  // Coordinates are tuned to the signboards in the expanded p1_background1 artwork.
  // The buttons stay invisible, so tapping feels like tapping the signs themselves.
  { id: 'waiata',  title: 'Waiata',  subtitle: 'Songs',         x: 61.2, y: 76.8, w: 14.8, h: 10.8, kiwiX: 46.8, kiwiY: 83.7, color: 'var(--kura)' },
  { id: 'pepeha',  title: 'Pepeha',  subtitle: 'My story',      x: 56.3, y: 62.7, w: 14.8, h: 10.5, kiwiX: 47.7, kiwiY: 68.9, color: '#7D4CD7' },
  { id: 'customs', title: 'Tikanga', subtitle: 'Kind actions',  x: 45.0, y: 49.9, w: 13.8, h: 10.0, kiwiX: 37.2, kiwiY: 55.9, color: '#D99014' },
  { id: 'myths',   title: 'Pūrākau', subtitle: 'Stories',       x: 50.4, y: 38.9, w: 13.8, h: 9.6,  kiwiX: 42.5, kiwiY: 44.9, color: '#1E80D5' }
];

function getNextHotspot(completed) {
  const nextId = MODULE_ORDER[completed.length] || MODULE_ORDER[MODULE_ORDER.length - 1];
  return HOTSPOTS.find(h => h.id === nextId) || HOTSPOTS[0];
}

function KiwiWalker({ x, y, walking, dancing }) {
  return (
    <img
      className={`map-kiwi ${walking ? 'walking' : ''} ${dancing ? 'dancing' : ''}`}
      src={ASSET('kiwigo.png')}
      alt="Kiki the Kiwi"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
}

function FloatingImageButton({ className, src, alt, onClick }) {
  return (
    <button className={className} onClick={onClick} aria-label={alt}>
      <img src={src} alt={alt} draggable="false" />
    </button>
  );
}

function HomeChrome({ onTeacher }) {
  return (
    <>
      <img className="home-profile-card" src={ASSET('kia_ora_explorer.png')} alt="Kia ora Explorer" draggable="false" />
      <FloatingImageButton className="home-corner-icon settings" src={ASSET('settings.png')} alt="Settings" onClick={() => {}} />
      <FloatingImageButton className="home-corner-icon rewards" src={ASSET('rewards.png')} alt="Rewards" onClick={() => {}} />
      <FloatingImageButton className="home-pill read" src={ASSET('read_to_me.png')} alt="Read to me" onClick={() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance('Welcome to Kiwi\'s Aotearoa Adventure. Tap Waiata first, then keep exploring the path.');
          u.rate = 0.9;
          u.pitch = 1.05;
          window.speechSynthesis.speak(u);
        }
      }} />
      <FloatingImageButton className="home-pill teacher" src={ASSET('teacher_view.png')} alt="Teacher view" onClick={onTeacher} />
    </>
  );
}

function TeacherOverlay({ completed, onClose }) {
  return (
    <div className="teacher-overlay" onClick={onClose}>
      <div className="teacher-card" onClick={(e) => e.stopPropagation()}>
        <div className="teacher-card-title">Teacher View</div>
        <div className="teacher-card-row"><span>Completed modules</span><b>{completed.length} / 4</b></div>
        <div className="teacher-card-row"><span>Current suggested module</span><b>{getNextHotspot(completed).title}</b></div>
        <div className="teacher-card-row"><span>Core flow</span><b>Goal → Listen → Sing → Word → Meaning → Finish</b></div>
        <p>This version keeps the child-friendly cartoon UI while preserving the original Waiata learning flow.</p>
        <button className="cartoon-action-button next teacher-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function WorldMap({ onHotspotClick, completed, characterPos, onTeacher }) {
  return (
    <div className="home-map-stage">
      <div className="stage-16x9">
        <img className="home-map-bg" src={ASSET('p1_background1.png')} alt="Kiwi's Aotearoa Adventure map" draggable="false" />
        <HomeChrome onTeacher={onTeacher} />
        {HOTSPOTS.map((h) => {
          const done = completed.includes(h.id);
          return (
            <button
              key={h.id}
              className={`home-hotspot ${done ? 'completed' : ''}`}
              aria-label={`${h.title} ${h.subtitle}`}
              onClick={() => onHotspotClick(h)}
              style={{
                left: `${h.x - h.w / 2}%`,
                top: `${h.y - h.h / 2}%`,
                width: `${h.w}%`,
                height: `${h.h}%`
              }}
            >
              <span className="hotspot-hit-glow" />
              {done && <span className="hotspot-complete-mark">✓</span>}
            </button>
          );
        })}
        <KiwiWalker {...characterPos} />
      </div>
    </div>
  );
}

function ModuleOverlay({ hotspot, onClose, onComplete }) {
  if (!hotspot) return null;
  const Component = {
    waiata: WaiataModule,
    pepeha: PepehaModule,
    customs: CustomsModule,
    myths: MythsModule
  }[hotspot.id];

  return (
    <div className="module-overlay-cartoon">
      <button className="module-map-back" onClick={onClose}>← Map</button>
      <Component hotspot={hotspot} onComplete={() => { onComplete(hotspot.id); onClose(); }} />
    </div>
  );
}

function Completion({ onRestart }) {
  return (
    <div className="completion-overlay">
      <div className="completion-card">
        <img src={ASSET('youdidit.png')} alt="You did it" draggable="false" />
        <button className="cartoon-action-button next" onClick={onRestart}>Explore again →</button>
      </div>
    </div>
  );
}

function MapExplorer() {
  const params = new URLSearchParams(window.location.search);
  const initialOpen = HOTSPOTS.find((h) => h.id === params.get('open')) || null;
  const initialCompleted = [];
  const startStop = initialOpen || getNextHotspot(initialCompleted);

  const [completed, setCompleted] = useState(initialCompleted);
  const [activeHotspot, setActiveHotspot] = useState(initialOpen);
  const [characterPos, setCharacterPos] = useState({
    x: startStop.kiwiX,
    y: startStop.kiwiY,
    walking: false,
    dancing: false
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);

  useEffect(() => {
    window.__goto = (id) => {
      if (!id || id === 'map') {
        setActiveHotspot(null);
        return;
      }
      const h = HOTSPOTS.find((x) => x.id === id);
      if (h) {
        setCharacterPos({ x: h.kiwiX, y: h.kiwiY, walking: false, dancing: false });
        setActiveHotspot(h);
      }
    };
  }, []);

  function handleHotspotClick(h) {
    setCharacterPos({ x: h.kiwiX, y: h.kiwiY, walking: true, dancing: false });
    setTimeout(() => {
      setCharacterPos((p) => ({ ...p, walking: false }));
      setActiveHotspot(h);
    }, 900);
  }

  function handleComplete(id) {
    if (!completed.includes(id)) {
      const nextCompleted = [...completed, id];
      setCompleted(nextCompleted);
      setCharacterPos((p) => ({ ...p, dancing: true }));
      setTimeout(() => {
        const nextStop = getNextHotspot(nextCompleted);
        if (nextStop) {
          setCharacterPos({ x: nextStop.kiwiX, y: nextStop.kiwiY, walking: true, dancing: false });
          setTimeout(() => setCharacterPos((p) => ({ ...p, walking: false })), 900);
        }
      }, 700);
      if (nextCompleted.length === MODULE_ORDER.length) {
        setTimeout(() => setShowCompletion(true), 1500);
      }
    }
  }

  function handleRestart() {
    const nextStop = getNextHotspot([]);
    setCompleted([]);
    setShowCompletion(false);
    setActiveHotspot(null);
    setCharacterPos({ x: nextStop.kiwiX, y: nextStop.kiwiY, walking: false, dancing: false });
  }

  return (
    <div className="app-fullscreen-cartoon">
      <WorldMap onHotspotClick={handleHotspotClick} completed={completed} characterPos={characterPos} onTeacher={() => setShowTeacher(true)} />
      <ModuleOverlay hotspot={activeHotspot} onClose={() => setActiveHotspot(null)} onComplete={handleComplete} />
      {showTeacher && <TeacherOverlay completed={completed} onClose={() => setShowTeacher(false)} />}
      {showCompletion && <Completion onRestart={handleRestart} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MapExplorer />);
