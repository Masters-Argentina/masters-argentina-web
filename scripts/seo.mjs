/** Metadata for the public, static pages. Keep the production origin in one place.
 * A future custom-domain migration must update SITE_ORIGIN and its redirects together.
 * Titles, descriptions, H1s, social images and structured data follow the content brief
 * «Contenido SEO para el nuevo sitio · Masters Argentina» (sections 1, 2 and 4).
 */
export const SITE_ORIGIN = 'https://mastersargentina.org';
const CLOUDINARY = 'https://res.cloudinary.com/lzfq7irq/image/upload';
const LOGO_LAYER = 'l_masters-argentina:branding-and-general:masters-logo-hq-d9c0fc269d8f';
/** Brief §2: group photo with the flag (Miami 2026, Wolfe University Center) with the logo, 1200×630. */
export const DEFAULT_IMAGE = `${CLOUDINARY}/c_fill,g_auto,w_1200,h_630/l_text:Arial_200:%E2%80%83%E2%80%83,b_rgb:FFFFFFE6,c_fit,w_340,h_140/fl_layer_apply,g_north_west,x_32,y_32/${LOGO_LAYER}/c_scale,w_290/fl_layer_apply,g_north_west,x_57,y_52/q_auto/f_jpg/v1794327840/masters-argentina/conference-2026/2026-galeria-comunidad-ccb6cb7edd7c.jpg`;
/** Brief §2: a generic 2027 image with the logo until the venue is confirmed; then use the venue photo. */
const CONFERENCE_IMAGE = `${CLOUDINARY}/c_fill,w_1200,h_630/e_colorize:100,co_rgb:F4F1EA/${LOGO_LAYER}/c_scale,w_520/fl_layer_apply,g_center,y_-90/l_text:Arial_68_bold:Conferencia%202027,co_rgb:0B2A3C/fl_layer_apply,g_center,y_90/l_text:Arial_40:Washington%20DC,co_rgb:2E8B8B/fl_layer_apply,g_center,y_170/q_auto/f_jpg/v1794327840/masters-argentina/conference-2026/2026-galeria-comunidad-ccb6cb7edd7c.jpg`;
const SITE_NAME = 'Masters Argentina';

/** Brief §1: title, meta description and H1 per page. */
export const PAGE_COPY = {
  '/': {
    title: 'Masters Argentina · Conferencia de estudiantes argentinos',
    description: 'Comunidad apartidaria de estudiantes argentinos de posgrado en EE.UU. y Europa. Conferencia anual, encuentros por ciudad y newsletter.',
    h1: 'Estudiantes argentinos de posgrado en el mundo, conectados con el país'
  },
  '/quienes-somos/': {
    title: 'Quiénes somos · Masters Argentina',
    description: 'Estudiantes argentinos de posgrado en el exterior que organizan Masters Argentina: misión, equipo y diez años de historia.',
    h1: 'Estudiantes argentinos pensando el desarrollo del país'
  },
  '/conferencia/': {
    title: 'Conferencia Masters Argentina 2027 · Washington DC',
    description: 'La próxima conferencia de Masters Argentina, con sede prevista en Washington DC. Fecha, speakers y entradas, a medida que se confirmen.',
    h1: 'Conferencia Masters Argentina 2027',
    image: CONFERENCE_IMAGE
  },
  '/contacto/': {
    title: 'Contacto · Masters Argentina',
    description: 'Sumate a los eventos, al equipo organizador o al newsletter de Masters Argentina, o escribinos para acompañar la conferencia como sponsor.',
    h1: '¡Ponete en contacto!'
  },
  '/preguntas-frecuentes/': {
    title: 'Preguntas frecuentes · Masters Argentina',
    description: 'Qué es Masters Argentina, cómo es la conferencia, cómo enterarte de las inscripciones y cómo sumarte a la organización.',
    h1: 'Preguntas frecuentes'
  },
  '/prensa/': {
    title: 'Prensa · Masters Argentina',
    description: 'Notas sobre Masters Argentina en Infobae, La Nación, El Cronista, El Observador y otros medios, edición por edición desde 2019.',
    h1: 'Masters Argentina en los medios'
  },
  '/ediciones/': {
    title: 'Ediciones anteriores · Masters Argentina',
    description: 'Once ediciones de Masters Argentina desde 2016: Nueva York, Boston, Chicago, Washington DC y Miami. Lemas, sedes, speakers y sponsors.',
    h1: 'Una historia de encuentros'
  },
  '/ediciones/2026/': {
    title: 'Masters Argentina 2026 en Miami · Talento con impacto',
    description: 'XI edición, 10 y 11 de abril de 2026 en Florida International University: 270 asistentes, 23 speakers y nueve paneles.',
    h1: 'Ponerse la celeste y blanca: talento con impacto'
  },
  '/ediciones/2025/': {
    title: 'Masters Argentina 2025 en Nueva York · ADN Argentino',
    description: 'X edición, 4 y 5 de abril de 2025 en Columbia Business School y el Consulado Argentino en Nueva York: speakers, sedes, agenda y sponsors.',
    h1: 'ADN Argentino: De las Raíces al Potencial'
  },
  '/ediciones/2024/': {
    title: 'Masters Argentina 2024 · Del potencial a la realidad',
    description: 'IX edición, 5 y 6 de abril de 2024 en Nueva York, en Council of the Americas y Columbia Faculty House: 24 speakers, sedes y sponsors.',
    h1: 'Del potencial a la realidad'
  },
  '/ediciones/2023/': {
    title: 'Masters Argentina 2023 en Nueva York · Stop & Go',
    description: 'VIII edición, 15 y 16 de abril de 2023 en Columbia Business School: litio, finanzas, biotecnología y futuro del trabajo.',
    h1: 'Stop & Go'
  },
  '/ediciones/2022/': {
    title: 'Masters Argentina 2022 · Conversaciones improbables',
    description: 'VII edición, 8 al 10 de abril de 2022 en Chicago, en Chicago Booth y Northwestern Kellogg: temario, speakers, sede, agenda y equipo.',
    h1: 'Conversaciones improbables para una Argentina posible'
  },
  '/ediciones/2021/': {
    title: 'Masters Argentina 2021 · Argentina resiliente (virtual)',
    description: 'VI edición, virtual: consensos y adaptación frente a nuevos desafíos. Trabajo, salud, género y tecnología en la agenda.',
    h1: 'Argentina resiliente'
  },
  '/ediciones/2020/': {
    title: 'Masters Argentina Conecta 2020 · Ciclo de webinars',
    description: 'La conferencia de Chicago 2020 se canceló por el COVID-19. En su lugar, cinco webinars solidarios entre junio y julio de 2020.',
    h1: 'Masters Argentina Conecta'
  },
  '/ediciones/2019/': {
    title: 'Masters Argentina 2019 en Washington DC · Capital humano',
    description: 'IV edición, 12 al 14 de abril de 2019 en Georgetown University y la Embajada Argentina: agenda, sponsors, sedes, equipo y prensa.',
    h1: 'Capital humano para la Argentina del futuro'
  },
  '/ediciones/2018/': {
    title: 'Masters Argentina 2018 en Chicago · Competitividad',
    description: 'III edición, 13 al 15 de abril de 2018 en University of Chicago: emprender, producir, innovar y competir desde Argentina.',
    h1: 'Competitividad y nuestro lugar en el mundo'
  },
  '/ediciones/2017/': {
    title: 'Masters Argentina 2017 en Boston · Construyendo Argentina',
    description: 'II edición, 21 al 23 de abril de 2017 en MIT y Harvard: liderazgo, sectores productivos y políticas de Estado para el país.',
    h1: 'Construyendo Argentina'
  },
  '/ediciones/2016/': {
    title: 'Masters Argentina 2016 en Nueva York · La primera edición',
    description: 'I edición, 22 al 24 de abril de 2016 en Columbia University: ¿un cambio o un nuevo ciclo? Reformas, inversiones y economías regionales.',
    h1: 'Argentina: ¿un cambio o un nuevo ciclo?'
  }
};

/** Brief §4: one Event per in-person edition. 2020 and 2021 have no exact dates yet;
 * 2027 waits for confirmed dates and venue. */
const ORDINAL = {2016:'I',2017:'II',2018:'III',2019:'IV',2020:'V',2021:'VI',2022:'VII',2023:'VIII',2024:'IX',2025:'X',2026:'XI'};
const NEW_YORK = {addressLocality:'Nueva York', addressRegion:'NY', addressCountry:'US'};
const CHICAGO = {addressLocality:'Chicago', addressRegion:'IL', addressCountry:'US'};
export const EVENTS = {
  2026: {name:'Masters Argentina 2026: Ponerse la celeste y blanca, talento con impacto', startDate:'2026-04-10', endDate:'2026-04-11',
    place:'Wolfe University Center, Florida International University',
    address:{streetAddress:'11200 SW 8th St', addressLocality:'Miami', addressRegion:'FL', postalCode:'33199', addressCountry:'US'}},
  2025: {name:'Masters Argentina 2025: ADN Argentino, de las raíces al potencial', startDate:'2025-04-04', endDate:'2025-04-05', place:'Columbia Business School', address:NEW_YORK},
  2024: {name:'Masters Argentina 2024: Del potencial a la realidad', startDate:'2024-04-05', endDate:'2024-04-06', place:'Columbia Faculty House', address:NEW_YORK},
  2023: {name:'Masters Argentina 2023: Stop & Go', startDate:'2023-04-15', endDate:'2023-04-16', place:'Columbia Business School', address:NEW_YORK},
  2022: {name:'Masters Argentina 2022: Conversaciones improbables para una Argentina posible', startDate:'2022-04-08', endDate:'2022-04-10', place:'University of Chicago Booth School of Business', address:CHICAGO},
  2019: {name:'Masters Argentina 2019: Capital humano para la Argentina del futuro', startDate:'2019-04-12', endDate:'2019-04-14', place:'Georgetown University', address:{addressLocality:'Washington', addressRegion:'DC', addressCountry:'US'}},
  2018: {name:'Masters Argentina 2018: Competitividad y nuestro lugar en el mundo', startDate:'2018-04-13', endDate:'2018-04-15', place:'University of Chicago', address:CHICAGO},
  2017: {name:'Masters Argentina 2017: Construyendo Argentina', startDate:'2017-04-21', endDate:'2017-04-23', place:'MIT', address:{addressLocality:'Cambridge', addressRegion:'MA', addressCountry:'US'}},
  2016: {name:'Masters Argentina 2016: Argentina, ¿un cambio o un nuevo ciclo?', startDate:'2016-04-22', endDate:'2016-04-24', place:'Columbia University', address:NEW_YORK}
};
/** Brief §4: the 2026 speakers listed in the brief (all of them appear on the 2026 page). */
export const PERFORMERS_2026 = ['Rafael Aguilar','Santiago De Stefano','Luis Colmegna','Miguel Conte','Oscar Sardi','Leonardo De Lella','Pico Mónaco','Luis Scola','Sofía Martínez','Mercedes Miguel','Claudia Romero','Ignacio Ibarzábal','Horacio Marín','Alejandro Cacace','Hernán Lacunza','Juan F. Politi','Paula Santilli','Horacio Barbeito','Julia Bearzi','Sebastián Sosa','Albert Gozzi','Juan Fantoni','Paula Arregui'];

/** Visible breadcrumb names for internal pages (brief §4, BreadcrumbList). */
const SECTION_NAMES = {'quienes-somos':'Quiénes somos', 'conferencia':'Conferencia 2027', 'contacto':'Contacto',
  'preguntas-frecuentes':'Preguntas frecuentes', 'prensa':'Prensa', 'ediciones':'Ediciones'};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export function normalizePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || /[?#\\]/.test(path) || path.startsWith('//') || path.split('/').includes('..')) {
    throw new Error(`Expected a site-relative canonical path, received ${String(path)}`);
  }
  const normalized = path.replace(/\/{2,}/g, '/').replace(/index\.html$/, '');
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function originUrl(origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SEO origin must be an HTTPS origin without a path or credentials.');
  }
  return url.origin;
}

export function canonicalUrl(path, origin = SITE_ORIGIN) {
  return originUrl(origin) + normalizePath(path);
}

function plainText(html) {
  return String(html).replace(/<\/?(?:p|div|li|ul|ol|br|h[1-6])\b[^>]*>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => {
    const value = code.toLowerCase().startsWith('x') ? parseInt(code.slice(1), 16) : Number(code);
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : '';
  }).replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g, (_, code) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ','#39':"'"}[code]))
    .replace(/\s+/g, ' ').trim();
}

/** FAQ markup is read from the visible questions, so it always matches the page text. */
export function extractFaqs(html, sectionId = 'preguntas') {
  const pattern = new RegExp(`<section\\b[^>]*\\bid=["']${sectionId}["'][^>]*>([\\s\\S]*?)<\\/section>`, 'i');
  const section = String(html).match(pattern)?.[1];
  if (!section) return [];
  return Array.from(section.matchAll(/<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi), ([, question, answer]) => ({
    '@type': 'Question', name: plainText(question), acceptedAnswer: {'@type':'Answer', text:plainText(answer)}
  })).filter(item => item.name && item.acceptedAnswer.text);
}

/** Parse the visible Spanish date of an edition ("4 y 5 de abril de 2025"). Month/year-only plans give null. */
export function editionDates(edition) {
  const date = String(edition?.date || '').trim();
  const match = date.match(/^(\d{1,2})(?:\s+(?:y|al)\s+(\d{1,2}))?\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+(\d{4})$/i);
  if (!match) return null;
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const month = months.indexOf(match[3].toLowerCase()) + 1;
  const year = Number(match[4]);
  if (year !== Number(edition.year)) return null;
  const start = Number(match[1]); const end = Number(match[2] || match[1]);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (start < 1 || end < start || end > lastDay) return null;
  const iso = day => `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  return {startDate:iso(start), endDate:iso(end)};
}

/** Brief §2: every share image is a 1200×630 JPEG. Cloudinary images are cropped there;
 * local images must already be 1200×630 JPEGs (assets/og/). */
function sharingImage(image, origin) {
  if (!image) return DEFAULT_IMAGE;
  const url = new URL(image, `${origin}/`);
  if (url.protocol !== 'https:') return DEFAULT_IMAGE;
  if (url.hostname === 'res.cloudinary.com' && !url.pathname.includes('h_630')) {
    const match = url.pathname.match(/^(\/[^/]+\/image\/upload)\/(?:.*?\/)?(v\d+\/.+?)(?:\.[a-z0-9]+)?$/i);
    if (match) url.pathname = `${match[1]}/c_fill,g_auto,w_1200,h_630/q_auto/f_jpg/${match[2]}.jpg`;
  }
  return url.href;
}

const isVirtual = city => /virtual/i.test(String(city));
/** Fallback for an edition the brief does not cover yet. */
function editionCopy(year, edition) {
  const title = String(edition.title).replace(/\.$/, '');
  const where = isVirtual(edition.city) ? '(virtual)' : `en ${edition.city}`;
  return {
    title: `Masters Argentina ${year} ${where} · ${title}`,
    description: `Conferencia Masters Argentina ${year} ${where}: ${title}. Conocé los speakers, los encuentros y los materiales de esta edición.`,
    h1: title
  };
}

export function pageMetadata({path, edition, image, origin = SITE_ORIGIN}) {
  const normalized = normalizePath(path);
  const base = originUrl(origin);
  let copy = PAGE_COPY[normalized];
  if (/^\/ediciones\/\d{4}\/$/.test(normalized) && edition) {
    const year = normalized.split('/')[2];
    if (String(edition.year) !== year) throw new Error('Edition metadata does not match page path.');
    copy = copy || editionCopy(year, edition);
  }
  if (!copy) throw new Error(`Missing metadata for ${normalized}`);
  return {...copy, canonical:canonicalUrl(normalized, base), image:sharingImage(copy.image || image, base), path:normalized, origin:base};
}

function breadcrumbs(metadata, edition) {
  const parts = metadata.path.split('/').filter(Boolean);
  if (!parts.length) return null;
  const items = [{name:'Inicio', item:`${metadata.origin}/`}];
  items.push({name:SECTION_NAMES[parts[0]] || parts[0], item:canonicalUrl(`/${parts[0]}/`, metadata.origin)});
  if (parts[1]) {
    const label = edition?.city && !isVirtual(edition.city) ? `${edition.city} ${parts[1]}` : `Edición ${parts[1]}`;
    items.push({name:label, item:metadata.canonical});
  }
  return {'@type':'BreadcrumbList', '@id':`${metadata.canonical}#breadcrumb`,
    itemListElement:items.map((entry, index) => ({'@type':'ListItem', position:index + 1, ...entry}))};
}

/** performers: speaker names visible on the page (the build reads them from the template). */
export function structuredData({path, html = '', edition, image, performers = [], origin = SITE_ORIGIN}) {
  const metadata = pageMetadata({path, edition, image, origin});
  const organizationId = `${metadata.origin}/#organization`;
  const organization = {
    '@type':'Organization', '@id':organizationId, name:SITE_NAME, url:`${metadata.origin}/`,
    logo:`${metadata.origin}/assets/masters-logo-hq.png`, email:'info@mastersargentina.org', foundingDate:'2016',
    description:'Organización apartidaria y sin fines de lucro de estudiantes argentinos de posgrado en el exterior.',
    sameAs:['https://www.instagram.com/mastersargentina/','https://www.linkedin.com/company/mastersargentina-org/','https://twitter.com/masters_arg']
  };
  const graph = [organization];
  const crumbs = breadcrumbs(metadata, edition);
  if (crumbs) graph.push(crumbs);
  if (metadata.path === '/preguntas-frecuentes/') {
    const questions = extractFaqs(html);
    if (questions.length) graph.push({'@type':'FAQPage','@id':`${metadata.canonical}#preguntas`,url:metadata.canonical,inLanguage:'es-AR',mainEntity:questions});
  }
  const year = Number(metadata.path.match(/^\/ediciones\/(\d{4})\/$/)?.[1]);
  const event = EVENTS[year];
  if (event) {
    // The marked-up dates must be the dates the page shows.
    const visible = editionDates(edition);
    if (visible && (visible.startDate !== event.startDate || visible.endDate !== event.endDate)) {
      throw new Error(`Event dates for ${year} differ from the visible edition date "${edition.date}".`);
    }
    graph.push({
      '@type':'Event', '@id':`${metadata.canonical}#event`, name:event.name,
      description:`${ORDINAL[year]} edición de la conferencia anual de estudiantes argentinos de posgrado en el exterior.`,
      url:metadata.canonical, startDate:event.startDate, endDate:event.endDate,
      eventStatus:'https://schema.org/EventScheduled', eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',
      location:{'@type':'Place', name:event.place, address:{'@type':'PostalAddress', ...event.address}},
      image:[metadata.image], organizer:{'@id':organizationId},
      ...(performers.length ? {performer:performers.map(name => ({'@type':'Person', name}))} : {})
    });
  }
  return {'@context':'https://schema.org','@graph':graph};
}

export function buildSeoHead(options) {
  const metadata = pageMetadata(options);
  const e = escapeHtml;
  const json = JSON.stringify(structuredData(options)).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return `<title>${e(metadata.title)}</title>\n<meta name="description" content="${e(metadata.description)}">\n<link rel="canonical" href="${e(metadata.canonical)}">\n<meta property="og:type" content="website">\n<meta property="og:locale" content="es_AR">\n<meta property="og:site_name" content="Masters Argentina">\n<meta property="og:title" content="${e(metadata.title)}">\n<meta property="og:description" content="${e(metadata.description)}">\n<meta property="og:url" content="${e(metadata.canonical)}">\n<meta property="og:image" content="${e(metadata.image)}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="Comunidad de Masters Argentina">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${e(metadata.title)}">\n<meta name="twitter:description" content="${e(metadata.description)}">\n<meta name="twitter:image" content="${e(metadata.image)}">\n<script type="application/ld+json">${json}</script>`;
}

export function buildSitemap(paths, origin = SITE_ORIGIN) {
  const unique = [...new Set(paths.map(path => canonicalUrl(typeof path === 'string' ? path : path.path, origin)))];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
}

export function buildRobots(origin = SITE_ORIGIN) {
  // Keep crawl access for rendering resources. Non-public support pages use noindex headers.
  return `User-agent: *\nAllow: /\n\nSitemap: ${originUrl(origin)}/sitemap.xml\n`;
}
