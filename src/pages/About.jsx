import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';
import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../utils/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutImage = cld.image('AF1I5294_gu67ej');
  const pageRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const pressRef = useRef(null);
  const reachOutButtonRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (imageRef.current) {
        gsap.set(imageRef.current, { opacity: 0, y: 30 });
        tl.to(imageRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          clearProps: 'transform',
        }, 0);
      }

      if (textRef.current) {
        const items = [...textRef.current.children];
        gsap.set(items, { opacity: 0, y: 30 });
        tl.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          clearProps: 'transform',
        }, 0.1);
      }

      if (pressRef.current) {
        const pressItems = [
          pressRef.current.querySelector('h2'),
          ...pressRef.current.querySelectorAll(':scope > div > div'),
        ].filter(Boolean);
        gsap.set(pressItems, { opacity: 0, y: 30 });
        ScrollTrigger.batch(pressItems, {
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
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isClosingQuoteModal, setIsClosingQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ phone: '' });
  const [quoteStatus, setQuoteStatus] = useState('idle');
  const [showStickyReachOut, setShowStickyReachOut] = useState(false);

  const closeQuoteModal = (isSlow = false) => {
    setIsClosingQuoteModal(isSlow ? 'slow' : 'fast');
    setTimeout(() => {
      setShowQuoteModal(false);
      setQuoteStatus('idle');
      setQuoteForm({ phone: '' });
      setIsClosingQuoteModal(false);
    }, isSlow ? 1500 : 350);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const docEl = document.documentElement;
    if (showQuoteModal) {
      docEl.setAttribute('data-quote-modal-open', '');
    } else {
      docEl.removeAttribute('data-quote-modal-open');
    }

    return () => {
      docEl.removeAttribute('data-quote-modal-open');
    };
  }, [showQuoteModal]);

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

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let rafId = 0;
    const update = () => {
      const isMobile = window.matchMedia?.('(max-width: 767px)')?.matches ?? false;
      if (!isMobile) {
        setShowStickyReachOut(false);
        return;
      }

      const btn = reachOutButtonRef.current;
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
  }, []);

  return (
    <div
      ref={pageRef}
      id="about-page"
      className="min-h-[80vh] px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-16 flex flex-col justify-center"
    >
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
          className="group inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] sm:w-[112px] sm:h-[24px] bg-[#242424] text-white rounded-[17px] text-[13px] sm:text-[12px] font-normal hover:bg-black transition-colors duration-300"
        >
          <span>Reach Out</span>
          <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
      <div className="about-hero-grid grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* Image Section */}
        <div ref={imageRef} className="about-hero-image order-2 lg:order-1 flex justify-center mt-4 lg:mt-0">
          <div className="about-hero-imageInner aspect-[4/5] bg-slate-100 w-[90%] md:w-[80%] lg:w-[85%] relative overflow-hidden">
            <AdvancedImage
              cldImg={aboutImage}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-slate-50 -z-10 hidden md:block"></div>
          </div>
        </div>

        {/* Text Section */}
        <div ref={textRef} className="about-hero-text order-1 lg:order-2">
          <h2 className="about-hero-eyebrow text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">About Starling</h2>
          <h1 className="about-hero-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 mb-6 leading-[1.1]">
            <span className="italic font-serif text-slate-500">Our</span> Approach.
          </h1>
          
          <div className="about-hero-body space-y-4 text-slate-600 font-light leading-relaxed">
            <p>
              There is a time and place for everything in art. Sometimes, the story calls for a clean, classic,
              and timeless capture. Other times, it demands that we completely break the mold to build a bold,
              entirely unique aesthetic.
            </p>
            <p>
              At Starling, versatility is our greatest strength. With over a decade of experience across photography,
              videography, advertising, and marketing, we understand exactly how to adapt our medium to fit your
              specific needs. We aren't bound by a single, rigid style or a specific location. Based in Philadelphia
              but available worldwide, we go wherever the story takes us.
            </p>
            <p>
              Our approach is highly collaborative. We obsess over our work so you don't have to, bringing relentless
              dedication and an elevated artistic eye to every wedding, portrait, and commercial project we take on.
              No matter the subject, our mission is simple: to help you capture your vision and share our love for
              art with you.
            </p>
          </div>

          <div className="about-hero-ctaWrap hidden lg:flex justify-start mt-10">
            <button
              ref={reachOutButtonRef}
              onClick={() => setShowQuoteModal(true)}
              className="group inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] sm:w-[112px] sm:h-[24px] bg-[#242424] text-white rounded-[17px] text-[13px] sm:text-[12px] font-normal hover:bg-black transition-colors duration-300"
            >
              <span>Reach Out</span>
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Mobile-only CTA below image */}
        <div className="about-hero-ctaWrap flex lg:hidden justify-center order-3 mt-10">
          <button
            ref={reachOutButtonRef}
            onClick={() => setShowQuoteModal(true)}
            className="group inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] bg-[#242424] text-white rounded-[17px] text-[13px] font-normal hover:bg-black transition-colors duration-300"
          >
            <span>Reach Out</span>
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Press Section */}
      <div ref={pressRef} className="mt-24 md:mt-32 max-w-3xl mx-auto w-full">
        <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-10 text-center">Press</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-serif italic text-slate-800 mb-2">Bill Clinton</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Photography credits for Clinton's last book tour
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-serif italic text-slate-800 mb-2">CBS</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Credits for photos of Ukee Washington in the context of Lung Force Walk
            </p>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          style={{
            animation: isClosingQuoteModal === 'slow'
              ? 'lightboxOut 1.5s cubic-bezier(0.23,1,0.32,1) forwards'
              : isClosingQuoteModal === 'fast'
              ? 'lightboxOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              : 'lightboxIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm md:bg-white/70 md:backdrop-blur-3xl"
            onClick={() => closeQuoteModal(false)}
          />

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
    </div>
  );
};

export default About;
