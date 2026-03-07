"use server";

import axios from "axios";

const NEXT_PUBLIC_API_URL = "http://api.tbotechnology.in/TBOHolidays_HotelAPI";
const USERNAME = "Qessatravel";
const PASSWORD = "Qes@46075928";

// Encode credentials for Basic Auth
const tboApi = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: USERNAME,
    password: PASSWORD,
  },
});
// Fetch country list
export async function getCountries() {
  try {
    const response = await tboApi.get("/CountryList");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching countries:", error);
    throw new Error("Failed to fetch country list");
  }
}
// Fetch country list
export async function getHotelCode() {
  try {
    const response = await tboApi.get("/hotelcodelist");
    return response.data.HotelCodes;
  } catch (error: any) {
    console.error("Error fetching countries:", error);
    throw new Error("Failed to fetch country list");
  }
}

// Fetch city list by country
export async function getCities(countryCode: string) {
  try {
    const response = await tboApi.post("/CityList", {
      CountryCode: countryCode,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cities:", error);
    throw new Error("Failed to fetch city list");
  }
}

// Search hotels
export async function searchHotels(searchParams: any) {

  try {
    const response = await tboApi.post("/HotelSearch", searchParams);

    return response.data;
  } catch (error: any) {
    console.error("Error searching hotels:", error);
    throw new Error("Failed to search hotels");
  }
}

export async function HotelDetailAction(hotelCode: string) {

  try {
    const response = await tboApi.post("/Hoteldetails", {
      Hotelcodes: hotelCode,
      Language: "en",
    });

    return response.data.HotelDetails[0];
  } catch (error: any) {
    console.error("Error searching hotels:", error);
    throw new Error("Failed to search hotels");
  }
}

export async function AvailableHotelRooms(HotelBookingCode: any) {

  try {
    const response = await tboApi.post("/AvailableHotelRooms", {
      HotelBookingCode: HotelBookingCode,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error searching hotels:", error);
    throw new Error("Failed to search hotels");
  }
}
