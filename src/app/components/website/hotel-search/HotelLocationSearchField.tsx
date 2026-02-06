import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoLocationOutline, IoBedOutline } from "react-icons/io5"; // Icons for City and Hotel
import Image, { StaticImageData } from "next/image";
import Loading from "../../shared/loading";
import { getHotelLocationSearch, HotelLocationResult } from "@/actions/hotel-search-actions";

type HighlightTextProps = {
    text: string;
    query: string;
};

const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
    if (!query) return <>{text}</>;

    const regex = new RegExp(`(${query})`, "gi");
    return (
        <>
            {text?.split(regex).map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={index} className="bg-yellow-200">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};

export type SearchResultItem = {
    label: string;
    subLabel?: string;
    code: string; // city_code or hotel_code
    type: "city" | "hotel";
    originalData: any;
};

type Props = {
    label?: string;
    placeholder?: string;
    className?: string;
    defaultValue?: string;
    icon?: StaticImageData;
    onSelect: (item: SearchResultItem) => void;
    error?: any;
};

const HotelLocationSearchField: React.FC<Props> = ({
    label,
    placeholder = "Search cities or hotels...",
    className = "",
    onSelect,
    icon,
    defaultValue,
    error,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<HotelLocationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const selectRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!searchTerm.trim()) {
                setResults(null);
                return;
            }
            setLoading(true);

            const data = await getHotelLocationSearch(searchTerm);

            setLoading(false);
            setResults(data);
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 500); // Debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSelect = (item: SearchResultItem) => {
        onSelect(item);
        setSelectedItem(item);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    // Initialize from default value if needed (logic can be expanded if we have a way to resolve code to name)
    // For now, we assume standard behavior

    return (
        <div>
            <div ref={selectRef} className="flex flex-col w-full">
                {label && (
                    <label className="hidden md:block text-[#12121299] mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <div
                        className={`cursor-pointer text-grey1 text-md bg-transparent border outline-none w-full px-2 flex justify-between items-center ${className} ${isOpen ? "border-green" : ""}`}
                    >
                        <input
                            placeholder={placeholder}
                            type="text"
                            ref={inputRef}
                            value={
                                selectedItem && !searchTerm
                                    ? selectedItem.label
                                    : searchTerm
                            }
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value === "") setSelectedItem(null);
                            }}
                            className="w-full outline-none placeholder:text-[#12121299] notranslate"
                            onFocus={handleFocus}
                        />
                        {icon ? (
                            loading ? (
                                <Loading />
                            ) : (
                                <Image src={icon} alt="icon" width={25} height={25} />
                            )
                        ) : (
                            loading ? <Loading /> : <IoIosArrowDown className="text-lg" />
                        )}
                    </div>

                    {isOpen && searchTerm && (
                        <div className="absolute z-10 w-full max-h-[500px] customScrollbar p-2 overflow-auto bg-white border border-bordered shadow-lg rounded-lg mt-0.5">

                            {/* Cities Group */}
                            {results?.cities && results.cities.length > 0 && (
                                <div className="mb-2">
                                    <h3 className="text-gray-500 text-xs font-semibold px-2 py-1 uppercase tracking-wider">Locations</h3>
                                    {results.cities.map((city, i) => (
                                        <div
                                            key={`city-${i}`}
                                            onClick={() => handleSelect({
                                                label: city.city_name,
                                                subLabel: `${city.city_name}, ${city.country_name}`,
                                                code: city.city_code,
                                                type: "city",
                                                originalData: city
                                            })}
                                            className="cursor-pointer px-2 py-2 hover:bg-greenGradient hover:text-white transition-colors rounded-md flex justify-between items-center group"
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1 text-gray-400 group-hover:text-white">
                                                    <IoLocationOutline />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        <HighlightText text={city.city_name} query={searchTerm} />
                                                    </div>
                                                    <div className="text-xs text-gray-400 group-hover:text-white">
                                                        {city.city_name}, {city.country_name}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 group-hover:text-white uppercase">City</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hotels Group */}
                            {results?.hotels && results.hotels.length > 0 && (
                                <div>
                                    <h3 className="text-gray-500 text-xs font-semibold px-2 py-1 uppercase tracking-wider">Properties</h3>
                                    {results.hotels.map((hotel, i) => (
                                        <div
                                            key={`hotel-${i}`}
                                            onClick={() => handleSelect({
                                                label: hotel.name,
                                                subLabel: `${hotel.city_name}, ${hotel.country_name}`,
                                                code: hotel.hotel_code,
                                                type: "hotel",
                                                originalData: hotel
                                            })}
                                            className="cursor-pointer px-2 py-2 hover:bg-greenGradient hover:text-white transition-colors rounded-md flex justify-between items-center group"
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="mt-1 text-gray-400 group-hover:text-white">
                                                    <IoBedOutline />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        <HighlightText text={hotel.name} query={searchTerm} />
                                                    </div>
                                                    <div className="text-xs text-gray-400 group-hover:text-white">
                                                        {hotel.city_name}, {hotel.country_name}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 group-hover:text-white uppercase">Hotel</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {(!results?.cities?.length && !results?.hotels?.length && !loading) && (
                                <div className="text-center py-4 text-gray-500 text-sm">No results found</div>
                            )}
                        </div>
                    )}
                    {error && <span className="text-sm text-red-500">{error}</span>}
                </div>
            </div>
        </div>
    );
};

export default HotelLocationSearchField;
