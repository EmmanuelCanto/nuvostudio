import { useEffect, useRef } from 'react';
import { reduceMotion } from '../scenes/anim.js';
import Nuvo from './Nuvo.jsx';

export default function Proceso() {
  const steps = useRef(null);
  useEffect(() => {
    const el = steps.current;
    if ('IntersectionObserver' in window && !reduceMotion()) {
      const io = new IntersectionObserver((es) => { es.forEach((en) => { if (en.isIntersecting) el.classList.add('in'); }); }, { threshold: .18 });
      io.observe(el);
      return () => io.disconnect();
    }
    el.classList.add('in');
    return undefined;
  }, []);
  return (
    <section className="sec light" id="proceso">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">cómo</span> trabajamos</span><span>2026 / 09</span></div>
        <div className="head">
          <h2>Simple, claro y <em>sin sorpresas</em>.</h2>
          <p>El mismo camino para un reel, una página o un homenaje de voz.</p>
        </div>
        <ol className="steps" id="steps" ref={steps}>
          <li style={{ '--i': 0 }}><span className="n"></span><h3>Platicamos</h3><p>Nos cuentas qué necesitas por WhatsApp o videollamada. Sin costo.</p></li>
          <li style={{ '--i': 1 }}><span className="n"></span><h3>Propuesta</h3><p>Te enviamos idea, alcance, precio y fecha de entrega por escrito.</p></li>
          <li style={{ '--i': 2 }}><span className="n"></span><h3>Editamos</h3><p>Trabajamos tu proyecto y te mostramos avances. Incluimos rondas de ajustes.</p></li>
          <li style={{ '--i': 3 }}><span className="n"></span><h3>Entrega</h3><p>Recibes tus archivos listos para publicar y te acompañamos en el lanzamiento.</p></li>
        </ol>
        <div className="stats">
          <div><span className="num">24 <small>h</small></span><p>Tiempo máximo de respuesta, en horas hábiles.</p></div>
          <div><span className="num">5–7 <small>días</small></span><p>Días hábiles de referencia para un video de 30 segundos.</p></div>
          <div><span className="num">1–2 <small>sem</small></span><p>Semanas de referencia para una landing page.</p></div>
          <div><span className="num">50/50</span><p>Anticipo y pago contra entrega.</p></div>
        </div>
      </div>
    </section>
  );
}
