'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

interface ArticleFiltersProps {
    categories: any[];
    primaryColor: string;
    currentCategory?: string;
    onFilterChange?: (search: string, category: string) => void;
}

export default function ArticleFilters({ categories, primaryColor, currentCategory = '', onFilterChange }: ArticleFiltersProps) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onFilterChange) onFilterChange(searchValue, currentCategory);
    };

    const updateFilters = (search: string, category: string) => {
        if (onFilterChange) {
            onFilterChange(search, category);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-12">
            <form onSubmit={handleSearch} className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Buscar artículos..."
                    className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/40 transition-colors placeholder:text-gray-600"
                />
            </form>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                <button
                    onClick={() => updateFilters(searchValue, '')}
                    className={`whitespace-nowrap px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                        !currentCategory
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent border-[#1e1e1e] text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                    style={!currentCategory ? { backgroundColor: primaryColor, borderColor: primaryColor, color: '#000' } : {}}
                >
                    Todos
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.slug}
                        onClick={() => updateFilters(searchValue, cat.slug)}
                        className={`whitespace-nowrap px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                            currentCategory === cat.slug
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent border-[#1e1e1e] text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                        style={currentCategory === cat.slug ? { backgroundColor: primaryColor, borderColor: primaryColor, color: '#000' } : {}}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
