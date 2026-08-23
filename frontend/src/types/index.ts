export interface Companion {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  avatar: string;
  coverPhoto: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  languages: string[];
  interests: string[];
  bio: string;
  verified: boolean;
  womenOnly: boolean;
  responseTime: string;
  completedTours: number;
  availability: string[];
}

export interface Event {
  id: string;
  title: string;
  city: string;
  date: string;
  image: string;
  category: string;
  postedBy: string;
  description: string;
  attendees: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  tripType: string;
  localFriendId: string;
}
