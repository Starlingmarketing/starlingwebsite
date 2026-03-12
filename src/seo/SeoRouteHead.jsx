import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta } from './routeMeta.js';
import { SITE_NAME, buildSiteUrl } from './siteConfig.js';

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

const removeManagedLink = (rel) => {
  document.head
    .querySelectorAll(`link[rel="${rel}"][${MANAGED_ATTR}="true"]`)
    .forEach((node) => node.remove());
};

const setManagedLinkTag = (rel, href) => {
  removeManagedLink(rel);

  if (!href) return;

  const node = document.createElement('link');
  node.setAttribute('rel', rel);
  node.setAttribute('href', href);
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

    document.documentElement.lang = 'en';
    document.title = meta.title;

    setManagedMetaTag('name', 'description', meta.description);
    setManagedMetaTag('name', 'robots', meta.robots);
    setManagedMetaTag('name', 'theme-color', '#ffffff');

    setManagedMetaTag('property', 'og:type', 'website');
    setManagedMetaTag('property', 'og:site_name', SITE_NAME);
    setManagedMetaTag('property', 'og:title', meta.title);
    setManagedMetaTag('property', 'og:description', meta.description);
    setManagedMetaTag('property', 'og:url', openGraphUrl);
    setManagedMetaTag('property', 'og:image', meta.socialImage);
    setManagedMetaTag('property', 'og:image:alt', meta.socialImageAlt);

    setManagedMetaTag('name', 'twitter:card', 'summary_large_image');
    setManagedMetaTag('name', 'twitter:title', meta.title);
    setManagedMetaTag('name', 'twitter:description', meta.description);
    setManagedMetaTag('name', 'twitter:image', meta.socialImage);
    setManagedMetaTag('name', 'twitter:image:alt', meta.socialImageAlt);

    setManagedLinkTag('canonical', meta.canonicalUrl);
    setStructuredData(meta.schemas);
  }, [location.pathname]);

  return null;
};

export default SeoRouteHead;
