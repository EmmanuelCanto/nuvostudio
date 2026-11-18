import { useEffect, useRef, useState } from 'react';
import { useScene } from '../scenes/useScene.js';
import { useScreenLeave } from '../screens.js';
import { E, seg, draw, T, q, qa } from '../scenes/anim.js';
import { editCues } from '../audio/sfxMap.js';
import { edicionVideo } from '../data/site.js';
import Nuvo from './Nuvo.jsx';

const W = ['Así', 'editamos', 'tus', 'videos', 'para', 'que', 'nadie', 'deje', 'de', 'verlos'];
const KEY = { 1: 1, 3: 1, 6: 1, 9: 1 };
const P = ['TikTok', 'Reels', 'Shorts'];

export default function Edicion() {
  const ref = useRef(null), videoRef = useRef(null);
  const ext = useRef({});          // partes de la escena reutilizadas mientras suena el video
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);   // el video se queda visible en pausa; se oculta al terminar

  /* ---- Edición de video: clips, subtítulos y motion ---- */
  const ctl = useScene(ref, {
    duration: 9, finalT: 8.4, loop: true,
    cues: () => editCues(Object.keys(KEY).map((i) => i * .84)), // palabras clave del subtítulo
    init(el) {
      const clips = qa(el, '.clip'), ph9 = q(el, '#ph9'), s0 = q(el, '#eS0'), s1 = q(el, '#eS1'), s2 = q(el, '#eS2'), ph = q(el, '#ePh');
      const cut = q(el, '#eCut'), plt = q(el, '#ePlt'), line = q(el, '.eline'), head = q(el, '.ehead'), cnt = q(el, '.ecnt'), L = line.getTotalLength();
      const subs = q(el, '#eSubs'), wave = q(el, '#eWave');
      let i, b, last = -1;
      function buildSubs(blocks) {
        subs.innerHTML = '';
        blocks.forEach((bk) => { b = document.createElement('i'); b.style.left = bk.left; b.style.width = bk.width; subs.appendChild(b); });
      }
      const defaultSubs = W.map((_, j) => ({ left: (j * 10 + .5) + '%', width: '8.5%' }));
      buildSubs(defaultSubs);
      wave.innerHTML = '';
      for (i = 0; i < 46; i++) { b = document.createElement('b'); b.style.height = (20 + 80 * Math.abs(Math.sin(i * 1.3) * Math.cos(i * .4))) + '%'; wave.appendChild(b); }

      function showWord(prev, cur, next, isKey) {
        s0.textContent = prev || '';
        s1.innerHTML = '';
        if (isKey) { const em = document.createElement('em'); em.textContent = cur; s1.appendChild(em); } else s1.textContent = cur;
        s2.textContent = next || '';
        s1.classList.remove('pop'); void s1.offsetWidth; s1.classList.add('pop');
      }
      // Partes comunes: playhead, clips, corte, línea y contador. tp = progreso 0..1, t9 = tiempo equivalente del ciclo de 9 s
      function common(tp, t9) {
        const k = Math.min(2, Math.floor(tp * 3));
        ph.style.left = 'calc(2.6rem + .5rem + (100% - 3.1rem) * ' + tp.toFixed(4) + ')';
        clips.forEach((c, j) => { c.style.opacity = j === k ? 1 : 0; });
        ph9.classList.toggle('light-clip', k === 2);
        plt.textContent = P[k];
        const near = Math.min(Math.abs(tp - 1 / 3), Math.abs(tp - 2 / 3));
        cut.style.left = 'calc(3.1rem + (100% - 3.1rem) * ' + (tp < .5 ? 1 / 3 : 2 / 3).toFixed(4) + ')';
        cut.style.opacity = near < .03 ? 1 : 0;
        let lp = E(seg(t9, .9, 2.6)) * (1 - seg(t9, 2.9, 3.1)), pt = line.getPointAtLength(Math.max(.001, lp) * L);
        if (k === 1) { lp = E(seg(t9, 3.4, 5)); pt = line.getPointAtLength(Math.max(.001, lp) * L); }
        if (k === 2) { lp = 0; }
        draw(line, lp); line.style.stroke = k === 1 ? '#F2B35E' : '#7FA8FF';
        T(head, pt.x, pt.y, lp > .01 ? 1 : 0, 0);
        cnt.style.fill = '#fff';
        cnt.textContent = k === 1 ? ('+' + Math.round(lp * 38) + '%') : (Math.round(lp * 150) + ' K');
        cnt.style.opacity = lp > .01 ? 1 : 0;
        return k;
      }
      ext.current = {
        // Mientras suena el video: la línea de tiempo de abajo avanza con él (tp = 0..1)
        progress(tp) { common(tp, tp * 8.4); },
      };
      return function (t) {
        const tp = seg(t, 0, 8.4), w = Math.min(W.length - 1, Math.floor(tp * W.length));
        common(tp, t);
        if (w !== last) {
          last = w;
          showWord(w > 0 ? W[w - 1] : '', W[w], w < W.length - 1 ? W[w + 1] : '', !!KEY[w]);
        }
      };
    },
  });

  // ---- Video "Así editamos tus videos" (hecho con motion graphics, con su propia voz, efectos y subtítulos) ----
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !playing) return undefined;
    let raf = 0;
    ctl.current.suspend();           // la escena se congela: el video manda (y no suenan los efectos de la página)
    const loop = () => { if (v.duration) ext.current.progress(Math.min(1, v.currentTime / v.duration)); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ctl.current.release(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  function play() {
    const v = videoRef.current;
    if (!v) return;
    setShown(true);
    if (v.ended) v.currentTime = 0;
    const pr = v.play();
    if (pr && pr.catch) pr.catch(() => setPlaying(false));
  }
  function pause() { const v = videoRef.current; if (v) v.pause(); }
  function toggle() { if (playing) pause(); else play(); }
  useScreenLeave(ref, () => { if (videoRef.current && !videoRef.current.paused) pause(); });

  return (
    <section className="sec tint" id="edicion">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">edición</span> de video</span><span>2026 / 03</span></div>
        <div className="row">
          <div className="body">
            <span className="blue-rule"></span>
            <h2>Editamos tus videos para <em>TikTok, Reels y Shorts</em>.</h2>
            <p>Nos mandas lo que grabaste con tu celular y te lo regresamos listo para publicar: con ritmo, subtítulos que atrapan y motion graphics que animan lo que dices.</p>
            <ul className="plat"><li>TikTok</li><li>Instagram Reels</li><li>YouTube Shorts</li><li>Facebook</li></ul>
            <ul className="feat">
              <li><b>Cortes y ritmo</b><span>Quitamos silencios y muletillas para que nadie se salga del video.</span></li>
              <li><b>Subtítulos palabra a palabra</b><span>Grandes, legibles y animados, en la parte baja del video.</span></li>
              <li><b>Motion graphics sincronizados</b><span>Líneas, cifras, mapas e iconos que aparecen justo cuando los dices.</span></li>
              <li><b>Música y efectos de sonido</b><span>Mezclados siempre por debajo de tu voz.</span></li>
              <li><b>Formato vertical 9:16</b><span>Listo para cada plataforma, con portada incluida.</span></li>
              <li><b>Con o sin cara</b><span>Hablando a cámara, solo con voz o puro motion graphics.</span></li>
            </ul>
          </div>
          <div className="stage ed2" id="sc-edit" ref={ref} role="img" aria-label="Un video vertical se edita: cambian los clips en cada corte, aparecen subtítulos palabra a palabra y un motion graphic se dibuja mientras avanza la línea de tiempo">
            <div className="ph9" id="ph9" aria-hidden="true">
              <div className="clip c1"></div><div className="clip c2" style={{ opacity: 0 }}></div><div className="clip c3" style={{ opacity: 0 }}></div>
              <svg className="person" viewBox="0 0 120 130"><circle cx="60" cy="40" r="26" fill="#0B0B14" fillOpacity=".55" /><path d="M8 130c4-40 26-56 52-56s48 16 52 56z" fill="#0B0B14" fillOpacity=".55" /></svg>
              <svg className="mgl" viewBox="0 0 90 160">
                <path className="dr eline" pathLength="1" d="M14 70 C 34 70, 46 40, 76 36" stroke="#7FA8FF" strokeWidth="1.6" />
                <g className="ehead"><rect x="-2.4" y="-2.4" width="4.8" height="4.8" transform="rotate(45)" fill="#fff" /></g>
                <text className="ecnt" x="76" y="30" textAnchor="end" fontSize="8" fontWeight="600" fill="#fff" style={{ fontFamily: 'var(--sans)' }}>0 K</text>
              </svg>
              <div className="grad"></div>
              <span className="rec">REC</span><span className="plt" id="ePlt">TikTok</span>
              <div className="sub"><span className="s0" id="eS0"></span><span className="s1" id="eS1"></span><span className="s2" id="eS2"></span></div>
              <video ref={videoRef} className={'ph9-video' + (shown ? ' on' : '')} src={edicionVideo.src} poster={edicionVideo.poster} preload="none" playsInline
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setShown(false); }} onClick={toggle} />
            </div>
            <div className="evoice">
              <button type="button" className="eplay" onClick={toggle} aria-label={playing ? 'Pausar video' : 'Ver video'} aria-pressed={playing ? 'true' : 'false'}>
                {playing
                  ? <svg viewBox="0 0 16 16"><path d="M3.5 2h3.2v12H3.5zM9.300 2h3.2v12H9.300z" fill="currentColor" /></svg>
                  : <svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z" fill="currentColor" /></svg>}
              </button>
              <span>{playing ? 'Así editamos tus videos' : <>Mira cómo <span className="it">editamos</span> · 23 s con sonido</>}</span>
            </div>
            <div className="etl" aria-hidden="true">
              <div className="etl-wrap">
                <div className="etl-row"><span>Video</span><div className="etl-trk v"><i style={{ left: 0, width: '33%' }}></i><i style={{ left: '33.5%', width: '33%' }}></i><i style={{ left: '67%', width: '33%' }}></i></div></div>
                <div className="etl-row"><span>Motion</span><div className="etl-trk m"><i style={{ left: '10%', width: '22%' }}></i><i style={{ left: '45%', width: '15%' }}></i><i style={{ left: '72%', width: '20%' }}></i></div></div>
                <div className="etl-row"><span>Subs</span><div className="etl-trk s" id="eSubs"></div></div>
                <div className="etl-row"><span>Voz</span><div className="etl-trk a" id="eWave"></div></div>
                <span className="etl-cut" id="eCut">✂ corte</span>
                <div className="etl-ph" id="ePh"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="ai2">
          <div><h3>Edición <em>a mano</em></h3><p>Cada corte, subtítulo y animación lo decidimos nosotros, cuadro por cuadro.</p></div>
          <div><h3>Sonido <em>cuidado</em></h3><p>Limpiamos tu audio y mezclamos música y efectos siempre por debajo de tu voz.</p></div>
          <div className="both"><h3>Tú <em>apruebas</em></h3><p>Te mandamos una versión para revisar y hacemos los ajustes que necesites antes de la entrega final.</p></div>
        </div>
      </div>
    </section>
  );
}
