'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock3, Plane } from 'lucide-react';

interface TripCardProps {
  id: number;
  title: string;
  destination: string;
  price: string;
  duration: string;
  rate: string;
  gallery: string[];
  featured: string[];
  t: (key: string) => string;
}

export default function TripCard({
  id,
  title,
  destination,
  price,
  duration,
  rate,
  gallery,
  featured,
  t,
}: TripCardProps) {
  const image =
    gallery?.[0] || '/assets/default-trip.jpg';

  const isFeatured =
    featured?.includes('featured');

  return (
    <Link
      href={`/trip/${id}`}
      className="relative w-[260px] md:w-[280px] h-[380px] rounded-3xl overflow-hidden flex-shrink-0 cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width:768px) 260px, 280px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {isFeatured && (
        <div className="absolute top-4 left-4 z-20 bg-orange text-white text-xs px-3 py-1 rounded-full font-semibold">
          {t('trips.featured') || 'Featured'}
        </div>
      )}

      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white text-sm">
        <Star className="w-4 h-4 fill-current" />
        <span>{rate}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <p className="text-sm text-white/80 mb-1">
          {destination}
        </p>

        <h3 className="font-bold text-lg line-clamp-2 mb-3">
          {title}
        </h3>

        <div className="flex items-center gap-2 mb-4 text-sm text-white/80">
          <Clock3 className="w-4 h-4" />
          <span>
            {duration} {t('trips.days') || 'Days'}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-white/70">
              {t('trips.startingFrom') || 'Starting From'}
            </p>

            <p className="text-xl font-bold text-emerald-400">
              {Number(price).toLocaleString()}{' '}
              {t('trips.currency') || 'SAR'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white transition-all duration-300">
            <Plane className="w-5 h-5 rotate-45 text-white group-hover:text-orange" />
          </div>
        </div>
      </div>
    </Link>
  );
}