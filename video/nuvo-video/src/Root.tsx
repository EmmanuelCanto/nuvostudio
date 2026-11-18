import React from "react";
import { Composition, Folder } from "remotion";
import { DURATION, NuvoEdicion } from "./NuvoEdicion";
import { FPS, HEIGHT, SCENES, WIDTH } from "./theme";
import { S1Hook } from "./scenes/S1Hook";
import { S2Silencios } from "./scenes/S2Silencios";
import { S3Subtitulos } from "./scenes/S3Subtitulos";
import { S4Motion } from "./scenes/S4Motion";
import { S5Musica } from "./scenes/S5Musica";
import { S6Plataformas } from "./scenes/S6Plataformas";
import { S7Celular } from "./scenes/S7Celular";
import { S8Logo } from "./scenes/S8Logo";

const d = (k: keyof typeof SCENES) => Math.round((SCENES[k][1] - SCENES[k][0]) * FPS);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NuvoEdicion" component={NuvoEdicion} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={DURATION} />
    <Folder name="Escenas">
      <Composition id="S1-Inicio" component={S1Hook} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("hook")} />
      <Composition id="S2-Silencios" component={S2Silencios} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("silencios")} />
      <Composition id="S3-Subtitulos" component={S3Subtitulos} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("subtitulos")} />
      <Composition id="S4-Motion" component={S4Motion} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("motion")} />
      <Composition id="S5-Musica" component={S5Musica} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("musica")} />
      <Composition id="S6-Plataformas" component={S6Plataformas} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("plataformas")} />
      <Composition id="S7-Celular" component={S7Celular} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("celular")} />
      <Composition id="S8-Logo" component={S8Logo} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={d("logo")} />
    </Folder>
  </>
);
