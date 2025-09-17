const base = process.env.PAYLOAD_URL || 'http://localhost:3001'; // e.g., https://triplezerosports-cms.onrender.com

export type Post = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  hero?: string;
  featured?: boolean;
  publishedAt?: string;
  tags?: string[];
};

export async function fetchPosts(): Promise<Post[]> {
  // Return empty array during build if no PAYLOAD_URL is set
  if (!process.env.PAYLOAD_URL && process.env.NODE_ENV !== 'development') {
    return [];
  }
  
  try {
    // Public read of published posts
    const res = await fetch(`${base}/api/posts?limit=10&where[_status][equals]=published`, {
      // cache ISR via Next route config; avoid no-store
      next: { revalidate: 300 }
    });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.warn('Failed to fetch posts:', error);
    return [];
  }
}