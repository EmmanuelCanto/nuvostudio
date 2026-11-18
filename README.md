# nüvo — sitio web

Sitio de una sola página (React + Vite) listo para desplegarse en Vercel. Conserva el diseño, los textos y las animaciones de la versión original en un solo HTML, y añade sonido opcional (botón **Sonido**), voces sincronizadas en la sección *Edición de video* y audios reales en *Voces que regresan*.

## Requisitos
- Node.js 18 o superior (recomendado 20+).
- Para generar los subtítulos sincronizados: Python 3, `ffmpeg` y `pywhispercpp` (ver abajo).

## Instalar y correr
```bash
npm install        # una sola vez
npm run dev        # desarrollo: http://localhost:5173
npm run build      # genera la carpeta dist/ lista para publicar
npm run preview    # prueba la versión construida en http://localhost:4173
```

## Dónde editar los textos
Todo lo editable está en **`src/data/site.js`**: número de WhatsApp, correos, ciudad, año, precios, paquetes, preguntas frecuentes, lista de videos de la galería, datos de los dos perfiles (nombre, bio, experiencia, estudios, habilidades, enlace al CV) y nombres de los archivos de voz. Busca el carácter `[` para encontrar los textos de relleno.

Los textos fijos de cada sección viven en `src/components/` (un archivo por sección, con el mismo nombre que la sección). El CSS original está intacto en `src/styles/global.css` (las pocas reglas nuevas están al final, marcadas).

## Dónde poner los archivos
| Qué | Carpeta | Cómo se usa |
| --- | --- | --- |
| Videos de la galería (MP4 vertical) | `public/videos/` | Escribe la ruta en `videos[].src` de `site.js`, ej. `"/videos/mi-video.mp4"`. Con `src: ""` se muestra el recuadro de relleno. |
| CV en PDF | `public/cv/` | Escribe la ruta en `founders[].cvUrl`, ej. `"/cv/nombre.pdf"`. Con `""` el botón no hace nada y se muestra la nota. |
| Voces (MP3 + JSON de tiempos) | `public/audio/voz/` | Ver `content/guiones.md` y `scripts/README.md`. Si faltan, la página muestra la animación muda de siempre. |
| Efectos de sonido y música | `public/audio/sfx/`, `public/audio/music/` | Ya incluidos. Las reglas de qué suena en cada momento están en `src/audio/sfxMap.js`. |

### Voces sincronizadas (opcional)
1. Genera los MP3 siguiendo `content/guiones.md` y guárdalos en `public/audio/voz/` con los nombres indicados (`edicion-hombre.mp3`, `edicion-mujer.mp3`, `voz-entrada-original.mp3`, `voz-salida-clonada.mp3`).
2. Genera los archivos de tiempos por palabra:
   ```bash
   pip3 install pywhispercpp     # una sola vez
   brew install ffmpeg           # si no lo tienes
   python3 scripts/align.py      # crea public/audio/voz/<nombre>.json
   ```
   El script usa el modelo `~/Music/recursos/ggml-small.bin`; si lo mueves, cambia `MODEL` en `scripts/align.py`. Cada JSON tiene el inicio y fin de cada palabra en segundos; se puede corregir a mano.
3. Al existir `edicion-hombre.json` y `edicion-mujer.json` aparece el control "Escuchar con voz de Hombre / Mujer" bajo el celular. Al existir `voz-entrada-original.mp3` y `voz-salida-clonada.json`, los pasos 01 y 04 de *Voces que regresan* reproducen los audios reales con su onda y subtítulos.

## Sonido
El botón **Sonido** del encabezado está apagado por defecto (los navegadores no permiten audio sin un clic). Al activarlo entra la música de fondo en loop (volumen bajo, con fundido) y cada escena dispara sus efectos en el instante de la acción; la música baja mientras suena una voz. No se guarda ninguna preferencia.

## Publicar en Vercel
Opción A — con la CLI:
```bash
npm i -g vercel
vercel          # primera vez: acepta los valores por defecto (framework: Vite)
vercel --prod   # publicar en producción
```
Opción B — desde GitHub: sube el repositorio y en vercel.com elige *Add New → Project → Import*. Vercel detecta Vite (`npm run build`, carpeta `dist`). El archivo `vercel.json` ya incluye la regla para que cualquier ruta cargue `index.html` y caché larga para `/audio` y `/videos`.

## Formulario de contacto
El formulario valida y muestra el mensaje de confirmación en la página, pero **no envía nada a ningún servidor** (igual que el original). Como siguiente paso, puede conectarse a un servicio gratuito como [Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com): en `src/components/Contacto.jsx`, dentro de `onSubmit`, haz un `fetch` a la URL que te den con los datos del formulario. Mientras tanto, el mensaje invita a escribir también por WhatsApp o correo.

## Estructura
```
index.html            entrada de Vite (fuentes de Google, <div id="root">)
src/main.jsx          arranque de React
src/App.jsx           orden de secciones y vistas (inicio, perfil-1, perfil-2)
src/router.js         rutas por hash (#seccion, #perfil-1, #perfil-2)
src/data/site.js      TODO lo editable
src/components/       una sección por archivo + Perfil (CV), Grid, Pill, Ruler
src/scenes/           motor de escenas (useScene) y utilidades de animación
src/audio/            motor de sonido, mapa de efectos, carga de subtítulos
src/styles/global.css CSS original + adiciones
public/               archivos estáticos (audio, videos, cv, favicon)
scripts/align.py      genera los JSON de tiempos por palabra
content/              guiones, mapa de efectos y el HTML original de referencia
```
