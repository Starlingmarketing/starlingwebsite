import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import logo from '../assets/2025.02.11 Starling Marking Agency Logo Design.svg';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useGSAP(() => {
    const vh = window.innerHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        start: 'top top',
        end: '+=' + vh * 1.8,
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(40px) saturate(1.5)',
        ease: 'power2.out',
        duration: 0.25,
      },
      0
    );

    tl.fromTo(
      navRef.current,
      {
        borderRadius: '22px',
        width: '100%',
        maxWidth: '100%',
        top: '0px',
        paddingTop: '16px',
        paddingBottom: '16px',
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
    <nav
      ref={navRef}
      className="fixed z-50 left-0 right-0 mx-auto border"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="z-50 relative"
        >
          <img
            src={logo}
            alt="Starling"
            className="h-9 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xs uppercase tracking-widest hover:text-slate-500 transition-colors duration-300 ${
                location.pathname === link.path ? 'text-slate-900 font-medium' : 'text-slate-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden z-50 relative p-2 -mr-2 text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${
            isOpen 
              ? 'opacity-100 pointer-events-auto bg-white/20 backdrop-blur-2xl backdrop-saturate-150' 
              : 'opacity-0 pointer-events-none bg-transparent'
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-xl uppercase tracking-[0.2em] transition-colors duration-300 ${
                location.pathname === link.path ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
