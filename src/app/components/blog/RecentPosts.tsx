import React from 'react';
import CategoryTabs from '@/app/components/blog/CategoryTabs';
import FeaturedPost from '@/app/components/blog/FeaturedPost';
import PostGrid from '@/app/components/blog/PostGrid';
import Pagination from '@/app/components/blog/Pagination';
import Newsletter from '@/app/components/blog/Newsletter';
import { WPPost, WPCategory } from '@/types/wordpress';
import Section from '../shared/section';

interface RecentPostsProps {
    posts: WPPost[];
    categories: WPCategory[];
    currentPage: number;
    totalPages: number;
    featured: boolean;
    baseUrl?: string;
    activeSlug?: string;
}

const RecentPosts = ({ posts, categories, currentPage, totalPages, featured, baseUrl = '/blog', activeSlug }: RecentPostsProps) => {
    // Check if this is the first page
    const isFirstPage = currentPage === 1;

    // Determine featured post (only on first page and when featured is enabled)
    const featuredPost = featured && isFirstPage && posts.length > 0 ? posts[0] : null;

    // Determine grid posts (exclude featured post on first page when featured is enabled)
    const gridPosts = featured && isFirstPage ? posts.slice(1) : posts;

    return (
        <Section className="recent-posts-container flex  justify-center items-center flex-col gap-8 py-8">
            <div className="">


                <div className="posts">
                    {featured && featuredPost && <FeaturedPost post={featuredPost} />}
                    {gridPosts.length > 0 && (
                        <PostGrid
                            posts={gridPosts}
                            title={isFirstPage ? 'أحدث المقالات ' : `المقالات (صفحة ${currentPage})`}
                        />
                    )}

                    {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={baseUrl}
                /> */}
                </div>

            </div>
            <div className="filter w-[100%]">
                <CategoryTabs categories={categories} activeSlug={activeSlug} />
            </div>
        </Section>
    );
};

export default RecentPosts;