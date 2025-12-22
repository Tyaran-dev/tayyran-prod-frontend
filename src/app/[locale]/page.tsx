"use client";

import { useState, useEffect } from "react";
import BestOffer from "../components/website/home/best-offer";
import HeroSection from "../components/website/home/hero-section";
import TopHotels from "../components/website/home/top-hotels";
import TopDeals from "../components/website/home/top-deals";
import Footer from "../components/shared/footer/Footer";
import TopFlights from "../components/website/home/popular-fligts";
import MobileAppSection from "../components/website/home/mobile-app-section";
import Navbar from "../components/shared/navbar";
import { Toaster } from "react-hot-toast";
import { useTranslations } from "next-intl";
import Milecoin from "../components/website/home/Milecoin";
import EnhancedIntro from "../components/shared/Feedback/EnhancedIntro";

export default function Home() {
  const t = useTranslations("HomePage");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let current = 0;

    interval = setInterval(() => {
      current += 5;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 700);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <EnhancedIntro onComplete={() => setLoading(false)} />;
  }
  // ✅ Main Content
    return (
      <div className="animate-fadeInSlow fade-in transition-opacity duration-700">
        <Toaster />
        <div className="sticky top-0 left-0 z-50">
          <Navbar />
        </div>
        <HeroSection />
        <Milecoin />
        <TopHotels t={t} />
        <BestOffer t={t} />
        {/* <TopDeals t={t} /> */}
        <TopFlights t={t} />
        <MobileAppSection t={t} />
        <Footer />
      </div>
    );
  
}
