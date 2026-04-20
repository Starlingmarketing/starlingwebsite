import {
  AGGREGATE_RATING,
  AREA_SERVED,
  BUSINESS_ALT_NAME,
  BUSINESS_COUNTRY,
  BUSINESS_COUNTRY_NAME,
  BUSINESS_CURRENCIES,
  BUSINESS_DESCRIPTION,
  BUSINESS_EMAIL,
  BUSINESS_FOUNDER_NAME,
  BUSINESS_GEO,
  BUSINESS_LOCALITY,
  BUSINESS_NAME,
  BUSINESS_OPENING_HOURS,
  BUSINESS_PAYMENT_METHODS,
  BUSINESS_PRICE_RANGE,
  BUSINESS_REGION,
  BUSINESS_REGION_NAME,
  BUSINESS_SOCIAL_LINKS,
  DC_NEIGHBORHOODS,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DMV_CITIES,
  FAQ_ENTRIES,
  FEATURED_REVIEWS,
  LOCAL_KEYWORDS,
  SERVICE_TYPES,
  SITE_NAME,
  buildSiteUrl,
} from './siteConfig.js';

const DEFAULT_ROBOTS =
  'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

const BUSINESS_ID = `${buildSiteUrl('/')}#business`;
const ORGANIZATION_ID = `${buildSiteUrl('/')}#organization`;
const WEBSITE_ID = `${buildSiteUrl('/')}#website`;
const PRIMARY_PLACE_ID = `${buildSiteUrl('/')}#washington-dc`;
const FOUNDER_ID = `${buildSiteUrl('/')}#founder`;
const FAQ_ID = `${buildSiteUrl('/')}#faq`;
const AGGREGATE_RATING_ID = `${buildSiteUrl('/')}#aggregate-rating`;

const getAggregateRatingSchema = () => ({
  '@type': 'AggregateRating',
  '@id': AGGREGATE_RATING_ID,
  ratingValue: AGGREGATE_RATING.ratingValue,
  bestRating: AGGREGATE_RATING.bestRating,
  worstRating: AGGREGATE_RATING.worstRating,
  reviewCount: AGGREGATE_RATING.reviewCount,
  ratingCount: AGGREGATE_RATING.ratingCount,
  itemReviewed: { '@id': BUSINESS_ID },
});

const getReviewSchemas = () =>
  FEATURED_REVIEWS.map((review, index) => ({
    '@type': 'Review',
    '@id': `${buildSiteUrl('/')}#review-${index + 1}`,
    author: { '@type': 'Person', name: review.author },
    datePublished: review.date,
    reviewBody: review.body,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: { '@id': BUSINESS_ID },
    publisher: { '@id': ORGANIZATION_ID },
  }));

const getOpeningHoursSchema = () =>
  BUSINESS_OPENING_HOURS.map((entry) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: entry.dayOfWeek.map(
      (day) => `https://schema.org/${day}`,
    ),
    opens: entry.opens,
    closes: entry.closes,
  }));

const getContactPointSchema = () => ({
  '@type': 'ContactPoint',
  contactType: 'Customer Service',
  email: BUSINESS_EMAIL,
  areaServed: [BUSINESS_COUNTRY, 'Worldwide'],
  availableLanguage: ['English'],
});

const getFounderSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: BUSINESS_FOUNDER_NAME,
  jobTitle: 'Lead Photographer',
  worksFor: { '@id': BUSINESS_ID },
  affiliation: { '@id': ORGANIZATION_ID },
  knowsAbout: [
    'Wedding Photography',
    'Editorial Photography',
    'Portrait Photography',
    'Commercial Photography',
    'Washington D.C. Wedding Venues',
  ],
  address: getPostalAddressPlaceholder(),
});

// hoisted placeholder — actual function defined below; avoids forward-ref lint.
function getPostalAddressPlaceholder() {
  return {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS_LOCALITY,
    addressRegion: BUSINESS_REGION,
    addressCountry: BUSINESS_COUNTRY,
  };
}

const getFaqSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': FAQ_ID,
  mainEntity: FAQ_ENTRIES.map((entry) => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: entry.answer,
    },
  })),
});

const getPostalAddress = () => ({
  '@type': 'PostalAddress',
  addressLocality: BUSINESS_LOCALITY,
  addressRegion: BUSINESS_REGION,
  addressCountry: BUSINESS_COUNTRY,
});

const getGeoCoordinates = () => ({
  '@type': 'GeoCoordinates',
  latitude: BUSINESS_GEO.latitude,
  longitude: BUSINESS_GEO.longitude,
});

const getPrimaryCityPlace = () => ({
  '@type': ['City', 'Place'],
  '@id': PRIMARY_PLACE_ID,
  name: 'Washington, D.C.',
  alternateName: ['Washington', 'DC', 'District of Columbia', 'Washington DC'],
  address: getPostalAddress(),
  geo: getGeoCoordinates(),
  containedInPlace: {
    '@type': 'Country',
    name: BUSINESS_COUNTRY_NAME,
  },
});

const getNeighborhoodPlaces = () =>
  DC_NEIGHBORHOODS.map((neighborhood) => ({
    '@type': ['Place', 'Neighborhood'],
    name: `${neighborhood}, Washington, D.C.`,
    containedInPlace: { '@id': PRIMARY_PLACE_ID },
  }));

const getDmvCityPlaces = () =>
  DMV_CITIES.map(({ name, region }) => ({
    '@type': 'City',
    name: `${name}, ${region}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: name,
      addressRegion: region,
      addressCountry: BUSINESS_COUNTRY,
    },
  }));

const getRegionalAdministrativeAreas = () => [
  {
    '@type': 'AdministrativeArea',
    name: 'DMV (D.C., Maryland, Virginia)',
  },
  {
    '@type': 'AdministrativeArea',
    name: 'Northern Virginia',
  },
  {
    '@type': 'State',
    name: 'Maryland',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'MD',
      addressCountry: BUSINESS_COUNTRY,
    },
  },
  {
    '@type': 'State',
    name: 'Virginia',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'VA',
      addressCountry: BUSINESS_COUNTRY,
    },
  },
  {
    '@type': 'City',
    name: 'Philadelphia, PA',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Philadelphia',
      addressRegion: 'PA',
      addressCountry: BUSINESS_COUNTRY,
    },
  },
];

const getFullAreaServed = () => [
  getPrimaryCityPlace(),
  ...getNeighborhoodPlaces(),
  ...getDmvCityPlaces(),
  ...getRegionalAdministrativeAreas(),
];

const getServiceNodes = () =>
  SERVICE_TYPES.map((serviceName) => ({
    '@type': 'Service',
    name: `${serviceName} in Washington, D.C.`,
    serviceType: serviceName,
    provider: { '@id': BUSINESS_ID },
    areaServed: [
      getPrimaryCityPlace(),
      ...getRegionalAdministrativeAreas(),
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: buildSiteUrl('/booking'),
      name: 'Online booking inquiry',
    },
  }));

const getOfferCatalogSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  '@id': `${buildSiteUrl('/')}#services`,
  name: `${BUSINESS_NAME} — Washington, D.C. Photography Services`,
  itemListElement: SERVICE_TYPES.map((serviceName, index) => ({
    '@type': 'Offer',
    position: index + 1,
    itemOffered: {
      '@type': 'Service',
      name: `${serviceName} in Washington, D.C.`,
      serviceType: serviceName,
      provider: { '@id': BUSINESS_ID },
      areaServed: [getPrimaryCityPlace(), ...getRegionalAdministrativeAreas()],
    },
    availability: 'https://schema.org/InStock',
    eligibleRegion: [
      getPrimaryCityPlace(),
      ...getRegionalAdministrativeAreas(),
    ],
  })),
});

const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  alternateName: BUSINESS_NAME,
  url: buildSiteUrl('/'),
  inLanguage: 'en-US',
  publisher: { '@id': ORGANIZATION_ID },
  about: { '@id': BUSINESS_ID },
});

const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: BUSINESS_NAME,
  alternateName: BUSINESS_ALT_NAME,
  url: buildSiteUrl('/'),
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  description: BUSINESS_DESCRIPTION,
  email: BUSINESS_EMAIL,
  address: getPostalAddress(),
  areaServed: getFullAreaServed(),
  contactPoint: getContactPointSchema(),
  sameAs: BUSINESS_SOCIAL_LINKS,
  founder: { '@id': FOUNDER_ID },
  knowsAbout: [
    'Wedding Photography',
    'Editorial Photography',
    'Lifestyle Photography',
    'Portrait Photography',
    'Commercial Photography',
    'Engagement Photography',
    'Elopement Photography',
    'Documentary Wedding Photography',
    'Washington D.C. Wedding Venues',
    'DMV Wedding Venues',
    'East Coast Wedding Photography',
  ],
  knowsLanguage: ['en', 'en-US'],
  slogan: 'Washington, D.C. wedding, editorial, and lifestyle photography.',
});

const getBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'LocalBusiness', 'PhotographyBusiness'],
  '@id': BUSINESS_ID,
  name: BUSINESS_NAME,
  alternateName: BUSINESS_ALT_NAME,
  description: BUSINESS_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
  logo: DEFAULT_OG_IMAGE,
  url: buildSiteUrl('/'),
  email: BUSINESS_EMAIL,
  priceRange: BUSINESS_PRICE_RANGE,
  currenciesAccepted: BUSINESS_CURRENCIES.join(', '),
  paymentAccepted: BUSINESS_PAYMENT_METHODS.join(', '),
  openingHoursSpecification: getOpeningHoursSchema(),
  sameAs: BUSINESS_SOCIAL_LINKS,
  contactPoint: getContactPointSchema(),
  parentOrganization: { '@id': ORGANIZATION_ID },
  founder: { '@id': FOUNDER_ID },
  employee: [{ '@id': FOUNDER_ID }],
  address: getPostalAddress(),
  geo: getGeoCoordinates(),
  hasMap: `https://www.google.com/maps/place/Washington,+DC/@${BUSINESS_GEO.latitude},${BUSINESS_GEO.longitude}`,
  areaServed: getFullAreaServed(),
  serviceArea: getFullAreaServed(),
  serviceType: SERVICE_TYPES,
  makesOffer: getServiceNodes().map((service) => ({
    '@type': 'Offer',
    itemOffered: service,
  })),
  hasOfferCatalog: { '@id': `${buildSiteUrl('/')}#services` },
  aggregateRating: getAggregateRatingSchema(),
  review: getReviewSchemas(),
  knowsAbout: AREA_SERVED,
  slogan: 'Washington, D.C. wedding, editorial, and lifestyle photography.',
  keywords: LOCAL_KEYWORDS.join(', '),
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
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': BUSINESS_ID },
  inLanguage: 'en-US',
  primaryImageOfPage: { '@id': `${buildSiteUrl('/')}#primary-image` },
  contentLocation: { '@id': PRIMARY_PLACE_ID },
  spatialCoverage: { '@id': PRIMARY_PLACE_ID },
});

const getPrimaryImageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  '@id': `${buildSiteUrl('/')}#primary-image`,
  url: DEFAULT_OG_IMAGE,
  contentUrl: DEFAULT_OG_IMAGE,
  caption: DEFAULT_OG_IMAGE_ALT,
  description: DEFAULT_OG_IMAGE_ALT,
  contentLocation: { '@id': PRIMARY_PLACE_ID },
  representativeOfPage: true,
  creator: { '@id': BUSINESS_ID },
  copyrightHolder: { '@id': BUSINESS_ID },
  creditText: BUSINESS_NAME,
  acquireLicensePage: buildSiteUrl('/booking'),
});

const getPrimaryPlaceSchema = () => ({
  '@context': 'https://schema.org',
  ...getPrimaryCityPlace(),
});

const getCommonSchemas = () => [
  getOrganizationSchema(),
  getBusinessSchema(),
  getOfferCatalogSchema(),
  getFounderSchema(),
  getPrimaryImageSchema(),
  getPrimaryPlaceSchema(),
  getFaqSchema(),
];

const ROUTE_DEFINITIONS = {
  '/': {
    title:
      'Photographer in Washington, DC | Wedding, Editorial & Portrait — Starling Photo Studios',
    description:
      'Photographer in Washington, DC — Starling Photo Studios is a Washington, D.C. photography studio creating wedding, editorial, portrait, and lifestyle work for clients across the DMV, Philadelphia, and beyond.',
    readySelector: '#home-page',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: DEFAULT_OG_IMAGE_ALT,
    pageType: 'WebPage',
    schemas: ({ pathname, title, description }) => [
      getWebsiteSchema(),
      ...getCommonSchemas(),
      getWebPageSchema({ pathname, title, description }),
      getBreadcrumbSchema([{ name: 'Home', path: '/' }]),
    ],
  },
  '/about': {
    title:
      'About Starling Photo Studios | Photographer in Washington, DC — Wedding & Editorial',
    description:
      'Meet the Washington, DC photographer behind Starling Photo Studios — a collaborative team shooting weddings, editorial, portraits, and commercial work across the DMV, Philadelphia, and worldwide.',
    readySelector: '#about-page',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: 'About Starling Photo Studios, a Washington, D.C. photography studio',
    pageType: 'AboutPage',
    breadcrumbLabel: 'About',
    schemas: ({ pathname, title, description }) => [
      ...getCommonSchemas(),
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
      'Book a Photographer in Washington, DC | Starling Photo Studios',
    description:
      'Book a photographer in Washington, DC for weddings, engagements, editorial, portrait, and commercial sessions. Inquire with Starling Photo Studios for dates across the DMV, Philadelphia, and worldwide.',
    readySelector: '#booking-page',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: 'Book Starling Photo Studios, a Washington, D.C. photography studio',
    pageType: 'ContactPage',
    breadcrumbLabel: 'Booking',
    schemas: ({ pathname, title, description }) => [
      ...getCommonSchemas(),
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
    title: 'Page Not Found | Starling Photo Studios',
    description:
      'The page you requested could not be found. Return home to explore Starling Photo Studios, a Washington, D.C. photography studio.',
    readySelector: '[data-not-found-page="true"]',
    socialImage: DEFAULT_OG_IMAGE,
    socialImageAlt: 'Starling Photo Studios, a Washington, D.C. photography studio',
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
    keywords: LOCAL_KEYWORDS.join(', '),
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
