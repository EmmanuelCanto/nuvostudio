# Audio de la página: cómo agregar las voces

## 1. Genera los audios
Sigue `content/guiones.md`. Guarda los MP3 en `public/audio/voz/` con los nombres exactos de la tabla final.

## 2. Sincroniza los subtítulos (una sola vez por audio)
```bash
pip3 install pywhispercpp          # una sola vez
brew install ffmpeg                # si no lo tienes
python3 scripts/align.py           # genera public/audio/voz/<nombre>.json
```
El script usa el modelo `~/Music/recursos/ggml-small.bin` que ya tienes. Si lo mueves, cambia `MODEL` en `scripts/align.py`.

Cada `.json` tiene el tiempo de inicio y fin de cada palabra. Si alguna cae mal, edítala a mano: son segundos.

## 3. Listo
Levanta la página (`npm run dev`) y entra a la sección **Edición de video**: aparece "Escuchar con voz de hombre / mujer" y los subtítulos siguen al audio. En **Voces que regresan** se reproduce el audio original en el paso 01 y la voz clonada en el paso 04, con sus ondas reales.

## Efectos de sonido (SFX)
Ya están en `public/audio/sfx/` (normalizados a −24 dB, pico −2 dB). No hay música de fondo. Las reglas de cuál suena en cada momento están en `src/audio/sfxMap.js`, basadas en `guia-efectos-de-sonido.md`. Regla: dentro de una sección ningún efecto se repite. El visitante los activa con el botón **Sonido** del encabezado (los navegadores no permiten audio sin un clic).
