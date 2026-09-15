import { api } from '@/lib/api';

export async function getTravelerProfile(): Promise<any> {
  return api.get('/travelers/profile');
}

export async function updateTravelerProfile(data: any): Promise<any> {
  return api.put('/travelers/profile', data);
}

export async function getSavedItems(): Promise<any[]> {
  try {
    const res: any = await api.get('/travelers/saved');
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    return [];
  }
}

export async function toggleSaveItem(itemType: 'LOCAL' | 'EXPERIENCE' | 'DESTINATION', targetId: string): Promise<any> {
  return api.post('/travelers/saved/toggle', { itemType, targetId });
}
