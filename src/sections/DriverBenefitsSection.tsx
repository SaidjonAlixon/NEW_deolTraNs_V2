import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CircleDollarSign, Fuel, Calendar, Map, Headphones, ShieldCheck, Package, Wifi, Award } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

const ownerOpBenefits = [
  {
    title: '100% Fuel Discount Back Program',
    description: '40¢–90¢ per gallon returned to you. Fuel savings built directly into your bottom line.',
    icon: Fuel,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  {
    title: 'Weekly Settlements',
    description: 'Get paid every week, on time. Transparent breakdowns with no surprises.',
    icon: Calendar,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    title: 'Dedicated Lanes Available',
    description: 'Consistent, predictable routes so you can plan your life around your work — not the other way around.',
    icon: Map,
    color: 'text-orange',
    bg: 'bg-orange/10',
    border: 'border-orange/20',
  },
  {
    title: 'Strong Nationwide Freight Network',
    description: 'High rate-per-mile freight only. We don\'t chase cheap miles — we find the lanes that pay.',
    icon: CircleDollarSign,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
  {
    title: 'Professional 24/7 Dispatch & Support',
    description: 'Our team is always available — nights, weekends, and holidays. You\'re never alone on the road.',
    icon: Headphones,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
  {
    title: 'Insurance Coverage Included',
    description: 'Liability, Cargo & Occupational insurance coverage. Oregon permit included in your weekly cost.',
    icon: ShieldCheck,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
  },
];

const onboardingItems = [
  'Online applications & contracts',
  'Drug testing near your ZIP code',
  'Digital paperwork processing',
];

const starterPackage = [
  'Company decals',
  'Fuel cards',
  'PrePass',
  'All required onboarding materials',
];

export default function DriverBenefitsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1.5]);
  const { openDriverModal } = useDriverApplication();

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-[#0A0F1C] overflow-hidden">

      {/* Abstract BG */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z"
            fill="none" stroke="url(#grad)" strokeWidth="0.5"
            style={{ pathLength }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fd0a07" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fd0a07" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800/80 backdrop-blur-md border border-white/10 mb-6"
          >
            <Award className="w-4 h-4 text-orange" />
            <span className="font-mono text-xs uppercase tracking-wider text-gray-300">Owner Operators</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            What You <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">Get</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Everything you need to run your truck like a profitable business — not just a job.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-14">
          {ownerOpBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-navy-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-7 hover:bg-navy-800/80 hover:border-white/20 transition-all duration-500 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border relative z-10 ${benefit.bg} ${benefit.border} group-hover:scale-110 transition-transform duration-500`}>
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2 relative z-10">{benefit.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm relative z-10 group-hover:text-gray-300 transition-colors">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Cost + Onboarding — side by side */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* Weekly Cost */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-navy-900/60 border border-orange/20 rounded-2xl p-8"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-orange mb-3">Simple Weekly Cost</p>
            <p className="font-heading text-5xl font-bold text-white mb-1">$550</p>
            <p className="text-sm text-gray-400 mb-4">Per Week — All Inclusive</p>
            <p className="text-xs text-gray-light mb-5">Insurance and Oregon permit included.</p>
            <div className="border-t border-white/10 pt-5">
              <p className="text-xs font-mono uppercase tracking-widest text-orange mb-3">We Focus on Profitability</p>
              <div className="flex flex-col gap-2">
                {['Less deadhead', 'Fewer unnecessary miles', 'Higher revenue per mile', 'Close attention to RPM and margins'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Onboarding */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-navy-900/60 border border-blue-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-blue-400" />
              <p className="font-mono text-xs uppercase tracking-widest text-blue-400">Fully Remote Onboarding</p>
            </div>
            <p className="font-heading text-xl font-bold text-white mb-1">Start From Anywhere</p>
            <p className="text-sm text-gray-400 mb-5">No travel. No downtime. No wasted money.</p>

            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">Easy Digital Process</p>
            <div className="flex flex-col gap-2 mb-6">
              {onboardingItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">Starter Package Shipped to You</p>
            <div className="flex flex-wrap gap-2">
              {starterPackage.map((item) => (
                <span key={item} className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Inspection Program */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-7 mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <p className="font-semibold text-white">Company-Paid Inspection Program</p>
          </div>
          <p className="text-sm text-gray-400 mb-4">We prioritize safety and equipment quality.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {['Regular compliance inspections', 'Annual inspections covered by the company', 'Owner Operators reimbursed for clean inspections'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={openDriverModal}
            className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-base"
          >
            Apply Now
            <Package className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
