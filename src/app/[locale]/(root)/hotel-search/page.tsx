"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import actGetHotels from "@/redux/hotels/act/actGetHotels";
import { clearHotels } from "@/redux/hotels/hotelsSlice";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Section from "@/app/components/shared/section";
import { Hotel as HotelInterface } from "@/redux/hotels/hotelsSlice";
import Hotel from "@/app/components/website/hotel-search/Hotel";
import Pagination from "@/app/components/shared/Pagination";
import HotelSearch from "@/app/components/website/home/components/hotel-search-form";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import CustomProgressBar from "@/app/components/shared/progress-bar";
import HotelCardSkeleton from "@/app/components/shared/Feedback/HotelCardSkeleton";
import Heading from "@/app/components/shared/heading";
import Image from "next/image";

// Rename the type to avoid confusion with the Pagination component
type Paging = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

type HotelsData = {
  hotels: HotelInterface[];
  pagination: Paging;
};

const DEFAULT_PAGING: Paging = {
  page: 1,
  perPage: 50,
  total: 0,
  totalPages: 0,
};

const convertRatingToNumber = (rating: string | undefined): number => {
  const ratingMap: { [key: string]: number } = {
    'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5, 'All': 0,
  };
  return rating ? (ratingMap[rating] ?? 0) : 0;
};

export default function Page() {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const locale = useLocale();
  const t = useTranslations("hotelSearchPage");

  const { searchParamsData, hotels, loading } = useAppSelector(
    (state) => state.hotelData
  );

  const [currentPage, setCurrentPage] = useState(1);

  // ── Server-side filter / sort / search state ──────────────────────────────
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "star-asc" | "star-desc" | "none"
  >("none");
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedNameSearch, setDebouncedNameSearch] = useState("");
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>([10, 10000]);
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 10000]);
  const [starRatings, setStarRatings] = useState<string[]>([]);
  const [accumulatedStarOptions, setAccumulatedStarOptions] = useState<{ label: string, value: string }[]>([]);

  // Debounce nameSearch by 500ms so we don't fire on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedNameSearch(nameSearch), 500);
    return () => clearTimeout(timer);
  }, [nameSearch]);
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(priceRange, "priceRange");
      console.log(debouncedPriceRange, "debouncedPriceRange")
      setDebouncedPriceRange(priceRange);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [priceRange]);

  // Local, flattened state that the UI can rely on
  const [hotelsData, setHotelsData] = useState<HotelsData>({
    hotels: [],
    pagination: DEFAULT_PAGING,
  });

  // Helper: reset page to 1 and re-fire with updated filter/sort/search
  const handleFilterChange = (updates: {
    sortBy?: typeof sortBy;
    nameSearch?: string;
    priceRange?: [number, number];
    starRatings?: string[];
  }) => {
    if (updates.sortBy !== undefined) setSortBy(updates.sortBy);
    if (updates.nameSearch !== undefined) setNameSearch(updates.nameSearch);
    if (updates.priceRange !== undefined) setPriceRange(updates.priceRange);
    if (updates.starRatings !== undefined) setStarRatings(updates.starRatings);
    setCurrentPage(1); // always reset to page 1 on filter/sort/search change
  };

  const handleResetFilters = () => {
    setSortBy("none");
    setNameSearch("");
    setDebouncedNameSearch("");
    setPriceRange([10, 10000]);
    setStarRatings([]);
    setCurrentPage(1);
  };



  const fullParams = useMemo(() => {
    if (!searchParamsData) return null;
    const hasPriceFilter =
      debouncedPriceRange[0] !== 10 || debouncedPriceRange[1] !== 10000;

    console.log(debouncedPriceRange, "debouncedPriceRange")
    return {
      ...searchParamsData,
      Language: locale,
      page: currentPage,
      // Include server-side filter/sort/search params
      sortBy,
      nameSearch: debouncedNameSearch.trim() || undefined,
      minPrice: hasPriceFilter ? debouncedPriceRange[0] : undefined,
      maxPrice: hasPriceFilter ? debouncedPriceRange[1] : undefined,
      starRatings: starRatings.length > 0 ? starRatings : undefined,
    };
  }, [searchParamsData, currentPage, locale, sortBy, debouncedNameSearch, debouncedPriceRange, starRatings]);

  // Fetch on params change
  useEffect(() => {
    if ((!fullParams?.Code && !fullParams?.CityCode) || !fullParams?.CheckIn || !fullParams?.CheckOut) {
      return; // don't fire until params are ready
    }

    console.log(fullParams, "fullParams ")

    dispatch(clearHotels());
    console.log(fullParams, "fullParams before send it ")
    dispatch(actGetHotels(fullParams));
  }, [fullParams, dispatch]);

  // Normalize hotels data when it arrives
  useEffect(() => {
    if (!hotels) return;

    const h: any = hotels;
    const normalizedHotels: HotelInterface[] = Array.isArray(h)
      ? h
      : Array.isArray(h?.data)
        ? h.data
        : h?.data?.hotels ?? h?.hotels ?? [];

    setAccumulatedStarOptions(prev => {
      const newRatings = Array.from(new Set(normalizedHotels.map(hotel => hotel?.star_rating).filter(Boolean)));
      const newOptions = newRatings.map((r: any) => ({ label: `${convertRatingToNumber(r)} Stars`, value: r }));
      const map = new Map(prev.map(p => [p.value, p]));
      newOptions.forEach(opt => map.set(opt.value, opt));
      return Array.from(map.values()).sort(
        (a, b) => convertRatingToNumber(a.value) - convertRatingToNumber(b.value)
      );
    });

    const normalizedPagination: Paging =
      h?.data?.pagination ?? h?.pagination ?? DEFAULT_PAGING;

    setHotelsData({
      hotels: normalizedHotels,
      pagination: normalizedPagination,
    });

    // Sync current page with pagination from API
    if (normalizedPagination.page && normalizedPagination.page !== currentPage) {
      setCurrentPage(normalizedPagination.page);
    }
  }, [hotels]);

  const noResults =
    loading === "succeeded" && hotelsData.hotels.length === 0 || loading === "failed";

  return (
    <Section className="py-5">
      <div className="hidden md:block">
        <Stepper currentStep={currentStep} stepsType="hotelSteps" />
      </div>
      <HotelSearch className="lg:grid-cols-4 grid-cols-2 bg-white rounded-3xl shadow-md p-8 border " />

      {loading === "failed" && (
        <>
          <div className="min-h-screen w-full flex-col flex justify-center items-center">
            <Heading>No Hotels Found</Heading>
            <Image
              src={"/no-flight.svg"}
              width={400}
              height={400}
              alt=""
            />
          </div>
        </>
      )}

      {loading === "pending" && (
        <>
          <CustomProgressBar />
          <HotelCardSkeleton />
        </>
      )}

      {loading === "succeeded" && (
        <>
          <Hotel
            hotels={hotelsData.hotels}
            pagination={hotelsData.pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            // filter / sort / search props
            sortBy={sortBy}
            onSortChange={(v) => handleFilterChange({ sortBy: v })}
            nameSearch={nameSearch}
            onNameSearchChange={(v) => handleFilterChange({ nameSearch: v })}
            priceRange={priceRange}
            onPriceRangeChange={(v) => handleFilterChange({ priceRange: v })}
            starRatings={starRatings}
            onStarRatingsChange={(v) => handleFilterChange({ starRatings: v })}
            onResetFilters={handleResetFilters}
            availableStarOptions={accumulatedStarOptions}
          />

          {/* Show server-side pagination if available */}
          {hotelsData.pagination.totalPages > 1 && (
            <div className="mt-8">
              {/* <Pagination
                currentPage={currentPage}
                totalPages={hotelsData.pagination.totalPages}
                onPageChange={setCurrentPage}
              /> */}
            </div>
          )}
        </>
      )}
    </Section>
  );
}