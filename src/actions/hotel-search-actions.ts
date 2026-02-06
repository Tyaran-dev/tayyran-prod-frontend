"use server";
import axios from "axios";

export type HotelLocationResult = {
    cities: {
        city_name: string;
        city_code: string;
        country_name: string;
        type: "city";
    }[];
    hotels: {
        id: string;
        hotel_code: string;
        name: string;
        address: string;
        city_code: string;
        city_name: string;
        country_name: string;
        star_rating: string;
        image_urls: string[];
        type: "hotel";
    }[];
};

export async function getHotelLocationSearch(query: string) {
    if (!query) return null;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        // Calling the endpoint identified in the backend: /hotels/search?q={query}
        const response = await axios.get(`${baseUrl}/hotels/search`, {
            params: { q: query },
        });

        return response.data as HotelLocationResult;
    } catch (error: any) {
        console.error(
            "Error fetching hotel location search results:",
            error.response?.data || error.message
        );
        return null;
    }
}
