/*
  Scroll por pantallas (bloques).
  - Cada .screen ocupa al menos una pantalla y queda fija (sticky) mientras la
    siguiente se desliza encima. Si una pantalla es más alta que la ventana, primero
    se recorre completa (scroll normal) y se fija cuando su borde inferior llega abajo.
  - Rueda / trackpad / teclado: un gesto en el borde de una pantalla lleva a la
    siguiente (o anterior) con una animación suave. La inercia del trackpad se ignora
    hasta que el gesto termina, para no saltar dos pantallas de golpe.
  - Táctil / barra de scroll: al soltar, si quedó entre dos pantallas, se acomoda.
  - Enlaces internos (#seccion) del menú y botones: se desliza hasta la sección.
    Durante cualquier deslizamiento no suena ni se anima ninguna pantalla; la de
    destino arranca al llegar (así no se mezclan sonidos de secciones intermedias).
  - La pantalla activa es la última cuyo inicio ya pasó la mitad de la ventana; se
    avisa al motor de audio (engine.setActiveScreen): solo esa pantalla suena.
  - Con "reducir movimiento" no hay sticky ni bloques, pero sí pantalla activa.
*/
import { useEffect, useRef } from 'react';
import engine from './audio/engine.js';

const markerOf = new WeakMap();
const setStyle = (el, k, v) => { if (el.style[k] !== v) el.style[k] = v; };
const headerH = () => { const h = document.querySelector('header.top'); return h ? h.offsetHeight : 60; };
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const DURATION = 750;   // ms de la transición entre pantallas vecinas
const navDuration = (d) => Math.max(750, Math.min(1600, 500 + d * 0.06)); // saltos largos desde el menú
let api = null;
const QUIET = 160;      // ms sin rueda para considerar terminado un gesto (inercia)

export function initScreens() {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  let list = [];          // [{ s, m, start, end }]
  let raf = 0, HH = headerH();
  let anim = null, lockUntilQuiet = false, lastWheel = 0, settleT = 0, touching = false, lastY = window.pageYOffset, dir = 0;

  function layout() {
    list = [];
    HH = headerH();
    root.style.setProperty('--hh', HH + 'px');
    const vh = window.innerHeight;
    document.querySelectorAll('.view').forEach((view) => {
      if (view.hidden) return;
      const screens = Array.from(view.children).filter((c) => c.classList.contains('screen'));
      if (!screens.length) return;
      const viewTop = view.getBoundingClientRect().top + window.pageYOffset;
      let y = 0;
      screens.forEach((s) => {
        const h = s.offsetHeight;
        let m = markerOf.get(s);
        if (!m) { m = document.createElement('div'); m.className = 'screen-pt'; m.setAttribute('aria-hidden', 'true'); view.appendChild(m); markerOf.set(s, m); }
        setStyle(m, 'top', y + 'px');
        setStyle(m, 'height', h + 'px');
        setStyle(s, 'top', reduce ? '' : (HH + Math.min(0, vh - HH - h)) + 'px');
        const start = viewTop + y - HH;                       // scroll en el que la pantalla toca la barra
        const end = start + Math.max(0, h - (vh - HH));       // scroll en el que su borde inferior toca abajo
        list.push({ s, m, start: Math.max(0, start), end: Math.max(0, end) });
        y += h;
      });
    });
    update();
  }

  function update() {
    raf = 0;
    if (anim) return;                                   // durante un deslizamiento nadie suena
    const mid = window.innerHeight * 0.5;
    let active = null;
    for (const it of list) { if (it.m.getBoundingClientRect().top <= mid) active = it.s; else break; }
    if (!active && list.length) active = list[0].s;
    engine.setActiveScreen(active);
  }

  // índice de la pantalla en la que estamos (la última cuyo inicio ya pasó)
  function indexAt(y) {
    let i = 0;
    for (let k = 0; k < list.length; k++) if (list[k].start <= y + 2) i = k;
    return i;
  }

  function animateTo(target, duration) {
    target = Math.max(0, Math.min(target, root.scrollHeight - window.innerHeight));
    const from = window.pageYOffset;
    if (Math.abs(target - from) < 2) { update(); return; }
    if (anim) cancelAnimationFrame(anim.raf);
    const D = duration || DURATION, t0 = performance.now();
    anim = { raf: 0 };
    engine.setActiveScreen(null);                       // corta sonidos y animaciones mientras se desliza
    const step = (now) => {
      const p = Math.min(1, (now - t0) / D);
      window.scrollTo(0, from + (target - from) * easeInOut(p));
      if (p < 1) anim.raf = requestAnimationFrame(step);
      else { anim = null; update(); }
    };
    anim.raf = requestAnimationFrame(step);
  }

  // Clic en un enlace interno: deslizar en vez de saltar.
  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const hash = a.getAttribute('href');
    if (hash.length < 2) return;
    const id = hash.slice(1);
    const home = document.getElementById('view-home');
    if (!home || home.hidden) return;                    // desde un perfil: el router cambia de vista
    const target = id === 'inicio' ? null : document.getElementById(id);
    if (id !== 'inicio' && (!target || !home.contains(target))) return;
    e.preventDefault();
    if (location.hash !== hash) history.pushState(null, '', hash);
    const y = target ? scrollYFor(target) : 0;
    animateTo(y, navDuration(Math.abs(y - window.pageYOffset)));
  }

  // ¿Hay un bloque al que saltar desde y en la dirección d? Devuelve el destino o null (scroll normal).
  function jumpTarget(y, d) {
    if (!list.length) return null;
    const last = list[list.length - 1];
    if (y > last.end + 2) return null;                 // más allá de la última pantalla (pie de página)
    const i = indexAt(y), cur = list[i];
    if (d > 0) {
      if (y < cur.end - 2) return null;                // aún falta recorrer esta pantalla alta
      return i + 1 < list.length ? list[i + 1].start : null;
    }
    if (y > cur.start + 2) {                            // dentro de una pantalla alta o en la transición
      return y > cur.end + 2 ? cur.end : null;
    }
    return i > 0 ? list[i - 1].end : null;
  }

  function onWheel(e) {
    if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;   // zoom o scroll horizontal
    const now = performance.now(), gap = now - lastWheel;
    lastWheel = now;
    if (anim) { e.preventDefault(); lockUntilQuiet = true; return; }
    if (lockUntilQuiet) { if (gap < QUIET) { e.preventDefault(); return; } lockUntilQuiet = false; }
    const d = Math.sign(e.deltaY), y = window.pageYOffset;
    const target = jumpTarget(y, d);
    if (target == null) {
      // scroll normal dentro de una pantalla alta: no dejar que se pase del borde
      const i = indexAt(y), cur = list[i];
      if (cur && d > 0 && y < cur.end && y + e.deltaY > cur.end) { e.preventDefault(); window.scrollTo(0, cur.end); lockUntilQuiet = true; }
      if (cur && d < 0 && y > cur.start && y + e.deltaY < cur.start && y <= cur.end + 2) { e.preventDefault(); window.scrollTo(0, cur.start); lockUntilQuiet = true; }
      return;
    }
    e.preventDefault();
    lockUntilQuiet = true;
    animateTo(target);
  }

  function onKey(e) {
    const t = e.target;
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|AUDIO|VIDEO)$/.test(t.tagName))) return;
    const k = e.key;
    let d = 0;
    if (k === 'PageDown' || (k === ' ' && !e.shiftKey) || k === 'ArrowDown') d = 1;
    else if (k === 'PageUp' || (k === ' ' && e.shiftKey) || k === 'ArrowUp') d = -1;
    if (!d || anim) { if (d && anim) e.preventDefault(); return; }
    const y = window.pageYOffset, target = jumpTarget(y, d);
    if (target == null) {
      if (k.startsWith('Arrow')) return;               // flechas: scroll normal dentro de pantallas altas
      const i = indexAt(y), cur = list[i];             // AvPág/espacio dentro de pantalla alta: una ventana, sin pasarse
      if (!cur) return;
      e.preventDefault();
      const page = (window.innerHeight - HH) * 0.85;
      animateTo(d > 0 ? Math.min(cur.end, y + page) : Math.max(cur.start, y - page));
      return;
    }
    e.preventDefault();
    animateTo(target);
  }

  // Al terminar un scroll libre (táctil, barra, flechas), acomodar si quedó entre dos pantallas.
  function settle() {
    settleT = 0;
    if (anim || touching || !list.length) return;
    const y = window.pageYOffset, i = indexAt(y), cur = list[i], next = list[i + 1];
    if (!next || y <= cur.end + 2 || y >= next.start - 2) return;
    const zone = next.start - cur.end, p = (y - cur.end) / zone;
    const goNext = dir > 0 ? p > 0.15 : p > 0.85;
    animateTo(goNext ? next.start : cur.end);
  }

  const onScroll = () => {
    const y = window.pageYOffset;
    if (y !== lastY) dir = y > lastY ? 1 : -1;
    lastY = y;
    if (!raf) raf = requestAnimationFrame(update);
    if (!reduce && !anim) { clearTimeout(settleT); settleT = setTimeout(settle, 140); }
  };
  const onTouchStart = () => { touching = true; if (anim) { cancelAnimationFrame(anim.raf); anim = null; update(); } };
  const onTouchEnd = () => { touching = false; clearTimeout(settleT); settleT = setTimeout(settle, 140); };

  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => layout()) : null;
  if (ro) document.querySelectorAll('.screen').forEach((s) => ro.observe(s));
  const onRoute = () => requestAnimationFrame(layout);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', layout);
  window.addEventListener('hashchange', onRoute);
  api = { animateTo: (y) => animateTo(y, navDuration(Math.abs(y - window.pageYOffset))) };
  if (!reduce) {
    root.classList.add('blocks');
    document.addEventListener('click', onClick);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
  }
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', layout);
    window.removeEventListener('hashchange', onRoute);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('click', onClick);
    api = null;
    if (ro) ro.disconnect();
    root.classList.remove('blocks');
  };
}

// Posición de scroll para llegar a `el`. Si es una sección completa, al inicio de su pantalla;
// si es algo dentro de una pantalla alta (p. ej. #politica-etica), hasta ese punto.
export function scrollYFor(el) {
  const HH = headerH();
  const s = el.closest ? el.closest('.screen') : null;
  const m = s && markerOf.get(s);
  if (!m) return el.getBoundingClientRect().top + window.pageYOffset - HH;
  const start = m.getBoundingClientRect().top + window.pageYOffset - HH;
  if (s.firstElementChild === el || s === el) return start;
  const inner = el.getBoundingClientRect().top - s.getBoundingClientRect().top;
  const end = start + Math.max(0, s.offsetHeight - (window.innerHeight - HH));
  return Math.min(end, start + Math.max(0, inner - 24));
}

// Desplazar a y: deslizando (con el mismo movimiento que las pantallas) o directo.
export function scrollToY(y, smooth) {
  if (smooth && api) api.animateTo(y);
  else window.scrollTo(0, y);
}

// Ejecuta fn cuando la pantalla que contiene ref deja de estar activa.
export function useScreenLeave(ref, fn) {
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => engine.onScreen((active) => {
    const scr = ref.current && ref.current.closest('.screen');
    if (scr && active !== scr) f.current();
  }), [ref]);
}
