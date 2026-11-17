import test from 'node:test';
import assert from 'node:assert/strict';
import { SITE_ORIGIN, buildSeoHead, buildSitemap, buildRobots, structuredData, editionDates, normalizePath, pageMetadata } from './seo.mjs';
const edition = {year:2025, city:'Nueva York', date:'4 y 5 de abril de 2025', title:'ADN Argentino: De las Raíces al Potencial', venue:'Columbia Business School · Consulado Argentino', summary:'La décima edición.'};

test('each canonical main page has independent Spanish metadata and matching social URL', () => {
  const paths=['/','/quienes-somos/','/conferencia/','/contacto/','/ediciones/'];
  const metadata=paths.map(path=>pageMetadata({path}));
  assert.equal(new Set(metadata.map(m=>m.title)).size,paths.length);
  assert.equal(new Set(metadata.map(m=>m.description)).size,paths.length);
  for (const path of paths) {
    const head=buildSeoHead({path});
    assert.ok(head.includes(`href="${SITE_ORIGIN}${path}"`));
    assert.ok(head.includes(`property="og:url" content="${SITE_ORIGIN}${path}"`));
    assert.ok(!head.includes('Propuesta de sitio'));
  }
  assert.match(metadata[0].title,/Conferencia de estudiantes argentinos de posgrado/);
});

test('historical Event keeps exact evidenced dates and multiple venues without invented details', () => {
  const graph=structuredData({path:'/ediciones/2025/',edition})['@graph'];
  const event=graph.find(item=>item['@type']==='Event');
  assert.equal(event.startDate,'2025-04-04'); assert.equal(event.endDate,'2025-04-05');
  assert.equal(event.location.length,2);
  assert.deepEqual(event.location.map(p=>p.name),['Columbia Business School','Consulado Argentino']);
  assert.equal(event.offers,undefined); assert.equal(event.eventStatus,undefined);
  assert.equal(event.location[0].address.streetAddress,undefined);
  assert.throws(()=>pageMetadata({path:'/ediciones/2024/',edition}),/does not match/);
});

test('incomplete plans and invalid dates never become Event structured data', () => {
  assert.equal(editionDates({...edition,date:'Abril 2025'}),null);
  assert.equal(editionDates({...edition,date:'31 y 32 de abril de 2025'}),null);
  assert.equal(editionDates({...edition,date:'5 y 4 de abril de 2025'}),null);
  assert.equal(editionDates({...edition,date:'4 y 5 de abril de 2024'}),null);
  for (const year of [2020,2021,2027]) {
    const path=year===2027?'/conferencia/':`/ediciones/${year}/`;
    assert.equal(structuredData({path,edition:{...edition,year,date:`4 y 5 de abril de ${year}`}})['@graph'].filter(x=>x['@type']==='Event').length,0);
  }
});

test('FAQ schema is limited to the visible contact FAQ, not unrelated disclosure content', () => {
  const html='<details><summary>Other</summary><p>Ignore</p></details><section id="contact-preguntas"><details><summary>¿Cómo &amp; dónde?</summary><div>Escribinos a <a href="mailto:info@example.com">nuestro equipo</a>.</div></details></section>';
  const graph=structuredData({path:'/contacto/',html})['@graph'];
  const faq=graph.find(x=>x['@type']==='FAQPage');
  assert.equal(faq.mainEntity.length,1);
  assert.equal(faq.mainEntity[0].name,'¿Cómo & dónde?');
  assert.equal(faq.mainEntity[0].acceptedAnswer.text,'Escribinos a nuestro equipo.');
  assert.equal(structuredData({path:'/conferencia/',html})['@graph'].some(x=>x['@type']==='FAQPage'),false);
});

test('markup escapes metadata and JSON-LD cannot terminate its script element', () => {
  const head=buildSeoHead({path:'/ediciones/2025/',edition:{...edition,title:'Title </script><script>alert("x")</script>'}});
  assert.equal((head.match(/<script\b/g)||[]).length,1);
  assert.ok(head.includes('&lt;/script&gt;'));
  const json=head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  const parsed=JSON.parse(json);
  assert.ok(parsed['@graph'].find(x=>x['@type']==='Event').name.includes('</script>'));
});

test('sitemap has only deduplicated real canonical URLs, and robots exposes it', () => {
  const xml=buildSitemap(['/','/contacto','/contacto/','/ediciones/2025/']);
  assert.equal((xml.match(/<loc>/g)||[]).length,3);
  assert.ok(xml.includes(`${SITE_ORIGIN}/ediciones/2025/`));
  assert.ok(buildRobots().includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`));
  for (const path of ['#contacto','//elsewhere.com','/contacto/#x','/../secret','https://example.com/']) assert.throws(()=>normalizePath(path));
  assert.throws(()=>buildSitemap(['/'],'https://example.com/prefix/'));
});

test('edition titles never read "en Virtual" and drop the place before the brand when long', () => {
  const virtual = pageMetadata({path:'/ediciones/2021/', edition:{...edition, year:2021, city:'Virtual', title:'Argentina resiliente'}});
  assert.equal(virtual.title, 'Masters Argentina 2021 (virtual) · Argentina resiliente');
  assert.doesNotMatch(virtual.title + virtual.description, /en (Virtual|Encuentros virtuales)/);
  assert.match(virtual.description, /en formato virtual/);
  const long = pageMetadata({path:'/ediciones/2022/', edition:{...edition, year:2022, city:'Chicago', title:'Conversaciones improbables para una Argentina posible'}});
  assert.equal(long.title, 'Masters Argentina 2022 · Conversaciones improbables para una Argentina posible');
  assert.match(long.description, /en Chicago/);
  const short = pageMetadata({path:'/ediciones/2017/', edition:{...edition, year:2017, city:'Boston', title:'Construyendo Argentina'}});
  assert.equal(short.title, 'Masters Argentina 2017 en Boston · Construyendo Argentina');
});

test('social images are JPEG: Cloudinary f_auto and wide transforms become a 1200px JPEG', () => {
  const image = 'https://res.cloudinary.com/demo/image/upload/c_limit,w_1600/q_auto,f_auto/v1/folder/photo.png';
  const meta = pageMetadata({path:'/ediciones/2025/', edition, image});
  assert.equal(meta.image, 'https://res.cloudinary.com/demo/image/upload/c_limit,w_1200/q_auto,f_jpg/v1/folder/photo.jpg');
  assert.equal(pageMetadata({path:'/ediciones/2025/', edition, image:'assets/og/cover.jpg'}).image, `${SITE_ORIGIN}/assets/og/cover.jpg`);
});

test('Event addresses only carry a country for known host cities', () => {
  const known = structuredData({path:'/ediciones/2025/', edition})['@graph'].find(x=>x['@type']==='Event');
  assert.equal(known.location[0].address.addressCountry, 'US');
  const unknown = structuredData({path:'/ediciones/2025/', edition:{...edition, city:'Madrid'}})['@graph'].find(x=>x['@type']==='Event');
  assert.equal(unknown.location[0].address.addressCountry, undefined);
  assert.equal(unknown.location[0].address.addressLocality, 'Madrid');
});
