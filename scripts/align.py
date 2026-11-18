#!/usr/bin/env python3
"""
Genera los archivos de sincronización (cues) palabra por palabra para la web.

Uso:
  python3 scripts/align.py                       # procesa todos los mp3 de public/audio/voz/
  python3 scripts/align.py edicion-hombre        # solo uno (sin extensión)

Para cada  public/audio/voz/<nombre>.mp3  escribe  public/audio/voz/<nombre>.json  con:
  {
    "audio": "/audio/voz/<nombre>.mp3",
    "duration": 19.8,
    "words": [ {"w": "Así", "s": 0.00, "e": 0.28, "k": false}, ... ]
  }
"k": true marca palabra clave (las que van entre *asteriscos* en content/guiones.md).

Requisitos (una sola vez, en tu Mac):
  pip3 install pywhispercpp
  ffmpeg instalado (brew install ffmpeg)
  Modelo: ~/Music/recursos/ggml-small.bin  (ya lo tienes) o cambia MODEL abajo.

Cómo funciona:
  1. Transcribe el audio con Whisper con tiempos por palabra.
  2. Alinea esas palabras con el guion de content/guiones.md (así se conserva la ortografía
     correcta, los acentos y las palabras clave) usando difflib.
  3. Si una palabra del guion no se reconoció, reparte el tiempo entre las vecinas.
"""
import json, os, re, sys, subprocess, difflib, tempfile, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOZ = os.path.join(ROOT, 'public', 'audio', 'voz')
GUIONES = os.path.join(ROOT, 'content', 'guiones.md')
MODEL = os.path.expanduser('~/Music/recursos/ggml-small.bin')

# Qué guion corresponde a cada archivo (prefijo del nombre -> encabezado de sección en guiones.md)
SECCION = {
    'edicion': '## 1.',
    'voz-salida-clonada': '### 2b.',
    'voz-entrada-original': '### 2a.',
    'motion': '## 3.',
    'web': '## 4.',
    'marketing': '## 5.',
}

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9ñ]', '', w)

def guion_para(nombre):
    txt = open(GUIONES, encoding='utf-8').read()
    key = next((k for k in SECCION if nombre.startswith(k)), None)
    if not key:
        return None
    i = txt.index(SECCION[key])
    # el bloque termina en el siguiente encabezado de igual o mayor nivel (## o ###)
    ends = [k for k in (txt.find('\n## ', i + 3), txt.find('\n### ', i + 3)) if k > 0]
    j = min(ends) if ends else -1
    bloque = txt[i:j if j > 0 else None]
    lineas = [l[2:] for l in bloque.splitlines() if l.startswith('> ')]
    if key == 'voz-entrada-original':
        pass  # usa el texto sugerido; si grabaron otra cosa, igual funciona con Whisper solo
    out, dentro = [], False
    for l in lineas:
        for tok in l.split():
            starts, ends = tok.startswith('*'), tok.rstrip('.,;:!?').endswith('*') or tok.endswith('*')
            clean = tok.replace('*', '')
            if starts and ends:
                out.append({'w': clean, 'k': True}); continue
            if starts:
                dentro = True
            out.append({'w': clean, 'k': dentro or starts})
            if ends:
                dentro = False
    return out

def transcribir(mp3):
    from pywhispercpp.model import Model
    wav = tempfile.mktemp(suffix='.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ar', '16000', '-ac', '1', wav], check=True)
    m = Model(MODEL, n_threads=4)
    segs = m.transcribe(wav, language='es', token_timestamps=True, max_len=1, split_on_word=True)
    words = []
    for s in segs:
        t = s.text.strip()
        if not t or not norm(t):
            continue
        words.append({'w': t, 's': s.t0 / 100.0, 'e': s.t1 / 100.0})
    os.remove(wav)
    return words

def duracion(mp3):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout.strip())

def alinear(guion, rec):
    """Asigna a cada palabra del guion el tiempo de la palabra reconocida más parecida."""
    a = [norm(p['w']) for p in guion]
    b = [norm(p['w']) for p in rec]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    res = [None] * len(guion)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1):
                res[i1 + k] = (rec[j1 + k]['s'], rec[j1 + k]['e'])
        elif tag == 'replace':
            n, span = i2 - i1, rec[j1:j2]
            t0, t1 = span[0]['s'], span[-1]['e']
            for k in range(n):
                res[i1 + k] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
    # rellenar huecos (insert) repartiendo entre vecinos conocidos
    for i, r in enumerate(res):
        if r is not None:
            continue
        j = i
        while j < len(res) and res[j] is None:
            j += 1
        prev_e = res[i - 1][1] if i > 0 else 0.0
        next_s = res[j][0] if j < len(res) else prev_e + 0.4 * (j - i)
        n = j - i
        for k in range(n):
            res[i + k] = (prev_e + (next_s - prev_e) * k / n, prev_e + (next_s - prev_e) * (k + 1) / n)
    return [{'w': g['w'], 's': round(s, 2), 'e': round(e, 2), 'k': g['k']} for g, (s, e) in zip(guion, res)]

def procesar(nombre):
    mp3 = os.path.join(VOZ, nombre + '.mp3')
    if not os.path.exists(mp3):
        print('no existe', mp3); return
    print('Transcribiendo', nombre, '...')
    rec = transcribir(mp3)
    guion = guion_para(nombre)
    words = alinear(guion, rec) if guion else [dict(r, k=False) for r in rec]
    data = {'audio': '/audio/voz/' + nombre + '.mp3', 'duration': round(duracion(mp3), 2), 'words': words}
    with open(os.path.join(VOZ, nombre + '.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('  ->', nombre + '.json', len(words), 'palabras')

if __name__ == '__main__':
    os.makedirs(VOZ, exist_ok=True)
    nombres = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(VOZ) if f.endswith('.mp3'))
    if not nombres:
        print('Pon tus MP3 en public/audio/voz/ y vuelve a correr este script.')
    for n in nombres:
        procesar(n)
    print('Listo. Revisa los .json y corrige a mano cualquier tiempo si hace falta.')
