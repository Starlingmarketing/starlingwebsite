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
  'Featured wedding and editorial portfolio photography by Starling';

export const BUSINESS_DESCRIPTION =
  'Wedding, editorial, lifestyle, portrait, and commercial photography based in Washington D.C. and Philadelphia, traveling worldwide.';

export const SERVICE_TYPES = [
  'Wedding Photography',
  'Editorial Photography',
  'Lifestyle Photography',
  'Portrait Photography',
  'Commercial Photography',
];

export const AREA_SERVED = ['Washington D.C.', 'Philadelphia', 'Worldwide'];

export const buildSiteUrl = (pathname = '/') => {
  const normalizedPath =
    pathname === '/'
      ? '/'
      : `/${String(pathname).replace(/^\/+/, '').replace(/\/+$/, '')}`;

  return normalizedPath === '/'
    ? SITE_URL
    : `${SITE_URL}${normalizedPath}`;
};
