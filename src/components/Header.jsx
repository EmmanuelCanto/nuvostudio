import { useEffect, useState } from 'react';
import { nav } from '../data/site.js';
import { useAudio } from '../audio/AudioProvider.jsx';
import Nuvo from './Nuvo.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  // el menú se cierra al navegar (igual que route() en el original)
  useEffect(() => { const h = () => setOpen(false); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h); }, []);
  const { enabled, toggle } = useAudio();
  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href="#inicio" aria-label="nüvo, inicio">
          <Nuvo />
        </a>
        <div className="top-ctl">
          <button className="snd-btn" type="button" aria-pressed={enabled ? 'true' : 'false'} onClick={toggle} title={enabled ? 'Apagar sonido' : 'Activar sonido'}>
            <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6h3l4-3v10l-4-3H2z" />
              {enabled ? <path d="M11.5 5.5a3.5 3.5 0 0 1 0 5M13.5 3.5a6.5 6.5 0 0 1 0 9" /> : <path d="M11 6l4 4M15 6l-4 4" />}
            </svg>
            Sonido
          </button>
          <button className="menu-btn" id="menuBtn" type="button" aria-expanded={open ? 'true' : 'false'} aria-controls="nav" onClick={() => setOpen((o) => !o)}>Menú</button>
        </div>
        <nav className={'nav' + (open ? ' open' : '')} id="nav" aria-label="Principal" onClick={(e) => { if (e.target.closest('a')) setOpen(false); }}>
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          <a className="cta" href="#contacto">Cotizar</a>
        </nav>
      </div>
    </header>
  );
}
