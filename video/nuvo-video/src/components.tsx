import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BACK, C, CLIP_LABELS, EASE, FPS, OUT, SANS, SCENES, SERIF, TOTAL, lerp, p } from "./theme";
import { LETTERS, LOGO_BOX, STAR } from "./logo";
import { WAVE, WORDS } from "./data";

// Tiempo absoluto del video (segundos) dentro de una escena que empieza en `start`
export const useT = (start = 0) => useCurrentFrame() / FPS + start;

/* ---------------- Fondo: azul marino con cuadrícula y brillo que respira ---------------- */
export const Background: React.FC = () => {
  const t = useT();
  const gx = 50 + 18 * Math.sin(t * 0.35);
  const gy = 38 + 10 * Math.cos(t * 0.27);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(70% 45% at ${gx}% ${gy}%, rgba(6,88,249,.55), rgba(6,88,249,0) 70%), linear-gradient(160deg, ${C.navy} 0%, #07143F 55%, ${C.navy2} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.05) 2px, transparent 2px)",
          backgroundSize: "120px 120px",
          backgroundPosition: `${-t * 6}px ${-t * 10}px`,
          WebkitMaskImage: `radial-gradient(75% 60% at ${gx}% ${gy}%, #000, transparent 85%)`,
          maskImage: `radial-gradient(75% 60% at ${gx}% ${gy}%, #000, transparent 85%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Logotipo nüvo (estrella + palabra, vectorizados del manual de marca) ---------------- */
// height: alto en px. star / letters / marks: progreso de animación 0..1 (1 = logo completo).
export const Logo: React.FC<{ height: number; star?: number; letters?: number; marks?: number; color?: string }> = ({
  height,
  star = 1,
  letters = 1,
  marks = 1,
  color = C.white,
}) => {
  const id = "g" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const { x, y, w, h } = LOGO_BOX;
  const order: ("n" | "u" | "v" | "o")[] = ["n", "u", "v", "o"];
  const cl = (v: number) => Math.max(0, Math.min(1, v));
  const sk = OUT(cl(star));
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} height={height} width={(height * w) / h} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id={id} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#60A5FF" />
          <stop offset=".45" stopColor="#3478FF" />
          <stop offset="1" stopColor="#1B3FB8" />
        </linearGradient>
      </defs>
      <path
        d={STAR}
        fill={`url(#${id})`}
        style={{ transformBox: "fill-box", transformOrigin: "62% 52%", scale: String(BACK(cl(star))), rotate: `${(1 - sk) * -120}deg`, opacity: Math.min(1, cl(star) * 3) }}
      />
      {order.map((k, i) => {
        const v = OUT(cl((letters - i * 0.18) / 0.46));
        return <path key={k} d={LETTERS[k]} fill={color} fillRule="evenodd" style={{ opacity: v, translate: `0 ${(1 - v) * 60}px` }} />;
      })}
      {/* los dos puntos de la ü caen uno tras otro */}
      {LETTERS.dots.split("Z").filter(Boolean).map((d, i) => {
        const v = cl((marks - i * 0.25) / 0.75);
        return <path key={i} d={d + "Z"} fill={color} style={{ opacity: Math.min(1, v * 3), translate: `0 ${(1 - OUT(v)) * -90}px` }} />;
      })}
    </svg>
  );
};

/* ---------------- Encabezado: logo + REC + código de tiempo ---------------- */
export const Header: React.FC = () => {
  const t = useT();
  const fr = Math.floor((t % 1) * FPS);
  const tc = `00:00:${String(Math.floor(t)).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
  const hideLogo = 1 - p(t, SCENES.logo[0] - 0.1, SCENES.logo[0] + 0.3, EASE);
  const blink = Math.floor(t * 2) % 2 === 0 ? 1 : 0.35;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 96, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: p(t, 0, 0.5) }}>
      <div style={{ opacity: hideLogo }}>
        <Logo height={74} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.white, fontVariantNumeric: "tabular-nums" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, color: C.white }}>
          <span style={{ width: 20, height: 20, borderRadius: 99, background: C.red, opacity: blink }} />
          REC
        </span>
        <span style={{ color: C.mute, fontWeight: 500 }}>{tc}</span>
      </div>
    </div>
  );
};

/* ---------------- Subtítulos palabra por palabra (anterior · actual · siguiente) ---------------- */
export const Subtitles: React.FC = () => {
  const t = useT();
  let i = -1;
  for (let j = 0; j < WORDS.length; j++) if (WORDS[j].s <= t + 0.02) i = j;
  const last = WORDS[WORDS.length - 1];
  const out = 1 - p(t, last.e + 0.5, last.e + 0.9, EASE);
  if (i < 0) return null;
  const w = WORDS[i];
  const k = p(t, w.s, w.s + 0.16, OUT);
  const prev = i > 0 && WORDS[i - 1].e > w.s - 0.9 ? WORDS[i - 1].w : "";
  const next = i < WORDS.length - 1 && WORDS[i + 1].s < w.e + 0.9 ? WORDS[i + 1].w : "";
  const clean = (s: string) => s.replace(/[.,:;]$/, "");
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1330, height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: out }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: C.white, opacity: 0.5, height: 54 }}>{clean(prev)}</div>
      <div
        style={{
          height: 150,
          display: "flex",
          alignItems: "center",
          scale: String(lerp(0.78, 1, k)),
          translate: `0 ${(1 - k) * 18}px`,
          opacity: lerp(0.2, 1, k),
        }}
      >
        {w.k ? (
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 150, color: C.sky, letterSpacing: "-0.01em" }}>{clean(w.w)}</span>
        ) : (
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 118, color: C.white, textTransform: "uppercase", letterSpacing: "-0.035em" }}>{clean(w.w)}</span>
        )}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.white, opacity: 0.4, height: 50 }}>{clean(next)}</div>
    </div>
  );
};

/* ---------------- Línea de tiempo del propio video (como en un editor) ---------------- */
export const Timeline: React.FC = () => {
  const t = useT();
  const W = 920;
  const x = (s: number) => (s / TOTAL) * W;
  const ph = x(Math.min(t, TOTAL));
  const appear = p(t, 0.1, 0.7);
  const rowLabel: React.CSSProperties = { position: "absolute", left: -2, fontFamily: SANS, fontSize: 20, fontWeight: 500, color: C.mute, width: 0 };
  return (
    <div style={{ position: "absolute", left: 80, top: 1640, width: W, height: 200, opacity: appear, translate: `0 ${(1 - appear) * 30}px` }}>
      {/* regla */}
      {Array.from({ length: Math.floor(TOTAL) + 1 }).map((_, s) => (
        <div key={s} style={{ position: "absolute", left: x(s), top: 0, width: 2, height: s % 5 === 0 ? 22 : 12, background: s % 5 === 0 ? C.white : "rgba(255,255,255,.45)" }} />
      ))}
      {[0, 5, 10, 15, 20].map((s) => (
        <div key={s} style={{ position: "absolute", left: x(s) + 8, top: -2, fontFamily: SANS, fontSize: 20, color: C.mute, fontVariantNumeric: "tabular-nums" }}>{`00:${String(s).padStart(2, "0")}`}</div>
      ))}
      {/* pista de video: un clip por escena */}
      {CLIP_LABELS.map((c, i) => {
        const [a, b] = SCENES[c.key];
        const on = t >= a && t < b;
        return (
          <div
            key={c.key}
            style={{
              position: "absolute",
              left: x(a) + 2,
              top: 40,
              width: x(b) - x(a) - 4,
              height: 44,
              borderRadius: 10,
              background: on ? C.nuvo : i % 2 ? "rgba(127,168,255,.28)" : "rgba(127,168,255,.18)",
              border: `2px solid ${on ? C.sky : "rgba(127,168,255,.35)"}`,
              fontFamily: SANS,
              fontSize: 19,
              fontWeight: 600,
              color: C.white,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {c.label}
          </div>
        );
      })}
      {/* pista de subtítulos: un bloque por palabra */}
      {WORDS.map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x(w.s),
            top: 96,
            width: Math.max(4, x(w.e) - x(w.s) - 2),
            height: 22,
            borderRadius: 5,
            background: w.k ? C.sky : "rgba(255,255,255,.75)",
            opacity: t >= w.s ? 1 : 0.18,
          }}
        />
      ))}
      {/* pista de voz: onda real; la primera voz en azul, la segunda en celeste */}
      <div style={{ position: "absolute", left: 0, top: 130, width: W, height: 50, display: "flex", alignItems: "center", gap: 2 }}>
        {WAVE.map((v, i) => {
          const s = (i / WAVE.length) * TOTAL;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: Math.max(3, v * 50),
                borderRadius: 3,
                background: s < 12 ? C.bright : C.sky,
                opacity: s <= t ? 1 : 0.3,
              }}
            />
          );
        })}
      </div>
      {/* cabezal de reproducción */}
      <div style={{ position: "absolute", left: ph - 2, top: 26, width: 4, height: 166, background: C.red, borderRadius: 2 }}>
        <div style={{ position: "absolute", left: -9, top: -14, width: 22, height: 22, background: C.red, rotate: "45deg" }} />
      </div>
      <span style={rowLabel} />
    </div>
  );
};

/* ---------------- Teléfono 9:16 ---------------- */
export const Phone: React.FC<{ w?: number; children?: React.ReactNode; style?: React.CSSProperties; bg?: string }> = ({ w = 440, children, style, bg }) => {
  const h = (w * 16) / 9;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - w / 2,
        top: 760 - h / 2,
        width: w,
        height: h,
        borderRadius: w * 0.12,
        border: `${Math.round(w * 0.025)}px solid ${C.ink}`,
        background: bg || C.ink,
        overflow: "hidden",
        boxShadow: "0 60px 120px -40px rgba(0,0,0,.7), 0 0 0 2px rgba(255,255,255,.12)",
        ...style,
      }}
    >
      {children}
      <div style={{ position: "absolute", top: 18, left: "50%", width: 110, height: 30, marginLeft: -55, borderRadius: 99, background: C.ink }} />
    </div>
  );
};

// Silueta de persona (clips de ejemplo)
export const Person: React.FC<{ opacity?: number }> = ({ opacity = 0.55 }) => (
  <svg viewBox="0 0 120 130" style={{ position: "absolute", left: "15%", width: "70%", bottom: 0 }}>
    <circle cx="60" cy="40" r="26" fill={C.ink} fillOpacity={opacity} />
    <path d="M8 130c4-40 26-56 52-56s48 16 52 56z" fill={C.ink} fillOpacity={opacity} />
  </svg>
);

/* ---------------- Tarjeta blanca (chips de datos) ---------------- */
export const Card: React.FC<{ x: number; y: number; w: number; k: number; rot?: number; children: React.ReactNode; dark?: boolean }> = ({ x, y, w, k, rot = 0, children, dark }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      padding: "26px 30px",
      borderRadius: 30,
      background: dark ? "rgba(255,255,255,.07)" : C.white,
      border: dark ? "2px solid rgba(255,255,255,.16)" : "none",
      color: dark ? C.white : C.ink,
      boxShadow: dark ? "none" : "0 40px 80px -30px rgba(0,0,0,.6)",
      fontFamily: SANS,
      scale: String(lerp(0.6, 1, k)),
      opacity: Math.min(1, k * 2),
      rotate: `${rot * (2 - k)}deg`,
    }}
  >
    {children}
  </div>
);

// Diamante (como los keyframes de la página)
export const Diamond: React.FC<{ x: number; y: number; s: number; color?: string; k?: number }> = ({ x, y, s, color = C.white, k = 1 }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, background: color, rotate: "45deg", scale: String(k) }} />
);

/* ---------------- Entrada/salida de cada escena ---------------- */
export const SceneWrap: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({ start, end, children }) => {
  const t = useT(start);
  const inK = p(t, start, start + 0.3, OUT);
  const outK = p(t, end - 0.18, end + 0.05, EASE);
  return (
    <AbsoluteFill style={{ opacity: inK * (1 - outK), translate: `0 ${(1 - inK) * 50 - outK * 40}px`, scale: String(lerp(0.97, 1, inK)) }}>{children}</AbsoluteFill>
  );
};
