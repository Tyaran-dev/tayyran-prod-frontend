'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Ticket, Phone, Globe, Sparkles, Star, Clock3, Plane, MapPin, CalendarDays } from 'lucide-react';
import TripCard from '@/app/components/website/home/TripsSection/TripCard';
import Pagination from '@/app/components/blog/Pagination';

interface Trip {
    id: number;
    title: string;
    acf?: any;
}

interface Props {
    trips: Trip[];
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function PackagesClient({ trips, currentPage, totalPages, baseUrl }: Props) {
    const t = useTranslations('trips');
    const tCommon = useTranslations('common');

    const translate = (key: string) => {
        if (!key) return '';
        if (key.startsWith('trips.')) return t(key.replace(/^trips\./, ''));
        return t(key);
    };

    // Stats data with translations
    const stats = [
        { icon: Ticket, value: '50+', label: t('stats.destinations') },
        { icon: Plane, value: '200+', label: t('stats.trips') },
        { icon: Star, value: '4.8', label: t('stats.rating') },
        { icon: CalendarDays, value: '12', label: t('stats.years') },
    ];

    return (
        <main className="min-h-screen bg-brand-bg" dir={t('dir') || 'rtl'}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy to-[#2a1f8f]">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'url(https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-green/20 blur-3xl" />
                <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-brand-amber/20 blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-brand-amber/20 text-brand-amber text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-brand-amber/30">
                            <Sparkles className="w-4 h-4" />
                            {t('hero.badge')}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
                            {t.raw('hero.title.part1')}
                            <span className="text-brand-amber"> {t('hero.title.part2')} </span>
                            {t('hero.title.part3')}
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                            {t('hero.description')}
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href="#packages-grid"
                                className="inline-flex items-center gap-2 bg-brand-amber text-brand-navy font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
                            >
                                <Ticket className="w-5 h-5" />
                                {t('hero.cta')}
                            </a>
                            <a
                                href={`https://wa.me/966920032065?text=${encodeURIComponent(
                                    "مرحباً، أرغب بالاستفسار عن رحلة"
                                )}`}
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                {t('hero.contact')}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 text-white">
                                <div className="w-11 h-11 rounded-xl bg-brand-green/30 flex items-center justify-center flex-shrink-0">
                                    <s.icon className="w-5 h-5 text-brand-amber" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg leading-tight">{s.value}</div>
                                    <div className="text-xs text-white/70">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter/Search Section */}
            {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('filters.search')}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-transparent bg-white appearance-none">
                                <option value="">{t('filters.destination')}</option>
                                <option value="mecca">{t('filters.mecca')}</option>
                                <option value="medina">{t('filters.medina')}</option>
                            </select>
                        </div>
                        <div className="relative">
                            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-transparent bg-white appearance-none">
                                <option value="">{t('filters.duration')}</option>
                                <option value="3-5">{t('filters.duration3to5')}</option>
                                <option value="6-9">{t('filters.duration6to9')}</option>
                                <option value="10+">{t('filters.duration10plus')}</option>
                            </select>
                        </div>
                        <div>
                            <button className="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition-colors">
                                {t('filters.searchButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Packages Grid */}
            <section id="packages-grid" className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-brand-green font-semibold text-sm mb-1">{t('grid.subtitle')}</p>
                        <h1 className="text-3xl font-extrabold text-brand-navy">{t('heading')}</h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        {trips.length} {t('grid.tripsFound')}
                    </p>
                </div>

                {(!trips || trips.length === 0) ? (
                    <div className="text-center py-20 text-gray-600">{t('noTrips')}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {trips.map((trip) => (
                                <TripCard
                                    key={trip.id}
                                    id={trip.id}
                                    title={trip.title}
                                    destination={trip.acf?.destination?.[0]?.name || ''}
                                    price={trip.acf?.price || '0'}
                                    duration={trip.acf?.duration || '0'}
                                    rate={trip.acf?.rate || '0'}
                                    gallery={trip.acf?.gallery || []}
                                    featured={trip.acf?.featured || []}
                                    t={translate}
                                />
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={baseUrl} />
                        </div>
                    </>
                )}
            </section>




        </main>
    );
}