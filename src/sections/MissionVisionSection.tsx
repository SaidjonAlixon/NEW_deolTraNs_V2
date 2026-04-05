import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Truck, DollarSign, ShieldCheck, Zap, Users, Handshake } from 'lucide-react';

const values = [
  {
    icon: Truck,
    title: '100% Power-Only',
    description: 'We are a pure power-only carrier — no trailers, no distractions. 250+ units operating across 48 states, focused strictly on high rate-per-mile freight and real profitability.',
    color: 'text-orange',
    bg: 'bg-orange/10',
    border: 'border-orange/20',
  },
  {
    icon: DollarSign,
    title: 'Profit-First Operations',
    description: 'We work smarter so our drivers earn more with less stress. No chasing cheap miles, no wasting time — just high-paying freight and transparent weekly settlements.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: Handshake,
    title: 'Our Partners',
    description: 'We proudly partner with Owner Operators, Company Drivers, Fleet Investors, and Brokers & Direct Shippers — building long-term relationships built on trust and results.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
];

const corePrinciples = [
  { icon: Zap, label: 'High Rate-Per-Mile' },
  { icon: Users, label: 'Driver-First Culture' },
  { icon: ShieldCheck, label: 'Profit-First Operations' },
];

export default function MissionVisionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-app overflow-hidden">
      {/* Background Image with heavy blur */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
        <img
          src="/images/about_truck_motion.png"
          alt="Abstract truck background"
          className="w-full h-full object-cover blur-[80px] sm:blur-[120px]"
        />
        <div className="absolute inset-0 bg-app/60" /> {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-app via-transparent to-app" /> {/* Vignette */}
      </div>

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-r from-[#fd0a07]/15 via-[#005E99]/15 to-transparent rounded-full blur-[100px] z-[2] pointer-events-none" />

      <motion.div style={{ opacity }} className="relative z-[10] max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-16 lg:mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-border mb-6 shadow-[0_0_15px_rgba(253,10,7,0.1)]"
          >
            <ShieldCheck className="w-4 h-4 text-orange" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Who We Are</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 drop-shadow-lg"
          >
            Who We <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">Are</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-3xl mx-auto drop-shadow-md leading-relaxed"
          >
            Delo Trans Inc is a <span className="text-foreground font-semibold">100% power-only carrier</span> designed for drivers and fleet partners who treat trucking like a business. With more than <span className="text-orange font-semibold">250 power-only units operating across 48 states</span>, we focus strictly on high rate-per-mile freight and real profitability — not chasing cheap miles or wasting time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              style={{ y: index === 1 ? y1 : 0 }}
              className="group relative bg-card/60 backdrop-blur-xl rounded-2xl border border-border p-8 lg:p-10 hover:bg-surface/90 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(253,10,7,0.1)] hover:-translate-y-2"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border relative z-10 ${value.bg} ${value.border} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <value.icon className={`w-7 h-7 ${value.color}`} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4 relative z-10">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10 group-hover:text-foreground transition-colors">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Principles Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 border-t border-border pt-12 flex flex-wrap justify-center gap-8 lg:gap-16 relative"
        >
          {corePrinciples.map((principle, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm shadow-md flex items-center justify-center border border-border">
                <principle.icon className="w-4 h-4 text-orange" />
              </div>
              <span className="text-sm lg:text-base font-semibold text-foreground font-heading tracking-wide uppercase">{principle.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
