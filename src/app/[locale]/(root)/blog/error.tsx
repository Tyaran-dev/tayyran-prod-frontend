'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-blog-bg px-4 py-20">
      <div className="bg-white p-10 md:p-16 rounded-[30px] shadow-lg text-center max-w-2xl w-full border border-gray-100">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-blog-secondary mb-4">عذراً، حدث خطأ ما</h2>
        <p className="text-gray-600 mb-8 text-lg">
          لم نتمكن من تحميل محتوى المدونة في الوقت الحالي. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-blogGradient text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            المحاولة مرة أخرى
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
