import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Paleta de la página de nüvo
export const C = {
  navy: "#050B24",
  navy2: "#0A1F5C",
  blue: "#0658F9",
  nuvo: "#2F7DF6",
  bright: "#4D8BFF",
  sky: "#7FA8FF",
  white: "#FBFCFF",
  paper: "#F7F7F3",
  ink: "#0B0B14",
  amber: "#F2B35E",
  red: "#FF4D4D",
  mute: "#B7C3E6",
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 23.5; // segundos

export const SANS = "Inter Tight";
export const SERIF = "Instrument Serif";
export const BRAND = "Tenor Sans";

loadFont({ family: SANS, url: staticFile("fonts/inter-tight-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: SANS, url: staticFile("fonts/inter-tight-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: SANS, url: staticFile("fonts/inter-tight-latin-600-normal.woff2"), weight: "600" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-latin-400-italic.woff2"), weight: "400", style: "italic" });
loadFont({ family: BRAND, url: staticFile("fonts/tenor-sans-latin-400-normal.woff2"), weight: "400" });

// Curvas de la página: --ease y una salida suave
export const EASE = Easing.bezier(0.65, 0, 0.35, 1);
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

// Progreso 0..1 entre los segundos a y b (tiempo absoluto del video)
export const p = (t: number, a: number, b: number, easing = OUT) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// Escenas: inicio y fin en segundos absolutos (alineados con la voz)
export const SCENES = {
  hook: [0, 4.2],
  silencios: [4.2, 6.3],
  subtitulos: [6.3, 9.4],
  motion: [9.4, 11.95],
  musica: [11.95, 15.05],
  plataformas: [15.05, 17.9],
  celular: [17.9, 19.8],
  logo: [19.8, TOTAL],
} as const;

export const CLIP_LABELS: { key: keyof typeof SCENES; label: string }[] = [
  { key: "hook", label: "Inicio" },
  { key: "silencios", label: "Cortes" },
  { key: "subtitulos", label: "Subs" },
  { key: "motion", label: "Motion" },
  { key: "musica", label: "Música" },
  { key: "plataformas", label: "Formatos" },
  { key: "celular", label: "Grabas" },
  { key: "logo", label: "nüvo" },
];
