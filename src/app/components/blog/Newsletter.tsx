'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function Newsletter() {
  const t = useTranslations('blog');
  return (
    <div className="bg-blogGradient rounded-[20px] p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <svg className="absolute -top-10 -right-10 w-40 h-40" fill="white" viewBox="0 0 24 24">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {t('newsletter.title')}
        </h3>
        <p className="text-white/80 mb-8 text-lg">
          {t('newsletter.subtitle')}
        </p>

        <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder={t('newsletter.placeholder')}
            required
            className="flex-grow h-14 px-6 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20 transition-all text-left"
            dir="ltr"
          />
          <button
            type="submit"
            className="h-14 px-8 bg-blog-accent text-blog-secondary font-bold rounded-xl hover:bg-white hover:text-blog-primary transition-colors shadow-lg whitespace-nowrap"
          >
            {t('newsletter.button')}
          </button>
        </form>
        <p className="text-white/50 text-xs mt-4">
          {t('newsletter.note')}
        </p>
      </div>
    </div>
  );
}
