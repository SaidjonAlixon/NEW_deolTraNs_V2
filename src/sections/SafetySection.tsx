import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Shield, Users, Scan, Umbrella } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const checklist = [
  { text: 'Driver training & fatigue management', icon: Users },
  { text: 'Daily vehicle inspections', icon: Check },
  { text: 'Real-time tracking & geofencing', icon: Scan },
  { text: 'Cargo insurance options', icon: Umbrella },
];

export default function SafetySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

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
        { scale: 1.08, opacity: 0.7 },
        { scale: 1, opacity: 1, ease: 'none' },
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

      const checkItems = checklistRef.current?.querySelectorAll('.check-item');
      if (checkItems) {
        scrollTl.fromTo(
          checkItems,
          { x: '-8vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.04, ease: 'none' },
          0.15
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        [labelRef.current, headlineRef.current, bodyRef.current],
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (checkItems) {
        scrollTl.fromTo(
          checkItems,
          { x: 0, opacity: 1 },
          { x: '-6vw', opacity: 0, ease: 'power2.in' },
          0.72
        );
      }

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.03, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="safety"
      className="section-pinned bg-navy-900"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
      >
        <img
          src="/images/delo_truc_ombor.png"
          alt="Warehouse safety"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-[3] w-full h-full flex items-center">
        <div className="absolute left-[6vw] top-[10vh]">
          <p
            ref={labelRef}
            className="font-mono text-xs uppercase tracking-[0.14em] text-orange"
          >
            Safety
          </p>
        </div>

        <div className="absolute left-[6vw] top-[14vh] lg:top-[16vh] w-[88vw] lg:w-[40vw] max-w-xl">
          <h2
            ref={headlineRef}
            className="font-heading text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05]"
          >
            Safety is standard.
          </h2>
        </div>

        <div className="absolute left-[6vw] top-[24vh] lg:top-[28vh] w-[88vw] lg:w-[34vw] max-w-lg">
          <p
            ref={bodyRef}
            className="text-[15px] sm:text-base lg:text-lg text-gray-light leading-relaxed"
          >
            Certified processes, trained drivers, and transparent accountability—on every shipment.
          </p>
        </div>

        {/* Checklist */}
        <div
          ref={checklistRef}
          className="absolute left-[6vw] top-[36vh] lg:top-[44vh] w-[88vw] lg:w-[34vw] max-w-lg space-y-2 lg:space-y-3"
        >
          {checklist.map((item, index) => (
            <div
              key={index}
              className="check-item flex items-center gap-3 p-2.5 lg:p-3 bg-navy-800/60 backdrop-blur-sm rounded-lg border border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-orange" />
              </div>
              <span className="text-sm font-medium text-white">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="absolute left-[6vw] bottom-[10vh] lg:bottom-auto lg:top-[76vh]">
          <button
            ref={ctaRef}
            onClick={() => alert('Safety policy download coming soon!')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Download safety policy
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
