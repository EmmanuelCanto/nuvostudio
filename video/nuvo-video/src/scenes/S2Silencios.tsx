import React from "react";
import { SceneWrap, useT } from "../components";
import { C, EASE, OUT, SANS, SCENES, SERIF, lerp, p } from "../theme";

type Seg = { kind: "voz" | "silencio" | "muletilla"; w: number; label?: string };
const SEGS: Seg[] = [
  { kind: "voz", w: 150 },
  { kind: "silencio", w: 80 },
  { kind: "voz", w: 120 },
  { kind: "muletilla", w: 90, label: "eh…" },
  { kind: "voz", w: 140 },
  { kind: "silencio", w: 90 },
  { kind: "muletilla", w: 100, label: "este…" },
  { kind: "voz", w: 130 },
];
const bar = (i: number) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.43));

// "Quitamos silencios y muletillas,"
export const S2Silencios: React.FC<{ start?: number }> = ({ start = SCENES.silencios[0] }) => {
  const t = useT(start);
  const [a, b] = SCENES.silencios;
  const mark = p(t, 4.65, 4.95, OUT); // se marcan los silencios
  const cutS = p(t, 5.0, 5.35, EASE); // se eliminan los silencios
  const markM = p(t, 5.4, 5.6, OUT); // se marcan las muletillas
  const cutM = p(t, 5.65, 6.0, EASE); // se eliminan las muletillas
  const widths = SEGS.map((s) => (s.kind === "silencio" ? s.w * (1 - cutS) : s.kind === "muletilla" ? s.w * (1 - cutM) : s.w));
  const total = widths.reduce((x, y) => x + y, 0);
  const x0 = (840 - total) / 2;
  const secs = Math.round(lerp(42, 31, Math.max(cutS * 0.55, cutS * 0.55 + cutM * 0.45)));
  let acc = 0;
  let barIdx = 0;
  return (
    <SceneWrap start={a} end={b}>
      <div style={{ position: "absolute", left: 80, top: 430, width: 920, height: 640, borderRadius: 40, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.14)" }}>
        <div style={{ position: "absolute", left: 40, top: 34, right: 40, display: "flex", justifyContent: "space-between", fontFamily: SANS, color: C.white }}>
          <span style={{ fontSize: 34, fontWeight: 500 }}>
            Tu toma <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.sky }}>sin cortar</span>
          </span>
          <span style={{ fontSize: 40, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>0:{String(secs).padStart(2, "0")}</span>
        </div>

        {/* pista de audio */}
        <div style={{ position: "absolute", left: 40, top: 200, width: 840, height: 260 }}>
          {SEGS.map((s, i) => {
            const left = x0 + acc;
            acc += widths[i];
            const w = widths[i];
            const n = Math.max(1, Math.round(s.w / 14));
            const removing = s.kind === "silencio" ? mark : s.kind === "muletilla" ? markM : 0;
            const bg = s.kind === "silencio" ? `rgba(255,77,77,${0.22 * removing})` : s.kind === "muletilla" ? `rgba(242,179,94,${0.25 * removing})` : "transparent";
            const startBar = barIdx;
            barIdx += n;
            return (
              <div key={i} style={{ position: "absolute", left, top: 0, width: w, height: 260, overflow: "hidden", background: bg, borderRadius: 14 }}>
                {s.kind === "silencio" ? (
                  <div style={{ position: "absolute", left: 8, right: 8, top: 128, height: 4, borderRadius: 4, background: "rgba(255,255,255,.35)" }} />
                ) : (
                  <div style={{ position: "absolute", inset: "0 6px", display: "flex", alignItems: "center", gap: 5 }}>
                    {Array.from({ length: n }).map((_, j) => (
                      <div key={j} style={{ flex: 1, height: `${bar(startBar + j) * (s.kind === "muletilla" ? 55 : 92)}%`, borderRadius: 6, background: s.kind === "muletilla" ? C.amber : C.bright }} />
                    ))}
                  </div>
                )}
                {/* tijera en los bordes del silencio */}
                {s.kind !== "voz" && (
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: s.kind === "silencio" ? C.red : C.amber, opacity: removing * (1 - (s.kind === "silencio" ? cutS : cutM)) }} />
                )}
              </div>
            );
          })}
          {/* etiquetas que salen volando al cortar */}
          {(() => {
            let ac = 0;
            return SEGS.map((s, i) => {
              const left = x0 + ac + widths[i] / 2;
              ac += widths[i];
              if (s.kind === "voz") return null;
              const show = s.kind === "silencio" ? mark : markM;
              const gone = s.kind === "silencio" ? cutS : cutM;
              return (
                <div
                  key={"l" + i}
                  style={{
                    position: "absolute",
                    left,
                    top: -70 - gone * 90,
                    translate: "-50% 0",
                    fontFamily: s.kind === "muletilla" ? SERIF : SANS,
                    fontStyle: s.kind === "muletilla" ? "italic" : "normal",
                    fontSize: s.kind === "muletilla" ? 50 : 28,
                    fontWeight: s.kind === "muletilla" ? 400 : 600,
                    color: s.kind === "silencio" ? C.red : C.amber,
                    opacity: show * (1 - gone),
                    whiteSpace: "nowrap",
                    letterSpacing: s.kind === "silencio" ? "0.06em" : 0,
                  }}
                >
                  {s.kind === "silencio" ? "SILENCIO" : s.label}
                </div>
              );
            });
          })()}
        </div>

        {/* leyenda */}
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, display: "flex", gap: 36, fontFamily: SANS, fontSize: 28, color: C.mute }}>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}><i style={{ width: 22, height: 22, borderRadius: 6, background: C.bright }} />Voz</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}><i style={{ width: 22, height: 22, borderRadius: 6, background: C.red }} />Silencios</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}><i style={{ width: 22, height: 22, borderRadius: 6, background: C.amber }} />Muletillas</span>
        </div>
      </div>
    </SceneWrap>
  );
};
