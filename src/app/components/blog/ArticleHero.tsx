'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WPPost } from '@/types/wordpress';
import { getFeaturedImageUrl, getPostCategories, getAuthor, formatDate } from '@/lib/utils';
import AuthorCard from './AuthorCard';
import ShareButtons from './ShareButtons';
import Breadcrumb from './Breadcrumb';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRightLeft } from 'lucide-react';
import { AiroplanIcon, BedIcon } from '@/app/svg';
import FlightSearchForm from '../website/flight-search/search-form';
import HotelSearch from '../website/hotel-search/HotelSearch';

interface ArticleHeroProps {
  post: WPPost;
}

export default function ArticleHero({ post }: ArticleHeroProps) {
  const t = useTranslations('blog');
  const [isHotel, setIsHotel] = useState(false);
  const imageUrl = getFeaturedImageUrl(post, 'full');
  const categories = getPostCategories(post);
  const author = getAuthor(post);

  const wordCount = post.content.rendered.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const primaryCategorySlug = categories[0]?.slug || 'uncategorized';

  const breadcrumbItems = [
    { name: t('articleHero.breadcrumb.home'), url: '/' },
    { name: t('articleHero.breadcrumb.blog'), url: '/blog' },
  ];

  if (categories.length > 0) {
    breadcrumbItems.push({
      name: categories[0].name,
      url: `/blog/${categories[0].slug}`,
    });
  }

  breadcrumbItems.push({
    name: post.title.rendered.replace(/<[^>]+>/g, ''),
    url: `/blog/${primaryCategorySlug}/${post.slug}`,
  });

  const toggleHotelFlight = () => setIsHotel(!isHotel);

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
                  <Link key={cat.id} href={`/blog/${cat.slug}`} className="bg-blog-accent text-blog-secondary px-4 py-1.5 text-sm font-bold rounded-full shadow-md">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t mb-16 border-white/20 pt-6">

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
                <ShareButtons url={`https://tayyran.com/blog/${primaryCategorySlug}/${post.slug}`} title={post.title.rendered.replace(/<[^>]+>/g, '')} theme="light" />
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-20 mx-auto w-full max-w-[1200px] px-4 lg:px-0">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl shadow-slate-900/20 p-4 lg:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isHotel ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {isHotel ? <BedIcon color="currentColor" /> : <AiroplanIcon color="currentColor" />}
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  {isHotel ? t('hero.searchForm.formTypeHotels') : t('hero.searchForm.formTypeFlights')}
                </p>
                <p className="text-sm text-slate-500">
                  {isHotel ? t('hero.searchForm.formTypeHotels') : t('hero.searchForm.formTypeFlights')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleHotelFlight}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {isHotel ? t('hero.searchForm.formTypeFlights') : t('hero.searchForm.formTypeHotels')}
            </button>
          </div>

          {isHotel ? <HotelSearch type="blog" /> : <FlightSearchForm type="blog" />}
        </div>
      </div>

    </header>
  );
}
