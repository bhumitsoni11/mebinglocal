import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Clerk JWT
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      try {
        const token = await clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Failed to retrieve Clerk token:', err);
      }
    }
  }
  return config;
});

// Interceptor for response handling
api.interceptors.response.use(
  (response) => {
    // If backend uses TransformInterceptor returning { success: true, data: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);
