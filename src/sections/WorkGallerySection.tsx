import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const galleryItems = [
  {
    title: 'Interstate Alpha-9',
    location: 'California Corridor',
    image: '/images/truck/about_truck4.jpg',
    telemetry: { weight: '78,400 lbs', temp: '68°F', speed: '65 mph' },
    coords: '34.0522° N, 118.2437° W'
  },
  {
    title: 'Regional Logistics Hub',
    location: 'Central Storage',
    image: '/images/delo_truc_ombor.jpg',
    telemetry: { weight: 'N/A', temp: '72°F', capacity: '94%' },
    coords: '41.8781° N, 87.6298° W'
  },
  {
    title: 'Advanced Fleet Unit',
    location: 'Maintenance Tech',
    image: '/images/fleet_truck_detail.png',
    telemetry: { parts: '100% OK', diagnostic: 'Optimal' },
    coords: 'Systems Check'
  },
  {
    title: 'Heavy Payload Transit',
    location: 'Express Route 66',
    image: '/images/coverage_highway.jpg',
    telemetry: { weight: '80,000 lbs', cargo: 'Sensitive', priority: 'High' },
    coords: '35.2271° N, 101.8313° W'
  },
  {
    title: 'Distribution Nexus',
    location: 'Strategic Terminal',
    image: '/images/process_aerial_hub.jpg',
    telemetry: { intake: 'High', flow: 'Steady', efficiency: 'A+' },
    coords: '39.9526° N, 75.1652° W'
  },
  {
    title: 'Nocturnal Delivery',
    location: 'Night Ops Sector',
    image: '/images/hero_truck_night.jpg',
    telemetry: { vis: 'IR Enabled', load: 'Secure', driver: 'Alert' },
    coords: '40.7128° N, 74.0060° W'
  },
  {
    title: 'Cross-Country Freight',
    location: 'Midwest Corridor',
    image: '/images/truck/about_truck1.jpg',
    telemetry: { weight: '65,000 lbs', temp: 'Optimal', speed: '68 mph' },
    coords: '39.8283° N, 98.5795° W'
  },
  {
    title: 'Mountain Pass Transport',
    location: 'High Altitude Route',
    image: '/images/truck/about_truck2.jpg',
    telemetry: { grade: '6%', engine: 'Normal', torque: 'High' },
    coords: '39.7392° N, 104.9903° W'
  },
  {
    title: 'Urban Logistics Sector',
    location: 'Metro Distribution',
    image: '/images/truck/about_truck3.jpg',
    telemetry: { traffic: 'Moderate', stops: '12 Left', eta: 'On Time' },
    coords: '41.8781° N, 87.6298° W'
  }
];

export default function WorkGallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-[#050810] overflow-hidden">
      {/* Background HUD Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#ff0000 1px, transparent 1px), linear-gradient(90deg, #ff0000 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-24 gap-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/30 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold text-red-500">Live Visual Telemetry</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter"
            >
              Field <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Operations</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-lg leading-relaxed font-light"
            >
              Surveillance data from our active units. We provide transparent, 
              live monitoring of every asset in our technological network.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            className="flex-shrink-0"
          >
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-red-500/40 to-transparent">
                <div className="px-8 py-6 rounded-[calc(1rem-1px)] bg-[#050810] backdrop-blur-3xl border border-white/5">
                    <div className="font-mono text-[10px] uppercase text-gray-500 tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full border border-red-500 animate-ping" />
                        Network Integrity
                    </div>
                    <div className="text-4xl font-black text-white tracking-tighter flex items-end gap-1">
                        99.8% <span className="text-red-500 text-sm font-mono mb-1.5">v2.4</span>
                    </div>
                    <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <div key={i} className={`h-1 w-4 rounded-full ${i < 7 ? 'bg-red-500' : 'bg-red-900/30'}`} />
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <GalleryCard key={item.title} item={item} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item, index, isInView }: { item: typeof galleryItems[0], index: number, isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group relative h-[450px] overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0C121D] shadow-2xl"
    >
      {/* HUD Frame */}
      <div className="absolute inset-4 border border-white/10 rounded-[2rem] z-20 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <img 
        src={item.image} 
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-[1.5s] scale-110 group-hover:scale-100 brightness-[0.7] group-hover:brightness-[0.9] grayscale-[0.5] group-hover:grayscale-0"
      />
      
      {/* HUD Elements */}
      <div className="absolute top-8 left-8 z-30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[9px] text-white/70 uppercase tracking-widest uppercase">REC UNIT_{index + 10}</span>
          </div>
          <div className="font-mono text-[8px] text-white/40">{item.coords}</div>
      </div>

      <div className="absolute top-8 right-8 z-30">
        <div className="flex flex-col items-end gap-1">
            {Object.entries(item.telemetry).map(([key, val]) => (
                <div key={key} className="bg-black/40 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded flex gap-4 w-fit">
                    <span className="font-mono text-[8px] uppercase text-red-500/60 font-bold">{key}</span>
                    <span className="font-mono text-[8px] text-white/80">{val}</span>
                </div>
            ))}
        </div>
      </div>
      
      {/* Content Overlay */}
      <div className="absolute bottom-10 left-10 right-10 z-30">
        <div className="inline-block px-3 py-1 bg-red-600/90 text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-white rounded-md mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          {item.location}
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 group-hover:text-red-500 transition-colors duration-300">
          {item.title}
        </h3>
        <div className="h-0.5 w-12 bg-red-500 rounded-full group-hover:w-full transition-all duration-700" />
      </div>

      {/* Crosshair corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30 rounded-tl-lg z-30" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30 rounded-tr-lg z-30" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30 rounded-bl-lg z-30" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30 rounded-br-lg z-30" />
    </motion.div>
  );
}
