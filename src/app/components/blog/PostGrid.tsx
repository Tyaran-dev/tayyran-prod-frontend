import React from 'react';
import PostCard from './PostCard';
import { WPPost } from '@/types/wordpress';
import { useTranslations } from 'next-intl';

interface PostGridProps {
  posts: WPPost[];
  title?: string;
}

export default function PostGrid({ posts, title }: PostGridProps) {
  const t = useTranslations('blog');
  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-[20px] shadow-sm p-12 border border-gray-100 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-blog-secondary mb-2">{t('postGrid.noPostsTitle')}</h3>
          <p className="text-gray-500">{t('postGrid.noPostsText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-16">
      {title && (
        <h2 className="text-3xl font-bold text-blog-secondary mb-8 pr-2 border-r-4 border-blog-primary">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
