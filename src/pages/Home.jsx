import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';
import { limitFit } from '@cloudinary/url-gen/actions/resize';
import { useRef, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { supabase } from '../utils/supabase';
import ScrollBookingReveal from '../components/ScrollBookingReveal';
import { ReviewsGrid } from './Booking';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HERO_IMAGE_IDS = [
  'AF1I0729_catszb',
  '2021-12-01_fj6dqk',
  'Image_1_iz7lk8',
  'AF1I1454_vcc77d',
  '3P4A1455_ctp4pj',
];

const HERO_IMAGE_ALTS = [
  'Editorial portrait portfolio image by Starling Photography',
  'Wedding portrait portfolio image by Starling Photography',
  'Lifestyle portfolio image by Starling Photography',
  'Bride and groom portrait portfolio image by Starling Photography',
  'Event portrait portfolio image by Starling Photography',
];

const WEDDING_1_IMAGE_IDS = [
  'Molly_Fleming_Additional_Edits_-0001_dcp3mi',
  'Molly_Fleming_Select_Edits_-023_kesq95',
  'Molly_Fleming_Select_Edits_-013_madlt2',
  'Molly_Fleming_Select_Edits_-015_oki1n0',
  'Molly_Fleming_Additional_Edits_-0192_ghi9rs',
  'Molly_Fleming_Select_Edits_-016_yapfgd',
  'Molly_Fleming_Additional_Edits_-0115_rs0fgh',
  'Molly_Fleming_Additional_Edits_-0149_jbt3yz',
];

const WEDDING_1_IMAGE_ALTS = [
  'wedding portrait in Green Lane, Pennsylvania',
  'candid wedding moment in Green Lane, Pennsylvania',
  'wedding detail photography in Green Lane, Pennsylvania',
  'couple portrait from their summer wedding',
  'celebration photography in Green Lane, Pennsylvania',
  'wedding portfolio image',
  'outdoor wedding portrait in Pennsylvania',
  'summer wedding photography',
];

const WEDDING_2_IMAGE_IDS = [
  '0006__DSC3027-topaz-denoise-denoise_DxO_tpqmmc',
  '0007__DSC3049-topaz-denoise-denoise_DxO_vh2j4m',
  '0010__DSC3081-topaz-denoise-denoise_DxO_rzb2jn',
  '0009__DSC3078-topaz-denoise-denoise_DxO_jsffaf',
  '0001__DSC0749-topaz-denoise-denoise_DxO_rv1pwc',
  '0008__DSC3059-topaz-denoise-denoise_DxO_mtpjqi',
  '0005__DSC2794-topaz-denoise-denoise_DxO_sltnnl',
  '0016__DSC4459-topaz-denoise-denoise_DxO_cjqihn',
];

const WEDDING_2_IMAGE_ALTS = [
  'wedding portrait at Glasbern',
  'candid wedding photography at Glasbern',
  'ceremony photography at Glasbern',
  'Makayla and Hunter wedding detail image at Glasbern',
  'couple portrait at Glasbern',
  'celebration photography at Glasbern',
  'summer wedding portrait',
  'wedding portfolio image at Glasbern',
];

const WEDDING_3_IMAGE_IDS = [
  'Neeshay_White_Select_Edits_-008_ldxv2v',
  'Neeshay_White_Select_Edits_-003_shgp50',
  'Neeshay_White_Select_Edits_-006_yhjwc1',
  'Neeshay_White_Select_Edits_-001_lge9tl',
];

const WEDDING_3_IMAGE_ALTS = [
  'Neeshay and James wedding portrait in Ardmore, Pennsylvania',
  'Neeshay and James candid wedding photography in Ardmore',
  'Neeshay and James wedding detail image in Ardmore, Pennsylvania',
  'Neeshay and James celebration portrait in Ardmore',
];

const ASSORTED_IMAGE_IDS = [
  'AF1I2242-Edit-2_cor6p9',
  'AF1I7015_2_hp56wr',
  '3P4A3745_otnq3g',
  'center_city_ag1h8b',
  '481666221_1153185816742175_5478825840378387253_n_ghztfm',
  '481208611_1153185853408838_4828418083954240645_n_ibeopl',
  '486975237_1174151831312240_7366045333287137682_n_q31v3y',
  '467500758_18303674563206065_3791607323077205586_n_n9awon',
  '467556740_18303681562206065_6578080749619128591_n_roaquw',
  '481777607_4086871861532488_3131714259942236180_n_h5cbs9',
  '482247755_4092919330927741_6702387078515023031_n_bvw40o',
  '476573711_4064025533817121_6295416143369206442_n_ewzzea',
];

const ASSORTED_IMAGE_ALTS = [
  'Selected portfolio image from a Philadelphia portrait session',
  'Selected portfolio image from an editorial shoot',
  'Selected portfolio image from a wedding portrait session',
  'Selected portfolio image photographed in Center City Philadelphia',
  'Selected portfolio image from a lifestyle photography session',
  'Selected portfolio image from a commercial portrait session',
  'Selected portfolio image featuring on-location photography',
  'Selected portfolio image from a wedding celebration',
  'Selected portfolio image from an event portrait session',
  'Selected portfolio image from an editorial portrait session',
  'Selected portfolio image from a city photography session',
  'Selected portfolio image from a lifestyle portrait session',
];

const STACK_OFFSET_DESKTOP_X = 44;
const STACK_OFFSET_DESKTOP_Y = 32;
const STACK_OFFSET_MOBILE_X = 24;
const STACK_OFFSET_MOBILE_Y = 16;
const STACK_COUNT = 3;
const CARD_SHADOWS = ['none', 'none', 'none'];
const EXPANDED_GALLERY_DESKTOP_GRID_COLUMNS = 15;
const EXPANDED_GALLERY_DESKTOP_CARD_SPAN = 3;
const EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_START = 4;
const EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_SPAN = 9;
const EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START = 2;
const EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN = 3;
const EXPANDED_GALLERY_DESKTOP_SLOT_COUNT =
  EXPANDED_GALLERY_DESKTOP_GRID_COLUMNS / EXPANDED_GALLERY_DESKTOP_CARD_SPAN;
const EXPANDED_GALLERY_FLOW_MAX_X = 26;
const EXPANDED_GALLERY_FLOW_MAX_Y = 14;
const EXPANDED_GALLERY_FLOW_DEAD_ZONE = 0.34;
const EXPANDED_GALLERY_SOFT_CLOSE_DURATION = 0.82;
const EXPANDED_GALLERY_SOFT_REVEAL_DURATION = 0.82;
const EXPANDED_GALLERY_PREMIUM_OPEN_DURATION = 0.56;
const EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION = 0.68;
const EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION = 0.62;
const EXPANDED_GALLERY_PERIMETER_PROGRESS_INIT_DELAY_MS = Math.round(
  (Math.max(
    EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION,
    EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION
  ) + 0.08) * 1000
);
const EXPANDED_GALLERY_PERIMETER_FLOW_STAGGER = 0.018;
const buildExpandedGalleryDesktopRows = (images) => {
  const rows = [];

  let imageIndex = 0;
  let rowNumber = 1;

  while (imageIndex < images.length) {
    const row = Array.from(
      { length: EXPANDED_GALLERY_DESKTOP_SLOT_COUNT },
      () => null
    );
    const isPinnedRow =
      rowNumber >= EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START &&
      rowNumber <
        EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START +
          EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN;
    const slotIndexes = isPinnedRow
      ? [0, EXPANDED_GALLERY_DESKTOP_SLOT_COUNT - 1]
      : Array.from(
        { length: EXPANDED_GALLERY_DESKTOP_SLOT_COUNT },
        (_, slotIndex) => slotIndex
      );

    for (const slotIndex of slotIndexes) {
      if (imageIndex >= images.length) break;
      row[slotIndex] = images[imageIndex];
      imageIndex += 1;
    }

    rows.push(row);
    rowNumber += 1;
  }

  return rows;
};

const clampValue = (min, value, max) => Math.min(max, Math.max(min, value));
const interpolateValue = (from, to, progress) => (
  from + ((to - from) * clampValue(0, progress, 1))
);
const EXPANDED_GALLERY_PERIMETER_CARD_WIDTH = 16;
const EXPANDED_GALLERY_PERIMETER_HERO_WIDTH = 56;
const createExpandedGalleryPerimeterPose = (x, y, edge, opacity = 1) => ({
  x,
  y,
  edge,
  width: EXPANDED_GALLERY_PERIMETER_CARD_WIDTH,
  rotate: 0,
  scale: 1,
  opacity,
});
const perimeterSnapEase = (t) => t * t * (3 - 2 * t);
const interpolatePerimeterPose = (fromPose, toPose, progress) => {
  const clampedProgress = clampValue(0, progress, 1);
  const eased = perimeterSnapEase(clampedProgress);
  let x = interpolateValue(fromPose.x, toPose.x, eased);
  let y = interpolateValue(fromPose.y, toPose.y, eased);

  if (fromPose.edge !== toPose.edge) {
    let cornerX = fromPose.x;
    let cornerY = fromPose.y;

    if (fromPose.edge === 'left' && toPose.edge === 'bottom') {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    } else if (fromPose.edge === 'bottom' && toPose.edge === 'right') {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === 'right' && toPose.edge === 'top') {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    } else if (fromPose.edge === 'top' && toPose.edge === 'left') {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === 'top' && toPose.edge === 'right') {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === 'right' && toPose.edge === 'bottom') {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    } else if (fromPose.edge === 'bottom' && toPose.edge === 'left') {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === 'left' && toPose.edge === 'top') {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    }

    if (eased < 0.5) {
      const localProgress = eased * 2;
      x = interpolateValue(fromPose.x, cornerX, localProgress);
      y = interpolateValue(fromPose.y, cornerY, localProgress);
    } else {
      const localProgress = (eased - 0.5) * 2;
      x = interpolateValue(cornerX, toPose.x, localProgress);
      y = interpolateValue(cornerY, toPose.y, localProgress);
    }
  }

  const opacityT = perimeterSnapEase(clampValue(0, clampedProgress * 1.3, 1));

  return {
    x,
    y,
    edge: toPose.edge,
    width: interpolateValue(fromPose.width, toPose.width, eased),
    rotate: interpolateValue(fromPose.rotate, toPose.rotate, eased),
    scale: interpolateValue(fromPose.scale, toPose.scale, eased),
    opacity: interpolateValue(fromPose.opacity, toPose.opacity, opacityT),
  };
};
const EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT = 5;
const EXPANDED_GALLERY_PERIMETER_VISIBLE_COUNT =
  EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT * 2;
const EXPANDED_GALLERY_PERIMETER_LEFT_TRACK = {
  slots: [
    createExpandedGalleryPerimeterPose(30, 96, 'bottom'),
    createExpandedGalleryPerimeterPose(13, 75, 'left'),
    createExpandedGalleryPerimeterPose(13, 50, 'left'),
    createExpandedGalleryPerimeterPose(13, 25, 'left'),
    createExpandedGalleryPerimeterPose(33, 3, 'top'),
  ],
  entry: createExpandedGalleryPerimeterPose(30, 103, 'bottom', 0),
  exit: createExpandedGalleryPerimeterPose(33, -4, 'top', 0),
};
const EXPANDED_GALLERY_PERIMETER_RIGHT_TRACK = {
  slots: [
    createExpandedGalleryPerimeterPose(70, 96, 'bottom'),
    createExpandedGalleryPerimeterPose(87, 75, 'right'),
    createExpandedGalleryPerimeterPose(87, 50, 'right'),
    createExpandedGalleryPerimeterPose(87, 25, 'right'),
    createExpandedGalleryPerimeterPose(67, 3, 'top'),
  ],
  entry: createExpandedGalleryPerimeterPose(70, 103, 'bottom', 0),
  exit: createExpandedGalleryPerimeterPose(67, -4, 'top', 0),
};
const EXPANDED_GALLERY_PERIMETER_CENTER_TRACK_SLOT_COUNT = 1;
const EXPANDED_GALLERY_PERIMETER_CENTER_TRACK = {
  slots: [
    createExpandedGalleryPerimeterPose(50, 3, 'top'),
  ],
  entry: createExpandedGalleryPerimeterPose(50, 3, 'top', 0),
  exit: createExpandedGalleryPerimeterPose(50, -4, 'top', 0),
};
const EXPANDED_GALLERY_PERIMETER_BOTTOM_CENTER_TRACK = {
  slots: [
    createExpandedGalleryPerimeterPose(50, 96, 'bottom'),
  ],
  entry: createExpandedGalleryPerimeterPose(50, 103, 'bottom', 0),
  exit: createExpandedGalleryPerimeterPose(50, 96, 'bottom', 0),
};
const resolveTrackPose = (track, position) => {
  const slots = track.slots;
  const lastSlotIndex = slots.length - 1;
  if (position <= 0) {
    return interpolatePerimeterPose(track.entry, slots[0], position + 1);
  }
  if (position >= lastSlotIndex) {
    return interpolatePerimeterPose(
      slots[lastSlotIndex],
      track.exit,
      position - lastSlotIndex
    );
  }
  const fromIndex = Math.floor(position);
  const toIndex = Math.min(fromIndex + 1, lastSlotIndex);
  return interpolatePerimeterPose(
    slots[fromIndex],
    slots[toIndex],
    position - fromIndex
  );
};
const resolveCapturedGalleryRect = (rects, cardKey) => {
  if (!cardKey) return null;
  return rects.get(cardKey) ?? rects.get(cardKey.replace(/:btm$/, '')) ?? null;
};
const isRectNearViewport = (rect, padding = 160) => (
  (rect.left + rect.width) >= -padding &&
  rect.left <= window.innerWidth + padding &&
  (rect.top + rect.height) >= -padding &&
  rect.top <= window.innerHeight + padding
);
const getPerimeterEntryOffset = (edge) => {
  if (edge === 'left') return { x: -18, y: 0 };
  if (edge === 'right') return { x: 18, y: 0 };
  if (edge === 'top') return { x: 0, y: -14 };
  return { x: 0, y: 14 };
};

const useMediaQuery = (query) => {
  const getInitial = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return Boolean(window.matchMedia(query).matches);
  };

  const [matches, setMatches] = useState(getInitial);

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

const buildOptimizedImage = (publicId, maxWidth) => {
  const img = cld.image(publicId).format('auto').quality('auto');
  if (typeof maxWidth === 'number') {
    img.resize(limitFit().width(maxWidth));
  }
  return img;
};

const buildPlaceholderUrl = (publicId, maxWidth = 96) => {
  return cld
    .image(publicId)
    .format('auto')
    .quality(10)
    .resize(limitFit().width(maxWidth))
    .toURL();
};

const loadedGalleryImageIds = new Set();

const ProgressiveCldImage = ({
  publicId,
  cldImg,
  alt,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  placeholderWidth = 96,
  imgClassName = '',
}) => {
  const [hiLoaded, setHiLoaded] = useState(() => loadedGalleryImageIds.has(publicId));
  const [hiError, setHiError] = useState(false);

  const placeholderSrc = useMemo(
    () => buildPlaceholderUrl(publicId, placeholderWidth),
    [publicId, placeholderWidth]
  );

  const [prevPublicId, setPrevPublicId] = useState(publicId);
  if (prevPublicId !== publicId) {
    setPrevPublicId(publicId);
    setHiLoaded(loadedGalleryImageIds.has(publicId));
    setHiError(false);
  }

  const handleHiLoad = useCallback((e) => {
    const el = e.currentTarget;
    const markLoaded = () => {
      loadedGalleryImageIds.add(publicId);
      setHiLoaded(true);
    };

    if (typeof el?.decode === 'function') {
      el.decode().then(
        markLoaded,
        markLoaded
      );
      return;
    }
    markLoaded();
  }, [publicId]);

  const showHi = hiLoaded && !hiError;

  return (
    <>
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          showHi ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      >
        <img
          src={placeholderSrc}
          alt=""
          loading="eager"
          decoding="async"
          className={`w-full h-full ${imgClassName} blur-2xl`}
        />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          showHi ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <AdvancedImage
          cldImg={cldImg}
          className={`w-full h-full ${imgClassName}`}
          alt={alt}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          onLoad={handleHiLoad}
          onError={() => setHiError(true)}
        />
      </div>
    </>
  );
};

const useSectionMount = (rootMargin = '250px') => {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender, rootMargin]);

  return [sectionRef, shouldRender];
};

const useReveal = (shouldAnimate) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    const ctx = gsap.context(() => {
      const reveal = () => {
        gsap.to(node, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      };

      gsap.set(node, { opacity: 0, y: 20 });

      // If the section is already in view (common after layout shifts),
      // don't leave it stuck at opacity:0 waiting for a scroll event.
      const threshold = window.innerHeight * 0.93;
      const rect = node.getBoundingClientRect();
      if (rect.top < threshold && rect.bottom > 0) {
        reveal();
        return;
      }

      ScrollTrigger.create({
        trigger: node,
        start: 'top 93%',
        once: true,
        onEnter: reveal,
      });
    });

    return () => ctx.revert();
  }, [shouldAnimate]);

  return ref;
};

const useStaggerReveal = (shouldAnimate) => {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) return;
    const node = gridRef.current;
    if (!node) return;

    const items = [...node.children];
    if (!items.length) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    const ctx = gsap.context(() => {
      const reveal = (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          overwrite: true,
          clearProps: 'opacity,transform',
        });
      };

      gsap.set(items, { opacity: 0, y: 30 });

      ScrollTrigger.batch(items, {
        start: 'top 93%',
        onEnter: reveal,
        onEnterBack: reveal,
      });

      // If the grid is already on-screen (e.g. after a big layout change),
      // ensure the cards aren't stuck hidden awaiting a scroll-trigger tick.
      const threshold = window.innerHeight * 0.93;
      const inView = items.filter((el) => {
        if (!(el instanceof HTMLElement)) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < threshold && rect.bottom > 0;
      });
      if (inView.length) reveal(inView);
    });

    return () => ctx.revert();
  }, [shouldAnimate]);

  return gridRef;
};

const Home = () => {
  const [visibleSet, setVisibleSet] = useState([0, 1, 2]);
  const [departingIdx, setDepartingIdx] = useState(null);
  const [entranceDone, setEntranceDone] = useState(false);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isClosingQuoteModal, setIsClosingQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ phone: '' });
  const [quoteStatus, setQuoteStatus] = useState('idle');
  const [showStickyReachOut, setShowStickyReachOut] = useState(false);

  const closeQuoteModal = useCallback((isSlow = false) => {
    setIsClosingQuoteModal(isSlow ? 'slow' : 'fast');
    setTimeout(() => {
      setShowQuoteModal(false);
      setQuoteStatus('idle');
      setQuoteForm({ phone: '' });
      setIsClosingQuoteModal(false);
    }, isSlow ? 1500 : 350);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const docEl = document.documentElement;
    if (showQuoteModal && !isClosingQuoteModal) {
      docEl.setAttribute('data-quote-modal-open', '');
      docEl.removeAttribute('data-quote-modal-restoring');
    } else if (showQuoteModal && isClosingQuoteModal) {
      docEl.removeAttribute('data-quote-modal-open');
      docEl.setAttribute('data-quote-modal-restoring', '');
    } else {
      docEl.removeAttribute('data-quote-modal-open');
      docEl.removeAttribute('data-quote-modal-restoring');
    }

    return () => {
      docEl.removeAttribute('data-quote-modal-open');
      docEl.removeAttribute('data-quote-modal-restoring');
    };
  }, [showQuoteModal, isClosingQuoteModal]);

  useEffect(() => {
    const openFromNav = () => setShowQuoteModal(true);
    window.addEventListener('starling:open-quote', openFromNav);
    return () => window.removeEventListener('starling:open-quote', openFromNav);
  }, []);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteStatus('sending');

    const emailPromise = emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: 'Quick Quote Request',
        email: 'quote@request.com',
        phone: quoteForm.phone,
        date: '',
        time: new Date().toLocaleString(),
        location: '',
        message: `Quick quote request.\nPhone: ${quoteForm.phone}`,
        reply_to: 'quote@request.com',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );

    supabase.from('inquiries').insert({
      type: 'quick_quote',
      name: 'Quick Quote Request',
      phone: quoteForm.phone,
    }).then(({ error }) => {
      if (error) console.error('Supabase insert error:', error);
    });

    emailPromise
      .then(() => {
        setQuoteStatus('success');
        setTimeout(() => {
          closeQuoteModal(true);
        }, 3000);
      })
      .catch(() => {
        setQuoteStatus('error');
      });
  };
  const stackIntervalRef = useRef(null);
  const stackRef = useRef(null);
  const visibleSetRef = useRef([0, 1, 2]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [stackWidth, setStackWidth] = useState(null);

  const isMobileStack = useMediaQuery(
    '(max-width: 767px), (orientation: landscape) and (max-height: 500px)'
  );
  const isMobileLandscape = useMediaQuery(
    '(max-width: 1023px) and (orientation: landscape) and (max-height: 500px)'
  );
  const isDesktopGallery = useMediaQuery('(min-width: 1024px)');
  const [viewportWidth, setViewportWidth] = useState(() =>
    (typeof window === 'undefined' ? 1440 : window.innerWidth)
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    (typeof window === 'undefined' ? 900 : window.innerHeight)
  );
  const [expandedGalleryImage, setExpandedGalleryImage] = useState(null);
  const expandedGalleryImageKey = expandedGalleryImage
    ? `${expandedGalleryImage.galleryKey}:${expandedGalleryImage.imageId}`
    : null;
  const hasExpandedGalleryImage = Boolean(expandedGalleryImage);
  const expandedGalleryStageRef = useRef(null);
  const expandedGalleryFixedCardRef = useRef(null);
  const expandedGallerySourceRectRef = useRef(null);
  const expandedGalleryRectsRef = useRef(new Map());
  const expandedGalleryClosingCloneRef = useRef(null);
  const expandedGalleryOpeningCloneRef = useRef(null);
  const expandedGalleryPremiumOpenKeyRef = useRef(null);
  const expandedGallerySoftCloseRef = useRef(false);
  const expandedGalleryIsClosingRef = useRef(false);
  const expandedGalleryWasVisibleRef = useRef(false);
  const expandedGalleryWasOpenRef = useRef(false);
  const [_expandedGalleryPinSize, setExpandedGalleryPinSize] = useState(null);
  const [expandedGalleryPerimeterProgress, setExpandedGalleryPerimeterProgress] = useState(0);
  const [expandedGalleryPinnedRowOffset, setExpandedGalleryPinnedRowOffset] = useState(0);
  const expandedGalleryRowMetricsRef = useRef({
    basePinnedRowTopFromStage: 0,
    rowStep: 0,
  });
  const expandedGalleryAnimatedRowsRef = useRef(new Set());
  const expandedGalleryPerimeterSnapRef = useRef({
    target: 0,
    current: 0,
    animId: 0,
  });
  const [mobileLightbox, setMobileLightbox] = useState(null);
  const mobileLightboxTouchStartRef = useRef(null);
  const mobileLightboxImage = mobileLightbox?.images?.[mobileLightbox.index] ?? null;

  useEffect(() => {
    expandedGalleryRowMetricsRef.current = {
      basePinnedRowTopFromStage: 0,
      rowStep: 0,
    };
    expandedGalleryAnimatedRowsRef.current.clear();
    const snap = expandedGalleryPerimeterSnapRef.current;
    if (snap.animId) window.cancelAnimationFrame(snap.animId);
    snap.target = 0;
    snap.current = 0;
    snap.animId = 0;
  }, [expandedGalleryImageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!isDesktopGallery) return undefined;

    // The expanded-gallery open/close causes large layout shifts (sticky stages,
    // dynamic heights). Refresh ScrollTrigger so staggered galleries don't end
    // up stuck at opacity:0 after a jump.
    let raf1 = 0;
    let raf2 = 0;
    let timeoutId = 0;

    const repairVisibleGalleryCards = () => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();

      const threshold = window.innerHeight * 0.93;
      const nodes = Array.from(
        document.querySelectorAll(
          '#home-featured .home-gallery-card, #home-selected .home-gallery-card'
        )
      ).filter((node) => node instanceof HTMLElement);

      const stuckVisible = nodes.filter((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= threshold) return false;
        const opacity = Number.parseFloat(window.getComputedStyle(node).opacity ?? '1');
        return Number.isFinite(opacity) && opacity < 0.12;
      });

      if (!stuckVisible.length) return;

      gsap.killTweensOf(stuckVisible);
      gsap.to(stuckVisible, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.out',
        overwrite: true,
        clearProps: 'opacity,transform',
      });
    };

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(repairVisibleGalleryCards);
    });
    timeoutId = window.setTimeout(repairVisibleGalleryCards, 220);

    return () => {
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [expandedGalleryImageKey, isDesktopGallery]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const node = stackRef.current;
    if (!node) return undefined;
    if (typeof ResizeObserver === 'undefined') return undefined;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry?.contentRect?.width;
      if (typeof width === 'number' && Number.isFinite(width) && width > 0) {
        setStackWidth(width);
      }
    });

    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const clampNumber = (min, value, max) => Math.min(max, Math.max(min, value));

  const stackOffsetX = useMemo(() => {
    const width = stackWidth ?? (isMobileStack ? 360 : 900);
    const ratio = isMobileStack ? 0.07 : 0.07;
    const min = isMobileStack ? 10 : 16;
    const max = isMobileStack ? STACK_OFFSET_MOBILE_X : STACK_OFFSET_DESKTOP_X;
    return Math.round(clampNumber(min, width * ratio, max));
  }, [stackWidth, isMobileStack]);

  const stackOffsetY = useMemo(() => {
    const width = stackWidth ?? (isMobileStack ? 360 : 900);
    const ratio = isMobileStack ? 0.045 : 0.05;
    const min = isMobileStack ? 7 : 10;
    const max = isMobileStack ? STACK_OFFSET_MOBILE_Y : STACK_OFFSET_DESKTOP_Y;
    return Math.round(clampNumber(min, width * ratio, max));
  }, [stackWidth, isMobileStack]);

  const stackWrapperTranslateX = useMemo(() => {
    if (isMobileStack) return 0;
    return Math.round(36 + stackOffsetX * 1.75);
  }, [isMobileStack, stackOffsetX]);

  const heroScale = useMemo(() => {
    if (isMobileStack) return 1;
    const w = typeof viewportWidth === 'number' ? viewportWidth : 1440;
    if (w >= 1440) return 1;
    const pad = Math.min(128, Math.max(48, 0.1563 * w - 72));
    const available = w - 2 * pad;
    return Math.max(0.55, available / 1184);
  }, [isMobileStack, viewportWidth]);

  const heroLayoutRef = useRef(null);
  const [heroNaturalHeight, setHeroNaturalHeight] = useState(0);

  useEffect(() => {
    if (isMobileStack) return undefined;
    const el = heroLayoutRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      setHeroNaturalHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobileStack]);

  const heroLayoutStyle = useMemo(() => {
    if (isMobileStack) return undefined;
    if (heroScale >= 1) {
      return { width: 1184, marginLeft: 'auto', marginRight: 'auto' };
    }
    const w = typeof viewportWidth === 'number' ? viewportWidth : 1440;
    const pad = Math.min(128, Math.max(48, 0.1563 * w - 72));
    const containerW = w - 2 * pad;
    const tx = Math.round((containerW - 1184) / 2);
    return {
      width: 1184,
      transform: `translateX(${tx}px) scale(${heroScale})`,
      transformOrigin: 'top center',
    };
  }, [isMobileStack, heroScale, viewportWidth]);

  const container = useRef(null);
  const heroReachOutButtonRef = useRef(null);
  const bookingRevealRef = useRef(null);
  const reviewsBackdropRef = useRef(null);
  const reviewsSectionRef = useRef(null);
  const reviewsContentRef = useRef(null);
  const [featuredRef, renderFeatured] = useSectionMount();
  const [selectedRef, renderSelected] = useSectionMount();

  const wedding2GridRef = useStaggerReveal(renderFeatured);
  const wedding1GridRef = useStaggerReveal(renderFeatured);
  const wedding3GridRef = useStaggerReveal(renderFeatured);
  const assortedGridRef = useStaggerReveal(renderSelected);

  const wedding2HeaderRef = useReveal(renderFeatured);
  const wedding1HeaderRef = useReveal(renderFeatured);
  const wedding3HeaderRef = useReveal(renderFeatured);
  const selectedDividerRef = useReveal(renderSelected);

  const heroImages = useMemo(
    () => HERO_IMAGE_IDS.map((publicId) => buildOptimizedImage(publicId, 2000)),
    []
  );

  const wedding2Images = useMemo(() => {
    if (!renderFeatured && !hasExpandedGalleryImage) return [];
    return WEDDING_2_IMAGE_IDS.map((publicId, index) => ({
      id: `${publicId}-mh`,
      galleryKey: 'wedding-2',
      altLabel: 'Makayla and Hunter',
      altText:
        WEDDING_2_IMAGE_ALTS[index] ?? 'Makayla and Hunter wedding portfolio image',
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured, hasExpandedGalleryImage, isMobileLandscape]);

  const wedding1Images = useMemo(() => {
    if (!renderFeatured && !hasExpandedGalleryImage) return [];
    return WEDDING_1_IMAGE_IDS.map((publicId, index) => ({
      id: publicId,
      galleryKey: 'wedding-1',
      altLabel: 'Molly and Brandon',
      altText:
        WEDDING_1_IMAGE_ALTS[index] ?? 'Molly and Brandon wedding portfolio image',
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured, hasExpandedGalleryImage, isMobileLandscape]);

  const wedding3Images = useMemo(() => {
    if (!renderFeatured && !hasExpandedGalleryImage) return [];
    return WEDDING_3_IMAGE_IDS.map((publicId, index) => ({
      id: publicId,
      galleryKey: 'wedding-3',
      altLabel: 'Neeshay and James',
      altText:
        WEDDING_3_IMAGE_ALTS[index] ?? 'Neeshay and James wedding portfolio image',
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured, hasExpandedGalleryImage, isMobileLandscape]);

  const assortedImages = useMemo(() => {
    if (!renderSelected && !hasExpandedGalleryImage) return [];
    return ASSORTED_IMAGE_IDS.map((publicId, i) => ({
      id: `as-${i + 1}`,
      galleryKey: 'selected',
      altLabel: 'Selected Work',
      altText:
        ASSORTED_IMAGE_ALTS[i] ?? 'Selected portfolio image by Starling Photography',
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderSelected, hasExpandedGalleryImage, isMobileLandscape]);
  const expandedGalleryCatalogImages = useMemo(() => {
    const className = isMobileLandscape
      ? 'md:col-span-3 lg:col-span-3'
      : 'md:col-span-6 lg:col-span-3';

    return [
      ...ASSORTED_IMAGE_IDS.map((publicId, index) => ({
        id: `as-${index + 1}`,
        galleryKey: 'selected',
        altLabel: 'Selected Work',
        altText:
          ASSORTED_IMAGE_ALTS[index] ?? 'Selected portfolio image by Starling Photography',
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: 'aspect-[4/3]',
        className,
      })),
      ...WEDDING_2_IMAGE_IDS.map((publicId, index) => ({
        id: `${publicId}-mh`,
        galleryKey: 'wedding-2',
        altLabel: 'Makayla and Hunter',
        altText:
          WEDDING_2_IMAGE_ALTS[index] ?? 'Makayla and Hunter wedding portfolio image',
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: 'aspect-[4/3]',
        className,
      })),
      ...WEDDING_1_IMAGE_IDS.map((publicId, index) => ({
        id: publicId,
        galleryKey: 'wedding-1',
        altLabel: 'Molly and Brandon',
        altText:
          WEDDING_1_IMAGE_ALTS[index] ?? 'Molly and Brandon wedding portfolio image',
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: 'aspect-[4/3]',
        className,
      })),
      ...WEDDING_3_IMAGE_IDS.map((publicId, index) => ({
        id: publicId,
        galleryKey: 'wedding-3',
        altLabel: 'Neeshay and James',
        altText:
          WEDDING_3_IMAGE_ALTS[index] ?? 'Neeshay and James wedding portfolio image',
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: 'aspect-[4/3]',
        className,
      })),
    ];
  }, [isMobileLandscape]);

  const allLandingGalleryImages = useMemo(
    () => [
      ...assortedImages,
      ...wedding2Images,
      ...wedding1Images,
      ...wedding3Images,
    ],
    [assortedImages, wedding2Images, wedding1Images, wedding3Images]
  );

  const expandedLandingFlowImages = useMemo(() => {
    if (!hasExpandedGalleryImage) return [];

    return expandedGalleryCatalogImages.filter((img) => !(
      expandedGalleryImage?.galleryKey === img.galleryKey &&
      expandedGalleryImage?.imageId === img.id
    ));
  }, [expandedGalleryCatalogImages, expandedGalleryImage, hasExpandedGalleryImage]);
  const expandedLandingSelectedImage = useMemo(() => {
    if (!hasExpandedGalleryImage) return null;

    return expandedGalleryCatalogImages.find((img) => (
      expandedGalleryImage?.galleryKey === img.galleryKey &&
      expandedGalleryImage?.imageId === img.id
    )) ?? null;
  }, [expandedGalleryCatalogImages, expandedGalleryImage, hasExpandedGalleryImage]);
  const expandedLandingPerimeterImages = useMemo(() => {
    if (!expandedLandingSelectedImage) return expandedLandingFlowImages;

    const selectedIndex = expandedGalleryCatalogImages.findIndex((img) => (
      img.galleryKey === expandedLandingSelectedImage.galleryKey &&
      img.id === expandedLandingSelectedImage.id
    ));
    if (selectedIndex < 0) return expandedLandingFlowImages;

    return [
      ...expandedGalleryCatalogImages.slice(selectedIndex + 1),
      ...expandedGalleryCatalogImages.slice(0, selectedIndex),
    ];
  }, [
    expandedGalleryCatalogImages,
    expandedLandingFlowImages,
    expandedLandingSelectedImage,
  ]);

  const expandedLandingGridRowCount = useMemo(
    () => buildExpandedGalleryDesktopRows(expandedLandingFlowImages).length,
    [expandedLandingFlowImages]
  );

  const expandedGalleryMaxPinnedRowOffset = useMemo(
    () => Math.max(
      0,
      expandedLandingGridRowCount -
        (
          EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START +
          EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN -
          1
        )
    ),
    [expandedLandingGridRowCount]
  );

  const expandedGalleryStickyTop = useMemo(() => {
    if (!isDesktopGallery) return 112;
    return Math.round(clampNumber(112, viewportHeight * 0.14, 168));
  }, [
    isDesktopGallery,
    viewportHeight,
  ]);
  const useExpandedLandingPerimeter = hasExpandedGalleryImage && isDesktopGallery;
  const expandedGalleryPerimeterMaxProgress = useMemo(
    () => {
      const total = expandedLandingPerimeterImages.length;
      if (total < 3) return 0;

      const leftCount = Math.ceil(total / 3);
      const centerCount = Math.floor((total + 1) / 3);
      const rightCount = Math.floor(total / 3);

      const sideSlots = EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT;
      const centerSlots = EXPANDED_GALLERY_PERIMETER_CENTER_TRACK_SLOT_COUNT;

      return Math.max(
        0,
        Math.min(
          leftCount - sideSlots,
          centerCount - centerSlots,
          rightCount - sideSlots
        )
      );
    },
    [expandedLandingPerimeterImages.length]
  );
  const expandedGalleryPerimeterStepDistance = useMemo(
    () => Math.round(clampNumber(112, viewportHeight * 0.15, 172)),
    [viewportHeight]
  );
  const expandedGalleryPerimeterStageHeight = useMemo(
    () => Math.round(
      clampNumber(900, viewportHeight * 0.86, 1040)
    ),
    [viewportHeight]
  );
  const expandedGalleryPerimeterVerticalShift = useMemo(() => {
    if (!isDesktopGallery) return 0;

    return Math.max(
      0,
      Math.round(
        expandedGalleryStickyTop +
        (expandedGalleryPerimeterStageHeight / 2) -
        (viewportHeight / 2)
      )
    );
  }, [
    expandedGalleryPerimeterStageHeight,
    expandedGalleryStickyTop,
    isDesktopGallery,
    viewportHeight,
  ]);
  const expandedGalleryPerimeterTravel = useMemo(
    () => Math.max(
      expandedGalleryPerimeterStepDistance,
      expandedGalleryPerimeterMaxProgress * expandedGalleryPerimeterStepDistance
    ),
    [
      expandedGalleryPerimeterMaxProgress,
      expandedGalleryPerimeterStepDistance,
    ]
  );
  const expandedGalleryPerimeterOuterHeight = useMemo(
    () => (
      expandedGalleryPerimeterStageHeight +
      expandedGalleryStickyTop +
      expandedGalleryPerimeterTravel +
      64
    ),
    [
      expandedGalleryPerimeterStageHeight,
      expandedGalleryStickyTop,
      expandedGalleryPerimeterTravel,
    ]
  );
  const expandedGalleryPerimeterCards = useMemo(
    () => {
      const sideSlots = EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT;
      const centerSlots = EXPANDED_GALLERY_PERIMETER_CENTER_TRACK_SLOT_COUNT;
      const mapTrack = (images, track, slotCount, offset = 0, keySuffix = '') =>
        images
          .map((img, index) => {
            const position = index - expandedGalleryPerimeterProgress + offset;
            if (position <= -1 || position >= slotCount) return null;
            return {
              img,
              cardKey: `${img.galleryKey}:${img.id}${keySuffix}`,
              position,
              pose: resolveTrackPose(track, position),
            };
          })
          .filter(Boolean);

      const leftImages = [];
      const centerImages = [];
      const rightImages = [];
      expandedLandingPerimeterImages.forEach((img, i) => {
        const track = i % 3;
        if (track === 0) leftImages.push(img);
        else if (track === 1) centerImages.push(img);
        else rightImages.push(img);
      });

      const bottomCenterOffset = -(sideSlots - 1);

      return [
        ...mapTrack(leftImages, EXPANDED_GALLERY_PERIMETER_LEFT_TRACK, sideSlots),
        ...mapTrack(centerImages, EXPANDED_GALLERY_PERIMETER_CENTER_TRACK, centerSlots),
        ...mapTrack(centerImages, EXPANDED_GALLERY_PERIMETER_BOTTOM_CENTER_TRACK, centerSlots, bottomCenterOffset, ':btm'),
        ...mapTrack(rightImages, EXPANDED_GALLERY_PERIMETER_RIGHT_TRACK, sideSlots),
      ];
    },
    [
      expandedGalleryPerimeterProgress,
      expandedLandingPerimeterImages,
    ]
  );

  useEffect(() => {
    visibleSetRef.current = visibleSet;
  }, [visibleSet]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (!isMobileStack) {
      const resetId = window.requestAnimationFrame(() => {
        setShowStickyReachOut(false);
      });
      return () => window.cancelAnimationFrame(resetId);
    }

    let rafId = 0;
    const update = () => {
      const btn = heroReachOutButtonRef.current;
      if (!btn) {
        setShowStickyReachOut(false);
        return;
      }

      const rect = btn.getBoundingClientRect();
      setShowStickyReachOut(rect.bottom <= 0);
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isMobileStack]);

  const advanceStack = useCallback(() => {
    setDepartingIdx(visibleSetRef.current[0]);
    setVisibleSet(prev => [prev[1], prev[2], (prev[2] + 1) % heroImages.length]);
    setHasInitialized(true);
  }, [heroImages.length]);

  useEffect(() => {
    stackIntervalRef.current = setInterval(advanceStack, 12000);
    return () => clearInterval(stackIntervalRef.current);
  }, [advanceStack]);

  useEffect(() => {
    if (departingIdx === null) return;
    const t = setTimeout(() => setDepartingIdx(null), 1800);
    return () => clearTimeout(t);
  }, [departingIdx]);

  useEffect(() => {
    const nextIdx = (visibleSet[2] + 1) % heroImages.length;
    const preload = () => {
      const preloadImage = new Image();
      preloadImage.decoding = 'async';
      preloadImage.src = heroImages[nextIdx].toURL();
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(preload, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(preload, 600);
    return () => window.clearTimeout(timeoutId);
  }, [visibleSet, heroImages]);

  const captureGalleryCardRects = useCallback(() => {
    if (typeof document === 'undefined') return;

    const nextRects = new Map();
    document.querySelectorAll('[data-gallery-flow-card-key]').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;

      const cardKey = node.dataset.galleryFlowCardKey;
      if (!cardKey) return;

      const rect = node.getBoundingClientRect();
      nextRects.set(cardKey, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    });

    expandedGalleryRectsRef.current = nextRects;
  }, []);

  const removeOpeningClone = useCallback(() => {
    const clone = expandedGalleryOpeningCloneRef.current;
    if (!(clone instanceof HTMLElement)) return;

    gsap.killTweensOf(clone);
    clone.remove();
    expandedGalleryOpeningCloneRef.current = null;
  }, []);

  const createOpeningCloneLayer = useCallback(() => {
    if (typeof document === 'undefined') return null;

    const layer = document.createElement('div');
    layer.style.position = 'fixed';
    layer.style.inset = '0';
    layer.style.pointerEvents = 'none';
    layer.style.zIndex = '45';
    layer.style.overflow = 'hidden';
    layer.style.willChange = 'opacity';

    [selectedRef.current, featuredRef.current]
      .filter((node) => node instanceof HTMLElement)
      .forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

        const clone = node.cloneNode(true);
        if (!(clone instanceof HTMLElement)) return;

        clone.style.position = 'absolute';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.margin = '0';
        clone.style.pointerEvents = 'none';
        clone.style.transform = 'none';

        layer.appendChild(clone);
      });

    if (!layer.childElementCount) return null;

    document.body.appendChild(layer);
    return layer;
  }, [featuredRef, selectedRef]);

  const closeExpandedGalleryImage = useCallback(() => {
    if (!expandedGalleryImageKey || expandedGalleryIsClosingRef.current) return;

    const finishClose = () => {
      expandedGalleryIsClosingRef.current = false;
      expandedGallerySourceRectRef.current = null;
      expandedGalleryPremiumOpenKeyRef.current = null;
      removeOpeningClone();
      setExpandedGalleryPerimeterProgress(0);
      setExpandedGalleryPinnedRowOffset(0);
      setExpandedGalleryImage(null);
    };

    const removeClosingClone = () => {
      const clone = expandedGalleryClosingCloneRef.current;
      if (!(clone instanceof HTMLElement)) return;

      gsap.killTweensOf(clone);
      clone.remove();
      expandedGalleryClosingCloneRef.current = null;
    };

    if (
      !isDesktopGallery ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ) {
      removeClosingClone();
      expandedGallerySoftCloseRef.current = false;
      captureGalleryCardRects();
      finishClose();
      return;
    }

    const stageNode = expandedGalleryStageRef.current;
    const stageContentNode =
      stageNode?.querySelector?.('[data-gallery-stage-content="true"]') ?? stageNode;
    const pinnedNode = expandedGalleryFixedCardRef.current;
    const pinnedInner =
      pinnedNode?.querySelector?.('[data-gallery-card-inner="true"]') ?? pinnedNode;

    if (!(stageContentNode instanceof HTMLElement)) {
      removeClosingClone();
      expandedGallerySoftCloseRef.current = false;
      finishClose();
      return;
    }

    const stageRect = stageContentNode.getBoundingClientRect();
    const closingClone = stageContentNode.cloneNode(true);
    if (!(closingClone instanceof HTMLElement)) {
      removeClosingClone();
      expandedGallerySoftCloseRef.current = false;
      finishClose();
      return;
    }

    removeClosingClone();
    removeOpeningClone();
    closingClone.style.position = 'fixed';
    closingClone.style.left = `${stageRect.left}px`;
    closingClone.style.top = `${stageRect.top}px`;
    closingClone.style.width = `${stageRect.width}px`;
    closingClone.style.height = `${stageRect.height}px`;
    closingClone.style.margin = '0';
    closingClone.style.pointerEvents = 'none';
    closingClone.style.zIndex = '45';
    closingClone.style.willChange = 'opacity,transform';
    document.body.appendChild(closingClone);
    expandedGalleryClosingCloneRef.current = closingClone;

    expandedGallerySoftCloseRef.current = true;
    expandedGalleryIsClosingRef.current = true;

    captureGalleryCardRects();
    expandedGallerySourceRectRef.current = null;
    expandedGalleryPremiumOpenKeyRef.current = null;
    setExpandedGalleryPerimeterProgress(0);
    setExpandedGalleryPinnedRowOffset(0);
    setExpandedGalleryImage(null);

    gsap.killTweensOf(stageContentNode);
    if (pinnedInner instanceof HTMLElement) {
      gsap.killTweensOf(pinnedInner);
    }

    gsap.to(closingClone, {
      opacity: 0,
      scale: 0.992,
      y: 8,
      duration: EXPANDED_GALLERY_SOFT_CLOSE_DURATION,
      ease: 'power2.out',
      overwrite: 'auto',
      onComplete: () => {
        removeClosingClone();
        expandedGalleryIsClosingRef.current = false;
      },
    });
  }, [
    captureGalleryCardRects,
    expandedGalleryImageKey,
    isDesktopGallery,
    removeOpeningClone,
  ]);

  const closeMobileLightbox = useCallback(() => {
    mobileLightboxTouchStartRef.current = null;
    setMobileLightbox(null);
  }, []);

  const navigateMobileLightbox = useCallback((direction) => {
    setMobileLightbox((prev) => {
      if (!prev || prev.images.length < 2) return prev;

      const nextIndex =
        (prev.index + direction + prev.images.length) % prev.images.length;
      return { ...prev, index: nextIndex };
    });
  }, []);

  const openMobileLightbox = useCallback((images, index, e) => {
    if (!Array.isArray(images) || !images.length) return;

    const outer = e.currentTarget;
    const inner =
      outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;

    outer.style.zIndex = '';
    gsap.killTweensOf(inner);
    gsap.set(inner, { scale: 1 });

    mobileLightboxTouchStartRef.current = null;
    setMobileLightbox({
      images,
      index: clampValue(0, index, images.length - 1),
    });
  }, []);

  const handleGalleryImageClick = useCallback((galleryKey, imageId, e) => {
    if (expandedGalleryIsClosingRef.current) return;

    const nextImageKey = `${galleryKey}:${imageId}`;
    if (expandedGalleryImageKey === nextImageKey) {
      closeExpandedGalleryImage();
      return;
    }

    const outer = e.currentTarget;
    const inner = outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;
    const rect = inner?.getBoundingClientRect?.();

    outer.style.zIndex = '';
    gsap.killTweensOf(inner);
    gsap.set(inner, { scale: 1 });

    if (rect?.width && rect?.height) {
      expandedGallerySourceRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    } else {
      expandedGallerySourceRectRef.current = null;
    }

    removeOpeningClone();
    const shouldUsePremiumOpen =
      !hasExpandedGalleryImage &&
      isDesktopGallery &&
      !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const openingClone = shouldUsePremiumOpen
      ? createOpeningCloneLayer()
      : null;

    expandedGalleryPremiumOpenKeyRef.current =
      openingClone instanceof HTMLElement ? nextImageKey : null;

    if (openingClone instanceof HTMLElement) {
      expandedGalleryOpeningCloneRef.current = openingClone;
    }

    captureGalleryCardRects();
    setExpandedGalleryPerimeterProgress(0);
    setExpandedGalleryPinnedRowOffset(0);
    expandedGallerySoftCloseRef.current = false;
    expandedGalleryIsClosingRef.current = false;
    setExpandedGalleryImage({ galleryKey, imageId });
  }, [
    captureGalleryCardRects,
    closeExpandedGalleryImage,
    createOpeningCloneLayer,
    expandedGalleryImageKey,
    hasExpandedGalleryImage,
    isDesktopGallery,
    removeOpeningClone,
  ]);

  const handleGalleryCardActivate = useCallback((
    images,
    galleryKey,
    imageId,
    index,
    e
  ) => {
    if (isDesktopGallery) {
      handleGalleryImageClick(galleryKey, imageId, e);
      return;
    }

    openMobileLightbox(images, index, e);
  }, [handleGalleryImageClick, isDesktopGallery, openMobileLightbox]);

  const handleMobileLightboxTouchStart = useCallback((e) => {
    if (!mobileLightbox || mobileLightbox.images.length < 2) return;

    const touch = e.touches[0];
    if (!touch) return;

    mobileLightboxTouchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }, [mobileLightbox]);

  const handleMobileLightboxTouchEnd = useCallback((e) => {
    if (!mobileLightbox || mobileLightbox.images.length < 2) return;

    const start = mobileLightboxTouchStartRef.current;
    mobileLightboxTouchStartRef.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaY) > Math.abs(deltaX)) return;

    navigateMobileLightbox(deltaX < 0 ? 1 : -1);
  }, [mobileLightbox, navigateMobileLightbox]);

  const handleCardEnter = useCallback((e) => {
    const outer = e.currentTarget;
    const inner =
      outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;

    if (outer.dataset.galleryFeatured === 'true') return;

    outer.style.zIndex = '10';
    gsap.to(inner, {
      scale: 1.025,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  const handleCardLeave = useCallback((e) => {
    const outer = e.currentTarget;
    const inner =
      outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;

    if (outer.dataset.galleryFeatured === 'true') {
      gsap.killTweensOf(inner);
      gsap.set(inner, { scale: 1 });
      outer.style.zIndex = '';
      return;
    }

    gsap.to(inner, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        outer.style.zIndex = '';
      },
    });
  }, []);

  useEffect(() => {
    if (!expandedGalleryImageKey) {
      expandedGalleryWasOpenRef.current = false;
      return undefined;
    }

    let outerRaf = 0;
    let innerRaf = 0;
    const wasOpen = expandedGalleryWasOpenRef.current;
    expandedGalleryWasOpenRef.current = true;

    const scrollExpandedTargetIntoView = () => {
      const expandedCard =
        expandedGalleryFixedCardRef.current ??
        document.querySelector(
          `[data-gallery-card-key="${expandedGalleryImageKey}"]`
        );

      if (isDesktopGallery && expandedCard instanceof HTMLElement) {
        const rect = expandedCard.getBoundingClientRect();
        const centeredTop = (window.innerHeight - rect.height) / 2;
        const nextScrollTop = Math.max(
          0,
          window.scrollY + rect.top - centeredTop
        );

        if (Math.abs(nextScrollTop - window.scrollY) > 1) {
          window.scrollTo({
            top: nextScrollTop,
            behavior: wasOpen ? 'smooth' : 'auto',
          });
        }
        return;
      }

      if (isDesktopGallery) {
        const stageNode = expandedGalleryStageRef.current;
        const stageContentNode =
          stageNode?.querySelector?.('[data-gallery-stage-content="true"]') ?? stageNode;

        if (stageContentNode instanceof HTMLElement) {
          const rect = stageContentNode.getBoundingClientRect();
          const nextScrollTop = Math.max(
            0,
            window.scrollY +
              rect.top -
              expandedGalleryStickyTop
          );

          window.scrollTo({
            top: nextScrollTop,
            behavior: wasOpen ? 'smooth' : 'auto',
          });
          return;
        }
      }

      expandedCard?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    };

    outerRaf = window.requestAnimationFrame(() => {
      innerRaf = window.requestAnimationFrame(scrollExpandedTargetIntoView);
    });

    return () => {
      if (outerRaf) window.cancelAnimationFrame(outerRaf);
      if (innerRaf) window.cancelAnimationFrame(innerRaf);
    };
  }, [expandedGalleryImageKey, expandedGalleryStickyTop, isDesktopGallery, selectedRef]);

  useEffect(() => {
    if (!expandedGalleryImageKey) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeExpandedGalleryImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeExpandedGalleryImage, expandedGalleryImageKey]);

  useEffect(() => {
    if (isDesktopGallery || !expandedGalleryImageKey) return undefined;

    const id = requestAnimationFrame(() => closeExpandedGalleryImage());
    return () => cancelAnimationFrame(id);
  }, [closeExpandedGalleryImage, expandedGalleryImageKey, isDesktopGallery]);

  useEffect(() => {
    if (!isDesktopGallery || !mobileLightbox) return undefined;

    const id = requestAnimationFrame(() => closeMobileLightbox());
    return () => cancelAnimationFrame(id);
  }, [closeMobileLightbox, isDesktopGallery, mobileLightbox]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const docEl = document.documentElement;

    if (mobileLightbox) {
      docEl.setAttribute('data-lightbox-open', '');
    } else {
      docEl.removeAttribute('data-lightbox-open');
    }

    return () => {
      docEl.removeAttribute('data-lightbox-open');
    };
  }, [mobileLightbox]);

  useEffect(() => {
    if (!mobileLightbox) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMobileLightbox();
        return;
      }

      if (mobileLightbox.images.length < 2) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateMobileLightbox(1);
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateMobileLightbox(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMobileLightbox, mobileLightbox, navigateMobileLightbox]);

  useEffect(() => {
    if (!mobileLightbox) return undefined;

    const docEl = document.documentElement;
    const body = document.body;
    const savedScrollY = window.scrollY;
    const scrollBarGap = window.innerWidth - docEl.clientWidth;

    const prevDocOverflow = docEl.style.overflow;
    const prevDocOverscrollBehavior = docEl.style.overscrollBehavior;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const prevBodyPaddingRight = body.style.paddingRight;
    const prevBodyOverscrollBehavior = body.style.overscrollBehavior;

    docEl.style.overflow = 'hidden';
    docEl.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.width = '100%';
    body.style.overscrollBehavior = 'none';
    if (scrollBarGap > 0) {
      body.style.paddingRight = `${scrollBarGap}px`;
    }

    return () => {
      docEl.style.overflow = prevDocOverflow;
      docEl.style.overscrollBehavior = prevDocOverscrollBehavior;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      body.style.paddingRight = prevBodyPaddingRight;
      body.style.overscrollBehavior = prevBodyOverscrollBehavior;
      window.scrollTo(0, savedScrollY);
    };
  }, [mobileLightbox]);

  useEffect(() => {
    if (!expandedGalleryImageKey || !isDesktopGallery) return undefined;

    const node = expandedGalleryFixedCardRef.current;
    if (!node) return undefined;

    const updatePinSize = () => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      setExpandedGalleryPinSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updatePinSize();

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => updatePinSize());

    resizeObserver?.observe(node);
    window.addEventListener('resize', updatePinSize, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updatePinSize);
    };
  }, [expandedGalleryImageKey, isDesktopGallery]);

  useEffect(() => {
    if (!expandedGalleryImageKey || !isDesktopGallery) {
      expandedGalleryWasVisibleRef.current = false;
      return undefined;
    }

    let rafId = 0;
    let lastScrollY = window.scrollY;
    let hasReachedTopAnchor = false;
    let isClosingStage = false;
    const checkStageVisibility = () => {
      rafId = 0;
      if (isClosingStage) return;

      const node = expandedGalleryStageRef.current ?? selectedRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const scrollCloseDistance = clampNumber(
        96,
        window.innerHeight * 0.18,
        180
      );
      const topOverscroll = rect.top - expandedGalleryStickyTop;

      lastScrollY = currentScrollY;

      if (rect.top <= expandedGalleryStickyTop + 2) {
        hasReachedTopAnchor = true;
      }

      if (isVisible) {
        expandedGalleryWasVisibleRef.current = true;

        if (
          hasReachedTopAnchor &&
          isScrollingUp &&
          topOverscroll >= scrollCloseDistance
        ) {
          isClosingStage = true;
          closeExpandedGalleryImage();
        }

        if (
          isScrollingDown &&
          rect.bottom <= window.innerHeight + 2
        ) {
          isClosingStage = true;
          closeExpandedGalleryImage();
        }

        return;
      }

      if (!expandedGalleryWasVisibleRef.current) return;

      isClosingStage = true;
      closeExpandedGalleryImage();
    };

    const queueCheck = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(checkStageVisibility);
    };

    window.addEventListener('scroll', queueCheck, { passive: true });
    window.addEventListener('resize', queueCheck, { passive: true });
    queueCheck();

    return () => {
      window.removeEventListener('scroll', queueCheck);
      window.removeEventListener('resize', queueCheck);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    closeExpandedGalleryImage,
    expandedGalleryImageKey,
    expandedGalleryStickyTop,
    isDesktopGallery,
    selectedRef,
  ]);

  useEffect(() => {
    if (!expandedGalleryImageKey || !isDesktopGallery || !useExpandedLandingPerimeter) {
      return undefined;
    }
    if (!expandedGalleryPerimeterMaxProgress) {
      return undefined;
    }

    const stageNode = expandedGalleryStageRef.current;
    if (!stageNode) return undefined;

    const snap = expandedGalleryPerimeterSnapRef.current;
    let scrollRafId = 0;
    let settleTimeoutId = 0;
    let initialTrackingTimeoutId = 0;
    let trackingStarted = false;
    let hasBaselineTravel = false;
    let baselineTravel = 0;
    const LERP_SPEED = 0.18;
    const SNAP_SETTLE_DELAY = 140;

    const tick = () => {
      const diff = snap.target - snap.current;

      if (Math.abs(diff) < 0.003) {
        snap.current = snap.target;
        snap.animId = 0;
        setExpandedGalleryPerimeterProgress((prev) =>
          Math.abs(prev - snap.current) < 0.001 ? prev : snap.current
        );
        return;
      }

      snap.current += diff * LERP_SPEED;
      setExpandedGalleryPerimeterProgress((prev) =>
        Math.abs(prev - snap.current) < 0.001 ? prev : snap.current
      );
      snap.animId = window.requestAnimationFrame(tick);
    };

    const ensureAnimating = () => {
      if (!snap.animId) {
        snap.animId = window.requestAnimationFrame(tick);
      }
    };

    const setImmediateProgress = (nextProgress) => {
      if (snap.animId) {
        window.cancelAnimationFrame(snap.animId);
        snap.animId = 0;
      }
      snap.current = nextProgress;
      snap.target = nextProgress;
      setExpandedGalleryPerimeterProgress((prev) =>
        Math.abs(prev - nextProgress) < 0.001 ? prev : nextProgress
      );
    };

    const queueSnapToNearest = (rawProgress) => {
      if (settleTimeoutId) window.clearTimeout(settleTimeoutId);
      settleTimeoutId = window.setTimeout(() => {
        const snapped = clampNumber(
          0,
          Math.round(rawProgress),
          expandedGalleryPerimeterMaxProgress
        );
        if (Math.abs(snapped - snap.current) < 0.001) {
          snap.current = snapped;
          snap.target = snapped;
          setExpandedGalleryPerimeterProgress((prev) =>
            Math.abs(prev - snapped) < 0.001 ? prev : snapped
          );
          return;
        }
        snap.target = snapped;
        ensureAnimating();
      }, SNAP_SETTLE_DELAY);
    };

    const resolveTravelDistance = () => {
      const rect = stageNode.getBoundingClientRect();
      const progressStartTop =
        expandedGalleryStickyTop - expandedGalleryPerimeterVerticalShift;
      return clampNumber(
        0,
        progressStartTop - rect.top,
        expandedGalleryPerimeterTravel
      );
    };

    const updatePerimeterProgress = () => {
      scrollRafId = 0;

      const traveled = resolveTravelDistance();
      if (!hasBaselineTravel) {
        baselineTravel = traveled;
        hasBaselineTravel = true;
      }
      const remainingTravel = Math.max(
        expandedGalleryPerimeterTravel - baselineTravel,
        1
      );
      const adjustedTravel = clampNumber(
        0,
        traveled - baselineTravel,
        remainingTravel
      );
      const rawProgress =
        (adjustedTravel / remainingTravel) *
        expandedGalleryPerimeterMaxProgress;

      const clampedProgress = clampNumber(
        0,
        rawProgress,
        expandedGalleryPerimeterMaxProgress
      );

      setImmediateProgress(clampedProgress);
      queueSnapToNearest(clampedProgress);
    };

    const queueUpdate = () => {
      if (scrollRafId) return;
      scrollRafId = window.requestAnimationFrame(updatePerimeterProgress);
    };

    const startTracking = () => {
      if (trackingStarted) return;
      trackingStarted = true;
      baselineTravel = resolveTravelDistance();
      hasBaselineTravel = true;
      window.addEventListener('scroll', queueUpdate, { passive: true });
      window.addEventListener('resize', queueUpdate, { passive: true });
    };

    // Hold the perimeter at its entry state long enough for the open animation to
    // land before scroll progress starts swapping in later track positions.
    initialTrackingTimeoutId = window.setTimeout(
      startTracking,
      EXPANDED_GALLERY_PERIMETER_PROGRESS_INIT_DELAY_MS
    );

    return () => {
      if (trackingStarted) {
        window.removeEventListener('scroll', queueUpdate);
        window.removeEventListener('resize', queueUpdate);
      }
      if (initialTrackingTimeoutId) window.clearTimeout(initialTrackingTimeoutId);
      if (scrollRafId) window.cancelAnimationFrame(scrollRafId);
      if (settleTimeoutId) window.clearTimeout(settleTimeoutId);
      if (snap.animId) window.cancelAnimationFrame(snap.animId);
      snap.animId = 0;
    };
  }, [
    expandedGalleryImageKey,
    expandedGalleryPerimeterMaxProgress,
    expandedGalleryPerimeterTravel,
    expandedGalleryPerimeterVerticalShift,
    expandedGalleryStickyTop,
    isDesktopGallery,
    useExpandedLandingPerimeter,
  ]);

  useEffect(() => {
    if (
      useExpandedLandingPerimeter ||
      !expandedGalleryImageKey ||
      !isDesktopGallery ||
      !expandedGalleryMaxPinnedRowOffset
    ) {
      expandedGalleryRowMetricsRef.current = {
        basePinnedRowTopFromStage: 0,
        rowStep: 0,
      };
      return undefined;
    }

    const stageNode = expandedGalleryStageRef.current;
    const pinnedNode = expandedGalleryFixedCardRef.current;
    if (!stageNode || !pinnedNode) return undefined;

    let rafId = 0;
    const measureRowMetrics = () => {
      const flowRects = Array.from(
        stageNode.querySelectorAll('[data-gallery-flow-card-key]')
      )
        .filter((node) => node instanceof HTMLElement)
        .map((node) => node.getBoundingClientRect())
        .filter((rect) => rect.width && rect.height)
        .sort((a, b) => (
          Math.abs(a.top - b.top) < 1 ? a.left - b.left : a.top - b.top
        ));
      if (!flowRects.length) return null;

      const uniqueRowTops = [];
      flowRects.forEach((rect) => {
        const lastTop = uniqueRowTops[uniqueRowTops.length - 1];
        if (typeof lastTop === 'number' && Math.abs(rect.top - lastTop) <= 2) return;
        uniqueRowTops.push(rect.top);
      });

      const basePinnedRowTop =
        uniqueRowTops[EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START - 1];
      const rowDiffs = uniqueRowTops
        .slice(1)
        .map((top, index) => top - uniqueRowTops[index])
        .filter((diff) => diff > 1);
      const rowStep = rowDiffs.length
        ? rowDiffs.reduce((sum, diff) => sum + diff, 0) / rowDiffs.length
        : 0;
      if (typeof basePinnedRowTop !== 'number' || !rowStep) return null;

      const stageRect = stageNode.getBoundingClientRect();
      const nextMetrics = {
        basePinnedRowTopFromStage: basePinnedRowTop - stageRect.top,
        rowStep,
      };

      expandedGalleryRowMetricsRef.current = nextMetrics;
      return nextMetrics;
    };

    const updatePinnedRowOffset = () => {
      rafId = 0;

      const rowMetrics = expandedGalleryRowMetricsRef.current.rowStep > 0
        ? expandedGalleryRowMetricsRef.current
        : measureRowMetrics();
      if (!rowMetrics) return;

      const stageRect = stageNode.getBoundingClientRect();
      const basePinnedRowTop =
        stageRect.top + rowMetrics.basePinnedRowTopFromStage;
      const exposedPinnedSpace = Math.max(
        0,
        expandedGalleryStickyTop - basePinnedRowTop
      );
      const nextPinnedRowOffset = clampNumber(
        0,
        Math.floor((exposedPinnedSpace / rowMetrics.rowStep) + 0.001),
        expandedGalleryMaxPinnedRowOffset
      );

      setExpandedGalleryPinnedRowOffset((prev) => (
        prev === nextPinnedRowOffset ? prev : nextPinnedRowOffset
      ));
    };

    const queueUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updatePinnedRowOffset);
    };

    const handleResize = () => {
      measureRowMetrics();
      queueUpdate();
    };

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => handleResize());

    measureRowMetrics();
    resizeObserver?.observe(pinnedNode);
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    queueUpdate();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', handleResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    expandedGalleryImageKey,
    expandedGalleryMaxPinnedRowOffset,
    expandedGalleryStickyTop,
    isDesktopGallery,
    useExpandedLandingPerimeter,
  ]);

  useEffect(() => {
    if (
      useExpandedLandingPerimeter ||
      !expandedGalleryImageKey ||
      !isDesktopGallery ||
      !expandedGalleryPinnedRowOffset
    ) {
      return undefined;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return undefined;
    }

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      const stageNode = expandedGalleryStageRef.current;
      if (!stageNode) return;

      const flowCards = Array.from(
        stageNode.querySelectorAll('[data-gallery-flow-card-key]')
      )
        .filter((node) => node instanceof HTMLElement)
        .map((node) => ({
          node,
          rect: node.getBoundingClientRect(),
        }))
        .filter(({ rect }) => rect.width && rect.height)
        .sort((a, b) => (
          Math.abs(a.rect.top - b.rect.top) < 1
            ? a.rect.left - b.rect.left
            : a.rect.top - b.rect.top
        ));
      if (!flowCards.length) return;

      const uniqueRowTops = [];
      flowCards.forEach(({ rect }) => {
        const lastTop = uniqueRowTops[uniqueRowTops.length - 1];
        if (typeof lastTop === 'number' && Math.abs(rect.top - lastTop) <= 2) return;
        uniqueRowTops.push(rect.top);
      });

      const revealedRowIndex =
        EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START +
        expandedGalleryPinnedRowOffset -
        2;
      const revealedRowTop = uniqueRowTops[revealedRowIndex];
      if (typeof revealedRowTop !== 'number') return;

      const revealedRowNodes = flowCards
        .filter(({ rect }) => Math.abs(rect.top - revealedRowTop) <= 2)
        .map(({ node }) => node);
      if (!revealedRowNodes.length) return;

      const revealedRowKey = `${expandedGalleryImageKey}:${revealedRowIndex}`;
      if (expandedGalleryAnimatedRowsRef.current.has(revealedRowKey)) return;

      expandedGalleryAnimatedRowsRef.current.add(revealedRowKey);
      gsap.killTweensOf(revealedRowNodes);
      gsap.fromTo(
        revealedRowNodes,
        { opacity: 0.55 },
        {
          opacity: 1,
          duration: 0.24,
          stagger: 0.04,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'opacity',
        }
      );
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    expandedGalleryImageKey,
    expandedGalleryPinnedRowOffset,
    isDesktopGallery,
    useExpandedLandingPerimeter,
  ]);

  useEffect(() => {
    const previousRects = expandedGalleryRectsRef.current;
    if (!previousRects.size) return undefined;
    if (typeof window === 'undefined') return undefined;
    if (expandedGallerySoftCloseRef.current) {
      expandedGalleryRectsRef.current = new Map();
      return undefined;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      expandedGalleryRectsRef.current = new Map();
      return undefined;
    }

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      if (useExpandedLandingPerimeter) {
        const stageNode = expandedGalleryStageRef.current;
        if (!stageNode) {
          expandedGalleryRectsRef.current = new Map();
          return;
        }

        const pinnedRect = expandedGalleryFixedCardRef.current?.getBoundingClientRect?.();
        const pinnedCenterX = pinnedRect?.width
          ? pinnedRect.left + (pinnedRect.width / 2)
          : window.innerWidth / 2;
        const pinnedCenterY = pinnedRect?.height
          ? pinnedRect.top + (pinnedRect.height / 2)
          : window.innerHeight / 2;
        const perimeterCards = Array.from(
          stageNode.querySelectorAll('[data-gallery-flow-card-key]')
        )
          .filter((node) => node instanceof HTMLElement)
          .map((node) => {
            const rect = node.getBoundingClientRect();
            const inner =
              node.querySelector('[data-gallery-card-inner="true"]') ?? node;

            if (!(inner instanceof HTMLElement) || !rect.width || !rect.height) {
              return null;
            }

            const centerX = rect.left + (rect.width / 2);
            const centerY = rect.top + (rect.height / 2);
            return {
              rect,
              inner,
              cardKey: node.dataset.galleryFlowCardKey ?? '',
              edge: node.dataset.galleryEdge ?? 'bottom',
              distance: Math.hypot(centerX - pinnedCenterX, centerY - pinnedCenterY),
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.distance - b.distance);

        perimeterCards.forEach(({ rect, inner, cardKey, edge }, index) => {
          const prevRect = resolveCapturedGalleryRect(previousRects, cardKey);
          const delay = Math.min(
            index * EXPANDED_GALLERY_PERIMETER_FLOW_STAGGER,
            0.12
          );

          gsap.killTweensOf(inner);

          if (prevRect && isRectNearViewport(prevRect)) {
            const deltaX = prevRect.left - rect.left;
            const deltaY = prevRect.top - rect.top;
            const scaleX = prevRect.width / rect.width;
            const scaleY = prevRect.height / rect.height;

            gsap.fromTo(
              inner,
              {
                x: deltaX,
                y: deltaY,
                scaleX,
                scaleY,
                opacity: 0.92,
                transformOrigin: 'top left',
              },
              {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                duration: EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION,
                delay,
                ease: 'power3.out',
                overwrite: 'auto',
                clearProps: 'transform,opacity',
              }
            );
            return;
          }

          const fallbackOffset = getPerimeterEntryOffset(edge);
          gsap.fromTo(
            inner,
            {
              x: fallbackOffset.x,
              y: fallbackOffset.y,
              scale: 0.985,
              opacity: 0,
              transformOrigin: 'center center',
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              duration: EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION * 0.88,
              delay,
              ease: 'power2.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity',
            }
          );
        });

        expandedGalleryRectsRef.current = new Map();
        return;
      }

      document.querySelectorAll('[data-gallery-flow-card-key]').forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        const cardKey = node.dataset.galleryFlowCardKey;
        if (!cardKey) return;

        const nextRect = node.getBoundingClientRect();
        const prevRect = previousRects.get(cardKey);

        if (!prevRect) {
          gsap.fromTo(
            node,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: 'power2.out',
              clearProps: 'opacity,transform',
            }
          );
          return;
        }

        const deltaX = prevRect.left - nextRect.left;
        const deltaY = prevRect.top - nextRect.top;
        const scaleX = prevRect.width / nextRect.width;
        const scaleY = prevRect.height / nextRect.height;

        if (
          Math.abs(deltaX) < 0.5 &&
          Math.abs(deltaY) < 0.5 &&
          Math.abs(scaleX - 1) < 0.01 &&
          Math.abs(scaleY - 1) < 0.01
        ) {
          return;
        }

        gsap.fromTo(
          node,
          {
            x: deltaX,
            y: deltaY,
            scaleX,
            scaleY,
            transformOrigin: 'top left',
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.82,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );
      });

      expandedGalleryRectsRef.current = new Map();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [expandedGalleryImageKey, useExpandedLandingPerimeter]);

  useEffect(() => {
    if (expandedGalleryImageKey || !expandedGallerySoftCloseRef.current) {
      return undefined;
    }
    if (typeof window === 'undefined') {
      expandedGallerySoftCloseRef.current = false;
      return undefined;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      expandedGallerySoftCloseRef.current = false;
      return undefined;
    }

    const revealNodes = [selectedRef.current].filter(
      (node) => node instanceof HTMLElement
    );
    if (!revealNodes.length) {
      expandedGallerySoftCloseRef.current = false;
      return undefined;
    }

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      gsap.killTweensOf(revealNodes);
      gsap.fromTo(
        revealNodes,
        { opacity: 0 },
        {
          opacity: 1,
          duration: EXPANDED_GALLERY_SOFT_REVEAL_DURATION,
          stagger: 0,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'opacity',
        }
      );
      expandedGallerySoftCloseRef.current = false;
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [expandedGalleryImageKey, selectedRef]);

  useEffect(() => () => {
    const clone = expandedGalleryClosingCloneRef.current;
    if (!(clone instanceof HTMLElement)) return;

    gsap.killTweensOf(clone);
    clone.remove();
    expandedGalleryClosingCloneRef.current = null;
  }, []);

  useEffect(() => () => {
    removeOpeningClone();
  }, [removeOpeningClone]);

  useLayoutEffect(() => {
    if (!expandedGalleryImageKey) return undefined;

    const stageNode = expandedGalleryStageRef.current;
    if (!stageNode) return undefined;

    const motionNode =
      stageNode.querySelector('[data-gallery-stage-content="true"]') ?? stageNode;
    const openingClone = expandedGalleryOpeningCloneRef.current;
    const shouldUsePremiumOpen =
      expandedGalleryPremiumOpenKeyRef.current === expandedGalleryImageKey;

    gsap.killTweensOf(motionNode);

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      removeOpeningClone();
      gsap.set(motionNode, { opacity: 1 });
      return undefined;
    }

    if (!shouldUsePremiumOpen) {
      removeOpeningClone();
      gsap.set(motionNode, { opacity: 1, clearProps: 'opacity' });
      return undefined;
    }

    if (isDesktopGallery) {
      const expandedCard =
        expandedGalleryFixedCardRef.current ??
        document.querySelector(
          `[data-gallery-card-key="${expandedGalleryImageKey}"]`
        );

      if (expandedCard instanceof HTMLElement) {
        const rect = expandedCard.getBoundingClientRect();
        const centeredTop = (window.innerHeight - rect.height) / 2;
        const nextScrollTop = Math.max(
          0,
          window.scrollY + rect.top - centeredTop
        );

        if (Math.abs(nextScrollTop - window.scrollY) > 1) {
          window.scrollTo({ top: nextScrollTop, behavior: 'auto' });
        }
      } else {
        const stageContentNode =
          stageNode.querySelector('[data-gallery-stage-content="true"]') ?? stageNode;

        if (stageContentNode instanceof HTMLElement) {
          const rect = stageContentNode.getBoundingClientRect();
          const nextScrollTop = Math.max(
            0,
            window.scrollY + rect.top - expandedGalleryStickyTop
          );

          if (Math.abs(nextScrollTop - window.scrollY) > 1) {
            window.scrollTo({ top: nextScrollTop, behavior: 'auto' });
          }
        }
      }
    }

    const stageOpacityFrom = useExpandedLandingPerimeter ? 0.16 : 0;

    // Crossfade the expanded stage in while the captured landing layout dissolves away.
    gsap.fromTo(
      motionNode,
      { opacity: stageOpacityFrom },
      {
        opacity: 1,
        duration: EXPANDED_GALLERY_PREMIUM_OPEN_DURATION,
        ease: 'power1.out',
        overwrite: 'auto',
        clearProps: 'opacity',
      }
    );

    if (openingClone instanceof HTMLElement) {
      gsap.killTweensOf(openingClone);
      gsap.to(openingClone, {
        opacity: 0,
        duration: EXPANDED_GALLERY_PREMIUM_OPEN_DURATION,
        ease: 'power1.out',
        overwrite: 'auto',
        onComplete: () => {
          if (expandedGalleryOpeningCloneRef.current === openingClone) {
            expandedGalleryOpeningCloneRef.current = null;
          }
          openingClone.remove();
        },
      });
    }

    return () => {
      gsap.killTweensOf(motionNode);
      if (openingClone instanceof HTMLElement) {
        gsap.killTweensOf(openingClone);
        if (expandedGalleryOpeningCloneRef.current === openingClone) {
          expandedGalleryOpeningCloneRef.current = null;
        }
        openingClone.remove();
      }
    };
  }, [
    expandedGalleryImageKey,
    expandedGalleryStickyTop,
    isDesktopGallery,
    removeOpeningClone,
    useExpandedLandingPerimeter,
  ]);

  useLayoutEffect(() => {
    if (!expandedGalleryImageKey || !isDesktopGallery) return undefined;

    const outerNode = expandedGalleryFixedCardRef.current;
    if (!outerNode) return undefined;
    const motionNode =
      outerNode.querySelector('[data-gallery-card-inner="true"]') ?? outerNode;
    const sourceRect = expandedGallerySourceRectRef.current;

    gsap.killTweensOf(motionNode);

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      gsap.set(motionNode, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        scale: 1,
        opacity: 1,
      });
      expandedGallerySourceRectRef.current = null;
      return undefined;
    }

    if (useExpandedLandingPerimeter) {
      const finalRect = outerNode.getBoundingClientRect();
      expandedGallerySourceRectRef.current = null;

      if (
        sourceRect?.width &&
        sourceRect?.height &&
        finalRect.width &&
        finalRect.height
      ) {
        const sourceCenterX = sourceRect.left + (sourceRect.width / 2);
        const sourceCenterY = sourceRect.top + (sourceRect.height / 2);
        const finalCenterX = finalRect.left + (finalRect.width / 2);
        const finalCenterY = finalRect.top + (finalRect.height / 2);

        gsap.fromTo(
          motionNode,
          {
            x: sourceCenterX - finalCenterX,
            y: sourceCenterY - finalCenterY,
            scaleX: sourceRect.width / finalRect.width,
            scaleY: sourceRect.height / finalRect.height,
            opacity: 0.9,
            transformOrigin: 'center center',
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform,opacity',
          }
        );
      } else {
        gsap.fromTo(
          motionNode,
          { opacity: 0, y: 8, scale: 0.988 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform,opacity',
          }
        );
      }

      return () => {
        gsap.killTweensOf(motionNode);
      };
    }

    expandedGallerySourceRectRef.current = null;

    gsap.fromTo(
      motionNode,
      { opacity: 0, y: 10, scale: 0.985 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.36,
        ease: 'power2.out',
        overwrite: 'auto',
        clearProps: 'transform,opacity',
      }
    );
    return () => {
      gsap.killTweensOf(motionNode);
    };
  }, [expandedGalleryImageKey, isDesktopGallery, useExpandedLandingPerimeter]);

  useEffect(() => {
    if (useExpandedLandingPerimeter || !expandedGalleryImageKey || !isDesktopGallery) {
      return undefined;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return undefined;
    }

    const stageNode = expandedGalleryStageRef.current;
    const pinnedNode = expandedGalleryFixedCardRef.current;
    if (!stageNode || !pinnedNode) return undefined;

    let rafId = 0;
    const updateFlowMotion = () => {
      rafId = 0;

      const pinnedRect = pinnedNode.getBoundingClientRect();
      if (!pinnedRect.width || !pinnedRect.height) return;

      const pinnedCenterX = pinnedRect.left + pinnedRect.width / 2;
      const pinnedCenterY = pinnedRect.top + pinnedRect.height / 2;
      const maxHorizontalDistance = Math.max(pinnedRect.width * 0.78, 1);
      const maxVerticalDistance = Math.max(pinnedRect.height * 0.9, 1);

      stageNode.querySelectorAll('[data-gallery-flow-card-key]').forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        const inner = node.querySelector('[data-gallery-card-inner="true"]');
        if (!(inner instanceof HTMLElement)) return;

        const rect = node.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const normalizedX = clampNumber(
          -1,
          (cardCenterX - pinnedCenterX) / maxHorizontalDistance,
          1
        );
        const normalizedY = (cardCenterY - pinnedCenterY) / maxVerticalDistance;
        const outsideBandProgress = clampNumber(
          0,
          (Math.abs(normalizedY) - EXPANDED_GALLERY_FLOW_DEAD_ZONE) /
            (1 - EXPANDED_GALLERY_FLOW_DEAD_ZONE),
          1
        );
        const horizontalInfluence = Math.abs(normalizedX);
        const offsetStrength = outsideBandProgress * horizontalInfluence;
        const x = Math.round(
          (-normalizedX * EXPANDED_GALLERY_FLOW_MAX_X * offsetStrength) * 100
        ) / 100;
        const y = Math.round(
          (
            -Math.sign(normalizedY || 0) *
            EXPANDED_GALLERY_FLOW_MAX_Y *
            outsideBandProgress *
            (1 - horizontalInfluence * 0.5)
          ) * 100
        ) / 100;

        gsap.set(inner, {
          x,
          y,
          force3D: true,
        });
      });
    };

    const queueUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateFlowMotion);
    };

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => queueUpdate());

    resizeObserver?.observe(stageNode);
    resizeObserver?.observe(pinnedNode);
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate, { passive: true });
    queueUpdate();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);

      stageNode.querySelectorAll('[data-gallery-flow-card-key]').forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const inner = node.querySelector('[data-gallery-card-inner="true"]');
        if (!(inner instanceof HTMLElement)) return;
        gsap.set(inner, { clearProps: 'x,y,force3D' });
      });
    };
  }, [expandedGalleryImageKey, isDesktopGallery, useExpandedLandingPerimeter]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const scopeEl = container.current;
    const isRenderableIntroNode = (el) => {
      if (!(el instanceof HTMLElement)) return false;
      const { display } = window.getComputedStyle(el);
      return display !== 'none' && display !== 'contents';
    };
    const introPanel =
      gsap.utils
        .toArray('.hero-intro-panel', scopeEl || undefined)
        .find(isRenderableIntroNode) || null;
    const introItems = gsap.utils
      .toArray('.hero-intro-item', scopeEl || undefined)
      .filter(isRenderableIntroNode);

    if (!introPanel && !introItems.length) {
      setEntranceDone(true);
      return;
    }

    if (prefersReducedMotion) {
      if (introPanel) {
        gsap.set(introPanel, { opacity: 1, y: 0, scale: 1, clearProps: 'transform,opacity' });
      }
      if (introItems.length) {
        gsap.set(introItems, { opacity: 1, y: 0, clearProps: 'transform' });
      }
      setEntranceDone(true);
      return;
    }

    const introTimeline = gsap.timeline({
      onComplete: () => setEntranceDone(true),
    });

    if (introPanel) {
      introTimeline.fromTo(
        introPanel,
        { opacity: 0, y: 22, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.58,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
      );
    }

    if (introItems.length) {
      // Keep the existing hero reveal, but let it chase the panel in slightly.
      introTimeline.fromTo(
        introItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        introPanel ? '-=0.52' : 0,
      );
    }

    const content = reviewsContentRef.current;
    const wrapper = reviewsSectionRef.current;
    if (content && wrapper && !prefersReducedMotion) {
      const cards = content.querySelectorAll('[data-review-card="true"]');
      gsap.set(content, { opacity: 0 });
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 30 });
      }

      let cardsRevealed = false;

      gsap.to(content, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'top 25%',
          scrub: true,
          onUpdate: (self) => {
            wrapper.style.pointerEvents =
              self.progress > 0.8 ? '' : 'none';

            if (!cardsRevealed && self.progress > 0.6 && cards.length) {
              cardsRevealed = true;
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                overwrite: true,
                clearProps: 'transform',
              });
            }
          },
        },
      });
    }

    const backdrop = reviewsBackdropRef.current;
    const selectedSection = selectedRef.current;
    if (backdrop && selectedSection && wrapper && !prefersReducedMotion) {
      gsap.set(backdrop, { opacity: 0 });

      // One scrubbed timeline prevents competing tweens on `opacity`.
      // Range: after Selected Work leaves viewport → end of full Reviews grid.
      const bgTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: selectedSection,
          start: 'bottom top',
          endTrigger: wrapper,
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // Fade in, hold, then fade out to white at the very end.
      bgTl.to(backdrop, { opacity: 1, duration: 0.18 });
      bgTl.to(backdrop, { opacity: 1, duration: 0.67 });
      bgTl.to(backdrop, { opacity: 0, duration: 0.15 });
    }
  }, { scope: container });

  const renderExpandedLandingPerimeter = () => {
    if (!expandedLandingSelectedImage) {
      return <div className="h-[40vh] md:h-[45vh]" aria-hidden="true" />;
    }

    const selectedCardKey =
      `${expandedLandingSelectedImage.galleryKey}:${expandedLandingSelectedImage.id}`;
    const selectedAltLabel =
      expandedLandingSelectedImage.altLabel ?? 'Landing Page';
    const selectedAltText =
      expandedLandingSelectedImage.altText ?? `${selectedAltLabel} expanded photo`;

    return (
      <div
        ref={expandedGalleryStageRef}
        data-gallery-layout="perimeter"
        className="relative"
        style={{
          minHeight: `${expandedGalleryPerimeterOuterHeight}px`,
          paddingTop: `${expandedGalleryPerimeterVerticalShift}px`,
          scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
        }}
      >
        <div
          data-gallery-stage-content="true"
          className="sticky"
          style={{
            top: `${expandedGalleryStickyTop}px`,
          }}
        >
          <div
            className="relative"
            style={{
              width: 'calc(125% + 0.5rem)',
              maxWidth: 'none',
              marginLeft: 'calc(-12.5% - 0.25rem)',
              height: `${expandedGalleryPerimeterStageHeight}px`,
              transform: expandedGalleryPerimeterVerticalShift
                ? `translateY(-${expandedGalleryPerimeterVerticalShift}px)`
                : undefined,
            }}
          >
            {expandedGalleryPerimeterCards.map(({ img, cardKey, pose }, i) => {
              const imageAltLabel = img.altLabel ?? 'Landing Page';
              const imageAltText =
                img.altText ?? `${imageAltLabel} photo ${i + 1}`;
              const cardOpacity = Number(pose.opacity.toFixed(3));

              return (
                <div
                  key={cardKey}
                  data-gallery-card-key={cardKey}
                  data-gallery-flow-card-key={cardKey}
                  data-gallery-edge={pose.edge}
                  data-gallery-featured="false"
                  role="button"
                  tabIndex={cardOpacity < 0.2 ? -1 : 0}
                  aria-expanded="false"
                  aria-label={`Expand ${imageAltLabel} photo ${i + 1}`}
                  className="home-gallery-card absolute block rounded-[8px] border-0 bg-transparent p-0 text-left transition-[filter,box-shadow,opacity] duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300"
                  style={{
                    left: `${pose.x}%`,
                    top: `${pose.y}%`,
                    width: `min(${pose.width}%, 15rem)`,
                    transform: 'translate(-50%, -50%)',
                    opacity: cardOpacity,
                    zIndex: 5,
                    scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
                    pointerEvents: cardOpacity < 0.2 ? 'none' : 'auto',
                    willChange: 'transform,opacity',
                  }}
                  onClick={(e) => handleGalleryImageClick(img.galleryKey, img.id, e)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    handleGalleryImageClick(img.galleryKey, img.id, e);
                  }}
                >
                  <div
                    data-gallery-card-inner="true"
                    className="relative w-full overflow-hidden rounded-[8px] bg-slate-200/20 aspect-[4/3] shadow-xl shadow-slate-200/60"
                  >
                    <ProgressiveCldImage
                      publicId={img.publicId}
                      cldImg={img.cldImg}
                      alt={imageAltText}
                      loading="lazy"
                      decoding="async"
                      imgClassName="object-cover"
                    />
                  </div>
                </div>
              );
            })}

            <div
              ref={expandedGalleryFixedCardRef}
              data-gallery-card-key={selectedCardKey}
              data-gallery-featured="true"
              data-gallery-pinned="true"
              role="button"
              tabIndex={0}
              aria-expanded="true"
              aria-label={`Collapse ${selectedAltLabel}`}
              className="home-gallery-card absolute z-30 block rounded-[8px] border-0 bg-transparent p-0 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300"
              style={{
                left: '50%',
                top: '50%',
                width: `min(${EXPANDED_GALLERY_PERIMETER_HERO_WIDTH}%, 55rem)`,
                transform: 'translate(-50%, -50%)',
                scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
              }}
              onClick={closeExpandedGalleryImage}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                closeExpandedGalleryImage();
              }}
            >
              <div
                data-gallery-card-inner="true"
                className="relative w-full overflow-hidden rounded-[8px] bg-slate-200/20 aspect-[4/3] shadow-2xl shadow-slate-900/15"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeExpandedGalleryImage();
                  }}
                  className="absolute top-4 right-4 z-30 flex p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all"
                  aria-label={`Close ${selectedAltLabel}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                  </svg>
                </button>
                <ProgressiveCldImage
                  publicId={expandedLandingSelectedImage.publicId}
                  cldImg={expandedLandingSelectedImage.cldImg}
                  alt={selectedAltText}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  imgClassName="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHomeGalleryGrid = (
    images,
    galleryKey,
    gridRef,
    altLabel,
    allowExpandedLayout = true
  ) => {
    const galleryHasExpandedImage = isDesktopGallery && allowExpandedLayout && (
      galleryKey
      ? expandedGalleryImage?.galleryKey === galleryKey
      : hasExpandedGalleryImage
    );
    const suppressPerimeterSourceGallery =
      useExpandedLandingPerimeter && !allowExpandedLayout;
    const usePinnedDesktopLayout = galleryHasExpandedImage && isDesktopGallery && !galleryKey;
    const pinnedDesktopImage = usePinnedDesktopLayout
      ? (
        images.find((img) => {
          const imageGalleryKey = img.galleryKey ?? galleryKey;
          return (
            expandedGalleryImage?.galleryKey === imageGalleryKey &&
            expandedGalleryImage.imageId === img.id
          );
        }) ?? null
      )
      : null;
    const pinnedDesktopCardKey = pinnedDesktopImage
      ? `${pinnedDesktopImage.galleryKey ?? galleryKey}:${pinnedDesktopImage.id}`
      : null;
    const pinnedDesktopAltLabel = pinnedDesktopImage?.altLabel ?? altLabel;
    const pinnedDesktopAltText =
      pinnedDesktopImage?.altText ?? `${pinnedDesktopAltLabel} expanded photo`;
    const pinnedDesktopReservedAreaStyle = usePinnedDesktopLayout
      ? {
          gridColumn: `${EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_START} / span ${EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_SPAN}`,
          gridRow: `${
            EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START + expandedGalleryPinnedRowOffset
          } / span ${EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN}`,
        }
      : null;
    const expandedGalleryGridStyle = galleryHasExpandedImage
      ? usePinnedDesktopLayout
        ? {
            gridTemplateColumns: `repeat(${EXPANDED_GALLERY_DESKTOP_GRID_COLUMNS}, minmax(0, 1fr))`,
            gridAutoFlow: 'row dense',
            width: 'calc(125% + 0.5rem)',
            maxWidth: 'none',
            marginLeft: 'calc(-12.5% - 0.25rem)',
          }
        : isDesktopGallery
        ? {
            gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
            gridAutoFlow: 'row dense',
            width: 'calc(125% + 0.5rem)',
            maxWidth: 'none',
            marginLeft: 'calc(-12.5% - 0.25rem)',
          }
        : {
            gridAutoFlow: 'row dense',
          }
      : undefined;

    return (
      <div
        ref={gridRef}
        className={`home-gallery-grid grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-8 items-start ${
          galleryHasExpandedImage ? '' : 'group/gallery'
        }`}
        data-gallery-expanded={galleryHasExpandedImage ? 'true' : 'false'}
        style={expandedGalleryGridStyle}
      >
        {usePinnedDesktopLayout && pinnedDesktopImage && pinnedDesktopCardKey && (
          <div
            ref={expandedGalleryFixedCardRef}
            data-gallery-card-key={pinnedDesktopCardKey}
            data-gallery-featured="true"
            data-gallery-pinned="true"
            role="button"
            tabIndex={0}
            aria-expanded="true"
            aria-label={`Collapse ${pinnedDesktopAltLabel}`}
            className="home-gallery-card relative z-30 block w-full rounded-[4px] md:rounded-[8px] border-0 bg-transparent p-0 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300"
            style={{
              ...pinnedDesktopReservedAreaStyle,
              position: 'sticky',
              top: `${expandedGalleryStickyTop}px`,
              alignSelf: 'start',
              scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
            }}
            onClick={closeExpandedGalleryImage}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              closeExpandedGalleryImage();
            }}
          >
            <div
              data-gallery-card-inner="true"
              className="relative w-full overflow-hidden rounded-[4px] md:rounded-[8px] bg-slate-200/20 aspect-[4/3] shadow-2xl shadow-slate-900/15"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeExpandedGalleryImage();
                }}
                className="absolute top-4 right-4 z-30 flex p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all"
                aria-label={`Close ${pinnedDesktopAltLabel}`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                </svg>
              </button>
              <ProgressiveCldImage
                publicId={pinnedDesktopImage.publicId}
                cldImg={pinnedDesktopImage.cldImg}
                alt={pinnedDesktopAltText}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                imgClassName="object-cover"
              />
            </div>
          </div>
        )}
        {images.map((img, i) => {
          const imageGalleryKey = img.galleryKey ?? galleryKey;
          const imageAltLabel = img.altLabel ?? altLabel;
          const imageAltText = img.altText ?? `${imageAltLabel} photo ${i + 1}`;
          const imageCardKey = `${imageGalleryKey}:${img.id}`;
          const isExpanded =
            galleryHasExpandedImage &&
            expandedGalleryImage?.galleryKey === imageGalleryKey &&
            expandedGalleryImage.imageId === img.id;
          const isPinnedExpanded = isExpanded && usePinnedDesktopLayout;

          if (isPinnedExpanded) return null;

          const cardStyle = {
            scrollMarginTop: isDesktopGallery ? '112px' : '88px',
            ...(galleryHasExpandedImage
              ? usePinnedDesktopLayout
                ? {
                    gridColumn:
                      `span ${EXPANDED_GALLERY_DESKTOP_CARD_SPAN} / span ${EXPANDED_GALLERY_DESKTOP_CARD_SPAN}`,
                  }
                : isExpanded
                ? isDesktopGallery
                  ? {
                      gridColumn: '4 / span 9',
                      gridRow: '2 / span 3',
                      alignSelf: 'start',
                    }
                  : {
                      gridColumn: '1 / -1',
                      gridRow: 'auto',
                    }
                : isDesktopGallery
                  ? {
                      gridColumn: 'span 3 / span 3',
                    }
                  : {}
              : {}),
          };

          return (
            <div
              key={imageCardKey}
              data-gallery-card-key={
                suppressPerimeterSourceGallery ? undefined : imageCardKey
              }
              data-gallery-flow-card-key={
                suppressPerimeterSourceGallery ? undefined : imageCardKey
              }
              data-gallery-featured={isExpanded ? 'true' : 'false'}
              role={suppressPerimeterSourceGallery ? undefined : 'button'}
              tabIndex={suppressPerimeterSourceGallery ? -1 : 0}
              aria-hidden={suppressPerimeterSourceGallery ? true : undefined}
              aria-expanded={
                suppressPerimeterSourceGallery
                  ? undefined
                  : (isDesktopGallery ? isExpanded : undefined)
              }
              aria-haspopup={
                suppressPerimeterSourceGallery
                  ? undefined
                  : (isDesktopGallery ? undefined : 'dialog')
              }
              aria-label={`${isDesktopGallery
                ? (isExpanded ? 'Collapse' : 'Expand')
                : 'Open'} ${imageAltLabel} photo ${i + 1}`}
              className={`home-gallery-card relative block w-full rounded-[4px] md:rounded-[8px] border-0 bg-transparent p-0 text-left transition-[filter,box-shadow] duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 ${
                galleryHasExpandedImage
                  ? ''
                  : 'group-hover/gallery:brightness-[0.85] hover:!brightness-100'
              } ${isExpanded ? 'z-20 cursor-pointer' : 'cursor-pointer'} ${img.className}`}
              style={cardStyle}
              onClick={suppressPerimeterSourceGallery
                ? undefined
                : ((e) => handleGalleryCardActivate(
                  images,
                  imageGalleryKey,
                  img.id,
                  i,
                  e
                ))}
              onKeyDown={suppressPerimeterSourceGallery
                ? undefined
                : ((e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  handleGalleryCardActivate(
                    images,
                    imageGalleryKey,
                    img.id,
                    i,
                    e
                  );
                })}
              onMouseEnter={suppressPerimeterSourceGallery ? undefined : handleCardEnter}
              onMouseLeave={suppressPerimeterSourceGallery ? undefined : handleCardLeave}
            >
              <div
                data-gallery-card-inner="true"
                className={`relative w-full overflow-hidden rounded-[4px] md:rounded-[8px] bg-slate-200/20 ${img.aspectRatio} ${
                  isExpanded
                    ? 'shadow-2xl shadow-slate-900/15'
                    : 'shadow-xl shadow-slate-200/50'
                }`}
              >
                {isExpanded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeExpandedGalleryImage();
                    }}
                    className="absolute top-4 right-4 z-30 flex p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all"
                    aria-label={`Close ${imageAltLabel} photo ${i + 1}`}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                    </svg>
                  </button>
                )}
                <ProgressiveCldImage
                  publicId={img.publicId}
                  cldImg={img.cldImg}
                  alt={imageAltText}
                  loading="lazy"
                  decoding="async"
                  imgClassName="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div id="home-page" ref={container} className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 z-0 h-[120vh] max-h-[1200px] hidden md:block"
        style={{
          background: 'radial-gradient(70% 65% at 65% 30%, #D0E8FF 0%, #EDF3FA 45%, #FFFFFF 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        ref={reviewsBackdropRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: 0,
          background: 'radial-gradient(52.85% 52.85% at 49.04% 47.15%, #D0E8FF 0%, #F5F5F7 100%)',
        }}
      />
      <div
        className={[
          'md:hidden fixed inset-x-0 z-40 flex justify-center transition-[opacity,transform] duration-300 ease-out',
          showStickyReachOut && !showQuoteModal
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none',
        ].join(' ')}
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <button
          type="button"
          onClick={() => setShowQuoteModal(true)}
          className="group inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] sm:w-[112px] sm:h-[24px] bg-[#242424] text-white rounded-[17px] text-[13px] sm:text-[12px] font-normal hover:bg-black transition-colors"
        >
          <span>Reach Out</span>
          <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
      <div className="relative z-10">
        {/* Hero Section - Framed Premium Layout */}
        <section id="home-hero" className="relative w-full pt-5 md:pt-0 pb-8 max-w-[1440px] mx-auto min-h-[50vh] lg:min-h-[50vh] flex flex-col justify-center">
          {/* Mobile-only: compact reviews eyebrow above image stack */}
          <div className="hero-mobile-eyebrow-row hero-intro-item md:hidden flex justify-center mb-11 -mt-2">
            <div className="hero-eyebrow max-w-full inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-1 rounded-full bg-white border border-slate-200/80 leading-none">
              <div className="flex items-center bg-[#F8F9FA] rounded-full px-2 py-1 border border-slate-100/50">
                <div className="flex items-center gap-1.5">
                  {/* Google */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {/* Yelp */}
                  <svg width="12" height="12" viewBox="0 0 384 512" fill="#FF1A1A" className="flex-shrink-0">
                    <path d="M42.9 240.32l99.62 48.61c19.2 9.4 16.2 37.51-4.5 42.71L30.5 358.45a22.79 22.79 0 0 1-28.21-19.6 197.16 197.16 0 0 1 9-85.32 22.8 22.8 0 0 1 31.61-13.21zm44 239.25a199.45 199.45 0 0 0 79.42 32.11A22.78 22.78 0 0 0 192.94 490l3.9-110.82c.7-21.3-25.5-31.91-39.81-16.1l-74.21 82.4a22.82 22.82 0 0 0 4.09 34.09zm145.34-109.92l58.81 94a22.93 22.93 0 0 0 34 5.5 198.36 198.36 0 0 0 52.71-67.61A23 23 0 0 0 364.17 370l-105.42-34.26c-20.31-6.5-37.81 15.8-26.51 33.91zm148.33-132.23a197.44 197.44 0 0 0-50.41-69.31 22.85 22.85 0 0 0-34 4.4l-62 91.92c-11.9 17.7 4.7 40.61 25.2 34.71L366 268.63a23 23 0 0 0 14.61-31.21zM62.11 30.18a22.86 22.86 0 0 0-9.9 32l104.12 180.44c11.7 20.2 42.61 11.9 42.61-11.4V22.88a22.67 22.67 0 0 0-24.5-22.8 320.37 320.37 0 0 0-112.33 30.1z"/>
                  </svg>
                  {/* WeddingWire */}
                  <img src="https://www.google.com/s2/favicons?domain=weddingwire.com&sz=128" alt="WeddingWire" className="w-[12px] h-[12px] object-contain flex-shrink-0 rounded-[3px] opacity-90 max-[360px]:hidden" />
                  {/* Thumbtack */}
                  <img src="https://www.google.com/s2/favicons?domain=thumbtack.com&sz=128" alt="Thumbtack" className="w-[12px] h-[12px] object-contain flex-shrink-0 rounded-[3px] opacity-90 max-[360px]:hidden" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] max-[360px]:text-[10px] font-medium text-slate-700 whitespace-nowrap">1.2K+ Reviews</span>
                <div className="w-[1px] h-3 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] max-[360px]:text-[10px] font-semibold text-slate-800 whitespace-nowrap">4.8/5</span>
                  <div className="flex items-center gap-0.5 flex-nowrap">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-[11px] h-[11px] text-[#FBBC05] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={!isMobileStack && heroScale < 1 && heroNaturalHeight > 0 ? {
              height: heroNaturalHeight * heroScale,
              position: 'relative',
            } : undefined}
          >
            <div
              ref={heroLayoutRef}
              className="hero-primary-layout relative flex flex-col md:block md:px-12 w-full"
              style={heroLayoutStyle}
            >
          
            {/* Text Content Box */}
            <div 
              className="hero-text-col contents md:z-20 md:block md:absolute md:-left-[130px] md:top-1/2 md:-translate-y-1/2 md:w-[604px] md:h-[318px]"
            >
              <div className="hero-intro-panel contents md:flex md:flex-col md:justify-start md:items-center md:w-full md:h-full md:bg-white/[0.97] md:rounded-[22px] md:px-[42px] md:pt-[17px] md:pb-[47px]">
              <div className="hero-eyebrow hero-intro-item hidden md:flex w-fit items-center justify-center md:gap-2 xl:gap-3 pl-1.5 md:pr-3 xl:pr-4 md:py-1 xl:py-1.5 rounded-full bg-white border border-slate-200/80 mb-4">
                <div className="flex items-center bg-[#F8F9FA] rounded-full md:px-2 xl:px-2 md:py-1 xl:py-1 border border-slate-100/50">
                  <div className="flex items-center md:gap-1.5 xl:gap-2">
                    {/* Google */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {/* Yelp */}
                    <svg viewBox="0 0 384 512" fill="#FF1A1A" className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] flex-shrink-0">
                      <path d="M42.9 240.32l99.62 48.61c19.2 9.4 16.2 37.51-4.5 42.71L30.5 358.45a22.79 22.79 0 0 1-28.21-19.6 197.16 197.16 0 0 1 9-85.32 22.8 22.8 0 0 1 31.61-13.21zm44 239.25a199.45 199.45 0 0 0 79.42 32.11A22.78 22.78 0 0 0 192.94 490l3.9-110.82c.7-21.3-25.5-31.91-39.81-16.1l-74.21 82.4a22.82 22.82 0 0 0 4.09 34.09zm145.34-109.92l58.81 94a22.93 22.93 0 0 0 34 5.5 198.36 198.36 0 0 0 52.71-67.61A23 23 0 0 0 364.17 370l-105.42-34.26c-20.31-6.5-37.81 15.8-26.51 33.91zm148.33-132.23a197.44 197.44 0 0 0-50.41-69.31 22.85 22.85 0 0 0-34 4.4l-62 91.92c-11.9 17.7 4.7 40.61 25.2 34.71L366 268.63a23 23 0 0 0 14.61-31.21zM62.11 30.18a22.86 22.86 0 0 0-9.9 32l104.12 180.44c11.7 20.2 42.61 11.9 42.61-11.4V22.88a22.67 22.67 0 0 0-24.5-22.8 320.37 320.37 0 0 0-112.33 30.1z"/>
                    </svg>
                    {/* WeddingWire */}
                    <img src="https://www.google.com/s2/favicons?domain=weddingwire.com&sz=128" alt="WeddingWire" className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] object-contain flex-shrink-0 rounded-[3px] opacity-90" />
                    {/* Thumbtack */}
                    <img src="https://www.google.com/s2/favicons?domain=thumbtack.com&sz=128" alt="Thumbtack" className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] object-contain flex-shrink-0 rounded-[3px] opacity-90" />
                  </div>
                </div>
                
                <div className="flex items-center md:gap-2 xl:gap-2.5">
                  <span className="md:text-[11px] xl:text-[12px] font-semibold text-[#18181B] tracking-wide whitespace-nowrap">1.2K+ Reviews</span>
                  <div className="w-[1px] md:h-3 xl:h-3 bg-slate-300"></div>
                  <div className="flex items-center md:gap-1.5 xl:gap-1.5">
                    <span className="md:text-[11px] xl:text-[12px] font-semibold text-[#18181B] whitespace-nowrap">4.8/5</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="md:w-[11px] md:h-[11px] xl:w-[12px] xl:h-[12px] text-[#FBBC05] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="contents md:flex md:flex-col md:flex-1 md:w-full text-left">
                <p className="sr-only">
                  Washington D.C. and Philadelphia wedding, editorial, and lifestyle photographer.
                </p>
                <h1 className="hero-intro-item order-1 md:order-none font-serif uppercase md:normal-case text-[44px] md:text-[54px] lg:text-[62px] text-[#18181B] leading-[1.15] md:leading-[1.02] tracking-normal mb-6 md:mb-5">
                  <div className="hero-text-line whitespace-nowrap">Unscripted Moments.</div>
                  <div className="hero-text-line whitespace-nowrap">Unforgettable Memories.</div>
                </h1>
                <div className="order-3 md:order-none w-full max-w-[386px] mx-auto md:flex md:flex-col md:flex-1">
                  <p className="hero-intro-item hero-desc text-[#6B6B76] font-light text-[13px] leading-[1.5] md:leading-[1.5] mb-8 md:mb-5">
                    Premium photography for{' '}
                    <Link
                      to="/booking"
                      className="text-current transition-colors duration-300 hover:text-[#18181B]"
                    >
                      weddings, editorials, and lifestyle
                    </Link>
                    . Based in{' '}
                    <Link
                      to="/about"
                      className="text-current transition-colors duration-300 hover:text-[#18181B]"
                    >
                      Washington D.C. and Philadelphia
                    </Link>
                    , traveling worldwide.
                  </p>
                  <button
                    ref={heroReachOutButtonRef}
                    data-hero-reach-out
                    onClick={() => setShowQuoteModal(true)}
                    className="hero-intro-item hero-link group flex md:inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] sm:w-[112px] sm:h-[24px] bg-[#18181B] text-white rounded-full text-[13px] font-normal hover:bg-black transition-colors md:mt-auto mx-auto md:mx-0"
                  >
                    <span>Reach Out</span>
                    <ArrowRight size={13} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
              </div>
            </div>
          
            {/* Staggered Image Stack */}
            <div className="hero-stack-col hero-intro-item w-full order-2 mb-2 md:mb-0 md:ml-auto md:mr-[-72px] md:w-[900px] flex items-center justify-end relative group md:py-16">
              <div
                className="hero-stack-wrapper relative w-full md:w-[900px]"
              ref={stackRef}
              style={{
                aspectRatio: '637 / 426',
                transform: isMobileStack ? undefined : `translateX(${stackWrapperTranslateX}px)`,
              }}
            >
              {!isMobileStack && (() => {
                const backIdx = visibleSet[0];
                const bgCards = [
                  { idx: (backIdx - 2 + heroImages.length) % heroImages.length, opacity: 0.05, offset: 2 },
                  { idx: (backIdx - 1 + heroImages.length) % heroImages.length, opacity: 0.2, offset: 1 },
                ];
                return bgCards.map((card, i) => (
                  <div
                    key={`bg-${i}`}
                    className="absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                    style={{
                      width: `calc(100% - ${(STACK_COUNT - 1) * stackOffsetX}px)`,
                      aspectRatio: '3 / 2',
                      zIndex: 0,
                      transform: `translate(${-card.offset * stackOffsetX}px, ${card.offset * stackOffsetY}px)`,
                      opacity: card.opacity,
                      border: '0.5px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <AdvancedImage
                      cldImg={heroImages[card.idx]}
                      className="w-full h-full object-cover"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ));
              })()}
              {departingIdx !== null && (
                <div
                  key={`dep-${departingIdx}`}
                  className="absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                  style={{
                    width: `calc(100% - ${(STACK_COUNT - 1) * stackOffsetX}px)`,
                    aspectRatio: '3 / 2',
                    zIndex: 0,
                    boxShadow: CARD_SHADOWS[0],
                    animation: 'stackCardOut 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  }}
                >
                  <AdvancedImage
                    cldImg={heroImages[departingIdx]}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              )}
              {visibleSet.map((imgIdx, pos) => {
                const leftShift = pos >= 1 ? Math.round(stackOffsetX * 0.4) : 0;
                return (
                <div
                  key={imgIdx}
                  className="hero-stack-card absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                  style={{
                    width: `calc(100% - ${(STACK_COUNT - 1) * stackOffsetX}px)`,
                    aspectRatio: '3 / 2',
                    zIndex: pos + 1,
                    transform: `translate(${pos * stackOffsetX - leftShift}px, ${pos * -stackOffsetY}px)`,
                    transition: entranceDone ? 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.6s ease' : 'none',
                    boxShadow: CARD_SHADOWS[pos],
                    border: '0.5px solid rgba(0,0,0,0.06)',
                    willChange: 'transform',
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={
                      pos === STACK_COUNT - 1 && hasInitialized
                        ? { animation: 'stackCardIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) both' }
                        : undefined
                    }
                  >
                    <div
                      className="w-full h-full"
                      style={
                        pos === STACK_COUNT - 1
                          ? { animation: 'heroKenBurns 12s ease-out forwards', willChange: 'transform' }
                          : undefined
                      }
                    >
                      <AdvancedImage
                        cldImg={heroImages[imgIdx]}
                        className="w-full h-full object-cover"
                        alt={HERO_IMAGE_ALTS[imgIdx] ?? `Starling Photography portfolio image ${imgIdx + 1}`}
                        loading={pos === STACK_COUNT - 1 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={pos === STACK_COUNT - 1 ? 'high' : 'auto'}
                      />
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>

        </div>
        </div>
      </section>

      {/* Assorted / Selected Work */}
      <section
        id="home-selected"
        ref={selectedRef}
        data-nav-dark
        className={`px-3 md:px-12 max-w-7xl mx-auto py-12 ${
          hasExpandedGalleryImage && isDesktopGallery ? '' : 'border-t border-slate-100'
        }`}
        style={
          hasExpandedGalleryImage && isDesktopGallery
            ? { scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px` }
            : undefined
        }
      >
        {hasExpandedGalleryImage && isDesktopGallery ? (
          expandedGalleryCatalogImages.length ? (
            renderExpandedLandingPerimeter()
          ) : (
            <div className="h-[40vh] md:h-[45vh]" aria-hidden="true" />
          )
        ) : (
          <>
            <div ref={selectedDividerRef} className="flex items-center gap-6 mb-10">
              <div className="flex-1 h-px bg-slate-200" />
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">Selected Work</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {renderSelected ? (
              renderHomeGalleryGrid(assortedImages, 'selected', assortedGridRef, 'Selected Work')
            ) : (
              <div className="h-[22vh] md:h-[28vh]" aria-hidden="true" />
            )}
          </>
        )}
      </section>

      {/* Featured Galleries / Recent Work */}
      <section
        id="home-featured"
        ref={featuredRef}
        data-nav-dark
        className="px-3 md:px-12 max-w-7xl mx-auto py-12 min-h-[50vh]"
        style={useExpandedLandingPerimeter ? { visibility: 'hidden' } : undefined}
      >
        <div className="flex justify-between items-end mb-8">
          {/* <h2 className="text-2xl font-light tracking-wide text-slate-900">Recent Stories</h2> */}
        </div>

        {renderFeatured || hasExpandedGalleryImage ? (
          <div className="space-y-28 md:space-y-20">
            {/* Gallery 2 - Makayla and Hunter */}
            <div>
              <div ref={wedding2HeaderRef} className="mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-2 md:mb-3">Makayla and Hunter</h3>
                <p className="text-[10px] md:text-[11px] text-slate-400 font-serif uppercase tracking-widest whitespace-normal break-words max-w-full">
                  Glasbern - A Historic Hotel of America • Summer 2025
                </p>
              </div>
              {renderHomeGalleryGrid(
                wedding2Images,
                'wedding-2',
                wedding2GridRef,
                'Makayla and Hunter',
                false
              )}
            </div>

            {/* Gallery 1 */}
            <div>
              <div ref={wedding1HeaderRef} className="mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-2 md:mb-3">Molly and Brandon</h3>
                <p className="text-[10px] md:text-[11px] text-slate-400 font-serif uppercase tracking-widest whitespace-normal break-words max-w-full">
                  Green Lane, Pennsylvania • Summer 2025
                </p>
              </div>
              {renderHomeGalleryGrid(
                wedding1Images,
                'wedding-1',
                wedding1GridRef,
                'Molly and Brandon',
                false
              )}
            </div>

            {/* Gallery 3 - Neeshay */}
            <div>
              <div ref={wedding3HeaderRef} className="mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-2 md:mb-3">Neeshay and James</h3>
                <p className="text-[10px] md:text-[11px] text-slate-400 font-serif uppercase tracking-widest whitespace-normal break-words max-w-full">
                  Ardmore, Pennsylvania
                </p>
              </div>
              {renderHomeGalleryGrid(
                wedding3Images,
                'wedding-3',
                wedding3GridRef,
                'Neeshay and James',
                false
              )}
            </div>
          </div>
        ) : (
          <div className="h-[40vh] md:h-[45vh]" aria-hidden="true" />
        )}

        {/* Scroll hint (desktop only — mobile shows form inline) */}
        <div className="hidden md:flex flex-col items-center gap-2 mt-16 mb-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-light">
            Keep scrolling to inquire
          </span>
          <svg
            className="w-4 h-4 text-slate-300 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Scroll-driven booking reveal */}
      <ScrollBookingReveal sectionRef={bookingRevealRef} />

      {/* Full review grid */}
      <div
        ref={reviewsSectionRef}
        className="relative"
        style={{ marginTop: isMobileStack ? 0 : '-100vh', pointerEvents: 'none' }}
      >
        <div ref={reviewsContentRef} className="relative z-[25]">
          <h2 className="sr-only">Client reviews and testimonials</h2>
          <ReviewsGrid showHeading={false} animate={false} />
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          style={
            isMobileStack
              ? undefined
              : {
                  animation:
                    isClosingQuoteModal === 'slow'
                      ? 'lightboxOut 1.5s cubic-bezier(0.23,1,0.32,1) forwards'
                      : isClosingQuoteModal === 'fast'
                        ? 'lightboxOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        : 'lightboxIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }
          }
        >
          <div
            className={
              isMobileStack
                ? 'absolute inset-0 starling-quote-backdrop'
                : 'absolute inset-0 bg-black/40 backdrop-blur-sm md:bg-white/70 md:backdrop-blur-3xl'
            }
            onClick={() => closeQuoteModal(false)}
            style={
              isMobileStack
                ? {
                    animation:
                      isClosingQuoteModal === 'slow'
                        ? 'starlingQuoteBackdropOut 1.5s cubic-bezier(0.23,1,0.32,1) both'
                        : isClosingQuoteModal === 'fast'
                          ? 'starlingQuoteBackdropOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
                          : 'starlingQuoteBackdropIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
                  }
                : undefined
            }
          />

          <div
            className={
              isMobileStack
                ? 'relative z-10 w-full starling-quote-card'
                : 'relative z-10 w-full animate-fade-in'
            }
            style={{
              ...(isMobileStack
                ? {
                    animation:
                      isClosingQuoteModal === 'slow'
                        ? 'starlingQuoteCardOut 1.5s cubic-bezier(0.23,1,0.32,1) both'
                        : isClosingQuoteModal === 'fast'
                          ? 'starlingQuoteCardOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
                          : 'starlingQuoteCardIn 1s ease-out both',
                  }
                : null),
              maxWidth: 608,
              borderRadius: 22,
              backgroundColor: '#242424',
              border: '1px solid #000000',
              padding: '36px 44px',
            }}
          >
            <button
              type="button"
              onClick={() => closeQuoteModal(false)}
              className="absolute top-4 right-4 z-30 p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all"
              aria-label="Close"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
            <form onSubmit={handleQuoteSubmit}>
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  quoteStatus === 'success' 
                    ? 'opacity-100 translate-y-0 z-10 pointer-events-auto duration-1000 delay-500' 
                    : 'opacity-0 translate-y-8 -z-10 pointer-events-none duration-500 delay-0'
                }`}
                style={{ padding: '36px 44px' }}
              >
                <p className="text-white text-center font-light" style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', lineHeight: '1.5' }}>
                  Thank you! We'll be in touch shortly.
                </p>
              </div>

              <div
                className={`transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  quoteStatus === 'success' 
                    ? 'pointer-events-none' 
                    : 'pointer-events-auto'
                }`}
              >
                <div
                  style={{
                    pointerEvents: (quoteStatus === 'sending' || quoteStatus === 'success') ? 'none' : 'auto',
                  }}
                >
                  <div
                    className={`mb-8 text-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(quoteStatus === 'sending' || quoteStatus === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                    style={{ transitionDelay: (quoteStatus === 'sending' || quoteStatus === 'success') ? '0ms' : '150ms' }}
                  >
                    <h3 className="text-white text-xl font-serif tracking-wide mb-2">Request a Quote</h3>
                    <p className="text-slate-400 text-sm font-light">Enter your details and we'll reach out to you shortly.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-y-7">
                    <div
                      className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(quoteStatus === 'sending' || quoteStatus === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                      style={{ transitionDelay: (quoteStatus === 'sending' || quoteStatus === 'success') ? '50ms' : '200ms' }}
                    >
                      <label htmlFor="quote-phone" className="block text-xs uppercase tracking-widest mb-4" style={{ color: '#FFFFFF' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="quote-phone"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ phone: e.target.value })}
                        required
                        className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                        style={{ border: 'none', borderBottom: '1px solid #B7B7B7' }}
                      />
                    </div>
                  </div>
                </div>

                <div 
                  className={`flex justify-center mt-9 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(quoteStatus === 'sending' || quoteStatus === 'success') ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                  style={{ transitionDelay: (quoteStatus === 'sending' || quoteStatus === 'success') ? '100ms' : '250ms' }}
                >
                  <button
                    type="submit"
                    disabled={quoteStatus === 'sending'}
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
                      opacity: quoteStatus === 'sending' ? 0.8 : 1,
                    }}
                  >
                    Get a Quote
                  </button>
                </div>

                {quoteStatus === 'error' && (
                  <p 
                    className={`text-red-400 text-sm font-light mt-6 text-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${quoteStatus === 'error' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                  >
                    Something went wrong. Please try again later.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {mobileLightbox && mobileLightboxImage && (
        <div
          className="fixed inset-0 z-50"
          data-starling-mobile-lightbox
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          <div
            className={`absolute inset-0 ${
              isMobileLandscape
                ? 'bg-black'
                : 'bg-black/40 backdrop-blur-sm'
            }`}
            onClick={closeMobileLightbox}
          />

          <div className="pointer-events-none absolute inset-0 z-20">
            {isMobileLandscape && (
              <button
                type="button"
                onClick={closeMobileLightbox}
                className="pointer-events-auto absolute z-20 w-12 h-12 p-0 flex items-center justify-center bg-transparent text-white hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
                style={{
                  top: 'calc(env(safe-area-inset-top) + 12px)',
                  right: 'calc(env(safe-area-inset-right) + 12px)',
                }}
                aria-label="Close"
              >
                <X size={28} strokeWidth={1.75} />
              </button>
            )}

            {mobileLightbox.images.length > 1 && isMobileLandscape && (
              <>
                <button
                  type="button"
                  onClick={() => navigateMobileLightbox(-1)}
                  className="pointer-events-auto absolute left-3 top-1/2 z-20 -translate-y-1/2 p-3 text-white transition-colors duration-300 hover:text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} strokeWidth={0.8} />
                </button>
                <button
                  type="button"
                  onClick={() => navigateMobileLightbox(1)}
                  className="pointer-events-auto absolute right-3 top-1/2 z-20 -translate-y-1/2 p-3 text-white transition-colors duration-300 hover:text-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} strokeWidth={0.8} />
                </button>
              </>
            )}

            <div
              className={`absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[0.3em] font-light tabular-nums ${
                isMobileLandscape ? 'text-white/60' : 'text-slate-400'
              }`}
            >
              {mobileLightbox.index + 1} - {mobileLightbox.images.length}
            </div>
          </div>

          <div
            className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none ${
              isMobileLandscape ? 'p-0' : 'px-4'
            }`}
          >
            <div
              className={`pointer-events-auto relative overflow-hidden ${
                isMobileLandscape
                  ? 'w-full h-full shadow-none'
                  : 'shadow-2xl shadow-slate-900/10'
              }`}
              onTouchStart={handleMobileLightboxTouchStart}
              onTouchEnd={handleMobileLightboxTouchEnd}
            >
              {!isMobileLandscape && (
                <button
                  type="button"
                  onClick={closeMobileLightbox}
                  className="absolute top-4 right-4 z-30 flex p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all"
                  aria-label={`Close ${(mobileLightboxImage.altLabel ?? 'gallery image').toLowerCase()}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                  </svg>
                </button>
              )}

              <div
                className={isMobileLandscape ? 'w-full h-full' : undefined}
                style={{ transformOrigin: 'center' }}
              >
                <AdvancedImage
                  cldImg={mobileLightboxImage.cldImg}
                  className={
                    isMobileLandscape
                      ? 'block w-full h-full max-w-none max-h-none object-contain'
                      : 'block max-w-[92vw] max-h-[80vh] object-contain'
                  }
                  alt={
                    mobileLightboxImage.altText
                    ?? `${mobileLightboxImage.altLabel ?? 'Gallery'} photo ${mobileLightbox.index + 1} of ${mobileLightbox.images.length}`
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default Home;
