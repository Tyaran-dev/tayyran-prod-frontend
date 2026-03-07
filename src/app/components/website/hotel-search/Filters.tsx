'use client'
import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import PriceRange from '../../shared/filter/price-range';
import HotelCheckBox from '../../shared/filter/HotelCheckBox';

interface FiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (newValue: [number, number]) => void;
  selectedHotelOptions: string[];
  onHotelOptionsChange: (selected: string[]) => void;
  selectedStarRatingOptions: string[];
  onStarRatingOptionsChange: (selected: string[]) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  starOptions: { label: string; value: string }[];
  onResetFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  priceRange,
  onPriceRangeChange,
  selectedHotelOptions,
  onHotelOptionsChange,
  onStarRatingOptionsChange,
  starOptions,
  selectedStarRatingOptions,
  searchQuery,
  onSearchQueryChange,
  onResetFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedStarRatingOptions.length > 0 ||
    priceRange[0] !== 10 ||
    priceRange[1] !== 10000;

  useEffect(() => {
    if (document.activeElement !== searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  }, [searchQuery]);

  useEffect(() => {
    console.log(priceRange, "priceRange")
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  return (
    <div
      className="w-full border-2 md:border-none md:p-2 md:w-[30%] rounded-lg md:sticky md:top-4 md:self-start"
      style={{ boxShadow: '0px 0px 20px 0px #0000001A' }}
    >
      {/* Mobile Header */}
      <div
        className="flex justify-between bg-greenGradient text-slate-200 rounded-lg items-center cursor-pointer md:cursor-default px-4 py-3"
        onClick={() => {
          if (window.innerWidth < 768) setIsOpen(!isOpen);
        }}
      >
        <h2 className="font-semibold text-lg">Filters</h2>
        <span className="md:hidden">
          {isOpen ? (
            <MdKeyboardArrowDown className="text-2xl rotate-180" />
          ) : (
            <MdKeyboardArrowDown className="text-2xl" />
          )}
        </span>
      </div>

      {/* Accordion Body */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen
          ? 'max-h-[2000px] opacity-100'
          : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
          }`}
      >
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto px-2 md:px-0 scrollbar-hide">
          {/* Price Filter */}
          <div className="py-3 px-4">
            <h4 className="text-base py-2 font-semibold">Price Range</h4>
            <PriceRange
              title=""
              min={10}
              max={10000}
              unit="SAR"
              value={localPriceRange}
              onChange={(value) => setLocalPriceRange(value as [number, number])}
              onChangeComplete={(value) => {
                onPriceRangeChange(value as [number, number]);
              }}
            />
          </div>

          {/* Property Name Search */}
          <div className="flex flex-col mb-4 px-4 md:px-0">
            <h4 className="text-base py-2 font-semibold">Property Name</h4>
            <div className="border border-grayDark flex items-center gap-2 rounded-2xl py-2 px-4">
              <FiSearch className="text-lg flex-shrink-0" />
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search"
                className="w-full flex-1 outline-none"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
              />
            </div>
          </div>

          {/* Star Rating */}
          <HotelCheckBox
            title="Star rating"
            options={starOptions}
            onChange={onStarRatingOptionsChange}
            selectedOptions={selectedStarRatingOptions}
          />

          {/* Reset Filters */}
          {hasActiveFilters && (
            <div className="px-4 pb-4 pt-2">
              <button
                onClick={onResetFilters}
                className="w-full py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;