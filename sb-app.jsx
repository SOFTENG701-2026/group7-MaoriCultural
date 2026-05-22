// Picture Book — shell with page-turn animation.
// Each spread is a separate component (left + right page side by side).
// Page turn: a flip overlay rotates from the right page slot toward the spine.
// During flip, the underlying spread state changes; the overlay shows the
// outgoing right page on its front and the incoming left page on its back.

const { useState, useEffect, useRef } = React;

// Spread sequence
const SPREADS = [
  { key:'cover',   Component: CoverSpread,   theme:'cover' },
  { key:'waiata',  Component: WaiataSpread,  theme:'gold' },
  { key:'pepeha',  Component: PepehaSpread,  theme:'ocean' },
  { key:'customs', Component: CustomsSpread, theme:'forest' },
  { key:'myths',   Component: MythsSpread,   theme:'kura' },
  { key:'back',    Component: BackSpread,    theme:'kura' }
];

function PageEdges({ count, side }) {
  // Decorative stack of page edges visible on the closed side of the book.
  return (
    <div style={{
      position:'absolute', top:8, bottom:8, [side]:0, width: Math.min(count * 1.4 + 4, 22),
      background:`linear-gradient(${side==='right'?'to right':'to left'}, rgba(42,31,26,0.18), rgba(42,31,26,0))`,
      pointerEvents:'none', zIndex:1
    }}>
      {Array.from({length: count}).map((_, i) => (
        <div key={i} style={{
          position:'absolute', top:0, bottom:0, [side]: i*1.4,
          width:1, background:'rgba(42,31,26,0.18)'
        }}/>
      ))}
    </div>
  );
}

function BookSpine() {
  return (
    <div style={{
      position:'absolute', left:'50%', top:0, bottom:0, width:24,
      transform:'translateX(-50%)', zIndex:3, pointerEvents:'none',
      background:'linear-gradient(to right, rgba(42,31,26,0) 0%, rgba(42,31,26,0.25) 45%, rgba(42,31,26,0.4) 50%, rgba(42,31,26,0.25) 55%, rgba(42,31,26,0) 100%)'
    }}/>
  );
}

function PictureBook() {
  // URL param ?spread=N (0..5) lets us deep-link into a spread for screenshotting.
  const params = new URLSearchParams(window.location.search);
  const initialSpread = Math.max(0, Math.min(SPREADS.length - 1, parseInt(params.get('spread') || '0', 10)));

  const [spread, setSpread] = useState(initialSpread);
  const [flipping, setFlipping] = useState(null); // 'forward' | 'backward' | null
  const [flipFromIdx, setFlipFromIdx] = useState(0);
  const [flipToIdx, setFlipToIdx] = useState(0);
  const [audioNarration, setAudioNarration] = useState(true);

  function turn(dir) {
    if (flipping) return;
    const next = dir === 'forward' ? spread + 1 : spread - 1;
    if (next < 0 || next >= SPREADS.length) return;
    setFlipFromIdx(spread);
    setFlipToIdx(next);
    setFlipping(dir);
    // Mid-flip, swap the underlying spread so the new page is already there
    setTimeout(() => setSpread(next), 350);
    setTimeout(() => setFlipping(null), 700);
  }

  const Current = SPREADS[spread].Component;
  const FlipFrom = SPREADS[flipFromIdx].Component;
  const FlipTo   = SPREADS[flipToIdx].Component;

  // Page numbering for the indicator
  const totalSpreads = SPREADS.length;
  const progressPct = ((spread) / (totalSpreads - 1)) * 100;

  return (
    <div style={{
      width:'100%', height:'100%', position:'relative',
      background: 'radial-gradient(circle at 50% 30%, #6B5640 0%, #3D2E22 100%)',
      overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center',
      padding:'24px 24px 20px'
    }}>

      {/* Top bar */}
      <div style={{
        width:'100%', maxWidth:1100, display:'flex',
        alignItems:'center', justifyContent:'space-between', marginBottom:16, color:'var(--bone)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{
            width:36, height:36, borderRadius:10, background:'var(--gold)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:18
          }}>📖</div>
          <div>
            <div className="font-display" style={{fontSize:16, lineHeight:1}}>Māori Taonga</div>
            <div style={{fontSize:11, opacity:0.7}}>Interactive picture book</div>
          </div>
        </div>

        <div style={{
          flex:1, maxWidth:280, margin:'0 24px',
          background:'rgba(255,255,255,0.12)', borderRadius:999, height:8, position:'relative'
        }}>
          <div style={{
            position:'absolute', left:0, top:0, height:'100%',
            width:`${progressPct}%`, background:'var(--gold)',
            borderRadius:999, transition:'width .6s var(--t-bounce)'
          }}/>
        </div>

        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button onClick={() => setAudioNarration(!audioNarration)} style={{
            background:'rgba(255,255,255,0.12)', color:'var(--bone)',
            padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:700,
            display:'inline-flex', alignItems:'center', gap:6
          }}>
            {audioNarration ? '🔊' : '🔇'} Read aloud
          </button>
          <div style={{
            background:'rgba(255,255,255,0.12)', padding:'8px 14px', borderRadius:999,
            fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:14
          }}>{spread+1} / {totalSpreads}</div>
        </div>
      </div>

      {/* Book stage */}
      <div style={{
        width:'100%', maxWidth:1100, aspectRatio:'11 / 7',
        position:'relative', perspective:'2400px', flex:1, maxHeight: 720
      }}>
        {/* Drop shadow under book */}
        <div style={{
          position:'absolute', left:'5%', right:'5%', bottom:-10, height:30,
          background:'radial-gradient(ellipse at center, rgba(0,0,0,0.5), transparent 70%)',
          filter:'blur(10px)'
        }}/>

        <div style={{
          position:'absolute', inset:0,
          background:'var(--bone)',
          borderRadius:'8px 8px 6px 6px',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)',
          overflow:'hidden'
        }}>
          {/* Current spread underneath */}
          <Current onOpen={() => turn('forward')} onRestart={() => setSpread(0)}/>

          {/* Spine over the top */}
          <BookSpine/>

          {/* Page edges hint — left and right */}
          {spread > 0 && <PageEdges count={spread} side="left"/>}
          {spread < totalSpreads - 1 && <PageEdges count={totalSpreads - 1 - spread} side="right"/>}

          {/* Flipping page overlay (right→left for forward, left→right for backward) */}
          {flipping && (
            <div style={{
              position:'absolute', top:0, bottom:0,
              left: flipping === 'forward' ? '50%' : 0,
              width:'50%',
              transformStyle:'preserve-3d',
              transformOrigin: flipping === 'forward' ? 'left center' : 'right center',
              animation: `${flipping === 'forward' ? 'flip-forward' : 'flip-backward'} .7s ease-in-out forwards`,
              zIndex: 10
            }}>
              {/* Front face — current page on the active side */}
              <div style={{
                position:'absolute', inset:0,
                backfaceVisibility:'hidden',
                background:'var(--bone)',
                boxShadow: flipping === 'forward'
                  ? 'inset 8px 0 24px rgba(0,0,0,0.18)'
                  : 'inset -8px 0 24px rgba(0,0,0,0.18)',
                overflow:'hidden'
              }}>
                <div style={{
                  position:'absolute', top:0, bottom:0, width:'200%',
                  left: flipping === 'forward' ? '-100%' : 0
                }}>
                  <FlipFrom onOpen={()=>{}} onRestart={()=>{}}/>
                </div>
              </div>
              {/* Back face — destination page */}
              <div style={{
                position:'absolute', inset:0,
                backfaceVisibility:'hidden',
                background:'var(--bone)',
                transform:'rotateY(180deg)',
                boxShadow: flipping === 'forward'
                  ? 'inset -8px 0 24px rgba(0,0,0,0.18)'
                  : 'inset 8px 0 24px rgba(0,0,0,0.18)',
                overflow:'hidden'
              }}>
                <div style={{
                  position:'absolute', top:0, bottom:0, width:'200%',
                  left: flipping === 'forward' ? 0 : '-100%'
                }}>
                  <FlipTo onOpen={()=>{}} onRestart={()=>{}}/>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation arrows — outside the book */}
        <button onClick={() => turn('backward')} disabled={spread===0 || flipping}
          style={{
            position:'absolute', left:-72, top:'50%', transform:'translateY(-50%)',
            width:60, height:60, borderRadius:'50%',
            background: spread===0 ? 'rgba(255,255,255,0.1)' : 'var(--bone)',
            color: spread===0 ? 'rgba(255,255,255,0.4)' : 'var(--charcoal)',
            fontSize:28, boxShadow:'var(--shadow-warm)',
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor: spread===0 ? 'not-allowed' : 'pointer'
          }}>←</button>
        <button onClick={() => turn('forward')} disabled={spread===totalSpreads-1 || flipping}
          style={{
            position:'absolute', right:-72, top:'50%', transform:'translateY(-50%)',
            width:60, height:60, borderRadius:'50%',
            background: spread===totalSpreads-1 ? 'rgba(255,255,255,0.1)' : 'var(--bone)',
            color: spread===totalSpreads-1 ? 'rgba(255,255,255,0.4)' : 'var(--charcoal)',
            fontSize:28, boxShadow:'var(--shadow-warm)',
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor: spread===totalSpreads-1 ? 'not-allowed' : 'pointer'
          }}>→</button>

        {/* Tap-to-turn hint at right corner of book (only on cover) */}
        {spread === 0 && (
          <div style={{
            position:'absolute', right:24, bottom:24, color:'var(--charcoal)',
            background:'var(--gold)', padding:'6px 12px', borderRadius:999,
            fontSize:12, fontWeight:700, boxShadow:'var(--shadow-soft)',
            pointerEvents:'none', animation:'wiggle 1.4s infinite ease-in-out'
          }}>
            👉 Tap →
          </div>
        )}
      </div>

      {/* Chapter dots */}
      <div style={{display:'flex', gap:6, marginTop:18}}>
        {SPREADS.map((s, i) => (
          <button key={i} onClick={() => !flipping && setSpread(i)} style={{
            width: spread === i ? 36 : 12, height:12, borderRadius:999,
            background: spread === i ? 'var(--gold)' : 'rgba(255,255,255,0.25)',
            transition:'width .3s var(--t-bounce), background .25s', cursor:'pointer'
          }}/>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PictureBook/>);
