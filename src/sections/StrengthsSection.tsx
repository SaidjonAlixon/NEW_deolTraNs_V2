import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Headphones, 
  Map, 
  Users, 
  Zap, 
  Radar, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

const strengths = [
  {
    title: '24/7 Digital Dispatch',
    description: 'AI-augmented dispatch system providing continuous route optimization and driver support.',
    icon: Headphones,
    stat: '99.9% Uptime',
    tags: ['Automated', 'Live'],
  },
  {
    title: 'Nationwide Smart Grid',
    description: 'Predictive logistics network covering all 50 states with real-time congestion rerouting.',
    icon: Map,
    stat: 'All-State Coverage',
    tags: ['GPS', 'Cloud'],
  },
  {
    title: 'Precision Fleet Crew',
    description: 'Elite drivers integrated with bio-metric safety monitoring and advanced HOS tracking.',
    icon: Users,
    stat: 'CDL Global Plus',
    tags: ['Certified', 'Elite'],
  },
  {
    title: 'Hyper-Reliable Transit',
    description: 'Accelerated transit protocols using IoT-enabled load monitoring for time-critical freight.',
    icon: Zap,
    stat: '< 0.1% Delay',
    tags: ['Express', 'IoT'],
  },
  {
    title: 'Orbital Fleet Tracking',
    description: 'Satellite-linked telemetry providing millisecond-accurate positioning and load vitals.',
    icon:  Radar,
    stat: 'Live Telemetry',
    tags: ['Satellite', 'Real-time'],
  },
  {
    title: 'Protocol 7 Compliance',
    description: 'Next-gen security and safety audits exceeding DOT and FMCSA standards.',
    icon: ShieldCheck,
    stat: 'Zero-Risk Rating',
    tags: ['Secure', 'Audited'],
  },
];

export default function StrengthsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-[#050810] overflow-hidden">
      {/* High-tech Grid Background */}
      <div className="absolute inset-0 opacity-[0.15]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ff0000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Glowing Mesh Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16 lg:mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-red-500/5 border border-red-500/20 mb-8 backdrop-blur-md"
          >
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/20 animate-pulse delay-150" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">System Capabilities</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 uppercase tracking-tight"
          >
            Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Advantages</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-3xl mx-auto text-lg font-light leading-relaxed"
          >
            Beyond traditional trucking—we deploy a sophisticated logistics ecosystem 
            engineered for maximum throughput and zero-latency communication.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strengths.map((strength, index) => (
            <StrengthCard key={strength.title} strength={strength} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StrengthCard({ strength, index, isInView }: { strength: typeof strengths[0], index: number, isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative p-8 bg-[#0C121D]/50 border border-white/5 rounded-3xl hover:border-red-500/40 transition-all duration-700 backdrop-blur-xl overflow-hidden"
    >
      {/* Card HUD Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
         <Cpu className="w-12 h-12 text-red-500/20" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <strength.icon className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-right">
                <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">Status</div>
                <div className="font-mono text-[10px] text-green-500 flex items-center gap-1.5 justify-end">
                    <span className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                    Online
                </div>
            </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors tracking-tight">
          {strength.title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed text-sm mb-8 font-light italic border-l-2 border-red-500/20 pl-4">
          "{strength.description}"
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
            <div className="flex gap-2">
                {strength.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-gray-500 font-mono text-[9px] uppercase border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="font-mono text-red-500 text-xs font-bold tracking-tighter">
                {strength.stat}
            </div>
        </div>
      </div>

      {/* Scanned line effect on hover */}
      <div className="absolute inset-x-0 h-[2px] bg-red-500/30 -top-[10px] group-hover:top-[100%] transition-all duration-[1.5s] ease-linear opacity-0 group-hover:opacity-100 shadow-[0_0_10px_#ef4444]" />
      
      {/* Hexagon Pattern Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-500" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'42\' viewBox=\'0 0 24 42\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 0l12 6.928v13.856L12 27.712 0 20.784V6.928L12 0zm0 27.712l12 6.928v13.856l-12 6.928-12-6.928V34.64l12-6.928z\' fill=\'%23ffffff\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
    </motion.div>
  );
}
