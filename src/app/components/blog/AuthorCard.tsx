import Image from 'next/image';
import { getInitials } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface AuthorProps {
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  variant?: 'inline' | 'inline-light' | 'card';
}

export default function AuthorCard({ author, variant = 'inline' }: AuthorProps) {
  const t = useTranslations('blog');
  const { name, avatar, bio } = author;
  const initials = getInitials(name);

  // Fallback avatar element
  const FallbackAvatar = () => (
    <div className={`flex items-center justify-center bg-gray-100 text-blog-secondary font-bold shrink-0 rounded-full
      ${variant === 'card' ? 'w-20 h-20 text-2xl' : 'w-10 h-10 text-sm'}
    `}>
      {initials}
    </div>
  );

  const ImageAvatar = () => (
    <div className={`relative shrink-0 rounded-full overflow-hidden border-2
      ${variant === 'card' ? 'w-20 h-20 border-gray-100' : 'w-10 h-10 border-white'}
      ${variant === 'inline-light' ? 'border-white/20' : ''}
    `}>
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover"
        />
      ) : (
        <FallbackAvatar />
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
        <ImageAvatar />
        <div>
          <h3 className="text-lg font-bold text-blog-secondary">{name}</h3>
          <p className="text-sm text-gray-500 mt-1 mb-2">{t('authorCard.byline')}</p>
          {bio && <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>}
        </div>
      </div>
    );
  }

  // Inline variants
  return (
    <div className="flex items-center gap-3">
      <ImageAvatar />
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${variant === 'inline-light' ? 'text-white' : 'text-blog-secondary'}`}>
          {name}
        </span>
        {variant !== 'inline-light' && (
          <span className="text-xs text-gray-500">{t('authorCard.role')}</span>
        )}
      </div>
    </div>
  );
}
