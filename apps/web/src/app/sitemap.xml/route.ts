import { NextResponse } from 'next/server';
import { payloadClient } from '@/lib/payload';
import { siteConfig } from '@/config/site';

export async function GET() {
  try {
    const [posts, tags] = await Promise.all([
      payloadClient.getPosts({ limit: 1000 }),
      payloadClient.getTags(),
    ]);

    const staticUrls = [
      {
        loc: siteConfig.baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: `${siteConfig.baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      },
      {
        loc: `${siteConfig.baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      },
    ];

    const postUrls = posts.docs.map((post) => ({
      loc: `${siteConfig.baseUrl}/post/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: 'weekly',
      priority: '0.8',
    }));

    const tagUrls = tags.map((tag) => ({
      loc: `${siteConfig.baseUrl}/tag/${tag.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.6',
    }));

    const allUrls = [...staticUrls, ...postUrls, ...tagUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return NextResponse.json(
      { message: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600; // 1 hour

