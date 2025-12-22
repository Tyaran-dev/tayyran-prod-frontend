'use client'
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import Image from "next/image";
import { Calendar, LocationIcon, StarIcon } from "@/app/svg";
import { Hotel } from "@/hooks/useGetRandomHotels";

interface HotelCardProps {
    hotel: Hotel;
    t: (key: string) => string;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, t }) => {
    const [favorite, setFavorite] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Safely get the cheapest room
    const cheapestRoom = hotel.rooms && hotel.rooms.length > 0
        ? hotel.rooms.reduce((prev, curr) =>
            (prev.TotalFare < curr.TotalFare ? prev : curr)
        )
        : null;

    // Fallback image
    const imageSrc = imageError || !hotel.Image
        ? "/assets/hotels/h1.svg"
        : hotel.Image;

    // Safely get description
    const description = hotel.Description
        ? hotel.Description.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...'
        : 'No description available';

    // Format date for display
    const formatDisplayDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row rounded-3xl border border-gray-200 overflow-hidden hover:shadow-md transition bg-white h-full">
            {/* Image */}
            <div className="relative lg:w-2/5 w-full h-64">
                <Image
                    src={imageSrc}
                    alt={hotel.hotelName || "Hotel"}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    priority
                />
                <button
                    onClick={() => setFavorite(!favorite)}
                    className="absolute top-3 right-3 bg-white/70 rounded-full p-2 hover:bg-white transition z-10"
                >
                    {favorite ? (
                        <GoHeartFill className="text-red-500 w-5 h-5" />
                    ) : (
                        <GoHeart className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between lg:w-3/5 w-full p-4">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {hotel.hotelName || "Unknown Hotel"}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                        <LocationIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">
                            {hotel.CityName || "Unknown City"}, {hotel.CountryName || "Unknown Country"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: Math.floor(hotel.HotelRating || 0) }).map((_, i) => (
                            <StarIcon key={i} className="text-yellow-400 w-4 h-4" />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                            {hotel.HotelRating || "No rating"}
                        </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 line-clamp-3">
                        {description}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="text-gray-700 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">
                            {formatDisplayDate(hotel.checkIn)} → {formatDisplayDate(hotel.checkOut)}
                            <br />
                            <span className="text-gray-500">{hotel.stay} nights</span>
                        </span>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-400">{t('perNight') || "Per night"}</p>
                        <p className="text-xl font-bold text-primary">
                            ${cheapestRoom ? cheapestRoom.TotalFare.toFixed(2) : "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;