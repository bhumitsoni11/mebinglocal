import axios from 'axios';

// Default to localhost:3001 assuming NestJS runs there
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
});

// Since we are using Next.js, we can't easily add Clerk auth hook inside a static file.
// We will rely on passing the token in the React Query hooks or using a higher order function
// if authenticated endpoints are needed. For public endpoints, this is fine.
