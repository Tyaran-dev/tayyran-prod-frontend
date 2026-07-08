import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  theme?: 'light' | 'dark';
}

export default function Breadcrumb({ items, theme = 'dark' }: BreadcrumbProps) {
  const isLight = theme === 'light';
  
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <Link
                href={item.url}
                className={`text-sm md:text-base font-medium transition-colors ${
                  isLast 
                    ? (isLight ? 'text-white pointer-events-none' : 'text-blog-secondary pointer-events-none') 
                    : (isLight ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-blog-primary')
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.name}
              </Link>
              
              {!isLast && (
                <ChevronLeft 
                  size={16} 
                  className={`mx-1 rtl:rotate-0 ltr:rotate-180 ${isLight ? 'text-white/50' : 'text-gray-400'}`} 
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
