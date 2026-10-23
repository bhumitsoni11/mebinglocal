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
      const items = res.items.map((item: any) => {
        const localProfile = item.localProfile || item.local;
        const mainImage = item.images?.[0]?.imageUrl || item.heroImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80';
        return {
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          city: item.destination?.city || localProfile?.city || 'Tokyo',
          country: item.destination?.country || localProfile?.country || 'Japan',
          category: item.category || 'Food & Wine',
          pricePerPerson: Number(item.pricePerPerson) || 45,
          durationHours: Number(item.durationHours) || 3,
          maxGroupSize: item.maxGroupSize || 6,
          meetingPoint: item.meetingPoint || '',
          heroImage: mainImage,
          galleryImages: item.images?.map((img: any) => img.imageUrl) || [mainImage],
          languages: item.languages || ['English'],
          rating: Number(item.ratingScore) || 5.0,
          reviewCount: Number(item.reviewCount) || 0,
          inclusions: item.inclusions || [],
          itinerarySteps: item.itinerarySteps || [],
          host: localProfile
            ? {
                id: localProfile.id,
                userId: localProfile.userId,
                name: localProfile.user?.name || 'Local Guide',
                avatar: localProfile.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
                city: localProfile.city || '',
                country: localProfile.country || '',
                tagline: localProfile.tagline || '',
                rating: Number(localProfile.ratingScore) || 5.0,
                reviewCount: Number(localProfile.reviewCount) || 0,
                hourlyRate: Number(localProfile.hourlyRate) || 40,
                languages: localProfile.languages || ['English'],
                passions: localProfile.interests || [],
                isVerified: localProfile.verificationStatus === 'APPROVED',
                badgeLevel: localProfile.isSuperhost ? ('SUPERHOST' as const) : ('VERIFIED' as const),
              }
            : undefined,
        };
      });
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
    const localProfile = item.localProfile || item.local;
    const mainImage = item.images?.[0]?.imageUrl || item.heroImage || '';
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      city: item.destination?.city || localProfile?.city || '',
      country: item.destination?.country || localProfile?.country || '',
      category: item.category || 'Food & Wine',
      pricePerPerson: Number(item.pricePerPerson) || 45,
      durationHours: Number(item.durationHours) || 3,
      maxGroupSize: item.maxGroupSize || 6,
      meetingPoint: item.meetingPoint || '',
      heroImage: mainImage,
      galleryImages: item.images?.map((img: any) => img.imageUrl) || (mainImage ? [mainImage] : []),
      languages: item.languages || ['English'],
      rating: Number(item.ratingScore) || 5.0,
      reviewCount: Number(item.reviewCount) || 0,
      inclusions: item.inclusions || [],
      itinerarySteps: item.itinerarySteps || [],
      host: localProfile
        ? {
            id: localProfile.id,
            userId: localProfile.userId,
            name: localProfile.user?.name || 'Local Guide',
            avatar: localProfile.user?.avatar || '',
            city: localProfile.city || '',
            country: localProfile.country || '',
            tagline: localProfile.tagline || '',
            rating: Number(localProfile.ratingScore) || 5.0,
            reviewCount: Number(localProfile.reviewCount) || 0,
            hourlyRate: Number(localProfile.hourlyRate) || 40,
            languages: localProfile.languages || ['English'],
            passions: localProfile.interests || [],
            isVerified: localProfile.verificationStatus === 'APPROVED',
            badgeLevel: localProfile.isSuperhost ? ('SUPERHOST' as const) : ('VERIFIED' as const),
          }
        : undefined,
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
