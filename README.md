# Masters Argentina

Portable copy of the published Masters Argentina project, downloaded on November 10, 2026.

This is a static website: no installation, build step, Node.js, database, or Netlify account is required. The original Spanish content, design, and client-side navigation are preserved.

## Netlify production deployment

Production URL: https://keen-faun-89f080.netlify.app/

Netlify project `keen-faun-89f080` deploys the `main` branch of `Masters-Argentina/masters-argentina-web`. Push or merge changes into `main` to publish an update automatically. Watch progress in the [Netlify deploy dashboard](https://app.netlify.com/projects/keen-faun-89f080/deploys).

`netlify.toml` keeps the publish directory at the repository root (`.`) and the build command empty. No environment variables or Cloudinary credentials are required. The existing GitHub Pages site remains available.

## Publish on GitHub Pages

1. Extract `masters-argentina-github.zip`.
2. Create a repository on your GitHub account. A public repository works with GitHub Free.
3. Copy the **contents** of the extracted `masters-argentina` folder into your repository. `index.html`, `carousels.css`, `carousels.js`, `informe.html`, and `assets/` must sit at the repository root. Include the hidden `.nojekyll` file.
4. Commit and push the files to your `main` branch.
5. Open the repository's **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then **main** and **/(root)**. Click **Save**.
6. After deployment completes, use the website URL shown in Pages settings. For a normal project repository, it looks like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

Upload the extracted files, not the ZIP itself. This project contains more than 700 files, so use GitHub Desktop or Git instead of a single browser upload; GitHub's web uploader accepts at most 100 files at once.

### Using GitHub Desktop

Create or clone your repository in GitHub Desktop, open its local folder, and copy the extracted site's contents into it. Commit the changes and choose **Publish repository** or **Push origin**, as appropriate. Then enable Pages using step 5 above.

### Using the command line with a new, empty repository

Run these commands inside the extracted `masters-argentina` directory. Replace both placeholders in the remote URL with your actual GitHub username and repository name.

```sh
git init
git add .
git commit -m "Add Masters Argentina website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

For an existing repository, clone it first, copy these files into it, then commit and push normally.

Official instructions: [Configure GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Upload files to GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## Preview on your computer

You can open `index.html` in your browser. For a preview served over HTTP, run this inside the site folder if Python 3 is installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8000/`. Stop the server with Ctrl+C.

## Files and editing

- `index.html`: the main page, styling, JavaScript, page templates, historical content, and asset-path manifest.
- `carousels.css` and `carousels.js`: shared carousel styles and controls.
- `assets/`: downloaded images, logos, portraits, historical files, and a PDF.
- `favicon.webp`: browser icon.
- `informe.html`: the original linked proposal/working document.
- `.nojekyll`: tells GitHub Pages to serve the static files without Jekyll processing.

The main sections use hash routes, including `#inicio`, `#quienes-somos`, `#conferencia`, `#contacto`, `#ediciones`, and `#ediciones/2026`. These work under a GitHub repository subdirectory without server rewrite rules. The original dated Netlify pathname has been replaced by the site's root `index.html` entry point.

Many images have logical paths in the HTML that are translated to optimized local files by `ASSET_PATHS` and `portableHTML`. Keep that mapping intact when editing. Search `index.html` for the text you want to change. Configuration for the next conference is near `const CONFERENCIA`; some event copy is also written directly into the page templates.

## What was changed for portability

- Saved the published page as `index.html`.
- Downloaded all 720 files listed in the site's asset manifest, plus the carousel JS/CSS, favicon, and remotely hosted Miami hero image (724 downloaded files in total).
- Kept embedded SVGs in the HTML; the repeated base64 logo now uses Cloudinary.
- Changed the working-document link and its return links to relative paths, so they work under `/YOUR-REPOSITORY/`.
- Replaced the externally hosted Miami hero image with a local copy.
- Removed Netlify's injected promotional script from both HTML pages.

## External content and original behavior

Current-section images are served from Cloudinary; historical-archive images and layout assets remain bundled locally. YouTube videos and two Google Slides presentations remain external embeds, and require internet access. Newsletter signup, social profiles, official conference sites, and the external photo album remain links to their original services. Email links open the visitor's email application. This static copy does not include the databases or backend services of those external sites.

The source's disabled ticket-purchase buttons, example-data labels, and historical navigation behavior are preserved. This package is a recovery of the public deployed site, not a redesign or a recovery of its original private development repository.

## Verification

- Every asset-manifest destination is present locally; all 724 downloads succeeded.
- All 702 raster image files and 18 SVG files passed file-format validation; the bundled PDF has a valid PDF header.
- JavaScript syntax checks passed.
- The site was previewed locally under `/masters-argentina/`, matching the subdirectory structure of GitHub project Pages.
- Home, About, Conference 2027, Contact, historical editions, Miami 2026, and the working document rendered successfully. Carousel pause and FAQ expansion were exercised.
- No browser console errors or broken loaded images were observed during those checks. External service submissions and video/presentation playback were not tested.

Source: https://darling-kataifi-d913db.netlify.app/masters_argentina_fran_10-28-2026

## Cloudinary images

The current sections (Home, About/team, Conference 2027, Contact, and Miami 2026) use 115 unique images in Cloudinary cloud `lzfq7irq`, organized under `masters-argentina/`. Historical editions use their existing local image references. External albums, institutional sites, videos, and presentation links remain unchanged. Original image files are kept as backups.

`cloudinary-images.json` lists the current local-path-to-delivery-URL mapping. The same mapping is embedded as `CLOUDINARY_IMAGES` in `index.html` so the site also works when opened directly. When changing an image, upload it to the appropriate Cloudinary folder, copy its HTTPS delivery URL, and update both mappings. Prefer a new asset/version URL for replacements so browsers load the new image immediately. SVGs and the favicon retain their original formats; raster photos use Cloudinary automatic format/quality and a maximum width of 1600px.

Only public delivery URLs are part of this repository. No Cloudinary credentials are needed in GitHub, Netlify, or browser code.

For Netlify, import this repository, leave the build command empty, and publish the repository root (`.`). No environment variables or build dependencies are required.
