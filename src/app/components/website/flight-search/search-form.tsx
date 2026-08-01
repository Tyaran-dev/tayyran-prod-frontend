"use client";
import { useState, useRef, useEffect } from "react";
import { Search, Plus, Minus, Trash2 } from "lucide-react";
import AirportSearchField from "../../shared/airport-search-field";
import CustomDatePicker from "../../shared/custom-date-picker";
import Travelers from "../../shared/traveller-field";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import {
  changeTripType,
  setSearchData,
  clearFlightData,
} from "@/redux/flights/flightSlice";
import { useDispatch, useSelector } from "react-redux";
import useSearchflights from "@/hooks/useSearchflights";
import { v4 as uuidv4 } from "uuid";
export const tripTypes = ["oneway", "roundtrip", "multiCities"] as const;
import fromImg from "/public/assets/from.png";
import toImg from "/public/assets/to.png";
import { LoaderPinwheel } from "lucide-react";
import { LuSearch } from "react-icons/lu";
import { TripType } from "@/redux/flights/flightSlice";
import { useRouter } from "next/navigation";
import axios from "axios";


interface FlightSegment {
  id: string;
  origin: string;
  destination: string;
  date: Date | null;
}

interface FlightSearchFormProps {
  type?: "detailsPage" | "default" | "blog" | string;
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


const FlightSearchForm = ({ type = "default" }: FlightSearchFormProps) => {
  // ── Hooks (called once at top level) ──
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const tripType = useSelector(
    (state: any) => state.flightData.tripType
  );

  const tSearch = useTranslations("searchForm");
  const tHome = useTranslations("HomePage");
  const tErrors = useTranslations("errors");
  const tFilters = useTranslations("filters");

  const searchFlights = useSearchflights();

  // ── Shared state for default & blog ──
  const [loading, setLoading] = useState(false);
  const [fromError, setFromError] = useState<string | null>(null);
  const [toError, setToError] = useState<string | null>(null);
  const [searchedAirports, setSearchedAirports] = useState([]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isHotel, setIsHotel] = useState(false);
  const [searchTermFrom, setSearchTermFrom] = useState("");
  const [searchTermTo, setSearchTermTo] = useState("");

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

  const flightClassOptions = [
    { label: tHome("flightClassOptions.economy"), value: "ECONOMY" },
    { label: tHome("flightClassOptions.premiumEconomy"), value: "PREMIUM_ECONOMY" },
    { label: tHome("flightClassOptions.business"), value: "BUSINESS" },
    { label: tHome("flightClassOptions.firstClass"), value: "FIRST" },
  ];

  // ── Shared handlers for default & blog ──
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
        setFromError(tErrors("fromError"));
        setToError(tErrors("toError"));
        setLoading(false);
        return;
      }
    } else {
      if (!flightFormData.origin || !flightFormData.destination) {
        if (!flightFormData.origin) setFromError(tErrors("fromError"));
        if (!flightFormData.destination) setToError(tErrors("toError"));
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

  // ═══════════════════════════════════════════════════════
  //  DETAILS PAGE
  // ═══════════════════════════════════════════════════════
  if (type === "detailsPage") {
    const {
      flights,
      loading: dpLoading,
      error,
      origin,
      destination,
      departure,
      returnDate,
      travelers,
      flightType,
      flightClass,
      segments,
      setOrigin,
      setDestination,
      setDeparture,
      setReturnDate,
      setTravelers,
      setFlightClass,
      setSegments,
      triggerSearch,
      hasHydrated,
    } = searchFlights;

    const [multiCitySegments, setMultiCitySegments] = useState<FlightSegment[]>(
      () => {
        if (tripType === "multiCities" && segments?.length > 0) {
          return segments.map((s: any) => ({
            id: s.id || uuidv4(),
            origin: s.origin,
            destination: s.destination,
            date: s.date,
          }));
        }
        return [
          { id: uuidv4(), origin: "", destination: "", date: null },
          { id: uuidv4(), origin: "", destination: "", date: null },
        ];
      }
    );

    useEffect(() => {
      if (tripType === "multiCities" && segments?.length > 0) {
        setMultiCitySegments(segments);
      }
    }, [tripType, segments]);

    const handleAddSegment = () => {
      setMultiCitySegments([
        ...multiCitySegments,
        { id: uuidv4(), origin: "", destination: "", date: null },
      ]);
    };

    const handleRemoveSegment = (index: number) => {
      if (multiCitySegments.length > 1) {
        const updated = [...multiCitySegments];
        updated.splice(index, 1);
        setMultiCitySegments(updated);
      }
    };

    const handleSegmentChangeDP = (
      index: number,
      field: keyof FlightSegment,
      value: any
    ) => {
      const updated = [...multiCitySegments];
      updated[index] = { ...updated[index], [field]: value };
      setMultiCitySegments(updated);
    };

    const validateInputs = () => {
      if (tripType === "oneway") {
        if (!origin || !destination || !departure) {
          toast.error(tSearch("errors.missingFields"));
          return false;
        }
      } else if (tripType === "roundtrip") {
        if (!origin || !destination || !departure || !returnDate) {
          toast.error(tSearch("errors.missingFieldsRoundtrip"));
          return false;
        }
      } else if (tripType === "multiCities") {
        if (
          multiCitySegments.some((s) => !s.origin || !s.destination || !s.date)
        ) {
          toast.error(tSearch("errors.missingMultiCityFields"));
          return false;
        }
      }
      return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateInputs()) return;
      dispatch(clearFlightData());

      const searchData: FlightFormData = {
        origin: tripType === "multiCities" ? multiCitySegments[0].origin : origin,
        destination:
          tripType === "multiCities"
            ? multiCitySegments[multiCitySegments.length - 1].destination
            : destination,
        departure:
          tripType === "multiCities" ? multiCitySegments[0].date : departure,
        returnDate,
        travelers,
        flightType: tripType,
        flightClass,
        segments: tripType === "multiCities" ? multiCitySegments : [],
      };

      dispatch(setSearchData(searchData));
      if (tripType === "multiCities") {
        setSegments(multiCitySegments);
      }
      triggerSearch(searchData);
    };

    const flightClassOptionsDP = [
      { label: tSearch("flightClassOptions.economy"), value: "ECONOMY" },
      { label: tSearch("flightClassOptions.premiumEconomy"), value: "PREMIUM_ECONOMY" },
      { label: tSearch("flightClassOptions.business"), value: "BUSINESS" },
      { label: tSearch("flightClassOptions.firstClass"), value: "FIRST" },
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 rounded-lg border shadow-sm py-4 px-6 w-full mx-auto"
      >
        {/* Trip Type Selector */}
        <div className="flex gap-2 md:gap-4 justify-between md:justify-normal w-full">
          {tripTypes.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => dispatch(changeTripType(tp))}
              className={`px-2 md:px-4 py-2 text-sm font-medium md:text-base rounded-lg ${tripType === tp ? "bg-greenGradient text-white" : "bg-[#EEEEEE]"
                }`}
            >
              {tp === "roundtrip"
                ? tSearch("tripTypes.roundtrip")
                : tp === "oneway"
                  ? tSearch("tripTypes.oneway")
                  : tSearch("tripTypes.multiplecities")}
            </button>
          ))}
        </div>

        {/* Passengers and Class */}
        <div className="flex items-center gap-4 my-4">
          <div className="lg:w-1/5 w-full border border-borderColor rounded-lg">
            <Travelers
              adults={travelers.adults}
              children={travelers.children}
              infants={travelers.infants}
              setAdults={(value: number) => setTravelers({ ...travelers, adults: value })}
              setChildren={(value: number) =>
                setTravelers({ ...travelers, children: value })
              }
              setInfants={(value: number) =>
                setTravelers({ ...travelers, infants: value })
              }
            />
          </div>
          <div className="lg:w-1/5">
            <select
              className="w-full border border-borderColor rounded-lg px-4 py-2.5"
              value={flightClass}
              onChange={(e) => setFlightClass(e.target.value)}
            >
              {flightClassOptionsDP.map((item) => (
                <option
                  className="text-[10px] md:text-base flex justify-center"
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Fields */}
        {tripType !== "multiCities" ? (
          <div className="flex gap-7 justify-start flex-wrap items-center">
            <div className="relative lg:w-1/5 w-full">
              <AirportSearchField
                placeholder={origin ? origin : tSearch("from")}
                defaultValue={origin}
                onSelect={setOrigin}
                className="border rounded-lg py-2 !border-borderColor"
                icon={fromImg}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const temp = origin;
                setOrigin(destination);
                setDestination(temp);
              }}
              className="py-2 px-5 bg-emerald-700 lg:block hidden rounded-lg text-white"
            >
              &#8644;
            </button>

            <div className="relative lg:w-1/5 w-full">
              <AirportSearchField
                placeholder={destination ? destination : tSearch("to")}
                defaultValue={destination}
                onSelect={setDestination}
                className="border rounded-lg py-2 !border-borderColor"
                icon={toImg}
              />
            </div>

            <div className="relative lg:w-1/5 w-full">
              <CustomDatePicker
                value={departure}
                minDate={new Date()}
                onChange={setDeparture}
                className="px-4 py-2 w-full rounded-lg border border-borderColor"
              />
            </div>

            {tripType === "roundtrip" && (
              <div className="relative lg:w-1/5 w-full">
                <CustomDatePicker
                  value={returnDate}
                  minDate={departure}
                  onChange={setReturnDate}
                  className="px-4 py-2 w-full rounded-lg border border-borderColor"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {multiCitySegments.map((segment, index) => (
              <div key={segment.id} className="flex gap-4 items-center flex-wrap">
                <div className="relative lg:w-[30%] w-full">
                  <AirportSearchField
                    placeholder={tSearch("from")}
                    defaultValue={segment.origin}
                    onSelect={(value: string) =>
                      handleSegmentChangeDP(index, "origin", value)
                    }
                    className="border rounded-lg py-2 !border-borderColor"
                  />
                </div>

                <div className="relative lg:w-[30%] w-full">
                  <AirportSearchField
                    placeholder={tSearch("to")}
                    defaultValue={segment.destination}
                    onSelect={(value: string) =>
                      handleSegmentChangeDP(index, "destination", value)
                    }
                    className="border rounded-lg py-2 !border-borderColor text-sm"
                  />
                </div>

                <div className="relative lg:w-[30%] w-full">
                  <CustomDatePicker
                    value={segment.date}
                    minDate={
                      index > 0
                        ? multiCitySegments[index - 1].date || undefined
                        : new Date()
                    }
                    onChange={(date: Date | null) => handleSegmentChangeDP(index, "date", date)}
                    className="px-4 py-2 w-full rounded-lg text-sm border border-borderColor"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSegment}
                  className="flex items-center bg-emerald-700 text-white rounded-lg p-2 gap-2"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {multiCitySegments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSegment(index)}
                    className="bg-red-500 text-white p-2 rounded-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={dpLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-700 text-white disabled:bg-emerald-600/50"
          >
            {dpLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">↻</span>
                {tSearch("loadingButton")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {tSearch("searchButton")} <Search className="h-4 w-4" />
              </span>
            )}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    );
  }

  // ═══════════════════════════════════════════════════════
  //  BLOG LAYOUT (uses same state & handlers as default)
  // ═══════════════════════════════════════════════════════
  if (type === "blog") {
    return (
      <div className="w-full">
        {/* Trip Type Tabs */}
        <div className="flex items-center gap-1 mb-4">
          {tripTypes.map((tp) => (
            <button
              key={tp}
              onClick={() => handleFlightTypeChange(tp)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${flightFormData.flightType === tp
                ? "bg-brand-green text-white shadow-md"
                : "bg-white/90 text-slate-600 hover:bg-white"
                }`}
            >
              {tp === "roundtrip"
                ? tHome("tripTypes.roundtrip")
                : tp === "oneway"
                  ? tHome("tripTypes.oneway")
                  : tHome("tripTypes.multiplecities")}
            </button>
          ))}
        </div>

        {/* Main Search Bar */}
        {flightFormData.flightType !== "multiCities" ? (
          <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col lg:flex-row items-stretch gap-2">
            {/* From */}
            <div className="flex-1 min-w-0">
              <AirportSearchField
                placeholder={tHome("heroSection.searchForm.fromFieldLabel")}
                defaultValue={flightFormData.origin}
                onSelect={(value: string) => handleFlightChange("origin", value)}
                className="w-full h-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                icon={fromImg}
              />
            </div>

            {/* Swap */}
            <button
              type="button"
              onClick={() => {
                const temp = flightFormData.origin;
                handleFlightChange("origin", flightFormData.destination);
                handleFlightChange("destination", temp);
              }}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-500 hover:text-orange-500 transition-colors self-center"
            >
              &#8644;
            </button>

            {/* To */}
            <div className="flex-1 min-w-0">
              <AirportSearchField
                placeholder={tHome("heroSection.searchForm.toFieldLabel")}
                defaultValue={flightFormData.destination}
                onSelect={(value: string) => handleFlightChange("destination", value)}
                className="w-full h-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-orange-500/20"
                icon={toImg}
              />
            </div>

            {/* Departure */}
            <div className="lg:w-44 min-w-0">
              <CustomDatePicker
                placeholder={tHome("heroSection.searchForm.DatePicker")}
                value={flightFormData.departure}
                minDate={new Date()}
                onChange={(date: Date | null) => handleFlightChange("departure", date)}
                className="w-full h-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-sm font-medium"
              />
            </div>

            {/* Return */}
            {flightFormData.flightType === "roundtrip" && (
              <div className="lg:w-44 min-w-0">
                <CustomDatePicker
                  placeholder={tHome("heroSection.searchForm.returnDate")}
                  value={flightFormData.returnDate}
                  minDate={flightFormData.departure}
                  onChange={(date: Date | null) => handleFlightChange("returnDate", date)}
                  className="w-full h-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-sm font-medium"
                />
              </div>
            )}

            {/* Travelers */}
            <div className="lg:w-48 min-w-0 relative">
              <Travelers
                adults={flightFormData.travelers.adults}
                children={flightFormData.travelers.children}
                infants={flightFormData.travelers.infants}
                setFlightFormData={setFlightFormData}
              />
            </div>

            {/* Search */}
            <button
              disabled={loading}
              onClick={handleFlightSubmit}
              style={{
                background: "linear-gradient(135deg, rgb(1, 103, 51), rgb(28, 20, 102))"
              }}
              className="lg:w-36 px-6 py-3.5 rounded-xl text-white font-bold text-sm flex items-center bg-brand-navy justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-70 shadow-lg"
            >
              {loading ? (
                <LoaderPinwheel className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  {tHome("heroSection.searchForm.searchButton")}
                </>
              )}
            </button>
          </div>
        ) : (
          /* Multi City Blog Layout */
          <div className="space-y-3">
            {flightFormData.segments?.map((segment, index) => (
              <div
                key={segment.id || index}
                className="bg-white rounded-2xl shadow-lg p-3 flex flex-col lg:flex-row items-stretch gap-2"
              >
                <div className="flex-1 min-w-0">
                  <AirportSearchField
                    placeholder={`${tHome("heroSection.searchForm.fromFieldLabel")} ${index + 1}`}
                    defaultValue={segment.origin}
                    onSelect={(value: string) => handleSegmentChange(index, "origin", value)}
                    className="w-full h-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm font-medium"
                    icon={fromImg}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <AirportSearchField
                    placeholder={`${tHome("heroSection.searchForm.toFieldLabel")} ${index + 1}`}
                    defaultValue={segment.destination}
                    onSelect={(value: string) => handleSegmentChange(index, "destination", value)}
                    className="w-full h-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm font-medium"
                    icon={toImg}
                  />
                </div>
                <div className="lg:w-44 min-w-0">
                  <CustomDatePicker
                    placeholder={tHome("heroSection.searchForm.DatePicker")}
                    value={segment.date}
                    minDate={index > 0 ? flightFormData.segments![index - 1].date || undefined : new Date()}
                    onChange={(date: Date | null) => handleSegmentChange(index, "date", date)}
                    className="w-full h-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm font-medium"
                  />
                </div>
                {index === (flightFormData.segments?.length || 0) - 1 && (
                  <button
                    onClick={handleFlightSubmit}
                    disabled={loading}
                    className="lg:w-36 px-6 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-70 shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, rgb(1, 103, 51), rgb(28, 20, 102))"
                    }}
                  >
                    {loading ? (
                      <LoaderPinwheel className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {tHome("heroSection.searchForm.searchButton")}
                      </>
                    )}
                  </button>
                )}
                {flightFormData.segments!.length > 1 && (
                  <button
                    onClick={() => removeFlightSegment(index)}
                    className="p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addFlightSegment}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/80 text-orange-600 rounded-full text-sm font-semibold hover:bg-white transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Flight
            </button>
          </div>
        )
        }
      </div >
    );
  }

  // ═══════════════════════════════════════════════════════
  //  DEFAULT LAYOUT (original, untouched logic)
  // ═══════════════════════════════════════════════════════
  return (
    <div className="space-y-5">
      {/* Trip Type Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
        {tripTypes?.map((tp) => (
          <button
            key={tp}
            onClick={() => handleFlightTypeChange(tp)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${flightFormData.flightType === tp
              ? "bg-white text-[#016733] shadow-sm shadow-slate-200/50"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <span className="text-xs">
              {tp === "roundtrip" ? "⇄" : tp === "oneway" ? "→" : "⋯"}
            </span>
            {tp === "roundtrip"
              ? tHome("tripTypes.roundtrip")
              : tp === "oneway"
                ? tHome("tripTypes.oneway")
                : tHome("tripTypes.multiplecities")}
          </button>
        ))}
      </div>

      {flightFormData.flightType === "multiCities" ? (
        <div className="space-y-4 max-h-[500px] pr-1 custom-scrollbar">
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
                  label={tHome("heroSection.searchForm.fromFieldLabel")}
                  placeholder={tHome("heroSection.searchForm.fromFieldLabel")}
                  className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
                  onSelect={(value: string) => handleSegmentChange(index, "origin", value)}
                  icon={fromImg}
                />
                <AirportSearchField
                  error={index === 0 ? toError : undefined}
                  label={tHome("heroSection.searchForm.toFieldLabel")}
                  placeholder={tHome("heroSection.searchForm.toFieldLabel")}
                  className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
                  onSelect={(value: string) => handleSegmentChange(index, "destination", value)}
                  icon={toImg}
                />
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <CustomDatePicker
                    label={tHome("heroSection.searchForm.DatePicker")}
                    placeholder="Select date"
                    value={segment.date}
                    className="bg-white border border-slate-200 rounded-xl text-sm"
                    minDate={index > 0 ? flightFormData.segments![index - 1].date || undefined : new Date()}
                    onChange={(date: Date | null) => handleSegmentChange(index, "date", date)}
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
              label={tHome("heroSection.searchForm.fromFieldLabel")}
              placeholder={tHome("heroSection.searchForm.fromFieldLabel")}
              className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
              onSelect={(value: string) => handleFlightChange("origin", value)}
              icon={fromImg}
            />
            <AirportSearchField
              error={toError}
              label={tHome("heroSection.searchForm.toFieldLabel")}
              placeholder={tHome("heroSection.searchForm.toFieldLabel")}
              className="bg-white border py-2 border-slate-200 rounded-xl focus-within:border-[#016733] focus-within:ring-2 focus-within:ring-[#016733]/10 transition-all"
              onSelect={(value: string) => handleFlightChange("destination", value)}
              icon={toImg}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomDatePicker
              label={tHome("heroSection.searchForm.DatePicker")}
              placeholder="Departure date"
              value={flightFormData.departure}
              className="bg-white border border-slate-200 rounded-xl text-sm"
              minDate={new Date()}
              onChange={(date: Date | null) => handleFlightChange("departure", date)}
            />
            {flightFormData.flightType === "roundtrip" && (
              <CustomDatePicker
                label={tHome("heroSection.searchForm.returnDate")}
                placeholder="Return date"
                value={flightFormData.returnDate}
                className="bg-white border border-slate-200 rounded-xl text-sm"
                minDate={flightFormData.departure}
                onChange={(date: Date | null) => handleFlightChange("returnDate", date)}
              />
            )}
          </div>
        </div>
      )}

      {/* Bottom Row: Travelers, Class, Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        <div className="lg:col-span-4">
          <Travelers
            label={tHome("heroSection.searchForm.travelersLabel")}
            adults={flightFormData.travelers.adults}
            children={flightFormData.travelers.children}
            infants={flightFormData.travelers.infants}
            setFlightFormData={setFlightFormData}
          />
        </div>

        <div className="lg:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {tHome("heroSection.searchForm.classLabel")}
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
                <span>{tHome("heroSection.searchForm.searchButtonLoading")}</span>
              </>
            ) : (
              <>
                <LuSearch className="w-5 h-5" />
                <span>{tHome("heroSection.searchForm.searchButton")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;