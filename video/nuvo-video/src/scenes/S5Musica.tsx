import React from "react";
import { Diamond, Person, SceneWrap, useT } from "../components";
import { BACK, C, EASE, OUT, SANS, SCENES, SERIF, lerp, p } from "../theme";

const SFX_MARKS = [
  { x: 190, label: "woosh", t: 13.05 },
  { x: 430, label: "pop", t: 13.22 },
  { x: 680, label: "clic", t: 13.39 },
];

// "Música, efectos y formato vertical,"
export const S5Musica: React.FC<{ start?: number }> = ({ start = SCENES.musica[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.musica;
  const tracksOut = p(t, 13.6, 13.9, EASE);
  const music = p(t, 12.2, 12.6, OUT);
  const frameIn = p(t, 13.7, 13.95, OUT);
  const morph = p(t, 13.85, 14.55, EASE);
  const w = lerp(760, 440, morph);
  const h = lerp(428, 782, morph);
  const card: React.CSSProperties = { position: "absolute", left: 80, width: 920, height: 230, borderRadius: 36, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.14)" };
  const label: React.CSSProperties = { position: "absolute", left: 36, top: 26, fontFamily: SANS, fontSize: 32, fontWeight: 500, color: C.white };
  return (
    <SceneWrap start={a} end={b}>
      {/* A) música y efectos */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - tracksOut, translate: `0 ${-tracksOut * 80}px` }}>
        <div style={{ ...card, top: 440, opacity: p(t, 12.05, 12.3) }}>
          <span style={label}>
            Música <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.sky, fontSize: 38 }}>por debajo de tu voz</span>
          </span>
          <div style={{ position: "absolute", left: 36, right: 36, bottom: 30, height: 110, display: "flex", alignItems: "flex-end", gap: 8 }}>
            {Array.from({ length: 34 }).map((_, i) => {
              const v = 0.3 + 0.7 * Math.abs(Math.sin(t * 7 + i * 0.9) * Math.cos(t * 3.1 + i * 0.37));
              return <div key={i} style={{ flex: 1, height: `${v * 100 * music}%`, borderRadius: 6, background: i % 4 === 0 ? C.sky : C.bright }} />;
            })}
          </div>
        </div>
        <div style={{ ...card, top: 710, opacity: p(t, 12.8, 13.05) }}>
          <span style={label}>Efectos de sonido</span>
          <div style={{ position: "absolute", left: 36, right: 36, top: 140, height: 4, borderRadius: 4, background: "rgba(255,255,255,.2)" }} />
          {SFX_MARKS.map((m) => {
            const k = p(t, m.t, m.t + 0.25, BACK);
            return (
              <div key={m.label}>
                <Diamond x={m.x} y={142} s={30} k={k} color={C.amber} />
                <span style={{ position: "absolute", left: m.x, top: 172, translate: "-50% 0", fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.amber, opacity: k }}>{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* B) de horizontal a vertical */}
      <div
        style={{
          position: "absolute",
          left: 540 - w / 2,
          top: 760 - h / 2,
          width: w,
          height: h,
          borderRadius: lerp(28, 52, morph),
          border: `10px solid ${C.ink}`,
          overflow: "hidden",
          background: `radial-gradient(70% 50% at 50% 30%, ${C.amber}, rgba(242,179,94,0) 70%), linear-gradient(180deg,#2a2440,#0B0B14)`,
          opacity: frameIn,
          scale: String(lerp(0.8, 1, frameIn)),
          rotate: `${lerp(0, 360, morph)}deg`, // gira mientras cambia de forma
          boxShadow: "0 60px 120px -40px rgba(0,0,0,.7)",
        }}
      >
        <Person />
        <span style={{ position: "absolute", right: 22, top: 22, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink, background: C.white, borderRadius: 99, padding: "6px 16px" }}>
          {morph > 0.5 ? "9:16" : "16:9"}
        </span>
      </div>
    </SceneWrap>
  );
};
