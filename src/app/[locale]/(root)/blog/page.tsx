import { Metadata } from 'next';
import { getPosts, getCategories, getPostsByCategoryIds } from '@/lib/wordpress';
import { generateOrganizationJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import BlogHero from '@/app/components/blog/BlogHero';
import RecentPosts from '@/app/components/blog/RecentPosts';
import CategoryPostsSection from '@/app/components/blog/CategoryPostsSection';

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

  const categoryIds = [6, 12, 65];
  // Fetch data in parallel
  const [postsResponse, categories, ...categoryResponses] = await Promise.all([
    getPosts(currentPage, perPage),
    getCategories(),
    ...categoryIds.map((id) => getPostsByCategoryIds([id], 1, 6)),
  ]);

  const posts = postsResponse.data;
  const featuredCategoryPosts = categoryIds.map((id, index) => ({
    id,
    posts: categoryResponses[index]?.data ?? [],
  }));

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
      <div className="mt-4">
        {featuredCategoryPosts.map(({ id, posts: sectionPosts }) => {
          const category = categories.find((item) => item.id === id) ?? null;

          return (
            <CategoryPostsSection
              key={id}
              category={category}
              categoryId={id}
              posts={sectionPosts}
            />
          );
        })}
      </div>
      <RecentPosts
        posts={posts}
        categories={categories}
        currentPage={currentPage}
        totalPages={postsResponse.totalPages}
        featured={true}
      />


    </main>
  );
}
