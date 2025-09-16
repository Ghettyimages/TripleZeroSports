import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@triplezerosports/types';

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const avatar = typeof author.avatar === 'object' ? author.avatar : null;

  return (
    <div className="flex items-center space-x-4 rounded-lg border bg-muted/50 p-4">
      {avatar ? (
        <div className="relative h-12 w-12 rounded-full overflow-hidden">
          <Image
            src={avatar.url}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="text-sm font-medium">
            {author.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {author.name}
        </p>
        {author.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {author.bio}
          </p>
        )}
        
        {author.social && (
          <div className="mt-2 flex space-x-3">
            {author.social.x && (
              <Link
                href={`https://x.com/${author.social.x}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                X
              </Link>
            )}
            {author.social.instagram && (
              <Link
                href={`https://instagram.com/${author.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Instagram
              </Link>
            )}
            {author.social.site && (
              <Link
                href={author.social.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Website
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
