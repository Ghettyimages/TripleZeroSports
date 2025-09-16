import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { payloadClient } from '@/lib/payload';
import { siteConfig } from '@/config/site';
import { PostGrid } from '@/components/posts/PostGrid';

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await payloadClient.getTagBySlug(params.slug);

  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `${tag.name} Posts`,
    description: tag.description || `Browse all posts tagged with ${tag.name}`,
    openGraph: {
      title: `${tag.name} Posts`,
      description: tag.description || `Browse all posts tagged with ${tag.name}`,
      type: 'website',
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tag = await payloadClient.getTagBySlug(params.slug);

  if (!tag) {
    notFound();
  }

  const currentPage = Number(searchParams.page) || 1;
  const postsPerPage = 12;

  const posts = await payloadClient.getPostsByTag(params.slug, {
    page: currentPage,
    limit: postsPerPage,
  });

  const totalPages = posts.totalPages;
  const hasNextPage = posts.hasNextPage;
  const hasPrevPage = posts.hasPrevPage;

  return (
    <div className="container py-8 lg:py-12">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to home
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {tag.name}
        </h1>
        {tag.description && (
          <p className="mt-2 text-lg text-muted-foreground">
            {tag.description}
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.totalDocs} {posts.totalDocs === 1 ? 'post' : 'posts'}
        </p>
      </header>

      {/* Posts grid */}
      <PostGrid posts={posts.docs} className="mb-8" />

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center space-x-2">
          {hasPrevPage && (
            <Link
              href={`/tag/${params.slug}${currentPage - 1 > 1 ? `?page=${currentPage - 1}` : ''}`}
              className="rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground ring-1 ring-border hover:bg-muted"
            >
              Previous
            </Link>
          )}

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isCurrentPage = page === currentPage;
              return (
                <Link
                  key={page}
                  href={`/tag/${params.slug}${page > 1 ? `?page=${page}` : ''}`}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isCurrentPage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground ring-1 ring-border hover:bg-muted'
                  }`}
                >
                  {page}
                </Link>
              );
            })}
          </div>

          {hasNextPage && (
            <Link
              href={`/tag/${params.slug}?page=${currentPage + 1}`}
              className="rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground ring-1 ring-border hover:bg-muted"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

export const revalidate = 300; // 5 minutes
