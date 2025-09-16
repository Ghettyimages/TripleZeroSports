import Link from 'next/link';
import type { Post } from '@triplezerosports/types';
import { PostCard } from './PostCard';
import { ChevronRight } from 'lucide-react';

interface TagRowProps {
  tagName: string;
  tagSlug: string;
  posts: Post[];
}

export function TagRow({ tagName, tagSlug, posts }: TagRowProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{tagName}</h2>
          <Link
            href={`/tag/${tagSlug}`}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
