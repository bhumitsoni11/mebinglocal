import { api } from '@/lib/api';

export async function getMe(): Promise<any> {
  return api.get('/auth/me');
}

export async function syncUser(clerkUserId: string, email: string, name?: string, avatar?: string, role?: string): Promise<any> {
  return api.post('/auth/sync', { clerkUserId, email, name, avatar, role });
}

export async function updateOnboarding(status: string): Promise<any> {
  return api.post('/auth/onboarding', { status });
}
