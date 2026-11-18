/*
  Motor de audio (singleton). La interfaz React está en AudioProvider.jsx.
  - Nada suena hasta que el visitante pulsa "Sonido" (los navegadores exigen un gesto).
  - SFX: fetch + decodeAudioData, cargados la primera vez que se usan (y precalentados al activar).
  - Sin música de fondo.
  - Pantalla activa: solo suenan las escenas de la pantalla enfocada (ver src/screens.js).
    Al cambiar de pantalla se cortan los efectos que seguían sonando.
*/
import { PEAK, SFX_NAMES } from './sfxMap.js';

const listeners = new Set();
const screenListeners = new Set();

const engine = {
  ctx: null,
  master: null,
  enabled: false,
  buffers: {},
  loading: {},
  sources: new Set(),
  activeScreen: null,

  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  emit() { listeners.forEach((fn) => fn(engine.enabled)); },

  onScreen(fn) { screenListeners.add(fn); return () => screenListeners.delete(fn); },
  setActiveScreen(el) {
    if (el === engine.activeScreen) return;
    engine.activeScreen = el;
    engine.stopAllSfx();
    screenListeners.forEach((fn) => fn(el));
  },
  // ¿Puede sonar una escena que vive en `screen`? (sin pantalla = vistas de perfil: sí)
  audibleIn(screen) { return !screen || engine.activeScreen === screen; },

  // Crea (o reanuda) el AudioContext. Llamar solo desde un gesto del usuario.
  ensureCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!engine.ctx) {
      engine.ctx = new AC();
      engine.master = engine.ctx.createGain();
      engine.master.connect(engine.ctx.destination);
    }
    if (engine.ctx.state === 'suspended') engine.ctx.resume().catch(() => {});
    return engine.ctx;
  },

  load(name) {
    if (engine.buffers[name]) return Promise.resolve(engine.buffers[name]);
    if (engine.loading[name]) return engine.loading[name];
    const ctx = engine.ctx;
    if (!ctx) return Promise.resolve(null);
    const p = fetch('/audio/sfx/' + name + '.mp3')
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('sfx ' + name))))
      .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
      .then((buf) => { engine.buffers[name] = buf; return buf; })
      .catch(() => null)
      .finally(() => { delete engine.loading[name]; });
    engine.loading[name] = p;
    return p;
  },

  preloadAll() { SFX_NAMES.forEach((n) => engine.load(n)); },

  /*
    playSfx(name, opts)
      at       segundo de la escena en el que cae la ACCIÓN (se resta el pico del archivo)
               -> se traduce a un offset dentro del archivo cuando el cue ya "pasó".
      offset   segundos a saltar dentro del archivo
      loopFor  bucle durante N segundos
      fade     desvanecimiento final (s)
      gain     volumen relativo (1 = normal)
      force    sonar aunque el botón Sonido esté apagado (voces: taps de palabra clave)
  */
  playSfx(name, opts = {}) {
    if (!(engine.enabled || opts.force)) return null;
    const ctx = engine.ctx;
    if (!ctx) return null;
    const buf = engine.buffers[name];
    if (!buf) {
      const t = performance.now();
      engine.load(name).then((b) => { if (b && performance.now() - t < 350) engine.playSfx(name, opts); });
      return null;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = opts.gain == null ? 1 : opts.gain;
    src.connect(g); g.connect(engine.master);
    const now = ctx.currentTime;
    const offset = Math.max(0, Math.min(buf.duration - 0.01, opts.offset || 0));
    let dur;
    if (opts.loopFor) { src.loop = true; dur = opts.loopFor; }
    else dur = buf.duration - offset;
    if (opts.fade && opts.fade < dur) {
      g.gain.setValueAtTime(g.gain.value, now + dur - opts.fade);
      g.gain.linearRampToValueAtTime(0, now + dur);
    }
    src.start(now, offset);
    src.stop(now + dur + 0.02);
    engine.sources.add(src);
    src.onended = () => { engine.sources.delete(src); try { src.disconnect(); g.disconnect(); } catch (e) { /* noop */ } };
    return src;
  },

  stopAllSfx() {
    engine.sources.forEach((s) => { try { s.stop(); } catch (e) { /* noop */ } });
    engine.sources.clear();
  },

  // Se conserva por compatibilidad (antes bajaba la música durante las voces).
  duck() {},

  enable() {
    if (!engine.ensureCtx()) return false;
    engine.enabled = true;
    engine.preloadAll();
    engine.emit();
    return true;
  },

  disable() {
    engine.enabled = false;
    engine.stopAllSfx();
    engine.emit();
  },

  toggle() { return engine.enabled ? (engine.disable(), false) : engine.enable(); },

  // Onda real de un archivo: devuelve { bars: [0..1], duration } sin necesitar gesto
  // (OfflineAudioContext decodifica sin restricciones de autoplay).
  async waveform(url, n) {
    const r = await fetch(url);
    if (!r.ok) throw new Error('audio ' + url);
    const ab = await r.arrayBuffer();
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const oc = new OAC(1, 44100, 44100);
    const buf = await new Promise((res, rej) => oc.decodeAudioData(ab, res, rej));
    const data = buf.getChannelData(0), len = data.length, out = [];
    let max = 0;
    for (let i = 0; i < n; i++) {
      const a = Math.floor((i / n) * len), b = Math.floor(((i + 1) / n) * len);
      let sum = 0;
      for (let j = a; j < b; j += 4) sum += data[j] * data[j];
      const v = Math.sqrt(sum / Math.max(1, (b - a) / 4));
      out.push(v); if (v > max) max = v;
    }
    return { bars: out.map((v) => Math.max(0.1, max ? v / max : 0)), duration: buf.duration };
  },
};

export function peakOf(name) { return PEAK[name] || 0; }
export default engine;
