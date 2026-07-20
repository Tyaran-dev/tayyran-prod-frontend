// ==================== ENHANCED HERO SECTION (Flight Search) ====================

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AiroplanIcon, ArrowCircleIcon, BedIcon } from "@/app/svg";
import { Search, ArrowRightLeft, Plus, Trash2 } from "lucide-react";
import Section from "../../shared/section";
import AirportSearchField from "../../shared/airport-search-field";
import fromImg from "/public/assets/from.png";
import toImg from "/public/assets/to.png";
import Travelers from "../../shared/traveller-field";
import CustomDatePicker from "../../shared/custom-date-picker";
import { LoaderPinwheel } from "lucide-react";
import { changeTripType, clearFlightData, setSearchData } from "@/redux/flights/flightSlice";
import { useDispatch, useSelector } from "react-redux";
import { TripType } from "@/redux/flights/flightSlice";
import { tripTypes } from "../flight-search/search-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import HotelSearch from "../hotel-search/HotelSearch";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useAuthContext } from "@/context/AuthContext";
import { LuSearch } from "react-icons/lu";

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
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const e = useTranslations("errors");
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchedAirports, setSearchedAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [fromError, setFromError] = useState<string | null>(null);
  const [toError, setToError] = useState<string | null>(null);
  const [isHotel, setIsHotel] = useState(false);
  const [searchTermFrom, setSearchTermFrom] = useState("");
  const [searchTermTo, setSearchTermTo] = useState("");
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, adults: 1, children: 0 }]);
  const { user, logout } = useAuthContext();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [flightFormData, setFlightFormData] = useState<FlightFormData>({
    origin: "",
    destination: "",
    departure: today,
    returnDate: tomorrow,
    travelers: { adults, children, infants },
    flightClass: "ECONOMY",
    flightType: "oneway",
    segments: [{ id: "", origin: "", destination: "", date: new Date() }],
  });

  const [hotelFormData, setHotelFormData] = useState({
    address: "",
    checkIn: "",
    checkOut: "",
    travelers: "",
  });

  const flightClassOptions = [
    { label: t("flightClassOptions.economy"), value: "ECONOMY" },
    { label: t("flightClassOptions.premiumEconomy"), value: "PREMIUM_ECONOMY" },
    { label: t("flightClassOptions.business"), value: "BUSINESS" },
    { label: t("flightClassOptions.firstClass"), value: "FIRST" },
  ];

  const tripTypeConfig = [
    { key: "oneway", icon: "→", label: t("tripTypes.oneway") },
    { key: "roundtrip", icon: "⇄", label: t("tripTypes.roundtrip") },
    { key: "multiCities", icon: "⋯", label: t("tripTypes.multiplecities") },
  ];

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

  const handleFlightChange = (name: string, value: any) => {
    setFlightFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "origin") setFromError(null);
    if (name === "destination") setToError(null);
  };

  const handleSegmentChange = (index: number, field: keyof FlightSegment, value: any) => {
    setFlightFormData((prev) => {
      const newSegments = [...prev.segments!];
      newSegments[index] = { ...newSegments[index], [field]: value };
      return { ...prev, segments: newSegments };
    });
  };

  const addFlightSegment = () => {
    setFlightFormData((prev) => ({
      ...prev,
      segments: [
        ...prev.segments!,
        { id: uuidv4(), origin: "", destination: "", date: new Date() },
      ],
    }));
  };

  const removeFlightSegment = (index: number) => {
    if (flightFormData.segments!.length <= 1) return;
    setFlightFormData((prev) => ({
      ...prev,
      segments: prev.segments!.filter((_, i) => i !== index),
    }));
  };

  const handleFlightTypeChange = (type: TripType) => {
    dispatch(changeTripType(type));
    handleFlightChange("flightType", type);
    if (type !== "multiCities") {
      setFlightFormData((prev) => ({
        ...prev,
        segments: [{ id: "", origin: "", destination: "", date: new Date() }],
      }));
    }
  };

  const handleFlightSubmit = () => {
    setLoading(true);
    if (flightFormData.flightType === "multiCities") {
      const hasEmptyFields = flightFormData.segments?.some(
        (segment) => !segment.origin || !segment.destination || !segment.date
      );
      if (hasEmptyFields) {
        setFromError(e("fromError"));
        setToError(e("toError"));
        setLoading(false);
        return;
      }
    } else {
      if (!flightFormData.origin || !flightFormData.destination) {
        if (!flightFormData.origin) setFromError(e("fromError"));
        if (!flightFormData.destination) setToError(e("toError"));
        setLoading(false);
        return;
      }
    }
    dispatch(setSearchData(flightFormData));
    router.push(`/${locale}/flight-search`);
    setLoading(false);
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

              {!isHotel ? (
                <div className="space-y-5">
                  {/* Trip Type Selector */}
                  <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
                    {tripTypes?.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFlightTypeChange(type)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${flightFormData.flightType === type
                          ? "bg-white text-[#016733] shadow-sm shadow-slate-200/50"
                          : "text-slate-500 hover:text-slate-700"
                          }`}
                      >
                        <span className="text-xs">
                          {type === "roundtrip" ? "⇄" : type === "oneway" ? "→" : "⋯"}
                        </span>
                        {type === "roundtrip"
                          ? t("tripTypes.roundtrip")
                          : type === "oneway"
                            ? t("tripTypes.oneway")
                            : t("tripTypes.multiplecities")}
                      </button>
                    ))}
                  </div>

                  {flightFormData.flightType === "multiCities" ? (
                    <div className="space-y-4 max-h-[500px]  pr-1 custom-scrollbar">
                      {flightFormData.segments?.map((segment, index) => (
                        <div
                          key={segment.id || index}
                          className="relative bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4"
                        >
                          {/* Segment Badge */}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#016733] to-[#1c1466] text-white text-xs font-bold">
                              Flight {index + 1}
                            </span>
                            {flightFormData.segments!.length > 1 && (
                              <button
                                onClick={() => removeFlightSegment(index)}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors active:scale-95"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AirportSearchField
                              error={index === 0 ? fromError : undefined}
                              label={t("heroSection.searchForm.fromFieldLabel")}
                              placeholder={t(
                                "heroSection.searchForm.fromFieldLabel"
                              )} className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
                              onSelect={(value) => handleSegmentChange(index, "origin", value)}
                              icon={fromImg}
                            />
                            <AirportSearchField
                              error={index === 0 ? toError : undefined}
                              label={t("heroSection.searchForm.toFieldLabel")}
                              placeholder={t(
                                "heroSection.searchForm.toFieldLabel"
                              )} className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
                              onSelect={(value) => handleSegmentChange(index, "destination", value)}
                              icon={toImg}
                            />
                          </div>

                          <div className="flex items-end gap-3">
                            <div className="flex-1">
                              <CustomDatePicker
                                label={t("heroSection.searchForm.DatePicker")}
                                placeholder="Select date"
                                value={segment.date}
                                className="bg-white border border-slate-200 rounded-xl text-sm"
                                minDate={index > 0 ? flightFormData.segments![index - 1].date || undefined : new Date()}
                                onChange={(date) => handleSegmentChange(index, "date", date)}
                              />
                            </div>
                            <button
                              onClick={addFlightSegment}
                              className="flex items-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AirportSearchField
                          error={fromError}
                          label={t("heroSection.searchForm.fromFieldLabel")}
                          placeholder={t(
                            "heroSection.searchForm.fromFieldLabel"
                          )} className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
                          onSelect={(value) => handleFlightChange("origin", value)}
                          icon={fromImg}
                        />
                        <AirportSearchField
                          error={toError}
                          label={t("heroSection.searchForm.toFieldLabel")}
                          placeholder={t(
                            "heroSection.searchForm.toFieldLabel"
                          )} className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
                          onSelect={(value) => handleFlightChange("destination", value)}
                          icon={toImg}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomDatePicker
                          label={t("heroSection.searchForm.DatePicker")}
                          placeholder="Departure date"
                          value={flightFormData.departure}
                          className="bg-white border border-slate-200 rounded-xl text-sm"
                          minDate={new Date()}
                          onChange={(date) => handleFlightChange("departure", date)}
                        />
                        {flightFormData.flightType === "roundtrip" && (
                          <CustomDatePicker
                            label={t("heroSection.searchForm.returnDate")}
                            placeholder="Return date"
                            value={flightFormData.returnDate}
                            className="bg-white border border-slate-200 rounded-xl text-sm"
                            minDate={flightFormData.departure}
                            onChange={(date) => handleFlightChange("returnDate", date)}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bottom Row: Travelers, Class, Search */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                    <div className="lg:col-span-4">
                      <Travelers
                        label={t("heroSection.searchForm.travelersLabel")}
                        adults={flightFormData.travelers.adults}
                        children={flightFormData.travelers.children}
                        infants={flightFormData.travelers.infants}
                        setFlightFormData={setFlightFormData}
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {t("heroSection.searchForm.classLabel")}
                      </label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#016733] focus:ring-2 focus:ring-[#016733]/10 transition-all cursor-pointer"
                          value={flightFormData.flightClass}
                          onChange={(e) => handleFlightChange("flightClass", e.target.value)}
                        >
                          {flightClassOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <button
                        disabled={loading}
                        onClick={handleFlightSubmit}
                        className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/30"
                        style={{
                          background: "linear-gradient(135deg, #016733, #1c1466)",
                        }}
                      >
                        {loading ? (
                          <>
                            <LoaderPinwheel className="w-5 h-5 animate-spin" />
                            <span>{t("heroSection.searchForm.searchButtonLoading")}</span>
                          </>
                        ) : (
                          <>
                            <LuSearch className="w-5 h-5" />
                            <span>{t("heroSection.searchForm.searchButton")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
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