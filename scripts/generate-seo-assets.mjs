import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPublicRouteEntries } from '../src/seo/routeMeta.js';
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from '../src/seo/siteConfig.js';

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
