import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MebingLocal — Meet the People Who Know the Place",
  description:
    "Connect with verified local friends around the world for authentic, unscripted travel experiences and personalized cultural journeys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#a83223",
          colorText: "#181d1a",
          colorBackground: "#ffffff",
          colorInputBackground: "#f0f5f0",
          borderRadius: "0.5rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        },
      }}
    >
      <html lang="en" className="scroll-smooth">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-background text-on-surface antialiased font-body flex flex-col min-h-screen">
          <QueryProvider>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
