"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  FaFileContract,
  FaBuilding,
  FaUserCheck,
  FaSyncAlt,
  FaServer,
  FaShieldAlt,
  FaUserShield,
  FaCreditCard,
  FaExclamationTriangle,
  FaPlane,
  FaLock,
  FaHandshake,
  FaCopyright,
  FaEnvelope,
  FaGavel,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaRegFileAlt,
  FaHotel,
  FaMoneyBillWave,
  FaGlobe,
  FaBan,
  FaBalanceScale
} from "react-icons/fa";

export default function TermsConditionsPage() {
  const t = useTranslations("TermsConditions");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: "introduction-agreement",
      icon: FaFileContract,
      title: t("sections.introductionAgreement.title"),
      content: t("sections.introductionAgreement.content"),
      points: t.raw("sections.introductionAgreement.points")
    },
    {
      id: "platform-nature",
      icon: FaInfoCircle,
      title: t("sections.platformNature.title"),
      content: t("sections.platformNature.content"),
      points: t.raw("sections.platformNature.points")
    },
    {
      id: "terms-modification",
      icon: FaSyncAlt,
      title: t("sections.termsModification.title"),
      content: t("sections.termsModification.content"),
      points: t.raw("sections.termsModification.points")
    },
    {
      id: "website-availability",
      icon: FaServer,
      title: t("sections.websiteAvailability.title"),
      content: t("sections.websiteAvailability.content")
    },
    {
      id: "disclaimer",
      icon: FaShieldAlt,
      title: t("sections.disclaimer.title"),
      content: t("sections.disclaimer.content"),
      points: t.raw("sections.disclaimer.points")
    },
    {
      id: "liability-limits",
      icon: FaBalanceScale,
      title: t("sections.liabilityLimits.title"),
      content: t("sections.liabilityLimits.content")
    },
    {
      id: "acceptable-behavior",
      icon: FaUserShield,
      title: t("sections.acceptableBehavior.title"),
      content: t("sections.acceptableBehavior.content"),
      points: t.raw("sections.acceptableBehavior.points")
    },
    {
      id: "flight-bookings",
      icon: FaPlane,
      title: t("sections.flightBookings.title"),
      content: t("sections.flightBookings.content"),
      points: t.raw("sections.flightBookings.points")
    },
    {
      id: "accommodation-bookings",
      icon: FaHotel,
      title: t("sections.accommodationBookings.title"),
      content: t("sections.accommodationBookings.content"),
      points: t.raw("sections.accommodationBookings.points")
    },
    {
      id: "service-fees",
      icon: FaCreditCard,
      title: t("sections.serviceFees.title"),
      content: t("sections.serviceFees.content"),
      points: t.raw("sections.serviceFees.points")
    },
    {
      id: "refund-policy",
      icon: FaMoneyBillWave,
      title: t("sections.refundPolicy.title"),
      content: t("sections.refundPolicy.content"),
      points: t.raw("sections.refundPolicy.points")
    },
    {
      id: "provider-changes",
      icon: FaSyncAlt,
      title: t("sections.providerChanges.title"),
      content: t("sections.providerChanges.content"),
      points: t.raw("sections.providerChanges.points")
    },
    {
      id: "payments-fraud",
      icon: FaExclamationTriangle,
      title: t("sections.paymentsFraud.title"),
      content: t("sections.paymentsFraud.content"),
      points: t.raw("sections.paymentsFraud.points")
    },
    {
      id: "force-majeure",
      icon: FaBan,
      title: t("sections.forceMajeure.title"),
      content: t("sections.forceMajeure.content"),
      points: t.raw("sections.forceMajeure.points")
    },
    {
      id: "indemnification",
      icon: FaHandshake,
      title: t("sections.indemnification.title"),
      content: t("sections.indemnification.content")
    },
    {
      id: "intellectual-property",
      icon: FaCopyright,
      title: t("sections.intellectualProperty.title"),
      content: t("sections.intellectualProperty.content")
    },
    {
      id: "terms-validity",
      icon: FaCheckCircle,
      title: t("sections.termsValidity.title"),
      content: t("sections.termsValidity.content")
    },
    {
      id: "law-jurisdiction",
      icon: FaGavel,
      title: t("sections.lawJurisdiction.title"),
      content: t("sections.lawJurisdiction.content")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-greenGradient rounded-full mb-6 shadow-lg">
            <FaFileContract className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t("title")}
          </h1>

          <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full mb-4">
            <FaBuilding className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-semibold text-emerald-700">{t("companyName")}</span>
          </div>

          <p className="text-lg font-medium text-slate-700 max-w-2xl mx-auto mb-6 p-4 bg-emerald-50 rounded-xl border border-blue-100">
            {t("agreementNotice")}
          </p>

          <p className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg inline-block">
            {t("lastUpdated")}
          </p>
        </div>

        {/* Terms Information Card */}
        <div className="bg-white shadow-xl border border-slate-200 rounded-2xl overflow-hidden mb-8">
          {/* Card Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {t("cardTitle")}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {t("cardDescription")}
            </p>
          </div>

          {/* Accordion Sections */}
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {sections.map((section) => {
                const Icon = section.icon;
                const isOpen = openSections[section.id];
                const hasPoints = section.points;

                return (
                  <div
                    key={section.id}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Accordion Trigger */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm sm:text-base text-slate-900 block">
                            {section.title}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {isOpen ? (
                          <span className="w-5 h-5 text-emerald-700 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-5 h-5 text-slate-400 flex items-center justify-center group-hover:text-emerald-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                        <div className="ml-12 sm:ml-14 pr-4">
                          <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                            {section.content}
                          </div>

                          {/* Points List */}
                          {hasPoints && (
                            <div className="mt-4 space-y-3">
                              {hasPoints.map((point: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                  {point.startsWith("يمنع") || point.includes("prohibited") || point.includes("not allowed") ||
                                    point.includes("غير مسؤول") || point.includes("not responsible") || point.includes("لا تتحمل") ||
                                    point.includes("لا تضمن") || point.includes("does not guarantee") ? (
                                    <FaTimesCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                  ) : point.startsWith("يحق") || point.includes("right to") || point.includes("entitled") ||
                                    point.includes("يتحمل") || point.includes("responsible for") || point.includes("يلتزم") ? (
                                    <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  ) : point.includes("تخضع") || point.includes("subject to") || point.includes("يتم") ||
                                    point.includes("processed") || point.includes("تتضمن") || point.includes("includes") ? (
                                    <FaInfoCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                  ) : (
                                    <FaInfoCircle className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                                  )}
                                  <span className="text-sm sm:text-base text-slate-700">{point}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Important Notice Box */}
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12  bg-greenGradient rounded-lg flex items-center justify-center">
                <FaRegFileAlt className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                {t("importantNoticeTitle")}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 mb-4">
                {t("importantNoticeDescription")}
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:info@tayyran.com"
                  className="inline-flex items-center gap-3 text-emerald-700 hover:text-emerald--800  font-medium text-sm sm:text-base transition-colors group"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-blue-200 group-hover:border-blue-300 transition-colors">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <span>info@tayyran.com</span>
                </a>
                <div className="flex items-start gap-3 text-slate-600">
                  <FaBuilding className="w-4 h-4 mt-1 flex-shrink-0 text-emerald-700" />
                  <p className="text-sm">
                    {t("companyAddress")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}