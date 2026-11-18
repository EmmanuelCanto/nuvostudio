import { useRef } from 'react';
import { useScene } from '../scenes/useScene.js';
import { E, seg, draw, q, qa } from '../scenes/anim.js';
import { webCues } from '../audio/sfxMap.js';
import Nuvo from './Nuvo.jsx';

export default function Web() {
  const ref = useRef(null);
  /* ---- 04 Web: wireframe → color → clic → celular ---- */
  useScene(ref, {
    duration: 11, finalT: 9, loop: true,
    cues: () => webCues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => 3.3 + i * .06)),
    init(el) {
      const wl = qa(el, '.wl'), wf = qa(el, '.wf'), cur = q(el, '.wcur'), rip = q(el, '.wrip'), btn = q(el, '.wbtn');
      const phone = q(el, '.wphone'), arc = q(el, '.warc'), num = q(el, '.wnum'), gauge = q(el, '.wgauge'), svg = q(el, 'svg');
      return function (t) {
        const out = 1 - seg(t, 10.3, 10.9);
        svg.style.opacity = .12 + .88 * out;
        wl.forEach((l, i) => { draw(l, E(seg(t, .2 + i * .15, 1 + i * .15))); });
        wf.forEach((f, i) => { f.style.opacity = E(seg(t, 3.3 + i * .06, 3.8 + i * .06)); });
        const m = E(seg(t, 4.7, 5.8)), ck = seg(t, 5.9, 6.5);
        cur.setAttribute('transform', 'translate(' + (372 - 272 * m).toFixed(1) + ' ' + (318 - 130 * m).toFixed(1) + ')');
        cur.style.opacity = seg(t, 4.5, 4.8) * (1 - seg(t, 6.8, 7.2));
        const press = 1 - .08 * Math.sin(Math.PI * seg(t, 5.85, 6.15));
        btn.setAttribute('transform', 'translate(94 186) scale(' + press.toFixed(3) + ') translate(-94 -186)');
        rip.setAttribute('r', 6 + ck * 34); rip.style.opacity = ck > 0 && ck < 1 ? 1 - ck : 0;
        const ps = E(seg(t, 6.4, 7.4));
        phone.setAttribute('transform', 'translate(' + (402 + (1 - ps) * 90).toFixed(1) + ' 118)');
        phone.style.opacity = ps;
        const gp = E(seg(t, 7.3, 8.8));
        gauge.style.opacity = seg(t, 7, 7.4);
        draw(arc, gp * .98); num.textContent = Math.round(gp * 98);
      };
    },
  });
  return (
    <section className="sec light" id="web">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">páginas</span> web</span></div>
        <div className="row flip">
          <div className="body">
            <span className="blue-rule"></span>
            <h2>Que te encuentren en Google y <em>te escriban</em> por WhatsApp.</h2>
            <p>Landing pages, sitios completos y menús digitales rápidos, claros y pensados para el celular.</p>
            <ul className="slashes"><li>Landing pages</li><li>Sitios</li><li>Menús digitales</li></ul>
            <p style={{ marginTop: '1.8rem' }}><a className="btn btn-b" href="#contacto">Cotizar mi página</a></p>
          </div>
          <div className="stage web-sc" id="sc-web" ref={ref} role="img" aria-label="Un sitio web se dibuja línea por línea en un navegador, se llena de color, un cursor hace clic en el botón y aparece la versión para celular con un indicador de velocidad de 98">
            <svg viewBox="0 0 560 390" aria-hidden="true">
              <rect className="wf0" x="10" y="40" width="400" height="300" rx="12" fill="#fff" />
              <rect className="dr wl" pathLength="1" x="10" y="40" width="400" height="300" rx="12" />
              <path className="dr wl" pathLength="1" d="M10 70H410" />
              <circle className="wf" cx="28" cy="55" r="4" fill="#D5D5CE" /><circle className="wf" cx="42" cy="55" r="4" fill="#D5D5CE" /><circle className="wf" cx="56" cy="55" r="4" fill="#D5D5CE" />
              <rect className="dr wl" pathLength="1" x="140" y="47" width="180" height="16" rx="8" />
              <path className="dr wl" pathLength="1" d="M30 88h44M290 88h22M324 88h22M358 88h32" strokeWidth="5" />
              <rect className="wf" x="30" y="104" width="360" height="112" rx="8" fill="#0658F9" />
              <rect className="dr wl" pathLength="1" x="30" y="104" width="360" height="112" rx="8" />
              <path className="dr wl" pathLength="1" d="M48 132h150M48 150h108" strokeWidth="9" />
              <path className="wf" d="M48 132h150M48 150h108" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
              <rect className="wf" x="282" y="120" width="90" height="80" rx="8" fill="#fff" fillOpacity=".22" />
              <rect className="dr wl" pathLength="1" x="282" y="120" width="90" height="80" rx="8" />
              <g className="wbtn"><rect className="wf" x="48" y="172" width="92" height="28" rx="14" fill="#fff" /><rect className="dr wl" pathLength="1" x="48" y="172" width="92" height="28" rx="14" /><path className="wf" d="M68 186h52" stroke="#0B0B14" strokeWidth="4" strokeLinecap="round" /></g>
              <rect className="wf" x="30" y="230" width="112" height="96" rx="8" fill="#F1F1EC" /><rect className="wf" x="154" y="230" width="112" height="96" rx="8" fill="#F1F1EC" /><rect className="wf" x="278" y="230" width="112" height="96" rx="8" fill="#F1F1EC" />
              <rect className="wf" x="38" y="238" width="96" height="44" rx="5" fill="#B9CFFF" /><rect className="wf" x="162" y="238" width="96" height="44" rx="5" fill="#F2B35E" /><rect className="wf" x="286" y="238" width="96" height="44" rx="5" fill="#B9CFFF" />
              <rect className="dr wl" pathLength="1" x="30" y="230" width="112" height="96" rx="8" />
              <rect className="dr wl" pathLength="1" x="154" y="230" width="112" height="96" rx="8" />
              <rect className="dr wl" pathLength="1" x="278" y="230" width="112" height="96" rx="8" />
              <path className="dr wl" pathLength="1" d="M40 296h70M40 310h44M164 296h70M164 310h44M288 296h70M288 310h44" strokeWidth="4" />
              <circle className="wrip" cx="94" cy="186" r="0" fill="none" stroke="#0B0B14" strokeWidth="2" />
              <g className="wphone">
                <rect x="0" y="0" width="132" height="262" rx="20" fill="#fff" stroke="#0B0B14" strokeWidth="2" />
                <rect x="50" y="9" width="32" height="6" rx="3" fill="#0B0B14" />
                <path d="M12 32h30" stroke="#0B0B14" strokeWidth="5" strokeLinecap="round" /><path d="M104 30h16M104 35h16" stroke="#0B0B14" strokeWidth="2" strokeLinecap="round" />
                <rect x="10" y="46" width="112" height="84" rx="7" fill="#0658F9" />
                <path d="M20 66h72M20 80h50" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
                <rect x="20" y="96" width="62" height="22" rx="11" fill="#fff" />
                <rect x="10" y="138" width="112" height="52" rx="7" fill="#F1F1EC" /><rect x="16" y="144" width="40" height="40" rx="5" fill="#B9CFFF" /><path d="M64 156h46M64 170h30" stroke="#0B0B14" strokeWidth="4" strokeLinecap="round" />
                <rect x="10" y="198" width="112" height="52" rx="7" fill="#F1F1EC" /><rect x="16" y="204" width="40" height="40" rx="5" fill="#F2B35E" /><path d="M64 216h46M64 230h30" stroke="#0B0B14" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g className="wgauge" transform="translate(472 50)">
                <circle r="32" fill="#fff" stroke="#E2E2DC" strokeWidth="5" />
                <circle className="dr warc" pathLength="1" r="32" stroke="#0658F9" strokeWidth="5" transform="rotate(-90)" />
                <text className="wnum" y="1" textAnchor="middle" dominantBaseline="central" fontSize="25" fontWeight="600" letterSpacing="-1" fill="#0B0B14">0</text>
                <text y="52" textAnchor="middle" fontSize="12" fill="#575763">Velocidad en celular</text>
              </g>
              <path className="wcur" d="M0 0l0 19 5-4.500 3.500 8 3.200-1.400-3.500-7.800 6.800-.3z" fill="#0B0B14" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
