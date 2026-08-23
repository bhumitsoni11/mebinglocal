import axios from 'axios';

// Default to localhost:3001 assuming NestJS runs there
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
});

// Intercept requests to inject Clerk JWT automatically
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    // Access the global Clerk object mounted by <ClerkProvider>
    const clerk = (window as any).Clerk;
    if (clerk && clerk.session) {
      try {
        const token = await clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to retrieve Clerk token:', error);
      }
    }
  }
  return config;
});

