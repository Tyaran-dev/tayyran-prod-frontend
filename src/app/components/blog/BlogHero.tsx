'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRightLeft } from 'lucide-react';
import { AiroplanIcon, BedIcon } from '@/app/svg';
import FlightSearchForm from '../website/flight-search/search-form';
import HotelSearch from '../website/hotel-search/HotelSearch';

export default function BlogHero() {
  const t = useTranslations('blog');
  const [isHotel, setIsHotel] = useState(false);

  const toggleHotelFlight = () => setIsHotel(!isHotel);

  return (
    <div className="relative w-full  bg-blogGradient  rounded-b-[40px] shadow-lg mb-12 flex flex-col items-center justify-center p-4">
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
      </div>

      {/* Search Card with Toggle */}
      <div className="relative z-10 bg-white w-full max-w-[1200px] rounded-3xl shadow-2xl shadow-slate-900/20">
        {/* Decorative top gradient line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#016733] via-[#1c1466] to-[#016733]" />

        <div className="p-2 ">
          {/* Toggle Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isHotel ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'} transition-colors duration-300`}>
                {isHotel ? <BedIcon color="currentColor" /> : <AiroplanIcon color="currentColor" />}
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {isHotel ? t('hero.searchForm.formTypeHotels') : t('hero.searchForm.formTypeFlights')}
              </h2>
            </div>

            <button
              onClick={toggleHotelFlight}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-300 active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
              <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">
                {isHotel ? t('hero.searchForm.formTypeFlights') : t('hero.searchForm.formTypeHotels')}
              </span>
            </button>
          </div>

          {isHotel ? <HotelSearch type="blog" /> : <FlightSearchForm type="blog" />}
        </div>
      </div>
    </div>
  );
}