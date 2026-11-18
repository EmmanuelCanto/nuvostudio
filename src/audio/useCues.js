import { useEffect, useState } from 'react';

/*
  Carga /audio/voz/<name>.json  ->  { audio, duration, words:[{w,s,e,k}] }
  Devuelve undefined mientras carga, null si no existe (404 o no es JSON:
  en Vercel una ruta inexistente responde index.html, por eso se valida el contenido).
*/
export function useCues(name) {
  const [cues, setCues] = useState(undefined);
  useEffect(() => {
    let alive = true;
    if (!name) { setCues(null); return; }
    fetch('/audio/voz/' + name + '.json', { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) return null;
        const ct = r.headers.get('content-type') || '';
        if (/text\/html/i.test(ct)) return null;
        return r.json().catch(() => null);
      })
      .then((j) => {
        if (!alive) return;
        setCues(j && Array.isArray(j.words) && j.words.length && j.duration > 0 ? j : null);
      })
      .catch(() => { if (alive) setCues(null); });
    return () => { alive = false; };
  }, [name]);
  return cues;
}
