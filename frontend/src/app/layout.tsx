import type { Metadata } from "next";
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "sonner";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "MebingLocal",
  description: "Find your local companions and events.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className="antialiased font-sans bg-background text-foreground">
          <Providers>
            {userId && (
              <div className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md border border-gray-200">
                <UserButton />
              </div>
            )}
            {children}
            <Toaster />
          </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
