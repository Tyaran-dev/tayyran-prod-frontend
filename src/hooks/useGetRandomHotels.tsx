"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export interface CancelPolicy {
    FromDate: string;
    ChargeType: string;
    CancellationCharge: number;
}

export interface Room {
    Name: string[];
    BookingCode: string;
    Inclusion: string;
    DayRates: { BasePrice: number }[][];
    TotalFare: number;
    TotalTax: number;
    RoomPromotion: string[];
    CancelPolicies: CancelPolicy[];
    MealType: string;
    IsRefundable: boolean;
    WithTransfers: boolean;
}

export interface Hotel {
    cityCode: string;
    hotelCode: string;
    hotelName: string;
    stay: number;
    checkIn: string;
    checkOut: string;
    rooms: Room[];
    Description: string;
    HotelFacilities: string[];
    Attractions: Record<string, string>;
    Image: string;
    Images: string[];
    Address: string;
    CityName: string;
    CountryName: string;
    HotelRating: number;
    TotalFare?: number;
}

export default function useFeaturedHotels() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Prevent multiple fetches in development (React Strict Mode)
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchHotels = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!baseUrl) {
                    throw new Error("❌ Missing NEXT_PUBLIC_API_URL in .env.local");
                }

                setError(null);
                setLoading(true);

                const cityCodes = ["147536", "113116", "122727", "110755"];

                console.log("🌍 Fetching random hotels...");

                const { data } = await axios.post(`${baseUrl}/hotels/RandomHotels`, {
                    cities: cityCodes,
                });

                console.log("✅ Backend response received");

                if (!data.success) {
                    throw new Error(data.message || "Failed to fetch hotels");
                }

                const hotelList = data?.data || [];
                console.log(`🏨 Found ${hotelList.length} hotels`);

                // Set hotels only once
                setHotels(hotelList);

                if (hotelList.length === 0) {
                    setError("No hotels found. Please try again later.");
                }
            } catch (error: any) {
                const errorMsg = error.response?.data?.message || error.message || "Failed to fetch featured hotels";
                console.error("Error fetching hotels:", error);
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    return { hotels, loading, error };
}