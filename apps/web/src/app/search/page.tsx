'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { payloadClient } from '@/lib/payload';
import type { SearchIndex } from '@triplezerosports/types';
import { formatDateRelative, getTagColor } from '@/lib/utils';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<SearchIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load search index
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const index = await payloadClient.getSearchIndex();
        setSearchIndex(index);
      } catch (error) {
        console.error('Failed to load search index:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSearchIndex();
  }, []);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    if (searchIndex.length === 0) return null;

    return new Fuse(searchIndex, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'author', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [searchIndex]);

  // Perform search
  const searchResults = useMemo(() => {
    if (!fuse || !query.trim()) return [];
    
    const results = fuse.search(query);
    return results.map(result => result.item);
  }, [fuse, query]);

  if (isLoading) {
    return (
      <div className="container py-8 lg:py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
          Search
        </h1>

        {/* Search input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        </div>

        {/* Search results */}
        <div className="space-y-6">
          {query.trim() === '' ? (
            <div className="text-center text-muted-foreground">
              <p>Enter a search term to find posts</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No posts found for "{query}"</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Found {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for "{query}"
              </p>
              
              {searchResults.map((post) => (
                <article
                  key={post.id}
                  className="rounded-lg border bg-background p-6 transition-all hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div>
                      <h2 className="text-lg font-semibold leading-tight">
                        <Link
                          href={`/post/${post.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="mt-2 text-muted-foreground">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <time dateTime={post.publishedAt}>
                        {formatDateRelative(post.publishedAt)}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
