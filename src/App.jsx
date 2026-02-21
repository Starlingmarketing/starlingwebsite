import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, Suspense, lazy, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import { NavOverrideContext } from './contexts/NavContext';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Booking = lazy(() => import('./pages/Booking'));

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
          <ScrollToTop />
          <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24">
              <Suspense fallback={<div className="w-full min-h-[50vh]" />}>
                <Routes>
                  <Route path="/" element={<Home key={homeKey} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/booking" element={<Booking />} />
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
