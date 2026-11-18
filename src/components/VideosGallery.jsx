import { useEffect, useRef, useState } from 'react';
import { videos, videoTabs } from '../data/site.js';
import { qa, reduceMotion } from '../scenes/anim.js';
import Nuvo from './Nuvo.jsx';
import { useScreenLeave } from '../screens.js';

// Reproductor oficial de TikTok, sin descripción ni música encima y sin sugerencias al final.
const ttSrc = (id) => 'https://www.tiktok.com/player/v1/' + id + '?music_info=0&description=0&rel=0&autoplay=0&controls=1&progress_bar=1&play_button=1&volume_control=1&fullscreen_button=1&timestamp=0&loop=1&closed_caption=1&native_context_menu=0';

/* Galería: lista en src/data/site.js.
   - src = video propio (autoplay sin sonido al entrar en pantalla; clic = alternar sonido, uno a la vez)
   - tiktok = reproductor de TikTok (se toca play dentro del reproductor)
   - ninguno = recuadro de relleno */
export default function VideosGallery() {
  const root = useRef(null);
  const [f, setF] = useState('all');

  useEffect(() => {
    const el = root.current, reduce = reduceMotion();
    const cleanups = [];
    qa(el, '.vid-m').forEach((m) => {
      const v = m.querySelector('video'), snd = m.querySelector('.snd');
      if (!v) return;
      if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver((es) => {
          es.forEach((en) => {
            if (en.isIntersecting) { const pr = v.play(); if (pr && pr.then) pr.then(() => { m.classList.add('playing'); }).catch(() => {}); }
            else { v.pause(); m.classList.remove('playing'); }
          });
        }, { threshold: .5 });
        io.observe(m);
        cleanups.push(() => io.disconnect());
      }
      function toggle() {
        qa(el, '.vid-m video').forEach((o) => { if (o !== v) { o.muted = true; const s2 = o.parentNode.querySelector('.snd'); if (s2) s2.textContent = 'Sin sonido'; } });
        v.muted = !v.muted;
        snd.textContent = v.muted ? 'Sin sonido' : 'Con sonido';
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
        m.classList.add('playing');
      }
      const key = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
      m.addEventListener('click', toggle);
      m.addEventListener('keydown', key);
      cleanups.push(() => { m.removeEventListener('click', toggle); m.removeEventListener('keydown', key); });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  // Al salir de esta sección se pausan los videos (propios y de TikTok)
  useScreenLeave(root, () => {
    const el = root.current;
    if (!el) return;
    qa(el, '.vid-m video').forEach((v) => v.pause());
    qa(el, '.vid-m iframe').forEach((fr) => {
      try { fr.contentWindow.postMessage({ type: 'pause', value: null, 'x-tiktok-player': true }, '*'); } catch (e) { /* noop */ }
    });
  });

  const catLabel = (cat) => (videoTabs.find((t) => t.f === cat) || {}).label || cat;
  return (
    <section className="sec dark" id="portafolio" style={{ '--gx': '50%', '--gy': '30%' }}>
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">trabajos</span> seleccionados</span></div>
        <div className="head">
          <h2>Videos que <em>editamos</em>.</h2>
          <p>Desde piezas de puro motion graphics hasta los videos de Polígonos del Evangelio y videos hablando a cámara con motion graphics encima.</p>
        </div>
        <div className="tabs" role="group" aria-label="Filtrar videos">
          {videoTabs.map((t) => <button type="button" key={t.f} data-f={t.f} aria-pressed={f === t.f ? 'true' : 'false'} onClick={() => setF(t.f)}>{t.label}</button>)}
        </div>
        <div className="vids" id="vids" ref={root}>
          {videos.map((v, i) => (
            <figure className="vid" data-cat={v.cat} key={i} hidden={!(f === 'all' || v.cat === f)}>
              {v.tiktok ? (
                <div className="vid-m tt">
                  <iframe src={ttSrc(v.tiktok)} title={v.title} loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
                  <span className="cat">{catLabel(v.cat)}</span>
                </div>
              ) : (
              <div className={'vid-m' + (v.src ? ' has' : '')} data-src={v.src} tabIndex={0} role="button" aria-label={'Reproducir: ' + v.title}>
                {v.src && <video src={v.src} muted loop playsInline preload="metadata" />}
                <div className="ph" style={v.src ? { display: 'none' } : undefined}><svg viewBox="0 0 90 160" aria-hidden="true"><path d="M10 120 C 40 118, 50 50, 80 42" fill="none" stroke="#4D8BFF" strokeWidth="1.4" /><rect x="-2.5" y="-2.5" width="5" height="5" transform="translate(10 120) rotate(45)" fill="#fff" /><rect x="-2.5" y="-2.5" width="5" height="5" transform="translate(80 42) rotate(45)" fill="#fff" /></svg><span>[Sube aquí tu video]</span></div>
                <span className="cat">{catLabel(v.cat)}</span>
                <span className="play"><svg viewBox="0 0 16 16"><path d="M3 1.500l11 6.500-11 6.500z" fill="#0B0B14" /></svg></span>
                <span className="snd">Sin sonido</span>
              </div>
              )}
              <figcaption><b>{v.title}</b><span>{v.sub}</span></figcaption>
            </figure>
          ))}
        </div>
        <p className="vid-note">Toca un video para verlo con sonido. ¿Quieres uno así para tu marca? <a href="#contacto">Escríbenos</a>.</p>
      </div>
    </section>
  );
}
