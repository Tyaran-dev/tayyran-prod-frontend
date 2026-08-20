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

interface HotelCancellationPolicy {
  FromDate: string;
  ChargeType: "Fixed" | "Percentage" | string;
  CancellationCharge: number;
}

interface HotelRoom {
  Name: string[];
  BookingCode: string;
  Inclusion: string;
  DayRates: {
    BasePrice: number;
  }[][];
  TotalFare: number;
  TotalTax: number;
  CancelPolicies: HotelCancellationPolicy[];
  MealType: string;
  IsRefundable: boolean;
  WithTransfers: boolean;
}

interface HotelFees {
  HotelId: string;
  Optional: {
    FeesType: string;
    FeesValue: number;
    FeesCategory: string;
    Currency: string;
    ChargeType: string;
    FeesInclusion: string;
  }[];
  Mandatory: {
    FeesType: string;
    FeesValue: number;
    FeesCategory: string;
    Currency: string;
    ChargeType: string;
    FeesInclusion: string;
  }[];
}

interface HotelDetails {
  HotelCode: string;
  HotelName: string;
  Description?: string;
  HotelFacilities?: string[];
  Attractions?: Record<string, string>;
  Image?: string;
  Images?: string[];
  Address?: string;
  PinCode?: string;
  CityId?: string;
  CountryName?: string;
  PhoneNumber?: string;
  Email?: string;
  HotelWebsiteUrl?: string;
  FaxNumber?: string;
  Map?: string;
  HotelRating?: number;
  CityName?: string;
  CountryCode?: string;
  CheckInTime?: string;
  CheckOutTime?: string;
  HotelFees?: HotelFees;
}

interface HotelBookingRoomData {
  HotelCode: string;
  Currency: string;
  Rooms: HotelRoom[];
  RateConditions: string[];
}

interface HotelSearchParam {
  Adults: number;
  Children: number;
  ChildrenAges: number[];
}

interface HotelBookingDetails {
  hotel: HotelDetails;
  room: HotelBookingRoomData;
  searchParams: HotelSearchParam[];
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

  const [expanded, setExpanded] = useState(false);

  // ============================================
  // HOTEL BOOKING DATA
  // ============================================

  const hotelData = booking.bookingPayload?.hotelData;

  const hotel = hotelData?.hotelDetails?.hotel;

  const roomData = hotelData?.hotelDetails?.room;

  const rooms = roomData?.Rooms || [];

  const rateConditions =
    roomData?.RateConditions || [];

  const searchParams =
    hotelData?.hotelDetails?.searchParams || [];

  // ============================================
  // HELPERS
  // ============================================

  const stripHtml = (html?: string) => {
    if (!html) return "";

    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  };

  const formatCancellationDate = (date?: string) => {
    if (!date) return "-";

    const parsed = new Date(
      date.replace(
        /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5:$6"
      )
    );

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return formatDate(
      parsed.toISOString(),
      isRTL ? "ar" : "en"
    );
  };

  // ============================================
  // GUESTS
  // ============================================

  const customerDetails =
    hotelData?.CustomerDetails || [];

  const customers = customerDetails.flatMap(
    (room: any) => room.CustomerNames || []
  );

  const adults = customers.filter(
    (customer: any) => customer.Type === "Adult"
  );

  const children = customers.filter(
    (customer: any) => customer.Type === "Child"
  );

  const adultCount = adults.length;

  const childCount = children.length;

  // ============================================
  // ROOM COUNTS
  // ============================================

  const roomCount =
    rooms.length ||
    customerDetails.length ||
    0;

  // ============================================
  // PRICE
  // ============================================

  const totalFare =
    hotelData?.TotalFare ??
    roomData?.Rooms?.reduce(
      (sum: number, room: any) =>
        sum + Number(room.TotalFare || 0),
      0
    ) ??
    booking.InvoiceValue ??
    0;

  const totalTax =
    roomData?.Rooms?.reduce(
      (sum: number, room: any) =>
        sum + Number(room.TotalTax || 0),
      0
    ) ?? 0;

  const currency =
    roomData?.Currency ||
    "SAR";

  // ============================================
  // HOTEL IMAGE
  // ============================================

  const hotelImage =
    hotel?.Image ||
    hotel?.Images?.[0] ||
    "";

  // ============================================
  // HOTEL DESCRIPTION
  // ============================================

  const hotelDescription = stripHtml(
    hotel?.Description
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">

      {/* ================================================= */}
      {/* HOTEL HEADER */}
      {/* ================================================= */}

      <div className="relative">

        {/* Hotel Image */}

        {hotelImage && (
          <div className="relative w-full h-56 overflow-hidden">
            <img
              src={hotelImage}
              alt={hotel?.HotelName || "Hotel"}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-5 right-5 text-white">

              <div className="flex items-center gap-2 mb-1">

                <Hotel className="h-5 w-5" />

                <span className="text-sm font-medium">
                  {t("hotel.label")}
                </span>

              </div>

              <h2 className="text-2xl font-bold">
                {hotel?.HotelName ||
                  t("hotel.unknownHotel")}
              </h2>

              {hotel?.CityName && (
                <p className="text-sm text-white/80 mt-1">
                  {hotel.CityName}
                  {hotel.CountryName
                    ? `, ${hotel.CountryName}`
                    : ""}
                </p>
              )}

            </div>

            {/* Status */}

            <div className="absolute top-4 right-4">
              <StatusBadge status={booking.status} />
            </div>
          </div>
        )}

        {!hotelImage && (
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <Hotel className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  {t("hotel.label")}
                </p>

                <h2 className="font-bold text-lg text-slate-800">
                  {hotel?.HotelName ||
                    t("hotel.unknownHotel")}
                </h2>
              </div>

            </div>

            <StatusBadge status={booking.status} />

          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* HOTEL BASIC INFORMATION */}
      {/* ================================================= */}

      <div className="p-5">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

          <div>

            {/* Rating */}

            {hotel?.HotelRating !== undefined && (
              <div className="flex items-center gap-2 mb-2">

                <span className="text-yellow-500">
                  {"★".repeat(
                    Math.min(
                      Number(hotel.HotelRating) || 0,
                      5
                    )
                  )}
                </span>

                <span className="text-sm text-slate-500">
                  {hotel.HotelRating}{" "}
                  {t("hotel.stars")}
                </span>

              </div>
            )}

            {/* Address */}

            {hotel?.Address && (
              <div className="flex items-start gap-2 text-sm text-slate-600">

                <MapPin className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" />

                <span>
                  {hotel.Address}
                  {hotel.CityName
                    ? `, ${hotel.CityName}`
                    : ""}
                  {hotel.CountryName
                    ? `, ${hotel.CountryName}`
                    : ""}
                </span>

              </div>
            )}

          </div>

          {/* Price */}

          <div className="text-left rtl:text-right lg:text-right">

            <p className="text-xs text-slate-400">
              {t("hotel.totalPrice")}
            </p>

            <p className="text-2xl font-bold text-blue-700">
              {Number(totalFare).toFixed(2)}{" "}
              {currency}
            </p>

            {totalTax > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                {t("hotel.tax")}:{" "}
                {Number(totalTax).toFixed(2)}{" "}
                {currency}
              </p>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* BOOKING SUMMARY */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">

          {/* Rooms */}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

            <div className="flex items-center gap-2 mb-2">
              <Hotel className="h-4 w-4 text-blue-600" />

              <span className="text-xs text-slate-400 uppercase">
                {t("hotel.rooms")}
              </span>
            </div>

            <p className="font-semibold text-slate-800">
              {roomCount}{" "}
              {roomCount === 1
                ? t("hotel.room")
                : t("hotel.rooms")}
            </p>

          </div>

          {/* Adults */}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-blue-600" />

              <span className="text-xs text-slate-400 uppercase">
                {t("hotel.adults")}
              </span>
            </div>

            <p className="font-semibold text-slate-800">
              {adultCount}
            </p>

          </div>

          {/* Children */}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-blue-600" />

              <span className="text-xs text-slate-400 uppercase">
                {t("hotel.children")}
              </span>
            </div>

            <p className="font-semibold text-slate-800">
              {childCount}
            </p>

          </div>

          {/* Meal */}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-blue-600" />

              <span className="text-xs text-slate-400 uppercase">
                {t("hotel.meal")}
              </span>
            </div>

            <p className="font-semibold text-slate-800">
              {rooms[0]?.MealType ||
                rooms[0]?.Inclusion ||
                "-"}
            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* ROOM DETAILS */}
        {/* ================================================= */}

        <div className="mt-5">

          <h3 className="font-semibold text-slate-800 mb-3">
            {t("hotel.roomDetails")}
          </h3>

          <div className="space-y-3">

            {rooms.map(
              (room: any, index: number) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >

                  <div className="p-4 bg-slate-50">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>

                        <p className="font-semibold text-slate-800">
                          {Array.isArray(room.Name)
                            ? room.Name.join(", ")
                            : room.Name ||
                            t("hotel.room")}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {room.Inclusion ||
                            room.MealType ||
                            "-"}
                        </p>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="font-bold text-blue-700">
                          {Number(
                            room.TotalFare || 0
                          ).toFixed(2)}{" "}
                          {currency}
                        </p>

                        {Number(room.TotalTax || 0) >
                          0 && (
                            <p className="text-xs text-slate-400">
                              {t("hotel.tax")}:{" "}
                              {Number(
                                room.TotalTax
                              ).toFixed(2)}{" "}
                              {currency}
                            </p>
                          )}

                      </div>

                    </div>

                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Refundable */}

                    <div>
                      <p className="text-xs text-slate-400">
                        {t("hotel.refundability")}
                      </p>

                      <p
                        className={`text-sm font-medium ${room.IsRefundable
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {room.IsRefundable
                          ? t("hotel.refundable")
                          : t("hotel.nonRefundable")}
                      </p>
                    </div>

                    {/* Meal */}

                    <div>
                      <p className="text-xs text-slate-400">
                        {t("hotel.meal")}
                      </p>

                      <p className="text-sm font-medium text-slate-800">
                        {room.MealType ||
                          room.Inclusion ||
                          "-"}
                      </p>
                    </div>

                    {/* Transfers */}

                    <div>
                      <p className="text-xs text-slate-400">
                        {t("hotel.transfers")}
                      </p>

                      <p className="text-sm font-medium text-slate-800">
                        {room.WithTransfers
                          ? t("hotel.included")
                          : t("hotel.notIncluded")}
                      </p>
                    </div>

                    {/* Booking code */}

                    <div>
                      <p className="text-xs text-slate-400">
                        {t("hotel.bookingCode")}
                      </p>

                      <p className="text-xs font-mono text-slate-700 break-all">
                        {room.BookingCode || "-"}
                      </p>
                    </div>

                  </div>

                  {/* Day Rates */}

                  {room.DayRates?.length > 0 && (
                    <div className="px-4 pb-4">

                      <p className="text-xs text-slate-400 uppercase mb-2">
                        {t("hotel.dailyRates")}
                      </p>

                      <div className="space-y-2">

                        {room.DayRates.flatMap(
                          (rateGroup: any[], groupIndex: number) =>
                            rateGroup.map(
                              (
                                rate: any,
                                rateIndex: number
                              ) => (
                                <div
                                  key={`${groupIndex}-${rateIndex}`}
                                  className="flex justify-between items-center text-sm bg-slate-50 rounded-md px-3 py-2"
                                >
                                  <span className="text-slate-500">
                                    {t("hotel.rate")}{" "}
                                    {rateIndex + 1}
                                  </span>

                                  <span className="font-medium text-slate-800">
                                    {Number(
                                      rate.BasePrice || 0
                                    ).toFixed(2)}{" "}
                                    {currency}
                                  </span>
                                </div>
                              )
                            )
                        )}

                      </div>

                    </div>
                  )}

                </div>
              )
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* EXPAND DETAILS */}
        {/* ================================================= */}

        <button
          onClick={() =>
            setExpanded((value) => !value)
          }
          className="w-full mt-5 px-5 py-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {expanded
            ? t("hotel.hideDetails")
            : t("hotel.viewDetails")}

          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {/* ================================================= */}
        {/* EXPANDED HOTEL INFORMATION */}
        {/* ================================================= */}

        {expanded && (
          <div className="mt-5 space-y-5">

            {/* --------------------------------------------- */}
            {/* HOTEL INFORMATION */}
            {/* --------------------------------------------- */}

            <div className="border border-slate-200 rounded-lg p-5">

              <h3 className="font-semibold text-slate-800 mb-4">
                {t("hotel.hotelInformation")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.hotelCode")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.HotelCode || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.rating")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.HotelRating || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.city")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.CityName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.country")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.CountryName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.address")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.Address || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.postalCode")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.PinCode || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.phone")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.PhoneNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.email")}
                  </p>

                  <p className="text-sm font-medium text-slate-800 break-all">
                    {hotel?.Email || "-"}
                  </p>
                </div>

              </div>

            </div>

            {/* --------------------------------------------- */}
            {/* CHECK IN / CHECK OUT */}
            {/* --------------------------------------------- */}

            <div className="border border-slate-200 rounded-lg p-5">

              <h3 className="font-semibold text-slate-800 mb-4">
                {t("hotel.checkInOut")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-slate-50 rounded-lg p-4">

                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />

                    <span className="text-xs text-slate-400">
                      {t("hotel.checkIn")}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800">
                    {hotel?.CheckInTime || "-"}
                  </p>

                </div>

                <div className="bg-slate-50 rounded-lg p-4">

                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />

                    <span className="text-xs text-slate-400">
                      {t("hotel.checkOut")}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800">
                    {hotel?.CheckOutTime || "-"}
                  </p>

                </div>

              </div>

              <p className="text-xs text-amber-600 mt-3">
                {t("hotel.stayDatesNotAvailable")}
              </p>

            </div>

            {/* --------------------------------------------- */}
            {/* HOTEL FACILITIES */}
            {/* --------------------------------------------- */}

            {hotel?.HotelFacilities?.length > 0 && (
              <div className="border border-slate-200 rounded-lg p-5">

                <h3 className="font-semibold text-slate-800 mb-4">
                  {t("hotel.facilities")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">

                  {hotel.HotelFacilities.map(
                    (facility: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />

                        {facility}
                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* --------------------------------------------- */}
            {/* ATTRACTIONS */}
            {/* --------------------------------------------- */}

            {hotel?.Attractions &&
              Object.keys(hotel.Attractions).length > 0 && (
                <div className="border border-slate-200 rounded-lg p-5">

                  <h3 className="font-semibold text-slate-800 mb-4">
                    {t("hotel.attractions")}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">

                    {Object.entries(
                      hotel.Attractions
                    ).map(
                      (
                        [key, attraction]: [
                          string,
                          unknown
                        ]
                      ) => (
                        <div
                          key={key}
                          className="text-sm text-slate-600"
                        >
                          {String(attraction)}
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* --------------------------------------------- */}
            {/* CANCELLATION POLICIES */}
            {/* --------------------------------------------- */}

            {rooms.some(
              (room: any) =>
                room.CancelPolicies?.length > 0
            ) && (
                <div className="border border-slate-200 rounded-lg p-5">

                  <h3 className="font-semibold text-slate-800 mb-4">
                    {t("hotel.cancellationPolicies")}
                  </h3>

                  <div className="space-y-2">

                    {rooms.flatMap(
                      (room: any, roomIndex: number) =>
                        (room.CancelPolicies || []).map(
                          (
                            policy: any,
                            policyIndex: number
                          ) => (
                            <div
                              key={`${roomIndex}-${policyIndex}`}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50 border border-slate-100 rounded-lg p-3"
                            >

                              <div>

                                <p className="text-sm font-medium text-slate-800">
                                  {formatCancellationDate(
                                    policy.FromDate
                                  )}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {policy.ChargeType}
                                </p>

                              </div>

                              <p className="font-semibold text-slate-700">
                                {policy.ChargeType ===
                                  "Percentage"
                                  ? `${policy.CancellationCharge}%`
                                  : `${Number(
                                    policy.CancellationCharge ||
                                    0
                                  ).toFixed(2)} ${currency}`}
                              </p>

                            </div>
                          )
                        )
                    )}

                  </div>

                </div>
              )}



            {/* --------------------------------------------- */}
            {/* HOTEL FEES */}
            {/* --------------------------------------------- */}

            {hotel?.HotelFees && (
              <div className="border border-slate-200 rounded-lg p-5">

                <h3 className="font-semibold text-slate-800 mb-4">
                  {t("hotel.hotelFees")}
                </h3>

                <div className="space-y-3">

                  {hotel.HotelFees.Optional?.map(
                    (fee: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50 rounded-lg p-3"
                      >

                        <div>
                          <p className="font-medium text-slate-800">
                            {fee.FeesType}
                          </p>

                          <p className="text-xs text-slate-400">
                            {fee.ChargeType}
                          </p>
                        </div>

                        <p className="font-semibold text-slate-700">
                          {fee.FeesValue}{" "}
                          {fee.Currency}
                        </p>

                      </div>
                    )
                  )}

                  {hotel.HotelFees.Mandatory?.map(
                    (fee: any, index: number) => (
                      <div
                        key={`mandatory-${index}`}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-red-50 rounded-lg p-3"
                      >

                        <div>
                          <p className="font-medium text-slate-800">
                            {fee.FeesType}
                          </p>

                          <p className="text-xs text-red-500">
                            {t("hotel.mandatory")}
                          </p>
                        </div>

                        <p className="font-semibold text-slate-700">
                          {fee.FeesValue}{" "}
                          {fee.Currency}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* --------------------------------------------- */}
            {/* GUEST INFORMATION */}
            {/* --------------------------------------------- */}

            <div className="border border-slate-200 rounded-lg p-5">

              <h3 className="font-semibold text-slate-800 mb-4">
                {t("hotel.guestInformation")}
              </h3>

              <div className="space-y-2">

                {customers.map(
                  (customer: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                    >

                      <div className="flex items-center gap-2">

                        <User className="h-4 w-4 text-blue-600" />

                        <span className="text-sm font-medium text-slate-800">
                          {customer.Title}{" "}
                          {customer.FirstName}{" "}
                          {customer.LastName}
                        </span>

                      </div>

                      <span className="text-xs text-slate-400">
                        {customer.Type}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* --------------------------------------------- */}
            {/* BOOKING INFORMATION */}
            {/* --------------------------------------------- */}

            <div className="border border-slate-200 rounded-lg p-5">

              <h3 className="font-semibold text-slate-800 mb-4">
                {t("hotel.bookingInformation")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.bookingReference")}
                  </p>

                  <p className="font-mono text-sm font-medium text-slate-800 break-all">
                    {hotelData?.BookingReferenceId ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.clientReference")}
                  </p>

                  <p className="font-mono text-sm font-medium text-slate-800 break-all">
                    {hotelData?.ClientReferenceId ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.bookingCode")}
                  </p>

                  <p className="font-mono text-xs text-slate-700 break-all">
                    {hotelData?.BookingCode || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.invoiceId")}
                  </p>

                  <p className="font-medium text-sm text-slate-800">
                    {booking.invoiceId || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.paymentId")}
                  </p>

                  <p className="font-mono text-xs text-slate-700 break-all">
                    {booking.paymentId || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.paymentMode")}
                  </p>

                  <p className="font-medium text-sm text-slate-800">
                    {hotelData?.PaymentMode || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.bookingType")}
                  </p>

                  <p className="font-medium text-sm text-slate-800">
                    {hotelData?.BookingType || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.createdAt")}
                  </p>

                  <p className="font-medium text-sm text-slate-800">
                    {formatDate(
                      booking.createdAt,
                      isRTL ? "ar" : "en"
                    )}
                  </p>
                </div>

              </div>

            </div>

            {/* --------------------------------------------- */}
            {/* CONTACT INFORMATION */}
            {/* --------------------------------------------- */}

            <div className="border border-slate-200 rounded-lg p-5">

              <h3 className="font-semibold text-slate-800 mb-4">
                {t("hotel.contactInformation")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.bookingEmail")}
                  </p>

                  <p className="text-sm font-medium text-slate-800 break-all">
                    {hotelData?.EmailId || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.bookingPhone")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotelData?.PhoneNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.hotelPhone")}
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {hotel?.PhoneNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t("hotel.hotelEmail")}
                  </p>

                  <p className="text-sm font-medium text-slate-800 break-all">
                    {hotel?.Email || "-"}
                  </p>
                </div>

              </div>

            </div>

            {/* --------------------------------------------- */}
            {/* SEARCH / GUEST REQUIREMENTS */}
            {/* --------------------------------------------- */}

            {searchParams.length > 0 && (
              <div className="border border-slate-200 rounded-lg p-5">

                <h3 className="font-semibold text-slate-800 mb-4">
                  {t("hotel.searchDetails")}
                </h3>

                <div className="space-y-3">

                  {searchParams.map(
                    (params: any, index: number) => (
                      <div
                        key={index}
                        className="bg-slate-50 rounded-lg p-4"
                      >

                        <p className="text-sm font-semibold text-slate-800 mb-2">
                          {t("hotel.room")}{" "}
                          {index + 1}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                          <div>
                            <p className="text-xs text-slate-400">
                              {t("hotel.adults")}
                            </p>

                            <p className="font-medium">
                              {params.Adults ?? 0}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              {t("hotel.children")}
                            </p>

                            <p className="font-medium">
                              {params.Children ?? 0}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              {t("hotel.childrenAges")}
                            </p>

                            <p className="font-medium">
                              {params.ChildrenAges?.length
                                ? params.ChildrenAges.join(
                                  ", "
                                )
                                : "-"}
                            </p>
                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>
        )}

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
              ${isActive
                ? "bg-emerald-700 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold
                ${isActive
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

  console.log(user, "logged in user data");

  /* ── YOUR AUTH CONTEXT: null = still loading ── */
  if (user === null) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isRTL ? "text-right" : "text-left"
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
      className={`min-h-screen  pb-12 ${isRTL ? "text-right" : "text-left"
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