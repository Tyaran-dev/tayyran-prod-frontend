'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StaticImageData } from 'next/image';
import Section from '@/app/components/shared/section';
import ParaHeading from '@/app/components/shared/para-heading';
import TripCard from './TripCard';
import axios from 'axios';

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
}

type Props = {
    t: (key: string) => string;
    backgroundImage?: string;
}

const defaultTrips: Trip[] = [
    {
        "id": 477,
        "title": "عرض لندن الفاخر",
        "acf": {
            "destination": [
                {
                    "name": "اوروبا"
                }
            ],
            "price": "5999",
            "duration": "7",
            "advantages": [
                { "text": "الطيران الدولي" },
                { "text": "الاقامة سبع ليالي" },
                { "text": "وجبة الافطار" },
                { "text": "الاستقبال و التوديع" },
                { "text": "شرائح الانترنت" },
                { "text": "الضرائب " }
            ],
            "disadvantages": [
                { "text": "جميع مالم يذكر بالعرض" }
            ],
            "rate": "5",
            "gallery": [
                "https://qessatravel.com/wp-content/uploads/2025/01/السياحة-في-اسكتلندا-دليلك-الشامل-لرحلة-لا-مثيل-لها-6586.jpg",
                "https://qessatravel.com/wp-content/uploads/2025/01/الحياة_في_اسكتلندا.jpg"
            ],
            "featured": ["featured"]
        }
    },
    {
        "id": 362,
        "title": "عرض أسبانيا الكلاسيكية",
        "acf": {
            "destination": [
                {
                    "name": "رحلات سياحية جماعية"
                }
            ],
            "price": "4555",
            "duration": "7",
            "advantages": [
                { "text": "الاستقبال والتوديع في المطار" },
                { "text": "الجولات السياحية الجماعية" },
                { "text": "الإقامة الفندقية مع الإفطار" },
                { "text": "تذاكر بعض الأماكن السياحية" }
            ],
            "disadvantages": [
                { "text": " تذاكر الطيران الدولي ويمكنكم الحجز لدينا " },
                { "text": " تذاكر دخول الأماكن السياحية وجميع ما لم يتم ذكره بالعرض " }
            ],
            "rate": "5",
            "gallery": [
                "https://qessatravel.com/wp-content/uploads/2024/12/اسبانيا-Website.png",
                "https://qessatravel.com/wp-content/uploads/2024/12/شهر-العسل-في-اسبانيا.jpg"
            ],
            "featured": ["featured"]
        }
    },
    {
        "id": 478,
        "title": "عرض باريس الرومانسي",
        "acf": {
            "destination": [
                {
                    "name": "اوروبا"
                }
            ],
            "price": "6999",
            "duration": "5",
            "advantages": [
                { "text": "الطيران الدولي" },
                { "text": "الاقامة خمس ليالي" },
                { "text": "وجبة الافطار" },
                { "text": "جولة سياحية في باريس" }
            ],
            "disadvantages": [
                { "text": "جميع مالم يذكر بالعرض" }
            ],
            "rate": "5",
            "gallery": [
                "https://qessatravel.com/wp-content/uploads/2025/01/السياحة-في-اسكتلندا-دليلك-الشامل-لرحلة-لا-مثيل-لها-6586.jpg"
            ],
            "featured": []
        }
    }
];

export default function TripsSection(props: Props) {
    const { t, backgroundImage } = props;
    const [trips, setTrips] = useState<Trip[]>(defaultTrips);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://qessatravel.com/wp-json/qessa/v1/trips");
                if (response.data && Array.isArray(response.data)) {
                    setTrips(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => (prev + 1) % trips.length);
        setProgress(0);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [isTransitioning, trips.length]);

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => (prev - 1 + trips.length) % trips.length);
        setProgress(0);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [isTransitioning, trips.length]);

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setProgress(0);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [isTransitioning]);

    useEffect(() => {
        if (isPaused || trips.length <= 1) return;

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    nextSlide();
                    return 0;
                }
                return prev + 0.5;
            });
        }, 30);

        return () => clearInterval(progressInterval);
    }, [isPaused, trips.length, nextSlide]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsPaused(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            nextSlide();
        } else if (distance < -minSwipeDistance) {
            prevSlide();
        }

        setTouchStart(0);
        setTouchEnd(0);
        setIsPaused(false);
    };

    const getCardStyle = (index: number) => {
        const position = (index - currentIndex + trips.length) % trips.length;

        if (position === 0) {
            return {
                transform: 'translateX(-50%) scale(1)',
                opacity: 1,
                zIndex: 30,
                left: '50%',
            };
        } else if (position === 1 || position === trips.length - 1) {
            const isNext = position === 1;
            return {
                transform: `translateX(${isNext ? '45%' : '-145%'}) scale(0.85)`,
                opacity: 0.6,
                zIndex: 20,
                left: '50%',
            };
        } else {
            return {
                transform: 'translateX(-50%) scale(0.7)',
                opacity: 0,
                zIndex: 10,
                left: '50%',
                pointerEvents: 'none' as const,
            };
        }
    };

    return (
        <div
            className="min-w-full  flex items-center bg-cover bg-center bg-no-repeat overflow-hidden "
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
            <Section className=''>
                <div className="lg:py-20 py-10 space-y-8 " >
                    <ParaHeading className="text-center !text-black">
                        {t("trips.heading") || "أفضل العروض السياحية"}
                    </ParaHeading>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">{t("trips.noTrips") || "لا توجد عروض حالياً"}</p>
                        </div>
                    ) : (
                        <div
                            className="relative h-[600px] lg:h-[650px] "
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {trips.map((trip, index) => (
                                <div
                                    key={trip.id}
                                    className="absolute top-0 w-full md:w-[450px] lg:w-[500px] transition-all duration-600 ease-out "
                                    style={getCardStyle(index)}
                                >
                                    <div className={`${(index - currentIndex + trips.length) % trips.length === 0 ? '' : 'pointer-events-none'}`}>
                                        <TripCard
                                            id={trip.id}
                                            title={trip.title}
                                            destination={trip.acf.destination[0]?.name || ""}
                                            price={trip.acf.price}
                                            duration={trip.acf.duration}
                                            advantages={trip.acf.advantages}
                                            disadvantages={trip.acf.disadvantages}
                                            rate={trip.acf.rate}
                                            gallery={trip.acf.gallery}
                                            featured={trip.acf.featured}
                                            t={t}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={prevSlide}
                                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm hover:bg-orange text-orange hover:text-white rounded-full p-3 lg:p-4 shadow-xl transition-all duration-300"
                                aria-label="Previous slide"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-4  top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm hover:bg-orange text-orange hover:text-white rounded-full p-3 lg:p-4 shadow-xl transition-all duration-300"
                                aria-label="Next slide"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className="absolute  mb-8 hidden  lg:-bottom-16 left-1/2 -translate-x-1/2 z-40 md:flex items-center gap-3 bg-[#1d1168] rounded-3xl px-6 py-3 shadow-lg">
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="text-orange hover:text-orange/80 transition-colors"
                                    aria-label={isPaused ? 'Play' : 'Pause'}
                                >
                                    {isPaused ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    )}
                                </button>

                                <div className="flex items-center gap-2">
                                    {trips.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className="relative"
                                            aria-label={`Go to slide ${index + 1}`}
                                        >
                                            <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                                                currentIndex === index ? 'bg-orange' : 'bg-gray-300'
                                            }`}>
                                                {currentIndex === index && (
                                                    <div
                                                        className="h-full bg-orange rounded-full transition-all duration-100"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="text-sm font-medium text-gray-700">
                                    {currentIndex + 1} / {trips.length}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </Section>
        </div>
    );
}
