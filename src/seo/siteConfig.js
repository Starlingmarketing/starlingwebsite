const DEFAULT_SITE_URL = 'https://www.starlingphotostudios.com';
const DEFAULT_CLOUDINARY_CLOUD_NAME = 'demo';
const nodeEnv = globalThis.process?.env;

const envSiteUrl =
  nodeEnv?.VITE_SITE_URL ?? import.meta.env?.VITE_SITE_URL;

const envCloudinaryCloudName =
  nodeEnv?.VITE_CLOUDINARY_CLOUD_NAME ?? import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME;

const trimTrailingSlash = (value) => String(value).replace(/\/+$/, '');

export const SITE_NAME = 'Starling Photography';
export const BUSINESS_NAME = 'Starling Photo Studios';
export const BUSINESS_ALT_NAME = 'Starling Photography';
export const SITE_URL = trimTrailingSlash(envSiteUrl || DEFAULT_SITE_URL);
export const CLOUDINARY_CLOUD_NAME =
  trimTrailingSlash(envCloudinaryCloudName || DEFAULT_CLOUDINARY_CLOUD_NAME);

export const DEFAULT_OG_IMAGE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,g_auto,h_630,q_auto,w_1200/AF1I0729_catszb`;
export const DEFAULT_OG_IMAGE_ALT =
  'Featured wedding and editorial work by Starling Photo Studios, a Washington, D.C. photography studio';

export const BUSINESS_DESCRIPTION =
  'Washington, D.C.–based photography studio offering wedding, editorial, lifestyle, portrait, and commercial photography, with a second base in Philadelphia and travel worldwide.';

export const SERVICE_TYPES = [
  'Wedding Photography',
  'Editorial Photography',
  'Lifestyle Photography',
  'Portrait Photography',
  'Commercial Photography',
];

// Locality fields used to build LocalBusiness/PostalAddress nodes.
// Street/zip/phone/email intentionally omitted — only verifiable, public-safe data.
export const BUSINESS_LOCALITY = 'Washington';
export const BUSINESS_REGION = 'DC';
export const BUSINESS_REGION_NAME = 'District of Columbia';
export const BUSINESS_COUNTRY = 'US';
export const BUSINESS_COUNTRY_NAME = 'United States';
// Approximate geographic center of Washington, D.C. (public knowledge).
export const BUSINESS_GEO = { latitude: 38.9072, longitude: -77.0369 };

// Top-level service areas (kept for backwards compatibility / human-readable usage).
export const AREA_SERVED = [
  'Washington, D.C.',
  'DMV',
  'Maryland',
  'Virginia',
  'Philadelphia',
  'Worldwide',
];

// Granular local-search signal: D.C. neighborhoods the studio plausibly serves.
// These appear only in JSON-LD `areaServed` Place objects — never in visible UI.
export const DC_NEIGHBORHOODS = [
  'Georgetown',
  'Capitol Hill',
  'Dupont Circle',
  'Logan Circle',
  'Adams Morgan',
  'Shaw',
  'U Street Corridor',
  'NoMa',
  'Navy Yard',
  'The Wharf',
  'Foggy Bottom',
  'H Street Corridor',
  'Mount Pleasant',
  'Petworth',
  'Columbia Heights',
  'Penn Quarter',
  'Chinatown',
  'Kalorama',
  'West End',
  'Brookland',
  'Bloomingdale',
  'Eckington',
  'Anacostia',
  'Brightwood',
  'Cleveland Park',
  'Woodley Park',
  'Tenleytown',
  'Friendship Heights',
  'Glover Park',
  'Palisades',
  'Spring Valley',
  'Forest Hills',
  'Mount Vernon Triangle',
  'Southwest Waterfront',
  'Ivy City',
  'Trinidad',
  'Hill East',
  'Barracks Row',
];

// Nearby DMV cities used as additional `areaServed` Place entries.
export const DMV_CITIES = [
  { name: 'Arlington', region: 'VA' },
  { name: 'Alexandria', region: 'VA' },
  { name: 'McLean', region: 'VA' },
  { name: 'Falls Church', region: 'VA' },
  { name: 'Tysons', region: 'VA' },
  { name: 'Vienna', region: 'VA' },
  { name: 'Reston', region: 'VA' },
  { name: 'Fairfax', region: 'VA' },
  { name: 'Leesburg', region: 'VA' },
  { name: 'Middleburg', region: 'VA' },
  { name: 'Great Falls', region: 'VA' },
  { name: 'Bethesda', region: 'MD' },
  { name: 'Silver Spring', region: 'MD' },
  { name: 'Chevy Chase', region: 'MD' },
  { name: 'Rockville', region: 'MD' },
  { name: 'Potomac', region: 'MD' },
  { name: 'Annapolis', region: 'MD' },
  { name: 'Baltimore', region: 'MD' },
  { name: 'Frederick', region: 'MD' },
  { name: 'Gaithersburg', region: 'MD' },
  { name: 'Kensington', region: 'MD' },
  { name: 'Takoma Park', region: 'MD' },
  { name: 'College Park', region: 'MD' },
];

// Local-intent keyword set. Google ignores `<meta name="keywords">`,
// but Bing, Yandex, DuckDuckGo and several local-SEO crawlers still parse it.
export const LOCAL_KEYWORDS = [
  'Washington DC photographer',
  'Washington D.C. wedding photographer',
  'DC wedding photographer',
  'DC editorial photographer',
  'DC portrait photographer',
  'DC commercial photographer',
  'DC lifestyle photographer',
  'DMV wedding photographer',
  'Northern Virginia wedding photographer',
  'Maryland wedding photographer',
  'Georgetown wedding photographer',
  'Capitol Hill wedding photographer',
  'Dupont Circle wedding photographer',
  'Adams Morgan wedding photographer',
  'Shaw wedding photographer',
  'Navy Yard wedding photographer',
  'The Wharf wedding photographer',
  'Arlington wedding photographer',
  'Alexandria wedding photographer',
  'Bethesda wedding photographer',
  'Annapolis wedding photographer',
  'Baltimore wedding photographer',
  'Philadelphia wedding photographer',
  'East Coast wedding photographer',
  'destination wedding photographer',
  'editorial wedding photography',
  'documentary wedding photography',
  'film wedding photography',
  'engagement photographer DC',
  'elopement photographer DC',
];

export const buildSiteUrl = (pathname = '/') => {
  const normalizedPath =
    pathname === '/'
      ? '/'
      : `/${String(pathname).replace(/^\/+/, '').replace(/\/+$/, '')}`;

  return normalizedPath === '/'
    ? SITE_URL
    : `${SITE_URL}${normalizedPath}`;
};
