import { Metadata } from 'next';
import { getPosts, getCategories } from '@/lib/wordpress';
import { generateOrganizationJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import BlogHero from '@/app/components/blog/BlogHero';
import CategoryTabs from '@/app/components/blog/CategoryTabs';
import FeaturedPost from '@/app/components/blog/FeaturedPost';
import PostGrid from '@/app/components/blog/PostGrid';
import Pagination from '@/app/components/blog/Pagination';
import Newsletter from '@/app/components/blog/Newsletter';

export const metadata: Metadata = {
  title: 'مجلة طيران | وجهات سياحية ونصائح سفر',
  description: 'اكتشف أجمل الوجهات السياحية، وأهم نصائح السفر، وآخر أخبار الطيران مع مجلة طيران الشاملة.',
};

export default async function BlogPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const perPage = 9;

  // Fetch data in parallel
  const [postsResponse, categories] = await Promise.all([
    getPosts(currentPage, perPage),
    getCategories(),
  ]);

  const { data: posts, totalPages } = postsResponse;

  // First page shows the first post as featured, and the rest in the grid
  const isFirstPage = currentPage === 1;
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;
  const gridPosts = isFirstPage ? posts.slice(1) : posts;

  // SEO JSON-LD
  const jsonLdOrg = generateOrganizationJsonLd();
  const jsonLdBreadcrumb = generateBreadcrumbJsonLd([
    { name: 'الرئيسية', url: 'https://tayyran.com/' },
    { name: 'المدونة', url: 'https://tayyran.com/blog' },
  ]);

  return (
    <main className="bg-blog-bg min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <BlogHero />
      <CategoryTabs categories={categories} />

      {featuredPost && <FeaturedPost post={featuredPost} />}

      {isFirstPage ? (
        gridPosts.length > 0 && (
          <PostGrid posts={gridPosts} title={isFirstPage ? 'أحدث المقالات' : `المقالات (صفحة ${currentPage})`} />
        )
      ) : (
        <PostGrid posts={gridPosts} title={isFirstPage ? 'أحدث المقالات' : `المقالات (صفحة ${currentPage})`} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/blog"
      />

      <div className="container mx-auto px-4 mt-20">
        <Newsletter />
      </div>
    </main>
  );
}
