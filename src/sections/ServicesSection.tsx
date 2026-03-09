import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, Train, Plane, Ship, Package, ClipboardCheck, ArrowRight } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Truck,
    title: 'Full Truckload (FTL)',
    description: 'Dedicated capacity, direct transit.',
  },
  {
    icon: Package,
    title: 'Part Loads / LTL',
    description: 'Cost-effective consolidation with reliable scheduling.',
  },
  {
    icon: Train,
    title: 'Rail & Intermodal',
    description: 'Long-haul efficiency with first/last-mile coordination.',
  },
  {
    icon: ClipboardCheck,
    title: 'Cross-Border',
    description: 'Customs prep, docs, and clearance support.',
  },
  {
    icon: Plane,
    title: 'Project Logistics',
    description: 'Oversized, heavy, time-critical shipments.',
  },
  {
    icon: Ship,
    title: 'Warehousing',
    description: 'Short-term storage, cross-dock, and inventory updates.',
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const { openDriverModal } = useDriverApplication();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Image parallax
      gsap.fromTo(
        imageRef.current,
        { x: '-20vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 25%',
            scrub: 0.4,
          },
        }
      );

      // Content fade in
      gsap.fromTo(
        contentRef.current,
        { x: '10vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.4,
          },
        }
      );

      // Service items stagger
      const items = itemsRef.current?.querySelectorAll('.service-item');
      if (items) {
        gsap.fromTo(
          items,
          { x: '8vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: itemsRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 0.4,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen bg-navy-900 py-20 lg:py-0"
    >
      <div className="lg:flex lg:min-h-screen">
        {/* Left Image Panel */}
        <div
          ref={imageRef}
          className="lg:w-[46vw] lg:min-h-screen relative"
        >
          <div className="h-[40vh] lg:h-full relative overflow-hidden">
            <img
              src="/images/chap_truck.png"
              alt="DELO TRANS INC Services"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/50 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-[54vw] lg:min-h-screen flex items-center">
          <div className="px-6 lg:px-12 xl:px-16 py-12 lg:py-20 w-full">
            {/* Header */}
            <div ref={contentRef} className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-orange mb-3">
                Services
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
                What we handle
              </h2>
              <p className="text-gray-light max-w-md">
                From raw materials to finished goods—one partner, many modes.
              </p>
            </div>

            {/* Service Items */}
            <div ref={itemsRef} className="grid sm:grid-cols-2 gap-4 lg:gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="service-item group p-5 lg:p-6 bg-navy-800/50 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-navy-800/80 transition-all duration-300 card-lift"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <service.icon className="w-5 h-5 text-red-600 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white mb-1 group-hover:text-blue-500 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-light group-hover:text-blue-200/80 transition-colors">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <button
                onClick={openDriverModal}
                className="btn-primary inline-flex items-center gap-2"
              >
                Get a tailored plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
