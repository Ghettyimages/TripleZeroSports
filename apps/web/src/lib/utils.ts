import { type ClassValue, clsx } from 'clsx';
import readingTime from 'reading-time';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getReadingTime(content: string): string {
  const stats = readingTime(content);
  return stats.text;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateRelative(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  return formatDate(date);
}

export function getTagColor(tagSlug: string): string {
  const colors: Record<string, string> = {
    culture: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    breakdown: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    deals: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    beyond: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };
  
  return colors[tagSlug] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
}

export function extractTextFromRichText(richText: any): string {
  if (!richText || !richText.content) return '';
  
  function extractText(node: any): string {
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('');
    }
    
    return '';
  }
  
  return richText.content.map(extractText).join(' ');
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

