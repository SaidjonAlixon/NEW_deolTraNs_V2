import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Truck, Layers, LayoutGrid, Zap, RefreshCw, ArrowRight, MapPin, Shield, Phone, ExternalLink } from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';
import FreightGalleryModal from '../components/FreightGalleryModal';

const freightTypes = [
  { 
    id: 'dry-van',
    icon: Truck, 
    title: 'Dry Van', 
    description: 'High-volume power-only dry van coverage across all 48 states with consistent lanes.',
    images: [
      { url: '/images/gallery/dry_van_1.png', category: 'Dry Van', caption: 'Regional Load - Texas Operations' },
      { url: '/images/gallery/dry_van_2.png', category: 'Warehouse', caption: 'Loading Dock Operations - Ohio Hub' },
      { url: '/images/truck/dry_van.jpg', category: 'Dry Van', caption: 'Dry Van Operations' },
      { url: '/images/truck/dry_van2.jpg', category: 'Dry Van', caption: 'Dry Van Transport' },
      { url: '/images/truck/dry_van3.jpg', category: 'Dry Van', caption: 'Dry Van Logistics' },
    ]
  },
  { 
    id: 'reefer',
    icon: Thermometer, 
    title: 'Refrigerated (Reefer)', 
    description: 'Temperature-sensitive freight handled with care and precision on proven reefer lanes.',
    images: [
      { url: '/images/gallery/reefer_1.png', category: 'Reefer', caption: 'Temperature Controlled Transit - Midwest' },
      { url: '/images/truck/Refrigerated.jpg', category: 'Reefer', caption: 'Refrigerated Operations' },
      { url: '/images/truck/Refrigerated2.jpg', category: 'Reefer', caption: 'Temperature Controlled Transport' },
      { url: '/images/truck/Refrigerated3.jpg', category: 'Reefer', caption: 'Refrigerated Freight' },
    ]
  },
  { 
    id: 'stepdeck',
    icon: Layers, 
    title: 'Stepdeck', 
    description: 'Oversized and over-height cargo transported safely on stepdeck trailers nationwide.',
    images: [
      { url: '/images/gallery/stepdeck_1.png', category: 'Stepdeck', caption: 'Oversized Industrial Equipment - Highway' },
      { url: '/images/truck/Stepdeck.jpg', category: 'Stepdeck', caption: 'Stepdeck Transport' },
      { url: '/images/truck/Stepdeck2.jpg', category: 'Stepdeck', caption: 'Oversized Cargo' },
      { url: '/images/truck/Stepdeck3.jpg', category: 'Stepdeck', caption: 'Stepdeck Operations' },
    ]
  },
  { 
    id: 'flatbed',
    icon: LayoutGrid, 
    title: 'Flatbed', 
    description: 'Open-deck flatbed loads including construction materials and industrial equipment.',
    images: [
      { url: '/images/gallery/flatbed_1.png', category: 'Flatbed', caption: 'Industrial Machinery Transport - Construction Site' },
      { url: '/images/truck/Flatbed.jpg', category: 'Flatbed', caption: 'Flatbed Operations' },
      { url: '/images/truck/Flatbed2.jpg', category: 'Flatbed', caption: 'Open-deck Transport' },
      { url: '/images/truck/Flatbed3.jpg', category: 'Flatbed', caption: 'Flatbed Freight' },
    ]
  },
  { 
    id: 'specialized',
    icon: Zap, 
    title: 'Generators & Specialized Loads', 
    description: 'Heavy and specialized equipment moves handled by experienced power-only operators.',
    images: [
      { url: '/images/gallery/specialized_1.png', category: 'Specialized', caption: 'Heavy Power Generation Unit - Specialized Transport' },
      { url: '/images/truck/Generators.jpg', category: 'Specialized', caption: 'Generator Transport' },
      { url: '/images/truck/Generators2.jpg', category: 'Specialized', caption: 'Specialized Load' },
      { url: '/images/truck/Generators3.jpg', category: 'Specialized', caption: 'Heavy Equipment Move' },
    ]
  },
  { 
    id: 'dedicated',
    icon: RefreshCw, 
    title: 'Dedicated Contracted Runs', 
    description: 'Consistent, high-paying dedicated lanes with predictable schedules and mileage guarantees.',
    images: [
      { url: '/images/gallery/dedicated_1.png', category: 'Dedicated', caption: 'Night Transit - Long Haul Operations' },
      { url: '/images/truck/Dedicated.jpg', category: 'Dedicated', caption: 'Dedicated Run Transit' },
      { url: '/images/truck/Dedicated2.jpg', category: 'Dedicated', caption: 'Contracted Lane Operations' },
      { url: '/images/truck/Dedicated3.jpg', category: 'Dedicated', caption: 'High-paying Dedicated Route' },
    ]
  },
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
  
  const [selectedFreight, setSelectedFreight] = useState<typeof freightTypes[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenGallery = (freight: typeof freightTypes[0]) => {
    setSelectedFreight(freight);
    setIsModalOpen(true);
  };

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
              <p className="text-gray-light max-w-lg text-sm lg:text-base">
                We provide professional power-only capacity solutions for brokers, shippers, and logistics partners nationwide.
              </p>
            </motion.div>

            {/* Equipment & Freight Types */}
            <div className="flex items-center justify-between mb-4">
              <motion.p {...fadeUp(0.05)} className="text-xs font-mono uppercase tracking-widest text-white/40">
                Equipment &amp; Freight Types
              </motion.p>
              <motion.span {...fadeUp(0.05)} className="text-[10px] text-orange font-mono animate-pulse hidden sm:block">
                Click cards to view loads
              </motion.span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3 lg:gap-4 mb-10">
              {freightTypes.map((service, index) => (
                <motion.div
                  key={service.id}
                  {...fadeUp(index * 0.07)}
                  onClick={() => handleOpenGallery(service)}
                  className="group p-4 lg:p-5 bg-navy-800/50 rounded-xl border border-white/5 hover:border-orange/50 hover:bg-navy-800/80 transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-orange/10 p-1.5 rounded-lg">
                    <ExternalLink className="w-3 h-3 text-orange" />
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange/20 transition-all duration-500 scale-95 group-hover:scale-100 group-hover:rotate-6">
                      <service.icon className="w-5 h-5 text-orange" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-base mb-1 group-hover:text-orange transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-light leading-relaxed group-hover:text-white/80 transition-colors">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coverage Area */}
            <motion.div {...fadeUp(0.1)} className="mb-8 p-5 bg-navy-800/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-orange" />
                <p className="text-sm font-semibold text-white">Coverage Area</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {coveragePoints.map((pt) => (
                  <span key={pt} className="text-[10px] lg:text-xs text-white/70 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 hover:bg-white/10 hover:border-white/20 transition-colors">
                    {pt}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Special Services */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {specialServices.map((s, i) => (
                <motion.div key={s.title} {...fadeUp(0.12 + i * 0.08)} className={`p-5 rounded-xl border ${s.border} ${s.bg} hover:brightness-110 transition-all`}>
                  <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
                  <h3 className={`text-sm font-bold ${s.color} mb-1.5`}>{s.title}</h3>
                  <p className="text-xs text-gray-light leading-relaxed">{s.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div {...fadeUp(0.2)}>
              <button 
                onClick={openDriverModal} 
                className="group px-8 py-4 bg-orange text-white rounded-xl font-bold flex items-center gap-3 hover:bg-orange-dark transition-all shadow-[0_10px_30px_rgba(255,107,38,0.3)] hover:shadow-orange/40"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedFreight && (
        <FreightGalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedFreight.title}
          images={selectedFreight.images}
        />
      )}
    </section>
  );
}
