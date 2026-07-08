import React from 'react';
import PostCard from './PostCard';
import { WPPost } from '@/types/wordpress';
import { useTranslations } from 'next-intl';

interface RelatedPostsProps {
  posts: WPPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const t = useTranslations('blog');
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100 mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-blog-secondary pr-3 border-r-4 border-blog-primary">
          {t('relatedPosts.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
