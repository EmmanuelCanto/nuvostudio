import { useEffect, useRef } from 'react';
import { AudioProvider } from './audio/AudioProvider.jsx';
import { createRouter } from './router.js';
import { fitPills } from './scenes/anim.js';
import { initScreens } from './screens.js';
import { founders } from './data/site.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Trust from './components/Trust.jsx';
import ServicesIntro from './components/ServicesIntro.jsx';
import Motion from './components/Motion.jsx';
import Edicion from './components/Edicion.jsx';
import VideosGallery from './components/VideosGallery.jsx';
import Paquetes from './components/Paquetes.jsx';
import Voces from './components/Voces.jsx';
import Web from './components/Web.jsx';
import Marketing from './components/Marketing.jsx';
import Proceso from './components/Proceso.jsx';
import Precios from './components/Precios.jsx';
import Nosotros from './components/Nosotros.jsx';
import Faq from './components/Faq.jsx';
import Contacto from './components/Contacto.jsx';
import Footer from './components/Footer.jsx';
import Perfil from './components/Perfil.jsx';

export default function App() {
  const home = useRef(null), p1 = useRef(null), p2 = useRef(null);

  useEffect(() => {
    const router = createRouter({ home: home.current, 'perfil-1': p1.current, 'perfil-2': p2.current });
    // "Descargar CV" y enlaces de relleno con href="#": no hacen nada hasta que se reemplacen
    const onClick = (e) => { const a = e.target.closest ? e.target.closest('a[href="#"]') : null; if (a) e.preventDefault(); };
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', router.route);
    const offScreens = initScreens(); // antes de route(): los enlaces #seccion usan las posiciones de las pantallas
    router.route();
    fitPills();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitPills());
    return () => { offScreens(); document.removeEventListener('click', onClick); window.removeEventListener('hashchange', router.route); };
  }, []);

  return (
    <AudioProvider>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        {/* ======================= VISTA: INICIO ======================= */}
        <div className="view" id="view-home" data-view="home" ref={home}>
          {/* Cada .screen es una pantalla (ver src/screens.js) */}
          <div className="screen screen-hero"><Hero /><Trust /></div>
          <div className="screen"><ServicesIntro /></div>
          <div className="screen"><Motion /></div>
          <div className="screen"><Edicion /></div>
          <div className="screen"><VideosGallery /></div>
          <div className="screen"><Paquetes /></div>
          <div className="screen"><Voces /></div>
          <div className="screen"><Web /></div>
          <div className="screen"><Marketing /></div>
          <div className="screen"><Proceso /></div>
          <div className="screen"><Precios /></div>
          <div className="screen"><Nosotros /></div>
          <div className="screen"><Faq /></div>
          <div className="screen"><Contacto /></div>
        </div>
        {/* ======================= VISTAS: PERFIL 1 y 2 (datos en src/data/site.js) ======================= */}
        <Perfil founder={founders[0]} index={0} viewRef={p1} />
        <Perfil founder={founders[1]} index={1} viewRef={p2} />
      </main>
      <Footer />
    </AudioProvider>
  );
}
