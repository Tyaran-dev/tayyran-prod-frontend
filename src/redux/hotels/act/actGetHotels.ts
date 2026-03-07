import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@/utils/axiosErrorHandler";
import { HotelSearchData } from "../hotelsSlice";

const actGetHotels = createAsyncThunk(
  "hotels/actGetHotels",
  async (hotelSearchData: HotelSearchData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const BaseUrl = process.env.NEXT_PUBLIC_API_URL;


      // Perform your request here
      const response = await axios.post(`${BaseUrl}/hotels/searchHotels`, {
        ...hotelSearchData,
      });

      return response.data;
    } catch (error: any) {
      console.log(error, "the error");
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetHotels;
