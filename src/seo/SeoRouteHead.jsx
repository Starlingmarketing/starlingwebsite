import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta } from './routeMeta.js';
import {
  BUSINESS_COUNTRY,
  BUSINESS_COUNTRY_NAME,
  BUSINESS_GEO,
  BUSINESS_LOCALITY,
  BUSINESS_REGION,
  BUSINESS_REGION_NAME,
  SITE_NAME,
  buildSiteUrl,
} from './siteConfig.js';

const MANAGED_ATTR = 'data-seo-managed';

const setManagedMetaTag = (attributeName, attributeValue, content) => {
  if (!content) return;

  let node = document.head.querySelector(
    `meta[${attributeName}="${attributeValue}"]`,
  );

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attributeName, attributeValue);
    document.head.appendChild(node);
  }

  node.setAttribute(MANAGED_ATTR, 'true');
  node.setAttribute('content', content);
};

const removeManagedLinks = (rel) => {
  document.head
    .querySelectorAll(`link[rel="${rel}"][${MANAGED_ATTR}="true"]`)
    .forEach((node) => node.remove());
};

const setManagedLinkTag = (rel, href, extraAttributes = {}) => {
  if (!href) return;
  const node = document.createElement('link');
  node.setAttribute('rel', rel);
  node.setAttribute('href', href);
  Object.entries(extraAttributes).forEach(([key, value]) => {
    if (value !== null && value !== undefined) node.setAttribute(key, value);
  });
  node.setAttribute(MANAGED_ATTR, 'true');
  document.head.appendChild(node);
};

const setStructuredData = (schemas = []) => {
  document.head
    .querySelectorAll(`script[type="application/ld+json"][${MANAGED_ATTR}="true"]`)
    .forEach((node) => node.remove());

  schemas.forEach((schema) => {
    if (!schema) return;

    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute(MANAGED_ATTR, 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

const SeoRouteHead = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);
    const shouldUsePublicFallbackUrl =
      window.location.origin.includes('127.0.0.1')
      || window.location.origin.includes('localhost');
    const openGraphUrl = meta.canonicalUrl
      ?? (
        shouldUsePublicFallbackUrl
          ? buildSiteUrl(meta.pathname)
          : window.location.href
      );

    document.documentElement.lang = 'en-US';
    document.title = meta.title;

    setManagedMetaTag('name', 'description', meta.description);
    setManagedMetaTag('name', 'robots', meta.robots);
    setManagedMetaTag('name', 'theme-color', '#ffffff');
    setManagedMetaTag('name', 'keywords', meta.keywords);

    // Hidden geo signals — read by Bing, Yandex, DuckDuckGo, and several
    // local-SEO crawlers; ignored visually.
    setManagedMetaTag('name', 'geo.region', `${BUSINESS_COUNTRY}-${BUSINESS_REGION}`);
    setManagedMetaTag('name', 'geo.placename', `${BUSINESS_LOCALITY}, ${BUSINESS_REGION}`);
    setManagedMetaTag(
      'name',
      'geo.position',
      `${BUSINESS_GEO.latitude};${BUSINESS_GEO.longitude}`,
    );
    setManagedMetaTag(
      'name',
      'ICBM',
      `${BUSINESS_GEO.latitude}, ${BUSINESS_GEO.longitude}`,
    );

    setManagedMetaTag('property', 'og:type', 'website');
    setManagedMetaTag('property', 'og:site_name', SITE_NAME);
    setManagedMetaTag('property', 'og:title', meta.title);
    setManagedMetaTag('property', 'og:description', meta.description);
    setManagedMetaTag('property', 'og:url', openGraphUrl);
    setManagedMetaTag('property', 'og:image', meta.socialImage);
    setManagedMetaTag('property', 'og:image:alt', meta.socialImageAlt);
    setManagedMetaTag('property', 'og:locale', 'en_US');

    // Open Graph place hints (used by Facebook/Pinterest crawlers).
    setManagedMetaTag('property', 'og:locality', BUSINESS_LOCALITY);
    setManagedMetaTag('property', 'og:region', BUSINESS_REGION_NAME);
    setManagedMetaTag('property', 'og:country-name', BUSINESS_COUNTRY_NAME);
    setManagedMetaTag('property', 'place:location:latitude', String(BUSINESS_GEO.latitude));
    setManagedMetaTag('property', 'place:location:longitude', String(BUSINESS_GEO.longitude));

    setManagedMetaTag('name', 'twitter:card', 'summary_large_image');
    setManagedMetaTag('name', 'twitter:title', meta.title);
    setManagedMetaTag('name', 'twitter:description', meta.description);
    setManagedMetaTag('name', 'twitter:image', meta.socialImage);
    setManagedMetaTag('name', 'twitter:image:alt', meta.socialImageAlt);

    // Reset and rebuild link tags we manage.
    removeManagedLinks('canonical');
    removeManagedLinks('alternate');

    setManagedLinkTag('canonical', meta.canonicalUrl);

    if (meta.canonicalUrl) {
      setManagedLinkTag('alternate', meta.canonicalUrl, { hreflang: 'en-us' });
      setManagedLinkTag('alternate', meta.canonicalUrl, { hreflang: 'en' });
      setManagedLinkTag('alternate', meta.canonicalUrl, { hreflang: 'x-default' });
    }

    setStructuredData(meta.schemas);
  }, [location.pathname]);

  return null;
};

export default SeoRouteHead;
