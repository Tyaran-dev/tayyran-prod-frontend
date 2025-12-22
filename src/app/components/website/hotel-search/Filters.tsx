'use client'
import React, { useState } from 'react';
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
onSearchQueryChange
}) => {
  // Control accordion for mobile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="w-full border-2  md:border-none md:p-2 md:w-[30%] rounded-lg md:sticky md:top-4 md:self-start"
      style={{ boxShadow: '0px 0px 20px 0px #0000001A' }}
    >
      {/* Mobile Header */}
      <div
        className="flex justify-between bg-greenGradient text-slate-200 rounded-lg items-center cursor-pointer md:cursor-default px-4 py-3"
        onClick={() => {
          if (window.innerWidth < 768) setIsOpen(!isOpen);
        }}
      >
        <h2 className="font-semibold text-lg ">Filters</h2>
        <span className="md:hidden">
          {isOpen ? (
            <MdKeyboardArrowDown className="text-2xl rotate-180" />
          ) : (
            <MdKeyboardArrowDown className="text-2xl" />
          )}
        </span>
      </div>

      {/* Accordion Body (hidden on mobile until opened) */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen
          ? 'max-h-[2000px] opacity-100'
          : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
          }`}
      >
        {/* Scrollable container */}
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto px-2 md:px-0 scrollbar-hide">
          {/* Price Filter */}
          <div className="py-3 px-4">
            <h4 className="text-base py-2 font-semibold">Price Range</h4>
            <PriceRange
              title=""
              min={10}
              max={10000}
              unit="SAR"
              value={priceRange}
              onChange={onPriceRangeChange}
            />
          </div>

          {/* Property Name */}
          {/* hotel search name */}
          <div className="flex flex-col mb-4 px-4 md:px-0">
            <h4 className="text-base py-2 font-semibold">Property Name</h4>
            <div className="border border-grayDark flex items-center gap-2 rounded-2xl py-2 px-4">
              <FiSearch className="text-lg flex-shrink-0" />
              <input
                type="text"
                placeholder="Search"
                className="w-full flex-1 outline-none"
                value={searchQuery}
                onChange={(e) => {
                  onSearchQueryChange(e.target.value);
                  console.log(searchQuery, "search query")
                }}
              />
            </div>
          </div>
          <HotelCheckBox
            title="Star rating"
            options={starOptions}
            onChange={onStarRatingOptionsChange}
            selectedOptions={selectedStarRatingOptions}
          />
        </div>
      </div>
    </div>

  );
};

export default Filters;