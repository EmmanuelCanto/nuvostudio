import { useRef } from 'react';
import { useScene } from '../scenes/useScene.js';
import { E, seg, back, draw, T, when, popPill, q, qa } from '../scenes/anim.js';
import { mktCues } from '../audio/sfxMap.js';
import { review } from '../data/site.js';
import Grid from './Grid.jsx';
import Pill from './Pill.jsx';
import Nuvo from './Nuvo.jsx';

const STAR = 'M12 2.500l2.900 6.200 6.700.8-5 4.600 1.300 6.700L12 17.500l-5.900 3.300 1.300-6.700-5-4.600 6.700-.8z';

export default function Marketing() {
  const ref = useRef(null);
  const times = useRef([]);
  /* ---- 05 Marketing: NFC → reseña → crecimiento ---- */
  useScene(ref, {
    duration: 13, finalT: 11, loop: true,
    cues: () => mktCues(times.current),
    init(el) {
      const phone = q(el, '.nphone'), msgb = q(el, '.nmsg'), rips = qa(el, '.rip'), stars = qa(q(el, '#stars'), 'svg');
      const rate = q(el, '#rate'), c = q(el, '.gcurve'), L = c.getTotalLength(), head = q(el, '.headd'), st = q(el, '.start');
      const pills = qa(el, '.pill'), a = q(el, '#mkA'), b = q(el, '#mkB'), at = [.3, .52, .78], ti = [];
      at.forEach((f, i) => { ti[i] = when(5.2, 8.6, f); });
      times.current = ti;
      return function (t) {
        const out = 1 - E(seg(t, 12.1, 12.8));
        const d = E(seg(t, .3, 1.5));
        phone.setAttribute('transform', 'translate(' + (196 + (1 - d) * 40).toFixed(1) + ' ' + (18 - (1 - d) * 26).toFixed(1) + ')');
        phone.style.opacity = .25 + .75 * seg(t, .3, .9);
        rips.forEach((r, i) => {
          const k = (t > 1.5 && t < 4.2) ? ((t - 1.5) / 1.3 + i / 3) % 1 : 0;
          r.setAttribute('r', 8 + k * 70); r.style.opacity = k ? (1 - k) * .9 : 0;
        });
        const mk = back(seg(t, 2.1, 2.6));
        msgb.setAttribute('transform', 'translate(48 89) scale(' + mk.toFixed(3) + ') translate(-48 -89)');
        stars.forEach((s, i) => {
          const k = back(seg(t, 3.3 + i * .28, 3.7 + i * .28));
          s.classList.toggle('on', k > 0); s.style.transform = 'scale(' + (k > 0 ? .6 + .4 * k : 1).toFixed(3) + ')';
        });
        rate.textContent = (4.9 * E(seg(t, 3.3, 5))).toFixed(1);
        const p = E(seg(t, 5.2, 8.6)), pt = c.getPointAtLength(p * L);
        draw(c, p); c.style.opacity = out;
        T(st, 20, 270, back(seg(t, 4.8, 5.2)) * out, 0);
        T(head, pt.x, pt.y, back(seg(t, 5.1, 5.5)) * out, 0);
        pills.forEach((g, i) => { popPill(g, back(seg(t, ti[i], ti[i] + .5)) * (1 - E(seg(t, 11.8 + i * .08, 12.3 + i * .08)))); });
        a.textContent = '+' + Math.round(120 * p);
        b.textContent = 'x' + (1 + 2 * E(seg(t, 6.4, 8.6))).toFixed(p < 1 ? 1 : 0);
      };
    },
  });
  return (
    <section className="sec dark" id="nfc" style={{ '--gx': '74%', '--gy': '60%' }}>
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">NFC</span> próximamente</span><span>2026 / 08</span></div>
        <div className="head">
          <h2><span className="soon">Próximamente</span>Más reseñas, <em>menos fricción</em>.</h2>
          <p>Muy pronto: tarjetas y stickers NFC. Tu cliente acerca su teléfono y, sin descargar nada, abre tu menú digital o la página para dejarte una reseña en Google Maps. Lo estamos preparando poco a poco.</p>
        </div>
        <div className="mk" id="sc-mkt" ref={ref} role="img" aria-label="Ejemplo ilustrativo: un teléfono toca una tarjeta NFC, aparece una reseña de cinco estrellas con calificación 4.9 y una curva de crecimiento con más reseñas y más alcance">
          <div className="mk-left" aria-hidden="true">
            <div className="stage mk-nfc">
              <svg viewBox="0 0 320 210">
                <g transform="translate(40 96)">
                  <rect width="176" height="100" rx="12" fill="rgba(255,255,255,.08)" stroke="#fff" strokeWidth="1.5" />
                  <text x="16" y="30" fontSize="15" fontWeight="500" letterSpacing="-.4">nüvo NFC</text>
                  <text x="16" y="82" fontSize="11" fillOpacity=".7">Acerca tu teléfono</text>
                  <path d="M132 22a10 10 0 0 1 0 14M139 17a17 17 0 0 1 0 24M146 12a24 24 0 0 1 0 34" fill="none" stroke="#7FA8FF" strokeWidth="2" strokeLinecap="round" />
                </g>
                <circle className="rip" cx="196" cy="140" r="0" fill="none" stroke="#7FA8FF" strokeWidth="2" />
                <circle className="rip" cx="196" cy="140" r="0" fill="none" stroke="#7FA8FF" strokeWidth="2" />
                <circle className="rip" cx="196" cy="140" r="0" fill="none" stroke="#7FA8FF" strokeWidth="2" />
                <g className="nphone">
                  <rect width="96" height="176" rx="16" fill="#07143F" stroke="#fff" strokeWidth="1.8" />
                  <rect x="36" y="8" width="24" height="5" rx="2.500" fill="#fff" />
                  <g className="nmsg">
                    <rect x="9" y="58" width="78" height="62" rx="9" fill="#FBFCFF" />
                    <text x="48" y="80" fontSize="10.500" fontWeight="600" textAnchor="middle" style={{ fill: '#0B0B14' }}>Deja tu reseña</text>
                    <rect x="20" y="92" width="56" height="17" rx="8.500" fill="#0658F9" />
                    <text x="48" y="104" fontSize="9" fontWeight="600" textAnchor="middle">Abrir</text>
                  </g>
                </g>
              </svg>
            </div>
            <div className="stage rev">
              <div className="rev-top"><span className="rev-av">{review.initials}</span><div><b>{review.business}</b><span>Reseñas en Google Maps</span></div></div>
              <div className="rev-rate"><span className="num" id="rate">4.9</span><span className="stars" id="stars">
                {[0, 1, 2, 3, 4].map((i) => <svg key={i} viewBox="0 0 24 24"><path d={STAR} /></svg>)}
              </span></div>
              <div className="rev-sk"><i></i><i></i></div>
              <span className="eg">Ejemplo ilustrativo</span>
            </div>
          </div>
          <div className="stage mk-chart" aria-hidden="true">
            <div className="mk-stats">
              <div><span className="num" id="mkA">+120</span>Reseñas</div>
              <div><span className="num" id="mkB">x3</span>Alcance</div>
            </div>
            <svg viewBox="0 0 560 300">
              <Grid grid="20,20,520,250,8,4" />
              <path className="dr gcurve" pathLength="1" d="M20 270 C 200 265, 300 180, 540 30" stroke="#4D8BFF" strokeWidth="3.5" />
              <g className="start" transform="translate(20 270)"><rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="#fff" /></g>
              <g className="headd"><rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="#fff" /></g>
              <Pill x="128" y="196" r="-3">Reels</Pill>
              <Pill x="236" y="138" r="3">Tarjetas NFC</Pill>
              <Pill x="366" y="62" r="-4">Google Maps</Pill>
            </svg>
            <span className="eg">Ejemplo ilustrativo. No son resultados de un cliente real.</span>
          </div>
        </div>
        <ul className="slashes"><li>Reseñas en Google Maps</li><li>Menú digital</li><li>Tarjetas</li><li>Stickers</li><li>Reels</li></ul>
      </div>
    </section>
  );
}
