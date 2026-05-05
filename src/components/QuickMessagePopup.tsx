import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function QuickMessagePopup() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    let timeoutId: number | null = null;

    const startTimer = () => {
      timeoutId = window.setTimeout(() => setOpen(true), 5000);
    };

    if (document.readyState === 'complete') {
      startTimer();
    } else {
      window.addEventListener('load', startTimer, { once: true });
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener('load', startTimer);
    };
  }, []);

  const canSubmit = useMemo(() => {
    return formData.name.trim().length > 1 && formData.message.trim().length >= 3 && (formData.email.trim() || formData.phone.trim());
  }, [formData]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (feedback) setFeedback('');
  };

  const onClose = () => setOpen(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !canSubmit) return;

    setIsSubmitting(true);
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          company: 'Website quick message popup',
          message: formData.message.trim(),
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Failed to send message');
      }

      setFeedback('Message sent. Our team will contact you shortly.');
      setFormData(initialForm);
      window.setTimeout(() => setOpen(false), 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Message could not be sent';
      setFeedback(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2200] px-4 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-app/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-b from-[#061326]/95 via-[#081a33]/95 to-[#050d1d]/95 p-6 sm:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <button
              type="button"
              aria-label="Close quick message popup"
              onClick={onClose}
              className="absolute right-4 top-4 h-9 w-9 rounded-full border border-white/15 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="mx-auto h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-200/80 font-mono">Quick Contact</p>
                <h3 className="text-2xl font-heading font-bold text-white">Send Us a Fast Message</h3>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-300">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-300">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-300">Comment</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  rows={4}
                  placeholder="How can we help you today?"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors focus:border-blue-400 resize-none"
                  required
                />
              </div>

              {feedback ? (
                <p className="text-sm text-gray-200/90">{feedback}</p>
              ) : (
                <p className="text-xs text-gray-400">Enter at least phone or email so our team can reply.</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
