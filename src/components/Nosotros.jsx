import { founders } from '../data/site.js';
import Nuvo from './Nuvo.jsx';

export default function Nosotros() {
  return (
    <section className="sec tint" id="nosotros">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">quiénes</span> somos</span></div>
        <div className="head">
          <h2>Dos personas, <em>los dos puntos de la ü</em>.</h2>
          <p>nüvo nació de una pareja que comparte el gusto por contar historias con tecnología. Como el diamante y el círculo sobre la ü: dos formas distintas que, juntas, cambian cómo suena todo. Conoce a cada quien y revisa su trayectoria.</p>
        </div>
        <div className="founders">
          {founders.map((f) => (
            <a className="founder" href={'#' + f.id} key={f.id}>
              <div><span className="ini">{f.ini}</span><h3>{f.name}</h3><p className="role">{f.role}</p></div>
              <span className="go">Ver perfil y CV</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
