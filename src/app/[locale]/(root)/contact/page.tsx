import {
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaClock,
    FaHeadset,
    FaPaperPlane,
    FaComments,
    FaQuestionCircle,
} from 'react-icons/fa';
import { CiPaperplane } from "react-icons/ci";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import ContactForm from '@/app/components/contact-form/ContactForm';

// For metadata (server component)
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Contact' });

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
    };
}

export default function ContactPage() {
    const t = useTranslations('Contact');
    const dir = t('dir') || 'ltr';

    // Contact methods with translations
    const contactMethods = [
        {
            icon: FaEnvelope,
            title: t('methods.email.title'),
            value: t('methods.email.value'),
            description: t('methods.email.description'),
            color: '#016733',
        },
        {
            icon: FaPhoneAlt,
            title: t('methods.phone.title'),
            value: t('methods.phone.value'),
            description: t('methods.phone.description'),
            color: '#1c1466',
        },
        {
            icon: FaMapMarkerAlt,
            title: t('methods.visit.title'),
            value: t('methods.visit.value'),
            description: t('methods.visit.description'),
            color: '#016733',
        },
    ];

    // FAQs with translations
    const faqs = [
        {
            icon: FaQuestionCircle,
            question: t('faq.q1.question'),
            answer: t('faq.q1.answer'),
        },
        {
            icon: FaComments,
            question: t('faq.q2.question'),
            answer: t('faq.q2.answer'),
        },
        {
            icon: FaHeadset,
            question: t('faq.q3.question'),
            answer: t('faq.q3.answer'),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50" dir={dir}>
            {/* Hero */}
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
                                <CiPaperplane className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                            {t('hero.title')}
                        </h1>
                        <p className="text-xl sm:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light">
                            {t('hero.description')}
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>

            {/* Contact methods cards */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                <div className={`grid sm:grid-cols-3 gap-6 mb-20 ${dir === 'rtl' ? 'rtl' : ''}`}>
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                                    style={{ backgroundColor: `${method.color}10` }}
                                >
                                    <Icon className="w-7 h-7" style={{ color: method.color }} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    {method.title}
                                </h3>
                                <p className="text-lg font-medium text-slate-800 mb-1">
                                    {method.value}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {method.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Form + info */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                            style={{
                                background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
                            }}
                        >
                            <FaPaperPlane className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            {t('form.title')}
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            {t('form.description')}
                        </p>
                    </div>

                    <div className={`grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto ${dir === 'rtl' ? 'rtl' : ''}`}>
                        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                            <ContactForm />
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div
                                className="rounded-2xl p-8 text-white shadow-xl"
                                style={{
                                    background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
                                }}
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm mb-5">
                                    <FaHeadset className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{t('support.title')}</h3>
                                <p className="text-white/90 leading-relaxed mb-6">
                                    {t('support.description')}
                                </p>
                                <div className="space-y-4">
                                    <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-3`}>
                                        <FaClock className="w-5 h-5 text-white/80 flex-shrink-0" />
                                        <span className="text-white/90">{t('support.availability')}</span>
                                    </div>
                                    <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-3`}>
                                        <FaEnvelope className="w-5 h-5 text-white/80 flex-shrink-0" />
                                        <span className="text-white/90">{t('methods.email.value')}</span>
                                    </div>
                                    <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-3`}>
                                        <FaPhoneAlt className="w-5 h-5 text-white/80 flex-shrink-0" />
                                        <span className="text-white/90">{t('methods.phone.value')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#016733]/10 mb-5">
                                    <FaMapMarkerAlt className="w-6 h-6 text-[#016733]" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">{t('office.title')}</h3>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    {t('office.address')}
                                </p>
                                <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-3 text-slate-600`}>
                                    <FaClock className="w-4 h-4 text-[#1c1466]" />
                                    <span className="text-sm">{t('office.hours')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                            style={{
                                background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
                            }}
                        >
                            <FaQuestionCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                            {t('faq.title')}
                        </h2>
                    </div>

                    <div className={`grid md:grid-cols-3 gap-6 max-w-6xl mx-auto ${dir === 'rtl' ? 'rtl' : ''}`}>
                        {faqs.map((faq, index) => {
                            const Icon = faq.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-14 h-14 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br from-[#016733] to-[#016733]/80">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                        {faq.question}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA footer */}
            <div
                className="relative bg-cover bg-center bg-no-repeat"
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