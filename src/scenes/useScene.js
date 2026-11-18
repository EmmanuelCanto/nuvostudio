import { useEffect, useRef } from 'react';
import engine, { peakOf } from '../audio/engine.js';
import { uniqueCues } from '../audio/sfxMap.js';

// Pausa (s) en el estado final antes de que una escena en bucle vuelva a empezar.
export const HOLD = 4;
import { reduceMotion } from './anim.js';

/*
  Port del "motor de escenas" original como hook.
    useScene(ref, { duration, finalT, loop, hold, init, cues })
      init(el, ctl) -> render(t)   (se ejecuta una vez; puede devolver null para desactivar)
      cues: [{t, sfx, ...}] o función () => cues (evaluada tras init, por si dependen de él)
  - Si vive dentro de una .screen: arranca desde 0 cada vez que esa pantalla se vuelve
    la activa y se detiene al salir. Solo suena mientras su pantalla está activa, y en
    las escenas en bucle se queda `hold` segundos (HOLD por defecto) congelada en finalT
    antes de terminar y volver a empezar; los efectos suenan en cada vuelta.
  - Fuera de pantallas (vistas de perfil): IntersectionObserver, umbral .18.
  - Con prefers-reduced-motion dibuja el estado final (finalT) y no anima.
  - Cada cue suena una sola vez por ciclo, en (t − pico del archivo).
  Devuelve un ref con controles: { render, stop, suspend, release, pause, resume, isOn }.
*/
export function useScene(ref, opts) {
  const ctl = useRef({ render: () => {}, stop() {}, suspend() {}, release() {}, pause() {}, resume() {}, isOn: () => false });
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const o = optsRef.current;
    const reduce = reduceMotion();
    let render = null;
    try { render = o.init(el, ctl.current); } catch (e) { console.error('scene init', e); render = null; }
    if (!render) return undefined;
    const D = o.duration, fin = o.finalT == null ? D : o.finalT, loop = !!o.loop;
    const hold = loop ? (o.hold == null ? HOLD : o.hold) : 0;
    let cues = uniqueCues(typeof o.cues === 'function' ? o.cues() : (o.cues || []));
    // cue -> { start, offset }: el archivo arranca en (t − pico); si es negativo, empieza avanzado.
    cues = cues.map((c) => {
      const peak = peakOf(c.sfx);
      const start = Math.max(0, c.t - peak);
      return { ...c, start, offset: peak - (c.t - start) };
    });

    try { render(fin); } catch (e) { /* noop */ }

    const screen = el.closest('.screen');
    let on = false, done = false, suspended = false, paused = false, visible = false;
    let t0 = 0, raf = 0, last = -1, lastC = 0, pausedAt = 0, wasOn = false;

    function fire(a, b) {
      // dispara los cues con start en (a, b]
      if (!engine.enabled || !cues.length || !engine.audibleIn(screen)) return;
      cues.forEach((c) => { if (c.start > a && c.start <= b) engine.playSfx(c.sfx, c); });
    }
    function tick(now) {
      raf = 0;
      if (!on) return;
      // el sello de tiempo de rAF puede ser anterior a t0 en el primer cuadro: nunca negativo
      const elapsed = Math.max(0, (now - t0) / 1000);
      let t, more = true;
      if (loop) {
        // ciclo = animación + pausa en finalT; t es el tiempo de la escena
        const C = D + hold, c = elapsed % C;
        if (c < lastC) { fire(last, D + 1); last = -1; }
        lastC = c;
        t = c < fin ? c : (c < fin + hold ? fin : c - hold);
        fire(last, t);
      } else if (elapsed >= D) { fire(last, D + 1); t = D; on = false; more = false; }
      else { t = elapsed; fire(last, t); }
      last = t;
      try { render(t); } catch (e) { /* noop */ }
      if (more) raf = requestAnimationFrame(tick);
    }
    function start() {
      if (reduce) { try { render(fin); } catch (e) { /* noop */ } return; }
      on = true; t0 = performance.now(); last = -1; lastC = 0; paused = false;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function stop() { on = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    Object.assign(ctl.current, {
      render: (t) => { try { render(t); } catch (e) { /* noop */ } },
      isOn: () => on,
      stop,
      // Suspender: detiene el bucle y evita que el observador lo reinicie (modo voz).
      suspend() { suspended = true; stop(); },
      release() { suspended = false; if (visible && !on && !done) { if (!loop) done = true; start(); } },
      // Pausar/reanudar congela el reloj donde está.
      pause() {
        if (paused) return;
        paused = true; wasOn = on; suspended = true; pausedAt = performance.now(); stop();
      },
      resume() {
        if (!paused) return;
        paused = false; suspended = false;
        if (!visible) return;
        if (wasOn) { on = true; t0 += performance.now() - pausedAt; if (!raf) raf = requestAnimationFrame(tick); }
        else if (!done) { if (!loop) done = true; start(); }
      },
    });

    let io = null, offScreen = null;
    if (screen) {
      // Modo pantallas: la pantalla activa manda.
      const onScreen = (active) => {
        visible = active === screen;
        if (suspended) return;
        if (visible) { stop(); done = false; start(); }
        else { stop(); paused = false; }
      };
      offScreen = engine.onScreen(onScreen);
      if (engine.activeScreen === screen) onScreen(screen);
    } else if ('IntersectionObserver' in window && !reduce) {
      io = new IntersectionObserver((es) => {
        es.forEach((en) => {
          visible = en.isIntersecting;
          if (suspended) return;
          if (en.isIntersecting) { if (!on && !done && !paused) { if (!loop) done = true; start(); } }
          else if (loop) { stop(); paused = false; }
        });
      }, { threshold: .18 });
      io.observe(el);
    }
    return () => { stop(); if (io) io.disconnect(); if (offScreen) offScreen(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ctl;
}
