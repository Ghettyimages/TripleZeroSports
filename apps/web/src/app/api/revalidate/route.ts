import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

type RevalidateBody =
  | { paths: string[] }
  | { postSlug?: string; tagSlug?: string };

export async function POST(request: NextRequest) {
  try {
    const secretHeader = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (!expectedSecret || !secretHeader || secretHeader !== expectedSecret) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as RevalidateBody;

    const toRevalidate = new Set<string>(['/', '/rss.xml', '/sitemap.xml']);

    if ('paths' in body && Array.isArray(body.paths)) {
      for (const p of body.paths) {
        if (typeof p === 'string' && p.startsWith('/')) toRevalidate.add(p);
      }
    }

    if ('postSlug' in body && body.postSlug) {
      toRevalidate.add(`/post/${body.postSlug}`);
    }

    if ('tagSlug' in body && body.tagSlug) {
      toRevalidate.add(`/tag/${body.tagSlug}`);
    }

    const revalidatedPaths: string[] = [];
    for (const p of toRevalidate) {
      try {
        revalidatePath(p);
        revalidatedPaths.push(p);
      } catch (err) {
        console.error(`Failed to revalidate path ${p}:`, err);
      }
    }

    return NextResponse.json({ revalidated: true, paths: revalidatedPaths });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

