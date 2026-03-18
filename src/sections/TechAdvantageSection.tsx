import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Network, 
  Database, 
  Terminal, 
  Box, 
  Layers,
  Activity,
  Globe
} from 'lucide-react';

const techFeatures = [
  {
    icon: Network,
    title: 'Mesh Route Optimization',
    desc: 'Dynamic graph-based routing algorithms that adapt to traffic, weather, and road closures in real-time.',
    accent: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Database,
    title: 'Blockchain Ledger',
    desc: 'Immutable transparent tracking of every transaction, signature, and hand-off in the supply chain.',
    accent: 'from-purple-500 to-indigo-400'
  },
  {
    icon: Terminal,
    title: 'API First Infrastructure',
    desc: 'Seamlessly integrate your ERP or WMS with our robust, high-throughput REST and GraphQL endpoints.',
    accent: 'from-green-500 to-emerald-400'
  },
  {
    icon: Box,
    title: 'IoT Load Monitoring',
    desc: 'On-board temperature, humidity, and shock sensors transmit constant vitals back to the command center.',
    accent: 'from-orange-500 to-amber-400'
  }
];

export default function TechAdvantageSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-24 lg:py-40 bg-[#050810] border-y border-white/5 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 blur-[100px] rounded-full"
            />
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              className="mb-8 flex items-center gap-4"
            >
              <div className="h-0.5 w-12 bg-red-600" />
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-red-500 font-bold">The Tech Stack</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-[0.95] mb-8"
            >
              Proprietary <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Logistics OS</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg font-light mb-12 max-w-xl leading-relaxed"
            >
              We don't just drive trucks; we operate a sophisticated software platform 
              designed to minimize friction and maximize transparency in the modern supply chain.
            </motion.p>
            
            <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Latency', val: '< 50ms', icon: Activity },
                  { label: 'Uptime', val: '99.99%', icon: Globe }
                ].map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-3xl group hover:border-red-500/20 transition-colors"
                    >
                        <stat.icon className="w-5 h-5 text-red-500 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="text-2xl font-black text-white mb-1 tracking-tighter">{stat.val}</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 relative">
            {/* Connective Lines Decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                <Layers className="w-full h-full text-white" />
            </div>

            {techFeatures.map((f, i) => (
                <motion.div
                    key={f.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="p-8 rounded-3xl bg-[#0C121D]/80 border border-white/5 backdrop-blur-xl relative group hover:z-20 hover:-translate-y-2 transition-all duration-500"
                >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} p-px mb-6`}>
                        <div className="w-full h-full bg-[#050810] rounded-[calc(0.75rem-1px)] flex items-center justify-center">
                            <f.icon className="w-5 h-5 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">{f.desc}</p>
                    
                    {/* Glowing Accent */}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r ${f.accent} blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                </motion.div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Decorative Rotating Gear-like element using SVG */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-[0.02] pointer-events-none animate-[spin_20s_linear_infinite]">
        <Globe className="w-full h-full text-white" />
      </div>
    </section>
  );
}
