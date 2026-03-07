"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import FlightBookingThankYou from "@/app/components/website/after-booking/BookingConfirm";
import HotelBookingThankYou from "@/app/components/website/after-booking/BookingConfirmHotel";
import BookingFailed from "@/app/components/website/after-booking/BookingFaield";
import OrderProgress from "@/app/components/website/after-booking/OrderProgress";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "FAILED">(
    "PENDING"
  );
  const [order, setOrder] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false); // ✅ prevent duplicate emails
  const [bookingType, setBookingType] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const FrontEndUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  useEffect(() => {
    if (!paymentId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.post(`${baseUrl}/payment/bookingStatus`, {
          paymentId,
        });
        setBookingType(res.data.order.bookingType);

        if (res.data.status === "CONFIRMED") {
          setStatus("CONFIRMED");
          setOrder(res.data);
          clearInterval(interval); // ✅ stop polling
        } else if (res.data.status === "FAILED") {
          setStatus("FAILED");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching booking status", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [paymentId, baseUrl]);


  // ✅ Separate effect — runs only after order is set and email not sent yet
  useEffect(() => {
    if (
      status === "CONFIRMED" &&
      order &&
      order?.order.orderData?.data?.travelers?.[0]?.contact?.emailAddress &&
      !emailSent
    ) {
      const sendEmail = async () => {
        try {
          const to =
            order?.order.orderData?.data?.travelers?.[0]?.contact?.emailAddress;

          await axios.post(`${FrontEndUrl}/api/flights-email`, {
            ticketInfo: order.order,
            to,
          });

          setEmailSent(true);
        } catch (err) {
          console.error("Error sending email:", err);
        }
      };

      sendEmail();
    } else {
      console.log(
        "error",
        status,
        order,
        order?.order.orderData?.data?.travelers?.[0]?.contact?.emailAddress,
        emailSent
      );
    }
  }, [status, order, FrontEndUrl, emailSent]);

  return (
    <div className="text-center min-h-svh">
      {status === "PENDING" && <OrderProgress />}
      {status === "CONFIRMED" && order && (
        <>
          {bookingType === "flight" && (
            <FlightBookingThankYou order={order.order.orderData} />
          )}

          {bookingType === "hotel" && (
            <HotelBookingThankYou bookingData={order} lng="en" />
          )}
        </>
      )}

      {status === "FAILED" && <BookingFailed />}
    </div>
  );
}
