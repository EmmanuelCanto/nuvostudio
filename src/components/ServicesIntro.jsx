import Nuvo from './Nuvo.jsx';
export default function ServicesIntro() {
  return (
    <section className="sec light" id="servicios">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">cuatro</span> servicios</span><span>2026 / 02</span></div>
        <div className="head" style={{ marginBottom: 0 }}>
          <h2>Cuatro formas de <em>renovar</em> tu marca.</h2>
          <p>Trabajamos con negocios locales, emprendedores y familias. Proyectos pequeños o grandes, siempre con trato directo: hablas con quienes hacen el trabajo.</p>
        </div>
      </div>
    </section>
  );
}
