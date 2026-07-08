import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-blog-bg px-4 py-20">
      <div className="bg-white p-10 md:p-16 rounded-[30px] shadow-lg text-center max-w-2xl w-full border border-gray-100">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-blog-secondary mb-4">المقال غير موجود</h2>
        <p className="text-gray-600 mb-8 text-lg">
          نأسف، لم نتمكن من العثور على المقال الذي تبحث عنه. قد يكون تم نقله أو حذفه.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="px-8 py-3 bg-blogGradient text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            تصفح أحدث المقالات
          </Link>
        </div>
      </div>
    </div>
  );
}
