/*
  ============================================================
  NÜVO — GUÍA RÁPIDA PARA EDITAR
  Este es el ÚNICO archivo que necesitan tocar para cambiar
  textos de relleno, precios, preguntas, perfiles y videos.
  Busca (Ctrl+F) el carácter "[" para encontrar todos los
  textos de relleno que deben reemplazar:
    [WhatsApp],
    [correo@agencia.com], [Ciudad], [Año], [Empresa o cliente], etc.
  Los enlaces de WhatsApp usan https://wa.me/520000000000
  (reemplacen 520000000000 por 52 + su número a 10 dígitos).
  Las escenas animadas marcadas "Ejemplo ilustrativo" no son
  resultados reales: cámbienlas cuando tengan datos propios.

  Archivos:
    Videos  -> carpeta public/videos/   (y escribe el nombre en `videos` abajo)
    CV PDF  -> carpeta public/cv/       (y escribe la ruta en `cvUrl` de cada fundador)
    Voces   -> carpeta public/audio/voz/ (ver content/guiones.md y scripts/README.md)
  ============================================================
*/

// Reemplaza 520000000000 por 52 + tu número a 10 dígitos
export const whatsappNumber = '520000000000';
export const whatsappUrl = 'https://wa.me/' + whatsappNumber;

export const contact = {
  whatsappLabel: '[WhatsApp]',          // texto que se muestra (ej. "+52 55 1234 5678")
  email: 'correo@agencia.com',          // correo real (para el enlace mailto:)
  emailLabel: '[correo@agencia.com]',   // texto que se muestra
  city: '[Ciudad]',
  year: '[Año]',                        // pie de página: © [Año] nüvo
};

export const titles = {
  home: 'nüvo — Estudio de edición de video',
  'perfil-1': 'Emmanuel Canto · nüvo',
  'perfil-2': 'María José Hernández · nüvo',
};

// Barra de navegación
export const nav = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#edicion', label: 'Edición' },
  { href: '#portafolio', label: 'Videos' },
  { href: '#paquetes', label: 'Paquetes' },
  { href: '#voces', label: 'Voces' },
  { href: '#precios', label: 'Precios' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#faq', label: 'Preguntas' },
];

// Ejemplo ilustrativo de la escena de marketing (no son datos reales)
export const review = { initials: '[N]', business: '[Tu negocio]' };

/* ---------- Galería de videos ----------
   Dos formas de mostrar un video (usa una):
   - src: archivo propio en public/videos/, ej. src: "/videos/mi-video.mp4"
     (se reproduce solo, sin sonido, y con un toque se activa el sonido). Es la opción más ligera y bonita.
   - tiktok: el número del video de TikTok (el que viene en el enlace o en el código de "insertar",
     ej. tiktok.com/player/v1/7705079202566982933 -> tiktok: '7705079202566982933'). Muestra el reproductor de TikTok.
   Sin src ni tiktok se muestra el recuadro "[Sube aquí tu video]".
   cat: "curiosidades" | "poligonos" | "motion" | "camara"   (categorías de los filtros) */
export const videoTabs = [
  { f: 'all', label: 'Todos' },
  { f: 'curiosidades', label: 'Curiosidades' },
  { f: 'motion', label: 'Motion graphics' },
  { f: 'poligonos', label: 'Polígonos del Evangelio' },
  { f: 'camara', label: 'A cámara + motion' },
];
export const videos = [
  { title: 'Lluvia de peces', sub: 'Curiosidades · TikTok', cat: 'curiosidades', tiktok: '7705079202566982933' },
  { title: 'David vs. Goliat', sub: 'Polígonos del Evangelio · TikTok', cat: 'poligonos', tiktok: '7706815052086529301' },
  { title: '[Título del video 1]', sub: 'Puro motion graphics · TikTok', cat: 'motion', src: '' },
  { title: '[Título del video 3]', sub: 'Hablando a cámara · Shorts', cat: 'camara', src: '' },
  { title: '[Título del video 4]', sub: 'Puro motion graphics · Reels', cat: 'motion', src: '' },
  { title: '[Título del video 6]', sub: 'Hablando a cámara · TikTok', cat: 'camara', src: '' },
];

/* ---------- Video de la sección "Edición de video" ----------
   Hecho con Remotion (proyecto en video/nuvo-video). Lleva su propia voz
   (Richard la primera mitad, Daniela la segunda), efectos y subtítulos. */
export const edicionVideo = {
  src: '/videos/edicion-nuvo.mp4',
  poster: '/videos/edicion-nuvo-poster.jpg',
};

/* ---------- Voces (archivos en public/audio/voz/) ----------
   Si los archivos no existen, la página muestra la animación muda de siempre. */
export const voices = {
  // Sección "Voces que regresan": audio original (paso 01) y voz clonada (paso 04).
  voces: {
    original: 'voz-entrada-original',
    clonada: 'voz-salida-clonada',
    // Texto que se escribe en el paso 02. Debe ser el mismo que dice la voz clonada (content/guiones.md, 2b).
    texto: 'Feliz cumpleaños, mi niña. Aunque ya no esté a tu lado, siempre estoy contigo.',
  },
};

/* ---------- Paquetes de edición ---------- */
export const packages = [
  { title: 'Edición', who: 'Tú grabas, nosotros editamos', amount: '$600', per: 'por video de hasta 60 s',
    items: ['Cortes y ritmo', 'Subtítulos animados', 'Música y efectos', 'Paquete de 8 videos: $4,400 MXN'], cta: 'Cotizar edición' },
  { title: 'Edición + motion', who: 'Tus videos con motion graphics', amount: '$1,200', per: 'por video de hasta 60 s',
    items: ['Todo lo de Edición', 'Motion graphics que animan lo que dices', 'Portada del video', 'Paquete de 8 videos: $8,800 MXN'], cta: 'Cotizar edición' },
  { title: 'Plan mensual', who: 'Para negocios que publican seguido', amount: '$8,000', per: 'al mes', hl: true, flag: 'El más completo',
    items: ['8 videos editados al mes', 'Edición con motion graphics', 'Portada para cada video', 'Formatos para cada plataforma', 'Entregas cada semana', 'Prioridad en tiempos de entrega'], cta: 'Quiero un plan' },
  { title: 'Marca personal', who: 'Para quien sale a cámara', amount: '$12,000', per: 'al mes',
    items: ['Todo lo del Plan mensual', '12 videos editados al mes', 'Motion graphics avanzados', 'Subtítulos con el estilo de tu marca'], cta: 'Quiero un plan' },
];

/* ---------- Precios "desde" ---------- */
export const prices = [
  { title: 'Motion graphics', amount: '$2,500', desc: 'Por video de 30 segundos. Animación, música y efectos.',
    items: ['Edición de TikTok, Reels y Shorts', 'Reels y anuncios', 'Explainers', 'Subtítulos'], cta: 'Cotizar video' },
  { title: 'Voces que regresan', amount: '$1,800', desc: 'Mensaje de voz breve. Video homenaje se cotiza aparte.', hl: true, flag: 'Hecho con respeto',
    items: ['Mensaje de voz', 'Audio de recuerdo', 'Consentimiento por escrito'], cta: 'Platicar sin compromiso' },
  { title: 'Página web', amount: '$6,000', desc: 'Landing page para tu negocio, adaptada a celular.',
    items: ['Landing pages', 'Sitios completos', 'Menús digitales'], cta: 'Cotizar página' },
];

/* ---------- Preguntas frecuentes ---------- */
export const faq = [
  { q: '¿Quién debe autorizar la recreación de una voz?',
    a: 'Los familiares más cercanos o herederos de la persona fallecida. Antes de empezar firmamos con ellos un consentimiento sencillo por escrito. Si hay desacuerdo en la familia o no podemos confirmar la autorización, no realizamos el proyecto.' },
  { q: '¿Qué pasa con los audios que les comparto?',
    a: 'Se usan solo para tu proyecto. No los compartimos con nadie y, después de la entrega, los eliminamos junto con el modelo de voz si así lo solicitas. El resultado final es de la familia.' },
  { q: '¿Qué necesitan para recrear una voz?',
    a: 'Notas de voz, videos o grabaciones donde se escuche claramente a la persona. Entre más limpio el audio, mejor el resultado. Revisamos tu material sin costo y te decimos con honestidad si es suficiente.' },
  { q: '¿Pueden usar la voz para una llamada o para hacerse pasar por alguien?',
    a: 'No. Nunca usamos una voz para suplantar, engañar o cometer fraude, y rechazamos cualquier solicitud de ese tipo. Este servicio existe únicamente como homenaje y recuerdo familiar.' },
  { q: '¿Ustedes graban o crean el contenido?',
    a: 'No: somos editores. Tú grabas y decides qué decir; nosotros nos encargamos de que se vea y se escuche increíble, con cortes, subtítulos, motion graphics, música y efectos.' },
  { q: '¿Qué necesito mandar para editar un video?',
    a: 'Tus clips tal como los grabaste (de preferencia en vertical), el audio si lo grabaste aparte, y una idea de lo que quieres decir. Si tienes dudas de cómo grabar, te damos recomendaciones sencillas.' },
  { q: '¿Cuánto tarda un video o una página web?',
    a: 'Como referencia: un video de 30 segundos, de 5 a 7 días hábiles; una landing page, de 1 a 2 semanas. Te confirmamos la fecha exacta en la propuesta.' },
  { q: '¿Cómo se paga?',
    a: 'Normalmente 50% de anticipo y 50% contra entrega, por transferencia. [Confirma aquí tus formas de pago y si emites factura].' },
];

/* ---------- Fundadores / perfiles (CV) ----------
   Cada perfil muestra solo su correo personal (email). El WhatsApp es uno solo, el de la
   empresa (whatsappNumber, arriba), y aparece en la sección Contacto.
   cvUrl: "" muestra la nota "(reemplaza con el enlace a tu PDF)"; cvUrl: null oculta el botón.
          Con cvUrl: "/cv/mi-cv.pdf" el botón "Descargar CV" descarga el archivo
          (ponlo en la carpeta public/cv/). */
export const founders = [
  {
    id: 'perfil-1',
    counter: 'P1',
    ini: 'EC',
    name: 'Emmanuel Canto',
    role: 'Motion Design & Edición de video',          // tarjeta y pie del CV
    roleParts: ['Motion Design', 'Edición de video'],   // título del CV: "Motion Design <y> Edición de video"
    cofounder: 'Cofundador de nüvo.',
    email: 'emmanuel-canto@hotmail.com',
    bio: 'Ingeniero de software y editor de video. Después de cinco años desarrollando sitios y sistemas web, hoy combino ese lado técnico con la edición: motion graphics, subtítulos animados y diseño de sonido para videos que se entienden a la primera. Edito los videos de mi propio perfil de TikTok y del canal Polígonos del Evangelio.',
    cvUrl: null,   // null = sin botón de CV
    // Curva de trayectoria (3 etapas). yr / nm / sub son los textos; sub es opcional.
    career: [
      { yr: '2019', nm: 'Desarrollo web', sub: 'Sitios y sistemas a la medida' },
      { yr: '2026', nm: 'TikTok y Polígonos' },
      { yr: '2026 — HOY', nm: 'nüvo' },
    ],
    experience: [
      { when: '2026 — Actualidad', title: 'Cofundador · Motion Design & Edición de video', org: 'nüvo',
        desc: 'Edición de videos para redes: cortes y ritmo, motion graphics, subtítulos animados, diseño de sonido y homenajes de voz.' },
      { when: '2026 — Actualidad', title: 'Creador y editor', org: 'Perfil propio de TikTok',
        desc: 'Videos de curiosidades de principio a fin: guion, edición, motion graphics, subtítulos y sonido.' },
      { when: '2026 — Actualidad', title: 'Editor de video', org: 'Polígonos del Evangelio',
        desc: 'Edición de las historias del canal: ritmo, subtítulos animados, efectos y diseño de sonido.' },
      { when: '2019 — 2026', title: 'Desarrollador Full Stack', org: 'Fidelis Marketing Group, Winjet, Hospital Internacional, Haitek',
        desc: 'Cinco años creando sitios y sistemas web con Laravel, React y Python: la base técnica de las páginas que hacemos en nüvo.' },
    ],
    education: [
      { when: '2018 — 2021', title: 'Lic. en Ingeniería y Desarrollo de Software', org: 'Universidad Interamericana para el Desarrollo' },
      { when: '2015 — 2018', title: 'Técnico en Programación', org: 'CBTis' },
      { when: '2026', title: 'Foundations: Data, Data, Everywhere', org: 'Google · Coursera' },
    ],
    skills: ['Motion graphics', 'Edición de video', 'Subtítulos animados', 'Clonación de voz ética', 'Guion para redes', 'Diseño de sonido'],
    tools: ['CapCut', 'Premiere Pro', 'DaVinci Resolve'],
  },
  {
    id: 'perfil-2',
    counter: 'P2',
    ini: 'MJ',
    name: 'María José Hernández',
    role: 'Social Media & Estrategia digital',
    roleParts: ['Social Media', 'Estrategia digital'],
    cofounder: 'Cofundadora de nüvo.',
    email: 'mariajosehernandezangulo@gmail.com',
    bio: 'Licenciada en Mercadotecnia y Publicidad, con más de seis años gestionando redes sociales, comunidades y campañas en Meta Ads para marcas de distintos sectores. En nüvo me encargo de que cada video conecte con su público: estrategia, copys, métricas y la atención cercana a cada cliente.',
    cvUrl: null,
    career: [
      { yr: '2019', nm: 'Community manager', sub: 'Marcas de distintos sectores' },
      { yr: '2025', nm: 'Magni Digital', sub: 'Social Media y Marketing' },
      { yr: '2026 — HOY', nm: 'nüvo' },
    ],
    experience: [
      { when: '2026 — Actualidad', title: 'Cofundadora · Social Media & Estrategia digital', org: 'nüvo',
        desc: 'Estrategia y seguimiento de cada proyecto, copys, reportes de resultados y atención a clientes.' },
      { when: 'Ago 2025 — Jul 2026', title: 'Gerente de Marketing', org: 'Magni Digital',
        desc: 'Coordinación de la cartera de clientes y del equipo creativo; estrategia de redes en Instagram, Facebook y LinkedIn, calendarios mensuales y reportes de alcance y engagement.' },
      { when: 'Feb — Ago 2025', title: 'Social Media Manager', org: 'Magni Digital',
        desc: 'Programación y publicación en Meta Business Suite, edición de reels, redacción de copys y community management.' },
      { when: 'Jul — Sep 2025', title: 'Editora de contenido', org: 'Concepto Creativo',
        desc: 'Creación y edición de material gráfico para reels, posts y stories.' },
      { when: '2019 — 2025', title: 'Community manager y creadora de contenido', org: 'Petky, Huellitas, Winjet, Moët, Transcaribe y más',
        desc: 'Parrillas de contenido, copys persuasivos, campañas en Meta Ads con reportes por cliente, y fotografía y video de principio a fin.' },
    ],
    education: [
      { when: '2019 — 2023', title: 'Lic. en Mercadotecnia y Publicidad', org: 'Universidad Mesoamericana de San Agustín, Mérida' },
      { when: '2022 — 2023', title: 'Servicio social en investigación de mercado', org: 'Centro de Desarrollo de Negocios, UADY' },
    ],
    skills: ['Social media management', 'Community management', 'Estrategia de contenido', 'Copywriting', 'Meta Ads', 'Edición de reels', 'Análisis de métricas', 'Investigación de mercado'],
    tools: ['Meta Business Suite', 'Meta Ads Manager', 'CapCut', 'Photoshop', 'Illustrator', 'Canva', 'Notion', 'Trello', 'HubSpot', 'Semrush'],
  },
];
