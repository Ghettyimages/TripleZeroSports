import { NextResponse } from 'next/server';
import { payloadClient } from '@/lib/payload';
import { siteConfig } from '@/config/site';
import { extractTextFromRichText } from '@/lib/utils';

export async function GET() {
  try {
    const posts = await payloadClient.getPosts({
      limit: 50,
      sort: '-publishedAt',
    });

    const rssItems = posts.docs.map((post) => {
      const author = typeof post.author === 'object' ? post.author : null;
      const plainTextBody = extractTextFromRichText(post.body);
      
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <description><![CDATA[${post.description}]]></description>
          <link>${siteConfig.baseUrl}/post/${post.slug}</link>
          <guid isPermaLink="true">${siteConfig.baseUrl}/post/${post.slug}</guid>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
          ${author ? `<author>${author.name}</author>` : ''}
          <content:encoded><![CDATA[${plainTextBody}]]></content:encoded>
        </item>
      `;
    }).join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteConfig.siteName}</title>
    <description>${siteConfig.description}</description>
    <link>${siteConfig.baseUrl}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en</language>
    <generator>Next.js</generator>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return NextResponse.json(
      { message: 'Failed to generate RSS feed' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600; // 1 hour
