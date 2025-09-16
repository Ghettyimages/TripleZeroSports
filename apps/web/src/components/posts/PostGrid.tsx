import type { Post } from '@triplezerosports/types';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: Post[];
  className?: string;
}

export function PostGrid({ posts, className = '' }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
