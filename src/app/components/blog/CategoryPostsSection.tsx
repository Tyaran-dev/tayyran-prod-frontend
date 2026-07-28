import Link from 'next/link';
import PostCard from './PostCard';
import type { WPPost, WPCategory } from '@/types/wordpress';

interface CategoryPostsSectionProps {
    category: WPCategory | null;
    categoryId: number;
    posts: WPPost[];
}

export default function CategoryPostsSection({
    category,
    categoryId,
    posts,
}: CategoryPostsSectionProps) {
    const visiblePosts = posts.slice(0, 6);
    const categoryName = category?.name || `التصنيف ${categoryId}`;
    const categorySlug = category?.slug || `category-${categoryId}`;
    const categoryHref = `/blog/${categorySlug}`;

    if (visiblePosts.length === 0) {
        return null;
    }

    return (
        <section className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-blog-secondary">
                        {categoryName}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        أحدث المقالات في هذا القسم
                    </p>
                </div>

                <Link
                    href={categoryHref}
                    className="inline-flex items-center justify-center rounded-full bg-blog-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blog-secondary"
                >
                    قراءة المزيد
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
}
