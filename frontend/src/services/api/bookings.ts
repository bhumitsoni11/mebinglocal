import { api } from '@/lib/api';
import { Booking } from './types';

export interface CreateBookingDto {
  localProfileId: string;
  experienceId?: string;
  bookingDate: string;
  startTime?: string;
  durationHours: number;
  guestCount: number;
  notes?: string;
}

export async function createBooking(dto: CreateBookingDto): Promise<Booking> {
  return api.post('/bookings', dto);
}

export async function getMyTrips(): Promise<Booking[]> {
  try {
    const res: any = await api.get('/bookings/my-trips');
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    console.warn('Failed to fetch traveler trips:', err);
    return [];
  }
}

export async function getMyHostedBookings(): Promise<Booking[]> {
  try {
    const res: any = await api.get('/bookings/my-hosted');
    return Array.isArray(res) ? res : res?.items || [];
  } catch (err) {
    console.warn('Failed to fetch host bookings:', err);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  return api.put(`/bookings/${id}/status`, { status });
}
