#!/usr/bin/env python3
"""Independent acceptance audit for the generated Masters Argentina static site.

No requests are made and no site files are modified. Run after build:
  python3 scripts/verify-site.py --site .
The --base-path pass simulates GitHub Pages subdirectory URL resolution.
"""
from __future__ import annotations
import argparse
from collections import Counter
import html
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urljoin, urlparse
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

REQUIRED = ['/', '/quienes-somos/', '/conferencia/', '/contacto/', '/ediciones/'] + [f'/ediciones/{year}/' for year in range(2016, 2027)]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--site', type=Path, required=True)
parser.add_argument('--baseline', type=Path)
parser.add_argument('--baseline-rendered', type=Path, help='JSON from render_baseline.mjs for complete per-route content/link preservation checks')
parser.add_argument('--origin', default='https://www.mastersargentina.org')
parser.add_argument('--base-path', default='/')
parser.add_argument('--report', type=Path)
a = parser.parse_args()
site = a.site.resolve()
origin = a.origin.rstrip('/')
base = '/' + a.base_path.strip('/') + '/' if a.base_path.strip('/') else '/'
errors, warnings, facts = [], [], {}
def problem(message, warning=False):
    (warnings if warning else errors).append(message)
def check(condition, message):
    if not condition: problem(message)
def page_file(route):
    return site / route.strip('/') / 'index.html' if route != '/' else site / 'index.html'
def canonical(route):
    return origin + route

def ld_nodes(value):
    if isinstance(value, list):
        for item in value: yield from ld_nodes(item)
    elif isinstance(value, dict):
        yield value
        for key, child in value.items():
            if isinstance(child, (dict, list)): yield from ld_nodes(child)
def is_type(node, value):
    types = node.get('@type', [])
    return value in (types if isinstance(types, list) else [types])
def local_target(ref, document_url, label, anchor=False):
    """Check local path resolution under a production or simulated subdir mount."""
    if not ref or ref.startswith(('data:', 'mailto:', 'tel:', 'javascript:', 'blob:')): return
    result = urlparse(urljoin(document_url, ref))
    if result.scheme not in ('http', 'https') or result.netloc != urlparse(origin).netloc: return
    path = unquote(result.path)
    if base != '/' and not path.startswith(base):
        problem(f'{label}: local reference escapes simulated base {base}: {ref}')
        return
    relative = path[len(base):] if path.startswith(base) else path.lstrip('/')
    target = site / relative
    candidates = [target / 'index.html'] if path.endswith('/') or target.is_dir() else [target, target.with_suffix('.html'), target / 'index.html']
    found = next((p for p in candidates if p.is_file()), None)
    if not found:
        problem(f'{label}: unresolved local reference {ref} -> {relative}')
        return
    if anchor and result.fragment and found.suffix == '.html':
        fragment = unquote(result.fragment)
        soup = BeautifulSoup(found.read_text(), 'html.parser')
        if not soup.find(id=fragment) and not soup.find(attrs={'name':fragment}):
            problem(f'{label}: unresolved fragment #{fragment} in {found.relative_to(site)}')

page_soups, title_counts, description_counts, social_images = {}, Counter(), Counter(), set()
for route in REQUIRED:
    p = page_file(route)
    if not p.exists():
        problem(f'Missing required route {route}: {p}')
        continue
    raw = p.read_text()
    s = BeautifulSoup(raw, 'html.parser'); page_soups[route] = s
    pageurl = origin + base + route.lstrip('/')
    main = s.find('main')
    check(main is not None, f'{route}: missing main')
    if main:
        clean = BeautifulSoup(str(main), 'html.parser')
        for n in clean(['script','style','noscript','svg']):n.decompose()
        text = clean.get_text(' ', strip=True)
        check(len(text) >= 200, f'{route}: main lacks sufficient delivered HTML text ({len(text)} chars)')
        check(len(main.find_all('h1')) == 1, f'{route}: expected exactly one H1 in main')
        for h in main.find_all('h1'):
            check(bool(h.get_text(' ',strip=True)),f'{route}: H1 has no literal text')
        facts.setdefault('main_text_characters', {})[route] = len(text)
    titles = s.find_all('title')
    check(len(titles)==1 and bool(titles[0].get_text(strip=True)),f'{route}: expected one nonempty title')
    if titles:
        title=titles[0].get_text(strip=True);title_counts[title]+=1
        check('Masters Argentina' in title, f'{route}: title lacks brand')
        check('Versión mínima' not in title and 'Propuesta' not in title,f'{route}: prototype language in title')
    descriptions = s.find_all('meta',attrs={'name':'description'})
    check(len(descriptions)==1 and bool(descriptions[0].get('content','').strip()),f'{route}: expected one nonempty description')
    if descriptions:description_counts[descriptions[0].get('content','')]+=1
    canonical_tags = s.find_all('link',attrs={'rel':lambda value: value and 'canonical' in value})
    check(len(canonical_tags)==1,f'{route}: expected one canonical')
    if canonical_tags:check(canonical_tags[0].get('href')==canonical(route),f'{route}: canonical not {canonical(route)}')
    for prop in ['og:title','og:description','og:url','og:type','og:image']:
        tags=s.find_all('meta',attrs={'property':prop})
        check(len(tags)==1 and bool(tags[0].get('content','').strip()),f'{route}: missing or duplicate {prop}')
        if tags and prop=='og:url':check(tags[0]['content']==canonical(route),f'{route}: og:url differs from canonical')
        if tags and prop=='og:image':
            value=tags[0].get('content','');social_images.add(value)
            check(value.startswith('https://'),f'{route}: og:image must be absolute HTTPS')
    nodes=[]
    for tag in s.find_all('script',type='application/ld+json'):
        try:nodes.extend(ld_nodes(json.loads(tag.string or tag.get_text())))
        except (ValueError,TypeError) as exc:problem(f'{route}: invalid JSON-LD: {exc}')
    check(any(is_type(n,'Organization') for n in nodes),f'{route}: Organization JSON-LD missing')
    for node in nodes:
        if is_type(node,'Event'):
            check(route.startswith('/ediciones/'),f'{route}: unexpected Event schema outside historical edition')
            check(not str(node.get('startDate','')).startswith('2027'),f'{route}: unconfirmed 2027 Event must be omitted')
            check(bool(node.get('name')),f'{route}: Event has no name')
            check(bool(node.get('startDate')),f'{route}: Event has no factual date')
            check(bool(node.get('location')),f'{route}: Event has no location')
            if route.startswith('/ediciones/') and route != '/ediciones/':
                year=route.strip('/').split('/')[-1]
                check(str(node.get('startDate','')).startswith(year),f'{route}: Event year mismatch')
            if route=='/ediciones/2020/' and 'OnlineEventAttendanceMode' not in str(node):
                check('EventCancelled' in str(node.get('eventStatus','')),f'{route}: canceled in-person event not marked canceled')
        if is_type(node,'FAQPage'):
            check(route=='/contacto/',f'{route}: FAQPage schema attached to unexpected page')
            for question in node.get('mainEntity',[]):
                check(bool(question.get('name')),f'{route}: FAQ question missing name')
                check(bool(question.get('acceptedAnswer',{}).get('text')),f'{route}: FAQ answer missing text')
                q=BeautifulSoup(question.get('name',''),'html.parser').get_text(' ',strip=True)
                visible=' '.join(s.get_text(' ',strip=True).split())
                check(' '.join(q.split()) in visible,f'{route}: schema question absent from delivered visible text: {q}')
    if route=='/contacto/':check(any(is_type(n,'FAQPage') for n in nodes),f'{route}: FAQPage JSON-LD missing')
    if route.startswith('/ediciones/') and route != '/ediciones/':
        year=int(route.strip('/').split('/')[-1])
        sections={str(x.get('id')) for x in s.select('.history-edition')}
        if year < 2026:check(sections=={f'history-{year}'},f'{route}: year isolation failed: {sorted(sections)}')
        else:
            check(bool(s.select('.edition-2026')),f'{route}: missing 2026 page wrapper')
            check(not sections,f'{route}: unrelated historical editions included')
    for image in s.find_all('img'):
        src=image.get('src','')
        check(bool(src),f'{route}: image missing src')
        check(not src.startswith('data:'),f'{route}: embedded image regressed')
        check('alt' in image.attrs,f'{route}: image missing alt: {src}')
        for dim in ['width','height']:
            check(str(image.get(dim,'')).isdigit() and int(image.get(dim,'0'))>0,f'{route}: image lacks positive {dim}: {src}')
        local_target(src,pageurl,route+' img')
        if image.get('fetchpriority')=='high':check(image.get('loading')!='lazy',f'{route}: high-priority image lazy loaded')
    for tag in s.find_all(['a','script','link','iframe','source']):
        attr='href' if tag.name in ['a','link'] else 'src'
        if tag.name=='link' and any(x in tag.get('rel',[]) for x in ['canonical','preconnect','dns-prefetch']):continue
        local_target(tag.get(attr),pageurl,route+' '+tag.name,anchor=tag.name=='a')
    for tag in s.find_all(attrs={'data-history-src':True}):local_target(tag['data-history-src'],pageurl,route+' embed')
    facts.setdefault('page_bytes',{})[route]=len(raw.encode())

for title,count in title_counts.items():check(count==1,f'Duplicate title on {count} pages: {title}')
for description,count in description_counts.items():check(count==1,f'Duplicate description on {count} pages: {description}')
facts['required_routes']=len(REQUIRED);facts['checked_routes']=len(page_soups);facts['social_images']=sorted(social_images)

sitemap=site/'sitemap.xml'
if not sitemap.exists():problem('Missing sitemap.xml')
else:
    try:
        root=ET.fromstring(sitemap.read_text())
        locations=[n.text for n in root.findall('.//{*}loc')]
        expected={canonical(r) for r in REQUIRED}
        check(len(locations)==len(set(locations)),'Duplicate sitemap URLs')
        check(set(locations)==expected,f'Sitemap mismatch: missing {sorted(expected-set(locations))}, unexpected {sorted(set(locations)-expected)}')
        check(all('#' not in u for u in locations),'Hash URLs in sitemap')
        facts['sitemap_urls']=len(locations)
    except ET.ParseError as exc:problem(f'Invalid sitemap XML: {exc}')
robots=site/'robots.txt'
if not robots.exists():problem('Missing robots.txt')
else:
    content=robots.read_text()
    check(re.search(r'^Sitemap:\s*'+re.escape(origin+'/sitemap.xml')+r'\s*$',content,re.M|re.I) is not None,'robots sitemap origin mismatch/missing')
    check(re.search(r'^Disallow:\s*/\s*$',content,re.M|re.I) is None,'robots blocks all public pages')

# Original literal external links must survive somewhere in generated public pages.
# Dynamic template URLs are reported separately; arbitrary prose/script URLs are not treated as links.
if a.baseline and (a.baseline/'index.html').exists():
    before=(a.baseline/'index.html').read_text()
    literals=set(html.unescape(x) for x in re.findall(r'<a\b[^>]*?\bhref=[\"\'](https?://[^\"\']+)[\"\']',before) if '${' not in x)
    literals.update(html.unescape(x) for x in re.findall(r'external\([\"\'](https?://[^\"\']+)[\"\']',before))
    after={html.unescape(t.get('href','')) for s in page_soups.values() for t in s.find_all('a',href=True)}
    missing=sorted(literals-after)
    facts['baseline_literal_external_links']=len(literals)
    facts['missing_external_links']=missing
    for value in missing:problem('Original external link not found in generated pages: '+value)
else:problem('Baseline not available; external-link preservation not checked',warning=True)

if a.baseline_rendered:
    rendered=json.loads(a.baseline_rendered.read_text())
    for route,markup in rendered.items():
        if route not in page_soups:continue
        before=BeautifulSoup(markup,'html.parser')
        after=BeautifulSoup(str(page_soups[route].find('main')),'html.parser')
        for text in after.select('#home-title .sr-only'):text.decompose()
        check(before.get_text(' ',strip=True)==after.get_text(' ',strip=True),f'{route}: existing visible text changed')
        oldlinks={tag['href'] for tag in before.find_all('a',href=True) if tag['href'].startswith(('https:','http:','mailto:'))}
        newlinks={tag['href'] for tag in after.find_all('a',href=True) if tag['href'].startswith(('https:','http:','mailto:'))}
        check(not oldlinks-newlinks,f'{route}: lost existing external links: {sorted(oldlinks-newlinks)}')
        facts.setdefault('preserved_external_links_by_route',{})[route]=len(oldlinks)
    facts['existing_view_text_comparisons']=len(rendered)

report={'passed':not errors,'site':str(site),'origin':origin,'simulated_base_path':base,'errors':errors,'warnings':warnings,'facts':facts}
if a.report:
    a.report.parent.mkdir(parents=True,exist_ok=True)
    a.report.write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(report,indent=2,ensure_ascii=False))
sys.exit(0 if not errors else 1)
