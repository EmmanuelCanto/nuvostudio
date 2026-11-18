import { useRef } from 'react';
import { useScene } from '../scenes/useScene.js';
import { E, seg, back, draw, T, when, popPill, q, qa } from '../scenes/anim.js';
import { heroCues } from '../audio/sfxMap.js';
import Grid from './Grid.jsx';
import Pill from './Pill.jsx';
import Ruler from './Ruler.jsx';
import Nuvo from './Nuvo.jsx';

export default function Hero() {
  const ref = useRef(null);
  const times = useRef([]);
  /* ---- 01 Hero: curva S con pastillas ---- */
  useScene(ref, {
    duration: 10.5, finalT: 8, loop: true,
    cues: () => heroCues(times.current),
    init(el) {
      const c = q(el, '.curve'), L = c.getTotalLength(), head = q(el, '.headd'), st = q(el, '.start');
      const pills = qa(el, '.pill'), kf = qa(el, '.kfp'), at = [.30, .50, .68, .86], ti = [], pts = [];
      // la regla azul de abajo marca el mismo tiempo que la escena (00:00 a 00:10; se detiene durante la pausa)
      const hero = el.closest('.hero'), ph = hero && hero.querySelector('.ruler-ph');
      at.forEach((f, i) => { ti[i] = when(.4, 3.6, f); pts[i] = c.getPointAtLength(f * L); });
      times.current = ti;
      return function (t) {
        const out = 1 - E(seg(t, 9.5, 10.2)), p = E(seg(t, .4, 3.6)), pt = c.getPointAtLength(p * L);
        draw(c, p); c.style.opacity = out;
        if (ph) ph.style.left = (Math.min(t, 10) * 10).toFixed(2) + '%';
        T(st, 10, 270, back(seg(t, 0, .5)) * out, 0);
        T(head, pt.x, pt.y, back(seg(t, .3, .8)) * out, 0);
        pills.forEach((g, i) => {
          popPill(g, back(seg(t, ti[i], ti[i] + .5)) * (1 - E(seg(t, 9.2 + i * .08, 9.7 + i * .08))));
          T(kf[i], pts[i].x, pts[i].y, back(seg(t, ti[i] - .1, ti[i] + .25)) * out, 0);
        });
      };
    },
  });
  const kf = <g className="kfp"><rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" fill="#fff" /></g>;
  return (
    <div className="hero dark" id="inicio">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">estudio</span> de edición</span></div>
        <div className="hero-grid">
          <div className="hero-id" style={{ '--i': 0 }}>
            <p className="hero-name"><Nuvo /></p>
            <p className="hero-role">Edición, motion graphics y web con ojos nuevos</p>
          </div>
          <h1 className="giant"><span className="w" style={{ '--i': 1 }}>Editamos</span> <em className="w" style={{ '--i': 2 }}>videos</em></h1>
          <div className="hero-cta" style={{ '--i': 3 }}>
            <p className="lead">Somos una pareja de editores de video. Tú grabas; nosotros cortamos, subtitulamos y animamos con motion graphics para que tu negocio se vea, se escuche y se recuerde. También hacemos páginas web y homenajes de voz, siempre con cuidado.</p>
            <div className="btns">
              <a className="btn btn-w" href="#contacto">Cuéntanos tu idea</a>
              <a className="btn btn-ow" href="#servicios">Ver servicios</a>
            </div>
          </div>
          <div className="hero-scene" id="sc-hero" ref={ref} role="img" aria-label="Curva de animación que sube sobre una cuadrícula y muestra los servicios: edición de video, motion graphics, homenajes de voz y sitios web">
            <svg viewBox="0 0 560 300" aria-hidden="true">
              <Grid grid="10,30,540,240,8,3" />
              <path className="dr curve" pathLength="1" d="M10 270 C 250 270, 310 30, 550 30" stroke="#4D8BFF" strokeWidth="3.5" />
              {kf}{kf}{kf}{kf}
              <g className="start"><rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="#fff" /></g>
              <g className="headd"><rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="#fff" /></g>
              <Pill x="118" y="168" r="-4">Motion graphics</Pill>
              <Pill x="372" y="192" r="4">Homenajes de voz</Pill>
              <Pill x="286" y="60" r="-3">Sitios web</Pill>
              <Pill x="478" y="102" r="5">Edición de video</Pill>
            </svg>
          </div>
        </div>
      </div>
      <Ruler />
    </div>
  );
}
