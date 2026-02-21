import { Link } from 'react-router-dom';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';
import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const Home = () => {
  // Create a Cloudinary image instance
  const heroImages = [
    cld.image('AF1I0729_catszb'),
    cld.image('2021-12-01_fj6dqk'),
    cld.image('Image_1_iz7lk8'),
    cld.image('AF1I1454_vcc77d'),
    cld.image('3P4A1455_ctp4pj')
  ];

  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isManualNav, setIsManualNav] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsManualNav(false);
      setCurrentImgIdx((prev) => (prev + 1) % heroImages.length);
    }, 12000);
    return () => clearInterval(intervalRef.current);
  }, [heroImages.length]);

  const goToImage = (idx) => {
    clearInterval(intervalRef.current);
    setIsManualNav(true);
    setCurrentImgIdx(idx);
    intervalRef.current = setInterval(() => {
      setIsManualNav(false);
      setCurrentImgIdx((prev) => (prev + 1) % heroImages.length);
    }, 12000);
  };

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

  const container = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // Initial states
    gsap.set('.hero-eyebrow', { y: 20, opacity: 0 });
    gsap.set('.hero-text-line', { y: 32, opacity: 0 });
    gsap.set('.hero-desc', { y: 16, opacity: 0 });
    gsap.set('.hero-link', { y: 10, opacity: 0 });
    gsap.set('.hero-img-wrapper', { opacity: 0, y: 28 });
    gsap.set('.hero-img', { scale: 1.06, transformOrigin: '50% 50%' });

    if (prefersReducedMotion) {
      gsap.set('.hero-eyebrow', { y: 0, opacity: 1 });
      gsap.set('.hero-text-line', { y: 0, opacity: 1 });
      gsap.set('.hero-desc', { y: 0, opacity: 1 });
      gsap.set('.hero-link', { y: 0, opacity: 1 });
      gsap.set('.hero-img-wrapper', { y: 0, opacity: 1 });
      gsap.set('.hero-img', { scale: 1, clearProps: 'transform' });
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
        '.hero-img-wrapper',
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        0.18
      )
      .to(
        '.hero-img',
        {
          scale: 1,
          duration: 1.6,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        0.18
      );
  }, { scope: container });

  // Featured gallery layouts
  const wedding1Images = [
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
  ].map((publicId) => ({
    id: publicId,
    cldImg: cld.image(publicId),
    aspectRatio: 'aspect-[4/3]',
    className: 'col-span-12 md:col-span-6 lg:col-span-3',
  }));

  const wedding2Images = [
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
  ].map((publicId) => ({
    id: publicId + '-mh', // unique id for Makayla and Hunter
    cldImg: cld.image(publicId),
    aspectRatio: 'aspect-[4/3]',
    className: 'col-span-12 md:col-span-6 lg:col-span-3',
  }));

  const assortedImages = Array.from({ length: 12 }, (_, i) => ({
    id: `as-${i + 1}`,
    aspectRatio: 'aspect-[4/3]',
    className: 'col-span-12 md:col-span-6 lg:col-span-3',
  }));

  return (
    <div ref={container} className="w-full">
      {/* Hero Section - Framed Premium Layout */}
      <section id="home-hero" className="relative w-full pt-20 md:pt-24 pb-8 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto min-h-[50vh] lg:min-h-[50vh] flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
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
            <Link
              to="/booking"
              className="hero-link group inline-flex items-center space-x-4 text-xs uppercase tracking-[0.2em] text-slate-900 hover:text-slate-500 transition-colors"
            >
              <span>REACH OUT</span>
              <ArrowRight size={16} strokeWidth={1} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
          
          {/* Image Container */}
          <div className="w-full lg:w-6/12 order-1 lg:order-2 h-[40vh] lg:h-[50vh] py-4 lg:py-6 flex items-center justify-center relative group">
            <div className="hero-img-wrapper relative w-full h-full overflow-hidden bg-transparent flex items-center justify-center">
              {heroImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-opacity ${
                    isManualNav ? 'duration-300 ease-out' : 'duration-1000 ease-in-out'
                  } ${
                    idx === currentImgIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <AdvancedImage 
                    cldImg={img} 
                    className="hero-img w-full h-full object-contain" 
                    alt={`Starling Photography Cover ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="hero-dots absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2.5 opacity-0 pointer-events-none transition-opacity duration-300 ease-out group-hover:opacity-100 focus-within:opacity-100">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToImage(idx)}
                  className={`group/dot relative rounded-full overflow-hidden cursor-pointer focus:outline-none transition-transform duration-700 ease-out hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    idx === currentImgIdx ? 'w-6 h-[6px]' : 'w-[6px] h-[6px]'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={idx === currentImgIdx ? 'true' : undefined}
                >
                  <span className="absolute inset-0 bg-slate-200 rounded-full transition-colors duration-300 group-hover/dot:bg-slate-300" />
                  {idx === currentImgIdx && (
                    <span
                      className="absolute inset-0 bg-slate-400 rounded-full transition-colors duration-300 group-hover/dot:bg-slate-500"
                      style={{
                        animation: 'dotProgress 12s linear forwards',
                        transformOrigin: 'left center',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Featured Galleries / Recent Work */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-12 border-t border-slate-100 min-h-[50vh]">
        <div className="flex justify-between items-end mb-8">
          {/* <h2 className="text-2xl font-light tracking-wide text-slate-900">Recent Stories</h2> */}
        </div>
        
        <div className="space-y-20">
          {/* Gallery 2 - Makayla and Hunter */}
          <div>
            <div className="mb-8 flex flex-col items-center text-center">
              <h3 className="text-3xl font-serif text-slate-900 mb-3">Makayla and Hunter</h3>
              <p className="text-sm text-slate-400 font-serif uppercase tracking-widest">Glasbern - A Historic Hotel of America • Summer 2025</p>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
              {wedding2Images.map((img, i) => (
                <div key={img.id} className={`group cursor-pointer overflow-hidden rounded-[8px] ${img.className}`} onClick={() => openLightbox(wedding2Images, i)}>
                  <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[8px] shadow-xl shadow-slate-200/50`}>
                    <AdvancedImage
                      cldImg={img.cldImg}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                      alt={`Makayla and Hunter photo ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery 1 */}
          <div>
            <div className="mb-8 flex flex-col items-center text-center">
              <h3 className="text-3xl font-serif text-slate-900 mb-3">Molly and Brandon</h3>
              <p className="text-sm text-slate-400 font-serif uppercase tracking-widest">Green Lane, Pennsylvania • Summer 2025</p>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
              {wedding1Images.map((img, i) => (
                <div key={img.id} className={`group cursor-pointer overflow-hidden rounded-[8px] ${img.className}`} onClick={() => openLightbox(wedding1Images, i)}>
                  <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden rounded-[8px] shadow-xl shadow-slate-200/50`}>
                    <AdvancedImage
                      cldImg={img.cldImg}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                      alt={`Molly and Brandon photo ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Assorted / Selected Work */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto pt-4 pb-20">
        <div className="flex items-center gap-6 mb-10">
          <div className="flex-1 h-px bg-slate-200" />
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">Selected Work</h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {assortedImages.map((img, i) => (
            <div key={img.id} className={`group cursor-pointer overflow-hidden ${img.className}`}>
              <div className={`w-full ${img.aspectRatio} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-slate-100 group-hover:scale-[1.03] transition-transform duration-[1600ms] ease-out flex items-center justify-center">
                  <span className="text-slate-300/60 font-light tracking-widest text-[9px] uppercase">
                    {i + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 mb-4">
          <Link
            to="/booking"
            className="group inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 text-xs uppercase tracking-[0.2em] transition-colors duration-300"
          >
            <span>REACH OUT</span>
            <ArrowRight size={16} strokeWidth={1} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </section>

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
  );
};

export default Home;
