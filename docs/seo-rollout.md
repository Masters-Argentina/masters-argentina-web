# SEO rollout notes

The November 10 technical update applies the supplied SEO feedback while preserving the existing visual design. It introduces real static section/year pages, per-page metadata, structured data grounded in existing content, a sitemap, robots.txt, image dimensions and a text-bearing accessible home H1. The archive index retains its current complete appearance; individual year pages isolate the existing year's content.

## Domain ownership and migration

The configured production origin is `https://www.mastersargentina.org`. The user authorized the main-domain migration on November 10, 2026. The original Weebly site is preserved at `https://old.mastersargentina.org`; `/oldpage` redirects there. The domain remains registered and DNS-managed through Weebly. Email, Brevo, nameservers, and conference subdomain records are retained.

`legacy-redirects.csv` inventories the 57 URLs retrieved from the original sitemap plus homepage. Section and matching conference overviews redirect to the corresponding new page; unique historical pages redirect to the exact original page on the archive. The cancelled 2020 conference page remains on the archive because it is not equivalent to the new webinar summary. The newsletter uses its original Weebly page and form IDs on the archive, with a temporary redirect from its old main-domain address. Historical source links go directly to the archive to avoid pointing back to their own new summary pages. Uploaded-file URLs also redirect to the archive. No catch-all redirect masks unknown URLs.

DNS cutover: root A `75.2.60.5`; `www` CNAME `keen-faun-89f080.netlify.app`; `old` A `199.34.228.79` and `www.old` CNAME `old.mastersargentina.org` (added by Weebly's connection flow). Check Netlify's certificate and primary-hostname status after propagation. See `domain-rollback.txt` for the original values and recovery steps.

Hash fragments are not sent to the server. Old `#` bookmarks use client-side compatibility navigation, not claimed HTTP 301 redirects.

## Separate 2026 properties

The existing `conferencia2026.mastersargentina.org` and `2026.mastersargentina.org` properties remain unchanged. The organization must select an authoritative 2026 destination and decide whether to consolidate those sites or retain a distinct archive summary. This update does not redirect those properties, claim ownership of them, or shorten the current visible 2026 page. Its canonical identifies the current Netlify archive page only.

## Search Console and measurement

An owner with appropriate access should verify the chosen production property in Google Search Console, submit `/sitemap.xml`, and inspect representative URLs after publication. No Search Console or Analytics access was granted or changed by this update. Compare indexing and traffic after the final domain migration; valid structured data does not guarantee a rich result. FAQ rich results have restricted eligibility.

## Editorial follow-ups deliberately excluded

A new press section, verified official university counts, removal of placeholder copy, new photos and agenda transcriptions would change visible content or require editorial evidence. They remain editorial follow-ups. Event 2027 schema must wait for exact confirmed dates and an appropriate confirmed venue; a month and city are insufficient. Existing ticket buttons remain disabled.

## Future verification

After rebuilding, inspect the raw HTML of every public route, confirm title/description/canonical/Open Graph agreement, parse JSON-LD and sitemap XML, and test old hash links and nested-page assets. Compare desktop and mobile layout against the approved design. Before a custom-domain launch, test every approved legacy redirect and verify that external newsletter, social, gallery and presentation links still reach their intended services.
