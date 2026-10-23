'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminUsers, getLocals } from '@/services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // Try admin users endpoint, fallback to getLocals
    getAdminUsers()
      .then((adminUsers) => {
        if (isMounted && Array.isArray(adminUsers) && adminUsers.length > 0) {
          setUsers(
            adminUsers.map((u: any) => ({
              id: u.id,
              name: u.name || 'Platform User',
              email: u.email || 'user@mebinglocal.com',
              role: u.role || (u.localProfile ? 'LOCAL_HOST' : 'TRAVELER'),
              status: u.isActive !== false ? 'ACTIVE' : 'SUSPENDED',
              rating: u.localProfile?.ratingScore ? Number(u.localProfile.ratingScore) : 5.0,
              city: u.localProfile?.city || 'Global',
              avatar: u.avatar || '',
            })),
          );
        } else {
          // Fallback to getLocals
          getLocals().then((localsRes) => {
            const locals = localsRes.items || [];
            if (isMounted && locals.length > 0) {
              setUsers(
                locals.map((l: any) => ({
                  id: l.id,
                  name: l.name,
                  email: `${l.name.toLowerCase().replace(/\s+/g, '.')}@mebinglocal.com`,
                  role: 'LOCAL_HOST',
                  status: 'ACTIVE',
                  rating: l.rating || 5.0,
                  city: l.city,
                  avatar: l.avatar,
                })),
              );
            } else {
              setUsers([]);
            }
          });
        }
      })
      .catch(() => {
        getLocals()
          .then((localsRes) => {
            const locals = localsRes.items || [];
            if (isMounted) {
              setUsers(
                locals.map((l: any) => ({
                  id: l.id,
                  name: l.name,
                  email: `${l.name.toLowerCase().replace(/\s+/g, '.')}@mebinglocal.com`,
                  role: 'LOCAL_HOST',
                  status: 'ACTIVE',
                  rating: l.rating || 5.0,
                  city: l.city,
                  avatar: l.avatar,
                })),
              );
            }
          })
          .catch(() => {
            if (isMounted) setUsers([]);
          });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q);

      const matchesRole =
        selectedRole === 'ALL' ||
        u.role.toUpperCase() === selectedRole.toUpperCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-xs font-bold uppercase mb-2">
            <span className="material-symbols-outlined text-sm">manage_accounts</span>
            Directory Management
          </div>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface">Platform Users & Hosts</h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Global verified local hosts, resident guides, and authenticated travelers.
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Admin Console
        </Link>
      </div>

      {/* Directory Table Card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-md overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 sm:p-5 border-b border-surface-container-high flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low text-on-surface text-xs focus:outline-none border border-transparent focus:border-primary/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRole('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedRole === 'ALL'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setSelectedRole('LOCAL_HOST')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedRole === 'LOCAL_HOST'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Local Hosts
            </button>
            <button
              onClick={() => setSelectedRole('TRAVELER')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedRole === 'TRAVELER'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Travelers
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-caps uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 pl-6">User / Host</th>
                <th className="p-4">Role</th>
                <th className="p-4">City</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 pl-6" colSpan={6}>
                      <div className="h-8 bg-surface-container rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-on-surface-variant">
                    No users matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-on-surface">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden relative bg-surface-container shrink-0">
                          {u.avatar ? (
                            <Image
                              src={u.avatar}
                              alt={u.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center font-bold text-xs text-primary bg-primary/10">
                              {u.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-on-surface">{u.name}</div>
                          <div className="text-on-surface-variant font-normal text-[11px]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant font-medium">{u.city}</td>
                    <td className="p-4 font-bold text-amber-600">⭐ {u.rating?.toFixed(1) || '5.0'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-caps font-bold text-[10px]">
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {u.role === 'LOCAL_HOST' ? (
                        <Link
                          href={`/local-friends/${u.id}`}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors inline-block"
                        >
                          View Profile
                        </Link>
                      ) : (
                        <span className="text-[11px] text-on-surface-variant font-medium">Active</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
