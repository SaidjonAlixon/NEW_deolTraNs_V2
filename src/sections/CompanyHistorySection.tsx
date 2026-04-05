import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Truck, Globe2, Building2, MapPin } from 'lucide-react';

const timelineEvents = [
  {
    year: '2021',
    title: 'The Beginning',
    description: 'Founded DELO TRANS INC as a single-truck operation dedicated to reliable local dry van freight solutions.',
    icon: Truck,
    side: 'left',
  },
  {
    year: '2022',
    title: 'Fleet Expansion',
    description: 'Scaled our fleet to 20+ trucks and introduced advanced logistics software to track shipments in real-time.',
    icon: Building2,
    side: 'right',
  },
   {
    year: '2024',
    title: 'Hubs',
    description: 'Opened strategic hubs across the Midwest and East Coast to ensure faster transit times and better compliance.',
    icon: MapPin,
    side: 'left',
  },
  {
    year: '2026',
    title: 'Nationwide Dominance',
    description: 'Solidified our reputation as an industry leader in seamless, nationwide transportation management with a 99% on-time rate.',
    icon: Globe2,
    side: 'right',
  },
];

export default function CompanyHistorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-app overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-app to-app pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16 lg:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            A Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            A quick look back at the milestones that shaped our commitment to logistics excellence.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
          
          {/* Animated fill line */}
          <motion.div 
            style={{ scaleY: pathLength, originY: 0 }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 -translate-x-1/2 hidden md:block" 
          />

          <div className="space-y-12 md:space-y-24">
            {timelineEvents.map((event) => (
              <TimelineItem key={event.year} event={event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ event }: { event: typeof timelineEvents[0] }) {
  const isLeft = event.side === 'left';
  
  return (
    <div className={`relative flex flex-col md:flex-row items-center justify-between group ${
      isLeft ? 'md:flex-row-reverse' : ''
    }`}>
      
      {/* Empty space for the opposite side on Desktop */}
      <div className="hidden md:block w-5/12" />

      {/* Center Node */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-surface border-4 border-app items-center justify-center z-10 transition-colors duration-300 group-hover:bg-blue-500 group-hover:border-blue-500/30">
        <event.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
      </div>

      {/* Content Card */}
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="w-full md:w-5/12 ml-12 md:ml-0"
      >
        <div className={`
          bg-card/50 backdrop-blur-md rounded-2xl border border-border p-6 lg:p-8
          hover:bg-surface/80 hover:border-border transition-all duration-300
          relative
        `}>
          {/* Mobile node (visible only on small screens) */}
          <div className="md:hidden absolute -left-12 top-6 w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="font-heading text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              {event.year}
            </span>
            <div className="h-px flex-grow bg-border" />
          </div>
          
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">{event.title}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
            {event.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
