/*
  Mapa de efectos de sonido por escena (ver content/sfx-map.md y guia-efectos-de-sonido.md).
  Regla general: sonido = acción visual.

  PEAK: segundo del pico dentro de cada archivo de public/audio/sfx/.
  El motor dispara el audio en (t − peak) para que el pico caiga sobre la acción.
  Si (t − peak) < 0 el archivo arranca ya avanzado (offset) al inicio del ciclo.

  REGLA: dentro de una misma sección ningún efecto se repite (ni alternado). Sin efectos "woosh".
  Cada acción importante tiene su propio sonido; si hay más acciones que sonidos
  distintos disponibles, las últimas quedan en silencio. useScene además descarta
  cualquier repetición por si acaso (uniqueCues).

  Cada cue: { t, sfx, loopFor?, fade?, gain? }
    t        segundo del ciclo de la escena en que ocurre la acción
    loopFor  repetir el archivo en bucle durante N segundos (typing)
    fade     segundos de desvanecimiento al final
*/
export const PEAK = {
  'woosh-proyector': 3.34,   // es un woosh: no se usa
  'camera-flash': 0.02,
  shutter: 0.05,
  'click-1': 1.66, 'click-2': 0.1, 'click-3': 0.05,
  'ui-click-soft': 0.05,
  'ui-cli': 0.05,
  'ui-aparicion-1': 0.05, 'ui-aparicion-2': 0.05, 'ui-aparicion-3': 0.05, 'ui-aparicion-4': 0.05,
  burbuja: 0.05,
  'ui-down': 0.05,
  'beep-gleam': 0.1,
  coins: 0.15,
  'riser-reverse': 0.93,
  typing: 0,
  glitch: 0.05, 'glitch-ligero': 0.05,
  'pop-1': 0.05, 'pop-2': 0.05, 'pop-3': 0.05,
  'spin-beep': 0.8,
};

export const SFX_NAMES = Object.keys(PEAK).filter((n) => !n.startsWith('woosh'));

// Las escenas calculan algunos instantes (pastillas, keyframes) al iniciarse;
// por eso varias tablas son funciones que reciben esos tiempos.

// Deja solo la primera aparición de cada efecto (ordenado por tiempo).
export function uniqueCues(cues) {
  const seen = new Set();
  return cues.slice().sort((a, b) => a.t - b.t).filter((c) => (seen.has(c.sfx) ? false : (seen.add(c.sfx), true)));
}
// Asigna a cada instante un efecto distinto del grupo, sin repetir; los que sobran no suenan.
function spread(times, pool, extra) {
  return times.slice(0, pool.length).map((t, i) => ({ t, sfx: pool[i], ...(extra || {}) }));
}

// Hero (10.5 s): clic inicial, la curva se dibuja, cada servicio con su propio sonido, salida.
export function heroCues(pillTimes) {
  return uniqueCues([
    { t: 0.4, sfx: 'glitch-ligero', gain: 0.7 }, // la curva empieza a dibujarse
    ...spread(pillTimes, ['ui-aparicion-1', 'burbuja', 'ui-cli', 'ui-aparicion-3']),
    { t: 9.3, sfx: 'ui-down' },
  ]);
}

// Motion / editor (9 s)
export function motionCues(keyframeTimes) {
  return uniqueCues([
    { t: 0.1, sfx: 'ui-click-soft' },
    { t: 0.5, sfx: 'riser-reverse' },
    { t: 1.3, sfx: 'ui-aparicion-3' },
    ...spread(keyframeTimes, ['click-2', 'pop-1', 'pop-2', 'pop-3'], { gain: 0.7 }),
    { t: 3.5, sfx: 'click-1' },
    { t: 4.6, sfx: 'beep-gleam' },
  ]);
}

// Edición sin voz (9 s): dos cortes distintos, dos gráficas distintas, palabras clave distintas.
export function editCues(keyTimes) {
  return uniqueCues([
    { t: 0.9, sfx: 'ui-aparicion-4' },
    { t: 1.2, sfx: 'coins' },
    { t: 2.8, sfx: 'shutter' }, { t: 2.8, sfx: 'glitch-ligero', gain: 0.6 },
    { t: 3.8, sfx: 'beep-gleam' },
    { t: 5.6, sfx: 'camera-flash' }, { t: 5.6, sfx: 'glitch', gain: 0.5 },
    ...spread(keyTimes, ['click-3', 'pop-1', 'ui-aparicion-2', 'pop-3'], { gain: 0.8 }),
  ]);
}

// Voces (13.5 s)
export const vocesCues = uniqueCues([
  { t: 0.2, sfx: 'ui-aparicion-2' },
  { t: 0.5, sfx: 'riser-reverse' },
  { t: 2.5, sfx: 'ui-aparicion-4' },
  { t: 2.8, sfx: 'typing', loopFor: 3, fade: 0.3 },
  { t: 6.0, sfx: 'glitch-ligero', gain: 0.7 },
  { t: 6.9, sfx: 'beep-gleam' },
  { t: 8.2, sfx: 'pop-2' },
  { t: 8.9, sfx: 'ui-aparicion-1' },
  { t: 9.3, sfx: 'ui-click-soft' },
]);

// Web (11 s): los 16 bloques que se arman suenan como UNA ráfaga de tecleo, no 16 clics.
export function webCues(blockTimes) {
  const a = blockTimes[0], b = blockTimes[blockTimes.length - 1];
  return uniqueCues([
    { t: 0.2, sfx: 'glitch-ligero', gain: 0.7 },
    { t: a, sfx: 'typing', loopFor: Math.max(0.4, b - a + 0.15), fade: 0.15, gain: 0.7 },
    { t: 5.9, sfx: 'ui-click-soft' },
    { t: 6.4, sfx: 'ui-cli' },
    { t: 7.3, sfx: 'coins' },
    { t: 8.8, sfx: 'beep-gleam' },
  ]);
}

// Marketing (13 s): cada estrella y cada pastilla con su propio sonido.
export function mktCues(pillTimes) {
  return uniqueCues([
    { t: 0.3, sfx: 'ui-aparicion-2' },
    { t: 1.5, sfx: 'spin-beep' },
    { t: 2.1, sfx: 'ui-aparicion-3' },
    ...spread([3.3, 3.58, 3.86, 4.14, 4.42], ['pop-1', 'pop-2', 'pop-3', 'click-1', 'click-3'], { gain: 0.8 }),
    { t: 3.3, sfx: 'coins' },
    { t: 5.2, sfx: 'ui-aparicion-4' },
    { t: 6.4, sfx: 'beep-gleam' },
    ...spread(pillTimes, ['burbuja', 'ui-cli', 'ui-aparicion-1']),
  ]);
}

// Perfiles (3.4 s)
export function cvCues(nodeTimes) {
  return uniqueCues([
    { t: 0.2, sfx: 'glitch-ligero', gain: 0.7 },
    ...spread(nodeTimes, ['click-2', 'ui-aparicion-1', 'beep-gleam']),
  ]);
}

/*
  Efectos para las voces (Edición y Voces). Mientras suena una voz:
  - cada palabra clave (inicio de un grupo *así*) toma el siguiente efecto del grupo, sin repetir;
  - cada corte de clip toma el siguiente efecto de corte.
  Un JSON de voz puede fijar el efecto de una palabra con "sfx": "nombre" (o "sfx": "" para silencio).
*/
export const VOICE_KEY_SFX = ['pop-1', 'ui-aparicion-1', 'pop-2', 'ui-aparicion-3', 'pop-3', 'ui-aparicion-4', 'burbuja', 'ui-cli', 'beep-gleam', 'click-1'];
export const VOICE_CUT_SFX = ['shutter', 'camera-flash', 'glitch-ligero', 'glitch'];
export const VOICE_GAIN = 0.55;

// Prepara el plan de efectos de una voz: [{ i (índice de palabra), sfx }]
export function voiceKeyPlan(words, pool) {
  pool = pool || VOICE_KEY_SFX;
  const used = new Set(), plan = {};
  let n = 0;
  words.forEach((w, i) => {
    // empieza un grupo clave si la anterior no era clave o terminaba en puntuación ("TikTok, Reels" = dos grupos)
    const start = w.k && !(i > 0 && words[i - 1].k && !/[,.;:!?…]$/.test(words[i - 1].w));
    if (w.sfx !== undefined) { if (w.sfx && !used.has(w.sfx)) { plan[i] = w.sfx; used.add(w.sfx); } return; }
    if (!start) return;
    while (n < pool.length && used.has(pool[n])) n++;
    if (n < pool.length) { plan[i] = pool[n]; used.add(pool[n]); n++; }
  });
  return plan;
}
