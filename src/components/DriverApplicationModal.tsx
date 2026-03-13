import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ArrowRight, ArrowLeft, 
  User, Truck, BadgeCheck, FileText, 
  Upload, Phone, Mail, MapPin, ChevronDown
} from 'lucide-react';
import { useDriverApplication } from '../context/DriverApplicationContext';
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
    perks: ['Medical & Dental', 'Weekly Pay', 'Modern Fleet', 'Home Time'],
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

const cdlTypes = ['Class A CDL', 'Class B CDL', 'No CDL (Applying for Training)'];

export default function DriverApplicationModal() {
  const { isOpen, closeDriverModal } = useDriverApplication();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFileLabel = (value: string) => {
    if (!value) return '';
    if (!value.startsWith('http')) return value;
    try {
      const url = new URL(value);
      const parts = url.pathname.split('/');
      return parts[parts.length - 1] || value;
    } catch {
      return value;
    }
  };

  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setDirection(0);
      }, 300);
    }
  }, [isOpen]);

  const handleNext = () => {
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

      const lines: string[] = [
        '🚀 New Driver Application',
        '',
        `Position: ${positionTitle || '-'}`,
        `Name: ${fullName || '-'}`,
        `Phone: ${formData.phone || '-'}`,
        `Email: ${formData.email || '-'}`,
        `Address: ${formData.address || '-'}`,
        `Experience: ${formData.yearsExperience ? `${formData.yearsExperience} years` : '-'}`,
        `CDL Type: ${formData.cdlType || '-'}`,
        formData.ssnNumber ? `SSN / EID: ${formData.ssnNumber}` : null,
      ].filter(Boolean) as string[];

      lines.push('');
      lines.push(`Documents: 📎 ${documents.length} file(s)`);
      for (const d of documents) {
        lines.push(`📎 ${d.label}: ${d.url}`);
      }

      const fullText = lines.join('\n');

      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName || 'Unknown',
          phone: formData.phone || '',
          fullText,
        }),
      });

      closeDriverModal();
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
      setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDriverModal()}>
      <DialogPortal>
        {/* Backdrop */}
        <DialogOverlay className="z-[2000] bg-black/70 backdrop-blur-md" />
        
        <DialogContent 
          showCloseButton={false}
          className="z-[2010] max-w-xl w-full p-0 border-none bg-transparent shadow-none overflow-hidden"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] flex flex-col max-h-[92vh]">
            
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600/30 via-transparent to-blue-600/30 z-0 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-3xl bg-[#0c1628] z-0" />

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
                    <h2 className="text-2xl font-heading font-extrabold text-white leading-tight">
                      Driver Application
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Step {currentStep} of {steps.length} — {steps[currentStep-1].name}
                    </p>
                  </div>
                  <button 
                    onClick={closeDriverModal}
                    className="shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all mt-1"
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
                            isActive ? "bg-white/10 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.15)] scale-110" :
                            "bg-white/5 border-white/10"
                          )}>
                            {isDone ? <Check className="w-4 h-4 text-white" /> : <StepIcon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-600")} />}
                          </div>
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-white" : isDone ? "text-red-400" : "text-gray-600")}>
                            {step.name}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={cn("flex-1 h-0.5 mb-4 transition-all duration-500", currentStep > step.id ? "bg-red-600" : "bg-white/10")} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />

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
                        <p className="text-sm text-gray-400 mb-5">
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
                                : "bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/5"
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    formData.position === pos.id ? "bg-red-600" : "bg-white/10"
                                  )}>
                                    <Truck className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="font-bold text-white">{pos.title}</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">{pos.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {pos.perks.map(perk => (
                                    <span key={perk} className={cn(
                                      "text-xs px-2.5 py-1 rounded-full border",
                                      formData.position === pos.id 
                                        ? "bg-red-600/10 border-red-600/30 text-red-300"
                                        : "bg-white/5 border-white/10 text-gray-400"
                                    )}>
                                      {perk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all",
                                formData.position === pos.id ? "border-red-600 bg-red-600" : "border-white/20"
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
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John"
                                className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/7 transition-all placeholder:text-gray-600"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Doe"
                                className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/7 transition-all placeholder:text-gray-600"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+1 (555) 000-0000"
                              className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Home Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="City, State, ZIP"
                              className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Experience / Documents */}
                    {currentStep === 3 && (
                      formData.position === 'company-driver' ? (
                      <div className="space-y-5">
                        {/* CDL type */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Choose your CDL type</label>
                          <div className="relative">
                            <select
                              name="cdlType"
                              value={formData.cdlType}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
                            >
                              <option value="" disabled className="bg-navy-900">Select CDL Type...</option>
                              {cdlTypes.map(type => (
                                <option key={type} value={type} className="bg-navy-900">{type}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>

                        {/* SSN / EID */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your SSN or EID number</label>
                          <input
                            name="ssnNumber"
                            value={formData.ssnNumber}
                            onChange={handleInputChange}
                            placeholder="Your SSN or EID number"
                            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600"
                          />
                        </div>

                        {/* SSN image copy */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SSN (Image copy)</label>
                          <label
                            className={cn(
                              "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                              formData.ssnImageFileName
                                ? "border-red-500/50 bg-red-600/5"
                                : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                            )}
                          >
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange('ssnImageFileName')}
                            />
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              formData.ssnImageFileName ? "bg-red-600" : "bg-white/10"
                            )}>
                              {formData.ssnImageFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div className="text-left">
                              <p className={cn("text-sm font-medium", formData.ssnImageFileName ? "text-white" : "text-gray-400")}>
                                {formData.ssnImageFileName ? getFileLabel(formData.ssnImageFileName) : "Choose file"}
                              </p>
                              <p className="text-xs text-gray-600">PDF, JPG, PNG up to 10MB</p>
                            </div>
                          </label>
                        </div>

                        {/* Years experience (numeric) */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Years of commercial driving experience?</label>
                          <input
                            name="yearsExperience"
                            value={formData.yearsExperience}
                            onChange={handleInputChange}
                            type="number"
                            min={0}
                            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600"
                          />
                        </div>

                        {/* Driver License (both sides) */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver License (Both Sides)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label
                              className={cn(
                                "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                formData.licenseFrontFileName
                                  ? "border-red-500/50 bg-red-600/5"
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                formData.licenseFrontFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.licenseFrontFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-xs font-medium", formData.licenseFrontFileName ? "text-white" : "text-gray-400")}>
                                  {formData.licenseFrontFileName ? getFileLabel(formData.licenseFrontFileName) : "Front side"}
                                </p>
                                <p className="text-[11px] text-gray-600">PDF, JPG, PNG</p>
                              </div>
                            </label>

                            <label
                              className={cn(
                                "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                formData.licenseBackFileName
                                  ? "border-red-500/50 bg-red-600/5"
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                formData.licenseBackFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.licenseBackFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-xs font-medium", formData.licenseBackFileName ? "text-white" : "text-gray-400")}>
                                  {formData.licenseBackFileName ? getFileLabel(formData.licenseBackFileName) : "Back side"}
                                </p>
                                <p className="text-[11px] text-gray-600">PDF, JPG, PNG</p>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Medical Card */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Medical Card</label>
                          <label
                            className={cn(
                              "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                              formData.medicalCardFileName
                                ? "border-red-500/50 bg-red-600/5"
                                : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                              formData.medicalCardFileName ? "bg-red-600" : "bg-white/10"
                            )}>
                              {formData.medicalCardFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div className="text-left">
                              <p className={cn("text-sm font-medium", formData.medicalCardFileName ? "text-white" : "text-gray-400")}>
                                {formData.medicalCardFileName ? getFileLabel(formData.medicalCardFileName) : "Choose file"}
                              </p>
                              <p className="text-xs text-gray-600">PDF, JPG, PNG up to 10MB</p>
                            </div>
                          </label>
                        </div>

                        {/* Resume Upload (optional) with drag & drop */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume / Document <span className="text-gray-600 normal-case">(optional)</span></label>
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
                                : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              formData.resumeFileName ? "bg-red-600" : "bg-white/10"
                            )}>
                              {formData.resumeFileName ? <Check className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div className="text-left">
                              <p className={cn("text-sm font-medium", formData.resumeFileName ? "text-white" : "text-gray-400")}>
                                {formData.resumeFileName ? getFileLabel(formData.resumeFileName) : "Attach resume (optional)"}
                              </p>
                              <p className="text-xs text-gray-600">PDF, DOCX up to 10MB — click, or drag and drop here</p>
                            </div>
                          </div>
                          <input ref={resumeInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange('resumeFileName')} />
                        </div>
                      </div>
                      ) : formData.position === 'owner-operator' ? (
                        <div className="space-y-5">
                          {/* Owner Operator – Documents & Truck */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your SSN or EID number</label>
                            <input
                              name="ssnNumber"
                              value={formData.ssnNumber}
                              onChange={handleInputChange}
                              placeholder="Your SSN or EID number"
                              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600"
                            />
                          </div>

                          {/* SSN image copy */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SSN (Image copy)</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.ssnImageFileName
                                  ? "border-red-500/50 bg-red-600/5"
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange('ssnImageFileName')}
                              />
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                formData.ssnImageFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.ssnImageFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.ssnImageFileName ? "text-white" : "text-gray-400")}>
                                  {formData.ssnImageFileName || "Choose file"}
                                </p>
                                <p className="text-xs text-gray-600">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Driver License (Both Sides) */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver License (Both Sides)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                  formData.licenseFrontFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                  formData.licenseFrontFileName ? "bg-red-600" : "bg-white/10"
                                )}>
                                  {formData.licenseFrontFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                                </div>
                                <div className="text-left">
                                  <p className={cn("text-xs font-medium", formData.licenseFrontFileName ? "text-white" : "text-gray-400")}>
                                    {formData.licenseFrontFileName || "Front side"}
                                  </p>
                                  <p className="text-[11px] text-gray-600">PDF, JPG, PNG</p>
                                </div>
                              </label>

                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-3 cursor-pointer",
                                  formData.licenseBackFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                  formData.licenseBackFileName ? "bg-red-600" : "bg-white/10"
                                )}>
                                  {formData.licenseBackFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                                </div>
                                <div className="text-left">
                                  <p className={cn("text-xs font-medium", formData.licenseBackFileName ? "text-white" : "text-gray-400")}>
                                    {formData.licenseBackFileName || "Back side"}
                                  </p>
                                  <p className="text-[11px] text-gray-600">PDF, JPG, PNG</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Medical Card */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Medical Card</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.medicalCardFileName
                                  ? "border-red-500/50 bg-red-600/5"
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                formData.medicalCardFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.medicalCardFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.medicalCardFileName ? "text-white" : "text-gray-400")}>
                                  {formData.medicalCardFileName || "Choose file"}
                                </p>
                                <p className="text-xs text-gray-600">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Annual truck inspection */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Annual truck inspection</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.annualInspectionFileName
                                  ? "border-red-500/50 bg-red-600/5"
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                formData.annualInspectionFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.annualInspectionFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.annualInspectionFileName ? "text-white" : "text-gray-400")}>
                                  {formData.annualInspectionFileName ? getFileLabel(formData.annualInspectionFileName) : "Choose file"}
                                </p>
                                <p className="text-xs text-gray-600">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Truck pictures */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Please upload truck pictures <span className="normal-case text-gray-500">(engine, under engine, tires)</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckEngineFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckEngineFileName ? "bg-red-600" : "bg-white/10"
                                  )}>
                                    {formData.truckEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckEngineFileName ? "text-white" : "text-gray-400")}>
                                    {formData.truckEngineFileName ? getFileLabel(formData.truckEngineFileName) : "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Under engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckUnderEngineFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Under engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckUnderEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckUnderEngineFileName ? "bg-red-600" : "bg-white/10"
                                  )}>
                                    {formData.truckUnderEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckUnderEngineFileName ? "text-white" : "text-gray-400")}>
                                    {formData.truckUnderEngineFileName ? getFileLabel(formData.truckUnderEngineFileName) : "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Tires */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckTiresFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tires</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckTiresFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckTiresFileName ? "bg-red-600" : "bg-white/10"
                                  )}>
                                    {formData.truckTiresFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckTiresFileName ? "text-white" : "text-gray-400")}>
                                    {formData.truckTiresFileName ? getFileLabel(formData.truckTiresFileName) : "Choose file"}
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Simple optional resume for Owner Operator with drag & drop */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resume / Work History <span className="text-gray-600 normal-case">(optional)</span></label>
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
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                              )}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                formData.resumeFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.resumeFileName ? <Check className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.resumeFileName ? "text-white" : "text-gray-400")}>
                                  {formData.resumeFileName || "Attach resume (optional)"}
                                </p>
                                <p className="text-xs text-gray-600">PDF, DOCX up to 10MB — click, or drag and drop here</p>
                              </div>
                            </div>
                            <input ref={resumeInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange('resumeFileName')} />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {/* Investor – Documents & Truck */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registration Card (CAP Card)</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.registrationCardFileName
                                  ? "border-red-500/50 bg-red-600/5"
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                formData.registrationCardFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.registrationCardFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.registrationCardFileName ? "text-white" : "text-gray-400")}>
                                  {formData.registrationCardFileName ? getFileLabel(formData.registrationCardFileName) : "Choose file"}
                                </p>
                                <p className="text-xs text-gray-600">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Annual truck inspection */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Annual truck inspection</label>
                            <label
                              className={cn(
                                "w-full py-4 px-5 rounded-xl border border-dashed transition-all duration-300 flex items-center gap-4 cursor-pointer",
                                formData.annualInspectionFileName
                                  ? "border-red-500/50 bg-red-600/5"
                                  : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
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
                                formData.annualInspectionFileName ? "bg-red-600" : "bg-white/10"
                              )}>
                                {formData.annualInspectionFileName ? <Check className="w-5 h-5 text-white" /> : <Upload className="w-5 h-5 text-gray-400" />}
                              </div>
                              <div className="text-left">
                                <p className={cn("text-sm font-medium", formData.annualInspectionFileName ? "text-white" : "text-gray-400")}>
                                  {formData.annualInspectionFileName || "Choose file"}
                                </p>
                                <p className="text-xs text-gray-600">PDF, JPG, PNG up to 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Truck pictures – engine / under engine / tires */}
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Please upload truck pictures <span className="normal-case text-gray-500">(engine, under engine, tires)</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckEngineFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckEngineFileName ? "bg-red-600" : "bg-white/10"
                                  )}>
                                    {formData.truckEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckEngineFileName ? "text-white" : "text-gray-400")}>
                                    {formData.truckEngineFileName || "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Under engine */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckUnderEngineFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Under engine</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckUnderEngineFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckUnderEngineFileName ? "bg-red-600" : "bg-white/10"
                                  )}>
                                    {formData.truckUnderEngineFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckUnderEngineFileName ? "text-white" : "text-gray-400")}>
                                    {formData.truckUnderEngineFileName || "Choose file"}
                                  </p>
                                </div>
                              </label>

                              {/* Tires */}
                              <label
                                className={cn(
                                  "w-full py-3 px-4 rounded-xl border border-dashed transition-all duration-300 flex flex-col gap-1 cursor-pointer",
                                  formData.truckTiresFileName
                                    ? "border-red-500/50 bg-red-600/5"
                                    : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"
                                )}
                              >
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tires</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={handleFileChange('truckTiresFileName')}
                                />
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                    formData.truckTiresFileName ? "bg-red-600" : "bg-white/10"
                                  )}>
                                    {formData.truckTiresFileName ? <Check className="w-4 h-4 text-white" /> : <Upload className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  <p className={cn("text-xs font-medium truncate", formData.truckTiresFileName ? "text-white" : "text-gray-400")}>
                                    {formData.truckTiresFileName || "Choose file"}
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
                        <div className="relative p-5 rounded-2xl bg-white/3 border border-white/8 overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-2xl pointer-events-none" />
                          <div className="relative space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Applied For</p>
                              <span className={cn(
                                "text-xs font-bold px-3 py-1 rounded-full",
                                "bg-red-600/10 border border-red-600/30 text-red-300 uppercase"
                              )}>
                                {positions.find(p => p.id === formData.position)?.title || '—'}
                              </span>
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Name</p>
                                <p className="text-white font-medium text-sm">{formData.firstName} {formData.lastName}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Location</p>
                                <p className="text-white font-medium text-sm">{formData.address || '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Email</p>
                                <p className="text-white font-medium text-sm">{formData.email}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Phone</p>
                                <p className="text-white font-medium text-sm">{formData.phone}</p>
                              </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* Position-specific summary */}
                            {formData.position === 'company-driver' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">CDL Type</p>
                                  <p className="text-white font-medium text-sm">{formData.cdlType || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Experience (years)</p>
                                  <p className="text-white font-medium text-sm">{formData.yearsExperience || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">SSN / EID Number</p>
                                  <p className="text-white font-medium text-sm">{formData.ssnNumber || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">SSN Image</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.ssnImageFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.ssnImageFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">License – Front</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.licenseFrontFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.licenseFrontFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">License – Back</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.licenseBackFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.licenseBackFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Medical Card</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.medicalCardFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.medicalCardFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Resume / Document</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.resumeFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.resumeFileName || 'Not attached'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {formData.position === 'owner-operator' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">SSN / EID Number</p>
                                  <p className="text-white font-medium text-sm">{formData.ssnNumber || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">SSN Image</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.ssnImageFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.ssnImageFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">License – Front</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.licenseFrontFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.licenseFrontFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">License – Back</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.licenseBackFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.licenseBackFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Medical Card</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.medicalCardFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.medicalCardFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Annual Truck Inspection</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.annualInspectionFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.annualInspectionFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Truck Photo – Engine</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.truckEngineFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.truckEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Truck Photo – Under Engine</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.truckUnderEngineFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.truckUnderEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Truck Photo – Tires</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.truckTiresFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.truckTiresFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Resume / Work History</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.resumeFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.resumeFileName || 'Not attached'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {formData.position === 'investor' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Registration Card (CAP)</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.registrationCardFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.registrationCardFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Annual Truck Inspection</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.annualInspectionFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.annualInspectionFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Truck Photo – Engine</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.truckEngineFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.truckEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Truck Photo – Under Engine</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.truckUnderEngineFileName ? '#86efac' : '#6b7280' }}>
                                    {formData.truckUnderEngineFileName || 'Not uploaded'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-1">Truck Photo – Tires</p>
                                  <p className="text-sm font-medium truncate" style={{ color: formData.truckTiresFileName ? '#86efac' : '#6b7280' }}>
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
                              formData.termsAccepted ? "bg-red-600 border-red-600" : "border-white/20 group-hover:border-white/40"
                            )}
                          >
                            {formData.termsAccepted && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <p className="text-sm text-gray-400 leading-snug">
                            I confirm that the information provided is accurate and I agree to DELO TRANS INC's 
                            <span className="text-red-400 hover:text-red-300 cursor-pointer"> terms & conditions</span>.
                          </p>
                        </label>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-7 py-5 border-t border-white/5 flex items-center justify-between bg-black/20">
                <button
                  onClick={handleBack}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                    currentStep === 1 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-white/8"
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 font-medium">{currentStep} / {steps.length}</span>
                  <button
                    onClick={currentStep === steps.length ? handleSubmit : handleNext}
                    disabled={
                      (currentStep === 1 && !formData.position) ||
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
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
