// app/[lang]/page.tsx
'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Coins, MapPin, TrendingUp, Users, Zap, Sparkles } from 'lucide-react';
import Section from '../../shared/section';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function Home() {
    const t = useTranslations("HomePage.milecoin");
    const locale = useLocale();

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section with Gradient Background */}
            <div className="relative bg-gradient-to-br from-emerald-50  to-emerald-100">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-emerald-100 mb-6">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">{t('intro.tag')}</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            {t('intro.title')}
                        </h2>

                        <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            {t('intro.description')}
                        </p>


                        <Link
                            href="/milecoin"
                            className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-emerald-600 font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            {t('cta.button')}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <video
                            className="md:hidden w-full max-w-md mx-auto rounded-2xl shadow-xl mt-4"
                            width="300"
                            height="300"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/assets/video/milcoin.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>

            <Section>
                {/* Main Content Section */}
                <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left Column - Features */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
                                    <MapPin className="w-4 h-4 text-emerald-700" />
                                    <span className="text-sm font-semibold text-emerald-700">
                                        {t('intro.tag')}
                                    </span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                    {t('intro.heading')}
                                </h3>

                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                    {t('intro.content')}
                                </p>

                                <div className="space-y-5">
                                    {/* Feature Items */}
                                    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-gray-800 font-medium text-lg">
                                                {t('intro.features.eco')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-gray-800 font-medium text-lg">
                                                {t('intro.features.rewards')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition-all duration-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Users className="w-6 h-6 text-white " />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-gray-800 font-medium text-lg">
                                                {t('intro.features.accessible')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Link
                                        href={`/${locale}/milecoin`}
                                        className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {t('intro.cta')}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column - How It Works Card */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl blur-2xl opacity-20"></div>
                                <div className="relative bg-greenGradient rounded-lg p-8 md:p-10 text-white shadow-2xl">
                                    <div className="space-y-8">
                                        {/* Header */}
                                        <div className="text-center">
                                            <h4 className="text-2xl md:text-3xl font-bold mb-6">
                                                {t('howItWorks.title')}
                                            </h4>

                                            <div className="flex justify-center mb-6">
                                                <Coins className="md:hidden w-20 h-20 text-yellow-300 animate-pulse" />
                                                <div className="hidden md:block relative">
                                                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
                                                    <Image
                                                        src="/assets/milcion 2030.png"
                                                        width={180}
                                                        height={180}
                                                        alt="milecoin"
                                                        className="relative drop-shadow-2xl"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Steps */}
                                        <div className="space-y-5">
                                            {[1, 2, 3, 4].map((step) => (
                                                <div
                                                    key={step}
                                                    className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300"
                                                >
                                                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
                                                        <span className="text-lg font-bold">{step}</span>
                                                    </div>
                                                    <p className="flex-1 text-white/95 leading-relaxed pt-1">
                                                        {t(`howItWorks.steps.${step}`)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Stat Card 1 */}
                            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl p-8 text-center transition-all duration-300 border border-gray-100 hover:border-blue-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                                        1M+
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {t('stats.miles')}
                                    </p>
                                </div>
                            </div>

                            {/* Stat Card 2 */}
                            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl p-8 text-center transition-all duration-300 border border-gray-100 hover:border-green-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                        <Users className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                                        50K+
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {t('stats.miners')}
                                    </p>
                                </div>
                            </div>

                            {/* Stat Card 3 */}
                            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl p-8 text-center transition-all duration-300 border border-gray-100 hover:border-orange-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                        <Zap className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                                        Zero
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {t('stats.footprint')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Section>



            <style jsx>{`
                @keyframes grid {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: 50px 50px;
                    }
                }
                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: grid 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
