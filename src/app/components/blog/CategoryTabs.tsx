'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { WPCategory } from '@/types/wordpress';
import { useTranslations,useLocale } from 'next-intl';

interface CategoryTabsProps {
  categories: WPCategory[];
  activeSlug?: string;
}

export default function CategoryTabs({ categories, activeSlug }: CategoryTabsProps) {
  const t = useTranslations('blog');
  const locale = useLocale();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const isActive = (slug: string) => activeSlug === slug;

  return (
    <div className="w-full mb-12 relative z-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">

          <Link
            href="/blog"
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${!activeSlug
                ? 'bg-blogGradient text-white shadow-md scale-105'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
          >
            {t('categoryTabs.all')}
          </Link>

          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(category.id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {category.children && category.children.length > 0 ? (
                <div className="flex items-center">
                  <Link
                    href={`/${locale}/blog/category/${category.slug}`}
                    className={`px-5 py-2.5 rounded-r-xl font-semibold transition-all flex items-center ${isActive(category.slug) || category.children.some(c => isActive(c.slug))
                        ? 'bg-blogGradient text-white shadow-md scale-105 rounded-l-none z-10'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-l border-gray-200 rounded-l-none'
                      }`}
                  >
                    {category.name}
                  </Link>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
                    className={`px-3 py-2.5 rounded-l-xl transition-all flex items-center justify-center ${isActive(category.slug) || category.children.some(c => isActive(c.slug))
                        ? 'bg-blogGradient text-white shadow-md scale-105 rounded-r-none z-10 opacity-90'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-r-none'
                      }`}
                  >
                    <ChevronDown size={18} className={`transition-transform ${openDropdown === category.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {openDropdown === category.id && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeInSlow">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${locale}/blog/category/${child.slug}`}
                          className={`block px-4 py-3 text-sm font-medium transition-colors ${isActive(child.slug)
                              ? 'bg-blog-bg text-blog-primary'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blog-primary'
                            }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/${locale}/blog/category/${category.slug}`}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all block ${isActive(category.slug)
                      ? 'bg-blogGradient text-white shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {category.name}
                </Link>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
