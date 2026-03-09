import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, DollarSign, Truck, Headphones, TrendingUp } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { text: 'Competitive pay + bonuses', icon: DollarSign },
  { text: 'Modern, well-maintained fleet', icon: Truck },
  { text: '24/7 dispatch support', icon: Headphones },
  { text: 'Career progression', icon: TrendingUp },
];

export default function CareersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
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

      const benefitItems = benefitsRef.current?.querySelectorAll('.benefit-item');
      if (benefitItems) {
        scrollTl.fromTo(
          benefitItems,
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

      if (benefitItems) {
        scrollTl.fromTo(
          benefitItems,
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
      id="careers"
      className="section-pinned bg-navy-900"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
      >
        <img
          src="/images/careers_driver.jpg"
          alt="Professional driver"
          className="w-full h-full object-cover img-industrial"
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
            Careers
          </p>
        </div>

        <div className="absolute left-[6vw] top-[16vh] w-[44vw] max-w-2xl">
          <h2
            ref={headlineRef}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05]"
          >
            Drivers wanted. Respect guaranteed.
          </h2>
        </div>

        <div className="absolute left-[6vw] top-[34vh] w-[34vw] max-w-lg">
          <p
            ref={bodyRef}
            className="text-base lg:text-lg text-gray-light leading-relaxed"
          >
            Stable routes, modern trucks, and a team that answers the phone when you need help.
          </p>
        </div>

        {/* Benefits */}
        <div
          ref={benefitsRef}
          className="absolute left-[6vw] top-[48vh] w-[34vw] max-w-lg grid grid-cols-2 gap-3"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-item flex items-center gap-3 p-3 bg-navy-800/60 backdrop-blur-sm rounded-lg border border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-4 h-4 text-orange" />
              </div>
              <span className="text-sm text-white">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="absolute left-[6vw] top-[74vh]">
          <button
            ref={ctaRef}
            onClick={openDriverModal}
            className="btn-primary inline-flex items-center gap-2"
          >
            Apply now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
