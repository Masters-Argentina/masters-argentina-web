# Masters Argentina

Static website for Masters Argentina. Configured production domain: https://mastersargentina.org/ (`www` redirects to this primary hostname).

Original site: https://old.mastersargentina.org/ (also reachable through `/oldpage`). Netlify preview: https://keen-faun-89f080.netlify.app/. DNS propagation and HTTPS provisioning must complete before the custom-domain launch is considered verified. Recovery instructions: `docs/domain-rollback.txt`.

Netlify deploys `main` from `Masters-Argentina/masters-argentina-web` automatically. The public pages contain their content in the delivered HTML; JavaScript enhances menus, carousels and interactions. No database, frontend framework or Cloudinary credentials are required.

## Edit and publish

1. Edit content and presentation in `source/site.html`. It is the shared source of the existing layouts, not a public landing page.
2. Edit titles, descriptions and structured-data rules in `scripts/seo.mjs`. Its `SITE_ORIGIN` is the production origin for canonical URLs, social metadata and the sitemap.
3. Run `node scripts/build.mjs` using Node.js 22 or newer. The build uses only Node's standard library and needs no package installation.
4. Review and commit both source changes and regenerated files. Push or merge into `main`.
5. Netlify runs the build and publishes the repository root. Follow progress in the [deploy dashboard](https://app.netlify.com/projects/keen-faun-89f080/deploys).

Generated files should not be edited directly: root `index.html`, section/year `index.html` pages, `assets/site.css`, `assets/site-runtime.js`, `sitemap.xml`, and `robots.txt`. The existing GitHub Pages branch-root deployment serves the committed generated pages too; their canonicals point to Netlify.

## URLs

- `/`: home
- `/quienes-somos/`: community and team
- `/conferencia/`: next conference
- `/contacto/`: contact and FAQs (`#contact-preguntas`)
- `/ediciones/`: historical timeline and archive
- `/ediciones/2016/` through `/ediciones/2026/`: individual editions

Old hash-route bookmarks continue to work through a small compatibility script. Normal in-page anchors remain anchors. Real internal links work without JavaScript. Unsupported URLs are not rewritten to the homepage.

## Preview locally

After building, serve the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000/`. Nested pages also work when the whole site is served below a subdirectory, as on GitHub Pages.

## Images

115 unique images used in the current sections are hosted in Cloudinary cloud `lzfq7irq` under `masters-argentina/`. Historical-archive images retain their existing local files. External albums, institutional sites, videos, presentations and signup links retain their original destinations. Original image files remain in this repository as backups.

`cloudinary-images.json` records the delivery URL mapping; the source template contains the runtime-source equivalent as `CLOUDINARY_IMAGES`. When replacing an image, upload the new image, update both mappings, and update its dimensions in `scripts/image-dimensions.json` if necessary. Rebuild afterward. Use a new asset/version URL for a replacement so it is immediately distinguishable from cached images. Raster delivery uses automatic format/quality; SVGs and the favicon retain their original formats. Do not upload the historical library without a new request.

## Technical SEO

Each of the 16 public pages has a title, description, canonical URL, Open Graph and Twitter metadata. Organization JSON-LD is shared; FAQ markup matches the visible answered questions on Contact. Historical Event markup is emitted only when exact dates and venue information exist. Planned 2027 dates and incomplete 2020/2021 event information are not promoted to complete Event markup.

The home heading includes accessible brand text while preserving the logo appearance. Images have explicit dimensions where known, deferred loading where appropriate, and separate delivery URLs. Shared styling and behavior are cacheable files rather than duplicated template/data scripts.

`_headers` prevents indexing of source, scripts, documentation and the internal working document. `_redirects` contains only compatibility aliases for this recovered site. See [SEO rollout notes](docs/seo-rollout.md) for the remaining domain and editorial decisions.

## Validation

Run `node --test scripts/seo.test.mjs` after metadata changes. For the full generated-page audit, install the optional local checker dependency with `python3 -m pip install beautifulsoup4`, then run `python3 scripts/verify-site.py --site .`. Repeat with `--base-path /masters-argentina-web/` to check subdirectory links. The checker can accept `--baseline` and `--baseline-rendered` when comparing an earlier release. These checks are for local development; Netlify needs no Python dependencies.

## Origin and scope

Recovered from `https://darling-kataifi-d913db.netlify.app/masters_argentina_fran_10-28-2026` on November 10, 2026. The design, visible content, disabled-ticket behavior and external services are preserved. This repository does not include the backend or private source of linked external sites.
