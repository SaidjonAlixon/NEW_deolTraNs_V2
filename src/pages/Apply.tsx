import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Truck, User, X } from 'lucide-react';
import { gtmFormLocationFromPathname, pushApplyStep1Submit } from '../lib/gtmDataLayer';
import { cn } from '../lib/utils';

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  driverType: string;
  /** Optional note shown as "Message" in UI; sent as `comments` in API payload when non-empty. */
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const DRIVER_TYPE_OPTIONS = ['Company driver', 'Owner operator', 'Investor', 'Others'];

const applySteps = [
  { id: 1, name: 'Details', icon: User },
  { id: 2, name: 'Done', icon: Check },
];

const initialForm: FormData = {
  fullName: '',
  phone: '',
  email: '',
  driverType: '',
  message: '',
};

function onlyDigits(input: string): string {
  return input.replace(/\D/g, '');
}

function formatUsPhone(input: string): string {
  const digits = onlyDigits(input).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validateName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'This field is required';
  if (/\d/.test(trimmed)) return 'Name cannot contain numbers';
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) return 'Please enter your first and last name';
  if (!/^[A-Za-z\s'-]+$/.test(trimmed)) return 'Name can only contain letters';
  return '';
}

function validatePhone(value: string): string {
  const digits = onlyDigits(value);
  if (!value.trim()) return 'This field is required';
  if (digits.length < 10) return 'Phone number must be 10 digits';
  if (digits.length !== 10) return 'Please enter a valid US phone number';
  if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(value)) return 'Please enter a valid US phone number';
  return '';
}

function validateEmail(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'This field is required';
  if (/\s/.test(trimmed)) return 'Email cannot contain spaces';
  if (!trimmed.includes('@')) return 'Email must include @';
  const parts = trimmed.split('@');
  if (parts.length !== 2) return 'Please enter a valid email address';
  const [localPart, domainPart] = parts;
  if (!localPart || !domainPart) return 'Please enter a valid email address';
  if (!/^[A-Za-z0-9._%+-]+$/.test(localPart)) return 'Please enter a valid email address';
  if (!/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domainPart)) {
    return 'Please enter a valid email (e.g. name@gmail.com)';
  }
  return '';
}

export default function Apply() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const formLocation = useMemo(() => gtmFormLocationFromPathname('/apply'), []);

  useEffect(() => {
    document.title = 'Apply to Drive with Delo Trans';
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const closeApply = () => navigate('/');

  const onChange = (field: keyof FormData, value: string) => {
    const nextValue =
      field === 'phone' ? formatUsPhone(value) : field === 'message' ? value.slice(0, 2000) : value;
    const next = { ...form, [field]: nextValue };
    setForm(next);
    setServerError('');

    const nextErrors: FormErrors = { ...errors };
    if (field === 'fullName') nextErrors.fullName = validateName(next.fullName);
    if (field === 'phone') nextErrors.phone = validatePhone(next.phone);
    if (field === 'email') nextErrors.email = validateEmail(next.email);
    if (field === 'driverType') nextErrors.driverType = next.driverType ? '' : 'This field is required';
    if (field === 'message') nextErrors.message = '';
    setErrors(nextErrors);
  };

  const validateAll = (): FormErrors => ({
    fullName: validateName(form.fullName),
    phone: validatePhone(form.phone),
    email: validateEmail(form.email),
    driverType: form.driverType ? '' : 'This field is required',
    message: '',
  });

  const hasAnyError = (e: FormErrors): boolean => Object.values(e).some(Boolean);

  const submit = async () => {
    const nextErrors = validateAll();
    setErrors(nextErrors);
    if (hasAnyError(nextErrors)) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const leadId = `apply-${Date.now()}`;
      const sourceUrl = window.location.href;
      const submittedAt = new Date().toISOString();
      const messageTrim = form.message.trim();
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow: 'apply_step1',
          leadId,
          sourceUrl,
          submittedAt,
          name: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          driverType: form.driverType,
          ...(messageTrim ? { comments: messageTrim } : {}),
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) throw new Error(data?.message || 'Failed to submit');

      pushApplyStep1Submit(
        formLocation,
        form.driverType.toLowerCase().replace(/\s+/g, '_')
      );
      setStep(2);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (error?: string) =>
    cn(
      'w-full min-h-12 rounded-xl border px-4 py-3 text-base bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/40',
      error ? 'border-red-500' : 'border-border'
    );

  return (
    <>
      <div
        className="fixed inset-0 z-[10050] bg-black/55 backdrop-blur-md"
        aria-hidden
        onClick={closeApply}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[10051] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-dialog-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto w-full max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className={cn(
              'driver-app-modal relative flex max-h-[92vh] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.4)]'
            )}
          >
            <div className="pointer-events-none absolute inset-0 z-0 rounded-3xl bg-gradient-to-br from-red-600/20 via-transparent to-blue-600/15" />
            <div className="absolute inset-px z-0 rounded-3xl bg-card" />

            <div className="relative z-10 flex max-h-[92vh] flex-col">
              <div className="relative px-7 pt-7 pb-6">
                <div className="pointer-events-none absolute top-0 left-1/2 h-32 w-3/4 -translate-x-1/2 bg-red-600/10 blur-3xl" />

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/10 px-3 py-1">
                      <Truck className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        DELO TRANS INC
                      </span>
                    </div>
                    <h1
                      id="apply-dialog-title"
                      className="font-heading text-2xl font-extrabold leading-tight text-foreground"
                    >
                      Apply to Drive
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {step === 1
                        ? 'Step 1 of 2 — Your details'
                        : 'Step 2 of 2 — Confirmation'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeApply}
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {applySteps.map((s, index) => {
                    const StepIcon = s.icon;
                    const isDone = step > s.id;
                    const isActive = step === s.id;
                    return (
                      <div key={s.id} className="contents">
                        <motion.div className="flex flex-col items-center gap-1.5">
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500',
                              isDone && 'border-red-600 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.5)]',
                              isActive &&
                                !isDone &&
                                'scale-110 border-primary/45 bg-muted shadow-[0_0_12px_hsl(var(--primary)/0.2)]',
                              !isDone && !isActive && 'border-border bg-muted/40'
                            )}
                          >
                            {isDone ? (
                              <Check className="h-4 w-4 text-white" />
                            ) : (
                              <StepIcon
                                className={cn(
                                  'h-4 w-4',
                                  isActive ? 'text-foreground' : 'text-muted-foreground'
                                )}
                              />
                            )}
                          </div>
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-wider',
                              isActive ? 'text-foreground' : isDone ? 'text-red-500' : 'text-muted-foreground'
                            )}
                          >
                            {s.name}
                          </span>
                        </motion.div>
                        {index < applySteps.length - 1 && (
                          <div
                            className={cn(
                              'mb-4 h-0.5 flex-1 transition-all duration-500',
                              step > 1 ? 'bg-red-600' : 'bg-border'
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mx-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div
                className="flex-grow overflow-y-auto px-7 py-6"
                style={{ scrollbarWidth: 'none' }}
              >
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <p className="mb-5 text-sm text-muted-foreground">
                        Short form — tell us how to reach you. Our team will follow up shortly.
                      </p>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Full Name
                        </label>
                        <input
                          value={form.fullName}
                          onChange={(e) => onChange('fullName', e.target.value)}
                          className={inputClass(errors.fullName)}
                          placeholder="John Doe"
                        />
                        {errors.fullName ? (
                          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={form.phone}
                          onChange={(e) => onChange('phone', e.target.value)}
                          className={inputClass(errors.phone)}
                          placeholder="(555) 123-4567"
                        />
                        {errors.phone ? (
                          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                        ) : null}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Email
                        </label>
                        <input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => onChange('email', e.target.value)}
                          className={inputClass(errors.email)}
                          placeholder="name@gmail.com"
                        />
                        {errors.email ? (
                          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Driver Type
                        </label>
                        <select
                          value={form.driverType}
                          onChange={(e) => onChange('driverType', e.target.value)}
                          className={inputClass(errors.driverType)}
                        >
                          <option value="">Select driver type</option>
                          {DRIVER_TYPE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors.driverType ? (
                          <p className="mt-1 text-xs text-red-600">{errors.driverType}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Message{' '}
                          <span className="font-normal normal-case tracking-normal text-muted-foreground">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) => onChange('message', e.target.value)}
                          rows={4}
                          className={inputClass(undefined)}
                          placeholder="Anything you would like us to know"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">{form.message.length}/2000</p>
                      </div>

                      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl border border-emerald-300/60 bg-emerald-500/10 p-6"
                    >
                      <h2 className="text-xl font-bold text-foreground">
                        Thanks! Your application was received.
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Our recruiting team will contact you soon.
                      </p>
                      <p className="mt-4 text-sm">
                        <Link
                          to="/"
                          className="font-semibold text-red-500 underline underline-offset-2 hover:text-red-400"
                        >
                          Back to home
                        </Link>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {step === 1 && (
                <div className="flex items-center justify-between border-t border-border bg-muted/50 px-7 py-5">
                  <span className="text-xs font-medium text-muted-foreground">1 / 2</span>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={isSubmitting}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-extrabold transition-all duration-300',
                      'bg-red-600 text-white shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:bg-red-500 hover:shadow-[0_4px_25px_rgba(220,38,38,0.55)]',
                      'disabled:pointer-events-none disabled:opacity-40'
                    )}
                  >
                    {isSubmitting ? 'Sending…' : 'Submit Application'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
