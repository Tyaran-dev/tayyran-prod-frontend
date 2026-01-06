// app/components/payment/MyFatoorahForm.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/utils/axios";
import Script from "next/script";
import { TravelerFormData } from "@/app/[locale]/(root)/book-now/page";
import { useTranslations } from "next-intl";
import { RoomGuestData, BookingPayload } from "@/app/[locale]/(root)/book-hotel/page"

interface FlightPrice {
  total: number;
  base?: number;
  taxes?: number;
}

interface FlightData {
  id: string;
  price: FlightPrice;
  airline?: string;
  departureTime?: string;
  arrivalTime?: string;
}

interface HotelData {
  BookingCode?: string;
  TotalFare?: number;
  [key: string]: any;
}

declare global {
  interface Window {
    myfatoorah: {
      init: (config: {
        sessionId: string;
        countryCode: string;
        currencyCode: string;
        amount: number;
        containerId: string;
        paymentOptions: string[];
        callback: (resp: { isSuccess: boolean }) => void;
      }) => void;
    };
  }
}

interface PaymentFormProps {
  flightData?: FlightData;
  hotelData?: HotelData;
  travelers?: TravelerFormData[] | RoomGuestData[];
  setLoading: (loading: boolean) => void;
  finalPrice: number;
  bookingType?: "flight" | "hotel";
  formatGuestDataForAPI?: () => BookingPayload; // Add this prop
}

export default function PaymentForm({
  flightData,
  hotelData,
  travelers,
  setLoading,
  finalPrice,
  bookingType,
  formatGuestDataForAPI, // Accept the function as prop
}: PaymentFormProps) {
  const t = useTranslations("bookNow");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [session, setSession] = useState<{
    SessionId: string;
    CountryCode: string;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const initDone = useRef(false);

  // Detect booking type automatically
  const detectedBookingType = bookingType || (flightData ? "flight" : "hotel");

  // Prepare the payload for execute-payment endpoint
  const preparePaymentPayload = (sessionId: string) => {
    const basePayload = {
      sessionId,
      invoiceValue: finalPrice,
    };

    if (detectedBookingType === "flight") {
      return {
        ...basePayload,
        flightData,
        travelers: travelers as TravelerFormData[],
      };
    } else {
      // For hotel booking - use the provided formatGuestDataForAPI function
      if (!formatGuestDataForAPI) {
        throw new Error("formatGuestDataForAPI function is required for hotel bookings");
      }

      const formattedHotelData = formatGuestDataForAPI();

      return {
        ...basePayload,
        hotelData: formattedHotelData,
      };
    }
  };

  // Validate that required data is present
  const validateBookingData = () => {
    if (detectedBookingType === "flight") {
      if (!flightData) {
        throw new Error("Flight data is required for flight booking");
      }
      if (!travelers || (travelers as TravelerFormData[]).length === 0) {
        throw new Error("Traveler data is required for flight booking");
      }
    } else {
      if (!formatGuestDataForAPI) {
        throw new Error("Format function is required for hotel booking");
      }
      if (!hotelData) {
        throw new Error("Hotel data is required for hotel booking");
      }
    }
  };

  // Step 1 — Start MyFatoorah session
  useEffect(() => {
    (async () => {
      const r = await api.post(`/payment/initiateSession`);
      setSession(r.data.data.Data); // { SessionId, CountryCode }
    })();
  }, []);

  // Step 2 — Init widget
  useEffect(() => {
    if (!ready || !session || !window.myfatoorah || initDone.current) return;

    window.myfatoorah.init({
      sessionId: session.SessionId,
      countryCode: session.CountryCode,
      currencyCode: "SAR",
      amount: finalPrice,
      containerId: "embedded-payment",
      paymentOptions: ["ApplePay", "Card"],
      callback: async (resp) => {
        if (!resp.isSuccess) {
          alert("Payment authorization failed. Please check your card details.");
          return;
        }

        try {
          setLoading(true);

          // Validate booking data before proceeding
          validateBookingData();

          // Prepare the correct payload based on booking type
          const paymentPayload = preparePaymentPayload(session.SessionId);

          console.log("Sending payment payload:", {
            type: detectedBookingType,
            payload: paymentPayload
          });

          // Call backend to execute payment & store booking data
          const response = await api.post(
            `/payment/execute-payment`,
            paymentPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data?.success && response.data?.paymentUrl) {
            // Redirect to payment URL
            window.location.href = response.data.paymentUrl;
          } else {
            throw new Error(response.data?.message || "No payment URL received from server");
          }
        } catch (error: any) {
          console.error("Payment execution failed:", error);

          if (error.response?.data?.message) {
            alert(`Payment failed: ${error.response.data.message}`);
          } else if (error.message) {
            alert(`Payment failed: ${error.message}`);
          } else {
            alert("Payment failed. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      },
    });

    initDone.current = true;
  }, [ready, session, finalPrice, baseUrl, setLoading, detectedBookingType, flightData, hotelData, travelers, formatGuestDataForAPI]);

  return (
    <>
      <Script
        src="https://sa.myfatoorah.com/payment/v1/session.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl mb-4 font-semibold text-gray-900">
          {t("payment.title") || "Payment"}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {detectedBookingType === "flight"
            ? "Complete your flight booking payment"
            : "Complete your hotel booking payment"}
        </p>

        <div id="embedded-payment" style={{ minHeight: 300 }} />

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">
            <strong>Booking Type:</strong> {detectedBookingType.toUpperCase()}
          </p>
          <p className="text-sm text-blue-700 font-medium">
            <strong>Amount:</strong> SAR {finalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </>
  );
}