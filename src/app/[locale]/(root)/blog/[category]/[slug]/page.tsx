import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getPostBySlug, getCategories, getRelatedPosts, getLatestPosts } from '@/lib/wordpress';
import { generateArticleMetadata, generateArticleJsonLd } from '@/lib/seo';
import { getPostCategories } from '@/lib/utils';
import ArticleHero from '@/app/components/blog/ArticleHero';
import ArticleContent from '@/app/components/blog/ArticleContent';
import ReadingProgress from '@/app/components/blog/ReadingProgress';
import Sidebar from '@/app/components/blog/Sidebar';
import RelatedPosts from '@/app/components/blog/RelatedPosts';
import Newsletter from '@/app/components/blog/Newsletter';

export async function generateMetadata(props: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);
  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    return {
      title: 'مقال غير موجود | مجلة طيران',
    };
  }

  return generateArticleMetadata(post);
}

export default async function ArticlePage(props: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);
  const decodedCategory = decodeURIComponent(params.category);
  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  // Validate that the category in the URL matches the post's primary category.
  // If not, redirect to the correct canonical URL.
  const postCategories = getPostCategories(post);
  const primaryCategorySlug = postCategories[0]?.slug;

  if (primaryCategorySlug && primaryCategorySlug !== decodedCategory) {
    redirect(`/blog/${primaryCategorySlug}/${decodedSlug}`);
  }

  // Get categories for sidebar and related posts
  const postCategoryIds = post.categories || [];

  const [categories, relatedPosts, latestPosts] = await Promise.all([
    getCategories(),
    getRelatedPosts(postCategoryIds, post.id, 3),
    getLatestPosts(3, post.id), // Exclude current post from sidebar
  ]);

  const jsonLd = generateArticleJsonLd(post);

  return (
    <main className="bg-blog-bg min-h-screen pb-20 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />
      <ArticleHero post={post} />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Main Article Content */}
          <div className="w-full lg:w-2/3 bg-white rounded-3xl  md:p-12 shadow-sm border border-gray-100">
            <ArticleContent content={post.content.rendered} />

            {/* Newsletter CTA after article */}
            <div className="mt-12">
              <Newsletter />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <Sidebar latestPosts={latestPosts} categories={categories} />
          </div>

        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}
      </div>
    </main>
  );
}
