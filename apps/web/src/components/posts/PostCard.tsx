import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@triplezerosports/types';
import { formatDateRelative, getTagColor } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  featured?: boolean;
  className?: string;
}

export function PostCard({ post, featured = false, className = '' }: PostCardProps) {
  const author = typeof post.author === 'object' ? post.author : null;
  const hero = typeof post.hero === 'object' ? post.hero : null;

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md ${className}`}>
      {hero && (
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          <Image
            src={hero.url}
            alt={hero.alt || post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes={featured ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'}
          />
        </div>
      )}
      
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          {/* Tags */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => {
                const tagObj = typeof tag === 'object' ? tag : null;
                if (!tagObj) return null;
                
                return (
                  <Link
                    key={tagObj.id}
                    href={`/tag/${tagObj.slug}`}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80 ${getTagColor(tagObj.slug)}`}
                  >
                    {tagObj.name}
                  </Link>
                );
              })}
            </div>
          )}

          <div>
            <h3 className={`font-semibold leading-tight text-foreground ${featured ? 'text-xl lg:text-2xl' : 'text-lg'}`}>
              <Link href={`/post/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            
            <p className={`mt-2 text-muted-foreground ${featured ? 'text-base' : 'text-sm'}`}>
              {post.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            {author && (
              <>
                <span>{author.name}</span>
                <span>•</span>
              </>
            )}
            <time dateTime={post.publishedAt}>
              {formatDateRelative(post.publishedAt)}
            </time>
          </div>
          
          {post.readingTime && (
            <span>{post.readingTime} min read</span>
          )}
        </div>
      </div>
    </article>
  );
}
