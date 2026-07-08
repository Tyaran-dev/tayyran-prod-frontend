'use client';

import React from 'react';
import SearchBox from './SearchBox';
import { useTranslations } from 'next-intl';

export default function BlogHero() {
  const t = useTranslations('blog');
  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-blogGradient overflow-hidden rounded-b-[40px] shadow-lg mb-12 flex flex-col items-center justify-center px-4">
      {/* Decorative SVGs / Patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg className="absolute top-10 left-10 w-32 h-32 animate-float-slow" fill="white" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
        <svg className="absolute bottom-10 right-10 w-24 h-24 animate-float-medium" fill="white" viewBox="0 0 24 24">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto mt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
          {t('hero.subtitle')}
        </p>
        <SearchBox />
      </div>
    </div>
  );
}
