import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/experiences(.*)',
  '/local-friends(.*)',
  '/local-pulse(.*)',
  '/about',
  '/how-it-works',
  '/api/webhooks(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // To protect admin routes, you would typically check the user's role here
  // by retrieving it from their public metadata or database.
  // if (isAdminRoute(request) && auth().sessionClaims?.metadata?.role !== 'ADMIN') {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
