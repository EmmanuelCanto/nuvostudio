import React from "react";
import { Person, Phone, SceneWrap, useT } from "../components";
import { BACK, C, EASE, SANS, SCENES, lerp, p } from "../theme";

const PILLS = [
  { label: "TikTok", t: 15.77, x: 60, y: 440, rot: -5 },
  { label: "Reels", t: 16.55, x: 690, y: 690, rot: 4 },
  { label: "Shorts", t: 17.13, x: 80, y: 960, rot: -3 },
];

// "listo para TikTok, Reels y Shorts."
export const S6Plataformas: React.FC<{ start?: number }> = ({ start = SCENES.plataformas[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.plataformas;
  const exp = p(t, 15.2, 17.45, EASE);
  const done = t >= 17.45;
  return (
    <SceneWrap start={a} end={b}>
      <Phone bg="#2a2440">
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 50% at 50% 30%, ${C.amber}, rgba(242,179,94,0) 70%), linear-gradient(180deg,#2a2440,#0B0B14)` }} />
        <Person />
        <span style={{ position: "absolute", right: 22, top: 22, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink, background: C.white, borderRadius: 99, padding: "6px 16px" }}>9:16</span>
      </Phone>

      {PILLS.map((pl) => {
        const kk = p(t, pl.t - 0.05, pl.t + 0.3, BACK);
        return (
          <div
            key={pl.label}
            style={{
              position: "absolute",
              left: pl.x,
              top: pl.y,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "20px 34px 20px 22px",
              borderRadius: 99,
              background: C.white,
              boxShadow: "0 40px 80px -30px rgba(0,0,0,.6)",
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 56,
              letterSpacing: "-0.03em",
              color: C.ink,
              scale: String(lerp(0.4, 1, kk)),
              opacity: Math.min(1, kk * 2),
              rotate: `${pl.rot * (2 - kk)}deg`,
              translate: `${(1 - kk) * (pl.x > 400 ? 120 : -120)}px 0`,
            }}
          >
            <span style={{ width: 54, height: 54, borderRadius: 99, background: C.blue, display: "grid", placeItems: "center" }}>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p(t, pl.t + 0.1, pl.t + 0.4)} />
              </svg>
            </span>
            {pl.label}
          </div>
        );
      })}

      {/* exportación */}
      <div style={{ position: "absolute", left: 300, top: 1180, width: 480, fontFamily: SANS, color: C.white, opacity: p(t, 15.15, 15.4) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 500, marginBottom: 12 }}>
          <span style={{ color: done ? C.sky : C.mute }}>{done ? "Listo para publicar" : "Exportando…"}</span>
          <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{Math.round(exp * 100)}%</span>
        </div>
        <div style={{ height: 14, borderRadius: 99, background: "rgba(255,255,255,.18)" }}>
          <div style={{ width: `${exp * 100}%`, height: "100%", borderRadius: 99, background: done ? C.sky : C.white }} />
        </div>
      </div>
    </SceneWrap>
  );
};
