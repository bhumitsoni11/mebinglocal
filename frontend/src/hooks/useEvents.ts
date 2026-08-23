import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Event } from '../types';

export const useEvents = (filters?: any) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async (): Promise<Event[]> => {
      const response = await api.get('/local-pulse', { params: filters });
      const items = response.data.items || [];
      
      return items.map((item: any) => {
        // Assuming local-pulse returns an array of posts, each with events
        const event = item.events?.[0]; // just grab the first event for the post
        return {
          id: item.id,
          title: event?.title || item.content?.substring(0, 30) || 'Local Event',
          city: item.location || 'Unknown',
          date: event?.startTime ? new Date(event.startTime).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString(),
          image: item.media?.[0]?.url || 'https://via.placeholder.com/600x400',
          category: event?.eventType || 'General',
          postedBy: `${item.author?.firstName || ''} ${item.author?.lastName || ''}`.trim(),
          description: event?.description || item.content || '',
          attendees: 0,
        };
      });
    }
  });
};
