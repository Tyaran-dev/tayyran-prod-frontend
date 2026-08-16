"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  User,
  LogIn,
  Plane,
  Hotel,
  MapPin,
  Clock,
  Luggage,
  Ticket,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CreditCard,
  Tag,
  Utensils,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { UserData } from "@/types/user";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";

/* ─── Types ─── */
interface Booking {
  _id: string;
  invoiceId: string;
  paymentId?: string;
  status: string;
  InvoiceValue: number;
  bookingType: "flight" | "hotel";
  orderData?: any;
  bookingPayload?: any;
  createdAt: string;
}

type TabType = "all" | "flight" | "hotel";

/* ─── Helpers ─── */
const formatDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

const formatDuration = (isoDuration: string) => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  const h = match[1] ? `${match[1]}h` : "";
  const m = match[2] ? `${match[2]}m` : "";
  return `${h} ${m}`.trim();
};

/* ─── Sub-Components ─── */

const StatusBadge = ({ status }: { status: string }) => {
  const t = useTranslations("Bookings");
  const b = useTranslations("ProfilePage");
  const statusKey = status as keyof typeof statusStyles;
  const style =
    statusStyles[statusKey] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {t(`status.${status}` as any) || status}
    </span>
  );
};

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  ISSUED: "bg-blue-100 text-blue-700 border-blue-200",
};

const EmptyState = () => {
  const t = useTranslations("Bookings");
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
      <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {t("emptyTitle")}
      </h3>
      <p className="text-slate-500 max-w-sm mx-auto">{t("emptyMessage")}</p>
    </div>
  );
};

const FlightBookingCard = ({
  booking,
  isRTL,
}: {
  booking: Booking;
  isRTL: boolean;
}) => {
  const t = useTranslations("Bookings");
  const b = useTranslations("ProfilePage");
  const [expanded, setExpanded] = useState(false);

  const data = booking.orderData?.data;
  const offer = data?.flightOffers?.[0];
  const segment = offer?.itineraries?.[0]?.segments?.[0];
  const airlines = booking.orderData?.airlines || {};
  const airports = booking.orderData?.airports || {};
  const traveler = data?.travelers?.[0];
  const ticket = data?.tickets?.[0];
  const pnr = data?.associatedRecords?.[0]?.reference;

  if (!segment) return null;

  const airline = airlines[segment.carrierCode];
  const depAirport = airports[segment.departure.iataCode];
  const arrAirport = airports[segment.arrival.iataCode];
  const travelerPricing = offer?.travelerPricings?.[0];
  const fareDetails = travelerPricing?.fareDetailsBySegment?.[0];
  const bagCount = fareDetails?.includedCheckedBags?.quantity || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Plane className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t("flight.label")}</p>
            <p className="font-semibold text-slate-800">
              {segment.departure.iataCode} → {segment.arrival.iataCode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={booking.status} />
          <span className="font-bold text-emerald-700">
            {offer?.price?.total || booking.InvoiceValue}{" "}
            {offer?.price?.currency || "SAR"}
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            <p className="text-2xl font-bold text-slate-800">
              {formatTime(segment.departure.at)}
            </p>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {depAirport?.city?.[isRTL ? "ar" : "en"] ||
                segment.departure.iataCode}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {t("flight.terminal")} {segment.departure.terminal || "-"}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center px-2">
            <p className="text-xs text-slate-400 mb-1">
              {formatDuration(segment.duration)}
            </p>
            <div className="w-full flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-300" />
              {isRTL ? (
                <ArrowLeft className="h-4 w-4 text-slate-400 shrink-0" />
              ) : (
                <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
              )}
              <div className="h-px flex-1 bg-slate-300" />
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {airline?.name?.[isRTL ? "ar" : "en"] || segment.carrierCode}{" "}
              {segment.number}
            </p>
            <p className="text-[10px] text-slate-400">
              {segment.aircraft?.code &&
                `${t("flight.aircraft")} ${segment.aircraft.code}`}
            </p>
          </div>

          <div className={`flex-1 ${isRTL ? "text-left" : "text-right"}`}>
            <p className="text-2xl font-bold text-slate-800">
              {formatTime(segment.arrival.at)}
            </p>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {arrAirport?.city?.[isRTL ? "ar" : "en"] ||
                segment.arrival.iataCode}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {t("flight.terminal")} {segment.arrival.terminal || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(segment.departure.at, isRTL ? "ar" : "en")}
          <span className="mx-1">•</span>
          <Clock className="h-3.5 w-3.5" />
          {t("flight.nonStop")}
        </div>
      </div>

      {/* Expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        {expanded ? t("flight.hideDetails") : t("flight.viewDetails")}
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {expanded && (
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
          {/* Passenger & Booking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                {t("flight.passenger")}
              </p>
              <p className="font-semibold text-slate-800">
                {traveler?.name?.firstName} {traveler?.name?.lastName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {traveler?.documents?.[0]?.documentType} •{" "}
                {traveler?.documents?.[0]?.number}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                {t("flight.bookingDetails")}
              </p>
              <div className="space-y-1">
                {pnr && (
                  <p className="text-sm text-slate-700 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" />
                    {t("flight.pnr")}:{" "}
                    <span className="font-mono font-medium">{pnr}</span>
                  </p>
                )}
                {ticket && (
                  <p className="text-sm text-slate-700 flex items-center gap-2">
                    <Ticket className="h-3.5 w-3.5 text-emerald-600" />
                    {t("flight.ticket")}:{" "}
                    <span className="font-mono font-medium">
                      {ticket.documentNumber}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
              {t("flight.servicesAndBaggage")}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <CreditCard className="h-3.5 w-3.5" />
                {travelerPricing?.fareOption || "STANDARD"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <Luggage className="h-3.5 w-3.5" />
                {t("flight.checkedBags", { count: bagCount })}
              </span>
              {fareDetails?.mealServices?.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                  <Utensils className="h-3.5 w-3.5" />
                  {t("flight.meal")}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <Briefcase className="h-3.5 w-3.5" />
                {fareDetails?.cabin || "ECONOMY"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
              {t("flight.priceBreakdown")}
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t("flight.baseFare")}</span>
                <span>
                  {offer?.price?.base} {offer?.price?.currency}
                </span>
              </div>
              {travelerPricing?.price?.taxes?.map((tax: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between text-slate-500 text-xs"
                >
                  <span>
                    {t("flight.tax")} {tax.code}
                  </span>
                  <span>
                    {tax.amount} {offer?.price?.currency}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-1 mt-1 flex justify-between font-bold text-slate-800">
                <span>{t("flight.total")}</span>
                <span className="text-emerald-700">
                  {offer?.price?.grandTotal || booking.InvoiceValue}{" "}
                  {offer?.price?.currency || "SAR"}
                </span>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="text-xs text-slate-400 text-center">
            {t("flight.bookedOn")}{" "}
            {formatDate(booking.createdAt, isRTL ? "ar" : "en")} •{" "}
            {t("flight.invoice")}: {booking.invoiceId}
          </div>
        </div>
      )}
    </div>
  );
};

const HotelBookingCard = ({
  booking,
  isRTL,
}: {
  booking: Booking;
  isRTL: boolean;
}) => {
  const t = useTranslations("Bookings");
    const b = useTranslations("ProfilePage");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Hotel className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t("hotel.label")}</p>
            <p className="font-semibold text-slate-800">{t("hotel.details")}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{t("hotel.comingSoon")}</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Tabs Component ─── */
const BookingTabs = ({
  activeTab,
  onChange,
  counts,
  isRTL,
}: {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  counts: Record<TabType, number>;
  isRTL: boolean;
}) => {
  const t = useTranslations("Bookings");
  const b = useTranslations("ProfilePage");

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    {
      key: "all",
      label: t("tabs.all"),
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      key: "flight",
      label: t("tabs.flights"),
      icon: <Plane className="h-4 w-4" />,
    },
    {
      key: "hotel",
      label: t("tabs.hotels"),
      icon: <Hotel className="h-4 w-4" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 flex items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
              ${
                isActive
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE — FIXED TO MATCH YOUR AUTH CONTEXT
   ═══════════════════════════════════════════════════════════════ */
const Page = () => {
  const t = useTranslations("Bookings");
  const b = useTranslations("ProfilePage");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  /* ── YOUR AUTH CONTEXT: null = still loading ── */
  if (user === null) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
          <p className="mt-4 text-slate-600">{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  /* ── YOUR AUTH CONTEXT: false = not logged in ── */
  if (user === false) {
      return (
            <div className={` ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="container mx-auto px-4 py-8 ">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center py-12">
                            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User className="h-12 w-12 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                {b("notLoggedInTitle") || "Welcome to Your Profile"}
                            </h2>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                {b("notLoggedInMessage") || "Please log in to view and manage your profile information."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/login"
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
                                >
                                    <LogIn className="h-5 w-5" />
                                    {b("loginButton") || "Log In"}
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                                >
                                    {b("registerButton") || "Create Account"}
                                </Link>
                            </div>
                            <p className="text-sm text-slate-500 mt-8">
                                {b("loginHint") || "Don't have an account yet? Sign up to get started!"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
  }

  /* ── User is an object → logged in ── */
  const bookings: Booking[] = (user as any)?.bookings || [];
  const flightBookings = bookings.filter((b) => b.bookingType === "flight");
  const hotelBookings = bookings.filter((b) => b.bookingType === "hotel");

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : activeTab === "flight"
      ? flightBookings
      : hotelBookings;

  const counts: Record<TabType, number> = {
    all: bookings.length,
    flight: flightBookings.length,
    hotel: hotelBookings.length,
  };

  return (
    <div
      className={`min-h-screen  pb-12 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-slate-500">
            {t("subtitle", { count: bookings.length })}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <BookingTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            counts={counts}
            isRTL={isRTL}
          />
        </div>

        {/* Content */}
        {filteredBookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) =>
              booking.bookingType === "flight" ? (
                <FlightBookingCard
                  key={booking._id}
                  booking={booking}
                  isRTL={isRTL}
                />
              ) : (
                <HotelBookingCard
                  key={booking._id}
                  booking={booking}
                  isRTL={isRTL}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;