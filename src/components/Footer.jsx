import { contact } from '../data/site.js';
export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>© {contact.year} nüvo. Edición de video que suena a nuevo. Hecho en México.</span>
        <span><a href="#politica-etica">Política ética de voz</a> / <a href="#contacto">Contacto</a></span>
      </div>
    </footer>
  );
}
