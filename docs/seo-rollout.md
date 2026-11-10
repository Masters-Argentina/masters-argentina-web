# SEO rollout notes

The November 10 technical update applies the supplied SEO feedback while preserving the existing visual design. It introduces real static section/year pages, per-page metadata, structured data grounded in existing content, a sitemap, robots.txt, image dimensions and a text-bearing accessible home H1. The archive index retains its current complete appearance; individual year pages isolate the existing year's content.

## Domain ownership and migration

The current production origin is `https://keen-faun-89f080.netlify.app`. Changing to `www.mastersargentina.org` requires an explicit domain-cutover decision and control of the existing site/DNS. At cutover, update `SITE_ORIGIN` in `scripts/seo.mjs`, rebuild all pages, configure the custom domain in Netlify, and validate the old URL migration before changing DNS.

The supplied feedback references 57 Weebly URLs but does not contain their destinations. `legacy-redirects.csv` is an empty mapping template for the owning team: fill `legacy_url`, `new_path`, `evidence`, and `approved`. Validate each approved destination against a generated page before converting the rows into 301 rules. Do not route every old page to home or redirect the newsletter form to a non-equivalent page. The few rules already in `_redirects` are compatibility aliases for this recovered project; they are not the 57-URL Weebly migration.

Hash fragments are not sent to the server. Old `#` bookmarks use client-side compatibility navigation, not claimed HTTP 301 redirects.

## Separate 2026 properties

The existing `conferencia2026.mastersargentina.org` and `2026.mastersargentina.org` properties remain unchanged. The organization must select an authoritative 2026 destination and decide whether to consolidate those sites or retain a distinct archive summary. This update does not redirect those properties, claim ownership of them, or shorten the current visible 2026 page. Its canonical identifies the current Netlify archive page only.

## Search Console and measurement

An owner with appropriate access should verify the chosen production property in Google Search Console, submit `/sitemap.xml`, and inspect representative URLs after publication. No Search Console or Analytics access was granted or changed by this update. Compare indexing and traffic after the final domain migration; valid structured data does not guarantee a rich result. FAQ rich results have restricted eligibility.

## Editorial follow-ups deliberately excluded

A new press section, verified official university counts, removal of placeholder copy, new photos and agenda transcriptions would change visible content or require editorial evidence. They remain editorial follow-ups. Event 2027 schema must wait for exact confirmed dates and an appropriate confirmed venue; a month and city are insufficient. Existing ticket buttons remain disabled.

## Future verification

After rebuilding, inspect the raw HTML of every public route, confirm title/description/canonical/Open Graph agreement, parse JSON-LD and sitemap XML, and test old hash links and nested-page assets. Compare desktop and mobile layout against the approved design. Before a custom-domain launch, test every approved legacy redirect and verify that external newsletter, social, gallery and presentation links still reach their intended services.
