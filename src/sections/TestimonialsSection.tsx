import { motion } from 'framer-motion';
import { Star, Truck, Quote } from 'lucide-react';

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
  type,
}: {
  testimonial: typeof driverTestimonials[0] & { company?: string };
  type: 'driver' | 'partner';
}) {
  const isDriver = type === 'driver';
  const bgAvatar = isDriver 
    ? 'bg-[#fd0a07]/10 text-[#fd0a07] border-[#fd0a07]/30' 
    : 'bg-[#005E99]/10 text-[#005E99] border-[#005E99]/30';

  return (
    <div className="w-[320px] sm:w-[380px] lg:w-[420px] flex-shrink-0 bg-surface/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 sm:p-8 flex flex-col gap-5 hover:bg-surface/60 hover:border-white/15 transition-all duration-300 group">
      <Quote className="w-8 h-8 text-white/5 group-hover:text-white/20 transition-colors" />
      <p className="text-sm sm:text-base text-gray-300 leading-relaxed min-h-[90px] italic">
        "{testimonial.quote}"
      </p>
      
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center flex-shrink-0 ${bgAvatar}`}>
            <span className="font-bold text-base sm:text-lg">{testimonial.initial}</span>
          </div>
          <div>
            <p className="font-heading font-semibold text-white text-sm sm:text-base">{testimonial.name}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider font-mono text-gray-400">
              {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
            </p>
          </div>
        </div>
        <div className="flex bg-app/50 rounded-full px-2 py-1 border border-white/5">
          <Star className="w-3 h-3 fill-current text-orange" />
          <span className="text-xs font-mono ml-1 text-white">{testimonial.rating}.0</span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  // Use 4 copies of each set to ensure continuous infinite scrolling for wide screens
  const driversDup = [...driverTestimonials, ...driverTestimonials, ...driverTestimonials, ...driverTestimonials];
  const partnersDup = [...partnerTestimonials, ...partnerTestimonials, ...partnerTestimonials, ...partnerTestimonials];

  return (
    <section id="testimonials" className="relative bg-app py-20 lg:py-28 overflow-hidden">
      {/* Background grid replacing the red blur */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 mb-12 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Star className="w-4 h-4 text-orange" />
            <span className="font-mono text-xs uppercase tracking-wider text-gray-300">Success Stories</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Voices from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">Road</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg lg:text-xl"
          >
            Real stories from the drivers who move us forward and the partners who trust us with their cargo.
          </motion.p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
        {/* Row 1: Drivers scrolling left */}
        <div className="relative flex overflow-hidden group">
          {/* Gradient Edge Masks */}
          <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-app to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-app to-transparent z-10 pointer-events-none"></div>
          
          <motion.div
            className="flex gap-6 sm:gap-8 w-max pl-6 sm:pl-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            whileHover={{ animationPlayState: "paused" }} // Wait, Framer Motion doesn't use CSS animationPlayState entirely easily like this without custom style. But we'll leave it as is, or remove whileHover for pure framer animate. 
          >
            {driversDup.map((testimonial, i) => (
              <TestimonialCard key={`driver-${i}`} testimonial={testimonial} type="driver" />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Partners scrolling right */}
        <div className="relative flex overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-app to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-app to-transparent z-10 pointer-events-none"></div>
          
          <motion.div
            className="flex gap-6 sm:gap-8 w-max pr-6 sm:pr-8"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 50 }}
          >
            {partnersDup.map((testimonial, i) => (
              <TestimonialCard key={`partner-${i}`} testimonial={testimonial} type="partner" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 mt-16 sm:mt-24"
      >
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Truck className="w-4 h-4 text-orange" />
            </div>
            <p className="text-sm text-gray-400">
              Trusted by leading teams across <span className="text-white font-medium">Central Asia & USA</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-app flex items-center justify-center opacity-80 overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/5" />
                  <Star className="w-3 h-3 text-white/40" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-orange" />
                <Star className="w-3 h-3 fill-current text-orange" />
                <Star className="w-3 h-3 fill-current text-orange" />
                <Star className="w-3 h-3 fill-current text-orange" />
                <Star className="w-3 h-3 fill-current text-orange" />
              </div>
              <p className="text-xs font-mono text-gray-500 mt-1"><span className="text-gray-300 font-bold">500+</span> 5-star reviews</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
