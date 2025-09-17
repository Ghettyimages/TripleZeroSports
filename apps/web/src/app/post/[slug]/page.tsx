import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Clock, Calendar, Share2 } from 'lucide-react';
import { payloadClient } from '@/lib/payload';
import { formatDate, getTagColor, extractTextFromRichText } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { AuthorCard } from '@/components/posts/AuthorCard';
import { PostCard } from '@/components/posts/PostCard';
import { Prose } from '@/components/posts/Prose';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await payloadClient.getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const hero = typeof post.hero === 'object' ? post.hero : null;
  const author = typeof post.author === 'object' ? post.author : null;

  return {
    title: post.title,
    description: post.description,
    authors: author ? [{ name: author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: author ? [author.name] : undefined,
      images: hero ? [
        {
          url: hero.url,
          width: hero.width,
          height: hero.height,
          alt: hero.alt || post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: hero ? [hero.url] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || `${siteConfig.baseUrl}/post/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await payloadClient.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const author = typeof post.author === 'object' ? post.author : null;
  const hero = typeof post.hero === 'object' ? post.hero : null;
  const tags = Array.isArray(post.tags) ? post.tags : [];

  // Get related posts
  const tagIds = tags
    .filter((tag): tag is { id: string } => typeof tag === 'object' && 'id' in tag)
    .map(tag => tag.id);
  
  const relatedPosts = tagIds.length > 0 
    ? await payloadClient.getRelatedPosts(post.id, tagIds, 3)
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: hero ? [hero.url] : [],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: author ? {
      '@type': 'Person',
      name: author.name,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.baseUrl}/post/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="container py-8 lg:py-12">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>

        {/* Article header */}
        <header className="mb-8">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag) => {
                const tagObj = typeof tag === 'object' ? tag : null;
                if (!tagObj) return null;
                
                return (
                  <Link
                    key={tagObj.id}
                    href={`/tag/${tagObj.slug}`}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors hover:opacity-80 ${getTagColor(tagObj.slug)}`}
                  >
                    {tagObj.name}
                  </Link>
                );
              })}
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl xl:text-5xl">
            {post.title}
          </h1>
          
          <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
            {post.description}
          </p>

          {/* Meta info */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center space-x-2">
                <span>By {author.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            {post.readingTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            <button
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.description,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Hero image */}
        {hero && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={hero.url}
              alt={hero.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Article content */}
          <div className="lg:col-span-3">
            <Prose content={post.body} className="mb-8" />

            {/* Author card */}
            {author && (
              <div className="mt-8 pt-8 border-t">
                <AuthorCard author={author} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Ad slot placeholder */}
              <div className="rounded-lg border-2 border-dashed border-muted p-4 text-center text-sm text-muted-foreground">
                Ad Space
              </div>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="border-b pb-4 last:border-b-0">
                        <Link
                          href={`/post/${relatedPost.slug}`}
                          className="block hover:opacity-80"
                        >
                          <h4 className="font-medium text-sm leading-tight">
                            {relatedPost.title}
                          </h4>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {relatedPost.description}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

export const revalidate = 300; // 5 minutes

