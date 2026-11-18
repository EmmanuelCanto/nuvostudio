import React from "react";
import { Card, Person, Phone, SceneWrap, useT } from "../components";
import { BACK, C, OUT, SANS, SCENES, SERIF, lerp, p } from "../theme";

// Cada palabra del ejemplo aparece justo cuando la voz dice "palabra… por… palabra"
const SAMPLE = [
  { w: "CADA", t: 7.2 },
  { w: "PALABRA", t: 7.74, key: true },
  { w: "CUENTA", t: 8.36 },
];

// "ponemos subtítulos palabra por palabra"
export const S3Subtitulos: React.FC<{ start?: number }> = ({ start = SCENES.subtitulos[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.subtitulos;
  const active = SAMPLE.reduce((acc, s, i) => (t >= s.t ? i : acc), -1);
  return (
    <SceneWrap start={a} end={b}>
      <Phone w={400} bg="#0d1a44">
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 50% at 50% 30%, ${C.bright}, rgba(77,139,255,0) 70%), linear-gradient(180deg,#14224f,#0B0B14)` }} />
        <Person opacity={0.6} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,.65))" }} />
        {/* subtítulo de ejemplo dentro del video */}
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 150, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 12px" }}>
          {SAMPLE.map((s, i) => {
            const k = p(t, s.t, s.t + 0.2, BACK);
            const on = i === active;
            return (
              <span
                key={s.w}
                style={{
                  fontFamily: s.key ? SERIF : SANS,
                  fontStyle: s.key ? "italic" : "normal",
                  fontWeight: s.key ? 400 : 600,
                  fontSize: s.key ? 62 : 46,
                  textTransform: s.key ? "none" : "uppercase",
                  color: on ? C.ink : C.white,
                  background: on ? C.sky : "transparent",
                  padding: "2px 12px",
                  borderRadius: 12,
                  scale: String(lerp(0.4, 1, k)),
                  opacity: Math.min(1, k * 3),
                  letterSpacing: s.key ? 0 : "-0.03em",
                }}
              >
                {s.key ? s.w.toLowerCase() : s.w}
              </span>
            );
          })}
        </div>
      </Phone>

      {/* pista "Subs" debajo del teléfono */}
      <div style={{ position: "absolute", left: 240, top: 1150, width: 600, height: 64, borderRadius: 18, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.14)", opacity: p(t, 6.4, 6.8) }}>
        <span style={{ position: "absolute", left: 22, top: 16, fontFamily: SANS, fontSize: 26, fontWeight: 500, color: C.mute }}>Subs</span>
        {SAMPLE.map((s, i) => {
          const k = p(t, s.t, s.t + 0.18, OUT);
          return <div key={i} style={{ position: "absolute", left: 120 + i * 150, top: 14, width: 136, height: 36, borderRadius: 9, background: s.key ? C.sky : C.white, scale: `${k} 1`, transformOrigin: "left center", opacity: k }} />;
        })}
      </div>

      {/* rasgos del subtítulo */}
      <Card x={60} y={470} w={250} k={p(t, 6.6, 7.0, BACK)} rot={-5} dark>
        <div style={{ fontSize: 26, color: C.mute }}>Tamaño</div>
        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em" }}>Grande</div>
      </Card>
      <Card x={770} y={820} w={260} k={p(t, 8.7, 9.05, BACK)} rot={4} dark>
        <div style={{ fontSize: 26, color: C.mute }}>Al cuadro</div>
        <div style={{ fontSize: 46, fontFamily: SERIF, fontStyle: "italic", color: C.sky }}>sincronizado</div>
      </Card>
    </SceneWrap>
  );
};
