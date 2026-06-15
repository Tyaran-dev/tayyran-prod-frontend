"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { setSearchData } from "@/redux/flights/flightSlice";
import Section from "@/app/components/shared/section";
import { ChevronLeft, ChevronRight, Plane } from "lucide-react";

interface DestinationItem {
  id: string;
  origin: string;
  destination: string;
  price: number;
  image: string;
  cityKey: string; // matches translation key
}

const TrendyDestantions: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("HomePage.trendyDestinations");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isRtl = locale === 'ar';

  // Destinations data matching the screenshot
  const destinations: DestinationItem[] = [
    {
      id: "1",
      origin: "LHR",
      destination: "RUH",
      price: 1299,
      image: "/assets/flights/london_destination.png",
      cityKey: "londonRiyadh",
    },
    {
      id: "2",
      origin: "CAI",
      destination: "JED", // Under the hood CAI -> JED for a valid search
      price: 399,
      image: "/assets/flights/cairo_destination.png",
      cityKey: "cairoJeddah", // Cairo -> Cairo label from mockups
    },
    {
      id: "3",
      origin: "DMM",
      destination: "GYD",
      price: 699,
      image: "/assets/flights/baku_destination.png",
      cityKey: "dammamBaku",
    },
    {
      id: "4",
      origin: "IST",
      destination: "JED",
      price: 499,
      image: "/assets/flights/istanbul_destination.png",
      cityKey: "istanbulJeddah",
    },
    {
      id: "5",
      origin: "RUH",
      destination: "DXB",
      price: 299,
      image: "/assets/flights/dubai_destination.png",
      cityKey: "riyadhDubai",
    },
    {
      id: "6",
      origin: "JED",
      destination: "SSH",
      price: 599,
      image: "/assets/flights/f1.png",
      cityKey: "jeddahSharm",
    },
    {
      id: "7",
      origin: "RUH",
      destination: "KWI",
      price: 349,
      image: "/assets/flights/f2.png",
      cityKey: "riyadhKuwait",
    },
    {
      id: "8",
      origin: "DMM",
      destination: "CAI",
      price: 799,
      image: "/assets/flights/cairo_destination.png",
      cityKey: "dammamCairo",
    },
    {
      id: "9",
      origin: "MED",
      destination: "IST",
      price: 899,
      image: "/assets/flights/istanbul_destination.png",
      cityKey: "medinaIstanbul",
    },
  ];

  const handleDestinationClick = (dest: DestinationItem) => {
    // Generate departure date set to 7 days from today
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7);

    // Construct search payload to set in redux store
    const searchParams = {
      origin: dest.origin,
      destination: dest.destination,
      departure: departureDate,
      returnDate: null,
      travelers: { adults: 1, children: 0, infants: 0 },
      flightClass: "ECONOMY",
      flightType: "oneway",
    };

    // Set the destination search parameters in Redux store
    dispatch(setSearchData(searchParams));

    // Redirect to the flight search page
    router.push(`/${locale}/flight-search`);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      // In RTL, left direction scrolls forward positive, right scrolls backward negative.
      // In LTR, right direction scrolls forward positive, left scrolls backward negative.
      let offset = direction === 'right' ? scrollAmount : -scrollAmount;
      if (isRtl) {
        offset = direction === 'left' ? scrollAmount : -scrollAmount;
      }

      scrollRef.current.scrollBy({
        left: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Section className="py-10 select-none ">
      {/* Heading Bar */}
      <div className="flex justify-between items-center mb-6 font-almarai" dir={isRtl ? "rtl" : "ltr"}>
        <h2 className="text-xl md:text-2xl font-bold text-primary">
          {t("heading")}
        </h2>
        <span className="text-sm font-semibold text-secondary hover:underline cursor-pointer transition-colors duration-200">
          {t("viewAll")}
        </span>
      </div>

      {/* Slider Carousel Wrapper */}
      <div className="relative group w-full" dir={isRtl ? "rtl" : "ltr"}>
        {/* Navigation Arrows */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 focus:outline-none transition-all hover:scale-105 duration-200"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 focus:outline-none transition-all hover:scale-105 duration-200"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleDestinationClick(dest)}
              className="relative w-[230px] md:w-[250px] h-[160px] md:h-[180px] rounded-2xl overflow-hidden shadow-sm cursor-pointer flex-shrink-0 transform hover:scale-[1.03] transition-all duration-300 hover:shadow-md group/card"
            >
              {/* Destination Landmark Image */}
              <Image
                src={dest.image}
                alt={t(`cities.${dest.cityKey}`)}
                fill
                sizes="(max-width: 768px) 230px, 250px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-110"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white flex flex-col justify-end">
                {/* Route Header */}
                <h3 className="font-bold text-sm md:text-base mb-1 tracking-wide">
                  {t(`cities.${dest.cityKey}`)}
                </h3>

                {/* Starting Price & Go Button */}
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-300 font-light">
                      {t("startingFrom")}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-emerald-400">
                      {t("sar")} {dest.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Circle Plane Icon Button */}
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/card:bg-white group-hover/card:text-primary transition-all duration-300">
                    <Plane className="w-4 h-4 text-white group-hover/card:text-emerald-700 transform rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

  
    </Section>
  );
};

export default TrendyDestantions;


    {/* Cool Summer Banner Section */}
      // <div 
      //   className="mt-10 relative w-full rounded-2xl overflow-hidden shadow-md group/banner cursor-pointer"
      //   dir={isRtl ? "rtl" : "ltr"}
      // >
      //   {/* Aspect ratio container */}
      //   <div className="relative w-full h-[140px] md:h-[210px]">
      //     {/* Banner Background Image */}
      //     <Image
      //       src="/assets/flights/cool_summer_banner.png"
      //       alt={t("coolSummer.title")}
      //       fill
      //       className="object-cover transition-transform duration-700 group-hover/banner:scale-105"
      //       priority
      //     />

      //     {/* overlay filter */}
      //     <div className="absolute inset-0 bg-black/35 group-hover/banner:bg-black/30 transition-all duration-300" />

      //     {/* Dynamic Content overlay */}
      //     <div className="absolute  inset-0 flex flex-col md:flex-row items-center justify-between px-6 py-4 md:px-10 gap-3 md:gap-6 text-white select-none">
      //       {/* Title / Description */}
      //       <div className="flex flex-col items-center md:items-start text-center md:text-start">
      //         <h3 className="text-xl md:text-2xl font-extrabold flex items-center gap-2 drop-shadow-md">
      //           {t("coolSummer.title")}
      //           <span className="animate-pulse">❄️</span>
      //         </h3>
      //         <p className="text-[11px] md:text-xs text-white/90 font-light drop-shadow">
      //           {t("coolSummer.subtitle")}
      //         </p>
      //       </div>

      //       {/* Destination flags list */}
      //       <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-2 md:gap-x-3 gap-y-1 text-xs md:text-sm font-semibold bg-white/10 backdrop-blur-md py-1.5 px-4 rounded-full border border-white/15 drop-shadow">
      //         <span>{t("coolSummer.bosnia")} 🇧🇦</span>
      //         <span className="text-white/50 text-[10px]">•</span>
      //         <span>{t("coolSummer.azerbaijan")} 🇦🇿</span>
      //         <span className="text-white/50 text-[10px]">•</span>
      //         <span>{t("coolSummer.georgia")} 🇬🇪</span>
      //         <span className="text-white/50 text-[10px]">•</span>
      //         <span>{t("coolSummer.austria")} 🇦🇹</span>
      //         <span className="text-white/50 text-[10px]">•</span>
      //         <span>{t("coolSummer.switzerland")} 🇨🇭</span>
      //       </div>
      //     </div>
      //   </div>
      // </div>