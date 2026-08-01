'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  children?: WPCategory[];
}

interface CategoryTabsProps {
  categories: WPCategory[];
  activeSlug?: string;
  locale?: string;
  allLabel?: string;
}

interface DropdownState {
  id: number;
  left: number;
}

/* ═══════════════════════════════════════════════════════════════
   Recursive nested menu — handles any depth of sub-categories
   Level 0 sits inside the main dropdown; deeper levels fly-out
   to the right (left-full) relative to their parent item.
   ═══════════════════════════════════════════════════════════════ */
function NestedMenu({
  categories,
  localePrefix,
  activeSlug,
  isActive,
  level = 0,
}: {
  categories: WPCategory[];
  localePrefix: string;
  activeSlug?: string;
  isActive: (slug: string) => boolean;
  level?: number;
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className={level === 0 ? 'py-1' : 'py-1'}>
      {categories.map((category) => {
        const hasChildren = category.children && category.children.length > 0;
        const itemActive = isActive(category.slug);
        const isHovered = hoveredId === category.id;

        return (
          <div
            key={category.id}
            className="relative"
            onMouseEnter={() => hasChildren && setHoveredId(category.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link
              href={`${localePrefix}/blog/${category.slug}`}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                itemActive
                  ? 'bg-blog-bg text-blog-primary'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blog-primary'
              }`}
            >
              <span className="truncate">{category.name}</span>
              {hasChildren && (
                <ChevronRightIcon size={14} className="shrink-0 opacity-60" />
              )}
            </Link>

            {/* Fly-out sub-menu */}
            {hasChildren && isHovered && (
              <div
                className={`absolute z-50 w-52 bg-white rounded-xl shadow-xl border border-gray-100 animate-fadeInSlow ${
                  level === 0 ? 'left-full top-0 ml-0.5' : 'left-full top-0 ml-1'
                }`}
              >
                <NestedMenu
                  categories={category.children!}
                  localePrefix={localePrefix}
                  activeSlug={activeSlug}
                  isActive={isActive}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main component — horizontal scrollable tabs
   ═══════════════════════════════════════════════════════════════ */
export default function CategoryTabs({
  categories,
  activeSlug,
  locale = '',
  allLabel = 'All',
}: CategoryTabsProps) {
  const [dropdown, setDropdown] = useState<DropdownState | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const outerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── scroll detection ─────────────────────────────────────── */
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scrollTrack = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  /* ── dropdown hover helpers (delayed close bridges the gap) ─ */
  const openDropdown = (id: number, triggerEl: HTMLElement) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const triggerRect = triggerEl.getBoundingClientRect();
    const outerRect = outerRef.current!.getBoundingClientRect();
    setDropdown({ id, left: triggerRect.left - outerRect.left });
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setDropdown(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  const isActive = (slug: string) => activeSlug === slug;
  const localePrefix = locale ? `/${locale}` : '';
  const activeDropdownCategory = dropdown
    ? categories.find((c) => c.id === dropdown.id)
    : null;
  const hasOverflow = canScrollLeft || canScrollRight;

  return (
    <div className="w-full mb-12 relative z-20">
      <div className="container mx-auto px-4">
        {/* Outer pill — anchor for arrows + dropdowns */}
        <div
          ref={outerRef}
          className="relative bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          {/* ── Left fade + arrow ── */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-16 rounded-l-2xl pointer-events-none z-10 transition-opacity duration-200 bg-gradient-to-r from-white to-transparent ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <button
            onClick={() => scrollTrack('left')}
            aria-label="Scroll left"
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-200 pointer-events-auto ${
              hasOverflow
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            } ${
              canScrollLeft
                ? 'text-gray-600 hover:text-gray-900 hover:shadow-md'
                : 'text-gray-300 cursor-default'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* ── Horizontal scrollable track ─────────────────────── */}
          <div
            ref={scrollRef}
            className="flex items-center gap-1 overflow-x-auto rounded-2xl bg-white shadow-lg border border-gray-100 p-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* "All" tab */}
            <Link
              href={`${localePrefix}/blog`}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                !activeSlug
                  ? 'bg-blog-bg text-blog-primary shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {allLabel}
            </Link>

            {categories.map((category) => {
              const hasChildren =
                category.children && category.children.length > 0;
              const categoryActive = isActive(category.slug);

              return (
                <div key={category.id} className="relative shrink-0">
                  {hasChildren ? (
                    <button
                      onMouseEnter={(e) =>
                        openDropdown(category.id, e.currentTarget)
                      }
                      onMouseLeave={scheduleClose}
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        categoryActive
                          ? 'bg-blog-bg text-blog-primary shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {category.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          dropdown?.id === category.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={`${localePrefix}/blog/${category.slug}`}
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        categoryActive
                          ? 'bg-blog-bg text-blog-primary shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {category.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Right fade + arrow ── */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-16 rounded-r-2xl pointer-events-none z-10 transition-opacity duration-200 bg-gradient-to-l from-white to-transparent ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <button
            onClick={() => scrollTrack('right')}
            aria-label="Scroll right"
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-200 pointer-events-auto ${
              hasOverflow
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            } ${
              canScrollRight
                ? 'text-gray-600 hover:text-gray-900 hover:shadow-md'
                : 'text-gray-300 cursor-default'
            }`}
          >
            <ChevronRight size={16} />
          </button>

          {/* ── Dropdown (outside scroll container so it isn't clipped) ─
               Recursive NestedMenu handles any depth of children.      ─ */}
          {activeDropdownCategory && dropdown && (
            <div
              className="absolute top-full mt-1 z-50 w-56 bg-white rounded-xl shadow-xl border border-gray-100 animate-fadeInSlow"
              style={{
                left: Math.min(
                  dropdown.left,
                  (outerRef.current?.clientWidth || 0) - 224 // keep inside right edge
                ),
              }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <NestedMenu
                categories={activeDropdownCategory.children!}
                localePrefix={localePrefix}
                activeSlug={activeSlug}
                isActive={isActive}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}