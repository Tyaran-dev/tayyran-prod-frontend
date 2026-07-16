'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // ── scroll detection ────────────────────────────────────────────
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

  // ── dropdown hover helpers (delayed close bridges the gap) ───────
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

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const isActive = (slug: string) => activeSlug === slug;
  const localePrefix = locale ? `/${locale}` : '';
  const activeDropdownCategory = dropdown ? categories.find((c) => c.id === dropdown.id) : null;
  // Show both arrows as a pair whenever any overflow exists; dim the inactive end
  const hasOverflow = canScrollLeft || canScrollRight;

  return (
    <div className="w-full mb-12 relative z-20">
      <div className="container mx-auto px-4">
        {/* Outer pill — position:relative anchor for both arrows and dropdowns */}
        <div ref={outerRef} className="relative bg-white rounded-2xl shadow-sm border border-gray-100">

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
              hasOverflow ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } ${canScrollLeft ? 'text-gray-600 hover:text-gray-900 hover:shadow-md' : 'text-gray-300 cursor-default'}`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* ── Scrollable track ─────────────────────────────────────────
              overflow-x:auto is isolated here. Dropdowns are rendered
              as siblings (outside this div) so they are never clipped. ── */}
          <div
            ref={scrollRef}
            className="flex items-center gap-3 px-4 py-3"
            style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All tab */}
            <Link
              href={`${localePrefix}/blog`}
              className={`flex-none px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                !activeSlug
                  ? 'bg-blogGradient text-white shadow-md scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {allLabel}
            </Link>

            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-none"
                onPointerEnter={(e) => {
                  if (e.pointerType === 'touch') return;
                  if (category.children?.length) openDropdown(category.id, e.currentTarget);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'touch') return;
                  if (category.children?.length) scheduleClose();
                }}
              >
                {category.children && category.children.length > 0 ? (
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        if (dropdown?.id === category.id) {
                          setDropdown(null);
                        } else {
                          openDropdown(category.id, e.currentTarget.closest('.flex-none') as HTMLElement || e.currentTarget);
                        }
                      }}
                      className={`px-3 py-2.5 rounded-l-xl transition-all flex items-center justify-center ${
                        isActive(category.slug) || category.children.some((c) => isActive(c.slug))
                          ? 'bg-blogGradient text-white shadow-md scale-105 opacity-90'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          dropdown?.id === category.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Link
                      href={`${localePrefix}/blog/category/${category.slug}`}
                      className={`px-5 py-2.5 rounded-r-xl font-semibold whitespace-nowrap transition-all flex items-center border-l border-gray-200 ${
                        isActive(category.slug) || category.children.some((c) => isActive(c.slug))
                          ? 'bg-blogGradient text-white shadow-md scale-105'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`${localePrefix}/blog/category/${category.slug}`}
                    className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all block ${
                      isActive(category.slug)
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
              hasOverflow ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } ${canScrollRight ? 'text-gray-600 hover:text-gray-900 hover:shadow-md' : 'text-gray-300 cursor-default'}`}
          >
            <ChevronRight size={16} />
          </button>

          {/* ── Dropdown rendered outside the scroll container ──────────
              This avoids the overflow-x:auto clipping issue. Position is
              calculated relative to the outer pill via getBoundingClientRect. ── */}
          {activeDropdownCategory && dropdown && (
            <div
              className="absolute top-full z-50 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeInSlow"
              style={{ left: dropdown.left }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              {activeDropdownCategory.children!.map((child) => (
                <Link
                  key={child.id}
                  href={`${localePrefix}/blog/category/${child.slug}`}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(child.slug)
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
      </div>
    </div>
  );
}
