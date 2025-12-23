'use client';
import React from 'react';
import Image from 'next/image';
import { StarIcon } from '@/app/svg';
import Link from 'next/link';

interface TripCardProps {
    id: number;
    title: string;
    destination: string;
    price: string;
    duration: string;
    advantages: Array<{ text: string }>;
    disadvantages: Array<{ text: string }>;
    rate: string;
    gallery: string[];
    featured: string[];
    t: (key: string) => string;
}

const TripCard: React.FC<TripCardProps> = ({
    id,
    title,
    destination,
    price,
    duration,
    advantages,
    disadvantages,
    rate,
    gallery,
    featured,
    t
}) => {
    const mainImage = gallery && gallery.length > 0 ? gallery[0] : '/assets/default-trip.jpg';
    const isFeatured = featured && featured.includes('featured');

    return (
        <div className="border bg-white border-[#D2D2D2] p-3 rounded-xl relative h-full">
            {isFeatured && (
                <div className="absolute top-4 left-4 bg-orange text-white px-3 py-1 rounded-lg text-xs font-semibold z-10">
                    {t("trips.featured") || "مميز"}
                </div>
            )}

            <div className="absolute top-4 right-4 bg-green text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold z-10">
                <StarIcon className="w-4 h-4" />
                {rate}
            </div>

            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                    src={mainImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-orange rounded-full"></div>
                    <p className="text-sm text-grayText">{destination}</p>
                </div>

                <h3 className="text-lg lg:text-xl font-bold text-black mb-3 line-clamp-2 h-14">
                    {title}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-grayText" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-grayText">
                        {duration} {t("trips.days") || "أيام"}
                    </p>
                </div>

                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-black mb-2">
                        {t("trips.includes") || "يشمل"}
                    </h4>
                    <ul className="space-y-1">
                        {advantages.slice(0, 3).map((advantage, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-grayText">{advantage.text}</span>
                            </li>
                        ))}
                        {advantages.length > 3 && (
                            <li className="text-xs text-orange font-medium">
                                +{advantages.length - 3} {t("trips.more") || "المزيد"}
                            </li>
                        )}
                    </ul>
                </div>

                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-grayText">
                            {t("trips.startingFrom") || "ابتداءً من"}
                        </span>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-orange">
                                {Number(price).toLocaleString()} {t("trips.currency") || "ريال"}
                            </p>
                            <p className="text-xs text-grayText">
                                {t("trips.perPerson") || "للشخص"}
                            </p>
                        </div>
                    </div>

                    <Link target='_blank' href="https://api.whatsapp.com/send/?phone=966920032065&text&type=phone_number&app_absent=0">
                        <button className="bg-orange text-white px-4 py-3 rounded-xl w-full text-sm font-semibold hover:bg-orange-dark transition-colors">
                            {t("trips.bookNow") || "احجز الآن"}
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TripCard;
