import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import type { WPCategory } from '@/types/wordpress';
import { getAllPostsByCategoryIds, getCategoryBySlug, getCategories, getPostBySlug } from '@/lib/wordpress';
import { getPostCategories } from '@/lib/utils';
import BlogHero from '@/app/components/blog/BlogHero';
import CategoryTabs from '@/app/components/blog/CategoryTabs';
import PostGrid from '@/app/components/blog/PostGrid';
import Pagination from '@/app/components/blog/Pagination';
import Newsletter from '@/app/components/blog/Newsletter';
import RecentPosts from '@/app/components/blog/RecentPosts';

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.category);
  const category = await getCategoryBySlug(decodedSlug);

  if (!category) {
    return { title: 'تصنيف غير موجود | مجلة طيران' };
  }

  return {
    title: `${category.name} | مجلة طيران`,
    description: category.description || `تصفح أحدث المقالات في تصنيف ${category.name} على مجلة طيران.`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const decodedSlug = decodeURIComponent(params.category);
  const currentPage = Number(searchParams.page) || 1;

  // Try to find a matching category first
  const category = await getCategoryBySlug(decodedSlug);

  if (!category) {
    // No category found — check if this slug belongs to a post (legacy /blog/postSlug URL).
    // If so, redirect to the canonical /blog/categorySlug/postSlug URL.
    const post = await getPostBySlug(decodedSlug);
    if (post) {
      const postCategories = getPostCategories(post);
      const primaryCategorySlug = postCategories[0]?.slug || 'uncategorized';
      redirect(`/blog/${primaryCategorySlug}/${decodedSlug}`);
    }

    notFound();
  }

  const allCategories = await getCategories();

  const findCategoryBySlug = (
    categories: WPCategory[],
    slug: string
  ): WPCategory | null => {
    for (const cat of categories) {
      if (cat.slug === slug) return cat;
      if (cat.children) {
        const found = findCategoryBySlug(cat.children, slug);
        if (found) return found;
      }
    }
    return null;
  };

  const collectCategoryAndDescendants = (category: WPCategory): number[] => {
    const ids = [category.id];
    if (category.children) {
      for (const child of category.children) {
        ids.push(...collectCategoryAndDescendants(child));
      }
    }
    return ids;
  };

  const currentCategoryNode = findCategoryBySlug(allCategories, decodedSlug);
  const categoryIds = currentCategoryNode
    ? collectCategoryAndDescendants(currentCategoryNode)
    : [category.id];

  const posts = await getAllPostsByCategoryIds(categoryIds);

  return (
    <main className="bg-blog-bg min-h-screen pb-20">
      <BlogHero />
      <RecentPosts
        posts={posts}
        categories={allCategories}
        currentPage={currentPage}
        totalPages={1}
        featured={false}
        baseUrl={`/blog/${decodedSlug}`}
      />



    </main>
  );
}
