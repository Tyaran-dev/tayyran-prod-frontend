// ==================== ENHANCED HERO SECTION (Flight Search) ====================

import React, { useEffect, useState } from "react";
import { AiroplanIcon, BedIcon } from "@/app/svg";
import { ArrowRightLeft, Plus, Trash2 } from "lucide-react";
import Section from "../../shared/section";

import FlightSearchForm from "../flight-search/search-form";
import axios from "axios";
import HotelSearch from "../hotel-search/HotelSearch";
import { useTranslations } from "next-intl";

export interface FlightSegment {
  id: string;
  origin: string;
  destination: string;
  date: Date;
}

interface FlightFormData {
  origin: string;
  destination: string;
  departure: Date;
  returnDate: Date;
  travelers: { adults: number; children: number; infants: number };
  flightClass: string;
  flightType: string;
  segments?: FlightSegment[];
}

interface Room {
  id: number;
  adults: number;
  children: number;
}

const HeroSection = () => {
  const t = useTranslations("HomePage");
  const [searchedAirports, setSearchedAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isHotel, setIsHotel] = useState(false);
  const [searchTermFrom, setSearchTermFrom] = useState("");
  const [searchTermTo, setSearchTermTo] = useState("");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const GetAirpports = async (keyword: string) => {
    try {
      setLoading(true);
      const data = await axios.get(`/api/airports?keyword=${keyword}`);
      setSearchedAirports(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHotlFlight = () => setIsHotel(!isHotel);

  useEffect(() => {
    if (searchTermFrom) GetAirpports(searchTermFrom);
    if (searchTermTo) GetAirpports(searchTermTo);
  }, [searchTermFrom, searchTermTo]);

  return (
    <div
      className={`w-full ${isHotel ? "bg-heroHotelsBanner" : "bg-heroFligthsBanner"} min-h-[85vh] py-20 lg:py-28 flex items-center bg-bottom bg-no-repeat bg-cover relative`}
    >
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />

      <Section className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12">
          {/* Hero Text */}
          <div className="w-full text-white flex flex-col text-center lg:text-left gap-5">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight">
              {t("heroSection.mainHeading")}
            </h1>
            <p className="font-montserrat font-semibold text-lg md:text-xl opacity-90">
              {t("heroSection.subHeading")}
            </p>
          </div>

          {/* Search Card */}
          <div className="relative bg-white w-full max-w-[780px]  rounded-3xl shadow-2xl shadow-slate-900/20 ">
            {/* Decorative top gradient line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#016733] via-[#1c1466] to-[#016733]" />

            <div className="p-5 md:p-8">
              {/* Toggle Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isHotel ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"} transition-colors duration-300`}>
                    {isHotel ? <BedIcon color="currentColor" /> : <AiroplanIcon color="currentColor" />}
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {isHotel ? t("heroSection.searchForm.formTypeHotels") : t("heroSection.searchForm.formTypeFlights")}
                  </h2>
                </div>

                <button
                  onClick={toggleHotlFlight}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-300 active:scale-95"
                >
                  <ArrowRightLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">
                    {isHotel ? t("heroSection.searchForm.formTypeFlights") : t("heroSection.searchForm.formTypeHotels")}
                  </span>
                </button>
              </div>

              {!isHotel ? <FlightSearchForm />
                : (
                  <HotelSearch />
                )}
            </div>
          </div>
        </div>
      </Section>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;