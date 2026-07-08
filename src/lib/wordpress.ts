// ============================
// WordPress REST API Client
// ============================

import type {
  WPPost,
  WPCategory,
  WPPaginatedResponse,
} from '@/types/wordpress';

const WP_API_BASE = 'https://articles.tayyran.com/wp-json/wp/v2';

/** Default fetch options with ISR revalidation */
const fetchOptions: RequestInit = {
  next: { revalidate: 300 },
};

/**
 * Fetch posts with pagination.
 */
export async function getPosts(
  page: number = 1,
  perPage: number = 9
): Promise<WPPaginatedResponse<WPPost>> {
  const url = `${WP_API_BASE}/posts?_embed&page=${page}&per_page=${perPage}`;

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      if (res.status === 400) {
        // WordPress returns 400 when page exceeds total pages
        return { data: [], totalPages: 0, totalPosts: 0, currentPage: page };
      }
      throw new Error(`WordPress API error: ${res.status}`);
    }

    const data: WPPost[] = await res.json();
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0', 10);

    return { data, totalPages, totalPosts, currentPage: page };
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { data: [], totalPages: 0, totalPosts: 0, currentPage: page };
  }
}

/**
 * Fetch a single post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const encodedSlug = encodeURIComponent(slug);
  const url = `${WP_API_BASE}/posts?slug=${encodedSlug}&_embed`;

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);

    const data: WPPost[] = await res.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Failed to fetch post by slug:', error);
    return null;
  }
}

/**
 * Fetch all categories with hierarchy.
 */
export async function getCategories(): Promise<WPCategory[]> {
  const url = `${WP_API_BASE}/categories?per_page=100&orderby=count&order=desc`;

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);

    const categories: WPCategory[] = await res.json();

    // Filter out "Uncategorized"
    const filtered = categories.filter(
      (cat) => cat.slug !== 'uncategorized' && cat.name !== 'Uncategorized'
    );

    // Build hierarchy: attach children to parents
    const parentCategories = filtered.filter((cat) => cat.parent === 0);
    const childCategories = filtered.filter((cat) => cat.parent !== 0);

    return parentCategories.map((parent) => ({
      ...parent,
      children: childCategories.filter((child) => child.parent === parent.id),
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Fetch a category by its slug.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<WPCategory | null> {
  const encodedSlug = encodeURIComponent(slug);
  const url = `${WP_API_BASE}/categories?slug=${encodedSlug}`;

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);

    const data: WPCategory[] = await res.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Failed to fetch category by slug:', error);
    return null;
  }
}

/**
 * Fetch posts by category ID with pagination.
 */
export async function getPostsByCategory(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WPPaginatedResponse<WPPost>> {
  const url = `${WP_API_BASE}/posts?_embed&categories=${categoryId}&page=${page}&per_page=${perPage}`;

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      if (res.status === 400) {
        return { data: [], totalPages: 0, totalPosts: 0, currentPage: page };
      }
      throw new Error(`WordPress API error: ${res.status}`);
    }

    const data: WPPost[] = await res.json();
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0', 10);

    return { data, totalPages, totalPosts, currentPage: page };
  } catch (error) {
    console.error('Failed to fetch posts by category:', error);
    return { data: [], totalPages: 0, totalPosts: 0, currentPage: page };
  }
}

/**
 * Fetch related posts by category IDs, excluding the current post.
 */
export async function getRelatedPosts(
  categoryIds: number[],
  currentPostId: number,
  limit: number = 3
): Promise<WPPost[]> {
  if (categoryIds.length === 0) return [];

  const categoriesParam = categoryIds.join(',');
  const url = `${WP_API_BASE}/posts?_embed&categories=${categoriesParam}&exclude=${currentPostId}&per_page=${limit}`;

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch related posts:', error);
    return [];
  }
}

/**
 * Search posts by query string.
 */
export async function searchPosts(
  query: string,
  page: number = 1,
  perPage: number = 9
): Promise<WPPaginatedResponse<WPPost>> {
  const url = `${WP_API_BASE}/posts?_embed&search=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      if (res.status === 400) {
        return { data: [], totalPages: 0, totalPosts: 0, currentPage: page };
      }
      throw new Error(`WordPress API error: ${res.status}`);
    }

    const data: WPPost[] = await res.json();
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0', 10);

    return { data, totalPages, totalPosts, currentPage: page };
  } catch (error) {
    console.error('Failed to search posts:', error);
    return { data: [], totalPages: 0, totalPosts: 0, currentPage: page };
  }
}

/**
 * Fetch adjacent posts (previous/next) based on date.
 * Returns { previous, next } where each is a WPPost or null.
 */
export async function getAdjacentPosts(
  date: string,
  currentSlug: string
): Promise<{ previous: WPPost | null; next: WPPost | null }> {
  try {
    const [prevRes, nextRes] = await Promise.all([
      fetch(
        `${WP_API_BASE}/posts?_embed&before=${date}&per_page=1&exclude_slug=${currentSlug}&orderby=date&order=desc`,
        fetchOptions
      ),
      fetch(
        `${WP_API_BASE}/posts?_embed&after=${date}&per_page=1&exclude_slug=${currentSlug}&orderby=date&order=asc`,
        fetchOptions
      ),
    ]);

    const prevData: WPPost[] = prevRes.ok ? await prevRes.json() : [];
    const nextData: WPPost[] = nextRes.ok ? await nextRes.json() : [];

    return {
      previous: prevData.length > 0 ? prevData[0] : null,
      next: nextData.length > 0 ? nextData[0] : null,
    };
  } catch (error) {
    console.error('Failed to fetch adjacent posts:', error);
    return { previous: null, next: null };
  }
}

/**
 * Fetch latest posts (for sidebar).
 */
export async function getLatestPosts(
  limit: number = 5,
  excludeId?: number
): Promise<WPPost[]> {
  const excludeParam = excludeId ? `&exclude=${excludeId}` : '';
  const url = `${WP_API_BASE}/posts?_embed&per_page=${limit}${excludeParam}`;

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch latest posts:', error);
    return [];
  }
}
