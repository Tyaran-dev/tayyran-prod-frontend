// ============================
// WordPress REST API Types
// ============================

/** WordPress rendered content field (title, content, excerpt) */
export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

/** WordPress featured media size */
export interface WPMediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

/** WordPress featured media (from _embed) */
export interface WPFeaturedMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WPRendered;
  alt_text: string;
  caption: WPRendered;
  media_details: {
    width: number;
    height: number;
    sizes: Record<string, WPMediaSize>;
  };
  source_url: string;
}

/** WordPress author (from _embed) */
export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

/** WordPress category */
export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: unknown[];
  children?: WPCategory[];
}

/** WordPress term (from _embed) */
export interface WPTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

/** WordPress post with _embed data */
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: WPRendered;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: WPAuthor[];
    'wp:featuredmedia'?: WPFeaturedMedia[];
    'wp:term'?: WPTerm[][];
  };
}

/** Paginated response from WordPress API */
export interface WPPaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalPosts: number;
  currentPage: number;
}

/** RankMath SEO head response */
export interface RankMathSEOHead {
  success: boolean;
  head: string;
}

/** Parsed SEO metadata from RankMath */
export interface ParsedSEOMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: string;
}
