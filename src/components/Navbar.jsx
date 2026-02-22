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
  const location = useLocation();
  const navRef = useRef(null);
  const navBgRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const { activeOverride, triggerGalleryTransition } = useContext(NavOverrideContext);
  const activePath = activeOverride || location.pathname;

  useEffect(() => {
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
        className={`fixed inset-0 z-40 md:hidden transition-[background-color,backdrop-filter] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isOpen
            ? 'pointer-events-auto bg-black/[0.14] backdrop-blur-[6px]'
            : 'pointer-events-none bg-black/0 backdrop-blur-[0px]'
        }`}
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
        style={{ willChange: 'background-color, backdrop-filter' }}
      />

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
          className={`absolute inset-0 pointer-events-none rounded-[22px] transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backdropFilter: 'blur(56px) saturate(1.8) brightness(0.88)',
            WebkitBackdropFilter: 'blur(56px) saturate(1.8) brightness(0.88)',
          }}
        >
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{
              background: 'linear-gradient(165deg, rgba(10,14,28,0.24) 0%, rgba(14,22,40,0.12) 50%, rgba(10,14,28,0.22) 100%)',
            }}
          />
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{
              background: 'linear-gradient(178deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 30%, transparent 50%)',
            }}
          />
          <div className="absolute top-0 inset-x-[6%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div
            className="absolute inset-0 rounded-[22px]"
            style={{
              boxShadow: 'inset 0 1px 0.5px rgba(255,255,255,0.16), inset 0 -0.5px 0.5px rgba(255,255,255,0.04)',
            }}
          />
          <div className="absolute inset-0 rounded-[22px]" style={{ background: 'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255,255,255,0.06), transparent)' }} />
          <div
            className="absolute inset-0 rounded-[22px] opacity-[0.02] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />
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
              <img
                src={logo}
                alt="Starling"
                className={`h-9 md:h-10 w-auto transition-[filter] duration-200 ${
                  isOpen ? 'invert' : ''
                }`}
              />
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
              className={`md:hidden z-50 relative w-11 h-11 -mr-2 grid place-items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${
                isOpen
                  ? 'text-white/70 hover:text-white focus-visible:ring-white/40'
                  : 'text-slate-900 hover:text-slate-600 focus-visible:ring-slate-900/20'
              }`}
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
              className={`h-full px-6 pb-6 pt-3 flex flex-col transform-gpu transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isOpen ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 -translate-y-2 delay-0'
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              {/* Top divider */}
              <div className="h-px w-full bg-white/15" />

              {/* Links */}
              <div className="flex-1 flex flex-col justify-center py-5">
                <div className="flex flex-col gap-[clamp(22px,3.2vh,34px)]">
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
                        setIsOpen(false);
                      }}
                      className={`font-inter text-[clamp(26px,7vw,32px)] leading-[1.12] font-medium tracking-tight transition-colors duration-200 ${
                        activePath === link.path ? 'text-white' : 'text-white/70 hover:text-white'
                      }`}
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
