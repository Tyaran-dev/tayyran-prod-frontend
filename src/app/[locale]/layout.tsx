
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Ignore TypeScript module/no-declaration complaints for global CSS import
// @ts-ignore
import "./globals.css";
import { Cairo } from "next/font/google";
import { Almarai } from "next/font/google";
import { Montserrat } from "next/font/google";
import AnimationProvider from "../components/provider/animation-provider";
import StoreProvider from '../components/provider/store-provider'
import Script from "next/script";
import { Suspense } from "react";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./client-layout";
import Navbar from "../components/shared/navbar";
import Footer from "../components/shared/footer/Footer";
import { FloatingChatButton } from "../components/shared/floating-chat/FloatingChatButton";
import { organizationSchema } from "@/lib/schema";
const inter = Inter({
  subsets: ['latin'], // you can specify ['latin', 'cyrillic', etc.]
  display: 'swap',    // optional, but good for performance
  weight: ['400', '700'], // optional: pick weights you want
});

const almarai = Almarai({
  subsets: ['latin', 'arabic'], // or ['latin', 'arabic'] if you want both
  weight: ['300', '400', '700', '800'], // available weights: 300–800
  display: 'swap',
  variable: "--font-almarai",
})

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "حجز طيران بأفضل الأسعار | قارن واحجز رحلتك | منصة طيران",
  description: "ابحث وقارن بين أسعار رحلات الطيران المحلية والدولية مع منصة طيران. حجز تذاكر طيران بسهولة، خيارات دفع متعددة، وأفضل العروض والخصومات. احجز رحلتك الآن!",
  icons: {
    icon: "/logo.png", // or /my-favicon.svg
  },
};

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  function getDirection(locale: string): 'rtl' | 'ltr' {
    return locale === 'ar' ? 'rtl' : 'ltr';
  }

  const dir = getDirection(locale);

  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${montserrat.variable} ${almarai.className}`}
    >

      <head>
        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script id="google-tag-manager" strategy="beforeInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
        <Script src="/langs/lang-config.js" strategy="beforeInteractive" />
        <Script src="/langs/translation.js" strategy="beforeInteractive" />
        <Script src="//translate.google.com/translate_a/element.js?cb=TranslateInit" strategy="afterInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"anonymous"}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{
                display: "none",
                visibility: "hidden",
              }}
            />
          </noscript>
        )}
        <Suspense>
          <AuthProvider>
            <StoreProvider>
              <AnimationProvider>
                {/* <GoogleTranslate /> */}
                <NextIntlClientProvider>
                  <Navbar />
                  {/* <FloatingChatButton /> */}
                  {children}
                  <Footer />
                </NextIntlClientProvider>
              </AnimationProvider>
            </StoreProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
