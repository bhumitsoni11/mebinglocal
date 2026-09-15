import { api } from '@/lib/api';
import { VerificationApplication } from './types';

export interface SubmitVerificationDto {
  city: string;
  country: string;
  residenceDurationYears: number;
  bio: string;
  idDocumentType: string;
  idDocumentUrl: string;
  proposedExperiencePitch: string;
}

export async function getMyVerificationApplication(): Promise<VerificationApplication | null> {
  try {
    return await api.get('/verification/my-application');
  } catch (err) {
    return null;
  }
}

export async function submitVerificationApplication(dto: SubmitVerificationDto): Promise<VerificationApplication> {
  return api.post('/verification/apply', dto);
}
