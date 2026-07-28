import Link from 'next/link';
import Image from 'next/image';
import { WPPost, WPCategory } from '@/types/wordpress';
import { getFeaturedImageUrl, formatDate, getPostCategories } from '@/lib/utils';
import TableOfContents from './TableOfContents';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  latestPosts: WPPost[];
  categories: WPCategory[];
}

export default function Sidebar({ latestPosts, categories }: SidebarProps) {
  const t = useTranslations('blog');
  return (
    <aside className="w-full flex flex-col gap-8 sticky top-24">
      {/* Table of Contents - Client Component */}
      <TableOfContents />

      {/* Latest Posts Widget */}
      {latestPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-blog-secondary mb-6 border-r-4 border-blog-primary pr-3">
            {t('sidebar.latestPosts')}
          </h3>
          <div className="flex flex-col gap-4">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${getPostCategories(post)[0]?.slug || 'uncategorized'}/${post.slug}`}
                className="group flex gap-4 items-center"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={getFeaturedImageUrl(post, 'thumbnail')}
                    alt={post.title.rendered.replace(/<[^>]+>/g, '')}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <h4
                    className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-blog-primary transition-colors leading-snug mb-1"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <time dateTime={post.date} className="text-xs text-gray-500">
                    {formatDate(post.date)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories Widget */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-blog-secondary mb-4 border-r-4 border-blog-primary pr-3">
            {t('sidebar.categories')}
          </h3>
          <div className="flex flex-col gap-2">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/${cat.slug}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-blog-bg transition-colors group"
              >
                <span className="text-gray-700 font-medium group-hover:text-blog-primary transition-colors">
                  {cat.name}
                </span>
                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full group-hover:bg-blog-primary/10 group-hover:text-blog-primary transition-colors">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Small Newsletter Banner */}
      <div className="bg-blogGradient rounded-2xl p-6 shadow-sm text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-2">{t('sidebar.newsletterTitle')}</h3>
          <p className="text-sm text-white/80 mb-4">{t('sidebar.newsletterSubtitle')}</p>
          <input
            type="email"
            placeholder={t('newsletter.placeholder')}
            className="w-full h-10 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 mb-3 text-sm focus:outline-none focus:bg-white/20"
          />
          <button className="w-full h-10 rounded-lg bg-blog-accent text-blog-secondary font-bold text-sm hover:bg-white transition-colors">
            {t('newsletter.button')}
          </button>
        </div>
      </div>

    </aside>
  );
}
