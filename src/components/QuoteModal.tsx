import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ArrowLeft, Truck, Package, Globe, Ruler, Anchor, Plane } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { cn } from '../lib/utils';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from './ui/dialog';

const steps = [
  { id: 1, name: 'Contact Info' },
  { id: 2, name: 'Service Details' },
  { id: 3, name: 'Cargo Info' },
  { id: 4, name: 'Review' },
];

export default function QuoteModal() {
  const { isOpen, closeQuoteModal } = useQuote();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for next

  const [formData, setFormData] = useState({
    // Step 1: Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    // Step 2: Service
    serviceType: '',
    origin: '',
    destination: '',
    // Step 3: Cargo
    weight: '',
    dimensions: '',
    cargoDescription: '',
    specialRequirements: '',
  });

  // Reset form when closed
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectService = (type: string) => {
    setFormData(prev => ({ ...prev, serviceType: type }));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeQuoteModal()}>
      <DialogPortal>
        <DialogOverlay className="bg-app/80 backdrop-blur-sm z-[2000]" />
        <DialogContent className="max-w-2xl w-full p-0 border-none bg-transparent shadow-none z-[2010] overflow-hidden">
          <div className="relative bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header / Progress Bar */}
            <div className="p-6 border-b border-white/5 bg-app/40">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-white">Request a Quote</h2>
                  <p className="text-gray-400 text-sm">Step {currentStep} of {steps.length}: {steps[currentStep-1].name}</p>
                </div>
                <button 
                  onClick={closeQuoteModal}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out" 
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step) => (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                      currentStep > step.id ? "bg-blue-500 text-white" : 
                      currentStep === step.id ? "bg-white text-navy-900 scale-125 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : 
                      "bg-navy-700 text-gray-500"
                    )}>
                      {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full"
                >
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">First Name</label>
                          <input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Last Name</label>
                          <input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                        <input 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@company.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Phone Number</label>
                        <input 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Company Name</label>
                        <input 
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Logistics Solutions Inc."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-300">Select Service Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'ftl', label: 'Full Truckload', icon: Truck },
                            { id: 'ltl', label: 'Partial / LTL', icon: Package },
                            { id: 'intermodal', label: 'Intermodal', icon: Globe },
                            { id: 'air', label: 'Air Freight', icon: Plane },
                            { id: 'ocean', label: 'Ocean Freight', icon: Anchor },
                            { id: 'other', label: 'Other', icon: Ruler },
                          ].map(service => (
                            <button
                              key={service.id}
                              onClick={() => selectService(service.id)}
                              className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left",
                                formData.serviceType === service.id 
                                ? "bg-blue-500/10 border-blue-500 text-white" 
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                              )}
                            >
                              <service.icon className={cn("w-5 h-5", formData.serviceType === service.id ? "text-blue-400" : "text-gray-500")} />
                              <span className="font-medium text-sm">{service.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Pickup Location (Origin)</label>
                          <input 
                            name="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                            placeholder="City, State, Zip"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Delivery Location (Destination)</label>
                          <input 
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            placeholder="City, State, Zip"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Est. Weight (lbs/kg)</label>
                          <input 
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            placeholder="e.g. 45,000 lbs"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Dimensions (L x W x H)</label>
                          <input 
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleInputChange}
                            placeholder={"e.g. 48' x 102\" x 110\""}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Cargo Description</label>
                        <textarea 
                          name="cargoDescription"
                          value={formData.cargoDescription}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="What are you shipping? (e.g. General Merchandise, Produce, Machinery)"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Special Requirements (Optional)</label>
                        <textarea 
                          name="specialRequirements"
                          value={formData.specialRequirements}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="Reefer, Lift gate, Hazardous materials, etc."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Contact</p>
                            <p className="text-white font-medium">{formData.firstName} {formData.lastName}</p>
                            <p className="text-gray-400 text-sm">{formData.company}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Communication</p>
                            <p className="text-white font-medium">{formData.email}</p>
                            <p className="text-gray-400 text-sm">{formData.phone}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Route & Service</p>
                          <div className="flex items-center gap-3 text-white font-medium">
                            <span>{formData.origin}</span>
                            <ArrowRight className="w-4 h-4 text-blue-500" />
                            <span>{formData.destination}</span>
                          </div>
                          <p className="text-blue-400 text-sm mt-1">{formData.serviceType.toUpperCase()}</p>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Cargo Info</p>
                          <p className="text-white text-sm">{formData.cargoDescription}</p>
                          <p className="text-gray-400 text-xs mt-1">{formData.weight} | {formData.dimensions}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-sm text-gray-300 leading-snug">
                          By submitting, you agree to our terms and conditions. Our team will review your request and contact you within 60 minutes.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 bg-app/40 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300",
                  currentStep === 1 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={currentStep === steps.length ? closeQuoteModal : handleNext}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
              >
                {currentStep === steps.length ? 'Submit Request' : 'Next Step'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
