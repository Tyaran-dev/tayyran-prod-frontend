import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByCategory, getCategoryBySlug, getCategories } from '@/lib/wordpress';
import BlogHero from '@/app/components/blog/BlogHero';
import CategoryTabs from '@/app/components/blog/CategoryTabs';
import PostGrid from '@/app/components/blog/PostGrid';
import Pagination from '@/app/components/blog/Pagination';
import Newsletter from '@/app/components/blog/Newsletter';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);
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
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const decodedSlug = decodeURIComponent(params.slug);
  const currentPage = Number(searchParams.page) || 1;
  const perPage = 9;

  // Fetch category first to get its ID
  const category = await getCategoryBySlug(decodedSlug);

  if (!category) {
    notFound();
  }

  // Fetch data in parallel
  const [postsResponse, allCategories] = await Promise.all([
    getPostsByCategory(category.id, currentPage, perPage),
    getCategories(),
  ]);

  const { data: posts, totalPages } = postsResponse;

  return (
    <main className="bg-blog-bg min-h-screen pb-20">
      <BlogHero />
      <CategoryTabs categories={allCategories} activeSlug={decodedSlug} />

      <PostGrid 
        posts={posts} 
        title={`مقالات في: ${category.name}`} 
      />
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        baseUrl={`/blog/category/${category.slug}`} 
      />

      <div className="container mx-auto px-4 mt-20">
        <Newsletter />
      </div>
    </main>
  );
}
