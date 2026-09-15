'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HostApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Florence, Italy',
    neighborhood: '',
    yearsInCity: '5+',
    bio: '',
    spokenLanguages: 'English (Fluent), Italian (Native)',
    passions: 'Architecture, Natural Wine, Local History',
    idType: 'PASSPORT',
    hourlyRate: '40',
    experienceIdea: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mb-3">
          Application Successfully Submitted!
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
          Thank you, <strong className="text-on-surface">{formData.fullName || 'Host'}</strong>. Our Host Community team is reviewing your documents. You will receive an email confirmation and invite for your 15-minute video greeting shortly.
        </p>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high text-left mb-8 space-y-3">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Application Reference</span>
            <span className="font-mono font-bold text-on-surface">APP-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>City & Neighborhood</span>
            <span className="font-semibold text-on-surface">{formData.city} ({formData.neighborhood || 'Central'})</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Proposed Rate</span>
            <span className="font-semibold text-primary">${formData.hourlyRate} / hour</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Verification Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
              PENDING REVIEW
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md transition-all"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12 pb-24">
      {/* Progress Header */}
      <div className="mb-10 text-center">
        <span className="font-label-caps uppercase text-secondary font-bold tracking-widest text-xs">
          MebingLocal Host Vetting
        </span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
          Apply to Become a Verified Local
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant mt-1.5">
          Step {step} of 3 — Join our global circle of cultural insiders
        </p>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 1 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-surface-container'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 2 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
          }`}>
            2
          </div>
          <div className={`w-12 h-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-surface-container'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 3 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
          }`}>
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleNext} className="bg-surface-container-lowest rounded-3xl p-8 shadow-xl border border-surface-container-high space-y-6">
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-headline-md text-xl font-bold text-on-surface pb-3 border-b border-surface-container-high">
              1. Personal & Location Information
            </h3>

            <div>
              <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                Legal Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Elena Rossi"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="elena@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+39 333 1234567"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                  City of Residence *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none cursor-pointer"
                >
                  <option value="Florence, Italy">Florence, Italy</option>
                  <option value="Tokyo, Japan">Tokyo, Japan</option>
                  <option value="Kyoto, Japan">Kyoto, Japan</option>
                  <option value="Mexico City, Mexico">Mexico City, Mexico</option>
                  <option value="Lisbon, Portugal">Lisbon, Portugal</option>
                  <option value="Paris, France">Paris, France</option>
                  <option value="Rome, Italy">Rome, Italy</option>
                  <option value="Other">Other Global City</option>
                </select>
              </div>
              <div>
                <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                  Neighborhood / Quarter *
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  required
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder="e.g. Oltrarno, Yanaka, Roma Norte"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-headline-md text-xl font-bold text-on-surface pb-3 border-b border-surface-container-high">
              2. Cultural Narrative & Passions
            </h3>

            <div>
              <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                Your Story & Why You Want to Host *
              </label>
              <textarea
                name="bio"
                required
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about your profession, hobbies, and the authentic places in your neighborhood you love sharing with travelers..."
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                Spoken Languages & Fluency *
              </label>
              <input
                type="text"
                name="spokenLanguages"
                required
                value={formData.spokenLanguages}
                onChange={handleChange}
                placeholder="e.g. English (Fluent), Japanese (Native)"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                Specialties & Passions (Comma separated) *
              </label>
              <input
                type="text"
                name="passions"
                required
                value={formData.passions}
                onChange={handleChange}
                placeholder="e.g. 35mm Photography, Natural Wine, Cantinas, Architecture"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                Target Hourly Rate (USD) *
              </label>
              <input
                type="number"
                name="hourlyRate"
                required
                min={20}
                max={150}
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="font-headline-md text-xl font-bold text-on-surface pb-3 border-b border-surface-container-high">
              3. Identity Verification & First Haunt Idea
            </h3>

            <div>
              <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                Government ID Document Type *
              </label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none cursor-pointer"
              >
                <option value="PASSPORT">Passport (International)</option>
                <option value="NATIONAL_ID">National Identity Card</option>
                <option value="DRIVERS_LICENSE">Driver's License</option>
              </select>
            </div>

            {/* Simulated Document Upload Dropzone */}
            <div className="border-2 border-dashed border-surface-container-high rounded-2xl p-6 text-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-3xl text-primary mb-2">upload_file</span>
              <p className="font-label-md text-sm font-semibold text-on-surface">Upload Photo ID (Front & Back)</p>
              <p className="text-xs text-on-surface-variant mt-1">PNG, JPG or PDF up to 10MB. Encrypted and never shared publicly.</p>
            </div>

            <div>
              <label className="font-label-caps text-xs uppercase text-on-surface-variant mb-1.5 block font-semibold">
                Proposed Curated Experience Idea (Optional)
              </label>
              <textarea
                name="experienceIdea"
                rows={3}
                value={formData.experienceIdea}
                onChange={handleChange}
                placeholder="Give a working title and brief idea for an experience you'd love to host (e.g. Dawn Fish Market Tasting or Twilight Wine Window Tour)..."
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-4 border-t border-surface-container-low flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-colors"
            >
              Back
            </button>
          ) : <div />}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md transition-all active:scale-98 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                <span>Submitting Application...</span>
              </>
            ) : step === 3 ? (
              <span>Complete & Submit Application</span>
            ) : (
              <>
                <span>Continue</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
