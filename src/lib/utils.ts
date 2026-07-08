// ============================
// Blog utility functions
// ============================

/**
 * Strip HTML tags from a string.
 * Used for generating clean excerpts and meta descriptions.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Estimate reading time from HTML content.
 * Uses ~200 words per minute for Arabic text (slightly slower reading speed).
 */
export function estimateReadingTime(html: string): number {
  const text = stripHtml(html);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);
  return Math.max(1, readingTime);
}

/**
 * Format a date string for display.
 * Supports Arabic and English locales.
 */
export function formatDate(dateString: string, locale: string = 'ar'): string {
  const date = new Date(dateString);
  const localeMap: Record<string, string> = {
    ar: 'ar-SA',
    en: 'en-US',
  };

  return date.toLocaleDateString(localeMap[locale] || 'ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Decode a URL-encoded WordPress slug.
 * WordPress encodes Arabic slugs as percent-encoded strings.
 */
export function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/**
 * Extract a clean excerpt from WordPress content.
 * Falls back to stripping HTML from content if no excerpt is provided.
 */
export function getExcerpt(content: string, maxLength: number = 160): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

/**
 * Get the featured image URL from a WordPress post's embedded data.
 * Falls back to a default placeholder.
 */
export function getFeaturedImageUrl(post: {
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details: {
        sizes: Record<string, { source_url: string }>;
      };
    }>;
  };
}, size: string = 'full'): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return '/assets/images/blog-placeholder.jpg';

  const requestedSize = media.media_details?.sizes?.[size];
  if (requestedSize) return requestedSize.source_url;

  return media.source_url || '/assets/images/blog-placeholder.jpg';
}

/**
 * Get the author info from a WordPress post's embedded data.
 */
export function getAuthor(post: {
  _embedded?: {
    author?: Array<{
      name: string;
      avatar_urls: Record<string, string>;
      description: string;
    }>;
  };
}): { name: string; avatar: string; bio: string } {
  const author = post._embedded?.author?.[0];
  return {
    name: author?.name || 'طيران',
    avatar: author?.avatar_urls?.['96'] || author?.avatar_urls?.['48'] || '',
    bio: author?.description || '',
  };
}

/**
 * Get post categories from embedded data.
 */
export function getPostCategories(post: {
  _embedded?: {
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.['wp:term']?.[0];
  if (!terms) return [];
  return terms
    .filter((term) => term.taxonomy === 'category')
    .map((term) => ({
      id: term.id,
      name: term.name,
      slug: decodeSlug(term.slug),
    }));
}

/**
 * Generate initials from a name for avatar fallback.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name[0] || 'T').toUpperCase();
}
