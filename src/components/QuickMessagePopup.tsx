import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

function formatUSPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidEmail(email: string): boolean {
  const value = email.trim();
  if (!value) return false;
  if (/\s/.test(value)) return false;
  if (!value.includes('@')) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  return /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain);
}

function validateName(value: string): string {
  const v = value.trim();
  if (!v) return 'This field is required';
  if (/\d/.test(v)) return 'Name cannot contain numbers';
  const words = v.split(/\s+/).filter(Boolean);
  if (words.length < 2) return 'Please enter your first and last name';
  if (!/^[A-Za-z\s'-]+$/.test(v)) return 'Name can contain only letters';
  return '';
}

function validatePhone(value: string): string {
  const v = value.trim();
  if (!v) return '';
  const digits = v.replace(/\D/g, '');
  if (digits.length !== 10) return 'Phone number must contain exactly 10 digits';
  if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(v)) return 'Use US format: (XXX) XXX-XXXX';
  return '';
}

function validateEmail(value: string): string {
  const v = value.trim();
  if (!v) return '';
  if (!isValidEmail(v)) return 'Please enter a valid email address';
  return '';
}

export default function QuickMessagePopup() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
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
    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    const messageError = formData.message.trim().length >= 3 ? '' : 'Message must be at least 3 characters';
    const hasContact = Boolean(formData.email.trim() || formData.phone.trim());
    const contactValid = hasContact && !phoneError && !emailError;

    return !nameError && !messageError && contactValid;
  }, [formData]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const normalizedValue = name === 'phone' ? formatUSPhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
    if (feedback) setFeedback('');

    setErrors((prev) => {
      const next: FormErrors = { ...prev };
      if (name === 'name') next.name = validateName(normalizedValue);
      if (name === 'phone') next.phone = validatePhone(normalizedValue);
      if (name === 'email') next.email = validateEmail(normalizedValue);
      if (name === 'message') {
        next.message = normalizedValue.trim().length >= 3 ? '' : 'Message must be at least 3 characters';
      }
      return next;
    });
  };

  const onClose = () => setOpen(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      message: formData.message.trim().length >= 3 ? '' : 'Message must be at least 3 characters',
    };
    setErrors(nextErrors);

    if (!formData.email.trim() && !formData.phone.trim()) {
      setFeedback('Enter at least phone or email so our team can reply.');
      return;
    }

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
      setErrors({});
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
            className="relative w-full max-w-lg rounded-3xl border border-slate-300/90 bg-gradient-to-b from-white/95 via-slate-50/95 to-slate-100/95 p-6 sm:p-7 shadow-[0_30px_70px_rgba(15,23,42,0.25)] dark:border-white/10 dark:from-[#061326]/95 dark:via-[#081a33]/95 dark:to-[#050d1d]/95 dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <button
              type="button"
              aria-label="Close quick message popup"
              onClick={onClose}
              className="absolute right-4 top-4 h-9 w-9 rounded-full border border-slate-300 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-white/15 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="mx-auto h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center dark:bg-blue-500/15 dark:border-blue-500/30">
                <MessageCircle className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-700/90 font-mono dark:text-blue-200/80">Quick Contact</p>
                <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Send Us a Fast Message</h3>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-gray-300">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  placeholder="John Doe"
                  className={`w-full rounded-xl border bg-white/95 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 ${errors.name ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-white/10'}`}
                  required
                />
                {errors.name ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p> : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-gray-300">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder="(555) 000-0000"
                    className={`w-full rounded-xl border bg-white/95 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 ${errors.phone ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-white/10'}`}
                  />
                  {errors.phone ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p> : null}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="name@company.com"
                    className={`w-full rounded-xl border bg-white/95 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 ${errors.email ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-white/10'}`}
                  />
                  {errors.email ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p> : null}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-gray-300">Comment</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  rows={4}
                  placeholder="How can we help you today?"
                  className={`w-full rounded-xl border bg-white/95 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 resize-none dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 ${errors.message ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-white/10'}`}
                  required
                />
                {errors.message ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.message}</p> : null}
              </div>

              {feedback ? (
                <p className="text-sm text-slate-700 dark:text-gray-200/90">{feedback}</p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-gray-400">Enter at least phone or email so our team can reply.</p>
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
