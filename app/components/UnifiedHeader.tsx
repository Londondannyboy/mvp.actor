'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/app/lib/auth/client';

interface NavItem {
  label: string;
  href: string;
}

interface UnifiedHeaderProps {
  activeSite: 'events' | 'production' | 'jobs' | 'news';
  siteNavItems?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

const SITE_CONFIG = {
  events: {
    name: 'ESPORTS INSURANCE',
    logoText: 'E',
  },
  production: {
    name: 'ESPORTS PRODUCTION',
    logoText: 'EP',
  },
  jobs: {
    name: 'ESPORTS RECRUITMENT',
    logoText: 'ER',
  },
  news: {
    name: 'ESPORTS NEWS',
    logoText: 'EN',
  },
};

const SITE_TABS = [
  { id: 'events' as const, label: 'Events', href: 'https://esportsevent.quest' },
  { id: 'production' as const, label: 'Production', href: 'https://esportsproduction.quest' },
  { id: 'jobs' as const, label: 'Jobs', href: 'https://esportsjobs.quest' },
  { id: 'news' as const, label: 'News', href: 'https://esportsnews.quest' },
];

// Global navigation items for the jobs site - use this on ALL pages
export const JOBS_SITE_NAV_ITEMS = [
  { label: 'My Quest', href: '/profile' },
  { label: 'Esports Jobs', href: '/esports-jobs' },
  { label: 'Career Guides', href: '/esports-careers' },
  { label: 'News', href: '/esports-news' },
];

export function UnifiedHeader({
  activeSite,
  siteNavItems = [],
  ctaLabel = 'Get Started',
  ctaHref = '/contact',
}: UnifiedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentSite = SITE_CONFIG[activeSite];
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0];

  // Check if a nav item is active based on current path
  const isNavItemActive = (href: string) => {
    if (href.startsWith('#')) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single unified nav row */}
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-lg">
              {currentSite.logoText}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-cyan-400 font-medium tracking-wider uppercase">
                ESPORTS QUEST
              </span>
              <span className="text-lg font-bold neon-text leading-tight">
                {currentSite.name}
              </span>
            </div>
          </a>

          {/* Desktop nav links - Combined */}
          <div className="hidden md:flex items-center gap-6">
            {siteNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`text-sm transition-colors ${
                  isNavItemActive(item.href)
                    ? 'text-cyan-400 font-medium'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + Auth + Mobile menu toggle */}
          <div className="flex items-center gap-4">
            {/* Auth button */}
            {!isPending && (
              user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    Hey, <span className="text-cyan-400 font-medium">{firstName}</span>
                  </Link>
                  <button
                    onClick={() => authClient.signOut()}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="hidden sm:block text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Sign In
                </Link>
              )
            )}

            <Link
              href={ctaHref}
              className="hidden sm:block bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded btn-shine transition-all"
            >
              {ctaLabel}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 py-4 space-y-2">
            {siteNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm transition-colors rounded ${
                  isNavItemActive(item.href)
                    ? 'text-cyan-400 bg-cyan-500/10 font-medium'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 px-4 space-y-2">
              {/* Mobile Auth */}
              {!isPending && (
                user ? (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300">
                      Hey, <span className="text-cyan-400 font-medium">{firstName}</span>
                    </span>
                    <button
                      onClick={() => {
                        authClient.signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-medium py-2 px-6 rounded transition-all"
                  >
                    Sign In
                  </Link>
                )
              )}
              <Link
                href={ctaHref}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded transition-all"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
