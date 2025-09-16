import type { SiteConfig } from '@triplezerosports/types';

export const siteConfig: SiteConfig = {
  siteName: 'TripleZeroSports',
  description: 'Your ultimate destination for sports news, analysis, and culture.',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  tagDisplayMapping: {
    culture: { name: 'Culture', color: 'blue' },
    breakdown: { name: 'Breakdown', color: 'green' },
    deals: { name: 'Deals', color: 'red' },
    beyond: { name: 'Beyond', color: 'purple' },
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Culture', href: '/tag/culture' },
    { label: 'Breakdown', href: '/tag/breakdown' },
    { label: 'Deals', href: '/tag/deals' },
    { label: 'Beyond', href: '/tag/beyond' },
    { label: 'About', href: '/about' },
  ],
  social: {
    x: 'triplezerosports',
    instagram: 'triplezerosports',
    site: 'https://triplezerosports.com',
  },
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
    },
  },
  analytics: {
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },
};
