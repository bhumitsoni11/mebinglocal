import { api } from '@/lib/api';

export interface GenerateItineraryDto {
  destination: string;
  durationDays?: number;
  interests?: string[];
  travelStyle?: string;
  pace?: string;
  budgetRange?: string;
  dietaryRestrictions?: string;
  prompt?: string;
}

export async function generateItinerary(dto: GenerateItineraryDto): Promise<any> {
  return api.post('/ai/itinerary', dto);
}

export async function translateText(text: string, targetLanguage: string): Promise<any> {
  return api.post('/ai/translate', { text, targetLanguage });
}
