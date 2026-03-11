import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useDriverApplication } from '../context/DriverApplicationContext';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'ABOUT', path: '/about' },
  { label: 'DRIVERS', path: '/drivers' },
  { label: 'CONTACT', path: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const location = useLocation();
  const { openDriverModal } = useDriverApplication();

  const [navStyleIndex, setNavStyleIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          repeat: -1,
          repeatDelay: 5,
        }
      );
    }
  }, []);

  useEffect(() => {
    const styleInterval = setInterval(() => {
      setNavStyleIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(styleInterval);
  }, []);



  return (
    <>
      <style>{`
        @keyframes number-wave {
          0% { transform: scale(1) translateY(0); color: inherit; }
          40% { transform: scale(1.4) translateY(-2px); color: #fff; text-shadow: 0 0 12px rgba(59,130,246,0.8); }
          100% { transform: scale(1) translateY(0); color: inherit; }
        }
        .group:hover .wave-char {
          animation: number-wave 0.8s ease-in-out forwards;
        }
      `}</style>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled || location.pathname !== '/'
          ? 'bg-navy-900/90 backdrop-blur-lg border-b border-white/5'
          : 'bg-transparent'
          }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-32">
            {/* Logo */}
            <Link
              to="/"
              className="font-heading font-bold text-xl lg:text-2xl text-white tracking-tight hover:scale-105 transition-transform"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img
                ref={logoRef}
                src="/images/logo.png"
                alt="DELO TRANS INC"
                className="h-16 lg:h-28 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link, index) => {
                const isCurrentPage = location.pathname === link.path;
                const isRotatingHighlight = index === navStyleIndex % navLinks.length;
                
                // Mintaqaviy matn rangi va o'lcham animatsiyalari
                const getTextColorAndSize = () => {
                  if (isCurrentPage) {
                      return 'text-[#005E99] drop-shadow-[0_0_8px_rgba(0,94,153,0.6)] scale-110 font-bold'; // Yirik, logodagi ko'k, glowing
                  }
                  if (isRotatingHighlight) {
                      return 'text-[#fd0a07] drop-shadow-[0_0_8px_rgba(253,10,7,0.6)] scale-110 font-bold'; // Yirik, qizil, glowing
                  }
                  return 'text-white/80 scale-100 hover:text-white'; // Default
                };

                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`text-base lg:text-lg transition-all duration-500 relative group font-bold tracking-wider px-4 py-2 ${getTextColorAndSize()}`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    
                    {/* Bitta tanlangan (ko'k) ramka, va aylanib turuvchi (qizil) ramka yonib-o'chishi uchun */}
                    <span className={`absolute inset-0 border transition-all duration-500 pointer-events-none rounded ${
                        isCurrentPage ? 'border-[#005E99] bg-[#005E99]/5 opacity-100 scale-100 object-cover' : 
                        isRotatingHighlight ? 'border-red-500 bg-red-500/5 opacity-100 scale-100 object-cover' : 'border-transparent opacity-0 scale-95'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+998901234567"
                className="flex items-center gap-2 text-sm text-gray-light hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:animate-pulse group-hover:text-blue-400 transition-colors" />
                <span className="font-mono flex items-center">
                  {'+998 90 123 45 67'.split('').map((char, index) => (
                    <span
                      key={index}
                      className="wave-char inline-block"
                      style={{ 
                        animationDelay: `${index * 0.04}s`,
                        minWidth: char === ' ' ? '0.3em' : 'auto' 
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </a>
              <button
                onClick={openDriverModal}
                className="btn-primary text-sm ml-2"
              >
                Apply now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[999] bg-navy-900/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-heading font-semibold transition-colors ${location.pathname === link.path ? 'text-[#005E99] drop-shadow-[0_0_8px_rgba(0,94,153,0.6)]' : 'text-white hover:text-[#005E99]'}`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setIsMobileMenuOpen(false); openDriverModal(); }}
            className="btn-primary mt-8"
          >
            Apply now
          </button>
        </div>
      </div>
    </>
  );
}
