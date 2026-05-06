import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import {
  gtmFormLocationFromPathname,
  pushApplyStep1Submit,
  pushApplyStep2Submit,
} from '../lib/gtmDataLayer';

type Step1Data = {
  fullName: string;
  phone: string;
  cdlClass: string;
  driverType: string;
};

type Step2Data = {
  yearsExperience: string;
  state: string;
  sapProgram: string;
  duiDwi: string;
  comments: string;
};

type FormErrors = Partial<Record<keyof Step1Data | keyof Step2Data, string>>;

const CDL_OPTIONS = ['Class A', 'Class B', 'No CDL'];
const DRIVER_TYPE_OPTIONS = ['Company Driver', 'Owner Operator'];
const EXPERIENCE_OPTIONS = ['Less than 1 year', '1-2 years', '2-5 years', '5+ years'];
const YES_NO_OPTIONS = ['No', 'Yes'];
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

const initialStep1: Step1Data = {
  fullName: '',
  phone: '',
  cdlClass: '',
  driverType: '',
};

const initialStep2: Step2Data = {
  yearsExperience: '',
  state: '',
  sapProgram: '',
  duiDwi: '',
  comments: '',
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
  const [step1, setStep1] = useState<Step1Data>(initialStep1);
  const [step2, setStep2] = useState<Step2Data>(initialStep2);
  const [step1Errors, setStep1Errors] = useState<FormErrors>({});
  const [step2Errors, setStep2Errors] = useState<FormErrors>({});
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [leadId, setLeadId] = useState('');
  const [isStep1Submitting, setIsStep1Submitting] = useState(false);
  const [isStep2Submitting, setIsStep2Submitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const formLocation = useMemo(() => gtmFormLocationFromPathname('/apply'), []);

  useEffect(() => {
    document.title = 'Apply to Drive with Delo Trans';
    window.scrollTo(0, 0);
  }, []);

  const cdlWarning =
    step1.cdlClass === 'No CDL'
      ? 'CDL-A is required to apply. If you are currently in training, you may still apply.'
      : '';

  const sapWarning =
    step2.sapProgram === 'Yes'
      ? 'We currently do not accept drivers in the SAP program.'
      : '';

  const duiWarning =
    step2.duiDwi === 'Yes'
      ? 'A DUI or DWI in the last 3 years may affect eligibility. Our team will review your application.'
      : '';

  const onStep1Change = (field: keyof Step1Data, value: string) => {
    const nextValue = field === 'phone' ? formatUsPhone(value) : value;
    const next = { ...step1, [field]: nextValue };
    setStep1(next);
    setServerError('');

    const nextErrors: FormErrors = { ...step1Errors };
    if (field === 'fullName') nextErrors.fullName = validateName(next.fullName);
    if (field === 'phone') nextErrors.phone = validatePhone(next.phone);
    if (field === 'cdlClass') nextErrors.cdlClass = next.cdlClass ? '' : 'This field is required';
    if (field === 'driverType') nextErrors.driverType = next.driverType ? '' : 'This field is required';
    setStep1Errors(nextErrors);
  };

  const onStep2Change = (field: keyof Step2Data, value: string) => {
    const nextValue = field === 'comments' ? value.slice(0, 500) : value;
    const next = { ...step2, [field]: nextValue };
    setStep2(next);
    setServerError('');

    const nextErrors: FormErrors = { ...step2Errors };
    if (field !== 'comments') nextErrors[field] = next[field] ? '' : 'This field is required';
    setStep2Errors(nextErrors);
  };

  const validateStep1All = (): FormErrors => {
    return {
      fullName: validateName(step1.fullName),
      phone: validatePhone(step1.phone),
      cdlClass: step1.cdlClass ? '' : 'This field is required',
      driverType: step1.driverType ? '' : 'This field is required',
    };
  };

  const validateStep2All = (): FormErrors => {
    return {
      yearsExperience: step2.yearsExperience ? '' : 'This field is required',
      state: step2.state ? '' : 'This field is required',
      sapProgram: step2.sapProgram ? '' : 'This field is required',
      duiDwi: step2.duiDwi ? '' : 'This field is required',
      comments: '',
    };
  };

  const hasAnyError = (errors: FormErrors): boolean => Object.values(errors).some(Boolean);

  const submitStep1 = async () => {
    const errors = validateStep1All();
    setStep1Errors(errors);
    if (hasAnyError(errors)) return;
    if (isStep1Submitting) return;

    setIsStep1Submitting(true);
    setServerError('');

    try {
      const localLeadId = `apply-${Date.now()}`;
      const sourceUrl = window.location.href;
      const submittedAt = new Date().toISOString();
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow: 'apply_step1',
          leadId: localLeadId,
          sourceUrl,
          submittedAt,
          name: step1.fullName.trim(),
          phone: step1.phone.trim(),
          cdlClass: step1.cdlClass,
          driverType: step1.driverType,
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; leadId?: string };
      if (!res.ok || !data.success) throw new Error(data?.message || 'Failed to submit step 1');

      const serverLeadId = data.leadId || localLeadId;
      setLeadId(serverLeadId);
      pushApplyStep1Submit(formLocation, step1.driverType.toLowerCase().replace(/\s+/g, '_'));
      setStep(2);
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setServerError(message);
    } finally {
      setIsStep1Submitting(false);
    }
  };

  const submitStep2 = async (skip = false) => {
    if (!skip) {
      const errors = validateStep2All();
      setStep2Errors(errors);
      if (hasAnyError(errors)) return;
    }
    if (isStep2Submitting) return;

    setIsStep2Submitting(true);
    setServerError('');

    try {
      const sourceUrl = window.location.href;
      const submittedAt = new Date().toISOString();
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow: skip ? 'apply_step2_skipped' : 'apply_step2',
          leadId,
          sourceUrl,
          submittedAt,
          ...(!skip ? step2 : {}),
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) throw new Error(data?.message || 'Failed to submit step 2');

      pushApplyStep2Submit(formLocation, step1.driverType.toLowerCase().replace(/\s+/g, '_'));
      setStep(3);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setServerError(message);
    } finally {
      setIsStep2Submitting(false);
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
          <p className="mt-2 text-sm text-muted-foreground">Fast 2-step form. No documents required right now.</p>
        </header>

        {step === 1 && (
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Step 1 - Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                <input
                  value={step1.fullName}
                  onChange={(e) => onStep1Change('fullName', e.target.value)}
                  className={inputClass(step1Errors.fullName)}
                  placeholder="John Doe"
                />
                {step1Errors.fullName ? <p className="mt-1 text-xs text-red-600">{step1Errors.fullName}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={step1.phone}
                  onChange={(e) => onStep1Change('phone', e.target.value)}
                  className={inputClass(step1Errors.phone)}
                  placeholder="(555) 123-4567"
                />
                {step1Errors.phone ? <p className="mt-1 text-xs text-red-600">{step1Errors.phone}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">CDL Class</label>
                <select
                  value={step1.cdlClass}
                  onChange={(e) => onStep1Change('cdlClass', e.target.value)}
                  className={inputClass(step1Errors.cdlClass)}
                >
                  <option value="">Select CDL class</option>
                  {CDL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {step1Errors.cdlClass ? <p className="mt-1 text-xs text-red-600">{step1Errors.cdlClass}</p> : null}
                {cdlWarning ? <p className="mt-1 text-xs text-amber-600">{cdlWarning}</p> : null}
              </div>

              <div>
                <p className="mb-1.5 block text-sm font-medium">Driver Type</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DRIVER_TYPE_OPTIONS.map((option) => {
                    const checked = step1.driverType === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onStep1Change('driverType', option)}
                        className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm ${
                          checked ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-border'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {step1Errors.driverType ? <p className="mt-1 text-xs text-red-600">{step1Errors.driverType}</p> : null}
              </div>
            </div>

            {serverError ? <p className="mt-4 text-sm text-red-600">{serverError}</p> : null}

            <button
              type="button"
              onClick={submitStep1}
              disabled={isStep1Submitting}
              className="mt-6 min-h-12 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white disabled:opacity-60"
            >
              {isStep1Submitting ? 'Submitting...' : 'Continue'}
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-emerald-600">Got it! One more step and you are done.</p>
            <h2 className="mb-4 text-lg font-semibold">Step 2 - Additional Info</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Years of Experience</label>
                <select
                  value={step2.yearsExperience}
                  onChange={(e) => onStep2Change('yearsExperience', e.target.value)}
                  className={inputClass(step2Errors.yearsExperience)}
                >
                  <option value="">Select experience</option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {step2Errors.yearsExperience ? (
                  <p className="mt-1 text-xs text-red-600">{step2Errors.yearsExperience}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">State (current location)</label>
                <select
                  value={step2.state}
                  onChange={(e) => onStep2Change('state', e.target.value)}
                  className={inputClass(step2Errors.state)}
                >
                  <option value="">Select state</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {step2Errors.state ? <p className="mt-1 text-xs text-red-600">{step2Errors.state}</p> : null}
              </div>

              <div>
                <p className="mb-1.5 block text-sm font-medium">SAP Program</p>
                <div className="grid grid-cols-2 gap-2">
                  {YES_NO_OPTIONS.map((option) => {
                    const checked = step2.sapProgram === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onStep2Change('sapProgram', option)}
                        className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm ${
                          checked ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-border'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {step2Errors.sapProgram ? <p className="mt-1 text-xs text-red-600">{step2Errors.sapProgram}</p> : null}
                {sapWarning ? <p className="mt-1 text-xs text-amber-600">{sapWarning}</p> : null}
              </div>

              <div>
                <p className="mb-1.5 block text-sm font-medium">DUI or DWI in last 3 years</p>
                <div className="grid grid-cols-2 gap-2">
                  {YES_NO_OPTIONS.map((option) => {
                    const checked = step2.duiDwi === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onStep2Change('duiDwi', option)}
                        className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm ${
                          checked ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-border'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {step2Errors.duiDwi ? <p className="mt-1 text-xs text-red-600">{step2Errors.duiDwi}</p> : null}
                {duiWarning ? <p className="mt-1 text-xs text-amber-600">{duiWarning}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Comments / Questions (optional)</label>
                <textarea
                  value={step2.comments}
                  onChange={(e) => onStep2Change('comments', e.target.value)}
                  rows={4}
                  className={inputClass(undefined)}
                  placeholder="Any details you want us to know"
                />
                <p className="mt-1 text-xs text-muted-foreground">{step2.comments.length}/500</p>
              </div>
            </div>

            {serverError ? <p className="mt-4 text-sm text-red-600">{serverError}</p> : null}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => submitStep2(true)}
                disabled={isStep2Submitting}
                className="min-h-12 rounded-xl border border-border px-4 py-3 text-sm font-semibold"
              >
                Skip this step
              </button>
              <button
                type="button"
                onClick={() => submitStep2(false)}
                disabled={isStep2Submitting}
                className="min-h-12 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white disabled:opacity-60"
              >
                {isStep2Submitting ? 'Submitting...' : 'Finish Application'}
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900">
            <h2 className="text-xl font-bold">Thanks! Your application was received.</h2>
            <p className="mt-2 text-sm">
              Our recruiting team will contact you soon. If you want a faster response, message us on WhatsApp.
            </p>
          </section>
        )}
      </div>

      <a
        href="https://wa.me/13262207171"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 z-[2100] inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  );
}
