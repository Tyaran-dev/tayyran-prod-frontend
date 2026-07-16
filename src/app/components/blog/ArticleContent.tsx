'use client';

import { useEffect, useRef } from 'react';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const root = contentRef.current;

    // -----------------------------
    // Generic FAQ Initializer
    // -----------------------------
    const initFaq = (
      itemSelector: string,
      questionSelector: string,
      answerSelector: string,
      useActiveClass = false
    ) => {
      const items = root.querySelectorAll<HTMLElement>(itemSelector);

      items.forEach((item) => {
        if (item.dataset.faqInitialized) return;
        item.dataset.faqInitialized = 'true';

        const question = item.querySelector<HTMLElement>(questionSelector);
        const answer = item.querySelector<HTMLElement>(answerSelector);

        if (!question || !answer) return;

        // -----------------------------------
        // Generic Styling
        // -----------------------------------

        item.style.border = '1px solid #e5e7eb';
        item.style.borderRadius = '12px';
        item.style.marginBottom = '16px';
        item.style.overflow = 'hidden';
        item.style.background = '#fff';

        question.style.cursor = 'pointer';
        question.style.display = 'flex';
        question.style.justifyContent = 'space-between';
        question.style.alignItems = 'center';
        question.style.padding = '20px';
        question.style.background = '#f8fafc';
        question.style.fontWeight = '600';
        question.style.transition = 'background .25s';

        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.opacity = '0';
        answer.style.padding = '0 20px';
        answer.style.transition =
          'max-height .35s ease, opacity .35s ease, padding .35s ease';

        const chevron = document.createElement('span');
        chevron.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        `;

        chevron.style.transition = 'transform .3s';
        question.appendChild(chevron);

        let open = false;

        question.addEventListener('click', () => {
          items.forEach((other) => {
            if (other === item) return;

            const otherAnswer = other.querySelector<HTMLElement>(
              answerSelector
            );

            const otherQuestion = other.querySelector<HTMLElement>(
              questionSelector
            );

            if (!otherAnswer || !otherQuestion) return;

            other.classList.remove('active');

            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.opacity = '0';
            otherAnswer.style.padding = '0 20px';

            const icon = otherQuestion.querySelector('span');
            if (icon) {
              (icon as HTMLElement).style.transform = 'rotate(0deg)';
            }
          });

          open = !open;

          if (useActiveClass) {
            item.classList.toggle('active', open);
          }

          if (open) {
            answer.style.maxHeight = answer.scrollHeight + 80 + 'px';
            answer.style.opacity = '1';
            answer.style.padding = '20px';
            chevron.style.transform = 'rotate(180deg)';
          } else {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.padding = '0 20px';
            chevron.style.transform = 'rotate(0deg)';
          }
        });
      });
    };

    // ------------------------------------------------
    // Custom AI FAQ
    // Matches:
    // saudi-faq-item
    // egyptair-faq-item
    // emirates-faq-item
    // etc...
    // ------------------------------------------------

    initFaq(
      '[class$="-faq-item"]',
      '[class$="-faq-question"]',
      '[class$="-faq-answer"]',
      true
    );

    // ------------------------------------------------
    // Rank Math / Yoast FAQ
    // ------------------------------------------------

    initFaq(
      '.schema-faq-section, .rank-math-list-item, .rank-math-faq-item',
      '.schema-faq-question, .rank-math-question',
      '.schema-faq-answer, .rank-math-answer'
    );
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