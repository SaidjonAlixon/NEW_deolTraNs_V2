import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MapPin, Package, User, Mail, Phone, Building } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    from: '',
    to: '',
    cargo: '',
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Image slide in
      gsap.fromTo(
        imageRef.current,
        { x: '-20vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 25%',
            scrub: 0.4,
          },
        }
      );

      // Form slide in
      gsap.fromTo(
        formRef.current,
        { x: '18vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.4,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your request! We will contact you within one business day.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      from: '',
      to: '',
      cargo: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="quote"
      className="relative min-h-screen bg-navy-900 py-10 lg:py-0 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch lg:min-h-screen">
        
        {/* Left Image Panel */}
        <div
          ref={imageRef}
          className="lg:w-1/2 w-full px-6 lg:pl-10 lg:pr-5 xl:pl-16 xl:pr-6 py-6 lg:py-20 flex flex-col self-stretch"
        >
          <div className="relative w-full flex-1 h-[40vh] lg:h-auto min-h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/images/quote_office.jpg"
              alt="Office with logistics planning"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy-900/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-navy-900/40" />
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 w-full px-6 lg:pr-10 lg:pl-5 xl:pr-16 xl:pl-6 py-6 lg:py-20 flex flex-col self-stretch">
          <div
            ref={formRef}
            className="w-full flex-1 flex flex-col justify-center bg-navy-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-8">
                <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">
                  Request a quote
                </h2>
                <p className="text-gray-light">
                  We reply within one business day.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-light mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-light mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-light mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-light mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-light mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      From
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                      placeholder="Origin city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-light mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      To
                    </label>
                    <input
                      type="text"
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                      placeholder="Destination city"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-light mb-2">
                    <Package className="w-4 h-4 inline mr-2" />
                    Cargo details
                  </label>
                  <textarea
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-navy-900/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors resize-none"
                    placeholder="Describe your cargo (type, weight, dimensions, etc.)"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                >
                  <Send className="w-4 h-4" />
                  Get a quote
                </button>

                <p className="text-xs text-gray-light text-center">
                  By submitting, you agree to our Privacy Policy.
                </p>
              </form>
            </div>
        </div>
      </div>
    </section>
  );
}
