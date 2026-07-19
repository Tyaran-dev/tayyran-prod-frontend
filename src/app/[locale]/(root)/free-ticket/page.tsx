import { Ticket, Phone, Globe, Sparkles, ShieldCheck, Plane } from 'lucide-react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// For metadata (server component)
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'FreeTicket' });

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
    };
}

export default function FreeTicketPage() {
    const t = useTranslations('FreeTicket');

    // Terms data with translations
    const terms = Array.from({ length: 13 }, (_, i) => ({
        n: i + 1,
        text: t(`terms.${i + 1}`)
    }));

    // Stats data with translations
    const stats = [
        { icon: Ticket, value: '1', label: t('stats.perBooking') },
        { icon: ShieldCheck, value: '1,500', label: t('stats.maxAmount') },
        { icon: Plane, value: '50', label: t('stats.available') },
        { icon: Sparkles, value: '+2', label: t('stats.perPerson') },
    ];

    // Steps data with translations
    const steps = [
        {
            step: '1',
            title: t('steps.step1.title'),
            desc: t('steps.step1.desc')
        },
        {
            step: '2',
            title: t('steps.step2.title'),
            desc: t('steps.step2.desc')
        },
        {
            step: '3',
            title: t('steps.step3.title'),
            desc: t('steps.step3.desc')
        },
    ];

    return (
        <main className="min-h-screen bg-brand-bg" dir={t('dir') || 'rtl'}>
    

            {/* Hero */}
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
                                href="#terms"
                                className="inline-flex items-center gap-2 bg-brand-amber text-brand-navy font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
                            >
                                <Ticket className="w-5 h-5" />
                                {t('hero.cta')}
                            </a>
                            <a
                                href="tel:+966"
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

            {/* How it works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <p className="text-brand-green font-semibold text-sm mb-1">{t('howItWorks.subtitle')}</p>
                    <h2 className="text-3xl font-extrabold text-brand-navy">{t('howItWorks.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((s) => (
                        <div
                            key={s.step}
                            className="relative bg-white p-7 rounded-2xl border border-gray-100 hover:border-brand-green/30 hover:shadow-lg transition-all"
                        >
                            <div className="absolute -top-5 right-7 w-11 h-11 rounded-full bg-brand-green text-white font-bold flex items-center justify-center text-lg shadow-md">
                                {s.step}
                            </div>
                            <h3 className="font-bold text-brand-navy text-lg mt-4 mb-2">{s.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Terms */}
            <section id="terms" className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-brand-green font-semibold text-sm mb-1">{t('termsSection.subtitle')}</p>
                        <h2 className="text-3xl font-extrabold text-brand-navy">{t('termsSection.title')}</h2>
                        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                            {t('termsSection.description')}
                        </p>
                    </div>

                    <div className="relative">
                        {/* vertical line */}
                        <div className="absolute right-[22px] md:right-1/2 top-0 bottom-0 w-px bg-gray-200 md:translate-x-1/2" />

                        <ol className="space-y-5">
                            {terms.map((t) => (
                                <li
                                    key={t.n}
                                    className="relative pr-14 md:pr-0 md:grid md:grid-cols-2 md:gap-8 md:items-center"
                                >
                                    {/* number bubble */}
                                    <div
                                        className={`absolute right-0 md:static md:flex md:justify-end top-0 ${t.n % 2 === 0 ? 'md:order-2 md:pl-14' : 'md:order-1 md:pr-14'
                                            }`}
                                    >
                                        <div className="w-11 h-11 rounded-full bg-brand-navy text-brand-amber font-bold flex items-center justify-center shadow-md ring-4 ring-white">
                                            {t.n}
                                        </div>
                                    </div>
                                    {/* card */}
                                    <div
                                        className={`bg-brand-bg rounded-xl p-4 border border-gray-100 ${t.n % 2 === 0 ? 'md:order-1 md:pr-14' : 'md:order-2 md:pl-14'
                                            }`}
                                    >
                                        <p className="text-gray-700 leading-relaxed text-[15px]">{t.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* CTA */}
                    <div className="mt-14 bg-gradient-to-l from-brand-green to-green-700 rounded-2xl p-8 text-center shadow-lg">
                        <h3 className="text-2xl font-extrabold text-white mb-2">{t('cta.title')}</h3>
                        <p className="text-white/80 mb-6">{t('cta.description')}</p>
                        <a
                            href="tel:+966"
                            className="inline-flex items-center gap-2 bg-brand-amber text-brand-navy font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                            <Phone className="w-5 h-5" />
                            {t('cta.button')}
                        </a>
                    </div>
                </div>
            </section>

``
        </main>
    );
}