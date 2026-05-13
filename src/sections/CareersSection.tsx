import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, DollarSign, Truck, MapPin, ChevronDown } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

const ownerOpStats = [
  { icon: DollarSign, value: '12%',           label: 'Dispatch Fee' },
  { icon: DollarSign, value: '$8K–$12K+',     label: 'Gross Per Week' },
  { icon: Truck,      value: '$2.20–$3.00+',  label: 'Per Mile' },
  { icon: MapPin,     value: 'Anywhere',      label: 'Start Location' },
];

export default function CareersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { openDriverModal } = useDriverApplication();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation (Immediate)
      const entranceTl = gsap.timeline();

      entranceTl.fromTo([labelRef.current, headlineRef.current],
        { y: '30px', opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.2);

      entranceTl.fromTo(bodyRef.current,
        { y: '20px', opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.4);

      const items = benefitsRef.current?.querySelectorAll('.benefit-item');
      if (items) {
        entranceTl.fromTo(items,
          { y: '20px', opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 0.5);
      }

      entranceTl.fromTo(ctaRef.current,
        { y: '15px', opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.8);

      // 2. Scroll-based Effects (Scrubbed)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
        },
      });

      scrollTl.fromTo(bgRef.current,
        { scale: 1.15 }, { scale: 1, ease: 'none' }, 0);

      // We can also add a subtle fade out of content as we scroll deep if desired, 
      // but the requirement was to make it appear without waiting for scroll.
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="careers"
      className="section-pinned bg-app relative flex items-center min-h-screen pt-20 overflow-hidden"
    >
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 z-[1]">
        <img src="/images/careers_driver.jpg" alt="Professional driver" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-app/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-app via-transparent to-app" />
      </div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange/10 rounded-full blur-[120px] z-[2] pointer-events-none hidden lg:block" />

      {/* Content */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

        {/* Left: Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <p ref={labelRef} className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-orange mb-4 flex items-center gap-3 justify-center lg:justify-start">
            <span className="w-8 h-px bg-orange" />
            Owner Operators
          </p>

          <h1 ref={headlineRef} className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-4 drop-shadow-xl">
            If You Run Your Truck<br />Like a Business —<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">We're Your Partner.</span>
          </h1>

          <p ref={bodyRef} className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-2">
            High rate-per-mile freight only. Profit-focused operations. Driver-first dispatch model. Start anywhere in the U.S.
          </p>

          <div ref={ctaRef} className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openDriverModal()}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-orange text-white rounded-full font-medium hover:bg-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(253,10,7,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10">Apply Now</span>
              <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Right: Stats */}
        <div ref={benefitsRef} className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
          {ownerOpStats.map((stat, index) => (
            <div
              key={index}
              className="benefit-item group relative bg-card/70 backdrop-blur-xl rounded-2xl border border-border p-5 hover:bg-surface/90 hover:border-orange/20 transition-all duration-500 shadow-xl overflow-hidden"
            >
              <div className="absolute -inset-px bg-gradient-to-br from-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-orange" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}

          {/* Company Drivers teaser card */}
          <div className="benefit-item col-span-2 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
            <p className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-1">Company Drivers</p>
            <p className="text-sm font-semibold text-foreground mb-0.5">Drive With a Carrier That Respects Your Time</p>
            <p className="text-xs text-muted-foreground">Consistent loads · Supportive dispatch · Nationwide routes</p>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-28 sm:bottom-8 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
        <div className="relative flex items-center justify-center">
          <span className="absolute w-10 h-10 rounded-full border border-orange/40 animate-ping opacity-70" />
          <div className="w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm border border-orange/50 flex items-center justify-center animate-bounce">
            <ChevronDown className="w-4 h-4 text-orange shadow-[0_0_10px_rgba(253,10,7,0.3)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
