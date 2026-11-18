import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Background, Header, Subtitles, Timeline } from "./components";
import { FPS, SCENES, TOTAL } from "./theme";
import { S1Hook } from "./scenes/S1Hook";
import { S2Silencios } from "./scenes/S2Silencios";
import { S3Subtitulos } from "./scenes/S3Subtitulos";
import { S4Motion } from "./scenes/S4Motion";
import { Handoff, HANDOFF } from "./scenes/Handoff";
import { S5Musica } from "./scenes/S5Musica";
import { S6Plataformas } from "./scenes/S6Plataformas";
import { S7Celular } from "./scenes/S7Celular";
import { S8Logo } from "./scenes/S8Logo";

const f = (s: number) => Math.round(s * FPS);

// Segundo del pico dentro de cada archivo (igual que src/audio/sfxMap.js de la página)
const PEAK: Record<string, number> = {
  "projector-draw": 3.34, "camera-flash": 0.02, shutter: 0.05, "click-1": 1.66, "click-2": 0.1, "click-3": 0.05,
  "ui-click-soft": 0.05, "ui-cli": 0.05, "ui-aparicion-1": 0.05, "ui-aparicion-3": 0.05, "ui-aparicion-4": 0.05,
  burbuja: 0.05, "ui-down": 0.05, "beep-gleam": 0.1, coins: 0.15, woosh: 0.5, "woosh-2": 0.58, "woosh-rapido": 0.46,
  "woosh-fast": 0.43, "woosh-bomb": 0.14, glitch: 0.05, "glitch-ligero": 0.05, "pop-1": 0.05, "pop-2": 0.05, "pop-3": 0.05,
  "spin-beep": 0.8,
};

// Un efecto por acción y NINGUNO se repite en el video. t = segundo de la acción.
const SFX: { t: number; sfx: string; gain: number }[] = [
  { t: 0.12, sfx: "woosh-fast", gain: 0.5 }, // entra el teléfono
  { t: 2.24, sfx: "ui-aparicion-1", gain: 0.55 }, // vistas
  { t: 2.97, sfx: "pop-1", gain: 0.55 }, // retención
  { t: 4.68, sfx: "ui-cli", gain: 0.6 }, // se marcan los silencios
  { t: 5.02, sfx: "shutter", gain: 0.4 }, // corte
  { t: 5.15, sfx: "woosh-rapido", gain: 0.35 }, // se juntan los clips
  { t: 5.65, sfx: "glitch-ligero", gain: 0.8 }, // fuera muletillas
  { t: 6.42, sfx: "ui-aparicion-3", gain: 0.45 }, // escena de subtítulos
  { t: 7.2, sfx: "click-1", gain: 0.8 }, // "palabra"
  { t: 7.74, sfx: "click-2", gain: 0.55 }, // "por"
  { t: 8.36, sfx: "click-3", gain: 0.55 }, // "palabra"
  { t: 9.55, sfx: "projector-draw", gain: 0.4 }, // se dibuja la curva
  { t: 9.97, sfx: "pop-2", gain: 0.45 }, // keyframes
  { t: 10.58, sfx: "coins", gain: 0.4 }, // cifra
  { t: 11.17, sfx: "beep-gleam", gain: 0.6 }, // brillo "motion graphics"
  { t: 11.8, sfx: "woosh-2", gain: 0.38 }, // cambio de voz
  { t: 12.22, sfx: "ui-aparicion-4", gain: 0.45 }, // música
  { t: 13.05, sfx: "pop-3", gain: 0.38 }, // efectos
  { t: 13.9, sfx: "spin-beep", gain: 0.45 }, // gira a vertical
  { t: 15.77, sfx: "burbuja", gain: 0.55 }, // TikTok
  { t: 16.55, sfx: "ui-click-soft", gain: 1.0 }, // Reels
  { t: 17.13, sfx: "glitch", gain: 0.75 }, // Shorts
  { t: 18.25, sfx: "camera-flash", gain: 0.5 }, // grabar
  { t: 19.86, sfx: "woosh-bomb", gain: 0.28 }, // entra el logo
  { t: 20.1, sfx: "ui-down", gain: 0.5 }, // caen los puntos de la ü
];

const scene = (key: keyof typeof SCENES, extra = 0.25) => ({ from: f(SCENES[key][0]), durationInFrames: f(SCENES[key][1] - SCENES[key][0] + extra) });

export const NuvoEdicion: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence name="Inicio" {...scene("hook")}><S1Hook /></Sequence>
    <Sequence name="Silencios" {...scene("silencios")}><S2Silencios /></Sequence>
    <Sequence name="Subtítulos" {...scene("subtitulos")}><S3Subtitulos /></Sequence>
    <Sequence name="Motion" {...scene("motion")}><S4Motion /></Sequence>
    <Sequence name="Música y formato" {...scene("musica")}><S5Musica /></Sequence>
    <Sequence name="Plataformas" {...scene("plataformas")}><S6Plataformas /></Sequence>
    <Sequence name="Celular" {...scene("celular")}><S7Celular /></Sequence>
    <Sequence name="Logo" {...scene("logo", 0)}><S8Logo /></Sequence>
    <Sequence name="Cambio de voz" from={f(HANDOFF[0])} durationInFrames={f(HANDOFF[1] - HANDOFF[0])}><Handoff /></Sequence>
    <Header />
    <Subtitles />
    <Timeline />

    {/* Voz: primera mitad Richard, segunda Daniela (ya unidas en voz.wav) */}
    <Audio src={staticFile("voz.wav")} />
    {SFX.map((s) => {
      const peak = PEAK[s.sfx] || 0;
      const lead = Math.min(peak, 0.25); // si el pico está muy adentro, se salta el principio del archivo
      return (
        <Sequence key={s.sfx} name={`sfx ${s.sfx}`} from={f(s.t - lead)} layout="none">
          <Audio src={staticFile(`sfx/${s.sfx}.mp3`)} volume={s.gain} trimBefore={f(peak - lead)} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const DURATION = f(TOTAL);
