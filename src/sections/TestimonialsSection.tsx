import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Truck, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const driverTestimonials = [
  {
    name: "John 'Big Mack' Davis",
    role: 'Driver (15 years exp)',
    initial: 'J',
    quote: "I've driven for a lot of companies, but DELO TRANS is different. They actually respect the driver. The money is good, but the respect is what keeps me here.",
    rating: 5,
  },
  {
    name: 'Akbar Toshmatov',
    role: 'Driver (8 years exp)',
    initial: 'A',
    quote: "Home time is real here. They promised 2 weeks out, 1 week home — and they keep it. My family finally has a schedule they can count on.",
    rating: 5,
  },
  {
    name: 'Marcus Lee',
    role: 'Driver (12 years exp)',
    initial: 'M',
    quote: "New trucks, great pay, dispatch actually picks up the phone. I've been with DELO for 3 years and I'm not going anywhere.",
    rating: 5,
  },
];

const partnerTestimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Logistics Mgr',
    company: 'FastFreight Inc.',
    initial: 'S',
    quote: "Reliability is non-negotiable for us. DELO TRANS has never missed a load. Their communication is top-tier.",
    rating: 5,
  },
  {
    name: 'Dilshod K.',
    role: 'Supply Chain Director',
    company: 'AgroPack Group',
    initial: 'D',
    quote: "Their cross-border consistency is the best we've seen in the region. DELO keeps our production lines fed.",
    rating: 5,
  },
  {
    name: 'Michael R.',
    role: 'Logistics Coordinator',
    company: 'Global Trade Co.',
    initial: 'M',
    quote: "The transparency and communication from DELO is exceptional. We always know exactly where our shipments are.",
    rating: 5,
  },
];

function TestimonialCard({
  testimonial,
  accent,
}: {
  testimonial: typeof driverTestimonials[0] & { company?: string };
  accent: 'red' | 'blue';
}) {
  const accentColor = accent === 'red' ? '#fd0a07' : '#005E99';
  const bgAvatar = accent === 'red' ? 'bg-[#fd0a07]' : 'bg-[#005E99]';

  return (
    <div className="bg-navy-800/60 backdrop-blur-md rounded-2xl border border-white/8 p-5 sm:p-6 flex flex-col gap-4 hover:border-white/20 transition-all duration-300">
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${bgAvatar} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-sm">{testimonial.initial}</span>
        </div>
        <div>
          <p className="font-heading font-semibold text-white text-sm">{testimonial.name}</p>
          <p className="text-[11px] uppercase tracking-wider font-mono text-gray-400">
            {testimonial.role}{(testimonial as any).company ? `, ${(testimonial as any).company}` : ''}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p className="text-sm text-gray-300 leading-relaxed italic">
        "{testimonial.quote}"
      </p>

      {/* Stars */}
      <div className="flex items-center gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" style={{ color: accentColor }} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [driverIdx, setDriverIdx] = useState(0);
  const [partnerIdx, setPartnerIdx] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
      gsap.fromTo(
        leftColRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
      gsap.fromTo(
        rightColRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative bg-navy-900 py-20 lg:py-28 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#fd0a07]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange mb-3">Testimonials</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Voices from the Road
          </h2>
          <p className="text-gray-light text-base sm:text-lg max-w-2xl mx-auto">
            Hear from the drivers who move us forward and the partners who trust us.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* ─── Left: Our Drivers ─── */}
          <div ref={leftColRef}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#fd0a07] flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl">Our Drivers</h3>
            </div>
            <TestimonialCard testimonial={driverTestimonials[0]} accent="red" />
          </div>

          {/* ─── Right: Our Partners ─── */}
          <div ref={rightColRef}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#005E99] flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl">Our Partners</h3>
            </div>
            <TestimonialCard testimonial={partnerTestimonials[0]} accent="blue" />
          </div>
        </div>

        {/* Bottom trust line */}
        <p className="text-center text-sm text-gray-light mt-12 pt-8 border-t border-white/5">
          Trusted by teams in agriculture, retail, manufacturing, and logistics across Central Asia.
        </p>
      </div>
    </section>
  );
}
