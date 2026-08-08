'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';
import {
  Star,
  Clock3,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Download,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';
import { decodeHtml } from '@/lib/decodeHtml';



type Trip = {
  id: number;
  title: string;
  description: string;
  excerpt: string;
  acf: {
    destination: Array<{ name: string }>;
    price: string;
    'old-price': string;
    duration: string;
    advantages: Array<{ text: string }>;
    disadvantages: Array<{ text: string }>;
    days: Array<{ day: { title: string; desc: string } }>;
    rate: string;
    gallery: string[];
    featured: string[];
    'trip-type': string;
    'suggested-hotel': Array<{ text: string }>;
    faq_code: string;
    trip_code: string;
  };
  countries?: Array<{
    term_id: number;
    name: string;
    slug: string;
    term_group: number;
    term_taxonomy_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    filter: string;
  }>;
};

interface TripDetailClientProps {
  trip: Trip;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor">
      <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.607 1.902 6.47L4 29l7.72-1.865A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm0 21.8c-1.96 0-3.79-.55-5.35-1.5l-.383-.228-4.58 1.106 1.13-4.463-.25-.4A9.77 9.77 0 0 1 5.2 15c0-5.96 4.84-10.8 10.8-10.8S26.8 9.04 26.8 15 21.96 24.8 16 24.8zm5.62-8.12c-.31-.155-1.83-.903-2.113-1.006-.283-.104-.489-.155-.696.155-.207.31-.797 1.006-.977 1.213-.18.207-.36.233-.67.078-.31-.155-1.31-.483-2.496-1.54-.923-.823-1.546-1.84-1.727-2.15-.18-.31-.02-.478.135-.632.14-.138.31-.36.465-.54.155-.18.207-.31.31-.516.104-.207.052-.387-.026-.542-.078-.155-.696-1.68-.954-2.3-.252-.606-.508-.524-.696-.534l-.593-.01c-.207 0-.542.078-.826.387-.283.31-1.083 1.06-1.083 2.583s1.109 2.996 1.263 3.203c.155.207 2.183 3.333 5.29 4.674.74.32 1.317.51 1.767.652.742.236 1.418.203 1.953.123.596-.089 1.83-.748 2.088-1.47.258-.723.258-1.343.18-1.47-.077-.128-.283-.207-.593-.362z" />
    </svg>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, (m) => {
    const entities: Record<string, string> = {
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': ' ',
      '&#8211;': '–', '&#8212;': '—', '&#8216;': "'", '&#8217;': "'",
      '&#8220;': '"', '&#8221;': '"',
    };
    return entities[m] ?? m;
  });
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeDay, setActiveDay] = useState<number | null>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const locale = 'ar';

  const destination = trip.acf.destination?.[0]?.name || 'رحلة مميزة';
  const galleryImages = trip.acf.gallery?.filter(Boolean) ?? [];
  const heroImage = galleryImages[0] || '/assets/default-trip.jpg';
  const price = Number(trip.acf.price || '0').toLocaleString();
  const duration = trip.acf.duration || '0';
  const countries = trip.acf.countries || [];
  const description = stripHtml(trip.description || '');
  const excerpt = stripHtml(trip.excerpt || '');
  const rate = Number(trip.acf.rate || '0');
  const tripCode = trip.acf.trip_code || '';
  const includeItems = trip.acf.advantages ?? [];
  const excludeItems = trip.acf.disadvantages ?? [];
  const days = trip.acf.days ?? [];
  const hotels = trip.acf['suggested-hotels'] ?? [];
  const tripType = trip.acf['trip-type'] || 'رحلة جماعية';


  console.log(countries, "countries")

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length)),
    [galleryImages.length]
  );
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % galleryImages.length)),
    [galleryImages.length]
  );

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { default: TripPdfDocument } = await import('./TripPdfDocument');

      // Pre-fetch all images as base64 so react-pdf can render them
      const allImageUrls = ['/logo.png', ...(trip.acf.gallery?.filter(Boolean) ?? [])];
      const base64Images = await Promise.all(
        allImageUrls.map(async (url) => {
          try {
            const absolute = url.startsWith('/') ? `${window.location.origin}${url}` : url;
            const res = await fetch(absolute);
            if (!res.ok) return '';
            const blob = await res.blob();
            return await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = () => resolve('');
              reader.readAsDataURL(blob);
            });
          } catch {
            return '';
          }
        })
      );

      const images = {
        logo: base64Images[0],
        gallery: base64Images.slice(1),
      };

      const blob = await pdf(<TripPdfDocument trip={trip} images={images} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${trip.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('حدث خطأ أثناء إنشاء ملف PDF، حاول مرة أخرى.');
    } finally {
      setIsPdfLoading(false);
    }
  };


  return (
    <div className="bg-[#F8FAFC] py-10 px-4 md:px-8 lg:px-12">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
          >
            <X className="h-6 w-6" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative mx-12 max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImages[lightboxIndex]}
              alt={`${trip.title} - صورة ${lightboxIndex + 1}`}
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-md text-white/70">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      <a href={`https://wa.me/966920032065?text=${encodeURIComponent(
        `مرحباً، أرغب بالاستفسار عن رحلة: ${trip.title}`
      )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-md font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#1DA851]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        تواصل واتساب
      </a>

      <div ref={pdfRef} className="mx-auto flex max-w-[1400px] flex-col gap-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-slate-900 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={trip.title}
            className="h-[420px] w-full object-cover md:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

          {/* Download button */}
          <div className="absolute right-6 top-6">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isPdfLoading}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2.5 text-md font-semibold text-white backdrop-blur-md transition hover:bg-white/30 disabled:opacity-60"
            >
              <Download className={`h-4 w-4 ${isPdfLoading ? 'animate-bounce' : ''}`} />
              {isPdfLoading ? 'جاري التحميل...' : 'تحميل PDF'}
            </button>
          </div>

          <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-4 text-white md:left-12 md:right-auto md:max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-[#016733]/90 px-4 py-2 text-md font-semibold uppercase tracking-[0.14em] shadow-lg shadow-slate-950/30">
              {tripType}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {/* <p className="text-md text-slate-200/90">{destination}</p> */}
                {countries && countries.length > 0 && (
                  <>
                    <span className="text-slate-400">•</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {countries.map((country, idx) => (
                        <span
                          key={country.term_id}
                          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs backdrop-blur-sm"
                        >
                          {country.name}
                          {idx < countries.length - 1 && <span className="text-slate-400">,</span>}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">{decodeHtml(trip.title)}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-md text-slate-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-sm">
                <Star className="h-4 w-4 text-yellow-300" /> {rate.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-sm">
                <Clock3 className="h-4 w-4" /> {duration} أيام
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-sm">
                <ArrowRight className="h-4 w-4" /> {price} ريال
              </span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {galleryImages.length > 1 && (
          <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Images className="h-5 w-5 text-[#016733]" />
              <h2 className="text-xl font-semibold text-[#1c1466]">معرض الصور</h2>
              <span className="ml-auto rounded-full bg-[#F0FFF7] px-3 py-1 text-xs font-medium text-[#016733]">
                {galleryImages.length} صور
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {galleryImages.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${trip.title} - صورة ${idx + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
                    <ZoomIn className="h-7 w-7 scale-0 text-white drop-shadow-lg transition duration-300 group-hover:scale-100" />
                  </div>
                  {idx === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#016733] px-2 py-0.5 text-xs font-semibold text-white">
                      رئيسية
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6 rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-sm">


            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <h3 className="mb-3 text-lg flex gap-2 font-semibold text-[#016733]">مميزات البرنامج                     <Check className="mt-1 h-4 w-4 shrink-0 text-[#016733]" />
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-md text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#016733]" />
                  <span>شامل ضريبة القيمة المضافة</span>
                </li>
                {includeItems.map((item, index) => (
                  <li key={`include-${index}`} className="flex items-start gap-3 text-md text-slate-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#016733]" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4">
              <h3 className="mb-3 text-lg flex gap-2 font-semibold text-[#1c1466]"> البرنامج لا يشمل                    <X className="mt-1 h-4 w-4 shrink-0 text-red-500" /></h3>
              <ul className="space-y-3">
                {excludeItems.map((item, index) => (
                  <li key={`exclude-${index}`} className="flex items-start gap-3 text-md text-slate-700">
                    <X className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {hotels.length > 0 && (
              <div className=" rounded-3xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="mb-3 text-lg font-semibold text-[#016733]">الفنادق المقترحة</h3>
                <ul className="dir-ltr space-y-2 text-md text-slate-700">
                  {hotels.map((hotel, index) => (
                    <li key={`hotel-${index}`} className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#016733]" />
                      {hotel.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[#016733]">ملخص الرحلة</h2>
              <p className="text-md leading-7 text-slate-600">{excerpt}</p>
            </div>

            <div className="grid gap-3 rounded-3xl bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between gap-2 text-md text-slate-700">
                <span>كود الرحلة</span>
                <strong className="text-[#016733]">{tripCode}</strong>
              </div>
              <div className="flex items-center justify-between gap-2 text-md text-slate-700">
                <span>سعر الرحلة</span>
                <strong className="text-[#016733]">{price} ريال</strong>
              </div>
              <div className="flex items-center justify-between gap-2 text-md text-slate-700">
                <span>مدة الرحلة</span>
                <strong>{duration} أيام</strong>
              </div>
              <div className="flex items-center justify-between gap-2 text-md text-slate-700">
                <span>نوع الرحلة</span>
                <strong>{tripType}</strong>
              </div>
            </div>

            {/* Download PDF - sidebar version */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isPdfLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#016733] px-4 py-3 text-md font-semibold text-white transition hover:bg-[#02512c] disabled:opacity-60"
            >
              <Download className={`h-4 w-4 ${isPdfLoading ? 'animate-bounce' : ''}`} />
              {isPdfLoading ? 'جاري التحميل...' : 'تحميل برنامج الرحلة PDF'}
            </button>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4">
              <h3 className="mb-3 text-lg font-semibold text-[#016733]">روابط مفيدة</h3>
              <div className="space-y-2">
                <Link
                  href={`/${locale}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#016733] px-4 py-3 text-md font-semibold text-[#016733] transition hover:bg-[#016733] hover:text-white"
                >
                  العودة للرئيسية
                </Link>

                <a
                  href={`https://wa.me/966920032065?text=${encodeURIComponent(
                    `مرحباً، أرغب بالاستفسار عن رحلة: ${trip.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-md font-semibold text-white transition hover:bg-[#1DA851]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  تواصل عبر واتساب
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1c1466]">وصف البرنامج</h2>
              <p className="mt-4 text-md leading-7 text-slate-700">{description}</p>
            </div>

            <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1c1466]">يوميات الرحلة</h2>
                  <p className="mt-2 text-md text-slate-500">اضغط على كل يوم لعرض تفاصيل المسار.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {days.map((item, index) => {
                  const isOpen = activeDay === index;
                  return (
                    <div
                      key={`day-${index}`}
                      className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDay(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right text-md font-semibold text-[#1c1466]"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#016733] text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          {item.day.title}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#E5E7EB] px-5 py-4 text-md leading-7 text-slate-700">
                          <div className="flex gap-4">
                            <div className="mt-1 h-full w-0.5 shrink-0 self-stretch bg-[#016733]/20" />
                            <p>{item.day.desc}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div >
    </div >
  );
}
