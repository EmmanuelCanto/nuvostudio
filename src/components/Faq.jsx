import { faq } from '../data/site.js';
import { reduceMotion } from '../scenes/anim.js';
import Nuvo from './Nuvo.jsx';

// Abre y cierra cada pregunta con una animación de altura (el <details> nativo aparece de golpe).
function toggleFaq(e) {
  const d = e.currentTarget.parentElement;
  const body = d.querySelector('.faq-a');
  if (!body || reduceMotion() || !body.animate) return;   // sin animación: comportamiento nativo
  e.preventDefault();
  if (d.dataset.anim) return;
  const opening = !d.open;
  d.dataset.anim = '1';
  if (opening) d.open = true;
  const h = body.scrollHeight;
  const frames = opening
    ? [{ height: '0px', opacity: 0, transform: 'translateY(-6px)' }, { height: h + 'px', opacity: 1, transform: 'none' }]
    : [{ height: h + 'px', opacity: 1, transform: 'none' }, { height: '0px', opacity: 0, transform: 'translateY(-6px)' }];
  d.classList.toggle('opening', opening);
  d.classList.toggle('closing', !opening);
  const a = body.animate(frames, { duration: opening ? 420 : 300, easing: 'cubic-bezier(.65,0,.35,1)' });
  a.onfinish = () => {
    if (!opening) d.open = false;
    d.classList.remove('opening', 'closing');
    delete d.dataset.anim;
  };
}

export default function Faq() {
  return (
    <section className="sec light" id="faq">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">preguntas</span> frecuentes</span><span>2026 / 12</span></div>
        <div className="faq-grid">
          <h2>Lo que más nos <em>preguntan</em>.</h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary onClick={toggleFaq}>{f.q}</summary>
                <div className="faq-a"><p>{f.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
