import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Globe, Route } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

const routesLeft = [
  {
    from: 'Texas',
    to: 'California',
    description: 'High-frequency corridors linking the South to the West Coast.',
    icon: Route,
  },
  {
    from: 'Illinois',
    to: 'Georgia',
    description: 'Regular FTL capacity between the Midwest and the Southeast.',
    icon: Globe,
  },
  {
    from: 'New Jersey',
    to: 'Florida',
    description: 'Consistent North–South lanes along the Eastern Seaboard.',
    icon: MapPin,
  },
];

const routesRight = [
  {
    from: 'Ohio',
    to: 'Texas',
    description: 'Industrial and retail flows between the Great Lakes and the South.',
    icon: Globe,
  },
  {
    from: 'Washington',
    to: 'Arizona',
    description: 'Reliable capacity serving the Pacific Northwest to the Southwest.',
    icon: Route,
  },
  {
    from: 'Tennessee',
    to: 'North Carolina',
    description: 'Short-haul and regional lanes across the Appalachian corridor.',
    icon: Globe,
  },
];

const routes = [...routesLeft, ...routesRight];

export default function CoverageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const routesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const { openDriverModal } = useDriverApplication();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        bgRef.current,
        { x: '-6vw', scale: 1.08, opacity: 0.7 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        [labelRef.current, headlineRef.current],
        { x: '-16vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: '5vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      const routeCards = routesRef.current?.querySelectorAll('.route-card');
      
      if (routeCards) {
        scrollTl.fromTo(
          routeCards,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out' }, // Smooth fade-in + slight upward movement
          0.15
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.8 // delay cta until routes load
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        [labelRef.current, headlineRef.current, bodyRef.current],
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        1.5
      );

      if (routeCards) {
        scrollTl.fromTo(
          routeCards,
          { y: 0, opacity: 1 },
          { y: -30, opacity: 0, stagger: 0.05, ease: 'power2.in' },
          1.52
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        1.55
      );

      scrollTl.fromTo(
        bgRef.current,
        { x: 0, scale: 1, opacity: 1 },
        { x: '6vw', scale: 1.03, opacity: 0, ease: 'power2.in' },
        1.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="coverage"
      className="section-pinned bg-app"
    >
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 z-[1]">
        <img
          src="/images/coverage_highway.jpg"
          alt="Highway at dusk"
          className="w-full h-full object-cover img-industrial"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-app/95 via-app/70 to-app/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-app via-transparent to-app/40" />
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden relative z-[3] flex flex-col h-full px-5 pt-20 pb-8 overflow-y-auto">
        <p ref={labelRef} className="font-mono text-xs uppercase tracking-[0.14em] text-[#fd0a07] mb-4">Coverage</p>

        <h2 ref={headlineRef} className="font-heading text-3xl font-bold text-white leading-[1.1] mb-4">
          Where we deliver
        </h2>

        <p ref={bodyRef} className="text-sm text-gray-light leading-relaxed mb-6">
          Leading power-only capacity solutions covering all 48 continental U.S. states.
        </p>

        {/* Route Cards */}
        <div ref={routesRef} className="flex flex-col gap-3 mb-7">
          {routes.map((route, index) => (
            <div
              key={index}
              className="route-card group flex items-center gap-4 p-4 bg-surface/70 backdrop-blur-xl rounded-xl border border-white/8 hover:border-[#fd0a07]/40 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#fd0a07]/10 flex items-center justify-center flex-shrink-0">
                <route.icon className="w-5 h-5 text-[#fd0a07]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-heading font-semibold text-white text-sm">{route.from}</span>
                  <span className="text-[#fd0a07] text-xs">⇄</span>
                  <span className="font-heading font-semibold text-white text-sm">{route.to}</span>
                </div>
                <p className="text-xs text-gray-light">{route.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          ref={ctaRef}
          onClick={() => openDriverModal()}
          className="btn-primary inline-flex items-center justify-center gap-2 w-full !bg-[#fd0a07] hover:!bg-red-700"
        >
          Apply Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden lg:block relative z-[3] w-full h-full">
        <div className="absolute left-[6vw] top-[10vh]">
          <p ref={labelRef} className="font-mono text-xs uppercase tracking-[0.14em] text-[#fd0a07]">Coverage</p>
        </div>

        <div className="absolute left-[6vw] top-[16vh] w-[40vw] max-w-xl">
          <h2 ref={headlineRef} className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05]">
            Where we deliver
          </h2>
        </div>

        <div className="absolute left-[6vw] top-[30vh] w-[34vw] max-w-lg">
          <p ref={bodyRef} className="text-base lg:text-lg text-gray-light leading-relaxed">
            Leading power-only capacity solutions covering all 48 continental U.S. states.
          </p>
        </div>

        {/* Routes Grid */}
        <div
          ref={routesRef}
          className="absolute left-[6vw] right-[6vw] top-[44vh] grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 overflow-hidden lg:overflow-visible pb-4"
        >
          {/* Left column – red cards */}
          <div className="space-y-4">
            {routesLeft.map((route, index) => (
              <div
                key={`left-${index}`}
                className="route-card group flex items-center gap-4 p-4 bg-surface/60 backdrop-blur-xl rounded-xl border border-white/5 hover:border-[#fd0a07]/50 hover:bg-surface/80 hover:shadow-[0_0_15px_rgba(253,10,7,0.3)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#fd0a07]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#fd0a07]/20 transition-colors">
                  <route.icon className="w-5 h-5 text-[#fd0a07]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-semibold text-white">{route.from}</span>
                    <span className="text-[#fd0a07]">⇄</span>
                    <span className="font-heading font-semibold text-white">{route.to}</span>
                  </div>
                  <p className="text-sm text-gray-light leading-snug">{route.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right column – blue cards */}
          <div className="space-y-4">
            {routesRight.map((route, index) => (
              <div
                key={`right-${index}`}
                className="route-card group flex items-center gap-4 p-4 bg-surface/60 backdrop-blur-xl rounded-xl border border-white/5 hover:border-[#005E99]/50 hover:bg-surface/80 hover:shadow-[0_0_15px_rgba(0,94,153,0.3)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#005E99]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#005E99]/20 transition-colors">
                  <route.icon className="w-5 h-5 text-[#005E99]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-semibold text-white">{route.from}</span>
                    <span className="text-[#005E99]">⇄</span>
                    <span className="font-heading font-semibold text-white">{route.to}</span>
                  </div>
                  <p className="text-sm text-gray-light leading-snug">{route.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="absolute left-[6vw] top-[85vh]">
          <button
            ref={ctaRef}
            onClick={() => openDriverModal()}
            className="btn-primary inline-flex items-center gap-2 !bg-[#fd0a07] hover:!bg-red-700 hover:!shadow-[0_0_20px_rgba(253,10,7,0.5)]"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
