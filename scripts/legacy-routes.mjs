/** Routing rules shared by the build and the browser runtime.
 * legacyDestination is serialized into assets/site-runtime.js with toString(),
 * so it must stay self-contained (no imports, no outer variables).
 */

/** Map an old single-page hash (#seccion/detalle) to a path relative to the site root.
 * Returns null when the hash is not a legacy route (for example an in-page anchor). */
export function legacyDestination(hash) {
 const [section, detail] = hash.slice(1).split('/');
 if (section === 'inicio') return '';
 if (section === 'faq') return 'contacto/#contact-preguntas';
 if (section === 'alumni') return 'contacto/';
 if (section === 'apoyar') return 'contacto/#contact-sponsors';
 if (['quienes-somos', 'conferencia'].includes(section) && !detail) return section + '/';
 if (section === 'contacto') return 'contacto/' + (['sumarse','newsletter','sponsors','preguntas'].includes(detail) ? '#contact-' + detail : '');
 if (section === 'ediciones') return 'ediciones/' + (/^20(?:1[6-9]|2[0-6])$/.test(detail || '') ? detail + '/' : '');
 return null;
}

/** Rewrite a template hash link to a static-page href relative to the site root.
 * '' means the site root; values still starting with '#' are in-page anchors. */
export function routeHref(value) {
 if (value === '#inicio') return '';
 if (value === '#contenido') return value;
 const match = value.match(/^#(quienes-somos|conferencia|contacto|ediciones)(?:\/([^#]+))?$/);
 if (!match) return value;
 const [,section,detail] = match;
 if (section === 'contacto' && detail) return `contacto/#contact-${detail}`;
 if (section === 'ediciones' && detail) return `ediciones/${detail}/`;
 return `${section}/`;
}
