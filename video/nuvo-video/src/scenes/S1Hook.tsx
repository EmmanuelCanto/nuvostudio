import React from "react";
import { Card, Person, Phone, SceneWrap, useT } from "../components";
import { BACK, C, EASE, OUT, SANS, SCENES, p } from "../theme";

// "Así editamos tus videos para que nadie deje de verlos."
export const S1Hook: React.FC<{ start?: number }> = ({ start = SCENES.hook[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.hook;
  const inK = p(t, 0.05, 0.7, OUT);
  const views = Math.round(12480 * p(t, 2.3, 3.7, EASE));
  const ret = p(t, 3.0, 3.9, EASE);
  const prog = p(t, 0.3, 4.1, (x) => x);
  return (
    <SceneWrap start={a} end={b}>
      <Phone style={{ translate: `0 ${(1 - inK) * 260}px`, opacity: inK, rotate: `${(1 - inK) * -6}deg` }} bg="#1a1530">
        {/* clip: luz cálida + persona hablando */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 50% at 50% 30%, ${C.amber}, rgba(242,179,94,0) 70%), linear-gradient(180deg,#2a2440,#0B0B14)` }} />
        <Person />
        <div style={{ position: "absolute", left: 28, top: 70, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.white, letterSpacing: "0.06em" }}>CLIP 01</div>
        {/* barra de progreso del clip */}
        <div style={{ position: "absolute", left: 28, right: 28, bottom: 34, height: 8, borderRadius: 9, background: "rgba(255,255,255,.25)" }}>
          <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 9, background: C.white }} />
        </div>
      </Phone>

      {/* "nadie": las vistas suben */}
      <Card x={640} y={430} w={350} k={p(t, 2.22, 2.62, BACK)} rot={5}>
        <div style={{ fontSize: 28, color: "#575763", fontWeight: 500 }}>Vistas</div>
        <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>
          {views.toLocaleString("en-US")}
        </div>
      </Card>

      {/* "deje de verlos": retención que se mantiene arriba */}
      <Card x={70} y={860} w={380} k={p(t, 2.95, 3.35, BACK)} rot={-4}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 28, color: "#575763", fontWeight: 500 }}>Retención</span>
          <span style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.04em", color: C.blue }}>{Math.round(92 * ret)}%</span>
        </div>
        <svg viewBox="0 0 320 90" style={{ width: "100%", marginTop: 8 }}>
          <path d="M0 14 C 60 16, 120 20, 180 22 S 280 26, 320 28" fill="none" stroke={C.blue} strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - ret} />
          <path d="M0 14 C 60 16, 120 20, 180 22 S 280 26, 320 28 L320 90 L0 90 Z" fill="rgba(6,88,249,.12)" opacity={ret} />
        </svg>
      </Card>
    </SceneWrap>
  );
};
