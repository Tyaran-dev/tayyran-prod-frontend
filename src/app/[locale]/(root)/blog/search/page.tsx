import { Metadata } from 'next';
import { searchPosts, getCategories } from '@/lib/wordpress';
import BlogHero from '@/app/components/blog/BlogHero';
import CategoryTabs from '@/app/components/blog/CategoryTabs';
import PostGrid from '@/app/components/blog/PostGrid';
import Pagination from '@/app/components/blog/Pagination';
import Newsletter from '@/app/components/blog/Newsletter';

export const metadata: Metadata = {
  title: 'نتائج البحث | مجلة طيران',
  description: 'ابحث عن مقالات، وجهات، ونصائح سفر في مجلة طيران.',
};

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const currentPage = Number(searchParams.page) || 1;
  const perPage = 9;

  // If no query, we just show 0 results
  const [postsResponse, categories] = await Promise.all([
    query ? searchPosts(query, currentPage, perPage) : Promise.resolve({ data: [], totalPages: 0, totalPosts: 0, currentPage }),
    getCategories(),
  ]);

  const { data: posts, totalPages, totalPosts } = postsResponse;

  return (
    <main className="bg-blog-bg min-h-screen pb-20">
      <BlogHero />
      <CategoryTabs categories={categories} />

      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-xl text-gray-600 border-r-4 border-blog-primary pr-3">
          {query 
            ? `نتائج البحث عن: "${query}" (${totalPosts} مقال)` 
            : 'يرجى إدخال كلمة للبحث'}
        </h2>
      </div>

      <PostGrid posts={posts} />
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        baseUrl={`/blog/search?q=${encodeURIComponent(query)}`} 
      />

      <div className="container mx-auto px-4 mt-20">
        <Newsletter />
      </div>
    </main>
  );
}
