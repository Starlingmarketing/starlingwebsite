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

const WEDDING_1_IMAGE_IDS = [
  'Molly_Fleming_Additional_Edits_-0001_dcp3mi',
  'Molly_Fleming_Select_Edits_-023_kesq95',
  'Molly_Fleming_Select_Edits_-013_madlt2',
  'Molly_Fleming_Select_Edits_-015_oki1n0',
  'Molly_Fleming_Additional_Edits_-0192_ghi9rs',
  'Molly_Fleming_Additional_Edits_-0199_mdyby1',
  'Molly_Fleming_Select_Edits_-005_dedene',
  'Molly_Fleming_Additional_Edits_-0149_jbt3yz',
  'Molly_Fleming_Additional_Edits_-0115_rs0fgh',
  'Molly_Fleming_Additional_Edits_-0130_cbdtdm',
  'Molly_Fleming_Select_Edits_-016_yapfgd',
  'Molly_Fleming_Additional_Edits_-0037_ns4q15',
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

const ASSORTED_IMAGE_IDS = [
  'AF1I2242-Edit-2_cor6p9',
  'AF1I7015_2_hp56wr',
  '3P4A3745_otnq3g',
  'center_city_ag1h8b',
];

const STACK_OFFSET_X = 56;
const STACK_OFFSET_Y = 38;
const STACK_COUNT = 3;
const CARD_SHADOWS = ['none', 'none', 'none'];

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

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isClosingQuoteModal, setIsClosingQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ phone: '' });
  const [quoteStatus, setQuoteStatus] = useState('idle');

  const closeQuoteModal = useCallback((isSlow = false) => {
    setIsClosingQuoteModal(isSlow ? 'slow' : 'fast');
    setTimeout(() => {
      setShowQuoteModal(false);
      setQuoteStatus('idle');
      setQuoteForm({ phone: '' });
      setIsClosingQuoteModal(false);
    }, isSlow ? 1500 : 350);
  }, []);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteStatus('sending');
    
    emailjs
      .send(
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
      )
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
  const hasInitialized = useRef(false);

  const container = useRef(null);
  const bookingRevealRef = useRef(null);
  const reviewsBackdropRef = useRef(null);
  const reviewsSectionRef = useRef(null);
  const reviewsContentRef = useRef(null);
  const [featuredRef, renderFeatured] = useSectionMount();
  const [selectedRef, renderSelected] = useSectionMount();

  const wedding2GridRef = useStaggerReveal(renderFeatured);
  const wedding1GridRef = useStaggerReveal(renderFeatured);
  const assortedGridRef = useStaggerReveal(renderSelected);

  const wedding2HeaderRef = useReveal(renderFeatured);
  const wedding1HeaderRef = useReveal(renderFeatured);
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
      className: 'col-span-12 md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured]);

  const wedding1Images = useMemo(() => {
    if (!renderFeatured) return [];
    return WEDDING_1_IMAGE_IDS.map((publicId) => ({
      id: publicId,
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: 'col-span-12 md:col-span-6 lg:col-span-3',
    }));
  }, [renderFeatured]);

  const assortedImages = useMemo(() => {
    if (!renderSelected) return [];
    return ASSORTED_IMAGE_IDS.map((publicId, i) => ({
      id: `as-${i + 1}`,
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: 'aspect-[4/3]',
      className: 'col-span-12 md:col-span-6 lg:col-span-3',
    }));
  }, [renderSelected]);

  useEffect(() => {
    visibleSetRef.current = visibleSet;
  }, [visibleSet]);

  useEffect(() => {
    const t = setTimeout(() => { hasInitialized.current = true; }, 2000);
    return () => clearTimeout(t);
  }, []);

  const advanceStack = useCallback(() => {
    setDepartingIdx(visibleSetRef.current[0]);
    setVisibleSet(prev => [prev[1], prev[2], (prev[2] + 1) % heroImages.length]);
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

  const openLightbox = useCallback((images, index) => {
    setLightbox({ images, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const navigateLightbox = useCallback((dir) => {
    setLightbox(prev => {
      if (!prev) return null;
      return { ...prev, index: (prev.index + dir + prev.images.length) % prev.images.length };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightbox, closeLightbox, navigateLightbox]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // Initial states
    gsap.set('.hero-eyebrow', { y: 20, opacity: 0 });
    gsap.set('.hero-text-line', { y: 32, opacity: 0 });
    gsap.set('.hero-desc', { y: 16, opacity: 0 });
    gsap.set('.hero-link', { y: 10, opacity: 0 });
    gsap.set('.hero-stack-wrapper', { opacity: 0, y: 28 });

    if (prefersReducedMotion) {
      gsap.set('.hero-eyebrow', { y: 0, opacity: 1 });
      gsap.set('.hero-text-line', { y: 0, opacity: 1 });
      gsap.set('.hero-desc', { y: 0, opacity: 1 });
      gsap.set('.hero-link', { y: 0, opacity: 1 });
      gsap.set('.hero-stack-wrapper', { y: 0, opacity: 1 });
      return;
    }

    // Animation sequence
    // Text leads slightly; image follows for a cleaner, more natural pacing.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(
      '.hero-eyebrow',
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      0
    )
      .to(
        '.hero-text-line',
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      },
      0
    )
      .to(
        '.hero-desc',
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.32
      )
      .to(
        '.hero-link',
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        },
        0.48
      )
      .to(
        '.hero-stack-wrapper',
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
        0.18
      );

    const content = reviewsContentRef.current;
    const wrapper = reviewsSectionRef.current;
    if (content && wrapper && !prefersReducedMotion) {
      gsap.set(content, { opacity: 0 });

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
          },
        },
      });

      const cards = content.querySelectorAll('[data-review-card="true"]');
      if (cards.length) {
        gsap.set(cards, { opacity: 0.6 });
        ScrollTrigger.batch(cards, {
          start: 'top 92%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.06,
              overwrite: true,
            });
          },
          onEnterBack: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.04,
              overwrite: true,
            });
          },
        });
      }
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
        ref={reviewsBackdropRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: 0,
          background:
            'radial-gradient(52.85% 52.85% at 49.04% 47.15%, #D0E8FF 0%, #F5F5F7 100%)',
        }}
      />
      <div className="relative z-10">
        {/* Hero Section - Framed Premium Layout */}
        <section id="home-hero" className="relative w-full pt-20 md:pt-24 pb-8 px-6 md:px-12 lg:px-20 xl:px-32 max-w-[1440px] mx-auto min-h-[50vh] lg:min-h-[50vh] flex flex-col justify-center">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 xl:gap-40 2xl:gap-56">
          
            {/* Text Content */}
            <div className="w-full lg:w-5/12 order-2 lg:order-1 flex flex-col justify-center z-10">
              <div className="hero-eyebrow w-fit flex items-center justify-center gap-4 mb-6 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-slate-200/80">
                <div className="flex items-center bg-[#F8F9FA] rounded-full px-3 py-1.5 border border-slate-100/50">
                  <div className="flex items-center gap-2.5">
                    {/* Google */}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {/* Yelp */}
                    <svg width="15" height="15" viewBox="0 0 384 512" fill="#FF1A1A" className="flex-shrink-0">
                      <path d="M42.9 240.32l99.62 48.61c19.2 9.4 16.2 37.51-4.5 42.71L30.5 358.45a22.79 22.79 0 0 1-28.21-19.6 197.16 197.16 0 0 1 9-85.32 22.8 22.8 0 0 1 31.61-13.21zm44 239.25a199.45 199.45 0 0 0 79.42 32.11A22.78 22.78 0 0 0 192.94 490l3.9-110.82c.7-21.3-25.5-31.91-39.81-16.1l-74.21 82.4a22.82 22.82 0 0 0 4.09 34.09zm145.34-109.92l58.81 94a22.93 22.93 0 0 0 34 5.5 198.36 198.36 0 0 0 52.71-67.61A23 23 0 0 0 364.17 370l-105.42-34.26c-20.31-6.5-37.81 15.8-26.51 33.91zm148.33-132.23a197.44 197.44 0 0 0-50.41-69.31 22.85 22.85 0 0 0-34 4.4l-62 91.92c-11.9 17.7 4.7 40.61 25.2 34.71L366 268.63a23 23 0 0 0 14.61-31.21zM62.11 30.18a22.86 22.86 0 0 0-9.9 32l104.12 180.44c11.7 20.2 42.61 11.9 42.61-11.4V22.88a22.67 22.67 0 0 0-24.5-22.8 320.37 320.37 0 0 0-112.33 30.1z"/>
                    </svg>
                    {/* WeddingWire */}
                    <img src="https://www.google.com/s2/favicons?domain=weddingwire.com&sz=128" alt="WeddingWire" className="w-[15px] h-[15px] object-contain flex-shrink-0 rounded-[3px] opacity-90" />
                    {/* Thumbtack */}
                    <img src="https://www.google.com/s2/favicons?domain=thumbtack.com&sz=128" alt="Thumbtack" className="w-[15px] h-[15px] object-contain flex-shrink-0 rounded-[3px] opacity-90" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[13px] md:text-[14px] font-medium text-slate-700 tracking-wide">1.2K+ Reviews</span>
                  <div className="w-[1px] h-4 bg-slate-200"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] md:text-[14px] font-semibold text-slate-800">4.8/5</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-[14px] h-[14px] text-[#FBBC05]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif uppercase text-slate-900 leading-[1.1] tracking-wide mb-6">
                <div className="overflow-hidden"><div className="hero-text-line">Intentional</div></div>
                <div className="overflow-hidden"><div className="hero-text-line">Elegant</div></div>
                <div className="overflow-hidden"><div className="hero-text-line">Honest</div></div>
              </h1>
              <p className="hero-desc text-sm md:text-base text-slate-600 font-light mb-8 max-w-md leading-relaxed">
                Premium photography for weddings, editorials, and lifestyle. Based in Philadelphia and NYC, traveling worldwide.
              </p>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="hero-link group inline-flex items-center justify-center gap-1.5 w-[112px] h-[24px] bg-[#242424] text-white rounded-[17px] text-[12px] font-normal hover:bg-black transition-colors"
              >
                <span>Reach Out</span>
                <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          
          {/* Staggered Image Stack */}
          <div className="w-full lg:w-6/12 order-1 lg:order-2 py-4 lg:py-6 flex items-center justify-center relative group">
            <div className="hero-stack-wrapper relative w-full lg:w-[637px]" ref={stackRef} style={{ aspectRatio: '637 / 426' }}>
              {departingIdx !== null && (
                <div
                  key={`dep-${departingIdx}`}
                  className="absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                  style={{
                    width: `calc(100% - ${(STACK_COUNT - 1) * STACK_OFFSET_X}px)`,
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
              {visibleSet.map((imgIdx, pos) => (
                <div
                  key={imgIdx}
                  className="hero-stack-card absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                  style={{
                    width: `calc(100% - ${(STACK_COUNT - 1) * STACK_OFFSET_X}px)`,
                    aspectRatio: '3 / 2',
                    zIndex: pos + 1,
                    transform: `translate(${pos * STACK_OFFSET_X}px, ${pos * -STACK_OFFSET_Y}px)`,
                    transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.6s ease',
                    boxShadow: CARD_SHADOWS[pos],
                    border: '0.5px solid rgba(0,0,0,0.06)',
                    willChange: 'transform',
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={
                      pos === STACK_COUNT - 1 && hasInitialized.current
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
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Featured Galleries / Recent Work */}
      <section ref={featuredRef} data-nav-dark className="px-6 md:px-12 max-w-7xl mx-auto py-12 border-t border-slate-100 min-h-[50vh]">
        <div className="flex justify-between items-end mb-8">
          {/* <h2 className="text-2xl font-light tracking-wide text-slate-900">Recent Stories</h2> */}
        </div>

        {renderFeatured ? (
          <div className="space-y-20">
            {/* Gallery 2 - Makayla and Hunter */}
            <div>
              <div ref={wedding2HeaderRef} className="mb-8 flex flex-col items-center text-center">
                <h3 className="text-3xl font-serif text-slate-900 mb-3">Makayla and Hunter</h3>
                <p className="text-sm text-slate-400 font-serif uppercase tracking-widest">Glasbern - A Historic Hotel of America • Summer 2025</p>
              </div>
              <div ref={wedding2GridRef} className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                {wedding2Images.map((img, i) => (
                  <div 
                    key={img.id} 
                    className={`group cursor-pointer overflow-hidden rounded-[8px] ${img.className}`} 
                    onClick={() => openLightbox(wedding2Images, i)}
                  >
                    <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[8px] shadow-xl shadow-slate-200/50`}>
                      <ProgressiveCldImage
                        publicId={img.publicId}
                        cldImg={img.cldImg}
                        alt={`Makayla and Hunter photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        imgClassName="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery 1 */}
            <div>
              <div ref={wedding1HeaderRef} className="mb-8 flex flex-col items-center text-center">
                <h3 className="text-3xl font-serif text-slate-900 mb-3">Molly and Brandon</h3>
                <p className="text-sm text-slate-400 font-serif uppercase tracking-widest">Green Lane, Pennsylvania • Summer 2025</p>
              </div>
              <div ref={wedding1GridRef} className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                {wedding1Images.map((img, i) => (
                  <div 
                    key={img.id} 
                    className={`group cursor-pointer overflow-hidden rounded-[8px] ${img.className}`} 
                    onClick={() => openLightbox(wedding1Images, i)}
                  >
                    <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[8px] shadow-xl shadow-slate-200/50`}>
                      <ProgressiveCldImage
                        publicId={img.publicId}
                        cldImg={img.cldImg}
                        alt={`Molly and Brandon photo ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        imgClassName="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
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
      <section ref={selectedRef} data-nav-dark className="px-6 md:px-12 max-w-7xl mx-auto pt-4 pb-20">
        <div ref={selectedDividerRef} className="flex items-center gap-6 mb-10">
          <div className="flex-1 h-px bg-slate-200" />
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">Selected Work</h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {renderSelected ? (
          <div ref={assortedGridRef} className="grid grid-cols-12 gap-4 md:gap-8 items-start">
            {assortedImages.map((img, i) => (
              <div 
                key={img.id} 
                className={`group cursor-pointer overflow-hidden rounded-[8px] ${img.className}`} 
                onClick={() => openLightbox(assortedImages, i)}
              >
                <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[8px] shadow-xl shadow-slate-200/50`}>
                  <ProgressiveCldImage
                    publicId={img.publicId}
                    cldImg={img.cldImg}
                    alt={`Selected Work photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    imgClassName="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[22vh] md:h-[28vh]" aria-hidden="true" />
        )}

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-2 mt-16 mb-2">
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
        style={{ marginTop: '-100vh', pointerEvents: 'none' }}
      >
        <div ref={reviewsContentRef} className="relative z-[25]">
          <ReviewsGrid showHeading={false} />
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            animation: isClosingQuoteModal === 'slow'
              ? 'lightboxOut 1.5s cubic-bezier(0.23,1,0.32,1) forwards'
              : isClosingQuoteModal === 'fast'
              ? 'lightboxOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              : 'lightboxIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-3xl"
            onClick={() => closeQuoteModal(false)}
          />

          <button
            onClick={() => closeQuoteModal(false)}
            className="absolute top-8 right-8 z-20 p-2 text-slate-400 hover:text-slate-800 transition-colors duration-300"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          <div
            className="relative z-10 w-full animate-fade-in"
            style={{
              maxWidth: 608,
              borderRadius: 22,
              backgroundColor: '#242424',
              border: '1px solid #000000',
              padding: '36px 44px',
            }}
          >
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ animation: 'lightboxIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-3xl"
            onClick={closeLightbox}
          />

          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 z-20 p-2 text-slate-400 hover:text-slate-800 transition-colors duration-300"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-4 md:left-8 z-20 p-3 text-slate-300 hover:text-slate-600 transition-colors duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} strokeWidth={1} />
              </button>
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-4 md:right-8 z-20 p-3 text-slate-300 hover:text-slate-600 transition-colors duration-300"
                aria-label="Next image"
              >
                <ChevronRight size={24} strokeWidth={1} />
              </button>
            </>
          )}

          <div
            key={lightbox.index}
            className="relative z-10 flex items-center justify-center px-16"
            style={{ animation: 'lightboxImage 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <AdvancedImage
              cldImg={lightbox.images[lightbox.index].cldImg}
              className="max-w-[85vw] max-h-[80vh] object-contain rounded-sm shadow-2xl shadow-slate-900/10"
              alt={`Photo ${lightbox.index + 1} of ${lightbox.images.length}`}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[10px] text-slate-400 tracking-[0.3em] font-light tabular-nums">
            {lightbox.index + 1} — {lightbox.images.length}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
