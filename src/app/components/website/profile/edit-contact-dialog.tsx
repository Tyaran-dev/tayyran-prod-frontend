"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { UserData } from "@/types/user";
import {
  monthOptions,
  nationalityOptions,
  countryCodesOptions,
} from "@/app/data/data.js";

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  onUpdate: (updates: Partial<UserData>) => void;
}

export default function EditContactDialog({
  open,
  onOpenChange,
  userData,
  onUpdate,
}: EditContactDialogProps) {
  const t = useTranslations("EditContactDialog");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [formData, setFormData] = useState({
    phoneCode: "",
    phoneNumber: "",
    // Note: we don't include email here since it's not editable in this dialog
  });

  useEffect(() => {
    if (open) {
      setFormData({
        phoneCode: userData?.personalInfo?.contact?.phoneCode || "+966",
        phoneNumber: userData?.personalInfo?.contact?.phoneNumber || "",
      });
    }
  }, [userData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update only contact information, NOT email
    onUpdate({
      personalInfo: {
        contact: {
          phoneCode: formData.phoneCode || null, // Convert empty string to null
          phoneNumber: formData.phoneNumber || null,
          // Do NOT include email in contact object
          // Email should be updated separately if needed
        }
      }
    });

    onOpenChange(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        className={`relative z-50 w-full max-w-md mx-4 transform transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
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

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="space-y-4">
              {/* Email Field (Read-only) */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("email")}
                </label>
                <div className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600">
                  {userData?.email}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {t("emailCannotBeChanged") || "Email cannot be changed here"}
                </p>
              </div>

              {/* Phone Number Field */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("mobileRequired")}
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* Country Code Select */}
                  <div className="relative flex-1 min-w-[120px]">
                    <select
                      value={formData.phoneCode}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneCode: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      <option value="">{t("selectCode") || "Select Code"}</option>
                      {countryCodesOptions.map((countryCode) => (
                        <option key={countryCode.country} value={countryCode.code}>
                          {countryCode.country} {countryCode.code}
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

                  {/* Phone Number Input */}
                  <div className="flex-2">
                    <input
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      placeholder={t("phonePlaceholder")}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      dir="ltr"
                      required
                    />
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