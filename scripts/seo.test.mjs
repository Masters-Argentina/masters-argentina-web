import test from 'node:test';
import assert from 'node:assert/strict';
import { SITE_ORIGIN, DEFAULT_IMAGE, PAGE_COPY, EVENTS, buildSeoHead, buildSitemap, buildRobots, structuredData, editionDates, normalizePath, pageMetadata } from './seo.mjs';
const edition = {year:2025, city:'Nueva York', date:'4 y 5 de abril de 2025', title:'ADN Argentino: De las Raíces al Potencial', venue:'Columbia Business School · Consulado Argentino', summary:'La décima edición.'};
const graphOf = options => structuredData(options)['@graph'];
const ofType = (graph, type) => graph.find(node => node['@type'] === type);

test('every page of the content brief has its exact title, description and H1', () => {
  // Spot checks against «Contenido SEO para el nuevo sitio», section 1.
  assert.equal(PAGE_COPY['/'].title, 'Masters Argentina · Conferencia de estudiantes argentinos');
  assert.equal(PAGE_COPY['/'].h1, 'Estudiantes argentinos de posgrado en el mundo, conectados con el país');
  assert.equal(PAGE_COPY['/conferencia/'].title, 'Conferencia Masters Argentina 2027 · Washington DC');
  assert.equal(PAGE_COPY['/contacto/'].title, 'Contacto · Masters Argentina');
  assert.equal(PAGE_COPY['/ediciones/2020/'].title, 'Masters Argentina Conecta 2020 · Ciclo de webinars');
  assert.equal(PAGE_COPY['/ediciones/2016/'].title, 'Masters Argentina 2016 en Nueva York · La primera edición');
  const paths = Object.keys(PAGE_COPY);
  assert.equal(paths.length, 18);
  for (const key of ['title', 'description', 'h1']) assert.equal(new Set(paths.map(p => PAGE_COPY[p][key])).size, paths.length, `${key} must be unique`);
});

test('Open Graph mirrors title, description and canonical, with a 1200×630 image', () => {
  for (const path of ['/', '/quienes-somos/', '/conferencia/', '/contacto/', '/preguntas-frecuentes/', '/prensa/', '/ediciones/']) {
    const head = buildSeoHead({path});
    const meta = pageMetadata({path});
    assert.ok(head.includes(`<link rel="canonical" href="${SITE_ORIGIN}${path}">`));
    assert.ok(head.includes(`property="og:url" content="${SITE_ORIGIN}${path}"`));
    assert.ok(head.includes('property="og:image:width" content="1200"') && head.includes('property="og:image:height" content="630"'));
    assert.match(meta.image, /h_630/);
  }
  assert.equal(pageMetadata({path:'/'}).image, DEFAULT_IMAGE);
  assert.match(pageMetadata({path:'/conferencia/'}).image, /Conferencia%202027/);
});

test('Cloudinary share images are cropped to a 1200×630 JPEG; local ones are used as given', () => {
  const image = 'https://res.cloudinary.com/demo/image/upload/c_limit,w_1600/q_auto,f_auto/v1/folder/photo.png';
  assert.equal(pageMetadata({path:'/ediciones/2025/', edition, image}).image, 'https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_1200,h_630/q_auto/f_jpg/v1/folder/photo.jpg');
  assert.equal(pageMetadata({path:'/ediciones/2025/', edition, image:'assets/og/cover.jpg'}).image, `${SITE_ORIGIN}/assets/og/cover.jpg`);
});

test('Organization follows the brief on every page', () => {
  const org = ofType(graphOf({path:'/'}), 'Organization');
  assert.equal(org.foundingDate, '2016');
  assert.equal(org.logo, `${SITE_ORIGIN}/assets/masters-logo-hq.png`);
  assert.match(org.description, /apartidaria y sin fines de lucro/);
});

test('edition Events carry the brief dates, venue, status and visible speakers', () => {
  const event = ofType(graphOf({path:'/ediciones/2025/', edition, performers:['Lupe Tagliaferri']}), 'Event');
  assert.equal(event.name, 'Masters Argentina 2025: ADN Argentino, de las raíces al potencial');
  assert.equal(event.startDate, '2025-04-04'); assert.equal(event.endDate, '2025-04-05');
  assert.equal(event.eventStatus, 'https://schema.org/EventScheduled');
  assert.equal(event.location.name, 'Columbia Business School');
  assert.deepEqual(event.location.address, {'@type':'PostalAddress', addressLocality:'Nueva York', addressRegion:'NY', addressCountry:'US'});
  assert.deepEqual(event.performer, [{'@type':'Person', name:'Lupe Tagliaferri'}]);
  assert.equal(event.description, 'X edición de la conferencia anual de estudiantes argentinos de posgrado en el exterior.');
  const miami = ofType(graphOf({path:'/ediciones/2026/', edition:{year:2026, city:'Miami', date:'10 y 11 de abril de 2026', title:'x'}}), 'Event');
  assert.equal(miami.location.address.streetAddress, '11200 SW 8th St');
  assert.equal(ofType(graphOf({path:'/ediciones/2024/', edition:{...edition, year:2024, date:'5 y 6 de abril de 2024'}}), 'Event').performer, undefined);
});

test('no Event without exact dates: 2020, 2021 and the 2027 conference', () => {
  assert.equal(EVENTS[2020], undefined); assert.equal(EVENTS[2021], undefined);
  for (const [path, year] of [['/ediciones/2020/', 2020], ['/ediciones/2021/', 2021], ['/conferencia/', 2027]]) {
    assert.equal(ofType(graphOf({path, edition: path.startsWith('/ediciones/') ? {...edition, year, date:String(year)} : undefined}), 'Event'), undefined);
  }
});

test('Event dates must match the date the page shows', () => {
  assert.throws(() => graphOf({path:'/ediciones/2025/', edition:{...edition, date:'5 y 6 de abril de 2025'}}), /differ from the visible edition date/);
  assert.equal(editionDates({...edition, date:'Abril 2025'}), null);
  assert.equal(editionDates({...edition, date:'31 y 32 de abril de 2025'}), null);
  assert.throws(() => pageMetadata({path:'/ediciones/2024/', edition}), /does not match/);
});

test('internal pages carry a BreadcrumbList; the home page does not', () => {
  assert.equal(ofType(graphOf({path:'/'}), 'BreadcrumbList'), undefined);
  const crumbs = ofType(graphOf({path:'/ediciones/2026/', edition:{year:2026, city:'Miami', date:'10 y 11 de abril de 2026', title:'x'}}), 'BreadcrumbList');
  assert.deepEqual(crumbs.itemListElement.map(item => item.name), ['Inicio', 'Ediciones', 'Miami 2026']);
  assert.equal(crumbs.itemListElement[2].item, `${SITE_ORIGIN}/ediciones/2026/`);
  assert.deepEqual(ofType(graphOf({path:'/prensa/'}), 'BreadcrumbList').itemListElement.map(item => item.name), ['Inicio', 'Prensa']);
});

test('FAQ schema lives on /preguntas-frecuentes/ and is read from the visible questions only', () => {
  const html = '<details><summary>Other</summary><p>Ignore</p></details><section id="preguntas"><details><summary>¿Cómo &amp; dónde?</summary><div>Escribinos a <a href="mailto:info@example.com">nuestro equipo</a>.</div></details></section>';
  const faq = ofType(graphOf({path:'/preguntas-frecuentes/', html}), 'FAQPage');
  assert.equal(faq.mainEntity.length, 1);
  assert.equal(faq.mainEntity[0].name, '¿Cómo & dónde?');
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, 'Escribinos a nuestro equipo.');
  assert.equal(ofType(graphOf({path:'/contacto/', html}), 'FAQPage'), undefined);
});

test('markup escapes metadata and JSON-LD cannot terminate its script element', () => {
  const head = buildSeoHead({path:'/ediciones/2025/', edition, performers:['Name </script><script>alert("x")</script>']});
  assert.equal((head.match(/<script\b/g) || []).length, 1);
  const json = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.ok(ofType(JSON.parse(json)['@graph'], 'Event').performer[0].name.includes('</script>'));
});

test('canonical paths are normalized and unsafe values rejected', () => {
  assert.equal(normalizePath('/ediciones/2025'), '/ediciones/2025/');
  assert.equal(normalizePath('/index.html'), '/');
  for (const bad of ['ediciones', '//evil.example/', '/a/../b', '/a?b', '/a#b']) assert.throws(() => normalizePath(bad));
});

test('sitemap has only deduplicated canonical URLs, and robots exposes it', () => {
  const sitemap = buildSitemap(['/', '/prensa', '/prensa/']);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 2);
  assert.ok(buildRobots().includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`));
});
