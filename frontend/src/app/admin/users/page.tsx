'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Elena Rossi', email: 'elena@florence.it', role: 'LOCAL_HOST', status: 'ACTIVE', rating: 4.98, city: 'Florence' },
    { id: 'usr-2', name: 'Kenji Tanaka', email: 'kenji@tokyo.jp', role: 'LOCAL_HOST', status: 'ACTIVE', rating: 5.0, city: 'Tokyo' },
    { id: 'usr-3', name: 'Sarah Jenkins', email: 'sarah.j@london.co.uk', role: 'TRAVELER', status: 'ACTIVE', rating: 5.0, city: 'London' },
    { id: 'usr-4', name: 'Camila Morales', email: 'camila@cdmx.mx', role: 'LOCAL_HOST', status: 'ACTIVE', rating: 4.96, city: 'Mexico City' },
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-high">
        <div>
          <span className="font-label-caps uppercase text-primary font-bold text-xs">Directory Management</span>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Platform Users & Hosts</h1>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
        >
          ← Back to Admin Console
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-md overflow-hidden">
        <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by name, email, or city..."
            className="w-full max-w-sm px-4 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-caps uppercase text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">City</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 font-semibold text-on-surface">
                    <div>{u.name}</div>
                    <div className="text-on-surface-variant font-normal text-[11px]">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-on-surface-variant">{u.city}</td>
                  <td className="p-4 font-bold text-amber-600">⭐ {u.rating}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Managing user ${u.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
