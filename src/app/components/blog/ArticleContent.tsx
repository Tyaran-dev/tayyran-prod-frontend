'use client';

import React, { useEffect, useRef } from 'react';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // --- 1. Handle custom 'saudi-faq-item' FAQ structure ---
    const customFaqItems = contentRef.current.querySelectorAll('.saudi-faq-item');
    customFaqItems.forEach((item) => {
      // Prevent double initialization
      if (item.hasAttribute('data-faq-initialized')) return;
      item.setAttribute('data-faq-initialized', 'true');

      const question = item.querySelector('.saudi-faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Optional: close other items (accordion behavior)
          customFaqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });

          if (isActive) {
            item.classList.remove('active');
          } else {
            item.classList.add('active');
          }
        });
      }
    });

    // --- 2. Handle standard Yoast and RankMath FAQ blocks ---
    const faqSections = contentRef.current.querySelectorAll('.schema-faq-section, .rank-math-list-item, .rank-math-faq-item');
    faqSections.forEach((section) => {
      // Prevent double initialization
      if (section.hasAttribute('data-faq-initialized')) return;
      section.setAttribute('data-faq-initialized', 'true');

      // Style the section wrapper
      const sectionEl = section as HTMLElement;
      sectionEl.style.border = '1px solid #e5e7eb';
      sectionEl.style.borderRadius = '0.75rem';
      sectionEl.style.marginBottom = '1rem';
      sectionEl.style.overflow = 'hidden';
      sectionEl.style.backgroundColor = '#ffffff';

      // Find the specific question and answer within this item
      const question = section.querySelector('.schema-faq-question, .rank-math-question');
      const answer = section.querySelector('.schema-faq-answer, .rank-math-answer');

      if (question && answer) {
        const qEl = question as HTMLElement;
        const aEl = answer as HTMLElement;

        // Check if there's already an inner wrapper in the answer, if not, we can still animate maxHeight
        // But first let's set up the question element styles
        qEl.style.cursor = 'pointer';
        qEl.style.display = 'flex';
        qEl.style.justifyContent = 'space-between';
        qEl.style.alignItems = 'center';
        qEl.style.padding = '1.25rem';
        qEl.style.margin = '0';
        qEl.style.backgroundColor = '#f9fafb';
        qEl.style.fontSize = '1.125rem';
        qEl.style.fontWeight = '600';
        qEl.style.color = '#1f2937';
        qEl.style.transition = 'background-color 0.2s ease';

        // Add a simple chevron icon
        const chevron = document.createElement('span');
        chevron.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        chevron.style.transition = 'transform 0.3s ease';
        chevron.style.flexShrink = '0';
        chevron.style.marginLeft = '1rem';
        qEl.appendChild(chevron);

        // Hover effect
        qEl.addEventListener('mouseenter', () => { qEl.style.backgroundColor = '#f3f4f6'; });
        qEl.addEventListener('mouseleave', () => { qEl.style.backgroundColor = '#f9fafb'; });

        // Initial setup for the answer
        aEl.style.maxHeight = '0';
        aEl.style.opacity = '0';
        aEl.style.overflow = 'hidden';
        aEl.style.padding = '0 1.25rem';
        aEl.style.margin = '0';
        aEl.style.transition = 'all 0.3s ease-in-out';

        // Remove bottom margin of last paragraph in answer to prevent extra spacing
        const lastChild = aEl.lastElementChild as HTMLElement;
        if (lastChild && lastChild.style) {
          lastChild.style.marginBottom = '0';
        }

        let isOpen = false;

        // Toggle logic
        qEl.addEventListener('click', () => {
          isOpen = !isOpen;

          if (isOpen) {
            // Open
            qEl.style.borderBottom = '1px solid #e5e7eb';
            // Set maxHeight to scrollHeight plus some extra padding to ensure it fits
            aEl.style.maxHeight = aEl.scrollHeight + 60 + 'px';
            aEl.style.padding = '1.25rem';
            aEl.style.opacity = '1';
            chevron.style.transform = 'rotate(180deg)';
          } else {
            // Close
            qEl.style.borderBottom = 'none';
            aEl.style.maxHeight = '0';
            aEl.style.padding = '0 1.25rem';
            aEl.style.opacity = '0';
            chevron.style.transform = 'rotate(0deg)';
          }
        });
      }
    });
  }, [content]);

  return (
    <div className="article-content-wrapper">
      <div
        ref={contentRef}
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
