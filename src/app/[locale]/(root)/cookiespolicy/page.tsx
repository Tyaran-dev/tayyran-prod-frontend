"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { 
  FaCookieBite,
  FaCog,
  FaChartLine,
  FaUserCheck,
  FaShareAlt,
  FaServer,
  FaLock,
  FaSlidersH,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaBuilding,
  FaShieldAlt,
  FaLink,
  FaInfoCircle,
  FaCheckCircle
} from "react-icons/fa";

export default function CookiesPolicyPage() {
  const t = useTranslations("CookiesPolicy");
  const locale = useLocale();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "main-content": true // Open by default
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Parse the content from translation into bullet points
  const contentItems = t("content").split('\n').filter(item => item.trim());

  // Bilingual sections
  const sections = [
    {
      id: "main-content",
      icon: FaInfoCircle,
      title: t("title") || (locale === 'ar' ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy"),
      content: t("content")
    },
    {
      id: "what-are-cookies",
      icon: FaCookieBite,
      title: locale === 'ar' ? "ما هي ملفات تعريف الارتباط؟" : "What Are Cookies?",
      content: locale === 'ar' 
        ? "ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. تساعدنا في تحسين تجربتك وتذكر تفضيلاتك."
        : "Cookies are small text files that are stored on your device when you visit our website. They help us improve your experience and remember your preferences."
    },
    {
      id: "how-we-use-cookies",
      icon: FaCog,
      title: locale === 'ar' ? "كيف نستخدم ملفات تعريف الارتباط؟" : "How We Use Cookies",
      content: locale === 'ar'
        ? "نستخدم ملفات تعريف الارتباط لتذكر التفضيلات والإعدادات الخاصة بك، وتحليل أداء الموقع، وتحسين خدماتنا."
        : "We use cookies to remember your preferences and settings, analyze site performance, and improve our services."
    },
    {
      id: "third-party-cookies",
      icon: FaShareAlt,
      title: locale === 'ar' ? "ملفات تعريف الارتباط الخاصة بأطراف ثالثة" : "Third-Party Cookies",
      content: locale === 'ar'
        ? "قد نستخدم ملفات تعريف الارتباط الخاصة بأطراف ثالثة لأغراض التحليل والإعلانات وتحسين الخدمات."
        : "We may use third-party cookies for analytics, advertising, and service improvement purposes."
    },
    {
      id: "user-control",
      icon: FaSlidersH,
      title: locale === 'ar' ? "التحكم في ملفات تعريف الارتباط" : "User Control",
      content: locale === 'ar'
        ? "يمكنك التحكم في ملفات تعريف الارتباط أو تعطيلها من خلال إعدادات المتصفح الخاص بك. قد يؤثر تعطيل بعض ملفات تعريف الارتباط على أداء بعض وظائف الموقع."
        : "You can control or disable cookies through your browser settings. Disabling some cookies may affect the performance of certain site features."
    },
    {
      id: "consent",
      icon: FaCheckCircle,
      title: locale === 'ar' ? "الموافقة على استخدام ملفات تعريف الارتباط" : "Cookie Consent",
      content: locale === 'ar'
        ? "باستمرار استخدام الموقع، توافق على استخدام ملفات تعريف الارتباط وفقاً لهذه السياسة."
        : "By continuing to use the site, you agree to the use of cookies in accordance with this policy."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-6 shadow-lg">
            <FaCookieBite className="w-8 h-8 sm:w-10 sm:h-10 text-[#1d1068]" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t("title") || (locale === 'ar' ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy")}
          </h1>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full mb-4">
            <FaCookieBite className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">Tayyran</span>
          </div>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            {t("subtitle") || (locale === 'ar' ? "نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا" : "We use cookies to enhance your experience on our website")}
          </p>

          <p className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg inline-block">
            {t("lastUpdated") || (locale === 'ar' ? "آخر تحديث: يونيو 2026" : "Last Updated: June 2026")}
          </p>
        </div>

        {/* Cookies Information Card */}
        <div className="bg-white shadow-xl border border-slate-200 rounded-2xl overflow-hidden mb-8">
          {/* Card Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-orange-50/30 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {t("cardTitle") || (locale === 'ar' ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy")}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {t("cardDescription") || (locale === 'ar' ? "نحن نؤمن بالشفافية في استخدامنا لملفات تعريف الارتباط" : "We believe in transparency about our use of cookies")}
            </p>
          </div>

          {/* Accordion Sections */}
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {sections.map((section) => {
                const Icon = section.icon;
                const isOpen = openSections[section.id];
                
                return (
                  <div 
                    key={section.id} 
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-orange-300 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Accordion Trigger */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#1d1068] rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-amber-200 transition-colors">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm sm:text-base text-slate-900 block">
                            {section.title}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {isOpen ? (
                          <span className="w-5 h-5 text-orange-600 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-5 h-5 text-slate-400 flex items-center justify-center group-hover:text-orange-600 transition-colors">
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
                          <div className="text-sm sm:text-base text-slate-700 leading-relaxed">
                            {section.id === "main-content" ? (
                              // Render the main content with bullet points
                              <ul className="space-y-3">
                                {contentItems.map((item, index) => {
                                  // Check if item starts with * and remove it
                                  const cleanItem = item.replace(/^[*\s]+/, '');
                                  return (
                                    <li key={index} className="flex items-start gap-3">
                                      <span className="text-orange-500 mt-1">•</span>
                                      <span>{cleanItem}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              // Render other sections as plain text
                              <div className="whitespace-pre-line">
                                {section.content}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}