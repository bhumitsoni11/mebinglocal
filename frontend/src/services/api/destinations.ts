import { api } from '@/lib/api';
import { Destination } from './types';

export async function getDestinations(isTrending?: boolean): Promise<Destination[]> {
  try {
    const params = isTrending !== undefined ? { trending: isTrending } : {};
    const res: any = await api.get('/destinations', { params });
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    console.warn('Failed to fetch destinations from backend, using fallback:', err);
    return [];
  }
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const res: any = await api.get(`/destinations/${slug}`);
    return res || null;
  } catch (err) {
    console.warn(`Failed to fetch destination ${slug}:`, err);
    return null;
  }
}
