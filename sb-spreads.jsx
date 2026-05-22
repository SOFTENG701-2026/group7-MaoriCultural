// Picture Book — Spread content components.
// Each spread is one cultural theme. Left page = visual + invitation; Right page = interactive task.
// Cognitivist scaffolding: each spread opens with activation, then teaches via dual coding,
// then asks for active processing, then reinforces with a "Ko tāku..." (I learned...) reflection.

const { useState, useEffect, useRef } = React;

// ============== Decorative bits ==============
function PageNumber({ n, side }) {
  return (
    <div style={{
      position:'absolute', bottom:18, [side]:24,
      fontFamily:'Caveat', fontSize:20, color:'rgba(42,31,26,0.45)'
    }}>{n}</div>
  );
}

function PageHeader({ chapter, title, color }) {
  return (
    <div style={{marginBottom:18}}>
      <div style={{
        display:'inline-block', padding:'4px 12px', borderRadius:999,
        background: color, color:'white',
        fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:12,
        letterSpacing:'0.1em', textTransform:'uppercase'
      }}>Chapter {chapter}</div>
      <div className="font-display" style={{fontSize:36, marginTop:8, lineHeight:1.1}}>{title}</div>
    </div>
  );
}

// Small reusable: tap-to-hear chip styled for book pages
function ListenChip({ label, onClick }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button onClick={() => { setPlaying(true); onClick && onClick(); setTimeout(()=>setPlaying(false), 1500); }}
      style={{
        display:'inline-flex', alignItems:'center', gap:8,
        background: playing ? 'var(--kura)' : 'var(--gold)',
        color: playing ? 'white' : 'var(--charcoal)',
        padding:'8px 14px', borderRadius:999,
        fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:14,
        boxShadow:'var(--shadow-soft)', cursor:'pointer'
      }}>
      {playing ? (
        <span style={{display:'inline-flex', alignItems:'center', gap:2}}>
          <span className="wave-bar" style={{height:10}}/>
          <span className="wave-bar" style={{height:14, animationDelay:'.15s'}}/>
          <span className="wave-bar" style={{height:8, animationDelay:'.3s'}}/>
        </span>
      ) : (
        <span style={{
          width:0, height:0, borderLeft:'8px solid currentColor',
          borderTop:'5px solid transparent', borderBottom:'5px solid transparent'
        }}/>
      )}
      {label}
    </button>
  );
}

// ============================================================
// COVER
// ============================================================
function CoverSpread({ onOpen }) {
  return (
    <div style={{position:'absolute', inset:0, display:'flex'}}>
      {/* Left page — blank back cover side */}
      <div style={{
        flex:1, background:'linear-gradient(135deg, var(--kura) 0%, var(--kura-deep) 100%)',
        position:'relative', overflow:'hidden'
      }}>
        {/* Decorative koru */}
        <div style={{
          position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)',
          width:120, height:120, color:'rgba(212,162,76,0.4)'
        }}>
          <div className="koru" style={{width:'100%', height:'100%'}}/>
        </div>
      </div>

      {/* Right page — title */}
      <div style={{
        flex:1, background:'var(--bone)', position:'relative',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'40px 36px', textAlign:'center'
      }}>
        <div className="font-script" style={{fontSize:42, color:'var(--kura)', lineHeight:1}}>
          A little book of
        </div>
        <h1 className="font-display" style={{
          fontSize:64, margin:'4px 0', lineHeight:1, color:'var(--charcoal)'
        }}>Māori<br/>Taonga</h1>
        <div style={{fontSize:16, color:'rgba(42,31,26,0.6)', marginTop:8}}>
          Four treasures from Aotearoa
        </div>

        <div className="placeholder" style={{width:220, height:180, margin:'28px 0', borderRadius:'50%'}}>
          illustration<br/>tamariki with koru border<br/>(circular illustration)
        </div>

        <button onClick={onOpen} className="btn-big primary" style={{fontSize:22, minHeight:64}}>
          Open the book →
        </button>
        <div style={{fontSize:13, color:'rgba(42,31,26,0.5)', marginTop:20}}>
          Tap the corner of any page to turn
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SPREAD 1 — WAIATA
// ============================================================
function WaiataSpread() {
  const [activeLine, setActiveLine] = useState(-1);
  const [sung, setSung] = useState([false, false, false, false]);
  const lyrics = [
    { mi:"Tūtira mai", en:"Line up together" },
    { mi:"ngā iwi!", en:"everyone!" },
    { mi:"Tātou tātou e", en:"All of us, all of us" },
    { mi:"Hī aue hī!", en:"Yes!" }
  ];

  function tap(i) {
    setActiveLine(i);
    setTimeout(() => {
      setActiveLine(-1);
      const n=[...sung]; n[i]=true; setSung(n);
    }, 1500);
  }

  return (
    <div style={{position:'absolute', inset:0, display:'flex'}}>
      {/* LEFT — illustration & intro */}
      <div style={{flex:1, padding:'48px 40px', position:'relative', background:'var(--bone)'}}>
        <PageHeader chapter="1" title="Waiata" color="var(--gold)"/>
        <div style={{fontSize:18, lineHeight:1.55, color:'var(--charcoal)', marginBottom:18}}>
          A <b>waiata</b> is a Māori song. We sing them together — at school, at home, on the marae.
        </div>
        <div className="placeholder" style={{height:220, marginBottom:18}}>
          illustration<br/>children sitting in a circle, singing<br/>(warm, sunset palette)
        </div>
        <div style={{
          padding:14, background:'rgba(212,162,76,0.15)', borderRadius:14,
          borderLeft:'4px solid var(--gold)', fontSize:15
        }}>
          <b>Today's waiata:</b> Tūtira Mai Ngā Iwi — a song about being together.
        </div>
        <PageNumber n={2} side="left"/>
      </div>

      {/* RIGHT — interaction */}
      <div style={{flex:1, padding:'48px 40px', background:'var(--bone)', position:'relative'}}>
        <div className="font-display" style={{fontSize:24, marginBottom:6}}>Sing along!</div>
        <div style={{fontSize:14, color:'rgba(42,31,26,0.6)', marginBottom:18}}>
          Tap each line to hear it, then sing it back.
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {lyrics.map((l, i) => (
            <button key={i} onClick={() => tap(i)} style={{
              padding:'14px 16px', borderRadius:16, textAlign:'left',
              background: activeLine === i ? 'var(--gold)' :
                          sung[i] ? 'rgba(45,95,63,0.1)' : 'var(--parchment)',
              boxShadow:'var(--shadow-soft)',
              display:'flex', alignItems:'center', gap:12,
              transition:'all .25s var(--t-bounce)',
              transform: activeLine === i ? 'scale(1.03)' : 'scale(1)'
            }}>
              <div style={{
                width:38, height:38, borderRadius:'50%',
                background: sung[i] ? 'var(--forest)' : 'var(--kura)',
                color:'white', display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, fontFamily:'Bricolage Grotesque', fontWeight:700
              }}>{sung[i] ? '✓' : (activeLine===i ? '♪' : '▶')}</div>
              <div>
                <div className="font-display" style={{fontSize:20}}>{l.mi}</div>
                <div style={{fontSize:13, color:'rgba(42,31,26,0.6)'}}>{l.en}</div>
              </div>
            </button>
          ))}
        </div>

        {sung.every(Boolean) && (
          <div style={{
            marginTop:18, padding:14, borderRadius:14,
            background:'rgba(45,95,63,0.12)', display:'flex', alignItems:'center', gap:12
          }}>
            <div style={{fontSize:28}}>🌟</div>
            <div>
              <div className="font-display" style={{fontSize:16, color:'var(--forest-deep)'}}>Ka pai!</div>
              <div style={{fontSize:13, color:'rgba(42,31,26,0.7)'}}>You sang the whole waiata.</div>
            </div>
          </div>
        )}
        <PageNumber n={3} side="right"/>
      </div>
    </div>
  );
}

// ============================================================
// SPREAD 2 — PEPEHA
// ============================================================
function PepehaSpread() {
  const [mountain, setMountain] = useState('Aoraki');
  const [river, setRiver] = useState('Waikato');
  const [name, setName] = useState('Hana');

  const mountains = ['Aoraki', 'Taranaki', 'Ngāuruhoe', 'Hikurangi'];
  const rivers = ['Waikato', 'Whanganui', 'Clutha', 'Waitematā'];

  return (
    <div style={{position:'absolute', inset:0, display:'flex'}}>
      {/* LEFT */}
      <div style={{flex:1, padding:'48px 40px', position:'relative', background:'var(--bone)'}}>
        <PageHeader chapter="2" title="Pepeha" color="var(--ocean)"/>
        <div style={{fontSize:18, lineHeight:1.55, marginBottom:18}}>
          When you meet someone, you can share a <b>pepeha</b>. It tells where you come from — your mountain, your river, your name.
        </div>
        <div className="placeholder" style={{height:200, marginBottom:14}}>
          illustration<br/>child standing in front of mountain & river<br/>(landscape)
        </div>
        <div style={{
          background:'var(--parchment)', padding:14, borderRadius:14,
          fontFamily:'Caveat', fontSize:22, lineHeight:1.5, color:'var(--charcoal)'
        }}>
          "Knowing where I come from helps me know who I am."
        </div>
        <PageNumber n={4} side="left"/>
      </div>

      {/* RIGHT — interactive pepeha builder */}
      <div style={{flex:1, padding:'48px 40px', background:'var(--bone)', position:'relative'}}>
        <div className="font-display" style={{fontSize:24, marginBottom:6}}>Build yours</div>
        <div style={{fontSize:14, color:'rgba(42,31,26,0.6)', marginBottom:16}}>
          Tap to choose. Your pepeha builds itself below.
        </div>

        {/* Selectors */}
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <div>
            <div style={{fontSize:13, fontWeight:700, marginBottom:6, color:'var(--charcoal)'}}>🏔️ Maunga (mountain)</div>
            <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
              {mountains.map(m => (
                <button key={m} onClick={()=>setMountain(m)} style={{
                  padding:'8px 14px', borderRadius:999,
                  background: mountain===m ? 'var(--forest)' : 'var(--parchment)',
                  color: mountain===m ? 'white' : 'var(--charcoal)',
                  fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:14,
                  boxShadow:'var(--shadow-soft)'
                }}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:13, fontWeight:700, marginBottom:6}}>🌊 Awa (river)</div>
            <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
              {rivers.map(r => (
                <button key={r} onClick={()=>setRiver(r)} style={{
                  padding:'8px 14px', borderRadius:999,
                  background: river===r ? 'var(--ocean)' : 'var(--parchment)',
                  color: river===r ? 'white' : 'var(--charcoal)',
                  fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:14,
                  boxShadow:'var(--shadow-soft)'
                }}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:13, fontWeight:700, marginBottom:6}}>✏️ Ingoa (your name)</div>
            <input value={name} onChange={e=>setName(e.target.value)} style={{
              width:'100%', padding:'10px 14px', fontSize:18,
              fontFamily:'Bricolage Grotesque', fontWeight:700,
              border:'2px solid var(--gold)', borderRadius:12,
              background:'var(--parchment)', color:'var(--charcoal)', outline:'none'
            }}/>
          </div>
        </div>

        {/* Result card */}
        <div style={{
          marginTop:18, padding:16,
          background:'linear-gradient(135deg, var(--parchment), var(--parchment-deep))',
          borderRadius:16, border:'2px dashed var(--gold)'
        }}>
          <div style={{fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(42,31,26,0.5)', marginBottom:8}}>
            Your pepeha
          </div>
          <div className="font-display" style={{fontSize:18, lineHeight:1.6, color:'var(--charcoal)'}}>
            Ko <span style={{color:'var(--forest)'}}>{mountain}</span> te maunga<br/>
            Ko <span style={{color:'var(--ocean)'}}>{river}</span> te awa<br/>
            Ko <span style={{color:'var(--kura)'}}>{name||'____'}</span> tōku ingoa
          </div>
          <div style={{marginTop:10}}>
            <ListenChip label="Hear me say it"/>
          </div>
        </div>
        <PageNumber n={5} side="right"/>
      </div>
    </div>
  );
}

// ============================================================
// SPREAD 3 — CUSTOMS (Hongi)
// ============================================================
function CustomsSpread() {
  const [hongiStep, setHongiStep] = useState(0); // 0..3
  const [maraeRevealed, setMaraeRevealed] = useState([]);

  const maraePoints = [
    { id:'shoes', x:18, y:78, label:'Take off shoes', detail:'Leave them at the door — the marae floor is special.' },
    { id:'door',  x:50, y:58, label:'Wait at the gate', detail:'Listen for the karanga (welcome call) before entering.' },
    { id:'whare', x:75, y:42, label:'Whare nui',       detail:'The big meeting house. Sit on the side it shows you.' },
    { id:'quiet', x:50, y:88, label:'Listen quietly',  detail:'Speeches and songs come first. Watch and learn.' }
  ];

  return (
    <div style={{position:'absolute', inset:0, display:'flex'}}>
      {/* LEFT — hongi step-by-step */}
      <div style={{flex:1, padding:'48px 40px', background:'var(--bone)', position:'relative'}}>
        <PageHeader chapter="3" title="Hongi" color="var(--forest)"/>
        <div style={{fontSize:17, lineHeight:1.55, marginBottom:14}}>
          The <b>hongi</b> is a special Māori greeting. Two people press their noses and foreheads together — sharing the breath of life.
        </div>

        {/* Animated hongi illustration — two heads approaching */}
        <div style={{
          position:'relative', height:170, background:'var(--parchment)',
          borderRadius:16, padding:20, marginBottom:14, overflow:'hidden'
        }}>
          {/* Person A */}
          <div style={{
            position:'absolute', top:'50%', left: `${20 + hongiStep * 10}%`,
            transform:'translateY(-50%)',
            transition: 'left 0.5s ease',
            width:70, height:90
          }}>
            <div style={{width:60, height:60, borderRadius:'50%', background:'#C99A6B', position:'relative'}}>
              <div style={{position:'absolute', top:-2, left:-2, right:-2, height:18, background:'#2A1F1A', borderRadius:'50% 50% 30% 30%'}}/>
              <div style={{position:'absolute', top:24, left:14, width:4, height:4, borderRadius:'50%', background:'#2A1F1A'}}/>
              <div style={{position:'absolute', top:24, right:14, width:4, height:4, borderRadius:'50%', background:'#2A1F1A'}}/>
              <div style={{position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', width:10, height:4, borderRadius:'0 0 8px 8px', background:'#2A1F1A'}}/>
            </div>
          </div>
          {/* Person B */}
          <div style={{
            position:'absolute', top:'50%', right: `${20 + hongiStep * 10}%`,
            transform:'translateY(-50%) scaleX(-1)',
            transition: 'right 0.5s ease',
            width:70, height:90
          }}>
            <div style={{width:60, height:60, borderRadius:'50%', background:'#A37049', position:'relative'}}>
              <div style={{position:'absolute', top:-2, left:-2, right:-2, height:18, background:'#1A1410', borderRadius:'50% 50% 30% 30%'}}/>
              <div style={{position:'absolute', top:24, left:14, width:4, height:4, borderRadius:'50%', background:'#2A1F1A'}}/>
              <div style={{position:'absolute', top:24, right:14, width:4, height:4, borderRadius:'50%', background:'#2A1F1A'}}/>
              <div style={{position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', width:10, height:4, borderRadius:'0 0 8px 8px', background:'#2A1F1A'}}/>
            </div>
          </div>
          {/* heart on step 3 */}
          {hongiStep === 3 && (
            <div style={{
              position:'absolute', left:'50%', top:'20%', transform:'translateX(-50%)',
              fontSize:32, animation:'pop .5s var(--t-bounce)'
            }}>💛</div>
          )}
        </div>

        {/* Step pills */}
        <div style={{display:'flex', gap:8, marginBottom:10}}>
          {['Approach','Noses touch','Foreheads touch','Breath shared'].map((s, i) => (
            <button key={i} onClick={() => setHongiStep(i)} style={{
              flex:1, padding:'10px 6px', borderRadius:12,
              background: hongiStep === i ? 'var(--forest)' : 'var(--parchment)',
              color: hongiStep === i ? 'white' : 'var(--charcoal)',
              fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:12,
              boxShadow:'var(--shadow-soft)',
              border: hongiStep > i ? '2px solid var(--gold)' : '2px solid transparent'
            }}>{i+1}. {s}</button>
          ))}
        </div>
        <PageNumber n={6} side="left"/>
      </div>

      {/* RIGHT — marae map with tap-to-reveal */}
      <div style={{flex:1, padding:'48px 40px', background:'var(--bone)', position:'relative'}}>
        <div className="font-display" style={{fontSize:24, marginBottom:6}}>Visit a marae</div>
        <div style={{fontSize:14, color:'rgba(42,31,26,0.6)', marginBottom:14}}>
          Tap the 4 spots on this marae to learn what to do.
        </div>

        {/* Marae illustration with hotspots */}
        <div style={{
          position:'relative', height:280, borderRadius:16,
          background:'linear-gradient(180deg, #B8D4DC 0%, #7BA76E 60%, #4A7849 100%)',
          overflow:'hidden', marginBottom:14
        }}>
          {/* Stylized whare nui (meeting house) silhouette */}
          <div style={{position:'absolute', left:'58%', top:'30%', width:120, height:80, transform:'translateX(-50%)'}}>
            <div style={{
              width:0, height:0,
              borderLeft:'60px solid transparent', borderRight:'60px solid transparent',
              borderBottom:'40px solid var(--kura)'
            }}/>
            <div style={{width:120, height:50, background:'var(--kura-deep)', marginTop:-2, position:'relative'}}>
              <div style={{position:'absolute', left:'50%', top:10, transform:'translateX(-50%)', width:20, height:30, background:'#2A1F1A'}}/>
            </div>
          </div>

          {maraePoints.map(p => {
            const done = maraeRevealed.includes(p.id);
            return (
              <button key={p.id} onClick={() => !done && setMaraeRevealed([...maraeRevealed, p.id])}
                style={{
                  position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
                  transform:'translate(-50%, -50%)',
                  width:36, height:36, borderRadius:'50%',
                  background: done ? 'var(--gold)' : 'var(--bone)',
                  border:'3px solid var(--charcoal)',
                  fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:16,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  animation: !done ? 'pulse-mini 1.8s infinite ease-out' : 'none',
                  boxShadow:'var(--shadow-warm)'
                }}>
                {done ? '✓' : '?'}
              </button>
            );
          })}
        </div>

        {/* Revealed list */}
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          {maraePoints.map(p => {
            const done = maraeRevealed.includes(p.id);
            return (
              <div key={p.id} style={{
                display:'flex', alignItems:'flex-start', gap:10,
                padding:'8px 12px', borderRadius:10,
                background: done ? 'rgba(212,162,76,0.15)' : 'rgba(42,31,26,0.03)',
                opacity: done ? 1 : 0.5
              }}>
                <div style={{
                  width:22, height:22, borderRadius:'50%',
                  background: done ? 'var(--gold)' : 'rgba(42,31,26,0.1)',
                  flexShrink:0, fontSize:12, color:'var(--charcoal)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700
                }}>{done?'✓':'?'}</div>
                <div>
                  <div className="font-display" style={{fontSize:14}}>{p.label}</div>
                  {done && <div style={{fontSize:12, color:'rgba(42,31,26,0.7)', marginTop:2}}>{p.detail}</div>}
                </div>
              </div>
            );
          })}
        </div>
        <PageNumber n={7} side="right"/>
      </div>
    </div>
  );
}

// ============================================================
// SPREAD 4 — MYTHS (Māui & the sun)
// ============================================================
function MythsSpread() {
  const [panel, setPanel] = useState(0);
  const panels = [
    { title:"The sun raced", body:"Long ago the sun, Tama-nui-te-rā, flew across the sky. Days were so short!", visual:"☀️", bg:"#F4D17C" },
    { title:"Māui's idea",  body:"Māui called his brothers. \"Let's catch the sun and ask him to slow down.\"", visual:"🪢", bg:"#E8C290" },
    { title:"They caught him!", body:"They threw their ropes and held him tight. Māui spoke gently.", visual:"🌅", bg:"#E89F7A" },
    { title:"Long days",    body:"Now the sun moves slowly. We have time to play, fish, and learn.", visual:"🌞", bg:"#F4D17C" }
  ];

  return (
    <div style={{position:'absolute', inset:0, display:'flex'}}>
      {/* LEFT — comic strip */}
      <div style={{flex:1, padding:'48px 40px', background:'var(--bone)', position:'relative'}}>
        <PageHeader chapter="4" title="Pūrākau" color="var(--kura)"/>
        <div style={{fontSize:16, lineHeight:1.5, marginBottom:14}}>
          A <b>pūrākau</b> is a story passed down through generations. This one explains why days are long.
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {panels.map((p, i) => (
            <button key={i} onClick={() => setPanel(i)} style={{
              aspectRatio:'1', borderRadius:14, padding:8,
              background: p.bg,
              border: panel === i ? '3px solid var(--charcoal)' : '3px solid transparent',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              boxShadow:'var(--shadow-soft)', transition:'all .2s var(--t-bounce)',
              transform: panel === i ? 'scale(1.04)' : 'scale(1)'
            }}>
              <div style={{fontSize:36}}>{p.visual}</div>
              <div style={{
                fontFamily:'Bricolage Grotesque', fontWeight:700, fontSize:11,
                marginTop:4, color:'var(--charcoal)'
              }}>Panel {i+1}</div>
            </button>
          ))}
        </div>
        <PageNumber n={8} side="left"/>
      </div>

      {/* RIGHT — current panel detail */}
      <div style={{flex:1, padding:'48px 40px', background:'var(--bone)', position:'relative'}}>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
          {panels.map((_, i) => (
            <div key={i} style={{
              width: panel === i ? 32 : 8, height:8, borderRadius:999,
              background: panel === i ? 'var(--kura)' : 'rgba(42,31,26,0.15)',
              transition:'width .3s var(--t-bounce)'
            }}/>
          ))}
        </div>

        <div style={{
          background: panels[panel].bg, borderRadius:18, padding:24,
          textAlign:'center', marginBottom:14, minHeight:220,
          display:'flex', flexDirection:'column', justifyContent:'center'
        }}>
          <div style={{fontSize:80, marginBottom:6, animation:'pop .4s var(--t-bounce)', key:panel}}>{panels[panel].visual}</div>
          <div className="font-display" style={{fontSize:22, marginBottom:6}}>{panels[panel].title}</div>
          <div style={{fontSize:16, lineHeight:1.5, color:'var(--charcoal)', maxWidth:280, margin:'0 auto'}}>
            {panels[panel].body}
          </div>
        </div>

        <div style={{display:'flex', gap:8, justifyContent:'center'}}>
          <button onClick={() => setPanel(Math.max(0, panel-1))} disabled={panel===0}
            className="btn-big ghost" style={{minHeight:48, fontSize:16, opacity: panel===0?0.4:1}}>
            ← Back
          </button>
          <ListenChip label="Read this page"/>
          <button onClick={() => setPanel(Math.min(3, panel+1))} disabled={panel===3}
            className="btn-big primary" style={{minHeight:48, fontSize:16, opacity: panel===3?0.4:1}}>
            Next →
          </button>
        </div>
        <PageNumber n={9} side="right"/>
      </div>
    </div>
  );
}

// ============================================================
// BACK COVER — Recap
// ============================================================
function BackSpread({ onRestart }) {
  const items = [
    { color:'var(--gold)',   icon:'🎵', title:'Waiata',  thing:'I can sing Tūtira Mai Ngā Iwi' },
    { color:'var(--ocean)',  icon:'💬', title:'Pepeha',  thing:'I can say where I come from' },
    { color:'var(--forest)', icon:'🤝', title:'Tikanga', thing:'I know the hongi and marae steps' },
    { color:'var(--kura)',   icon:'📖', title:'Pūrākau', thing:'I can tell the story of Māui & the sun' }
  ];
  return (
    <div style={{position:'absolute', inset:0, display:'flex'}}>
      {/* LEFT — recap */}
      <div style={{flex:1, padding:'48px 40px', background:'var(--bone)', position:'relative'}}>
        <div className="font-script" style={{fontSize:42, color:'var(--kura)', lineHeight:1}}>Ko tāku...</div>
        <h2 className="font-display" style={{fontSize:36, margin:'4px 0 16px'}}>What I learned</h2>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {items.map((it, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'12px 14px', borderRadius:14, background:'var(--parchment)',
              boxShadow:'var(--shadow-soft)'
            }}>
              <div style={{
                width:42, height:42, borderRadius:'50%', background:it.color,
                color:'white', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:20
              }}>{it.icon}</div>
              <div>
                <div className="font-display" style={{fontSize:15}}>{it.title}</div>
                <div style={{fontSize:13, color:'rgba(42,31,26,0.7)'}}>{it.thing}</div>
              </div>
            </div>
          ))}
        </div>
        <PageNumber n={10} side="left"/>
      </div>

      {/* RIGHT — closing */}
      <div style={{
        flex:1, padding:'48px 40px',
        background:'linear-gradient(135deg, var(--kura) 0%, var(--kura-deep) 100%)',
        color:'white', position:'relative',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center'
      }}>
        <div style={{
          fontSize:90, animation:'pop .6s var(--t-bounce)',
          background:'var(--gold)', width:140, height:140, borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 12px 40px rgba(0,0,0,0.3)'
        }}>🌟</div>
        <div className="font-script" style={{fontSize:48, marginTop:18, color:'rgba(255,255,255,0.95)', lineHeight:1}}>
          Ka rawe!
        </div>
        <div className="font-display" style={{fontSize:28, marginTop:4}}>You finished the book</div>
        <div style={{fontSize:15, opacity:0.85, maxWidth:280, marginTop:8, lineHeight:1.5}}>
          Try sharing one of your taonga with your whānau (family) tonight.
        </div>
        <button onClick={onRestart} className="btn-big gold" style={{marginTop:24, fontSize:18}}>
          Read it again ↻
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { CoverSpread, WaiataSpread, PepehaSpread, CustomsSpread, MythsSpread, BackSpread });
