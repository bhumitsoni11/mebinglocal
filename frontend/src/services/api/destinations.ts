import { api } from '@/lib/api';
import { Destination } from './types';

export interface GetDestinationsParams {
  trending?: boolean;
  search?: string;
  country?: string;
  region?: string;
  page?: number;
  limit?: number;
}

export async function getDestinations(params?: boolean | GetDestinationsParams): Promise<Destination[]> {
  try {
    let queryParams: any = {};
    if (typeof params === 'boolean') {
      queryParams = { trending: params };
    } else if (params) {
      queryParams = params;
    }
    const res: any = await api.get('/destinations', { params: queryParams });
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    console.warn('Failed to fetch destinations from backend:', err);
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

// --- Live Public Geo APIs ---

export async function getLiveGeoCountries(): Promise<Array<{ name: string; iso2: string; lat: number; long: number }>> {
  try {
    const res: any = await api.get('/destinations/geo/countries');
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function getLiveGeoStates(country: string): Promise<Array<{ name: string; state_code: string }>> {
  try {
    const res: any = await api.get('/destinations/geo/states', { params: { country } });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function getLiveGeoCities(country: string, state?: string): Promise<string[]> {
  try {
    const res: any = await api.get('/destinations/geo/cities', { params: { country, state } });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function searchLiveGeoLocations(query: string): Promise<any> {
  try {
    const res: any = await api.get('/destinations/geo/search', { params: { q: query } });
    return res || { countries: [] };
  } catch {
    return { countries: [] };
  }
}
