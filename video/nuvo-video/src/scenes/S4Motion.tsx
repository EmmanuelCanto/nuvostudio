import React from "react";
import { Diamond, SceneWrap, useT } from "../components";
import { BACK, C, EASE, OUT, SANS, SCENES, SERIF, lerp, p } from "../theme";

// Curva S (como la del inicio de la página) en coordenadas de la tarjeta
const P0 = [80, 540], P1 = [430, 540], P2 = [490, 150], P3 = [840, 150];
const bez = (u: number) => {
  const m = 1 - u;
  return [0, 1].map((k) => m * m * m * P0[k] + 3 * m * m * u * P1[k] + 3 * m * u * u * P2[k] + u * u * u * P3[k]);
};
const KF = [0.28, 0.52, 0.76];

// "y animamos lo que dices con motion graphics."
export const S4Motion: React.FC<{ start?: number }> = ({ start = SCENES.motion[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.motion;
  const draw = p(t, 9.5, 10.5, EASE);
  const head = bez(Math.max(0.001, draw));
  const count = Math.round(38 * p(t, 10.55, 11.3, EASE));
  const glow = p(t, 11.15, 11.3, OUT) * (1 - p(t, 11.35, 11.8, EASE));
  const bars = [0.45, 0.7, 0.55, 1];
  return (
    <SceneWrap start={a} end={b}>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 420,
          width: 920,
          height: 680,
          borderRadius: 40,
          background: "rgba(255,255,255,.06)",
          border: `2px solid ${glow > 0.01 ? C.sky : "rgba(255,255,255,.14)"}`,
          boxShadow: `0 0 ${120 * glow}px rgba(77,139,255,${0.6 * glow})`,
          scale: String(1 + 0.02 * glow),
        }}
      >
        <svg viewBox="0 0 920 680" style={{ position: "absolute", inset: 0 }}>
          {/* cuadrícula del editor de curvas */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={"v" + i} x1={80 + i * 95} y1={110} x2={80 + i * 95} y2={580} stroke="rgba(255,255,255,.09)" strokeWidth={2} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={"h" + i} x1={80} y1={110 + i * 117.5} x2={840} y2={110 + i * 117.5} stroke="rgba(255,255,255,.09)" strokeWidth={2} />
          ))}
          <path
            d={`M${P0} C ${P1}, ${P2}, ${P3}`}
            fill="none"
            stroke={C.bright}
            strokeWidth={9}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - draw}
          />
          {/* manijas de la curva */}
          <g opacity={p(t, 9.6, 9.9)}>
            <line x1={P0[0]} y1={P0[1]} x2={P1[0]} y2={P1[1]} stroke={C.sky} strokeWidth={3} strokeDasharray="8 8" />
            <line x1={P3[0]} y1={P3[1]} x2={P2[0]} y2={P2[1]} stroke={C.sky} strokeWidth={3} strokeDasharray="8 8" />
            <circle cx={P1[0]} cy={P1[1]} r={11} fill={C.sky} />
            <circle cx={P2[0]} cy={P2[1]} r={11} fill={C.sky} />
          </g>
        </svg>
        {/* keyframes */}
        <Diamond x={P0[0]} y={P0[1]} s={34} k={p(t, 9.45, 9.7, BACK)} />
        {KF.map((u, i) => {
          const [x, y] = bez(u);
          return <Diamond key={i} x={x} y={y} s={26} k={p(t, 9.95 + i * 0.16, 10.2 + i * 0.16, BACK) * (draw >= u ? 1 : 0)} color={C.sky} />;
        })}
        <Diamond x={head[0]} y={head[1]} s={34} k={p(t, 9.5, 9.75, BACK)} />

        {/* cifra que cuenta */}
        <div style={{ position: "absolute", left: 60, top: 40, fontFamily: SANS, color: C.white, opacity: p(t, 10.5, 10.75) }}>
          <div style={{ fontSize: 120, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>+{count}%</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.sky }}>más alcance</div>
        </div>

        {/* barras que crecen */}
        <div style={{ position: "absolute", right: 60, bottom: 60, height: 240, display: "flex", alignItems: "flex-end", gap: 18 }}>
          {bars.map((h, i) => {
            const k = p(t, 10.3 + i * 0.12, 10.8 + i * 0.12, BACK);
            return <div key={i} style={{ width: 46, height: 240 * h * k, borderRadius: 12, background: i === 3 ? C.white : "rgba(127,168,255,.55)" }} />;
          })}
        </div>

        {/* etiquetas */}
        <div style={{ position: "absolute", left: 60, bottom: 50, display: "flex", gap: 14 }}>
          {["Líneas", "Cifras", "Iconos"].map((l, i) => {
            const k = p(t, 10.85 + i * 0.13, 11.15 + i * 0.13, BACK);
            return (
              <span key={l} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, padding: "10px 22px", borderRadius: 99, background: C.white, color: C.ink, scale: String(lerp(0.5, 1, k)), opacity: Math.min(1, k * 2) }}>
                {l}
              </span>
            );
          })}
        </div>
      </div>
    </SceneWrap>
  );
};
