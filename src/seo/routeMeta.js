import {
  AREA_SERVED,
  BUSINESS_ALT_NAME,
  BUSINESS_DESCRIPTION,
  BUSINESS_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SERVICE_TYPES,
  SITE_NAME,
  buildSiteUrl,
} from './siteConfig.js';

const DEFAULT_ROBOTS =
  'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${buildSiteUrl('/')}#website`,
  name: SITE_NAME,
  alternateName: BUSINESS_NAME,
  url: buildSiteUrl('/'),
  inLanguage: 'en',
});

const getBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${buildSiteUrl('/')}#business`,
  name: BUSINESS_NAME,
  alternateName: BUSINESS_ALT_NAME,
  description: BUSINESS_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
  url: buildSiteUrl('/'),
  areaServed: AREA_SERVED.map((name) => ({
    '@type': 'Place',
    name,
  })),
  serviceType: SERVICE_TYPES,
});

const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: buildSiteUrl(item.path),
  })),
});

const getWebPageSchema = ({
  pathname,
  title,
  description,
  pageType = 'WebPage',
}) => ({
  '@context': 'https://schema.org',
  '@type': pageType,
  '@id': `${buildSiteUrl(pathname)}#webpage`,
  name: title,
  description,
  url: buildSiteUrl(pathname),
  isPartOf: {
    '@id': `${buildSiteUrl('/')}#website`,
  },
  about: {
    '@id': `${buildSiteUrl('/')}#business`,
  },
  inLanguage: 'en',
});

const ROUTE_DEFINITIONS = {
  '/': {
    title:
      'Wedding Photographer in Washington D.C. & Philadelphia | Starling Photography',
    description:
      'Editorial, wedding, and lifestyle photography in Washington D.C., Philadelphia, and destination locations. View selected work and inquire with Starling Photography.',
    readySelector: '#home-page',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: DEFAULT_OG_IMAGE_ALT,
    pageType: 'WebPage',
    schemas: ({ pathname, title, description }) => [
      getWebsiteSchema(),
      getBusinessSchema(),
      getWebPageSchema({ pathname, title, description }),
    ],
  },
  '/about': {
    title:
      'About Starling Photography | Washington D.C., Philadelphia & Destination Photographer',
    description:
      'Learn about Starling’s collaborative approach to wedding, editorial, portrait, and commercial photography in Washington D.C., Philadelphia, and worldwide.',
    readySelector: '#about-page',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: 'About Starling Photography',
    pageType: 'AboutPage',
    breadcrumbLabel: 'About',
    schemas: ({ pathname, title, description }) => [
      getWebPageSchema({
        pathname,
        title,
        description,
        pageType: 'AboutPage',
      }),
      getBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About', path: pathname },
      ]),
    ],
  },
  '/booking': {
    title:
      'Book Starling Photography | Wedding, Editorial & Lifestyle Inquiries',
    description:
      'Inquire about wedding, editorial, portrait, and commercial photography with Starling Photography in Washington D.C., Philadelphia, and beyond.',
    readySelector: '#booking-page',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: 'Book Starling Photography',
    pageType: 'ContactPage',
    breadcrumbLabel: 'Booking',
    schemas: ({ pathname, title, description }) => [
      getWebPageSchema({
        pathname,
        title,
        description,
        pageType: 'ContactPage',
      }),
      getBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Booking', path: pathname },
      ]),
    ],
  },
  '/404': {
    title: 'Page Not Found | Starling Photography',
    description: 'The page you requested could not be found.',
    readySelector: '[data-not-found-page="true"]',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: 'Starling Photography',
    pageType: 'WebPage',
    robots: 'noindex,nofollow',
    canonicalPath: null,
    indexable: false,
    schemas: ({ pathname, title, description }) => [
      getWebPageSchema({ pathname, title, description }),
    ],
  },
};

const PUBLIC_ROUTE_PATHS = ['/', '/about', '/booking'];

const normalizePathname = (pathname) => {
  if (!pathname || pathname === '/') return '/';
  const cleaned = `/${String(pathname).replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return cleaned === '/404-preview' ? '/404' : cleaned;
};

export const getRouteMeta = (pathname) => {
  const normalizedPathname = normalizePathname(pathname);
  const baseMeta = ROUTE_DEFINITIONS[normalizedPathname] ?? ROUTE_DEFINITIONS['/404'];
  const title = baseMeta.title;
  const description = baseMeta.description;
  const canonicalPath =
    Object.prototype.hasOwnProperty.call(baseMeta, 'canonicalPath')
      ? baseMeta.canonicalPath
      : normalizedPathname;

  return {
    pathname: normalizedPathname,
    title,
    description,
    robots: baseMeta.robots ?? DEFAULT_ROBOTS,
    readySelector: baseMeta.readySelector,
    canonicalUrl: canonicalPath ? buildSiteUrl(canonicalPath) : null,
    socialImage: baseMeta.socialImage ?? DEFAULT_OG_IMAGE,
    socialImageAlt: baseMeta.socialImageAlt ?? DEFAULT_OG_IMAGE_ALT,
    pageType: baseMeta.pageType ?? 'WebPage',
    indexable: baseMeta.indexable ?? true,
    schemas:
      typeof baseMeta.schemas === 'function'
        ? baseMeta.schemas({
            pathname: normalizedPathname,
            title,
            description,
          })
        : [],
  };
};

export const PRERENDER_ROUTES = [
  {
    pathname: '/',
    outputPath: 'index.html',
    readySelector: ROUTE_DEFINITIONS['/'].readySelector,
  },
  {
    pathname: '/about',
    outputPath: 'about/index.html',
    readySelector: ROUTE_DEFINITIONS['/about'].readySelector,
  },
  {
    pathname: '/booking',
    outputPath: 'booking/index.html',
    readySelector: ROUTE_DEFINITIONS['/booking'].readySelector,
  },
  {
    pathname: '/404',
    outputPath: '404.html',
    readySelector: ROUTE_DEFINITIONS['/404'].readySelector,
  },
];

export const getPublicRouteEntries = () =>
  PUBLIC_ROUTE_PATHS.map((pathname) => ({
    pathname,
    url: buildSiteUrl(pathname),
    ...getRouteMeta(pathname),
  }));
