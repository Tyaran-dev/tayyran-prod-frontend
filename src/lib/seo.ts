import type { Metadata } from 'next';
import type { WPPost, RankMathSEOHead, ParsedSEOMeta } from '@/types/wordpress';
import { stripHtml } from './utils';

const RANKMATH_API_BASE = 'https://articles.tayyran.com/wp-json/rankmath/v1/getHead';
const SITE_URL = 'https://tayyran.com'; // Adjust to your actual domain

/**
 * Fetch SEO metadata from RankMath API.
 */
export async function getRankMathSEO(url: string): Promise<RankMathSEOHead | null> {
  try {
    const res = await fetch(`${RANKMATH_API_BASE}?url=${encodeURIComponent(url)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch RankMath SEO:', error);
    return null;
  }
}

/**
 * Parse HTML head string from RankMath into a structured object.
 */
function parseRankMathHead(headString: string): Partial<ParsedSEOMeta> {
  const meta: Partial<ParsedSEOMeta> = {};
  
  // Very basic regex parsing for key SEO elements
  const titleMatch = headString.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) meta.title = titleMatch[1];

  const descMatch = headString.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (descMatch) meta.description = descMatch[1];

  const canonicalMatch = headString.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
  if (canonicalMatch) meta.canonical = canonicalMatch[1];

  const ogTitleMatch = headString.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
  if (ogTitleMatch) meta.ogTitle = ogTitleMatch[1];

  const ogDescMatch = headString.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
  if (ogDescMatch) meta.ogDescription = ogDescMatch[1];

  const ogImageMatch = headString.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
  if (ogImageMatch) meta.ogImage = ogImageMatch[1];

  return meta;
}

/**
 * Generate Next.js Metadata object for an article.
 */
export async function generateArticleMetadata(post: WPPost): Promise<Metadata> {
  // Try to get RankMath SEO data
  const postUrl = `https://articles.tayyran.com/${post.slug}`;
  const rmData = await getRankMathSEO(postUrl);
  
  let rmParsed: Partial<ParsedSEOMeta> = {};
  if (rmData && rmData.success && rmData.head) {
    rmParsed = parseRankMathHead(rmData.head);
  }

  // Fallbacks
  const title = rmParsed.title || stripHtml(post.title.rendered);
  const description = rmParsed.description || stripHtml(post.excerpt.rendered).substring(0, 160);
  const imageUrl = rmParsed.ogImage || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/assets/images/blog-placeholder.jpg';
  const url = rmParsed.canonical || `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: rmParsed.ogTitle || title,
      description: rmParsed.ogDescription || description,
      url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: rmParsed.twitterTitle || title,
      description: rmParsed.twitterDescription || description,
      images: [imageUrl],
    },
  };
}

/**
 * Generate Article JSON-LD Schema.
 */
export function generateArticleJsonLd(post: WPPost) {
  const title = stripHtml(post.title.rendered);
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `${SITE_URL}/assets/images/blog-placeholder.jpg`;
  const authorName = post._embedded?.author?.[0]?.name || 'Tayraan';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: [imageUrl],
    datePublished: post.date,
    dateModified: post.modified,
    author: [{
      '@type': 'Person',
      name: authorName,
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Tayraan',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/Icon.png`
      }
    }
  };
}

/**
 * Generate Breadcrumb JSON-LD Schema.
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Organization JSON-LD Schema.
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tayraan',
    url: SITE_URL,
    logo: `${SITE_URL}/Icon.png`,
    sameAs: [
      // Add social links here if available
    ]
  };
}
