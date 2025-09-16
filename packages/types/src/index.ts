// Shared types for TripleZeroSports

export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  hero?: Media;
  tags: Tag[];
  author: Author;
  featured: boolean;
  publishedAt: string;
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: Media;
  social?: {
    x?: string;
    instagram?: string;
    site?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  filename: string;
  alt: string;
  url: string;
  width?: number;
  height?: number;
  mimeType: string;
  filesize: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadCollection<T = any> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

export interface WebhookPayload {
  paths: string[];
  secret: string;
}

export interface SiteConfig {
  siteName: string;
  description: string;
  baseUrl: string;
  tagDisplayMapping: Record<string, { name: string; color: string }>;
  nav: {
    label: string;
    href: string;
  }[];
  social: {
    x?: string;
    instagram?: string;
    site?: string;
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
    };
  };
  analytics: {
    ga4Id?: string;
    plausibleDomain?: string;
  };
}

export interface SearchIndex {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  author: string;
  publishedAt: string;
}
