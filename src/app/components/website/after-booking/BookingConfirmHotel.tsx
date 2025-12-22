"use client";

import { CheckCircle, Mail, Phone, User } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import logo from "/public/assets/logo/ras.png";
import Tayyranlogo from "/public/assets/icons/logo.svg";

import Image from "next/image";
interface HotelBookingThankYouProps {
  bookingData: any;
}

export default function HotelBookingThankYou({
  bookingData,
}: HotelBookingThankYouProps) {
  const order = bookingData?.order;
  const hotelData = order?.bookingPayload?.hotelData;
  const confirmationNumber = order?.orderData?.data?.ConfirmationNumber;
  const clientReference = order?.orderData?.data?.ClientReferenceId;
  const status = order?.status;
  const invoiceId = order?.invoiceId;
  const totalAmount = order?.InvoiceValue;

  const guest =
    hotelData?.CustomerDetails?.[0]?.CustomerNames?.[0] || null;
  const t = useTranslations("hotelThankYou");
  const locale = useLocale();

  return (
    <section
      className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 ${locale === "ar" ? "direction-rtl" : ""
        }`}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full text-center border border-gray-100">
        <Image
          src={Tayyranlogo} alt="Logo" width={80} height={80} unoptimized className="m-1 object-contain z-50"

        />
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("thankYou")}
        </h1>
        <p className="text-gray-500 mb-6">{t("message")}</p>

        <div className="border-t border-gray-200 pt-6 text-left space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {t("bookingDetails")}
          </h2>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">{t("bookingStatus")}:</span>
            <span
              className={`font-semibold ${status === "CONFIRMED" ? "text-green-600" : "text-red-600"
                }`}
            >
              {status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">{t("confirmationNo")}:</span>
            <span>{confirmationNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">{t("clientRef")}:</span>
            <span>{clientReference}</span>
          </div>

          {guest && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">{t("guestName")}:</span>
              <span>
                {guest.Title} {guest.FirstName} {guest.LastName}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 flex items-center gap-1">
              <Mail size={16} /> {t("email")}:
            </span>
            <span className="text-gray-600 text-sm">
              {hotelData?.EmailId || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 flex items-center gap-1">
              <Phone size={16} /> {t("phone")}:
            </span>
            <span className="text-gray-600 text-sm">
              {hotelData?.PhoneNumber || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
            <span className="font-semibold text-gray-800">{t("total")}:</span>
            <span className="font-semibold text-emerald-600 flex">
              <Image src={logo} alt="sar" width={18} height={18} unoptimized className="m-1 object-contain" />
              {totalAmount?.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{t("invoice")}:</span>
            <span>{invoiceId}</span>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-8 bg-greenGradient text-white px-6 py-2 rounded-lg  transition"
        >
          {t("backHome")}
        </button>
      </div>
    </section>
  );
}