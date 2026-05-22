// Cultural modules — the 4 learning experiences a child can complete on the map.
//
// EVERY module follows the same 4-phase framework, mapped to Kolb's experiential
// learning cycle:
//
//   PHASE 1 · TRIGGER       (Concrete Experience)
//       Full-screen scene fades in. Brief, atmospheric. One sentence prompt.
//   PHASE 2 · INPUT         (Cognitivist · dual coding)
//       One concept per screen. Big visual background. Audio plays automatically,
//       and the matching syllable/word highlights KTV-style. Only Play/Pause + Next.
//   PHASE 3 · REFLECT       (Reflective Observation · scaffolded by Kiwi NPC)
//       Kiwi guide asks one connecting question linking the lesson to the child's
//       real life. Two PICTURE options — no text-heavy choices.
//   PHASE 4 · CHALLENGE     (Active Experimentation)
//       Drag-and-drop / line-match / sort. Non-text-dependent for ages 5–8.
//
// A PhaseRail across the top of every scene shows the child where they are.

const { useState, useEffect, useRef } = React;
const UI_ASSET = (name) => `assets/${name}`;

// ============================================================
// SHARED PRIMITIVES
// ============================================================

const PHASES = [
  { id: 'start',     label: 'Start',     icon: '✨' },
  { id: 'listen',    label: 'Listen',    icon: '👂' },
  { id: 'think',     label: 'Think',     icon: '💭' },
  { id: 'play',      label: 'Play',      icon: '🎯' }
];

// Top rail showing the 4 phases. Always visible inside a scene.
function PhaseRail({ current, color, phases = PHASES }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      gap:5, padding:'10px 0 8px', background:'transparent'
    }}>
      {phases.map((p, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <React.Fragment key={p.id}>
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              padding: active ? '7px 13px' : '7px 9px',
              borderRadius:999,
              background: active ? color : done ? 'rgba(45,95,63,0.12)' : 'rgba(42,31,26,0.06)',
              color: active ? 'white' : done ? 'var(--forest)' : 'rgba(42,31,26,0.5)',
              fontFamily:'Bricolage Grotesque', fontWeight:800, fontSize: active ? 14 : 12,
              transition: 'all .3s var(--t-bounce)'
            }}>
              <span style={{fontSize:14}}>{done ? '✓' : p.icon}</span>
              {(active || done) && <span>{p.label}</span>}
              <span style={{
                opacity:0.6, fontSize:11,
                fontVariantNumeric:'tabular-nums'
              }}>{i+1}/{phases.length}</span>
            </div>
            {i < phases.length - 1 && (
              <div style={{
                width:15, height:2, background: done ? 'var(--forest)' : 'rgba(42,31,26,0.12)'
              }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Minimal bottom action bar: only Play/Pause + Next (matches your spec for Phase 2).
function SceneFooter({ children }) {
  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:40,
      padding:'16px 28px 22px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      gap:14,
      background:'linear-gradient(to top, rgba(244,235,217,0.96) 0%, rgba(244,235,217,0.80) 52%, rgba(244,235,217,0) 100%)',
      pointerEvents:'none'
    }}>
      <div style={{pointerEvents:'auto', display:'contents'}}>{children}</div>
    </div>
  );
}

function BigPlay({ playing, onClick, label='Play' }) {
  return (
    <button onClick={onClick} style={{
      display:'inline-flex', alignItems:'center', gap:14,
      background: playing ? 'var(--kura)' : 'var(--gold)',
      color: playing ? 'white' : 'var(--charcoal)',
      padding:'18px 28px', borderRadius:999,
      fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:22,
      boxShadow:'var(--shadow-warm)'
    }}>
      {playing ? (
        <span style={{display:'inline-flex', gap:3}}>
          <span className="wave-bar" style={{height:18}}/>
          <span className="wave-bar" style={{height:26, animationDelay:'.15s'}}/>
          <span className="wave-bar" style={{height:14, animationDelay:'.3s'}}/>
        </span>
      ) : (
        <span style={{
          width:0, height:0, borderLeft:'14px solid currentColor',
          borderTop:'10px solid transparent', borderBottom:'10px solid transparent'
        }}/>
      )}
      {playing ? 'Listening…' : label}
    </button>
  );
}

function NextButton({ onClick, disabled, label='Next' }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? 'rgba(42,31,26,0.15)' : 'var(--kura)',
      color:'white', padding:'18px 32px', borderRadius:999,
      fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:22,
      boxShadow: disabled ? 'none' : 'var(--shadow-warm)',
      opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer'
    }}>
      {label} →
    </button>
  );
}

// Kiwi NPC — the reflection guide. Speech-bubble component for Phase 3.
// (Distinct from the on-map Tamariki character.)
function KiwiGuide({ children, size='md' }) {
  const dim = size === 'lg' ? 92 : 72;
  return (
    <div style={{display:'flex', gap:18, alignItems:'flex-end', maxWidth:680, margin:'0 auto'}}>
      {/* Kiwi bird — round brown body, long beak, no wings */}
      <div style={{
        width:dim, height:dim, flexShrink:0, position:'relative'
      }}>
        {/* body */}
        <div style={{
          position:'absolute', inset:0, borderRadius:'50% 50% 48% 48%',
          background:'#7A5A3A',
          boxShadow:'inset -6px -8px 0 rgba(0,0,0,0.18), var(--shadow-soft)'
        }}/>
        {/* feather texture */}
        <div style={{
          position:'absolute', inset:8, borderRadius:'50% 50% 48% 48%',
          background:'repeating-radial-gradient(circle at 30% 30%, rgba(0,0,0,0.08) 0 2px, transparent 2px 6px)'
        }}/>
        {/* eye */}
        <div style={{
          position:'absolute', top:'30%', right:'24%', width:10, height:10,
          borderRadius:'50%', background:'var(--charcoal)'
        }}>
          <div style={{position:'absolute', top:1, left:2, width:3, height:3, borderRadius:'50%', background:'white'}}/>
        </div>
        {/* long beak */}
        <div style={{
          position:'absolute', top:'42%', right:'-22%',
          width: dim*0.5, height:6, borderRadius:'0 4px 4px 0',
          background:'#3A2818',
          transform:'rotate(8deg)', transformOrigin:'left center'
        }}/>
        {/* feet */}
        <div style={{position:'absolute', bottom:-4, left:'30%', width:8, height:6, background:'#3A2818', borderRadius:'2px 2px 4px 4px'}}/>
        <div style={{position:'absolute', bottom:-4, right:'30%', width:8, height:6, background:'#3A2818', borderRadius:'2px 2px 4px 4px'}}/>
      </div>
      <div style={{
        background:'var(--bone)', padding:'18px 22px',
        borderRadius:'24px 24px 24px 4px',
        boxShadow:'var(--shadow-warm)',
        fontSize:22, lineHeight:1.4, color:'var(--charcoal)', flex:1
      }}>
        <div style={{fontSize:11, fontFamily:'Bricolage Grotesque', fontWeight:700,
          color:'var(--forest)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6}}>
          Kiwi asks…
        </div>
        {children}
      </div>
    </div>
  );
}

// Two-picture choice block for Phase 3.
function PictureChoice({ options, picked, onPick }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 1fr', gap:22,
      maxWidth:680, margin:'28px auto 0'
    }}>
      {options.map(opt => {
        const sel = picked === opt.id;
        return (
          <button key={opt.id} onClick={() => onPick(opt)} style={{
            background:'var(--bone)', borderRadius:'var(--r-md)',
            padding:18, textAlign:'center',
            border: sel ? `4px solid ${opt.right ? 'var(--forest)' : 'var(--kura)'}` : '4px solid transparent',
            boxShadow: sel ? 'var(--shadow-deep)' : 'var(--shadow-soft)',
            transform: sel ? 'translateY(-4px)' : 'none',
            transition: 'all .25s var(--t-bounce)'
          }}>
            <div style={{
              height:120, background:'var(--parchment-deep)', borderRadius:'var(--r-sm)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:64, marginBottom:12
            }}>{opt.emoji}</div>
            <div className="font-display" style={{fontSize:20}}>{opt.label}</div>
            {sel && (
              <div style={{
                marginTop:10, padding:'8px 12px', borderRadius:12,
                background: opt.right ? 'rgba(45,95,63,0.12)' : 'rgba(181,52,28,0.1)',
                color: opt.right ? 'var(--forest)' : 'var(--kura)',
                fontSize:14, lineHeight:1.4
              }}>{opt.feedback}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Badge celebration (terminal Phase 4 reward → returns to map).
// Now also explains which CULTURAL ITEM the child unlocks on their character.
function BadgeReward({ icon, title, blurb, item, onClose }) {
  return (
    <div className="badge-reward-overlay" role="dialog" aria-modal="true" aria-label={title || 'Badge earned'}>
      <PetalBurst running count={26}/>
      <div className="badge-reward-card">
        <img className="badge-reward-card-img" src={UI_ASSET('badge_card.png')} alt={title || 'Badge earned'} draggable="false" />
        <button className="badge-back-map-button" onClick={onClose} aria-label="Back to the map">
          <img src={UI_ASSET('badgebacktomap.png')} alt="Back to the map" draggable="false" />
        </button>
      </div>
    </div>
  );
}

// ----- Celebration: petal burst (Kōwhai-yellow blooms flying outward) -----
// Renders once when `running` becomes truthy; re-mount with a key to retrigger.
function PetalBurst({ running, count = 18 }) {
  if (!running) return null;
  return (
    <div style={{
      position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'
    }}>
      {Array.from({length: count}).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 120 + (i % 4) * 40;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 40;
        const emoji = ['🌼','🌸','✨','🌺','🌟'][i % 5];
        return (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%',
            fontSize: 28 + (i % 3) * 8,
            animation: `petal-fly 1.2s ${i * 0.02}s ease-out forwards`,
            ['--tx']: `${tx}px`,
            ['--ty']: `${ty}px`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}>{emoji}</div>
        );
      })}
    </div>
  );
}

// ----- Gentle hint bubble from Kiwi (NEVER a ❌). Auto-dismisses. -----
function GentleHint({ msg, onDone }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [msg, onDone]);
  if (!msg) return null;
  return (
    <div style={{
      position:'absolute', top:18, left:'50%', transform:'translateX(-50%)',
      zIndex:30, animation:'fade-in .25s ease', maxWidth:560, width:'90%'
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:14,
        background:'var(--bone)', padding:'14px 22px',
        borderRadius:'24px',
        boxShadow:'var(--shadow-deep)',
        border:'2px solid var(--forest)'
      }}>
        {/* mini kiwi head */}
        <div style={{
          width:44, height:44, borderRadius:'50% 50% 48% 48%',
          background:'#7A5A3A', flexShrink:0, position:'relative',
          boxShadow:'inset -3px -4px 0 rgba(0,0,0,0.18)'
        }}>
          <div style={{position:'absolute', top:'30%', right:'20%', width:6, height:6,
            borderRadius:'50%', background:'var(--charcoal)'}}/>
          <div style={{position:'absolute', top:'42%', right:'-30%', width:18, height:4,
            borderRadius:'0 4px 4px 0', background:'#3A2818', transform:'rotate(8deg)'}}/>
        </div>
        <div>
          <div style={{fontSize:11, fontFamily:'Bricolage Grotesque', fontWeight:700,
            color:'var(--forest)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:2}}>
            Kiwi hints…
          </div>
          <div style={{fontSize:16, lineHeight:1.4, color:'var(--charcoal)'}}>{msg}</div>
        </div>
      </div>
    </div>
  );
}

// Tiny per-module reward item descriptors.
const ITEMS = {
  waiata:  { emoji: '🪶', name: 'Feather',        detail: 'Wear it for singing' },
  pepeha:  { emoji: '💚', name: 'Pounamu pendant',detail: 'Carries your place' },
  customs: { emoji: '🟡', name: 'Korowai (cloak)',detail: 'For caring for guests' },
  myths:   { emoji: '🛶', name: 'Waka paddle',    detail: 'For carrying stories' }
};

// Scene wrapper providing the gradient backdrop + phase rail + content area.
// `bg` should be a CSS background string. Per phase, scenes set their own bg.
function Scene({ phase, color, bg, children, steps }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      background: bg,
      display:'flex', flexDirection:'column',
      transition:'background .5s ease'
    }}>
      <PhaseRail current={phase} color={color} phases={steps || PHASES}/>
      <div style={{flex:1, position:'relative', overflowX:'hidden', overflowY:'auto'}}>
        {children}
      </div>
    </div>
  );
}


// ============================================================
// PAIR 3 UI LAYER — child-friendly, accessible, reusable shells
// ============================================================
function speakText(text) {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/ā/g, 'a').replace(/ū/g, 'u'));
  utterance.rate = 0.86;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function ReadToMeButton({ text, light=false }) {
  return (
    <button
      className={`read-to-me ${light ? 'light' : ''}`}
      aria-label="Read this screen to me"
      onClick={() => speakText(text)}>
      🔊 Read to me
    </button>
  );
}

function CartoonDecor({ theme='song' }) {
  const icons = theme === 'song' ? ['🎵','🎶','✨','🌿','🪶'] : ['✨','🌿','☁️','⭐'];
  return (
    <div className="cartoon-decor" aria-hidden="true">
      {icons.map((ic, i) => <span key={i} style={{'--i': i}}>{ic}</span>)}
    </div>
  );
}

function LearningGoalCard({ title='Today\'s song', goals=[] }) {
  return (
    <div className="learning-goal-card" role="group" aria-label="Learning goal">
      <div className="sticker-title">🎯 {title}</div>
      <div className="goal-list">
        {goals.map((g, i) => (
          <div className="goal-chip" key={i}>
            <span className="goal-icon">{g.icon}</span>
            <span>{g.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BigLyricCard({ words, activeIndex=-1, translation, prompt }) {
  return (
    <div className="big-lyric-card" aria-label="Song lyric">
      <div className="lyric-prompt">{prompt}</div>
      <div className="lyric-line">
        {words.map((w, i) => (
          <span key={i} className={`lyric-word ${activeIndex === i ? 'active' : ''}`}>{w}</span>
        ))}
      </div>
      <div className="lyric-translation">{translation}</div>
    </div>
  );
}

function SimpleChoiceCard({ option, selected, correct, onPick }) {
  let stateClass = '';
  if (selected && correct) stateClass = 'correct';
  if (selected && correct === false) stateClass = 'wrong';
  return (
    <button className={`choice-card ${stateClass}`} onClick={() => onPick(option)} aria-label={option.label}>
      <div className="choice-emoji">{option.emoji}</div>
      <div className="choice-label">{option.label}</div>
      {selected && (
        <div className="choice-state">{correct ? '✅ That is right' : '💡 Try again'}</div>
      )}
    </button>
  );
}

function AccessibleFeedback({ type='hint', children }) {
  if (!children) return null;
  const icon = type === 'success' ? '✅' : type === 'ai' ? '🤖' : '💡';
  return (
    <div className={`accessible-feedback ${type}`} role="status" aria-live="polite">
      <span className="feedback-icon">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function AIHintBox({ children }) {
  return (
    <div className="ai-coach-card" role="status" aria-live="polite">
      <div className="ai-avatar" aria-hidden="true">🥝</div>
      <div className="ai-copy">
        <div className="ai-label">Kiwi AI Coach</div>
        <div className="ai-message">{children}</div>

      </div>
    </div>
  );
}

function TeacherSummaryCard({ joined, word, meaning }) {
  return (
    <div className="teacher-summary-card">
      <div className="summary-title">👩‍🏫 Teacher View</div>
      <div className="summary-row"><span>Participation</span><b>{joined ? 'Joined in' : 'Needs support'}</b></div>
      <div className="summary-row"><span>Key word</span><b>{word}</b></div>
      <div className="summary-row"><span>Meaning</span><b>{meaning}</b></div>
      <div className="summary-next"><b>Next step:</b> Practise again with picture prompts.</div>
    </div>
  );
}

// ============================================================
// MODULE 1 — WAIATA (Tūtira Mai Ngā Iwi)
// ============================================================
function WaiataModule({ hotspot, onComplete }) {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wordIdx, setWordIdx] = useState(-1);
  const [joinedIn, setJoinedIn] = useState(false);
  const [wordPick, setWordPick] = useState(null);
  const [meaningPick, setMeaningPick] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const timerRef = useRef();

  const waiataLine = {
    words: ['Tātou', 'tātou', 'e'],
    translation: 'All of us together'
  };

  const wordOptions = [
    { id:'tatou', emoji:'👨‍👩‍👧', label:'tātou', correct:true },
    { id:'whare', emoji:'🏠', label:'whare', correct:false },
    { id:'kai', emoji:'🍎', label:'kai', correct:false }
  ];

  const meaningOptions = [
    { id:'together', emoji:'👨‍👩‍👧', label:'Being together', correct:true },
    { id:'sleep', emoji:'🌙', label:'Going to sleep', correct:false },
    { id:'count', emoji:'1 2 3', label:'Counting numbers', correct:false }
  ];

  function clearTimers() {
    clearInterval(timerRef.current);
    setPlaying(false);
    setWordIdx(-1);
  }

  function playLine() {
    clearTimers();
    setPlaying(true);
    setWordIdx(0);
    let w = 0;
    timerRef.current = setInterval(() => {
      w++;
      if (w >= waiataLine.words.length) {
        clearTimers();
      } else {
        setWordIdx(w);
      }
    }, 720);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  function speak(text) {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/ā/g, 'a').replace(/ū/g, 'u'));
    u.rate = 0.88;
    u.pitch = 1.08;
    window.speechSynthesis.speak(u);
  }

  function nextPhase(n) {
    clearTimers();
    setFeedback(null);
    setAiMessage('');
    setPhase(n);
  }

  function handleTrySinging() {
    setJoinedIn(true);
    setAiMessage('Ka pai! Sing one short line with Kiki. You can do it!');
  }

  function handleWordPick(option) {
    setWordPick(option.id);
    if (option.correct) {
      setFeedback({ type:'success', text:'Ka pai! You heard “tātou”.' });
      setAiMessage('Great listening. “Tātou” means all of us together.');
    } else {
      setFeedback({ type:'hint', text:'Try again. Listen for the word that means all of us together.' });
      setAiMessage('Look for the word that matches the people together picture.');
    }
  }

  function handleMeaningPick(option) {
    setMeaningPick(option.id);
    if (option.correct) {
      setFeedback({ type:'success', text:'Ka pai! This waiata is about being together.' });
      setAiMessage('Nice thinking. You found the meaning of the song.');
    } else {
      setFeedback({ type:'hint', text:'Try again. Think about “all of us together”.' });
      setAiMessage('Which picture shows people together?');
    }
  }

  const wordResult = wordPick === 'tatou' ? 'tātou' : 'Needs practice';
  const meaningResult = meaningPick === 'together' ? 'Understood' : 'Needs practice';

  const readTexts = [
    'Today’s song. First listen, then join in, then learn the meaning.',
    'Listen. Tātou, tātou e. It means all of us together.',
    'Join in. Try singing the short line with Kiki.',
    'Which word did you hear? Choose tātou, whare, or kai.',
    'What is this song about? Choose being together, going to sleep, or counting numbers.',
    'You did it. You listened, sang, and found the meaning.'
  ];

  function AssetPage({ bg, children, pageClass='' }) {
    return (
      <div className="module-page-frame">
        <div className={`stage-16x9 page-stage ${pageClass}`}>
          {bg && <img className="page-bg-img" src={bg} alt="" draggable="false" />}
          {children}
        </div>
      </div>
    );
  }

  function ReadButton({ text, className='' }) {
    return (
      <button className={`asset-pill read-mini ${className}`} onClick={() => speak(text)}>
        <img src={UI_ASSET('read_to_me.png')} alt="Read to me" draggable="false" />
      </button>
    );
  }

  function KikiBubble({ children }) {
    if (!children) return null;
    return (
      <div className="kiki-bubble" role="status" aria-live="polite">
        <img src={UI_ASSET('kiwihello.png')} alt="Kiki" draggable="false" />
        <div>
          <div className="kiki-label">Kiki says</div>
          <div className="kiki-message">{children}</div>
        </div>
      </div>
    );
  }

  function FeedbackBubble({ data }) {
    if (!data) return null;
    const success = data.type === 'success';
    return (
      <div className={`cute-feedback ${success ? 'success' : 'hint'}`} role="status" aria-live="polite">
        <img src={UI_ASSET(success ? 'kiwiyes.png' : 'kiwitryagain.png')} alt={success ? 'Correct' : 'Try again'} draggable="false" />
        <div>
          <div className="cute-feedback-title">{success ? 'Yes!' : 'Try again'}</div>
          <div className="cute-feedback-text">{data.text}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {phase === 0 && (
        <AssetPage bg={UI_ASSET('p2_goal_background.png')} pageClass="goal-page-fix">
          <div className="goal-action-cluster">
            <button className="cartoon-action-button start bounce-soft" onClick={() => nextPhase(1)}>▶ Start</button>
            <ReadButton text={readTexts[0]} />
          </div>
        </AssetPage>
      )}

      {phase === 1 && (
        <AssetPage bg={UI_ASSET('p3_background.png')}>
          <button className="cartoon-action-button play fixed-play bounce-soft" onClick={playLine}>{playing ? 'Listening…' : '▶ Play'}</button>
          <ReadButton text={readTexts[1]} className="listen-read" />
          <button className="cartoon-action-button next fixed-next bounce-soft" onClick={() => nextPhase(2)}>Next →</button>
        </AssetPage>
      )}

      {phase === 2 && (
        <div className="asset-page sing-page q456-bg module-flow-page">
          <div className="sing-card-cartoon">
            <img className="sing-kiwi float-soft" src={UI_ASSET('kiwising.png')} alt="Kiki singing" draggable="false" />
            <div className="sing-content">
              <div className="ribbon-small">Join in</div>
              <h2>Tātou, tātou e</h2>
              <p>Sing and say the words.</p>
              <div className="sing-buttons">
                <button className="cartoon-action-button bounce-soft" onClick={handleTrySinging}>🎤 Try singing</button>
                <button className="cartoon-action-button help bounce-soft" onClick={() => setAiMessage('Listen first, then sing with Kiki. You only need one short line.')}>💡 Need help?</button>
              </div>
            </div>
          </div>
          <KikiBubble>{aiMessage}</KikiBubble>
          <div className="bottom-nav-cartoon">
            <button className="nav-soft" onClick={() => nextPhase(1)}>← Back</button>
            <ReadButton text={readTexts[2]} />
            <button className="cartoon-action-button next bounce-soft" onClick={() => nextPhase(3)} disabled={!joinedIn}>Next →</button>
          </div>
        </div>
      )}

      {phase === 3 && (
        <div className="asset-page quiz-cute-page word-bg q456-bg module-flow-page">
          <div className="quiz-card-cute">
            <div className="ribbon-small">Word check</div>
            <h2>Which word did you hear?</h2>
            <div className="choice-grid-cute">
              {wordOptions.map(o => (
                <button key={o.id} className={`cute-choice ${wordPick === o.id ? (o.correct ? 'correct' : 'wrong') : ''}`} onClick={() => handleWordPick(o)}>
                  <span className="choice-emoji-big">{o.emoji}</span>
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
          <FeedbackBubble data={feedback} />
          <KikiBubble>{aiMessage}</KikiBubble>
          <div className="bottom-nav-cartoon">
            <button className="nav-soft" onClick={() => nextPhase(2)}>← Back</button>
            <ReadButton text={readTexts[3]} />
            <button className="cartoon-action-button next bounce-soft" onClick={() => nextPhase(4)} disabled={wordPick !== 'tatou'}>Next →</button>
          </div>
        </div>
      )}

      {phase === 4 && (
        <div className="asset-page quiz-cute-page meaning-bg q456-bg module-flow-page">
          <div className="quiz-card-cute">
            <div className="ribbon-small">Meaning check</div>
            <h2>What is this song about?</h2>
            <div className="choice-grid-cute">
              {meaningOptions.map(o => (
                <button key={o.id} className={`cute-choice ${meaningPick === o.id ? (o.correct ? 'correct' : 'wrong') : ''}`} onClick={() => handleMeaningPick(o)}>
                  <span className="choice-emoji-big">{o.emoji}</span>
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
          <FeedbackBubble data={feedback} />
          <KikiBubble>{aiMessage}</KikiBubble>
          <div className="bottom-nav-cartoon">
            <button className="nav-soft" onClick={() => nextPhase(3)}>← Back</button>
            <ReadButton text={readTexts[4]} />
            <button className="cartoon-action-button next bounce-soft" onClick={() => nextPhase(5)} disabled={meaningPick !== 'together'}>Finish →</button>
          </div>
        </div>
      )}

      {phase === 5 && (
        <div className="asset-page finish-cute-page finish-reward-page module-flow-page">
          {!showBadge && <PetalBurst running count={16}/>} 
          <div className="finish-layout-cute finish-layout-reward">
            <div className="finish-hero-cute">
              <div className="finish-ribbon-reward">Reward time!</div>
              <div className="finish-image-wrap reward-glow">
                <img src={UI_ASSET('youdidit.png')} alt="You did it" draggable="false" />
              </div>
            </div>
            <div className="teacher-summary-cute reward-summary">
              <h3>🌟 Waiata complete!</h3>
              <div><span>Participation</span><b>{joinedIn ? 'Joined in' : 'Needs support'}</b></div>
              <div><span>Key word</span><b>{wordResult}</b></div>
              <div><span>Meaning</span><b>{meaningResult}</b></div>
              <p><b>Next step:</b> Tap Done to collect your badge.</p>
            </div>
          </div>
          {!showBadge && (
            <div className="bottom-nav-cartoon finish-bottom-nav">
              <ReadButton text={readTexts[5]} className="finish-read-left" />
              <button className="cartoon-action-button next bounce-soft" onClick={() => setShowBadge(true)}>Done →</button>
            </div>
          )}
        </div>
      )}

      {showBadge && (
        <BadgeReward icon="🎵" title="Waiata badge earned!"
          item={ITEMS.waiata}
          blurb="You listened, joined in, heard ‘tātou’, and learned that the waiata is about being together."
          onClose={onComplete}/>
      )}
    </>
  );
}

// ============================================================
// MODULE 2 — PEPEHA (Personal introduction)
// ============================================================
function PepehaModule({ hotspot, onComplete }) {
  const [phase, setPhase] = useState(0);
  const [conceptStep, setConceptStep] = useState(0); // 0..2 for the 3 concepts
  const [playing, setPlaying] = useState(false);
  const [reflectPick, setReflectPick] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const tref = useRef();

  // Three concepts to learn, one at a time
  const concepts = [
    { mi:'Ko ___ te maunga', en:'My mountain is ___', emoji:'⛰️', tag:'mountain' },
    { mi:'Ko ___ te awa',    en:'My river is ___',    emoji:'🌊', tag:'river' },
    { mi:'Ko ___ tōku ingoa',en:'My name is ___',     emoji:'👤', tag:'name' }
  ];

  // Phase 4 — line-matching: match each Māori line to its English meaning
  const pairs = [
    { id:'a', mi:'Ko Aoraki te maunga', en:'My mountain is Aoraki' },
    { id:'b', mi:'Ko Waikato te awa',   en:'My river is Waikato' },
    { id:'c', mi:'Ko Anahera tōku ingoa', en:'My name is Anahera' }
  ];
  const [linked, setLinked] = useState({});
  const [dragMi, setDragMi] = useState(null);
  const [hint, setHint] = useState('');
  const [burstKey, setBurstKey] = useState(0);
  const challengeDone = Object.keys(linked).length === pairs.length;

  function speakLine() {
    setPlaying(true);
    clearTimeout(tref.current);
    tref.current = setTimeout(() => setPlaying(false), 1800);
  }

  return (
    <>
      {phase === 0 && (
        <Scene phase={0} color={hotspot.color} bg="linear-gradient(180deg, #3A7CA5 0%, #245775 100%)">
          <div style={{
            position:'absolute', inset:0, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', padding:'40px', textAlign:'center', color:'white'
          }}>
            <div style={{fontSize:120, animation:'pop .7s var(--t-bounce)'}}>💬</div>
            <div className="font-script" style={{fontSize:64, lineHeight:1, marginTop:8}}>Tēnā koe!</div>
            <div className="font-display" style={{fontSize:48, marginTop:6, maxWidth:760, textWrap:'balance'}}>
              Who are you?
            </div>
            <p style={{fontSize:22, opacity:0.92, maxWidth:560, marginTop:14, lineHeight:1.4}}>
              In Māori culture we say <i>pepeha</i> — we share who we are by where we come from.
            </p>
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setPhase(1)} label="Show me how"/>
          </SceneFooter>
        </Scene>
      )}

      {phase === 1 && (
        <Scene phase={1} color={hotspot.color} bg="linear-gradient(180deg, #B8D4DD 0%, #3A7CA5 100%)">
          <div style={{
            position:'absolute', inset:0, padding:'24px 60px 130px',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
          }}>
            <div style={{
              fontSize:14, color:'rgba(255,255,255,0.85)', letterSpacing:'0.2em',
              textTransform:'uppercase', fontFamily:'Bricolage Grotesque', fontWeight:700,
              marginBottom:24
            }}>
              Pepeha · part {conceptStep+1} of 3
            </div>
            <div style={{fontSize:160, marginBottom:8, filter:'drop-shadow(0 8px 18px rgba(0,0,0,0.2))'}}>
              {concepts[conceptStep].emoji}
            </div>
            <div className="font-display" style={{
              fontSize:64, color:'white', textAlign:'center',
              textShadow:'0 4px 16px rgba(0,0,0,0.25)', maxWidth:760, lineHeight:1.1
            }}>
              {concepts[conceptStep].mi.split('___').map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span style={{
                    color: playing ? 'var(--gold)' : 'white',
                    transition:'color .25s'
                  }}>{part}</span>
                  {i < arr.length-1 && (
                    <span style={{
                      display:'inline-block', width:120, height:6, background:'var(--gold)',
                      borderRadius:3, verticalAlign:'middle', margin:'0 8px'
                    }}/>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{
              fontFamily:'Caveat', fontSize:34, color:'white', opacity:0.85, marginTop:20
            }}>{concepts[conceptStep].en}</div>

            <div style={{display:'flex', gap:8, marginTop:30}}>
              {concepts.map((_, i) => (
                <div key={i} style={{
                  width: i === conceptStep ? 32 : 12, height:12, borderRadius:999,
                  background: i === conceptStep ? 'white' : 'rgba(255,255,255,0.4)',
                  transition:'width .3s'
                }}/>
              ))}
            </div>
          </div>
          <SceneFooter>
            <BigPlay playing={playing} onClick={speakLine}/>
            {conceptStep < concepts.length-1 ? (
              <NextButton onClick={() => { setConceptStep(conceptStep+1); setPlaying(false); }}/>
            ) : (
              <NextButton onClick={() => setPhase(2)} label="I've heard them all"/>
            )}
          </SceneFooter>
        </Scene>
      )}

      {phase === 2 && (
        <Scene phase={2} color={hotspot.color} bg="linear-gradient(180deg, #F4EBD9 0%, #EAD9B8 100%)">
          <div style={{padding:'40px 32px 130px', maxWidth:760, margin:'0 auto'}}>
            <KiwiGuide size="lg">
              When you meet someone new, what's something special you'd tell them about your home?
            </KiwiGuide>
            <PictureChoice
              picked={reflectPick}
              onPick={(o) => setReflectPick(o.id)}
              options={[
                { id:'place', emoji:'🏔️', label:'The mountain near my house', right:true,
                  feedback:"Beautiful! That's just like a pepeha — telling someone about your land." },
                { id:'toy',   emoji:'🧸', label:'My favourite toy', right:false,
                  feedback:"That's fun! But in a pepeha, we share our place — like mountains and rivers." }
              ]}
            />
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setPhase(3)} disabled={!reflectPick} label="Try matching"/>
          </SceneFooter>
        </Scene>
      )}

      {phase === 3 && (
        <Scene phase={3} color={hotspot.color} bg="linear-gradient(180deg, #FBF6EC 0%, #F4EBD9 100%)">
          <GentleHint msg={hint} onDone={() => setHint('')}/>
          {burstKey > 0 && <PetalBurst key={burstKey} running count={14}/>}
          <div style={{padding:'24px 32px 130px', maxWidth:880, margin:'0 auto'}}>
            <div style={{textAlign:'center', marginBottom:18}}>
              <div className="font-display" style={{fontSize:30}}>Match each line to its meaning</div>
              <div style={{fontSize:16, color:'rgba(42,31,26,0.6)', marginTop:4}}>
                Drag the Māori card to its English picture
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
              {/* Left column — Māori cards to drag */}
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                {pairs.filter(p => !Object.values(linked).includes(p.id)).map(p => (
                  <div key={p.id}
                    draggable
                    onDragStart={() => setDragMi(p.id)}
                    onDragEnd={() => setDragMi(null)}
                    style={{
                      padding:'18px 22px', borderRadius:'var(--r-md)',
                      background:'var(--kura)', color:'white',
                      fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:22,
                      cursor:'grab', boxShadow:'var(--shadow-warm)',
                      transform: dragMi === p.id ? 'scale(1.04) rotate(-1deg)' : 'none',
                      transition:'transform .2s var(--t-bounce)'
                    }}>
                    🔊 {p.mi}
                  </div>
                ))}
                {Object.keys(linked).length === pairs.length && (
                  <div style={{padding:14, color:'var(--forest)', fontWeight:700, textAlign:'center'}}>
                    All matched! 🎉
                  </div>
                )}
              </div>
              {/* Right column — English/picture drop targets */}
              <div style={{display:'flex', flexDirection:'column', gap:12}}>
                {pairs.map(p => {
                  const filled = linked[p.id];
                  const emoji = p.id==='a'?'⛰️':p.id==='b'?'🌊':'👤';
                  return (
                    <div key={p.id} id={'p-'+p.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragMi === p.id) {
                          setLinked(l => ({...l, [p.id]: p.id}));
                          setBurstKey(k => k+1);
                        } else if (dragMi) {
                          setHint("Almost! Look at the picture \u2014 which M\u0101ori line talks about that?");
                          const el = document.getElementById('p-'+p.id);
                          if (el) el.animate(
                            [{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],
                            {duration:280});
                        }
                      }}
                      style={{
                        padding:'18px 22px', borderRadius:'var(--r-md)',
                        background: filled ? 'rgba(45,95,63,0.12)' : 'var(--bone)',
                        border: filled ? '3px solid var(--forest)' : '3px dashed rgba(42,31,26,0.2)',
                        display:'flex', alignItems:'center', gap:14
                      }}>
                      <div style={{fontSize:42}}>{emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:17}}>{p.en}</div>
                        {filled && (
                          <div style={{fontSize:13, color:'var(--forest)', marginTop:4, fontWeight:700}}>
                            ✓ {p.mi}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setShowBadge(true)} disabled={!challengeDone} label="Done"/>
          </SceneFooter>
        </Scene>
      )}

      {showBadge && (
        <BadgeReward icon="💬" title="Pepeha badge earned!"
          item={ITEMS.pepeha}
          blurb="You met three pepeha lines, connected them to your own home, and matched them all."
          onClose={onComplete}/>
      )}
    </>
  );
}

// ============================================================
// MODULE 3 — TIKANGA (Manaakitanga — hospitality / hongi)
// ============================================================
function CustomsModule({ hotspot, onComplete }) {
  const [phase, setPhase] = useState(0);
  const [conceptStep, setConceptStep] = useState(0); // 0..1
  const [playing, setPlaying] = useState(false);
  const [reflectPick, setReflectPick] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const tref = useRef();

  const concepts = [
    {
      title:'Manaakitanga',
      en:'Caring for guests',
      explain:'We share our best with visitors.',
      emoji:'🤲'
    },
    {
      title:'Hongi',
      en:'Sharing the breath of life',
      explain:'We gently press noses and foreheads.',
      emoji:'👃'
    }
  ];

  // Phase 4 — drag the green TICK onto images that show good tikanga
  const scenes = [
    { id:'1', emoji:'🧒🍠',     desc:'Sharing kūmara with a visitor',     right:true  },
    { id:'2', emoji:'🙉🔊',     desc:'Shouting while elders are speaking', right:false },
    { id:'3', emoji:'👶👵',     desc:'Sitting quietly with kuia',          right:true  },
    { id:'4', emoji:'🥪🚫',     desc:'Hiding food from a guest',           right:false }
  ];
  const [verdict, setVerdict] = useState({}); // {sceneId: 'tick'|'cross'}
  const [dragMark, setDragMark] = useState(null);
  const [hint, setHint] = useState('');
  const [burstKey, setBurstKey] = useState(0);
  const allRight = scenes.every(s => verdict[s.id] === (s.right ? 'tick' : 'cross'));
  const allAnswered = Object.keys(verdict).length === scenes.length;

  function speakConcept() {
    setPlaying(true);
    clearTimeout(tref.current);
    tref.current = setTimeout(() => setPlaying(false), 1800);
  }

  return (
    <>
      {phase === 0 && (
        <Scene phase={0} color={hotspot.color} bg="linear-gradient(180deg, #2D5F3F 0%, #1F4530 100%)">
          <div style={{
            position:'absolute', inset:0, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', padding:'40px', textAlign:'center', color:'white'
          }}>
            <div style={{fontSize:120, animation:'pop .7s var(--t-bounce)'}}>🤝</div>
            <div className="font-script" style={{fontSize:64, lineHeight:1, marginTop:8}}>Nau mai</div>
            <div className="font-display" style={{fontSize:48, marginTop:6, maxWidth:760, textWrap:'balance'}}>
              You arrived at the marae
            </div>
            <p style={{fontSize:22, opacity:0.92, maxWidth:560, marginTop:14, lineHeight:1.4}}>
              Tikanga is how we treat each other with care. Let's learn two important ways.
            </p>
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setPhase(1)} label="Step inside"/>
          </SceneFooter>
        </Scene>
      )}

      {phase === 1 && (
        <Scene phase={1} color={hotspot.color} bg="radial-gradient(circle at 50% 30%, #6FAA82 0%, #2D5F3F 80%)">
          <div style={{
            position:'absolute', inset:0, padding:'24px 60px 130px',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
          }}>
            <div style={{
              fontSize:14, color:'rgba(255,255,255,0.85)', letterSpacing:'0.2em',
              textTransform:'uppercase', fontFamily:'Bricolage Grotesque', fontWeight:700,
              marginBottom:14
            }}>
              Tikanga · word {conceptStep+1} of 2
            </div>
            <div style={{fontSize:140, marginBottom:14, filter:'drop-shadow(0 8px 18px rgba(0,0,0,0.25))'}}>
              {concepts[conceptStep].emoji}
            </div>
            <div className="font-display" style={{
              fontSize: 84, color:'white', lineHeight:1,
              textShadow:'0 4px 16px rgba(0,0,0,0.25)',
              transform: playing ? 'scale(1.04)' : 'scale(1)',
              transition:'transform .3s var(--t-bounce)'
            }}>
              {concepts[conceptStep].title}
            </div>
            <div style={{
              fontFamily:'Caveat', fontSize:34, color:'white', opacity:0.85, marginTop:12
            }}>"{concepts[conceptStep].en}"</div>
            <div style={{
              maxWidth:520, marginTop:24, padding:'14px 22px',
              background:'rgba(255,255,255,0.18)', borderRadius:'var(--r-md)',
              color:'white', fontSize:20, lineHeight:1.4, textAlign:'center',
              backdropFilter:'blur(6px)'
            }}>{concepts[conceptStep].explain}</div>

            <div style={{display:'flex', gap:8, marginTop:24}}>
              {concepts.map((_, i) => (
                <div key={i} style={{
                  width: i === conceptStep ? 32 : 12, height:12, borderRadius:999,
                  background: i === conceptStep ? 'white' : 'rgba(255,255,255,0.4)',
                  transition:'width .3s'
                }}/>
              ))}
            </div>
          </div>
          <SceneFooter>
            <BigPlay playing={playing} onClick={speakConcept}/>
            {conceptStep < concepts.length-1 ? (
              <NextButton onClick={() => { setConceptStep(conceptStep+1); setPlaying(false); }}/>
            ) : (
              <NextButton onClick={() => setPhase(2)} label="I'm ready"/>
            )}
          </SceneFooter>
        </Scene>
      )}

      {phase === 2 && (
        <Scene phase={2} color={hotspot.color} bg="linear-gradient(180deg, #F4EBD9 0%, #EAD9B8 100%)">
          <div style={{padding:'40px 32px 130px', maxWidth:760, margin:'0 auto'}}>
            <KiwiGuide size="lg">
              The little bear in our story shared his best kūmara with a guest. At your home, when a friend visits, what would <b>you</b> do?
            </KiwiGuide>
            <PictureChoice
              picked={reflectPick}
              onPick={(o) => setReflectPick(o.id)}
              options={[
                { id:'share', emoji:'🍪',  label:'Share my snack', right:true,
                  feedback:"That's manaakitanga! Sharing your best with a guest is the Māori way." },
                { id:'hide',  emoji:'🙈',  label:'Hide my toys', right:false,
                  feedback:"Hmm — guests feel sad when we hide. Manaakitanga means sharing." }
              ]}
            />
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setPhase(3)} disabled={!reflectPick} label="Show what I know"/>
          </SceneFooter>
        </Scene>
      )}

      {phase === 3 && (
        <Scene phase={3} color={hotspot.color} bg="linear-gradient(180deg, #FBF6EC 0%, #F4EBD9 100%)">
          <GentleHint msg={hint} onDone={() => setHint('')}/>
          {burstKey > 0 && <PetalBurst key={burstKey} running count={14}/>}
          <div style={{padding:'24px 32px 130px', maxWidth:880, margin:'0 auto'}}>
            <div style={{textAlign:'center', marginBottom:14}}>
              <div className="font-display" style={{fontSize:28}}>Drag ✓ or ✗ onto each picture</div>
              <div style={{fontSize:16, color:'rgba(42,31,26,0.6)', marginTop:4}}>
                Which ones show good tikanga?
              </div>
            </div>

            {/* Stamps to drag */}
            <div style={{
              display:'flex', justifyContent:'center', gap:24, marginBottom:18,
              padding:14, background:'var(--bone)', borderRadius:'var(--r-md)',
              boxShadow:'var(--shadow-soft)'
            }}>
              {['tick','cross'].map(m => (
                <div key={m}
                  draggable
                  onDragStart={() => setDragMark(m)}
                  onDragEnd={() => setDragMark(null)}
                  style={{
                    width:72, height:72, borderRadius:'50%',
                    background: m==='tick' ? 'var(--forest)' : 'var(--kura)',
                    color:'white', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:38, fontWeight:700, cursor:'grab', boxShadow:'var(--shadow-warm)',
                    transform: dragMark === m ? 'scale(1.1) rotate(-4deg)' : 'none',
                    transition:'transform .2s var(--t-bounce)'
                  }}>
                  {m === 'tick' ? '✓' : '✗'}
                </div>
              ))}
              <div style={{
                display:'flex', alignItems:'center', color:'rgba(42,31,26,0.55)', fontSize:14, marginLeft:8
              }}>
                drag a stamp →
              </div>
            </div>

            {/* Scene cards */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14}}>
              {scenes.map(s => {
                const v = verdict[s.id];
                const correct = v && (v === (s.right ? 'tick' : 'cross'));
                return (
                  <div key={s.id} id={'sc-'+s.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!dragMark) return;
                      const correct = dragMark === (s.right ? 'tick' : 'cross');
                      setVerdict(x => ({...x, [s.id]: dragMark}));
                      if (correct) {
                        setBurstKey(k => k+1);
                      } else {
                        setHint("Hmm \u2014 think again. If we want our friends to feel happy, what would we do?");
                      }
                    }}
                    style={{
                      background:'var(--bone)', borderRadius:'var(--r-md)',
                      padding:18, display:'flex', alignItems:'center', gap:14,
                      border: v ? `3px solid ${correct ? 'var(--forest)' : 'var(--kura)'}` : '3px dashed rgba(42,31,26,0.18)',
                      transition:'border .25s'
                    }}>
                    <div style={{fontSize:56, flexShrink:0}}>{s.emoji}</div>
                    <div style={{flex:1, fontSize:16, lineHeight:1.4}}>{s.desc}</div>
                    {v && (
                      <div style={{
                        width:56, height:56, borderRadius:'50%',
                        background: v==='tick' ? 'var(--forest)' : 'var(--kura)',
                        color:'white', display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:30, fontWeight:700, flexShrink:0,
                        animation:'pop .35s var(--t-bounce)'
                      }}>{v === 'tick' ? '✓' : '✗'}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {allAnswered && !allRight && (
              <div style={{
                marginTop:14, padding:'12px 18px', borderRadius:14,
                background:'rgba(212,162,76,0.18)', color:'var(--charcoal)', textAlign:'center'
              }}>
                Some are still not quite right — try those ones again. You can keep going!
                <button onClick={()=>{setVerdict({}); setHint('');}} style={{marginLeft:10, color:'var(--kura)', textDecoration:'underline'}}>Start over</button>
              </div>
            )}
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setShowBadge(true)} disabled={!allRight} label="Done"/>
          </SceneFooter>
        </Scene>
      )}

      {showBadge && (
        <BadgeReward icon="🤝" title="Tikanga badge earned!"
          item={ITEMS.customs}
          blurb="You learned manaakitanga & hongi, and judged 4 scenes correctly."
          onClose={onComplete}/>
      )}
    </>
  );
}

// ============================================================
// MODULE 4 — PŪRĀKAU (Māui & the sun)
// ============================================================
function MythsModule({ hotspot, onComplete }) {
  const [phase, setPhase] = useState(0);
  const [panelIdx, setPanelIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reflectPick, setReflectPick] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const tref = useRef();

  const panels = [
    { title:'Tama-nui-te-rā raced',  body:'The sun flew across the sky too fast.', emoji:'☀️', bg:'linear-gradient(180deg, #FFC76A 0%, #B5341C 100%)' },
    { title:'Māui made a plan',      body:'He called his brothers and braided strong ropes.', emoji:'🪢', bg:'linear-gradient(180deg, #8A2614 0%, #2A1F1A 100%)' },
    { title:'They caught the sun',   body:'They held him tight and spoke gently.', emoji:'🌅', bg:'linear-gradient(180deg, #E8A848 0%, #8A2614 100%)' },
    { title:'Now days are long',     body:'There is time to fish, learn, and play.', emoji:'🌞', bg:'linear-gradient(180deg, #FDDC8F 0%, #3A7CA5 100%)' }
  ];

  // Phase 4 — sequence the 4 picture cards in story order
  const correctOrder = ['☀️','🪢','🌅','🌞'];
  const [pickedOrder, setPickedOrder] = useState([]);
  const [hint, setHint] = useState('');
  const [burstKey, setBurstKey] = useState(0);
  const remaining = correctOrder.filter(e => !pickedOrder.includes(e));
  const allCorrect = pickedOrder.length === 4 &&
    pickedOrder.every((e, i) => e === correctOrder[i]);
  const seqDone = pickedOrder.length === 4;

  // Fire burst exactly once when the order is completed correctly.
  useEffect(() => {
    if (allCorrect) setBurstKey(k => k+1);
  }, [allCorrect]);

  // Each tap: if it's the right next emoji, celebrate; otherwise gentle hint.
  function tapPicture(e) {
    if (pickedOrder.includes(e)) return;
    const nextIdx = pickedOrder.length;
    if (e === correctOrder[nextIdx]) {
      setPickedOrder([...pickedOrder, e]);
    } else {
      setHint("Think back to the story \u2014 what happened first? Try a different picture.");
    }
  }

  function speakPanel() {
    setPlaying(true);
    clearTimeout(tref.current);
    tref.current = setTimeout(() => setPlaying(false), 1800);
  }

  return (
    <>
      {phase === 0 && (
        <Scene phase={0} color={hotspot.color} bg="linear-gradient(180deg, #1A2745 0%, #2A1F1A 100%)">
          <div style={{
            position:'absolute', inset:0, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', padding:'40px', textAlign:'center', color:'white'
          }}>
            <div style={{fontSize:120, animation:'pop .7s var(--t-bounce)'}}>📖</div>
            <div className="font-script" style={{fontSize:64, lineHeight:1, marginTop:8}}>Whakarongo mai</div>
            <div className="font-display" style={{fontSize:48, marginTop:6, maxWidth:760, textWrap:'balance'}}>
              A story before the world had long days
            </div>
            <p style={{fontSize:22, opacity:0.92, maxWidth:560, marginTop:14, lineHeight:1.4}}>
              This is a <i>pūrākau</i> — a Māori legend. Listen carefully.
            </p>
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setPhase(1)} label="Begin the story"/>
          </SceneFooter>
        </Scene>
      )}

      {phase === 1 && (
        <Scene phase={1} color={hotspot.color} bg={panels[panelIdx].bg}>
          <div style={{
            position:'absolute', inset:0, padding:'24px 60px 130px',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
          }}>
            <div style={{
              fontSize:14, color:'rgba(255,255,255,0.85)', letterSpacing:'0.2em',
              textTransform:'uppercase', fontFamily:'Bricolage Grotesque', fontWeight:700, marginBottom:14
            }}>Pūrākau · part {panelIdx+1} of 4</div>

            <div style={{
              fontSize:180, marginBottom:6, filter:'drop-shadow(0 10px 22px rgba(0,0,0,0.3))',
              animation:'pop .5s var(--t-bounce)'
            }} key={panelIdx}>{panels[panelIdx].emoji}</div>

            <div className="font-display" style={{
              fontSize:60, color:'white', lineHeight:1.05, textAlign:'center',
              textShadow:'0 4px 16px rgba(0,0,0,0.3)', maxWidth:760,
              transform: playing ? 'scale(1.02)' : 'none', transition:'transform .25s'
            }}>{panels[panelIdx].title}</div>
            <div style={{
              fontFamily:'Caveat', fontSize:30, color:'white', opacity:0.9, marginTop:14, textAlign:'center', maxWidth:600
            }}>{panels[panelIdx].body}</div>

            <div style={{display:'flex', gap:8, marginTop:30}}>
              {panels.map((_, i) => (
                <div key={i} style={{
                  width: i === panelIdx ? 32 : 12, height:12, borderRadius:999,
                  background: i === panelIdx ? 'white' : 'rgba(255,255,255,0.4)',
                  transition:'width .3s'
                }}/>
              ))}
            </div>
          </div>
          <SceneFooter>
            <BigPlay playing={playing} onClick={speakPanel}/>
            {panelIdx < panels.length-1 ? (
              <NextButton onClick={() => { setPanelIdx(panelIdx+1); setPlaying(false); }}/>
            ) : (
              <NextButton onClick={() => setPhase(2)} label="Story ends"/>
            )}
          </SceneFooter>
        </Scene>
      )}

      {phase === 2 && (
        <Scene phase={2} color={hotspot.color} bg="linear-gradient(180deg, #F4EBD9 0%, #EAD9B8 100%)">
          <div style={{padding:'40px 32px 130px', maxWidth:760, margin:'0 auto'}}>
            <KiwiGuide size="lg">
              Māui didn't fight the sun — he was clever and gentle. When something is hard at home, what do you do?
            </KiwiGuide>
            <PictureChoice
              picked={reflectPick}
              onPick={(o) => setReflectPick(o.id)}
              options={[
                { id:'think', emoji:'🤔', label:'Stop and think', right:true,
                  feedback:"Just like Māui! Being clever is stronger than being angry." },
                { id:'shout', emoji:'😡', label:'Get angry and shout', right:false,
                  feedback:"Sometimes we feel that way — but Māui showed us a calmer, smarter path." }
              ]}
            />
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setPhase(3)} disabled={!reflectPick} label="Sequence the story"/>
          </SceneFooter>
        </Scene>
      )}

      {phase === 3 && (
        <Scene phase={3} color={hotspot.color} bg="linear-gradient(180deg, #FBF6EC 0%, #F4EBD9 100%)">
          <GentleHint msg={hint} onDone={() => setHint('')}/>
          {burstKey > 0 && <PetalBurst key={burstKey} running count={14}/>}
          <div style={{padding:'24px 32px 130px', maxWidth:880, margin:'0 auto'}}>
            <div style={{textAlign:'center', marginBottom:18}}>
              <div className="font-display" style={{fontSize:28}}>Tap the pictures in story order</div>
              <div style={{fontSize:16, color:'rgba(42,31,26,0.6)', marginTop:4}}>
                What happened first?
              </div>
            </div>

            {/* Slots showing chosen order */}
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:18
            }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  height:120, borderRadius:'var(--r-md)',
                  background: pickedOrder[i] ? 'rgba(45,95,63,0.12)' : 'var(--bone)',
                  border: pickedOrder[i]
                    ? `3px solid ${pickedOrder[i] === correctOrder[i] ? 'var(--forest)' : 'var(--kura)'}`
                    : '3px dashed rgba(42,31,26,0.18)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:60, position:'relative'
                }}>
                  {pickedOrder[i] ? pickedOrder[i] : (
                    <span style={{
                      fontFamily:'Bricolage Grotesque', fontWeight:700,
                      fontSize:22, color:'rgba(42,31,26,0.3)'
                    }}>{i+1}</span>
                  )}
                  <div style={{
                    position:'absolute', top:8, left:10,
                    fontFamily:'Bricolage Grotesque', fontWeight:700,
                    fontSize:14, color: pickedOrder[i] ? 'var(--charcoal)' : 'rgba(42,31,26,0.4)'
                  }}>{i+1}</div>
                </div>
              ))}
            </div>

            {/* Picture bank to pick from */}
            <div style={{
              display:'flex', justifyContent:'center', gap:14, padding:14,
              background:'var(--bone)', borderRadius:'var(--r-md)', boxShadow:'var(--shadow-soft)',
              flexWrap:'wrap'
            }}>
              {correctOrder.map(e => (
                <button key={e}
                  disabled={pickedOrder.includes(e)}
                  onClick={() => tapPicture(e)}
                  style={{
                    width:92, height:92, borderRadius:'var(--r-md)',
                    background: pickedOrder.includes(e) ? 'rgba(42,31,26,0.06)' : 'var(--parchment-deep)',
                    fontSize:54, opacity: pickedOrder.includes(e) ? 0.3 : 1,
                    transition:'all .2s',
                    boxShadow: pickedOrder.includes(e) ? 'none' : 'var(--shadow-soft)'
                  }}>{e}</button>
              ))}
            </div>

            {seqDone && !allCorrect && (
              <div style={{
                marginTop:14, padding:'12px 18px', borderRadius:14,
                background:'rgba(212,162,76,0.18)', color:'var(--charcoal)', textAlign:'center'
              }}>
                Close — try the story order again. Take your time.
                <button onClick={()=>{setPickedOrder([]); setHint('');}} style={{marginLeft:10, color:'var(--kura)', textDecoration:'underline'}}>Start over</button>
              </div>
            )}
            {pickedOrder.length>0 && !seqDone && (
              <div style={{textAlign:'center', marginTop:12}}>
                <button onClick={()=>{setPickedOrder([]); setHint('');}} style={{
                  fontSize:14, color:'var(--kura)', textDecoration:'underline'
                }}>Start over</button>
              </div>
            )}
          </div>
          <SceneFooter>
            <div/>
            <NextButton onClick={() => setShowBadge(true)} disabled={!allCorrect} label="Done"/>
          </SceneFooter>
        </Scene>
      )}

      {showBadge && (
        <BadgeReward icon="📖" title="Pūrākau badge earned!"
          item={ITEMS.myths}
          blurb="You heard Māui's story, found its lesson, and ordered the events."
          onClose={onComplete}/>
      )}
    </>
  );
}

// Expose
Object.assign(window, { WaiataModule, PepehaModule, CustomsModule, MythsModule });
