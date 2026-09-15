import { api } from '@/lib/api';
import { LocalFriend } from './types';

export interface GetLocalsParams {
  destination?: string;
  city?: string;
  language?: string;
  interest?: string;
  maxRate?: number;
  verifiedOnly?: boolean;
  superhostOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getLocals(params: GetLocalsParams = {}): Promise<{ items: LocalFriend[]; total: number }> {
  try {
    const res: any = await api.get('/locals', { params });
    if (res && Array.isArray(res.items)) {
      const items = res.items.map((item: any) => ({
        id: item.id,
        userId: item.userId,
        name: item.user?.name || 'Local Guide',
        avatar: item.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        city: item.city || item.destination?.city || 'Tokyo',
        country: item.destination?.country || 'Japan',
        tagline: item.tagline || '',
        bio: item.bio || '',
        rating: Number(item.ratingScore) || 5.0,
        reviewCount: Number(item.reviewCount) || 0,
        hourlyRate: Number(item.hourlyRate) || 40,
        languages: item.languages || ['English'],
        passions: item.interests || [],
        isVerified: item.verificationStatus === 'APPROVED',
        badgeLevel: item.isSuperhost ? ('SUPERHOST' as const) : ('VERIFIED' as const),
        isSuperhost: item.isSuperhost,
        completedTours: item.completedTours || 0,
        responseRate: item.responseRatePercent || 100,
        specialties: item.interests || [],
        experiences: item.experiences || [],
      }));
      return { items, total: res.total || items.length };
    }
    return { items: [], total: 0 };
  } catch (err) {
    console.warn('Failed to fetch locals from backend:', err);
    return { items: [], total: 0 };
  }
}

export async function getLocalById(id: string): Promise<LocalFriend | null> {
  try {
    const item: any = await api.get(`/locals/${id}`);
    if (!item) return null;
    return {
      id: item.id,
      userId: item.userId,
      name: item.user?.name || 'Local Guide',
      avatar: item.user?.avatar || '',
      city: item.city || item.destination?.city || '',
      country: item.destination?.country || '',
      tagline: item.tagline || '',
      bio: item.bio || '',
      rating: Number(item.ratingScore) || 5.0,
      reviewCount: Number(item.reviewCount) || 0,
      hourlyRate: Number(item.hourlyRate) || 40,
      languages: item.languages || ['English'],
      passions: item.interests || [],
      isVerified: item.verificationStatus === 'APPROVED',
      badgeLevel: item.isSuperhost ? ('SUPERHOST' as const) : ('VERIFIED' as const),
      isSuperhost: item.isSuperhost,
      completedTours: item.completedTours || 0,
      responseRate: item.responseRatePercent || 100,
      specialties: item.interests || [],
      experiences: item.experiences || [],
    };
  } catch (err) {
    console.warn(`Failed to fetch local ${id}:`, err);
    return null;
  }
}

export async function getLocalDashboard(): Promise<any> {
  return api.get('/locals/dashboard');
}

export async function updateLocalProfile(data: any): Promise<any> {
  return api.put('/locals/profile', data);
}
