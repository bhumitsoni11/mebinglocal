import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-24 border-t border-surface-container-highest shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-base">explore</span>
              </div>
              <span className="font-headline font-bold text-lg text-on-surface">
                Mebing<span className="text-primary">Local</span>
              </span>
            </Link>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Human-to-human cultural journeys guided by verified local residents.
            </p>
            <div className="flex items-center gap-3 text-on-surface-variant pt-2">
              <a href="#" className="p-2 rounded-full hover:bg-surface-container hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-surface-container hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-surface-container hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-lg">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-wider text-on-surface mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 font-body text-xs text-on-surface-variant">
              <li>
                <Link href="/discover?city=Tokyo" className="hover:text-primary transition-colors">
                  Local Friends in Tokyo
                </Link>
              </li>
              <li>
                <Link href="/discover?city=Kyoto" className="hover:text-primary transition-colors">
                  Local Friends in Kyoto
                </Link>
              </li>
              <li>
                <Link href="/discover?city=Florence" className="hover:text-primary transition-colors">
                  Local Friends in Florence
                </Link>
              </li>
              <li>
                <Link href="/discover?city=Mexico+City" className="hover:text-primary transition-colors">
                  Local Friends in Mexico City
                </Link>
              </li>
              <li>
                <Link href="/discover?city=Lisbon" className="hover:text-primary transition-colors">
                  Local Friends in Lisbon
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-wider text-on-surface mb-4">
              Host with MebingLocal
            </h4>
            <ul className="space-y-2.5 font-body text-xs text-on-surface-variant">
              <li>
                <Link href="/become-a-local" className="hover:text-primary transition-colors">
                  Apply to Host
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary transition-colors">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/become-a-local#calculator" className="hover:text-primary transition-colors">
                  Earnings Calculator
                </Link>
              </li>
              <li>
                <Link href="/become-a-local#faq" className="hover:text-primary transition-colors">
                  Host Protection Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-wider text-on-surface mb-4">
              AI Concierge
            </h4>
            <ul className="space-y-2.5 font-body text-xs text-on-surface-variant">
              <li>
                <Link href="/planner" className="hover:text-primary transition-colors">
                  Personalized Itineraries
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-primary transition-colors">
                  Smart Local Match
                </Link>
              </li>
              <li>
                <Link href="/local-pulse" className="hover:text-primary transition-colors">
                  Neighborhood Radar
                </Link>
              </li>
              <li>
                <Link href="/local-pulse" className="hover:text-primary transition-colors">
                  Live Community Wire
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h4 className="font-headline font-bold uppercase text-xs tracking-wider text-on-surface mb-4">
              Support & Trust
            </h4>
            <ul className="space-y-2.5 font-body text-xs text-on-surface-variant">
              <li>
                <Link href="/safety" className="hover:text-primary transition-colors">
                  Safety Center
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Cancellation Policies
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary transition-colors">
                  Identity Verification
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  24/7 Concierge Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-surface-container-highest flex flex-col md:flex-row items-center justify-between gap-4 font-body text-xs text-on-surface-variant">
          <div className="flex items-center gap-6">
            <span>© 2025 MebingLocal Inc. All rights reserved.</span>
            <a href="#" className="hover:text-on-surface transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-on-surface transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-on-surface transition-colors">
              Sitemap
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">language</span> English (US)
            </span>
            <span>·</span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
