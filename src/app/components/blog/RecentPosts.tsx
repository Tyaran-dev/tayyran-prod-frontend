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
}

const RecentPosts = ({ posts, categories, currentPage, totalPages, featured, baseUrl = '/blog' }: RecentPostsProps) => {
    // Check if this is the first page
    const isFirstPage = currentPage === 1;

    // Determine featured post (only on first page)
    const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;

    // Determine grid posts (exclude featured post on first page)
    const gridPosts = isFirstPage ? posts.slice(1) : posts;

    return (
        <Section className="recent-posts-container flex">
            <div className="filter w-[25%]">
                <CategoryTabs categories={categories} />
            </div>

            <div className="posts">


                {featured && featuredPost && <FeaturedPost post={featuredPost} />}


                {gridPosts.length > 0 && (
                    <PostGrid
                        posts={gridPosts}
                        title={isFirstPage ? 'أحدث المقالات' : `المقالات (صفحة ${currentPage})`}
                    />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={baseUrl}
                />
            </div>

        </Section>
    );
};

export default RecentPosts;