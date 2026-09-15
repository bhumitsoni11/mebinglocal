import { api } from '@/lib/api';
import { VerificationApplication } from './types';

export async function getAdminDashboard(): Promise<any> {
  return api.get('/admin/dashboard');
}

export async function getVerificationApplications(status?: string): Promise<VerificationApplication[]> {
  try {
    const params = status ? { status } : {};
    const res: any = await api.get('/admin/verification/applications', { params });
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    console.warn('Failed to fetch admin verification applications:', err);
    return [];
  }
}

export async function reviewApplication(id: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string): Promise<any> {
  return api.put(`/admin/verification/applications/${id}/review`, { action, rejectionReason });
}

export async function getAdminUsers(role?: string, search?: string): Promise<any[]> {
  try {
    const params: any = {};
    if (role) params.role = role;
    if (search) params.search = search;
    const res: any = await api.get('/admin/users', { params });
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    console.warn('Failed to fetch admin users:', err);
    return [];
  }
}

export async function toggleUserActive(id: string): Promise<any> {
  return api.put(`/admin/users/${id}/toggle-active`);
}

export async function getSystemHealth(): Promise<any> {
  return api.get('/admin/system-health');
}
