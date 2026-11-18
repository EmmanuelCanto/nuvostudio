import { packages } from '../data/site.js';
import Nuvo from './Nuvo.jsx';

export default function Paquetes() {
  return (
    <section className="sec light" id="paquetes">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">paquetes</span> de edición</span><span>2026 / 05</span></div>
        <div className="head">
          <h2>Paquetes de <em>edición</em>.</h2>
          <p>Tú grabas; nosotros editamos. Elige videos sueltos o un plan mensual con entregas constantes para que nunca te quedes sin publicar.</p>
        </div>
        <ol className="plan-flow" aria-label="Cómo editamos tus videos">
          <li><b>Recibimos</b><span>Tus clips tal como los grabaste.</span></li>
          <li><b>Cortamos</b><span>Silencios, muletillas y tomas falladas fuera.</span></li>
          <li><b>Subtitulamos</b><span>Palabra por palabra, con tu estilo.</span></li>
          <li><b>Animamos</b><span>Motion graphics, música y efectos.</span></li>
          <li><b>Entregamos</b><span>En el formato de cada plataforma.</span></li>
        </ol>
        <div className="prices pk">
          {packages.map((p) => (
            <div className={'price' + (p.hl ? ' hl' : '')} key={p.title}>
              {p.flag && <span className="flag">{p.flag}</span>}
              <h3>{p.title}</h3>
              <p className="who">{p.who}</p>
              <span className="from">Desde</span>
              <div className="amt">{p.amount} <small>MXN</small></div>
              <p className="per">{p.per}</p>
              <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <a className={'btn ' + (p.hl ? 'btn-w' : 'btn-ok')} href="#contacto">{p.cta}</a>
            </div>
          ))}
        </div>
        <p className="note"><b>Precios de referencia.</b> Cada plan se ajusta a tu negocio después de una llamada sin costo. Videos de más de 60 s o con animaciones especiales se cotizan aparte.</p>
      </div>
    </section>
  );
}
