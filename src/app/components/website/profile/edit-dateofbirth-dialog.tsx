"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import { UserData } from "@/types/user";

interface EditDateOfBirthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  onUpdate: (updates: Partial<UserData>) => void;
}

export default function EditDateOfBirthDialog({
  open,
  onOpenChange,
  userData,
  onUpdate,
}: EditDateOfBirthDialogProps) {
  const t = useTranslations("EditDateOfBirthDialog");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [formData, setFormData] = useState({
    birthDay: "",
    birthMonth: "",
    birthYear: "",
  });

  // Days 1-31
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Months
  const months = [
    { value: "1", label: t("months.january") || "January" },
    { value: "2", label: t("months.february") || "February" },
    { value: "3", label: t("months.march") || "March" },
    { value: "4", label: t("months.april") || "April" },
    { value: "5", label: t("months.may") || "May" },
    { value: "6", label: t("months.june") || "June" },
    { value: "7", label: t("months.july") || "July" },
    { value: "8", label: t("months.august") || "August" },
    { value: "9", label: t("months.september") || "September" },
    { value: "10", label: t("months.october") || "October" },
    { value: "11", label: t("months.november") || "November" },
    { value: "12", label: t("months.december") || "December" },
  ];
  
  // Years (1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (open) {
      const dob = userData?.personalInfo?.dateOfBirth || {};
      setFormData({
        birthDay: dob.day?.toString() || "",
        birthMonth: dob.month?.toString() || "",
        birthYear: dob.year?.toString() || "",
      });
    }
  }, [userData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare dateOfBirth object
    const dateOfBirth = {};
    if (formData.birthDay) dateOfBirth.day = formData.birthDay;
    if (formData.birthMonth) dateOfBirth.month = formData.birthMonth;
    if (formData.birthYear) dateOfBirth.year = formData.birthYear;

    // Update user data
    onUpdate({
      personalInfo: {
        dateOfBirth: Object.keys(dateOfBirth).length > 0 ? dateOfBirth : {}
      }
    });

    onOpenChange(false);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "visible" : "invisible"}`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
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
            <h2 className={`text-2xl font-bold text-slate-800 flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Calendar className="h-5 w-5" />
              {t("title") || "Date of Birth"}
            </h2>
            <p className={`text-sm text-slate-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t("description") || "Update your date of birth information"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="space-y-4">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("dateOfBirth") || "Date of Birth"}
                </label>
                <div className={`grid grid-cols-3 gap-3 ${isRTL ? 'grid-flow-row' : ''}`}>
                  
                  {/* Day */}
                  <div>
                    <div className="relative">
                      <select
                        value={formData.birthDay}
                        onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                        dir="ltr"
                      >
                        <option value="">{t("day") || "Day"}</option>
                        {days.map((day) => (
                          <option key={day} value={day.toString()}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Month */}
                  <div>
                    <div className="relative">
                      <select
                        value={formData.birthMonth}
                        onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <option value="">{t("month") || "Month"}</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <div className="relative">
                      <select
                        value={formData.birthYear}
                        onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                        dir="ltr"
                      >
                        <option value="">{t("year") || "Year"}</option>
                        {years.map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
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
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-greenGradient text-white rounded-lg font-medium transition-all"
              >
                {t("saveChanges") || "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}