# SEO rollout notes

The November 10 technical update applies the supplied SEO feedback while preserving the existing visual design. It introduces real static section/year pages, per-page metadata, structured data grounded in existing content, a sitemap, robots.txt, image dimensions and a text-bearing accessible home H1. The archive index retains its current complete appearance; individual year pages isolate the existing year's content.

## Content brief (November 17)

The site follows the content brief «Contenido SEO para el nuevo sitio · Masters Argentina»:

- **Section 1:** every page uses the brief's title, meta description and H1 (`PAGE_COPY` in `scripts/seo.mjs`). New pages: `/preguntas-frecuentes/` (the visible FAQ block, with the brief's answers and its ninth question) and `/prensa/` (coverage migrated from the original press page, in `scripts/press.mjs`).
- **Section 2:** Open Graph and Twitter tags mirror the title, description and canonical. Every share image is a 1200×630 JPEG: the 2026 group photo with the flag and the logo for general pages, a generic 2027 image with the logo for `/conferencia/`, and each edition's cover for edition pages (`assets/og/` or Cloudinary).
- **Section 3:** the 58 original URLs redirect permanently to their new pages (`_redirects`, `legacy-redirects.csv`).
- **Section 4:** Organization (with `foundingDate`), one Event per in-person edition with the brief's dates, venue and `EventScheduled`, BreadcrumbList on internal pages and FAQPage on `/preguntas-frecuentes/`. `performer` lists the speakers the page names: the brief's 2026 list and the speaker cards of 2023–2025. Earlier archive pages show speakers only as unnamed images, so they carry no `performer`.

Not applied, pending a decision or content from the organization:

- **`/privacidad`:** the only existing policy covers registration for the 2023 Stop & Go event, not the newsletter or other events the brief describes. A general policy must be written and approved; until then `/privacypolicies` keeps pointing to the archive.
- **Newsletter:** as the brief says, its old address is not redirected to the new site until the form is migrated.
- **`www` host:** the brief writes URLs with `www`; the configured primary domain is the apex and `www` redirects to it. Switching requires changing the primary domain in Netlify together with `SITE_ORIGIN`.
- **2020 and 2021 Events:** no exact dates (the brief asks to validate 2021); the 2020 Chicago conference could be marked `EventCancelled` once its planned dates are confirmed.
- **Links to the archive:** each edition section was compared with the original Weebly page it came from. The 29 sections that already contain everything (only outdated disclaimers or a degree name missing) no longer link to the archive. The 2019 press section links to `/prensa/`, and the empty 2022 «Fotos» section (also empty on Weebly) was removed. Three links remain, labelled «Más detalles en el archivo original», because the archive still has content the new page lacks: the 2019 agenda (times and the Georgetown Law Center venue), the 2019 venues (Sunday events) and the 2018 venue photos. Migrating that content would let them go too.
- **Archive in search engines:** the pages on `old.mastersargentina.org` have no canonical or `noindex`, and the archive publishes its own sitemap, so Google can index them as duplicates of the new edition pages. In Weebly, either point each page's canonical to its new page or hide the archive from search engines (and drop its sitemap). This needs access to the Weebly account.
- **2016 share image:** the only 2016 cover is 400×266, so its 1200×630 version is upscaled; a larger photo would look sharper.

## Domain ownership and migration

The configured production origin is `https://mastersargentina.org` (`www` redirects to the apex primary hostname). The user authorized the main-domain migration on November 10, 2026. The original Weebly site is preserved at `https://old.mastersargentina.org`; `/oldpage` redirects there. The domain remains registered and DNS-managed through Weebly. Email, Brevo, nameservers, and conference subdomain records are retained.

`legacy-redirects.csv` inventories the 57 URLs retrieved from the original sitemap plus homepage. Following the content brief (section 3), every page redirects permanently to the new page that covers it, including agendas, teams, sponsors and webinars, which go to their edition page. The original pages stay readable on the archive and are linked from each edition page. The newsletter uses its original Weebly page and form IDs on the archive, with a temporary redirect from its old main-domain address. Historical source links go directly to the archive to avoid pointing back to their own new summary pages. Uploaded-file URLs also redirect to the archive. No catch-all redirect masks unknown URLs.

DNS cutover: root A `75.2.60.5`; `www` CNAME `keen-faun-89f080.netlify.app`; `old` A `199.34.228.79` and `www.old` CNAME `old.mastersargentina.org` (added by Weebly's connection flow). Verified November 10, 2026 at 22:13 UTC: valid Netlify-managed Let's Encrypt certificate for apex and `www`, automatic renewal, HTTP-to-HTTPS redirects, `www`-to-apex redirect, homepage, archive shortcut and newsletter destination. The certificate expires February 8, 2027; Netlify shows automatic renewal before that date. See `domain-rollback.txt` for the original values and recovery steps.

Hash fragments are not sent to the server. Old `#` bookmarks use client-side compatibility navigation, not claimed HTTP 301 redirects.

## Separate 2026 properties

The existing `conferencia2026.mastersargentina.org` and `2026.mastersargentina.org` properties remain unchanged. The organization must select an authoritative 2026 destination and decide whether to consolidate those sites or retain a distinct archive summary. This update does not redirect those properties, claim ownership of them, or shorten the current visible 2026 page. Its canonical identifies the current Netlify archive page only.

## Search Console and measurement

An owner with appropriate access should verify the chosen production property in Google Search Console, submit `/sitemap.xml`, and inspect representative URLs after publication. No Search Console or Analytics access was granted or changed by this update. Compare indexing and traffic after the final domain migration; valid structured data does not guarantee a rich result. FAQ rich results have restricted eligibility.

## Editorial follow-ups deliberately excluded

Verified official university counts, removal of placeholder copy, new photos and agenda transcriptions would change visible content or require editorial evidence. They remain editorial follow-ups. Event 2027 schema must wait for exact confirmed dates and an appropriate confirmed venue; a month and city are insufficient. Existing ticket buttons remain disabled.

## Future verification

After rebuilding, inspect the raw HTML of every public route, confirm title/description/canonical/Open Graph agreement, parse JSON-LD and sitemap XML, and test old hash links and nested-page assets. Compare desktop and mobile layout against the approved design. Before a custom-domain launch, test every approved legacy redirect and verify that external newsletter, social, gallery and presentation links still reach their intended services.
