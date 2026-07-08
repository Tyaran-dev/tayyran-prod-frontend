import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-blog-bg px-4 py-20">
      <div className="bg-white p-10 md:p-16 rounded-[30px] shadow-lg text-center max-w-2xl w-full border border-gray-100">
        <div className="text-[120px] font-bold text-blog-primary leading-none mb-2 drop-shadow-sm">
          404
        </div>
        
        <h2 className="text-3xl font-bold text-blog-secondary mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-8 text-lg">
          يبدو أنك وصلت إلى مسار غير صحيح، أو أن المقال الذي تبحث عنه قد تم حذفه أو نقله.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="px-8 py-3 bg-blogGradient text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            العودة للمدونة
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
