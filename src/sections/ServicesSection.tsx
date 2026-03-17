import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Truck, Layers, LayoutGrid, Zap, RefreshCw, ArrowRight, MapPin, Shield, Phone } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';

const freightTypes = [
  { icon: Truck,        title: 'Dry Van',                        description: 'High-volume power-only dry van coverage across all 48 states with consistent lanes.' },
  { icon: Thermometer,  title: 'Refrigerated (Reefer)',           description: 'Temperature-sensitive freight handled with care and precision on proven reefer lanes.' },
  { icon: Layers,       title: 'Stepdeck',                       description: 'Oversized and over-height cargo transported safely on stepdeck trailers nationwide.' },
  { icon: LayoutGrid,   title: 'Flatbed',                        description: 'Open-deck flatbed loads including construction materials and industrial equipment.' },
  { icon: Zap,          title: 'Generators & Specialized Loads', description: 'Heavy and specialized equipment moves handled by experienced power-only operators.' },
  { icon: RefreshCw,    title: 'Dedicated Contracted Runs',      description: 'Consistent, high-paying dedicated lanes with predictable schedules and mileage guarantees.' },
];

const coveragePoints = [
  'Operating in 48 U.S. states',
  'Regional and long-haul lanes',
  'Consistent nationwide capacity',
];

const specialServices = [
  {
    icon: Shield,
    title: 'Dedicated Lane Support',
    description: 'Have contracted or high-volume lanes? We have the truck capacity and operational structure to cover them reliably and consistently.',
    color: 'text-blue-400',
    border: 'border-blue-400/20',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Phone,
    title: 'Emergency Capacity — Your "911 Carrier"',
    description: 'When freight must move urgently, our team responds fast with available trucks and rapid dispatch coordination.',
    color: 'text-orange',
    border: 'border-orange/20',
    bg: 'bg-orange/10',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' } as const,
  transition: { duration: 0.55, delay },
});

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { openDriverModal } = useDriverApplication();

  return (
    <section ref={sectionRef} id="services" className="relative bg-navy-900 py-20 lg:py-0">
      <div className="lg:flex lg:min-h-screen">

        {/* Left Image Panel */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="lg:w-[46vw] lg:min-h-screen relative"
        >
          <div className="h-[40vh] lg:h-full relative overflow-hidden">
            <img src="/images/chap_truck.jpg" alt="DELO TRANS INC Services" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/50 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent lg:hidden" />
          </div>
        </motion.div>

        {/* Right Content */}
        <div className="lg:w-[54vw] lg:min-h-screen flex items-start">
          <div className="px-6 lg:px-12 xl:px-16 py-12 lg:py-16 w-full">

            {/* Header */}
            <motion.div {...fadeUp(0)} className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-orange mb-3">What We Do</p>
              <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3">
                Power-Only Transportation <span className="text-orange">Specialists</span>
              </h2>
              <p className="text-gray-light max-w-lg">
                We provide professional power-only capacity solutions for brokers, shippers, and logistics partners nationwide.
              </p>
            </motion.div>

            {/* Equipment & Freight Types */}
            <motion.p {...fadeUp(0.05)} className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
              Equipment &amp; Freight Types
            </motion.p>
            <div className="grid sm:grid-cols-2 gap-3 lg:gap-4 mb-10">
              {freightTypes.map((service, index) => (
                <motion.div
                  key={index}
                  {...fadeUp(index * 0.07)}
                  className="group p-4 lg:p-5 bg-navy-800/50 rounded-xl border border-white/5 hover:border-orange/30 hover:bg-navy-800/80 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange/20 transition-colors">
                      <service.icon className="w-4 h-4 text-orange" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white text-sm mb-0.5 group-hover:text-orange transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-light leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coverage Area */}
            <motion.div {...fadeUp(0.1)} className="mb-8 p-5 bg-navy-800/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-orange" />
                <p className="text-sm font-semibold text-white">Coverage Area</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {coveragePoints.map((pt) => (
                  <span key={pt} className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                    {pt}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Special Services */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {specialServices.map((s, i) => (
                <motion.div key={s.title} {...fadeUp(0.12 + i * 0.08)} className={`p-5 rounded-xl border ${s.border} ${s.bg}`}>
                  <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                  <h3 className={`text-sm font-bold ${s.color} mb-1`}>{s.title}</h3>
                  <p className="text-xs text-gray-light leading-relaxed">{s.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div {...fadeUp(0.2)}>
              <button onClick={openDriverModal} className="btn-primary inline-flex items-center gap-2">
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
