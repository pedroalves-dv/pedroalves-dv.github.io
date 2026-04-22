// Project tile — renders as list row OR windowed card (grid/scatter).
// Coordinates come from the parent via p._x/_y/_w/_h (computed from
// container size, not hardcoded). Dragging is only enabled in scatter.

function ProjectTile({ p, mode, onDragEnd, containerW, containerH }) {
  const [hover, setHover] = React.useState(false);
  const [drag, setDrag] = React.useState(null);

  if (mode === 'list') {
    return (
      <a href={p.url} target="_blank" rel="noopener"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 140px 80px 50px 40px',
          gap: 12, padding: '11px 16px',
          borderBottom: '1px solid rgba(20,20,18,0.08)',
          textDecoration: 'none', color: '#141412', alignItems: 'center',
          background: hover ? 'rgba(255,180,18,0.1)' : 'transparent',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
          cursor: 'pointer', transition: 'background .1s',
        }}>
        <span style={{ color: 'rgba(20,20,18,0.45)' }}>{p.num}</span>
        <span style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}>
          {p.title}
        </span>
        <span style={{ color: 'rgba(20,20,18,0.6)' }}>{p.stack.join(' · ')}</span>
        <span style={{ color: 'rgba(20,20,18,0.6)' }}>{p.tag}</span>
        <span style={{ color: 'rgba(20,20,18,0.45)' }}>'{String(p.year).slice(2)}</span>
        <span style={{ textAlign: 'right', color: hover ? 'var(--accent)' : 'rgba(20,20,18,0.4)' }}>↗</span>
      </a>
    );
  }

  const isScatter = mode === 'scatter';

  const startDrag = (e) => {
    if (!isScatter) return;
    // ignore drag on the "open ↗" link
    if (e.target.closest('a')) return;
    e.preventDefault();
    const startPx = { x: e.clientX, y: e.clientY };
    const startPos = { x: p._x, y: p._y };
    setDrag(true);
    const move = (ev) => {
      const dx = ev.clientX - startPx.x;
      const dy = ev.clientY - startPx.y;
      const nx = Math.max(0, Math.min((containerW || 2000) - p._w, startPos.x + dx));
      const ny = Math.max(40, Math.min((containerH || 2000) - p._h, startPos.y + dy));
      onDragEnd(p.id, { x: nx, y: ny });
    };
    const up = () => {
      setDrag(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const sty = {
    position: 'absolute', left: p._x, top: p._y, width: p._w, height: p._h,
    background: '#fbf9f4', border: '1px solid rgba(20,20,18,0.15)',
    boxShadow: drag
      ? '0 16px 40px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.08)'
      : (hover ? '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.05)'),
    transition: drag ? 'none' : 'box-shadow .2s, transform .2s, left .25s cubic-bezier(.2,.9,.2,1), top .25s cubic-bezier(.2,.9,.2,1), width .25s, height .25s',
    transform: hover && !drag ? 'translateY(-2px)' : 'none',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    cursor: isScatter ? (drag ? 'grabbing' : 'grab') : 'default',
    userSelect: 'none',
  };

  return (
    <div style={sty}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={isScatter ? startDrag : undefined}
    >
      {/* titlebar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 10px', borderBottom: '1px solid rgba(20,20,18,0.1)',
        background: '#f2efe8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
        color: 'rgba(20,20,18,0.7)',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <Dot c="#ff6057" /><Dot c="#ffbd2e" /><Dot c="#27c93f" />
        </div>
        <span style={{ marginLeft: 6, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          ~/projects/{p.id}
        </span>
        <span style={{ color: 'rgba(20,20,18,0.4)' }}>{p.num}</span>
      </div>

      {/* image */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e8e4d8', minHeight: 0 }}>
        {p.img ? (
          <img src={p.img} alt={p.title} draggable={false}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hover ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform .5s cubic-bezier(.2,.9,.2,1)',
            }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(20,20,18,0.06) 0 10px, transparent 10px 20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(20,20,18,0.5)', letterSpacing: 1,
          }}>[ SCREENSHOT ]</div>
        )}
        <div style={{
          position: 'absolute', inset: 0, padding: 14,
          background: 'linear-gradient(to top, rgba(20,20,18,0.85) 0%, rgba(20,20,18,0.2) 55%, transparent 100%)',
          color: '#fbf9f4', opacity: hover ? 1 : 0, transition: 'opacity .2s',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.7, letterSpacing: 1, marginBottom: 4 }}>
            {p.role} · {p.year}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.4 }}>{p.desc}</div>
        </div>
      </div>

      {/* footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderTop: '1px solid rgba(20,20,18,0.08)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', minWidth: 0 }}>
          <span style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 14, fontWeight: 500, color: '#141412', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {p.title}
          </span>
          <span style={{ color: 'rgba(20,20,18,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.stack.join('·')}
          </span>
        </div>
        <a href={p.url} target="_blank" rel="noopener"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            color: hover ? 'var(--accent)' : 'rgba(20,20,18,0.5)',
            textDecoration: 'none', fontSize: 11, flexShrink: 0,
          }}>open ↗</a>
      </div>
    </div>
  );
}

function Dot({ c }) {
  return <div style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.85 }} />;
}

window.ProjectTile = ProjectTile;
