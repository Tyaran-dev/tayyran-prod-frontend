import Image from 'next/image';
import Link from 'next/link';
import { WPPost } from '@/types/wordpress';
import { getExcerpt, getFeaturedImageUrl, getAuthor, getPostCategories, formatDate } from '@/lib/utils';
import AuthorCard from './AuthorCard';
import { useTranslations } from 'next-intl';

interface FeaturedPostProps {
  post: WPPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const t = useTranslations('blog');
  const imageUrl = getFeaturedImageUrl(post, 'full');
  const excerpt = getExcerpt(post.excerpt.rendered || post.content.rendered, 200);
  const categories = getPostCategories(post);
  const author = getAuthor(post);

  const wordCount = post.content.rendered.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="container mx-auto px-4 mb-16">
      <Link href={`/blog/${post.slug}`} className="group relative block w-full rounded-[20px] overflow-hidden shadow-lg h-[450px] md:h-[500px]">

        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={post.title.rendered.replace(/<[^>]+>/g, '')}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blog-secondary/90 via-blog-secondary/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {categories.length > 0 && (
              <span className="inline-block bg-blog-accent text-blog-secondary px-4 py-1.5 text-sm font-bold rounded-full mb-4 shadow-md">
                {categories[0].name}
              </span>
            )}

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md group-hover:text-blog-accent transition-colors"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            <p className="text-white/90 text-lg md:text-xl line-clamp-2 md:line-clamp-3 mb-6 hidden sm:block">
              {excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <time dateTime={post.date} className="font-medium">{formatDate(post.date)}</time>
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span>{t('articleHero.readingTime', { minutes: readingTime })}</span>
            </div>
          </div>

          <div className="shrink-0 hidden md:block">
            <AuthorCard author={author} variant="inline-light" />
          </div>
        </div>
      </Link>
    </div>
  );
}
