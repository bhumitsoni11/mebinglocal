import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Companion } from '../types';

export const useLocalFriends = (filters?: any) => {
  return useQuery({
    queryKey: ['localFriends', filters],
    queryFn: async (): Promise<Companion[]> => {
      const response = await api.get('/local-friends', { params: filters });
      const items = response.data.items || [];
      
      // Map backend schema to frontend Companion interface
      return items.map((item: any) => ({
        id: item.id,
        name: `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim(),
        age: 25, // Mocked as it's not in schema
        city: item.location?.split(',')[0] || 'Unknown',
        country: item.location?.split(',')[1]?.trim() || 'Unknown',
        avatar: item.user?.avatarUrl || 'https://via.placeholder.com/200',
        coverPhoto: 'https://via.placeholder.com/600x300', // Mocked
        rating: item.rating || 0,
        reviewCount: item.totalReviews || 0,
        hourlyRate: (item.hourlyRate || 0) / 100, // Convert from cents
        languages: item.languages?.map((l: any) => l.language.name) || ['English'],
        interests: item.interests?.map((i: any) => i.interest.name) || [],
        bio: item.bio || '',
        verified: item.isVerified || false,
        womenOnly: false, // Defaulted
        responseTime: '< 1 hr',
        completedTours: 0,
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      }));
    }
  });
};

export const useLocalFriend = (id: string) => {
  return useQuery({
    queryKey: ['localFriend', id],
    queryFn: async (): Promise<Companion> => {
      const response = await api.get(`/local-friends/${id}`);
      const item = response.data;
      
      return {
        id: item.id,
        name: `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim(),
        age: 25,
        city: item.location?.split(',')[0] || 'Unknown',
        country: item.location?.split(',')[1]?.trim() || 'Unknown',
        avatar: item.user?.avatarUrl || 'https://via.placeholder.com/200',
        coverPhoto: 'https://via.placeholder.com/600x300',
        rating: item.rating || 0,
        reviewCount: item.totalReviews || 0,
        hourlyRate: (item.hourlyRate || 0) / 100,
        languages: item.languages?.map((l: any) => l.language.name) || ['English'],
        interests: item.interests?.map((i: any) => i.interest.name) || [],
        bio: item.bio || '',
        verified: item.isVerified || false,
        womenOnly: false,
        responseTime: '< 1 hr',
        completedTours: 0,
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      };
    },
    enabled: !!id,
  });
};
