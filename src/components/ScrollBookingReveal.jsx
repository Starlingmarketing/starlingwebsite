import { useRef, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { createTimeline, onScroll, stagger } from 'animejs';
import emailjs from '@emailjs/browser';
import {
  CinematicReviewGrid,
  cinematicReviewPool,
  shuffleInPlace,
  REVIEW_GRID_TOTAL,
} from '../pages/Booking';
import { NavOverrideContext } from '../contexts/NavContext';

const ScrollBookingReveal = () => {
  const { setActiveOverride } = useContext(NavOverrideContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    location: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [showDate, setShowDate] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const formCardRef = useRef(null);
  const formFieldRefs = useRef([]);
  const reviewsRef = useRef(null);
  const timelineRef = useRef(null);

  const railEngineRef = useRef({
    textBag: [],
    starsBag: [],
    recent: [],
    photoBag: [],
    photoRecent: [],
    slotCols: {},
    photoCooldownUntil: {},
    slots: {},
  });

  const initialGridReviews = useMemo(() => {
    const pool = [...cinematicReviewPool];
    shuffleInPlace(pool);
    return pool.slice(0, Math.min(REVIEW_GRID_TOTAL, pool.length));
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches;

    if (reducedMotion) {
      [bgRef, formCardRef, reviewsRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = '1';
          r.current.style.transform = 'none';
        }
      });
      formFieldRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const fields = formFieldRefs.current.filter(Boolean);

    const tl = createTimeline({
      defaults: { ease: 'out(3)' },
      autoplay: onScroll({
        target: section,
        enter: 'top top',
        leave: 'bottom bottom',
        sync: true,
      }),
    });
    timelineRef.current = tl;

    tl.add(bgRef.current, { opacity: [0, 1], duration: 500 }, 0);
    tl.add(
      formCardRef.current,
      { opacity: [0, 1], y: [80, 0], duration: 500 },
      60,
    );
    if (fields.length) {
      tl.add(
        fields,
        { opacity: [0, 1], y: [24, 0], duration: 300, delay: stagger(80) },
        250,
      );
    }

    if (reviewsRef.current) {
      tl.add(reviewsRef.current, { opacity: [0, 1], duration: 350 }, 500);
    }

    return () => {
      tl.revert();
      timelineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;

    const onScrollCheck = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const inZone = rect.top < -vh * 0.3;
        setActiveOverride(inZone ? '/booking' : null);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScrollCheck, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScrollCheck);
      setActiveOverride(null);
    };
  }, [setActiveOverride]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const formatField = (value) => {
    const trimmed = String(value ?? '').trim();
    return trimmed.length ? trimmed : '—';
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setStatus('sending');

      const inquiryBody = [
        `Name: ${formatField(formData.name)}`,
        `Email: ${formatField(formData.email)}`,
        `Phone: ${formatField(formData.phone)}`,
        `Event date: ${formatField(formData.date)}`,
        `Location: ${formatField(formData.location)}`,
        '',
        'Message:',
        formatField(formData.message),
      ].join('\n');

      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: new Date().toLocaleString(),
            location: formData.location,
            message: inquiryBody,
            reply_to: formData.email,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        )
        .then(() => {
          setStatus('success');
          setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            location: '',
            message: '',
          });
        })
        .catch(() => {
          setStatus('error');
        });
    },
    [formData],
  );

  const isBusy = status === 'sending' || status === 'success';
  const busyClass = isBusy
    ? 'opacity-0 -translate-y-4 pointer-events-none'
    : 'opacity-100 translate-y-0';
  const td = (sendMs, idleMs) => ({
    transitionDelay: isBusy ? `${sendMs}ms` : `${idleMs}ms`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '250vh', marginTop: '-90vh' }}
    >
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pointer-events-none"
        style={{ zIndex: 20 }}
      >
        {/* Gradient background */}
        <div
          ref={bgRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(52.85% 52.85% at 49.04% 47.15%, #D0E8FF 0%, #F5F5F7 100%)',
            }}
          />
        </div>

        {/* Reviews grid - fades in behind the form */}
        <div
          ref={reviewsRef}
          className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="w-full px-6 md:px-12">
            <CinematicReviewGrid
              engineRef={railEngineRef}
              initialReviews={initialGridReviews}
            />
          </div>
        </div>

        {/* Form card - sits on top */}
        <div
          ref={formCardRef}
          className="relative z-10 w-full px-6 pointer-events-auto"
          style={{
            opacity: 0,
            maxWidth: 608,
            willChange: 'opacity, transform',
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: 22,
              backgroundColor: '#242424',
              border: '1px solid #000000',
              padding: '36px 44px',
            }}
          >
            {/* Success overlay */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-between transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                status === 'success'
                  ? 'opacity-100 translate-y-0 z-10 pointer-events-auto duration-1000 delay-500'
                  : 'opacity-0 translate-y-8 -z-10 pointer-events-none duration-500 delay-0'
              }`}
              style={{ padding: '36px 44px' }}
            >
              <div className="flex-1 flex items-center justify-center w-full">
                <p
                  className="text-white text-center font-light"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '18px',
                    lineHeight: '1.5',
                  }}
                >
                  Thank you for your submission.
                  <br />
                  We'll be in touch shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="flex items-center justify-center cursor-pointer transition-opacity duration-300 hover:opacity-80 shrink-0"
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
                }}
              >
                New Inquiry
              </button>
            </div>

            {/* Form */}
            <div
              className={`transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                status === 'success'
                  ? 'pointer-events-none'
                  : 'pointer-events-auto'
              }`}
            >
              <form onSubmit={handleSubmit} className="w-full">
                <div
                  style={{
                    pointerEvents: isBusy ? 'none' : 'auto',
                  }}
                >
                  {/* Name + Email */}
                  <div
                    ref={(el) => (formFieldRefs.current[0] = el)}
                    style={{
                      opacity: 0,
                      willChange: 'opacity, transform',
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                      <div
                        className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                        style={td(0, 300)}
                      >
                        <label
                          htmlFor="scroll-name"
                          className="block text-xs uppercase tracking-widest mb-5"
                          style={{ color: '#FFFFFF' }}
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="scroll-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                          style={{
                            border: 'none',
                            borderBottom: '1px solid #B7B7B7',
                          }}
                        />
                      </div>
                      <div
                        className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                        style={td(50, 350)}
                      >
                        <label
                          htmlFor="scroll-email"
                          className="block text-xs uppercase tracking-widest mb-5"
                          style={{ color: '#FFFFFF' }}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="scroll-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                          style={{
                            border: 'none',
                            borderBottom: '1px solid #B7B7B7',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div
                    ref={(el) => (formFieldRefs.current[1] = el)}
                    style={{
                      opacity: 0,
                      willChange: 'opacity, transform',
                    }}
                  >
                    <div
                      className={`mt-7 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                      style={td(100, 400)}
                    >
                      <label
                        htmlFor="scroll-phone"
                        className="block text-xs uppercase tracking-widest mb-5"
                        style={{ color: '#FFFFFF' }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="scroll-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                        style={{
                          border: 'none',
                          borderBottom: '1px solid #B7B7B7',
                        }}
                      />
                    </div>
                  </div>

                  {/* Toggle buttons */}
                  <div
                    ref={(el) => (formFieldRefs.current[2] = el)}
                    style={{
                      opacity: 0,
                      willChange: 'opacity, transform',
                    }}
                  >
                    <div className="flex justify-between mt-7">
                      <div
                        className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                        style={td(150, 450)}
                      >
                        <button
                          type="button"
                          onClick={() => setShowDate((v) => !v)}
                          className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70"
                          style={{ color: '#636363' }}
                        >
                          {showDate ? '−' : '+'} event date
                        </button>
                      </div>
                      <div
                        className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                        style={td(200, 500)}
                      >
                        <button
                          type="button"
                          onClick={() => setShowLocation((v) => !v)}
                          className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70"
                          style={{ color: '#636363' }}
                        >
                          {showLocation ? '−' : '+'} location
                        </button>
                      </div>
                      <div
                        className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                        style={td(250, 550)}
                      >
                        <button
                          type="button"
                          onClick={() => setShowMessage((v) => !v)}
                          className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70"
                          style={{ color: '#636363' }}
                        >
                          {showMessage ? '−' : '+'} tell us more
                        </button>
                      </div>
                    </div>

                    {/* Optional: Event date */}
                    <div
                      className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                      style={td(300, 600)}
                    >
                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: showDate ? 100 : 0,
                          opacity: showDate ? 1 : 0,
                        }}
                      >
                        <div className="mt-6">
                          <label
                            htmlFor="scroll-date"
                            className="block text-xs uppercase tracking-widest mb-4"
                            style={{ color: '#FFFFFF' }}
                          >
                            Event Date
                          </label>
                          <input
                            type="date"
                            id="scroll-date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                            style={{
                              border: 'none',
                              borderBottom: '1px solid #B7B7B7',
                              colorScheme: 'dark',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Optional: Location */}
                    <div
                      className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                      style={td(350, 650)}
                    >
                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: showLocation ? 100 : 0,
                          opacity: showLocation ? 1 : 0,
                        }}
                      >
                        <div className="mt-6">
                          <label
                            htmlFor="scroll-location"
                            className="block text-xs uppercase tracking-widest mb-4"
                            style={{ color: '#FFFFFF' }}
                          >
                            Location / Venue
                          </label>
                          <input
                            type="text"
                            id="scroll-location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                            style={{
                              border: 'none',
                              borderBottom: '1px solid #B7B7B7',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Optional: Message */}
                    <div
                      className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                      style={td(400, 700)}
                    >
                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: showMessage ? 160 : 0,
                          opacity: showMessage ? 1 : 0,
                        }}
                      >
                        <div className="mt-6">
                          <label
                            htmlFor="scroll-message"
                            className="block text-xs uppercase tracking-widest mb-4"
                            style={{ color: '#FFFFFF' }}
                          >
                            Tell Us More
                          </label>
                          <textarea
                            id="scroll-message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none resize-none"
                            style={{
                              border: 'none',
                              borderBottom: '1px solid #B7B7B7',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div
                    ref={(el) => (formFieldRefs.current[3] = el)}
                    style={{
                      opacity: 0,
                      willChange: 'opacity, transform',
                    }}
                  >
                    <div
                      className={`flex justify-center mt-9 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${busyClass}`}
                      style={td(450, 750)}
                    >
                      <button
                        type="submit"
                        disabled={status === 'sending'}
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
                          opacity: status === 'sending' ? 0.8 : 1,
                        }}
                      >
                        Submit
                      </button>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-400 text-sm font-light mt-4 text-center">
                        Something went wrong. Please try again or email us
                        directly.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollBookingReveal;
