import { Suspense } from 'react';
import { payloadClient } from '@/lib/payload';
import { Hero } from '@/components/posts/Hero';
import { TagRow } from '@/components/posts/TagRow';
import { PostGrid } from '@/components/posts/PostGrid';

async function FeaturedSection() {
  const featuredPosts = await payloadClient.getFeaturedPosts(3);
  return <Hero featuredPosts={featuredPosts} />;
}

async function LatestSection() {
  const latestPosts = await payloadClient.getPosts({
    limit: 6,
    sort: '-publishedAt',
    where: { featured: { not_equals: true } },
  });

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Latest</h2>
        <PostGrid posts={latestPosts.docs} />
      </div>
    </section>
  );
}

async function TagSection({ tagSlug, tagName }: { tagSlug: string; tagName: string }) {
  const posts = await payloadClient.getPostsByTag(tagSlug, { limit: 3 });
  
  if (posts.docs.length === 0) {
    return null;
  }

  return <TagRow tagName={tagName} tagSlug={tagSlug} posts={posts.docs} />;
}

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<div className="container py-8">Loading featured posts...</div>}>
        <FeaturedSection />
      </Suspense>

      <Suspense fallback={<div className="container py-8">Loading latest posts...</div>}>
        <LatestSection />
      </Suspense>

      <div className="border-t">
        <Suspense fallback={<div className="container py-8">Loading culture posts...</div>}>
          <TagSection tagSlug="culture" tagName="Culture" />
        </Suspense>

        <Suspense fallback={<div className="container py-8">Loading breakdown posts...</div>}>
          <TagSection tagSlug="breakdown" tagName="Breakdown" />
        </Suspense>

        <Suspense fallback={<div className="container py-8">Loading deals posts...</div>}>
          <TagSection tagSlug="deals" tagName="Deals" />
        </Suspense>

        <Suspense fallback={<div className="container py-8">Loading beyond posts...</div>}>
          <TagSection tagSlug="beyond" tagName="Beyond" />
        </Suspense>
      </div>
    </div>
  );
}

export const revalidate = 300; // 5 minutes

