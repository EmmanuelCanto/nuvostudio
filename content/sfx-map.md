# Mapa de efectos de sonido por escena (basado en guia-efectos-de-sonido.md)

> Nota: `projector-draw` se renombró a `woosh-proyector` (es un woosh) y ya no se usa. Tampoco se usa ningún otro woosh.

Regla general: sonido = acción visual. Cada aparición, trazo o corte suena. Variar versiones en repeticiones.
Los archivos están en `public/audio/sfx/` (ya normalizados). `peak` = segundo del pico dentro del archivo: el audio se dispara en (t − peak) para que el pico caiga en la acción.

| Archivo (sin .mp3) | Origen en tu carpeta | peak (s) | Uso |
| --- | --- | --- | --- |
| woosh-proyector | Analog Transitions - Film Projector Logo Delayed | 3.34 | líneas que se dibujan A→B (curvas, trazos largos) |
| camera-flash | CAMERA FLASH (2) | 0.02 | flash / aparición fuerte |
| shutter | camera sound | 0.05 | cortes de clip |
| click-1 / click-2 / click-3 | click rotativo 1/2/3 | 1.66 / 0.1 / 0.05 | taps por palabra, keyframes, rombos |
| ui-click-soft | UIClick-Soft (Elevenlabs) | 0.05 | clic de cursor, botón play |
| ui-cli | ui cli | 0.05 | aparición de elementos (variar con los de abajo) |
| ui-aparicion-1..4 | ui sound aparicion / sfx aparicion / 3 / 4 | 0.05 | aparición de tarjetas y pastillas |
| burbuja | burbuja | 0.05 | aparición de pastillas (variar) |
| ui-down | ui sond down | 0.05 | elementos que desaparecen / salida de escena |
| beep-gleam | Beep_Gleam_01 | 0.1 | cierres, nodo IA que se enciende, confirmación |
| coins | coins progresivo | 0.15 | contadores que suben (velocidad 98, +120, 4.9) |
| riser-reverse | Reverse_FX_High_01 | 0.93 | subida antes de un corte o revelación |
| woosh / woosh-2 / woosh-rapido / woosh-fast / woosh-bomb | woosh… | 0.50 / 0.58 / 0.46 / 0.43 / 0.14 | transiciones, entrada del celular, golpe de texto |
| typing | typing ios | 0 | texto que se escribe (loop mientras teclea) |
| glitch / glitch-ligero | pequeño glitch / ui sound glitch ligero | 0.05 | flicker, cambio de clip |
| pop-1..3 | bubble-pop 1_1..3 | 0.05 | estrellas que se llenan |
| spin-beep | Spin_Beep_02 (recortado) | 0.8 | ondas NFC |

## Escena por escena (t en segundos del ciclo de cada escena)

**Hero (10.5 s):** 0.0 click-3 (rombo inicio) · 0.4 woosh-proyector (curva, con fade) · pastillas: ui-aparicion-1, burbuja, ui-cli, ui-aparicion-3 (una por pastilla, en el instante en que aparece) · keyframes click-2 · 9.3 ui-down (salida).

**Motion / editor (9 s):** 0.1 ui-cli (figura aparece) · 0.5 riser-reverse (empieza el recorrido) · 1.3 woosh-fast (curva de velocidad) · 3.5–4.1 click-3 por palabra ("Tu", "idea,", "en", "movimiento") · keyframes del timeline click-2 · 4.6 beep-gleam (cambio a azul).

**Edición (sin voz, 9 s):** cambios de clip (3.0 y 6.0) shutter + glitch-ligero · cada palabra del subtítulo click-3 / click-2 alternados · línea 0.9 woosh-proyector · contador coins.
**Edición (con voz):** igual, pero las palabras siguen el JSON del audio; un tap por palabra clave solamente (para no ensuciar la voz), y la música baja a 0.15.

**Voces (13.5 s):** 0.2 ui-aparicion-2 (tarjeta 01) · 0.5–2.4 riser-reverse (onda escaneando) · 2.5 ui-aparicion-4 (tarjeta 02) · 2.8–5.8 typing en loop · 6.0 woosh-proyector (líneas hacia IA) · 6.9 beep-gleam (IA se enciende) · 8.2 woosh (línea a salida) · 8.9 ui-aparicion-1 (tarjeta 04) · 9.3 ui-click-soft (play).
**Voces (con audios reales):** paso 01 reproduce voz-entrada-original.mp3; paso 04 reproduce voz-salida-clonada.mp3 con subtítulos del JSON. Los SFX de aparición se mantienen; typing se mantiene.

**Web (11 s):** 0.2–3 woosh-proyector (wireframe) · 3.3–4.3 click-1 (relleno de bloques, un click por bloque, alternar click-2) · 5.9 ui-click-soft (clic del cursor) · 6.4 woosh-fast (entra el celular) · 7.3 coins (velocidad sube) · 8.8 beep-gleam (98).

**Marketing (13 s):** 0.3 woosh-2 (entra el teléfono) · 1.5 spin-beep (ondas NFC) · 2.1 ui-aparicion-3 (mensaje "Deja tu reseña") · 3.3–4.4 pop-1/2/3 por estrella · 3.3 coins (4.9) · 5.2 woosh-proyector (curva) · pastillas burbuja / ui-cli / ui-aparicion-1 · 6.4 coins (+120 / x3).

**Perfiles (3.4 s):** 0.2 woosh-proyector · nodos click-2 · etiquetas ui-cli.

**Música:** `music/fondo-inspiring.mp3` en loop, volumen 0.18 (más bajo que cualquier SFX), entra con fade de 1.5 s al activar Sonido, baja a 0.08 mientras suena una voz.
