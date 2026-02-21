import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { limitFit } from '@cloudinary/url-gen/actions/resize';
import emailjs from '@emailjs/browser';
import { cld } from '../utils/cloudinary';

const reviews = [
  {
    name: 'Daijah Davis',
    rating: 5,
    avatar: 'unnamed_3_ws0t7o',
    text: 'Starling Photo Studios shot my wedding this past August. Our photographer was so amazing, he got my wedding from all angles. He also worked with my budget which was much appreciated, because wedding are expensive. I cannot thank him enough for these amazing wedding photos! He also got the photos to me in a very timely manner. I would recommend',
  },
  {
    name: 'Lauren Rowe',
    rating: 5,
    text: 'Ben was an outstanding wedding photographer - professional, kind, and patient, making our experience with him truly enjoyable. We highly recommend Ben to any couple seeking a talented photographer - his work is exceptional!',
  },
  {
    name: 'Gilbert Soto',
    rating: 5,
    avatar: 'unnamed_glcrfb',
    text: 'Absolutely amazing personalized, customer service with a true professional. Constant, open communication and willingness to work with a client at all times. I highly recommend hiring this professional and allowing him to take care of all details. You will not be disappointed.',
  },
  {
    name: 'Kyle Schwab',
    rating: 5,
    text: "I hired Ben for my engagement proposal. Ben captured our special moment beautifully. Even after the proposal we walked around for over an hour where he took candid and staged photos of my fiancé and myself. He provided tons of pictures throughout the day. Ben was easy to work with and was very responsive through the whole process. If you're looking to book a photographer for an event. Look no further as I can ensure you Ben is your guy! Thank you Ben!",
  },
  {
    name: 'Danielle Tate',
    rating: 5,
    avatar: 'unnamed_1_npgrws',
    text: "I cannot recommend Starling Photo Studios enough! Their attention to detail, quality of service, and genuine care for their clients are unmatched. Starling Photo Studios exceeded my expectations—everything was done efficiently and with great expertise. The team went above and beyond to ensure my satisfaction, and it's clear they take pride in what they do. If you're looking for a reliable and professional photographer/videographer look no further. I'll definitely be booking their services again soon!",
  },
  {
    name: 'Nick D',
    rating: 5,
    avatar: 'unnamed_2_bud5q1',
    text: "I can't say enough how happy we were to work with the team at Starling Photo Studios. Ben was easy to connect with, always responded to emails quickly and the photos turned out beautifully! We would absolutely recommend Starling Photos for any wedding or party.",
  },
  {
    name: 'Sarely Perez Cervantes',
    rating: 5,
    avatar: 'unnamed_4_p21mim',
    text: "We are so happy with the results! Pictures were just how we pictured and more! It reflected us so much and Ben was so great and friendly! He made us feel very comfortable, and even considering my husband doesn't like pictures and almost never smiles.. Ben captured the perfect pictures at the perfect moments!!! Thank you so much..100%!!",
  },
  {
    name: 'Chris Clore',
    rating: 5,
    text: `I had a 5-star experience with Starling Photo Studios! Their attention to detail and creative approach truly set them apart. I cannot thank Ben enough for his incredible work! He listened to my vision, made the session enjoyable, and delivered stunning photos that exceeded all my expectations.\n\nIf you’re looking for exceptional quality and a personal touch, Starling Photo Studios is the way to go!`,
  },
];

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="#FBBC04"
    />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const ReviewSourceLogo = ({ source = 'google' }) => {
  if (source === 'thumbtack') {
    return (
      <img
        src="https://www.google.com/s2/favicons?domain=thumbtack.com&sz=128"
        alt="Thumbtack"
        className="w-5 h-5 object-contain rounded-[3px] opacity-90"
      />
    );
  }

  return <GoogleLogo />;
};

const avatarColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#7B1FA2', '#FF6D00'];

const ReviewCard = ({ review, index }) => (
  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
    <div className="flex items-start gap-3 mb-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {review.avatar ? (
          <img
            src={cld.image(review.avatar).toURL()}
            alt={review.name}
            className="w-10 h-10 flex-shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
            style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
          >
            {review.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-slate-900 text-sm font-medium leading-tight truncate">{review.name}</p>
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: review.rating }, (_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <ReviewSourceLogo source={review.source} />
      </div>
    </div>
    <p className="text-slate-700 text-[13px] leading-relaxed mt-3 line-clamp-[7]">
      {review.text}
    </p>
  </div>
);

const starOnlyReviews = [
  { name: 'Serena Huang', rating: 5, avatar: 'unnamed_6_yongxz' },
  { name: 'Alyssa Rose', rating: 5, avatar: 'unnamed_11_sicehm' },
  { name: 'Michael DiPietro', rating: 5, avatar: 'unnamed_7_kjiuvj' },
  { name: 'Brit Haseltine', rating: 5, avatar: 'unnamed_5_guj03k' },
  { name: 'Daniel Horning', rating: 5 },
  { name: 'Abbey Atwater', rating: 5, avatar: 'unnamed_8_l15epu' },
  { name: 'Zach Walgren', rating: 5, avatar: 'unnamed_13_wy7byr' },
  { name: 'Evan Rondenelli', rating: 5, avatar: 'unnamed_12_n2qbjq' },
  { name: 'Yonatan Dvir', rating: 5, avatar: 'unnamed_9_r0cylm' },
  { name: 'Nile Overton', rating: 5, avatar: 'unnamed_10_hrj40s' },
  { name: 'Ben Riesenbach', rating: 5 },
  { name: 'Matt Lockerman', rating: 5 },
  { name: 'Huck Browne', rating: 5, avatar: 'unnamed_15_ec8pov' },
  { name: 'William Klotsas', rating: 5 },
  { name: 'Isaac Sattazahn', rating: 5, avatar: 'unnamed_14_pij93o' },
  { name: 'Julianne', rating: 5, avatar: 'unnamed_16_rhfsl3' },
];

const shortReviews = [
  { name: 'Benjamin Seltzer', rating: 5, avatar: 'unnamed_21_molof5', text: 'Stellar photography, better people. Incredibly easy to work with- the photos were so special!!! Definitely recommend' },
  { name: 'Emma Gleysteen', rating: 5, avatar: 'unnamed_23_ecrgeg', text: 'Ben was great- arrived early and stayed the entire time. Made sure to get lots of angles and provided us with lots of photos post-editing!' },
  { name: 'Robert Lotreck', rating: 5, text: 'Absolutely incredible with the highest quality of professionalism I could ask for. Definitely will be recommending this for every one of my friends’ wedding photography needs going forward.' },
  {
    name: 'Lauren R.',
    rating: 5,
    source: 'thumbtack',
    text: 'Ben was an outstanding wedding photographer - professional, kind, and patient, making our experience with him truly enjoyable. We would highly recommend Ben to any couple seeking a talented and reliable photographer - you won’t be disappointed!',
  },
  { name: 'Jay Patel', rating: 5, text: 'Top notch. The photos and videos came out amazing. I can\'t thank the team enough for helping show off our business.' },
  { name: 'Yonnie Simon', rating: 5, avatar: 'unnamed_22_uhcazg', text: 'Starling Photo Studios is an excellent team dedicated to providing a high quality photography experience. Would recommend.' },
  { name: 'jordan brown', rating: 5, text: 'working with ben and justin was such a pleasure. 5 stars all around!' },
  {
    name: 'Kalvin Thompson',
    rating: 5,
    source: 'thumbtack',
    text: 'Great communication, enthusiastic and unbelievably professional work. We are really happy with our choice to trust starling with our wedding day.',
  },
  { name: 'Darshan Bhalodia', rating: 5, text: 'Ben is an excellent photographer. The experience to photograph my business was flawless. I really appreciated his professionalism and attention to detail. Highly recommend.' },
  { name: 'Henry Miles', rating: 5, avatar: 'unnamed_20_c1iuwj', text: 'Crispy photos, extremely responsive and professional. Would definitely hire again' },
  { name: 'Gabriel Preston', rating: 5, avatar: 'unnamed_19_brkfrr', text: 'Two of the finest individuals I know personally who live up to the name of starlings :) :)' },
  {
    name: 'Tess Elkins',
    rating: 5,
    source: 'thumbtack',
    text: 'Great communication and excellent work product. Everyone involved in the project was very happy with the results.',
  },
  { name: 'snehal Shetty', rating: 5, text: 'The sweetest, bestest and the most patient photographer in town 😊' },
  { name: 'Ben Singer', rating: 5, text: 'Justin is great! Attentive… collaborative spirit' },
  { name: 'Alex Glass', rating: 5, text: 'Very professional, reliable, and high quality!' },
  {
    name: 'Leonard D.',
    rating: 5,
    source: 'thumbtack',
    text: 'This is undoubtedly the best photographer I have had the pleasure to work with. I am completely satisfied with the experience of working together on my event. Thank you. You did an outstanding job.',
  },
  { name: 'Aidan Guynes', rating: 5, avatar: 'unnamed_18_tz3kms', text: 'Loved working with Starling! Would highly recommend.' },
  {
    name: 'Colin Hanna',
    rating: 5,
    source: 'thumbtack',
    text: 'Excellent',
  },
];

const cinematicReviewPool = [
  ...reviews.map((review, index) => ({
    ...review,
    __id: `featured-${index}`,
    __index: index,
  })),
  ...shortReviews.map((review, index) => ({
    ...review,
    __id: `short-${index}`,
    __index: reviews.length + index,
  })),
  ...starOnlyReviews.map((review, index) => ({
    ...review,
    __id: `stars-${index}`,
    __index: reviews.length + shortReviews.length + index,
  })),
];

const cinematicReviewsWithText = cinematicReviewPool.filter((review) => Boolean(String(review.text ?? '').trim()));
const cinematicReviewsStarsOnly = cinematicReviewPool.filter((review) => !Boolean(String(review.text ?? '').trim()));

const ShortReviewCard = ({ review, index }) => {
  const hasText = Boolean(String(review.text ?? '').trim());

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className={`flex items-start gap-3 ${hasText ? 'mb-2' : ''}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {review.avatar ? (
          <img
            src={cld.image(review.avatar).toURL()}
            alt={review.name}
            className="w-9 h-9 flex-shrink-0"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
            style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
          >
            {review.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-slate-900 text-sm font-medium leading-tight truncate">{review.name}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: review.rating }, (_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <ReviewSourceLogo source={review.source} />
      </div>
      </div>
      {hasText ? (
        <p className="text-slate-700 text-[13px] leading-relaxed mt-2 line-clamp-5">
          {review.text}
        </p>
      ) : null}
    </div>
  );
};

const StarOnlyCard = ({ review, index }) => (
  <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
    {review.avatar ? (
      <img
        src={cld.image(review.avatar).toURL()}
        alt={review.name}
        className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
      />
    ) : (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
        style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
      >
        {review.name.charAt(0)}
      </div>
    )}
    <div className="min-w-0 flex-1">
      <p className="text-slate-900 text-sm font-medium leading-tight truncate">{review.name}</p>
      <div className="flex items-center gap-0.5 mt-1">
        {Array.from({ length: review.rating }, (_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
    </div>
    <div className="flex-shrink-0">
      <ReviewSourceLogo source={review.source} />
    </div>
  </div>
);

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mediaQueryList) return;

    const handleChange = () => setPrefersReducedMotion(Boolean(mediaQueryList.matches));
    handleChange();

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia?.(query);
    if (!mediaQueryList) return undefined;

    const handleChange = () => setMatches(Boolean(mediaQueryList.matches));
    handleChange();

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [query]);

  return matches;
};

const CINEMATIC_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const BOOKING_GRID_PHOTO_IDS = [
  'center_city_ag1h8b',
  'AF1I7015_2_hp56wr',
  'AF1I2242-Edit-2_cor6p9',
  '0007__DSC3049-topaz-denoise-denoise_DxO_vh2j4m',
  '0006__DSC3027-topaz-denoise-denoise_DxO_tpqmmc',
  'Molly_Fleming_Select_Edits_-016_yapfgd',
  'Molly_Fleming_Additional_Edits_-0131_iufins',
];

const randFloat = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(randFloat(min, max + 1));

const shuffleInPlace = (arr) => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const createShuffleBag = (size) => shuffleInPlace(Array.from({ length: size }, (_, i) => i));

const getReviewHoldMs = (review) => {
  const text = String(review?.text ?? '').trim();
  if (!text.length) return randInt(8000, 12000);

  const lengthFactor = Math.min(text.length, 260) / 260;
  const base = randInt(12000, 18000);
  const extra = Math.round(lengthFactor * randInt(3000, 7000));
  const linger = Math.random() < 0.18 ? randInt(3000, 6000) : 0;
  return base + extra + linger;
};

const getReviewFadeMs = () => {
  const r = Math.random();
  if (r < 0.12) return randInt(1600, 2200);
  if (r < 0.82) return randInt(2400, 3200);
  return randInt(3200, 4200);
};

const getReviewBreathMs = () => {
  const r = Math.random();
  if (r < 0.65) return randInt(600, 1200);
  if (r < 0.92) return randInt(1200, 2200);
  return randInt(2200, 3800);
};

const buildBookingGridPhotoUrl = (publicId, maxWidth = 560) =>
  cld.image(publicId).format('auto').quality('auto').resize(limitFit().width(maxWidth)).toURL();

const BOOKING_GRID_PHOTO_URL_MAP = Object.fromEntries(
  BOOKING_GRID_PHOTO_IDS.map((publicId) => [publicId, buildBookingGridPhotoUrl(publicId)]),
);

const getPhotoFadeMs = () => {
  const r = Math.random();
  if (r < 0.12) return randInt(1600, 2200);
  if (r < 0.82) return randInt(2400, 3200);
  return randInt(3200, 4200);
};

const getPhotoBreathMs = () => {
  const r = Math.random();
  if (r < 0.72) return randInt(600, 1200);
  if (r < 0.92) return randInt(1200, 2200);
  return randInt(2200, 3800);
};

const CinematicReviewCard = ({ review }) => {
  const hasText = Boolean(String(review?.text ?? '').trim());
  const source = review?.source ?? 'google';
  const index = review?.__index ?? 0;

  const bodyText = hasText ? review.text : 'Verified 5-star rating.';

  return (
    <div className="flex flex-col h-full p-3.5 rounded-[8px] bg-white">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {review?.avatar ? (
            <img
              src={cld.image(review.avatar).toURL()}
              alt={review?.name ?? 'Review'}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] uppercase font-medium tracking-wider flex-shrink-0"
              style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
            >
              {String(review?.name ?? '?').charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-slate-900 text-[11px] uppercase tracking-widest font-medium leading-tight truncate">{review?.name ?? 'Client'}</p>
            <div className="flex items-center gap-0.5 mt-1 opacity-90">
              {Array.from({ length: review?.rating ?? 5 }, (_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 opacity-70 grayscale transition-all duration-500 hover:grayscale-0">
          <ReviewSourceLogo source={source} />
        </div>
      </div>

      <p
        className={`text-[13px] leading-[1.6] line-clamp-2 ${
          hasText ? 'text-slate-500 font-light' : 'text-slate-400 font-light italic'
        }`}
      >
        {bodyText}
      </p>
    </div>
  );
};

const CINEMATIC_GRID_EMPTY_CELL_INDICES = new Set([5, 6]);
const CINEMATIC_GRID_INITIAL_PHOTO_SEEDS = {
  2: { publicId: BOOKING_GRID_PHOTO_IDS[0], initialDelayMs: 400 },
  4: { publicId: BOOKING_GRID_PHOTO_IDS[1], initialDelayMs: 900 },
  9: { publicId: BOOKING_GRID_PHOTO_IDS[5], initialDelayMs: 1300 },
  11: { publicId: BOOKING_GRID_PHOTO_IDS[3], initialDelayMs: 1700 },
};

const REVIEW_GRID_TOTAL =
  12 -
  CINEMATIC_GRID_EMPTY_CELL_INDICES.size -
  Object.keys(CINEMATIC_GRID_INITIAL_PHOTO_SEEDS).length;

const photoSlotId = (publicId) => `photo:${publicId}`;

const getSlotItemId = (item) => {
  if (!item) return null;
  if (item.kind === 'photo') return photoSlotId(item.publicId);
  return item.review?.__id ?? null;
};

const CinematicGridSlot = ({
  engineRef,
  slotKey,
  initialItem,
  initialDelayMs = 0,
  desiredKind,
  allowMorph = true,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const timeoutRef = useRef(null);
  const hasMountedRef = useRef(false);

  const initialKindRef = useRef(initialItem?.kind ?? 'review');

  const itemARef = useRef(initialItem ?? null);
  const itemBRef = useRef(null);
  const showARef = useRef(true);
  const isFirstRunRef = useRef(true);

  const [itemA, setItemA] = useState(itemARef.current);
  const [itemB, setItemB] = useState(itemBRef.current);
  const [showA, setShowA] = useState(showARef.current);
  const [fadeMs, setFadeMs] = useState(() =>
    initialItem?.kind === 'photo' ? getPhotoFadeMs() : getReviewFadeMs(),
  );

  const getTargetKind = useCallback(() => {
    if (!allowMorph) return initialKindRef.current;
    return desiredKind ?? initialKindRef.current;
  }, [allowMorph, desiredKind]);

  const takeReviewFromBag = useCallback(
    (bagKey, list, avoidIds, { ignoreRecent = false } = {}) => {
      if (!list.length) return null;

      const engine = engineRef?.current;
      if (!engine) return null;

      if (!Array.isArray(engine[bagKey])) engine[bagKey] = [];
      if (!Array.isArray(engine.recent)) engine.recent = [];

      if (!engine[bagKey].length) engine[bagKey] = createShuffleBag(list.length);

      const rejected = [];
      const recentIds = engine.recent;
      const recentLimit = Math.min(26, Math.max(10, Math.floor(cinematicReviewPool.length / 4)));
      const maxAttempts = Math.max(12, Math.min(list.length, 30));

      for (let attempts = 0; attempts < maxAttempts && engine[bagKey].length; attempts += 1) {
        const idx = engine[bagKey].pop();
        const item = list[idx];
        const id = item?.__id;

        if (!id || (avoidIds?.has?.(id) ?? false) || (!ignoreRecent && recentIds.includes(id))) {
          rejected.push(idx);
          continue;
        }

        if (rejected.length) engine[bagKey].unshift(...rejected);

        recentIds.unshift(id);
        if (recentIds.length > recentLimit) recentIds.length = recentLimit;

        return item;
      }

      if (rejected.length) engine[bagKey].unshift(...rejected);
      return null;
    },
    [engineRef],
  );

  const pickNextReview = useCallback(
    (avoidIds) => {
      const starsChance = 0.35;
      const tryStars = cinematicReviewsStarsOnly.length && Math.random() < starsChance;

      const primaryList = tryStars ? cinematicReviewsStarsOnly : cinematicReviewsWithText;
      const primaryBag = tryStars ? 'starsBag' : 'textBag';
      const fallbackList = tryStars ? cinematicReviewsWithText : cinematicReviewsStarsOnly;
      const fallbackBag = tryStars ? 'textBag' : 'starsBag';

      return (
        takeReviewFromBag(primaryBag, primaryList, avoidIds) ??
        takeReviewFromBag(fallbackBag, fallbackList, avoidIds) ??
        takeReviewFromBag(primaryBag, primaryList, avoidIds, { ignoreRecent: true }) ??
        takeReviewFromBag(fallbackBag, fallbackList, avoidIds, { ignoreRecent: true }) ??
        primaryList.find((r) => r?.__id && !avoidIds?.has?.(r.__id)) ??
        fallbackList.find((r) => r?.__id && !avoidIds?.has?.(r.__id)) ??
        primaryList[0] ??
        fallbackList[0] ??
        null
      );
    },
    [takeReviewFromBag],
  );

  const takePhotoFromBag = useCallback(
    (avoidIds, { ignoreRecent = false } = {}) => {
      if (!BOOKING_GRID_PHOTO_IDS.length) return null;

      const engine = engineRef?.current;
      if (!engine) return null;

      if (!Array.isArray(engine.photoBag)) engine.photoBag = [];
      if (!Array.isArray(engine.photoRecent)) engine.photoRecent = [];

      if (!engine.photoBag.length) engine.photoBag = createShuffleBag(BOOKING_GRID_PHOTO_IDS.length);

      const rejected = [];
      const recentIds = engine.photoRecent;
      const recentLimit = Math.min(12, Math.max(6, BOOKING_GRID_PHOTO_IDS.length));
      const maxAttempts = Math.max(10, Math.min(BOOKING_GRID_PHOTO_IDS.length, 20));

      for (let attempts = 0; attempts < maxAttempts && engine.photoBag.length; attempts += 1) {
        const idx = engine.photoBag.pop();
        const publicId = BOOKING_GRID_PHOTO_IDS[idx];
        const id = photoSlotId(publicId);

        if (!publicId || (avoidIds?.has?.(id) ?? false) || (!ignoreRecent && recentIds.includes(id))) {
          rejected.push(idx);
          continue;
        }

        if (rejected.length) engine.photoBag.unshift(...rejected);

        recentIds.unshift(id);
        if (recentIds.length > recentLimit) recentIds.length = recentLimit;

        return publicId;
      }

      if (rejected.length) engine.photoBag.unshift(...rejected);
      return null;
    },
    [engineRef],
  );

  const pickNextPhoto = useCallback(
    (avoidIds) =>
      takePhotoFromBag(avoidIds) ??
      takePhotoFromBag(avoidIds, { ignoreRecent: true }) ??
      BOOKING_GRID_PHOTO_IDS.find((publicId) => publicId && !(avoidIds?.has?.(photoSlotId(publicId)) ?? false)) ??
      BOOKING_GRID_PHOTO_IDS[0] ??
      null,
    [takePhotoFromBag],
  );

  const getLayerStyle = useCallback(
    (isVisible) => ({
      opacity: isVisible ? 1 : 0,
      transitionProperty: 'opacity',
      transitionDuration: `${fadeMs}ms`,
      transitionTimingFunction: CINEMATIC_EASE,
      willChange: 'opacity',
    }),
    [fadeMs],
  );

  useEffect(() => {
    const engine = engineRef?.current;
    if (!engine) return undefined;

    if (!engine.slots) engine.slots = {};

    if (!Array.isArray(engine.textBag)) engine.textBag = [];
    if (!Array.isArray(engine.starsBag)) engine.starsBag = [];
    if (!Array.isArray(engine.recent)) engine.recent = [];
    if (!Array.isArray(engine.photoBag)) engine.photoBag = [];
    if (!Array.isArray(engine.photoRecent)) engine.photoRecent = [];

    const id = getSlotItemId(itemARef.current);
    if (id) engine.slots[slotKey] = id;

    return () => {
      const currentEngine = engineRef?.current;
      if (!currentEngine) return;
      delete currentEngine.slots?.[slotKey];
    };
  }, [engineRef, slotKey]);

  useEffect(() => {
    if (itemARef.current) return;

    const engine = engineRef?.current;
    if (!engine) return;

    const takenIds = new Set(Object.values(engine.slots ?? {}));
    const targetKind = getTargetKind();
    const picked =
      targetKind === 'photo'
        ? (() => {
            const publicId = pickNextPhoto(takenIds);
            return publicId ? { kind: 'photo', publicId } : null;
          })()
        : (() => {
            const review = pickNextReview(takenIds);
            return review ? { kind: 'review', review } : null;
          })();

    if (!picked) return;

    itemARef.current = picked;
    setItemA(picked);

    const id = getSlotItemId(picked);
    if (engine?.slots && id) engine.slots[slotKey] = id;
  }, [engineRef, getTargetKind, pickNextPhoto, pickNextReview, slotKey]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let cancelled = false;

    const clear = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };

    const preloadPhoto = (publicId) => {
      const src = BOOKING_GRID_PHOTO_URL_MAP[publicId];
      if (!src) return;
      const img = new Image();
      img.src = src;
    };

    const transitionToNext = () => {
      if (cancelled) return;

      const engine = engineRef?.current;
      if (!engine) return;

      const takenIds = new Set(Object.values(engine.slots ?? {}));
      const currentItem = showARef.current ? itemARef.current : itemBRef.current;
      const currentIsPhoto = currentItem?.kind === 'photo';
      const targetKind = getTargetKind();

      // If we are currently a photo, and the target is still a photo, we shouldn't transition.
      // (This prevents a cell from morphing photo -> review -> photo on its own)
      if (currentIsPhoto && targetKind === 'photo') {
        scheduleNext();
        return;
      }

      const effectiveKind = targetKind;

      const nextItem =
        effectiveKind === 'photo'
          ? (() => {
              const publicId = pickNextPhoto(takenIds);
              return publicId ? { kind: 'photo', publicId } : null;
            })()
          : (() => {
              const review = pickNextReview(takenIds);
              return review ? { kind: 'review', review } : null;
            })();

      if (!nextItem) return;

      const nextFadeMs = nextItem.kind === 'photo' ? getPhotoFadeMs() : getReviewFadeMs();
      setFadeMs(nextFadeMs);

      if (nextItem.kind === 'photo') preloadPhoto(nextItem.publicId);

      if (showARef.current) {
        itemBRef.current = nextItem;
        setItemB(nextItem);
      } else {
        itemARef.current = nextItem;
        setItemA(nextItem);
      }

      window.requestAnimationFrame(() => {
        if (cancelled) return;
        showARef.current = !showARef.current;
        setShowA(showARef.current);

        const id = getSlotItemId(nextItem);
        if (engineRef?.current?.slots && id) engineRef.current.slots[slotKey] = id;

        timeoutRef.current = window.setTimeout(scheduleNext, nextFadeMs + (nextItem.kind === 'photo' ? getPhotoBreathMs() : getReviewBreathMs()));
      });
    };

    const scheduleNext = () => {
      if (cancelled || document.hidden) return;

      const currentItem = showARef.current ? itemARef.current : itemBRef.current;
      const currentIsPhoto = currentItem?.kind === 'photo';
      const targetKind = getTargetKind();

      let holdMs;
      if (!currentItem) {
        holdMs = randInt(300, 1200);
      } else if (currentIsPhoto && targetKind === 'review') {
        // Morphing away from photo: do it immediately
        holdMs = randInt(50, 150);
      } else if (!currentIsPhoto && targetKind === 'photo') {
        // Morphing into a photo: do it immediately so the column is never without a photo
        holdMs = randInt(50, 150);
      } else if (currentIsPhoto && targetKind === 'photo') {
        // Stay as a photo indefinitely until the grid tells this cell to become a review
        holdMs = 1000000;
      } else {
        holdMs = getReviewHoldMs(currentItem?.review);
      }
      timeoutRef.current = window.setTimeout(transitionToNext, holdMs);
    };

    const isFirstRun = !hasMountedRef.current;
    hasMountedRef.current = true;

    if (isFirstRun) {
      timeoutRef.current = window.setTimeout(() => {
        isFirstRunRef.current = false;
        transitionToNext();
      }, initialDelayMs);
    } else {
      isFirstRunRef.current = false;
      timeoutRef.current = window.setTimeout(scheduleNext, randInt(0, 80));
    }

    const handleVisibility = () => {
      if (isFirstRunRef.current) return;
      clear();
      if (!document.hidden) scheduleNext();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clear();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [engineRef, getTargetKind, initialDelayMs, pickNextPhoto, pickNextReview, prefersReducedMotion, slotKey]);

  const renderItem = (item) => {
    if (!item) return null;
    if (item.kind === 'photo') {
      const src = BOOKING_GRID_PHOTO_URL_MAP[item.publicId];
      return (
        <div className="relative w-full overflow-hidden rounded-[8px] bg-white aspect-[4/3] lg:aspect-auto lg:h-full">
          <img
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            draggable="false"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      );
    }
    return <CinematicReviewCard review={item.review} />;
  };

  return (
    <div className="h-full min-h-0 grid grid-cols-1 grid-rows-1">
      <div className="col-start-1 row-start-1 h-full" style={getLayerStyle(showA)}>
        {renderItem(itemA)}
      </div>
      <div className="col-start-1 row-start-1 h-full" style={getLayerStyle(!showA)}>
        {renderItem(itemB)}
      </div>
    </div>
  );
};

const CinematicReviewGrid = ({ engineRef, initialReviews = [] }) => {
  const allowMorph = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = usePrefersReducedMotion();

  const initialDelays = useMemo(() => {
    return createShuffleBag(10).map((i) => i * 2200 + randInt(0, 600));
  }, []);

  const [photoRows, setPhotoRows] = useState({
    0: 1, // cell 4 (row 1)
    1: 2, // cell 9 (row 2)
    2: 0, // cell 2 (row 0)
    3: 2, // cell 11 (row 2)
  });

  const validRowsByCol = useMemo(
    () => ({
      0: [0, 1, 2],
      1: [0, 2],
      2: [0, 2],
      3: [0, 1, 2],
    }),
    [],
  );

  let slotDelayIdx = 0;
  let seededReviewIdx = 0;

  const photoCellByCol = useMemo(
    () => ({
      0: photoRows[0] * 4 + 0,
      1: photoRows[1] * 4 + 1,
      2: photoRows[2] * 4 + 2,
      3: photoRows[3] * 4 + 3,
    }),
    [photoRows],
  );

  useEffect(() => {
    if (!allowMorph) return undefined;
    if (prefersReducedMotion) return undefined;

    let cancelled = false;
    let timeoutId = null;

        const schedule = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;

        setPhotoRows((prev) => {
          // Shuffle columns to pick a random one to change
          const cols = [0, 1, 2, 3];
          for (let i = cols.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cols[i], cols[j]] = [cols[j], cols[i]];
          }

          for (const colToChange of cols) {
            const validRows = validRowsByCol[colToChange];
            const currentRow = prev[colToChange];

            // Get rows that are NOT the current row to ensure it changes to a different card
            let availableRows = validRows.filter((r) => r !== currentRow);

            // Enforce horizontal spacing: don't allow photos to be next to each other in the same row
            if (colToChange > 0) {
              availableRows = availableRows.filter((r) => r !== prev[colToChange - 1]);
            }
            if (colToChange < 3) {
              availableRows = availableRows.filter((r) => r !== prev[colToChange + 1]);
            }

            if (availableRows.length > 0) {
              // Pick a random new row from the available ones
              const newRow = availableRows[Math.floor(Math.random() * availableRows.length)];
              return {
                ...prev,
                [colToChange]: newRow,
              };
            }
          }

          return prev;
        });

        schedule();
      }, randInt(14000, 22000));
    };

    schedule();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [allowMorph, prefersReducedMotion, validRowsByCol]);

  return (
    <div className="mx-auto select-none" style={{ maxWidth: 1128 }}>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 lg:h-[563px]"
        style={{ columnGap: 36, rowGap: 40 }}
      >
        {Array.from({ length: 12 }, (_, cellIdx) => {
          if (CINEMATIC_GRID_EMPTY_CELL_INDICES.has(cellIdx)) {
            return <div key={`grid-empty-${cellIdx}`} className="hidden lg:block" />;
          }

          const computedDelay = initialDelays[slotDelayIdx++];
          const photoSeed = CINEMATIC_GRID_INITIAL_PHOTO_SEEDS[cellIdx];
          
          if (photoSeed) {
            return (
              <CinematicGridSlot
                key={`grid-${cellIdx}`}
                engineRef={engineRef}
                slotKey={`grid-${cellIdx}`}
                initialItem={{ kind: 'photo', publicId: photoSeed.publicId }}
                initialDelayMs={computedDelay}
                desiredKind={allowMorph ? (photoCellByCol[cellIdx % 4] === cellIdx ? 'photo' : 'review') : undefined}
                allowMorph={allowMorph}
              />
            );
          }

          const review = initialReviews[seededReviewIdx++];

          return (
            <CinematicGridSlot
              key={`grid-${cellIdx}`}
              engineRef={engineRef}
              slotKey={`grid-${cellIdx}`}
              initialItem={review ? { kind: 'review', review } : undefined}
              initialDelayMs={computedDelay}
              desiredKind={allowMorph ? (photoCellByCol[cellIdx % 4] === cellIdx ? 'photo' : 'review') : undefined}
              allowMorph={allowMorph}
            />
          );
        })}
      </div>
    </div>
  );
};

const ReviewsGrid = () => {
  const bigRemainder = reviews.length % 3;
  const promotedCount = bigRemainder === 0 ? 0 : 3 - bigRemainder;

  const promotedShortReviews = shortReviews.slice(0, promotedCount);
  const remainingShortReviews = shortReviews.slice(promotedCount);

  const shortRemainder = remainingShortReviews.length % 3;
  const shortFillCountRaw = shortRemainder === 0 ? 0 : 3 - shortRemainder;
  const shortFillCount = Math.min(shortFillCountRaw, starOnlyReviews.length);

  const shortFillStarOnlyReviews = starOnlyReviews.slice(0, shortFillCount);
  const remainingStarOnlyReviews = starOnlyReviews.slice(shortFillCount);

  return (
    <section className="mt-24 w-full">
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
          What Our Clients Say
        </h2>

        <div className="mt-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <ReviewCard key={`featured-${review.name}`} review={review} index={index} />
            ))}
            {promotedShortReviews.map((review, index) => (
              <ReviewCard
                key={`promoted-${review.name}`}
                review={review}
                index={reviews.length + index}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {remainingShortReviews.map((review, index) => (
              <ShortReviewCard key={`short-${review.name}`} review={review} index={index} />
            ))}
            {shortFillStarOnlyReviews.map((review, index) => (
              <ShortReviewCard
                key={`short-fill-stars-${review.name}`}
                review={review}
                index={remainingShortReviews.length + index}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {remainingStarOnlyReviews.map((review, index) => (
              <StarOnlyCard
                key={`stars-${review.name}`}
                review={review}
                index={shortFillCount + index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    location: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [showDate, setShowDate] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const railEngineRef = useRef({
    textBag: [],
    starsBag: [],
    recent: [],
    photoBag: [],
    photoRecent: [],
    slotCols: {},
    photoCooldownUntil: {},
    slots: {},
  });

  const initialGridReviews = useMemo(() => {
    const pool = [...cinematicReviewPool];
    shuffleInPlace(pool);
    return pool.slice(0, Math.min(REVIEW_GRID_TOTAL, pool.length));
  }, []);

  const formatField = (value) => {
    const trimmed = String(value ?? '').trim();
    return trimmed.length ? trimmed : '—';
  };

  const buildInquiryBody = (data) =>
    [
      `Name: ${formatField(data.name)}`,
      `Email: ${formatField(data.email)}`,
      `Phone: ${formatField(data.phone)}`,
      `Event date: ${formatField(data.date)}`,
      `Location: ${formatField(data.location)}`,
      '',
      'Message:',
      formatField(data.message),
    ].join('\n');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    const inquiryBody = buildInquiryBody(formData);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: new Date().toLocaleString(),
          location: formData.location,
          message: inquiryBody,
          reply_to: formData.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', date: '', location: '', message: '' });
      })
      .catch(() => {
        setStatus('error');
      });
  };

  return (
    <div className="animate-fade-in opacity-0 min-h-screen py-12 md:py-24 relative isolate">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 z-0 h-[clamp(1800px,220vh,3000px)] lg:h-[clamp(1600px,200vh,2600px)]"
        style={{
          background:
            'radial-gradient(52.85% 52.85% at 49.04% 47.15%, #D0E8FF 0%, #F5F5F7 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0) 100%)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      />

      <div className="relative z-10">
        <div className="px-6 md:px-12 max-w-7xl mx-auto lg:grid lg:grid-cols-1">
          <div className="lg:col-start-1 lg:row-start-1">
            <CinematicReviewGrid
              engineRef={railEngineRef}
              initialReviews={initialGridReviews}
            />
          </div>

          <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1 lg:flex lg:items-start lg:justify-center lg:pointer-events-none lg:z-10 lg:pt-[114px]">
            <div
              className="mx-auto lg:pointer-events-auto relative overflow-hidden"
              style={{
                width: '100%',
                maxWidth: 608,
                borderRadius: 22,
                backgroundColor: '#242424',
                border: '1px solid #000000',
                padding: '36px 44px',
              }}
            >
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  status === 'success' 
                    ? 'opacity-100 translate-y-0 z-10 pointer-events-auto duration-1000 delay-500' 
                    : 'opacity-0 translate-y-8 -z-10 pointer-events-none duration-500 delay-0'
                }`}
                style={{ padding: '36px 44px' }}
              >
                <div className="flex-1 flex items-center justify-center w-full">
                  <p className="text-white text-center font-light" style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', lineHeight: '1.5' }}>
                    Thank you for your submission.
                    <br />
                    We'll be in touch shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="flex items-center justify-center cursor-pointer transition-opacity duration-300 hover:opacity-80 shrink-0"
                  style={{
                    width: 143,
                    height: 24,
                    backgroundColor: '#F7F7F7',
                    borderRadius: 6,
                    color: '#000000',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 14,
                    border: 'none',
                  }}
                >
                  New Inquiry
                </button>
              </div>

              <div
                className={`transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  status === 'success' 
                    ? 'pointer-events-none' 
                    : 'pointer-events-auto'
                }`}
              >
                <form onSubmit={handleSubmit} className="w-full">
                <div
                  style={{
                    pointerEvents: (status === 'sending' || status === 'success') ? 'none' : 'auto',
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                    <div
                      className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                      style={{ transitionDelay: (status === 'sending' || status === 'success') ? '0ms' : '300ms' }}
                    >
                      <label htmlFor="name" className="block text-xs uppercase tracking-widest mb-5" style={{ color: '#FFFFFF' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                        style={{ border: 'none', borderBottom: '1px solid #B7B7B7' }}
                      />
                    </div>
                    <div
                      className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                      style={{ transitionDelay: (status === 'sending' || status === 'success') ? '50ms' : '350ms' }}
                    >
                      <label htmlFor="email" className="block text-xs uppercase tracking-widest mb-5" style={{ color: '#FFFFFF' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                        style={{ border: 'none', borderBottom: '1px solid #B7B7B7' }}
                      />
                    </div>
                  </div>

                <div 
                  className={`mt-7 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                  style={{ transitionDelay: (status === 'sending' || status === 'success') ? '100ms' : '400ms' }}
                >
                  <label htmlFor="phone" className="block text-xs uppercase tracking-widest mb-5" style={{ color: '#FFFFFF' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                    style={{ border: 'none', borderBottom: '1px solid #B7B7B7' }}
                  />
                </div>

                <div className="flex justify-between mt-7">
                  <div
                    className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                    style={{ transitionDelay: (status === 'sending' || status === 'success') ? '150ms' : '450ms' }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowDate((v) => !v)}
                      className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70"
                      style={{ color: '#636363' }}
                    >
                      {showDate ? '−' : '+'} event date
                    </button>
                  </div>
                  <div
                    className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                    style={{ transitionDelay: (status === 'sending' || status === 'success') ? '200ms' : '500ms' }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowLocation((v) => !v)}
                      className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70"
                      style={{ color: '#636363' }}
                    >
                      {showLocation ? '−' : '+'} location
                    </button>
                  </div>
                  <div
                    className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                    style={{ transitionDelay: (status === 'sending' || status === 'success') ? '250ms' : '550ms' }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowMessage((v) => !v)}
                      className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70"
                      style={{ color: '#636363' }}
                    >
                      {showMessage ? '−' : '+'} tell us more
                    </button>
                  </div>
                </div>

                <div 
                  className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                  style={{ transitionDelay: (status === 'sending' || status === 'success') ? '300ms' : '600ms' }}
                >
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: showDate ? 100 : 0, opacity: showDate ? 1 : 0 }}
                  >
                    <div className="mt-6">
                      <label htmlFor="date" className="block text-xs uppercase tracking-widest mb-4" style={{ color: '#FFFFFF' }}>
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                        style={{ border: 'none', borderBottom: '1px solid #B7B7B7', colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                </div>

                <div 
                  className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                  style={{ transitionDelay: (status === 'sending' || status === 'success') ? '350ms' : '650ms' }}
                >
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: showLocation ? 100 : 0, opacity: showLocation ? 1 : 0 }}
                  >
                    <div className="mt-6">
                      <label htmlFor="location" className="block text-xs uppercase tracking-widest mb-4" style={{ color: '#FFFFFF' }}>
                        Location / Venue
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                        style={{ border: 'none', borderBottom: '1px solid #B7B7B7' }}
                      />
                    </div>
                  </div>
                </div>

                <div 
                  className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                  style={{ transitionDelay: (status === 'sending' || status === 'success') ? '400ms' : '700ms' }}
                >
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: showMessage ? 160 : 0, opacity: showMessage ? 1 : 0 }}
                  >
                    <div className="mt-6">
                      <label htmlFor="message" className="block text-xs uppercase tracking-widest mb-4" style={{ color: '#FFFFFF' }}>
                        Tell Us More
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none resize-none"
                        style={{ border: 'none', borderBottom: '1px solid #B7B7B7' }}
                      />
                    </div>
                  </div>
                </div>
                </div>

                <div 
                  className={`flex justify-center mt-9 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(status === 'sending' || status === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                  style={{ transitionDelay: (status === 'sending' || status === 'success') ? '450ms' : '750ms' }}
                >
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex items-center justify-center cursor-pointer transition-opacity duration-300"
                    style={{
                      width: 143,
                      height: 24,
                      backgroundColor: '#F7F7F7',
                      borderRadius: 6,
                      color: '#000000',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: 14,
                      border: 'none',
                      opacity: status === 'sending' ? 0.8 : 1,
                    }}
                  >
                    Submit
                  </button>
                </div>

                {status === 'error' && (
                  <p 
                    className={`text-red-400 text-sm font-light mt-4 text-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${status === 'error' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                  >
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
              </div>
            </div>

          </div>
        </div>

        <ReviewsGrid />
      </div>
    </div>
  );
};

export { ReviewsGrid, CinematicReviewGrid, cinematicReviewPool, shuffleInPlace, REVIEW_GRID_TOTAL };
export default Booking;
