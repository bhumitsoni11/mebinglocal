'use client';

import React from 'react';
import { UserProfile } from '@clerk/nextjs';

export default function TravelerProfilePage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 pb-20">
      <div className="mb-8 pb-4 border-b border-surface-container-high">
        <span className="font-label-caps uppercase text-secondary font-bold text-xs">Account Settings</span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Traveler Profile & Security</h1>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-md">
        <UserProfile
          appearance={{
            elements: {
              card: 'shadow-none border-0 p-0',
              navbar: 'border-r border-surface-container-high',
              navbarButton: 'text-on-surface hover:bg-surface-container-low rounded-xl',
              headerTitle: 'font-headline-md text-on-surface font-bold',
              headerSubtitle: 'text-on-surface-variant',
              formButtonPrimary: 'bg-primary hover:bg-primary-container text-on-primary font-label-md rounded-full shadow-md',
            },
          }}
        />
      </div>
    </div>
  );
}
