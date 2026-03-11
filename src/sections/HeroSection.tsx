import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe, MapPin, ChevronDown } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { openDriverModal } = useDriverApplication();
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const words = ["OWNER OPERATORS.", "HIGH EARNINGS.", "YOUR FUTURE.", "THE ROAD AHEAD."];
  const descriptions = [
    "Power-Only Carrier built for Owner Operators — 250+ units nationwide and growing. We haul your trailer, you keep more of your money.",
    "Sign-On Bonuses up to $1,000 for qualified drivers. Join a carrier that puts your profit first, from day one.",
    "Drive less, stress less, earn more. Our optimized dispatch keeps you moving on the best-paying lanes coast to coast.",
    "Now hiring Owner Operators & Company Drivers nationwide. Flexible home-time options and top-tier freight every week.",
    "We handle dispatch, paperwork, and fuel advances — so you can focus on the road and growing your bottom line.",
    "High-paying freight, consistent miles, and a team that actually picks up the phone. That's the Delo Trans difference.",
    "No forced dispatch, no hidden fees. Transparent contracts and weekly settlements you can count on.",
    "Our dedicated support team is available 24/7 to help you stay on schedule and maximize every mile you drive.",
    "Join 250+ owner operators who chose Delo Trans Inc. for reliable loads, great pay, and a carrier that cares.",
    "Profit-first operations means every decision we make is designed to put more money in your pocket every week."
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  // Counters for the stats bar
  const [stats, setStats] = useState({
    shipments: 0,
    countries: 0,
    vehicles: 0,
    experience: 0,
  });
  // Sign-on bonus display
  const SIGN_ON_BONUS = '$1,000';

  useEffect(() => {
    const singleInterval = setInterval(() => {
      // 10 ta description bor, 4 ta qisqa words bor.
      // Modulo % operatorlari bilan ularni tegishli array index'ida ushlaymiz.
      setActiveIndex((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(singleInterval);
  }, []);

  useEffect(() => {
    // GSAP entrance needs about 3s to completely finish (Card B comes in at 2.0s + 0.9s dur).
    // Start alternating cards every 2000ms after a 3.5 second initial delay
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveCard((prev) => (prev === 0 ? 1 : 0));
      }, 2000);
      return () => clearInterval(interval);
    }, 3500);
    return () => clearTimeout(timeout);
  }, []);

  const currentWordIndex = activeIndex % words.length;
  const currentDescIndex = activeIndex % descriptions.length;

  // Auto-play entrance animation on load
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background fade in
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.2 },
        0
      );

      // Headline slide in
      tl.fromTo(
        headlineRef.current,
        { x: '-12vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 1 },
        0.2
      );

      // Card A slide in (1 second from load)
      tl.fromTo(
        cardARef.current,
        { x: '55vw', opacity: 0, rotate: 1 },
        { x: 0, opacity: 1, rotate: 0, duration: 0.9 },
        1.0
      );

      // Card B slide in (1 second after Card A -> 1.0 + 1.0 = 2.0)
      tl.fromTo(
        cardBRef.current,
        { x: '55vw', opacity: 0, rotate: -1 },
        { x: 0, opacity: 1, rotate: 0, duration: 0.9 },
        2.0
      );

      // CTA fade in
      tl.fromTo(
        ctaRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        2.5
      );

      // Stats stagger in from bottom
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          2.8
        );

        // Animate numbers
        const countObj = { shipments: 0, countries: 0, vehicles: 0, experience: 0 };
        tl.to(
          countObj,
          {
            shipments: 1000,
            countries: 48,
            vehicles: 250,
            experience: 10,
            duration: 1.5,
            ease: 'power3.out',
            onUpdate: () => {
              setStats({
                shipments: Math.floor(countObj.shipments),
                countries: Math.floor(countObj.countries),
                vehicles: Math.floor(countObj.vehicles),
                experience: Math.floor(countObj.experience),
              });
            },
          },
          3.0 // Start counting slightly after stats fade in
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          pin: true,
          pinSpacing: true, // Sahifa bo'shlig'i qolishi va background pastga tushib ketmasligini ta'minlaydi
          scrub: 0.6,
        },
      });

      // Background video scales slightly for a parallax effect before unpinning 
      // Hech qanday content fade out yoki x oqi bo'yicha siljib ketmaydi.
      scrollTl.to(
        bgRef.current,
        { scale: 1.05, ease: 'power2.in' },
        0.1
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned bg-navy-900"
    >
      {/* Background Video */}
      <div ref={bgRef} className="absolute inset-0 z-[1]">
        <video
          src="/images/Logistics.mp4"
          autoPlay
          muted
          playsInline
          onLoadedMetadata={(e) => { e.currentTarget.currentTime = 5; }}
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (video.duration && video.currentTime >= video.duration - 10) {
              video.currentTime = 5;
              video.play().catch(console.error);
            }
          }}
          className="w-full h-full object-cover img-industrial"
        />
        <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm transition-colors duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-transparent w-[70%]"></div>
      </div>

      {/* ─── MOBILE LAYOUT (hidden on lg+) ─── */}
      <div className="lg:hidden relative z-[3] flex flex-col justify-between h-full px-5 pt-24 pb-6">
        {/* Badge */}
        <div className="flex items-center gap-3 mt-4 mb-5">
          <div className="h-[2px] w-8 bg-orange shadow-[0_0_10px_rgba(253,10,7,0.8)]"></div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] font-black text-orange drop-shadow-[0_0_8px_rgba(253,10,7,0.7)]">
            Welcome DELO TRANS INC
          </p>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-[2.4rem] leading-[1.05] font-bold text-white tracking-tight mb-5 uppercase drop-shadow-2xl">
          POWER-ONLY CARRIER<br />BUILT FOR{' '}
          <span className="text-[#fd0a07] font-black" style={{ textShadow: '0 0 25px rgba(253,10,7,0.8)' }}>
            {words[currentWordIndex]}
          </span>
        </h1>

        {/* Description */}
        <div className="border-l-2 border-orange/50 pl-4 py-3 bg-gradient-to-r from-navy-900/60 to-transparent backdrop-blur-sm rounded-r-xl mb-6">
          <p className="text-sm text-white/90 leading-relaxed font-light">
            {descriptions[currentDescIndex]}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-7">
          {[
            { value: `${stats.vehicles}+`, label: 'Units Nationwide' },
            { value: SIGN_ON_BONUS, label: 'Sign-On Bonus' },
            { value: `${stats.countries}+`, label: 'States Covered' },
            { value: `${stats.experience}+ yrs`, label: 'In Business' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/8 rounded-xl px-4 py-3 text-center">
              <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button
            onClick={openDriverModal}
            className="btn-primary flex items-center gap-2 flex-1 justify-center"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('#services')}
            className="btn-secondary"
          >
            Learn More
          </button>
        </div>
        {/* Scroll Indicator (Mobile) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 animate-bounce pointer-events-none z-[50]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (hidden on mobile) ─── */}
      <div className="hidden lg:block relative z-[3] w-full h-full">
        {/* Left Headline & Text */}
        <div
          ref={headlineRef}
          className="absolute left-[8vw] top-[24vh] w-[40vw] z-10"
          style={{ opacity: 0, transform: 'translateX(-12vw)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-12 bg-orange shadow-[0_0_10px_rgba(253,10,7,0.8)]"></div>
            <p className="font-mono text-sm uppercase tracking-[0.2em] font-black text-orange drop-shadow-[0_0_8px_rgba(253,10,7,0.7)]">
              Welcome DELO TRANS INC
            </p>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl uppercase">
            POWER-ONLY CARRIER<br />BUILT FOR{' '}
            <span className="text-[#fd0a07] inline-grid align-bottom ml-3 font-black tracking-wide" style={{ textShadow: '0 0 35px rgba(253,10,7,0.8)' }}>
              <span key={currentWordIndex} className="col-start-1 row-start-1 animate-slide-up whitespace-nowrap">
                {words[currentWordIndex]}
              </span>
              <span className="col-start-1 row-start-1 opacity-0 pointer-events-none whitespace-nowrap">OWNER OPERATORS.</span>
            </span>
          </h1>

          <div className="mt-4 border-l-2 border-orange/50 pl-6 py-4 bg-gradient-to-r from-navy-900/60 to-transparent backdrop-blur-sm rounded-r-xl w-full max-w-[600px] min-h-[100px] flex items-center">
            <p key={`desc-${currentDescIndex}`} className="text-base lg:text-lg text-white/95 leading-relaxed drop-shadow-lg font-light animate-fade-in w-full">
              {descriptions[currentDescIndex]}
            </p>
          </div>
        </div>

        {/* Card A */}
        <div
          ref={cardARef}
          className="absolute left-[56vw] top-[15vh] w-[36vw] max-w-lg z-20"
          style={{ opacity: 0, transform: 'translateX(100vw)' }}
        >
          <div className={`w-full h-full bg-black/40 backdrop-blur-2xl rounded-tr-3xl rounded-bl-3xl p-8 border-t-[3px] border-r-2 shadow-[0_0_50px_rgba(253,10,7,0.15)] hover:border-orange/50 hover:shadow-[0_0_60px_rgba(253,10,7,0.3)] transition-all duration-700 card-lift group overflow-hidden ${activeCard === 0 ? 'scale-105 opacity-100 border-orange/80 shadow-[0_0_60px_rgba(253,10,7,0.4)]' : 'scale-95 opacity-50 border-white/20 shadow-[0_0_30px_rgba(253,10,7,0.15)]'}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange/20 to-transparent pointer-events-none rounded-tr-3xl"></div>
            <div className="absolute -bottom-1 -left-1 w-12 h-[3px] bg-orange group-hover:w-full transition-all duration-700"></div>
            <div className="absolute -bottom-1 -left-1 h-12 w-[3px] bg-orange group-hover:h-full transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-navy-900/80 flex items-center justify-center border border-orange/40 shadow-[0_0_20px_rgba(253,10,7,0.4)] group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7 text-orange" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] text-orange/80 tracking-[0.2em] mb-1">NOW HIRING</p>
                    <h3 className="font-heading font-bold text-2xl text-white drop-shadow-md tracking-wide">Owner Operators</h3>
                  </div>
                </div>
              </div>
              <p className="text-sm lg:text-base text-gray-300 leading-relaxed font-light mb-6 drop-shadow">
                Sign-On Bonuses up to $1,000. High-paying freight, consistent miles, and profit-first operations designed to maximize your earnings every week.
              </p>
              <div className="flex items-center justify-between w-full border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 cursor-pointer text-orange text-sm font-bold tracking-[0.15em] uppercase hover:text-white transition-colors">
                  <span className="group-hover:translate-x-2 transition-transform">Deploy Unit</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange shadow-[0_0_5px_rgba(253,10,7,0.8)] animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange/40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div
          ref={cardBRef}
          className="absolute left-[62vw] top-[48vh] w-[34vw] max-w-md z-10"
          style={{ opacity: 0, transform: 'translateX(100vw)' }}
        >
          <div className={`w-full h-full bg-navy-950/60 backdrop-blur-3xl rounded-tl-3xl rounded-br-3xl p-8 border-b-[3px] border-l-2 hover:border-blue-400/60 transition-all duration-700 card-lift group overflow-hidden ${activeCard === 1 ? 'scale-105 opacity-100 border-blue-500/80 shadow-[0_0_60px_rgba(59,130,246,0.5)]' : 'scale-95 opacity-50 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]'}`}>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none rounded-bl-3xl"></div>
            <div className="absolute top-0 right-0 w-8 h-[3px] bg-blue-500 group-hover:w-full transition-all duration-700"></div>
            <div className="absolute top-0 right-0 h-8 w-[3px] bg-blue-500 group-hover:h-full transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:rotate-12 transition-transform">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-blue-400/80 tracking-[0.2em] mb-1">COMPANY DRIVERS</p>
                    <h3 className="font-heading font-bold text-xl text-white drop-shadow-md tracking-wide">Drive Less. Earn More.</h3>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-light mb-6 drop-shadow">
                Now hiring Company Drivers nationwide. Competitive pay packages, home-time flexibility, and a support team that has your back 24/7.
              </p>
              <div className="flex items-center justify-between w-full border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 cursor-pointer text-blue-400 text-sm font-bold tracking-[0.15em] uppercase hover:text-white transition-colors">
                  <span className="group-hover:translate-x-2 transition-transform">Initialize Route</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
                <div className="border border-blue-500/30 rounded px-2 py-1 text-[10px] text-blue-400 tracking-wider">SYS.ONLINE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop CTA */}
        <div
          ref={ctaRef}
          className="absolute left-[62vw] top-[82vh] flex items-center gap-4 z-20"
        >
          <button onClick={openDriverModal} className="btn-primary flex items-center gap-2">
            Apply Now — Get $1,000 Bonus
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => scrollToSection('#services')} className="btn-secondary">
            Learn More
          </button>
        </div>

        {/* Stats Bar (Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 z-[4]">
          <div className="px-6 lg:px-12 py-4 lg:py-6">
            <div ref={statsRef} className="grid grid-cols-4 gap-8">
              <div className="text-left" style={{ opacity: 0 }}>
                <p className="font-heading text-3xl font-bold text-white drop-shadow-md">{stats.vehicles}+</p>
                <p className="text-xs text-gray-light mt-1">Units Nationwide</p>
              </div>
              <div className="text-left" style={{ opacity: 0 }}>
                <p className="font-heading text-3xl font-bold text-white drop-shadow-md">$1,000</p>
                <p className="text-xs text-gray-light mt-1">Sign-On Bonus</p>
              </div>
              <div className="text-left" style={{ opacity: 0 }}>
                <p className="font-heading text-3xl font-bold text-white drop-shadow-md">{stats.countries}+</p>
                <p className="text-xs text-gray-light mt-1">States Covered</p>
              </div>
              <div className="text-left" style={{ opacity: 0 }}>
                <p className="font-heading text-3xl font-bold text-white drop-shadow-md">{stats.experience}+ yrs</p>
                <p className="text-xs text-gray-light mt-1">In Business</p>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator (Desktop) */}
        <div className="absolute bottom-10 left-[4.5vw] flex flex-col items-center gap-2 opacity-50 animate-bounce cursor-pointer z-[10]" onClick={() => scrollToSection('#services')}>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 [writing-mode:vertical-lr]">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </div>
    </section>
  );
}

