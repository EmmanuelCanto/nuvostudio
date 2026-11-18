import { useEffect, useRef, useState } from 'react';
import { contact, whatsappUrl } from '../data/site.js';
import Ruler from './Ruler.jsx';
import Nuvo from './Nuvo.jsx';

/* Formulario sin backend: valida, muestra el mensaje en la página y no envía nada
   (preventDefault). Para recibir correos, conecta Formspree/Web3Forms (ver README). */
export default function Contacto() {
  const form = useRef(null), msgEl = useRef(null);
  const [msg, setMsg] = useState(null); // null | {err:true} | {nombre, servicio}

  useEffect(() => { if (msg && msgEl.current) msgEl.current.focus(); }, [msg]);

  function onSubmit(e) {
    e.preventDefault();
    const f = form.current.elements;
    const nombre = f.nombre.value.trim(), correo = f.correo.value.trim();
    const ok = nombre && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && f.servicio.value && f.mensaje.value.trim();
    if (!ok) { setMsg({ err: true, n: Date.now() }); return; }
    setMsg({ nombre, servicio: f.servicio.value, n: Date.now() });
    form.current.reset();
  }

  return (
    <section className="sec dark contact" id="contacto">
      <div className="wrap">
        <div className="meta"><span><Nuvo star={false} /> <span className="it">datos de</span> contacto</span><span>2026 / 13</span></div>
        <div className="head">
          <h2>Empecemos con un <em>mensaje</em>.</h2>
          <p>Cuéntanos qué tienes en mente. Respondemos en menos de 24 horas hábiles.</p>
        </div>
        <div className="contact-grid">
          <div className="chan">
            <div>
              <span className="k">WhatsApp</span>
              <p className="v">{contact.whatsappLabel}</p>
              <a href={whatsappUrl} rel="noopener">Escribir por WhatsApp</a>
            </div>
            <div>
              <span className="k">Correo</span>
              <p className="v">{contact.emailLabel}</p>
              <a href={'mailto:' + contact.email}>Enviar un correo</a>
            </div>
            <div>
              <span className="k">Ubicación</span>
              <p className="v">{contact.city}, México</p>
              <span>Atendemos en línea a todo el país.</span>
            </div>
          </div>
          <form id="contactForm" ref={form} noValidate onSubmit={onSubmit}>
            <label>Nombre
              <input type="text" name="nombre" autoComplete="name" required />
            </label>
            <label>Correo electrónico
              <input type="email" name="correo" autoComplete="email" required />
            </label>
            <label>Servicio que te interesa
              <select name="servicio" required defaultValue="">
                <option value="">Elige una opción</option>
                <option>Videos con motion graphics</option>
                <option>Edición de video (TikTok, Reels, Shorts)</option>
                <option>Plan mensual de edición</option>
                <option>Voces que regresan</option>
                <option>Página web</option>
                <option>nüvo NFC (próximamente)</option>
                <option>Otro / no estoy seguro</option>
              </select>
            </label>
            <label>Mensaje
              <textarea name="mensaje" required placeholder="Cuéntanos de tu negocio o de tu idea"></textarea>
            </label>
            <button className="btn btn-b" type="submit">Enviar mensaje</button>
            <div className={'form-msg' + (msg && msg.err ? ' err' : '')} id="formMsg" ref={msgEl} role="status" aria-live="polite" tabIndex={-1} hidden={!msg}>
              {msg && msg.err && 'Revisa el formulario: necesitamos tu nombre, un correo válido, el servicio que te interesa y un mensaje.'}
              {msg && !msg.err && (<>
                {'¡Gracias, ' + msg.nombre + '! Tomamos nota de tu interés en “' + msg.servicio + '”. Para asegurarnos de recibir tu mensaje y responderte más rápido, escríbenos también por WhatsApp: '}
                <a href={whatsappUrl} rel="noopener">{contact.whatsappLabel}</a>
                {' o al correo ' + contact.emailLabel + '.'}
              </>)}
            </div>
          </form>
        </div>
      </div>
      <Ruler />
    </section>
  );
}
