// no images hotel 1010065 "1000057"
"use client";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdStar } from "react-icons/md";
import emptyImg from "@/../public/assets/emptyImg.png";
import Image from "next/image";
import Link from "next/link";
import Filters from "./Filters";
import Pagination from "../../shared/Pagination";
import { useTranslations } from "next-intl";
import { Hotel as HotelType, Pagination as PaginationType } from "@/redux/hotels/hotelsSlice";
import Section from "../../shared/section";
import logo from "/public/assets/logo/ras.png";
import { useLocale } from "next-intl";
import {
  FaSort,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaChevronUp,
  FaCheck
} from 'react-icons/fa';

const convertRatingToNumber = (rating: string | undefined): number => {
  const ratingMap: { [key: string]: number } = {
    'One': 1,
    'Two': 2,
    'Three': 3,
    'Four': 4,
    'Five': 5,
    'All': 0,
  };
  return rating ? (ratingMap[rating] ?? 0) : 0;
};

// Derive unique star options directly from the hotels list for the Filters sidebar
const getStarOptions = (hotels: any[]) => {
  const ratings = [...new Set(hotels.map((h: any) => h?.star_rating).filter(Boolean))];
  return ratings
    .map(r => ({ label: `${convertRatingToNumber(r)} Stars`, value: r }))
    .sort((a, b) => convertRatingToNumber(a.value) - convertRatingToNumber(b.value));
};

interface Props {
  hotels: HotelType[];
  pagination: PaginationType;
  currentPage: number;
  onPageChange: (page: number) => void;
  // Server-side filter / sort / search callbacks (owned by page.tsx)
  sortBy: "price-asc" | "price-desc" | "star-asc" | "star-desc" | "none";
  onSortChange: (v: "price-asc" | "price-desc" | "star-asc" | "star-desc" | "none") => void;
  nameSearch: string;
  onNameSearchChange: (v: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (v: [number, number]) => void;
  starRatings: string[];
  onStarRatingsChange: (v: string[]) => void;
  onResetFilters: () => void;
  availableStarOptions?: { label: string, value: string }[];
}

const Hotel = ({
  hotels,
  pagination,
  currentPage,
  onPageChange,
  sortBy,
  onSortChange,
  nameSearch,
  onNameSearchChange,
  priceRange,
  onPriceRangeChange,
  starRatings,
  onStarRatingsChange,
  onResetFilters,
  availableStarOptions,
}: Props) => {
  const locale = useLocale();
  const t = useTranslations("HotelPage");
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  const sortOptions = [
    {
      value: 'none',
      label: t('sort.sortBy'),
      icon: <FaSort className="w-4 h-4" />,
      color: 'text-slate-500'
    },
    {
      value: 'price-asc',
      label: t('sort.priceLowToHigh'),
      icon: <FaSortAmountDownAlt className="w-4 h-4" />,
      color: 'text-emerald-600'
    },
    {
      value: 'price-desc',
      label: t('sort.priceHighToLow'),
      icon: <FaSortAmountUpAlt className="w-4 h-4" />,
      color: 'text-emerald-600'
    },
    {
      value: 'star-asc',
      label: t('sort.starsLowToHigh'),
      icon: <FaRegStar className="w-4 h-4" />,
      color: 'text-amber-500'
    },
    {
      value: 'star-desc',
      label: t('sort.starsHighToLow'),
      icon: <FaStar className="w-4 h-4" />,
      color: 'text-amber-500'
    },
  ];

  const getSelectedSortOption = () =>
    sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  const [starOptions, setStarOptions] = React.useState<{ label: string, value: string }[]>([]);

  React.useEffect(() => {
    if (availableStarOptions && availableStarOptions.length > 0) {
      setStarOptions(availableStarOptions);
    } else if (hotels && hotels.length > 0) {
      setStarOptions(getStarOptions(hotels));
    }
  }, [availableStarOptions, hotels]);

  return (
    <Section>
      <div className="p-2 md:p-4 lg:p-6">
        <div className="w-full flex flex-col lg:flex-row items-start gap-4 md:gap-6 my-2 md:my-4 lg:my-8">
          <Filters
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            selectedHotelOptions={[]}
            onHotelOptionsChange={() => { }}
            selectedStarRatingOptions={starRatings}
            onStarRatingOptionsChange={onStarRatingsChange}
            starOptions={starOptions}
            searchQuery={nameSearch}
            onSearchQueryChange={onNameSearchChange}
            onResetFilters={onResetFilters}
          />

          <div className="w-full">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 md:p-2 rounded-lg bg-emerald-50">
                  <FaSort className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-slate-800">{t("searchResults")}</h2>
                  <p className="text-xs md:text-sm text-slate-600">
                    {t("showing")}{" "}
                    <span className="font-bold text-emerald-600">{pagination.total}</span>{" "}
                    {t("places")}
                  </p>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="group flex items-center justify-between gap-2 md:gap-3 bg-white border border-slate-300 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:border-emerald-400 hover:shadow-sm shadow-slate-100 w-full sm:w-auto min-w-[180px] md:min-w-[200px]"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`p-1.5 md:p-2 rounded-lg bg-slate-50 group-hover:bg-emerald-50 transition-colors ${getSelectedSortOption().color}`}>
                      {getSelectedSortOption().icon}
                    </div>
                    <span className="font-medium text-slate-700 text-sm md:text-base">{getSelectedSortOption().label}</span>
                  </div>
                  <FaChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute top-full left-0 right-0 sm:right-auto mt-1 md:mt-2 bg-white border border-slate-300 rounded-lg md:rounded-xl shadow-lg z-50 w-full sm:w-auto min-w-full sm:min-w-[280px] overflow-hidden">
                    <div className="p-1 md:p-2">
                      <div className="px-2 md:px-3 py-1 md:py-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("sortOptions")}</span>
                      </div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value as any);
                            setIsSortOpen(false);
                          }}
                          className={`flex items-center gap-2 md:gap-3 w-full px-2 md:px-3 py-2 md:py-3 rounded-md md:rounded-lg text-left transition-all ${sortBy === option.value
                            ? 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100'
                            : 'hover:bg-slate-50'
                            }`}
                        >
                          <div className={`p-1.5 md:p-2 rounded-md md:rounded-lg ${sortBy === option.value ? 'bg-white shadow-sm' : 'bg-slate-50'} ${option.color}`}>
                            {option.icon}
                          </div>
                          <span className={`flex-1 font-medium text-sm md:text-base ${sortBy === option.value ? 'text-emerald-700' : 'text-slate-700'}`}>
                            {option.label}
                          </span>
                          {sortBy === option.value && (
                            <FaCheck className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-200 p-2 md:p-3 bg-slate-50">
                      <button
                        onClick={() => {
                          onResetFilters();
                          setIsSortOpen(false);
                        }}
                        className="w-full text-center text-xs md:text-sm text-slate-600 hover:text-slate-800 font-medium py-1.5 md:py-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        {t("resetSort")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-6">
              {hotels.length > 0 ? (
                hotels.map((hotel, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row items-stretch shadow-lg md:shadow-xl border border-slate-200 p-3 md:p-4 lg:p-6 bg-white gap-3 md:gap-4 lg:gap-6 w-full rounded-lg md:rounded-xl lg:rounded-2xl hover:shadow-xl md:hover:shadow-2xl transition-shadow duration-300"
                    style={{ boxShadow: "0px 4px 16px 0px #1122110D" }}
                  >
                    {/* Hotel Image */}
                    <div className="w-full md:w-[40%] lg:w-[30%] h-48 md:h-52 lg:h-64 flex-shrink-0 relative overflow-hidden rounded-lg md:rounded-xl">
                      {hotel?.image_urls ? (
                        <Image
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          alt={hotel?.HotelName} src={hotel.image_urls[0]}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 30vw"
                        />
                      ) : (
                        <Image
                          alt={t("noImage")}
                          src={emptyImg}
                          className="w-full h-full object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 30vw"
                        />
                      )}
                      {/* Rating Badge */}
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg flex items-center gap-1">
                        <FaStar className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                        <span className="font-bold text-slate-800 text-sm md:text-base">{convertRatingToNumber(hotel?.star_rating) || 0}</span>
                        <span className="text-xs text-slate-600 ml-1 hidden md:inline">{t("stars")}</span>
                      </div>
                    </div>

                    {/* Hotel Content */}
                    <div className="w-full flex-1 flex flex-col justify-between">
                      {/* Top Section */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4 w-full">
                        <div className="flex-1 w-full">
                          {/* Hotel Name – Desktop */}
                          <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-3 w-full gap-2 md:gap-3">
                            <div className="flex-1">
                              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-1 md:mb-2 line-clamp-2">
                                {hotel?.name}
                              </h2>
                              <div className="hidden md:flex items-start gap-1 md:gap-2 mb-2 md:mb-3">
                                <FaLocationDot className="text-red-500 mt-0.5 md:mt-1 flex-shrink-0 w-3 h-3 md:w-4 md:h-4" />
                                <p className="text-xs md:text-sm lg:text-base text-slate-700 line-clamp-2">
                                  {hotel?.address}
                                </p>
                              </div>
                            </div>

                            {/* Price – Desktop */}
                            <div className="hidden md:block bg-emerald-50 border border-emerald-100 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 w-full md:w-auto min-w-[150px] md:min-w-[180px] text-center mt-2 md:mt-0">
                              <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">
                                {t("startingFrom")}
                              </p>
                              <div className="flex items-center justify-center gap-0.5 md:gap-1">
                                <span className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-emerald-700">
                                  {hotel?.MinHotelPrice?.toFixed()}
                                </span>
                                <Image
                                  src={logo}
                                  alt="SAR"
                                  width={14}
                                  height={14}
                                  className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 object-contain mb-0.5 md:mb-1"
                                  unoptimized
                                />
                                <span className="text-xs md:text-sm text-slate-500 mb-0.5 md:mb-1">
                                  /{t("night")}
                                </span>
                              </div>
                              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">
                                {t("excludingTax")}
                              </p>
                            </div>
                          </div>

                          {/* Hotel Name + Price – Mobile */}
                          <div className="md:hidden flex justify-between items-start">
                            <div>
                              <h2 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                                {hotel?.name}
                              </h2>
                              <div className="flex items-center gap-1">
                                <FaLocationDot className="text-red-500 w-3 h-3 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-slate-700 line-clamp-1 flex-1">
                                  {hotel?.address}
                                </p>
                              </div>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center min-w-[100px]">
                              <p className="text-[10px] text-slate-500 mb-0.5">{t("startingFrom")}</p>
                              <div className="flex items-center justify-center gap-0.5">
                                <span className="text-lg font-bold text-emerald-700">
                                  {hotel?.MinHotelPrice?.toFixed()}
                                </span>
                                <Image
                                  src={logo}
                                  alt="SAR"
                                  width={14}
                                  height={14}
                                  unoptimized
                                  className="object-contain"
                                />
                                <span className="text-xs text-slate-500">
                                  /{t("night")}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">{t("excludingTax")}</p>
                            </div>
                          </div>

                          {/* Amenities & Rating – Desktop */}
                          <div className="hidden md:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-1 md:gap-2">
                              <div className="flex items-center gap-0.5 md:gap-1">
                                {[...Array(Math.floor(convertRatingToNumber(hotel?.star_rating) || 0))].map((_, index) => (
                                  <MdStar
                                    className="text-amber-500 text-base md:text-lg"
                                    key={index}
                                  />
                                ))}
                              </div>
                              <p className="text-xs md:text-sm font-medium text-slate-700">
                                {convertRatingToNumber(hotel?.star_rating) || 0} {t("starHotel")}
                              </p>
                            </div>
                            <div className="text-xs md:text-sm text-slate-600 bg-slate-50 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg">
                              20+ {t("amenities")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amenities & Rating – Mobile */}
                      <div className="md:hidden flex flex-col gap-3 mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(Math.floor(convertRatingToNumber(hotel?.star_rating) || 0))].map((_, index) => (
                              <MdStar
                                className="text-amber-500"
                                key={index}
                              />
                            ))}
                            <p className="text-xs font-medium text-slate-700 ml-1">
                              {convertRatingToNumber(hotel?.star_rating) || 0} {t("starHotel")}
                            </p>
                          </div>
                          <div className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                            20+ {t("amenities")}
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="w-full border-t pt-3 md:pt-4 flex justify-end">
                        <Link
                          href={`/${locale}/hotel-details/${hotel.HotelCode}`}
                          className="bg-greenGradient hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2 md:py-3 px-4 md:px-6 lg:px-8 rounded-lg md:rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] w-full md:w-auto text-sm md:text-base flex items-center justify-center gap-1 md:gap-2 group"
                        >
                          {t("viewPlace")}
                          <FaChevronDown className="w-3 h-3 md:w-4 md:h-4 rotate-90 group-hover:translate-x-0.5 md:group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 md:py-10 lg:py-12 bg-white rounded-lg md:rounded-xl lg:rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <FaRegStar className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-1 md:mb-2">{t("noHotelsFound")}</h3>
                  <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto px-4">{t("tryAdjustingFilters")}</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && hotels.length > 0 && (
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hotel;