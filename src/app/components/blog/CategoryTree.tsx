'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useLocale } from 'next-intl';

interface WPCategory {
    id: number;
    name: string;
    slug: string;
    children?: WPCategory[];
}

interface Props {
    category: WPCategory;
    activeSlug?: string;
    level?: number;
}

export default function CategoryTree({
    category,
    activeSlug,
    level = 0,
}: Props) {
    const locale = useLocale();

    const [open, setOpen] = useState(level === 0);

    const hasChildren =
        category.children && category.children.length > 0;

    const active = activeSlug === category.slug;

    return (
        <div>

            <div
                className={`flex items-center rounded-lg transition hover:bg-gray-100 ${active ? 'bg-blog-bg text-blog-primary font-semibold' : ''
                    }`}
                style={{
                    paddingInlineStart: `${level * 22 + 12}px`,
                }}
            >

                {hasChildren ? (
                    <button
                        onClick={() => setOpen(!open)}
                        className="mr-2"
                    >
                        {open ? (
                            <ChevronDown size={16} />
                        ) : (
                            <ChevronRight size={16} />
                        )}
                    </button>
                ) : (
                    <span className="w-6" />
                )}

                <Folder
                    size={16}
                    className="mx-1 text-blog-primary"
                />

                <Link
                    href={`/${locale}/blog/${category.slug}`}
                    className="flex-1 py-3"
                >
                    {category.name}
                </Link>

            </div>

            {open &&
                hasChildren &&
                category.children!.map((child) => (
                    <CategoryTree
                        key={child.id}
                        category={child}
                        activeSlug={activeSlug}
                        level={level + 1}
                    />
                ))}
        </div>
    );
}