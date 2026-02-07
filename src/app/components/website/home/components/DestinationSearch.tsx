import React from 'react';
import AsyncSelect from 'react-select/async';
import { StylesConfig } from 'react-select';

interface Option {
    label: string;
    value: string;
    type: 'city' | 'hotel';
}

interface DestinationSearchProps {
    label?: string;
    placeholder?: string;
    onChange: (value: Option | null) => void;
    value?: Option | null;
    className?: string;
}

const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
        ...provided,
        borderColor: '#e5e7eb', // tailwind gray-200
        borderRadius: '0.5rem', // tailwind rounded-lg
        padding: '2px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#d1d5db', // tailwind gray-300
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white', // emerald-500, emerald-50
        color: state.isSelected ? 'white' : '#374151', // gray-700
    }),
};

import { getHotelLocationSearch } from "@/actions/hotel-search-actions";

const loadOptions = async (inputValue: string): Promise<Option[]> => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
        const results = await getHotelLocationSearch(inputValue);

        if (!results) return [];

        const cityOptions: Option[] = (results.cities || []).map(city => ({
            label: city.city_name,
            value: city.city_code,
            type: 'city'
        }));

        const hotelOptions: Option[] = (results.hotels || []).map(hotel => ({
            label: hotel.name,
            value: hotel.hotel_code,
            type: 'hotel'
        }));

        return [...cityOptions, ...hotelOptions];
    } catch (error) {
        console.error("Error loading options:", error);
        return [];
    }
};

const DestinationSearch: React.FC<DestinationSearchProps> = ({
    label,
    placeholder,
    onChange,
    value,
    className,
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && <label className="mb-2 text-sm text-gray-600">{label}</label>}
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                styles={customStyles}
                components={{
                    IndicatorSeparator: () => null
                }}
                noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2 ? "Type at least 2 characters..." : "No destinations found"
                }
            />
        </div>
    );
};

export default DestinationSearch;
