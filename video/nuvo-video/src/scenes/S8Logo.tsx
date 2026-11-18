import React from "react";
import { Logo, SceneWrap, useT } from "../components";
import { C, EASE, OUT, SANS, SCENES, lerp, p } from "../theme";

// "En nüvo hacemos el resto."
export const S8Logo: React.FC<{ start?: number }> = ({ start = SCENES.logo[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.logo;
  const star = p(t, 19.84, 20.4, (x) => x); // la estrella entra girando
  const letters = p(t, 19.98, 20.6, (x) => x);
  const marks = p(t, 20.07, 20.7, (x) => x); // los puntos de la ü caen justo en "nüvo"
  const tag = p(t, 20.75, 21.25, OUT);
  const glow = p(t, 19.9, 21.0, EASE);
  const flash = p(t, 19.86, 20.0, OUT) * (1 - p(t, 20.0, 20.5, EASE));
  return (
    <SceneWrap start={a} end={b + 1}>
      <div
        style={{
          position: "absolute",
          left: 540 - 560,
          top: 690 - 560,
          width: 1120,
          height: 1120,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(52,120,255,${0.45 * glow + 0.35 * flash}), rgba(52,120,255,0))`,
          scale: String(lerp(0.8, 1.05, glow) + 0.03 * Math.sin(t * 2)),
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <Logo height={270} star={star} letters={letters} marks={marks} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 38,
          letterSpacing: "0.32em",
          color: "#E8ECF5",
          opacity: tag,
          translate: `0 ${(1 - tag) * 30}px`,
        }}
      >
        ESTUDIO DE EDICIÓN DE VIDEO
      </div>
      <div style={{ position: "absolute", left: 380, right: 380, top: 980, height: 3, borderRadius: 3, background: C.sky, scale: `${p(t, 20.95, 21.5, EASE)} 1` }} />
    </SceneWrap>
  );
};
