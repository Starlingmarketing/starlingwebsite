import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Booking', path: '/booking' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 py-3 transition-all duration-500 ease-in-out border-b ${
        scrolled ? 'bg-white/20 backdrop-blur-2xl backdrop-saturate-150 border-white/30' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-slate-900 z-50 relative"
        >
          Starling
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
          className="md:hidden z-50 relative p-2 -mr-2 text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
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
