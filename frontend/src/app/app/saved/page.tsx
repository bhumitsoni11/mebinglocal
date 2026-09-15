'use client';

import React from 'react';
import Link from 'next/link';

export default function SavedItemsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="mb-8 pb-4 border-b border-surface-container-high">
        <span className="font-label-caps uppercase text-secondary font-bold text-xs">Saved Haunts</span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Bookmarked Hosts & Experiences</h1>
      </div>

      <div className="text-center py-20 bg-surface-container-low rounded-3xl p-8 border border-surface-container-high">
        <span className="material-symbols-outlined text-5xl text-outline mb-2">bookmark_border</span>
        <h3 className="font-headline-sm text-lg font-bold text-on-surface">No saved items yet</h3>
        <p className="font-body-md text-sm text-on-surface-variant mt-1 mb-6">
          Bookmark local friends, secret spots, or curated experiences to view them here later.
        </p>
        <Link
          href="/local-friends"
          className="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-all shadow-md"
        >
          Explore Local Friends
        </Link>
      </div>
    </div>
  );
}
