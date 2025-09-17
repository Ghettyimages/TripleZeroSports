import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteConfig.baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

