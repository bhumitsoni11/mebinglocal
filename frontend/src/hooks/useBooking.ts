import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      localFriendId: string;
      startTime: string;
      endTime: string;
      totalAmount: number;
    }) => {
      const response = await api.post('/bookings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: async (data: { bookingId: string }) => {
      const response = await api.post('/payments/orders', data);
      return response.data;
    },
  });
};

export const useTravelerBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'traveler'],
    queryFn: async () => {
      const response = await api.get('/bookings/traveler');
      return response.data;
    },
  });
};

export const useLocalFriendBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'local-friend'],
    queryFn: async () => {
      const response = await api.get('/bookings/local-friend');
      return response.data;
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'local-friend'] });
    },
  });
};
