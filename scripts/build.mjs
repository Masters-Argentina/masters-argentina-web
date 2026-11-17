/** Generate crawlable static pages from the existing presentation templates.
 * No network, package dependencies, or browser rendering is required.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildSeoHead, buildSitemap, buildRobots } from './seo.mjs';
import { renderEventInvitation, renderEventInvitationLink } from './event-invitation.mjs';
import { legacyDestination, routeHref } from './legacy-routes.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** The template is sliced and patched by marker strings. Any marker that goes
 * missing after a template edit must stop the build instead of shipping a
 * silently broken page or runtime. */
function mustFind(haystack, needle, from = 0) {
 const index = haystack.indexOf(needle, from);
 if (index === -1) throw Error(`Build marker not found in source/site.html: ${needle.slice(0, 80)}`);
 return index;
}
function mustReplace(haystack, search, replacement) {
 if (typeof search === 'string') mustFind(haystack, search);
 else if (!search.test(haystack)) throw Error(`Build pattern not found: ${search}`);
 // A literal string search gets a literal replacement: page text must not be read as $& or $' patterns.
 return haystack.replace(search, typeof search === 'string' && typeof replacement === 'string' ? () => replacement : replacement);
}
const source = fs.readFileSync(path.join(root, 'source/site.html'), 'utf8');
const scripts = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const assetMap = JSON.parse(scripts.find(s => /id="asset-paths"/.test(s[1]))[2]);
const historyScript = scripts.find(s => s[2].includes('const HISTORY_EDITIONS'))[2];
const pageScript = scripts.find(s => s[2].includes('const CONFERENCIA'))[2];
const cloudMap = JSON.parse(fs.readFileSync(path.join(root, 'cloudinary-images.json'), 'utf8'));
const dimensions = JSON.parse(fs.readFileSync(path.join(root, 'scripts/image-dimensions.json'), 'utf8'));
const context = vm.createContext({ console });
vm.runInContext(historyScript + '\n' + pageScript.slice(0, mustFind(pageScript, 'const nav =')), context);
const editions = vm.runInContext('JSON.parse(JSON.stringify(HISTORY_EDITIONS))', context);
const render = expression => vm.runInContext(expression, context);
const excerpt = (start, end) => { const from = mustFind(pageScript, start); return pageScript.slice(from, mustFind(pageScript, end, from)); };
const originalStyles = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const styles = originalStyles.replaceAll('.history-years button', '.history-years :is(button,a)') + '\n.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n.history-years a:hover{text-decoration:none}\n';
fs.writeFileSync(path.join(root, 'assets/site.css'), styles);
const runtime = `'use strict';\n// Hydrate the server-delivered HTML without replacing its content.\n` +
excerpt('function initAboutPage()', 'const archiveCircleRail') +
excerpt('function initArchiveCarousels()', 'const CONFERENCE_UNIVERSITIES') +
excerpt('function initContact()', 'const EDITIONS') +
mustReplace(excerpt('let cleanupHistoryTimeline', 'const editions ='), "document.querySelectorAll('[data-history-year]').forEach(button=>button.addEventListener('click',()=>{const target=document.getElementById(`history-${button.dataset.historyYear}`);if(!target)return;target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));", '') +
excerpt('function initEdition2026()', 'const routes =') +
excerpt('const nav =', 'function render(') + `
${legacyDestination.toString()}
function restoreLegacyRoute() {
 const destination = legacyDestination(location.hash);
 if (destination === null) return false;
 const base = new URL(document.body.dataset.siteRoot, location.href);
 const target = new URL(destination, base);
 if (target.href !== location.href) location.replace(target.href);
 return true;
}
window.addEventListener('hashchange', restoreLegacyRoute);
if (!restoreLegacyRoute()) {
 const motion=document.querySelector('.home-motion-toggle');
 if(motion)motion.addEventListener('click',()=>{const paused=motion.getAttribute('aria-pressed')!=='true';motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Reanudar carruseles':'Pausar carruseles';document.querySelector('.home-partners').classList.toggle('is-paused',paused);});
 initArchiveCarousels(); initAboutPage(); initEdition2026(); initContact(); initHistory(); initManualCarousels(); updateHeaderBrand();
}
`;
new vm.Script(runtime);
fs.writeFileSync(path.join(root, 'assets/site-runtime.js'), runtime);

const plainText = html => html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
/** 2026 has its own page template; read its facts from that template's data and visible H1
 * so the metadata cannot drift from what the page shows. */
function edition2026() {
 const data = render('JSON.parse(JSON.stringify(EDITIONS["2026"]))');
 const heading = render('edition2026()').match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
 if (!data || !heading) throw Error('Missing 2026 edition data or heading in source/site.html');
 return {year:2026, city:data.city, date:data.date, venue:data.venue, title:plainText(heading).replace(/\.$/, '')};
}
const routes = [
 {url:'/', expression:'home()'},
 {url:'/quienes-somos/', expression:'about()'},
 {url:'/conferencia/', expression:'conference()'},
 {url:'/contacto/', expression:'contact()'},
 {url:'/ediciones/', expression:'historyPage()', history:true},
 {url:'/ediciones/2026/', expression:'edition2026()', year:2026, edition:edition2026()},
 ...editions.map(e => ({url:`/ediciones/${e.year}/`, year:e.year, edition:e, history:true}))
];
/** Social previews need a JPEG: use the Cloudinary copy when one exists, otherwise a
 * pre-converted file in assets/og/ (see README). Missing ones fall back to the default image. */
function shareImage(cover) {
 if (!cover) return undefined;
 const local = assetMap[cover] || cover;
 if (cloudMap[local]) return cloudMap[local];
 const jpeg = `assets/og/${path.basename(local).replace(/\.[^.]+$/, '')}.jpg`;
 if (fs.existsSync(path.join(root, jpeg))) return jpeg;
 console.warn(`No JPEG share image for ${cover}; using the default image.`);
 return undefined;
}
const historyHtml = render('historyPage()');
const escapeHtml = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function pageForYear(year, edition) {
 const sections = [...historyHtml.matchAll(/<section class="history-edition"[\s\S]*?(?=<section class="history-edition"|<section class="history-next")/g)];
 const section = sections.find(m => m[0].includes(`id="history-${year}"`))?.[0];
 if (!section) throw Error('Missing historical edition ' + year);
 const first = historyHtml.slice(0, historyHtml.indexOf('<section class="history-edition"'));
 const last = historyHtml.slice(historyHtml.indexOf('<section class="history-next"'));
 return first.replace('<h1>Una historia de encuentros.</h1>', `<h1>Masters ${year}: ${escapeHtml(edition.title)}</h1>`) + section + last;
}
function transformHtml(html, route, prefix) {
 html = html.replace(/<a\b[^>]*aria-label="Edición (\d{4}):[^>]*>/g,
  (tag, year) => tag.replace(/href="#[^"]*"/, `href="#ediciones/${year}"`));
 html = html.replace(/<button\b([^>]*\bdata-history-year="(\d+)"[^>]*)>([\s\S]*?)<\/button>/g,
  (all,attrs,year,inner) => `<a${attrs.replace(/\s*type="button"/,'')} href="#ediciones/${year}">${inner}</a>`);
 html = html.replace(/<img\b[^>]*>/g, tag => {
  const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
  const local = assetMap[src] || src;
  const dim = dimensions[local] || dimensions[src];
  if (dim && !/\bwidth=/.test(tag) && !/\bheight=/.test(tag)) tag=tag.replace(/>$/, ` width="${dim[0]}" height="${dim[1]}">`);
  if (!/\bdecoding=/.test(tag)) tag=tag.replace(/>$/, ' decoding="async">');
  if (!/fetchpriority="high"/.test(tag) && !/(?:masters-logo|favicon)/.test(src || '')) {
   if (/\bloading=/.test(tag)) tag=tag.replace(/\bloading="[^"]*"/, 'loading="lazy"');
   else tag=tag.replace(/>$/, ' loading="lazy">');
  }
  return tag;
 });
 html = html.replace(/\b(src|href|data-history-src)=(['"])([^'"]*)\2/g, (all, attr,quote,value) => {
  let result = value;
  if (attr === 'href' && result.startsWith('#')) {
   result = routeHref(result);
   if (result === '' || !result.startsWith('#')) result = prefix + result;
  } else if (!/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(result)) {
   result = assetMap[result] || result;
   if (!route.history) result = cloudMap[result] || result;
   if (!/^[a-z][a-z0-9+.-]*:/i.test(result)) result=prefix+result;
  }
  return `${attr}=${quote}${result}${quote}`;
 });
 return html;
}
for (const route of routes) {
 const file = path.join(root, route.url.slice(1), 'index.html');
 const prefix = path.relative(path.dirname(file), root).split(path.sep).join('/') + '/';
 const rootPrefix = prefix === '/' ? './' : prefix;
 let main = route.expression ? render(route.expression) : pageForYear(route.year, route.edition);
 const invitation = route.url === '/' ? renderEventInvitation() : '';
 if (invitation) {
  // La presentación de Masters sigue primero; el evento es el segundo bloque.
  const nextSection = '<section class="home-event"';
  const previousLink = '<a class="text-link" href="#ediciones/2026">Conocé la conferencia 2026 →</a>';
  if (!main.includes(nextSection) || !main.includes(previousLink)) throw Error('No se encontró el punto de integración de la invitación.');
  main = main.replace(nextSection, invitation + '\n' + nextSection)
   .replace(previousLink, renderEventInvitationLink())
   .replace('El próximo encuentro', 'La próxima conferencia');
 }
 // Give the home H1 real text and hide its decorative logo, touching only the H1 itself.
 if (route.url === '/') main = mustReplace(main, /<h1 id="home-title">([\s\S]*?)<\/h1>/, (all, inner) =>
  '<h1 id="home-title"><span class="sr-only">Masters Argentina · Conferencia de estudiantes argentinos de posgrado</span>' +
  mustReplace(inner, /(<img\b[^>]*?)alt="Masters Argentina"/, '$1alt="" aria-hidden="true"') + '</h1>');
 main = transformHtml(main, route, rootPrefix);
 let shell = source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '');
 // The source is not a public landing page. Its noindex directive must not
 // propagate into the generated, indexable production pages.
 shell = shell.replace(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi, '');
 shell = shell.replace(/<meta\b[^>]*name="description"[^>]*>/, '').replace(/<title>[\s\S]*?<\/title>/, '');
 shell = shell.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, '<main id="contenido" tabindex="-1">__PRERENDERED_CONTENT__</main>');
 shell = transformHtml(shell, {...route, history:false}, rootPrefix);
 shell = mustReplace(shell, '__PRERENDERED_CONTENT__', main);
 shell = mustReplace(shell, '<body>', `<body data-site-root="${rootPrefix}" data-page-path="${route.url}">`);
 // Current navigation state is present even with JavaScript disabled.
 const navPath = route.url.startsWith('/ediciones/') ? (route.year === 2026 ? '/ediciones/2026/' : '/ediciones/') : route.url;
 shell = shell.replace(/(<nav\b[^>]*id="main-nav"[^>]*>)([\s\S]*?)(<\/nav>)/, (all,start,content,end) => start + content.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g,(m,a,href,b)=>href===rootPrefix+navPath.slice(1)?`<a${a}href="${href}"${b} aria-current="page">`:m).replace('class="editions-toggle"',`class="editions-toggle${route.url.startsWith('/ediciones/')?' is-current':''}"`) + end);
 const metadata = buildSeoHead({path:route.url, html:main, edition:route.edition, image:shareImage(route.edition?.cover)});
 shell = mustReplace(shell, '</head>', metadata + `\n<link rel="stylesheet" href="${rootPrefix}assets/site.css">\n</head>`);
 if (route.url === '/') shell = shell.replace('</head>', `<link rel="stylesheet" href="${rootPrefix}assets/event-invitation.css">\n</head>`);
 if (invitation) shell = shell.replace('</body>', `<script src="${rootPrefix}assets/event-invitation.js" defer></script>\n</body>`);
 shell = shell.replace('</body>', `<script src="${rootPrefix}carousels.js" defer></script>\n<script src="${rootPrefix}assets/site-runtime.js" defer></script>\n</body>`);
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,shell);
}
fs.writeFileSync(path.join(root,'sitemap.xml'),buildSitemap(routes.map(r=>r.url)));
fs.writeFileSync(path.join(root,'robots.txt'),buildRobots());
fs.writeFileSync(path.join(root,'scripts/generated-routes.json'),JSON.stringify(routes.map(r=>r.url),null,2)+'\n');

// Netlify publishes only dist/. Templates, scripts, docs and data files stay private;
// anything new must be added here on purpose to become public.
const PUBLIC_FILES = ['index.html', 'informe.html', 'favicon.webp', 'carousels.css', 'carousels.js',
 'robots.txt', 'sitemap.xml', '_headers', '_redirects', 'assets',
 ...new Set(routes.filter(r => r.url !== '/').map(r => r.url.split('/')[1]))];
const dist = path.join(root, 'dist');
fs.rmSync(dist, {recursive:true, force:true});
for (const name of PUBLIC_FILES) fs.cpSync(path.join(root, name), path.join(dist, name), {recursive:true});
console.log(`Generated ${routes.length} static pages with original visual templates; published files copied to dist/.`);
