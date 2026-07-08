'use client';

import React, { useState, useEffect } from 'react';
import { Twitter, Facebook, Linkedin, Link2, Check, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  url: string;
  title: string;
  theme?: 'light' | 'dark';
}

export default function ShareButtons({ url, title, theme = 'dark' }: ShareButtonsProps) {
  const t = useTranslations('blog');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        url
      });
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  const isLight = theme === 'light';

  const baseBtnClass = `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${isLight
      ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
      : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
    }`;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium mr-2 hidden md:inline-block ${isLight ? 'text-white/80' : 'text-gray-500'}`}>
        {t('shareButtons.label')}
      </span>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtnClass}
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtnClass}
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </a>

      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtnClass}
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>

      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtnClass} md:hidden`}
        aria-label="Share on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>

      {canShare && (
        <button
          onClick={handleNativeShare}
          className={`${baseBtnClass} md:hidden`}
          aria-label="Native Share"
        >
          <Share2 size={18} />
        </button>
      )}

      <button
        onClick={handleCopy}
        className={`${baseBtnClass} hidden md:flex`}
        aria-label="Copy link"
        title={t('shareButtons.copyTitle')}
      >
        {copied ? <Check size={18} className={isLight ? 'text-green-400' : 'text-green-600'} /> : <Link2 size={18} />}
      </button>
    </div>
  );
}
