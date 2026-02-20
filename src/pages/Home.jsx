import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';
import { useRef, useState, useEffect } from 'react';
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

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % heroImages.length);
    }, 12000);
    return () => clearInterval(intervalRef.current);
  }, [heroImages.length]);

  const goToImage = (idx) => {
    clearInterval(intervalRef.current);
    setCurrentImgIdx(idx);
    intervalRef.current = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % heroImages.length);
    }, 12000);
  };

  const container = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // Initial states
    gsap.set('.hero-text-line', { y: 32, opacity: 0 });
    gsap.set('.hero-desc', { y: 16, opacity: 0 });
    gsap.set('.hero-link', { y: 10, opacity: 0 });
    gsap.set('.hero-img-wrapper', { opacity: 0, y: 28 });
    gsap.set('.hero-img', { scale: 1.06, transformOrigin: '50% 50%' });
    gsap.set('.hero-dots', { opacity: 0 });

    if (prefersReducedMotion) {
      gsap.set('.hero-text-line', { y: 0, opacity: 1 });
      gsap.set('.hero-desc', { y: 0, opacity: 1 });
      gsap.set('.hero-link', { y: 0, opacity: 1 });
      gsap.set('.hero-img-wrapper', { y: 0, opacity: 1 });
      gsap.set('.hero-img', { scale: 1, clearProps: 'transform' });
      gsap.set('.hero-dots', { opacity: 1 });
      return;
    }

    // Animation sequence
    // Text leads slightly; image follows for a cleaner, more natural pacing.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(
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
      )
      .to(
        '.hero-dots',
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.6
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

  const wedding2Images = Array.from({ length: 16 }, (_, i) => ({
    id: `w2-${i + 1}`,
    aspectRatio: 'aspect-[4/3]',
    className: 'col-span-12 md:col-span-6 lg:col-span-3'
  }));

  return (
    <div ref={container} className="w-full">
      {/* Hero Section - Framed Premium Layout */}
      <section id="home-hero" className="relative w-full pt-20 md:pt-24 pb-8 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto min-h-[50vh] lg:min-h-[50vh] flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Text Content */}
          <div className="w-full lg:w-5/12 order-2 lg:order-1 flex flex-col justify-center z-10">
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
          <div className="w-full lg:w-6/12 order-1 lg:order-2 h-[40vh] lg:h-[50vh] py-4 lg:py-6 flex items-center justify-center relative">
            <div className="hero-img-wrapper relative w-full h-full overflow-hidden bg-transparent flex items-center justify-center">
              {heroImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
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
            <div className="hero-dots absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2.5">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToImage(idx)}
                  className={`relative h-[5px] rounded-full overflow-hidden focus:outline-none transition-all duration-500 ease-out ${
                    idx === currentImgIdx ? 'w-6' : 'w-[5px]'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <span className="absolute inset-0 bg-slate-200 rounded-full" />
                  {idx === currentImgIdx && (
                    <span
                      className="absolute inset-0 bg-slate-400 rounded-full"
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
          <h2 className="text-2xl font-light tracking-wide text-slate-900">Recent Stories</h2>
        </div>
        
        <div className="space-y-20">
          {/* Gallery 1 */}
          <div>
            <div className="mb-8 flex flex-col items-center text-center">
              <h3 className="text-3xl font-light text-slate-900 mb-3">Molly and Brandon</h3>
              <p className="text-sm text-slate-400 font-light uppercase tracking-widest">Green Lane, Pennsylvania • Summer 2025</p>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
              {wedding1Images.map((img, i) => (
                <div key={img.id} className={`group cursor-pointer overflow-hidden ${img.className}`}>
                  <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden shadow-xl shadow-slate-200/50`}>
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

          {/* Gallery 2 */}
          <div>
            <div className="mb-8 flex flex-col items-center text-center">
              <h3 className="text-3xl font-light text-slate-900 mb-3">Château de Villette</h3>
              <p className="text-sm text-slate-400 font-light uppercase tracking-widest">Paris, France • Autumn 2026</p>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
              {wedding2Images.map((img, i) => (
                <div key={img.id} className={`group cursor-pointer overflow-hidden ${img.className}`}>
                  <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden shadow-xl shadow-slate-200/50`}>
                    <div className="absolute inset-0 bg-slate-100 group-hover:scale-105 transition-transform duration-[2000ms] ease-out flex items-center justify-center">
                      <span className="text-slate-300 font-light tracking-widest text-[10px] uppercase opacity-50">
                        Image {i + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
