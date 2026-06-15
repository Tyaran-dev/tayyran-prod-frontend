'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import Section from '@/app/components/shared/section';
import ParaHeading from '@/app/components/shared/para-heading';
import TripCard from './TripCard';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Trip = {
  id: number;
  title: string;
  acf: {
    destination: Array<{
      name: string;
    }>;
    price: string;
    duration: string;
    advantages: Array<{ text: string }>;
    disadvantages: Array<{ text: string }>;
    rate: string;
    gallery: string[];
    featured: string[];
  };
};

type Props = {
  t: (key: string) => string;
  backgroundImage?: string;
};

export default function TripsSection({
  t,
  backgroundImage,
}: Props) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          'https://qessatravel.com/wp-json/qessa/v1/trips'
        );

        if (Array.isArray(response.data)) {
          setTrips(response.data);
        }
      } catch (error) {
        console.error(
          'Failed to fetch trips:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleScroll = (
    direction: 'left' | 'right'
  ) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left:
        direction === 'right'
          ? 320
          : -320,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
            }
          : undefined
      }
    >
      <Section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <ParaHeading className="!text-black mb-0">
            {t('trips.heading') ||
              'أفضل العروض السياحية'}
          </ParaHeading>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {t('trips.noTrips') ||
                'لا توجد عروض حالياً'}
            </p>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() =>
                handleScroll('left')
              }
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() =>
                handleScroll('right')
              }
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  title={trip.title}
                  destination={
                    trip.acf.destination?.[0]
                      ?.name || ''
                  }
                  price={trip.acf.price}
                  duration={
                    trip.acf.duration
                  }
                  rate={trip.acf.rate}
                  gallery={
                    trip.acf.gallery
                  }
                  featured={
                    trip.acf.featured
                  }
                  t={t}
                />
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}