'use strict';
// Hydrate the server-delivered HTML without replacing its content.
function initAboutPage(){
 const root=document.querySelector('.about-page');if(!root)return;
 root.querySelectorAll('[data-about-jump]').forEach(b=>b.addEventListener('click',()=>{const target=document.getElementById(b.dataset.aboutJump);target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
 root.querySelectorAll('[data-about-team]').forEach(b=>b.addEventListener('click',()=>{
  const target=document.getElementById(`about-panel-${b.dataset.aboutTeam}`);
  if(!target)return;
  target.focus({preventScroll:true});
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }));

}
function initArchiveCarousels(){
 document.querySelectorAll('.conference-archive-carousels,.conference-universities').forEach(area=>{
 const button=area.querySelector('.conference-carousel-toggle');
 if(!button)return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){button.hidden=true;return;}
 button.addEventListener('click',()=>{const paused=button.getAttribute('aria-pressed')!=='true';area.classList.toggle('is-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Reanudar carruseles':'Pausar carruseles';});
 });
}
function initContact(){document.querySelectorAll('[data-contact-jump]').forEach(button=>button.addEventListener('click',()=>{const target=document.getElementById(`contact-${button.dataset.contactJump}`);if(!target)return;target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));}
let cleanupHistoryTimeline = () => {};
function initHistory(){
 cleanupHistoryTimeline();
 const page=document.querySelector('.history-page');
 if(!page)return;
 initHistoryTimeline(page);
 
 document.querySelectorAll('.history-materials details').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)details.querySelectorAll('iframe[data-history-src]').forEach(frame=>{if(frame.closest('details')!==details)return;frame.src=frame.dataset.historySrc;frame.removeAttribute('data-history-src');});}));
}
function initHistoryTimeline(page){
 const bar=page.querySelector('.history-timeline-bar');
 const rail=bar.querySelector('.history-years');
 const header=document.querySelector('.site-header');
 const buttons=[...rail.querySelectorAll('[data-history-year]')];
 const sections=[...page.querySelectorAll('.history-edition')];
 let frame=0,activeYear='';
 const update=()=>{
  frame=0;
  if(!page.isConnected)return;
  const headerHeight=header.getBoundingClientRect().height;
  const barHeight=bar.getBoundingClientRect().height;
  page.style.setProperty('--history-header-height',headerHeight+'px');
  page.style.setProperty('--history-nav-height',barHeight+'px');
  page.style.setProperty('--history-scroll-padding',getComputedStyle(document.documentElement).scrollPaddingTop);
  const readingLine=headerHeight+barHeight+56;
  let current=sections[0];
  for(const section of sections){
   if(section.getBoundingClientRect().top<=readingLine)current=section;
   else break;
  }
  const year=current.id.replace('history-','');
  if(year===activeYear)return;
  activeYear=year;
  const activeIndex=buttons.findIndex(b=>b.dataset.historyYear===year);
  buttons.forEach((button,index)=>{
   if(index===activeIndex)button.setAttribute('aria-current','step');
   else button.removeAttribute('aria-current');
   button.closest('li').classList.toggle('is-passed',index<activeIndex);
  });
  const selected=buttons[activeIndex];
  const selectedRect=selected.getBoundingClientRect(),railRect=rail.getBoundingClientRect();
  if(selectedRect.left<railRect.left+8||selectedRect.right>railRect.right-8){
   rail.scrollTo({left:rail.scrollLeft+selectedRect.left-railRect.left-(rail.clientWidth-selectedRect.width)/2,behavior:'instant'});
  }
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 const observer=new ResizeObserver(schedule);
 observer.observe(header);observer.observe(bar);observer.observe(page);
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 cleanupHistoryTimeline=()=>{
  window.removeEventListener('scroll',schedule);
  window.removeEventListener('resize',schedule);
  observer.disconnect();cancelAnimationFrame(frame);
 };
 update();
}
function initEdition2026(){document.querySelectorAll('.edition-2026 img').forEach(img=>{img.addEventListener('error',()=>{img.hidden=true;const fallback=document.createElement('span');fallback.className='e26-image-fallback';fallback.textContent=img.alt||'Foto de Miami 2026';img.after(fallback);},{once:true});});document.querySelectorAll('[data-e26-jump]').forEach(button=>button.addEventListener('click',()=>{document.getElementById(button.dataset.e26Jump)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));}

const nav = document.getElementById('main-nav');
const toggle = document.querySelector('.menu-toggle');
const editionsToggle = document.querySelector('.editions-toggle');
const editionsSubmenu = document.getElementById('editions-submenu');
function closeEditions(returnFocus=false){editionsSubmenu.hidden=true;editionsToggle.setAttribute('aria-expanded','false');if(returnFocus)editionsToggle.focus();}
editionsToggle.addEventListener('click',()=>{const open=editionsToggle.getAttribute('aria-expanded')!=='true';editionsToggle.setAttribute('aria-expanded',String(open));editionsSubmenu.hidden=!open;});
editionsToggle.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();editionsSubmenu.hidden=false;editionsToggle.setAttribute('aria-expanded','true');editionsSubmenu.querySelector('a').focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.editions-dropdown'))closeEditions();});
document.querySelector('.editions-dropdown').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))closeEditions();});

function closeMenu(returnFocus=false){closeEditions();nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='＋';if(returnFocus)toggle.focus();}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('span').textContent=open?'−':'＋';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!editionsSubmenu.hidden)closeEditions(true);else if(nav.classList.contains('open'))closeMenu(true);}});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
// En Inicio, el logo del encabezado aparece cuando el principal deja de verse.
function updateHeaderBrand(){
 const header=document.querySelector('.site-header');
 const brand=header?.querySelector('.brand');
 if(!brand)return;
 const heroLogo=document.querySelector('.home-cover #home-title img');
 let hide=false;
 if(heroLogo){
  const logoRect=heroLogo.getBoundingClientRect();
  const headerBottom=header.getBoundingClientRect().bottom;
  hide=logoRect.bottom>headerBottom && logoRect.top<window.innerHeight;
 }
 brand.classList.toggle('is-hidden-by-home-logo',hide);
 brand.inert=hide;
 if(hide)brand.setAttribute('aria-hidden','true');else brand.removeAttribute('aria-hidden');
}
let headerBrandFrame=0;
function scheduleHeaderBrandUpdate(){
 if(headerBrandFrame)return;
 headerBrandFrame=requestAnimationFrame(()=>{headerBrandFrame=0;updateHeaderBrand();});
}
window.addEventListener('scroll',scheduleHeaderBrandUpdate,{passive:true});
window.addEventListener('resize',scheduleHeaderBrandUpdate);
window.addEventListener('pageshow',scheduleHeaderBrandUpdate);
window.addEventListener('load',scheduleHeaderBrandUpdate);

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
