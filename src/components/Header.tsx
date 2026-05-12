import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ThemeModeToggle from './ThemeModeToggle';

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
  const navigate = useNavigate();

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
        className="fixed top-2 lg:top-4 left-0 right-0 z-[1000] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="max-w-[1920px] mx-auto w-full px-3 lg:px-8">
          <div className={`grid grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 relative transition-all duration-500 rounded-2xl lg:rounded-3xl ${isScrolled || location.pathname !== '/' ? 'bg-header-bar/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-14 lg:h-[76px] px-4 lg:px-8' : 'bg-header-bar/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border border-white/5 lg:border-transparent h-16 lg:h-[90px] px-4 lg:px-4'}`}>
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 z-50 flex items-center group relative h-full justify-self-start min-w-0"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="relative h-14 lg:h-20 w-[140px] lg:w-[180px] flex items-center">
                <img
                  ref={logoRef}
                  src="/images/logo.png"
                  alt="DELO TRANS INC"
                  className={`absolute left-0 w-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out hover:scale-[1.03] z-50 origin-left ${isScrolled || location.pathname !== '/' ? 'h-10 lg:h-16 top-2 lg:top-2' : 'h-14 lg:h-[110px] top-[4px] lg:top-[14px]'}`}
                />
              </div>
            </Link>

            {/* Desktop Navigation - Floating Pill (grid center column — avoids overlap with CTAs) */}
            <nav className="hidden lg:flex justify-self-center items-center bg-card/60 backdrop-blur-md border border-border/20 rounded-full p-1.5 shadow-lg shrink-0">
              {navLinks.map((link) => {
                const isCurrentPage = location.pathname === link.path;

                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="relative group px-6 py-2.5 flex items-center justify-center transition-all duration-500 rounded-full overflow-hidden"
                  >
                    {/* Hover Background Layer */}
                    <span className={`absolute inset-0 transition-opacity duration-300 rounded-full ${isCurrentPage ? 'bg-white/10 opacity-100' : 'bg-white/5 opacity-0 group-hover:opacity-100'}`} />
                    
                    <span
                      className={`header-nav-link-text relative text-[13px] font-bold tracking-[0.1em] transition-all duration-300 ${isCurrentPage ? 'header-nav-link-text--active text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'header-nav-link-text--idle text-muted-foreground group-hover:text-foreground'
                        }`}
                    >
                      {link.label}
                    </span>
                    
                    {/* Active Indicator Line rather than dot, but sophisticated */}
                    {isCurrentPage && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-red-500 rounded-t-lg shadow-[0_-2px_8px_rgba(239,68,68,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Elements — theme toggle at far right, clear of nav */}
            <div className="hidden lg:flex items-center justify-end gap-3 xl:gap-4 z-10 relative justify-self-end shrink-0 min-w-0">
              <a
                href="tel:+13262207171"
                className="flex items-center gap-2 group bg-card/40 hover:bg-card/60 border border-border/20 pr-4 pl-1.5 py-1.5 rounded-full transition-all duration-300 shrink-0 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Phone className="w-[14px] h-[14px] text-red-500" />
                </div>
                <span className="text-[13px] font-semibold text-foreground group-hover:text-red-600 transition-colors whitespace-nowrap">
                  +1 326 220 7171
                </span>
              </a>
              <button
                type="button"
                onClick={() => navigate('/apply')}
                className="relative overflow-hidden group bg-red-600 text-white px-7 py-3.5 rounded-full text-[13px] font-bold tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 shrink-0"
              >
                <span className="relative z-10">Apply Now</span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-red-600 via-white/20 to-red-600 -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </button>
              <ThemeModeToggle className="shrink-0 ml-0.5" />
            </div>

            {/* Mobile Menu Button Container */}
            <div className="flex lg:hidden items-center gap-2 z-[110] relative justify-self-end">
              <ThemeModeToggle className="shrink-0" />
              <button
                className="relative p-2 text-foreground bg-card/60 hover:bg-card/80 border border-border/40 rounded-xl transition-colors outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`header-mobile-overlay fixed inset-0 z-[999] bg-app/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
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
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/apply');
            }}
            className="btn-primary mt-8"
          >
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
}
