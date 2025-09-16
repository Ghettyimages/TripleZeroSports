import type { Post } from '@triplezerosports/types';
import { PostCard } from './PostCard';

interface HeroProps {
  featuredPosts: Post[];
}

export function Hero({ featuredPosts }: HeroProps) {
  if (featuredPosts.length === 0) {
    return null;
  }

  const [mainPost, ...otherPosts] = featuredPosts;

  return (
    <section className="relative">
      <div className="container py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Main featured post */}
          <div className="lg:col-span-1">
            <PostCard post={mainPost} featured className="h-full" />
          </div>

          {/* Other featured posts */}
          {otherPosts.length > 0 && (
            <div className="space-y-6">
              {otherPosts.slice(0, 2).map((post) => (
                <PostCard key={post.id} post={post} className="lg:flex lg:flex-row lg:space-x-4">
                  {/* Override the layout for secondary featured posts */}
                </PostCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
