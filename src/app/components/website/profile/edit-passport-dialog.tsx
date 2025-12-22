"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Info } from "lucide-react";
import { UserData } from "@/types/user";
import {
  monthOptions,
  nationalityOptions,
  countryCodesOptions,
} from "@/app/data/data.js";

interface EditPassportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  onUpdate: (updates: Partial<UserData>) => void;
}

export default function EditPassportDialog({
  open,
  onOpenChange,
  userData,
  onUpdate,
}: EditPassportDialogProps) {
  const t = useTranslations("EditPassportDialog");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Initialize form data with existing user data
  const [formData, setFormData] = useState({
    passportNumber: "",
    issuingCountry: "",
    expiryDay: "",
    expiryMonth: "",
    expiryYear: "",
  });

  useEffect(() => {
    if (open) {
      // Get existing passport data or empty object
      const passportData = userData.personalInfo?.passport || {};
      const expiryDate = passportData.expiryDate || {};

      setFormData({
        passportNumber: passportData.number || "",
        issuingCountry: passportData.issuingCountry || "",
        expiryDay: expiryDate.day?.toString() || "",
        expiryMonth: expiryDate.month?.toString() || "",
        expiryYear: expiryDate.year?.toString() || "",
      });
    }
  }, [userData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the expiryDate object only if all fields are filled
    const expiryDate = {};
    if (formData.expiryDay && formData.expiryMonth && formData.expiryYear) {
      Object.assign(expiryDate, {
        day: formData.expiryDay,
        month: formData.expiryMonth,
        year: formData.expiryYear,
      });
    } else if (userData.personalInfo?.passport?.expiryDate) {
      // Keep existing expiryDate if partial update
      Object.assign(expiryDate, userData.personalInfo.passport.expiryDate);
    }

    // Update only the passport fields
    onUpdate({
      personalInfo: {
        passport: {
          number: formData.passportNumber || null, // Use null for empty string
          issuingCountry: formData.issuingCountry || null,
          expiryDate: Object.keys(expiryDate).length > 0 ? expiryDate : {}
        }
      }
    });

    onOpenChange(false);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i);

  const months = [
    { value: "1", key: "january" },
    { value: "2", key: "february" },
    { value: "3", key: "march" },
    { value: "4", key: "april" },
    { value: "5", key: "may" },
    { value: "6", key: "june" },
    { value: "7", key: "july" },
    { value: "8", key: "august" },
    { value: "9", key: "september" },
    { value: "10", key: "october" },
    { value: "11", key: "november" },
    { value: "12", key: "december" },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "visible" : "invisible"
        }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
          }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        className={`relative z-50 w-full max-w-lg mx-4 transform transition-all duration-300 ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
      >
        <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Dialog Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-200">
            <h2 className={`text-2xl font-bold text-slate-800 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("title")}
            </h2>
            <p className={`text-sm text-slate-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("description")}
            </p>
          </div>

          {/* Alert */}
          <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className={`text-sm text-amber-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t("alert")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="space-y-4">
              {/* Personal Details Heading */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-base font-semibold text-slate-800">
                  {t("personalDetails")}
                </h3>
              </div>

              {/* Passport Number */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label
                  htmlFor="passportNumber"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("passportNumberRequired")}
                </label>
                <input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, passportNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder={t("passportPlaceholder")}
                  dir="ltr"
                  required
                />
              </div>

              {/* Issuing Country */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("issuingCountryRequired")}
                </label>
                <div className="relative">
                  <select
                    value={formData.issuingCountry}
                    onChange={(e) =>
                      setFormData({ ...formData, issuingCountry: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                    dir={isRTL ? "rtl" : "ltr"}
                    required
                  >
                    <option value="">{t("selectCountry")}</option>
                    {nationalityOptions.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("expiryDate")}
                </label>
                <div className={`grid grid-cols-3 gap-3 ${isRTL ? 'grid-flow-row' : ''}`}>
                  {/* Day */}
                  <div>
                    <div className="relative">
                      <select
                        value={formData.expiryDay}
                        onChange={(e) =>
                          setFormData({ ...formData, expiryDay: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                        dir="ltr"
                      >
                        <option value="">{t("day")}</option>
                        {days.map((day) => (
                          <option key={day} value={day.toString()}>
                            {day}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Month */}
                  <div>
                    <div className="relative">
                      <select
                        value={formData.expiryMonth}
                        onChange={(e) =>
                          setFormData({ ...formData, expiryMonth: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t("month")}</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {t(`months.${month.key}`)}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <div className="relative">
                      <select
                        value={formData.expiryYear}
                        onChange={(e) =>
                          setFormData({ ...formData, expiryYear: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                        dir="ltr"
                      >
                        <option value="">{t("year")}</option>
                        {years.map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-greenGradient hover:from-emerald-500 hover:to-emerald-700 text-white rounded-lg font-medium transition-all"
              >
                {t("saveChanges")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}