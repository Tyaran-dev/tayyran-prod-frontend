"use client";
import { StaticImageData } from "next/image";
import bg from "/public/assets/hotels/bg1.png";
import Section from "@/app/components/shared/section";
import ParaHeading from "@/app/components/shared/para-heading";
import HotelCard from "./hotel-card";
import React from "react";
import { HotelFilter } from "./hotel-filter";
import useFeaturedHotels, { Hotel } from "@/hooks/useGetRandomHotels";

type Props = {
  t: (key: string) => string;
};

const categories = [
  "Trending",
  "5-Star",
  "Asian",
  "Europe",
  "Middle-East",
  "Budget-Friendly",
  "Adventure",
  "Family-Friendly",
];

// ✅ Reusable Skeleton Loader Component
function HotelSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl shadow animate-pulse overflow-hidden p-4">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

export default function TopHotels({ t }: Props) {
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("Trending");
  const { hotels, loading, error } = useFeaturedHotels();

  console.log("🏨 Current hotels:", hotels.length, hotels);

  if (loading) {
    return (
      <div
        className="min-w-full bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${(bg as StaticImageData).src})` }}
      >
        <Section>
          <div className="lg:py-20 py-10 space-y-6">
            <div className="text-center mb-10">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
              <p className="mt-6 text-gray-400 italic">
                Finding the best hotels for you...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {[1, 2, 3, 4].map((i) => (
                <HotelSkeleton key={i} />
              ))}
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-w-full flex items-center justify-center py-20">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-w-full flex items-center bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${(bg as StaticImageData).src})` }}
    >
      <Section>
        <div className="lg:py-20 py-10 space-y-6">
          <ParaHeading className="text-center">
            {t("topHotels.topHotelsHeading")}
          </ParaHeading>

          {hotels.length > 0 && (
            <div className="text-center">
              <p className="text-gray-600">
                {/* Showing {hotels.length} featured hotel{hotels.length !== 1 ? "s" : ""} from our selection */}
              </p>
            </div>
          )}

          {/* <HotelFilter
            t={t}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          /> */}

          {hotels.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">
                No hotels found at the moment. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div
              data-aos="zoom-in-up"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 "
            >
              {hotels.map((hotel: Hotel, index: number) => (
                <HotelCard
                  key={`${hotel.hotelCode}-${index}-${hotel.checkIn}`}
                  hotel={hotel}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
