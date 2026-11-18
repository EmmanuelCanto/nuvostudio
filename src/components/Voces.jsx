import { useEffect, useRef, useState } from 'react';
import { useScene } from '../scenes/useScene.js';
import { useScreenLeave } from '../screens.js';
import { E, seg, bars, q, qa } from '../scenes/anim.js';
import { vocesCues, voiceKeyPlan, VOICE_GAIN } from '../audio/sfxMap.js';
import { useCues } from '../audio/useCues.js';
import { useAudio } from '../audio/AudioProvider.jsx';
import { voices } from '../data/site.js';
import Nuvo from './Nuvo.jsx';

const PLAY = 'M4 2l10 6-10 6z', PAUSE = 'M3.5 2h3.2v12H3.5zM9.300 2h3.2v12H9.300z';
const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

export default function Voces() {
  const ref = useRef(null);
  const inAudio = useRef(null), outAudio = useRef(null);
  const ext = useRef({});
  const { engine, ensureCtx, duck } = useAudio();

  // Audios reales (opcionales): entrada original (paso 01) y salida clonada + cues (paso 04)
  // Si falta cualquiera de los dos (el JSON responde 404/HTML o el MP3 no decodifica), la animación sigue muda.
  const origUrl = '/audio/voz/' + voices.voces.original + '.mp3';
  const cues = useCues(voices.voces.clonada);
  const real = !!(cues && cues.words);
  const [waves, setWaves] = useState(null);     // { in:{bars,duration}, out:{bars,duration} }
  const [state, setState] = useState(null);     // null | 'in' | 'out'
  const [sub, setSub] = useState(null);         // { prev, cur, next, k, n }

  useEffect(() => {
    if (!real) return undefined;
    let alive = true;
    Promise.all([engine.waveform(origUrl, 60), engine.waveform(cues.audio, 40)])
      .then(([a, b]) => { if (alive) setWaves({ in: a, out: b }); })
      .catch(() => { if (alive) setWaves(null); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [real]);
  const ready = real && !!waves;

  /* ---- 03 Voces: audio + texto → IA → voz ---- */
  const ctl = useScene(ref, {
    duration: 13.5, finalT: 11, loop: true,
    cues: vocesCues,
    init(el) {
      const wi = bars(q(el, '#waveIn'), 60), wo = bars(q(el, '#waveOut'), 40), typed = q(el, '#typed'), orb = q(el, '#orb'), rings = qa(orb, 'u');
      const cA = q(el, '#connA'), cB = q(el, '#connB'), dur = q(el, '#vDur'), ic = q(el, '#playIc'), cards = qa(el, '.vcard');
      const txt = voices.voces.texto; // lo que se "teclea" en el paso 02 (mismo texto que la voz clonada)
      ext.current = {
        // Onda real del paso 01 mientras suena el audio original
        renderIn(ct, w) {
          const p = w.duration ? ct / w.duration : 0;
          cards[0].classList.add('on');
          wi.forEach((b, i) => {
            const shown = i / wi.length <= p;
            b.el.style.transform = 'scaleY(' + (shown ? w.bars[i] : w.bars[i] * .25).toFixed(3) + ')';
            b.el.style.opacity = shown ? 1 : .25;
          });
        },
        renderOut(ct, w, playing) {
          const p = w.duration ? ct / w.duration : 0;
          cards[2].classList.add('on');
          wo.forEach((b, i) => {
            b.el.style.transform = 'scaleY(' + w.bars[i].toFixed(3) + ')';
            b.el.classList.toggle('pl', i / wo.length < p);
          });
          dur.textContent = fmt(ct);
          ic.setAttribute('d', playing ? PAUSE : PLAY);
        },
        setOutStatic(w) { wo.forEach((b, i) => { b.el.style.transform = 'scaleY(' + w.bars[i].toFixed(3) + ')'; }); },
      };
      return function (t) {
        const scan = seg(t, .5, 2.4), play = seg(t, 9.3, 12.8), playing = t > 9.3 && t < 12.8;
        cards[0].classList.toggle('on', t > .2);
        cards[1].classList.toggle('on', t > 2.5);
        cards[2].classList.toggle('on', t > 8.9);
        wi.forEach((b, i) => {
          const shown = i / wi.length <= scan, live = .82 + .18 * Math.sin(t * 5 + i * .8);
          b.el.style.transform = 'scaleY(' + (shown ? b.v * live : .08).toFixed(3) + ')';
          b.el.style.opacity = shown ? 1 : .25;
        });
        typed.textContent = txt.slice(0, Math.round(txt.length * seg(t, 2.8, 5.8)));
        cA.style.setProperty('--p', E(seg(t, 6, 7.1)).toFixed(3));
        const g = seg(t, 6.9, 7.5) * (.65 + .35 * Math.sin(t * 4));
        orb.style.setProperty('--g', (t > 6.9 ? Math.max(.25, g) : 0).toFixed(3));
        rings.forEach((r, i) => {
          const k = (t > 7 && t < 9.4) ? ((t - 7) / 1.2 + i * .5) % 1 : 0;
          r.style.transform = 'scale(' + (1 + k * .9).toFixed(3) + ')';
          r.style.opacity = k ? (1 - k) * .8 : 0;
        });
        cB.style.setProperty('--p', E(seg(t, 8.2, 9)).toFixed(3));
        wo.forEach((b, i) => {
          const live = playing ? .45 + .55 * Math.abs(Math.sin(t * 6.5 + i * .9)) : .7;
          b.el.style.transform = 'scaleY(' + (b.v * live).toFixed(3) + ')';
          b.el.classList.toggle('pl', i / wo.length < play);
        });
        dur.textContent = '0:0' + Math.floor(play * 6);
        ic.setAttribute('d', playing ? PAUSE : PLAY);
      };
    },
  });

  // ---- Reproducción real: pausa el reloj de la escena y lo reanuda al terminar ----
  useEffect(() => {
    if (!state || !ready) return undefined;
    const a = state === 'in' ? inAudio.current : outAudio.current;
    const w = state === 'in' ? waves.in : waves.out;
    const x = ext.current;
    let raf = 0, lastW = -1;
    const plan = state === 'out' ? voiceKeyPlan(cues.words) : {};
    ctl.current.pause();
    duck(true);
    const loop = () => {
      const ct = a.currentTime;
      if (state === 'in') x.renderIn(ct, w);
      else {
        x.renderOut(ct, w, true);
        let wi = -1;
        for (let j = 0; j < cues.words.length; j++) { if (cues.words[j].s <= ct) wi = j; else break; }
        if (wi !== lastW) {
          lastW = wi;
          if (wi >= 0) {
            const cw = cues.words[wi];
            setSub({ prev: wi > 0 ? cues.words[wi - 1].w : '', cur: cw.w, next: wi < cues.words.length - 1 ? cues.words[wi + 1].w : '', k: !!cw.k, n: wi });
            if (plan[wi]) engine.playSfx(plan[wi], { force: true, gain: VOICE_GAIN });
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      duck(false);
      setSub(null);
      ctl.current.resume();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function toggle(which) {
    if (!ready) return;
    const a = which === 'in' ? inAudio.current : outAudio.current;
    const other = which === 'in' ? outAudio.current : inAudio.current;
    if (state === which) { a.pause(); return; }
    ensureCtx();
    if (other) { other.pause(); other.currentTime = 0; }
    a.currentTime = 0;
    const p = a.play();
    if (p && p.catch) p.catch(() => setState(null));
    setState(which);
  }
  const stopped = (which) => () => setState((s) => (s === which ? null : s));
  useScreenLeave(ref, () => { [inAudio.current, outAudio.current].forEach((a) => { if (a && !a.paused) a.pause(); }); });

  return (
    <section className="sec dark" id="voces" style={{ '--gx': '50%', '--gy': '34%' }}>
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">voces</span> que regresan</span><span>2026 / 06</span></div>
        <div className="head">
          <h2>Un recuerdo que se puede <em>volver a escuchar</em>.</h2>
          <p>Con audios que la familia nos comparte, recreamos con IA la voz de un ser querido que ya partió, para un mensaje, un video homenaje o un audio de recuerdo. Con calidez, respeto y reglas claras.</p>
        </div>

        <div className="stage vz" id="sc-voces" ref={ref} role="img" aria-label="Proceso en cuatro pasos: nos das un audio de tu ser querido, escribes el texto, la inteligencia artificial aprende su timbre y te entregamos un mensaje con su voz">
          <div className="vz-in" aria-hidden={ready ? undefined : 'true'}>
            <div className="vcard" data-s="1">
              <p className="vstep"><i>01</i>Nos das el audio</p>
              <div className="vfile">
                <svg viewBox="0 0 30 30" fill="none" stroke="#7FA8FF" strokeWidth="1.6" strokeLinejoin="round"><path d="M7 3h11l6 6v18H7z" /><path d="M18 3v6h6M12 21v-6l6-1.5v6" /><circle cx="10.500" cy="21" r="1.6" /><circle cx="16.500" cy="19.500" r="1.6" /></svg>
                <span><b>nota_de_voz_abuela.m4a</b>Audio que la familia conserva</span>
                {ready && (
                  <button type="button" className="vbtn" onClick={() => toggle('in')} aria-pressed={state === 'in' ? 'true' : 'false'} aria-label={state === 'in' ? 'Pausar audio original' : 'Escuchar audio original'}>
                    <svg viewBox="0 0 16 16"><path d={state === 'in' ? PAUSE : PLAY} fill="currentColor" /></svg>
                  </button>
                )}
              </div>
              <div className="wave" id="waveIn"></div>
              {ready && <audio ref={inAudio} src={origUrl} preload="none" playsInline onEnded={stopped('in')} onPause={stopped('in')} />}
            </div>
            <div className="vcard" data-s="2">
              <p className="vstep"><i>02</i>Escribes el texto</p>
              <p className="vtype"><span id="typed"></span><span className="caret"></span></p>
            </div>
          </div>
          <div className="conn" id="connA" aria-hidden="true"><svg preserveAspectRatio="none" viewBox="0 0 100 200"><path d="M0 50 C 60 50, 40 100, 100 100" /><path d="M0 150 C 60 150, 40 100, 100 100" /></svg></div>
          <div className="vnode" aria-hidden="true">
            <div className="vorb" id="orb"><u></u><u></u>IA</div>
            <p className="vstep"><i>03</i>La IA aprende su timbre</p>
          </div>
          <div className="conn" id="connB" aria-hidden="true"><svg preserveAspectRatio="none" viewBox="0 0 100 200"><line x1="0" y1="100" x2="100" y2="100" /></svg></div>
          <div className="vcard vout" data-s="4" aria-hidden={ready ? undefined : 'true'}>
            <p className="vstep"><i>04</i>Te entregamos su voz</p>
            <div className="vplayer">
              {ready
                ? <button type="button" className="vplay" onClick={() => toggle('out')} aria-label={state === 'out' ? 'Pausar voz recreada' : 'Escuchar voz recreada'}><svg viewBox="0 0 16 16"><path id="playIc" d={PLAY} fill="#0B0B14" /></svg></button>
                : <span className="vplay"><svg viewBox="0 0 16 16"><path id="playIc" d={PLAY} fill="#0B0B14" /></svg></span>}
              <div className="wave" id="waveOut"></div>
            </div>
            <p className="vtime"><span>mensaje_para_ti.mp3</span><span><span id="vDur">0:00</span> / {ready ? fmt(waves.out.duration) : '0:06'}</span></p>
            {ready && (
              <div className="vsub" aria-live="off">
                <span className="s0">{sub ? sub.prev : ''}</span>
                <span className="s1 pop" key={sub ? sub.n : -1}>{sub ? (sub.k ? <em>{sub.cur}</em> : sub.cur) : ''}</span>
                <span className="s2">{sub ? sub.next : ''}</span>
              </div>
            )}
            {ready && <audio ref={outAudio} src={cues.audio} preload="none" playsInline onEnded={stopped('out')} onPause={stopped('out')} />}
          </div>
        </div>
        <p className="vnote">Solo trabajamos con el consentimiento por escrito de la familia y siempre queda claro que es una recreación. <a href="#politica-etica">Lee nuestra política ética</a></p>

        <div className="voces-grid">
          <div className="body">
            <p>A veces lo que más se extraña es una voz: cómo decía tu nombre, cómo se reía, cómo daba la bendición. A partir de notas de voz, videos o grabaciones que la familia conserva, creamos un audio breve con esa voz: unas palabras para una boda, un cumpleaños, un aniversario o un video homenaje.</p>
            <p>No pretendemos reemplazar a nadie. Es un gesto de memoria, elaborado junto con la familia, que decide cada palabra del mensaje y aprueba el resultado antes de la entrega.</p>
            <p>Si en algún momento sientes que no es para ti, se detiene el proyecto sin preguntas.</p>
            <ul className="slashes" style={{ marginBottom: '1.8rem' }}><li>Mensaje de voz</li><li>Video homenaje</li><li>Audio de recuerdo</li></ul>
            <a className="btn btn-w" href="#contacto">Platicar sin compromiso</a>
          </div>
          <div className="policy" id="politica-etica">
            <h3>Nuestra <em>política ética</em></h3>
            <ol>
              <li><span><strong>Solo con consentimiento.</strong> Trabajamos únicamente con la autorización de los familiares más cercanos o herederos de la persona, y lo dejamos por escrito.</span></li>
              <li><span><strong>Nunca para suplantar ni engañar.</strong> La voz no se usa para hacerse pasar por alguien, engañar a terceros, trámites, llamadas ni ningún tipo de fraude. Rechazamos cualquier solicitud así.</span></li>
              <li><span><strong>El resultado es de la familia.</strong> El audio o video final les pertenece. No lo publicamos ni lo usamos como muestra sin su permiso expreso.</span></li>
              <li><span><strong>Borramos los archivos si lo pides.</strong> Después de la entrega, eliminamos los audios originales y el modelo de voz a solicitud de la familia.</span></li>
              <li><span><strong>Transparencia.</strong> Siempre queda claro que se trata de una recreación hecha con inteligencia artificial.</span></li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
