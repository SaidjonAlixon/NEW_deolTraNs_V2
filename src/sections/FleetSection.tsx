import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Gauge, Shield, Headphones } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '220+', label: 'Tractors & trailers', icon: Gauge },
  { value: 'EURO 5-6', label: 'Emission standard', icon: Shield },
  { value: '24/7', label: 'Telemetry & support', icon: Headphones },
];

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
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
        { scale: 1.10, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        [labelRef.current, headlineRef.current],
        { x: '-18vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      const statCards = statsRef.current?.querySelectorAll('.stat-card');
      if (statCards) {
        scrollTl.fromTo(
          statCards,
          { y: '12vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, ease: 'none' },
          0.15
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        [labelRef.current, headlineRef.current, bodyRef.current],
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (statCards) {
        scrollTl.fromTo(
          statCards,
          { y: 0, opacity: 1 },
          { y: '10vh', opacity: 0, ease: 'power2.in' },
          0.72
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '8vh', opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.04, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="section-pinned bg-navy-900"
    >
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 z-[1]">
        <img
          src="/images/fleet_truck_detail.png"
          alt="Modern truck detail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/40" />
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden relative z-[3] flex flex-col justify-between h-full px-5 pt-20 pb-8">
        <p ref={labelRef} className="font-mono text-xs uppercase tracking-[0.14em] text-orange mb-4">Fleet</p>

        <h2 ref={headlineRef} className="font-heading text-3xl font-bold text-white leading-[1.1] mb-4">
          Modern equipment. Meticulous maintenance.
        </h2>

        <p ref={bodyRef} className="text-sm text-gray-light leading-relaxed mb-6">
          We invest in reliability—low emissions, high uptime, and strict safety checks on every unit.
        </p>

        {/* Stat Cards */}
        <div ref={statsRef} className="grid grid-cols-2 gap-3 mb-7">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card bg-navy-800/80 backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <div className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center mb-3">
                <stat.icon className="w-4 h-4 text-orange" />
              </div>
              <p className="font-heading text-2xl font-bold text-white mb-0.5">{stat.value}</p>
              <p className="text-xs text-gray-light">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          ref={ctaRef}
          onClick={openDriverModal}
          className="btn-primary inline-flex items-center justify-center gap-2 w-full"
        >
          See fleet specs
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden lg:block relative z-[3] w-full h-full">
        <div className="absolute left-[6vw] top-[10vh]">
          <p ref={labelRef} className="font-mono text-xs uppercase tracking-[0.14em] text-orange">Fleet</p>
        </div>

        <div className="absolute left-[6vw] top-[16vh] w-[46vw] max-w-2xl">
          <h2 ref={headlineRef} className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05]">
            Modern equipment. Meticulous maintenance.
          </h2>
        </div>

        <div className="absolute left-[6vw] top-[38vh] w-[34vw] max-w-lg">
          <p ref={bodyRef} className="text-base lg:text-lg text-gray-light leading-relaxed">
            We invest in reliability—low emissions, high uptime, and strict safety checks on every unit.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="absolute left-[6vw] top-[52vh] flex flex-wrap gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card bg-navy-800/80 backdrop-blur-md rounded-xl p-5 lg:p-6 border border-white/10 min-w-[140px] lg:min-w-[160px]"
            >
              <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center mb-4">
                <stat.icon className="w-5 h-5 text-orange" />
              </div>
              <p className="font-heading text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-light">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="absolute left-[6vw] top-[78vh]">
          <button
            ref={ctaRef}
            onClick={openDriverModal}
            className="btn-primary inline-flex items-center gap-2"
          >
            See fleet specs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
