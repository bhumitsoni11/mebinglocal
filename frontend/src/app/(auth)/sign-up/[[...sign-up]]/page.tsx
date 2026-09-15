'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  const [role, setRole] = useState<'traveler' | 'host'>('traveler');

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-5rem)] justify-center py-12 px-6 md:px-12 bg-background">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Narrative / Testimonial & Trust Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="font-label-caps text-label-caps uppercase tracking-wider font-bold">
                Verified Human Connections
              </span>
            </div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl text-on-surface tracking-tight font-bold leading-tight">
              Join the global network of cultural explorers.
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-md leading-relaxed">
              Unlock verified resident guides, customized AI travel itineraries, and unscripted cultural moments in 48 countries.
            </p>
          </div>

          {/* Role selector pill */}
          <div className="space-y-2 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high">
            <label className="block font-label-caps uppercase text-xs text-on-surface-variant font-bold">
              I am joining primarily as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('traveler')}
                className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all ${
                  role === 'traveler'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">explore</span>
                <span className="text-xs">A Traveler</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('host')}
                className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all ${
                  role === 'host'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">home_pin</span>
                <span className="text-xs">A Local Host</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Auth Box */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-xl p-8 border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-xl font-bold text-on-surface">Create your Account</span>
              </div>
              <span className="font-label-md text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                256-Bit SSL
              </span>
            </div>

            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary hover:bg-primary-container text-on-primary font-label-md rounded-full shadow-md py-3',
                  card: 'shadow-none border-0 p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'rounded-xl border border-surface-container-high bg-surface-container-low hover:bg-surface-container text-on-surface',
                  formFieldInput: 'rounded-xl bg-surface-container-low border-surface-container-high text-on-surface',
                  footerActionLink: 'text-primary hover:text-primary-container font-semibold',
                },
              }}
            />

            <div className="mt-6 pt-4 border-t border-surface-container-low text-center">
              <p className="text-xs text-on-surface-variant">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-primary font-bold hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
