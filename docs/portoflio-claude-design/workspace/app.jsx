// Workspace — single-screen portfolio. No scroll-on-rails.
// Responsive: grid tiles are computed from container size; layout falls back
// to stacked on narrow viewports.

const MODES = [
  { id: 'grid', label: 'grid', icon: '▦', hint: 'Tiled windows — default' },
  { id: 'list', label: 'list', icon: '≡', hint: 'Dense scan' },
  { id: 'scatter', label: 'scatter', icon: '✦', hint: 'Drag to rearrange' },
  { id: 'draw', label: 'draw', icon: '✎', hint: 'Sketch on the workspace' },
];

const INFO_TABS = [
  { id: 'about', label: 'about.md' },
  { id: 'stack', label: 'stack.json' },
  { id: 'now', label: 'now.log' },
];

// measure helper — re-renders on resize
function useSize(ref) {
  const [sz, setSz] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      setSz({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return sz;
}

// compute default grid positions from container size.
// Picks 1/2/3 columns based on width. Returns layouted list of {id, x, y, w, h}.
function layoutGrid(projects, cw, ch) {
  if (cw < 100 || ch < 100) return null;
  const PAD = 16, TOP = 44, GAP = 12;
  // Always at least 2 cols once we have any width to work with; 3 cols when wide.
  const cols = cw >= 1100 ? 3 : 2;
  const tileW = Math.floor((cw - PAD * 2 - GAP * (cols - 1)) / cols);
  const rows = Math.ceil(projects.length / cols);
  const available = ch - TOP - PAD;
  // Let tile height shrink to fit all rows on screen (minimum 150 so content stays usable).
  // No minimum — let rows shrink to fit vertically so all projects always fit on screen.
  const tileH = Math.max(120, Math.floor((available - GAP * (rows - 1)) / rows));
  return projects.map((p, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    return {
      ...p,
      _x: PAD + c * (tileW + GAP),
      _y: TOP + r * (tileH + GAP),
      _w: tileW,
      _h: tileH,
    };
  });
}

function Workspace() {
  const [mode, setMode] = React.useState(() => {
    try { return localStorage.getItem('pa-mode') || 'grid'; } catch (e) { return 'grid'; }
  });
  const [scatterPos, setScatterPos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('pa-scatter') || '{}'); } catch (e) { return {}; }
  });
  const [tab, setTab] = React.useState('about');
  const [now, setNow] = React.useState(new Date());
  const [vw, setVw] = React.useState(window.innerWidth);
  const accent = '#FFB412';

  const canvasRef = React.useRef(null);
  const { w: cw, h: ch } = useSize(canvasRef);

  React.useEffect(() => {
    try { localStorage.setItem('pa-mode', mode); } catch (e) {}
  }, [mode]);

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const r = () => setVw(window.innerWidth);
    window.addEventListener('resize', r);
    return () => { clearInterval(t); window.removeEventListener('resize', r); };
  }, []);

  const narrow = vw < 820;

  // layouted positions for the current container
  const laidOut = React.useMemo(() => layoutGrid(PORTFOLIO_PROJECTS, cw, ch), [cw, ch]);

  // in scatter mode, apply persisted positions (absolute px). Fall back to
  // grid layout if no persisted pos.
  const projectsForRender = React.useMemo(() => {
    if (!laidOut) return [];
    if (mode === 'scatter') {
      return laidOut.map(p => {
        const saved = scatterPos[p.id];
        if (saved) {
          // clamp to container so they never escape
          const maxX = Math.max(0, cw - p._w);
          const maxY = Math.max(40, ch - p._h);
          return { ...p, _x: Math.min(Math.max(0, saved.x), maxX), _y: Math.min(Math.max(40, saved.y), maxY) };
        }
        return p;
      });
    }
    return laidOut;
  }, [laidOut, mode, scatterPos, cw, ch]);

  const handleDrag = (id, pos) => {
    setScatterPos(prev => {
      const next = { ...prev, [id]: pos };
      try { localStorage.setItem('pa-scatter', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const resetPositions = () => {
    try { localStorage.removeItem('pa-scatter'); } catch (e) {}
    setScatterPos({});
  };

  // ── narrow / mobile: stacked vertical layout ──
  if (narrow) {
    return <MobileLayout now={now} accent={accent} />;
  }

  return (
    <div style={{
      '--accent': accent,
      position: 'fixed', inset: 0, background: '#ebe7dc',
      fontFamily: '"Inter Tight", system-ui, sans-serif',
      color: '#141412', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* paper grid bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(20,20,18,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(20,20,18,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* sketch layer */}
      <SketchCanvas active={mode === 'draw'} accent={accent} />

      {/* HEADER */}
      <header style={{
        position: 'relative', zIndex: 60, flex: '0 0 auto',
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '10px 16px',
        borderBottom: '1px solid rgba(20,20,18,0.12)',
        background: 'rgba(235,231,220,0.92)', backdropFilter: 'blur(8px)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
          <div style={{
            width: 22, height: 22, border: '1px solid #141412', display: 'grid', placeItems: 'center',
            fontFamily: '"Inter Tight", sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '-0.02em',
          }}>PA</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              Pedro Alves
            </div>
            <div style={{ fontSize: 11, color: 'rgba(20,20,18,0.6)', whiteSpace: 'nowrap' }}>
              designer <span style={{ color: accent }}>/</span> developer · lisbon
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {/* mode switcher */}
          <div style={{
            display: 'flex', border: '1px solid rgba(20,20,18,0.2)',
            background: '#fbf9f4',
          }}>
            {MODES.map((m, i) => (
              <button key={m.id} onClick={() => setMode(m.id)} title={m.hint}
                style={{
                  padding: '6px 12px', fontFamily: 'inherit', fontSize: 12,
                  border: 'none', borderLeft: i === 0 ? 'none' : '1px solid rgba(20,20,18,0.15)',
                  background: mode === m.id ? '#141412' : 'transparent',
                  color: mode === m.id ? '#fbf9f4' : '#141412',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'background .12s',
                }}>
                <span style={{ fontSize: 11 }}>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(20,20,18,0.65)', flex: '0 0 auto' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3bc46a', boxShadow: '0 0 0 2px rgba(59,196,106,0.25)' }} />
            open to work
          </span>
          <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
            {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} WET
          </span>
          <a href="mailto:pedroalves.dv@gmail.com" style={{
            color: '#141412', textDecoration: 'none',
            border: '1px solid #141412', padding: '4px 10px',
            background: accent, whiteSpace: 'nowrap',
          }}>email ↗</a>
        </div>
      </header>

      {/* MAIN */}
      <main style={{
        position: 'relative', zIndex: 2, flex: '1 1 auto', minHeight: 0,
        display: 'grid', gridTemplateColumns: vw >= 1200 ? '1fr 320px' : '1fr 300px',
      }}>
        {/* workspace canvas */}
        <div ref={canvasRef} style={{ position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(20,20,18,0.12)' }}>
          {/* mode strip */}
          <div style={{
            position: 'absolute', top: 12, left: 20, zIndex: 10,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: 'rgba(20,20,18,0.55)', display: 'flex', gap: 12, alignItems: 'center',
            pointerEvents: 'auto',
          }}>
            <span>MODE_{mode.toUpperCase()}</span>
            <span style={{ color: 'rgba(20,20,18,0.3)' }}>·</span>
            <span>{MODES.find(m => m.id === mode).hint}</span>
            {mode === 'scatter' && (
              <button onClick={resetPositions} style={smallBtn}>[reset]</button>
            )}
            {mode === 'draw' && (
              <button onClick={() => window.__clearSketch && window.__clearSketch()} style={smallBtn}>[clear]</button>
            )}
          </div>

          {mode === 'list' ? (
            <ListView />
          ) : (
            <div style={{ position: 'absolute', inset: 0 }}>
              {projectsForRender.map(p => (
                <ProjectTile key={p.id} p={p} mode={mode} onDragEnd={handleDrag}
                  containerW={cw} containerH={ch} />
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside style={{
          display: 'flex', flexDirection: 'column', minHeight: 0,
          background: '#f2efe8',
        }}>
          <div style={{
            display: 'flex', borderBottom: '1px solid rgba(20,20,18,0.12)',
            background: '#ebe7dc', flex: '0 0 auto',
          }}>
            {INFO_TABS.map((t, i) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '10px 8px', fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11, border: 'none',
                  borderRight: i < INFO_TABS.length - 1 ? '1px solid rgba(20,20,18,0.1)' : 'none',
                  background: tab === t.id ? '#f2efe8' : 'transparent',
                  borderBottom: tab === t.id ? '2px solid ' + accent : '2px solid transparent',
                  color: tab === t.id ? '#141412' : 'rgba(20,20,18,0.55)',
                  cursor: 'pointer',
                }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ flex: '1 1 auto', overflow: 'auto', padding: '16px 18px', minHeight: 0 }}>
            {tab === 'about' && <AboutPane />}
            {tab === 'stack' && <StackPane />}
            {tab === 'now' && <NowPane />}
          </div>
          <div style={{
            borderTop: '1px solid rgba(20,20,18,0.12)', padding: '9px 14px',
            display: 'flex', justifyContent: 'space-between', gap: 8,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            flex: '0 0 auto', flexWrap: 'nowrap', whiteSpace: 'nowrap',
          }}>
            <a href="https://www.linkedin.com/in/pedroalves-dv/" target="_blank" rel="noopener" style={sideLink}>linkedin</a>
            <a href="https://github.com/pedroalves-dv" target="_blank" rel="noopener" style={sideLink}>github</a>
            <a href="https://pedroalvesmadeira.tumblr.com/" target="_blank" rel="noopener" style={sideLink}>tumblr</a>
          </div>
        </aside>
      </main>

      {/* STATUS BAR */}
      <footer style={{
        position: 'relative', zIndex: 3, flex: '0 0 auto', height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', borderTop: '1px solid rgba(20,20,18,0.12)',
        background: '#e2ded2', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
        color: 'rgba(20,20,18,0.65)', whiteSpace: 'nowrap',
      }}>
        <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
          <span>portfolio.exe</span>
          <span style={{ color: 'rgba(20,20,18,0.35)' }}>·</span>
          <span>{PORTFOLIO_PROJECTS.length} projects</span>
        </div>
        <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
          {vw >= 1000 && <><span>hand-coded</span><span style={{ color: 'rgba(20,20,18,0.35)' }}>·</span></>}
          <span>© 2026</span>
          <span style={{ color: 'rgba(20,20,18,0.35)' }}>·</span>
          <span style={{ color: accent }}>v2.0</span>
        </div>
      </footer>
    </div>
  );
}

const sideLink = { color: '#141412', textDecoration: 'none', opacity: 0.7 };
const smallBtn = {
  border: '1px solid rgba(20,20,18,0.3)', background: 'transparent',
  fontFamily: 'inherit', fontSize: 10, padding: '2px 8px',
  cursor: 'pointer', color: '#141412', letterSpacing: 1,
};

// ───────────────────────── list view ─────────────────────────
function ListView() {
  return (
    <div style={{
      position: 'absolute', top: 40, left: 20, right: 20, bottom: 20,
      overflow: 'auto',
      border: '1px solid rgba(20,20,18,0.12)', background: '#fbf9f4',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 140px 80px 50px 40px',
        gap: 12, padding: '10px 16px',
        borderBottom: '1px solid rgba(20,20,18,0.15)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1,
        color: 'rgba(20,20,18,0.45)', textTransform: 'uppercase',
        background: '#f2efe8', position: 'sticky', top: 0, zIndex: 2,
      }}>
        <span>№</span><span>title</span><span>stack</span><span>tag</span><span>yr</span><span></span>
      </div>
      {PORTFOLIO_PROJECTS.map(p => (
        <ProjectTile key={p.id} p={p} mode="list" />
      ))}
    </div>
  );
}

// ───────────────────────── sidebar panes ─────────────────────────
function AboutPane() {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(20,20,18,0.85)' }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1,
        color: 'rgba(20,20,18,0.5)', marginBottom: 10, textTransform: 'uppercase',
      }}>// readme</div>
      <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.35, fontWeight: 500, letterSpacing: '-0.01em', color: '#141412', textWrap: 'pretty' }}>
        Designer with a developer's toolkit.
      </p>
      <p style={{ margin: '0 0 12px', textWrap: 'pretty' }}>
        I design interfaces and build them. Work sits in the middle:
        research and concept through high-fidelity design and production code.
      </p>
      <p style={{ margin: '0', color: 'rgba(20,20,18,0.6)', textWrap: 'pretty' }}>
        Based in Lisbon. Available for selected projects.
      </p>
    </div>
  );
}

function StackPane() {
  const rows = [
    ['design', ['Figma', 'Sketch', 'Adobe CS']],
    ['code', ['React', 'Next.js', 'TS']],
    ['styling', ['Tailwind', 'CSS']],
    ['prototype', ['Framer', 'Code', 'Rive']],
    ['research', ['Interviews', 'Journeys']],
  ];
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#141412', lineHeight: 1.6 }}>
      <div style={{ color: 'rgba(20,20,18,0.4)' }}>{'{'}</div>
      {rows.map(([k, vs], i) => (
        <div key={k} style={{ paddingLeft: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(20,20,18,0.55)' }}>"{k}":</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            [{vs.map((v, j) => (
              <React.Fragment key={v}>
                <span style={{ color: 'var(--accent)', background: 'rgba(255,180,18,0.12)', padding: '0 2px' }}>"{v}"</span>
                {j < vs.length - 1 && ', '}
              </React.Fragment>
            ))}]{i < rows.length - 1 && ','}
          </span>
        </div>
      ))}
      <div style={{ color: 'rgba(20,20,18,0.4)' }}>{'}'}</div>
    </div>
  );
}

function NowPane() {
  const lines = [
    { t: 'Apr 26', m: 'Rebuilding this site.' },
    { t: 'Mar 26', m: 'Shipped Meridian v2 — timeline view.' },
    { t: 'Feb 26', m: 'Case study in the works.' },
    { t: 'Jan 26', m: 'Two client projects.' },
    { t: 'Dec 25', m: 'Pixel painter — eyedropper.' },
  ];
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5 }}>
      <div style={{ color: 'rgba(20,20,18,0.5)', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase', fontSize: 10 }}>// tail -f now.log</div>
      {lines.map((l, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '58px 1fr', gap: 10, padding: '4px 0', borderBottom: i < lines.length - 1 ? '1px dashed rgba(20,20,18,0.12)' : 'none' }}>
          <span style={{ color: 'rgba(20,20,18,0.5)' }}>{l.t}</span>
          <span style={{ color: '#141412' }}>{l.m}</span>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────── mobile fallback ─────────────────────────
function MobileLayout({ now, accent }) {
  const [tab, setTab] = React.useState('work');
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#ebe7dc', color: '#141412',
      fontFamily: '"Inter Tight", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <header style={{
        padding: '14px 16px', borderBottom: '1px solid rgba(20,20,18,0.12)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#ebe7dc',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}>Pedro Alves</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(20,20,18,0.6)' }}>
            designer <span style={{ color: accent }}>/</span> dev · lisbon
          </div>
        </div>
        <a href="mailto:pedroalves.dv@gmail.com" style={{
          border: '1px solid #141412', padding: '5px 10px', background: accent,
          color: '#141412', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
        }}>email ↗</a>
      </header>

      <div style={{ display: 'flex', borderBottom: '1px solid rgba(20,20,18,0.12)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
        {['work', 'about', 'stack', 'now'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px 8px', border: 'none',
            background: tab === t ? '#f2efe8' : 'transparent',
            borderBottom: tab === t ? '2px solid ' + accent : '2px solid transparent',
            color: tab === t ? '#141412' : 'rgba(20,20,18,0.55)',
            fontFamily: 'inherit', cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {tab === 'work' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PORTFOLIO_PROJECTS.map(p => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener" style={{
                display: 'block', textDecoration: 'none', color: '#141412',
                background: '#fbf9f4', border: '1px solid rgba(20,20,18,0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderBottom: '1px solid rgba(20,20,18,0.1)', background: '#f2efe8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(20,20,18,0.7)' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff6057', opacity: 0.8 }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e', opacity: 0.8 }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f', opacity: 0.8 }} />
                  </div>
                  <span style={{ flex: 1, marginLeft: 4 }}>~/projects/{p.id}</span>
                  <span>{p.num}</span>
                </div>
                <div style={{ height: 160, background: '#e8e4d8', overflow: 'hidden' }}>
                  {p.img ? (
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%',
                      backgroundImage: 'repeating-linear-gradient(45deg, rgba(20,20,18,0.06) 0 10px, transparent 10px 20px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(20,20,18,0.5)', letterSpacing: 1,
                    }}>[ SCREENSHOT ]</div>
                  )}
                </div>
                <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>{p.title}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(20,20,18,0.55)', marginTop: 2 }}>{p.stack.join(' · ')}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(20,20,18,0.5)' }}>'{String(p.year).slice(2)} ↗</span>
                </div>
              </a>
            ))}
          </div>
        )}
        {tab === 'about' && <AboutPane />}
        {tab === 'stack' && <StackPane />}
        {tab === 'now' && <NowPane />}
      </div>

      <footer style={{
        padding: '8px 16px', borderTop: '1px solid rgba(20,20,18,0.12)',
        background: '#e2ded2', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
        color: 'rgba(20,20,18,0.65)', display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} WET</span>
        <span style={{ color: accent }}>open to work</span>
      </footer>
    </div>
  );
}

window.Workspace = Workspace;
