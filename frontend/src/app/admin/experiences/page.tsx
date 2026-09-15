'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState([
    { id: 'exp-1', title: 'Dawn Tsukiji Market Tasting & Knife Artisan Visit', host: 'Kenji Tanaka', city: 'Tokyo', price: 75, status: 'PUBLISHED' },
    { id: 'exp-2', title: 'Twilight Natural Wine & Historic Botteghe Walk', host: 'Elena Rossi', city: 'Florence', price: 55, status: 'PUBLISHED' },
    { id: 'exp-3', title: 'Secret Cantinas & Mezcal Pairing in Coyoacán', host: 'Camila Morales', city: 'Mexico City', price: 48, status: 'PUBLISHED' },
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-high">
        <div>
          <span className="font-label-caps uppercase text-primary font-bold text-xs">Catalog Moderation</span>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Platform Experiences</h1>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
        >
          ← Back to Admin Console
        </Link>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] mb-1 inline-block">
                {exp.status}
              </span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">{exp.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Hosted by <strong className="text-on-surface">{exp.host}</strong> ({exp.city}) · <strong className="text-primary">${exp.price} / person</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/experiences"
                className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
