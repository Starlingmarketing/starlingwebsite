import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env before importing siteConfig so VITE_* vars (cloud name, site URL)
// are available to the sitemap generator. Vercel/CI environments provide
// these via real env vars, so the file is optional.
const __preFilename = fileURLToPath(import.meta.url);
const __preDirname = path.dirname(__preFilename);
const __preProjectRoot = path.resolve(__preDirname, '..');
try {
  const dotenvContent = await readFile(
    path.join(__preProjectRoot, '.env'),
    'utf8',
  );
  for (const line of dotenvContent.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
} catch {
  // .env not present — rely on real environment variables.
}

const { getPublicRouteEntries } = await import('../src/seo/routeMeta.js');
const {
  CLOUDINARY_CLOUD_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_URL,
} = await import('../src/seo/siteConfig.js');

// Public Cloudinary URL for a fixed wide-crop version of a given asset ID.
// Matches the transform used by DEFAULT_OG_IMAGE so the crawler always
// receives a stable, landscape 1200x630 rendition.
const buildCloudinaryUrl = (publicId) =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,g_auto,h_630,q_auto,w_1200/${publicId}`;

const makeHomeImage = (publicId, caption) => ({
  loc: buildCloudinaryUrl(publicId),
  caption,
  title: `${caption} — Starling Photo Studios, Washington, DC photographer`,
  geoLocation: 'Washington, District of Columbia, United States',
  license: `${SITE_URL}/booking`,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const routes = getPublicRouteEntries();
const today = new Date().toISOString().slice(0, 10);

const ROUTE_HINTS = {
  '/': { changefreq: 'weekly', priority: '1.0' },
  '/about': { changefreq: 'monthly', priority: '0.8' },
  '/booking': { changefreq: 'monthly', priority: '0.9' },
};

// Image entries are constrained to assets we know exist publicly. The OG hero
// is the only image we can reference universally — adding more without
// verifying their public Cloudinary URLs would risk broken sitemap entries.
const ROUTE_IMAGES = {
  '/': [
    {
      loc: DEFAULT_OG_IMAGE,
      caption: DEFAULT_OG_IMAGE_ALT,
      title: 'Starling Photo Studios — Washington, D.C. portfolio feature image',
      geoLocation: 'Washington, District of Columbia, United States',
      license: `${SITE_URL}/booking`,
    },
    makeHomeImage(
      '2021-12-01_fj6dqk',
      'Washington DC wedding photographer — couple portrait by Starling Photo Studios',
    ),
    makeHomeImage(
      'Image_1_iz7lk8',
      'Washington DC editorial photographer — portrait session in the DMV',
    ),
    makeHomeImage(
      'AF1I1454_vcc77d',
      'DC wedding photographer — candid portrait by Starling Photo Studios',
    ),
    makeHomeImage(
      'AF1I2158_bkkjlo',
      'Washington DC event and wedding photographer — Starling Photo Studios',
    ),
    makeHomeImage(
      'Smith_Wedding_Edits_-_0001_of_0176_gu376e',
      'Smith Wedding — Washington DC–area wedding photographer in Chesapeake City, Maryland',
    ),
    makeHomeImage(
      'Smith_Wedding_Edits_-_0005_of_0176_hiaytz',
      'Smith Wedding candid — DC / DMV wedding photography',
    ),
    makeHomeImage(
      '0006__DSC3027-topaz-denoise-denoise_DxO_tpqmmc',
      'Makayla and Hunter Wedding at Glasbern — East Coast wedding photographer',
    ),
    makeHomeImage(
      '0007__DSC3049-topaz-denoise-denoise_DxO_vh2j4m',
      'Wedding candid at Glasbern by Starling Photo Studios, a Washington DC photographer',
    ),
    makeHomeImage(
      'Thickstun_Wedding_Edits_-_001_of_053_d9jzgj',
      'Thickstun Wedding in Flemington, NJ — East Coast wedding photographer',
    ),
    makeHomeImage(
      'AF1I2242-Edit-2_cor6p9',
      'Philadelphia portrait session — Starling Photo Studios editorial photographer',
    ),
    makeHomeImage(
      'center_city_ag1h8b',
      'Center City Philadelphia portrait — Starling Photo Studios city photographer',
    ),
  ],
  '/about': [
    {
      loc: DEFAULT_OG_IMAGE,
      caption: 'About Starling Photo Studios, a Washington, D.C. photography studio',
      title: 'Starling Photo Studios — Washington, D.C. photographers',
      geoLocation: 'Washington, District of Columbia, United States',
      license: `${SITE_URL}/booking`,
    },
  ],
  '/booking': [
    {
      loc: DEFAULT_OG_IMAGE,
      caption: 'Book Starling Photo Studios, a Washington, D.C. photography studio',
      title: 'Book a Washington, D.C. photographer with Starling Photo Studios',
      geoLocation: 'Washington, District of Columbia, United States',
      license: `${SITE_URL}/booking`,
    },
  ],
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const renderImageEntries = (images = []) =>
  images
    .map(
      (image) => `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      <image:caption>${escapeXml(image.caption)}</image:caption>
      <image:geo_location>${escapeXml(image.geoLocation)}</image:geo_location>
      <image:license>${escapeXml(image.license)}</image:license>
    </image:image>`,
    )
    .join('\n');

const renderUrlEntry = ({ url, pathname }) => {
  const hints = ROUTE_HINTS[pathname] ?? { changefreq: 'monthly', priority: '0.7' };
  const images = renderImageEntries(ROUTE_IMAGES[pathname]);

  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${hints.changefreq}</changefreq>
    <priority>${hints.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-us" href="${escapeXml(url)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url)}" />
${images}
  </url>`;
};

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${routes.map(renderUrlEntry).join('\n')}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
await writeFile(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
