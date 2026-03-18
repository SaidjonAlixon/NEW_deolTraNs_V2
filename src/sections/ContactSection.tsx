import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Headphones, Send, Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    title: 'Global Headquarters',
    detail: '636 N Irwin St',
    subDetail: 'Dayton, OH 45403',
    icon: Building2,
  },
  {
    title: 'General Inquiries',
    detail: 'hr@delotransinc.com',
    subDetail: "We'll get back to you as soon as we can.",
    icon: Mail,
  },
  {
    title: '24/7 Operations Support',
    detail: '+1 326 220 7171',
    subDetail: 'Available for urgent shipments',
    icon: Headphones,
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
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

      // 1. Background glow reveal
      tl.fromTo(
        '.contact-mesh-orb',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
      );

      // 2. Section Title and Description (Snappy slide up)
      tl.fromTo(
        '.contact-animate-title', 
        { y: 40, opacity: 0, scale: 0.98, filter: 'blur(8px)' },
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
      );

      // 3. Form and Map Cards (Faster reveal)
      tl.fromTo(
        '.contact-animate-card',
        { y: 40, opacity: 0, transformPerspective: 1000, rotateX: -10 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
      );

      // 4. Contact Row Info (Snappy)
      tl.fromTo(
        '.contact-animate-info',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
        '-=0.3'
      );

      // Animated mesh orbs
      gsap.to('.contact-mesh-orb-1', {
        x: '+=50',
        y: '+=30',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.contact-mesh-orb-2', {
        x: '-=40',
        y: '-=60',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.contact-mesh-orb-3', {
        x: '+=30',
        y: '-=40',
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await res.text();
      let data: { success?: boolean; message?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(res.ok ? 'Invalid response' : `Server error (${res.status}). Please try again.`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.message || `Server error (${res.status})`);
      }

      alert('Message sent. We will contact you shortly.');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact message', error);
      alert('Message could not be sent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="relative h-[45vh] lg:h-[55vh] w-full flex flex-col justify-center items-center overflow-hidden">
        
        {/* Image-less Premium Background (Mesh/Gradient) */}
        <div className="absolute inset-0 z-0 bg-[#0A0F1C] overflow-hidden">
          {/* Main Gradient Surface */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.18),transparent_60%)]" />
          
          {/* Mesh Orbs - More Vibrant */}
          <div className="contact-mesh-orb contact-mesh-orb-1 absolute top-[5%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-blue-500/15 blur-[120px]" />
          <div className="contact-mesh-orb contact-mesh-orb-2 absolute bottom-[15%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-red-500/10 blur-[110px]" />
          <div className="contact-mesh-orb contact-mesh-orb-3 absolute top-[30%] right-[25%] w-[35vw] h-[35vw] rounded-full bg-blue-400/12 blur-[150px]" />
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
          
          {/* Fades smoothly into the bottom section */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900 to-transparent" />
        </div>

        {/* Title Centered over the image */}
        <div className="w-full text-center max-w-4xl mx-auto px-6 relative z-10 pt-10">
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
                <p className="text-gray-light text-sm lg:text-base">636 N Irwin St, Dayton, OH 45403</p>
              </div>
              <div className="flex-grow rounded-2xl overflow-hidden relative min-h-[400px]">
                <iframe 
                  src="https://maps.google.com/maps?q=636%20N%20Irwin%20St,%20Dayton,%20OH%2045403&t=&z=13&ie=UTF8&iwloc=&output=embed" 
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
                      <span className="text-lg">Submit</span>
                      <Send className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Contact Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-8 pt-6 border-t border-white/5">
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
