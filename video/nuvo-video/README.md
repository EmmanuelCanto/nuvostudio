# Video "Así editamos tus videos" — nüvo

Motion graphics vertical (1080×1920, 30 fps, 23.5 s) para la sección **Edición de video** de la página.
La primera mitad la narra **Richard** y la segunda **Daniela**. Los subtítulos van integrados en el video.

## Editar y previsualizar
```bash
npm install
npm run dev          # abre Remotion Studio
```

## Renderizar
```bash
npx remotion render NuvoEdicion out/nuvo-como-editamos.mp4 --codec=h264 --crf=18
```
Versión ligera para la página (720×1280, volumen normalizado):
```bash
ffmpeg -i out/nuvo-como-editamos.mp4 -vf scale=720:1280 -c:v libx264 -crf 23 -preset slow \
  -af "loudnorm=I=-14:TP=-1.5" -c:a aac -b:a 128k -movflags +faststart ../../public/videos/edicion-nuvo.mp4
```

## Dónde está cada cosa
- `src/theme.ts`: colores, tipografías y **tiempos de cada escena** (`SCENES`).
- `src/scenes/`: una escena por archivo (S1 Inicio … S8 Logo) y `Handoff.tsx` (el cambio de voz: el diamante se vuelve círculo).
- `src/components.tsx`: fondo, encabezado, subtítulos, línea de tiempo, logo, teléfono.
- `src/NuvoEdicion.tsx`: une todo, la voz y los **efectos de sonido** (uno por acción, ninguno repetido).
- `src/data.ts`: tiempos de cada palabra y forma de onda (generados de la voz).
- `public/voz.wav`: voz ya unida (Richard hasta "motion graphics", Daniela desde "Música").
- `audio/`: los dos audios originales de ElevenLabs.
