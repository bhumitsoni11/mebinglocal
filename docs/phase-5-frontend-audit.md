# Phase 5 Frontend Audit

## 1. Existing Pages
- `src/app/page.tsx` (Renders Landing.tsx)
- `src/app/(auth)/sign-in` and `src/app/(auth)/sign-up` (Basic Next.js Clerk integration)
- The majority of the application pages do not have mapped Next.js routes. They are stored as standalone React components inside `src/features/`.

## 2. Existing Components
- `src/features/*`: Contains complex UI screens (Landing, Discover, Profile, Safety, etc.) built from Figma designs.
- `src/components/ui/*`: Contains Shadcn UI primitives.
- `src/components/layout/*`: Standard layouts (Navbar, Footer).

## 3. Existing Routes
- The `src/app/` structure is largely empty for functional routes (`(admin)`, `(companion)`, `(public)`, `(traveler)` exist but contain no `page.tsx` files).
- We must build out the Next.js `app/` routing architecture logically based on the features.

## 4. Existing Mock Data
- Since the UI components (like `Discover.tsx`, `Profile.tsx`) are currently static prototypes, they contain hardcoded placeholder mock data for Local Friends, reviews, events, and experiences.

## 5. Existing API Calls
- `src/lib/api.ts` provides a base Axios instance.
- However, there are no existing functional API calls or hooks using the backend endpoints.

## 6. Existing Authentication
- Next.js is wrapped with `<ClerkProvider>` in `layout.tsx`.
- The Axios interceptor (`src/lib/api.ts`) incorrectly relies on a manual Zustand `useAuthStore` token instead of Clerk's dynamically retrieved JWT (`await auth().getToken()`).

## 7. Existing State Management
- **TanStack Query**: Setup in `Providers.tsx`, but unused.
- **Zustand**: Setup for `auth`, `booking`, `preferences`, and `theme`. Auth needs refactoring, while booking/preferences can be kept for client-side multi-step flows.

## 8. Missing Integrations
- All dynamic data fetching and backend APIs (`/api/v1/*`).
- Clerk Session Token injection into Axios.
- Razorpay frontend checkout integration.
- AI Assistant chat and Local Friend matching UI.
- Cloudinary Uploads UI.
- Google Maps rendering for locations.

## 9. Broken UI Flows
- Navigation is currently disconnected (many links are `href="#"`).
- Booking flows and forms lack real submit handlers and validation.

## 10. Required Changes
1. **Routing Strategy**: Map `src/features` into real Next.js `app/` routes.
2. **Auth Integration**: Update `lib/api.ts` to use Clerk `useAuth` JWTs.
3. **Data Fetching**: Replace mock data with React Query hooks connected to the NestJS backend.
4. **State Management Clean-up**: Remove global server state from Zustand; rely on TanStack Query.
5. **Interactive UI**: Add loading, error, and empty states.
