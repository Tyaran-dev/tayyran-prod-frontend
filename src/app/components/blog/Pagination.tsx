import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return page === 1 ? baseUrl : `${baseUrl}${separator}page=${page}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mb-16" aria-label="Pagination">
      {/* Previous Button (Arrow points right in RTL) */}
      {currentPage > 1 ? (
        <Link
          href={getUrl(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-blog-secondary hover:bg-gray-50 hover:border-gray-300 transition-colors"
          aria-label="Previous page"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
          <ChevronRight size={20} />
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-2">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={getUrl(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors ${
                isCurrent
                  ? 'bg-blogGradient text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button (Arrow points left in RTL) */}
      {currentPage < totalPages ? (
        <Link
          href={getUrl(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-blog-secondary hover:bg-gray-50 hover:border-gray-300 transition-colors"
          aria-label="Next page"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
          <ChevronLeft size={20} />
        </div>
      )}
    </nav>
  );
}
