'use client';

import React from 'react';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
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
              Where cultures meet without pretense.
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-md leading-relaxed">
              Step into local living rooms, hidden tea ateliers, and neighborhood alleyways guided by verified resident friends across 48 countries.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="relative bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
              <span className="ml-2 font-label-md text-xs text-on-surface-variant font-medium">5.0 Authenticity Score</span>
            </div>
            <p className="font-body-md text-sm text-on-surface italic leading-relaxed">
              “MebingLocal introduced me to Satoshi in Kyoto—a morning foraging seasonal herbs followed by tea brewing in his 120-year-old machiya. The most authentic day of my life.”
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-secondary">
                  SK
                </div>
                <div>
                  <p className="font-label-lg text-xs font-bold text-on-surface">Sarah K.</p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">Solo Traveler from Vancouver</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-secondary bg-surface-container-low px-2 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-xs">pin_drop</span> Kyoto, JP
              </span>
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-3 text-on-surface-variant">
            <div className="flex -space-x-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-xs font-bold text-on-secondary-fixed shadow-sm">
                ES
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-bold text-on-primary-fixed shadow-sm">
                TK
              </div>
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-xs font-bold text-on-tertiary-fixed shadow-sm">
                MC
              </div>
            </div>
            <p className="font-body-sm text-xs leading-snug">
              Joined by <strong className="text-on-surface font-semibold">24,000+ conscious explorers</strong> and accredited hosts globally.
            </p>
          </div>
        </div>

        {/* Right Auth Box */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-xl p-8 border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-xl font-bold text-on-surface">Sign In to MebingLocal</span>
              </div>
              <span className="font-label-md text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                256-Bit SSL
              </span>
            </div>

            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
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
                Don’t have an account?{' '}
                <Link href="/sign-up" className="text-primary font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
