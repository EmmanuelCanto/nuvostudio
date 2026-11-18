import React from "react";
import { AbsoluteFill } from "remotion";
import { useT } from "../components";
import { STAR } from "../logo";
import { C, EASE, OUT, lerp, p } from "../theme";

export const HANDOFF = [11.72, 12.4] as const;

// Cambio de voz (primera → segunda mitad): un círculo azul barre la pantalla
// y la estrella del logo pasa girando al centro.
export const Handoff: React.FC<{ start?: number }> = ({ start = HANDOFF[0] }) => {
  const t = useT(start);
  const grow = p(t, 11.74, 12.0, EASE);
  const fade = p(t, 12.08, 12.38, EASE);
  const morph = p(t, 11.8, 12.15, OUT);
  const d = lerp(0, 2600, grow);
  return (
    <AbsoluteFill style={{ opacity: 1 - fade, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 540 - d / 2, top: 760 - d / 2, width: d, height: d, borderRadius: "50%", background: C.nuvo }} />
      <svg
        viewBox="12 8 205 244"
        width={210}
        height={250}
        style={{
          position: "absolute",
          left: 540 - 105,
          top: 760 - 125,
          overflow: "visible",
          rotate: `${lerp(-150, 0, morph)}deg`,
          scale: String(lerp(0.2, 1, p(t, 11.76, 11.95, OUT)) * lerp(1, 0.55, fade)),
        }}
      >
        <path d={STAR} fill={C.white} />
      </svg>
    </AbsoluteFill>
  );
};
