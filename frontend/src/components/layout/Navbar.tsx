"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Discover", href: "/discover" },
  { label: "Local Friends", href: "/local-friends" },
  { label: "Experiences", href: "/experiences" },
  { label: "AI Planner", href: "/planner" },
  { label: "Local Pulse", href: "/local-pulse" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-surface-container-highest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-lg">explore</span>
          </div>
          <span className="font-headline font-bold text-xl text-on-surface tracking-tight">
            Mebing<span className="text-primary">Local</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-surface-container-low/70 rounded-full border border-surface-container-highest">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 rounded-full font-headline text-xs font-semibold tracking-wide transition-all",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/become-a-local"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-headline text-xs font-bold uppercase tracking-wider transition-colors border border-surface-container-highest"
          >
            Become a Local
          </Link>

          <button
            type="button"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-body text-xs"
          >
            <span className="material-symbols-outlined text-base">language</span>
            <span className="font-semibold">EN · USD</span>
          </button>

          <SignedIn>
            <Link
              href="/app/notifications"
              className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </Link>

            <Link
              href="/app/messages"
              className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
            </Link>

            <div className="pl-1">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-full border border-surface-container-highest shadow-sm",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white font-headline text-xs font-bold uppercase tracking-wider shadow-sm transition-all transform active:scale-95"
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-surface-container-highest px-6 py-4 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-xl font-headline text-sm font-semibold transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-primary text-white"
                    : "text-on-surface hover:bg-surface-container",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/become-a-local"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-primary bg-secondary-container/40 font-headline text-sm font-bold uppercase"
            >
              Become a Local Host
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
