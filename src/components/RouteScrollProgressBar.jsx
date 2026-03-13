import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ENABLED_PATHS = new Set(['/', '/about', '/booking']);

const clampValue = (min, value, max) => Math.min(max, Math.max(min, value));

const RouteScrollProgressBar = () => {
  const { pathname } = useLocation();
  const fillRef = useRef(null);
  const isEnabled = ENABLED_PATHS.has(pathname);

  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return undefined;

    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;

      const fill = fillRef.current;
      if (!(fill instanceof HTMLElement)) return;

      const docEl = document.documentElement;
      const scrollRange = Math.max(docEl.scrollHeight - window.innerHeight, 0);
      const nextProgress = scrollRange
        ? clampValue(0, window.scrollY / scrollRange, 1)
        : 0;

      fill.style.transform = `scaleX(${nextProgress})`;
      fill.style.opacity = nextProgress > 0.005 ? '1' : '0';
    };

    const requestProgressUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
    window.addEventListener('resize', requestProgressUpdate);
    requestProgressUpdate();

    return () => {
      window.removeEventListener('scroll', requestProgressUpdate);
      window.removeEventListener('resize', requestProgressUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [isEnabled, pathname]);

  if (!isEnabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px] md:h-1"
    >
      <div className="absolute inset-0 bg-slate-900/8 backdrop-blur-[2px]" />
      <div
        ref={fillRef}
        className="h-full origin-left rounded-r-full bg-slate-900/85"
        style={{
          transform: 'scaleX(0)',
          opacity: 0,
          boxShadow: '0 0 18px rgba(15, 23, 42, 0.18)',
          transition: 'opacity 180ms ease-out',
        }}
      />
    </div>
  );
};

export default RouteScrollProgressBar;
