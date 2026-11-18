import { prices } from '../data/site.js';
import Nuvo from './Nuvo.jsx';

export default function Precios() {
  return (
    <section className="sec light" id="precios">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">precios</span> desde</span></div>
        <div className="head">
          <h2>Inversión <em>“desde”</em>, en pesos mexicanos.</h2>
          <p>Cada proyecto se cotiza según lo que necesitas. Estos montos te dan una idea para empezar.</p>
        </div>
        <div className="prices">
          {prices.map((p) => (
            <div className={'price' + (p.hl ? ' hl' : '')} key={p.title}>
              {p.flag && <span className="flag">{p.flag}</span>}
              <h3>{p.title}</h3>
              <span className="from">Desde</span>
              <div className="amt">{p.amount} <small>MXN</small></div>
              <p>{p.desc}</p>
              <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <a className={'btn ' + (p.hl ? 'btn-w' : 'btn-ok')} href="#contacto">{p.cta}</a>
            </div>
          ))}
        </div>
        <p className="note"><b>Precios de referencia.</b> Pueden cambiar según el alcance del proyecto. Pregunta por la cotización final y si requieres factura.</p>
      </div>
    </section>
  );
}
