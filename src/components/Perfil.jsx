import { useRef } from 'react';
import { useScene } from '../scenes/useScene.js';
import { E, seg, back, draw, T, when, q, qa } from '../scenes/anim.js';
import { cvCues } from '../audio/sfxMap.js';
import { contact, whatsappUrl } from '../data/site.js';
import Grid from './Grid.jsx';
import Nuvo from './Nuvo.jsx';

/* Vista de perfil / CV, misma plantilla para ambos fundadores (datos en src/data/site.js) */
const NODES = [{ x: 20, y: 245, s: 16, fill: '#0B0B14' }, { x: 295, y: 152, s: 16, fill: '#0B0B14' }, { x: 600, y: 50, s: 14, fill: '#0658F9' }];

export default function Perfil({ founder: f, index, viewRef }) {
  const ref = useRef(null);
  const n = index + 1;
  /* ---- Perfiles: curva de trayectoria (una sola vez) ---- */
  useScene(ref, {
    duration: 3.4, finalT: 3.4, loop: false,
    cues: () => cvCues([.1, when(.2, 2.6, .5) - .1, 2.4]),
    init(el) {
      const c = q(el, '.curve'), nd = qa(el, '.nd'), lb = qa(el, '.lb'), ts = [.1, when(.2, 2.6, .5) - .1, 2.4];
      return function (t) {
        draw(c, E(seg(t, .2, 2.6)));
        nd.forEach((node, i) => { T(node, +node.dataset.x, +node.dataset.y, back(seg(t, ts[i], ts[i] + .45)), 0); });
        lb.forEach((l, i) => {
          const k = E(seg(t, ts[i] + .15, ts[i] + .75));
          l.style.opacity = k; l.style.transform = 'translateY(' + ((1 - k) * 8).toFixed(1) + 'px)';
        });
      };
    },
  });
  const [c0, c1, c2] = f.career;
  return (
    <div className="view light" id={'view-' + f.id} data-view={f.id} ref={viewRef} hidden>
      <div className="cv">
        <div className="wrap">
          <div className="meta"><span><Nuvo star={false} /> <span className="it">nuestros</span> perfiles</span><span>2026 / {f.counter}</span></div>
          <a className="back" href="#inicio">← Volver al estudio</a>
          <h1>Hola, soy {f.name}.<br />{f.roleParts[0]} <em>y</em> {f.roleParts[1]}.</h1>
          <div className="cv-mid">
            <div className="cv-about">
              <span className="tagline">Sobre mí</span>
              <p>{f.bio}</p>
              <p>{f.cofounder}</p>
              <ul className="cv-lines">
                {/* Solo los datos de la empresa (src/data/site.js -> contact y whatsappNumber) */}
                <li>Correo / <a href={'mailto:' + contact.email}>{contact.emailLabel}</a></li>
                <li>WhatsApp / <a href={whatsappUrl} rel="noopener">{contact.whatsappLabel}</a></li>
              </ul>
              <div className="btns">
                {f.cvUrl !== null && (f.cvUrl
                  ? <a className="btn btn-b" href={f.cvUrl} download>Descargar CV</a>
                  : <a className="btn btn-b" href="#">Descargar CV</a>)}
                <a className="btn btn-ok" href="#contacto">Trabajemos juntos</a>
              </div>
              {f.cvUrl === '' && <p className="hint">(reemplaza con el enlace a tu PDF)</p>}
            </div>
            <div className="career" id={'sc-cv' + n} ref={ref} role="img" aria-label="Curva de trayectoria profesional con tres etapas hasta nüvo">
              <svg viewBox="0 0 640 345" aria-hidden="true">
                <Grid grid="20,20,600,240,12,4" />
                <path className="dr curve" pathLength="1" d="M20 245 C 250 240, 330 70, 600 50" stroke="#0658F9" strokeWidth="3.5" />
                {NODES.map((nd, i) => <g className="nd" data-x={nd.x} data-y={nd.y} key={i}><rect x={-nd.s / 2} y={-nd.s / 2} width={nd.s} height={nd.s} transform="rotate(45)" fill={nd.fill} /></g>)}
                <g className="lb"><text className="yr" x="22" y="288">{c0.yr}</text><text className="nm" x="22" y="314">{c0.nm}</text>{c0.sub && <text className="sub" x="22" y="337">{c0.sub}</text>}</g>
                <g className="lb"><text className="yr" x="300" y="190">{c1.yr}</text><text className="nm" x="300" y="216">{c1.nm}</text>{c1.sub && <text className="sub" x="300" y="239">{c1.sub}</text>}</g>
                <g className="lb"><text className="yr" x="596" y="92" textAnchor="end">{c2.yr}</text><text className="nm" x="596" y="118" textAnchor="end">{c2.nm}</text>{c2.sub && <text className="sub" x="596" y="141" textAnchor="end">{c2.sub}</text>}</g>
              </svg>
            </div>
          </div>
          <div className="cv-body">
            <div>
              <div className="cv-block">
                <h2>Experiencia</h2>
                <ol className="cvlist">
                  {f.experience.map((e, i) => <li key={i}><span className="when">{e.when}</span><h3>{e.title}</h3><span className="org">{e.org}</span>{e.desc && <p>{e.desc}</p>}</li>)}
                </ol>
              </div>
              <div className="cv-block">
                <h2>Educación</h2>
                <ol className="cvlist">
                  {f.education.map((e, i) => <li key={i}><span className="when">{e.when}</span><h3>{e.title}</h3><span className="org">{e.org}</span></li>)}
                </ol>
              </div>
            </div>
            <aside>
              <div className="cv-block">
                <h2>Habilidades</h2>
                <ul className="plain">{f.skills.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
              <div className="cv-block">
                <h2>Herramientas</h2>
                <ul className="plain tools">{f.tools.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
              <a className="btn btn-ok" href="#inicio">← Volver al estudio</a>
            </aside>
          </div>
          <div className="cv-foot"><span>{contact.emailLabel}</span><span>{f.role}</span><span>{contact.city}, México</span></div>
        </div>
      </div>
    </div>
  );
}
