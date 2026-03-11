import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dilmurod Khasanov',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop', // Placeholder corporate headshot
    bio: 'With over two decades in logistics, Dilmurod founded DELO TRANS with a vision to redefine driver respect and operational transparency.',
    socials: { linkedin: '#', twitter: '#', mail: '#' },
  },
  {
    name: 'Sarah Mitchell',
    role: 'Chief Operations Officer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    bio: 'Sarah ensures our national fleet runs like clockwork, bringing 15 years of supply chain optimization experience to the team.',
    socials: { linkedin: '#', mail: '#' },
  },
  {
    name: 'Rustam Aliev',
    role: 'Head of Safety & Compliance',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    bio: 'Rustam\'s zero-compromise approach to safety protocols has earned DELO TRANS top safety ratings across the board for 5 years running.',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Elena Rostova',
    role: 'VP of Technology',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    bio: 'The architect behind our proprietary routing and tracking software, Elena keeps DELO TRANS at the cutting edge of logistics tech.',
    socials: { linkedin: '#', mail: '#' },
  },
];

export default function TeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-24 lg:py-32 bg-[#0A0F1C] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16 lg:mb-24 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <UsersIcon className="w-4 h-4 text-orange" />
              <span className="font-mono text-xs uppercase tracking-wider text-gray-300">Leadership</span>
            </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">Team</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            The passionate minds orchestrating our logistics network behind the scenes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({ member, index, isInView }: { member: typeof teamMembers[0], index: number, isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-navy-800/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-300" />
        <img 
          src={member.image} 
          alt={member.name}
          className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
        
        {/* Social Links shown on Hover */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {member.socials.linkedin && (
             <a href={member.socials.linkedin} className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-blue-500 hover:text-white text-gray-300 transition-colors">
               <Linkedin className="w-4 h-4" />
             </a>
          )}
          {member.socials.twitter && (
             <a href={member.socials.twitter} className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-sky-400 hover:text-white text-gray-300 transition-colors">
               <Twitter className="w-4 h-4" />
             </a>
          )}
          {member.socials.mail && (
             <a href={member.socials.mail} className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-orange hover:text-white text-gray-300 transition-colors">
               <Mail className="w-4 h-4" />
             </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-heading font-bold text-xl text-white mb-1">{member.name}</h3>
        <p className="font-mono text-xs uppercase tracking-wider text-orange mb-4">{member.role}</p>
        <p className="text-sm text-gray-400 leading-relaxed mt-auto">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
