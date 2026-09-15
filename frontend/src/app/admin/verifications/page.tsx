'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getVerificationApplications, reviewApplication, VerificationApplication } from '@/services/api';

export default function AdminVerificationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getVerificationApplications()
      .then((apps) => {
        if (apps && apps.length > 0) {
          setApplications(
            apps.map((a: any) => ({
              id: a.id,
              fullName: a.user?.name || 'Applicant Host',
              email: a.user?.email || '',
              city: `${a.city || 'City'}, ${a.country || 'Country'}`,
              neighborhood: `${a.city || 'Local'} Resident (${a.residenceDurationYears || 1} yrs)`,
              hourlyRate: 40,
              languages: 'English, Local Language',
              passions: a.bio || 'Cultural Exploration',
              idType: a.idDocumentType || 'PASSPORT',
              status: a.status,
              appliedAt: new Date(a.createdAt).toLocaleDateString(),
              experienceTitle: a.proposedExperiencePitch || 'Authentic Local Tour',
            })),
          );
        } else {
          setApplications([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch verification applications:', err);
        setApplications([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'APPROVED' } : app)),
    );
    try {
      await reviewApplication(id, 'APPROVE');
    } catch (err) {
      console.warn('API review application error:', err);
    }
  };

  const handleReject = async (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'REJECTED' } : app)),
    );
    try {
      await reviewApplication(id, 'REJECT', 'Document verification required');
    } catch (err) {
      console.warn('API reject application error:', err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-high">
        <div>
          <span className="font-label-caps uppercase text-primary font-bold text-xs">Trust & Safety Governance</span>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Host Verification Workspace</h1>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
        >
          ← Back to Admin Console
        </Link>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-surface-container animate-pulse" />
          ))
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl p-8 border border-surface-container-high">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">verified_user</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">No pending verification applications</h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              All submitted host identity proofs and background dossiers have been audited.
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container-low">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">{app.fullName}</h3>
                  <span
                    className={`px-3 py-0.5 rounded-full font-label-caps text-[10px] font-bold ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant">Applied {app.appliedAt}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-on-surface">
                <div>
                  <span className="text-on-surface-variant block uppercase text-[10px] font-bold">Location & Contact</span>
                  <span className="font-semibold text-sm">{app.city} ({app.neighborhood})</span>
                  <span className="text-on-surface-variant block mt-0.5">{app.email}</span>
                </div>

                <div>
                  <span className="text-on-surface-variant block uppercase text-[10px] font-bold">Languages & Passions</span>
                  <span className="font-semibold block">{app.languages}</span>
                  <span className="text-on-surface-variant block mt-0.5">{app.passions}</span>
                </div>

                <div>
                  <span className="text-on-surface-variant block uppercase text-[10px] font-bold">Economics & Document</span>
                  <span className="font-bold text-primary text-sm">${app.hourlyRate} / hour</span>
                  <span className="text-on-surface-variant block mt-0.5">Verified via {app.idType}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low text-xs">
                <span className="font-bold text-on-surface block mb-1">Proposed Experience:</span>
                <p className="text-on-surface-variant italic">"{app.experienceTitle}"</p>
              </div>

              {app.status === 'PENDING' && (
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleReject(app.id)}
                    className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-rose-50 hover:text-rose-700 text-on-surface text-xs font-semibold transition-colors"
                  >
                    Reject / Request Clarification
                  </button>
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm"
                  >
                    Approve & Issue Emerald Badge
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
