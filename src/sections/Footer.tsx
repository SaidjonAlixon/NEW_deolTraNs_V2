import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: 'HOME', path: '/' },
  { label: 'ABOUT', path: '/about' },
  { label: 'DRIVERS', path: '/drivers' },
  { label: 'CONTACT', path: '/contact' },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={sectionRef}
      className="bg-navy-900 border-t border-white/5 pt-12 pb-8"
    >
      <div ref={containerRef} className="px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
        {/* Left Side: Logo */}
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/logo.png"
              alt="DELO TRANS INC"
              className="h-32 lg:h-44 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            />
          </Link>
        </div>

        {/* Right Side: Navigation & Scroll Top */}
        <div className="flex items-center justify-end gap-8 md:w-2/3">
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => window.scrollTo(0, 0)}
                className="text-sm font-medium text-gray-light hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-orange transition-colors group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 text-white group-hover:animate-bounce" />
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pt-8 border-t border-white/5 mx-6 lg:mx-12">
        <p className="text-xs text-gray-light/60">
          © 2026 DELO TRANS INC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

