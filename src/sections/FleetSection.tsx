import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Truck, DollarSign, Headphones, CheckCircle2, Users, MapPin, Wifi } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { icon: Truck,       label: '250+ Power-Only Units Nationwide' },
  { icon: DollarSign,  label: 'High Rate-Per-Mile Freight Only' },
  { icon: CheckCircle2,label: 'Profit-Focused Operations' },
  { icon: Users,       label: 'Driver-First Dispatch Model' },
  { icon: MapPin,      label: 'Dedicated Lane Availability' },
  { icon: Headphones,  label: '24/7 Professional Support' },
  { icon: Wifi,        label: 'Fast, Fully Remote Onboarding' },
];

const stats = [
  { value: '250+', label: 'Power-Only Units' },
  { value: '48',   label: 'States Covered' },
  { value: '24/7', label: 'Driver Support' },
];

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
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

      // EXIT
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
          alt="Why Delo Trans"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/40" />
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden relative z-[3] flex flex-col justify-between h-full px-5 pt-20 pb-8">
        <p ref={labelRef} className="font-mono text-xs uppercase tracking-[0.14em] text-orange mb-4">Why Delo Trans</p>

        <h2 ref={headlineRef} className="font-heading text-3xl font-bold text-white leading-[1.1] mb-5">
          The carrier that works for <span className="text-orange">you.</span>
        </h2>

        {/* Reasons list */}
        <div ref={bodyRef} className="flex flex-col gap-3 mb-6">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <r.icon className="w-4 h-4 text-orange flex-shrink-0" />
              <span className="text-sm text-white/90">{r.label}</span>
            </div>
          ))}
        </div>

        {/* Stat Cards */}
        <div ref={statsRef} className="grid grid-cols-3 gap-2 mb-7">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card bg-navy-800/80 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center"
            >
              <p className="font-heading text-xl font-bold text-white mb-0.5">{stat.value}</p>
              <p className="text-[10px] text-gray-light">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          ref={ctaRef}
          onClick={openDriverModal}
          className="btn-primary inline-flex items-center justify-center gap-2 w-full"
        >
          Apply Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden lg:block relative z-[3] w-full h-full">
        <div className="absolute left-[6vw] top-[10vh]">
          <p ref={labelRef} className="font-mono text-xs uppercase tracking-[0.14em] text-orange">Why Delo Trans</p>
        </div>

        <div className="absolute left-[6vw] top-[16vh] w-[44vw] max-w-2xl">
          <h2 ref={headlineRef} className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05]">
            The carrier that works <br />for <span className="text-orange">you.</span>
          </h2>
        </div>

        {/* Reasons checklist */}
        <div ref={bodyRef} className="absolute left-[6vw] top-[38vh] w-[42vw]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {reasons.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <r.icon className="w-5 h-5 text-orange flex-shrink-0" />
                <span className="text-base text-white/90 font-medium">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="absolute left-[6vw] top-[72vh] flex flex-wrap gap-4 lg:gap-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card bg-navy-800/80 backdrop-blur-md rounded-xl p-5 lg:p-6 border border-white/10 min-w-[140px] lg:min-w-[160px]"
            >
              <p className="font-heading text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-light">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="absolute left-[6vw] top-[88vh]">
          <button
            ref={ctaRef}
            onClick={openDriverModal}
            className="btn-primary inline-flex items-center gap-2"
          >
            Apply Now — Get $1,000 Bonus
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
