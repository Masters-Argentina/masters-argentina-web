/** Metadata for the public, static pages. Keep the production origin in one place.
 * A future custom-domain migration must update SITE_ORIGIN and its redirects together.
 * Structured data is limited to facts already present in the rendered page.
 */
export const SITE_ORIGIN = 'https://www.mastersargentina.org';
export const DEFAULT_IMAGE = 'https://res.cloudinary.com/lzfq7irq/image/upload/c_limit,w_1200/q_auto/f_jpg/v1794327840/masters-argentina/conference-2026/2026-galeria-comunidad-ccb6cb7edd7c.jpg';
const LOGO = 'https://res.cloudinary.com/lzfq7irq/image/upload/v1794327860/masters-argentina/branding-and-general/masters-logo-hq-d9c0fc269d8f.png';
const SITE_NAME = 'Masters Argentina';
const PAGE_COPY = {
  '/': {
    title: 'Masters Argentina · Conferencia de estudiantes argentinos de posgrado',
    description: 'Conectamos a estudiantes argentinos de posgrado en el exterior con referentes de distintos sectores. Conocé la comunidad, las conferencias y cómo sumarte.'
  },
  '/quienes-somos/': {
    title: 'Quiénes somos · Masters Argentina',
    description: 'Conocé a la comunidad de Masters Argentina, su historia, sus objetivos y el equipo de estudiantes argentinos que organiza nuestros encuentros.'
  },
  '/conferencia/': {
    title: 'Conferencia 2027 en Washington DC · Masters Argentina',
    description: 'Conocé la propuesta de la Conferencia Masters Argentina 2027 en Washington DC. Consultá las novedades del encuentro y las preguntas frecuentes.'
  },
  '/contacto/': {
    title: 'Contacto y preguntas frecuentes · Masters Argentina',
    description: 'Contactá al equipo de Masters Argentina, conocé cómo sumarte y encontrá respuestas sobre la comunidad, la conferencia, las inscripciones y los sponsors.'
  },
  '/ediciones/': {
    title: 'Ediciones anteriores · Masters Argentina',
    description: 'Recorré la historia de Masters Argentina: ciudades, sedes, speakers y materiales de las conferencias que reunieron a estudiantes y referentes argentinos.'
  }
};

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

export function extractFaqs(html) {
  const section = String(html).match(/<section\b[^>]*\bid=["']contact-preguntas["'][^>]*>([\s\S]*?)<\/section>/i)?.[1];
  if (!section) return [];
  return Array.from(section.matchAll(/<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi), ([, question, answer]) => ({
    '@type': 'Question', name: plainText(question), acceptedAnswer: {'@type':'Answer', text:plainText(answer)}
  })).filter(item => item.name && item.acceptedAnswer.text);
}

/** Only exact calendar dates are marked up; month/year-only plans are not dates. */
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

function sharingImage(image, origin) {
  if (!image) return DEFAULT_IMAGE;
  const url = new URL(image, `${origin}/`);
  if (url.protocol !== 'https:') return DEFAULT_IMAGE;
  // Social crawlers do not always negotiate formats; use a fixed JPEG for Cloudinary shares.
  if (url.hostname === 'res.cloudinary.com' && /\/f_auto\//.test(url.pathname)) {
    url.pathname = url.pathname.replace('/f_auto/', '/f_jpg/').replace(/\.(webp|png|avif)$/i, '.jpg');
  }
  return url.href;
}

export function pageMetadata({path, edition, image, origin = SITE_ORIGIN}) {
  const normalized = normalizePath(path);
  const base = originUrl(origin);
  let copy = PAGE_COPY[normalized];
  if (/^\/ediciones\/\d{4}\/$/.test(normalized) && edition) {
    const year = normalized.split('/')[2];
    if (String(edition.year) !== year) throw new Error('Edition metadata does not match page path.');
    copy = {
      title: `Masters Argentina ${year} en ${edition.city} · ${edition.title}`,
      description: `Conferencia Masters Argentina ${year} en ${edition.city}: ${edition.title}. Conocé los speakers, los encuentros y los materiales de esta edición.`
    };
  }
  if (!copy) throw new Error(`Missing metadata for ${normalized}`);
  return {...copy, canonical:canonicalUrl(normalized, base), image:sharingImage(image,base), path:normalized, origin:base};
}

export function structuredData({path, html = '', edition, image, origin = SITE_ORIGIN}) {
  const metadata = pageMetadata({path, edition, image, origin});
  const organizationId = `${metadata.origin}/#organization`;
  const organization = {
    '@type':'Organization', '@id':organizationId, name:SITE_NAME, url:`${metadata.origin}/`, logo:LOGO,
    description:'Comunidad de estudiantes argentinos de posgrado en el exterior.',
    email:'info@mastersargentina.org',
    sameAs:['https://www.instagram.com/mastersargentina/','https://www.linkedin.com/company/mastersargentina-org/','https://twitter.com/masters_arg']
  };
  const graph = [organization];
  if (metadata.path === '/contacto/') {
    const questions = extractFaqs(html);
    if (questions.length) graph.push({'@type':'FAQPage','@id':`${metadata.canonical}#preguntas-frecuentes`,url:metadata.canonical,inLanguage:'es-AR',mainEntity:questions});
  }
  const dates = editionDates(edition);
  // 2020 has cancelled-conference/webinar material and 2021 lacks exact dates.
  // 2027 remains deliberately excluded until the confirmed event has full dates and a venue.
  if (/^\/ediciones\/\d{4}\/$/.test(metadata.path) && dates && edition?.venue && edition?.city && ![2020,2021,2027].includes(Number(edition.year))) {
    const places = String(edition.venue).split(' · ').map(name => ({'@type':'Place', name, address:{'@type':'PostalAddress',addressLocality:edition.city,addressCountry:'US'}}));
    graph.push({
      '@type':'Event', '@id':`${metadata.canonical}#event`, name:`Masters Argentina ${edition.year}: ${edition.title}`,
      description:edition.summary || metadata.description, url:metadata.canonical, ...dates,
      location:places.length === 1 ? places[0] : places, image:[metadata.image], organizer:{'@id':organizationId},
      eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode'
    });
  }
  return {'@context':'https://schema.org','@graph':graph};
}

export function buildSeoHead(options) {
  const metadata = pageMetadata(options);
  const e = escapeHtml;
  const json = JSON.stringify(structuredData(options)).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return `<title>${e(metadata.title)}</title>\n<meta name="description" content="${e(metadata.description)}">\n<link rel="canonical" href="${e(metadata.canonical)}">\n<meta property="og:type" content="website">\n<meta property="og:locale" content="es_AR">\n<meta property="og:site_name" content="Masters Argentina">\n<meta property="og:title" content="${e(metadata.title)}">\n<meta property="og:description" content="${e(metadata.description)}">\n<meta property="og:url" content="${e(metadata.canonical)}">\n<meta property="og:image" content="${e(metadata.image)}">\n<meta property="og:image:alt" content="Comunidad de Masters Argentina">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${e(metadata.title)}">\n<meta name="twitter:description" content="${e(metadata.description)}">\n<meta name="twitter:image" content="${e(metadata.image)}">\n<script type="application/ld+json">${json}</script>`;
}

export function buildSitemap(paths, origin = SITE_ORIGIN) {
  const unique = [...new Set(paths.map(path => canonicalUrl(typeof path === 'string' ? path : path.path, origin)))];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
}

export function buildRobots(origin = SITE_ORIGIN) {
  // Keep crawl access for rendering resources. Non-public support pages use noindex headers.
  return `User-agent: *\nAllow: /\n\nSitemap: ${originUrl(origin)}/sitemap.xml\n`;
}
