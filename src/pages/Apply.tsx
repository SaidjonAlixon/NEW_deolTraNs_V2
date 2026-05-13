import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { gtmFormLocationFromPathname, pushApplyStep1Submit } from '../lib/gtmDataLayer';

type FormData = {
  fullName: string;
  phone: string;
  driverType: string;
  /** Optional note shown as "Message" in UI; sent as `comments` in API payload when non-empty. */
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const DRIVER_TYPE_OPTIONS = ['Company driver', 'Owner operator', 'Investor', 'Others'];

const initialForm: FormData = {
  fullName: '',
  phone: '',
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

export default function Apply() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const formLocation = useMemo(() => gtmFormLocationFromPathname('/apply'), []);

  useEffect(() => {
    document.title = 'Apply to Drive with Delo Trans';
    window.scrollTo(0, 0);
  }, []);

  const onChange = (field: keyof FormData, value: string) => {
    const nextValue =
      field === 'phone' ? formatUsPhone(value) : field === 'message' ? value.slice(0, 2000) : value;
    const next = { ...form, [field]: nextValue };
    setForm(next);
    setServerError('');

    const nextErrors: FormErrors = { ...errors };
    if (field === 'fullName') nextErrors.fullName = validateName(next.fullName);
    if (field === 'phone') nextErrors.phone = validatePhone(next.phone);
    if (field === 'driverType') nextErrors.driverType = next.driverType ? '' : 'This field is required';
    if (field === 'message') nextErrors.message = '';
    setErrors(nextErrors);
  };

  const validateAll = (): FormErrors => ({
    fullName: validateName(form.fullName),
    phone: validatePhone(form.phone),
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
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (error?: string) =>
    `w-full min-h-12 rounded-xl border px-4 py-3 text-base bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-500' : 'border-border'
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-xl px-4 pb-28 pt-8 sm:pt-12">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">DELO TRANS INC</p>
          <h1 className="mt-2 text-3xl font-bold">Apply to Drive with Delo Trans</h1>
          <p className="mt-2 text-sm text-muted-foreground">Short form — tell us how to reach you.</p>
        </header>

        {step === 1 && (
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Your details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => onChange('fullName', e.target.value)}
                  className={inputClass(errors.fullName)}
                  placeholder="John Doe"
                />
                {errors.fullName ? <p className="mt-1 text-xs text-red-600">{errors.fullName}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                  className={inputClass(errors.phone)}
                  placeholder="(555) 123-4567"
                />
                {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Driver Type</label>
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
                {errors.driverType ? <p className="mt-1 text-xs text-red-600">{errors.driverType}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Message <span className="font-normal text-muted-foreground">(optional)</span>
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
            </div>

            {serverError ? <p className="mt-4 text-sm text-red-600">{serverError}</p> : null}

            <button
              type="button"
              onClick={submit}
              disabled={isSubmitting}
              className="mt-6 min-h-12 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit application'}
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900">
            <h2 className="text-xl font-bold">Thanks! Your application was received.</h2>
            <p className="mt-2 text-sm">
              Our recruiting team will contact you soon.
            </p>
            <p className="mt-4 text-sm">
              <Link
                to="/"
                className="font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-950"
              >
                Back to home
              </Link>
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
