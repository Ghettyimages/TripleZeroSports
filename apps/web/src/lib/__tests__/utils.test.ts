import { describe, expect, it } from 'vitest';
import { formatDate, formatDateRelative, getTagColor, generateSlug, truncateText } from '../utils';

describe('utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toBe('January 15, 2024');
    });
  });

  describe('formatDateRelative', () => {
    it('should return "Just now" for very recent dates', () => {
      const now = new Date();
      const result = formatDateRelative(now.toISOString());
      expect(result).toBe('Just now');
    });

    it('should format minutes ago correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatDateRelative(fiveMinutesAgo.toISOString());
      expect(result).toBe('5 minutes ago');
    });
  });

  describe('getTagColor', () => {
    it('should return correct color for known tags', () => {
      expect(getTagColor('culture')).toContain('blue');
      expect(getTagColor('breakdown')).toContain('green');
      expect(getTagColor('deals')).toContain('red');
      expect(getTagColor('beyond')).toContain('purple');
    });

    it('should return default color for unknown tags', () => {
      expect(getTagColor('unknown')).toContain('gray');
    });
  });

  describe('generateSlug', () => {
    it('should generate proper slug from text', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('This is a Test!')).toBe('this-is-a-test');
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('truncateText', () => {
    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe(text);
    });

    it('should truncate long text correctly', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long...');
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });
  });
});

