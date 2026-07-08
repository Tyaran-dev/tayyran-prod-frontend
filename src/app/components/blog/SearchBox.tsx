'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const t = useTranslations('blog');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center w-full max-w-2xl mx-auto"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchBox.placeholder')}
        className="w-full h-14 pl-4 pr-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20 transition-all text-lg shadow-lg"
      />
      <button
        type="submit"
        className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center text-white hover:scale-110 transition-transform"
        aria-label="Search"
      >
        <Search size={24} />
      </button>
    </form>
  );
}
