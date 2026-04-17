# Starling Photo Studios — Website

React 19 + Vite 7 single-page app for [starlingphotostudios.com](https://www.starlingphotostudios.com),
deployed to Vercel with **route-level static prerendering** so search engines and
social crawlers see fully baked HTML (titles, meta tags, Open Graph, JSON-LD,
and content) on every public route.

## Stack

- React 19 + react-router-dom (client-side `BrowserRouter`)
- Vite 7
- Tailwind CSS 4
- Playwright (build-time prerendering only — not a runtime dep)
- Vercel (static hosting)
- GitHub Actions (build + prerender + deploy)

---

## Local development

```bash
npm install
npm run dev
```

Vite dev server on the default port. SEO meta is injected client-side via
`src/seo/SeoRouteHead.jsx`, so dev pages will look the same as production
in the browser, but the **raw HTML** in dev is the bare SPA shell (this is
fine — prerendering only happens for production builds).

## Local production build (with prerender)

```bash
npm run build      # vite build + scripts/prerender.mjs
npm run preview    # serve ./dist on http://127.0.0.1:4173
```

`npm run build` does two things:

1. `vite build` — bundles the app into `./dist`.
2. `node scripts/prerender.mjs` — boots a tiny static server over `./dist`,
   drives a headless Chromium across each route in
   `PRERENDER_ROUTES` (`/`, `/about`, `/booking`, `/404`), waits for the
   page-ready selector + correct `<title>` + correct `<meta name="description">`,
   then writes the fully-rendered HTML back to disk:

   - `dist/index.html`
   - `dist/about/index.html`
   - `dist/booking/index.html`
   - `dist/404.html`

Open one of those files after a build — you should see the route's title,
description, canonical, OG tags, and the JSON-LD schema graph already in
the HTML, with `<div id="root" data-prerendered="true">…</div>` containing
the rendered React tree.

> Playwright needs a Chromium binary. If you've never run Playwright on
> this machine, run `npx playwright install chromium` once.

---

## Production deploy

**Push to `main`.** That's it.

Vercel itself does **not** build the site. The `vercel.json` at the repo
root sets `"buildCommand": null` and `"outputDirectory": "dist"`, so Vercel
just serves whatever static files the deploy contains.

The actual build runs in GitHub Actions
(`.github/workflows/deploy.yml`):

1. `npm ci`
2. `npx playwright install --with-deps chromium` (Chromium + OS libs on the runner)
3. `npm run build` (vite build + prerender → fully prerendered `dist/`)
4. `npm install -g vercel@latest`
5. `vercel pull --yes --environment=production` (pulls project settings + env)
6. `vercel build --prod` (packages the existing `dist/` into `.vercel/output/`
   without re-running vite — required so the next step has something to deploy)
7. `vercel deploy --prebuilt --prod` (uploads the prebuilt artifact to production)

You can also trigger the workflow manually from the Actions tab via
**Run workflow** (`workflow_dispatch`).

### Why GitHub Actions instead of Vercel's build?

Vercel's build environment doesn't ship Chromium and can't run Playwright,
so prerendering has to happen somewhere with a real browser. GitHub Actions
runners can install Chromium with one command, so we build there and hand
Vercel the finished artifact.

### Required GitHub repo secrets

Set these under **Settings → Secrets and variables → Actions** on the repo:

| Secret              | What it is                                              | Where to get it                                                                                                            |
| ------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Personal access token used by the Vercel CLI            | <https://vercel.com/account/tokens> → **Create Token** (scope: full account or this team)                                  |
| `VERCEL_ORG_ID`     | The Vercel team/user ID that owns the project           | Run `vercel link` locally, then read `.vercel/project.json` → `orgId`                                                      |
| `VERCEL_PROJECT_ID` | The Vercel project ID                                   | Same `.vercel/project.json` → `projectId`                                                                                  |

`.vercel/project.json` is gitignored — that's fine, the workflow injects
`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as env vars and the Vercel CLI
picks them up automatically (no `--scope` / `--project` flags needed).

### About the SPA fallback rewrite

`vercel.json` keeps the existing rewrite:

```json
{ "source": "/((?!assets/).*)", "destination": "/index.html" }
```

This is safe because **Vercel serves static files from the build output
before it applies `rewrites`** (see [Vercel docs](https://vercel.com/docs/projects/project-configuration#rewrites)).
Concretely:

- `/` → serves `dist/index.html` (prerendered home).
- `/about` → serves `dist/about/index.html` (prerendered about).
- `/booking` → serves `dist/booking/index.html` (prerendered booking).
- `/some-unknown-path` → no static match, rewrite fires, serves
  `dist/index.html` (the SPA boots, react-router renders the 404 view).
- `/assets/*` → excluded from the rewrite so hashed JS/CSS/image bundles
  are never rewritten to HTML.

So the catch-all does **not** clobber the prerendered route files.

---

## Verifying prerendering in production

After a deploy completes, confirm crawlers see the baked HTML:

```bash
# Title is in the raw HTML (not just injected by JS):
curl -s https://www.starlingphotostudios.com/ \
  | grep -o '<title>[^<]*</title>'

# JSON-LD schemas are present (expect >= 3 on the home page):
curl -s https://www.starlingphotostudios.com/ \
  | grep -c 'application/ld+json'

# Per-route OG tags are present (About):
curl -s https://www.starlingphotostudios.com/about \
  | grep 'og:title'
```

You can also paste each public URL into Google's
[Rich Results Test](https://search.google.com/test/rich-results) to confirm
the `WebSite`, `ProfessionalService`, `WebPage` / `AboutPage` / `ContactPage`,
and `BreadcrumbList` schemas are all picked up.

If any of the above shows the bare SPA shell instead of the prerendered
HTML, the most likely causes are:

- The GitHub Actions workflow failed (check the Actions tab).
- `vercel.json` was changed so Vercel started building the site itself.
- A new public route was added without a corresponding entry in
  `PRERENDER_ROUTES` in `src/seo/routeMeta.js`.

---

## Adding a new prerendered route

1. Add the route's metadata to `ROUTE_DEFINITIONS` in `src/seo/routeMeta.js`
   (title, description, `readySelector`, schemas, etc.).
2. Add an entry to `PRERENDER_ROUTES` in the same file with a matching
   `pathname`, `outputPath` (e.g. `weddings/index.html`), and `readySelector`.
3. Make sure the route's React page renders an element matching that
   `readySelector` (e.g. `<main id="weddings-page">`) so the prerender
   script knows when the page is "ready" to snapshot.
4. Push to `main` — the next deploy will include the new prerendered file.
