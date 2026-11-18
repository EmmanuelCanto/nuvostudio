# Guiones para las voces de nüvo

Guarda cada audio terminado en `public/audio/voz/` con el **nombre exacto** que se indica. En cuanto estén ahí (y sus `.json` de tiempos, ver el final), la página muestra sola los botones para escuchar. Mientras no existan, las secciones siguen con su animación muda.

Las palabras entre `*asteriscos*` son **palabras clave**: en el subtítulo salen grandes en cursiva y cada una suena con un efecto distinto, sin repetirse. **No escribas los asteriscos en el generador de voz**, solo aquí.

Cada guion tiene dos partes:
- **El guion** (líneas con `>`): es el texto "oficial". El script de subtítulos lo usa para escribir bien cada palabra. No lleva etiquetas.
- **El texto para Eleven v4**: el mismo guion con **etiquetas de actuación** entre corchetes, para pegar en ElevenLabs. Las etiquetas no se pronuncian: le indican a la voz cómo decir cada parte, para que no suene plana.

### Cómo funcionan las etiquetas en Eleven v4
- Van entre corchetes **en inglés** (así las entiende mejor el modelo) y afectan a lo que viene después: `[warmly] Hola, mi amor.`
- **Emoción:** `[warmly]`, `[excited]`, `[confident]`, `[tender]`, `[nostalgic]`, `[emotional]`.
- **Ritmo y volumen:** `[pause]`, `[short pause]`, `[slowly]`, `[rushed]`, `[softly]`, `[whispers]`.
- **Reacciones humanas:** `[sighs]`, `[chuckles]`, `[laughs softly]`, `[smiles]`.
- **Puntuación:** los puntos suspensivos (…) hacen pausas naturales, las comas marcan respiraciones y una palabra en MAYÚSCULAS se enfatiza.
- **Menos es más:** una o dos etiquetas por frase. Demasiadas suenan actuadas.
- Si una etiqueta no se nota, baja la **estabilidad**: con estabilidad baja la voz responde más a las etiquetas; con alta suena más pareja.
- Genera 3 o 4 tomas de cada guion y quédate con la mejor: cada toma sale un poco distinta.

---

## 1. Edición de video — "Así editamos tus videos"

**Ya está hecho:** con las voces de Richard (primera mitad) y Daniela (segunda) se armó el video `public/videos/edicion-nuvo.mp4` (proyecto de Remotion en `video/nuvo-video`). Los subtítulos van dentro del video, así que ya no hace falta generar `edicion-hombre`/`edicion-mujer` ni sus `.json`.

Suena en la sección **Edición de video**, sobre el celular animado. El visitante elige **Hombre** o **Mujer** y los subtítulos aparecen palabra por palabra, sincronizados con el audio. Dura unos 18 a 22 segundos.

**Archivos:** `edicion-hombre.mp3` y `edicion-mujer.mp3` (el mismo guion con las dos voces)

> Así editamos tus videos para que *nadie* deje de verlos.
> Quitamos silencios y muletillas, ponemos subtítulos *palabra por palabra*
> y animamos lo que dices con *motion graphics*.
> Música, efectos y formato vertical, listo para *TikTok*, *Reels* y *Shorts*.
> Tú grabas con tu celular. En *nüvo* hacemos el resto.

**Texto para Eleven v4** (el mismo para hombre y para mujer; "nüvo" escrito "nuvo" para que lo pronuncie bien):

```
[confident] Así editamos tus videos… para que NADIE deje de verlos. [short pause]
[upbeat] Quitamos silencios y muletillas, ponemos subtítulos palabra… por… palabra, [pause] y animamos lo que dices con motion graphics.
[energetic] Música, efectos y formato vertical: listo para TikTok, Reels y Shorts.
[pause] [warmly] Tú grabas con tu celular. [smiles] En nuvo… hacemos el resto.
```

**Dirección de voz:** cercana y con energía, como alguien que te explica algo en un reel, no como comercial de radio. "Palabra… por… palabra" lento, casi marcando cada palabra; "TikTok, Reels y Shorts" un poco más rápido, como lista; el cierre con una sonrisa.

**Ajustes sugeridos:** modelo **Eleven v4**, voz en español de México de la *Voice Library* (busca "Mexican Spanish", estilo conversacional o de redes sociales), estabilidad baja a media para que respondan las etiquetas, velocidad normal. Exporta MP3 44.1 kHz. Para hombre y mujer elige voces de energía parecida, para que se sientan de la misma marca.

---

## 2. Voces que regresan — demo de clonación

La animación muestra cuatro pasos. Para la demo real se necesitan **dos audios**: el "antes" (la voz original de una señora adulta, tal como la conservaría una familia) y el "después" (la voz clonada diciendo un mensaje nuevo, clara).

**Antes de grabar:** pídele a la señora su **consentimiento por escrito** para clonar su voz y usarla como demostración en la página. La página ya aclara que es una recreación con IA.

### 2a. Audio de entrada (voz original de una señora adulta)

**Archivo para la página:** `voz-entrada-original.mp3`, de **15 a 25 segundos**. Es lo que se escucha en el paso 01. Puede sonar como una nota de voz casera (un poco de ambiente está bien: así se nota la diferencia con el resultado).

**Para clonar la voz** necesitas otra grabación más larga y más limpia, de **1 a 3 minutos**, que no se publica. Pídele que lea con calma, como si le hablara a alguien de su familia, en un cuarto sin eco ni ruido, con el celular a unos 20 cm de la boca:

> Hola, mi amor. Ya es tarde y todavía no me has llamado.
> Acuérdate de comer bien y de abrigarte, que está haciendo frío.
> Mañana te preparo el caldo que te gusta, con su arroz y su limón.
> El domingo vienen tus tíos, a ver si te das una vuelta.
> Fíjate que el rosal del patio ya echó flores otra vez, ¡y bien bonitas!
> Yo aquí sigo, con mis novelas y mi cafecito de la tarde.
> Cuídate mucho, mijo. Te mando un abrazo muy fuerte y mi bendición.

Si quieres más material para que el clon salga mejor, pídele que además platique libremente un minuto: cómo era su casa de niña, una receta, un consejo. Lo natural clona mejor que lo leído.

Para la página, recorta de 15 a 25 segundos de esa lectura (por ejemplo, las tres primeras frases) y guárdalos como `voz-entrada-original.mp3`.

### 2b. Mensaje con la voz clonada (resultado)

Este es el texto que se "teclea" en el paso 02 y que se escucha en el paso 04 con la voz clonada, con subtítulos sincronizados. **Debe coincidir** con `voices.voces.texto` en `src/data/site.js` (si lo cambias aquí, cámbialo allá).

**Archivo del resultado:** `voz-salida-clonada.mp3`

> Feliz cumpleaños, mi niña. Aunque ya no esté a tu lado, *siempre* estoy contigo.

**Cómo generarlo, paso a paso:**
1. Limpia la grabación larga (2a) con un aislador de voz (ElevenLabs *Voice Isolator*, Adobe *Enhance Speech* o similar) para quitar ruido y eco.
2. Crea el clon (ElevenLabs *Instant Voice Cloning* o *Professional Voice Cloning*) con ese audio limpio. Confirma que tienes el permiso de la persona: la plataforma lo pide.
3. Genera el texto con el clon usando la versión con etiquetas de abajo (ajustes ahí mismo).
4. Escucha varias tomas y quédate con la más natural. Exporta MP3 44.1 kHz.

**Texto para Eleven v4** (con la voz clonada de la señora):

```
[softly] [warmly] Feliz cumpleaños, mi niña. [pause] [tender] Aunque ya no esté a tu lado… [emotional] [slowly] siempre estoy contigo.
```

**Dirección de voz:** cálida y serena, despacio, como abuela que habla con cariño. Pausa después de "niña" y otra antes de "siempre". Que suene emotiva pero entera, sin llanto: la familia debe sentir calma al escucharla. Si sale demasiado dramática, quita `[emotional]`; si sale plana, baja la estabilidad.

**Ajustes para la voz clonada:** modelo **Eleven v4**; similitud alta para que se parezca lo más posible a la señora; estabilidad media (si es muy baja el clon puede perder parecido). Prueba también sin etiquetas: con algunos clones suena más natural solo con la puntuación.

---

## 3. Motion graphics (opcional)

**Archivos:** `motion-hombre.mp3` y `motion-mujer.mp3` (unos 10 segundos)

> Lo que dices, en *movimiento*.
> Líneas, cifras y texto que aparecen justo a tiempo, para un video que se entiende en *segundos*.

```
[confident] Lo que dices… en movimiento. [pause] [upbeat] Líneas, cifras y texto que aparecen justo a tiempo, para un video que se entiende en segundos.
```

---

## 4. Sitios web (opcional)

**Archivos:** `web-hombre.mp3` y `web-mujer.mp3`

> Una página que carga *rápido*, se ve bien en el celular
> y lleva a tus clientes directo a tu *WhatsApp*.

```
[friendly] Una página que carga RÁPIDO, [short pause] se ve bien en el celular… [warmly] y lleva a tus clientes directo a tu WhatsApp.
```

---

## Resumen de archivos en `public/audio/voz/`

| Archivo | Obligatorio | Para qué |
| --- | --- | --- |
| `edicion-hombre.mp3` | Sí | Edición de video, voz de hombre |
| `edicion-mujer.mp3` | Sí | Edición de video, voz de mujer |
| `voz-entrada-original.mp3` | Sí | Voces, paso 01 (voz original, 15–25 s) |
| `voz-salida-clonada.mp3` | Sí | Voces, paso 04 (voz clonada, clara) |
| `motion-*`, `web-*` | No | Locuciones opcionales (aún sin usar en la página) |

## Sincronizar los subtítulos

No se puede hacer en tiempo real: se calcula una vez por audio y queda guardado en un `.json` junto al MP3 (en qué segundo empieza y termina cada palabra). Dos opciones:

- **Mándale los MP3 a Claude** y él genera los `.json`.
- **O hazlo tú en tu Mac:** `python3 scripts/align.py` (ver `scripts/README.md`).

Si alguna palabra queda desfasada, se corrige a mano en el `.json` (son segundos). También puedes fijar el efecto de una palabra con `"sfx": "nombre-del-efecto"`, o silenciarla con `"sfx": ""`.
