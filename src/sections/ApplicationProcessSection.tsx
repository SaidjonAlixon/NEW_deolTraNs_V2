import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MousePointerClick, FileSearch, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Quick Application',
    description: 'Fill out our short online form in under 5 minutes. No endless paperwork.',
    icon: MousePointerClick,
  },
  {
    number: '02',
    title: 'Review & Approval',
    description: 'Our hiring team reviews your credentials. Qualified drivers get an offer within 24-48 hours.',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Orientation & Dispatch',
    description: 'Complete paid orientation, get the keys to your truck, and hit the road.',
    icon: Route,
  },
];

export default function ApplicationProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const navigate = useNavigate();

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-app overflow-hidden">
      
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-app to-app pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-20 lg:mb-28">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            Hop on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Board.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            We respect your time. Our hiring process is fast, transparent, and built to get you behind the wheel without the runaround.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
           {/* Horizontal connecting line (Desktop) */}
           <div className="hidden lg:block absolute top-[52px] left-12 right-12 h-px bg-border z-0" />
           <motion.div 
             style={{ scaleX: pathLength, originX: 0 }}
             className="hidden lg:block absolute top-[52px] left-12 right-12 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 z-0" 
           />

           {/* Vertical connecting line (Mobile) */}
           <div className="lg:hidden absolute left-12 top-12 bottom-12 w-px bg-border z-0" />
           <motion.div 
             style={{ scaleY: pathLength, originY: 0 }}
             className="lg:hidden absolute left-12 top-12 bottom-12 w-[2px] bg-gradient-to-b from-blue-500 to-indigo-500 z-0" 
           />

          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex-1 flex flex-col lg:items-center text-left lg:text-center group"
              >
                {/* Number & Node */}
                <div className="flex items-center lg:flex-col lg:gap-4 mb-6">
                  <div className="w-24 h-24 rounded-full bg-surface border-4 border-app flex items-center justify-center relative shadow-xl group-hover:border-blue-500/30 group-hover:scale-110 transition-all duration-500 z-10 flex-shrink-0">
                    <step.icon className="w-10 h-10 text-blue-400 group-hover:text-blue-600 transition-colors" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-4 border-app text-xs font-bold text-primary-foreground shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="ml-6 lg:ml-0 hidden lg:block h-8 w-px bg-transparent" /> {/* Spacing */}
                  
                  {/* Mobile title aligns next to icon */}
                  <h3 className="lg:hidden ml-6 text-2xl font-heading font-bold text-foreground">{step.title}</h3>
                </div>

                <div className="pl-30 lg:pl-0">
                  <h3 className="hidden lg:block text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-blue-500 transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base ml-24 lg:ml-0">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.6 }}
           className="mt-20 lg:mt-32 flex justify-center"
        >
            <button
              type="button"
              onClick={() => navigate('/apply')}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              <span className="relative z-10 text-lg tracking-wide uppercase font-bold">Apply Now</span>
            </button>
        </motion.div>
      </div>
    </section>
  );
}
