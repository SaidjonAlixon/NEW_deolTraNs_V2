import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ArrowRight, ArrowLeft, 
  User, Truck, BadgeCheck, FileText, 
  Upload, Phone, Mail, MapPin, ChevronDown
} from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';
import {
  gtmDriverTypeFromPosition,
  gtmFormLocationFromPathname,
  pushDriverFormOpenOnce,
  pushDriverFormSubmit,
} from '../lib/gtmDataLayer';
import { cn } from '../lib/utils';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from './ui/dialog';
import { upload } from '@vercel/blob/client';

const steps = [
  { id: 1, name: 'Position', icon: Truck },
  { id: 2, name: 'Contact', icon: User },
  { id: 3, name: 'Experience', icon: BadgeCheck },
  { id: 4, name: 'Review', icon: FileText },
];

const positions = [
  {
    id: 'company-driver',
    title: 'Company Driver',
    description: 'Drive our trucks and get paid per mile with full benefits',
    icon: Truck,
    perks: ['Weekly Pay', 'Modern Fleet', 'Home Time'],
  },
  {
    id: 'owner-operator',
    title: 'Owner Operator',
    description: 'Bring your own truck and enjoy maximum earnings',
    icon: Truck,
    perks: ['High % Pay', 'Fuel Cards', 'Dispatch Support', 'Flexibility'],
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'Partner with DELO TRANS INC and grow your capital with us',
    icon: Truck,
    perks: ['Profit Share', 'Transparent Reports', 'Fleet Growth', 'Safe Returns'],
  },
];

const cdlTypes = ['Class A', 'Class B', 'No CDL'];

type ValidationErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  cdlType?: string;
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

  const [localPart, domainPart] = parts;
  if (!localPart || !domainPart) return false;

  // Require a domain extension such as .com, .net, .org, etc.
  if (!/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domainPart)) return false;

  return true;
}

function validateContactField(field: keyof ValidationErrors, value: string): string {
  const v = value.trim();

  if (field === 'firstName' || field === 'lastName') {
    if (!v) return 'This field is required';
    if (v.length < 2) return 'Minimum 2 characters required';
    if (!/^[A-Za-z]+$/.test(v)) return 'Letters only. Numbers and symbols are not allowed';
    return '';
  }

  if (field === 'email') {
    if (!v) return 'This field is required';
    if (!isValidEmail(v)) return 'Please enter a valid email address';
    return '';
  }

  if (field === 'phone') {
    const digits = v.replace(/\D/g, '');
    if (!v) return 'This field is required';
    if (digits.length !== 10) return 'Phone number must contain exactly 10 digits';
    if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(v)) return 'Use US format: (XXX) XXX-XXXX';
    return '';
  }

  if (field === 'address') {
    if (!v) return 'This field is required';
    if (v.length < 5) return 'Home address must be at least 5 characters';
    return '';
  }

  if (field === 'cdlType') {
    if (!v) return 'This field is required';
    return '';
  }

  return '';
}

function uploadLineClass(done: boolean) {
  return cn('text-sm font-medium truncate', done ? 'text-emerald-600' : 'text-muted-foreground');
}

const initialFormData = {
  position: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  cdlType: '',
  yearsExperience: '',
  ssnNumber: '',
  ssnImageFileName: '',
  licenseFileName: '',
  licenseFrontFileName: '',
  licenseBackFileName: '',
  medicalCardFileName: '',
  registrationCardFileName: '',
  annualInspectionFileName: '',
  truckEngineFileName: '',
  truckUnderEngineFileName: '',
  truckTiresFileName: '',
  resumeFileName: '',
  termsAccepted: false,
};

export type DriverApplicationModalProps = {
  /** Legacy: render form inline without dialog (unused; global modal is default). */
  embedded?: boolean;
};

export default function DriverApplicationModal({ embedded = false }: DriverApplicationModalProps) {
  const { isOpen, openSessionId, closeDriverModal } = useDriverApplication();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const formLocation = gtmFormLocationFromPathname(pathname);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (embedded) return;
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setDirection(0);
        setFormData({ ...initialFormData });
        setErrors({});
      }, 300);
    }
  }, [isOpen, embedded]);

  useEffect(() => {
    if (embedded) return;
    if (!isOpen || openSessionId < 1) return;
    pushDriverFormOpenOnce(openSessionId, formLocation);
  }, [isOpen, openSessionId, formLocation, embedded]);

  useEffect(() => {
    if (!embedded) return;
    pushDriverFormOpenOnce(1_000_000, formLocation);
  }, [embedded, formLocation]);

  const canProceedStep2 = () => {
    const firstNameError = validateContactField('firstName', formData.firstName || '');
    const lastNameError = validateContactField('lastName', formData.lastName || '');
    const emailError = validateContactField('email', formData.email || '');
    const phoneError = validateContactField('phone', formData.phone || '');
    const addressError = validateContactField('address', formData.address || '');

    return !firstNameError && !lastNameError && !emailError && !phoneError && !addressError;
  };

  const isUploaded = (val: string | undefined) => !!(val && typeof val === 'string' && val.startsWith('http'));

  const canProceedStep3 = () => {
    if (formData.position === 'company-driver') {
      return !validateContactField('cdlType', formData.cdlType || '') &&
        isUploaded(formData.licenseFrontFileName) &&
        isUploaded(formData.licenseBackFileName) &&
        isUploaded(formData.medicalCardFileName);
    }
    if (formData.position === 'owner-operator') {
      return isUploaded(formData.licenseFrontFileName) &&
        isUploaded(formData.licenseBackFileName) &&
        isUploaded(formData.medicalCardFileName) &&
        isUploaded(formData.annualInspectionFileName) &&
        isUploaded(formData.truckEngineFileName) &&
        isUploaded(formData.truckUnderEngineFileName) &&
        isUploaded(formData.truckTiresFileName);
    }
    if (formData.position === 'investor') {
      return isUploaded(formData.registrationCardFileName) &&
        isUploaded(formData.annualInspectionFileName) &&
        isUploaded(formData.truckEngineFileName) &&
        isUploaded(formData.truckUnderEngineFileName) &&
        isUploaded(formData.truckTiresFileName);
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      const nextErrors: ValidationErrors = {
        ...errors,
        firstName: validateContactField('firstName', formData.firstName || ''),
        lastName: validateContactField('lastName', formData.lastName || ''),
        email: validateContactField('email', formData.email || ''),
        phone: validateContactField('phone', formData.phone || ''),
        address: validateContactField('address', formData.address || ''),
      };
      setErrors(nextErrors);
      if (!canProceedStep2()) return;
    }

    if (currentStep === 3) {
      const nextErrors: ValidationErrors = {
        ...errors,
        cdlType:
          formData.position === 'company-driver'
            ? validateContactField('cdlType', formData.cdlType || '')
            : '',
      };
      setErrors(nextErrors);
      if (!canProceedStep3()) return;
    }

    if (currentStep < steps.length) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const positionTitle =
        positions.find((p) => p.id === formData.position)?.title || formData.position;
      const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

      const docLabels: Record<string, string> = {
        ssnImageFileName: 'SSN (Image copy)',
        licenseFrontFileName: 'Driver License (Front)',
        licenseBackFileName: 'Driver License (Back)',
        medicalCardFileName: 'Medical Card',
        registrationCardFileName: 'Registration Card (CAP Card)',
        annualInspectionFileName: 'Annual Truck Inspection',
        truckEngineFileName: 'Truck Photo (Engine)',
        truckUnderEngineFileName: 'Truck Photo (Under Engine)',
        truckTiresFileName: 'Truck Photo (Tires)',
        resumeFileName: 'Resume / Document',
      };

      const documentFields = [
        'ssnImageFileName',
        'licenseFrontFileName',
        'licenseBackFileName',
        'medicalCardFileName',
        'registrationCardFileName',
        'annualInspectionFileName',
        'truckEngineFileName',
        'truckUnderEngineFileName',
        'truckTiresFileName',
        'resumeFileName',
      ] as const;

      const documents: { label: string; url: string }[] = [];
      for (const field of documentFields) {
        const url = formData[field];
        if (url && typeof url === 'string' && url.startsWith('http')) {
          documents.push({ label: docLabels[field] || field, url });
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s client timeout

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: positionTitle || formData.position,
          name: fullName || 'Unknown',
          phone: formData.phone || '',
          email: formData.email || '',
          address: formData.address || '',
          experience: formData.yearsExperience ? `${formData.yearsExperience} years` : '',
          cdlType: formData.cdlType || '',
          ssn: formData.ssnNumber || '',
          documents,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      let data: { success?: boolean; message?: string };
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(res.ok ? 'Invalid response' : `Server error (${res.status}). Please try again.`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data?.message || `Server error (${res.status})`);
      }

      pushDriverFormSubmit(formLocation, gtmDriverTypeFromPosition(formData.position));
      if (embedded) {
        navigate('/');
      } else {
        closeDriverModal();
      }
    } catch (error) {
      console.error('Failed to submit driver application', error);
      alert('Application could not be sent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      const normalizedValue = name === 'phone' ? formatUSPhone(value) : value;
      setFormData(prev => ({ ...prev, [name]: normalizedValue }));

      const fieldMap: Record<string, keyof ValidationErrors> = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        phone: 'phone',
        address: 'address',
        cdlType: 'cdlType',
      };

      const fieldKey = fieldMap[name];
      if (fieldKey) {
        setErrors(prev => ({
          ...prev,
          [fieldKey]: validateContactField(fieldKey, normalizedValue),
        }));
      }
    }
  };

  const handleFileUpload = async (
    file: File,
    field:
      | 'licenseFileName'
      | 'resumeFileName'
      | 'ssnImageFileName'
      | 'licenseFrontFileName'
      | 'licenseBackFileName'
      | 'medicalCardFileName'
      | 'registrationCardFileName'
      | 'annualInspectionFileName'
      | 'truckEngineFileName'
      | 'truckUnderEngineFileName'
      | 'truckTiresFileName'
  ) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`File "${file.name}" is larger than 10MB`);
      return;
    }

    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/blob-upload',
    });

    setFormData(prev => ({ ...prev, [field]: blob.url }));
  };

  const handleFileChange = (
    field:
      | 'licenseFileName'
      | 'resumeFileName'
      | 'ssnImageFileName'
      | 'licenseFrontFileName'
      | 'licenseBackFileName'
      | 'medicalCardFileName'
      | 'registrationCardFileName'
      | 'annualInspectionFileName'
      | 'truckEngineFileName'
      | 'truckUnderEngineFileName'
      | 'truckTiresFileName'
  ) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file, field);
    }
  };

  const handleResumeDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file, 'resumeFileName');
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 60 : -60, opacity: 0 }),
  };

  const modalCardClassName = cn(
    'driver-app-modal relative rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.4)] flex flex-col border border-border/70 text-foreground',
    embedded ? 'max-h-[min(92vh,900px)] bg-[#1a1d23]' : 'max-h-[92vh] bg-card'
  );

  const modalBody = (
          <div className={modalCardClassName}>
            
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600/20 via-transparent to-blue-600/15 z-0 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-3xl bg-card z-0" />

            {/* Content */}
            <div className="relative z-10 flex flex-col max-h-[92vh]">
              
              {/* Header */}
              <div className="relative px-7 pt-7 pb-6">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-600/10 blur-3xl pointer-events-none" />
                
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-3 py-1 mb-3">
                      <Truck className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-red-400">DELO TRANS INC</span>
                    </div>
                    <h2 className="text-2xl font-heading font-extrabold text-foreground leading-tight">
                      Driver Application
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Step {currentStep} of {steps.length} — {steps[currentStep-1].name}
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => (embedded ? navigate('/') : closeDriverModal())}
                    className="shrink-0 w-9 h-9 rounded-full bg-muted/60 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all mt-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-1">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isDone = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    return (
                      <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center gap-1.5">
                          <div className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 border",
                            isDone ? "bg-red-600 border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.5)]" :
                            isActive ? "bg-muted border-primary/45 shadow-[0_0_12px_hsl(var(--primary)/0.2)] scale-110" :
                            "bg-muted/40 border-border"
                          )}>
                            {isDone ? <Check className="w-4 h-4 text-white" /> : <StepIcon className={cn("w-4 h-4", isActive ? "text-foreground" : "text-muted-foreground")} />}
                          </div>
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-foreground" : isDone ? "text-red-500" : "text-muted-foreground")}>
                            {step.name}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={cn("flex-1 h-0.5 mb-4 transition-all duration-500", currentStep > step.id ? "bg-red-600" : "bg-border")} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-6" />

              {/* Form Area */}
              <div className="flex-grow overflow-y-auto px-7 py-6" style={{scrollbarWidth: 'none'}}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    {/* STEP 1: Position */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-5">
                          Choose the position that best matches your situation. We welcome all experience levels.
                        </p>
                        {positions.map(pos => (
                          <button
                            key={pos.id}
                            onClick={() => setFormData(prev => ({ ...prev, position: pos.id }))}
                            className={cn(
                              "w-full text-left p-5 rounded-2xl border transition-all duration-300 group",
                              formData.position === pos.id
                                ? "bg-red-600/10 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
                                : "bg-muted/20 border-border hover:border-primary/30 hover:bg-muted/45"
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    formData.position === pos.id ? "bg-red-600" : "bg-muted"
                                  )}>
                                    <Truck className={cn("w-4 h-4", formData.position === pos.id ? "text-white" : "text-foreground")} />
                                  </div>
                                  <span className="font-bold text-foreground">{pos.title}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{pos.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {pos.perks.map(perk => (
                                    <span key={perk} className={cn(
                                      "text-xs px-2.5 py-1 rounded-full border",
                                      formData.position === pos.id 
                                        ? "bg-red-600/10 border-red-600/30 text-red-600"
                                        : "bg-muted/40 border-border text-muted-foreground"
                                    )}>
                                      {perk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all",
                                formData.position === pos.id ? "border-red-600 bg-red-600" : "border-border"
                              )}>
                                {formData.position === pos.id && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* STEP 2: Contact */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">First Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John"
                                className={cn(
                                  "w-full bg-muted/50 border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/55 focus:bg-muted/75 transition-all placeholder:text-muted-foreground/80",
                                  errors.firstName ? "border-red-500" : "border-input"
                                )}
                              />
                            </div>
                            {errors.firstName ? <p className="text-xs text-red-500">{errors.firstName}</p> : null}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Doe"
                                className={cn(
                                  "w-full bg-muted/50 border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/55 focus:bg-muted/75 transition-all placeholder:text-muted-foreground/80",
                                  errors.lastName ? "border-red-500" : "border-input"
                                )}
                              />
                            </div>
                            {errors.lastName ? <p className="text-xs text-red-500">{errors.lastName}</p> : null}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className={cn(
                                "w-full bg-muted/50 border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/55 transition-all placeholder:text-muted-foreground/80",
                                errors.email ? "border-red-500" : "border-input"
                              )}
                            />
                          </div>
                          {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="(555) 000-0000"
                              className={cn(
                                "w-full bg-muted/50 border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/55 transition-all placeholder:text-muted-foreground/80",
                                errors.phone ? "border-red-500" : "border-input"
                              )}
                            />
                          </div>
                          {errors.phone ? <p className="text-xs text-red-500">{errors.phone}</p> : null}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Home Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="City, State, ZIP"
                              className={cn(
                                "w-full bg-muted/50 border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/55 transition-all placeholder:text-muted-foreground/80",
                                errors.address ? "border-red-500" : "border-input"
                              )}
                            />
                          </div>
                          {errors.address ? <p className="text-xs text-red-500">{errors.address}</p> : null}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Experience / Documents */}
                    {currentStep === 3 && (
                      formData.position === 'company-driver' ? (
                      <div className="space-y-5">
                        {/* CDL type */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Choose your CDL type</label>
                          <div className="relative">
                            <select
                              name="cdlType"
                              value={formData.cdlType}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full bg-muted/50 border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/55 transition-all appearance-none cursor-pointer",
                                errors.cdlType ? "border-red-500" : "border-input"
                              )}
                            >
                              <option value="" disabled className="bg-app">Select CDL Type...</option>
                              {cdlTypes.map(type => (
                                <option key={type} value={type} className="bg-app">{type}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          </div>
                          {errors.cdlType ? <p className="text-xs text-red-500">{errors.cdlType}</p> : null}
                        </div>

                        {/* Years experience (numeric) */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Years of commercial driving experience?</label>
                          <input
                            name="yearsExperience"
                            value={formData.yearsExperience}
                            onChange={handleInputChange}
                            type="number"
                            min={0}
                            className="w-full bg-muted/50 border border-input rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/55 transition-all placeholder:text-muted-foreground/80"
                          />
                        </div>

                        {/* Driver License (both sides) */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Driver License (Both Sides)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label
                              className={cn(
                                "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                formData.licenseFrontFileName
                                  ? "border-green-500/50 bg-green-600/5"
                                  : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange('licenseFrontFileName')}
                              />
                              <div className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                formData.licenseFrontFileName ? "bg-green-600" : "bg-muted"
                              )}>
                                {formData.licenseFrontFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-xs font-medium", formData.licenseFrontFileName ? "text-green-500" : "text-muted-foreground")}>
                                  {formData.licenseFrontFileName ? "Uploaded" : "Front side"}
                                </p>
                                <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG</p>
                              </div>
                            </label>

                            <label
                              className={cn(
                                "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                formData.licenseBackFileName
                                  ? "border-green-500/50 bg-green-600/5"
                                  : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange('licenseBackFileName')}
                              />
                              <div className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                formData.licenseBackFileName ? "bg-green-600" : "bg-muted"
                              )}>
                                {formData.licenseBackFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-xs font-medium", formData.licenseBackFileName ? "text-green-500" : "text-muted-foreground")}>
                                  {formData.licenseBackFileName ? "Uploaded" : "Back side"}
                                </p>
                                <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG</p>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Medical Card */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medical Card</label>
                          <label
                            className={cn(
                              "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                              formData.medicalCardFileName
                                ? "border-green-500/50 bg-green-600/5"
                                : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                            )}
                          >
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange('medicalCardFileName')}
                            />
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              formData.medicalCardFileName ? "bg-green-600" : "bg-muted"
                            )}>
                              {formData.medicalCardFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                            </div>
                            <div className="text-left">
                              <p className={cn("text-sm font-medium", formData.medicalCardFileName ? "text-green-500" : "text-muted-foreground")}>
                                {formData.medicalCardFileName ? "Uploaded" : "Choose file"}
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                            </div>
                          </label>
                        </div>

                        {/* Resume Upload (optional) with drag & drop */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume / Document <span className="text-muted-foreground normal-case">(optional)</span></label>
                          <div
                            onClick={() => resumeInputRef.current?.click()}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={handleResumeDrop}
                            className={cn(
                              "w-full py-6 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                              formData.resumeFileName 
                                ? "border-green-500/50 bg-green-600/5" 
                                : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              formData.resumeFileName ? "bg-green-600" : "bg-muted"
                            )}>
                              {formData.resumeFileName ? <Check className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-muted-foreground" />}
                            </div>
                            <div className="text-left">
                              <p className={cn("text-sm font-medium", formData.resumeFileName ? "text-green-500" : "text-muted-foreground")}>
                                {formData.resumeFileName ? "Uploaded" : "Attach resume (optional)"}
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB — click, or drag and drop here</p>
                            </div>
                          </div>
                          <input ref={resumeInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange('resumeFileName')} />
                        </div>
                      </div>
                      ) : formData.position === 'owner-operator' ? (
                        <div className="space-y-5">
                          {/* Owner Operator – Documents & Truck */}
                          {/* Driver License (Both Sides) */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Driver License (Both Sides)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                  formData.licenseFrontFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileChange('licenseFrontFileName')}
                                />
                                <div className={cn(
                                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                  formData.licenseFrontFileName ? "bg-green-600" : "bg-muted"
                                )}>
                                  {formData.licenseFrontFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                                </div>
                                <div className="text-left">
                                  <p className={cn("text-xs font-medium", formData.licenseFrontFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.licenseFrontFileName ? "Uploaded" : "Front side"}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG</p>
                                </div>
                              </label>

                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                  formData.licenseBackFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileChange('licenseBackFileName')}
                                />
                                <div className={cn(
                                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                  formData.licenseBackFileName ? "bg-green-600" : "bg-muted"
                                )}>
                                  {formData.licenseBackFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                                </div>
                                <div className="text-left">
                                  <p className={cn("text-xs font-medium", formData.licenseBackFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.licenseBackFileName ? "Uploaded" : "Back side"}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Medical Card */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medical Card</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.medicalCardFileName
                                  ? "border-green-500/50 bg-green-600/5"
                                  : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange('medicalCardFileName')}
                              />
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                formData.medicalCardFileName ? "bg-green-600" : "bg-muted"
                              )}>
                                {formData.medicalCardFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.medicalCardFileName ? "text-green-500" : "text-muted-foreground")}>
                                  {formData.medicalCardFileName ? "Uploaded" : "Choose file"}
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Annual truck inspection */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Annual truck inspection</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.annualInspectionFileName
                                  ? "border-green-500/50 bg-green-600/5"
                                  : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange('annualInspectionFileName')}
                              />
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                formData.annualInspectionFileName ? "bg-green-600" : "bg-muted"
                              )}>
                                {formData.annualInspectionFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.annualInspectionFileName ? "text-emerald-600" : "text-muted-foreground")}>
                                  {formData.annualInspectionFileName ? "Uploaded" : "Choose file"}
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Truck pictures */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Please upload truck pictures <span className="normal-case text-muted-foreground">(engine, under engine, tires)</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckEngineFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckEngineFileName ? "bg-green-600" : "bg-muted"
                                  )}>
                                    {formData.truckEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckEngineFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.truckEngineFileName ? "Uploaded" : "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Under engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckUnderEngineFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Under engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckUnderEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckUnderEngineFileName ? "bg-green-600" : "bg-muted"
                                  )}>
                                    {formData.truckUnderEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckUnderEngineFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.truckUnderEngineFileName ? "Uploaded" : "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Tires */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckTiresFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tires</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckTiresFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckTiresFileName ? "bg-green-600" : "bg-muted"
                                  )}>
                                    {formData.truckTiresFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckTiresFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.truckTiresFileName ? "Uploaded" : "Choose file"}
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Simple optional resume for Owner Operator with drag & drop */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume / Work History <span className="text-muted-foreground normal-case">(optional)</span></label>
                            <div
                              onClick={() => resumeInputRef.current?.click()}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onDrop={handleResumeDrop}
                              className={cn(
                                "w-full py-6 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.resumeFileName 
                                  ? "border-red-500/50 bg-red-600/5" 
                                  : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                              )}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                formData.resumeFileName ? "bg-red-600" : "bg-muted"
                              )}>
                                {formData.resumeFileName ? <Check className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.resumeFileName ? "text-emerald-600" : "text-muted-foreground")}>
                                  {formData.resumeFileName || "Attach resume (optional)"}
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB — click, or drag and drop here</p>
                              </div>
                            </div>
                            <input ref={resumeInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange('resumeFileName')} />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {/* Investor – Documents & Truck */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration Card (CAP Card)</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.registrationCardFileName
                                  ? "border-green-500/50 bg-green-600/5"
                                  : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange('registrationCardFileName')}
                              />
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                formData.registrationCardFileName ? "bg-green-600" : "bg-muted"
                              )}>
                                {formData.registrationCardFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.registrationCardFileName ? "text-emerald-600" : "text-muted-foreground")}>
                                  {formData.registrationCardFileName ? "Uploaded" : "Choose file"}
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Annual truck inspection */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Annual truck inspection</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.annualInspectionFileName
                                  ? "border-green-500/50 bg-green-600/5"
                                  : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange('annualInspectionFileName')}
                              />
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                formData.annualInspectionFileName ? "bg-green-600" : "bg-muted"
                              )}>
                                {formData.annualInspectionFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.annualInspectionFileName ? "text-green-500" : "text-muted-foreground")}>
                                  {formData.annualInspectionFileName ? "Uploaded" : "Choose file"}
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Truck pictures – engine / under engine / tires */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Please upload truck pictures <span className="normal-case text-muted-foreground">(engine, under engine, tires)</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckEngineFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckEngineFileName ? "bg-green-600" : "bg-muted"
                                  )}>
                                    {formData.truckEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckEngineFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.truckEngineFileName ? "Uploaded" : "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Under engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckUnderEngineFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Under engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckUnderEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckUnderEngineFileName ? "bg-green-600" : "bg-muted"
                                  )}>
                                    {formData.truckUnderEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckUnderEngineFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.truckUnderEngineFileName ? "Uploaded" : "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Tires */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckTiresFileName
                                    ? "border-green-500/50 bg-green-600/5"
                                    : "border-border bg-muted/25 hover:border-primary/35 hover:bg-muted/40"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tires</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckTiresFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckTiresFileName ? "bg-green-600" : "bg-muted"
                                  )}>
                                    {formData.truckTiresFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckTiresFileName ? "text-green-500" : "text-muted-foreground")}>
                                    {formData.truckTiresFileName ? "Uploaded" : "Choose file"}
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {/* STEP 4: Review */}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <div className="relative p-5 rounded-2xl bg-muted/35 border border-border overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-2xl pointer-events-none" />
                          <div className="relative space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Applied For</p>
                              <span className={cn(
                                "text-xs font-bold px-3 py-1 rounded-full",
                                "bg-red-600/10 border border-red-600/30 text-red-600 uppercase"
                              )}>
                                {positions.find(p => p.id === formData.position)?.title || '—'}
                              </span>
                            </div>

                            <div className="h-px bg-border" />

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Name</p>
                                <p className="text-foreground font-medium text-sm">{formData.firstName} {formData.lastName}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Location</p>
                                <p className="text-foreground font-medium text-sm">{formData.address || '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Email</p>
                                <p className="text-foreground font-medium text-sm">{formData.email}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Phone</p>
                                <p className="text-foreground font-medium text-sm">{formData.phone}</p>
                              </div>
                            </div>

                            <div className="h-px bg-border" />

                            {/* Position-specific summary */}
                            {formData.position === 'company-driver' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">CDL Type</p>
                                  <p className="text-foreground font-medium text-sm">{formData.cdlType || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Experience (years)</p>
                                  <p className="text-foreground font-medium text-sm">{formData.yearsExperience || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">License – Front</p>
                                  <p className={uploadLineClass(!!formData.licenseFrontFileName)}>
                                    {formData.licenseFrontFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">License – Back</p>
                                  <p className={uploadLineClass(!!formData.licenseBackFileName)}>
                                    {formData.licenseBackFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Medical Card</p>
                                  <p className={uploadLineClass(!!formData.medicalCardFileName)}>
                                    {formData.medicalCardFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Resume / Document</p>
                                  <p className={uploadLineClass(!!formData.resumeFileName)}>
                                    {formData.resumeFileName || 'Not attached'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {formData.position === 'owner-operator' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">License – Front</p>
                                  <p className={uploadLineClass(!!formData.licenseFrontFileName)}>
                                    {formData.licenseFrontFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">License – Back</p>
                                  <p className={uploadLineClass(!!formData.licenseBackFileName)}>
                                    {formData.licenseBackFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Medical Card</p>
                                  <p className={uploadLineClass(!!formData.medicalCardFileName)}>
                                    {formData.medicalCardFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Annual Truck Inspection</p>
                                  <p className={uploadLineClass(!!formData.annualInspectionFileName)}>
                                    {formData.annualInspectionFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Truck Photo – Engine</p>
                                  <p className={uploadLineClass(!!formData.truckEngineFileName)}>
                                    {formData.truckEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Truck Photo – Under Engine</p>
                                  <p className={uploadLineClass(!!formData.truckUnderEngineFileName)}>
                                    {formData.truckUnderEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Truck Photo – Tires</p>
                                  <p className={uploadLineClass(!!formData.truckTiresFileName)}>
                                    {formData.truckTiresFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Resume / Work History</p>
                                  <p className={uploadLineClass(!!formData.resumeFileName)}>
                                    {formData.resumeFileName || 'Not attached'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {formData.position === 'investor' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Registration Card (CAP)</p>
                                  <p className={uploadLineClass(!!formData.registrationCardFileName)}>
                                    {formData.registrationCardFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Annual Truck Inspection</p>
                                  <p className={uploadLineClass(!!formData.annualInspectionFileName)}>
                                    {formData.annualInspectionFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Truck Photo – Engine</p>
                                  <p className={uploadLineClass(!!formData.truckEngineFileName)}>
                                    {formData.truckEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Truck Photo – Under Engine</p>
                                  <p className={uploadLineClass(!!formData.truckUnderEngineFileName)}>
                                    {formData.truckUnderEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Truck Photo – Tires</p>
                                  <p className={uploadLineClass(!!formData.truckTiresFileName)}>
                                    {formData.truckTiresFileName || 'Not uploaded'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div
                            onClick={() => setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }))}
                            className={cn(
                              "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                              formData.termsAccepted ? "bg-red-600 border-red-600" : "border-border group-hover:border-primary/40"
                            )}
                          >
                            {formData.termsAccepted && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <p className="text-sm text-muted-foreground leading-snug">
                            I confirm that the information provided is accurate and I agree to DELO TRANS INC's 
                            <span className="text-red-600 hover:text-red-500 cursor-pointer"> terms & conditions</span>.
                          </p>
                        </label>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-7 py-5 border-t border-border flex items-center justify-between bg-muted/50">
                <button
                  onClick={handleBack}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                    currentStep === 1 ? "opacity-0 pointer-events-none" : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-medium">{currentStep} / {steps.length}</span>
                  <button
                    onClick={currentStep === steps.length ? handleSubmit : handleNext}
                    disabled={
                      (currentStep === 1 && !formData.position) ||
                      (currentStep === 2 && !canProceedStep2()) ||
                      (currentStep === 3 && !canProceedStep3()) ||
                      (currentStep === 4 && !formData.termsAccepted) ||
                      isSubmitting
                    }
                    className={cn(
                      "flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-extrabold transition-all duration-300",
                      "bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.55)]",
                      "disabled:opacity-40 disabled:pointer-events-none"
                    )}
                  >
                    {currentStep === steps.length ? (isSubmitting ? 'Sending…' : 'Submit Application') : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
  );

  if (embedded) {
    return <div className="mx-auto w-full max-w-xl">{modalBody}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDriverModal()}>
      <DialogPortal>
        <DialogOverlay className="z-[2000] bg-black/55 backdrop-blur-md" />
        <DialogContent
          showCloseButton={false}
          className="z-[2010] max-w-xl w-full overflow-hidden border-none bg-transparent p-0 shadow-none"
        >
          {modalBody}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
