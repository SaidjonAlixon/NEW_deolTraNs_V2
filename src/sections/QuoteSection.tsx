import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Package, User, Mail, Phone, Building } from 'lucide-react';

const slideIn = (dir: 'left' | 'right', delay = 0) => ({
  initial: { opacity: 0, x: dir === 'left' ? -60 : 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' } as const,
  transition: { duration: 0.7, delay },
});

export default function QuoteSection() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', from: '', to: '', cargo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('/api/quote', {
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

      alert('Thank you for your request! We will contact you within one business day.');
      setFormData({ name: '', email: '', phone: '', company: '', from: '', to: '', cargo: '' });
    } catch (err) {
      console.error('Failed to submit quote request', err);
      alert('Request could not be sent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="quote"
      className="relative min-h-screen bg-app py-10 lg:py-0 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch lg:min-h-screen">

        {/* Left Image Panel */}
        <motion.div {...slideIn('left')} className="lg:w-1/2 w-full px-6 lg:pl-10 lg:pr-5 xl:pl-16 xl:pr-6 py-6 lg:py-20 flex flex-col self-stretch">
          <div className="relative w-full flex-1 h-[40vh] lg:h-auto min-h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/images/quote_office.jpg"
              alt="Office with logistics planning"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-app/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-app/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-app/40" />
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div {...slideIn('right', 0.1)} className="lg:w-1/2 w-full px-6 lg:pr-10 lg:pl-5 xl:pr-16 xl:pl-6 py-6 lg:py-20 flex flex-col self-stretch">
          <div className="w-full flex-1 flex flex-col justify-center bg-surface/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">

            {/* Header */}
            <div className="mb-8">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-orange mb-3">Get Started</p>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">
                Ready to Roll With a Smarter Carrier?
              </h2>
              <p className="text-gray-light mb-4">
                Apply today or contact our team to get started.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Owner Operators', 'Company Drivers', 'Brokers', 'Shippers', 'Investors'].map((tag) => (
                  <span key={tag} className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-orange/30 text-orange/80 bg-orange/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-light mb-2">
                    <User className="w-4 h-4 inline mr-2" />Name
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-app/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-light mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-app/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                    placeholder="your@email.com" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-light mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />Phone
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-app/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                    placeholder="+1 000 000 0000" />
                </div>
                <div>
                  <label className="block text-sm text-gray-light mb-2">
                    <Building className="w-4 h-4 inline mr-2" />Company
                  </label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange}
                    className="w-full px-4 py-3 bg-app/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                    placeholder="Your company" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-light mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />From
                  </label>
                  <input type="text" name="from" value={formData.from} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-app/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                    placeholder="Origin city" />
                </div>
                <div>
                  <label className="block text-sm text-gray-light mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />To
                  </label>
                  <input type="text" name="to" value={formData.to} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-app/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors"
                    placeholder="Destination city" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-light mb-2">
                  <Package className="w-4 h-4 inline mr-2" />Cargo details
                </label>
                <textarea name="cargo" value={formData.cargo} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 bg-app/50 border border-white/10 rounded-lg text-white placeholder-gray-light/50 focus:outline-none focus:border-orange transition-colors resize-none"
                  placeholder="Describe your cargo (type, weight, dimensions, etc.)" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Get a quote'}
              </button>

              <p className="text-xs text-gray-light text-center">
                By submitting, you agree to our Privacy Policy.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
