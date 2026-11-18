import { useRef } from 'react';
import { useScene } from '../scenes/useScene.js';
import { E, seg, back, draw, T, pad, q, qa } from '../scenes/anim.js';
import { motionCues } from '../audio/sfxMap.js';
import Grid from './Grid.jsx';

export default function Motion() {
  const ref = useRef(null), flowRef = useRef(null);
  /* ---- 02 Motion: editor ---- */
  useScene(ref, {
    duration: 9, finalT: 7, loop: true,
    cues: () => motionCues([7, 50, 66, 76].map((p) => p / 100 * 7)), // keyframes del timeline (tp*100 >= left)
    init(el) {
      const mp = q(el, '.mpath'), L = mp.getTotalLength(), shape = q(el, '.shape'), ghosts = qa(el, '.ghost');
      const words = qa(el, '.mw'), gc = q(el, '.gcurve'), dot = q(el, '.gdot'), hd = qa(el, '.hd');
      const kfs = qa(el, '.trk i'), ph = q(el, '#edPh'), fr = q(el, '#edF'), flow = qa(flowRef.current, 'li'), mend = q(el, '.mend');
      function place(node, e, sc) { const p = mp.getPointAtLength(e * L); T(node, p.x, p.y, sc, e * 180); }
      return function (t) {
        const out = 1 - seg(t, 8.3, 8.9), tp = seg(t, 0, 7), u = seg(t, .5, 3.5), e = E(u);
        ph.style.left = (tp * 100) + '%';
        fr.textContent = pad(Math.round(tp * 168), 3);
        kfs.forEach((k) => { k.classList.toggle('on', tp * 100 >= parseFloat(k.style.left) - .5); });
        draw(mp, e);
        place(shape, e, back(seg(t, .1, .5)) * (out > .01 ? 1 : 0) * (.2 + .8 * out));
        shape.setAttribute('rx', 9 + 10 * E(seg(t, 4.6, 5.3)));
        ghosts.forEach((g, i) => {
          const eg = E(Math.max(0, u - .05 * (i + 1)));
          place(g, eg, 1); g.setAttribute('opacity', (u > 0 && u < 1) ? .22 - i * .09 : 0);
        });
        T(mend, 356, 60, 1 + .5 * Math.sin(Math.PI * seg(t, 3.4, 3.9)), 0);
        hd.forEach((h) => { h.style.opacity = seg(t, .2, .6) * out; });
        draw(gc, E(seg(t, .2, 1.3))); gc.style.opacity = out;
        dot.setAttribute('cx', 20 + 160 * u); dot.setAttribute('cy', 180 - 160 * e);
        dot.style.opacity = seg(t, 1.1, 1.4) * out;
        words.forEach((w, i) => {
          const k = E(seg(t, 3.5 + i * .17, 4.1 + i * .17));
          w.style.opacity = k * out;
          w.style.filter = k < 1 ? 'blur(' + ((1 - k) * 7).toFixed(1) + 'px)' : 'none';
          w.style.transform = 'translateY(' + ((1 - k) * 10).toFixed(1) + 'px)';
          if (i > 1) w.style.fill = seg(t, 4.6, 5.3) > .5 ? '#0658F9' : '#0B0B14';
        });
        const st = t < 1.6 ? 0 : t < 5.4 ? 1 : 2;
        flow.forEach((li, i) => { li.classList.toggle('on', i <= st); });
      };
    },
  });
  const serif = { fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: 0 };
  return (
    <section className="sec light" id="motion">
      <div className="wrap row">
        <div className="body">
          <span className="blue-rule"></span>
          <h2>Videos que se entienden <em>en segundos</em>.</h2>
          <p>Reels, anuncios y videos explicativos con motion graphics: animamos lo que dices con líneas, cifras, iconos y texto, y lo mezclamos con música y efectos. Listos para Instagram, TikTok, Facebook o tu pantalla en sucursal.</p>
          <ul className="slashes"><li>Reels</li><li>Anuncios</li><li>Explainers</li><li>Subtítulos</li></ul>
          <ol className="flow" id="flow" ref={flowRef} aria-label="Pasos de un video">
            <li><strong>Tu video</strong>Lo que grabaste o tu audio</li>
            <li><strong>Animación</strong>Movimiento, música y efectos</li>
            <li><strong>Entrega</strong>Listo para tus redes</li>
          </ol>
        </div>
        <div className="stage ed" id="sc-motion" ref={ref} role="img" aria-label="Editor de animación: una figura recorre una trayectoria, se dibuja la curva de velocidad y se encienden los fotogramas clave en la línea de tiempo">
          <div className="ed-bar" aria-hidden="true"><span className="ed-dots"><i></i><i></i><i></i></span><b>nuvo_reel.aep</b><span className="ed-frame">F <span id="edF">000</span> / 168</span></div>
          <div className="ed-main" aria-hidden="true">
            <div className="ed-canvas">
              <svg viewBox="0 0 400 250">
                <path d="M44 204 C 150 204, 170 60, 356 60" fill="none" stroke="#9FBEFF" strokeWidth="1.5" strokeDasharray="4 6" />
                <path className="dr mpath" pathLength="1" d="M44 204 C 150 204, 170 60, 356 60" stroke="#0658F9" strokeWidth="2.5" />
                <g transform="translate(44 204)"><rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="#0B0B14" /></g>
                <g className="mend" transform="translate(356 60)"><rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="#0B0B14" /></g>
                <rect className="ghost" x="-19" y="-19" width="38" height="38" rx="9" fill="#0658F9" opacity="0" />
                <rect className="ghost" x="-19" y="-19" width="38" height="38" rx="9" fill="#0658F9" opacity="0" />
                <rect className="shape" x="-19" y="-19" width="38" height="38" rx="9" fill="#0658F9" />
                <text className="mw" x="172" y="176" fontSize="31" fontWeight="500" fill="#0B0B14">Tu</text>
                <text className="mw" x="212" y="176" fontSize="31" fontWeight="500" fill="#0B0B14">idea,</text>
                <text className="mw" x="172" y="212" fontSize="35" fill="#0B0B14" style={serif}>en</text>
                <text className="mw" x="208" y="212" fontSize="35" fill="#0B0B14" style={serif}>movimiento</text>
              </svg>
            </div>
            <div className="ed-graph">
              <svg viewBox="0 0 200 200">
                <Grid grid="20,20,160,160,4,4" />
                <line className="hd" x1="20" y1="180" x2="124" y2="180" stroke="#F2B35E" strokeWidth="1.5" />
                <line className="hd" x1="180" y1="20" x2="76" y2="20" stroke="#F2B35E" strokeWidth="1.5" />
                <circle className="hd" cx="124" cy="180" r="4" fill="#F2B35E" /><circle className="hd" cx="76" cy="20" r="4" fill="#F2B35E" />
                <path className="dr gcurve" pathLength="1" d="M20 180 C 124 180, 76 20, 180 20" stroke="#0658F9" strokeWidth="3" />
                <circle className="gdot" r="6" fill="#fff" stroke="#0658F9" strokeWidth="3" cx="20" cy="180" />
              </svg>
              <small>Curva de velocidad</small>
            </div>
          </div>
          <div className="tl" aria-hidden="true">
            <div className="tl-labels"><span>Posición</span><span>Texto</span><span>Forma</span></div>
            <div className="tl-tracks">
              <div className="trk"><b style={{ left: '7%', width: '43%' }}></b><i style={{ left: '7%' }}></i><i style={{ left: '50%' }}></i></div>
              <div className="trk"><b style={{ left: '50%', width: '16%' }}></b><i style={{ left: '50%' }}></i><i style={{ left: '66%' }}></i></div>
              <div className="trk"><b style={{ left: '66%', width: '10%' }}></b><i style={{ left: '66%' }}></i><i style={{ left: '76%' }}></i></div>
              <div className="tl-ph" id="edPh"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
