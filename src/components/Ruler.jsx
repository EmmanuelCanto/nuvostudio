import { pad } from '../scenes/anim.js';
// Regla de tiempo (timeline) azul
export default function Ruler() {
  const spans = [];
  for (let i = 0; i <= 10; i++) spans.push(<span key={i} style={{ left: (i * 10) + '%' }}>{'00:' + pad(i, 2)}</span>);
  return (
    <div className="ruler" aria-hidden="true">
      <div className="ruler-in"><div className="ruler-trk">{spans}<div className="ruler-ph" /></div></div>
    </div>
  );
}
