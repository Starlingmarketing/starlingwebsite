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

// Aggregate rating data (public — mirrors the rating/review counts
// surfaced prominently in the UI hero and reviews panel).
export const AGGREGATE_RATING = {
  ratingValue: 4.8,
  bestRating: 5,
  worstRating: 1,
  reviewCount: 1200,
  ratingCount: 1200,
};

// Price range hint (Google LocalBusiness guidelines accept $, $$, $$$, $$$$).
export const BUSINESS_PRICE_RANGE = '$$$';
export const BUSINESS_CURRENCIES = ['USD'];
export const BUSINESS_PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Invoice',
  'Online Transfer',
];

// Public business contact — safe to emit in schema for local SEO.
export const BUSINESS_EMAIL = 'starlingphotostudio@gmail.com';

// Operating model: photography sessions are by appointment, seven days a week.
export const BUSINESS_OPENING_HOURS = [
  {
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '20:00',
  },
];

// Known public presence. Keep this list conservative — each entry should
// resolve to a real, public profile so search engines can verify identity.
export const BUSINESS_SOCIAL_LINKS = [
  'https://www.thumbtack.com/dc/washington/wedding-and-event-photography/starling-photo-studios',
  'https://www.weddingwire.com/biz/starling-photo-studios',
  'https://www.instagram.com/starlingphotostudios',
];

// Founder / lead photographer. Referenced repeatedly in client reviews.
export const BUSINESS_FOUNDER_NAME = 'Ben';

// Individual testimonials (subset of what's visible on the Booking page).
// Emitted as schema.org Review nodes for rich-result eligibility.
export const FEATURED_REVIEWS = [
  {
    author: 'Daijah Davis',
    rating: 5,
    date: '2024-09-04',
    body:
      'Starling Photo Studios shot my wedding this past August. Our photographer was so amazing, he got my wedding from all angles. He also worked with my budget, which was much appreciated. I cannot thank him enough for these amazing wedding photos, delivered in a very timely manner. I would recommend.',
  },
  {
    author: 'Lauren Rowe',
    rating: 5,
    date: '2024-06-17',
    body:
      'Ben was an outstanding wedding photographer — professional, kind, and patient, making our experience with him truly enjoyable. We highly recommend Ben to any couple seeking a talented photographer. His work is exceptional.',
  },
  {
    author: 'Gilbert Soto',
    rating: 5,
    date: '2024-04-22',
    body:
      'Absolutely amazing personalized customer service with a true professional. Constant, open communication and willingness to work with a client at all times. I highly recommend hiring this professional and allowing him to take care of all the details.',
  },
  {
    author: 'Kyle Schwab',
    rating: 5,
    date: '2024-05-11',
    body:
      "I hired Ben for my engagement proposal. Ben captured our special moment beautifully. Even after the proposal we walked around for over an hour where he took candid and staged photos of my fiancé and myself. He provided tons of pictures throughout the day.",
  },
  {
    author: 'Danielle Tate',
    rating: 5,
    date: '2024-11-02',
    body:
      "I cannot recommend Starling Photo Studios enough. Their attention to detail, quality of service, and genuine care for their clients are unmatched. Everything was done efficiently and with great expertise.",
  },
  {
    author: 'Nick D',
    rating: 5,
    date: '2024-07-09',
    body:
      "Ben was easy to connect with, always responded to emails quickly and the photos turned out beautifully. We would absolutely recommend Starling Photos for any wedding or party.",
  },
  {
    author: 'Sarely Perez Cervantes',
    rating: 5,
    date: '2024-08-14',
    body:
      'We are so happy with the results. Pictures were just how we pictured and more. Ben was great and friendly, made us feel very comfortable, and captured the perfect pictures at the perfect moments.',
  },
  {
    author: 'Chris Clore',
    rating: 5,
    date: '2025-02-03',
    body:
      'I had a 5-star experience with Starling Photo Studios. Their attention to detail and creative approach truly set them apart. Ben listened to my vision, made the session enjoyable, and delivered stunning photos that exceeded all my expectations.',
  },
];

// Long-tail local intent — emitted as FAQPage JSON-LD for featured-snippet
// and People-Also-Ask eligibility. No visible UI.
export const FAQ_ENTRIES = [
  {
    question: 'Where is Starling Photo Studios based?',
    answer:
      'Starling Photo Studios is a Washington, D.C.–based photography studio serving clients throughout the DMV (Washington, D.C., Maryland, and Virginia), with a second base in Philadelphia and travel worldwide for destination work.',
  },
  {
    question: 'What neighborhoods in Washington, D.C. do you photograph?',
    answer:
      'We regularly photograph weddings, editorial, and portrait sessions across Washington, D.C., including Georgetown, Capitol Hill, Dupont Circle, Logan Circle, The Wharf, Navy Yard, Shaw, Adams Morgan, Columbia Heights, Penn Quarter, and every other D.C. neighborhood — plus throughout Arlington, Alexandria, Bethesda, and the rest of the DMV.',
  },
  {
    question:
      'How do I book a Washington, D.C. photographer with Starling Photo Studios?',
    answer:
      'You can submit an inquiry on our booking page. Share your event date, location, and project details and we will respond with availability and a tailored quote for weddings, editorial, portrait, and commercial photography in Washington, D.C. and beyond.',
  },
  {
    question:
      'What photography services does Starling Photo Studios offer in D.C.?',
    answer:
      'We offer wedding photography, editorial photography, lifestyle photography, portrait photography, and commercial photography in Washington, D.C. and the surrounding DMV. Engagement sessions, elopements, and documentary-style wedding coverage are all available.',
  },
  {
    question:
      'Do you travel outside of Washington, D.C. for weddings and editorial shoots?',
    answer:
      'Yes. While our base is in Washington, D.C., we regularly travel across the DMV, to Philadelphia, throughout the East Coast, and worldwide for destination weddings, editorial campaigns, and commercial projects.',
  },
  {
    question:
      'How much does a Washington, D.C. wedding photographer cost with Starling?',
    answer:
      'Wedding photography investment with Starling Photo Studios varies by scope, hours, and coverage needed. Most Washington, D.C. wedding collections fall in a premium tier, and we are happy to share a tailored quote once we learn about your date, venue, and vision through our booking form.',
  },
  {
    question:
      'Do you photograph engagements and elopements in Washington, D.C.?',
    answer:
      'Absolutely. We offer engagement sessions and elopement photography across Washington, D.C. — from the Tidal Basin and Lincoln Memorial to Meridian Hill Park, Rock Creek Park, Georgetown, and private venues throughout the city.',
  },
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
