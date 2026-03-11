import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Truck, Phone, ArrowRight } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

const expectations = [
  { text: 'Fast truck availability', icon: Truck },
  { text: 'Coverage across 48 states', icon: CheckCircle2 },
  { text: 'Dedicated lane support', icon: CheckCircle2 },
  { text: 'Experienced dispatch coordination', icon: CheckCircle2 },
  { text: 'Clear and professional communication', icon: CheckCircle2 },
  { text: 'On-time performance focus', icon: CheckCircle2 },
];

const safetyItems = [
  'Preventive maintenance programs',
  'DOT inspections every 3 months',
  'Strict equipment standards',
  'Professional drivers and staff',
];

const companyDriverPerks = [
  'Consistent loads',
  'Reduced dispatch stress',
  'Nationwide route options',
  'Supportive operations team',
  'Professional work environment',
];

export default function DriverRequirementsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { openDriverModal } = useDriverApplication();

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-navy-900 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0F1C] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 space-y-24">

        {/* ── COMPANY DRIVERS ── */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-blue-200">Company Drivers</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5"
            >
              Drive With a Carrier That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Respects Your Time.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              We provide consistent freight, supportive dispatch, and nationwide opportunities for professional company drivers.
              <br /><br />
              <span className="text-white/70 italic">Drive professionally. Earn reliably. Grow confidently.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={openDriverModal}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy-800 rounded-full border border-blue-500/30 text-white font-medium hover:border-blue-400 transition-all duration-300 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <span className="relative z-10 group-hover:text-blue-400 transition-colors">Apply as Company Driver</span>
                <ArrowRight className="w-4 h-4 text-blue-400 relative z-10" />
              </button>
            </motion.div>
          </div>

          <div className="w-full lg:w-7/12">
            <div className="bg-navy-800/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 sm:p-10 shadow-2xl">
              <p className="font-mono text-xs uppercase tracking-widest text-blue-400 mb-6">Why Drive With Us</p>
              <div className="flex flex-col gap-4">
                {companyDriverPerks.map((perk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-gray-300 font-medium">{perk}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BROKERS & SHIPPERS ── */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="w-full lg:w-5/12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20 mb-6"
            >
              <Phone className="w-4 h-4 text-orange" />
              <span className="font-mono text-xs uppercase tracking-wider text-orange">Brokers &amp; Shippers</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5"
            >
              Reliable Capacity — <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">When You Need It Most.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Delo Trans Inc delivers fast, dependable power-only solutions for time-sensitive and contracted freight. Partner with a carrier that values urgency, reliability, and long-term relationships.
            </motion.p>

            {/* Safety */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-navy-800/60 border border-emerald-500/20 rounded-2xl p-5 mb-6 text-left"
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Safety &amp; Compliance First</p>
              </div>
              <div className="flex flex-col gap-2">
                {safetyItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={openDriverModal}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange text-white rounded-full font-medium hover:bg-red-600 transition-all duration-300 w-full sm:w-auto shadow-[0_0_20px_rgba(253,10,7,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10">Let's Move Freight</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </motion.button>
          </div>

          <div className="w-full lg:w-7/12">
            <div className="bg-navy-800/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 sm:p-10 shadow-2xl">
              <p className="font-mono text-xs uppercase tracking-widest text-orange mb-6">What You Can Expect</p>
              <div className="flex flex-col gap-4">
                {expectations.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                      <req.icon className="w-4 h-4 text-orange" />
                    </div>
                    <p className="text-gray-300 font-medium">{req.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
