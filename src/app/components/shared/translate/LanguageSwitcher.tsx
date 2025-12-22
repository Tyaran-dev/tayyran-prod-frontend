"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { setCookie } from "cookies-next";
import { useState, useTransition } from "react";
import Image from "next/image";

const locales = [
  { code: "en", label: "English", flag: "/assets/images/usa.png" },
  { code: "ar", label: "العربية", flag: "/assets/images/ksa.png" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    const paramsString = searchParams.toString();
    const queryString = paramsString ? `?${paramsString}` : "";
    const newPath = `/${newLocale}${pathWithoutLocale}${queryString}`;

    setCookie("NEXT_LOCALE", newLocale, { path: "/" });

    startTransition(() => {
      router.replace(newPath);
    });
    setOpen(false);
  };

  const currentLocale = locales.find((l) => l.code === locale);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2  hover:text-white px-4 py-2 rounded-lg border border-emerald-800 hover:bg-greenGradient"
        disabled={isPending}
      >
        {currentLocale && (
          <>
            <div className="relative w-5 h-5">
              <Image
                src={currentLocale.flag}
                alt={currentLocale.label}
                fill
                className="object-cover rounded"
              />
            </div>
            <span>{currentLocale.label}</span>
          </>
        )}
        <span className="ml-2">▼</span>
      </button>

      {open && (
        <div className="absolute bg-white  w-40  border-emerald-800   rounded-lg shadow-lg z-50">
          {locales.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => handleChange(code)}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:text-white hover:bg-greenGradient"
              disabled={isPending}
            >
              <div className="relative w-5 h-5">
                <Image
                  src={flag}
                  alt={label}
                  fill
                  className="object-cover rounded"
                />
              </div>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
