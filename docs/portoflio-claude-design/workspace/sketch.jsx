// Sketch canvas — drawable overlay. Always sketchable when mode==='draw',
// otherwise only shows existing strokes. Persists to localStorage.

function SketchCanvas({ active, accent }) {
  const ref = React.useRef(null);
  const drawing = React.useRef(false);
  const last = React.useRef(null);

  React.useEffect(() => {
    const cv = ref.current;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      const saved = cv.toDataURL();
      cv.width = r.width * devicePixelRatio;
      cv.height = r.height * devicePixelRatio;
      const ctx = cv.getContext('2d');
      ctx.scale(devicePixelRatio, devicePixelRatio);
      // restore
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height);
      img.src = saved;
    };
    resize();
    window.addEventListener('resize', resize);

    // restore persisted
    try {
      const saved = localStorage.getItem('pa-sketch');
      if (saved) {
        const img = new Image();
        img.onload = () => {
          const r = cv.getBoundingClientRect();
          cv.getContext('2d').drawImage(img, 0, 0, r.width, r.height);
        };
        img.src = saved;
      }
    } catch (e) {}

    return () => window.removeEventListener('resize', resize);
  }, []);

  const persist = () => {
    try { localStorage.setItem('pa-sketch', ref.current.toDataURL()); } catch (e) {}
  };

  const pos = (e) => {
    const r = ref.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e) => {
    if (!active) return;
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const ctx = ref.current.getContext('2d');
    const p = pos(e);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const up = () => {
    if (drawing.current) persist();
    drawing.current = false;
  };

  const clear = () => {
    const ctx = ref.current.getContext('2d');
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    persist();
  };

  // expose clear globally via window
  React.useEffect(() => { window.__clearSketch = clear; }, []);

  return (
    <canvas ref={ref}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        zIndex: active ? 50 : 1,
        cursor: active ? 'crosshair' : 'default',
        touchAction: 'none',
        pointerEvents: active ? 'auto' : 'none',
      }} />
  );
}

window.SketchCanvas = SketchCanvas;
