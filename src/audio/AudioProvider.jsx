import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import engine from './engine.js';

const Ctx = createContext({ enabled: false, toggle: () => {}, engine });

export function AudioProvider({ children }) {
  const [enabled, setEnabled] = useState(engine.enabled);
  useEffect(() => engine.subscribe(setEnabled), []);
  const value = useMemo(() => ({
    enabled,
    toggle: () => engine.toggle(),
    engine,
    playSfx: (name, opts) => engine.playSfx(name, opts),
    duck: (on) => engine.duck(on),
    ensureCtx: () => engine.ensureCtx(),
  }), [enabled]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio() { return useContext(Ctx); }
