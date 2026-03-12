import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, Suspense, lazy, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import { NavOverrideContext } from './contexts/NavContext';
import SeoRouteHead from './seo/SeoRouteHead';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Booking = lazy(() => import('./pages/Booking'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

const BOOKING_PAGE_BG =
  'radial-gradient(52.85% 52.85% at 49.04% 47.15%, #D0E8FF 0%, #F5F5F7 100%)';

function BookingRouteFallback() {
  return (
    <div className="relative isolate min-h-screen py-12 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 z-0 h-[clamp(1800px,220vh,3000px)] lg:h-[clamp(1600px,200vh,2600px)]"
        style={{
          background: BOOKING_PAGE_BG,
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
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="mt-10 lg:mt-0 lg:flex lg:items-start lg:justify-center lg:pt-[114px]">
            <div
              className="mx-auto relative overflow-hidden px-6 py-8 sm:px-11 sm:py-9 animate-pulse"
              style={{
                width: '100%',
                maxWidth: 608,
                borderRadius: 22,
                backgroundColor: '#242424',
                border: '1px solid #000000',
              }}
            >
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <div className="h-3 w-24 rounded bg-white/20 mb-3 sm:mb-5" />
                    <div className="h-9 w-full border-b border-white/20" />
                  </div>
                  <div>
                    <div className="h-3 w-28 rounded bg-white/20 mb-3 sm:mb-5" />
                    <div className="h-9 w-full border-b border-white/20" />
                  </div>
                </div>

                <div className="mt-7">
                  <div className="h-3 w-28 rounded bg-white/20 mb-3 sm:mb-5" />
                  <div className="h-9 w-full border-b border-white/20" />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-between mt-7">
                  <div className="h-5 w-20 rounded bg-white/15" />
                  <div className="h-5 w-16 rounded bg-white/15" />
                  <div className="h-5 w-24 rounded bg-white/15" />
                </div>

                <div className="flex justify-center mt-9">
                  <div className="h-6 w-[143px] rounded-md bg-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteSuspenseFallback() {
  const { pathname } = useLocation();
  if (pathname === '/booking') return <BookingRouteFallback />;
  return <div className="w-full min-h-[50vh]" />;
}

function App() {
  const [activeOverride, setActiveOverride] = useState(null);
  const [homeKey, setHomeKey] = useState(0);

  const triggerGalleryTransition = useCallback(() => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'white',
      zIndex: '45',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    });
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    setTimeout(() => {
      setHomeKey((k) => k + 1);
      window.scrollTo(0, 0);

      setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      }, 50);
    }, 300);
  }, []);

  return (
    <NavOverrideContext.Provider value={{ activeOverride, setActiveOverride, triggerGalleryTransition }}>
      <ReactLenis root options={{ lerp: 0.16, smoothWheel: true }}>
        <Router>
          <SeoRouteHead />
          <ScrollToTop />
          <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24">
              <Suspense fallback={<RouteSuspenseFallback />}>
                <Routes>
                  <Route path="/" element={<Home key={homeKey} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <footer className="py-12 text-center text-xs tracking-widest text-slate-400 uppercase">
              &copy; {new Date().getFullYear()} Starling Photography. All Rights Reserved.
            </footer>
          </div>
        </Router>
      </ReactLenis>
    </NavOverrideContext.Provider>
  );
}

export default App;
