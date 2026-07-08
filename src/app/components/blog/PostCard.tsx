import Image from 'next/image';
import Link from 'next/link';
import { WPPost } from '@/types/wordpress';
import { getExcerpt, getFeaturedImageUrl, getAuthor, getPostCategories, formatDate } from '@/lib/utils';
import AuthorCard from './AuthorCard';
import { useTranslations } from 'next-intl';

interface PostCardProps {
  post: WPPost;
}

export default function PostCard({ post }: PostCardProps) {
  const t = useTranslations('blog');
  const imageUrl = getFeaturedImageUrl(post, 'medium_large');
  const excerpt = getExcerpt(post.excerpt.rendered || post.content.rendered, 120);
  const categories = getPostCategories(post);
  const author = getAuthor(post);

  // Try to estimate reading time from content
  const wordCount = post.content.rendered.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="group bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block shrink-0">
        <Image
          src={imageUrl}
          alt={post.title.rendered.replace(/<[^>]+>/g, '')}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        {categories.length > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-blogGradient text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
              {categories[0].name}
            </span>
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-6 flex flex-col grow">
        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h2
            className="text-xl font-bold text-blog-secondary line-clamp-2 group-hover:text-blog-primary transition-colors leading-snug"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>

        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed grow">
          {excerpt}
        </p>

        {/* Footer Info */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <AuthorCard author={author} variant="inline" />

          <div className="flex flex-col items-end text-xs text-gray-500 gap-1">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{t('articleHero.readingTime', { minutes: readingTime })}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
