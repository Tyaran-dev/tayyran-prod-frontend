'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const t = useTranslations('blog');
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Wait a brief moment for HTML to be injected via dangerouslySetInnerHTML
    const timer = setTimeout(() => {
      const contentWrapper = document.querySelector('.article-content-wrapper');
      if (!contentWrapper) return;

      // Find all h2 and h3 elements inside the content
      const headingElements = contentWrapper.querySelectorAll('h2, h3');

      const extractedHeadings: Heading[] = Array.from(headingElements).map((el, index) => {
        // Add an ID to the element if it doesn't have one
        if (!el.id) {
          el.id = `heading-${index}`;
        }

        return {
          id: el.id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3,
        };
      });

      setHeadings(extractedHeadings);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];

      // Find the heading closest to the top of the viewport
      const scrollPosition = window.scrollY + 100; // Offset for fixed header if any

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        if (heading.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
          return;
        }
      }

      // If we're at the very top, set the first one as active
      if (headingElements.length > 0 && window.scrollY < headingElements[0].offsetTop) {
        setActiveId(headingElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll with offset for fixed header
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-blog-secondary mb-4 border-r-4 border-blog-primary pr-3">
        {t('tableOfContents.title')}
      </h3>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${heading.level === 3 ? 'rtl:mr-4 ltr:ml-4' : ''}`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => scrollToHeading(e, heading.id)}
              className={`block text-sm transition-colors ${activeId === heading.id
                  ? 'text-blog-primary font-semibold'
                  : 'text-gray-600 hover:text-blog-primary'
                }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
