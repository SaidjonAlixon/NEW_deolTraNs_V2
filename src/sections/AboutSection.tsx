import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Activity, Globe, Award, ChevronDown } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '250+', label: 'Power-Only Trucks Nationwide', icon: Activity },
  { value: '48',   label: 'States in Operation',          icon: Globe },
  { value: '100%', label: 'Power-Only Model',             icon: Award },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { openDriverModal } = useDriverApplication();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.8,
        },
      });

      // ENTRANCE via Scroll
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.15, filter: 'blur(0px)' },
        { scale: 1, filter: 'blur(4px)', ease: 'none' },
        0
      );

      scrollTl.fromTo(
        [labelRef.current, headlineRef.current],
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: '5vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.2
      );

      const statCards = statsRef.current?.querySelectorAll('.stat-card');
      if (statCards) {
        scrollTl.fromTo(
          statCards,
          { y: '10vh', opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.1, ease: 'power2.out' },
          0.3
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: '4vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.5
      );

      // No EXIT animation — content stays visible while scrolling

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pinned bg-app relative flex items-center justify-center min-h-screen pt-20"
    >
      {/* Background Image layers */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
      >
        <img
          src="/images/about_truck_motion.png"
          alt="Truck in motion"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-app/80 lg:bg-app/70 backdrop-blur-sm" /> {/* Blur and text-contrast layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-app via-transparent to-app" /> {/* Borders */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col xl:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Column: Text Content */}
        <div className="w-full xl:w-5/12 flex flex-col items-center xl:items-start text-center xl:text-left pt-10 xl:pt-0">
          <p
            ref={labelRef}
            className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-orange mb-4 flex items-center gap-3 justify-center xl:justify-start"
          >
            <span className="w-8 h-px bg-orange"></span>
            About Us
          </p>
          
          <h1
            ref={headlineRef}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 drop-shadow-xl"
          >
            Built for the <br className="hidden xl:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">Business-Minded</span> Driver.
          </h1>
          
          <p
            ref={bodyRef}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl xl:max-w-none drop-shadow-md mb-6"
          >
            Delo Trans Inc was created with one clear mission: help professional drivers maximize revenue while minimizing stress and wasted miles. Our power-only model allows us to stay flexible, efficient, and highly profitable for our partners.
          </p>

          <div ref={ctaRef} className="space-y-6">
            {/* Our Mission */}
            <div className="border-l-2 border-orange/50 pl-4">
              <p className="text-xs font-mono uppercase tracking-widest text-orange mb-1">Our Mission</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To deliver profitable freight solutions for drivers and dependable capacity solutions for shippers — with safety, professionalism, and efficiency at the core.
              </p>
            </div>

            {/* Philosophy */}
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-orange mb-3">Our Philosophy</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Profit over cheap miles',
                  'Efficiency over wasted time',
                  'Partnerships over transactions',
                  'Coast-to-coast coverage',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden xl:block">
              <button
                onClick={openDriverModal}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-card/60 backdrop-blur-md rounded-full border border-border text-foreground font-medium hover:bg-muted/50 hover:border-orange/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <span className="relative z-10">Apply Now</span>
                <div className="relative z-10 w-8 h-8 rounded-full bg-orange/20 flex items-center justify-center group-hover:bg-orange transition-colors">
                  <ArrowRight className="w-4 h-4 text-orange group-hover:text-primary-foreground transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Stats Cards */}
        <div 
          ref={statsRef}
          className="w-full xl:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`stat-card relative group bg-card/50 backdrop-blur-xl rounded-2xl border border-border p-6 sm:p-8 hover:bg-surface/80 hover:border-border transition-all duration-500 overflow-hidden shadow-2xl ${
                index === 2 ? 'sm:col-span-2 xl:col-span-1' : '' // Make 3rd card full width on small screens if needed, otherwise normal grid
              }`}
            >
              {/* Card Ambient Glow */}
              <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row xl:flex-col items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surface to-app border border-border flex items-center justify-center shadow-inner group-hover:border-blue-500/30 group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                  <stat.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-500" />
                </div>
                
                <div>
                  <h3 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-tight group-hover:text-blue-500 transition-all">
                    {stat.value}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Mobile CTA */}
          <div className="sm:col-span-2 xl:hidden flex justify-center mt-4 stat-card">
              <button
                onClick={openDriverModal}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-card/60 backdrop-blur-md rounded-full border border-border text-foreground font-medium hover:bg-muted/50 hover:border-orange/30 transition-all duration-300 w-full justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <span className="relative z-10">Apply Now</span>
                <div className="relative z-10 w-8 h-8 rounded-full bg-orange/20 flex items-center justify-center group-hover:bg-orange transition-colors">
                  <ArrowRight className="w-4 h-4 text-orange group-hover:text-primary-foreground transition-colors" />
                </div>
              </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-28 sm:bottom-8 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
        <div className="relative flex items-center justify-center">
          {/* Outer ring pulse */}
          <span className="absolute w-10 h-10 rounded-full border border-orange/40 animate-ping opacity-70" />
          {/* Icon bouncing */}
          <div className="w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm border border-orange/50 flex items-center justify-center animate-bounce">
            <ChevronDown className="w-4 h-4 text-orange shadow-[0_0_10px_rgba(253,10,7,0.3)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
