import { getTranslations } from 'next-intl/server';
import PackagesClient from './PackagesClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'trips' });

    return {
        title: t('metadata.title') || t('heading') || 'Trips',
        description: t('metadata.description') || t('heading') || '',
    };
}

export default async function PackagesPage({ 
    params, 
    searchParams 
}: { 
    params: { locale: string }; 
    searchParams: { [k: string]: string } 
}) {
    const locale = params.locale;
    const page = Number(searchParams?.page || '1');
    const pageSize = 12;

    try {
        const res = await fetch('https://qessatravel.com/wp-json/qessa/v1/trips', { 
            cache: 'no-store' 
        });
        const data = res.ok ? await res.json() : [];

        const totalPages = Math.max(1, Math.ceil((data?.length || 0) / pageSize));
        const start = (page - 1) * pageSize;
        const sliced = Array.isArray(data) ? data.slice(start, start + pageSize) : [];

        const baseUrl = `/${locale}/packages`;

        return <PackagesClient trips={sliced} currentPage={page} totalPages={totalPages} baseUrl={baseUrl} />;
    } catch (error) {
        console.error('Error fetching trips:', error);
        return <PackagesClient trips={[]} currentPage={1} totalPages={1} baseUrl={`/${locale}/packages`} />;
    }
}