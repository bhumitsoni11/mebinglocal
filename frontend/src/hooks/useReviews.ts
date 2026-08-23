import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Review } from '../types';

export const useReviews = (localFriendId?: string) => {
  return useQuery({
    queryKey: ['reviews', localFriendId],
    queryFn: async (): Promise<Review[]> => {
      const response = await api.get('/reviews', { params: { revieweeId: localFriendId } });
      const items = response.data.items || [];
      
      return items.map((item: any) => ({
        id: item.id,
        author: `${item.reviewer?.firstName || ''} ${item.reviewer?.lastName?.charAt(0) || ''}.`.trim(),
        avatar: item.reviewer?.avatarUrl || 'https://via.placeholder.com/100',
        rating: item.rating || 0,
        date: new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }),
        comment: item.comment || '',
        tripType: 'Solo Travel', // Defaulted or parse from booking
        localFriendId: item.revieweeId,
      }));
    }
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { bookingId: string; rating: number; comment: string }) => {
      const response = await api.post('/reviews', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
