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

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  onUpdate: (updates: Partial<UserData>) => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  userData,
  onUpdate,
}: EditProfileDialogProps) {
  const t = useTranslations("EditProfileDialog");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    nationality: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: userData?.personalInfo?.title || "mr",
        firstName: userData?.first_name || "",
        middleName: userData?.personalInfo?.middle_name || "",
        lastName: userData?.last_name || "",
        nationality: userData?.personalInfo?.nationality || "",
      });
    }
  }, [userData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare update object
    const updates: Partial<UserData> = {};

    // Only update fields that have changed or are being set
    if (formData.firstName !== userData?.first_name) {
      updates.first_name = formData.firstName;
    }

    if (formData.lastName !== userData?.last_name) {
      updates.last_name = formData.lastName;
    }

    // Prepare personalInfo updates
    const personalInfoUpdates: any = {};

    // Only add fields that have changed or need to be updated
    if (formData.title !== userData?.personalInfo?.title) {
      personalInfoUpdates.title = formData.title || null;
    }

    if (formData.middleName !== userData?.personalInfo?.middle_name) {
      personalInfoUpdates.middle_name = formData.middleName || "";
    }

    if (formData.nationality !== userData?.personalInfo?.nationality) {
      personalInfoUpdates.nationality = formData.nationality || null;
    }

    // Only include personalInfo if there are updates
    if (Object.keys(personalInfoUpdates).length > 0) {
      updates.personalInfo = personalInfoUpdates;
    }

    // Only call onUpdate if there are actual updates
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }

    onOpenChange(false);
  };

  const titles = ["mr", "ms", "mrs"];

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
              {/* Title Selection */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("titleLabel")}
                </label>
                <div className={`flex gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {titles.map((titleKey) => (
                    <button
                      key={titleKey}
                      type="button"
                      onClick={() => setFormData({ ...formData, title: titleKey })}
                      className={`px-4 py-2 rounded-lg border transition-all flex-1 ${
                        formData.title === titleKey
                          ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {t(`titles.${titleKey}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* First Name */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("firstNameRequired")}
                </label>
                <input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  dir={isRTL ? "rtl" : "ltr"}
                  required
                />
              </div>

              {/* Middle Name */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("middleName")}
                </label>
                <input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder={t("middleNamePlaceholder")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              {/* Last Name */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("lastNameRequired")}
                </label>
                <input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  dir={isRTL ? "rtl" : "ltr"}
                  required
                />
              </div>

              {/* Nationality */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("nationality")}
                </label>
                <div className="relative">
                  <select
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <option value="">{t("selectNationality")}</option>
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
                className="flex-1 px-4 py-3 bg-greenGradient text-white rounded-lg font-medium transition-all"
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