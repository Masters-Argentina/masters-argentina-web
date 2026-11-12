/** Generate crawlable static pages from the existing presentation templates.
 * No network, package dependencies, or browser rendering is required.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildSeoHead, buildSitemap, buildRobots } from './seo.mjs';
import { renderEventInvitation, renderEventInvitationLink } from './event-invitation.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'source/site.html'), 'utf8');
const scripts = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const assetMap = JSON.parse(scripts.find(s => /id="asset-paths"/.test(s[1]))[2]);
const historyScript = scripts.find(s => s[2].includes('const HISTORY_EDITIONS'))[2];
const pageScript = scripts.find(s => s[2].includes('const CONFERENCIA'))[2];
const cloudMap = JSON.parse(fs.readFileSync(path.join(root, 'cloudinary-images.json'), 'utf8'));
const dimensions = JSON.parse(fs.readFileSync(path.join(root, 'scripts/image-dimensions.json'), 'utf8'));
const context = vm.createContext({ console });
vm.runInContext(historyScript + '\n' + pageScript.slice(0, pageScript.indexOf('const nav =')), context);
const editions = vm.runInContext('JSON.parse(JSON.stringify(HISTORY_EDITIONS))', context);
const render = expression => vm.runInContext(expression, context);
const excerpt = (start, end) => pageScript.slice(pageScript.indexOf(start), pageScript.indexOf(end, pageScript.indexOf(start)));
const originalStyles = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const styles = originalStyles.replaceAll('.history-years button', '.history-years :is(button,a)') + '\n.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n.history-years a:hover{text-decoration:none}\n';
fs.writeFileSync(path.join(root, 'assets/site.css'), styles);
const runtime = `'use strict';\n// Hydrate the server-delivered HTML without replacing its content.\n` +
excerpt('function initAboutPage()', 'const archiveCircleRail') +
excerpt('function initArchiveCarousels()', 'const CONFERENCE_UNIVERSITIES') +
excerpt('function initContact()', 'const EDITIONS') +
excerpt('let cleanupHistoryTimeline', 'const editions =').replace("document.querySelectorAll('[data-history-year]').forEach(button=>button.addEventListener('click',()=>{const target=document.getElementById(`history-${button.dataset.historyYear}`);if(!target)return;target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));", '') +
excerpt('function initEdition2026()', 'const routes =') +
excerpt('const nav =', 'function render(') + `
function legacyDestination(hash) {
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

const routes = [
 {url:'/', expression:'home()'},
 {url:'/quienes-somos/', expression:'about()'},
 {url:'/conferencia/', expression:'conference()'},
 {url:'/contacto/', expression:'contact()'},
 {url:'/ediciones/', expression:'historyPage()', history:true},
 ...editions.map(e => ({url:`/ediciones/${e.year}/`, year:e.year, edition:e, history:true})),
 {url:'/ediciones/2026/', expression:'edition2026()', year:2026, edition:{year:2026, city:'Miami', date:'10 y 11 de abril de 2026', venue:'Florida International University', title:'Ponerse la celeste y blanca: talento con impacto', startDate:'2026-04-10', endDate:'2026-04-11'}}
];
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
function routeHref(value) {
 if (value === '#inicio') return '';
 if (value === '#contenido') return value;
 const match = value.match(/^#(quienes-somos|conferencia|contacto|ediciones)(?:\/([^#]+))?$/);
 if (!match) return value;
 const [,section,detail] = match;
 if (section === 'contacto' && detail) return `contacto/#contact-${detail}`;
 if (section === 'ediciones' && detail) return `ediciones/${detail}/`;
 return `${section}/`;
}
function transformHtml(html, route, prefix) {
 html = html.replace(/<a\b[^>]*aria-label="Edición (\d{4}):[^>]*>/g,
  (tag, year) => tag.replace(/href="#[^"]*"/, `href="#ediciones/${year}"`));
 html = html.replace(/<button\b([^>]*\bdata-history-year="(\d+)"[^>]*)>([\s\S]*?)<\/button>/g,
  (all,attrs,year,inner) => `<a${attrs.replace(/\s*type="button"/,'')} href="#ediciones/${year}">${inner}</a>`);
 if (route.url === '/') html = html.replace('<h1 id="home-title"><img', '<h1 id="home-title"><span class="sr-only">Masters Argentina · Conferencia de estudiantes argentinos de posgrado</span><img').replace(/(<h1 id="home-title">[\s\S]*?<img[^>]*?)alt="Masters Argentina"/, '$1alt="" aria-hidden="true"');
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
 main = transformHtml(main, route, rootPrefix);
 let shell = source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '');
 // The source is not a public landing page. Its noindex directive must not
 // propagate into the generated, indexable production pages.
 shell = shell.replace(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi, '');
 shell = shell.replace(/<meta\b[^>]*name="description"[^>]*>/, '').replace(/<title>[\s\S]*?<\/title>/, '');
 shell = shell.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, '<main id="contenido" tabindex="-1">__PRERENDERED_CONTENT__</main>');
 shell = transformHtml(shell, {...route, history:false}, rootPrefix);
 shell = shell.replace('__PRERENDERED_CONTENT__', main);
 shell = shell.replace('<body>', `<body data-site-root="${rootPrefix}" data-page-path="${route.url}">`);
 // Current navigation state is present even with JavaScript disabled.
 const navPath = route.url.startsWith('/ediciones/') ? (route.year === 2026 ? '/ediciones/2026/' : '/ediciones/') : route.url;
 shell = shell.replace(/(<nav\b[^>]*id="main-nav"[^>]*>)([\s\S]*?)(<\/nav>)/, (all,start,content,end) => start + content.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g,(m,a,href,b)=>href===rootPrefix+navPath.slice(1)?`<a${a}href="${href}"${b} aria-current="page">`:m).replace('class="editions-toggle"',`class="editions-toggle${route.url.startsWith('/ediciones/')?' is-current':''}"`) + end);
 const metadata = buildSeoHead({path:route.url, html:main, edition:route.edition, image:route.edition?.cover ? (assetMap[route.edition.cover] || route.edition.cover) : undefined});
 shell = shell.replace('</head>', metadata + `\n<link rel="stylesheet" href="${rootPrefix}assets/site.css">\n</head>`);
 if (route.url === '/') shell = shell.replace('</head>', `<link rel="stylesheet" href="${rootPrefix}assets/event-invitation.css">\n</head>`);
 if (invitation) shell = shell.replace('</body>', `<script src="${rootPrefix}assets/event-invitation.js" defer></script>\n</body>`);
 shell = shell.replace('</body>', `<script src="${rootPrefix}carousels.js" defer></script>\n<script src="${rootPrefix}assets/site-runtime.js" defer></script>\n</body>`);
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,shell);
}
fs.writeFileSync(path.join(root,'sitemap.xml'),buildSitemap(routes.map(r=>r.url)));
fs.writeFileSync(path.join(root,'robots.txt'),buildRobots());
fs.writeFileSync(path.join(root,'scripts/generated-routes.json'),JSON.stringify(routes.map(r=>r.url),null,2)+'\n');
console.log(`Generated ${routes.length} static pages with original visual templates.`);
