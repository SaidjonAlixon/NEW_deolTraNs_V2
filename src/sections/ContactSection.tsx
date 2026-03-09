import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Headphones, Send, Building2, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    title: 'Global Headquarters',
    detail: 'Tashkent, Uzbekistan',
    subDetail: '123 Logistics Ave, Business District',
    icon: Building2,
  },
  {
    title: 'General Inquiries',
    detail: 'info@delotrans.inc',
    subDetail: 'Guaranteed 2-hour response time',
    icon: Mail,
  },
  {
    title: '24/7 Operations Support',
    detail: '+998 90 123 45 67',
    subDetail: 'Available for urgent shipments',
    icon: Headphones,
  },
  {
    title: 'International Presence',
    detail: '12+ Regional Hubs',
    subDetail: 'Spanning across Central Asia & Europe',
    icon: Globe,
  }
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const titleGlowRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Main Reveal Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1. Background image reveal
      tl.fromTo(
        bgImageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      );

      // 2. Section Title and Description (Smooth slide up + text reveal)
      tl.fromTo(
        '.contact-animate-title', 
        { y: 60, opacity: 0, scale: 0.95, filter: 'blur(10px)' },
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, stagger: 0.2, ease: 'power4.out' },
        '-=0.8'
      );

      // 3. Form and Map Cards (Staggered from bottom)
      tl.fromTo(
        '.contact-animate-card',
        { y: 50, opacity: 0, transformPerspective: 1000, rotateX: -15 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15, ease: 'power3.out' },
        '-=0.5'
      );

      // 4. Contact Row Info (Last but not least)
      tl.fromTo(
        '.contact-animate-info',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.4)' },
        '-=0.6'
      );

      // Infinite slow tilt/pan on the background image for dynamic feel
      gsap.to('.contact-bg-img', {
        scale: 1.08,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for button animation
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message sent directly to DELO TRANS INC headquarters. We will contact you shortly.');
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section ref={sectionRef} id="contact" className="relative bg-navy-900 overflow-hidden text-center lg:text-left pt-0">
      
      {/* Top Banner with Image and Title */}
      <div className="relative h-[65vh] lg:h-[75vh] w-full flex flex-col justify-center items-center overflow-hidden">
        
        {/* Full Width Background Image */}
        <div ref={bgImageRef} className="absolute inset-0 z-0">
          <img
            src="/images/DELO_BIOM.png"
            alt="DELO TRANS INC Operations Background"
            className="contact-bg-img w-full h-full object-cover origin-center object-[center_30%]"
          />
          {/* Dimmer over the whole image so text is readable */}
          <div className="absolute inset-0 bg-navy-900/50 mix-blend-multiply" />
          {/* Fades smoothly into the bottom section */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900 to-transparent" />
        </div>

        {/* Title Centered over the image */}
        <div className="w-full text-center max-w-4xl mx-auto px-6 relative z-10 mt-16">
          <div ref={titleGlowRef} className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-blue-500/10 blur-[120px] h-64 w-full opacity-0 pointer-events-none" />
          
          <h2 className="contact-animate-title font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 relative z-10 tracking-tight leading-[1.1] drop-shadow-2xl">
            <span className="text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(56,189,248,0.8)]" style={{ backgroundImage: 'linear-gradient(to right, #3ba3e3, #60bdf0)' }}>DELO TRANS INC</span>
          </h2>
          <p className="contact-animate-title text-gray-light text-lg lg:text-xl leading-relaxed relative z-10 max-w-2xl mx-auto drop-shadow-md font-medium px-4">
            Whether you have a complex logistics challenge or need a reliable regular carrier, our executive team is ready to engineer a custom solution for your supply chain.
          </p>
        </div>
      </div>

      {/* Bottom Content Area: Form, Map, and Cards */}
      <div className="relative z-10 bg-navy-900 w-full pt-12 pb-20">
        <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 xl:px-16 flex flex-col gap-12 lg:gap-16">
          
          {/* Middle Area: Map on Left, Form on Right */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch justify-between w-full relative z-20">
            
            {/* Map Location container */}
            <div className="contact-animate-card w-full lg:w-1/2 relative bg-navy-800/40 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl flex flex-col text-left">
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Our Location</h3>
                <p className="text-gray-light text-sm lg:text-base">500 N Central Expy, Suite 360, Plano, TX, 75074</p>
              </div>
              <div className="flex-grow rounded-2xl overflow-hidden relative min-h-[400px]">
                <iframe 
                  src="https://maps.google.com/maps?q=500%20N%20Central%20Expy,%20Suite%20360,%20Plano,%20TX,%2075074&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                  className="absolute inset-0 w-full h-full border-0 opacity-95 transition-all duration-300 hover:opacity-100"
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="DELO TRANS INC Address"
                />
                <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="contact-animate-card w-full lg:w-1/2 relative bg-navy-800/40 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left flex flex-col">
              {/* Form decor */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
              
              <div className="mb-8">
                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Direct Message</h3>
                <p className="text-gray-light text-sm lg:text-base">Priority routing to the right specialist.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full px-5 py-5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus:bg-navy-900 transition-all duration-300 peer"
                        placeholder="Full Name"
                      />
                      <label htmlFor="name" className="absolute left-5 -top-2.5 bg-navy-800/90 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-blue-400 peer-focus:bg-navy-800/90 peer-focus:text-xs rounded-full">
                        Full Name
                      </label>
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="block w-full px-5 py-5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus:bg-navy-900 transition-all duration-300 peer"
                        placeholder="Company Name"
                      />
                      <label htmlFor="company" className="absolute left-5 -top-2.5 bg-navy-800/90 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-blue-400 peer-focus:bg-navy-800/90 peer-focus:text-xs rounded-full">
                        Company Name
                      </label>
                    </div>
                  </div>

                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full px-5 py-5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus:bg-navy-900 transition-all duration-300 peer"
                      placeholder="Corporate Email"
                    />
                    <label htmlFor="email" className="absolute left-5 -top-2.5 bg-navy-800/90 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-blue-400 peer-focus:bg-navy-800/90 peer-focus:text-xs rounded-full">
                      Corporate Email
                    </label>
                  </div>

                  <div className="relative group">
                    <textarea
                      name="message"
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      className="block w-full px-5 py-5 bg-navy-900/60 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus:bg-navy-900 transition-all duration-300 resize-none peer border-b-2"
                      placeholder="How can we help?"
                    />
                    <label htmlFor="message" className="absolute left-5 -top-2.5 bg-navy-800/90 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-blue-400 peer-focus:bg-navy-800/90 peer-focus:text-xs rounded-full">
                      How can we help?
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-3 mt-4"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-lg">Send Transmission</span>
                      <Send className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Contact Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-8 pt-6 border-t border-white/5">
            {contactInfo.map((info, idx) => (
              <div 
                key={idx} 
                className="contact-animate-info group bg-navy-800/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-blue-400/30 hover:bg-navy-800/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col gap-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:bg-blue-400/20 transition-all duration-500">
                    <info.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{info.title}</p>
                  </div>
                </div>
                <div>
                  <p className="text-white font-heading text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors duration-300">{info.detail}</p>
                  <p className="text-sm text-gray-500 leading-snug">{info.subDetail}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
