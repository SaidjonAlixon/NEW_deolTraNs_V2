import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Package, ClipboardList, CheckCircle, ShieldCheck, Zap, FileSearch, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Tell us what you\'re moving',
    description: 'Route, cargo type, and timing.',
    icon: Package,
  },
  {
    number: '02',
    title: 'Get a tailored plan',
    description: 'Mode, schedule, and pricing.',
    icon: ClipboardList,
  },
  {
    number: '03',
    title: 'Track and confirm delivery',
    description: 'Updates, docs, and proof of delivery.',
    icon: CheckCircle,
  },
  {
    number: '04',
    title: 'Logistics Engineering',
    description: 'Custom solutions for complex cargo.',
    icon: ShieldCheck,
  },
  {
    number: '05',
    title: 'Integrated Communication',
    description: 'Direct link to dispatch and drivers.',
    icon: Zap,
  },
  {
    number: '06',
    title: 'Financial Transparency',
    description: 'Clean billing and competitive pricing.',
    icon: FileSearch,
  },
  {
    number: '07',
    title: 'Long-term Partnerships',
    description: 'Scalable capacity for your growth.',
    icon: Users,
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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
            scrub: 0.2,
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
            scrub: 0.2,
          },
        }
      );

      // Steps stagger
      const stepItems = stepsRef.current?.querySelectorAll('.step-item');
      if (stepItems) {
        gsap.fromTo(
          stepItems,
          { x: '8vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 0.2, // Faster scrub
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
      id="process"
      className="relative min-h-screen bg-app py-20 lg:py-0 overflow-hidden"
    >
      {/* Subtle Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] bg-orange/5 blur-[100px] rounded-full" />
      </div>
      <div className="lg:flex lg:min-h-screen">
        {/* Left Image Panel */}
        <div
          ref={imageRef}
          className="lg:w-[46vw] lg:min-h-screen relative"
        >
          <div className="h-[40vh] lg:h-full relative">
            <img
              src="/images/process_aerial_hub.jpg"
              alt="Aerial view of logistics hub"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-app/50 lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-app via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-[54vw] lg:min-h-screen flex items-center">
          <div className="px-6 lg:px-12 xl:px-16 py-12 lg:py-20 w-full">
            {/* Header */}
            <div ref={contentRef} className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-orange mb-3">
                Process
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
                How to start
              </h2>
              <p className="text-gray-light max-w-md">
                No long forms. No guessing. Get a clear plan and a single point of contact.
              </p>
            </div>

            {/* Steps */}
            <div ref={stepsRef} className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="step-item group flex items-start gap-5 p-5 lg:p-6 bg-surface/50 rounded-xl border border-white/5 hover:border-orange/30 hover:bg-surface/80 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-orange/10 flex items-center justify-center group-hover:bg-orange/20 transition-colors">
                      <step.icon className="w-6 h-6 text-orange" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-orange">{step.number}</span>
                      <h3 className="font-heading font-semibold text-lg text-white group-hover:text-orange transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
