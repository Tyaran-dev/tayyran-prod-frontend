"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Section from "@/app/components/shared/section";

interface Offer {
  id: string;
  image: string;
  alt: string;
}

const offers: Offer[] = [
  { id: "1", image: "/offers/00001.webp", alt: "Special Offer 1" },
  { id: "2", image: "/offers/00002.webp", alt: "Special Offer 2" },
  { id: "3", image: "/offers/00003.webp", alt: "Special Offer 3" },
  { id: "4", image: "/offers/00004.webp", alt: "Special Offer 4" },
  { id: "5", image: "/offers/00001.webp", alt: "Special Offer 5" },
];

export default function OffersSlider() {
  const t = useTranslations("HomePage.OffersSlider");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild
      ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 20
      : 340;
    const offset = direction === "right" ? cardWidth : -cardWidth;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });

    setActiveIndex((prev) => {
      if (direction === "right") return Math.min(prev + 1, offers.length - 1);
      return Math.max(prev - 1, 0);
    });
  };

  const handleScrollEvent = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth =
      el.firstElementChild
        ? (el.firstElementChild as HTMLElement).offsetWidth + 20
        : 340;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(idx, offers.length - 1));
  };

  return (
    <Section className="py-10 px-4 md:px-8 max-w-7xl mx-auto select-none" dir="auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-200">
          {t("viewAll")}
        </button>
      </div>

      {/* Slider */}
      <div className="relative group/slider">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 opacity-0 group-hover/slider:opacity-100 focus:opacity-100 transition-all duration-200 hover:scale-105 disabled:opacity-0"
          aria-label={t("previousOffer")}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 opacity-0 group-hover/slider:opacity-100 focus:opacity-100 transition-all duration-200 hover:scale-105"
          aria-label={t("nextOffer")}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll Track */}
        <div
          ref={scrollRef}
          onScroll={handleScrollEvent}
          className="flex gap-5 overflow-x-auto py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {offers.map((offer, i) => (
            <div
              key={offer.id}
              className="relative flex-shrink-0 w-[300px] md:w-[420px] lg:w-[500px] h-[170px] md:h-[230px] rounded-2xl overflow-hidden shadow-sm cursor-pointer group/card transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <Image
                src={offer.image}
                alt={offer.alt}
                fill
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 420px, 500px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                priority={i === 0}
              />
              {/* Subtle shine on hover */}
              <div className="absolute inset-0 bg-white/0 group-hover/card:bg-white/5 transition-all duration-300 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!scrollRef.current) return;
              const cardWidth =
                scrollRef.current.firstElementChild
                  ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 20
                  : 340;
              scrollRef.current.scrollTo({
                left: cardWidth * i,
                behavior: "smooth",
              });
              setActiveIndex(i);
            }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 h-2 bg-emerald-500"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={t("goToOffer", { index: i + 1 })}
          />
        ))}
      </div>
    </Section>
  );
}