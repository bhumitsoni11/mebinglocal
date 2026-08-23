import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAvailability = (localFriendId: string) => {
  return useQuery({
    queryKey: ['availability', localFriendId],
    queryFn: async () => {
      const response = await api.get(`/local-friends/${localFriendId}/availability`);
      return response.data;
    },
    enabled: !!localFriendId,
  });
};
