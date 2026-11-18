import { useEffect, useState } from 'react';
import engine from '../audio/engine.js';
import { SFX_NAMES } from '../audio/sfxMap.js';
import { edicionVideo } from '../data/site.js';
import { STAR, LETTERS, BOX_FULL } from '../data/logo.js';

/*
  Pantalla de carga, sutil: solo el logo.
  - Mientras carga (mín. 1.4 s, máx. 6 s): la estrella respira y una línea fina avanza bajo el logo.
  - Al terminar: cada letra da un pequeño salto y luego los dos puntos de la ü rebotan cada pocos segundos.
  - Debajo: "entra con audio o entra sin audio". El primer clic permite al navegador reproducir sonido.
*/
const MIN_MS = 1400, MAX_MS = 6000;
const wait = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
const DOTS = LETTERS.dots.split('Z').filter(Boolean).map((d) => d + 'Z');

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('loading');
    const tasks = [
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true }))),
      new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = edicionVideo.poster; }),
      ...SFX_NAMES.map((n) => fetch('/audio/sfx/' + n + '.mp3').then((x) => x.blob()).catch(() => {})),
    ];
    let done = 0, raf = 0, shown = 0, alive = true;
    tasks.forEach((t) => wait(Promise.resolve(t), MAX_MS).finally(() => { done++; }));
    const t0 = performance.now();
    const tick = (now) => {
      const el = now - t0;
      const target = Math.min(el / MIN_MS, el > MAX_MS ? 1 : done / tasks.length);
      shown += (target - shown) * 0.12;
      if (target >= 1 && shown > 0.995) shown = 1;
      if (alive) setPct(shown);
      if (shown < 1) raf = requestAnimationFrame(tick); else setReady(true);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const k = (e) => { if (e.key === 'Enter') enter(true); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });

  function enter(withSound) {
    if (!ready || leaving) return;
    if (withSound && !engine.enabled) engine.enable();
    const cur = engine.activeScreen;          // reinicia la pantalla actual con su sonido
    engine.setActiveScreen(null);
    engine.setActiveScreen(cur);
    setLeaving(true);
    document.documentElement.classList.remove('loading');
    setTimeout(() => setGone(true), 800);
  }

  if (gone) return null;
  return (
    <div className={'loader' + (ready ? ' ready' : '') + (leaving ? ' leaving' : '')} role="dialog" aria-modal="true" aria-label="Bienvenida a nüvo">
      <div className="ld-in">
        <svg className="ld-logo" viewBox={BOX_FULL} role="img" aria-label="nüvo">
          <defs>
            <linearGradient id="ld-g" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#60A5FF" /><stop offset=".45" stopColor="#3478FF" /><stop offset="1" stopColor="#1B3FB8" />
            </linearGradient>
          </defs>
          <path className="ld-star" d={STAR} fill="url(#ld-g)" />
          {['n', 'u', 'v', 'o'].map((k, i) => (
            <path key={k} className="ld-l" style={{ '--i': i }} d={LETTERS[k]} fill="#FBFCFF" fillRule="evenodd" />
          ))}
          {DOTS.map((d, i) => <path key={i} className="ld-dot" style={{ '--i': i }} d={d} fill="#FBFCFF" />)}
        </svg>

        <div className="ld-foot">
          <div className="ld-trk" aria-hidden="true"><i style={{ transform: 'scaleX(' + pct.toFixed(3) + ')' }} /></div>
          <p className="ld-txt" aria-live="polite">
            {ready ? (
              <>
                <button type="button" onClick={() => enter(true)} autoFocus>entra con audio</button>
                <span> o </span>
                <button type="button" onClick={() => enter(false)}>entra sin audio</button>
              </>
            ) : <span className="ld-pct">{Math.round(pct * 100)}%</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
