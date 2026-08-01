// ==================== ENHANCED HOTEL SEARCH ====================

"use client";
import { useState, useRef, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import CustomDatePicker from "../../shared/custom-date-picker";
import axios from "axios";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setHotelFormData, setHotelSearchData } from "@/redux/hotels/hotelsSlice";
import { useHotelSearchForm } from "@/hooks/useSearchHotels";
import HotelLocationSearchField, { SearchResultItem } from "./HotelLocationSearchField";
import {
  MapPin,
  Calendar,
  Users,
  Plus,
  Minus,
  Trash2,
  Search,
  ChevronDown,
  Baby,
  Globe
} from "lucide-react";

type Room = {
  Adults: number;
  Children: number;
  ChildrenAges: number[];
};

interface HotelSearchProps {
  type?: "default" | "blog" | string;
}

const HotelSearch = ({ type = "default" }: HotelSearchProps) => {
  const {
    countries,
    selectedNationality,
    setSelectedNationality,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    rooms,
    addRoom,
    removeRoom,
    handleAdultChange,
    handleChildChange,
    handleAgeChange,
    totalSummary,
    open,
    setOpen,
    today,
  } = useHotelSearchForm();

  const dispatch = useDispatch();
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SearchResultItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!selectedLocation || !checkIn || !checkOut) {
      alert("Please select a location/hotel, check-in, and check-out dates.");
      return;
    }

    setLoading(true);
    try {
      const searchParams = {
        CheckIn: checkIn,
        CheckOut: checkOut,
        Code: selectedLocation?.code,
        Type: selectedLocation?.type,
        Language: locale,
        GuestNationality: selectedNationality || "SA",
        PreferredCurrencyCode: "SAR",
        PaxRooms: rooms,
        IsDetailResponse: true,
        ResponseTime: 23,
        page: 1,
        Filters: {
          MealType: "All",
          Refundable: true,
          NoOfRooms: rooms.length.toString(),
        },
      };

      dispatch(setHotelSearchData(searchParams));
      dispatch(
        setHotelFormData({
          selectedCountry: selectedLocation.originalData.country_name,
          selectedCity: selectedLocation.label,
          selectedNationality: selectedNationality || "SA",
          checkIn,
          checkOut,
          rooms,
        })
      );

      if (selectedLocation.type === "hotel") {
        router.push(`/${locale}/hotel-details/${selectedLocation.code}`);
      } else {
        router.push(`/${locale}/hotel-search`);
      }
    } catch (error) {
      console.error("Hotel search failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  //  BLOG LAYOUT — compact horizontal search bar
  // ═══════════════════════════════════════════════════════
  if (type === "blog") {
    return (
      <div className="w-full">
        {/* Horizontal Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col lg:flex-row items-stretch gap-2">
          {/* Destination */}
          <div className="flex-[2] min-w-0 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
              <MapPin className="w-5 h-5" />
            </div>
            <HotelLocationSearchField
              placeholder="Search city or hotel name..."
              onSelect={(item) => setSelectedLocation(item)}
              className="w-full h-full pl-11 pr-4 py-3.5 bg-slate-50 border-0 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          {/* Check In */}
          <div className="lg:w-40 min-w-0">
            <CustomDatePicker
              placeholder="Check In"
              value={checkIn}
              className="w-full h-full bg-slate-50 border-0 rounded-xl text-sm"
              minDate={today}
              onChange={(date: Date | null) => setCheckIn(date)}
            />
          </div>

          {/* Check Out */}
          <div className="lg:w-40 min-w-0">
            <CustomDatePicker
              placeholder="Check Out"
              value={checkOut}
              className="w-full h-full bg-slate-50 border-0 rounded-xl text-sm"
              minDate={checkIn || undefined}
              onChange={(date: Date | null) => setCheckOut(date)}
            />
          </div>

          {/* Rooms & Guests Dropdown */}
          <div className="lg:w-52 min-w-0 relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-full h-full  flex items-center justify-between  bg-slate-50 border-0 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="truncate">{totalSummary}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            {open && (
              <div className="absolute right-0 z-50 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 p-5 space-y-5">
                {rooms.map((room, roomIndex) => (
                  <div key={roomIndex} className={`pb-5 ${roomIndex < rooms.length - 1 ? "border-b border-slate-100" : ""}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-800">Room {roomIndex + 1}</h4>
                      {rooms.length > 1 && (
                        <button
                          onClick={() => removeRoom(roomIndex)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">Adults</p>
                            <p className="text-xs text-slate-500">Age 13+</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CounterButton
                            onClick={() => handleAdultChange(roomIndex, -1)}
                            disabled={room.Adults <= 1}
                          />
                          <span className="w-8 text-center font-bold text-slate-800">{room.Adults}</span>
                          <CounterButton
                            onClick={() => handleAdultChange(roomIndex, 1)}
                            plus
                          />
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                            <Baby className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">Children</p>
                            <p className="text-xs text-slate-500">Age 0-12</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CounterButton
                            onClick={() => handleChildChange(roomIndex, -1)}
                            disabled={room.Children <= 0}
                          />
                          <span className="w-8 text-center font-bold text-slate-800">{room.Children}</span>
                          <CounterButton
                            onClick={() => handleChildChange(roomIndex, 1)}
                            plus
                          />
                        </div>
                      </div>

                      {/* Children Ages */}
                      {room.ChildrenAges.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                          {room.ChildrenAges.map((age, childIndex) => (
                            <div key={childIndex}>
                              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                Child {childIndex + 1}
                              </label>
                              <select
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                                value={age}
                                onChange={(e) => handleAgeChange(roomIndex, childIndex, parseInt(e.target.value))}
                              >
                                {Array.from({ length: 17 }).map((_, i) => (
                                  <option key={i} value={i}>{i + 1} yrs</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Room */}
                {rooms.length < 6 && (
                  <button
                    onClick={addRoom}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-orange-200 text-orange-700 rounded-xl font-semibold text-sm hover:bg-orange-50 hover:border-orange-300 transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Room
                  </button>
                )}

                {/* Done Button */}
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.97]"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="lg:w-36 px-6 mx-2 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-70 shadow-lg"
            style={{
              background: "linear-gradient(135deg, rgb(1, 103, 51), rgb(28, 20, 102))"
            }}
          >
            {
              loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
          </button>
        </div >

        {/* Selected Location Chip */}
        {
          selectedLocation && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg w-fit">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">{selectedLocation.label}</span>
              <button
                onClick={() => setSelectedLocation(null)}
                className="ml-auto text-orange-600 hover:text-orange-800 pl-2"
              >
                ×
              </button>
            </div>
          )
        }
      </div >
    );
  }

  // ═══════════════════════════════════════════════════════
  //  DEFAULT LAYOUT (original, untouched)
  // ═══════════════════════════════════════════════════════
  return (
    <div className="space-y-5">
      {/* Location Search */}
      <div className="relative">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Destination
        </label>
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#016733] transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <HotelLocationSearchField
            placeholder="Search city or hotel name..."
            onSelect={(item) => setSelectedLocation(item)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#016733] focus:ring-2 focus:ring-[#016733]/10 transition-all"
          />
        </div>
        {selectedLocation && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">{selectedLocation.label}</span>
            <button
              onClick={() => setSelectedLocation(null)}
              className="ml-auto text-emerald-600 hover:text-emerald-800"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Check-In
          </label>
          <CustomDatePicker
            placeholder="Select date"
            value={checkIn}
            className="bg-white border border-slate-200 rounded-xl text-sm"
            minDate={today}
            onChange={(date: Date | null) => setCheckIn(date)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Check-Out
          </label>
          <CustomDatePicker
            placeholder="Select date"
            value={checkOut}
            className="bg-white border border-slate-200 rounded-xl text-sm"
            minDate={checkIn || undefined}
            onChange={(date: Date | null) => setCheckOut(date)}
          />
        </div>
      </div>

      {/* Rooms & Travelers Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Rooms & Guests
        </label>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 transition-all focus:outline-none focus:border-[#016733] focus:ring-2 focus:ring-[#016733]/10"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-slate-400" />
            <span>{totalSummary}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Panel */}
        {open && (
          <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className={`pb-5 ${roomIndex < rooms.length - 1 ? "border-b border-slate-100" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800">Room {roomIndex + 1}</h4>
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(roomIndex)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Adults</p>
                        <p className="text-xs text-slate-500">Age 13+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CounterButton
                        onClick={() => handleAdultChange(roomIndex, -1)}
                        disabled={room.Adults <= 1}
                      />
                      <span className="w-8 text-center font-bold text-slate-800">{room.Adults}</span>
                      <CounterButton
                        onClick={() => handleAdultChange(roomIndex, 1)}
                        plus
                      />
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        <Baby className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Children</p>
                        <p className="text-xs text-slate-500">Age 0-12</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CounterButton
                        onClick={() => handleChildChange(roomIndex, -1)}
                        disabled={room.Children <= 0}
                      />
                      <span className="w-8 text-center font-bold text-slate-800">{room.Children}</span>
                      <CounterButton
                        onClick={() => handleChildChange(roomIndex, 1)}
                        plus
                      />
                    </div>
                  </div>

                  {/* Children Ages */}
                  {room.ChildrenAges.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                      {room.ChildrenAges.map((age, childIndex) => (
                        <div key={childIndex}>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            Child {childIndex + 1}
                          </label>
                          <select
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-[#016733] focus:ring-2 focus:ring-[#016733]/10 transition-all"
                            value={age}
                            onChange={(e) => handleAgeChange(roomIndex, childIndex, parseInt(e.target.value))}
                          >
                            {Array.from({ length: 17 }).map((_, i) => (
                              <option key={i} value={i}>{i + 1} yrs</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Room */}
            {rooms.length < 6 && (
              <button
                onClick={addRoom}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-emerald-200 text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            )}

            {/* Done Button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-[#016733] to-[#1c1466] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/20 hover:shadow-xl transition-all active:scale-[0.97]"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Nationality & Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nationality
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              className="w-full appearance-none pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#016733] focus:ring-2 focus:ring-[#016733]/10 transition-all cursor-pointer"
            >
              <option disabled value="">
                Select nationality
              </option>
              {countries.map((country, indx) => (
                <option key={country.Code + indx} value={country.Code}>
                  {country.Name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.97] disabled:opacity-70 shadow-lg shadow-emerald-900/25 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #016733, #1c1466)",
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search Hotels</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Counter Button Component
const CounterButton = ({
  onClick,
  disabled = false,
  plus = false
}: {
  onClick: () => void;
  disabled?: boolean;
  plus?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 ${disabled
      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
      }`}
  >
    {plus ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
  </button>
);

export default HotelSearch;