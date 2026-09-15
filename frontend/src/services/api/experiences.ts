import { api } from '@/lib/api';
import { Experience } from './types';

export interface GetExperiencesParams {
  destination?: string;
  city?: string;
  category?: string;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getExperiences(params: GetExperiencesParams = {}): Promise<{ items: Experience[]; total: number }> {
  try {
    const res: any = await api.get('/experiences', { params });
    if (res && Array.isArray(res.items)) {
      const items = res.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        city: item.destination?.city || item.local?.city || 'Tokyo',
        country: item.destination?.country || 'Japan',
        category: item.category || 'Food & Wine',
        pricePerPerson: Number(item.pricePerPerson) || 45,
        durationHours: Number(item.durationHours) || 3,
        maxGroupSize: item.maxGroupSize || 6,
        meetingPoint: item.meetingPoint || '',
        heroImage: item.heroImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
        galleryImages: item.images?.map((img: any) => img.imageUrl) || [],
        languages: item.languages || ['English'],
        rating: Number(item.ratingScore) || 5.0,
        reviewCount: Number(item.reviewCount) || 0,
        inclusions: item.inclusions || [],
        itinerarySteps: item.itinerarySteps || [],
        host: item.local
          ? {
              id: item.local.id,
              userId: item.local.userId,
              name: item.local.user?.name || 'Local Guide',
              avatar: item.local.user?.avatar || '',
              city: item.local.city || '',
              country: '',
              tagline: item.local.tagline || '',
              rating: Number(item.local.ratingScore) || 5.0,
              reviewCount: Number(item.local.reviewCount) || 0,
              hourlyRate: Number(item.local.hourlyRate) || 40,
              languages: item.local.languages || ['English'],
              passions: item.local.interests || [],
              isVerified: item.local.verificationStatus === 'APPROVED',
              badgeLevel: item.local.isSuperhost ? ('SUPERHOST' as const) : ('VERIFIED' as const),
            }
          : undefined,
      }));
      return { items, total: res.total || items.length };
    }
    return { items: [], total: 0 };
  } catch (err) {
    console.warn('Failed to fetch experiences from backend:', err);
    return { items: [], total: 0 };
  }
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  try {
    const item: any = await api.get(`/experiences/${id}`);
    if (!item) return null;
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      city: item.destination?.city || item.local?.city || '',
      country: item.destination?.country || '',
      category: item.category || 'Food & Wine',
      pricePerPerson: Number(item.pricePerPerson) || 45,
      durationHours: Number(item.durationHours) || 3,
      maxGroupSize: item.maxGroupSize || 6,
      meetingPoint: item.meetingPoint || '',
      heroImage: item.heroImage || '',
      galleryImages: item.images?.map((img: any) => img.imageUrl) || [],
      languages: item.languages || ['English'],
      rating: Number(item.ratingScore) || 5.0,
      reviewCount: Number(item.reviewCount) || 0,
      inclusions: item.inclusions || [],
      itinerarySteps: item.itinerarySteps || [],
    };
  } catch (err) {
    console.warn(`Failed to fetch experience ${id}:`, err);
    return null;
  }
}

export async function createExperience(data: any): Promise<any> {
  return api.post('/experiences', data);
}

export async function updateExperience(id: string, data: any): Promise<any> {
  return api.put(`/experiences/${id}`, data);
}
