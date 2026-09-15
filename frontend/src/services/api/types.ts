export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  message?: string;
  timestamp?: string;
}

export interface Destination {
  id: string;
  slug: string;
  city: string;
  country: string;
  region?: string;
  heroImage: string;
  description: string;
  latitude: number;
  longitude: number;
  weatherNote?: string;
  avgPrice?: number;
  isTrending: boolean;
  localCount: number;
}

export interface LocalFriend {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  city: string;
  country: string;
  tagline: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  languages: string[];
  passions: string[];
  isVerified: boolean;
  badgeLevel: 'VERIFIED' | 'TOP_HOST' | 'SUPERHOST' | 'EXPERT_GUIDE';
  isSuperhost?: boolean;
  completedTours?: number;
  responseRate?: number;
  specialties?: string[];
  destinations?: Destination;
  experiences?: Experience[];
}

export interface Experience {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  city: string;
  country: string;
  category: string;
  pricePerPerson: number;
  durationHours: number;
  maxGroupSize?: number;
  meetingPoint?: string;
  heroImage: string;
  galleryImages?: string[];
  languages?: string[];
  rating: number;
  reviewCount: number;
  inclusions?: string[];
  itinerarySteps?: Array<{ title: string; description: string; durationMinutes?: number }>;
  host?: LocalFriend;
}

export interface PulsePost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  city: string;
  title: string;
  content: string;
  image?: string;
  category: string;
  upvotesCount: number;
  commentsCount: number;
  timeAgo: string;
  isVerifiedHost: boolean;
}

export interface Booking {
  id: string;
  bookingRef: string;
  travelerUserId: string;
  localProfileId: string;
  experienceId?: string;
  bookingDate: string;
  startTime?: string;
  durationHours: number;
  guestCount: number;
  totalAmount: number;
  escrowStatus: string;
  status: 'PENDING' | 'ACCEPTED' | 'PAID' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  local?: LocalFriend;
  experience?: Experience;
}

export interface VerificationApplication {
  id: string;
  userId: string;
  user?: { id: string; name: string; email: string; avatar: string };
  city: string;
  country: string;
  residenceDurationYears: number;
  bio: string;
  idDocumentType: string;
  idDocumentUrl: string;
  proposedExperiencePitch: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}
