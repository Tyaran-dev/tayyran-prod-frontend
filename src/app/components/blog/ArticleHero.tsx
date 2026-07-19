import Image from 'next/image';
import { WPPost } from '@/types/wordpress';
import { getFeaturedImageUrl, getPostCategories, getAuthor, formatDate } from '@/lib/utils';
import AuthorCard from './AuthorCard';
import ShareButtons from './ShareButtons';
import Breadcrumb from './Breadcrumb';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface ArticleHeroProps {
  post: WPPost;
}

export default function ArticleHero({ post }: ArticleHeroProps) {
  const t = useTranslations('blog');
  const imageUrl = getFeaturedImageUrl(post, 'full');
  const categories = getPostCategories(post);
  const author = getAuthor(post);

  const wordCount = post.content.rendered.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const breadcrumbItems = [
    { name: t('articleHero.breadcrumb.home'), url: '/' },
    { name: t('articleHero.breadcrumb.blog'), url: '/blog' },
  ];

  if (categories.length > 0) {
    breadcrumbItems.push({
      name: categories[0].name,
      url: `/blog/category/${categories[0].slug}`,
    });
  }

  breadcrumbItems.push({
    name: post.title.rendered.replace(/<[^>]+>/g, ''),
    url: `/blog/${post.slug}`,
  });

  console.log(categories,"categories")

  return (
    <header className="relative w-full mb-12">
      {/* Background Image Header */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] rounded-b-[40px] overflow-hidden shadow-lg">
        <Image
          src={imageUrl}
          alt={post.title.rendered.replace(/<[^>]+>/g, '')}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blog-secondary/95 via-blog-secondary/60 to-black/20" />

        {/* Content Container */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} theme="light" />
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                  <Link key={cat.id} href={`/blog/category/${cat.slug}`} className="bg-blog-accent text-blog-secondary px-4 py-1.5 text-sm font-bold rounded-full shadow-md">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/20 pt-6">

              <div className="flex items-center gap-6">
                <AuthorCard author={author} variant="inline-light" />

                <div className="h-10 w-px bg-white/20 hidden md:block"></div>

                <div className="flex flex-col text-sm text-white/80 gap-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('articleHero.readingTime', { minutes: readingTime })}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <ShareButtons url={`https://tayyran.com/blog/${post.slug}`} title={post.title.rendered.replace(/<[^>]+>/g, '')} theme="light" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
