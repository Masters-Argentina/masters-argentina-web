import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { legacyDestination, routeHref } from './legacy-routes.mjs';

test('old hash bookmarks map to the static pages that replaced them', () => {
  const cases = {
    '#inicio': '',
    '#quienes-somos': 'quienes-somos/',
    '#conferencia': 'conferencia/',
    '#faq': 'contacto/#contact-preguntas',
    '#alumni': 'contacto/',
    '#apoyar': 'contacto/#contact-sponsors',
    '#contacto': 'contacto/',
    '#contacto/sumarse': 'contacto/#contact-sumarse',
    '#contacto/newsletter': 'contacto/#contact-newsletter',
    '#contacto/desconocido': 'contacto/',
    '#ediciones': 'ediciones/',
    '#ediciones/2016': 'ediciones/2016/',
    '#ediciones/2026': 'ediciones/2026/',
    '#ediciones/2027': 'ediciones/',
    '#ediciones/2015': 'ediciones/'
  };
  for (const [hash, expected] of Object.entries(cases)) assert.equal(legacyDestination(hash), expected, hash);
});

test('in-page anchors and empty hashes are not treated as legacy routes', () => {
  for (const hash of ['', '#', '#contenido', '#contact-preguntas', '#history-2020', '#encuentro-masters-ypf', '#quienes-somos/equipo']) {
    assert.equal(legacyDestination(hash), null, hash);
  }
});

test('template hash links become static hrefs relative to the site root', () => {
  assert.equal(routeHref('#inicio'), '');
  assert.equal(routeHref('#contenido'), '#contenido');
  assert.equal(routeHref('#quienes-somos'), 'quienes-somos/');
  assert.equal(routeHref('#contacto/sponsors'), 'contacto/#contact-sponsors');
  assert.equal(routeHref('#ediciones/2019'), 'ediciones/2019/');
  assert.equal(routeHref('#ediciones'), 'ediciones/');
  assert.equal(routeHref('#contact-preguntas'), '#contact-preguntas');
});

test('the browser runtime ships the same legacyDestination as the tested module', () => {
  const runtime = fs.readFileSync(new URL('../assets/site-runtime.js', import.meta.url), 'utf8');
  assert.ok(runtime.includes(legacyDestination.toString()), 'rebuild with node scripts/build.mjs');
});
