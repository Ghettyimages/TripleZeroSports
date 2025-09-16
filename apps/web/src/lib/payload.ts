import type { Post, Tag, Author, PayloadCollection } from '@triplezerosports/types';

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001';

export class PayloadClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${PAYLOAD_URL}/api`;
  }

  private async fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: {
        revalidate: 300, // 5 minutes default
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    return response.json();
  }

  // Posts
  async getPosts(options?: {
    limit?: number;
    page?: number;
    where?: any;
    sort?: string;
  }): Promise<PayloadCollection<Post>> {
    const params = new URLSearchParams();
    
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.page) params.append('page', options.page.toString());
    if (options?.sort) params.append('sort', options.sort);
    if (options?.where) {
      params.append('where', JSON.stringify({
        _status: { equals: 'published' },
        ...options.where,
      }));
    } else {
      params.append('where', JSON.stringify({ _status: { equals: 'published' } }));
    }

    const query = params.toString();
    return this.fetchData<PayloadCollection<Post>>(`/posts${query ? `?${query}` : ''}`);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const response = await this.fetchData<PayloadCollection<Post>>(
        `/posts?where=${encodeURIComponent(JSON.stringify({
          slug: { equals: slug },
          _status: { equals: 'published' }
        }))}&limit=1`
      );
      return response.docs[0] || null;
    } catch {
      return null;
    }
  }

  async getFeaturedPosts(limit = 3): Promise<Post[]> {
    const response = await this.getPosts({
      where: { featured: { equals: true } },
      limit,
      sort: '-publishedAt',
    });
    return response.docs;
  }

  async getPostsByTag(tagSlug: string, options?: { limit?: number; page?: number }): Promise<PayloadCollection<Post>> {
    return this.getPosts({
      where: {
        'tags.slug': { in: [tagSlug] },
      },
      ...options,
      sort: '-publishedAt',
    });
  }

  async getRelatedPosts(postId: string, tagIds: string[], limit = 3): Promise<Post[]> {
    const response = await this.getPosts({
      where: {
        id: { not_equals: postId },
        'tags.id': { in: tagIds },
      },
      limit,
      sort: '-publishedAt',
    });
    return response.docs;
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const response = await this.fetchData<PayloadCollection<Tag>>('/tags?limit=100');
    return response.docs;
  }

  async getTagBySlug(slug: string): Promise<Tag | null> {
    try {
      const response = await this.fetchData<PayloadCollection<Tag>>(
        `/tags?where=${encodeURIComponent(JSON.stringify({ slug: { equals: slug } }))}&limit=1`
      );
      return response.docs[0] || null;
    } catch {
      return null;
    }
  }

  // Authors
  async getAuthors(): Promise<Author[]> {
    const response = await this.fetchData<PayloadCollection<Author>>('/authors?limit=100');
    return response.docs;
  }

  async getAuthorBySlug(slug: string): Promise<Author | null> {
    try {
      const response = await this.fetchData<PayloadCollection<Author>>(
        `/authors?where=${encodeURIComponent(JSON.stringify({ slug: { equals: slug } }))}&limit=1`
      );
      return response.docs[0] || null;
    } catch {
      return null;
    }
  }

  // Search index
  async getSearchIndex(): Promise<any[]> {
    const response = await this.getPosts({ limit: 1000 });
    return response.docs.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      tags: Array.isArray(post.tags) ? post.tags.map((tag: any) => tag.name || tag) : [],
      author: typeof post.author === 'object' ? post.author.name : post.author,
      publishedAt: post.publishedAt,
    }));
  }
}

export const payloadClient = new PayloadClient();
