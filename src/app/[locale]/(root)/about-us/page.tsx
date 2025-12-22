import { useTranslations } from 'next-intl';
import {
    FaPlane,
    FaHotel,
    FaClock,
    FaShieldAlt,
    FaGlobeAmericas,
    FaBullseye,
    FaChartLine,
    FaBolt,
    FaHeart,
    FaAward,
    FaUsers,
    FaMagic
} from 'react-icons/fa';
import { CiPlane } from "react-icons/ci";


export default function Home() {
    const t = useTranslations('about-us');

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="relative overflow-hidden h-[600px] sm:h-[700px]">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920)',
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(58.16deg, rgba(1, 103, 51, 0.85) -6.21%, rgba(28, 20, 102, 0.85) 103.2%)',
                        }}
                    ></div>
                </div>

                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
                    <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-6 animate-fade-in">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-4 border border-white/20">
                                <CiPlane className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                            {t('title')}

                        </h1>
                        <p className="text-xl sm:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 mb-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <FaGlobeAmericas className="w-12 h-12 text-[#016733]" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 text-center">
                            {t('ourStory.title')}
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed text-center">
                            {t('ourStory.description')}
                        </p>
                    </div>
                </div>

                <div className="mb-24">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                            style={{
                                background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
                            }}
                        >
                            <FaBullseye className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            {t('ourVision.title')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#016733]/10 flex items-center justify-center m-4">
                                    <FaChartLine className="w-6 h-6 text-[#016733]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                        {t('ourVision.cards.leadingPlatform.title')}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {t('ourVision.cards.leadingPlatform.description')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#1c1466]/10 flex items-center justify-center m-4">
                                    <FaAward className="w-6 h-6 text-[#1c1466]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                        {t('ourVision.cards.vision2030.title')}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {t('ourVision.cards.vision2030.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-24">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                            style={{
                                background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
                            }}
                        >
                            <FaMagic className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            {t('whatWeOffer.title')}
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {t.raw('whatWeOffer.services').map((service: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br from-[#016733] to-[#016733]/80">
                                    <FaPlane className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-slate-600">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-24">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                            style={{
                                background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
                            }}
                        >
                            <FaHeart className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            {t('whyChooseUs.title')}
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 sm:p-12 shadow-xl">
                            <p className="text-lg text-slate-600 leading-relaxed mb-8 text-center">
                                {t('whyChooseUs.description')}
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6 mt-10">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#016733]/10 mb-3">
                                        <FaUsers className="w-6 h-6 text-[#016733]" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">{t('whyChooseUs.features.userFocused.title')}</h4>
                                    <p className="text-sm text-slate-600">{t('whyChooseUs.features.userFocused.description')}</p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1c1466]/10 mb-3">
                                        <FaBolt className="w-6 h-6 text-[#1c1466]" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">{t('whyChooseUs.features.technology.title')}</h4>
                                    <p className="text-sm text-slate-600">{t('whyChooseUs.features.technology.description')}</p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#016733]/10 mb-3">
                                        <FaAward className="w-6 h-6 text-[#016733]" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">{t('whyChooseUs.features.excellence.title')}</h4>
                                    <p className="text-sm text-slate-600">{t('whyChooseUs.features.excellence.description')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="relative inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920)',
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(58.16deg, rgba(1, 103, 51, 0.85) -6.21%, rgba(28, 20, 102, 0.85) 103.2%)',
                    }}
                ></div>
                <div className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        {t('cta.description')}
                    </p>
                </div>
            </div>
        </div>
    );
}