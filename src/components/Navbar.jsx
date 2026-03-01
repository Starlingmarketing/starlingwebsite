import { useEffect, useState, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import logo from '../assets/2025.02.11 Starling Marking Agency Logo Design.svg';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { NavOverrideContext } from '../contexts/NavContext';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavReachOut, setShowNavReachOut] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const navBgRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const { activeOverride, triggerGalleryTransition } = useContext(NavOverrideContext);
  const activePath = activeOverride || location.pathname;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset menu on route change
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    mobileMenuButtonRef.current?.focus?.();

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    let rafId;
    let wasDark = false;

    const checkOverlap = () => {
      const nav = navRef.current;
      const bg = navBgRef.current;
      if (!nav || !bg) return;

      // While the lightbox is open scroll is locked and body is position:fixed,
      // which shifts getBoundingClientRect values. Preserve the last-known state
      // so the nav keeps the correct dark/light appearance.
      if (document.documentElement.hasAttribute('data-lightbox-open') ||
          document.documentElement.hasAttribute('data-quote-modal-open')) return;

      const navRect = nav.getBoundingClientRect();
      const darkSections = document.querySelectorAll('[data-nav-dark]');

      let isDark = false;
      for (const section of darkSections) {
        const rect = section.getBoundingClientRect();
        if (navRect.bottom > rect.top && navRect.top < rect.bottom) {
          isDark = true;
          break;
        }
      }

      if (isDark) {
        nav.setAttribute('data-over-dark', '');
      } else {
        nav.removeAttribute('data-over-dark');
      }

      if (isDark !== wasDark) {
        wasDark = isDark;
        gsap.to(bg, {
          opacity: isDark ? 1 : 0,
          duration: 0.35,
          ease: 'power2.out',
        });
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkOverlap);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    checkOverlap();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowNavReachOut(false);
      return undefined;
    }

    const mql = window.matchMedia('(min-width: 768px)');
    let rafId = 0;

    const update = () => {
      if (!mql.matches) {
        setShowNavReachOut(false);
        return;
      }
      const btn = document.querySelector('[data-hero-reach-out]');
      if (!btn) {
        setShowNavReachOut(false);
        return;
      }
      const rect = btn.getBoundingClientRect();
      setShowNavReachOut(rect.bottom <= 0);
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
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
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  useGSAP(() => {
    const vh = window.innerHeight;
    const isMobile = window.matchMedia?.('(max-width: 767px)')?.matches ?? false;

    const tl = gsap.timeline({
      scrollTrigger: {
        start: 'top top',
        end: '+=' + vh * 1.0,
        scrub: 1.2,
      },
    });

    tl.fromTo(
      navRef.current,
      {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: 'rgba(255, 255, 255, 0)',
        backdropFilter: 'blur(0px) saturate(1)',
      },
      {
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        borderColor: 'rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(40px) saturate(1.8)',
        ease: 'power2.out',
        duration: 0.25,
      },
      0
    );

    tl.fromTo(
      navRef.current,
      {
        borderRadius: '22px',
        width: isMobile ? 'calc(100% - 2rem)' : '100%',
        maxWidth: isMobile ? '1024px' : '100%',
        top: isMobile ? '16px' : '0px',
        paddingTop: isMobile ? '12px' : '16px',
        paddingBottom: isMobile ? '12px' : '16px',
      },
      {
        borderRadius: '22px',
        width: 'calc(100% - 2rem)',
        maxWidth: '1024px',
        top: '16px',
        paddingTop: '12px',
        paddingBottom: '12px',
        ease: 'power2.inOut',
        duration: 1,
      },
      0
    );
  }, []);

  const navLinks = [
    { name: 'Gallery', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Booking', path: '/booking' },
  ];

  return (
    <>
      {/* Mobile backdrop (so the menu feels attached to nav) */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transform-gpu ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            willChange: 'opacity, backdrop-filter, -webkit-backdrop-filter',
            backgroundColor: 'rgba(2,6,23,0.001)',
            backdropFilter: 'blur(14px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(14px) saturate(1.15)',
          }}
        />

        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transform-gpu transition-opacity duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            willChange: 'opacity',
            backgroundColor: 'rgba(2,6,23,0.15)',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(1200px circle at 20% -10%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(1000px circle at 80% 110%, rgba(255,255,255,0.03), transparent 60%)',
            }}
          />
        </div>
      </div>

      <nav
        ref={navRef}
        className="fixed z-50 left-0 right-0 mx-auto border overflow-hidden"
        data-menu-open={isOpen || undefined}
      >
        <div
          ref={navBgRef}
          data-nav-bg
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '22px',
          }}
        />

        {/* Liquid glass overlay when menu is open */}
        <div
          className={`absolute inset-0 pointer-events-none rounded-[22px] transition-opacity duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            willChange: 'opacity',
            backgroundColor: 'rgba(2,6,23,0.35)',
          }}
        >
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{
              background:
                'linear-gradient(178deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 38%, transparent 62%)',
            }}
          />
          <div className="absolute top-0 inset-x-[6%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{
              boxShadow:
                'inset 0 1px 0.5px rgba(255,255,255,0.12), inset 0 -0.5px 0.5px rgba(255,255,255,0.04)',
            }}
          />
        </div>

        {/* Desktop REACH OUT — centered, appears when hero button scrolls off */}
        <div
          data-nav-reach-out
          className={`hidden md:flex items-stretch justify-center absolute inset-0 z-10 transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            showNavReachOut ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center">
            <div className="w-px self-stretch bg-white" />
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('starling:open-quote'))}
              className="w-[179px] text-xs uppercase tracking-widest text-black transition-colors duration-300 cursor-pointer text-center"
            >
              Reach Out
            </button>
            <div className="w-px self-stretch bg-white" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="z-50 relative"
              onClick={(e) => {
                if (activeOverride) {
                  e.preventDefault();
                  triggerGalleryTransition();
                }
                setIsOpen(false);
              }}
            >
              <span className="relative inline-block h-9 md:h-10">
                <img
                  src={logo}
                  alt="Starling"
                  data-nav-logo-default
                  className="block h-full w-auto"
                />
                <img
                  src={logo}
                  alt=""
                  aria-hidden="true"
                  data-nav-logo-invert
                  className="absolute left-0 top-0 block h-full w-auto opacity-0 invert drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
                />
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    if (activeOverride && activeOverride === link.path) {
                      e.preventDefault();
                    } else if (activeOverride && link.path === '/') {
                      e.preventDefault();
                      triggerGalleryTransition();
                    }
                  }}
                  className={`text-xs uppercase tracking-widest hover:text-slate-500 transition-colors duration-300 ${
                    activePath === link.path ? 'text-slate-900 font-medium' : 'text-slate-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button
              ref={mobileMenuButtonRef}
              type="button"
              data-nav-toggle
              className={`md:hidden z-50 relative w-11 h-11 -mr-2 grid place-items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${
                isOpen
                  ? 'focus-visible:ring-white/40'
                  : 'text-slate-900 hover:text-slate-600 focus-visible:ring-slate-900/20'
              }`}
              style={isOpen ? { color: 'rgba(240, 240, 245, 0.85)' } : undefined}
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
            </button>
          </div>

          {/* Mobile Dropdown (expands from navbar) */}
          <div
            role="dialog"
            aria-modal="true"
            className={`md:hidden overflow-hidden transform-gpu transition-[height] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              isOpen
                ? 'h-[var(--starling-mobile-nav-menu-h)] pointer-events-auto'
                : 'h-0 pointer-events-none'
            }`}
            aria-hidden={!isOpen}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: 'height' }}
          >
            <div
              className={`h-full pb-4 pt-3 flex flex-col transform-gpu transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isOpen ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 -translate-y-2 delay-0'
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              {/* Top divider */}
              <div className="h-px w-full bg-white/15" />

              {/* Links */}
              <div className="flex-1 flex flex-col justify-center py-5">
                <div className="flex flex-col gap-[var(--starling-mobile-nav-link-gap)]">
                  {navLinks.map((link, idx) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={(e) => {
                        if (activeOverride && activeOverride === link.path) {
                          e.preventDefault();
                        } else if (activeOverride && link.path === '/') {
                          e.preventDefault();
                          triggerGalleryTransition();
                        }
                        setIsOpen(false);
                      }}
                      style={{
                        '--starling-mobile-nav-item-delay': `${idx * 90}ms`,
                        color: activePath === link.path
                          ? 'rgba(240, 240, 245, 0.95)'
                          : 'rgba(220, 220, 230, 0.55)',
                      }}
                      className="starling-mobile-nav-link font-inter text-[length:clamp(22px,5.5vw,26px)] leading-[1.12] font-medium tracking-tight transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
