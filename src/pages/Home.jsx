import { Link } from 'react-router-dom';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';
import { limitFit } from '@cloudinary/url-gen/actions/resize';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { supabase } from '../utils/supabase';
import ScrollBookingReveal from '../components/ScrollBookingReveal';
import { animate, createTimeline } from 'animejs';
import { ReviewsGrid } from './Booking';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HERO_IMAGE_IDS = [
  'AF1I0729_catszb',
  '2021-12-01_fj6dqk',
  'Image_1_iz7lk8',
  'AF1I1454_vcc77d',
  '3P4A1455_ctp4pj',
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

const WEDDING_2_IMAGE_IDS = [
  '0006__DSC3027-topaz-denoise-denoise_DxO_tpqmmc',
  '0007__DSC3049-topaz-denoise-denoise_DxO_vh2j4m',
  '0010__DSC3081-topaz-denoise-denoise_DxO_rzb2jn',
  '0009__DSC3078-topaz-denoise-denoise_DxO_jsffaf',
  '0011__DSC3102-topaz-denoise-denoise_DxO_gisjew',
  '0008__DSC3059-topaz-denoise-denoise_DxO_mtpjqi',
  '0005__DSC2794-topaz-denoise-denoise_DxO_sltnnl',
  '0004__DSC2449-topaz-denoise-denoise_DxO_eo1qcp',
  '0002__DSC1411-topaz-denoise-denoise_DxO_lmkid4',
  '0013__DSC3294-topaz-denoise-denoise_DxO_qtfe5a',
  '0012__DSC3116-topaz-denoise-denoise_DxO_zgyczx',
  '0015__DSC4440-topaz-denoise-denoise_DxO_diayrl',
  '0003__DSC1682-topaz-denoise-denoise_DxO_dqeobu',
  '0001__DSC0749-topaz-denoise-denoise_DxO_rv1pwc',
  '0014__DSC3296-topaz-denoise-denoise_DxO_sot3ul',
  '0016__DSC4459-topaz-denoise-denoise_DxO_cjqihn',
];

const WEDDING_3_IMAGE_IDS = [
  'Neeshay_White_Select_Edits_-008_ldxv2v',
  'Neeshay_White_Select_Edits_-003_shgp50',
  'Neeshay_White_Select_Edits_-006_yhjwc1',
  'Neeshay_White_Select_Edits_-001_lge9tl',
];

const ASSORTED_IMAGE_IDS = [
  'AF1I2242-Edit-2_cor6p9',
  'AF1I7015_2_hp56wr',
  '3P4A3745_otnq3g',
  'center_city_ag1h8b',
];

const STACK_OFFSET_DESKTOP_X = 44;
const STACK_OFFSET_DESKTOP_Y = 32;
const STACK_OFFSET_MOBILE_X = 24;
const STACK_OFFSET_MOBILE_Y = 16;
const STACK_COUNT = 3;
const CARD_SHADOWS = ['none', 'none', 'none'];
const LIGHTBOX_RADIUS_PX = 0;

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
  const [hiLoaded, setHiLoaded] = useState(false);
  const [hiError, setHiError] = useState(false);

  const placeholderSrc = useMemo(
    () => buildPlaceholderUrl(publicId, placeholderWidth),
    [publicId, placeholderWidth]
  );

  const handleHiLoad = useCallback((e) => {
    const el = e.currentTarget;
    if (typeof el?.decode === 'function') {
      el.decode().then(
        () => setHiLoaded(true),
        () => setHiLoaded(true)
      );
      return;
    }
    setHiLoaded(true);
  }, []);

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
      gsap.set(node, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: node,
        start: 'top 93%',
        once: true,
        onEnter: () => {
          gsap.to(node, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform',
          });
        },
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
      gsap.set(items, { opacity: 0, y: 30 });

      ScrollTrigger.batch(items, {
        start: 'top 93%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            overwrite: true,
            clearProps: 'transform',
          });
        },
      });
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
  const [viewportWidth, setViewportWidth] = useState(() =>
    (typeof window === 'undefined' ? 1440 : window.innerWidth)
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    (typeof window === 'undefined' ? 900 : window.innerHeight)
  );

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
    if (!renderFeatured) return [];
    return WEDDING_2_IMAGE_IDS.map((publicId) => ({
      id: `${publicId}-mh`,
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured, isMobileLandscape]);

  const wedding1Images = useMemo(() => {
    if (!renderFeatured) return [];
    return WEDDING_1_IMAGE_IDS.map((publicId) => ({
      id: publicId,
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured, isMobileLandscape]);

  const wedding3Images = useMemo(() => {
    if (!renderFeatured) return [];
    return WEDDING_3_IMAGE_IDS.map((publicId) => ({
      id: publicId,
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured, isMobileLandscape]);

  const assortedImages = useMemo(() => {
    if (!renderSelected) return [];
    return ASSORTED_IMAGE_IDS.map((publicId, i) => ({
      id: `as-${i + 1}`,
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: isMobileLandscape ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-6 lg:col-span-3',
    }));
  }, [renderSelected, isMobileLandscape]);

  useEffect(() => {
    visibleSetRef.current = visibleSet;
  }, [visibleSet]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (!isMobileStack) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync UI with media query
      setShowStickyReachOut(false);
      return undefined;
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

  const [lightbox, setLightbox] = useState(null);
  const lightboxSourceRef = useRef(null);
  const lightboxImageWrapRef = useRef(null);
  const lightboxImageInnerRef = useRef(null);
  const lightboxBackdropRef = useRef(null);
  const lightboxControlsRef = useRef(null);
  const lightboxPhaseRef = useRef('idle');
  const lightboxOpenIdRef = useRef(null);
  const prevLightboxIndexRef = useRef(null);
  const navAnimRef = useRef(null);
  const touchStartRef = useRef(null);
  const lightboxNavRestoreTimerRef = useRef(null);
  const lightboxNavRestoreRafRef = useRef(null);
  const lightboxNavRestoreActiveRef = useRef(false);
  const lightboxScrollLockRef = useRef(null);
  const lightboxScrollRestoredRef = useRef(true);
  const lightboxOpenRadiusPx = isMobileLandscape ? 0 : LIGHTBOX_RADIUS_PX;
  const lightboxOpenRadius = `${lightboxOpenRadiusPx}px / ${lightboxOpenRadiusPx}px`;
  const lightboxSourceRadiusPx = LIGHTBOX_RADIUS_PX;

  const restoreLightboxScrollLock = useCallback(() => {
    if (lightboxScrollRestoredRef.current) return;

    const lock = lightboxScrollLockRef.current;
    if (!lock) {
      lightboxScrollRestoredRef.current = true;
      return;
    }

    const docEl = document.documentElement;
    const body = document.body;

    docEl.style.overflow = lock.prevOverflow ?? '';
    docEl.style.overscrollBehavior = lock.prevHtmlOverscrollBehavior ?? '';
    body.style.overflow = lock.prevBodyOverflow ?? '';
    body.style.paddingRight = lock.prevBodyPaddingRight ?? '';

    if (lock.isMobile) {
      body.style.position = lock.prevBodyPosition ?? '';
      body.style.top = lock.prevBodyTop ?? '';
      body.style.width = lock.prevBodyWidth ?? '';
      body.style.overscrollBehavior = lock.prevBodyOverscrollBehavior ?? '';
      window.scrollTo(0, lock.savedScrollY ?? 0);
    }

    lightboxScrollRestoredRef.current = true;
  }, []);

  const openLightbox = useCallback((images, index, e) => {
    if (lightboxPhaseRef.current !== 'idle') return;
    const outer = e.currentTarget;
    const inner = outer.querySelector('[data-gallery-card-inner]') || outer;
    lightboxSourceRef.current = inner;

    // Reset any hover-scale state so close lands seamlessly.
    outer.style.zIndex = '';
    gsap.killTweensOf(inner);
    gsap.set(inner, { scale: 1 });

    lightboxPhaseRef.current = 'opening';
    const openId = Date.now();
    lightboxOpenIdRef.current = openId;
    prevLightboxIndexRef.current = index;
    setLightbox({ images, index, openId });
  }, []);

  const closeLightbox = useCallback(() => {
    if (lightboxPhaseRef.current !== 'open') return;
    lightboxPhaseRef.current = 'closing';

    const lightboxEl = document.querySelector('[data-starling-lightbox]');
    if (lightboxEl) {
      lightboxEl.style.pointerEvents = 'none';
    }

    if (navAnimRef.current) {
      navAnimRef.current.revert();
      navAnimRef.current = null;
    }

    const imageWrap = lightboxImageWrapRef.current;
    const imageInner = lightboxImageInnerRef.current;
    const backdrop = lightboxBackdropRef.current;
    const controls = lightboxControlsRef.current;
    const sourceEl = lightboxSourceRef.current;

    if (imageWrap) imageWrap.style.willChange = '';

    if (!imageWrap || !backdrop) {
      setLightbox(null);
      lightboxPhaseRef.current = 'idle';
      return;
    }

    imageWrap.style.opacity = '1';
    imageWrap.style.borderRadius = lightboxOpenRadius;
    if (isMobileLandscape) {
      imageWrap.style.willChange = 'opacity, transform';
      if (imageInner) imageInner.style.willChange = '';

      const tl = createTimeline({
        onComplete: () => {
          imageWrap.style.willChange = '';
          if (imageInner) imageInner.style.willChange = '';
          setLightbox(null);
          lightboxPhaseRef.current = 'idle';
        },
      });

      if (controls) {
        tl.add(controls, { opacity: [1, 0], duration: 160, ease: 'outCubic' }, 0);
      }

      tl.add(
        imageWrap,
        { opacity: [1, 0], scale: [1, 0.985], duration: 320, ease: 'inOutCubic' },
        0,
      );
      tl.add(backdrop, { opacity: [1, 0], duration: 320, ease: 'inOutCubic' }, 0);
      return;
    }

    imageWrap.style.willChange = 'transform, border-radius, opacity';
    if (imageInner) imageInner.style.willChange = 'transform';

    const docEl = document.documentElement;
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const closeFlipDurationMs = isMobileStack ? 520 : 980;

    if (lightboxNavRestoreRafRef.current) {
      cancelAnimationFrame(lightboxNavRestoreRafRef.current);
      lightboxNavRestoreRafRef.current = null;
    }
    if (lightboxNavRestoreTimerRef.current) {
      clearTimeout(lightboxNavRestoreTimerRef.current);
      lightboxNavRestoreTimerRef.current = null;
    }

    const runNavRestore = () => {
      if (prefersReducedMotion) {
        lightboxNavRestoreActiveRef.current = false;
        docEl.removeAttribute('data-lightbox-open');
        docEl.removeAttribute('data-lightbox-restoring');
        docEl.style.removeProperty('--starling-lightbox-nav-restore-duration');
        return;
      }

      // Restore real scroll position first so ScrollTrigger-driven nav styling doesn't "snap".
      restoreLightboxScrollLock();

      const restoreDurationMs = isMobileStack ? closeFlipDurationMs : 980;
      docEl.style.setProperty('--starling-lightbox-nav-restore-duration', `${restoreDurationMs}ms`);
      docEl.setAttribute('data-lightbox-restoring', '');
      lightboxNavRestoreActiveRef.current = true;

      // Wait a frame so `scrollTo()` has taken effect, then start the nav fade-in.
      lightboxNavRestoreRafRef.current = requestAnimationFrame(() => {
        lightboxNavRestoreRafRef.current = null;
        try {
          ScrollTrigger.update();
        } catch {
          // no-op
        }

        docEl.removeAttribute('data-lightbox-open');

        lightboxNavRestoreTimerRef.current = window.setTimeout(() => {
          document.documentElement.removeAttribute('data-lightbox-restoring');
          document.documentElement.style.removeProperty('--starling-lightbox-nav-restore-duration');
          lightboxNavRestoreTimerRef.current = null;
          lightboxNavRestoreActiveRef.current = false;
        }, restoreDurationMs + 160);
      });
    };

    runNavRestore();

    const sourceRect = sourceEl?.getBoundingClientRect();
    const currentRect = imageWrap.getBoundingClientRect();

    const tl = createTimeline({
      onComplete: () => {
        imageWrap.style.willChange = '';
        if (imageInner) imageInner.style.willChange = '';
        setLightbox(null);
        lightboxPhaseRef.current = 'idle';
      },
    });

    if (controls) {
      tl.add(controls, { opacity: [1, 0], duration: 240, ease: 'outCubic' }, 0);
    }

    if (sourceRect && sourceRect.width > 0 && currentRect.width > 0) {
      const deltaX =
        sourceRect.left + sourceRect.width / 2 - (currentRect.left + currentRect.width / 2);
      const deltaY =
        sourceRect.top + sourceRect.height / 2 - (currentRect.top + currentRect.height / 2);
      const scaleX = sourceRect.width / currentRect.width;
      const scaleY = sourceRect.height / currentRect.height;
      const coverScale = Math.max(scaleX, scaleY);
      const innerScaleX = coverScale / scaleX;
      const innerScaleY = coverScale / scaleY;
      const radiusTo = `${(lightboxSourceRadiusPx / scaleX).toFixed(3)}px / ${(
        lightboxSourceRadiusPx / scaleY
      ).toFixed(3)}px`;
      const opacityEase = isMobileStack ? 'inCubic' : 'outQuad';
      const backdropEase = isMobileStack ? 'inCubic' : 'inOutCubic';
      const backdropDuration = isMobileStack ? closeFlipDurationMs : 900;

      tl.add(
        imageWrap,
        {
          translateX: [0, deltaX],
          translateY: [0, deltaY],
          scaleX: [1, scaleX],
          scaleY: [1, scaleY],
          borderRadius: [lightboxOpenRadius, radiusTo],
          duration: isMobileStack ? closeFlipDurationMs : 980,
          ease: 'inOutCubic',
        },
        0,
      );

      tl.add(
        imageWrap,
        {
          opacity: [1, 0],
          duration: isMobileStack ? closeFlipDurationMs : 420,
          ease: opacityEase,
        },
        0,
      );

      if (imageInner) {
        tl.add(
          imageInner,
          {
            scaleX: [1, innerScaleX],
            scaleY: [1, innerScaleY],
            duration: isMobileStack ? closeFlipDurationMs : 980,
            ease: 'inOutCubic',
          },
          0,
        );
      }

      tl.add(
        backdrop,
        {
          opacity: [1, 0],
          duration: backdropDuration,
          ease: backdropEase,
        },
        isMobileStack ? 0 : 80,
      );
    } else {
      tl.add(imageWrap, {
        opacity: [1, 0],
        scale: [1, 0.94],
        duration: isMobileStack ? closeFlipDurationMs : 620,
        ease: 'inOutCubic',
      }, 0);
      tl.add(backdrop, {
        opacity: [1, 0],
        duration: isMobileStack ? closeFlipDurationMs : 620,
        ease: isMobileStack ? 'inCubic' : 'inOutCubic',
      }, 0);
    }
  }, [isMobileLandscape, isMobileStack, lightboxOpenRadius, lightboxSourceRadiusPx, restoreLightboxScrollLock]);

  const navigateLightbox = useCallback((dir) => {
    if (lightboxPhaseRef.current !== 'open') return;
    setLightbox(prev => {
      if (!prev) return null;
      const newIndex = (prev.index + dir + prev.images.length) % prev.images.length;
      return { ...prev, index: newIndex };
    });
  }, []);

  const handleCardEnter = useCallback((e) => {
    const outer = e.currentTarget;
    const inner =
      outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;

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

  const lightboxSessionId = lightbox?.openId ?? null;
  const lightboxIndex = lightbox?.index ?? 0;
  const lightboxImages = lightbox?.images ?? null;

  useEffect(() => {
    if (!lightboxSessionId) return;

    if (lightboxNavRestoreRafRef.current) {
      cancelAnimationFrame(lightboxNavRestoreRafRef.current);
      lightboxNavRestoreRafRef.current = null;
    }
    if (lightboxNavRestoreTimerRef.current) {
      clearTimeout(lightboxNavRestoreTimerRef.current);
      lightboxNavRestoreTimerRef.current = null;
    }
    lightboxNavRestoreActiveRef.current = false;
    lightboxScrollRestoredRef.current = true;
    lightboxScrollLockRef.current = null;

    const docEl = document.documentElement;
    docEl.style.setProperty(
      '--starling-lightbox-nav-open-duration',
      `${isMobileLandscape ? 420 : 1050}ms`,
    );
    docEl.removeAttribute('data-lightbox-restoring');
    docEl.style.removeProperty('--starling-lightbox-nav-restore-duration');
    docEl.setAttribute('data-lightbox-open', '');

    const body = document.body;
    const prevOverflow = docEl.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const prevBodyOverscrollBehavior = body.style.overscrollBehavior;
    const prevHtmlOverscrollBehavior = docEl.style.overscrollBehavior;
    const scrollBarGap = window.innerWidth - docEl.clientWidth;

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const savedScrollY = window.scrollY;
    if (isMobile) {
      lightboxScrollRestoredRef.current = false;
      lightboxScrollLockRef.current = {
        isMobile,
        savedScrollY,
        prevOverflow,
        prevBodyOverflow,
        prevBodyPaddingRight,
        prevBodyPosition,
        prevBodyTop,
        prevBodyWidth,
        prevBodyOverscrollBehavior,
        prevHtmlOverscrollBehavior,
      };

      docEl.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${savedScrollY}px`;
      body.style.width = '100%';
      body.style.overscrollBehavior = 'none';
      docEl.style.overscrollBehavior = 'none';
      if (scrollBarGap > 0) {
        body.style.paddingRight = `${scrollBarGap}px`;
      }
    } else {
      lightboxScrollLockRef.current = {
        isMobile,
        savedScrollY,
        prevOverflow,
        prevBodyOverflow,
        prevBodyPaddingRight,
        prevBodyPosition,
        prevBodyTop,
        prevBodyWidth,
        prevBodyOverscrollBehavior,
        prevHtmlOverscrollBehavior,
      };
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handleKey);

    const SWIPE_THRESHOLD = 50;
    const handleTouchStart = (e) => {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
    };
    const handleTouchEnd = (e) => {
      if (!touchStartRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      touchStartRef.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;
      navigateLightbox(dx < 0 ? 1 : -1);
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);

      const prefersReducedMotion =
        window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

      if (prefersReducedMotion) {
        if (lightboxNavRestoreRafRef.current) {
          cancelAnimationFrame(lightboxNavRestoreRafRef.current);
          lightboxNavRestoreRafRef.current = null;
        }
        if (lightboxNavRestoreTimerRef.current) {
          clearTimeout(lightboxNavRestoreTimerRef.current);
          lightboxNavRestoreTimerRef.current = null;
        }
        lightboxNavRestoreActiveRef.current = false;
        docEl.style.removeProperty('--starling-lightbox-nav-open-duration');
        docEl.style.removeProperty('--starling-lightbox-nav-restore-duration');
        restoreLightboxScrollLock();
        lightboxScrollLockRef.current = null;
        docEl.removeAttribute('data-lightbox-open');
        docEl.removeAttribute('data-lightbox-restoring');
        return;
      }

      // If we're not already mid-restore (normal close), just hard-reset attributes.
      if (!lightboxNavRestoreActiveRef.current) {
        docEl.removeAttribute('data-lightbox-open');
        docEl.removeAttribute('data-lightbox-restoring');
        docEl.style.removeProperty('--starling-lightbox-nav-restore-duration');
      }

      docEl.style.removeProperty('--starling-lightbox-nav-open-duration');
      restoreLightboxScrollLock();
      lightboxScrollLockRef.current = null;
    };
  }, [isMobileLandscape, lightboxSessionId, closeLightbox, navigateLightbox, restoreLightboxScrollLock]);

  useEffect(() => {
    if (!lightboxSessionId || !lightboxImages || lightboxImages.length < 2) return;

    const total = lightboxImages.length;
    const next = lightboxImages[(lightboxIndex + 1) % total];
    const prev = lightboxImages[(lightboxIndex - 1 + total) % total];
    const urls = [next, prev]
      .map((img) => img?.cldImg?.toURL?.())
      .filter((url) => typeof url === 'string' && url.length > 0);

    const preload = () => {
      for (const url of urls) {
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
        img.decode?.().catch(() => {});
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(preload, { timeout: 1200 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(preload, 150);
    return () => window.clearTimeout(timeoutId);
  }, [lightboxIndex, lightboxImages, lightboxSessionId]);

  useEffect(() => {
    if (!lightbox?.openId || lightboxPhaseRef.current !== 'opening') return;

    const runFlip = () => {
      const imageWrap = lightboxImageWrapRef.current;
      const imageInner = lightboxImageInnerRef.current;
      const backdrop = lightboxBackdropRef.current;
      const controls = lightboxControlsRef.current;
      const sourceEl = lightboxSourceRef.current;

      if (!imageWrap || !backdrop) {
        lightboxPhaseRef.current = 'open';
        return;
      }

      backdrop.style.opacity = '0';
      if (controls) controls.style.opacity = '0';

      if (isMobileLandscape) {
        imageWrap.style.opacity = '0';
        imageWrap.style.transform = '';
        imageWrap.style.borderRadius = lightboxOpenRadius;
        imageWrap.style.willChange = 'opacity, transform';
        if (imageInner) {
          imageInner.style.transform = '';
          imageInner.style.willChange = '';
        }

        const tl = createTimeline({
          onComplete: () => {
            imageWrap.style.willChange = '';
            lightboxPhaseRef.current = 'open';
          },
        });

        tl.add(backdrop, { opacity: [0, 1], duration: 240, ease: 'outCubic' }, 0);
        tl.add(imageWrap, { opacity: [0, 1], scale: [0.985, 1], duration: 420, ease: 'outQuint' }, 0);
        if (controls) tl.add(controls, { opacity: [0, 1], duration: 260, ease: 'outCubic' }, 180);
        return;
      }

      const sourceRect = sourceEl?.getBoundingClientRect();
      const finalRect = imageWrap.getBoundingClientRect();

      if (!sourceRect || finalRect.width === 0 || finalRect.height === 0) {
        imageWrap.style.opacity = '0';
        if (imageInner) imageInner.style.transform = '';
        const tl = createTimeline({
          onComplete: () => { lightboxPhaseRef.current = 'open'; },
        });
        tl.add(backdrop, { opacity: [0, 1], duration: isMobileStack ? 280 : 820, ease: 'outCubic' }, 0);
        tl.add(imageWrap, { opacity: [0, 1], scale: [0.94, 1], duration: 980, ease: 'outQuint' }, 0);
        if (controls) tl.add(controls, { opacity: [0, 1], duration: 520, ease: 'outCubic' }, 420);
        return;
      }

      const deltaX = sourceRect.left + sourceRect.width / 2 - (finalRect.left + finalRect.width / 2);
      const deltaY = sourceRect.top + sourceRect.height / 2 - (finalRect.top + finalRect.height / 2);
      const scaleX = sourceRect.width / finalRect.width;
      const scaleY = sourceRect.height / finalRect.height;
      const coverScale = Math.max(scaleX, scaleY);
      const innerScaleX = coverScale / scaleX;
      const innerScaleY = coverScale / scaleY;
      const radiusFrom = `${(lightboxSourceRadiusPx / scaleX).toFixed(3)}px / ${(
        lightboxSourceRadiusPx / scaleY
      ).toFixed(3)}px`;

      imageWrap.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) scaleX(${scaleX}) scaleY(${scaleY})`;
      imageWrap.style.borderRadius = radiusFrom;
      if (imageInner) {
        imageInner.style.transform = `scaleX(${innerScaleX}) scaleY(${innerScaleY})`;
      }
      imageWrap.style.opacity = '1';
      imageWrap.style.willChange = 'transform, border-radius';
      if (imageInner) imageInner.style.willChange = 'transform';

      const tl = createTimeline({
        onComplete: () => {
          imageWrap.style.willChange = '';
          if (imageInner) imageInner.style.willChange = '';
          lightboxPhaseRef.current = 'open';
        },
      });

      tl.add(backdrop, {
        opacity: [0, 1],
        duration: isMobileStack ? 280 : 820,
        ease: 'outCubic',
      }, 0);

      tl.add(imageWrap, {
        translateX: [deltaX, 0],
        translateY: [deltaY, 0],
        scaleX: [scaleX, 1],
        scaleY: [scaleY, 1],
        borderRadius: [radiusFrom, lightboxOpenRadius],
        duration: 1050,
        ease: 'outQuint',
      }, 0);

      if (imageInner) {
        tl.add(imageInner, {
          scaleX: [innerScaleX, 1],
          scaleY: [innerScaleY, 1],
          duration: 1050,
          ease: 'outQuint',
        }, 0);
      }

      if (controls) {
        tl.add(controls, {
          opacity: [0, 1],
          duration: 520,
          ease: 'outCubic',
        }, 480);
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(runFlip));
  }, [isMobileLandscape, isMobileStack, lightbox?.openId, lightboxOpenRadius, lightboxSourceRadiusPx]);

  useEffect(() => {
    if (!lightbox || lightboxPhaseRef.current !== 'open') return;
    const imageWrap = lightboxImageWrapRef.current;
    if (!imageWrap) return;
    imageWrap.style.borderRadius = lightboxOpenRadius;
  }, [isMobileLandscape, lightbox, lightbox?.openId, lightboxOpenRadius]);

  useEffect(() => {
    if (!lightbox) {
      prevLightboxIndexRef.current = null;
      return;
    }
    if (lightboxPhaseRef.current !== 'open') {
      prevLightboxIndexRef.current = lightbox.index;
      return;
    }

    const prevIdx = prevLightboxIndexRef.current;
    prevLightboxIndexRef.current = lightbox.index;
    if (prevIdx === null || prevIdx === lightbox.index) return;

    const imageWrap = lightboxImageWrapRef.current;
    if (!imageWrap) return;

    const total = lightbox.images.length;
    const fwd = (lightbox.index - prevIdx + total) % total;
    const dir = fwd <= total / 2 ? 1 : -1;

    imageWrap.style.willChange = 'opacity, transform';
    navAnimRef.current = animate(imageWrap, {
      opacity: [0, 1],
      translateX: [40 * dir, 0],
      duration: 400,
      ease: 'outQuint',
      onComplete: () => {
        imageWrap.style.willChange = '';
      },
    });
  }, [lightbox, lightbox?.index, lightbox?.openId]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const scopeEl = container.current;
    const introItems = gsap.utils
      .toArray('.hero-intro-item', scopeEl || undefined)
      .filter((el) => el instanceof HTMLElement)
      .filter((el) => window.getComputedStyle(el).display !== 'none');

    if (!introItems.length) {
      setEntranceDone(true);
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(introItems, { opacity: 1, y: 0, clearProps: 'transform' });
      setEntranceDone(true);
      return;
    }

    // Unified "fade up + in" intro for hero (no per-card fan-out).
    gsap.fromTo(
      introItems,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform',
        onComplete: () => setEntranceDone(true),
      },
    );

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

  return (
    <div ref={container} className="relative w-full">
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
              className="hero-text-col contents md:z-20 md:flex md:flex-col md:justify-start md:items-center md:absolute md:-left-[80px] md:top-1/2 md:-translate-y-1/2 md:w-[604px] md:h-[318px] md:bg-white/[0.97] md:rounded-[22px] md:px-[42px] md:pt-[17px] md:pb-[47px]"
            >
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
                <h1 className="hero-intro-item order-1 md:order-none font-serif uppercase md:normal-case text-[44px] md:text-[54px] lg:text-[62px] text-[#18181B] leading-[1.15] md:leading-[1.02] tracking-normal mb-6 md:mb-5">
                  <div className="hero-text-line whitespace-nowrap">Unscripted Moments.</div>
                  <div className="hero-text-line whitespace-nowrap">Unforgettable Memories.</div>
                </h1>
                <div className="order-3 md:order-none w-full max-w-[386px] mx-auto md:flex md:flex-col md:flex-1">
                  <p className="hero-intro-item hero-desc text-[#6B6B76] font-light text-[13px] leading-[1.5] md:leading-[1.5] mb-8 md:mb-5">
                    Premium photography for weddings, editorials, and lifestyle. Based in Philadelphia and NYC, traveling worldwide.
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
          
            {/* Staggered Image Stack */}
            <div className="hero-stack-col hero-intro-item w-full order-2 md:ml-auto md:mr-[-24px] md:w-[900px] flex items-center justify-end relative group md:py-16">
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
                        alt={`Starling Photography ${imgIdx + 1}`}
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

      {/* Featured Galleries / Recent Work */}
      <section
        id="home-featured"
        ref={featuredRef}
        data-nav-dark
        className="px-3 md:px-12 max-w-7xl mx-auto py-12 border-t border-slate-100 min-h-[50vh]"
      >
        <div className="flex justify-between items-end mb-8">
          {/* <h2 className="text-2xl font-light tracking-wide text-slate-900">Recent Stories</h2> */}
        </div>

        {renderFeatured ? (
          <div className="space-y-28 md:space-y-20">
            {/* Gallery 2 - Makayla and Hunter */}
            <div>
              <div ref={wedding2HeaderRef} className="mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-2 md:mb-3">Makayla and Hunter</h3>
                <p className="text-[10px] md:text-[11px] text-slate-400 font-serif uppercase tracking-widest whitespace-normal break-words max-w-full">
                  Glasbern - A Historic Hotel of America • Summer 2025
                </p>
              </div>
              <div
                ref={wedding2GridRef}
                className="home-gallery-grid group/gallery grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-8 items-start"
              >
                {wedding2Images.map((img, i) => (
                  <div 
                    key={img.id} 
                    className={`home-gallery-card relative group cursor-pointer rounded-[4px] md:rounded-[8px] transition-[filter] duration-500 group-hover/gallery:brightness-[0.85] hover:!brightness-100 ${img.className}`} 
                    onClick={(e) => openLightbox(wedding2Images, i, e)}
                    onMouseEnter={handleCardEnter}
                    onMouseLeave={handleCardLeave}
                  >
                    <div
                      data-gallery-card-inner="true"
                      className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[4px] md:rounded-[8px] shadow-xl shadow-slate-200/50`}
                    >
                      <ProgressiveCldImage
                        publicId={img.publicId}
                        cldImg={img.cldImg}
                        alt={`Makayla and Hunter photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        imgClassName="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery 1 */}
            <div>
              <div ref={wedding1HeaderRef} className="mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-2 md:mb-3">Molly and Brandon</h3>
                <p className="text-[10px] md:text-[11px] text-slate-400 font-serif uppercase tracking-widest whitespace-normal break-words max-w-full">
                  Green Lane, Pennsylvania • Summer 2025
                </p>
              </div>
              <div
                ref={wedding1GridRef}
                className="home-gallery-grid group/gallery grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-8 items-start"
              >
                {wedding1Images.map((img, i) => (
                  <div 
                    key={img.id} 
                    className={`home-gallery-card relative group cursor-pointer rounded-[4px] md:rounded-[8px] transition-[filter] duration-500 group-hover/gallery:brightness-[0.85] hover:!brightness-100 ${img.className}`} 
                    onClick={(e) => openLightbox(wedding1Images, i, e)}
                    onMouseEnter={handleCardEnter}
                    onMouseLeave={handleCardLeave}
                  >
                    <div
                      data-gallery-card-inner="true"
                      className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[4px] md:rounded-[8px] shadow-xl shadow-slate-200/50`}
                    >
                      <ProgressiveCldImage
                        publicId={img.publicId}
                        cldImg={img.cldImg}
                        alt={`Molly and Brandon photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        imgClassName="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery 3 - Neeshay */}
            <div>
              <div ref={wedding3HeaderRef} className="mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-2 md:mb-3">Neeshay White</h3>
                <p className="text-[10px] md:text-[11px] text-slate-400 font-serif uppercase tracking-widest whitespace-normal break-words max-w-full">
                  Ardmore, Pennsylvania
                </p>
              </div>
              <div
                ref={wedding3GridRef}
                className="home-gallery-grid group/gallery grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-8 items-start"
              >
                {wedding3Images.map((img, i) => (
                  <div 
                    key={img.id} 
                    className={`home-gallery-card relative group cursor-pointer rounded-[4px] md:rounded-[8px] transition-[filter] duration-500 group-hover/gallery:brightness-[0.85] hover:!brightness-100 ${img.className}`} 
                    onClick={(e) => openLightbox(wedding3Images, i, e)}
                    onMouseEnter={handleCardEnter}
                    onMouseLeave={handleCardLeave}
                  >
                    <div
                      data-gallery-card-inner="true"
                      className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[4px] md:rounded-[8px] shadow-xl shadow-slate-200/50`}
                    >
                      <ProgressiveCldImage
                        publicId={img.publicId}
                        cldImg={img.cldImg}
                        alt={`Neeshay photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        imgClassName="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[40vh] md:h-[45vh]" aria-hidden="true" />
        )}
      </section>

      {/* Assorted / Selected Work */}
      <section
        id="home-selected"
        ref={selectedRef}
        data-nav-dark
        className="px-3 md:px-12 max-w-7xl mx-auto pt-4 pb-20"
      >
        <div ref={selectedDividerRef} className="flex items-center gap-6 mb-10">
          <div className="flex-1 h-px bg-slate-200" />
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">Selected Work</h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {renderSelected ? (
          <div
            ref={assortedGridRef}
            className="home-gallery-grid group/gallery grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-8 items-start"
          >
            {assortedImages.map((img, i) => (
              <div 
                key={img.id} 
                className={`home-gallery-card relative group cursor-pointer rounded-[4px] md:rounded-[8px] transition-[filter] duration-500 group-hover/gallery:brightness-[0.85] hover:!brightness-100 ${img.className}`} 
                onClick={(e) => openLightbox(assortedImages, i, e)}
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
              >
                <div
                  data-gallery-card-inner="true"
                  className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[4px] md:rounded-[8px] shadow-xl shadow-slate-200/50`}
                >
                  <ProgressiveCldImage
                    publicId={img.publicId}
                    cldImg={img.cldImg}
                    alt={`Selected Work photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    imgClassName="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[22vh] md:h-[28vh]" aria-hidden="true" />
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

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 lg:z-[45]" data-starling-lightbox>
          <div
            ref={lightboxBackdropRef}
            className={`absolute inset-0 ${
              isMobileLandscape
                ? 'bg-black'
                : isMobileStack
                  ? 'bg-black/40 backdrop-blur-sm'
                  : 'bg-transparent'
            }`}
            onClick={closeLightbox}
            style={{ opacity: 0 }}
          />

          <div ref={lightboxControlsRef} style={{ opacity: 0 }}>
            <button
              onClick={closeLightbox}
              style={
                isMobileLandscape
                  ? {
                      top: 'calc(env(safe-area-inset-top) + 12px)',
                      right: 'calc(env(safe-area-inset-right) + 12px)',
                    }
                  : undefined
              }
              className={`absolute z-20 p-2 transition-colors duration-300 ${
                isMobileLandscape
                  ? 'w-12 h-12 p-0 flex items-center justify-center bg-transparent text-white hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]'
                  : 'hidden'
              }`}
              aria-label="Close"
            >
              <X size={isMobileLandscape ? 28 : 18} strokeWidth={isMobileLandscape ? 1.75 : 1.5} />
            </button>

            {lightbox.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox(-1)}
                  className={`absolute z-20 p-3 transition-colors duration-300 ${
                    isMobileLandscape
                      ? 'left-3 top-1/2 -translate-y-1/2 text-white hover:text-white'
                      : 'hidden md:block left-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700'
                  }`}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={isMobileLandscape ? 24 : 72} strokeWidth={0.8} />
                </button>
                <button
                  onClick={() => navigateLightbox(1)}
                  className={`absolute z-20 p-3 transition-colors duration-300 ${
                    isMobileLandscape
                      ? 'right-3 top-1/2 -translate-y-1/2 text-white hover:text-white'
                      : 'hidden md:block right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700'
                  }`}
                  aria-label="Next image"
                >
                  <ChevronRight size={isMobileLandscape ? 24 : 72} strokeWidth={0.8} />
                </button>
              </>
            )}

            <div
              className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-[0.3em] font-light tabular-nums ${
                isMobileLandscape ? 'text-white/60' : 'text-slate-400'
              }`}
            >
              {lightbox.index + 1} — {lightbox.images.length}
            </div>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none ${
              isMobileLandscape ? 'p-0' : 'px-4 md:px-16'
            }`}
          >
            <div
              ref={lightboxImageWrapRef}
              className={`pointer-events-auto relative overflow-hidden ${
                isMobileLandscape
                  ? 'w-full h-full shadow-none'
                  : 'shadow-2xl shadow-slate-900/10'
              }`}
              style={{
                transformOrigin: 'center',
                borderRadius: '0px',
                opacity: 0,
              }}
            >
              <button
                type="button"
                onClick={closeLightbox}
                className={`${isMobileLandscape ? 'hidden' : 'flex'} absolute top-4 right-4 z-30 p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all`}
                aria-label="Close"
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
              <div
                ref={lightboxImageInnerRef}
                className={isMobileLandscape ? 'w-full h-full' : undefined}
                style={{ transformOrigin: 'center' }}
              >
                <AdvancedImage
                  cldImg={lightbox.images[lightbox.index].cldImg}
                  className={
                    isMobileLandscape
                      ? 'block w-full h-full max-w-none max-h-none object-contain'
                      : 'block max-w-[92vw] md:max-w-[85vw] lg:max-w-[920px] max-h-[80vh] lg:max-h-[72vh] object-contain'
                  }
                  alt={`Photo ${lightbox.index + 1} of ${lightbox.images.length}`}
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
