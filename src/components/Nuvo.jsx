import { useId } from 'react';
import { STAR, WORD, BOX_FULL, BOX_WORD } from '../data/logo.js';

/*
  Logotipo nüvo: estrella azul + "nüvo".
  - Las letras toman el color del texto que lo rodea (currentColor): blancas en secciones oscuras, negras en claras.
  - <Nuvo />            estrella + palabra (encabezado, inicio)
  - <Nuvo star={false} /> solo la palabra (etiquetas pequeñas de cada sección)
  Escala con el tamaño de letra del contenedor (alto = 1em por defecto; ajústalo en CSS).
*/
export default function Nuvo({ star = true, className = '' }) {
  const id = 'nuvo-g' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg className={('nuvo-logo ' + (star ? 'full ' : 'word ') + className).trim()} viewBox={star ? BOX_FULL : BOX_WORD} role="img" aria-label="nüvo">
      {star && (
        <>
          <defs>
            <linearGradient id={id} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#60A5FF" />
              <stop offset=".45" stopColor="#3478FF" />
              <stop offset="1" stopColor="#1B3FB8" />
            </linearGradient>
          </defs>
          <path d={STAR} fill={`url(#${id})`} />
        </>
      )}
      <path d={WORD} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
