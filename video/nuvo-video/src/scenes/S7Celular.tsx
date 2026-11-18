import React from "react";
import { Card, Person, Phone, SceneWrap, useT } from "../components";
import { BACK, C, EASE, OUT, SANS, SCENES, lerp, p } from "../theme";

// "Tú grabas con tu celular."
export const S7Celular: React.FC<{ start?: number }> = ({ start = SCENES.celular[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.celular;
  const inK = p(t, 17.9, 18.35, OUT);
  const press = p(t, 18.22, 18.4, EASE); // botón: círculo → cuadrado (grabando)
  const flash = p(t, 18.25, 18.75, OUT);
  const rec = t >= 18.3;
  const secs = Math.max(0, Math.floor((t - 18.3) * 1));
  const corner = (r: number): React.CSSProperties => ({ position: "absolute", width: 46, height: 46, borderColor: "rgba(255,255,255,.8)", borderStyle: "solid", borderWidth: 0, rotate: `${r}deg` });
  return (
    <SceneWrap start={a} end={b}>
      <Phone bg="#1a1530" style={{ translate: `0 ${(1 - inK) * 200}px`, rotate: `${(1 - inK) * 8}deg` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 50% at 50% 35%, ${C.amber}, rgba(242,179,94,0) 70%), linear-gradient(180deg,#2a2440,#0B0B14)` }} />
        <Person />
        {/* visor de cámara */}
        {[0, 90, 180, 270].map((r, i) => (
          <div key={r} style={{ ...corner(r), left: i === 0 || i === 3 ? 40 : undefined, right: i === 1 || i === 2 ? 40 : undefined, top: i < 2 ? 110 : undefined, bottom: i >= 2 ? 210 : undefined, borderTopWidth: 5, borderLeftWidth: 5 }} />
        ))}
        {/* REC + tiempo */}
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px", borderRadius: 10, background: rec ? C.red : "rgba(0,0,0,.4)", fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.white, fontVariantNumeric: "tabular-nums" }}>
            00:00:{String(secs).padStart(2, "0")}
          </span>
        </div>
        {/* botón de grabar */}
        <div style={{ position: "absolute", left: "50%", bottom: 70, width: 120, height: 120, marginLeft: -60, borderRadius: 99, border: "8px solid #fff", display: "grid", placeItems: "center" }}>
          <div style={{ width: lerp(88, 44, press), height: lerp(88, 44, press), borderRadius: lerp(44, 10, press), background: C.red }} />
          <div style={{ position: "absolute", inset: -8, borderRadius: 99, border: `6px solid ${C.red}`, scale: String(lerp(1, 2.2, flash)), opacity: flash > 0 ? 1 - flash : 0 }} />
        </div>
      </Phone>

      {/* la toma sale hacia el estudio */}
      <Card x={700} y={980} w={320} k={p(t, 19.15, 19.5, BACK)} rot={4} dark>
        <div style={{ fontSize: 30, fontWeight: 600 }}>toma_01.mp4</div>
        <div style={{ fontSize: 26, color: C.mute }}>Enviada a nüvo</div>
      </Card>
    </SceneWrap>
  );
};
